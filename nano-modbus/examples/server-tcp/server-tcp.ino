/*
   This example application sets up a Modbus TCP server over WiFi and handles requests.
   Supports ESP32 and Arduino UNO R4 WiFi.

   Copy nanomodbus.c and nanomodbus.h into this folder before compiling.

   This server supports the following function codes:
   FC 01 (0x01) Read Coils
   FC 03 (0x03) Read Holding Registers
   FC 15 (0x0F) Write Multiple Coils
   FC 16 (0x10) Write Multiple Registers
*/

#include "nanomodbus.h"

#if defined(ARDUINO_UNOWIFIR4)
#include <WiFiS3.h>
#elif defined(ESP32)
#include <WiFi.h>
#else
#error "This example supports ESP32 and Arduino UNO R4 WiFi only"
#endif

// WiFi credentials
#define WIFI_SSID "your_ssid"
#define WIFI_PASS "your_password"

// Modbus TCP port
#define MODBUS_TCP_PORT 502

// The data model of this server will support coils addresses 0 to 100 and registers addresses from 0 to 32
#define COILS_ADDR_MAX 100
#define REGS_ADDR_MAX 32

// A single nmbs_bitfield variable can keep 2000 coils
nmbs_bitfield server_coils = {0};
uint16_t server_registers[REGS_ADDR_MAX + 1] = {0};

WiFiServer wifiServer(MODBUS_TCP_PORT);
WiFiClient currentClient;


int32_t read_tcp(uint8_t* buf, uint16_t count, int32_t byte_timeout_ms, void* arg) {
    WiFiClient* client = (WiFiClient*) arg;

    unsigned long start = millis();
    unsigned long timeout = (byte_timeout_ms < 0) ? 0xFFFFFFFF : (unsigned long) byte_timeout_ms;

    // Wait for data to become available
    while (client->available() < (int) count) {
        if (millis() - start >= timeout)
            return 0;

        if (!client->connected())
            return -1;

        delay(1);
    }

    return client->readBytes(buf, count);
}


int32_t write_tcp(const uint8_t* buf, uint16_t count, int32_t byte_timeout_ms, void* arg) {
    WiFiClient* client = (WiFiClient*) arg;
    (void) byte_timeout_ms;

    if (!client->connected())
        return -1;

    return client->write(buf, count);
}


void onError(const char* msg) {
    Serial.print("Error: ");
    Serial.println(msg);
    while (true) {
        digitalWrite(LED_BUILTIN, HIGH);
        delay(500);
        digitalWrite(LED_BUILTIN, LOW);
        delay(500);
    }
}


nmbs_error handle_read_coils(uint16_t address, uint16_t quantity, nmbs_bitfield coils_out, uint8_t unit_id, void* arg) {
    if (address + quantity > COILS_ADDR_MAX + 1)
        return NMBS_EXCEPTION_ILLEGAL_DATA_ADDRESS;

    for (int i = 0; i < quantity; i++) {
        bool value = nmbs_bitfield_read(server_coils, address + i);
        nmbs_bitfield_write(coils_out, i, value);
    }

    return NMBS_ERROR_NONE;
}


nmbs_error handle_write_multiple_coils(uint16_t address, uint16_t quantity, const nmbs_bitfield coils, uint8_t unit_id,
                                       void* arg) {
    if (address + quantity > COILS_ADDR_MAX + 1)
        return NMBS_EXCEPTION_ILLEGAL_DATA_ADDRESS;

    for (int i = 0; i < quantity; i++) {
        nmbs_bitfield_write(server_coils, address + i, nmbs_bitfield_read(coils, i));
    }

    return NMBS_ERROR_NONE;
}


nmbs_error handler_read_holding_registers(uint16_t address, uint16_t quantity, uint16_t* registers_out, uint8_t unit_id,
                                          void* arg) {
    if (address + quantity > REGS_ADDR_MAX + 1)
        return NMBS_EXCEPTION_ILLEGAL_DATA_ADDRESS;

    for (int i = 0; i < quantity; i++)
        registers_out[i] = server_registers[address + i];

    return NMBS_ERROR_NONE;
}


nmbs_error handle_write_multiple_registers(uint16_t address, uint16_t quantity, const uint16_t* registers,
                                           uint8_t unit_id, void* arg) {
    if (address + quantity > REGS_ADDR_MAX + 1)
        return NMBS_EXCEPTION_ILLEGAL_DATA_ADDRESS;

    for (int i = 0; i < quantity; i++)
        server_registers[address + i] = registers[i];

    return NMBS_ERROR_NONE;
}


nmbs_t nmbs;
bool nmbs_initialized = false;


void connectWiFi() {
    Serial.print("Connecting to WiFi");
    WiFi.begin(WIFI_SSID, WIFI_PASS);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println();
    Serial.print("Connected, IP: ");
    Serial.println(WiFi.localIP());
}


void setup() {
    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, LOW);

    Serial.begin(115200);
    while (!Serial)
        ;

    connectWiFi();

    // Start the TCP server
    wifiServer.begin();
    Serial.print("Modbus TCP server started on port ");
    Serial.println(MODBUS_TCP_PORT);

    // Set up nanoMODBUS platform
    nmbs_platform_conf platform_conf;
    nmbs_platform_conf_create(&platform_conf);
    platform_conf.transport = NMBS_TRANSPORT_TCP;
    platform_conf.read = read_tcp;
    platform_conf.write = write_tcp;
    platform_conf.arg = &currentClient;

    nmbs_callbacks callbacks;
    nmbs_callbacks_create(&callbacks);
    callbacks.read_coils = handle_read_coils;
    callbacks.write_multiple_coils = handle_write_multiple_coils;
    callbacks.read_holding_registers = handler_read_holding_registers;
    callbacks.write_multiple_registers = handle_write_multiple_registers;

    // Create the modbus server. Address 0 since we are on TCP.
    nmbs_error err = nmbs_server_create(&nmbs, 0, &platform_conf, &callbacks);
    if (err != NMBS_ERROR_NONE)
        onError("nmbs_server_create failed");

    // Set only the response timeout. Byte timeout is handled by TCP.
    nmbs_set_read_timeout(&nmbs, 1000);

    nmbs_initialized = true;
    Serial.println("Waiting for client connections...");
}


void loop() {
    if (!nmbs_initialized)
        return;

    // Check for new client connections
    WiFiClient newClient = wifiServer.available();
    if (newClient) {
        currentClient = newClient;
        Serial.print("Client connected from ");
        Serial.println(currentClient.remoteIP());
    }

    // Process requests from connected client
    if (currentClient && currentClient.connected()) {
        if (currentClient.available()) {
            nmbs_error err = nmbs_server_poll(&nmbs);
            if (err == NMBS_ERROR_TRANSPORT) {
                Serial.println("Client disconnected (transport error)");
                currentClient.stop();
            }
        }
        // Toggle LED to show activity
        digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
    }
    else if (currentClient) {
        // Client was connected but is now disconnected
        Serial.println("Client disconnected");
        currentClient.stop();
    }

    delay(10);
}

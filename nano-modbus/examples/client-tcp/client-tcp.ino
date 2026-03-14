/*
   This example client application connects via TCP to a modbus server and sends some requests.
   Supports ESP32 and Arduino UNO R4 WiFi.

   Copy nanomodbus.c and nanomodbus.h into this folder before compiling.
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

// Modbus TCP server address and port
#define SERVER_IP "192.168.1.100"
#define SERVER_PORT 502

WiFiClient tcpClient;


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
    // Blink LED on error
    while (true) {
        digitalWrite(LED_BUILTIN, HIGH);
        delay(500);
        digitalWrite(LED_BUILTIN, LOW);
        delay(500);
    }
}


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

    // Connect to the modbus TCP server
    if (!tcpClient.connect(SERVER_IP, SERVER_PORT))
        onError("Cannot connect to server");

    Serial.println("Connected to Modbus TCP server");

    // Set up nanoMODBUS platform
    nmbs_platform_conf platform_conf;
    nmbs_platform_conf_create(&platform_conf);
    platform_conf.transport = NMBS_TRANSPORT_TCP;
    platform_conf.read = read_tcp;
    platform_conf.write = write_tcp;
    platform_conf.arg = &tcpClient;

    nmbs_t nmbs;
    nmbs_error err = nmbs_client_create(&nmbs, &platform_conf);
    if (err != NMBS_ERROR_NONE)
        onError("nmbs_client_create failed");

    // Set only the response timeout. Byte timeout is handled by TCP.
    nmbs_set_read_timeout(&nmbs, 1000);

    // Write 2 coils from address 64
    nmbs_bitfield coils = {0};
    nmbs_bitfield_write(coils, 0, 1);
    nmbs_bitfield_write(coils, 1, 1);
    err = nmbs_write_multiple_coils(&nmbs, 64, 2, coils);
    if (err != NMBS_ERROR_NONE)
        onError("Write coils failed");

    Serial.println("Written coils at address 64");

    // Read 3 coils from address 64
    nmbs_bitfield_reset(coils);
    err = nmbs_read_coils(&nmbs, 64, 3, coils);
    if (err != NMBS_ERROR_NONE)
        onError("Read coils failed");

    Serial.print("Coil 64: ");
    Serial.println(nmbs_bitfield_read(coils, 0));
    Serial.print("Coil 65: ");
    Serial.println(nmbs_bitfield_read(coils, 1));
    Serial.print("Coil 66: ");
    Serial.println(nmbs_bitfield_read(coils, 2));

    // Write 2 holding registers at address 26
    uint16_t w_regs[2] = {123, 124};
    err = nmbs_write_multiple_registers(&nmbs, 26, 2, w_regs);
    if (err != NMBS_ERROR_NONE)
        onError("Write registers failed");

    Serial.println("Written registers at address 26");

    // Read 2 holding registers from address 26
    uint16_t r_regs[2];
    err = nmbs_read_holding_registers(&nmbs, 26, 2, r_regs);
    if (err != NMBS_ERROR_NONE)
        onError("Read registers failed");

    Serial.print("Register 26: ");
    Serial.println(r_regs[0]);
    Serial.print("Register 27: ");
    Serial.println(r_regs[1]);

    // On success, keep the LED on
    digitalWrite(LED_BUILTIN, HIGH);
    Serial.println("All requests completed successfully");

    tcpClient.stop();
}


void loop() {
    // Nothing to do
}

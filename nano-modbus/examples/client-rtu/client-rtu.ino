/*
   This example client application connects via RTU to a server and sends some requests to it.
*/

#include "nanomodbus.h"

// The server address
#define RTU_SERVER_ADDRESS 1


int32_t read_serial(uint8_t* buf, uint16_t count, int32_t byte_timeout_ms, void* arg) {
  Serial.setTimeout(byte_timeout_ms);
  return Serial.readBytes(buf, count);
}


int32_t write_serial(const uint8_t* buf, uint16_t count, int32_t byte_timeout_ms, void* arg) {
  Serial.setTimeout(byte_timeout_ms);
  return Serial.write(buf, count);
}


void onError() {
  // Make the LED blink on error
  while (true) {
    digitalWrite(LED_BUILTIN, HIGH);
    delay(1000);
    digitalWrite(LED_BUILTIN, LOW);
    delay(1000);
  }
}


void setup() {
  pinMode (LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);

  Serial.begin(9600);
  while (!Serial);
}


void loop() {
  nmbs_platform_conf platform_conf;
  nmbs_platform_conf_create(&platform_conf);
  platform_conf.transport = NMBS_TRANSPORT_RTU;
  platform_conf.read = read_serial;
  platform_conf.write = write_serial;

  nmbs_t nmbs;
  nmbs_error err = nmbs_client_create(&nmbs, &platform_conf);
  if (err != NMBS_ERROR_NONE)
    onError();

  nmbs_set_read_timeout(&nmbs, 1000);
  nmbs_set_byte_timeout(&nmbs, 100);

  nmbs_set_destination_rtu_address(&nmbs, RTU_SERVER_ADDRESS);

  // Write 2 coils from address 64
  nmbs_bitfield coils = {0};
  nmbs_bitfield_write(coils, 0, 1);
  nmbs_bitfield_write(coils, 1, 1);
  err = nmbs_write_multiple_coils(&nmbs, 64, 2, coils);
  if (err != NMBS_ERROR_NONE)
    onError();

  // Read 3 coils from address 64
  nmbs_bitfield_reset(coils);    // Reset whole bitfield to zero
  err = nmbs_read_coils(&nmbs, 64, 3, coils);
  if (err != NMBS_ERROR_NONE)
    onError();

  // Write 2 holding registers at address 26
  uint16_t w_regs[2] = {123, 124};
  err = nmbs_write_multiple_registers(&nmbs, 26, 2, w_regs);
  if (err != NMBS_ERROR_NONE)
    onError();

  // Read 2 holding registers from address 26
  uint16_t r_regs[2];
  err = nmbs_read_holding_registers(&nmbs, 26, 2, r_regs);
  if (err != NMBS_ERROR_NONE)
    onError();

  // On success, keep the led on
  digitalWrite(LED_BUILTIN, HIGH);

  // No need to destroy the nmbs instance, terminate the program
  exit(0);
}

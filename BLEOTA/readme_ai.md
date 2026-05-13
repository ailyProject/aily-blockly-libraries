# BLEOTA

ESP32 BLE firmware and filesystem OTA update blocks.

## Library Info
- **Name**: @aily-project/lib-bleota
- **Version**: 1.0.6

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bleota_begin_auto` | Statement | DEVICE_NAME(input_value) | `bleota_begin_auto(text("ESP32-BLE-OTA"))` | Creates default `BLEOTA` and `pServer`, starts advertising, auto-processes in loop |
| `bleota_setup` | Statement | VAR(field_input), SERVER_VAR(field_input), DEVICE_NAME(input_value), SECURE(dropdown) | `bleota_setup("BLEOTA", "pServer", text("ESP32-BLE-OTA"), false)` | `BLEDevice::init(...); pServer = BLEDevice::createServer(); BLEOTA.begin(pServer, secure);` |
| `bleota_set_public_key` | Statement | VAR(field_variable), KEY(input_value) | `bleota_set_public_key(variables_get($BLEOTA), text("public key"))` | `bleota_set_public_key(BLEOTA, key);` |
| `bleota_set_device_info` | Statement | VAR(field_variable), INFO(dropdown), VALUE(input_value) | `bleota_set_device_info(variables_get($BLEOTA), FW_VERSION, text("1.0.0"))` | `BLEOTA.setFWVersion("1.0.0");` |
| `bleota_start_service` | Statement | VAR(field_variable), SERVER(field_variable), SCAN_RESPONSE(dropdown), AUTO_RESET(dropdown) | `bleota_start_service(variables_get($BLEOTA), variables_get($pServer), false, true)` | `BLEOTA.init(); BLEDevice::startAdvertising();` |
| `bleota_process` | Statement | VAR(field_variable), RESET(dropdown) | `bleota_process(variables_get($BLEOTA), true)` | `BLEOTA.process(true);` |
| `bleota_abort` | Statement | VAR(field_variable) | `bleota_abort(variables_get($BLEOTA))` | `BLEOTA.abort();` |
| `bleota_is_running` | Value | VAR(field_variable) | `bleota_is_running(variables_get($BLEOTA))` | `BLEOTA.isRunning()` |
| `bleota_progress` | Value | VAR(field_variable) | `bleota_progress(variables_get($BLEOTA))` | `BLEOTA.progress()` |
| `bleota_uuid` | Value | VAR(field_variable) | `bleota_uuid(variables_get($BLEOTA))` | `BLEOTA.getBLEOTAuuid()` |
| `bleota_on_events` | Hat | VAR(field_variable), BEFORE_OTA(input_statement), BEFORE_SPIFFS(input_statement), AFTER_STOP(input_statement), AFTER_ABORT(input_statement) | `bleota_on_events(variables_get($BLEOTA)) @BEFORE_OTA: ...` | Generates a `BLEOTACallbacks` subclass |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SECURE | `false`, `true` | Enable signed update verification |
| INFO | `MODEL`, `SERIAL_NUMBER`, `FW_VERSION`, `HW_VERSION`, `MANUFACTURER` | DIS device information field |
| SCAN_RESPONSE | `false`, `true` | BLE advertising scan response |
| AUTO_RESET / RESET | `true`, `false` | Reboot automatically after a successful update |

## ABS Examples

### Basic Usage
```
arduino_setup()
    bleota_begin_auto(text("ESP32-BLE-OTA"))

arduino_loop()
    time_delay(math_number(20))
```

### Secure Usage
```
arduino_setup()
    bleota_setup("BLEOTA", "pServer", text("ESP32-Secure-OTA"), true)
    bleota_set_public_key(variables_get($BLEOTA), text("-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"))
    bleota_set_device_info(variables_get($BLEOTA), FW_VERSION, text("1.0.0"))
    bleota_start_service(variables_get($BLEOTA), variables_get($pServer), false, true)
```

## Notes

1. Place setup/start blocks in `arduino_setup()`.
2. `bleota_start_service` auto-adds a loop helper, so manual `bleota_process` is only needed for custom flows.
3. Secure mode requires a public key and signed `.bin` image.
4. The upstream method name `setManufactuer` keeps the original library spelling.

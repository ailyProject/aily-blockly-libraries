# ESP32 BLE

ESP32 Bluetooth Low Energy (BLE) library supports server, client, scanning and UART communication functions

## Library Info
- **Name**: @aily-project/lib-esp32-ble
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_ble_init` | Statement | NAME(input_value) | `esp32_ble_init(text("value"))` | BLEDevice::init( |
| `esp32_ble_deinit` | Statement | RELEASE_MEMORY(dropdown) | `esp32_ble_deinit(false)` | BLEDevice::deinit( |
| `esp32_ble_get_address` | Value | (none) | `esp32_ble_get_address()` | BLEDevice::getAddress().toString().c_str() |
| `esp32_ble_set_mtu` | Statement | MTU(input_value) | `esp32_ble_set_mtu(math_number(0))` | BLEDevice::setMTU( |
| `esp32_ble_get_mtu` | Value | (none) | `esp32_ble_get_mtu()` | BLEDevice::getMTU() |
| `esp32_ble_create_server` | Statement | VAR(field_input) | `esp32_ble_create_server("pServer")` | Dynamic code |
| `esp32_ble_server_create_service` | Statement | SERVER(field_variable), SERVICE_VAR(field_input), UUID(input_value) | `esp32_ble_server_create_service(variables_get($pServer), "pService", text("value"))` | Dynamic code |
| `esp32_ble_service_start` | Statement | SERVICE(field_variable) | `esp32_ble_service_start(variables_get($pService))` | Dynamic code |
| `esp32_ble_service_stop` | Statement | SERVICE(field_variable) | `esp32_ble_service_stop(variables_get($pService))` | Dynamic code |
| `esp32_ble_create_characteristic` | Statement | SERVICE(field_variable), CHAR_VAR(field_input), UUID(input_value), PROPERTIES(dropdown) | `esp32_ble_create_characteristic(variables_get($pService), "pCharacteristic", text("value"), BLECharacteristic::PROPERTY_READ)` | Dynamic code |
| `esp32_ble_characteristic_set_value` | Statement | CHAR(field_variable), VALUE(input_value) | `esp32_ble_characteristic_set_value(variables_get($pCharacteristic), math_number(0))` | Dynamic code |
| `esp32_ble_characteristic_get_value` | Value | CHAR(field_variable) | `esp32_ble_characteristic_get_value(variables_get($pCharacteristic))` | Dynamic code |
| `esp32_ble_characteristic_notify` | Statement | CHAR(field_variable) | `esp32_ble_characteristic_notify(variables_get($pCharacteristic))` | Dynamic code |
| `esp32_ble_characteristic_indicate` | Statement | CHAR(field_variable) | `esp32_ble_characteristic_indicate(variables_get($pCharacteristic))` | Dynamic code |
| `esp32_ble_add_descriptor` | Statement | CHAR(field_variable) | `esp32_ble_add_descriptor(variables_get($pCharacteristic))` | Dynamic code |
| `esp32_ble_start_advertising` | Statement | (none) | `esp32_ble_start_advertising()` | BLEDevice::startAdvertising();\n |
| `esp32_ble_stop_advertising` | Statement | (none) | `esp32_ble_stop_advertising()` | BLEDevice::stopAdvertising();\n |
| `esp32_ble_advertising_add_service_uuid` | Statement | UUID(input_value) | `esp32_ble_advertising_add_service_uuid(text("value"))` | BLEDevice::getAdvertising()->addServiceUUID( |
| `esp32_ble_advertising_set_scan_response` | Statement | ENABLED(dropdown) | `esp32_ble_advertising_set_scan_response(true)` | BLEDevice::getAdvertising()->setScanResponse( |
| `esp32_ble_on_connect` | Hat | SERVER(field_variable), HANDLER(input_statement) | `esp32_ble_on_connect(variables_get($pServer)) @HANDLER: child_block()` | Dynamic code |
| `esp32_ble_on_disconnect` | Hat | SERVER(field_variable), HANDLER(input_statement) | `esp32_ble_on_disconnect(variables_get($pServer)) @HANDLER: child_block()` | Dynamic code |
| `esp32_ble_on_write` | Hat | CHAR(field_variable), HANDLER(input_statement) | `esp32_ble_on_write(variables_get($pCharacteristic)) @HANDLER: child_block()` | Dynamic code |
| `esp32_ble_server_connected_count` | Value | SERVER(field_variable) | `esp32_ble_server_connected_count(variables_get($pServer))` | Dynamic code |
| `esp32_ble_create_client` | Statement | VAR(field_input) | `esp32_ble_create_client("pClient")` | Dynamic code |
| `esp32_ble_client_connect` | Statement | CLIENT(field_variable), ADDRESS(input_value) | `esp32_ble_client_connect(variables_get($pClient), text("value"))` | Dynamic code |
| `esp32_ble_client_disconnect` | Statement | CLIENT(field_variable) | `esp32_ble_client_disconnect(variables_get($pClient))` | Dynamic code |
| `esp32_ble_client_is_connected` | Value | CLIENT(field_variable) | `esp32_ble_client_is_connected(variables_get($pClient))` | Dynamic code |
| `esp32_ble_client_get_service` | Statement | CLIENT(field_variable), SERVICE_VAR(field_input), UUID(input_value) | `esp32_ble_client_get_service(variables_get($pClient), "pRemoteService", text("value"))` | Dynamic code |
| `esp32_ble_remote_service_get_characteristic` | Statement | SERVICE(field_variable), CHAR_VAR(field_input), UUID(input_value) | `esp32_ble_remote_service_get_characteristic(variables_get($pRemoteService), "pRemoteCharacteristic", text("value"))` | Dynamic code |
| `esp32_ble_remote_characteristic_read` | Value | CHAR(field_variable) | `esp32_ble_remote_characteristic_read(variables_get($pRemoteCharacteristic))` | Dynamic code |
| `esp32_ble_remote_characteristic_write` | Statement | CHAR(field_variable), VALUE(input_value) | `esp32_ble_remote_characteristic_write(variables_get($pRemoteCharacteristic), math_number(0))` | Dynamic code |
| `esp32_ble_remote_characteristic_can_read` | Value | CHAR(field_variable) | `esp32_ble_remote_characteristic_can_read(variables_get($pRemoteCharacteristic))` | Dynamic code |
| `esp32_ble_remote_characteristic_can_notify` | Value | CHAR(field_variable) | `esp32_ble_remote_characteristic_can_notify(variables_get($pRemoteCharacteristic))` | Dynamic code |
| `esp32_ble_get_scan` | Statement | VAR(field_input) | `esp32_ble_get_scan("pBLEScan")` | Dynamic code |
| `esp32_ble_scan_set_active` | Statement | SCAN(field_variable), ACTIVE(dropdown) | `esp32_ble_scan_set_active(variables_get($pBLEScan), true)` | Dynamic code |
| `esp32_ble_scan_set_interval` | Statement | SCAN(field_variable), INTERVAL(input_value) | `esp32_ble_scan_set_interval(variables_get($pBLEScan), math_number(1000))` | Dynamic code |
| `esp32_ble_scan_set_window` | Statement | SCAN(field_variable), WINDOW(input_value) | `esp32_ble_scan_set_window(variables_get($pBLEScan), math_number(0))` | Dynamic code |
| `esp32_ble_scan_start` | Statement | SCAN(field_variable), DURATION(input_value) | `esp32_ble_scan_start(variables_get($pBLEScan), math_number(1000))` | bleScanResults = |
| `esp32_ble_scan_stop` | Statement | SCAN(field_variable) | `esp32_ble_scan_stop(variables_get($pBLEScan))` | Dynamic code |
| `esp32_ble_scan_get_results` | Value | SCAN(field_variable) | `esp32_ble_scan_get_results(variables_get($pBLEScan))` | Dynamic code |
| `esp32_ble_scan_results_count` | Value | RESULTS(input_value) | `esp32_ble_scan_results_count(math_number(0))` | Dynamic code |
| `esp32_ble_scan_results_get_device` | Value | RESULTS(input_value), INDEX(input_value) | `esp32_ble_scan_results_get_device(math_number(0), math_number(0))` | Dynamic code |
| `esp32_ble_advertised_device_name` | Value | DEVICE(input_value) | `esp32_ble_advertised_device_name(math_number(0))` | Dynamic code |
| `esp32_ble_advertised_device_address` | Value | DEVICE(input_value) | `esp32_ble_advertised_device_address(math_number(0))` | Dynamic code |
| `esp32_ble_advertised_device_rssi` | Value | DEVICE(input_value) | `esp32_ble_advertised_device_rssi(math_number(0))` | Dynamic code |
| `esp32_ble_scan_clear_results` | Statement | SCAN(field_variable) | `esp32_ble_scan_clear_results(variables_get($pBLEScan))` | Dynamic code |
| `esp32_ble_uart_server_quick` | Statement | NAME(input_value) | `esp32_ble_uart_server_quick(text("value"))` | Dynamic code |
| `esp32_ble_uart_send` | Statement | DATA(input_value) | `esp32_ble_uart_send(math_number(0))` | Dynamic code |
| `esp32_ble_uart_on_receive` | Hat | HANDLER(input_statement) | `esp32_ble_uart_on_receive() @HANDLER: child_block()` | Dynamic code |
| `esp32_ble_uart_received_data` | Value | (none) | `esp32_ble_uart_received_data()` | ble_uart_received_data |
| `esp32_ble_uart_is_connected` | Value | (none) | `esp32_ble_uart_is_connected()` | ble_uart_connected |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| RELEASE_MEMORY | false, true | esp32_ble_deinit |
| PROPERTIES | BLECharacteristic::PROPERTY_READ, BLECharacteristic::PROPERTY_WRITE, BLECharacteristic::PROPERTY_NOTIFY, BLECharacteristic::PROPERTY_READ &#124; BLECharacteristic::PROPERTY_WRITE, BLECharacteristic::PROPERTY_READ &#124; BLEChar... | esp32_ble_create_characteristic |
| ENABLED | true, false | esp32_ble_advertising_set_scan_response |
| ACTIVE | true, false | esp32_ble_scan_set_active |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_ble_init(text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_ble_get_address())
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `esp32_ble_create_server("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

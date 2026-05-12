# NimBLEBluetooth

ESP32 Bluetooth Low Energy (BLE) library supports server and client modes

## Library Info
- **Name**: @aily-project/lib-nimble
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `nimble_init` | Statement | NAME(input_value) | `nimble_init(text("value"))` | NimBLEDevice::init( |
| `nimble_deinit` | Statement | CLEAR_ALL(field_checkbox) | `nimble_deinit(FALSE)` | NimBLEDevice::deinit( |
| `nimble_create_server` | Statement | VAR(field_input) | `nimble_create_server("pServer")` | Dynamic code |
| `nimble_server_create_service` | Statement | SERVER(field_variable), UUID(input_value), SERVICE_VAR(field_input) | `nimble_server_create_service(variables_get($pServer), text("value"), "pService")` | Dynamic code |
| `nimble_service_create_characteristic` | Statement | SERVICE(field_variable), UUID(input_value), CHAR_VAR(field_input) | `nimble_service_create_characteristic(variables_get($pService), text("value"), "pCharacteristic")` | Dynamic code |
| `nimble_service_create_characteristic_props` | Statement | SERVICE(field_variable), UUID(input_value), PROPERTIES(dropdown), CHAR_VAR(field_input) | `nimble_service_create_characteristic_props(variables_get($pService), text("value"), READ_WRITE, "pCharacteristic")` | Dynamic code |
| `nimble_characteristic_set_value` | Statement | CHAR(field_variable), VALUE(input_value) | `nimble_characteristic_set_value(variables_get($pCharacteristic), math_number(0))` | Dynamic code |
| `nimble_characteristic_get_value` | Value | CHAR(field_variable) | `nimble_characteristic_get_value(variables_get($pCharacteristic))` | String( |
| `nimble_characteristic_notify` | Statement | CHAR(field_variable) | `nimble_characteristic_notify(variables_get($pCharacteristic))` | Dynamic code |
| `nimble_service_start` | Statement | SERVICE(field_variable) | `nimble_service_start(variables_get($pService))` | Dynamic code |
| `nimble_start_advertising` | Statement | (none) | `nimble_start_advertising()` | NimBLEDevice::startAdvertising();\n |
| `nimble_stop_advertising` | Statement | (none) | `nimble_stop_advertising()` | NimBLEDevice::getAdvertising()->stop();\n |
| `nimble_advertising_add_service` | Statement | UUID(input_value) | `nimble_advertising_add_service(text("value"))` | NimBLEDevice::getAdvertising()->addServiceUUID( |
| `nimble_advertising_set_name` | Statement | NAME(input_value) | `nimble_advertising_set_name(text("value"))` | NimBLEDevice::getAdvertising()->setName( |
| `nimble_server_connected_count` | Value | SERVER(field_variable) | `nimble_server_connected_count(variables_get($pServer))` | Dynamic code |
| `nimble_on_connect` | Hat | SERVER(field_variable), HANDLER(input_statement) | `nimble_on_connect(variables_get($pServer)) @HANDLER: child_block()` | Dynamic code |
| `nimble_on_disconnect` | Hat | SERVER(field_variable), HANDLER(input_statement) | `nimble_on_disconnect(variables_get($pServer)) @HANDLER: child_block()` | Dynamic code |
| `nimble_on_characteristic_write` | Hat | CHAR(field_variable), HANDLER(input_statement) | `nimble_on_characteristic_write(variables_get($pCharacteristic)) @HANDLER: child_block()` | Dynamic code |
| `nimble_start_scan` | Statement | DURATION(input_value) | `nimble_start_scan(math_number(1000))` | NimBLEDevice::getScan()->start( |
| `nimble_stop_scan` | Statement | (none) | `nimble_stop_scan()` | NimBLEDevice::getScan()->stop();\n |
| `nimble_is_scanning` | Value | (none) | `nimble_is_scanning()` | NimBLEDevice::getScan()->isScanning() |
| `nimble_on_scan_result` | Hat | HANDLER(input_statement) | `nimble_on_scan_result() @HANDLER: child_block()` | Dynamic code |
| `nimble_scan_device_name` | Value | (none) | `nimble_scan_device_name()` | String(scanDevice->getName().c_str()) |
| `nimble_scan_device_address` | Value | (none) | `nimble_scan_device_address()` | String(scanDevice->getAddress().toString().c_str()) |
| `nimble_scan_device_rssi` | Value | (none) | `nimble_scan_device_rssi()` | scanDevice->getRSSI() |
| `nimble_scan_device_has_service` | Value | UUID(input_value) | `nimble_scan_device_has_service(text("value"))` | scanDevice->isAdvertisingService(NimBLEUUID( |
| `nimble_create_client` | Statement | VAR(field_input) | `nimble_create_client("pClient")` | Dynamic code |
| `nimble_client_connect_address` | Value | CLIENT(field_variable), ADDRESS(input_value) | `nimble_client_connect_address(variables_get($pClient), text("value"))` | Dynamic code |
| `nimble_client_connect_device` | Value | CLIENT(field_variable) | `nimble_client_connect_device(variables_get($pClient))` | Dynamic code |
| `nimble_client_disconnect` | Statement | CLIENT(field_variable) | `nimble_client_disconnect(variables_get($pClient))` | Dynamic code |
| `nimble_client_is_connected` | Value | CLIENT(field_variable) | `nimble_client_is_connected(variables_get($pClient))` | Dynamic code |
| `nimble_client_get_service` | Statement | CLIENT(field_variable), UUID(input_value), SERVICE_VAR(field_input) | `nimble_client_get_service(variables_get($pClient), text("value"), "pRemoteService")` | Dynamic code |
| `nimble_remote_service_get_characteristic` | Statement | SERVICE(field_variable), UUID(input_value), CHAR_VAR(field_input) | `nimble_remote_service_get_characteristic(variables_get($pRemoteService), text("value"), "pRemoteChar")` | Dynamic code |
| `nimble_remote_char_read` | Value | CHAR(field_variable) | `nimble_remote_char_read(variables_get($pRemoteChar))` | String( |
| `nimble_remote_char_write` | Statement | CHAR(field_variable), VALUE(input_value) | `nimble_remote_char_write(variables_get($pRemoteChar), math_number(0))` | Dynamic code |
| `nimble_remote_char_subscribe` | Hat | CHAR(field_variable), HANDLER(input_statement) | `nimble_remote_char_subscribe(variables_get($pRemoteChar)) @HANDLER: child_block()` | Dynamic code |
| `nimble_notify_data` | Value | (none) | `nimble_notify_data()` | notifyData |
| `nimble_get_address` | Value | (none) | `nimble_get_address()` | String(NimBLEDevice::getAddress().toString().c_str()) |
| `nimble_set_mtu` | Statement | MTU(input_value) | `nimble_set_mtu(math_number(0))` | NimBLEDevice::setMTU( |
| `nimble_set_power` | Statement | POWER(dropdown) | `nimble_set_power("-12")` | NimBLEDevice::setPower( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PROPERTIES | READ_WRITE, READ, WRITE, READ_NOTIFY, READ_WRITE_NOTIFY, READ_WRITE_INDICATE | nimble_service_create_characteristic_props |
| POWER | -12, -9, -6, -3, 0, 3, 6, 9 | nimble_set_power |

## ABS Examples

### Basic Usage
```
arduino_setup()
    nimble_init(text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, nimble_characteristic_get_value(variables_get($pCharacteristic)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `nimble_create_server("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

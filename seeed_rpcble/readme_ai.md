# Seeed RPC BLE

Blockly wrapper for Seeed Wio Terminal rpcBLE with BLE server, client, scan, UART, Web Bluetooth battery service, and iBeacon support.

## Library Info
- **Name**: @aily-project/lib-seeed-rpcble
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_rpcble_init` | Statement | NAME(input_value) | `seeed_rpcble_init(text("value"))` | BLEDevice::init(String( |
| `seeed_rpcble_deinit` | Statement | (none) | `seeed_rpcble_deinit()` | BLEDevice::deinit();\n |
| `seeed_rpcble_is_initialized` | Value | (none) | `seeed_rpcble_is_initialized()` | BLEDevice::getInitialized() |
| `seeed_rpcble_get_address` | Value | (none) | `seeed_rpcble_get_address()` | String(BLEDevice::getAddress().toString().c_str()) |
| `seeed_rpcble_set_mtu` | Statement | MTU(input_value) | `seeed_rpcble_set_mtu(math_number(0))` | BLEDevice::setMTU( |
| `seeed_rpcble_get_mtu` | Value | (none) | `seeed_rpcble_get_mtu()` | BLEDevice::getMTU() |
| `seeed_rpcble_create_server` | Statement | VAR(field_input) | `seeed_rpcble_create_server("pServer")` | Dynamic code |
| `seeed_rpcble_server_create_service` | Statement | SERVER(field_variable), SERVICE_VAR(field_input), UUID(input_value) | `seeed_rpcble_server_create_service(variables_get($pServer), "pService", text("value"))` | Dynamic code |
| `seeed_rpcble_service_start` | Statement | VAR(field_variable) | `seeed_rpcble_service_start(variables_get($pService))` | Dynamic code |
| `seeed_rpcble_service_stop` | Statement | VAR(field_variable) | `seeed_rpcble_service_stop(variables_get($pService))` | Dynamic code |
| `seeed_rpcble_server_connected_count` | Value | VAR(field_variable) | `seeed_rpcble_server_connected_count(variables_get($pServer))` | Dynamic code |
| `seeed_rpcble_server_set_callbacks` | Statement | VAR(field_variable), ON_CONNECT(input_statement), ON_DISCONNECT(input_statement) | `seeed_rpcble_server_set_callbacks(variables_get($pServer)) @ON_CONNECT: child_block() @ON_DISCONNECT: child_block()` | Dynamic code |
| `seeed_rpcble_create_characteristic` | Statement | SERVICE(field_variable), CHAR_VAR(field_input), UUID(input_value), PROPERTIES(dropdown) | `seeed_rpcble_create_characteristic(variables_get($pService), "pCharacteristic", text("value"), BLECharacteristic::PROPERTY_READ)` | Dynamic code |
| `seeed_rpcble_characteristic_set_permissions` | Statement | VAR(field_variable), PERMISSIONS(dropdown) | `seeed_rpcble_characteristic_set_permissions(variables_get($pCharacteristic), GATT_PERM_READ)` | Dynamic code |
| `seeed_rpcble_characteristic_add_notify_descriptor` | Statement | VAR(field_variable) | `seeed_rpcble_characteristic_add_notify_descriptor(variables_get($pCharacteristic))` | Dynamic code |
| `seeed_rpcble_characteristic_add_descriptor` | Statement | VAR(field_variable), UUID(input_value), FLAGS(dropdown), PERMISSIONS(dropdown), MAX_LEN(input_value) | `seeed_rpcble_characteristic_add_descriptor(variables_get($pCharacteristic), text("value"), "ATTRIB_FLAG_VOID &#124; ATTRIB_FLAG_ASCII_Z", GATT_PERM_READ, math_number(0))` | Dynamic code |
| `seeed_rpcble_characteristic_set_value` | Statement | VAR(field_variable), VALUE(input_value) | `seeed_rpcble_characteristic_set_value(variables_get($pCharacteristic), text("value"))` | Dynamic code |
| `seeed_rpcble_characteristic_set_byte` | Statement | VAR(field_variable), VALUE(input_value) | `seeed_rpcble_characteristic_set_byte(variables_get($pCharacteristic), math_number(0))` | {\n uint8_t seeedRpcBleByteValue = (uint8_t)( |
| `seeed_rpcble_characteristic_get_value` | Value | VAR(field_variable) | `seeed_rpcble_characteristic_get_value(variables_get($pCharacteristic))` | String( |
| `seeed_rpcble_characteristic_notify` | Statement | VAR(field_variable) | `seeed_rpcble_characteristic_notify(variables_get($pCharacteristic))` | Dynamic code |
| `seeed_rpcble_characteristic_indicate` | Statement | VAR(field_variable) | `seeed_rpcble_characteristic_indicate(variables_get($pCharacteristic))` | Dynamic code |
| `seeed_rpcble_characteristic_set_callbacks` | Statement | VAR(field_variable), HANDLER(input_statement) | `seeed_rpcble_characteristic_set_callbacks(variables_get($pCharacteristic)) @HANDLER: child_block()` | Dynamic code |
| `seeed_rpcble_characteristic_received_value` | Value | VAR(field_variable) | `seeed_rpcble_characteristic_received_value(variables_get($pCharacteristic))` | Dynamic code |
| `seeed_rpcble_advertising_add_service_uuid` | Statement | UUID(input_value) | `seeed_rpcble_advertising_add_service_uuid(text("value"))` | BLEDevice::getAdvertising()->addServiceUUID(String( |
| `seeed_rpcble_advertising_set_scan_response` | Statement | ENABLE(dropdown) | `seeed_rpcble_advertising_set_scan_response(TRUE)` | BLEDevice::getAdvertising()->setScanResponse( |
| `seeed_rpcble_advertising_set_preferred` | Statement | MIN(input_value), MAX(input_value) | `seeed_rpcble_advertising_set_preferred(math_number(0), math_number(0))` | BLEDevice::getAdvertising()->setMinPreferred( |
| `seeed_rpcble_start_advertising` | Statement | (none) | `seeed_rpcble_start_advertising()` | BLEDevice::startAdvertising();\n |
| `seeed_rpcble_stop_advertising` | Statement | (none) | `seeed_rpcble_stop_advertising()` | BLEDevice::stopAdvertising();\n |
| `seeed_rpcble_scan_create` | Statement | VAR(field_input) | `seeed_rpcble_scan_create("pBLEScan")` | Dynamic code |
| `seeed_rpcble_scan_set_active` | Statement | VAR(field_variable), ACTIVE(dropdown) | `seeed_rpcble_scan_set_active(variables_get($pBLEScan), TRUE)` | Dynamic code |
| `seeed_rpcble_scan_set_interval` | Statement | VAR(field_variable), INTERVAL(input_value) | `seeed_rpcble_scan_set_interval(variables_get($pBLEScan), math_number(1000))` | Dynamic code |
| `seeed_rpcble_scan_set_window` | Statement | VAR(field_variable), WINDOW(input_value) | `seeed_rpcble_scan_set_window(variables_get($pBLEScan), math_number(0))` | Dynamic code |
| `seeed_rpcble_scan_start` | Statement | SCAN(field_variable), DURATION(input_value), RESULT_VAR(field_input), CONTINUE(dropdown) | `seeed_rpcble_scan_start(variables_get($pBLEScan), math_number(1000), "foundDevices", FALSE)` | Dynamic code |
| `seeed_rpcble_scan_stop` | Statement | VAR(field_variable) | `seeed_rpcble_scan_stop(variables_get($pBLEScan))` | Dynamic code |
| `seeed_rpcble_scan_clear_results` | Statement | VAR(field_variable) | `seeed_rpcble_scan_clear_results(variables_get($pBLEScan))` | Dynamic code |
| `seeed_rpcble_scan_results_count` | Value | VAR(field_variable) | `seeed_rpcble_scan_results_count(variables_get($foundDevices))` | Dynamic code |
| `seeed_rpcble_scan_result_name` | Value | VAR(field_variable), INDEX(input_value) | `seeed_rpcble_scan_result_name(variables_get($foundDevices), math_number(0))` | seeedRpcBleScanResultName( |
| `seeed_rpcble_scan_result_address` | Value | VAR(field_variable), INDEX(input_value) | `seeed_rpcble_scan_result_address(variables_get($foundDevices), math_number(0))` | seeedRpcBleScanResultAddress( |
| `seeed_rpcble_scan_result_rssi` | Value | VAR(field_variable), INDEX(input_value) | `seeed_rpcble_scan_result_rssi(variables_get($foundDevices), math_number(0))` | seeedRpcBleScanResultRssi( |
| `seeed_rpcble_scan_result_service_uuid` | Value | VAR(field_variable), INDEX(input_value) | `seeed_rpcble_scan_result_service_uuid(variables_get($foundDevices), math_number(0))` | seeedRpcBleScanResultServiceUUID( |
| `seeed_rpcble_scan_result_info` | Value | VAR(field_variable), INDEX(input_value) | `seeed_rpcble_scan_result_info(variables_get($foundDevices), math_number(0))` | seeedRpcBleScanResultInfo( |
| `seeed_rpcble_scan_result_has_service` | Value | VAR(field_variable), INDEX(input_value), UUID(input_value) | `seeed_rpcble_scan_result_has_service(variables_get($foundDevices), math_number(0), text("value"))` | seeedRpcBleScanResultHasService( |
| `seeed_rpcble_create_client` | Statement | VAR(field_input) | `seeed_rpcble_create_client("pClient")` | Dynamic code |
| `seeed_rpcble_client_connect` | Statement | VAR(field_variable), ADDRESS(input_value), ADDRESS_TYPE(dropdown) | `seeed_rpcble_client_connect(variables_get($pClient), text("value"), GAP_REMOTE_ADDR_LE_PUBLIC)` | Dynamic code |
| `seeed_rpcble_client_disconnect` | Statement | VAR(field_variable) | `seeed_rpcble_client_disconnect(variables_get($pClient))` | Dynamic code |
| `seeed_rpcble_client_is_connected` | Value | VAR(field_variable) | `seeed_rpcble_client_is_connected(variables_get($pClient))` | Dynamic code |
| `seeed_rpcble_client_rssi` | Value | VAR(field_variable) | `seeed_rpcble_client_rssi(variables_get($pClient))` | Dynamic code |
| `seeed_rpcble_client_get_service` | Statement | CLIENT(field_variable), SERVICE_VAR(field_input), UUID(input_value) | `seeed_rpcble_client_get_service(variables_get($pClient), "pRemoteService", text("value"))` | Dynamic code |
| `seeed_rpcble_remote_service_get_characteristic` | Statement | SERVICE(field_variable), CHAR_VAR(field_input), UUID(input_value) | `seeed_rpcble_remote_service_get_characteristic(variables_get($pRemoteService), "pRemoteCharacteristic", text("value"))` | Dynamic code |
| `seeed_rpcble_remote_characteristic_read` | Value | VAR(field_variable) | `seeed_rpcble_remote_characteristic_read(variables_get($pRemoteCharacteristic))` | String( |
| `seeed_rpcble_remote_characteristic_write` | Statement | VAR(field_variable), VALUE(input_value), RESPONSE(dropdown) | `seeed_rpcble_remote_characteristic_write(variables_get($pRemoteCharacteristic), text("value"), FALSE)` | Dynamic code |
| `seeed_rpcble_remote_characteristic_can_read` | Value | VAR(field_variable) | `seeed_rpcble_remote_characteristic_can_read(variables_get($pRemoteCharacteristic))` | Dynamic code |
| `seeed_rpcble_remote_characteristic_can_write` | Value | VAR(field_variable) | `seeed_rpcble_remote_characteristic_can_write(variables_get($pRemoteCharacteristic))` | Dynamic code |
| `seeed_rpcble_remote_characteristic_can_notify` | Value | VAR(field_variable) | `seeed_rpcble_remote_characteristic_can_notify(variables_get($pRemoteCharacteristic))` | Dynamic code |
| `seeed_rpcble_remote_characteristic_register_notify` | Statement | VAR(field_variable), NOTIFY(dropdown), HANDLER(input_statement) | `seeed_rpcble_remote_characteristic_register_notify(variables_get($pRemoteCharacteristic), TRUE) @HANDLER: child_block()` | Dynamic code |
| `seeed_rpcble_remote_notify_value` | Value | VAR(field_variable) | `seeed_rpcble_remote_notify_value(variables_get($pRemoteCharacteristic))` | Dynamic code |
| `seeed_rpcble_uart_begin` | Statement | NAME(input_value) | `seeed_rpcble_uart_begin(text("value"))` | Dynamic code |
| `seeed_rpcble_uart_send` | Statement | DATA(input_value) | `seeed_rpcble_uart_send(text("value"))` | seeedRpcBleUartSend(String( |
| `seeed_rpcble_uart_connected` | Value | (none) | `seeed_rpcble_uart_connected()` | seeed_rpcble_uart_connected |
| `seeed_rpcble_uart_received` | Value | (none) | `seeed_rpcble_uart_received()` | seeed_rpcble_uart_received |
| `seeed_rpcble_uart_on_receive` | Statement | HANDLER(input_statement) | `seeed_rpcble_uart_on_receive() @HANDLER: child_block()` | seeed_rpcble_uart_rx->setCallbacks(new SeeedRpcBleUartRxCallbacksWithHandler());\n |
| `seeed_rpcble_web_battery_begin` | Statement | NAME(input_value), LEVEL(input_value) | `seeed_rpcble_web_battery_begin(text("value"), math_number(0))` | Dynamic code |
| `seeed_rpcble_web_battery_set_level` | Statement | LEVEL(input_value), NOTIFY(dropdown) | `seeed_rpcble_web_battery_set_level(math_number(0), TRUE)` | seeedRpcBleBatterySetLevel((uint8_t)( |
| `seeed_rpcble_web_battery_level` | Value | (none) | `seeed_rpcble_web_battery_level()` | seeed_rpcble_battery_level |
| `seeed_rpcble_web_battery_connected` | Value | (none) | `seeed_rpcble_web_battery_connected()` | seeed_rpcble_battery_connected |
| `seeed_rpcble_ibeacon_begin` | Statement | NAME(input_value), UUID(input_value), MAJOR(input_value), MINOR(input_value), MANUFACTURER(input_value), POWER(input_value), INFO(input_value), ADV_TYPE(drop... | `seeed_rpcble_ibeacon_begin(text("value"), text("value"), math_number(0), math_number(0), math_number(0), math_number(0), text("value"), NONCONN)` | Dynamic code |
| `seeed_rpcble_ibeacon_stop` | Statement | (none) | `seeed_rpcble_ibeacon_stop()` | if (seeed_rpcble_beacon_advertising != NULL) {\n seeed_rpcble_beacon_advertising->stop();\ |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PROPERTIES | BLECharacteristic::PROPERTY_READ, BLECharacteristic::PROPERTY_WRITE, BLECharacteristic::PROPERTY_NOTIFY, BLECharacteristic::PROPERTY_READ &#124; BLECharacteristic::PROPERTY_WRITE, BLECharacteristic::PROPERTY_READ &#124; BLEChar... | seeed_rpcble_create_characteristic |
| PERMISSIONS | GATT_PERM_READ, GATT_PERM_WRITE, GATT_PERM_READ &#124; GATT_PERM_WRITE, 0 | seeed_rpcble_characteristic_set_permissions |
| FLAGS | ATTRIB_FLAG_VOID &#124; ATTRIB_FLAG_ASCII_Z, ATTRIB_FLAG_VOID | seeed_rpcble_characteristic_add_descriptor |
| PERMISSIONS | GATT_PERM_READ, GATT_PERM_WRITE, GATT_PERM_READ &#124; GATT_PERM_WRITE | seeed_rpcble_characteristic_add_descriptor |
| ENABLE | TRUE, FALSE | seeed_rpcble_advertising_set_scan_response |
| ACTIVE | TRUE, FALSE | seeed_rpcble_scan_set_active |
| CONTINUE | FALSE, TRUE | seeed_rpcble_scan_start |
| ADDRESS_TYPE | GAP_REMOTE_ADDR_LE_PUBLIC, GAP_REMOTE_ADDR_LE_RANDOM | seeed_rpcble_client_connect |
| RESPONSE | FALSE, TRUE | seeed_rpcble_remote_characteristic_write |
| NOTIFY | TRUE, FALSE | seeed_rpcble_remote_characteristic_register_notify, seeed_rpcble_web_battery_set_level |
| ADV_TYPE | NONCONN, SCAN_IND | seeed_rpcble_ibeacon_begin |

## ABS Examples

### Basic Usage
```
arduino_setup()
    seeed_rpcble_init(text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, seeed_rpcble_is_initialized())
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `seeed_rpcble_create_server("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

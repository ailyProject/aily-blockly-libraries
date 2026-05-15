# nRF54 BLE

nRF54L15 BLE library with advertising, connections, GATT services, Nordic UART Service (NUS), and passive/active scanning

## Library Info
- **Name**: @aily-project/lib-nrf54-ble
- **Version**: 0.6.7

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `nrf54_ble_init` | Statement | TX_POWER(dropdown) | `nrf54_ble_init("8")` | _nrf54_ble.begin( |
| `nrf54_ble_end` | Statement | (none) | `nrf54_ble_end()` | _nrf54_ble.end();\n |
| `nrf54_ble_set_name` | Statement | NAME(input_value) | `nrf54_ble_set_name(math_number(0))` | _nrf54_ble.setAdvertisingName(String( |
| `nrf54_ble_set_address` | Statement | ADDRESS(input_value), ADDR_TYPE(dropdown) | `nrf54_ble_set_address(text("value"), kRandomStatic)` | _nrf54_ble.setDeviceAddressString( |
| `nrf54_ble_get_address` | Value | (none) | `nrf54_ble_get_address()` | _nrf54_ble_get_addr_str() |
| `nrf54_ble_set_tx_power` | Statement | TX_POWER(dropdown) | `nrf54_ble_set_tx_power("8")` | _nrf54_ble.setTxPowerDbm( |
| `nrf54_ble_set_adv_type` | Statement | PDU_TYPE(dropdown) | `nrf54_ble_set_adv_type(kAdvInd)` | _nrf54_ble.setAdvertisingPduType(BleAdvPduType:: |
| `nrf54_ble_set_adv_data_raw` | Statement | FLAGS(field_checkbox), INCLUDE_NAME(field_checkbox) | `nrf54_ble_set_adv_data_raw(TRUE, TRUE)` | Dynamic code |
| `nrf54_ble_set_scan_response_name` | Statement | NAME(input_value) | `nrf54_ble_set_scan_response_name(math_number(0))` | _nrf54_ble.setScanResponseName(String( |
| `nrf54_ble_advertise_once` | Statement | (none) | `nrf54_ble_advertise_once()` | _nrf54_ble.advertiseEvent(350U, 700000UL);\n |
| `nrf54_ble_advertise_connectable` | Statement | (none) | `nrf54_ble_advertise_connectable()` | _nrf54_ble.advertiseInteractEvent(&_nrf54_ble_adv_interaction, 350U, 300000UL, 700000UL);\ |
| `nrf54_ble_is_connected` | Value | (none) | `nrf54_ble_is_connected()` | _nrf54_ble.isConnected() |
| `nrf54_ble_disconnect` | Statement | (none) | `nrf54_ble_disconnect()` | _nrf54_ble.disconnect();\n |
| `nrf54_ble_poll_event` | Statement | (none) | `nrf54_ble_poll_event()` | _nrf54_ble.pollConnectionEvent(&_nrf54_ble_conn_event, 450000UL);\n |
| `nrf54_ble_on_connected` | Hat | HANDLER(input_statement) | `nrf54_ble_on_connected() @HANDLER: child_block()` | Dynamic code |
| `nrf54_ble_on_disconnected` | Hat | HANDLER(input_statement) | `nrf54_ble_on_disconnected() @HANDLER: child_block()` | Dynamic code |
| `nrf54_ble_set_gatt_device_name` | Statement | NAME(input_value) | `nrf54_ble_set_gatt_device_name(math_number(0))` | _nrf54_ble.setGattDeviceName(String( |
| `nrf54_ble_set_gatt_battery` | Statement | LEVEL(input_value) | `nrf54_ble_set_gatt_battery(math_number(0))` | _nrf54_ble.setGattBatteryLevel( |
| `nrf54_ble_clear_gatt` | Statement | (none) | `nrf54_ble_clear_gatt()` | _nrf54_ble.clearCustomGatt();\n |
| `nrf54_ble_add_service_16` | Statement | SVC_VAR(field_input), UUID(input_value) | `nrf54_ble_add_service_16("svcHandle", text("value"))` | _nrf54_ble.addCustomGattService(strtoul( |
| `nrf54_ble_add_service_128` | Statement | SVC_VAR(field_input), UUID(input_value) | `nrf54_ble_add_service_128("svcHandle", text("value"))` | Dynamic code |
| `nrf54_ble_add_characteristic` | Statement | SVC_VAR(field_variable), CHAR_VAR(field_input), UUID(input_value), PROPS(dropdown) | `nrf54_ble_add_characteristic(variables_get($svcHandle), "charHandle", text("value"), READ)` | _nrf54_ble.addCustomGattCharacteristic( |
| `nrf54_ble_set_char_value` | Statement | CHAR_VAR(field_variable), VALUE(input_value) | `nrf54_ble_set_char_value(variables_get($charHandle), math_number(0))` | Dynamic code |
| `nrf54_ble_notify_char` | Statement | CHAR_VAR(field_variable) | `nrf54_ble_notify_char(variables_get($charHandle))` | _nrf54_ble.notifyCustomGattCharacteristic( |
| `nrf54_ble_is_cccd_enabled` | Value | CHAR_VAR(field_variable) | `nrf54_ble_is_cccd_enabled(variables_get($charHandle))` | _nrf54_ble.isCustomGattCccdEnabled( |
| `nrf54_ble_on_char_write` | Hat | CHAR_VAR(field_variable), HANDLER(input_statement) | `nrf54_ble_on_char_write(variables_get($charHandle)) @HANDLER: child_block()` | Dynamic code |
| `nrf54_ble_char_write_value` | Value | (none) | `nrf54_ble_char_write_value()` | _nrf54_ble_last_write_value |
| `nrf54_ble_nus_init` | Statement | NAME(input_value) | `nrf54_ble_nus_init(math_number(0))` | _nrf54_ble.begin(0);\n |
| `nrf54_ble_nus_available` | Value | (none) | `nrf54_ble_nus_available()` | _nrf54_nus.available() |
| `nrf54_ble_nus_read_string` | Value | (none) | `nrf54_ble_nus_read_string()` | _nrf54_nus_read_string() |
| `nrf54_ble_nus_write` | Statement | DATA(input_value) | `nrf54_ble_nus_write(math_number(0))` | Dynamic code |
| `nrf54_ble_nus_println` | Statement | DATA(input_value) | `nrf54_ble_nus_println(math_number(0))` | Dynamic code |
| `nrf54_ble_nus_connected` | Value | (none) | `nrf54_ble_nus_connected()` | _nrf54_nus.isConnected() |
| `nrf54_ble_nus_service` | Statement | (none) | `nrf54_ble_nus_service()` | _nrf54_nus_service_loop();\n |
| `nrf54_ble_scan_passive` | Value | (none) | `nrf54_ble_scan_passive()` | _nrf54_ble.scanCycle(&_nrf54_ble_scan_pkt, 2000000UL) |
| `nrf54_ble_scan_active` | Value | (none) | `nrf54_ble_scan_active()` | _nrf54_ble.scanActiveCycle(&_nrf54_ble_active_scan_result, 300000UL, 300000UL) |
| `nrf54_ble_scan_get_address` | Value | (none) | `nrf54_ble_scan_get_address()` | _nrf54_ble_scan_addr_str() |
| `nrf54_ble_scan_get_rssi` | Value | (none) | `nrf54_ble_scan_get_rssi()` | _nrf54_ble_active_scan_result.advRssiDbm |
| `nrf54_ble_scan_get_name` | Value | (none) | `nrf54_ble_scan_get_name()` | _nrf54_ble_scan_parse_name() |
| `nrf54_ble_peripheral_quick` | Hat | NAME(input_value), ON_RECEIVE(input_statement) | `nrf54_ble_peripheral_quick(math_number(0)) @ON_RECEIVE: child_block()` | Dynamic code |
| `nrf54_ble_peripheral_received_data` | Value | (none) | `nrf54_ble_peripheral_received_data()` | _nrf54_ble_rx_data |
| `nrf54_ble_peripheral_send` | Statement | DATA(input_value) | `nrf54_ble_peripheral_send(math_number(0))` | Dynamic code |
| `nrf54_ble_peripheral_connected` | Value | (none) | `nrf54_ble_peripheral_connected()` | _nrf54_nus.isConnected() |
| `nrf54_ble_power_low_power_mode` | Statement | (none) | `nrf54_ble_power_low_power_mode()` | _nrf54_ble_power.setLatencyMode(PowerLatencyMode::kLowPower);\n |
| `nrf54_ble_battery_percent` | Value | (none) | `nrf54_ble_battery_percent()` | _nrf54_ble_read_battery() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TX_POWER | 8, 4, 0, -4, -8, -12, -16, -20, -40 | nrf54_ble_init, nrf54_ble_set_tx_power |
| ADDR_TYPE | kRandomStatic, kPublic | nrf54_ble_set_address |
| PDU_TYPE | kAdvInd, kAdvNonConnInd, kAdvScanInd | nrf54_ble_set_adv_type |
| PROPS | READ, WRITE, WRITE_NR, NOTIFY, INDICATE, READ_NOTIFY, READ_WRITE, READ_WRITE_NOTIFY | nrf54_ble_add_characteristic |

## ABS Examples

### Basic Usage
```
arduino_setup()
    nrf54_ble_init("8")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, nrf54_ble_get_address())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

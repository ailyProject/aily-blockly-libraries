# Bluefruit

Bluefruit-compatible BLE library for nrf54l15 with advertising, BLE UART, GATT services, scanning, central role, and HID

## Library Info
- **Name**: @aily-project/lib-bluefruit52lib
- **Version**: 0.6.48

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bluefruit52_init` | Statement | PRPH_COUNT(field_number), CENTRAL_COUNT(field_number) | `bluefruit52_init(1, 0)` | generator |
| `bluefruit52_set_name` | Statement | NAME(input_value) | `bluefruit52_set_name(text("value"))` | generator |
| `bluefruit52_set_tx_power` | Statement | TX_POWER(dropdown) | `bluefruit52_set_tx_power("8")` | generator |
| `bluefruit52_auto_conn_led` | Statement | ENABLED(dropdown) | `bluefruit52_auto_conn_led(true)` | generator |
| `bluefruit52_config_bandwidth` | Statement | ROLE(dropdown), BANDWIDTH(dropdown) | `bluefruit52_config_bandwidth(Prph, BANDWIDTH_AUTO)` | generator |
| `bluefruit52_connected` | Value | (none) | `bluefruit52_connected()` | generator |
| `bluefruit52_disconnect` | Statement | HANDLE(input_value) | `bluefruit52_disconnect(math_number(0))` | generator |
| `bluefruit52_callback_conn_handle` | Value | (none) | `bluefruit52_callback_conn_handle()` | generator |
| `bluefruit52_callback_disconnect_reason` | Value | (none) | `bluefruit52_callback_disconnect_reason()` | generator |
| `bluefruit52_callback_data` | Value | (none) | `bluefruit52_callback_data()` | generator |
| `bluefruit52_on_periph_connect` | Hat | HANDLER(input_statement) | `bluefruit52_on_periph_connect() @HANDLER: child_block()` | generator |
| `bluefruit52_on_periph_disconnect` | Hat | HANDLER(input_statement) | `bluefruit52_on_periph_disconnect() @HANDLER: child_block()` | generator |
| `bluefruit52_on_central_connect` | Hat | HANDLER(input_statement) | `bluefruit52_on_central_connect() @HANDLER: child_block()` | generator |
| `bluefruit52_on_central_disconnect` | Hat | HANDLER(input_statement) | `bluefruit52_on_central_disconnect() @HANDLER: child_block()` | generator |
| `bluefruit52_adv_clear` | Statement | TARGET(dropdown) | `bluefruit52_adv_clear(Advertising)` | generator |
| `bluefruit52_adv_add_flags` | Statement | (none) | `bluefruit52_adv_add_flags()` | generator |
| `bluefruit52_adv_add_tx_power` | Statement | (none) | `bluefruit52_adv_add_tx_power()` | generator |
| `bluefruit52_adv_add_name` | Statement | TARGET(dropdown) | `bluefruit52_adv_add_name(Advertising)` | generator |
| `bluefruit52_adv_add_service` | Statement | VAR(field_variable) | `bluefruit52_adv_add_service($bleuart)` | generator |
| `bluefruit52_adv_add_uuid` | Statement | UUID(input_value) | `bluefruit52_adv_add_uuid(text("value"))` | generator |
| `bluefruit52_adv_add_appearance` | Statement | APPEARANCE(dropdown) | `bluefruit52_adv_add_appearance(BLE_APPEARANCE_GENERIC_CLOCK)` | generator |
| `bluefruit52_adv_restart_on_disconnect` | Statement | ENABLED(dropdown) | `bluefruit52_adv_restart_on_disconnect(true)` | generator |
| `bluefruit52_adv_set_interval` | Statement | FAST(input_value), SLOW(input_value) | `bluefruit52_adv_set_interval(math_number(0), math_number(0))` | generator |
| `bluefruit52_adv_set_initial_timeout` | Statement | SECONDS(input_value) | `bluefruit52_adv_set_initial_timeout(math_number(0))` | generator |
| `bluefruit52_adv_start` | Statement | TIMEOUT(input_value) | `bluefruit52_adv_start(math_number(1000))` | generator |
| `bluefruit52_adv_stop` | Statement | (none) | `bluefruit52_adv_stop()` | generator |
| `bluefruit52_adv_is_running` | Value | (none) | `bluefruit52_adv_is_running()` | generator |
| `bluefruit52_bleuart_create` | Statement | VAR(field_input), FIFO(input_value) | `bluefruit52_bleuart_create("bleuart", math_number(0))` | generator |
| `bluefruit52_bleuart_begin` | Statement | VAR(field_variable) | `bluefruit52_bleuart_begin($bleuart)` | generator |
| `bluefruit52_bleuart_write` | Statement | VAR(field_variable), DATA(input_value) | `bluefruit52_bleuart_write($bleuart, math_number(0))` | generator |
| `bluefruit52_bleuart_available` | Value | VAR(field_variable) | `bluefruit52_bleuart_available($bleuart)` | generator |
| `bluefruit52_bleuart_read` | Value | VAR(field_variable) | `bluefruit52_bleuart_read($bleuart)` | generator |
| `bluefruit52_bleuart_read_string` | Value | VAR(field_variable) | `bluefruit52_bleuart_read_string($bleuart)` | generator |
| `bluefruit52_bleuart_notify_enabled` | Value | VAR(field_variable) | `bluefruit52_bleuart_notify_enabled($bleuart)` | generator |
| `bluefruit52_bleuart_on_receive` | Statement | VAR(field_variable), HANDLER(input_statement) | `bluefruit52_bleuart_on_receive($bleuart) @HANDLER: child_block()` | generator |
| `bluefruit52_bleuart_peripheral_quick` | Statement | NAME(input_value) | `bluefruit52_bleuart_peripheral_quick(text("value"))` | generator |
| `bluefruit52_bleuart_quick_send` | Statement | DATA(input_value) | `bluefruit52_bleuart_quick_send(math_number(0))` | generator |
| `bluefruit52_bleuart_quick_received_data` | Value | (none) | `bluefruit52_bleuart_quick_received_data()` | generator |
| `bluefruit52_bleuart_quick_connected` | Value | (none) | `bluefruit52_bleuart_quick_connected()` | generator |
| `bluefruit52_service_create` | Statement | VAR(field_input), UUID(input_value) | `bluefruit52_service_create("customService", text("value"))` | generator |
| `bluefruit52_service_begin` | Statement | VAR(field_variable) | `bluefruit52_service_begin($customService)` | generator |
| `bluefruit52_characteristic_create` | Statement | VAR(field_input), UUID(input_value), PROPERTIES(dropdown), MAX_LEN(input_value) | `bluefruit52_characteristic_create("customChar", text("value"), CHR_PROPS_READ, math_number(0))` | generator |
| `bluefruit52_characteristic_set_permission` | Statement | VAR(field_variable), READ_PERM(dropdown), WRITE_PERM(dropdown) | `bluefruit52_characteristic_set_permission($customChar, SECMODE_OPEN, SECMODE_OPEN)` | generator |
| `bluefruit52_characteristic_begin` | Statement | VAR(field_variable) | `bluefruit52_characteristic_begin($customChar)` | generator |
| `bluefruit52_characteristic_write_text` | Statement | VAR(field_variable), DATA(input_value) | `bluefruit52_characteristic_write_text($customChar, math_number(0))` | generator |
| `bluefruit52_characteristic_notify_text` | Statement | VAR(field_variable), DATA(input_value) | `bluefruit52_characteristic_notify_text($customChar, math_number(0))` | generator |
| `bluefruit52_characteristic_indicate_text` | Statement | VAR(field_variable), DATA(input_value) | `bluefruit52_characteristic_indicate_text($customChar, math_number(0))` | generator |
| `bluefruit52_characteristic_read_string` | Value | VAR(field_variable) | `bluefruit52_characteristic_read_string($customChar)` | generator |
| `bluefruit52_characteristic_notify_enabled` | Value | VAR(field_variable) | `bluefruit52_characteristic_notify_enabled($customChar)` | generator |
| `bluefruit52_characteristic_on_write` | Statement | VAR(field_variable), HANDLER(input_statement) | `bluefruit52_characteristic_on_write($customChar) @HANDLER: child_block()` | generator |
| `bluefruit52_dis_create` | Statement | VAR(field_input) | `bluefruit52_dis_create("bledis")` | generator |
| `bluefruit52_dis_set` | Statement | VAR(field_variable), FIELD(dropdown), VALUE(input_value) | `bluefruit52_dis_set($bledis, setManufacturer, text("value"))` | generator |
| `bluefruit52_dis_begin` | Statement | VAR(field_variable) | `bluefruit52_dis_begin($bledis)` | generator |
| `bluefruit52_bas_create` | Statement | VAR(field_input) | `bluefruit52_bas_create("blebas")` | generator |
| `bluefruit52_bas_begin` | Statement | VAR(field_variable) | `bluefruit52_bas_begin($blebas)` | generator |
| `bluefruit52_bas_write` | Statement | VAR(field_variable), LEVEL(input_value) | `bluefruit52_bas_write($blebas, math_number(0))` | generator |
| `bluefruit52_bas_notify` | Statement | VAR(field_variable), LEVEL(input_value) | `bluefruit52_bas_notify($blebas, math_number(0))` | generator |
| `bluefruit52_scanner_config` | Statement | INTERVAL(input_value), WINDOW(input_value), ACTIVE(dropdown), RESTART(dropdown) | `bluefruit52_scanner_config(math_number(1000), math_number(0), true, true)` | generator |
| `bluefruit52_scanner_start` | Statement | TIMEOUT(input_value) | `bluefruit52_scanner_start(math_number(1000))` | generator |
| `bluefruit52_scanner_stop` | Statement | (none) | `bluefruit52_scanner_stop()` | generator |
| `bluefruit52_scanner_resume` | Statement | (none) | `bluefruit52_scanner_resume()` | generator |
| `bluefruit52_scanner_filter_uuid` | Statement | UUID(input_value) | `bluefruit52_scanner_filter_uuid(text("value"))` | generator |
| `bluefruit52_on_scan_report` | Hat | HANDLER(input_statement) | `bluefruit52_on_scan_report() @HANDLER: child_block()` | generator |
| `bluefruit52_scan_report_rssi` | Value | (none) | `bluefruit52_scan_report_rssi()` | generator |
| `bluefruit52_scan_report_address` | Value | (none) | `bluefruit52_scan_report_address()` | generator |
| `bluefruit52_scan_report_has_uuid` | Value | UUID(input_value) | `bluefruit52_scan_report_has_uuid(text("value"))` | generator |
| `bluefruit52_central_connect_report` | Statement | (none) | `bluefruit52_central_connect_report()` | generator |
| `bluefruit52_central_connected` | Value | (none) | `bluefruit52_central_connected()` | generator |
| `bluefruit52_client_uart_create` | Statement | VAR(field_input) | `bluefruit52_client_uart_create("clientUart")` | generator |
| `bluefruit52_client_uart_begin` | Statement | VAR(field_variable) | `bluefruit52_client_uart_begin($clientUart)` | generator |
| `bluefruit52_client_uart_discover` | Statement | VAR(field_variable), HANDLE(input_value) | `bluefruit52_client_uart_discover($clientUart, math_number(0))` | generator |
| `bluefruit52_client_uart_enable_txd` | Statement | VAR(field_variable) | `bluefruit52_client_uart_enable_txd($clientUart)` | generator |
| `bluefruit52_client_uart_write` | Statement | VAR(field_variable), DATA(input_value) | `bluefruit52_client_uart_write($clientUart, math_number(0))` | generator |
| `bluefruit52_client_uart_read_string` | Value | VAR(field_variable) | `bluefruit52_client_uart_read_string($clientUart)` | generator |
| `bluefruit52_client_uart_on_receive` | Statement | VAR(field_variable), HANDLER(input_statement) | `bluefruit52_client_uart_on_receive($clientUart) @HANDLER: child_block()` | generator |
| `bluefruit52_hid_create` | Statement | VAR(field_input) | `bluefruit52_hid_create("blehid")` | generator |
| `bluefruit52_hid_begin` | Statement | VAR(field_variable) | `bluefruit52_hid_begin($blehid)` | generator |
| `bluefruit52_hid_key_press` | Statement | VAR(field_variable), CHAR(input_value) | `bluefruit52_hid_key_press($blehid, text("value"))` | generator |
| `bluefruit52_hid_key_release` | Statement | VAR(field_variable) | `bluefruit52_hid_key_release($blehid)` | generator |
| `bluefruit52_hid_key_sequence` | Statement | VAR(field_variable), TEXT(input_value), INTERVAL(input_value) | `bluefruit52_hid_key_sequence($blehid, text("value"), math_number(1000))` | generator |
| `bluefruit52_hid_mouse_move` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `bluefruit52_hid_mouse_move($blehid, math_number(0), math_number(0))` | generator |
| `bluefruit52_hid_mouse_press` | Statement | VAR(field_variable), BUTTON(dropdown) | `bluefruit52_hid_mouse_press($blehid, MOUSE_BUTTON_LEFT)` | generator |
| `bluefruit52_hid_mouse_release` | Statement | VAR(field_variable) | `bluefruit52_hid_mouse_release($blehid)` | generator |
| `bluefruit52_hid_mouse_scroll` | Statement | VAR(field_variable), AMOUNT(input_value) | `bluefruit52_hid_mouse_scroll($blehid, math_number(0))` | generator |
| `bluefruit52_beacon_create` | Statement | VAR(field_input), UUID(input_value), MAJOR(input_value), MINOR(input_value), RSSI(input... | `bluefruit52_beacon_create("beacon", text("value"), math_number(0), math_number(0), ...)` | generator |
| `bluefruit52_beacon_set_manufacturer` | Statement | VAR(field_variable), COMPANY_ID(input_value) | `bluefruit52_beacon_set_manufacturer($beacon, math_number(0))` | generator |
| `bluefruit52_eddystone_create` | Statement | VAR(field_input), URL(input_value), RSSI(input_value) | `bluefruit52_eddystone_create("eddyUrl", text("value"), math_number(0))` | generator |
| `bluefruit52_adv_set_beacon` | Statement | VAR(field_variable) | `bluefruit52_adv_set_beacon($beacon)` | generator |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TX_POWER | 8, 4, 0, -4, -8, -12, -16, -20, ... | bluefruit52_set_tx_power |
| ENABLED | true, false | bluefruit52_auto_conn_led, bluefruit52_adv_restart_on_disconnect |
| ROLE | Prph, Central | bluefruit52_config_bandwidth |
| BANDWIDTH | BANDWIDTH_AUTO, BANDWIDTH_LOW, BANDWIDTH_NORMAL, BANDWIDTH_HIGH, BANDWIDTH_MAX | bluefruit52_config_bandwidth |
| TARGET | Advertising, ScanResponse, Both | bluefruit52_adv_clear, bluefruit52_adv_add_name |
| APPEARANCE | BLE_APPEARANCE_GENERIC_CLOCK, BLE_APPEARANCE_HID_KEYBOARD, BLE_APPEARANCE_HID... | bluefruit52_adv_add_appearance |
| PROPERTIES | CHR_PROPS_READ, CHR_PROPS_WRITE, CHR_PROPS_WRITE_WO_RESP, CHR_PROPS_NOTIFY, C... | bluefruit52_characteristic_create |
| READ_PERM | SECMODE_OPEN, SECMODE_NO_ACCESS, SECMODE_ENC_NO_MITM, SECMODE_ENC_WITH_MITM | bluefruit52_characteristic_set_permission |
| WRITE_PERM | SECMODE_OPEN, SECMODE_NO_ACCESS, SECMODE_ENC_NO_MITM, SECMODE_ENC_WITH_MITM | bluefruit52_characteristic_set_permission |
| FIELD | setManufacturer, setModel, setSerialNum, setFirmwareRev, setHardwareRev, setS... | bluefruit52_dis_set |
| ACTIVE | true, false | bluefruit52_scanner_config |
| RESTART | true, false | bluefruit52_scanner_config |
| BUTTON | MOUSE_BUTTON_LEFT, MOUSE_BUTTON_RIGHT, MOUSE_BUTTON_MIDDLE, MOUSE_BUTTON_BACK... | bluefruit52_hid_mouse_press |

## Notes

1. **Variable**: `bluefruit52_bleuart_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

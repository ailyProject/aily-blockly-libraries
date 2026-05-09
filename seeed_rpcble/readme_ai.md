# Seeed RPC BLE

Blockly ABS reference for Wio Terminal rpcBLE, covering GATT server/client, scanning, BLE UART, Web Bluetooth battery service, and iBeacon.

## Library Info
- **Name**: @aily-project/lib-seeed-rpcble
- **Version**: 1.0.0
- **Includes**: `#include <rpcBLEDevice.h>`, `#include <BLEServer.h>`, `#include <BLEScan.h>`, `#include <BLEClient.h>`, `#include <BLE2902.h>`, `#include <BLEBeacon.h>` as needed
- **Source**: https://github.com/Seeed-Studio/Seeed_Arduino_rpcBLE

## Block Definitions

### Device

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_rpcble_init` | Statement | NAME(input_value) | `seeed_rpcble_init(text("Wio BLE"))` | `BLEDevice::init(...)` |
| `seeed_rpcble_deinit` | Statement | - | `seeed_rpcble_deinit()` | `BLEDevice::deinit();` |
| `seeed_rpcble_is_initialized` | Value | - | `seeed_rpcble_is_initialized()` | `BLEDevice::getInitialized()` |
| `seeed_rpcble_get_address` | Value | - | `seeed_rpcble_get_address()` | local BLE address as `String` |
| `seeed_rpcble_set_mtu` | Statement | MTU(input_value) | `seeed_rpcble_set_mtu(math_number(23))` | `BLEDevice::setMTU(mtu);` |
| `seeed_rpcble_get_mtu` | Value | - | `seeed_rpcble_get_mtu()` | `BLEDevice::getMTU()` |

### GATT Server and Characteristics

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_rpcble_create_server` | Statement | VAR(field_input) | `seeed_rpcble_create_server("pServer")` | creates `BLEServer* $pServer` |
| `seeed_rpcble_server_create_service` | Statement | SERVER(field_variable), SERVICE_VAR(field_input), UUID(input_value) | `seeed_rpcble_server_create_service($pServer,"pService",text("180f"))` | `$pService = $pServer->createService(uuid);` |
| `seeed_rpcble_service_start` | Statement | VAR(field_variable) | `seeed_rpcble_service_start($pService)` | `$pService->start();` |
| `seeed_rpcble_service_stop` | Statement | VAR(field_variable) | `seeed_rpcble_service_stop($pService)` | `$pService->stop();` |
| `seeed_rpcble_server_connected_count` | Value | VAR(field_variable) | `seeed_rpcble_server_connected_count($pServer)` | `$pServer->getConnectedCount()` |
| `seeed_rpcble_server_set_callbacks` | Statement | VAR(field_variable), ON_CONNECT(input_statement), ON_DISCONNECT(input_statement) | `seeed_rpcble_server_set_callbacks($pServer) @ON_CONNECT: ... @ON_DISCONNECT: ...` | installs `BLEServerCallbacks` |
| `seeed_rpcble_create_characteristic` | Statement | SERVICE(field_variable), CHAR_VAR(field_input), UUID(input_value), PROPERTIES(dropdown) | `seeed_rpcble_create_characteristic($pService,"pCharacteristic",text("2a19"),READ_WRITE)` | creates `BLECharacteristic*` |
| `seeed_rpcble_characteristic_set_permissions` | Statement | VAR(field_variable), PERMISSIONS(dropdown) | `seeed_rpcble_characteristic_set_permissions($pCharacteristic,READ_WRITE)` | `setAccessPermissions(...)` |
| `seeed_rpcble_characteristic_add_notify_descriptor` | Statement | VAR(field_variable) | `seeed_rpcble_characteristic_add_notify_descriptor($pCharacteristic)` | adds `BLE2902` |
| `seeed_rpcble_characteristic_add_descriptor` | Statement | VAR(field_variable), UUID(input_value), FLAGS(dropdown), PERMISSIONS(dropdown), MAX_LEN(input_value) | `seeed_rpcble_characteristic_add_descriptor($pCharacteristic,text("4545"),ASCII,READ_WRITE,math_number(2))` | `createDescriptor(...)` |
| `seeed_rpcble_characteristic_set_value` | Statement | VAR(field_variable), VALUE(input_value) | `seeed_rpcble_characteristic_set_value($pCharacteristic,text("hello"))` | `setValue(text)` |
| `seeed_rpcble_characteristic_set_byte` | Statement | VAR(field_variable), VALUE(input_value) | `seeed_rpcble_characteristic_set_byte($pCharacteristic,math_number(10))` | `setValue(&byte,1)` |
| `seeed_rpcble_characteristic_get_value` | Value | VAR(field_variable) | `seeed_rpcble_characteristic_get_value($pCharacteristic)` | characteristic value as `String` |
| `seeed_rpcble_characteristic_notify` | Statement | VAR(field_variable) | `seeed_rpcble_characteristic_notify($pCharacteristic)` | `$pCharacteristic->notify();` |
| `seeed_rpcble_characteristic_indicate` | Statement | VAR(field_variable) | `seeed_rpcble_characteristic_indicate($pCharacteristic)` | `$pCharacteristic->indicate();` |
| `seeed_rpcble_characteristic_set_callbacks` | Statement | VAR(field_variable), HANDLER(input_statement) | `seeed_rpcble_characteristic_set_callbacks($pCharacteristic) @HANDLER: ...` | installs `BLECharacteristicCallbacks` |
| `seeed_rpcble_characteristic_received_value` | Value | VAR(field_variable) | `seeed_rpcble_characteristic_received_value($pCharacteristic)` | cached text from write callback |

### Advertising, Scan, and Client

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_rpcble_advertising_add_service_uuid` | Statement | UUID(input_value) | `seeed_rpcble_advertising_add_service_uuid(text("180f"))` | add UUID to advertising |
| `seeed_rpcble_advertising_set_scan_response` | Statement | ENABLE(dropdown) | `seeed_rpcble_advertising_set_scan_response(TRUE)` | scan response on/off |
| `seeed_rpcble_advertising_set_preferred` | Statement | MIN(input_value), MAX(input_value) | `seeed_rpcble_advertising_set_preferred(math_number(6),math_number(18))` | preferred advertising params |
| `seeed_rpcble_start_advertising` | Statement | - | `seeed_rpcble_start_advertising()` | `BLEDevice::startAdvertising();` |
| `seeed_rpcble_stop_advertising` | Statement | - | `seeed_rpcble_stop_advertising()` | `BLEDevice::stopAdvertising();` |
| `seeed_rpcble_scan_create` | Statement | VAR(field_input) | `seeed_rpcble_scan_create("pBLEScan")` | creates `BLEScan*` |
| `seeed_rpcble_scan_set_active` | Statement | VAR(field_variable), ACTIVE(dropdown) | `seeed_rpcble_scan_set_active($pBLEScan,TRUE)` | active scan on/off |
| `seeed_rpcble_scan_set_interval` | Statement | VAR(field_variable), INTERVAL(input_value) | `seeed_rpcble_scan_set_interval($pBLEScan,math_number(100))` | scan interval |
| `seeed_rpcble_scan_set_window` | Statement | VAR(field_variable), WINDOW(input_value) | `seeed_rpcble_scan_set_window($pBLEScan,math_number(99))` | scan window |
| `seeed_rpcble_scan_start` | Statement | SCAN(field_variable), DURATION(input_value), RESULT_VAR(field_input), CONTINUE(dropdown) | `seeed_rpcble_scan_start($pBLEScan,math_number(5),"foundDevices",FALSE)` | creates `BLEScanResults $foundDevices` |
| `seeed_rpcble_scan_results_count` | Value | VAR(field_variable) | `seeed_rpcble_scan_results_count($foundDevices)` | result count |
| `seeed_rpcble_scan_result_name` | Value | VAR(field_variable), INDEX(input_value) | `seeed_rpcble_scan_result_name($foundDevices,math_number(0))` | result name |
| `seeed_rpcble_scan_result_address` | Value | VAR(field_variable), INDEX(input_value) | `seeed_rpcble_scan_result_address($foundDevices,math_number(0))` | result address |
| `seeed_rpcble_scan_result_rssi` | Value | VAR(field_variable), INDEX(input_value) | `seeed_rpcble_scan_result_rssi($foundDevices,math_number(0))` | result RSSI |
| `seeed_rpcble_scan_result_service_uuid` | Value | VAR(field_variable), INDEX(input_value) | `seeed_rpcble_scan_result_service_uuid($foundDevices,math_number(0))` | first service UUID |
| `seeed_rpcble_scan_result_info` | Value | VAR(field_variable), INDEX(input_value) | `seeed_rpcble_scan_result_info($foundDevices,math_number(0))` | full scan result text |
| `seeed_rpcble_scan_result_has_service` | Value | VAR(field_variable), INDEX(input_value), UUID(input_value) | `seeed_rpcble_scan_result_has_service($foundDevices,math_number(0),text("180f"))` | service UUID match |
| `seeed_rpcble_create_client` | Statement | VAR(field_input) | `seeed_rpcble_create_client("pClient")` | creates `BLEClient*` |
| `seeed_rpcble_client_connect` | Statement | VAR(field_variable), ADDRESS(input_value), ADDRESS_TYPE(dropdown) | `seeed_rpcble_client_connect($pClient,text("00:00:00:00:00:00"),PUBLIC)` | connect by address |
| `seeed_rpcble_client_get_service` | Statement | CLIENT(field_variable), SERVICE_VAR(field_input), UUID(input_value) | `seeed_rpcble_client_get_service($pClient,"pRemoteService",text("180f"))` | remote service |
| `seeed_rpcble_remote_service_get_characteristic` | Statement | SERVICE(field_variable), CHAR_VAR(field_input), UUID(input_value) | `seeed_rpcble_remote_service_get_characteristic($pRemoteService,"pRemoteCharacteristic",text("2a19"))` | remote characteristic |
| `seeed_rpcble_remote_characteristic_read` | Value | VAR(field_variable) | `seeed_rpcble_remote_characteristic_read($pRemoteCharacteristic)` | read text |
| `seeed_rpcble_remote_characteristic_write` | Statement | VAR(field_variable), VALUE(input_value), RESPONSE(dropdown) | `seeed_rpcble_remote_characteristic_write($pRemoteCharacteristic,text("hello"),FALSE)` | write text |
| `seeed_rpcble_remote_characteristic_register_notify` | Statement | VAR(field_variable), NOTIFY(dropdown), HANDLER(input_statement) | `seeed_rpcble_remote_characteristic_register_notify($pRemoteCharacteristic,TRUE) @HANDLER: ...` | subscribe notify |
| `seeed_rpcble_remote_notify_value` | Value | VAR(field_variable) | `seeed_rpcble_remote_notify_value($pRemoteCharacteristic)` | cached notify text |

### UART, Web Bluetooth, and iBeacon

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_rpcble_uart_begin` | Statement | NAME(input_value) | `seeed_rpcble_uart_begin(text("UART Service"))` | Nordic UART service UUIDs |
| `seeed_rpcble_uart_send` | Statement | DATA(input_value) | `seeed_rpcble_uart_send(text("hello"))` | notify TX characteristic |
| `seeed_rpcble_uart_connected` | Value | - | `seeed_rpcble_uart_connected()` | connection flag |
| `seeed_rpcble_uart_received` | Value | - | `seeed_rpcble_uart_received()` | cached RX text |
| `seeed_rpcble_uart_on_receive` | Statement | HANDLER(input_statement) | `seeed_rpcble_uart_on_receive() @HANDLER: ...` | installs RX callback |
| `seeed_rpcble_web_battery_begin` | Statement | NAME(input_value), LEVEL(input_value) | `seeed_rpcble_web_battery_begin(text("BLE Battery"),math_number(10))` | standard Battery Service `0x180F` |
| `seeed_rpcble_web_battery_set_level` | Statement | LEVEL(input_value), NOTIFY(dropdown) | `seeed_rpcble_web_battery_set_level(math_number(50),TRUE)` | update/notify Battery Level `0x2A19` |
| `seeed_rpcble_web_battery_level` | Value | - | `seeed_rpcble_web_battery_level()` | cached battery level |
| `seeed_rpcble_web_battery_connected` | Value | - | `seeed_rpcble_web_battery_connected()` | connection flag |
| `seeed_rpcble_ibeacon_begin` | Statement | NAME(input_value), UUID(input_value), MAJOR(input_value), MINOR(input_value), MANUFACTURER(input_value), POWER(input_value), INFO(input_value), ADV_TYPE(dropdown) | `seeed_rpcble_ibeacon_begin(text("wio"),text("8ec..."),math_number(123),math_number(456),math_number(19456),math_number(-59),text("door-1"),NONCONN)` | configure and start iBeacon |
| `seeed_rpcble_ibeacon_stop` | Statement | - | `seeed_rpcble_ibeacon_stop()` | stop iBeacon advertising |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PROPERTIES | `BLECharacteristic::PROPERTY_READ`, `PROPERTY_WRITE`, `PROPERTY_NOTIFY`, combinations | Characteristic properties |
| PERMISSIONS | `GATT_PERM_READ`, `GATT_PERM_WRITE`, `GATT_PERM_READ | GATT_PERM_WRITE`, `0` | GATT access permissions |
| ADDRESS_TYPE | `GAP_REMOTE_ADDR_LE_PUBLIC`, `GAP_REMOTE_ADDR_LE_RANDOM` | Remote BLE address type |
| ENABLE, ACTIVE, CONTINUE, NOTIFY, RESPONSE | `TRUE`, `FALSE` | Boolean switches |
| ADV_TYPE | `NONCONN`, `SCAN_IND` | iBeacon non-connectable or scan-response advertising |

## ABS Examples

### BLE UART Server
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    seeed_rpcble_uart_begin(text("UART Service"))
    seeed_rpcble_uart_on_receive()
        @HANDLER:
            serial_println(Serial, seeed_rpcble_uart_received())

arduino_loop()
    controls_if()
        @IF0: seeed_rpcble_uart_connected()
        @DO0:
            seeed_rpcble_uart_send(text("hello"))
    time_delay(math_number(1000))
```

### Web Bluetooth Battery
```abs
arduino_setup()
    seeed_rpcble_web_battery_begin(text("BLE Battery"), math_number(10))

arduino_loop()
    seeed_rpcble_web_battery_set_level(math_number(80), TRUE)
    time_delay(math_number(3000))
```

### Scan Devices
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    seeed_rpcble_init(text(""))
    seeed_rpcble_scan_create("pBLEScan")
    seeed_rpcble_scan_set_active($pBLEScan, TRUE)
    seeed_rpcble_scan_set_interval($pBLEScan, math_number(100))
    seeed_rpcble_scan_set_window($pBLEScan, math_number(99))

arduino_loop()
    seeed_rpcble_scan_start($pBLEScan, math_number(5), "foundDevices", FALSE)
    serial_println(Serial, seeed_rpcble_scan_results_count($foundDevices))
    serial_println(Serial, seeed_rpcble_scan_result_info($foundDevices, math_number(0)))
    seeed_rpcble_scan_clear_results($pBLEScan)
    time_delay(math_number(2000))
```

### iBeacon
```abs
arduino_setup()
    seeed_rpcble_ibeacon_begin(text("wio"), text("8ec76ea3-6668-48da-9866-75be8bc86f4d"), math_number(123), math_number(456), math_number(19456), math_number(-59), text("door-1"), SCAN_IND)
```

## Notes

1. Wio Terminal BLE requires updated RTL8720 eRPC/BLE firmware before uploading sketches.
2. `field_input` creation blocks register Blockly variables automatically; later blocks reference them as `$varName`.
3. BLE client MAC address format normally uses text like `2c:f7:f1:1b:18:7d`; if connecting fails, verify address type and the address byte order shown by the peripheral scanner.
4. iBeacon payload and scan response are limited by BLE advertising size; keep `INFO` short.
5. Web Bluetooth browser filters must match the advertised device name, such as `BLE Battery`.
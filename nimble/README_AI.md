# NimBLE 蓝牙库 (AI版)

ESP32 低功耗蓝牙 (BLE) Blockly 库，支持服务端和客户端模式。

## 库信息
- **库名**: @aily-project/lib-nimble
- **版本**: 1.0.0
- **兼容**: esp32:esp32

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `nimble_init` | 语句块 | NAME(input_value) | `"inputs":{"NAME":{...}}` | `NimBLEDevice::init(name);` |
| `nimble_deinit` | 语句块 | CLEAR_ALL(checkbox) | `"CLEAR_ALL":false` | `NimBLEDevice::deinit(false);` |
| `nimble_create_server` | 语句块 | VAR(field_input) | `"VAR":"pServer"` | `pServer = NimBLEDevice::createServer();` |
| `nimble_server_create_service` | 语句块 | SERVER(field_variable), UUID(input), SERVICE_VAR(field_input) | `"SERVER":{"id":"..."}, "SERVICE_VAR":"pService"` | `pService = pServer->createService(uuid);` |
| `nimble_service_create_characteristic` | 语句块 | SERVICE(field_variable), UUID(input), CHAR_VAR(field_input) | `"SERVICE":{"id":"..."}, "CHAR_VAR":"pChar"` | `pChar = pService->createCharacteristic(uuid);` |
| `nimble_service_create_characteristic_props` | 语句块 | SERVICE(field_variable), UUID(input), PROPERTIES(dropdown), CHAR_VAR(field_input) | `"PROPERTIES":"READ_WRITE"` | `pChar = pService->createCharacteristic(uuid, props);` |
| `nimble_characteristic_set_value` | 语句块 | CHAR(field_variable), VALUE(input) | `"CHAR":{"id":"..."}` | `pChar->setValue(value);` |
| `nimble_characteristic_get_value` | 值块 | CHAR(field_variable) | `"CHAR":{"id":"..."}` | `pChar->getValue()` |
| `nimble_characteristic_notify` | 语句块 | CHAR(field_variable) | `"CHAR":{"id":"..."}` | `pChar->notify();` |
| `nimble_service_start` | 语句块 | SERVICE(field_variable) | `"SERVICE":{"id":"..."}` | `pService->start();` |
| `nimble_start_advertising` | 语句块 | 无 | - | `NimBLEDevice::startAdvertising();` |
| `nimble_stop_advertising` | 语句块 | 无 | - | `NimBLEDevice::getAdvertising()->stop();` |
| `nimble_advertising_add_service` | 语句块 | UUID(input) | `"inputs":{"UUID":{...}}` | `getAdvertising()->addServiceUUID(uuid);` |
| `nimble_advertising_set_name` | 语句块 | NAME(input) | `"inputs":{"NAME":{...}}` | `getAdvertising()->setName(name);` |
| `nimble_server_connected_count` | 值块 | SERVER(field_variable) | `"SERVER":{"id":"..."}` | `pServer->getConnectedCount()` |
| `nimble_on_connect` | Hat块 | SERVER(field_variable), HANDLER(input_statement) | 嵌套块 | 回调类生成 |
| `nimble_on_disconnect` | Hat块 | SERVER(field_variable), HANDLER(input_statement) | 嵌套块 | 回调类生成 |
| `nimble_on_characteristic_write` | Hat块 | CHAR(field_variable), HANDLER(input_statement) | 嵌套块 | 回调类生成 |
| `nimble_start_scan` | 语句块 | DURATION(input_value) | `"inputs":{"DURATION":{...}}` | `getScan()->start(duration * 1000);` |
| `nimble_stop_scan` | 语句块 | 无 | - | `getScan()->stop();` |
| `nimble_is_scanning` | 值块 | 无 | - | `getScan()->isScanning()` |
| `nimble_on_scan_result` | Hat块 | HANDLER(input_statement) | 嵌套块 | 扫描回调类生成 |
| `nimble_scan_device_name` | 值块 | 无 | - | `scanDevice->getName()` |
| `nimble_scan_device_address` | 值块 | 无 | - | `scanDevice->getAddress()` |
| `nimble_scan_device_rssi` | 值块 | 无 | - | `scanDevice->getRSSI()` |
| `nimble_scan_device_has_service` | 值块 | UUID(input) | `"inputs":{"UUID":{...}}` | `scanDevice->isAdvertisingService(uuid)` |
| `nimble_create_client` | 语句块 | VAR(field_input) | `"VAR":"pClient"` | `pClient = NimBLEDevice::createClient();` |
| `nimble_client_connect_address` | 值块 | CLIENT(field_variable), ADDRESS(input) | `"CLIENT":{"id":"..."}` | `pClient->connect(address)` |
| `nimble_client_connect_device` | 值块 | CLIENT(field_variable) | `"CLIENT":{"id":"..."}` | `pClient->connect(scanDevice)` |
| `nimble_client_disconnect` | 语句块 | CLIENT(field_variable) | `"CLIENT":{"id":"..."}` | `pClient->disconnect();` |
| `nimble_client_is_connected` | 值块 | CLIENT(field_variable) | `"CLIENT":{"id":"..."}` | `pClient->isConnected()` |
| `nimble_client_get_service` | 语句块 | CLIENT(field_variable), UUID(input), SERVICE_VAR(field_input) | `"SERVICE_VAR":"pRemoteService"` | `pRemoteService = pClient->getService(uuid);` |
| `nimble_remote_service_get_characteristic` | 语句块 | SERVICE(field_variable), UUID(input), CHAR_VAR(field_input) | `"CHAR_VAR":"pRemoteChar"` | `pRemoteChar = pRemoteService->getCharacteristic(uuid);` |
| `nimble_remote_char_read` | 值块 | CHAR(field_variable) | `"CHAR":{"id":"..."}` | `pRemoteChar->readValue()` |
| `nimble_remote_char_write` | 语句块 | CHAR(field_variable), VALUE(input) | `"CHAR":{"id":"..."}` | `pRemoteChar->writeValue(value);` |
| `nimble_remote_char_subscribe` | Hat块 | CHAR(field_variable), HANDLER(input_statement) | 嵌套块 | 通知回调生成 |
| `nimble_notify_data` | 值块 | 无 | - | `notifyData` |
| `nimble_get_address` | 值块 | 无 | - | `NimBLEDevice::getAddress()` |
| `nimble_set_mtu` | 语句块 | MTU(input_value) | `"inputs":{"MTU":{...}}` | `NimBLEDevice::setMTU(mtu);` |
| `nimble_set_power` | 语句块 | POWER(dropdown) | `"POWER":"0"` | `NimBLEDevice::setPower(power);` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "pServer"` |
| field_dropdown | 字符串 | `"POWER": "0"` |
| field_checkbox | 布尔值 | `"CLEAR_ALL": false` |
| field_variable | 对象 | `"SERVER": {"id": "var_id"}` |
| input_value | 块连接 | `"inputs": {"NAME": {"shadow": {...}}}` |
| input_statement | 块连接 | `"inputs": {"HANDLER": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **Hat块**: 无连接属性，通过`inputs`连接内部语句，事件回调使用

### 变量类型

| 变量类型 | 创建块 | 使用场景 |
|----------|--------|----------|
| NimBLEServer | nimble_create_server | 服务端操作 |
| NimBLEService | nimble_server_create_service | 服务操作 |
| NimBLECharacteristic | nimble_service_create_characteristic | 本地特征操作 |
| NimBLEClient | nimble_create_client | 客户端操作 |
| NimBLERemoteService | nimble_client_get_service | 远程服务操作 |
| NimBLERemoteCharacteristic | nimble_remote_service_get_characteristic | 远程特征操作 |

## 使用示例

### BLE服务端示例
```json
{
  "type": "nimble_init",
  "id": "init_1",
  "inputs": {
    "NAME": {
      "shadow": {
        "type": "text",
        "id": "text_1",
        "fields": {"TEXT": "MyBLEServer"}
      }
    }
  },
  "next": {
    "block": {
      "type": "nimble_create_server",
      "id": "server_1",
      "fields": {"VAR": "pServer"},
      "next": {
        "block": {
          "type": "nimble_server_create_service",
          "id": "service_1",
          "fields": {
            "SERVER": {"id": "server_var_id"},
            "SERVICE_VAR": "pService"
          },
          "inputs": {
            "UUID": {
              "shadow": {
                "type": "text",
                "id": "uuid_1",
                "fields": {"TEXT": "ABCD"}
              }
            }
          },
          "next": {
            "block": {
              "type": "nimble_service_start",
              "id": "start_1",
              "fields": {"SERVICE": {"id": "service_var_id"}},
              "next": {
                "block": {
                  "type": "nimble_start_advertising",
                  "id": "adv_1"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### 扫描回调示例
```json
{
  "type": "nimble_on_scan_result",
  "id": "scan_callback_1",
  "x": 30,
  "y": 200,
  "inputs": {
    "HANDLER": {
      "block": {
        "type": "serial_println",
        "id": "print_1",
        "fields": {"SERIAL": "Serial"},
        "inputs": {
          "VAR": {
            "block": {
              "type": "nimble_scan_device_name",
              "id": "name_1"
            }
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **变量创建顺序**: 必须先创建对象（如服务端），才能创建依赖对象（如服务）
2. **Hat块位置**: 回调块独立放置，不连接到主程序流
3. **扫描回调变量**: 在`nimble_on_scan_result`回调内使用`scanDevice`相关块
4. **通知回调变量**: 在`nimble_remote_char_subscribe`回调内使用`notifyData`块
5. **field_input vs field_variable**: 创建对象用field_input，引用对象用field_variable

## 常见错误

- ❌ 在Hat块上添加next连接
- ❌ 在扫描回调外使用`nimble_scan_device_name`
- ❌ 未创建服务端就调用创建服务
- ❌ field_variable使用字符串格式而非对象格式

## 特征属性选项

| 值 | 说明 |
|----|------|
| READ_WRITE | 读+写 |
| READ | 只读 |
| WRITE | 只写 |
| READ_NOTIFY | 读+通知 |
| READ_WRITE_NOTIFY | 读+写+通知 |
| READ_WRITE_INDICATE | 读+写+指示 |

## 发射功率选项

| 值 | 功率 |
|----|------|
| -12 | -12 dBm |
| -9 | -9 dBm |
| -6 | -6 dBm |
| -3 | -3 dBm |
| 0 | 0 dBm |
| 3 | 3 dBm |
| 6 | 6 dBm |
| 9 | 9 dBm |

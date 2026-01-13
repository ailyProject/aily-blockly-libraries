# ESP32 BLE

ESP32蓝牙低功耗(BLE)库，支持服务端、客户端、扫描和UART通信功能。

## 库信息
- **库名**: @aily-project/lib-esp32_ble
- **版本**: 1.0.0
- **兼容**: ESP32系列开发板

## 块定义

### 设备管理
| 块类型 | 连接 | 字段/输入 | 生成代码 |
|--------|------|----------|----------|
| `esp32_ble_init` | 语句块 | NAME(input) | `BLEDevice::init(name);` |
| `esp32_ble_deinit` | 语句块 | RELEASE_MEMORY(dropdown) | `BLEDevice::deinit(false);` |
| `esp32_ble_get_address` | 值块 | - | `BLEDevice::getAddress().toString()` |
| `esp32_ble_set_mtu` | 语句块 | MTU(input) | `BLEDevice::setMTU(mtu);` |
| `esp32_ble_get_mtu` | 值块 | - | `BLEDevice::getMTU()` |

### 服务端
| 块类型 | 连接 | 字段/输入 | 生成代码 |
|--------|------|----------|----------|
| `esp32_ble_create_server` | 语句块 | VAR(field_input) | `pServer = BLEDevice::createServer();` |
| `esp32_ble_server_create_service` | 语句块 | SERVER(field_variable), SERVICE_VAR(field_input), UUID(input) | `pService = pServer->createService(uuid);` |
| `esp32_ble_service_start` | 语句块 | SERVICE(field_variable) | `pService->start();` |
| `esp32_ble_service_stop` | 语句块 | SERVICE(field_variable) | `pService->stop();` |
| `esp32_ble_server_connected_count` | 值块 | SERVER(field_variable) | `pServer->getConnectedCount()` |

### 特征值
| 块类型 | 连接 | 字段/输入 | 生成代码 |
|--------|------|----------|----------|
| `esp32_ble_create_characteristic` | 语句块 | SERVICE(field_variable), CHAR_VAR(field_input), UUID(input), PROPERTIES(dropdown) | `pChar = pService->createCharacteristic(uuid, props);` |
| `esp32_ble_characteristic_set_value` | 语句块 | CHAR(field_variable), VALUE(input) | `pChar->setValue(value);` |
| `esp32_ble_characteristic_get_value` | 值块 | CHAR(field_variable) | `pChar->getValue()` |
| `esp32_ble_characteristic_notify` | 语句块 | CHAR(field_variable) | `pChar->notify();` |
| `esp32_ble_add_descriptor` | 语句块 | CHAR(field_variable) | `pChar->addDescriptor(new BLE2902());` |

### 广播
| 块类型 | 连接 | 字段/输入 | 生成代码 |
|--------|------|----------|----------|
| `esp32_ble_start_advertising` | 语句块 | - | `BLEDevice::startAdvertising();` |
| `esp32_ble_stop_advertising` | 语句块 | - | `BLEDevice::stopAdvertising();` |
| `esp32_ble_advertising_add_service_uuid` | 语句块 | UUID(input) | `BLEDevice::getAdvertising()->addServiceUUID(uuid);` |
| `esp32_ble_advertising_set_scan_response` | 语句块 | ENABLED(dropdown) | `BLEDevice::getAdvertising()->setScanResponse(true);` |

### 事件回调（Hat块）
| 块类型 | 连接 | 字段/输入 | 说明 |
|--------|------|----------|------|
| `esp32_ble_on_connect` | Hat块 | SERVER(field_variable), HANDLER(statement) | 客户端连接时执行 |
| `esp32_ble_on_disconnect` | Hat块 | SERVER(field_variable), HANDLER(statement) | 客户端断开时执行 |
| `esp32_ble_on_write` | Hat块 | CHAR(field_variable), HANDLER(statement) | 特征值被写入时执行 |

### 客户端
| 块类型 | 连接 | 字段/输入 | 生成代码 |
|--------|------|----------|----------|
| `esp32_ble_create_client` | 语句块 | VAR(field_input) | `pClient = BLEDevice::createClient();` |
| `esp32_ble_client_connect` | 语句块 | CLIENT(field_variable), ADDRESS(input) | `pClient->connect(address);` |
| `esp32_ble_client_disconnect` | 语句块 | CLIENT(field_variable) | `pClient->disconnect();` |
| `esp32_ble_client_is_connected` | 值块 | CLIENT(field_variable) | `pClient->isConnected()` |
| `esp32_ble_client_get_service` | 语句块 | CLIENT(field_variable), SERVICE_VAR(field_input), UUID(input) | `pRemoteService = pClient->getService(uuid);` |
| `esp32_ble_remote_characteristic_read` | 值块 | CHAR(field_variable) | `pRemoteChar->readValue()` |
| `esp32_ble_remote_characteristic_write` | 语句块 | CHAR(field_variable), VALUE(input) | `pRemoteChar->writeValue(value);` |

### 扫描
| 块类型 | 连接 | 字段/输入 | 生成代码 |
|--------|------|----------|----------|
| `esp32_ble_get_scan` | 语句块 | VAR(field_input) | `pBLEScan = BLEDevice::getScan();` |
| `esp32_ble_scan_start` | 语句块 | SCAN(field_variable), DURATION(input) | `pBLEScan->start(duration);` |
| `esp32_ble_scan_stop` | 语句块 | SCAN(field_variable) | `pBLEScan->stop();` |
| `esp32_ble_scan_results_count` | 值块 | RESULTS(input) | `results->getCount()` |
| `esp32_ble_advertised_device_name` | 值块 | DEVICE(input) | `device.getName()` |
| `esp32_ble_advertised_device_address` | 值块 | DEVICE(input) | `device.getAddress().toString()` |

### 快速操作-UART
| 块类型 | 连接 | 字段/输入 | 说明 |
|--------|------|----------|------|
| `esp32_ble_uart_server_quick` | 语句块 | NAME(input) | 一键创建BLE UART服务端(Nordic UART Service) |
| `esp32_ble_uart_send` | 语句块 | DATA(input) | 通过BLE UART发送数据 |
| `esp32_ble_uart_on_receive` | Hat块 | HANDLER(statement) | 收到数据时执行 |
| `esp32_ble_uart_received_data` | 值块 | - | 获取接收到的数据 |
| `esp32_ble_uart_is_connected` | 值块 | - | 检查UART是否已连接 |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "pServer"` |
| field_dropdown | 字符串 | `"PROPERTIES": "BLECharacteristic::PROPERTY_READ"` |
| field_variable | 对象 | `"SERVER": {"id": "var_id"}` |
| input_value | 块连接 | `"inputs": {"NAME": {"shadow": {"type": "text"}}}` |
| input_statement | 块连接 | `"inputs": {"HANDLER": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **Hat块**: 无连接属性，回调块返回空字符串

## 变量类型

库使用以下自定义变量类型：
- `BLEServer` - 服务端对象
- `BLEService` - 服务对象
- `BLECharacteristic` - 特征值对象
- `BLEClient` - 客户端对象
- `BLERemoteService` - 远程服务对象
- `BLERemoteCharacteristic` - 远程特征值对象
- `BLEScan` - 扫描器对象

## 使用示例

### BLE服务端示例
```json
{
  "type": "esp32_ble_init",
  "id": "init_1",
  "inputs": {
    "NAME": {
      "shadow": {
        "type": "text",
        "fields": {"TEXT": "ESP32-BLE"}
      }
    }
  },
  "next": {
    "block": {
      "type": "esp32_ble_create_server",
      "id": "server_1",
      "fields": {"VAR": "pServer"},
      "next": {
        "block": {
          "type": "esp32_ble_server_create_service",
          "id": "service_1",
          "fields": {
            "SERVER": {"id": "server_var_id"},
            "SERVICE_VAR": "pService"
          },
          "inputs": {
            "UUID": {
              "shadow": {
                "type": "text",
                "fields": {"TEXT": "4fafc201-1fb5-459e-8fcc-c5c9c331914b"}
              }
            }
          }
        }
      }
    }
  }
}
```

### BLE UART快速模式
```json
{
  "type": "esp32_ble_uart_server_quick",
  "id": "uart_1",
  "inputs": {
    "NAME": {
      "shadow": {
        "type": "text",
        "fields": {"TEXT": "ESP32-UART"}
      }
    }
  }
}
```

## 重要规则

1. **初始化顺序**: 必须先调用`esp32_ble_init`初始化BLE设备
2. **服务启动**: 创建特征值后需要调用`esp32_ble_service_start`启动服务
3. **广播开启**: 服务启动后需要调用`esp32_ble_start_advertising`开始广播
4. **通知功能**: 使用notify前需要先调用`esp32_ble_add_descriptor`添加描述符
5. **快速UART模式**: 使用`esp32_ble_uart_server_quick`可一键创建完整的UART服务

## 常用UUID

- **服务UUID**: `4fafc201-1fb5-459e-8fcc-c5c9c331914b`
- **特征UUID**: `beb5483e-36e1-4688-b7f5-ea07361b26a8`
- **Nordic UART Service**: `6E400001-B5A3-F393-E0A9-E50E24DCCA9E`
- **UART RX**: `6E400002-B5A3-F393-E0A9-E50E24DCCA9E`
- **UART TX**: `6E400003-B5A3-F393-E0A9-E50E24DCCA9E`

## 特征属性

| 属性 | 说明 |
|------|------|
| 读取 | PROPERTY_READ |
| 写入 | PROPERTY_WRITE |
| 通知 | PROPERTY_NOTIFY |
| 广播 | PROPERTY_BROADCAST |
| 指示 | PROPERTY_INDICATE |
| 无响应写入 | PROPERTY_WRITE_NR |

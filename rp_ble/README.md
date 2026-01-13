# Pico BLE蓝牙库

树莓派Pico BLE蓝牙库，基于BTstackLib实现，支持BLE外设模式、中心模式、iBeacon和GATT服务。

## 库信息
- **库名**: @aily-project/lib-rp-ble
- **版本**: 1.0.0
- **兼容**: rp2040:rp2040 (Raspberry Pi Pico W)

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `rp_ble_setup` | 语句块 | NAME(input_value) | `"inputs":{"NAME":{...}}` | `BTstack.setup(name);` |
| `rp_ble_setup_simple` | 语句块 | 无 | 无字段 | `BTstack.setup();` |
| `rp_ble_start_advertising` | 语句块 | 无 | 无字段 | `BTstack.startAdvertising();` |
| `rp_ble_stop_advertising` | 语句块 | 无 | 无字段 | `BTstack.stopAdvertising();` |
| `rp_ble_ibeacon_configure` | 语句块 | UUID/MAJOR/MINOR(input_value) | `"inputs":{...}` | `BTstack.iBeaconConfigure(...);` |
| `rp_ble_start_scanning` | 语句块 | 无 | 无字段 | `BTstack.bleStartScanning();` |
| `rp_ble_stop_scanning` | 语句块 | 无 | 无字段 | `BTstack.bleStopScanning();` |
| `rp_ble_on_advertisement` | Hat块 | ADV_VAR(field_input), HANDLER(input_statement) | `"fields":{"ADV_VAR":"bleAdv"}` | 回调函数 |
| `rp_ble_adv_get_address` | 值块 | ADV_VAR(field_variable) | `"fields":{"VAR":{"id":"xxx"}}` | `bleAdv->getBdAddr()->getAddressString()` |
| `rp_ble_adv_get_rssi` | 值块 | ADV_VAR(field_variable) | `"fields":{"VAR":{"id":"xxx"}}` | `bleAdv->getRssi()` |
| `rp_ble_adv_is_ibeacon` | 值块 | ADV_VAR(field_variable) | `"fields":{"VAR":{"id":"xxx"}}` | `bleAdv->isIBeacon()` |
| `rp_ble_adv_name_has_prefix` | 值块 | ADV_VAR(field_variable), PREFIX(input_value) | 混合格式 | `bleAdv->nameHasPrefix(prefix)` |
| `rp_ble_add_service` | 语句块 | UUID(input_value) | `"inputs":{"UUID":{...}}` | `BTstack.addGATTService(...);` |
| `rp_ble_add_characteristic` | 语句块 | UUID(input_value), PROPS(dropdown), VALUE(input_value) | 混合格式 | `BTstack.addGATTCharacteristic(...);` |
| `rp_ble_add_characteristic_dynamic` | 语句块 | UUID(input_value), PROPS(dropdown), CHAR_ID(input_value) | 混合格式 | `BTstack.addGATTCharacteristicDynamic(...);` |
| `rp_ble_on_device_connected` | Hat块 | DEV_VAR(field_input), HANDLER(input_statement) | `"fields":{"DEV_VAR":"bleDevice"}` | 回调函数 |
| `rp_ble_on_device_disconnected` | Hat块 | HANDLER(input_statement) | `"inputs":{"HANDLER":{...}}` | 回调函数 |
| `rp_ble_on_characteristic_read` | Hat块 | CHAR_ID_VAR/BUFFER_VAR/SIZE_VAR(field_input), HANDLER(input_statement), RETURN_SIZE(input_value) | 混合格式 | 读取回调函数 |
| `rp_ble_on_characteristic_write` | Hat块 | CHAR_ID_VAR/DATA_VAR/LEN_VAR(field_input), HANDLER(input_statement) | 混合格式 | 写入回调函数 |
| `rp_ble_write_buffer` | 语句块 | BUFFER_VAR(field_variable), DATA(input_value) | 混合格式 | `buffer[0] = data;` |
| `rp_ble_connect` | 语句块 | ADDRESS/TIMEOUT(input_value) | `"inputs":{...}` | `BTstack.bleConnect(...);` |
| `rp_ble_connect_adv` | 语句块 | ADV_VAR(field_variable), TIMEOUT(input_value) | 混合格式 | `BTstack.bleConnect(adv, timeout);` |
| `rp_ble_disconnect` | 语句块 | DEV_VAR(field_variable) | `"fields":{"VAR":{"id":"xxx"}}` | `BTstack.bleDisconnect(device);` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"ADV_VAR": "bleAdv"` |
| field_dropdown | 字符串 | `"PROPS": "ATT_PROPERTY_READ"` |
| field_variable | 对象 | `"ADV_VAR": {"id": "var_id"}` |
| input_value | 块连接 | `"inputs": {"NAME": {"shadow": {...}}}` |
| input_statement | 块连接 | `"inputs": {"HANDLER": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **Hat块**: 回调事件块，无连接属性，通过`inputs`连接内部语句
- **特殊规则**: 回调块(on_xxx)自动注册到setup，无需手动调用

## 特征属性选项

| 选项 | 值 | 说明 |
|------|-----|------|
| 只读 | `ATT_PROPERTY_READ` | 允许读取 |
| 只写 | `ATT_PROPERTY_WRITE` | 允许写入 |
| 读写 | `ATT_PROPERTY_READ \| ATT_PROPERTY_WRITE` | 允许读写 |
| 通知 | `ATT_PROPERTY_NOTIFY` | 支持通知 |
| 读+通知 | `ATT_PROPERTY_READ \| ATT_PROPERTY_NOTIFY` | 读取和通知 |
| 读写+通知 | `ATT_PROPERTY_READ \| ATT_PROPERTY_WRITE \| ATT_PROPERTY_NOTIFY` | 完整权限 |

## 使用示例

### BLE外设模式 (Peripheral)
```json
{
  "type": "arduino_setup",
  "id": "setup_id",
  "inputs": {
    "ARDUINO_SETUP": {
      "block": {
        "type": "rp_ble_add_service",
        "id": "service_id",
        "inputs": {
          "UUID": {
            "shadow": {
              "type": "text",
              "fields": {"TEXT": "B8E06067-62AD-41BA-9231-206AE80AB551"}
            }
          }
        },
        "next": {
          "block": {
            "type": "rp_ble_add_characteristic",
            "id": "char_id",
            "fields": {"PROPS": "ATT_PROPERTY_READ"},
            "inputs": {
              "UUID": {
                "shadow": {
                  "type": "text",
                  "fields": {"TEXT": "f897177b-aee8-4767-8ecc-cc694fd5fcef"}
                }
              },
              "VALUE": {
                "shadow": {
                  "type": "text",
                  "fields": {"TEXT": "Hello BLE"}
                }
              }
            },
            "next": {
              "block": {
                "type": "rp_ble_setup",
                "id": "setup_ble_id",
                "inputs": {
                  "NAME": {
                    "shadow": {
                      "type": "text",
                      "fields": {"TEXT": "Pico BLE"}
                    }
                  }
                },
                "next": {
                  "block": {
                    "type": "rp_ble_start_advertising",
                    "id": "adv_id"
                  }
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

### iBeacon模式
```json
{
  "type": "rp_ble_setup_simple",
  "id": "setup_id",
  "next": {
    "block": {
      "type": "rp_ble_ibeacon_configure",
      "id": "ibeacon_id",
      "inputs": {
        "UUID": {
          "shadow": {
            "type": "text",
            "fields": {"TEXT": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0"}
          }
        },
        "MAJOR": {
          "shadow": {
            "type": "math_number",
            "fields": {"NUM": 4711}
          }
        },
        "MINOR": {
          "shadow": {
            "type": "math_number",
            "fields": {"NUM": 2}
          }
        }
      },
      "next": {
        "block": {
          "type": "rp_ble_start_advertising",
          "id": "adv_id"
        }
      }
    }
  }
}
```

### 设备扫描
```json
{
  "type": "rp_ble_on_advertisement",
  "id": "adv_callback_id",
  "fields": {"ADV_VAR": "bleAdv"},
  "inputs": {
    "HANDLER": {
      "block": {
        "type": "serial_println",
        "id": "print_id",
        "fields": {"SERIAL": "Serial"},
        "inputs": {
          "VAR": {
            "block": {
              "type": "rp_ble_adv_get_address",
              "id": "addr_id",
              "fields": {"ADV_VAR": {"id": "adv_var_id"}}
            }
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **必须调用setup**: 使用BLE功能前必须调用`rp_ble_setup`或`rp_ble_setup_simple`
2. **服务在setup前添加**: GATT服务和特征必须在调用`BTstack.setup()`之前添加
3. **自动loop**: 库自动在主循环添加`BTstack.loop()`
4. **回调自动注册**: 事件回调块会自动在setup中注册
5. **变量类型**: 
   - `BLEAdvertisement` - 广播数据指针
   - `BLEDevice` - 设备连接指针
   - `uint8_t*` - 缓冲区指针

## 常见错误

- ❌ 在setup之后添加GATT服务 - 服务不会生效
- ❌ 忘记调用startAdvertising - 设备不可被发现
- ❌ 回调中使用局部变量的指针 - 数据可能失效

## 变量定义

回调块中的变量会自动创建为形参，无需在variables数组中定义：
- `bleAdv` (BLEAdvertisement*) - 广播数据
- `bleDevice` (BLEDevice*) - 连接设备
- `buffer` (uint8_t*) - 读取回调缓冲区
- `data` (uint8_t*) - 写入回调数据

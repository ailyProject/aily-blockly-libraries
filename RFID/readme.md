# RFID读卡器库
基于 Miguel Balboa 的 [MFRC522](https://github.com/miguelbalboa/rfid) Arduino 库封装，提供多读卡器实例、卡片检测、UID 读取、密钥验证与数据块读写等核心流程。

## 库信息
- **库名**: @aily-project/lib-rfid
- **版本**: 0.0.1
- **兼容**: arduino:avr / esp32:esp32 / esp32:esp32c3 / esp32:esp32s3 / renesas_uno:minima / renesas_uno:unor4wifi

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|-----------|----------|----------|
| `rfid_init` | 语句块 | `VAR(field_input), SDA_PIN(field_dropdown), RST_PIN(field_dropdown)` | `"fields":{"VAR":"rfid","SDA_PIN":"10","RST_PIN":"9"}` | `register → MFRC522 rfid(10, 9); SPI.begin(); rfid.PCD_Init();` |
| `rfid_is_card_present` | 值块 | `VAR(field_variable)` | `"fields":{"VAR":{"id":"rfid_id"}}` | `rfid.PICC_IsNewCardPresent()` |
| `rfid_read_uid` | 值块 | `VAR(field_variable)` | `"fields":{"VAR":{"id":"rfid_id"}}` | `rfid.PICC_ReadCardSerial()?rfidUidToString(rfid):""` |
| `rfid_get_uid_string` | 值块 | `VAR(field_variable)` | `"fields":{"VAR":{"id":"rfid_id"}}` | `rfidUidToString(rfid)` |
| `rfid_uid_equals` | 值块 | `VAR(field_variable), UID(input_value)` | `"inputs":{"UID":{"shadow":{"type":"text","fields":{"TEXT":"04A1B2C3"}}}}` | `rfidUidToString(rfid)==rfidNormalizeHexString(String(UID))` |
| `rfid_authenticate` | 值块 | `VAR(field_variable), SECTOR(input_value), KEY_TYPE(field_dropdown), KEY(input_value)` | `"fields":{"KEY_TYPE":"PICC_CMD_MF_AUTH_KEY_A"}` + `"inputs":{"SECTOR":{"shadow":{"type":"math_number","fields":{"NUM":1}}},"KEY":{"shadow":{"type":"text","fields":{"TEXT":"FFFFFFFFFFFF"}}}}` | `rfidAuthenticateSector(rfid, sector, MFRC522::KEY_TYPE, key)` |
| `rfid_read_block` | 值块 | `VAR(field_variable), BLOCK(input_value)` | `"inputs":{"BLOCK":{"shadow":{"type":"math_number","fields":{"NUM":4}}}}` | `rfidReadBlockHex(rfid, block)` |
| `rfid_write_block` | 语句块 | `VAR(field_variable), BLOCK(input_value), DATA(input_value)` | `"inputs":{"DATA":{"shadow":{"type":"text","fields":{"TEXT":"Hello RFID!"}}}}` | `rfidWriteBlockData(rfid, block, data);` |
| `rfid_halt` | 语句块 | `VAR(field_variable)` | `{"type":"rfid_halt","fields":{"VAR":{"id":"rfid_id"}}}` | `rfid.PICC_HaltA(); rfid.PCD_StopCrypto1();` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"fields":{"VAR":"rfid"}` |
| field_dropdown | 字符串 | `"fields":{"KEY_TYPE":"PICC_CMD_MF_AUTH_KEY_A"}` |
| field_variable | 对象 | `"fields":{"VAR":{"id":"rfid_id"}}` |
| input_value | 块连接 | `"inputs":{"BLOCK":{"shadow":{...}}}` |
| input_statement | 块连接 | `"inputs":{"HANDLER":{"block":{...}}}` |

## 连接规则
- **语句块**: `rfid_init`、`rfid_write_block`、`rfid_halt` 具备 previous/next，通常放在 `setup` 或控制语句中串联，`rfid_init` 负责注册 `RFIDReader` 变量类型。
- **值块**: `rfid_is_card_present`、`rfid_read_uid` 等只有 `output`，可嵌入条件、变量赋值和表达式中。
- **Hat块**: 本库无 Hat 块，事件驱动需结合控制类或 OneButton 等库。
- **特殊规则**: `rfid_read_uid` 会在内部调用 `PICC_ReadCardSerial()` 并更新 `reader.uid`；`rfid_get_uid_string`/`rfid_uid_equals` 依赖最近一次读取；`rfid_halt` 同时调用 `PICC_HaltA` 与 `PCD_StopCrypto1` 结束加密会话。

## 使用示例

### 多实例卡片检测
```json
{
  "blocks": {
    "languageVersion": 0,
    "blocks": [
      {
        "type": "arduino_setup",
        "id": "setup",
        "deletable": false,
        "inputs": {
          "ARDUINO_SETUP": {
            "block": {
              "type": "rfid_init",
              "id": "init1",
              "fields": {"VAR": "reader1", "SDA_PIN": "10", "RST_PIN": "9"},
              "next": {
                "block": {
                  "type": "controls_if",
                  "id": "if1",
                  "inputs": {
                    "IF0": {
                      "block": {
                        "type": "rfid_is_card_present",
                        "id": "present1",
                        "fields": {"VAR": {"id": "reader1"}}
                      }
                    },
                    "DO0": {
                      "block": {
                        "type": "text_print",
                        "id": "print1",
                        "inputs": {
                          "TEXT": {
                            "block": {
                              "type": "rfid_read_uid",
                              "id": "read1",
                              "fields": {"VAR": {"id": "reader1"}}
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
        }
      }
    ]
  },
  "variables": [{"id": "reader1", "name": "reader1", "type": "RFIDReader"}]
}
```

### 验证扇区并读写块
```json
{
  "type": "rfid_init",
  "fields": {"VAR": "reader1", "SDA_PIN": "10", "RST_PIN": "9"},
  "next": {
    "block": {
      "type": "controls_if",
      "inputs": {
        "IF0": {
          "block": {
            "type": "rfid_is_card_present",
            "fields": {"VAR": {"id": "reader1"}}
          }
        },
        "DO0": {
          "block": {
            "type": "controls_if",
            "inputs": {
              "IF0": {
                "block": {
                  "type": "rfid_authenticate",
                  "fields": {"VAR": {"id": "reader1"}, "KEY_TYPE": "PICC_CMD_MF_AUTH_KEY_A"},
                  "inputs": {
                    "SECTOR": {"block": {"type": "math_number", "fields": {"NUM": 1}}},
                    "KEY": {"block": {"type": "text", "fields": {"TEXT": "FFFFFFFFFFFF"}}}
                  }
                }
              },
              "DO0": {
                "block": {
                  "type": "rfid_write_block",
                  "fields": {"VAR": {"id": "reader1"}},
                  "inputs": {
                    "BLOCK": {"block": {"type": "math_number", "fields": {"NUM": 4}}},
                    "DATA": {"block": {"type": "text", "fields": {"TEXT": "Hello RFID!"}}}
                  },
                  "next": {
                    "block": {
                      "type": "text_print",
                      "fields": {},
                      "inputs": {
                        "TEXT": {
                          "block": {
                            "type": "rfid_read_block",
                            "fields": {"VAR": {"id": "reader1"}},
                            "inputs": {
                              "BLOCK": {"block": {"type": "math_number", "fields": {"NUM": 4}}}
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
        }
      }
    }
  }
}
```

## 重要规则
1. **必须遵守**: 每个 `RFIDReader` 变量需通过 `rfid_init` 注册一次，生成的 `MFRC522` 对象共享全局 SPI；密钥字符串必须为 12 个十六进制字符（6 字节）。
2. **连接限制**: `rfid_write_block`、`rfid_halt` 为语句块只能放在语句序列；在 `rfid_authenticate` 返回 true 之后才能进行 `MIFARE_Read/Write` 以避免 `STATUS_ERROR`。
3. **常见错误**: ❌ 未调用 `rfid_is_card_present`/`rfid_read_uid` 就直接认证导致 `reader.uid` 未填充；❌ 写入数据超出 16 字节；❌ 忘记 `rfid_halt` 关闭加密导致下一张卡读写失败。

## 支持的关键参数
- `RFIDReader` 变量类型可创建多个读卡器实例（不同 SS/RST）。
- `KEY_TYPE`: `PICC_CMD_MF_AUTH_KEY_A` / `PICC_CMD_MF_AUTH_KEY_B`；默认 shadow 为 Key A。
- `SECTOR`/`BLOCK`: 0–15 扇区、0–63 块，`rfid_read_block`/`rfid_write_block` 块在工具箱中默认填入 1、4，可按需修改。
- `DATA` 输入支持 16 字节文本或 32 字符十六进制；十六进制字符串会自动转大写写入。
- 电气：MFRC522 仅支持 3.3V 逻辑；在 5V 板卡上需保证逻辑电平兼容。

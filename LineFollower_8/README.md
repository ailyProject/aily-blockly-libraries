# LineFollower_8

八路巡线传感器库，支持I2C通信、状态检测、偏移量计算、RGB灯控制

## 库信息
- **库名**: @aily-project/lib-linefollower-8
- **版本**: 1.0.0
- **兼容**: ESP32平台

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `line_init` | 语句块 | WIRE(field_dropdown) | `"fields":{"WIRE":"Wire"}` | `sensor.begin()` |
| `line_is_state` | 值块 | STATE(field_dropdown) | `"fields":{"STATE":"24"}` | `sensor.isState(24)` 返回Boolean |
| `line_get_state` | 值块 | 无 | 无 | `sensor.getState()` 返回0-255 |
| `line_offset` | 值块 | 无 | 无 | `sensor.getOffset()` 返回-7~+7 |
| `line_sensor_value` | 值块 | SENSOR(field_dropdown) | `"fields":{"SENSOR":"0"}` | `sensor.getValue(0)` 返回0-4095 |
| `line_sensor_reference` | 值块 | SENSOR(field_dropdown) | `"fields":{"SENSOR":"0"}` | `sensor.getReference(0)` 返回0-4095 |
| `line_sensor_digital` | 值块 | SENSOR(field_dropdown) | `"fields":{"SENSOR":"0"}` | `sensor.getDigital(0)` 返回0或1 |
| `line_set_rgb` | 语句块 | COLOR(field_dropdown) | `"fields":{"COLOR":"2"}` | `sensor.setRGB(2)` |
| `line_set_frequency` | 语句块 | INTERVAL(input_value) | `"inputs":{"INTERVAL":{"block":{"type":"math_number","fields":{"NUM":"100"}}}}` | `sensor.setFrequency(100)` |
| `line_print_data` | 语句块 | 无 | 无 | `sensor.printData()` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown(WIRE) | 字符串 | `"WIRE": "Wire"` (从board.json的i2c获取) |
| field_dropdown(STATE) | 数值字符串 | `"STATE": "24"` |
| field_dropdown(SENSOR) | 数值字符串 | `"SENSOR": "0"` |
| field_dropdown(COLOR) | 数值字符串 | `"COLOR": "2"` |
| input_value | 块连接 | `"inputs": {"INTERVAL": {"block": {"type": "math_number", "fields": {"NUM": "100"}}}}` |

## 连接规则

- **语句块**: 初始化块(line_init)、RGB控制块(line_set_rgb)、频率设置块(line_set_frequency)、打印块(line_print_data)有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 状态判断块(line_is_state)、状态获取块(line_get_state)、偏移量块(line_offset)、传感器值块(line_sensor_value/reference/digital)有output，连接到`inputs`中，无`next`字段
- **特殊规则**:
  - 初始化块必须在setup()中执行
  - 8路传感器编号A0-A7对应SENSOR值0-7
  - 状态值为8位二进制编码(0-255)
  - 偏移量权重：A0=-7, A1=-5, A2=-3, A3=-1, A4=+1, A5=+3, A6=+5, A7=+7

### 动态选项处理
当遇到`"options": "${board.i2c}"`格式时：
1. 从**board.json**文件中获取I2C接口数组
2. 在.abi文件中使用数组中的value值(如"Wire"、"Wire1")

## 使用示例

### PID巡线控制
```json
{
  "type": "line_init",
  "fields": {"WIRE": "Wire"},
  "next": {
    "block": {
      "type": "controls_repeat_ext",
      "inputs": {
        "TIMES": {"block": {"type": "math_number", "fields": {"NUM": "infinity"}}},
        "DO": {
          "block": {
            "type": "variables_set",
            "fields": {"VAR": {"id": "offset_id"}},
            "inputs": {
              "VALUE": {
                "block": {
                  "type": "line_offset"
                }
              }
            },
            "next": {
              "block": {
                "type": "variables_set",
                "fields": {"VAR": {"id": "left_speed_id"}},
                "inputs": {
                  "VALUE": {
                    "block": {
                      "type": "math_arithmetic",
                      "fields": {"OP": "MINUS"},
                      "inputs": {
                        "A": {"block": {"type": "math_number", "fields": {"NUM": "100"}}},
                        "B": {
                          "block": {
                            "type": "math_arithmetic",
                            "fields": {"OP": "MULTIPLY"},
                            "inputs": {
                              "A": {"block": {"type": "variables_get", "fields": {"VAR": {"id": "offset_id"}}}},
                              "B": {"block": {"type": "math_number", "fields": {"NUM": "10"}}}
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

### 状态检测与RGB指示
```json
{
  "type": "line_init",
  "fields": {"WIRE": "Wire"},
  "next": {
    "block": {
      "type": "controls_repeat_ext",
      "inputs": {
        "TIMES": {"block": {"type": "math_number", "fields": {"NUM": "infinity"}}},
        "DO": {
          "block": {
            "type": "controls_if",
            "extraState": {"elseIfCount": 1, "hasElse": true},
            "inputs": {
              "IF0": {
                "block": {
                  "type": "line_is_state",
                  "fields": {"STATE": "24"}
                }
              },
              "DO0": {
                "block": {
                  "type": "line_set_rgb",
                  "fields": {"COLOR": "2"}
                }
              },
              "IF1": {
                "block": {
                  "type": "line_is_state",
                  "fields": {"STATE": "0"}
                }
              },
              "DO1": {
                "block": {
                  "type": "line_set_rgb",
                  "fields": {"COLOR": "1"}
                }
              },
              "ELSE": {
                "block": {
                  "type": "line_set_rgb",
                  "fields": {"COLOR": "4"}
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

### 获取传感器详细数据
```json
{
  "type": "controls_for",
  "fields": {"VAR": {"id": "i_id"}},
  "inputs": {
    "FROM": {"block": {"type": "math_number", "fields": {"NUM": "0"}}},
    "TO": {"block": {"type": "math_number", "fields": {"NUM": "7"}}},
    "BY": {"block": {"type": "math_number", "fields": {"NUM": "1"}}},
    "DO": {
      "block": {
        "type": "serial_print",
        "fields": {"SERIAL": "Serial"},
        "inputs": {
          "VAR": {
            "block": {
              "type": "line_sensor_value",
              "fields": {"SENSOR": "0"}
            }
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: 使用前必须调用初始化块line_init，I2C地址固定为0x27，块ID必须唯一
2. **连接限制**: 初始化块和控制块是语句块有next连接，状态和传感器值块是值块无next字段，只能作为input_value使用
3. **传感器编号**: A0-A7对应SENSOR值0-7，数组索引从0开始
4. **状态值编码**: 8路传感器对应8位二进制，每位表示一个传感器状态(1=检测到黑线)
5. **常见错误**:
   - ❌ 未初始化直接读取传感器数据
   - ❌ SENSOR值超出0-7范围
   - ❌ STATE值使用错误的数值
   - ❌ 数字值判断逻辑错误(当前值>=参考值为1)
   - ❌ RGB颜色值超出0-7范围
   - ❌ 频率设置过低导致数据更新延迟

## 支持的字段选项

### STATE(线路状态)
- `"0"`: 00000000 全白
- `"24"`: 00011000 中间两路
- `"60"`: 00111100 中间四路
- `"126"`: 01111110 中间六路
- `"255"`: 11111111 全黑
- `"1"`: A0单路
- `"2"`: A1单路
- `"4"`: A2单路
- `"8"`: A3单路
- `"16"`: A4单路
- `"32"`: A5单路
- `"64"`: A6单路
- `"128"`: A7单路

### SENSOR(传感器编号)
- `"0"`: A0传感器
- `"1"`: A1传感器
- `"2"`: A2传感器
- `"3"`: A3传感器
- `"4"`: A4传感器
- `"5"`: A5传感器
- `"6"`: A6传感器
- `"7"`: A7传感器

### COLOR(RGB颜色)
- `"0"`: 关闭
- `"1"`: 红色
- `"2"`: 绿色
- `"3"`: 蓝色
- `"4"`: 白色
- `"5"`: 黄色
- `"6"`: 青色
- `"7"`: 紫色

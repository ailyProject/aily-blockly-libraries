# Ps3Controller

PS3蓝牙手柄控制库，支持按键检测、摇杆读取、震动反馈、连接状态检查

## 库信息
- **库名**: @aily-project/lib-ps3controller
- **版本**: 1.0.0
- **兼容**: ESP32平台

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `ps3_init` | 语句块 | MAC_ADDR(input_value) | `"inputs":{"MAC_ADDR":{"block":{"type":"text","fields":{"TEXT":"a0:5a:5a:a0:10:09"}}}}` | `Ps3.begin("a0:5a:5a:a0:10:09")` |
| `ps3_button_pressed` | 值块 | BUTTON(field_dropdown) | `"fields":{"BUTTON":"cross"}` | `Ps3.data.button.cross` 返回Boolean |
| `ps3_stick_value` | 值块 | STICK(field_dropdown), AXIS(field_dropdown) | `"fields":{"STICK":"l","AXIS":"x"}` | `Ps3.data.analog.stick.lx` 返回-128~127 |
| `ps3_is_connected` | 值块 | 无 | 无 | `Ps3.isConnected()` 返回Boolean |
| `ps3_set_rumble` | 语句块 | INTENSITY(input_value), DURATION(input_value) | `"inputs":{"INTENSITY":{"block":{"type":"math_number","fields":{"NUM":"50"}}},"DURATION":{"block":{"type":"math_number","fields":{"NUM":"1000"}}}}` | `Ps3.setRumble(50,1000)` |
| `ps3_set_player` | 语句块 | PLAYER(field_dropdown) | `"fields":{"PLAYER":"1"}` | `Ps3.setPlayer(1)` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| input_value(MAC_ADDR) | 块连接 | `"inputs": {"MAC_ADDR": {"block": {"type": "text", "fields": {"TEXT": "a0:5a:5a:a0:10:09"}}}}` |
| field_dropdown(BUTTON) | 字符串 | `"BUTTON": "cross"` |
| field_dropdown(STICK) | 字符串 | `"STICK": "l"` (左摇杆) |
| field_dropdown(AXIS) | 字符串 | `"AXIS": "x"` |
| field_dropdown(PLAYER) | 数值字符串 | `"PLAYER": "1"` |
| input_value(INTENSITY) | 块连接 | `"inputs": {"INTENSITY": {"block": {"type": "math_number", "fields": {"NUM": "50"}}}}` |
| input_value(DURATION) | 块连接 | `"inputs": {"DURATION": {"block": {"type": "math_number", "fields": {"NUM": "1000"}}}}` |

## 连接规则

- **语句块**: 初始化块(ps3_init)、震动控制块(ps3_set_rumble)、玩家设置块(ps3_set_player)有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 按键检测块(ps3_button_pressed)、摇杆值块(ps3_stick_value)、连接状态块(ps3_is_connected)有output，连接到`inputs`中，无`next`字段
- **特殊规则**:
  - 初始化块必须在setup()中执行，需要提供ESP32的MAC地址
  - 摇杆值范围：-128(最小)到127(最大)，中心位置约为0
  - 震动强度范围：0-100，持续时间范围：0-5000毫秒
  - 玩家编号控制LED指示灯，范围：1-4

## 使用示例

### 按键控制示例
```json
{
  "type": "ps3_init",
  "inputs": {
    "MAC_ADDR": {
      "shadow": {
        "type": "text",
        "fields": {"TEXT": "a0:5a:5a:a0:10:09"}
      }
    }
  },
  "next": {
    "block": {
      "type": "controls_if",
      "inputs": {
        "IF0": {
          "block": {
            "type": "ps3_is_connected"
          }
        },
        "DO0": {
          "block": {
            "type": "controls_if",
            "inputs": {
              "IF0": {
                "block": {
                  "type": "ps3_button_pressed",
                  "fields": {"BUTTON": "cross"}
                }
              },
              "DO0": {
                "block": {
                  "type": "serial_println",
                  "fields": {"SERIAL": "Serial"},
                  "inputs": {
                    "VAR": {
                      "shadow": {
                        "type": "text",
                        "fields": {"TEXT": "Cross button pressed"}
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

### 摇杆控制示例
```json
{
  "type": "controls_repeat_ext",
  "inputs": {
    "TIMES": {"block": {"type": "math_number", "fields": {"NUM": "infinity"}}},
    "DO": {
      "block": {
        "type": "controls_if",
        "inputs": {
          "IF0": {
            "block": {
              "type": "ps3_is_connected"
            }
          },
          "DO0": {
            "block": {
              "type": "variables_set",
              "fields": {"VAR": {"id": "lx_id"}},
              "inputs": {
                "VALUE": {
                  "block": {
                    "type": "ps3_stick_value",
                    "fields": {"STICK": "l", "AXIS": "x"}
                  }
                }
              },
              "next": {
                "block": {
                  "type": "variables_set",
                  "fields": {"VAR": {"id": "ly_id"}},
                  "inputs": {
                    "VALUE": {
                      "block": {
                        "type": "ps3_stick_value",
                        "fields": {"STICK": "l", "AXIS": "y"}
                      }
                    }
                  },
                  "next": {
                    "block": {
                      "type": "serial_print",
                      "fields": {"SERIAL": "Serial"},
                      "inputs": {
                        "VAR": {
                          "block": {
                            "type": "text_join",
                            "extraState": {"itemCount": 4},
                            "inputs": {
                              "ADD0": {"block": {"type": "text", "fields": {"TEXT": "LX="}}},
                              "ADD1": {"block": {"type": "variables_get", "fields": {"VAR": {"id": "lx_id"}}}},
                              "ADD2": {"block": {"type": "text", "fields": {"TEXT": " LY="}}},
                              "ADD3": {"block": {"type": "variables_get", "fields": {"VAR": {"id": "ly_id"}}}}
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

### 震动反馈示例
```json
{
  "type": "controls_if",
  "inputs": {
    "IF0": {
      "block": {
        "type": "ps3_button_pressed",
        "fields": {"BUTTON": "triangle"}
      }
    },
    "DO0": {
      "block": {
        "type": "ps3_set_rumble",
        "inputs": {
          "INTENSITY": {
            "shadow": {
              "type": "math_number",
              "fields": {"NUM": "80"}
            }
          },
          "DURATION": {
            "shadow": {
              "type": "math_number",
              "fields": {"NUM": "500"}
            }
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: 初始化块必须在setup()中执行，MAC地址格式必须正确(如"a0:5a:5a:a0:10:09")，块ID必须唯一
2. **连接限制**: 初始化块和控制块是语句块有next连接，检测和读取块是值块无next字段，只能作为input_value使用
3. **数值范围**: 摇杆值-128到127，震动强度0-100，震动时间0-5000ms，玩家编号1-4
4. **配对要求**: 首次使用需要配对手柄，ESP32 MAC地址可通过WiFi.macAddress()获取
5. **常见错误**:
   - MAC地址格式错误(必须是"xx:xx:xx:xx:xx:xx"格式)
   - 未检查连接状态就读取按键或摇杆
   - 震动强度或时间超出范围
   - 玩家编号超出1-4范围
   - 在未初始化的情况下使用手柄功能

## 支持的字段选项

### BUTTON(按键名称)
- `"cross"`: Cross (×) 叉键
- `"square"`: Square (□) 方块键
- `"triangle"`: Triangle (△) 三角键
- `"circle"`: Circle (○) 圆圈键
- `"up"`: Up 上方向键
- `"down"`: Down 下方向键
- `"left"`: Left 左方向键
- `"right"`: Right 右方向键
- `"l1"`: L1肩键
- `"l2"`: L2扳机
- `"r1"`: R1肩键
- `"r2"`: R2扳机
- `"select"`: Select 选择键
- `"start"`: Start 开始键

### STICK(摇杆)
- `"l"`: 左摇杆
- `"r"`: 右摇杆

### AXIS(轴向)
- `"x"`: X轴(水平)
- `"y"`: Y轴(垂直)

### PLAYER(玩家编号)
- `"1"`: 玩家1
- `"2"`: 玩家2
- `"3"`: 玩家3
- `"4"`: 玩家4

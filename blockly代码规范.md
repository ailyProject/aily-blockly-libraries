# Blockly .abi文件块插入规范

## 概述

本文档基于实际的 `project.abi` 文件和库中的 `block.json` 定义，提供块插入到 `.abi` 文件的标准格式。

### 文件来源关系
- **block.json**: 定义块结构、连接属性、字段类型
- **toolbox.json**: 定义工具箱默认配置
- **.abi文件**: 存储工作区中的块实例

### 连接规则
| block.json属性 | .abi文件体现 | 说明 |
|---------------|-------------|------|
| `"previousStatement": null` | 可被 `next` 连接 | 语句块可上方连接 |
| `"nextStatement": null` | 可含 `next` 字段 | 语句块可下方连接 |
| `"output": "Type"` | 只能在 `inputs` 中使用 | 值块不能有 `next` |
| 无连接属性 | 通过 `inputs` 连接内部 | Hat块如 `arduino_setup` |

### .abi文件结构
```json
{
  "blocks": {
    "languageVersion": 0,
    "blocks": [...]
  },
  "variables": [...]
}
```

## 块类型与插入格式

### Hat块（程序入口）
**特征**: 无连接属性，通过 `inputs` 连接内部语句

```json
{
  "type": "arduino_setup",
  "id": "arduino_setup_id0",
  "x": 30,
  "y": -50,
  "deletable": false,
  "inputs": {
    "ARDUINO_SETUP": {
      "block": {
        "type": "serial_begin",
        "id": "生成的唯一ID",
        "fields": {...},
        "next": {...}
      }
    }
  }
}
```

### 语句块（可上下连接）
**特征**: 有 `previousStatement` 和 `nextStatement`，通过 `next` 连接

```json
{
  "type": "serial_begin",
  "id": "生成的唯一ID",
  "fields": {
    "SERIAL": "Serial",      // 来自 ${board.serialPort}
    "SPEED": "115200"        // 来自 ${board.serialSpeed}
  },
  "next": {
    "block": {...}
  }
}
```

### 带输入的语句块
**特征**: 有连接属性和 `input_value`

```json
{
  "type": "serial_println",
  "id": "生成的唯一ID",
  "fields": {
    "SERIAL": "Serial"
  },
  "inputs": {
    "VAR": {
      "shadow": {
        "type": "text",
        "id": "影子块ID",
        "fields": {"TEXT": "默认文本"}
      },
      "block": {
        "type": "variables_get",
        "id": "值块ID",
        "fields": {"VAR": {"id": "变量ID"}}
      }
    }
  },
  "next": {"block": {...}}
}
```

### 控制块（包含条件和语句）
**特征**: 有连接属性和多个输入类型

```json
{
  "type": "controls_whileUntil",
  "id": "生成的唯一ID",
  "fields": {
    "MODE": "UNTIL"
  },
  "inputs": {
    "BOOL": {                // 值输入：条件
      "block": {
        "type": "esp32_wifi_connected",
        "id": "条件块ID"
      }
    },
    "DO": {                  // 语句输入：执行内容
      "block": {
        "type": "time_delay",
        "id": "语句块ID"
      }
    }
  },
  "next": {"block": {...}}
}
```

### 值块（输出数据）
**特征**: 有 `output`，无连接属性，不含 `next` 字段

```json
// 数字值块
{
  "type": "math_number",
  "id": "生成的唯一ID",
  "fields": {"NUM": 1000}
}

// 文本值块
{
  "type": "text",
  "id": "生成的唯一ID",
  "fields": {"TEXT": "Hello World"}
}

// 变量块
{
  "type": "variables_get",
  "id": "生成的唯一ID",
  "fields": {
    "VAR": {"id": "变量的唯一ID"}
  }
}
```

## 输入连接格式

### 三种连接方式

```json
// 1. 影子输入（默认值）
"inputs": {
  "SSID": {
    "shadow": {
      "type": "text",
      "id": "生成的唯一ID",
      "fields": {"TEXT": "your-ssid"}
    }
  }
}

// 2. 实际块连接
"inputs": {
  "VAR": {
    "block": {
      "type": "variables_get",
      "id": "生成的唯一ID",
      "fields": {"VAR": {"id": "变量ID"}}
    }
  }
}

// 3. 混合连接（影子+实际块）
"inputs": {
  "VAR": {
    "shadow": {
      "type": "text",
      "id": "影子块ID",
      "fields": {"TEXT": ""}
    },
    "block": {
      "type": "variables_get",
      "id": "实际块ID",
      "fields": {"VAR": {"id": "变量ID"}}
    }
  }
}
```

## 变量定义

### 变量分类与处理

| 变量类型 | variables数组特征 | 是否需要variable_define | 使用场景 |
|---------|------------------|----------------------|----------|
| **形参** | 有 `type` 字段 | ❌ 不需要 | MQTT回调参数等 |
| **实参** | 无 `type` 字段 | ✅ 需要 | 用户自定义变量 |

### variable_define块格式

```json
{
  "type": "variable_define",
  "fields": {
    "VAR": "变量名",          // 字符串格式
    "TYPE": "数据类型"        // "int", "float", "string", "bool"
  },
  "inputs": {
    "VALUE": {               // 可选：初始值
      "shadow": {
        "type": "math_number",
        "fields": {"NUM": 100}
      }
    }
  }
}
```

### 变量作用域

**全局变量**: 插入到 `blocks.blocks[]` 数组中作为独立块
**局部变量**: 嵌套在使用该变量的代码块中

### 变量引用格式

**定义时**（variable_define）: `"VAR": "变量名"`（字符串）
**使用时**（variables_get）: `"VAR": {"id": "变量ID"}`（对象）

## 完整连接示例

### Arduino Setup连接链

展示不同类型块的连接方式：

```json
{
  "type": "arduino_setup",
  "id": "arduino_setup_id0",
  "x": 30,
  "y": -50,
  "deletable": false,
  "inputs": {
    "ARDUINO_SETUP": {
      "block": {
        "type": "serial_begin",
        "id": "QUu)k=25kNrJ}SJ2HOla",
        "fields": {"SERIAL": "Serial", "SPEED": "115200"},
        "next": {
          "block": {
            "type": "esp32_wifi_begin",
            "id": "`O:9l3XAQ+ze#h#nnQoS",
            "inputs": {
              "SSID": {
                "shadow": {
                  "type": "text",
                  "id": "`+ts^af`0Wwr6ktYTp:o",
                  "fields": {"TEXT": "openjumper_2.4G"}
                }
              }
            },
            "next": {
              "block": {
                "type": "controls_whileUntil",
                "id": ":gw8Ic]`E09XZO[DO%?Q",
                "fields": {"MODE": "UNTIL"},
                "inputs": {
                  "BOOL": {
                    "block": {
                      "type": "esp32_wifi_connected",
                      "id": "piFuTe`nUE7sWryqNhAY"
                    }
                  },
                  "DO": {
                    "block": {
                      "type": "time_delay",
                      "id": "5jy-VU=22HDU/N1^A[P5",
                      "inputs": {
                        "DELAY_TIME": {
                          "shadow": {
                            "type": "math_number",
                            "id": "f;fp]2ff8T|m{@M~;;ZJ",
                            "fields": {"NUM": 1000}
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



**连接分析**:
- Hat块通过 `inputs` 连接内部语句
- 语句块通过 `next` 字段形成链式连接
- 值块连接到 `inputs` 中作为条件或参数
- 影子块提供默认值

### MQTT回调嵌套示例

```json
{
  "type": "pubsub_set_callback",
  "id": "c4=cBAF5R}A$Y:yWXS$}",
  "fields": {"NAME": "mqttClient"},
  "inputs": {
    "NAME": {
      "block": {
        "type": "pubsub_set_callback_with_topic",
        "id": "b-1#FUHr[FKHYm7Xx2+(",
        "inputs": {
          "TOPIC": {
            "shadow": {
              "type": "text",
              "id": "|u}I([=UWa;}vXIlx][T",
              "fields": {"TEXT": "/device/topic"}
            }
          },
          "NAME": {
            "block": {
              "type": "serial_println",
              "id": "9B~iR9BI5RyXfN_UhGOf",
              "fields": {"SERIAL": "Serial"},
              "inputs": {
                "VAR": {
                  "shadow": {
                    "type": "text",
                    "id": "*v`E|qF@u:pY}U]S|d4E",
                    "fields": {"TEXT": ""}
                  },
                  "block": {
                    "type": "variables_get",
                    "id": "mG-4HAyQ9J%w^p?$/z[7",
                    "fields": {"VAR": {"id": "|tS@zI6Hy8eLbES_IU3)"}}
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

**特点**: 展示了Hat块嵌套、影子块+实际块混合、变量引用等复杂连接模式

## 操作指南

### 字段类型映射

| block.json类型 | 说明 | .abi文件值格式 | 示例 |
|---------------|------|---------------|------|
| `field_input` | 文本输入框 | 字符串 | `"TEXT": "Hello"` |
| `field_dropdown` | 下拉选择 | 字符串 | `"SERIAL": "Serial"` |
| `field_checkbox` | 复选框 | 布尔值 | `"SSL": false` |
| `field_number` | 数字输入 | 数字 | `"NUM": 1000` |
| `field_variable` | 变量选择 | 对象 | `"VAR": {"id": "变量ID"}` |
| `input_value` | 值输入连接 | 块连接 | `"inputs": {"NAME": {"block": {...}}}` |
| `input_statement` | 语句输入连接 | 块连接 | `"inputs": {"NAME": {"block": {...}}}` |

### 常见字段值示例

```json
"fields": {
  "SERIAL": "Serial",           // 下拉选择
  "TEXT": "openjumper_2.4G",    // 文本输入
  "NUM": 1000,                  // 数字
  "SSL": false,                 // 复选框
  "VAR": {"id": "变量ID"}       // 变量引用
}
```

### 动态配置引用

**格式**: `"${xxx.yy}"` 引用板卡配置文件数据
**路径**: `node_modules/@aily-project/board-{板卡名称}/{xxx}.json`

```json
// block.json中: "options": "${board.serialPort}"
// 对应board.json中: "serialPort": [["Serial", "Serial"], ...]
// .abi文件中: "SERIAL": "Serial"  // 从选项中选择的值
```

### 插入位置规则
- **Hat块**: 添加到 `blocks.blocks[]` 数组
- **语句块**: 插入到上一个块的 `next.block`
- **值块**: 插入到 `inputs.INPUT_NAME.block` 或 `.shadow`
- **全局变量**: 作为独立的 `variable_define` 块
- **局部变量**: 嵌套在使用它的代码块中

## 验证规则

### 核心规则
1. 块类型必须在对应的block.json中定义
2. 字段名称和输入名称必须与block.json匹配
3. 变量引用的ID必须在variables数组中存在
4. Hat块和值块不能包含next字段
5. 影子块必须是值块类型

### 字段类型规则
6. 字符串字段：`field_input`、`field_dropdown` 使用字符串值
7. 数字字段：`field_number` 使用数字值
8. 布尔字段：`field_checkbox` 使用布尔值（true/false）
9. 变量字段：`field_variable` 使用对象格式 `{"id": "变量ID"}`

### 变量规则
11. 实参变量必须使用 `variable_define` 块初始化
12. 形参变量不能使用 `variable_define` 块
13. `variable_define` 的 `VAR` 字段用字符串，`variables_get` 的 `VAR` 字段用对象

## 推荐实践

1. 为复杂输入提供影子块作为默认值
2. 优先使用局部变量，全局变量作为独立块定义
3. MQTT回调中使用系统提供的形参
4. 查看板卡的board.json文件了解可用配置选项
5. 保持合理的坐标间距（建议50像素以上）

---

此规范基于实际的 `project.abi` 文件和对应库的 `block.json`、`toolbox.json` 定义，确保插入的块能够正确工作并避免连接错误。



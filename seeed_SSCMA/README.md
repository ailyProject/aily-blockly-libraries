# seeed_SSCMA

Seeed SenseCraft Model Assistant AI视觉识别模块操作库

## 库信息
- **库名**: @aily-project/lib-seeed-sscma
- **版本**: 1.0.0
- **兼容**: Arduino全系列平台(ESP32/ESP8266/AVR/SAMD/STM32/RP2040等)

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `sscma_begin_i2c` | 语句块 | VAR(field_input), WIRE(field_dropdown), RST(input_value), ADDRESS(input_value) | `"fields":{"VAR":"ai","WIRE":"Wire"},"inputs":{"RST":{"block":{"type":"math_number","fields":{"NUM":"-1"}}},"ADDRESS":{"block":{"type":"math_number","fields":{"NUM":"98"}}}}` | `SSCMA ai; ai.begin(&Wire,-1,0x62)` |
| `sscma_begin_serial` | 语句块 | VAR(field_input), SERIAL(field_dropdown), RST(input_value), BAUD(input_value) | `"fields":{"VAR":"ai","SERIAL":"Serial1"},"inputs":{"RST":{"block":{"type":"math_number","fields":{"NUM":"-1"}}},"BAUD":{"block":{"type":"math_number","fields":{"NUM":"921600"}}}}` | `SSCMA ai; ai.begin(&Serial1,-1,921600)` |
| `sscma_begin_spi` | 语句块 | VAR(field_input), SPI(field_dropdown), CS(input_value), SYNC(input_value), RST(input_value), CLOCK(input_value) | `"fields":{"VAR":"ai","SPI":"SPI"},"inputs":{"CS":{"block":{"type":"math_number","fields":{"NUM":"10"}}},"SYNC":{"block":{"type":"math_number","fields":{"NUM":"5"}}},"RST":{"block":{"type":"math_number","fields":{"NUM":"-1"}}},"CLOCK":{"block":{"type":"math_number","fields":{"NUM":"400000"}}}}` | `SSCMA ai; ai.begin(&SPI,10,5,-1,400000)` |
| `sscma_invoke` | 值块 | VAR(field_variable), TIMES(field_number), FILTER(field_dropdown), SHOW(field_dropdown) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMA"},"TIMES":"1","FILTER":"false","SHOW":"false"}` | `ai.invoke(1,false,false)` 返回CMD_OK(0)表示成功 |
| `sscma_return_status` | 值块 | STATUS(field_dropdown) | `"fields":{"STATUS":"SSCMA_OK"}` | `SSCMA_OK` |
| `sscma_get_boxes_count` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id"}}` | `ai.boxes().size()` |
| `sscma_get_box_info` | 值块 | VAR(field_variable), INDEX(input_value), PROPERTY(field_dropdown) | `"fields":{"VAR":{"id":"ai_id"},"PROPERTY":"x"},"inputs":{"INDEX":{"block":{"type":"math_number","fields":{"NUM":"0"}}}}` | `ai.boxes()[i].x` |
| `sscma_get_classes_count` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id"}}` | `ai.classes().size()` |
| `sscma_get_class_info` | 值块 | VAR(field_variable), INDEX(input_value), PROPERTY(field_dropdown) | `"fields":{"VAR":{"id":"ai_id"},"PROPERTY":"score"},"inputs":{"INDEX":{"block":{"type":"math_number","fields":{"NUM":"0"}}}}` | `ai.classes()[i].score` |
| `sscma_get_points_count` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id"}}` | `ai.points().size()` |
| `sscma_get_point_info` | 值块 | VAR(field_variable), INDEX(input_value), PROPERTY(field_dropdown) | `"fields":{"VAR":{"id":"ai_id"},"PROPERTY":"x"},"inputs":{"INDEX":{"block":{"type":"math_number","fields":{"NUM":"0"}}}}` | `ai.points()[i].x` |
| `sscma_check_last_image` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id"}}` | `ai.last_image()` |
| `sscma_get_last_image` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id"}}` | `ai.get_last_image()` |
| `sscma_get_performance` | 值块 | VAR(field_variable), STAGE(field_dropdown) | `"fields":{"VAR":{"id":"ai_id"},"STAGE":"inference"}` | `ai.perf().inference` |
| `sscma_available` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id"}}` | `ai.available()` |
| `sscma_read` | 语句块 | VAR(field_variable), ARRAY(input_value), LENGTH(input_value) | `"fields":{"VAR":{"id":"ai_id"}},"inputs":{"ARRAY":{"block":{"type":"variables_get","fields":{"VAR":"buffer"}}},"LENGTH":{"block":{"type":"math_number","fields":{"NUM":"10"}}}}` | `ai.read(buffer,10)` |
| `sscma_write` | 语句块 | VAR(field_variable), ARRAY(input_value), LENGTH(input_value) | `"fields":{"VAR":{"id":"ai_id"}},"inputs":{"ARRAY":{"block":{"type":"variables_get","fields":{"VAR":"data"}}},"LENGTH":{"block":{"type":"math_number","fields":{"NUM":"10"}}}}` | `ai.write(data,10)` |
| `sscma_get_device_id` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id"}}` | `ai.ID()` |
| `sscma_get_device_name` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id"}}` | `ai.name()` |
| `sscma_get_device_info` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id"}}` | `ai.info()` |
| `sscma_reset` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id"}}` | `ai.reset()` |
| `sscma_save_jpeg` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id"}}` | `ai.save_jpeg()` |
| `sscma_clean_actions` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id"}}` | `ai.clean()` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "ai"` |
| field_variable | SSCMA变量对象 | `"VAR": {"id": "ai_id", "name": "ai", "type": "SSCMA"}` |
| field_number | 数值字符串 | `"TIMES": "1"` |
| field_dropdown | 字符串 | `"WIRE": "Wire"`, `"FILTER": "false"`, `"PROPERTY": "x"`, `"STATUS": "CMD_OK"` |
| field_dropdown(动态) | 字符串 | `"WIRE": "Wire"` (从board.json的i2c获取), `"SERIAL": "Serial1"` (从serialPort获取), `"SPI": "SPI"` (从spi获取) |
| input_value | 块连接 | `"inputs": {"RST": {"block": {"type": "math_number", "fields": {"NUM": "-1"}}}}` |

## 连接规则

- **语句块**: 初始化块(begin_i2c/serial/spi)、数据传输块(read/write)、控制块(reset/save_jpeg/clean_actions)有previousStatement/nextStatement，通过`next`字段连接
- **值块**: AI推理块(invoke)、结果获取块(get_boxes_count/get_box_info/get_classes_count等)、设备信息块(get_device_id等)有output，连接到`inputs`中，无`next`字段
- **特殊规则**: 
  - SSCMA变量类型为"SSCMA"，支持多实例(ai、ai2等)
  - 初始化块使用field_input创建变量，其他块使用field_variable引用变量
  - 初始化块在setup()中生成`#include <Seeed_Arduino_SSCMA.h>`和变量定义，在setup()中调用begin()
  - 推理结果索引从0开始，建议在循环中使用变量获取所有结果
  - **invoke返回值处理**: `sscma_invoke`返回CMD_OK(值为0)表示成功，不能直接在if判断中使用。需要使用**逻辑非块**或与`sscma_return_status`块进行**状态对比**

### 动态选项处理
当遇到`"options": "${board.xxx}"`格式的dropdown字段时：
1. 需要从**board.json**文件中获取对应的选项数组
2. `"${board.i2c}"` → 使用Wire/Wire1等I2C接口
3. `"${board.serialPort}"` → 使用Serial1/Serial2等串口
4. `"${board.spi}"` → 使用SPI/SPI1等SPI接口
5. 在.abi文件中使用数组中的value值(第二个元素)

## 使用示例

### I2C接口初始化和推理(使用逻辑非判断)
```json
{
  "type": "sscma_begin_i2c",
  "fields": {"VAR": "ai", "WIRE": "Wire"},
  "inputs": {
    "RST": {
      "shadow": {
        "type": "math_number",
        "fields": {"NUM": -1}
      }
    },
    "ADDRESS": {
      "shadow": {
        "type": "math_number",
        "fields": {"NUM": 98}
      }
    }
  },
  "next": {
    "block": {
      "type": "controls_if",
      "inputs": {
        "IF0": {
          "block": {
            "type": "logic_negate",
            "inputs": {
              "BOOL": {
                "block": {
                  "type": "sscma_invoke",
                  "fields": {
                    "VAR": {"id": "ai_id"},
                    "TIMES": 1,
                    "FILTER": "false",
                    "SHOW": "false"
                  }
                }
              }
            }
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
                  "fields": {"TEXT": "invoke success"}
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
**说明**: invoke返回0(CMD_OK)表示成功，使用`logic_negate`(逻辑非)将0转为true进入if分支

### 使用状态对比判断(推荐)
```json
{
  "type": "controls_if",
  "inputs": {
    "IF0": {
      "block": {
        "type": "logic_compare",
        "fields": {"OP": "EQ"},
        "inputs": {
          "A": {
            "block": {
              "type": "sscma_invoke",
              "fields": {
                "VAR": {"id": "ai_id"},
                "TIMES": 1,
                "FILTER": "false",
                "SHOW": "false"
              }
            }
          },
          "B": {
            "block": {
              "type": "sscma_return_status",
              "fields": {"STATUS": "CMD_OK"}
            }
          }
        }
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
              "fields": {"TEXT": "invoke success"}
            }
          }
        }
      }
    }
  }
}
```
**说明**: 使用`logic_compare`将invoke返回值与`sscma_return_status`的CMD_OK常量对比，更清晰直观

### 获取性能信息
```json
{
  "type": "serial_print",
  "fields": {"SERIAL": "Serial"},
  "inputs": {
    "VAR": {
      "shadow": {
        "type": "text",
        "fields": {"TEXT": "perf: prepocess="}
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
            "type": "sscma_get_performance",
            "fields": {
              "VAR": {"id": "ai_id"},
              "STAGE": "prepocess"
            }
          }
        }
      },
      "next": {
        "block": {
          "type": "serial_print",
          "fields": {"SERIAL": "Serial"},
          "inputs": {
            "VAR": {
              "shadow": {
                "type": "text",
                "fields": {"TEXT": ", inference="}
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
                    "type": "sscma_get_performance",
                    "fields": {
                      "VAR": {"id": "ai_id"},
                      "STAGE": "inference"
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

### 遍历目标检测结果
```json
{
  "type": "controls_for",
  "fields": {
    "VAR": {"id": "var_id"}
  },
  "inputs": {
    "FROM": {
      "block": {
        "type": "math_number",
        "fields": {"NUM": 0}
      }
    },
    "TO": {
      "block": {
        "type": "sscma_get_boxes_count",
        "fields": {
          "VAR": {"id": "ai_id"}
        }
      }
    },
    "BY": {
      "block": {
        "type": "math_number",
        "fields": {"NUM": 1}
      }
    },
    "DO": {
      "block": {
        "type": "serial_print",
        "fields": {"SERIAL": "Serial"},
        "inputs": {
          "VAR": {
            "shadow": {
              "type": "text",
              "fields": {"TEXT": "Box: x="}
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
                  "type": "sscma_get_box_info",
                  "id": "box_x_info",
                  "fields": {
                    "VAR": {"id": "ai_id"},
                    "PROPERTY": "x"
                  },
                  "inputs": {
                    "INDEX": {
                      "block": {
                        "type": "variables_get",
                        "id": "get_i",
                        "fields": {
                          "VAR": {"id": "var_id"}
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

### 获取分类结果
```json
{
  "type": "controls_for",
  "fields": {
    "VAR": {"id": "var_id"}
  },
  "inputs": {
    "FROM": {
      "block": {
        "type": "math_number",
        "fields": {"NUM": 0}
      }
    },
    "TO": {
      "block": {
        "type": "sscma_get_classes_count",
        "fields": {
          "VAR": {"id": "ai_id"}
        }
      }
    },
    "BY": {
      "block": {
        "type": "math_number",
        "fields": {"NUM": 1}
      }
    },
    "DO": {
      "block": {
        "type": "serial_print",
        "fields": {"SERIAL": "Serial"},
        "inputs": {
          "VAR": {
            "block": {
              "type": "sscma_get_class_info",
              "id": "class_score",
              "fields": {
                "VAR": {"id": "ai_id"},
                "PROPERTY": "score"
              },
              "inputs": {
                "INDEX": {
                  "block": {
                    "type": "variables_get",
                    "id": "get_i2",
                    "fields": {
                      "VAR": {"id": "var_id"}
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

1. **必须遵守**: SSCMA模块必须在setup()中初始化，块ID必须唯一，变量ID在整个程序中保持一致
2. **连接限制**: 初始化块是语句块有next连接，推理和获取结果的块是值块无next字段，只能作为input_value使用
3. **变量管理**: 初始化块使用field_input定义变量名(如"ai")，其他块使用field_variable引用(必须包含id/name/type)，支持多实例
4. **通信接口**: 三种接口选一种初始化，I2C最常用(地址0x62即98)，Serial适合长距离(波特率921600)，SPI适合高速传输
5. **常见错误**: 
   - ❌ 未初始化直接调用invoke或获取结果
   - ❌ 数组索引越界(INDEX大于等于count)
   - ❌ 变量类型不匹配(VAR必须是SSCMA类型)
   - ❌ field_variable缺少id或type字段
   - ❌ 接口参数配置错误(如I2C地址、波特率、引脚号)
   - ❌ 在未调用invoke前获取结果
   - ❌ **直接使用invoke返回值判断**: invoke返回0表示成功，直接用在if中会被当作false，必须使用逻辑非或状态对比

## 支持的字段选项

### STATUS(结果状态)
- `"CMD_OK"`: 操作成功 **(值为0，判断时需使用逻辑非或状态对比)**
- `"CMD_AGAIN"`: 需要重试
- `"CMD_ELOG"`: 日志错误
- `"CMD_ETIMEDOUT"`: 超时错误
- `"CMD_EIO"`: 输入输出错误
- `"CMD_EINVAL"`: 无效参数错误
- `"CMD_ENOMEM"`: 内存不足错误
- `"CMD_EBUSY"`: 设备忙错误
- `"CMD_ENOTSUP"`: 不支持的操作
- `"CMD_EPERM"`: 权限错误
- `"CMD_EUNKNOWN"`: 未知错误

### PROPERTY(检测框属性)
- `"x"`: X坐标
- `"y"`: Y坐标  
- `"w"`: 宽度
- `"h"`: 高度
- `"score"`: 置信度
- `"target"`: 目标类别ID

### PROPERTY(分类属性)
- `"score"`: 置信度
- `"target"`: 目标类别ID

### PROPERTY(关键点属性)
- `"x"`: X坐标
- `"y"`: Y坐标
- `"score"`: 置信度
- `"target"`: 目标类别ID

### STAGE(性能阶段)
- `"prepocess"`: 预处理耗时(ms)
- `"inference"`: 推理耗时(ms)
- `"postprocess"`: 后处理耗时(ms)

### FILTER(结果过滤)
- `"true"`: 启用结果过滤
- `"false"`: 禁用结果过滤

### SHOW(显示结果)
- `"true"`: 在屏幕上显示
- `"false"`: 不显示

### TIMES(推理次数)
- 范围: 1-10
- 默认值: 1
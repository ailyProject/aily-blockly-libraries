# Summer_STM_Driver

ESP32 Summer Board智能小车综合控制库，通过I2C控制STM32多功能板，支持舵机、TT马达、步进电机、JY61P传感器等

## 库信息
- **库名**: @aily-project/lib-summer-stm-driver
- **版本**: 1.0.0
- **兼容**: ESP32平台

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `car_is_key_pressed` | 值块 | KEY(field_dropdown) | `"fields":{"KEY":"0"}` | `readKeyEvent()==0` 返回Boolean |
| `car_servo_angle` | 语句块 | PIN(field_dropdown), ANGLE(input_value) | `"fields":{"PIN":"0"},"inputs":{"ANGLE":{"block":{"type":"math_number","fields":{"NUM":"90"}}}}` | `STM32_I2C.servoAngle(0,90)` |
| `car_servo_dual_angle` | 语句块 | ANGLE(input_value) | `"inputs":{"ANGLE":{"block":{"type":"math_number","fields":{"NUM":"90"}}}}` | `STM32_I2C.servoDualAngle(90)` |
| `car_motor_control_single` | 语句块 | MOTOR_ID(field_dropdown), DIRECTION(field_dropdown), SPEED(input_value) | `"fields":{"MOTOR_ID":"0","DIRECTION":"1"},"inputs":{"SPEED":{"block":{"type":"math_number","fields":{"NUM":"128"}}}}` | `STM32_I2C.motorControl(0,1,128)` |
| `car_motor_stop_single` | 语句块 | MOTOR_ID(field_dropdown) | `"fields":{"MOTOR_ID":"0"}` | `STM32_I2C.motorStop(0)` |
| `car_stepper_control` | 语句块 | STEPPER_NUM(field_dropdown), DIRECTION(field_dropdown), DEGREES(input_value) | `"fields":{"STEPPER_NUM":"0","DIRECTION":"0"},"inputs":{"DEGREES":{"block":{"type":"math_number","fields":{"NUM":"360"}}}}` | `STM32_I2C.stepperControl(0,0,360)` |
| `car_stepper_control_turns` | 语句块 | STEPPER_NUM(field_dropdown), DIRECTION(field_dropdown), TURNS(input_value) | `"fields":{"STEPPER_NUM":"0","DIRECTION":"0"},"inputs":{"TURNS":{"block":{"type":"math_number","fields":{"NUM":"1"}}}}` | `STM32_I2C.stepperControlTurns(0,0,1)` |
| `jy61p_set_zero` | 语句块 | 无 | 无 | `STM32_I2C.jy61pSetZero()` |
| `jy61p_get_angle` | 值块 | ANGLE_TYPE(field_dropdown) | `"fields":{"ANGLE_TYPE":"YAW"}` | `STM32_I2C.jy61pGetAngle('Z')` 返回float |
| `jy61p_get_acceleration` | 值块 | AXIS(field_dropdown) | `"fields":{"AXIS":"X"}` | `STM32_I2C.jy61pGetAcceleration('X')` 返回float |
| `jy61p_get_gyro` | 值块 | AXIS(field_dropdown) | `"fields":{"AXIS":"X"}` | `STM32_I2C.jy61pGetGyro('X')` 返回float |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown(KEY) | 数值字符串 | `"KEY": "0"` (按键编号0-2) |
| field_dropdown(PIN) | 数值字符串 | `"PIN": "0"` (舵机编号0-5) |
| field_dropdown(MOTOR_ID) | 数值字符串 | `"MOTOR_ID": "0"` (电机编号0-3) |
| field_dropdown(DIRECTION) | 数值字符串 | `"DIRECTION": "1"` (0=正转，1=反转) |
| field_dropdown(STEPPER_NUM) | 数值字符串 | `"STEPPER_NUM": "0"` (步进电机0-1) |
| field_dropdown(ANGLE_TYPE) | 字符串 | `"ANGLE_TYPE": "YAW"` (ROLL/PITCH/YAW) |
| field_dropdown(AXIS) | 字符串 | `"AXIS": "X"` (X/Y/Z) |
| input_value | 块连接 | `"inputs": {"ANGLE": {"block": {"type": "math_number", "fields": {"NUM": "90"}}}}` |

## 连接规则

- **语句块**: 舵机控制(car_servo_angle/dual_angle)、电机控制(car_motor_control_single/stop)、步进电机控制(car_stepper_control)、传感器校零(jy61p_set_zero)有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 按键检测(car_is_key_pressed)、传感器读取(jy61p_get_angle/acceleration/gyro)有output，连接到`inputs`中，无`next`字段
- **特殊规则**:
  - 通过I2C与STM32通信，ESP32作为主机，STM32作为从机
  - 支持6路舵机(0-5)、4路TT马达(0-3)、2路步进电机(0-1)
  - 板载3个按键，通过模拟引脚A0读取
  - JY61P六轴传感器通过STM32读取数据
  - 舵机角度范围0-180度，电机速度0-255

## 使用示例

### 舵机控制示例
```json
{
  "type": "car_servo_angle",
  "fields": {"PIN": "0"},
  "inputs": {
    "ANGLE": {
      "shadow": {
        "type": "math_number",
        "fields": {"NUM": "90"}
      }
    }
  },
  "next": {
    "block": {
      "type": "time_delay",
      "inputs": {
        "DELAY_TIME": {
          "shadow": {"type": "math_number", "fields": {"NUM": "1000"}}
        }
      },
      "next": {
        "block": {
          "type": "car_servo_angle",
          "fields": {"PIN": "0"},
          "inputs": {
            "ANGLE": {
              "shadow": {"type": "math_number", "fields": {"NUM": "0"}}
            }
          }
        }
      }
    }
  }
}
```

### 电机控制示例
```json
{
  "type": "car_motor_control_single",
  "fields": {"MOTOR_ID": "0", "DIRECTION": "1"},
  "inputs": {
    "SPEED": {
      "shadow": {
        "type": "math_number",
        "fields": {"NUM": "200"}
      }
    }
  },
  "next": {
    "block": {
      "type": "time_delay",
      "inputs": {
        "DELAY_TIME": {
          "shadow": {"type": "math_number", "fields": {"NUM": "2000"}}
        }
      },
      "next": {
        "block": {
          "type": "car_motor_stop_single",
          "fields": {"MOTOR_ID": "0"}
        }
      }
    }
  }
}
```

### JY61P传感器示例
```json
{
  "type": "controls_repeat_ext",
  "inputs": {
    "TIMES": {"block": {"type": "math_number", "fields": {"NUM": "infinity"}}},
    "DO": {
      "block": {
        "type": "serial_print",
        "fields": {"SERIAL": "Serial"},
        "inputs": {
          "VAR": {
            "block": {
              "type": "text_join",
              "extraState": {"itemCount": 4},
              "inputs": {
                "ADD0": {"block": {"type": "text", "fields": {"TEXT": "Yaw="}}},
                "ADD1": {
                  "block": {
                    "type": "jy61p_get_angle",
                    "fields": {"ANGLE_TYPE": "YAW"}
                  }
                },
                "ADD2": {"block": {"type": "text", "fields": {"TEXT": " AccX="}}},
                "ADD3": {
                  "block": {
                    "type": "jy61p_get_acceleration",
                    "fields": {"AXIS": "X"}
                  }
                }
              }
            }
          }
        },
        "next": {
          "block": {
            "type": "time_delay",
            "inputs": {
              "DELAY_TIME": {
                "shadow": {"type": "math_number", "fields": {"NUM": "100"}}
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

1. **必须遵守**: 确保I2C连接正确，ESP32与STM32I2C地址匹配，块ID必须唯一
2. **连接限制**: 控制块是语句块有next连接，读取块是值块无next字段，只能作为input_value使用
3. **数值范围**: 舵机角度0-180，电机速度0-255，步进电机角度0-360或圈数，按键编号0-2
4. **硬件限制**: 6路舵机、4路TT马达、2路步进电机、1个JY61P传感器，不可超出范围
5. **常见错误**:
   - ❌ 舵机/电机/步进电机编号超出范围
   - ❌ 角度或速度值超出有效范围
   - ❌ I2C通信失败（检查接线和地址）
   - ❌ 未校零就使用JY61P角度数据
   - ❌ 按键读取值判断错误

## 支持的字段选项

### KEY(按键编号)
- `"0"`: 按键0
- `"1"`: 按键1
- `"2"`: 按键2

### PIN(舵机编号)
- `"0"`-`"5"`: 舵机S0-S5

### MOTOR_ID(电机编号)
- `"0"`-`"3"`: 电机M0-M3

### DIRECTION(方向)
- `"0"`: 正转
- `"1"`: 反转

### STEPPER_NUM(步进电机编号)
- `"0"`: 步进电机0
- `"1"`: 步进电机1

### ANGLE_TYPE(姿态角类型)
- `"ROLL"`: 横滚角
- `"PITCH"`: 俯仰角
- `"YAW"`: 航向角

### AXIS(轴向)
- `"X"`: X轴
- `"Y"`: Y轴
- `"Z"`: Z轴

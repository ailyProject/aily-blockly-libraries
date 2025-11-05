# servo

舵机控制支持库，通过PWM信号精准控制舵机转动角度

## 库信息
- **库名**: @aily-project/lib-servo
- **版本**: 1.0.0
- **兼容**: Arduino AVR、Arduino UNO R4系列，支持3.3V/5V

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `servo_write` | 语句块 | PIN(field_dropdown), ANGLE(input_value) | `"fields":{"PIN":"9"},"inputs":{"ANGLE":{"block":{...}}}` | `servo_9.write(angle);` |
| `servo_read` | 值块 | PIN(field_dropdown) | `"fields":{"PIN":"9"}` | `servo_pin_9.read()` |
| `servo_angle` | 值块 | ANGLE(field_angle180) | `"fields":{"ANGLE":"90"}` | `90` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown | 字符串 | `"PIN": "9"` |
| field_angle180 | 数值字符串 | `"ANGLE": "90"` |
| input_value | 块连接 | `"inputs": {"ANGLE": {"block": {...}}}` |

## 连接规则

- **语句块**: servo_write有previousStatement/nextStatement，通过`next`字段连接
- **值块**: servo_read、servo_angle有output，连接到`inputs`中
- **特殊规则**: 
  - 每个引脚自动创建独立的舵机对象(servo_引脚号)
  - servo_write自动在setup中初始化对应引脚的舵机
  - servo_read使用不同的命名规则(servo_pin_引脚号)避免冲突
  - 角度范围通常为0-180度，具体取决于舵机型号

## 使用示例

### 舵机控制
```json
{
  "type": "servo_write",
  "id": "control_servo",
  "fields": {"PIN": "9"},
  "inputs": {
    "ANGLE": {
      "block": {
        "type": "servo_angle",
        "fields": {"ANGLE": "90"}
      }
    }
  }
}
```

### 舵机角度读取
```json
{
  "type": "variables_set",
  "id": "read_servo_angle",
  "fields": {"VAR": {"id": "angle_var", "name": "currentAngle", "type": "Number"}},
  "inputs": {
    "VALUE": {
      "block": {
        "type": "servo_read",
        "fields": {"PIN": "9"}
      }
    }
  }
}
```

### 舵机扫描动作
```json
{
  "type": "controls_for",
  "id": "servo_sweep",
  "fields": {"VAR": {"id": "i_var", "name": "i", "type": "Number"}},
  "inputs": {
    "FROM": {"block": {"type": "math_number", "fields": {"NUM": "0"}}},
    "TO": {"block": {"type": "math_number", "fields": {"NUM": "180"}}},
    "BY": {"block": {"type": "math_number", "fields": {"NUM": "1"}}},
    "DO": {
      "block": {
        "type": "servo_write",
        "fields": {"PIN": "9"},
        "inputs": {
          "ANGLE": {
            "block": {
              "type": "variables_get",
              "fields": {"VAR": {"id": "i_var", "name": "i", "type": "Number"}}
            }
          }
        },
        "next": {
          "block": {
            "type": "arduino_delay",
            "inputs": {
              "DELAY": {"block": {"type": "math_number", "fields": {"NUM": "15"}}}
            }
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: 舵机需要连接到支持PWM输出的数字引脚(通常标有~符号)
2. **连接限制**: servo_write是语句块用于控制，servo_read是值块用于读取当前角度
3. **引脚管理**: 每个引脚自动创建独立舵机对象，支持多舵机同时控制
4. **角度范围**: 标准舵机角度范围0-180度，连续旋转舵机使用不同控制方式
5. **常见错误**: ❌ 角度超出0-180范围，❌ 使用不支持PWM的引脚，❌ 电源功率不足驱动多个舵机

## 支持的字段选项
- **PIN(控制引脚)**: 动态生成，推荐使用PWM引脚(3,5,6,9,10,11等)
- **ANGLE(角度范围)**: 0-180度，field_angle180提供可视化角度选择器
- **舵机类型**: 标准180度舵机、连续旋转舵机(需特殊控制方式)

## 技术规格
- **控制信号**: PWM脉宽调制，50Hz频率
- **脉宽范围**: 1-2ms(对应0-180度角度)
- **响应时间**: 通常100-300ms到达指定角度
- **扭矩范围**: 1.5-20kg·cm，取决于舵机型号
- **工作电压**: 4.8-7.2V(推荐5V-6V)
- **电流消耗**: 空载100-200mA，负载时可达1-2A
- **接线方式**: 棕线(GND)、红线(VCC)、橙线(Signal)标准配色
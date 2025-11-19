# I/O 控制核心库

Arduino基础I/O控制库，提供数字/模拟读写、引脚模式设置功能。

## 库信息
- **库名**: @aily-project/lib-core-io
- **版本**: 1.0.0  
- **兼容**: 所有Arduino板卡

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `io_pinmode` | 语句块 | PIN(input), MODE(input) | 无关键字段 | `pinMode(pin, mode);` |
| `io_digitalwrite` | 语句块 | PIN(input), STATE(input) | 无关键字段 | `digitalWrite(pin, state);` |
| `io_digitalread` | 值块 | PIN(input) | 无关键字段 | `digitalRead(pin)` |
| `io_analogwrite` | 语句块 | PIN(input), PWM(input) | 无关键字段 | `analogWrite(pin, pwm);` |
| `io_analogread` | 值块 | PIN(input) | 无关键字段 | `analogRead(pin)` |
| `io_pin_digi` | 值块 | PIN(dropdown) | `"PIN":"2"` | `2` |
| `io_pin_adc` | 值块 | PIN(dropdown) | `"PIN":"A0"` | `A0` |
| `io_pin_pwm` | 值块 | PIN(dropdown) | `"PIN":"3"` | `3` |
| `io_state` | 值块 | STATE(dropdown) | `"STATE":"HIGH"` | `HIGH` |
| `io_mode` | 值块 | MODE(dropdown) | `"MODE":"INPUT"` | `INPUT` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown | 字符串 | `"PIN": "2"` |
| field_dropdown(动态) | 字符串 | `"PIN": "Pin 13"` (从board.json获取key值) |
| input_value | 块连接 | `"inputs": {"PIN": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **特殊规则**: 引脚选择根据开发板配置动态显示

### 动态选项处理
当遇到动态引脚选项时：
1. **数字引脚**: `"options": "${board.digitalPins}"` - 需要从board.json获取digitalPins数组
2. **模拟引脚**: `"options": "${board.analogPins}"` - 需要从board.json获取analogPins数组  
3. **PWM引脚**: `"options": "${board.pwmPins}"` - 需要从board.json获取pwmPins数组

**示例**：
- block.json中：`"options": "${board.digitalPins}"`
- board.json中：`"digitalPins": [["Pin 2", "2"], ["Pin 13", "13"]]`
- .abi中使用：`"PIN": "Pin 13"` (选择数组中某组的key，即第一个元素)

## 使用示例

### 数字输出
```json
{
  "type": "io_digitalwrite",
  "id": "write_id",
  "inputs": {
    "PIN": {"shadow": {"type": "io_pin_digi", "fields": {"PIN": "Pin 13"}}},
    "STATE": {"shadow": {"type": "io_state", "fields": {"STATE": "HIGH"}}}
  }
}
```

### 模拟读取
```json
{
  "type": "io_analogread", 
  "id": "read_id",
  "inputs": {
    "PIN": {"shadow": {"type": "io_pin_adc", "fields": {"PIN": "Pin A0"}}}
  }
}
```

### 完整程序
```json
{
  "type": "arduino_setup",
  "inputs": {
    "ARDUINO_SETUP": {
      "block": {
        "type": "io_pinmode",
        "inputs": {
          "PIN": {"shadow": {"type": "io_pin_digi", "fields": {"PIN": "Pin 13"}}},
          "MODE": {"shadow": {"type": "io_mode", "fields": {"MODE": "OUTPUT"}}}
        },
        "next": {
          "block": {
            "type": "io_digitalwrite", 
            "inputs": {
              "PIN": {"shadow": {"type": "io_pin_digi", "fields": {"PIN": "Pin 13"}}},
              "STATE": {"shadow": {"type": "io_state", "fields": {"STATE": "HIGH"}}}
            }
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **动态引脚配置**: 引脚选项从board.json动态获取，不同开发板显示不同引脚
2. **模式设置**: 数字引脚需先设置模式再使用
3. **PWM限制**: 只有支持PWM的引脚可用analogWrite
4. **电平范围**: 数字0-1，模拟0-1023(读取)/0-255(输出)
5. **引脚格式**: .abi中使用数组中的key值(如"Pin 13")，不使用内部value或模板字符串

## 支持的引脚模式
INPUT, OUTPUT, INPUT_PULLUP

## 支持的电平状态  
LOW, HIGH

---
*自包含文档，无需外部规范*
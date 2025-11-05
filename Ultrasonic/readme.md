# adafruit_Ultrasonic

超声波测距传感器操作库

## 库信息
- **库名**: @aily-project/lib-ultrasonic
- **版本**: 0.0.1
- **兼容**: Arduino全系列平台

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `ultrasonic_ranging` | 值块 | PIN1(input_value), PIN2(input_value) | `"inputs":{"PIN1":{"block":{"type":"io_pin_digi"}},"PIN2":{"block":{"type":"io_pin_digi"}}}` | `checkdistance_PIN1_PIN2()` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| input_value | 块连接 | `"inputs": {"PIN1": {"block": {"type": "io_pin_digi"}}}` |

## 连接规则

- **值块**: ultrasonic_ranging有output，连接到`inputs`中，无`next`字段
- **特殊规则**: 
  - 自动生成测距函数checkdistance_PIN1_PIN2()
  - 自动设置pinMode为OUTPUT(Trig)和INPUT(Echo)
  - 函数返回浮点距离值(厘米)

## 使用示例

### 超声波测距
```json
{
  "type": "ultrasonic_ranging",
  "id": "distance_measure",
  "inputs": {
    "PIN1": {"block": {"type": "io_pin_digi", "fields": {"PIN": "2"}}},
    "PIN2": {"block": {"type": "io_pin_digi", "fields": {"PIN": "3"}}}
  }
}
```

### 距离条件判断
```json
{
  "type": "controls_if",
  "id": "obstacle_check",
  "inputs": {
    "IF0": {
      "block": {
        "type": "logic_compare",
        "fields": {"OP": "LT"},
        "inputs": {
          "A": {
            "block": {
              "type": "ultrasonic_ranging",
              "inputs": {
                "PIN1": {"block": {"type": "io_pin_digi", "fields": {"PIN": "2"}}},
                "PIN2": {"block": {"type": "io_pin_digi", "fields": {"PIN": "3"}}}
              }
            }
          },
          "B": {"block": {"type": "math_number", "fields": {"NUM": "10"}}}
        }
      }
    },
    "DO0": {
      "block": {
        "type": "serial_print",
        "inputs": {"CONTENT": {"block": {"type": "text", "fields": {"TEXT": "Obstacle detected!"}}}}
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: Trig和Echo引脚必须使用不同的数字引脚
2. **连接限制**: ultrasonic_ranging是值块，返回Number类型，可用于数学运算和比较
3. **测量限制**: HC-SR04测量范围2-400cm，建议测量间隔≥60ms避免干扰
4. **常见错误**: ❌ 使用相同引脚作为Trig和Echo，❌ 模拟引脚用作数字输入输出

## 支持的传感器规格
- **HC-SR04**: 测量范围2-400cm，精度3mm，工作电压5V
- **JSN-SR04T**: 防水版本，测量范围25-450cm，工作电压3.3-5.5V
- **引脚类型**: 数字I/O引脚(0-255)
- **时序要求**: Trig触发脉冲≥10μs，Echo回响脉冲测量
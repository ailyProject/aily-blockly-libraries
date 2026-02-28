# L298N 电机驱动库

L298N双H桥直流电机驱动库，支持PWM速度调节和方向控制。

## 库信息

- **库名**: @aily-project/lib-l298n
- **版本**: 1.0.0
- **兼容**: Arduino全系列、ESP32/ESP8266、RP2040等

## 块定义

### 初始化块

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `l298n_setup` | 语句块 | VAR(input), EN(input), IN1(input), IN2(input) | `"VAR":"motor", "EN":"3", "IN1":"4", "IN2":"5"` | `L298N motor(3, 4, 5);` |
| `l298n_setup_no_enable` | 语句块 | VAR(input), IN1(input), IN2(input) | `"VAR":"motor", "IN1":"4", "IN2":"5"` | `L298N motor(4, 5);` |

### 控制块

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `l298n_set_speed` | 语句块 | VAR(variable), SPEED(input_value) | `"VAR":{"id":"var_id"}, "inputs":{"SPEED":{...}}` | `motor.setSpeed(200);` |
| `l298n_forward` | 语句块 | VAR(variable) | `"VAR":{"id":"var_id"}` | `motor.forward();` |
| `l298n_backward` | 语句块 | VAR(variable) | `"VAR":{"id":"var_id"}` | `motor.backward();` |
| `l298n_stop` | 语句块 | VAR(variable) | `"VAR":{"id":"var_id"}` | `motor.stop();` |
| `l298n_run` | 语句块 | VAR(variable), DIRECTION(dropdown) | `"VAR":{"id":"var_id"}, "DIRECTION":"FORWARD"` | `motor.run(L298N::FORWARD);` |

### 定时块

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `l298n_forward_for` | 语句块 | VAR(variable), DELAY(input_value) | `"VAR":{"id":"var_id"}, "inputs":{"DELAY":{...}}` | `motor.forwardFor(1000);` |
| `l298n_backward_for` | 语句块 | VAR(variable), DELAY(input_value) | `"VAR":{"id":"var_id"}, "inputs":{"DELAY":{...}}` | `motor.backwardFor(1000);` |
| `l298n_run_for` | 语句块 | VAR(variable), DIRECTION(dropdown), DELAY(input_value) | `"VAR":{"id":"var_id"}, "DIRECTION":"FORWARD", "inputs":{"DELAY":{...}}` | `motor.runFor(1000, L298N::FORWARD);` |

### 状态查询块

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `l298n_get_speed` | 值块 | VAR(variable) | `"VAR":{"id":"var_id"}` | `motor.getSpeed()` |
| `l298n_is_moving` | 值块 | VAR(variable) | `"VAR":{"id":"var_id"}` | `motor.isMoving()` |
| `l298n_get_direction` | 值块 | VAR(variable) | `"VAR":{"id":"var_id"}` | `motor.getDirection()` |

### 高级块

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `l298n_reset` | 语句块 | VAR(variable) | `"VAR":{"id":"var_id"}` | `motor.reset();` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "motor"` |
| field_variable | 对象（包含id和type） | `"VAR": {"id": "var_id", "type": "L298N"}` |
| field_dropdown | 字符串 | `"DIRECTION": "FORWARD"` |
| input_value | 块连接（在inputs对象中） | `"inputs": {"SPEED": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **变量ID**: field_variable字段使用`{"id": "xxx"}`格式
- **下拉菜单**: field_dropdown字段直接使用字符串值

## 使用示例

### 基础初始化和控制
```json
{
  "type": "l298n_setup",
  "id": "setup_1",
  "fields": {
    "VAR": "motor1",
    "EN": "3",
    "IN1": "4",
    "IN2": "5"
  },
  "next": {
    "block": {
      "type": "l298n_set_speed",
      "id": "speed_1",
      "fields": {
        "VAR": {"id": "motor1_var"}
      },
      "inputs": {
        "SPEED": {
          "block": {
            "type": "math_number",
            "fields": {"NUM": 200}
          }
        }
      },
      "next": {
        "block": {
          "type": "l298n_forward",
          "id": "forward_1",
          "fields": {
            "VAR": {"id": "motor1_var"}
          }
        }
      }
    }
  }
}
```

### 定时运行
```json
{
  "type": "l298n_setup",
  "id": "setup_2",
  "fields": {
    "VAR": "motor2",
    "EN": "6",
    "IN1": "7",
    "IN2": "8"
  },
  "next": {
    "block": {
      "type": "l298n_forward_for",
      "id": "forward_for_1",
      "fields": {
        "VAR": {"id": "motor2_var"}
      },
      "inputs": {
        "DELAY": {
          "block": {
            "type": "math_number",
            "fields": {"NUM": 5000}
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **必须先初始化**: 使用任何控制块前必须先创建初始化块
2. **变量类型**: field_variable的variableTypes必须为["L298N"]
3. **速度范围**: SPEED值范围0-255（0为停止，255为最大速度）
4. **定时运行限制**: 使用定时运行后需调用reset块才能再次控制电机
5. **PWM引脚**: EN引脚必须使用PWM引脚（Arduino UNO: 3,5,6,9,10,11）

## 支持的方向参数

- `FORWARD` - 前进
- `BACKWARD` - 后退  
- `STOP` - 停止

## 引脚配置建议

**Arduino UNO PWM引脚**: 3, 5, 6, 9, 10, 11
**ESP32**: 所有引脚支持PWM
**ESP8266**: 所有引脚支持PWM

## 常见错误

❌ **错误示例**：未初始化直接使用控制块
```json
{
  "type": "l298n_forward",
  "fields": {"VAR": {"id": "motor1"}}  // 变量未创建
}
```

✅ **正确示例**：先初始化再使用
```json
{
  "type": "l298n_setup",
  "fields": {"VAR": "motor1", "EN": "3", "IN1": "4", "IN2": "5"},
  "next": {
    "block": {
      "type": "l298n_forward",
      "fields": {"VAR": {"id": "motor1"}}
    }
  }
}
```
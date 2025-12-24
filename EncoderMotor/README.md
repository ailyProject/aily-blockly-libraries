# 编码电机库 README_AI.md

## 库信息
- **库名**: @aily-project/lib-encoder-motor
- **版本**: 1.1.1
- **兼容**: ESP32系列开发板

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `encoder_motor_create` | 语句块 | VAR(field_input), POS_PIN(input), NEG_PIN(input), A_PIN(input), B_PIN(input), PPR(input), REDUCTION(input), PHASE(field_dropdown) | `"VAR":"motor1","PHASE":"kAPhaseLeads"` | `em::EncoderMotor motor1(...); motor1.Init();` |
| `encoder_motor_set_pid` | 语句块 | VAR(field_variable), P(input), I(input), D(input) | `"VAR":{"id":"var_id"}` | `motor1.SetSpeedPid(p,i,d);` |
| `encoder_motor_run_pwm` | 语句块 | VAR(field_variable), PWM(input) | `"VAR":{"id":"var_id"}` | `motor1.RunPwmDuty(pwm);` |
| `encoder_motor_run_speed` | 语句块 | VAR(field_variable), SPEED(input) | `"VAR":{"id":"var_id"}` | `motor1.RunSpeed(speed);` |
| `encoder_motor_stop` | 语句块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `motor1.Stop();` |
| `encoder_motor_get_speed` | 值块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `motor1.SpeedRpm()` |
| `encoder_motor_get_pwm` | 值块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `motor1.PwmDuty()` |
| `encoder_motor_get_pulse` | 值块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `motor1.EncoderPulseCount()` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "motor1"` |
| field_dropdown | 字符串 | `"PHASE": "kAPhaseLeads"` |
| field_variable | 对象 | `"VAR": {"id": "var_id"}` |
| input_value | 块连接 | `"inputs": {"PWM": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **变量块**: 使用field_variable引用已创建的EncoderMotor对象
- **重要规则**: encoder_motor_create块必须首先使用，使用field_input创建新变量；其他块使用field_variable引用已创建的变量

## 使用示例

### 创建并配置电机
```json
{
  "type": "encoder_motor_create",
  "id": "create_motor",
  "fields": {
    "VAR": "motor1",
    "PHASE": "kAPhaseLeads"
  },
  "inputs": {
    "POS_PIN": {"block": {"type": "math_number", "fields": {"NUM": "27"}}},
    "NEG_PIN": {"block": {"type": "math_number", "fields": {"NUM": "13"}}},
    "A_PIN": {"block": {"type": "math_number", "fields": {"NUM": "18"}}},
    "B_PIN": {"block": {"type": "math_number", "fields": {"NUM": "19"}}},
    "PPR": {"block": {"type": "math_number", "fields": {"NUM": "12"}}},
    "REDUCTION": {"block": {"type": "math_number", "fields": {"NUM": "90"}}}
  }
}
```

### PWM驱动
```json
{
  "type": "encoder_motor_run_pwm",
  "fields": {
    "VAR": {"id": "motor1_var"}
  },
  "inputs": {
    "PWM": {"block": {"type": "math_number", "fields": {"NUM": "500"}}}
  }
}
```

### 速度环驱动
```json
{
  "type": "encoder_motor_set_pid",
  "inputs": {
    "P": {"block": {"type": "math_number", "fields": {"NUM": "0.5"}}},
    "I": {"block": {"type": "math_number", "fields": {"NUM": "0.1"}}},
    "D": {"block": {"type": "math_number", "fields": {"NUM": "0.01"}}}
  }
}
```

```json
{
  "type": "encoder_motor_run_speed",
  "inputs": {
    "SPEED": {"block": {"type": "math_number", "fields": {"NUM": "100"}}}
  }
}
```

## 重要规则

1. **必须遵守**: encoder_motor_create块必须首先使用，且使用field_input创建变量名；后续所有块使用field_variable引用
2. **变量类型**: 变量类型为EncoderMotor，所有非创建块必须引用已创建的EncoderMotor变量
3. **构造参数**: PPR和减速比在创建时指定，不支持运行时修改
4. **相位关系**: A相领先或B相领先，根据电机实际特性选择
5. **常见错误**: 
   - ❌ 使用encoder_motor_set_pid块创建变量（应使用encoder_motor_create）
   - ❌ 在encoder_motor_create后使用field_input引用变量（应使用field_variable）
   - ❌ 忘记设置PID参数就使用RunSpeed（可能控制效果不佳）

## 技术说明

- **PWM范围**: -1023到1023，正数正转，负数反转，0停止
- **速度单位**: RPM（转/分钟）
- **PID参数**: P、I、D为浮点数，需根据电机特性调优
- **编码器**: 支持AB相编码器，相位差90度
- **自动初始化**: 创建块自动添加Init()到setup

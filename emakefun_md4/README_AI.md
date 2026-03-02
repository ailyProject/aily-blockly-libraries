# MD40 四路电机驱动

MD40 I2C 四路电机驱动模块，支持直流模式和编码器模式（速度/位置闭环）。

## 库信息
- **库名**: @aily-project/lib-em-md40
- **版本**: 1.0.0
- **兼容**: Arduino AVR、ESP32

## 块定义

| 块类型 | 连接 | 参数 | ABS格式 | 生成代码 |
|--------|------|------|---------|----------|
| `md40_init` | 语句块 | VAR(field_input), I2C_ADDR(dropdown) | `md40_init("md40", 0x16)` | `em::Md40 md40(0x16, Wire);` |
| `md40_set_dc_mode` | 语句块 | VAR(field_variable), MOTOR_INDEX(dropdown) | `md40_set_dc_mode($md40, 0)` | `md40[0].SetDcMode();` |
| `md40_set_encoder_mode` | 语句块 | VAR(field_variable), MOTOR_INDEX(dropdown), PPR(input_value), REDUCTION(input_value), PHASE(dropdown) | `md40_set_encoder_mode($md40, 0, math_number(12), math_number(90), kAPhaseLeads)` | `md40[0].SetEncoderMode(12, 90, ...kAPhaseLeads);` |
| `md40_set_speed_pid` | 语句块 | VAR(field_variable), MOTOR_INDEX(dropdown), P(input_value), I(input_value), D(input_value) | `md40_set_speed_pid($md40, 0, math_number(1.5), math_number(1.5), math_number(1.0))` | `md40[0].set_speed_pid_p/i/d(...);` |
| `md40_set_position_pid` | 语句块 | VAR(field_variable), MOTOR_INDEX(dropdown), P(input_value), I(input_value), D(input_value) | `md40_set_position_pid($md40, 0, math_number(10.0), math_number(1.0), math_number(1.0))` | `md40[0].set_position_pid_p/i/d(...);` |
| `md40_run_pwm_duty` | 语句块 | VAR(field_variable), MOTOR_INDEX(dropdown), PWM_DUTY(input_value) | `md40_run_pwm_duty($md40, 0, math_number(512))` | `md40[0].RunPwmDuty(512);` |
| `md40_run_speed` | 语句块 | VAR(field_variable), MOTOR_INDEX(dropdown), RPM(input_value) | `md40_run_speed($md40, 0, math_number(100))` | `md40[0].RunSpeed(100);` |
| `md40_move_to` | 语句块 | VAR(field_variable), MOTOR_INDEX(dropdown), POSITION(input_value), SPEED(input_value) | `md40_move_to($md40, 0, math_number(720), math_number(60))` | `md40[0].MoveTo(720, 60);` |
| `md40_move` | 语句块 | VAR(field_variable), MOTOR_INDEX(dropdown), OFFSET(input_value), SPEED(input_value) | `md40_move($md40, 0, math_number(360), math_number(60))` | `md40[0].Move(360, 60);` |
| `md40_stop` | 语句块 | VAR(field_variable), MOTOR_INDEX(dropdown) | `md40_stop($md40, 0)` | `md40[0].Stop();` |
| `md40_reset` | 语句块 | VAR(field_variable), MOTOR_INDEX(dropdown) | `md40_reset($md40, 0)` | `md40[0].Reset();` |
| `md40_set_position` | 语句块 | VAR(field_variable), MOTOR_INDEX(dropdown), POSITION(input_value) | `md40_set_position($md40, 0, math_number(0))` | `md40[0].set_position(0);` |
| `md40_set_pulse_count` | 语句块 | VAR(field_variable), MOTOR_INDEX(dropdown), PULSE_COUNT(input_value) | `md40_set_pulse_count($md40, 0, math_number(0))` | `md40[0].set_pulse_count(0);` |
| `md40_get_speed` | 值块 | VAR(field_variable), MOTOR_INDEX(dropdown) | `md40_get_speed($md40, 0)` | `md40[0].speed()` |
| `md40_get_position` | 值块 | VAR(field_variable), MOTOR_INDEX(dropdown) | `md40_get_position($md40, 0)` | `md40[0].position()` |
| `md40_get_pulse_count` | 值块 | VAR(field_variable), MOTOR_INDEX(dropdown) | `md40_get_pulse_count($md40, 0)` | `md40[0].pulse_count()` |
| `md40_get_pwm_duty` | 值块 | VAR(field_variable), MOTOR_INDEX(dropdown) | `md40_get_pwm_duty($md40, 0)` | `md40[0].pwm_duty()` |
| `md40_get_state` | 值块 | VAR(field_variable), MOTOR_INDEX(dropdown) | `md40_get_state($md40, 0)` | `static_cast<uint8_t>(md40[0].state())` |

## 参数选项

| 参数 | 可选值 | 说明 |
|------|--------|------|
| I2C_ADDR | 0x16(默认), 0x17, 0x18, 0x19 | I2C地址 |
| MOTOR_INDEX | 0, 1, 2, 3 | 电机通道编号 |
| PHASE | kAPhaseLeads, kBPhaseLeads | 编码器相位关系 |

## ABS 示例

### 直流模式 - PWM控制
```
arduino_setup()
    md40_init("md40", 0x16)
    md40_set_dc_mode($md40, 0)

arduino_loop()
    md40_run_pwm_duty($md40, 0, math_number(512))
    time_delay(math_number(2000))
    md40_run_pwm_duty($md40, 0, math_number(-512))
    time_delay(math_number(2000))
```

### 编码器模式 - 速度控制
```
arduino_setup()
    md40_init("md40", 0x16)
    md40_set_encoder_mode($md40, 0, math_number(12), math_number(90), kAPhaseLeads)
    md40_set_speed_pid($md40, 0, math_number(1.5), math_number(1.5), math_number(1.0))

arduino_loop()
    md40_run_speed($md40, 0, math_number(100))
    time_delay(math_number(2000))
    md40_run_speed($md40, 0, math_number(-100))
    time_delay(math_number(2000))
```

### 编码器模式 - 位置控制
```
arduino_setup()
    md40_init("md40", 0x16)
    md40_set_encoder_mode($md40, 0, math_number(12), math_number(90), kAPhaseLeads)
    md40_set_speed_pid($md40, 0, math_number(1.5), math_number(1.5), math_number(1.0))
    md40_set_position_pid($md40, 0, math_number(10.0), math_number(1.0), math_number(1.0))

arduino_loop()
    md40_move_to($md40, 0, math_number(720), math_number(60))
    time_delay(math_number(3000))
    md40_move_to($md40, 0, math_number(0), math_number(60))
    time_delay(math_number(3000))
```

## 注意事项

1. **初始化**: `md40_init` 放在 `arduino_setup()` 中，自动初始化 Wire 和模块
2. **变量引用**: 初始化后用 `$md40` 引用，后续块均需引用该变量
3. **模式设置**: 使用速度/位置控制前必须先设置编码器模式和对应 PID 参数
4. **电机状态值**: 0=空闲, 1=PWM运行, 2=速度运行, 3=位置运行中, 4=已到达位置
5. **PWM范围**: -1023~1023，正数正转，负数反转

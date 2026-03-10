# emakefun_dm11

Emakefun DM11 电机驱动模块，支持双电机 PWM 控制（I2C 接口）

## 库信息
- **库名**: @aily-project/lib-emakefun_dm11
- **版本**: 1.0.0
- **兼容**: arduino:avr, arduino:megaavr, arduino:samd, esp32:esp32, esp8266:esp8266, renesas_uno:unor4wifi, rp2040:rp2040

## 块定义

| 块类型 | 连接 | 参数 | DSL格式 | 生成代码 |
|--------|------|------|---------|----------|
| `dm11_init` | 语句块 | VAR(field_input), I2C_ADDR(field_input), FREQUENCY(input_value) | `dm11_init("dm11", "0x15", 1000)` | `em::Dm11 var(addr); var.Init(freq);` |
| `dm11_pwm_duty` | 语句块 | VAR(field_variable/Dm11), CHANNEL(dropdown), DUTY(input_value) | `dm11_pwm_duty($dm11, 0, 2048)` | `var.PwmDuty(kPwmChannelX, duty);` |
| `dm11_motor_control` | 语句块 | VAR(field_variable/Dm11), MOTOR(dropdown), SPEED(input_value) | `dm11_motor_control($dm11, A, 2000)` | 根据正负值设置两通道PWM |
| `dm11_motor_stop` | 语句块 | VAR(field_variable/Dm11), MOTOR(dropdown) | `dm11_motor_stop($dm11, A)` | `var.PwmDuty(chX, 0);` |

**说明**: `dm11_init` 会自动创建 `Dm11` 类型变量并注册到 Blockly，后续用 `$变量名` 引用。

## DSL 示例

### 初始化 DM11
```
dm11_init("dm11", "0x15", number(1000))
```

### 完整示例：控制双电机
```
arduino_setup()
    dm11_init("dm11", "0x15", number(1000))
    serial_begin(Serial, 9600)

arduino_loop()
    dm11_motor_control($dm11, A, number(2000))
    dm11_motor_control($dm11, B, number(2000))
    time_delay(number(2000))
    dm11_motor_stop($dm11, ALL)
    time_delay(number(1000))
```

### PWM 直接控制
```
arduino_setup()
    dm11_init("dm11", "0x15", number(1000))

arduino_loop()
    dm11_pwm_duty($dm11, 0, number(2048))
    time_delay(number(1000))
    dm11_pwm_duty($dm11, 0, number(0))
    time_delay(number(1000))
```

## 参数选项

| 参数 | 可选值 | 说明 |
|------|--------|------|
| I2C_ADDR | 0x15（默认） | DM11 的 I2C 地址 |
| FREQUENCY | 1000（默认） | PWM 频率，单位 Hz |
| CHANNEL | 0, 1, 2, 3 | PWM 通道号 |
| MOTOR | A, B, ALL | 电机选择（ALL 仅停止块可用） |
| DUTY | 0-4095 | PWM 占空比 |
| SPEED | -4095 ~ 4095 | 电机速度，正值正转，负值反转 |

**电机与通道映射**:
- 电机A → 通道0（反转）+ 通道1（正转）
- 电机B → 通道2（反转）+ 通道3（正转）

## 注意事项

1. **初始化位置**: `dm11_init` 放在 `arduino_setup()` 中
2. **变量引用**: 用 `$变量名` 引用，如 `dm11_motor_control($dm11, A, number(2000))`
3. **速度范围**: 电机速度 -4095 到 4095，占空比 0 到 4095
4. **I2C 依赖**: 初始化会自动调用 `Wire.begin()`，无需手动初始化 I2C
5. **停止电机**: `dm11_motor_stop` 的 MOTOR 参数支持 ALL 选项可停止所有电机

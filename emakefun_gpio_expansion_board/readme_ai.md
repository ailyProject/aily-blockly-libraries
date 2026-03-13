# GPIO扩展板库

Emakefun GPIO扩展板的Aily Blockly库，通过I2C扩展8路GPIO引脚，支持数字输入输出、ADC采集、PWM输出和舵机控制。

## 库信息
- **Name**: @aily-project/lib-gpio_expansion_board
- **Version**: 1.0.0

## 块定义

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `gpio_expansion_board_init` | Statement | VAR(field_input), I2C_ADDR(field_input) | `gpio_expansion_board_init("gpioBoard", "0x24")` | `GpioExpansionBoard gpioBoard(0x24);` |
| `gpio_expansion_board_set_mode` | Statement | VAR(field_variable), PIN(field_dropdown), MODE(field_dropdown) | `gpio_expansion_board_set_mode($gpioBoard, E1, OUTPUT)` | `gpioBoard.SetGpioMode(GpioExpansionBoard::kGpioPinE1, GpioExpansionBoard::kOutput);` |
| `gpio_expansion_board_set_level` | Statement | VAR(field_variable), PIN(field_dropdown), LEVEL(field_dropdown) | `gpio_expansion_board_set_level($gpioBoard, E1, HIGH)` | `gpioBoard.SetGpioLevel(GpioExpansionBoard::kGpioPinE1, 1);` |
| `gpio_expansion_board_get_level` | Value | VAR(field_variable), PIN(field_dropdown) | `gpio_expansion_board_get_level($gpioBoard, E0)` | `gpioBoard.GetGpioLevel(GpioExpansionBoard::kGpioPinE0)` |
| `gpio_expansion_board_get_adc` | Value | VAR(field_variable), PIN(field_dropdown) | `gpio_expansion_board_get_adc($gpioBoard, E0)` | `gpioBoard.GetGpioAdcValue(GpioExpansionBoard::kGpioPinE0)` |
| `gpio_expansion_board_set_pwm_frequency` | Statement | VAR(field_variable), FREQUENCY(input_value) | `gpio_expansion_board_set_pwm_frequency($gpioBoard, math_number(50))` | `gpioBoard.SetPwmFrequency(50);` |
| `gpio_expansion_board_set_pwm_duty` | Statement | VAR(field_variable), PIN(field_dropdown), DUTY(input_value) | `gpio_expansion_board_set_pwm_duty($gpioBoard, E1, math_number(2048))` | `gpioBoard.SetPwmDuty(GpioExpansionBoard::kGpioPinE1, 2048);` |
| `gpio_expansion_board_set_servo_angle` | Statement | VAR(field_variable), PIN(field_dropdown), ANGLE(input_value) | `gpio_expansion_board_set_servo_angle($gpioBoard, E1, math_number(90))` | `gpioBoard.SetServoAngle(GpioExpansionBoard::kGpioPinE1, 90);` |

## 参数选项

| 参数 | 值 | 说明 |
|------|-----|------|
| PIN | E0, E1, E2, E3, E4, E5, E6, E7 | GPIO引脚选择(PWM/舵机仅支持E1-E2) |
| MODE | INPUT_PULLUP(输入上拉), INPUT_PULLDOWN(输入下拉), INPUT_FLOATING(浮空输入), OUTPUT(输出), ADC(ADC模式), PWM(PWM模式) | 引脚工作模式 |
| LEVEL | LOW(低电平), HIGH(高电平) | 输出电平 |
| I2C_ADDR | "0x24"等十六进制或十进制 | I2C地址(默认0x24) |
| FREQUENCY | 1-10000 | PWM频率(Hz) |
| DUTY | 0-4095 | PWM占空比(12位精度) |
| ANGLE | 0-180 | 舵机角度(度) |

## ABS示例

### 数字输出控制LED

```abs
arduino_setup()
    gpio_expansion_board_init("gpioBoard", "0x24")
    gpio_expansion_board_set_mode(variables_get($gpioBoard), E0, OUTPUT)

arduino_loop()
    gpio_expansion_board_set_level(variables_get($gpioBoard), E0, HIGH)
    time_delay(math_number(1000))
    gpio_expansion_board_set_level(variables_get($gpioBoard), E0, LOW)
    time_delay(math_number(1000))
```

### ADC读取电位器

```abs
arduino_setup()
    gpio_expansion_board_init("gpioBoard", "0x24")
    gpio_expansion_board_set_mode(variables_get($gpioBoard), E0, ADC)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, gpio_expansion_board_get_adc(variables_get($gpioBoard), E0))
    time_delay(math_number(100))
```

### 舵机控制

```abs
arduino_setup()
    gpio_expansion_board_init("gpioBoard", "0x24")
    gpio_expansion_board_set_servo_angle(variables_get($gpioBoard), E1, math_number(0))

arduino_loop()
    gpio_expansion_board_set_servo_angle(variables_get($gpioBoard), E1, math_number(0))
    time_delay(math_number(1000))
    gpio_expansion_board_set_servo_angle(variables_get($gpioBoard), E1, math_number(90))
    time_delay(math_number(1000))
    gpio_expansion_board_set_servo_angle(variables_get($gpioBoard), E1, math_number(180))
    time_delay(math_number(1000))
```

## 注意事项

1. **变量引用**: `gpio_expansion_board_init("varName", ...)`创建变量`$varName`，后续使用`variables_get($varName)`引用
2. **PWM限制**: PWM和舵机功能仅支持E1和E2引脚
3. **I2C地址**: 默认地址0x24(十进制36)，如有冲突可修改
4. **ADC精度**: 10位ADC，返回值范围0-1023
5. **PWM精度**: 12位占空比，范围0-4095

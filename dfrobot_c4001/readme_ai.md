# C4001 mmWave Radar

Aily Blockly library for the DFRobot C4001 human presence radar.

## Library Info
- **Name**: @aily-project/lib-dfrobot-c4001
- **Version**: 0.1.0
- **Author**: DFRobot
- **Source**: https://github.com/DFRobot/DFRobot_C4001
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `c4001_init_i2c` | Statement | VAR(field_input), WIRE(field_dropdown), ADDRESS(field_dropdown) | `c4001_init_i2c("c4001", Wire, DEVICE_ADDR_0)` | create I2C object and `begin()` |
| `c4001_init_uart` | Statement | VAR(field_input), SERIAL(field_dropdown), RX(input_value), TX(input_value) | `c4001_init_uart("c4001", Serial1, math_number(26), math_number(25))` | create UART object at 9600 baud |
| `c4001_motion_detected` | Value | VAR(field_variable) | `c4001_motion_detected(variables_get($c4001))` | `motionDetection()` |
| `c4001_set_mode` | Statement | VAR(field_variable), MODE(field_dropdown) | `c4001_set_mode(variables_get($c4001), eExitMode)` | `setSensorMode(mode)` |
| `c4001_sensor_command` | Statement | VAR(field_variable), COMMAND(field_dropdown) | `c4001_sensor_command(variables_get($c4001), eStartSen)` | `setSensor(command)` |
| `c4001_get_status` | Value | VAR(field_variable), STATUS(field_dropdown) | `c4001_get_status(variables_get($c4001), WORK)` | `getStatus().member` |
| `c4001_set_presence_range` | Statement | VAR(field_variable), MIN(input_value), MAX(input_value), TRIG(input_value) | `c4001_set_presence_range(variables_get($c4001), math_number(30), math_number(1000), math_number(1000))` | `setDetectionRange` |
| `c4001_set_sensitivity` | Statement | VAR(field_variable), TYPE(field_dropdown), SENSITIVITY(input_value) | `c4001_set_sensitivity(variables_get($c4001), TRIG, math_number(5))` | trigger/keep sensitivity |
| `c4001_set_delay` | Statement | VAR(field_variable), TRIG(input_value), KEEP(input_value) | `c4001_set_delay(variables_get($c4001), math_number(100), math_number(4))` | `setDelay` |
| `c4001_get_presence_config` | Value | VAR(field_variable), DATA(field_dropdown) | `c4001_get_presence_config(variables_get($c4001), MIN)` | selected presence config getter |
| `c4001_set_io_polarity` | Statement | VAR(field_variable), POLARITY(field_dropdown) | `c4001_set_io_polarity(variables_get($c4001), 1)` | `setIoPolaity` |
| `c4001_set_pwm` | Statement | VAR(field_variable), PWM1(input_value), PWM2(input_value), TIMER(input_value) | `c4001_set_pwm(variables_get($c4001), math_number(50), math_number(0), math_number(10))` | `setPwm` |
| `c4001_get_target` | Value | VAR(field_variable), DATA(field_dropdown) | `c4001_get_target(variables_get($c4001), NUMBER)` | selected target getter |
| `c4001_set_speed_threshold` | Statement | VAR(field_variable), MIN(input_value), MAX(input_value), THRESHOLD(input_value) | `c4001_set_speed_threshold(variables_get($c4001), math_number(30), math_number(1200), math_number(10))` | `setDetectThres` |
| `c4001_set_micro_motion` | Statement | VAR(field_variable), STATE(field_dropdown) | `c4001_set_micro_motion(variables_get($c4001), eON)` | `setFrettingDetection` |
| `c4001_get_speed_config` | Value | VAR(field_variable), DATA(field_dropdown) | `c4001_get_speed_config(variables_get($c4001), MIN)` | selected speed config getter |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | DEVICE_ADDR_0, DEVICE_ADDR_1 | I2C address 0x2A/0x2B |
| MODE | eExitMode, eSpeedMode | presence mode or speed/range mode |
| COMMAND | eStartSen, eStopSen, eResetSen, eRecoverSen, eSaveParams, eChangeMode | sensor command |
| STATUS | WORK, MODE, INIT | `getStatus()` member |
| DATA | block-specific dropdown values | presence config, target data, or speed config |

## ABS Examples

```
arduino_setup()
    c4001_init_i2c("c4001", Wire, DEVICE_ADDR_0)
    c4001_set_mode(variables_get($c4001), eExitMode)

arduino_loop()
    serial_println(Serial, c4001_motion_detected(variables_get($c4001)))
```

## Notes

1. `c4001_init_i2c` and `c4001_init_uart` create `$name` as `DFRobot_C4001`.
2. UART baud rate is fixed at 9600 by the upstream driver.
3. In speed mode, call target number before speed/range/energy to refresh the driver's internal cache.
4. IO polarity and PWM are meaningful for UART modules; I2C driver methods return default values.

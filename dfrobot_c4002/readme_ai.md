# DFRobot C4002 mmWave Radar

Aily Blockly library for DFRobot C4002 / SEN0691, a 5V 24GHz UART radar sensor.

## Library Info
- **Name**: @aily-project/lib-dfrobot-c4002
- **Version**: 0.1.0
- **Author**: vonweller
- **Source**: https://github.com/DFRobot/DFRobot_C4002
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dfrobot_c4002_init` | Statement | VAR(field_input), SERIAL(field_dropdown), BAUD(input_value), RX(input_value), TX(input_value), OUT_PIN(input_value) | `dfrobot_c4002_init("c4002", Serial1, math_number(115200), math_number(26), math_number(25), math_number(255))` | create object, `begin(outPin)` |
| `dfrobot_c4002_update` | Statement | VAR(field_variable) | `dfrobot_c4002_update(variables_get($c4002))` | `getNoteInfo()` |
| `dfrobot_c4002_get_note` | Value | VAR(field_variable), NOTE(field_dropdown) | `dfrobot_c4002_get_note(variables_get($c4002), NOTE_TYPE)` | note field |
| `dfrobot_c4002_get_value` | Value | VAR(field_variable), VALUE(field_dropdown) | `dfrobot_c4002_get_value(variables_get($c4002), LIGHT)` | selected getter |
| `dfrobot_c4002_set_led` | Statement | VAR(field_variable), LED(field_dropdown), STATE(field_dropdown) | `dfrobot_c4002_set_led(variables_get($c4002), RUN, eLedOff)` | LED setter |
| `dfrobot_c4002_set_out_pin_mode` | Statement | VAR(field_variable), MODE(field_dropdown) | `dfrobot_c4002_set_out_pin_mode(variables_get($c4002), eOutpinMode3)` | `setOutPinMode` |
| `dfrobot_c4002_set_resolution` | Statement | VAR(field_variable), MODE(field_dropdown) | `dfrobot_c4002_set_resolution(variables_get($c4002), eResolution80Cm)` | `setResolutionMode` |
| `dfrobot_c4002_set_detect_range` | Statement | VAR(field_variable), CLOSEST(input_value), FARTHEST(input_value) | `dfrobot_c4002_set_detect_range(variables_get($c4002), math_number(0), math_number(1100))` | `setDetectRange` |
| `dfrobot_c4002_set_report_period` | Statement | VAR(field_variable), PERIOD(input_value) | `dfrobot_c4002_set_report_period(variables_get($c4002), math_number(10))` | `setReportPeriod` |
| `dfrobot_c4002_set_light_threshold` | Statement | VAR(field_variable), THRESHOLD(input_value) | `dfrobot_c4002_set_light_threshold(variables_get($c4002), math_number(0))` | `setLightThresh` |
| `dfrobot_c4002_set_target_disappear_delay` | Statement | VAR(field_variable), SECONDS(input_value) | `dfrobot_c4002_set_target_disappear_delay(variables_get($c4002), math_number(1))` | `setTargetDisappearDelay` |
| `dfrobot_c4002_set_lock_time` | Statement | VAR(field_variable), SECONDS(input_value) | `dfrobot_c4002_set_lock_time(variables_get($c4002), math_number(1))` | `setLockTime` |
| `dfrobot_c4002_set_sensitivity` | Statement | VAR(field_variable), GATE(field_dropdown), SENSITIVITY(field_dropdown) | `dfrobot_c4002_set_sensitivity(variables_get($c4002), eMotionDistGate, eMidThreshGroup)` | `setSensitivity` |
| `dfrobot_c4002_configure_all_gates` | Statement | VAR(field_variable), GATE(field_dropdown), STATE(field_dropdown) | `dfrobot_c4002_configure_all_gates(variables_get($c4002), eMotionDistGate, C4002_ENABLE)` | all gate enable |
| `dfrobot_c4002_set_gate_threshold_all` | Statement | VAR(field_variable), GATE(field_dropdown), THRESHOLD(input_value) | `dfrobot_c4002_set_gate_threshold_all(variables_get($c4002), eMotionDistGate, math_number(50))` | all gate threshold |
| `dfrobot_c4002_start_calibration` | Statement | VAR(field_variable), DELAY_TIME(input_value), CONT_TIME(input_value) | `dfrobot_c4002_start_calibration(variables_get($c4002), math_number(10), math_number(30))` | `startEnvCalibration` |
| `dfrobot_c4002_factory_reset` | Statement | VAR(field_variable) | `dfrobot_c4002_factory_reset(variables_get($c4002))` | `factoryReset` |
| `dfrobot_c4002_set_baudrate` | Statement | VAR(field_variable), BAUD(field_dropdown) | `dfrobot_c4002_set_baudrate(variables_get($c4002), eBaud115200)` | `setBaudrate` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SERIAL | Serial1, Serial2, Serial | ESP32/non-UNO serial object; UNO/ESP8266 use RX/TX SoftwareSerial |
| NOTE | NOTE_TYPE, CALIB_COUNTDOWN | `eNoNote=0`, `eResult=1`, `eCalibration=2` |
| VALUE | TARGET_STATE, LIGHT, PRESENCE_COUNTDOWN, PRESENCE_GATE_INDEX, PRESENCE_DISTANCE, PRESENCE_ENERGY, MOTION_DISTANCE, MOTION_SPEED, MOTION_ENERGY, MOTION_DIRECTION, OUT_TARGET_STATE, LIGHT_THRESHOLD, RANGE_CLOSEST, RANGE_FARTHEST, DISAPPEAR_DELAY, OUT_PIN_MODE, RESOLUTION_MODE, MOTION_SENSITIVITY, PRESENCE_SENSITIVITY | numeric getter |
| LED | RUN, OUT | run or output LED |
| STATE | eLedOff, eLedOn | LED state |
| MODE | eOutpinMode1, eOutpinMode2, eOutpinMode3, eResolution80Cm, eResolution20Cm | output mode or resolution |
| GATE | eMotionDistGate, ePresenceDistGate | motion or presence gate |
| SENSITIVITY | eLowThreshGroup, eMidThreshGroup, eHighThreshGroup, eCustomThreshGroup | threshold group |
| BAUD | eBaud57600, eBaud115200, eBaud230400, eBaud460800, eBaud500000, eBaud921600, eBaud1000000 | restart required |

## ABS Examples

```
arduino_setup()
    dfrobot_c4002_init("c4002", Serial1, math_number(115200), math_number(26), math_number(25), math_number(255))
    dfrobot_c4002_set_report_period(variables_get($c4002), math_number(10))

arduino_loop()
    dfrobot_c4002_update(variables_get($c4002))
    serial_println(Serial, dfrobot_c4002_get_value(variables_get($c4002), TARGET_STATE))
```

## Notes

1. `dfrobot_c4002_init("name", ...)` creates `$name` as `DFRobot_C4002`.
2. Run `dfrobot_c4002_update` before reading note fields or detection values.
3. State enum: no target `0`, presence `1`, motion `2`, pin error `255`; direction enum: away `0`, none `1`, approaching `2`.
4. OUT pin `255` means unused.

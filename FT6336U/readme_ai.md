# FT6336U Touch Controller

Blockly library for the FT6336U capacitive touch controller.

## Library Info
- **Name**: @aily-project/lib-ft6336u
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ft6336u_init` | Statement | VAR(field_input), RST(input_value), INT(input_value) | `ft6336u_init("touch", math_number(21), math_number(34))` | `FT6336U touch(rst, int); touch.begin();` |
| `ft6336u_init_with_pins` | Statement | VAR(field_input), SDA(input_value), SCL(input_value), RST(input_value), INT(input_value) | `ft6336u_init_with_pins("touch", math_number(22), math_number(23), math_number(21), math_number(34))` | `FT6336U touch(sda, scl, rst, int); touch.begin();` |
| `ft6336u_touch_count` | Value | VAR(field_variable) | `ft6336u_touch_count(variables_get($touch))` | `touch.read_touch_number()` |
| `ft6336u_read_gesture` | Value | VAR(field_variable) | `ft6336u_read_gesture(variables_get($touch))` | `touch.read_gesture_id()` |
| `ft6336u_read_touch` | Value | VAR(field_variable), TOUCH(dropdown), FIELD(dropdown) | `ft6336u_read_touch(variables_get($touch), 1, x)` | `touch.read_touch1_x()` |
| `ft6336u_scan` | Statement | VAR(field_variable) | `ft6336u_scan(variables_get($touch))` | `touch_points = touch.scan();` |
| `ft6336u_scan_touch_count` | Value | VAR(field_variable) | `ft6336u_scan_touch_count(variables_get($touch))` | `touch_points.touch_count` |
| `ft6336u_scan_point` | Value | VAR(field_variable), POINT(dropdown), FIELD(dropdown) | `ft6336u_scan_point(variables_get($touch), 0, x)` | `touch_points.tp[0].x` |
| `ft6336u_scan_point_pressed` | Value | VAR(field_variable), POINT(dropdown) | `ft6336u_scan_point_pressed(variables_get($touch), 0)` | `touch_points.tp[0].status != release` |
| `ft6336u_set_device_mode` | Statement | VAR(field_variable), MODE(dropdown) | `ft6336u_set_device_mode(variables_get($touch), working_mode)` | `touch.write_device_mode(working_mode);` |
| `ft6336u_set_ctrl_mode` | Statement | VAR(field_variable), MODE(dropdown) | `ft6336u_set_ctrl_mode(variables_get($touch), keep_active_mode)` | `touch.write_ctrl_mode(keep_active_mode);` |
| `ft6336u_set_g_mode` | Statement | VAR(field_variable), MODE(dropdown) | `ft6336u_set_g_mode(variables_get($touch), pollingMode)` | `touch.write_g_mode(pollingMode);` |
| `ft6336u_read_mode_param` | Value | VAR(field_variable), PARAM(dropdown) | `ft6336u_read_mode_param(variables_get($touch), threshold)` | `touch.read_touch_threshold()` |
| `ft6336u_read_gesture_param` | Value | VAR(field_variable), PARAM(dropdown) | `ft6336u_read_gesture_param(variables_get($touch), radian)` | `touch.read_radian_value()` |
| `ft6336u_write_gesture_param` | Statement | VAR(field_variable), PARAM(dropdown), VALUE(input_value) | `ft6336u_write_gesture_param(variables_get($touch), radian, math_number(16))` | `touch.write_radian_value(value);` |
| `ft6336u_read_system_info` | Value | VAR(field_variable), PARAM(dropdown) | `ft6336u_read_system_info(variables_get($touch), chip_id)` | `touch.read_chip_id()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TOUCH | 1, 2 | raw touch point number |
| FIELD for `ft6336u_read_touch` | x, y, event, id, weight, misc | raw touch register field |
| POINT | 0, 1 | cached point index; 0 means point 1, 1 means point 2 |
| FIELD for `ft6336u_scan_point` | status, x, y | cached scan field |
| MODE for `ft6336u_set_device_mode` | working_mode, factory_mode | FT6336U device mode enum |
| MODE for `ft6336u_set_ctrl_mode` | keep_active_mode, switch_to_monitor_mode | FT6336U control mode enum |
| MODE for `ft6336u_set_g_mode` | pollingMode, triggerMode | FT6336U interrupt mode enum |
| PARAM for mode reads | threshold, filter, ctrl, monitor_time, active_rate, monitor_rate | mode parameter registers |
| PARAM for gesture reads/writes | radian, offset_lr, offset_ud, distance_lr, distance_ud, distance_zoom | gesture parameter registers |
| PARAM for system info | library_version, chip_id, g_mode, power_mode, firmware_id, focaltech_id, release_code_id, state | system information registers |

## ABS Examples

### Cached Read
```
arduino_setup()
    ft6336u_init_with_pins("touch", math_number(22), math_number(23), math_number(21), math_number(34))
    serial_begin(Serial, 115200)

arduino_loop()
    ft6336u_scan(variables_get($touch))
    serial_println(Serial, ft6336u_scan_point(variables_get($touch), 0, x))
    serial_println(Serial, ft6336u_scan_point(variables_get($touch), 0, y))
    time_delay(math_number(20))
```

## Notes

1. **Variable**: init blocks create `$varName`; reference it later with `variables_get($varName)`.
2. **Scan cache**: call `ft6336u_scan` before reading `ft6336u_scan_touch_count`, `ft6336u_scan_point`, or `ft6336u_scan_point_pressed`.
3. **Custom pins**: SDA/SCL are honored only on ESP32, ESP8266, and Teensy builds supported by upstream.
4. **Parameter order**: ABS parameters follow `block.json` args order.

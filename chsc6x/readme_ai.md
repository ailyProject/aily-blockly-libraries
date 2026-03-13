# CHSC6X触摸屏

CHSC6X电容式触摸屏控制器驱动库，支持单点触摸和旋转配置(I2C接口 暂支持255x255像素内的触摸屏)。

## Library Info
- **Name**: @aily-project/lib-chsc6x
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `chsc6x_setup` | Statement | VAR(field_input), WIRE(dropdown), ADDRESS(input_value), PIN(input_value), WIDTH(input_value), HEIGHT(input_value), ROTATION(dropdown) | `chsc6x_setup("touch", WIRE, math_number(0), math_number(2), math_number(0), math_number(0), 0)` | (dynamic code) |
| `chsc6x_is_pressed` | Value | VAR(field_variable) | `chsc6x_is_pressed($touch)` | (dynamic code) |
| `chsc6x_get_x` | Value | VAR(field_variable) | `chsc6x_get_x($touch)` | (dynamic code) |
| `chsc6x_get_y` | Value | VAR(field_variable) | `chsc6x_get_y($touch)` | (dynamic code) |
| `chsc6x_get_xy` | Value | VAR(field_variable), X(input_value), Y(input_value) | `chsc6x_get_xy($touch, math_number(0), math_number(0))` | (dynamic code) |
| `chsc6x_set_rotation` | Statement | VAR(field_variable), ROTATION(input_value) | `chsc6x_set_rotation($touch, math_number(0))` | (dynamic code) |
| `chsc6x_get_rotation` | Value | VAR(field_variable) | `chsc6x_get_rotation($touch)` | (dynamic code) |
| `chsc6x_set_screen_size` | Statement | VAR(field_variable), WIDTH(input_value), HEIGHT(input_value) | `chsc6x_set_screen_size($touch, math_number(0), math_number(0))` | (dynamic code) |
| `chsc6x_run` | Value | VAR(field_variable) | `chsc6x_run($touch)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ROTATION | 0, 1, 2, 3 | 0度 / 90度 / 180度 / 270度 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    chsc6x_setup("touch", WIRE, math_number(0), math_number(2), math_number(0), math_number(0), 0)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, chsc6x_is_pressed($touch))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `chsc6x_setup("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

# CST816S Touch Screen

CST816S capacitive touch screen driver library, supports gesture recognition, touch coordinate reading and interrupt handling via I2C

## Library Info
- **Name**: @aily-project/lib-cst816s
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `cst816s_init` | Statement | VAR(field_input), WIRE(dropdown), RST(input_value), IRQ(input_value) | `cst816s_init("touch", WIRE, 4, 5)` | Dynamic code |
| `cst816s_read_gesture` | Value | VAR(field_variable) | `cst816s_read_gesture(variables_get($touch))` | Dynamic code |
| `cst816s_read_position` | Value | VAR(field_variable), TYPE(dropdown) | `cst816s_read_position(variables_get($touch), x)` | Dynamic code |
| `cst816s_is_available` | Value | VAR(field_variable) | `cst816s_is_available(variables_get($touch))` | Dynamic code |
| `cst816s_enable_double_click` | Statement | VAR(field_variable) | `cst816s_enable_double_click(variables_get($touch))` | Dynamic code |
| `cst816s_enable_auto_sleep` | Statement | VAR(field_variable) | `cst816s_enable_auto_sleep(variables_get($touch))` | Dynamic code |
| `cst816s_disable_auto_sleep` | Statement | VAR(field_variable) | `cst816s_disable_auto_sleep(variables_get($touch))` | Dynamic code |
| `cst816s_sleep` | Statement | VAR(field_variable) | `cst816s_sleep(variables_get($touch))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE (read_position) | x, y, points, event | Position and event types |

## Gesture Types

| Gesture | Value | Description |
|---------|-------|-------------|
| NONE | 0x00 | No gesture |
| SWIPE_UP | 0x01 | Swipe upward |
| SWIPE_DOWN | 0x02 | Swipe downward |
| SWIPE_LEFT | 0x03 | Swipe left |
| SWIPE_RIGHT | 0x04 | Swipe right |
| SINGLE_CLICK | 0x05 | Single click |
| DOUBLE_CLICK | 0x0B | Double click |
| LONG_PRESS | 0x0C | Long press |

## ABS Examples

### Basic Usage
```
arduino_setup()
    cst816s_init("touch", Wire, math_number(4), math_number(5))
    serial_begin(Serial, 115200)

arduino_loop()
    if(cst816s_is_available(variables_get($touch)))
        serial_print(Serial, text("Gesture: "))
        serial_println(Serial, cst816s_read_gesture(variables_get($touch)))
        serial_print(Serial, text("X: "))
        serial_println(Serial, cst816s_read_position(variables_get($touch), x))
    time_delay(math_number(100))
```

## Notes

1. **Variable**: `cst816s_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Pin Configuration**: RST and IRQ pins must be specified during initialization.
3. **Gesture Recognition**: Returns gesture string (e.g., "SWIPE_LEFT", "SINGLE_CLICK").
4. **Coordinates**: X and Y coordinates range from 0 to screen resolution.
5. **Event Types**: 0 = Down, 1 = Up, 2 = Contact.

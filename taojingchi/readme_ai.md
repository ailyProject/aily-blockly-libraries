# Taojingchi serial screen driver library

Taojingchi serial screen control support library supports backlight adjustment, page switching, variable setting and other functions

## Library Info
- **Name**: @aily-project/lib-taojingchi
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `taojingchi_init` | Statement | RXPIN(input_value), TXPIN(input_value), BAUD(dropdown) | `taojingchi_init(math_number(2), math_number(2), "4800")` | Dynamic code |
| `taojingchi_backlight` | Statement | BRIGHTNESS(input_value) | `taojingchi_backlight(math_number(0))` | ....print("dim=" + String(...)); ....write(0xFF); ....write(0xFF); ....write(0xFF); delay( |
| `taojingchi_display_page` | Statement | PAGE(input_value) | `taojingchi_display_page(math_number(0))` | ....print("page" + String(...)); ....write(0xFF); ....write(0xFF); ....write(0xFF); delay( |
| `taojingchi_set_var` | Statement | VARNAME(dropdown), VALUE(input_value) | `taojingchi_set_var(data01, math_number(0))` | ....print("...=" + String((int)...)); ....write(0xFF); ....write(0xFF); ....write(0xFF); d |
| `taojingchi_display_image` | Statement | PAGE(input_value), IMG(input_value), ID(input_value) | `taojingchi_display_image(math_number(0), math_number(0), math_number(0))` | ....print("page" + String(...) + ".p" + String(...) + ".pic=" + String(...)); ....write(0x |
| `taojingchi_send_command` | Statement | COMMAND(input_value) | `taojingchi_send_command(text("value"))` | ....print(...); ....write(0xFF); ....write(0xFF); ....write(0xFF); delay(10); |
| `taojingchi_send_data` | Statement | COMMAND(input_value), VALUE(input_value) | `taojingchi_send_data(text("value"), math_number(0))` | ....print(...); ....print("="); ....print(String((int)...)); ....write(0xFF); ....write(0x |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BAUD | 4800, 9600, 57600, 115200 | taojingchi_init |
| VARNAME | data01, data02, data03, data04, data05, data06, data07, data08, data09, data10, data11, data12, data13, data14, data15, data16 | taojingchi_set_var |

## ABS Examples

### Basic Usage
```
arduino_setup()
    taojingchi_init(math_number(2), math_number(2), "4800")
    serial_begin(Serial, 9600)

arduino_loop()
    taojingchi_backlight(math_number(0))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

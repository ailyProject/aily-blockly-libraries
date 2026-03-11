# 淘晶驰串口屏驱动库

淘晶驰串口屏控制支持库，支持背光调节、页面切换、变量设置等功能

## Library Info
- **Name**: @aily-project/lib-taojingchi
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `taojingchi_init` | Statement | RXPIN(input_value), TXPIN(input_value), BAUD(dropdown) | `taojingchi_init(math_number(2), math_number(2), 4800)` | `` |
| `taojingchi_backlight` | Statement | BRIGHTNESS(input_value) | `taojingchi_backlight(math_number(0))` | `....print(` |
| `taojingchi_display_page` | Statement | PAGE(input_value) | `taojingchi_display_page(math_number(0))` | `....print(` |
| `taojingchi_set_var` | Statement | VARNAME(dropdown), VALUE(input_value) | `taojingchi_set_var(data01, math_number(0))` | `....print(` |
| `taojingchi_display_image` | Statement | PAGE(input_value), IMG(input_value), ID(input_value) | `taojingchi_display_image(math_number(0), math_number(0), math_number(0))` | `....print(` |
| `taojingchi_send_command` | Statement | COMMAND(input_value) | `taojingchi_send_command(math_number(0))` | (dynamic code) |
| `taojingchi_send_data` | Statement | COMMAND(input_value), VALUE(input_value) | `taojingchi_send_data(math_number(0), math_number(0))` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BAUD | 4800, 9600, 57600, 115200 | 4800 / 9600 / 57600 / 115200 |
| VARNAME | data01, data02, data03, data04, data05, data06, data07, data08, data09, data10, data11, data12, data13, data14, data15, data16 | data01 / data02 / data03 / data04 / data05 / data06 / data07 / data08 / data09 / data10 / data11 / data12 / data13 / data14 / data15 / data16 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    taojingchi_init(math_number(2), math_number(2), 4800)
    serial_begin(Serial, 9600)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

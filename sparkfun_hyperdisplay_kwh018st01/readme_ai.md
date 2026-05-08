# SparkFun KWH018ST01 TFT

KWH018ST01 TFT 彩屏 ABS 参考。

## Library Info
- **Name**: @aily-project/lib-sparkfun-hyperdisplay-kwh018st01
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `kwh018_init` | Statement | VAR(field_input), SPI(dropdown), DC(input_value), CS(input_value), BL(input_value), FREQ(input_value) | `kwh018_init("tft", SPI, math_number(8), math_number(10), math_number(9), math_number(24000000))` | `KWH018ST01_4WSPI tft; tft.begin(...);` |
| `kwh018_clear` | Statement | VAR(field_variable) | `kwh018_clear($tft)` | `tft.clearDisplay();` |
| `kwh018_set_backlight` | Statement | VAR(field_variable), BRIGHTNESS(input_value) | `kwh018_set_backlight($tft, math_number(255))` | `tft.setBacklight(255);` |
| `kwh018_pixel` | Statement | VAR(field_variable), X, Y, R, G, B(input_value) | `kwh018_pixel($tft, math_number(0), math_number(0), math_number(255), math_number(0), math_number(0))` | `tft.pixel(x, y, color);` |
| `kwh018_line` | Statement | VAR(field_variable), X0, Y0, X1, Y1, WIDTH, R, G, B(input_value) | `kwh018_line($tft, ...)` | `tft.line(...);` |
| `kwh018_rectangle` | Statement | VAR(field_variable), X0, Y0, X1, Y1, FILLED(dropdown), R, G, B(input_value) | `kwh018_rectangle($tft, ..., true, ...)` | `tft.rectangle(...);` |
| `kwh018_fill` | Statement | VAR(field_variable), R, G, B(input_value) | `kwh018_fill($tft, math_number(0), math_number(0), math_number(0))` | `tft.fillWindow(color);` |
| `kwh018_print` | Statement | VAR(field_variable), X, Y, TEXT, R, G, B(input_value) | `kwh018_print($tft, math_number(0), math_number(0), text("Hi"), ...)` | `tft.print(String(text));` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SPI | SPI, SPI1, ... | 开发板 SPI 总线 |
| FILLED | true, false | 是否填充矩形 |

## ABS Examples

```text
arduino_setup()
    kwh018_init("tft", SPI, math_number(8), math_number(10), math_number(9), math_number(24000000))
    kwh018_fill($tft, math_number(0), math_number(0), math_number(0))
    kwh018_print($tft, math_number(5), math_number(5), text("Hello"), math_number(255), math_number(255), math_number(255))
```

## Notes

1. `kwh018_init("name", ...)` creates variable `$name`.
2. RGB inputs are constrained to 0-255 and converted to ILI9163C 16-bit color.
3. Source folder includes HyperDisplay and ILI9163C dependency sources.
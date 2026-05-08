# SparkFun UG2856 Transparent OLED

UG2856KLBAG01 透明 OLED ABS 参考。

## Library Info
- **Name**: @aily-project/lib-sparkfun-hyperdisplay-ug2856klbag01
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ug2856_init_i2c` | Statement | VAR(field_input), WIRE(dropdown) | `ug2856_init_i2c("oled", Wire)` | `UG2856KLBAG01_I2C oled; oled.begin(Wire, false, SSD1309_ARD_UNUSED_PIN);` |
| `ug2856_init_spi` | Statement | VAR(field_input), SPI(dropdown), CS(input_value), DC(input_value) | `ug2856_init_spi("oled", SPI, math_number(10), math_number(9))` | `UG2856KLBAG01_SPI oled; oled.begin(cs, dc, SPI);` |
| `ug2856_clear` | Statement | VAR(field_variable) | `ug2856_clear($oled)` | `oled.clearDisplay();` |
| `ug2856_pixel` | Statement | VAR(field_variable), ACTION(dropdown), X(input_value), Y(input_value) | `ug2856_pixel($oled, Set, math_number(0), math_number(0))` | `oled.pixelSet(x, y);` |
| `ug2856_line` | Statement | VAR(field_variable), ACTION(dropdown), X0, Y0, X1, Y1, WIDTH(input_value) | `ug2856_line($oled, Set, ...)` | `oled.lineSet(...);` |
| `ug2856_rectangle` | Statement | VAR(field_variable), ACTION(dropdown), X0, Y0, X1, Y1(input_value), FILLED(dropdown) | `ug2856_rectangle($oled, Set, ..., true)` | `oled.rectangleSet(...);` |
| `ug2856_circle` | Statement | VAR(field_variable), ACTION(dropdown), X, Y, RADIUS(input_value), FILLED(dropdown) | `ug2856_circle($oled, Set, ..., false)` | `oled.circleSet(...);` |
| `ug2856_print` | Statement | VAR(field_variable), COLOR(dropdown), X(input_value), Y(input_value), TEXT(input_value) | `ug2856_print($oled, Set, math_number(0), math_number(0), text("Hi"))` | `oled.print(String(text));` |
| `ug2856_contrast` | Statement | VAR(field_variable), VALUE(input_value) | `ug2856_contrast($oled, math_number(255))` | `oled.setContrastControl(value);` |
| `ug2856_invert` | Statement | VAR(field_variable), ON(dropdown) | `ug2856_invert($oled, true)` | `oled.setInversion(true);` |
| `ug2856_power` | Statement | VAR(field_variable), ON(dropdown) | `ug2856_power($oled, true)` | `oled.setPower(true);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WIRE | Wire, Wire1, ... | I2C 总线 |
| SPI | SPI, SPI1, ... | SPI 总线 |
| ACTION | Set, Clear | 绘制或擦除 |
| FILLED | true, false | 是否填充 |
| COLOR | Set, Clear | 文本颜色：点亮或熄灭 |
| ON | true, false | 开/关状态 |

## ABS Examples

```text
arduino_setup()
    ug2856_init_i2c("oled", Wire)
    ug2856_clear($oled)
    ug2856_print($oled, Set, math_number(0), math_number(0), text("Hello"))
    ug2856_rectangle($oled, Set, math_number(0), math_number(16), math_number(80), math_number(40), false)
```

## Notes

1. `ug2856_init_i2c` and `ug2856_init_spi` both create variable `$name` with Blockly type `UG2856KLBAG01`.
2. This display is monochrome; drawing blocks use Set/Clear rather than RGB.
3. Source folder includes HyperDisplay and SSD1309 dependency sources.
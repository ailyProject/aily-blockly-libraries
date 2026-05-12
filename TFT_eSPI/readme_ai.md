# TFT_eSPI

TFT_eSPI - Arduino library, graphics and font library supporting multiple TFT displays

## Library Info
- **Name**: @aily-project/lib-tft-espi
- **Version**: 2.5.43

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tftespi_setup` | Statement | VAR(field_input), MODEL(dropdown), FREQUENCY(dropdown), WIDTH(input_value), HEIGHT(input_value), MISO(input_value), MOSI(input_value), SCLK(input_value), CS(... | `tftespi_setup("tft", ILI9341_DRIVER, "10000000", math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), HIGH, TFT_RGB)` | Dynamic code |
| `tftespi_set_rotation` | Statement | VAR(field_variable), ROTATION(dropdown) | `tftespi_set_rotation(variables_get($tft), "0")` | Dynamic code |
| `tftespi_invert_display` | Statement | VAR(field_variable), INVERT(dropdown) | `tftespi_invert_display(variables_get($tft), true)` | Dynamic code |
| `tftespi_fill_screen` | Statement | VAR(field_variable), COLOR(input_value) | `tftespi_fill_screen(variables_get($tft), math_number(0))` | Dynamic code |
| `tftespi_draw_pixel` | Statement | VAR(field_variable), X(input_value), Y(input_value), COLOR(input_value) | `tftespi_draw_pixel(variables_get($tft), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_draw_line` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(input_value) | `tftespi_draw_line(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_draw_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `tftespi_draw_rect(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_fill_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `tftespi_fill_rect(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_draw_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value) | `tftespi_draw_circle(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_fill_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value) | `tftespi_fill_circle(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_draw_triangle` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), X3(input_value), Y3(input_value), COLOR(input_value) | `tftespi_draw_triangle(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_fill_triangle` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), X3(input_value), Y3(input_value), COLOR(input_value) | `tftespi_fill_triangle(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_draw_string` | Statement | VAR(field_variable), X(input_value), Y(input_value), TEXT(input_value) | `tftespi_draw_string(variables_get($tft), math_number(0), math_number(0), text("value"))` | Dynamic code |
| `tftespi_set_text_color` | Statement | VAR(field_variable), COLOR(input_value) | `tftespi_set_text_color(variables_get($tft), math_number(0))` | Dynamic code |
| `tftespi_set_text_size` | Statement | VAR(field_variable), SIZE(dropdown) | `tftespi_set_text_size(variables_get($tft), "1")` | Dynamic code |
| `tftespi_set_text_font` | Statement | VAR(field_variable), FONT(dropdown) | `tftespi_set_text_font(variables_get($tft), "1")` | Dynamic code |
| `tftespi_color_rgb565` | Value | VAR(field_variable), COLOR(field_colour_hsv_sliders) | `tftespi_color_rgb565(variables_get($tft))` | Dynamic code |
| `tftespi_color` | Value | COLOR(dropdown) | `tftespi_color(TFT_BLACK)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODEL | ILI9341_DRIVER, ILI9341_2_DRIVER, ST7735_DRIVER, ILI9163_DRIVER, S6D02A1_DRIVER, RPI_ILI9486_DRIVER, HX8357D_DRIVER, ILI9481_DRIVER, ILI9486_DRIVER, ILI9488_DRIVER, ST7789_DRIVER, ST7789_2_DRIVER, R61581_DRIVER, RM681... | tftespi_setup |
| FREQUENCY | 10000000, 20000000, 27000000, 40000000, 55000000, 80000000 | tftespi_setup |
| BL_LEVEL | HIGH, LOW | tftespi_setup |
| COLOR_MODE | TFT_RGB, TFT_BGR | tftespi_setup |
| ROTATION | 0, 1, 2, 3, 4, 5, 6, 7 | tftespi_set_rotation |
| INVERT | true, false | tftespi_invert_display |
| SIZE | 1, 2, 3, 4, 5, 6, 7 | tftespi_set_text_size |
| FONT | 1, 2, 4, 6, 7, 8 | tftespi_set_text_font |
| COLOR | TFT_BLACK, TFT_WHITE, TFT_RED, TFT_GREEN, TFT_BLUE, TFT_YELLOW, TFT_CYAN, TFT_MAGENTA, TFT_ORANGE, TFT_LIGHTGREY, TFT_DARKGREY | tftespi_color |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tftespi_setup("tft", ILI9341_DRIVER, "10000000", math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), HIGH, TFT_RGB)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, tftespi_color_rgb565(variables_get($tft)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `tftespi_setup("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

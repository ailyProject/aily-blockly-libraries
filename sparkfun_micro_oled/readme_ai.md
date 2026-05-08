# SparkFun Micro OLED 显示屏

SparkFun Micro OLED Breakout 64x48 像素 I2C OLED 显示屏 Blockly 库。

## Library Info
- **Name**: @aily-project/lib-sparkfun-micro-oled
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `micro_oled_init` | Statement | VAR(field_input), RST_PIN(field_number), DC_PIN(field_number) | `micro_oled_init("oled", 9, 1)` | `MicroOLED oled(9, 1); Wire.begin(); oled.begin(); oled.clear(ALL); oled.display();` |
| `micro_oled_clear` | Statement | VAR(field_variable), MODE(field_dropdown) | `micro_oled_clear(variables_get($oled), ALL)` | `oled.clear(ALL);` |
| `micro_oled_display` | Statement | VAR(field_variable) | `micro_oled_display(variables_get($oled))` | `oled.display();` |
| `micro_oled_set_cursor` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `micro_oled_set_cursor(variables_get($oled), math_number(0), math_number(0))` | `oled.setCursor(0, 0);` |
| `micro_oled_print` | Statement | VAR(field_variable), TEXT(input_value) | `micro_oled_print(variables_get($oled), text("Hello"))` | `oled.print("Hello");` |
| `micro_oled_set_font` | Statement | VAR(field_variable), FONT(field_dropdown) | `micro_oled_set_font(variables_get($oled), 0)` | `oled.setFontType(0);` |
| `micro_oled_pixel` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `micro_oled_pixel(variables_get($oled), math_number(10), math_number(10))` | `oled.pixel(10, 10);` |
| `micro_oled_line` | Statement | VAR(field_variable), X0(input_value), Y0(input_value), X1(input_value), Y1(input_value) | `micro_oled_line(variables_get($oled), math_number(0), math_number(0), math_number(63), math_number(47))` | `oled.line(0, 0, 63, 47);` |
| `micro_oled_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), FILL(field_dropdown) | `micro_oled_rect(variables_get($oled), math_number(5), math_number(5), math_number(20), math_number(10), 0)` | `oled.rect(5, 5, 20, 10);` |
| `micro_oled_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), R(input_value), FILL(field_dropdown) | `micro_oled_circle(variables_get($oled), math_number(32), math_number(24), math_number(10), 0)` | `oled.circle(32, 24, 10);` |
| `micro_oled_invert` | Statement | VAR(field_variable), INV(field_dropdown) | `micro_oled_invert(variables_get($oled), true)` | `oled.invert(true);` |
| `micro_oled_contrast` | Statement | VAR(field_variable), CONTRAST(input_value) | `micro_oled_contrast(variables_get($oled), math_number(100))` | `oled.contrast(100);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | ALL, PAGE | 清除模式：ALL 清除硬件内存，PAGE 清除软件缓冲区 |
| FONT | 0, 1, 2, 3 | 字体类型：0=5x7小号, 1=8x16中号, 2=大数字, 3=超大字母 |
| FILL | 0, 1 | 0=空心, 1=填充 |
| INV | true, false | 是否反色 |
| DC_PIN | 0, 1 | DC 跳线/引脚（I2C 模式下通常为 0 或 1） |

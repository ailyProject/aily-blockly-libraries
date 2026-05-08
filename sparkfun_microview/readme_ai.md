# SparkFun MicroView

SparkFun MicroView 内置 Arduino + 64x48 OLED 一体模块 Blockly 库。

## Library Info
- **Name**: @aily-project/lib-sparkfun-microview
- **Version**: 0.0.1

## Notes
MicroView 使用全局单例 `uView` 对象，无需初始化变量，所有块直接操作 `uView`。

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `microview_begin` | Statement | (none) | `microview_begin()` | `uView.begin();` |
| `microview_clear` | Statement | MODE(field_dropdown) | `microview_clear(PAGE)` | `uView.clear(PAGE);` |
| `microview_display` | Statement | (none) | `microview_display()` | `uView.display();` |
| `microview_set_cursor` | Statement | X(input_value), Y(input_value) | `microview_set_cursor(math_number(0), math_number(0))` | `uView.setCursor(0, 0);` |
| `microview_print` | Statement | TEXT(input_value) | `microview_print(text("Hello"))` | `uView.print("Hello");` |
| `microview_set_font` | Statement | FONT(field_dropdown) | `microview_set_font(0)` | `uView.setFontType(0);` |
| `microview_pixel` | Statement | X(input_value), Y(input_value) | `microview_pixel(math_number(10), math_number(10))` | `uView.pixel(10, 10);` |
| `microview_line` | Statement | X0(input_value), Y0(input_value), X1(input_value), Y1(input_value) | `microview_line(math_number(0), math_number(0), math_number(63), math_number(47))` | `uView.line(0, 0, 63, 47);` |
| `microview_rect` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), FILL(field_dropdown) | `microview_rect(math_number(5), math_number(5), math_number(20), math_number(10), 0)` | `uView.rect(5, 5, 20, 10);` |
| `microview_circle` | Statement | X(input_value), Y(input_value), R(input_value), FILL(field_dropdown) | `microview_circle(math_number(32), math_number(24), math_number(10), 0)` | `uView.circle(32, 24, 10);` |
| `microview_invert` | Statement | INV(field_dropdown) | `microview_invert(true)` | `uView.invert(true);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | PAGE, ALL | 清除模式 |
| FONT | 0, 1, 2 | 字体类型：0=5x7, 1=8x16, 2=大数字 |
| FILL | 0, 1 | 0=空心, 1=填充 |
| INV | true, false | 反色开关 |

# SparkFun HyperDisplay 图形框架库

抽象图形库，提供统一绘图 API，需配合派生的具体显示屏驱动使用。变量名字段应与实际显示对象名一致。

## Library Info
- **Name**: @aily-project/lib-sparkfun-hyperdisplay
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `hyperdisplay_include` | Statement | — | `hyperdisplay_include()` | `#include <SparkFun_HyperDisplay/hyperdisplay.h>` (via addLibrary) |
| `hyperdisplay_fill_window` | Statement | VAR(field_input) | `hyperdisplay_fill_window("myDisplay")` | `myDisplay.fillWindow();` |
| `hyperdisplay_pixel` | Statement | VAR(field_input), X(input_value), Y(input_value) | `hyperdisplay_pixel("myDisplay", math_number(0), math_number(0))` | `myDisplay.pixel(0, 0);` |
| `hyperdisplay_line` | Statement | VAR(field_input), X0, Y0, X1, Y1, WIDTH(field_number) | `hyperdisplay_line("myDisplay", ...)` | `myDisplay.line(x0, y0, x1, y1, width);` |
| `hyperdisplay_rectangle` | Statement | VAR(field_input), X0, Y0, X1, Y1, FILLED(dropdown) | `hyperdisplay_rectangle("myDisplay", ...)` | `myDisplay.rectangle(x0, y0, x1, y1, false);` |
| `hyperdisplay_circle` | Statement | VAR(field_input), X, Y, R, FILLED(dropdown) | `hyperdisplay_circle("myDisplay", ...)` | `myDisplay.circle(x, y, r, false);` |
| `hyperdisplay_print` | Statement | VAR(field_input), X, Y, TEXT(input_value) | `hyperdisplay_print("myDisplay", math_number(0), math_number(0), text("Hello"))` | `myDisplay.setTextCursor(0, 0); myDisplay.print("Hello");` |

## Notes

1. **抽象基类**: `hyperdisplay` 类是纯虚抽象类，无法直接实例化，需使用具体派生类（如 HyperDisplay_SSD1309）
2. **变量名字段**: 所有积木使用 `field_input` 而非 `field_variable`，因为显示对象由其他具体驱动库创建
3. **绘图坐标**: 使用窗口坐标系（`hd_extent_t` = double 类型）

## ABS Examples

```
arduino_setup()
    hyperdisplay_include()
    // 具体显示屏初始化由对应驱动库积木完成
arduino_loop()
    hyperdisplay_fill_window("myDisplay")
    hyperdisplay_rectangle("myDisplay", math_number(10), math_number(10), math_number(50), math_number(50), true)
    hyperdisplay_print("myDisplay", math_number(0), math_number(0), text("Hello!"))
```

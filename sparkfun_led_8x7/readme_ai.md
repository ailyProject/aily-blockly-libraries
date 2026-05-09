# SparkFun 8x7 LED 阵列

控制 SparkFun 8×7 Charlieplex LED 阵列，支持图形绘制与滚动文字。

## Library Info
- **Name**: @aily-project/lib-sparkfun-led-8x7
- **Version**: 0.0.1

## Block Definitions

> 本库使用全局单例 `Plex`，无需变量管理。

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `led8x7_init` | Statement | P0..P7(input_value×8) | `led8x7_init(math_number(4),math_number(5),...,math_number(11))` | `Plex.init(pins);` |
| `led8x7_clear` | Statement | — | `led8x7_clear()` | `Plex.clear();` |
| `led8x7_display` | Statement | — | `led8x7_display()` | `Plex.display();` |
| `led8x7_pixel` | Statement | X(input_value), Y(input_value), ON(dropdown) | `led8x7_pixel(math_number(0), math_number(0), 1)` | `Plex.pixel(x,y,on);` |
| `led8x7_line` | Statement | X0,Y0,X1,Y1(input_value×4) | `led8x7_line(math_number(0),math_number(0),math_number(7),math_number(6))` | `Plex.line(x0,y0,x1,y1);` |
| `led8x7_rect` | Statement | X,Y,W,H(input_value×4), FILL(dropdown) | `led8x7_rect(math_number(0),math_number(0),math_number(4),math_number(3),0)` | `Plex.rect()/rectFill()` |
| `led8x7_scroll_text` | Statement | TEXT(input_value) | `led8x7_scroll_text(text("Hello"))` | `led8x7_scrollText("Hello");` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ON | 1, 0 | 1=亮，0=灭 |
| FILL | 0, 1 | 0=空心，1=实心 |

## ABS Examples

### 绘图并刷新
```
arduino_setup()
    led8x7_init(math_number(4),math_number(5),math_number(6),math_number(7),math_number(8),math_number(9),math_number(10),math_number(11))

arduino_loop()
    led8x7_clear()
    led8x7_pixel(math_number(3), math_number(3), 1)
    led8x7_display()
    time_delay(math_number(500))
```

## Notes

1. **Timer2**: 库占用 Timer2，不可用于 PWM 或其他用途
2. **全局对象**: 直接使用 `Plex` 全局实例，无需初始化变量名
3. **滚动文字**: 调用后立即开始滚动，默认无限循环

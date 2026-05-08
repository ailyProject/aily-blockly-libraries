# SparkFun SSD1320 OLED 显示屏

## Library Info
- **Name**: @aily-project/lib-sparkfun-ssd1320
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ssd1320_init` | Statement | VAR(field_input), RST/DC/CS(value) | `ssd1320_init("oled", 9, 8, 10)` | `SSD1320_OLED oled(9, 8, 10); oled.begin();` |
| `ssd1320_clear` | Statement | VAR(field_variable) | `ssd1320_clear(variables_get($oled))` | `oled.clear(PAGE); oled.display();` |
| `ssd1320_print` | Statement | VAR(field_variable), X/Y(value), TEXT(value) | `ssd1320_print(variables_get($oled), 0, 0, "Hello")` | `oled.setCursor(0,0); oled.print("Hello"); oled.display();` |
| `ssd1320_draw_rect` | Statement | VAR(field_variable), X/Y/W/H(value) | `ssd1320_draw_rect(variables_get($oled), 0, 0, 20, 10)` | `oled.rect(0,0,20,10); oled.display();` |

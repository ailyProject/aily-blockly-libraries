# SparkFun TeensyView OLED

## Library Info
- **Name**: @aily-project/lib-sparkfun-teensyview
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `teensyview_init` | Statement | VAR(field_input), RST/DC/CS/SCK/SDI(value) | `teensyview_init("oled", 9, 8, 10, 13, 11)` | `TeensyView oled(9,8,10,13,11); oled.begin();` |
| `teensyview_clear` | Statement | VAR(field_variable) | `teensyview_clear(variables_get($oled))` | `oled.clear(PAGE);` |
| `teensyview_print` | Statement | VAR(field_variable), X/Y(value), TEXT(value) | `teensyview_print(variables_get($oled), 0, 0, "Hi")` | `oled.setCursor(0,0); oled.print("Hi");` |
| `teensyview_pixel` | Statement | VAR(field_variable), X/Y(value), COLOR(dropdown:1/0) | `teensyview_pixel(variables_get($oled), 5, 5, 1)` | `oled.pixel(5, 5, 1);` |
| `teensyview_display` | Statement | VAR(field_variable) | `teensyview_display(variables_get($oled))` | `oled.display();` |

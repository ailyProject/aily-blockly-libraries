# 淘晶驰串口屏驱动库(STM32专用)

STM32F103C8专用淘晶驰串口屏驱动，支持硬件串口快速选择（Serial1/Serial2），无需SoftwareSerial。

## Library Info
- **Name**: @aily-project/lib-taojingchi-stm32
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `taojingchi_stm32_init` | Statement | SERIAL_PORT(dropdown), BAUD(dropdown) | `taojingchi_stm32_init(Serial1, "9600")` | Serial1.begin(9600); |
| `taojingchi_stm32_backlight` | Statement | BRIGHTNESS(input_value) | `taojingchi_stm32_backlight(math_number(100))` | Serial1.print("dim=" + String(100)); ...write(0xFF)x3; delay(10); |
| `taojingchi_stm32_display_page` | Statement | PAGE(input_value) | `taojingchi_stm32_display_page(math_number(0))` | Serial1.print("page" + String(0)); ...write(0xFF)x3; delay(10); |
| `taojingchi_stm32_set_var` | Statement | VARNAME(dropdown), VALUE(input_value) | `taojingchi_stm32_set_var(data01, math_number(0))` | Serial1.print("data01=" + String((int)0)); ...write(0xFF)x3; delay(10); |
| `taojingchi_stm32_display_image` | Statement | PAGE(input_value), IMG(input_value), ID(input_value) | `taojingchi_stm32_display_image(math_number(0), math_number(0), math_number(0))` | Serial1.print("page0.p0.pic=0"); ...write(0xFF)x3; delay(10); |
| `taojingchi_stm32_send_command` | Statement | COMMAND(input_value) | `taojingchi_stm32_send_command(text("CMD"))` | Serial1.print("CMD"); ...write(0xFF)x3; delay(10); |
| `taojingchi_stm32_send_data` | Statement | COMMAND(input_value), VALUE(input_value) | `taojingchi_stm32_send_data(text("cmd"), math_number(0))` | Serial1.print("cmd"); Serial1.print("="); Serial1.print(String((int)0)); ...write(0xFF)x3; delay(10); |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SERIAL_PORT | Serial1, Serial2 | Serial1=USART2(PA2/PA3), Serial2=USART3(PB10/PB11) |
| BAUD | 4800, 9600, 57600, 115200 | 串口波特率 |
| VARNAME | data01~data16 | 淘晶驰串口屏变量名 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    taojingchi_stm32_init(Serial1, "9600")
    serial_begin(Serial, 115200)

arduino_loop()
    taojingchi_stm32_backlight(math_number(80))
    taojingchi_stm32_display_page(math_number(1))
    time_delay(math_number(1000))
```

### Send Data to Screen
```
arduino_setup()
    taojingchi_stm32_init(Serial2, "115200")

arduino_loop()
    taojingchi_stm32_send_data(text("temp"), math_number(25))
    taojingchi_stm32_send_command(text("ref data01"))
    time_delay(math_number(500))
```

## Notes

1. **串口选择**: Serial1对应USART2(PA2-TX/PA3-RX)，Serial2对应USART3(PB10-TX/PB11-RX)
2. **初始化**: 必须在`arduino_setup()`中调用`taojingchi_stm32_init`
3. **参数顺序**: ABS参数严格遵循block.json的args0定义顺序
4. **输入值**: input_value位置使用`math_number(n)`、`text("s")`或变量`$var`

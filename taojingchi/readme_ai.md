# Taojingchi serial screen driver library

Taojingchi serial screen control support library supports backlight adjustment, page switching, variable setting and other functions

## Library Info
- **Name**: @aily-project/lib-taojingchi
- **Version**: 1.0.1

## Serial Initialization

Every control block ensures serial initialization in the generated setup preamble. Without `taojingchi_init`, defaults are MCU RX 2, TX 3 and 9600 baud. Explicit initialization overrides these defaults regardless of block generation order. Match the pins to the actual wiring and the baud rate to the screen configuration; connect MCU RX to screen TX and MCU TX to screen RX, with a shared GND.

ESP32 uses `Serial1.begin(baud, SERIAL_8N1, rx, tx)` without `SoftwareSerial`. Arduino AVR and UNO R4 use `SoftwareSerial taojingchiSerial(rx, tx)` and `taojingchiSerial.begin(baud)`. All six control blocks append exactly three `0xFF` bytes and retain a 10 ms delay.

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `taojingchi_init` | Statement | RXPIN(input_value), TXPIN(input_value), BAUD(dropdown) | `taojingchi_init(math_number(2), math_number(3), "4800")` | `SoftwareSerial taojingchiSerial(2, 3); ↵ taojingchiSerial.begin(4800);` |
| `taojingchi_backlight` | Statement | BRIGHTNESS(input_value) | `taojingchi_backlight(math_number(0))` | `taojingchiSerial.print("dim=" + String(0)); ↵ taojingchiSerial.write(0xFF); ↵ taojingchiSerial.write(0xFF); ↵ taojingchiSerial.write(0xFF); ↵ delay(10);` |
| `taojingchi_display_page` | Statement | PAGE(input_value) | `taojingchi_display_page(math_number(0))` | `taojingchiSerial.print("page " + String(0)); ↵ taojingchiSerial.write(0xFF); ↵ taojingchiSerial.write(0xFF); ↵ taojingchiSerial.write(0xFF); ↵ delay(10);` |
| `taojingchi_set_var` | Statement | VARNAME(dropdown), VALUE(input_value) | `taojingchi_set_var(data01, math_number(0))` | `taojingchiSerial.print("data01=" + String((int)0)); ↵ taojingchiSerial.write(0xFF); ↵ taojingchiSerial.write(0xFF); ↵ taojingchiSerial.write(0xFF); ↵ delay(10);` |
| `taojingchi_display_image` | Statement | PAGE(input_value), IMG(input_value), ID(input_value) | `taojingchi_display_image(math_number(0), math_number(0), math_number(0))` | `taojingchiSerial.print("page" + String(0) + ".p" + String(0) + ".pic=" + String(0)); ↵ taojingchiSerial.write(0xFF); ↵ taojingchiSerial.write(0xFF); ↵ taojingchiSerial.write(0xFF); ↵ delay(10);` |
| `taojingchi_send_command` | Statement | COMMAND(input_value) | `taojingchi_send_command(text("value"))` | `taojingchiSerial.print("value"); ↵ taojingchiSerial.write(0xFF); ↵ taojingchiSerial.write(0xFF); ↵ taojingchiSerial.write(0xFF); ↵ delay(10);` |
| `taojingchi_send_data` | Statement | COMMAND(input_value), VALUE(input_value) | `taojingchi_send_data(text("value"), math_number(0))` | `taojingchiSerial.print("value"); ↵ taojingchiSerial.print("="); ↵ taojingchiSerial.print(String((int)0)); ↵ taojingchiSerial.write(0xFF); ↵ taojingchiSerial.write(0xFF); ↵ taojingchiSerial.write(0xFF); ↵ delay(10);` |

The table shows AVR/UNO R4 command code; on ESP32 the command serial object is `Serial1`. Image addressing assumes pages named `pageN` and picture components named `pM`; `page1.p0.pic=2` is an attribute assignment and has no space after `page`. Cross-page access requires the component's global scope. Use `taojingchi_send_command` for different names.

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BAUD | 4800, 9600, 57600, 115200 | taojingchi_init |
| VARNAME | data01, data02, data03, data04, data05, data06, data07, data08, data09, data10, data11, data12, data13, data14, data15, data16 | taojingchi_set_var |

## ABS Examples

### Basic Usage
```
arduino_setup()
    taojingchi_init(math_number(2), math_number(3), "9600")
    taojingchi_display_page(math_number(1))

arduino_loop()
    taojingchi_backlight(math_number(100))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# ESP32 WS2812 Strip

Blockly bindings for direct-pin WS2812/WS2812B strips using Arduino-ESP32 3.x RMT hardware timing.

## Library Info
- **Name**: @aily-project/lib-esp32-ws2812
- **Version**: 2.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ws2812_init` | Statement | DATA_PIN(dropdown), COUNT(field_number) | `ws2812_init(DATA_PIN, 10)` | `ailyWs2812Init(DATA_PIN, 10);` |
| `ws2812_fill` | Statement | DATA_PIN(dropdown), RED(input_value), GREEN(input_value), BLUE(input_value) | `ws2812_fill(DATA_PIN, math_number(0), math_number(0), math_number(0))` | `ailyWs2812Fill(DATA_PIN, 1, 1, 1);` |
| `ws2812_set_pixel` | Statement | DATA_PIN(dropdown), INDEX(input_value), RED(input_value), GREEN(input_value), BLUE(input_value) | `ws2812_set_pixel(DATA_PIN, math_number(0), math_number(0), math_number(0), math_number(0))` | `ailyWs2812SetPixel(DATA_PIN, 1, 1, 1, 1);` |
| `ws2812_set_brightness` | Statement | DATA_PIN(dropdown), BRIGHTNESS(input_value) | `ws2812_set_brightness(DATA_PIN, math_number(0))` | `ailyWs2812SetBrightness(DATA_PIN, 1);` |
| `ws2812_clear` | Statement | DATA_PIN(dropdown) | `ws2812_clear(DATA_PIN)` | `ailyWs2812Clear(DATA_PIN);` |
| `ws2812_show` | Statement | DATA_PIN(dropdown) | `ws2812_show(DATA_PIN)` | `ailyWs2812Show(DATA_PIN);` |
| `ws2812_is_ready` | Value | DATA_PIN(dropdown) | `ws2812_is_ready(DATA_PIN)` | `ailyWs2812IsReady(DATA_PIN) ? 1 : 0` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ws2812_init(DATA_PIN, 10)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ws2812_is_ready(DATA_PIN))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. Initialize a pin before using its other strip blocks. Buffer updates take effect only after `ws2812_show`.
4. The library supports ESP32 boards only and can manage up to four data pins.

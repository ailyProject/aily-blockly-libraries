# XL9555 IO Expander

XL9555/PCA9555 IO expander: named pins, keys and high/low outputs; I2C pins from the board

## Library Info
- **Name**: @aily-project/lib-xl9555
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `xl9555_init` | Statement | ADDRESS(dropdown) | `xl9555_init(0)` | `xl9555.begin(Wire, 0);` |
| `xl9555_name_pin` | Statement | PIN(dropdown), NAME(field_input), MODE(dropdown) | `xl9555_name_pin(0, "key1", KEY_LOW)` | `xl9555.pinMode(xl9555_key1.pin, INPUT);` |
| `xl9555_key` | Value | NAME(field_variable), STATE(dropdown) | `xl9555_key($key1, PRESSED)` | `xl9555.pressed(xl9555_key1.pin, xl9555_key1.activeLow)` |
| `xl9555_write` | Statement | NAME(field_variable), LEVEL(dropdown) | `xl9555_write($key1, HIGH)` | `xl9555.digitalWrite(xl9555_key1.pin, HIGH);` |
| `xl9555_read` | Value | NAME(field_variable) | `xl9555_read($key1)` | `xl9555.digitalRead(xl9555_key1.pin)` |
| `xl9555_ok` | Value | (none) | `xl9555_ok()` | `xl9555.connected()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0, 0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27 | xl9555_init |
| PIN | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 | xl9555_name_pin |
| MODE | KEY_LOW, KEY_HIGH, INPUT, OUTPUT | xl9555_name_pin |
| STATE | PRESSED, RELEASED, HELD | xl9555_key |
| LEVEL | HIGH, LOW | xl9555_write |

## ABS Examples

### IBox S31: name the joystick keys and switch on the USB-A port
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    xl9555_init(0x27)
    xl9555_name_pin(4, "up", KEY_LOW)
    xl9555_name_pin(5, "a_key", KEY_LOW)
    xl9555_name_pin(7, "usb_power", OUTPUT)
    xl9555_write($usb_power, HIGH)

arduino_loop()
    controls_if()
        @IF0: xl9555_key($up, PRESSED)
        @DO0:
            serial_println(Serial, text("up pressed"))
    controls_if()
        @IF0: xl9555_key($a_key, HELD)
        @DO0:
            serial_println(Serial, text("A held"))
    time_delay(math_number(20))
```

## Notes

1. **Boards**: any ESP32 board. `xl9555_init` starts `Wire` on the board’s I2C pins and finds the chip at 0x20–0x27 (auto takes the first that answers). It also adds `xl9555.update()` to the start of `loop()`, which reads all 16 inputs once per pass.
2. **Names**: give each pin a name with `xl9555_name_pin` in setup; the name becomes an `XL9555Pin` variable, and the key, write and read blocks pick it from their dropdown. Each name becomes a global `const XL9555Pin xl9555_<name>` (non-ASCII characters are written as `_` plus their hex code), so a name used without a naming block fails to compile as "not declared". Pins are 0–7 for P00–P07 and 8–15 for P10–P17; writes change only the chosen bit.
3. **IBox S31**: XL9555 at 0x27 (SDA=IO0, SCL=IO1). P00 down, P01 center OK, P02 right, P03 left, P04 up, P05 A, P06 B (pressed = low); P07 turns on the USB-A port 5 V when set as output and high; P10 is SD_CTRL, the SD card power (output, low = on); P11–P17 are free. Never set a key pin as output: pressing the key would short the output to ground.

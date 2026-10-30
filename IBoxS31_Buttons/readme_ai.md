# IBox S31 Joystick & Buttons

IBox S31 onboard keys: five-way joystick (up, down, left, right, center OK) plus A and B

## Library Info
- **Name**: @aily-project/lib-iboxs31_buttons
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `iboxs31_keys_init` | Statement | (none) | `iboxs31_keys_init()` | `iboxs31_keys.begin(Wire, IBoxS31_Keys::ADDR, 0, 1);` |
| `iboxs31_keys_key` | Value | KEY(dropdown), STATE(dropdown) | `iboxs31_keys_key(IBOX_KEY_UP, HELD)` | `iboxs31_keys.isPressed(IBOX_KEY_UP)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| KEY | IBOX_KEY_UP, IBOX_KEY_DOWN, IBOX_KEY_LEFT, IBOX_KEY_RIGHT, IBOX_KEY_OK, IBOX_KEY_A, IBOX_KEY_B | iboxs31_keys_key |
| STATE | HELD, PRESSED, RELEASED | iboxs31_keys_key |

## ABS Examples

### Print which key was pressed
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    iboxs31_keys_init()

arduino_loop()
    controls_if()
        @IF0: iboxs31_keys_key(IBOX_KEY_A, PRESSED)
        @DO0:
            serial_println(Serial, text("A pressed"))
    controls_if()
        @IF0: iboxs31_keys_key(IBOX_KEY_B, RELEASED)
        @DO0:
            serial_println(Serial, text("B released"))
    controls_if()
        @IF0: iboxs31_keys_key(IBOX_KEY_UP, HELD)
        @DO0:
            serial_println(Serial, text("UP held"))
    time_delay(math_number(20))
```

## Notes

1. **Board**: IBox S31 only (Aily board IBOX S31, ESP32-S31, Arduino-ESP32 4.0.0). Keys sit on the XL9555 expander at I2C 0x27 (SDA=IO0, SCL=IO1): up, down, left, right, center OK, A and B. The onboard WS2812 LEDs are in the IBoxS31_RGBLED library.
2. **Key timing**: `iboxs31_keys_init` adds `iboxs31_keys.update()` to the start of `loop()`. "Just pressed" and "just released" are true for one loop pass only, so check them every pass; long `delay()` can miss short taps.
3. **USB port**: XL9555 pin P07 switches the USB-A port power and belongs to `IBoxS31_USB`; this library only reads the key inputs.

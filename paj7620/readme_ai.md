# PAJ7620 手势传感器

PAJ7620 I2C 手势识别传感器库，支持 9 种手势检测。

## Library Info
- **Name**: @aily-project/lib-paj7620
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `paj7620_init` | Statement | (none) | `paj7620_init()` | `Wire.begin(); paj7620Init();` |
| `paj7620_get_gesture` | Value | (none) | `paj7620_get_gesture()` | `paj7620GetGesture()` returns `String` |

## Gesture Return Values

| Gesture | Return String |
|---------|--------------|
| Right | `"Right"` |
| Left | `"Left"` |
| Up | `"Up"` |
| Down | `"Down"` |
| Forward | `"Forward"` |
| Backward | `"Backward"` |
| Clockwise | `"Clockwise"` |
| Anti-clockwise | `"Anti-clockwise"` |
| Wave | `"Wave"` |
| No gesture | `""` (empty string) |

## ABS Examples

### Basic Usage
```abs
arduino_setup()
    paj7620_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, paj7620_get_gesture())
    time_delay(math_number(100))
```

### With Conditional Check
```abs
arduino_setup()
    paj7620_init()
    serial_begin(Serial, 9600)

arduino_loop()
    controls_if()
        @IF0: logic_compare(paj7620_get_gesture(), NEQ, text(""))
        @DO0:
            serial_println(Serial, paj7620_get_gesture())
    time_delay(math_number(100))
```

## Notes

1. **I2C**: The init block automatically calls `Wire.begin()`. Default I2C address is 0x73.
2. **Serial**: The init block auto-enables Serial for debug output during initialization.
3. **Return type**: `paj7620_get_gesture` returns a `String` — empty string if no gesture detected.
4. **Wiring**: SDA → I2C SDA pin, SCL → I2C SCL pin, VCC → 3.3V/5V, GND → GND.

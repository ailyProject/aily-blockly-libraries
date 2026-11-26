# MT6701 magnetic rotary encoder

MT6701 magnetic rotary encoder library, supports angle reading, RPM calculation and revolution accumulation, for ESP32 and OJ Nano

## Library Info
- **Name**: @aily-project/lib-mt6701
- **Version**: 1.1.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mt6701_init` | Statement | OBJECT(field_variable) | `mt6701_init($encoder)` | `MT6701 encoder; ↵ encoder.begin(); ↵ encoder.poll();` |
| `mt6701_init_advanced` | Statement | OBJECT(field_variable), ADDRESS(dropdown), INTERVAL(input_value) | `mt6701_init_advanced($encoder, "0x06", math_number(1000))` | `MT6701 encoder(0x06, 1000); ↵ encoder.begin(); ↵ encoder.poll();` |
| `mt6701_get_angle_radians` | Value | OBJECT(field_variable) | `mt6701_get_angle_radians($encoder)` | `encoder.getAngleRadians()` |
| `mt6701_get_angle_degrees` | Value | OBJECT(field_variable) | `mt6701_get_angle_degrees($encoder)` | `encoder.getAngleDegrees()` |
| `mt6701_get_rpm` | Value | OBJECT(field_variable) | `mt6701_get_rpm($encoder)` | `encoder.getRPM()` |
| `mt6701_get_count` | Value | OBJECT(field_variable) | `mt6701_get_count($encoder)` | `encoder.getCount()` |
| `mt6701_get_full_turns` | Value | OBJECT(field_variable) | `mt6701_get_full_turns($encoder)` | `encoder.getFullTurns()` |
| `mt6701_get_turns` | Value | OBJECT(field_variable) | `mt6701_get_turns($encoder)` | `encoder.getTurns()` |
| `mt6701_get_accumulator` | Value | OBJECT(field_variable) | `mt6701_get_accumulator($encoder)` | `encoder.getAccumulator()` |
| `mt6701_update_count` | Statement | OBJECT(field_variable) | `mt6701_update_count($encoder)` | `encoder.updateCount();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x06, 0x46 (legacy unavailable options 0x07, 0x08, 0x09) | mt6701_init_advanced |

## ABS Examples

### Basic Usage
```
arduino_setup()
    mt6701_init($encoder)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, mt6701_get_angle_radians($encoder))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

The factory 7-bit I²C address is 0x06. Use 0x46 only for a chip already programmed to that address. The three older dropdown values remain loadable and return failure at initialization.

On ESP32 the driver samples in a task. On OJ Nano call `encoder.poll()` on every loop iteration. Both initialization blocks generate this automatically. Reads also poll when due. Set the interval and loop frequency high enough to observe less than half a revolution between samples. Use `encoder.updateCount()` for an immediate sample.

`begin()` reports whether a valid sample was read. A missing device can recover on a later sample. Check `isValid()` before using signed turn counts. A failed read returns −1 for the unsigned shaft count, NaN for floating-point quantities and INT_MIN for signed integer quantities. The first angle after startup or reconnection establishes a reference. Reconnection preserves the accumulated travel measured before disconnection. Call `end()` to release an instance and its sampler from the sketch that owns it.

# Seeed Adxl345

Blockly library for Seeed Adxl345.

## Library Info
- **Name**: @aily-project/lib-seeed-adxl345
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adxl345_init` | Statement | (none) | `adxl345_init()` | adxl345_accel.powerOn();\n |
| `adxl345_read_axis` | Value | AXIS(dropdown) | `adxl345_read_axis("0")` | adxl345_getAxis( |
| `adxl345_read_raw` | Value | AXIS(dropdown) | `adxl345_read_raw("0")` | adxl345_getRaw( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| AXIS | 0, 1, 2 | adxl345_read_axis, adxl345_read_raw |

## ABS Examples

### Basic Usage
```
arduino_setup()
    adxl345_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, adxl345_read_axis("0"))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

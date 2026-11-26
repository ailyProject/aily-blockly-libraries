# BMM150 three-axis magnetometer

Used to read BMM150 three-axis magnetic data and compass heading angle

## Library Info
- **Name**: @aily-project/lib-seeed-bmm150
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bmm150_init` | Statement | (none) | `bmm150_init()` | `BMM150 bmm150; ↵ bmm150.initialize();` |
| `bmm150_retry` | Statement | (none) | `bmm150_retry()` | `bmm150.initialize();` |
| `bmm150_initialized` | Boolean | (none) | `bmm150_initialized()` | `bmm150.isInitialized()` |
| `bmm150_read_x` | Value | (none) | `bmm150_read_x()` | `bmm150.readAxis('x')` |
| `bmm150_read_y` | Value | (none) | `bmm150_read_y()` | `bmm150.readAxis('y')` |
| `bmm150_read_z` | Value | (none) | `bmm150_read_z()` | `bmm150.readAxis('z')` |
| `bmm150_read_heading` | Value | (none) | `bmm150_read_heading()` | `bmm150.headingDegrees()` |
| `bmm150_set_preset_mode` | Statement | MODE(dropdown) | `bmm150_set_preset_mode(BMM150_PRESETMODE_LOWPOWER)` | `if (bmm150.isInitialized()) bmm150.set_presetmode(BMM150_PRESETMODE_LOWPOWER);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | BMM150_PRESETMODE_LOWPOWER, BMM150_PRESETMODE_REGULAR, BMM150_PRESETMODE_HIGHACCURACY, BMM150_PRESETMODE_ENHANCED | bmm150_set_preset_mode |

## ABS Examples

### Basic Usage
```
arduino_setup()
    bmm150_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, bmm150_read_x())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

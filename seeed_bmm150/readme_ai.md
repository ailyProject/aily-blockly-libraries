# BMM150 three-axis magnetometer

Used to read BMM150 three-axis magnetic data and compass heading angle

## Library Info
- **Name**: @aily-project/lib-seeed-bmm150
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bmm150_init` | Statement | (none) | `bmm150_init()` | Dynamic code |
| `bmm150_read_x` | Value | (none) | `bmm150_read_x()` | (bmm150.read_mag_data(), bmm150.mag_data.x) |
| `bmm150_read_y` | Value | (none) | `bmm150_read_y()` | (bmm150.read_mag_data(), bmm150.mag_data.y) |
| `bmm150_read_z` | Value | (none) | `bmm150_read_z()` | (bmm150.read_mag_data(), bmm150.mag_data.z) |
| `bmm150_read_heading` | Value | (none) | `bmm150_read_heading()` | bmm150_getHeading() |
| `bmm150_set_preset_mode` | Statement | MODE(dropdown) | `bmm150_set_preset_mode(BMM150_PRESETMODE_LOWPOWER)` | bmm150.set_presetmode( |

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

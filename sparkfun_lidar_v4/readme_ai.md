# SparkFun LIDAR-Lite v4 Distance Sensor

Blockly wrapper for SparkFun LIDAR-Lite v4 LED distance sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-lidar-v4
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lidarv4_init` | Statement | VAR(field_input) | `lidarv4_init("lidar")` | Wire.begin();\n |
| `lidarv4_get_distance` | Value | VAR(field_variable) | `lidarv4_get_distance(variables_get($lidar))` | Dynamic code |
| `lidarv4_configure` | Statement | VAR(field_variable), MODE(dropdown) | `lidarv4_configure(variables_get($lidar), "0")` | Dynamic code |
| `lidarv4_is_connected` | Value | VAR(field_variable) | `lidarv4_is_connected(variables_get($lidar))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | 0, 1, 2, 3, 4, 5 | lidarv4_configure |

## ABS Examples

### Basic Usage
```
arduino_setup()
    lidarv4_init("lidar")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, lidarv4_get_distance(variables_get($lidar)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `lidarv4_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

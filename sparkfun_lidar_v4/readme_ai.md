# SparkFun LIDAR-Lite v4 Distance Sensor

Blockly wrapper for SparkFun LIDAR-Lite v4 LED distance sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-lidar-v4
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lidarv4_init` | Statement | VAR(field_input) | `lidarv4_init("lidar")` | `Wire.begin(); ↵ lidar.begin();` |
| `lidarv4_get_distance` | Value | VAR(field_variable) | `lidarv4_get_distance($lidar)` | `lidar.getDistanceCm()` |
| `lidarv4_configure` | Statement | VAR(field_variable), MODE(dropdown) | `lidarv4_configure($lidar, "0")` | `lidar.configure(0);` |
| `lidarv4_is_connected` | Value | VAR(field_variable) | `lidarv4_is_connected($lidar)` | `lidar.isConnected()` |

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
    serial_println(Serial, lidarv4_get_distance($lidar))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `lidarv4_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

## Distance and errors

The distance block and `getDistanceCm(timeoutMs)` return centimetres, −1 on an I²C failure and −2 on a measurement timeout. The default polling timeout is 1000 ms. Coder can set a different timeout for slower acquisition settings. The existing unsigned `getDistance()` returns zero on failure. Acknowledge-only connection checks use `isConnected()`. Use `tryConfigure(mode)` in Coder to check both preset writes. The preset numbers stored in existing projects are preserved.

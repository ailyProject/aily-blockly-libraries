# Line Follower 8

Eight-channel line patrol sensor library supports I2C communication, status detection, offset calculation, and RGB light control

## Library Info
- **Name**: @aily-project/lib-linefollower-8
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `line_init` | Statement | WIRE(dropdown) | `line_init(WIRE)` | lineSensor.begin();\n |
| `line_is_state` | Value | STATE(dropdown) | `line_is_state("0")` | (lineSensor.calculateDigitalState(lineSensor.getLatestData()) == ...) |
| `line_get_state` | Value | (none) | `line_get_state()` | lineSensor.calculateDigitalState(lineSensor.getLatestData()) |
| `line_offset` | Value | (none) | `line_offset()` | lineSensor.calculateLineOffset(lineSensor.getLatestData()) |
| `line_sensor_value` | Value | SENSOR(dropdown) | `line_sensor_value("0")` | lineSensor.getSensorCurrent(lineSensor.getLatestData(), ...) |
| `line_sensor_reference` | Value | SENSOR(dropdown) | `line_sensor_reference("0")` | lineSensor.getSensorReference(lineSensor.getLatestData(), ...) |
| `line_sensor_digital` | Value | SENSOR(dropdown) | `line_sensor_digital("0")` | lineSensor.getSensorColor(lineSensor.getLatestData(), ...) |
| `line_set_rgb` | Statement | COLOR(dropdown) | `line_set_rgb("0")` | lineSensor.setModuleRGB(...);\n |
| `line_set_frequency` | Statement | INTERVAL(input_value) | `line_set_frequency(math_number(1000))` | lineSensor.setModuleFrequency(...);\n |
| `line_print_data` | Statement | (none) | `line_print_data()` | { SensorData data = lineSensor.getLatestData(); lineSensor.printSensorData(data); }\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STATE | 0, 24, 60, 126, 255, 1, 2, 4, 8, 16, 32, 64, 128, 3, 12, 48, 192 | line_is_state |
| SENSOR | 0, 1, 2, 3, 4, 5, 6, 7 | line_sensor_value, line_sensor_reference, line_sensor_digital |
| COLOR | 0, 1, 2, 3, 4, 5, 6, 7 | line_set_rgb |

## ABS Examples

### Basic Usage
```
arduino_setup()
    line_init(WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, line_is_state("0"))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

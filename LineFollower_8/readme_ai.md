# Line Follower 8

八路巡线传感器库，支持I2C通信、状态检测、偏移量计算、RGB灯控制

## Library Info
- **Name**: @aily-project/lib-linefollower-8
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `line_init` | Statement | WIRE(dropdown) | `line_init(WIRE)` | `lineSensor.begin();\n` |
| `line_is_state` | Value | STATE(dropdown) | `line_is_state(0)` | `(lineSensor.calculateDigitalState(lineSensor.getLatestData()) == ...)` |
| `line_get_state` | Value | (none) | `line_get_state()` | `lineSensor.calculateDigitalState(lineSensor.getLatestData())` |
| `line_offset` | Value | (none) | `line_offset()` | `lineSensor.calculateLineOffset(lineSensor.getLatestData())` |
| `line_sensor_value` | Value | SENSOR(dropdown) | `line_sensor_value(0)` | `lineSensor.getSensorCurrent(lineSensor.getLatestData(), ...)` |
| `line_sensor_reference` | Value | SENSOR(dropdown) | `line_sensor_reference(0)` | `lineSensor.getSensorReference(lineSensor.getLatestData(), ...)` |
| `line_sensor_digital` | Value | SENSOR(dropdown) | `line_sensor_digital(0)` | `lineSensor.getSensorColor(lineSensor.getLatestData(), ...)` |
| `line_set_rgb` | Statement | COLOR(dropdown) | `line_set_rgb(0)` | `lineSensor.setModuleRGB(...);\n` |
| `line_set_frequency` | Statement | INTERVAL(input_value) | `line_set_frequency(math_number(1000))` | `lineSensor.setModuleFrequency(...);\n` |
| `line_print_data` | Statement | (none) | `line_print_data()` | `{ SensorData data = lineSensor.getLatestData(); lineSensor.printSensorData(da...` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STATE | 0, 24, 60, 126, 255, 1, 2, 4, 8, 16, 32, 64, 128, 3, 12, 48, 192 | (0) 00000000 全白 / (24) 00011000 中间两路 / (60) 00111100 中间四路 / (126) 01111110 中间六路 / (255) 11111111 全黑 / (1) 00000001 A0 / (2) 00000010 A1 / (4) 00000100 A2 / (8) 00001000 A3 / (16) 00010000 A4 / (32) 00100000 A5 / (64) 01000000 A6 / (128) 10000000 A7 / (3) 00000011 A0+A1 / (12) 00001100 A2+A3 / (48) 00110000 A4+A5 / (192) 11000000 A6+A7 |
| SENSOR | 0, 1, 2, 3, 4, 5, 6, 7 | A0 / A1 / A2 / A3 / A4 / A5 / A6 / A7 |
| COLOR | 0, 1, 2, 3, 4, 5, 6, 7 | 关闭 / 红色 / 绿色 / 蓝色 / 白色 / 黄色 / 青色 / 紫色 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    line_init(WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, line_offset())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

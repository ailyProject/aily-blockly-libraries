# SparkFun ZX 距离与手势传感器

## Library Info
- **Name**: @aily-project/lib-sparkfun-zx-sensor
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `zx_sensor_init` | Statement | VAR(field_input) | `zx_sensor_init("gesture")` | `ZX_Sensor gesture; gesture.init();` |
| `zx_sensor_position_available` | Value→Boolean | VAR(field_variable) | `zx_sensor_position_available(variables_get($gesture))` | `gesture.positionAvailable()` |
| `zx_sensor_gesture_available` | Value→Boolean | VAR(field_variable) | `zx_sensor_gesture_available(variables_get($gesture))` | `gesture.gestureAvailable()` |
| `zx_sensor_read_x` | Value→Number | VAR(field_variable) | `zx_sensor_read_x(variables_get($gesture))` | `gesture.readX()` |
| `zx_sensor_read_z` | Value→Number | VAR(field_variable) | `zx_sensor_read_z(variables_get($gesture))` | `gesture.readZ()` |
| `zx_sensor_read_gesture` | Value→Number | VAR(field_variable) | `zx_sensor_read_gesture(variables_get($gesture))` | `gesture.readGesture()` |

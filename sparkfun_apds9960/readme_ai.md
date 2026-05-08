# SparkFun APDS9960

RGB, ambient light, proximity, and gesture blocks for APDS9960.

## Library Info
- **Name**: @aily-project/lib-sparkfun-apds9960
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `apds9960_init` | Statement | VAR(field_input) | `apds9960_init("apds9960")` | `SparkFun_APDS9960 apds9960; init(); enablePower();` |
| `apds9960_is_ready` | Value | VAR(field_variable) | `apds9960_is_ready(variables_get($apds9960))` | `apds9960_ready` |
| `apds9960_enable_light` | Statement | VAR(field_variable), INTERRUPT(dropdown) | `apds9960_enable_light(variables_get($apds9960), false)` | `enableLightSensor(interrupt);` |
| `apds9960_enable_proximity` | Statement | VAR(field_variable), INTERRUPT(dropdown) | `apds9960_enable_proximity(variables_get($apds9960), false)` | `enableProximitySensor(interrupt);` |
| `apds9960_enable_gesture` | Statement | VAR(field_variable), INTERRUPT(dropdown) | `apds9960_enable_gesture(variables_get($apds9960), true)` | `enableGestureSensor(interrupt);` |
| `apds9960_read_light` | Value | VAR(field_variable), CHANNEL(dropdown) | `apds9960_read_light(variables_get($apds9960), 0)` | `apds9960ReadLight(sensor, channel)` |
| `apds9960_read_proximity` | Value | VAR(field_variable) | `apds9960_read_proximity(variables_get($apds9960))` | `apds9960ReadProximity(sensor)` |
| `apds9960_gesture_available` | Value | VAR(field_variable) | `apds9960_gesture_available(variables_get($apds9960))` | `apds9960.isGestureAvailable()` |
| `apds9960_read_gesture` | Value | VAR(field_variable) | `apds9960_read_gesture(variables_get($apds9960))` | `apds9960.readGesture()` |
| `apds9960_set_ambient_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `apds9960_set_ambient_gain(variables_get($apds9960), AGAIN_4X)` | `setAmbientLightGain(gain);` |
| `apds9960_set_proximity_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `apds9960_set_proximity_gain(variables_get($apds9960), PGAIN_4X)` | `setProximityGain(gain);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| INTERRUPT | true, false | Enable hardware interrupt for that mode |
| CHANNEL | 0, 1, 2, 3 | Ambient, red, green, blue |
| Ambient GAIN | AGAIN_1X, AGAIN_4X, AGAIN_16X, AGAIN_64X | ALS/RGB gain |
| Proximity GAIN | PGAIN_1X, PGAIN_2X, PGAIN_4X, PGAIN_8X | Proximity gain |

## ABS Examples

```text
arduino_setup()
    apds9960_init("apds9960")
    apds9960_enable_light(variables_get($apds9960), false)

arduino_loop()
    serial_println(Serial, apds9960_read_light(variables_get($apds9960), 0))
```

## Notes

Gesture values are the library enum numbers: `DIR_LEFT`, `DIR_RIGHT`, `DIR_UP`, `DIR_DOWN`, `DIR_NEAR`, `DIR_FAR`.
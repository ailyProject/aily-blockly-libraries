# Si7021 temperature and humidity sensor

Si7021 temperature and humidity sensor control library realizes high-precision measurement of ambient temperature and humidity through I2C interface, and is suitable for development boards such as Arduino and ESP32.

## Library Info
- **Name**: @aily-project/lib-adafruit-si7021
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `si7021_begin` | Statement | OBJECT(field_variable), WIRE(dropdown) | `si7021_begin($sensor, WIRE)` | `if (!sensor.begin()) { ↵ Serial.println("Did not find Si7021 sensor!"); ↵ while (true); ↵ }` |
| `si7021_read_temperature` | Value | OBJECT(field_variable) | `si7021_read_temperature($sensor)` | `sensor.readTemperature()` |
| `si7021_read_humidity` | Value | OBJECT(field_variable) | `si7021_read_humidity($sensor)` | `sensor.readHumidity()` |
| `si7021_heater_control` | Statement | OBJECT(field_variable), STATE(dropdown) | `si7021_heater_control($sensor, true)` | `sensor.heater(true);` |
| `si7021_is_heater_enabled` | Value | OBJECT(field_variable) | `si7021_is_heater_enabled($sensor)` | `sensor.isHeaterEnabled()` |
| `si7021_set_heat_level` | Statement | OBJECT(field_variable), LEVEL(dropdown) | `si7021_set_heat_level($sensor, SI_HEATLEVEL_LOWEST)` | `sensor.setHeatLevel(SI_HEATLEVEL_LOWEST);` |
| `si7021_get_model` | Value | OBJECT(field_variable) | `si7021_get_model($sensor)` | `String(sensor.getModel())` |
| `si7021_get_revision` | Value | OBJECT(field_variable) | `si7021_get_revision($sensor)` | `sensor.getRevision()` |
| `si7021_reset` | Statement | OBJECT(field_variable) | `si7021_reset($sensor)` | `sensor.reset();` |
| `si7021_read_serial_number` | Statement | OBJECT(field_variable) | `si7021_read_serial_number($sensor)` | `sensor.readSerialNumber(); ↵ Serial.print("Si7021序列号: "); ↵ Serial.print(sensor.sernum_a, HEX); ↵ Serial.print("-"); ↵ Serial.println(sensor.sernum_b, HEX);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STATE | true, false | si7021_heater_control |
| LEVEL | SI_HEATLEVEL_LOWEST, SI_HEATLEVEL_LOW, SI_HEATLEVEL_MEDIUM, SI_HEATLEVEL_HIGH, SI_HEATLEVEL_HIGHER, SI_HEATLEVEL_HIGHEST | si7021_set_heat_level |

## ABS Examples

### Basic Usage
```
arduino_setup()
    si7021_begin($sensor, WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, si7021_read_temperature($sensor))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

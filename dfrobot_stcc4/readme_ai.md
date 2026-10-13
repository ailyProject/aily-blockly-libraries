# STCC4 CO2 Sensor

Gravity STCC4 CO2 sensor library for reading CO2 concentration over I2C, with temperature, humidity, status, compensation, calibration, sleep, wakeup, and reset blocks.

## Library Info
- **Name**: @aily-project/lib-dfrobot-stcc4
- **Version**: 0.1.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `stcc4_init` | Statement | VAR(field_input), WIRE(dropdown), ADDRESS(dropdown) | `stcc4_init("stcc4", Wire, "0x64")` | `while (!stcc4.begin()) { ↵ delay(500); ↵ } ↵ stcc4.wakeup(); ↵ delay(10); ↵ stcc4.startMeasurement();` |
| `stcc4_read` | Value | VAR(field_variable) | `stcc4_read($stcc4)` | `stcc4.measurement(&stcc4CO2, &stcc4Temperature, &stcc4Humidity, &stcc4Status)` |
| `stcc4_get_data` | Value | VAR(field_variable), DATA(dropdown) | `stcc4_get_data($stcc4, CO2)` | `stcc4CO2` |
| `stcc4_get_id` | Value | VAR(field_variable) | `stcc4_get_id($stcc4)` | `stcc4.getID()` |
| `stcc4_measurement_control` | Statement | VAR(field_variable), ACTION(dropdown) | `stcc4_measurement_control($stcc4, startMeasurement)` | `stcc4.startMeasurement();` |
| `stcc4_power_control` | Statement | VAR(field_variable), ACTION(dropdown) | `stcc4_power_control($stcc4, wakeup)` | `stcc4.wakeup();` |
| `stcc4_reset` | Statement | VAR(field_variable), TYPE(dropdown) | `stcc4_reset($stcc4, softRest)` | `stcc4.softRest();` |
| `stcc4_set_rht_compensation` | Statement | VAR(field_variable), TEMPERATURE(input_value), HUMIDITY(input_value) | `stcc4_set_rht_compensation($stcc4, math_number(0), math_number(0))` | `stcc4.setRHTcompensation(0, 0);` |
| `stcc4_set_pressure_compensation` | Statement | VAR(field_variable), PRESSURE(input_value) | `stcc4_set_pressure_compensation($stcc4, math_number(0))` | `stcc4.setPressureCompensation(0);` |
| `stcc4_forced_recalibration` | Value | VAR(field_variable), TARGET_PPM(input_value) | `stcc4_forced_recalibration($stcc4, math_number(0))` | `stcc4.forcedRecalibration(0, &stcc4FrcCorrection)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x64, 0x65 | stcc4_init |
| DATA | CO2, TEMPERATURE, HUMIDITY, STATUS, FRC_CORRECTION | stcc4_get_data |
| ACTION | startMeasurement, stopMeasurement, singleMeasurement | stcc4_measurement_control |
| ACTION | wakeup, sleep | stcc4_power_control |
| TYPE | softRest, factoryReset | stcc4_reset |

## ABS Examples

### Basic Usage
```
arduino_setup()
    stcc4_init("stcc4", Wire, "0x64")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, stcc4_read($stcc4))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `stcc4_init` creates a Blockly variable. Use `$varName` only for field_variable slots; input_value slots must use the explicit `variables_get($varName)` block.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(true/false)`, variables, or nested value blocks.

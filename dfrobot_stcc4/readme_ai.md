# STCC4 CO2 Sensor

Gravity STCC4 CO2 sensor library for Aily Blockly.

## Library Info
- **Name**: @aily-project/lib-dfrobot-stcc4
- **Version**: 0.1.0
- **Author**: YeezB
- **Source**: https://gitee.com/yeezb/ext-stcc4-co2-sensor
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `stcc4_init` | Statement | VAR(field_input), WIRE(field_dropdown), ADDRESS(field_dropdown) | `stcc4_init("stcc4", Wire, "0x64")` | create `DFRobot_STCC4_I2C`, `begin`, `wakeup`, `startMeasurement` |
| `stcc4_read` | Value | VAR(field_variable) | `stcc4_read(variables_get($stcc4))` | `measurement(&co2, &temperature, &humidity, &status)` |
| `stcc4_get_data` | Value | VAR(field_variable), DATA(field_dropdown) | `stcc4_get_data(variables_get($stcc4), CO2)` | returns cached data variable |
| `stcc4_get_id` | Value | VAR(field_variable) | `stcc4_get_id(variables_get($stcc4))` | `getID()` |
| `stcc4_measurement_control` | Statement | VAR(field_variable), ACTION(field_dropdown) | `stcc4_measurement_control(variables_get($stcc4), startMeasurement)` | start/stop/single measurement |
| `stcc4_power_control` | Statement | VAR(field_variable), ACTION(field_dropdown) | `stcc4_power_control(variables_get($stcc4), wakeup)` | `wakeup()` or `sleep()` |
| `stcc4_reset` | Statement | VAR(field_variable), TYPE(field_dropdown) | `stcc4_reset(variables_get($stcc4), softRest)` | `softRest()` or `factoryReset()` |
| `stcc4_set_rht_compensation` | Statement | VAR(field_variable), TEMPERATURE(input_value), HUMIDITY(input_value) | `stcc4_set_rht_compensation(variables_get($stcc4), math_number(25), math_number(50))` | `setRHTcompensation(temp, humidity)` |
| `stcc4_set_pressure_compensation` | Statement | VAR(field_variable), PRESSURE(input_value) | `stcc4_set_pressure_compensation(variables_get($stcc4), math_number(1013))` | `setPressureCompensation(pressure)` |
| `stcc4_forced_recalibration` | Value | VAR(field_variable), TARGET_PPM(input_value) | `stcc4_forced_recalibration(variables_get($stcc4), math_number(400))` | `forcedRecalibration(target, &correction)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x64, 0x65 | I2C address |
| DATA | CO2, TEMPERATURE, HUMIDITY, STATUS, FRC_CORRECTION | cached sensor values |
| ACTION | startMeasurement, stopMeasurement, singleMeasurement, wakeup, sleep | depends on block |
| TYPE | softRest, factoryReset | reset command |

## ABS Examples

```
arduino_setup()
    stcc4_init("stcc4", Wire, "0x64")

arduino_loop()
    controls_if(stcc4_read(variables_get($stcc4)))
        serial_println(Serial, stcc4_get_data(variables_get($stcc4), CO2))
```

## Notes

1. `stcc4_init("name", ...)` creates `$name` as `DFRobot_STCC4_I2C`.
2. Run `stcc4_read` before `stcc4_get_data`; data blocks return the last cached values.
3. RHT compensation accepts 10-40 C and 20-80 %RH. Pressure compensation accepts 400-1100 hPa.
4. Forced recalibration target must be 0-32000 ppm; read `FRC_CORRECTION` after success.

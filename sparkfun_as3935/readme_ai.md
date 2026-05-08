# SparkFun AS3935

Lightning detector blocks for AS3935.

## Library Info
- **Name**: @aily-project/lib-sparkfun-as3935
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `as3935_init_i2c` | Statement | VAR(field_input), ADDRESS(dropdown) | `as3935_init_i2c("as3935", 0x03)` | `SparkFun_AS3935 as3935(addr); as3935.begin(Wire);` |
| `as3935_init_spi` | Statement | VAR(field_input), CS(field_number) | `as3935_init_spi("as3935", 10)` | `SparkFun_AS3935 as3935; as3935.beginSPI(cs);` |
| `as3935_is_ready` | Value | VAR(field_variable) | `as3935_is_ready(variables_get($as3935))` | `as3935_ready` |
| `as3935_set_environment` | Statement | VAR(field_variable), ENV(dropdown) | `as3935_set_environment(variables_get($as3935), INDOOR)` | `as3935.setIndoorOutdoor(env);` |
| `as3935_read_interrupt` | Value | VAR(field_variable) | `as3935_read_interrupt(variables_get($as3935))` | `as3935.readInterruptReg()` |
| `as3935_distance` | Value | VAR(field_variable) | `as3935_distance(variables_get($as3935))` | `as3935.distanceToStorm()` |
| `as3935_energy` | Value | VAR(field_variable) | `as3935_energy(variables_get($as3935))` | `as3935.lightningEnergy()` |
| `as3935_set_watchdog` | Statement | VAR(field_variable), VALUE(input_value) | `as3935_set_watchdog(variables_get($as3935), math_number(2))` | `as3935.watchdogThreshold(value);` |
| `as3935_set_noise` | Statement | VAR(field_variable), VALUE(input_value) | `as3935_set_noise(variables_get($as3935), math_number(2))` | `as3935.setNoiseLevel(value);` |
| `as3935_set_spike` | Statement | VAR(field_variable), VALUE(input_value) | `as3935_set_spike(variables_get($as3935), math_number(2))` | `as3935.spikeRejection(value);` |
| `as3935_set_lightning_threshold` | Statement | VAR(field_variable), STRIKES(dropdown) | `as3935_set_lightning_threshold(variables_get($as3935), 1)` | `as3935.lightningThreshold(strikes);` |
| `as3935_mask_disturber` | Statement | VAR(field_variable), STATE(dropdown) | `as3935_mask_disturber(variables_get($as3935), true)` | `as3935.maskDisturber(state);` |
| `as3935_calibrate` | Statement | VAR(field_variable) | `as3935_calibrate(variables_get($as3935))` | `as3935.calibrateOsc();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x03, 0x02, 0x01 | I2C address |
| ENV | INDOOR, OUTDOOR | Environment tuning |
| STRIKES | 1, 5, 9, 16 | Strike count threshold |
| STATE | true, false | Disturber mask state |

## ABS Examples

```text
arduino_setup()
    as3935_init_i2c("as3935", 0x03)
    as3935_set_environment(variables_get($as3935), OUTDOOR)

arduino_loop()
    controls_if()
        @IF0: logic_compare(as3935_read_interrupt(variables_get($as3935)), EQ, math_number(8))
        @DO0:
            serial_println(Serial, as3935_distance(variables_get($as3935)))
```

## Notes

The hardware INT pin should be checked before reading interrupt status in event-driven sketches.
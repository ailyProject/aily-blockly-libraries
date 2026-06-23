# Seeed AS5600 Magnetic Encoder

Grove AS5600 12-bit magnetic absolute encoder blocks for angle reading, magnet checks, position configuration, and burn status.

## Library Info
- **Name**: @aily-project/lib-seeed-as5600
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_as5600_init` | Statement | VAR(field_input) | `seeed_as5600_init("as5600")` | `AMS_5600 as5600; Wire.begin();` |
| `seeed_as5600_get_address` | Value | VAR(field_variable) | `seeed_as5600_get_address(variables_get($as5600))` | `as5600.getAddress()` |
| `seeed_as5600_read_angle` | Value | VAR(field_variable), ANGLE_TYPE(dropdown), UNIT(dropdown) | `seeed_as5600_read_angle(variables_get($as5600), RAW, DEGREES)` | `as5600.getRawAngle()` or helper degrees |
| `seeed_as5600_detect_magnet` | Value | VAR(field_variable) | `seeed_as5600_detect_magnet(variables_get($as5600))` | `as5600.detectMagnet() == 1` |
| `seeed_as5600_magnet_status` | Value | VAR(field_variable), STATUS(dropdown) | `seeed_as5600_magnet_status(variables_get($as5600), GOOD)` | `as5600.getMagnetStrength() == n` |
| `seeed_as5600_get_magnet_strength` | Value | VAR(field_variable) | `seeed_as5600_get_magnet_strength(variables_get($as5600))` | `as5600.getMagnetStrength()` |
| `seeed_as5600_get_magnitude` | Value | VAR(field_variable) | `seeed_as5600_get_magnitude(variables_get($as5600))` | `as5600.getMagnitude()` |
| `seeed_as5600_get_agc` | Value | VAR(field_variable) | `seeed_as5600_get_agc(variables_get($as5600))` | `as5600.getAgc()` |
| `seeed_as5600_set_position_current` | Statement | VAR(field_variable), TARGET(dropdown) | `seeed_as5600_set_position_current(variables_get($as5600), START)` | `as5600.setStartPosition();` |
| `seeed_as5600_set_position` | Statement | VAR(field_variable), TARGET(dropdown), VALUE(input_value) | `seeed_as5600_set_position(variables_get($as5600), START, math_number(0))` | `as5600.setStartPosition(value);` |
| `seeed_as5600_get_position` | Value | VAR(field_variable), TARGET(dropdown) | `seeed_as5600_get_position(variables_get($as5600), START)` | `as5600.getStartPosition()` |
| `seeed_as5600_set_output_mode` | Statement | VAR(field_variable), MODE(dropdown) | `seeed_as5600_set_output_mode(variables_get($as5600), 0)` | `as5600.setOutPut(mode);` |
| `seeed_as5600_get_conf` | Value | VAR(field_variable) | `seeed_as5600_get_conf(variables_get($as5600))` | `as5600.getConf()` |
| `seeed_as5600_set_conf` | Statement | VAR(field_variable), CONFIG(input_value) | `seeed_as5600_set_conf(variables_get($as5600), math_number(0))` | `as5600.setConf(config);` |
| `seeed_as5600_get_burn_count` | Value | VAR(field_variable) | `seeed_as5600_get_burn_count(variables_get($as5600))` | `as5600.getBurnCount()` |
| `seeed_as5600_burn_angle` | Value | VAR(field_variable) | `seeed_as5600_burn_angle(variables_get($as5600))` | `as5600.burnAngle()` |
| `seeed_as5600_burn_settings` | Value | VAR(field_variable) | `seeed_as5600_burn_settings(variables_get($as5600))` | `as5600.burnMaxAngleAndConfig()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ANGLE_TYPE | RAW, SCALED | Raw sensor angle or scaled angle after configured start/end/max settings |
| UNIT | RAW, DEGREES | Return 0-4095 raw units or convert to degrees with `raw * 0.087890625` |
| STATUS | NONE, WEAK, GOOD, STRONG | Magnet strength state from `getMagnetStrength()` |
| TARGET | START, END, MAX | Start position, end position, or max angle register |
| MODE | 0, 1, 2 | Output mode: PWM, analog 0-100%, analog 10-90% |

## ABS Examples

### Basic Angle Read
```
arduino_setup()
    seeed_as5600_init("as5600")
    serial_begin(Serial, 115200)

arduino_loop()
    controls_if()
        @IF0: seeed_as5600_detect_magnet(variables_get($as5600))
        @DO0:
            serial_println(Serial, seeed_as5600_read_angle(variables_get($as5600), RAW, DEGREES))
    time_delay(math_number(500))
```

### Configure Position Range
```
arduino_setup()
    seeed_as5600_init("as5600")
    seeed_as5600_set_position_current(variables_get($as5600), START)
    seeed_as5600_set_position(variables_get($as5600), END, math_number(2048))
```

## Notes

1. **Variable**: `seeed_as5600_init("as5600")` creates variable `$as5600`; reference it later with `variables_get($as5600)`.
2. **I2C**: The generator adds `#include <Wire.h>`, `#include <AS5600.h>`, an `AMS_5600` instance, and `Wire.begin()`.
3. **Burn APIs**: `seeed_as5600_burn_angle` and `seeed_as5600_burn_settings` permanently program chip registers and have limited uses.
4. **Return codes**: `burnAngle()` returns 1 success, -1 no magnet, -2 burn limit exceeded, -3 no positions set. `burnMaxAngleAndConfig()` returns 1 success, -1 already burned, -2 max angle too small.
5. **Parameter order**: ABS parameters follow `block.json` args order.
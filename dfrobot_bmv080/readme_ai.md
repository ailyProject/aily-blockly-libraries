# BMV080 PM Sensor

DFRobot BMV080 particulate matter sensor blocks for ESP32.

## Library Info

- **Name**: `@aily-project/lib-dfrobot-bmv080`
- **Version**: `0.1.0`
- **Arduino class**: `DFRobot_BMV080`, `DFRobot_BMV080_I2C`, `DFRobot_BMV080_SPI`
- **Transport**: I2C or SPI. Upstream package uses precompiled ESP32 libraries.

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bmv080_init_i2c` | Statement | `VAR(field_input)`, `WIRE(field_dropdown)`, `ADDRESS(field_dropdown)` | `bmv080_init_i2c("bmv080", Wire, "0x57")` | Declares `DFRobot_BMV080_I2C`, adds stack macro, waits for `begin() == 0` and `openBmv080() == 0`. |
| `bmv080_init_spi` | Statement | `VAR(field_input)`, `SPI(field_dropdown)`, `CS(input_value)` | `bmv080_init_spi("bmv080", SPI, math_number(17))` | Declares `DFRobot_BMV080_SPI`, adds stack macro, waits for `begin() == 0` and `openBmv080() == 0`. |
| `bmv080_set_mode` | Statement | `VAR(field_variable)`, `MODE(field_dropdown)` | `bmv080_set_mode($bmv080, CONTINUOUS_MODE)` | `bmv080.setBmv080Mode(mode);` |
| `bmv080_set_duty_cycle` | Statement | `VAR(field_variable)`, `PERIOD(input_value)`, `INTEGRATION(input_value)` | `bmv080_set_duty_cycle($bmv080, math_number(20), math_number(10))` | Calls `setDutyCyclingPeriod(period)` then `setIntegrationTime(integration)`. |
| `bmv080_set_algorithm` | Statement | `VAR(field_variable)`, `ALGORITHM(field_dropdown)` | `bmv080_set_algorithm($bmv080, BALANCED)` | `bmv080.setMeasurementAlgorithm(algorithm);` |
| `bmv080_set_feature` | Statement | `VAR(field_variable)`, `FEATURE(field_dropdown)`, `STATE(field_dropdown)` | `bmv080_set_feature($bmv080, OBSTRUCTION, true)` | Calls `setObstructionDetection(state)` or `setDoVibrationFiltering(state)`. |
| `bmv080_read_data` | Value Boolean | `VAR(field_variable)` | `bmv080_read_data($bmv080)` | `bmv080.getBmv080Data(&bmv080_pm1, &bmv080_pm25, &bmv080_pm10)` |
| `bmv080_pm_value` | Value Number | `VAR(field_variable)`, `DATA(field_dropdown)` | `bmv080_pm_value($bmv080, PM25)` | Returns cached `bmv080_pm1`, `bmv080_pm25`, or `bmv080_pm10`. |
| `bmv080_get_status` | Value Number | `VAR(field_variable)`, `DATA(field_dropdown)` | `bmv080_get_status($bmv080, OBSTRUCTED)` | Calls configuration/status getter. |
| `bmv080_command` | Statement | `VAR(field_variable)`, `COMMAND(field_dropdown)` | `bmv080_command($bmv080, STOP)` | Calls `stopBmv080()`, `resetBmv080()`, or `closeBmv080()`. |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| `ADDRESS` | `0x57`, `0x56`, `0x55`, `0x54` | I2C address selected by CSB/MISO straps. |
| `MODE` | `CONTINUOUS_MODE`, `DUTY_CYCLE_MODE` | Measurement mode. |
| `ALGORITHM` | `FAST_RESPONSE`, `BALANCED`, `HIGH_PRECISION` | Measurement algorithm. |
| `FEATURE` | `OBSTRUCTION`, `VIBRATION` | Feature to configure. |
| `STATE` | `true`, `false` | Enable or disable selected feature. |
| `DATA` | `PM1`, `PM25`, `PM10`; status values | PM cached value or status/config getter. |
| `COMMAND` | `STOP`, `RESET`, `CLOSE` | Sensor command. |

## ABS Examples

```text
bmv080_init_i2c("bmv080", Wire, "0x57")
bmv080_set_feature($bmv080, OBSTRUCTION, true)
bmv080_set_feature($bmv080, VIBRATION, true)
bmv080_set_algorithm($bmv080, BALANCED)
bmv080_set_mode($bmv080, CONTINUOUS_MODE)
bmv080_read_data($bmv080)
bmv080_pm_value($bmv080, PM25)
```

## Notes

1. Initialization creates a typed Blockly variable. Use `$bmv080`/`variables_get($bmv080)` in later blocks.
2. `begin()` and `openBmv080()` succeed when they return `0`; the init blocks handle this.
3. The upstream examples require `SET_LOOP_TASK_STACK_SIZE(60 * 1024)`, which the generator adds automatically.
4. Duty-cycle mode should configure period and integration time before `bmv080_set_mode(DUTY_CYCLE_MODE)`.
5. `bmv080_read_data` should be called regularly; it returns true only when new PM data is ready.

# SparkFun HIH4030 Humidity Sensor

Blockly wrapper for the SparkFun HIH4030 analog humidity sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-hih4030
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `hih4030_init` | Statement | VAR(field_input), PIN(field_number), VOLTAGE(dropdown) | `hih4030_init("hih4030", 0, "5.0")` | `HIH4030 hih4030(0, 5.0);` |
| `hih4030_get_rh` | Value | VAR(field_variable) | `hih4030_get_rh($hih4030)` | `hih4030.getSensorRH()` |
| `hih4030_get_true_rh` | Value | VAR(field_variable), TEMP(input_value) | `hih4030_get_true_rh($hih4030, math_number(0))` | `hih4030.getTrueRH(1)` |
| `hih4030_vout` | Value | VAR(field_variable) | `hih4030_vout($hih4030)` | `hih4030.vout()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| VOLTAGE | 5.0, 3.3 | hih4030_init |

## ABS Examples

### Basic Usage
```
arduino_setup()
    hih4030_init("hih4030", 0, "5.0")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, hih4030_get_rh($hih4030))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `hih4030_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

### ADC calibration

The two-argument constructor retains the original 10-bit conversion with the sensor supply as the ADC reference. If the ADC range, reference or wiring differs, call `setAdcCalibration(maxCode, referenceVolts, pinRatio)` after initialization. The equivalent Blockly block configures the sensor instance. `maxCode` is 1023 for 10 bits or 4095 for 12 bits. `pinRatio` is the ADC pin voltage divided by the breakout OUT voltage. The method leaves the board's ADC configuration untouched and returns false for invalid calibration values.

The HIH-4030 supply is 4.0–5.8 V. For a 5 V breakout and a simulated 3.3 V ADC, a 17 kΩ upper resistor and 33 kΩ lower resistor give a pin ratio of 0.66. With a 12-bit ADC use `sensor.setAdcCalibration(4095, 3.3f, 0.66f)`. Use the actual ADC reference, resolution and divider for the board.

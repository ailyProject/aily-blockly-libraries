# SparkFun BQ27441

LiPo fuel gauge blocks for the BQ27441 global `lipo` object.

## Library Info
- **Name**: @aily-project/lib-sparkfun-bq27441
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bq27441_begin` | Statement | CAPACITY(input_value) | `bq27441_begin(math_number(850))` | `bq27441_ready = lipo.begin(); lipo.setCapacity(850);` |
| `bq27441_is_ready` | Value | none | `bq27441_is_ready()` | `bq27441_ready` |
| `bq27441_set_capacity` | Statement | CAPACITY(input_value) | `bq27441_set_capacity(math_number(850))` | `lipo.setCapacity(850);` |
| `bq27441_voltage` | Value | none | `bq27441_voltage()` | `lipo.voltage()` |
| `bq27441_current` | Value | TYPE(dropdown) | `bq27441_current(AVG)` | `lipo.current(AVG)` |
| `bq27441_capacity` | Value | TYPE(dropdown) | `bq27441_capacity(REMAIN)` | `lipo.capacity(REMAIN)` |
| `bq27441_power` | Value | none | `bq27441_power()` | `lipo.power()` |
| `bq27441_soc` | Value | TYPE(dropdown) | `bq27441_soc(FILTERED)` | `lipo.soc(FILTERED)` |
| `bq27441_soh` | Value | TYPE(dropdown) | `bq27441_soh(PERCENT)` | `lipo.soh(PERCENT)` |
| `bq27441_temperature` | Value | TYPE(dropdown) | `bq27441_temperature(BATTERY)` | `lipo.temperature(BATTERY)` |
| `bq27441_flags` | Value | none | `bq27441_flags()` | `lipo.flags()` |
| `bq27441_status` | Value | none | `bq27441_status()` | `lipo.status()` |
| `bq27441_set_gpout_function` | Statement | FUNCTION(dropdown) | `bq27441_set_gpout_function(SOC_INT)` | `lipo.setGPOUTFunction(SOC_INT);` |
| `bq27441_set_gpout_polarity` | Statement | ACTIVE_HIGH(dropdown) | `bq27441_set_gpout_polarity(TRUE)` | `lipo.setGPOUTPolarity(true);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | AVG, STBY, MAX, REMAIN, FULL, AVAIL, AVAIL_FULL, DESIGN, FILTERED, UNFILTERED, PERCENT, SOH_STAT, BATTERY, INTERNAL_TEMP | Measurement selector |
| FUNCTION | SOC_INT, BAT_LOW | GPOUT mode |
| ACTIVE_HIGH | TRUE, FALSE | GPOUT polarity |

## ABS Examples

```text
arduino_setup()
    bq27441_begin(math_number(850))

arduino_loop()
    serial_println(Serial, bq27441_soc(FILTERED))
```

## Notes

The upstream library provides global object `lipo`; no Blockly variable is created.
# SparkFun BQ27441 LiPo Fuel Gauge

Blockly wrapper for the SparkFun BQ27441 LiPo fuel gauge.

## Library Info
- **Name**: @aily-project/lib-sparkfun-bq27441
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bq27441_begin` | Statement | CAPACITY(input_value) | `bq27441_begin(math_number(0))` | bq27441_ready = lipo.begin();\nif (bq27441_ready) {\n lipo.setCapacity( |
| `bq27441_is_ready` | Value | (none) | `bq27441_is_ready()` | bq27441_ready |
| `bq27441_set_capacity` | Statement | CAPACITY(input_value) | `bq27441_set_capacity(math_number(0))` | lipo.setCapacity( |
| `bq27441_voltage` | Value | (none) | `bq27441_voltage()` | lipo.voltage() |
| `bq27441_current` | Value | TYPE(dropdown) | `bq27441_current(AVG)` | lipo.current( |
| `bq27441_capacity` | Value | TYPE(dropdown) | `bq27441_capacity(REMAIN)` | lipo.capacity( |
| `bq27441_power` | Value | (none) | `bq27441_power()` | lipo.power() |
| `bq27441_soc` | Value | TYPE(dropdown) | `bq27441_soc(FILTERED)` | lipo.soc( |
| `bq27441_soh` | Value | TYPE(dropdown) | `bq27441_soh(PERCENT)` | lipo.soh( |
| `bq27441_temperature` | Value | TYPE(dropdown) | `bq27441_temperature(BATTERY)` | lipo.temperature( |
| `bq27441_flags` | Value | (none) | `bq27441_flags()` | lipo.flags() |
| `bq27441_status` | Value | (none) | `bq27441_status()` | lipo.status() |
| `bq27441_set_gpout_function` | Statement | FUNCTION(dropdown) | `bq27441_set_gpout_function(SOC_INT)` | lipo.setGPOUTFunction( |
| `bq27441_set_gpout_polarity` | Statement | ACTIVE_HIGH(dropdown) | `bq27441_set_gpout_polarity(TRUE)` | lipo.setGPOUTPolarity( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | AVG, STBY, MAX | bq27441_current |
| TYPE | REMAIN, FULL, AVAIL, AVAIL_FULL, DESIGN | bq27441_capacity |
| TYPE | FILTERED, UNFILTERED | bq27441_soc |
| TYPE | PERCENT, SOH_STAT | bq27441_soh |
| TYPE | BATTERY, INTERNAL_TEMP | bq27441_temperature |
| FUNCTION | SOC_INT, BAT_LOW | bq27441_set_gpout_function |
| ACTIVE_HIGH | TRUE, FALSE | bq27441_set_gpout_polarity |

## ABS Examples

### Basic Usage
```
arduino_setup()
    bq27441_begin(math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, bq27441_is_ready())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

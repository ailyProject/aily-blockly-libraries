# SparkFun BQ27441 LiPo Fuel Gauge

Blockly wrapper for the SparkFun BQ27441 LiPo fuel gauge.

## Library Info
- **Name**: @aily-project/lib-sparkfun-bq27441
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bq27441_begin` | Statement | CAPACITY(input_value) | `bq27441_begin(math_number(0))` | `bq27441_ready = lipo.begin() && lipo.setCapacity(1);` |
| `bq27441_is_ready` | Value | (none) | `bq27441_is_ready()` | `bq27441_ready` |
| `bq27441_last_operation_ok` | Value | (none) | `bq27441_last_operation_ok()` | `lipo.lastOperationSucceeded()` |
| `bq27441_set_capacity` | Statement | CAPACITY(input_value) | `bq27441_set_capacity(math_number(0))` | `lipo.setCapacity(1);` |
| `bq27441_voltage` | Value | (none) | `bq27441_voltage()` | `lipo.voltage()` |
| `bq27441_current` | Value | TYPE(dropdown) | `bq27441_current(AVG)` | `lipo.current(AVG)` |
| `bq27441_capacity` | Value | TYPE(dropdown) | `bq27441_capacity(REMAIN)` | `lipo.capacity(REMAIN)` |
| `bq27441_power` | Value | (none) | `bq27441_power()` | `lipo.power()` |
| `bq27441_soc` | Value | TYPE(dropdown) | `bq27441_soc(FILTERED)` | `lipo.soc(FILTERED)` |
| `bq27441_soh` | Value | TYPE(dropdown) | `bq27441_soh(PERCENT)` | `lipo.soh(PERCENT)` |
| `bq27441_temperature` | Value | TYPE(dropdown) | `bq27441_temperature(BATTERY)` | `lipo.temperature(BATTERY)` |
| `bq27441_flags` | Value | (none) | `bq27441_flags()` | `lipo.flags()` |
| `bq27441_status` | Value | (none) | `bq27441_status()` | `lipo.status()` |
| `bq27441_set_gpout_function` | Statement | FUNCTION(dropdown) | `bq27441_set_gpout_function(SOC_INT)` | `lipo.setGPOUTFunction(SOC_INT);` |
| `bq27441_set_gpout_polarity` | Statement | ACTIVE_HIGH(dropdown) | `bq27441_set_gpout_polarity(TRUE)` | `lipo.setGPOUTPolarity(true);` |

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

Integer reads return zero on a transport error. Check the last operation immediately after reading to distinguish an error from valid zero. The ready block reflects the last initialization, including design-capacity verification. Temperature is in 0.1 K.

# OJoy Fuel Gauge

TI BQ27220 single-cell Li-Ion fuel gauge, supports voltage, current, temperature, capacity and health monitoring

## Library Info
- **Name**: @aily-project/lib-ojoy_bq27220
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bq27220_init` | Statement | VAR(field_input), ADDRESS(dropdown) | `bq27220_init("gauge", "0x55")` | `gauge.begin(&Wire, 0x55, 400000);` |
| `bq27220_basic_read` | Value | VAR(field_variable), TYPE(dropdown) | `bq27220_basic_read($gauge, voltage)` | `gauge.getVoltage()` |
| `bq27220_time_read` | Value | VAR(field_variable), TYPE(dropdown) | `bq27220_time_read($gauge, tte)` | `gauge.getTimeToEmpty()` |
| `bq27220_capacity_read` | Value | VAR(field_variable), TYPE(dropdown) | `bq27220_capacity_read($gauge, remaining_capacity)` | `gauge.getRemainingCapacity()` |
| `bq27220_set_design_capacity` | Statement | VAR(field_variable), CAPACITY(input_value) | `bq27220_set_design_capacity($gauge, math_number(0))` | `gauge.setDesignCapacity((uint16_t)(1));` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x55 | bq27220_init |
| TYPE | voltage, current, avg_current, temperature, soc | bq27220_basic_read |
| TYPE | tte, ttf | bq27220_time_read |
| TYPE | remaining_capacity, full_charge_capacity, cycle_count, soh | bq27220_capacity_read |

## ABS Examples

### Basic Usage
```
arduino_setup()
    bq27220_init("gauge", "0x55")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, bq27220_basic_read($gauge, voltage))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `bq27220_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# BQ27220 Fuel Gauge

TI BQ27220 single-cell Li-Ion battery fuel gauge, reads battery voltage, current, temperature, and remaining capacity via I2C

## Library Info
- **Name**: @aily-project/lib-bq27220
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bq27220_init` | Statement | VAR(field_input), WIRE(dropdown), ADDRESS(dropdown) | `bq27220_init("gauge", WIRE, "0x55")` | Dynamic code |
| `bq27220_basic_read` | Value | VAR(field_variable), TYPE(dropdown) | `bq27220_basic_read(variables_get($gauge), voltage)` | Dynamic code |
| `bq27220_time_read` | Value | VAR(field_variable), TYPE(dropdown) | `bq27220_time_read(variables_get($gauge), tte)` | Dynamic code |
| `bq27220_capacity_read` | Value | VAR(field_variable), TYPE(dropdown) | `bq27220_capacity_read(variables_get($gauge), remaining_capacity)` | Dynamic code |
| `bq27220_set_design_capacity` | Statement | VAR(field_variable), CAPACITY(input_value) | `bq27220_set_design_capacity(variables_get($gauge), math_number(3000))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x55 | BQ27220 I2C address (default) |
| TYPE (basic_read) | voltage, current, avg_current, temperature, soc | Basic read types |
| TYPE (time_read) | tte, ttf | Time estimation types |
| TYPE (capacity_read) | remaining_capacity, full_charge_capacity, cycle_count, soh | Capacity info types |

## ABS Examples

### Basic Usage
```
arduino_setup()
    bq27220_init("gauge", WIRE, "0x55")
    serial_begin(Serial, 115200)

arduino_loop()
    serial_print(Serial, text("SOC: "))
    serial_println(Serial, bq27220_basic_read(variables_get($gauge), soc))
    serial_print(Serial, text("Voltage: "))
    serial_println(Serial, bq27220_basic_read(variables_get($gauge), voltage))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `bq27220_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Current sign**: positive = charging, negative = discharging
5. **Temperature**: returns Celsius (°C)

# BQ27220 Fuel Gauge

TI BQ27220 single-cell Li-Ion battery fuel gauge, reads battery voltage, current, temperature, and remaining capacity via I2C

## Library Info
- **Name**: @aily-project/lib-linkbit_bq27220
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bq27220_init` | Statement | VAR(field_input), ADDRESS(dropdown) | `bq27220_init("gauge", "0x55")` | `gauge.begin(&Wire, 0x55, 400000);` |
| `bq27220_basic_read` | Value | VAR(field_variable), TYPE(dropdown) | `bq27220_basic_read($gauge, voltage)` | `gauge.getVoltage()` |
| `bq27220_time_read` | Value | VAR(field_variable), TYPE(dropdown) | `bq27220_time_read($gauge, tte)` | `gauge.getTimeToEmpty()` |
| `bq27220_capacity_read` | Value | VAR(field_variable), TYPE(dropdown) | `bq27220_capacity_read($gauge, remaining_capacity)` | `gauge.getRemainingCapacity()` |
| `bq27220_set_design_capacity` | Statement | VAR(field_variable), CAPACITY(input_value) | `bq27220_set_design_capacity($gauge, math_number(3000))` | `gauge.setDesignCapacity((uint16_t)(1));` |
| `bq27220_i2c_select` | Statement | TARGET(dropdown) | `bq27220_i2c_select("1")` | `linkbitI2CSel(1);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x55 | BQ27220 I2C address (default) |
| TYPE (basic_read) | voltage, current, avg_current, temperature, soc | Basic read types |
| TYPE (time_read) | tte, ttf | Time estimation types |
| TYPE (capacity_read) | remaining_capacity, full_charge_capacity, cycle_count, soh | Capacity info types |
| TARGET (i2c_select) | 1, 0 | 1 = on-board BQ27220 (I2C mode), 0 = CN2 4-pin header (plain IO mode) |

## ABS Examples

### Basic Usage
```
arduino_setup()
    bq27220_init("gauge", "0x55")
    serial_begin(Serial, 115200)

arduino_loop()
    serial_print(Serial, text("SOC: "))
    serial_println(Serial, bq27220_basic_read($gauge, soc))
    serial_print(Serial, text("Voltage: "))
    serial_println(Serial, bq27220_basic_read($gauge, voltage))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `bq27220_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Current sign**: positive = charging, negative = discharging
5. **Temperature**: returns Celsius (°C)

## LinkBit V2 onboard gauge

GPIO9 selects the gauge at I²C address `0x55` when high and the CN2 connector when low. Both board variants use GPIO20 for SDA and GPIO21 for SCL. The factory board template uses USB CDC for `Serial`.

`bool setDesignCapacity(uint16_t mAh)` updates Profile 1 in volatile gauge RAM. Check its return value and use `getDesignCapacity()` to read the active setting. A disconnected gauge or an unsuccessful update returns `false`. The Wire path supports factory-sealed devices and restores their sealed state after the operation. The native IDF path requires the owner to unseal a sealed device before updating its capacity.

# BQ27220 Fuel Gauge

TI BQ27220 single-cell Li-Ion battery fuel gauge, reads battery voltage, current, temperature, and remaining capacity via I2C

## Library Info
- **Name**: @aily-project/lib-bq27220
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bq27220_init` | Statement | VAR(field_input), WIRE(dropdown), ADDRESS(dropdown) | `bq27220_init("gauge", WIRE, "0x55")` | `gauge.begin(&WIRE, 0x55, 400000);` |
| `bq27220_basic_read` | Value | VAR(field_variable), TYPE(dropdown) | `bq27220_basic_read($gauge, voltage)` | `gauge.getVoltage()` |
| `bq27220_time_read` | Value | VAR(field_variable), TYPE(dropdown) | `bq27220_time_read($gauge, tte)` | `gauge.getTimeToEmpty()` |
| `bq27220_capacity_read` | Value | VAR(field_variable), TYPE(dropdown) | `bq27220_capacity_read($gauge, remaining_capacity)` | `gauge.getRemainingCapacity()` |
| `bq27220_set_design_capacity` | Statement | VAR(field_variable), CAPACITY(input_value) | `bq27220_set_design_capacity($gauge, math_number(3000))` | `gauge.setDesignCapacity((uint16_t)(1));` |
| `bq27220_voltage_percent` | Value | VAR(field_variable) | `bq27220_voltage_percent($gauge)` | `bq27220_voltage_percent(gauge, gauge_estimate)` |
| `bq27220_battery_state` | Value | VAR(field_variable), STATE(dropdown) | `bq27220_battery_state($gauge, LOW)` | `bq27220_battery_low(gauge, gauge_estimate)` |
| `bq27220_deep_sleep` | Statement | (none) | `bq27220_deep_sleep()` | `Serial.flush(); ↵ esp_deep_sleep_start();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x55 | BQ27220 I2C address (default) |
| TYPE (basic_read) | voltage, current, avg_current, temperature, soc | Basic read types |
| TYPE (time_read) | tte, ttf | Time estimation types |
| TYPE (capacity_read) | remaining_capacity, full_charge_capacity, cycle_count, soh | Capacity info types |
| STATE | LOW, SHUTDOWN | bq27220_battery_state: charge ≤10% / below 3.3 V for about 3 s |

## ABS Examples

### Basic Usage
```
arduino_setup()
    bq27220_init("gauge", WIRE, "0x55")
    serial_begin(Serial, 115200)

arduino_loop()
    serial_print(Serial, text("SOC: "))
    serial_println(Serial, bq27220_basic_read($gauge, soc))
    serial_print(Serial, text("Voltage: "))
    serial_println(Serial, bq27220_basic_read($gauge, voltage))
    time_delay(math_number(1000))
```

### IBox S31: voltage-based charge and low-voltage shutdown
```
arduino_setup()
    serial_begin(Serial, 115200)
    bq27220_init("gauge", Wire, "0x55")

arduino_loop()
    serial_println(Serial, bq27220_voltage_percent($gauge))
    controls_if()
        @IF0: bq27220_battery_state($gauge, LOW)
        @DO0:
            serial_println(Serial, text("battery low"))
    controls_if()
        @IF0: bq27220_battery_state($gauge, SHUTDOWN)
        @DO0:
            serial_println(Serial, text("battery empty, shutting down"))
            bq27220_deep_sleep()
    time_delay(math_number(100))
```

## Notes

1. **Variable**: `bq27220_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Current sign**: positive = charging, negative = discharging
5. **Temperature**: returns Celsius (°C)
6. **I2C pins**: `bq27220_init` starts the chosen bus first. On ESP32 boards the pins come from the aily I2C library, the board’s `batteryConfig` (when its gauge is a BQ27220) or `i2cPins`; IBox S31: SDA=IO0, SCL=IO1. Other boards keep `begin()` with default pins.
7. **Voltage-based charge**: an uncalibrated gauge reports a wrong SOC (IBox S31). `bq27220_voltage_percent` and `bq27220_battery_state` instead sample the voltage every 100 ms at the start of `loop()`, smooth it (about 1 s), map it on a single-cell Li-ion curve (3.3 V = 0%, 3.8 V ≈ 50%, 4.2 V = 100%) with 2% hysteresis; LOW is ≤10%, SHUTDOWN is the smoothed voltage below 3.3 V for about 3 s. Long `delay()` in the loop slows the sampling.
8. **Deep sleep**: `bq27220_deep_sleep` flushes Serial and calls `esp_deep_sleep_start()` (ESP32 only); power or reset restarts the program. Turn off amplifiers and lights first.

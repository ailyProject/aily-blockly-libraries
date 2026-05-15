# INA219 power meter

INA219 sensor driver library, suitable for esp32 and arduino, supports I2C communication, provides current, bus voltage, branch voltage, and power data acquisition functions, low drift and high accuracy, and is compat...

## Library Info
- **Name**: @aily-project/lib-adafruit-ina219
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ina219_init_with_wire` | Statement | VAR(field_input), ADDRESS(field_input), WIRE(dropdown) | `ina219_init_with_wire("ina219", "0x40", WIRE)` | Dynamic code |
| `ina219_read_value` | Value | VAR(field_variable), TYPE(dropdown) | `ina219_read_value(variables_get($ina219), BUS_VOLTAGE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | BUS_VOLTAGE, SHUNT_VOLTAGE, CURRENT, POWER | ina219_read_value |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ina219_init_with_wire("ina219", "0x40", WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ina219_read_value(variables_get($ina219), BUS_VOLTAGE))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `ina219_init_with_wire("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Dynamic fields**: `ina219_init_with_wire` may add fields at runtime through Blockly extensions.

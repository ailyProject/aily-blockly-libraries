# DPS3xx air pressure temperature sensor

Used for Infineon DPS3xx high-precision air pressure and temperature sensor, achieving high-precision measurement of air pressure (300-1200hPa) and temperature (-40~85°C) through I2C interface, suitable for Arduino, E...

## Library Info
- **Name**: @aily-project/lib-dps3xx
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dps3xx_init` | Statement | ADDR(dropdown), WIRE(dropdown) | `dps3xx_init("0x77", WIRE)` | Dynamic code |
| `dps3xx_read_temperature` | Value | OSR(dropdown) | `dps3xx_read_temperature("0")` | dps3xx_readTemperature( |
| `dps3xx_read_pressure` | Value | OSR(dropdown) | `dps3xx_read_pressure("0")` | dps3xx_readPressure( |
| `dps3xx_correct_temp` | Statement | (none) | `dps3xx_correct_temp()` | dps3xxSensor.correctTemp();\n |
| `dps3xx_get_product_id` | Value | (none) | `dps3xx_get_product_id()` | dps3xxSensor.getProductId() |
| `dps3xx_get_revision_id` | Value | (none) | `dps3xx_get_revision_id()` | dps3xxSensor.getRevisionId() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDR | 0x77, 0x76 | dps3xx_init |
| OSR | 0, 1, 2, 3, 4, 5, 6, 7 | dps3xx_read_temperature, dps3xx_read_pressure |

## ABS Examples

### Basic Usage
```
arduino_setup()
    dps3xx_init("0x77", WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, dps3xx_read_temperature("0"))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

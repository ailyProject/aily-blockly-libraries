# VL53L0X laser ranging sensor

The VL53L0X laser ranging sensor driver library uses I2C communication, supports millimeter-level distance detection, has fast measurement speed, strong resistance to ambient light interference, is small in size, and...

## Library Info
- **Name**: @aily-project/lib-adafruit-vl53l0x
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `vl53l0x_config_i2c` | Statement | WIRE_OPTION(dropdown) | `vl53l0x_config_i2c(WIRE1)` | See generator |
| `vl53l0x_init_with_wire` | Statement | SENSOR(field_variable), WIRE(dropdown) | `vl53l0x_init_with_wire(variables_get($sensor), WIRE)` | Dynamic code |
| `vl53l0x_begin` | Statement | SENSOR(field_variable) | `vl53l0x_begin(variables_get($sensor))` | See generator |
| `vl53l0x_ranging_test` | Statement | SENSOR(field_variable), MEASURE(field_variable) | `vl53l0x_ranging_test(variables_get($sensor), variables_get($measure))` | // 获取距离数据（单位：毫米）\n |
| `vl53l0x_check_range_valid` | Value | MEASURE(field_variable) | `vl53l0x_check_range_valid(variables_get($measure))` | Dynamic code |
| `vl53l0x_get_range_mm` | Value | MEASURE(field_variable) | `vl53l0x_get_range_mm(variables_get($measure))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WIRE_OPTION | WIRE1, WIRE2 | vl53l0x_config_i2c |

## ABS Examples

### Basic Usage
```
arduino_setup()
    vl53l0x_config_i2c(WIRE1)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, vl53l0x_check_range_valid(variables_get($measure)))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Dynamic fields**: `vl53l0x_init_with_wire`, `vl53l0x_begin` may add fields at runtime through Blockly extensions.

# INA219功率计

INA219传感器驱动库，适用于esp32、arduino，支持I2C通信，提供电流、总线电压、分线电压、功率数据获取功能，低漂移高精度，兼容多种主流开发板。

## Library Info
- **Name**: @aily-project/lib-adafruit_ina219
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ina219_init_with_wire` | Statement | VAR(field_input), ADDRESS(field_input), WIRE(dropdown) | `ina219_init_with_wire("ina219", "0x40", WIRE)` | (dynamic code) |
| `ina219_read_value` | Value | VAR(field_variable), TYPE(dropdown) | `ina219_read_value(variables_get($ina219), BUS_VOLTAGE)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | BUS_VOLTAGE, SHUNT_VOLTAGE, CURRENT, POWER | 总线电压 (V) / 分流电压 (mV) / 电流 (mA) / 功率 (mW) |

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

1. **Variable Creation**: `ina219_init_with_wire("varName", ...)` creates variable `$varName`; reference with `variables_get($varName)`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

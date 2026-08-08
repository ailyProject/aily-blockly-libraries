# INA226 Power Monitor

INA226高精度电流、电压、功率监测芯片驱动库，支持I2C通信。

## Library Info
- **Name**: @aily-project/lib-ina226
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ina226_init` | Statement | VAR(field_input), ADDRESS(dropdown), WIRE(dropdown), MAX_AMPS(input_value), SHUNT_RES(input_value) | `ina226_init("ina226", "0x40", Wire, math_number(1), math_number(100000))` | `INA226 ina226(0x40);` + `ina226.begin(1, 100000);` |
| `ina226_read_value` | Value | VAR(field_variable), TYPE(dropdown) | `ina226_read_value(variables_get($ina226), BUS_VOLTAGE)` | `ina226.getBusVoltage()` |
| `ina226_set_averaging` | Statement | VAR(field_variable), AVG(dropdown) | `ina226_set_averaging(variables_get($ina226), "1")` | `ina226.setAveraging(1);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47 | I2C 地址 |
| TYPE | BUS_VOLTAGE, SHUNT_VOLTAGE, CURRENT, POWER | 读取数据类型 |
| AVG | 1, 4, 16, 64, 128, 256, 512, 1024 | 硬件平均采样次数 |
| WIRE | (board.i2c) | I2C 总线选择，由开发板配置动态填充 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ina226_init("ina226", "0x40", Wire, math_number(1), math_number(100000))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ina226_read_value(variables_get($ina226), BUS_VOLTAGE))
    time_delay(math_number(1000))
```

### Read All Values
```
arduino_setup()
    ina226_init("ina226", "0x40", Wire, math_number(1), math_number(100000))
    serial_begin(Serial, 115200)
    ina226_set_averaging(variables_get($ina226), "16")

arduino_loop()
    serial_println(Serial, ina226_read_value(variables_get($ina226), BUS_VOLTAGE))
    serial_println(Serial, ina226_read_value(variables_get($ina226), CURRENT))
    serial_println(Serial, ina226_read_value(variables_get($ina226), POWER))
    time_delay(math_number(500))
```

## Notes

1. **Variable**: `ina226_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Shunt resistor unit**: SHUNT_RES parameter is in **micro-ohms** (e.g. 100000 = 0.1Ω = 100mΩ).
3. **Max current unit**: MAX_AMPS parameter is in **amps** (e.g. 1 = 1A).
4. **Parameter order**: ABS parameters follow `block.json` args0 order.
5. **Input values**: use `math_number(n)` for numeric input_value slots.

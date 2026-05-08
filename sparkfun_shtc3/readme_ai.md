# SparkFun SHTC3 温湿度传感器

Sensirion SHTC3 I2C 温湿度传感器 Blockly 库。

## Library Info
- **Name**: @aily-project/lib-sparkfun-shtc3
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `shtc3_init` | Statement | VAR(field_input) | `shtc3_init("shtc3")` | `SHTC3 shtc3; shtc3.begin();` |
| `shtc3_update` | Statement | VAR(field_variable) | `shtc3_update(variables_get($shtc3))` | `shtc3.update();` |
| `shtc3_temp_c` | Value→Number | VAR(field_variable) | `shtc3_temp_c(variables_get($shtc3))` | `shtc3.toDegC()` |
| `shtc3_temp_f` | Value→Number | VAR(field_variable) | `shtc3_temp_f(variables_get($shtc3))` | `shtc3.toDegF()` |
| `shtc3_humidity` | Value→Number | VAR(field_variable) | `shtc3_humidity(variables_get($shtc3))` | `shtc3.toPercent()` |

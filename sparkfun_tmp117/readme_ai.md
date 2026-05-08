# SparkFun TMP117 高精度温度传感器

高精度 I2C 数字温度传感器 Blockly 库。

## Library Info
- **Name**: @aily-project/lib-sparkfun-tmp117
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tmp117_init` | Statement | VAR(field_input), ADDR(dropdown) | `tmp117_init("tmp117", 0x48)` | `TMP117 tmp117; tmp117.begin(0x48);` |
| `tmp117_read_temp_c` | Value→Number | VAR(field_variable) | `tmp117_read_temp_c(variables_get($tmp117))` | `tmp117.readTempC()` |
| `tmp117_read_temp_f` | Value→Number | VAR(field_variable) | `tmp117_read_temp_f(variables_get($tmp117))` | `tmp117.readTempF()` |
| `tmp117_data_ready` | Value→Boolean | VAR(field_variable) | `tmp117_data_ready(variables_get($tmp117))` | `tmp117.dataReady()` |
| `tmp117_set_conversion_mode` | Statement | VAR(field_variable), MODE(dropdown) | `tmp117_set_conversion_mode(variables_get($tmp117), CONTINUOUS)` | `tmp117.setContinuousConversionMode();` |
| `tmp117_set_high_limit` | Statement | VAR(field_variable), TEMP(input_value) | `tmp117_set_high_limit(variables_get($tmp117), math_number(75))` | `tmp117.setHighLimit(75);` |
| `tmp117_set_low_limit` | Statement | VAR(field_variable), TEMP(input_value) | `tmp117_set_low_limit(variables_get($tmp117), math_number(0))` | `tmp117.setLowLimit(0);` |

## Parameter Options

### MODE
| Value | Description |
|-------|-------------|
| `CONTINUOUS` | 连续转换模式 |
| `ONESHOT` | 单次转换模式 |
| `SHUTDOWN` | 关机模式 |

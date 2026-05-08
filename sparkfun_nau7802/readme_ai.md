# SparkFun NAU7802 Qwiic 称重传感器

SparkFun Qwiic Scale NAU7802 的 Blockly 封装库。

## Library Info
- **Name**: @aily-project/lib-sparkfun-nau7802
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `nau7802_init` | Statement | VAR(field_input) | `nau7802_init("scale")` | `NAU7802 scale; scale.begin();` |
| `nau7802_is_available` | Value(Boolean) | VAR(field_variable) | `nau7802_is_available(variables_get($scale))` | `scale.available()` |
| `nau7802_get_reading` | Value(Number) | VAR(field_variable) | `nau7802_get_reading(variables_get($scale))` | `scale.getReading()` |
| `nau7802_get_average` | Value(Number) | VAR(field_variable), SAMPLES(input_value) | `nau7802_get_average(variables_get($scale), math_number(8))` | `scale.getAverage(8)` |
| `nau7802_get_weight` | Value(Number) | VAR(field_variable) | `nau7802_get_weight(variables_get($scale))` | `scale.getWeight()` |
| `nau7802_tare` | Statement | VAR(field_variable) | `nau7802_tare(variables_get($scale))` | `scale.calculateZeroOffset();` |
| `nau7802_calibrate` | Statement | VAR(field_variable), WEIGHT(input_value) | `nau7802_calibrate(variables_get($scale), math_number(100))` | `scale.calculateCalibrationFactor(100.0);` |
| `nau7802_set_cal_factor` | Statement | VAR(field_variable), FACTOR(input_value) | `nau7802_set_cal_factor(variables_get($scale), math_number(432.5))` | `scale.setCalibrationFactor(432.5);` |
| `nau7802_get_cal_factor` | Value(Number) | VAR(field_variable) | `nau7802_get_cal_factor(variables_get($scale))` | `scale.getCalibrationFactor()` |

## Notes

1. 完整流程：init → tare（空载） → calibrate（放已知重量） → getWeight（循环读取）
2. 校准系数可通过 `get_cal_factor` 读出并保存到 EEPROM，下次用 `set_cal_factor` 恢复

## ABS Examples

```
arduino_setup()
    nau7802_init("scale")
    nau7802_tare(variables_get($scale))
    // 放上 100g 砝码后执行：
    nau7802_calibrate(variables_get($scale), math_number(100))

arduino_loop()
    if nau7802_is_available(variables_get($scale))
        serial_println(Serial, nau7802_get_weight(variables_get($scale)))
```

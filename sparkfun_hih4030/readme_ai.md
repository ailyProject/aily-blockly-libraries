# SparkFun HIH4030 湿度传感器

模拟接口湿度传感器库，通过 `HIH4030` 对象读取相对湿度。

## Library Info
- **Name**: @aily-project/lib-sparkfun-hih4030
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `hih4030_init` | Statement | VAR(field_input), PIN(field_number), VOLTAGE(field_dropdown) | `hih4030_init("hih4030", 0, 5.0)` | `HIH4030 hih4030(0, 5.0);` |
| `hih4030_get_rh` | Value | VAR(field_variable) | `hih4030_get_rh(variables_get($hih4030))` | `hih4030.getSensorRH()` |
| `hih4030_get_true_rh` | Value | VAR(field_variable), TEMP(input_value) | `hih4030_get_true_rh(variables_get($hih4030), math_number(25))` | `hih4030.getTrueRH(25)` |
| `hih4030_vout` | Value | VAR(field_variable) | `hih4030_vout(variables_get($hih4030))` | `hih4030.vout()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| VOLTAGE | 5.0, 3.3 | 传感器供电电压 |

## Notes

1. **初始化**: `hih4030_init` 在全局变量区声明对象，不生成 setup 代码
2. **温度补偿**: 使用 `hih4030_get_true_rh` 配合温度传感器获得更精确的湿度值

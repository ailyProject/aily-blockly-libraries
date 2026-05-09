# SparkFun MS5803 气压传感器

SparkFun MS5803-14BA I2C 气压与温度传感器 Blockly 库。

## Library Info
- **Name**: @aily-project/lib-sparkfun-ms5803
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ms5803_init` | Statement | VAR(field_input), ADDRESS(field_dropdown) | `ms5803_init("ms5803", ADDRESS_HIGH)` | `MS5803 ms5803(ADDRESS_HIGH); Wire.begin(); ms5803.reset(); ms5803.begin();` |
| `ms5803_get_temperature` | Value | VAR(field_variable), UNIT(field_dropdown), PREC(field_dropdown) | `ms5803_get_temperature(variables_get($ms5803), CELSIUS, ADC_512)` | `ms5803.getTemperature(CELSIUS, ADC_512)` |
| `ms5803_get_pressure` | Value | VAR(field_variable), PREC(field_dropdown) | `ms5803_get_pressure(variables_get($ms5803), ADC_512)` | `ms5803.getPressure(ADC_512)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | ADDRESS_HIGH, ADDRESS_LOW | I2C 地址 0x76 (HIGH) 或 0x77 (LOW) |
| UNIT | CELSIUS, FAHRENHEIT | 温度单位 |
| PREC | ADC_256, ADC_512, ADC_1024, ADC_2048, ADC_4096 | ADC 转换精度（越高越慢越准） |

## Usage Example

```
ms5803_init("ms5803", ADDRESS_HIGH)
variables_set($temp, ms5803_get_temperature(variables_get($ms5803), CELSIUS, ADC_512))
variables_set($pres, ms5803_get_pressure(variables_get($ms5803), ADC_512))
```

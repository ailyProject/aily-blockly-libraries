# SparkFun VEML7700 环境光传感器

## Library Info
- **Name**: @aily-project/lib-sparkfun-veml7700
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `veml7700_init` | Statement | VAR(field_input) | `veml7700_init("als")` | `SparkFunVEML7700 als; als.begin();` |
| `veml7700_get_lux` | Value→Number | VAR(field_variable) | `veml7700_get_lux(variables_get($als))` | `als.getLux()` |
| `veml7700_get_ambient` | Value→Number | VAR(field_variable) | `veml7700_get_ambient(variables_get($als))` | `als.getAmbientLight()` |
| `veml7700_get_white` | Value→Number | VAR(field_variable) | `veml7700_get_white(variables_get($als))` | `als.getWhiteLevel()` |
| `veml7700_power` | Statement | VAR(field_variable), STATE(dropdown) | `veml7700_power(variables_get($als), ON)` | `als.powerOn();` |

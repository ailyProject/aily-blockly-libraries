# SparkFun VCNL4040 接近与环境光传感器

## Library Info
- **Name**: @aily-project/lib-sparkfun-vcnl4040
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `vcnl4040_init` | Statement | VAR(field_input) | `vcnl4040_init("prox")` | `VCNL4040 prox; prox.begin(); prox.powerOnProximity(); prox.powerOnAmbient();` |
| `vcnl4040_get_proximity` | Value→Number | VAR(field_variable) | `vcnl4040_get_proximity(variables_get($prox))` | `prox.getProximity()` |
| `vcnl4040_get_ambient` | Value→Number | VAR(field_variable) | `vcnl4040_get_ambient(variables_get($prox))` | `prox.getAmbient()` |
| `vcnl4040_get_white` | Value→Number | VAR(field_variable) | `vcnl4040_get_white(variables_get($prox))` | `prox.getWhite()` |
| `vcnl4040_power_proximity` | Statement | VAR(field_variable), STATE(dropdown) | `vcnl4040_power_proximity(variables_get($prox), ON)` | `prox.powerOnProximity();` |
| `vcnl4040_power_ambient` | Statement | VAR(field_variable), STATE(dropdown) | `vcnl4040_power_ambient(variables_get($prox), OFF)` | `prox.powerOffAmbient();` |

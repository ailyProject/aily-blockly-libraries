# SparkFun VEML6075 紫外线传感器

## Library Info
- **Name**: @aily-project/lib-sparkfun-veml6075
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `veml6075_init` | Statement | VAR(field_input) | `veml6075_init("uv")` | `VEML6075 uv; uv.begin();` |
| `veml6075_uva` | Value→Number | VAR(field_variable) | `veml6075_uva(variables_get($uv))` | `uv.uva()` |
| `veml6075_uvb` | Value→Number | VAR(field_variable) | `veml6075_uvb(variables_get($uv))` | `uv.uvb()` |
| `veml6075_index` | Value→Number | VAR(field_variable) | `veml6075_index(variables_get($uv))` | `uv.index()` |
| `veml6075_raw_uva` | Value→Number | VAR(field_variable) | `veml6075_raw_uva(variables_get($uv))` | `uv.rawUva()` |
| `veml6075_raw_uvb` | Value→Number | VAR(field_variable) | `veml6075_raw_uvb(variables_get($uv))` | `uv.rawUvb()` |

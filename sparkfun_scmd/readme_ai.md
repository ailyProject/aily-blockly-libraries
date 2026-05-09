# SparkFun SCMD 串行控制电机驱动

## Library Info
- **Name**: @aily-project/lib-sparkfun-scmd
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `scmd_init` | Statement | VAR(field_input) | `scmd_init("scmd")` | `SCMD scmd; scmd.settings.commInterface=I2C_MODE; scmd.begin();` |
| `scmd_enable` | Statement | VAR(field_variable) | `scmd_enable(variables_get($scmd))` | `scmd.enable();` |
| `scmd_set_drive` | Statement | VAR(field_variable), MOTOR(value), DIR(dropdown:0/1), LEVEL(value) | `scmd_set_drive(variables_get($scmd), 0, 0, 200)` | `scmd.setDrive(0, 0, 200);` |

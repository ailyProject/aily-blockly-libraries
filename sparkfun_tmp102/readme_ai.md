# SparkFun TMP102 温度传感器

I2C 数字温度传感器 Blockly 库。

## Library Info
- **Name**: @aily-project/lib-sparkfun-tmp102
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tmp102_init` | Statement | VAR(field_input), ADDR(dropdown) | `tmp102_init("tmp", 0x48)` | `TMP102 tmp; tmp.begin(0x48);` |
| `tmp102_read_temp_c` | Value→Number | VAR(field_variable) | `tmp102_read_temp_c(variables_get($tmp))` | `tmp.readTempC()` |
| `tmp102_read_temp_f` | Value→Number | VAR(field_variable) | `tmp102_read_temp_f(variables_get($tmp))` | `tmp.readTempF()` |
| `tmp102_sleep` | Statement | VAR(field_variable) | `tmp102_sleep(variables_get($tmp))` | `tmp.sleep();` |
| `tmp102_wakeup` | Statement | VAR(field_variable) | `tmp102_wakeup(variables_get($tmp))` | `tmp.wakeup();` |
| `tmp102_alert` | Value→Boolean | VAR(field_variable) | `tmp102_alert(variables_get($tmp))` | `tmp.alert()` |
| `tmp102_set_high_temp_c` | Statement | VAR(field_variable), TEMP(input_value) | `tmp102_set_high_temp_c(variables_get($tmp), math_number(75))` | `tmp.setHighTempC(75);` |
| `tmp102_set_low_temp_c` | Statement | VAR(field_variable), TEMP(input_value) | `tmp102_set_low_temp_c(variables_get($tmp), math_number(0))` | `tmp.setLowTempC(0);` |

## Parameter Options

### ADDR
| Value | Description |
|-------|-------------|
| `0x48` | GND（默认） |
| `0x49` | VCC |
| `0x4A` | SDA |
| `0x4B` | SCL |

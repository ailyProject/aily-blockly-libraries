# SparkFun VKey 模拟电压键盘

## Library Info
- **Name**: @aily-project/lib-sparkfun-vkey
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `vkey_init` | Statement | VAR(field_input), PIN(value) | `vkey_init("keypad", A0)` | `VKey keypad(A0);` |
| `vkey_read_key` | Value→Number | VAR(field_variable) | `vkey_read_key(variables_get($keypad))` | `keypad.getKey()` |

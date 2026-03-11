# 键盘矩阵库

4x4矩阵键盘控制库，支持ESP32开发板

## Library Info
- **Name**: @aily-project/lib-keypad
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `keypad_initialize` | Statement | ROW1(input_value), ROW2(input_value), ROW3(input_value), ROW4(input_value), COL1(input_value), COL2(input_value), COL3(input_value), COL4(input_value) | `keypad_initialize(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `keypad_initalize(keypad_pins);\n` |
| `keypad_getkey` | Value | (none) | `keypad_getkey()` | `keypad_getkey()` |
| `keypad_delete` | Statement | (none) | `keypad_delete()` | `keypad_delete();\n` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    keypad_initialize(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, keypad_getkey())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

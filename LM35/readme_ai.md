# LM35温度传感器库

LM35温度传感器库，通过模拟信号输出实现环境温度的精准测量，支持连续温度采集、低功耗运行、线性输出、无需校准，兼容多种开发板。

## Library Info
- **Name**: @aily-project/lib-lm35
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lm35_read` | Value | PIN(dropdown) | `lm35_read(PIN)` | `analogRead(...) * 0.488` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, lm35_read(PIN))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

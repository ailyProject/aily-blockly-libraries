# 粉尘传感器驱动库

读取GP2Y1010AU0F粉尘传感器的值，并计算和打印粉尘浓度

## Library Info
- **Name**: @aily-project/lib-gp2y1010au0f
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `gp2y1010au0f_init` | Statement | LED_PIN(dropdown), MEASURE_PIN(dropdown) | `gp2y1010au0f_init(LED_PIN, MEASURE_PIN)` | `` |
| `gp2y1010au0f_read` | Value | (none) | `gp2y1010au0f_read()` | `dustSensor.read()` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    gp2y1010au0f_init(LED_PIN, MEASURE_PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, gp2y1010au0f_read())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

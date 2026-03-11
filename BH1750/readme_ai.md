# BH1750光照传感器

BH1750数字光照强度传感器控制库，适用于Arduino、ESP32等开发板。使用I2C接口读取光照强度数值，将环境光转换为数字信号直接输出勒克斯值，支持连续测量模式和单次测量模式。

## Library Info
- **Name**: @aily-project/lib-bh1750
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bh1750_init_with_wire` | Statement | VAR(field_input), MODE(dropdown), ADDRESS(dropdown), WIRE(dropdown) | `bh1750_init_with_wire("lightMeter", CONTINUOUS_HIGH_RES_MODE, 0x23, WIRE)` | (dynamic code) |
| `bh1750_read_light_level` | Value | VAR(field_variable) | `bh1750_read_light_level(variables_get($lightMeter))` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | CONTINUOUS_HIGH_RES_MODE, CONTINUOUS_HIGH_RES_MODE_2, CONTINUOUS_LOW_RES_MODE, ONE_TIME_HIGH_RES_MODE, ONE_TIME_HIGH_RES_MODE_2, ONE_TIME_LOW_RES_MODE, UNCONFIGURED | 连续高分辨率模式 (1lux, 120ms) / 连续高分辨率模式2 (0.5lux, 120ms) / 连续低分辨率模式 (4lux, 16ms) / 单次高分辨率模式 (1lux, 120ms) / 单次高分辨率模式2 (0.5lux, 120ms) / 单次低分辨率模式 (4lux, 16ms) / 未配置模式 (UNCONFIGURED) |
| ADDRESS | 0x23, 0x5C | 0x23 (ADDR低电平) / 0x5C (ADDR高电平) |

## ABS Examples

### Basic Usage
```
arduino_setup()
    bh1750_init_with_wire("lightMeter", CONTINUOUS_HIGH_RES_MODE, 0x23, WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, bh1750_read_light_level(variables_get($lightMeter)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `bh1750_init_with_wire("varName", ...)` creates variable `$varName`; reference with `variables_get($varName)`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

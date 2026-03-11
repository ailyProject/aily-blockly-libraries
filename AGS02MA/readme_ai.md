# AGS02MA TVOC传感器

AGS02MA TVOC气体传感器控制库,适用于Arduino、ESP32等开发板，使用I2C接口读取TVOC浓度，输出PPB单位的数字量。

## Library Info
- **Name**: @aily-project/lib-ags02ma
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ags02ma_init` | Statement | WIRE(dropdown) | `ags02ma_init(WIRE)` | `` |
| `ags02ma_read_tvoc_ppb` | Value | (none) | `ags02ma_read_tvoc_ppb()` | `ags02ma.readPPB()` |
| `ags02ma_read_tvoc_ugm3` | Value | (none) | `ags02ma_read_tvoc_ugm3()` | `ags02ma_read_ugm3_converted()` |
| `ags02ma_reset` | Statement | (none) | `ags02ma_reset()` | `ags02ma.reset();\n` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ags02ma_init(WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ags02ma_read_tvoc_ppb())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

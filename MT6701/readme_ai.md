# MT6701磁旋转编码器

MT6701磁旋转编码器库，支持角度读取、RPM计算和转数累计，适用于ESP32开发板

## Library Info
- **Name**: @aily-project/lib-mt6701
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mt6701_init` | Statement | OBJECT(field_variable) | `mt6701_init($encoder)` | `` |
| `mt6701_init_advanced` | Statement | OBJECT(field_variable), ADDRESS(dropdown), INTERVAL(input_value) | `mt6701_init_advanced($encoder, 0x06, math_number(1000))` | `` |
| `mt6701_get_angle_radians` | Value | OBJECT(field_variable) | `mt6701_get_angle_radians($encoder)` | (dynamic code) |
| `mt6701_get_angle_degrees` | Value | OBJECT(field_variable) | `mt6701_get_angle_degrees($encoder)` | (dynamic code) |
| `mt6701_get_rpm` | Value | OBJECT(field_variable) | `mt6701_get_rpm($encoder)` | (dynamic code) |
| `mt6701_get_count` | Value | OBJECT(field_variable) | `mt6701_get_count($encoder)` | (dynamic code) |
| `mt6701_get_full_turns` | Value | OBJECT(field_variable) | `mt6701_get_full_turns($encoder)` | (dynamic code) |
| `mt6701_get_turns` | Value | OBJECT(field_variable) | `mt6701_get_turns($encoder)` | (dynamic code) |
| `mt6701_get_accumulator` | Value | OBJECT(field_variable) | `mt6701_get_accumulator($encoder)` | (dynamic code) |
| `mt6701_update_count` | Statement | OBJECT(field_variable) | `mt6701_update_count($encoder)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x06, 0x07, 0x08, 0x09 | 0x06 (默认) / 0x07 / 0x08 / 0x09 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    mt6701_init($encoder)
    mt6701_init_advanced($encoder, 0x06, math_number(1000))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, mt6701_get_angle_radians($encoder))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

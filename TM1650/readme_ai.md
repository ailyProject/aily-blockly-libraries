# TM1650四位数码管驱动库

TM1650四位数码管驱动库，通过I2C接口控制四位七段数码管显示，支持数字和部分字符显示。

## Library Info
- **Name**: @aily-project/lib-tm1650
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tm1650_init` | Statement | (none) | `tm1650_init()` | `` |
| `tm1650_set` | Statement | TM1650PWRSWITCH(dropdown), TM1650BRIGHTNESS(dropdown) | `tm1650_set(1, 0)` | `module.setupDisplay(` |
| `tm1650_displaystring` | Statement | TMSTR(input_value) | `tm1650_displaystring(text("hello"))` | `module.setDisplayToString(...);\n` |
| `tm1650_displayNumber` | Statement | TMNUM(input_value) | `tm1650_displayNumber(math_number(0))` | `module.setDisplayToDecNumber(` |
| `tm1650_clearDisplay` | Statement | (none) | `tm1650_clearDisplay()` | `module.clearDisplay();\n` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TM1650PWRSWITCH | 1, 0 | 开 / 关 |
| TM1650BRIGHTNESS | 0, 1, 2, 3, 4, 5, 6, 7 | 0 / 1 / 2 / 3 / 4 / 5 / 6 / 7 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tm1650_init()
    serial_begin(Serial, 9600)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

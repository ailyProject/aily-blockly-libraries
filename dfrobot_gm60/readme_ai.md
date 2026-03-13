# GM60二维码扫描器

DFRobot GM60二维码/条码扫描识别传感器控制库，支持I2C和UART通信，可识别QRCode、Data Matrix、PDF417、EAN13、Code128等多种码制

## Library Info
- **Name**: @aily-project/lib-dfrobot-gm60
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `gm60_init_i2c` | Statement | VAR(field_input), ADDRESS(dropdown), WIRE(dropdown) | `gm60_init_i2c("gm60", 0x1A, WIRE)` | (dynamic code) |
| `gm60_init_uart` | Statement | VAR(field_input), RX(input_value), TX(input_value) | `gm60_init_uart("gm60", math_number(0), math_number(0))` | `` |
| `gm60_set_encode` | Statement | VAR(field_variable), ENCODE(dropdown) | `gm60_set_encode($gm60, eUTF8)` | (dynamic code) |
| `gm60_setup_code` | Statement | VAR(field_variable), ON(dropdown), CONTENT(dropdown) | `gm60_setup_code($gm60, true, true)` | (dynamic code) |
| `gm60_set_identify` | Statement | VAR(field_variable), BARCODE(dropdown) | `gm60_set_identify($gm60, eEnableAllBarcode)` | (dynamic code) |
| `gm60_reset` | Statement | VAR(field_variable) | `gm60_reset($gm60)` | (dynamic code) |
| `gm60_detection` | Value | VAR(field_variable) | `gm60_detection($gm60)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x1A | 0x1A (默认) |
| ENCODE | eUTF8, eGBK | UTF-8 / GBK |
| ON | true, false | 开启 / 关闭 |
| CONTENT | true, false | 输出 / 不输出 |
| BARCODE | eEnableAllBarcode, eEnableDefaultcode, eForbidAllBarcode | 启用所有条码识别 / 启用默认条码识别 / 禁止所有条码识别 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    gm60_init_i2c("gm60", 0x1A, WIRE)
    gm60_init_uart("gm60", math_number(0), math_number(0))
    gm60_setup_code($gm60, true, true)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, gm60_detection($gm60))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `gm60_init_i2c("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

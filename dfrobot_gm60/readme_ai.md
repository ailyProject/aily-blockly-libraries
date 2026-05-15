# GM60 QR code scanner

DFRobot GM60 QR code/barcode scanning and recognition sensor control library supports I2C and UART communication and can recognize QRCode, Data Matrix, PDF417, EAN13, Code128 and other code systems.

## Library Info
- **Name**: @aily-project/lib-dfrobot-gm60
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `gm60_init_i2c` | Statement | VAR(field_input), ADDRESS(dropdown), WIRE(dropdown) | `gm60_init_i2c("gm60", "0x1A", WIRE)` | Dynamic code |
| `gm60_init_uart` | Statement | VAR(field_input), RX(input_value), TX(input_value) | `gm60_init_uart("gm60", math_number(0), math_number(0))` | Dynamic code |
| `gm60_set_encode` | Statement | VAR(field_variable), ENCODE(dropdown) | `gm60_set_encode(variables_get($gm60), eUTF8)` | Dynamic code |
| `gm60_setup_code` | Statement | VAR(field_variable), ON(dropdown), CONTENT(dropdown) | `gm60_setup_code(variables_get($gm60), true, true)` | Dynamic code |
| `gm60_set_identify` | Statement | VAR(field_variable), BARCODE(dropdown) | `gm60_set_identify(variables_get($gm60), eEnableAllBarcode)` | Dynamic code |
| `gm60_reset` | Statement | VAR(field_variable) | `gm60_reset(variables_get($gm60))` | Dynamic code |
| `gm60_detection` | Value | VAR(field_variable) | `gm60_detection(variables_get($gm60))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x1A | gm60_init_i2c |
| ENCODE | eUTF8, eGBK | gm60_set_encode |
| ON | true, false | gm60_setup_code |
| CONTENT | true, false | gm60_setup_code |
| BARCODE | eEnableAllBarcode, eEnableDefaultcode, eForbidAllBarcode | gm60_set_identify |

## ABS Examples

### Basic Usage
```
arduino_setup()
    gm60_init_i2c("gm60", "0x1A", WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, gm60_detection(variables_get($gm60)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `gm60_init_i2c("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

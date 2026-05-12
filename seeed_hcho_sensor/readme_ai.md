# Grove HCHO sensor

Grove HCHO formaldehyde sensor library, based on the WSP2110 semiconductor VOC gas sensor, can detect formaldehyde, benzene, toluene and other volatile organic compounds

## Library Info
- **Name**: @aily-project/lib-seeed-hcho-sensor
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `grove_hcho_init` | Statement | VAR(field_input), PIN(dropdown), R0(field_number) | `grove_hcho_init("hcho", PIN, 34.28)` | Dynamic code |
| `grove_hcho_read_raw` | Value | VAR(field_variable) | `grove_hcho_read_raw(variables_get($hcho))` | Dynamic code |
| `grove_hcho_read_rs` | Value | VAR(field_variable) | `grove_hcho_read_rs(variables_get($hcho))` | Dynamic code |
| `grove_hcho_read_ppm` | Value | VAR(field_variable) | `grove_hcho_read_ppm(variables_get($hcho))` | Dynamic code |
| `grove_hcho_calibrate_r0` | Value | VAR(field_variable) | `grove_hcho_calibrate_r0(variables_get($hcho))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    grove_hcho_init("hcho", PIN, 34.28)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, grove_hcho_read_raw(variables_get($hcho)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `grove_hcho_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

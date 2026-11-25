# Grove HCHO sensor

Grove HCHO formaldehyde sensor library, based on the WSP2110 semiconductor VOC gas sensor, can detect formaldehyde, benzene, toluene and other volatile organic compounds

## Library Info
- **Name**: @aily-project/lib-seeed-hcho-sensor
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `grove_hcho_init` | Statement | VAR(field_input), PIN(dropdown), R0(field_number) | `grove_hcho_init("hcho", PIN, 34.28)` | `struct GroveHCHO { ↵ int pin; ↵ double r0; ↵ GroveHCHO(int p, double r) : pin(p), r0(r) {} ↵ int readRaw() { return analogRead(pin); } ↵ double getRs() { ↵ int val = readRaw(); ↵ return (1023.0 / val) - 1.0; ↵ } ↵ double getPPM() { ↵ double rs = getRs(); ↵ return pow(10.0, ((log10(rs / r0) - 0.0827) / (-0.4807))); ↵ } ↵ double calibrateR0() { ↵ int val = readRaw(); ↵ return (1023.0 / val) - 1.0; ↵ } ↵ }; ↵ GroveHCHO hcho(PIN, 34.28);` |
| `grove_hcho_read_raw` | Value | VAR(field_variable) | `grove_hcho_read_raw($hcho)` | `hcho.readRaw()` |
| `grove_hcho_read_rs` | Value | VAR(field_variable) | `grove_hcho_read_rs($hcho)` | `hcho.getRs()` |
| `grove_hcho_read_ppm` | Value | VAR(field_variable) | `grove_hcho_read_ppm($hcho)` | `hcho.getPPM()` |
| `grove_hcho_calibrate_r0` | Value | VAR(field_variable) | `grove_hcho_calibrate_r0($hcho)` | `hcho.calibrateR0()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PIN | ${board.analogPins} | grove_hcho_init |

## ABS Examples

### Basic Usage
```
arduino_setup()
    grove_hcho_init("hcho", PIN, 34.28)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, grove_hcho_read_raw($hcho))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `grove_hcho_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

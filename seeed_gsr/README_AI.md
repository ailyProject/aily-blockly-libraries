# Grove GSR sensor

Grove Galvanic Skin Response Sensor Library for measuring emotional and physiological responses

## Library Info
- **Name**: @aily-project/lib-seeed-gsr
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `grove_gsr_read_raw` | Value | PIN(dropdown) | `grove_gsr_read_raw(A0)` | analogRead( |
| `grove_gsr_read_average` | Value | PIN(dropdown), SAMPLES(input_value) | `grove_gsr_read_average(A0, math_number(0))` | Dynamic code |
| `grove_gsr_print_value` | Statement | PIN(dropdown) | `grove_gsr_print_value(A0)` | Serial.print( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PIN | A0, A1, A2, A3, A4, A5 | grove_gsr_read_raw, grove_gsr_read_average, grove_gsr_print_value |

## ABS Examples

### Basic Usage
```
arduino_setup()
    grove_gsr_print_value(A0)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, grove_gsr_read_raw(A0))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

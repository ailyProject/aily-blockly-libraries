# M5Dial Encoder and RFID

Blockly bindings for the official M5Dial encoder and RFID APIs with fixed onboard wiring.

## Library Info
- **Name**: @aily-project/lib-m5stack-dial
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `m5dial_peripheral_init` | Statement | (none) | `m5dial_peripheral_init()` | Dynamic code |
| `m5dial_encoder_position` | Value | (none) | `m5dial_encoder_position()` | M5Dial.Encoder.read() |
| `m5dial_encoder_delta` | Value | (none) | `m5dial_encoder_delta()` | M5Dial.Encoder.readAndReset() |
| `m5dial_encoder_write` | Statement | VALUE(input_value) | `m5dial_encoder_write(math_number(0))` | M5Dial.Encoder.write( |
| `m5dial_rfid_uid` | Value | (none) | `m5dial_rfid_uid()` | ailyM5DialRfidUid() |

## ABS Examples

### Basic Usage
```
arduino_setup()
    m5dial_peripheral_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, m5dial_encoder_position())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

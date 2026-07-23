# M5DinMeter Encoder

Blockly bindings for the official M5DinMeter encoder API with fixed onboard pins.

## Library Info
- **Name**: @aily-project/lib-m5stack-dinmeter
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `m5dinmeter_encoder_init` | Statement | (none) | `m5dinmeter_encoder_init()` | Dynamic code |
| `m5dinmeter_encoder_position` | Value | (none) | `m5dinmeter_encoder_position()` | DinMeter.Encoder.read() |
| `m5dinmeter_encoder_delta` | Value | (none) | `m5dinmeter_encoder_delta()` | DinMeter.Encoder.readAndReset() |
| `m5dinmeter_encoder_write` | Statement | VALUE(input_value) | `m5dinmeter_encoder_write(math_number(0))` | DinMeter.Encoder.write( |

## ABS Examples

### Basic Usage
```
arduino_setup()
    m5dinmeter_encoder_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, m5dinmeter_encoder_position())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

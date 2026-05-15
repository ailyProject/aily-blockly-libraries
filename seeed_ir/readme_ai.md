# Seeed Infrared Remote

Blockly wrapper for Seeed_Arduino_IR with Wio Terminal built-in IR sending, IRLib2 protocol sending, raw sending, and basic receive decoding.

## Library Info
- **Name**: @aily-project/lib-seeed-ir
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_ir_sender_create` | Statement | VAR(field_input) | `seeed_ir_sender_create("irSender")` | Dynamic code |
| `seeed_ir_raw_sender_create` | Statement | VAR(field_input) | `seeed_ir_raw_sender_create("rawSender")` | Dynamic code |
| `seeed_ir_send` | Statement | VAR(field_variable), PROTOCOL(dropdown), DATA(input_value), DATA2(input_value), KHZ(input_value) | `seeed_ir_send(variables_get($irSender), NEC, math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `seeed_ir_send_nec` | Statement | VAR(field_variable), DATA(input_value), KHZ(input_value) | `seeed_ir_send_nec(variables_get($irSender), math_number(0), math_number(0))` | Dynamic code |
| `seeed_ir_wio_send` | Statement | PROTOCOL(dropdown), DATA(input_value), DATA2(input_value), KHZ(input_value) | `seeed_ir_wio_send(NEC, math_number(0), math_number(0), math_number(0))` | ailyWioIrSender.send( |
| `seeed_ir_send_raw` | Statement | VAR(field_variable), DATA(input_value), KHZ(input_value) | `seeed_ir_send_raw(variables_get($rawSender), text("value"), math_number(0))` | Dynamic code |
| `seeed_ir_receiver_create` | Statement | VAR(field_input), DECODER(field_input), PIN(field_number) | `seeed_ir_receiver_create("irReceiver", "irDecoder", 2)` | Dynamic code |
| `seeed_ir_receiver_enable` | Statement | VAR(field_variable) | `seeed_ir_receiver_enable(variables_get($irReceiver))` | Dynamic code |
| `seeed_ir_on_receive` | Statement | VAR(field_variable), DECODER(field_variable), DO(input_statement) | `seeed_ir_on_receive(variables_get($irReceiver), variables_get($irDecoder)) @DO: child_block()` | if ( |
| `seeed_ir_receiver_available` | Value | VAR(field_variable) | `seeed_ir_receiver_available(variables_get($irReceiver))` | Dynamic code |
| `seeed_ir_decoder_decode` | Statement | DECODER(field_variable) | `seeed_ir_decoder_decode(variables_get($irDecoder))` | Dynamic code |
| `seeed_ir_decoder_get` | Value | DECODER(field_variable), FIELD(dropdown) | `seeed_ir_decoder_get(variables_get($irDecoder), PROTOCOL)` | Dynamic code |
| `seeed_ir_decoder_protocol_name` | Value | DECODER(field_variable) | `seeed_ir_decoder_protocol_name(variables_get($irDecoder))` | ailySeeedIrProtocolName( |
| `seeed_ir_decoder_dump` | Statement | DECODER(field_variable), VERBOSE(dropdown) | `seeed_ir_decoder_dump(variables_get($irDecoder), true)` | Dynamic code |
| `seeed_ir_receiver_resume` | Statement | VAR(field_variable) | `seeed_ir_receiver_resume(variables_get($irReceiver))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PROTOCOL | NEC, SONY, RC5, RC6, PANASONIC_OLD, JVC, NECX, SAMSUNG36, GICABLE, DIRECTV, RCMM, CYKM | seeed_ir_send, seeed_ir_wio_send |
| FIELD | PROTOCOL, VALUE, ADDRESS, BITS | seeed_ir_decoder_get |
| VERBOSE | true, false | seeed_ir_decoder_dump |

## ABS Examples

### Basic Usage
```
arduino_setup()
    seeed_ir_sender_create("irSender")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, seeed_ir_receiver_available(variables_get($irReceiver)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `seeed_ir_sender_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

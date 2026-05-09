# Seeed IR

Blockly ABS reference for Seeed_Arduino_IR (IRLib2), focused on Wio Terminal built-in IR emission plus protocol sending, raw sending, and basic receive/decode workflows.

## Library Info
- **Name**: @aily-project/lib-seeed-ir
- **Version**: 1.0.0
- **Source**: https://github.com/Seeed-Studio/Seeed_Arduino_IR
- **Includes**: `IRLibSendBase.h`, `IRLibDecodeBase.h`, protocol headers `IRLib_P01_NEC.h` to `IRLib_P12_CYKM.h`, `IRLib_HashRaw.h`, `IRLibCombo.h`, and `IRLibRecvPCI.h` for receiving.

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_ir_sender_create` | Statement | VAR(field_input) | `seeed_ir_sender_create("irSender")` | `IRsend irSender;` |
| `seeed_ir_raw_sender_create` | Statement | VAR(field_input) | `seeed_ir_raw_sender_create("rawSender")` | `IRsendRaw rawSender;` |
| `seeed_ir_send` | Statement | VAR(field_variable), PROTOCOL(dropdown), DATA(input_value), DATA2(input_value), KHZ(input_value) | `seeed_ir_send($irSender, NEC, math_number(1637937167), math_number(0), math_number(38))` | `irSender.send(NEC, data, data2, khz);` |
| `seeed_ir_send_nec` | Statement | VAR(field_variable), DATA(input_value), KHZ(input_value) | `seeed_ir_send_nec($irSender, math_number(1637937167), math_number(38))` | `irSender.send(NEC, data, 0, khz);` |
| `seeed_ir_wio_send` | Statement | PROTOCOL(dropdown), DATA(input_value), DATA2(input_value), KHZ(input_value) | `seeed_ir_wio_send(NEC, math_number(1637937167), math_number(0), math_number(38))` | uses global `IRsend ailyWioIrSender;` |
| `seeed_ir_send_raw` | Statement | VAR(field_variable), DATA(input_value), KHZ(input_value) | `seeed_ir_send_raw($rawSender, text("9000,4500,560,560"), math_number(38))` | creates local `uint16_t[]` and calls `rawSender.send(...)` |
| `seeed_ir_receiver_create` | Statement | VAR(field_input), DECODER(field_input), PIN(field_number) | `seeed_ir_receiver_create("irReceiver", "irDecoder", 2)` | `IRrecvPCI irReceiver(2); IRdecode irDecoder;` |
| `seeed_ir_receiver_enable` | Statement | VAR(field_variable) | `seeed_ir_receiver_enable($irReceiver)` | `irReceiver.enableIRIn();` |
| `seeed_ir_on_receive` | Statement | VAR(field_variable), DECODER(field_variable), DO(input_statement) | `seeed_ir_on_receive($irReceiver, $irDecoder) @DO: ...` | `if (irReceiver.getResults()) { irDecoder.decode(); ... irReceiver.enableIRIn(); }` |
| `seeed_ir_receiver_available` | Value | VAR(field_variable) | `seeed_ir_receiver_available($irReceiver)` | `irReceiver.getResults()` |
| `seeed_ir_decoder_decode` | Statement | DECODER(field_variable) | `seeed_ir_decoder_decode($irDecoder)` | `irDecoder.decode();` |
| `seeed_ir_decoder_get` | Value | DECODER(field_variable), FIELD(dropdown) | `seeed_ir_decoder_get($irDecoder, VALUE)` | `irDecoder.value` etc. |
| `seeed_ir_decoder_protocol_name` | Value | DECODER(field_variable) | `seeed_ir_decoder_protocol_name($irDecoder)` | `ailySeeedIrProtocolName(irDecoder.protocolNum)` |
| `seeed_ir_decoder_dump` | Statement | DECODER(field_variable), VERBOSE(dropdown) | `seeed_ir_decoder_dump($irDecoder, true)` | `irDecoder.dumpResults(true);` |
| `seeed_ir_receiver_resume` | Statement | VAR(field_variable) | `seeed_ir_receiver_resume($irReceiver)` | `irReceiver.enableIRIn();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PROTOCOL | NEC, SONY, RC5, RC6, PANASONIC_OLD, JVC, NECX, SAMSUNG36, GICABLE, DIRECTV, RCMM, CYKM | IRLib2 protocol constants from `IRLibProtocols.h` |
| DATA2 | number | Protocol-dependent extra value. For Sony this is usually bit count, e.g. `20`; for NEC use `0`. |
| KHZ | number | Carrier frequency in kHz. `38` is the common default. |
| FIELD | PROTOCOL, VALUE, ADDRESS, BITS | Maps to `protocolNum`, `value`, `address`, `bits` on `IRdecode`. |
| VERBOSE | true, false | Passed to `dumpResults(verbose)`. |

## ABS Examples

### Wio Terminal Built-in IR Emitter
```abs
arduino_loop()
    seeed_ir_wio_send(NEC, math_number(1637937167), math_number(0), math_number(38))
    time_delay(math_number(1000))
```

### Object-based Sender
```abs
arduino_setup()
    seeed_ir_sender_create("irSender")

arduino_loop()
    seeed_ir_send($irSender, SONY, math_number(691146), math_number(20), math_number(38))
    time_delay(math_number(1000))
```

### Raw Send
```abs
arduino_setup()
    seeed_ir_raw_sender_create("rawSender")

arduino_loop()
    seeed_ir_send_raw($rawSender, text("9000,4500,560,560,560,1690"), math_number(38))
```

### Receive and Print
```abs
arduino_setup()
    serial_begin(Serial, 9600)
    seeed_ir_receiver_create("irReceiver", "irDecoder", 2)
    seeed_ir_receiver_enable($irReceiver)

arduino_loop()
    seeed_ir_on_receive($irReceiver, $irDecoder)
        @DO:
            serial_println(Serial, seeed_ir_decoder_protocol_name($irDecoder))
            serial_println(Serial, seeed_ir_decoder_get($irDecoder, VALUE))
```

## Notes

1. **Wio output pin**: On Wio Terminal, the upstream library defines `IR_SEND_PWM_PIN` as `WIO_IR`; Blockly users do not choose a transmit pin.
2. **Wiki value**: The Seeed wiki NEC sample `0x61a0f00f` is represented as decimal `1637937167` in numeric shadow blocks.
3. **Variable creation**: `seeed_ir_sender_create("name")` creates `$name` of type `IRsend`; `seeed_ir_receiver_create` creates both `$irReceiver` and `$irDecoder`.
4. **Raw DATA**: `seeed_ir_send_raw` expects a text literal containing comma-separated microsecond timings. Dynamic string expressions cannot become C++ array initializers.
5. **Receiving**: `seeed_ir_on_receive` automatically calls `decode()` and `enableIRIn()` after the handler. In a manual flow, call `seeed_ir_receiver_available`, then `seeed_ir_decoder_decode`, then `seeed_ir_receiver_resume`.
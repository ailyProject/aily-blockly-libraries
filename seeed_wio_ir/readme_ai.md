# Wio Terminal Infrared Emitter

Controls the Wio Terminal built-in infrared emitter with IRLib2 protocol and raw timing transmission.

## Library Info
- **Name**: @aily-project/lib-seeed-wio-ir
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wio_ir_send_nec` | Statement | DATA(input_value), KHZ(input_value) | `wio_ir_send_nec(math_number(0), math_number(0))` | ailyWioIrSender.send(NEC, |
| `wio_ir_send` | Statement | PROTOCOL(dropdown), DATA(input_value), DATA2(input_value), KHZ(input_value) | `wio_ir_send(NEC, math_number(0), math_number(0), math_number(0))` | ailyWioIrSender.send( |
| `wio_ir_send_raw` | Statement | DATA(input_value), KHZ(input_value) | `wio_ir_send_raw(text("9000,4500,560,560"), math_number(38))` | `ailyWioIrRawSender.send(...)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PROTOCOL | NEC, SONY, RC5, RC6, PANASONIC_OLD, JVC, NECX, SAMSUNG36, GICABLE, DIRECTV, RCMM, CYKM | wio_ir_send |

## ABS Examples

### Basic Usage
```
arduino_setup()

arduino_loop()
    wio_ir_send_nec(math_number(1637937167), math_number(38))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Board scope**: this library targets `Seeeduino:samd:seeed_wio_terminal`; the bundled upstream library maps the sender to `WIO_IR`.
4. **Automatic sender**: send blocks create the required global `IRsend` or `IRsendRaw` object; no setup block is needed.
5. **Protocol extra value**: `DATA2` is protocol-specific (for example Sony bit count, Samsung36 address, or JVC first-send flag). Use `0` for the tutorial NEC example.
6. **Raw data**: `DATA` must be a text literal containing 1 to 255 comma-separated integer microsecond timings, each from 1 to 65535.

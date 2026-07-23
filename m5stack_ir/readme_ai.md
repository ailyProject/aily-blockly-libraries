# M5Stack Onboard Infrared

## Library Info
- **Name**: @aily-project/lib-m5stack-ir
- **Version**: 0.1.0
- **Bundled runtime**: Arduino-IRremote 4.7.0 source in `src.7z`; no additional IR library package is required

## Blocks

| Block | Connection | ABS |
|---|---|---|
| `m5stack_ir_init` | Statement | `m5stack_ir_init()` |
| `m5stack_ir_send` | Statement | `m5stack_ir_send(NEC, math_number(0), math_number(52), math_number(0))` |
| `m5stack_ir_send_repeat_frame` | Statement | `m5stack_ir_send_repeat_frame(NEC)` |
| `m5stack_ir_send_pronto` | Value Boolean | `m5stack_ir_send_pronto(text("0000 006D 0001 0000 015B 0057"), math_number(0))` |
| `m5stack_ir_send_raw` | Value Boolean | `m5stack_ir_send_raw(text("9000,4500,560,560"), math_number(38))` |
| `m5stack_ir_send_raw_repeat` | Value Boolean | `m5stack_ir_send_raw_repeat(text("9000,4500,560,560"), math_number(38), math_number(110), math_number(1))` |
| `m5stack_ir_send_pulse_distance` | Statement | Custom carrier, header, mark/space timing, data, bit order, frame period, and repeats |
| `m5stack_ir_send_biphase` | Statement | Custom carrier frequency, time unit, data, bit count, and optional start bit |

`m5stack_ir_send` supports all 23 address/command protocols handled by Arduino-IRremote `IRsend::write`. Pins are selected from `window.boardConfig` and fixed to the official onboard wiring. Raw blocks accept up to 256 positive microsecond durations separated by commas, semicolons, or whitespace. Pronto input is validated and normalized before it reaches Arduino-IRremote. Receiver blocks are not provided because the supported devices expose an onboard transmitter only.

# Infrared remote control

The infrared remote control receiving and sending library based on Arduino-IRremote provides IrReceiver/IrSender initialization, decoding result reading and common protocol writing blocks.

## Library Info
- **Name**: @aily-project/lib-irremote
- **Version**: 0.0.4

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `irremote_library_config` | Statement | RAW_LENGTH(input_value), UNIVERSAL(field_checkbox), EXOTIC(field_checkbox) | `irremote_library_config(math_number(0), TRUE, TRUE)` | Dynamic code |
| `irremote_receiver_begin` | Statement | PIN(input_value), LED_FEEDBACK(field_checkbox) | `irremote_receiver_begin(math_number(2), TRUE)` | Dynamic code |
| `irremote_sender_begin` | Statement | PIN(input_value) | `irremote_sender_begin(math_number(2))` | Dynamic code |
| `irremote_on_receive` | Statement | IGNORE_REPEAT(field_checkbox), DO(input_statement) | `irremote_on_receive(TRUE) @DO: child_block()` | if (IrReceiver.decode()) {\n if (!(IrReceiver.decodedIRData.flags & IRDATA_FLAGS_IS_REPEAT |
| `irremote_receiver_available` | Value | (none) | `irremote_receiver_available()` | IrReceiver.available() |
| `irremote_get_value` | Value | FIELD(dropdown) | `irremote_get_value(ADDRESS)` | IrReceiver.decodedIRData.command |
| `irremote_get_protocol` | Value | FORMAT(dropdown) | `irremote_get_protocol(NAME)` | String(IrReceiver.getProtocolString()) |
| `irremote_check_flag` | Value | FLAG(dropdown) | `irremote_check_flag(REPEAT)` | (IrReceiver.decodedIRData.flags & ...) != 0 |
| `irremote_is_preset_key` | Value | KEY(dropdown) | `irremote_is_preset_key("69")` | (IrReceiver.decodedIRData.command == ...) |
| `irremote_get_preset_name` | Value | (none) | `irremote_get_preset_name()` | String(ailyIrremoteGetPresetKeyName(IrReceiver.decodedIRData.command)) |
| `irremote_resume` | Statement | (none) | `irremote_resume()` | IrReceiver.resume();\n |
| `irremote_send_command` | Statement | PROTOCOL(dropdown), ADDRESS(input_value), COMMAND(input_value), REPEAT(input_value) | `irremote_send_command(NEC, math_number(0), math_number(0), math_number(0))` | IrSender.write(..., ..., ..., ...);\n |
| `irremote_print_result` | Statement | FORMAT(dropdown) | `irremote_print_result(SHORT)` | IrReceiver.printIRSendUsage(&Serial);\n |
| `irremote_command_equals` | Value | VALUE(input_value) | `irremote_command_equals(math_number(0))` | (IrReceiver.decodedIRData.command == ...) |
| `irremote_send_nec` | Statement | ADDRESS(input_value), COMMAND(input_value), REPEAT(input_value) | `irremote_send_nec(math_number(0), math_number(0), math_number(0))` | IrSender.sendNEC(..., ..., ...);\n |
| `irremote_send_raw` | Statement | DATA(input_value), FREQ(input_value) | `irremote_send_raw(text("value"), math_number(0))` | {\n const uint16_t irRawData[] = {...};\n IrSender.sendRaw(irRawData, sizeof(irRawData) / |
| `irremote_send_pronto` | Statement | CODE(input_value), REPEAT(input_value) | `irremote_send_pronto(text("value"), math_number(0))` | IrSender.sendPronto(F(...), ...);\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FIELD | ADDRESS, COMMAND, EXTRA, RAW, BITS, FLAGS | irremote_get_value |
| FORMAT | NAME, ID | irremote_get_protocol |
| FLAG | REPEAT, AUTO_REPEAT, PARITY, TOGGLE, DIFF_REPEAT, EXTRA_INFO | irremote_check_flag |
| KEY | 69, 70, 71, 68, 64, 67, 7, 21, 9, 22, 12, 24, 94, 8, 28, 90, 66, 82, 74 | irremote_is_preset_key |
| PROTOCOL | NEC, NEC2, SAMSUNG, SAMSUNG48, SAMSUNGLG, SONY, PANASONIC, DENON, SHARP, LG, JVC, RC5, RC6, KASEIKYO_JVC, KASEIKYO_DENON, KASEIKYO_SHARP, KASEIKYO_MITSUBISHI, ONKYO, APPLE, BOSEWAVE, ... | irremote_send_command |
| FORMAT | SHORT, SEND_USAGE, RAW | irremote_print_result |

## ABS Examples

### Basic Usage
```
arduino_setup()
    irremote_library_config(math_number(0), TRUE, TRUE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, irremote_receiver_available())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

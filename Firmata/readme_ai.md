# Firmata

Standard serial protocol for communication between microcontrollers and host software.

## Library Info

- **Name**: @aily-project/lib-firmata
- **Version**: 1.0.0
- **Upstream Version**: 2.5.9
- **Source**: https://github.com/firmata/arduino

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `firmata_begin` | Statement | BAUD(value), AUTO(checkbox) | `firmata_begin(math_number(1), TRUE)` | Firmata.begin(baud); Firmata.processInput(); |
| `firmata_process` | Statement | (none) | `firmata_process()` | See generator.js |
| `firmata_available` | Value | (none) | `firmata_available()` | See generator.js |
| `firmata_send_analog` | Statement | PIN(value), VALUE(value) | `firmata_send_analog(math_number(1), math_number(1))` | See generator.js |
| `firmata_send_digital_port` | Statement | PORT(value), VALUE(value) | `firmata_send_digital_port(math_number(1), math_number(1))` | See generator.js |
| `firmata_send_string` | Statement | TEXT(value) | `firmata_send_string(text("value"))` | See generator.js |
| `firmata_on_digital_message` | Hat | PORTVAR(input), VALUEVAR(input) | `firmata_on_digital_message("firmataPort", "firmataValue")` | See generator.js |
| `firmata_on_pin_mode` | Hat | PINVAR(input), MODEVAR(input) | `firmata_on_pin_mode("firmataPin", "firmataMode")` | See generator.js |
| `firmata_on_string` | Hat | TEXTVAR(input) | `firmata_on_string("firmataText")` | See generator.js |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| AUTO | TRUE, FALSE | Whether begin adds input processing to loop. |

## Notes

1. Firmata begin can automatically process input in loop.
2. Callback blocks attach the matching Firmata command handler in setup.
3. For full StandardFirmata behavior, combine these blocks with normal GPIO, analog, servo, and I2C blocks as needed.

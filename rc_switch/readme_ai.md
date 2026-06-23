# rc-switch

Operate 433/315 MHz remote controlled devices from Arduino-compatible boards.

## Library Info

- **Name**: @aily-project/lib-rc-switch
- **Version**: 1.0.0
- **Upstream Version**: 2.6.4
- **Source**: https://github.com/sui77/rc-switch

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rcswitch_create` | Statement | VAR(input) | `rcswitch_create("mySwitch")` | See generator.js |
| `rcswitch_enable_transmit` | Statement | VAR(variable), PIN(value) | `rcswitch_enable_transmit(variables_get($mySwitch), math_number(1))` | See generator.js |
| `rcswitch_enable_receive` | Statement | VAR(variable), INTERRUPT(value) | `rcswitch_enable_receive(variables_get($mySwitch), math_number(1))` | See generator.js |
| `rcswitch_set_protocol` | Statement | VAR(variable), PROTOCOL(value), PULSE(value) | `rcswitch_set_protocol(variables_get($mySwitch), math_number(1), math_number(1))` | See generator.js |
| `rcswitch_set_repeat` | Statement | VAR(variable), REPEAT(value) | `rcswitch_set_repeat(variables_get($mySwitch), math_number(1))` | See generator.js |
| `rcswitch_send_decimal` | Statement | VAR(variable), CODE(value), BITS(value) | `rcswitch_send_decimal(variables_get($mySwitch), math_number(1), math_number(1))` | See generator.js |
| `rcswitch_send_binary` | Statement | VAR(variable), CODE(value) | `rcswitch_send_binary(variables_get($mySwitch), text("value"))` | See generator.js |
| `rcswitch_send_tristate` | Statement | VAR(variable), CODE(value) | `rcswitch_send_tristate(variables_get($mySwitch), text("value"))` | See generator.js |
| `rcswitch_available` | Value | VAR(variable) | `rcswitch_available(variables_get($mySwitch))` | See generator.js |
| `rcswitch_received_value` | Value | VAR(variable), FIELD(dropdown) | `rcswitch_received_value(variables_get($mySwitch), getReceivedValue)` | See generator.js |
| `rcswitch_reset_available` | Statement | VAR(variable) | `rcswitch_reset_available(variables_get($mySwitch))` | See generator.js |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FIELD | value, bit length, delay, protocol | Received packet field. |

## Notes

1. Use enable transmit before send blocks.
2. Use enable receive with an interrupt number, for example 0 for pin 2 on many AVR boards.
3. Call reset available after reading a received packet.

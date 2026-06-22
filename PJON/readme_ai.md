# PJON

PJON is a multi-master bus network protocol for local and networked device communication.

## Library Info

- **Name**: @aily-project/lib-pjon
- **Version**: 1.0.0
- **Upstream Version**: 13.1.0
- **Source**: https://github.com/gioblu/PJON

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `pjon_sbb_begin` | Statement | VAR(input), ID(value), PIN(value) | `pjon_sbb_begin("bus", math_number(1), math_number(1))` | PJONSoftwareBitBang bus(id); bus.strategy.set_pin(pin); bus.begin(); |
| `pjon_sbb_update_receive` | Statement | VAR(variable), TIMEOUT(value) | `pjon_sbb_update_receive(variables_get($bus), math_number(1))` | See generator.js |
| `pjon_sbb_send_text` | Statement | VAR(variable), TEXT(value), DEVICE(value) | `pjon_sbb_send_text(variables_get($bus), text("value"), math_number(1))` | See generator.js |
| `pjon_sbb_send_repeated_text` | Statement | VAR(variable), TEXT(value), DEVICE(value), INTERVAL(value) | `pjon_sbb_send_repeated_text(variables_get($bus), text("value"), math_number(1), math_number(1))` | See generator.js |
| `pjon_sbb_reply_text` | Statement | VAR(variable), TEXT(value) | `pjon_sbb_reply_text(variables_get($bus), text("value"))` | See generator.js |
| `pjon_sbb_on_receive` | Hat | VAR(variable), BYTEVAR(input), LENVAR(input) | `pjon_sbb_on_receive(variables_get($bus), "pjonByte", "pjonLength")` | See generator.js |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| VAR | Blockly variable | PJON bus object name. |

## Notes

1. The wrapper uses PJONSoftwareBitBang because it is the most common Arduino PJON entry point.
2. The begin block adds update() and receive(1000) to loop automatically.
3. Callback local variables expose the first payload byte and packet length.

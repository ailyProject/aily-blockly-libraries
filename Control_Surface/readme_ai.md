# Control Surface

Arduino library for creating MIDI controllers and MIDI devices.

## Library Info

- **Name**: @aily-project/lib-control-surface
- **Version**: 1.0.0
- **Upstream Version**: 2.1.2
- **Source**: https://github.com/tttapa/Control-Surface

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `control_surface_usb_interface` | Statement | VAR(input) | `control_surface_usb_interface("midi")` | See generator.js |
| `control_surface_serial_interface` | Statement | VAR(input), SERIAL(dropdown) | `control_surface_serial_interface("midi", )` | See generator.js |
| `control_surface_begin` | Statement | (none) | `control_surface_begin()` | See generator.js |
| `control_surface_loop` | Statement | (none) | `control_surface_loop()` | See generator.js |
| `control_surface_cc_pot` | Statement | VAR(input), PIN(value), CC(value), CHANNEL(dropdown) | `control_surface_cc_pot("pot", math_number(1), math_number(1), Channel_1)` | See generator.js |
| `control_surface_note_button` | Statement | VAR(input), PIN(value), NOTE(value), CHANNEL(dropdown) | `control_surface_note_button("button", math_number(1), math_number(1), Channel_1)` | See generator.js |
| `control_surface_send_note` | Statement | VAR(variable), ACTION(dropdown), NOTE(value), VELOCITY(value), CHANNEL(dropdown) | `control_surface_send_note(variables_get($midi), sendNoteOn, math_number(1), math_number(1), Channel_1)` | See generator.js |
| `control_surface_send_cc` | Statement | VAR(variable), CC(value), VALUE(value), CHANNEL(dropdown) | `control_surface_send_cc(variables_get($midi), math_number(1), math_number(1), Channel_1)` | See generator.js |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| CHANNEL | Channel_1 ... Channel_16 | Control Surface channel enum. |

## Notes

1. Declare at least one MIDI interface before Control_Surface.begin().
2. Element declaration blocks add global objects; place them once in setup flow for Blockly clarity.
3. Use Control_Surface.loop() continuously to scan inputs and send MIDI messages.

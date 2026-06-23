# MIDI Library

Arduino MIDI input and output library.

## Library Info

- **Name**: @aily-project/lib-midi
- **Version**: 1.0.0
- **Upstream Version**: 5.0.2
- **Source**: https://github.com/FortySevenEffects/arduino_midi_library

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `midi_begin` | Statement | CHANNEL(value) | `midi_begin(math_number(1))` | MIDI_CREATE_DEFAULT_INSTANCE(); MIDI.begin(channel); |
| `midi_read` | Value | (none) | `midi_read()` | See generator.js |
| `midi_send_note_on` | Statement | NOTE(value), VELOCITY(value), CHANNEL(value) | `midi_send_note_on(math_number(1), math_number(1), math_number(1))` | See generator.js |
| `midi_send_note_off` | Statement | NOTE(value), VELOCITY(value), CHANNEL(value) | `midi_send_note_off(math_number(1), math_number(1), math_number(1))` | See generator.js |
| `midi_send_control_change` | Statement | CC(value), VALUE(value), CHANNEL(value) | `midi_send_control_change(math_number(1), math_number(1), math_number(1))` | See generator.js |
| `midi_send_program_change` | Statement | PROGRAM(value), CHANNEL(value) | `midi_send_program_change(math_number(1), math_number(1))` | See generator.js |
| `midi_send_pitch_bend` | Statement | VALUE(value), CHANNEL(value) | `midi_send_pitch_bend(math_number(1), math_number(1))` | See generator.js |
| `midi_get_data` | Value | FIELD(dropdown) | `midi_get_data(getType)` | See generator.js |
| `midi_turn_thru` | Statement | STATE(dropdown) | `midi_turn_thru(turnThruOn)` | See generator.js |
| `midi_on_note_on` | Hat | CHANNELVAR(input), NOTEVAR(input), VELOCITYVAR(input) | `midi_on_note_on("midiChannel", "midiNote", "midiVelocity")` | See generator.js |
| `midi_on_control_change` | Hat | CHANNELVAR(input), CCVAR(input), VALUEVAR(input) | `midi_on_control_change("midiChannel", "midiCC", "midiValue")` | See generator.js |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FIELD | getType, getChannel, getData1, getData2 | Last received MIDI message field. |
| STATE | turnThruOn, turnThruOff | MIDI thru mode. |

## Notes

1. The wrapper uses MIDI_CREATE_DEFAULT_INSTANCE().
2. Callback blocks add MIDI.read() to loop automatically.
3. For custom serial ports, extend the wrapper with MIDI_CREATE_INSTANCE blocks.

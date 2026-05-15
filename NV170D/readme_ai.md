# Specific voice broadcast

The hardware uses the openjumper voice broadcast module (ojmoBph4010) based on a specific voice broadcast library, with built-in 69 daily voices, and an IO driver to realize speech synthesis and playback of text content.

## Library Info
- **Name**: @aily-project/lib-nv170d
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `nv170d_init` | Statement | NV_NAME(field_input), NV_PIN(dropdown) | `nv170d_init("nv170d", NV_PIN)` | Dynamic code |
| `nv170d_play` | Statement | NV_NAME(field_input), NV_PLAYNUM(dropdown) | `nv170d_play("nv170d", "0X00")` | ....sendDWS(...);\n |
| `nv170d_set` | Statement | NV_NAME(field_input), NV_SET(dropdown) | `nv170d_set("nv170d", "0XE0")` | ....sendDWS(...);\n |
| `nv170d_playcon` | Statement | NV_NAME(field_input), NV_PLAYCONNUM(dropdown) | `nv170d_playcon("nv170d", "0XF1")` | See generator |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| NV_PLAYNUM | 0X00, 0X01, 0X02, 0X03, 0X04, 0X05, 0X06, 0X07, 0X08, 0X09, 0X0a, 0X0b, 0X0c, 0X0d, 0X0e, 0X0f, 0X10, 0X11, 0X12, 0X13, ... | nv170d_play |
| NV_SET | 0XE0, 0XE1, 0XE2, 0XE3, 0XE4, 0XE5, 0XE6, 0XE7, 0XF2, 0XFE | nv170d_set |
| NV_PLAYCONNUM | 0XF1, 0X00, 0X01, 0X02, 0X03, 0X04, 0X05, 0X06, 0X07, 0X08, 0X09, 0X0a, 0X0b, 0X0c, 0X0d, 0X0e, 0X0f, 0X10, 0X11, 0X12, ... | nv170d_playcon |

## ABS Examples

### Basic Usage
```
arduino_setup()
    nv170d_init("nv170d", NV_PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    nv170d_play("nv170d", "0X00")
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# Seeed Tca9548a

Blockly library for Seeed Tca9548a.

## Library Info
- **Name**: @aily-project/lib-seeed-tca9548a
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tca9548a_init` | Statement | ADDRESS(dropdown) | `tca9548a_init("0x70")` | Wire.begin();\ntca9548a_mux.begin(Wire, |
| `tca9548a_open_channel` | Statement | CHANNEL(dropdown) | `tca9548a_open_channel(TCA_CHANNEL_0)` | tca9548a_mux.openChannel( |
| `tca9548a_close_channel` | Statement | CHANNEL(dropdown) | `tca9548a_close_channel(TCA_CHANNEL_0)` | tca9548a_mux.closeChannel( |
| `tca9548a_close_all` | Statement | (none) | `tca9548a_close_all()` | tca9548a_mux.closeAll();\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77 | tca9548a_init |
| CHANNEL | TCA_CHANNEL_0, TCA_CHANNEL_1, TCA_CHANNEL_2, TCA_CHANNEL_3, TCA_CHANNEL_4, TCA_CHANNEL_5, TCA_CHANNEL_6, TCA_CHANNEL_7 | tca9548a_open_channel, tca9548a_close_channel |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tca9548a_init("0x70")
    serial_begin(Serial, 9600)

arduino_loop()
    tca9548a_open_channel(TCA_CHANNEL_0)
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

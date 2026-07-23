# M5Cardputer Keyboard

Blockly bindings for the official M5Cardputer keyboard API. Matrix pins and scanning are fixed by the device library.

## Library Info
- **Name**: @aily-project/lib-m5stack-cardputer
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `m5cardputer_keyboard_init` | Statement | (none) | `m5cardputer_keyboard_init()` | Dynamic code |
| `m5cardputer_keyboard_any` | Value | (none) | `m5cardputer_keyboard_any()` | (M5Cardputer.Keyboard.isPressed() > 0) |
| `m5cardputer_keyboard_changed` | Value | (none) | `m5cardputer_keyboard_changed()` | ailyM5CardputerKeyboardChanged() |
| `m5cardputer_keyboard_key` | Value | KEY(input_value) | `m5cardputer_keyboard_key(text("value"))` | ailyM5CardputerKeyPressed(String( |
| `m5cardputer_keyboard_special` | Value | KEY(dropdown) | `m5cardputer_keyboard_special(tab)` | M5Cardputer.Keyboard.keysState(). |
| `m5cardputer_keyboard_text` | Value | (none) | `m5cardputer_keyboard_text()` | ailyM5CardputerText() |
| `m5cardputer_keyboard_caps` | Value | (none) | `m5cardputer_keyboard_caps()` | M5Cardputer.Keyboard.capslocked() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| KEY | tab, fn, shift, ctrl, opt, alt, backspace, del, enter, space, esc, up, down, left, right, f1, f2, f3, f4, f5, ... | m5cardputer_keyboard_special |

## ABS Examples

### Basic Usage
```
arduino_setup()
    m5cardputer_keyboard_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, m5cardputer_keyboard_any())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Change detection**: the wrapper compares the full physical key coordinate set because the upstream `isChange()` only compares the pressed-key count.

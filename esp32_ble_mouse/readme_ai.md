# BLE bluetooth mouse

BLE mouse library for ESP32, supporting mouse movement, click, wheel and other operations

## Library Info
- **Name**: @aily-project/lib-esp32-ble-mouse
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ble_mouse_init` | Statement | DEVICE_NAME(input_value), MANUFACTURER(input_value), BATTERY(input_value) | `ble_mouse_init(text("value"), text("value"), math_number(0))` | Dynamic code |
| `ble_mouse_is_connected` | Value | (none) | `ble_mouse_is_connected()` | compositeHID.isConnected() |
| `ble_mouse_move` | Statement | X(input_value), Y(input_value) | `ble_mouse_move(math_number(0), math_number(0))` | if(mouse != nullptr && compositeHID.isConnected()) {\n |
| `ble_mouse_click` | Statement | BUTTON(dropdown), ACTION(dropdown) | `ble_mouse_click(MOUSE_LOGICAL_LEFT_BUTTON, press)` | if(mouse != nullptr && compositeHID.isConnected()) {\n |
| `ble_mouse_scroll` | Statement | SCROLL(input_value) | `ble_mouse_scroll(math_number(0))` | if(mouse != nullptr && compositeHID.isConnected()) {\n |
| `ble_mouse_send_report` | Statement | (none) | `ble_mouse_send_report()` | if(mouse != nullptr && compositeHID.isConnected()) {\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BUTTON | MOUSE_LOGICAL_LEFT_BUTTON, MOUSE_LOGICAL_RIGHT_BUTTON, MOUSE_LOGICAL_MIDDLE_BUTTON | ble_mouse_click |
| ACTION | press, release, click | ble_mouse_click |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ble_mouse_init(text("value"), text("value"), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ble_mouse_is_connected())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# USB Host Shield Library 2.0

MAX3421E-based USB Host Shield library for USB devices, hubs, HID, Bluetooth, and game controllers.

## Library Info

- **Name**: @aily-project/lib-usb-host-shield-2-0
- **Version**: 1.0.0
- **Upstream Version**: 1.7.0
- **Source**: https://github.com/felis/USB_Host_Shield_2.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `usbhost_begin` | Statement | HALT(checkbox) | `usbhost_begin(TRUE)` | USB Usb; Usb.Init(); Usb.Task(); |
| `usbhost_task` | Statement | (none) | `usbhost_task()` | See generator.js |
| `usbhost_ps4_begin` | Statement | HALT(checkbox) | `usbhost_ps4_begin(TRUE)` | See generator.js |
| `usbhost_ps4_connected` | Value | (none) | `usbhost_ps4_connected()` | See generator.js |
| `usbhost_ps4_button` | Value | BUTTON(dropdown), MODE(dropdown) | `usbhost_ps4_button(CROSS, getButtonClick)` | See generator.js |
| `usbhost_ps4_hat` | Value | HAT(dropdown) | `usbhost_ps4_hat(LeftHatX)` | See generator.js |
| `usbhost_ps4_rumble` | Statement | LOW(value), HIGH(value) | `usbhost_ps4_rumble(math_number(1), math_number(1))` | See generator.js |
| `usbhost_ps4_led` | Statement | COLOR(dropdown) | `usbhost_ps4_led(Red)` | See generator.js |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BUTTON | CROSS, CIRCLE, SQUARE, TRIANGLE, UP, DOWN, LEFT, RIGHT, L1, R1, SHARE, OPTIONS, PS, TOUCHPAD | PS4 button constant. |
| MODE | getButtonClick, getButtonPress | Read click event or held state. |

## Notes

1. The core begin block initializes the MAX3421E host shield and adds Usb.Task() to loop.
2. The PS4 blocks target USB-connected PS4 controllers. Other controller families can be added using the same pattern.
3. Include SPI wiring and host shield power requirements in hardware setup.

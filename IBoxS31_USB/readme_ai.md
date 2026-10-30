# IBox S31 USB Host

IBox S31 USB-A host port: read a USB keyboard and mouse, read and write files on a USB drive

## Library Info
- **Name**: @aily-project/lib-iboxs31_usb
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `iboxs31_usbhost_init` | Statement | VBUS(dropdown) | `iboxs31_usbhost_init(true)` | `iboxs31_usbhost.begin(true, Wire, 0, 1);` |
| `iboxs31_usbhost_vbus` | Statement | STATE(dropdown) | `iboxs31_usbhost_vbus(true)` | `IBoxS31_USBHost::setVbus(true);` |
| `iboxs31_usbhost_state` | Value | WHAT(dropdown) | `iboxs31_usbhost_state(STARTED)` | `iboxs31_usbhost.started()` |
| `iboxs31_usbhost_value` | Value | WHAT(dropdown) | `iboxs31_usbhost_value(MX)` | `(iboxs31_usbhost_snap().mouse_x - iboxs31_usbhost_mouse_x0)` |
| `iboxs31_usbhost_mouse_zero` | Statement | (none) | `iboxs31_usbhost_mouse_zero()` | `{ ↵ IBoxS31_USBSnapshot s = iboxs31_usbhost_snap(); ↵ iboxs31_usbhost_mouse_x0 = s.mouse_x; ↵ iboxs31_usbhost_mouse_y0 = s.mouse_y; ↵ iboxs31_usbhost_mouse_w0 = s.mouse_wheel; ↵ }` |
| `iboxs31_usbhost_new_key` | Value | (none) | `iboxs31_usbhost_new_key()` | `(int)IBoxS31_USBHost::nextKey()` |
| `iboxs31_usbhost_key_char` | Value | CODE(input_value) | `iboxs31_usbhost_key_char(math_number(0))` | `iboxs31_usbhost_chr(IBoxS31_USBHost::lastKeyChar((uint8_t)(0)))` |
| `iboxs31_usbhost_key_name` | Value | CODE(input_value) | `iboxs31_usbhost_key_name(math_number(0))` | `IBoxS31_USBHost::keyName((uint8_t)(0))` |
| `iboxs31_usbhost_new_char` | Value | (none) | `iboxs31_usbhost_new_char()` | `iboxs31_usbhost_chr(IBoxS31_USBHost::nextChar())` |
| `iboxs31_usbhost_key_held` | Value | KEY(dropdown) | `iboxs31_usbhost_key_held(ENTER)` | `IBoxS31_USBHost::keyHeld(0x28)` |
| `iboxs31_usbhost_typing` | Value | (none) | `iboxs31_usbhost_typing()` | `IBoxS31_USBHost::typing()` |
| `iboxs31_usbhost_line_ready` | Value | (none) | `iboxs31_usbhost_line_ready()` | `IBoxS31_USBHost::lineReady()` |
| `iboxs31_usbhost_read_line` | Value | (none) | `iboxs31_usbhost_read_line()` | `IBoxS31_USBHost::takeLine()` |
| `iboxs31_usbhost_clear_input` | Statement | (none) | `iboxs31_usbhost_clear_input()` | `IBoxS31_USBHost::clearInput();` |
| `iboxs31_usbhost_text` | Value | WHAT(dropdown) | `iboxs31_usbhost_text(DEVICE)` | `String(iboxs31_usbhost_snap().device)` |
| `iboxs31_usbhost_file_write` | Statement | MODE(dropdown), PATH(input_value), TEXT(input_value) | `iboxs31_usbhost_file_write(WRITE, text("value"), text("value"))` | `iboxs31_usbhost_file_write(String("value"), String("value"), false);` |
| `iboxs31_usbhost_file_read` | Value | PATH(input_value) | `iboxs31_usbhost_file_read(text("value"))` | `iboxs31_usbhost_file_read(String("value"))` |
| `iboxs31_usbhost_file_exists` | Value | PATH(input_value) | `iboxs31_usbhost_file_exists(text("value"))` | `iboxs31_usbhost_file_exists(String("value"))` |
| `iboxs31_usbhost_file_remove` | Statement | PATH(input_value) | `iboxs31_usbhost_file_remove(text("value"))` | `if (iboxs31_usbhost.mscMounted()) remove(iboxs31_usbhost_path(String("value")).c_str());` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| VBUS | true, false | iboxs31_usbhost_init |
| STATE | true, false | iboxs31_usbhost_vbus |
| WHAT | STARTED, CONNECTED, MSC, LEFT, RIGHT, CHANGED, VBUS, MIDDLE, BACK, FORWARD | iboxs31_usbhost_state |
| WHAT | MX, MY, KEY, INPUTS, CONNECTS, MSC_MB, MSC_FILES, WHEEL | iboxs31_usbhost_value |
| KEY | ENTER, SPACE, ESC, BACKSPACE, TAB, UP, DOWN, LEFT, RIGHT, SHIFT, CTRL, ALT, F1, F2, F3, F4, F5, F6, F7, F8, ... | iboxs31_usbhost_key_held |
| WHAT | DEVICE, INPUT, STATUS, MSC_INFO, RAW | iboxs31_usbhost_text |
| MODE | WRITE, APPEND | iboxs31_usbhost_file_write |

## ABS Examples

### Echo what is typed, print whole lines on Enter, Ctrl+L clears; report mouse clicks
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    iboxs31_usbhost_init(true)

arduino_loop()
    serial_print(Serial, iboxs31_usbhost_new_char())
    controls_if()
        @IF0: iboxs31_usbhost_line_ready()
        @DO0:
            serial_println(Serial, text_join(ADD0=text("line: "), ADD1=iboxs31_usbhost_read_line()))
    controls_if()
        @IF0: logic_operation(iboxs31_usbhost_key_held(CTRL), AND, iboxs31_usbhost_key_held(L))
        @DO0:
            iboxs31_usbhost_clear_input()
    controls_if()
        @IF0: iboxs31_usbhost_state(LEFT)
        @DO0:
            serial_println(Serial, text_join(ADD0=text("click at "), ADD1=iboxs31_usbhost_value(MX), ADD2=text(","), ADD3=iboxs31_usbhost_value(MY)))
    time_delay(math_number(20))
```

### Log uptime to a USB drive when it is plugged in
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    iboxs31_usbhost_init(true)

arduino_loop()
    controls_if()
        @IF0: iboxs31_usbhost_state(CHANGED)
        @DO0:
            serial_println(Serial, iboxs31_usbhost_text(MSC_INFO))
            controls_if()
                @IF0: iboxs31_usbhost_state(MSC)
                @DO0:
                    iboxs31_usbhost_file_write(APPEND, text("/log.txt"), text_join(ADD0=time_millis(), ADD1=text(";")))
                    serial_println(Serial, iboxs31_usbhost_file_read(text("/log.txt")))
    time_delay(math_number(200))
```

## Notes

1. **Board**: IBox S31 only (Aily board IBOX S31, ESP32-S31, Arduino-ESP32 4.0.0). USB Mode must not be "USB-OTG (TinyUSB)"; the board default (Hardware CDC) works. USB-A 5 V is switched by the XL9555 at I2C 0x27 pin P07 (SDA=IO0, SCL=IO1); the IBoxS31_Buttons keys only read P00–P06 of it.
2. **Devices**: a keyboard and/or mouse (boot protocol; combo wireless receivers work) and one FAT32/FAT16 USB drive mounted at `/usb`; hubs are not supported. File paths in the blocks start at the drive root, so `/log.txt` means `/usb/log.txt`; at most 3 files can be open at once.
3. **Keyboard**: new keys and typed characters are queued separately (32 each), so `iboxs31_usbhost_new_key` and `iboxs31_usbhost_new_char` lose nothing; characters follow a US layout with Shift and Caps Lock. The line blocks collect typed text until Enter (Backspace deletes); `iboxs31_usbhost_key_held` reports keys and Shift/Ctrl/Alt held right now.
4. **Mouse**: X/Y and the wheel add up movement since start or the last `iboxs31_usbhost_mouse_zero`. Reports are decoded from the device's report descriptor (report IDs, 12/16-bit axes), falling back to the boot format; `iboxs31_usbhost_text(RAW)` shows the last raw report in hex.
5. **Changed**: `iboxs31_usbhost_state(CHANGED)` shares one signature, so use it in one place; the first read is true.

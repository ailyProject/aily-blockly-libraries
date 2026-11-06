# ESP32 USB Host

ESP32 USB host: read a USB keyboard and mouse, read and write USB drive files; port power is up to the board

## Library Info
- **Name**: @aily-project/lib-esp32-usb-host
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_usb_host_init` | Statement | (none) | `esp32_usb_host_init()` | `esp32_usb_host.begin();` |
| `esp32_usb_host_state` | Value | WHAT(dropdown) | `esp32_usb_host_state(STARTED)` | `esp32_usb_host.started()` |
| `esp32_usb_host_value` | Value | WHAT(dropdown) | `esp32_usb_host_value(MX)` | `(esp32_usb_host_snap().mouse_x - esp32_usb_host_mouse_x0)` |
| `esp32_usb_host_mouse_zero` | Statement | (none) | `esp32_usb_host_mouse_zero()` | `{ ↵ ESP32USBSnapshot s = esp32_usb_host_snap(); ↵ esp32_usb_host_mouse_x0 = s.mouse_x; ↵ esp32_usb_host_mouse_y0 = s.mouse_y; ↵ esp32_usb_host_mouse_w0 = s.mouse_wheel; ↵ }` |
| `esp32_usb_host_new_key` | Value | (none) | `esp32_usb_host_new_key()` | `(int)ESP32USBHost::nextKey()` |
| `esp32_usb_host_key_char` | Value | CODE(input_value) | `esp32_usb_host_key_char(math_number(0))` | `esp32_usb_host_chr(ESP32USBHost::lastKeyChar((uint8_t)(0)))` |
| `esp32_usb_host_key_name` | Value | CODE(input_value) | `esp32_usb_host_key_name(math_number(0))` | `ESP32USBHost::keyName((uint8_t)(0))` |
| `esp32_usb_host_new_char` | Value | (none) | `esp32_usb_host_new_char()` | `esp32_usb_host_chr(ESP32USBHost::nextChar())` |
| `esp32_usb_host_key_held` | Value | KEY(dropdown) | `esp32_usb_host_key_held(ENTER)` | `ESP32USBHost::keyHeld(0x28)` |
| `esp32_usb_host_typing` | Value | (none) | `esp32_usb_host_typing()` | `ESP32USBHost::typing()` |
| `esp32_usb_host_line_ready` | Value | (none) | `esp32_usb_host_line_ready()` | `ESP32USBHost::lineReady()` |
| `esp32_usb_host_read_line` | Value | (none) | `esp32_usb_host_read_line()` | `ESP32USBHost::takeLine()` |
| `esp32_usb_host_clear_input` | Statement | (none) | `esp32_usb_host_clear_input()` | `ESP32USBHost::clearInput();` |
| `esp32_usb_host_text` | Value | WHAT(dropdown) | `esp32_usb_host_text(DEVICE)` | `String(esp32_usb_host_snap().device)` |
| `esp32_usb_host_file_write` | Statement | MODE(dropdown), PATH(input_value), TEXT(input_value) | `esp32_usb_host_file_write(WRITE, text("value"), text("value"))` | `esp32_usb_host_file_write(String("value"), String("value"), false);` |
| `esp32_usb_host_file_read` | Value | PATH(input_value) | `esp32_usb_host_file_read(text("value"))` | `esp32_usb_host_file_read(String("value"))` |
| `esp32_usb_host_file_exists` | Value | PATH(input_value) | `esp32_usb_host_file_exists(text("value"))` | `esp32_usb_host_file_exists(String("value"))` |
| `esp32_usb_host_file_remove` | Statement | PATH(input_value) | `esp32_usb_host_file_remove(text("value"))` | `if (esp32_usb_host.mscMounted()) remove(esp32_usb_host_path(String("value")).c_str());` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WHAT | STARTED, CONNECTED, MSC, LEFT, RIGHT, CHANGED, MIDDLE, BACK, FORWARD | esp32_usb_host_state |
| WHAT | MX, MY, KEY, INPUTS, CONNECTS, MSC_MB, MSC_FILES, WHEEL | esp32_usb_host_value |
| KEY | ENTER, SPACE, ESC, BACKSPACE, TAB, UP, DOWN, LEFT, RIGHT, SHIFT, CTRL, ALT, F1, F2, F3, F4, F5, F6, F7, F8, ... | esp32_usb_host_key_held |
| WHAT | DEVICE, INPUT, STATUS, MSC_INFO, RAW | esp32_usb_host_text |
| MODE | WRITE, APPEND | esp32_usb_host_file_write |

## ABS Examples

### IBox S31: power the USB-A port, echo typing, Ctrl+L clears, report mouse clicks
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    xl9555_init(0x27)
    xl9555_name_pin(7, "usb_power", OUTPUT)
    xl9555_write($usb_power, HIGH)
    esp32_usb_host_init()

arduino_loop()
    serial_print(Serial, esp32_usb_host_new_char())
    controls_if()
        @IF0: esp32_usb_host_line_ready()
        @DO0:
            serial_println(Serial, text_join(ADD0=text("line: "), ADD1=esp32_usb_host_read_line()))
    controls_if()
        @IF0: logic_operation(esp32_usb_host_key_held(CTRL), AND, esp32_usb_host_key_held(L))
        @DO0:
            esp32_usb_host_clear_input()
    controls_if()
        @IF0: esp32_usb_host_state(LEFT)
        @DO0:
            serial_println(Serial, text_join(ADD0=text("click at "), ADD1=esp32_usb_host_value(MX), ADD2=text(","), ADD3=esp32_usb_host_value(MY)))
    time_delay(math_number(20))
```

### IBox S31: log uptime to a USB drive when it is plugged in
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    xl9555_init(0x27)
    xl9555_name_pin(7, "usb_power", OUTPUT)
    xl9555_write($usb_power, HIGH)
    esp32_usb_host_init()

arduino_loop()
    controls_if()
        @IF0: esp32_usb_host_state(CHANGED)
        @DO0:
            serial_println(Serial, esp32_usb_host_text(MSC_INFO))
            controls_if()
                @IF0: esp32_usb_host_state(MSC)
                @DO0:
                    esp32_usb_host_file_write(APPEND, text("/log.txt"), text_join(ADD0=time_millis(), ADD1=text(";")))
                    serial_println(Serial, esp32_usb_host_file_read(text("/log.txt")))
    time_delay(math_number(200))
```

## Notes

1. **Boards**: ESP32-S31 only for now (Arduino-ESP32 4.0.0); USB Mode must not be "USB-OTG (TinyUSB)", the default Hardware CDC works. The library starts the USB host but never powers the port. IBox S31: the USB-A 5 V is switched by XL9555 (0x27) pin P07, so name P07 as output and write it high with the XL9555 library before plugging in, as in the examples.
2. **Devices**: a keyboard and/or mouse (combo wireless receivers work) and one FAT32/FAT16 USB drive mounted at `/usb`; hubs are not supported. File paths in the blocks start at the drive root, so `/log.txt` means `/usb/log.txt`; at most 3 files can be open at once.
3. **Keyboard**: new keys and typed characters are queued separately (32 each), so `esp32_usb_host_new_key` and `esp32_usb_host_new_char` lose nothing; characters follow a US layout with Shift and Caps Lock. The line blocks collect typed text until Enter (Backspace deletes); `esp32_usb_host_key_held` reports keys and Shift/Ctrl/Alt held right now.
4. **Mouse**: X/Y and the wheel add up movement since start or the last `esp32_usb_host_mouse_zero`. Reports are decoded from the device’s report descriptor (report IDs, 12/16-bit axes), falling back to the boot format; `esp32_usb_host_text(RAW)` shows the last raw report in hex. `esp32_usb_host_state(CHANGED)` shares one signature, so use it in one place; the first read is true.

# ESP32 USB Soft Host

Software USB low-speed host blocks for ESP32 GPIO pins.

## Library Info
- **Name**: @aily-project/lib-esp32-usb-soft-host
- **Version**: 0.1.5

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_usb_soft_host_begin` | Statement | DP0, DM0, DP1, DM1, DP2, DM2, DP3, DM3 | `esp32_usb_soft_host_begin(math_number(16), math_number(17), math_number(-1), math_number(-1), math_number(-1), math_number(-1), math_number(-1), math_number(-1))` | `usb_pins_config_t ...; USH.init(...)` |
| `esp32_usb_soft_host_task_options` | Statement | CORE, PRIORITY, BLINK_PIN, ISR_FLAG | `esp32_usb_soft_host_task_options(1, math_number(5), math_number(22), ESP_INTR_FLAG_IRAM)` | `USH.setTaskCore(...);` |
| `esp32_usb_soft_host_descriptor_log` | Statement | none | `esp32_usb_soft_host_descriptor_log()` | attaches default descriptor callbacks |
| `esp32_usb_soft_host_on_detect` | Statement | PORT_VAR, VENDOR_VAR, PRODUCT_VAR, CLASS_VAR, HANDLER | `esp32_usb_soft_host_on_detect("usbPort", "usbVendorId", "usbProductId", "usbDeviceClass") @HANDLER: ...` | registers `USH.setOndetectCb(...)` |
| `esp32_usb_soft_host_on_disconnect` | Statement | PORT_VAR, HANDLER | `esp32_usb_soft_host_on_disconnect("usbPort") @HANDLER: ...` | registers `USH.setOndisconnectCb(...)` |
| `esp32_usb_soft_host_on_data` | Statement | PORT_VAR, LEN_VAR, HEX_VAR, HANDLER | `esp32_usb_soft_host_on_data("usbPort", "usbDataLength", "usbDataHex") @HANDLER: ...` | registers `USH.setPrintCb(...)` |
| `esp32_usb_soft_host_on_tick` | Statement | HANDLER | `esp32_usb_soft_host_on_tick() @HANDLER: ...` | registers `USH.setTaskTicker(...)` |
| `esp32_usb_soft_host_timer` | Statement | ACTION | `esp32_usb_soft_host_timer(PAUSE)` | `USH.TimerPause();` or `USH.TimerResume();` |
| `esp32_usb_soft_host_last_value` | Value Number | VALUE | `esp32_usb_soft_host_last_value(PORT)` | last event numeric state |
| `esp32_usb_soft_host_last_data_hex` | Value String | none | `esp32_usb_soft_host_last_data_hex()` | last HID bytes as hex text |
| `esp32_usb_soft_host_data_byte` | Value Number | INDEX | `esp32_usb_soft_host_data_byte(math_number(0))` | indexed byte from last report |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| CORE | `0`, `1` | FreeRTOS core for the USB host task |
| ISR_FLAG | `ESP_INTR_FLAG_IRAM`, `ESP_INTR_FLAG_LEVEL1`, `ESP_INTR_FLAG_LEVEL2`, `ESP_INTR_FLAG_LEVEL3` | Interrupt allocation flag |
| ACTION | `PAUSE`, `RESUME` | Timer control action |
| VALUE | `PORT`, `LENGTH`, `VENDOR`, `PRODUCT`, `CLASS` | Last-event state field |

## ABS Examples

```text
arduino_setup()
    esp32_usb_soft_host_on_data("usbPort", "usbDataLength", "usbDataHex")
        @HANDLER:
            serial_println(Serial, variables_get($usbDataHex))
    esp32_usb_soft_host_begin(math_number(16), math_number(17), math_number(-1), math_number(-1), math_number(-1), math_number(-1), math_number(-1), math_number(-1))
```

## Notes

Use `-1` for unused D+/D- pairs. Event blocks should be placed before initialization when possible.

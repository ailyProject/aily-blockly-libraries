# Fingerprint identification library

Fingerprint recognition support library based on Adafruit_Fingerprint library, supports Arduino UNO, MEGA, ESP8266, ESP32 and other development boards

## Library Info
- **Name**: @aily-project/lib-adafruit-fingerprint
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `fingerprint_begin` | Statement | BAUDRATE(field_number) | `fingerprint_begin(57600)` | Dynamic code |
| `fingerprint_verify` | Value | (none) | `fingerprint_verify()` | finger.verifyPassword() |
| `fingerprint_get_image` | Value | (none) | `fingerprint_get_image()` | finger.getImage() |
| `fingerprint_image2Tz` | Value | SLOT(field_number) | `fingerprint_image2Tz(1)` | finger.image2Tz( |
| `fingerprint_create_model` | Value | (none) | `fingerprint_create_model()` | finger.createModel() |
| `fingerprint_store_model` | Statement | ID(field_number) | `fingerprint_store_model(1)` | finger.storeModel( |
| `fingerprint_delete_model` | Statement | ID(field_number) | `fingerprint_delete_model(1)` | finger.deleteModel( |
| `fingerprint_finger_fast_search` | Value | (none) | `fingerprint_finger_fast_search()` | finger.fingerFastSearch() |
| `fingerprint_LEDcontrol` | Statement | STATE(dropdown) | `fingerprint_LEDcontrol(ON)` | finger.LEDcontrol( |
| `fingerprint_get_template_count` | Value | (none) | `fingerprint_get_template_count()` | finger.getTemplateCount() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STATE | ON, OFF | fingerprint_LEDcontrol |

## ABS Examples

### Basic Usage
```
arduino_setup()
    fingerprint_begin(57600)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, fingerprint_verify())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

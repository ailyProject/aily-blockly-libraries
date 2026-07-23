# CoreS3 Onboard Sensors

## Library Info
- **Name**: @aily-project/lib-m5stack-cores3
- **Version**: 0.1.0
- **Official source**: M5CoreS3 1.0.1

## Blocks

| Block | Connection | ABS |
|---|---|---|
| `m5cores3_ltr_init` | Statement | `m5cores3_ltr_init()` |
| `m5cores3_ltr_available` | Boolean | `m5cores3_ltr_available()` |
| `m5cores3_ltr_value` | Number | `m5cores3_ltr_value(PROXIMITY)` |
| `m5cores3_camera_init` | Statement | `m5cores3_camera_init()` |
| `m5cores3_camera_available` | Boolean | `m5cores3_camera_available()` |
| `m5cores3_camera_capture_display` | Boolean | `m5cores3_camera_capture_display()` |

Do not combine camera initialization with LTR access: the official GC0308 driver releases M5Unified's internal I2C bus for SCCB ownership.

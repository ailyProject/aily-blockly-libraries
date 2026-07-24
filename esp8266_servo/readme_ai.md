# ESP8266 Servo

Servo control using the ESP8266 built-in Servo implementation.

## Library Info
- **Name**: @aily-project/lib-esp8266-servo
- **Version**: 1.0.0
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_servo_write` | Statement | PIN(field_dropdown), ANGLE(input_value) | `esp8266_servo_write(PIN, ANGLE)` | Dynamic code |
| `esp8266_servo_read` | Value | PIN(field_dropdown) | `esp8266_servo_read(PIN)` | Dynamic code |
| `esp8266_servo_angle` | Value | ANGLE(field_angle180) | `esp8266_servo_angle(ANGLE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_servo_write.PIN | board-provided options | Selects the generated API option. |
| esp8266_servo_read.PIN | board-provided options | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.

# HomeSpan

HomeKit Accessory Protocol implementation for ESP32 on Arduino.

## Library Info

- **Name**: @aily-project/lib-homespan
- **Version**: 1.0.0
- **Upstream Version**: 2.1.8
- **Source**: https://github.com/HomeSpan/HomeSpan

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `homespan_begin` | Statement | CATEGORY(dropdown), NAME(value), SERIAL(checkbox) | `homespan_begin(Category::Lighting, text("value"), TRUE)` | See generator.js |
| `homespan_poll` | Statement | (none) | `homespan_poll()` | See generator.js |
| `homespan_accessory_info` | Statement | NAME(value), MANUFACTURER(value), MODEL(value) | `homespan_accessory_info(text("value"), text("value"), text("value"))` | See generator.js |
| `homespan_lightbulb_service` | Statement | ON(checkbox) | `homespan_lightbulb_service(FALSE)` | See generator.js |
| `homespan_led_lightbulb_service` | Statement | PIN(value) | `homespan_led_lightbulb_service(math_number(1))` | See generator.js |
| `homespan_outlet_service` | Statement | ON(checkbox) | `homespan_outlet_service(FALSE)` | See generator.js |
| `homespan_set_pairing_code` | Statement | CODE(input) | `homespan_set_pairing_code("11122333")` | See generator.js |
| `homespan_set_qr_id` | Statement | QRID(input) | `homespan_set_qr_id("HSPN")` | See generator.js |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| CATEGORY | Category::Lighting, Bridges, Fans, Outlets, Sensors, Switches | HomeKit accessory category. |

## Notes

1. HomeSpan is ESP32-only.
2. Create at least one accessory information block before service blocks in each accessory.
3. The LED lightbulb helper implements update() and writes On state to the selected pin.

# Blynk

Connect Arduino-compatible boards to Blynk Cloud for IoT dashboards, virtual pins, and events.

## Library Info

- **Name**: @aily-project/lib-blynk
- **Version**: 1.0.0
- **Source**: https://github.com/blynk-technologies/blynk-library
- **Global object**: `Blynk`

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `blynk_setup_wifi` | Statement | TEMPLATE_ID(field_input), TEMPLATE_NAME(field_input), AUTH(field_input), SSID(input_value), PASS(input_value), TRANSPORT(dropdown), SERVER(input_value), PORT(input_value), DEBUG(field_checkbox) | `blynk_setup_wifi("TMPxxxxxx", "Device", "token", text("ssid"), text("pass"), AUTO, text("blynk.cloud"), math_number(80), TRUE)` | `Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass, server, port);` |
| `blynk_setup_ethernet` | Statement | TEMPLATE_ID(field_input), TEMPLATE_NAME(field_input), AUTH(field_input), SERVER(input_value), PORT(input_value), DISABLE_SD(field_checkbox), DEBUG(field_checkbox) | `blynk_setup_ethernet("TMPxxxxxx", "Device", "token", text("blynk.cloud"), math_number(80), TRUE, TRUE)` | `Blynk.begin(BLYNK_AUTH_TOKEN, server, port);` |
| `blynk_run` | Statement | (none) | `blynk_run()` | `Blynk.run();` |
| `blynk_connected` | Value | (none) | `blynk_connected()` | `Blynk.connected()` |
| `blynk_connect` | Value | TIMEOUT(input_value) | `blynk_connect(math_number(30000))` | `Blynk.connect(30000)` |
| `blynk_disconnect` | Statement | (none) | `blynk_disconnect()` | `Blynk.disconnect();` |
| `blynk_virtual_write` | Statement | VPIN(field_number), VALUE(input_value) | `blynk_virtual_write(5, math_number(42))` | `Blynk.virtualWrite(V5, 42);` |
| `blynk_sync_virtual` | Statement | VPIN(field_number) | `blynk_sync_virtual(1)` | `Blynk.syncVirtual(V1);` |
| `blynk_sync_all` | Statement | (none) | `blynk_sync_all()` | `Blynk.syncAll();` |
| `blynk_set_property` | Statement | VPIN(field_number), PROPERTY(dropdown), VALUE(input_value) | `blynk_set_property(5, label, text("Temperature"))` | `Blynk.setProperty(V5, "label", "Temperature");` |
| `blynk_log_event` | Statement | EVENT(input_value), DESCRIPTION(input_value) | `blynk_log_event(text("overheat"), text("Too hot"))` | `Blynk.logEvent("overheat", "Too hot");` |
| `blynk_resolve_event` | Statement | EVENT(input_value), MODE(dropdown) | `blynk_resolve_event(text("overheat"), ONE)` | `Blynk.resolveEvent("overheat");` |
| `blynk_on_virtual_write` | Hat | VPIN(field_number), VALUE_TYPE(dropdown), VAR(field_input), DO(input_statement) | `blynk_on_virtual_write(1, INT, "blynkValue") @DO: action()` | `BLYNK_WRITE(V1) { int blynkValue = param.asInt(); ... }` |
| `blynk_on_connected` | Hat | DO(input_statement) | `blynk_on_connected() @DO: action()` | `BLYNK_CONNECTED() { ... }` |
| `blynk_param_int` | Value | (none) | `blynk_param_int()` | `param.asInt()` |
| `blynk_param_float` | Value | (none) | `blynk_param_float()` | `param.asFloat()` |
| `blynk_param_string` | Value | (none) | `blynk_param_string()` | `String(param.asStr())` |
| `blynk_timer_every` | Hat | INTERVAL(input_value), DO(input_statement) | `blynk_timer_every(math_number(1000)) @DO: action()` | `BlynkTimer` callback plus `blynkTimer.run();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TRANSPORT | AUTO, ESP32, ESP8266, WIFI_NINA, ARDUINO_WIFI | WiFi include/transport selection. |
| DEBUG, DISABLE_SD | TRUE, FALSE | Checkbox options. |
| PROPERTY | label, color, min, max, isDisabled, onLabel, offLabel | Blynk widget property name. |
| MODE | ONE, ALL | Resolve latest event or all events. |
| VALUE_TYPE | INT, FLOAT, DOUBLE, STRING | Incoming virtual pin value conversion. |

## Notes

1. Use one setup block before any Blynk operation. Setup blocks add template macros, transport includes, and `Blynk.run()` in loop.
2. Virtual pins are field numbers and generate `Vn` constants, for example `V5`.
3. Use `blynk_timer_every` for repeated virtual writes instead of sending every loop iteration.
4. `blynk_param_*` blocks are only valid inside `blynk_on_virtual_write`.

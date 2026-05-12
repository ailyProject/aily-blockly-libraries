# ArduinoOTA

ArduinoOTA network firmware update blocks with a simplified OTA workflow.

## Library Info
- **Name**: @aily-project/lib-arduinoota
- **Version**: 1.1.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `arduinoota_config_begin` | Statement | none | `arduinoota_config_begin()` | Registers standard PC event callbacks, starts OTA with `WiFi.localIP()`, name `Arduino`, password `password`, and automatically injects `ArduinoOTA.poll();` into `loop()`. |
| `arduinoota_end` | Statement | none | `arduinoota_end()` | `ArduinoOTA.end();` |
| `arduinoota_poll` | Hidden legacy statement | none | `arduinoota_poll()` | `ArduinoOTA.poll();` |
| `arduinoota_on_start` | Hidden legacy hat | HANDLER(input_statement) | `arduinoota_on_start() @HANDLER: ...` | `ArduinoOTA.onStart(callback);` |
| `arduinoota_before_apply` | Hidden legacy hat | HANDLER(input_statement) | `arduinoota_before_apply() @HANDLER: ...` | `ArduinoOTA.beforeApply(callback);` |
| `arduinoota_on_error` | Hidden legacy hat | CODE_VAR(field_input), MESSAGE_VAR(field_input), HANDLER(input_statement) | `arduinoota_on_error("code", "message") @HANDLER: ...` | `ArduinoOTA.onError(callback);` |

## Generated Defaults

- Network mode: `WIFI_AUTO`.
- Port discovery: `MDNS`.
- OTA name: `Arduino`.
- OTA username: `arduino`.
- OTA password: `password`.
- OTA port: `65280`.
- Upload path: `/sketch`.
- PC event channel: `Serial` at `115200`, one JSON object per line.

## ABS Examples

### Basic OTA
```
arduino_setup()
    wifi_connect(text("ssid"), text("password"))
    arduinoota_config_begin()
```

### Stop OTA
```
arduinoota_end()
```

## Notes

1. **Network first**: Connect WiFi before `arduinoota_config_begin`.
2. **Loop polling**: The init block injects `ArduinoOTA.poll();` automatically, so users do not need a poll block.
3. **PC events**: The init block registers start, before-apply, and error callbacks that emit `type: "aily_ota"` JSON lines over Serial.
4. **Hidden blocks**: Manual poll and event blocks remain implemented for old projects but are not shown in the toolbox.
5. **PC integration**: See `use.md` for the IDE-side serial protocol and upload flow.
# Xiaozhi MCP Client

Connect ESP32 boards to a Xiaozhi MCP endpoint over WebSocket, register device tools, read tool-call parameters, and return JSON results.

## Usage

1. Initialize WiFi with SSID and password.
2. Initialize the MCP endpoint, for example `wss://api.xiaozhi.me/mcp/?token=your_token`.
3. Add tool parameters before registering a tool.
4. Register the tool and create a matching "when MCP receives tool call" block.
5. Put "maintain MCP connection" in `loop`.

## Notes

- The wrapped Arduino library is GPLv3 licensed. Keep its license when redistributing.
- Bundles ArduinoJson and WebSockets source files, so users only need to add this library.

# Xiaozhi MCP Client

Connect ESP32 boards to a Xiaozhi MCP endpoint, register tools, read tool-call parameters, and return JSON results.

## Library Info

| Field | Value |
|------|-------|
| Package | `@aily-project/lib-xiaozhi-mcp` |
| Version | `0.0.2` |
| Author | Vonweller |
| License | GPLv3 bundled MCP/WebSocket sources |

## Supported Boards

ESP32 boards supported by the ESP32 Arduino core, including ESP32, S2, S3, C3, C5, and C6 variants.

## Description

This library wraps a WebSocket MCP client for Xiaozhi services. It connects to an MCP endpoint, registers ESP32-side tools, reads incoming parameters, and returns JSON responses.

## Quick Start

1. Initialize WiFi with SSID and password.
2. Initialize the MCP endpoint, for example `wss://api.xiaozhi.me/mcp/?token=your_token`.
3. Add tool parameters before registering a tool.
4. Register the tool and create a matching call handler block.
5. Put "maintain MCP connection" in `loop`.

# WebSockets

WebSocket客户端和服务器库

## 库信息
- **库名**: @aily-project/lib-websockets
- **版本**: 2.7.1
- **兼容**: ESP32/ESP8266/Arduino R4 WiFi/SAMD/RP2040平台

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `websocket_client_create` | 语句块 | VAR(field_input) | `"fields":{"VAR":"wsClient"}` | `WebSocketsClient wsClient; wsClient.begin()` |
| `websocket_client_begin` | 语句块 | VAR(field_variable), HOST/PORT/URL(input_value) | `"fields":{"VAR":{"id":"ws_id","name":"wsClient","type":"WebSocketsClient"}},"inputs":{"HOST":{"block":{"type":"text","fields":{"TEXT":"192.168.1.100"}}},"PORT":{"block":{"type":"math_number","fields":{"NUM":"80"}}}}` | `wsClient.begin(host,port,url)` |
| `websocket_client_begin_ssl` | 语句块 | VAR(field_variable), HOST/PORT/URL(input_value) | `"fields":{"VAR":{"id":"ws_id","name":"wsClient","type":"WebSocketsClient"}},"inputs":{"HOST":{"block":{"type":"text","fields":{"TEXT":"echo.websocket.org"}}}}` | `wsClient.beginSSL(host,port,url)` |
| `websocket_client_on_event` | Hat块 | VAR(field_variable), HANDLER(input_statement) | `"fields":{"VAR":{"id":"ws_id","name":"wsClient","type":"WebSocketsClient"}},"inputs":{"HANDLER":{"block":{...}}}` | `webSocketEvent()+onEvent()` |
| `websocket_client_send_text` | 语句块 | VAR(field_variable), TEXT(input_value) | `"fields":{"VAR":{"id":"ws_id","name":"wsClient","type":"WebSocketsClient"}},"inputs":{"TEXT":{"block":{"type":"text","fields":{"TEXT":"Hello"}}}}` | `wsClient.sendTXT(text)` |
| `websocket_client_send_binary` | 语句块 | VAR(field_variable), DATA(input_value) | `"fields":{"VAR":{"id":"ws_id","name":"wsClient","type":"WebSocketsClient"}},"inputs":{"DATA":{"block":{"type":"text","fields":{"TEXT":"data"}}}}` | `wsClient.sendBIN(data,len)` |
| `websocket_client_disconnect` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ws_id","name":"wsClient","type":"WebSocketsClient"}}` | `wsClient.disconnect()` |
| `websocket_client_is_connected` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ws_id","name":"wsClient","type":"WebSocketsClient"}}` | `wsClient.isConnected()` |
| `websocket_client_set_reconnect` | 语句块 | VAR(field_variable), INTERVAL(input_value) | `"fields":{"VAR":{"id":"ws_id","name":"wsClient","type":"WebSocketsClient"}},"inputs":{"INTERVAL":{"block":{"type":"math_number","fields":{"NUM":"5000"}}}}` | `wsClient.setReconnectInterval(ms)` |
| `websocket_client_enable_heartbeat` | 语句块 | VAR(field_variable), PING_INTERVAL/PONG_TIMEOUT/DISCONNECT_COUNT(input_value) | `"fields":{"VAR":{"id":"ws_id","name":"wsClient","type":"WebSocketsClient"}},"inputs":{"PING_INTERVAL":{"block":{"type":"math_number","fields":{"NUM":"15000"}}}}` | `wsClient.enableHeartbeat(ping,pong,count)` |
| `websocket_server_create` | 语句块 | VAR(field_input), PORT(input_value) | `"fields":{"VAR":"wsServer"},"inputs":{"PORT":{"block":{"type":"math_number","fields":{"NUM":"81"}}}}` | `WebSocketsServer wsServer(81); wsServer.begin()` |
| `websocket_server_begin` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"srv_id","name":"wsServer","type":"WebSocketsServer"}}` | `wsServer.begin()` |
| `websocket_server_on_event` | Hat块 | VAR(field_variable), HANDLER(input_statement) | `"fields":{"VAR":{"id":"srv_id","name":"wsServer","type":"WebSocketsServer"}},"inputs":{"HANDLER":{"block":{...}}}` | `webSocketServerEvent()+onEvent()` |
| `websocket_server_send_text` | 语句块 | VAR(field_variable), CLIENT_NUM/TEXT(input_value) | `"fields":{"VAR":{"id":"srv_id","name":"wsServer","type":"WebSocketsServer"}},"inputs":{"CLIENT_NUM":{"block":{"type":"math_number","fields":{"NUM":"0"}}},"TEXT":{"block":{"type":"text","fields":{"TEXT":"Hello"}}}}` | `wsServer.sendTXT(num,text)` |
| `websocket_server_broadcast_text` | 语句块 | VAR(field_variable), TEXT(input_value) | `"fields":{"VAR":{"id":"srv_id","name":"wsServer","type":"WebSocketsServer"}},"inputs":{"TEXT":{"block":{"type":"text","fields":{"TEXT":"Broadcast"}}}}` | `wsServer.broadcastTXT(text)` |
| `websocket_server_send_binary` | 语句块 | VAR(field_variable), CLIENT_NUM/DATA(input_value) | `"fields":{"VAR":{"id":"srv_id","name":"wsServer","type":"WebSocketsServer"}},"inputs":{"CLIENT_NUM":{"block":{"type":"math_number","fields":{"NUM":"0"}}}}` | `wsServer.sendBIN(num,data,len)` |
| `websocket_server_broadcast_binary` | 语句块 | VAR(field_variable), DATA(input_value) | `"fields":{"VAR":{"id":"srv_id","name":"wsServer","type":"WebSocketsServer"}},"inputs":{"DATA":{"block":{"type":"text","fields":{"TEXT":"data"}}}}` | `wsServer.broadcastBIN(data,len)` |
| `websocket_server_disconnect` | 语句块 | VAR(field_variable), CLIENT_NUM(input_value) | `"fields":{"VAR":{"id":"srv_id","name":"wsServer","type":"WebSocketsServer"}},"inputs":{"CLIENT_NUM":{"block":{"type":"math_number","fields":{"NUM":"0"}}}}` | `wsServer.disconnect(num)` |
| `websocket_server_disconnect_all` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"srv_id","name":"wsServer","type":"WebSocketsServer"}}` | `wsServer.disconnect()` |
| `websocket_server_connected_clients` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"srv_id","name":"wsServer","type":"WebSocketsServer"}}` | `wsServer.connectedClients()` |
| `websocket_server_client_connected` | 值块 | VAR(field_variable), CLIENT_NUM(input_value) | `"fields":{"VAR":{"id":"srv_id","name":"wsServer","type":"WebSocketsServer"}},"inputs":{"CLIENT_NUM":{"block":{"type":"math_number","fields":{"NUM":"0"}}}}` | `wsServer.clientIsConnected(num)` |
| `websocket_event_type` | 值块 | TYPE(field_dropdown) | `"fields":{"TYPE":"WStype_TEXT"}` | `WStype_TEXT` |
| `websocket_event_payload` | 值块 | PAYLOAD(field_dropdown) | `"fields":{"PAYLOAD":"TYPE"}` | `type/payload` |
| `websocket_event_payload_length` | 值块 | 无 | `{}` | `length` |
| `websocket_event_client_num` | 值块 | 无 | `{}` | `num` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "wsClient"` |
| field_variable | WebSocket变量对象 | `"VAR": {"id": "ws_id", "name": "wsClient", "type": "WebSocketsClient"}` |
| field_dropdown | 字符串 | `"TYPE": "WStype_TEXT"` |
| input_value | 块连接 | `"inputs": {"HOST": {"block": {"type": "text", "fields": {"TEXT": "192.168.1.100"}}}}` |
| input_statement | 块连接 | `"inputs": {"HANDLER": {"block": {...}}}` |

## 连接规则

- **语句块**: create/begin/send/disconnect等块有previousStatement/nextStatement,通过`next`字段连接
- **值块**: is_connected/connected_clients/event_type等块有output,连接到`inputs`中,无`next`字段
- **Hat块**: on_event块无连接属性,通过`inputs`的HANDLER连接内部语句
- **特殊规则**: 
  - WebSocketsClient变量类型为"WebSocketsClient",WebSocketsServer类型为"WebSocketsServer"
  - create块生成变量定义和库包含
  - on_event块生成回调函数并自动添加到loop中调用
  - 事件处理块(event_type/payload等)仅在on_event回调中使用

## 使用示例

### WebSocket客户端连接
```json
{
  "type": "websocket_client_create",
  "id": "ws_create",
  "fields": {"VAR": "wsClient"},
  "next": {
    "block": {
      "type": "websocket_client_begin",
      "id": "ws_begin",
      "fields": {"VAR": {"id": "ws_var", "name": "wsClient", "type": "WebSocketsClient"}},
      "inputs": {
        "HOST": {"block": {"type": "text", "id": "host", "fields": {"TEXT": "192.168.1.100"}}},
        "PORT": {"block": {"type": "math_number", "id": "port", "fields": {"NUM": "80"}}},
        "URL": {"block": {"type": "text", "id": "url", "fields": {"TEXT": "/ws"}}}
      }
    }
  }
}
```

### WebSocket客户端事件处理
```json
{
  "type": "websocket_client_on_event",
  "id": "ws_event",
  "fields": {"VAR": {"id": "ws_var", "name": "wsClient", "type": "WebSocketsClient"}},
  "inputs": {
    "HANDLER": {
      "block": {
        "type": "controls_if",
        "id": "check_type",
        "inputs": {
          "IF0": {
            "block": {
              "type": "logic_compare",
              "id": "cmp_type",
              "fields": {"OP": "EQ"},
              "inputs": {
                "A": {"block": {"type": "websocket_event_payload", "id": "evt_type", "fields": {"PAYLOAD": "TYPE"}}},
                "B": {"block": {"type": "websocket_event_type", "id": "text_type", "fields": {"TYPE": "WStype_TEXT"}}}
              }
            }
          },
          "DO0": {
            "block": {
              "type": "serial_println",
              "id": "print_msg",
              "fields": {"SERIAL": "Serial"},
              "inputs": {
                "VAR": {"block": {"type": "websocket_event_payload", "id": "evt_data", "fields": {"PAYLOAD": "PAYLOAD_CHAR"}}}
              }
            }
          }
        }
      }
    }
  }
}
```

### WebSocket服务器创建和广播
```json
{
  "type": "websocket_server_create",
  "id": "srv_create",
  "fields": {"VAR": "wsServer"},
  "inputs": {
    "PORT": {"block": {"type": "math_number", "id": "srv_port", "fields": {"NUM": "81"}}}
  },
  "next": {
    "block": {
      "type": "websocket_server_begin",
      "id": "srv_start",
      "fields": {"VAR": {"id": "srv_var", "name": "wsServer", "type": "WebSocketsServer"}},
      "next": {
        "block": {
          "type": "websocket_server_broadcast_text",
          "id": "broadcast",
          "fields": {"VAR": {"id": "srv_var", "name": "wsServer", "type": "WebSocketsServer"}},
          "inputs": {
            "TEXT": {"block": {"type": "text", "id": "msg", "fields": {"TEXT": "Hello All"}}}
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: WebSocket必须先create再begin,事件处理必须在on_event回调中,块ID必须唯一
2. **连接限制**: create/begin/send是语句块,is_connected/event_type是值块无next字段,on_event是Hat块
3. **变量管理**: 客户端使用WebSocketsClient类型,服务器使用WebSocketsServer类型,支持多实例
4. **常见错误**: ❌ 未create直接使用 ❌ 在回调外使用event块 ❌ SSL连接端口错误 ❌ 变量类型不匹配

## 支持的字段选项
- **TYPE(事件类型)**: "WStype_DISCONNECTED","WStype_CONNECTED","WStype_TEXT","WStype_BIN","WStype_PING","WStype_PONG","WStype_ERROR"
- **PAYLOAD(事件数据)**: "TYPE"(事件类型),"PAYLOAD"(uint8_t*),"PAYLOAD_CHAR"(char*)
- **变量类型**: "WebSocketsClient"(客户端),"WebSocketsServer"(服务器)
- **HOST**: 字符串,服务器域名或IP地址
- **PORT**: 数字,通常HTTP为80,HTTPS为443,WebSocket服务器常用81
- **URL**: 字符串,WebSocket路径,如"/ws"或"/"

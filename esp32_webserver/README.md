# ESP32 WebServer

ESP32 Web服务器库，用于创建HTTP服务器并处理客户端请求。

## 库信息
- **库名**: @aily-project/lib-esp32-webserver
- **版本**: 1.0.0
- **兼容**: ESP32全系列平台

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp32_webserver_create` | 语句块 | VAR(field_input), PORT(field_number) | `"fields":{"VAR":"server","PORT":80}` | `WebServer server(80);` |
| `esp32_webserver_begin` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{...}}` | `server.begin();` |
| `esp32_webserver_stop` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{...}}` | `server.stop();` |
| `esp32_webserver_handle_client` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{...}}` | `server.handleClient();` |
| `esp32_webserver_on` | 语句块 | VAR(field_variable), METHOD(dropdown), PATH(input), HANDLER(statement) | 见下方示例 | `server.on("/", handler);` |
| `esp32_webserver_on_not_found` | 语句块 | VAR(field_variable), HANDLER(statement) | 见下方示例 | `server.onNotFound(handler);` |
| `esp32_webserver_send` | 语句块 | VAR(field_variable), CODE/TYPE/CONTENT(input) | 见下方示例 | `server.send(200, type, content);` |
| `esp32_webserver_send_simple` | 语句块 | VAR(field_variable), CONTENT(input) | `"inputs":{...}` | `server.send(200, "text/plain", content);` |
| `esp32_webserver_send_html` | 语句块 | VAR(field_variable), CONTENT(input) | `"inputs":{...}` | `server.send(200, "text/html", content);` |
| `esp32_webserver_send_json` | 语句块 | VAR(field_variable), CONTENT(input) | `"inputs":{...}` | `server.send(200, "application/json", content);` |
| `esp32_webserver_send_error` | 语句块 | VAR(field_variable), CODE(dropdown), MESSAGE(input) | `"fields":{"CODE":"404"}` | `server.send(404, "text/plain", msg);` |
| `esp32_webserver_uri` | 值块 | VAR(field_variable) | `"fields":{"VAR":{...}}` | `server.uri()` |
| `esp32_webserver_method` | 值块 | VAR(field_variable) | `"fields":{"VAR":{...}}` | `httpMethodToString(server.method())` |
| `esp32_webserver_arg` | 值块 | VAR(field_variable), NAME(input) | `"inputs":{...}` | `server.arg("name")` |
| `esp32_webserver_has_arg` | 值块 | VAR(field_variable), NAME(input) | `"inputs":{...}` | `server.hasArg("name")` |
| `esp32_webserver_authenticate` | 值块 | VAR(field_variable), USERNAME/PASSWORD(input) | `"inputs":{...}` | `server.authenticate(user, pass)` |
| `esp32_webserver_client_ip` | 值块 | VAR(field_variable) | `"fields":{"VAR":{...}}` | `server.client().remoteIP().toString()` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "server"` |
| field_variable | WebServer变量对象 | `"VAR": {"id": "server_id", "name": "server", "type": "WebServer"}` |
| field_number | 数字 | `"PORT": 80` |
| field_dropdown | 字符串 | `"METHOD": "HTTP_GET"` |
| field_checkbox | 布尔值 | `"ENABLE": true` |
| input_value | 块连接 | `"inputs": {"PATH": {"shadow": {...}}}` |
| input_statement | 块连接 | `"inputs": {"HANDLER": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **路由处理块**: 包含内嵌的HANDLER语句块，用于处理请求
- **特殊规则**: 
  - `esp32_webserver_create` 使用 `field_input` 创建变量名
  - 其他块使用 `field_variable` 引用已创建的WebServer对象
  - `handleClient()` 需要在loop中持续调用

## 使用示例

### 创建Web服务器
```json
{
  "type": "esp32_webserver_create",
  "id": "webserver_init",
  "fields": {
    "VAR": "server",
    "PORT": 80
  }
}
```

### 注册路由处理
```json
{
  "type": "esp32_webserver_on",
  "id": "route_handler",
  "fields": {
    "VAR": {"id": "server_id", "name": "server", "type": "WebServer"},
    "METHOD": "HTTP_GET"
  },
  "inputs": {
    "PATH": {
      "shadow": {
        "type": "text",
        "fields": {"TEXT": "/"}
      }
    },
    "HANDLER": {
      "block": {
        "type": "esp32_webserver_send_html",
        "fields": {"VAR": {"id": "server_id", "name": "server", "type": "WebServer"}},
        "inputs": {
          "CONTENT": {
            "shadow": {
              "type": "text",
              "fields": {"TEXT": "<h1>Hello World</h1>"}
            }
          }
        }
      }
    }
  }
}
```

### 完整服务器示例
```json
{
  "type": "arduino_setup",
  "id": "arduino_setup_id0",
  "inputs": {
    "ARDUINO_SETUP": {
      "block": {
        "type": "esp32_webserver_create",
        "id": "ws_create",
        "fields": {"VAR": "server", "PORT": 80},
        "next": {
          "block": {
            "type": "esp32_webserver_on",
            "fields": {"VAR": {"id": "srv"}, "METHOD": "HTTP_GET"},
            "inputs": {
              "PATH": {"shadow": {"type": "text", "fields": {"TEXT": "/"}}},
              "HANDLER": {
                "block": {
                  "type": "esp32_webserver_send_simple",
                  "fields": {"VAR": {"id": "srv"}},
                  "inputs": {
                    "CONTENT": {"shadow": {"type": "text", "fields": {"TEXT": "Hello ESP32!"}}}
                  }
                }
              }
            },
            "next": {
              "block": {
                "type": "esp32_webserver_begin",
                "fields": {"VAR": {"id": "srv"}}
              }
            }
          }
        }
      }
    },
    "ARDUINO_LOOP": {
      "block": {
        "type": "esp32_webserver_handle_client",
        "fields": {"VAR": {"id": "srv"}}
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: 每个块ID必须唯一
2. **变量引用**: 方法调用块必须引用已创建的WebServer变量
3. **持续处理**: `handle_client`块必须放在loop中持续调用
4. **路由注册**: 路由注册（`on`块）应在setup中、`begin`之前完成

## HTTP方法选项
- `HTTP_ANY`: 任意方法
- `HTTP_GET`: GET请求
- `HTTP_POST`: POST请求
- `HTTP_PUT`: PUT请求
- `HTTP_DELETE`: DELETE请求
- `HTTP_PATCH`: PATCH请求
- `HTTP_OPTIONS`: OPTIONS请求

## 常见错误状态码
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error
- `503`: Service Unavailable

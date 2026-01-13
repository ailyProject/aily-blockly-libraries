# Web服务器 (WebServer)

树莓派 Pico W Web服务器库，用于创建HTTP服务器处理GET/POST等请求。

## 库信息
- **库名**: @aily-project/lib-rp-webserver
- **版本**: 1.0.0
- **兼容**: 树莓派 Pico W (rp2040:rp2040)

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `rp_webserver_create` | 语句块 | VAR(field_input), PORT(field_number) | `"VAR":"server","PORT":80` | `WebServer server(80);` |
| `rp_webserver_begin` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `server.begin();` |
| `rp_webserver_handle_client` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `server.handleClient();` |
| `rp_webserver_on` | Hat块 | VAR(field_variable), METHOD(dropdown), PATH(input), HANDLER(statement) | 见示例 | `server.on("/", handler);` |
| `rp_webserver_on_not_found` | Hat块 | VAR(field_variable), HANDLER(statement) | 见示例 | `server.onNotFound(handler);` |
| `rp_webserver_send` | 语句块 | VAR(field_variable), CODE(input), CONTENT_TYPE(dropdown), CONTENT(input) | 见示例 | `server.send(200, "text/plain", "Hello");` |
| `rp_webserver_send_custom_type` | 语句块 | VAR(field_variable), CODE(input), CONTENT_TYPE(input), CONTENT(input) | 见示例 | `server.send(200, type, content);` |
| `rp_webserver_send_header` | 语句块 | VAR(field_variable), NAME(input), VALUE(input) | 见示例 | `server.sendHeader(name, value);` |
| `rp_webserver_uri` | 值块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `server.uri()` |
| `rp_webserver_method` | 值块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `httpMethodToString(server.method())` |
| `rp_webserver_method_is` | 值块 | VAR(field_variable), METHOD(dropdown) | `"METHOD":"HTTP_GET"` | `(server.method() == HTTP_GET)` |
| `rp_webserver_arg_by_name` | 值块 | VAR(field_variable), NAME(input) | 见示例 | `server.arg("name")` |
| `rp_webserver_arg_by_index` | 值块 | VAR(field_variable), INDEX(input) | 见示例 | `server.arg(0)` |
| `rp_webserver_arg_name` | 值块 | VAR(field_variable), INDEX(input) | 见示例 | `server.argName(0)` |
| `rp_webserver_args_count` | 值块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `server.args()` |
| `rp_webserver_has_arg` | 值块 | VAR(field_variable), NAME(input) | 见示例 | `server.hasArg("name")` |
| `rp_webserver_header` | 值块 | VAR(field_variable), NAME(input) | 见示例 | `server.header("name")` |
| `rp_webserver_has_header` | 值块 | VAR(field_variable), NAME(input) | 见示例 | `server.hasHeader("name")` |
| `rp_webserver_host_header` | 值块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `server.hostHeader()` |
| `rp_webserver_collect_headers` | 语句块 | VAR(field_variable), HEADERS(input) | 见示例 | `server.collectHeaders(headers);` |
| `rp_webserver_enable_cors` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `server.enableCORS(true);` |
| `rp_webserver_stop` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `server.stop();` |
| `rp_webserver_authenticate` | 值块 | VAR(field_variable), USERNAME(input), PASSWORD(input) | 见示例 | `server.authenticate(user, pass)` |
| `rp_webserver_request_authentication` | 语句块 | VAR(field_variable), REALM(input) | 见示例 | `server.requestAuthentication(...);` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "server"` |
| field_number | 数字 | `"PORT": 80` |
| field_dropdown | 字符串 | `"METHOD": "HTTP_GET"` |
| field_variable | 对象 | `"VAR": {"id": "var_id"}` |
| input_value | 块连接 | `"inputs": {"PATH": {"shadow": {...}}}` |
| input_statement | 块连接 | `"inputs": {"HANDLER": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **Hat块**: `rp_webserver_on`和`rp_webserver_on_not_found`无连接属性，通过`inputs`连接内部语句
- **变量类型**: WebServer类型变量，`variableTypes: ["WebServer"]`

### HTTP方法选项
- `HTTP_ANY` - 任意方法
- `HTTP_GET` - GET请求
- `HTTP_POST` - POST请求
- `HTTP_PUT` - PUT请求
- `HTTP_DELETE` - DELETE请求
- `HTTP_PATCH` - PATCH请求

### Content-Type选项
- `text/plain` - 纯文本
- `text/html` - HTML页面
- `application/json` - JSON数据
- `application/xml` - XML数据

## 使用示例

### 创建简单Web服务器
```json
{
  "type": "rp_webserver_create",
  "id": "create_id",
  "fields": {"VAR": "server", "PORT": 80}
}
```

### 注册路由处理函数
```json
{
  "type": "rp_webserver_on",
  "id": "on_id",
  "fields": {
    "VAR": {"id": "server_var_id"},
    "METHOD": "HTTP_GET"
  },
  "inputs": {
    "PATH": {
      "shadow": {
        "type": "text",
        "id": "path_id",
        "fields": {"TEXT": "/"}
      }
    },
    "HANDLER": {
      "block": {
        "type": "rp_webserver_send",
        "id": "send_id",
        "fields": {
          "VAR": {"id": "server_var_id"},
          "CONTENT_TYPE": "text/html"
        },
        "inputs": {
          "CODE": {
            "shadow": {"type": "math_number", "id": "code_id", "fields": {"NUM": 200}}
          },
          "CONTENT": {
            "shadow": {"type": "text", "id": "content_id", "fields": {"TEXT": "<h1>Hello!</h1>"}}
          }
        }
      }
    }
  }
}
```

### 完整程序示例（Setup中）
```json
{
  "type": "rp_webserver_create",
  "id": "create_id",
  "fields": {"VAR": "server", "PORT": 80},
  "next": {
    "block": {
      "type": "rp_webserver_begin",
      "id": "begin_id",
      "fields": {"VAR": {"id": "server_var_id"}}
    }
  }
}
```

### Loop中处理请求
```json
{
  "type": "rp_webserver_handle_client",
  "id": "handle_id",
  "fields": {"VAR": {"id": "server_var_id"}}
}
```

## 重要规则

1. **必须遵守**: 
   - `rp_webserver_create`使用`field_input`创建变量
   - 其他块使用`field_variable`引用变量
   - 变量类型必须为`WebServer`

2. **使用顺序**:
   - 先创建服务器 → 注册路由 → 启动服务器 → 循环处理请求

3. **handleClient必须在loop中**:
   - `rp_webserver_handle_client`需放在Arduino loop中持续调用

4. **Hat块特性**:
   - `rp_webserver_on`和`rp_webserver_on_not_found`是Hat块
   - 没有previousStatement/nextStatement
   - 回调函数自动在setup中注册

5. **常见错误**:
   - ❌ 忘记调用`handleClient`导致无法响应请求
   - ❌ 在发送响应前未注册路由
   - ❌ 混淆`field_input`和`field_variable`的使用

## 典型应用场景

- 创建Web控制界面
- API服务器
- 设备状态监控页面
- 表单数据接收处理
- 设备配置网页

# AsyncHTTP 异步HTTP客户端

非阻塞异步HTTP客户端，支持ESP32和Arduino UNO R4 WiFi。

## 库信息
- **库名**: async-http
- **版本**: 1.0.0

## 块定义

| 块类型 | 连接 | 参数 | ABS格式 | 生成代码 |
|--------|------|------|---------|----------|
| `async_http_create` | 语句块 | VAR(field_input) | `async_http_create("http")` | `AsyncHTTP http; http.begin();` |
| `async_http_set_timeout` | 语句块 | VAR(field_variable), TIMEOUT(input_value) | `async_http_set_timeout($http, math_number(15000))` | `http.setTimeout(15000);` |
| `async_http_set_header` | 语句块 | VAR(field_variable), NAME(input_value), VALUE(input_value) | `async_http_set_header($http, text("User-Agent"), text("Bot"))` | `http.setHeader("User-Agent", "Bot");` |
| `async_http_clear_headers` | 语句块 | VAR(field_variable) | `async_http_clear_headers($http)` | `http.clearHeaders();` |
| `async_http_get` | 语句块 | VAR(field_variable), URL(input_value), HANDLER(input_statement) | `async_http_get($http, text("http://api.com"))` + 子块 | `http.get(url, callback);` |
| `async_http_post_json` | 语句块 | VAR(field_variable), URL(input_value), BODY(input_value), HANDLER(input_statement) | `async_http_post_json($http, text("http://api.com"), text("{}"))` + 子块 | `http.postJson(url, body, callback);` |
| `async_http_post` | 语句块 | VAR(field_variable), URL(input_value), BODY(input_value), CONTENT_TYPE(input_value), HANDLER(input_statement) | `async_http_post($http, text("url"), text("data"), text("text/plain"))` + 子块 | `http.post(url, body, ct, callback);` |
| `async_http_put_json` | 语句块 | VAR(field_variable), URL(input_value), BODY(input_value), HANDLER(input_statement) | `async_http_put_json($http, text("url"), text("{}"))` + 子块 | `http.putJson(url, body, callback);` |
| `async_http_del` | 语句块 | VAR(field_variable), URL(input_value), HANDLER(input_statement) | `async_http_del($http, text("url"))` + 子块 | `http.del(url, callback);` |
| `async_http_on_error` | Hat块 | VAR(field_variable), HANDLER(input_statement) | `async_http_on_error($http)` + 子块 | `http.onError(callback);` |
| `async_http_response_status` | 值块 | 无 | `async_http_response_status()` | `_asynchttp_response.statusCode()` |
| `async_http_response_body` | 值块 | 无 | `async_http_response_body()` | `_asynchttp_response.body()` |
| `async_http_response_is_success` | 值块 | 无 | `async_http_response_is_success()` | `_asynchttp_response.isSuccess()` |
| `async_http_response_header` | 值块 | NAME(input_value) | `async_http_response_header(text("Content-Type"))` | `_asynchttp_response.header(name)` |
| `async_http_error_code` | 值块 | 无 | `async_http_error_code()` | `_asynchttp_err_code` |
| `async_http_error_message` | 值块 | 无 | `async_http_error_message()` | `_asynchttp_err_msg` |
| `async_http_pending` | 值块 | VAR(field_variable) | `async_http_pending($http)` | `http.pending()` |
| `async_http_abort_all` | 语句块 | VAR(field_variable) | `async_http_abort_all($http)` | `http.abortAll();` |

**变量说明**: `async_http_create("http")` 自动创建 AsyncHTTP 类型变量，后续通过 `$http` 引用。

## ABS 示例

### 基本GET请求
```
arduino_setup()
    async_http_create("http")
    async_http_set_timeout($http, math_number(15000))
    async_http_get($http, text("http://httpbin.org/get"))
        serial_println(Serial, async_http_response_status())
        serial_println(Serial, async_http_response_body())

async_http_on_error($http)
    serial_print(Serial, text("错误: "))
    serial_println(Serial, async_http_error_message())
```

### POST JSON请求
```
arduino_setup()
    async_http_create("http")
    async_http_post_json($http, text("http://httpbin.org/post"), text("{\"sensor\":\"temp\",\"value\":23.5}"))
        controls_if()
            @IF0: async_http_response_is_success()
            @DO0:
                serial_println(Serial, async_http_response_body())
```

## 注意事项

1. **初始化**: `async_http_create` 必须放在 `arduino_setup()` 中
2. **WiFi**: 使用前需确保WiFi已连接（使用WiFi库块）
3. **回调作用域**: 响应值块(status/body/success/header)仅在请求回调的子块中有效
4. **错误作用域**: 错误值块(error_code/error_message)仅在 `async_http_on_error` 的子块中有效
5. **自动update**: `http.update()` 已自动添加到 `loop()` 中
6. **并发**: 最多支持4个并发请求

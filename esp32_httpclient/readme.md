# esp32_httpclient

ESP32 HTTP客户端库，支持HTTP/HTTPS请求和响应处理

## 库信息
- **库名**: @aily-project/lib-esp32-httpclient
- **版本**: 1.0.0
- **兼容**: ESP32系列平台

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp32_httpclient_create` | 语句块 | VAR(field_input) | `"fields":{"VAR":"http"}` | `HTTPClient http;` |
| `esp32_httpclient_begin_url` | 语句块 | VAR(field_variable), URL(input_value) | `"fields":{"VAR":"http"}, "inputs":{"URL":{}}` | `http.begin(url);` |
| `esp32_httpclient_begin_host` | 语句块 | VAR(field_variable), HOST(input_value), PORT(input_value), URI(input_value) | `"fields":{"VAR":"http"}, "inputs":{"HOST":{},"PORT":{},"URI":{}}` | `http.begin(host, port, uri);` |
| `esp32_httpclient_begin_secure` | 语句块 | VAR(field_variable), URL(input_value), CA_CERT(input_value) | `"fields":{"VAR":"http"}, "inputs":{"URL":{},"CA_CERT":{}}` | `http.begin(url, ca_cert);` |
| `esp32_httpclient_begin_secure_full` | 语句块 | VAR(field_variable), URL(input_value), CA_CERT(input_value), CLIENT_CERT(input_value), CLIENT_KEY(input_value) | `"fields":{"VAR":"http"}, "inputs":{"URL":{},"CA_CERT":{},"CLIENT_CERT":{},"CLIENT_KEY":{}}` | `http.begin(url, ca_cert, client_cert, client_key);` |
| `esp32_httpclient_end` | 语句块 | VAR(field_variable) | `"fields":{"VAR":"http"}` | `http.end();` |
| `esp32_httpclient_set_user_agent` | 语句块 | VAR(field_variable), USER_AGENT(input_value) | `"fields":{"VAR":"http"}, "inputs":{"USER_AGENT":{}}` | `http.setUserAgent(user_agent);` |
| `esp32_httpclient_set_authorization` | 语句块 | VAR(field_variable), USER(input_value), PASSWORD(input_value) | `"fields":{"VAR":"http"}, "inputs":{"USER":{},"PASSWORD":{}}` | `http.setAuthorization(user, password);` |
| `esp32_httpclient_set_authorization_token` | 语句块 | VAR(field_variable), TOKEN(input_value) | `"fields":{"VAR":"http"}, "inputs":{"TOKEN":{}}` | `http.setAuthorizationToken(token);` |
| `esp32_httpclient_set_timeout` | 语句块 | VAR(field_variable), TIMEOUT(input_value) | `"fields":{"VAR":"http"}, "inputs":{"TIMEOUT":{}}` | `http.setTimeout(timeout);` |
| `esp32_httpclient_set_connect_timeout` | 语句块 | VAR(field_variable), TIMEOUT(input_value) | `"fields":{"VAR":"http"}, "inputs":{"TIMEOUT":{}}` | `http.setConnectTimeout(timeout);` |
| `esp32_httpclient_set_reuse` | 语句块 | VAR(field_variable), REUSE(field_dropdown) | `"fields":{"VAR":"http","REUSE":"true"}` | `http.setReuse(true);` |
| `esp32_httpclient_set_follow_redirects` | 语句块 | VAR(field_variable), FOLLOW(field_dropdown) | `"fields":{"VAR":"http","FOLLOW":"HTTPC_STRICT_FOLLOW_REDIRECTS"}` | `http.setFollowRedirects(mode);` |
| `esp32_httpclient_set_redirect_limit` | 语句块 | VAR(field_variable), LIMIT(input_value) | `"fields":{"VAR":"http"}, "inputs":{"LIMIT":{}}` | `http.setRedirectLimit(limit);` |
| `esp32_httpclient_add_header` | 语句块 | VAR(field_variable), NAME(input_value), VALUE(input_value) | `"fields":{"VAR":"http"}, "inputs":{"NAME":{},"VALUE":{}}` | `http.addHeader(name, value);` |
| `esp32_httpclient_get` | 语句块 | VAR(field_variable) | `"fields":{"VAR":"http"}` | `http.GET();` |
| `esp32_httpclient_post` | 语句块 | VAR(field_variable), DATA(input_value) | `"fields":{"VAR":"http"}, "inputs":{"DATA":{}}` | `http.POST(data);` |
| `esp32_httpclient_put` | 语句块 | VAR(field_variable), DATA(input_value) | `"fields":{"VAR":"http"}, "inputs":{"DATA":{}}` | `http.PUT(data);` |
| `esp32_httpclient_patch` | 语句块 | VAR(field_variable), DATA(input_value) | `"fields":{"VAR":"http"}, "inputs":{"DATA":{}}` | `http.PATCH(data);` |
| `esp32_httpclient_get_response_code` | 值块 | - | `{}` | `http.getResponseCode()` |
| `esp32_httpclient_code_list` | 值块 | CODE(field_dropdown) | `"fields":{"CODE":"HTTP_CODE_OK"}` | `HTTP_CODE_OK` |
| `esp32_httpclient_get_size` | 值块 | VAR(field_variable) | `"fields":{"VAR":"http"}` | `http.getSize()` |
| `esp32_httpclient_get_string` | 值块 | VAR(field_variable) | `"fields":{"VAR":"http"}` | `http.getString()` |
| `esp32_httpclient_get_header` | 值块 | VAR(field_variable), NAME(input_value) | `"fields":{"VAR":"http"}, "inputs":{"NAME":{}}` | `http.header(name)` |
| `esp32_httpclient_get_location` | 值块 | VAR(field_variable) | `"fields":{"VAR":"http"}` | `http.getLocation()` |
| `esp32_httpclient_get_stream` | 值块 | VAR(field_variable) | `"fields":{"VAR":"http"}` | `http.getStream()` |
| `esp32_httpclient_connected` | 值块 | VAR(field_variable) | `"fields":{"VAR":"http"}` | `http.connected()` |
| `esp32_httpclient_error_to_string` | 值块 | VAR(field_variable), ERROR_CODE(input_value) | `"fields":{"VAR":"http"}, "inputs":{"ERROR_CODE":{}}` | `http.errorToString(error_code)` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "http"` |
| field_variable | 变量名字符串 | `"VAR": "http"` |
| field_dropdown | 字符串 | `"REUSE": "true"` |
| input_value | 块连接 | `"inputs": {"URL": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **特殊规则**: 
  - HTTPClient变量类型专用，每个实例独立管理
  - create类型块生成变量定义，操作块调用实例方法
  - 需要WiFi连接才能正常工作

## 使用示例

### HTTP客户端初始化
```json
{
  "type": "esp32_httpclient_create",
  "id": "http_create",
  "fields": {"VAR": "http"}
}
```

### HTTP GET请求
```json
{
  "type": "esp32_httpclient_begin_url",
  "id": "http_begin",
  "fields": {"VAR": "http"},
  "inputs": {
    "URL": {
      "block": {
        "type": "text",
        "fields": {"TEXT": "http://api.example.com/data"}
      }
    }
  },
  "next": {
    "block": {
      "type": "esp32_httpclient_get",
      "fields": {"VAR": "http"}
    }
  }
}
```

## 重要规则

1. **必须遵守**: ESP32需要先连接WiFi才能使用HTTP功能，变量名称必须唯一
2. **连接限制**: create类型是语句块创建变量，操作块是语句块/值块可串联使用
3. **变量管理**: 每个HTTP客户端使用独立的HTTPClient类型变量
4. **常见错误**: ❌ 未连接WiFi直接使用HTTP，❌ 变量名称重复，❌ 证书格式错误

## 支持的字段选项
- **REUSE(连接复用)**: "true", "false"
- **FOLLOW(重定向跟随)**: "HTTPC_DISABLE_FOLLOW_REDIRECTS", "HTTPC_STRICT_FOLLOW_REDIRECTS", "HTTPC_FORCE_FOLLOW_REDIRECTS"
- **CODE(响应代码)**: "HTTP_CODE_OK", "HTTP_CODE_NOT_FOUND", "HTTP_CODE_UNAUTHORIZED"等HTTP状态码常量
# RP HTTPClient

树莓派Pico W HTTP客户端库，支持HTTP/HTTPS请求和响应处理。

## 库信息
- **库名**: @aily-project/lib-rp-httpclient
- **版本**: 1.0.0
- **兼容**: 树莓派Pico W (rp2040:rp2040)

## 功能特性

- 支持HTTP/HTTPS请求
- 支持GET、POST、PUT、PATCH、DELETE方法
- 支持自定义请求头
- 支持HTTP基本认证和Bearer令牌
- 支持重定向跟随
- 提供快速操作模式

## 块定义

| 块类型 | 连接 | 字段/输入 | 说明 |
|--------|------|----------|------|
| `rp_httpclient_create` | 语句块 | VAR(field_input) | 创建HTTP客户端对象 |
| `rp_httpclient_begin_url` | 语句块 | VAR(field_variable), URL(input) | 连接到URL |
| `rp_httpclient_begin_host` | 语句块 | VAR, HOST, PORT, URI(input) | 连接到主机 |
| `rp_httpclient_begin_https` | 语句块 | VAR, URL(input) | HTTPS安全连接 |
| `rp_httpclient_end` | 语句块 | VAR(field_variable) | 断开连接 |
| `rp_httpclient_set_timeout` | 语句块 | VAR, TIMEOUT(input) | 设置超时 |
| `rp_httpclient_set_reuse` | 语句块 | VAR, REUSE(dropdown) | 设置连接复用 |
| `rp_httpclient_set_user_agent` | 语句块 | VAR, USER_AGENT(input) | 设置用户代理 |
| `rp_httpclient_set_authorization` | 语句块 | VAR, USER, PASSWORD(input) | 基本认证 |
| `rp_httpclient_set_authorization_token` | 语句块 | VAR, TOKEN(input) | 令牌认证 |
| `rp_httpclient_set_follow_redirects` | 语句块 | VAR, FOLLOW(dropdown) | 设置重定向 |
| `rp_httpclient_set_redirect_limit` | 语句块 | VAR, LIMIT(input) | 重定向限制 |
| `rp_httpclient_add_header` | 语句块 | VAR, NAME, VALUE(input) | 添加请求头 |
| `rp_httpclient_get` | 语句块 | VAR(field_variable) | 发送GET请求 |
| `rp_httpclient_post` | 语句块 | VAR, DATA(input) | 发送POST请求 |
| `rp_httpclient_put` | 语句块 | VAR, DATA(input) | 发送PUT请求 |
| `rp_httpclient_patch` | 语句块 | VAR, DATA(input) | 发送PATCH请求 |
| `rp_httpclient_delete` | 语句块 | VAR(field_variable) | 发送DELETE请求 |
| `rp_httpclient_get_response_code` | 值块 | 无 | 获取响应状态码 |
| `rp_httpclient_code_list` | 值块 | CODE(dropdown) | HTTP状态码常量 |
| `rp_httpclient_get_size` | 值块 | VAR(field_variable) | 获取响应大小 |
| `rp_httpclient_get_string` | 值块 | VAR(field_variable) | 获取响应内容 |
| `rp_httpclient_get_header` | 值块 | VAR, NAME(input) | 获取响应头 |
| `rp_httpclient_get_location` | 值块 | VAR(field_variable) | 获取重定向位置 |
| `rp_httpclient_connected` | 值块 | VAR(field_variable) | 检查连接状态 |
| `rp_httpclient_error_to_string` | 值块 | VAR, ERROR_CODE(input) | 错误码转文本 |
| `rp_httpclient_quick_get` | 值块 | URL(input) | 快速GET请求 |
| `rp_httpclient_quick_post` | 值块 | URL, DATA(input) | 快速POST请求 |
| `rp_httpclient_quick_post_json` | 值块 | URL, JSON(input) | 快速POST JSON |

## 使用示例

### 基本GET请求

```cpp
// 创建HTTP客户端
HTTPClient http;

// 连接到URL
http.begin("http://httpbin.org/get");

// 发送GET请求
int httpCode = http.GET();

// 获取响应
if (httpCode > 0) {
  String payload = http.getString();
  Serial.println(payload);
}

// 断开连接
http.end();
```

### POST JSON请求

```cpp
HTTPClient http;
http.begin("https://httpbin.org/post");
http.setInsecure();
http.addHeader("Content-Type", "application/json");

int httpCode = http.POST("{\"hello\":\"world\"}");
if (httpCode == HTTP_CODE_OK) {
  Serial.println(http.getString());
}
http.end();
```

## 重定向跟随模式

| 模式 | 说明 |
|------|------|
| `HTTPC_DISABLE_FOLLOW_REDIRECTS` | 禁用重定向跟随 |
| `HTTPC_STRICT_FOLLOW_REDIRECTS` | 严格模式，仅GET/HEAD跟随 |
| `HTTPC_FORCE_FOLLOW_REDIRECTS` | 强制模式，所有方法跟随 |

## HTTP状态码

| 状态码 | 常量 | 说明 |
|--------|------|------|
| 200 | `HTTP_CODE_OK` | 请求成功 |
| 201 | `HTTP_CODE_CREATED` | 创建成功 |
| 204 | `HTTP_CODE_NO_CONTENT` | 无内容 |
| 301 | `HTTP_CODE_MOVED_PERMANENTLY` | 永久重定向 |
| 400 | `HTTP_CODE_BAD_REQUEST` | 请求错误 |
| 401 | `HTTP_CODE_UNAUTHORIZED` | 未授权 |
| 403 | `HTTP_CODE_FORBIDDEN` | 禁止访问 |
| 404 | `HTTP_CODE_NOT_FOUND` | 未找到 |
| 500 | `HTTP_CODE_INTERNAL_SERVER_ERROR` | 服务器错误 |

## 错误代码

| 错误代码 | 说明 |
|---------|------|
| -1 | 连接失败 |
| -2 | 发送头失败 |
| -3 | 发送数据失败 |
| -4 | 未连接 |
| -5 | 连接丢失 |
| -11 | 读取超时 |

## 注意事项

1. **WiFi连接**: 使用HTTP请求前需确保WiFi已连接
2. **HTTPS**: 使用setInsecure()跳过证书验证或配置有效证书
3. **内存管理**: 大响应可能消耗较多内存，注意资源限制
4. **超时设置**: 默认超时5000ms，可根据需要调整
5. **连接复用**: keep-alive模式可提高多次请求效率

## 依赖

- WiFi库 (Pico W内置)
- HTTPClient库 (arduino-pico核心)

# RP HTTPClient - AI参考文档

树莓派Pico W HTTP客户端库，供大模型生成.abi文件参考。

## 库信息
- **库名**: @aily-project/lib-rp-httpclient
- **版本**: 1.0.0
- **兼容**: rp2040:rp2040

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `rp_httpclient_create` | 语句块 | VAR(field_input) | `"VAR":"http"` | `HTTPClient http;` |
| `rp_httpclient_begin_url` | 语句块 | VAR(field_variable), URL(input) | `"VAR":{"id":"xxx"}` | `http.begin(url);` |
| `rp_httpclient_begin_host` | 语句块 | VAR, HOST, PORT, URI(input) | 标准输入格式 | `http.begin(host,port,uri);` |
| `rp_httpclient_begin_https` | 语句块 | VAR, URL(input) | 标准输入格式 | `http.setInsecure();http.begin(url);` |
| `rp_httpclient_end` | 语句块 | VAR(field_variable) | `"VAR":{"id":"xxx"}` | `http.end();` |
| `rp_httpclient_set_timeout` | 语句块 | VAR, TIMEOUT(input) | 标准输入格式 | `http.setTimeout(ms);` |
| `rp_httpclient_set_reuse` | 语句块 | VAR, REUSE(dropdown) | `"REUSE":"true"` | `http.setReuse(true);` |
| `rp_httpclient_add_header` | 语句块 | VAR, NAME, VALUE(input) | 标准输入格式 | `http.addHeader(n,v);` |
| `rp_httpclient_get` | 语句块 | VAR(field_variable) | `"VAR":{"id":"xxx"}` | `int httpCode = http.GET();` |
| `rp_httpclient_post` | 语句块 | VAR, DATA(input) | 标准输入格式 | `int httpCode = http.POST(data);` |
| `rp_httpclient_put` | 语句块 | VAR, DATA(input) | 标准输入格式 | `int httpCode = http.PUT(data);` |
| `rp_httpclient_patch` | 语句块 | VAR, DATA(input) | 标准输入格式 | `int httpCode = http.PATCH(data);` |
| `rp_httpclient_delete` | 语句块 | VAR(field_variable) | `"VAR":{"id":"xxx"}` | `int httpCode = http.DELETE();` |
| `rp_httpclient_get_response_code` | 值块 | 无 | 无字段 | `httpCode` |
| `rp_httpclient_code_list` | 值块 | CODE(dropdown) | `"CODE":"HTTP_CODE_OK"` | `HTTP_CODE_OK` |
| `rp_httpclient_get_size` | 值块 | VAR(field_variable) | `"VAR":{"id":"xxx"}` | `http.getSize()` |
| `rp_httpclient_get_string` | 值块 | VAR(field_variable) | `"VAR":{"id":"xxx"}` | `http.getString()` |
| `rp_httpclient_get_header` | 值块 | VAR, NAME(input) | 标准输入格式 | `http.header(name)` |
| `rp_httpclient_get_location` | 值块 | VAR(field_variable) | `"VAR":{"id":"xxx"}` | `http.getLocation()` |
| `rp_httpclient_connected` | 值块 | VAR(field_variable) | `"VAR":{"id":"xxx"}` | `http.connected()` |
| `rp_httpclient_error_to_string` | 值块 | VAR, ERROR_CODE(input) | 标准输入格式 | `http.errorToString(code)` |
| `rp_httpclient_quick_get` | 值块 | URL(input) | 标准输入格式 | `httpQuickGet(url)` |
| `rp_httpclient_quick_post` | 值块 | URL, DATA(input) | 标准输入格式 | `httpQuickPost(url,data)` |
| `rp_httpclient_quick_post_json` | 值块 | URL, JSON(input) | 标准输入格式 | `httpQuickPostJson(url,json)` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "http"` |
| field_dropdown | 字符串 | `"REUSE": "true"` |
| field_variable | 对象 | `"VAR": {"id": "var_id"}` |
| input_value | 块连接 | `"inputs": {"URL": {"shadow": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **创建块**: 使用field_input，值为字符串
- **调用块**: 使用field_variable，值为`{"id":"变量ID"}`

## 变量类型

HTTPClient对象使用`HTTPClient`类型：
```json
{
  "type": "field_variable",
  "name": "VAR",
  "variableTypes": ["HTTPClient"],
  "defaultType": "HTTPClient"
}
```

## 使用示例

### 创建HTTP客户端并发送GET请求

```json
{
  "type": "rp_httpclient_create",
  "id": "create_id",
  "fields": {"VAR": "http"},
  "next": {
    "block": {
      "type": "rp_httpclient_begin_url",
      "id": "begin_id",
      "fields": {"VAR": {"id": "http_var_id"}},
      "inputs": {
        "URL": {
          "shadow": {
            "type": "text",
            "fields": {"TEXT": "http://httpbin.org/get"}
          }
        }
      },
      "next": {
        "block": {
          "type": "rp_httpclient_get",
          "id": "get_id",
          "fields": {"VAR": {"id": "http_var_id"}},
          "next": {
            "block": {
              "type": "serial_println",
              "id": "print_id",
              "inputs": {
                "VAR": {
                  "block": {
                    "type": "rp_httpclient_get_string",
                    "id": "string_id",
                    "fields": {"VAR": {"id": "http_var_id"}}
                  }
                }
              },
              "next": {
                "block": {
                  "type": "rp_httpclient_end",
                  "id": "end_id",
                  "fields": {"VAR": {"id": "http_var_id"}}
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### 快速POST JSON请求

```json
{
  "type": "serial_println",
  "id": "quick_post_id",
  "inputs": {
    "VAR": {
      "block": {
        "type": "rp_httpclient_quick_post_json",
        "id": "post_json_id",
        "inputs": {
          "URL": {
            "shadow": {
              "type": "text",
              "fields": {"TEXT": "http://httpbin.org/post"}
            }
          },
          "JSON": {
            "shadow": {
              "type": "text",
              "fields": {"TEXT": "{\"hello\":\"world\"}"}
            }
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **变量ID唯一性**: 每个块的id必须唯一
2. **变量引用**: 创建块用`"VAR":"名称"`，调用块用`"VAR":{"id":"变量ID"}`
3. **variables数组**: HTTPClient变量需在variables中声明，type为`HTTPClient`
4. **影子块**: 所有input_value在toolbox中有影子块配置

## HTTP状态码选项

| 显示 | 值 |
|------|-----|
| 200 OK | `HTTP_CODE_OK` |
| 201 Created | `HTTP_CODE_CREATED` |
| 204 No Content | `HTTP_CODE_NO_CONTENT` |
| 301 永久移动 | `HTTP_CODE_MOVED_PERMANENTLY` |
| 302 Found | `HTTP_CODE_FOUND` |
| 400 Bad Request | `HTTP_CODE_BAD_REQUEST` |
| 401 Unauthorized | `HTTP_CODE_UNAUTHORIZED` |
| 403 Forbidden | `HTTP_CODE_FORBIDDEN` |
| 404 Not Found | `HTTP_CODE_NOT_FOUND` |
| 500 Server Error | `HTTP_CODE_INTERNAL_SERVER_ERROR` |

## 重定向模式选项

| 显示 | 值 |
|------|-----|
| 禁用 | `HTTPC_DISABLE_FOLLOW_REDIRECTS` |
| 严格模式 | `HTTPC_STRICT_FOLLOW_REDIRECTS` |
| 强制模式 | `HTTPC_FORCE_FOLLOW_REDIRECTS` |

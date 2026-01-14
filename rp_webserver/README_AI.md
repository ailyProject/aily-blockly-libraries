# Web服务器 (WebServer) - AI参考文档

## 快速参考

本库为树莓派 Pico W 提供HTTP服务器功能，支持路由注册、请求处理、响应发送等功能。

## 块类型速查

### 初始化类
| 块类型 | 说明 | 关键字段 |
|--------|------|----------|
| `rp_webserver_create` | 创建服务器 | VAR(field_input), PORT(field_number) |
| `rp_webserver_begin` | 启动服务器 | VAR(field_variable) |
| `rp_webserver_handle_client` | 处理请求(loop中调用) | VAR(field_variable) |
| `rp_webserver_stop` | 停止服务器 | VAR(field_variable) |

### 路由处理类 (Hat块)
| 块类型 | 说明 | 关键字段 |
|--------|------|----------|
| `rp_webserver_on` | 注册路由 | VAR, METHOD, PATH(input), HANDLER(statement) |
| `rp_webserver_on_not_found` | 404处理 | VAR, HANDLER(statement) |

### 响应类
| 块类型 | 说明 | 关键字段 |
|--------|------|----------|
| `rp_webserver_send` | 发送响应 | VAR, CODE(input), CONTENT_TYPE(dropdown), CONTENT(input) |
| `rp_webserver_send_custom_type` | 自定义类型响应 | VAR, CODE, CONTENT_TYPE(input), CONTENT |
| `rp_webserver_send_header` | 发送响应头 | VAR, NAME(input), VALUE(input) |

### 请求信息类 (值块)
| 块类型 | 返回类型 | 说明 |
|--------|----------|------|
| `rp_webserver_uri` | String | 请求URI |
| `rp_webserver_method` | String | 请求方法 |
| `rp_webserver_method_is` | Boolean | 判断方法 |
| `rp_webserver_arg_by_name` | String | 按名称获取参数 |
| `rp_webserver_arg_by_index` | String | 按索引获取参数 |
| `rp_webserver_arg_name` | String | 获取参数名 |
| `rp_webserver_args_count` | Number | 参数数量 |
| `rp_webserver_has_arg` | Boolean | 检查参数存在 |
| `rp_webserver_header` | String | 获取请求头 |
| `rp_webserver_has_header` | Boolean | 检查请求头存在 |
| `rp_webserver_host_header` | String | Host头 |

### 高级功能类
| 块类型 | 说明 |
|--------|------|
| `rp_webserver_collect_headers` | 收集指定请求头 |
| `rp_webserver_enable_cors` | 启用跨域 |
| `rp_webserver_authenticate` | HTTP认证验证(值块) |
| `rp_webserver_request_authentication` | 请求认证 |

## .abi格式要点

### 变量字段格式
```json
// 创建时(field_input)
"fields": {"VAR": "server", "PORT": 80}

// 引用时(field_variable)  
"fields": {"VAR": {"id": "server_var_id"}}
```

### METHOD下拉选项
```json
"fields": {"METHOD": "HTTP_GET"}  // HTTP_ANY, HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_DELETE, HTTP_PATCH
```

### CONTENT_TYPE下拉选项
```json
"fields": {"CONTENT_TYPE": "text/html"}  // text/plain, text/html, application/json, application/xml
```

### Hat块结构(rp_webserver_on)
```json
{
  "type": "rp_webserver_on",
  "id": "unique_id",
  "fields": {"VAR": {"id": "var_id"}, "METHOD": "HTTP_GET"},
  "inputs": {
    "PATH": {"shadow": {"type": "text", "fields": {"TEXT": "/"}}},
    "HANDLER": {"block": {...}}  // 内部语句块
  }
}
```

## 代码生成模式

### 服务器创建
```cpp
WebServer server(80);  // 全局对象声明
```

### 路由注册(setup中)
```cpp
server.on("/", HTTP_GET, handle_server_root_get);  // 自动生成回调函数
```

### 请求处理(loop中)
```cpp
server.handleClient();  // 必须持续调用
```

## 关键规则

1. **变量类型**: `WebServer`
2. **handleClient**: 必须在loop中调用
3. **Hat块**: `rp_webserver_on`和`rp_webserver_on_not_found`无previousStatement/nextStatement
4. **回调函数**: 自动生成，命名格式`handle_{varName}_{path}_{method}`

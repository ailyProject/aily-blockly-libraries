# ESP32异步TCP库

ESP32异步TCP客户端和服务器库，支持非阻塞的TCP连接、数据收发和事件回调处理。

## 库信息
- **库名**: @aily-project/lib-esp32-async-tcp
- **版本**: 3.3.2
- **兼容**: ESP32系列开发板

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `async_tcp_client_create` | 语句块 | VAR(field_input) | `"VAR":"tcpClient"` | `AsyncClient tcpClient;` |
| `async_tcp_client_connect` | 语句块 | VAR(field_variable), HOST(input), PORT(input) | 见示例 | `client.connect(host, port);` |
| `async_tcp_client_close` | 语句块 | VAR(field_variable) | - | `client.close();` |
| `async_tcp_client_write` | 语句块 | VAR(field_variable), DATA(input) | - | `client.write(data);` |
| `async_tcp_client_connected` | 值块 | VAR(field_variable) | - | `client.connected()` |
| `async_tcp_client_connecting` | 值块 | VAR(field_variable) | - | `client.connecting()` |
| `async_tcp_client_space` | 值块 | VAR(field_variable) | - | `client.space()` |
| `async_tcp_client_can_send` | 值块 | VAR(field_variable) | - | `client.canSend()` |
| `async_tcp_client_set_no_delay` | 语句块 | VAR(field_variable), NODELAY(checkbox) | `"NODELAY":true` | `client.setNoDelay(true);` |
| `async_tcp_client_set_rx_timeout` | 语句块 | VAR(field_variable), TIMEOUT(input) | - | `client.setRxTimeout(5);` |
| `async_tcp_client_remote_ip` | 值块 | VAR(field_variable) | - | `client.remoteIP().toString()` |
| `async_tcp_client_remote_port` | 值块 | VAR(field_variable) | - | `client.remotePort()` |
| `async_tcp_client_local_port` | 值块 | VAR(field_variable) | - | `client.localPort()` |
| `async_tcp_client_on_connect` | Hat块 | VAR(field_variable), HANDLER(statement) | 见示例 | 注册onConnect回调 |
| `async_tcp_client_on_disconnect` | Hat块 | VAR(field_variable), HANDLER(statement) | 见示例 | 注册onDisconnect回调 |
| `async_tcp_client_on_data` | Hat块 | VAR(field_variable), DATA_VAR/LEN_VAR(field_input), HANDLER(statement) | 见示例 | 注册onData回调 |
| `async_tcp_client_on_error` | Hat块 | VAR(field_variable), ERROR_VAR(field_input), HANDLER(statement) | 见示例 | 注册onError回调 |
| `async_tcp_client_on_ack` | Hat块 | VAR(field_variable), LEN_VAR/TIME_VAR(field_input), HANDLER(statement) | 见示例 | 注册onAck回调 |
| `async_tcp_client_on_timeout` | Hat块 | VAR(field_variable), TIME_VAR(field_input), HANDLER(statement) | 见示例 | 注册onTimeout回调 |
| `async_tcp_client_error_to_string` | 值块 | ERROR(input) | - | `AsyncClient::errorToString(err)` |
| `async_tcp_server_create` | 语句块 | VAR(field_input), PORT(input) | `"VAR":"tcpServer"` | `AsyncServer tcpServer(80);` |
| `async_tcp_server_begin` | 语句块 | VAR(field_variable) | - | `server.begin();` |
| `async_tcp_server_end` | 语句块 | VAR(field_variable) | - | `server.end();` |
| `async_tcp_server_set_no_delay` | 语句块 | VAR(field_variable), NODELAY(checkbox) | `"NODELAY":true` | `server.setNoDelay(true);` |
| `async_tcp_server_on_client` | Hat块 | VAR(field_variable), CLIENT_VAR(field_input), HANDLER(statement) | 见示例 | 注册onClient回调 |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "tcpClient"` |
| field_checkbox | 布尔值 | `"NODELAY": true` |
| field_variable | 对象 | `"VAR": {"id": "var_id"}` |
| input_value | 块连接 | `"inputs": {"PORT": {"shadow": {...}}}` |
| input_statement | 块连接 | `"inputs": {"HANDLER": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **Hat块**: 无连接属性（事件回调块），通过`inputs`连接内部语句

### 变量类型
- `AsyncClient`: TCP客户端类型
- `AsyncServer`: TCP服务器类型

## 使用示例

### TCP客户端连接示例

```json
{
  "type": "async_tcp_client_create",
  "id": "create_1",
  "fields": {"VAR": "tcpClient"},
  "next": {
    "block": {
      "type": "async_tcp_client_connect",
      "id": "connect_1",
      "fields": {"VAR": {"id": "tcpClient_id"}},
      "inputs": {
        "HOST": {
          "shadow": {
            "type": "text",
            "id": "host_1",
            "fields": {"TEXT": "192.168.1.100"}
          }
        },
        "PORT": {
          "shadow": {
            "type": "math_number",
            "id": "port_1",
            "fields": {"NUM": 80}
          }
        }
      }
    }
  }
}
```

### 数据接收回调示例

```json
{
  "type": "async_tcp_client_on_data",
  "id": "ondata_1",
  "fields": {
    "VAR": {"id": "tcpClient_id"},
    "DATA_VAR": "receivedData",
    "LEN_VAR": "dataLength"
  },
  "inputs": {
    "HANDLER": {
      "block": {
        "type": "serial_println",
        "id": "print_1",
        "fields": {"SERIAL": "Serial"},
        "inputs": {
          "VAR": {
            "block": {
              "type": "variables_get",
              "id": "get_1",
              "fields": {"VAR": {"id": "receivedData_id"}}
            }
          }
        }
      }
    }
  }
}
```

### TCP服务器示例

```json
{
  "type": "async_tcp_server_create",
  "id": "server_1",
  "fields": {"VAR": "tcpServer"},
  "inputs": {
    "PORT": {
      "shadow": {
        "type": "math_number",
        "id": "port_2",
        "fields": {"NUM": 8080}
      }
    }
  },
  "next": {
    "block": {
      "type": "async_tcp_server_begin",
      "id": "begin_1",
      "fields": {"VAR": {"id": "tcpServer_id"}}
    }
  }
}
```

## 重要规则

1. **必须先创建对象**: 使用`async_tcp_client_create`或`async_tcp_server_create`创建对象后，才能使用其他操作块
2. **事件回调是Hat块**: 事件回调块（on_connect, on_data等）没有上下连接，它们是独立的事件处理器
3. **变量引用**: 操作块中的VAR字段使用对象格式`{"id": "变量ID"}`
4. **回调参数变量**: 在回调块中定义的变量（如receivedData）会自动创建为全局变量

## 支持的功能

### TCP客户端
- 异步连接到远程服务器
- 非阻塞数据发送
- 事件驱动的数据接收
- 连接状态查询
- 超时设置

### TCP服务器
- 监听指定端口
- 接受客户端连接
- 事件驱动的客户端管理

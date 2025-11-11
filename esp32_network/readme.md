# esp32_network

ESP32网络通信库，支持TCP客户端、TCP服务器和UDP通信

## 库信息
- **库名**: @aily-project/lib-esp32-network
- **版本**: 1.0.0
- **兼容**: ESP32系列平台

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp32_network_client_create` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"client_id","name":"client","type":"NetworkClient"}}` | `NetworkClient client;` |
| `esp32_network_client_connect_host` | 语句块 | VAR(field_variable), HOST(input_value), PORT(input_value) | `"fields":{"VAR":{"id":"client_id"}}, "inputs":{"HOST":{},"PORT":{}}` | `client.connect(host, port);` |
| `esp32_network_client_print` | 语句块 | VAR(field_variable), DATA(input_value) | `"fields":{"VAR":{"id":"client_id"}}, "inputs":{"DATA":{}}` | `client.print(data);` |
| `esp32_network_client_println` | 语句块 | VAR(field_variable), DATA(input_value) | `"fields":{"VAR":{"id":"client_id"}}, "inputs":{"DATA":{}}` | `client.println(data);` |
| `esp32_network_client_available` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"client_id","name":"client","type":"NetworkClient"}}` | `client.available()` |
| `esp32_network_client_read` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"client_id","name":"client","type":"NetworkClient"}}` | `client.read()` |
| `esp32_network_client_connected` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"client_id","name":"client","type":"NetworkClient"}}` | `client.connected()` |
| `esp32_network_client_stop` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"client_id","name":"client","type":"NetworkClient"}}` | `client.stop();` |
| `esp32_network_server_create` | 值块 | VAR(field_variable), PORT(input_value), MAX_CLIENTS(input_value) | `"fields":{"VAR":{"id":"server_id"}}, "inputs":{"PORT":{},"MAX_CLIENTS":{}}` | `NetworkServer server(port, max);` |
| `esp32_network_server_begin` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"server_id","name":"server","type":"NetworkServer"}}` | `server.begin();` |
| `esp32_network_server_accept` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"server_id","name":"server","type":"NetworkServer"}}` | `server.accept()` |
| `esp32_network_server_stop` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"server_id","name":"server","type":"NetworkServer"}}` | `server.stop();` |
| `esp32_network_udp_create` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"udp_id","name":"udp","type":"NetworkUDP"}}` | `NetworkUDP udp;` |
| `esp32_network_udp_begin` | 语句块 | VAR(field_variable), PORT(input_value) | `"fields":{"VAR":{"id":"udp_id"}}, "inputs":{"PORT":{}}` | `udp.begin(port);` |
| `esp32_network_udp_begin_packet` | 语句块 | VAR(field_variable), IP(input_value), PORT(input_value) | `"fields":{"VAR":{"id":"udp_id"}}, "inputs":{"IP":{},"PORT":{}}` | `udp.beginPacket(ip, port);` |
| `esp32_network_udp_write` | 语句块 | VAR(field_variable), DATA(input_value) | `"fields":{"VAR":{"id":"udp_id"}}, "inputs":{"DATA":{}}` | `udp.write(data);` |
| `esp32_network_udp_end_packet` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"udp_id","name":"udp","type":"NetworkUDP"}}` | `udp.endPacket();` |
| `esp32_network_udp_parse_packet` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"udp_id","name":"udp","type":"NetworkUDP"}}` | `udp.parsePacket()` |
| `esp32_network_udp_available` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"udp_id","name":"udp","type":"NetworkUDP"}}` | `udp.available()` |
| `esp32_network_udp_read` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"udp_id","name":"udp","type":"NetworkUDP"}}` | `udp.read()` |
| `esp32_network_udp_remote_ip` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"udp_id","name":"udp","type":"NetworkUDP"}}` | `udp.remoteIP()` |
| `esp32_network_udp_remote_port` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"udp_id","name":"udp","type":"NetworkUDP"}}` | `udp.remotePort()` |
| `esp32_network_udp_stop` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"udp_id","name":"udp","type":"NetworkUDP"}}` | `udp.stop();` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_variable | NetworkClient/NetworkServer/NetworkUDP变量对象 | `"VAR": {"id": "client_id", "name": "client", "type": "NetworkClient"}` |
| input_value | 块连接 | `"inputs": {"HOST": {"block": {...}}}` |

## 连接规则

- **语句块**: connect_host、print、println、begin等有previousStatement/nextStatement，通过`next`字段连接
- **值块**: create、available、read、connected等有output，连接到`inputs`中，无`next`字段
- **特殊规则**: 
  - NetworkClient/NetworkServer/NetworkUDP变量类型专用，每个实例独立管理
  - create类型块生成变量定义，操作块调用实例方法
  - 需要WiFi连接才能正常工作
- **变量作用域**: 
  - NetworkClient/NetworkUDP 当独立创建变量时，作用域为全局变量；当在函数内创建时，作用域为局部变量
  - NetworkServer 变量作用域为全局变量

## 使用示例

### TCP客户端连接
```json
{
  "type": "esp32_network_client_connect_host",
  "id": "client_connect",
  "fields": {
    "VAR": {"id": "client_var", "name": "client", "type": "NetworkClient"}
  },
  "inputs": {
    "HOST": {
      "block": {
        "type": "text",
        "fields": {"TEXT": "api.example.com"}
      }
    },
    "PORT": {
      "block": {
        "type": "math_number", 
        "fields": {"NUM": 80}
      }
    }
  }
}
```

### UDP数据发送
```json
{
  "type": "esp32_network_udp_begin_packet",
  "id": "udp_send",
  "fields": {
    "VAR": {"id": "udp_var", "name": "udp", "type": "NetworkUDP"}
  },
  "inputs": {
    "IP": {
      "block": {
        "type": "text",
        "fields": {"TEXT": "192.168.1.100"}
      }
    },
    "PORT": {
      "block": {
        "type": "math_number",
        "fields": {"NUM": 8888}
      }
    }
  },
  "next": {
    "block": {
      "type": "esp32_network_udp_write",
      "fields": {"VAR": {"id": "udp_var"}},
      "inputs": {
        "DATA": {
          "block": {
            "type": "text",
            "fields": {"TEXT": "Hello UDP"}
          }
        }
      }
    }
  },
  "next": {
    "block": {
    "type": "esp32_network_udp_end_packet",
    "fields": {"VAR": {"id": "udp_var"}}
    }
  }
}
```

## 重要规则

1. **必须遵守**: ESP32需要先连接WiFi才能使用网络功能，变量ID必须唯一
2. **连接限制**: create类型是值块必须赋值给变量，操作块是语句块可串联执行
3. **变量管理**: 每个网络对象使用独立的类型变量（NetworkClient/NetworkServer/NetworkUDP）
4. **常见错误**: ❌ 未连接WiFi直接使用网络，❌ 变量类型不匹配，❌ TCP服务器端口被占用

## 支持的字段选项
- **变量类型**: "NetworkClient"（TCP客户端）, "NetworkServer"（TCP服务器）, "NetworkUDP"（UDP通信）
- **端口范围**: 1-65535（标准网络端口）
- **IP地址格式**: IPv4格式字符串（如"192.168.1.100"）或域名
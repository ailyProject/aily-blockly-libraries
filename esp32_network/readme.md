# esp32_network

ESP32网络通信库，支持TCP客户端、安全连接、服务器和UDP通信

## 库信息
- **库名**: @aily-project/lib-esp32-network
- **版本**: 1.0.0
- **兼容**: ESP32系列平台

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp32_network_client_create` | 语句块 | VAR(field_input) | `"fields":{"VAR":"client"}` | `NetworkClient client;` |
| `esp32_network_client_connect_ip` | 语句块 | VAR(field_variable), IP(input_value), PORT(input_value) | `"fields":{"VAR":"client"}, "inputs":{"IP":{},"PORT":{}}` | `client.connect(ip, port);` |
| `esp32_network_client_connect_host` | 语句块 | VAR(field_variable), HOST(input_value), PORT(input_value) | `"fields":{"VAR":"client"}, "inputs":{"HOST":{},"PORT":{}}` | `client.connect(host, port);` |
| `esp32_networkclientsecure_create` | 语句块 | VAR(field_input) | `"fields":{"VAR":"client"}` | `NetworkClientSecure client;` |
| `esp32_networkclientsecure_set_insecure` | 语句块 | VAR(field_variable) | `"fields":{"VAR":"client"}` | `client.setInsecure();` |
| `esp32_networkclientsecure_set_ca_cert` | 语句块 | VAR(field_variable), CA_CERT(input_value) | `"fields":{"VAR":"client"}, "inputs":{"CA_CERT":{}}` | `client.setCACert(ca_cert);` |
| `esp32_networkclientsecure_set_certificate` | 语句块 | VAR(field_variable), CERT(input_value) | `"fields":{"VAR":"client"}, "inputs":{"CERT":{}}` | `client.setCertificate(cert);` |
| `esp32_networkclientsecure_set_private_key` | 语句块 | VAR(field_variable), PRIVATE_KEY(input_value) | `"fields":{"VAR":"client"}, "inputs":{"PRIVATE_KEY":{}}` | `client.setPrivateKey(key);` |
| `esp32_networkclientsecure_set_psk` | 语句块 | VAR(field_variable), PSK_IDENT(input_value), PSK_KEY(input_value) | `"fields":{"VAR":"client"}, "inputs":{"PSK_IDENT":{},"PSK_KEY":{}}` | `client.setPreSharedKey(ident, key);` |
| `esp32_networkclientsecure_set_plain_start` | 语句块 | VAR(field_variable) | `"fields":{"VAR":"client"}` | `client.setHandshakeTimeout(15);` |
| `esp32_networkclientsecure_start_tls` | 值块 | VAR(field_variable) | `"fields":{"VAR":"client"}` | `client.startTLS()` |
| `esp32_networkclientsecure_set_handshake_timeout` | 语句块 | VAR(field_variable), TIMEOUT(input_value) | `"fields":{"VAR":"client"}, "inputs":{"TIMEOUT":{}}` | `client.setHandshakeTimeout(timeout);` |
| `esp32_networkclientsecure_verify_fingerprint` | 值块 | VAR(field_variable), FINGERPRINT(input_value), DOMAIN(input_value) | `"fields":{"VAR":"client"}, "inputs":{"FINGERPRINT":{},"DOMAIN":{}}` | `client.verify(fingerprint, domain)` |
| `esp32_networkclientsecure_get_peer_fingerprint` | 值块 | VAR(field_variable) | `"fields":{"VAR":"client"}` | `client.getPeerCertificateFingerprint()` |
| `esp32_networkclientsecure_last_error` | 值块 | VAR(field_variable) | `"fields":{"VAR":"client"}` | `client.lastError()` |
| `esp32_network_client_print` | 语句块 | VAR(field_variable), DATA(input_value) | `"fields":{"VAR":"client"}, "inputs":{"DATA":{}}` | `client.print(data);` |
| `esp32_network_client_println` | 语句块 | VAR(field_variable), DATA(input_value) | `"fields":{"VAR":"client"}, "inputs":{"DATA":{}}` | `client.println(data);` |
| `esp32_network_client_available` | 值块 | VAR(field_variable) | `"fields":{"VAR":"client"}` | `client.available()` |
| `esp32_network_client_read` | 值块 | VAR(field_variable), TYPE(field_dropdown) | `"fields":{"VAR":"client","TYPE":"BYTE"}` | `client.read()` |
| `esp32_network_client_connected` | 值块 | VAR(field_variable) | `"fields":{"VAR":"client"}` | `client.connected()` |
| `esp32_network_client_stop` | 语句块 | VAR(field_variable) | `"fields":{"VAR":"client"}` | `client.stop();` |
| `esp32_network_server_create` | 语句块 | VAR(field_input), PORT(input_value), MAX_CLIENTS(input_value) | `"fields":{"VAR":"server"}, "inputs":{"PORT":{},"MAX_CLIENTS":{}}` | `NetworkServer server(port, max);` |
| `esp32_network_server_begin` | 语句块 | VAR(field_variable) | `"fields":{"VAR":"server"}` | `server.begin();` |
| `esp32_network_server_accept` | 语句块 | VAR(field_variable), CLIENT_VAR(field_input) | `"fields":{"VAR":"server","CLIENT_VAR":"client"}` | `NetworkClient client = server.accept();` |
| `esp32_network_server_stop` | 语句块 | VAR(field_variable) | `"fields":{"VAR":"server"}` | `server.stop();` |
| `esp32_network_udp_create` | 语句块 | VAR(field_input) | `"fields":{"VAR":"udp"}` | `NetworkUDP udp;` |
| `esp32_network_udp_begin` | 语句块 | VAR(field_variable), PORT(input_value) | `"fields":{"VAR":"udp"}, "inputs":{"PORT":{}}` | `udp.begin(port);` |
| `esp32_network_udp_begin_packet` | 语句块 | VAR(field_variable), IP(input_value), PORT(input_value) | `"fields":{"VAR":"udp"}, "inputs":{"IP":{},"PORT":{}}` | `udp.beginPacket(ip, port);` |
| `esp32_network_udp_write` | 语句块 | VAR(field_variable), DATA(input_value) | `"fields":{"VAR":"udp"}, "inputs":{"DATA":{}}` | `udp.write(data);` |
| `esp32_network_udp_end_packet` | 语句块 | VAR(field_variable) | `"fields":{"VAR":"udp"}` | `udp.endPacket();` |
| `esp32_network_udp_parse_packet` | 值块 | VAR(field_variable) | `"fields":{"VAR":"udp"}` | `udp.parsePacket()` |
| `esp32_network_udp_available` | 值块 | VAR(field_variable) | `"fields":{"VAR":"udp"}` | `udp.available()` |
| `esp32_network_udp_read` | 值块 | VAR(field_variable) | `"fields":{"VAR":"udp"}` | `udp.read()` |
| `esp32_network_udp_remote_ip` | 值块 | VAR(field_variable) | `"fields":{"VAR":"udp"}` | `udp.remoteIP()` |
| `esp32_network_udp_remote_port` | 值块 | VAR(field_variable) | `"fields":{"VAR":"udp"}` | `udp.remotePort()` |
| `esp32_network_udp_stop` | 语句块 | VAR(field_variable) | `"fields":{"VAR":"udp"}` | `udp.stop();` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "client"` |
| field_variable | 变量名字符串 | `"VAR": "client"` |
| field_dropdown | 字符串 | `"TYPE": "BYTE"` |
| input_value | 块连接 | `"inputs": {"HOST": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **特殊规则**: 
  - NetworkClient、NetworkClientSecure、NetworkServer、NetworkUDP变量类型，每个实例独立管理
  - create类型块生成变量定义，操作块调用实例方法
  - TCP客户端通用功能（print、println、available、read、connected、stop）适用于普通和安全客户端
  - 需要WiFi连接才能正常工作
- **变量作用域**:
  - NetworkClient/NetworkClientSecure/NetworkUDP: 当独立创建变量时为全局变量，在函数内创建时为局部变量
  - NetworkServer: 变量作用域为全局变量

## 使用示例

### 网络客户端创建
```json
{
  "type": "esp32_network_client_create",
  "id": "client_create",
  "fields": {"VAR": "client"}
}
```

### 安全HTTPS连接
```json
{
  "type": "esp32_networkclientsecure_create",
  "id": "secure_create",
  "fields": {"VAR": "secureClient"},
  "next": {
    "block": {
      "type": "esp32_networkclientsecure_set_ca_cert",
      "fields": {"VAR": "secureClient"},
      "inputs": {
        "CA_CERT": {
          "block": {
            "type": "text",
            "fields": {"TEXT": "-----BEGIN CERTIFICATE-----\n..."}
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: ESP32需要先连接WiFi才能使用网络功能，变量名称必须唯一
2. **连接限制**: create类型是语句块创建变量，操作块是语句块/值块可串联使用
3. **变量管理**: 每个网络对象使用独立的变量类型（NetworkClient/NetworkClientSecure/NetworkServer/NetworkUDP）
4. **常见错误**: ❌ 未连接WiFi直接使用网络，❌ 变量名称重复，❌ SSL证书格式错误

## 支持的变量类型
- **NetworkClient**: 普通TCP客户端
- **NetworkClientSecure**: 安全SSL/TLS客户端 
- **NetworkServer**: TCP服务器
- **NetworkUDP**: UDP通信对象

## 支持的读取类型
- **BYTE**: 单个字节
- **STRING**: 字符串
- **LINE**: 读到换行符
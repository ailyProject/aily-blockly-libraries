# ESP-NOW 通信库

ESP32无线通信库，支持设备间直接通信，无需WiFi网络。提供极简模式、串口模式、标准模式三种使用方式。
推荐新手使用极简模式，一键初始化和发送接收。高级用户可选标准模式，精细控制对等设备和回调。

## 库信息
- **库名**: @aily-project/lib-esp_now
- **版本**: 1.0.1
- **兼容**: ESP32系列 (esp32:esp32)

## 块定义

### 极简模式（推荐新手）

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp_now_master_init` | 语句块 | CHANNEL(input) | - | 初始化为广播发送方 |
| `esp_now_slave_init` | 语句块 | CHANNEL(input) | - | 初始化为接收方 |
| `esp_now_node_init` | 语句块 | CHANNEL(input) | - | 初始化为双向节点 |
| `esp_now_broadcast_message` | 语句块 | MESSAGE(input) | - | 广播消息 |
| `esp_now_reply_message` | 语句块 | MESSAGE(input) | - | 回复发送方 |
| `esp_now_on_message_received` | Hat块 | HANDLER(statement) | - | 消息接收回调 |
| `esp_now_received_message` | 值块 | - | - | `esp_now_rx_message` |
| `esp_now_received_message_len` | 值块 | - | - | `esp_now_rx_len` |
| `esp_now_received_is_broadcast` | 值块 | - | - | `esp_now_rx_broadcast` |
| `esp_now_received_sender_mac` | 值块 | - | - | `esp_now_rx_sender_mac` |

### 串口模式

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp_now_serial_create` | 语句块 | VAR(field_input), MAC(input), CHANNEL(input), MODE(dropdown) | `"VAR":"nowSerial"`, `"MODE":"WIFI_STA"` | 创建串口对象 |
| `esp_now_serial_available` | 值块 | VAR(field_variable) | `"VAR":{"id":"nowSerial"}` | `nowSerial.available()` |
| `esp_now_serial_available_for_write` | 值块 | VAR(field_variable) | `"VAR":{"id":"nowSerial"}` | `nowSerial.availableForWrite()` |
| `esp_now_serial_read` | 值块 | VAR(field_variable) | `"VAR":{"id":"nowSerial"}` | `nowSerial.read()` |
| `esp_now_serial_read_string` | 值块 | VAR(field_variable) | `"VAR":{"id":"nowSerial"}` | `nowSerial.readString()` |
| `esp_now_serial_read_string_until` | 值块 | VAR(field_variable), TERMINATOR(input) | `"VAR":{"id":"nowSerial"}` | `nowSerial.readStringUntil(c)` |
| `esp_now_serial_print` | 语句块 | VAR(field_variable), DATA(input) | `"VAR":{"id":"nowSerial"}` | `nowSerial.print(data);` |
| `esp_now_serial_println` | 语句块 | VAR(field_variable), DATA(input) | `"VAR":{"id":"nowSerial"}` | `nowSerial.println(data);` |
| `esp_now_serial_write` | 值块 | VAR(field_variable), DATA(input) | `"VAR":{"id":"nowSerial"}` | `nowSerial.write(data)` |

### 标准模式-初始化

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp_now_wifi_init` | 语句块 | MODE(dropdown), CHANNEL(input) | `"MODE":"WIFI_STA"` | WiFi模式配置 |
| `esp_now_begin` | 语句块 | - | - | `ESP_NOW.begin();` |
| `esp_now_begin_with_pmk` | 语句块 | PMK(input) | - | 带加密初始化 |
| `esp_now_end` | 语句块 | - | - | `ESP_NOW.end();` |

### 标准模式-对等设备

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp_now_create_peer` | 语句块 | VAR(field_input), MAC(input) | `"VAR":"peer1"` | 创建对等设备 |
| `esp_now_create_peer_advanced` | 语句块 | VAR(field_input), MAC(input), CHANNEL(input), LMK(input) | `"VAR":"peer1"` | 创建加密对等设备 |
| `esp_now_create_broadcast_peer` | 语句块 | VAR(field_input) | `"VAR":"broadcastPeer"` | 创建广播设备 |
| `esp_now_remove_peer` | 语句块 | VAR(field_variable:ESP_NOW_Peer) | `"VAR":{"id":"peer1"}` | 移除对等设备 |

### 标准模式-发送

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp_now_send` | 语句块 | VAR(field_variable:ESP_NOW_Peer), MESSAGE(input) | `"VAR":{"id":"peer1"}` | `peer1->send(msg);` |
| `esp_now_send_data` | 语句块 | VAR(field_variable:ESP_NOW_Peer), DATA(input), LEN(input) | `"VAR":{"id":"peer1"}` | `peer1->send(data, len);` |

### 标准模式-回调

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp_now_on_receive` | Hat块 | VAR(field_variable:ESP_NOW_Peer), HANDLER(statement) | `"VAR":{"id":"peer1"}` | 接收回调 |
| `esp_now_on_sent` | Hat块 | VAR(field_variable:ESP_NOW_Peer), HANDLER(statement) | `"VAR":{"id":"peer1"}` | 发送完成回调 |
| `esp_now_on_new_peer` | Hat块 | HANDLER(statement) | - | 新设备回调 |
| `esp_now_received_data` | 值块 | - | - | `esp_now_data` |
| `esp_now_received_len` | 值块 | - | - | `esp_now_len` |
| `esp_now_is_broadcast` | 值块 | - | - | `esp_now_broadcast` |
| `esp_now_send_success` | 值块 | - | - | `esp_now_success` |
| `esp_now_src_mac` | 值块 | - | - | `esp_now_src_mac_global` |

### 快速操作

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp_now_quick_broadcast` | 语句块 | MESSAGE(input), CHANNEL(input) | - | 一键广播 |
| `esp_now_quick_send` | 语句块 | MAC(input), MESSAGE(input), CHANNEL(input) | - | 一键发送 |

### 状态查询

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp_now_get_mac` | 值块 | - | - | `WiFi.macAddress()` |
| `esp_now_get_max_data_len` | 值块 | - | - | `ESP_NOW.getMaxDataLen()` |
| `esp_now_get_peer_count` | 值块 | - | - | `ESP_NOW.getTotalPeerCount()` |
| `esp_now_get_version` | 值块 | - | - | `ESP_NOW.getVersion()` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "peer1"` |
| field_dropdown | 字符串 | `"MODE": "WIFI_STA"` |
| field_variable | 对象 | `"VAR": {"id": "peer1"}` |
| input_value | 块连接 | `"inputs": {"MESSAGE": {"block": {...}}}` |
| input_statement | 块连接 | `"inputs": {"HANDLER": {"block": {...}}}` |

### Dropdown选项

**MODE (WiFi模式)**: `"WIFI_STA"` (Station) / `"WIFI_AP"` (AP) / `"WIFI_AP_STA"` (混合)

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **Hat块**: 无连接属性，通过`inputs`连接内部语句
- **变量规则**: 创建时用field_input(字符串)，使用时用field_variable(对象ID)
- **变量类型**: `ESP_NOW_Peer`(标准对等设备)、`ESP_NOW_Serial`(串口模式)

## 使用示例

### 极简模式 - 主机广播
```json
{
  "type": "arduino_setup",
  "inputs": {
    "ARDUINO_SETUP": {
      "block": {
        "type": "esp_now_master_init",
        "inputs": {"CHANNEL": {"shadow": {"type": "math_number", "fields": {"NUM": 1}}}}
      }
    }
  },
  "next": {
    "block": {
      "type": "arduino_loop",
      "inputs": {
        "ARDUINO_LOOP": {
          "block": {
            "type": "esp_now_broadcast_message",
            "inputs": {"MESSAGE": {"shadow": {"type": "text", "fields": {"TEXT": "Hello!"}}}}
          }
        }
      }
    }
  }
}
```

### 极简模式 - 从机接收并回复
```json
{
  "type": "arduino_setup",
  "inputs": {
    "ARDUINO_SETUP": {
      "block": {
        "type": "esp_now_slave_init",
        "inputs": {"CHANNEL": {"shadow": {"type": "math_number", "fields": {"NUM": 1}}}}
      }
    }
  },
  "next": {
    "block": {
      "type": "esp_now_on_message_received",
      "inputs": {
        "HANDLER": {
          "block": {
            "type": "serial_println",
            "inputs": {"VALUE": {"block": {"type": "esp_now_received_message"}}},
            "next": {
              "block": {
                "type": "esp_now_reply_message",
                "inputs": {"MESSAGE": {"shadow": {"type": "text", "fields": {"TEXT": "OK"}}}}
              }
            }
          }
        }
      }
    }
  }
}
```

### 串口模式 - 双向通信
```json
{
  "type": "esp_now_serial_create",
  "fields": {"VAR": "nowSerial", "MODE": "WIFI_STA"},
  "inputs": {
    "MAC": {"shadow": {"type": "text", "fields": {"TEXT": "AA:BB:CC:DD:EE:FF"}}},
    "CHANNEL": {"shadow": {"type": "math_number", "fields": {"NUM": 1}}}
  }
}
```
生成: 创建ESP-NOW串口对象，可用`print`/`println`发送，`available`/`readString`接收

### 标准模式 - 对等设备通信
```json
{
  "type": "esp_now_create_peer",
  "fields": {"VAR": "peer1"},
  "inputs": {"MAC": {"shadow": {"type": "text", "fields": {"TEXT": "AA:BB:CC:DD:EE:FF"}}}},
  "next": {
    "block": {
      "type": "esp_now_send",
      "fields": {"VAR": {"id": "peer1"}},
      "inputs": {"MESSAGE": {"shadow": {"type": "text", "fields": {"TEXT": "Hello"}}}}
    }
  }
}
```

## 重要规则

1. **通道一致**: 通信双方必须使用相同的WiFi通道
2. **MAC地址格式**: 使用`AA:BB:CC:DD:EE:FF`格式
3. **变量ID唯一**: 所有块ID和变量ID必须唯一
4. **模式选择**:
   - 极简模式：新手推荐，一键初始化
   - 串口模式：类似Serial API，易于理解
   - 标准模式：精细控制，适合高级用户

## 三种初始化模式对比

| 模式 | 块类型 | 功能 | 适用场景 |
|------|--------|------|----------|
| 主机 | `esp_now_master_init` | 仅发送广播 | 单向广播发送方 |
| 从机 | `esp_now_slave_init` | 仅接收+可回复 | 接收并响应 |
| 双向节点 | `esp_now_node_init` | 发送+接收 | 全双工通信 |

## 常见需求映射

| 用户需求 | 推荐方案 |
|----------|----------|
| 广播消息给所有设备 | 极简模式: `master_init` + `broadcast_message` |
| 接收并响应消息 | 极简模式: `slave_init` + `on_message_received` + `reply_message` |
| 双向通信 | 极简模式: `node_init` 或 串口模式 |
| 类Serial收发 | 串口模式: `serial_create` + `print`/`readString` |
| 精细控制peer | 标准模式: `create_peer` + `on_receive` |
| 获取本机MAC | `esp_now_get_mac` |

---
*自包含文档，无需外部规范*

# MQTT通信库

基于PubSubClient的MQTT通信库，支持ESP32、Arduino UNO R4 WiFi等开发板的物联网数据收发，提供完整的MQTT客户端功能。

## 库信息
- **库名**: @aily-project/lib-mqtt
- **版本**: 0.0.1
- **作者**: aily Project
- **描述**: 基于PubSubClient的MQTT支持库，适用于Arduino UNO R4 WiFi、ESP32等开发板
- **兼容**: ESP32、Arduino UNO R4 WiFi
- **电压**: 3.3V、5V
- **测试者**: i3water
- **官方库**: https://github.com/knolleary/pubsubclient

## Blockly 工具箱分类

### 网络连接
- `ethernet_begin` - 初始化以太网连接
- `wifi_mode` - 设置WiFi模式
- `wifi_begin` - 连接WiFi网络
- `wifi_status` - 获取WiFi连接状态
- `wifi_local_ip` - 获取本地IP地址

### MQTT客户端
- `pubsub_create` - 创建MQTT客户端
- `pubsub_set_callback` - 设置消息接收回调
- `pubsub_set_callback_with_topic` - 设置特定主题回调
- `pubsub_connect_with_credentials` - 使用凭据连接MQTT服务器
- `pubsub_connected` - 检查MQTT连接状态
- `pubsub_state` - 获取MQTT客户端状态
- `pubsub_subscribe` - 订阅MQTT主题
- `pubsub_publish` - 发布MQTT消息

## 详细块定义

### 网络连接块

#### ethernet_begin
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 初始化以太网连接
**值输入**:
- `MAC`: 字节数组输入 - MAC地址
- `IP`: IP地址输入 - IP地址
**生成代码**: `Ethernet.begin(mac, ip);`
**自动添加**: 库引用 `#include <Ethernet.h>`

#### wifi_mode
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 设置WiFi模式
**值输入**:
- `MODE`: 模式输入 - WiFi模式
**生成代码**: `WiFi.mode(mode);`
**自动添加**: 根据板卡自动选择WiFi库

#### wifi_begin
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 连接WiFi网络
**值输入**:
- `SSID`: 字符串输入 - WiFi名称
- `PASSWORD`: 字符串输入 - WiFi密码
**生成代码**: `WiFi.begin(ssid, password);`

#### wifi_status
**类型**: 值块 (output: Boolean)
**描述**: 获取WiFi连接状态
**生成代码**: `WiFi.status()`

#### wifi_local_ip
**类型**: 值块 (output: String)
**描述**: 获取WiFi本地IP地址
**生成代码**: `WiFi.localIP()`

### MQTT客户端块

#### pubsub_create
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 创建MQTT客户端，配置服务器和SSL
**字段**:
- `NAME`: 文本输入 - 客户端名称 (默认: "mqttClient")
- `CLIENT`: 文本输入 - 网络客户端名称 (默认: "client")
- `SSL`: 复选框 - 是否启用SSL加密 (默认: false)
- `SERVER`: 文本输入 - 服务器地址 (默认: "broker.diandeng.tech")
- `PORT`: 文本输入 - 端口号 (默认: "1883")
**生成代码**:
```cpp
WiFiClient client;  // 或 WiFiClientSecure client (SSL模式)
PubSubClient mqttClient(client);
mqttClient.setServer("broker.diandeng.tech", 1883);
```
**自动添加**:
- 库引用: `#include <PubSubClient.h>`
- 根据板卡和SSL设置自动选择WiFi客户端库
- 主循环: `mqttClient.loop();`

#### pubsub_set_callback
**类型**: Hat块 (无连接属性)
**描述**: 设置MQTT消息接收回调函数
**字段**:
- `NAME`: 文本输入 - 客户端名称 (默认: "mqttClient")
**语句输入**:
- `NAME`: 收到消息时执行的代码
**生成代码**:
```cpp
void mqttClient_callback(char* topic, byte* payload, unsigned int length) {
  char* payload_str = (char*)malloc(length + 1);
  memcpy(payload_str, payload, length);
  payload_str[length] = '\0';
  // 用户代码
  free(payload_str);
}
// setup中: mqttClient.setCallback(mqttClient_callback);
```
**自动添加变量**: topic, payload, payload_str, length

#### pubsub_set_callback_with_topic
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 设置特定主题的回调处理，只能作为pubsub_set_callback的子块使用
**值输入**:
- `TOPIC`: 字符串输入 - 主题名称
**语句输入**:
- `NAME`: 匹配主题时执行的代码
**生成代码**:
```cpp
if (strcmp(topic, "/sub_topic") == 0) {
  // 用户代码
}
```

#### pubsub_connect_with_credentials
**类型**: 值块 (output: Boolean)
**描述**: 使用用户名密码连接MQTT服务器
**字段**:
- `NAME`: 文本输入 - 客户端名称 (默认: "mqttClient")
- `CLIENT_ID`: 文本输入 - 客户端ID
- `USERNAME`: 文本输入 - 用户名
- `PASSWORD`: 文本输入 - 密码
**生成代码**: `mqttClient.connect("clientId", "username", "password")`

#### pubsub_connected
**类型**: 值块 (output: Boolean)
**描述**: 检查MQTT客户端连接状态
**字段**:
- `NAME`: 文本输入 - 客户端名称 (默认: "mqttClient")
**生成代码**: `mqttClient.connected()`

#### pubsub_state
**类型**: 值块 (output: Number)
**描述**: 获取MQTT客户端详细状态码
**字段**:
- `NAME`: 文本输入 - 客户端名称 (默认: "mqttClient")
**生成代码**: `mqttClient.state()`

#### pubsub_subscribe
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 订阅MQTT主题
**字段**:
- `NAME`: 文本输入 - 客户端名称 (默认: "mqttClient")
**值输入**:
- `TOPIC`: 字符串输入 - 主题名称
**生成代码**: `mqttClient.subscribe(topic);`

#### pubsub_publish
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 发布MQTT消息
**字段**:
- `NAME`: 文本输入 - 客户端名称 (默认: "mqttClient")
**值输入**:
- `TOPIC`: 字符串输入 - 主题名称
- `PAYLOAD`: 字符串输入 - 消息内容
**生成代码**: `mqttClient.publish(topic, payload);`

## .abi 文件生成规范

### 块连接规则
- **Hat块**: 无连接属性，通过 `inputs` 连接内部语句
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段

### 工具箱默认配置
部分块预设了影子块：
- `pubsub_set_callback`: 预设嵌套 `pubsub_set_callback_with_topic` 块
- `pubsub_set_callback_with_topic.TOPIC`: 默认字符串 "/sub_topic"
- `pubsub_subscribe.TOPIC`: 默认字符串 "topic"
- `pubsub_publish.TOPIC`: 默认字符串 "topic"
- `pubsub_publish.PAYLOAD`: 默认字符串 "message"

### 变量管理
- MQTT客户端自动创建: `WiFiClient client; PubSubClient mqttClient(client);`
- 回调函数中自动添加变量: topic, payload, payload_str, length
- 回调函数名格式: 客户端名称 + `_callback`

### 智能板卡适配
- **ESP32**: 自动使用 `WiFi.h` 和 `WiFiClientSecure.h`
- **Arduino UNO R4 WiFi**: 自动使用 `WiFiS3.h` 和 `WiFiSSLClient.h`
- **以太网模块**: 自动使用 `Ethernet.h`

## 使用示例

### 基本MQTT连接
```json
{
  "type": "pubsub_create",
  "fields": {
    "NAME": "mqttClient",
    "CLIENT": "client",
    "SSL": false,
    "SERVER": "broker.diandeng.tech",
    "PORT": "1883"
  }
}
```

### WiFi连接示例
```json
{
  "type": "wifi_begin",
  "inputs": {
    "SSID": {"shadow": {"type": "text", "fields": {"TEXT": "your-wifi-ssid"}}},
    "PASSWORD": {"shadow": {"type": "text", "fields": {"TEXT": "your-wifi-password"}}}
  }
}
```

### MQTT回调设置示例
```json
{
  "type": "pubsub_set_callback",
  "fields": {"NAME": "mqttClient"},
  "inputs": {
    "NAME": {
      "block": {
        "type": "pubsub_set_callback_with_topic",
        "inputs": {
          "TOPIC": {"shadow": {"type": "text", "fields": {"TEXT": "/device/topic"}}},
          "NAME": {
            "block": {
              "type": "serial_println",
              "fields": {"SERIAL": "Serial"},
              "inputs": {
                "VAR": {
                  "shadow": {"type": "text", "fields": {"TEXT": ""}},
                  "block": {
                    "type": "variables_get",
                    "fields": {"VAR": {"id": "payload_str_id"}}
                  }
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

### 消息发布示例
```json
{
  "type": "pubsub_publish",
  "fields": {"NAME": "mqttClient"},
  "inputs": {
    "TOPIC": {"shadow": {"type": "text", "fields": {"TEXT": "sensor/temperature"}}},
    "PAYLOAD": {"shadow": {"type": "text", "fields": {"TEXT": "25.6"}}}
  }
}
```

### 连接状态检查示例
```json
{
  "type": "controls_if",
  "inputs": {
    "IF0": {
      "block": {
        "type": "pubsub_connected",
        "fields": {"NAME": "mqttClient"}
      }
    },
    "DO0": {
      "block": {
        "type": "pubsub_publish",
        "fields": {"NAME": "mqttClient"},
        "inputs": {
          "TOPIC": {"shadow": {"type": "text", "fields": {"TEXT": "status"}}},
          "PAYLOAD": {"shadow": {"type": "text", "fields": {"TEXT": "online"}}}
        }
      }
    }
  }
}
```

## 技术特性
- **多平台支持**: ESP32、Arduino UNO R4 WiFi、以太网模块
- **智能适配**: 根据开发板自动选择网络库
- **SSL支持**: 支持加密MQTT连接，自动选择安全客户端
- **回调机制**: 灵活的消息处理回调系统，支持主题过滤
- **状态监控**: 完整的连接状态检查功能
- **自动管理**: 自动添加必要的库引用和循环处理
- **内存安全**: 自动处理payload内存分配和释放

## 注意事项
- 确保设备已连接WiFi或以太网
- MQTT服务器地址和端口必须正确
- 主题名称区分大小写
- 消息负载大小受PubSubClient库限制
- **重要**: `pubsub_set_callback_with_topic` 只能作为 `pubsub_set_callback` 的子块使用
- SSL模式下端口通常为8883
- 回调函数中可使用预定义变量: topic, payload, payload_str, length
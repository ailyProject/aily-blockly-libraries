# MQTT通信 (MQTT Communication) 库

基于PubSubClient的MQTT通信库，支持ESP32、Arduino UNO R4 WiFi等开发板的物联网数据收发。

## 库信息
- **库名**: @aily-project/lib-mqtt
- **版本**: 0.0.1
- **作者**: aily Project
- **描述**: 基于PubSubClient的MQTT支持库，适用于Arduino UNO R4 WiFi、ESP32等开发板
- **兼容**: ESP32、Arduino UNO R4 WiFi
- **电压**: 3.3V、5V
- **测试者**: i3water
- **依赖库**: PubSubClient、WiFi相关库

## 可用模块

### 客户端管理
- **创建MQTT客户端** (`pubsub_create`): 创建MQTT客户端对象，配置服务器和SSL
- **连接认证** (`pubsub_connect_with_credentials`): 使用用户名密码连接MQTT服务器
- **连接状态** (`pubsub_connected`): 检查MQTT客户端连接状态
- **连接状态值** (`pubsub_state`): 获取详细的连接状态码

### 消息订阅
- **订阅主题** (`pubsub_subscribe`): 订阅指定的MQTT主题
- **设置回调** (`pubsub_set_callback`): 设置消息接收回调函数
- **主题回调** (`pubsub_set_callback_with_topic`): 设置特定主题的回调函数，只能作为设置回调的子块使用

### 消息发布
- **发布消息** (`pubsub_publish`): 向指定主题发布消息

### 网络支持
- **WiFi连接** (`wifi_begin`): 连接WiFi网络
- **WiFi状态** (`wifi_connected`): 检查WiFi连接状态
- **本地IP** (`wifi_local_ip`): 获取设备本地IP地址

### 以太网支持
- **以太网初始化** (`ethernet_begin`): 初始化以太网连接
- **以太网状态** (`ethernet_connected`): 检查以太网连接状态

## 使用说明

### 基本连接流程
```cpp
#include <PubSubClient.h>
#include <WiFi.h>

// 自动生成的客户端对象
WiFiClient client;
PubSubClient mqttClient(client);

void setup() {
  // 1. 连接WiFi
  WiFi.begin("yourSSID", "yourPassword");

  // 2. 创建MQTT客户端
  mqttClient.setServer("broker.diandeng.tech", 1883);

  // 3. 连接MQTT服务器
  mqttClient.connect("clientId", "username", "password");

  // 4. 订阅主题
  mqttClient.subscribe("sensor/data");
}

void loop() {
  // 保持MQTT连接
  mqttClient.loop();
}
```

### 消息发布示例
```cpp
// 发布传感器数据
mqttClient.publish("sensor/temperature", "25.6");
mqttClient.publish("sensor/humidity", "60.2");
```

### 消息订阅和回调
```cpp
// 设置消息回调函数
void messageCallback(char* topic, byte* payload, unsigned int length) {
  // 处理接收到的消息
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  if (String(topic) == "control/led") {
    if (message == "ON") {
      digitalWrite(LED_PIN, HIGH);
    } else if (message == "OFF") {
      digitalWrite(LED_PIN, LOW);
    }
  }
}

void setup() {
  // 设置回调函数
  mqttClient.setCallback(messageCallback);
}
```

### 回调函数使用规则
- **设置回调** (`pubsub_set_callback`): 主回调函数，处理所有接收到的消息
- **主题回调** (`pubsub_set_callback_with_topic`): 只能作为"设置回调"的子块使用，不能独立放置
- 主题回调用于处理特定主题的消息，必须嵌套在主回调函数内部

### 智能板卡适配
- **ESP32**: 自动使用WiFi.h库
- **Arduino UNO R4 WiFi**: 自动使用WiFiNINA.h库
- **以太网模块**: 自动使用Ethernet.h库

## 高级功能

### SSL/TLS支持
- 支持SSL加密连接
- 自动选择合适的安全客户端类型
- 适用于需要加密传输的场景

### 多客户端管理
- 支持创建多个MQTT客户端
- 每个客户端可连接不同的服务器
- 独立的回调函数和主题管理

### 连接状态监控
- 实时检查连接状态
- 提供详细的状态码信息
- 支持自动重连机制

## 注意事项
- 确保设备已连接WiFi或以太网
- MQTT服务器地址和端口必须正确
- 主题名称区分大小写
- 消息负载大小受PubSubClient库限制
- 在loop()中调用mqttClient.loop()保持连接
- **重要**: 主题回调块只能作为设置回调块的子块使用，不能独立放置在程序中

## 技术特性
- **多平台支持**: ESP32、Arduino UNO R4 WiFi、以太网模块
- **智能适配**: 根据开发板自动选择网络库
- **SSL支持**: 支持加密MQTT连接
- **回调机制**: 灵活的消息处理回调系统
- **状态监控**: 完整的连接状态检查功能
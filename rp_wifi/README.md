# Pico WiFi 库

树莓派 Pico W WiFi库，提供完整的WiFi连接、热点模式、网络扫描等功能。

## 库信息

- **库名**: @aily-project/lib-rp-wifi
- **版本**: 1.0.0
- **兼容**: Raspberry Pi Pico W (rp2040:rp2040)

## 功能概述

### WiFi连接

| 块 | 功能 | 说明 |
|---|------|------|
| 连接WiFi | 连接到加密WiFi网络 | 阻塞模式，等待连接完成 |
| 连接开放WiFi | 连接无密码网络 | 适用于开放网络 |
| 连接WiFi(非阻塞) | 异步连接 | 需检查connected()状态 |
| 断开WiFi连接 | 断开当前连接 | 可选择是否关闭WiFi |
| 关闭WiFi | 完全关闭WiFi功能 | 释放资源 |

### 状态查询

| 块 | 返回类型 | 说明 |
|---|---------|------|
| WiFi已连接 | Boolean | 检查是否已连接 |
| WiFi连接状态 | Number | 返回状态码 |
| WiFi状态 | Number | 状态常量值 |
| 等待连接结果 | Number | 阻塞等待并返回结果 |

### 网络信息

| 块 | 返回类型 | 说明 |
|---|---------|------|
| 本机IP地址 | String | 获取设备IP |
| 子网掩码 | String | 获取子网掩码 |
| 网关IP地址 | String | 获取网关IP |
| DNS服务器IP | String | 获取DNS服务器 |
| MAC地址 | String | 获取MAC地址 |
| 当前WiFi名称 | String | 获取SSID |
| 信号强度(RSSI) | Number | dBm值 |
| 当前WiFi通道 | Number | 通道号 |

### 网络扫描

| 块 | 返回类型 | 说明 |
|---|---------|------|
| 扫描WiFi网络 | Number | 返回发现的网络数量 |
| 扫描完成状态 | Number | 异步扫描时使用 |
| 删除扫描结果 | - | 释放扫描结果内存 |
| 获取网络SSID | String | 按索引获取 |
| 获取网络信号强度 | Number | 按索引获取 |
| 获取网络加密类型 | Number | 按索引获取 |
| 获取网络通道 | Number | 按索引获取 |

### 热点模式(AP)

| 块 | 功能 | 说明 |
|---|------|------|
| 创建WiFi热点 | 创建加密热点 | 指定SSID、密码、通道 |
| 创建开放WiFi热点 | 创建无密码热点 | 仅需SSID和通道 |
| 配置热点IP | 设置IP配置 | IP、网关、子网掩码 |
| 关闭WiFi热点 | 关闭AP模式 | 可选关闭WiFi |
| 热点IP地址 | 获取热点IP | - |
| 热点连接设备数 | 获取连接数 | - |

### 网络工具

| 块 | 返回类型 | 说明 |
|---|---------|------|
| 解析域名 | String | 域名转IP地址 |
| Ping | Number | 返回响应时间(ms) |
| 获取网络时间 | Number | Unix时间戳 |
| 固件版本 | String | WiFi固件版本 |

## 使用示例

### 基础WiFi连接

```
[arduino_setup]
  ├── [serial_begin] 波特率: 115200
  ├── [rp_wifi_begin] SSID: "MyWiFi", 密码: "password"
  └── [controls_whileUntil] 直到 [rp_wifi_connected]
        └── [time_delay] 1000毫秒

[arduino_loop]
  └── [serial_println] [rp_wifi_local_ip]
```

### 网络扫描

```
[arduino_setup]
  └── [serial_begin] 波特率: 115200

[arduino_loop]
  ├── [variable_set] count = [rp_wifi_scan_networks] 同步扫描
  ├── [controls_for] i 从 0 到 count-1
  │     ├── [serial_print] [rp_wifi_get_ssid] 索引: i
  │     ├── [serial_print] " RSSI: "
  │     └── [serial_println] [rp_wifi_get_rssi] 索引: i
  └── [time_delay] 5000毫秒
```

### 创建热点

```
[arduino_setup]
  ├── [serial_begin] 波特率: 115200
  ├── [rp_wifi_begin_ap] SSID: "PicoW_AP", 密码: "12345678", 通道: 1
  └── [serial_println] [rp_wifi_softap_ip]
```

## WiFi状态码

| 状态 | 值 | 说明 |
|-----|-----|------|
| WL_IDLE_STATUS | 0 | 空闲 |
| WL_NO_SSID_AVAIL | 1 | 找不到SSID |
| WL_SCAN_COMPLETED | 2 | 扫描完成 |
| WL_CONNECTED | 3 | 已连接 |
| WL_CONNECT_FAILED | 4 | 连接失败 |
| WL_CONNECTION_LOST | 5 | 连接丢失 |
| WL_DISCONNECTED | 6 | 断开连接 |

## 加密类型

| 类型 | 说明 |
|-----|------|
| ENC_TYPE_NONE | 无加密 |
| ENC_TYPE_TKIP | WPA |
| ENC_TYPE_CCMP | WPA2 |
| ENC_TYPE_AUTO | 自动 |

## 注意事项

1. **仅支持Pico W**: 此库仅适用于带WiFi功能的Raspberry Pi Pico W
2. **阻塞连接**: 使用`连接WiFi`块会阻塞程序直到连接成功或失败
3. **非阻塞连接**: 使用`连接WiFi(非阻塞)`时需要循环检查`WiFi已连接`状态
4. **热点密码**: 创建加密热点时，密码需要至少8个字符
5. **扫描内存**: 扫描完成后建议使用`删除扫描结果`释放内存

## 相关链接

- [arduino-pico GitHub](https://github.com/earlephilhower/arduino-pico)
- [Raspberry Pi Pico W 文档](https://www.raspberrypi.com/documentation/microcontrollers/raspberry-pi-pico.html)

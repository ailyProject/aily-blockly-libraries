
# Seeed RPC WiFi

Wio Terminal RPC WiFi Blockly 支持无线联网与物联网开发。

## 库信息

| 字段 | 内容 |
|------|------|
| 包名 | @aily-project/lib-seeed-rpcwifi |
| 版本 | 1.0.0 |
| 作者 | SeeedStudio |
| 源码 | https://github.com/Seeed-Studio/Seeed_Arduino_rpcWiFi |
| License | LGPL-2.1 / MIT 混合上游协议 |

## 支持板卡

Wio Terminal / Seeed SAMD 系列，需 RTL8720 无线芯片及 eRPC 固件。

## 块定义

| 块类型 | 连接类型 | 参数（顺序） | 生成代码 | 说明 |
|--------|----------|--------------|----------|------|
| seeed_rpcwifi_set_mode | 语句 | MODE(dropdown) | WiFi.mode(MODE) | 设置WiFi模式 |
| seeed_rpcwifi_begin | 语句 | SSID, PASSWORD | WiFi.begin(ssid, pass) | 连接WiFi |
| seeed_rpcwifi_connect_wait | 语句 | SSID, PASSWORD, TIMEOUT | 连接并等待 |
| seeed_rpcwifi_disconnect | 语句 | WIFI_OFF, ERASE_AP | WiFi.disconnect | 断开WiFi |
| seeed_rpcwifi_reconnect | 值 |  | WiFi.reconnect() | 重新连接 |
| seeed_rpcwifi_status | 值 |  | WiFi.status() | 获取状态码 |
| seeed_rpcwifi_status_type | 值 | STATUS(dropdown) | 常量 | 状态常量 |
| seeed_rpcwifi_is_connected | 值 |  | WiFi.isConnected() | 是否已连接 |
| seeed_rpcwifi_wait_for_connect_result | 值 |  | WiFi.waitForConnectResult() | 等待连接结果 |
| seeed_rpcwifi_local_ip | 值 |  | WiFi.localIP() | 本机IP |
| seeed_rpcwifi_mac_address | 值 |  | WiFi.macAddress() | MAC地址 |
| seeed_rpcwifi_current_ssid | 值 |  | WiFi.SSID() | 当前SSID |
| seeed_rpcwifi_rssi | 值 |  | WiFi.RSSI() | 信号强度 |
| seeed_rpcwifi_set_auto_reconnect | 语句 | ENABLE(dropdown) | WiFi.setAutoReconnect | 自动重连 |
| seeed_rpcwifi_mode_value | 值 | MODE(dropdown) | 常量 | 模式常量 |
| seeed_rpcwifi_firmware_version | 值 |  | rpc_system_version() | 固件版本 |
| ... | ... | ... | ... | ... |

> 更多块类型、参数和生成代码详见 readme_ai.md。

## 字段类型映射

- `input_value`：输入参数，可连接表达式块
- `field_dropdown`：下拉选项，常用于模式/类型/方法
- `field_variable`：变量选择，支持多实例对象
- `field_input`：文本输入，常用于对象名/IP等
- `field_number`：数字输入

## 连接规则

- 语句块可串联于 setup/loop
- 值块可用于表达式、条件、串口输出等
- 对象方法块需先用“创建对象”块初始化
- WebServer 路由块需在 setup 注册，响应块放在 HANDLER 内

## 使用示例

**连接WiFi并HTTP GET**

```abs
arduino_setup()
	serial_begin(Serial, 115200)
	seeed_rpcwifi_connect_wait(text("yourNetwork"), text("yourPassword"), math_number(15000))
	seeed_rpcwifi_http_create("http")
	seeed_rpcwifi_http_begin($http, text("http://www.example.com/index.html"))
	serial_println(Serial, seeed_rpcwifi_http_request($http, GET, text("")))
	serial_println(Serial, seeed_rpcwifi_http_get_string($http))
	seeed_rpcwifi_http_end($http)
```

**AP + DNS + WebServer**

```abs
arduino_setup()
	seeed_rpcwifi_set_mode(WIFI_AP)
	seeed_rpcwifi_softap(text("WioAP"), text("12345678"), math_number(11), FALSE, math_number(4))
	seeed_rpcwifi_dns_create("dns")
	seeed_rpcwifi_dns_start_captive($dns)
	seeed_rpcwifi_webserver_create("server", 80)
	seeed_rpcwifi_webserver_on($server, text("/"), HTTP_GET)
		@HANDLER:
			seeed_rpcwifi_webserver_send($server, math_number(200), text("text/plain"), text("hello from Wio Terminal"))
	seeed_rpcwifi_webserver_begin($server)

arduino_loop()
	seeed_rpcwifi_dns_process($dns)
	seeed_rpcwifi_webserver_handle_client($server)
```

## 重要规则

1. 需先升级 RTL8720 eRPC 固件，板卡为 Seeed SAMD。
2. WiFi 连接块需在 HTTP/WebServer/mDNS/云服务等块前调用。
3. WebServer 路由块注册回调，响应块放在 HANDLER 内。
4. DNS 强制门户需 AP 模式并在 loop 调用 dns_process。
5. WiFiManager 自动配网阻塞，配置门户激活时需手动退出。
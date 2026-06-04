# WiFi OTA 使用说明

这份文档描述 WiFi OTA 积木生成的固件行为。该库不会在调用过程中自动初始化 `Serial`，也不会通过串口输出状态事件或 JSON 数据。

## 固件侧行为

放置`快速启动 WiFi OTA`块后，生成代码会做以下事情：

- 自动按当前开发板选择 WiFi 库，等价于高级初始化里的`WIFI_AUTO`。
- 启用 mDNS 端口发现。
- 使用`WiFi.localIP()`启动 WiFi OTA 服务。
- OTA 名称固定为`Arduino`。
- OTA 用户名固定为`arduino`。
- OTA 密码固定为`password`。
- OTA 端口使用库默认端口`65280`。
- OTA 上传路径使用`/sketch`。
- 自动向`loop()`插入`ArduinoOTA.poll();`。
- 不添加任何`Serial.begin()`、`Serial.print()`或`Serial.flush()`代码。

用户工程必须先连接 WiFi，再执行`快速启动 WiFi OTA`。如果设备未连接 WiFi，OTA 服务可能无法被正确发现或访问。

`初始化 WiFi OTA`块默认使用当前 WiFi 和`InternalStorage`启动 OTA 服务；该块允许用户设置 OTA 名称和密码，但不会自动向`loop()`插入`ArduinoOTA.poll();`。使用该块时，用户需要手动在`loop()`中放置`轮询 WiFi OTA 更新请求`块，默认名称和密码仍为`Arduino/password`。

`高级初始化 WiFi OTA`块用于需要手动选择网络库、存储对象或 mDNS 发现方式的项目，例如 Ethernet、EthernetENC、WiFi101、WiFiS3、WiFiEspAT 或 SDStorage。该块同样不会自动加入轮询。若选择禁用 mDNS 端口，IDE 或用户需要通过其他方式获得设备 IP 后再执行 OTA 上传。

## 事件块

事件块只注册 ArduinoOTA 的用户回调，不会额外输出串口状态：

| 事件块 | 触发时机 |
|---|---|
| `当 WiFi OTA 开始上传时` | 设备开始处理 OTA 上传请求时 |
| `当 WiFi OTA 应用更新前` | 固件写入完成并即将应用更新前 |
| `当 WiFi OTA 出错` | OTA 请求失败时 |

如果用户没有放置事件块，对应回调会保持为空，不会产生额外行为。

## OTA 上传命令

PC 端编译出固件`.bin`后，可调用 Arduino OTA 工具上传：

```bash
arduinoOTA -address <ip> -port 65280 -username arduino -password <password> -sketch <firmware.bin> -upload /sketch -b
```

字段来源：

| 参数 | 来源 |
|---|---|
| `<ip>` | mDNS/网络发现结果，或用户手动输入的设备 IP |
| `-port` | 默认`65280` |
| `-username` | 固定`arduino` |
| `-password` | `快速启动 WiFi OTA`固定为`password`；手动/高级初始化取块中配置的密码，默认`password` |
| `<firmware.bin>` | IDE 编译输出的固件文件 |
| `-upload` | 默认`/sketch` |

Windows 下工具名通常是`arduinoOTA.exe`。IDE 应优先从 Arduino 工具链路径中查找，也可以允许用户配置工具路径。

## IDE 实现建议

1. 不要依赖该库输出串口 ready/error 事件；生成代码不会提供这类输出。
2. 上传前确认当前工程已包含`快速启动 WiFi OTA`块，或同时包含`初始化 WiFi OTA`和轮询块，否则下次上传后设备可能失去 OTA 能力。
3. 上传过程中不要主动复位设备；固件接收完成后 ArduinoOTA 会按库逻辑应用更新并重启。
4. 上传命令建议设置较长超时，例如 60 秒以上；大固件或慢网络可能超过 Arduino IDE 默认 10 秒。
5. 如果 mDNS 发现失败，应提示用户确认设备 IP、网络连接和 OTA 端口。

## 安全说明

`快速启动 WiFi OTA`为了降低使用门槛，用户名和密码固定为`arduino/password`。该方案适合教学、局域网和受控环境。手动和高级初始化块允许修改密码；IDE 需要让上传命令使用与项目块配置一致的密码。若后续面向公开或复杂网络，建议增加项目级 OTA 密码配置，并让生成器和上传命令使用同一配置值。
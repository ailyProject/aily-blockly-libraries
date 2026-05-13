# ArduinoOTA IDE集成方案

这份文档描述“快速启动 OTA”块生成的固件行为，以及PC端IDE需要实现的监听、状态显示和上传流程。

## 固件侧固定行为

用户放置`快速启动 OTA`块后，生成代码会做以下事情：

- 自动按当前开发板选择WiFi库，等价于原来的`WIFI_AUTO`。
- 启用mDNS端口发现。
- 使用`WiFi.localIP()`启动OTA服务。
- OTA名称固定为`Arduino`。
- OTA用户名固定为`arduino`。
- OTA密码固定为`password`。
- OTA端口固定为`65280`。
- OTA上传路径固定为`/sketch`。
- 自动向`loop()`插入`ArduinoOTA.poll();`。
- 自动初始化`Serial`为`115200`，并通过串口输出OTA状态事件。

用户工程必须先连接WiFi，再执行`快速启动 OTA`。如果设备未连接WiFi，`ready`事件中的IP可能是`0.0.0.0`，PC端应视为不可上传。

`初始化 OTA`块执行相同的OTA服务初始化和串口事件输出，但不会自动向`loop()`插入`ArduinoOTA.poll();`。使用该块时，用户需要手动在`loop()`中放置`轮询 ArduinoOTA 更新请求`块。

## 串口事件协议

串口参数：`115200 8N1`。

数据格式：每行一个JSON对象，行尾为`\n`。PC端只处理`type`等于`aily_ota`的行，其他串口输出全部忽略。

通用字段：

```json
{
  "type": "aily_ota",
  "version": 1,
  "event": "ready"
}
```

事件列表：

| event | 方向 | 含义 | 字段 |
|---|---|---|---|
| `ready` | 设备到PC | OTA服务已启动 | `ip`, `port`, `name`, `authUser`, `uploadPath` |
| `upload_start` | 设备到PC | 设备已收到OTA上传请求 | `code` |
| `before_apply` | 设备到PC | 固件已接收完成，即将应用并重启 | `code` |
| `error` | 设备到PC | OTA请求失败 | `code`, `message` |

`ready`示例：

```json
{"type":"aily_ota","version":1,"event":"ready","ip":"192.168.1.35","port":65280,"name":"Arduino","authUser":"arduino","uploadPath":"/sketch"}
```

`upload_start`示例：

```json
{"type":"aily_ota","version":1,"event":"upload_start","code":0}
```

`before_apply`示例：

```json
{"type":"aily_ota","version":1,"event":"before_apply","code":0}
```

`error`示例：

```json
{"type":"aily_ota","version":1,"event":"error","code":401,"message":"Unauthorized"}
```

## PC端状态机

推荐状态：

| 状态 | 触发条件 | IDE行为 |
|---|---|---|
| `DISCONNECTED` | 未打开串口或串口断开 | 禁用OTA上传按钮 |
| `WAIT_READY` | 串口已打开但尚未收到有效`ready` | 显示等待设备OTA就绪 |
| `READY` | 收到`ready`且IP不是`0.0.0.0` | 记录IP和端口，启用OTA上传 |
| `BUILDING` | 用户点击无线上传 | 编译当前工程生成`.bin` |
| `UPLOADING` | 启动`arduinoOTA`上传命令 | 显示上传中 |
| `DEVICE_ACCEPTED` | 收到`upload_start` | 显示设备已开始接收 |
| `REBOOTING` | 收到`before_apply`或上传命令成功结束 | 等待设备重启并重新输出`ready` |
| `ERROR` | 收到`error`或上传命令失败/超时 | 显示错误信息，允许重试 |

PC端需要缓存最近一次有效`ready`事件。串口重连、设备重启、IP变化时，以新的`ready`为准。

## OTA上传命令

PC端编译出固件`.bin`后，调用Arduino OTA工具上传：

```bash
arduinoOTA -address <ip> -port <port> -username arduino -password password -sketch <firmware.bin> -upload /sketch -b
```

字段来源：

| 参数 | 来源 |
|---|---|
| `<ip>` | `ready.ip` |
| `<port>` | `ready.port`，默认`65280` |
| `-username` | 固定`arduino` |
| `-password` | 固定`password` |
| `<firmware.bin>` | IDE编译输出的固件文件 |
| `-upload` | `ready.uploadPath`，默认`/sketch` |

Windows下工具名通常是`arduinoOTA.exe`。IDE应优先从Arduino工具链路径中查找，也可以允许用户配置工具路径。

## IDE实现建议

1. 打开串口监视通道时，不要阻塞用户普通串口输出；只解析完整行中合法的`aily_ota` JSON。
2. 收到`ready`后，在设备面板显示IP、端口和OTA就绪状态。
3. 上传前确认当前工程已包含`快速启动 OTA`块，或同时包含`初始化 OTA`和轮询块，否则下次上传后设备可能失去OTA能力。
4. 上传过程中不要主动复位设备；收到`before_apply`后设备会自行应用更新并重启。
5. 上传命令建议设置较长超时，例如60秒以上；大固件或慢网络可能超过Arduino IDE默认10秒。
6. 如果mDNS端口发现失败，仍然使用串口`ready.ip`执行IP上传。
7. 如果收到`error`，优先展示`message`，并保留上传命令 stderr 作为详细日志。

## 安全说明

当前简化块为了降低使用门槛，用户名和密码固定为`arduino/password`。该方案适合教学、局域网和受控环境。若IDE后续需要面向公开或复杂网络，应增加项目级OTA密码配置，并让生成器和PC端上传命令使用同一配置值。
# ArduinoOTA

ArduinoOTA网络固件更新库。当前封装已简化为一个“初始化OTA”块和一个停止块：初始化后自动注册OTA事件、自动向`loop()`添加轮询，并通过串口向PC端IDE输出标准事件。

## 库信息

| 字段 | 值 |
|------|----|
| 包名 | @aily-project/lib-arduinoota |
| 版本 | 1.1.1 |
| 作者 | Arduino, Juraj Andrassy |
| 来源 | https://github.com/jandrassy/ArduinoOTA |
| 许可证 | LGPL-2.1-or-later |

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|-----------|----------|----------|
| `arduinoota_config_begin` | 语句 | 无 | `arduinoota_config_begin()` | 注册PC端事件回调，使用`WiFi.localIP()`、名称`Arduino`、密码`password`启动OTA，并自动向`loop()`添加`ArduinoOTA.poll();` |
| `arduinoota_end` | 语句 | 无 | `arduinoota_end()` | `ArduinoOTA.end();` |
| `arduinoota_poll` | 隐藏兼容块 | 无 | `arduinoota_poll()` | `ArduinoOTA.poll();` |
| `arduinoota_on_start` | 隐藏兼容块 | HANDLER | `arduinoota_on_start()` | `ArduinoOTA.onStart(callback);` |
| `arduinoota_before_apply` | 隐藏兼容块 | HANDLER | `arduinoota_before_apply()` | `ArduinoOTA.beforeApply(callback);` |
| `arduinoota_on_error` | 隐藏兼容块 | CODE_VAR, MESSAGE_VAR, HANDLER | `arduinoota_on_error("code", "message")` | `ArduinoOTA.onError(callback);` |

## 默认行为

- 网络模式固定为WiFi自动选择。
- 端口发现固定启用mDNS自动发现。
- OTA名称固定为`Arduino`。
- OTA用户名固定为`arduino`。
- OTA密码固定为`password`。
- OTA端口固定为`65280`。
- 上传路径为`/sketch`。
- PC通信使用`Serial`，波特率`115200`，每行一个JSON对象。

## 连接规则

初始化和停止块可串接到setup/loop流程。轮询块和事件块保留生成器兼容能力，但不再显示到工具箱。

## 使用示例

先连接WiFi，再在setup中放置“初始化OTA”。用户不需要手动放置轮询块。

## 重要规则

`初始化OTA`会自动输出`type`为`aily_ota`的串口事件，PC端IDE可据此发现设备IP、执行上传并显示上传状态。IDE端协议见`use.md`。
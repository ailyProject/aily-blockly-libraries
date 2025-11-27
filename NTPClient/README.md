# NTPClient

NTP 时间同步块，基于 Arduino NTPClient 库，用于获取网络时间并提供常用时间字段（小时/分/秒/星期/格式化字符串/Unix 时间戳）。

## 库信息
- **库名**: @aily-project/lib-ntpclient
- **版本**: 3.2.1
- **兼容**: Arduino / ESP32 / ESP8266 等

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi 格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `ntpclient_create_with_params` | 语句块 | SERVER(input_value), OFFSET(input_value) | `"inputs":{"SERVER":...,"OFFSET":...}` | `NTPClient timeClient(ntpUDP, server, offset); timeClient.begin();` (generator 注释实现，实际生成器隐式声明 `timeClient`)
| `ntpclient_update` | 语句块 | 无 | 无 | `timeClient.update();` |
| `ntpclient_force_update` | 语句块 | 无 | 无 | `timeClient.forceUpdate();` |
| `ntpclient_get_formatted_time` | 值块 | 无 | 无 | `timeClient.getFormattedTime()` |
| `ntpclient_get_epoch_time` | 值块 | 无 | 无 | `timeClient.getEpochTime()` |
| `ntpclient_get_hours` | 值块 | 无 | 无 | `timeClient.getHours()` |
| `ntpclient_get_minutes` | 值块 | 无 | 无 | `timeClient.getMinutes()` |
| `ntpclient_get_seconds` | 值块 | 无 | 无 | `timeClient.getSeconds()` |
| `ntpclient_get_day` | 值块 | 无 | 无 | `timeClient.getDay()` |
| `ntpclient_is_time_set` | 值块 | 无 | 无 | `timeClient.isTimeSet()` |
| `ntpclient_set_time_offset` | 语句块 | OFFSET(input_value) | `"inputs":{"OFFSET":...}` | `timeClient.setTimeOffset(offset);` |
| `ntpclient_set_update_interval` | 语句块 | INTERVAL(input_value) | `"inputs":{"INTERVAL":...}` | `timeClient.setUpdateInterval(interval);` |
| `ntpclient_set_pool_server_name` | 语句块 | SERVER(input_value) | `"inputs":{"SERVER":...}` | `timeClient.setPoolServerName(server);` |
| `ntpclient_end` | 语句块 | 无 | 无 | `timeClient.end();` |

## 字段类型映射

| 类型 | .abi 格式 | 示例 |
|------|----------|------|
| input_value | 块连接 | `"inputs": {"SERVER": {"block": {...}}}`
| field_number/text (作为输入块) | 数值/字符串 | `{"block": {"type":"math_number","fields":{"NUM":"28800"}}}` 或 `{"block": {"type":"text","fields":{"TEXT":"pool.ntp.org"}}}`

## 连接规则

- **语句块**: 拥有 `previousStatement`/`nextStatement`，通过 `next` 链接（例如 `ntpclient_update`）。
- **值块**: 有 `output`，作为表达式插入 `inputs`（例如 `ntpclient_get_formatted_time`）。
- **隐式客户端**: 生成器会在需要时声明 `timeClient` 对象并引入 `ntpUDP`，因此大部分块不需要显式变量字段。

## 使用示例

### 使用默认客户端更新时间
```json
{
  "type": "ntpclient_update",
  "id": "update1"
}
```

### 初始化并设置服务器与时区偏移（示例 ABI）
```json
{
  "type": "ntpclient_create_with_params",
  "id": "create1",
  "inputs": {
    "SERVER": {"block": {"type": "text", "fields": {"TEXT": "cn.pool.ntp.org"}}},
    "OFFSET": {"block": {"type": "math_number", "fields": {"NUM": "28800"}}}
  }
}
```

### 获取格式化时间并打印（示例嵌套）
```json
{
  "type": "serial_print",
  "id": "print_time",
  "inputs": {
    "CONTENT": {"block": {"type": "ntpclient_get_formatted_time"}}
  }
}
```

## 重要规则

1. **必须遵守**: 在调用 NTP 功能前确保已连接到网络（WiFi）。生成器会添加必要头文件，但不会替你连接网络。 
2. **隐式实例**: 当前实现使用隐式 `timeClient`（generator 在需要时声明）；不要依赖自定义变量名，或请先同步修改 `generator.js` 与 `block.json`。
3. **单位**: 时区偏移单位为秒（例如中国北京时间为 `28800`）。
4. **性能注意**: 避免在短时间内频繁调用 `update()`；使用 `setUpdateInterval` 控制自动更新频率。

## 生成器实现要点

- 自动添加库：`WiFi` / `WiFiS3`（根据 `boardConfig`）、`WiFiUdp`、`NTPClient`。
- 自动声明：`WiFiUDP ntpUDP;` 和 `NTPClient timeClient(ntpUDP);`（generator 使用 `timeClient` 作为默认对象名）。
- 大多数块在生成时代码中会调用 `generator.addObject('WiFiUDP ntpUDP', 'WiFiUDP ntpUDP;')` 与 `generator.addObject('NTPClient timeClient', 'NTPClient timeClient(ntpUDP);')`，因此无需用户手动创建对象。

## 常见错误

- ❌ 未连接 WiFi 即调用 NTP 块。
- ❌ 把时区偏移当作小时填写（应为秒）。
- ❌ 期望使用自定义变量名但未在 generator 中同步声明/查找。

## 典型时区偏移

- 北京时间 (UTC+8): `28800` 秒
- 东京时间 (UTC+9): `32400` 秒
- 纽约时间 (UTC-5): `-18000` 秒
- 伦敦时间 (UTC+0): `0` 秒

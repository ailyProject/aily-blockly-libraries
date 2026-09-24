# 空气质量 WAQI (lib-waqi)

waqi.info（aqicn.org）接口数据获取、解析与 GxEPD2 墨水屏监测界面绘制。

## Library Info

- **Name**: @aily-project/lib-waqi
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `waqi_begin` | Statement | WIFI_SSID(field_input), WIFI_PASS(field_input) | `waqi_begin("MyWiFi", "MyPass123456")` | `waqi.begin("MyWiFi", "MyPass123456");` |
| `waqi_fetch` | Value (Boolean) | STATION(field_input), TOKEN(field_input) | `waqi_fetch("10214", "YOUR_TOKEN")` | `waqi.fetch("10214", "YOUR_TOKEN")` |
| `waqi_draw` | Statement | VAR(field_variable) | `waqi_draw($display)` | `waqi.draw(display);` |
| `waqi_draw_error` | Statement | VAR(field_variable), TEXT(input_value) | `waqi_draw_error($display, text("请检查WiFi或接口令牌"))` | `waqi.drawError(display, "请检查WiFi或接口令牌");` |
| `waqi_aqi` | Value (Number) | (none) | `waqi_aqi()` | `waqi.aqi()` |
| `waqi_level_cn` | Value (String) | (none) | `waqi_level_cn()` | `waqi.levelCn()` |
| `waqi_city` | Value (String) | (none) | `waqi_city()` | `waqi.city()` |
| `waqi_time_short` | Value (String) | (none) | `waqi_time_short()` | `waqi.timeShort()` |
| `waqi_dominentpol` | Value (String) | (none) | `waqi_dominentpol()` | `waqi.dominentpol()` |
| `waqi_pm25` | Value (Number) | (none) | `waqi_pm25()` | `waqi.pm25()` |
| `waqi_pm10` | Value (Number) | (none) | `waqi_pm10()` | `waqi.pm10()` |
| `waqi_temp` | Value (Number) | (none) | `waqi_temp()` | `waqi.temp()` |
| `waqi_hum` | Value (Number) | (none) | `waqi_hum()` | `waqi.hum()` |

## Parameter Options

本库没有下拉枚举参数。`WIFI_SSID`/`WIFI_PASS`/`STATION`/`TOKEN` 均为空默认值的文本输入；`VAR` 为 GxEPD2 类型变量字段（由 lib-gxepd2 的 `gxepd2_setup` 创建）。

## ABS Examples

### 完整监测程序（配合 lib-gxepd2）

```abs
arduino_global()
    variable_define("ok", bool, logic_boolean(false))

arduino_setup()
    serial_begin(Serial, 115200)
    gxepd2_spi_pins(math_number(2), math_number(-1), math_number(3), math_number(7))
    gxepd2_setup("display", C3_GDEW042Z15, math_number(7), math_number(6), math_number(10), math_number(1), "0", "20", TRUE, FALSE)
    gxepd2_set_rotation($display, "0")
    gxepd2_u8g2_begin($display)
    waqi_begin("MyWiFi", "MyPass123456")
    variables_set($ok, waqi_fetch("10214", "YOUR_TOKEN"))
    controls_if()
        @IF0: variables_get($ok)
        @DO0:
            waqi_draw($display)
        @ELSE:
            waqi_draw_error($display, text("请检查WiFi或接口令牌"))
    gxepd2_sleep($display, POWER_OFF)

arduino_loop()
    time_delay(math_number(1800000))
    variables_set($ok, waqi_fetch("10214", "YOUR_TOKEN"))
    controls_if(variables_get($ok))
        waqi_draw($display)
        gxepd2_sleep($display, POWER_OFF)
```

Required libraries: core-loop, core-variables, core-logic, core-serial, core-time, lib-gxepd2, lib-waqi.

## Notes

1. **依赖**：`waqi_draw`/`waqi_draw_error` 的 `VAR` 必须是 lib-gxepd2 `gxepd2_setup` 创建的墨水屏对象（如 `$display`）；绘制为模板实现，支持 GxEPD2_BW/3C/4C/7C 各面板类。网络层使用 ESP32 核心 WiFi/HTTPClient/NetworkClientSecure（HTTPS，不校验证书）。
2. **生命周期**：`waqi_begin` 阻塞连接 WiFi 最多约 20 秒；`waqi_fetch` 在 WiFi 掉线时自动重连一次；`waqi_draw`/`waqi_draw_error` 自带 `setFullWindow/firstPage/nextPage` 分页刷新，内部会从 powerOff 唤醒重初始化（不清屏），不要嵌套在其它分页刷新块里。
3. **分区**：含 WiFi+TLS 固件约 1.6MB，板子分区方案需 Huge APP (3MB)，默认分区会引导失败。
4. **数据规则**：城市名优先取接口括号里的中文名，无则截取第一个逗号前；AQI 分级黄：优=白底、良=25% 网点、轻度=50%、中度及以上=实心黄；UV 预测从数据当天开始绘制（接口对过去日期只给 0）。
5. **建议节奏**：循环 30 分钟（1800000ms）获取一次并重绘，配合 `gxepd2_sleep` 省电；接口令牌请使用自己的 waqi.info token。

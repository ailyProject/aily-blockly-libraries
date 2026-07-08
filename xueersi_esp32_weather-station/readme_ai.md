# 天气站库 (Weather Station)

WiFi自动连接/AP配置门户 + yytianqi天气API获取

## Library Info
- **Name**: @aily-project/lib-weather-station
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ws_auto_connect` | Statement | AP_SSID(field_input) | `ws_auto_connect("WeatherConfig")` | `WS.autoConnect("WeatherConfig");` |
| `ws_config_loop` | Statement | (无) | `ws_config_loop()` | `WS.configLoop();` |
| `ws_is_config_mode` | Value (Boolean) | (无) | `ws_is_config_mode()` | `WS.isConfigMode()` |
| `ws_fetch_weather` | Statement | (无) | `ws_fetch_weather()` | `WS.fetchWeather();` |
| `ws_fetch_weather_result` | Value (Boolean) | (无) | `ws_fetch_weather_result()` | `WS.fetchWeather()` |
| `ws_get_city` | Value (String) | (无) | `ws_get_city()` | `WS.getCity()` |
| `ws_get_temp` | Value (String) | (无) | `ws_get_temp()` | `WS.getTemp()` |
| `ws_get_humidity` | Value (String) | (无) | `ws_get_humidity()` | `WS.getHumidity()` |
| `ws_get_weather` | Value (String) | (无) | `ws_get_weather()` | `WS.getWeather()` |
| `ws_get_wind` | Value (String) | (无) | `ws_get_wind()` | `WS.getWind()` |
| `ws_get_wind_dir` | Value (String) | (无) | `ws_get_wind_dir()` | `WS.getWindDir()` |
| `ws_is_wifi_connected` | Value (Boolean) | (无) | `ws_is_wifi_connected()` | `WS.isWifiConnected()` |
| `ws_get_ip` | Value (String) | (无) | `ws_get_ip()` | `WS.getLocalIP()` |
| `ws_save_config` | Statement | SSID(input_value), PASS(input_value), APIKEY(input_value), CITY(input_value) | `ws_save_config(text("MyWiFi"), text("pass"), text("key"), text("101010100"))` | `WS.saveConfig("MyWiFi", "pass", "key", "101010100");` |

## Notes

1. **全局对象**: 库自动声明全局对象 `WS`，所有块直接使用，无需手动创建
2. **ESP32专用**: 依赖WiFi/Preferences/DNSServer，仅支持ESP32
3. **配置流程**: `ws_auto_connect` → 加载NVS → 连接WiFi → 失败则开AP热点 → 手机连热点访问192.168.4.1配置
4. **配置模式**: loop中必须用 `ws_is_config_mode` 判断，配置模式下调用 `ws_config_loop` 处理请求
5. **天气API**: 使用yytianqi观察接口，城市编码参考中国气象局城市代码
6. **返回值类型**: 温度/湿度等返回String类型，湿度已含%号

# OpenWeatherMap

访问OpenWeatherMap API获取天气数据，支持当前天气、5天预报、空气质量和地理编码。

## 库信息
- **库名**: @aily-project/lib-openweathermap
- **版本**: 1.0.0
- **兼容**: ESP32系列, Arduino UNO R4 WiFi

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `owm_init` | 语句块 | VAR(field_input), API_KEY(input) | `"VAR":"weather"` | `weather.begin(apiKey);` |
| `owm_set_units` | 语句块 | VAR(field_variable), UNITS(dropdown) | `"UNITS":"OWM_UNITS_METRIC"` | `weather.setUnits(units);` |
| `owm_set_language` | 语句块 | VAR(field_variable), LANG(dropdown) | `"LANG":"zh_cn"` | `weather.setLanguage("zh_cn");` |
| `owm_set_debug` | 语句块 | VAR(field_variable), DEBUG(dropdown) | `"DEBUG":"true"` | `weather.setDebug(true);` |
| `owm_get_weather_by_city` | 值块 | VAR(field_variable), CITY(input), COUNTRY(input) | - | `weather.getCurrentWeatherByCity()` |
| `owm_get_weather_by_coords` | 值块 | VAR(field_variable), LAT(input), LON(input) | - | `weather.getCurrentWeather()` |
| `owm_weather_data` | 值块 | VAR(field_variable), DATA(dropdown) | `"DATA":"temp"` | `_owm_weather_xxx.main.temp` |
| `owm_get_forecast` | 值块 | VAR(field_variable), LAT/LON/COUNT(input) | - | `weather.getForecast()` |
| `owm_get_forecast_by_city` | 值块 | VAR(field_variable), CITY/COUNTRY/COUNT(input) | - | `weather.getForecastByCity()` |
| `owm_forecast_count` | 值块 | VAR(field_variable) | - | `_owm_forecast_xxx.cnt` |
| `owm_forecast_data` | 值块 | VAR(field_variable), INDEX(input), DATA(dropdown) | `"DATA":"temp"` | `_owm_forecast_xxx.items[i].main.temp` |
| `owm_get_air_pollution` | 值块 | VAR(field_variable), LAT/LON(input) | - | `weather.getAirPollution()` |
| `owm_air_pollution_data` | 值块 | VAR(field_variable), DATA(dropdown) | `"DATA":"aqi"` | `_owm_air_xxx.aqi` |
| `owm_aqi_description` | 值块 | AQI(input) | - | `OpenWeatherMap::getAQIDescription()` |
| `owm_get_coords_by_city` | 值块 | VAR(field_variable), CITY/COUNTRY(input) | - | `weather.getCoordinatesByName()` |
| `owm_get_coords_by_zip` | 值块 | VAR(field_variable), ZIP/COUNTRY(input) | - | `weather.getCoordinatesByZip()` |
| `owm_get_location_by_coords` | 值块 | VAR(field_variable), LAT/LON(input) | - | `weather.getLocationByCoordinates()` |
| `owm_geo_data` | 值块 | VAR(field_variable), DATA(dropdown) | `"DATA":"name"` | `_owm_geo_xxx.name` |
| `owm_get_icon_url` | 值块 | ICON(input) | - | `OpenWeatherMap::getIconURL()` |
| `owm_get_last_error` | 值块 | VAR(field_variable) | - | `weather.getLastError()` |
| `owm_get_http_code` | 值块 | VAR(field_variable) | - | `weather.getLastHttpCode()` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "weather"` |
| field_dropdown | 字符串 | `"UNITS": "OWM_UNITS_METRIC"` |
| field_variable | 对象 | `"VAR": {"id": "var_id"}` |
| input_value | 块连接 | `"inputs": {"CITY": {"shadow": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **变量类型**: `OpenWeatherMap`

### 单位选项
- `OWM_UNITS_METRIC` - 公制(摄氏度, m/s)
- `OWM_UNITS_IMPERIAL` - 英制(华氏度, mph)
- `OWM_UNITS_STANDARD` - 标准(开尔文, m/s)

### 语言选项
`zh_cn`, `en`, `ja`, `kr`, `de`, `fr`, `es`, `ru`

### 天气数据选项
`name`, `country`, `weather_main`, `weather_description`, `weather_icon`, `temp`, `feels_like`, `temp_min`, `temp_max`, `humidity`, `pressure`, `wind_speed`, `wind_deg`, `clouds`, `visibility`, `sunrise`, `sunset`

### 预报数据选项
`dt_txt`, `weather_main`, `weather_description`, `temp`, `feels_like`, `temp_min`, `temp_max`, `humidity`, `pressure`, `wind_speed`, `clouds`, `pop`, `rain_3h`, `snow_3h`

### 空气质量数据选项
`aqi`, `co`, `no`, `no2`, `o3`, `so2`, `pm2_5`, `pm10`, `nh3`

### 位置数据选项
`name`, `country`, `state`, `lat`, `lon`

## 使用示例

### 初始化与获取天气
```json
{
  "type": "owm_init",
  "id": "init_id",
  "fields": {"VAR": "weather"},
  "inputs": {
    "API_KEY": {
      "shadow": {"type": "text", "fields": {"TEXT": "your-api-key"}}
    }
  },
  "next": {
    "block": {
      "type": "owm_set_units",
      "id": "units_id",
      "fields": {"VAR": {"id": "weather_var_id"}, "UNITS": "OWM_UNITS_METRIC"}
    }
  }
}
```

### 获取城市天气并输出温度
```json
{
  "type": "controls_if",
  "inputs": {
    "IF0": {
      "block": {
        "type": "owm_get_weather_by_city",
        "fields": {"VAR": {"id": "weather_var_id"}},
        "inputs": {
          "CITY": {"shadow": {"type": "text", "fields": {"TEXT": "Shanghai"}}},
          "COUNTRY": {"shadow": {"type": "text", "fields": {"TEXT": "CN"}}}
        }
      }
    },
    "DO0": {
      "block": {
        "type": "serial_println",
        "inputs": {
          "VAR": {
            "block": {
              "type": "owm_weather_data",
              "fields": {"VAR": {"id": "weather_var_id"}, "DATA": "temp"}
            }
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **必须先初始化**: 使用`owm_init`初始化后才能调用其他方法
2. **需要WiFi连接**: 调用API前必须确保WiFi已连接
3. **API密钥**: 需要在 https://openweathermap.org/api 获取免费API密钥
4. **变量引用**: 初始化块使用`field_input`(字符串)，其他块使用`field_variable`(对象)
5. **先获取再读取**: 必须先调用`get_xxx`方法成功后，才能读取对应数据

## 支持的板卡

- ESP32系列 (ESP32, ESP32-S2, ESP32-S3, ESP32-C3等)
- Arduino UNO R4 WiFi

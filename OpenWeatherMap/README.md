# OpenWeatherMap

访问OpenWeatherMap API获取天气数据，支持当前天气、5天预报、空气质量和地理编码。

## 库信息
- **库名**: @aily-project/lib-openweathermap
- **版本**: 1.0.0
- **兼容**: ESP32系列, Arduino UNO R4 WiFi

## 块定义

### 初始化与配置

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `owm_init` | 语句块 | VAR(field_input), API_KEY(input) | `"VAR":"weather"` | `weather.begin(apiKey);` |
| `owm_set_units` | 语句块 | VAR(field_variable), UNITS(dropdown) | `"UNITS":"OWM_UNITS_METRIC"` | `weather.setUnits(units);` |
| `owm_set_language` | 语句块 | VAR(field_variable), LANG(dropdown) | `"LANG":"zh_cn"` | `weather.setLanguage("zh_cn");` |
| `owm_set_debug` | 语句块 | VAR(field_variable), DEBUG(dropdown) | `"DEBUG":"true"` | `weather.setDebug(true);` |

### 当前天气

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `owm_get_weather_by_city` | 语句块 | VAR(field_variable), CITY(input), COUNTRY(input) | - | `result = weather.getCurrentWeatherByCity(...);` |
| `owm_get_weather_by_coords` | 语句块 | VAR(field_variable), LAT(input), LON(input) | - | `result = weather.getCurrentWeather(...);` |
| `owm_request_success` | 值块 | VAR(field_variable) | - | `_owm_result_weather` |
| `owm_weather_data` | 值块 | VAR(field_variable), DATA(dropdown) | `"DATA":"temp"` | `_owm_weather_xxx.main.temp` |

### 天气预报

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `owm_get_forecast` | 语句块 | VAR(field_variable), LAT/LON/COUNT(input) | - | `result = weather.getForecast(...);` |
| `owm_get_forecast_by_city` | 语句块 | VAR(field_variable), CITY/COUNTRY/COUNT(input) | - | `result = weather.getForecastByCity(...);` |
| `owm_forecast_request_success` | 值块 | VAR(field_variable) | - | `_owm_forecast_result_weather` |
| `owm_forecast_count` | 值块 | VAR(field_variable) | - | `_owm_forecast_xxx.cnt` |
| `owm_forecast_data` | 值块 | VAR(field_variable), INDEX(input), DATA(dropdown) | `"DATA":"temp"` | `_owm_forecast_xxx.items[i].main.temp` |

### 空气质量

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `owm_get_air_pollution` | 语句块 | VAR(field_variable), LAT/LON(input) | - | `result = weather.getAirPollution(...);` |
| `owm_air_pollution_request_success` | 值块 | VAR(field_variable) | - | `_owm_air_result_weather` |
| `owm_air_pollution_data` | 值块 | VAR(field_variable), DATA(dropdown) | `"DATA":"aqi"` | `_owm_air_xxx.aqi` |
| `owm_aqi_description` | 值块 | AQI(input) | - | `OpenWeatherMap::getAQIDescription(aqi)` |

### 地理编码

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `owm_get_coords_by_city` | 语句块 | VAR(field_variable), CITY/COUNTRY(input) | - | `result = weather.getCoordinatesByName(...);` |
| `owm_get_coords_by_zip` | 语句块 | VAR(field_variable), ZIP/COUNTRY(input) | - | `result = weather.getCoordinatesByZip(...);` |
| `owm_get_location_by_coords` | 语句块 | VAR(field_variable), LAT/LON(input) | - | `result = weather.getLocationByCoordinates(...);` |
| `owm_geo_request_success` | 值块 | VAR(field_variable) | - | `_owm_geo_result_weather` |
| `owm_geo_data` | 值块 | VAR(field_variable), DATA(dropdown) | `"DATA":"name"` | `_owm_geo_xxx.name` |

### 工具

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `owm_get_icon_url` | 值块 | ICON(input) | - | `OpenWeatherMap::getIconURL(icon)` |
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

## 下拉选项

### UNITS 单位
| 值 | 说明 |
|----|------|
| `OWM_UNITS_METRIC` | 公制(摄氏度, m/s) |
| `OWM_UNITS_IMPERIAL` | 英制(华氏度, mph) |
| `OWM_UNITS_STANDARD` | 标准(开尔文, m/s) |

### LANG 语言
`zh_cn`, `en`, `ja`, `kr`, `de`, `fr`, `es`, `ru`

### 天气DATA选项
`name`, `country`, `weather_main`, `weather_description`, `weather_icon`, `temp`, `feels_like`, `temp_min`, `temp_max`, `humidity`, `pressure`, `wind_speed`, `wind_deg`, `clouds`, `visibility`, `sunrise`, `sunset`

### 预报DATA选项
`dt_txt`, `weather_main`, `weather_description`, `temp`, `feels_like`, `temp_min`, `temp_max`, `humidity`, `pressure`, `wind_speed`, `clouds`, `pop`, `rain_3h`, `snow_3h`

### 空气质量DATA选项
`aqi`, `co`, `no`, `no2`, `o3`, `so2`, `pm2_5`, `pm10`, `nh3`

### 位置DATA选项
`name`, `country`, `state`, `lat`, `lon`

## 使用示例

### 初始化配置
```json
{
  "type": "owm_init",
  "id": "init_id",
  "fields": {"VAR": "weather"},
  "inputs": {
    "API_KEY": {
      "shadow": {"type": "text", "id": "api_shadow", "fields": {"TEXT": "your-api-key"}}
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

### 请求天气并判断成功
```json
{
  "type": "owm_get_weather_by_city",
  "id": "get_id",
  "fields": {"VAR": {"id": "weather_var_id"}},
  "inputs": {
    "CITY": {"shadow": {"type": "text", "id": "city_id", "fields": {"TEXT": "Shanghai"}}},
    "COUNTRY": {"shadow": {"type": "text", "id": "country_id", "fields": {"TEXT": "CN"}}}
  },
  "next": {
    "block": {
      "type": "controls_if",
      "id": "if_id",
      "inputs": {
        "IF0": {
          "block": {
            "type": "owm_request_success",
            "id": "success_id",
            "fields": {"VAR": {"id": "weather_var_id"}}
          }
        },
        "DO0": {
          "block": {
            "type": "serial_println",
            "id": "print_id",
            "inputs": {
              "VAR": {
                "block": {
                  "type": "owm_weather_data",
                  "id": "data_id",
                  "fields": {"VAR": {"id": "weather_var_id"}, "DATA": "temp"}
                }
              }
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
5. **先请求再读取**: 必须先调用请求块，再用`xxx_request_success`判断成功后，才能读取数据
6. **每类数据独立判断**: 天气/预报/空气质量/地理编码各有独立的请求成功判断块

## 支持的板卡

- ESP32系列 (ESP32, ESP32-S2, ESP32-S3, ESP32-C3, ESP32-C6)
- Arduino UNO R4 WiFi

# OpenWeatherMap Blockly库 - AI使用指南

## 库概述

OpenWeatherMap库用于访问OpenWeatherMap API获取天气数据。支持当前天气、5天预报、空气质量和地理编码功能。

## 变量类型

- **OpenWeatherMap** - 天气服务对象类型

## 块类型详解

### 初始化块
| 块类型 | 说明 | VAR字段类型 |
|--------|------|-------------|
| `owm_init` | 初始化天气服务 | `field_input` (字符串) |

### 配置块
| 块类型 | 说明 | VAR字段类型 |
|--------|------|-------------|
| `owm_set_units` | 设置单位 | `field_variable` (对象) |
| `owm_set_language` | 设置语言 | `field_variable` (对象) |
| `owm_set_debug` | 设置调试模式 | `field_variable` (对象) |

### 数据获取块（值块，返回Boolean）
| 块类型 | 说明 |
|--------|------|
| `owm_get_weather_by_city` | 通过城市获取天气 |
| `owm_get_weather_by_coords` | 通过坐标获取天气 |
| `owm_get_forecast` | 获取天气预报 |
| `owm_get_forecast_by_city` | 通过城市获取预报 |
| `owm_get_air_pollution` | 获取空气质量 |
| `owm_get_coords_by_city` | 查询城市坐标 |
| `owm_get_coords_by_zip` | 查询邮编坐标 |
| `owm_get_location_by_coords` | 反向查询位置 |

### 数据读取块（值块）
| 块类型 | 说明 |
|--------|------|
| `owm_weather_data` | 读取当前天气数据 |
| `owm_forecast_data` | 读取预报数据 |
| `owm_forecast_count` | 预报时间点数量 |
| `owm_air_pollution_data` | 读取空气质量数据 |
| `owm_geo_data` | 读取位置数据 |

### 工具块（值块）
| 块类型 | 说明 |
|--------|------|
| `owm_aqi_description` | 空气质量描述 |
| `owm_get_icon_url` | 天气图标URL |
| `owm_get_last_error` | 最后错误信息 |
| `owm_get_http_code` | 最后HTTP代码 |

## .abi文件格式

### 初始化块（使用field_input）
```json
{
  "type": "owm_init",
  "id": "unique_id",
  "fields": {
    "VAR": "weather"
  },
  "inputs": {
    "API_KEY": {
      "shadow": {
        "type": "text",
        "id": "shadow_id",
        "fields": {"TEXT": "your-api-key"}
      }
    }
  },
  "next": {"block": {...}}
}
```

### 配置块（使用field_variable）
```json
{
  "type": "owm_set_units",
  "id": "unique_id",
  "fields": {
    "VAR": {"id": "weather_variable_id"},
    "UNITS": "OWM_UNITS_METRIC"
  },
  "next": {"block": {...}}
}
```

### 值块用于条件判断
```json
{
  "type": "controls_if",
  "id": "if_id",
  "inputs": {
    "IF0": {
      "block": {
        "type": "owm_get_weather_by_city",
        "id": "get_weather_id",
        "fields": {
          "VAR": {"id": "weather_variable_id"}
        },
        "inputs": {
          "CITY": {
            "shadow": {
              "type": "text",
              "id": "city_shadow_id",
              "fields": {"TEXT": "Shanghai"}
            }
          },
          "COUNTRY": {
            "shadow": {
              "type": "text",
              "id": "country_shadow_id",
              "fields": {"TEXT": "CN"}
            }
          }
        }
      }
    },
    "DO0": {
      "block": {...}
    }
  }
}
```

### 数据读取块
```json
{
  "type": "owm_weather_data",
  "id": "data_id",
  "fields": {
    "VAR": {"id": "weather_variable_id"},
    "DATA": "temp"
  }
}
```

## 下拉选项值

### UNITS 单位
- `OWM_UNITS_METRIC` - 公制
- `OWM_UNITS_IMPERIAL` - 英制
- `OWM_UNITS_STANDARD` - 标准

### LANG 语言
- `zh_cn`, `en`, `ja`, `kr`, `de`, `fr`, `es`, `ru`

### DEBUG 调试
- `true`, `false`

### 天气DATA选项
- `name`, `country`, `weather_main`, `weather_description`, `weather_icon`
- `temp`, `feels_like`, `temp_min`, `temp_max`
- `humidity`, `pressure`, `wind_speed`, `wind_deg`, `clouds`, `visibility`
- `sunrise`, `sunset`

### 预报DATA选项
- `dt_txt`, `weather_main`, `weather_description`
- `temp`, `feels_like`, `temp_min`, `temp_max`
- `humidity`, `pressure`, `wind_speed`, `clouds`
- `pop`, `rain_3h`, `snow_3h`

### 空气质量DATA选项
- `aqi`, `co`, `no`, `no2`, `o3`, `so2`, `pm2_5`, `pm10`, `nh3`

### 位置DATA选项
- `name`, `country`, `state`, `lat`, `lon`

## 变量注册规则

### variables数组
```json
{
  "variables": [
    {"name": "weather", "type": "OpenWeatherMap", "id": "weather_var_id"}
  ]
}
```

### 重要区别
- **初始化块**: `"VAR": "weather"` (字符串)
- **其他块**: `"VAR": {"id": "weather_var_id"}` (对象引用)

## 使用流程

1. **初始化** → `owm_init` 创建天气服务对象
2. **配置** → `owm_set_units`, `owm_set_language` 设置参数
3. **获取数据** → `owm_get_weather_by_city` 等获取数据（返回bool）
4. **读取数据** → `owm_weather_data` 等读取具体值

## 前置条件

- 必须先连接WiFi
- 需要有效的OpenWeatherMap API密钥
- 必须先初始化后才能使用其他块

## 完整示例

```json
{
  "blocks": {
    "languageVersion": 0,
    "blocks": [
      {
        "type": "arduino_setup",
        "id": "setup_id",
        "inputs": {
          "ARDUINO_SETUP": {
            "block": {
              "type": "serial_begin",
              "id": "serial_id",
              "fields": {"SERIAL": "Serial", "SPEED": "115200"},
              "next": {
                "block": {
                  "type": "esp32_wifi_begin",
                  "id": "wifi_id",
                  "inputs": {
                    "SSID": {"shadow": {"type": "text", "fields": {"TEXT": "YourSSID"}}},
                    "PASSWORD": {"shadow": {"type": "text", "fields": {"TEXT": "YourPass"}}}
                  },
                  "next": {
                    "block": {
                      "type": "owm_init",
                      "id": "owm_init_id",
                      "fields": {"VAR": "weather"},
                      "inputs": {
                        "API_KEY": {"shadow": {"type": "text", "fields": {"TEXT": "your-api-key"}}}
                      },
                      "next": {
                        "block": {
                          "type": "owm_set_units",
                          "id": "units_id",
                          "fields": {
                            "VAR": {"id": "weather_var_id"},
                            "UNITS": "OWM_UNITS_METRIC"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    ]
  },
  "variables": [
    {"name": "weather", "type": "OpenWeatherMap", "id": "weather_var_id"}
  ]
}
```

# OpenWeatherMap Blockly库 - AI使用指南

## 库概述

OpenWeatherMap库用于访问OpenWeatherMap API获取天气数据。支持当前天气、5天预报、空气质量和地理编码功能。

**变量类型**: `OpenWeatherMap`

## 块类型详解

### 初始化块（VAR使用field_input）
| 块类型 | 说明 |
|--------|------|
| `owm_init` | 初始化天气服务，创建OpenWeatherMap变量 |

### 配置块（VAR使用field_variable）
| 块类型 | 说明 |
|--------|------|
| `owm_set_units` | 设置单位系统 |
| `owm_set_language` | 设置返回语言 |
| `owm_set_debug` | 设置调试模式 |

### 数据请求块（语句块）
| 块类型 | 说明 |
|--------|------|
| `owm_get_weather_by_city` | 通过城市请求天气 |
| `owm_get_weather_by_coords` | 通过坐标请求天气 |
| `owm_get_forecast` | 通过坐标请求预报 |
| `owm_get_forecast_by_city` | 通过城市请求预报 |
| `owm_get_air_pollution` | 请求空气质量 |
| `owm_get_coords_by_city` | 查询城市坐标 |
| `owm_get_coords_by_zip` | 查询邮编坐标 |
| `owm_get_location_by_coords` | 反向查询位置 |

### 请求状态块（值块，返回Boolean）
| 块类型 | 说明 |
|--------|------|
| `owm_request_success` | 天气请求是否成功 |
| `owm_forecast_request_success` | 预报请求是否成功 |
| `owm_air_pollution_request_success` | 空气质量请求是否成功 |
| `owm_geo_request_success` | 地理编码请求是否成功 |

### 数据读取块（值块）
| 块类型 | 说明 |
|--------|------|
| `owm_weather_data` | 读取当前天气数据 |
| `owm_forecast_count` | 预报时间点数量 |
| `owm_forecast_data` | 读取预报数据 |
| `owm_air_pollution_data` | 读取空气质量数据 |
| `owm_geo_data` | 读取位置数据 |

### 工具块（值块）
| 块类型 | 说明 |
|--------|------|
| `owm_aqi_description` | 空气质量指数描述 |
| `owm_get_icon_url` | 天气图标URL |
| `owm_get_last_error` | 最后错误信息 |
| `owm_get_http_code` | 最后HTTP代码 |

## .abi文件格式

### 初始化块（使用field_input）
```json
{
  "type": "owm_init",
  "id": "init_id",
  "fields": {
    "VAR": "weather"
  },
  "inputs": {
    "API_KEY": {
      "shadow": {
        "type": "text",
        "id": "api_shadow",
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
  "id": "units_id",
  "fields": {
    "VAR": {"id": "weather_var_id"},
    "UNITS": "OWM_UNITS_METRIC"
  },
  "next": {"block": {...}}
}
```

### 请求块（语句块，不是值块）
```json
{
  "type": "owm_get_weather_by_city",
  "id": "get_id",
  "fields": {
    "VAR": {"id": "weather_var_id"}
  },
  "inputs": {
    "CITY": {
      "shadow": {
        "type": "text",
        "id": "city_shadow",
        "fields": {"TEXT": "Shanghai"}
      }
    },
    "COUNTRY": {
      "shadow": {
        "type": "text",
        "id": "country_shadow",
        "fields": {"TEXT": "CN"}
      }
    }
  },
  "next": {"block": {...}}
}
```

### 请求成功判断（用于条件）
```json
{
  "type": "controls_if",
  "id": "if_id",
  "inputs": {
    "IF0": {
      "block": {
        "type": "owm_request_success",
        "id": "success_id",
        "fields": {
          "VAR": {"id": "weather_var_id"}
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
    "VAR": {"id": "weather_var_id"},
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
- **初始化块**: `"VAR": "weather"` (字符串，field_input)
- **其他块**: `"VAR": {"id": "weather_var_id"}` (对象引用，field_variable)

## 使用流程

1. **初始化** → `owm_init` 创建天气服务对象
2. **配置** → `owm_set_units`, `owm_set_language` 设置参数（可选）
3. **请求数据** → `owm_get_weather_by_city` 等发起请求（语句块）
4. **判断成功** → `owm_request_success` 等判断请求是否成功（值块，返回Boolean）
5. **读取数据** → `owm_weather_data` 等读取具体值（值块）

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
                    "SSID": {"shadow": {"type": "text", "id": "ssid_shadow", "fields": {"TEXT": "YourSSID"}}},
                    "PASSWORD": {"shadow": {"type": "text", "id": "pass_shadow", "fields": {"TEXT": "YourPass"}}}
                  },
                  "next": {
                    "block": {
                      "type": "owm_init",
                      "id": "owm_init_id",
                      "fields": {"VAR": "weather"},
                      "inputs": {
                        "API_KEY": {"shadow": {"type": "text", "id": "api_shadow", "fields": {"TEXT": "your-api-key"}}}
                      },
                      "next": {
                        "block": {
                          "type": "owm_set_units",
                          "id": "units_id",
                          "fields": {
                            "VAR": {"id": "weather_var_id"},
                            "UNITS": "OWM_UNITS_METRIC"
                          },
                          "next": {
                            "block": {
                              "type": "owm_get_weather_by_city",
                              "id": "get_weather_id",
                              "fields": {"VAR": {"id": "weather_var_id"}},
                              "inputs": {
                                "CITY": {"shadow": {"type": "text", "id": "city_shadow", "fields": {"TEXT": "Shanghai"}}},
                                "COUNTRY": {"shadow": {"type": "text", "id": "country_shadow", "fields": {"TEXT": "CN"}}}
                              },
                              "next": {
                                "block": {
                                  "type": "controls_if",
                                  "id": "if_success_id",
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
                                              "id": "temp_data_id",
                                              "fields": {
                                                "VAR": {"id": "weather_var_id"},
                                                "DATA": "temp"
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

## 关键规则

1. **请求块是语句块**: `owm_get_weather_by_city`等请求块是语句块，通过`next`连接，不是值块
2. **判断成功用值块**: `owm_request_success`等是值块，用于if条件判断
3. **每类数据独立**: 天气/预报/空气质量/地理编码各有独立的请求成功判断块
4. **先请求后读取**: 必须先执行请求块，判断成功后，才能读取数据

# esp32_wifi

ESP32 WiFi库，包含WiFi连接、SmartConfig、热点模式、网络扫描等WiFi基础功能

## 库信息
- **库名**: @aily-project/lib-esp32-wifi
- **版本**: 1.0.2
- **兼容**: ESP32系列平台

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp32_wifi_begin` | 语句块 | SSID(input_value), PASSWORD(input_value) | `"inputs":{"SSID":{},"PASSWORD":{}}` | `WiFi.begin(ssid, password);` |
| `esp32_wifi_begin_advanced` | 语句块 | SSID(input_value), PASSWORD(input_value), CHANNEL(input_value), BSSID(input_value) | `"inputs":{"SSID":{},"PASSWORD":{},"CHANNEL":{},"BSSID":{}}` | `WiFi.begin(ssid, password, channel, bssid);` |
| `esp32_wifi_disconnect` | 语句块 | ERASE_AP(field_dropdown) | `"fields":{"ERASE_AP":"FALSE"}` | `WiFi.disconnect(false);` |
| `esp32_wifi_status` | 值块 | - | `{}` | `WiFi.status()` |
| `esp32_wifi_status_type` | 值块 | STATUS(field_dropdown) | `"fields":{"STATUS":"WL_CONNECTED"}` | `WL_CONNECTED` |
| `esp32_wifi_is_connected` | 值块 | - | `{}` | `WiFi.isConnected()` |
| `esp32_wifi_local_ip` | 值块 | - | `{}` | `WiFi.localIP().toString()` |
| `esp32_wifi_mac_address` | 值块 | - | `{}` | `WiFi.macAddress()` |
| `esp32_wifi_rssi` | 值块 | - | `{}` | `WiFi.RSSI()` |
| `esp32_wifi_ssid` | 值块 | - | `{}` | `WiFi.SSID()` |
| `esp32_wifi_scan_networks` | 值块 | ASYNC(field_dropdown) | `"fields":{"ASYNC":"FALSE"}` | `WiFi.scanNetworks()` |
| `esp32_wifi_get_ssid` | 值块 | INDEX(input_value) | `"inputs":{"INDEX":{}}` | `WiFi.SSID(index)` |
| `esp32_wifi_get_rssi` | 值块 | INDEX(input_value) | `"inputs":{"INDEX":{}}` | `WiFi.RSSI(index)` |
| `esp32_wifi_get_encryption_type` | 值块 | INDEX(input_value) | `"inputs":{"INDEX":{}}` | `WiFi.encryptionType(index)` |
| `esp32_wifi_encryption_type` | 值块 | TYPE(field_dropdown) | `"fields":{"TYPE":"WIFI_AUTH_WPA2_PSK"}` | `WIFI_AUTH_WPA2_PSK` |
| `esp32_wifi_scan_complete` | 值块 | - | `{}` | `WiFi.scanComplete()` |
| `esp32_wifi_scan_delete` | 语句块 | - | `{}` | `WiFi.scanDelete();` |
| `esp32_wifi_softap` | 语句块 | SSID(input_value), PASSWORD(input_value), CHANNEL(input_value) | `"inputs":{"SSID":{},"PASSWORD":{},"CHANNEL":{}}` | `WiFi.softAP(ssid, password, channel);` |
| `esp32_wifi_softap_config` | 语句块 | IP(field_input), GATEWAY(field_input), SUBNET(field_input) | `"fields":{"IP":"192.168.4.1","GATEWAY":"192.168.4.1","SUBNET":"255.255.255.0"}` | `WiFi.softAPConfig(ip, gateway, subnet);` |
| `esp32_wifi_softap_disconnect` | 语句块 | WIFI_OFF(field_dropdown) | `"fields":{"WIFI_OFF":"FALSE"}` | `WiFi.softAPdisconnect(false);` |
| `esp32_wifi_softap_station_count` | 值块 | - | `{}` | `WiFi.softAPgetStationNum()` |
| `esp32_wifi_softap_ip` | 值块 | - | `{}` | `WiFi.softAPIP().toString()` |
| `esp32_wifi_set_mode` | 语句块 | MODE(field_dropdown) | `"fields":{"MODE":"WIFI_STA"}` | `WiFi.mode(WIFI_STA);` |
| `esp32_wifi_get_mode` | 值块 | - | `{}` | `WiFi.getMode()` |
| `esp32_wifi_mode` | 值块 | MODE(field_dropdown) | `"fields":{"MODE":"WIFI_MODE_STA"}` | `WIFI_MODE_STA` |
| `esp32_wifi_set_auto_reconnect` | 语句块 | AUTO_RECONNECT(field_dropdown) | `"fields":{"AUTO_RECONNECT":"TRUE"}` | `WiFi.setAutoReconnect(true);` |
| `esp32_wifi_wait_for_connect_result` | 值块 | TIMEOUT(input_value) | `"inputs":{"TIMEOUT":{}}` | `WiFi.waitForConnectResult(timeout)` |
| `esp32_wifi_smartconfig_start` | 语句块 | - | `{}` | `WiFi.beginSmartConfig();` |
| `esp32_wifi_smartconfig_stop` | 语句块 | - | `{}` | `WiFi.stopSmartConfig();` |
| `esp32_wifi_smartconfig_done` | 值块 | - | `{}` | `WiFi.smartConfigDone()` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown | 字符串 | `"ERASE_AP": "FALSE"` |
| field_input | 字符串 | `"IP": "192.168.4.1"` |
| input_value | 块连接 | `"inputs": {"SSID": {"block": {...}}}` |

## 连接规则

- **语句块**: begin、disconnect、set_mode等有previousStatement/nextStatement，通过`next`字段连接
- **值块**: status、local_ip、rssi等有output，连接到`inputs`中，无`next`字段
- **特殊规则**: 
  - WiFi功能使用全局WiFi对象，无需变量管理
  - 连接操作是异步的，需要检查状态
  - 扫描结果需要手动删除释放内存

## 使用示例

### WiFi连接
```json
{
  "type": "esp32_wifi_begin",
  "id": "wifi_connect",
  "inputs": {
    "SSID": {
      "block": {
        "type": "text",
        "fields": {"TEXT": "MyWiFi"}
      }
    },
    "PASSWORD": {
      "block": {
        "type": "text",
        "fields": {"TEXT": "MyPassword"}
      }
    }
  }
}
```

### 网络扫描和状态检查
```json
{
  "type": "variables_set",
  "id": "scan_networks",
  "fields": {"VAR": {"id": "network_count", "name": "networkCount", "type": "Number"}},
  "inputs": {
    "VALUE": {
      "block": {
        "type": "esp32_wifi_scan_networks",
        "fields": {"ASYNC": "FALSE"}
      }
    }
  },
  "next": {
    "block": {
      "type": "controls_if",
      "inputs": {
        "IF0": {
          "block": {
            "type": "esp32_wifi_is_connected"
          }
        },
        "DO0": {
          "block": {
            "type": "serial_print",
            "inputs": {
              "CONTENT": {
                "block": {
                  "type": "esp32_wifi_local_ip"
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

### 创建WiFi热点
```json
{
  "type": "esp32_wifi_set_mode",
  "id": "set_ap_mode",
  "fields": {"MODE": "WIFI_AP"},
  "next": {
    "block": {
      "type": "esp32_wifi_softap",
      "inputs": {
        "SSID": {
          "block": {
            "type": "text",
            "fields": {"TEXT": "ESP32_Hotspot"}
          }
        },
        "PASSWORD": {
          "block": {
            "type": "text", 
            "fields": {"TEXT": "12345678"}
          }
        },
        "CHANNEL": {
          "block": {
            "type": "math_number",
            "fields": {"NUM": 1}
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: WiFi操作是异步的，需要使用状态检查块确认连接结果
2. **连接限制**: 语句块可串联执行，值块用于获取状态信息
3. **内存管理**: 网络扫描后必须调用scan_delete释放内存
4. **常见错误**: ❌ 未检查连接状态直接使用，❌ 忘记删除扫描结果，❌ 热点密码少于8位

## 支持的字段选项
- **WiFi模式**: "WIFI_STA"（站点）, "WIFI_AP"（热点）, "WIFI_AP_STA"（混合）, "WIFI_MODE_NULL"（关闭）
- **连接状态**: "WL_CONNECTED"（已连接）, "WL_DISCONNECTED"（已断开）, "WL_CONNECT_FAILED"（连接失败）等
- **加密类型**: "WIFI_AUTH_OPEN"（开放）, "WIFI_AUTH_WPA2_PSK"（WPA2）, "WIFI_AUTH_WPA3_PSK"（WPA3）等
- **扫描模式**: "FALSE"（同步扫描）, "TRUE"（异步扫描）
# Pico WiFi 库 - AI参考文档

树莓派 Pico W WiFi库，用于WiFi连接、热点模式、网络扫描等功能。

## 库信息
- **库名**: @aily-project/lib-rp-wifi
- **版本**: 1.0.0
- **兼容**: rp2040:rp2040 (Pico W)

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `rp_wifi_begin` | 语句块 | SSID(input), PASSWORD(input) | inputs配置 | `WiFi.begin(ssid, pass);` |
| `rp_wifi_begin_open` | 语句块 | SSID(input) | inputs配置 | `WiFi.begin(ssid);` |
| `rp_wifi_begin_noblock` | 语句块 | SSID(input), PASSWORD(input) | inputs配置 | `WiFi.beginNoBlock(ssid, pass);` |
| `rp_wifi_disconnect` | 语句块 | WIFI_OFF(dropdown) | `"WIFI_OFF":"FALSE"` | `WiFi.disconnect(false);` |
| `rp_wifi_end` | 语句块 | 无 | 无字段 | `WiFi.end();` |
| `rp_wifi_connected` | 值块(Boolean) | 无 | 无字段 | `WiFi.connected()` |
| `rp_wifi_status` | 值块(Number) | 无 | 无字段 | `WiFi.status()` |
| `rp_wifi_status_type` | 值块(Number) | STATUS(dropdown) | `"STATUS":"WL_CONNECTED"` | `WL_CONNECTED` |
| `rp_wifi_wait_for_connect` | 值块(Number) | TIMEOUT(input) | inputs配置 | `WiFi.waitForConnectResult(60000)` |
| `rp_wifi_local_ip` | 值块(String) | 无 | 无字段 | `WiFi.localIP().toString()` |
| `rp_wifi_subnet_mask` | 值块(String) | 无 | 无字段 | `WiFi.subnetMask().toString()` |
| `rp_wifi_gateway_ip` | 值块(String) | 无 | 无字段 | `WiFi.gatewayIP().toString()` |
| `rp_wifi_dns_ip` | 值块(String) | 无 | 无字段 | `WiFi.dnsIP().toString()` |
| `rp_wifi_mac_address` | 值块(String) | 无 | 无字段 | `WiFi.macAddress()` |
| `rp_wifi_ssid` | 值块(String) | 无 | 无字段 | `WiFi.SSID()` |
| `rp_wifi_rssi` | 值块(Number) | 无 | 无字段 | `WiFi.RSSI()` |
| `rp_wifi_channel` | 值块(Number) | 无 | 无字段 | `WiFi.channel()` |
| `rp_wifi_encryption_type` | 值块(Number) | 无 | 无字段 | `WiFi.encryptionType()` |
| `rp_wifi_set_hostname` | 语句块 | HOSTNAME(input) | inputs配置 | `WiFi.setHostname(name);` |
| `rp_wifi_get_hostname` | 值块(String) | 无 | 无字段 | `WiFi.getHostname()` |
| `rp_wifi_config_static` | 语句块 | LOCAL_IP,DNS,GATEWAY,SUBNET(field_input) | `"LOCAL_IP":"192.168.1.100"` | `WiFi.config(...)` |
| `rp_wifi_set_dns` | 语句块 | DNS1(field_input) | `"DNS1":"8.8.8.8"` | `WiFi.setDNS(...)` |
| `rp_wifi_set_mode` | 语句块 | MODE(dropdown) | `"MODE":"WIFI_STA"` | `WiFi.mode(WIFI_STA);` |
| `rp_wifi_get_mode` | 值块(Number) | 无 | 无字段 | `WiFi.getMode()` |
| `rp_wifi_scan_networks` | 值块(Number) | ASYNC(dropdown) | `"ASYNC":"FALSE"` | `WiFi.scanNetworks(false)` |
| `rp_wifi_scan_complete` | 值块(Number) | 无 | 无字段 | `WiFi.scanComplete()` |
| `rp_wifi_scan_delete` | 语句块 | 无 | 无字段 | `WiFi.scanDelete();` |
| `rp_wifi_get_ssid` | 值块(String) | INDEX(input) | inputs配置 | `WiFi.SSID(index)` |
| `rp_wifi_get_rssi` | 值块(Number) | INDEX(input) | inputs配置 | `WiFi.RSSI(index)` |
| `rp_wifi_get_encryption` | 值块(Number) | INDEX(input) | inputs配置 | `WiFi.encryptionType(index)` |
| `rp_wifi_get_channel` | 值块(Number) | INDEX(input) | inputs配置 | `WiFi.channel(index)` |
| `rp_wifi_encryption_constant` | 值块(Number) | TYPE(dropdown) | `"TYPE":"ENC_TYPE_CCMP"` | `ENC_TYPE_CCMP` |
| `rp_wifi_begin_ap` | 语句块 | SSID,PASSWORD,CHANNEL(input) | inputs配置 | `WiFi.beginAP(ssid, pass, ch);` |
| `rp_wifi_begin_ap_open` | 语句块 | SSID,CHANNEL(input) | inputs配置 | `WiFi.beginAP(ssid, ch);` |
| `rp_wifi_softap_config` | 语句块 | IP,GATEWAY,SUBNET(field_input) | `"IP":"192.168.4.1"` | `WiFi.softAPConfig(...)` |
| `rp_wifi_softap_disconnect` | 语句块 | WIFI_OFF(dropdown) | `"WIFI_OFF":"FALSE"` | `WiFi.softAPdisconnect(false);` |
| `rp_wifi_softap_ip` | 值块(String) | 无 | 无字段 | `WiFi.softAPIP().toString()` |
| `rp_wifi_softap_mac` | 值块(String) | 无 | 无字段 | `WiFi.softAPmacAddress()` |
| `rp_wifi_softap_ssid` | 值块(String) | 无 | 无字段 | `WiFi.softAPSSID()` |
| `rp_wifi_softap_station_count` | 值块(Number) | 无 | 无字段 | `WiFi.softAPgetStationNum()` |
| `rp_wifi_host_by_name` | 值块(String) | HOSTNAME(input) | inputs配置 | `resolveHostname(host)` |
| `rp_wifi_ping` | 值块(Number) | HOST,TTL(input) | inputs配置 | `WiFi.ping(host, ttl)` |
| `rp_wifi_get_time` | 值块(Number) | 无 | 无字段 | `WiFi.getTime()` |
| `rp_wifi_set_timeout` | 语句块 | TIMEOUT(input) | inputs配置 | `WiFi.setTimeout(ms);` |
| `rp_wifi_no_low_power` | 语句块 | 无 | 无字段 | `WiFi.noLowPowerMode();` |
| `rp_wifi_firmware_version` | 值块(String) | 无 | 无字段 | `WiFi.firmwareVersion()` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"LOCAL_IP": "192.168.1.100"` |
| field_dropdown | 字符串 | `"MODE": "WIFI_STA"` |
| input_value | 块连接 | `"inputs": {"SSID": {"shadow": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **全局对象**: WiFi为全局对象，无需创建实例

## 使用示例

### WiFi连接示例

```json
{
  "type": "rp_wifi_begin",
  "id": "wifi_begin_001",
  "inputs": {
    "SSID": {
      "shadow": {
        "type": "text",
        "id": "ssid_shadow",
        "fields": {"TEXT": "MyWiFi"}
      }
    },
    "PASSWORD": {
      "shadow": {
        "type": "text",
        "id": "pass_shadow",
        "fields": {"TEXT": "password123"}
      }
    }
  },
  "next": {
    "block": {
      "type": "controls_whileUntil",
      "id": "wait_loop",
      "fields": {"MODE": "UNTIL"},
      "inputs": {
        "BOOL": {
          "block": {
            "type": "rp_wifi_connected",
            "id": "connected_check"
          }
        },
        "DO": {
          "block": {
            "type": "time_delay",
            "id": "delay_block",
            "inputs": {
              "DELAY_TIME": {
                "shadow": {
                  "type": "math_number",
                  "id": "delay_val",
                  "fields": {"NUM": 1000}
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

### 热点创建示例

```json
{
  "type": "rp_wifi_begin_ap",
  "id": "ap_begin_001",
  "inputs": {
    "SSID": {
      "shadow": {
        "type": "text",
        "id": "ap_ssid",
        "fields": {"TEXT": "PicoW_AP"}
      }
    },
    "PASSWORD": {
      "shadow": {
        "type": "text",
        "id": "ap_pass",
        "fields": {"TEXT": "12345678"}
      }
    },
    "CHANNEL": {
      "shadow": {
        "type": "math_number",
        "id": "ap_ch",
        "fields": {"NUM": 1}
      }
    }
  }
}
```

## 重要规则

1. **平台限制**: 仅支持Raspberry Pi Pico W (rp2040:rp2040)
2. **全局对象**: WiFi为全局对象，无需变量创建块
3. **值块限制**: 值块(output)不能有next字段
4. **影子块**: input_value必须配置shadow块
5. **密码长度**: AP模式密码需至少8个字符

## WiFi状态常量

| 常量 | 说明 |
|-----|------|
| WL_IDLE_STATUS | 空闲状态 |
| WL_NO_SSID_AVAIL | 找不到SSID |
| WL_SCAN_COMPLETED | 扫描完成 |
| WL_CONNECTED | 已连接 |
| WL_CONNECT_FAILED | 连接失败 |
| WL_CONNECTION_LOST | 连接丢失 |
| WL_DISCONNECTED | 已断开 |

## WiFi模式

| 模式 | 说明 |
|-----|------|
| WIFI_STA | 站点模式 |
| WIFI_AP | 热点模式 |
| WIFI_AP_STA | 混合模式 |
| WIFI_OFF | 关闭 |

## 加密类型

| 类型 | 说明 |
|-----|------|
| ENC_TYPE_NONE | 无加密 |
| ENC_TYPE_TKIP | WPA |
| ENC_TYPE_CCMP | WPA2 |
| ENC_TYPE_AUTO | 自动 |

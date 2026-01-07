# Arduino WiFiS3 库 Blockly化

Arduino UNO R4 WiFi 的 WiFiS3 库的 Blockly 转换，提供直观的 WiFi 连接、网络查询和网络操作块。

## 库信息
- **库名**: @aily-project/arduino-r4-wifis3
- **版本**: 0.0.1
- **兼容**: renesas_uno (Arduino UNO R4 WiFi)
- **API来源**: Arduino WiFiS3.h

## 块定义核心表格

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `wifis3_begin` | 语句块 | SSID(input), PASS(input) | `"inputs":{"SSID":{"shadow":{"type":"text"...` | `WiFi.begin(ssid, pass);` |
| `wifis3_begin_open` | 语句块 | SSID(input) | `"inputs":{"SSID":{"shadow":...` | `WiFi.begin(ssid);` |
| `wifis3_begin_ap` | 语句块 | SSID(input), PASS(input), CHANNEL(input) | 同上 | `WiFi.beginAP(ssid, pass, ch);` |
| `wifis3_disconnect` | 语句块 | 无 | `"type":"wifis3_disconnect"` | `WiFi.disconnect();` |
| `wifis3_wait_for_connection` | 语句块 | TIMEOUT(input) | `"inputs":{"TIMEOUT":...` | 等待连接循环 |
| `wifis3_status` | 值块 | 无 | `"type":"wifis3_status"` | `WiFi.status()` |
| `wifis3_is_connected` | 值块 | 无 | `"type":"wifis3_is_connected"` | `(WiFi.status() == WL_CONNECTED)` |
| `wifis3_local_ip` | 值块 | 无 | `"type":"wifis3_local_ip"` | `ipToString(WiFi.localIP())` |
| `wifis3_mac_address` | 值块 | 无 | `"type":"wifis3_mac_address"` | `macToString()` |
| `wifis3_gateway_ip` | 值块 | 无 | `"type":"wifis3_gateway_ip"` | `ipToString(WiFi.gatewayIP())` |
| `wifis3_subnet_mask` | 值块 | 无 | `"type":"wifis3_subnet_mask"` | `ipToString(WiFi.subnetMask())` |
| `wifis3_dns_ip` | 值块 | DNS_INDEX(dropdown) | `"fields":{"DNS_INDEX":"0"}` | `ipToString(WiFi.dnsIP(index))` |
| `wifis3_set_dns` | 语句块 | DNS1(input), DNS2(input) | `"inputs":{"DNS1":...` | `WiFi.setDNS(dns1, dns2);` |
| `wifis3_config_ip` | 语句块 | IP(input), GW(input), SUBNET(input) | 同上 | `WiFi.config(ip, gw, subnet);` |
| `wifis3_set_hostname` | 语句块 | HOSTNAME(input) | `"inputs":{"HOSTNAME":...` | `WiFi.setHostname(name);` |
| `wifis3_scan_networks` | 语句块 | 无 | `"type":"wifis3_scan_networks"` | `WiFi.scanNetworks();` |
| `wifis3_scanned_networks_count` | 值块 | 无 | `"type":"wifis3_scanned_networks_count"` | `WiFi.scanNetworks()` |
| `wifis3_ssid_by_index` | 值块 | INDEX(input) | `"inputs":{"INDEX":...` | `WiFi.SSID(index)` |
| `wifis3_rssi_by_index` | 值块 | INDEX(input) | `"inputs":{"INDEX":...` | `WiFi.RSSI(index)` |
| `wifis3_ping` | 值块 | HOST(input), TTL(input), COUNT(input) | 同上 | `WiFi.ping(host, ttl, count)` |
| `wifis3_firmware_version` | 值块 | 无 | `"type":"wifis3_firmware_version"` | `WiFi.firmwareVersion()` |

## 字段类型映射

| 类型 | .abi格式 | 说明 |
|------|----------|------|
| input_value | `"inputs": {"NAME": {"shadow": {"type": "text", ...}}}` | 值输入连接，必须配置影子块 |
| field_dropdown | `"fields": {"DNS_INDEX": "0"}` | 下拉选择，使用选项值 |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
  - 连接到主程序流程中
  - 可包含内部输入块通过`inputs`连接
  
- **值块**: 有output，连接到其他块的`inputs`
  - 返回值供其他块使用
  - 不能有`next`字段
  
- **全局对象**: WiFi是Arduino内置全局对象，无需创建
  - 所有块直接调用WiFi的方法
  - 自动添加`#include <WiFiS3.h>`库

### 动态选项处理
DNS_INDEX下拉列表中的选项来自board.json配置，但这里直接使用固定选项：
- 主DNS: "0"
- 备用DNS: "1"

## 使用示例

### WiFi连接完整流程
```json
{
  "blocks": [
    {
      "type": "arduino_setup",
      "id": "setup_id",
      "inputs": {
        "ARDUINO_SETUP": {
          "block": {
            "type": "wifis3_begin",
            "id": "wifi_begin_id",
            "inputs": {
              "SSID": {
                "shadow": {
                  "type": "text",
                  "id": "ssid_shadow",
                  "fields": {"TEXT": "MyNetwork"}
                }
              },
              "PASS": {
                "shadow": {
                  "type": "text",
                  "id": "pass_shadow",
                  "fields": {"TEXT": "password123"}
                }
              }
            },
            "next": {
              "block": {
                "type": "wifis3_wait_for_connection",
                "id": "wait_id",
                "inputs": {
                  "TIMEOUT": {
                    "shadow": {
                      "type": "math_number",
                      "id": "timeout_shadow",
                      "fields": {"NUM": 30000}
                    }
                  }
                },
                "next": {
                  "block": {
                    "type": "serial_println",
                    "id": "println_id",
                    "fields": {"SERIAL": "Serial"},
                    "inputs": {
                      "VAR": {
                        "block": {
                          "type": "wifis3_local_ip",
                          "id": "get_ip_id"
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
    },
    {
      "type": "arduino_loop",
      "id": "loop_id",
      "inputs": {
        "ARDUINO_LOOP": {
          "block": {
            "type": "controls_if",
            "id": "if_id",
            "inputs": {
              "IF0": {
                "block": {
                  "type": "wifis3_is_connected",
                  "id": "check_connected_id"
                }
              },
              "DO0": {
                "block": {
                  "type": "serial_println",
                  "id": "print_status",
                  "fields": {"SERIAL": "Serial"},
                  "inputs": {
                    "VAR": {
                      "shadow": {
                        "type": "text",
                        "fields": {"TEXT": "WiFi Connected"}
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
  ],
  "variables": []
}
```

### 网络扫描示例
```json
{
  "type": "wifis3_scan_networks",
  "id": "scan_id",
  "next": {
    "block": {
      "type": "controls_repeat_ext",
      "id": "repeat_id",
      "inputs": {
        "TIMES": {
          "block": {
            "type": "wifis3_scanned_networks_count",
            "id": "count_id"
          }
        },
        "DO": {
          "block": {
            "type": "serial_println",
            "id": "print_ssid",
            "fields": {"SERIAL": "Serial"},
            "inputs": {
              "VAR": {
                "block": {
                  "type": "wifis3_ssid_by_index",
                  "id": "get_ssid",
                  "inputs": {
                    "INDEX": {
                      "block": {
                        "type": "variables_get",
                        "id": "var_i",
                        "fields": {"VAR": {"id": "count_var"}}
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
```

## 重要规则

### WiFi连接流程
1. 使用 `wifis3_begin` 或 `wifis3_begin_open` 启动连接
2. 使用 `wifis3_wait_for_connection` 等待连接完成
3. 可选：使用 `wifis3_is_connected` 检查连接状态

### 信息查询
- **IP地址类**: localIP、gatewayIP、subnetMask、dnsIP 都返回字符串格式
- **扫描网络**: 先调用 `scanNetworks()` 扫描，再使用索引查询SSID和RSSI
- **MAC地址**: 返回格式 `XX:XX:XX:XX:XX:XX`

### 常见错误
- ❌ `wifis3_ssid_by_index` 前未先调用 `wifis3_scan_networks`
  - ✅ 先扫描网络，再查询结果

- ❌ 在 `wifis3_begin` 后立即调用 `wifis3_local_ip` 但WiFi未连接
  - ✅ 使用 `wifis3_wait_for_connection` 等待连接完成

- ❌ 使用错误的配置IP格式（整数而非字符串）
  - ✅ IP配置必须使用字符串格式如 `"192.168.1.100"`

## 支持的WiFi模式

| 模式 | 块 | 说明 |
|------|-----|------|
| STA（Station） | wifis3_begin* | 连接到现有WiFi网络 |
| AP（Access Point） | wifis3_begin_ap | 创建WiFi热点 |
| 查询状态 | wifis3_status, wifis3_is_connected | 检查连接状态 |
| 网络信息 | wifis3_local_ip, wifis3_mac_address等 | 获取设备网络信息 |

## 支持的加密方式（通过 wifis3_begin）
- **WPA/WPA2**: 使用 `wifis3_begin(ssid, password)`
- **开放网络**: 使用 `wifis3_begin_open(ssid)`

## 智能特性

### 自动Serial初始化
当生成包含输出信息的代码时，自动在setup中添加 `Serial.begin(9600);`

### IP地址转换
内部自动使用 `ipToString()` 函数将IPAddress对象转换为可读的字符串格式

### MAC地址转换
自动使用 `macToString()` 函数将字节数组转换为标准MAC地址格式

---

此库提供了Arduino UNO R4 WiFi所有核心WiFi功能的图形化接口，用户可以直观地进行WiFi连接、状态查询、网络扫描等操作。

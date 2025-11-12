# esp32_httpupdate

ESP32 HTTP固件在线更新库，支持固件和SPIFFS文件系统更新

## 库信息
- **库名**: @aily-project/lib-esp32-httpupdate
- **版本**: 1.0.0
- **兼容**: ESP32系列平台

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp32_httpupdate_set_led_pin` | 语句块 | PIN(input_value), LED_ON(field_dropdown) | `"inputs":{"PIN":{}}, "fields":{"LED_ON":"HIGH"}` | `httpUpdate.setLedPin(pin, HIGH);` |
| `esp32_httpupdate_set_md5` | 语句块 | MD5(input_value) | `"inputs":{"MD5":{}}` | `httpUpdate.setMD5sum(md5);` |
| `esp32_httpupdate_set_auth` | 语句块 | USER(input_value), PASSWORD(input_value) | `"inputs":{"USER":{},"PASSWORD":{}}` | `httpUpdate.setAuthorization(user, password);` |
| `esp32_httpupdate_update` | 语句块 | URL(input_value) | `"inputs":{"URL":{}}` | `httpUpdate.update(httpUpdateClient, url);` |
| `esp32_httpupdate_update_spiffs` | 语句块 | URL(input_value) | `"inputs":{"URL":{}}` | `httpUpdate.updateSpiffs(httpUpdateClient, url);` |
| `esp32_httpupdate_update_secure` | 语句块 | URL(input_value), CA_CERT(input_value), USER(input_value), PASSWORD(input_value) | `"inputs":{"URL":{},"CA_CERT":{},"USER":{},"PASSWORD":{}}` | `httpUpdate.update(httpUpdateClient, url, "", callback);` |
| `esp32_httpupdate_update_spiffs_secure` | 语句块 | URL(input_value), CA_CERT(input_value), USER(input_value), PASSWORD(input_value) | `"inputs":{"URL":{},"CA_CERT":{},"USER":{},"PASSWORD":{}}` | `httpUpdate.updateSpiffs(httpUpdateClient, url, "", callback);` |
| `esp32_httpupdate_on_start` | 语句块 | HANDLER(input_statement) | `"inputs":{"HANDLER":{}}` | `httpUpdate.onStart(callback);` |
| `esp32_httpupdate_on_end` | 语句块 | HANDLER(input_statement) | `"inputs":{"HANDLER":{}}` | `httpUpdate.onEnd(callback);` |
| `esp32_httpupdate_on_progress` | 语句块 | HANDLER(input_statement) | `"inputs":{"HANDLER":{}}` | `httpUpdate.onProgress(callback);` |
| `esp32_httpupdate_on_error` | 语句块 | HANDLER(input_statement) | `"inputs":{"HANDLER":{}}` | `httpUpdate.onError(callback);` |
| `esp32_httpupdate_get_last_error` | 值块 | - | `{}` | `httpUpdate.getLastError()` |
| `esp32_httpupdate_get_last_error_string` | 值块 | - | `{}` | `httpUpdate.getLastErrorString()` |
| `esp32_httpupdate_result` | 值块 | - | `{}` | `ret` |
| `esp32_httpupdate_result_list` | 值块 | CODE(field_dropdown) | `"fields":{"CODE":"HTTP_UPDATE_OK"}` | `HTTP_UPDATE_OK` |
| `esp32_httpupdate_process_current` | 值块 | - | `{}` | `cur` |
| `esp32_httpupdate_process_total` | 值块 | - | `{}` | `total` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown | 字符串 | `"LED_ON": "HIGH"` |
| input_value | 块连接 | `"inputs": {"URL": {"block": {...}}}` |
| input_statement | 语句块连接 | `"inputs": {"HANDLER": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **特殊规则**: 
  - 更新操作会阻塞执行直到完成或失败，返回结果存储在`ret`变量中
  - 回调函数自动生成C++函数定义，在setup()中注册到httpUpdate对象
  - 安全更新自动创建WiFiClientSecure客户端，设置CA证书和认证信息
  - `cur`(当前已下载字节)、`total`(文件总字节数)只能在`esp32_httpupdate_on_progress`回调内使用
  - 错误回调可访问`err`变量(错误代码)
  - 需要WiFi连接和足够的存储空间

## 使用示例

### 基本固件更新
```json
{
  "type": "esp32_httpupdate_update",
  "id": "update_firmware",
  "inputs": {
    "URL": {
      "block": {
        "type": "text",
        "fields": {"TEXT": "http://example.com/firmware.bin"}
      }
    }
  }
}
```

### 带认证的HTTPS更新
```json
{
  "type": "esp32_httpupdate_update_secure",
  "id": "secure_update",
  "inputs": {
    "URL": {
      "block": {
        "type": "text",
        "fields": {"TEXT": "https://secure.example.com/firmware.bin"}
      }
    },
    "CA_CERT": {
      "block": {
        "type": "text",
        "fields": {"TEXT": "-----BEGIN CERTIFICATE-----\\n...\\n-----END CERTIFICATE-----"}
      }
    }
  }
}
```

### 更新进度监控
```json
{
  "type": "esp32_httpupdate_on_progress",
  "id": "progress_handler",
  "inputs": {
    "HANDLER": {
      "block": {
        "type": "serial_println",
        "fields": {"SERIAL": "Serial"},
        "inputs": {
          "VAR": {
            "block": {
              "type": "text_join",
              "extraState": {
                "itemCount": 5
              },
              "inputs": {
                "ADD0": {
                  "block": {
                    "type": "text",
                    "fields": {"TEXT": "更新进度: "}
                  }
                },
                "ADD1": {
                  "block": {
                    "type": "esp32_httpupdate_process_current"
                  }
                },
                "ADD2": {
                  "block": {
                    "type": "text",
                    "fields": {"TEXT": " / "}
                  }
                },
                "ADD3": {
                  "block": {
                    "type": "esp32_httpupdate_process_total"
                  }
                },
                "ADD4": {
                  "block": {
                    "type": "text",
                    "fields": {"TEXT": " 字节"}
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

1. **必须遵守**: ESP32需要先连接WiFi才能进行HTTP更新，确保有足够的存储空间
2. **连接限制**: 更新操作是阻塞性的，执行期间其他代码将暂停
3. **安全考虑**: HTTPS更新需要正确的CA证书，建议验证固件MD5
4. **常见错误**: ❌ 未连接WiFi直接更新，❌ 存储空间不足，❌ 固件格式错误，❌ URL无法访问

## 支持的字段选项
- **LED_ON(LED电平)**: "HIGH", "LOW"
- **CODE(更新结果)**: "HTTP_UPDATE_FAILED", "HTTP_UPDATE_NO_UPDATES", "HTTP_UPDATE_OK"
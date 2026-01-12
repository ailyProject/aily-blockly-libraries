# HTTP图片加载器

ESP32 HTTP网络图片加载库，从网络下载JPEG图片并显示到LVGL图形界面，支持PSRAM和LittleFS双模式。

## 库信息
- **库名**: @aily-project/lib-lvgl-http-image-loader
- **版本**: 1.0.0
- **兼容**: esp32:esp32

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `lvgl_http_img_init` | 语句块 | WIDTH/HEIGHT/MAX_SIZE/TIMEOUT(input), PSRAM_MODE/STORAGE_MODE/DEBUG(dropdown) | `"PSRAM_MODE":"AUTO","STORAGE_MODE":"AUTO","DEBUG":"FALSE"` | `httpImageLoader().init(config);` |
| `lvgl_http_img_load` | 语句块 | URL(input:String), VAR(field_variable:lv_obj_t) | `"VAR":{"id":"img_var_id"}` | `httpImageLoader().load(url, img);` |
| `lvgl_http_img_get_info` | 值块 | URL(input:String) | - | `httpImageLoader().getInfo(url, NULL)` |
| `lvgl_http_img_check` | 值块 | URL(input:String) | - | `httpImageLoader().checkLoadable(url)` |
| `lvgl_http_img_has_psram` | 值块 | 无 | - | `httpImageLoader().hasPsram()` |
| `lvgl_http_img_get_max_size` | 值块 | 无 | - | `httpImageLoader().getMaxSize()` |
| `lvgl_http_img_get_last_error` | 值块 | 无 | - | `httpImgLastError` |
| `lvgl_http_img_err_to_string` | 值块 | ERR_CODE(input:Number) | - | `httpImageLoader().errToStr(err)` |
| `lvgl_http_img_cleanup` | 语句块 | 无 | - | `httpImageLoader().cleanup();` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown | 字符串 | `"PSRAM_MODE": "AUTO"` |
| field_variable | 对象 | `"VAR": {"id": "img_var_id"}` |
| input_value | 块连接 | `"inputs": {"URL": {"block": {...}}}` |

### 字段选项

**PSRAM_MODE**: `AUTO`(自动检测), `AVAILABLE`(有PSRAM), `NONE`(无PSRAM)

**STORAGE_MODE**: `AUTO`(自动选择), `LITTLEFS`(强制LittleFS), `PSRAM`(强制PSRAM)

**DEBUG**: `FALSE`(关闭), `TRUE`(开启)

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **变量类型**: lvgl_http_img_load的VAR字段使用field_variable，variableTypes限定为lv_obj_t
- **输入检查**: URL输入检查String类型，WIDTH/HEIGHT/MAX_SIZE/TIMEOUT/ERR_CODE检查Number类型

## 使用示例

### 初始化加载器
```json
{
  "type": "lvgl_http_img_init",
  "id": "init1",
  "fields": {
    "PSRAM_MODE": "AUTO",
    "STORAGE_MODE": "AUTO",
    "DEBUG": "FALSE"
  },
  "inputs": {
    "WIDTH": {"shadow": {"type": "math_number", "fields": {"NUM": 240}}},
    "HEIGHT": {"shadow": {"type": "math_number", "fields": {"NUM": 240}}},
    "MAX_SIZE": {"shadow": {"type": "math_number", "fields": {"NUM": 512}}},
    "TIMEOUT": {"shadow": {"type": "math_number", "fields": {"NUM": 15000}}}
  }
}
```
生成:
```cpp
HttpImageConfig httpImgConfig;
httpImgConfig.screenWidth = 240;
httpImgConfig.screenHeight = 240;
httpImgConfig.psramMode = PSRAM_MODE_AUTO;
httpImgConfig.storageMode = STORAGE_MODE_AUTO;
httpImgConfig.maxFileSizePsram = 512 * 1024;
httpImgConfig.maxFileSizeNoPsram = 50 * 1024;
httpImgConfig.timeoutMs = 15000;
httpImgConfig.chunkSize = 4096;
httpImgConfig.decodeImmediately = true;
httpImgConfig.debug = false;
httpImageLoader().init(httpImgConfig);
```

### 加载网络图片
```json
{
  "type": "lvgl_http_img_load",
  "id": "load1",
  "fields": {"VAR": {"id": "img_var_id"}},
  "inputs": {
    "URL": {"shadow": {"type": "text", "fields": {"TEXT": "http://httpbin.org/image/jpeg"}}}
  }
}
```
生成: `http_img_err_t httpImgLastError = httpImageLoader().load("http://httpbin.org/image/jpeg", img);`

### 检查图片是否可加载
```json
{
  "type": "lvgl_http_img_check",
  "id": "check1",
  "inputs": {
    "URL": {"shadow": {"type": "text", "fields": {"TEXT": "http://example.com/image.jpg"}}}
  }
}
```
生成: `httpImageLoader().checkLoadable("http://example.com/image.jpg") == HTTP_IMG_OK`

### 错误处理
```json
{
  "type": "lvgl_http_img_err_to_string",
  "id": "err1",
  "inputs": {
    "ERR_CODE": {"shadow": {"type": "lvgl_http_img_get_last_error", "id": "lasterr1"}}
  }
}
```
生成: `httpImageLoader().errToStr((http_img_err_t)httpImgLastError)`

### 检测PSRAM
```json
{
  "type": "lvgl_http_img_has_psram",
  "id": "psram1"
}
```
生成: `httpImageLoader().hasPsram()`

### 清理资源
```json
{
  "type": "lvgl_http_img_cleanup",
  "id": "cleanup1"
}
```
生成: `httpImageLoader().cleanup();`

### 完整程序示例
```json
{
  "type": "lvgl_http_img_init",
  "id": "s1",
  "fields": {"PSRAM_MODE": "AUTO", "STORAGE_MODE": "AUTO", "DEBUG": "FALSE"},
  "inputs": {
    "WIDTH": {"shadow": {"type": "math_number", "fields": {"NUM": 240}}},
    "HEIGHT": {"shadow": {"type": "math_number", "fields": {"NUM": 240}}},
    "MAX_SIZE": {"shadow": {"type": "math_number", "fields": {"NUM": 512}}},
    "TIMEOUT": {"shadow": {"type": "math_number", "fields": {"NUM": 15000}}}
  },
  "next": {
    "block": {
      "type": "lvgl_http_img_load",
      "id": "s2",
      "fields": {"VAR": {"id": "img_var_id"}},
      "inputs": {
        "URL": {"shadow": {"type": "text", "fields": {"TEXT": "http://httpbin.org/image/jpeg"}}}
      }
    }
  }
}
```

## 重要规则

1. **初始化顺序**: 必须先使用lvgl_http_img_init初始化加载器才能调用其他块
2. **全局单例**: 加载器为全局单例模式，只需初始化一次
3. **变量类型**: lvgl_http_img_load的VAR必须是lv_obj_t类型的LVGL Image对象
4. **图片格式**: 仅支持JPEG格式图片
5. **错误变量**: load块会自动声明httpImgLastError变量存储错误码
6. **编译宏**: init块会自动添加LVGL相关编译宏(LV_USE_TJPGD、LV_USE_FS_ARDUINO_ESP_LITTLEFS等)
7. **必须唯一**: 所有块ID和变量ID必须唯一

## 错误代码

| 代码 | 含义 |
|------|------|
| HTTP_IMG_OK | 成功(0) |
| 其他 | 各类错误，使用lvgl_http_img_err_to_string转换为描述 |

## 依赖说明

此库需要配合LVGL图形库使用，VAR字段需要连接已创建的lv_obj_t类型Image对象。

---
*自包含文档，无需外部规范*

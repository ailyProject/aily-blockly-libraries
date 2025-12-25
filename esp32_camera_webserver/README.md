# ESP32摄像头网络服务器

ESP32摄像头网络服务器库,支持多种ESP32开发板通过WiFi串流摄像头画面

## 库信息
- **库名**: @aily-project/lib-esp32-camera-webserver
- **版本**: 0.0.1  
- **兼容**: esp32:esp32

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp32_camera_webserver_init` | 语句块 | MODEL(dropdown), RESOLUTION(dropdown), SSID(input_value), PASSWORD(input_value) | `"MODEL": "CAMERA_MODEL_AI_THINKER"`, `"RESOLUTION": "FRAMESIZE_UXGA"` | 初始化摄像头和WiFi,启动Web服务器 |
| `esp32_camera_custom_pins` | 语句块 | DATA_PINS(input_value), XCLK(input_value), PCLK(input_value), VSYNC(input_value), HREF(input_value), SDA(input_value), SCL(input_value), PWDN(input_value), RESET(input_value) | 各引脚配置 | 自定义摄像头引脚配置 |
| `esp32_camera_set_quality` | 语句块 | QUALITY(field_number) | `"QUALITY": 10` | 设置JPEG质量 |
| `esp32_camera_set_flip` | 语句块 | VFLIP(field_checkbox), HMIRROR(field_checkbox) | `"VFLIP": false`, `"HMIRROR": false` | 设置画面翻转 |
| `esp32_camera_set_brightness` | 语句块 | BRIGHTNESS(field_number), CONTRAST(field_number), SATURATION(field_number) | `"BRIGHTNESS": 0` | 调整画质参数 |
| `esp32_camera_capture` | 值块 | 无 | 无字段 | 返回帧指针 |
| `esp32_camera_frame_buffer` | 值块 | FRAME(input_value) | 无字段 | 获取帧数据指针 |
| `esp32_camera_frame_len` | 值块 | FRAME(input_value) | 无字段 | 获取帧数据长度 |
| `esp32_camera_frame_width` | 值块 | FRAME(input_value) | 无字段 | 获取帧宽度 |
| `esp32_camera_frame_height` | 值块 | FRAME(input_value) | 无字段 | 获取帧高度 |
| `esp32_camera_release` | 语句块 | FRAME(input_value) | 无字段 | 释放帧内存 |
| `esp32_camera_send_serial` | 语句块 | FRAME(input_value) | 无字段 | 通过串口发送帧 |
| `esp32_camera_capture_and_encode_base64` | 值块 | 无 | 无字段 | 拍照并转换为Base64 |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown | 字符串 | `"MODEL": "CAMERA_MODEL_AI_THINKER"` |
| input_value | 块连接 | `"inputs": {"SSID": {"shadow": {"type": "text", "fields": {"TEXT": "wifi_name"}}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **input_value**: 必须在toolbox.json中配置影子块

## 使用示例

### 初始化摄像头服务器

```json
{
  "type": "esp32_camera_webserver_init",
  "id": "unique_id",
  "fields": {
    "MODEL": "CAMERA_MODEL_DFRobot_FireBeetle2_ESP32S3",
    "RESOLUTION": "FRAMESIZE_UXGA"
  },
  "inputs": {
    "SSID": {
      "shadow": {
        "type": "text",
        "fields": {"TEXT": "my_wifi"}
      }
    },
    "PASSWORD": {
      "shadow": {
        "type": "text",
        "fields": {"TEXT": "my_password"}
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: 每个块的ID必须唯一
2. **连接限制**: 语句块只能连接到其他语句块
3. **常见错误**: ❌ 忘记为input_value配置shadow块
4. **内存管理**: ⚠️ 使用esp32_camera_capture获取帧后，必须调用esp32_camera_release释放内存

## 支持的摄像头型号

- AI Thinker
- M5Stack PSRAM
- M5Stack Wide
- ESP Eye
- FireBeetle 2 ESP32S3 (需要AXP313A电源管理)
- XIAO ESP32S3

## 支持的分辨率

从高到低：UXGA (1600x1200), SXGA, XGA, SVGA, VGA, CIF, QVGA, HQVGA, QQVGA (160x120)

## 特殊说明

- FireBeetle 2 ESP32S3开发板使用AXP313A电源管理芯片，库会自动初始化
- 高分辨率(UXGA/SXGA)需要PSRAM支持
- Web服务器运行在独立的FreeRTOS任务中，loop()中无需调用处理函数
- 串口发送帧数据包含帧标识符，便于上位机识别帧边界
实际测试结果预测：

场景	                是否会卡	   影响
只运行Web服务器	      ✅不会	      流畅播放
Loop偶尔获取+快速处理	⚠️可能闪烁	 轻微影响
Loop频繁获取+串口输出	❌ 会卡	    Web严重卡顿
Loop高分辨率+串口输出	❌ 严重卡	  Web几乎无响应
建议的解决方案：
Web服务器：给用户实时查看（高分辨率）
串口输出：只在需要时手动触发，不放在loop
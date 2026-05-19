# MAX30102血氧心率传感器

MAX30102血氧和心率传感器Blockly库，基于MAX30102_by_RF驱动与算法，封装采样、血氧、心率、温度和信号质量读取。

## 库信息
- **库名**: @aily-project/lib-max30102
- **版本**: 0.0.2
- **作者**: k7212519
- **兼容**: ESP32、ESP32-S3、Arduino SAMD；不建议在SRAM较小的AVR板卡上使用
- **来源**: https://github.com/aromring/MAX30102_by_RF

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|-----------|----------|----------|
| `max30102_init` | 语句块 | SDA_PIN/SCL_PIN/INT_PIN(field_dropdown) | `"SDA_PIN":"21"` | `ailyMax30102Begin(21, 22, 4);` |
| `max30102_measure` | 语句块 | TIMEOUT(input_value) | `"TIMEOUT":{...}` | `ailyMax30102Measure(5000);` |
| `max30102_get_value` | 值块 | VALUE(field_dropdown) | `"VALUE":"SPO2"` | `_ailyMax30102SpO2` |
| `max30102_is_valid` | 值块 | TARGET(field_dropdown) | `"TARGET":"MEASURE"` | `_ailyMax30102LastOK` |
| `max30102_reset` | 语句块 | 无 | `{}` | `maxim_max30102_reset();` |
| `max30102_set_led_amplitude` | 语句块 | LED1/LED2(input_value) | `"LED1":{...}` | `setLED1PulseAmplitude(...)` |
| `max30102_config_spo2` | 语句块 | AVERAGING/ADC_RANGE/SAMPLE_RATE/PULSE_WIDTH(dropdown) | `"SAMPLE_RATE":"SPO2_RATE_100"` | `ailyMax30102SetSpO2Config(...)` |
| `max30102_set_finger_threshold` | 语句块 | THRESHOLD(input_value) | `"THRESHOLD":{...}` | `_ailyMax30102FingerThreshold = ...` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown | 字符串 | `"VALUE":"HEART_RATE"` |
| field_dropdown(动态) | 字符串 | `"INT_PIN":"4"`，来自`${board.digitalPins}` |
| input_value | 块连接 | `"inputs":{"TIMEOUT":{"shadow":{"type":"math_number"}}}` |

## 连接规则

- `max30102_init`放在`arduino_setup`中，SDA/SCL必须接到模块I2C引脚，INT必须接到模块INT引脚。ESP32会按所选SDA/SCL初始化`Wire`；非ESP32核心使用默认`Wire.begin()`。
- `max30102_measure`放在`arduino_loop`或需要测量的位置；一次测量会采集`BUFFER_SIZE`批数据，默认约4秒。`TIMEOUT`是整次测量的总等待时间，0表示不超时。
- `max30102_get_value`读取最近一次测量结果，不会主动采样。
- `max30102_is_valid`可用于判断初始化、本次测量、血氧、心率或手指检测状态。
- `max30102_config_spo2`可放在初始化前或初始化后。初始化前会先缓存配置，初始化时统一应用；初始化后会立即写入传感器寄存器。
- `max30102_set_finger_threshold`设置手指检测阈值，默认`50000`，用于`max30102_is_valid(FINGER)`判断。

## 使用示例

```json
{
  "type": "max30102_init",
  "fields": {"SDA_PIN": "21", "SCL_PIN": "22", "INT_PIN": "4"},
  "next": {
    "block": {
      "type": "max30102_measure",
      "inputs": {
        "TIMEOUT": {
          "shadow": {
            "type": "math_number",
            "fields": {"NUM": 5000}
          }
        }
      }
    }
  }
}
```

## 重要规则

1. MAX30102使用I2C，地址固定为`0x57`，SDA/SCL必须与初始化块选择一致。
2. 算法需要较多RAM，不建议UNO/Nano等2KB SRAM板卡。
3. 手指移动、供电不足、INT未连接或红光/红外通道异常都会导致无效结果。
4. 如果执行`max30102_reset`，通常需要重新执行`max30102_init`后再测量。

## 支持的关键参数

- `VALUE`: `SPO2`, `HEART_RATE`, `TEMPERATURE`, `RED`, `IR`, `RATIO`, `CORRELATION`
- `TARGET`: `MEASURE`, `INIT`, `SPO2`, `HEART_RATE`, `FINGER`
- 默认高级配置：`AVG_4`, `ADC_RANGE_4096`, `SPO2_RATE_100`, `PW_411`

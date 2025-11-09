# ArduinoFFT

快速傅里叶变换库，基于arduinoFFT库提供信号频率分析功能

## 库信息
- **库名**: @aily-project/lib-arduino-fft
- **版本**: 0.0.1
- **兼容**: 电压3.3V/5V

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `Arduino_FFT_init` | 语句块 | REAL_ARRAY(field_variable), IMAG_ARRAY(field_variable), SAMPLES_COUNT(input_value), SAMPLING_FREQUENCY(input_value) | `"fields": {"REAL_ARRAY": {"id": "var_id"}, "IMAG_ARRAY": {"id": "var_id"}}, "inputs": {"SAMPLES_COUNT": {"block": {...}}, "SAMPLING_FREQUENCY": {"block": {...}}}` | `FFT = ArduinoFFT<double>(vReal, vImag, samples, freq);` |
| `Arduino_FFT_windowing` | 语句块 | ARRAY(field_variable), WINDOW_TYPE(field_dropdown), DIRECTION(field_dropdown) | `"fields": {"ARRAY": {"id": "var_id"}, "WINDOW_TYPE": "FFT_WIN_TYP_HAMMING", "DIRECTION": "FFT_FORWARD"}` | `FFT.Windowing(vReal, size, FFT_WIN_TYP_HAMMING, FFT_FORWARD);` |
| `Arduino_FFT_compute` | 语句块 | REAL_ARRAY(field_variable), IMAG_ARRAY(field_variable), SAMPLES_COUNT(input_value), DIRECTION(field_dropdown) | `"fields": {"REAL_ARRAY": {"id": "var_id"}, "IMAG_ARRAY": {"id": "var_id"}}, "inputs": {"SAMPLES_COUNT": {"block": {...}}, "DIRECTION": "FFT_FORWARD"}` | `FFT.Compute(vReal, vImag, samples, FFT_FORWARD);` |
| `Arduino_FFT_complex_to_magnitude` | 语句块 | REAL_ARRAY(field_variable), IMAG_ARRAY(field_variable), SAMPLES_COUNT(input_value) | `"fields": {"REAL_ARRAY": {"id": "var_id"}, "IMAG_ARRAY": {"id": "var_id"}}, "inputs": {"SAMPLES_COUNT": {"block": {...}}}` | `FFT.ComplexToMagnitude(vReal, vImag, samples);` |
| `Arduino_FFT_major_peak` | 值块 | MAGNITUDE_ARRAY(field_variable), SAMPLES_COUNT(input_value), SAMPLING_FREQUENCY(input_value) | `"fields": {"MAGNITUDE_ARRAY": {"id": "var_id"}}, "inputs": {"SAMPLES_COUNT": {"block": {...}}, "SAMPLING_FREQUENCY": {"block": {...}}}` | `FFT.MajorPeak(vReal, samples, freq)` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_variable | 对象 | `"VAR": {"id": "变量ID"}` |
| field_dropdown | 字符串 | `"TYPE": "option"` |
| input_value | 块连接 | `"inputs": {"INPUT": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **变量字段**: 使用{"id": "变量ID"}格式，变量必须为double数组类型

## 使用示例

### FFT频率分析流程
```json
{
  "blocks": {
    "languageVersion": 0,
    "blocks": [
      {
        "type": "variables_define",
        "fields": {"VAR": "vReal", "TYPE": "double[]"},
        "inputs": {"VALUE": {"shadow": {"type": "text", "fields": {"TEXT": "{0,0,0}"}}}}
      },
      {
        "type": "Arduino_FFT_windowing",
        "fields": {"ARRAY": {"id": "vReal_id"}, "WINDOW_TYPE": "FFT_WIN_TYP_HAMMING", "DIRECTION": "FFT_FORWARD"}
      },
      {
        "type": "Arduino_FFT_compute",
        "fields": {"REAL_ARRAY": {"id": "vReal_id"}, "IMAG_ARRAY": {"id": "vImag_id"}},
        "inputs": {"SAMPLES_COUNT": {"shadow": {"type": "math_number", "fields": {"NUM": 128}}}}
      },
      {
        "type": "Arduino_FFT_complex_to_magnitude",
        "fields": {"REAL_ARRAY": {"id": "vReal_id"}, "IMAG_ARRAY": {"id": "vImag_id"}},
        "inputs": {"SAMPLES_COUNT": {"shadow": {"type": "math_number", "fields": {"NUM": 128}}}}
      },
      {
        "type": "Arduino_FFT_major_peak",
        "fields": {"MAGNITUDE_ARRAY": {"id": "vReal_id"}},
        "inputs": {
          "SAMPLES_COUNT": {"shadow": {"type": "math_number", "fields": {"NUM": 128}}},
          "SAMPLING_FREQUENCY": {"shadow": {"type": "math_number", "fields": {"NUM": 5000}}}
        }
      }
    ]
  }
}
```

## 重要规则

1. **先初始化**: 在 `setup` 链路开头拖入 `Arduino_FFT_init`，自定义实部/虚部数组、样本数和采样频率；若省略将使用默认 `vReal/vImag/64/5000`
2. **数组要求**: 使用field_variable选择预定义的double[]类型变量，数组大小必须等于样本数
3. **样本数限制**: 必须为2的幂（如64、128、256），影响FFT计算效率
4. **方向选择**: 正向用于分析原始信号，逆向用于重建信号
5. **依赖关系**: windowing后compute，再complex_to_magnitude，最后major_peak
6. **内存注意**: 大数组可能消耗大量RAM，适用于Arduino Mega等板卡

## 支持的关键参数
- 数据类型：double（实部、虚部数组）
- 样本数：2的幂次方
- 采样频率：Hz单位
- 窗口类型：汉明、汉宁、矩形

此规范确保README自包含，让大模型能正确理解并生成.abi文件。

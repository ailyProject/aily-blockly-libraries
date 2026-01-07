# arduino_r4_AnalogWave

Arduino UNO R4 WiFi 模拟波形生成库，支持通过DAC输出正弦波、方波和锯齿波。

## 库信息
- **库名**: @aily-project/lib-r4-analogwave
- **版本**: 1.0.0
- **兼容**: Arduino UNO R4 WiFi / R4 Minima

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `analogwave_init` | 语句块 | VAR(field_input), PIN(field_dropdown) | `"fields":{"VAR":"wave","PIN":"DAC"}` | `analogWave wave(DAC);` |
| `analogwave_sine` | 语句块 | VAR(field_variable), FREQ(input_value) | `"fields":{"VAR":{"id":"var_id"}}` | `wave.sine(freq);` |
| `analogwave_square` | 语句块 | VAR(field_variable), FREQ(input_value) | `"fields":{"VAR":{"id":"var_id"}}` | `wave.square(freq);` |
| `analogwave_saw` | 语句块 | VAR(field_variable), FREQ(input_value) | `"fields":{"VAR":{"id":"var_id"}}` | `wave.saw(freq);` |
| `analogwave_freq` | 语句块 | VAR(field_variable), FREQ(input_value) | `"fields":{"VAR":{"id":"var_id"}}` | `wave.freq(freq);` |
| `analogwave_amplitude` | 语句块 | VAR(field_variable), AMP(input_value) | `"fields":{"VAR":{"id":"var_id"}}` | `wave.amplitude(amp);` |
| `analogwave_start` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"var_id"}}` | `wave.start();` |
| `analogwave_stop` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"var_id"}}` | `wave.stop();` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "wave"` |
| field_dropdown | 字符串 | `"PIN": "DAC"` |
| field_variable | 变量对象 | `"VAR": {"id": "wave_id", "name": "wave", "type": "analogWave"}` |
| input_value | 块连接 | `"inputs": {"FREQ": {"shadow": {"type": "math_number", "fields": {"NUM": 10}}}}` |

## 连接规则

- **语句块**: 所有块均为语句块，有previousStatement/nextStatement，通过`next`字段连接
- **特殊规则**: 
  - `analogwave_init` 使用 `field_input` 创建变量名，生成器会注册变量为 `analogWave` 类型
  - 其他块使用 `field_variable` 引用已创建的变量

### DAC引脚说明
- **DAC**: Arduino R4 WiFi的默认DAC引脚(A0)
- **DAC0/DAC1**: 部分板卡的双DAC通道
- **A0**: 与DAC等效

## 使用示例

### 初始化波形对象
```json
{
  "type": "analogwave_init",
  "id": "wave_init",
  "fields": {
    "VAR": "wave",
    "PIN": "DAC"
  }
}
```

### 输出正弦波
```json
{
  "type": "analogwave_sine",
  "id": "sine_wave",
  "fields": {
    "VAR": {"id": "wave_var", "name": "wave", "type": "analogWave"}
  },
  "inputs": {
    "FREQ": {
      "shadow": {
        "type": "math_number",
        "fields": {"NUM": 440}
      }
    }
  }
}
```

### 完整程序示例
```json
{
  "type": "arduino_setup",
  "id": "arduino_setup_id0",
  "inputs": {
    "ARDUINO_SETUP": {
      "block": {
        "type": "analogwave_init",
        "id": "init_1",
        "fields": {"VAR": "wave", "PIN": "DAC"},
        "next": {
          "block": {
            "type": "analogwave_sine",
            "id": "sine_1",
            "fields": {"VAR": {"id": "wave_id"}},
            "inputs": {
              "FREQ": {
                "shadow": {"type": "math_number", "fields": {"NUM": 10}}
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

1. **必须遵守**: 必须先使用 `analogwave_init` 初始化对象后才能调用其他方法
2. **频率限制**: 频率范围受DAC采样率限制，建议在0-10000Hz范围内使用
3. **振幅范围**: `amplitude` 参数必须在0-1之间
4. **连接限制**: 所有块为语句块，按顺序连接执行
5. **常见错误**: 
   - ❌ 未初始化直接调用波形方法
   - ❌ 振幅值超出0-1范围
   - ❌ 频率设置过高导致波形失真

## 支持的字段选项
- **PIN(DAC引脚)**: "DAC", "DAC0", "DAC1", "A0"
- **变量类型**: "analogWave"

## 技术规格
- **DAC分辨率**: 12位 (R4 WiFi) / 8位 (R4 Minima)
- **预定义波形采样数**: 24个采样点
- **支持波形类型**: 正弦波(sine)、方波(square)、锯齿波(saw)
- **动态控制**: 支持运行时调整频率和振幅

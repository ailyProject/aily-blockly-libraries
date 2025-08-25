# ES8388音频编解码器

ES8388立体声音频编解码器库，支持录音、播放和实时音频处理，适用于ESP32开发板的音频应用开发。

## 库信息
- **库名**: @aily-project/lib-es8388
- **版本**: 1.0.0
- **描述**: ES8388立体声音频编解码器库，支持录音、播放和实时音频处理
- **兼容**: esp32:esp32
- **电压**: 3.3V
- **测试者**: ES8388转换工具
- **官方库**: https://github.com/everest-se/ES8388

## Blockly 工具箱分类

### 初始化
- `es8388_create` - 创建ES8388对象
- `es8388_begin` - 初始化ES8388芯片和I2S接口

### 输入输出配置
- `es8388_set_input_select` - 选择音频输入源
- `es8388_set_output_select` - 选择音频输出
- `es8388_set_input_gain` - 设置输入增益
- `es8388_set_output_volume` - 设置输出音量
- `es8388_dac_mute` - 设置DAC静音状态
- `es8388_set_alc_mode` - 设置自动电平控制模式
- `es8388_analog_bypass` - 设置模拟直通模式

### 录音功能
- `es8388_start_recording` - 开始录音指定时长
- `es8388_stop_recording` - 停止录音

### 播放功能
- `es8388_start_playback` - 开始播放录制的音频
- `es8388_stop_playback` - 停止播放
- `es8388_record_and_play` - 录音并立即播放

### 实时音频处理
- `es8388_enable_passthrough` - 启用音频直通模式
- `es8388_disable_passthrough` - 禁用音频直通模式
- `es8388_process_audio` - 处理音频数据（用于实时音频处理）

### 状态查询
- `es8388_is_recording` - 检查是否正在录音
- `es8388_is_playing` - 检查是否正在播放
- `es8388_get_recorded_samples` - 获取已录音的样本数量
- `es8388_get_recorded_duration` - 获取录音时长

### 调试工具
- `es8388_scan_i2c` - 扫描I2C总线上的设备

## 详细块定义

### 初始化块

#### es8388_create
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 创建ES8388音频编解码器对象
**字段**:
- `VAR`: 文本输入 - ES8388对象变量名 (es8388)
**值输入**:
- `SDA`: 数字输入 - I2C SDA引脚号
- `SCL`: 数字输入 - I2C SCL引脚号
- `SPEED`: 数字输入 - I2C通信速度
**生成代码**:
```cpp
ES8388 es8388(21, 22, 400000);
```
**自动添加**:
- 库引用: `#include <ES8388.h>`
- 变量定义: `ES8388 varName;`

#### es8388_begin
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 初始化ES8388芯片和I2S接口
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
**值输入**:
- `SAMPLE_RATE`: 数字输入 - 采样率
- `MCK_PIN`: 数字输入 - MCLK引脚号
- `BCK_PIN`: 数字输入 - BCLK引脚号
- `WS_PIN`: 数字输入 - WS引脚号
- `DATA_OUT_PIN`: 数字输入 - 数据输出引脚号
- `DATA_IN_PIN`: 数字输入 - 数据输入引脚号
**生成代码**:
```cpp
es8388.begin(44100, 39, 41, 42, 38, 40);
```
**自动添加**:
- setup代码: `es8388.begin(...)`

### 输入输出配置块

#### es8388_set_input_select
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 选择音频输入源
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
- `INPUT`: 下拉选择 - 输入源选择 (IN1)
**生成代码**:
```cpp
es8388.inputSelect(IN1);
```

#### es8388_set_output_select
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 选择音频输出
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
- `OUTPUT`: 下拉选择 - 输出选择 (OUTALL)
**生成代码**:
```cpp
es8388.outputSelect(OUTALL);
```

#### es8388_set_input_gain
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 设置输入增益 (0-8)
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
**值输入**:
- `GAIN`: 数字输入 - 输入增益值
**生成代码**:
```cpp
es8388.setInputGain(8);
```

#### es8388_set_output_volume
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 设置输出音量 (0-33)
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
**值输入**:
- `VOLUME`: 数字输入 - 输出音量值
**生成代码**:
```cpp
es8388.setOutputVolume(20);
```

#### es8388_dac_mute
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 设置DAC静音状态
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
- `MUTE`: 下拉选择 - 静音开关 (TRUE/FALSE)
**生成代码**:
```cpp
es8388.DACmute(true);
```

#### es8388_set_alc_mode
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 设置自动电平控制模式
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
- `ALC_MODE`: 下拉选择 - ALC模式 (DISABLE/GENERIC/VOICE/MUSIC)
**生成代码**:
```cpp
es8388.setALCmode(GENERIC);
```

#### es8388_analog_bypass
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 设置模拟直通模式
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
- `BYPASS`: 下拉选择 - 直通开关 (TRUE/FALSE)
**生成代码**:
```cpp
es8388.analogBypass(true);
```

### 录音功能块

#### es8388_start_recording
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 开始录音指定时长
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
**值输入**:
- `DURATION`: 数字输入 - 录音时长（秒）
**生成代码**:
```cpp
es8388.startRecording(5.0);
```

#### es8388_stop_recording
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 停止录音
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
**生成代码**:
```cpp
es8388.stopRecording();
```

### 播放功能块

#### es8388_start_playback
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 开始播放录制的音频
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
**生成代码**:
```cpp
es8388.startPlayback();
```

#### es8388_stop_playback
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 停止播放
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
**生成代码**:
```cpp
es8388.stopPlayback();
```

#### es8388_record_and_play
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 录音并立即播放
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
**值输入**:
- `DURATION`: 数字输入 - 录音时长（秒）
**生成代码**:
```cpp
es8388.recordAndPlay(5.0);
```

### 实时音频处理块

#### es8388_enable_passthrough
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 启用音频直通模式
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
**生成代码**:
```cpp
es8388.enablePassthrough();
```

#### es8388_disable_passthrough
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 禁用音频直通模式
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
**生成代码**:
```cpp
es8388.disablePassthrough();
```

#### es8388_process_audio
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 处理音频数据（用于实时音频处理）
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
**生成代码**:
```cpp
es8388.processAudio();
```

### 状态查询块

#### es8388_is_recording
**类型**: 值块 (output: Boolean)
**描述**: 检查是否正在录音
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
**生成代码**:
```cpp
es8388.isRecording()
```

#### es8388_is_playing
**类型**: 值块 (output: Boolean)
**描述**: 检查是否正在播放
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
**生成代码**:
```cpp
es8388.isPlaying()
```

#### es8388_get_recorded_samples
**类型**: 值块 (output: Number)
**描述**: 获取已录音的样本数量
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
**生成代码**:
```cpp
es8388.getRecordedSamples()
```

#### es8388_get_recorded_duration
**类型**: 值块 (output: Number)
**描述**: 获取录音时长（秒）
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
**生成代码**:
```cpp
es8388.getRecordedDuration()
```

### 调试工具块

#### es8388_scan_i2c
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 扫描I2C总线上的设备
**字段**:
- `VAR`: 变量选择 - ES8388对象变量
**生成代码**:
```cpp
es8388.scanI2C();
```

## .abi 文件生成规范

### 块连接规则
- **Hat块**: 无连接属性，通过 `inputs` 连接内部语句
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段

### 工具箱默认配置
部分块预设了影子块：
- `es8388_create.SDA`: 默认类型 "21"
- `es8388_create.SCL`: 默认类型 "22"
- `es8388_create.SPEED`: 默认类型 "400000"
- `es8388_begin.SAMPLE_RATE`: 默认类型 "44100"
- `es8388_begin.MCK_PIN`: 默认类型 "39"
- `es8388_begin.BCK_PIN`: 默认类型 "41"
- `es8388_begin.WS_PIN`: 默认类型 "42"
- `es8388_begin.DATA_OUT_PIN`: 默认类型 "38"
- `es8388_begin.DATA_IN_PIN`: 默认类型 "40"
- `es8388_set_input_gain.GAIN`: 默认类型 "8"
- `es8388_set_output_volume.VOLUME`: 默认类型 "20"
- `es8388_start_recording.DURATION`: 默认类型 "5"
- `es8388_record_and_play.DURATION`: 默认类型 "5"

### 变量管理
- 创建ES8388对象时使用`field_input`让用户输入变量名
- 其他块使用`field_variable`选择已创建的ES8388对象变量
- 变量重命名会自动同步到所有引用该变量的块

### 智能板卡适配
- 当前库仅支持ESP32系列开发板
- 自动包含ESP32相关的I2S驱动库

## 使用示例

### 基本录音播放
```json
{
  "type": "es8388_create",
  "fields": {"VAR": "audioCodec"},
  "inputs": {
    "SDA": {"shadow": {"type": "math_number", "fields": {"NUM": "21"}}},
    "SCL": {"shadow": {"type": "math_number", "fields": {"NUM": "22"}}},
    "SPEED": {"shadow": {"type": "math_number", "fields": {"NUM": "400000"}}}
  },
  "next": {
    "type": "es8388_begin",
    "fields": {"VAR": "audioCodec"},
    "inputs": {
      "SAMPLE_RATE": {"shadow": {"type": "math_number", "fields": {"NUM": "44100"}}},
      "MCK_PIN": {"shadow": {"type": "math_number", "fields": {"NUM": "39"}}},
      "BCK_PIN": {"shadow": {"type": "math_number", "fields": {"NUM": "41"}}},
      "WS_PIN": {"shadow": {"type": "math_number", "fields": {"NUM": "42"}}},
      "DATA_OUT_PIN": {"shadow": {"type": "math_number", "fields": {"NUM": "38"}}},
      "DATA_IN_PIN": {"shadow": {"type": "math_number", "fields": {"NUM": "40"}}}
    },
    "next": {
      "type": "es8388_set_input_gain",
      "fields": {"VAR": "audioCodec"},
      "inputs": {
        "GAIN": {"shadow": {"type": "math_number", "fields": {"NUM": "8"}}}
      },
      "next": {
        "type": "es8388_set_output_volume",
        "fields": {"VAR": "audioCodec"},
        "inputs": {
          "VOLUME": {"shadow": {"type": "math_number", "fields": {"NUM": "20"}}}
        },
        "next": {
          "type": "es8388_record_and_play",
          "fields": {"VAR": "audioCodec"},
          "inputs": {
            "DURATION": {"shadow": {"type": "math_number", "fields": {"NUM": "5"}}}
          }
        }
      }
    }
  }
}
```

### 实时音频处理
```json
{
  "type": "es8388_create",
  "fields": {"VAR": "audioCodec"},
  "inputs": {
    "SDA": {"shadow": {"type": "math_number", "fields": {"NUM": "21"}}},
    "SCL": {"shadow": {"type": "math_number", "fields": {"NUM": "22"}}},
    "SPEED": {"shadow": {"type": "math_number", "fields": {"NUM": "400000"}}}
  },
  "next": {
    "type": "es8388_begin",
    "fields": {"VAR": "audioCodec"},
    "inputs": {
      "SAMPLE_RATE": {"shadow": {"type": "math_number", "fields": {"NUM": "44100"}}},
      "MCK_PIN": {"shadow": {"type": "math_number", "fields": {"NUM": "39"}}},
      "BCK_PIN": {"shadow": {"type": "math_number", "fields": {"NUM": "41"}}},
      "WS_PIN": {"shadow": {"type": "math_number", "fields": {"NUM": "42"}}},
      "DATA_OUT_PIN": {"shadow": {"type": "math_number", "fields": {"NUM": "38"}}},
      "DATA_IN_PIN": {"shadow": {"type": "math_number", "fields": {"NUM": "40"}}}
    },
    "next": {
      "type": "es8388_enable_passthrough",
      "fields": {"VAR": "audioCodec"}
    }
  }
}
```

## 技术特性
- **立体声音频处理**: 支持16位立体声音频输入输出
- **I2S接口**: 使用标准I2S协议进行数字音频传输
- **多种输入源**: 支持线路输入和差分输入模式
- **灵活输出**: 支持多种输出配置
- **自动电平控制**: 内置ALC功能，支持语音和音乐模式
- **实时处理**: 支持音频直通和实时处理

## 注意事项
- 仅支持ESP32系列开发板
- 需要正确配置I2S引脚连接
- 录音功能需要足够的内存空间
- 实时音频处理需要在主循环中调用processAudio()方法
- 输入增益范围：0-8
- 输出音量范围：0-33
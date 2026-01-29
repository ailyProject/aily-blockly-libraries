# ESP32 I2S音频库

ESP32 I2S音频接口库,支持标准I2S、TDM、PDM模式,用于音频播放和录制

## 库信息
- **库名**: @aily-project/lib-esp_i2s
- **版本**: 3.4.0
- **兼容**: ESP32系列开发板

## 功能特性

### 快速操作模式
- **快速播放音调**: 一键播放指定频率和时长的音调,自动处理I2S初始化
- **快速录音**: 一键录制WAV音频到变量,自动处理配置

### 标准操作模式
- **完整I2S控制**: 支持创建多个I2S对象,独立配置
- **多模式支持**: 标准I2S、TDM、PDM TX/RX
- **灵活引脚**: 支持自定义所有I2S引脚
- **音调生成**: 方波音调生成功能
- **WAV录制/播放**: 支持录制和播放WAV格式音频

## 块定义

| 块类型 | 连接 | 字段/输入 | 功能描述 |
|--------|------|----------|----------|
| `i2s_create` | 语句块 | VAR(field_input) | 创建I2S对象 |
| `i2s_set_pins_std` | 语句块 | VAR(field_variable), BCLK/WS/DOUT/DIN/MCLK | 设置标准模式引脚 |
| `i2s_set_pins_pdm_tx` | 语句块 | VAR(field_variable), CLK/DOUT0/DOUT1 | 设置PDM发送引脚 |
| `i2s_set_pins_pdm_rx` | 语句块 | VAR(field_variable), CLK/DIN0-3 | 设置PDM接收引脚 |
| `i2s_set_inverted` | 语句块 | VAR(field_variable), BCLK_INV/WS_INV/MCLK_INV | 设置信号反转 |
| `i2s_begin` | 语句块 | VAR, MODE, RATE, BITS, SLOT, SLOT_MASK | 初始化I2S |
| `i2s_configure_tx` | 语句块 | VAR, RATE, BITS, SLOT, SLOT_MASK | 配置TX通道 |
| `i2s_configure_rx` | 语句块 | VAR, RATE, BITS, SLOT, TRANSFORM | 配置RX通道 |
| `i2s_write_byte` | 语句块 | VAR, BYTE(input) | 写入单字节 |
| `i2s_write_sample` | 语句块 | VAR, SAMPLE(input) | 写入16位立体声采样 |
| `i2s_write_buffer` | 值块 | VAR, BUFFER(input), SIZE(input) | 写入缓冲区数据 |
| `i2s_read_bytes` | 语句块 | VAR, BUFFER(input), SIZE(input) | 读取字节数据 |
| `i2s_generate_tone` | 语句块 | VAR, FREQUENCY, DURATION, AMPLITUDE | 生成方波音调 |
| `i2s_record_wav` | 值块 | VAR, SECONDS(input), SIZE_VAR | 录制WAV音频 |
| `i2s_play_wav` | 语句块 | VAR, DATA(input), LENGTH(input) | 播放WAV音频 |
| `i2s_free_wav_buffer` | 语句块 | BUFFER(input) | 释放WAV缓冲区 |
| `i2s_end` | 语句块 | VAR | 结束I2S |
| `i2s_get_last_error` | 值块 | VAR | 获取最后错误码 |
| `i2s_available` | 值块 | VAR | 获取可读字节数 |
| `i2s_tx_sample_rate` | 值块 | VAR | 获取TX采样率 |
| `i2s_rx_sample_rate` | 值块 | VAR | 获取RX采样率 |

## 使用示例

### 示例1: 标准模式播放音调
```
[创建I2S对象 命名为 i2s]
[I2S对象 i2s 设置标准模式引脚 BCLK 5 WS 25 DOUT 26 DIN -1 MCLK -1]
[初始化 I2S 对象 i2s 模式 标准I2S 采样率 44100 Hz 位宽 16位 声道 立体声 槽位 自动]
[I2S对象 i2s 生成方波音调 频率 440 Hz 持续 1000 毫秒 振幅 500]
```

### 示例3: WAV录制和播放
```
[创建I2S对象 命名为 i2s]
[I2S对象 i2s 设置标准模式引脚 BCLK 41 WS 42 DOUT -1 DIN 2 MCLK -1]
[初始化 I2S 对象 i2s 模式 标准I2S 采样率 16000 Hz 位宽 32位 声道 单声道 槽位 左声道]
[设置变量 wav_buffer 为 (I2S对象 i2s 录制WAV音频 时长 5 秒 保存大小到 wav_size)]
[I2S对象 i2s 播放WAV音频 数据 wav_buffer 长度 wav_size]
[释放WAV缓冲区 wav_buffer]
```

## 支持的模式
- **I2S_MODE_STD**: 标准I2S模式,用于大多数I2S音频设备
- **I2S_MODE_TDM**: TDM时分复用模式,多通道音频
- **I2S_MODE_PDM_TX**: PDM发送模式
- **I2S_MODE_PDM_RX**: PDM接收模式,连接PDM麦克风

## 支持的数据格式
- **位宽**: 8位/16位/24位/32位
- **声道**: 单声道/立体声
- **槽位**: 自动/左声道/右声道/双声道
- **采样率**: 8000Hz - 192000Hz
- **RX转换**: 无转换/32转16位/立体声转单声道

## 重要规则

1. **必须遵守**: 先设置引脚,再调用begin初始化
2. **引脚配置**: DIN和MCLK可选,不使用时设为-1
3. **音频模式**: 必须选择正确的I2S模式(标准/TDM/PDM)
4. **WAV内存**: recordWAV返回的数组需用`释放WAV缓冲区`块释放
5. **错误处理**: begin失败时会自动停止程序并输出错误信息

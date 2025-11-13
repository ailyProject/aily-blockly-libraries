# DFPlayer Blockly 库

DFRobot DFPlayer Mini 模块的 Blockly 封装，覆盖初始化、播放控制、循环模式与状态查询。

## 库信息
- **库名**：`@aily-project/lib-dfplayer`
- **版本**：`0.0.1`
- **兼容**：Arduino AVR / ESP32，需软串口 (SoftwareSerial)

## 块定义

| 块类型 | 连接 | 字段 / 输入 | .abi 关键片段 | 生成代码 |
|--------|------|-------------|----------------|----------|
| `dfplayer_begin` | 语句块 | `NAME(field_variable)`，`RX(input)`，`TX(input)` | `"NAME":{"id":"dfplayer1"}`；`"inputs":{"RX":{"shadow":...},"TX":...}` | 引入 DFPlayer/SoftwareSerial，创建 `SoftwareSerial(rx,tx)` 并在 `setup()` 中 `begin()`、`volume(10)` |
| `dfplayer_play` | 语句块 | `NAME`，`FILE(input)` | `"inputs":{"FILE":{"shadow":{"NUM":1}}}` | `name.play(file);` |
| `dfplayer_pause` | 语句块 | `NAME` | `-` | `name.pause();` |
| `dfplayer_start` | 语句块 | `NAME` | `-` | `name.start();` |
| `dfplayer_stop` | 语句块 | `NAME` | `-` | `name.stop();` |
| `dfplayer_next` | 语句块 | `NAME` | `-` | `name.next();` |
| `dfplayer_previous` | 语句块 | `NAME` | `-` | `name.previous();` |
| `dfplayer_volume` | 语句块 | `NAME`，`VOLUME(input)` | `"inputs":{"VOLUME":{"shadow":{"NUM":15}}}` | `name.volume(value);` |
| `dfplayer_volume_up` | 语句块 | `NAME` | `-` | `name.volumeUp();` |
| `dfplayer_volume_down` | 语句块 | `NAME` | `-` | `name.volumeDown();` |
| `dfplayer_eq` | 语句块 | `NAME`，`EQ(field_dropdown)` | `"EQ":"0..5"` | `name.EQ(eqMode);` |
| `dfplayer_output_device` | 语句块 | `NAME`，`DEVICE(dropdown)` | `"DEVICE":"1/2"` | `name.outputDevice(device);` |
| `dfplayer_loop` | 语句块 | `NAME`，`FILE(input)` | `"inputs":{"FILE":{"shadow":{"NUM":1}}}` | `name.loop(file);` |
| `dfplayer_play_folder` | 语句块 | `NAME`，`FOLDER(input)`，`FILE(input)` | `"inputs":{"FOLDER":{"shadow":{"NUM":1}},"FILE":{"shadow":{"NUM":1}}}` | `name.playFolder(folder,file);` |
| `dfplayer_enable_loop_all` | 语句块 | `NAME` | `-` | `name.enableLoopAll();` |
| `dfplayer_disable_loop_all` | 语句块 | `NAME` | `-` | `name.disableLoopAll();` |
| `dfplayer_play_mp3_folder` | 语句块 | `NAME`，`FILE(input)` | `"inputs":{"FILE":{"shadow":{"NUM":1}}}` | `name.playMp3Folder(file);` |
| `dfplayer_advertise` | 语句块 | `NAME`，`FILE(input)` | `"inputs":{"FILE":{"shadow":{"NUM":1}}}` | `name.advertise(file);` |
| `dfplayer_stop_advertise` | 语句块 | `NAME` | `-` | `name.stopAdvertise();` |
| `dfplayer_play_large_folder` | 语句块 | `NAME`，`FOLDER(input)`，`FILE(input)` | 与 `play_folder` 相同 | `name.playLargeFolder(folder,file);` |
| `dfplayer_loop_folder` | 语句块 | `NAME`，`FOLDER(input)` | `"inputs":{"FOLDER":{"shadow":{"NUM":1}}}` | `name.loopFolder(folder);` |
| `dfplayer_random_all` | 语句块 | `NAME` | `-` | `name.randomAll();` |
| `dfplayer_enable_loop` | 语句块 | `NAME` | `-` | `name.enableLoop();` |
| `dfplayer_disable_loop` | 语句块 | `NAME` | `-` | `name.disableLoop();` |
| `dfplayer_read_state` | 值块 | `NAME` | `-` | `name.readState()` |
| `dfplayer_read_volume` | 值块 | `NAME` | `-` | `name.readVolume()` |
| `dfplayer_read_eq` | 值块 | `NAME` | `-` | `name.readEQ()` |
| `dfplayer_read_file_counts` | 值块 | `NAME` | `-` | `name.readFileCounts()` |
| `dfplayer_read_current_file_number` | 值块 | `NAME` | `-` | `name.readCurrentFileNumber()` |
| `dfplayer_read_file_counts_in_folder` | 值块 | `NAME`，`FOLDER(input)` | `"inputs":{"FOLDER":{"shadow":{"NUM":1}}}` | `name.readFileCountsInFolder(folder)` |
| `dfplayer_available` | 值块 | `NAME` | `-` | `name.available()` |
| `dfplayer_read_type` | 值块 | `NAME` | `-` | `name.readType()` |
| `dfplayer_read` | 值块 | `NAME` | `-` | `name.read()` |
| `dfplayer_simple_play` | 语句块 | `RX(input)`，`TX(input)`，`FILE(input)` | `"inputs":{"RX":{"shadow":{"NUM":10}},"TX":{"shadow":{"NUM":11}},"FILE":{"shadow":{"NUM":1}}}` | 在 `setup()` 初始化临时 DFPlayer/SoftwareSerial 并播放指定文件 |

## 字段类型映射

| 类型 | .abi 格式 | 示例 |
|------|-----------|------|
| `field_variable` | `{"NAME":{"id":"dfplayer1"}}` | 指定 DFPlayer 实例 |
| `field_dropdown` | `"EQ":"2"` | 取值对应设备/模式 |
| `input_value` | `"inputs":{"FILE":{"shadow":{"type":"math_number","fields":{"NUM":1}}}}` | 数值参数默认有 shadow |
| `input_statement` | 此库未使用 | - |

## 连接规则

- **语句块**：具备 `previousStatement` / `nextStatement`，用于流程控制；所有控制块均为语句块。
- **值块**：仅带 `output`，可插入数学或逻辑表达式，例如把 `dfplayer_available` 接入 `if` 条件。
- **变量字段**：`field_variable` 必须是 DFPlayer 类型，Blockly 会自动限制；同一个变量可在多块共享。
- **输入 shadow**：RX/TX/文件/文件夹/音量均提供 `math_number` shadow，直接输入整数即可，可与数学表达式互联。

## 使用示例

### 初始化并播放
```json
{
  "type": "dfplayer_begin",
  "fields": {"NAME": {"name": "dfplayer1"}},
  "inputs": {
    "RX": {"shadow": {"type": "math_number", "fields": {"NUM": 10}}},
    "TX": {"shadow": {"type": "math_number", "fields": {"NUM": 11}}}
  },
  "next": {
    "block": {
      "type": "dfplayer_play",
      "fields": {"NAME": {"name": "dfplayer1"}},
      "inputs": {
        "FILE": {"shadow": {"type": "math_number", "fields": {"NUM": 1}}}
      }
    }
  }
}
```

### 查询状态
```json
{
  "type": "controls_if",
  "inputs": {
    "IF0": {
      "block": {
        "type": "dfplayer_available",
        "fields": {"NAME": {"name": "dfplayer1"}}
      }
    },
    "DO0": {
      "block": {
        "type": "core_serial_println",
        "inputs": {
          "TEXT": {
            "block": {
              "type": "dfplayer_read_type",
              "fields": {"NAME": {"name": "dfplayer1"}}
            }
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **初始化唯一性**：`dfplayer_begin` / `dfplayer_simple_play` 会向 `setup()` 注册 `SoftwareSerial.begin`，一个变量仅需初始化一次，重复调用会导致重复定义。
2. **软串口限制**：RX、TX 应选用支持外部中断的数字引脚（UNO 示例为 D10/D11）；若需要硬串口请自行修改生成器。
3. **音量范围**：`dfplayer_volume` 建议输入 0~30 之间数值；超出范围 DFPlayer 会自动夹紧。
4. **文件/文件夹编号**：均为十进制，需与 TF 卡中的命名规则匹配（例如 `mp3/0001.mp3` → 文件号 1）。
5. **消息读取**：`dfplayer_available` 返回 `true` 后再调用 `read_type` / `read`，否则返回值无意义。

## 支持参数

| 功能 | 取值 | 说明 |
|------|------|------|
| EQ 模式 | `0:Normal`, `1:Pop`, `2:Rock`, `3:Jazz`, `4:Classic`, `5:Bass` | 映射到 `DFRobotDFPlayerMini::EQ` |
| 输出设备 | `1:U-Disk`, `2:TF` | 具体数值与库文档一致 |
| Shadow 默认值 | RX=10、TX=11、音量=15、文件=1、文件夹=1 | 可按需替换 |

遵循《Arduino库转Blockly库规范.md》和《Blockly库README编写规范.md》，本库不依赖 Google Blockly 默认 i18n 文件。*** End Patch

# DFPlayer Blockly 库

DFRobot DFPlayer Mini MP3模块的Blockly封装库。

## 库信息
- **库名**：`@aily-project/lib-dfplayer`
- **版本**：`0.0.1`
- **兼容**：Arduino AVR / ESP32

## 块定义

| 块名称 | 类型 | 功能 | 输入/字段 | 生成代码 |
|--------|------|------|-----------|----------|
| dfplayer_begin | 语句块 | 初始化模块 | NAME, RX, TX | SoftwareSerial + begin() |
| dfplayer_play | 语句块 | 播放文件 | NAME, FILE | play(file) |
| dfplayer_pause | 语句块 | 暂停 | NAME | pause() |
| dfplayer_start | 语句块 | 继续 | NAME | start() |
| dfplayer_stop | 语句块 | 停止 | NAME | stop() |
| dfplayer_next | 语句块 | 下一曲 | NAME | next() |
| dfplayer_previous | 语句块 | 上一曲 | NAME | previous() |
| dfplayer_volume | 语句块 | 设置音量 | NAME, VOLUME | volume(v) |
| dfplayer_read_state | 值块 | 读取状态 | NAME | readState() |
| dfplayer_available | 值块 | 检查消息 | NAME | available() |

## 字段类型映射

| 类型 | 格式 | 说明 |
|------|------|------|
| field_variable | DFPlayer类型 | 模块实例 |
| field_dropdown | EQ/DEVICE | 均衡/设备选择 |
| input_value | Number | 数值参数 |

## 连接规则

- 语句块：具备previousStatement/nextStatement
- 值块：仅带output，可接入表达式
- 变量字段：限定DFPlayer类型

## 使用示例

```
[初始化 DFPlayer 模块 dfplayer1 RX 引脚 10 TX 引脚 11]
[DFPlayer dfplayer1 设置音量为 15]
[DFPlayer dfplayer1 播放文件编号 1]
```

## 重要规则

1. **初始化顺序**：必须先初始化模块再进行其他操作
2. **引脚选择**：RX/TX需选用支持中断的引脚
3. **音量范围**：0-30
4. **文件编号**：需与TF卡命名规则匹配(如mp3/0001.mp3)

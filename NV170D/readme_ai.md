# 特定语音播报

硬件采用openjumper 语音播报模块(ojmoBph4010) 基于特定语音播报库，内置69端日常语音，通过一个IO驱动，实现文本内容的语音合成与播放。

## Library Info
- **Name**: @aily-project/lib-nv170d
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `nv170d_init` | Statement | NV_NAME(field_input), NV_PIN(dropdown) | `nv170d_init("nv170d", NV_PIN)` | `` |
| `nv170d_play` | Statement | NV_NAME(field_input), NV_PLAYNUM(dropdown) | `nv170d_play("nv170d", 0X00)` | `....sendDWS(...);\n` |
| `nv170d_set` | Statement | NV_NAME(field_input), NV_SET(dropdown) | `nv170d_set("nv170d", 0XE0)` | `....sendDWS(...);\n` |
| `nv170d_playcon` | Statement | NV_NAME(field_input), NV_PLAYCONNUM(dropdown) | `nv170d_playcon("nv170d", 0XF1)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| NV_PLAYNUM | 0X00, 0X01, 0X02, 0X03, 0X04, 0X05, 0X06, 0X07, 0X08, 0X09, 0X0a, 0X0b, 0X0c, 0X0d, 0X0e, 0X0f, 0X10, 0X11, 0X12, 0X13, 0X14, 0X15, 0X16, 0X17, 0X18, 0X19, 0X1a, 0X1b, 0X1c, 0X1d, 0X1e, 0X1f, 0X20, 0X21, 0X22, 0X23, 0X24, 0X25, 0X26, 0X27, 0X28, 0X29, 0X2a, 0X2b, 0X2c, 0X2d, 0X2e, 0X2f, 0X30, 0X31, 0X32, 0X33, 0X34, 0X35, 0X36, 0X37, 0X38, 0X39, 0X3a, 0X3b, 0X3c, 0X3d, 0X3e, 0X3f, 0X40, 0X41, 0X42, 0X43, 0X44, 0X45, 0X46, 0X47, 0X48, 0X49, 0X4a, 0X4b, 0X4c, 0X4d, 0X4e, 0X4f, 0X50, 0X51, 0X52, 0X53, 0X54, 0X55, 0X56, 0X57, 0X58, 0X59, 0X5a, 0X5b, 0X5c, 0X5d, 0X5e, 0X5f, 0X60, 0X61, 0X62, 0X63, 0X64, 0X65, 0X66, 0X67, 0X68, 0X69, 0X6a, 0X6b, 0X6c, 0X6d, 0X6e, 0X6f, 0X70, 0X71, 0X72, 0X73, 0X74, 0X75, 0X76, 0X77, 0X78, 0X79, 0X7a, 0X7b, 0X7c | 老师 / 爸爸 / 妈妈 / 爷爷 / 奶奶 / 姥姥 / 姥爷 / 哥哥 / 姐姐 / 叔叔 / 阿姨 / 上午 / 下午 / 晚上 / 前方 / 厘米 / 新年快乐 / 身体健康 / 工作顺利 / 学习进步 / 您好 / 谢谢 / 的 / 祝 / 慢走 / 欢迎光临 / 亲爱的 / 同学们 / 工作辛苦了 / 点 / 打开 / 关闭 / 千 / 百 / 十/时 / 1 / 2 / 3 / 4 / 5 / 6 / 7 / 8 / 9 / 0 / 当前 / 转 / 左 / 右 / 请 / 已 / 现在 / 红灯 / 绿灯 / 是 / 黄灯 / 温度 / 湿度 / 欢迎常来 / 秒 / 分 / 变 / 等 / 下一次 / 功能 / 障碍物 / 世界那么大，我想去看看 / 今天 / 年 / 月 / 日 / 星期 / 农历 / 现在时刻 / 北京时间 / 整 / 度 / 百分之 / 距离 / 厘米 / 明天 / 天气 / 白天 / 夜间 / 晴 / 多云 / 阴 / 雨 / 雷阵 / 大 / 小 / 中 / 夹 / 雪 / 雾 / 霾 / 风 / 东 / 南 / 西 / 北 / 到 / 级 / 偏 / 方向 / 空气质量 / 优 / 良 / 轻度污染 / 中度污染 / 重度污染 / 上 / 下 / 接近 / 远离 / 灯 / 风扇 / 红色 / 绿色 / 蓝色 / 黄色 / 白色 / 叮音效 / 滴滴滴 / 叮叮音效 |
| NV_SET | 0XE0, 0XE1, 0XE2, 0XE3, 0XE4, 0XE5, 0XE6, 0XE7, 0XF2, 0XFE | 设置音量0 / 设置音量1 / 设置音量2 / 设置音量3 / 设置音量4 / 设置音量5 / 设置音量6 / 设置音量7 / 循环播放 / 停止播放 |
| NV_PLAYCONNUM | 0XF1, 0X00, 0X01, 0X02, 0X03, 0X04, 0X05, 0X06, 0X07, 0X08, 0X09, 0X0a, 0X0b, 0X0c, 0X0d, 0X0e, 0X0f, 0X10, 0X11, 0X12, 0X13, 0X14, 0X15, 0X16, 0X17, 0X18, 0X19, 0X1a, 0X1b, 0X1c, 0X1d, 0X1e, 0X1f, 0X20, 0X21, 0X22, 0X23, 0X24, 0X25, 0X26, 0X27, 0X28, 0X29, 0X2a, 0X2b, 0X2c, 0X2d, 0X2e, 0X2f, 0X30, 0X31, 0X32, 0X33, 0X34, 0X35, 0X36, 0X37, 0X38, 0X39, 0X3a, 0X3b, 0X3c, 0X3d, 0X3e, 0X3f, 0X40, 0X41, 0X42, 0X43, 0X44, 0X45, 0X46, 0X47, 0X48, 0X49, 0X4a, 0X4b, 0X4c, 0X4d, 0X4e, 0X4f, 0X50, 0X51, 0X52, 0X53, 0X54, 0X55, 0X56, 0X57, 0X58, 0X59, 0X5a, 0X5b, 0X5c, 0X5d, 0X5e, 0X5f, 0X60, 0X61, 0X62, 0X63, 0X64, 0X65, 0X66, 0X67, 0X68, 0X69, 0X6a, 0X6b, 0X6c, 0X6d, 0X6e, 0X6f, 0X70, 0X71, 0X72, 0X73, 0X74, 0X75, 0X76, 0X77, 0X78, 0X79, 0X7a, 0X7b, 0X7c, 0XF3, 0XF4 | 连码-头 / 老师 / 爸爸 / 妈妈 / 爷爷 / 奶奶 / 姥姥 / 姥爷 / 哥哥 / 姐姐 / 叔叔 / 阿姨 / 上午 / 下午 / 晚上 / 前方 / 厘米 / 新年快乐 / 身体健康 / 工作顺利 / 学习进步 / 您好 / 谢谢 / 的 / 祝 / 慢走 / 欢迎光临 / 亲爱的 / 同学们 / 工作辛苦了 / 点 / 打开 / 关闭 / 千 / 百 / 十/时 / 1 / 2 / 3 / 4 / 5 / 6 / 7 / 8 / 9 / 0 / 当前 / 转 / 左 / 右 / 请 / 已 / 现在 / 红灯 / 绿灯 / 是 / 黄灯 / 温度 / 湿度 / 欢迎常来 / 秒 / 分 / 变 / 等 / 下一次 / 功能 / 障碍物 / 世界那么大，我想去看看 / 今天 / 年 / 月 / 日 / 星期 / 农历 / 现在时刻 / 北京时间 / 整 / 度 / 百分之 / 距离 / 厘米 / 明天 / 天气 / 白天 / 夜间 / 晴 / 多云 / 阴 / 雨 / 雷阵 / 大 / 小 / 中 / 夹 / 雪 / 雾 / 霾 / 风 / 东 / 南 / 西 / 北 / 到 / 级 / 偏 / 方向 / 空气质量 / 优 / 良 / 轻度污染 / 中度污染 / 重度污染 / 上 / 下 / 接近 / 远离 / 灯 / 风扇 / 红色 / 绿色 / 蓝色 / 黄色 / 白色 / 叮音效 / 滴滴滴 / 叮叮音效 / 连码-尾 / 连码-静音(后接时间单位10ms) |

## ABS Examples

### Basic Usage
```
arduino_setup()
    nv170d_init("nv170d", NV_PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

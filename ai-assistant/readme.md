# adafruit_AI-Assistant

AI语音助手模块操作库

## 库信息
- **库名**: @aily-project/lib-ai-assistant
- **版本**: 0.0.8
- **兼容**: Arduino UNO、Mega2560、ESP32全系列（ESP32/ESP32S2/ESP32S3/ESP32C3/ESP32C6等）

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `ai_assistant_config` | 语句块 | UART(field_dropdown), SPEED(field_dropdown), RX/TX(field_dropdown) | `"fields":{"UART":"UART1","SPEED":"9600","RX":"16","TX":"17"}` | `Serial1.begin(9600, SERIAL_8N1, 16, 17); receivedCommand=""` |
| `serial_command_handler` | 值块 | ACTION(field_dropdown) | `"fields":{"ACTION":"MOVE_FORWARD"}` | `(receivedCommand.indexOf("MOVE F") >= 0)` |
| `serial_custom_command` | 值块 | CUSTOM_CMD(field_input) | `"fields":{"CUSTOM_CMD":"computer"}` | `(receivedCommand.indexOf("computer") >= 0)` |
| `serial_clear_command` | 语句块 | 无 | `{}` | `receivedCommand = "";` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown | 字符串 | `"UART": "UART1"` |
| field_input | 字符串 | `"CUSTOM_CMD": "computer"` |

## 连接规则
- **语句块**: ai_assistant_config和serial_clear_command有previousStatement/nextStatement
- **值块**: serial_command_handler和serial_custom_command返回Boolean，用于条件判断
- **板卡适配**: 
  - **ESP32**: UART0固定引脚，其他UART可自定义RX/TX引脚，数量自动适配芯片
  - **Mega2560**: 4个硬件串口，引脚固定
  - **UNO**: 硬件串口或软串口（可自定义引脚）

## 使用示例

### ESP32配置（自定义引脚）
```json
{"type": "ai_assistant_config", "fields": {"UART": "UART1", "SPEED": "9600", "RX": "16", "TX": "17"}}
```

### UNO配置（软串口）
```json
{"type": "ai_assistant_config", "fields": {"UART": "SOFTWARE", "SPEED": "9600", "RX": "2", "TX": "3"}}
```

## 重要规则
1. ai_assistant_config必须在setup区域首先配置
2. 命令判断块返回Boolean，用于条件判断
3. ESP32 UART0引脚固定，其他UART可自定义引脚
4. 避免软串口引脚与其他功能冲突

## 支持的命令类型
- **运动控制**: "小车前进"(MOVE_FORWARD), "小车后退"(MOVE_BACKWARD), "小车左转"(TURN_LEFT), "小车右转"(TURN_RIGHT), "小车急停"(STOP)
- **LED控制**: "打开LED"(LED_ON), "关闭LED"(LED_OFF), "LED闪烁"(LED_BLINK)  
- **舵机控制**: "舵机旋转"(SERVO_ROTATE)
- **风扇控制**: "修改风扇速度"(FAN_SPEED), "打开风扇"(FAN_ON), "关闭风扇"(FAN_OFF)
- **彩灯控制**: "打开彩灯"(RGB_ON), "关闭彩灯"(RGB_OFF), "设置彩灯亮度"(RGB_BRIGHTNESS), "设置彩灯渐变色差"(RGB_GRADIENT)
- **机械臂控制**: "机械臂抓取"(ARM_GRAB), "机械臂松开"(ARM_RELEASE), "机械臂回归初始位置"(ARM_DOWN)
- **继电器控制**: "打开继电器"(RELAY_ON), "关闭继电器"(RELAY_OFF)

## 技术规格
- UART串口通信，可配置波特率
- 内置音频编解码器和麦克风阵列
- 支持语音识别、自然语言处理、语音合成
- 工作电压3.3V-5V兼容

## 更新日志

### v0.0.8
- ✨ ESP32所有硬件串口（除UART0外）支持自定义RX/TX引脚配置
- ✨ 新增`serial_custom_command`块支持自定义命令匹配
- ✨ 新增`serial_clear_command`块用于清空接收缓冲
- 🐛 修复Mega板卡识别问题
- 📝 改进工具提示和说明文档

### v0.0.1
- 初始版本，支持基础语音命令识别
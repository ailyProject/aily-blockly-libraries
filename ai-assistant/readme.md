# adafruit_AI-Assistant

AI语音助手模块操作库

## 库信息
- **库名**: @aily-project/lib-ai-assistant
- **版本**: 0.0.1
- **兼容**: Arduino UNO、Mega2560、ESP32S3

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `ai_assistant_config` | 语句块 | SERIAL_OPTION(扩展字段), SERIAL_TYPE(field_dropdown), RX_PIN/TX_PIN(field_dropdown) | `"fields":{"SERIAL_OPTION":"UART1","SERIAL_TYPE":"HARDWARE","RX_PIN":"2","TX_PIN":"3"}` | `Serial1.begin(9600); receivedCommand=""` |
| `serial_command_handler` | 值块 | ACTION(field_dropdown) | `"fields":{"ACTION":"MOVE_FORWARD"}` | `(receivedCommand.indexOf("MOVE F") >= 0)` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown | 字符串 | `"ACTION": "MOVE_FORWARD"` |
| 扩展字段 | 动态生成 | `"SERIAL_OPTION": "UART1"` |

## 连接规则

- **语句块**: ai_assistant_config有previousStatement/nextStatement，通过`next`字段连接
- **值块**: serial_command_handler有output，返回Boolean类型，连接到条件判断
- **特殊规则**: 
  - 根据板卡类型自动配置可用串口选项
  - 自动生成receivedCommand全局变量和串口接收代码
  - 支持硬件串口和软件串口(Arduino UNO)

## 使用示例

### AI助手配置(ESP32)
```json
{
  "type": "ai_assistant_config",
  "id": "ai_config",
  "fields": {
    "SERIAL_OPTION": "UART1"
  }
}
```

### AI助手配置(Arduino UNO软串口)
```json
{
  "type": "ai_assistant_config", 
  "id": "ai_config_uno",
  "fields": {
    "SERIAL_TYPE": "SOFTWARE",
    "RX_PIN": "2",
    "TX_PIN": "3"
  }
}
```

### 命令判断处理
```json
{
  "type": "controls_if",
  "id": "command_check",
  "inputs": {
    "IF0": {
      "block": {
        "type": "serial_command_handler",
        "fields": {"ACTION": "MOVE_FORWARD"}
      }
    },
    "DO0": {
      "block": {
        "type": "serial_print",
        "inputs": {"CONTENT": {"block": {"type": "text", "fields": {"TEXT": "小车前进"}}}}
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: ai_assistant_config必须在setup区域首先配置，建立串口通信
2. **连接限制**: serial_command_handler返回Boolean，用于条件判断语句
3. **板卡适配**: 根据板卡类型自动显示可用串口选项(ESP32:3个硬件串口, Mega2560:4个硬件串口, UNO:1个硬件+软串口)
4. **常见错误**: ❌ 未配置串口直接使用命令判断，❌ 软串口引脚与其他功能冲突

## 支持的命令类型
- **运动控制**: "小车前进"(MOVE_FORWARD), "小车后退"(MOVE_BACKWARD), "小车左转"(TURN_LEFT), "小车右转"(TURN_RIGHT), "小车急停"(STOP)
- **LED控制**: "打开LED"(LED_ON), "关闭LED"(LED_OFF), "LED闪烁"(LED_BLINK)  
- **舵机控制**: "舵机旋转"(SERVO_ROTATE)
- **风扇控制**: "修改风扇速度"(FAN_SPEED), "打开风扇"(FAN_ON), "关闭风扇"(FAN_OFF)
- **彩灯控制**: "打开彩灯"(RGB_ON), "关闭彩灯"(RGB_OFF), "设置彩灯亮度"(RGB_BRIGHTNESS), "设置彩灯渐变色差"(RGB_GRADIENT)
- **机械臂控制**: "机械臂抓取"(ARM_GRAB), "机械臂松开"(ARM_RELEASE), "机械臂回归初始位置"(ARM_DOWN)
- **继电器控制**: "打开继电器"(RELAY_ON), "关闭继电器"(RELAY_OFF)

## 技术规格
- **通信协议**: UART串口通信，波特率9600
- **模块特性**: 内置音频编解码器和麦克风阵列
- **AI功能**: 语音识别、自然语言处理、语音合成
- **云端支持**: 可连接云端AI服务实现智能对话
- **工作电压**: 3.3V-5V兼容
- **串口配置**: ESP32(Serial/Serial1/Serial2), Mega2560(Serial/Serial1/Serial2/Serial3), UNO(Serial+软串口选项)
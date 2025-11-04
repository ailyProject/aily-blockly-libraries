# AI-Assistant 串口通信库

Mind+ 扩展库，用于与 AI-Assistant 模块进行串口通信，支持 Arduino UNO、Mega2560 和 ESP32 开发板。

## 📋 功能特性

- ✅ **多平台支持**：Arduino UNO、Mega2560、ESP32-S3
- ✅ **灵活的串口选择**：硬件串口、软件串口自动适配
- ✅ **统一的波特率**：所有平台统一使用 9600 波特率
- ✅ **命令接收**：支持预定义命令和自定义命令检测
- ✅ **命令去重**：自动清除重复接收的命令
- ✅ **调试输出**：完整的串口接收日志

## 🚀 快速开始

### 1. 初始化 AI-Assistant 串口通信

在 Mind+ 中添加"配置AI-assistant串口通信"块，选择对应的开发板和串口。

```
配置AI-assistant串口通信
  选择串口: Serial2 (Mega2560) / Serial1 (ESP32)
```

### 2. 接收命令

使用"接收到 xxx 命令"块检测特定命令：

```
如果 接收到 小车前进 命令
  则执行
    输出 "前进"
```

### 3. 自定义命令

使用"接收到自定义命令 xxx"块检测自定义命令：

```
如果 接收到自定义命令 MOVE F
  则执行
    输出 "自定义命令"
```

### 4. 清空命令

处理完所有命令后，使用"清空已接收的命令"块：

```
清空已接收的命令
```

## 📡 硬件连接

### Arduino UNO

| AI-Assistant | Arduino UNO |
|--------------|-------------|
| TX | RX (D0) 或软串口 RX |
| RX | TX (D1) 或软串口 TX |
| GND | GND |

**软串口默认引脚**：RX=D2, TX=D3

### Mega2560

| AI-Assistant | Mega2560 |
|--------------|----------|
| TX | RX2 (D17) |
| RX | TX2 (D16) |
| GND | GND |

**支持的硬件串口**：
- Serial (D0/D1)
- Serial1 (D19/D18)
- Serial2 (D17/D16) ✅ 推荐
- Serial3 (D15/D14)

### ESP32-S3

| AI-Assistant | ESP32-S3 |
|--------------|----------|
| TX | RX (GPIO17/44) |
| RX | TX (GPIO18/43) |
| GND | GND |

**支持的硬件串口**：
- UART0 (GPIO43/44) - 通常被USB占用
- UART1 (GPIO17/18) ✅ 推荐
- UART2 (GPIO15/16)

## 🔧 预定义命令列表

| 命令 | 说明 |
|------|------|
| MOVE_FORWARD | 小车前进 |
| MOVE_BACKWARD | 小车后退 |
| TURN_LEFT | 小车左转 |
| TURN_RIGHT | 小车右转 |
| STOP | 小车急停 |
| LED_ON | 打开LED |
| LED_OFF | 关闭LED |
| LED_BLINK | LED闪烁 |
| SERVO_ROTATE | 舵机旋转 |
| FAN_SPEED | 修改风扇速度 |
| FAN_ON | 打开风扇 |
| FAN_OFF | 关闭风扇 |
| RGB_ON | 打开彩灯 |
| RGB_OFF | 关闭彩灯 |
| RGB_BRIGHTNESS | 设置彩灯亮度 |
| RGB_GRADIENT | 设置彩灯渐变色差 |
| ARM_GRAB | 机械臂抓取 |
| ARM_RELEASE | 机械臂松开 |
| ARM_DOWN | 机械臂回归初始位置 |
| RELAY_ON | 打开继电器 |
| RELAY_OFF | 关闭继电器 |

## 📝 代码生成示例

### Arduino UNO（硬件串口）

```cpp
String receivedCommand = "";
int cmdCount = 0;
unsigned long lastCmdTime = 0;

void setup() {
  Serial.begin(9600);  // UART0 (RX:D0, TX:D1)
}

void loop() {
  // 从硬件串口获取命令
  if (Serial.available()) {
    String cmd = "";
    unsigned long startTime = millis();
    while (millis() - startTime < 100) {
      if (Serial.available()) {
        char c = Serial.read();
        if (c == 10 || c == 13) {
          break;
        }
        cmd += c;
        delay(2);
      }
    }
    // 清空缓冲区
    delay(10);
    while (Serial.available()) {
      char c = Serial.peek();
      if (c == 10 || c == 13) {
        Serial.read();
      } else {
        break;
      }
    }
    if (cmd.length() > 0) {
      receivedCommand = cmd;
    }
  }

  // 检测命令
  if ((receivedCommand.indexOf("MOVE F") >= 0)) {
    // 处理命令
  }
  
  receivedCommand = "";
}
```

### Mega2560（硬件串口2）

```cpp
String receivedCommand = "";

void setup() {
  Serial2.begin(9600);  // UART2 (RX:D17, TX:D16)
  Serial.begin(9600);   // 调试输出
}

void loop() {
  // 从Serial2获取命令
  if (Serial2.available()) {
    String cmd = "";
    unsigned long startTime = millis();
    while (millis() - startTime < 100) {
      if (Serial2.available()) {
        char c = Serial2.read();
        if (c == 10 || c == 13) {
          break;
        }
        cmd += c;
        delay(2);
      }
    }
    // 清空缓冲区
    delay(10);
    while (Serial2.available()) {
      char c = Serial2.peek();
      if (c == 10 || c == 13) {
        Serial2.read();
      } else {
        break;
      }
    }
    if (cmd.length() > 0) {
      receivedCommand = cmd;
    }
  }

  // 检测命令
  if ((receivedCommand.indexOf("computer") >= 0)) {
    Serial.println("computer");
  }
  
  receivedCommand = "";
}
```

## 🐛 常见问题

### Q: 为什么收不到数据？

**A:** 检查以下几点：

1. **硬件连接**
   - 确认 TX 连接到 RX，RX 连接到 TX
   - 确认 GND 共地
   - 使用万用表测试连接

2. **波特率**
   - 所有平台统一使用 9600 波特率
   - 确认 AI-Assistant 端也是 9600

3. **串口选择**
   - Arduino UNO：优先使用硬件串口
   - Mega2560：推荐使用 Serial2 (D16/D17)
   - ESP32：推荐使用 UART1 (GPIO17/18)

4. **USB 干扰**
   - ESP32 的 UART0 通常被 USB 占用
   - 使用其他 UART 端口

### Q: 命令被处理多次？

**A:** 使用"清空已接收的命令"块在处理完所有命令后清空：

```
如果 接收到 小车前进 命令
  则执行
    输出 "前进"

清空已接收的命令
```

### Q: 软串口不稳定？

**A:** 软串口在高波特率下容易出现问题。建议：

1. 使用硬件串口（如果可用）
2. 降低波特率到 9600
3. 减少其他中断

## 📦 版本历史

### v0.0.6
- ✅ 修正 ESP32-S3 UART 引脚显示
- ✅ 统一所有平台波特率为 9600
- ✅ 完善块定义和代码生成

### v0.0.5
- ✅ 修正 ESP32-S3 UART 引脚分配

### v0.0.4
- ✅ 统一 ESP32 硬件串口波特率

### v0.0.3
- ✅ 添加自定义命令块
- ✅ 添加清空命令块

## 📄 许可证

MIT License

## 🤝 支持

如有问题，请检查：
1. 硬件连接是否正确
2. 波特率是否匹配
3. 串口选择是否正确
4. 命令格式是否正确

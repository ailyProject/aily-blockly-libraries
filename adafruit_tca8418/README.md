# TCA8418键盘矩阵扩展库

## 简介

TCA8418 I2C键盘矩阵和GPIO扩展器驱动库，用于Aily Project图形化编程平台。该库基于Adafruit TCA8418库开发，支持键盘矩阵扫描、GPIO控制和中断事件处理。

## 功能特性

- 🎹 **键盘矩阵支持** - 支持8x10键盘矩阵扫描（最多80个按键）
- 📌 **GPIO扩展** - 18个可编程GPIO引脚
- 🔄 **中断事件** - 支持按键按下/释放事件和GPIO中断
- 🎯 **防抖动** - 内置硬件按键防抖动功能
- 📊 **FIFO缓冲** - 内置事件FIFO，可缓存多个按键事件
- 🔌 **I2C接口** - 标准I2C通信，地址0x34

## 硬件规格

- **芯片型号**: TCA8418
- **工作电压**: 3.3V / 5V
- **I2C地址**: 0x34 (默认)
- **矩阵规模**: 8行 × 10列
- **GPIO数量**: 18个通用I/O
- **中断引脚**: INT (支持电平中断)

## 引脚定义

### 矩阵行引脚 (ROW0-ROW7)
- ROW0-ROW7: 矩阵键盘行线

### 矩阵列引脚 (COL0-COL9)  
- COL0-COL9: 矩阵键盘列线

### GPIO引脚
- 剩余引脚可作为通用GPIO使用
- 支持输入/输出模式
- 支持上拉/下拉电阻

## 安装方法

1. 将库文件夹复制到Arduino库目录
2. 在Arduino IDE中包含库文件：`#include <Adafruit_TCA8418.h>`
3. 在Aily Project中添加TCA8418扩展模块

### 源码下载
- **GitHub仓库**: https://github.com/adafruit/Adafruit_TCA8418
- **Aily Project适配**: 本地适配版本，兼容Aily图形化编程

## 基本用法

### 初始化
```cpp
#include <Adafruit_TCA8418.h>

Adafruit_TCA8418 keypad;

void setup() {
  Serial.begin(115200);
  
  // 初始化TCA8418
  if (!keypad.begin()) {
    Serial.println("TCA8418初始化失败");
    while (1);
  }
  
  // 配置4x4键盘矩阵
  keypad.matrix(4, 4);
  
  // 启用中断
  keypad.enableInterrupts();
  
  // 启用防抖动
  keypad.enableDebounce();
}
```

### 读取键盘事件
```cpp
void loop() {
  // 检查是否有按键事件
  if (keypad.available()) {
    uint8_t event = keypad.getEvent();
    
    // 解析事件
    uint8_t key = event & 0x7F;  // 按键编码
    uint8_t state = (event & 0x80) ? 1 : 0;  // 0=按下, 1=释放
    
    Serial.printf("按键: %d, 状态: %s\n", key, state ? "释放" : "按下");
  }
  
  delay(10);
}
```

### GPIO控制
```cpp
// 配置GPIO为输出
keypad.pinMode(TCA8418_COL8, OUTPUT);

// 设置GPIO电平
keypad.digitalWrite(TCA8418_COL8, HIGH);

// 读取GPIO输入
uint8_t value = keypad.digitalRead(TCA8418_COL9);
```

## API参考

### 初始化函数
- `begin(address, wire)` - 初始化I2C通信
- `matrix(rows, columns)` - 配置键盘矩阵大小

### 事件处理函数
- `available()` - 获取可用事件数量
- `getEvent()` - 读取一个按键事件
- `flush()` - 清空事件FIFO

### GPIO控制函数
- `pinMode(pin, mode)` - 设置GPIO模式
- `digitalWrite(pin, level)` - 设置GPIO输出电平
- `digitalRead(pin)` - 读取GPIO输入电平
- `pinIRQMode(pin, mode)` - 设置GPIO中断模式

### 配置函数
- `enableInterrupts()` / `disableInterrupts()` - 启用/禁用中断
- `enableDebounce()` / `disableDebounce()` - 启用/禁用防抖动
- `enableMatrixOverflow()` / `disableMatrixOverflow()` - 启用/禁用溢出处理

### 底层函数
- `readRegister(reg)` - 读取寄存器
- `writeRegister(reg, value)` - 写入寄存器

## 图形化积木

### 基础积木块
- 🟦 **初始化TCA8418** - 配置I2C地址和矩阵大小
- 🟩 **读取按键事件** - 获取按键按下/释放状态
- 🟨 **GPIO控制** - 设置GPIO模式和读写电平

### 高级积木块
- 🟪 **中断配置** - 启用/禁用中断和防抖动
- 🟧 **事件处理** - 检查事件数量和清空缓冲区
- 🟦 **寄存器操作** - 底层寄存器读写

## 示例项目

### 1. 4x4键盘扫描器
```cpp
// 4x4矩阵键盘示例
// 按键映射：0-9, A-F, *, #
```

### 2. GPIO控制LED
```cpp
// 使用GPIO控制LED闪烁
// 支持PWM调光和状态检测
```

### 3. 中断驱动输入
```cpp
// 基于中断的高效按键检测
// 支持多按键同时按下
```

## 常见问题

### Q1: TCA8418初始化失败？
**A:** 检查I2C连接和地址设置，确保SDA/SCL引脚正确连接。

### Q2: 按键检测不准确？
**A:** 启用防抖动功能，调整键盘矩阵大小配置。

### Q3: 中断不触发？
**A:** 确保INT引脚正确连接，启用中断功能。

### Q4: GPIO无法正常工作？
**A:** 检查引脚模式设置，某些引脚可能被矩阵功能占用。

## 技术规格

| 参数 | 值 |
|------|-----|
| 工作电压 | 3.3V - 5V |
| I2C频率 | 100kHz / 400kHz |
| 按键矩阵 | 最大8x10 |
| GPIO数量 | 18个 |
| 事件FIFO | 10个事件 |
| 防抖时间 | 可编程 |

## 版本历史

- **v1.0.0** - 初始版本
  - 基础键盘矩阵支持
  - GPIO控制功能
  - 中断事件处理
  - Aily Project积木块

## 许可证

基于BSD许可证，详见license.txt文件。

## 支持与贡献

- **原始库**: [Adafruit TCA8418](https://github.com/adafruit/Adafruit_TCA8418)
- **GitHub仓库**: https://github.com/adafruit/Adafruit_TCA8418
- **适配开发**: Aily Project Team
- **文档更新**: 2024年

如需技术支持或报告问题，请联系Aily Project开发团队。

---

*Aily Project - 让编程更简单*

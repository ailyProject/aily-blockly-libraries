# Seeed SSCMA Blockly库示例

## 示例1: 基础目标检测

此示例演示如何使用SSCMA进行简单的目标检测。

### Blockly块配置:

```
[初始化SSCMA]
  变量名: ai

[重复执行]
  [如果 [ai 执行推理成功?] ]
    [如果 [ai 检测到的目标数量] > 0 ]
      [串口打印 "检测到目标!"]
      [串口打印 连接 "X: " [ai 第0个目标的 X坐标]]
      [串口打印 连接 "Y: " [ai 第0个目标的 Y坐标]]
      [串口打印 连接 "置信度: " [ai 第0个目标的 置信度]]
```

### 生成的Arduino代码:

```cpp
#include <Seeed_Arduino_SSCMA.h>

SSCMA ai;

void setup() {
  Serial.begin(9600);
  ai.begin();
}

void loop() {
  if (!ai.invoke()) {
    if (ai.boxes().size() > 0) {
      Serial.println("检测到目标!");
      Serial.print("X: ");
      Serial.println(ai.boxes()[0].x);
      Serial.print("Y: ");
      Serial.println(ai.boxes()[0].y);
      Serial.print("置信度: ");
      Serial.println(ai.boxes()[0].score);
    }
  }
}
```

## 示例2: I2C通信方式

使用I2C与SSCMA传感器通信。

### Blockly块配置:

```
[初始化SSCMA I2C]
  变量名: ai
  使用I2C: &Wire
  RST引脚: D1
  I2C地址: 98

[重复执行]
  [ai 执行AI推理]
    次数: 1
    是否显示图像: ☐
```

### 生成的Arduino代码:

```cpp
#include <Seeed_Arduino_SSCMA.h>
#include <Wire.h>

SSCMA ai;

void setup() {
  Serial.begin(9600);
  Wire.begin();
  ai.begin(&Wire, D1, 0x62);
}

void loop() {
  ai.invoke(1, false, false);
}
```

## 示例3: 遍历所有检测结果

遍历所有检测到的目标并打印信息。

### Blockly块配置:

```
[初始化SSCMA]
  变量名: ai

[创建变量 i 设为 0]

[重复执行]
  [如果 [ai 执行推理成功?] ]
    [设置 count 为 [ai 检测到的目标数量]]
    [串口打印 连接 "检测到 " count " 个目标"]
    
    [重复 count 次]
      [串口打印 连接 "目标" i ":"]
      [串口打印 连接 "  X=" [ai 第i个目标的 X坐标]]
      [串口打印 连接 "  Y=" [ai 第i个目标的 Y坐标]]
      [串口打印 连接 "  W=" [ai 第i个目标的 宽度]]
      [串口打印 连接 "  H=" [ai 第i个目标的 高度]]
      [设置 i 为 i + 1]
```

## 示例4: 性能监控

监控AI推理的各阶段性能。

### Blockly块配置:

```
[初始化SSCMA]
  变量名: ai

[重复执行]
  [ai 执行AI推理]
    次数: 1
  
  [串口打印 "=== 性能监控 ==="]
  [串口打印 连接 "预处理: " [ai 推理性能 预处理耗时(ms)] "ms"]
  [串口打印 连接 "推理: " [ai 推理性能 推理耗时(ms)] "ms"]
  [串口打印 连接 "后处理: " [ai 推理性能 后处理耗时(ms)] "ms"]
  
  [延时 1000 毫秒]
```

## 示例5: 关键点检测

检测并显示关键点信息(如人体姿态检测)。

### Blockly块配置:

```
[初始化SSCMA]
  变量名: ai

[重复执行]
  [如果 [ai 执行推理成功?] ]
    [如果 [ai 检测到的关键点组数量] > 0 ]
      [设置 group 为 0]
      [串口打印 "检测到关键点组!"]
      [串口打印 连接 "边界框 X=" [ai 第group个关键点组的边界框 X坐标]]
      [串口打印 连接 "边界框 Y=" [ai 第group个关键点组的边界框 Y坐标]]
      
      [设置 points 为 [ai 第group个关键点组的点数量]]
      [串口打印 连接 "包含 " points " 个关键点"]
      
      [对于 i 从 0 到 points-1]
        [串口打印 连接 "  点" i ": X=" [ai 第group个关键点组 第i个点的 X坐标]]
```

## 示例6: 图像分类

使用SSCMA进行图像分类。

### Blockly块配置:

```
[初始化SSCMA]
  变量名: ai

[重复执行]
  [如果 [ai 执行推理成功?] ]
    [如果 [ai 分类结果数量] > 0 ]
      [设置 target 为 [ai 第0个分类的 类别ID]]
      [设置 score 为 [ai 第0个分类的 置信度]]
      [串口打印 连接 "分类: " target " (置信度: " score ")"]
```

## 硬件连接说明

### UART连接(默认):
- TX → RX
- RX → TX
- GND → GND
- 5V → VCC

### I2C连接:
- SDA → SDA
- SCL → SCL
- GND → GND
- 5V → VCC
- RST → 可选复位引脚

### SPI连接:
- MOSI → MOSI
- MISO → MISO
- SCK → SCK
- CS → 片选引脚
- GND → GND
- 5V → VCC

## 常见问题

### Q: 推理一直返回失败?
A: 检查硬件连接,确认传感器已正确初始化,波特率设置正确。

### Q: 检测不到目标?
A: 确认已加载正确的AI模型,摄像头工作正常,光线充足。

### Q: 内存不足?
A: 不要开启图像获取功能,使用较小的缓冲区,或升级到内存更大的板卡。

### Q: 如何获取类别名称?
A: 使用`获取模型信息`块获取模型信息,解析JSON获取类别列表。

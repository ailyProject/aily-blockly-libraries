# 点灯物联网 (Blinker IoT) 库

基于Blinker Arduino库的可视化编程模块，支持手机APP控制、智能音箱控制，使用蓝牙BLE、MQTT等通信方式。

## 库信息
- **库名**: @aily-project/lib-blinker
- **版本**: 1.0.0
- **作者**: Diandeng Tech
- **描述**: Blinker物联网控制库，支持手机APP控制、智能音箱控制
- **兼容**: ESP32、Arduino UNO R4 WiFi
- **电压**: 3.3V、5V
- **测试者**: i3water
- **示例**: @aily-project/example-blinker-iot
- **官方库**: https://github.com/blinker-iot/blinker-library/tree/dev_edu

## 可用模块

### 初始化模式
- **WiFi模式** (`blinker_init_wifi`): 初始化WiFi连接，支持手动配网和EspTouch V2自动配网
- **BLE模式** (`blinker_init_ble`): 初始化蓝牙BLE连接
- **调试初始化** (`blinker_debug_init`): 配置调试输出参数

### 自定义组件
- **按键组件** (`blinker_button`): 创建按键组件，设置按下回调
- **按键状态** (`blinker_button_state`): 获取按键动作状态（tap/on/off/press/pressup）
- **滑块组件** (`blinker_slider`): 创建滑块组件，设置滑动回调
- **滑块值** (`blinker_slider_value`): 获取当前滑块数值
- **调色板组件** (`blinker_colorpicker`): 创建调色板组件，设置颜色回调
- **颜色值** (`blinker_colorpicker_value`): 获取颜色分量值（R/G/B/亮度）
- **摇杆组件** (`blinker_joystick`): 创建摇杆组件，设置摇杆回调
- **摇杆坐标** (`blinker_joystick_value`): 获取摇杆坐标值（X/Y）
- **图表组件** (`blinker_chart`): 创建图表组件，设置数据上传回调
- **数据上传** (`blinker_data_upload`): 向图表上传数据

### 系统回调
- **心跳包** (`blinker_heartbeat`): 设置心跳包回调
- **数据处理** (`blinker_data_handler`): 设置数据处理回调

### 数据反馈
- **组件反馈** (`blinker_widget_print`): 向指定组件发送反馈数据，支持链式调用
- **图标对象** (`blinker_icon`): 创建图标对象用于反馈
- **颜色对象** (`blinker_color`): 创建颜色对象用于反馈
- **文本对象** (`blinker_text`): 创建文本对象用于反馈
- **状态对象** (`blinker_state`): 创建状态对象用于反馈
- **数值对象** (`blinker_value`): 创建数值对象用于反馈

### 通信控制
- **发送数据** (`blinker_print`): 发送数据到Blinker，支持键值对和纯文本模式
- **手机震动** (`blinker_vibrate`): 触发手机震动
- **设备重置** (`blinker_reset`): 重置Blinker设备
- **延时函数** (`blinker_delay`): Blinker专用延时函数，不阻塞通信

### 调试功能
- **日志输出** (`blinker_log`): 输出调试日志
- **格式化日志** (`blinker_log_args`): 输出带参数的格式化日志

## 使用说明

### 基本流程
```cpp
#define BLINKER_WIDGET
#define BLINKER_WIFI
#include <Blinker.h>

void setup() {
  // 1. 初始化Blinker
  Blinker.begin(auth, ssid, password);

  // 2. 注册组件回调
  BlinkerButton1.attach(button1_callback);
  BlinkerSlider1.attach(slider1_callback);
}

void loop() {
  // 3. 保持连接（自动添加）
  Blinker.run();
}
```

### 组件反馈示例
```cpp
// 链式调用反馈
Button1.icon("fas fa-lightbulb")
       .color("#FFFF00")
       .text("开灯")
       .print();

// 图表数据上传
BlinkerChart1.dataUpload("temp", temperature);
```

### 智能音箱支持
- 支持小爱同学、天猫精灵、小度音箱
- 通过语音控制设备状态
- 自动识别语音指令并执行相应操作

## 注意事项
- 初始化后自动在主循环中添加 `Blinker.run()` 保持连接
- 组件键名建议使用有意义的名称，便于APP识别
- 使用 `blinker_delay()` 替代 `delay()` 避免阻塞通信
- ESP32支持单参数初始化（仅auth），其他开发板需要完整参数
- 合理使用日志功能进行程序调试

## 技术特性
- **多平台支持**: ESP32、Arduino UNO R4 WiFi
- **多通信方式**: WiFi、蓝牙BLE、MQTT
- **智能音箱集成**: 支持主流智能音箱语音控制
- **链式调用**: 组件反馈支持链式调用语法
- **自动管理**: 自动添加必要的宏定义和库引用

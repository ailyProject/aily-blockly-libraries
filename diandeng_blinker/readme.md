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

## Blockly 工具箱分类

### 初始化
- `blinker_init_wifi` - 初始化Blinker WiFi模式
- `blinker_init_ble` - 初始化Blinker BLE模式

### 自定义组件
- `blinker_button` - 按键组件
- `blinker_button_state` - 按键状态检测
- `blinker_slider` - 滑块组件
- `blinker_slider_value` - 滑块值获取
- `blinker_colorpicker` - 调色组件
- `blinker_colorpicker_value` - 颜色值获取
- `blinker_joystick` - 摇杆组件
- `blinker_joystick_value` - 摇杆坐标获取
- `blinker_chart` - 图表组件
- `blinker_data_upload` - 数据上传
- `blinker_heartbeat` - 心跳包处理
- `blinker_data_handler` - 数据处理

### 数据反馈
- `blinker_widget_print` - 组件反馈
- `blinker_icon` - 图标对象
- `blinker_color` - 颜色对象
- `blinker_text` - 文本对象
- `blinker_state` - 状态对象
- `blinker_value` - 数值对象
- `blinker_vibrate` - 手机震动

### 调试功能
- `blinker_debug_init` - 调试初始化
- `blinker_log` - 日志输出
- `blinker_log_args` - 格式化日志

### 高级功能
- `blinker_print` - 发送数据
- `blinker_reset` - 设备重置
- `blinker_delay` - 延时函数

## 详细块定义

### 初始化块

#### blinker_init_wifi
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 初始化Blinker WiFi模式
**字段**:
- `MODE`: 下拉选择 ["手动配网", "EspTouchV2"]
**动态输入** (仅手动配网模式):
- `AUTH`: 字符串输入 - 设备密钥
- `SSID`: 字符串输入 - WiFi名称
- `PSWD`: 字符串输入 - WiFi密码
**生成代码**:
- 手动配网: `Blinker.begin(auth, ssid, pswd);`
- EspTouchV2: `Blinker.begin();`
**自动添加**:
- 宏定义: `#define BLINKER_WIDGET`, `#define BLINKER_WIFI`
- 库引用: `#include <Blinker.h>`
- 主循环: `Blinker.run();`

#### blinker_init_ble
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 初始化Blinker BLE模式
**生成代码**: `Blinker.begin();`
**自动添加**:
- 宏定义: `#define BLINKER_WIDGET`, `#define BLINKER_BLE`
- 库引用: `#include <Blinker.h>`
- 主循环: `Blinker.run();`

#### blinker_debug_init
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 初始化Blinker调试
**字段**:
- `SERIAL`: 下拉选择 - 串口 (来自 ${board.serialPort})
- `SPEED`: 下拉选择 - 速率 (来自 ${board.serialSpeed})
- `DEBUG_ALL`: 下拉选择 ["开启"/"关闭"] -> ["true"/"false"]
**生成代码**:
```cpp
BLINKER_DEBUG.stream(Serial);
BLINKER_DEBUG.debugAll(); // 仅当开启时
```

### 组件块

#### blinker_button
**类型**: Hat块 (无连接属性)
**描述**: 按键组件，设置按下回调
**字段**:
- `KEY`: 文本输入 - 按键名称 (默认: "btn-")
**语句输入**:
- `NAME`: 按下时执行的代码
**生成代码**:
```cpp
BlinkerButton Blinker_btn_("btn-");
void button_btn__callback(const String & state) {
  // 用户代码
}
// setup中: Blinker_btn_.attach(button_btn__callback);
```

#### blinker_button_state
**类型**: 值块 (output: Boolean)
**描述**: 检测当前按键动作状态
**字段**:
- `STATE`: 下拉选择 ["tap", "on", "off", "press", "pressup"]
**生成代码**: `state == "tap"`

#### blinker_slider
**类型**: Hat块 (无连接属性)
**描述**: 滑块组件，设置滑动回调
**字段**:
- `KEY`: 文本输入 - 滑块名称 (默认: "ran-")
**语句输入**:
- `NAME`: 滑动时执行的代码
**生成代码**:
```cpp
BlinkerSlider Blinker_ran_("ran-");
void slider_ran__callback(int32_t value) {
  // 用户代码
}
// setup中: Blinker_ran_.attach(slider_ran__callback);
```

#### blinker_slider_value
**类型**: 值块 (output: Number)
**描述**: 获取当前滑块数值
**生成代码**: `value`

#### blinker_colorpicker
**类型**: Hat块 (无连接属性)
**描述**: 调色组件，设置颜色回调
**字段**:
- `KEY`: 文本输入 - 调色器名称 (默认: "col-")
**语句输入**:
- `NAME`: 颜色改变时执行的代码
**生成代码**:
```cpp
BlinkerRGB Blinker_col_("col-");
void rgb_col__callback(uint8_t r_value, uint8_t g_value, uint8_t b_value, uint8_t bright_value) {
  // 用户代码
}
// setup中: Blinker_col_.attach(rgb_col__callback);
```

#### blinker_colorpicker_value
**类型**: 值块 (output: Number)
**描述**: 获取当前设定的颜色分量
**字段**:
- `KEY`: 下拉选择 ["R", "G", "B", "亮度"] -> ["r_value", "g_value", "b_value", "bright_value"]
**生成代码**: `r_value` (根据选择)

#### blinker_joystick
**类型**: Hat块 (无连接属性)
**描述**: 摇杆组件，设置摇杆回调
**字段**:
- `KEY`: 文本输入 - 摇杆名称 (默认: "joy-")
**语句输入**:
- `NAME`: 摇杆改变时执行的代码
**生成代码**:
```cpp
BlinkerJoystick Blinker_joy_("joy-");
void joystick_joy__callback(uint8_t xAxis, uint8_t yAxis) {
  // 用户代码
}
// setup中: Blinker_joy_.attach(joystick_joy__callback);
```

#### blinker_joystick_value
**类型**: 值块 (output: Number)
**描述**: 获取当前摇杆坐标
**字段**:
- `KEY`: 下拉选择 ["X", "Y"] -> ["xAxis", "yAxis"]
**生成代码**: `xAxis` (根据选择)

#### blinker_chart
**类型**: Hat块 (无连接属性)
**描述**: 图表组件，设置数据上传回调
**字段**:
- `KEY`: 文本输入 - 图表名称 (默认: "chart-")
**语句输入**:
- `NAME`: 上传数据时执行的代码
**生成代码**:
```cpp
BlinkerChart Blinker_chart_("chart-");
void chart_chart__callback() {
  // 用户代码
}
// setup中: Blinker_chart_.attach(chart_chart__callback);
```

#### blinker_data_upload
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 向图表上传数据
**字段**:
- `CHART`: 文本输入 - 图表名称 (默认: "chart-")
- `KEY`: 文本输入 - 数据键名 (默认: "data-")
**值输入**:
- `VALUE`: 数字输入 - 上传的数值
**生成代码**: `Blinker_chart_.upload(data-, 100);`

### 系统回调块

#### blinker_heartbeat
**类型**: Hat块 (无连接属性)
**描述**: 收到心跳包时执行
**语句输入**:
- `NAME`: 心跳包回调代码
**生成代码**:
```cpp
void heartbeat_callback() {
  // 用户代码
}
// setup中: Blinker.attachHeartbeat(heartbeat_callback);
```

#### blinker_data_handler
**类型**: Hat块 (无连接属性)
**描述**: 数据处理回调
**语句输入**:
- `NAME`: 数据处理代码
**生成代码**:
```cpp
void data_callback(const String & data) {
  // 用户代码
}
// setup中: Blinker.attachData(data_callback);
```

### 数据反馈块

#### blinker_widget_print
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 向指定组件发送反馈数据，支持链式调用
**字段**:
- `WIDGET`: 文本输入 - 组件名称
**动态值输入**:
- `INPUT0`, `INPUT1`, ... - 对象输入 (支持链式调用)
**生成代码**:
```cpp
Blinker_widget_.icon("fas fa-lightbulb")
               .color("#FFFF00")
               .text("开灯")
               .print();
```

#### blinker_icon
**类型**: 值块 (output: Object)
**描述**: 创建图标对象用于反馈
**值输入**:
- `ICON`: 字符串输入 - 图标名称
**生成代码**: `.icon("fas fa-lightbulb")`

#### blinker_color
**类型**: 值块 (output: Object)
**描述**: 创建颜色对象用于反馈
**值输入**:
- `COLOR`: 字符串输入 - 颜色值
**生成代码**: `.color("#FFFF00")`

#### blinker_text
**类型**: 值块 (output: Object)
**描述**: 创建文本对象用于反馈
**值输入**:
- `TEXT`: 字符串输入 - 文本内容
**生成代码**: `.text("开灯")`

#### blinker_state
**类型**: 值块 (output: Object)
**描述**: 创建状态对象用于反馈
**值输入**:
- `STATE`: 字符串输入 - 状态值
**生成代码**: `.state("on")`

#### blinker_value
**类型**: 值块 (output: Object)
**描述**: 创建数值对象用于反馈
**值输入**:
- `VALUE`: 数字输入 - 数值
**生成代码**: `.value(100)`

#### blinker_vibrate
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 触发手机震动
**生成代码**: `Blinker.vibrate();`

### 通信控制块

#### blinker_print
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 发送数据到Blinker
**值输入**:
- `TEXT`: 字符串输入 - 发送内容
**生成代码**: `Blinker.print("Hello");`

#### blinker_reset
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 重置Blinker设备
**生成代码**: `Blinker.reset();`

#### blinker_delay
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: Blinker专用延时函数，不阻塞通信
**值输入**:
- `DELAY`: 数字输入 - 延时毫秒数 (默认: 1000)
**生成代码**: `Blinker.delay(1000);`

### 调试功能块

#### blinker_log
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 输出调试日志
**值输入**:
- `TEXT`: 字符串输入 - 日志内容
**生成代码**: `BLINKER_LOG("Debug message");`

#### blinker_log_args
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 输出带参数的格式化日志
**值输入**:
- `TEXT`: 字符串输入 - 日志格式
- `ARGS`: 字符串输入 - 参数
**生成代码**: `BLINKER_LOG("Value: %d", value);`

## .abi 文件生成规范

### 块连接规则
- **Hat块**: 无连接属性，通过 `inputs` 连接内部语句
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段

### 工具箱默认配置
部分块在工具箱中预设了影子块：
- `blinker_data_upload.VALUE`: 默认数字 100
- `blinker_icon.ICON`: 默认空字符串
- `blinker_color.COLOR`: 默认空字符串
- `blinker_text.TEXT`: 默认空字符串
- `blinker_state.STATE`: 默认空字符串
- `blinker_value.VALUE`: 默认数字 0
- `blinker_log.TEXT`: 默认空字符串
- `blinker_log_args.TEXT/ARGS`: 默认空字符串
- `blinker_delay.DELAY`: 默认数字 1000

### 动态输入处理
- `blinker_init_wifi`: 根据 MODE 字段动态显示 AUTH/SSID/PSWD 输入
- `blinker_widget_print`: 支持动态添加多个对象输入，实现链式调用

### 变量管理
- 组件块自动创建对应的 BlinkerButton/BlinkerSlider 等变量
- 变量名格式: `Blinker_` + 键名(替换 `-` 为 `_`)
- 回调函数名格式: 组件类型 + `_` + 键名 + `_callback`

## 使用示例

### 基本WiFi初始化
```json
{
  "type": "blinker_init_wifi",
  "fields": {"MODE": "手动配网"},
  "inputs": {
    "AUTH": {"shadow": {"type": "text", "fields": {"TEXT": "your-auth-key"}}},
    "SSID": {"shadow": {"type": "text", "fields": {"TEXT": "your-wifi-ssid"}}},
    "PSWD": {"shadow": {"type": "text", "fields": {"TEXT": "your-wifi-password"}}}
  }
}
```

### 按键组件示例
```json
{
  "type": "blinker_button",
  "fields": {"KEY": "btn-led"},
  "inputs": {
    "NAME": {
      "block": {
        "type": "blinker_widget_print",
        "fields": {"WIDGET": "btn-led"},
        "inputs": {
          "INPUT0": {
            "block": {
              "type": "blinker_icon",
              "inputs": {
                "ICON": {"shadow": {"type": "text", "fields": {"TEXT": "fas fa-lightbulb"}}}
              }
            }
          }
        }
      }
    }
  }
}
```

### 链式反馈示例
```json
{
  "type": "blinker_widget_print",
  "fields": {"WIDGET": "btn-led"},
  "inputs": {
    "INPUT0": {
      "block": {
        "type": "blinker_icon",
        "inputs": {"ICON": {"shadow": {"type": "text", "fields": {"TEXT": "fas fa-lightbulb"}}}}
      }
    },
    "INPUT1": {
      "block": {
        "type": "blinker_color",
        "inputs": {"COLOR": {"shadow": {"type": "text", "fields": {"TEXT": "#FFFF00"}}}}
      }
    },
    "INPUT2": {
      "block": {
        "type": "blinker_text",
        "inputs": {"TEXT": {"shadow": {"type": "text", "fields": {"TEXT": "开灯"}}}}
      }
    }
  }
}
```

## 技术特性
- **多平台支持**: ESP32、Arduino UNO R4 WiFi
- **多通信方式**: WiFi、蓝牙BLE、MQTT
- **智能音箱集成**: 支持主流智能音箱语音控制
- **链式调用**: 组件反馈支持链式调用语法
- **自动管理**: 自动添加必要的宏定义和库引用
- **动态扩展**: 支持动态输入和扩展功能

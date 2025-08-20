# OneButton

单按钮事件检测库，支持单击、双击、长按等多种事件，适用于Arduino和ESP32等开发板

## 库信息
- **库名**: @aily-project/lib-onebutton
- **版本**: 1.0.0
- **描述**: 单按钮事件检测库，支持单击、双击、长按等多种事件
- **兼容**: arduino:avr, arduino:megaavr, arduino:samd, esp32:esp32, esp8266:esp8266, renesas_uno:unor4wifi, rp2040:rp2040
- **电压**: 3.3V, 5V
- **测试者**: Aily Assistant
- **官方库**: https://github.com/mathertel/OneButton

## Blockly 工具箱分类

### 初始化
- `onebutton_setup` - 创建并初始化按钮对象

### 事件处理
- `onebutton_attach_click` - 单击事件处理
- `onebutton_attach_double_click` - 双击事件处理
- `onebutton_attach_multi_click` - 多次点击事件处理
- `onebutton_attach_press` - 按下事件处理
- `onebutton_attach_long_press_start` - 长按开始事件处理
- `onebutton_attach_during_long_press` - 长按期间事件处理
- `onebutton_attach_long_press_stop` - 长按结束事件处理

### 参数设置
- `onebutton_set_debounce_ms` - 设置防抖时间
- `onebutton_set_click_ms` - 设置单击判定时间
- `onebutton_set_press_ms` - 设置长按判定时间
- `onebutton_set_long_press_interval_ms` - 设置长按期间回调间隔

### 状态查询
- `onebutton_is_long_pressed` - 检查是否正在长按
- `onebutton_get_pressed_ms` - 获取按下时长
- `onebutton_get_number_clicks` - 获取点击次数

### 控制
- `onebutton_reset` - 重置按钮状态

## 详细块定义

### 初始化块

#### onebutton_setup
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 创建并初始化一个按钮对象，设置引脚、模式和激活电平
**字段**:
- `VAR`: 文本输入 - 按钮变量名 (button)
- `PIN`: 下拉选择 - 数字引脚 (来自 ${board.digitalPins})
- `PIN_MODE`: 下拉选择 - 引脚模式 ["普通输入", "上拉输入"]
- `ACTIVE_LOW`: 下拉选择 - 低电平有效 (TRUE)
**生成代码**:
```cpp
OneButton button;
button.setup(2, INPUT_PULLUP, true);
```
**自动添加**:
- 库引用: `#include <OneButton.h>`
- 变量定义: `OneButton button;`
- 主循环: `button.tick();`

### 事件处理块

#### onebutton_attach_click
**类型**: Hat块
**描述**: 当按钮被单击时执行内部代码
**字段**:
- `VAR`: 变量选择 - 按钮变量 (button)
**语句输入**:
- `HANDLER`: 要执行的代码块
**生成代码**:
```cpp
void onebutton_click_button() {
  // 用户代码
}
button.attachClick(onebutton_click_button);
```

#### onebutton_attach_double_click
**类型**: Hat块
**描述**: 当按钮被双击时执行内部代码
**字段**:
- `VAR`: 变量选择 - 按钮变量 (button)
**语句输入**:
- `HANDLER`: 要执行的代码块
**生成代码**:
```cpp
void onebutton_double_click_button() {
  // 用户代码
}
button.attachDoubleClick(onebutton_double_click_button);
```

#### onebutton_attach_multi_click
**类型**: Hat块
**描述**: 当按钮被多次点击时执行内部代码
**字段**:
- `VAR`: 变量选择 - 按钮变量 (button)
**语句输入**:
- `HANDLER`: 要执行的代码块
**生成代码**:
```cpp
void onebutton_multi_click_button() {
  // 用户代码
}
button.attachMultiClick(onebutton_multi_click_button);
```

#### onebutton_attach_press
**类型**: Hat块
**描述**: 当按钮被按下时执行内部代码
**字段**:
- `VAR`: 变量选择 - 按钮变量 (button)
**语句输入**:
- `HANDLER`: 要执行的代码块
**生成代码**:
```cpp
void onebutton_press_button() {
  // 用户代码
}
button.attachPress(onebutton_press_button);
```

#### onebutton_attach_long_press_start
**类型**: Hat块
**描述**: 当按钮开始长按时执行内部代码
**字段**:
- `VAR`: 变量选择 - 按钮变量 (button)
**语句输入**:
- `HANDLER`: 要执行的代码块
**生成代码**:
```cpp
void onebutton_long_press_start_button() {
  // 用户代码
}
button.attachLongPressStart(onebutton_long_press_start_button);
```

#### onebutton_attach_during_long_press
**类型**: Hat块
**描述**: 当按钮长按期间执行内部代码
**字段**:
- `VAR`: 变量选择 - 按钮变量 (button)
**语句输入**:
- `HANDLER`: 要执行的代码块
**生成代码**:
```cpp
void onebutton_during_long_press_button() {
  // 用户代码
}
button.attachDuringLongPress(onebutton_during_long_press_button);
```

#### onebutton_attach_long_press_stop
**类型**: Hat块
**描述**: 当按钮长按结束时执行内部代码
**字段**:
- `VAR`: 变量选择 - 按钮变量 (button)
**语句输入**:
- `HANDLER`: 要执行的代码块
**生成代码**:
```cpp
void onebutton_long_press_stop_button() {
  // 用户代码
}
button.attachLongPressStop(onebutton_long_press_stop_button);
```

### 参数设置块

#### onebutton_set_debounce_ms
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 设置按钮防抖时间（毫秒）
**字段**:
- `VAR`: 变量选择 - 按钮变量 (button)
**值输入**:
- `MS`: 数字输入 - 防抖时间（毫秒）
**生成代码**:
```cpp
button.setDebounceMs(50);
```

#### onebutton_set_click_ms
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 设置单击判定时间（毫秒）
**字段**:
- `VAR`: 变量选择 - 按钮变量 (button)
**值输入**:
- `MS`: 数字输入 - 单击判定时间（毫秒）
**生成代码**:
```cpp
button.setClickMs(400);
```

#### onebutton_set_press_ms
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 设置长按判定时间（毫秒）
**字段**:
- `VAR`: 变量选择 - 按钮变量 (button)
**值输入**:
- `MS`: 数字输入 - 长按判定时间（毫秒）
**生成代码**:
```cpp
button.setPressMs(800);
```

#### onebutton_set_long_press_interval_ms
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 设置长按期间回调间隔时间（毫秒）
**字段**:
- `VAR`: 变量选择 - 按钮变量 (button)
**值输入**:
- `MS`: 数字输入 - 长按间隔时间（毫秒）
**生成代码**:
```cpp
button.setLongPressIntervalMs(1000);
```

### 状态查询块

#### onebutton_is_long_pressed
**类型**: 值块 (output: Boolean)
**描述**: 检查按钮是否正在长按状态
**字段**:
- `VAR`: 变量选择 - 按钮变量 (button)
**生成代码**:
```cpp
button.isLongPressed()
```

#### onebutton_get_pressed_ms
**类型**: 值块 (output: Number)
**描述**: 获取按钮按下的持续时间（毫秒）
**字段**:
- `VAR`: 变量选择 - 按钮变量 (button)
**生成代码**:
```cpp
button.getPressedMs()
```

#### onebutton_get_number_clicks
**类型**: 值块 (output: Number)
**描述**: 获取按钮的点击次数
**字段**:
- `VAR`: 变量选择 - 按钮变量 (button)
**生成代码**:
```cpp
button.getNumberClicks()
```

### 控制块

#### onebutton_reset
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 重置按钮的状态机
**字段**:
- `VAR`: 变量选择 - 按钮变量 (button)
**生成代码**:
```cpp
button.reset();
```

## .abi 文件生成规范

### 块连接规则
- **Hat块**: 无连接属性，通过 `inputs` 连接内部语句
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段

### 工具箱默认配置
部分块预设了影子块：
- `onebutton_set_debounce_ms.MS`: 默认类型 50
- `onebutton_set_click_ms.MS`: 默认类型 400
- `onebutton_set_press_ms.MS`: 默认类型 800
- `onebutton_set_long_press_interval_ms.MS`: 默认类型 1000

### 变量管理
- 使用 `field_input` 创建新变量时，自动注册到Blockly系统
- 使用 `field_variable` 选择已存在的变量，支持变量重命名
- 变量类型为 `OneButton`，确保类型安全

### 智能板卡适配
库支持所有主流Arduino开发板，包括：
- Arduino AVR系列 (UNO, Nano等)
- Arduino SAMD系列 (Zero, MKR等)
- ESP32/ESP8266系列
- Arduino UNO R4 WiFi
- Raspberry Pi Pico

## 使用示例

### 基本按钮控制
```json
{
  "type": "onebutton_setup",
  "fields": {
    "VAR": "myButton",
    "PIN": "2",
    "PIN_MODE": "INPUT_PULLUP",
    "ACTIVE_LOW": "TRUE"
  },
  "next": {
    "type": "onebutton_attach_click",
    "fields": {"VAR": "myButton"},
    "inputs": {
      "HANDLER": {
        "type": "controls_if",
        "inputs": {
          "IF0": {
            "type": "logic_boolean",
            "fields": {"BOOL": "TRUE"}
          },
          "DO0": {
            "type": "text_print",
            "inputs": {
              "TEXT": {
                "shadow": {
                  "type": "text",
                  "fields": {"TEXT": "Button clicked!"}
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### 长按控制LED
```json
{
  "type": "onebutton_setup",
  "fields": {
    "VAR": "ledButton",
    "PIN": "3",
    "PIN_MODE": "INPUT_PULLUP",
    "ACTIVE_LOW": "TRUE"
  },
  "next": {
    "type": "onebutton_attach_long_press_start",
    "fields": {"VAR": "ledButton"},
    "inputs": {
      "HANDLER": {
        "type": "digital_write",
        "fields": {"PIN": "13", "STATE": "HIGH"}
      }
    }
  }
}
```

## 技术特性
- **事件驱动**: 支持多种按钮事件类型
- **防抖处理**: 内置硬件防抖机制
- **状态机**: 使用有限状态机管理按钮状态
- **自动轮询**: 自动在主循环中调用tick()函数
- **变量管理**: 智能变量创建和重命名支持

## 注意事项
- 必须在setup()中初始化按钮对象
- 每个按钮对象都需要在loop()中调用tick()函数（自动添加）
- 防抖时间、单击时间、长按时间等参数可根据实际需求调整
- 支持多个按钮实例，每个按钮需要独立的变量名
- 长按期间回调间隔设置为0时，将以最快速度触发
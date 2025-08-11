# OneButton按键库

基于OneButton库的按键控制模块，支持单击、双击、长按等多种按键操作，提供丰富的按键事件处理功能。

## 库信息
- **库名**: @aily-project/lib-onebutton
- **版本**: 0.0.1
- **作者**: aily Project
- **描述**: OneButton按键支持库, 支持单击、双击、长按等多种按键操作
- **兼容**: 通用（所有Arduino兼容板）
- **电压**: 3.3V、5V
- **官方库**: https://github.com/mathertel/OneButton

## Blockly 工具箱分类

### 按键控制
- `onebutton_setup` - 初始化按钮
- `onebutton_attachClick` - 设置单击事件
- `onebutton_attachDoubleClick` - 设置双击事件
- `onebutton_attachLongPressStart` - 设置长按开始事件
- `onebutton_attachLongPressStop` - 设置长按停止事件
- `onebutton_attachDuringLongPress` - 设置长按持续事件

## 详细块定义

### 按键控制块

#### onebutton_setup
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 初始化按钮，配置引脚和工作模式
**字段**:
- `VAR`: 文本输入 - 按钮变量名 (默认: "button1")
- `PIN`: 下拉选择 - 数字引脚 (来自 ${board.digitalPins})
- `PIN_MODE`: 下拉选择 - 引脚模式 ["普通输入", "上拉输入"]
- `ACTIVE_LOW`: 复选框 - 低电平有效 (默认: true)
**生成代码**:
```cpp
OneButton button1;
button1.setup(pin, INPUT_PULLUP, true);
```
**自动添加**:
- 库引用: `#include <OneButton.h>`
- 变量定义: `OneButton button1;`
- 主循环: `button1.tick();`

#### onebutton_attachClick
**类型**: Hat块 (无连接属性)
**描述**: 设置按钮单击事件回调
**字段**:
- `VAR`: 变量选择 - 按钮变量 (默认: "button1")
**语句输入**:
- `CLICK_FUNC`: 单击时执行的代码
**生成代码**:
```cpp
void click_callback_button1() {
  // 用户代码
}
// setup中: button1.attachClick(click_callback_button1);
```

#### onebutton_attachDoubleClick
**类型**: Hat块 (无连接属性)
**描述**: 设置按钮双击事件回调
**字段**:
- `VAR`: 变量选择 - 按钮变量 (默认: "button1")
**语句输入**:
- `DOUBLE_CLICK_FUNC`: 双击时执行的代码
**生成代码**:
```cpp
void double_click_callback_button1() {
  // 用户代码
}
// setup中: button1.attachDoubleClick(double_click_callback_button1);
```

#### onebutton_attachLongPressStart
**类型**: Hat块 (无连接属性)
**描述**: 设置按钮长按开始事件回调
**字段**:
- `VAR`: 变量选择 - 按钮变量 (默认: "button1")
**语句输入**:
- `LONG_PRESS_START_FUNC`: 长按开始时执行的代码
**生成代码**:
```cpp
void long_press_start_callback_button1() {
  // 用户代码
}
// setup中: button1.attachLongPressStart(long_press_start_callback_button1);
```

#### onebutton_attachLongPressStop
**类型**: Hat块 (无连接属性)
**描述**: 设置按钮长按停止事件回调
**字段**:
- `VAR`: 变量选择 - 按钮变量 (默认: "button1")
**语句输入**:
- `LONG_PRESS_STOP_FUNC`: 长按停止时执行的代码
**生成代码**:
```cpp
void long_press_stop_callback_button1() {
  // 用户代码
}
// setup中: button1.attachLongPressStop(long_press_stop_callback_button1);
```

#### onebutton_attachDuringLongPress
**类型**: Hat块 (无连接属性)
**描述**: 设置按钮长按持续事件回调
**字段**:
- `VAR`: 变量选择 - 按钮变量 (默认: "button1")
**语句输入**:
- `DURING_LONG_PRESS_FUNC`: 长按持续时执行的代码
**生成代码**:
```cpp
void during_long_press_callback_button1() {
  // 用户代码
}
// setup中: button1.attachDuringLongPress(during_long_press_callback_button1);
```

## .abi 文件生成规范

### 块连接规则
- **Hat块**: 无连接属性，通过 `inputs` 连接内部语句
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段

### 工具箱默认配置
所有块均无预设影子块

### 变量管理
- 按钮对象自动创建: `OneButton button1;`
- 回调函数自动生成，命名格式: `[事件类型]_callback_[变量名]`
- 自动注册OneButton类型变量到Blockly

### 智能引脚适配
- 自动从板卡配置获取数字引脚选项: `${board.digitalPins}`
- 支持普通输入和上拉输入模式

## 使用示例

### 基本按钮初始化
```json
{
  "type": "onebutton_setup",
  "fields": {
    "VAR": "button1",
    "PIN": "2",
    "PIN_MODE": "INPUT_PULLUP",
    "ACTIVE_LOW": true
  }
}
```

### 单击事件设置
```json
{
  "type": "onebutton_attachClick",
  "fields": {"VAR": {"id": "button1_var_id"}},
  "inputs": {
    "CLICK_FUNC": {
      "block": {
        "type": "serial_println",
        "fields": {"SERIAL": "Serial"},
        "inputs": {
          "VAR": {"shadow": {"type": "text", "fields": {"TEXT": "Button clicked!"}}}
        }
      }
    }
  }
}
```

### 多事件组合示例
```json
{
  "type": "onebutton_attachClick",
  "fields": {"VAR": {"id": "button1_var_id"}},
  "inputs": {
    "CLICK_FUNC": {
      "block": {
        "type": "digital_write",
        "fields": {"PIN": "13"},
        "inputs": {
          "STATE": {"shadow": {"type": "logic_boolean", "fields": {"BOOL": "TRUE"}}}
        },
        "next": {
          "block": {
            "type": "onebutton_attachDoubleClick",
            "fields": {"VAR": {"id": "button1_var_id"}},
            "inputs": {
              "DOUBLE_CLICK_FUNC": {
                "block": {
                  "type": "digital_write",
                  "fields": {"PIN": "13"},
                  "inputs": {
                    "STATE": {"shadow": {"type": "logic_boolean", "fields": {"BOOL": "FALSE"}}}
                  }
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

## 技术特性
- **多事件支持**: 单击、双击、长按开始/停止/持续等丰富事件
- **防抖处理**: 内置硬件防抖算法，避免误触发
- **低电平/高电平**: 支持低电平有效和高电平有效模式
- **上拉输入**: 支持内部上拉电阻，简化硬件连接
- **自动变量管理**: 智能管理按钮变量和回调函数
- **通用兼容**: 适用于所有Arduino兼容开发板

## 注意事项
- 按钮变量名在同一项目中应保持唯一
- 建议使用上拉输入模式，减少外部电路复杂度
- 长按事件的触发时间可通过OneButton库参数调整
- 所有事件回调都在主循环中通过tick()函数处理
- 支持多个按钮同时使用，每个按钮需要不同的变量名

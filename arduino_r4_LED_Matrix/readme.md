# R4 WiFi LED矩阵库

用于Arduino UNO R4 Wifi LED矩阵，支持显示文本、图案和动画

## 库信息
- **库名**: @aily-project/lib-r4-led-matrix
- **版本**: 0.0.1
- **作者**: aily Project
- **描述**: 用于Arduino UNO R4 Wifi LED矩阵，支持显示文本、图案和动画
- **兼容**: renesas_uno:unor4wifi
- **电压**: 3.3V, 5V
- **测试者**: openjumper

## Blockly 工具箱分类

### LED矩阵
- `led_matrix_init` - 初始化LED矩阵
- `led_matrix_clear` - 清除LED矩阵显示
- `led_matrix_display_text` - LED矩阵显示滚动文本
- `led_matrix_display_frame` - LED矩阵显示图案
- `led_matrix_display_frame_set` - LED矩阵显示自定义图案
- `led_matrix_preset_animation` - LED矩阵显示预设动画
- `led_matrix_display_animation` - LED矩阵显示动画序列
- `led_matrix_custom_pattern` - 自定义图案
- `led_matrix_preset_pattern` - 预设图案

## 详细块定义

### LED矩阵块

#### led_matrix_init
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 初始化LED矩阵显示
**生成代码**:
```cpp
matrix.begin();
```
**自动添加**:
- 库引用: `#include "ArduinoGraphics.h"`, `#include "Arduino_LED_Matrix.h"`
- 变量定义: `ArduinoLEDMatrix matrix;`

#### led_matrix_clear
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 清除LED矩阵当前显示内容
**生成代码**:
```cpp
matrix.clear();
```

#### led_matrix_display_text
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 在LED矩阵上显示滚动文本
**字段**:
- `DIRECTION`: 滚动方向 - 下拉选择 (左滚动/右滚动)
**值输入**:
- `TEXT`: 文本内容 - 字符串输入
- `SPEED`: 滚动速度 - 数字输入
**生成代码**:
```cpp
matrix.beginDraw();
matrix.textFont(Font_5x7);
matrix.beginText(0, 1, 0xFFFFFF);
matrix.println(text);
matrix.textScrollSpeed(speed);
matrix.endText(direction);
```

#### led_matrix_display_frame
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 在LED矩阵上显示预设图案
**值输入**:
- `FRAME`: 图案数据 - 数组输入
**生成代码**:
```cpp
// 对于Arduino R4官方常量
matrix.loadFrame(LEDMATRIX_CONSTANT);
// 对于自定义数组
matrix.loadFrame(custom_array);
```

#### led_matrix_display_frame_set
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 在LED矩阵上显示自定义图案
**字段**:
- `MATRIX`: LED矩阵编辑器 - 12x8矩阵编辑器
**生成代码**:
```cpp
matrix.loadFrame(led_matrix_hash);
```
**自动添加**:
- 变量定义: `const uint32_t led_matrix_hash[] = {data};`

#### led_matrix_preset_animation
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 选择并播放预设的LED矩阵动画
**字段**:
- `PATTERN`: 预设动画选择器 - 包含26种预设动画
**生成代码**:
```cpp
matrix.loadSequence(LEDMATRIX_ANIMATION_CONSTANT);
matrix.play(true);
```

#### led_matrix_display_animation
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 显示LED矩阵动画序列，将多个图案组合成动画
**字段**:
- `DELAY`: 帧延迟 - 文本输入 (默认100ms)
**值输入**:
- `ADD0`, `ADD1`, ... : 动画帧 - 数组输入 (动态扩展)
**生成代码**:
```cpp
// 对于Arduino R4官方图标动画
for (int i = 0; i < frame_count; i++) {
  matrix.loadFrame(animation_array[i]);
  delay(66);
}
// 对于自定义图案动画
matrix.loadSequence(animation_array);
matrix.play(true);
```
**自动添加**:
- 变量定义: 动画序列数组

#### led_matrix_custom_pattern
**类型**: 值块 (output: Array)
**描述**: 创建自定义LED矩阵图案
**字段**:
- `MATRIX`: LED矩阵编辑器 - 12x8矩阵编辑器
**生成代码**:
```cpp
// 在动画中: {data1,data2,data3,delay}
// 单独使用: {data1,data2,data3}
```

#### led_matrix_preset_pattern
**类型**: 值块 (output: Array)
**描述**: 选择预设的LED矩阵图案
**字段**:
- `PATTERN`: 预设图案选择器 - 包含14种预设图案
**生成代码**:
```cpp
// Arduino R4官方常量
LEDMATRIX_CONSTANT
// 或自定义数组格式
{hex_data1, hex_data2, hex_data3}
```

## .abi 文件生成规范

### 块连接规则
- **Hat块**: 无连接属性，通过 `inputs` 连接内部语句
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段

### 工具箱默认配置
部分块预设了影子块：
- `led_matrix_display_text.TEXT`: 默认文本 "Hello!"
- `led_matrix_display_text.SPEED`: 默认数字 100
- `led_matrix_display_frame.FRAME`: 默认连接预设图案块
- `led_matrix_display_animation.ADD0`: 默认连接自定义图案块

### 变量管理
- LED矩阵对象自动创建: `ArduinoLEDMatrix matrix;`
- 自定义图案数组根据内容哈希值命名，避免重复定义
- 动画序列数组支持Arduino R4官方常量和自定义图案混合使用

### 智能板卡适配
- 仅兼容Arduino UNO R4 WiFi开发板
- 自动包含必要的Arduino R4 LED矩阵库文件
- 支持Arduino R4官方预设图标和动画常量

## 使用示例

### 显示滚动文本
```json
{
  "type": "led_matrix_display_text",
  "fields": {"DIRECTION": "SCROLL_LEFT"},
  "inputs": {
    "TEXT": {"shadow": {"type": "text", "fields": {"TEXT": "Hello World!"}}},
    "SPEED": {"shadow": {"type": "math_number", "fields": {"NUM": 150}}}
  }
}
```

### 显示预设图案
```json
{
  "type": "led_matrix_display_frame",
  "inputs": {
    "FRAME": {
      "block": {
        "type": "led_matrix_preset_pattern",
        "fields": {"PATTERN": "基础笑脸"}
      }
    }
  }
}
```

### 播放预设动画
```json
{
  "type": "led_matrix_preset_animation",
  "fields": {"PATTERN": "心跳"}
}
```

### 自定义动画序列
```json
{
  "type": "led_matrix_display_animation",
  "fields": {"DELAY": "200"},
  "inputs": {
    "ADD0": {
      "block": {
        "type": "led_matrix_custom_pattern",
        "fields": {"MATRIX": [[1,0,1,0,1,0,1,0,1,0,1,0],...]}
      }
    },
    "ADD1": {
      "block": {
        "type": "led_matrix_preset_pattern",
        "fields": {"PATTERN": "小心形"}
      }
    }
  }
}
```

## 技术特性
- **Arduino R4官方支持**: 完全兼容Arduino UNO R4 WiFi的LED矩阵功能
- **预设资源丰富**: 包含14种预设图案和26种预设动画
- **自定义图案编辑**: 支持12x8像素的自定义图案设计
- **动画序列**: 支持多帧动画播放，可混合预设和自定义图案
- **智能代码生成**: 根据图案内容自动优化生成的C++代码
- **滚动文本**: 支持左右滚动文本显示，可调节滚动速度

## 注意事项
- 仅适用于Arduino UNO R4 WiFi开发板，其他Arduino板卡不支持
- LED矩阵尺寸固定为12x8像素
- 自定义图案使用uint32_t数组格式，需要正确的位操作
- 动画播放时会阻塞程序执行，建议在主循环中合理安排
- 预设动画使用Arduino官方常量，确保最佳兼容性
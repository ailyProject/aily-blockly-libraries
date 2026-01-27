# ChainableLED 链式RGB LED库

控制基于P9813协议的链式RGB LED，支持Grove链式LED和多种Arduino板卡。

## 库信息
- **库名**: @aily-project/lib-chainableled
- **版本**: 1.0.0
- **兼容**: 通用（支持所有主流Arduino开发板）

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `chainableled_setup` | 语句块 | VAR(field_input), CLK_PIN(input), DATA_PIN(input), NUM_LEDS(input) | `"VAR":"leds"` | `ChainableLED leds(2, 3, 1);` |
| `chainableled_init` | 语句块 | VAR(field_variable) | `"VAR":"leds"` | `leds.init();` |
| `chainableled_set_color_rgb` | 语句块 | VAR(field_variable), LED_INDEX(input), RED(input), GREEN(input), BLUE(input) | `"VAR":"leds"` | `leds.setColorRGB(0, 255, 0, 0);` |
| `chainableled_set_color_hsl` | 语句块 | VAR(field_variable), LED_INDEX(input), HUE(input), SATURATION(input), LIGHTNESS(input) | `"VAR":"leds"` | `leds.setColorHSL(0, 0, 1.0, 0.5);` |
| `chainableled_set_color` | 语句块 | VAR(field_variable), LED_INDEX(input), COLOR(field_colour_hsv_sliders) | `"VAR":"leds","COLOR":"#ff0000"` | `leds.setColorRGB(0, 255, 0, 0);` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "leds"` |
| field_variable | 字符串 | `"VAR": "leds"` |
| input_value | 块连接 | `"inputs": {"RED": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **特殊规则**: 
  - `chainableled_setup`使用field_input创建新变量
  - 其他块使用field_variable引用已创建的变量
  - LED编号从0开始，0表示第一个LED

## 使用示例

### 基础RGB控制
```json
{
  "type": "chainableled_setup",
  "id": "setup_id",
  "fields": {"VAR": "leds"},
  "inputs": {
    "CLK_PIN": {"block": {"type": "math_number", "fields": {"NUM": "2"}}},
    "DATA_PIN": {"block": {"type": "math_number", "fields": {"NUM": "3"}}},
    "NUM_LEDS": {"block": {"type": "math_number", "fields": {"NUM": "2"}}}
  },
  "next": "init_id"
}
```

### 设置LED颜色
```json
{
  "type": "chainableled_set_color_rgb",
  "id": "color_id",
  "fields": {"VAR": "leds"},
  "inputs": {
    "LED_INDEX": {"block": {"type": "math_number", "fields": {"NUM": "0"}}},
    "RED": {"block": {"type": "math_number", "fields": {"NUM": "255"}}},
    "GREEN": {"block": {"type": "math_number", "fields": {"NUM": "0"}}},
    "BLUE": {"block": {"type": "math_number", "fields": {"NUM": "0"}}}
  }
}
```

## 重要规则

1. **必须遵守**: 必须先使用`chainableled_setup`创建LED对象，再调用`chainableled_init`初始化
2. **连接限制**: `chainableled_setup`应该放在setup()的开始部分
3. **颜色范围**: RGB颜色值为0-255，HSL颜色值为0-1
4. **LED编号**: 从0开始，不能超过创建时指定的数量减1
5. **常见错误**: 
   - ❌ 忘记调用`chainableled_init`初始化
   - ❌ LED编号超出范围
   - ❌ 颜色值超出范围

## 支持的颜色模式

- **RGB模式**: 红色(0-255)、绿色(0-255)、蓝色(0-255)
- **HSL模式**: 色相(0-1)、饱和度(0-1)、亮度(0-1)

## 硬件连接

- **CLK引脚**: 时钟信号引脚
- **DATA引脚**: 数据信号引脚
- **LED数量**: 级联的LED数量（1个或多个）

## 兼容性

- Grove链式RGB LED
- 基于P9813芯片的RGB LED
- 支持所有主流Arduino开发板（3.3V/5V）

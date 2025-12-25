# CHSC6X触摸屏

CHSC6X电容式触摸屏控制器驱动库，支持单点触摸检测和坐标读取

## 库信息
- **库名**: @aily-project/lib-chsc6x
- **版本**: 1.0.0
- **兼容**: 通用（支持所有支持I2C的Arduino板卡）

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `chsc6x_setup` | 语句块 | VAR(field_input), PIN(input), WIDTH(input), HEIGHT(input), ROTATION(input) | `"VAR":"touch"` | `touch.begin();` |
| `chsc6x_is_pressed` | 值块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `touch.isPressed()` |
| `chsc6x_get_x` | 值块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `touch.getX()` |
| `chsc6x_get_y` | 值块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `touch.getY()` |
| `chsc6x_get_xy` | 值块 | VAR(field_variable), X(input), Y(input) | `"VAR":{"id":"var_id"}` | `touch.getXY(x, y)` |
| `chsc6x_set_rotation` | 语句块 | VAR(field_variable), ROTATION(input) | `"VAR":{"id":"var_id"}` | `touch.setRotation(rotation);` |
| `chsc6x_get_rotation` | 值块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `touch.getRotation()` |
| `chsc6x_set_screen_size` | 语句块 | VAR(field_variable), WIDTH(input), HEIGHT(input) | `"VAR":{"id":"var_id"}` | `touch.setScreenSize(w, h);` |
| `chsc6x_run` | 值块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `touch.run()` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "touch"` |
| field_variable | 对象 | `"VAR": {"id": "var_id"}` |
| input_value | 块连接 | `"inputs": {"PIN": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **变量引用**: 初始化块使用field_input输入变量名，其他块使用field_variable引用已创建变量
- **自动注册**: 初始化块自动将变量注册到Blockly系统

## 使用示例

### 基础触摸检测
```json
{
  "type": "chsc6x_setup",
  "id": "setup_id",
  "fields": {"VAR": "touch"},
  "inputs": {
    "PIN": {"block": {"type": "math_number", "fields": {"NUM": 7}}},
    "WIDTH": {"block": {"type": "math_number", "fields": {"NUM": 240}}},
    "HEIGHT": {"block": {"type": "math_number", "fields": {"NUM": 240}}},
    "ROTATION": {"block": {"type": "math_number", "fields": {"NUM": 0}}}
  },
  "next": {"block": {
    "type": "controls_if",
    "inputs": {
      "IF0": {"block": {"type": "chsc6x_is_pressed", "fields": {"VAR": {"id": "touch_id"}}}},
      "DO0": {"block": {
        "type": "base_println",
        "inputs": {"TEXT": {"block": {
          "type": "text_join",
          "inputs": {
            "ADD0": {"block": {"type": "text", "fields": {"TEXT": "X: "}}},
            "ADD1": {"block": {"type": "chsc6x_get_x", "fields": {"VAR": {"id": "touch_id"}}}}
          }
        }}}
      }}
    }
  }}
}
```

## 重要规则

1. **必须遵守**: 使用前必须先创建触摸屏对象（chsc6x_setup）
2. **连接限制**: 其他块只能引用已创建的触摸屏变量
3. **变量唯一性**: 每个触摸屏对象必须有唯一的变量名
4. **I2C地址**: 默认I2C地址为0x2E，通常无需修改
5. **中断引脚**: 必须配置正确的中断引脚才能检测触摸

## 支持的旋转角度

| 旋转值 | 说明 |
|--------|------|
| 0 | 正常方向（0度） |
| 1 | 顺时针90度 |
| 2 | 180度 |
| 3 | 顺时针270度 |

## 技术参数

- **通信接口**: I2C
- **默认地址**: 0x2E
- **最大触摸点数**: 1（单点触摸）
- **支持屏幕尺寸**: 可配置任意宽高
- **中断触发**: 低电平触发

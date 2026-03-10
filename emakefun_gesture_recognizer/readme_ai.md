# 手势识别传感器

易创空间手势识别模块Arduino库，支持识别右移、左移、后移、前移、上拉、下压、离开、悬停等手势。

## 库信息
- **名称**: @aily-project/lib-gesture-recognizer
- **版本**: 1.0.0

## 积木块定义

| 积木块类型 | 连接类型 | 参数 (args0顺序) | ABS格式 | 生成代码 |
|------------|----------|------------------|---------|----------|
| `gesture_recognizer_setup` | Statement | VAR(field_input), I2C_ADDRESS(field_input) | `gesture_recognizer_setup("gesture", "0x39")` | `emakefun::GestureRecognizer gesture(Wire, 0x39);` + 初始化检查 |
| `gesture_recognizer_get_gesture` | Value | VAR(field_variable) | `gesture_recognizer_get_gesture(variables_get($gesture))` | `gesture.GetGesture()` |
| `gesture_recognizer_gesture_type` | Value | GESTURE_TYPE(field_dropdown) | `gesture_recognizer_gesture_type(1)` | `1` |

## 参数选项

| 参数 | 值 | 描述 |
|------|-----|------|
| I2C_ADDRESS | 0x39 | 手势识别传感器I2C地址（默认） |
| GESTURE_TYPE | 0 | 无手势 |
| GESTURE_TYPE | 1 | 右移 |
| GESTURE_TYPE | 2 | 左移 |
| GESTURE_TYPE | 3 | 后移 |
| GESTURE_TYPE | 4 | 前移 |
| GESTURE_TYPE | 5 | 上拉 |
| GESTURE_TYPE | 6 | 下压 |
| GESTURE_TYPE | 7 | 离开感应区 |
| GESTURE_TYPE | 8 | 悬停 |

## ABS示例

### 基本使用
arduino_setup()
    gesture_recognizer_setup("gesture", "0x39")
    serial_begin(Serial, 9600)

arduino_loop()
    controls_if()
        @IF0: logic_compare(gesture_recognizer_get_gesture(variables_get($gesture)), NEQ, gesture_recognizer_gesture_type(0))
        @DO0:
            serial_println(Serial, gesture_recognizer_get_gesture(variables_get($gesture)))
    time_delay(math_number(100))

### 手势判断
arduino_setup()
    gesture_recognizer_setup("gesture", "0x39")
    serial_begin(Serial, 9600)

arduino_loop()
    controls_if()
        @IF0: logic_compare(gesture_recognizer_get_gesture(variables_get($gesture)), EQ, gesture_recognizer_gesture_type(1))
        @DO0:
            serial_println(Serial, text("右移"))
    controls_if()
        @IF0: logic_compare(gesture_recognizer_get_gesture(variables_get($gesture)), EQ, gesture_recognizer_gesture_type(2))
        @DO0:
            serial_println(Serial, text("左移"))
    time_delay(math_number(100))

## 注意事项

1. **初始化**: 必须在 `arduino_setup()` 中调用 `gesture_recognizer_setup` 初始化传感器
2. **变量引用**: 使用 `variables_get($varName)` 在值槽中引用变量
3. **I2C通信**: 确保开发板I2C接口正确连接（SDA、SCL）
4. **手势判断**: 返回值为0表示无手势，使用 `gesture_recognizer_gesture_type` 积木块获取手势常量进行比较
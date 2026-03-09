# CodexPad 蓝牙手柄

通过BLE连接CodexPad游戏手柄，读取按键和摇杆输入。

## 库信息
- **库名**: @aily-project/lib-codexpad
- **版本**: 1.0.0
- **兼容**: esp32:esp32

## 块定义

| 块类型 | 连接 | 参数 | ABS格式 | 生成代码 |
|--------|------|------|---------|----------|
| `codexpad_init` | 语句块 | VAR(field_input), MAC(input_value) | `codexpad_init("pad", text("E4:66:E5:A2:24:5D"))` | `CodexPad pad; pad.Init(); pad.Connect(...)` |
| `codexpad_is_connected` | 值块 | VAR(field_variable) | `codexpad_is_connected($pad)` | `pad.is_connected()` |
| `codexpad_set_tx_power` | 语句块 | VAR(field_variable), POWER(dropdown) | `codexpad_set_tx_power($pad, k0dBm)` | `pad.set_tx_power(CodexPad::TxPower::k0dBm)` |
| `codexpad_button_pressed` | 值块 | VAR(field_variable), BUTTON(dropdown) | `codexpad_button_pressed($pad, kCrossA)` | `pad.pressed(CodexPad::Button::kCrossA)` |
| `codexpad_button_released` | 值块 | VAR(field_variable), BUTTON(dropdown) | `codexpad_button_released($pad, kCrossA)` | `pad.released(CodexPad::Button::kCrossA)` |
| `codexpad_button_holding` | 值块 | VAR(field_variable), BUTTON(dropdown) | `codexpad_button_holding($pad, kCrossA)` | `pad.holding(CodexPad::Button::kCrossA)` |
| `codexpad_button_state` | 值块 | VAR(field_variable), BUTTON(dropdown) | `codexpad_button_state($pad, kCrossA)` | `pad.button_state(CodexPad::Button::kCrossA)` |
| `codexpad_axis_value` | 值块 | VAR(field_variable), AXIS(dropdown) | `codexpad_axis_value($pad, kLeftStickX)` | `pad.axis_value(CodexPad::Axis::kLeftStickX)` |
| `codexpad_axis_changed` | 值块 | VAR(field_variable), AXIS(dropdown), THRESHOLD(input_value) | `codexpad_axis_changed($pad, kLeftStickX, math_number(2))` | `pad.HasAxisValueChanged(CodexPad::Axis::kLeftStickX, 2)` |

## 参数选项

| 参数 | 可选值 | 说明 |
|------|--------|------|
| BUTTON | kUp, kDown, kLeft, kRight, kSquareX, kTriangleY, kCrossA, kCircleB, kL1, kL2, kL3, kR1, kR2, kR3, kSelect, kStart, kHome | 按键选择 |
| AXIS | kLeftStickX, kLeftStickY, kRightStickX, kRightStickY | 摇杆轴选择 |
| POWER | kMinus16dBm, kMinus12dBm, kMinus8dBm, kMinus5dBm, kMinus3dBm, kMinus1dBm, k0dBm, k1dBm, k2dBm, k3dBm, k4dBm, k5dBm, k6dBm | 发射功率 |

## ABS 示例

### 基础轮询 - 读取按键和摇杆
```
arduino_setup()
    codexpad_init("pad", text("E4:66:E5:A2:24:5D"))
    codexpad_set_tx_power($pad, k0dBm)
    serial_begin(Serial, 115200)

arduino_loop()
    controls_if()
        @IF0: codexpad_button_pressed($pad, kCrossA)
        @DO0:
            serial_println(Serial, text("A键被按下"))
    serial_println(Serial, codexpad_axis_value($pad, kLeftStickX))
```

### 按键事件检测
```
arduino_setup()
    codexpad_init("pad", text("E4:66:E5:A2:24:5D"))
    serial_begin(Serial, 115200)

arduino_loop()
    controls_if()
        @IF0: codexpad_button_pressed($pad, kUp)
        @DO0:
            serial_println(Serial, text("上键按下"))
    controls_if()
        @IF0: codexpad_button_released($pad, kUp)
        @DO0:
            serial_println(Serial, text("上键释放"))
    controls_if()
        @IF0: codexpad_axis_changed($pad, kLeftStickX, math_number(2))
        @DO0:
            serial_println(Serial, codexpad_axis_value($pad, kLeftStickX))
```

## 注意事项

1. **初始化**: `codexpad_init` 放在 `arduino_setup()` 中，会自动在loop中调用Update()
2. **变量引用**: 初始化后用 `$pad` 引用手柄对象
3. **仅ESP32**: 本库依赖ESP32 BLE，不支持其他平台
4. **MAC地址**: 必须替换为实际手柄MAC地址
5. **避免延时**: 主循环中不要使用delay，会导致手柄数据丢失

# Wio Terminal 按键与5向开关

Wio Terminal 内置可配置按键（A/B/C）与5向摇杆开关的 Blockly 控制库。无需外部库，直接使用开发板包内置的宏定义（`WIO_KEY_A/B/C`、`WIO_5S_*`）和 Arduino 标准 `digitalRead`/`pinMode`。

## 库信息
- **Name**: @aily-project/lib-seeed-wio-buttons
- **Version**: 1.0.0

---

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wio_button_is_pressed` | Value (Boolean) | BUTTON(dropdown) | `wio_button_is_pressed(A)` | `(digitalRead(WIO_KEY_A) == LOW)` |
| `wio_switch_is_pressed` | Value (Boolean) | DIRECTION(dropdown) | `wio_switch_is_pressed(上)` | `(digitalRead(WIO_5S_UP) == LOW)` |

---

## Parameter Options

### wio_button_is_pressed — BUTTON

| 显示值 | 宏 |
|--------|-----|
| A | `WIO_KEY_A` |
| B | `WIO_KEY_B` |
| C | `WIO_KEY_C` |

### wio_switch_is_pressed — DIRECTION

| 显示值 | 宏 |
|--------|-----|
| 上 | `WIO_5S_UP` |
| 下 | `WIO_5S_DOWN` |
| 左 | `WIO_5S_LEFT` |
| 右 | `WIO_5S_RIGHT` |
| 按压 | `WIO_5S_PRESS` |

---

## ABS Examples

### 检测按键 A 打印消息
```
arduino_setup()
    serial_begin(Serial, 115200)

arduino_loop()
    controls_if()
        @IF0: wio_button_is_pressed(A)
        @DO0:
            serial_println(Serial, text("A Key pressed"))
    controls_if()
        @IF0: wio_button_is_pressed(B)
        @DO0:
            serial_println(Serial, text("B Key pressed"))
    controls_if()
        @IF0: wio_button_is_pressed(C)
        @DO0:
            serial_println(Serial, text("C Key pressed"))
    time_delay(math_number(200))
```

### 检测5向开关方向
```
arduino_setup()
    serial_begin(Serial, 115200)

arduino_loop()
    controls_if()
        @IF0: wio_switch_is_pressed(上)
        @DO0:
            serial_println(Serial, text("5 Way Up"))
        @IF1: wio_switch_is_pressed(下)
        @DO1:
            serial_println(Serial, text("5 Way Down"))
        @IF2: wio_switch_is_pressed(左)
        @DO2:
            serial_println(Serial, text("5 Way Left"))
        @IF3: wio_switch_is_pressed(右)
        @DO3:
            serial_println(Serial, text("5 Way Right"))
        @IF4: wio_switch_is_pressed(按压)
        @DO4:
            serial_println(Serial, text("5 Way Press"))
    time_delay(math_number(200))
```

---

## Notes

1. **自动初始化**：`wio_button_is_pressed` 和 `wio_switch_is_pressed` 会自动将对应引脚的 `pinMode` 加入 setup，无需手动操作。
2. **低电平有效**：按下或拨动时 `digitalRead` 返回 `LOW`（0），松开时返回 `HIGH`（1）。
3. **仅适用 Wio Terminal**：宏定义（`WIO_KEY_A` 等）仅在 Seeeduino SAMD 开发板包中存在，不适用于其他平台。

# 矩阵键盘库

Emakefun矩阵键盘模块驱动库，支持4x4矩阵键盘按键检测。

## 库信息
- **名称**: @aily-project/lib-matrix_keyboard
- **版本**: 1.0.0

## 块定义

| 块类型 | 连接类型 | 参数 (args0顺序) | ABS格式 | 生成代码 |
|--------|----------|------------------|---------|----------|
| `matrix_keyboard_init` | Statement | VAR(field_input), I2C_ADDR(field_input) | `matrix_keyboard_init("keyboard", "0x65")` | 创建对象并初始化，自动添加Tick()到loop |
| `matrix_keyboard_get_current_key` | Value | VAR(field_variable) | `matrix_keyboard_get_current_key($keyboard)` | `keyboard.GetCurrentPressedKey()` |
| `matrix_keyboard_key_pressed` | Value | VAR(field_variable), KEY(field_dropdown) | `matrix_keyboard_key_pressed($keyboard, kKey1)` | `keyboard.Pressed(emakefun::MatrixKeyboard::kKey1)` |
| `matrix_keyboard_key_pressing` | Value | VAR(field_variable), KEY(field_dropdown) | `matrix_keyboard_key_pressing($keyboard, kKey1)` | `keyboard.Pressing(emakefun::MatrixKeyboard::kKey1)` |
| `matrix_keyboard_key_released` | Value | VAR(field_variable), KEY(field_dropdown) | `matrix_keyboard_key_released($keyboard, kKey1)` | `keyboard.Released(emakefun::MatrixKeyboard::kKey1)` |
| `matrix_keyboard_key_idle` | Value | VAR(field_variable), KEY(field_dropdown) | `matrix_keyboard_key_idle($keyboard, kKey1)` | `keyboard.Idle(emakefun::MatrixKeyboard::kKey1)` |
| `matrix_keyboard_get_key_state` | Value | VAR(field_variable), KEY(field_dropdown) | `matrix_keyboard_get_key_state($keyboard, kKey1)` | `(int)keyboard.GetKeyState(...)` |

## 参数选项

| 参数 | 值 | 描述 |
|------|-----|------|
| KEY | kKey0, kKey1, kKey2, kKey3, kKey4, kKey5, kKey6, kKey7, kKey8, kKey9, kKeyA, kKeyB, kKeyC, kKeyD, kKeyAsterisk, kKeyNumberSign | 按键选择（0-9、A-D、*、#） |

## ABS示例

### 基本使用
```
arduino_setup()
    matrix_keyboard_init("keyboard", "0x65")
    serial_begin(Serial, 9600)
    serial_println(Serial, text("Matrix Keyboard Ready!"))

arduino_loop()
    controls_if()
        @IF0: logic_compare(matrix_keyboard_get_current_key($keyboard), NEQ, text(""))
        @DO0:
            serial_print(Serial, text("Key pressed: "))
            serial_println(Serial, matrix_keyboard_get_current_key($keyboard))
```

### 检测特定按键
```
arduino_setup()
    matrix_keyboard_init("keyboard", "0x65")
    serial_begin(Serial, 9600)

arduino_loop()
    controls_if()
        @IF0: matrix_keyboard_key_pressed($keyboard, kKey1)
        @DO0:
            serial_println(Serial, text("Key 1 pressed"))
```

## 注意事项

1. **变量创建**: `matrix_keyboard_init("varName", "i2cAddr")` 创建变量 `$varName`，后续使用 `$varName` 引用
2. **I2C地址**: 默认地址为0x65，支持十六进制格式输入
3. **自动Tick**: 初始化块会自动将 `Tick()` 添加到loop开头，无需手动调用
4. **按键状态**: 
   - Pressed: 按键被按下瞬间
   - Pressing: 按键正在被按住
   - Released: 按键被释放瞬间
   - Idle: 按键处于空闲状态
# Grove PIR 运动传感器

Grove PIR运动传感器库，用于检测人体运动。

## 库信息
- **名称**: @aily-project/lib-pir
- **版本**: 1.0.0

## 块定义

| 块类型 | 连接类型 | 参数（args0顺序） | ABS格式 | 生成代码 |
|--------|----------|-------------------|---------|----------|
| `grove_pir_init` | Statement | VAR(field_input), PIN(input_value) | `grove_pir_init("pir", io_pin_digi(2))` | `int pir_pin = 2; pinMode(pir_pin, INPUT);` |
| `grove_pir_read` | Value | VAR(field_variable) | `grove_pir_read(variables_get($pir))` | `digitalRead(pir_pin)` |
| `grove_pir_motion_detected` | Value | VAR(field_variable) | `grove_pir_motion_detected(variables_get($pir))` | `digitalRead(pir_pin) == HIGH` |

## 参数说明

| 参数 | 类型 | 说明 |
|------|------|------|
| VAR | field_input/field_variable | 传感器变量名 |
| PIN | input_value (Number) | 数字引脚号（如2、D2等） |

## ABS 示例

### 基本使用

```
arduino_setup()
    grove_pir_init("pir", io_pin_digi(2))
    serial_begin(Serial, 9600)

arduino_loop()
    controls_if()
        @IF0: grove_pir_motion_detected(variables_get($pir))
        @DO0:
            serial_println(Serial, text("Motion detected!"))
    time_delay(math_number(200))
```

## 注意事项

1. **初始化**: 在 `arduino_setup()` 中调用 `grove_pir_init` 初始化传感器
2. **变量引用**: 在值槽中使用 `variables_get($varName)` 引用已创建的传感器变量
3. **检测范围**: 默认检测距离3米，可通过板载电位器调节（最大6米）
4. **保持时间**: 默认保持时间可通过板载电位器调节（1-25秒）
5. **触发模式**: 可通过跳线帽选择可重复触发或不可重复触发模式
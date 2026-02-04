# 变量核心库

Arduino变量管理库，提供变量声明、赋值、获取和类型转换功能

## 库信息
- **库名**: @aily-project/lib-core-variables
- **版本**: 1.0.1

## 块定义

| 块类型 | 连接 | 参数 | ABS格式 | 生成代码 |
|--------|------|------|---------|----------|
| `variable_define` | 语句块 | VAR(field_input), TYPE(dropdown), VALUE(input_value) | `variable_define("temp", int, math_number(25))` | `int temp = 25;` |
| `variable_define_scoped` | 语句块 | SCOPE(dropdown), VAR(field_input), TYPE(dropdown), VALUE(input_value) | `variable_define_scoped(global, "temp", int, math_number(25))` | `int temp = 25;` |
| `variable_define_advanced` | 语句块 | STORAGE(dropdown), QUALIFIER(dropdown), VAR(field_input), TYPE(dropdown), VALUE(input_value) | `variable_define_advanced(static, const, "MAX", int, math_number(100))` | `static const int MAX = 100;` |
| `variable_define_advanced_scoped` | 语句块 | SCOPE(dropdown), STORAGE(dropdown), QUALIFIER(dropdown), VAR(field_input), TYPE(dropdown), VALUE(input_value) | `variable_define_advanced_scoped(global, static, const, "MAX", int, math_number(100))` | `static const int MAX = 100;` |
| `variables_get` | 值块 | VAR(field_variable) | `variables_get($temp)` | `temp` |
| `variables_set` | 语句块 | VAR(field_variable), VALUE(input_value) | `variables_set($temp, math_number(30))` | `temp = 30;` |
| `type_cast` | 值块 | VALUE(input_value), TYPE(dropdown) | `type_cast(math_number(3.14), int)` | `(int)3.14` |

**变量说明**: `variable_define` 系列块会自动创建变量并注册到 Blockly，后续用 `$变量名` 引用。

**作用域规则**:
- **全局变量**: `variable_define` 作为独立块使用（不在任何代码块内）
- **局部变量**: `variable_define` 放在 `arduino_setup()` 或 `arduino_loop()` 等代码块内
- **明确控制**: 推荐使用 `*_scoped` 版本通过 SCOPE 参数明确指定作用域

## ABS 示例

### 基本变量声明与使用
```
// 全局变量：独立块，整个程序可访问
variable_define("count", int, math_number(0))

arduino_setup()
    // 局部变量：在代码块内，仅此函数内可访问
    variable_define("temperature", float, math_number(25.5))
    serial_begin(Serial, 9600)
    serial_print(Serial, text("temp: "))
    serial_println(Serial, variables_get($temperature))

arduino_loop()
    variables_set($count, math_number(variables_get($count) + 1))
    serial_print(Serial, text("计数: "))
    serial_println(Serial, variables_get($count))
    time_delay(math_number(1000))
```

### 高级变量定义
```
// 全局静态常量：独立块定义
variable_define_advanced(static, const, "LED_PIN", uint8_t, math_number(13))
// 全局易变变量：独立块定义  
variable_define_advanced(, volatile, "flag", bool, logic_boolean(FALSE))

arduino_setup()
    pin_mode(variables_get($LED_PIN), OUTPUT)
    
arduino_loop()
    controls_if()
        @IF0: variables_get($flag)
        @DO0:
            pin_digital_write(variables_get($LED_PIN), HIGH)
        @ELSE:
            pin_digital_write(variables_get($LED_PIN), LOW)
```

### 类型转换
```
arduino_setup()
    variable_define("value", "float", math_number(3.14159))
    variable_define("intValue", "int", type_cast(variables_get($value), "int"))
```

## 参数选项

| 参数 | 可选值 | 说明 |
|------|--------|------|
| SCOPE | global, local | 变量作用域 |
| STORAGE | , static, extern | 存储类说明符 |
| QUALIFIER | , const, volatile, const volatile | 类型限定符 |
| TYPE | int8_t~int64_t, uint8_t~uint64_t, int, long, float, double, bool, char, byte, String, void*, size_t等 | 数据类型 |

### 数据类型详细

**固定宽度类型（推荐）**:
- `int8_t`, `int16_t`, `int32_t`, `int64_t` - 有符号整型
- `uint8_t`, `uint16_t`, `uint32_t`, `uint64_t` - 无符号整型

**传统类型**:
- `int`, `long`, `float`, `double`, `unsigned int`, `unsigned long`

**其他类型**:
- `bool`, `char`, `byte`, `String`, `void*`, `size_t`

## 注意事项

1. **变量引用**: 声明时用字符串 `"变量名"`，使用时用 `$变量名`
2. **作用域控制**: 推荐使用 `*_scoped` 版本明确指定作用域
3. **固定宽度类型**: 使用 `int8_t` 等类型会自动包含 `<stdint.h>`
4. **extern声明**: 使用 `extern` 时不生成初始化值，仅声明
5. **修饰符顺序**: 生成代码遵循 `storage qualifier type name = value` 格式
6. **变量ID唯一**: 所有变量名必须唯一，避免冲突
# Variables 核心库

Arduino变量管理库，提供变量声明、赋值、获取和类型转换功能。

## 库信息
- **库名**: @aily-project/lib-core-variables
- **版本**: 1.0.1  
- **兼容**: 所有Arduino板卡

## 块定义

推荐使用variable_define_scoped或variable_define_advanced_scoped以支持作用域控制，通过SCOPE字段选择变量作用域（global全局/local局部）。

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `variable_define` | 语句块 | VAR(field_input), TYPE(dropdown), VALUE(input) | `"VAR":"name"`, `"TYPE":"int"` | `int name = 0;` |
| `variable_define_scoped` | 语句块 | SCOPE(dropdown),VAR(field_input), TYPE(dropdown), VALUE(input) | `"SCOPE":"global"`,`"VAR":"name"`, `"TYPE":"int"` | `int name = 0;` |
| `variable_define_advanced` | 语句块 | STORAGE(dropdown), QUALIFIER(dropdown), VAR(field_input), TYPE(dropdown), VALUE(input) | `"STORAGE":"static"`, `"QUALIFIER":"const"`, `"TYPE":"int"` | `static const int name = 0;` |
| `variable_define_advanced_scoped` | 语句块 | SCOPE(dropdown),STORAGE(dropdown), QUALIFIER(dropdown), VAR(field_input), TYPE(dropdown), VALUE(input) | `"SCOPE":"global"`,`"STORAGE":"static"`, `"QUALIFIER":"const"`, `"TYPE":"int"` | `static const int name = 0;` |
| `variables_get` | 值块 | VAR(field_variable) | `"VAR":{"id":"name"}` | `name` |
| `variables_set` | 语句块 | VAR(field_variable), VALUE(input) | `"VAR":{"id":"name"}` | `name = value;` |
| `type_cast` | 值块 | VALUE(input), TYPE(dropdown) | `"TYPE":"int"` | `(int)value` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "temperature"` |
| field_dropdown | 字符串 | `"TYPE": "int"` |
| field_variable | 对象 | `"VAR": {"id": "name"}` |
| input_value | 块连接 | `"inputs": {"VALUE": {"block": {...}}}` |

### variable_define_advanced 字段选项

**STORAGE**: `""` (普通) / `"static"` (静态) / `"extern"` (外部声明)  
**QUALIFIER**: `""` (普通) / `"const"` (常量) / `"volatile"` (易变) / `"const volatile"` (常量易变)  
**TYPE**: `int8_t`~`int64_t`, `uint8_t`~`uint64_t`, `int`, `long`, `float`, `double`, `unsigned int`, `unsigned long`, `bool`, `char`, `byte`, `String`, `void*`, `size_t`

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **变量引用**: 声明时用字符串，使用时用对象ID

## 使用示例

### 基础变量
```json
{"type": "variable_define", "fields": {"VAR": "temp", "TYPE": "int"}, "inputs": {"VALUE": {"shadow": {"type": "math_number", "fields": {"NUM": 25}}}}}
```
生成: `int temp = 25;`

### 固定宽度类型
```json
{"type": "variable_define", "fields": {"VAR": "sensor", "TYPE": "uint8_t"}, "inputs": {"VALUE": {"shadow": {"type": "math_number", "fields": {"NUM": 0}}}}}
```
生成: `uint8_t sensor = 0;` (自动包含`<stdint.h>`)

### 高级定义 - 静态常量
```json
{"type": "variable_define_advanced", "fields": {"STORAGE": "static", "QUALIFIER": "const", "VAR": "MAX", "TYPE": "int"}, "inputs": {"VALUE": {"shadow": {"type": "math_number", "fields": {"NUM": 100}}}}}
```
生成: `static const int MAX = 100;`

### 高级定义 - 易变变量
```json
{"type": "variable_define_advanced", "fields": {"STORAGE": "", "QUALIFIER": "volatile", "VAR": "flag", "TYPE": "uint8_t"}, "inputs": {"VALUE": {"shadow": {"type": "math_number", "fields": {"NUM": 0}}}}}
```
生成: `volatile uint8_t flag = 0;`

### 外部声明
```json
{"type": "variable_define_advanced", "fields": {"STORAGE": "extern", "QUALIFIER": "", "VAR": "data", "TYPE": "float"}}
```
生成: `extern float data;` (无初始化值)

### 完整程序
```json
{
  "type": "arduino_setup",
  "inputs": {
    "ARDUINO_SETUP": {
      "block": {
        "type": "variable_define",
        "fields": {"VAR": "count", "TYPE": "int"},
        "inputs": {"VALUE": {"shadow": {"type": "math_number", "fields": {"NUM": 0}}}},
        "next": {
          "block": {
            "type": "variables_set",
            "fields": {"VAR": {"id": "count"}},
            "inputs": {"VALUE": {"block": {"type": "math_number", "fields": {"NUM": 1}}}}
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **变量ID**: 声明用字符串，引用用对象ID
2. **作用域**: 连接在程序流中=局部变量，独立存在=全局变量  
3. **固定宽度类型**: 使用`int8_t`等自动包含`<stdint.h>`
4. **extern声明**: 不生成初始化值，仅声明
5. **修饰符顺序**: `storage qualifier type name = value`
6. **必须唯一**: 所有块ID和变量ID必须唯一

## 支持的数据类型

**固定宽度**(推荐跨平台): `int8_t`, `int16_t`, `int32_t`, `int64_t`, `uint8_t`, `uint16_t`, `uint32_t`, `uint64_t`  
**传统类型**: `int`, `long`, `float`, `double`, `unsigned int`, `unsigned long`  
**其他**: `bool`, `char`, `byte`, `String`, `void*`, `size_t`

---
*自包含文档，无需外部规范*
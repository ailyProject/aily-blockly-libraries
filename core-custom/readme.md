# Custom 自定义代码库

标准Blockly库的补充工具，提供代码插入、宏定义、条件编译、函数定义、指针操作等高级C++功能。

## 库信息
- **库名**: @aily-project/lib-core-custom
- **版本**: 1.1.0
- **兼容**: 所有Arduino平台

## 块定义

### 代码插入

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `custom_code` | 语句块 | CODE(field_multilinetext) | `"CODE":"code"` | `code` |
| `custom_code2` | 值块 | CODE(field_multilinetext) | `"CODE":"expr"` | `expr` |
| `custom_insert_code` | Hat块 | POSITION(dropdown), CODE(field_multilinetext) | `"POSITION":"macro"` | 插入到指定区域 |

### 预处理指令

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `custom_macro` | Hat块 | NAME(field_input), VALUE(field_input) | `"NAME":"LED","VALUE":"13"` | `#define LED 13` |
| `custom_library` | Hat块 | LIB_NAME(field_input) | `"LIB_NAME":"Wire.h"` | `#include <Wire.h>` |

### 条件编译

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `custom_ifdef` | 语句块 | MACRO(field_input), CODE(input_statement) | `"MACRO":"DEBUG"` | `#ifdef DEBUG...#endif` |
| `custom_ifndef` | 语句块 | MACRO(field_input), CODE(input_statement) | `"MACRO":"RELEASE"` | `#ifndef RELEASE...#endif` |
| `custom_ifdef_else` | 语句块 | MACRO(field_input), IF_CODE(input_statement), ELSE_CODE(input_statement) | `"MACRO":"DEBUG"` | `#ifdef...#else...#endif` |

### 函数定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `custom_function` | Hat块 | NAME(field_input), RETURN(dropdown), PARAMS(field_input), BODY(input_statement) | `"NAME":"func","RETURN":"void"` | `void func() {...}` |
| `custom_function_text` | Hat块 | NAME(field_input), RETURN(dropdown), PARAMS(field_input), BODY(field_multilinetext) | `"NAME":"func","BODY":"code"` | `void func() {code}` |
| `custom_function_call` | 语句块 | NAME(field_input), ARGS(field_input) | `"NAME":"func","ARGS":"1,2"` | `func(1,2);` |
| `custom_function_call_return` | 值块 | NAME(field_input), ARGS(field_input) | `"NAME":"func","ARGS":""` | `func()` |
| `custom_return` | 语句块 | VALUE(input_value) | - | `return value;` |
| `custom_return_void` | 语句块 | - | - | `return;` |

### 注释

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `comment` | 语句块 | TEXT(field_input) | `"TEXT":"注释"` | `// 注释` |
| `comment_multiline` | 语句块 | TEXT(field_multilinetext) | `"TEXT":"多行"` | `/* 多行 */` |
| `comment_wrapper` | 语句块 | TEXT(field_input), STATEMENTS(input_statement) | `"TEXT":"区域"` | `// [BEGIN]...// [END]` |

### 高级表达式

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `custom_sizeof` | 值块 | TARGET(field_input) | `"TARGET":"int"` | `sizeof(int)` |
| `custom_cast` | 值块 | TYPE(field_input), VALUE(input_value) | `"TYPE":"int"` | `(int)value` |
| `custom_ternary` | 值块 | CONDITION(input_value), IF_TRUE(input_value), IF_FALSE(input_value) | - | `cond ? a : b` |
| `custom_pointer_ref` | 值块 | OP(dropdown), VAR(field_input) | `"OP":"&","VAR":"x"` | `&x` |
| `custom_array_access` | 值块 | ARRAY(field_input), INDEX(input_value) | `"ARRAY":"arr"` | `arr[index]` |
| `custom_struct_access` | 值块 | STRUCT(field_input), OP(dropdown), MEMBER(field_input) | `"OP":".","MEMBER":"x"` | `obj.x` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"NAME": "myFunc"` |
| field_multilinetext | 字符串 | `"CODE": "line1\nline2"` |
| field_dropdown | 字符串 | `"RETURN": "void"` |
| input_value | 块连接 | `"inputs": {"VALUE": {"block": {...}}}` |
| input_statement | 块连接 | `"inputs": {"BODY": {"block": {...}}}` |

### 字段选项

**RETURN** (函数返回类型): `void`, `int`, `long`, `float`, `double`, `bool`, `char`, `String`, `int*`, `char*`, `void*`, `uint8_t`, `uint16_t`, `uint32_t`

**POSITION** (代码插入位置): `macro`(宏定义区), `library`(库引用区), `variable`(变量区), `object`(对象区), `function`(函数区)

**OP** (指针操作): `&`(取地址), `*`(解引用)

**OP** (成员访问): `.`(直接访问), `->`(指针访问)

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **Hat块**: 无连接属性，生成代码到文件头部区域
- **特殊**: `custom_return`/`custom_return_void`只有previousStatement，无nextStatement（终止语句）

## 使用示例

### 定义并调用函数
```json
{"type": "custom_function", "fields": {"NAME": "add", "RETURN": "int", "PARAMS": "int a, int b"}, "inputs": {"BODY": {"block": {"type": "custom_return", "inputs": {"VALUE": {"block": {"type": "custom_code2", "fields": {"CODE": "a + b"}}}}}}}}
```
生成: `int add(int a, int b) { return a + b; }`

### 条件编译
```json
{"type": "custom_ifdef", "fields": {"MACRO": "DEBUG"}, "inputs": {"CODE": {"block": {"type": "custom_code", "fields": {"CODE": "Serial.println(\"Debug\");"}}}}}
```
生成: `#ifdef DEBUG ... #endif`

## 重要规则

1. **补充定位**: 此库用于补充标准库，变量定义请使用lib-core-variables
2. **语法责任**: 自定义代码的语法正确性由用户负责
3. **Hat块**: `custom_macro`, `custom_library`, `custom_function`, `custom_function_text`, `custom_insert_code`无连接属性，代码自动插入到文件对应区域
4. **终止语句**: `custom_return`和`custom_return_void`无nextStatement，是函数的终止点
5. **唯一性**: 所有块ID必须唯一

---
*自包含文档，无需外部规范*

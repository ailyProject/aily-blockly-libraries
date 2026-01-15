# Arrays 核心库

Arduino数组管理库，提供一维、二维数组的创建、读写、查找、排序、遍历等功能。

## 库信息
- **库名**: @aily-project/lib-core-lists
- **版本**: 1.0.0
- **兼容**: 所有Arduino板卡

## 块定义

### 创建数组

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `list_create_empty` | 语句块 | VAR(field_input), TYPE(dropdown), LENGTH(input) | `"VAR":"myList"`, `"TYPE":"int"` | `int myList[10];` |
| `list_create_with_values` | 语句块 | VAR(field_input), TYPE(dropdown), VALUES(input) | `"VAR":"scores"`, `"TYPE":"int"` | `int scores[3] = {1, 2, 3};` |
| `list_values` | 值块 | INPUT0~INPUTn(input_value), 动态输入 | `"extraState":{"extraCount":2}` | `{1, 2, 3}` |
| `list_values_simple` | 值块 | LIST(field_input) | `"LIST":"1, 2, 3"` | `{1, 2, 3}` |
| `list_from_string` | 语句块 | VAR(field_input), TEXT(input) | `"VAR":"text"` | `char text[] = "Hello";` |

### 读写元素

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `list_get` | 值块 | VAR(field_variable), INDEX(input) | `"VAR":{"id":"list_id"}` | `myList[0]` |
| `list_set` | 语句块 | VAR(field_variable), INDEX(input), VALUE(input) | `"VAR":{"id":"list_id"}` | `myList[0] = 10;` |
| `list_length` | 值块 | VAR(field_variable) | `"VAR":{"id":"list_id"}` | `(sizeof(myList) / sizeof(myList[0]))` |

### 查找与判断

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `list_find` | 值块 | VAR(field_variable), VALUE(input) | `"VAR":{"id":"list_id"}` | `_listFind_myList(5)` |
| `list_contains` | 值块 | VAR(field_variable), VALUE(input) | `"VAR":{"id":"list_id"}` | `_listContains_myList(5)` |

### 统计计算

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `list_min_max` | 值块 | VAR(field_variable), MODE(dropdown) | `"MODE":"min"` | `_listMin_myList()` |

### 数组操作

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `list_sort` | 语句块 | VAR(field_variable), ORDER(dropdown) | `"ORDER":"asc"` | `_listSort_myList_asc();` |
| `list_reverse` | 语句块 | VAR(field_variable) | `"VAR":{"id":"list_id"}` | `_listReverse_myList();` |
| `list_fill` | 语句块 | VAR(field_variable), VALUE(input) | `"VAR":{"id":"list_id"}` | `_listFill_myList(0);` |
| `list_copy` | 语句块 | FROM(field_variable), TO(field_variable) | `"FROM":{"id":"src_id"}` | `_listCopy_src_to_dest();` |
| `list_shift` | 语句块 | VAR(field_variable), DIRECTION(dropdown) | `"DIRECTION":"left"` | `_listShift_myList_left();` |

### 遍历数组

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `list_foreach` | 语句块 | VAR(field_variable), ITEM(field_input), DO(statement) | `"ITEM":"item"` | `for(...) { auto item = myList[_i]; }` |
| `list_foreach_index` | 语句块 | VAR(field_variable), INDEX(field_input), ITEM(field_input), DO(statement) | `"INDEX":"i"`, `"ITEM":"item"` | `for(int i=0;...) { auto item = myList[i]; }` |

### 二维数组

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `list2d_create` | 语句块 | VAR(field_input), TYPE(dropdown), ROWS(input), COLS(input) | `"VAR":"matrix"`, `"TYPE":"int"` | `int matrix[3][3];` |
| `list2d_create_with_values` | 语句块 | VAR(field_input), TYPE(dropdown), INPUT0~INPUTn(input) | `"extraState":{"extraCount":1}` | `int matrix[2][3] = {{1,2,3}, {4,5,6}};` |
| `list2d_get` | 值块 | VAR(field_variable), ROW(input), COL(input) | `"VAR":{"id":"matrix_id"}` | `matrix[0][1]` |
| `list2d_set` | 语句块 | VAR(field_variable), ROW(input), COL(input), VALUE(input) | `"VAR":{"id":"matrix_id"}` | `matrix[0][1] = 5;` |
| `list2d_size` | 值块 | VAR(field_variable), DIMENSION(dropdown) | `"DIMENSION":"rows"` | `(sizeof(matrix) / sizeof(matrix[0]))` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "myList"` |
| field_dropdown | 字符串 | `"TYPE": "int"` |
| field_variable | LISTS变量对象 | `"VAR": {"id": "list_id", "name": "myList", "type": "LISTS"}` |
| input_value | 块连接 | `"inputs": {"VALUE": {"block": {...}}}` |
| input_statement | 语句块连接 | `"inputs": {"DO": {"block": {...}}}` |

### 字段选项

**TYPE(数据类型)**: `"int"` (整数) / `"float"` (小数) / `"char"` (字符) / `"String"` (字符串) / `"byte"` (字节) / `"long"` (长整数) / `"double"` (双精度)  
**ORDER(排序方式)**: `"asc"` (升序) / `"desc"` (降序)  
**MODE(统计模式)**: `"min"` (最小值) / `"max"` (最大值) / `"sum"` (求和) / `"avg"` (平均值)  
**DIRECTION(移位方向)**: `"left"` (左移) / `"right"` (右移)  
**DIMENSION(尺寸)**: `"rows"` (行数) / `"cols"` (列数)

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **变量引用**: 创建块用字符串(`field_input`)，使用块用对象ID(`field_variable`)
- **变量类型**: 数组变量统一使用 `LISTS` 类型

## 使用示例

### 创建空数组
```json
{
  "type": "list_create_empty",
  "fields": {"VAR": "myList", "TYPE": "int"},
  "inputs": {"LENGTH": {"shadow": {"type": "math_number", "fields": {"NUM": 10}}}}
}
```
生成: `int myList[10];`

### 创建带初始值的数组
```json
{
  "type": "list_create_with_values",
  "fields": {"VAR": "scores", "TYPE": "int"},
  "inputs": {
    "VALUES": {
      "block": {
        "type": "list_values",
        "extraState": {"extraCount": 2},
        "inputs": {
          "INPUT0": {"block": {"type": "math_number", "fields": {"NUM": 85}}},
          "INPUT1": {"block": {"type": "math_number", "fields": {"NUM": 90}}},
          "INPUT2": {"block": {"type": "math_number", "fields": {"NUM": 78}}}
        }
      }
    }
  }
}
```
生成: `int scores[3] = {85, 90, 78};`

### 简化数组值（直接输入）
```json
{
  "type": "list_create_with_values",
  "fields": {"VAR": "data", "TYPE": "float"},
  "inputs": {
    "VALUES": {
      "block": {"type": "list_values_simple", "fields": {"LIST": "1.5, 2.5, 3.5"}}
    }
  }
}
```
生成: `float data[3] = {1.5, 2.5, 3.5};`

### 读取数组元素
```json
{
  "type": "list_get",
  "fields": {"VAR": {"id": "list_id", "name": "myList", "type": "LISTS"}},
  "inputs": {"INDEX": {"block": {"type": "math_number", "fields": {"NUM": 0}}}}
}
```
生成: `myList[0]`

### 设置数组元素
```json
{
  "type": "list_set",
  "fields": {"VAR": {"id": "list_id", "name": "myList", "type": "LISTS"}},
  "inputs": {
    "INDEX": {"block": {"type": "math_number", "fields": {"NUM": 2}}},
    "VALUE": {"block": {"type": "math_number", "fields": {"NUM": 99}}}
  }
}
```
生成: `myList[2] = 99;`

### 查找元素
```json
{
  "type": "list_find",
  "fields": {"VAR": {"id": "list_id", "name": "myList", "type": "LISTS"}},
  "inputs": {"VALUE": {"block": {"type": "math_number", "fields": {"NUM": 5}}}}
}
```
生成: `_listFind_myList(5)` (自动生成辅助函数)

### 数组排序
```json
{
  "type": "list_sort",
  "fields": {"VAR": {"id": "list_id"}, "ORDER": "asc"}
}
```
生成: `_listSort_myList_asc();` (自动生成冒泡排序函数)

### 遍历数组
```json
{
  "type": "list_foreach_index",
  "fields": {"VAR": {"id": "list_id"}, "INDEX": "i", "ITEM": "value"},
  "inputs": {
    "DO": {
      "block": {"type": "serial_println", "inputs": {"CONTENT": {"block": {"type": "variables_get", "fields": {"VAR": {"id": "value_id"}}}}}}
    }
  }
}
```
生成:
```cpp
for (int i = 0; i < (sizeof(myList) / sizeof(myList[0])); i++) {
  auto value = myList[i];
  Serial.println(value);
}
```

### 创建二维数组
```json
{
  "type": "list2d_create",
  "fields": {"VAR": "matrix", "TYPE": "int"},
  "inputs": {
    "ROWS": {"block": {"type": "math_number", "fields": {"NUM": 3}}},
    "COLS": {"block": {"type": "math_number", "fields": {"NUM": 3}}}
  }
}
```
生成: `int matrix[3][3];`

### 创建带初始值的二维数组
```json
{
  "type": "list2d_create_with_values",
  "fields": {"VAR": "matrix", "TYPE": "int"},
  "extraState": {"extraCount": 1},
  "inputs": {
    "INPUT0": {
      "block": {
        "type": "list_values",
        "extraState": {"extraCount": 2},
        "inputs": {
          "INPUT0": {"block": {"type": "math_number", "fields": {"NUM": 1}}},
          "INPUT1": {"block": {"type": "math_number", "fields": {"NUM": 2}}},
          "INPUT2": {"block": {"type": "math_number", "fields": {"NUM": 3}}}
        }
      }
    },
    "INPUT1": {
      "block": {
        "type": "list_values",
        "extraState": {"extraCount": 2},
        "inputs": {
          "INPUT0": {"block": {"type": "math_number", "fields": {"NUM": 4}}},
          "INPUT1": {"block": {"type": "math_number", "fields": {"NUM": 5}}},
          "INPUT2": {"block": {"type": "math_number", "fields": {"NUM": 6}}}
        }
      }
    }
  }
}
```
生成: `int matrix[2][3] = {{1, 2, 3}, {4, 5, 6}};`

## 重要规则

1. **索引从0开始**: 所有数组索引统一从0开始计数
2. **变量管理**: 创建块使用`field_input`定义变量名，generator调用`registerVariableToBlockly(varName, 'LISTS')`注册；使用块通过`field_variable`引用
3. **作用域**: 在`setup()`/`loop()`内创建→局部变量，在外部创建→全局变量（通过`generator.addVariable()`添加）
4. **动态输入**: `list_values`和`list2d_create_with_values`使用`dynamic_inputs_mutator`，通过`extraState.extraCount`控制输入数量（总数=extraCount+1）
5. **辅助函数**: 查找、排序、统计等操作会自动生成辅助函数（通过`generator.addFunction()`添加）
6. **静态数组**: Arduino C++使用静态数组，创建后大小不可改变
7. **常见错误**: ❌ 索引越界访问；❌ 未创建直接使用；❌ 对String数组使用统计函数

## 自动生成的辅助函数

| 操作 | 函数名模式 | 说明 |
|------|-----------|------|
| 查找 | `_listFind_${varName}` | 返回索引，未找到返回-1 |
| 包含 | `_listContains_${varName}` | 返回bool |
| 最小值 | `_listMin_${varName}` | 返回数组类型 |
| 最大值 | `_listMax_${varName}` | 返回数组类型 |
| 求和 | `_listSum_${varName}` | 返回long |
| 平均值 | `_listAvg_${varName}` | 返回float |
| 排序 | `_listSort_${varName}_${order}` | void，原地排序 |
| 反转 | `_listReverse_${varName}` | void，原地反转 |
| 填充 | `_listFill_${varName}` | void，接收填充值参数 |
| 复制 | `_listCopy_${from}_to_${to}` | void，复制到目标数组 |
| 移位 | `_listShift_${varName}_${dir}` | void，循环移位 |

## 支持的数据类型

| 显示名称 | C++ 类型 | 说明 |
|----------|----------|------|
| 整数 | `int` | 16/32位有符号整数 |
| 小数 | `float` | 单精度浮点数 |
| 字符 | `char` | 单个字符 |
| 字符串 | `String` | Arduino String对象 |
| 字节 | `byte` | 8位无符号整数(0-255) |
| 长整数 | `long` | 32位有符号整数 |
| 双精度 | `double` | 双精度浮点数 |

---
*自包含文档，无需外部规范*

# 数组 (Arrays) 核心库

Arduino/C++编程中的数组管理核心库，提供一维、二维数组创建、操作和管理功能。

## 库信息
- **库名**: @aily-project/lib-core-lists
- **版本**: 0.0.2
- **作者**: aily Project
- **描述**: 核心库，通常已经集成到初始模板中
- **电压**: 3.3V、5V

## Blockly 工具箱分类

### 数组
- `list_create_with` - 创建数组
- `list_create_with_item` - 数组初始值
- `list_get_index` - 数组访问
- `list_set_index` - 数组赋值
- `list_length` - 数组长度
- `list2_get_value` - 二维数组访问
- `list2_set_value` - 二维数组赋值
- `list2_get_length` - 二维数组长度

## 详细块定义

### 数组创建块

#### list_create_with
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 创建一维或二维数组，支持动态长度和多种数据类型
**字段**:
- `VAR`: 文本输入 - 数组名 (默认: "list")
- `TYPE`: 下拉选择 - 数据类型 ["int", "unsigned int", "long", "unsigned long", "short", "unsigned short", "float", "double", "char", "unsigned char", "String", "byte"]
- `LENGTH`: 文本输入 - 数组长度 (默认: "3")
**值输入**:
- `INPUT0`: 数组输入 - 初始值 (检查类型: Array, String)
- `INPUT1`: 数组输入 - 可选的额外输入
**生成代码**: `int list[3] = {1, 2, 3};`
**动态扩展**: 支持动态添加/删除数组元素
**作用域**: 自动检测局部/全局作用域

#### list_create_with_item
**类型**: 值块 (output: Array)
**描述**: 创建数组初始值，可动态设置长度和各个值
**值输入**:
- `LENGTH`: 数字输入 - 数组长度
- `VALUE0`, `VALUE1`, ... - 动态值输入 - 数组元素值
**生成代码**: `{1, 2, 3}`
**特性**: 根据长度自动调整输入项数量
**限制**: 长度范围1-20
**动态扩展**: 使用 `list_dynamic_extension` 扩展

### 数组操作块

#### list_get_index
**类型**: 值块 (output: Any)
**描述**: 通过索引访问数组元素
**字段**:
- `MODE`: 下拉选择 - 访问模式 ["GET", "GET_REMOVE", "REMOVE"]
- `WHERE`: 下拉选择 - 位置模式 ["FROM_START", "FROM_END", "FIRST", "LAST", "RANDOM"]
**值输入**:
- `VALUE`: 数组输入 - 目标数组
- `AT`: 数字输入 - 索引位置 (当WHERE为FROM_START/FROM_END时)
**生成代码**: `list[0]` (根据模式和位置生成相应代码)
**工具箱默认**: 索引位置默认为 0

#### list_set_index
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 修改指定位置的数组值
**字段**:
- `MODE`: 下拉选择 - 设置模式 ["SET", "INSERT"]
- `WHERE`: 下拉选择 - 位置模式 ["FROM_START", "FROM_END", "FIRST", "LAST", "RANDOM"]
**值输入**:
- `LIST`: 数组输入 - 目标数组
- `AT`: 数字输入 - 索引位置 (当WHERE为FROM_START/FROM_END时)
- `TO`: 任意输入 - 新值
**生成代码**: `list[0] = 10;`
**工具箱默认**: 索引位置默认为 0，新值默认为 10

#### list_length
**类型**: 值块 (output: Number)
**描述**: 获取数组长度信息
**值输入**:
- `VALUE`: 数组输入 - 目标数组
**生成代码**: `sizeof(list)/sizeof(list[0])`

### 二维数组块

#### list2_get_value
**类型**: 值块 (output: Any)
**描述**: 访问二维数组元素
**值输入**:
- `LIST`: 数组输入 - 二维数组
- `ROW`: 数字输入 - 行索引
- `COL`: 数字输入 - 列索引
**生成代码**: `matrix[0][0]`
**工具箱默认**: 行索引和列索引默认为 0

#### list2_set_value
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 修改二维数组元素值
**值输入**:
- `LIST`: 数组输入 - 二维数组
- `ROW`: 数字输入 - 行索引
- `COL`: 数字输入 - 列索引
- `VALUE`: 任意输入 - 新值
**生成代码**: `matrix[0][0] = 10;`
**工具箱默认**: 行索引和列索引默认为 0，新值默认为 10

#### list2_get_length
**类型**: 值块 (output: Number)
**描述**: 获取二维数组长度信息
**字段**:
- `DIMENSION`: 下拉选择 - 维度 ["ROWS", "COLS"]
**值输入**:
- `LIST`: 数组输入 - 二维数组
**生成代码**:
- ROWS: `sizeof(matrix)/sizeof(matrix[0])`
- COLS: `sizeof(matrix[0])/sizeof(matrix[0][0])`

## .abi 文件生成规范

### 块连接规则
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段

### 工具箱默认配置
- `list_create_with`: 默认数组名 "list"，类型 "int"，长度 "3"
- `list_create_with_item`: 默认长度 3，值为 [1, 2, 3]
- `list_get_index.AT`: 默认索引 0
- `list_set_index.AT`: 默认索引 0，新值 10
- `list2_get_value.ROW/COL`: 默认行列索引 0
- `list2_set_value.ROW/COL`: 默认行列索引 0，新值 10

### 动态扩展机制
- `list_create_with_item` 使用 `list_dynamic_extension` 扩展
- 根据 `LENGTH` 输入动态调整 `VALUE0`, `VALUE1`, ... 输入项
- 支持长度范围 1-20
- 自动序列化和反序列化数组结构

### 数据类型支持
- **整数类型**: int, unsigned int, long, unsigned long, short, unsigned short
- **浮点类型**: float, double
- **字符类型**: char, unsigned char, byte
- **字符串类型**: String

### 作用域管理
- **局部数组**: 在函数内创建的数组
- **全局数组**: 在全局作用域创建的数组
- **自动检测**: 根据块位置自动判断作用域

## 使用示例

### 创建一维数组
```json
{
  "type": "list_create_with",
  "extraState": {
    "itemCount": 2
  },
  "fields": {
    "VAR": "myArray",
    "TYPE": "int",
    "LENGTH": "3"
  },
  "inputs": {
    "INPUT0": {
      "block": {
        "type": "list_create_with_item",
        "extraState": {
          "itemCount": 3
        },
        "inputs": {
          "LENGTH": {"block": {"type": "math_number", "fields": {"NUM": "3"}}},
          "VALUE0": {"block": {"type": "math_number", "fields": {"NUM": "1"}}},
          "VALUE1": {"block": {"type": "math_number", "fields": {"NUM": "2"}}},
          "VALUE2": {"block": {"type": "math_number", "fields": {"NUM": "3"}}}
        }
      }
    }
  }
}
```

### 数组访问
```json
{
  "type": "list_get_index",
  "fields": {
    "MODE": "GET",
    "WHERE": "FROM_START"
  },
  "inputs": {
    "VALUE": {"block": {"type": "variables_get", "fields": {"VAR": {"id": "myArray_id"}}}},
    "AT": {"block": {"type": "math_number", "fields": {"NUM": "0"}}}
  }
}
```

### 数组赋值
```json
{
  "type": "list_set_index",
  "fields": {
    "MODE": "SET",
    "WHERE": "FROM_START"
  },
  "inputs": {
    "LIST": {"block": {"type": "variables_get", "fields": {"VAR": {"id": "myArray_id"}}}},
    "AT": {"block": {"type": "math_number", "fields": {"NUM": "1"}}},
    "TO": {"block": {"type": "math_number", "fields": {"NUM": "10"}}}
  }
}
```

### 二维数组操作
```json
{
  "type": "list2_get_value",
  "inputs": {
    "LIST": {"block": {"type": "variables_get", "fields": {"VAR": {"id": "matrix_id"}}}},
    "ROW": {"block": {"type": "math_number", "fields": {"NUM": "0"}}},
    "COL": {"block": {"type": "math_number", "fields": {"NUM": "1"}}}
  }
}
```

## 技术特性
- **多类型支持**: 支持12种基本数据类型
- **动态界面**: 可视化数组结构编辑，支持动态添加/删除元素
- **智能管理**: 自动处理变量作用域和重命名
- **类型安全**: 确保数组元素类型一致性
- **内存优化**: 根据作用域优化内存使用
- **扩展机制**: 支持动态变异器和序列化

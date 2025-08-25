# 数组 (Arrays) 核心库

Arduino/C++编程中的数组管理核心库，提供一维、二维数组创建、操作和管理功能。

## 库信息
- **库名**: @aily-project/lib-core-lists
- **版本**: 0.0.2
- **作者**: aily Project
- **描述**: 核心库，通常已经集成到初始模板中
- **兼容**: 所有开发板
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
- `TYPE`: 下拉选择 - 数据类型 ["整数", "无符号整数", "长整数", "无符号长整数", "短整数", "无符号短整数", "浮点数", "双精度浮点数", "字符", "无符号字符", "字符串", "字节"]
- `LENGTH`: 文本输入 - 数组长度 (默认: "3")
**值输入**:
- `INPUT0`: 数组输入 - 初始值 (检查类型: Array, String)
- `INPUT1`: 数组输入 - 可选的额外输入 (检查类型: Array, String)
**生成代码**:
```cpp
int list[3] = {1, 2, 3};
```
**自动添加**:
- 变量定义: 根据作用域自动添加到全局或局部

#### list_create_with_item
**类型**: 值块 (output: Array)
**描述**: 创建数组初始值，可动态设置长度和各个值，只能作为 `list_create_with` 的输入使用
**值输入**:
- `LENGTH`: 数字输入 - 数组长度
- 动态值输入: 根据长度自动生成 VALUE0, VALUE1, ... 输入项
**生成代码**:
```cpp
{1, 2, 3}
```

### 数组操作块

#### list_get_index
**类型**: 值块 (output: Number)
**描述**: 通过索引访问数组元素，索引从1开始
**字段**:
- `VAR`: 变量选择 - 数组变量 (变量类型: LISTS)
**值输入**:
- `AT`: 数字输入 - 索引位置
**生成代码**:
```cpp
list[index]  // 实际生成时索引会自动转换为从0开始
```

#### list_set_index
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 修改指定位置的数组值，索引从1开始
**字段**:
- `VAR`: 变量选择 - 数组变量 (变量类型: LISTS)
**值输入**:
- `AT`: 数字输入 - 索引位置 (检查类型: Number)
- `TO`: 任意输入 - 新值
**生成代码**:
```cpp
list[index] = value;
```

#### list_length
**类型**: 值块 (output: Number)
**描述**: 获取数组长度信息
**字段**:
- `VAR`: 变量选择 - 数组变量 (变量类型: LISTS)
**生成代码**:
```cpp
sizeof(list)/sizeof(list[0])
```

### 二维数组块

#### list2_get_value
**类型**: 值块 (output: null)
**描述**: 访问二维数组元素，索引从1开始
**字段**:
- `VAR`: 变量选择 - 二维数组变量 (变量类型: LISTS)
**值输入**:
- `ROW`: 数字输入 - 行索引 (检查类型: Number)
- `COL`: 数字输入 - 列索引 (检查类型: Number)
**生成代码**:
```cpp
matrix[row][col]  // 实际生成时索引会自动转换为从0开始
```

#### list2_set_value
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 修改二维数组元素值，索引从1开始
**字段**:
- `VAR`: 变量选择 - 二维数组变量 (变量类型: LISTS)
**值输入**:
- `ROW`: 数字输入 - 行索引 (检查类型: Number)
- `COL`: 数字输入 - 列索引 (检查类型: Number)
- `VALUE`: 任意输入 - 新值
**生成代码**:
```cpp
matrix[row][col] = value;
```

#### list2_get_length
**类型**: 值块 (output: Number)
**描述**: 获取二维数组长度信息
**字段**:
- `VAR`: 变量选择 - 二维数组变量 (变量类型: LISTS)
- `TYPE`: 下拉选择 - 维度 ["行数", "列数"]
**生成代码**:
```cpp
// 行数模式
sizeof(matrix)/sizeof(matrix[0])
// 列数模式
sizeof(matrix[0])/sizeof(matrix[0][0])
```

## .abi 文件生成规范

### 块连接规则
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段

### 工具箱默认配置
部分块在工具箱中预设了影子块：
- `list_create_with.INPUT0`: 默认 `list_create_with_item` 块，长度3，值为[1,2,3]
- `list_get_index.AT`: 默认数字 0
- `list_set_index.AT`: 默认数字 0
- `list_set_index.TO`: 默认数字 10
- `list2_get_value.ROW/COL`: 默认数字 0
- `list2_set_value.ROW/COL`: 默认数字 0
- `list2_set_value.VALUE`: 默认数字 10

### 变量管理
- 使用 `field_input` 创建新变量时，自动注册到Blockly系统，支持变量重命名
- 使用 `field_variable` 选择已存在的变量
- 变量类型为 `LISTS`，确保类型安全

### 动态输入块
- `list_create_with_item` 需要 `extraState` 字段记录输入数量
- 根据 `LENGTH` 输入动态调整 `VALUE0`, `VALUE1`, ... 输入项

## 使用示例

### 创建一维数组
```json
{
  "type": "list_create_with",
  "id": "create_array_id",
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
        "id": "array_item_id",
        "extraState": {
          "itemCount": 3
        },
        "inputs": {
          "LENGTH": {"block": {"type": "math_number", "id": "length_id", "fields": {"NUM": "3"}}},
          "VALUE0": {"block": {"type": "math_number", "id": "val0_id", "fields": {"NUM": "1"}}},
          "VALUE1": {"block": {"type": "math_number", "id": "val1_id", "fields": {"NUM": "2"}}},
          "VALUE2": {"block": {"type": "math_number", "id": "val2_id", "fields": {"NUM": "3"}}}
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
  "id": "get_index_id",
  "fields": {
    "VAR": {"id": "myArray_var_id"}
  },
  "inputs": {
    "AT": {"block": {"type": "math_number", "id": "index_id", "fields": {"NUM": "1"}}}
  }
}
```

### 数组赋值
```json
{
  "type": "list_set_index",
  "id": "set_index_id",
  "fields": {
    "VAR": {"id": "myArray_var_id"}
  },
  "inputs": {
    "AT": {"block": {"type": "math_number", "id": "index2_id", "fields": {"NUM": "1"}}},
    "TO": {"block": {"type": "math_number", "id": "value_id", "fields": {"NUM": "10"}}}
  }
}
```

### 二维数组操作
```json
{
  "type": "list2_get_value",
  "id": "get_2d_id",
  "fields": {
    "VAR": {"id": "matrix_var_id"}
  },
  "inputs": {
    "ROW": {"block": {"type": "math_number", "id": "row_id", "fields": {"NUM": "1"}}},
    "COL": {"block": {"type": "math_number", "id": "col_id", "fields": {"NUM": "2"}}}
  }
}
```

## 技术特性
- **多类型支持**: 支持12种基本数据类型（整数、浮点数、字符、字符串等）
- **动态界面**: 可视化数组结构编辑，支持动态添加/删除元素
- **智能管理**: 自动处理变量作用域和重命名
- **类型安全**: 确保数组元素类型一致性，变量类型为LISTS
- **索引转换**: 用户界面使用1开始的索引，自动转换为C++的0开始索引
- **扩展机制**: 支持动态变异器和序列化

## 注意事项
- 数组索引在用户界面中从1开始，但生成的C++代码从0开始
- 二维数组需要预先定义行列数
- 变量名必须符合C++命名规范
- 全局数组会占用更多内存，建议优先使用局部数组
- `list_create_with_item` 块只能作为 `list_create_with` 的输入使用

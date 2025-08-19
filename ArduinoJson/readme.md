# ArduinoJson

ArduinoJson库，支持JSON数据的解析和生成

## 库信息
- **库名**: @aily-project/lib-arduinojson
- **版本**: 1.0.0
- **作者**: aily Project
- **描述**: ArduinoJson库，支持JSON数据的解析和生成
- **兼容**: 通用（支持所有板卡）
- **电压**: 3.3V, 5V
- **测试者**: i3water
- **官方库**: https://arduinojson.org/

## Blockly 工具箱分类

### ArduinoJson
- `json_document_init` - 初始化JSON文档
- `json_document_deserialize_from_somewhere` - 从字符串反序列化JSON
- `json_document_serialize_to_somewhere` - 序列化JSON到变量
- `json_document_add_value` - 添加键值对
- `json_document_add_array` - 添加数组
- `json_document_add_array_value` - 向数组添加值
- `json_document_get_value` - 获取值
- `json_document_get_value_type` - 按类型获取值
- `json_document_get_array` - 获取数组元素

## 详细块定义

### ArduinoJson块

#### json_document_init
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 初始化JSON文档对象
**字段**:
- `NAME`: 文档名称 - 文本输入 (默认: doc)
**生成代码**:
```cpp
JsonDocument doc;
```
**自动添加**:
- 库引用: `#include <ArduinoJson.h>`

#### json_document_deserialize_from_somewhere
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 从JSON字符串反序列化到文档对象
**字段**:
- `VAR`: JSON文档 - 变量选择 (类型: JsonDocument)
**值输入**:
- `INPUT`: JSON字符串 - 字符串输入
**生成代码**:
```cpp
deserializeJson(doc, jsonString);
```

#### json_document_serialize_to_somewhere
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 将JSON文档序列化到指定变量
**字段**:
- `VAR`: JSON文档 - 变量选择 (类型: JsonDocument)
**值输入**:
- `OUTPUT`: 输出变量 - 变量输入
**生成代码**:
```cpp
serializeJson(doc, output);
```

#### json_document_add_value
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 向JSON文档添加键值对，支持路径访问
**字段**:
- `VAR`: JSON文档 - 变量选择 (类型: JsonDocument)
- `KEY`: 键名 - 文本输入 (默认: key)
**值输入**:
- `VALUE`: 值 - 数字或字符串输入
**生成代码**:
```cpp
doc["key"] = value;
// 或路径访问: doc["data"][0]["name"] = value;
```

#### json_document_add_array
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 向JSON文档添加数组
**字段**:
- `VAR`: JSON文档 - 变量选择 (类型: JsonDocument)
- `ARRAY_NAME`: 数组名称 - 文本输入 (默认: array)
**生成代码**:
```cpp
JsonArray array = doc["array"].to<JsonArray>();
```
**自动添加**:
- 变量定义: `JsonArray array;`

#### json_document_add_array_value
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 向指定数组添加值
**字段**:
- `ARRAY_VAR`: 数组变量 - 变量选择 (类型: JsonArray)
**值输入**:
- `VALUE`: 值 - 数字输入
**生成代码**:
```cpp
array.add(value);
```

#### json_document_get_value
**类型**: 值块 (output: ["Number", "String"])
**描述**: 从JSON文档获取指定键的值
**字段**:
- `VAR`: JSON文档 - 变量选择 (类型: JsonDocument)
- `KEY`: 键名 - 文本输入 (默认: key)
**生成代码**:
```cpp
doc["key"]
```

#### json_document_get_value_type
**类型**: 值块 (output: ["String"])
**描述**: 按指定类型从JSON文档获取值
**字段**:
- `VAR`: JSON文档 - 变量选择 (类型: JsonDocument)
- `KEY`: 键名 - 文本输入 (默认: key)
- `TYPE`: 数据类型 - 下拉选择 (布尔值/整数/字符串/JSON数组)
**生成代码**:
```cpp
doc["key"].as<bool>()
doc["key"].as<int>()
doc["key"].as<const char*>()
doc["key"].as<JsonArrayConst>()
```

#### json_document_get_array
**类型**: 值块 (output: ["Number", "String"])
**描述**: 获取JSON数组中指定索引的元素
**字段**:
- `VAR`: JSON文档 - 变量选择 (类型: JsonDocument)
- `KEY`: 数组键名 - 文本输入 (默认: array)
**值输入**:
- `INDEX`: 数组索引 - 数字输入
**生成代码**:
```cpp
doc["array"][index]
```

## .abi 文件生成规范

### 块连接规则
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段

### 工具箱默认配置
部分块预设了影子块：
- `json_document_deserialize_from_somewhere.INPUT`: 默认JSON字符串 `{"hello": "world"}`
- `json_document_serialize_to_somewhere.OUTPUT`: 默认变量 `output`
- `json_document_add_value.VALUE`: 默认文本 `value`
- `json_document_add_array_value.VALUE`: 默认数字 `100`
- `json_document_get_array.INDEX`: 默认索引 `0`

### 变量管理
- JSON文档对象自动创建: `JsonDocument varName;`
- JSON数组对象自动创建: `JsonArray arrayName;`
- 支持变量类型约束: `JsonDocument` 和 `JsonArray`
- 自动注册变量到Blockly系统

### 路径支持
支持复杂的JSON路径访问：
- 简单键: `"sensor"`
- 数组索引: `"data[0]"`
- 嵌套路径: `"data[0].name"`

## 使用示例

### 创建和解析JSON
```json
{
  "type": "json_document_init",
  "fields": {"NAME": "doc"}
}
```

### 添加数据
```json
{
  "type": "json_document_add_value",
  "fields": {"VAR": "doc", "KEY": "temperature"},
  "inputs": {
    "VALUE": {"shadow": {"type": "math_number", "fields": {"NUM": 25.6}}}
  }
}
```

### 获取数据
```json
{
  "type": "json_document_get_value_type",
  "fields": {"VAR": "doc", "KEY": "temperature", "TYPE": "float"}
}
```

## 技术特性
- **完整JSON支持**: 支持对象、数组、嵌套结构
- **类型安全**: 提供类型转换和验证
- **路径访问**: 支持复杂的JSON路径操作
- **内存优化**: 基于ArduinoJson库的高效内存管理
- **变量管理**: 自动处理JSON文档和数组变量
- **智能代码生成**: 根据使用场景生成优化的C++代码

## 注意事项
- JSON文档需要先初始化才能使用
- 数组操作需要先创建数组对象
- 路径访问支持点号和方括号语法
- 类型转换需要匹配实际数据类型
- 内存使用取决于JSON数据的复杂度

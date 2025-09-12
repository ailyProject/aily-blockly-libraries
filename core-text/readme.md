# 文本操作 (Text Operations) 核心库

Arduino/C++编程中的文本处理核心库，提供字符串操作、字符处理和类型转换功能。

## 库信息
- **库名**: @aily-project/lib-core-text
- **版本**: 0.0.1
- **作者**: aily Project
- **描述**: 文本相关函数
- **兼容**: 所有开发板
- **电压**: 3.3V、5V

## Blockly 工具箱分类

### Text
- `char` - 字符常量
- `text` - 文本常量
- `string_add_string` - 字符串连接
- `string_charAt` - 获取字符
- `string_to_something` - 字符串转换
- `string_length` - 字符串长度
- `string_indexOf` - 查找位置
- `string_substring` - 子字符串
- `string_find_str` - 查找字符串
- `string_startsWith` - 开头检查
- `string_endsWith` - 结尾检查
- `number_to` - 数字转换
- `toascii` - ASCII转换
- `number_to_string` - 数字转字符串
- `text_join` - 文本连接
- `text_append` - 文本追加
- `text_length` - 文本长度
- `text_isEmpty` - 空文本检查
- `text_indexOf` - 文本查找
- `text_charAt` - 文本字符
- `tt_getSubstring` - 获取子字符串
- `text_changeCase` - 大小写转换
- `text_trim` - 文本修剪
- `text_count` - 文本计数
- `text_replace` - 文本替换
- `text_reverse` - 文本反转

## 详细块定义

### 基础文本块

#### text
**类型**: 值块 (output: String)
**描述**: 创建字符串常量，用双引号包围
**字段**:
- `TEXT`: 文本输入 - 字符串内容 (默认: "")
**生成代码**: `"Hello World"`

#### char
**类型**: 值块 (output: String)
**描述**: 创建单字符常量，支持转义字符
**字段**:
- `CHAR`: 文本输入 - 字符内容 (默认: "A")
**生成代码**: `'A'`
**支持转义字符**: `\n`, `\t`, `\r`, `\\`, `\'`, `\"`, `\0`

### 字符串操作块

#### string_add_string
**类型**: 值块 (output: String)
**描述**: 连接两个字符串
**值输入**:
- `STRING1`: 字符串输入 - 第一个字符串
- `STRING2`: 字符串输入 - 第二个字符串
**生成代码**: `String("hello") + String("world")`
**工具箱默认**: STRING1="hello", STRING2="world"

#### string_charAt
**类型**: 值块 (output: String)
**描述**: 获取字符串指定位置的字符
**值输入**:
- `STRING`: 字符串输入 - 目标字符串
- `NUM`: 数字输入 - 字符位置 (从1开始)
**生成代码**: `String("hello").charAt(0)`
**工具箱默认**: STRING="hello", NUM=1

#### string_length
**类型**: 值块 (output: Number)
**描述**: 获取字符串长度
**值输入**:
- `STRING`: 字符串输入 - 目标字符串
**生成代码**: `String("world").length()`
**工具箱默认**: STRING="world"

#### string_indexOf
**类型**: 值块 (output: Number)
**描述**: 查找子字符串在字符串中的位置
**值输入**:
- `STRING1`: 字符串输入 - 目标字符串
- `STRING2`: 字符串输入 - 查找的子字符串
**生成代码**: `String("hello, world").indexOf("hello")`
**返回值**: 位置索引 (从0开始)，未找到返回-1
**工具箱默认**: STRING1="hello, world", STRING2="hello"

#### string_substring
**类型**: 值块 (output: String)
**描述**: 提取子字符串
**值输入**:
- `STRING`: 字符串输入 - 目标字符串
- `START_INDEX`: 数字输入 - 起始位置 (从1开始)
- `LAST_INDEX`: 数字输入 - 结束位置 (从1开始)
**生成代码**: `String("apple").substring(0, 3)`
**工具箱默认**: STRING="apple", START_INDEX=1, LAST_INDEX=3

#### string_find_str
**类型**: 值块 (output: Boolean)
**描述**: 检查字符串是否包含指定子字符串
**值输入**:
- `STRING1`: 字符串输入 - 目标字符串
- `STRING2`: 字符串输入 - 查找的子字符串
**生成代码**: `(String("apple").indexOf("ap") >= 0)`
**工具箱默认**: STRING1="apple", STRING2="ap"

#### string_startsWith
**类型**: 值块 (output: Boolean)
**描述**: 检查字符串是否以指定前缀开头
**值输入**:
- `TEXT`: 字符串输入 - 目标字符串
- `PREFIX`: 字符串输入 - 前缀字符串
**生成代码**: `String("abc").startsWith("")`
**工具箱默认**: TEXT="abc", PREFIX=""

#### string_endsWith
**类型**: 值块 (output: Boolean)
**描述**: 检查字符串是否以指定后缀结尾
**值输入**:
- `TEXT`: 字符串输入 - 目标字符串
- `SUFFIX`: 字符串输入 - 后缀字符串
**生成代码**: `String("abc").endsWith("")`
**工具箱默认**: TEXT="abc", SUFFIX=""

### 类型转换块

#### string_to_something
**类型**: 值块 (output: Any)
**描述**: 将字符串转换为其他类型
**字段**:
- `TYPE`: 下拉选择 - 转换类型 ["toInt", "toLong", "toFloat", "toDouble", "c_str", "charAt0", "toUpper", "toLower"]
**值输入**:
- `TEXT`: 字符串输入 - 待转换的字符串
**生成代码**:
- `toInt`: `String("123").toInt()`
- `toLong`: `atol(String("123").c_str())`
- `toFloat`: `String("3.14").toFloat()`
- `toDouble`: `atof(String("3.14").c_str())`
- `c_str`: `String("123").c_str()`
- `charAt0`: `String("123").charAt(0)`
- `toUpper`: `String("abc").toUpperCase()` (就地修改)
- `toLower`: `String("ABC").toLowerCase()` (就地修改)
**工具箱默认**: TEXT="123"

#### number_to
**类型**: 值块 (output: String)
**描述**: 数字转换为字符串
**字段**:
- `TYPE`: 下拉选择 - 转换类型 ["toString", "toHex", "toBin", "toOct"]
**值输入**:
- `NUM`: 数字输入 - 待转换的数字
**生成代码**:
- `toString`: `String(123)`
- `toHex`: `String(123, HEX)`
- `toBin`: `String(123, BIN)`
- `toOct`: `String(123, OCT)`

#### toascii
**类型**: 值块 (output: Number)
**描述**: 获取字符的ASCII码值
**值输入**:
- `CHAR`: 字符输入 - 目标字符
**生成代码**: `(int)'A'`

#### number_to_string
**类型**: 值块 (output: String)
**描述**: 数字转换为字符串
**值输入**:
- `NUM`: 数字输入 - 待转换的数字
**生成代码**: `String(0)`
**工具箱默认**: NUM=0

### 高级文本操作块

#### text_join
**类型**: 值块 (output: String)
**描述**: 连接多个文本元素，支持动态添加多个文本输入
**动态输入**: ADD0, ADD1, ADD2, ... - 根据需要动态生成
**生成代码**:
```cpp
String("") + element1 + element2 + ...
```
**扩展**: 使用 `text_join_mutator` 动态管理输入

#### text_append
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 向变量追加文本
**字段**:
- `VAR`: 变量选择器 - 目标变量
**值输入**:
- `TEXT`: 字符串输入 - 追加的文本
**生成代码**: `variable += "text";`
**工具箱默认**: TEXT为空文本影子块

#### text_length
**类型**: 值块 (output: Number)
**描述**: 获取文本长度
**值输入**:
- `VALUE`: 字符串输入 - 目标文本
**生成代码**: `String("abc").length()`
**工具箱默认**: VALUE="abc"

#### text_isEmpty
**类型**: 值块 (output: Boolean)
**描述**: 检查文本是否为空
**值输入**:
- `VALUE`: 字符串输入 - 目标文本
**生成代码**: `(String("").length() == 0)`
**工具箱默认**: VALUE=""

#### text_indexOf
**类型**: 值块 (output: Number)
**描述**: 查找子字符串位置
**字段**:
- `END`: 下拉选择 - 查找方向 ["FIRST", "LAST"]
**值输入**:
- `VALUE`: 字符串输入 - 目标字符串
- `FIND`: 字符串输入 - 查找的子字符串
**生成代码**:
- FIRST: `String(text).indexOf("abc")`
- LAST: `String(text).lastIndexOf("abc")`
**工具箱默认**: VALUE=变量"text", FIND="abc"

#### text_charAt
**类型**: 值块 (output: String)
**描述**: 获取指定位置的字符
**字段**:
- `WHERE`: 下拉选择 - 位置模式 ["FROM_START", "FROM_END", "FIRST", "LAST", "RANDOM"]
**值输入**:
- `VALUE`: 字符串输入 - 目标字符串
- `AT`: 数字输入 - 位置索引 (当WHERE为FROM_START/FROM_END时)
**生成代码**: 根据位置模式生成相应代码
**工具箱默认**: VALUE=变量"text"

#### tt_getSubstring
**类型**: 值块 (output: String)
**描述**: 获取子字符串，支持多种位置模式
**值输入**:
- `STRING`: 字符串输入 - 目标字符串
- `AT1`: 数字输入 - 起始位置 (动态显示，根据位置模式)
- `AT2`: 数字输入 - 结束位置 (动态显示，根据位置模式)
**生成代码**:
```cpp
String(text).substring(start, end)  // 根据位置模式生成
```
**扩展**: 使用 `text_getSubstring_mutator` 动态管理输入
**工具箱默认**: STRING=变量"text"

#### text_changeCase
**类型**: 值块 (output: String)
**描述**: 转换文本大小写
**字段**:
- `CASE`: 下拉选择 - 转换类型 ["UPPERCASE", "LOWERCASE", "TITLECASE"]
**值输入**:
- `TEXT`: 字符串输入 - 目标文本
**生成代码**:
- UPPERCASE: `String("abc").toUpperCase()`
- LOWERCASE: `String("ABC").toLowerCase()`
- TITLECASE: 生成首字母大写的辅助函数
**工具箱默认**: TEXT="abc"

#### text_trim
**类型**: 值块 (output: String)
**描述**: 去除文本首尾空白字符
**字段**:
- `MODE`: 下拉选择 - 修剪模式 ["BOTH", "LEFT", "RIGHT"]
**值输入**:
- `TEXT`: 字符串输入 - 目标文本
**生成代码**: 生成相应的修剪函数
**工具箱默认**: TEXT="abc"

#### text_count
**类型**: 值块 (output: Number)
**描述**: 统计子字符串出现次数
**值输入**:
- `TEXT`: 字符串输入 - 目标文本
- `SUB`: 字符串输入 - 子字符串
**生成代码**: 生成计数辅助函数
**工具箱默认**: TEXT和SUB为空文本影子块

#### text_replace
**类型**: 值块 (output: String)
**描述**: 替换文本中的子字符串
**值输入**:
- `TEXT`: 字符串输入 - 目标文本
- `FROM`: 字符串输入 - 被替换的子字符串
- `TO`: 字符串输入 - 替换为的字符串
**生成代码**: 生成替换辅助函数
**工具箱默认**: TEXT、FROM、TO为空文本影子块

#### text_reverse
**类型**: 值块 (output: String)
**描述**: 反转字符串
**值输入**:
- `TEXT`: 字符串输入 - 目标文本
**生成代码**: 生成字符串反转辅助函数
**工具箱默认**: TEXT为空文本影子块

## .abi 文件生成规范

### 块连接规则
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段

### 工具箱默认配置
- `string_add_string.STRING1`: 默认文本 "hello"
- `string_add_string.STRING2`: 默认文本 "world"
- `string_charAt.STRING`: 默认文本 "hello"
- `string_charAt.NUM`: 默认数字 1
- `string_to_something.TEXT`: 默认文本 "123"
- `string_length.STRING`: 默认文本 "world"
- `string_indexOf.STRING1`: 默认文本 "hello, world"
- `string_indexOf.STRING2`: 默认文本 "hello"
- `string_substring.STRING`: 默认文本 "apple"
- `string_substring.START_INDEX`: 默认数字 1
- `string_substring.LAST_INDEX`: 默认数字 3
- `string_find_str.STRING1`: 默认文本 "apple"
- `string_find_str.STRING2`: 默认文本 "ap"
- `string_startsWith.TEXT`: 默认文本 "abc"
- `string_startsWith.PREFIX`: 默认空文本
- `string_endsWith.TEXT`: 默认文本 "abc"
- `string_endsWith.SUFFIX`: 默认空文本
- `number_to_string.NUM`: 默认数字 0
- `text_append.TEXT`: 默认空文本影子块
- `text_length.VALUE`: 默认文本 "abc"
- `text_isEmpty.VALUE`: 默认空文本
- `text_indexOf.VALUE`: 默认变量 "text"
- `text_indexOf.FIND`: 默认文本 "abc"
- `text_charAt.VALUE`: 默认变量 "text"
- `tt_getSubstring.STRING`: 默认变量 "text"
- `text_changeCase.TEXT`: 默认文本 "abc"
- `text_trim.TEXT`: 默认文本 "abc"
- `text_count.SUB`: 默认空文本影子块
- `text_count.TEXT`: 默认空文本影子块
- `text_replace.FROM`: 默认空文本影子块
- `text_replace.TO`: 默认空文本影子块
- `text_replace.TEXT`: 默认空文本影子块
- `text_reverse.TEXT`: 默认空文本影子块

### 变量管理
- 使用 `field_input` 创建新变量时，自动注册到Blockly系统，支持变量重命名
- 使用 `field_variable` 选择已存在的变量

### 动态输入块
- `text_join` 需要 `extraState` 字段记录输入数量，使用 `text_join_mutator` 动态管理多个文本输入
- `tt_getSubstring` 使用 `text_getSubstring_mutator` 动态管理位置输入
- `text_charAt` 使用 `text_charAt_mutator` 动态管理位置输入
- 支持序列化和反序列化动态输入结构

### 辅助函数生成
复杂的文本操作会自动生成辅助函数：
- 首字母大写转换
- 文本修剪 (左、右、两端)
- 子字符串计数
- 文本替换
- 字符串反转

## 使用示例

### 基本字符串操作
```json
{
  "type": "string_add_string",
  "id": "string_add_id",
  "inputs": {
    "STRING1": {"shadow": {"type": "text", "id": "str1_shadow_id", "fields": {"TEXT": "Hello"}}},
    "STRING2": {"shadow": {"type": "text", "id": "str2_shadow_id", "fields": {"TEXT": " World"}}}
  }
}
```

### 字符串转换
```json
{
  "type": "string_to_something",
  "id": "string_convert_id",
  "fields": {"TYPE": "toInt"},
  "inputs": {
    "TEXT": {"shadow": {"type": "text", "id": "convert_shadow_id", "fields": {"TEXT": "123"}}}
  }
}
```

### 子字符串提取
```json
{
  "type": "string_substring",
  "id": "substring_id",
  "inputs": {
    "STRING": {"shadow": {"type": "text", "id": "substr_text_id", "fields": {"TEXT": "apple"}}},
    "START_INDEX": {"shadow": {"type": "math_number", "id": "start_id", "fields": {"NUM": "1"}}},
    "LAST_INDEX": {"shadow": {"type": "math_number", "id": "end_id", "fields": {"NUM": "3"}}}
  }
}
```

### 文本查找
```json
{
  "type": "text_indexOf",
  "id": "indexof_id",
  "fields": {"END": "FIRST"},
  "inputs": {
    "VALUE": {"block": {"type": "variables_get", "id": "var_get_id", "fields": {"VAR": {"id": "text_var"}}}},
    "FIND": {"shadow": {"type": "text", "id": "find_shadow_id", "fields": {"TEXT": "abc"}}}
  }
}
```

### 大小写转换
```json
{
  "type": "text_changeCase",
  "id": "changecase_id",
  "fields": {"CASE": "UPPERCASE"},
  "inputs": {
    "TEXT": {"shadow": {"type": "text", "id": "text_shadow_id", "fields": {"TEXT": "hello"}}}
  }
}
```

### 动态文本连接
```json
{
  "type": "text_join",
  "id": "text_join_id",
  "extraState": {
    "itemCount": 3
  },
  "inputs": {
    "ADD0": {"block": {"type": "text", "id": "text1_id", "fields": {"TEXT": "Hello"}}},
    "ADD1": {"block": {"type": "text", "id": "text2_id", "fields": {"TEXT": " "}}},
    "ADD2": {"block": {"type": "text", "id": "text3_id", "fields": {"TEXT": "World"}}}
  }
}
```

## 技术特性
- **Arduino兼容**: 基于Arduino String类实现
- **自动代码生成**: 复杂操作自动生成辅助函数
- **类型安全**: 支持多种数据类型转换
- **动态扩展**: 支持动态输入管理和序列化
- **多语言支持**: 支持多种界面语言
- **丰富功能**: 涵盖字符串操作的各个方面
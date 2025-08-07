# 文本操作 (Text Operations) 核心库

Arduino/C++编程中的文本处理核心库，提供字符串操作、字符处理和类型转换功能。

## 库信息
- **库名**: @aily-project/lib-core-text
- **版本**: 0.0.1
- **作者**: aily Project
- **描述**: 文本相关函数

## 可用模块

### 基础文本
- **文本** (`text`): 创建字符串常量，用双引号包围
- **字符** (`char`): 创建单字符常量，支持转义字符（\n, \t, \r, \\, \', \", \0）

### 字符串操作
- **字符串连接** (`string_add_string`): 连接两个字符串，格式：String(A) + String(B)
- **获取字符** (`string_charAt`): 获取字符串指定位置的字符
- **数组元素** (`array_get_dataAt`): 获取数组指定索引的元素

### 字符串检查
- **开头检查** (`string_startsWith`): 检查字符串是否以指定前缀开头
- **结尾检查** (`string_endsWith`): 检查字符串是否以指定后缀结尾

### 类型转换
**字符串转换** (`string_to_something`): 将字符串转换为其他类型
- **toInt**: 转为整数
- **toLong**: 转为长整数（使用atol函数）
- **toFloat**: 转为浮点数
- **toDouble**: 转为双精度（使用atof函数）
- **c_str**: 转为C字符串指针
- **charAt0**: 获取首字符
- **toUpper**: 转为大写（就地修改）
- **toLower**: 转为小写（就地修改）

### 高级文本操作
- **文本连接** (`text_join`): 连接多个文本元素
- **文本追加** (`text_append`): 向变量追加文本
- **子字符串** (`text_getSubstring`): 提取子字符串，支持多种位置模式
- **查找文本** (`text_indexOf`): 查找子字符串位置
- **文本长度** (`text_length`): 获取字符串长度
- **文本为空** (`text_isEmpty`): 检查字符串是否为空
- **文本修剪** (`text_trim`): 去除首尾空白字符
- **大小写转换** (`text_changeCase`): 转换文本大小写
- **文本计数** (`text_count`): 统计子字符串出现次数
- **文本替换** (`text_replace`): 替换文本中的子字符串
- **文本反转** (`text_reverse`): 反转字符串

## 使用说明

### 基础用法
```cpp
// 创建文本和字符
String myText = "Hello";
char myChar = 'A';

// 字符串连接
String result = String("Hello") + String(" World");

// 类型转换
int number = "123".toInt();
float decimal = "3.14".toFloat();
```

### 字符转义
字符块支持常用转义字符：
- `\n`: 换行符
- `\t`: 制表符
- `\r`: 回车符
- `\\`: 反斜杠
- `\'`: 单引号
- `\"`: 双引号
- `\0`: 空字符

### 高级操作
库提供了丰富的字符串处理函数，包括查找、替换、修剪、计数等，这些函数会自动生成相应的Arduino C++代码。

## 注意事项
- 字符串操作基于Arduino String类
- 类型转换可能失败，需要验证输入格式
- 大小写转换操作会就地修改原字符串
- 数组访问需要注意索引范围

## 技术特性
- **Arduino兼容**: 基于Arduino String类实现
- **自动代码生成**: 复杂操作自动生成辅助函数
- **类型安全**: 支持多种数据类型转换
- **多语言支持**: 支持多种界面语言
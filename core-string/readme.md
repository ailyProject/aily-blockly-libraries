# 字符串操作 (String Operations) 核心库

Arduino/C++编程中的字符串操作核心库，提供字符串和字符的创建、操作和处理功能。

## 库信息
- **库名**: @aily-project/lib-core-string
- **版本**: 0.0.1
- **作者**: aily Project
- **描述**: 核心库，通常已经集成到初始模板中

## 可用模块

### 变量创建
- **创建字符串变量** (`string_create`): 创建String类型变量并赋值
- **创建字符变量** (`string_char_create`): 创建char类型变量并赋值

### 字面量
- **文本字面量** (`string_literal`): 创建字符串常量
- **字符字面量** (`string_char_literal`): 创建字符常量

### 基础操作
- **获取字符串** (`string_get`): 获取字符串变量的值
- **字符串长度** (`string_length`): 获取字符串长度，调用 `.length()`
- **字符串连接** (`string_concat`): 连接两个字符串，格式：String(A) + String(B)

### 字符操作
- **获取字符** (`string_char_at`): 获取指定位置的字符，调用 `.charAt(index)`
- **子字符串** (`string_substring`): 提取子字符串，调用 `.substring(start, end)`

### 查找功能
- **查找位置** (`string_index_of`): 查找子字符串位置，调用 `.indexOf()`

### 比较功能
- **字符串相等** (`string_equals`): 比较两个字符串是否相等
- **开头检查** (`string_starts_with`): 检查是否以指定字符串开头，调用 `.startsWith()`
- **结尾检查** (`string_ends_with`): 检查是否以指定字符串结尾，调用 `.endsWith()`

### 转换功能
- **转大写** (`string_to_upper`): 转换为大写，调用 `.toUpperCase()`
- **转小写** (`string_to_lower`): 转换为小写，调用 `.toLowerCase()`
- **替换** (`string_replace`): 替换字符串内容，调用 `.replace()`

## 使用说明

### 基本用法
```cpp
// 创建字符串变量
String myStr = "Hello";

// 字符串连接
String result = String("Hello") + String(" World");

// 获取长度
int len = myStr.length();

// 获取字符
char ch = myStr.charAt(0);

// 子字符串
String sub = myStr.substring(1, 4);
```

### 字符串比较
```cpp
// 相等比较
bool isEqual = (str1 == str2);

// 开头检查
bool startsWithHello = myStr.startsWith("Hello");

// 结尾检查
bool endsWithWorld = myStr.endsWith("World");
```

### 字符串转换
```cpp
// 转大写
String upper = myStr.toUpperCase();

// 转小写
String lower = myStr.toLowerCase();

// 替换内容
String replaced = myStr.replace("Hello", "Hi");
```

### 查找功能
```cpp
// 查找子字符串位置
int pos = myStr.indexOf("llo");
if (pos != -1) {
  // 找到了
}
```

## 注意事项
- String类型会自动管理内存，但可能产生内存碎片
- 字符串索引从0开始
- 字符变量只能存储单个字符
- 大量字符串操作可能影响性能
- 注意字符串长度限制

## 技术特性
- **Arduino兼容**: 基于Arduino String类实现
- **自动类型转换**: 支持数字到字符串的自动转换
- **变量管理**: 自动处理变量声明和作用域
- **类型安全**: 区分String和char类型
- **内存管理**: 自动处理字符串内存分配

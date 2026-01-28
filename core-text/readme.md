# core-text

文本操作与字符串处理核心库

## 库信息
- **库名**: @aily-project/lib-core-text
- **版本**: 0.0.1
- **兼容**: Arduino全系列平台

## 块定义

| 块类型 | 功能描述 | 输入/字段 | 生成代码示例 |
|--------|----------|----------|-------------|
| `text` | 文本字符串 | TEXT(field_input) | `"hello"` |
| `char` | 单个字符 | CHAR(field_input) | `'A'` |
| `string_add_string` | 字符串拼接 | STRING1, STRING2(input_value) | `String(str1) + String(str2)` |
| `text_join` | 多文本合并 | 动态输入(mutator) | `String(a) + String(b) + ...` |
| `text_length` | 获取长度 | VALUE(input_value) | `String(str).length()` |
| `text_isEmpty` | 判断是否为空 | VALUE(input_value) | `String(str).length() == 0` |
| `text_charAt` | 获取指定字符 | VALUE(input_value), WHERE(dropdown), AT(input_value) | `String(str).charAt(index)` |
| `tt_getSubstring` | 获取子串 | STRING(input_value), WHERE1/WHERE2(dropdown), AT1_VALUE/AT2_VALUE(input_value) | `String(str).substring(start, end)` |
| `text_indexOf` | 查找文本位置 | VALUE, FIND(input_value), END(dropdown) | `String(str).indexOf(find)` / `String(str).lastIndexOf(find)` |
| `string_startsWith` | 检查前缀 | TEXT, PREFIX(input_value) | `String(str).startsWith(prefix)` |
| `string_endsWith` | 检查后缀 | TEXT, SUFFIX(input_value) | `String(str).endsWith(suffix)` |
| `text_changeCase` | 大小写转换 | TEXT(input_value), CASE(dropdown) | `textToUpper(str)` / `textToLower(str)` / `textToTitleCase(str)` |
| `text_trim` | 去除空格 | TEXT(input_value), MODE(dropdown) | `textTrim(str)` / `textTrimLeft(str)` / `textTrimRight(str)` |
| `text_replace` | 替换文本 | TEXT, FROM, TO(input_value) | `textReplaceAll(text, from, to)` |
| `text_reverse` | 反转文本 | TEXT(input_value) | `textReverse(text)` |
| `text_count` | 计算出现次数 | SUB, TEXT(input_value) | `textCount(text, sub)` |
| `number_to` | 数字转ASCII字符 | NUM(input_value) | `char(65)` → `'A'` |
| `toascii` | 字符转ASCII数值 | CHAR(input_value) | `(int)('A')` → `65` |
| `number_to_string` | 数字转字符串 | NUM(input_value) | `String(123)` |
| `string_to_something` | 字符串类型转换 | TEXT(input_value), TYPE(dropdown) | `String(str).toInt()` / `textToUpper(str)` |
| `array_get_dataAt` | 获取数组元素 | ARRAY, INDEX(input_value) | `array[index]` |

## 技术说明

### String() 包装机制

本库所有生成的代码都使用 `String()` 包装输入值，以确保兼容 Arduino 中的两种字符串类型：

| 类型 | 说明 | 示例 |
|------|------|------|
| `const char*` | C风格字符串字面量 | `"hello"` |
| `String` | Arduino String 对象 | `String myStr = "hello";` |

**为什么需要包装？**

在 Arduino 中，`"hello"` 是 `const char*` 类型，没有 `.charAt()`、`.length()` 等方法。直接调用会导致编译错误：
```cpp
// ❌ 错误：const char* 没有 charAt 方法
"hello".charAt(0)

// ✅ 正确：String 对象有 charAt 方法
String("hello").charAt(0)
```

### 自动生成的辅助函数

部分块会自动添加辅助函数到代码顶部：

| 函数名 | 用途 |
|--------|------|
| `textToUpper(String text)` | 大写转换 |
| `textToLower(String text)` | 小写转换 |
| `textToTitleCase(String text)` | 首字母大写 |
| `textTrim(String text)` | 两端去空格 |
| `textTrimLeft(String text)` | 左侧去空格 |
| `textTrimRight(String text)` | 右侧去空格 |
| `textReplaceAll(String text, String from, String to)` | 全部替换 |
| `textReverse(String text)` | 反转文本 |
| `textCount(String text, String sub)` | 计数子串 |
| `textRandomLetter(String text)` | 随机字符 |

## 下拉选项说明

### text_charAt - WHERE选项
| 选项 | 值 | 说明 | 是否显示AT输入 |
|------|-----|------|---------------|
| 获取第#个字符 | FROM_START | 从开头计数 | ✅ 是 |
| 获取倒数第#个字符 | FROM_END | 从末尾计数 | ✅ 是 |
| 获取第一个字符 | FIRST | 第一个字符 | ❌ 否 |
| 获取最后一个字符 | LAST | 最后一个字符 | ❌ 否 |
| 获取随机一个字符 | RANDOM | 随机字符 | ❌ 否 |

### tt_getSubstring - WHERE1/WHERE2选项
| 选项 | 值 | 说明 | 是否显示输入 |
|------|-----|------|--------------|
| 从第#个字符 / 到第#个字符 | FROM_START | 从开头计数 | ✅ 是 |
| 从倒数第#个字符 / 到倒数第#个字符 | FROM_END | 从末尾计数 | ✅ 是 |
| 从第一个字符 | FIRST | 起始位置 | ❌ 否 |
| 到最后一个字符 | LAST | 结束位置 | ❌ 否 |

### text_indexOf - END选项
| 选项 | 值 | 说明 |
|------|-----|------|
| 寻找第一次 | FIRST | 首次出现位置 |
| 寻找最后一次 | LAST | 最后出现位置 |

### text_changeCase - CASE选项
| 选项 | 值 | 说明 |
|------|-----|------|
| 转为大写 | UPPERCASE | 全部大写 |
| 转为小写 | LOWERCASE | 全部小写 |
| 转为首字母大写 | TITLECASE | 首字母大写 |

### text_trim - MODE选项
| 选项 | 值 | 说明 |
|------|-----|------|
| 消除其两侧的空格 | BOTH | 两端去空格 |
| 消除其左侧的空格 | LEFT | 左侧去空格 |
| 消除其右侧的空格 | RIGHT | 右侧去空格 |

### string_to_something - TYPE选项
| 选项 | 值 | 生成代码 |
|------|-----|----------|
| 整数 (int) | toInt | `String(str).toInt()` |
| 长整数 (long) | toLong | `atol(String(str).c_str())` |
| 浮点数 (float) | toFloat | `String(str).toFloat()` |
| 双精度 (double) | toDouble | `atof(String(str).c_str())` |
| C字符串 (char*) | c_str | `String(str).c_str()` |
| 首字符 (char) | charAt0 | `String(str).charAt(0)` |
| 大写字符串 | toUpper | `textToUpper(str)` |
| 小写字符串 | toLower | `textToLower(str)` |

## 特殊说明

### char块支持的转义字符
| 输入 | 含义 | 生成代码 |
|------|------|----------|
| `\n` | 换行符 | `'\n'` |
| `\t` | 制表符 | `'\t'` |
| `\r` | 回车符 | `'\r'` |
| `\\` | 反斜杠 | `'\\'` |
| `\'` | 单引号 | `'\''` |
| `\"` | 双引号 | `'"'` |
| `\0` | 空字符 | `'\0'` |

### Mutator 机制

#### text_join
通过 `text_join_mutator`（Blockly内置）动态控制输入数量。使用 `extraState.itemCount` 设置输入数量，动态添加 ADD0, ADD1, ADD2... 输入。

#### text_charAt
通过 `text_charAt_mutator`（Blockly内置）根据下拉选项动态显示/隐藏数字输入框（AT输入）。

#### tt_getSubstring
通过 `text_getSubstring_mutator`（本库自定义实现）根据下拉选项动态显示/隐藏 AT1_VALUE 和 AT2_VALUE 输入框。

## 使用示例

### 字符串拼接
```json
{
  "type": "string_add_string",
  "inputs": {
    "STRING1": {"shadow": {"type": "text", "fields": {"TEXT": "Hello "}}},
    "STRING2": {"shadow": {"type": "text", "fields": {"TEXT": "World!"}}}
  }
}
```
生成代码: `String("Hello ") + String("World!")`

### ASCII转换
```json
{
  "type": "number_to",
  "inputs": {
    "NUM": {"shadow": {"type": "math_number", "fields": {"NUM": 65}}}
  }
}
```
生成代码: `char(65)` → 输出字符 `'A'`

```json
{
  "type": "toascii",
  "inputs": {
    "CHAR": {"shadow": {"type": "char", "fields": {"CHAR": "A"}}}
  }
}
```
生成代码: `(int)('A')` → 输出数值 `65`

### 字符串类型转换
```json
{
  "type": "string_to_something",
  "fields": {"TYPE": "toInt"},
  "inputs": {
    "TEXT": {"shadow": {"type": "text", "fields": {"TEXT": "123"}}}
  }
}
```
生成代码: `String("123").toInt()` → 输出整数 `123`

### 多文本合并
```json
{
  "type": "text_join",
  "extraState": {"itemCount": 3},
  "inputs": {
    "ADD0": {"block": {"type": "text", "fields": {"TEXT": "Hello "}}},
    "ADD1": {"block": {"type": "variables_get", "fields": {"VAR": {"id": "username"}}}},
    "ADD2": {"block": {"type": "text", "fields": {"TEXT": "!"}}}
  }
}
```

### 获取指定位置字符
```json
{
  "type": "text_charAt",
  "fields": {"WHERE": "FROM_START"},
  "inputs": {
    "VALUE": {"shadow": {"type": "text", "fields": {"TEXT": "hello"}}},
    "AT": {"shadow": {"type": "math_number", "fields": {"NUM": 0}}}
  }
}
```
生成代码: `String("hello").charAt(0)` → 输出字符 `'h'`

## 重要规则

1. **字符串索引从0开始**: 第一个字符索引为0
2. **char块只能输入单个字符**: 支持转义字符如 `\n`
3. **动态输入**: text_join 使用 `extraState.itemCount` 控制输入数量
4. **类型兼容**: 所有方法调用都使用 `String()` 包装，兼容 `const char*` 和 `String`

## 支持的字段选项汇总
- **CASE(大小写)**: `UPPERCASE`, `LOWERCASE`, `TITLECASE`
- **WHERE(位置)**: `FROM_START`, `FROM_END`, `FIRST`, `LAST`, `RANDOM`
- **MODE(裁剪)**: `BOTH`, `LEFT`, `RIGHT`
- **TYPE(转换)**: `toInt`, `toLong`, `toFloat`, `toDouble`, `c_str`, `charAt0`, `toUpper`, `toLower`
- **END(方向)**: `FIRST`, `LAST`
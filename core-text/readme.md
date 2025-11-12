# core-text

文本操作与字符串处理核心库

## 库信息
- **库名**: @aily-project/lib-core-text
- **版本**: 0.0.1
- **兼容**: Arduino全系列平台

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `text` | 值块 | TEXT(field_input) | `"fields":{"TEXT":"hello"}` | `"hello"` |
| `char` | 值块 | CHAR(field_input) | `"fields":{"CHAR":"A"}` | `'A'` |
| `string_add_string` | 值块 | STRING1(input_value), STRING2(input_value) | `"inputs":{"STRING1":{"block":{...}},"STRING2":{"block":{...}}}` | `String(str1) + String(str2)` |
| `text_join` | 值块 | 动态输入(mutator), extraState | `"extraState":{"itemCount":2},"inputs":{"ADD0":{"block":{...}},"ADD1":{"block":{...}}}` | `String("") + str0 + str1` |
| `text_append` | 语句块 | VAR(field_variable), TEXT(input_value) | `"fields":{"VAR":{"id":"var_id"}},"inputs":{"TEXT":{"block":{...}}}` | `var += text;` |
| `string_length` | 值块 | STRING(input_value) | `"inputs":{"STRING":{"block":{...}}}` | `str.length()` |
| `text_length` | 值块 | VALUE(input_value) | `"inputs":{"VALUE":{"block":{...}}}` | `String(value).length()` |
| `string_charAt` | 值块 | STRING(input_value), NUM(input_value) | `"inputs":{"STRING":{"block":{...}},"NUM":{"block":{...}}}` | `str.charAt(num)` |
| `text_charAt` | 值块 | VALUE(input_value), WHERE(field_dropdown) | `"fields":{"WHERE":"FROM_START"},"inputs":{"VALUE":{"block":{...}}}` | `text.charAt(index)` |
| `string_substring` | 值块 | STRING(input_value), START(field_dropdown), START_NUM(input_value), END(field_dropdown), END_NUM(input_value) | `"fields":{"START":"0","END":"0"},"inputs":{"STRING":{"block":{...}},"START_NUM":{"block":{...}},"END_NUM":{"block":{...}}}` | `str.substring(start,end)` |
| `tt_getSubstring` | 值块 | STRING(input_value), WHERE1(field_dropdown), AT1(input_value), WHERE2(field_dropdown), AT2(input_value) | `"fields":{"WHERE1":"FROM_START","WHERE2":"FROM_START"},"inputs":{"STRING":{"block":{...}},"AT1":{"block":{...}},"AT2":{"block":{...}}}` | `text.substring(start,end)` |
| `string_indexOf` | 值块 | STRING1(input_value), STRING2(input_value) | `"inputs":{"STRING1":{"block":{...}},"STRING2":{"block":{...}}}` | `str1.indexOf(str2)` |
| `text_indexOf` | 值块 | VALUE(input_value), FIND(input_value), END(field_dropdown) | `"fields":{"END":"FIRST"},"inputs":{"VALUE":{"block":{...}},"FIND":{"block":{...}}}` | `text.indexOf(find)` |
| `string_find_str` | 值块 | STRING1(input_value), STRING2(input_value), POSITION(field_dropdown) | `"fields":{"POSITION":"start"},"inputs":{"STRING1":{"block":{...}},"STRING2":{"block":{...}}}` | `str1.indexOf(str2)` |
| `text_isEmpty` | 值块 | VALUE(input_value) | `"inputs":{"VALUE":{"block":{...}}}` | `text.length() == 0` |
| `string_startsWith` | 值块 | TEXT(input_value), PREFIX(input_value) | `"inputs":{"TEXT":{"block":{...}},"PREFIX":{"block":{...}}}` | `str.startsWith(prefix)` |
| `string_endsWith` | 值块 | TEXT(input_value), SUFFIX(input_value) | `"inputs":{"TEXT":{"block":{...}},"SUFFIX":{"block":{...}}}` | `str.endsWith(suffix)` |
| `text_trim` | 值块 | TEXT(input_value), MODE(field_dropdown) | `"fields":{"MODE":"BOTH"},"inputs":{"TEXT":{"block":{...}}}` | `text.trim()` |
| `text_changeCase` | 值块 | TEXT(input_value), CASE(field_dropdown) | `"fields":{"CASE":"UPPERCASE"},"inputs":{"TEXT":{"block":{...}}}` | `text.toUpperCase()` |
| `text_replace` | 值块 | TEXT(input_value), FROM(input_value), TO(input_value) | `"inputs":{"TEXT":{"block":{...}},"FROM":{"block":{...}},"TO":{"block":{...}}}` | `text.replace(from,to)` |
| `text_reverse` | 值块 | TEXT(input_value) | `"inputs":{"TEXT":{"block":{...}}}` | `reverseString(text)` |
| `text_count` | 值块 | TEXT(input_value), SUB(input_value) | `"inputs":{"TEXT":{"block":{...}},"SUB":{"block":{...}}}` | `countOccurrences(text,sub)` |
| `number_to_string` | 值块 | NUM(input_value) | `"inputs":{"NUM":{"block":{...}}}` | `String(num)` |
| `string_to_something` | 值块 | TEXT(input_value), TYPE(field_dropdown) | `"fields":{"TYPE":"toInt"},"inputs":{"TEXT":{"block":{...}}}` | `str.toInt()` |
| `number_to` | 值块 | NUM(field_number) | `"fields":{"NUM":"123"}` | `123` |
| `toascii` | 值块 | STRING(field_input) | `"fields":{"STRING":"A"}` | `(int)'A'` |
| `array_get_dataAt` | 值块 | ARRAY(input_value), INDEX(input_value) | `"inputs":{"ARRAY":{"block":{...}},"INDEX":{"block":{...}}}` | `array[index]` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"TEXT": "hello"` |
| field_number | 数值字符串 | `"NUM": "123"` |
| field_dropdown | 字符串 | `"CASE": "UPPERCASE"` |
| field_variable | 对象 | `"VAR": {"id": "var_id", "name": "text", "type": "String"}` |
| input_value | 块连接 | `"inputs": {"TEXT": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **特殊规则**: 
  - text_join使用mutator动态添加输入，通过extraState.itemCount设置输入数量
  - char块支持转义字符：\n, \t, \r, \\, \', \", \0
  - 字符串索引从0开始计算

## 使用示例

### 字符串拼接
```json
{
  "type": "string_add_string",
  "id": "concat_block",
  "inputs": {
    "STRING1": {"block": {"type": "text", "fields": {"TEXT": "Hello "}}},
    "STRING2": {"block": {"type": "text", "fields": {"TEXT": "World!"}}}
  }
}
```

### 字符串操作链
```json
{
  "type": "text_changeCase",
  "id": "case_change",
  "fields": {"CASE": "UPPERCASE"},
  "inputs": {
    "TEXT": {
      "block": {
        "type": "tt_getSubstring",
        "fields": {"WHERE1": "FROM_START", "WHERE2": "FROM_START"},
        "inputs": {
          "VALUE": {"block": {"type": "text", "fields": {"TEXT": "hello world"}}},
          "AT1": {"block": {"type": "math_number", "fields": {"NUM": "0"}}},
          "AT2": {"block": {"type": "math_number", "fields": {"NUM": "5"}}}
        }
      }
    }
  }
}
```

### 动态文本拼接
```json
{
  "type": "text_join",
  "id": "text_join_block",
  "extraState": {"itemCount": 3},
  "inputs": {
    "ADD0": {"block": {"type": "text", "fields": {"TEXT": "Hello "}}},
    "ADD1": {"block": {"type": "variables_get", "fields": {"VAR": {"id": "username"}}}},
    "ADD2": {"block": {"type": "text", "fields": {"TEXT": "!"}}}
  }
}
```

## 重要规则

1. **必须遵守**: 字符串索引从0开始，char块只能输入单个字符
2. **连接限制**: text_append是语句块，其他为值块
3. **动态输入**: text_join使用extraState.itemCount控制输入数量
4. **常见错误**: ❌ 字符串索引越界，❌ extraState与实际输入不匹配

## 支持的字段选项
- **CASE(大小写)**: "UPPERCASE", "LOWERCASE", "TITLECASE"
- **WHERE(位置)**: "FROM_START", "FROM_END", "FIRST", "LAST"
- **MODE(裁剪)**: "BOTH", "LEFT", "RIGHT"
- **TYPE(转换)**: "toInt", "toLong", "toFloat", "toDouble", "c_str", "charAt0", "toUpper", "toLower"
- **POSITION(查找)**: "start", "end"
- **END(方向)**: "FIRST", "LAST"
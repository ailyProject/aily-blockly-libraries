# Variables 核心库

Arduino变量管理库，提供变量声明、赋值、获取和类型转换功能。

## 库信息
- **库名**: @aily-project/lib-core-variables
- **版本**: 1.0.1  
- **兼容**: 所有Arduino板卡

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `variable_define` | 语句块 | VAR(field_input), TYPE(dropdown), VALUE(input) | `"VAR":"name"`, `"TYPE":"int"` | `int name = 0;` |
| `variables_get` | 值块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `name` |
| `variables_set` | 语句块 | VAR(field_variable), VALUE(input) | `"VAR":{"id":"var_id"}` | `name = value;` |
| `type_cast` | 值块 | VALUE(input), TYPE(dropdown) | `"TYPE":"int"` | `(int)value` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "temperature"` |
| field_dropdown | 字符串 | `"TYPE": "int"` |
| field_variable | 对象 | `"VAR": {"id": "var_id"}` |
| input_value | 块连接 | `"inputs": {"VALUE": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **变量引用**: 声明时用字符串，使用时用对象ID

## 使用示例

### 变量声明
```json
{
  "type": "variable_define",
  "id": "define_id",
  "fields": {"VAR": "temp", "TYPE": "int"},
  "inputs": {"VALUE": {"shadow": {"type": "math_number", "fields": {"NUM": 25}}}}
}
```

### 变量使用
```json
{
  "type": "variables_set",
  "id": "set_id", 
  "fields": {"VAR": {"id": "temp_var_id"}},
  "inputs": {"VALUE": {"block": {"type": "math_number", "fields": {"NUM": 30}}}}
}
```

### 完整程序
```json
{
  "type": "arduino_setup",
  "inputs": {
    "ARDUINO_SETUP": {
      "block": {
        "type": "variable_define",
        "fields": {"VAR": "count", "TYPE": "int"},
        "inputs": {"VALUE": {"shadow": {"type": "math_number", "fields": {"NUM": 0}}}},
        "next": {
          "block": {
            "type": "variables_set",
            "fields": {"VAR": {"id": "count_var_id"}},
            "inputs": {"VALUE": {"block": {"type": "math_number", "fields": {"NUM": 1}}}}
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **变量ID**: 声明用字符串，引用用对象ID
2. **作用域**: 连接在程序流中=局部变量，独立存在=全局变量  
3. **必须唯一**: 所有块ID和变量ID必须唯一
4. **连接限制**: 值块无next字段，语句块有连接点

## 数据类型
支持: int, long, float, double, unsigned int, unsigned long, bool, char, string, String

---
*自包含文档，无需外部规范*
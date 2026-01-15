# core-math

数学运算与位操作核心库

## 库信息
- **库名**: @aily-project/lib-core-math
- **版本**: 0.0.1
- **兼容**: Arduino AVR, ESP32平台，3.3V/5V

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `math_number` | 值块 | NUM(field_number) | `"fields":{"NUM":"123"}` | `123` |
| `math_number_base` | 值块 | BASE(field_dropdown), NUM(field_input) | `"fields":{"BASE":"HEX","NUM":"FF"}` | `0xFF` |
| `math_arithmetic` | 值块 | OP(field_dropdown), A(input_value), B(input_value) | `"fields":{"OP":"ADD"},"inputs":{"A":{"block":{...}},"B":{"block":{...}}}` | `a + b` |
| `math_single` | 值块 | OP(field_dropdown), NUM(input_value) | `"fields":{"OP":"ROOT"},"inputs":{"NUM":{"block":{...}}}` | `sqrt(num)` |
| `math_trig` | 值块 | OP(field_dropdown), NUM(input_value) | `"fields":{"OP":"SIN"},"inputs":{"NUM":{"block":{...}}}` | `sin(num)` |
| `math_constant` | 值块 | CONSTANT(field_dropdown) | `"fields":{"CONSTANT":"PI"}` | `M_PI` |
| `math_number_property` | 值块 | NUMBER_TO_CHECK(input_value), PROPERTY(field_dropdown) | `"fields":{"PROPERTY":"EVEN"},"inputs":{"NUMBER_TO_CHECK":{"block":{...}}}` | `num % 2 == 0` |
| `math_change` | 语句块 | VAR(field_variable), DELTA(input_value) | `"fields":{"VAR":{"id":"var_id"}},"inputs":{"DELTA":{"block":{...}}}` | `var += delta;` |
| `math_round` | 值块 | OP(field_dropdown), NUM(input_value) | `"fields":{"OP":"ROUND"},"inputs":{"NUM":{"block":{...}}}` | `round(num)` |
| `math_modulo` | 值块 | DIVIDEND(input_value), DIVISOR(input_value) | `"inputs":{"DIVIDEND":{"block":{...}},"DIVISOR":{"block":{...}}}` | `dividend % divisor` |
| `math_constrain` | 值块 | VALUE(input_value), LOW(input_value), HIGH(input_value) | `"inputs":{"VALUE":{"block":{...}},"LOW":{"block":{...}},"HIGH":{"block":{...}}}` | `constrain(value,low,high)` |
| `math_random_int` | 值块 | FROM(input_value), TO(input_value) | `"inputs":{"FROM":{"block":{...}},"TO":{"block":{...}}}` | `random(from,to+1)` |
| `math_random_float` | 值块 | 无 | `{}` | `random(0,1000)/1000.0` |
| `math_round_to_decimal` | 值块 | NUMBER(input_value), DECIMALS(input_value) | `"inputs":{"NUMBER":{"block":{...}},"DECIMALS":{"block":{...}}}` | `round(number*pow(10,decimals))/pow(10,decimals)` |
| `map_to` | 值块 | NUM(input_value), FIRST_START(input_value), FIRST_END(input_value), LAST_START(input_value), LAST_END(input_value) | `"inputs":{"NUM":{"block":{...}},"FIRST_START":{"block":{...}},"FIRST_END":{"block":{...}},"LAST_START":{"block":{...}},"LAST_END":{"block":{...}}}` | `map(num,first_start,first_end,last_start,last_end)` |
| `math_bitwise_shift` | 值块 | OP(field_dropdown), A(input_value), B(input_value) | `"fields":{"OP":"LEFT"},"inputs":{"A":{"block":{...}},"B":{"block":{...}}}` | `a << b` |
| `math_bitwise_logic` | 值块 | OP(field_dropdown), A(input_value), B(input_value) | `"fields":{"OP":"AND"},"inputs":{"A":{"block":{...}},"B":{"block":{...}}}` | `a & b` |
| `math_bitwise_not` | 值块 | NUM(input_value) | `"inputs":{"NUM":{"block":{...}}}` | `~num` |
| `math_bitread` | 值块 | NUM(input_value), BIT(input_value) | `"inputs":{"NUM":{"block":{...}},"BIT":{"block":{...}}}` | `bitRead(num,bit)` |
| `math_bitwrite` | 值块 | NUM(input_value), BIT(input_value), VALUE(input_value) | `"inputs":{"NUM":{"block":{...}},"BIT":{"block":{...}},"VALUE":{"block":{...}}}` | `bitWrite(num,bit,value)` |
| `math_bitset` | 值块 | NUM(input_value), BIT(input_value) | `"inputs":{"NUM":{"block":{...}},"BIT":{"block":{...}}}` | `bitSet(num,bit)` |
| `math_bitclear` | 值块 | NUM(input_value), BIT(input_value) | `"inputs":{"NUM":{"block":{...}},"BIT":{"block":{...}}}` | `bitClear(num,bit)` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_number | 数值字符串 | `"NUM": "123"` |
| field_input | 字符串 | `"NUM": "FF"` |
| field_dropdown | 字符串 | `"OP": "ADD"` |
| field_variable | 对象 | `"VAR": {"id": "var_id", "name": "count", "type": "int"}` |
| input_value | 块连接 | `"inputs": {"A": {"block": {...}}}` |

## 连接规则

- **值块**: 有output，连接到`inputs`中，无`next`字段
- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **特殊规则**: 所有数学运算块都输出Number类型，math_number_property输出Boolean类型

## 使用示例

### 基础数学运算
```json
{
  "type": "math_arithmetic",
  "id": "add_block",
  "fields": {"OP": "ADD"},
  "inputs": {
    "A": {"block": {"type": "math_number", "fields": {"NUM": "10"}}},
    "B": {"block": {"type": "math_number", "fields": {"NUM": "5"}}}
  }
}
```

### 进制转换与位操作
```json
{
  "type": "math_bitwise_logic",
  "id": "bit_and",
  "fields": {"OP": "AND"},
  "inputs": {
    "A": {"block": {"type": "math_number_base", "fields": {"BASE": "HEX", "NUM": "FF"}}},
    "B": {"block": {"type": "math_number_base", "fields": {"BASE": "BIN", "NUM": "11110000"}}}
  }
}
```

## 重要规则

1. **必须遵守**: 数学运算输入必须是Number类型，位操作结果为整数
2. **连接限制**: math_change是语句块，其他都是值块
3. **常见错误**: ❌ 三角函数输入弧度制，❌ 随机数范围包含上界

## 支持的字段选项
- **BASE(进制)**: "DEC", "HEX", "BIN"
- **OP(算术)**: "ADD", "MINUS", "MULTIPLY", "DIVIDE", "MODULO", "POWER"
- **OP(单项)**: "ROOT", "ABS", "NEG", "LN", "LOG10", "EXP", "POW10"
- **OP(三角)**: "SIN", "COS", "TAN", "ASIN", "ACOS", "ATAN"
- **CONSTANT(常量)**: "PI", "E", "GOLDEN_RATIO", "SQRT2", "SQRT1_2", "INFINITY"
- **PROPERTY(数字性质)**: "EVEN", "ODD", "PRIME", "WHOLE", "POSITIVE", "NEGATIVE", "DIVISIBLE_BY"
- **OP(舍入)**: "ROUND", "ROUNDUP", "ROUNDDOWN"
- **OP(位移)**: "LEFT", "RIGHT"
- **OP(位逻辑)**: "AND", "OR", "XOR"
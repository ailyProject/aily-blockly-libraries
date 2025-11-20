# core-loop

循环控制核心库

## 库信息
- **库名**: @aily-project/lib-core-loop
- **版本**: 0.0.1
- **兼容**: Arduino全系列平台，3.3V/5V

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `arduino_setup` | Hat块 | ARDUINO_SETUP(input_statement) | `"inputs":{"ARDUINO_SETUP":{"block":{...}}}` | `void setup(){...}` |
| `arduino_loop` | Hat块 | ARDUINO_LOOP(input_statement) | `"inputs":{"ARDUINO_LOOP":{"block":{...}}}` | `void loop(){...}` |
| `controls_repeat_ext` | 语句块 | TIMES(input_value), DO(input_statement) | `"inputs":{"TIMES":{"block":{...}},"DO":{"block":{...}}}` | `for(int i=0;i<times;i++){...}` |
| `controls_repeat` | 语句块 | TIMES(field_number), DO(input_statement) | `"fields":{"TIMES":"10"},"inputs":{"DO":{"block":{...}}}` | `for(int i=0;i<10;i++){...}` |
| `controls_whileUntil` | 语句块 | MODE(field_dropdown), BOOL(input_value), DO(input_statement) | `"fields":{"MODE":"WHILE"},"inputs":{"BOOL":{"block":{...}},"DO":{"block":{...}}}` | `while(condition){...}` |
| `controls_for` | 语句块 | VAR(field_variable), FROM(input_value), TO(input_value), BY(input_value), DO(input_statement) | `"fields":{"VAR":{"id":"var_id"}},"inputs":{"FROM":{"block":{...}},"TO":{"block":{...}},"BY":{"block":{...}},"DO":{"block":{...}}}` | `for(int var=from;var<to;var+=by){...}` |
| `controls_flow_statements` | 语句块 | FLOW(field_dropdown) | `"fields":{"FLOW":"BREAK"}` | `break;` |
| `controls_whileForever` | 语句块 | DO(input_statement) | `"inputs":{"DO":{"block":{...}}}` | `while(true){...}` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_number | 数值 | `"TIMES": "10"` |
| field_dropdown | 字符串 | `"MODE": "WHILE"` |
| field_variable | 对象 | `"VAR": {"id": "var_id", "name": "i", "type": "int"}` |
| input_value | 块连接 | `"inputs": {"TIMES": {"block": {...}}}` |
| input_statement | 块连接 | `"inputs": {"DO": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **Hat块**: 无连接属性，程序入口点，通过`inputs`连接内部语句
- **特殊规则**: 
  - arduino_setup和arduino_loop是顶层Hat块，不能有next连接
  - controls_flow_statements只有previousStatement，无nextStatement
  - for循环会自动创建循环变量并添加到工具箱

## 使用示例

### Arduino程序结构
```json
{
  "type": "arduino_setup",
  "id": "setup_block",
  "inputs": {
    "ARDUINO_SETUP": {
      "block": {
        "type": "variables_set",
        "fields": {"VAR": {"id": "led_pin", "name": "ledPin", "type": "int"}},
        "inputs": {"VALUE": {"block": {"type": "math_number", "fields": {"NUM": "13"}}}}
      }
    }
  }
},
{
  "type": "arduino_loop", 
  "id": "loop_block",
  "inputs": {
    "ARDUINO_LOOP": {
      "block": {
        "type": "controls_repeat",
        "fields": {"TIMES": "5"},
        "inputs": {
          "DO": {
            "block": {
              "type": "arduino_digitalWrite",
              "fields": {"PIN": "13", "STATE": "HIGH"}
            }
          }
        }
      }
    }
  }
}
```

### For循环计数器
```json
{
  "type": "controls_for",
  "id": "for_loop",
  "fields": {
    "VAR": {"id": "counter_var", "name": "i", "type": "int"}
  },
  "inputs": {
    "FROM": {"block": {"type": "math_number", "fields": {"NUM": "1"}}},
    "TO": {"block": {"type": "math_number", "fields": {"NUM": "10"}}},
    "BY": {"block": {"type": "math_number", "fields": {"NUM": "1"}}},
    "DO": {
      "block": {
        "type": "arduino_print",
        "inputs": {"TEXT": {"block": {"type": "variables_get", "fields": {"VAR": {"id": "counter_var"}}}}}
      }
    }
  },
  "next": {"block": {...}}
}
```

## 重要规则

1. **必须遵守**: arduino_setup和arduino_loop只能有一个，且为程序顶层结构
2. **连接限制**: Hat块不能有next连接，controls_flow_statements不能连接后续语句
3. **常见错误**: ❌ 在setup/loop外放置arduino代码，❌ flow_statements后连接其他语句

## 支持的字段选项
- **MODE(while/until)**: "WHILE", "UNTIL"
- **FLOW(控制流)**: "BREAK", "CONTINUE"
- **变量类型**: 自动推导为"int"类型
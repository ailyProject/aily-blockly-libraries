# core-logic

逻辑控制与条件判断核心库

## 库信息
- **库名**: core-logic
- **版本**: 1.0.0  
- **兼容**: Arduino全系列平台

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `controls_if` | 语句块 | IF0(input_value), DO0(input_statement), extraState | `"inputs":{"IF0":{"block":{...}},"DO0":{"block":{...}}}` | `if(condition){...}` |
| `controls_ifelse` | 语句块 | IF0(input_value), DO0(input_statement), ELSE(input_statement), extraState | `"extraState":{"elseIfCount":2},"inputs":{"IF0":{"block":{...}},"DO0":{"block":{...}},"IF1":{"block":{...}},"DO1":{"block":{...}},"ELSE":{"block":{...}}}` | `if(condition){...}else if(condition2){...}else{...}` |
| `logic_compare` | 值块 | OP(field_dropdown), A(input_value), B(input_value) | `"fields":{"OP":"EQ"},"inputs":{"A":{"block":{...}},"B":{"block":{...}}}` | `a == b` |
| `logic_operation` | 值块 | OP(field_dropdown), A(input_value), B(input_value) | `"fields":{"OP":"AND"},"inputs":{"A":{"block":{...}},"B":{"block":{...}}}` | `a && b` |
| `logic_negate` | 值块 | BOOL(input_value) | `"inputs":{"BOOL":{"block":{...}}}` | `!bool` |
| `logic_boolean` | 值块 | BOOL(field_dropdown) | `"fields":{"BOOL":"true"}` | `true` |
| `logic_ternary` | 值块 | IF(input_value), THEN(input_value), ELSE(input_value) | `"inputs":{"IF":{"block":{...}},"THEN":{"block":{...}},"ELSE":{"block":{...}}}` | `condition ? then : else` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown | 字符串 | `"OP": "EQ"` |
| input_value | 块连接 | `"inputs": {"A": {"block": {...}}}` |
| input_statement | 块连接 | `"inputs": {"DO0": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **特殊规则**: 
  - controls_if支持mutator扩展，通过extraState.elseifCount设置"否则如果"分支数量，通过extraState.hasElse设置是否包含"否则"分支
  - controls_ifelse支持mutator扩展，通过extraState.elseIfCount设置"否则如果"分支数量
  - 动态添加的分支输入名为IF1/DO1, IF2/DO2等，按序号递增

## 使用示例

### 基础条件判断
```json
{
  "type": "controls_if",
  "id": "if_block",
  "inputs": {
    "IF0": {
      "block": {
        "type": "logic_compare",
        "fields": {"OP": "GT"},
        "inputs": {
          "A": {"block": {"type": "variables_get", "fields": {"VAR": {"id": "temp"}}}},
          "B": {"block": {"type": "math_number", "fields": {"NUM": "30"}}}
        }
      }
    },
    "DO0": {
      "block": {
        "type": "arduino_functions",
        "fields": {"FUNC": "digitalWrite(fanPin, HIGH);"}
      }
    }
  },
  "next": {"block": {...}}
}
```

### 复合逻辑运算
```json
{
  "type": "logic_operation",
  "id": "logic_and",
  "fields": {"OP": "AND"},
  "inputs": {
    "A": {
      "block": {
        "type": "logic_compare",
        "fields": {"OP": "GT"},
        "inputs": {
          "A": {"block": {"type": "variables_get", "fields": {"VAR": {"id": "temp"}}}},
          "B": {"block": {"type": "math_number", "fields": {"NUM": "25"}}}
        }
      }
    },
    "B": {
      "block": {
        "type": "logic_compare", 
        "fields": {"OP": "LT"},
        "inputs": {
          "A": {"block": {"type": "variables_get", "fields": {"VAR": {"id": "humidity"}}}},
          "B": {"block": {"type": "math_number", "fields": {"NUM": "60"}}}
        }
      }
    }
  }
}
```

### 多分支条件判断
```json
{
  "type": "controls_ifelse",
  "id": "multi_if_block",
  "extraState": {"elseIfCount": 1},
  "inputs": {
    "IF0": {
      "block": {
        "type": "logic_compare",
        "fields": {"OP": "GT"},
        "inputs": {
          "A": {"block": {"type": "variables_get", "fields": {"VAR": {"id": "temp"}}}},
          "B": {"block": {"type": "math_number", "fields": {"NUM": "35"}}}
        }
      }
    },
    "DO0": {
      "block": {
        "type": "serial_println",
        "inputs": {"VAR": {"block": {"type": "text", "fields": {"TEXT": "高温"}}}}
      }
    },
    "IF1": {
      "block": {
        "type": "logic_compare",
        "fields": {"OP": "GT"},
        "inputs": {
          "A": {"block": {"type": "variables_get", "fields": {"VAR": {"id": "temp"}}}},
          "B": {"block": {"type": "math_number", "fields": {"NUM": "25"}}}
        }
      }
    },
    "DO1": {
      "block": {
        "type": "serial_println",
        "inputs": {"VAR": {"block": {"type": "text", "fields": {"TEXT": "适中"}}}}
      }
    },
    "ELSE": {
      "block": {
        "type": "serial_println",
        "inputs": {"VAR": {"block": {"type": "text", "fields": {"TEXT": "低温"}}}}
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: 块ID必须唯一，字段值必须匹配预定义选项
2. **连接限制**: 语句块只能连接语句块，值块只能连接到输入端口
3. **动态输入**: controls_ifelse使用extraState.elseIfCount控制else if分支数量; controls_if使用extraState.elseifCount和extraState.hasElse控制分支数量
4. **常见错误**: ❌ 将值块放在语句位置，❌ 字段值拼写错误，❌ extraState与实际输入数量不匹配

## 支持的字段选项
- **OP(比较)**: "EQ", "NEQ", "LT", "LTE", "GT", "GTE"  
- **OP(逻辑)**: "AND", "OR"
- **BOOL**: "true", "false"
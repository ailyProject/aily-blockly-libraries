# 逻辑控制 (Logic Control) 核心库

Arduino/C++编程中的逻辑控制核心库，提供条件判断、逻辑运算和布尔值处理功能。

## 库信息
- **库名**: @aily-project/lib-core-logic
- **版本**: 0.0.1
- **作者**: aily Project
- **描述**: 核心库，通常已经集成到初始模板中
- **电压**: 3.3V、5V
- **测试者**: 奈何col

## Blockly 工具箱分类

### Logic 控制
- `controls_if` - 条件判断
- `controls_ifelse` - 条件判断(带else)
- `logic_compare` - 逻辑比较
- `logic_operation` - 逻辑运算
- `logic_negate` - 逻辑取反
- `logic_boolean` - 布尔常量
- `logic_ternary` - 三元运算

## 详细块定义

### 条件控制块

#### controls_if
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 基本条件判断，简单的if语句(优先推荐使用 controls_ifelse 块)
**值输入**:
- `IF0`: 布尔输入 - 条件表达式
**语句输入**:
- `DO0`: 语句输入 - 条件为真时执行的代码
**生成代码**:
```cpp
if (condition) {
  // 执行代码
}
```

#### controls_ifelse
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 带else分支的条件判断，支持动态扩展else if分支
**值输入**:
- `IF0`: 布尔输入 - 条件表达式
**语句输入**:
- `DO0`: 语句输入 - 条件为真时执行的代码
- `ELSE`: 语句输入 - 条件为假时执行的代码
**动态扩展**: 使用齿轮图标⚙️可以动态添加/删除else if分支
**生成代码**:
```cpp
if (condition1) {
  // 条件1为真
} else if (condition2) {
  // 条件2为真
} else {
  // 所有条件都为假
}
```

### 逻辑运算块

#### logic_compare
**类型**: 值块 (output: Boolean)
**描述**: 数值比较运算，支持6种比较操作符
**字段**:
- `OP`: 下拉选择 ["EQ", "NEQ", "LT", "LTE", "GT", "GTE"]
**值输入**:
- `A`: 任意输入 - 左操作数
- `B`: 任意输入 - 右操作数
**生成代码**:
- `(a == b)` - 相等
- `(a != b)` - 不等
- `(a < b)` - 小于
- `(a <= b)` - 小于等于
- `(a > b)` - 大于
- `(a >= b)` - 大于等于

#### logic_operation
**类型**: 值块 (output: Boolean)
**描述**: 逻辑运算（与、或）
**字段**:
- `OP`: 下拉选择 ["AND", "OR"]
**值输入**:
- `A`: 布尔输入 - 左操作数
- `B`: 布尔输入 - 右操作数
**生成代码**:
- `(a && b)` - 逻辑与
- `(a || b)` - 逻辑或
**短路求值**: 支持短路求值优化

#### logic_negate
**类型**: 值块 (output: Boolean)
**描述**: 逻辑非运算，布尔值取反
**值输入**:
- `BOOL`: 布尔输入 - 待取反的布尔值
**生成代码**: `(!condition)`

### 布尔值块

#### logic_boolean
**类型**: 值块 (output: Boolean)
**描述**: 布尔常量，真/假常量值
**字段**:
- `BOOL`: 下拉选择 ["TRUE", "FALSE"]
**生成代码**:
- `true` - 真值
- `false` - 假值

#### logic_ternary
**类型**: 值块 (output: Any)
**描述**: 三元条件运算符，条件表达式
**值输入**:
- `IF`: 布尔输入 - 条件表达式
- `THEN`: 任意输入 - 条件为真时的值
- `ELSE`: 任意输入 - 条件为假时的值
**生成代码**: `(condition ? value1 : value2)`
**用途**: 适用于简单的条件赋值

## .abi 文件生成规范

### 块连接规则
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段

### 逻辑运算优先级
1. `!` (逻辑非)
2. `<`, `<=`, `>`, `>=` (关系运算)
3. `==`, `!=` (相等运算)
4. `&&` (逻辑与)
5. `||` (逻辑或)
6. `? :` (三元运算)

### 短路求值
- `&&`: 左操作数为假时，不计算右操作数
- `||`: 左操作数为真时，不计算右操作数

### 动态扩展
- `controls_ifelse` 支持动态添加 else if 分支
- 使用 mutator 机制实现动态输入管理

## 使用示例

### 基本条件判断
```json
{
  "type": "controls_if",
  "inputs": {
    "IF0": {
      "block": {
        "type": "logic_compare",
        "fields": {"OP": "GT"},
        "inputs": {
          "A": {"block": {"type": "variables_get", "fields": {"VAR": {"id": "temperature"}}}},
          "B": {"block": {"type": "math_number", "fields": {"NUM": 25}}}
        }
      }
    },
    "DO0": {
      "block": {
        "type": "io_digitalwrite",
        "inputs": {
          "PIN": {"shadow": {"type": "io_pin_digi", "fields": {"PIN": "13"}}},
          "STATE": {"shadow": {"type": "io_state", "fields": {"STATE": "HIGH"}}}
        }
      }
    }
  }
}
```

### 复合逻辑运算
```json
{
  "type": "logic_operation",
  "fields": {"OP": "AND"},
  "inputs": {
    "A": {
      "block": {
        "type": "logic_compare",
        "fields": {"OP": "GT"},
        "inputs": {
          "A": {"block": {"type": "variables_get"}},
          "B": {"block": {"type": "math_number", "fields": {"NUM": 10}}}
        }
      }
    },
    "B": {
      "block": {
        "type": "logic_compare",
        "fields": {"OP": "LT"},
        "inputs": {
          "A": {"block": {"type": "variables_get"}},
          "B": {"block": {"type": "math_number", "fields": {"NUM": 100}}}
        }
      }
    }
  }
}
```

### 三元运算示例
```json
{
  "type": "logic_ternary",
  "inputs": {
    "IF": {
      "block": {
        "type": "logic_compare",
        "fields": {"OP": "GT"},
        "inputs": {
          "A": {"block": {"type": "io_analogread"}},
          "B": {"block": {"type": "math_number", "fields": {"NUM": 512}}}
        }
      }
    },
    "THEN": {"block": {"type": "math_number", "fields": {"NUM": 255}}},
    "ELSE": {"block": {"type": "math_number", "fields": {"NUM": 0}}}
  }
}
```

## 技术特性
- **标准兼容**: 基于标准C++逻辑运算符
- **动态扩展**: 支持动态添加条件分支
- **优先级处理**: 自动处理运算符优先级
- **短路求值**: 逻辑运算支持短路求值优化
- **代码优化**: 生成高效的条件判断代码
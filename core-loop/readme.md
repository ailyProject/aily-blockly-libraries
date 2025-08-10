# 循环控制 (Loop Control) 核心库

Arduino/C++编程中的循环控制核心库，提供各种循环结构和程序流程控制功能。

## 库信息
- **库名**: @aily-project/lib-core-loop
- **版本**: 0.0.1
- **作者**: aily Project
- **描述**: 核心库，通常已经集成到初始模板中
- **电压**: 3.3V、5V
- **测试者**: 奈何col

## Blockly 工具箱分类

### Loops 控制
- `arduino_setup` - Arduino初始化
- `arduino_loop` - Arduino主循环
- `controls_repeat_ext` - 重复执行
- `controls_repeat` - 无限循环
- `controls_whileUntil` - 条件循环
- `controls_for` - 计数循环
- `controls_flow_statements` - 流程控制
- `controls_whileForever` - 永久循环

## 详细块定义

### 程序结构块

#### arduino_setup
**类型**: Hat块 (无连接属性)
**描述**: Arduino程序初始化部分，只执行一次
**语句输入**:
- `ARDUINO_SETUP`: 语句输入 - 初始化代码
**生成代码**:
```cpp
void setup() {
  // 初始化代码
}
```
**用途**: 设置引脚模式、初始化串口、配置传感器等

#### arduino_loop
**类型**: Hat块 (无连接属性)
**描述**: Arduino主循环部分，持续执行
**语句输入**:
- `ARDUINO_LOOP`: 语句输入 - 循环代码
**生成代码**:
```cpp
void loop() {
  // 循环代码
}
```
**用途**: 主要程序逻辑，传感器读取，控制输出等

### 循环控制块

#### controls_repeat_ext
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 重复执行指定次数
**值输入**:
- `TIMES`: 数字输入 - 重复次数 (检查类型: Number)
**语句输入**:
- `DO`: 语句输入 - 重复执行的代码
**生成代码**:
```cpp
for (int count = 0; count < 10; count++) {
  // 重复执行的代码
}
```
**工具箱默认**: 默认重复 10 次

#### controls_repeat
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 简单重复循环
**语句输入**:
- `DO`: 语句输入 - 重复执行的代码
**生成代码**:
```cpp
while (true) {
  // 重复执行的代码
}
```
**注意**: 需要手动添加跳出条件，避免死循环

#### controls_whileUntil
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 条件循环，支持while和until模式
**字段**:
- `MODE`: 下拉选择 ["WHILE", "UNTIL"]
**值输入**:
- `BOOL`: 布尔输入 - 循环条件
**语句输入**:
- `DO`: 语句输入 - 循环体代码
**生成代码**:
- WHILE: `while (condition) { ... }`
- UNTIL: `while (!(condition)) { ... }`

#### controls_for
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 带计数器的for循环，支持起始值、结束值、步长
**字段**:
- `VAR`: 变量选择器 - 循环变量
**值输入**:
- `FROM`: 数字输入 - 起始值
- `TO`: 数字输入 - 结束值
- `BY`: 数字输入 - 步长
**语句输入**:
- `DO`: 语句输入 - 循环体代码
**生成代码**:
```cpp
for (int i = 1; i <= 10; i += 1) {
  // 循环体代码
}
```
**智能步长**: 自动检测循环方向（递增/递减），根据起始值和结束值优化循环条件
**工具箱默认**: 从 1 到 10，步长 1

#### controls_whileForever
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 永远执行的循环
**语句输入**:
- `DO`: 语句输入 - 循环体代码
**生成代码**:
```cpp
while (true) {
  // 循环体代码
}
```

### 流程控制块

#### controls_flow_statements
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 循环流程控制，支持break和continue
**字段**:
- `FLOW`: 下拉选择 ["BREAK", "CONTINUE"]
**生成代码**:
- BREAK: `break;` - 跳出当前循环
- CONTINUE: `continue;` - 跳过当前循环的剩余部分，继续下一次循环
**注意**: 只影响最内层循环

## .abi 文件生成规范

### 块连接规则
- **Hat块**: 无连接属性，通过 `inputs` 连接内部语句
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接

### 工具箱默认配置
- `controls_repeat_ext.TIMES`: 默认数字 10
- `controls_for.FROM`: 默认数字 1
- `controls_for.TO`: 默认数字 10
- `controls_for.BY`: 默认数字 1

### 循环变量管理
- `controls_for` 循环自动创建循环变量
- 变量作用域限制在循环内部
- 支持嵌套循环的变量管理
- 避免变量名冲突

### 智能步长检测
- 自动检测循环方向（递增/递减）
- 根据起始值和结束值优化循环条件
- 支持正负步长值

## 使用示例

### Arduino程序结构
```json
{
  "type": "arduino_setup",
  "inputs": {
    "ARDUINO_SETUP": {
      "block": {
        "type": "serial_begin",
        "fields": {"SERIAL": "Serial", "SPEED": "9600"}
      }
    }
  }
}
```

### 重复循环
```json
{
  "type": "controls_repeat_ext",
  "inputs": {
    "TIMES": {"block": {"type": "math_number", "fields": {"NUM": 5}}},
    "DO": {
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

### 条件循环
```json
{
  "type": "controls_whileUntil",
  "fields": {"MODE": "WHILE"},
  "inputs": {
    "BOOL": {
      "block": {
        "type": "logic_compare",
        "fields": {"OP": "LT"},
        "inputs": {
          "A": {"block": {"type": "variables_get"}},
          "B": {"block": {"type": "math_number", "fields": {"NUM": 100}}}
        }
      }
    },
    "DO": {
      "block": {
        "type": "variables_set",
        "inputs": {
          "VALUE": {
            "block": {
              "type": "math_arithmetic",
              "fields": {"OP": "ADD"},
              "inputs": {
                "A": {"block": {"type": "variables_get"}},
                "B": {"block": {"type": "math_number", "fields": {"NUM": 1}}}
              }
            }
          }
        }
      }
    }
  }
}
```

### 计数循环
```json
{
  "type": "controls_for",
  "fields": {"VAR": {"id": "i_var_id"}},
  "inputs": {
    "FROM": {"block": {"type": "math_number", "fields": {"NUM": 0}}},
    "TO": {"block": {"type": "math_number", "fields": {"NUM": 9}}},
    "BY": {"block": {"type": "math_number", "fields": {"NUM": 1}}},
    "DO": {
      "block": {
        "type": "serial_println",
        "inputs": {
          "VAR": {"block": {"type": "variables_get", "fields": {"VAR": {"id": "i_var_id"}}}}
        }
      }
    }
  }
}
```

### 流程控制示例
```json
{
  "type": "controls_flow_statements",
  "fields": {"FLOW": "BREAK"}
}
```

## 技术特性
- **标准兼容**: 基于标准C++循环语法
- **Arduino结构**: 支持Arduino特有的setup/loop结构
- **智能优化**: 自动优化循环条件和步长
- **作用域安全**: 自动管理变量作用域
- **性能优化**: 生成高效的循环代码
- **嵌套支持**: 支持多层循环嵌套

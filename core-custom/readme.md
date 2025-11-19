# 自定义代码核心库

Arduino/C++编程中的自定义代码核心库，提供代码插入、宏定义、库引用、变量和函数定义功能。

## 库信息
- **库名**: @aily-project/lib-core-custom
- **版本**: 1.0.0
- **兼容**: 所有Arduino平台

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `custom_code` | 语句块 | CODE(field_multilinetext) | `"CODE":"digitalWrite(13, HIGH);"` | 直接输出代码 |
| `custom_code2` | 值块 | CODE(field_multilinetext) | `"CODE":"analogRead(A0)"` | 直接输出代码 |
| `custom_macro` | Hat块 | NAME(field_input), VALUE(field_input) | `"NAME":"LED_PIN","VALUE":"13"` | `#define LED_PIN 13` |
| `custom_library` | Hat块 | LIB_NAME(field_input) | `"LIB_NAME":"Servo.h"` | `#include <Servo.h>` |
| `custom_variable` | Hat块 | TYPE(field_dropdown), NAME(field_input), VALUE(field_input) | `"TYPE":"int","NAME":"count","VALUE":"0"` | `int count = 0;` |
| `custom_function` | Hat块 | NAME(field_input), RETURN(field_dropdown), PARAMS(field_input), BODY(field_multilinetext) | 完整函数参数 | 函数定义 |
| `custom_insert_code` | Hat块 | POSITION(field_dropdown), CODE(field_multilinetext) | `"POSITION":"variable","CODE":"int x;"` | 按位置插入 |
| `comment` | 语句块 | TEXT(field_input) | `"TEXT":"这是注释"` | `// 这是注释` |
| `comment_wrapper` | 语句块 | TEXT(field_input), STATEMENTS(input_statement) | `"TEXT":"代码区域"` | 包装代码块 |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"NAME": "LED_PIN"` |
| field_multilinetext | 字符串 | `"CODE": "digitalWrite(13, HIGH);"` |
| field_dropdown | 字符串 | `"TYPE": "int"` |
| input_statement | 块连接 | `"inputs": {"STATEMENTS": {"block": {...}}}` |

## 连接规则

- **语句块**: custom_code、comment、comment_wrapper有previousStatement/nextStatement，通过`next`字段连接
- **值块**: custom_code2有output，连接到`inputs`中，无`next`字段
- **Hat块**: custom_macro、custom_library、custom_variable、custom_function、custom_insert_code无连接属性，影响全局代码结构
- **特殊规则**: Hat块按类型自动添加到对应代码区域，不参与程序流连接

## 使用示例

### 自定义代码语句
```json
{
  "type": "custom_code",
  "id": "custom_1",
  "fields": {
    "CODE": "digitalWrite(13, HIGH);\ndelay(1000);"
  }
}
```

### 宏定义
```json
{
  "type": "custom_macro",
  "id": "macro_1",
  "fields": {
    "NAME": "LED_PIN",
    "VALUE": "13"
  }
}
```

### 完整程序示例
```json
{
  "type": "arduino_setup",
  "inputs": {
    "ARDUINO_SETUP": {
      "block": {
        "type": "custom_code",
        "fields": {"CODE": "pinMode(LED_PIN, OUTPUT);"},
        "next": {
          "block": {
            "type": "comment",
            "fields": {"TEXT": "设置引脚模式"}
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **代码位置**: Hat块（宏定义、库引用等）自动添加到程序对应区域，语句块按连接顺序执行
2. **语法检查**: 自定义代码需遵循C++语法，编译错误由Arduino IDE报告
3. **作用域管理**: 变量定义和函数定义影响全局作用域，注意命名冲突
4. **常见错误**: ❌ 语法错误代码，❌ 重复定义变量/函数，❌ 缺少分号

## 支持的数据类型
- **基本类型**: void, int, long, float, double, bool, char, string
- **无符号类型**: unsigned char, unsigned long
- **插入位置**: macro(宏定义区), library(库引用区), variable(变量定义区), object(对象定义区), function(函数定义区)

---
*自包含文档，无需外部规范*

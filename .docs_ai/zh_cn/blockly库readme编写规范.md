# Blockly库README编写规范

## 概述

本规范定义了Blockly库文档的标准格式。每个库必须提供**两个文件**：

| 文件 | 读者 | 大小上限 | 用途 |
|------|------|----------|------|
| `readme.md` | 人类 | ≤1KB | 库介绍、作者/来源信息、快速入门 |
| `readme_ai.md` | 大模型 | ≤5KB（必要时≤15KB） | 用于代码生成的ABS块参考 |

**设计原则**：自包含、ABS优先、表格驱动、实用导向

---

## ABS语法参考

### 块连接类型

| 类型 | 角色 | 语法 |
|------|------|------|
| **Value（值块）** | 返回一个值，作为参数嵌入其他块中 | `block(p1, p2, ...)` — 所有参数放在括号内 |
| **Statement（语句块）** | 独立的可执行语句行 | 参数放在括号内；`input_statement` 插槽使用 `@NAME:` |
| **Hat（帽块）** | 程序入口点（`arduino_setup`、`arduino_loop` 等） | 与语句块相同 |

### ABS中的参数类型

| 参数来源 | ABS语法 | 示例 |
|---------|---------|------|
| `field_input`（文本） | `"字符串"` | `"dht"`、`"sensor"` |
| `field_number` | 裸数字 | `9600`、`13` |
| `field_dropdown` / 枚举 | `ENUM_VALUE`（大写） | `HIGH`、`EQ`、`Serial` |
| `field_variable` | `$varName` | `$count`、`$temp` |
| `input_value` — 数字 | `math_number(n)` | `math_number(1000)` |
| `input_value` — 文本 | `text("s")` | `text("Hello")` |
| `input_value` — 布尔 | `logic_boolean(TRUE\|FALSE)` | `logic_boolean(TRUE)` |
| `input_value` — 变量读取 | `variables_get($varName)` 或 `$varName` | `variables_get($x)` |
| `input_value` — 嵌套块 | `block(args)` | `logic_compare($a, EQ, $b)` |
| `input_statement` | `@NAME:` + 缩进的子块 | `@DO0:\n    action()` |

> `$varName` 用于 `input_value` 插槽时是 `variables_get($varName)` 的简写。两种形式均可接受；在ABS格式示例中推荐使用 `variables_get($varName)` 以保持清晰。

### ⚠️ 参数顺序规则

参数遵循 **`block.json` `args0` 定义的顺序** —— 字段和值输入可能交错排列。务必按此顺序记录和调用。

```
# args0: [A(input_value), OP(field_dropdown), B(input_value)]
✅ logic_compare(variables_get($a), EQ, math_number(10))
❌ logic_compare(EQ, variables_get($a), math_number(10))  — OP在前是错误的
```

### `input_statement` 与带 `@NAME:` 的 `input_value`

- **`input_statement`** 插槽始终使用 `@NAME:` + 缩进的子块。
- **部分块的某些 `input_value` 插槽**（例如 `controls_if` 的条件输入）也使用 `@NAME:`——需查看该块的 args0 结构。
- **值块**从不使用 `@NAME:`——所有参数直接写在括号内。

```
# controls_if: @IFn: 是 input_value（条件），@DOn: 和 @ELSE: 是 input_statement
controls_if()
    @IF0: logic_compare(variables_get($temp), GT, math_number(30))
    @DO0:
        serial_println(Serial, text("Hot"))
    @IF1: logic_compare(variables_get($temp), GT, math_number(20))
    @DO1:
        serial_println(Serial, text("Warm"))
    @ELSE:
        serial_println(Serial, text("Cool"))

# 循环块：语句体直接缩进（body不使用 @NAME:）
controls_repeat_ext(math_number(10))
    serial_println(Serial, text("Loop"))

controls_for($i, math_number(0), math_number(10), math_number(1))
    serial_println(Serial, variables_get($i))
```

---

## 文件一：`readme.md` 结构（≤1KB）

面向人类的介绍文档，保持简洁。

```markdown
# [库名]

[一句话描述该库的功能]

## 库信息

| 字段 | 值 |
|------|----|
| 包名 | @aily-project/lib-xxx |
| 版本 | x.x.x |
| 作者 | [作者或组织] |
| 来源 | [原始 Arduino/GitHub 库链接] |
| 许可证 | MIT / Apache-2.0 / ... |

## 支持的板卡

[列出兼容的板卡，例如 Arduino UNO、ESP32 等]

## 描述

[2–4句话：该库的功能、支持的硬件、主要特性]

## 快速入门

[1–3个步骤，或关键的接线/代码说明]
```

---

## 文件二：`readme_ai.md` 结构（≤5KB，复杂库可达15KB）

面向大模型的ABS参考文档。以下每个小节均对应此文件的内容。

### 必需章节

#### 1. 标题与库信息
```markdown
# [库名]

[一句话描述]

## 库信息
- **名称**: @aily-project/lib-xxx
- **版本**: x.x.x
```

#### 2. 块定义（必需）

记录库中的**每一个块**。"参数（args0顺序）"列必须按 `block.json` args0 的精确顺序列出参数——这决定了ABS调用顺序。

```markdown
## 块定义

| 块类型 | 连接 | 参数（args0顺序） | ABS格式 | 生成代码 |
|--------|------|-----------------|---------|----------|
| `xxx_init` | 语句块 | VAR(field_input), TYPE(dropdown), PIN(field_number) | `xxx_init("name", TYPE_A, 2)` | `Xxx var(pin);` |
| `xxx_read` | 值块 | VAR(field_variable) | `xxx_read(variables_get($name))` | `var.read()` |
| `xxx_write` | 语句块 | VAR(field_variable), VALUE(input_value) | `xxx_write(variables_get($name), math_number(100))` | `var.write(val);` |
| `xxx_if_ready` | 语句块 | VAR(field_variable), DO(input_statement) | `xxx_if_ready(variables_get($name)) @DO0: action()` | `if (var.ready()) { action(); }` |
```

#### 3. 参数选项（存在枚举时必需）
```markdown
## 参数选项

| 参数 | 可选值 | 说明 |
|------|--------|------|
| TYPE | TYPE_A, TYPE_B | 传感器类型 |
| OP | EQ, NE, LT, LTE, GT, GTE | 比较运算符 |
```

### 可选章节

#### 4. ABS示例（复杂库必须包含）

当库需要多块组合、初始化模式或非显而易见的用法时包含此节。推荐提供完整的程序框架。

```markdown
## ABS示例

### 基本用法
arduino_setup()
    xxx_init("sensor", TYPE_A, 2)
    serial_begin(Serial, 9600)

arduino_loop()
    controls_if()
        @IF0: xxx_is_ready(variables_get($sensor))
        @DO0:
            serial_println(Serial, xxx_read(variables_get($sensor)))
    time_delay(math_number(1000))
```

#### 5. 注意事项（存在非显而易见的约束时包含）
```markdown
## 注意事项

1. **初始化**: 在 `arduino_setup()` 内调用 `xxx_init`
2. **变量引用**: 在值插槽中使用 `variables_get($name)` 读取变量
3. **参数顺序**: 遵循 `block.json` args0 顺序——字段和输入可能交错排列
4. **常见错误**: ❌ 在 input_value 插槽中使用裸数字（应使用 `math_number(n)`）
```

---

## 特殊模式

### 自动创建变量
当一个块自动创建变量时（例如 `xxx_init("name", ...)`），应记录如下：
```
**变量**: `xxx_init("varName", ...)` 创建变量 `$varName`；之后通过 `variables_get($varName)` 引用它。
```

### 动态字段
当块根据下拉选项动态改变其输入时：
```
**动态字段**: `dht_init` 在选择 DHT11/DHT22 时显示 PIN 字段，选择其他类型时显示 WIRE 字段。
```

## 模板应用指南

1. **复制标准结构**: 使用固定的6个部分
2. **填写核心表格**: 重点完成块定义表格
3. **提供典型示例**: 1-2个.abi示例即可
4. **突出特殊规则**: 库特有的重要限制
5. **控制篇幅**: 总体积不超过5KB

## 维护原则

- **与代码同步**: README与block.json、toolbox.json保持一致
- **版本更新**: 新增块时及时更新表格
- **简洁原则**: 新增内容前考虑是否真正必要
- **实用导向**: 优先保证大模型能正确使用

---

此规范确保README文档既简洁又完整，让大模型能够快速理解库功能并生成正确的.abi文件。
可参考DHT库的README作为示例。
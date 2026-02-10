# Blockly 库 README 编写规范（ABS 版）

## 概述

本规范提供 Blockly 库 README 的标准格式，适配 ABS 编辑方式。目标是让 LLM 无需外部规范即可理解库功能并生成正确的 ABS 代码。
文件名为readme_ai.md。

**设计原则**：自包含、ABS 优先、轻量化（≤3KB）、表格驱动、实用导向

---

## ABS 参数类型参考（通用）

| 类型 | ABS 格式 | 示例 |
|------|----------|------|
| 字符串字段 | `"value"` | `"dht"`, `"Hello"` |
| 数字字段 | `数字` | `9600`, `13` |
| 枚举/下拉 | `ENUM_VALUE` | `DHT22`, `HIGH`, `Serial` |
| 变量引用 | `$varName` | `$dht`, `$temp` |
| 数字块 | `math_number(n)` | `math_number(1000)` |
| 文本块 | `text("...")` | `text("Hello World")` |
| 布尔块 | `logic_boolean(BOOL)` | `logic_boolean(TRUE)` |
| 值块 | `块名(参数)` | `dht_read_temperature($dht)` |

> **注意**: 字段参数（字符串/数字/枚举）直接填入块的字段，值块参数连接到块的输入槽。

---

## 标准 README 结构

### 1. 标题与库信息
```markdown
# [库名]

[一句话功能描述]

## 库信息
- **库名**: xxx
- **版本**: x.x.x
```

### 2. 块定义表格（核心）
```markdown
## 块定义

| 块类型 | 连接 | 参数 | ABS格式 | 生成代码 |
|--------|------|------|---------|----------|
| `xxx_init` | 语句块 | VAR(field_input), TYPE(dropdown), PIN(dropdown) | `xxx_init("name", TYPE_A, 2)` | `Xxx var(pin);` |
| `xxx_read` | 值块 | VAR(field_variable) | `xxx_read($name)` | `var.read()` |
| `xxx_write` | 语句块 | VAR(field_variable), VALUE(input_value) | `xxx_write($name, math_number(100))` | `var.write(val);` |
```

**填写规则**：
- **连接**：`语句块` / `值块` / `Hat块`
- **参数**：`名称(类型)` 格式，常见类型：
  - `field_input` - 文本输入框 → ABS 用 `"字符串"`
  - `field_number` - 数字输入框 → ABS 用 `数字`
  - `field_dropdown` / `dropdown` - 下拉选择 → ABS 用 `枚举值`
  - `field_variable` - 变量选择 → ABS 用 `$varName`
  - `input_value` - 值输入槽 → ABS 用 `值块()`
  - `input_statement` - 语句输入槽 → ABS 用缩进子块
- **ABS格式**：完整调用示例，复杂块必填

### 3. ABS 示例（按需）

**简单库**：块定义表格的 ABS格式 列已足够，可省略此节。

**复杂库**：需要展示多块组合、条件分支、循环等完整程序：
```markdown
## ABS 示例

### 完整程序
arduino_setup()
    xxx_init("sensor", TYPE_A, 2)
    serial_begin(Serial, 9600)

arduino_loop()
    controls_if()
        @IF0: xxx_ready($sensor)
        @DO0:
            serial_println(Serial, xxx_read($sensor))
    time_delay(math_number(1000))
```

### 4. 参数选项（如有枚举）
```markdown
## 参数选项

| 参数 | 可选值 | 说明 |
|------|--------|------|
| TYPE | TYPE_A, TYPE_B | 类型选择 |
```

### 5. 注意事项
```markdown
## 注意事项

1. **初始化**: xxx_init 放在 arduino_setup() 中
2. **变量引用**: 用 $变量名 引用
3. **常见错误**: ❌ 未初始化直接读取
```

---

## 特殊情况说明

### 自动创建变量的块
```markdown
**变量说明**: `xxx_init("varName", ...)` 会自动创建变量，后续用 `$varName` 引用。
```

### 动态字段
```markdown
**动态字段**: `dht_init` 根据 TYPE 自动切换 PIN/WIRE 参数。
```

### 条件分支（controls_if）
使用 `@输入名:` 标记多个输入：
```
controls_if()
    @IF0: logic_compare(GT, $count, number(10))
    @DO0:
        serial_println(Serial, text("大于10"))
    @ELSE:
        serial_println(Serial, text("不大于10"))
```

---

## 质量检查清单

- [ ] 块定义表格覆盖所有块
- [ ] ABS 示例可直接使用
- [ ] 参数选项完整
- [ ] 注意事项突出关键限制
- [ ] 总体积 ≤3KB

---

## 维护原则

- README 与 block.json、toolbox.json 保持同步
- 新增块时及时更新
- 保持简洁，避免冗余

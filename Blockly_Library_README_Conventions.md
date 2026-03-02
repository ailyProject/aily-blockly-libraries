# Blockly Library README Writing Specification

## Overview

This specification defines the standard for Blockly library documentation. For each library, **two files** must be produced:

| File | Audience | Max Size | Purpose |
|------|----------|----------|---------|
| `readme.md` | Humans | ≤1KB | Library introduction, author/source info, quick start |
| `readme_ai.md` | LLMs | ≤5KB (≤15KB if necessary) | ABS block reference for code generation |

**Design Principles**: Self-contained, ABS-first, Table-driven, Practical

---

## ABS Syntax Reference

### Block Connection Types

| Type | Role | Syntax |
|------|------|--------|
| **Value** | Returns a value; embedded as a parameter in other blocks | `block(p1, p2, ...)` — all params in parentheses |
| **Statement** | Standalone executable line | Params in parentheses; `input_statement` slots use `@NAME:` |
| **Hat** | Program entry point (`arduino_setup`, `arduino_loop`, etc.) | Same as Statement |

### Parameter Types in ABS

| Parameter Source | ABS Syntax | Example |
|-----------------|------------|---------|
| `field_input` (text) | `"string"` | `"dht"`, `"sensor"` |
| `field_number` | bare number | `9600`, `13` |
| `field_dropdown` / enum | `ENUM_VALUE` (uppercase) | `HIGH`, `EQ`, `Serial` |
| `field_variable` | `$varName` | `$count`, `$temp` |
| `input_value` — number | `math_number(n)` | `math_number(1000)` |
| `input_value` — text | `text("s")` | `text("Hello")` |
| `input_value` — boolean | `logic_boolean(TRUE\|FALSE)` | `logic_boolean(TRUE)` |
| `input_value` — variable read | `variables_get($varName)` or `$varName` | `variables_get($x)` |
| `input_value` — nested block | `block(args)` | `logic_compare($a, EQ, $b)` |
| `input_statement` | `@NAME:` + indented body | `@DO0:\n    action()` |

> `$varName` used in an `input_value` slot is shorthand for `variables_get($varName)`. Both forms are accepted; use `variables_get($varName)` for clarity in ABS Format examples.

### ⚠️ Parameter Order Rule

Parameters follow **`block.json` `args0` definition order** — fields and value inputs may interleave. Always document and follow this order.

```
# args0: [A(input_value), OP(field_dropdown), B(input_value)]
✅ logic_compare(variables_get($a), EQ, math_number(10))
❌ logic_compare(EQ, variables_get($a), math_number(10))  — OP first is wrong
```

### `input_statement` vs `input_value` with `@NAME:`

- **`input_statement`** slots always use `@NAME:` + indented child blocks.
- **Some `input_value` slots** on certain blocks (e.g. `controls_if`'s condition inputs) also use `@NAME:` — check the block's args0 structure.
- **Value blocks** never use `@NAME:` — all parameters go directly in parentheses.

```
# controls_if: @IFn: is input_value (condition), @DOn: and @ELSE: are input_statement
controls_if()
    @IF0: logic_compare(variables_get($temp), GT, math_number(30))
    @DO0:
        serial_println(Serial, text("Hot"))
    @IF1: logic_compare(variables_get($temp), GT, math_number(20))
    @DO1:
        serial_println(Serial, text("Warm"))
    @ELSE:
        serial_println(Serial, text("Cool"))

# Loop blocks: statement body is indented directly (no @NAME: for body)
controls_repeat_ext(math_number(10))
    serial_println(Serial, text("Loop"))

controls_for($i, math_number(0), math_number(10), math_number(1))
    serial_println(Serial, variables_get($i))
```

---

## File 1: `readme.md` Structure (≤1KB)

Human-facing introduction. Keep it concise.

```markdown
# [Library Name]

[One-sentence description of what this library does]

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-xxx |
| Version | x.x.x |
| Author | [Author or Organization] |
| Source | [Original Arduino/GitHub library URL] |
| License | MIT / Apache-2.0 / ... |

## Supported Boards

[List compatible boards, e.g. Arduino UNO, ESP32, etc.]

## Description

[2–4 sentences: what the library does, what hardware it supports, key features]

## Quick Start

[1–3 steps or a minimal wiring/code note if relevant]
```

---

## File 2: `readme_ai.md` Structure (≤5KB, up to 15KB for complex libraries)

LLM-facing ABS reference. Every section below maps to this file.

### Required Sections

#### 1. Title and Library Info
```markdown
# [Library Name]

[One-sentence description]

## Library Info
- **Name**: @aily-project/lib-xxx
- **Version**: x.x.x
```

#### 2. Block Definitions (mandatory)

Document **every block** in the library. Column "Parameters (args0 order)" must list params in the exact `block.json` args0 order — this determines ABS call order.

```markdown
## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `xxx_init` | Statement | VAR(field_input), TYPE(dropdown), PIN(field_number) | `xxx_init("name", TYPE_A, 2)` | `Xxx var(pin);` |
| `xxx_read` | Value | VAR(field_variable) | `xxx_read(variables_get($name))` | `var.read()` |
| `xxx_write` | Statement | VAR(field_variable), VALUE(input_value) | `xxx_write(variables_get($name), math_number(100))` | `var.write(val);` |
| `xxx_if_ready` | Statement | VAR(field_variable), DO(input_statement) | `xxx_if_ready(variables_get($name)) @DO0: action()` | `if (var.ready()) { action(); }` |
```

#### 3. Parameter Options (required if any enums exist)
```markdown
## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | TYPE_A, TYPE_B | Sensor type |
| OP | EQ, NE, LT, LTE, GT, GTE | Comparison operator |
```

### Optional Sections

#### 4. ABS Examples (include for complex libraries)

Include when the library requires multi-block composition, initialization patterns, or non-obvious usage. A complete program skeleton is preferred.

```markdown
## ABS Examples

### Basic Usage
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

#### 5. Notes (include for non-obvious constraints)
```markdown
## Notes

1. **Initialization**: Call `xxx_init` inside `arduino_setup()`
2. **Variable reference**: Use `variables_get($name)` to read a variable in value slots
3. **Parameter order**: Follows `block.json` args0 order — fields and inputs may interleave
4. **Common errors**: ❌ Using bare numbers in input_value slots (use `math_number(n)` instead)
```

---

## Special Patterns

### Auto-created Variables
When a block creates a variable automatically (e.g. `xxx_init("name", ...)`), document it:
```
**Variable**: `xxx_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
```

### Dynamic Fields
When a block changes its inputs based on a dropdown value:
```
**Dynamic fields**: `dht_init` shows PIN field for DHT11/DHT22 and WIRE field for other types.
```

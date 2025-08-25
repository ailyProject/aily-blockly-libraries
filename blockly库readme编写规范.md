# Blockly库README编写规范

## 概述

本规范基于对diandeng_blinker和MQTT库的分析，总结出Blockly库README文档的标准编写格式。README文档应综合反映`toolbox.json`、`block.json`、`generator.js`三个核心文件的内容，便于LLM理解并生成project.abi文件。

## 三个核心文件的关系

### 文件职责
- **toolbox.json**: 定义工具箱中可用的块和默认配置（影子块）- **决定用户实际能使用的块**
- **block.json**: 定义块的外观、连接方式、字段类型、颜色等
- **generator.js**: 定义块到C++代码的映射关系和自动添加的库/变量

### 重要原则
**toolbox.json是权威来源**：只有在toolbox.json中定义的块才应该出现在README中，即使block.json和generator.js中有其他块的定义。

### 数据流关系
```
toolbox.json → 用户可见的块 → block.json → 块的结构定义 → generator.js → C++代码生成
     ↓              ↓                ↓                    ↓
  影子块配置    →  字段/输入定义  →  连接属性定义  →  代码映射逻辑
```

## README标准结构

### 1. 标题和简介
```markdown
# [库名称]

[一句话描述库的功能和适用场景]

## 库信息
- **库名**: package.json中的name字段
- **版本**: package.json中的version字段  
- **作者**: package.json中的author字段
- **描述**: package.json中的description字段
- **兼容**: package.json中的compatibility.core字段
- **电压**: package.json中的compatibility.voltage字段
- **测试者**: package.json中的tester字段
- **官方库**: package.json中的url字段（如有）
```

### 2. Blockly工具箱分类
```markdown
## Blockly 工具箱分类

### [分类名称1]
- `block_type1` - 简短描述
- `block_type2` - 简短描述

### [分类名称2]  
- `block_type3` - 简短描述
```
**来源**: 基于toolbox.json的contents结构，按功能分组

### 3. 详细块定义
```markdown
## 详细块定义

### [分类名称]块

#### block_type_name
**类型**: [Hat块/语句块/值块] ([连接属性])
**描述**: [块的功能描述]
**字段**:
- `FIELD_NAME`: [中文描述] - 说明 (默认值)
**值输入** (如有):
- `INPUT_NAME`: [中文描述] - 说明
**语句输入** (如有):
- `INPUT_NAME`: 说明
**生成代码**:
```cpp
// 生成的C++代码示例
```
**自动添加** (如有):
- 库引用: `#include <Library.h>`
- 变量定义: `Type varName;`
- 主循环: `function();`
```

## 块定义规范细则

### 类型标注规范
- **Hat块**: 无连接属性，通过inputs连接内部语句
- **语句块**: (previousStatement/nextStatement)
- **值块**: (output: Type)
- **动态输入块**: 需要extraState字段记录输入数量

### 字段类型描述（推荐中文）
在块定义中使用中文描述替代英文术语：
- `field_input` → `文本输入`
- `field_dropdown` → `下拉选择`
- `field_checkbox` → `复选框`
- `field_number` → `数字输入`
- `field_variable` → `变量选择`
- `input_value` → `字符串输入`/`数字输入`等
- `input_statement` → `语句输入`

**注意**: 详细的字段类型映射已在`blockly代码规范.md`中说明，无需在每个库的readme中重复。

### Token优化原则
1. **使用中文描述**：`文本输入` 比 `field_input` 更简洁
2. **删除来源标注**：去掉 `(来自block.json)` 等冗余信息
3. **简化工具箱说明**：只在必要时说明影子块配置
4. **保持准确性**：简化的同时确保技术信息准确

### 生成代码规范
- 包含关键的C++代码片段
- 说明动态生成的部分（如变量名替换）
- 使用简洁的代码注释

### 自动添加说明
- **库引用**: 必要的头文件
- **变量定义**: 全局变量
- **主循环**: 循环代码

## .abi文件生成规范

### 4. .abi文件生成规范
```markdown
## .abi 文件生成规范

### 块连接规则
- **Hat块**: 无连接属性，通过 `inputs` 连接内部语句
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段

### 工具箱默认配置
部分块预设了影子块：
- `block_type.INPUT_NAME`: 默认类型 "默认值"

### 变量管理
[说明变量的创建和管理规则]

### 智能板卡适配
[说明不同开发板的自动适配逻辑]
```

**注意**:
- 不要包含字段类型映射表，该信息已在`blockly代码规范.md`中统一说明
- .abi示例中所有块都必须包含`id`字段
- 动态输入块需要`extraState`字段记录输入数量

### 5. 使用示例
```markdown
## 使用示例

### [场景名称]
```json
{
  "type": "block_type",
  "id": "block_id",
  "fields": {"FIELD": "value"},
  "inputs": {
    "INPUT": {"shadow": {"type": "text", "id": "shadow_id", "fields": {"TEXT": "default"}}}
  }
}
```

### 动态输入块示例（如有）
```json
{
  "type": "dynamic_block_type",
  "id": "block_id",
  "extraState": {"itemCount": 3},
  "fields": {"FIELD": "value"},
  "inputs": {
    "INPUT0": {"block": {...}},
    "INPUT1": {"block": {...}},
    "INPUT2": {"block": {...}}
  }
}
```
```

### 6. 技术特性和注意事项
```markdown
## 技术特性
- **特性1**: 描述
- **特性2**: 描述

## 注意事项  
- 重要的使用限制
- 常见问题说明
```

## 编写检查清单

### 内容完整性
- [ ] 包含package.json中的所有关键信息
- [ ] **仅覆盖toolbox.json中的块类型**（不包含block.json中未在toolbox中的块）
- [ ] 反映block.json中相应块的所有字段和连接属性
- [ ] 体现generator.js中相应块的代码生成逻辑

### 技术准确性
- [ ] 块类型标注正确（Hat/语句/值块）
- [ ] 字段类型与block.json一致
- [ ] 工具箱配置与toolbox.json一致
- [ ] 生成代码与generator.js一致

### 格式规范性
- [ ] 使用标准的Markdown格式
- [ ] 代码块使用正确的语言标记
- [ ] 表格格式正确
- [ ] 层次结构清晰

### LLM友好性
- [ ] 提供足够的.abi文件示例
- [ ] 说明块之间的连接关系
- [ ] 包含变量管理规则
- [ ] 明确使用限制和注意事项

## 最佳实践

1. **保持同步**: README应与三个核心文件保持同步更新
2. **详细说明**: 每个块都应有完整的技术说明
3. **示例丰富**: 提供多种使用场景的.abi示例
4. **突出特色**: 强调库的独特功能和技术特性
5. **用户友好**: 使用清晰的语言和结构化的格式

---

此规范确保README文档能够准确、完整地反映Blockly库的功能，便于LLM理解并生成正确的project.abi文件。

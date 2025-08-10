# 变量 (Variables) 核心库

Arduino/C++编程中的变量管理核心库，提供变量声明、赋值、获取和类型转换功能。

## 库信息
- **库名**: @aily-project/lib-core-variables
- **版本**: 1.0.1
- **作者**: aily Project
- **描述**: 核心库，通常已经集成到初始模板中

## Blockly 工具箱分类

### Variables 管理
- `CREATE_VARIABLE` - 新建变量按钮
- `variable_define` - 变量声明
- `variables_get` - 变量获取
- `variables_set` - 变量赋值
- `type_cast` - 类型转换

## 详细块定义

### 变量操作块

#### variable_define
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 声明新变量并指定数据类型和初始值
**字段**:
- `VAR`: 文本输入 - 变量名
- `TYPE`: 下拉选择 - 数据类型 ["int", "long", "float", "double", "unsigned int", "unsigned long", "bool", "char", "string"]
**值输入**:
- `VALUE`: 任意输入 - 初始值
**生成代码**: `int temperature = 25;`
**作用域**: 连接到主程序流时为局部变量，独立存在时为全局变量
**工具箱默认**: 默认初始值为数字 0

#### variables_get
**类型**: 值块 (output: null)
**描述**: 获取已声明变量的当前值
**字段**:
- `VAR`: 变量选择器 - 选择已定义的变量
**生成代码**: `temperature`
**扩展**: 支持上下文菜单，可快速创建对应的赋值块

#### variables_set
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 为已存在的变量赋予新值
**字段**:
- `VAR`: 变量选择器 - 选择已定义的变量
**值输入**:
- `VALUE`: 任意输入 - 新值
**生成代码**: `temperature = 30;`
**扩展**: 支持上下文菜单，可快速创建对应的获取块

#### type_cast
**类型**: 值块 (output: null)
**描述**: 将值转换为指定数据类型
**字段**:
- `TYPE`: 下拉选择 - 目标类型 ["int", "long", "float", "double", "unsigned int", "unsigned long", "bool", "char", "byte", "String"]
**值输入**:
- `VALUE`: 任意输入 - 待转换的值
**生成代码**: `(int)3.14`
**实现**: 字符串使用String()构造函数，其他使用标准C++转换语法

## 支持的数据类型

### 整数类型
- **int**: 16位有符号整数（-32768 到 32767）
- **long**: 32位有符号整数（-2,147,483,648 到 2,147,483,647）
- **unsigned int**: 16位无符号整数（0 到 65535）
- **unsigned long**: 32位无符号整数（0 到 4,294,967,295）
- **char**: 8位字符（-128 到 127）
- **byte**: 8位无符号整数（0 到 255）

### 浮点类型
- **float**: 32位浮点数（约6-7位有效数字）
- **double**: 双精度浮点型（在Arduino中通常等同于float）

### 其他类型
- **bool**: 布尔型（true 或 false）
- **string**: C风格字符串
- **String**: Arduino字符串对象

## .abi 文件生成规范

### 块连接规则
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段

### 变量管理
- 变量声明使用 `variable_define` 块
- 变量引用使用 `variables_get` 块
- 变量赋值使用 `variables_set` 块
- 变量名在 `variable_define` 中使用字符串格式
- 变量名在 `variables_get/set` 中使用对象格式 `{"id": "变量ID"}`

### 工具箱功能
- **新建变量按钮**: 点击创建新变量，自动添加到工具箱并刷新显示
- **动态更新**: 自动添加新创建的变量获取块，支持变量重命名时的工具箱同步
- **智能检测**: 智能检测变量引用，避免重复添加

### 高级功能
- **智能作用域管理**: 根据块连接状态自动决定变量作用域（局部/全局）
- **变量重命名**: 支持动态修改变量名称，自动检测变量引用关系，500ms防抖处理
- **类型安全**: 自动处理默认值和类型转换，兼容Arduino特有数据类型

## 使用示例

### 变量声明
```json
{
  "type": "variable_define",
  "fields": {
    "VAR": "temperature",
    "TYPE": "int"
  },
  "inputs": {
    "VALUE": {"block": {"type": "math_number", "fields": {"NUM": 25}}}
  }
}
```

### 变量赋值
```json
{
  "type": "variables_set",
  "fields": {"VAR": {"id": "temperature_var_id"}},
  "inputs": {
    "VALUE": {"block": {"type": "math_number", "fields": {"NUM": 30}}}
  }
}
```

### 类型转换
```json
{
  "type": "type_cast",
  "fields": {"TYPE": "int"},
  "inputs": {
    "VALUE": {"block": {"type": "math_number", "fields": {"NUM": 3.14}}}
  }
}
```

### 变量获取
```json
{
  "type": "variables_get",
  "fields": {"VAR": {"id": "temperature_var_id"}}
}
```

## 使用说明

1. **创建**: 使用"声明变量"块定义变量，选择类型和初始值
2. **读取**: 使用"获取变量值"块读取变量
3. **修改**: 使用"赋值变量"块修改变量值
4. **转换**: 使用"类型强制转换"块进行类型转换
5. **管理**: 通过"新建变量"按钮快速创建，支持直接重命名

## 技术特性
- **类型安全**: 支持多种Arduino数据类型
- **智能作用域**: 自动处理变量声明和作用域
- **动态管理**: 支持变量的动态创建、重命名和引用
- **类型转换**: 支持显式和隐式类型转换
- **上下文菜单**: 提供便捷的变量操作快捷方式
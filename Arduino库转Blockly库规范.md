# Arduino库转换为Blockly库规范

## 概述

本规范基于ArduinoJson、OneButton、MQTT/PubSubClient等库的转换实例，提供将Arduino库转换为Blockly库的系统化方法。目标是帮助LLM理解如何分析Arduino库、设计用户友好的块、实现高质量的代码生成。

## 核心转换原则

1. **用户体验优先**: 简化复杂API，提供直观操作
2. **功能完整性**: 覆盖原库核心功能，保持语义一致
3. **智能自动化**: 自动处理初始化、变量管理、错误检查
4. **类型安全**: 通过约束防止连接错误
5. **板卡适配**: 智能适配不同Arduino板卡

## 转换流程

```
源码分析 → 块设计 → block.json → generator.js → toolbox.json → 测试验证
   ↓         ↓         ↓           ↓             ↓            ↓
API提取   功能分类   块定义      代码生成      工具箱配置    功能测试
例程研究  用户流程   字段设计    变量管理      影子块设置    兼容测试
```

## 阶段一：源码分析

### 1.1 API识别方法

**头文件分析**：
```cpp
// PubSubClient.h 核心API
class PubSubClient {
  PubSubClient(Client& client);           // 构造 → 创建块
  setServer(server, port);                // 配置 → 设置块
  setCallback(callback);                  // 回调 → 事件块
  connect(clientId, user, pass);          // 连接 → 操作块
  publish(topic, payload);                // 发布 → 操作块
  subscribe(topic);                       // 订阅 → 操作块
  loop();                                 // 维护 → 自动添加
};
```

**例程模式识别**：
```cpp
// mqtt_basic.ino 使用模式
PubSubClient client(ethClient);          // 对象创建
client.setServer(server, 1883);         // 服务器配置
client.setCallback(callback);           // 回调设置
client.connect("arduinoClient");        // 连接操作
client.publish("outTopic", "hello");    // 发布消息
client.subscribe("inTopic");            // 订阅主题
client.loop();                          // 保持连接
```

### 1.2 功能分类策略

**按操作类型分类**：
- **初始化类**: 对象创建、基础配置
- **连接类**: 网络连接、认证
- **通信类**: 发送、接收、订阅
- **状态类**: 连接检查、错误状态
- **维护类**: 保持连接、清理资源

**按用户流程分类**：
```
设备初始化 → 网络连接 → 服务配置 → 数据交互 → 状态监控
```

## 阶段二：block.json设计规范

### 2.1 块类型映射规则

| Arduino模式 | 块类型 | 连接属性 | 字段类型选择 | 设计要点 |
|------------|--------|----------|-------------|----------|
| 对象创建/初始化 | 语句块 | previousStatement/nextStatement | **field_input** | 用户输入变量名，自动注册 |
| 对象方法调用 | 语句块 | previousStatement/nextStatement | **field_variable** | 引用已创建的对象变量 |
| 事件回调 | 特殊语句块 | 包含input_statement | **field_variable** | 引用对象，包含代码块 |
| 状态查询 | 值块 | output: ["Type"] | **field_variable** | 引用对象，返回值 |
| 数据操作 | 语句块 | previousStatement/nextStatement | **field_variable** | 引用对象，操作数据 |

### 2.2 字段类型选择原则

**field_input vs field_variable 的关键区别**：

1. **对象初始化使用 field_input**：
   ```json
   {
     "type": "field_input",
     "name": "VAR",
     "text": "button1"  // 用户输入新变量名
   }
   ```

2. **对象方法调用使用 field_variable**：
   ```json
   {
     "type": "field_variable",
     "name": "VAR",
     "variable": "button1",
     "variableTypes": ["OneButton"],
     "defaultType": "OneButton"
   }
   ```

### 2.3 标准块结构模板

**基础语句块**：
```json
{
  "type": "库名_功能名",
  "message0": "直观的中文描述 %1 %2",
  "args0": [
    {
      "type": "field_variable",
      "name": "VAR",
      "variable": "defaultName",
      "variableTypes": ["CustomType"],
      "defaultType": "CustomType"
    },
    {"type": "input_value", "name": "PARAM", "check": ["类型"]}
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#统一颜色",
  "tooltip": "功能说明"
}
```

**事件处理块**：
```json
{
  "type": "mqtt_on_message",
  "message0": "MQTT客户端 %1 收到消息时执行",
  "args0": [
    {
      "type": "field_variable",
      "name": "CLIENT",
      "variable": "mqttClient",
      "variableTypes": ["PubSubClient"],
      "defaultType": "PubSubClient"
    }
  ],
  "message1": "%1",
  "args1": [{"type": "input_statement", "name": "HANDLER"}],
  "colour": "#9C27B0"
}
```

### 2.4 变量管理核心机制

**自动变量注册（核心库函数）**：
```javascript
// 使用核心库提供的函数，自动避免重复定义
registerVariableToBlockly(varName, varType);
```

**变量重命名监听（需自己实现）**：
```javascript
// 监听VAR输入值的变化，自动重命名Blockly变量
if (!block._varMonitorAttached) {
  block._varMonitorAttached = true;
  block._varLastName = block.getFieldValue('VAR') || 'defaultName';
  const varField = block.getField('VAR');
  if (varField && typeof varField.setValidator === 'function') {
    varField.setValidator(function(newName) {
      const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
      const oldName = block._varLastName;
      if (workspace && newName && newName !== oldName) {
        renameVariableInBlockly(block, oldName, newName, 'VariableType'); // 核心库函数
        block._varLastName = newName;
      }
      return newName;
    });
  }
}
```

**避免重复声明的实现模式**：
```javascript
// 避免重复添加库（需自己实现）
function ensureLibrary(generator, tag, includeCode) {
  if (!generator._addedLibraries) {
    generator._addedLibraries = new Set();
  }
  if (!generator._addedLibraries.has(tag)) {
    generator.addLibrary(tag, includeCode);
    generator._addedLibraries.add(tag);
  }
}

// 避免重复声明变量（使用generator内置机制）
generator.addVariable(varName, 'Type ' + varName + ';'); // generator会自动去重
```

### 2.4 设计模式总结

**关键设计原则**：
1. **初始化块**: 使用`field_input`让用户输入新变量名
2. **方法调用块**: 使用`field_variable`选择已存在变量，配置`variableTypes`
3. **input_value**: 必须在toolbox.json中配置影子块
4. **变量重命名**: 在generator.js中实现field validator监听

## 阶段三：实现规范

### 3.1 block.json设计模式

**标准块结构**：
```json
{
  "type": "库名_功能名",
  "message0": "直观的中文描述 %1 %2",
  "args0": [
    {
      "type": "field_variable",
      "name": "VAR",
      "variable": "defaultName",
      "variableTypes": ["CustomType"],
      "defaultType": "CustomType"
    },
    {"type": "input_value", "name": "PARAM", "check": ["类型"]}
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#统一颜色",
  "tooltip": "功能说明"
}
```

**事件处理块模式**：
```json
{
  "type": "mqtt_on_message",
  "message0": "MQTT客户端 %1 收到消息时执行",
  "args0": [
    {
      "type": "field_variable",
      "name": "CLIENT",
      "variable": "mqttClient",
      "variableTypes": ["PubSubClient"],
      "defaultType": "PubSubClient"
    }
  ],
  "message1": "%1",
  "args1": [{"type": "input_statement", "name": "HANDLER"}],
  "colour": "#9C27B0"
}
```

### 3.2 generator.js实现模式

**核心库函数（直接调用）**：
- `registerVariableToBlockly(varName, varType)` - 注册变量到Blockly系统
- `renameVariableInBlockly(block, oldName, newName, varType)` - 重命名变量

**Generator内置去重机制**：
- `generator.addLibrary()` - 自动避免重复添加相同库
- `generator.addVariable()` - 自动避免重复声明相同变量
- `generator.addFunction()` - 自动避免重复定义相同函数

**标准生成器结构**：
```javascript
Arduino.forBlock['block_type'] = function(block, generator) {
  // 1. 变量重命名监听（需自己实现，参考实际库代码）
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'defaultVar';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._varLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'VariableType');
          block._varLastName = newName;
        }
        return newName;
      });
    }
  }

  // 2. 参数提取
  const varName = block.getFieldValue('VAR') || 'defaultVar';

  // 3. 库和变量管理（generator自动去重）
  generator.addLibrary('LibraryTag', '#include <Library.h>');
  registerVariableToBlockly(varName, 'VariableType');
  generator.addVariable(varName, 'VariableType ' + varName + ';');

  // 4. 生成代码
  return varName + '.doSomething();\n';
};
```

**回调函数处理示例**：
```javascript
Arduino.forBlock['mqtt_on_message'] = function(block, generator) {
  const clientVar = block.getFieldValue('CLIENT') || 'client';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'mqtt_callback_' + clientVar;

  const functionDef = `void ${callbackName}(char* topic, byte* payload, unsigned int length) {
${handlerCode}
}`;

  generator.addFunction(callbackName, functionDef); // 自动去重
  return `${clientVar}.setCallback(${callbackName});\n`;
};
```

**完整实现示例（基于OneButton实际代码）**：
```javascript
Arduino.forBlock['onebutton_setup'] = function(block, generator) {
  // 1. 设置变量重命名监听（需自己实现）
  if (!block._onebuttonVarMonitorAttached) {
    block._onebuttonVarMonitorAttached = true;
    block._onebuttonVarLastName = block.getFieldValue('VAR') || 'button';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._onebuttonVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'OneButton'); // 核心库函数
          block._onebuttonVarLastName = newName;
        }
        return newName;
      });
    }
  }

  // 2. 参数提取
  const varName = block.getFieldValue('VAR') || 'button';
  const pin = block.getFieldValue('PIN');
  const pinMode = block.getFieldValue('PIN_MODE');
  const activeLow = block.getFieldValue('ACTIVE_LOW') === 'TRUE';

  // 3. 库和变量管理（generator自动去重）
  generator.addLibrary('#include <OneButton.h>', '#include <OneButton.h>');
  registerVariableToBlockly(varName, 'OneButton'); // 核心库函数
  generator.addVariable('OneButton ' + varName, 'OneButton ' + varName + ';');

  // 4. 自动添加tick()到主循环（generator自动去重）
  generator.addLoopBegin(varName + '.tick();', varName + '.tick();');

  // 5. 生成设置代码
  return varName + '.setup(' + pin + ', ' + pinMode + ', ' + activeLow + ');\n';
};
```

### 3.3 智能板卡适配与错误处理

**智能板卡适配（基于MQTT实际代码）**：
```javascript
// 根据板卡类型统一处理WiFi相关的addLibrary
function ensureWiFiLib(generator) {
  // 获取开发板配置
  const boardConfig = window['boardConfig'];

  if (boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1) {
    // ESP32系列开发板
    generator.addLibrary('WiFi', '#include <WiFi.h>');
  } else if (boardConfig && boardConfig.core && boardConfig.core.indexOf('renesas_uno') > -1) {
    // Arduino UNO R4 WiFi
    generator.addLibrary('WiFi', '#include <WiFiS3.h>');
  } else {
    // 默认使用ESP32的库
    generator.addLibrary('WiFi', '#include <WiFi.h>');
  }
}

// PubSubClient库确保函数
function ensurePubSubLib(generator) {
  generator.addLibrary('PubSubClient', '#include <PubSubClient.h>');
}

// 获取客户端名称的工具函数
function getClientName(block, def) {
  return block.getFieldValue('NAME') || def;
}
```

## 阶段四：toolbox.json配置

**input_value必须配置影子块**：
```json
{
  "kind": "block",
  "type": "pubsub_publish",
  "inputs": {
    "TOPIC": {"shadow": {"type": "text", "fields": {"TEXT": "topic"}}}
  }
}
```

**用户认知流程组织**：
```json
{
  "kind": "category",
  "name": "MQTT",
  "contents": [
    {"kind": "label", "text": "连接"},
    {"kind": "block", "type": "mqtt_create"},
    {"kind": "label", "text": "通信"},
    {"kind": "block", "type": "mqtt_publish"}
  ]
}
```

## 阶段五：package.json配置

```json
{
  "name": "@aily-project/lib-库名",
  "nickname": "显示名称",
  "description": "简洁功能描述（<50字）",
  "version": "语义化版本",
  "compatibility": {
    "core": [
      "arduino:avr",           // Arduino UNO/Nano/Pro Mini等
      "arduino:megaavr",       // Arduino UNO WiFi Rev2/Nano Every
      "arduino:samd",          // Arduino MKR系列/Zero
      "esp32:esp32",           // ESP32 DevKit/NodeMCU-32S等
      "esp8266:esp8266",       // ESP8266 NodeMCU/Wemos D1等
      "renesas_uno:unor4wifi", // Arduino UNO R4 WiFi
      "rp2040:rp2040"          // Raspberry Pi Pico/Arduino Nano RP2040
    ],
    "voltage": [3.3, 5]
  },
  "keywords": ["aily", "blockly", "功能关键词"],
  "tested": true,
  "tester": "测试者",
  "url": "原库链接"
}
```

**常用板卡配置示例**：
- **通用库**: `"core": []` (空数组表示支持所有板卡)
- **ESP32专用**: `"core": ["esp32:esp32"]`
- **Arduino经典**: `"core": ["arduino:avr", "arduino:megaavr"]`
- **物联网板卡**: `"core": ["esp32:esp32", "esp8266:esp8266", "renesas_uno:unor4wifi"]`

## 质量标准

### 功能完整性
- [ ] 覆盖原库80%+核心功能
- [ ] 支持主要使用场景
- [ ] 保持API语义一致

### 用户体验
- [ ] 新用户10分钟内上手
- [ ] 常用功能≤3步操作
- [ ] 错误信息清晰友好

### 代码质量
- [ ] 生成代码100%编译通过
- [ ] 运行时错误率<1%
- [ ] 内存使用合理

### 兼容性
- [ ] 支持目标板卡
- [ ] 版本向后兼容
- [ ] 性能满足要求

## 关键技术要点总结

### 设计模式
1. **初始化块**: 使用`field_input`让用户输入新变量名
2. **调用块**: 使用`field_variable`选择已存在变量，配置`variableTypes`
3. **input_value**: 必须在toolbox.json中配置影子块
4. **变量重命名**: 在generator.js中实现field validator监听

### 核心库函数
- `registerVariableToBlockly(varName, varType)` - 注册变量
- `renameVariableInBlockly(block, oldName, newName, varType)` - 重命名变量

### Generator机制
- `generator.addLibrary()` - 自动去重库引用
- `generator.addVariable()` - 自动去重变量声明
- `generator.addFunction()` - 自动去重函数定义

### 变量类型格式
```json
{
  "type": "field_variable",
  "name": "VAR",
  "variable": "defaultName",
  "variableTypes": ["CustomType"],
  "defaultType": "CustomType"
}
```

## 转换成功要素

1. **深度理解原库**: 分析API设计理念和使用模式
2. **用户导向设计**: 简化操作流程，优化交互体验
3. **高质量实现**: 确保代码生成正确性和效率，避免重复定义
4. **全面测试验证**: 保证功能完整性和兼容性
5. **持续优化改进**: 根据反馈不断完善

通过遵循本规范，正确使用核心库函数和generator内置机制，实现变量重命名监听和板卡适配，可以系统性地将Arduino库转换为高质量的Blockly库，提供直观高效的图形化编程体验。

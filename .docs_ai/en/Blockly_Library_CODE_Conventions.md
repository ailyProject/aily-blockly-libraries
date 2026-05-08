# Blockly Library Conversion Specification

## Overview

This specification is based on real conversion examples (ArduinoJson, OneButton, MQTT/PubSubClient, etc.) and provides a systematic approach for converting Arduino libraries into Blockly libraries. The goal is to help LLMs understand how to analyze an Arduino library, design user-friendly blocks, and implement high-quality code generation.

## Core Conversion Principles

1. **User Experience First**: Simplify complex APIs and provide intuitive operations
2. **Functional Completeness**: Cover the core features of the original library while preserving semantic consistency
3. **Intelligent Automation**: Automatically handle initialization, variable management, and error checking
4. **Type Safety**: Prevent connection errors through constraints
5. **Board Adaptation**: Intelligently adapt to different Arduino boards

## Conversion Workflow

```
Source Analysis → Block Design → block.json → generator.js → toolbox.json → Testing
       ↓               ↓             ↓              ↓               ↓           ↓
  API Extraction   Feature Cat.   Block Def.   Code Gen.      Toolbox Cfg.  Func. Test
  Example Study    User Flow      Field Design  Var Mgmt.     Shadow Blocks  Compat Test
```

## Blockly Library Structure
```
library-name
├─ block.json        // Block definitions
├─ generator.js      // Code generator
├─ toolbox.json      // Toolbox configuration
├─ README.md         // Human-readable documentation
├─ README_AI.md      // LLM-readable documentation
└─ src               // Arduino library source code
```

## Phase 1: Source Code Analysis

### 1.1 API Identification

**Header file analysis**:
```cpp
// PubSubClient.h core API
class PubSubClient {
  PubSubClient(Client& client);           // Constructor → Create block
  setServer(server, port);                // Config → Setup block
  setCallback(callback);                  // Callback → Event block
  connect(clientId, user, pass);          // Connect → Action block
  publish(topic, payload);                // Publish → Action block
  subscribe(topic);                       // Subscribe → Action block
  loop();                                 // Maintain → Auto-added
};
```

**Example pattern recognition**:
```cpp
// mqtt_basic.ino usage pattern
PubSubClient client(ethClient);          // Object creation
client.setServer(server, 1883);         // Server config
client.setCallback(callback);           // Callback setup
client.connect("arduinoClient");        // Connect
client.publish("outTopic", "hello");    // Publish message
client.subscribe("inTopic");            // Subscribe to topic
client.loop();                          // Maintain connection
```

### 1.2 Feature Classification Strategy

**By operation type**:
- **Initialization**: Object creation, basic configuration
- **Connection**: Network connection, authentication
- **Communication**: Send, receive, subscribe
- **Status**: Connection check, error state
- **Maintenance**: Keep connection alive, clean up resources
- **Quick Operations**: Complete complex workflows in one block (e.g. file read/write, data transfer)

**By user flow**:
```
Device Init → Network Connect → Service Config → Data Exchange → Status Monitor
                                                       ↓
                                               Quick Operation Mode
                                              (simplified workflow)
```

## Phase 2: block.json Design Specification

### 2.1 Block Type Mapping Rules

| Arduino Pattern | Block Type | Connection | Field Type | Design Notes |
|----------------|------------|------------|------------|--------------|
| Object creation / initialization | Statement | previousStatement/nextStatement | **field_input** | User enters variable name, auto-registered |
| **Global object method call** | **Statement** | **previousStatement/nextStatement** | **No variable field** | **Directly calls global object (Serial, httpUpdate, etc.), no creation needed** |
| Object method call | Statement | previousStatement/nextStatement | **field_variable** | References an already-created object variable |
| **Global object status query** | **Value** | **output: ["Type"]** | **No variable field** | **Directly returns global object state** |
| **Quick operation mode** | **Statement/Value** | **Standard** | **No variable field, direct params** | **Auto-generates helper functions, simplifies complex workflows** |
| Event callback | Hat block | **No previousStatement/nextStatement** | **field_variable + input_statement** | References object, contains code block, event-driven |
| Conditional callback | **Hybrid block** | **Has previousStatement/nextStatement** | **input_value + input_statement** | Sets specific condition callbacks within program flow |
| Status query | Value | output: ["Type"] | **field_variable** | References object, returns value |
| Data operation | Statement | previousStatement/nextStatement | **field_variable** | References object, operates on data |

### 2.2 Field Type Selection Principles

**Key difference between `field_input` and `field_variable`**:

1. **Use `field_input` for object initialization**:
   ```json
   {
     "type": "field_input",
     "name": "VAR",
     "text": "button1"  // User enters a new variable name
   }
   ```

2. **Use `field_variable` for object method calls**:
   ```json
   {
     "type": "field_variable",
     "name": "VAR",
     "variable": "button1",
     "variableTypes": ["OneButton"],
     "defaultType": "OneButton"
   }
   ```

3. **Global object direct call (no variable field needed)**:
   ```json
   {
     "type": "serial_println",
     "message0": "Serial %1 print %2 with newline",
     "args0": [
       {
         "type": "field_dropdown",
         "name": "SERIAL",
         "options": "${board.serialPort}"  // Select serial port, not a variable
       },
       {
         "type": "input_value",
         "name": "VAR"
       }
     ]
   }
   ```

4. **Quick operation mode (auto-generates helper function)**:
   ```json
   {
     "type": "esp32_sd_write_file_quick",
     "message0": "Quick write file path %1 content %2",
     "args0": [
       {
         "type": "input_value",
         "name": "PATH",
         "check": ["String"]
       },
       {
         "type": "input_value", 
         "name": "CONTENT",
         "check": ["String"]
       }
     ],
     "previousStatement": null,
     "nextStatement": null
   }
   ```

**Global object identification criteria**:
- **Platform built-ins**: `Serial`, `Wire`, `SPI`, `WiFi`, `httpUpdate`, `SPIFFS`, `ESP`, `EEPROM`, etc.
- **Library global instances**: Objects already declared as global instances in the header file
- **Singleton objects**: Objects designed for globally unique access

**Reading variable names in generator.js**:

- **`field_input`**:
  ```javascript
  const varName = block.getFieldValue('VAR') || 'button';
  ```

- **`field_variable`**:
  ```javascript
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';
  ```

- **Global object (direct use)**:
  ```javascript
  // No variable name needed — use the global object directly
  const serialPort = block.getFieldValue('SERIAL') || 'Serial';
  return serialPort + '.println(' + content + ');\n';
  ```

### 2.3 Standard Block Structure Templates

**Basic statement block**:
```json
{
  "type": "libname_funcname",
  "message0": "Descriptive label %1 %2",
  "args0": [
    {
      "type": "field_variable",
      "name": "VAR",
      "variable": "defaultName",
      "variableTypes": ["CustomType"],
      "defaultType": "CustomType"
    },
    {"type": "input_value", "name": "PARAM", "check": ["Type"]}
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#unified-color",
  "tooltip": "Description of the block's function"
}
```

**Global object call block**:
```json
{
  "type": "serial_println",
  "message0": "Serial %1 print %2 with newline",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "SERIAL",
      "options": "${board.serialPort}"
    },
    {"type": "input_value", "name": "VAR"}
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#48c2c4",
  "tooltip": "Print content to the specified serial port with newline"
}
```

**Global object status query block**:
```json
{
  "type": "httpupdate_get_last_error",
  "message0": "get last update error code",
  "output": "Number",
  "colour": "#FF9800",
  "tooltip": "Returns the error code of the last update attempt"
}
```

**Event handler block (hat mode)**:
```json
{
  "type": "onebutton_attach_click",
  "message0": "when button %1 is clicked",
  "args0": [
    {
      "type": "field_variable",
      "name": "VAR",
      "variable": "button",
      "variableTypes": ["OneButton"],
      "defaultType": "OneButton"
    }
  ],
  "message1": "do %1",
  "args1": [{"type": "input_statement", "name": "HANDLER"}],
  "colour": "#5CB85C",
  "tooltip": "Set the single-click event handler for a button"
}
```

> **Note**: Event callback blocks use **hat mode** — they have no `previousStatement` or `nextStatement` because they are event-driven and do not run in the main program flow.

**Hybrid block (conditional callback)**:
```json
{
  "type": "pubsub_set_callback_with_topic",
  "message0": "when topic %1 received do",
  "args0": [
    {
      "type": "input_value",
      "name": "TOPIC"
    }
  ],
  "message1": "%1",
  "args1": [{"type": "input_statement", "name": "HANDLER"}],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#9C27B0",
  "tooltip": "Handle a specific MQTT topic inside a callback"
}
```

> **Note**: Hybrid blocks **have both statement connections and a callback body**, used to define conditional callback logic within the main program flow.

### 2.4 Variable Management Core Mechanism

**Automatic variable registration (core library function)**:
```javascript
// Use the core library function to register without duplicates
registerVariableToBlockly(varName, varType);
```

**Variable rename listener (implement yourself)**:
```javascript
// Listen to VAR field changes and auto-rename the Blockly variable
if (!block._varMonitorAttached) {
  block._varMonitorAttached = true;
  block._varLastName = block.getFieldValue('VAR') || 'defaultName';
  // 初次注册变量到 Blockly 系统（仅执行一次）
  registerVariableToBlockly(block._varLastName, 'VariableType');
  const varField = block.getField('VAR');
  if (varField) {
    const originalFinishEditing = varField.onFinishEditing_;
    varField.onFinishEditing_ = function(newName) {
      if (typeof originalFinishEditing === 'function') {
        originalFinishEditing.call(this, newName);
      }
      const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
      const oldName = block._varLastName;
      if (workspace && newName && newName !== oldName) {
        renameVariableInBlockly(block, oldName, newName, 'VariableType');
        block._varLastName = newName;
      }
    };
  }
}
```

**Avoiding duplicate declarations**:
```javascript
// Both addLibrary and addVariable are auto-deduped by the generator — just call them directly
generator.addLibrary('LibraryTag', '#include <Library.h>'); // auto-deduped by generator
generator.addVariable(varName, 'Type ' + varName + ';');   // auto-deduped by generator
```

### 2.5 Design Pattern Summary

**Key design rules**:
1. **Init blocks**: Use `field_input` so users enter a new variable name
2. **Method call blocks**: Use `field_variable` to select an existing variable; set `variableTypes`
3. **`input_value` slots**: Must have shadow blocks configured in `toolbox.json`
4. **Variable rename**: Implement a field validator listener in `generator.js`

## Phase 3: Implementation Specification

### 3.1 block.json Design Notes

**block.json structure**: JSON array containing multiple block definition objects.

**Key points**:
- See Section 2.3 "Standard Block Structure Templates" for detailed templates
- Event callback blocks use hat mode — no connection attributes
- Hybrid blocks have connection attributes and contain a callback body
- All `input_value` slots must have shadow blocks configured in `toolbox.json`

### 3.2 generator.js Implementation Patterns

**Core library functions (call directly)**:
- `registerVariableToBlockly(varName, varType)` — Register a variable into the Blockly system
- `renameVariableInBlockly(block, oldName, newName, varType)` — Rename a variable

**Generator built-in deduplication**:
- `generator.addLibrary()` — Automatically avoids adding the same library twice
- `generator.addVariable()` — Automatically avoids duplicate variable declarations
- `generator.addFunction()` — Automatically avoids duplicate function definitions
- `generator.addObject()` — Automatically avoids duplicate object/variable declarations

**Standard generator structure (custom object)**:
```javascript
Arduino.forBlock['block_type'] = function(block, generator) {
  // 1. Variable rename listener (implement yourself — see real library code for reference)
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'defaultVar';
    // 初次注册变量到 Blockly 系统（仅执行一次）
    registerVariableToBlockly(block._varLastName, 'VariableType');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._varLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'VariableType');
          block._varLastName = newName;
        }
      };
    }
  }

  // 2. Extract parameters
  const varName = block.getFieldValue('VAR') || 'defaultVar';

  // 3. Library and variable management (auto-deduped by generator)
  generator.addLibrary('LibraryTag', '#include <Library.h>');
  registerVariableToBlockly(varName, 'VariableType');
  generator.addVariable(varName, 'VariableType ' + varName + ';');

  // 4. Generate code
  return varName + '.doSomething();\n';
};
```

**Global object generator structure (simplified)**:
```javascript
Arduino.forBlock['serial_println'] = function(block, generator) {
  // 1. Get parameters directly — no variable management needed
  const serialPort = block.getFieldValue('SERIAL') || 'Serial';
  const content = generator.valueToCode(block, 'VAR', generator.ORDER_ATOMIC) || '""';

  // 2. Add library only if needed
  // Arduino built-in Serial typically needs no library

  // 3. Generate code directly
  return serialPort + '.println(' + content + ');\n';
};
```

**ESP32 global object example**:
```javascript
Arduino.forBlock['httpupdate_get_last_error'] = function(block, generator) {
  // 1. Ensure library is included
  generator.addLibrary('ESP32httpUpdate', '#include <ESP32httpUpdate.h>');

  // 2. Call global object directly
  return ['httpUpdate.getLastError()', generator.ORDER_ATOMIC];
};
```

**Quick operation mode generator (auto-generates helper function)**:
```javascript
Arduino.forBlock['esp32_sd_write_file_quick'] = function(block, generator) {
  // 1. Get parameters — no variable management needed
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';

  // 2. Add required libraries
  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');

  // 3. Auto-generate helper function (with full error handling)
  let functionDef = '';
  functionDef += 'void writeFile(const char * path, const char * message) {\n';
  functionDef += '  File file = SD.open(path, FILE_WRITE);\n';
  functionDef += '  if (!file) {\n';
  functionDef += '    Serial.println("Failed to open file for writing");\n';
  functionDef += '    return;\n';
  functionDef += '  }\n';
  functionDef += '  if (file.print(message)) {\n';
  functionDef += '    Serial.println("File written");\n';
  functionDef += '  } else {\n';
  functionDef += '    Serial.println("Write failed");\n';
  functionDef += '  }\n';
  functionDef += '  file.close();\n';
  functionDef += '}\n';

  // 4. Register helper function (auto-deduped)
  generator.addFunction('writeFile_function', functionDef, true);
  
  // 5. Ensure Serial is initialized
  ensureSerialBegin("Serial", generator);

  // 6. Generate call code
  return 'writeFile(' + path + ', ' + content + ');\n';
};
```

**Callback function example (based on actual OneButton implementation)**:
```javascript
Arduino.forBlock['onebutton_attach_click'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'onebutton_click_' + varName;

  const functionDef = `void ${callbackName}() {
${handlerCode}
}`;

  let code = varName + '.attachClick(' + callbackName + ');\n';
  generator.addFunction(callbackName, functionDef); // auto-deduped
  generator.addSetupEnd(code, code);
  generator.addLoopBegin(varName + '.tick();', varName + '.tick();');

  return ''; // hat blocks return empty string
};
```

**Hybrid block example (based on actual MQTT implementation)**:
```javascript
Arduino.forBlock['pubsub_set_callback_with_topic'] = function(block, generator) {
  const topic = generator.valueToCode(block, 'TOPIC', generator.ORDER_ATOMIC) || '""';
  const callbackName = 'mqtt' + topic.replace(/[^a-zA-Z0-9]/g, '_') + '_sub_callback';
  const callbackBody = generator.statementToCode(block, 'HANDLER') || '';

  const functionDef = 'void ' + callbackName + '(const char* payload) {\n' + callbackBody + '}\n';
  generator.addFunction(callbackName, functionDef);
  
  // Generate conditional check code to be called inside the main callback
  let code = 'if (strcmp(topic, ' + topic + ') == 0) {\n' +
    '  ' + callbackName + '(payload_str);\n' +
    '}\n';
  
  return code; // hybrid blocks return their conditional check code
};
```

**Full implementation example (based on actual OneButton code)**:
```javascript
Arduino.forBlock['onebutton_setup'] = function(block, generator) {
  // 1. Set up variable rename listener (implement yourself)
  if (!block._onebuttonVarMonitorAttached) {
    block._onebuttonVarMonitorAttached = true;
    block._onebuttonVarLastName = block.getFieldValue('VAR') || 'button';
    // 初次注册变量到 Blockly 系统（仅执行一次）
    registerVariableToBlockly(block._onebuttonVarLastName, 'OneButton');
    const varField = block.getField('VAR');
    if (varField) {
      // 只在编辑完成时（按回车或失焦）触发重命名，避免每次输入都触发
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._onebuttonVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'OneButton');
          block._onebuttonVarLastName = newName;
        }
      };
    }
  }

  // 2. Extract parameters
  const varName = block.getFieldValue('VAR') || 'button';
  const pin = block.getFieldValue('PIN');
  const pinMode = block.getFieldValue('PIN_MODE');
  const activeLow = block.getFieldValue('ACTIVE_LOW') === 'TRUE';

  // 3. Library and variable management (auto-deduped by generator)
  generator.addLibrary('OneButton', '#include <OneButton.h>');  // first arg is dedup tag
  generator.addVariable('OneButton ' + varName, 'OneButton ' + varName + ';');

  // 4. Auto-add tick() to main loop (auto-deduped by generator)
  generator.addLoopBegin(varName + '.tick();', varName + '.tick();');

  // 5. Generate setup code
  return varName + '.setup(' + pin + ', ' + pinMode + ', ' + activeLow + ');\n';
};
```

### 3.3 Intelligent Board Adaptation

**Board-aware WiFi library (based on actual MQTT code)**:
```javascript
// Unified WiFi library selection based on board type
function ensureWiFiLib(generator) {
  const boardConfig = window['boardConfig'];

  if (boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1) {
    // ESP32 series
    generator.addLibrary('WiFi', '#include <WiFi.h>');
  } else if (boardConfig && boardConfig.core && boardConfig.core.indexOf('renesas_uno') > -1) {
    // Arduino UNO R4 WiFi
    generator.addLibrary('WiFi', '#include <WiFiS3.h>');
  } else {
    // Default to ESP32 library
    generator.addLibrary('WiFi', '#include <WiFi.h>');
  }
}

// Ensure PubSubClient library is included
function ensurePubSubLib(generator) {
  generator.addLibrary('PubSubClient', '#include <PubSubClient.h>');
}

// Utility function to get client name
function getClientName(block, def) {
  return block.getFieldValue('NAME') || def;
}
```

## Phase 4: toolbox.json Configuration

**All `input_value` slots must have shadow blocks**:
```json
{
  "kind": "block",
  "type": "pubsub_publish",
  "inputs": {
    "TOPIC": {"shadow": {"type": "text", "fields": {"TEXT": "topic"}}}
  }
}
```

**Organize by user cognitive flow**:
```json
{
  "kind": "category",
  "name": "MQTT",
  "contents": [
    {"kind": "label", "text": "Connection"},
    {"kind": "block", "type": "mqtt_create"},
    {"kind": "label", "text": "Communication"},
    {"kind": "block", "type": "mqtt_publish"}
  ]
}
```

## Phase 5: package.json Configuration

```json
{
  "name": "@aily-project/lib-libname",
  "nickname": "Display Name",
  "description": "Concise description (<50 chars)",
  "version": "semantic version",
  "author": "original library source author (use \"ailyProject\" if unknown)",
  "compatibility": {
    "core": [
      "arduino:avr",           // Arduino UNO/Nano/Pro Mini etc.
      "arduino:megaavr",       // Arduino UNO WiFi Rev2/Nano Every
      "arduino:samd",          // Arduino MKR series/Zero
      "esp32:esp32",           // ESP32 DevKit/NodeMCU-32S etc.
      "esp8266:esp8266",       // ESP8266 NodeMCU/Wemos D1 etc.
      "renesas_uno:unor4wifi", // Arduino UNO R4 WiFi
      "rp2040:rp2040"          // Raspberry Pi Pico/Arduino Nano RP2040
    ],
    "voltage": [3.3, 5]
  },
  "keywords": ["aily", "blockly", "feature-keyword"],
  "tested": true,
  "tester": "tester name",
  "url": "original library URL"
}
```

### Field Conventions

- **`name`**: Must follow the format `@aily-project/lib-libname`.
  - For libraries from a well-known hardware vendor (e.g. `adafruit`, `sparkfun`, `dfrobot`, `seeed`), prefix the library name with the vendor: `@aily-project/lib-adafruit-libname`.
  - The corresponding outer workspace directory must mirror the vendor-prefixed name using an underscore separator: `adafruit_libname/`.
- **`author`**: Must be the author of the **original (upstream) library source code**. If the original author is unknown or cannot be determined, use `"ailyProject"`.
- **`url`**: Should point to the original upstream library repository.

### Library Directory & Source Layout

For a library with the outer directory `adafruit_libname/`, the source code (`src/`) layout MUST follow this convention:

```
brand_libname/
├─ block.json
├─ generator.js
├─ toolbox.json
├─ package.json
├─ README.md
├─ README_AI.md
└─ src/
   ├─ libname/                 // The actual upstream library source goes inside its own subfolder
   │  ├─ libname.h
   │  ├─ libname.cpp
   │  └─ ...
   ├─ dependency-lib-1/        // Additional dependency source libraries (if any)
   │  └─ ...
   └─ dependency-lib-2/
      └─ ...
```

**Rules**:
- The upstream library source MUST live under `src/<libname>/` (a subfolder named after the library), **not** placed loose directly in `src/`.
- `src/` MAY contain multiple sibling subfolders when the library depends on additional source libraries — each dependency lives in its own subfolder under `src/`.
- The vendor prefix (e.g. `adafruit_`) appears only in the **outer** directory name and the npm `name`; the inner `src/<libname>/` folder uses the bare library name without the vendor prefix.

**Common board configuration examples**:
- **Universal library**: `"core": []` (empty array = all boards supported)
- **ESP32 only**: `"core": ["esp32:esp32"]`
- **Classic Arduino**: `"core": ["arduino:avr", "arduino:megaavr"]`
- **IoT boards**: `"core": ["esp32:esp32", "esp8266:esp8266", "renesas_uno:unor4wifi"]`

## Quality Standards

### Functional Completeness
- [ ] Covers 80%+ of the original library's core features
- [ ] Supports the main use cases
- [ ] Preserves API semantic consistency

### User Experience
- [ ] New users can get started within 10 minutes
- [ ] Common tasks require ≤3 steps
- [ ] Error messages are clear and friendly

### Code Quality
- [ ] Generated code compiles at 100%
- [ ] Runtime error rate < 1%
- [ ] Reasonable memory usage

### Compatibility
- [ ] Supports target boards
- [ ] Backward compatible across versions
- [ ] Meets performance requirements

---

## Key Technical Points Summary

### Design Patterns
1. **Init blocks**: Use `field_input` so users enter a new variable name
2. **Call blocks**: Use `field_variable` to select an existing variable; configure `variableTypes`
3. **Global object blocks**: No variable field needed — call global objects directly (e.g. `Serial`, `httpUpdate`)
4. **Quick operation blocks**: No variable management — auto-generate complete helper functions for complex workflows
5. **Event callback blocks**: Hat mode, no connection attributes, return empty string
6. **Hybrid blocks**: Have connection attributes, contain callback body, return conditional code
7. **`input_value` slots**: Must configure shadow blocks in `toolbox.json`
8. **Variable rename**: Implement a field validator listener in `generator.js`

### Reading Variable Names in generator.js
- **`field_input`**: `block.getFieldValue('VAR')`
- **`field_variable`**: `const varField = block.getField('VAR'); const varName = varField ? varField.getText() : 'default';`
- **Global objects**: Use the object name directly, e.g. `Serial`, `WiFi`, `httpUpdate`

### Global Object Handling Rules
- **Platform built-ins**: Basic objects (`Serial`, `Wire`, `SPI`) typically need no library include
- **Feature objects**: Specific objects (`WiFi`, `httpUpdate`) require their corresponding library
- **Library global instances**: Check whether the header already declares a global instance
- **Simplified design**: Global object blocks need no variable management or rename listener

### Core Library Functions
- `registerVariableToBlockly(varName, varType)` — Register a variable
- `renameVariableInBlockly(block, oldName, newName, varType)` — Rename a variable

### Generator Built-in Mechanisms
- `generator.addLibrary()` — Auto-deduped library includes
- `generator.addVariable()` — Auto-deduped variable declarations
- `generator.addFunction()` — Auto-deduped function definitions; adds functions to global scope
- `generator.addObject()` — Auto-deduped object/variable declarations; adds global objects, variable declarations, constants, etc.

### Quick Operation Mode Design Principles
- **User-friendly**: One block completes an entire workflow, no manual intermediate steps
- **Auto error handling**: Helper functions include full error checking and status feedback
- **Resource management**: Automatically handles open → use → close lifecycle
- **Status feedback**: Uses Serial output to report results for easy debugging
- **Code reuse**: Use `addFunction` to ensure helper functions are not duplicated
- **Serial initialization**: Use `ensureSerialBegin()` to ensure debug output works

### Variable Type Format
```json
{
  "type": "field_variable",
  "name": "VAR",
  "variable": "defaultName",
  "variableTypes": ["CustomType"],
  "defaultType": "CustomType"
}
```

---

## Keys to a Successful Conversion

1. **Deep understanding of the original library**: Analyze the API design philosophy and usage patterns
2. **User-oriented design**: Simplify workflows and optimize interaction
3. **Dual mode support**: Provide both standard mode (fine-grained control) and quick operation mode (simplified workflow)
4. **Intelligent helper functions**: Auto-generate helper functions with error handling and resource management
5. **High-quality implementation**: Ensure correct and efficient code generation with no duplicate definitions
6. **Thorough testing**: Guarantee functional completeness and compatibility
7. **Continuous improvement**: Refine based on feedback

**Quick operation mode applicable scenarios**:
- File system operations (read, write, append, delete, etc.)
- Network communication (HTTP requests, data transfer, etc.)
- Hardware control (sensor reading, actuator control, etc.)
- Data processing (format conversion, computation, etc.)

By following this specification — correctly using core library functions and generator built-in mechanisms, implementing variable rename listeners and board adaptation, and leveraging quick operation mode to simplify complex workflows — Arduino libraries can be systematically converted into high-quality Blockly libraries that provide an intuitive and efficient visual programming experience.

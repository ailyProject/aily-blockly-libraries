# Blockly Library i18n File Specification

This document defines the structure and authoring rules for Blockly library internationalization (i18n) files, for reference by LLMs.

---

## 1. File Structure

Each library must have an `i18n` folder in its root directory containing the following 11 language files:

```
lib-xxx/
├── block.json
├── generator.js
├── package.json
├── toolbox.json
└── i18n/
    ├── zh_cn.json    # Simplified Chinese (primary language)
    ├── en.json       # English
    ├── zh_hk.json    # Traditional Chinese (Hong Kong)
    ├── ja.json       # Japanese
    ├── ko.json       # Korean
    ├── de.json       # German
    ├── fr.json       # French
    ├── es.json       # Spanish
    ├── pt.json       # Portuguese
    ├── ru.json       # Russian
    └── ar.json       # Arabic
```

---

## 2. Basic JSON Structure

```json
{
  "toolbox_name": "Toolbox display name",
  "toolbox_labels": { "Original label text": "Translated label text" },  // Optional - translations for toolbox entries with "kind": "label"
  "toolbox_categories": ["Sub-cat 1", "Sub-cat 2"],  // Optional — translated sub-category names, in order
  "block_type_1": {
    "message0": "Block display text %1 param %2",
    "tooltip": "Block tooltip text",
    "args0": [...]  // Optional — used for dropdown option translations
  },
  "block_type_2": {
    "message0": "...",
    "tooltip": "..."
  },
  "extensions": {
    "extension_name": {
      "key1": "Translated text 1",
      "key2": "Translated text 2"
    }
  }
}
```

---

## 3. Toolbox Sub-category Translations

When a library's `toolbox.json` contains nested categories (sub-categories), their `name` fields must also be translated via the `toolbox_categories` key.

### 3.1 How It Works

- `toolbox_categories` is an **array** of translated sub-category names.
- The order of elements must **exactly match** the order of nested categories as they appear in `toolbox.json` (depth-first traversal).
- The runtime framework recursively walks the toolbox tree and replaces each sub-category `name` with the corresponding element from the array, by index.
- This works for **any nesting depth** (2-level, 3-level, etc.).

### 3.2 Example: Two-level Toolbox

**toolbox.json:**
```json
{
  "kind": "category",
  "name": "SerialTransfer",
  "contents": [
    {
      "kind": "category",
      "name": "串口传输",
      "contents": [...]
    },
    {
      "kind": "category",
      "name": "I2C 传输",
      "contents": [...]
    },
    {
      "kind": "category",
      "name": "SPI 传输",
      "contents": [...]
    }
  ]
}
```

**en.json:**
```json
{
  "toolbox_name": "SerialTransfer",
  "toolbox_categories": ["Serial Transfer", "I2C Transfer", "SPI Transfer"]
}
```

**zh_cn.json:**
```json
{
  "toolbox_name": "SerialTransfer",
  "toolbox_categories": ["串口传输", "I2C 传输", "SPI 传输"]
}
```

**ja.json:**
```json
{
  "toolbox_name": "SerialTransfer",
  "toolbox_categories": ["シリアル転送", "I2C 転送", "SPI 転送"]
}
```

### 3.3 Example: Three-level Toolbox

For toolboxes with deeper nesting, the array follows **depth-first order**. Nested sub-categories appear immediately after their parent category:

**toolbox.json (excerpt):**
```json
{
  "kind": "category",
  "name": "小智AI",
  "contents": [
    { "kind": "category", "name": "初始化", "contents": [...] },
    {
      "kind": "category",
      "name": "屏显示",
      "contents": [
        { "kind": "category", "name": "预内置", "contents": [...] },
        { "kind": "category", "name": "自定义", "contents": [...] }
      ]
    },
    { "kind": "category", "name": "控制", "contents": [...] }
  ]
}
```

**en.json:**
```json
{
  "toolbox_name": "XiaoZhi AI",
  "toolbox_categories": ["Initialize", "Display", "Built-in", "Custom", "Control"]
}
```

The order is: 初始化 → 屏显示 → 预内置 → 自定义 → 控制 (depth-first).

### 3.4 When to Use `toolbox_categories`

- **Required** when `toolbox.json` contains nested `"kind": "category"` entries.
- **Omit** when the toolbox has only a single root category with no sub-categories (most libraries).
- The array length must match the total number of nested sub-categories in `toolbox.json`.

---

## 4. Toolbox Label Translations

When a library's `toolbox.json` contains label entries, their `text` fields must be translated via the `toolbox_labels` key.

### 4.1 How It Works

- `toolbox_labels` is an **object** of original label text to translated label text.
- It is used only for toolbox entries whose object contains `"kind": "label"`.
- Each object key must exactly match the original `text` value in `toolbox.json`.
- Each object value must be translated into the target locale.

**toolbox.json:**
```json
{
  "kind": "category",
  "name": "Core I/O",
  "contents": [
    {
      "kind": "label",
      "text": "引脚配置"
    },
    {
      "kind": "block",
      "type": "io_pin_mode"
    }
  ]
}
```

**en.json:**
```json
{
  "toolbox_name": "Core I/O",
  "toolbox_labels": {
    "引脚配置": "Pin Configuration"
  }
}
```

### 4.2 When to Use `toolbox_labels`

- **Required** when `toolbox.json` contains `"kind": "label"` entries.
- **Omit** when the toolbox has no `"kind": "label"` entries.
- Do **not** use `toolbox_labels` for nested `"kind": "category"` names.
- Use `toolbox_categories` for nested toolbox category names.

---

## 5. Static Block Translations

### 5.1 Basic Blocks

```json
{
  "dht_init": {
    "message0": "Initialize DHT %1 sensor type %2",
    "tooltip": "Initialize a DHT temperature and humidity sensor"
  }
}
```

### 5.2 Blocks with Dropdowns

Dropdown options are translated via the `args0` array using the `options` field:

```json
{
  "math_arithmetic": {
    "message0": "%1 %2 %3",
    "tooltip": "Perform arithmetic on two numbers",
    "args0": [
      null,
      {
        "options": [
          ["Add (+)", "ADD"],
          ["Subtract (-)", "MINUS"],
          ["Multiply (×)", "MULTIPLY"],
          ["Divide (÷)", "DIVIDE"]
        ]
      },
      null
    ]
  }
}
```

**Note**: `null` entries in `args0` indicate positions that do not require translation (e.g. value inputs).

---

## 6. Dynamic Extension Translations

Dynamic extensions come in two types:

### 6.1 Dynamic Tooltip Extension

Used when the tooltip needs to change dynamically based on a dropdown selection.

**block.json configuration:**
```json
{
  "type": "math_single",
  "extensions": ["math_single_tooltip"]
}
```

**i18n file configuration:**
```json
{
  "extensions": {
    "math_single_tooltip": {
      "ROOT": "Square root: compute the square root of a number",
      "ABS": "Absolute value: return the absolute value of a number",
      "NEG": "Negate: return the opposite of a number",
      "LN": "Natural logarithm: compute the logarithm base e",
      "LOG10": "Common logarithm: compute the logarithm base 10",
      "EXP": "Exponent: compute e to the given power",
      "POW10": "Power of 10: compute 10 to the given power"
    }
  }
}
```

**generator.js implementation:**
```javascript
if (Blockly.Extensions.isRegistered('math_single_tooltip')) {
  Blockly.Extensions.unregister('math_single_tooltip');
}
Blockly.Extensions.register('math_single_tooltip', function() {
  // Read i18n translations
  const i18n = window.__BLOCKLY_LIB_I18N__?.['@aily-project/lib-core-math']?.extensions?.math_single_tooltip || {};
  
  // Fallback defaults
  const TOOLTIPS = {
    'ROOT': i18n.ROOT || 'Square root',
    'ABS': i18n.ABS || 'Absolute value',
    'NEG': i18n.NEG || 'Negate',
    'LN': i18n.LN || 'Natural logarithm',
    'LOG10': i18n.LOG10 || 'Logarithm base 10',
    'EXP': i18n.EXP || 'e^',
    'POW10': i18n.POW10 || '10^'
  };
  
  this.setTooltip(() => {
    const op = this.getFieldValue('OP');
    return TOOLTIPS[op] || '';
  });
});
```

### 6.2 Dynamic UI Extension

Used when a block's inputs or fields need to change dynamically based on a selection.

**i18n file configuration:**
```json
{
  "extensions": {
    "dht_init_dynamic": {
      "i2c_interface": "I2C Interface",
      "pin": "Pin"
    }
  }
}
```

**generator.js implementation:**
```javascript
if (Blockly.Extensions.isRegistered('dht_init_dynamic')) {
  Blockly.Extensions.unregister('dht_init_dynamic');
}
Blockly.Extensions.register('dht_init_dynamic', function () {
  // Read i18n translations
  const i18n = window.__BLOCKLY_LIB_I18N__?.['@aily-project/lib-dht']?.extensions?.dht_init_dynamic || {};
  const i2cLabel = i18n.i2c_interface || 'I2C Interface';
  const pinLabel = i18n.pin || 'Pin';

  this.updateShape_ = function (dhtType) {
    if (this.getInput('PIN_SET')) this.removeInput('PIN_SET');
    if (this.getInput('WIRE_SET')) this.removeInput('WIRE_SET');
    
    switch (dhtType) {
      case 'DHT20':
        this.appendDummyInput('WIRE_SET')
            .appendField(i2cLabel)
            .appendField(new Blockly.FieldDropdown(i2cOptions), 'WIRE');
        break;
      default:
        this.appendDummyInput('PIN_SET')
            .appendField(pinLabel)
            .appendField(new Blockly.FieldDropdown(pinOptions), 'PIN');
        break;
    }
  };
  
  // ... remaining code
});
```

---

## 7. Accessing i18n at Runtime

**Global object path:**
```javascript
window.__BLOCKLY_LIB_I18N__['@aily-project/lib-xxx']
```

**Accessing static translations:**
```javascript
const i18n = window.__BLOCKLY_LIB_I18N__?.['@aily-project/lib-xxx'];
const tooltip = i18n?.block_type?.tooltip || 'default';
```

**Accessing extension translations:**
```javascript
const extI18n = window.__BLOCKLY_LIB_I18N__?.['@aily-project/lib-xxx']?.extensions?.extension_name || {};
const label = extI18n.key || 'default';
```

---

## 8. Translation Reference

### 8.1 Common UI Element Translations

| English | Chinese | Japanese | Korean | German | French |
|---------|---------|----------|--------|--------|--------|
| Pin | 引脚 | ピン | 핀 | Pin | Broche |
| I2C Interface | I2C接口 | I2Cインターフェース | I2C 인터페이스 | I2C-Schnittstelle | Interface I2C |
| Initialize | 初始化 | 初期化 | 초기화 | Initialisieren | Initialiser |
| Read | 读取 | 読み取る | 읽기 | Lesen | Lire |
| Set | 设置 | 設定 | 설정 | Setzen | Définir |
| Temperature | 温度 | 温度 | 온도 | Temperatur | Température |
| Humidity | 湿度 | 湿度 | 습도 | Feuchtigkeit | Humidité |
| Sensor | 传感器 | センサー | 센서 | Sensor | Capteur |

### 8.2 Math Operation Translations

| Operation | English | Chinese | Japanese | Korean |
|-----------|---------|---------|----------|--------|
| ADD | Addition | 加法 | 加算 | 덧셈 |
| MINUS | Subtraction | 减法 | 減算 | 빺셈 |
| MULTIPLY | Multiplication | 乘法 | 乗算 | 곱셈 |
| DIVIDE | Division | 除法 | 除算 | 나눗셈 |
| MODULO | Modulo | 取模 | 剰余 | 나머지 |
| POWER | Power | 幂运算 | 累乗 | 거듭제곱 |

---

## 9. Implementation Checklist

When adding i18n support to a library, follow these steps:

- [ ] 1. Create the `i18n` folder
- [ ] 2. Create all 11 language JSON files
- [ ] 3. Add `toolbox_name` translations
- [ ] 4. If toolbox has sub-categories, add `toolbox_categories` array (order must match depth-first traversal of `toolbox.json`)
- [ ] 5. If toolbox has `"kind": "label"` entries, add `toolbox_labels` translations
- [ ] 6. Add `message0` and `tooltip` for every block
- [ ] 7. Add `args0.options` translations for all dropdowns
- [ ] 8. Identify all `extensions` references in `block.json`
- [ ] 9. Add `extensions.xxx` translations for each extension
- [ ] 10. Update extension code in `generator.js` to read from `window.__BLOCKLY_LIB_I18N__`
- [ ] 11. Ensure all hardcoded strings have fallback default values

---

## 10. Important Notes

1. **Always provide fallbacks**: All i18n accesses must include a default value to prevent errors when translations are missing
2. **Keep key names consistent**: Keys in extensions must match exactly what is used in the code
3. **Unregister before registering**: Use `isRegistered` to check and `unregister` before registering an extension
4. **Package name must match**: The key in `window.__BLOCKLY_LIB_I18N__` must exactly match the `name` field in `package.json`
5. **Do not use `Blockly.Msg`**: This project does not use `Blockly.Msg[key]`; always use `window.__BLOCKLY_LIB_I18N__` instead
6. **Sub-category order must match toolbox.json**: The `toolbox_categories` array elements must follow the exact depth-first order of nested categories in `toolbox.json`. The runtime replaces sub-category names by index
7. **Do not mix categories and labels**: Use `toolbox_categories` for `"kind": "category"` names and `toolbox_labels` only for `"kind": "label"` text

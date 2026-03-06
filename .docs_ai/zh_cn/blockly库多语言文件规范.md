# Blockly 库多语言文件规范

本文档规范了 Blockly 库的多语言（i18n）文件结构和编写方法，供大模型参考执行。

---

## 1. 文件结构

每个库需要在根目录下创建 `i18n` 文件夹，包含以下 11 个语言文件：

```
lib-xxx/
├── block.json
├── generator.js
├── package.json
├── toolbox.json
└── i18n/
    ├── zh_cn.json    # 简体中文（主语言）
    ├── en.json       # 英语
    ├── zh_hk.json    # 繁体中文（香港）
    ├── ja.json       # 日语
    ├── ko.json       # 韩语
    ├── de.json       # 德语
    ├── fr.json       # 法语
    ├── es.json       # 西班牙语
    ├── pt.json       # 葡萄牙语
    ├── ru.json       # 俄语
    └── ar.json       # 阿拉伯语
```

---

## 2. 基本 JSON 结构

```json
{
  "toolbox_name": "工具箱显示名称",
  "block_type_1": {
    "message0": "积木显示文本 %1 参数 %2",
    "tooltip": "积木提示文本",
    "args0": [...]  // 可选，用于下拉菜单选项翻译
  },
  "block_type_2": {
    "message0": "...",
    "tooltip": "..."
  },
  "extensions": {
    "extension_name": {
      "key1": "翻译文本1",
      "key2": "翻译文本2"
    }
  }
}
```

---

## 3. 静态积木翻译

### 3.1 基本积木

```json
{
  "dht_init": {
    "message0": "初始化 DHT %1 传感器 类型 %2",
    "tooltip": "初始化DHT温湿度传感器"
  }
}
```

### 3.2 带下拉菜单的积木

下拉菜单选项通过 `args0` 数组翻译，使用 `options` 字段：

```json
{
  "math_arithmetic": {
    "message0": "%1 %2 %3",
    "tooltip": "对两个数字进行算术运算",
    "args0": [
      null,
      {
        "options": [
          ["加(+)", "ADD"],
          ["减(-)", "MINUS"],
          ["乘(×)", "MULTIPLY"],
          ["除(÷)", "DIVIDE"]
        ]
      },
      null
    ]
  }
}
```

**注意**：`args0` 中的 `null` 表示该位置不需要翻译（如输入框）。

---

## 4. 动态扩展翻译

动态扩展分为两种类型：

### 4.1 动态 Tooltip 扩展

当 tooltip 需要根据下拉选项动态变化时使用。

**block.json 配置：**
```json
{
  "type": "math_single",
  "extensions": ["math_single_tooltip"]
}
```

**i18n 文件配置：**
```json
{
  "extensions": {
    "math_single_tooltip": {
      "ROOT": "平方根：计算数字的平方根",
      "ABS": "绝对值：返回数字的绝对值",
      "NEG": "取负：返回数字的相反数",
      "LN": "自然对数：计算以e为底的对数",
      "LOG10": "常用对数：计算以10为底的对数",
      "EXP": "指数：计算e的指定次方",
      "POW10": "10的幂：计算10的指定次方"
    }
  }
}
```

**generator.js 实现：**
```javascript
if (Blockly.Extensions.isRegistered('math_single_tooltip')) {
  Blockly.Extensions.unregister('math_single_tooltip');
}
Blockly.Extensions.register('math_single_tooltip', function() {
  // 获取i18n翻译
  const i18n = window.__BLOCKLY_LIB_I18N__?.['@aily-project/lib-core-math']?.extensions?.math_single_tooltip || {};
  
  // 默认值（fallback）
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

### 4.2 动态 UI 扩展

当积木的输入/字段需要根据选项动态变化时使用。

**i18n 文件配置：**
```json
{
  "extensions": {
    "dht_init_dynamic": {
      "i2c_interface": "I2C接口",
      "pin": "引脚"
    }
  }
}
```

**generator.js 实现：**
```javascript
if (Blockly.Extensions.isRegistered('dht_init_dynamic')) {
  Blockly.Extensions.unregister('dht_init_dynamic');
}
Blockly.Extensions.register('dht_init_dynamic', function () {
  // 获取i18n翻译
  const i18n = window.__BLOCKLY_LIB_I18N__?.['@aily-project/lib-dht']?.extensions?.dht_init_dynamic || {};
  const i2cLabel = i18n.i2c_interface || 'I2C接口';
  const pinLabel = i18n.pin || '引脚';

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
  
  // ... 其余代码
});
```

---

## 5. i18n 访问方式

**全局对象路径：**
```javascript
window.__BLOCKLY_LIB_I18N__['@aily-project/lib-xxx']
```

**访问静态翻译：**
```javascript
const i18n = window.__BLOCKLY_LIB_I18N__?.['@aily-project/lib-xxx'];
const tooltip = i18n?.block_type?.tooltip || 'default';
```

**访问扩展翻译：**
```javascript
const extI18n = window.__BLOCKLY_LIB_I18N__?.['@aily-project/lib-xxx']?.extensions?.extension_name || {};
const label = extI18n.key || 'default';
```

---

## 6. 多语言翻译参考

### 6.1 常用 UI 元素翻译

| 中文 | 英语 | 日语 | 韩语 | 德语 | 法语 |
|------|------|------|------|------|------|
| 引脚 | Pin | ピン | 핀 | Pin | Broche |
| I2C接口 | I2C Interface | I2Cインターフェース | I2C 인터페이스 | I2C-Schnittstelle | Interface I2C |
| 初始化 | Initialize | 初期化 | 초기화 | Initialisieren | Initialiser |
| 读取 | Read | 読み取る | 읽기 | Lesen | Lire |
| 设置 | Set | 設定 | 설정 | Setzen | Définir |
| 温度 | Temperature | 温度 | 온도 | Temperatur | Température |
| 湿度 | Humidity | 湿度 | 습도 | Feuchtigkeit | Humidité |
| 传感器 | Sensor | センサー | 센서 | Sensor | Capteur |

### 6.2 数学运算翻译

| 操作 | 中文 | 英语 | 日语 | 韩语 |
|------|------|------|------|------|
| ADD | 加法 | Addition | 加算 | 덧셈 |
| MINUS | 减法 | Subtraction | 減算 | 뺄셈 |
| MULTIPLY | 乘法 | Multiplication | 乗算 | 곱셈 |
| DIVIDE | 除法 | Division | 除算 | 나눗셈 |
| MODULO | 取模 | Modulo | 剰余 | 나머지 |
| POWER | 幂运算 | Power | 累乗 | 거듭제곱 |

---

## 7. 执行检查清单

为库添加多语言支持时，按以下步骤执行：

- [ ] 1. 创建 `i18n` 文件夹
- [ ] 2. 创建 11 个语言 JSON 文件
- [ ] 3. 添加 `toolbox_name` 翻译
- [ ] 4. 为每个积木添加 `message0` 和 `tooltip`
- [ ] 5. 为下拉菜单添加 `args0.options` 翻译
- [ ] 6. 识别 `block.json` 中的 `extensions` 引用
- [ ] 7. 为每个扩展添加 `extensions.xxx` 翻译
- [ ] 8. 更新 `generator.js` 中的扩展代码，使用 `window.__BLOCKLY_LIB_I18N__`
- [ ] 9. 确保所有硬编码文本都有 fallback 默认值

---

## 8. 注意事项

1. **始终提供 fallback**：所有 i18n 访问都要提供默认值，防止翻译缺失时出错
2. **保持键名一致**：扩展中的键名应与代码中使用的保持一致
3. **注册前先注销**：扩展注册前使用 `isRegistered` 检查并 `unregister`
4. **包名匹配**：`window.__BLOCKLY_LIB_I18N__` 的键必须与 `package.json` 中的 `name` 完全一致
5. **不使用 Blockly.Msg**：本项目不使用 `Blockly.Msg[key]`，统一使用 `window.__BLOCKLY_LIB_I18N__`

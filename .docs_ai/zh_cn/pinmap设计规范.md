# Pinmap 设计规范

## 1. 概念总览

Pinmap 系统管理硬件组件（开发板、传感器、模块）的**引脚定义**，支持可视化连线图生成。

**核心概念：**
- **pinmapId**：三段式唯一标识 `{packageSlug}:{modelId}:{variantId}`
- **pinmap_catalog.json**：库级目录文件，声明库中所有型号和变体
- **ComponentConfig JSON**：单个组件的完整引脚配置（pinmap 文件）

**标识符示例：**
| pinmapId | 含义 |
|---|---|
| `lib-dht:dht20:seeed` | DHT 库 → DHT20 型号 → Seeed 变体 |
| `board-xiao_esp32s3:xiao_esp32s3:default` | XIAO ESP32S3 开发板 → 默认变体 |
| `lib-u8g2:ssd1306:128x64_i2c` | U8G2 库 → SSD1306 → 128x64 I2C 变体 |

---

## 2. 文件结构

```
@aily-project/{packageSlug}/
├── pinmap_catalog.json          # 库目录（必须）
├── pinmaps/
│   ├── {modelId}_{variantId}.json  # 各变体的 pinmap 文件
│   └── ...
└── README.md                    # 库文档（可选，供参考）
```

---

## 3. pinmap_catalog.json 格式

```json
{
  "version": "1.0.0",
  "library": "@aily-project/lib-dht",
  "displayName": "DHT 温湿度传感器系列",
  "type": "library",
  "models": [
    {
      "id": "dht20",
      "name": "DHT20",
      "description": "I2C 数字温湿度传感器",
      "defaultVariant": "seeed",
      "variants": [
        {
          "id": "seeed",
          "name": "Seeed Studio Grove",
          "fullId": "lib-dht:dht20:seeed",
          "pinmapFile": "pinmaps/dht20_seeed.json",
          "protocol": "i2c",
          "status": "available",
          "isDefault": true,
          "previewPins": ["VCC", "SDA", "SCL", "GND"]
        }
      ]
    }
  ]
}
```

**字段说明：**
- `type`: `"library"` | `"board"` | `"software"`
- `status`: `"available"`（pinmap 文件已存在） | `"needs_generation"`（待生成）
- `protocol`: `"i2c"` | `"spi"` | `"uart"` | `"digital"` | `"analog"` | `"pwm"` | `"other"`
- `pinmapFile`: 相对于库根目录的 pinmap JSON 路径

---

## 4. ComponentConfig JSON（pinmap 文件）

这是 pinmap 的核心数据结构，每个文件描述一个组件变体的完整引脚定义。

### 4.1 完整结构

```typescript
interface ComponentConfig {
  id: string;                    // "component_{modelId}_{variantId}"
  name: string;                  // 组件显示名称
  width: number;                 // 画布宽度（像素）
  height: number;                // 画布高度（像素）
  images: ComponentImage[];      // 组件外观图片（base64）
  pins: ConfigPin[];             // 引脚列表
  functionTypes: FunctionTypeDef[]; // 使用的功能类型及颜色
}

interface ComponentImage {
  url?: string;      // 可选："data:image/png;base64,..." 或 "data:image/webp;base64,..."
                     // 省略时前端根据 width/height 自动渲染默认占位框
  x: number;         // 图片左上角 x
  y: number;         // 图片左上角 y
  width: number;     // 图片宽度
  height: number;    // 图片高度
}

interface ConfigPin {
  id: string;                           // "pin_1", "pin_2", ...（从 1 开始）
  x: number;                            // 引脚圆点 x 坐标
  y: number;                            // 引脚圆点 y 坐标
  labelX: number;                       // 标签文字 x 坐标
  labelY: number;                       // 标签文字 y 坐标（= y - 7）
  layout: "horizontal";                 // 固定为 horizontal
  functions: PinFunction[];             // 该引脚支持的功能列表
  labelAnchor?: "left" | "right";       // 文字对齐方向
  visible?: boolean;                    // 默认 true
  disabled?: boolean;                   // 默认 false
}

interface PinFunction {
  name: string;      // 功能名称，如 "SDA", "3V3", "D0"
  type: string;      // 功能类型，见下方类型表
  visible?: boolean;  // 默认 true
  disabled?: boolean; // 默认 false
}

interface FunctionTypeDef {
  value: string;      // 类型标识，如 "i2c"
  label: string;      // 显示标签，如 "I2C"
  color: string;      // 颜色，如 "#8B5CF6"
  textColor: string;  // 文字颜色，通常 "#FFFFFF"
}
```

### 4.2 功能类型与颜色

| type | label | color | 说明 |
|------|-------|-------|------|
| `power` | VCC | `#EF4444` (红) | 电源 |
| `gnd` | GND | `#000000` (黑) | 接地 |
| `i2c` | I2C | `#8B5CF6` (紫) | I2C 总线 |
| `spi` | SPI | `#EC4899` (粉) | SPI 总线 |
| `uart` | UART | `#F59E0B` (橙) | 串口 |
| `digital` | Digital | `#3B82F6` (蓝) | 数字 IO |
| `gpio` | GPIO | `#3B82F6` (蓝) | 通用 IO |
| `analog` | Analog | `#10B981` (绿) | 模拟信号 |
| `pwm` | PWM | `#06B6D4` (青) | PWM 输出 |
| `other` | Other | `#9CA3AF` (灰) | 其他 |

> `functionTypes` 数组只需包含该组件实际使用的类型。

---

## 5. 生成规则

### 5.1 id 命名

```
component_{modelId}_{variantId}
```
例：`component_dht20_seeed`

### 5.2 尺寸计算

```
height = max(左侧引脚数, 右侧引脚数) × 20 + 40
width  = 根据引脚名称长度调整，通常 120~200
```

- 简单传感器（4 引脚）：`width=200, height=100~160`
- 开发板（14 引脚, 7+7）：`width=144, height=176`
- 如果引脚名较长，适当增大 width

### 5.3 引脚定位

**左侧引脚（从上到下）：**
```
x ≈ 10
y = 32 + (index × 20)       // 首引脚 y≈32，间距 20
labelX ≈ -20
labelY = y - 7
labelAnchor = "right"        // 文字右对齐到 labelX
```

**右侧引脚（从上到下）：**
```
x ≈ width - 15
y = 32 + (index × 20)
labelX ≈ width + 12
labelY = y - 7
labelAnchor = "left"         // 文字左对齐从 labelX 起
```

### 5.4 images 字段

- **必须包含** `images` 数组（即使只有一个空对象）
- `url` 为**可选字段**：有真实图片时提供 base64，省略时前端根据 `width`/`height` 自动渲染默认占位框
- 图片覆盖整个组件区域：`x≈0, y≈0, width≈组件width, height≈组件height`
- 对于需要快速生成的传感器 pinmap，直接省略 `url` 即可

### 5.5 单功能引脚 vs 多功能引脚

**简单传感器**（如 DHT20）：每个引脚只有一个功能
```json
{ "id": "pin_1", "functions": [{ "name": "GND", "type": "gnd" }] }
```

**开发板**（如 XIAO ESP32S3）：每个引脚有多个可选功能
```json
{
  "id": "pin_5",
  "functions": [
    { "name": "D4", "type": "digital" },
    { "name": "A4", "type": "analog" },
    { "name": "SDA", "type": "i2c" },
    { "name": "GPIO5", "type": "gpio" }
  ]
}
```
> 连线系统会自动解析引脚功能匹配。

### 5.6 简化规则（推荐用于批量生成）

生成 pinmap 时可**省略以下字段**，减少冗余：

| 可省略字段 | 说明 |
|---|---|
| `images[].url` | 省略时前端渲染默认框 |
| `visible: true` | 引脚及 function 的默认值 |
| `disabled: false` | 引脚及 function 的默认值 |
| `texts / rects / ellipses / lines` | 运行时渲染字段，空数组无需写入 |
| 左侧引脚的 `labelAnchor` | 左侧默认为 `"right"`；右侧必须写 `"left"` |

**最简 I2C 传感器 pinmap 示例（4 引脚）：**

```json
{
  "id": "component_bh1750_module",
  "name": "BH1750 光照传感器",
  "width": 200,
  "height": 120,
  "images": [{ "x": 0, "y": 0, "width": 200, "height": 120 }],
  "pins": [
    { "id": "pin_1", "x": 10, "y": 32, "labelX": -20, "labelY": 25, "layout": "horizontal", "labelAnchor": "right", "functions": [{ "name": "VCC", "type": "power" }] },
    { "id": "pin_2", "x": 10, "y": 52, "labelX": -20, "labelY": 45, "layout": "horizontal", "labelAnchor": "right", "functions": [{ "name": "GND", "type": "gnd" }] },
    { "id": "pin_3", "x": 10, "y": 72, "labelX": -20, "labelY": 65, "layout": "horizontal", "labelAnchor": "right", "functions": [{ "name": "SDA", "type": "i2c" }] },
    { "id": "pin_4", "x": 10, "y": 92, "labelX": -20, "labelY": 85, "layout": "horizontal", "labelAnchor": "right", "functions": [{ "name": "SCL", "type": "i2c" }] }
  ],
  "functionTypes": [
    { "value": "power", "label": "VCC", "color": "#EF4444", "textColor": "#FFFFFF" },
    { "value": "gnd",   "label": "GND", "color": "#000000", "textColor": "#FFFFFF" },
    { "value": "i2c",   "label": "I2C", "color": "#8B5CF6", "textColor": "#FFFFFF" }
  ]
}
```

---

## 6. 完整示例

### 6.1 I2C 传感器（4 引脚，单侧）

DHT20 温湿度传感器，Grove 4pin 接口：

```json
{
  "id": "component_dht20_seeed",
  "name": "Grove DHT20",
  "width": 320,
  "height": 160,
  "images": [{
    "url": "data:image/png;base64,iVBOR...",
    "x": -1, "y": -16, "width": 336, "height": 188.6
  }],
  "pins": [
    {
      "id": "pin_1", "x": 22, "y": 53,
      "labelX": -53.3, "labelY": 46, "layout": "horizontal",
      "functions": [{ "name": "GND", "type": "gnd" }]
    },
    {
      "id": "pin_2", "x": 22, "y": 69.37,
      "labelX": -53.3, "labelY": 62.37, "layout": "horizontal",
      "functions": [{ "name": "VCC", "type": "power" }]
    },
    {
      "id": "pin_3", "x": 22, "y": 85.73,
      "labelX": -53.3, "labelY": 78.73, "layout": "horizontal",
      "functions": [{ "name": "SDA", "type": "i2c" }]
    },
    {
      "id": "pin_4", "x": 22, "y": 102.1,
      "labelX": -53.3, "labelY": 95.1, "layout": "horizontal",
      "functions": [{ "name": "SCL", "type": "i2c" }]
    }
  ],
  "functionTypes": [
    { "value": "power", "label": "VCC", "color": "#EF4444", "textColor": "#FFFFFF" },
    { "value": "gnd", "label": "GND", "color": "#000000", "textColor": "#FFFFFF" },
    { "value": "i2c", "label": "I2C", "color": "#8B5CF6", "textColor": "#FFFFFF" }
  ]
}
```

### 6.2 开发板（14 引脚，双侧 7+7）

XIAO ESP32S3，左侧 7 引脚 + 右侧 7 引脚：

```json
{
  "id": "component_xiao_esp32s3",
  "name": "XIAO ESP32S3",
  "width": 144,
  "height": 176,
  "images": [{
    "url": "data:image/webp;base64,UklG...",
    "x": 0.8, "y": -3.5, "width": 139.4, "height": 176.1
  }],
  "pins": [
    {
      "id": "pin_1", "x": 10.3, "y": 32.8,
      "labelX": -20.2, "labelY": 25.8, "layout": "horizontal",
      "labelAnchor": "right",
      "functions": [
        { "name": "D0", "type": "digital" },
        { "name": "A0", "type": "analog" },
        { "name": "GPIO1", "type": "gpio" }
      ]
    },
    {
      "id": "pin_8", "x": 129.4, "y": 32.8,
      "labelX": 156.4, "labelY": 25.8, "layout": "horizontal",
      "functions": [{ "name": "5V", "type": "power" }]
    }
  ],
  "functionTypes": [
    { "value": "power", "label": "VCC", "color": "#EF4444", "textColor": "#FFFFFF" },
    { "value": "gnd", "label": "GND", "color": "#000000", "textColor": "#FFFFFF" },
    { "value": "digital", "label": "Digital", "color": "#3B82F6", "textColor": "#FFFFFF" },
    { "value": "analog", "label": "Analog", "color": "#10B981", "textColor": "#FFFFFF" },
    { "value": "uart", "label": "UART", "color": "#F59E0B", "textColor": "#FFFFFF" },
    { "value": "i2c", "label": "I2C", "color": "#8B5CF6", "textColor": "#FFFFFF" },
    { "value": "spi", "label": "SPI", "color": "#EC4899", "textColor": "#FFFFFF" },
    { "value": "gpio", "label": "GPIO", "color": "#e6d200", "textColor": "#FFFFFF" }
  ]
}
```

> 注：示例中省略了部分引脚，实际应包含所有引脚。

### 6.3 无图片的最简传感器（推荐批量生成格式）

```json
{
  "id": "component_dht11_module",
  "name": "DHT11 温湿度传感器模块",
  "width": 200,
  "height": 100,
  "images": [{ "x": 0, "y": 0, "width": 200, "height": 100 }],
  "pins": [
    { "id": "pin_1", "x": 10, "y": 32, "labelX": -20, "labelY": 25, "layout": "horizontal", "labelAnchor": "right", "functions": [{ "name": "VCC",  "type": "power"   }] },
    { "id": "pin_2", "x": 10, "y": 52, "labelX": -20, "labelY": 45, "layout": "horizontal", "labelAnchor": "right", "functions": [{ "name": "DATA", "type": "digital" }] },
    { "id": "pin_3", "x": 10, "y": 72, "labelX": -20, "labelY": 65, "layout": "horizontal", "labelAnchor": "right", "functions": [{ "name": "GND",  "type": "gnd"     }] }
  ],
  "functionTypes": [
    { "value": "power",   "label": "VCC",     "color": "#EF4444", "textColor": "#FFFFFF" },
    { "value": "digital", "label": "Digital", "color": "#3B82F6", "textColor": "#FFFFFF" },
    { "value": "gnd",     "label": "GND",     "color": "#000000", "textColor": "#FFFFFF" }
  ]
}
```


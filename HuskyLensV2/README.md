# HuskyLensV2 AI摄像头

DFRobot HuskyLensV2 AI视觉传感器库，支持人脸识别、物体追踪、巡线、颜色识别、二维码识别、标签识别、物体分类、条形码识别等多种AI功能，以及知识库管理、音乐播放、绘图等高级功能。

## 库信息
- **库名**: @aily-project/lib-huskylensv2
- **版本**: 1.0.0
- **兼容**: 通用（Arduino AVR、ESP32、ESP8266等）

## 块定义

### 初始化类

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|
| `huskylensv2_init_i2c_until` | 语句块 | VAR(field_input), WIRE(dropdown) | `"VAR":"huskylens"` | `huskylens.begin(Wire);` |
| `huskylensv2_init_i2c` | 语句块 | VAR(field_input), WIRE(dropdown) | `"VAR":"huskylens"` | `huskylens.begin(Wire);` |
| `huskylensv2_init_serial` | 语句块 | VAR(field_input), SERIAL(dropdown) | `"VAR":"huskylens"` | `huskylens.begin(Serial1);` |

### 算法设置类

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|
| `huskylensv2_set_algorithm` | 语句块 | VAR(field_variable), ALGORITHM(dropdown) | `"VAR":{"id":"..."}` | `huskylens.switchAlgorithm(...);` |
| `huskylensv2_set_algorithm_until` | 语句块 | VAR(field_variable), ALGORITHM(dropdown) | `"VAR":{"id":"..."}` | `huskylens.switchAlgorithm(...);` |

### 数据获取类

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|
| `huskylensv2_get_result` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.getResult();` |
| `huskylensv2_available` | 值块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.available()` |
| `huskylensv2_count_learned` | 值块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.countLearned()` |
| `huskylensv2_count_id` | 值块 | VAR(field_variable), ID(input) | `"VAR":{"id":"..."}` | `huskylens.countID(1)` |

### 结果获取类

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|
| `huskylensv2_get_center` | 值块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.readBlockDirect(0)` |
| `huskylensv2_get_by_index` | 值块 | VAR(field_variable), INDEX(input) | `"VAR":{"id":"..."}` | `huskylens.readBlockDirect(0)` |
| `huskylensv2_get_by_id` | 值块 | VAR(field_variable), ID(input) | `"VAR":{"id":"..."}` | `huskylens.readBlockByID(1)` |
| `huskylensv2_get_by_id_index` | 值块 | VAR(field_variable), ID(input), INDEX(input) | `"VAR":{"id":"..."}` | `huskylens.readBlockByID(1, 0)` |

### 学习功能类

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|
| `huskylensv2_learn` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.learn();` |
| `huskylensv2_learn_block` | 语句块 | VAR(field_variable), X/Y/WIDTH/HEIGHT(input) | `"VAR":{"id":"..."}` | `huskylens.learn(0, 0, 100, 100);` |
| `huskylensv2_forget` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.forget();` |

### 拍照截图类

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|
| `huskylensv2_take_photo` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.takePhoto();` |
| `huskylensv2_take_screenshot` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.takeScreenshot();` |

### 绘图功能类

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|
| `huskylensv2_draw_rect` | 语句块 | VAR(field_variable), LINEWIDTH/X/Y/WIDTH/HEIGHT(input) | `"VAR":{"id":"..."}` | `huskylens.drawRectangle(2, 0, 0, 100, 100);` |
| `huskylensv2_draw_unique_rect` | 语句块 | VAR(field_variable), LINEWIDTH/X/Y/WIDTH/HEIGHT(input) | `"VAR":{"id":"..."}` | `huskylens.drawUniqueRectangle(2, 0, 0, 100, 100);` |
| `huskylensv2_clear_rect` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.clearRectangle();` |
| `huskylensv2_draw_text` | 语句块 | VAR(field_variable), FONTSIZE/X/Y/TEXT(input) | `"VAR":{"id":"..."}` | `huskylens.drawText(16, 10, 10, "Hello");` |
| `huskylensv2_clear_text` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.clearText();` |

### 知识库管理类

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|
| `huskylensv2_save_knowledge` | 语句块 | VAR(field_variable), ID(input) | `"VAR":{"id":"..."}` | `huskylens.saveKnowledge(1);` |
| `huskylensv2_load_knowledge` | 语句块 | VAR(field_variable), ID(input) | `"VAR":{"id":"..."}` | `huskylens.loadKnowledge(1);` |

### 音乐播放类

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|
| `huskylensv2_play_music` | 语句块 | VAR(field_variable), NAME/VOLUME(input) | `"VAR":{"id":"..."}` | `huskylens.playMusic("music", 50);` |

### 设置名称类

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|
| `huskylensv2_set_name` | 语句块 | VAR(field_variable), ID/NAME(input) | `"VAR":{"id":"..."}` | `huskylens.setName(1, "Name");` |

### 结果属性类

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|
| `huskylensv2_result_id` | 值块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.readBlockDirect(0).ID` |
| `huskylensv2_result_x` | 值块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.readBlockDirect(0).xCenter` |
| `huskylensv2_result_y` | 值块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.readBlockDirect(0).yCenter` |
| `huskylensv2_result_width` | 值块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.readBlockDirect(0).width` |
| `huskylensv2_result_height` | 值块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.readBlockDirect(0).height` |
| `huskylensv2_result_name` | 值块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.readBlockDirect(0).name` |
| `huskylensv2_result_content` | 值块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.readBlockDirect(0).content` |
| `huskylensv2_result_confidence` | 值块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.readBlockDirect(0).confidence` |
| `huskylensv2_result_type` | 值块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.readBlockDirect(0).type` |
| `huskylensv2_is_valid` | 值块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.readBlockDirect(0).valid` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "huskylens"` |
| field_dropdown | 字符串 | `"WIRE": "Wire"` |
| field_variable | 对象 | `"VAR": {"id": "var_id"}` |
| input_value | 块连接 | `"inputs": {"INDEX": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **初始化块**: 使用field_input创建新变量
- **方法块**: 使用field_variable引用已创建的变量

## 支持的算法

| 算法 | 说明 |
|------|------|
| ALGORITHM_FACE_RECOGNITION | 人脸识别 |
| ALGORITHM_OBJECT_TRACKING | 物体追踪 |
| ALGORITHM_OBJECT_RECOGNITION | 物体识别 |
| ALGORITHM_LINE_TRACKING | 巡线追踪 |
| ALGORITHM_COLOR_RECOGNITION | 颜色识别 |
| ALGORITHM_TAG_RECOGNITION | 标签识别 |
| ALGORITHM_OBJECT_CLASSIFICATION | 物体分类 |
| ALGORITHM_QR_RECOGNITION | 二维码识别 |
| ALGORITHM_BARCODE_RECOGNITION | 条形码识别 |

## 结果属性

- `ID`: 识别ID
- `xCenter`: X中心坐标
- `yCenter`: Y中心坐标
- `width`: 宽度
- `height`: 高度
- `name`: 名称
- `content`: 内容
- `confidence`: 置信度
- `type`: 类型
- `valid`: 是否有效

## 使用示例

### 人脸识别
```
[初始化 HuskyLensV2 huskylens I2C接口 Wire]
[HuskyLensV2 huskylens 切换算法为 人脸识别]

[重复执行]
  [HuskyLensV2 huskylens 获取结果]
  [如果 [HuskyLensV2 huskylens 检测到数据数量] > 0 执行]
    [串口输出 "X:" [HuskyLensV2 huskylens 获取结果X坐标]]
    [串口输出 "Y:" [HuskyLensV2 huskylens 获取结果Y坐标]]
```

### 物体追踪
```
[初始化 HuskyLensV2 huskylens I2C接口 Wire]
[HuskyLensV2 huskylens 切换算法为 物体追踪]

[重复执行]
  [HuskyLensV2 huskylens 获取结果]
  [如果 [HuskyLensV2 huskylens 检测到数据数量] > 0 执行]
    [串口输出 "ID:" [HuskyLensV2 huskylens 获取结果ID]]
    [串口输出 "宽度:" [HuskyLensV2 huskylens 获取结果宽度]]
```

### 学习功能
```
[初始化 HuskyLensV2 huskylens I2C接口 Wire]
[HuskyLensV2 huskylens 切换算法为 物体识别]

[重复执行]
  [HuskyLensV2 huskylens 获取结果]
  [如果 [HuskyLensV2 huskylens 检测到数据数量] > 0 执行]
    [HuskyLensV2 huskylens 学习]
    [串口输出 "已学习ID:" [HuskyLensV2 huskylens 获取结果ID]]
```

### 绘图功能
```
[初始化 HuskyLensV2 huskylens I2C接口 Wire]
[HuskyLensV2 huskylens 切换算法为 人脸识别]

[重复执行]
  [HuskyLensV2 huskylens 获取结果]
  [如果 [HuskyLensV2 huskylens 检测到数据数量] > 0 执行]
    [HuskyLensV2 huskylens 绘制矩形 线宽:2 X:[HuskyLensV2 huskylens 获取结果X坐标] Y:[HuskyLensV2 huskylens 获取结果Y坐标] 宽度:50 高度:50]
```

### 知识库管理
```
[初始化 HuskyLensV2 huskylens I2C接口 Wire]
[HuskyLensV2 huskylens 切换算法为 物体识别]

[重复执行]
  [HuskyLensV2 huskylens 获取结果]
  [如果 [HuskyLensV2 huskylens 检测到数据数量] > 0 执行]
    [HuskyLensV2 huskylens 学习]
    [HuskyLensV2 huskylens 保存知识库 ID:1]
    [串口输出 "知识库已保存"]
```

## 重要规则

1. **初始化顺序**: 必须先初始化HuskyLensV2，再进行其他操作
2. **数据获取**: 读取数据前必须先调用getResult()
3. **I2C地址**: 默认I2C地址为0x32
4. **串口波特率**: 串口通信默认波特率为9600
5. **学习功能**: 学习功能需要在物体识别等支持学习的算法模式下使用
6. **知识库**: 知识库功能需要SD卡支持
7. **绘图功能**: 绘图功能会覆盖屏幕上的内容，注意清除操作

## 连接方式

### I2C连接
- VCC → 3.3V/5V
- GND → GND
- SDA → SDA
- SCL → SCL

### 串口连接
- VCC → 3.3V/5V
- GND → GND
- TX → RX
- RX → TX

## 新增功能（V2相比V1）

1. **知识库管理**: 支持保存和加载知识库，实现模型持久化
2. **音乐播放**: 支持播放指定名称和音量的音乐文件
3. **绘图功能**: 支持绘制矩形、文本等图形，并支持清除操作
4. **结果属性**: 提供更丰富的结果属性，包括名称、内容、置信度、类型等
5. **学习功能**: 支持指定区域学习和自动学习两种模式
6. **截图功能**: 支持拍照和截图功能，保存到SD卡

## 技术支持

- **官方文档**: [DFRobot HuskyLensV2文档](https://wiki.dfrobot.com/SKU_SEN0305_HuskyLens_V2)
- **GitHub仓库**: [DFRobot_HuskylensV2](https://github.com/DFRobot/DFRobot_HuskylensV2)
- **问题反馈**: 如有问题请在GitHub Issues中反馈

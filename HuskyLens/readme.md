# HuskyLens AI摄像头

DFRobot HuskyLens AI视觉传感器库，支持人脸识别、物体追踪、巡线等多种AI功能。

## 库信息
- **库名**: @aily-project/lib-huskylens
- **版本**: 1.0.0
- **兼容**: 通用（Arduino AVR、ESP32、ESP8266等）

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|
| `huskylens_init_i2c` | 语句块 | VAR(field_input), WIRE(dropdown) | `"VAR":"huskylens"` | `huskylens.begin(Wire);` |
| `huskylens_init_serial` | 语句块 | VAR(field_input), SERIAL(dropdown) | `"VAR":"huskylens"` | `huskylens.begin(Serial1);` |
| `huskylens_set_algorithm` | 语句块 | VAR(field_variable), ALGORITHM(dropdown) | `"VAR":{"id":"..."}` | `huskylens.writeAlgorithm(...);` |
| `huskylens_request` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.request();` |
| `huskylens_request_blocks` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.requestBlocks();` |
| `huskylens_request_arrows` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.requestArrows();` |
| `huskylens_available` | 值块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.available()` |
| `huskylens_is_learned` | 值块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.isLearned()` |
| `huskylens_count_learned_ids` | 值块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.countLearnedIDs()` |
| `huskylens_read_block_param` | 值块 | VAR(field_variable), INDEX(input), PARAM(dropdown) | `"VAR":{"id":"..."}` | `huskylens.readBlockDirect(0).xCenter` |
| `huskylens_read_arrow_param` | 值块 | VAR(field_variable), INDEX(input), PARAM(dropdown) | `"VAR":{"id":"..."}` | `huskylens.readArrowDirect(0).xOrigin` |
| `huskylens_write_osd` | 语句块 | VAR(field_variable), X/Y/TEXT(input) | `"VAR":{"id":"..."}` | `huskylens.writeOSD(...);` |
| `huskylens_clear_osd` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.clearOSD();` |
| `huskylens_learn_once` | 语句块 | VAR(field_variable), ID(input) | `"VAR":{"id":"..."}` | `huskylens.learnOnece(1);` |
| `huskylens_forget_learn` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.forgetLearn();` |
| `huskylens_save_model` | 语句块 | VAR(field_variable), INDEX(input) | `"VAR":{"id":"..."}` | `huskylens.saveModelToTFCard(0);` |
| `huskylens_load_model` | 语句块 | VAR(field_variable), INDEX(input) | `"VAR":{"id":"..."}` | `huskylens.loadModelFromTFCard(0);` |
| `huskylens_take_photo` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.takePhotoToSDCard();` |
| `huskylens_screenshot` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `huskylens.screenshotToSDCard();` |

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

## 方框参数

- `xCenter`: X中心坐标
- `yCenter`: Y中心坐标
- `width`: 宽度
- `height`: 高度
- `ID`: 识别ID

## 箭头参数（巡线模式）

- `xOrigin`: 起点X坐标
- `yOrigin`: 起点Y坐标
- `xTarget`: 终点X坐标
- `yTarget`: 终点Y坐标
- `ID`: 识别ID

## 使用示例

### 人脸识别
```
[初始化 HuskyLens huskylens I2C接口 Wire]
[HuskyLens huskylens 切换算法为 人脸识别]

[重复执行]
  [HuskyLens huskylens 请求方框数据]
  [如果 [HuskyLens huskylens 检测到数据数量] > 0 执行]
    [串口输出 "X:" [HuskyLens huskylens 读取第 0 个方框的 X中心坐标]]
```

### 巡线追踪
```
[初始化 HuskyLens huskylens I2C接口 Wire]
[HuskyLens huskylens 切换算法为 巡线追踪]

[重复执行]
  [HuskyLens huskylens 请求箭头数据]
  [如果 [HuskyLens huskylens 检测到数据数量] > 0 执行]
    [串口输出 "终点X:" [HuskyLens huskylens 读取第 0 个箭头的 终点X坐标]]
```

## 重要规则

1. **初始化顺序**: 必须先初始化HuskyLens，再进行其他操作
2. **数据请求**: 读取数据前必须先调用request/requestBlocks/requestArrows
3. **I2C地址**: 默认I2C地址为0x32
4. **串口波特率**: 串口通信默认波特率为9600

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

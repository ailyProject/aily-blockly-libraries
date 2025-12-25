# Adafruit GFX 积木库

支持 ST7735、ST7789、ST7796S 等 TFT 显示屏的 Blockly 积木库。

## 库信息

- **库名称**: adafruit_GFX
- **版本**: 1.1.0
- **支持的屏幕型号**: ST7735、ST7789、ST7796S
- **依赖库**: Adafruit_GFX、Adafruit_ST7735、Adafruit_ST7789、Adafruit_ST7796S
- **作者**: Adafruit
- **开源协议**: BSD License

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| tft_init | 语句块 | CS,DC,MOSI,SCLK,RST,BLK,WIDTH,HEIGHT | `"fields":{"CS":5,"DC":4,"MOSI":23,"SCLK":18,"RST":-1,"BLK":-1,"WIDTH":172,"HEIGHT":320}` | `Adafruit_ST7789 tft(CS,DC,MOSI,SCLK,RST); tft.init(WIDTH,HEIGHT);` |
| tft_fill_screen | 语句块 | COLOR | `"inputs":{"COLOR":{"shadow":"tft_preset_color"}}` | `tft.fillScreen(COLOR);` |
| tft_set_text_color | 语句块 | TEXT_COLOR,BG_COLOR | `"inputs":{"TEXT_COLOR":{},"BG_COLOR":{}}` | `tft.setTextColor(TEXT_COLOR,BG_COLOR);` |
| tft_print | 语句块 | X,Y,TEXT | `"inputs":{"X":{},"Y":{},"TEXT":{"shadow":"text"}}` | `tft.setCursor(X,Y); tft.println(TEXT);` |
| tft_draw_circle | 语句块 | X,Y,R,COLOR | `"inputs":{"X":{},"Y":{},"R":{},"COLOR":{}}` | `tft.drawCircle(X,Y,R,COLOR);` |
| tft_create_canvas16 | 语句块 | WIDTH,HEIGHT | `"inputs":{"WIDTH":{},"HEIGHT":{}}` | `GFXcanvas16 canvas(WIDTH,HEIGHT);` |
| tft_draw_image | 语句块 | X,Y,IMAGE | `"inputs":{"X":{},"Y":{},"IMAGE":{"shadow":"tft_bitmap_image"}}` | `tft.drawRGBBitmap(X,Y,IMAGE,W,H);` |

## 字段类型映射

| 字段类型 | 说明 | Arduino类型 |
|---------|------|-------------|
| Number | 数字输入 | int |
| String | 文本输入 | String |
| Colour | 颜色选择器 | uint16_t (RGB565) |
| Image | 图像数据 | const uint16_t* |

## 连接规则

### 语句块连接规则
- 必须包含 `previousStatement` 和 `nextStatement` 属性
- 语句块可以串联执行

### 值块连接规则
- 必须包含 `output` 属性
- 不能包含 `previousStatement` 和 `nextStatement` 属性
- 可以连接到其他块的输入槽

## 使用示例

### 示例1: 初始化TFT屏幕并绘制图形

```arduino
tft.init(172, 320);
tft.setRotation(0);
tft.fillScreen(ST77XX_BLACK);
tft.setTextColor(ST77XX_WHITE);
tft.setTextSize(1);
tft.setCursor(0, 0);
tft.println("Hello TFT!");
tft.drawCircle(86, 160, 50, ST77XX_RED);
```

### 示例2: 使用画布进行离屏绘制

```arduino
GFXcanvas16 canvas16(64, 64);
canvas16.fillScreen(ST77XX_RED);
canvas16.drawCircle(32, 32, 20, ST77XX_WHITE);
tft.drawRGBBitmap(0, 0, canvas16.getBuffer(), 64, 64);
```

## 重要规则

### 变量管理
- 使用 `field_variable` 字段的块会自动注册变量到 Blockly
- 变量重命名时会自动更新所有引用
- 画布变量必须先创建才能使用

### 内存管理
- 画布会占用额外的内存，请根据设备内存情况合理设置画布尺寸
- 1位画布占用内存较少，但只支持单色显示
- 16位画布占用内存较多，但支持全彩显示

### 性能优化
- 使用 `drawFastHLine` 和 `drawFastVLine` 可以提高绘制速度
- 对于大面积填充，优先使用 `fillRect` 而不是多次调用 `drawRect`
- 频繁更新显示时，考虑使用画布进行离屏绘制，然后一次性推送

### 引脚配置
- RST 引脚设置为 -1 表示不使用复位功能
- BLK 引脚设置为 -1 表示不使用背光控制
- 请根据实际硬件连接正确配置引脚

## 参考资料
- https://github.com/adafruit/Adafruit-ST7735-Library
- https://github.com/adafruit/Adafruit-GFX-Library

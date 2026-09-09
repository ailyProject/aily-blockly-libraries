# WS2812 灯带驱动库（引脚直控 / RMT）

驱动 WS2812/WS2812B 可寻址 RGB 灯带，按数据引脚直接控制，无需创建对象变量，时序由 ESP32 RMT 外设硬件生成。

## Library Info

- **Name**: @aily-project/lib-ws2812
- **Version**: 2.0.0
- **兼容核心**: esp32:esp32（arduino-esp32 3.x，含 ESP32-C3）

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `ws2812_init` | Statement | DATA_PIN(field_dropdown), COUNT(field_number) | `ws2812_init(3, 10)` | `#include <AilyWS2812.h>`（全局include）↵ `ailyWs2812Init(3, 10);` |
| `ws2812_fill` | Statement | DATA_PIN(field_dropdown), RED(input_value), GREEN(input_value), BLUE(input_value) | `ws2812_fill(3, math_number(255), math_number(255), math_number(0))` | `#include <AilyWS2812.h>`（仅首次）↵ `ailyWs2812Fill(3, 255, 255, 0);` |
| `ws2812_set_pixel` | Statement | DATA_PIN(field_dropdown), INDEX(input_value), RED(input_value), GREEN(input_value), BLUE(input_value) | `ws2812_set_pixel(3, math_number(0), math_number(255), math_number(0), math_number(0))` | `#include <AilyWS2812.h>`（仅首次）↵ `ailyWs2812SetPixel(3, 0, 255, 0, 0);` |
| `ws2812_set_brightness` | Statement | DATA_PIN(field_dropdown), BRIGHTNESS(input_value) | `ws2812_set_brightness(3, math_number(40))` | `#include <AilyWS2812.h>`（仅首次）↵ `ailyWs2812SetBrightness(3, 40);` |
| `ws2812_clear` | Statement | DATA_PIN(field_dropdown) | `ws2812_clear(3)` | `#include <AilyWS2812.h>`（仅首次）↵ `ailyWs2812Clear(3);` |
| `ws2812_show` | Statement | DATA_PIN(field_dropdown) | `ws2812_show(3)` | `#include <AilyWS2812.h>`（仅首次）↵ `ailyWs2812Show(3);` |
| `ws2812_is_ready` | Value (Number) | DATA_PIN(field_dropdown) | `ws2812_is_ready(3)` | `#include <AilyWS2812.h>`（仅首次）↵ `ailyWs2812IsReady(3) ? 1 : 0` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DATA_PIN | 来自当前开发板 `digitalPins` 列表的实际枚举值，如 `3` | 动态下拉，值为板级 GPIO 编号字符串，直接控制该引脚的灯带 |
| RED / GREEN / BLUE / BRIGHTNESS / INDEX | 任意数值表达式 | RGB 取值 0-255；序号从 0 开始 |

## ABS Examples

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    ws2812_init(3, 10)
    ws2812_set_brightness(3, math_number(40))
    ws2812_fill(3, math_number(255), math_number(255), math_number(0))
    ws2812_show(3)
    time_delay(math_number(1000))
    ws2812_clear(3)
    ws2812_show(3)

arduino_loop()
    ws2812_set_pixel(3, math_number(0), math_number(255), math_number(0), math_number(0))
    ws2812_show(3)
    time_delay(math_number(500))
```

## Notes

1. **无对象变量**：本库所有积木直接携带数据引脚（DATA_PIN），不创建、也不引用任何 `$strip` 类库对象变量；控制哪个引脚的灯带就选哪个引脚。
2. **初始化顺序**：必须先对某引脚调用 `ws2812_init(pin, count)`，再使用同引脚的其他灯带积木；未初始化引脚上的填充/刷新等积木为空操作。同引脚重复 `ws2812_init` 会自动释放并重新配置（幂等）。
3. **多灯带**：内部按引脚路由，最多同时管理 4 条不同引脚的灯带；不同引脚互不干扰。
4. **缓冲区语义**：`fill`/`set_pixel`/`clear` 只修改该引脚灯带的内部颜色缓冲区，不发送数据；必须再调用 `ws2812_show` 才会真正点亮/熄灭。初始化成功后会先发一次全黑，将灯带置于熄灭状态。
5. **亮度**：`set_brightness` 设置 0-255 总亮度，在下次 `show` 时按比例缩放后发送，默认 255。
6. **硬件**：ESP32 为 3.3V 逻辑；5V 供电的 WS2812B 灯带建议加电平转换或对首灯降压供电，且必须与开发板共地。数据线建议串 300-500Ω 电阻。`show` 为阻塞发送，10 颗灯约 300us，最长 1000 颗约 30ms。
7. **依赖**：仅使用 arduino-esp32 3.x 内置 RMT HAL（`esp32-hal-rmt.h`，即官方 RMTWriteNeoPixel 示例所用接口），无第三方库依赖，不包含 FastLED。
8. **就绪查询**：`is_ready` 返回 1 表示该引脚灯带已完成初始化（RMT 通道创建成功），返回 0 表示未初始化或初始化失败（如无可分配 RMT 通道、灯带数超上限、内存不足）。

# SD JPEG Viewer

SD 卡 JPEG/BMP 图片查看器积木库：打开图片、前后翻页、退出查看。

## Library Info

- **Name**: @aily-project/lib-sd-jpeg-viewer
- **Version**: 1.0.4
- **Description**: SD卡JPEG图片查看器独立库
- **License**: UNLICENSED

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `sd_jpg_viewer_open` | Value (Boolean) | PATH(input_value, String) | `sd_jpg_viewer_open(text("/img/1.jpg"))` | `jpgv_show(String("/img/1.jpg"))` |
| `sd_jpg_viewer_next` | Value (Boolean) | (none) | `sd_jpg_viewer_next()` | `jpgv_next()` |
| `sd_jpg_viewer_prev` | Value (Boolean) | (none) | `sd_jpg_viewer_prev()` | `jpgv_prev()` |
| `sd_jpg_viewer_exit` | Statement | (none) | `sd_jpg_viewer_exit()` | `jpgv_exit();` |
| `sd_jpg_viewer_zoom` | Statement | (none) | `sd_jpg_viewer_zoom()` | `jpgv_zoomToggle();` |
| `sd_jpg_viewer_pan` | Statement | DX(input_value, Number), DY(input_value, Number) | `sd_jpg_viewer_pan(math_number(1), math_number(0))` | `jpgv_pan(1, 0);` |
| `sd_jpg_viewer_dir` | Value (Boolean) | (none) | `sd_jpg_viewer_dir()` | `jpgv_toggleRTL()` |

## ABS Examples

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    tftscr_init()
    xueersi_esp32_sd_init()

arduino_loop()
    controls_if(sd_jpg_viewer_open(text("/img/1.jpg")))
        @DO0:
            controls_if(logic_negate(sd_jpg_viewer_next()))
                @DO0:
                    sd_jpg_viewer_exit()
    time_delay(math_number(100))
```

## Notes

1. **Dependencies**: 生成的代码引用全局 `tft`（TFT_eSPI）和 SD 卡。使用前需初始化屏幕与 SD 卡（例如 `tftscr_init`、`xueersi_esp32_sd_init`），这些块来自 @aily-project/lib-jinyichen-st7789 与 @aily-project/lib-xueersi-esp32-sd。
2. **Object lifetime**: 查看器状态保存在生成代码的全局变量中，无需创建对象。`sd_jpg_viewer_open` 打开并显示图片，返回是否成功；`sd_jpg_viewer_next` / `sd_jpg_viewer_prev` 翻页并返回是否仍在查看中（false 表示已退出）；`sd_jpg_viewer_exit` 关闭查看器。
3. **Output blocks**: Boolean 输出块必须通过值输入消费（如 `controls_if`、`logic_negate`），不能直接放在语句链中；`sd_jpg_viewer_exit` / `sd_jpg_viewer_zoom` / `sd_jpg_viewer_pan` 是语句块。
4. **Zoom mode**: `sd_jpg_viewer_zoom` 在整图与放大 1:1 视图之间切换；放大模式下按网格分页浏览，`sd_jpg_viewer_pan(DX, DY)` 按屏宽/屏高的倍数移动视野（仅放大模式有效）。放大状态下读到页尾/页首翻页时保持放大模式：下一页直接进入第一个格子，上一页进入最后一个格子；非放大（整页）模式下翻页仍保持整页视图。右下角小地图显示当前页的实际缩小画面，细网格线划分格子，当前格以圆角高亮框标示。
5. **Direction**: `sd_jpg_viewer_dir` 仅在放大模式下生效：切换阅读顺序（默认右→左，切换为左→右），当前格子镜像到对称位置（画面内容不动），返回 `true` 表示已处理；未放大时什么也不做并返回 `false`。典型接线：`controls_if(logic_negate(sd_jpg_viewer_dir()))` → 未放大时才退出查看器。放大模式下左下角徽章显示当前方向：`G<` 为右→左（日漫式），`G>` 为左→右。
6. 支持从 SD 卡读取 JPEG（baseline/progressive）与 BMP；过大的图片按比例缩放并分段滚动显示。渲染采用整帧缓冲后单次推屏（约 150KB PSRAM），翻页/平移为瞬间切换，无逐行刷新。

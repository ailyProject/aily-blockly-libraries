# EPUB阅读器

EPUB电子书阅读器库，支持ZIP解压、HTML解析、自动分页，配合TFT屏幕显示。全局对象 `epubReader`。

## Library Info
- **Name**: @aily-project/lib-epub-reader
- **Version**: 1.1.9

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `epub_reader_open` | Statement | PATH(input_value), CHARS_PER_LINE(input_value), LINES_PER_PAGE(input_value) | `epub_reader_open(text("/book.epub"), math_number(25), math_number(13))` | `epubReader.open(path, cpl, lpp);` |
| `epub_reader_is_open` | Value | (无) | `epub_reader_is_open()` | `epubReader.isOpen()` |
| `epub_reader_get_page` | Value | (无) | `epub_reader_get_page()` | `epubReader.getCurrentPage()` |
| `epub_reader_get_page_num` | Value | (无) | `epub_reader_get_page_num()` | `epubReader.getPageNum()` |
| `epub_reader_next` | Statement | (无) | `epub_reader_next()` | `epubReader.nextPage();` |
| `epub_reader_prev` | Statement | (无) | `epub_reader_prev()` | `epubReader.prevPage();` |
| `epub_reader_has_next` | Value | (无) | `epub_reader_has_next()` | `epubReader.hasNext()` |
| `epub_reader_has_prev` | Value | (无) | `epub_reader_has_prev()` | `epubReader.hasPrev()` |
| `epub_reader_render_page` | Statement | X(input_value), Y(input_value) | `epub_reader_render_page(math_number(2), math_number(20))` | `epubRenderPage(x, y);` |
| `epub_reader_close` | Statement | (无) | `epub_reader_close()` | `epubReader.close();` |

## ABS Examples

### Complete EPUB Reader
```
arduino_global()

arduino_setup()
    tftscr_init()
    tftscr_fill_screen(tftscr_color(TFT_BLACK))
    tftscr_set_text_color(tftscr_color(TFT_WHITE))
    tftscr_set_text_size(2)
    xueersi_esp32_sd_init()
    xueersi_esp32_button_setup()
    epub_reader_open(text("/book.epub"), math_number(25), math_number(13))
    controls_if(epub_reader_is_open())
        @DO0:
            epub_reader_render_page(math_number(2), math_number(20))

arduino_loop()

xueersi_esp32_button_on_event(DOWN, CLICK)
    @DO:
        epub_reader_next()
        tftscr_fill_screen(tftscr_color(TFT_BLACK))
        epub_reader_render_page(math_number(2), math_number(20))

xueersi_esp32_button_on_event(UP, CLICK)
    @DO:
        epub_reader_prev()
        tftscr_fill_screen(tftscr_color(TFT_BLACK))
        epub_reader_render_page(math_number(2), math_number(20))
```

## Notes

1. **全局对象**: 库自动声明全局对象 `epubReader`，无需手动创建
2. **依赖**: 需要先初始化SD卡（`xueersi_esp32_sd_init`）和TFT屏幕（`tftscr_init`）
3. **PSRAM**: 需要PSRAM支持，EPUB解析时使用PSRAM存储解压数据
4. **内存**: 大文件解析时占用约2-3倍文件大小的PSRAM
5. **编码**: 自动处理UTF-8编码和常见HTML实体转义
6. **阅读进度**: `epub_reader_save_pos` 同时写入单书进度（NVS `epub_pos`）与最近阅读列表（NVS `epub_hist`，最多 8 本，最近优先，去重）；`epub_reader_open` 打开成功后自动调用 `loadPosition` 恢复到上次位置。
7. **阅读记录 UI**: `epub_reader_show_history` 渲染最近阅读列表（书名+章节进度，选中高亮，风格同目录页）；`epub_reader_hist_next` / `epub_reader_hist_prev` 移动选中项；`epub_reader_hist_resume` 打开选中书目并恢复进度（成功返回 true）；`epub_reader_hist_count` 返回条目数。典型接线：开机有记录则直接进阅读记录页（上下选择、A 续读、B 返回书库）。

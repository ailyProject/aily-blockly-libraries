# SD文件浏览器

基于 TFT 屏幕与 SD 卡的可视化文件浏览器，提供目录浏览、条目选择、字体加载与文件夹删除。

## Library Info

- **Name**: @aily-project/lib-sd-file-browser
- **Version**: 1.0.12

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `sd_browser_open` | Statement | DIR(input_value,String) | `sd_browser_open(text("/"))` | `sdbr_loadDir(String("/"));` |
| `sd_browser_count` | Value(Number) | — | `sd_browser_count()` | `sdbr_entryCount` |
| `sd_browser_is_dir` | Value(Boolean) | INDEX(input_value,Number) | `sd_browser_is_dir(math_number(0))` | `[&]{ int _i=0; return (_i>=0&&_i<sdbr_entryCount)?sdbr_isDir[_i]:false; }()` |
| `sd_browser_is_jpg` | Value(Boolean) | INDEX(input_value,Number) | `sd_browser_is_jpg(math_number(0))` | `[&]{ int _i=0; if(_i<0&#124;&#124;_i>=sdbr_entryCount&#124;&#124;sdbr_isDir[_i]) return false; String l=sdbr_names[_i]; l.toLowerCase(); return (l.endsWith(".jpg")&#124;&#124;l.endsWith(".jpeg")&#124;&#124;l.endsWith(".bmp")); }()` |
| `sd_browser_is_font` | Value(Boolean) | INDEX(input_value,Number) | `sd_browser_is_font(math_number(0))` | `[&]{ int _i=0; if(_i<0&#124;&#124;_i>=sdbr_entryCount&#124;&#124;sdbr_isDir[_i]) return false; String l=sdbr_names[_i]; l.toLowerCase(); return l.endsWith(".bin"); }()` |
| `sd_browser_name` | Value(String) | INDEX(input_value,Number) | `sd_browser_name(math_number(0))` | `[&]{ int _i=0; return (_i>=0&&_i<sdbr_entryCount)?sdbr_names[_i]:String(""); }()` |
| `sd_browser_path` | Value(String) | INDEX(input_value,Number) | `sd_browser_path(math_number(0))` | `[&]{ int _i=0; return (_i>=0&&_i<sdbr_entryCount)?sdbr_paths[_i]:String(""); }()` |
| `sd_browser_enter` | Statement | INDEX(input_value,Number) | `sd_browser_enter(math_number(0))` | `sdbr_enter(0);` |
| `sd_browser_up` | Statement | — | `sd_browser_up()` | `sdbr_goUp();` |
| `sd_browser_up_sel` | Value(Number) | — | `sd_browser_up_sel()` | `sdbr_prevSel` |
| `sd_browser_delete_dir` | Statement | INDEX(input_value,Number) | `sd_browser_delete_dir(math_number(0))` | `sdbr_deleteDir(0);` |
| `sd_browser_is_root` | Value(Boolean) | — | `sd_browser_is_root()` | `(sdbr_curDir == "/" &#124;&#124; sdbr_curDir == "")` |
| `sd_browser_curdir` | Value(String) | — | `sd_browser_curdir()` | `sdbr_curDir` |
| `sd_browser_show` | Statement | SEL(input_value,Number) | `sd_browser_show(math_number(0))` | `sdbr_show(0);` |
| `sd_browser_load_font` | Statement | PATH(input_value,String) | `sd_browser_load_font(text("/fonts/cjk.bin"))` | `sdFont.load("/fonts/cjk.bin");` |
| `sd_browser_unload_font` | Statement | — | `sd_browser_unload_font()` | `sdFont.unload();` |
| `sd_browser_font_loaded` | Value(Boolean) | — | `sd_browser_font_loaded()` | `sdFont.isLoaded()` |
| `sd_browser_font_height` | Value(Number) | — | `sd_browser_font_height()` | `(sdFont.isLoaded() ? sdFont.getCharHeight() : tft.fontHeight())` |
| `sd_browser_font_width` | Value(Number) | — | `sd_browser_font_width()` | `(sdFont.isLoaded() ? sdFont.getCharWidth() : 16)` |
| `sd_browser_load_ui_font` | Statement | PATH(input_value,String) | `sd_browser_load_ui_font(text("/fonts/ui.bin"))` | `SdFont uiFont;` ↵ `bool uiFontShared = false;` ↵ `uiFontShared = false; uiFont.load("/fonts/ui.bin");` |
| `sd_browser_unload_ui_font` | Statement | — | `sd_browser_unload_ui_font()` | `SdFont uiFont;` ↵ `bool uiFontShared = false;` ↵ `uiFontShared = false; uiFont.unload();` |
| `sd_browser_ui_font_loaded` | Value(Boolean) | — | `sd_browser_ui_font_loaded()` | `SdFont uiFont;` ↵ `bool uiFontShared = false;` ↵ `(uiFontShared ? sdFont.isLoaded() : uiFont.isLoaded())` |
| `sd_browser_share_font` | Statement | — | `sd_browser_share_font()` | `SdFont uiFont;` ↵ `bool uiFontShared = false;` ↵ `uiFontShared = true;` |

## ABS Examples

```abs
# Project Data Schema: 1 (external-only)

arduino_global()
    variable_define("selItem", int32_t, math_number(0))

arduino_setup()
    sd_browser_open(text("/"))
    sd_browser_load_font(text("/fonts/test_font16.bin"))
    sd_browser_show(variables_get($selItem))

arduino_loop()
    controls_if(sd_browser_is_dir(variables_get($selItem)))
        @DO0:
            sd_browser_enter(variables_get($selItem))
            variables_set($selItem, math_number(0))
            sd_browser_show(variables_get($selItem))
```

## Notes

1. **共享副作用**：本库每个 block 均触发 `addSdBrowserInfra`，向 sketch 注入相同的全局副作用——包含头 `#include <TFT_eSPI.h>`、`#include <SD.h>`、`#include <FS.h>`、`#include <EpubReader.h>`、`#include <SdBrowser.h>`；宏 `#define SMOOTH_FONT`、`#define COV_THUMB_W 72`、`#define COV_THUMB_H 96`；全局对象 `SdFont sdFont;`。
2. **UI 字体副作用**：`sd_browser_load_ui_font`、`sd_browser_unload_ui_font`、`sd_browser_ui_font_loaded`、`sd_browser_share_font` 额外注入全局对象 `SdFont uiFont;` 与 `bool uiFontShared = false;`（与 lib-epub-reader 共享，按字段名去重）。
3. **独立编译单元**：所有 `sdbr_*` 函数与全局状态定义在 `src/SdBrowser/SdBrowser.cpp`，声明在 `SdBrowser.h`。sketch 内联代码通过 `#include <SdBrowser.h>` 的 `extern` 声明访问 `sdbr_entryCount`、`sdbr_names`、`sdbr_curDir` 等状态。
4. **外部链接依赖**：`SdBrowser.cpp` 通过 `extern` 引用由其它库注入 sketch 的共享符号：`tft`（lib-jinyichen-st7789）、`sdFont`（本库与 lib-epub-reader 共享）、`g_sdFontTargetSpr`、`epubDrawCoverThumb(const char*, int, int)`、`epubGenCoverAll()`、`sdfatReinit()`（lib-epub-reader）。项目须同时安装 lib-epub-reader、lib-jinyichen-st7789 才能链接通过。
5. **调用位置**：所有 block 为普通语句/值块，可在 setup 或 loop 中调用；无自动 loop 注册、无回调。导航状态保存在库全局变量中，跨调用持续有效。
6. **值块内联 lambda**：`sd_browser_is_dir`/`is_jpg`/`is_font`/`name`/`path` 以立即调用的 lambda `[&]{...}()` 包裹，做越界保护后访问 `sdbr_*` 数组；这是正常的生成代码，非占位符。

# SD文件浏览器

基于 TFT 屏幕与 SD 卡的可视化文件浏览器，为 EPUB 阅读器等项目提供目录浏览、条目选择、字体加载与文件夹删除能力。

## 库信息

| 字段 | 值 |
| --- | --- |
| Package | @aily-project/lib-sd-file-browser |
| Version | 1.0.0 |
| Author | ailyProject |
| License | UNLICENSED |

## 支持的开发板

- ESP32 系列（需配合 TFT_eSPI 屏幕、SD 卡及 EpubReader 库使用）

## 描述

本库在 TFT 屏幕上绘制带滚动条、高亮选中的文件列表；仅当目录内存在 EPUB 文件时在右下角显示封面缩略图（无文件名与分隔线）；封面为“粘滞”显示——光标移到非 EPUB 条目时保留最后一张封面不重绘，仅当选中另一本 EPUB 时才更换，避免光标移动时闪烁，支持进入 / 返回目录、加载与卸载中文字体、UI 字体共享，以及带二次确认的文件夹删除。浏览状态、绘制缓存与全部实现位于 `src/SdBrowser/`，作为独立编译单元；通过 `extern` 访问由其它库注入到 sketch 的共享符号（`tft`、`sdFont`、`g_sdFontTargetSpr`、`epubDrawCoverThumb` 等）。

## 快速开始

1. 初始化 SD 卡与屏幕后，用 `sd_browser_open` 打开根目录 `/`；
2. 用 `sd_browser_show` 绘制列表，通过 `sd_browser_up`（返回上级）/ `sd_browser_enter`（进入子目录）导航；
3. 阅读前用 `sd_browser_load_font` 加载中文字体，使中文条目名正常显示。

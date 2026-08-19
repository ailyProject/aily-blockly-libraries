# EPUB阅读器

EPUB电子书阅读器库，支持ZIP解压、HTML解析、自动分页，配合TFT屏幕显示。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-epub-reader |
| Version | 1.0.0 |
| Author | ailyProject |
| Source | Based on miniz (public domain) |

## Supported Boards

ESP32系列（需PSRAM支持）

## Quick Start

1. SD卡根目录放 `.epub` 文件
2. 初始化TFT屏幕和SD卡
3. 使用 `EPUB 打开文件` 积木打开epub
4. 使用 `EPUB 渲染到屏幕` 积木显示内容
5. 用按键配合 `EPUB 下一页` / `EPUB 上一页` 翻页

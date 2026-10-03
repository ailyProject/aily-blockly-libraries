# GxEPD2 墨水屏全家桶（全型号 + 双IC）

一个库装齐：官方 GxEPD2 绘图积木（分页刷新/图形/文字/中文 U8g2）+ 内置全部源码（Adafruit_GFX、GxEPD2 1.6.9、U8g2_for_Adafruit_GFX）+ 99 款单IC面板初始化 + 双IC HINK-E042A03-A1 专用初始化。

- 支持主板：ESP32 等 3.3V 板（墨水屏必须 3.3V 供电与电平，勿接 5V）
- 单IC屏：用「初始化任意 GxEPD2 墨水屏」选型号（99 款，黑白/三色/四色/七色）
- 双IC 价格签屏：用「初始化双IC墨水屏」——**仅 HINK-E042A03-A1**（4.2寸 400x300 双SSD1608），CS=左半屏、CS2=右半屏，电源脚默认 -1 不接
- 用法：初始化 → （可选）中文字体引擎绑定 → 「分页刷新」里绘图
- 源码出处：GxEPD2 by Jean-Marc Zingg（GPL-3.0）；GxEPD2_2IC by xljxlj；请勿与单独的 @aily-project/lib-gxepd2、lib-gxepd2-any、lib-gxepd2-2ic 同时安装（积木类型同名冲突）

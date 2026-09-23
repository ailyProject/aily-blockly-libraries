# Dudu 天气时钟 2.0 复刻库（lib-duduclock）

将开源项目 **DuduClock 2.0**（和风天气桌面时钟）完整复刻为 Aily Blockly 积木库，适配学而思小妙 ESP32 掌机 + 2 寸 ST7789 竖屏（240x320）。

## Library Info
- **Name**: @aily-project/lib-duduclock
- **Version**: 1.0.0
- **来源**: DuduClock_2.0 源码包（呈杰希工作室，和风天气接口版）
- **适配板卡**: Xueersi XiaoMiao ESP32（esp32:esp32）

## 功能
- WiFi 配网（SoftAP 热点 "DuduClock" + 屏幕二维码，手机连热点后访问 192.168.1.1）
- NTP 对时 + 和风天气：实况天气、空气质量（PM10/PM2.5/NO2/SO2/CO/O3）、6 日预报
- 6 个页面：天气时钟（太空人动画+信息轮播）/ 空气质量 / 6日天气预报 / 主题切换 / 计时器 / 恢复出厂
- A 键交互：单击（计时启停）、双击（切页）、长按 2 秒（主题切换/计时归零/恢复出厂）
- 黑白双主题（保存在 NVS，重启保持）；WiFi/城市配置存 NVS
- 内置全部原版资源：43 张图片（9 种天气图标、10 帧太空人动画、温湿度图标、配网二维码）+ 11 套字体
- 内置自研 gzip 解压器（和风 API 强制 gzip，无需 ArduinoZlib）

## 使用要点
1. **必须**在「初始化」块之前用「设置API Host」与「设置和风天气Key」填入你的凭据（qweather.com 控制台获取；2024 后新账号必须用专属 Host）
2. **必须**使用「Dudu时钟 初始化屏幕」块（竖屏初始化 + 注入 tft/clk 全局对象）
3. 主循环放「运行一帧」；按键事件用学而思按键库 A 键的三个事件块调用本库三个按键块
4. **不要**同时使用 lib-jinyichen-st7789 的「TFT屏幕 初始化」（横屏，会冲突）
5. 固件约 2.8MB，需 **huge_app 分区（3MB APP）**（本工程已配置）；不要改回 default 1.2MB 分区

## 接线
使用板载屏幕与 A 键，无需额外接线。屏幕引脚由编译宏固化（MOSI=23/SCLK=18/CS=5/DC=4/RST=19）。

## 依赖
- @aily-project/lib-arduinojson（JSON 解析，v7）
- @aily-project/lib-xueersi-esp32-button（按键事件）
- TFT_eSPI（随库内置，ST7789 240x320 BGR 竖屏）

## 许可
复刻自 DuduClock 2.0 开源源码包；内置 DEFLATE 解码器算法结构参考 Mark Adler 的 puff.c（zlib license）重写。

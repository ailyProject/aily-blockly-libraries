# @aily-project/lib-stos

## Library Info

- **Name**: @aily-project/lib-stos
- **Version**: 0.0.1
- **Purpose**: STOS 商用控制平台：ST7735S 0.96寸屏（80x160，软件SPI）、SD卡槽（软件SPI+FAT16/32）、4x4 矩阵键盘、游戏摇杆（2路ADC+SW）、扬声器的初始化，以及桌面/开始菜单/窗口/任务栏/SD/键盘/摇杆事件与鼠标圆点、多击字符映射等动作。全局单例 `stos`（`extern STOS stos;`），不创建 Blockly 变量模型。

每个积木生成代码前都会通过 `generator.addLibrary('stos_h','#include "STOS.h"')` 注入头文件（下表省略）。

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| --- | --- | --- | --- | --- |
| stos_init_screen | Statement | SCL,SDA,RES,DC,CS,BLK (field_dropdown, ${board.digitalPins}) | `stos_init_screen(PA2, PA3, PA4, PA5, PA6, PA7)` | `stos.screenBegin(PA2, PA3, PA4, PA5, PA6, PA7);` |
| stos_init_sd | Statement | CS,SCK,MOSI,MISO (field_dropdown, ${board.digitalPins}) | `stos_init_sd(PA8, PB3, PB4, PB5)` | `stos.sdBegin(PA8, PB3, PB4, PB5);` |
| stos_init_keypad | Statement | C1,C2,C3,C4,S1,S2,S3,S4 (field_dropdown, ${board.digitalPins}) | `stos_init_keypad(PB10, PB11, PB12, PB13, PB14, PB15, PB6, PB7)` | `stos.keypadBegin(PB10, PB11, PB12, PB13, PB14, PB15, PB6, PB7);` |
| stos_init_joystick | Statement | VRX,VRY (field_dropdown, ${board.analogPins}), SW (${board.digitalPins}) | `stos_init_joystick(PA0, PA1, PB9)` | `stos.joystickBegin(PA0, PA1, PB9);` |
| stos_init_speaker | Statement | POS (field_dropdown, ${board.digitalPins}) | `stos_init_speaker(PB8)` | `stos.speakerBegin(PB8);` |
| stos_when_desktop_open | Statement | APP (field_dropdown), DO (input_statement) | `stos_when_desktop_open(APP_THIS_PC)` + 缩进体 | `if (stos.whenDesktopOpen(APP_THIS_PC)) {↵…↵}` |
| stos_when_startmenu_open | Statement | APP (field_dropdown，含 APP_OFF), DO | `stos_when_startmenu_open(APP_OFF)` + 缩进体 | `if (stos.whenStartMenuOpen(APP_OFF)) {↵…↵}` |
| stos_when_window_btn | Statement | APP, BTN (field_dropdown), DO | `stos_when_window_btn(APP_EDITOR, WIN_CLOSE)` + 缩进体 | `if (stos.whenWindowButton(APP_EDITOR, WIN_CLOSE)) {↵…↵}` |
| stos_when_taskbar_open | Statement | APP, DO | `stos_when_taskbar_open(APP_MUSIC)` + 缩进体 | `if (stos.whenTaskbarOpen(APP_MUSIC)) {↵…↵}` |
| stos_when_sd_inserted | Statement | DO | `stos_when_sd_inserted()` + 缩进体 | `if (stos.whenSdInserted()) {↵…↵}` |
| stos_when_key | Statement | KEY (field_dropdown), DO | `stos_when_key(KEY_S2)` + 缩进体 | `if (stos.whenKey(KEY_S2)) {↵…↵}` |
| stos_when_key_held | Statement | KEY (field_dropdown), DO | `stos_when_key_held(KEY_S4)` + 缩进体 | `if (stos.whenKeyHeld(KEY_S4)) {↵…↵}` |
| stos_when_joy | Statement | DIR (field_dropdown), DO | `stos_when_joy(DIR_UP)` + 缩进体 | `if (stos.whenJoystick(DIR_UP)) {↵…↵}` |
| stos_when_editor_btn | Statement | BTN (field_dropdown), DO | `stos_when_editor_btn(ED_FILE)` + 缩进体 | `if (stos.whenEditorButton(ED_FILE)) {↵…↵}` |
| stos_when_thispc_btn | Statement | BTN (field_dropdown), DO | `stos_when_thispc_btn(PC_FIND)` + 缩进体 | `if (stos.whenThisPcButton(PC_FIND)) {↵…↵}` |
| stos_when_tool | Statement | TOOL (field_dropdown), DO | `stos_when_tool(TOOL_PENCIL)` + 缩进体 | `if (stos.whenToolSelect(TOOL_PENCIL)) {↵…↵}` |
| stos_when_sdcheck_btn | Statement | BTN (field_dropdown), DO | `stos_when_sdcheck_btn(SDC_CHECK)` + 缩进体 | `if (stos.whenSdCheckButton(SDC_CHECK)) {↵…↵}` |
| stos_when_dots_btn | Statement | BTN (field_dropdown), DO | `stos_when_dots_btn(DOB_GO)` + 缩进体 | `if (stos.whenDotsButton(DOB_GO)) {↵…↵}` |
| stos_when_album_btn | Statement | BTN (field_dropdown), DO | `stos_when_album_btn(ALB_MODE)` + 缩进体 | `if (stos.whenAlbumButton(ALB_MODE)) {↵…↵}` |
| stos_when_settings_btn | Statement | BTN (field_dropdown), DO | `stos_when_settings_btn(SET_INVERT)` + 缩进体 | `if (stos.whenSettingsButton(SET_INVERT)) {↵…↵}` |
| stos_when_offkey | Statement | DO | `stos_when_offkey()` + 缩进体 | `if (stos.whenScreenOffAnyKey()) {↵…↵}` |
| stos_open_desktop | Statement | APP | `stos_open_desktop(APP_THIS_PC)` | `stos.openApp(SRC_DESKTOP, APP_THIS_PC);` |
| stos_open_startmenu | Statement | APP | `stos_open_startmenu(APP_SETTINGS)` | `stos.openApp(SRC_STARTMENU, APP_SETTINGS);` |
| stos_window_action | Statement | APP, ACT (field_dropdown) | `stos_window_action(APP_STBOARD, WIN_MAX)` | `stos.windowAction(APP_STBOARD, WIN_MAX);` |
| stos_restore_app | Statement | APP | `stos_restore_app(APP_EDITOR)` | `stos.restoreApp(APP_EDITOR);` |
| stos_read_sd | Statement | 无 | `stos_read_sd()` | `stos.readSdFiles();` |
| stos_map_chars | Statement | SET (field_input) | `stos_map_chars("2ABCabc")` | `stos.mapChars("2ABCabc");` |
| stos_cursor_move | Statement | DIR | `stos_cursor_move(DIR_UP)` | `stos.moveCursor(DIR_UP);` |
| stos_text_delete | Statement | 无 | `stos_text_delete()` | `stos.textBackspace();` |
| stos_text_confirm | Statement | 无 | `stos_text_confirm()` | `stos.textConfirm();` |
| stos_screen_off | Statement | 无 | `stos_screen_off()` | `stos.screenOff();` |
| stos_screen_on | Statement | 无 | `stos_screen_on()` | `stos.screenOn();` |

## Parameter Options

- APP：`APP_THIS_PC` `APP_SETTINGS` `APP_STBOARD` `APP_EDITOR` `APP_MUSIC` `APP_SDCHECK` `APP_DOTS` `APP_SEG7` `APP_JOYDBG` `APP_ALBUM`；开始菜单事件另有 `APP_OFF`。
- 窗口 BTN/ACT：`WIN_MIN` `WIN_MAX` `WIN_RESTORE` `WIN_CLOSE`。
- KEY：`KEY_S1` … `KEY_S16`（同步真实 4x4 键盘行优先布局：S1~S4=行1(1 2 3 A)，S5~S8=行2(4 5 6 B)，S9~S12=行3(7 8 9 C)，S13~S16=行4(* 0 # D)；键盘行接积木行S1~S4、键盘列接列C1~C4）。
- DIR：`DIR_UP` `DIR_DOWN` `DIR_LEFT` `DIR_RIGHT`。
- 相册 BTN：`ALB_NEXT` `ALB_MODE`；设置页 BTN：`SET_VOL_DN` `SET_VOL_UP` `SET_BRI_DN` `SET_BRI_UP` `SET_INVERT` `SET_RESET`。
- TOOL：`TOOL_PENCIL` `TOOL_RECT` `TOOL_CIRCLE` `TOOL_LINE` `TOOL_ERASER`。
- 引脚下拉为板卡绑定 `${board.digitalPins}` / `${board.analogPins}`。

## ABS Examples

```abs
arduino_setup()
    stos_init_screen(PA2, PA3, PA4, PA5, PA6, PA7)
    stos_init_sd(PA8, PB3, PB4, PB5)
    stos_init_keypad(PB10, PB11, PB12, PB13, PB14, PB15, PB6, PB7)
    stos_init_joystick(PA0, PA1, PB9)
    stos_init_speaker(PB8)
arduino_loop()
    stos_when_desktop_open(APP_THIS_PC)
        stos_open_desktop(APP_THIS_PC)
    stos_when_key(KEY_S2)
        stos_map_chars("2ABCabc")
    stos_when_key_held(KEY_S4)
        stos_cursor_move(DIR_UP)
    stos_when_joy(DIR_UP)
        stos_cursor_move(DIR_UP)
    stos_when_startmenu_open(APP_OFF)
        stos_screen_off()
    stos_when_offkey()
        stos_screen_on()
```

## Notes

- **外部状态镜像（供 LCD12864 等外接屏）**：公开只读接口 `stos.statusSnapshot(StosStatus &out)`，填充当前活动应用、屏幕/开始菜单/关屏状态、音量亮度反色、STBoard 工具、音乐（曲目号/MUS 文件名/内部或本地模式）、相册（文件名/图片或视频模式）、SD检测结果与 FAT 类型、点阵屏输入/查看、摇杆调试 ADC 与偏差、`HH:MM:SS` 时钟串，以及**最近一次关键事件阑锁**（`EVT_FIND_OPEN/OK/MISS/NOSD`、`EVT_ED_FILE/EVT_ED_SAVE`、`EVT_MUS_PLAY/EVT_MUS_STOP`、`EVT_DOTS_GO/VIEW`、`EVT_SET_RESET`，含事件数据/成败/相关文件名）。该方法不渲染屏幕、不改变任何显示或播放状态，可每帧调用。与之配套的 `@aily-project/lib-lcd12864` 状态显示积木就是它的消费者。

- 桌面共 10 个应用（`APP_THIS_PC` 此电脑 / `APP_SETTINGS` 设置 / `APP_STBOARD` STBoard / `APP_EDITOR` 文本编辑器 / `APP_MUSIC` 音乐 / `APP_SDCHECK` SD检测 / `APP_DOTS` 点阵屏 / `APP_SEG7` 七段时钟 / `APP_JOYDBG` 摇杆调试 / `APP_ALBUM` 相册）：桌面图标 5列×2行，开始菜单双列×6行（含 OFF），任务栏为最小化应用格。
- 单例 `stos`，无模型注册；初始化积木放 setup，事件积木放 loop（事件内部惰性轮询，10ms 一帧，无需额外刷新积木）。
- SD检测：进应用后按 CHECK（`SDC_CHECK`）重新初始化卡并挂载：成功显示 `PASS`（并显示 FAT16/FAT32），失败显示 `NO SD CARD`；需先插入 SD 卡。
- 点阵屏：8列×5行点阵（内置 3x5 字模，数字/字母/空格），按 `GO`（`DOB_GO`）进入输入，键盘多击字符经 `stos_map_chars` 写入，S15（`stos_text_confirm`）提交当前字符、S13（`stos_text_delete`）删字；按 `VIEW`（`DOB_VIEW`）开始横向逐列滚动（90ms 一列，尾部留白后循环）。
- 七段时钟：使用与任务栏右下角相同的 `clockSec`（开机=固件编译时刻），显示 HH:MM:SS，每秒刷新。
- 摇杆调试：显示 VRX/VRY 原始 ADC 值、方向、SW 状态与偏移指示框，约 120ms 刷新。
- 相册：显示 SD 根目录前 5 张照片文件，扩展名 `.PIC`（推荐，如 `PIC1.PIC`）或旧约定 `.IMG` 均识别（大小写不限），按 `NEXT`（`ALB_NEXT`）逐张循环切换。文件格式：160×80、RGB565、小端、无文件头、25600 字节；屏上按 2×2 降采样显示为 80×40（解码后缓存在 RAM，约 6.4KB）。项目内置本地转换网页 `tools/PIC转换器.html`（浏览器打开，拖图即得标准 PIC 文件）。照片像素在载入时按位取反，显示为彩色反色（负片）效果：黑↔白、红↔青、绿↔品红、蓝↔黄；UI 框/按钮/文字颜色不变。
- 鼠标圆点：所有界面（桌面、开始菜单、任务栏、各窗口）都显示 5x5 小圆点光标，移动采用无闪烁两步法：先把新位置圆点整块上屏，再把旧区中不与新点重叠的"尾带"（1px 步长仅 1x5 像素）按当前界面真实背景裁剪重绘，背景像素永不覆盖新点 → 圆点本体全程驻留无闪烁，也无脚印/残影；单步像素量约 30px，降低丢格概率。画板内圆点同时用作画笔与图形预览的对位。
- 校准 = 鼠标圆点（由 摇杆朝向→鼠标圆点移动 驱动）落在热区 + 按下摇杆 SW；SW 边沿同一帧只被一个热区消费。
- 按住键盘连发（`stos_when_key_held`）：电平事件，去抖稳定按住期间每 10ms 帧至多触发一次，与摇杆方向事件同节拍、共用同一恒速欠账累积器（≈100px/s 匀速）；松开或换键立即停止，>120ms 重按只走 1px 不补跳。
- 库内置行为：任务栏 START 切换开始菜单；ED_FILE 进入编辑、ED_SAVE 保存为 SD 根目录 TXT00000.TXT ~ TXT00004.TXT（前5个文件名依次循环，第6次回落覆盖 TXT00000；≤255字节单簇）；PC_FIND 进入数字搜索（S13 删字符、S15 确认查看文件内容；内容预览有缓存，仅选中项变化时读一次 SD，查看状态下移动光标不再逐帧读卡）；PC_DELETE 仅在选中文件时删除（FAT 目录项 0xE5 + 释放簇链）；TOOL_* 命中即选中工具；标题栏按下 SW 可拖动窗口，再次按下确认；STBoard 画布内按下 SW 起笔、摇杆移动、再按下 SW 提交铅笔/方形/圆形/直线/橡皮擦。
- 多击映射：同组字符 1500ms 内连按循环，换组自动提交上一字符；S15（确定字符）提交当前字符；字符组最长 47 字符（超出截断）。
- SD 为软件 SPI 慢速初始化+读，仅支持 FAT16/32（含 MBR 分区）；exFAT 卡（64GB+ 出厂默认）需重新格式化为 FAT32。检测周期约 1.5s，触发"插入SD卡"边沿事件（开机插卡同样触发）；拔卡不检测移除。**后台检测为非阻塞分帧探测**：每 10ms 帧至多推进一小步（CMD0 一次尝试 / ACMD41 一对，单步毫秒级），不阻塞主循环，摇杆圆点不会因 SD 探测停顿；ACMD41 仍按规范 1s 就绪窗口逐帧轮询，慢速卡首次就绪时间不变。SD检测应用内按 CHECK 走同步重新初始化（用户主动操作，等待可见）。
- 屏幕为 ST7735S 横屏 160x80（MADCTL=0x60，CASET 偏移1 / RASET 偏移26、INVON），关屏用 SLPIN+背光拉低；摇杆方向事件每 10ms 帧最多触发一次，鼠标圆点为定点累积恒速控制：把事件间隔毫秒数累积为像素欠账、每满 10ms 走 1px，常速帧（≤20ms）下长期速度稳定 ≈100 像素/秒；单帧步长限幅 `CUR_STEP_MAX=2px`（文本浏览窗口每帧需重绘多行字符，单帧 20~40ms，旧上限 4px 会把慢帧折算成 3~4px 大跨步，观感上“在文本里明显更快”；降为 2px 后慢帧最多走 2px，各界面手感一致且不突跳），久停重推不补跳。
- **设置页**：音量 +/-（0~4，0=静音；蜂鸣器为方波，故只缩放发声时长/静音，无法真调幅度）、亮度 +/-（0~4，映射背光 BLK 引脚 PWM 占空 0/64/128/192/255，首次调节自动把 BLK 切为 analogWrite）、反色显示切换（ST7735S 硬件 INVON 0x21 / INVOFF 0x20，切换后整屏重绘）、恢复出厂设置（音量2/亮度4/反色开/相册图片模式/音乐内置模式，不清 SD 文件）。每项均需把圆点移到对应按钮再按 SW。**饱和度未实现**：RGB565 无硬件加速，全屏逐像素运算会严重卡顿，按用户要求暂不做。
- **相册模式**：`MODE` 按钮在图片（`.PIC`/`.IMG`）与视频（`.VDO`）间切换。视频帧格式：160×80 RGB565 小端裸数据连续拼接，每帧 25600 字节，固定 8fps（125ms/帧），循环播放；因 F103C8 仅 20KB RAM 放不下一整帧，实现按偶行分块从 SD 流式读取并 2×2 降采样直接上屏，不缓存整帧。
- **音乐模式**：`MODE` 按钮在内置旋律（3 首）与本地 MUS 间切换，最多扫描 5 首。本地 MUS 支持两种格式（按 16 字节头自动识别）：
  - **PCM8 原声（格式 0，推荐）**：头 = `'M''U''S''1'` + 版本 + 格式 + 保留2B + 采样率4B + 采样数4B，随后为 **8 位无符号单声道**采样。由 `TIM4_CH3(PB8)` 输出 **281kHz PWM 载波** + `TIM2` **8kHz 采样中断**逐样点改写占空比还原波形；双缓冲各 512 字节（= 1 扇区 = 64ms 音频），主循环 `audFillBuffer()` 在播完一块前预读下一块。**需在 PB8 与喇叭之间串 1kΩ + 10nF RC 低通（截止约 16kHz）** 才能还原成模拟音频；音质约等于调幅电台水平（8bit/8kHz，非高保真）。
  - **音符序列（格式 2 / 旧无头文件）**：每 4 字节一组 = 频率 Hz 低/高 + 时长 ms 低/高（小端），`0,0` 结束；由 `tone()` 方波播放，体积极小。
  - **PCM16（格式 1）**：需 DAC/I2S，本机不支持，界面显示 `PCM16 NO` 且不播放。
  - 音乐界面在 `MODE:MUS` 右侧显示格式标识：`PCM8 OK`（可播）/ `PCM16 NO`（不可播）/ `NOTE`（方波）。
- 已验证：静态结构校验、ABS 应用、STM32 编译通过、摇杆滞环/帧补偿/多步钳位/无闪烁尾带几何、按住键连发帧闩锁/电平判定/恒速、设置项与相册/音乐模式、PCM8 头布局/双缓冲时序/占空映射编译期断言。未验证：实机硬件行为（屏幕时序、SD 兼容性、无卡/坏卡时圆点不再周期性停顿、尾带擦除实机无闪烁、按住键实机手感、PWM 音频实际音质与是否断音、RC 滤波效果）需上板确认。

# Otto 机器人库（lib-otto9）

将 Otto DIY V9 官方 Arduino 库封装为积木，用于控制经典 Otto 双足机器人（Arduino Nano）。

- **包名**：`@aily-project/lib-otto9`（本地库）
- **上游来源**：OttoDIY/Libraries V9（Otto9 + Oscillator + US + TimerFreeTone + BatReader9 + Otto_Matrix9），内置 Arduino 官方 Servo 库
- **许可证**：本封装库按 GPL-3.0 分发（因包含 GPLv3 的 TimerFreeTone 等 GPL 组件）；各上游组件许可证与源码修改记录见 `THIRD-PARTY-NOTICES.md`，许可证全文见 `LICENSE` 与 `LICENSES/` 目录
- **适用板卡**：arduino:avr（Arduino Nano / UNO 等 ATmega328P 板）
- **功能**：初始化与舵机校准、13 种行走/舞蹈动作、超声波距离、触摸/声控开关（Plus）、蜂鸣器音调与 19 首歌曲、31 种 LED 矩阵嘴型与文字滚动、底层舵机控制（适配 Otto Basic / Otto Plus）

## 官方标准接线（积木默认值）

| 部件 | 引脚 |
| --- | --- |
| 左腿 YL / 右腿 YR / 左脚 RL / 右脚 RR | D2 / D3 / D4 / D5 |
| 超声波 Trig / Echo | D8 / D9 |
| 蜂鸣器 | D13 |
| 声控开关 OUT（Plus） | A6（Basic 未接此模块时保持默认即可） |
| 触摸模块 I/O（Plus） | A0 |
| LED 矩阵 DIN / CS / CLK | A3 / A2 / A1 |

## 最简用法

1. 把「初始化 Otto」积木放入 setup（默认引脚即官方接线）；
2. 在 loop 中使用步行、转身、唱歌、手势等积木；
3. 使用 LED 矩阵嘴型前，先在 setup 中加入「初始化 LED 矩阵」。

## 示例程序（图形化）

库内 `examples/` 目录提供 4 个已编译验证的官方示例（对 AI 说「打开示例：XX」即可载入画布）：

| 示例 | 文件 | 功能 |
| --- | --- | --- |
| 避障 | examples/otto-avoid.abs | 前方15cm内有障碍：惊讶→跳跃→后退3步→左转3步；无障碍前进 |
| 测距仪 | examples/otto-distance.abs | 串口9600每2秒打印距离(cm) |
| 跟随 | examples/otto-follow.abs | 手掌靠近15cm内时跟随前进，离开则回初始姿势 |
| 小跑 | examples/otto-run.abs | 快速小跑（周期500ms），遇障碍停下 |
| 生日歌 | examples/otto-happybirthday.abs | 前进+超开心歌后演奏 28 音符生日快乐歌（手势已用超开心歌近似替代） |
| 超级玛丽 | examples/otto-mariobros.abs | 演奏马里奥主题ⅹ2+地下世界共 213 个音符（原程序为纯蜂鸣器演奏，图形化版增加了标准初始化） |
| 欢乐舞蹈 | examples/otto-happydance.abs | 约 160 步的完整快乐舞蹈序列 |
| 太空步 | examples/otto-smoothcriminal.abs | 迈克尔·杰克逊成名舞，含毫秒级节奏保持（电池初始化与组装辅助已按库精简省略） |
| 单身女郎 | examples/otto-singleladies.abs | 碧昂斯《Single Ladies》完整配舞，舵机数组已按套件接线重映射，需 60°/300° 相位支持 |
| 铃儿响叮当 | examples/otto-jingle.abs | 圣诞歌 57 音符 |
| 星战 | examples/otto-sw.abs | 星球大战主题曲（原程序用 tone()，已换算为 TimerFreeTone 音符序列） |
| 闹钟 | examples/otto-alarm.abs | 10 秒布防（上升转身+倒计时提示音）后进入警戒，距离比基准近即报警 |
| 全动作 | examples/otto-allmoves.abs | 依次演示全部动作；手势展示部分已用对应歌曲替代（手势积木已精简） |
| 检索 | examples/otto-retrieve.abs | 狩猎模式，与跟随类似 |
| 简易校准 | examples/otto-calibrationeasy.abs | 固定微调值(-3,0,5,-5)校准 |
| 复位 | examples/otto-footalign.abs | 四舵机回中（等价于原程序的四路 90°） |
| 校准 | examples/otto-calibration.abs | 串口 115200，a/z/s/x/k/m/j/n 逐格微调并保存 EEPROM（初值从 0 开始，未封装 EEPROM 读取） |
| 串口校准 | examples/otto-calibrationserial.abs | 串口 57600 菜单式校准（'e' 读 EEPROM 功能因未封装 EEPROM 读取而省略） |

注：已省略官方源码中的“组装辅助 7 脚”判断循环（套件接线表中无此跳线功能）；未转换 Mblock/Scratch 串口桥接固件（需 OttoSerialCommand 库，非图形化演示程序）。

## 注意事项

- 动作/歌曲积木为阻塞执行，执行完毕才继续后续积木；
- 避免把变量命名为 `wave`、`smile`、`zero` 等上游宏名，否则编译报错；
- Servo 库使用 Timer1，与其他占用 Timer1 的库不兼容；已在 Otto Basic / Otto Plus 套件上实测通过。
- 未封装电池检测、噪声传感器、手势与 Otto9Humanoid（适配 Otto Basic / Otto Plus 硬件范围）。

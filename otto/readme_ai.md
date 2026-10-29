# README_AI — @aily-project/lib-otto

## 1. Library Info

- 包名 / 版本:`@aily-project/lib-otto` 0.0.1(项目本地库,`local-libraries/@aily-project/lib-otto`)
- 用途:把 OTTO DIY 官方 Arduino 驱动 **OttoDIYLib 13.0.0** 封装为 Aily Blockly 积木:舵机初始化、行走/转向/跳舞动作、表情、蜂鸣器音乐、8x8 MAX7219 点阵。
- 必需依赖:`@aily-project/lib-servo`(提供 `Servo.h`)。本项目已安装该依赖。
- 验证范围:Arduino Nano(`arduino:avr:nano`)下完整 ABS 程序编译通过;真实硬件动作、ESP32/ESP8266 平台未验证。

所有积木的代码生成器都会注入一次 `#include <Otto.h>`(按 key 去重),下表不再重复列出该指令。

## 2. Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `otto_init` | Statement | NAME(field_input), YL(field_dropdown), YR(field_dropdown), RL(field_dropdown), RR(field_dropdown), CAL(field_checkbox), BUZZER(field_dropdown) | `otto_init("Otto", "2", "3", "4", "5", true, "13")` | 全局:`Otto Otto;`↵setup 开头:`Otto.init(2, 3, 4, 5, true, 13);` |
| `otto_init_matrix` | Statement | VAR(field_variable Otto), DIN(field_dropdown), CS(field_dropdown), CLK(field_dropdown), ROT(field_dropdown) | `otto_init_matrix($Otto, A3, A2, A1, "1")` | `Otto.initMATRIX(A3, A2, A1, 1);` |
| `otto_attach_servos` | Statement | VAR(field_variable Otto) | `otto_attach_servos($Otto)` | `Otto.attachServos();` |
| `otto_detach_servos` | Statement | VAR(field_variable Otto) | `otto_detach_servos($Otto)` | `Otto.detachServos();` |
| `otto_home` | Statement | VAR(field_variable Otto) | `otto_home($Otto)` | `Otto.home();` |
| `otto_set_rest_state` | Statement | VAR(field_variable Otto), STATE(field_dropdown) | `otto_set_rest_state($Otto, "true")` | `Otto.setRestState(true);` |
| `otto_get_rest_state` | Value (Boolean) | VAR(field_variable Otto) | `otto_get_rest_state($Otto)` | `Otto.getRestState()` |
| `otto_jump` | Statement | VAR(field_variable Otto), STEPS(input_value Number), T(input_value Number) | `otto_jump($Otto, math_number(1), math_number(2000))` | `Otto.jump(1, 2000);` |
| `otto_walk` | Statement | VAR(field_variable Otto), STEPS(input_value Number), T(input_value Number), DIR(field_dropdown) | `otto_walk($Otto, math_number(4), math_number(1000), "1")` | `Otto.walk(4, 1000, 1);` |
| `otto_turn` | Statement | VAR(field_variable Otto), STEPS(input_value Number), T(input_value Number), DIR(field_dropdown) | `otto_turn($Otto, math_number(4), math_number(2000), "1")` | `Otto.turn(4, 2000, 1);` |
| `otto_bend` | Statement | VAR(field_variable Otto), STEPS(input_value Number), T(input_value Number), DIR(field_dropdown) | `otto_bend($Otto, math_number(1), math_number(1400), "1")` | `Otto.bend(1, 1400, 1);` |
| `otto_shake_leg` | Statement | VAR(field_variable Otto), STEPS(input_value Number), T(input_value Number), DIR(field_dropdown) | `otto_shake_leg($Otto, math_number(1), math_number(2000), "-1")` | `Otto.shakeLeg(1, 2000, -1);` |
| `otto_updown` | Statement | VAR(field_variable Otto), STEPS(input_value Number), T(input_value Number), H(input_value Number) | `otto_updown($Otto, math_number(1), math_number(1000), math_number(20))` | `Otto.updown(1, 1000, 20);` |
| `otto_swing` | Statement | VAR(field_variable Otto), STEPS(input_value Number), T(input_value Number), H(input_value Number) | `otto_swing($Otto, math_number(1), math_number(1000), math_number(20))` | `Otto.swing(1, 1000, 20);` |
| `otto_tiptoe_swing` | Statement | VAR(field_variable Otto), STEPS(input_value Number), T(input_value Number), H(input_value Number) | `otto_tiptoe_swing($Otto, math_number(1), math_number(900), math_number(20))` | `Otto.tiptoeSwing(1, 900, 20);` |
| `otto_jitter` | Statement | VAR(field_variable Otto), STEPS(input_value Number), T(input_value Number), H(input_value Number) | `otto_jitter($Otto, math_number(1), math_number(500), math_number(20))` | `Otto.jitter(1, 500, 20);` |
| `otto_ascending_turn` | Statement | VAR(field_variable Otto), STEPS(input_value Number), T(input_value Number), H(input_value Number) | `otto_ascending_turn($Otto, math_number(1), math_number(900), math_number(20))` | `Otto.ascendingTurn(1, 900, 20);` |
| `otto_moonwalker` | Statement | VAR(field_variable Otto), STEPS(input_value Number), T(input_value Number), H(input_value Number), DIR(field_dropdown) | `otto_moonwalker($Otto, math_number(1), math_number(900), math_number(20), "1")` | `Otto.moonwalker(1, 900, 20, 1);` |
| `otto_crusaito` | Statement | VAR(field_variable Otto), STEPS(input_value Number), T(input_value Number), H(input_value Number), DIR(field_dropdown) | `otto_crusaito($Otto, math_number(1), math_number(900), math_number(20), "1")` | `Otto.crusaito(1, 900, 20, 1);` |
| `otto_flapping` | Statement | VAR(field_variable Otto), STEPS(input_value Number), T(input_value Number), H(input_value Number), DIR(field_dropdown) | `otto_flapping($Otto, math_number(1), math_number(1000), math_number(20), "1")` | `Otto.flapping(1, 1000, 20, 1);` |
| `otto_move_single` | Statement | VAR(field_variable Otto), SERVO(field_dropdown), POS(input_value Number) | `otto_move_single($Otto, "0", math_number(90))` | `Otto._moveSingle(90, 0);` |
| `otto_move_servos` | Statement | VAR(field_variable Otto), T(input_value Number), P0..P3(input_value Number) | `otto_move_servos($Otto, math_number(1000), math_number(90), math_number(90), math_number(90), math_number(90))` | `{ int otto_target[4] = {90, 90, 90, 90}; Otto._moveServos(1000, otto_target); }` |
| `otto_oscillate_servos` | Statement | VAR(field_variable Otto), A0..A3(input_value Number), O0..O3(input_value Number), T(input_value Number), PH0..PH3(input_value Number), CYC(input_value Number) | `otto_oscillate_servos($Otto, math_number(45), math_number(45), math_number(45), math_number(45), math_number(0), math_number(0), math_number(0), math_number(0), math_number(1000), math_number(0), math_number(0), math_number(0), math_number(0), math_number(1))` | `{ int otto_A[4] = {45, 45, 45, 45}; int otto_O[4] = {0, 0, 0, 0}; double otto_phase[4] = {0, 0, 0, 0}; Otto.oscillateServos(otto_A, otto_O, 1000, otto_phase, 1); }` |
| `otto_tone` | Statement | VAR(field_variable Otto), FREQ(input_value Number), DUR(input_value Number), SILENT(input_value Number) | `otto_tone($Otto, math_number(440), math_number(200), math_number(100))` | `Otto._tone(440, 200, 100);` |
| `otto_bend_tones` | Statement | VAR(field_variable Otto), F0(input_value Number), F1(input_value Number), PROP(input_value Number), DUR(input_value Number), SILENT(input_value Number) | `otto_bend_tones($Otto, math_number(880), math_number(2093), math_number(1.02), math_number(18), math_number(1))` | `Otto.bendTones(880, 2093, 1.02, 18, 1);` |
| `otto_sing` | Statement | VAR(field_variable Otto), SONG(field_dropdown) | `otto_sing($Otto, "0")` | `Otto.sing(0);` |
| `otto_put_mouth` | Statement | VAR(field_variable Otto), MOUTH(field_dropdown) | `otto_put_mouth($Otto, "10")` | `Otto.putMouth(10, true);` |
| `otto_put_mouth_raw` | Statement | VAR(field_variable Otto), BITS(input_value Number) | `otto_put_mouth_raw($Otto, math_number(0))` | `Otto.putMouth(0, false);` |
| `otto_put_animation_mouth` | Statement | VAR(field_variable Otto), ANIM(field_dropdown), INDEX(input_value Number) | `otto_put_animation_mouth($Otto, "0", math_number(0))` | `Otto.putAnimationMouth(0, 0);` |
| `otto_clear_mouth` | Statement | VAR(field_variable Otto) | `otto_clear_mouth($Otto)` | `Otto.clearMouth();` |
| `otto_matrix_intensity` | Statement | VAR(field_variable Otto), INTENSITY(input_value Number) | `otto_matrix_intensity($Otto, math_number(8))` | `Otto.matrixIntensity(8);` |
| `otto_set_led` | Statement | VAR(field_variable Otto), X(input_value Number), Y(input_value Number), VALUE(field_dropdown) | `otto_set_led($Otto, math_number(0), math_number(0), "1")` | `Otto.setLed(0, 0, 1);` |
| `otto_write_text` | Statement | VAR(field_variable Otto), TEXT(input_value String), SPEED(input_value Number) | `otto_write_text($Otto, text("OTTO"), math_number(100))` | `Otto.writeText("OTTO", 100);` |

## 3. Parameter Options

板卡相关下拉(库内保存为 `${board.servoPins}` / `${board.digitalPins}` 引用,不写死引脚):

- `YL` / `YR` / `RL` / `RR`:`${board.servoPins}`。已验证板 Arduino Nano 的取值为 `0`–`13`、`A0`–`A5`。
- `DIN` / `CS` / `CLK` / `BUZZER`:`${board.digitalPins}`。Arduino Nano 的取值为 `0`–`13`、`A0`–`A5`。

固定枚举下拉(ABS 使用第二列的实际值,不是显示标签):

- `ROT`:`1` 顶部朝上、`2` 顶部朝下、`3` 顶部朝左、`4` 顶部朝右
- `otto_walk.DIR`:`1` 前进、`-1` 后退
- `otto_turn.DIR`、`otto_bend.DIR`、`otto_shake_leg.DIR`、`otto_moonwalker.DIR`:`1` 向左、`-1` 向右
- `otto_crusaito.DIR`、`otto_flapping.DIR`:`1` 前进、`-1` 后退
- `STATE`:`true` 静止、`false` 运动中
- `SERVO`:`0` 左腿、`1` 右腿、`2` 左脚、`3` 右脚
- `VALUE`:`1` 点亮、`0` 熄灭
- `SONG`:`0` 连接、`1` 断开连接、`2` 按下按钮、`3` 模式1、`4` 模式2、`5` 模式3、`6` 惊讶、`7` OhOoh、`8` OhOoh2、`9` 撒娇、`10` 睡觉、`11` 开心、`12` 超开心、`13` 短开心、`14` 难过、`15` 困惑、`16` 放屁1、`17` 放屁2、`18` 放屁3
- `MOUTH`:`0`–`9`(数字嘴)、`10` 微笑、`11` 张嘴开心、`12` 闭嘴开心、`13` 爱心、`14` 大惊、`15` 小惊、`16` 吐舌、`17` 尖牙1、`18` 尖牙2、`19` 直线嘴、`20` 困惑、`21` 斜嘴、`22` 难过、`23` 张嘴难过、`24` 闭嘴难过、`25` OK嘴、`26` X嘴、`27` 问号、`28` 闪电、`29` 屁股、`30` 生气
- `ANIM`:`0` littleUuh、`1` dreamMouth、`2` adivinawi、`3` wave

## 4. ABS Examples

完整可编译程序(Arduino Nano,官方示例接线):

```abs
# ABS Schema: 2
# Project Data Schema: 1 (external-only)

arduino_global()
arduino_setup()
    otto_init("Otto", "2", "3", "4", "5", true, "13")
    otto_init_matrix($Otto, A3, A2, A1, "1")
    otto_sing($Otto, "0")
arduino_loop()
    otto_home($Otto)
    otto_walk($Otto, math_number(2), math_number(1000), "1")
    otto_turn($Otto, math_number(2), math_number(1000), "-1")
    otto_put_mouth($Otto, "10")
    otto_sing($Otto, "11")
    time_delay(math_number(2000))
```

`otto_init` 是模型声明:它创建类型 `Otto` 的对象模型,后续所有积木通过 `$Otto` 引用;`variables_get($Otto)` 仅用于 `input_value` 槽(本库没有这样的槽)。

## 5. Notes

- **ABS 规范取值形式**:下拉框的值在 ABS 中是字符串,宿主回读时会加引号 —— `"1"`、`"-1"`、`"2"`、`"13"`、`"0"`、`"10"`、`"true"`;引脚值 `A3`/`A2`/`A1` 不带引号;复选框 `CAL` 用裸 `true`/`false`;数值输入用 `math_number(...)`;文本输入用 `text("OTTO")`。
- **初始化顺序**:任何动作积木之前必须先执行 `otto_init`。该积木固定把 `Otto.init(...)` 插入 `setup()` 开头(即使积木放在循环中也一样),并在全局声明 `Otto` 对象。
- **`init` 的副作用**:`Otto.init()` 内部会 attach 四个舵机、按 `CAL` 决定是否从 EEPROM 读取微调值、把蜂鸣器引脚设为 `OUTPUT`。因此声音积木依赖 `otto_init` 的蜂鸣器引脚选择。
- **点阵前置条件**:`otto_init_matrix`、`otto_put_mouth`、`otto_put_mouth_raw`、`otto_put_animation_mouth`、`otto_clear_mouth`、`otto_matrix_intensity`、`otto_set_led`、`otto_write_text` 都要求先执行 `otto_init_matrix(DIN, CS, CLK, ROT)`,否则点阵不会输出。
- **`otto_set_led` 坐标含义**:`X` 是列、`Y` 是行(上游 `setDot(col, row, value)`),有效范围 `0`–`7`;`VALUE` 为 `1` 点亮、`0` 熄灭。
- **`otto_write_text`**:上游只支持最多 9 个字符,字库包含数字、大写字母与少量符号(小写字母与中文不显示);`SPEED` 是滚动速度参数。
- **`otto_put_mouth` 与 `otto_put_mouth_raw`**:前者按 `MOUTH` 索引取上游预设图案(生成的 `predefined = true`);后者把输入值当作 32 位点阵位图直接写入(生成的 `predefined = false`)。
- **校准与舵机限速(有意不提供)**:为避免误操作把不可恢复的校准数据写入 EEPROM,本库不提供 `setTrims`/`saveTrimsOnEEPROM`/`enableServoLimit`/`disableServoLimit` 的积木。`otto_init` 的 `CAL` 复选框只*读取* EEPROM 中已保存的校准(例如由 OTTO 官方校准例程写入),勾选时生成的 `init` 第二参数为 `true`。
- **手势(有意不提供)**:本库不提供 `playGesture` 的积木(上游的完整表演序列,包含动作、声音与表情组合);表情需求请用 `otto_put_mouth`、`otto_put_mouth_raw`、`otto_put_animation_mouth`。
- **动作参数含义**:`STEPS` 是步数/次数,`T` 是单步时间(毫秒,越大越慢),`H` 是抬腿高度(度)。默认值与上游头文件默认参数一致,见各积木的 `math_number` 阴影值。
- **`_moveServos` / `_moveSingle` / `_tone`**:名字带下划线但属于上游公有 API,可直接调用。`otto_move_servos` 与 `otto_oscillate_servos` 生成代码使用块级作用域 `{}` 包裹本地数组(固定名 `otto_target`、`otto_A`、`otto_O`、`otto_phase`),不会与其他代码冲突。
- **实例名约束**:上游 `Otto_gestures.h` / `Otto_mouths.h` 用 `#define` 定义了 `smile`、`wave`、`happyOpen`、`one`、`two` 等小写宏(驱动内部使用,不可移除),因此不要把这些名字用作实例名。其中未使用的 `otto` 宏已在本封装中注释移除,所以实例名 `Otto` 与 `otto` 都可用(积木默认值为 `Otto`)。
- **依赖与平台**:AVR 平台需要 `@aily-project/lib-servo` 提供 `Servo.h`(上游 `Otto.h` 按 `ARDUINO_ARCH_ESP32` 条件包含 `ESP32Servo.h` 或 `Servo.h`)。ESP32/ESP8266 平台未验证。
- **未验证项**:真实硬件上的动作、声音与点阵表现未测试;仅验证了 Arduino Nano 下的编译生成结果(生成的 sketch 经人工核对:包含 `#include <Otto.h>`、全局 `Otto` 对象、setup 内 `init`/`initMATRIX`/`sing`、循环内动作与数组调用)。

# lib-otto9 Agent 契约

## Library Info

- 包名 `@aily-project/lib-otto9`，本地库；封装 Otto DIY V9 的 Otto9 核心公开 API（适配 Otto Basic / Otto Plus），适用 arduino:avr。
- 对象类型：`Otto9`。由 `otto_init` 创建（field_input `NAME` + createsVariable）；其余积木用 `field_variable`（variableTypes `["Otto9"]`）引用 `$name`。
- 生成副作用：`#include "Otto9.h"`、全局 `Otto9 <name>;`（addObject）。初始化调用在积木所在位置生成（通常放 setup）。

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| --- | --- | --- | --- | --- |
| otto_init | Statement | NAME(field_input), YL/YR/RL/RR(servoPins), CALIB, NOISE(analogPins), BUZZER/TRIG/ECHO(digitalPins) | `otto_init("otto","2","3","4","5","true","A6","13","8","9")` | `#include "Otto9.h"`↵`Otto9 otto;`↵`otto.init(2,3,4,5,true,A6,13,8,9);` |
| otto_init_matrix | Statement | NAME($otto), DIN/CS/CLK(digitalPins), ROTATE | `otto_init_matrix($otto,"A3","A2","A1","1")` | `otto.initMATRIX(A3,A2,A1,1);` |
| otto_attach_servos | Statement | NAME | `otto_attach_servos($otto)` | `otto.attachServos();` |
| otto_detach_servos | Statement | NAME | `otto_detach_servos($otto)` | `otto.detachServos();` |
| otto_set_trims | Statement | NAME, YL/YR/RL/RR(input_value) | `otto_set_trims($otto, math_number(0), math_number(0), math_number(0), math_number(0))` | `otto.setTrims(0,0,0,0);` |
| otto_save_trims | Statement | NAME | `otto_save_trims($otto)` | `otto.saveTrimsOnEEPROM();` |
| otto_home | Statement | NAME | `otto_home($otto)` | `otto.home();` |
| otto_get_rest_state | Value(Boolean) | NAME | `otto_get_rest_state($otto)` | `otto.getRestState()` |
| otto_set_rest_state | Statement | NAME, STATE | `otto_set_rest_state($otto,"true")` | `otto.setRestState(true);` |
| otto_jump | Statement | NAME, STEPS/T(input_value) | `otto_jump($otto, math_number(1), math_number(2000))` | `otto.jump(1,2000);` |
| otto_walk | Statement | NAME, STEPS, T, DIR | `otto_walk($otto, math_number(4), math_number(1000), FORWARD)` | `otto.walk(4,1000,FORWARD);` |
| otto_turn | Statement | NAME, STEPS, T, DIR | `otto_turn($otto, math_number(4), math_number(2000), LEFT)` | `otto.turn(4,2000,LEFT);` |
| otto_bend | Statement | NAME, STEPS, T, DIR | `otto_bend($otto, math_number(1), math_number(1400), LEFT)` | `otto.bend(1,1400,LEFT);` |
| otto_shake_leg | Statement | NAME, STEPS, T, DIR | `otto_shake_leg($otto, math_number(1), math_number(2000), RIGHT)` | `otto.shakeLeg(1,2000,RIGHT);` |
| otto_updown | Statement | NAME, STEPS, T, H | `otto_updown($otto, math_number(1), math_number(1000), math_number(20))` | `otto.updown(1,1000,20);` |
| otto_swing | Statement | NAME, STEPS, T, H | `otto_swing($otto, math_number(1), math_number(1000), math_number(20))` | `otto.swing(1,1000,20);` |
| otto_tiptoe_swing | Statement | NAME, STEPS, T, H | 同上参数 | `otto.tiptoeSwing(...);` |
| otto_jitter | Statement | NAME, STEPS, T, H | 同上参数 | `otto.jitter(...);` |
| otto_ascending_turn | Statement | NAME, STEPS, T, H | 同上参数 | `otto.ascendingTurn(...);` |
| otto_moonwalker | Statement | NAME, STEPS, T, H, DIR | `otto_moonwalker($otto, math_number(1), math_number(900), math_number(20), LEFT)` | `otto.moonwalker(1,900,20,LEFT);` |
| otto_crusaito | Statement | NAME, STEPS, T, H, DIR | 同上，DIR=FORWARD | `otto.crusaito(...);` |
| otto_flapping | Statement | NAME, STEPS, T, H, DIR | 同上，DIR=FORWARD | `otto.flapping(...);` |
| otto_get_distance | Value(Number) | NAME | `otto_get_distance($otto)` | `otto.getDistance()` |
| otto_touch_pressed | Value(Boolean) | PIN(digitalPins) | `otto_touch_pressed(A0)` | setup: `pinMode(A0, INPUT);`↵`(digitalRead(A0) == HIGH)` |
| otto_sound_triggered | Value(Boolean) | PIN(analogPins), THRESHOLD(input_value) | `otto_sound_triggered(A6, math_number(600))` | `(analogRead(A6) > 600)` |
| otto_matrix_intensity | Statement | NAME, INTENSITY | `otto_matrix_intensity($otto, math_number(5))` | `otto.matrixIntensity(5);` |
| otto_put_mouth | Statement | NAME, MOUTH | `otto_put_mouth($otto, smile)` | `otto.putMouth(smile);` |
| otto_put_mouth_bitmap | Statement | NAME, CODE(input_value) | `otto_put_mouth_bitmap($otto, math_number(0))` | `otto.putMouth((unsigned long int)(0), false);` |
| otto_put_animation_mouth | Statement | NAME, ANIM, INDEX(input_value) | `otto_put_animation_mouth($otto, dreamMouth, math_number(0))` | `otto.putAnimationMouth(dreamMouth,0);` |
| otto_clear_mouth | Statement | NAME | `otto_clear_mouth($otto)` | `otto.clearMouth();` |
| otto_set_led | Statement | NAME, X/Y/VALUE(input_value) | `otto_set_led($otto, math_number(0), math_number(0), math_number(1))` | `otto.setLed(0,0,1);` |
| otto_write_text | Statement | NAME, TEXT(text), SPEED | `otto_write_text($otto, text("OTTO"), math_number(100))` | `otto.writeText("OTTO",100);` |
| otto_tone | Statement | NAME, FREQ/DURATION/SILENT | `otto_tone($otto, math_number(523), math_number(100), math_number(50))` | `otto._tone(523,100,50);` |
| otto_bend_tones | Statement | NAME, INITF/FINALF/PROP/DUR/SILENT | `otto_bend_tones($otto, math_number(500), math_number(1000), math_number(1.02), math_number(20), math_number(10))` | `otto.bendTones(500,1000,1.02,20,10);` |
| otto_sing | Statement | NAME, SONG | `otto_sing($otto, S_superHappy)` | `otto.sing(S_superHappy);` |
| otto_move_single | Statement | NAME, POSITION(input_value), SERVO | `otto_move_single($otto, math_number(90), "0")` | `otto._moveSingle(90,0);` |
| otto_move_servos | Statement | NAME, TIME, YL, YR, RL, RR | `otto_move_servos($otto, math_number(500), math_number(90), math_number(90), math_number(90), math_number(90))` | `{↵  int ottoTarget[4]={90,90,90,90};↵  otto._moveServos(500,ottoTarget);↵}` |
| otto_oscillate_servos | Statement | NAME, AYL/AYR/ARL/ARR, OYL/OYR/ORL/ORR, T, PYL/PYR/PRL/PRR, CYCLE | `otto_oscillate_servos($otto, math_number(20)…, math_number(0)…, math_number(1000), 0, 1.5707963267948966, 0, 0, math_number(1))`（省略处为逐参数 math_number） | `{↵  int ottoAmp[4]={...}; int ottoOff[4]={...}; double ottoPhase[4]={...};↵  otto.oscillateServos(ottoAmp,ottoOff,1000,ottoPhase,1);↵}` |

## Parameter Options

- CALIB/STATE：`"true"` / `"false"`；ROTATE：`"1"`朝上 `"2"`朝下 `"3"`朝左 `"4"`朝右；SERVO：`"0"`左腿 `"1"`右腿 `"2"`左脚 `"3"`右脚。
- DIR：walk/crusaito/flapping `FORWARD`/`BACKWARD`；turn/bend/moonwalker `LEFT`/`RIGHT`；shake_leg `RIGHT`/`LEFT`。
- MOUTH：`zero`…`nine`,`smile`,`happyOpen`,`happyClosed`,`heart`,`bigSurprise`,`smallSurprise`,`tongueOut`,`vamp1`,`vamp2`,`lineMouth`,`confused`,`diagonal`,`sad`,`sadOpen`,`sadClosed`,`okMouth`,`xMouth`,`interrogation`,`thunder`,`culito`,`angry`。
- ANIM：`littleUuh`,`dreamMouth`,`adivinawi`,`wave`。
- SONG：`S_connection`,`S_disconnection`,`S_buttonPushed`,`S_mode1`–`S_mode3`,`S_surprise`,`S_OhOoh`,`S_OhOoh2`,`S_cuddly`,`S_sleeping`,`S_happy`,`S_superHappy`,`S_happy_short`,`S_sad`,`S_confused`,`S_fart1`–`S_fart3`。
- 相位：`0`,`1.5707963267948966`,`3.141592653589793`,`4.71238898038469`,`6.283185307179586`。
- 引脚下拉为 `${board.servoPins}`/`${board.analogPins}`/`${board.digitalPins}` 绑定，ABS 使用实际引脚值（如 `2`、`A6`）。触摸开关默认 A0；声控开关默认 A6，阈值为 0-1023（默认 600）；A6/A7 仅支持模拟读取。

## ABS Example

```abs
# ABS Schema: 2
# Project Data Schema: 1 (external-only)

arduino_global()
    variable_define("dist", int, math_number(0))
arduino_setup()
    otto_init("otto", "2", "3", "4", "5", "true", "A6", "13", "8", "9")
    otto_init_matrix($otto, "A3", "A2", "A1", "1")
    otto_put_mouth($otto, smile)
    otto_sing($otto, S_connection)
arduino_loop()
    otto_walk($otto, math_number(4), math_number(1000), FORWARD)
    variables_set($dist, otto_get_distance($otto))
    otto_move_servos($otto, math_number(500), math_number(90), math_number(90), math_number(90), math_number(90))
    otto_home($otto)
```

## Notes

- 初始化积木须先于消费者使用（生成全局对象 `Otto9 <name>;`）；`otto_init` 与 `otto_init_dc` 均创建 Otto9 模型，同一程序二选一。
- 引脚默认值为 Otto 官方接线（YL=2,YR=3,RL=4,RR=5,蜂鸣器=13,Trig=8,Echo=9,噪声=A6,矩阵 A3/A2/A1,电池=A7），可按实际接线修改。
- 动作/歌曲/手势/滑音为阻塞调用（内部 delay）；循环内连续动作会顺序执行。
- LED 矩阵类积木需先 `otto_init_matrix`；EEPROM 校准需 `CALIB="true"` 且已用 `otto_save_trims` 保存过。
- 上游以宏定义导出 `FORWARD/LEFT/smile/wave` 等常用词，用户变量名与之同名会导致编译错误；上游未使用的 `otto` 宏已在本库副本中移除。
- 内置 vendored Arduino Servo 库（LGPL 2.1）占用 Timer1；仅支持 arduino:avr（ATmega328P 实测编译通过）；不含 Otto9Humanoid。
- 未封装电池检测、手势与 Otto9Humanoid（适配 Otto Basic / Plus 硬件范围）；声控/触摸为引脚级开关积木（Plus 模块），不依赖 Otto9 对象，可直接用于条件判断；初始化积木的噪声传感器字段因上游 init 签名必填而保留（即声控模块引脚 A6）。
- 示例程序：`examples/otto-avoid.abs`、`otto-distance.abs`、`otto-follow.abs`、`otto-run.abs`（均经 ABS 应用+编译验证；已省略上游组装辅助 7 脚循环）。AI 载入：以 examples 文件为 absPath 调用 abs_apply。工具箱「示例程序」分类为 label 索引，不含可拖拽积木。
- 硬件行为已在 Otto Basic / Otto Plus 套件上实测通过（动作、发声、测距、触摸、声控、矩阵嘴型及示例程序）。
- 许可证：包按 GPL-3.0-only 分发；第三方组件清单与源码修改记录见 THIRD-PARTY-NOTICES.md（BSD/GPLv3/LGPL2.1 许可证文本随包分发）。

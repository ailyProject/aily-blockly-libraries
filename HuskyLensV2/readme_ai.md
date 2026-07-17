# HuskyLensV2

DFRobot HuskylensV2 Blockly 库，对齐官方 v1.0.9 API。

## 库信息
- **名称**: @aily-project/lib-huskylensv2
- **版本**: 1.0.9
- **源码**: https://gitee.com/dfrobot/DFRobot_HuskylensV2

## 正确调用顺序

```
arduino_setup()
    huskylensv2_init_i2c_until("huskylens", Wire)
    huskylensv2_set_algorithm_until(variables_get($huskylens), ALGORITHM_FACE_RECOGNITION)

arduino_loop()
    huskylensv2_get_result_until(variables_get($huskylens), ALGORITHM_ANY)
    controls_whileUntil(WHILE)
        @BOOL: huskylensv2_available(variables_get($huskylens), ALGORITHM_ANY)
        @DO:
            // 弹出结果后读取字段
            // result = huskylensv2_pop_result(...)
            // huskylensv2_result_id(result)
```

## 关键规则

1. 几乎所有查询/学习/知识库 API 都需要 `ALGORITHM` 参数
2. `available` 返回 **Boolean**，数量用 `result_count`
3. 结果是指针：字段块内部使用 `RET_ITEM_NUM` / `RET_ITEM_STR` 安全访问
4. 官方推荐消费：`getResult` → `available` → `pop_result`
5. 多算法 / Face/Hand/Pose 关键点需要 LARGE_MEMORY（ESP32 等）

## 块定义

| 块类型 | 连接 | 参数（args0顺序） | ABS格式 | 生成代码 |
|--------|------|-----------------|---------|----------|
| `huskylensv2_init_i2c_until` | 语句块 | VAR(field_input), WIRE(field_dropdown) | `huskylensv2_init_i2c_until("huskylens", WIRE)` | 见官方API |
| `huskylensv2_init_i2c` | 语句块 | VAR(field_input), WIRE(field_dropdown) | `huskylensv2_init_i2c("huskylens", WIRE)` | 见官方API |
| `huskylensv2_init_serial` | 语句块 | VAR(field_input), SERIAL(field_dropdown) | `huskylensv2_init_serial("huskylens", SERIAL)` | 见官方API |
| `huskylensv2_set_algorithm` | 语句块 | VAR(field_variable), ALGORITHM(field_dropdown) | `huskylensv2_set_algorithm(variables_get($huskylens), ALGORITHM_ANY)` | 见官方API |
| `huskylensv2_set_algorithm_until` | 语句块 | VAR(field_variable), ALGORITHM(field_dropdown) | `huskylensv2_set_algorithm_until(variables_get($huskylens), ALGORITHM_ANY)` | 见官方API |
| `huskylensv2_get_result` | 语句块 | VAR(field_variable), ALGORITHM(field_dropdown) | `huskylensv2_get_result(variables_get($huskylens), ALGORITHM_ANY)` | 见官方API |
| `huskylensv2_get_result_until` | 语句块 | VAR(field_variable), ALGORITHM(field_dropdown) | `huskylensv2_get_result_until(variables_get($huskylens), ALGORITHM_ANY)` | 见官方API |
| `huskylensv2_available` | 值块 | VAR(field_variable), ALGORITHM(field_dropdown) | `huskylensv2_available(variables_get($huskylens), ALGORITHM_ANY)` | 见官方API |
| `huskylensv2_result_count` | 值块 | VAR(field_variable), ALGORITHM(field_dropdown) | `huskylensv2_result_count(variables_get($huskylens), ALGORITHM_ANY)` | 见官方API |
| `huskylensv2_count_learned` | 值块 | VAR(field_variable), ALGORITHM(field_dropdown) | `huskylensv2_count_learned(variables_get($huskylens), ALGORITHM_ANY)` | 见官方API |
| `huskylensv2_count_id` | 值块 | VAR(field_variable), ALGORITHM(field_dropdown), ID(input_value) | `huskylensv2_count_id(variables_get($huskylens), ALGORITHM_ANY, math_number(0))` | 见官方API |
| `huskylensv2_max_id` | 值块 | VAR(field_variable), ALGORITHM(field_dropdown) | `huskylensv2_max_id(variables_get($huskylens), ALGORITHM_ANY)` | 见官方API |
| `huskylensv2_pop_result` | 值块 | VAR(field_variable), ALGORITHM(field_dropdown) | `huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY)` | 见官方API |
| `huskylensv2_get_center` | 值块 | VAR(field_variable), ALGORITHM(field_dropdown) | `huskylensv2_get_center(variables_get($huskylens), ALGORITHM_ANY)` | 见官方API |
| `huskylensv2_get_by_index` | 值块 | VAR(field_variable), ALGORITHM(field_dropdown), INDEX(input_value) | `huskylensv2_get_by_index(variables_get($huskylens), ALGORITHM_ANY, math_number(0))` | 见官方API |
| `huskylensv2_get_by_id` | 值块 | VAR(field_variable), ALGORITHM(field_dropdown), ID(input_value) | `huskylensv2_get_by_id(variables_get($huskylens), ALGORITHM_ANY, math_number(0))` | 见官方API |
| `huskylensv2_get_by_id_index` | 值块 | VAR(field_variable), ALGORITHM(field_dropdown), ID(input_value), INDEX(input_value) | `huskylensv2_get_by_id_index(variables_get($huskylens), ALGORITHM_ANY, math_number(0), math_number(0))` | 见官方API |
| `huskylensv2_current_branch` | 值块 | VAR(field_variable), ALGORITHM(field_dropdown) | `huskylensv2_current_branch(variables_get($huskylens), ALGORITHM_ANY)` | 见官方API |
| `huskylensv2_upcoming_branch_count` | 值块 | VAR(field_variable), ALGORITHM(field_dropdown) | `huskylensv2_upcoming_branch_count(variables_get($huskylens), ALGORITHM_ANY)` | 见官方API |
| `huskylensv2_get_branch` | 值块 | VAR(field_variable), ALGORITHM(field_dropdown), INDEX(input_value) | `huskylensv2_get_branch(variables_get($huskylens), ALGORITHM_ANY, math_number(0))` | 见官方API |
| `huskylensv2_learn` | 语句块 | VAR(field_variable), ALGORITHM(field_dropdown) | `huskylensv2_learn(variables_get($huskylens), ALGORITHM_ANY)` | 见官方API |
| `huskylensv2_learn_value` | 值块 | VAR(field_variable), ALGORITHM(field_dropdown) | `huskylensv2_learn_value(variables_get($huskylens), ALGORITHM_ANY)` | 见官方API |
| `huskylensv2_learn_block` | 语句块 | VAR(field_variable), ALGORITHM(field_dropdown), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value) | `huskylensv2_learn_block(variables_get($huskylens), ALGORITHM_ANY, math_number(0), math_number(0), math_number(0), math_number(0))` | 见官方API |
| `huskylensv2_learn_block_value` | 值块 | VAR(field_variable), ALGORITHM(field_dropdown), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value) | `huskylensv2_learn_block_value(variables_get($huskylens), ALGORITHM_ANY, math_number(0), math_number(0), math_number(0), math_number(0))` | 见官方API |
| `huskylensv2_forget` | 语句块 | VAR(field_variable), ALGORITHM(field_dropdown) | `huskylensv2_forget(variables_get($huskylens), ALGORITHM_ANY)` | 见官方API |
| `huskylensv2_take_photo` | 值块 | VAR(field_variable), RESOLUTION(field_dropdown) | `huskylensv2_take_photo(variables_get($huskylens), RESOLUTION_DEFAULT)` | 见官方API |
| `huskylensv2_take_screenshot` | 值块 | VAR(field_variable) | `huskylensv2_take_screenshot(variables_get($huskylens))` | 见官方API |
| `huskylensv2_draw_rect` | 语句块 | VAR(field_variable), COLOR(field_dropdown), LINEWIDTH(input_value), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value) | `huskylensv2_draw_rect(variables_get($huskylens), COLOR_WHITE, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | 见官方API |
| `huskylensv2_draw_unique_rect` | 语句块 | VAR(field_variable), COLOR(field_dropdown), LINEWIDTH(input_value), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value) | `huskylensv2_draw_unique_rect(variables_get($huskylens), COLOR_WHITE, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | 见官方API |
| `huskylensv2_clear_rect` | 语句块 | VAR(field_variable) | `huskylensv2_clear_rect(variables_get($huskylens))` | 见官方API |
| `huskylensv2_draw_text` | 语句块 | VAR(field_variable), COLOR(field_dropdown), FONTSIZE(input_value), X(input_value), Y(input_value), TEXT(input_value) | `huskylensv2_draw_text(variables_get($huskylens), COLOR_WHITE, math_number(0), math_number(0), math_number(0), text(""))` | 见官方API |
| `huskylensv2_clear_text` | 语句块 | VAR(field_variable) | `huskylensv2_clear_text(variables_get($huskylens))` | 见官方API |
| `huskylensv2_save_knowledge` | 语句块 | VAR(field_variable), ALGORITHM(field_dropdown), ID(input_value) | `huskylensv2_save_knowledge(variables_get($huskylens), ALGORITHM_ANY, math_number(0))` | 见官方API |
| `huskylensv2_load_knowledge` | 语句块 | VAR(field_variable), ALGORITHM(field_dropdown), ID(input_value) | `huskylensv2_load_knowledge(variables_get($huskylens), ALGORITHM_ANY, math_number(0))` | 见官方API |
| `huskylensv2_play_music` | 语句块 | VAR(field_variable), NAME(input_value), VOLUME(input_value) | `huskylensv2_play_music(variables_get($huskylens), text(""), math_number(0))` | 见官方API |
| `huskylensv2_set_name` | 语句块 | VAR(field_variable), ALGORITHM(field_dropdown), ID(input_value), NAME(input_value) | `huskylensv2_set_name(variables_get($huskylens), ALGORITHM_ANY, math_number(0), text(""))` | 见官方API |
| `huskylensv2_get_algo_param_bool` | 值块 | VAR(field_variable), ALGORITHM(field_dropdown), KEY(input_value) | `huskylensv2_get_algo_param_bool(variables_get($huskylens), ALGORITHM_ANY, text(""))` | 见官方API |
| `huskylensv2_get_algo_param_float` | 值块 | VAR(field_variable), ALGORITHM(field_dropdown), KEY(input_value) | `huskylensv2_get_algo_param_float(variables_get($huskylens), ALGORITHM_ANY, text(""))` | 见官方API |
| `huskylensv2_get_algo_param_string` | 值块 | VAR(field_variable), ALGORITHM(field_dropdown), KEY(input_value) | `huskylensv2_get_algo_param_string(variables_get($huskylens), ALGORITHM_ANY, text(""))` | 见官方API |
| `huskylensv2_set_algo_param_bool` | 语句块 | VAR(field_variable), ALGORITHM(field_dropdown), KEY(input_value), VALUE(input_value) | `huskylensv2_set_algo_param_bool(variables_get($huskylens), ALGORITHM_ANY, text(""), logic_boolean(TRUE))` | 见官方API |
| `huskylensv2_set_algo_param_float` | 语句块 | VAR(field_variable), ALGORITHM(field_dropdown), KEY(input_value), VALUE(input_value) | `huskylensv2_set_algo_param_float(variables_get($huskylens), ALGORITHM_ANY, text(""), math_number(0))` | 见官方API |
| `huskylensv2_set_algo_param_string` | 语句块 | VAR(field_variable), ALGORITHM(field_dropdown), KEY(input_value), VALUE(input_value) | `huskylensv2_set_algo_param_string(variables_get($huskylens), ALGORITHM_ANY, text(""), text(""))` | 见官方API |
| `huskylensv2_update_algo_params` | 语句块 | VAR(field_variable), ALGORITHM(field_dropdown) | `huskylensv2_update_algo_params(variables_get($huskylens), ALGORITHM_ANY)` | 见官方API |
| `huskylensv2_result_id` | 值块 | RESULT(input_value) | `huskylensv2_result_id(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_result_x` | 值块 | RESULT(input_value) | `huskylensv2_result_x(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_result_y` | 值块 | RESULT(input_value) | `huskylensv2_result_y(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_result_width` | 值块 | RESULT(input_value) | `huskylensv2_result_width(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_result_height` | 值块 | RESULT(input_value) | `huskylensv2_result_height(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_result_name` | 值块 | RESULT(input_value) | `huskylensv2_result_name(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_result_content` | 值块 | RESULT(input_value) | `huskylensv2_result_content(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_result_confidence` | 值块 | RESULT(input_value) | `huskylensv2_result_confidence(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_result_type` | 值块 | RESULT(input_value) | `huskylensv2_result_type(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_result_pitch` | 值块 | RESULT(input_value) | `huskylensv2_result_pitch(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_result_yaw` | 值块 | RESULT(input_value) | `huskylensv2_result_yaw(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_result_roll` | 值块 | RESULT(input_value) | `huskylensv2_result_roll(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_result_azimuth` | 值块 | RESULT(input_value) | `huskylensv2_result_azimuth(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_result_classid` | 值块 | RESULT(input_value) | `huskylensv2_result_classid(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_result_xtarget` | 值块 | RESULT(input_value) | `huskylensv2_result_xtarget(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_result_ytarget` | 值块 | RESULT(input_value) | `huskylensv2_result_ytarget(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_result_angle` | 值块 | RESULT(input_value) | `huskylensv2_result_angle(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_result_length` | 值块 | RESULT(input_value) | `huskylensv2_result_length(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_result_level` | 值块 | RESULT(input_value) | `huskylensv2_result_level(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_result_steering` | 值块 | RESULT(input_value) | `huskylensv2_result_steering(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_result_throttle` | 值块 | RESULT(input_value) | `huskylensv2_result_throttle(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_is_valid` | 值块 | RESULT(input_value) | `huskylensv2_is_valid(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY))` | 见官方API |
| `huskylensv2_face_leye` | 值块 | RESULT(input_value), AXIS(field_dropdown) | `huskylensv2_face_leye(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY), x)` | 见官方API |
| `huskylensv2_face_reye` | 值块 | RESULT(input_value), AXIS(field_dropdown) | `huskylensv2_face_reye(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY), x)` | 见官方API |
| `huskylensv2_face_nose` | 值块 | RESULT(input_value), AXIS(field_dropdown) | `huskylensv2_face_nose(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY), x)` | 见官方API |
| `huskylensv2_face_lmouth` | 值块 | RESULT(input_value), AXIS(field_dropdown) | `huskylensv2_face_lmouth(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY), x)` | 见官方API |
| `huskylensv2_face_rmouth` | 值块 | RESULT(input_value), AXIS(field_dropdown) | `huskylensv2_face_rmouth(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY), x)` | 见官方API |
| `huskylensv2_hand_point` | 值块 | RESULT(input_value), POINT(field_dropdown), AXIS(field_dropdown) | `huskylensv2_hand_point(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY), wrist, x)` | 见官方API |
| `huskylensv2_pose_point` | 值块 | RESULT(input_value), POINT(field_dropdown), AXIS(field_dropdown) | `huskylensv2_pose_point(huskylensv2_pop_result(variables_get($huskylens), ALGORITHM_ANY), nose, x)` | 见官方API |
| `huskylensv2_set_multi_algorithm` | 语句块 | VAR(field_variable), ALGORITHM1(field_dropdown), ALGORITHM2(field_dropdown), ALGORITHM3(field_dropdown) | `huskylensv2_set_multi_algorithm(variables_get($huskylens), ALGORITHM_ANY, ALGORITHM_ANY, ALGORITHM_ANY)` | 见官方API |
| `huskylensv2_set_multi_algorithm_ratio` | 语句块 | VAR(field_variable), RATIO1(input_value), RATIO2(input_value), RATIO3(input_value) | `huskylensv2_set_multi_algorithm_ratio(variables_get($huskylens), math_number(0), math_number(0), math_number(0))` | 见官方API |
| `huskylensv2_start_recording` | 语句块 | VAR(field_variable), TYPE(field_dropdown), DURATION(input_value), FILENAME(input_value), RESOLUTION(field_dropdown) | `huskylensv2_start_recording(variables_get($huskylens), MEDIA_TYPE_VIDEO, math_number(0), text(""), RESOLUTION_DEFAULT)` | 见官方API |
| `huskylensv2_stop_recording` | 语句块 | VAR(field_variable), TYPE(field_dropdown) | `huskylensv2_stop_recording(variables_get($huskylens), MEDIA_TYPE_VIDEO)` | 见官方API |

## 参数选项

| 参数 | 可选值 |
|------|--------|
| ALGORITHM | ALGORITHM_ANY, ALGORITHM_FACE_RECOGNITION, ... ALGORITHM_CUSTOM2 |
| COLOR | COLOR_WHITE ... COLOR_MAGENTA |
| RESOLUTION | RESOLUTION_DEFAULT, RESOLUTION_640x480, RESOLUTION_1280x720, RESOLUTION_1920x1080 |
| TYPE | MEDIA_TYPE_VIDEO, MEDIA_TYPE_AUDIO |

## 注意事项

1. 初始化块创建变量 `$name`，后续用 `variables_get($name)`
2. 串口初始化波特率：AVR=9600，其他=115200
3. `is_valid` 生成 `(result != NULL)`

# HuskyLensV2 AI camera

HuskyLensV2 is a simple and easy-to-use AI vision sensor that supports multiple AI functions such as face recognition, object tracking, color recognition, QR code recognition, etc. It can communicate through I2C or se...

## Library Info
- **Name**: @aily-project/lib-huskylensv2
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `huskylensv2_init_i2c_until` | Statement | VAR(field_input), WIRE(dropdown) | `huskylensv2_init_i2c_until("huskylens", WIRE)` | Dynamic code |
| `huskylensv2_init_i2c` | Statement | VAR(field_input), WIRE(dropdown) | `huskylensv2_init_i2c("huskylens", WIRE)` | Dynamic code |
| `huskylensv2_init_serial` | Statement | VAR(field_input), SERIAL(dropdown) | `huskylensv2_init_serial("huskylens", SERIAL)` | Dynamic code |
| `huskylensv2_set_algorithm` | Statement | VAR(field_variable), ALGORITHM(dropdown) | `huskylensv2_set_algorithm(variables_get($huskylens), ALGORITHM_FACE_RECOGNITION)` | Dynamic code |
| `huskylensv2_set_algorithm_until` | Statement | VAR(field_variable), ALGORITHM(dropdown) | `huskylensv2_set_algorithm_until(variables_get($huskylens), ALGORITHM_FACE_RECOGNITION)` | while (! |
| `huskylensv2_get_result` | Statement | VAR(field_variable) | `huskylensv2_get_result(variables_get($huskylens))` | Dynamic code |
| `huskylensv2_available` | Value | VAR(field_variable) | `huskylensv2_available(variables_get($huskylens))` | Dynamic code |
| `huskylensv2_count_learned` | Value | VAR(field_variable) | `huskylensv2_count_learned(variables_get($huskylens))` | Dynamic code |
| `huskylensv2_count_id` | Value | VAR(field_variable), ID(input_value) | `huskylensv2_count_id(variables_get($huskylens), math_number(0))` | Dynamic code |
| `huskylensv2_get_center` | Value | VAR(field_variable) | `huskylensv2_get_center(variables_get($huskylens))` | Dynamic code |
| `huskylensv2_get_by_index` | Value | VAR(field_variable), INDEX(input_value) | `huskylensv2_get_by_index(variables_get($huskylens), math_number(0))` | Dynamic code |
| `huskylensv2_get_by_id` | Value | VAR(field_variable), ID(input_value) | `huskylensv2_get_by_id(variables_get($huskylens), math_number(0))` | Dynamic code |
| `huskylensv2_get_by_id_index` | Value | VAR(field_variable), ID(input_value), INDEX(input_value) | `huskylensv2_get_by_id_index(variables_get($huskylens), math_number(0), math_number(0))` | Dynamic code |
| `huskylensv2_learn` | Statement | VAR(field_variable) | `huskylensv2_learn(variables_get($huskylens))` | Dynamic code |
| `huskylensv2_learn_block` | Statement | VAR(field_variable), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value) | `huskylensv2_learn_block(variables_get($huskylens), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `huskylensv2_forget` | Statement | VAR(field_variable) | `huskylensv2_forget(variables_get($huskylens))` | Dynamic code |
| `huskylensv2_take_photo` | Value | VAR(field_variable), RESOLUTION(dropdown) | `huskylensv2_take_photo(variables_get($huskylens), RESOLUTION_DEFAULT)` | Dynamic code |
| `huskylensv2_take_screenshot` | Value | VAR(field_variable) | `huskylensv2_take_screenshot(variables_get($huskylens))` | Dynamic code |
| `huskylensv2_draw_rect` | Statement | VAR(field_variable), COLOR(dropdown), LINEWIDTH(input_value), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value) | `huskylensv2_draw_rect(variables_get($huskylens), COLOR_WHITE, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `huskylensv2_draw_unique_rect` | Statement | VAR(field_variable), COLOR(dropdown), LINEWIDTH(input_value), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value) | `huskylensv2_draw_unique_rect(variables_get($huskylens), COLOR_WHITE, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `huskylensv2_clear_rect` | Statement | VAR(field_variable) | `huskylensv2_clear_rect(variables_get($huskylens))` | Dynamic code |
| `huskylensv2_draw_text` | Statement | VAR(field_variable), COLOR(dropdown), FONTSIZE(input_value), X(input_value), Y(input_value), TEXT(input_value) | `huskylensv2_draw_text(variables_get($huskylens), COLOR_WHITE, math_number(0), math_number(0), math_number(0), text("value"))` | Dynamic code |
| `huskylensv2_clear_text` | Statement | VAR(field_variable) | `huskylensv2_clear_text(variables_get($huskylens))` | Dynamic code |
| `huskylensv2_save_knowledge` | Statement | VAR(field_variable), ID(input_value) | `huskylensv2_save_knowledge(variables_get($huskylens), math_number(0))` | Dynamic code |
| `huskylensv2_load_knowledge` | Statement | VAR(field_variable), ID(input_value) | `huskylensv2_load_knowledge(variables_get($huskylens), math_number(0))` | Dynamic code |
| `huskylensv2_play_music` | Statement | VAR(field_variable), NAME(input_value), VOLUME(input_value) | `huskylensv2_play_music(variables_get($huskylens), text("value"), math_number(0))` | Dynamic code |
| `huskylensv2_set_name` | Statement | VAR(field_variable), ID(input_value), NAME(input_value) | `huskylensv2_set_name(variables_get($huskylens), math_number(0), text("value"))` | Dynamic code |
| `huskylensv2_result_id` | Value | RESULT(input_value) | `huskylensv2_result_id(math_number(0))` | Dynamic code |
| `huskylensv2_result_x` | Value | RESULT(input_value) | `huskylensv2_result_x(math_number(0))` | Dynamic code |
| `huskylensv2_result_y` | Value | RESULT(input_value) | `huskylensv2_result_y(math_number(0))` | Dynamic code |
| `huskylensv2_result_width` | Value | RESULT(input_value) | `huskylensv2_result_width(math_number(0))` | Dynamic code |
| `huskylensv2_result_height` | Value | RESULT(input_value) | `huskylensv2_result_height(math_number(0))` | Dynamic code |
| `huskylensv2_result_name` | Value | RESULT(input_value) | `huskylensv2_result_name(math_number(0))` | Dynamic code |
| `huskylensv2_result_content` | Value | RESULT(input_value) | `huskylensv2_result_content(math_number(0))` | Dynamic code |
| `huskylensv2_result_confidence` | Value | RESULT(input_value) | `huskylensv2_result_confidence(math_number(0))` | Dynamic code |
| `huskylensv2_result_type` | Value | RESULT(input_value) | `huskylensv2_result_type(math_number(0))` | Dynamic code |
| `huskylensv2_is_valid` | Value | RESULT(input_value) | `huskylensv2_is_valid(math_number(0))` | Dynamic code |
| `huskylensv2_set_multi_algorithm` | Statement | VAR(field_variable), ALGORITHM1(dropdown), ALGORITHM2(dropdown), ALGORITHM3(dropdown) | `huskylensv2_set_multi_algorithm(variables_get($huskylens), ALGORITHM_FACE_RECOGNITION, ALGORITHM_FACE_RECOGNITION, ALGORITHM_FACE_RECOGNITION)` | Dynamic code |
| `huskylensv2_set_multi_algorithm_ratio` | Statement | VAR(field_variable), RATIO1(input_value), RATIO2(input_value), RATIO3(input_value) | `huskylensv2_set_multi_algorithm_ratio(variables_get($huskylens), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `huskylensv2_start_recording` | Statement | VAR(field_variable), TYPE(dropdown), DURATION(input_value), FILENAME(input_value), RESOLUTION(dropdown) | `huskylensv2_start_recording(variables_get($huskylens), MEDIA_TYPE_VIDEO, math_number(1000), text("value"), "0")` | Dynamic code |
| `huskylensv2_stop_recording` | Statement | VAR(field_variable), TYPE(dropdown) | `huskylensv2_stop_recording(variables_get($huskylens), MEDIA_TYPE_VIDEO)` | Dynamic code |
| `huskylensv2_result_pitch` | Value | RESULT(input_value) | `huskylensv2_result_pitch(math_number(0))` | Dynamic code |
| `huskylensv2_result_yaw` | Value | RESULT(input_value) | `huskylensv2_result_yaw(math_number(0))` | Dynamic code |
| `huskylensv2_result_roll` | Value | RESULT(input_value) | `huskylensv2_result_roll(math_number(0))` | Dynamic code |
| `huskylensv2_result_azimuth` | Value | RESULT(input_value) | `huskylensv2_result_azimuth(math_number(0))` | Dynamic code |
| `huskylensv2_result_classid` | Value | RESULT(input_value) | `huskylensv2_result_classid(math_number(0))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ALGORITHM | ALGORITHM_FACE_RECOGNITION, ALGORITHM_OBJECT_TRACKING, ALGORITHM_OBJECT_RECOGNITION, ALGORITHM_COLOR_RECOGNITION, ALGORITHM_OBJECT_CLASSIFICATION, ALGORITHM_SELF_LEARNING_CLASSIFICATION, ALGORITHM_SEGMENT, ALGORITHM_H... | huskylensv2_set_algorithm, huskylensv2_set_algorithm_until |
| RESOLUTION | RESOLUTION_DEFAULT, RESOLUTION_640x480, RESOLUTION_1280x720, RESOLUTION_1920x1080 | huskylensv2_take_photo |
| COLOR | COLOR_WHITE, COLOR_RED, COLOR_ORANGE, COLOR_YELLOW, COLOR_GREEN, COLOR_CYAN, COLOR_BLUE, COLOR_PURPLE, COLOR_PINK, COLOR_GRAY, COLOR_BLACK, COLOR_BROWN, COLOR_OLIVE, COLOR_TEAL, COLOR_INDIGO, COLOR_MAGENTA | huskylensv2_draw_rect, huskylensv2_draw_unique_rect, huskylensv2_draw_text |
| ALGORITHM1 | ALGORITHM_FACE_RECOGNITION, ALGORITHM_OBJECT_TRACKING, ALGORITHM_OBJECT_RECOGNITION, ALGORITHM_COLOR_RECOGNITION, ALGORITHM_OBJECT_CLASSIFICATION, ALGORITHM_SELF_LEARNING_CLASSIFICATION, ALGORITHM_SEGMENT, ALGORITHM_H... | huskylensv2_set_multi_algorithm |
| ALGORITHM2 | ALGORITHM_FACE_RECOGNITION, ALGORITHM_OBJECT_TRACKING, ALGORITHM_OBJECT_RECOGNITION, ALGORITHM_COLOR_RECOGNITION, ALGORITHM_OBJECT_CLASSIFICATION, ALGORITHM_SELF_LEARNING_CLASSIFICATION, ALGORITHM_SEGMENT, ALGORITHM_H... | huskylensv2_set_multi_algorithm |
| ALGORITHM3 | ALGORITHM_FACE_RECOGNITION, ALGORITHM_OBJECT_TRACKING, ALGORITHM_OBJECT_RECOGNITION, ALGORITHM_COLOR_RECOGNITION, ALGORITHM_OBJECT_CLASSIFICATION, ALGORITHM_SELF_LEARNING_CLASSIFICATION, ALGORITHM_SEGMENT, ALGORITHM_H... | huskylensv2_set_multi_algorithm |
| TYPE | MEDIA_TYPE_VIDEO, MEDIA_TYPE_AUDIO | huskylensv2_start_recording, huskylensv2_stop_recording |
| RESOLUTION | 0, 1, 2 | huskylensv2_start_recording |

## ABS Examples

### Basic Usage
```
arduino_setup()
    huskylensv2_init_i2c_until("huskylens", WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, huskylensv2_available(variables_get($huskylens)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `huskylensv2_init_i2c_until("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

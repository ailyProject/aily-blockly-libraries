# HuskyLensV2 AI摄像头

HuskyLensV2是一款简单易用的AI视觉传感器，支持人脸识别、物体追踪、颜色识别、二维码识别等多种AI功能，可通过I2C或串口通信

## Library Info
- **Name**: @aily-project/lib-huskylensv2
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `huskylensv2_init_i2c_until` | Statement | VAR(field_input), WIRE(dropdown) | `huskylensv2_init_i2c_until("huskylens", WIRE)` | `` |
| `huskylensv2_init_i2c` | Statement | VAR(field_input), WIRE(dropdown) | `huskylensv2_init_i2c("huskylens", WIRE)` | `` |
| `huskylensv2_init_serial` | Statement | VAR(field_input), SERIAL(dropdown) | `huskylensv2_init_serial("huskylens", SERIAL)` | `` |
| `huskylensv2_set_algorithm` | Statement | VAR(field_variable), ALGORITHM(dropdown) | `huskylensv2_set_algorithm($huskylens, ALGORITHM_FACE_RECOGNITION)` | (dynamic code) |
| `huskylensv2_set_algorithm_until` | Statement | VAR(field_variable), ALGORITHM(dropdown) | `huskylensv2_set_algorithm_until($huskylens, ALGORITHM_FACE_RECOGNITION)` | `while (!` |
| `huskylensv2_get_result` | Statement | VAR(field_variable) | `huskylensv2_get_result($huskylens)` | (dynamic code) |
| `huskylensv2_available` | Value | VAR(field_variable) | `huskylensv2_available($huskylens)` | (dynamic code) |
| `huskylensv2_count_learned` | Value | VAR(field_variable) | `huskylensv2_count_learned($huskylens)` | (dynamic code) |
| `huskylensv2_count_id` | Value | VAR(field_variable), ID(input_value) | `huskylensv2_count_id($huskylens, math_number(0))` | (dynamic code) |
| `huskylensv2_get_center` | Value | VAR(field_variable) | `huskylensv2_get_center($huskylens)` | (dynamic code) |
| `huskylensv2_get_by_index` | Value | VAR(field_variable), INDEX(input_value) | `huskylensv2_get_by_index($huskylens, math_number(0))` | (dynamic code) |
| `huskylensv2_get_by_id` | Value | VAR(field_variable), ID(input_value) | `huskylensv2_get_by_id($huskylens, math_number(0))` | (dynamic code) |
| `huskylensv2_get_by_id_index` | Value | VAR(field_variable), ID(input_value), INDEX(input_value) | `huskylensv2_get_by_id_index($huskylens, math_number(0), math_number(0))` | (dynamic code) |
| `huskylensv2_learn` | Statement | VAR(field_variable) | `huskylensv2_learn($huskylens)` | (dynamic code) |
| `huskylensv2_learn_block` | Statement | VAR(field_variable), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value) | `huskylensv2_learn_block($huskylens, math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `huskylensv2_forget` | Statement | VAR(field_variable) | `huskylensv2_forget($huskylens)` | (dynamic code) |
| `huskylensv2_take_photo` | Value | VAR(field_variable), RESOLUTION(dropdown) | `huskylensv2_take_photo($huskylens, RESOLUTION_DEFAULT)` | (dynamic code) |
| `huskylensv2_take_screenshot` | Value | VAR(field_variable) | `huskylensv2_take_screenshot($huskylens)` | (dynamic code) |
| `huskylensv2_draw_rect` | Statement | VAR(field_variable), COLOR(dropdown), LINEWIDTH(input_value), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value) | `huskylensv2_draw_rect($huskylens, COLOR_WHITE, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `huskylensv2_draw_unique_rect` | Statement | VAR(field_variable), COLOR(dropdown), LINEWIDTH(input_value), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value) | `huskylensv2_draw_unique_rect($huskylens, COLOR_WHITE, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `huskylensv2_clear_rect` | Statement | VAR(field_variable) | `huskylensv2_clear_rect($huskylens)` | (dynamic code) |
| `huskylensv2_draw_text` | Statement | VAR(field_variable), COLOR(dropdown), FONTSIZE(input_value), X(input_value), Y(input_value), TEXT(input_value) | `huskylensv2_draw_text($huskylens, COLOR_WHITE, math_number(0), math_number(0), math_number(0), text("hello"))` | (dynamic code) |
| `huskylensv2_clear_text` | Statement | VAR(field_variable) | `huskylensv2_clear_text($huskylens)` | (dynamic code) |
| `huskylensv2_save_knowledge` | Statement | VAR(field_variable), ID(input_value) | `huskylensv2_save_knowledge($huskylens, math_number(0))` | (dynamic code) |
| `huskylensv2_load_knowledge` | Statement | VAR(field_variable), ID(input_value) | `huskylensv2_load_knowledge($huskylens, math_number(0))` | (dynamic code) |
| `huskylensv2_play_music` | Statement | VAR(field_variable), NAME(input_value), VOLUME(input_value) | `huskylensv2_play_music($huskylens, math_number(0), math_number(0))` | (dynamic code) |
| `huskylensv2_set_name` | Statement | VAR(field_variable), ID(input_value), NAME(input_value) | `huskylensv2_set_name($huskylens, math_number(0), math_number(0))` | (dynamic code) |
| `huskylensv2_result_id` | Value | RESULT(input_value) | `huskylensv2_result_id(math_number(0))` | (dynamic code) |
| `huskylensv2_result_x` | Value | RESULT(input_value) | `huskylensv2_result_x(math_number(0))` | (dynamic code) |
| `huskylensv2_result_y` | Value | RESULT(input_value) | `huskylensv2_result_y(math_number(0))` | (dynamic code) |
| `huskylensv2_result_width` | Value | RESULT(input_value) | `huskylensv2_result_width(math_number(0))` | (dynamic code) |
| `huskylensv2_result_height` | Value | RESULT(input_value) | `huskylensv2_result_height(math_number(0))` | (dynamic code) |
| `huskylensv2_result_name` | Value | RESULT(input_value) | `huskylensv2_result_name(math_number(0))` | (dynamic code) |
| `huskylensv2_result_content` | Value | RESULT(input_value) | `huskylensv2_result_content(math_number(0))` | (dynamic code) |
| `huskylensv2_result_confidence` | Value | RESULT(input_value) | `huskylensv2_result_confidence(math_number(0))` | (dynamic code) |
| `huskylensv2_result_type` | Value | RESULT(input_value) | `huskylensv2_result_type(math_number(0))` | (dynamic code) |
| `huskylensv2_is_valid` | Value | RESULT(input_value) | `huskylensv2_is_valid(math_number(0))` | (dynamic code) |
| `huskylensv2_set_multi_algorithm` | Statement | VAR(field_variable), ALGORITHM1(dropdown), ALGORITHM2(dropdown), ALGORITHM3(dropdown) | `huskylensv2_set_multi_algorithm($huskylens, ALGORITHM_FACE_RECOGNITION, ALGORITHM_FACE_RECOGNITION, ALGORITHM_FACE_RECOGNITION)` | (dynamic code) |
| `huskylensv2_set_multi_algorithm_ratio` | Statement | VAR(field_variable), RATIO1(input_value), RATIO2(input_value), RATIO3(input_value) | `huskylensv2_set_multi_algorithm_ratio($huskylens, math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `huskylensv2_start_recording` | Statement | VAR(field_variable), TYPE(dropdown), DURATION(input_value), FILENAME(input_value), RESOLUTION(dropdown) | `huskylensv2_start_recording($huskylens, MEDIA_TYPE_VIDEO, math_number(0), math_number(0), 0)` | (dynamic code) |
| `huskylensv2_stop_recording` | Statement | VAR(field_variable), TYPE(dropdown) | `huskylensv2_stop_recording($huskylens, MEDIA_TYPE_VIDEO)` | (dynamic code) |
| `huskylensv2_result_pitch` | Value | RESULT(input_value) | `huskylensv2_result_pitch(math_number(0))` | (dynamic code) |
| `huskylensv2_result_yaw` | Value | RESULT(input_value) | `huskylensv2_result_yaw(math_number(0))` | (dynamic code) |
| `huskylensv2_result_roll` | Value | RESULT(input_value) | `huskylensv2_result_roll(math_number(0))` | (dynamic code) |
| `huskylensv2_result_azimuth` | Value | RESULT(input_value) | `huskylensv2_result_azimuth(math_number(0))` | (dynamic code) |
| `huskylensv2_result_classid` | Value | RESULT(input_value) | `huskylensv2_result_classid(math_number(0))` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ALGORITHM | ALGORITHM_FACE_RECOGNITION, ALGORITHM_OBJECT_TRACKING, ALGORITHM_OBJECT_RECOGNITION, ALGORITHM_COLOR_RECOGNITION, ALGORITHM_OBJECT_CLASSIFICATION, ALGORITHM_SELF_LEARNING_CLASSIFICATION, ALGORITHM_SEGMENT, ALGORITHM_HAND_RECOGNITION, ALGORITHM_POSE_RECOGNITION, ALGORITHM_LICENSE_RECOGNITION, ALGORITHM_OCR_RECOGNITION, ALGORITHM_LINE_TRACKING, ALGORITHM_EMOTION_RECOGNITION, ALGORITHM_GAZE_RECOGNITION, ALGORITHM_FACE_ORIENTATION, ALGORITHM_TAG_RECOGNITION, ALGORITHM_BARCODE_RECOGNITION, ALGORITHM_QRCODE_RECOGNITION, ALGORITHM_FALLDOWN_RECOGNITION | 人脸识别 / 物体追踪 / 物体识别 / 颜色识别 / 物体分类 / 自学习分类 / 分割 / 手势识别 / 姿态识别 / 车牌识别 / OCR文字识别 / 巡线追踪 / 表情识别 / 视线识别 / 人脸朝向 / 标签识别 / 条形码识别 / 二维码识别 / 跌倒识别 |
| RESOLUTION | RESOLUTION_DEFAULT, RESOLUTION_640x480, RESOLUTION_1280x720, RESOLUTION_1920x1080 | 默认 / 640x480 / 1280x720 / 1920x1080 |
| COLOR | COLOR_WHITE, COLOR_RED, COLOR_ORANGE, COLOR_YELLOW, COLOR_GREEN, COLOR_CYAN, COLOR_BLUE, COLOR_PURPLE, COLOR_PINK, COLOR_GRAY, COLOR_BLACK, COLOR_BROWN, COLOR_OLIVE, COLOR_TEAL, COLOR_INDIGO, COLOR_MAGENTA | 白色 / 红色 / 橙色 / 黄色 / 绿色 / 青色 / 蓝色 / 紫色 / 粉色 / 灰色 / 黑色 / 棕色 / 橄榄绿 / 蓝绿色 / 靛蓝色 / 洋红色 |
| ALGORITHM1 | ALGORITHM_FACE_RECOGNITION, ALGORITHM_OBJECT_TRACKING, ALGORITHM_OBJECT_RECOGNITION, ALGORITHM_COLOR_RECOGNITION, ALGORITHM_OBJECT_CLASSIFICATION, ALGORITHM_SELF_LEARNING_CLASSIFICATION, ALGORITHM_SEGMENT, ALGORITHM_HAND_RECOGNITION, ALGORITHM_POSE_RECOGNITION, ALGORITHM_LICENSE_RECOGNITION, ALGORITHM_OCR_RECOGNITION, ALGORITHM_LINE_TRACKING, ALGORITHM_EMOTION_RECOGNITION, ALGORITHM_GAZE_RECOGNITION, ALGORITHM_FACE_ORIENTATION, ALGORITHM_TAG_RECOGNITION, ALGORITHM_BARCODE_RECOGNITION, ALGORITHM_QRCODE_RECOGNITION, ALGORITHM_FALLDOWN_RECOGNITION | 人脸识别 / 物体追踪 / 物体识别 / 颜色识别 / 物体分类 / 自学习分类 / 分割 / 手势识别 / 姿态识别 / 车牌识别 / OCR文字识别 / 巡线追踪 / 表情识别 / 视线识别 / 人脸朝向 / 标签识别 / 条形码识别 / 二维码识别 / 跌倒识别 |
| ALGORITHM2 | ALGORITHM_FACE_RECOGNITION, ALGORITHM_OBJECT_TRACKING, ALGORITHM_OBJECT_RECOGNITION, ALGORITHM_COLOR_RECOGNITION, ALGORITHM_OBJECT_CLASSIFICATION, ALGORITHM_SELF_LEARNING_CLASSIFICATION, ALGORITHM_SEGMENT, ALGORITHM_HAND_RECOGNITION, ALGORITHM_POSE_RECOGNITION, ALGORITHM_LICENSE_RECOGNITION, ALGORITHM_OCR_RECOGNITION, ALGORITHM_LINE_TRACKING, ALGORITHM_EMOTION_RECOGNITION, ALGORITHM_GAZE_RECOGNITION, ALGORITHM_FACE_ORIENTATION, ALGORITHM_TAG_RECOGNITION, ALGORITHM_BARCODE_RECOGNITION, ALGORITHM_QRCODE_RECOGNITION, ALGORITHM_FALLDOWN_RECOGNITION | 人脸识别 / 物体追踪 / 物体识别 / 颜色识别 / 物体分类 / 自学习分类 / 分割 / 手势识别 / 姿态识别 / 车牌识别 / OCR文字识别 / 巡线追踪 / 表情识别 / 视线识别 / 人脸朝向 / 标签识别 / 条形码识别 / 二维码识别 / 跌倒识别 |
| ALGORITHM3 | ALGORITHM_FACE_RECOGNITION, ALGORITHM_OBJECT_TRACKING, ALGORITHM_OBJECT_RECOGNITION, ALGORITHM_COLOR_RECOGNITION, ALGORITHM_OBJECT_CLASSIFICATION, ALGORITHM_SELF_LEARNING_CLASSIFICATION, ALGORITHM_SEGMENT, ALGORITHM_HAND_RECOGNITION, ALGORITHM_POSE_RECOGNITION, ALGORITHM_LICENSE_RECOGNITION, ALGORITHM_OCR_RECOGNITION, ALGORITHM_LINE_TRACKING, ALGORITHM_EMOTION_RECOGNITION, ALGORITHM_GAZE_RECOGNITION, ALGORITHM_FACE_ORIENTATION, ALGORITHM_TAG_RECOGNITION, ALGORITHM_BARCODE_RECOGNITION, ALGORITHM_QRCODE_RECOGNITION, ALGORITHM_FALLDOWN_RECOGNITION | 人脸识别 / 物体追踪 / 物体识别 / 颜色识别 / 物体分类 / 自学习分类 / 分割 / 手势识别 / 姿态识别 / 车牌识别 / OCR文字识别 / 巡线追踪 / 表情识别 / 视线识别 / 人脸朝向 / 标签识别 / 条形码识别 / 二维码识别 / 跌倒识别 |
| TYPE | MEDIA_TYPE_VIDEO, MEDIA_TYPE_AUDIO | 视频 / 音频 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    huskylensv2_init_i2c_until("huskylens", WIRE)
    huskylensv2_init_i2c("huskylens", WIRE)
    huskylensv2_init_serial("huskylens", SERIAL)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, huskylensv2_available($huskylens))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `huskylensv2_init_i2c_until("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

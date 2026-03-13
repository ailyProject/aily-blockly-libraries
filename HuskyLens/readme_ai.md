# HuskyLens AI摄像头

HuskyLens AI视觉传感器库，支持人脸识别、物体追踪、物体识别、巡线追踪、颜色识别、标签识别等多种AI功能，支持I2C和串口通信

## Library Info
- **Name**: @aily-project/lib-huskylens
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `huskylens_init_i2c_until` | Statement | VAR(field_input), WIRE(dropdown) | `huskylens_init_i2c_until("huskylens", WIRE)` | `` |
| `huskylens_init_i2c` | Statement | VAR(field_input), WIRE(dropdown) | `huskylens_init_i2c("huskylens", WIRE)` | `` |
| `huskylens_init_serial` | Statement | VAR(field_input), SERIAL(dropdown) | `huskylens_init_serial("huskylens", SERIAL)` | `` |
| `huskylens_set_algorithm` | Statement | VAR(field_variable), ALGORITHM(dropdown) | `huskylens_set_algorithm($huskylens, ALGORITHM_FACE_RECOGNITION)` | (dynamic code) |
| `huskylens_set_algorithm_until` | Statement | VAR(field_variable), ALGORITHM(dropdown) | `huskylens_set_algorithm_until($huskylens, ALGORITHM_FACE_RECOGNITION)` | `while (!` |
| `huskylens_request` | Statement | VAR(field_variable) | `huskylens_request($huskylens)` | (dynamic code) |
| `huskylens_request_blocks` | Statement | VAR(field_variable) | `huskylens_request_blocks($huskylens)` | (dynamic code) |
| `huskylens_request_arrows` | Statement | VAR(field_variable) | `huskylens_request_arrows($huskylens)` | (dynamic code) |
| `huskylens_available` | Value | VAR(field_variable) | `huskylens_available($huskylens)` | (dynamic code) |
| `huskylens_is_learned` | Value | VAR(field_variable) | `huskylens_is_learned($huskylens)` | (dynamic code) |
| `huskylens_count_learned_ids` | Value | VAR(field_variable) | `huskylens_count_learned_ids($huskylens)` | (dynamic code) |
| `huskylens_is_id_learned` | Value | VAR(field_variable), ID(input_value) | `huskylens_is_id_learned($huskylens, math_number(0))` | (dynamic code) |
| `huskylens_is_appear` | Value | VAR(field_variable), TYPE(dropdown) | `huskylens_is_appear($huskylens, Blocks)` | `(` |
| `huskylens_is_id_appear` | Value | VAR(field_variable), ID(input_value), TYPE(dropdown) | `huskylens_is_id_appear($huskylens, math_number(0), Blocks)` | `(` |
| `huskylens_count_type` | Value | VAR(field_variable), TYPE(dropdown) | `huskylens_count_type($huskylens, Blocks)` | (dynamic code) |
| `huskylens_count_id_type` | Value | VAR(field_variable), ID(input_value), TYPE(dropdown) | `huskylens_count_id_type($huskylens, math_number(0), Blocks)` | (dynamic code) |
| `huskylens_get_near_center` | Value | VAR(field_variable), TYPE(dropdown), PARAM(dropdown) | `huskylens_get_near_center($huskylens, Block, ID)` | (dynamic code) |
| `huskylens_get_id_param` | Value | VAR(field_variable), ID(input_value), TYPE(dropdown), PARAM(dropdown) | `huskylens_get_id_param($huskylens, math_number(0), Block, xCenter)` | (dynamic code) |
| `huskylens_get_index_param` | Value | VAR(field_variable), INDEX(input_value), TYPE(dropdown), PARAM(dropdown) | `huskylens_get_index_param($huskylens, math_number(0), Block, ID)` | (dynamic code) |
| `huskylens_get_id_index_param` | Value | VAR(field_variable), ID(input_value), INDEX(input_value), TYPE(dropdown), PARAM(dropdown) | `huskylens_get_id_index_param($huskylens, math_number(0), math_number(0), Block, xCenter)` | (dynamic code) |
| `huskylens_set_custom_name` | Statement | VAR(field_variable), ID(input_value), NAME(input_value) | `huskylens_set_custom_name($huskylens, math_number(0), math_number(0))` | (dynamic code) |
| `huskylens_request_by_id` | Statement | VAR(field_variable), ID(input_value) | `huskylens_request_by_id($huskylens, math_number(0))` | (dynamic code) |
| `huskylens_read_block_param` | Value | VAR(field_variable), INDEX(input_value), PARAM(dropdown) | `huskylens_read_block_param($huskylens, math_number(0), xCenter)` | (dynamic code) |
| `huskylens_read_arrow_param` | Value | VAR(field_variable), INDEX(input_value), PARAM(dropdown) | `huskylens_read_arrow_param($huskylens, math_number(0), xOrigin)` | (dynamic code) |
| `huskylens_write_osd` | Statement | VAR(field_variable), X(input_value), Y(input_value), TEXT(input_value) | `huskylens_write_osd($huskylens, math_number(0), math_number(0), text("hello"))` | (dynamic code) |
| `huskylens_clear_osd` | Statement | VAR(field_variable) | `huskylens_clear_osd($huskylens)` | (dynamic code) |
| `huskylens_learn_once` | Statement | VAR(field_variable), ID(input_value) | `huskylens_learn_once($huskylens, math_number(0))` | (dynamic code) |
| `huskylens_forget_learn` | Statement | VAR(field_variable) | `huskylens_forget_learn($huskylens)` | (dynamic code) |
| `huskylens_save_model` | Statement | VAR(field_variable), INDEX(input_value) | `huskylens_save_model($huskylens, math_number(0))` | (dynamic code) |
| `huskylens_load_model` | Statement | VAR(field_variable), INDEX(input_value) | `huskylens_load_model($huskylens, math_number(0))` | (dynamic code) |
| `huskylens_take_photo` | Statement | VAR(field_variable) | `huskylens_take_photo($huskylens)` | (dynamic code) |
| `huskylens_screenshot` | Statement | VAR(field_variable) | `huskylens_screenshot($huskylens)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ALGORITHM | ALGORITHM_FACE_RECOGNITION, ALGORITHM_OBJECT_TRACKING, ALGORITHM_OBJECT_RECOGNITION, ALGORITHM_LINE_TRACKING, ALGORITHM_COLOR_RECOGNITION, ALGORITHM_TAG_RECOGNITION, ALGORITHM_OBJECT_CLASSIFICATION, ALGORITHM_QR_RECOGNITION, ALGORITHM_BARCODE_RECOGNITION | 人脸识别 / 物体追踪 / 物体识别 / 巡线追踪 / 颜色识别 / 标签识别 / 物体分类 / 二维码识别 / 条形码识别 |
| TYPE | Blocks, Arrows | 方框 / 箭头 |
| PARAM | ID, xCenter, yCenter, width, height | ID / X中心 / Y中心 / 宽度 / 高度 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    huskylens_init_i2c_until("huskylens", WIRE)
    huskylens_init_i2c("huskylens", WIRE)
    huskylens_init_serial("huskylens", SERIAL)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, huskylens_available($huskylens))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `huskylens_init_i2c_until("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

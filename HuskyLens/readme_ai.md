# HuskyLens AI camera

HuskyLens AI vision sensor library supports multiple AI functions such as face recognition, object tracking, object recognition, line tracking, color recognition, label recognition, etc., and supports I2C and serial c...

## Library Info
- **Name**: @aily-project/lib-huskylens
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `huskylens_init_i2c_until` | Statement | VAR(field_input), WIRE(dropdown) | `huskylens_init_i2c_until("huskylens", WIRE)` | Dynamic code |
| `huskylens_init_i2c` | Statement | VAR(field_input), WIRE(dropdown) | `huskylens_init_i2c("huskylens", WIRE)` | Dynamic code |
| `huskylens_init_serial` | Statement | VAR(field_input), SERIAL(dropdown) | `huskylens_init_serial("huskylens", SERIAL)` | Dynamic code |
| `huskylens_set_algorithm` | Statement | VAR(field_variable), ALGORITHM(dropdown) | `huskylens_set_algorithm(variables_get($huskylens), ALGORITHM_FACE_RECOGNITION)` | Dynamic code |
| `huskylens_set_algorithm_until` | Statement | VAR(field_variable), ALGORITHM(dropdown) | `huskylens_set_algorithm_until(variables_get($huskylens), ALGORITHM_FACE_RECOGNITION)` | while (! |
| `huskylens_request` | Statement | VAR(field_variable) | `huskylens_request(variables_get($huskylens))` | Dynamic code |
| `huskylens_request_blocks` | Statement | VAR(field_variable) | `huskylens_request_blocks(variables_get($huskylens))` | Dynamic code |
| `huskylens_request_arrows` | Statement | VAR(field_variable) | `huskylens_request_arrows(variables_get($huskylens))` | Dynamic code |
| `huskylens_available` | Value | VAR(field_variable) | `huskylens_available(variables_get($huskylens))` | Dynamic code |
| `huskylens_is_learned` | Value | VAR(field_variable) | `huskylens_is_learned(variables_get($huskylens))` | Dynamic code |
| `huskylens_count_learned_ids` | Value | VAR(field_variable) | `huskylens_count_learned_ids(variables_get($huskylens))` | Dynamic code |
| `huskylens_is_id_learned` | Value | VAR(field_variable), ID(input_value) | `huskylens_is_id_learned(variables_get($huskylens), math_number(0))` | Dynamic code |
| `huskylens_is_appear` | Value | VAR(field_variable), TYPE(dropdown) | `huskylens_is_appear(variables_get($huskylens), Blocks)` | Dynamic code |
| `huskylens_is_id_appear` | Value | VAR(field_variable), ID(input_value), TYPE(dropdown) | `huskylens_is_id_appear(variables_get($huskylens), math_number(0), Blocks)` | Dynamic code |
| `huskylens_count_type` | Value | VAR(field_variable), TYPE(dropdown) | `huskylens_count_type(variables_get($huskylens), Blocks)` | Dynamic code |
| `huskylens_count_id_type` | Value | VAR(field_variable), ID(input_value), TYPE(dropdown) | `huskylens_count_id_type(variables_get($huskylens), math_number(0), Blocks)` | Dynamic code |
| `huskylens_get_near_center` | Value | VAR(field_variable), TYPE(dropdown), PARAM(dropdown) | `huskylens_get_near_center(variables_get($huskylens), Block, ID)` | Dynamic code |
| `huskylens_get_id_param` | Value | VAR(field_variable), ID(input_value), TYPE(dropdown), PARAM(dropdown) | `huskylens_get_id_param(variables_get($huskylens), math_number(0), Block, xCenter)` | Dynamic code |
| `huskylens_get_index_param` | Value | VAR(field_variable), INDEX(input_value), TYPE(dropdown), PARAM(dropdown) | `huskylens_get_index_param(variables_get($huskylens), math_number(0), Block, ID)` | Dynamic code |
| `huskylens_get_id_index_param` | Value | VAR(field_variable), ID(input_value), INDEX(input_value), TYPE(dropdown), PARAM(dropdown) | `huskylens_get_id_index_param(variables_get($huskylens), math_number(0), math_number(0), Block, xCenter)` | Dynamic code |
| `huskylens_set_custom_name` | Statement | VAR(field_variable), ID(input_value), NAME(input_value) | `huskylens_set_custom_name(variables_get($huskylens), math_number(0), text("value"))` | Dynamic code |
| `huskylens_request_by_id` | Statement | VAR(field_variable), ID(input_value) | `huskylens_request_by_id(variables_get($huskylens), math_number(0))` | Dynamic code |
| `huskylens_read_block_param` | Value | VAR(field_variable), INDEX(input_value), PARAM(dropdown) | `huskylens_read_block_param(variables_get($huskylens), math_number(0), xCenter)` | Dynamic code |
| `huskylens_read_arrow_param` | Value | VAR(field_variable), INDEX(input_value), PARAM(dropdown) | `huskylens_read_arrow_param(variables_get($huskylens), math_number(0), xOrigin)` | Dynamic code |
| `huskylens_write_osd` | Statement | VAR(field_variable), X(input_value), Y(input_value), TEXT(input_value) | `huskylens_write_osd(variables_get($huskylens), math_number(0), math_number(0), text("value"))` | Dynamic code |
| `huskylens_clear_osd` | Statement | VAR(field_variable) | `huskylens_clear_osd(variables_get($huskylens))` | Dynamic code |
| `huskylens_learn_once` | Statement | VAR(field_variable), ID(input_value) | `huskylens_learn_once(variables_get($huskylens), math_number(0))` | Dynamic code |
| `huskylens_forget_learn` | Statement | VAR(field_variable) | `huskylens_forget_learn(variables_get($huskylens))` | Dynamic code |
| `huskylens_save_model` | Statement | VAR(field_variable), INDEX(input_value) | `huskylens_save_model(variables_get($huskylens), math_number(0))` | Dynamic code |
| `huskylens_load_model` | Statement | VAR(field_variable), INDEX(input_value) | `huskylens_load_model(variables_get($huskylens), math_number(0))` | Dynamic code |
| `huskylens_take_photo` | Statement | VAR(field_variable) | `huskylens_take_photo(variables_get($huskylens))` | Dynamic code |
| `huskylens_screenshot` | Statement | VAR(field_variable) | `huskylens_screenshot(variables_get($huskylens))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ALGORITHM | ALGORITHM_FACE_RECOGNITION, ALGORITHM_OBJECT_TRACKING, ALGORITHM_OBJECT_RECOGNITION, ALGORITHM_LINE_TRACKING, ALGORITHM_COLOR_RECOGNITION, ALGORITHM_TAG_RECOGNITION, ALGORITHM_OBJECT_CLASSIFICATION, ALGORITHM_QR_RECOG... | huskylens_set_algorithm |
| ALGORITHM | ALGORITHM_FACE_RECOGNITION, ALGORITHM_OBJECT_TRACKING, ALGORITHM_OBJECT_RECOGNITION, ALGORITHM_LINE_TRACKING, ALGORITHM_COLOR_RECOGNITION, ALGORITHM_TAG_RECOGNITION, ALGORITHM_OBJECT_CLASSIFICATION | huskylens_set_algorithm_until |
| TYPE | Blocks, Arrows | huskylens_is_appear, huskylens_is_id_appear, huskylens_count_type |
| TYPE | Block, Arrow | huskylens_get_near_center, huskylens_get_id_param, huskylens_get_index_param |
| PARAM | ID, xCenter, yCenter, width, height | huskylens_get_near_center, huskylens_get_index_param |
| PARAM | xCenter, yCenter, width, height | huskylens_get_id_param, huskylens_get_id_index_param |
| PARAM | xCenter, yCenter, width, height, ID | huskylens_read_block_param |
| PARAM | xOrigin, yOrigin, xTarget, yTarget, ID | huskylens_read_arrow_param |

## ABS Examples

### Basic Usage
```
arduino_setup()
    huskylens_init_i2c_until("huskylens", WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, huskylens_available(variables_get($huskylens)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `huskylens_init_i2c_until("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

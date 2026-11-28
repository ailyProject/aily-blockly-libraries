# HuskyLens AI camera

HuskyLens AI vision sensor library supports multiple AI functions such as face recognition, object tracking, object recognition, line tracking, color recognition, label recognition, etc., and supports I2C and serial c...

## Library Info
- **Name**: @aily-project/lib-huskylens
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `huskylens_init_i2c_until` | Statement | VAR(field_input), WIRE(dropdown) | `huskylens_init_i2c_until("huskylens", WIRE)` | `HUSKYLENS huskylens; ↵ WIRE.begin(); ↵ while (!huskylens.begin(WIRE)) { ↵ Serial.println(F("HuskyLens begin failed!")); ↵ delay(100); ↵ }` |
| `huskylens_init_i2c` | Statement | VAR(field_input), WIRE(dropdown) | `huskylens_init_i2c("huskylens", WIRE)` | `HUSKYLENS huskylens; ↵ WIRE.begin(); ↵ huskylens.begin(WIRE);` |
| `huskylens_init_serial` | Statement | VAR(field_input), SERIAL(dropdown) | `huskylens_init_serial("huskylens", SERIAL)` | `HUSKYLENS huskylens; ↵ SERIAL.begin(9600); ↵ while (!huskylens.begin(SERIAL)) { ↵ Serial.println(F("HuskyLens begin failed!")); ↵ delay(100); ↵ }` |
| `huskylens_set_algorithm` | Statement | VAR(field_variable), ALGORITHM(dropdown) | `huskylens_set_algorithm($huskylens, ALGORITHM_FACE_RECOGNITION)` | `huskylens.writeAlgorithm(ALGORITHM_FACE_RECOGNITION);` |
| `huskylens_set_algorithm_until` | Statement | VAR(field_variable), ALGORITHM(dropdown) | `huskylens_set_algorithm_until($huskylens, ALGORITHM_FACE_RECOGNITION)` | `while (!huskylens.writeAlgorithm(ALGORITHM_FACE_RECOGNITION)) { ↵ delay(100); ↵ }` |
| `huskylens_request` | Statement | VAR(field_variable) | `huskylens_request($huskylens)` | `huskylens.request();` |
| `huskylens_request_blocks` | Statement | VAR(field_variable) | `huskylens_request_blocks($huskylens)` | `huskylens.requestBlocks();` |
| `huskylens_request_arrows` | Statement | VAR(field_variable) | `huskylens_request_arrows($huskylens)` | `huskylens.requestArrows();` |
| `huskylens_available` | Value | VAR(field_variable) | `huskylens_available($huskylens)` | `huskylens.available()` |
| `huskylens_is_learned` | Value | VAR(field_variable) | `huskylens_is_learned($huskylens)` | `huskylens.isLearned()` |
| `huskylens_count_learned_ids` | Value | VAR(field_variable) | `huskylens_count_learned_ids($huskylens)` | `huskylens.countLearnedIDs()` |
| `huskylens_is_id_learned` | Value | VAR(field_variable), ID(input_value) | `huskylens_is_id_learned($huskylens, math_number(0))` | `huskylens.isLearned(1)` |
| `huskylens_is_appear` | Value | VAR(field_variable), TYPE(dropdown) | `huskylens_is_appear($huskylens, Blocks)` | `(huskylens.countBlocks() > 0)` |
| `huskylens_is_id_appear` | Value | VAR(field_variable), ID(input_value), TYPE(dropdown) | `huskylens_is_id_appear($huskylens, math_number(0), Blocks)` | `(huskylens.countBlocks(1) > 0)` |
| `huskylens_count_type` | Value | VAR(field_variable), TYPE(dropdown) | `huskylens_count_type($huskylens, Blocks)` | `huskylens.countBlocks()` |
| `huskylens_count_id_type` | Value | VAR(field_variable), ID(input_value), TYPE(dropdown) | `huskylens_count_id_type($huskylens, math_number(0), Blocks)` | `huskylens.countBlocks(1)` |
| `huskylens_get_near_center` | Value | VAR(field_variable), TYPE(dropdown), PARAM(dropdown) | `huskylens_get_near_center($huskylens, Block, ID)` | `_huskylens_getNearCenterBlock(huskylens).ID` |
| `huskylens_get_id_param` | Value | VAR(field_variable), ID(input_value), TYPE(dropdown), PARAM(dropdown) | `huskylens_get_id_param($huskylens, math_number(0), Block, xCenter)` | `huskylens.blocks.read(1, 0).xCenter` |
| `huskylens_get_index_param` | Value | VAR(field_variable), INDEX(input_value), TYPE(dropdown), PARAM(dropdown) | `huskylens_get_index_param($huskylens, math_number(0), Block, ID)` | `huskylens.blocks.readDirect(1).ID` |
| `huskylens_get_id_index_param` | Value | VAR(field_variable), ID(input_value), INDEX(input_value), TYPE(dropdown), PARAM(dropdown) | `huskylens_get_id_index_param($huskylens, math_number(0), math_number(0), Block, xCenter)` | `huskylens.blocks.read(1, 1).xCenter` |
| `huskylens_set_custom_name` | Statement | VAR(field_variable), ID(input_value), NAME(input_value) | `huskylens_set_custom_name($huskylens, math_number(0), text("value"))` | `huskylens.writeName("value", 1);` |
| `huskylens_request_by_id` | Statement | VAR(field_variable), ID(input_value) | `huskylens_request_by_id($huskylens, math_number(0))` | `huskylens.request(1);` |
| `huskylens_read_block_param` | Value | VAR(field_variable), INDEX(input_value), PARAM(dropdown) | `huskylens_read_block_param($huskylens, math_number(0), xCenter)` | `huskylens.blocks.readDirect(1).xCenter` |
| `huskylens_read_arrow_param` | Value | VAR(field_variable), INDEX(input_value), PARAM(dropdown) | `huskylens_read_arrow_param($huskylens, math_number(0), xOrigin)` | `huskylens.arrows.readDirect(1).xOrigin` |
| `huskylens_write_osd` | Statement | VAR(field_variable), X(input_value), Y(input_value), TEXT(input_value) | `huskylens_write_osd($huskylens, math_number(0), math_number(0), text("value"))` | `huskylens.writeOSD("value", 1, 1);` |
| `huskylens_clear_osd` | Statement | VAR(field_variable) | `huskylens_clear_osd($huskylens)` | `huskylens.clearOSD();` |
| `huskylens_learn_once` | Statement | VAR(field_variable), ID(input_value) | `huskylens_learn_once($huskylens, math_number(0))` | `huskylens.learnOnece(1);` |
| `huskylens_forget_learn` | Statement | VAR(field_variable) | `huskylens_forget_learn($huskylens)` | `huskylens.forgetLearn();` |
| `huskylens_save_model` | Statement | VAR(field_variable), INDEX(input_value) | `huskylens_save_model($huskylens, math_number(0))` | `huskylens.saveModelToTFCard(1);` |
| `huskylens_load_model` | Statement | VAR(field_variable), INDEX(input_value) | `huskylens_load_model($huskylens, math_number(0))` | `huskylens.loadModelFromTFCard(1);` |
| `huskylens_take_photo` | Statement | VAR(field_variable) | `huskylens_take_photo($huskylens)` | `huskylens.takePhotoToSDCard();` |
| `huskylens_screenshot` | Statement | VAR(field_variable) | `huskylens_screenshot($huskylens)` | `huskylens.screenshotToSDCard();` |

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
    serial_println(Serial, huskylens_available($huskylens))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `huskylens_init_i2c_until("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

After a successful request, `available()` gives the number of results in the saved frame. Iterate from 0 through `available() - 1` with `readDirect(index)`. On STM32, select a hardware serial port for the camera and use a separate port for the console.

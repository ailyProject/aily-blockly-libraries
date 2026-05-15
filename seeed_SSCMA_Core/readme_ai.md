# Seeed SSCMA Core

Seeed SSCMA microcontroller AI inference core library, a local AI visual processing engine optimized for ESP32-S3. Supports a variety of AI algorithms such as target detection, image classification, key point detectio...

## Library Info
- **Name**: @aily-project/lib-sscma-micro-core
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sscma_core_begin` | Statement | (none) | `sscma_core_begin()` | MA_RETURN_IF_UNEXPECTED(camera.begin(SSCMAMicroCore::VideoCapture::DefaultCameraConfigXIAO |
| `sscma_core_set_loop_task_stack_size` | Statement | SIZE(input_value) | `sscma_core_set_loop_task_stack_size(math_number(0))` | SET_LOOP_TASK_STACK_SIZE( |
| `sscma_core_invoke` | Statement | FRAME(input_value) | `sscma_core_invoke(math_number(0))` | MA_RETURN_IF_UNEXPECTED(ai.invoke( |
| `sscma_core_get_managed_frame` | Value | (none) | `sscma_core_get_managed_frame()` | camera.getManagedFrame() |
| `sscma_core_register_boxes_callback` | Hat | HANDLER(input_statement) | `sscma_core_register_boxes_callback() @HANDLER: child_block()` | ai.registerBoxesCallback( |
| `sscma_core_register_classes_callback` | Hat | HANDLER(input_statement) | `sscma_core_register_classes_callback() @HANDLER: child_block()` | ai.registerClassesCallback( |
| `sscma_core_register_points_callback` | Hat | HANDLER(input_statement) | `sscma_core_register_points_callback() @HANDLER: child_block()` | ai.registerPointsCallback( |
| `sscma_core_register_keypoints_callback` | Hat | HANDLER(input_statement) | `sscma_core_register_keypoints_callback() @HANDLER: child_block()` | ai.registerKeypointsCallback( |
| `sscma_core_register_perf_callback` | Statement | HANDLER(input_statement) | `sscma_core_register_perf_callback() @HANDLER: child_block()` | ai.registerPerfCallback( |
| `sscma_core_get_boxes` | Statement | HANDLER(input_statement) | `sscma_core_get_boxes() @HANDLER: child_block()` | Dynamic code |
| `sscma_core_get_boxes_info` | Value | PROPERTY(dropdown) | `sscma_core_get_boxes_info(x)` | Dynamic code |
| `sscma_core_get_classes` | Statement | HANDLER(input_statement) | `sscma_core_get_classes() @HANDLER: child_block()` | Dynamic code |
| `sscma_core_get_classes_info` | Value | PROPERTY(dropdown) | `sscma_core_get_classes_info(score)` | Dynamic code |
| `sscma_core_get_points` | Statement | HANDLER(input_statement) | `sscma_core_get_points() @HANDLER: child_block()` | Dynamic code |
| `sscma_core_get_points_info` | Value | PROPERTY(dropdown) | `sscma_core_get_points_info(x)` | Dynamic code |
| `sscma_core_get_keypoints` | Statement | HANDLER(input_statement) | `sscma_core_get_keypoints() @HANDLER: child_block()` | Dynamic code |
| `sscma_core_get_keypoints_info` | Value | PROPERTY(dropdown) | `sscma_core_get_keypoints_info(x)` | Dynamic code |
| `sscma_core_get_keypoints_points` | Statement | HANDLER(input_statement) | `sscma_core_get_keypoints_points() @HANDLER: child_block()` | Dynamic code |
| `sscma_core_get_keypoints_points_info` | Value | PROPERTY(dropdown) | `sscma_core_get_keypoints_points_info(x)` | Dynamic code |
| `sscma_core_get_perf` | Statement | VAR(field_input) | `sscma_core_get_perf("perf")` | Dynamic code |
| `sscma_core_get_perf_info` | Value | VAR(field_variable), PROPERTY(dropdown) | `sscma_core_get_perf_info(variables_get($perf), preprocess)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PROPERTY | x, y, w, h, score, target | sscma_core_get_boxes_info |
| PROPERTY | score, target | sscma_core_get_classes_info |
| PROPERTY | x, y, z, score, target | sscma_core_get_points_info, sscma_core_get_keypoints_points_info |
| PROPERTY | x, y, h, w, score, target | sscma_core_get_keypoints_info |
| PROPERTY | preprocess, inference, postprocess | sscma_core_get_perf_info |

## ABS Examples

### Basic Usage
```
arduino_setup()
    sscma_core_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, sscma_core_get_managed_frame())
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `sscma_core_get_perf("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

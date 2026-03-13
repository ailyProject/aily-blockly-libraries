# Seeed SSCMA Core

Seeed SSCMA微控制器AI推理核心库，专为ESP32-S3优化的本地AI视觉处理引擎。支持目标检测、图像分类、关键点检测、姿态估计等多种AI算法，可直接在微控制器上运行自定义训练的AI模型，适用于XIAO ESP32S3 Sense开发板

## Library Info
- **Name**: @aily-project/lib-sscma_micro_core
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sscma_core_begin` | Statement | (none) | `sscma_core_begin()` | `MA_RETURN_IF_UNEXPECTED(camera.begin(SSCMAMicroCore::VideoCapture::DefaultCameraConfigXIAOS3));\n` |
| `sscma_core_set_loop_task_stack_size` | Statement | SIZE(input_value) | `sscma_core_set_loop_task_stack_size(math_number(0))` | `` |
| `sscma_core_invoke` | Statement | FRAME(input_value) | `sscma_core_invoke(math_number(0))` | `MA_RETURN_IF_UNEXPECTED(ai.invoke(` |
| `sscma_core_get_managed_frame` | Value | (none) | `sscma_core_get_managed_frame()` | `camera.getManagedFrame()` |
| `sscma_core_register_boxes_callback` | Statement | (none) | `sscma_core_register_boxes_callback()` | `` |
| `sscma_core_register_classes_callback` | Statement | (none) | `sscma_core_register_classes_callback()` | `` |
| `sscma_core_register_points_callback` | Statement | (none) | `sscma_core_register_points_callback()` | `` |
| `sscma_core_register_keypoints_callback` | Statement | (none) | `sscma_core_register_keypoints_callback()` | `` |
| `sscma_core_register_perf_callback` | Statement | (none) | `sscma_core_register_perf_callback()` | `` |
| `sscma_core_get_boxes` | Statement | (none) | `sscma_core_get_boxes()` | (dynamic code) |
| `sscma_core_get_boxes_info` | Value | PROPERTY(dropdown) | `sscma_core_get_boxes_info(x)` | (dynamic code) |
| `sscma_core_get_classes` | Statement | (none) | `sscma_core_get_classes()` | (dynamic code) |
| `sscma_core_get_classes_info` | Value | PROPERTY(dropdown) | `sscma_core_get_classes_info(score)` | (dynamic code) |
| `sscma_core_get_points` | Statement | (none) | `sscma_core_get_points()` | (dynamic code) |
| `sscma_core_get_points_info` | Value | PROPERTY(dropdown) | `sscma_core_get_points_info(x)` | (dynamic code) |
| `sscma_core_get_keypoints` | Statement | (none) | `sscma_core_get_keypoints()` | (dynamic code) |
| `sscma_core_get_keypoints_info` | Value | PROPERTY(dropdown) | `sscma_core_get_keypoints_info(x)` | (dynamic code) |
| `sscma_core_get_keypoints_points` | Statement | (none) | `sscma_core_get_keypoints_points()` | (dynamic code) |
| `sscma_core_get_keypoints_points_info` | Value | PROPERTY(dropdown) | `sscma_core_get_keypoints_points_info(x)` | (dynamic code) |
| `sscma_core_get_perf` | Statement | VAR(field_input) | `sscma_core_get_perf("perf")` | (dynamic code) |
| `sscma_core_get_perf_info` | Value | VAR(field_variable), PROPERTY(dropdown) | `sscma_core_get_perf_info($perf, preprocess)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PROPERTY | x, y, w, h, score, target | X坐标 / Y坐标 / 宽度 / 高度 / 置信度 / 目标类别 |

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

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

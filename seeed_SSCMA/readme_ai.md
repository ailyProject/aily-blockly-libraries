# Seeed SSCMA AI

Seeed SSCMA AI视觉传感器通信库，通过I2C/UART/SPI协议读取Grove Vision AI V2、XIAO ESP32S3 Sense等AI视觉模组的推理结果。支持目标检测、图像分类、关键点检测、人脸识别、手势识别等多种预训练模型，可部署自定义AI模型，适用于多平台微控制器

## Library Info
- **Name**: @aily-project/lib-seeed-sscma
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sscma_begin_i2c` | Statement | VAR(field_input), WIRE(dropdown), RST(input_value), ADDRESS(input_value) | `sscma_begin_i2c("ai", WIRE, math_number(0), math_number(0))` | (dynamic code) |
| `sscma_begin_serial` | Statement | VAR(field_input), SERIAL(dropdown), RST(input_value), BAUD(input_value) | `sscma_begin_serial("ai", SERIAL, math_number(0), math_number(9600))` | `` |
| `sscma_begin_spi` | Statement | VAR(field_input), SPI(dropdown), CS(input_value), SYNC(input_value), RST(input_value), CLOCK(input_value) | `sscma_begin_spi("ai", SPI, math_number(0), math_number(0), math_number(0), math_number(0))` | `` |
| `sscma_invoke` | Value | VAR(field_variable), TIMES(field_number), FILTER(dropdown), SHOW(dropdown) | `sscma_invoke($ai, 1, true, false)` | (dynamic code) |
| `sscma_return_status` | Value | STATUS(dropdown) | `sscma_return_status(CMD_OK)` | (dynamic code) |
| `sscma_get_boxes_count` | Value | VAR(field_variable) | `sscma_get_boxes_count($ai)` | (dynamic code) |
| `sscma_get_box_info` | Value | VAR(field_variable), INDEX(input_value), PROPERTY(dropdown) | `sscma_get_box_info($ai, math_number(0), x)` | (dynamic code) |
| `sscma_get_classes_count` | Value | VAR(field_variable) | `sscma_get_classes_count($ai)` | (dynamic code) |
| `sscma_get_class_info` | Value | VAR(field_variable), INDEX(input_value), PROPERTY(dropdown) | `sscma_get_class_info($ai, math_number(0), score)` | (dynamic code) |
| `sscma_get_points_count` | Value | VAR(field_variable) | `sscma_get_points_count($ai)` | (dynamic code) |
| `sscma_get_point_info` | Value | VAR(field_variable), INDEX(input_value), PROPERTY(dropdown) | `sscma_get_point_info($ai, math_number(0), x)` | (dynamic code) |
| `sscma_check_last_image` | Value | VAR(field_variable) | `sscma_check_last_image($ai)` | — |
| `sscma_get_last_image` | Value | VAR(field_variable) | `sscma_get_last_image($ai)` | — |
| `sscma_get_performance` | Value | VAR(field_variable), STAGE(dropdown) | `sscma_get_performance($ai, prepocess)` | (dynamic code) |
| `sscma_available` | Value | VAR(field_variable) | `sscma_available($ai)` | (dynamic code) |
| `sscma_read` | Statement | VAR(field_variable), ARRAY(input_value), LENGTH(input_value) | `sscma_read($ai, math_number(0), math_number(0))` | (dynamic code) |
| `sscma_write` | Statement | VAR(field_variable), ARRAY(input_value), LENGTH(input_value) | `sscma_write($ai, math_number(0), math_number(0))` | (dynamic code) |
| `sscma_get_device_id` | Value | VAR(field_variable) | `sscma_get_device_id($ai)` | (dynamic code) |
| `sscma_get_device_name` | Value | VAR(field_variable) | `sscma_get_device_name($ai)` | (dynamic code) |
| `sscma_get_device_info` | Value | VAR(field_variable) | `sscma_get_device_info($ai)` | (dynamic code) |
| `sscma_reset` | Statement | VAR(field_variable) | `sscma_reset($ai)` | (dynamic code) |
| `sscma_save_jpeg` | Statement | VAR(field_variable) | `sscma_save_jpeg($ai)` | (dynamic code) |
| `sscma_clean_actions` | Statement | VAR(field_variable) | `sscma_clean_actions($ai)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FILTER | true, false | 是 / 否 |
| SHOW | false, true | 否 / 是 |
| STATUS | CMD_OK, CMD_AGAIN, CMD_ELOG, CMD_ETIMEDOUT, CMD_EIO, CMD_EINVAL, CMD_ENOMEM, CMD_EBUSY, CMD_ENOTSUP, CMD_EPERM, CMD_EUNKNOWN | 成功 / 重试 / 日志错误 / 超时 / IO错误 / 无效参数 / 内存不足 / 繁忙 / 不支持 / 权限错误 / 未知错误 |
| PROPERTY | x, y, w, h, score, target | X坐标 / Y坐标 / 宽度 / 高度 / 置信度 / 目标类别 |
| STAGE | prepocess, inference, postprocess | 预处理 / 推理 / 后处理 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    sscma_begin_i2c("ai", WIRE, math_number(0), math_number(0))
    sscma_begin_serial("ai", SERIAL, math_number(0), math_number(9600))
    sscma_begin_spi("ai", SPI, math_number(0), math_number(0), math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, sscma_invoke($ai, 1, true, false))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `sscma_begin_i2c("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

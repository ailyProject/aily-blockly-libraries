# Seeed SSCMA AI

Seeed SSCMA AI vision sensor communication library reads the inference results of AI vision modules such as Grove Vision AI V2 and XIAO ESP32S3 Sense through the I2C/UART/SPI protocol. Supports multiple pre-training m...

## Library Info
- **Name**: @aily-project/lib-seeed-sscma
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sscma_begin_i2c` | Statement | VAR(field_input), WIRE(dropdown), RST(input_value), ADDRESS(input_value) | `sscma_begin_i2c("ai", WIRE, math_number(0), math_number(0))` | Dynamic code |
| `sscma_begin_serial` | Statement | VAR(field_input), SERIAL(dropdown), RST(input_value), BAUD(input_value) | `sscma_begin_serial("ai", SERIAL, math_number(0), math_number(9600))` | Dynamic code |
| `sscma_begin_spi` | Statement | VAR(field_input), SPI(dropdown), CS(input_value), SYNC(input_value), RST(input_value), CLOCK(input_value) | `sscma_begin_spi("ai", SPI, math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `sscma_invoke` | Value | VAR(field_variable), TIMES(field_number), FILTER(dropdown), SHOW(dropdown) | `sscma_invoke(variables_get($ai), 1, true, false)` | Dynamic code |
| `sscma_return_status` | Value | STATUS(dropdown) | `sscma_return_status(CMD_OK)` | Dynamic code |
| `sscma_get_boxes_count` | Value | VAR(field_variable) | `sscma_get_boxes_count(variables_get($ai))` | Dynamic code |
| `sscma_get_box_info` | Value | VAR(field_variable), INDEX(input_value), PROPERTY(dropdown) | `sscma_get_box_info(variables_get($ai), math_number(0), x)` | Dynamic code |
| `sscma_get_classes_count` | Value | VAR(field_variable) | `sscma_get_classes_count(variables_get($ai))` | Dynamic code |
| `sscma_get_class_info` | Value | VAR(field_variable), INDEX(input_value), PROPERTY(dropdown) | `sscma_get_class_info(variables_get($ai), math_number(0), score)` | Dynamic code |
| `sscma_get_points_count` | Value | VAR(field_variable) | `sscma_get_points_count(variables_get($ai))` | Dynamic code |
| `sscma_get_point_info` | Value | VAR(field_variable), INDEX(input_value), PROPERTY(dropdown) | `sscma_get_point_info(variables_get($ai), math_number(0), x)` | Dynamic code |
| `sscma_check_last_image` | Value | VAR(field_variable) | `sscma_check_last_image(variables_get($ai))` | See generator |
| `sscma_get_last_image` | Value | VAR(field_variable) | `sscma_get_last_image(variables_get($ai))` | See generator |
| `sscma_get_performance` | Value | VAR(field_variable), STAGE(dropdown) | `sscma_get_performance(variables_get($ai), prepocess)` | Dynamic code |
| `sscma_available` | Value | VAR(field_variable) | `sscma_available(variables_get($ai))` | Dynamic code |
| `sscma_read` | Statement | VAR(field_variable), ARRAY(input_value), LENGTH(input_value) | `sscma_read(variables_get($ai), math_number(0), math_number(0))` | Dynamic code |
| `sscma_write` | Statement | VAR(field_variable), ARRAY(input_value), LENGTH(input_value) | `sscma_write(variables_get($ai), math_number(0), math_number(0))` | Dynamic code |
| `sscma_get_device_id` | Value | VAR(field_variable) | `sscma_get_device_id(variables_get($ai))` | Dynamic code |
| `sscma_get_device_name` | Value | VAR(field_variable) | `sscma_get_device_name(variables_get($ai))` | Dynamic code |
| `sscma_get_device_info` | Value | VAR(field_variable) | `sscma_get_device_info(variables_get($ai))` | Dynamic code |
| `sscma_reset` | Statement | VAR(field_variable) | `sscma_reset(variables_get($ai))` | Dynamic code |
| `sscma_save_jpeg` | Statement | VAR(field_variable) | `sscma_save_jpeg(variables_get($ai))` | Dynamic code |
| `sscma_clean_actions` | Statement | VAR(field_variable) | `sscma_clean_actions(variables_get($ai))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FILTER | true, false | sscma_invoke |
| SHOW | false, true | sscma_invoke |
| STATUS | CMD_OK, CMD_AGAIN, CMD_ELOG, CMD_ETIMEDOUT, CMD_EIO, CMD_EINVAL, CMD_ENOMEM, CMD_EBUSY, CMD_ENOTSUP, CMD_EPERM, CMD_EUNKNOWN | sscma_return_status |
| PROPERTY | x, y, w, h, score, target | sscma_get_box_info |
| PROPERTY | score, target | sscma_get_class_info |
| PROPERTY | x, y, score, target | sscma_get_point_info |
| STAGE | prepocess, inference, postprocess | sscma_get_performance |

## ABS Examples

### Basic Usage
```
arduino_setup()
    sscma_begin_i2c("ai", WIRE, math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, sscma_invoke(variables_get($ai), 1, true, false))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `sscma_begin_i2c("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

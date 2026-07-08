# MLX90642 Thermal Imaging

Aily Blockly library for the MLX90642 32x24 infrared thermal imaging sensor.

## Library Info
- **Name**: @aily-project/lib-melexis-mlx90642
- **Version**: 0.1.0
- **Author**: Melexis
- **Source**: https://www.melexis.com/en/product/MLX90642
- **License**: Apache-2.0
- **Compatibility**: ESP32 Arduino core

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mlx90642_init` | Statement | VAR(field_input), SDA(input_value), SCL(input_value), ADDRESS(field_input), MODE(field_dropdown), RATE(field_dropdown), FORMAT(field_dropdown) | `mlx90642_init("mlx90642", math_number(16), math_number(15), "0x66", MLX90642_CONT_MEAS_MODE, MLX90642_REF_RATE_8HZ, MLX90642_TEMPERATURE_OUTPUT)` | create address/frame globals, initialize I2C, wake, init, configure mode/rate/format |
| `mlx90642_data_ready` | Value Boolean | VAR(field_variable) | `mlx90642_data_ready(variables_get($mlx90642))` | `MLX90642_IsDataReady(addr) == MLX90642_YES` |
| `mlx90642_read_frame` | Statement | VAR(field_variable) | `mlx90642_read_frame(variables_get($mlx90642))` | `MLX90642_GetImage(addr, frame)` |
| `mlx90642_measure_now` | Value Boolean | VAR(field_variable) | `mlx90642_measure_now(variables_get($mlx90642))` | `MLX90642_MeasureNow(addr, frame) == 0` |
| `mlx90642_pixel_value` | Value Number | VAR(field_variable), X(input_value), Y(input_value), UNIT(field_dropdown) | `mlx90642_pixel_value(variables_get($mlx90642), math_number(0), math_number(0), C)` | read cached pixel as Celsius or raw value |
| `mlx90642_frame_stat` | Value Number | VAR(field_variable), STAT(field_dropdown) | `mlx90642_frame_stat(variables_get($mlx90642), MAX)` | compute min/max/average Celsius from cached frame |
| `mlx90642_progress` | Value Number | VAR(field_variable) | `mlx90642_progress(variables_get($mlx90642))` | `MLX90642_GetProgress(addr)` |
| `mlx90642_print_frame_csv` | Statement | VAR(field_variable), SERIAL(field_dropdown), BAUD(input_value) | `mlx90642_print_frame_csv(variables_get($mlx90642), Serial, math_number(921600))` | initialize serial and print cached frame as 24 CSV rows |
| `mlx90642_sleep` | Statement | VAR(field_variable) | `mlx90642_sleep(variables_get($mlx90642))` | `MLX90642_GotoSleep(addr)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | `MLX90642_CONT_MEAS_MODE`, `MLX90642_STEP_MEAS_MODE` | Continuous or step measurement |
| RATE | `MLX90642_REF_RATE_2HZ`, `MLX90642_REF_RATE_4HZ`, `MLX90642_REF_RATE_8HZ`, `MLX90642_REF_RATE_16HZ`, `MLX90642_REF_RATE_32HZ` | Frame refresh rate |
| FORMAT | `MLX90642_TEMPERATURE_OUTPUT`, `MLX90642_NORMALIZED_DATA_OUTPUT` | Temperature or normalized output |
| UNIT | `C`, `RAW` | Pixel value unit |
| STAT | `MIN`, `MAX`, `AVG` | Cached frame statistic |

## ABS Examples

```
arduino_setup()
    mlx90642_init("mlx90642", math_number(16), math_number(15), "0x66", MLX90642_CONT_MEAS_MODE, MLX90642_REF_RATE_8HZ, MLX90642_TEMPERATURE_OUTPUT)

arduino_loop()
    controls_if(mlx90642_data_ready(variables_get($mlx90642)))
        mlx90642_read_frame(variables_get($mlx90642))
        serial_println(Serial, mlx90642_frame_stat(variables_get($mlx90642), MAX))
```

## Notes

1. The init block creates `<name>_addr` and `<name>_frame`; other blocks reference the Blockly variable name to use those globals.
2. Pixel coordinates are clamped to X `0..31` and Y `0..23`.
3. Celsius helpers interpret cached frame values as signed centi-degrees (`value / 100.0`).
4. The bundled dependency uses the ESP32 `Wire.begin(SDA, SCL, frequency)` signature, so this package is marked ESP32-only.

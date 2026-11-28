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

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mlx90642_init` | Statement | VAR(field_input), SDA(input_value), SCL(input_value), ADDRESS(field_input), MODE(dropdown), RATE(dropdown), FORMAT(dropdown) | `mlx90642_init("mlx90642", math_number(16), math_number(15), "0x66", MLX90642_CONT_MEAS_MODE, MLX90642_REF_RATE_8HZ, MLX90642_TEMPERATURE_OUTPUT)` | `MLX90642_I2CInit(1, 1); ↵ MLX90642_WakeUp(mlx90642_addr); ↵ while (MLX90642_Init(mlx90642_addr) != 0) { ↵ delay(500); ↵ } ↵ MLX90642_SetMeasMode(mlx90642_addr, MLX90642_CONT_MEAS_MODE); ↵ MLX90642_SetRefreshRate(mlx90642_addr, MLX90642_REF_RATE_2HZ); ↵ MLX90642_SetOutputFormat(mlx90642_addr, MLX90642_TEMPERATURE_OUTPUT); ↵ delay(300);` |
| `mlx90642_data_ready` | Value Boolean | VAR(field_variable) | `mlx90642_data_ready($mlx90642)` | `(MLX90642_IsDataReady(mlx90642_addr) == MLX90642_YES)` |
| `mlx90642_read_frame` | Statement | VAR(field_variable) | `mlx90642_read_frame($mlx90642)` | `MLX90642_GetImage(mlx90642_addr, mlx90642_frame);` |
| `mlx90642_measure_now` | Value Boolean | VAR(field_variable) | `mlx90642_measure_now($mlx90642)` | `(MLX90642_MeasureNow(mlx90642_addr, mlx90642_frame) == 0)` |
| `mlx90642_pixel_value` | Value Number | VAR(field_variable), X(input_value), Y(input_value), UNIT(dropdown) | `mlx90642_pixel_value($mlx90642, math_number(0), math_number(0), C)` | `mlx90642PixelC(mlx90642_frame, 1, 1)` |
| `mlx90642_frame_stat` | Value Number | VAR(field_variable), STAT(dropdown) | `mlx90642_frame_stat($mlx90642, MAX)` | `mlx90642FrameStatC(mlx90642_frame, 0)` |
| `mlx90642_progress` | Value Number | VAR(field_variable) | `mlx90642_progress($mlx90642)` | `MLX90642_GetProgress(mlx90642_addr)` |
| `mlx90642_print_frame_csv` | Statement | VAR(field_variable), SERIAL(dropdown), BAUD(input_value) | `mlx90642_print_frame_csv($mlx90642, Serial, math_number(921600))` | `mlx90642PrintFrameCsv(SERIAL, mlx90642_frame);` |
| `mlx90642_sleep` | Statement | VAR(field_variable) | `mlx90642_sleep($mlx90642)` | `MLX90642_GotoSleep(mlx90642_addr);` |

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
    controls_if(mlx90642_data_ready($mlx90642))
        mlx90642_read_frame($mlx90642)
        serial_println(Serial, mlx90642_frame_stat($mlx90642, MAX))
```

## Notes

1. The init block creates `<name>_addr` and `<name>_frame`; other blocks reference the Blockly variable name to use those globals.
2. Pixel coordinates are clamped to X `0..31` and Y `0..23`.
3. For temperature output, divide the signed 16-bit object pixel value by 50. The separate die-temperature register uses 100 counts per °C. Select RAW to read normalized data. After an unsuccessful acquisition the pixel and statistics blocks return NaN and the CSV block emits no rows.
4. The bundled dependency uses the ESP32 `Wire.begin(SDA, SCL, frequency)` signature, so this package is marked ESP32-only.

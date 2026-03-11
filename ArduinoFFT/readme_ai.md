# Arduino-FFT

基于arduinoFFT库的快速傅里叶变换功能库

## Library Info
- **Name**: @aily-project/lib-arduino-fft
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `Arduino_FFT_init` | Statement | REAL_ARRAY(field_variable), IMAG_ARRAY(field_variable), SAMPLES_COUNT(input_value), SAMPLING_FREQUENCY(input_value) | `Arduino_FFT_init(variables_get($vReal), variables_get($vImag), math_number(0), math_number(0))` | — |
| `Arduino_FFT_windowing` | Statement | ARRAY(field_variable), WINDOW_TYPE(dropdown), DIRECTION(dropdown) | `Arduino_FFT_windowing(variables_get($vReal), FFT_WIN_TYP_RECTANGLE, FFT_FORWARD)` | — |
| `Arduino_FFT_compute` | Statement | REAL_ARRAY(field_variable), IMAG_ARRAY(field_variable), SAMPLES_COUNT(input_value), DIRECTION(dropdown) | `Arduino_FFT_compute(variables_get($vReal), variables_get($vImag), math_number(0), FFT_FORWARD)` | — |
| `Arduino_FFT_complex_to_magnitude` | Statement | REAL_ARRAY(field_variable), IMAG_ARRAY(field_variable), SAMPLES_COUNT(input_value) | `Arduino_FFT_complex_to_magnitude(variables_get($vReal), variables_get($vImag), math_number(0))` | — |
| `Arduino_FFT_major_peak` | Value | MAGNITUDE_ARRAY(field_variable), SAMPLES_COUNT(input_value), SAMPLING_FREQUENCY(input_value) | `Arduino_FFT_major_peak(variables_get($vReal), math_number(0), math_number(0))` | — |
| `Arduino_FFT_get_band` | Value | MAGNITUDE_ARRAY(field_variable), SAMPLES_COUNT(input_value), SAMPLING_FREQUENCY(input_value), BAND_INDEX(input_value) | `Arduino_FFT_get_band(variables_get($vReal), math_number(0), math_number(0), math_number(0))` | — |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WINDOW_TYPE | FFT_WIN_TYP_RECTANGLE, FFT_WIN_TYP_HAMMING, FFT_WIN_TYP_HANN, FFT_WIN_TYP_TRIANGLE, FFT_WIN_TYP_NUTTALL, FFT_WIN_TYP_BLACKMAN, FFT_WIN_TYP_BLACKMAN_NUTTALL, FFT_WIN_TYP_BLACKMAN_HARRIS, FFT_WIN_TYP_FLT_TOP, FFT_WIN_TYP_WELCH | 矩形 / 汉明 / 汉宁 / 三角 / 纳特尔 / 布莱克曼 / 布莱克曼-纳特尔 / 布莱克曼-哈里斯 / 平顶 / Welch |
| DIRECTION | FFT_FORWARD, FFT_REVERSE | 正向 / 逆向 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    Arduino_FFT_init(variables_get($vReal), variables_get($vImag), math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, Arduino_FFT_major_peak(variables_get($vReal), math_number(0), math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

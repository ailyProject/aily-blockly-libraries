# BMP58X Barometer

DFRobot BMP58X pressure and temperature sensor blocks with bundled DFRobot_RTU dependency.

## Library Info

- **Name**: `@aily-project/lib-dfrobot-bmp58x`
- **Version**: `0.1.1`
- **Arduino classes**: `DFRobot_BMP58X_I2C`, `DFRobot_BMP58X_SPI`, `DFRobot_BMP58X_UART`
- **Bundled dependency**: `DFRobot_RTU`

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bmp58x_init_i2c` | Statement | VAR(field_input), WIRE(dropdown), ADDRESS(dropdown) | `bmp58x_init_i2c("bmp58x", Wire, "0x47")` | `bmp58x.begin();` |
| `bmp58x_init_spi` | Statement | VAR(field_input), SPI(dropdown), CS(input_value) | `bmp58x_init_spi("bmp58x", SPI, math_number(5))` | `while (!bmp58x.begin()) { ↵ delay(1000); ↵ }` |
| `bmp58x_init_uart` | Statement | VAR(field_input), SERIAL(dropdown), ADDRESS(dropdown), RX(input_value), TX(input_value) | `bmp58x_init_uart("bmp58x", Serial1, "0x47", math_number(25), math_number(26))` | `while (!bmp58x.begin()) { ↵ delay(1000); ↵ }` |
| `bmp58x_read_value` | Value Number | VAR(field_variable), DATA(dropdown) | `bmp58x_read_value($bmp58x, PRESS)` | `bmp58x.readTempC()` |
| `bmp58x_set_measure_mode` | Statement | VAR(field_variable), MODE(dropdown) | `bmp58x_set_measure_mode($bmp58x, eNormal)` | `bmp58x.setMeasureMode(DFRobot_BMP58X::eNormal);` |
| `bmp58x_set_odr` | Statement | VAR(field_variable), ODR(dropdown) | `bmp58x_set_odr($bmp58x, eOdr5Hz)` | `bmp58x.setODR(DFRobot_BMP58X::eOdr240Hz);` |
| `bmp58x_set_osr` | Statement | VAR(field_variable), TEMP(dropdown), PRESS(dropdown) | `bmp58x_set_osr($bmp58x, eOverSampling16, eOverSampling16)` | `bmp58x.setOSR(DFRobot_BMP58X::eOverSampling1, DFRobot_BMP58X::eOverSampling1);` |
| `bmp58x_set_iir` | Statement | VAR(field_variable), TEMP(dropdown), PRESS(dropdown) | `bmp58x_set_iir($bmp58x, eFilter15, eFilter15)` | `bmp58x.configIIR(DFRobot_BMP58X::eFilterBypass, DFRobot_BMP58X::eFilterBypass);` |
| `bmp58x_calibrate_altitude` | Statement | VAR(field_variable), ALTITUDE(input_value) | `bmp58x_calibrate_altitude($bmp58x, math_number(540))` | `bmp58x.calibratedAbsoluteDifference(1);` |
| `bmp58x_set_uart_baud` | Statement | VAR(field_variable), BAUD(dropdown) | `bmp58x_set_uart_baud($bmp58x, e115200)` | `bmp58x.setBaud(DFRobot_BMP58X_UART::e2400);` |
| `bmp58x_reset` | Statement | VAR(field_variable) | `bmp58x_reset($bmp58x)` | `bmp58x.reset();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| `ADDRESS` | `0x47`, `0x46` | BMP58X device or Modbus address. |
| `DATA` | `TEMP`, `PRESS`, `ALT` | Temperature C, pressure Pa, or altitude m. |
| `MODE` | `eNormal`, `eSingleShot`, `eContinuous`, `eSleep`, `eDeepSleep` | Measurement mode. |
| `ODR` | `eOdr240Hz`, `eOdr100_2Hz`, `eOdr50Hz`, `eOdr25Hz`, `eOdr10Hz`, `eOdr5Hz`, `eOdr1Hz`, `eOdr0_5Hz` | Output data rate. |
| `TEMP`, `PRESS` for OSR | `eOverSampling1` through `eOverSampling128` | Oversampling. |
| `TEMP`, `PRESS` for IIR | `eFilterBypass` through `eFilter127` | IIR filter coefficient. |
| `BAUD` | `e2400`, `e4800`, `e9600`, `e14400`, `e19200`, `e38400`, `e57600`, `e115200` | UART mode baud register value. |

## ABS Examples

```text
bmp58x_init_i2c("bmp58x", Wire, "0x47")
bmp58x_set_odr($bmp58x, eOdr5Hz)
bmp58x_set_osr($bmp58x, eOverSampling16, eOverSampling16)
bmp58x_set_iir($bmp58x, eFilter15, eFilter15)
bmp58x_calibrate_altitude($bmp58x, math_number(540))
bmp58x_set_measure_mode($bmp58x, eNormal)
bmp58x_read_value($bmp58x, PRESS)
```

## Notes

1. Initialization creates a typed Blockly variable. Use `$bmp58x` or `variables_get($bmp58x)` in later blocks.
2. UART mode depends on DFRobot_RTU; the dependency is bundled in `src.7z`.
3. `bmp58x_set_uart_baud` is only meaningful for UART/Modbus versions.
4. Interrupt and FIFO examples from the upstream library are not exposed in this first block set.

The I²C initialization block attempts setup once. On a failed sensor read, temperature, pressure, and altitude return NaN. After reconnecting the sensor, run initialization and reapply its measurement settings.

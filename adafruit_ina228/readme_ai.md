# Adafruit INA228

Blocks for the INA228 high-precision current, voltage, power, energy and charge monitor.

## Library Info
- **Name**: @aily-project/lib-adafruit-ina228
- **Version**: 0.1.2
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit_INA228
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_ina228_init` | Statement | VAR(field_input), WIRE(dropdown), ADDR(dropdown) | `adafruit_ina228_init("ina228", WIRE, "0x40")` | `Adafruit_INA228 ina228; ↵ WIRE.begin(); ↵ ina228.begin(0x40, &WIRE);` |
| `adafruit_ina228_read` | Value | VAR(field_variable), DATA(dropdown) | `adafruit_ina228_read($ina228, bus_voltage)` | `ina228.getBusVoltage_V()` |
| `adafruit_ina228_adjust` | Statement | VAR(field_variable), VALUE1(input_value), VALUE2(input_value) | `adafruit_ina228_adjust($ina228, VALUE1, VALUE2)` | `ina228.setShunt((float)1, (float)1);` |
| `adafruit_ina228_initialized` | Boolean | VAR(field_variable) | `adafruit_ina228_initialized($ina228)` | `ina228.isInitialized()` |
| `adafruit_ina228_retry` | Statement | VAR(field_variable) | `adafruit_ina228_retry($ina228)` | `ina228.retryBegin();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| adafruit_ina228_init.WIRE | board-provided options | Selects the generated API option. |
| adafruit_ina228_init.ADDR | 0x40, 0x41, 0x44, 0x45 | Selects the generated API option. |
| adafruit_ina228_read.DATA | bus_voltage, shunt_voltage, current, power, energy, charge, temperature, ready | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    adafruit_ina228_init("ina228", WIRE, "0x40")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

## Initialization and recovery

Initialization makes one attempt during setup. Use the Boolean block
adafruit_ina228_initialized to check the result. After reconnecting the device,
run adafruit_ina228_retry once in the normal program flow. It uses the saved bus
and address. A successful retry with the default reset policy restores the chip
defaults. Reapply the shunt calibration for the resistor installed on your board.
The initialized flag describes the last initialization, and conversion ready
describes an ADC sample. Numeric measurement reads return NaN on a failed transfer.

初始化失败后程序继续运行。可在器件重新连接后重试，初始化成功后重新设置分流电阻和最大电流。

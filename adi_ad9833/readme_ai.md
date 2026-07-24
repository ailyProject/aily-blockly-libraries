# ADI AD9833

Cross-controller SPI blocks for the Analog Devices AD9833 programmable waveform generator.

## Library Info
- **Name**: @aily-project/lib-adi-ad9833
- **Version**: 0.1.0
- **Author**: Analog Devices / Aily Project
- **Source**: https://www.analog.com/en/products/ad9833.html
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adi_ad9833_init` | Statement | VAR(field_input), CS(field_dropdown), REFCLK(field_input) | `adi_ad9833_init(VAR, CS, REFCLK)` | Dynamic code |
| `adi_ad9833_action` | Statement | VAR(field_variable), ACTION(field_dropdown) | `adi_ad9833_action(VAR, ACTION)` | Dynamic code |
| `adi_ad9833_set` | Statement | VAR(field_variable), SETTING(field_dropdown), VALUE(input_value) | `adi_ad9833_set(VAR, SETTING, VALUE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| adi_ad9833_init.CS | board-provided options | Selects the generated API option. |
| adi_ad9833_action.ACTION | enable, disable | Selects the generated API option. |
| adi_ad9833_set.SETTING | frequency, phase, waveform | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    adi_ad9833_init("ad9833")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

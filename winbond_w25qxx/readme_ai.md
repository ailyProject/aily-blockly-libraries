# Winbond W25Qxx

Cross-controller SPI blocks for common Winbond W25Qxx NOR flash devices.

## Library Info
- **Name**: @aily-project/lib-winbond-w25qxx
- **Version**: 0.1.0
- **Author**: Winbond / Aily Project
- **Source**: https://github.com/LibDriver/w25qxx
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `winbond_w25qxx_init` | Statement | VAR(field_input), CS(field_dropdown) | `winbond_w25qxx_init(VAR, CS)` | Dynamic code |
| `winbond_w25qxx_read` | Value | VAR(field_variable), DATA(field_dropdown), INDEX(input_value) | `winbond_w25qxx_read(VAR, DATA, INDEX)` | Dynamic code |
| `winbond_w25qxx_action` | Statement | VAR(field_variable), ACTION(field_dropdown) | `winbond_w25qxx_action(VAR, ACTION)` | Dynamic code |
| `winbond_w25qxx_set` | Statement | VAR(field_variable), SETTING(field_dropdown), VALUE(input_value) | `winbond_w25qxx_set(VAR, SETTING, VALUE)` | Dynamic code |
| `winbond_w25qxx_write` | Statement | VAR(field_variable), INDEX(input_value), VALUE(input_value) | `winbond_w25qxx_write(VAR, INDEX, VALUE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| winbond_w25qxx_init.CS | board-provided options | Selects the generated API option. |
| winbond_w25qxx_read.DATA | byte, busy, jedec | Selects the generated API option. |
| winbond_w25qxx_action.ACTION | erase_chip, sleep, wake | Selects the generated API option. |
| winbond_w25qxx_set.SETTING | erase_sector | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    winbond_w25qxx_init("w25qxx")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

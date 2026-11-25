# Adafruit MCP9600

Blocks for the MCP9600/MCP9601 I2C thermocouple EMF converter.

## Library Info
- **Name**: @aily-project/lib-adafruit-mcp9600
- **Version**: 0.1.0
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit_MCP9600
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_mcp9600_init` | Statement | VAR(field_input), WIRE(dropdown), ADDR(dropdown) | `adafruit_mcp9600_init("mcp9600", WIRE, "0x67")` | `Adafruit_MCP9600 mcp9600; ↵ WIRE.begin(); ↵ while (!(mcp9600.begin(0x67, &WIRE))) { delay(100); } ↵ mcp9600.enable(true);` |
| `adafruit_mcp9600_read` | Value | VAR(field_variable), DATA(dropdown) | `adafruit_mcp9600_read($mcp9600, thermocouple)` | `mcp9600.readThermocouple()` |
| `adafruit_mcp9600_action` | Statement | VAR(field_variable), ACTION(dropdown) | `adafruit_mcp9600_action($mcp9600, enable)` | `mcp9600.enable(true);` |
| `adafruit_mcp9600_set` | Statement | VAR(field_variable), SETTING(dropdown), VALUE(input_value) | `adafruit_mcp9600_set($mcp9600, type, math_number(0))` | `mcp9600.setThermocoupleType((MCP9600_ThemocoupleType)constrain((int)1, 0, 7));` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| adafruit_mcp9600_init.WIRE | board-provided options | Selects the generated API option. |
| adafruit_mcp9600_init.ADDR | 0x67, 0x60, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66 | Selects the generated API option. |
| adafruit_mcp9600_read.DATA | thermocouple, ambient, adc, status | Selects the generated API option. |
| adafruit_mcp9600_action.ACTION | enable, disable | Selects the generated API option. |
| adafruit_mcp9600_set.SETTING | type, filter | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    adafruit_mcp9600_init("mcp9600", WIRE, "0x67")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

0.1.1 初始化尝试一次，缺件后主循环可以继续。用结果积木检查初始化和最近一次 I²C 传输；恢复连接后执行“重试初始化”。温度读取失败返回 NaN，ADC 和状态字失败返回 0，可通过传输结果与有效零值区分。

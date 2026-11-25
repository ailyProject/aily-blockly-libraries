# Adafruit INA237/INA238

Blocks for INA237 and INA238 current, voltage and power monitors.

## Library Info
- **Name**: @aily-project/lib-adafruit-ina237-ina238
- **Version**: 0.1.1
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit_INA237_INA238
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_ina237_ina238_init` | Statement | VAR(field_input), WIRE(dropdown), MODEL(dropdown), ADDR(dropdown) | `adafruit_ina237_ina238_init("ina23x", WIRE, INA237, "0x40")` | `Adafruit_INA237 ina23x; ↵ WIRE.begin(); ↵ while (!(ina23x.begin(0x40, &WIRE))) { delay(100); }` |
| `adafruit_ina237_ina238_read` | Value | VAR(field_variable), DATA(dropdown) | `adafruit_ina237_ina238_read($ina23x, bus_voltage)` | `ina23x.getBusVoltage_V()` |
| `adafruit_ina237_ina238_adjust` | Statement | VAR(field_variable), VALUE1(input_value), VALUE2(input_value) | `adafruit_ina237_ina238_adjust($ina23x, VALUE1, VALUE2)` | `ina23x.setShunt((float)1, (float)1);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| adafruit_ina237_ina238_init.WIRE | board-provided options | Selects the generated API option. |
| adafruit_ina237_ina238_init.MODEL | INA237, INA238 | Selects the generated API option. |
| adafruit_ina237_ina238_init.ADDR | 0x40, 0x41, 0x44, 0x45 | Selects the generated API option. |
| adafruit_ina237_ina238_read.DATA | bus_voltage, shunt_voltage, current, power, temperature, ready | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    adafruit_ina237_ina238_init("ina23x", WIRE, INA237, "0x40")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.

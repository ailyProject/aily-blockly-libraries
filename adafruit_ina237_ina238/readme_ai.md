# Adafruit INA237/INA238

Blocks for INA237 and INA238 current, voltage and power monitors.

## Library Info
- **Name**: @aily-project/lib-adafruit-ina237-ina238
- **Version**: 0.1.2
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit_INA237_INA238
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_ina237_ina238_init` | Statement | VAR(field_input), WIRE(dropdown), MODEL(dropdown), ADDR(dropdown) | `adafruit_ina237_ina238_init("ina23x", WIRE, INA237, "0x40")` | `Adafruit_INA237 ina23x; ↵ WIRE.begin(); ↵ ina23x.begin(0x40, &WIRE);` |
| `adafruit_ina237_ina238_read` | Value | VAR(field_variable), DATA(dropdown) | `adafruit_ina237_ina238_read($ina23x, bus_voltage)` | `ina23x.getBusVoltage_V()` |
| `adafruit_ina237_ina238_adjust` | Statement | VAR(field_variable), VALUE1(input_value), VALUE2(input_value) | `adafruit_ina237_ina238_adjust($ina23x, VALUE1, VALUE2)` | `ina23x.setShunt((float)1, (float)1);` |
| `adafruit_ina237_ina238_initialized` | Boolean | VAR(field_variable) | `adafruit_ina237_ina238_initialized($ina23x)` | `ina23x.isInitialized()` |
| `adafruit_ina237_ina238_retry` | Statement | VAR(field_variable) | `adafruit_ina237_ina238_retry($ina23x)` | `ina23x.retryBegin();` |

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

## Initialization and measurement units

Setup tries the selected bus and address once. Check the initialized block for
the last result and use the retry block after reconnecting. Calibrate with the
actual shunt resistance and maximum current after successful initialization or
reset. A failed transfer yields NaN for a measurement. Current and power also
return NaN until calibration succeeds. A real zero is returned as zero.

Select the part number printed on the board. INA238 verifies TI and the 12-bit
device ID 0x238. The INA237 datasheet documents only the manufacturer ID.
In INA237 mode the driver checks the register layout before writing, rejects
an identified INA228, and accepts boards with the shared ID reported by
Adafruit. INA237 mode cannot uniquely identify the silicon.

Blockly reports bus voltage in V, shunt voltage in mV, current in mA, power in
mW and die temperature in °C. For existing Coder sketches, readShuntVoltage()
still returns volts. The explicit getShuntVoltage_mV() getter returns mV.

初始化只尝试一次，掉线后可重试。成功初始化或复位后，应按载板的实际阻值重新校准。
选择铭牌型号，INA237 兼容模式无法凭总线读数唯一区分 INA237 与 INA238。
分流电压积木单位为 mV。旧版 0.1.2 的该积木实际返回 V，迁移时请检查乘以 1000 的代码。

[TI INA237](https://www.ti.com/lit/ds/symlink/ina237.pdf) · [TI INA238](https://www.ti.com/lit/ds/symlink/ina238.pdf) · [Adafruit driver](https://github.com/adafruit/Adafruit_INA237_INA238)

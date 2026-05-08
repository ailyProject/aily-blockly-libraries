# SparkFun 5P49V60 可编程时钟发生器

I2C 可编程时钟发生器，通过 `SparkFun_5P49V60` 对象配置四路时钟输出。

## Library Info
- **Name**: @aily-project/lib-sparkfun-5p49v60
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `5p49v60_init` | Statement | VAR(field_input), ADDRESS(field_dropdown) | `5p49v60_init("clockGen", DEF)` | `SparkFun_5P49V60 clockGen(0x6A); Wire.begin(); clockGen.begin();` |
| `5p49v60_set_vco` | Statement | VAR(field_variable), FREQ(input_value) | `5p49v60_set_vco(variables_get($clockGen), math_number(1600))` | `clockGen.setVcoFrequency(1600.0);` |
| `5p49v60_mux_pll_to_fod` | Statement | VAR(field_variable), CHANNEL(field_dropdown) | `5p49v60_mux_pll_to_fod(variables_get($clockGen), 1)` | `clockGen.muxPllToFodOne();` |
| `5p49v60_set_clock_freq` | Statement | VAR(field_variable), CHANNEL(field_dropdown), FREQ(input_value) | `5p49v60_set_clock_freq(variables_get($clockGen), 1, math_number(16))` | `clockGen.setClockOneFreq(16.0);` |
| `5p49v60_set_clock_mode` | Statement | VAR(field_variable), CHANNEL(field_dropdown), MODE(field_dropdown) | `5p49v60_set_clock_mode(variables_get($clockGen), 1, LVPECL)` | `clockGen.clockOneConfigMode(0);` |
| `5p49v60_skew_clock` | Statement | VAR(field_variable), CHANNEL(field_dropdown), SKEW(input_value) | `5p49v60_skew_clock(variables_get($clockGen), 1, math_number(0))` | `clockGen.skewClockOne(0);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | DEF(0x6A), ALT(0x68) | I2C 地址 |
| CHANNEL | 1, 2, 3, 4 | 时钟输出通道 |
| MODE | 0(LVPECL), 1(CMOS), 2(HCSL33), 3(LVDS), 4(CMOS2), 5(CMOSD), 6(HCSL25) | 信号输出模式 |

## ABS Examples

```
arduino_setup()
    5p49v60_init("clockGen", DEF)
    5p49v60_set_vco(variables_get($clockGen), math_number(1600))
    5p49v60_mux_pll_to_fod(variables_get($clockGen), 1)
    5p49v60_set_clock_mode(variables_get($clockGen), 1, LVPECL)
    5p49v60_set_clock_freq(variables_get($clockGen), 1, math_number(16))
```

## Notes

1. **配置顺序**: 先 `set_vco` → `mux_pll_to_fod` → `set_clock_mode` → `set_clock_freq`
2. **频率单位**: 所有频率参数均为 MHz（浮点数）

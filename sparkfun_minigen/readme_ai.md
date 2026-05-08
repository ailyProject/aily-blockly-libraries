# SparkFun MiniGen 信号发生器

SparkFun MiniGen AD9837 SPI 信号发生器 Blockly 库。

## Library Info
- **Name**: @aily-project/lib-sparkfun-minigen
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `minigen_init` | Statement | VAR(field_input), FSYNC_PIN(field_number) | `minigen_init("minigen", 10)` | `MiniGen minigen(10);` |
| `minigen_reset` | Statement | VAR(field_variable) | `minigen_reset(variables_get($minigen))` | `minigen.reset();` |
| `minigen_set_mode` | Statement | VAR(field_variable), MODE(field_dropdown) | `minigen_set_mode(variables_get($minigen), MiniGen::SINE)` | `minigen.setMode(MiniGen::SINE);` |
| `minigen_set_freq` | Statement | VAR(field_variable), REG(field_dropdown), FREQ(input_value) | `minigen_set_freq(variables_get($minigen), MiniGen::FREQ0, math_number(1000))` | `minigen.adjustFreq(MiniGen::FREQ0, (uint32_t)(1000));` |
| `minigen_select_freq_reg` | Statement | VAR(field_variable), REG(field_dropdown) | `minigen_select_freq_reg(variables_get($minigen), MiniGen::FREQ0)` | `minigen.selectFreqReg(MiniGen::FREQ0);` |
| `minigen_set_phase` | Statement | VAR(field_variable), REG(field_dropdown), PHASE(input_value) | `minigen_set_phase(variables_get($minigen), MiniGen::PHASE0, math_number(0))` | `minigen.adjustPhaseShift(MiniGen::PHASE0, (uint16_t)(0));` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | MiniGen::SINE, MiniGen::TRIANGLE, MiniGen::SQUARE, MiniGen::SQUARE_2 | 波形类型 |
| REG (freq) | MiniGen::FREQ0, MiniGen::FREQ1 | 频率寄存器选择 |
| REG (phase) | MiniGen::PHASE0, MiniGen::PHASE1 | 相位寄存器选择 |

# SparkFun Si4703 FM 收音机

## Library Info
- **Name**: @aily-project/lib-sparkfun-si4703
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `si4703_init` | Statement | VAR(field_input), RST/SDIO/SCLK(value) | `si4703_init("radio", 2, A4, A5)` | `Si4703_Breakout radio(2, A4, A5); radio.powerOn();` |
| `si4703_set_channel` | Statement | VAR(field_variable), CHANNEL(value) | `si4703_set_channel(variables_get($radio), 1017)` | `radio.setChannel(1017);` |
| `si4703_seek` | Statement | VAR(field_variable), DIR(dropdown:UP/DOWN) | `si4703_seek(variables_get($radio), UP)` | `radio.seekUp();` |
| `si4703_set_volume` | Statement | VAR(field_variable), VOLUME(value) | `si4703_set_volume(variables_get($radio), 8)` | `radio.setVolume(8);` |

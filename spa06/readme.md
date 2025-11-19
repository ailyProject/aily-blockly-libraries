# SPA06-003 气压温度传感器

SPA06-003 (SPL07-003) 气压温度传感器的 Aily Blockly 图形化库。

## 库信息
**包名**: `@aily-project/lib-spa06` | **版本**: 1.0.0 | **兼容**: UNO/Mega/ESP32/ESP8266

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `spa06_create_i2c` | 语句块 | VAR(field_input), ADDR(dropdown) | `"VAR":"spa06","ADDR":"0x77"` | `SPL07_003 spa06; Wire.begin(); spa06.begin(0x77,&Wire);` |
| `spa06_create_spi` | 语句块 | VAR(field_input), PIN(field_input) | `"VAR":"spa06","PIN":"SS"` | `SPL07_003 spa06; SPI.begin(); spa06.begin(SS,&SPI);` |
| `spa06_set_pressure_sampling` | 语句块 | VAR(variable), RATE/OVERSAMPLE(dropdown) | `"VAR":{"id":"var_id"}` | `spa06.setPressureConfig(SPL07_1HZ,SPL07_1SAMPLE);` |
| `spa06_set_temperature_sampling` | 语句块 | VAR(variable), RATE/OVERSAMPLE(dropdown) | `"VAR":{"id":"var_id"}` | `spa06.setTemperatureConfig(SPL07_1HZ,SPL07_1SAMPLE);` |
| `spa06_set_mode` | 语句块 | VAR(variable), MODE(dropdown) | `"VAR":{"id":"var_id"}` | `spa06.setMode(SPL07_CONT_PRES_TEMP);` |
| `spa06_read_pressure` | 值块 | VAR(variable) | `"VAR":{"id":"var_id"}` | `spa06.readPressure()` |
| `spa06_read_temperature` | 值块 | VAR(variable) | `"VAR":{"id":"var_id"}` | `spa06.readTemperature()` |
| `spa06_calc_altitude` | 值块 | VAR(variable) | `"VAR":{"id":"var_id"}` | `spa06.calcAltitude()` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR":"spa06"` |
| field_variable | 对象 | `"VAR":{"id":"var_id"}` |
| field_dropdown | 字符串 | `"ADDR":"0x77"` |
| input_value | 块连接 | `"inputs":{"OFFSET":{"block":{...}}}` |

## 连接规则

- **初始化块**: `spa06_create_i2c`/`spa06_create_spi` 使用field_input定义对象名
- **方法块**: 其他块使用field_variable引用对象，格式为`{"id":"var_id"}`
- **语句连接**: 初始化→配置→读取，通过`next`字段连接
- **值块**: 无`next`字段，连接到`inputs`
- **板卡适配**: ESP32可选SDA/SCL引脚，UNO/Mega固定(UNO: A4/A5, Mega: 20/21)

## 使用示例

### I2C初始化+读取
```json
{
  "type": "spa06_create_i2c",
  "fields": {"VAR": "spa06", "ADDR": "0x77", "SDA_PIN": "21", "SCL_PIN": "22"},
  "next": {
    "block": {
      "type": "spa06_set_mode",
      "fields": {"VAR": {"id": "var_spa06"}, "MODE": "SPL07_CONT_PRES_TEMP"}
    }
  }
}
```

## 重要规则

1. **变量类型**: 所有块的variableTypes为`["SPL07_003"]`
2. **初始化优先**: 必须先调用create块
3. **采样率**: 1Hz-128Hz，过采样1-128次
4. **测量范围**: 气压300-1200hPa，温度-40~85°C

**原始库**: [SPL07-003](https://github.com/Kenneract/SPL07-003-Arduino-Library)
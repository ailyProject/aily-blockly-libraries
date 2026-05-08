# SparkFun MAX30105 心率/血氧传感器

读取红光、红外、绿光三通道原始光学数据。

## Library Info
- **Name**: @aily-project/lib-sparkfun-max30105
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `max30105_init` | Statement | VAR(field_input) | `max30105_init("heartSensor")` | `MAX30105 heartSensor; Wire.begin(); heartSensor.begin();` |
| `max30105_setup` | Statement | VAR(fv), LED_PWR, SAMPLE_AVG, LED_MODE, SAMPLE_RATE, PULSE_WIDTH, ADC_RANGE | `max30105_setup(variables_get($heartSensor), 60, 4, 2, 100, 411, 16384)` | `heartSensor.setup(60,4,2,100,411,16384);` |
| `max30105_safe_check` | Value→Boolean | VAR(fv), TIMEOUT(input_value) | `max30105_safe_check(variables_get($heartSensor), math_number(250))` | `heartSensor.safeCheck(250)` |
| `max30105_get_red` | Value→Number | VAR(fv) | `max30105_get_red(variables_get($heartSensor))` | `heartSensor.getRed()` |
| `max30105_get_ir` | Value→Number | VAR(fv) | `max30105_get_ir(variables_get($heartSensor))` | `heartSensor.getIR()` |
| `max30105_get_green` | Value→Number | VAR(fv) | `max30105_get_green(variables_get($heartSensor))` | `heartSensor.getGreen()` |
| `max30105_shutdown` | Statement | VAR(fv) | `max30105_shutdown(variables_get($heartSensor))` | `heartSensor.shutDown();` |
| `max30105_wakeup` | Statement | VAR(fv) | `max30105_wakeup(variables_get($heartSensor))` | `heartSensor.wakeUp();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| LED_PWR | 60,20,6 | LED 驱动电流（mA） |
| SAMPLE_AVG | 1,4,8,16,32 | 样本平均数 |
| LED_MODE | 1,2,3 | 1=红光；2=红光+红外；3=红光+红外+绿 |
| SAMPLE_RATE | 100,400,800,1000 | 采样率（Hz） |
| PULSE_WIDTH | 118,215,411 | 脉冲宽度（μs） |
| ADC_RANGE | 4096,8192,16384,32768 | ADC 满量程 |

## ABS Examples

```
arduino_setup()
    max30105_init("heartSensor")
    max30105_setup(variables_get($heartSensor), 60, 4, 2, 100, 411, 16384)
    serial_begin(Serial, 115200)

arduino_loop()
    controls_if()
        @IF0: max30105_safe_check(variables_get($heartSensor), math_number(250))
        @DO0:
            serial_println(Serial, max30105_get_ir(variables_get($heartSensor)))
```

## Notes

1. **3.3V 供电**: MAX30105 仅支持 3.3V，请勿接 5V
2. **原始数据**: 本库只提供原始计数值，心率/SpO2 计算需要配合算法库
3. **LED 模式 2**: 常用心率检测模式（红光+红外）

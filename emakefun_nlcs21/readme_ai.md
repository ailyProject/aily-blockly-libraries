# NLCS21 颜色传感器

Emakefun NLCS21 颜色传感器，支持 RGBC 颜色检测、增益和积分时间配置、中断阈值设置。

## 库信息
- **名称**: @aily-project/lib-emakefun_nlcs21
- **版本**: 1.0.0

## 块定义

| 块类型 | 连接类型 | 参数 (args0顺序) | ABS格式 | 生成代码 |
|--------|----------|------------------|---------|----------|
| `nlcs21_init` | Statement | VAR(field_input), GAIN(dropdown), INTEGRATION_TIME(dropdown) | `nlcs21_init("colorSensor", kGain1X, kIntegrationTime132ms)` | `emakefun::ColorSensorNlcs21 var(gain, time); var.Initialize();` |
| `nlcs21_get_color` | Value(Boolean) | VAR(field_variable) | `nlcs21_get_color($colorSensor)` | `var.GetColor(&var_color)` |
| `nlcs21_color_value` | Value(Number) | VAR(field_variable), CHANNEL(dropdown) | `nlcs21_color_value($colorSensor, r)` | `var_color.r` |
| `nlcs21_set_threshold` | Statement | VAR(field_variable), LOW(input_value), HIGH(input_value) | `nlcs21_set_threshold($colorSensor, math_number(0), math_number(150))` | `var.SetThreshold(low, high);` |
| `nlcs21_get_interrupt` | Value(Number) | VAR(field_variable) | `nlcs21_get_interrupt($colorSensor)` | `var.GetInterruptStatus()` |
| `nlcs21_clear_interrupt` | Statement | VAR(field_variable) | `nlcs21_clear_interrupt($colorSensor)` | `var.ClearInterrupt();` |

**说明**: `nlcs21_init` 会自动创建 `ColorSensorNlcs21` 类型变量和对应的 `Color` 结构体变量，后续用 `$变量名` 引用。

## 参数选项

| 参数 | 值 | 描述 |
|------|-----|------|
| GAIN | kGain1X | 1倍增益（默认） |
| GAIN | kGain4X | 4倍增益 |
| GAIN | kGain8X | 8倍增益 |
| GAIN | kGain32X | 32倍增益 |
| GAIN | kGain96X | 96倍增益 |
| GAIN | kGain192X | 192倍增益 |
| INTEGRATION_TIME | kIntegrationTime2ms | 2ms 积分时间 |
| INTEGRATION_TIME | kIntegrationTime8ms | 8ms 积分时间 |
| INTEGRATION_TIME | kIntegrationTime33ms | 33ms 积分时间 |
| INTEGRATION_TIME | kIntegrationTime132ms | 132ms 积分时间（默认） |
| CHANNEL | r | 红色通道 |
| CHANNEL | g | 绿色通道 |
| CHANNEL | b | 蓝色通道 |
| CHANNEL | c | 透明通道 |

## ABS 示例

### 基本颜色读取
```
arduino_setup()
    nlcs21_init("colorSensor", kGain1X, kIntegrationTime132ms)
    serial_begin(Serial, 115200)

arduino_loop()
    controls_if()
        @IF0: nlcs21_get_color(variables_get($colorSensor))
        @DO0:
            serial_print(Serial, text("R: "))
            serial_print(Serial, nlcs21_color_value(variables_get($colorSensor), r))
            serial_print(Serial, text(" G: "))
            serial_print(Serial, nlcs21_color_value(variables_get($colorSensor), g))
            serial_print(Serial, text(" B: "))
            serial_println(Serial, nlcs21_color_value(variables_get($colorSensor), b))
    time_delay(math_number(100))
```

### 中断阈值检测
```
arduino_setup()
    nlcs21_init("colorSensor", kGain1X, kIntegrationTime132ms)
    nlcs21_set_threshold(variables_get($colorSensor), math_number(0), math_number(150))
    serial_begin(Serial, 115200)

arduino_loop()
    controls_if()
        @IF0: logic_compare(nlcs21_get_interrupt(variables_get($colorSensor)), EQ, math_number(1))
        @DO0:
            serial_println(Serial, text("中断触发"))
            nlcs21_clear_interrupt(variables_get($colorSensor))
    time_delay(math_number(100))
```

## 注意事项

1. **初始化**: 必须在 `arduino_setup()` 中调用 `nlcs21_init` 初始化传感器
2. **变量引用**: 使用 `variables_get($varName)` 在值槽中引用变量
3. **I2C 通信**: 初始化会自动调用 `Wire.begin()`，无需手动初始化
4. **颜色读取**: `nlcs21_get_color` 返回布尔值表示是否有新数据，需配合 `nlcs21_color_value` 获取具体通道值
5. **增益选择**: 增益越高灵敏度越高，但可能导致饱和；建议从低增益开始调试
6. **积分时间**: 时间越长精度越高，但读取频率越低

# NLCS11 颜色传感器

Emakefun NLCS11 颜色传感器，支持 RGBC 颜色检测、增益和积分时间配置。

## 库信息
- **名称**: @aily-project/lib-emakefun_nlcs11
- **版本**: 1.0.0

## 块定义

| 块类型 | 连接类型 | 参数 (args0顺序) | ABS格式 | 生成代码 |
|--------|----------|------------------|---------|----------|
| `nlcs11_init` | Statement | VAR(field_input), GAIN(dropdown), INTEGRATION_TIME(dropdown) | `nlcs11_init("colorSensor", kGain1X, kIntegrationTime10ms)` | `emakefun::ColorSensorNlcs11 var(gain, time); var.Initialize();` |
| `nlcs11_get_color` | Value(Boolean) | VAR(field_variable) | `nlcs11_get_color($colorSensor)` | `var.GetColor(&var_color)` |
| `nlcs11_color_value` | Value(Number) | VAR(field_variable), CHANNEL(dropdown) | `nlcs11_color_value($colorSensor, r)` | `var_color.r` |

**说明**: `nlcs11_init` 会自动创建 `ColorSensorNlcs11` 类型变量和对应的 `Color` 结构体变量，后续用 `$变量名` 引用。

## 参数选项

| 参数 | 值 | 描述 |
|------|-----|------|
| GAIN | kGain1X | 1倍增益（默认） |
| GAIN | kGain1p5X | 1.5倍增益 |
| GAIN | kGain2X | 2倍增益 |
| GAIN | kGain2p5X | 2.5倍增益 |
| INTEGRATION_TIME | kIntegrationTime10ms | 10ms 积分时间（默认） |
| INTEGRATION_TIME | kIntegrationTime20ms | 20ms 积分时间 |
| INTEGRATION_TIME | kIntegrationTime40ms | 40ms 积分时间 |
| INTEGRATION_TIME | kIntegrationTime80ms | 80ms 积分时间 |
| INTEGRATION_TIME | kIntegrationTime100ms | 100ms 积分时间 |
| INTEGRATION_TIME | kIntegrationTime200ms | 200ms 积分时间 |
| INTEGRATION_TIME | kIntegrationTime400ms | 400ms 积分时间 |
| INTEGRATION_TIME | kIntegrationTime800ms | 800ms 积分时间 |
| CHANNEL | r | 红色通道 |
| CHANNEL | g | 绿色通道 |
| CHANNEL | b | 蓝色通道 |
| CHANNEL | c | 透明通道 |

## ABS 示例

### 基本颜色读取
```
arduino_setup()
    nlcs11_init("colorSensor", kGain1X, kIntegrationTime10ms)
    serial_begin(Serial, 115200)

arduino_loop()
    controls_if()
        @IF0: nlcs11_get_color(variables_get($colorSensor))
        @DO0:
            serial_print(Serial, text("R: "))
            serial_print(Serial, nlcs11_color_value(variables_get($colorSensor), r))
            serial_print(Serial, text(" G: "))
            serial_print(Serial, nlcs11_color_value(variables_get($colorSensor), g))
            serial_print(Serial, text(" B: "))
            serial_println(Serial, nlcs11_color_value(variables_get($colorSensor), b))
    time_delay(math_number(50))
```

## 注意事项

1. **初始化**: 必须在 `arduino_setup()` 中调用 `nlcs11_init` 初始化传感器
2. **变量引用**: 使用 `variables_get($varName)` 在值槽中引用变量
3. **I2C 通信**: 初始化会自动调用 `Wire.begin()`，无需手动初始化
4. **颜色读取**: `nlcs11_get_color` 返回布尔值表示是否有新数据，需配合 `nlcs11_color_value` 获取具体通道值
5. **增益选择**: 增益越高灵敏度越高，但可能导致饱和；建议从低增益开始调试
6. **积分时间**: 时间越长精度越高，但读取频率越低

# HMC5883L 三轴数字罗盘

Grove三轴数字罗盘，基于HMC5883L，I2C接口，读取磁场数据和航向角。

## Library Info
- **Name**: @aily-project/lib-seeed-hmc5883l
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `hmc5883l_init` | Statement | — | `hmc5883l_init()` | `Wire.begin(); hmc5883l_compass.setScale(1.3); hmc5883l_compass.setMeasurementMode(MEASUREMENT_CONTINUOUS);` |
| `hmc5883l_set_scale` | Statement | SCALE(dropdown) | `hmc5883l_set_scale(1.3)` | `hmc5883l_compass.setScale(1.3);` |
| `hmc5883l_get_heading` | Value | — | `hmc5883l_get_heading()` | `hmc5883l_getHeading()` |
| `hmc5883l_read_axis` | Value | AXIS(dropdown) | `hmc5883l_read_axis(X)` | `hmc5883l_readAxis('X')` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SCALE | 0.88, 1.3, 1.9, 2.5, 4.0, 4.7, 5.6, 8.1 | 磁场量程（高斯） |
| AXIS | X, Y, Z | 读取的磁场轴 |

## ABS Examples

```
arduino_setup()
    hmc5883l_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, hmc5883l_get_heading())
    time_delay(math_number(500))
```

## Notes

1. **全局对象**: 使用固定名称 `hmc5883l_compass`，无需创建变量
2. **航向角**: 返回0~360度，包含磁偏角修正
3. **量程**: 默认1.3高斯，初始化时自动设置

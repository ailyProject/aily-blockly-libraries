# SparkFun LIDAR-Lite v4

通过 I2C 获取激光测距距离值（厘米）。

## Library Info
- **Name**: @aily-project/lib-sparkfun-lidar-v4
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lidarv4_init` | Statement | VAR(field_input) | `lidarv4_init("lidar")` | `LIDARLite_v4LED lidar; Wire.begin(); lidar.begin();` |
| `lidarv4_configure` | Statement | VAR(field_variable), MODE(dropdown) | `lidarv4_configure(variables_get($lidar), 0)` | `lidar.configure(0);` |
| `lidarv4_get_distance` | Value→Number | VAR(field_variable) | `lidarv4_get_distance(variables_get($lidar))` | `lidar.getDistance()` |
| `lidarv4_is_connected` | Value→Boolean | VAR(field_variable) | `lidarv4_is_connected(variables_get($lidar))` | `lidar.isConnected()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | 0,1,2,3,4,5 | 0=默认；1=短距高速；2=短距高精；3=最大距；4=高灵敏；5=低灵敏 |

## ABS Examples

### 循环读取距离
```
arduino_setup()
    lidarv4_init("lidar")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, lidarv4_get_distance(variables_get($lidar)))
    time_delay(math_number(100))
```

## Notes

1. **初始化**: 在 `arduino_setup()` 中调用，需已执行 `Wire.begin()`（初始化块内含）
2. **getDistance()**: 封装了「触发→等待→读取」三步，是最简单的使用方式

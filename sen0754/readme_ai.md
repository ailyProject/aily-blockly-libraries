# SEN0754 超声波液位传感器库

通过 UART Modbus RTU（固定 115200 波特率）驱动 DFRobot SEN0754 超声波液位监测传感器，支持实时值/处理值读取、液位高度换算与温度输出。

## Library Info

- **Name**: @aily-project/lib-sen0754
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `sen0754_init` | Statement | VAR(field_variable), SERIAL(dropdown), RX(field_number), TX(field_number) | `sen0754_init($liquidLevelSensor, Serial1, 16, 17)` | `#include "SEN0754.h" ↵ HardwareSerial liquidLevelSensorSerial(1); ↵ SEN0754 liquidLevelSensor(liquidLevelSensorSerial); ↵ setup: liquidLevelSensorSerial.begin(115200, SERIAL_8N1, 16, 17);` |
| `sen0754_set_install_height` | Statement | VAR(field_variable), HEIGHT(input_value Number) | `sen0754_set_install_height($liquidLevelSensor, math_number(2000))` | `liquidLevelSensor.setInstallHeight(2000);` |
| `sen0754_read_realtime` | Statement | VAR(field_variable) | `sen0754_read_realtime($liquidLevelSensor)` | `liquidLevelSensor.readRealtime();` |
| `sen0754_read_processed` | Statement | VAR(field_variable) | `sen0754_read_processed($liquidLevelSensor)` | `liquidLevelSensor.readProcessed();` |
| `sen0754_get_water_level` | Value (Number) | VAR(field_variable) | `sen0754_get_water_level($liquidLevelSensor)` | `liquidLevelSensor.getWaterLevel()` |
| `sen0754_get_distance` | Value (Number) | VAR(field_variable) | `sen0754_get_distance($liquidLevelSensor)` | `liquidLevelSensor.getDistance()` |
| `sen0754_get_temperature` | Value (Number) | VAR(field_variable) | `sen0754_get_temperature($liquidLevelSensor)` | `liquidLevelSensor.getTemperature()` |
| `sen0754_is_valid` | Value (Boolean) | VAR(field_variable) | `sen0754_is_valid($liquidLevelSensor)` | `liquidLevelSensor.isValid()` |

## Parameter Options

### sen0754_init.SERIAL

| Display | Actual Value |
| ------- | ------------ |
| Serial1 (UART1) | `Serial1` |
| Serial2 (UART2) | `Serial2` |

## ABS Examples

实时值读取，液位高度存入变量：

```abs
arduino_global()
    variable_define("level", int, math_number(0))

arduino_setup()
    sen0754_init($liquidLevelSensor, Serial1, 16, 17)
    sen0754_set_install_height($liquidLevelSensor, math_number(2000))

arduino_loop()
    sen0754_read_realtime($liquidLevelSensor)
    controls_if(sen0754_is_valid($liquidLevelSensor))
        variables_set($level, sen0754_get_water_level($liquidLevelSensor))
```

液面晃动场景改用处理值（响应 ≥2 秒，不要以高于 2 秒的频率调用）：

```abs
arduino_loop()
    sen0754_read_processed($liquidLevelSensor)
    variables_set($level, sen0754_get_distance($liquidLevelSensor))
```

## Notes

1. **变量**：`sen0754_init($liquidLevelSensor, ...)` 创建对象 `$liquidLevelSensor`（C++ 类型 `SEN0754`）；本库所有积木的 field_variable 槽位都传 `$liquidLevelSensor`。
2. 初始化会同时生成 `HardwareSerial <对象名>Serial(1或2);` 全局串口对象，并在 setup 中以 `begin(115200, SERIAL_8N1, RX, TX)` 启动；波特率固定 115200，不可更改。
3. 一个 UART 只能接一个传感器；最多支持 2 个传感器（分别选 Serial1/Serial2）。
4. 接线：RX引脚接传感器绿色 TX 线，TX引脚接传感器蓝色 RX 线；默认 16/17 来自官方 ESP32 示例，请按所用主板的可用引脚调整。
5. 读取积木内部最多阻塞约 1 秒（每 100ms 重发指令直到超时）；实时值响应约 100ms，处理值响应 ≥2 秒。
6. 液位高度 = 安装高度 − 空高；安装高度默认 2000 毫米，用 `sen0754_set_install_height` 修改。空高为 -3 毫米表示未检测到液体。
7. 温度为传感器自带温度补偿输出，精度 0.1℃。
8. 生成代码使用 ESP32 `HardwareSerial` 自定义引脚，仅适用于 ESP32 系列主板（如 UniHiker K10/ESP32-S3）；不支持 AVR 软件串口。
9. 量程/信号等级/降噪等级/算法模式等参数需通过 Modbus 写指令配置（见 DFRobot 协议手册 PDF），本库仅覆盖官方 wiki 公开的实时值与处理值两条读取指令。

# SparkFun RHT03 温湿度传感器

单总线 RHT03（DHT22）温湿度传感器 Blockly 库。

## Library Info
- **Name**: @aily-project/lib-sparkfun-rht03
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rht03_init` | Statement | VAR(field_input), PIN(field_number) | `rht03_init("rht", 2)` | `RHT03 rht; rht.begin(2);` |
| `rht03_update` | Value→Number | VAR(field_variable) | `rht03_update(variables_get($rht))` | `rht.update()` |
| `rht03_temp_c` | Value→Number | VAR(field_variable) | `rht03_temp_c(variables_get($rht))` | `rht.tempC()` |
| `rht03_temp_f` | Value→Number | VAR(field_variable) | `rht03_temp_f(variables_get($rht))` | `rht.tempF()` |
| `rht03_humidity` | Value→Number | VAR(field_variable) | `rht03_humidity(variables_get($rht))` | `rht.humidity()` |

## Usage Example

```
arduino_setup()
  rht03_init("rht", 2)

arduino_loop()
  variables_set($result, rht03_update(variables_get($rht)))
  serial_println(Serial, rht03_temp_c(variables_get($rht)))
  serial_println(Serial, rht03_humidity(variables_get($rht)))
  delay(1000)
```

Generated code:
```cpp
#include <SparkFun_RHT03.h>
RHT03 rht;
void setup() {
  rht.begin(2);
}
void loop() {
  int result = rht.update();
  Serial.println(rht.tempC());
  Serial.println(rht.humidity());
  delay(1000);
}
```

## Notes
- `rht03_update` 返回值：1 成功，负数为错误码
- 两次更新间隔至少 1000ms（RHT_READ_INTERVAL_MS）

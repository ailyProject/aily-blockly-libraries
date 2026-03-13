# SR04超声波距离传感器

HC-SR04超声波距离传感器的Aily Blockly库,支持2-400cm距离测量

## 库信息
- **名称**: @aily-project/lib-sr04
- **版本**: 1.0.0

## 块定义

| 块类型 | 连接类型 | 参数(args0顺序) | ABS格式 | 生成代码 |
|--------|----------|----------------|---------|----------|
| `sr04_setup` | Statement | VAR(field_input), TRIG_PIN(input_value), ECHO_PIN(input_value), MAX_DISTANCE(field_number) | `sr04_setup("sr04", io_pin_digi(2), io_pin_digi(3), 400)` | `UltraSonicDistanceSensor sr04(2, 3, 400);` |
| `sr04_measure_distance` | Value | VAR(field_variable) | `sr04_measure_distance($sr04)` | `sr04.measureDistanceCm()` |
| `sr04_measure_distance_with_temp` | Value | VAR(field_variable), TEMPERATURE(input_value) | `sr04_measure_distance_with_temp($sr04, math_number(25))` | `sr04.measureDistanceCm(25)` |
| `sr04_measure_quick` | Value | TRIG_PIN(input_value), ECHO_PIN(input_value) | `sr04_measure_quick(io_pin_digi(2), io_pin_digi(3))` | `sr04_quick_measure(2, 3)` |

## 参数选项

| 参数 | 值 | 说明 |
|------|-----|------|
| TRIG_PIN | 数字引脚 | 使用`io_pin_digi(n)`选择触发引脚 |
| ECHO_PIN | 数字引脚 | 使用`io_pin_digi(n)`选择回波引脚 |
| MAX_DISTANCE | 2-1000 | 最大测量距离(cm),默认400 |
| TEMPERATURE | 数字 | 温度值(℃),默认20 |

## ABS示例

### 基本使用
```
arduino_setup()
    sr04_setup("sensor", io_pin_digi(2), io_pin_digi(3), 400)
    serial_begin(Serial, 9600)

arduino_loop()
    variables_set($distance, sr04_measure_distance(variables_get($sensor)))
    serial_print(Serial, text("Distance: "))
    serial_println(Serial, variables_get($distance))
    time_delay(math_number(500))
```

### 温度补偿测量
```
arduino_setup()
    sr04_setup("sensor", io_pin_digi(2), io_pin_digi(3), 400)
    serial_begin(Serial, 9600)

arduino_loop()
    variables_set($distance, sr04_measure_distance_with_temp(variables_get($sensor), math_number(25)))
    serial_println(Serial, variables_get($distance))
    time_delay(math_number(500))
```

### 快速测量(无需创建对象)
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    variables_set($dist, sr04_measure_quick(io_pin_digi(2), io_pin_digi(3)))
    serial_println(Serial, variables_get($dist))
    time_delay(math_number(500))
```

## 注意事项

1. **变量创建**: `sr04_setup("varName", ...)`创建变量`$varName`,后续使用`variables_get($varName)`引用
2. **引脚选择**: 使用IO库的`io_pin_digi(n)`块选择数字引脚
3. **测量范围**: 有效测量范围2-400cm,超出范围返回-1
4. **温度补偿**: 使用温度参数可提高测量精度,默认温度20°C
5. **快速模式**: `sr04_measure_quick`适合简单场景,无需创建传感器对象

# Grove HCHO传感器

基于WSP2110半导体VOC气体传感器的甲醛检测库，可检测甲醛、苯、甲苯等挥发性有机化合物。

## 库信息
- **名称**: @aily-project/lib-grove-hcho-sensor
- **版本**: 1.0.0

## 积木块定义

| 积木块类型 | 连接类型 | 参数(args0顺序) | ABS格式 | 生成代码 |
|------------|----------|-----------------|---------|----------|
| `grove_hcho_init` | Statement | VAR(field_input), PIN(dropdown), R0(field_number) | `grove_hcho_init("name", A0, 34.28)` | `GroveHCHO name(A0, 34.28);` |
| `grove_hcho_read_raw` | Value | VAR(field_variable) | `grove_hcho_read_raw($name)` | `name.readRaw()` |
| `grove_hcho_read_rs` | Value | VAR(field_variable) | `grove_hcho_read_rs($name)` | `name.getRs()` |
| `grove_hcho_read_ppm` | Value | VAR(field_variable) | `grove_hcho_read_ppm($name)` | `name.getPPM()` |
| `grove_hcho_calibrate_r0` | Value | VAR(field_variable) | `grove_hcho_calibrate_r0($name)` | `name.calibrateR0()` |

## 参数选项

| 参数 | 可选值 | 说明 |
|------|--------|------|
| PIN | A0, A1, A2... | 模拟输入引脚(从开发板配置获取) |
| R0 | 数值(默认34.28) | 传感器校准电阻值，需在清洁空气中校准获得 |

## ABS示例

### 校准程序(获取R0值)
```
arduino_setup()
    grove_hcho_init("hcho", A0, 34.28)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_print(Serial, text("R0 = "))
    serial_println(Serial, grove_hcho_calibrate_r0(variables_get($hcho)))
    time_delay(math_number(500))
```

### 读取HCHO浓度
```
arduino_setup()
    grove_hcho_init("hcho", A0, 34.28)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_print(Serial, text("HCHO ppm = "))
    serial_println(Serial, grove_hcho_read_ppm(variables_get($hcho)))
    time_delay(math_number(1000))
```

## 注意事项

1. **初始化**: 必须在`arduino_setup()`中调用`grove_hcho_init`初始化传感器
2. **R0校准**: R0值需要在清洁空气中运行校准程序获得，典型值范围10-100
3. **变量引用**: 在值积木块中使用`variables_get($varName)`引用已创建的传感器变量
4. **检测范围**: 传感器有效检测范围为1-50ppm
5. **精度说明**: 传感器值仅反映气体浓度的近似趋势，不代表精确浓度值
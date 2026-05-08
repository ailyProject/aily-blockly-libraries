# SparkFun Qwiic OpenLog 数据记录器

SparkFun Qwiic OpenLog 的 Blockly 封装库，通过 I2C 将数据写入 microSD 卡。

## Library Info
- **Name**: @aily-project/lib-sparkfun-qwiic-openlog
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `qwiic_openlog_init` | Statement | VAR(field_input) | `qwiic_openlog_init("logger")` | `OpenLog logger; logger.begin();` |
| `qwiic_openlog_append` | Statement | VAR(field_variable), FILENAME(input_value) | `qwiic_openlog_append(variables_get($logger), text("log.csv"))` | `logger.append("log.csv");` |
| `qwiic_openlog_print` | Statement | VAR(field_variable), DATA(input_value) | `qwiic_openlog_print(variables_get($logger), text("hello"))` | `logger.print("hello");` |
| `qwiic_openlog_println` | Statement | VAR(field_variable), DATA(input_value) | `qwiic_openlog_println(variables_get($logger), text("row"))` | `logger.println("row");` |
| `qwiic_openlog_sync` | Statement | VAR(field_variable) | `qwiic_openlog_sync(variables_get($logger))` | `logger.syncFile();` |
| `qwiic_openlog_mkdir` | Statement | VAR(field_variable), DIRNAME(input_value) | `qwiic_openlog_mkdir(variables_get($logger), text("logs"))` | `logger.makeDirectory("logs");` |
| `qwiic_openlog_cd` | Statement | VAR(field_variable), DIRNAME(input_value) | `qwiic_openlog_cd(variables_get($logger), text("/"))` | `logger.changeDirectory("/");` |

## Notes

1. 必须先调用 `qwiic_openlog_append` 打开文件，才能使用 print/println 写入
2. 定期调用 `qwiic_openlog_sync` 确保数据写入 SD 卡（防止掉电丢数据）
3. DATA 参数可传入数字或字符串

## ABS Examples

```
arduino_setup()
    qwiic_openlog_init("logger")
    qwiic_openlog_append(variables_get($logger), text("sensor_log.csv"))
    qwiic_openlog_println(variables_get($logger), text("time,temp"))
    serial_begin(Serial, 115200)

arduino_loop()
    qwiic_openlog_print(variables_get($logger), variables_get($millis))
    qwiic_openlog_print(variables_get($logger), text(","))
    qwiic_openlog_println(variables_get($logger), variables_get($temp))
    qwiic_openlog_sync(variables_get($logger))
    time_delay(math_number(1000))
```

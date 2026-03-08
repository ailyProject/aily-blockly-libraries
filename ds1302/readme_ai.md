# DS1302 RTC时钟库

DS1302实时时钟模块库，提供时间读取、设置和RAM操作功能

## 库信息
- **名称**: @aily-project/lib-ds1302
- **版本**: 1.0.0

## 块定义

| 块类型 | 连接类型 | 参数 (args0顺序) | ABS格式 | 生成的代码 |
|--------|----------|------------------|---------|-----------|
| `ds1302_setup` | Statement | VAR(field_input), CE_PIN(input_value), IO_PIN(input_value), SCLK_PIN(input_value) | `ds1302_setup("rtc", math_number(5), math_number(6), math_number(7))` | `DS1302 rtc(5, 6, 7);` |
| `ds1302_set_write_protect` | Statement | VAR(field_variable), ENABLE(field_dropdown) | `ds1302_set_write_protect(variables_get($rtc), TRUE)` | `rtc.writeProtect(true);` |
| `ds1302_set_halt` | Statement | VAR(field_variable), HALT(field_dropdown) | `ds1302_set_halt(variables_get($rtc), FALSE)` | `rtc.halt(false);` |
| `ds1302_get_time` | Value | VAR(field_variable) | `ds1302_get_time(variables_get($rtc))` | `rtc.time()` |
| `ds1302_set_time` | Statement | VAR(field_variable), YEAR(input_value), MONTH(input_value), DAY(input_value), HOUR(input_value), MINUTE(input_value), SECOND(input_value), WEEKDAY(input_value) | `ds1302_set_time(variables_get($rtc), math_number(2024), math_number(1), math_number(1), math_number(12), math_number(0), math_number(0), math_number(2))` | `Time time_rtc(2024, 1, 1, 12, 0, 0, (Time::Day)2); rtc.time(time_rtc);` |
| `ds1302_get_year` | Value | TIME(input_value) | `ds1302_get_year(ds1302_get_time(variables_get($rtc)))` | `time.yr` |
| `ds1302_get_month` | Value | TIME(input_value) | `ds1302_get_month(ds1302_get_time(variables_get($rtc)))` | `time.mon` |
| `ds1302_get_day` | Value | TIME(input_value) | `ds1302_get_day(ds1302_get_time(variables_get($rtc)))` | `time.date` |
| `ds1302_get_hour` | Value | TIME(input_value) | `ds1302_get_hour(ds1302_get_time(variables_get($rtc)))` | `time.hr` |
| `ds1302_get_minute` | Value | TIME(input_value) | `ds1302_get_minute(ds1302_get_time(variables_get($rtc)))` | `time.min` |
| `ds1302_get_second` | Value | TIME(input_value) | `ds1302_get_second(ds1302_get_time(variables_get($rtc)))` | `time.sec` |
| `ds1302_get_weekday` | Value | TIME(input_value) | `ds1302_get_weekday(ds1302_get_time(variables_get($rtc)))` | `time.day` |
| `ds1302_write_ram` | Statement | VAR(field_variable), ADDRESS(input_value), VALUE(input_value) | `ds1302_write_ram(variables_get($rtc), math_number(0), math_number(100))` | `rtc.writeRam(0, 100);` |
| `ds1302_read_ram` | Value | VAR(field_variable), ADDRESS(input_value) | `ds1302_read_ram(variables_get($rtc), math_number(0))` | `rtc.readRam(0)` |

## 参数选项

| 参数 | 可选值 | 说明 |
|------|--------|------|
| ENABLE | TRUE, FALSE | TRUE=启用写保护, FALSE=禁用写保护 |
| HALT | TRUE, FALSE | TRUE=停止时钟, FALSE=运行时钟 |
| WEEKDAY | 1-7 | 1=星期日, 2=星期一, 3=星期二, 4=星期三, 5=星期四, 6=星期五, 7=星期六 |
| ADDRESS | 0-30 | RAM地址范围，共31字节 |

## ABS示例

### 基本使用 - 读取并显示时间

```abs
arduino_setup()
    ds1302_setup("rtc", math_number(5), math_number(6), math_number(7))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_print(Serial, text("Year: "))
    serial_println(Serial, ds1302_get_year(ds1302_get_time(variables_get($rtc))))
    serial_print(Serial, text("Month: "))
    serial_println(Serial, ds1302_get_month(ds1302_get_time(variables_get($rtc))))
    serial_print(Serial, text("Day: "))
    serial_println(Serial, ds1302_get_day(ds1302_get_time(variables_get($rtc))))
    serial_print(Serial, text("Hour: "))
    serial_println(Serial, ds1302_get_hour(ds1302_get_time(variables_get($rtc))))
    serial_print(Serial, text("Minute: "))
    serial_println(Serial, ds1302_get_minute(ds1302_get_time(variables_get($rtc))))
    serial_print(Serial, text("Second: "))
    serial_println(Serial, ds1302_get_second(ds1302_get_time(variables_get($rtc))))
    time_delay(math_number(1000))
```

### 设置时间

```abs
arduino_setup()
    ds1302_setup("rtc", math_number(5), math_number(6), math_number(7))
    ds1302_set_write_protect(variables_get($rtc), FALSE)
    ds1302_set_halt(variables_get($rtc), FALSE)
    ds1302_set_time(variables_get($rtc), math_number(2024), math_number(3), math_number(7), math_number(12), math_number(30), math_number(0), math_number(5))
    serial_begin(Serial, 9600)
    serial_println(Serial, text("Time set!"))

arduino_loop()
    serial_println(Serial, ds1302_get_hour(ds1302_get_time(variables_get($rtc))))
    time_delay(math_number(1000))
```

### RAM读写操作

```abs
arduino_setup()
    ds1302_setup("rtc", math_number(5), math_number(6), math_number(7))
    serial_begin(Serial, 9600)
    ds1302_write_ram(variables_get($rtc), math_number(0), math_number(123))

arduino_loop()
    serial_println(Serial, ds1302_read_ram(variables_get($rtc), math_number(0)))
    time_delay(math_number(1000))
```

## 注意事项

1. **初始化顺序**: 使用`ds1302_setup`创建变量`$rtc`，后续块通过`variables_get($rtc)`引用
2. **设置时间**: 设置时间前需先禁用写保护(`ds1302_set_write_protect(..., FALSE)`)并确保时钟运行(`ds1302_set_halt(..., FALSE)`)
3. **星期格式**: 星期值为1-7，1=星期日，7=星期六
4. **RAM地址**: RAM地址范围为0-30，共31字节
5. **时间对象**: `ds1302_get_time`返回Time对象，需用组件块提取年/月/日等信息

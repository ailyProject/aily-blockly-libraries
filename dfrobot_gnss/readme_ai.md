# GNSS北斗定位模块

DFRobot Gravity GNSS北斗定位模块，支持GPS/北斗/GLONASS多卫星系统定位。

## 库信息
- **名称**: @aily-project/lib-dfrobot-gnss
- **版本**: 0.0.1

## 块定义

| 块类型 | 连接 | 参数（args0顺序） | ABS格式 | 生成代码 |
|--------|------|-----------------|---------|----------|
| `gnss_i2c_init` | 语句块 | 无 | `gnss_i2c_init()` | I2C初始化代码 |
| `gnss_hs_init` | 语句块 | HS(dropdown), RX(dropdown), TX(dropdown) | `gnss_hs_init(Serial1, 0, 1)` | 硬串口初始化代码 |
| `gnss_ss_init` | 语句块 | SS(dropdown), RX(dropdown), TX(dropdown) | `gnss_ss_init(SoftwareSerial, 0, 1)` | 软串口初始化代码 |
| `gnss_read_data` | 语句块 | 无 | `gnss_read_data()` | 读取数据代码 |
| `gnss_get_utc_date` | 值块 | DATE(dropdown) | `gnss_get_utc_date(YMD)` | 日期字符串 |
| `gnss_get_utc_time` | 值块 | TIME(dropdown) | `gnss_get_utc_time(HMS)` | 时间字符串 |
| `gnss_get_location` | 值块 | DATA(dropdown) | `gnss_get_location(LAT)` | 位置数据字符串 |

## 参数选项

| 参数 | 可选值 | 说明 |
|------|--------|------|
| HS | Serial1, Serial2 | 硬串口选择 |
| SS | SoftwareSerial | 软串口 |
| DATE | YMD, YEAR, MONTH, DAY | UTC日期格式 |
| TIME | HMS, HOUR, MINUTE, SECOND | UTC时间格式 |
| DATA | LAT, LAT_DIR, LON, LON_DIR, ALT, SAT_NUM, SOG, COG | 定位数据类型 |

## ABS示例

### 基本用法
```
arduino_setup()
    gnss_i2c_init()
    serial_begin(Serial, 115200)

arduino_loop()
    gnss_read_data()
    serial_println(Serial, gnss_get_location(LAT))
    serial_println(Serial, gnss_get_location(LON))
    time_delay(math_number(1000))
```

### 硬串口模式
```
arduino_setup()
    gnss_hs_init(Serial1, 0, 1)
    serial_begin(Serial, 115200)

arduino_loop()
    gnss_read_data()
    serial_println(Serial, gnss_get_utc_date(YMD))
    serial_println(Serial, gnss_get_utc_time(HMS))
    time_delay(math_number(1000))
```

## 注意事项

1. **初始化**: 在 `arduino_setup()` 内调用初始化块
2. **数据读取**: 必须先调用 `gnss_read_data()` 再获取数据
3. **串口模式**: I2C模式地址固定为0x20，串口波特率固定为9600
4. **卫星系统**: 默认启用GPS+北斗+GLONASS

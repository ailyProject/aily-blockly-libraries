# DFRobot空气质量传感器库

DFRobot SEN0460空气质量传感器库，通过I2C接口使用Gravity接口，可测量PM2.5/PM1.0/PM10颗粒物浓度及数量。

## 库信息

- **名称**: @aily-project/lib-dfrobot-airquality
- **版本**: 0.1.0

## 块定义

| 块类型 | 连接 | 参数（args0顺序） | ABS格式 | 生成代码 |
|--------|------|-----------------|---------|----------|
| `dfrobot_airquality_begin` | 语句块 | 无参数 | `dfrobot_airquality_begin()` | `while(!particle.begin()){delay(500);}` |
| `dfrobot_airquality_read_concentration` | 值块 | ENVIRONMENT(dropdown), PARTICLE(dropdown) | `dfrobot_airquality_read_concentration(STANDARD, PM2_5)` | `particle.gainParticleConcentration_ugm3(PARTICLE_PM2_5_STANDARD)` |
| `dfrobot_airquality_read_count` | 值块 | DIAMETER(dropdown) | `dfrobot_airquality_read_count(0_3_UM)` | `particle.gainParticleNum_Every0_1L(0_3_UM_EVERY0_1L_AIR)` |
| `dfrobot_airquality_get_version` | 值块 | 无参数 | `dfrobot_airquality_get_version()` | `particle.gainVersion()` |

## 参数选项

| 参数 | 可选值 | 说明 |
|------|--------|------|
| ENVIRONMENT | STANDARD, ATMOSPHERE | 环境类型：标准颗粒物/大气 |
| PARTICLE | PM2_5, PM1_0, PM10 | 颗粒物类型：PM2.5/PM1.0/PM10 |
| DIAMETER | 0_3_UM, 0_5_UM, 1_0_UM, 2_5_UM, 5_0_UM, 10_UM | 颗粒物粒径：0.3um/0.5um/1.0um/2.5um/5.0um/10um |

## ABS示例

### 基本用法

```
arduino_setup()
    dfrobot_airquality_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, text("PM2.5浓度:"))
    serial_println(Serial, dfrobot_airquality_read_concentration(STANDARD, PM2_5))
    serial_println(Serial, text("0.3um颗粒物数量:"))
    serial_println(Serial, dfrobot_airquality_read_count(0_3_UM))
    time_delay(math_number(1000))
```

### 读取多种颗粒物数据

```
arduino_setup()
    dfrobot_airquality_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, text("=== 空气质量监测 ==="))
    serial_println(Serial, text("PM1.0:"))
    serial_println(Serial, dfrobot_airquality_read_concentration(STANDARD, PM1_0))
    serial_println(Serial, text("PM2.5:"))
    serial_println(Serial, dfrobot_airquality_read_concentration(STANDARD, PM2_5))
    serial_println(Serial, text("PM10:"))
    serial_println(Serial, dfrobot_airquality_read_concentration(STANDARD, PM10))
    time_delay(math_number(2000))
```

## 注意事项

1. **I2C地址**: 该传感器使用固定的I2C地址0x19，无需配置
2. **初始化**: `dfrobot_airquality_begin()`块会阻塞直到初始化成功，建议放在`arduino_setup()`中
3. **环境类型**: STANDARD用于标准颗粒物浓度，ATMOSPHERE用于大气环境浓度
4. **颗粒物类型**: 支持PM2.5、PM1.0和PM10三种颗粒物类型
5. **粒径范围**: 支持0.3um、0.5um、1.0um、2.5um、5.0um和10um六种粒径

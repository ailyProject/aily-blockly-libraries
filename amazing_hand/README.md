# PCA9685 舵机驱动库

I2C 16通道PWM舵机驱动器，支持同时控制16个舵机。提供串口命令解析功能。

## 库信息

- **库名称**: amazing_hand
- **核心功能**: PCA9685舵机驱动、串口命令解析
- **依赖库**: Adafruit_PWMServoDriver, Wire
- **适用板卡**: ESP32, Arduino
- **I2C地址**: 0x40

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| pca9685_create | 语句块 | VAR(field_input) | "VAR":"pwm" | Adafruit_PWMServoDriver pwm; |
| pca9685_begin_with_pins | 语句块 | VAR(field_variable), ADDRESS(input), SDA(dropdown), SCL(dropdown) | "VAR":"pwm","ADDRESS":40 | Wire.begin(SDA,SCL);pwm.begin(); |
| pca9685_set_freq | 语句块 | VAR(field_variable), FREQ(input) | "VAR":"pwm","FREQ":60 | pwm.setPWMFreq(60); |
| pca9685_set_servo_angle | 语句块 | VAR(field_variable), CHANNEL(input), ANGLE(input) | "VAR":"pwm","CHANNEL":0,"ANGLE":90 | pwm.setPWM(0,0,map(90,0,180,100,700)); |
| pca9685_set_pwm | 语句块 | VAR(field_variable), CHANNEL(input), ON(input), OFF(input) | "VAR":"pwm","CHANNEL":0,"ON":0,"OFF":300 | pwm.setPWM(0,0,300); |
| pca9685_config_servo | 语句块 | VAR(field_variable), MIN(input), MAX(input) | "VAR":"pwm","MIN":100,"MAX":700 | // 配置范围100-700 |
| pca9685_set_all_servos | 语句块 | VAR(field_variable), ANGLE(input) | "VAR":"pwm","ANGLE":90 | for(i=0;i<16;i++)pwm.setPWM(i,0,map(90)); |
| pca9685_sleep | 语句块 | VAR(field_variable) | "VAR":"pwm" | pwm.sleep(); |
| pca9685_wakeup | 语句块 | VAR(field_variable) | "VAR":"pwm" | pwm.wakeup(); |
| pca9685_angle_to_pwm | 值块 | VAR(field_variable), ANGLE(input) | "VAR":"pwm","ANGLE":90 | map(90,0,180,100,700) |
| serial_command_init | 语句块 | SERIAL(dropdown), BAUD(dropdown) | "SERIAL":"Serial","BAUD":"115200" | Serial.begin(115200); |
| serial_command_add | 语句块 | COMMAND(input), CODE(statement) | "COMMAND":"F" | void _cmdHandle_0(){...} |
| serial_command_read | 语句块 | 无 | 无 | _processSerialCommand(); |
| serial_command_available | 值块 | 无 | 无 | Serial.available() |
| serial_command_get | 值块 | 无 | 无 | _cmdBuffer |

## 字段类型映射

| 字段名 | 字段类型 | 说明 |
|--------|----------|------|
| VAR (pca9685_create) | field_input | 初始化：输入新变量名 |
| VAR (其他块) | field_variable | 引用：选择已创建变量 |
| ADDRESS | input_value | I2C地址(自动转0x格式) |
| SDA_PIN/SCL_PIN | field_dropdown | 引脚选择 |
| CHANNEL | input_value | 通道号0-15 |
| ANGLE | input_value | 角度0-180 |
| FREQ | input_value | 频率40-1600Hz |
| SERIAL | field_dropdown | 串口选择 |
| BAUD | field_dropdown | 波特率 |

## 连接规则

**PCA9685模块**：pca9685_create → pca9685_begin_with_pins → pca9685_set_freq → 其他操作块

**串口解析器**（全局对象）：serial_command_init → 多个serial_command_add → loop中调用serial_command_read

**变量约束**：field_input创建变量自动注册；field_variable只能引用已注册的Adafruit_PWMServoDriver类型变量

**参数范围**：通道0-15，角度0-180，PWM 0-4095，频率40-1600Hz（舵机推荐60Hz）

## 使用示例

### 基础控制
```
创建 PCA9685 舵机驱动器 变量 pwm
初始化 pwm I2C地址0X 40 SDA引脚 21 SCL引脚 22
设置 pwm PWM频率 60 Hz
设置 pwm 通道 0 舵机角度 90 度
```

### 串口控制
```
初始化串口命令解析器 串口 Serial 波特率 115200
添加命令 命令字符串 "F" 执行代码
  设置 pwm 通道 0 舵机角度 0 度

重复执行
  检查并处理串口命令
```

## 重要规则

**变量管理**：初始化块用field_input输入新变量名；方法调用块用field_variable引用变量；串口解析器用全局单例无需变量

**代码生成**：自动添加库依赖、变量声明、I2C初始化；PWM计算用map()函数；命令处理生成完整解析函数

**硬件配置**：VCC供电3.3V/5V，V+外部5-6V舵机电源必须共地；ESP32默认SDA=21/SCL=22；支持多地址0x40-0x7F

**板卡适配**：serialPins映射自动选择串口引脚；SDA/SCL通过${board.digitalPins}动态生成

**故障排查**：舵机不动检查V+电源、I2C地址、频率；舵机抖动调整频率或PWM范围；编译错误确认安装Adafruit PWM Servo Driver库v2.4.0+

# ESP32 Summer Board

ESP32智能小车综合控制库，集成编码电机、舵机、灯带、传感器、PS3手柄等功能。

## 库信息
- **库名**: @aily-project/lib-ESP32_Summer_Board
- **版本**: 1.0.0
- **兼容**: esp32:esp32 (ESP32系列)

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `car_is_key_pressed` | 值块 | KEY(dropdown) | `"KEY":"0"` | `readKeyEvent()==0` |
| `car_ultrasonic_distance` | 值块 | TRIG/ECHO(dropdown) | `"TRIG":"2","ECHO":"3"` | `urm10.getDistanceCM()` |
| `car_line_init` | 语句块 | 无 | 无 | `sensor.begin()` |
| `car_line_is_state` | 值块 | STATE(dropdown) | `"STATE":"24"` | `sensor.calculateDigitalState()==24` |
| `car_line_offset` | 值块 | 无 | 无 | `calculateLineOffset()` |
| `car_line_sensor_value` | 值块 | SENSOR(dropdown) | `"SENSOR":"0"` | `sensor.getSensorCurrent()` |
| `car_servo_init` | 语句块 | 无 | 无 | `Wire.begin()` |
| `car_servo_angle` | 语句块 | PIN(dropdown), ANGLE(input) | `"PIN":"0"`, `"ANGLE":{block}` | `sendStm32Command()` |
| `car_motor_control_single` | 语句块 | MOTOR_ID(dropdown), DIRECTION(dropdown), SPEED(input) | `"MOTOR_ID":"0"`, `"DIRECTION":"1"`, `"SPEED":{block}` | `sendStm32Command()` |
| `car_stepper_control` | 语句块 | STEPPER_NUM(dropdown), DIRECTION(dropdown), DEGREES(input) | `"STEPPER_NUM":"0"`, `"DIRECTION":"0"`, `"DEGREES":{block}` | `sendStm32Command()` |
| `car_encoder_config` | 语句块 | PPR(number), REDUCTION(number) | `"PPR":3`, `"REDUCTION":48` | 影响代码生成 |
| `car_encoder_set_pid` | 语句块 | MOTOR_ID(dropdown), P/I/D(input) | `"MOTOR_ID":"0"`, `"P/I/D":{block}` | `SetSpeedPid()` |
| `car_encoder_run_speed` | 语句块 | MOTOR_ID(dropdown), SPEED(input) | `"MOTOR_ID":"0"`, `"SPEED":{block}` | `RunSpeed()` |
| `car_ps3_init` | 语句块 | MAC_ADDR(input) | `"MAC_ADDR":{block}` | `Ps3.begin()` |
| `car_ps3_button_pressed` | 值块 | BUTTON(dropdown) | `"BUTTON":"cross"` | `Ps3.data.button.cross` |
| `ai_assistant_config` | 语句块 | SERIAL_OPTION(动态) | 根据板卡类型 | 串口初始化 |
| `serial_command_handler` | 值块 | ACTION(dropdown) | `"ACTION":"MOVE_FORWARD"` | `receivedCommand.indexOf()!=-1` |
| `jy61p_get_angle` | 值块 | ANGLE_TYPE(dropdown) | `"ANGLE_TYPE":"YAW"` | 读取姿态角 |
| `ws2812_init` | 语句块 | PIN(dropdown), COUNT/BRIGHTNESS(input) | `"PIN":"13"`, `"COUNT/BRIGHTNESS":{block}` | `strip.begin()` |
| `ws2812_set_single_color` | 语句块 | INDEX/RED/GREEN/BLUE(input) | `"INDEX/RED/GREEN/BLUE":{block}` | `strip.setPixelColor()` |
| `ws2812_rainbow` | 语句块 | CYCLES/WAIT(input) | `"CYCLES/WAIT":{block}` | `rainbow()` |
| `sentry2_begin_i2c` | 语句块 | SDA_PIN/SCL_PIN/ADDR(dropdown) | `"SDA_PIN":"21"`, `"SCL_PIN":"22"`, `"ADDR":"0x60"` | `sentry.begin()` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"CUSTOM_CMD":"computer"` |
| field_dropdown | 字符串 | `"KEY":"0"` |
| field_dropdown(动态) | 字符串 | `"PIN":"13"` (从board.json获取) |
| field_number | 数值 | `"PPR":3` |
| input_value | 块连接 | `"inputs":{"ANGLE":{"block":{...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **Hat块**: arduino_setup/loop等，通过`inputs`连接内部语句

### 动态选项处理
当遇到`"options":"${board.xxx}"`格式时：
1. 从board.json获取对应的选项数组
2. 使用数组中具体选项值，如`"PIN":"13"`

### AI-Assistant板卡识别
- ESP32: 支持Serial0/Serial1/Serial2，UART2可配置引脚
- Mega2560: 支持Serial/Serial1/Serial2/Serial3
- Arduino UNO: 支持硬件串口/软件串口

## 使用示例

### 编码电机速度控制
```json
{
  "type":"car_encoder_run_speed",
  "id":"block_id",
  "fields":{"MOTOR_ID":"0"},
  "inputs":{
    "SPEED":{"block":{"type":"math_number","fields":{"NUM":100}}}
  }
}
```

### WS2812彩虹效果
```json
{
  "type":"ws2812_rainbow",
  "id":"block_id",
  "inputs":{
    "CYCLES":{"block":{"type":"math_number","fields":{"NUM":3}}},
    "WAIT":{"block":{"type":"math_number","fields":{"NUM":10}}}
  }
}
```

## 重要规则

1. **必须遵守**: 所有块ID必须唯一
2. **初始化顺序**: 
   - 编码电机：先`car_encoder_config`再其他块
   - 巡线：先`car_line_init`再读取数据
   - 舵机：先`car_servo_init`再控制角度
3. **连接限制**: 值块不能有`next`字段
4. **I2C地址**: 
   - STM32多功能板: 0x10
   - 巡线传感器: 0x27 (固定SDA=21, SCL=22)
   - Sentry2: 0x60-0x63
5. **引脚冲突**: WS2812默认GPIO13，如不工作可尝试GPIO16/25

## 支持的硬件

- **编码电机**: MC310P20_V74_R13 (PPR=3, 减速比=48)
- **传感器**: JY61P六轴、8路巡线、超声波
- **控制器**: PS3手柄蓝牙、AI语音助手
- **执行器**: 6路舵机、4路TT马达、2路步进电机
- **显示**: WS2812灯带(23种效果)

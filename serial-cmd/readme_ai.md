# SerialCmd 串口指令解析

非阻塞串口指令解析库，支持前缀识别和参数提取

## Library Info
- **Name**: @aily-project/lib-serial-cmd
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `serial_cmd_init` | Statement | PORT(dropdown), SPEED(dropdown) | `serial_cmd_init(Serial, 115200)` | `Serial.begin(115200); SerialCmd.begin(Serial);` |
| `serial_cmd_on_received` | Hat | (none) | `serial_cmd_on_received() @HANDLER: ...` | callback registration |
| `serial_cmd_get_cmd` | Value | (none) | `serial_cmd_get_cmd()` | `SerialCmd.getCmd()` |
| `serial_cmd_get_param_int` | Value | INDEX(input_value) | `serial_cmd_get_param_int(math_number(0))` | `SerialCmd.getParamInt(n)` |
| `serial_cmd_get_cmd_type` | Value | (none) | `serial_cmd_get_cmd_type()` | `SerialCmd.getCmdType()` |
| `serial_cmd_reply_ok` | Statement | MSG(input_value) | `serial_cmd_reply_ok(text("done"))` | `Serial.print("OK "); Serial.println(msg);` |
| `serial_cmd_reply_err` | Statement | MSG(input_value) | `serial_cmd_reply_err(text("error"))` | `Serial.print("ERR "); Serial.println(msg);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PORT | ${board.serialPort} | 串口端口选择 |
| SPEED | ${board.serialSpeed} | 串口波特率 |

## ABS Examples

### Basic Usage - 多指令控制器
```
arduino_setup()
    serial_cmd_init(Serial, 115200)
    stepper_ctrl_init("stepper1", PA8, PA9, math_number(1000), PA0, PA1)

serial_cmd_on_received()
    @HANDLER:
        controls_if()
            @IF0: logic_compare(serial_cmd_get_cmd_type(), EQ, text("STEP"))
            @DO0:
                variables_set($steps, serial_cmd_get_param_int(math_number(0)))
                variables_set($speed, serial_cmd_get_param_int(math_number(1)))
                variables_set($dir, serial_cmd_get_param_int(math_number(2)))
                stepper_ctrl_set_speed($stepper1, $speed)
                controls_if()
                    @IF0: logic_compare($dir, EQ, math_number(1))
                    @DO0:
                        stepper_ctrl_start($stepper1, $steps, FORWARD)
                    @IF1: logic_compare($dir, EQ, math_number(0))
                    @DO1:
                        stepper_ctrl_start($stepper1, $steps, REVERSE)
                serial_cmd_reply_ok(text("OK"))
            @IF1: logic_compare(serial_cmd_get_cmd_type(), EQ, text("DWR"))
            @DO1:
                serial_cmd_reply_ok(text("OK"))
            @ELSE:
                serial_cmd_reply_err(text("unknown cmd"))

arduino_loop()
    stepper_ctrl_tick($stepper1)
```

### 串口指令格式说明

| 指令类型 | 格式 | 示例 | 说明 |
|----------|------|------|------|
| STEP | `STEP 步数,速度,方向` | `STEP 800,500,1` | 步进电机控制 |
| DWR | `DWR 引脚,值` | `DWR 13,1` | 数字输出 |
| PWM | `PWM 引脚,占空比` | `PWM 6,128` | PWM输出 |
| DRD | `DRD 引脚` | `DRD 13` | 数字读取 |
| ARD | `ARD 引脚` | `ARD PA0` | 模拟读取 |

## Notes

1. **初始化**: `serial_cmd_init` 必须在 `arduino_setup()` 中调用，可指定串口端口和波特率
2. **非阻塞**: 串口读取完全非阻塞，不影响其他实时任务
3. **事件驱动**: `serial_cmd_on_received` 是事件块，收到完整指令时自动触发
4. **指令格式**: 指令以换行符`\n`结尾，参数用逗号分隔
5. **参数索引**: `serial_cmd_get_param_int` 使用0-based索引

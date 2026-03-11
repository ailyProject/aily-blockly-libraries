# Modbus RTU Slave

Blockly library for building Modbus RTU slave devices over RS-485 serial communication.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-modbus-rtu-slave |
| Version | 0.0.1 |
| Author | ericoding |
| Source | https://github.com/CMB27/ModbusRTUSlave |
| License | - |

## Supported Boards

Arduino UNO, Mega, Nano, ESP32, ESP8266, UNO R4, RP2040 and other boards with serial port support (3.3V / 5V).

## Description

This library wraps the ModbusRTUSlave Arduino library into Blockly blocks for building Modbus RTU slave devices. It supports RS-485 DE/RE pin control, configuring coil/discrete input/holding register/input register arrays, response delay settings, and polling for master requests.

## Quick Start

1. Create a Modbus slave instance with serial port and DE/RE pins in `setup`
2. Configure data arrays (coils, discrete inputs, holding/input registers) in `setup`
3. Call `poll` in `loop` to handle master read/write requests
  "inputs": {
    "BAUD": {
      "shadow": {
        "type": "math_number",
        "fields": {"NUM": 38400}
      }
    }
  },
  "next": {
    "type": "modbus_rtu_slave_poll",
    "fields": {"VAR": {"id": "modbus"}}
  }
}
```

## 重要规则
1. `modbus_rtu_slave_create` 必须在任何配置块之前调用，以便登记变量类型
2. `modbus_rtu_slave_begin` 自动插入串口 `begin`，无需手写但需确保选择正确端口
3. 四类数据数组需要先配置再读写；长度字段会直接用于C数组大小，必须是常量
4. `modbus_rtu_slave_poll` 应在 `loop` 中高频调用，可结合`DO`语句处理成功事件
5. 所有数组操作都基于`uint16_t`或`bool`，请勿混用类型以免出现编译错误

## 支持的关键参数
- 串口端口：`${board.serialPort}` 中的全部HardwareSerial（自动注入）
- 串口格式：`SERIAL_8N1/8N2/8E1/8E2/8O1/8O2`
- 数据区长度：1~512（可根据主站映射表调整）
- RS-485 使能：DE/RE输入默认`-1`，填数字引脚即可控制半双工芯片

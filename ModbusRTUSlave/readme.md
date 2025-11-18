# ModbusRTUSlave

基于官方 ModbusRTUSlave Arduino 库的RTU从站封装，涵盖串口初始化、数据数组配置和寄存器/线圈读写

## 库信息
- **库名**: @aily-project/lib-modbus-rtu-slave
- **版本**: 0.0.1
- **兼容**: 通用Arduino/ESP32/ESP8266/UNO R4/RP2040等串口设备
- **电压**: 3.3V / 5V
- **源码**: https://github.com/CMB27/ModbusRTUSlave

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `modbus_rtu_slave_create` | 语句块 | `VAR(field_input)`, `SERIAL(dropdown)`, `DE_PIN(input)`, `RE_PIN(input)` | `{"type":"modbus_rtu_slave_create","fields":{"VAR":"modbus","SERIAL":"Serial1"}}` | `ModbusRTUSlave modbus(Serial1, -1, -1);` |
| `modbus_rtu_slave_set_response_delay` | 语句块 | `VAR(field_variable)`, `DELAY(input)` | `{"fields":{"VAR":{"id":"modbus"}},"inputs":{"DELAY":{"block":{...}}}}` | `modbus.setResponseDelay(5);` |
| `modbus_rtu_slave_begin` | 语句块 | `VAR(field_variable)`, `UNIT_ID(field_number)`, `BAUD(input)`, `CONFIG(dropdown)` | `{"fields":{"UNIT_ID":1,"CONFIG":"SERIAL_8N1"}}` | `Serial1.begin(38400, SERIAL_8N1); modbus.begin(1, 38400, SERIAL_8N1);` |
| `modbus_rtu_slave_poll` | 语句块 | `VAR(field_variable)`, `DO(input_statement)` | `{"inputs":{"DO":{"block":{...}}}}` | `if (modbus.poll()) { /* 用户代码 */ }` |
| `modbus_rtu_slave_bind_coils` / `_bind_discrete` | 语句块 | `VAR(field_variable)`, `ARRAY(field_input)`, `LENGTH(field_number)` | `{"fields":{"ARRAY":"coils","LENGTH":2}}` | `bool coils[2]={false}; modbus.configureCoils(coils,2);` |
| `modbus_rtu_slave_bind_holding` / `_bind_input` | 语句块 | `VAR(field_variable)`, `ARRAY(field_input)`, `LENGTH(field_number)` | `{"fields":{"ARRAY":"holdingRegisters","LENGTH":2}}` | `uint16_t holdingRegisters[2]={0}; modbus.configureHoldingRegisters(holdingRegisters,2);` |
| `modbus_rtu_slave_coils_set` / `_discrete_set` | 语句块 | `ARRAY(field_variable)`, `INDEX(input)`, `VALUE(input)` | `{"fields":{"ARRAY":{"id":"coils"}}}` | `coils[0] = true;` |
| `modbus_rtu_slave_coils_get` / `_discrete_get` | 值块 | `ARRAY(field_variable)`, `INDEX(input)` | `{"output":"Boolean"}` | `coils[0]` |
| `modbus_rtu_slave_holding_set` / `_input_set` | 语句块 | `ARRAY(field_variable)`, `INDEX(input)`, `VALUE(input)` | `{"inputs":{"VALUE":{"block":{...}}}}` | `holdingRegisters[0] = 123;` |
| `modbus_rtu_slave_holding_get` / `_input_get` | 值块 | `ARRAY(field_variable)`, `INDEX(input)` | `{"output":"Number"}` | `holdingRegisters[0]` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"ARRAY":"coils"` |
| field_dropdown | 字符串 | `"CONFIG":"SERIAL_8N1"` |
| field_variable | 对象 | `"VAR":{"id":"modbus"}` |
| input_value | 块连接 | `"inputs":{"BAUD":{"block":{...}}}` |
| input_statement | 块连接 | `"inputs":{"DO":{"block":{...}}}` |

## 连接规则

- 语句块需通过`previousStatement/nextStatement`串联，可直接放入`setup`或`loop`
- 值块只有`output`属性，可插入表达式或条件输入中，不可单独悬空
- Hat块未使用，本库事件通过`modbus_rtu_slave_poll`的`DO`语句输入触发
- 自定义变量类型：`ModbusRTUSlave`、`ModbusCoilArray`、`ModbusDiscreteArray`、`ModbusHoldingArray`、`ModbusInputArray`

## 使用示例

### RS-485 从站初始化
```json
{
  "type": "modbus_rtu_slave_begin",
  "fields": {"UNIT_ID": 1, "CONFIG": "SERIAL_8N1"},
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

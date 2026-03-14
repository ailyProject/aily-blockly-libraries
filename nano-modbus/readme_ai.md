# nanoModbus通信库

轻量级Modbus RTU/TCP通信库，支持客户端和服务器模式。

## Library Info
- **Name**: @aily-project/lib-nano-modbus
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `nmbs_client_create` | Statement | VAR(field_input), SERIAL(dropdown), BAUDRATE(dropdown) | `nmbs_client_create("modbusClient", Serial1, 9600)` | Serial init + nmbs_client_create |
| `nmbs_client_tcp_create` | Statement | VAR(field_input), SSID(input_value), PASS(input_value), IP(input_value), PORT(input_value) | `nmbs_client_tcp_create("modbusClient", text("ssid"), text("pass"), text("192.168.1.100"), math_number(502))` | WiFi connect + TCP connect + nmbs_client_create |
| `nmbs_set_dest_address` | Statement | VAR(field_variable), ADDRESS(input_value) | `nmbs_set_dest_address($modbusClient, math_number(1))` | `nmbs_set_destination_rtu_address(&var, addr);` |
| `nmbs_set_timeout` | Statement | VAR(field_variable), READ_TIMEOUT(input_value), BYTE_TIMEOUT(input_value) | `nmbs_set_timeout($modbusClient, math_number(1000), math_number(100))` | `nmbs_set_read_timeout + nmbs_set_byte_timeout` |
| `nmbs_read_holding_register` | Value→Number | VAR(field_variable), ADDRESS(input_value) | `nmbs_read_holding_register($modbusClient, math_number(0))` | `nmbs_helper_read_holding(&var, addr)` |
| `nmbs_read_input_register` | Value→Number | VAR(field_variable), ADDRESS(input_value) | `nmbs_read_input_register($modbusClient, math_number(0))` | `nmbs_helper_read_input(&var, addr)` |
| `nmbs_read_coil` | Value→Boolean | VAR(field_variable), ADDRESS(input_value) | `nmbs_read_coil($modbusClient, math_number(0))` | `nmbs_helper_read_coil(&var, addr)` |
| `nmbs_read_discrete_input` | Value→Boolean | VAR(field_variable), ADDRESS(input_value) | `nmbs_read_discrete_input($modbusClient, math_number(0))` | `nmbs_helper_read_discrete(&var, addr)` |
| `nmbs_write_single_coil` | Statement | VAR(field_variable), ADDRESS(input_value), VALUE(input_value) | `nmbs_write_single_coil($modbusClient, math_number(0), logic_boolean(TRUE))` | `nmbs_write_single_coil(&var, addr, val);` |
| `nmbs_write_single_register` | Statement | VAR(field_variable), ADDRESS(input_value), VALUE(input_value) | `nmbs_write_single_register($modbusClient, math_number(0), math_number(123))` | `nmbs_write_single_register(&var, addr, val);` |
| `nmbs_server_create` | Statement | VAR(field_input), SERIAL(dropdown), BAUDRATE(dropdown), ADDRESS(field_number) | `nmbs_server_create("modbusServer", Serial1, 9600, 1)` | Serial init + nmbs_server_create with callbacks |
| `nmbs_server_tcp_create` | Statement | VAR(field_input), SSID(input_value), PASS(input_value), PORT(field_number) | `nmbs_server_tcp_create("modbusServer", text("ssid"), text("pass"), 502)` | WiFi connect + TCP server + nmbs_server_create with callbacks |
| `nmbs_server_poll` | Statement | VAR(field_variable) | `nmbs_server_poll($modbusServer)` | `nmbs_server_poll(&var);` |
| `nmbs_server_tcp_poll` | Statement | VAR(field_variable) | `nmbs_server_tcp_poll($modbusServer)` | `nmbs_tcp_server_poll(&var, &server, &client);` |
| `nmbs_server_set_coil` | Statement | ADDRESS(input_value), VALUE(input_value) | `nmbs_server_set_coil(math_number(0), logic_boolean(TRUE))` | `nmbs_bitfield_write(nmbs_srv_coils, addr, val);` |
| `nmbs_server_get_coil` | Value→Boolean | ADDRESS(input_value) | `nmbs_server_get_coil(math_number(0))` | `nmbs_bitfield_read(nmbs_srv_coils, addr)` |
| `nmbs_server_set_register` | Statement | ADDRESS(input_value), VALUE(input_value) | `nmbs_server_set_register(math_number(0), math_number(100))` | `nmbs_srv_holding_regs[addr] = val;` |
| `nmbs_server_get_register` | Value→Number | ADDRESS(input_value) | `nmbs_server_get_register(math_number(0))` | `nmbs_srv_holding_regs[addr]` |
| `nmbs_server_set_input_register` | Statement | ADDRESS(input_value), VALUE(input_value) | `nmbs_server_set_input_register(math_number(0), math_number(100))` | `nmbs_srv_input_regs[addr] = val;` |
| `nmbs_server_get_input_register` | Value→Number | ADDRESS(input_value) | `nmbs_server_get_input_register(math_number(0))` | `nmbs_srv_input_regs[addr]` |
| `nmbs_server_set_discrete_input` | Statement | ADDRESS(input_value), VALUE(input_value) | `nmbs_server_set_discrete_input(math_number(0), logic_boolean(TRUE))` | `nmbs_bitfield_write(nmbs_srv_discrete_inputs, addr, val);` |
| `nmbs_server_get_discrete_input` | Value→Boolean | ADDRESS(input_value) | `nmbs_server_get_discrete_input(math_number(0))` | `nmbs_bitfield_read(nmbs_srv_discrete_inputs, addr)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SERIAL | Serial, Serial1, Serial2 | 串口选择 |
| BAUDRATE | 9600, 19200, 38400, 57600, 115200 | 波特率 |
| ADDRESS (server) | 1-247 | Modbus服务器地址 |
| SSID | String | WiFi网络名称(TCP模式) |
| PASS | String | WiFi密码(TCP模式) |
| IP | String | TCP服务器IP地址(TCP客户端) |
| PORT | Number (1-65535) | TCP端口号，默认502 |

## ABS Examples

### 客户端读取保持寄存器
```
arduino_setup()
    nmbs_client_create("modbusClient", Serial1, 9600)
    nmbs_set_dest_address($modbusClient, math_number(1))

arduino_loop()
    serial_println(Serial, nmbs_read_holding_register($modbusClient, math_number(0)))
    time_delay(math_number(1000))
```

### 客户端写入线圈和寄存器
```
arduino_setup()
    nmbs_client_create("modbusClient", Serial1, 9600)
    nmbs_set_dest_address($modbusClient, math_number(1))

arduino_loop()
    nmbs_write_single_coil($modbusClient, math_number(0), logic_boolean(TRUE))
    nmbs_write_single_register($modbusClient, math_number(0), math_number(123))
    time_delay(math_number(1000))
```

### 服务器模式
```
arduino_setup()
    nmbs_server_create("modbusServer", Serial1, 9600, 1)
    nmbs_server_set_input_register(math_number(0), math_number(1234))

arduino_loop()
    nmbs_server_poll($modbusServer)
    nmbs_server_set_input_register(math_number(0), analog_read(A0))
```

### TCP客户端读取寄存器
```
arduino_setup()
    nmbs_client_tcp_create("modbusClient", text("MyWiFi"), text("password"), text("192.168.1.100"), math_number(502))

arduino_loop()
    serial_println(Serial, nmbs_read_holding_register($modbusClient, math_number(0)))
    time_delay(math_number(1000))
```

### TCP服务器模式
```
arduino_setup()
    nmbs_server_tcp_create("modbusServer", text("MyWiFi"), text("password"), 502)
    nmbs_server_set_input_register(math_number(0), math_number(1234))

arduino_loop()
    nmbs_server_tcp_poll($modbusServer)
    nmbs_server_set_input_register(math_number(0), analog_read(A0))
```

## Notes

1. **初始化**：`nmbs_client_create`/`nmbs_client_tcp_create` 和 `nmbs_server_create`/`nmbs_server_tcp_create` 应放在 `arduino_setup()` 中
2. **变量引用**：操作积木使用 `variables_get($varName)` 引用初始化创建的实例
3. **服务器轮询**：RTU用 `nmbs_server_poll`，TCP用 `nmbs_server_tcp_poll`，必须在 `arduino_loop()` 中循环调用
4. **服务器数据模型**：默认支持100个线圈(地址0-100)、100个离散输入(地址0-100)和32个寄存器(地址0-32)
5. **串口选择**：RTU模式建议使用Serial1/Serial2用于Modbus通信，保留Serial用于调试
6. **TCP模式**：需要ESP32或Arduino UNO R4 WiFi等支持WiFi的开发板，会自动根据板卡类型引入对应WiFi库
7. **TCP客户端**：不需要设置目标RTU地址（`nmbs_set_dest_address`），直连TCP服务器
8. **Variable**: `nmbs_client_create("varName", ...)`/`nmbs_client_tcp_create("varName", ...)` 和 `nmbs_server_create("varName", ...)`/`nmbs_server_tcp_create("varName", ...)` 创建类型为 NanoModbus 的变量 `$varName`

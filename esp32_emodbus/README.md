# eModbus通信库

ESP32 Modbus RTU/TCP 客户端和服务器通信库，支持异步非阻塞通信。

## 库信息
- **库名**: @aily-project/lib-esp32-emodbus
- **版本**: 0.0.1
- **兼容**: ESP32系列开发板

## 块定义

### RTU客户端

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `emodbus_rtu_client_create` | 语句块 | VAR(field_input), RTS_PIN(dropdown) | `"VAR":"mbClient"` | `ModbusClientRTU mbClient(pin);` |
| `emodbus_rtu_client_begin` | 语句块 | VAR(field_variable), SERIAL/BAUDRATE/RX_PIN/TX_PIN(dropdown) | `"VAR":{"id":"..."}` | `mbClient.begin(Serial2);` |

### TCP客户端

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `emodbus_tcp_client_create` | 语句块 | VAR(field_input) | `"VAR":"mbTcpClient"` | `ModbusClientTCP mbTcpClient(wifi);` |
| `emodbus_tcp_client_begin` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `mbTcpClient.begin();` |
| `emodbus_tcp_client_set_target` | 语句块 | VAR(field_variable), IP(input), PORT(number) | - | `client.setTarget(ip, port);` |

### 客户端设置

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `emodbus_client_set_timeout` | 语句块 | VAR(field_variable), TIMEOUT(number) | `"TIMEOUT":2000` | `client.setTimeout(2000);` |
| `emodbus_client_on_data` | Hat块 | VAR(field_variable), HANDLER(statement) | - | 设置数据回调 |
| `emodbus_client_on_error` | Hat块 | VAR(field_variable), HANDLER(statement) | - | 设置错误回调 |

### 读取操作

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `emodbus_read_holding_registers` | 语句块 | VAR, SERVER_ID, ADDRESS(input), COUNT(input) | `"SERVER_ID":1` | `client.addRequest(..., READ_HOLD_REGISTER);` |
| `emodbus_read_input_registers` | 语句块 | VAR, SERVER_ID, ADDRESS(input), COUNT(input) | `"SERVER_ID":1` | `client.addRequest(..., READ_INPUT_REGISTER);` |
| `emodbus_read_coils` | 语句块 | VAR, SERVER_ID, ADDRESS(input), COUNT(input) | `"SERVER_ID":1` | `client.addRequest(..., READ_COIL);` |
| `emodbus_read_discrete_inputs` | 语句块 | VAR, SERVER_ID, ADDRESS(input), COUNT(input) | `"SERVER_ID":1` | `client.addRequest(..., READ_DISCR_INPUT);` |
| `emodbus_sync_read_holding_registers` | 值块 | VAR, SERVER_ID, ADDRESS(input) | - | 同步读取返回值 |
| `emodbus_sync_read_input_register` | 值块 | VAR, SERVER_ID, ADDRESS(input) | - | 同步读取返回值 |
| `emodbus_sync_read_coil` | 值块 | VAR, SERVER_ID, ADDRESS(input) | - | 同步读取返回值 |

### 写入操作

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `emodbus_write_single_register` | 语句块 | VAR, SERVER_ID, ADDRESS(input), VALUE(input) | - | `client.addRequest(..., WRITE_HOLD_REGISTER);` |
| `emodbus_write_single_coil` | 语句块 | VAR, SERVER_ID, ADDRESS(input), VALUE(input) | - | `client.addRequest(..., WRITE_COIL);` |
| `emodbus_write_multiple_registers` | 语句块 | VAR, SERVER_ID, ADDRESS(input), VALUES(input) | - | 写入多个寄存器 |

### 响应处理

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `emodbus_response_get_uint16` | 值块 | INDEX(input) | - | 获取16位寄存器值 |
| `emodbus_response_get_float` | 值块 | INDEX(input) | - | 获取32位浮点值 |
| `emodbus_response_server_id` | 值块 | 无 | - | `response.getServerID()` |
| `emodbus_response_function_code` | 值块 | 无 | - | `response.getFunctionCode()` |
| `emodbus_response_length` | 值块 | 无 | - | `response.size()` |

### 错误处理

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `emodbus_error_code` | 值块 | 无 | - | 返回错误码 |
| `emodbus_error_message` | 值块 | 无 | - | 返回错误信息 |

### RTU服务器

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `emodbus_rtu_server_create` | 语句块 | VAR(field_input), TIMEOUT, RTS_PIN | `"VAR":"mbServer"` | `ModbusServerRTU mbServer(timeout, pin);` |
| `emodbus_rtu_server_begin` | 语句块 | VAR(field_variable), SERIAL/BAUDRATE/RX_PIN/TX_PIN | - | `server.begin(Serial2);` |

### TCP服务器

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `emodbus_tcp_server_create` | 语句块 | VAR(field_input), PORT, MAX_CLIENTS | `"VAR":"mbTcpServer"` | `ModbusServerWiFi mbTcpServer;` |
| `emodbus_tcp_server_begin` | 语句块 | VAR(field_variable) | - | `server.start(502, 4, 20000);` |

### 服务器功能

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `emodbus_server_register_fc03` | Hat块 | VAR, SERVER_ID, ADDRESS_VAR, COUNT_VAR, HANDLER | - | 注册FC03处理函数 |
| `emodbus_server_register_fc06` | Hat块 | VAR, SERVER_ID, ADDRESS_VAR, VALUE_VAR, HANDLER | - | 注册FC06处理函数 |
| `emodbus_server_add_response_data` | 语句块 | VALUE(input) | - | 添加响应数据 |
| `emodbus_server_set_error` | 语句块 | ERROR_CODE(dropdown) | - | 设置错误响应 |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "mbClient"` |
| field_dropdown | 字符串 | `"SERIAL": "Serial2"` |
| field_dropdown(动态) | 字符串 | `"RTS_PIN": "4"` (从board.json获取) |
| field_number | 数字 | `"SERVER_ID": 1` |
| field_variable | 对象 | `"VAR": {"id": "var_id"}` |
| input_value | 块连接 | `"inputs": {"ADDRESS": {"shadow": {...}}}` |
| input_statement | 块连接 | `"inputs": {"HANDLER": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **Hat块**: 无连接属性，通过`inputs`连接内部语句（回调块）

### 动态选项处理
当遇到`"options": "${board.digitalPins}"`格式的dropdown字段时：
1. 从**board.json**文件中获取对应的选项数组
2. 在.abi文件中使用数组中的具体选项值

## 使用示例

### RTU客户端读取保持寄存器

```json
{
  "type": "emodbus_rtu_client_create",
  "id": "create_id",
  "fields": {
    "VAR": "mbClient",
    "RTS_PIN": "4"
  },
  "next": {
    "block": {
      "type": "emodbus_rtu_client_begin",
      "id": "begin_id",
      "fields": {
        "VAR": {"id": "mbClient_var_id"},
        "SERIAL": "Serial2",
        "BAUDRATE": "9600",
        "RX_PIN": "16",
        "TX_PIN": "17"
      },
      "next": {
        "block": {
          "type": "emodbus_read_holding_registers",
          "id": "read_id",
          "fields": {
            "VAR": {"id": "mbClient_var_id"},
            "SERVER_ID": 1
          },
          "inputs": {
            "ADDRESS": {
              "shadow": {
                "type": "math_number",
                "fields": {"NUM": 0}
              }
            },
            "COUNT": {
              "shadow": {
                "type": "math_number",
                "fields": {"NUM": 10}
              }
            }
          }
        }
      }
    }
  }
}
```

### TCP客户端连接

```json
{
  "type": "emodbus_tcp_client_create",
  "id": "tcp_create_id",
  "fields": {"VAR": "mbTcpClient"},
  "next": {
    "block": {
      "type": "emodbus_tcp_client_begin",
      "id": "tcp_begin_id",
      "fields": {"VAR": {"id": "mbTcpClient_var_id"}},
      "next": {
        "block": {
          "type": "emodbus_tcp_client_set_target",
          "id": "tcp_target_id",
          "fields": {
            "VAR": {"id": "mbTcpClient_var_id"},
            "PORT": 502
          },
          "inputs": {
            "IP": {
              "shadow": {
                "type": "text",
                "fields": {"TEXT": "192.168.1.100"}
              }
            }
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **客户端变量类型**: RTU客户端为`ModbusClientRTU`，TCP客户端为`ModbusClientTCP`
2. **服务器变量类型**: RTU服务器为`ModbusServerRTU`，TCP服务器为`ModbusServerWiFi`
3. **从站ID范围**: 1-247
4. **异步vs同步**: 异步读取需配合回调使用，同步读取直接返回值
5. **响应处理块**: 只能在`emodbus_client_on_data`回调内部使用

## Modbus功能码

| 功能码 | 名称 | 操作 |
|--------|------|------|
| 0x01 | READ_COIL | 读取线圈 |
| 0x02 | READ_DISCR_INPUT | 读取离散输入 |
| 0x03 | READ_HOLD_REGISTER | 读取保持寄存器 |
| 0x04 | READ_INPUT_REGISTER | 读取输入寄存器 |
| 0x05 | WRITE_COIL | 写入单个线圈 |
| 0x06 | WRITE_HOLD_REGISTER | 写入单个寄存器 |
| 0x10 | WRITE_MULT_REGISTERS | 写入多个寄存器 |

## 错误码

| 错误 | 说明 |
|------|------|
| ILLEGAL_FUNCTION | 非法功能码 |
| ILLEGAL_DATA_ADDRESS | 非法数据地址 |
| ILLEGAL_DATA_VALUE | 非法数据值 |
| SERVER_DEVICE_FAILURE | 设备故障 |
| TIMEOUT | 通信超时 |

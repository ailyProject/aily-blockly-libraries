# Seeed RPC BLE

Wio Terminal rpcBLE Blockly 支持低功耗蓝牙服务端、客户端扫描连接、Web Bluetooth 和 iBeacon 广播。

## 库信息

| 字段 | 内容 |
|------|------|
| 包名 | @aily-project/lib-seeed-rpcble |
| 版本 | 1.0.0 |
| 作者 | SeeedStudio |
| 源码 | https://github.com/Seeed-Studio/Seeed_Arduino_rpcBLE |
| License | Apache-2.0 |

## 支持板卡

Wio Terminal / Seeed SAMD 系列，需先刷入支持 BLE 的 RTL8720 eRPC 固件。

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|-----------|----------|----------|
| seeed_rpcble_init | 语句 | NAME | seeed_rpcble_init(text("Wio BLE")) | BLEDevice::init(...) |
| seeed_rpcble_create_server | 语句 | VAR | seeed_rpcble_create_server("pServer") | BLEDevice::createServer() |
| seeed_rpcble_create_characteristic | 语句 | SERVICE, CHAR_VAR, UUID, PROPERTIES | seeed_rpcble_create_characteristic($pService,"pCharacteristic",text("2a19"),...) | createCharacteristic(...) |
| seeed_rpcble_scan_start | 语句 | SCAN, DURATION, RESULT_VAR, CONTINUE | seeed_rpcble_scan_start($pBLEScan,math_number(5),"foundDevices",FALSE) | scan->start(...) |
| seeed_rpcble_uart_begin | 语句 | NAME | seeed_rpcble_uart_begin(text("UART Service")) | 创建 UART 服务 |
| seeed_rpcble_web_battery_begin | 语句 | NAME, LEVEL | seeed_rpcble_web_battery_begin(text("BLE Battery"),math_number(10)) | 创建电池服务 |
| seeed_rpcble_ibeacon_begin | 语句 | NAME, UUID, MAJOR, MINOR, MANUFACTURER, POWER, INFO, ADV_TYPE | seeed_rpcble_ibeacon_begin(...) | 配置 iBeacon |

更多块详见 readme_ai.md。

## 字段类型映射

- `field_input`：创建对象变量名，如服务端、扫描器、客户端、服务和特征。
- `field_variable`：选择已创建对象。
- `input_value`：文本、数字或表达式参数；toolbox 已配置影子块。
- `field_dropdown`：属性、权限、地址类型和广播类型。

## 连接规则

- 初始化、创建服务端/客户端、服务与特征配置通常放在 setup。
- 扫描、通知、电量更新和 UART 发送可放在 loop。
- 事件块是设置回调的语句块，应在对应对象创建后执行。

## 使用示例

```abs
arduino_setup()
    seeed_rpcble_uart_begin(text("UART Service"))

arduino_loop()
    controls_if()
        @IF0: seeed_rpcble_uart_connected()
        @DO0:
            seeed_rpcble_uart_send(text("hello"))
    time_delay(math_number(1000))
```

## 重要规则

1. 使用前请按 Seeed 文档更新 Wio Terminal RTL8720 BLE 固件。
2. UUID 可使用 16 位字符串如 `180f`，也可使用 128 位 UUID。
3. iBeacon 广播数据最多约 31 字节，`INFO` 不宜过长。
4. Web Bluetooth 示例默认设备名为 `BLE Battery`，网页过滤名称需一致。
# Seeed IR

Seeed_Arduino_IR 的 Blockly 封装，用于 Wio Terminal 内置红外发射器，也支持 IRLib2 的协议发送、Raw 发送和基础接收解码。

## 库信息

| 字段 | 内容 |
|------|------|
| 包名 | @aily-project/lib-seeed-ir |
| 版本 | 1.0.0 |
| 作者 | Hongtai.liu / Chris Young |
| 源码 | https://github.com/Seeed-Studio/Seeed_Arduino_IR |
| License | GPL-3.0-or-later |

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|-----------|----------|----------|
| seeed_ir_wio_send | 语句 | PROTOCOL, DATA, DATA2, KHZ | seeed_ir_wio_send(NEC,math_number(1637937167),math_number(0),math_number(38)) | ailyWioIrSender.send(...) |
| seeed_ir_sender_create | 语句 | VAR | seeed_ir_sender_create("irSender") | IRsend var; |
| seeed_ir_send | 语句 | VAR, PROTOCOL, DATA, DATA2, KHZ | seeed_ir_send($irSender,NEC,math_number(1),math_number(0),math_number(38)) | var.send(...) |
| seeed_ir_send_raw | 语句 | VAR, DATA, KHZ | seeed_ir_send_raw($rawSender,text("9000,4500"),math_number(38)) | raw.send(...) |
| seeed_ir_receiver_create | 语句 | VAR, DECODER, PIN | seeed_ir_receiver_create("irReceiver","irDecoder",2) | IRrecvPCI/IRdecode |
| seeed_ir_on_receive | 语句 | VAR, DECODER, DO | seeed_ir_on_receive($irReceiver,$irDecoder) | if(getResults()) {...} |
| seeed_ir_decoder_get | 值 | DECODER, FIELD | seeed_ir_decoder_get($irDecoder,VALUE) | decoder.value |

## 字段类型映射

- `field_input` 创建 IRsend、IRsendRaw、IRrecvPCI、IRdecode 变量。
- `field_variable` 选择已创建的发射器、接收器或解码器。
- `input_value` 接数字、文本或表达式；toolbox 已提供影子块。
- `field_dropdown` 选择协议、解码字段和打印详细程度。

## 连接规则

创建块放在 setup；发送块可放在按键、串口或 loop 流程中；接收时先启动接收，再用事件块或手动 getResults/decode/resume 流程。

## 使用示例

```abs
arduino_setup()
    seeed_ir_sender_create("irSender")

arduino_loop()
    seeed_ir_send_nec($irSender, math_number(1637937167), math_number(38))
    time_delay(math_number(1000))
```

## 重要规则

1. Wio Terminal 内置发射器由库内 `WIO_IR` 自动选择，无需手动配置发射引脚。
2. NEC 示例值 `1637937167` 等于教程中的 `0x61a0f00f`。
3. Raw 时序请输入逗号分隔的微秒数，如 `9000,4500,560,560`。
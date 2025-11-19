# MFRC522 RFID 图形化库

MFRC522 I2C RFID读写器的 Aily Blockly 图形化编程库。

## 库信息

**包名**: `@aily-project/lib-rfid`  
**版本**: 1.0.0  
**依赖**: Emakefun_RFID, Wire  
**兼容**: Arduino UNO/Mega/ESP32/ESP8266/UNO R4  
**功能**: 卡片检测、UID读取、数据读写、密钥认证、智能板卡适配

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `mfrc522_setup` | 语句块 | VAR(field_input), ADDRESS(field_number) | `"VAR":"rfid","ADDRESS":"0x2F"` | `MFRC522 rfid(0x2F); Wire.begin(); rfid.PCD_Init();` |
| `mfrc522_is_new_card_present` | 值块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `rfid.PICC_IsNewCardPresent()` |
| `mfrc522_read_card_serial` | 值块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `rfid.PICC_ReadCardSerial()` |
| `mfrc522_read_uid` | 值块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `rfid.Read_Uid()` |
| `mfrc522_when_card_detected` | Hat块 | VAR(field_variable), HANDLER(input_statement) | `"VAR":{"id":"var_id"},"inputs":{"HANDLER":{...}}` | `if(rfid.PICC_IsNewCardPresent()&&rfid.PICC_ReadCardSerial()){...}` |
| `mfrc522_authenticate` | 语句块 | VAR(field_variable), SECTOR/KEY_TYPE/KEY(input_value) | `"VAR":{"id":"var_id"},"inputs":{"SECTOR":{...}}` | `rfid.PCD_Authenticate(0x60,1,&key,&rfid.uid);` |
| `mfrc522_read_block` | 语句块 | VAR(field_variable), BLOCK(input_value), BUFFER(field_variable) | `"VAR":{"id":"var_id"},"BUFFER":{"id":"buf_id"}` | `rfid.MIFARE_Read(4,data,&size);` |
| `mfrc522_write_block` | 语句块 | VAR(field_variable), DATA/BLOCK(input_value) | `"VAR":{"id":"var_id"},"inputs":{"DATA":{...}}` | `rfid.MIFARE_Write(4,buffer,16);` |
| `mfrc522_halt_card` | 语句块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `rfid.PICC_HaltA(); rfid.PCD_StopCrypto1();` |
| `mfrc522_get_data_string` | 值块 | BUFFER(field_variable) | `"BUFFER":{"id":"buf_id"}` | `format_data()` |

## 字段类型映射

| 字段类型 | 用途 | 说明 |
|---------|------|------|
| field_input | 对象名 | 初始化块文本输入 |
| field_variable | 对象引用 | 方法块变量选择 |
| field_number | 数值 | I2C地址(0x08-0x7F) |
| field_dropdown | 选项 | 引脚/密钥类型 |
| input_value | 值输入 | 扇区/块/数据/密钥 |

## 连接规则

**语句连接**: 初始化块→检测/事件块→认证块→数据操作块→停止通信  
**值输出**: Boolean类型用于条件判断，String类型用于显示  
**依赖**: 必须先初始化→认证后才能读写→操作后停止通信

## 使用示例

### UID读取
```cpp
// 初始化 RFID 读写器 rfid I2C地址 0x2F
// 当 RFID rfid 检测到卡片时 → 串口打印 RFID rfid 获取UID字符串

MFRC522 rfid(0x2F);
void setup() { Serial.begin(115200); Wire.begin(); rfid.PCD_Init(); }
void loop() {
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial())
    Serial.println(rfid.Read_Uid());
}
```

### 数据读写
```cpp
// 认证扇区→读取块→打印数据→停止通信
if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
  rfid.PCD_Authenticate(0x60, 1, &key, &rfid.uid);
  rfid.MIFARE_Read(4, data, &size);
  rfid.PICC_HaltA();
}
```

## 重要规则

### 初始化块
- **field_input**: 使用文本输入定义对象名
- **首次调用**: 必须最先调用
- **板卡适配**: ESP32可选引脚，UNO/Mega固定引脚(UNO: A4/A5, Mega: 20/21)

### 方法块
- **field_variable**: 使用变量下拉引用对象
- **依赖初始化**: 依赖初始化块创建的对象
- **正确调用**: 使用`getField('VAR').getText()`

### 变量管理
- **注册**: 调用`registerVariableToBlockly()`
- **监听**: field validator监听重命名
- **同步**: 调用`renameVariableInBlockly()`

### 数据操作
- **流程**: 先认证→读写→停止通信
- **密钥**: 十六进制逗号分隔(如"0xFF,0xFF,0xFF,0xFF,0xFF,0xFF")
- **块地址**: MIFARE 1K为0-63，每块16字节

### 支持卡片
MIFARE Mini/1K/4K, Ultralight/Ultralight C
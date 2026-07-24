# ESP32 EEPROM - AI 使用说明

## 适用范围

ESP32 EEPROM 兼容存储积木，补齐 begin、commit、end 及类型化读写生命周期。

芯片/配置约束：EEPROM 是基于 Flash 的兼容层，频繁 commit 会影响 Flash 寿命。

## 代码生成约定

- 所有积木类型均使用 `esp32_` 前缀。
- generator.js 会自动添加 SDK 头文件和必要的全局对象。
- 创建对象类积木应在初始化阶段执行；状态查询积木可在循环或条件中使用。
- 不打包 SDK 源码，也不生成 src.7z。

## 积木

- `esp32_eeprom_begin`：分配 EEPROM 模拟存储区。
- `esp32_eeprom_read`：读取指定地址的一个字节。
- `esp32_eeprom_write`：写入一个字节，之后需要提交。
- `esp32_eeprom_read_typed`：按指定类型读取数值。
- `esp32_eeprom_write_typed`：按指定类型写入数值。
- `esp32_eeprom_read_string`：读取以零结尾的字符串。
- `esp32_eeprom_write_string`：写入字符串并返回写入长度。
- `esp32_eeprom_commit`：把缓存中的更改写入 Flash。
- `esp32_eeprom_end`：提交并释放 EEPROM 缓冲区。
- `esp32_eeprom_length`：返回当前 EEPROM 容量。
- `esp32_eeprom_dirty`：检查缓存是否有未提交更改。

# EEPROM存储 (EEPROM Storage) 核心库

Arduino/C++编程中的EEPROM存储核心库，提供非易失性数据存储功能。

## 库信息
- **库名**: @aily-project/lib-core-eeprom
- **版本**: 0.0.1
- **作者**: aily Project
- **描述**: EEPROM非易失性存储库
- **测试者**: openjumper

## 可用模块

### 读取EEPROM (`eeprom_read`)
从指定地址读取数据
- **参数**: 地址（0到EEPROM大小-1）
- **返回值**: 读取的字节数据（0-255）
- **实现**: `EEPROM.read(address)`

### EEPROM空间大小 (`eeprom_length`)
获取EEPROM总容量
- **返回值**: EEPROM总字节数
- **实现**: `EEPROM.length()`
- **用途**: 检查存储空间大小，避免地址越界

### 写入EEPROM (`eeprom_write`)
向指定地址写入数据
- **参数**: 地址、数值
- **实现**: `EEPROM.put(address, value)`
- **注意**: 使用put()而非write()，支持多字节数据类型

## 使用说明

### 基本用法
```cpp
// 写入数据
EEPROM.put(0, 123);

// 读取数据
int value = EEPROM.read(0);

// 检查容量
int capacity = EEPROM.length();
```

### 数据类型支持
- **字节数据**: 直接使用read/write
- **多字节数据**: 使用put/get方法
- **结构体**: 可存储自定义数据结构

### 地址管理
- Arduino UNO: 1024字节 (0-1023)
- Arduino Mega: 4096字节 (0-4095)
- ESP32: 模拟EEPROM，需要调用commit()

## 注意事项
- EEPROM有写入次数限制（约100,000次）
- 数据在断电后保持不变
- 写入操作相对较慢
- ESP32需要在setup()中调用EEPROM.begin()
- 建议使用put/get而非write/read处理多字节数据

## 技术特性
- **非易失性**: 断电数据不丢失
- **跨平台**: 支持Arduino和ESP32
- **类型安全**: 自动处理多字节数据
- **容量检测**: 提供空间大小查询功能

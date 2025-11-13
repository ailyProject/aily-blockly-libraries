# esp32_SD

ESP32 SD卡文件系统操作库

## 库信息
- **库名**: @aily-project/lib-esp32-sd
- **版本**: 1.0.0
- **兼容**: ESP32系列开发板(ESP32/C3/C6/S2/S3/H2)

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp32_sd_begin` | 语句块 | 无 | `{}` | `SD.begin()初始化+错误处理` |
| `esp32_sd_begin_custom` | 语句块 | CS/SCK/MISO/MOSI/FREQUENCY(input_value) | `"inputs":{"CS":{"block":{"type":"math_number","fields":{"NUM":"5"}}},"SCK":{"block":{"type":"math_number","fields":{"NUM":"18"}}}}` | `SPI.begin()+SD.begin()自定义引脚配置` |
| `esp32_sd_card_info` | 值块 | INFO(field_dropdown) | `"fields":{"INFO":"cardType"}` | `SD.cardType()` |
| `esp32_sd_file_exists` | 值块 | PATH(input_value) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/test.txt"}}}}` | `SD.exists("/test.txt")` |
| `esp32_sd_open_file` | 值块 | VAR(field_variable), PATH(input_value), MODE(field_dropdown) | `"fields":{"VAR":{"id":"file_id","name":"file","type":"File"},"MODE":"FILE_READ"},"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/test.txt"}}}}` | `file = SD.open(path, mode)` |
| `esp32_sd_close_file` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"file_id","name":"file","type":"File"}}` | `file.close();` |
| `esp32_sd_write_file` | 语句块 | VAR(field_variable), CONTENT(input_value) | `"fields":{"VAR":{"id":"file_id","name":"file","type":"File"}},"inputs":{"CONTENT":{"block":{"type":"text","fields":{"TEXT":"Hello"}}}}` | `file.print(content);` |
| `esp32_sd_read_file` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"file_id","name":"file","type":"File"}}` | `readFileContent(file)` |
| `esp32_sd_file_available` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"file_id","name":"file","type":"File"}}` | `file.available()` |
| `esp32_sd_file_size` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"file_id","name":"file","type":"File"}}` | `file.size()` |
| `esp32_sd_write_file_quick` | 语句块 | PATH/CONTENT(input_value) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/hello.txt"}}},"CONTENT":{"block":{"type":"text","fields":{"TEXT":"Hello World"}}}}` | `writeFile(path, content);` |
| `esp32_sd_read_file_quick` | 值块 | PATH(input_value) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/hello.txt"}}}}` | `readFile(path)` |
| `esp32_sd_append_file` | 语句块 | PATH/CONTENT(input_value) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/log.txt"}}},"CONTENT":{"block":{"type":"text","fields":{"TEXT":"New data"}}}}` | `appendFile(path, content);` |
| `esp32_sd_delete_file` | 语句块 | PATH(input_value) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/temp.txt"}}}}` | `SD.remove(path)+结果提示;` |
| `esp32_sd_rename_file` | 语句块 | OLD_PATH/NEW_PATH(input_value) | `"inputs":{"OLD_PATH":{"block":{"type":"text","fields":{"TEXT":"/old.txt"}}},"NEW_PATH":{"block":{"type":"text","fields":{"TEXT":"/new.txt"}}}}` | `SD.rename(oldPath, newPath)+结果提示;` |
| `esp32_sd_create_dir` | 语句块 | PATH(input_value) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/mydir"}}}}` | `SD.mkdir(path)+结果提示;` |
| `esp32_sd_remove_dir` | 语句块 | PATH(input_value) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/mydir"}}}}` | `SD.rmdir(path)+结果提示;` |
| `esp32_sd_list_dir` | 语句块 | PATH/LEVELS(input_value) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/"}}}, "LEVELS":{"block":{"type":"math_number","fields":{"NUM":"0"}}}}` | `listDir(SD, path, levels);` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_variable | File/SDFS变量对象 | `"VAR": {"id": "file_id", "name": "file", "type": "File"}` |
| field_dropdown | 字符串 | `"MODE": "FILE_READ"` |
| input_value | 块连接 | `"inputs": {"PATH": {"block": {"type": "text", "fields": {"TEXT": "/test.txt"}}}}` |

## 连接规则

- **语句块**: 初始化、写入、操作类块有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 读取、查询类块有output，连接到`inputs`中，无`next`字段
- **特殊规则**: 
  - File变量类型为"File"，SDFS变量类型为"SDFS"
  - SD卡必须先初始化再使用，会自动添加错误处理代码
  - 文件读取使用自动生成的`readFileContent`函数确保完整读取
  - 快速文件操作自动生成`writeFile`、`readFile`、`appendFile`等辅助函数
  - 目录列表功能自动生成递归`listDir`函数
  - 文件操作结果会自动输出到串口进行状态提示
  - 路径格式为Unix风格"/"开头的绝对路径

## 使用示例

### SD卡初始化(默认引脚)
```json
{
  "type": "esp32_sd_begin",
  "id": "sd_init"
}
```

### SD卡初始化(自定义引脚)
```json
{
  "type": "esp32_sd_begin_custom",
  "id": "sd_init_custom",
  "inputs": {
    "CS": {"block": {"type": "math_number", "fields": {"NUM": "5"}}},
    "SCK": {"block": {"type": "math_number", "fields": {"NUM": "18"}}},
    "MISO": {"block": {"type": "math_number", "fields": {"NUM": "19"}}},
    "MOSI": {"block": {"type": "math_number", "fields": {"NUM": "23"}}},
    "FREQUENCY": {"block": {"type": "math_number", "fields": {"NUM": "4000000"}}}
  }
}
```

### 文件完整操作流程
```json
{
  "type": "variables_set",
  "id": "open_file",
  "fields": {"VAR": {"id": "file_var", "name": "myFile", "type": "File"}},
  "inputs": {
    "VALUE": {
      "block": {
        "type": "esp32_sd_open_file",
        "fields": {"VAR": {"id": "file_var", "name": "myFile", "type": "File"}, "MODE": "FILE_WRITE"},
        "inputs": {"PATH": {"block": {"type": "text", "fields": {"TEXT": "/data.txt"}}}}
      }
    }
  },
  "next": {
    "block": {
      "type": "esp32_sd_write_file",
      "fields": {"VAR": {"id": "file_var", "name": "myFile", "type": "File"}},
      "inputs": {"CONTENT": {"block": {"type": "text", "fields": {"TEXT": "Sensor Data: 25.6"}}}},
      "next": {
        "block": {
          "type": "esp32_sd_close_file",
          "fields": {"VAR": {"id": "file_var", "name": "myFile", "type": "File"}}
        }
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: SD卡必须先初始化才能进行文件操作，文件打开后必须关闭释放资源
2. **连接限制**: 初始化块必须在setup区域，文件操作块可在任意位置，读取块返回值可用于变量赋值
3. **变量管理**: File类型用于文件对象，SDFS类型用于文件系统对象，支持多文件同时操作
4. **常见错误**: ❌ 未初始化直接操作，❌ 文件未关闭，❌ 路径格式错误，❌ SPI引脚冲突

## 支持的字段选项
- **MODE(文件模式)**: "FILE_READ"(只读), "FILE_WRITE"(覆写), "FILE_APPEND"(追加)
- **INFO(卡信息)**: "cardType"(卡类型), "cardSize"(卡大小MB), "totalBytes"(总空间MB), "usedBytes"(已用空间MB)
- **PATH(路径格式)**: Unix风格绝对路径，如"/folder/file.txt"
- **FREQUENCY(SPI频率)**: 100kHz-80MHz（建议4MHz-25MHz）
- **引脚范围**: CS/SCK/MISO/MOSI使用ESP32 GPIO引脚
- **变量类型**: "File"(文件对象), "SDFS"(文件系统对象)

## 技术规格
- **支持平台**: ESP32全系列(ESP32/C3/C6/S2/S3/H2)
- **文件系统**: FAT16/FAT32文件系统支持
- **SD卡类型**: SDHC/SDXC卡支持(最大32GB建议)
- **默认引脚**: CS:5, SCK:18, MISO:19, MOSI:23
- **SPI频率**: 默认4MHz，最高支持25MHz
- **文件操作**: 读写、追加、删除、重命名、目录管理
- **并发支持**: 支持多文件同时打开(建议不超过5个)
- **路径长度**: 最大路径长度255字符
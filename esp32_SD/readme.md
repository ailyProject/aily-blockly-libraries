# esp32_SD

ESP32 SD卡文件系统操作库

## 库信息
- **库名**: @aily-project/lib-esp32-sd
- **版本**: 1.0.0
- **兼容**: ESP32系列(ESP32/C3/C6/S2/S3/H2)

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp32_sd_begin` | 语句块 | 无 | `{}` | `SD.begin()` |
| `esp32_sd_begin_custom` | 语句块 | CS/SCK/MISO/MOSI/FREQUENCY(input) | `"inputs":{"CS":{"block":{"type":"math_number","fields":{"NUM":"5"}}}}` | `SPI.begin()+SD.begin()` |
| `esp32_sd_card_info` | 值块 | INFO(dropdown) | `"fields":{"INFO":"cardType"}` | `SD.cardType()` |
| `esp32_sd_file_exists` | 值块 | PATH(input) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/test.txt"}}}}` | `SD.exists(path)` |
| `esp32_sd_open_file` | 值块 | VAR(variable), PATH(input), MODE(dropdown) | `"fields":{"VAR":{"id":"id","name":"file","type":"File"},"MODE":"FILE_READ"}` | `file=SD.open(path,mode)` |
| `esp32_sd_close_file` | 语句块 | VAR(variable) | `"fields":{"VAR":{"id":"id","name":"file","type":"File"}}` | `file.close()` |
| `esp32_sd_write_file` | 语句块 | VAR(variable), CONTENT(input) | `"fields":{"VAR":{"id":"id","name":"file","type":"File"}}` | `file.print(content)` |
| `esp32_sd_read_file` | 值块 | VAR(variable) | `"fields":{"VAR":{"id":"id","name":"file","type":"File"}}` | `readFileContent(file)` |
| `esp32_sd_file_available` | 值块 | VAR(variable) | `"fields":{"VAR":{"id":"id","name":"file","type":"File"}}` | `file.available()` |
| `esp32_sd_file_size` | 值块 | VAR(variable) | `"fields":{"VAR":{"id":"id","name":"file","type":"File"}}` | `file.size()` |
| `esp32_sd_write_file_quick` | 语句块 | PATH/CONTENT(input) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/data.txt"}}}}` | `writeFile(path,content)` |
| `esp32_sd_read_file_quick` | 值块 | PATH(input) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/data.txt"}}}}` | `readFile(path)` |
| `esp32_sd_append_file` | 语句块 | PATH/CONTENT(input) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/log.txt"}}}}` | `appendFile(path,content)` |
| `esp32_sd_delete_file` | 语句块 | PATH(input) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/temp.txt"}}}}` | `SD.remove(path)` |
| `esp32_sd_rename_file` | 语句块 | OLD_PATH/NEW_PATH(input) | `"inputs":{"OLD_PATH":{"block":{"type":"text","fields":{"TEXT":"/old.txt"}}}}` | `SD.rename(old,new)` |
| `esp32_sd_create_dir` | 语句块 | PATH(input) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/dir"}}}}` | `SD.mkdir(path)` |
| `esp32_sd_remove_dir` | 语句块 | PATH(input) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/dir"}}}}` | `SD.rmdir(path)` |
| `esp32_sd_list_dir` | 语句块 | PATH/LEVELS(input) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/"}}}}` | `listDir(SD,path,levels)` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_variable | 对象 | `"VAR": {"id": "var_id", "name": "file", "type": "File"}` |
| field_dropdown | 字符串 | `"MODE": "FILE_READ"` |
| input_value | 块连接 | `"inputs": {"PATH": {"block": {"type": "text", "fields": {"TEXT": "/data.txt"}}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **特殊规则**: 
  - File变量ID格式：`{"id": "唯一ID", "name": "变量名", "type": "File"}`
  - 路径格式：Unix风格绝对路径，如`"/data.txt"`
  - 快速操作块自动生成辅助函数（writeFile/readFile/appendFile/listDir）

## 使用示例

### 快速写入文件
```json
{
  "type": "esp32_sd_write_file_quick",
  "inputs": {
    "PATH": {"block": {"type": "text", "fields": {"TEXT": "/data.txt"}}},
    "CONTENT": {"block": {"type": "text", "fields": {"TEXT": "Hello SD"}}}
  }
}
```

### 打开文件操作
```json
{
  "type": "esp32_sd_open_file",
  "fields": {
    "VAR": {"id": "file_001", "name": "myFile", "type": "File"},
    "MODE": "FILE_WRITE"
  },
  "inputs": {
    "PATH": {"block": {"type": "text", "fields": {"TEXT": "/sensor.txt"}}}
  }
}
```

## 重要规则

1. **必须遵守**: SD卡必须先初始化，File变量ID必须唯一
2. **连接限制**: 打开文件后必须关闭，路径必须以`/`开头
3. **常见错误**: ❌ 未初始化直接操作 ❌ File变量ID重复 ❌ 路径格式错误

## 支持的选项
- **MODE**: `FILE_READ`(只读) / `FILE_WRITE`(覆写) / `FILE_APPEND`(追加)
- **INFO**: `cardType`(卡类型) / `cardSize`(MB) / `totalBytes`(总空间) / `usedBytes`(已用)
- **默认引脚**: CS:5, SCK:18, MISO:19, MOSI:23
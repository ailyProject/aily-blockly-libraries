# esp32_SD

ESP32 SD卡文件系统操作库

## 库信息
- **库名**: @aily-project/lib-esp32-sd
- **版本**: 1.0.0
- **兼容**: ESP32系列开发板(ESP32/C3/C6/S2/S3/H2)

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp32_sd_init` | 语句块 | SPI(field_dropdown), SS/FREQUENCY(input_value) | `"fields":{"SPI":"SPI"},"inputs":{"SS":{"block":{"type":"math_number","fields":{"NUM":"5"}}},"FREQUENCY":{"block":{"type":"math_number","fields":{"NUM":"4000000"}}}}` | `SPI.begin()+SD.begin(ss,SPI,freq)` |
| `esp32_sd_card_info` | 值块 | INFO(field_dropdown) | `"fields":{"INFO":"cardType"}` | `SD.cardType()` |
| `esp32_sd_file_exists` | 值块 | PATH(input_value) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/test.txt"}}}}` | `SD.exists(path)` |
| `esp32_sd_open_file` | 值块 | VAR(field_variable), PATH(input_value), MODE(field_dropdown) | `"fields":{"VAR":{"id":"file_id","name":"file","type":"File"},"MODE":"FILE_READ"},"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/test.txt"}}}}` | `var=SD.open(path,mode)` |
| `esp32_sd_close_file` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"file_id","name":"file","type":"File"}}` | `var.close()` |
| `esp32_sd_write_file` | 语句块 | VAR(field_variable), CONTENT(input_value) | `"fields":{"VAR":{"id":"file_id","name":"file","type":"File"}},"inputs":{"CONTENT":{"block":{"type":"text","fields":{"TEXT":"Hello"}}}}` | `var.print(content)` |
| `esp32_sd_read_file` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"file_id","name":"file","type":"File"}}` | `readFileContent(var)` |
| `esp32_sd_file_available` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"file_id","name":"file","type":"File"}}` | `var.available()` |
| `esp32_sd_file_size` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"file_id","name":"file","type":"File"}}` | `var.size()` |
| `esp32_sd_write_file_quick` | 语句块 | PATH/CONTENT(input_value) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/hello.txt"}}},"CONTENT":{"block":{"type":"text","fields":{"TEXT":"Hello World"}}}}` | `writeFile(path,content)` |
| `esp32_sd_read_file_quick` | 值块 | PATH(input_value) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/hello.txt"}}}}` | `readFile(path)` |
| `esp32_sd_append_file` | 语句块 | PATH/CONTENT(input_value) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/log.txt"}}},"CONTENT":{"block":{"type":"text","fields":{"TEXT":"New data"}}}}` | `appendFile(path,content)` |
| `esp32_sd_delete_file` | 语句块 | PATH(input_value) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/temp.txt"}}}}` | `SD.remove(path)` |
| `esp32_sd_rename_file` | 语句块 | OLD_PATH/NEW_PATH(input_value) | `"inputs":{"OLD_PATH":{"block":{"type":"text","fields":{"TEXT":"/old.txt"}}},"NEW_PATH":{"block":{"type":"text","fields":{"TEXT":"/new.txt"}}}}` | `SD.rename(old,new)` |
| `esp32_sd_create_dir` | 语句块 | PATH(input_value) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/mydir"}}}}` | `SD.mkdir(path)` |
| `esp32_sd_remove_dir` | 语句块 | PATH(input_value) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/mydir"}}}}` | `SD.rmdir(path)` |
| `esp32_sd_list_dir` | 语句块 | PATH/LEVELS(input_value) | `"inputs":{"PATH":{"block":{"type":"text","fields":{"TEXT":"/"}}}, "LEVELS":{"block":{"type":"math_number","fields":{"NUM":"0"}}}}` | `listDir(SD,path,levels)` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_variable | 变量对象 | `"VAR": {"id": "file_id", "name": "file", "type": "File"}` |
| field_dropdown | 字符串 | `"MODE": "FILE_READ"` |
| field_dropdown(动态) | 字符串 | `"SPI": "SPI"` (从board.json的spi字段获取) |
| input_value | 块连接 | `"inputs": {"PATH": {"block": {"type": "text", "fields": {"TEXT": "/test.txt"}}}}` |

## 连接规则

- **语句块**: 初始化、写入、操作类块有previousStatement/nextStatement,通过`next`字段连接
- **值块**: 读取、查询、打开文件类块有output,连接到`inputs`中,无`next`字段
- **特殊规则**: 
  - File变量类型为"File"
  - SD卡必须先初始化再使用
  - 文件打开后建议关闭以释放资源
  - 路径格式为Unix风格"/"开头的绝对路径

### 动态选项处理
当遇到`"options": "${board.xxx}"`格式的dropdown字段时:
1. 需要从**board.json**文件中获取对应的选项数组
2. 使用`board.xxx`中的xxx作为key,获取对应的value数组
3. 在.abi文件中使用数组中的具体选项值,而非模板字符串

**示例**:
- block.json中: `"options": "${board.spi}"`
- board.json中: `"spi": [["SPI", "SPI"], ["SPI1", "SPI1"]]`
- .abi中使用: `"SPI": "SPI"` (选择数组中某组的value,即第二个元素)

## 使用示例

### SD卡初始化
```json
{
  "type": "esp32_sd_init",
  "id": "sd_init",
  "fields": {"SPI": "SPI"},
  "inputs": {
    "SS": {"block": {"type": "math_number", "fields": {"NUM": "5"}}},
    "FREQUENCY": {"block": {"type": "math_number", "fields": {"NUM": "4000000"}}}
  }
}
```

### 快速文件操作
```json
{
  "type": "esp32_sd_write_file_quick",
  "id": "write_quick",
  "inputs": {
    "PATH": {"block": {"type": "text", "fields": {"TEXT": "/data.txt"}}},
    "CONTENT": {"block": {"type": "text", "fields": {"TEXT": "Hello SD Card"}}}
  },
  "next": {
    "block": {
      "type": "esp32_sd_read_file_quick",
      "id": "read_quick",
      "inputs": {
        "PATH": {"block": {"type": "text", "fields": {"TEXT": "/data.txt"}}}
      }
    }
  }
}
```
### 文件操作流程
```json
{
  "type": "variables_set",
  "id": "open_file",
  "fields": {"VAR": {"id": "file_var", "name": "myFile", "type": "File"}},
  "inputs": {
    "VALUE": {
      "block": {
        "type": "esp32_sd_open_file",
        "fields": {
          "VAR": {"id": "file_var", "name": "myFile", "type": "File"},
          "MODE": "FILE_WRITE"
        },
        "inputs": {
          "PATH": {"block": {"type": "text", "fields": {"TEXT": "/data.txt"}}}
        }
      }
    }
  },
  "next": {
    "block": {
      "type": "esp32_sd_write_file",
      "id": "write_file",
      "fields": {"VAR": {"id": "file_var", "name": "myFile", "type": "File"}},
      "inputs": {
        "CONTENT": {"block": {"type": "text", "fields": {"TEXT": "Sensor: 25.6"}}}
      },
      "next": {
        "block": {
          "type": "esp32_sd_close_file",
          "id": "close_file",
          "fields": {"VAR": {"id": "file_var", "name": "myFile", "type": "File"}}
        }
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: SD卡必须先初始化才能进行文件操作,块ID必须唯一
2. **连接限制**: 初始化块建议在setup区域,文件操作块可在任意位置,值块无next字段
3. **变量管理**: File类型用于文件对象,支持多文件同时操作
4. **常见错误**: ❌ 未初始化直接操作 ❌ 文件未关闭导致资源泄漏 ❌ 路径格式错误(不以"/"开头) ❌ SPI引脚冲突

## 支持的字段选项
- **SPI**: 从board.json的spi字段获取(如"SPI","SPI1")
- **MODE**: "FILE_READ"(只读), "FILE_WRITE"(覆写), "FILE_APPEND"(追加)
- **INFO**: "cardType"(卡类型), "cardSize"(卡大小MB), "totalBytes"(总空间MB), "usedBytes"(已用空间MB)
- **PATH**: Unix风格绝对路径,如"/folder/file.txt"
- **FREQUENCY**: SPI频率(Hz),建议4000000(4MHz)
- **SS**: CS片选引脚,GPIO编号
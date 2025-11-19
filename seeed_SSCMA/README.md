# seeed_SSCMA

Seeed Grove AI视觉识别模块操作库

## 库信息
- **库名**: @aily-project/lib-seeed-sscma
- **版本**: 1.0.0
- **兼容**: Arduino全系列平台

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `sscma_begin_i2c` | 语句块 | VAR(field_input), WIRE(field_dropdown), RST(input_value), ADDRESS(input_value) | `"fields":{"VAR":"ai","WIRE":"Wire"},"inputs":{"RST":"2","ADDRESS":"0x62"}` | `SSCMA ai; ai.begin(Wire, 2, 0x62);` |
| `sscma_begin_serial` | 语句块 | VAR(field_input), SERIAL(field_dropdown), RST(input_value), BAUD(input_value) | `"fields":{"VAR":"ai","SERIAL":"Serial1"},"inputs":{"RST":"2","BAUD":"115200"}` | `SSCMA ai; ai.begin(Serial1, 2, 115200);` |
| `sscma_begin_spi` | 语句块 | VAR(field_input), SPI(field_dropdown), CS(input_value), SYNC(input_value), RST(input_value), CLOCK(input_value) | `"fields":{"VAR":"ai","SPI":"SPI"},"inputs":{"CS":"10","SYNC":"5","RST":"2","CLOCK":"1000000"}` | `SSCMA ai; ai.begin(SPI, 10, 5, 2, 1000000);` |
| `sscma_invoke` | 值块 | VAR(field_variable), TIMES(field_number), FILTER(field_dropdown), SHOW(field_dropdown) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMA"},"TIMES":"1","FILTER":"true","SHOW":"false"}` | `ai.invoke(1, true, false)` |
| `sscma_get_boxes_count` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMA"}}` | `ai.boxes().size()` |
| `sscma_get_box_info` | 值块 | VAR(field_variable), INDEX(input_value), PROPERTY(field_dropdown) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMA"},"PROPERTY":"x"},"inputs":{"INDEX":"0"}` | `ai.boxes()[0].x` |
| `sscma_get_classes_count` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMA"}}` | `ai.classes().size()` |
| `sscma_get_class_info` | 值块 | VAR(field_variable), INDEX(input_value), PROPERTY(field_dropdown) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMA"},"PROPERTY":"score"},"inputs":{"INDEX":"0"}` | `ai.classes()[0].score` |
| `sscma_get_points_count` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMA"}}` | `ai.points().size()` |
| `sscma_get_point_info` | 值块 | VAR(field_variable), INDEX(input_value), PROPERTY(field_dropdown) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMA"},"PROPERTY":"x"},"inputs":{"INDEX":"0"}` | `ai.points()[0].x` |
| `sscma_check_last_image` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMA"}}` | `ai.last_image()` |
| `sscma_get_last_image` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMA"}}` | `ai.get_last_image()` |
| `sscma_get_performance` | 值块 | VAR(field_variable), STAGE(field_dropdown) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMA"},"STAGE":"inference"}` | `ai.perf().inference` |
| `sscma_available` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMA"}}` | `ai.available()` |
| `sscma_read` | 语句块 | VAR(field_variable), ARRAY(input_value), LENGTH(input_value) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMA"}},"inputs":{"ARRAY":"buffer","LENGTH":"10"}` | `ai.read(buffer, 10);` |
| `sscma_write` | 语句块 | VAR(field_variable), ARRAY(input_value), LENGTH(input_value) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMA"}},"inputs":{"ARRAY":"data","LENGTH":"5"}` | `ai.write(data, 5);` |
| `sscma_get_device_id` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMA"}}` | `ai.ID()` |
| `sscma_get_device_name` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMA"}}` | `ai.name()` |
| `sscma_get_device_info` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMA"}}` | `ai.info()` |
| `sscma_reset` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMA"}}` | `ai.reset();` |
| `sscma_save_jpeg` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMA"}}` | `ai.save_jpeg();` |
| `sscma_clean_actions` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMA"}}` | `ai.clean();` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_variable | SSCMA变量对象 | `"VAR": {"id": "ai_id", "name": "ai", "type": "SSCMA"}` |
| field_input | 字符串 | `"VAR": "ai"` |
| field_dropdown | 字符串 | `"WIRE": "Wire", "SERIAL": "Serial1"` |
| field_number | 数值字符串 | `"TIMES": "1"` |
| input_value | 连接的值块 | `"RST": "2", "ADDRESS": "0x62"` |

## 连接规则

- **语句块**: 初始化块和控制块有previousStatement/nextStatement，通过`next`字段连接
- **值块**: AI功能块和信息获取块有output，连接到`inputs`中
- **特殊规则**: 
  - SSCMA变量类型为"SSCMA"，每个实例独立管理
  - 初始化块生成库包含、变量定义和setup初始化
  - 功能块直接调用SSCMA实例方法

## 使用示例

### I2C接口初始化
```json
{
  "type": "sscma_begin_i2c",
  "id": "sscma_init",
  "fields": {"VAR": "ai", "WIRE": "Wire"},
  "inputs": {
    "RST": {"block": {"type": "math_number", "fields": {"NUM": "2"}}},
    "ADDRESS": {"block": {"type": "math_number", "fields": {"NUM": "0x62"}}}
  }
}
```

### AI推理执行
```json
{
  "type": "variables_set",
  "id": "set_result",
  "fields": {"VAR": {"id": "result_var", "name": "result", "type": "Number"}},
  "inputs": {
    "VALUE": {
      "block": {
        "type": "sscma_invoke",
        "fields": {"VAR": {"id": "ai_var", "name": "ai", "type": "SSCMA"}, "TIMES": "1", "FILTER": "true", "SHOW": "false"}
      }
    }
  }
}
```

### 目标检测结果获取
```json
{
  "type": "controls_if",
  "id": "check_boxes",
  "inputs": {
    "IF0": {
      "block": {
        "type": "logic_compare",
        "fields": {"OP": "GT"},
        "inputs": {
          "A": {"block": {"type": "sscma_get_boxes_count", "fields": {"VAR": {"id": "ai_var", "name": "ai", "type": "SSCMA"}}}},
          "B": {"block": {"type": "math_number", "fields": {"NUM": "0"}}}
        }
      }
    },
    "DO0": {
      "block": {
        "type": "serial_print",
        "inputs": {
          "CONTENT": {
            "block": {
              "type": "sscma_get_box_info",
              "fields": {"VAR": {"id": "ai_var", "name": "ai", "type": "SSCMA"}, "PROPERTY": "x"},
              "inputs": {"INDEX": {"block": {"type": "math_number", "fields": {"NUM": "0"}}}}
            }
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: SSCMA模块需要在setup()中初始化，选择合适的通信接口（I2C/Serial/SPI）
2. **连接限制**: 初始化块是语句块必须在setup区域，功能块是值块可用于表达式
3. **变量管理**: 每个SSCMA实例使用独立的SSCMA类型变量，支持多模块同时使用
4. **常见错误**: ❌ 未初始化直接调用，❌ 数组索引越界，❌ 变量类型不匹配，❌ 接口参数配置错误
# 74HC595

74HC595移位寄存器IO扩展库

## 库信息
- **库名**: @aily-project/lib-shiftregister
- **版本**: 1.0.0
- **兼容**: Arduino UNO、MEGA、ESP8266、ESP32等开发板

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `74hc595_create` | 语句块 | VAR(field_input), HCNUMBER(input_value), HCDATA_PIN(field_dropdown), HCCLOCK_PIN(field_dropdown), HCLATCH_PIN(field_dropdown) | `"fields":{"VAR":"hc1","HCDATA_PIN":"2","HCCLOCK_PIN":"3","HCLATCH_PIN":"4"},"inputs":{"HCNUMBER":{"block":{"type":"math_number","fields":{"NUM":"1"}}}}` | `ShiftRegister74HC595<1> hc1(2, 3, 4);` |
| `74hc595_set` | 语句块 | VAR(field_variable), HCPIN(input_value), VALUE(field_dropdown) | `"fields":{"VAR":{"id":"hc_id","name":"hc1","type":"HC"},"VALUE":"HIGH"},"inputs":{"HCPIN":{"block":{"type":"math_number","fields":{"NUM":"0"}}}}` | `hc1.set(0, HIGH);` |
| `74hc595_setAll` | 语句块 | VAR(field_variable), ALLSTATE(field_dropdown) | `"fields":{"VAR":{"id":"hc_id","name":"hc1","type":"HC"},"ALLSTATE":"High"}` | `hc1.setAllHigh();` |
| `74hc595_setAllBin` | 语句块 | VAR(field_variable), HCARRAY(field_input) | `"fields":{"VAR":{"id":"hc_id","name":"hc1","type":"HC"},"HCARRAY":"arrayname"}` | `hc1.setAll(arrayname);` |
| `74hc595_getstate` | 语句块 | VAR(field_variable), HCOUTPSTATE(input_value) | `"fields":{"VAR":{"id":"hc_id","name":"hc1","type":"HC"}},"inputs":{"HCOUTPSTATE":{"block":{"type":"math_number","fields":{"NUM":"0"}}}}` | `hc1.get(0);` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "hc1"` |
| field_variable | HC变量对象 | `"VAR": {"id": "hc_id", "name": "hc1", "type": "HC"}` |
| field_dropdown | 字符串 | `"VALUE": "HIGH"` |
| input_value | 块连接 | `"inputs": {"HCNUMBER": {"block": {...}}}` |

## 连接规则

- **语句块**: 所有块都有previousStatement/nextStatement，通过`next`字段连接
- **特殊规则**: 
  - HC变量类型为"HC"，每个74HC595实例独立管理
  - 74hc595_create生成库包含、变量定义和初始化
  - 控制块需要引用已创建的HC类型变量
  - 支持级联多个74HC595芯片

## 使用示例

### 74HC595初始化
```json
{
  "type": "74hc595_create",
  "id": "hc595_setup",
  "fields": {
    "VAR": "hc1",
    "HCDATA_PIN": "2",
    "HCCLOCK_PIN": "3", 
    "HCLATCH_PIN": "4"
  },
  "inputs": {
    "HCNUMBER": {"block": {"type": "math_number", "fields": {"NUM": "1"}}}
  }
}
```

### 设置单个引脚
```json
{
  "type": "74hc595_set",
  "id": "set_pin",
  "fields": {
    "VAR": {"id": "hc_var", "name": "hc1", "type": "HC"},
    "VALUE": "HIGH"
  },
  "inputs": {
    "HCPIN": {"block": {"type": "math_number", "fields": {"NUM": "0"}}}
  }
}
```

### 全部引脚控制
```json
{
  "type": "74hc595_setAll",
  "id": "set_all_pins",
  "fields": {
    "VAR": {"id": "hc_var", "name": "hc1", "type": "HC"},
    "ALLSTATE": "Low"
  }
}
```

## 重要规则

1. **必须遵守**: 74HC595必须先初始化再使用，数据、时钟、锁存引脚不能重复
2. **连接限制**: 所有控制块都是语句块，必须在初始化块之后使用
3. **变量管理**: 每个74HC595实例使用独立的HC类型变量，支持多芯片级联
4. **常见错误**: ❌ 未初始化直接控制，❌ 引脚冲突，❌ 变量类型不匹配，❌ 超出芯片引脚数量范围

## 支持的字段选项
- **HCDATA_PIN/HCCLOCK_PIN/HCLATCH_PIN**: 0-255（数字I/O引脚）
- **VALUE**: "HIGH", "LOW"（引脚电平状态）
- **ALLSTATE**: "High", "Low"（全部引脚状态）
- **HCNUMBER**: 1-8（级联芯片数量，建议不超过8个）
- **变量类型**: "HC"（专用类型，用于74HC595实例）

## 技术规格
- **芯片型号**: 74HC595串行输入/并行输出移位寄存器
- **输出引脚**: 每个芯片8个数字输出引脚（Q0-Q7）
- **级联支持**: 理论上无限级联，实际建议不超过8个芯片
- **工作电压**: 3.3V-5V兼容
- **控制引脚**: 数据引脚(DS)、时钟引脚(SHCP)、锁存引脚(STCP)
- **输出电流**: 每个引脚最大35mA，总输出电流不超过70mA
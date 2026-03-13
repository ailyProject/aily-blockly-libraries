# ArduinoJson

ArduinoJson库，支持JSON数据的解析和生成

## Library Info
- **Name**: @aily-project/lib-arduinojson
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `json_document_init` | Statement | NAME(field_input) | `json_document_init("doc")` | `JsonDocument` |
| `json_document_add_value` | Statement | VAR(field_variable), KEY(field_input), VALUE(input_value) | `json_document_add_value($doc, "key", math_number(0))` | (dynamic code) |
| `json_document_add_array` | Statement | VAR(field_variable), ARRAY_NAME(field_input) | `json_document_add_array($doc, "array")` | `JsonArray` |
| `json_document_add_array_value` | Statement | VAR(field_variable), VALUE(input_value) | `json_document_add_array_value($array, math_number(0))` | (dynamic code) |
| `json_document_get_value` | Value | VAR(field_variable), KEY(field_input) | `json_document_get_value($doc, "key")` | (dynamic code) |
| `json_document_get_value_type` | Value | VAR(field_variable), KEY(field_input), TYPE(dropdown) | `json_document_get_value_type($doc, "key", bool)` | (dynamic code) |
| `json_document_get_array` | Value | VAR(field_variable), ARRAY_NAME(field_input), INDEX(input_value) | `json_document_get_array($doc, "array", math_number(0))` | (dynamic code) |
| `json_document_serialize_to_somewhere` | Statement | VAR(field_variable), OUTPUT(input_value) | `json_document_serialize_to_somewhere($doc, math_number(0))` | `serializeJson(` |
| `json_document_deserialize_from_somewhere` | Statement | VAR(field_input), INPUT(input_value) | `json_document_deserialize_from_somewhere("doc", math_number(0))` | `JsonDocument` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | bool, int, unsigned int, long, unsigned long, float, double, const char*, String, JsonArrayConst, JsonObjectConst | 布尔值 / 整数 / 无符号整数 / 长整数 / 无符号长整数 / 浮点数 / 双精度浮点数 / 字符串 / String对象 / JSON数组 / JSON对象 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    json_document_init("doc")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, json_document_get_value($doc, "key"))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

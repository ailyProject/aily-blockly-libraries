# ESP32看门狗

适用于ESP32的任务看门狗定时器库，支持任务和用户级别的看门狗监控

## Library Info
- **Name**: @aily-project/lib-esp32-wdt
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wdt_init` | Statement | TIMEOUT(field_number), PANIC(field_checkbox) | `wdt_init(5, FALSE)` | (dynamic code) |
| `wdt_add_task` | Statement | (none) | `wdt_add_task()` | `ESP_ERROR_CHECK(esp_task_wdt_add(NULL));\n` |
| `wdt_reset` | Statement | (none) | `wdt_reset()` | `esp_task_wdt_reset();\n` |
| `wdt_add_user` | Statement | USER_NAME(input_value) | `wdt_add_user(math_number(0))` | `ESP_ERROR_CHECK(esp_task_wdt_add_user(..., &wdt_user_handle_...));\n` |
| `wdt_reset_user` | Statement | USER_NAME(input_value) | `wdt_reset_user(math_number(0))` | `esp_task_wdt_reset_user(wdt_user_handle_...);\n` |
| `wdt_delete_task` | Statement | (none) | `wdt_delete_task()` | `ESP_ERROR_CHECK(esp_task_wdt_delete(NULL));\n` |
| `wdt_delete_user` | Statement | USER_NAME(input_value) | `wdt_delete_user(math_number(0))` | `ESP_ERROR_CHECK(esp_task_wdt_delete_user(wdt_user_handle_...));\n` |
| `wdt_deinit` | Statement | (none) | `wdt_deinit()` | `ESP_ERROR_CHECK(esp_task_wdt_deinit());\n` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    wdt_init(5, FALSE)
    wdt_deinit()
    serial_begin(Serial, 9600)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

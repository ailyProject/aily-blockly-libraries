# 待办事项 (TodoList)

TFT待办事项列表模块，支持NVS持久化存储和WiFi Web编辑。全局单例`Todo`。

## Library Info
- **Name**: @aily-project/lib-todolist
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `todo_load` | Statement | (none) | `todo_load()` | `Todo.load();` |
| `todo_show` | Statement | (none) | `todo_show()` | `Todo.show();` |
| `todo_handle_btns` | Statement | (none) | `todo_handle_btns()` | `Todo.handleBtns();` |
| `todo_start_server` | Statement | PORT(input_value) | `todo_start_server(math_number(8081))` | `Todo.startServer(8081);` |
| `todo_handle_client` | Statement | (none) | `todo_handle_client()` | `Todo.handleClient();` |
| `todo_needs_redraw` | Value (Boolean) | (none) | `todo_needs_redraw()` | `Todo.needsRedraw()` |

## ABS Examples

### Complete Usage

```
arduino_setup()
    todo_load()

arduino_loop()
    controls_if()
        @IF0: ws_is_wifi_connected()
        @DO0:
            todo_handle_client()
    controls_if()
        @IF0: logic_compare(ui_page_current(), EQ, math_number(5))
        @DO0:
            todo_show()
    controls_if()
        @IF0: logic_compare(ui_page_current(), EQ, math_number(5))
        @DO0:
            todo_handle_btns()
```

## Notes

1. **全局对象**: 库自动声明全局对象`Todo`，所有块直接使用
2. **依赖**: 需要`lib-ui-animation`（全局`UI`和`u8f`对象）、WiFi、Preferences
3. **容量**: 最多12条待办，每条30字符
4. **存储**: 数据保存在NVS Flash，断电不丢失
5. **Web服务**: 需在WiFi连接后调用`todo_start_server`，默认端口8081
6. **按键**: 上/下选择待办，A键(BTN4)切换完成状态

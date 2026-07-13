# 待办事项 (TodoList)

TFT待办事项列表，支持NVS持久化和Web编辑。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-todolist |
| Version | 1.0.0 |
| Author | ailyProject |

## Supported Boards

ESP32系列（需TFT_eSPI + UI Animation + WiFi）

## Quick Start

setup中调用`todo_load()`，WiFi连接后调用`todo_start_server(8081)`，loop中调用`todo_handle_client()`和`todo_handle_btns()`。

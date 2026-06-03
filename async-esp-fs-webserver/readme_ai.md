# ESP32 async filesystem web server

ESP32-only Blockly wrapper for AsyncFsWebServer.

## Library Info
- **Name**: @aily-project/lib-async-esp-fs-webserver
- **Version**: 1.0.0
- **Target**: ESP32

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `async_fs_webserver_create` | S | VAR, FS, PORT, HOST | `async_fs_webserver_create(...)` | object |
| `async_fs_webserver_mount_fs` | S | VAR, FS, FORMAT | `async_fs_webserver_mount_fs(...)` | fs begin |
| `async_fs_webserver_print_files` | S | VAR, FS, DIR, LEVELS | `async_fs_webserver_print_files(...)` | list fs |
| `async_fs_webserver_connect_or_ap` | S | VAR, TIMEOUT, SSID, PASSWORD, REDIRECT | `async_fs_webserver_connect_or_ap(...)` | WiFi/AP |
| `async_fs_webserver_start_wifi` | S | VAR, TIMEOUT | `async_fs_webserver_start_wifi(...)` | WiFi |
| `async_fs_webserver_captive_portal` | S | VAR, SSID, PASSWORD, REDIRECT | `async_fs_webserver_captive_portal(...)` | AP |
| `async_fs_webserver_start_server` | S | VAR | `async_fs_webserver_start_server(...)` | init |
| `async_fs_webserver_start_ws_server` | S | VAR, HANDLER | `async_fs_webserver_start_ws_server(...) @HANDLER` | init ws |
| `async_fs_webserver_file_editor` | S | VAR | `async_fs_webserver_file_editor(...)` | /edit |
| `async_fs_webserver_set_auth` | S | VAR, USER, PASSWORD | `async_fs_webserver_set_auth(...)` | auth |
| `async_fs_webserver_require_auth` | S | VAR, REQUIRE | `async_fs_webserver_require_auth(...)` | auth all |
| `async_fs_webserver_page_title` | S | VAR, TITLE | `async_fs_webserver_page_title(...)` | title |
| `async_fs_webserver_firmware_version` | S | VAR, VERSION | `async_fs_webserver_firmware_version(...)` | version |
| `async_fs_webserver_option_box` | S | VAR, TITLE | `async_fs_webserver_option_box(...)` | group |
| `async_fs_webserver_option_text` | S | VAR, LABEL, VALUE | `async_fs_webserver_option_text(...)` | text opt |
| `async_fs_webserver_option_number` | S | VAR, LABEL, VALUE, MIN, MAX, STEP | `async_fs_webserver_option_number(...)` | num opt |
| `async_fs_webserver_option_bool` | S | VAR, LABEL, VALUE | `async_fs_webserver_option_bool(...)` | bool opt |
| `async_fs_webserver_option_comment` | S | VAR, LABEL, COMMENT | `async_fs_webserver_option_comment(...)` | comment |
| `async_fs_webserver_route` | S | VAR, PATH, METHOD, HANDLER | `async_fs_webserver_route(...) @HANDLER` | route |
| `async_fs_webserver_response` | S | STATUS, CONTENT_TYPE, BODY | `async_fs_webserver_response(...)` | send |
| `async_fs_webserver_response_ok` | S | none | `async_fs_webserver_response_ok()` | OK |
| `async_fs_webserver_request_arg` | V | NAME, SOURCE | `async_fs_webserver_request_arg(...)` | arg |
| `async_fs_webserver_request_has_arg` | V | NAME, SOURCE | `async_fs_webserver_request_has_arg(...)` | has arg |
| `async_fs_webserver_request_path` | V | none | `async_fs_webserver_request_path()` | url |
| `async_fs_webserver_ws_broadcast` | S | VAR, MESSAGE | `async_fs_webserver_ws_broadcast(...)` | broadcast |
| `async_fs_webserver_ws_reply` | S | MESSAGE | `async_fs_webserver_ws_reply(...)` | reply |
| `async_fs_webserver_ws_event_is` | V | EVENT | `async_fs_webserver_ws_event_is(...)` | event |
| `async_fs_webserver_ws_message` | V | none | `async_fs_webserver_ws_message()` | msg |
| `async_fs_webserver_ws_client_id` | V | none | `async_fs_webserver_ws_client_id()` | id |
| `async_fs_webserver_server_ip` | V | VAR | `async_fs_webserver_server_ip(...)` | IP |
| `async_fs_webserver_is_ap_mode` | V | VAR | `async_fs_webserver_is_ap_mode(...)` | AP? |
| `async_fs_webserver_start_mdns` | S | VAR | `async_fs_webserver_start_mdns(...)` | mDNS |
| `async_fs_webserver_clear_saved_settings` | S | VAR | `async_fs_webserver_clear_saved_settings(...)` | clear |
| `async_fs_webserver_settings_file_name` | V | VAR | `async_fs_webserver_settings_file_name(...)` | path |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FS | `LittleFS`, `SPIFFS`, `FFat` | Filesystem object. |
| METHOD | `HTTP_GET`, `HTTP_POST`, `HTTP_PUT`, `HTTP_DELETE`, `HTTP_ANY` | Route method. |
| SOURCE | `false`, `true` | Query or POST form data. |
| EVENT | `WS_EVT_CONNECT`, `WS_EVT_DISCONNECT`, `WS_EVT_DATA`, `WS_EVT_ERROR` | WebSocket event. |

Route request/response blocks must be nested in `async_fs_webserver_route`. WebSocket reply/message/event blocks must be nested in `async_fs_webserver_start_ws_server`.
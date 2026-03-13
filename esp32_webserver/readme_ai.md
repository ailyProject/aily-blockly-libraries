# ESP32 Web服务器

ESP32 Web服务器库，支持HTTP服务端、路由处理、请求响应和身份认证

## Library Info
- **Name**: @aily-project/lib-esp32-webserver
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_webserver_create` | Statement | VAR(field_input), PORT(field_number) | `esp32_webserver_create("server", 80)` | `` |
| `esp32_webserver_begin` | Statement | VAR(field_variable) | `esp32_webserver_begin($server)` | (dynamic code) |
| `esp32_webserver_stop` | Statement | VAR(field_variable) | `esp32_webserver_stop($server)` | (dynamic code) |
| `esp32_webserver_handle_client` | Statement | VAR(field_variable) | `esp32_webserver_handle_client($server)` | (dynamic code) |
| `esp32_webserver_on` | Statement | VAR(field_variable), METHOD(dropdown), PATH(input_value) | `esp32_webserver_on($server, HTTP_ANY, math_number(0))` | `` |
| `esp32_webserver_on_not_found` | Statement | VAR(field_variable) | `esp32_webserver_on_not_found($server)` | `` |
| `esp32_webserver_send` | Statement | VAR(field_variable), CODE(input_value), TYPE(input_value), CONTENT(input_value) | `esp32_webserver_send($server, math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `esp32_webserver_send_simple` | Statement | VAR(field_variable), CONTENT(input_value) | `esp32_webserver_send_simple($server, math_number(0))` | (dynamic code) |
| `esp32_webserver_send_html` | Statement | VAR(field_variable), CONTENT(input_value) | `esp32_webserver_send_html($server, math_number(0))` | (dynamic code) |
| `esp32_webserver_send_json` | Statement | VAR(field_variable), CONTENT(input_value) | `esp32_webserver_send_json($server, math_number(0))` | (dynamic code) |
| `esp32_webserver_send_error` | Statement | VAR(field_variable), CODE(dropdown), MESSAGE(input_value) | `esp32_webserver_send_error($server, 400, text("hello"))` | (dynamic code) |
| `esp32_webserver_send_header` | Statement | VAR(field_variable), NAME(input_value), VALUE(input_value) | `esp32_webserver_send_header($server, math_number(0), math_number(0))` | (dynamic code) |
| `esp32_webserver_uri` | Value | VAR(field_variable) | `esp32_webserver_uri($server)` | (dynamic code) |
| `esp32_webserver_method` | Value | VAR(field_variable) | `esp32_webserver_method($server)` | `GET` |
| `esp32_webserver_arg` | Value | VAR(field_variable), NAME(input_value) | `esp32_webserver_arg($server, math_number(0))` | (dynamic code) |
| `esp32_webserver_has_arg` | Value | VAR(field_variable), NAME(input_value) | `esp32_webserver_has_arg($server, math_number(0))` | (dynamic code) |
| `esp32_webserver_args_count` | Value | VAR(field_variable) | `esp32_webserver_args_count($server)` | (dynamic code) |
| `esp32_webserver_arg_by_index` | Value | VAR(field_variable), INDEX(input_value) | `esp32_webserver_arg_by_index($server, math_number(0))` | (dynamic code) |
| `esp32_webserver_arg_name` | Value | VAR(field_variable), INDEX(input_value) | `esp32_webserver_arg_name($server, math_number(0))` | (dynamic code) |
| `esp32_webserver_header` | Value | VAR(field_variable), NAME(input_value) | `esp32_webserver_header($server, math_number(0))` | (dynamic code) |
| `esp32_webserver_has_header` | Value | VAR(field_variable), NAME(input_value) | `esp32_webserver_has_header($server, math_number(0))` | (dynamic code) |
| `esp32_webserver_collect_headers` | Statement | VAR(field_variable) | `esp32_webserver_collect_headers($server)` | (dynamic code) |
| `esp32_webserver_host_header` | Value | VAR(field_variable) | `esp32_webserver_host_header($server)` | (dynamic code) |
| `esp32_webserver_path_arg` | Value | VAR(field_variable), INDEX(input_value) | `esp32_webserver_path_arg($server, math_number(0))` | (dynamic code) |
| `esp32_webserver_authenticate` | Value | VAR(field_variable), USERNAME(input_value), PASSWORD(input_value) | `esp32_webserver_authenticate($server, math_number(0), math_number(0))` | (dynamic code) |
| `esp32_webserver_request_authentication` | Statement | VAR(field_variable), METHOD(dropdown) | `esp32_webserver_request_authentication($server, BASIC_AUTH)` | (dynamic code) |
| `esp32_webserver_enable_cors` | Statement | VAR(field_variable), ENABLE(field_checkbox) | `esp32_webserver_enable_cors($server, TRUE)` | (dynamic code) |
| `esp32_webserver_client_ip` | Value | VAR(field_variable) | `esp32_webserver_client_ip($server)` | (dynamic code) |
| `esp32_webserver_content_length` | Value | VAR(field_variable) | `esp32_webserver_content_length($server)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| METHOD | HTTP_ANY, HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_DELETE, HTTP_PATCH, HTTP_OPTIONS | 任意方法 / GET / POST / PUT / DELETE / PATCH / OPTIONS |
| CODE | 400, 401, 403, 404, 500, 503 | 400 Bad Request / 401 Unauthorized / 403 Forbidden / 404 Not Found / 500 Internal Server Error / 503 Service Unavailable |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_webserver_create("server", 80)
    esp32_webserver_begin($server)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_webserver_uri($server))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `esp32_webserver_create("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

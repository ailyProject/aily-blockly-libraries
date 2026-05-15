# ESP32 web server

ESP32 web server library, supporting HTTP server, routing processing, request response and identity authentication

## Library Info
- **Name**: @aily-project/lib-esp32-webserver
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_webserver_create` | Statement | VAR(field_input), PORT(field_number) | `esp32_webserver_create("server", 80)` | Dynamic code |
| `esp32_webserver_begin` | Statement | VAR(field_variable) | `esp32_webserver_begin(variables_get($server))` | Dynamic code |
| `esp32_webserver_stop` | Statement | VAR(field_variable) | `esp32_webserver_stop(variables_get($server))` | Dynamic code |
| `esp32_webserver_handle_client` | Statement | VAR(field_variable) | `esp32_webserver_handle_client(variables_get($server))` | Dynamic code |
| `esp32_webserver_on` | Statement | VAR(field_variable), METHOD(dropdown), PATH(input_value), HANDLER(input_statement) | `esp32_webserver_on(variables_get($server), HTTP_ANY, text("value")) @HANDLER: child_block()` | Dynamic code |
| `esp32_webserver_on_not_found` | Statement | VAR(field_variable), HANDLER(input_statement) | `esp32_webserver_on_not_found(variables_get($server)) @HANDLER: child_block()` | Dynamic code |
| `esp32_webserver_send` | Statement | VAR(field_variable), CODE(input_value), TYPE(input_value), CONTENT(input_value) | `esp32_webserver_send(variables_get($server), math_number(0), text("value"), text("value"))` | Dynamic code |
| `esp32_webserver_send_simple` | Statement | VAR(field_variable), CONTENT(input_value) | `esp32_webserver_send_simple(variables_get($server), text("value"))` | Dynamic code |
| `esp32_webserver_send_html` | Statement | VAR(field_variable), CONTENT(input_value) | `esp32_webserver_send_html(variables_get($server), text("value"))` | Dynamic code |
| `esp32_webserver_send_json` | Statement | VAR(field_variable), CONTENT(input_value) | `esp32_webserver_send_json(variables_get($server), text("value"))` | Dynamic code |
| `esp32_webserver_send_error` | Statement | VAR(field_variable), CODE(dropdown), MESSAGE(input_value) | `esp32_webserver_send_error(variables_get($server), "400", text("value"))` | Dynamic code |
| `esp32_webserver_send_header` | Statement | VAR(field_variable), NAME(input_value), VALUE(input_value) | `esp32_webserver_send_header(variables_get($server), text("value"), text("value"))` | Dynamic code |
| `esp32_webserver_uri` | Value | VAR(field_variable) | `esp32_webserver_uri(variables_get($server))` | Dynamic code |
| `esp32_webserver_method` | Value | VAR(field_variable) | `esp32_webserver_method(variables_get($server))` | Dynamic code |
| `esp32_webserver_arg` | Value | VAR(field_variable), NAME(input_value) | `esp32_webserver_arg(variables_get($server), text("value"))` | Dynamic code |
| `esp32_webserver_has_arg` | Value | VAR(field_variable), NAME(input_value) | `esp32_webserver_has_arg(variables_get($server), text("value"))` | Dynamic code |
| `esp32_webserver_args_count` | Value | VAR(field_variable) | `esp32_webserver_args_count(variables_get($server))` | Dynamic code |
| `esp32_webserver_arg_by_index` | Value | VAR(field_variable), INDEX(input_value) | `esp32_webserver_arg_by_index(variables_get($server), math_number(0))` | Dynamic code |
| `esp32_webserver_arg_name` | Value | VAR(field_variable), INDEX(input_value) | `esp32_webserver_arg_name(variables_get($server), math_number(0))` | Dynamic code |
| `esp32_webserver_header` | Value | VAR(field_variable), NAME(input_value) | `esp32_webserver_header(variables_get($server), text("value"))` | Dynamic code |
| `esp32_webserver_has_header` | Value | VAR(field_variable), NAME(input_value) | `esp32_webserver_has_header(variables_get($server), text("value"))` | Dynamic code |
| `esp32_webserver_collect_headers` | Statement | VAR(field_variable) | `esp32_webserver_collect_headers(variables_get($server))` | Dynamic code |
| `esp32_webserver_host_header` | Value | VAR(field_variable) | `esp32_webserver_host_header(variables_get($server))` | Dynamic code |
| `esp32_webserver_path_arg` | Value | VAR(field_variable), INDEX(input_value) | `esp32_webserver_path_arg(variables_get($server), math_number(0))` | Dynamic code |
| `esp32_webserver_authenticate` | Value | VAR(field_variable), USERNAME(input_value), PASSWORD(input_value) | `esp32_webserver_authenticate(variables_get($server), text("value"), text("value"))` | Dynamic code |
| `esp32_webserver_request_authentication` | Statement | VAR(field_variable), METHOD(dropdown) | `esp32_webserver_request_authentication(variables_get($server), BASIC_AUTH)` | Dynamic code |
| `esp32_webserver_enable_cors` | Statement | VAR(field_variable), ENABLE(field_checkbox) | `esp32_webserver_enable_cors(variables_get($server), TRUE)` | Dynamic code |
| `esp32_webserver_client_ip` | Value | VAR(field_variable) | `esp32_webserver_client_ip(variables_get($server))` | Dynamic code |
| `esp32_webserver_content_length` | Value | VAR(field_variable) | `esp32_webserver_content_length(variables_get($server))` | Dynamic code |
| `esp32_webserver_serve_static` | Statement | VAR(field_variable), URI(input_value), FS(dropdown), PATH(input_value) | `esp32_webserver_serve_static(variables_get($server), text("value"), SPIFFS, text("value"))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| METHOD | HTTP_ANY, HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_DELETE, HTTP_PATCH, HTTP_OPTIONS | esp32_webserver_on |
| CODE | 400, 401, 403, 404, 500, 503 | esp32_webserver_send_error |
| METHOD | BASIC_AUTH, DIGEST_AUTH | esp32_webserver_request_authentication |
| FS | SPIFFS, LittleFS, SD | esp32_webserver_serve_static |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_webserver_create("server", 80)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_webserver_uri(variables_get($server)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `esp32_webserver_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

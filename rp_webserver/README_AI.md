# Pico Web Server

Raspberry Pi Pico W WebServer library for creating a simple web server to handle HTTP requests

## Library Info
- **Name**: @aily-project/lib-rp-webserver
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rp_webserver_create` | Statement | VAR(field_input), PORT(field_number) | `rp_webserver_create("server", 80)` | Dynamic code |
| `rp_webserver_begin` | Statement | VAR(field_variable) | `rp_webserver_begin(variables_get($server))` | Dynamic code |
| `rp_webserver_handle_client` | Statement | VAR(field_variable) | `rp_webserver_handle_client(variables_get($server))` | Dynamic code |
| `rp_webserver_on` | Hat | VAR(field_variable), METHOD(dropdown), PATH(input_value), HANDLER(input_statement) | `rp_webserver_on(variables_get($server), HTTP_ANY, text("value")) @HANDLER: child_block()` | Dynamic code |
| `rp_webserver_on_not_found` | Hat | VAR(field_variable), HANDLER(input_statement) | `rp_webserver_on_not_found(variables_get($server)) @HANDLER: child_block()` | Dynamic code |
| `rp_webserver_send` | Statement | VAR(field_variable), CODE(input_value), CONTENT_TYPE(dropdown), CONTENT(input_value) | `rp_webserver_send(variables_get($server), math_number(0), "text/plain", text("value"))` | Dynamic code |
| `rp_webserver_send_custom_type` | Statement | VAR(field_variable), CODE(input_value), CONTENT_TYPE(input_value), CONTENT(input_value) | `rp_webserver_send_custom_type(variables_get($server), math_number(0), text("value"), text("value"))` | Dynamic code |
| `rp_webserver_send_header` | Statement | VAR(field_variable), NAME(input_value), VALUE(input_value) | `rp_webserver_send_header(variables_get($server), text("value"), text("value"))` | Dynamic code |
| `rp_webserver_uri` | Value | VAR(field_variable) | `rp_webserver_uri(variables_get($server))` | Dynamic code |
| `rp_webserver_method` | Value | VAR(field_variable) | `rp_webserver_method(variables_get($server))` | Dynamic code |
| `rp_webserver_method_is` | Value | VAR(field_variable), METHOD(dropdown) | `rp_webserver_method_is(variables_get($server), HTTP_GET)` | Dynamic code |
| `rp_webserver_arg_by_name` | Value | VAR(field_variable), NAME(input_value) | `rp_webserver_arg_by_name(variables_get($server), text("value"))` | Dynamic code |
| `rp_webserver_arg_by_index` | Value | VAR(field_variable), INDEX(input_value) | `rp_webserver_arg_by_index(variables_get($server), math_number(0))` | Dynamic code |
| `rp_webserver_arg_name` | Value | VAR(field_variable), INDEX(input_value) | `rp_webserver_arg_name(variables_get($server), math_number(0))` | Dynamic code |
| `rp_webserver_args_count` | Value | VAR(field_variable) | `rp_webserver_args_count(variables_get($server))` | Dynamic code |
| `rp_webserver_has_arg` | Value | VAR(field_variable), NAME(input_value) | `rp_webserver_has_arg(variables_get($server), text("value"))` | Dynamic code |
| `rp_webserver_header` | Value | VAR(field_variable), NAME(input_value) | `rp_webserver_header(variables_get($server), text("value"))` | Dynamic code |
| `rp_webserver_has_header` | Value | VAR(field_variable), NAME(input_value) | `rp_webserver_has_header(variables_get($server), text("value"))` | Dynamic code |
| `rp_webserver_host_header` | Value | VAR(field_variable) | `rp_webserver_host_header(variables_get($server))` | Dynamic code |
| `rp_webserver_collect_headers` | Statement | VAR(field_variable), HEADERS(input_value) | `rp_webserver_collect_headers(variables_get($server), text("value"))` | Dynamic code |
| `rp_webserver_enable_cors` | Statement | VAR(field_variable) | `rp_webserver_enable_cors(variables_get($server))` | Dynamic code |
| `rp_webserver_stop` | Statement | VAR(field_variable) | `rp_webserver_stop(variables_get($server))` | Dynamic code |
| `rp_webserver_authenticate` | Value | VAR(field_variable), USERNAME(input_value), PASSWORD(input_value) | `rp_webserver_authenticate(variables_get($server), text("value"), text("value"))` | Dynamic code |
| `rp_webserver_request_authentication` | Statement | VAR(field_variable), REALM(input_value) | `rp_webserver_request_authentication(variables_get($server), text("value"))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| METHOD | HTTP_ANY, HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_DELETE, HTTP_PATCH | rp_webserver_on |
| CONTENT_TYPE | text/plain, text/html, application/json, application/xml | rp_webserver_send |
| METHOD | HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_DELETE, HTTP_PATCH | rp_webserver_method_is |

## ABS Examples

### Basic Usage
```
arduino_setup()
    rp_webserver_create("server", 80)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, rp_webserver_uri(variables_get($server)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `rp_webserver_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

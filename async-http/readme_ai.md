# Asynchronous HTTP client

Non-blocking asynchronous HTTP client library, supports GET/POST/PUT/DELETE requests, callback design does not block loop()

## Library Info
- **Name**: @aily-project/lib-async-http
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `async_http_create` | Statement | VAR(field_input) | `async_http_create("http")` | Dynamic code |
| `async_http_set_timeout` | Statement | VAR(field_variable), TIMEOUT(input_value) | `async_http_set_timeout(variables_get($http), math_number(1000))` | Dynamic code |
| `async_http_set_header` | Statement | VAR(field_variable), NAME(input_value), VALUE(input_value) | `async_http_set_header(variables_get($http), text("value"), text("value"))` | Dynamic code |
| `async_http_clear_headers` | Statement | VAR(field_variable) | `async_http_clear_headers(variables_get($http))` | Dynamic code |
| `async_http_get` | Statement | VAR(field_variable), URL(input_value), HANDLER(input_statement) | `async_http_get(variables_get($http), text("value")) @HANDLER: child_block()` | Dynamic code |
| `async_http_post_json` | Statement | VAR(field_variable), URL(input_value), BODY(input_value), HANDLER(input_statement) | `async_http_post_json(variables_get($http), text("value"), text("value")) @HANDLER: child_block()` | Dynamic code |
| `async_http_post` | Statement | VAR(field_variable), URL(input_value), BODY(input_value), CONTENT_TYPE(input_value), HANDLER(input_statement) | `async_http_post(variables_get($http), text("value"), text("value"), text("value")) @HANDLER: child_block()` | Dynamic code |
| `async_http_put_json` | Statement | VAR(field_variable), URL(input_value), BODY(input_value), HANDLER(input_statement) | `async_http_put_json(variables_get($http), text("value"), text("value")) @HANDLER: child_block()` | Dynamic code |
| `async_http_del` | Statement | VAR(field_variable), URL(input_value), HANDLER(input_statement) | `async_http_del(variables_get($http), text("value")) @HANDLER: child_block()` | Dynamic code |
| `async_http_on_error` | Hat | VAR(field_variable), HANDLER(input_statement) | `async_http_on_error(variables_get($http)) @HANDLER: child_block()` | Dynamic code |
| `async_http_response_status` | Value | (none) | `async_http_response_status()` | _asynchttp_response.statusCode() |
| `async_http_response_body` | Value | (none) | `async_http_response_body()` | _asynchttp_response.body() |
| `async_http_response_is_success` | Value | (none) | `async_http_response_is_success()` | _asynchttp_response.isSuccess() |
| `async_http_response_header` | Value | NAME(input_value) | `async_http_response_header(text("value"))` | _asynchttp_response.header( |
| `async_http_error_code` | Value | (none) | `async_http_error_code()` | _asynchttp_err_code |
| `async_http_error_message` | Value | (none) | `async_http_error_message()` | _asynchttp_err_msg |
| `async_http_pending` | Value | VAR(field_variable) | `async_http_pending(variables_get($http))` | Dynamic code |
| `async_http_abort_all` | Statement | VAR(field_variable) | `async_http_abort_all(variables_get($http))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    async_http_create("http")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, async_http_response_status())
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `async_http_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

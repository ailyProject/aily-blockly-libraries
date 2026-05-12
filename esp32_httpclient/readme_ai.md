# ESP32 HTTPClient

ESP32 HTTP client library, supporting HTTP/HTTPS request and response processing

## Library Info
- **Name**: @aily-project/lib-esp32-httpclient
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_httpclient_create` | Statement | VAR(field_input) | `esp32_httpclient_create("http")` | HTTPClient |
| `esp32_httpclient_begin_url` | Statement | VAR(field_variable), URL(input_value) | `esp32_httpclient_begin_url(variables_get($http), text("value"))` | Dynamic code |
| `esp32_httpclient_begin_host` | Statement | VAR(field_variable), HOST(input_value), PORT(input_value), URI(input_value) | `esp32_httpclient_begin_host(variables_get($http), text("value"), math_number(0), text("value"))` | Dynamic code |
| `esp32_httpclient_begin_secure` | Statement | VAR(field_variable), URL(input_value), CA_CERT(input_value) | `esp32_httpclient_begin_secure(variables_get($http), text("value"), text("value"))` | Dynamic code |
| `esp32_httpclient_begin_secure_full` | Statement | VAR(field_variable), URL(input_value), CA_CERT(input_value), CLIENT_CERT(input_value), CLIENT_KEY(input_value) | `esp32_httpclient_begin_secure_full(variables_get($http), text("value"), text("value"), text("value"), text("value"))` | Dynamic code |
| `esp32_httpclient_end` | Statement | VAR(field_variable) | `esp32_httpclient_end(variables_get($http))` | Dynamic code |
| `esp32_httpclient_set_user_agent` | Statement | VAR(field_variable), USER_AGENT(input_value) | `esp32_httpclient_set_user_agent(variables_get($http), text("value"))` | Dynamic code |
| `esp32_httpclient_set_authorization` | Statement | VAR(field_variable), USER(input_value), PASSWORD(input_value) | `esp32_httpclient_set_authorization(variables_get($http), text("value"), text("value"))` | Dynamic code |
| `esp32_httpclient_set_authorization_token` | Statement | VAR(field_variable), TOKEN(input_value) | `esp32_httpclient_set_authorization_token(variables_get($http), text("value"))` | Dynamic code |
| `esp32_httpclient_set_timeout` | Statement | VAR(field_variable), TIMEOUT(input_value) | `esp32_httpclient_set_timeout(variables_get($http), math_number(1000))` | Dynamic code |
| `esp32_httpclient_set_connect_timeout` | Statement | VAR(field_variable), TIMEOUT(input_value) | `esp32_httpclient_set_connect_timeout(variables_get($http), math_number(1000))` | Dynamic code |
| `esp32_httpclient_set_reuse` | Statement | VAR(field_variable), REUSE(dropdown) | `esp32_httpclient_set_reuse(variables_get($http), true)` | Dynamic code |
| `esp32_httpclient_set_follow_redirects` | Statement | VAR(field_variable), FOLLOW(dropdown) | `esp32_httpclient_set_follow_redirects(variables_get($http), HTTPC_DISABLE_FOLLOW_REDIRECTS)` | Dynamic code |
| `esp32_httpclient_set_redirect_limit` | Statement | VAR(field_variable), LIMIT(input_value) | `esp32_httpclient_set_redirect_limit(variables_get($http), math_number(0))` | Dynamic code |
| `esp32_httpclient_add_header` | Statement | VAR(field_variable), NAME(input_value), VALUE(input_value) | `esp32_httpclient_add_header(variables_get($http), text("value"), text("value"))` | Dynamic code |
| `esp32_httpclient_get` | Statement | VAR(field_variable) | `esp32_httpclient_get(variables_get($http))` | int httpCode = |
| `esp32_httpclient_post` | Statement | VAR(field_variable), DATA(input_value) | `esp32_httpclient_post(variables_get($http), text("value"))` | int httpCode = |
| `esp32_httpclient_put` | Statement | VAR(field_variable), DATA(input_value) | `esp32_httpclient_put(variables_get($http), text("value"))` | int httpCode = |
| `esp32_httpclient_patch` | Statement | VAR(field_variable), DATA(input_value) | `esp32_httpclient_patch(variables_get($http), text("value"))` | int httpCode = |
| `esp32_httpclient_get_response_code` | Value | (none) | `esp32_httpclient_get_response_code()` | httpCode |
| `esp32_httpclient_code_list` | Value | CODE(dropdown) | `esp32_httpclient_code_list(HTTP_CODE_CONTINUE)` | Dynamic code |
| `esp32_httpclient_get_size` | Value | VAR(field_variable) | `esp32_httpclient_get_size(variables_get($http))` | Dynamic code |
| `esp32_httpclient_get_string` | Value | VAR(field_variable) | `esp32_httpclient_get_string(variables_get($http))` | Dynamic code |
| `esp32_httpclient_get_header` | Value | VAR(field_variable), NAME(input_value) | `esp32_httpclient_get_header(variables_get($http), text("value"))` | Dynamic code |
| `esp32_httpclient_get_location` | Value | VAR(field_variable) | `esp32_httpclient_get_location(variables_get($http))` | Dynamic code |
| `esp32_httpclient_get_stream` | Value | VAR(field_variable) | `esp32_httpclient_get_stream(variables_get($http))` | Dynamic code |
| `esp32_httpclient_connected` | Value | VAR(field_variable) | `esp32_httpclient_connected(variables_get($http))` | Dynamic code |
| `esp32_httpclient_error_to_string` | Value | VAR(field_variable), ERROR_CODE(input_value) | `esp32_httpclient_error_to_string(variables_get($http), math_number(0))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| REUSE | true, false | esp32_httpclient_set_reuse |
| FOLLOW | HTTPC_DISABLE_FOLLOW_REDIRECTS, HTTPC_STRICT_FOLLOW_REDIRECTS, HTTPC_FORCE_FOLLOW_REDIRECTS | esp32_httpclient_set_follow_redirects |
| CODE | HTTP_CODE_CONTINUE, HTTP_CODE_SWITCHING_PROTOCOLS, HTTP_CODE_PROCESSING, HTTP_CODE_OK, HTTP_CODE_CREATED, HTTP_CODE_ACCEPTED, HTTP_CODE_NON_AUTHORITATIVE_INFORMATION, HTTP_CODE_NO_CONTENT, HTTP_CODE_RESET_CONTENT, HTT... | esp32_httpclient_code_list |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_httpclient_create("http")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_httpclient_get_response_code())
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `esp32_httpclient_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

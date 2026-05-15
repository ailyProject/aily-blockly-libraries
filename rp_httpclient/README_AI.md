# Pico HTTPClient

Raspberry Pi Pico W HTTP client library, supports HTTP/HTTPS request and response processing

## Library Info
- **Name**: @aily-project/lib-rp-httpclient
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rp_httpclient_create` | Statement | VAR(field_input) | `rp_httpclient_create("http")` | HTTPClient |
| `rp_httpclient_begin_url` | Statement | VAR(field_variable), URL(input_value) | `rp_httpclient_begin_url(variables_get($http), text("value"))` | Dynamic code |
| `rp_httpclient_begin_host` | Statement | VAR(field_variable), HOST(input_value), PORT(input_value), URI(input_value) | `rp_httpclient_begin_host(variables_get($http), text("value"), math_number(0), text("value"))` | Dynamic code |
| `rp_httpclient_begin_https` | Statement | VAR(field_variable), URL(input_value) | `rp_httpclient_begin_https(variables_get($http), text("value"))` | Dynamic code |
| `rp_httpclient_end` | Statement | VAR(field_variable) | `rp_httpclient_end(variables_get($http))` | Dynamic code |
| `rp_httpclient_set_timeout` | Statement | VAR(field_variable), TIMEOUT(input_value) | `rp_httpclient_set_timeout(variables_get($http), math_number(1000))` | Dynamic code |
| `rp_httpclient_set_reuse` | Statement | VAR(field_variable), REUSE(dropdown) | `rp_httpclient_set_reuse(variables_get($http), true)` | Dynamic code |
| `rp_httpclient_set_user_agent` | Statement | VAR(field_variable), USER_AGENT(input_value) | `rp_httpclient_set_user_agent(variables_get($http), text("value"))` | Dynamic code |
| `rp_httpclient_set_authorization` | Statement | VAR(field_variable), USER(input_value), PASSWORD(input_value) | `rp_httpclient_set_authorization(variables_get($http), text("value"), text("value"))` | Dynamic code |
| `rp_httpclient_set_authorization_token` | Statement | VAR(field_variable), TOKEN(input_value) | `rp_httpclient_set_authorization_token(variables_get($http), text("value"))` | Dynamic code |
| `rp_httpclient_set_follow_redirects` | Statement | VAR(field_variable), FOLLOW(dropdown) | `rp_httpclient_set_follow_redirects(variables_get($http), HTTPC_DISABLE_FOLLOW_REDIRECTS)` | Dynamic code |
| `rp_httpclient_set_redirect_limit` | Statement | VAR(field_variable), LIMIT(input_value) | `rp_httpclient_set_redirect_limit(variables_get($http), math_number(0))` | Dynamic code |
| `rp_httpclient_add_header` | Statement | VAR(field_variable), NAME(input_value), VALUE(input_value) | `rp_httpclient_add_header(variables_get($http), text("value"), text("value"))` | Dynamic code |
| `rp_httpclient_get` | Statement | VAR(field_variable) | `rp_httpclient_get(variables_get($http))` | int httpCode = |
| `rp_httpclient_post` | Statement | VAR(field_variable), DATA(input_value) | `rp_httpclient_post(variables_get($http), text("value"))` | int httpCode = |
| `rp_httpclient_put` | Statement | VAR(field_variable), DATA(input_value) | `rp_httpclient_put(variables_get($http), text("value"))` | int httpCode = |
| `rp_httpclient_patch` | Statement | VAR(field_variable), DATA(input_value) | `rp_httpclient_patch(variables_get($http), text("value"))` | int httpCode = |
| `rp_httpclient_delete` | Statement | VAR(field_variable) | `rp_httpclient_delete(variables_get($http))` | int httpCode = |
| `rp_httpclient_get_response_code` | Value | (none) | `rp_httpclient_get_response_code()` | httpCode |
| `rp_httpclient_code_list` | Value | CODE(dropdown) | `rp_httpclient_code_list(HTTP_CODE_OK)` | Dynamic code |
| `rp_httpclient_get_size` | Value | VAR(field_variable) | `rp_httpclient_get_size(variables_get($http))` | Dynamic code |
| `rp_httpclient_get_string` | Value | VAR(field_variable) | `rp_httpclient_get_string(variables_get($http))` | Dynamic code |
| `rp_httpclient_get_header` | Value | VAR(field_variable), NAME(input_value) | `rp_httpclient_get_header(variables_get($http), text("value"))` | Dynamic code |
| `rp_httpclient_get_location` | Value | VAR(field_variable) | `rp_httpclient_get_location(variables_get($http))` | Dynamic code |
| `rp_httpclient_connected` | Value | VAR(field_variable) | `rp_httpclient_connected(variables_get($http))` | Dynamic code |
| `rp_httpclient_error_to_string` | Value | VAR(field_variable), ERROR_CODE(input_value) | `rp_httpclient_error_to_string(variables_get($http), math_number(0))` | Dynamic code |
| `rp_httpclient_quick_get` | Value | URL(input_value) | `rp_httpclient_quick_get(text("value"))` | httpQuickGet( |
| `rp_httpclient_quick_post` | Value | URL(input_value), DATA(input_value) | `rp_httpclient_quick_post(text("value"), text("value"))` | httpQuickPost( |
| `rp_httpclient_quick_post_json` | Value | URL(input_value), JSON(input_value) | `rp_httpclient_quick_post_json(text("value"), text("value"))` | httpQuickPostJson( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| REUSE | true, false | rp_httpclient_set_reuse |
| FOLLOW | HTTPC_DISABLE_FOLLOW_REDIRECTS, HTTPC_STRICT_FOLLOW_REDIRECTS, HTTPC_FORCE_FOLLOW_REDIRECTS | rp_httpclient_set_follow_redirects |
| CODE | HTTP_CODE_OK, HTTP_CODE_CREATED, HTTP_CODE_NO_CONTENT, HTTP_CODE_MOVED_PERMANENTLY, HTTP_CODE_FOUND, HTTP_CODE_NOT_MODIFIED, HTTP_CODE_BAD_REQUEST, HTTP_CODE_UNAUTHORIZED, HTTP_CODE_FORBIDDEN, HTTP_CODE_NOT_FOUND, HTT... | rp_httpclient_code_list |

## ABS Examples

### Basic Usage
```
arduino_setup()
    rp_httpclient_create("http")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, rp_httpclient_get_response_code())
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `rp_httpclient_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

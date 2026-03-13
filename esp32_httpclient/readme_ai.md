# ESP32 HTTPClient

ESP32 HTTP客户端库，支持HTTP/HTTPS请求和响应处理

## Library Info
- **Name**: @aily-project/lib-esp32-httpclient
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_httpclient_create` | Statement | VAR(field_input) | `esp32_httpclient_create("http")` | `HTTPClient` |
| `esp32_httpclient_begin_url` | Statement | VAR(field_variable), URL(input_value) | `esp32_httpclient_begin_url($http, math_number(0))` | (dynamic code) |
| `esp32_httpclient_begin_host` | Statement | VAR(field_variable), HOST(input_value), PORT(input_value), URI(input_value) | `esp32_httpclient_begin_host($http, math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `esp32_httpclient_begin_secure` | Statement | VAR(field_variable), URL(input_value), CA_CERT(input_value) | `esp32_httpclient_begin_secure($http, math_number(0), math_number(0))` | (dynamic code) |
| `esp32_httpclient_begin_secure_full` | Statement | VAR(field_variable), URL(input_value), CA_CERT(input_value), CLIENT_CERT(input_value), CLIENT_KEY(input_value) | `esp32_httpclient_begin_secure_full($http, math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `esp32_httpclient_end` | Statement | VAR(field_variable) | `esp32_httpclient_end($http)` | (dynamic code) |
| `esp32_httpclient_set_user_agent` | Statement | VAR(field_variable), USER_AGENT(input_value) | `esp32_httpclient_set_user_agent($http, math_number(0))` | (dynamic code) |
| `esp32_httpclient_set_authorization` | Statement | VAR(field_variable), USER(input_value), PASSWORD(input_value) | `esp32_httpclient_set_authorization($http, math_number(0), math_number(0))` | (dynamic code) |
| `esp32_httpclient_set_authorization_token` | Statement | VAR(field_variable), TOKEN(input_value) | `esp32_httpclient_set_authorization_token($http, math_number(0))` | (dynamic code) |
| `esp32_httpclient_set_timeout` | Statement | VAR(field_variable), TIMEOUT(input_value) | `esp32_httpclient_set_timeout($http, math_number(1000))` | (dynamic code) |
| `esp32_httpclient_set_connect_timeout` | Statement | VAR(field_variable), TIMEOUT(input_value) | `esp32_httpclient_set_connect_timeout($http, math_number(1000))` | (dynamic code) |
| `esp32_httpclient_set_reuse` | Statement | VAR(field_variable), REUSE(dropdown) | `esp32_httpclient_set_reuse($http, true)` | (dynamic code) |
| `esp32_httpclient_set_follow_redirects` | Statement | VAR(field_variable), FOLLOW(dropdown) | `esp32_httpclient_set_follow_redirects($http, HTTPC_DISABLE_FOLLOW_REDIRECTS)` | (dynamic code) |
| `esp32_httpclient_set_redirect_limit` | Statement | VAR(field_variable), LIMIT(input_value) | `esp32_httpclient_set_redirect_limit($http, math_number(0))` | (dynamic code) |
| `esp32_httpclient_add_header` | Statement | VAR(field_variable), NAME(input_value), VALUE(input_value) | `esp32_httpclient_add_header($http, math_number(0), math_number(0))` | (dynamic code) |
| `esp32_httpclient_get` | Statement | VAR(field_variable) | `esp32_httpclient_get($http)` | `int httpCode =` |
| `esp32_httpclient_post` | Statement | VAR(field_variable), DATA(input_value) | `esp32_httpclient_post($http, math_number(0))` | `int httpCode =` |
| `esp32_httpclient_put` | Statement | VAR(field_variable), DATA(input_value) | `esp32_httpclient_put($http, math_number(0))` | `int httpCode =` |
| `esp32_httpclient_patch` | Statement | VAR(field_variable), DATA(input_value) | `esp32_httpclient_patch($http, math_number(0))` | `int httpCode =` |
| `esp32_httpclient_get_response_code` | Value | (none) | `esp32_httpclient_get_response_code()` | `httpCode` |
| `esp32_httpclient_code_list` | Value | CODE(dropdown) | `esp32_httpclient_code_list(HTTP_CODE_CONTINUE)` | (dynamic code) |
| `esp32_httpclient_get_size` | Value | VAR(field_variable) | `esp32_httpclient_get_size($http)` | (dynamic code) |
| `esp32_httpclient_get_string` | Value | VAR(field_variable) | `esp32_httpclient_get_string($http)` | (dynamic code) |
| `esp32_httpclient_get_header` | Value | VAR(field_variable), NAME(input_value) | `esp32_httpclient_get_header($http, math_number(0))` | (dynamic code) |
| `esp32_httpclient_get_location` | Value | VAR(field_variable) | `esp32_httpclient_get_location($http)` | (dynamic code) |
| `esp32_httpclient_get_stream` | Value | VAR(field_variable) | `esp32_httpclient_get_stream($http)` | (dynamic code) |
| `esp32_httpclient_connected` | Value | VAR(field_variable) | `esp32_httpclient_connected($http)` | (dynamic code) |
| `esp32_httpclient_error_to_string` | Value | VAR(field_variable), ERROR_CODE(input_value) | `esp32_httpclient_error_to_string($http, math_number(0))` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| REUSE | true, false | 启用 / 禁用 |
| FOLLOW | HTTPC_DISABLE_FOLLOW_REDIRECTS, HTTPC_STRICT_FOLLOW_REDIRECTS, HTTPC_FORCE_FOLLOW_REDIRECTS | 禁用 / 严格 / 强制 |
| CODE | HTTP_CODE_CONTINUE, HTTP_CODE_SWITCHING_PROTOCOLS, HTTP_CODE_PROCESSING, HTTP_CODE_OK, HTTP_CODE_CREATED, HTTP_CODE_ACCEPTED, HTTP_CODE_NON_AUTHORITATIVE_INFORMATION, HTTP_CODE_NO_CONTENT, HTTP_CODE_RESET_CONTENT, HTTP_CODE_PARTIAL_CONTENT, HTTP_CODE_MULTI_STATUS, HTTP_CODE_ALREADY_REPORTED, HTTP_CODE_IM_USED, HTTP_CODE_MULTIPLE_CHOICES, HTTP_CODE_MOVED_PERMANENTLY, HTTP_CODE_FOUND, HTTP_CODE_SEE_OTHER, HTTP_CODE_NOT_MODIFIED, HTTP_CODE_USE_PROXY, HTTP_CODE_TEMPORARY_REDIRECT, HTTP_CODE_PERMANENT_REDIRECT, HTTP_CODE_BAD_REQUEST, HTTP_CODE_UNAUTHORIZED, HTTP_CODE_PAYMENT_REQUIRED, HTTP_CODE_FORBIDDEN, HTTP_CODE_NOT_FOUND, HTTP_CODE_METHOD_NOT_ALLOWED, HTTP_CODE_NOT_ACCEPTABLE, HTTP_CODE_PROXY_AUTHENTICATION_REQUIRED, HTTP_CODE_REQUEST_TIMEOUT, HTTP_CODE_CONFLICT, HTTP_CODE_GONE, HTTP_CODE_LENGTH_REQUIRED, HTTP_CODE_PRECONDITION_FAILED, HTTP_CODE_REQUEST_ENTITY_TOO_LARGE, HTTP_CODE_REQUEST_URI_TOO_LONG, HTTP_CODE_UNSUPPORTED_MEDIA_TYPE, HTTP_CODE_REQUESTED_RANGE_NOT_SATISFIABLE, HTTP_CODE_EXPECTATION_FAILED, HTTP_CODE_I_AM_A_TEAPOT, HTTP_CODE_MISDIRECTED_REQUEST, HTTP_CODE_UNPROCESSABLE_ENTITY, HTTP_CODE_LOCKED, HTTP_CODE_FAILED_DEPENDENCY, HTTP_CODE_TOO_EARLY, HTTP_CODE_UPGRADE_REQUIRED, HTTP_CODE_PRECONDITION_REQUIRED, HTTP_CODE_TOO_MANY_REQUESTS, HTTP_CODE_REQUEST_HEADER_FIELDS_TOO_LARGE, HTTP_CODE_INTERNAL_SERVER_ERROR, HTTP_CODE_NOT_IMPLEMENTED, HTTP_CODE_BAD_GATEWAY, HTTP_CODE_SERVICE_UNAVAILABLE, HTTP_CODE_GATEWAY_TIMEOUT, HTTP_CODE_HTTP_VERSION_NOT_SUPPORTED, HTTP_CODE_VARIANT_ALSO_NEGOTIATES, HTTP_CODE_INSUFFICIENT_STORAGE, HTTP_CODE_LOOP_DETECTED, HTTP_CODE_NOT_EXTENDED, HTTP_CODE_NETWORK_AUTHENTICATION_REQUIRED | HTTP_CODE_CONTINUE-100 / HTTP_CODE_SWITCHING_PROTOCOLS-101 / HTTP_CODE_PROCESSING-102 / HTTP_CODE_OK-200 / HTTP_CODE_CREATED-201 / HTTP_CODE_ACCEPTED-202 / HTTP_CODE_NON_AUTHORITATIVE_INFORMATION-203 / HTTP_CODE_NO_CONTENT-204 / HTTP_CODE_RESET_CONTENT-205 / HTTP_CODE_PARTIAL_CONTENT-206 / HTTP_CODE_MULTI_STATUS-207 / HTTP_CODE_ALREADY_REPORTED-208 / HTTP_CODE_IM_USED-226 / HTTP_CODE_MULTIPLE_CHOICES-300 / HTTP_CODE_MOVED_PERMANENTLY-301 / HTTP_CODE_FOUND-302 / HTTP_CODE_SEE_OTHER-303 / HTTP_CODE_NOT_MODIFIED-304 / HTTP_CODE_USE_PROXY-305 / HTTP_CODE_TEMPORARY_REDIRECT-307 / HTTP_CODE_PERMANENT_REDIRECT-308 / HTTP_CODE_BAD_REQUEST-400 / HTTP_CODE_UNAUTHORIZED-401 / HTTP_CODE_PAYMENT_REQUIRED-402 / HTTP_CODE_FORBIDDEN-403 / HTTP_CODE_NOT_FOUND-404 / HTTP_CODE_METHOD_NOT_ALLOWED-405 / HTTP_CODE_NOT_ACCEPTABLE-406 / HTTP_CODE_PROXY_AUTHENTICATION_REQUIRED-407 / HTTP_CODE_REQUEST_TIMEOUT-408 / HTTP_CODE_CONFLICT-409 / HTTP_CODE_GONE-410 / HTTP_CODE_LENGTH_REQUIRED-411 / HTTP_CODE_PRECONDITION_FAILED-412 / HTTP_CODE_REQUEST_ENTITY_TOO_LARGE-413 / HTTP_CODE_REQUEST_URI_TOO_LONG-414 / HTTP_CODE_UNSUPPORTED_MEDIA_TYPE-415 / HTTP_CODE_REQUESTED_RANGE_NOT_SATISFIABLE-416 / HTTP_CODE_EXPECTATION_FAILED-417 / HTTP_CODE_I_AM_A_TEAPOT-418 / HTTP_CODE_MISDIRECTED_REQUEST-421 / HTTP_CODE_UNPROCESSABLE_ENTITY-422 / HTTP_CODE_LOCKED-423 / HTTP_CODE_FAILED_DEPENDENCY-424 / HTTP_CODE_TOO_EARLY-425 / HTTP_CODE_UPGRADE_REQUIRED-426 / HTTP_CODE_PRECONDITION_REQUIRED-428 / HTTP_CODE_TOO_MANY_REQUESTS-429 / HTTP_CODE_REQUEST_HEADER_FIELDS_TOO_LARGE-431 / HTTP_CODE_INTERNAL_SERVER_ERROR-500 / HTTP_CODE_NOT_IMPLEMENTED-501 / HTTP_CODE_BAD_GATEWAY-502 / HTTP_CODE_SERVICE_UNAVAILABLE-503 / HTTP_CODE_GATEWAY_TIMEOUT-504 / HTTP_CODE_HTTP_VERSION_NOT_SUPPORTED-505 / HTTP_CODE_VARIANT_ALSO_NEGOTIATES-506 / HTTP_CODE_INSUFFICIENT_STORAGE-507 / HTTP_CODE_LOOP_DETECTED-508 / HTTP_CODE_NOT_EXTENDED-510 / HTTP_CODE_NETWORK_AUTHENTICATION_REQUIRED-511 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_httpclient_create("http")
    esp32_httpclient_begin_url($http, math_number(0))
    esp32_httpclient_begin_host($http, math_number(0), math_number(0), math_number(0))
    esp32_httpclient_begin_secure($http, math_number(0), math_number(0))
    esp32_httpclient_begin_secure_full($http, math_number(0), math_number(0), math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_httpclient_get_response_code())
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `esp32_httpclient_create("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

# ESP8266 HTTP Client

HTTP and HTTPS client blocks for ESP8266.

## Library Info
- **Name**: @aily-project/lib-esp8266-httpclient
- **Version**: 1.0.0
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_httpclient_create` | Statement | VAR(field_input) | `esp8266_httpclient_create(VAR)` | Dynamic code |
| `esp8266_httpclient_begin_url` | Statement | VAR(field_variable), URL(input_value) | `esp8266_httpclient_begin_url(VAR, URL)` | Dynamic code |
| `esp8266_httpclient_begin_host` | Statement | VAR(field_variable), HOST(input_value), PORT(input_value), URI(input_value) | `esp8266_httpclient_begin_host(VAR, HOST, PORT, URI)` | Dynamic code |
| `esp8266_httpclient_begin_secure` | Statement | VAR(field_variable), URL(input_value) | `esp8266_httpclient_begin_secure(VAR, URL)` | Dynamic code |
| `esp8266_httpclient_end` | Statement | VAR(field_variable) | `esp8266_httpclient_end(VAR)` | Dynamic code |
| `esp8266_httpclient_set_user_agent` | Statement | VAR(field_variable), USER_AGENT(input_value) | `esp8266_httpclient_set_user_agent(VAR, USER_AGENT)` | Dynamic code |
| `esp8266_httpclient_set_authorization` | Statement | VAR(field_variable), USER(input_value), PASSWORD(input_value) | `esp8266_httpclient_set_authorization(VAR, USER, PASSWORD)` | Dynamic code |
| `esp8266_httpclient_set_authorization_token` | Statement | VAR(field_variable), TOKEN(input_value) | `esp8266_httpclient_set_authorization_token(VAR, TOKEN)` | Dynamic code |
| `esp8266_httpclient_set_timeout` | Statement | VAR(field_variable), TIMEOUT(input_value) | `esp8266_httpclient_set_timeout(VAR, TIMEOUT)` | Dynamic code |
| `esp8266_httpclient_set_reuse` | Statement | VAR(field_variable), REUSE(field_dropdown) | `esp8266_httpclient_set_reuse(VAR, REUSE)` | Dynamic code |
| `esp8266_httpclient_set_follow_redirects` | Statement | VAR(field_variable), FOLLOW(field_dropdown) | `esp8266_httpclient_set_follow_redirects(VAR, FOLLOW)` | Dynamic code |
| `esp8266_httpclient_set_redirect_limit` | Statement | VAR(field_variable), LIMIT(input_value) | `esp8266_httpclient_set_redirect_limit(VAR, LIMIT)` | Dynamic code |
| `esp8266_httpclient_add_header` | Statement | VAR(field_variable), NAME(input_value), VALUE(input_value) | `esp8266_httpclient_add_header(VAR, NAME, VALUE)` | Dynamic code |
| `esp8266_httpclient_get` | Statement | VAR(field_variable) | `esp8266_httpclient_get(VAR)` | Dynamic code |
| `esp8266_httpclient_post` | Statement | VAR(field_variable), DATA(input_value) | `esp8266_httpclient_post(VAR, DATA)` | Dynamic code |
| `esp8266_httpclient_put` | Statement | VAR(field_variable), DATA(input_value) | `esp8266_httpclient_put(VAR, DATA)` | Dynamic code |
| `esp8266_httpclient_patch` | Statement | VAR(field_variable), DATA(input_value) | `esp8266_httpclient_patch(VAR, DATA)` | Dynamic code |
| `esp8266_httpclient_get_response_code` | Value | None | `esp8266_httpclient_get_response_code()` | Dynamic code |
| `esp8266_httpclient_code_list` | Value | CODE(field_dropdown) | `esp8266_httpclient_code_list(CODE)` | Dynamic code |
| `esp8266_httpclient_get_size` | Value | VAR(field_variable) | `esp8266_httpclient_get_size(VAR)` | Dynamic code |
| `esp8266_httpclient_get_string` | Value | VAR(field_variable) | `esp8266_httpclient_get_string(VAR)` | Dynamic code |
| `esp8266_httpclient_get_header` | Value | VAR(field_variable), NAME(input_value) | `esp8266_httpclient_get_header(VAR, NAME)` | Dynamic code |
| `esp8266_httpclient_get_location` | Value | VAR(field_variable) | `esp8266_httpclient_get_location(VAR)` | Dynamic code |
| `esp8266_httpclient_get_stream` | Value | VAR(field_variable) | `esp8266_httpclient_get_stream(VAR)` | Dynamic code |
| `esp8266_httpclient_connected` | Value | VAR(field_variable) | `esp8266_httpclient_connected(VAR)` | Dynamic code |
| `esp8266_httpclient_error_to_string` | Value | VAR(field_variable), ERROR_CODE(input_value) | `esp8266_httpclient_error_to_string(VAR, ERROR_CODE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_httpclient_set_reuse.REUSE | true, false | Selects the generated API option. |
| esp8266_httpclient_set_follow_redirects.FOLLOW | HTTPC_DISABLE_FOLLOW_REDIRECTS, HTTPC_STRICT_FOLLOW_REDIRECTS, HTTPC_FORCE_FOLLOW_REDIRECTS | Selects the generated API option. |
| esp8266_httpclient_code_list.CODE | HTTP_CODE_CONTINUE, HTTP_CODE_SWITCHING_PROTOCOLS, HTTP_CODE_PROCESSING, HTTP_CODE_OK, HTTP_CODE_CREATED, HTTP_CODE_ACCEPTED, HTTP_CODE_NON_AUTHORITATIVE_INFORMATION, HTTP_CODE_NO_CONTENT, HTTP_CODE_RESET_CONTENT, HTTP_CODE_PARTIAL_CONTENT, HTTP_CODE_MULTI_STATUS, HTTP_CODE_ALREADY_REPORTED, HTTP_CODE_IM_USED, HTTP_CODE_MULTIPLE_CHOICES, HTTP_CODE_MOVED_PERMANENTLY, HTTP_CODE_FOUND, HTTP_CODE_SEE_OTHER, HTTP_CODE_NOT_MODIFIED, HTTP_CODE_USE_PROXY, HTTP_CODE_TEMPORARY_REDIRECT, HTTP_CODE_PERMANENT_REDIRECT, HTTP_CODE_BAD_REQUEST, HTTP_CODE_UNAUTHORIZED, HTTP_CODE_PAYMENT_REQUIRED, HTTP_CODE_FORBIDDEN, HTTP_CODE_NOT_FOUND, HTTP_CODE_METHOD_NOT_ALLOWED, HTTP_CODE_NOT_ACCEPTABLE, HTTP_CODE_PROXY_AUTHENTICATION_REQUIRED, HTTP_CODE_REQUEST_TIMEOUT, HTTP_CODE_CONFLICT, HTTP_CODE_GONE, HTTP_CODE_LENGTH_REQUIRED, HTTP_CODE_PRECONDITION_FAILED, HTTP_CODE_REQUEST_ENTITY_TOO_LARGE, HTTP_CODE_REQUEST_URI_TOO_LONG, HTTP_CODE_UNSUPPORTED_MEDIA_TYPE, HTTP_CODE_REQUESTED_RANGE_NOT_SATISFIABLE, HTTP_CODE_EXPECTATION_FAILED, HTTP_CODE_I_AM_A_TEAPOT, HTTP_CODE_MISDIRECTED_REQUEST, HTTP_CODE_UNPROCESSABLE_ENTITY, HTTP_CODE_LOCKED, HTTP_CODE_FAILED_DEPENDENCY, HTTP_CODE_TOO_EARLY, HTTP_CODE_UPGRADE_REQUIRED, HTTP_CODE_PRECONDITION_REQUIRED, HTTP_CODE_TOO_MANY_REQUESTS, HTTP_CODE_REQUEST_HEADER_FIELDS_TOO_LARGE, HTTP_CODE_INTERNAL_SERVER_ERROR, HTTP_CODE_NOT_IMPLEMENTED, HTTP_CODE_BAD_GATEWAY, HTTP_CODE_SERVICE_UNAVAILABLE, HTTP_CODE_GATEWAY_TIMEOUT, HTTP_CODE_HTTP_VERSION_NOT_SUPPORTED, HTTP_CODE_VARIANT_ALSO_NEGOTIATES, HTTP_CODE_INSUFFICIENT_STORAGE, HTTP_CODE_LOOP_DETECTED, HTTP_CODE_NOT_EXTENDED, HTTP_CODE_NETWORK_AUTHENTICATION_REQUIRED | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.

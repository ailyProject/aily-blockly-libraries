# ESP8266 Web Server

HTTP routing, request and response blocks for ESP8266.

## Library Info
- **Name**: @aily-project/lib-esp8266-webserver
- **Version**: 1.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_webserver_create` | Statement | VAR(field_input), PORT(field_number) | `esp8266_webserver_create(VAR, PORT)` | Dynamic code |
| `esp8266_webserver_begin` | Statement | VAR(field_variable) | `esp8266_webserver_begin(VAR)` | Dynamic code |
| `esp8266_webserver_stop` | Statement | VAR(field_variable) | `esp8266_webserver_stop(VAR)` | Dynamic code |
| `esp8266_webserver_handle_client` | Statement | VAR(field_variable) | `esp8266_webserver_handle_client(VAR)` | Dynamic code |
| `esp8266_webserver_on` | Statement | VAR(field_variable), METHOD(field_dropdown), PATH(input_value) | `esp8266_webserver_on(VAR, METHOD, PATH)` | Dynamic code |
| `esp8266_webserver_on_not_found` | Statement | VAR(field_variable) | `esp8266_webserver_on_not_found(VAR)` | Dynamic code |
| `esp8266_webserver_send` | Statement | VAR(field_variable), CODE(input_value), TYPE(input_value), CONTENT(input_value) | `esp8266_webserver_send(VAR, CODE, TYPE, CONTENT)` | Dynamic code |
| `esp8266_webserver_send_simple` | Statement | VAR(field_variable), CONTENT(input_value) | `esp8266_webserver_send_simple(VAR, CONTENT)` | Dynamic code |
| `esp8266_webserver_send_html` | Statement | VAR(field_variable), CONTENT(input_value) | `esp8266_webserver_send_html(VAR, CONTENT)` | Dynamic code |
| `esp8266_webserver_send_json` | Statement | VAR(field_variable), CONTENT(input_value) | `esp8266_webserver_send_json(VAR, CONTENT)` | Dynamic code |
| `esp8266_webserver_send_error` | Statement | VAR(field_variable), CODE(field_dropdown), MESSAGE(input_value) | `esp8266_webserver_send_error(VAR, CODE, MESSAGE)` | Dynamic code |
| `esp8266_webserver_send_header` | Statement | VAR(field_variable), NAME(input_value), VALUE(input_value) | `esp8266_webserver_send_header(VAR, NAME, VALUE)` | Dynamic code |
| `esp8266_webserver_uri` | Value | VAR(field_variable) | `esp8266_webserver_uri(VAR)` | Dynamic code |
| `esp8266_webserver_method` | Value | VAR(field_variable) | `esp8266_webserver_method(VAR)` | Dynamic code |
| `esp8266_webserver_arg` | Value | VAR(field_variable), NAME(input_value) | `esp8266_webserver_arg(VAR, NAME)` | Dynamic code |
| `esp8266_webserver_has_arg` | Value | VAR(field_variable), NAME(input_value) | `esp8266_webserver_has_arg(VAR, NAME)` | Dynamic code |
| `esp8266_webserver_args_count` | Value | VAR(field_variable) | `esp8266_webserver_args_count(VAR)` | Dynamic code |
| `esp8266_webserver_arg_by_index` | Value | VAR(field_variable), INDEX(input_value) | `esp8266_webserver_arg_by_index(VAR, INDEX)` | Dynamic code |
| `esp8266_webserver_arg_name` | Value | VAR(field_variable), INDEX(input_value) | `esp8266_webserver_arg_name(VAR, INDEX)` | Dynamic code |
| `esp8266_webserver_header` | Value | VAR(field_variable), NAME(input_value) | `esp8266_webserver_header(VAR, NAME)` | Dynamic code |
| `esp8266_webserver_has_header` | Value | VAR(field_variable), NAME(input_value) | `esp8266_webserver_has_header(VAR, NAME)` | Dynamic code |
| `esp8266_webserver_host_header` | Value | VAR(field_variable) | `esp8266_webserver_host_header(VAR)` | Dynamic code |
| `esp8266_webserver_path_arg` | Value | VAR(field_variable), INDEX(input_value) | `esp8266_webserver_path_arg(VAR, INDEX)` | Dynamic code |
| `esp8266_webserver_authenticate` | Value | VAR(field_variable), USERNAME(input_value), PASSWORD(input_value) | `esp8266_webserver_authenticate(VAR, USERNAME, PASSWORD)` | Dynamic code |
| `esp8266_webserver_request_authentication` | Statement | VAR(field_variable), METHOD(field_dropdown) | `esp8266_webserver_request_authentication(VAR, METHOD)` | Dynamic code |
| `esp8266_webserver_enable_cors` | Statement | VAR(field_variable), ENABLE(field_checkbox) | `esp8266_webserver_enable_cors(VAR, ENABLE)` | Dynamic code |
| `esp8266_webserver_client_ip` | Value | VAR(field_variable) | `esp8266_webserver_client_ip(VAR)` | Dynamic code |
| `esp8266_webserver_serve_static` | Statement | VAR(field_variable), URI(input_value), FS(field_dropdown), PATH(input_value) | `esp8266_webserver_serve_static(VAR, URI, FS, PATH)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_webserver_on.METHOD | HTTP_ANY, HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_DELETE, HTTP_PATCH, HTTP_OPTIONS | Selects the generated API option. |
| esp8266_webserver_send_error.CODE | 400, 401, 403, 404, 500, 503 | Selects the generated API option. |
| esp8266_webserver_request_authentication.METHOD | BASIC_AUTH, DIGEST_AUTH | Selects the generated API option. |
| esp8266_webserver_serve_static.FS | SPIFFS, LittleFS, SD | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.

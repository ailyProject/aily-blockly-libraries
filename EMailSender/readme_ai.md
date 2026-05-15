# mailer

Arduino email sending library, sends emails through SMTP protocol, supports attachment function and secure connection

## Library Info
- **Name**: @aily-project/lib-emailsender
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `emailsender_create` | Statement | VAR(field_input), EMAIL_LOGIN(input_value), EMAIL_PASSWORD(input_value), EMAIL_FROM(input_value) | `emailsender_create("emailSender", text("value"), text("value"), text("value"))` | Dynamic code |
| `emailsender_create_with_name` | Statement | VAR(field_input), EMAIL_LOGIN(input_value), EMAIL_PASSWORD(input_value), EMAIL_FROM(input_value), NAME_FROM(input_value) | `emailsender_create_with_name("emailSender", text("value"), text("value"), text("value"), text("value"))` | Dynamic code |
| `emailsender_configure` | Statement | VAR(field_variable), SMTP_SERVER(input_value), SMTP_PORT(input_value) | `emailsender_configure(variables_get($emailSender), text("value"), math_number(0))` | Dynamic code |
| `emailsender_set_secure` | Statement | VAR(field_variable), SECURE(dropdown) | `emailsender_set_secure(variables_get($emailSender), TRUE)` | Dynamic code |
| `emailsender_message_create` | Statement | VAR(field_input) | `emailsender_message_create("message")` | Dynamic code |
| `emailsender_set_subject` | Statement | VAR(field_variable), SUBJECT(input_value) | `emailsender_set_subject(variables_get($message), text("value"))` | Dynamic code |
| `emailsender_set_content` | Statement | VAR(field_variable), CONTENT(input_value), MIME_TYPE(dropdown) | `emailsender_set_content(variables_get($message), text("value"), "text/html")` | Dynamic code |
| `emailsender_send` | Statement | VAR(field_variable), TO(input_value), MESSAGE(field_variable) | `emailsender_send(variables_get($emailSender), text("value"), variables_get($message))` | Dynamic code |
| `emailsender_send_with_response` | Statement | VAR(field_variable), TO(input_value), MESSAGE(field_variable), RESPONSE_VAR(field_input) | `emailsender_send_with_response(variables_get($emailSender), text("value"), variables_get($message), "response")` | Dynamic code |
| `emailsender_get_status` | Value | VAR(field_variable) | `emailsender_get_status(variables_get($response))` | Dynamic code |
| `emailsender_get_code` | Value | VAR(field_variable) | `emailsender_get_code(variables_get($response))` | Dynamic code |
| `emailsender_get_description` | Value | VAR(field_variable) | `emailsender_get_description(variables_get($response))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SECURE | TRUE, FALSE | emailsender_set_secure |
| MIME_TYPE | text/html, text/plain | emailsender_set_content |

## ABS Examples

### Basic Usage
```
arduino_setup()
    emailsender_create("emailSender", text("value"), text("value"), text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, emailsender_get_status(variables_get($response)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `emailsender_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

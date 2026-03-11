# 邮件发送器

Arduino邮件发送库，通过SMTP协议发送电子邮件，支持附件功能和安全连接

## Library Info
- **Name**: @aily-project/lib-emailsender
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `emailsender_create` | Statement | VAR(field_input), EMAIL_LOGIN(input_value), EMAIL_PASSWORD(input_value), EMAIL_FROM(input_value) | `emailsender_create("emailSender", math_number(0), math_number(0), math_number(0))` | `` |
| `emailsender_create_with_name` | Statement | VAR(field_input), EMAIL_LOGIN(input_value), EMAIL_PASSWORD(input_value), EMAIL_FROM(input_value), NAME_FROM(input_value) | `emailsender_create_with_name("emailSender", math_number(0), math_number(0), math_number(0), math_number(0))` | `` |
| `emailsender_configure` | Statement | VAR(field_variable), SMTP_SERVER(input_value), SMTP_PORT(input_value) | `emailsender_configure(variables_get($emailSender), math_number(0), math_number(0))` | (dynamic code) |
| `emailsender_set_secure` | Statement | VAR(field_variable), SECURE(dropdown) | `emailsender_set_secure(variables_get($emailSender), TRUE)` | (dynamic code) |
| `emailsender_message_create` | Statement | VAR(field_input) | `emailsender_message_create("message")` | `` |
| `emailsender_set_subject` | Statement | VAR(field_variable), SUBJECT(input_value) | `emailsender_set_subject(variables_get($message), math_number(0))` | (dynamic code) |
| `emailsender_set_content` | Statement | VAR(field_variable), CONTENT(input_value), MIME_TYPE(dropdown) | `emailsender_set_content(variables_get($message), math_number(0), text/html)` | (dynamic code) |
| `emailsender_send` | Statement | VAR(field_variable), TO(input_value), MESSAGE(field_variable) | `emailsender_send(variables_get($emailSender), math_number(0), variables_get($message))` | (dynamic code) |
| `emailsender_send_with_response` | Statement | VAR(field_variable), TO(input_value), MESSAGE(field_variable), RESPONSE_VAR(field_input) | `emailsender_send_with_response(variables_get($emailSender), math_number(0), variables_get($message), "response")` | (dynamic code) |
| `emailsender_get_status` | Value | VAR(field_variable) | `emailsender_get_status(variables_get($response))` | (dynamic code) |
| `emailsender_get_code` | Value | VAR(field_variable) | `emailsender_get_code(variables_get($response))` | (dynamic code) |
| `emailsender_get_description` | Value | VAR(field_variable) | `emailsender_get_description(variables_get($response))` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SECURE | TRUE, FALSE | 启用 / 禁用 |
| MIME_TYPE | text/html, text/plain | HTML / 纯文本 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    emailsender_create("emailSender", math_number(0), math_number(0), math_number(0))
    emailsender_create_with_name("emailSender", math_number(0), math_number(0), math_number(0), math_number(0))
    emailsender_message_create("message")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, emailsender_get_status(variables_get($response)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `emailsender_create("varName", ...)` creates variable `$varName`; reference with `variables_get($varName)`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

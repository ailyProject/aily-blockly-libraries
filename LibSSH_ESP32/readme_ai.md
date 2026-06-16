# LibSSH ESP32

ESP32 SSH session, channel, and SCP blocks based on LibSSH-ESP32.

## Library Info
- **Name**: @aily-project/lib-libssh-esp32
- **Version**: 5.8.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `libssh_begin` | Statement | none | `libssh_begin()` | `ailyLibsshEnsureStarted();` |
| `libssh_connect_password` | Statement | VAR, HOST, USER, PASSWORD, PORT, TIMEOUT, LOG | `libssh_connect_password("sshSession", text("host"), text("user"), text("password"), math_number(22), math_number(10), 0)` | creates `ssh_session` and connects |
| `libssh_session_create` | Statement | VAR | `libssh_session_create("sshSession")` | `ssh_new()` |
| `libssh_session_set_options` | Statement | VAR, HOST, USER, PORT, TIMEOUT, LOG | `libssh_session_set_options(variables_get($sshSession), text("host"), text("user"), math_number(22), math_number(10), 0)` | `ssh_options_set(...)` |
| `libssh_session_connect` | Value Boolean | VAR | `libssh_session_connect(variables_get($sshSession))` | `ssh_connect(session) == SSH_OK` |
| `libssh_session_auth_password` | Value Boolean | VAR, USER, PASSWORD | `libssh_session_auth_password(variables_get($sshSession), text("user"), text("password"))` | `ssh_userauth_password(...) == SSH_AUTH_SUCCESS` |
| `libssh_session_connected` | Value Boolean | VAR | `libssh_session_connected(variables_get($sshSession))` | `ssh_is_connected(session)` |
| `libssh_session_error` | Value String | VAR | `libssh_session_error(variables_get($sshSession))` | `String(ssh_get_error(session))` |
| `libssh_session_disconnect` | Statement | VAR, FREE, FINALIZE | `libssh_session_disconnect(variables_get($sshSession), TRUE, FALSE)` | disconnect/free/finalize |
| `libssh_channel_create` | Statement | VAR, SESSION | `libssh_channel_create("sshChannel", variables_get($sshSession))` | `ssh_channel_new(session)` |
| `libssh_channel_exec` | Value Boolean | VAR, COMMAND | `libssh_channel_exec(variables_get($sshChannel), text("ls"))` | open session channel and execute command |
| `libssh_channel_read` | Value String | VAR, MAX_BYTES, TIMEOUT, STREAM | `libssh_channel_read(variables_get($sshChannel), math_number(512), math_number(1000), 0)` | reads stdout/stderr into `String` |
| `libssh_channel_write` | Statement | VAR, DATA | `libssh_channel_write(variables_get($sshChannel), text("input"))` | `ssh_channel_write(...)` |
| `libssh_channel_close` | Statement | VAR | `libssh_channel_close(variables_get($sshChannel))` | send EOF, close, free |
| `libssh_scp_open` | Statement | VAR, SESSION, MODE, LOCATION | `libssh_scp_open("sshScp", variables_get($sshSession), SSH_SCP_READ, text("/tmp/file.txt"))` | `ssh_scp_new(...); ssh_scp_init(...)` |
| `libssh_scp_read_text` | Value String | VAR, MAX_BYTES | `libssh_scp_read_text(variables_get($sshScp), math_number(1024))` | accepts next file request and reads text |
| `libssh_scp_write_text` | Value Boolean | VAR, FILENAME, TEXT, PERMS | `libssh_scp_write_text(variables_get($sshScp), text("file.txt"), text("hello"), math_number(0644))` | pushes text file |
| `libssh_scp_last_size` | Value Number | none | `libssh_scp_last_size()` | last SCP file size |
| `libssh_scp_close` | Statement | VAR | `libssh_scp_close(variables_get($sshScp))` | close and free SCP handle |
| `libssh_status_code` | Value Number | CODE | `libssh_status_code(SSH_OK)` | libssh constant |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| LOG | `0`, `1`, `2`, `3`, `4` | libssh verbosity |
| STREAM | `0`, `1` | stdout or stderr |
| MODE | `SSH_SCP_READ`, `SSH_SCP_WRITE` | SCP transfer direction |
| CODE | `SSH_OK`, `SSH_ERROR`, `SSH_AUTH_SUCCESS`, `SSH_AUTH_DENIED`, `SSH_SCP_REQUEST_NEWFILE`, `SSH_SCP_REQUEST_EOF` | libssh constants |

## ABS Examples

```text
arduino_setup()
    libssh_connect_password("sshSession", text("192.168.1.10"), text("user"), text("password"), math_number(22), math_number(10), 0)
    libssh_channel_create("sshChannel", variables_get($sshSession))
    controls_if()
        @IF0: libssh_channel_exec(variables_get($sshChannel), text("uname -a"))
        @DO0:
            serial_println(Serial, libssh_channel_read(variables_get($sshChannel), math_number(512), math_number(1000), 0))
    libssh_channel_close(variables_get($sshChannel))
    libssh_session_disconnect(variables_get($sshSession), TRUE, FALSE)
```

## Notes

Network connection must already be available. SCP helpers are text-oriented; binary firmware OTA should use custom code or upstream examples.

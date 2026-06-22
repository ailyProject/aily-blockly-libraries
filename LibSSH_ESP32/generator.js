'use strict';

function ailySshSafeName(name, fallback) {
  const raw = String(name || fallback || 'sshValue').trim();
  const safe = raw.replace(/[^A-Za-z0-9_]/g, '_').replace(/^[^A-Za-z_]+/, '');
  return safe || fallback || 'sshValue';
}

function ailySshOrder(generator) {
  return generator.ORDER_ATOMIC || (typeof Arduino !== 'undefined' ? Arduino.ORDER_ATOMIC : 0) || 0;
}

function ailySshValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, ailySshOrder(generator)) || fallback;
}

function ailySshFieldVar(block, field, fallback) {
  const varField = block.getField(field);
  return ailySshSafeName(varField ? varField.getText() : block.getFieldValue(field), fallback);
}

function ailySshRegister(name, type) {
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(name, type);
  }
}

function ensureLibssh(generator) {
  generator.addLibrary('LibSSH_ESP32', '#include <libssh_esp32.h>');
  generator.addLibrary('LibSSH_ESP32_libssh', '#include <libssh/libssh.h>');
}

function ensureLibsshHelpers(generator) {
  ensureLibssh(generator);
  generator.addVariable('aily_libssh_started', 'bool ailyLibsshStarted = false;');
  generator.addVariable('aily_libssh_last_scp_size', 'uint64_t ailyLibsshLastScpSize = 0;');
  generator.addFunction('aily_libssh_ensure_started',
    'void ailyLibsshEnsureStarted() {\n' +
    '  if (!ailyLibsshStarted) {\n' +
    '    libssh_begin();\n' +
    '    ailyLibsshStarted = true;\n' +
    '  }\n' +
    '}\n'
  );
  generator.addFunction('aily_libssh_connect_password',
    'ssh_session ailyLibsshConnectPassword(String host, String user, String password, int port, long timeoutSeconds, int verbosity) {\n' +
    '  ailyLibsshEnsureStarted();\n' +
    '  ssh_session session = ssh_new();\n' +
    '  if (session == NULL) return NULL;\n' +
    '  const char *userPtr = user.length() > 0 ? user.c_str() : NULL;\n' +
    '  if (userPtr && ssh_options_set(session, SSH_OPTIONS_USER, userPtr) < 0) {\n' +
    '    ssh_free(session);\n' +
    '    return NULL;\n' +
    '  }\n' +
    '  if (ssh_options_set(session, SSH_OPTIONS_HOST, host.c_str()) < 0) {\n' +
    '    ssh_free(session);\n' +
    '    return NULL;\n' +
    '  }\n' +
    '  if (port > 0) {\n' +
    '    int optPort = port;\n' +
    '    ssh_options_set(session, SSH_OPTIONS_PORT, &optPort);\n' +
    '  }\n' +
    '  if (timeoutSeconds > 0) {\n' +
    '    long optTimeout = timeoutSeconds;\n' +
    '    ssh_options_set(session, SSH_OPTIONS_TIMEOUT, &optTimeout);\n' +
    '  }\n' +
    '  ssh_options_set(session, SSH_OPTIONS_LOG_VERBOSITY, &verbosity);\n' +
    '  if (ssh_connect(session) != SSH_OK) {\n' +
    '    ssh_disconnect(session);\n' +
    '    ssh_free(session);\n' +
    '    return NULL;\n' +
    '  }\n' +
    '  if (password.length() > 0 && ssh_userauth_password(session, userPtr, password.c_str()) != SSH_AUTH_SUCCESS) {\n' +
    '    ssh_disconnect(session);\n' +
    '    ssh_free(session);\n' +
    '    return NULL;\n' +
    '  }\n' +
    '  return session;\n' +
    '}\n'
  );
  generator.addFunction('aily_libssh_channel_exec',
    'bool ailyLibsshChannelExec(ssh_channel channel, String command) {\n' +
    '  if (channel == NULL) return false;\n' +
    '  if (ssh_channel_open_session(channel) != SSH_OK) return false;\n' +
    '  return ssh_channel_request_exec(channel, command.c_str()) == SSH_OK;\n' +
    '}\n'
  );
  generator.addFunction('aily_libssh_auth_password',
    'bool ailyLibsshAuthPassword(ssh_session session, String user, String password) {\n' +
    '  if (session == NULL) return false;\n' +
    '  const char *userPtr = user.length() > 0 ? user.c_str() : NULL;\n' +
    '  return ssh_userauth_password(session, userPtr, password.c_str()) == SSH_AUTH_SUCCESS;\n' +
    '}\n'
  );
  generator.addFunction('aily_libssh_channel_read',
    'String ailyLibsshChannelRead(ssh_channel channel, uint32_t maxBytes, int timeoutMs, bool stderrStream) {\n' +
    '  String output = "";\n' +
    '  if (channel == NULL || maxBytes == 0) return output;\n' +
    '  char buffer[129];\n' +
    '  uint32_t remaining = maxBytes;\n' +
    '  while (remaining > 0) {\n' +
    '    uint32_t chunk = remaining > 128 ? 128 : remaining;\n' +
    '    int n = timeoutMs < 0 ? ssh_channel_read(channel, buffer, chunk, stderrStream ? 1 : 0) : ssh_channel_read_timeout(channel, buffer, chunk, stderrStream ? 1 : 0, timeoutMs);\n' +
    '    if (n <= 0) break;\n' +
    '    buffer[n] = 0;\n' +
    '    output += buffer;\n' +
    '    remaining -= n;\n' +
    '    if ((uint32_t)n < chunk) break;\n' +
    '  }\n' +
    '  return output;\n' +
    '}\n'
  );
  generator.addFunction('aily_libssh_channel_write',
    'int ailyLibsshChannelWrite(ssh_channel channel, String data) {\n' +
    '  if (channel == NULL) return SSH_ERROR;\n' +
    '  return ssh_channel_write(channel, data.c_str(), data.length());\n' +
    '}\n'
  );
  generator.addFunction('aily_libssh_scp_read_text',
    'String ailyLibsshScpReadText(ssh_scp scp, uint32_t maxBytes) {\n' +
    '  String output = "";\n' +
    '  ailyLibsshLastScpSize = 0;\n' +
    '  if (scp == NULL || maxBytes == 0) return output;\n' +
    '  int request = ssh_scp_pull_request(scp);\n' +
    '  while (request == SSH_SCP_REQUEST_WARNING) {\n' +
    '    request = ssh_scp_pull_request(scp);\n' +
    '  }\n' +
    '  if (request != SSH_SCP_REQUEST_NEWFILE) return output;\n' +
    '  ailyLibsshLastScpSize = ssh_scp_request_get_size64(scp);\n' +
    '  if (ssh_scp_accept_request(scp) != SSH_OK) return output;\n' +
    '  char buffer[129];\n' +
    '  uint32_t remaining = maxBytes;\n' +
    '  while (remaining > 0) {\n' +
    '    uint32_t chunk = remaining > 128 ? 128 : remaining;\n' +
    '    int n = ssh_scp_read(scp, buffer, chunk);\n' +
    '    if (n <= 0) break;\n' +
    '    buffer[n] = 0;\n' +
    '    output += buffer;\n' +
    '    remaining -= n;\n' +
    '  }\n' +
    '  return output;\n' +
    '}\n'
  );
  generator.addFunction('aily_libssh_scp_write_text',
    'bool ailyLibsshScpWriteText(ssh_scp scp, String filename, String text, int perms) {\n' +
    '  if (scp == NULL) return false;\n' +
    '  if (ssh_scp_push_file(scp, filename.c_str(), text.length(), perms) != SSH_OK) return false;\n' +
    '  return ssh_scp_write(scp, text.c_str(), text.length()) == (int)text.length();\n' +
    '}\n'
  );
}

Arduino.forBlock['libssh_begin'] = function(block, generator) {
  ensureLibsshHelpers(generator);
  return 'ailyLibsshEnsureStarted();\n';
};

Arduino.forBlock['libssh_connect_password'] = function(block, generator) {
  ensureLibsshHelpers(generator);
  const varName = ailySshSafeName(block.getFieldValue('VAR'), 'sshSession');
  const host = ailySshValue(block, generator, 'HOST', '"192.168.1.10"');
  const user = ailySshValue(block, generator, 'USER', '"user"');
  const password = ailySshValue(block, generator, 'PASSWORD', '"password"');
  const port = ailySshValue(block, generator, 'PORT', '22');
  const timeout = ailySshValue(block, generator, 'TIMEOUT', '10');
  const log = block.getFieldValue('LOG') || '0';
  ailySshRegister(varName, 'ssh_session');
  generator.addObject('libssh_session_' + varName, 'ssh_session ' + varName + ' = NULL;');
  return varName + ' = ailyLibsshConnectPassword(' + host + ', ' + user + ', ' + password + ', ' + port + ', ' + timeout + ', ' + log + ');\n';
};

Arduino.forBlock['libssh_session_create'] = function(block, generator) {
  ensureLibsshHelpers(generator);
  const varName = ailySshSafeName(block.getFieldValue('VAR'), 'sshSession');
  ailySshRegister(varName, 'ssh_session');
  generator.addObject('libssh_session_' + varName, 'ssh_session ' + varName + ' = NULL;');
  return 'ailyLibsshEnsureStarted();\n' + varName + ' = ssh_new();\n';
};

Arduino.forBlock['libssh_session_set_options'] = function(block, generator) {
  ensureLibsshHelpers(generator);
  const varName = ailySshFieldVar(block, 'VAR', 'sshSession');
  const host = ailySshValue(block, generator, 'HOST', '"192.168.1.10"');
  const user = ailySshValue(block, generator, 'USER', '""');
  const port = ailySshValue(block, generator, 'PORT', '22');
  const timeout = ailySshValue(block, generator, 'TIMEOUT', '10');
  const log = block.getFieldValue('LOG') || '0';
  const suffix = String(block.id || Math.random().toString(36).slice(2)).replace(/[^A-Za-z0-9_]/g, '_');
  return 'if (' + varName + ') {\n' +
    '  String sshHost_' + suffix + ' = ' + host + ';\n' +
    '  String sshUser_' + suffix + ' = ' + user + ';\n' +
    '  int sshPort_' + suffix + ' = ' + port + ';\n' +
    '  long sshTimeout_' + suffix + ' = ' + timeout + ';\n' +
    '  int sshLog_' + suffix + ' = ' + log + ';\n' +
    '  ssh_options_set(' + varName + ', SSH_OPTIONS_HOST, sshHost_' + suffix + '.c_str());\n' +
    '  if (sshUser_' + suffix + '.length() > 0) ssh_options_set(' + varName + ', SSH_OPTIONS_USER, sshUser_' + suffix + '.c_str());\n' +
    '  ssh_options_set(' + varName + ', SSH_OPTIONS_PORT, &sshPort_' + suffix + ');\n' +
    '  ssh_options_set(' + varName + ', SSH_OPTIONS_TIMEOUT, &sshTimeout_' + suffix + ');\n' +
    '  ssh_options_set(' + varName + ', SSH_OPTIONS_LOG_VERBOSITY, &sshLog_' + suffix + ');\n' +
    '}\n';
};

Arduino.forBlock['libssh_session_connect'] = function(block, generator) {
  ensureLibsshHelpers(generator);
  const varName = ailySshFieldVar(block, 'VAR', 'sshSession');
  return ['(' + varName + ' != NULL && ssh_connect(' + varName + ') == SSH_OK)', ailySshOrder(generator)];
};

Arduino.forBlock['libssh_session_auth_password'] = function(block, generator) {
  ensureLibsshHelpers(generator);
  const varName = ailySshFieldVar(block, 'VAR', 'sshSession');
  const user = ailySshValue(block, generator, 'USER', '""');
  const password = ailySshValue(block, generator, 'PASSWORD', '""');
  return ['ailyLibsshAuthPassword(' + varName + ', ' + user + ', ' + password + ')', ailySshOrder(generator)];
};

Arduino.forBlock['libssh_session_connected'] = function(block, generator) {
  ensureLibsshHelpers(generator);
  const varName = ailySshFieldVar(block, 'VAR', 'sshSession');
  return ['(' + varName + ' != NULL && ssh_is_connected(' + varName + '))', ailySshOrder(generator)];
};

Arduino.forBlock['libssh_session_error'] = function(block, generator) {
  ensureLibsshHelpers(generator);
  const varName = ailySshFieldVar(block, 'VAR', 'sshSession');
  return ['String(' + varName + ' ? ssh_get_error(' + varName + ') : "")', ailySshOrder(generator)];
};

Arduino.forBlock['libssh_session_disconnect'] = function(block, generator) {
  ensureLibsshHelpers(generator);
  const varName = ailySshFieldVar(block, 'VAR', 'sshSession');
  const freeHandle = block.getFieldValue('FREE') === 'TRUE';
  const finalize = block.getFieldValue('FINALIZE') === 'TRUE';
  let code = 'if (' + varName + ') {\n  ssh_disconnect(' + varName + ');\n';
  if (freeHandle) code += '  ssh_free(' + varName + ');\n  ' + varName + ' = NULL;\n';
  code += '}\n';
  if (finalize) code += 'ssh_finalize();\nailyLibsshStarted = false;\n';
  return code;
};

Arduino.forBlock['libssh_channel_create'] = function(block, generator) {
  ensureLibsshHelpers(generator);
  const varName = ailySshSafeName(block.getFieldValue('VAR'), 'sshChannel');
  const sessionName = ailySshFieldVar(block, 'SESSION', 'sshSession');
  ailySshRegister(varName, 'ssh_channel');
  generator.addObject('libssh_channel_' + varName, 'ssh_channel ' + varName + ' = NULL;');
  return varName + ' = ' + sessionName + ' ? ssh_channel_new(' + sessionName + ') : NULL;\n';
};

Arduino.forBlock['libssh_channel_exec'] = function(block, generator) {
  ensureLibsshHelpers(generator);
  const varName = ailySshFieldVar(block, 'VAR', 'sshChannel');
  const command = ailySshValue(block, generator, 'COMMAND', '"ls"');
  return ['ailyLibsshChannelExec(' + varName + ', ' + command + ')', ailySshOrder(generator)];
};

Arduino.forBlock['libssh_channel_read'] = function(block, generator) {
  ensureLibsshHelpers(generator);
  const varName = ailySshFieldVar(block, 'VAR', 'sshChannel');
  const maxBytes = ailySshValue(block, generator, 'MAX_BYTES', '512');
  const timeout = ailySshValue(block, generator, 'TIMEOUT', '1000');
  const stream = block.getFieldValue('STREAM') === '1' ? 'true' : 'false';
  return ['ailyLibsshChannelRead(' + varName + ', ' + maxBytes + ', ' + timeout + ', ' + stream + ')', ailySshOrder(generator)];
};

Arduino.forBlock['libssh_channel_write'] = function(block, generator) {
  ensureLibsshHelpers(generator);
  const varName = ailySshFieldVar(block, 'VAR', 'sshChannel');
  const data = ailySshValue(block, generator, 'DATA', '""');
  return 'ailyLibsshChannelWrite(' + varName + ', ' + data + ');\n';
};

Arduino.forBlock['libssh_channel_close'] = function(block, generator) {
  ensureLibsshHelpers(generator);
  const varName = ailySshFieldVar(block, 'VAR', 'sshChannel');
  return 'if (' + varName + ') {\n' +
    '  ssh_channel_send_eof(' + varName + ');\n' +
    '  ssh_channel_close(' + varName + ');\n' +
    '  ssh_channel_free(' + varName + ');\n' +
    '  ' + varName + ' = NULL;\n' +
    '}\n';
};

Arduino.forBlock['libssh_scp_open'] = function(block, generator) {
  ensureLibsshHelpers(generator);
  const varName = ailySshSafeName(block.getFieldValue('VAR'), 'sshScp');
  const sessionName = ailySshFieldVar(block, 'SESSION', 'sshSession');
  const mode = block.getFieldValue('MODE') || 'SSH_SCP_READ';
  const location = ailySshValue(block, generator, 'LOCATION', '"/tmp"');
  const suffix = ailySshSafeName(block.id, 'block');
  ailySshRegister(varName, 'ssh_scp');
  generator.addObject('libssh_scp_' + varName, 'ssh_scp ' + varName + ' = NULL;');
  return 'if (' + sessionName + ') {\n' +
    '  String scpLocation_' + suffix + ' = ' + location + ';\n' +
    '  ' + varName + ' = ssh_scp_new(' + sessionName + ', ' + mode + ', scpLocation_' + suffix + '.c_str());\n' +
    '  if (' + varName + ' && ssh_scp_init(' + varName + ') != SSH_OK) {\n' +
    '    ssh_scp_free(' + varName + ');\n' +
    '    ' + varName + ' = NULL;\n' +
    '  }\n' +
    '}\n';
};

Arduino.forBlock['libssh_scp_read_text'] = function(block, generator) {
  ensureLibsshHelpers(generator);
  const varName = ailySshFieldVar(block, 'VAR', 'sshScp');
  const maxBytes = ailySshValue(block, generator, 'MAX_BYTES', '1024');
  return ['ailyLibsshScpReadText(' + varName + ', ' + maxBytes + ')', ailySshOrder(generator)];
};

Arduino.forBlock['libssh_scp_write_text'] = function(block, generator) {
  ensureLibsshHelpers(generator);
  const varName = ailySshFieldVar(block, 'VAR', 'sshScp');
  const filename = ailySshValue(block, generator, 'FILENAME', '"file.txt"');
  const text = ailySshValue(block, generator, 'TEXT', '""');
  const perms = ailySshValue(block, generator, 'PERMS', '0644');
  return ['ailyLibsshScpWriteText(' + varName + ', ' + filename + ', ' + text + ', ' + perms + ')', ailySshOrder(generator)];
};

Arduino.forBlock['libssh_scp_last_size'] = function(block, generator) {
  ensureLibsshHelpers(generator);
  return ['ailyLibsshLastScpSize', ailySshOrder(generator)];
};

Arduino.forBlock['libssh_scp_close'] = function(block, generator) {
  ensureLibsshHelpers(generator);
  const varName = ailySshFieldVar(block, 'VAR', 'sshScp');
  return 'if (' + varName + ') {\n' +
    '  ssh_scp_close(' + varName + ');\n' +
    '  ssh_scp_free(' + varName + ');\n' +
    '  ' + varName + ' = NULL;\n' +
    '}\n';
};

Arduino.forBlock['libssh_status_code'] = function(block, generator) {
  ensureLibsshHelpers(generator);
  return [block.getFieldValue('CODE') || 'SSH_OK', ailySshOrder(generator)];
};

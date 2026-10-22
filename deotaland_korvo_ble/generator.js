// Generator.js for deotaland_korvo_ble (ESP32-S3-Korvo-2 V3 AI agent)

Arduino.korvoEnsureLibrary = function (generator) {
  generator.addLibrary('KorvoAgent', '#include <KorvoAgent.h>');
};

// 端点 ID 只保留字母、数字和下划线，短且唯一
Arduino.korvoId = function (value, fallback) {
  const id = String(value || '').trim().replace(/[^A-Za-z0-9_]/g, '_').slice(0, 23);
  return id || fallback;
};

// 字段文字放进 C 字符串前转义
Arduino.korvoCString = function (value) {
  return '"' + String(value == null ? '' : value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, '\\n') + '"';
};

// 文字输入可能是 String、数字或字面量，统一转成 const char*
Arduino.korvoText = function (code) {
  if (/^"(?:[^"\\]|\\.)*"$/.test(code)) return code;
  return 'String(' + code + ').c_str()';
};

// 引脚按 Korvo-2 V3 写死，换成别的 ESP32-S3 板时在代码里留个提醒
Arduino.korvoBoardNote = function () {
  try {
    const boardConfig = window['boardConfig'];
    const name = boardConfig && boardConfig.name ? String(boardConfig.name) : '';
    if (name && name.toLowerCase().indexOf('korvo') === -1) {
      return '// 注意：当前开发板是 ' + name + '，本库按 ESP32-S3-Korvo-2 V3 的板载音频、摄像头和屏幕接线\n';
    }
  } catch (e) {}
  return '';
};

// 录音相关的块共用：TF 卡要在 Korvo.begin() 之前声明，begin 时才会挂载
Arduino.korvoEnableRecording = function (generator) {
  Arduino.korvoEnsureLibrary(generator);
  generator.addSetupBegin('korvo_ble_recording', 'Korvo.enableRecording();\n');
};

Arduino.forBlock['korvo_ble_init'] = function (block, generator) {
  const name = block.getFieldValue('NAME') || 'KORVO';
  const screen = block.getFieldValue('SCREEN') === 'false' ? 'false' : 'true';
  const camera = block.getFieldValue('CAMERA') === 'false' ? 'false' : 'true';
  const debug = block.getFieldValue('DEBUG') === 'false' ? 'false' : 'true';
  const ota = block.getFieldValue('OTA') === 'true' ? 'true' : 'false';
  Arduino.korvoEnsureLibrary(generator);
  if (debug === 'true') ensureSerialBegin('Serial', generator, '115200');
  // 蓝牙、音频和屏幕都靠 poll 推进，每轮 loop 都要调用
  generator.addLoopBegin('korvo_ble_poll', 'Korvo.poll();\n');
  return Arduino.korvoBoardNote() +
    'Korvo.begin(' + Arduino.korvoCString(name) + ', ' + screen + ', ' + camera + ', ' + debug + ', ' + ota + ');\n';
};

Arduino.forBlock['korvo_ble_is_ready'] = function (block, generator) {
  Arduino.korvoEnsureLibrary(generator);
  return ['Korvo.isReady()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['korvo_ble_print_status'] = function (block, generator) {
  Arduino.korvoEnsureLibrary(generator);
  return 'Korvo.printStatus();\n';
};

Arduino.forBlock['korvo_ble_talk_start'] = function (block, generator) {
  const mode = block.getFieldValue('MODE') === 'ASR' ? 'startTranscribe' : 'startTalk';
  const seconds = generator.valueToCode(block, 'SECONDS', generator.ORDER_ATOMIC) || '10';
  Arduino.korvoEnsureLibrary(generator);
  const literal = Number(seconds);
  const ms = Number.isFinite(literal)
    ? String(Math.max(1, Math.round(literal * 1000)))
    : '(uint32_t)((' + seconds + ') * 1000)';
  return 'Korvo.' + mode + '(' + ms + ');\n';
};

Arduino.forBlock['korvo_ble_talk_stop'] = function (block, generator) {
  Arduino.korvoEnsureLibrary(generator);
  return 'Korvo.stopTalk();\n';
};

Arduino.forBlock['korvo_ble_is_talking'] = function (block, generator) {
  Arduino.korvoEnsureLibrary(generator);
  return ['Korvo.isTalking()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['korvo_ble_is_speaking'] = function (block, generator) {
  Arduino.korvoEnsureLibrary(generator);
  return ['Korvo.isSpeaking()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['korvo_ble_test_tone'] = function (block, generator) {
  Arduino.korvoEnsureLibrary(generator);
  return 'Korvo.playTestTone();\n';
};

Arduino.forBlock['korvo_ble_send_prompt'] = function (block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  Arduino.korvoEnsureLibrary(generator);
  return 'Korvo.sendPrompt(' + Arduino.korvoText(text) + ');\n';
};

Arduino.forBlock['korvo_ble_take_photo'] = function (block, generator) {
  Arduino.korvoEnsureLibrary(generator);
  return 'Korvo.takePhoto();\n';
};

Arduino.forBlock['korvo_ble_on_text'] = function (block, generator) {
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  Arduino.korvoEnsureLibrary(generator);
  generator.addFunction('korvo_ble_on_agent_text', 'void korvo_ble_on_agent_text() {\n' + handler + '}\n');
  generator.addSetupBegin('korvo_ble_on_agent_text', 'Korvo.onText(korvo_ble_on_agent_text);\n');
  return '';
};

Arduino.forBlock['korvo_ble_agent_text'] = function (block, generator) {
  Arduino.korvoEnsureLibrary(generator);
  return ['Korvo.lastText()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['korvo_ble_show_text'] = function (block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  Arduino.korvoEnsureLibrary(generator);
  return 'Korvo.showText(' + Arduino.korvoText(text) + ');\n';
};

Arduino.forBlock['korvo_ble_backlight'] = function (block, generator) {
  const state = block.getFieldValue('STATE') === 'false' ? 'false' : 'true';
  Arduino.korvoEnsureLibrary(generator);
  return 'Korvo.setBacklight(' + state + ');\n';
};

Arduino.forBlock['korvo_ble_update_sensor'] = function (block, generator) {
  const id = Arduino.korvoId(block.getFieldValue('ID'), 'sensor0');
  const label = block.getFieldValue('LABEL') || id;
  const unit = block.getFieldValue('UNIT') || '';
  const type = block.getFieldValue('TYPE') || 'KORVO_NUMBER';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  Arduino.korvoEnsureLibrary(generator);
  // 端点要在 Korvo.begin() 之前注册，放到 setup 最前面
  generator.addSetupBegin('korvo_ble_endpoint_' + id,
    'Korvo.addSensor("' + id + '", ' + type + ', ' + Arduino.korvoCString(unit) + ', ' + Arduino.korvoCString(label) + ');\n');
  if (type === 'KORVO_SWITCH') return 'Korvo.updateSwitch("' + id + '", ' + value + ');\n';
  if (type === 'KORVO_TEXT') return 'Korvo.updateText("' + id + '", ' + Arduino.korvoText(value) + ');\n';
  return 'Korvo.updateNumber("' + id + '", ' + value + ');\n';
};

Arduino.forBlock['korvo_ble_on_control'] = function (block, generator) {
  const id = Arduino.korvoId(block.getFieldValue('ID'), 'control0');
  const label = block.getFieldValue('LABEL') || id;
  const type = block.getFieldValue('TYPE') || 'KORVO_SWITCH';
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  const fn = 'korvo_ble_control_' + id;
  Arduino.korvoEnsureLibrary(generator);
  generator.addFunction(fn, 'void ' + fn + '() {\n' + handler + '}\n');
  generator.addSetupBegin('korvo_ble_endpoint_' + id,
    'Korvo.addControl("' + id + '", ' + type + ', ' + Arduino.korvoCString(label) + ', ' + fn + ');\n');
  return '';
};

Arduino.forBlock['korvo_ble_control_value'] = function (block, generator) {
  const kind = block.getFieldValue('KIND') || 'NUMBER';
  Arduino.korvoEnsureLibrary(generator);
  if (kind === 'SWITCH') return ['Korvo.controlSwitch()', generator.ORDER_FUNCTION_CALL];
  if (kind === 'TEXT') return ['Korvo.controlText()', generator.ORDER_FUNCTION_CALL];
  return ['Korvo.controlNumber()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['korvo_ble_camera_preview'] = function (block, generator) {
  const state = block.getFieldValue('STATE') === 'false' ? 'false' : 'true';
  Arduino.korvoEnsureLibrary(generator);
  return 'Korvo.setPreview(' + state + ');\n';
};

Arduino.forBlock['korvo_ble_touch_pressed'] = function (block, generator) {
  Arduino.korvoEnsureLibrary(generator);
  return ['Korvo.touchPressed()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['korvo_ble_touch_point'] = function (block, generator) {
  const axis = block.getFieldValue('AXIS') === 'Y' ? 'touchY' : 'touchX';
  Arduino.korvoEnsureLibrary(generator);
  return ['Korvo.' + axis + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['korvo_ble_sd_ready'] = function (block, generator) {
  Arduino.korvoEnableRecording(generator);
  return ['Korvo.sdReady()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['korvo_ble_record_start'] = function (block, generator) {
  Arduino.korvoEnableRecording(generator);
  return 'Korvo.startRecording();\n';
};

Arduino.forBlock['korvo_ble_record_stop'] = function (block, generator) {
  Arduino.korvoEnableRecording(generator);
  return 'Korvo.stopRecording();\n';
};

Arduino.forBlock['korvo_ble_is_recording'] = function (block, generator) {
  Arduino.korvoEnableRecording(generator);
  return ['Korvo.isRecording()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['korvo_ble_record_seconds'] = function (block, generator) {
  Arduino.korvoEnableRecording(generator);
  return ['Korvo.recordingSeconds()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['korvo_ble_record_file'] = function (block, generator) {
  Arduino.korvoEnableRecording(generator);
  return ['Korvo.lastRecording()', generator.ORDER_FUNCTION_CALL];
};

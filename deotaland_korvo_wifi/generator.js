// Generator.js for deotaland_korvo_wifi (ESP32-S3-Korvo-2 V3 Wi-Fi agent, Agent Link dev korvo-wifi)

Arduino.korvoWifiEnsure = function (generator) {
  generator.addLibrary('KorvoWifiBlocks', '#include <KorvoWifiBlocks.h>');
};

// 端点 ID 只保留字母、数字和下划线
Arduino.korvoWifiId = function (value, fallback) {
  const id = String(value || '').trim().replace(/[^A-Za-z0-9_]/g, '_').slice(0, 23);
  return id || fallback;
};

// 字段文字放进 C 字符串前转义
Arduino.korvoWifiCString = function (value) {
  return '"' + String(value == null ? '' : value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, '\\n') + '"';
};

// 文字输入可能是 String、数字或字面量，统一转成 const char*
Arduino.korvoWifiText = function (code) {
  if (/^"(?:[^"\\]|\\.)*"$/.test(code)) return code;
  return 'String(' + code + ').c_str()';
};

// 下拉框的值只接受列出的几种，其余回到默认值
Arduino.korvoWifiPick = function (value, allowed, fallback) {
  return allowed.indexOf(value) >= 0 ? value : fallback;
};

// 工作区里有没有某类块；拿不到工作区时按“有”处理，模块照常启动
Arduino.korvoWifiUses = function (block, prefixes) {
  try {
    const workspace = block.workspace;
    if (!workspace || !workspace.getAllBlocks) return true;
    return workspace.getAllBlocks(false).some(function (b) {
      return prefixes.some(function (p) { return b.type.indexOf(p) === 0; });
    });
  } catch (e) {
    return true;
  }
};

// 引脚按 Korvo-2 V3 写死，换成别的 ESP32-S3 板时在代码里留个提醒
Arduino.korvoWifiBoardNote = function () {
  try {
    const boardConfig = window['boardConfig'];
    const name = boardConfig && boardConfig.name ? String(boardConfig.name) : '';
    if (name && name.toLowerCase().indexOf('korvo') === -1) {
      return '// 注意：当前开发板是 ' + name + '，本库按 ESP32-S3-Korvo-2 V3 的屏幕、音频、摄像头和触摸接线\n';
    }
  } catch (e) {}
  return '';
};

// 舵机通道下拉框的合法值：SS1~SS8，255 表示八路一起
Arduino.korvoWifiChannels = ['1', '2', '3', '4', '5', '6', '7', '8'];
Arduino.korvoWifiChannelsAll = Arduino.korvoWifiChannels.concat(['255']);

// ── 初始化与联网 ──

Arduino.forBlock['korvo_wifi_init'] = function (block, generator) {
  const nativeUi = block.getFieldValue('UI') === 'true' ? 'true' : 'false';
  const ssid = block.getFieldValue('SSID') || '';
  const password = block.getFieldValue('PASSWORD') || '';
  const debug = block.getFieldValue('DEBUG') === 'false' ? 'false' : 'true';
  const camera = Arduino.korvoWifiUses(block, ['korvo_wifi_camera_']) ? 'true' : 'false';
  const servo = Arduino.korvoWifiUses(block, ['korvo_wifi_servo']) ? 'true' : 'false';
  Arduino.korvoWifiEnsure(generator);
  if (debug === 'true') ensureSerialBegin('Serial', generator, '115200');
  // 网络、语音、触摸手势和平台控制都靠 poll 推进，每轮 loop 都要调用
  generator.addLoopBegin('korvo_wifi_poll', 'KorvoWifi.poll();\n');
  return Arduino.korvoWifiBoardNote() + 'KorvoWifi.begin(' + Arduino.korvoWifiCString(ssid) + ', ' +
    Arduino.korvoWifiCString(password) + ', ' + debug + ', ' + nativeUi + ', ' + camera + ', ' + servo + ');\n';
};

Arduino.forBlock['korvo_wifi_cloud'] = function (block, generator) {
  const action = block.getFieldValue('ACTION') === 'disconnect' ? 'disconnect' : 'connect';
  Arduino.korvoWifiEnsure(generator);
  return 'DeotalandCloud.' + action + '();\n';
};

Arduino.forBlock['korvo_wifi_state'] = function (block, generator) {
  const state = block.getFieldValue('STATE') || 'WIFI';
  const call = {
    WIFI: 'DeotalandCloud.wifiConnected()',
    PLATFORM: 'DeotalandCloud.isConnected()',
    SETUP: 'KorvoWifi.setupHotspot()',
    PAIRING: 'KorvoWifi.waitingActivation()',
    BLOCKED: 'KorvoWifi.blocked()',
    AGENT: 'KorvoWifi.agentReady()',
    CONNECTING: 'KorvoWifi.voiceConnecting()',
    VOICE: 'DeotalandCloud.isReady()',
    LISTEN: 'DeotalandCloud.isListening()',
    PLAYING: 'KorvoWifi.playing()',
  }[state] || 'DeotalandCloud.wifiConnected()';
  Arduino.korvoWifiEnsure(generator);
  return [call, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['korvo_wifi_info'] = function (block, generator) {
  const info = block.getFieldValue('INFO') || 'IP';
  const call = {
    IP: 'KorvoWifi.ipAddress()',
    CODE: 'KorvoWifi.activationCode()',
    EXPIRES: 'String(KorvoWifi.activationSeconds())',
    TITLE: 'KorvoWifi.statusTitle()',
    HINT: 'KorvoWifi.statusHint()',
    PHASE: 'KorvoWifi.phase()',
    DETAIL: 'String(KorvoWifi.statusDetail())',
    SN: 'KorvoWifi.deviceId()',
    VERSION: 'KorvoWifi.firmwareVersion()',
    AGENT: 'KorvoWifi.agentName()',
    AGENT_ID: 'String(KorvoWifi.agentId())',
    SESSION: 'KorvoWifi.session()',
    SESSION_NAME: 'KorvoWifi.currentSessionName()',
    VOICE_STATUS: 'KorvoWifi.voiceStatus()',
  }[info] || 'KorvoWifi.ipAddress()';
  Arduino.korvoWifiEnsure(generator);
  return [call, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['korvo_wifi_show_status'] = function (block, generator) {
  Arduino.korvoWifiEnsure(generator);
  return 'KorvoWifi.showStatus();\n';
};

Arduino.forBlock['korvo_wifi_reset'] = function (block, generator) {
  const action = block.getFieldValue('ACTION') === 'WIFI' ? 'resetWifi' : 'resetActivation';
  Arduino.korvoWifiEnsure(generator);
  return 'KorvoWifi.' + action + '();\n';
};

Arduino.forBlock['korvo_wifi_ui_page'] = function (block, generator) {
  const screen = {
    HOME: 'KORVO_WIFI_UI_HOME',
    APPS: 'KORVO_WIFI_UI_APPS',
    CAMERA: 'KORVO_WIFI_UI_CAMERA',
    VOICE: 'KORVO_WIFI_UI_VOICE',
    SERVO: 'KORVO_WIFI_UI_SERVO',
    STATUS: 'KORVO_WIFI_UI_STATUS',
  }[block.getFieldValue('PAGE')] || 'KORVO_WIFI_UI_HOME';
  Arduino.korvoWifiEnsure(generator);
  return 'KorvoWifi.openScreen(' + screen + ');\n';
};

// ── 会话 ──

Arduino.forBlock['korvo_wifi_session_new'] = function (block, generator) {
  Arduino.korvoWifiEnsure(generator);
  return 'KorvoWifi.newSession();\n';
};

Arduino.forBlock['korvo_wifi_session_refresh'] = function (block, generator) {
  const page = {
    FIRST: 'KORVO_WIFI_PAGE_FIRST',
    NEXT: 'KORVO_WIFI_PAGE_NEXT',
    PREV: 'KORVO_WIFI_PAGE_PREV',
  }[block.getFieldValue('PAGE')] || 'KORVO_WIFI_PAGE_FIRST';
  Arduino.korvoWifiEnsure(generator);
  return 'KorvoWifi.refreshSessions(' + page + ');\n';
};

Arduino.forBlock['korvo_wifi_session_has_page'] = function (block, generator) {
  const call = block.getFieldValue('PAGE') === 'PREV' ? 'KorvoWifi.hasPreviousPage()' : 'KorvoWifi.hasNextPage()';
  Arduino.korvoWifiEnsure(generator);
  return [call, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['korvo_wifi_session_count'] = function (block, generator) {
  Arduino.korvoWifiEnsure(generator);
  return ['KorvoWifi.sessionCount()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['korvo_wifi_session_get'] = function (block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';
  const field = { ID: 'sessionId', TIME: 'sessionTime' }[block.getFieldValue('FIELD')] || 'sessionName';
  Arduino.korvoWifiEnsure(generator);
  return ['KorvoWifi.' + field + '((int)(' + index + '))', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['korvo_wifi_session_select'] = function (block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';
  Arduino.korvoWifiEnsure(generator);
  return 'KorvoWifi.selectSession((int)(' + index + '));\n';
};

Arduino.forBlock['korvo_wifi_session_delete'] = function (block, generator) {
  Arduino.korvoWifiEnsure(generator);
  return 'KorvoWifi.deleteSession(0);\n';
};

Arduino.forBlock['korvo_wifi_session_delete_at'] = function (block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1';
  Arduino.korvoWifiEnsure(generator);
  // 0 在库里表示“当前会话”，这里的序号至少是 1
  return 'KorvoWifi.deleteSession(max(1, (int)(' + index + ')));\n';
};

// ── 语音 ──

Arduino.forBlock['korvo_wifi_voice_connect'] = function (block, generator) {
  Arduino.korvoWifiEnsure(generator);
  return 'KorvoWifi.startVoice();\n';
};

Arduino.forBlock['korvo_wifi_listen'] = function (block, generator) {
  const on = block.getFieldValue('ACTION') === 'stop' ? 'false' : 'true';
  Arduino.korvoWifiEnsure(generator);
  return 'KorvoWifi.listen(' + on + ');\n';
};

Arduino.forBlock['korvo_wifi_voice_end'] = function (block, generator) {
  Arduino.korvoWifiEnsure(generator);
  return 'KorvoWifi.endVoice();\n';
};

Arduino.forBlock['korvo_wifi_on_text'] = function (block, generator) {
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  Arduino.korvoWifiEnsure(generator);
  generator.addFunction('korvo_wifi_on_agent_text', 'void korvo_wifi_on_agent_text() {\n' + handler + '}\n');
  generator.addSetupBegin('korvo_wifi_on_agent_text', 'KorvoWifi.onText(korvo_wifi_on_agent_text);\n');
  return '';
};

Arduino.forBlock['korvo_wifi_agent_text'] = function (block, generator) {
  Arduino.korvoWifiEnsure(generator);
  return ['KorvoWifi.text()', generator.ORDER_FUNCTION_CALL];
};

// ── 屏幕与摄像头 ──

Arduino.forBlock['korvo_wifi_screen_clear'] = function (block, generator) {
  const color = block.getFieldValue('COLOR') || '0x0000';
  Arduino.korvoWifiEnsure(generator);
  return 'DeotalandScreen.clear(' + color + ');\n';
};

Arduino.forBlock['korvo_wifi_screen_text'] = function (block, generator) {
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '20';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '20';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  const color = block.getFieldValue('COLOR') || '0xFFFF';
  Arduino.korvoWifiEnsure(generator);
  return 'KorvoWifi.showText(' + x + ', ' + y + ', ' + Arduino.korvoWifiText(text) + ', ' + color + ');\n';
};

Arduino.forBlock['korvo_wifi_screen_big'] = function (block, generator) {
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '20';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '100';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  const color = block.getFieldValue('COLOR') || '0xFFFF';
  const size = generator.valueToCode(block, 'SIZE', generator.ORDER_ATOMIC) || '3';
  Arduino.korvoWifiEnsure(generator);
  return 'DeotalandScreen.text(' + x + ', ' + y + ', ' + Arduino.korvoWifiText(text) + ', ' + color +
    ', 0, constrain(' + size + ', 1, 8));\n';
};

Arduino.forBlock['korvo_wifi_screen_rect'] = function (block, generator) {
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '20';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '20';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '100';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '40';
  const color = block.getFieldValue('COLOR') || '0xFFFF';
  const fill = block.getFieldValue('FILL') === 'false' ? 'false' : 'true';
  Arduino.korvoWifiEnsure(generator);
  return 'DeotalandScreen.rect(' + x + ', ' + y + ', ' + width + ', ' + height + ', ' + color + ', ' + fill + ');\n';
};

Arduino.forBlock['korvo_wifi_backlight'] = function (block, generator) {
  const state = block.getFieldValue('STATE') === 'false' ? 'false' : 'true';
  Arduino.korvoWifiEnsure(generator);
  return 'DeotalandScreen.backlight(' + state + ');\n';
};

Arduino.forBlock['korvo_wifi_camera_preview'] = function (block, generator) {
  Arduino.korvoWifiEnsure(generator);
  return 'DeotalandCamera.drawPreview();\n';
};

Arduino.forBlock['korvo_wifi_camera_stop'] = function (block, generator) {
  Arduino.korvoWifiEnsure(generator);
  return 'DeotalandCamera.stopPreview();\n';
};

// ── 触摸 ──

Arduino.forBlock['korvo_wifi_touch_pressed'] = function (block, generator) {
  Arduino.korvoWifiEnsure(generator);
  return ['DeotalandTouch.pressed()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['korvo_wifi_touch_point'] = function (block, generator) {
  const axis = block.getFieldValue('AXIS') === 'Y' ? 'y' : 'x';
  Arduino.korvoWifiEnsure(generator);
  return ['(int)DeotalandTouch.' + axis + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['korvo_wifi_touch_gesture'] = function (block, generator) {
  const gesture = {
    TAP: 'KORVO_WIFI_TAP',
    LEFT: 'KORVO_WIFI_SWIPE_LEFT',
    RIGHT: 'KORVO_WIFI_SWIPE_RIGHT',
    UP: 'KORVO_WIFI_SWIPE_UP',
    DOWN: 'KORVO_WIFI_SWIPE_DOWN',
  }[block.getFieldValue('GESTURE')] || 'KORVO_WIFI_TAP';
  Arduino.korvoWifiEnsure(generator);
  return ['KorvoWifi.gesture(' + gesture + ')', generator.ORDER_FUNCTION_CALL];
};

// ── 声音 ──

Arduino.forBlock['korvo_wifi_volume'] = function (block, generator) {
  const volume = generator.valueToCode(block, 'VOLUME', generator.ORDER_ATOMIC) || '70';
  Arduino.korvoWifiEnsure(generator);
  return 'DeotalandSpeaker.volume(constrain((int)(' + volume + '), 0, 100));\n';
};

Arduino.forBlock['korvo_wifi_tone'] = function (block, generator) {
  const frequency = generator.valueToCode(block, 'FREQUENCY', generator.ORDER_ATOMIC) || '440';
  const duration = generator.valueToCode(block, 'DURATION', generator.ORDER_ATOMIC) || '300';
  Arduino.korvoWifiEnsure(generator);
  return 'KorvoWifi.tone((int)(' + frequency + '), (int)(' + duration + '));\n';
};

Arduino.forBlock['korvo_wifi_mic'] = function (block, generator) {
  const action = block.getFieldValue('ACTION') === 'stop' ? 'stop' : 'start';
  Arduino.korvoWifiEnsure(generator);
  return 'DeotalandMicrophone.' + action + '();\n';
};

Arduino.forBlock['korvo_wifi_mic_level'] = function (block, generator) {
  Arduino.korvoWifiEnsure(generator);
  return ['(int)DeotalandMicrophone.level()', generator.ORDER_FUNCTION_CALL];
};

// ── 舵机：新版四字节固件，命令后自动读回状态 ──

Arduino.forBlock['korvo_wifi_servo'] = function (block, generator) {
  const channel = Arduino.korvoWifiPick(block.getFieldValue('CHANNEL'), Arduino.korvoWifiChannelsAll, '1');
  const mode = Arduino.korvoWifiPick(block.getFieldValue('MODE'), ['KORVO_WIFI_SERVO_180', 'KORVO_WIFI_SERVO_360'], 'KORVO_WIFI_SERVO_180');
  const angle = generator.valueToCode(block, 'ANGLE', generator.ORDER_ATOMIC) || '90';
  Arduino.korvoWifiEnsure(generator);
  return 'KorvoWifi.servo(' + channel + ', ' + mode + ', (int)(' + angle + '));\n';
};

Arduino.forBlock['korvo_wifi_servo_speed'] = function (block, generator) {
  const channel = Arduino.korvoWifiPick(block.getFieldValue('CHANNEL'), Arduino.korvoWifiChannelsAll, '1');
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '0';
  Arduino.korvoWifiEnsure(generator);
  return 'KorvoWifi.servo(' + channel + ', KORVO_WIFI_SERVO_SPEED, (int)(' + speed + '));\n';
};

Arduino.forBlock['korvo_wifi_servo_stop'] = function (block, generator) {
  const channel = Arduino.korvoWifiPick(block.getFieldValue('CHANNEL'), Arduino.korvoWifiChannelsAll, '1');
  Arduino.korvoWifiEnsure(generator);
  // 停止：连续旋转速度 0（中位脉冲）；释放：关闭脉冲
  if (block.getFieldValue('ACTION') === 'RELEASE') return 'KorvoWifi.servo(' + channel + ', KORVO_WIFI_SERVO_RELEASE, 0);\n';
  return 'KorvoWifi.servo(' + channel + ', KORVO_WIFI_SERVO_SPEED, 0);\n';
};

Arduino.forBlock['korvo_wifi_servo_read'] = function (block, generator) {
  Arduino.korvoWifiEnsure(generator);
  return 'KorvoWifi.servoRead();\n';
};

Arduino.forBlock['korvo_wifi_servo_value'] = function (block, generator) {
  const channel = Arduino.korvoWifiPick(block.getFieldValue('CHANNEL'), Arduino.korvoWifiChannels, '1');
  const call = block.getFieldValue('FIELD') === 'MODE' ? 'servoMode' : 'servoValue';
  Arduino.korvoWifiEnsure(generator);
  return ['KorvoWifi.' + call + '(' + channel + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['korvo_wifi_servo_ok'] = function (block, generator) {
  const call = block.getFieldValue('WHICH') === 'READ' ? 'KorvoWifi.servoReadOk()' : 'KorvoWifi.servoWriteOk()';
  Arduino.korvoWifiEnsure(generator);
  return [call, generator.ORDER_FUNCTION_CALL];
};

// ── 平台控制 ──

Arduino.forBlock['korvo_wifi_on_control'] = function (block, generator) {
  const id = Arduino.korvoWifiId(block.getFieldValue('ID'), 'control0');
  const label = block.getFieldValue('LABEL') || id;
  const type = Arduino.korvoWifiPick(block.getFieldValue('TYPE'), ['KORVO_WIFI_NUMBER', 'KORVO_WIFI_SWITCH', 'KORVO_WIFI_TEXT'], 'KORVO_WIFI_SWITCH');
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  const fn = 'korvo_wifi_control_' + id;
  Arduino.korvoWifiEnsure(generator);
  generator.addFunction(fn, 'void ' + fn + '() {\n' + handler + '}\n');
  // 端点要在 KorvoWifi.begin() 之前登记，放到 setup 最前面
  generator.addSetupBegin('korvo_wifi_endpoint_' + id,
    'KorvoWifi.addControl("' + id + '", ' + type + ', ' + Arduino.korvoWifiCString(label) + ', ' + fn + ');\n');
  return '';
};

Arduino.forBlock['korvo_wifi_control_value'] = function (block, generator) {
  const kind = block.getFieldValue('KIND') || 'NUMBER';
  Arduino.korvoWifiEnsure(generator);
  if (kind === 'SWITCH') return ['KorvoWifi.controlSwitch()', generator.ORDER_FUNCTION_CALL];
  if (kind === 'TEXT') return ['KorvoWifi.controlText()', generator.ORDER_FUNCTION_CALL];
  return ['KorvoWifi.controlNumber()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['korvo_wifi_report'] = function (block, generator) {
  const id = Arduino.korvoWifiId(block.getFieldValue('ID'), 'data0');
  const label = block.getFieldValue('LABEL') || id;
  const type = Arduino.korvoWifiPick(block.getFieldValue('TYPE'), ['KORVO_WIFI_NUMBER', 'KORVO_WIFI_SWITCH', 'KORVO_WIFI_TEXT'], 'KORVO_WIFI_NUMBER');
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || (type === 'KORVO_WIFI_TEXT' ? '""' : '0');
  Arduino.korvoWifiEnsure(generator);
  // 数据端点同样要在 KorvoWifi.begin() 之前登记；同一个 ID 只登记一次
  generator.addSetupBegin('korvo_wifi_reading_' + id,
    'KorvoWifi.addReading("' + id + '", ' + type + ', ' + Arduino.korvoWifiCString(label) + ');\n');
  if (type === 'KORVO_WIFI_SWITCH') return 'KorvoWifi.reportSwitch("' + id + '", (bool)(' + value + '));\n';
  if (type === 'KORVO_WIFI_TEXT') return 'KorvoWifi.reportText("' + id + '", String(' + value + '));\n';
  return 'KorvoWifi.reportNumber("' + id + '", (float)(' + value + '));\n';
};

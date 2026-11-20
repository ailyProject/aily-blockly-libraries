// @aily-project/lib-pocket-translator

Arduino.forBlock["pt_init"] = function (block, generator) {
  const btn1 = block.getFieldValue('BTN1');
  const btn2 = block.getFieldValue('BTN2');
  const ws = block.getFieldValue('WS');
  const sck = block.getFieldValue('SCK');
  const sd = block.getFieldValue('SD');
  const rate = block.getFieldValue('RATE');
  const bits = block.getFieldValue('BITS');
  const ch = block.getFieldValue('CH');
  const spkClk = block.getFieldValue('SPK_BCLK');
  const spkLrc = block.getFieldValue('SPK_LRC');
  const spkDin = block.getFieldValue('SPK_DIN');
  generator.addLibrary('pocket_translator', '#include "PocketTranslator.h"\n');
  generator.addSetupBegin('pt_init', 'ptInit(' + btn1 + ', ' + btn2 + ', ' + ws + ', ' + sck + ', ' + sd + ', ' + rate + ', ' + bits + ', ' + ch + ');\nptEnableSpeaker(' + spkClk + ', ' + spkLrc + ', ' + spkDin + ');\n');
  return '';
};

Arduino.forBlock["pt_button_edge"] = function (block, generator) {
  generator.addLibrary('pocket_translator', '#include "PocketTranslator.h"\n');
  return ['ptButtonJustPressed()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["pt_button_down"] = function (block, generator) {
  generator.addLibrary('pocket_translator', '#include "PocketTranslator.h"\n');
  return ['ptButtonDown()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["pt_record_hold"] = function (block, generator) {
  generator.addLibrary('pocket_translator', '#include "PocketTranslator.h"\n');
  const sec = generator.valueToCode(block, 'SECONDS', Arduino.ORDER_ATOMIC) || '10';
  return 'ptRecordHold(' + sec + ');\n';
};

Arduino.forBlock["pt_record_ms"] = function (block, generator) {
  generator.addLibrary('pocket_translator', '#include "PocketTranslator.h"\n');
  return ['ptRecordMs()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["pt_speech_to_text"] = function (block, generator) {
  generator.addLibrary('pocket_translator', '#include "PocketTranslator.h"\n');
  const url = generator.valueToCode(block, 'URL', Arduino.ORDER_ATOMIC) || '""';
  const token = generator.valueToCode(block, 'TOKEN', Arduino.ORDER_ATOMIC) || '""';
  const model = generator.valueToCode(block, 'MODEL', Arduino.ORDER_ATOMIC) || '""';
  return ['ptSpeechToText(String(' + url + '), String(' + token + '), String(' + model + '))', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["pt_translate"] = function (block, generator) {
  generator.addLibrary('pocket_translator', '#include "PocketTranslator.h"\n');
  const url = generator.valueToCode(block, 'URL', Arduino.ORDER_ATOMIC) || '""';
  const token = generator.valueToCode(block, 'TOKEN', Arduino.ORDER_ATOMIC) || '""';
  const model = generator.valueToCode(block, 'MODEL', Arduino.ORDER_ATOMIC) || '""';
  const txt = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  return ['ptTranslate(String(' + url + '), String(' + token + '), String(' + model + '), String(' + txt + '))', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["pt_last_error"] = function (block, generator) {
  generator.addLibrary('pocket_translator', '#include "PocketTranslator.h"\n');
  return ['ptLastError()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["pt_draw_text"] = function (block, generator) {
  generator.addLibrary('pocket_translator', '#include "PocketTranslator.h"\n');
  // 变量管理：防御性注册 TFT_eSPI 变量并监听字段内重命名（与 lib-tft-espi 相同的样板）
  if (!block._ptTftVarMonitorAttached) {
    block._ptTftVarMonitorAttached = true;
    block._ptTftVarLastName = block.getFieldValue('TFT') || 'tft';
    registerVariableToBlockly(block._ptTftVarLastName, 'TFT_eSPI');
    const varField = block.getField('TFT');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function (newName) {
        if (typeof originalFinishEditing === 'function') originalFinishEditing.call(this, newName);
        const oldName = block._ptTftVarLastName;
        if (newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'TFT_eSPI');
          block._ptTftVarLastName = newName;
        }
      };
    }
  }
  const disp = generator.getValue(block, 'TFT', 'field_variable');
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
  const txt = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  const fg = generator.valueToCode(block, 'FG', Arduino.ORDER_ATOMIC) || '0xFFFF';
  const bg = generator.valueToCode(block, 'BG', Arduino.ORDER_ATOMIC) || '0x0000';
  return 'ptDrawTextCN(' + disp + ', ' + x + ', ' + y + ', String(' + txt + '), ' + fg + ', ' + bg + ');\n';
};

Arduino.forBlock["pt_free_buffer"] = function (block, generator) {
  generator.addLibrary('pocket_translator', '#include "PocketTranslator.h"\n');
  return 'ptFreeRecordBuffer();\n';
};

Arduino.forBlock["pt_speak"] = function (block, generator) {
  generator.addLibrary('pocket_translator', '#include "PocketTranslator.h"\n');
  const url = generator.valueToCode(block, 'URL', Arduino.ORDER_ATOMIC) || '""';
  const token = generator.valueToCode(block, 'TOKEN', Arduino.ORDER_ATOMIC) || '""';
  const model = generator.valueToCode(block, 'MODEL', Arduino.ORDER_ATOMIC) || '""';
  const voice = generator.valueToCode(block, 'VOICE', Arduino.ORDER_ATOMIC) || '""';
  const txt = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  const rate = block.getFieldValue('RATE') || '16000';
  return 'ptSpeak(String(' + url + '), String(' + token + '), String(' + model + '), String(' + voice + '), String(' + txt + '), ' + rate + ');\n';
};

Arduino.forBlock["pt_speak_ok"] = function (block, generator) {
  generator.addLibrary('pocket_translator', '#include "PocketTranslator.h"\n');
  return ['ptSpeakOk()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["pt_speak_ms"] = function (block, generator) {
  generator.addLibrary('pocket_translator', '#include "PocketTranslator.h"\n');
  return ['ptSpeakMs()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["pt_set_volume"] = function (block, generator) {
  generator.addLibrary('pocket_translator', '#include "PocketTranslator.h"\n');
  const vol = generator.valueToCode(block, 'VOLUME', Arduino.ORDER_ATOMIC) || '100';
  return 'ptSetVolume(' + vol + ');\n';
};

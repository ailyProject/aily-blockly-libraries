'use strict';

const ESPUI_DEFAULT_PARENT = 'Control::noParent';

function espuiGetBoardCore() {
  if (typeof window !== 'undefined' && window['boardConfig'] && window['boardConfig'].core) {
    return String(window['boardConfig'].core).toLowerCase();
  }
  return '';
}

function espuiEnsureLibrary(generator) {
  generator.addLibrary('ESPUI', '#include <ESPUI.h>');
}

function espuiEnsureWiFi(generator) {
  const core = espuiGetBoardCore();
  if (core.indexOf('esp8266') > -1) {
    generator.addLibrary('ESPUI_WiFi', '#include <ESP8266WiFi.h>');
  } else {
    generator.addLibrary('ESPUI_WiFi', '#include <WiFi.h>');
  }
}

function espuiValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function espuiBoolField(block, name) {
  return block.getFieldValue(name) === 'TRUE' ? 'true' : 'false';
}

function espuiVarFromInput(block, fallback) {
  return block.getFieldValue('VAR') || fallback;
}

function espuiVarFromField(block, fieldName, fallback) {
  const field = block.getField(fieldName);
  if (field && typeof field.getText === 'function') {
    return field.getText() || fallback;
  }
  return block.getFieldValue(fieldName) || fallback;
}

function espuiSafeIdentifier(value, fallback) {
  let identifier = String(value || fallback || 'value').replace(/[^A-Za-z0-9_]/g, '_');
  if (!identifier) identifier = fallback || 'value';
  if (/^[0-9]/.test(identifier)) identifier = '_' + identifier;
  return identifier;
}

function espuiRegisterControlVariable(varName) {
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, 'ESPUIControl');
  }
}

function espuiAttachControlVarMonitor(block, fallback) {
  if (!block._espuiControlVarMonitorAttached) {
    block._espuiControlVarMonitorAttached = true;
    block._espuiControlVarLastName = espuiVarFromInput(block, fallback);
    espuiRegisterControlVariable(block._espuiControlVarLastName);

    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._espuiControlVarLastName;
        if (workspace && newName && newName !== oldName) {
          if (typeof renameVariableInBlockly === 'function') {
            renameVariableInBlockly(block, oldName, newName, 'ESPUIControl');
          }
          block._espuiControlVarLastName = newName;
        }
      };
    }
  }
}

function espuiDeclareControl(block, generator, fallback) {
  espuiAttachControlVarMonitor(block, fallback);
  const varName = espuiVarFromInput(block, fallback);
  espuiRegisterControlVariable(varName);
  generator.addVariable('espui_control_' + espuiSafeIdentifier(varName, fallback), 'uint16_t ' + varName + ' = 0;');
  espuiEnsureLibrary(generator);
  return varName;
}

function espuiColor(block) {
  return 'ControlColor::' + (block.getFieldValue('COLOR') || 'Turquoise');
}

function espuiParent(block, generator) {
  return espuiValue(block, generator, 'PARENT', ESPUI_DEFAULT_PARENT);
}

function espuiCallbackName(block, prefix, varName) {
  const blockId = block.id ? espuiSafeIdentifier(block.id, 'block') : 'block';
  return 'espui_' + prefix + '_' + espuiSafeIdentifier(varName, prefix) + '_' + blockId;
}

function espuiAddMinMax(varName, min, max) {
  return 'ESPUI.addControl(ControlType::Min, "", String(' + min + '), ControlColor::None, ' + varName + ');\n' +
    'ESPUI.addControl(ControlType::Max, "", String(' + max + '), ControlColor::None, ' + varName + ');\n';
}

function espuiGenericCallback(block, generator, prefix, varName, inputName, eventMacro) {
  const handlerCode = generator.statementToCode(block, inputName) || '';
  const callbackName = espuiCallbackName(block, prefix, varName);
  const functionDef = 'void ' + callbackName + '(Control* sender, int type) {\n' +
    '  if (type == ' + eventMacro + ') {\n' +
    handlerCode +
    '  }\n' +
    '}\n';
  generator.addFunction(callbackName, functionDef);
  return callbackName;
}

function espuiEnsureGetValueHelper(generator) {
  const functionDef = 'String espui_get_control_value(uint16_t id) {\n' +
    '  Control* control = ESPUI.getControl(id);\n' +
    '  if (control == nullptr) {\n' +
    '    return String("");\n' +
    '  }\n' +
    '  return control->value;\n' +
    '}\n';
  generator.addFunction('espui_get_control_value', functionDef);
}

Arduino.forBlock['espui_wifi_ap'] = function(block, generator) {
  const ssid = espuiValue(block, generator, 'SSID', '"ESPUI"');
  const password = espuiValue(block, generator, 'PASSWORD', '"espui123"');
  espuiEnsureWiFi(generator);

  return 'WiFi.mode(WIFI_AP);\n' +
    'WiFi.softAP(' + ssid + ', ' + password + ');\n';
};

Arduino.forBlock['espui_wifi_sta'] = function(block, generator) {
  const ssid = espuiValue(block, generator, 'SSID', '"Your WiFi SSID"');
  const password = espuiValue(block, generator, 'PASSWORD', '"Your WiFi Password"');
  const timeout = espuiValue(block, generator, 'TIMEOUT', '10000');
  espuiEnsureWiFi(generator);

  return 'WiFi.mode(WIFI_STA);\n' +
    'WiFi.begin(' + ssid + ', ' + password + ');\n' +
    '{\n' +
    '  unsigned long espuiWiFiStart = millis();\n' +
    '  while (WiFi.status() != WL_CONNECTED && (millis() - espuiWiFiStart) < (unsigned long)(' + timeout + ')) {\n' +
    '    delay(500);\n' +
    '  }\n' +
    '}\n';
};

Arduino.forBlock['espui_wifi_auto'] = function(block, generator) {
  const staSsid = espuiValue(block, generator, 'STA_SSID', '"Your WiFi SSID"');
  const staPassword = espuiValue(block, generator, 'STA_PASSWORD', '"Your WiFi Password"');
  const apSsid = espuiValue(block, generator, 'AP_SSID', '"ESPUI"');
  const apPassword = espuiValue(block, generator, 'AP_PASSWORD', '"espui123"');
  const timeout = espuiValue(block, generator, 'TIMEOUT', '10000');
  espuiEnsureWiFi(generator);

  return 'WiFi.mode(WIFI_STA);\n' +
    'WiFi.begin(' + staSsid + ', ' + staPassword + ');\n' +
    '{\n' +
    '  unsigned long espuiWiFiStart = millis();\n' +
    '  while (WiFi.status() != WL_CONNECTED && (millis() - espuiWiFiStart) < (unsigned long)(' + timeout + ')) {\n' +
    '    delay(500);\n' +
    '  }\n' +
    '}\n' +
    'if (WiFi.status() != WL_CONNECTED) {\n' +
    '  WiFi.mode(WIFI_AP);\n' +
    '  WiFi.softAP(' + apSsid + ', ' + apPassword + ');\n' +
    '}\n';
};

Arduino.forBlock['espui_begin'] = function(block, generator) {
  const title = espuiValue(block, generator, 'TITLE', '"ESPUI"');
  const username = espuiValue(block, generator, 'USERNAME', '"admin"');
  const password = espuiValue(block, generator, 'PASSWORD', '"admin"');
  const port = espuiValue(block, generator, 'PORT', '80');
  const mode = block.getFieldValue('MODE') || 'MEMORY';
  const auth = block.getFieldValue('AUTH') === 'TRUE';
  espuiEnsureLibrary(generator);

  const beginName = mode === 'LITTLEFS' ? 'beginLITTLEFS' : 'begin';
  const authArgs = auth ? username + ', ' + password : 'nullptr, nullptr';

  return 'ESPUI.sliderContinuous = ' + espuiBoolField(block, 'SLIDER_CONTINUOUS') + ';\n' +
    'ESPUI.captivePortal = ' + espuiBoolField(block, 'CAPTIVE_PORTAL') + ';\n' +
    'ESPUI.setVerbosity(Verbosity::Quiet);\n' +
    'ESPUI.' + beginName + '(' + title + ', ' + authArgs + ', ' + port + ');\n';
};

Arduino.forBlock['espui_prepare_filesystem'] = function(block, generator) {
  espuiEnsureLibrary(generator);
  return 'ESPUI.prepareFileSystem(' + espuiBoolField(block, 'FORMAT') + ');\n';
};

Arduino.forBlock['espui_no_parent'] = function(block, generator) {
  espuiEnsureLibrary(generator);
  return [ESPUI_DEFAULT_PARENT, generator.ORDER_ATOMIC];
};

Arduino.forBlock['espui_control_id'] = function(block, generator) {
  espuiEnsureLibrary(generator);
  return [espuiVarFromField(block, 'VAR', 'statusLabel'), generator.ORDER_ATOMIC];
};

Arduino.forBlock['espui_create_tab'] = function(block, generator) {
  const varName = espuiDeclareControl(block, generator, 'mainTab');
  const title = espuiValue(block, generator, 'TITLE', '"Main"');
  return varName + ' = ESPUI.addControl(ControlType::Tab, ' + title + ', ' + title + ', ControlColor::None);\n';
};

Arduino.forBlock['espui_create_separator'] = function(block, generator) {
  const varName = espuiDeclareControl(block, generator, 'separator1');
  const label = espuiValue(block, generator, 'LABEL', '"Section"');
  const parent = espuiParent(block, generator);
  return varName + ' = ESPUI.addControl(ControlType::Separator, ' + label + ', "", ControlColor::Alizarin, ' + parent + ');\n';
};

Arduino.forBlock['espui_create_label'] = function(block, generator) {
  const varName = espuiDeclareControl(block, generator, 'statusLabel');
  const label = espuiValue(block, generator, 'LABEL', '"Status"');
  const value = espuiValue(block, generator, 'VALUE', '"Ready"');
  const parent = espuiParent(block, generator);
  return varName + ' = ESPUI.addControl(ControlType::Label, ' + label + ', String(' + value + '), ' + espuiColor(block) + ', ' + parent + ');\n';
};

Arduino.forBlock['espui_create_button'] = function(block, generator) {
  const varName = espuiDeclareControl(block, generator, 'button1');
  const label = espuiValue(block, generator, 'LABEL', '"Button"');
  const value = espuiValue(block, generator, 'VALUE', '"Press"');
  const parent = espuiParent(block, generator);
  const downCode = generator.statementToCode(block, 'DOWN') || '';
  const upCode = generator.statementToCode(block, 'UP') || '';
  const callbackName = espuiCallbackName(block, 'button', varName);
  const functionDef = 'void ' + callbackName + '(Control* sender, int type) {\n' +
    '  if (type == B_DOWN) {\n' +
    downCode +
    '  } else if (type == B_UP) {\n' +
    upCode +
    '  }\n' +
    '}\n';
  generator.addFunction(callbackName, functionDef);

  return varName + ' = ESPUI.addControl(ControlType::Button, ' + label + ', String(' + value + '), ' + espuiColor(block) + ', ' + parent + ', ' + callbackName + ');\n';
};

Arduino.forBlock['espui_create_switcher'] = function(block, generator) {
  const varName = espuiDeclareControl(block, generator, 'switch1');
  const label = espuiValue(block, generator, 'LABEL', '"Switch"');
  const state = espuiBoolField(block, 'STATE');
  const parent = espuiParent(block, generator);
  const onCode = generator.statementToCode(block, 'ON') || '';
  const offCode = generator.statementToCode(block, 'OFF') || '';
  const callbackName = espuiCallbackName(block, 'switcher', varName);
  const functionDef = 'void ' + callbackName + '(Control* sender, int type) {\n' +
    '  if (type == S_ACTIVE) {\n' +
    onCode +
    '  } else if (type == S_INACTIVE) {\n' +
    offCode +
    '  }\n' +
    '}\n';
  generator.addFunction(callbackName, functionDef);

  return varName + ' = ESPUI.addControl(ControlType::Switcher, ' + label + ', String(' + state + ' ? "1" : "0"), ' + espuiColor(block) + ', ' + parent + ', ' + callbackName + ');\n';
};

Arduino.forBlock['espui_create_slider'] = function(block, generator) {
  const varName = espuiDeclareControl(block, generator, 'slider1');
  const label = espuiValue(block, generator, 'LABEL', '"Slider"');
  const value = espuiValue(block, generator, 'VALUE', '50');
  const min = espuiValue(block, generator, 'MIN', '0');
  const max = espuiValue(block, generator, 'MAX', '100');
  const parent = espuiParent(block, generator);
  const callbackName = espuiGenericCallback(block, generator, 'slider', varName, 'CHANGE', 'SL_VALUE');
  return varName + ' = ESPUI.addControl(ControlType::Slider, ' + label + ', String(' + value + '), ' + espuiColor(block) + ', ' + parent + ', ' + callbackName + ');\n' +
    espuiAddMinMax(varName, min, max);
};

Arduino.forBlock['espui_create_number'] = function(block, generator) {
  const varName = espuiDeclareControl(block, generator, 'number1');
  const label = espuiValue(block, generator, 'LABEL', '"Number"');
  const value = espuiValue(block, generator, 'VALUE', '0');
  const min = espuiValue(block, generator, 'MIN', '0');
  const max = espuiValue(block, generator, 'MAX', '100');
  const parent = espuiParent(block, generator);
  const callbackName = espuiGenericCallback(block, generator, 'number', varName, 'CHANGE', 'N_VALUE');
  return varName + ' = ESPUI.addControl(ControlType::Number, ' + label + ', String(' + value + '), ' + espuiColor(block) + ', ' + parent + ', ' + callbackName + ');\n' +
    espuiAddMinMax(varName, min, max);
};

Arduino.forBlock['espui_create_text'] = function(block, generator) {
  const varName = espuiDeclareControl(block, generator, 'text1');
  const label = espuiValue(block, generator, 'LABEL', '"Text"');
  const value = espuiValue(block, generator, 'VALUE', '""');
  const parent = espuiParent(block, generator);
  const inputType = block.getFieldValue('INPUT_TYPE') || 'text';
  const callbackName = espuiGenericCallback(block, generator, 'text', varName, 'CHANGE', 'T_VALUE');
  let code = varName + ' = ESPUI.addControl(ControlType::Text, ' + label + ', String(' + value + '), ' + espuiColor(block) + ', ' + parent + ', ' + callbackName + ');\n';
  if (inputType !== 'text') {
    code += 'ESPUI.setInputType(' + varName + ', "' + inputType + '");\n';
  }
  return code;
};

Arduino.forBlock['espui_create_select'] = function(block, generator) {
  const varName = espuiDeclareControl(block, generator, 'select1');
  const label = espuiValue(block, generator, 'LABEL', '"Select"');
  const value = espuiValue(block, generator, 'VALUE', '""');
  const parent = espuiParent(block, generator);
  const callbackName = espuiGenericCallback(block, generator, 'select', varName, 'CHANGE', 'S_VALUE');
  return varName + ' = ESPUI.addControl(ControlType::Select, ' + label + ', String(' + value + '), ' + espuiColor(block) + ', ' + parent + ', ' + callbackName + ');\n';
};

Arduino.forBlock['espui_add_option'] = function(block, generator) {
  espuiEnsureLibrary(generator);
  const selectVar = espuiVarFromField(block, 'SELECT', 'select1');
  const label = espuiValue(block, generator, 'LABEL', '"Option"');
  const value = espuiValue(block, generator, 'VALUE', '"option"');
  return 'ESPUI.addControl(ControlType::Option, ' + label + ', String(' + value + '), ControlColor::None, ' + selectVar + ');\n';
};

Arduino.forBlock['espui_create_pad'] = function(block, generator) {
  const varName = espuiDeclareControl(block, generator, 'pad1');
  const label = espuiValue(block, generator, 'LABEL', '"Pad"');
  const parent = espuiParent(block, generator);
  const controlType = block.getFieldValue('CENTER') === 'TRUE' ? 'ControlType::PadWithCenter' : 'ControlType::Pad';
  const handlerCode = generator.statementToCode(block, 'EVENT') || '';
  const callbackName = espuiCallbackName(block, 'pad', varName);
  const functionDef = 'void ' + callbackName + '(Control* sender, int type) {\n' + handlerCode + '}\n';
  generator.addFunction(callbackName, functionDef);
  return varName + ' = ESPUI.addControl(' + controlType + ', ' + label + ', "", ' + espuiColor(block) + ', ' + parent + ', ' + callbackName + ');\n';
};

Arduino.forBlock['espui_create_graph'] = function(block, generator) {
  const varName = espuiDeclareControl(block, generator, 'graph1');
  const label = espuiValue(block, generator, 'LABEL', '"Graph"');
  const parent = espuiParent(block, generator);
  return varName + ' = ESPUI.addControl(ControlType::Graph, ' + label + ', "", ' + espuiColor(block) + ', ' + parent + ');\n';
};

Arduino.forBlock['espui_create_gauge'] = function(block, generator) {
  const varName = espuiDeclareControl(block, generator, 'gauge1');
  const label = espuiValue(block, generator, 'LABEL', '"Gauge"');
  const value = espuiValue(block, generator, 'VALUE', '0');
  const min = espuiValue(block, generator, 'MIN', '0');
  const max = espuiValue(block, generator, 'MAX', '100');
  const parent = espuiParent(block, generator);
  return varName + ' = ESPUI.addControl(ControlType::Gauge, ' + label + ', String(' + value + '), ' + espuiColor(block) + ', ' + parent + ');\n' +
    espuiAddMinMax(varName, min, max);
};

Arduino.forBlock['espui_create_file_display'] = function(block, generator) {
  const varName = espuiDeclareControl(block, generator, 'fileView1');
  const label = espuiValue(block, generator, 'LABEL', '"File"');
  const filename = espuiValue(block, generator, 'FILENAME', '"/index.htm"');
  const parent = espuiParent(block, generator);
  return varName + ' = ESPUI.addControl(ControlType::FileDisplay, ' + label + ', String(' + filename + '), ' + espuiColor(block) + ', ' + parent + ');\n';
};

Arduino.forBlock['espui_create_accelerometer'] = function(block, generator) {
  const varName = espuiDeclareControl(block, generator, 'accel1');
  const label = espuiValue(block, generator, 'LABEL', '"Accelerometer"');
  const parent = espuiParent(block, generator);
  const handlerCode = generator.statementToCode(block, 'CHANGE') || '';
  const callbackName = espuiCallbackName(block, 'accelerometer', varName);
  const functionDef = 'void ' + callbackName + '(Control* sender, int type) {\n' + handlerCode + '}\n';
  generator.addFunction(callbackName, functionDef);
  return varName + ' = ESPUI.addControl(ControlType::Accel, ' + label + ', "", ' + espuiColor(block) + ', ' + parent + ', ' + callbackName + ');\n';
};

Arduino.forBlock['espui_update_value'] = function(block, generator) {
  espuiEnsureLibrary(generator);
  const varName = espuiVarFromField(block, 'VAR', 'statusLabel');
  const value = espuiValue(block, generator, 'VALUE', '""');
  return 'ESPUI.updateControlValue(' + varName + ', String(' + value + '));\n';
};

Arduino.forBlock['espui_update_control_label'] = function(block, generator) {
  espuiEnsureLibrary(generator);
  const varName = espuiVarFromField(block, 'VAR', 'statusLabel');
  const label = espuiValue(block, generator, 'LABEL', '"Label"');
  return 'ESPUI.updateControlLabel(' + varName + ', ' + label + ');\n';
};

Arduino.forBlock['espui_update_switcher'] = function(block, generator) {
  espuiEnsureLibrary(generator);
  const varName = espuiVarFromField(block, 'VAR', 'switch1');
  const state = espuiValue(block, generator, 'STATE', 'false');
  return 'ESPUI.updateSwitcher(' + varName + ', ' + state + ');\n';
};

Arduino.forBlock['espui_update_number'] = function(block, generator) {
  espuiEnsureLibrary(generator);
  const varName = espuiVarFromField(block, 'VAR', 'slider1');
  const value = espuiValue(block, generator, 'VALUE', '0');
  return 'ESPUI.updateControlValue(' + varName + ', String(' + value + '));\n';
};

Arduino.forBlock['espui_add_graph_point'] = function(block, generator) {
  espuiEnsureLibrary(generator);
  const varName = espuiVarFromField(block, 'VAR', 'graph1');
  const value = espuiValue(block, generator, 'VALUE', '0');
  return 'ESPUI.addGraphPoint(' + varName + ', ' + value + ');\n';
};

Arduino.forBlock['espui_clear_graph'] = function(block, generator) {
  espuiEnsureLibrary(generator);
  const varName = espuiVarFromField(block, 'VAR', 'graph1');
  return 'ESPUI.clearGraph(' + varName + ');\n';
};

Arduino.forBlock['espui_set_enabled'] = function(block, generator) {
  espuiEnsureLibrary(generator);
  const varName = espuiVarFromField(block, 'VAR', 'button1');
  const enabled = espuiValue(block, generator, 'ENABLED', 'true');
  return 'ESPUI.setEnabled(' + varName + ', ' + enabled + ');\n';
};

Arduino.forBlock['espui_set_visible'] = function(block, generator) {
  espuiEnsureLibrary(generator);
  const varName = espuiVarFromField(block, 'VAR', 'statusLabel');
  const visible = espuiValue(block, generator, 'VISIBLE', 'true');
  return 'ESPUI.updateVisibility(' + varName + ', ' + visible + ');\n';
};

Arduino.forBlock['espui_set_layout'] = function(block, generator) {
  espuiEnsureLibrary(generator);
  const varName = espuiVarFromField(block, 'VAR', 'slider1');
  const wide = espuiValue(block, generator, 'WIDE', 'false');
  const vertical = espuiValue(block, generator, 'VERTICAL', 'false');
  return 'ESPUI.setPanelWide(' + varName + ', ' + wide + ');\n' +
    'ESPUI.setVertical(' + varName + ', ' + vertical + ');\n' +
    'ESPUI.updateControl(' + varName + ');\n';
};

Arduino.forBlock['espui_set_style'] = function(block, generator) {
  espuiEnsureLibrary(generator);
  const varName = espuiVarFromField(block, 'VAR', 'statusLabel');
  const css = espuiValue(block, generator, 'CSS', '""');
  if (block.getFieldValue('TARGET') === 'ELEMENT') {
    return 'ESPUI.setElementStyle(' + varName + ', String(' + css + '));\n';
  }
  return 'ESPUI.setPanelStyle(' + varName + ', String(' + css + '));\n';
};

Arduino.forBlock['espui_set_input_type'] = function(block, generator) {
  espuiEnsureLibrary(generator);
  const varName = espuiVarFromField(block, 'VAR', 'text1');
  const inputType = block.getFieldValue('INPUT_TYPE') || 'text';
  return 'ESPUI.setInputType(' + varName + ', "' + inputType + '");\n';
};

Arduino.forBlock['espui_get_value'] = function(block, generator) {
  espuiEnsureLibrary(generator);
  espuiEnsureGetValueHelper(generator);
  const varName = espuiVarFromField(block, 'VAR', 'statusLabel');
  return ['espui_get_control_value(' + varName + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['espui_sender_value'] = function(block, generator) {
  return ['sender->value', generator.ORDER_ATOMIC];
};

Arduino.forBlock['espui_sender_value_number'] = function(block, generator) {
  return ['sender->value.toInt()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['espui_sender_id'] = function(block, generator) {
  return ['sender->id', generator.ORDER_ATOMIC];
};

Arduino.forBlock['espui_event_type'] = function(block, generator) {
  return ['type', generator.ORDER_ATOMIC];
};

Arduino.forBlock['espui_event_is'] = function(block, generator) {
  return ['(type == ' + (block.getFieldValue('EVENT') || 'B_DOWN') + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['espui_if_event'] = function(block, generator) {
  const event = block.getFieldValue('EVENT') || 'B_DOWN';
  const statements = generator.statementToCode(block, 'DO') || '';
  return 'if (type == ' + event + ') {\n' + statements + '}\n';
};

Arduino.forBlock['espui_wifi_connected'] = function(block, generator) {
  espuiEnsureWiFi(generator);
  return ['(WiFi.status() == WL_CONNECTED)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['espui_ip_address'] = function(block, generator) {
  espuiEnsureWiFi(generator);
  if (block.getFieldValue('MODE') === 'AP') {
    return ['WiFi.softAPIP().toString()', generator.ORDER_ATOMIC];
  }
  return ['WiFi.localIP().toString()', generator.ORDER_ATOMIC];
};
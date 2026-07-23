'use strict';

const MIAOUI_OBJECT_TYPE = 'MiaoUI';
const MIAOUI_PAGE_TYPE = 'MiaoUIPage';
const MIAOUI_ITEM_TYPE = 'MiaoUIItem';

function miaouiEnsureLibrary(generator) {
  generator.addLibrary('MiaoUI', '#include <MiaoUI.h>');
}

function miaouiSafeIdentifier(value, fallback) {
  let name = String(value || fallback || 'miaoui')
    .replace(/[^A-Za-z0-9_]/g, '_');
  if (!name) name = fallback || 'miaoui';
  if (/^[0-9]/.test(name)) name = '_' + name;
  return name;
}

function miaouiCString(value) {
  return JSON.stringify(String(value == null ? '' : value));
}

function miaouiFieldVariable(block, fieldName, fallback) {
  const field = block.getField(fieldName);
  const value = field && typeof field.getText === 'function'
    ? field.getText()
    : block.getFieldValue(fieldName);
  return miaouiSafeIdentifier(value, fallback);
}

function miaouiValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function miaouiRegisterVariable(name, type) {
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(name, type);
  }
}

function miaouiAttachRenameMonitor(block, fieldName, variableType, fallback) {
  const key = '_varMonitorAttached_miaoui_' + fieldName + '_' + variableType;
  const lastNameKey = key + '_lastName';
  if (block[key]) return;

  block[key] = true;
  block[lastNameKey] = block.getFieldValue(fieldName) || fallback;
  miaouiRegisterVariable(block[lastNameKey], variableType);

  const field = block.getField(fieldName);
  if (!field) return;

  const originalFinishEditing = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, newName);
    }
    const workspace = block.workspace || (
      typeof Blockly !== 'undefined' &&
      Blockly.getMainWorkspace &&
      Blockly.getMainWorkspace()
    );
    const oldName = block[lastNameKey];
    if (
      workspace &&
      newName &&
      newName !== oldName &&
      typeof renameVariableInBlockly === 'function'
    ) {
      renameVariableInBlockly(block, oldName, newName, variableType);
      block[lastNameKey] = newName;
    }
  };
}

function miaouiMenuVariable(block) {
  return miaouiFieldVariable(block, 'VAR', 'menu');
}

function miaouiDeclareItem(block, generator, fallback) {
  const rawName = block.getFieldValue('ITEM') || fallback;
  const itemName = miaouiSafeIdentifier(rawName, fallback);
  miaouiAttachRenameMonitor(block, 'ITEM', MIAOUI_ITEM_TYPE, fallback);
  miaouiRegisterVariable(rawName, MIAOUI_ITEM_TYPE);
  generator.addObject(
    'miaoui_item_' + itemName,
    'static ui_item_t ' + itemName + '{};'
  );
  return itemName;
}

Arduino.forBlock['miaoui_init'] = function(block, generator) {
  miaouiAttachRenameMonitor(block, 'VAR', MIAOUI_OBJECT_TYPE, 'menu');

  const rawVarName = block.getFieldValue('VAR') || 'menu';
  const varName = miaouiSafeIdentifier(rawVarName, 'menu');
  const displayName = miaouiSafeIdentifier(
    block.getFieldValue('DISPLAY'),
    'u8g2'
  );
  const firstItem = miaouiFieldVariable(block, 'FIRST_ITEM', 'mainHeader');
  const initializeDisplay = block.getFieldValue('INIT_DISPLAY') === 'TRUE'
    ? 'true'
    : 'false';

  miaouiEnsureLibrary(generator);
  miaouiRegisterVariable(rawVarName, MIAOUI_OBJECT_TYPE);
  generator.addObject(
    'miaoui_object_' + varName,
    'MiaoUI ' + varName + '(' + displayName + ');'
  );

  const menuCode = generator.statementToCode(block, 'MENU') || '';
  const parameterCode = generator.statementToCode(block, 'PARAMETERS') || '';
  const textCode = generator.statementToCode(block, 'TEXTS') || '';

  generator.addFunction(
    'miaoui_create_menu_tree',
    'extern "C" void Create_MenuTree(ui_t *ui) {\n' +
    '  (void)ui;\n' + menuCode +
    '}\n'
  );
  generator.addFunction(
    'miaoui_create_parameter',
    'extern "C" void Create_Parameter(ui_t *ui) {\n' +
    '  (void)ui;\n' + parameterCode +
    '}\n'
  );
  generator.addFunction(
    'miaoui_create_text',
    'extern "C" void Create_Text(ui_t *ui) {\n' +
    '  (void)ui;\n' + textCode +
    '}\n'
  );
  generator.addLoopBegin(
    'miaoui_update_' + varName,
    varName + '.update();'
  );

  return '(void)' + varName + '.begin(&' + firstItem + ', ' + initializeDisplay + ');\n';
};

Arduino.forBlock['miaoui_add_page'] = function(block, generator) {
  miaouiEnsureLibrary(generator);
  const rawPageName = block.getFieldValue('PAGE') || 'mainPage';
  const pageName = miaouiSafeIdentifier(rawPageName, 'mainPage');
  const title = miaouiCString(block.getFieldValue('TITLE') || '[Main]');
  const pageType = block.getFieldValue('TYPE') || 'UI_PAGE_TEXT';

  miaouiAttachRenameMonitor(block, 'PAGE', MIAOUI_PAGE_TYPE, 'mainPage');
  miaouiRegisterVariable(rawPageName, MIAOUI_PAGE_TYPE);
  generator.addObject(
    'miaoui_page_' + pageName,
    'static ui_page_t ' + pageName + '{};'
  );
  return 'AddPage(' + title + ', &' + pageName + ', ' + pageType + ');\n';
};

Arduino.forBlock['miaoui_add_item'] = function(block, generator) {
  miaouiEnsureLibrary(generator);
  const itemName = miaouiDeclareItem(block, generator, 'mainHeader');
  const label = miaouiCString(block.getFieldValue('LABEL') || '[Main]');
  const pageName = miaouiFieldVariable(block, 'PAGE', 'mainPage');
  const itemType = block.getFieldValue('TYPE') || 'UI_ITEM_ONCE_FUNCTION';
  const image = block.getFieldValue('IMAGE') || 'nullptr';
  return (
    'AddItem(' + label + ', ' + itemType + ', ' + image + ', &' + itemName +
    ', &' + pageName + ', nullptr, nullptr);\n'
  );
};

Arduino.forBlock['miaoui_add_navigation_item'] = function(block, generator) {
  miaouiEnsureLibrary(generator);
  const itemName = miaouiDeclareItem(block, generator, 'settingsItem');
  const label = miaouiCString(block.getFieldValue('LABEL') || 'Settings');
  const pageName = miaouiFieldVariable(block, 'PAGE', 'mainPage');
  const targetPage = miaouiFieldVariable(
    block,
    'TARGET_PAGE',
    'settingsPage'
  );
  const itemType = block.getFieldValue('TYPE') || 'UI_ITEM_PARENTS';
  const image = block.getFieldValue('IMAGE') || 'nullptr';
  return (
    'AddItem(' + label + ', ' + itemType + ', ' + image + ', &' + itemName +
    ', &' + pageName + ', &' + targetPage + ', nullptr);\n'
  );
};

Arduino.forBlock['miaoui_add_action_item'] = function(block, generator) {
  miaouiEnsureLibrary(generator);
  const itemName = miaouiDeclareItem(block, generator, 'actionItem');
  const label = miaouiCString(block.getFieldValue('LABEL') || 'Action');
  const pageName = miaouiFieldVariable(block, 'PAGE', 'mainPage');
  const itemType = block.getFieldValue('TYPE') || 'UI_ITEM_ONCE_FUNCTION';
  const image = block.getFieldValue('IMAGE') || 'nullptr';
  const body = generator.statementToCode(block, 'DO') || '';
  const callbackName = 'miaoui_' + itemName + '_callback';

  generator.addFunction(
    callbackName,
    'static void ' + callbackName + '(ui_t *ui) {\n' +
    '  (void)ui;\n' + body +
    '}\n'
  );
  return (
    'AddItem(' + label + ', ' + itemType + ', ' + image + ', &' + itemName +
    ', &' + pageName + ', nullptr, ' + callbackName + ');\n'
  );
};

Arduino.forBlock['miaoui_bind_number'] = function(block, generator) {
  miaouiEnsureLibrary(generator);
  const itemName = miaouiFieldVariable(block, 'ITEM', 'valueItem');
  const rawDataName = block.getFieldValue('DATA_VAR') || 'menuValue';
  const dataName = miaouiSafeIdentifier(rawDataName, 'menuValue');
  const dataType = block.getFieldValue('DATA_TYPE') || 'INT';
  const cType = dataType === 'FLOAT' ? 'float' : 'int';
  const uiType = dataType === 'FLOAT' ? 'UI_DATA_FLOAT' : 'UI_DATA_INT';
  const access = block.getFieldValue('ACCESS') || 'UI_DATA_ACTION_RW';
  const callbackMode = block.getFieldValue('CALLBACK_MODE') || 'NONE';
  const initial = miaouiValue(block, generator, 'INITIAL', '0');
  const minimum = miaouiValue(block, generator, 'MIN', '0');
  const maximum = miaouiValue(block, generator, 'MAX', '100');
  const step = miaouiValue(block, generator, 'STEP', '1');
  const body = generator.statementToCode(block, 'DO') || '';
  const dataObject = 'miaoui_' + itemName + '_data';
  const elementObject = 'miaoui_' + itemName + '_element';
  const callbackName = 'miaoui_' + itemName + '_' + dataName + '_changed';

  miaouiAttachRenameMonitor(block, 'DATA_VAR', 'Number', 'menuValue');
  miaouiRegisterVariable(rawDataName, 'Number');
  generator.addObject(
    'miaoui_data_objects_' + itemName,
    'static ' + cType + ' ' + dataName + ' = 0;\n' +
    'static ui_data_t ' + dataObject + '{};\n' +
    'static ui_element_t ' + elementObject + '{};'
  );

  let callback = 'nullptr';
  if (callbackMode !== 'NONE' && body.trim()) {
    callback = callbackName;
    generator.addFunction(
      callbackName,
      'static void ' + callbackName + '(ui_t *ui) {\n' +
      '  (void)ui;\n' + body +
      '}\n'
    );
  }

  return (
    dataName + ' = (' + cType + ')(' + initial + ');\n' +
    dataObject + '.name = ' + miaouiCString(rawDataName) + ';\n' +
    dataObject + '.ptr = &' + dataName + ';\n' +
    dataObject + '.function = ' + callback + ';\n' +
    dataObject + '.functionType = ' +
      (callbackMode === 'NONE'
        ? 'UI_DATA_FUNCTION_EXIT_EXECUTE'
        : callbackMode) + ';\n' +
    dataObject + '.dataType = ' + uiType + ';\n' +
    dataObject + '.actionType = ' + access + ';\n' +
    dataObject + '.min = (int)(' + minimum + ');\n' +
    dataObject + '.max = (int)(' + maximum + ');\n' +
    dataObject + '.step = (float)(' + step + ');\n' +
    elementObject + '.data = &' + dataObject + ';\n' +
    'Create_element(&' + itemName + ', &' + elementObject + ');\n'
  );
};

Arduino.forBlock['miaoui_bind_switch'] = function(block, generator) {
  miaouiEnsureLibrary(generator);
  const itemName = miaouiFieldVariable(block, 'ITEM', 'switchItem');
  const rawDataName = block.getFieldValue('DATA_VAR') || 'menuSwitch';
  const dataName = miaouiSafeIdentifier(rawDataName, 'menuSwitch');
  const access = block.getFieldValue('ACCESS') || 'UI_DATA_ACTION_RW';
  const callbackMode = block.getFieldValue('CALLBACK_MODE') || 'NONE';
  const initial = miaouiValue(block, generator, 'INITIAL', 'false');
  const body = generator.statementToCode(block, 'DO') || '';
  const dataObject = 'miaoui_' + itemName + '_data';
  const elementObject = 'miaoui_' + itemName + '_element';
  const callbackName = 'miaoui_' + itemName + '_' + dataName + '_changed';

  miaouiAttachRenameMonitor(block, 'DATA_VAR', 'Boolean', 'menuSwitch');
  miaouiRegisterVariable(rawDataName, 'Boolean');
  generator.addObject(
    'miaoui_data_objects_' + itemName,
    'static uint8_t ' + dataName + ' = 0;\n' +
    'static ui_data_t ' + dataObject + '{};\n' +
    'static ui_element_t ' + elementObject + '{};'
  );

  let callback = 'nullptr';
  if (callbackMode !== 'NONE' && body.trim()) {
    callback = callbackName;
    generator.addFunction(
      callbackName,
      'static void ' + callbackName + '(ui_t *ui) {\n' +
      '  (void)ui;\n' + body +
      '}\n'
    );
  }

  return (
    dataName + ' = (' + initial + ') ? 1 : 0;\n' +
    dataObject + '.name = ' + miaouiCString(rawDataName) + ';\n' +
    dataObject + '.ptr = &' + dataName + ';\n' +
    dataObject + '.function = ' + callback + ';\n' +
    dataObject + '.functionType = ' +
      (callbackMode === 'NONE'
        ? 'UI_DATA_FUNCTION_EXIT_EXECUTE'
        : callbackMode) + ';\n' +
    dataObject + '.dataType = UI_DATA_SWITCH;\n' +
    dataObject + '.actionType = ' + access + ';\n' +
    elementObject + '.data = &' + dataObject + ';\n' +
    'Create_element(&' + itemName + ', &' + elementObject + ');\n'
  );
};

Arduino.forBlock['miaoui_bind_text'] = function(block, generator) {
  miaouiEnsureLibrary(generator);
  const itemName = miaouiFieldVariable(block, 'ITEM', 'aboutItem');
  const text = miaouiCString(block.getFieldValue('TEXT') || '');
  const textObject = 'miaoui_' + itemName + '_text';
  const elementObject = 'miaoui_' + itemName + '_text_element';

  generator.addObject(
    'miaoui_text_objects_' + itemName,
    'static ui_text_t ' + textObject + '{};\n' +
    'static ui_element_t ' + elementObject + '{};'
  );
  return (
    textObject + '.ptr = ' + text + ';\n' +
    textObject + '.font = UI_FONT;\n' +
    textObject + '.fontHight = UI_FONT_HIGHT;\n' +
    textObject + '.fontWidth = UI_FONT_WIDTH;\n' +
    elementObject + '.text = &' + textObject + ';\n' +
    'Create_element(&' + itemName + ', &' + elementObject + ');\n'
  );
};

Arduino.forBlock['miaoui_set_buttons'] = function(block, generator) {
  miaouiEnsureLibrary(generator);
  const varName = miaouiMenuVariable(block);
  const upPin = miaouiValue(block, generator, 'UP_PIN', 'MiaoUI::NoPin');
  const downPin = miaouiValue(block, generator, 'DOWN_PIN', 'MiaoUI::NoPin');
  const enterPin = miaouiValue(block, generator, 'ENTER_PIN', 'MiaoUI::NoPin');
  const activeLevel = block.getFieldValue('ACTIVE_LEVEL') || 'Low';
  const pinMode = block.getFieldValue('PIN_MODE') || 'INPUT_PULLUP';
  return (
    varName + '.setButtons(' + upPin + ', ' + downPin + ', ' + enterPin +
    ', MiaoUIButtonActiveLevel::' + activeLevel + ', ' + pinMode + ');\n'
  );
};

Arduino.forBlock['miaoui_set_debounce'] = function(block, generator) {
  miaouiEnsureLibrary(generator);
  const varName = miaouiMenuVariable(block);
  const milliseconds = miaouiValue(
    block,
    generator,
    'MILLISECONDS',
    '35'
  );
  return varName + '.setDebounceTime(' + milliseconds + ');\n';
};

Arduino.forBlock['miaoui_set_button_repeat'] = function(block, generator) {
  miaouiEnsureLibrary(generator);
  const varName = miaouiMenuVariable(block);
  const delay = miaouiValue(block, generator, 'DELAY', '450');
  const interval = miaouiValue(block, generator, 'INTERVAL', '100');
  return varName + '.setButtonRepeat(' + delay + ', ' + interval + ');\n';
};

Arduino.forBlock['miaoui_push_action'] = function(block, generator) {
  miaouiEnsureLibrary(generator);
  const varName = miaouiMenuVariable(block);
  const action = block.getFieldValue('ACTION') || 'UI_ACTION_UP';
  return '(void)' + varName + '.pushAction(' + action + ');\n';
};

Arduino.forBlock['miaoui_try_push_action'] = function(block, generator) {
  miaouiEnsureLibrary(generator);
  const varName = miaouiMenuVariable(block);
  const action = block.getFieldValue('ACTION') || 'UI_ACTION_UP';
  return [varName + '.pushAction(' + action + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['miaoui_update'] = function(block, generator) {
  miaouiEnsureLibrary(generator);
  const varName = miaouiMenuVariable(block);
  return varName + '.update();\n';
};

Arduino.forBlock['miaoui_set_background'] = function(block, generator) {
  miaouiEnsureLibrary(generator);
  const varName = miaouiMenuVariable(block);
  const inverted = miaouiValue(block, generator, 'INVERTED', 'false');
  return varName + '.state().bgColor = (' + inverted + ') ? 1 : 0;\n';
};

Arduino.forBlock['miaoui_is_begun'] = function(block, generator) {
  miaouiEnsureLibrary(generator);
  const varName = miaouiMenuVariable(block);
  return [varName + '.isBegun()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['miaoui_last_error_code'] = function(block, generator) {
  miaouiEnsureLibrary(generator);
  const varName = miaouiMenuVariable(block);
  return [
    'static_cast<uint8_t>(' + varName + '.lastError())',
    generator.ORDER_ATOMIC
  ];
};

Arduino.forBlock['miaoui_last_error_message'] = function(block, generator) {
  miaouiEnsureLibrary(generator);
  const varName = miaouiMenuVariable(block);
  return [varName + '.lastErrorMessage()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['miaoui_current_item_name'] = function(block, generator) {
  miaouiEnsureLibrary(generator);
  const varName = miaouiMenuVariable(block);
  return [
    '(' + varName + '.state().nowItem == nullptr ? "" : ' +
      varName + '.state().nowItem->itemName)',
    generator.ORDER_ATOMIC
  ];
};

'use strict';

const ASTRAUI_TYPE = 'AstraUI';
const ASTRAUI_PAGE_TYPE = 'AstraUIPage';
const ASTRAUI_ITEM_TYPE = 'AstraUIItem';
const ASTRAUI_BUTTON_TYPE = 'AstraUIButtonInput';
const ASTRAUI_DATA_TYPE = 'AstraUIData';

function astrauiEnsureLibrary(generator) {
  generator.addLibrary('AstraUI', '#include <AstraUI.h>');
}

function astrauiSafeIdentifier(value, fallback) {
  let name = String(value || fallback || 'astraui').replace(/[^A-Za-z0-9_]/g, '_');
  if (!name) name = fallback || 'astraui';
  if (/^[0-9]/.test(name)) name = '_' + name;
  return name;
}

function astrauiCString(value) {
  return JSON.stringify(String(value == null ? '' : value));
}

function astrauiCheckbox(block, fieldName) {
  return block.getFieldValue(fieldName) === 'TRUE' ? 'true' : 'false';
}

function astrauiValue(block, generator, inputName, fallback) {
  return generator.valueToCode(block, inputName, generator.ORDER_ATOMIC) || fallback;
}

function astrauiFieldVariable(block, fieldName, fallback) {
  const field = block.getField(fieldName);
  const value = field && typeof field.getText === 'function'
    ? field.getText()
    : block.getFieldValue(fieldName);
  return astrauiSafeIdentifier(value, fallback);
}

function astrauiRegisterVariable(name, type) {
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(name, type);
  }
}

function astrauiAttachRenameMonitor(block, fieldName, variableType, fallback) {
  const key = '_varMonitorAttached_astraui_' + fieldName + '_' + variableType;
  const lastNameKey = key + '_lastName';
  if (block[key]) return;

  block[key] = true;
  block[lastNameKey] = block.getFieldValue(fieldName) || fallback;
  astrauiRegisterVariable(block[lastNameKey], variableType);

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

function astrauiDeclareItem(block, generator, className, constructorArgs, fallback) {
  const rawName = block.getFieldValue('VAR') || fallback;
  const itemName = astrauiSafeIdentifier(rawName, fallback);
  astrauiAttachRenameMonitor(block, 'VAR', ASTRAUI_ITEM_TYPE, fallback);
  astrauiRegisterVariable(rawName, ASTRAUI_ITEM_TYPE);
  generator.addObject(
    'astraui_item_' + itemName,
    'astra::' + className + ' ' + itemName + '(' + constructorArgs + ');'
  );
  return itemName;
}

function astrauiDeclareData(block, generator, cType, initialCode, fallback) {
  const rawName = block.getFieldValue('DATA_VAR') || fallback;
  const dataName = astrauiSafeIdentifier(rawName, fallback);
  astrauiAttachRenameMonitor(block, 'DATA_VAR', ASTRAUI_DATA_TYPE, fallback);
  astrauiRegisterVariable(rawName, ASTRAUI_DATA_TYPE);
  generator.addObject(
    'astraui_data_' + dataName,
    cType + ' ' + dataName + ' = ' + initialCode + ';'
  );
  return dataName;
}

function astrauiAddItemHandler(block, generator, itemName, eventType, inputName) {
  const body = generator.statementToCode(block, inputName || 'DO') || '';
  if (!body.trim()) return '';

  const handlerName = 'astraui_' + itemName + '_handler';
  generator.addFunction(
    handlerName,
    'void ' + handlerName + '(const astra::Event &event, void *context) {\n' +
    '  (void)context;\n' +
    '  if (event.type != astra::EventType::' + eventType + ') return;\n' +
    body +
    '}\n'
  );
  return itemName + '.setHandler(' + handlerName + ');\n';
}

Arduino.forBlock['astraui_init'] = function(block, generator) {
  astrauiAttachRenameMonitor(block, 'VAR', ASTRAUI_TYPE, 'ui');

  const rawName = block.getFieldValue('VAR') || 'ui';
  const uiName = astrauiSafeIdentifier(rawName, 'ui');
  const displayName = astrauiSafeIdentifier(block.getFieldValue('DISPLAY'), 'u8g2');
  const rootPage = astrauiFieldVariable(block, 'ROOT', 'rootPage');
  const displayReady = block.getFieldValue('DISPLAY_READY') === 'TRUE';

  astrauiEnsureLibrary(generator);
  astrauiRegisterVariable(rawName, ASTRAUI_TYPE);
  generator.addObject(
    'astraui_canvas_' + uiName,
    'astra::U8g2Canvas ' + uiName + '_canvas(' + displayName + ');'
  );
  generator.addObject(
    'astraui_ui_' + uiName,
    'astra::UI ' + uiName + '(' + uiName + '_canvas);'
  );

  const content = generator.statementToCode(block, 'CONTENT') || '';
  generator.addLoopBegin('astraui_tick_' + uiName, uiName + '.tick();');

  return content +
    uiName + '.config().behavior.beginDisplay = ' + (displayReady ? 'false' : 'true') + ';\n' +
    '(void)' + uiName + '.begin(' + rootPage + ');\n';
};

Arduino.forBlock['astraui_create_page'] = function(block, generator) {
  astrauiEnsureLibrary(generator);
  const rawName = block.getFieldValue('VAR') || 'rootPage';
  const pageName = astrauiSafeIdentifier(rawName, 'rootPage');
  const title = astrauiCString(block.getFieldValue('TITLE') || '');
  const layout = block.getFieldValue('LAYOUT') || 'List';
  const id = block.getFieldValue('ID') || 0;

  astrauiAttachRenameMonitor(block, 'VAR', ASTRAUI_PAGE_TYPE, 'rootPage');
  astrauiRegisterVariable(rawName, ASTRAUI_PAGE_TYPE);
  generator.addObject(
    'astraui_page_' + pageName,
    'astra::Page ' + pageName + '(' + title + ', astra::Layout::' + layout + ', ' + id + ');'
  );
  return '';
};

Arduino.forBlock['astraui_create_action'] = function(block, generator) {
  astrauiEnsureLibrary(generator);
  const label = astrauiCString(block.getFieldValue('LABEL') || 'Action');
  const id = block.getFieldValue('ID') || 0;
  const pageName = astrauiFieldVariable(block, 'PAGE', 'rootPage');
  const itemName = astrauiDeclareItem(
    block,
    generator,
    'ActionItem',
    label + ', ' + id,
    'actionItem'
  );
  const handler = astrauiAddItemHandler(block, generator, itemName, 'Activated', 'DO');
  return pageName + '.add(' + itemName + ');\n' + handler;
};

Arduino.forBlock['astraui_create_submenu'] = function(block, generator) {
  astrauiEnsureLibrary(generator);
  const label = astrauiCString(block.getFieldValue('LABEL') || 'Settings');
  const id = block.getFieldValue('ID') || 0;
  const pageName = astrauiFieldVariable(block, 'PAGE', 'rootPage');
  const targetName = astrauiFieldVariable(block, 'TARGET', 'settingsPage');
  const itemName = astrauiDeclareItem(
    block,
    generator,
    'SubmenuItem',
    label + ', ' + targetName + ', ' + id,
    'settingsLink'
  );
  return pageName + '.add(' + itemName + ');\n';
};

Arduino.forBlock['astraui_create_toggle'] = function(block, generator) {
  astrauiEnsureLibrary(generator);
  const label = astrauiCString(block.getFieldValue('LABEL') || 'Enabled');
  const id = block.getFieldValue('ID') || 0;
  const pageName = astrauiFieldVariable(block, 'PAGE', 'rootPage');
  const initial = astrauiCheckbox(block, 'INITIAL');
  const dataName = astrauiDeclareData(block, generator, 'bool', initial, 'enabled');
  const itemName = astrauiDeclareItem(
    block,
    generator,
    'ToggleItem',
    label + ', ' + dataName + ', ' + id,
    'toggleItem'
  );
  const handler = astrauiAddItemHandler(block, generator, itemName, 'ValueChanged', 'DO');
  return pageName + '.add(' + itemName + ');\n' + handler;
};

Arduino.forBlock['astraui_create_slider'] = function(block, generator) {
  astrauiEnsureLibrary(generator);
  const label = astrauiCString(block.getFieldValue('LABEL') || 'Level');
  const id = block.getFieldValue('ID') || 0;
  const pageName = astrauiFieldVariable(block, 'PAGE', 'rootPage');
  const initial = astrauiValue(block, generator, 'INITIAL', '50');
  const minimum = astrauiValue(block, generator, 'MIN', '0');
  const maximum = astrauiValue(block, generator, 'MAX', '100');
  const step = astrauiValue(block, generator, 'STEP', '1');
  const suffix = astrauiCString(block.getFieldValue('SUFFIX') || '');
  const dataName = astrauiDeclareData(block, generator, 'int32_t', initial, 'level');
  const itemName = astrauiDeclareItem(
    block,
    generator,
    'SliderItem',
    label + ', ' + dataName + ', ' + minimum + ', ' + maximum + ', ' + step + ', ' + suffix + ', ' + id,
    'sliderItem'
  );
  const handler = astrauiAddItemHandler(block, generator, itemName, 'ValueChanged', 'DO');
  return pageName + '.add(' + itemName + ');\n' + handler;
};

Arduino.forBlock['astraui_create_choice'] = function(block, generator) {
  astrauiEnsureLibrary(generator);
  const label = astrauiCString(block.getFieldValue('LABEL') || 'Mode');
  const id = block.getFieldValue('ID') || 0;
  const pageName = astrauiFieldVariable(block, 'PAGE', 'rootPage');
  const initial = astrauiValue(block, generator, 'INITIAL', '0');
  let options = String(block.getFieldValue('OPTIONS') || '')
    .split(',')
    .map(function(option) { return option.trim(); })
    .filter(function(option) { return option.length > 0; });
  if (!options.length) options = ['Option'];

  const dataName = astrauiDeclareData(block, generator, 'uint8_t', initial, 'mode');
  const rawItemName = block.getFieldValue('VAR') || 'choiceItem';
  const itemName = astrauiSafeIdentifier(rawItemName, 'choiceItem');
  const optionsName = itemName + '_options';
  generator.addObject(
    'astraui_options_' + itemName,
    'const char *const ' + optionsName + '[] = {' + options.map(astrauiCString).join(', ') + '};'
  );
  astrauiAttachRenameMonitor(block, 'VAR', ASTRAUI_ITEM_TYPE, 'choiceItem');
  astrauiRegisterVariable(rawItemName, ASTRAUI_ITEM_TYPE);
  generator.addObject(
    'astraui_item_' + itemName,
    'astra::ChoiceItem ' + itemName + '(' + label + ', ' + dataName + ', ' + optionsName +
      ', ' + options.length + ', ' + id + ');'
  );
  const handler = astrauiAddItemHandler(block, generator, itemName, 'ValueChanged', 'DO');
  return pageName + '.add(' + itemName + ');\n' + handler;
};

Arduino.forBlock['astraui_create_value'] = function(block, generator) {
  astrauiEnsureLibrary(generator);
  const label = astrauiCString(block.getFieldValue('LABEL') || 'Value');
  const id = block.getFieldValue('ID') || 0;
  const pageName = astrauiFieldVariable(block, 'PAGE', 'rootPage');
  const initial = astrauiValue(block, generator, 'INITIAL', '0');
  const dataType = block.getFieldValue('DATA_TYPE') || 'int32_t';
  const suffix = astrauiCString(block.getFieldValue('SUFFIX') || '');
  const dataName = astrauiDeclareData(block, generator, dataType, initial, 'statusValue');
  const rawItemName = block.getFieldValue('VAR') || 'valueItem';
  const itemName = astrauiSafeIdentifier(rawItemName, 'valueItem');
  const formatterName = 'astraui_' + itemName + '_formatter';
  const format = dataType === 'uint32_t' ? '%lu%s' : '%ld%s';
  const castType = dataType === 'uint32_t' ? 'unsigned long' : 'long';

  generator.addObject(
    'astraui_formatter_' + itemName,
    'void ' + formatterName + '(char *buffer, size_t capacity, void *context) {\n' +
    '  const ' + dataType + ' value = *static_cast<const ' + dataType + ' *>(context);\n' +
    '  snprintf(buffer, capacity, ' + astrauiCString(format) + ', static_cast<' + castType + '>(value), ' + suffix + ');\n' +
    '}'
  );
  astrauiAttachRenameMonitor(block, 'VAR', ASTRAUI_ITEM_TYPE, 'valueItem');
  astrauiRegisterVariable(rawItemName, ASTRAUI_ITEM_TYPE);
  generator.addObject(
    'astraui_item_' + itemName,
    'astra::ValueItem ' + itemName + '(' + label + ', ' + formatterName + ', &' + dataName + ', ' + id + ');'
  );
  return pageName + '.add(' + itemName + ');\n';
};

Arduino.forBlock['astraui_create_separator'] = function(block, generator) {
  astrauiEnsureLibrary(generator);
  const labelValue = block.getFieldValue('LABEL');
  const label = labelValue ? astrauiCString(labelValue) : 'nullptr';
  const id = block.getFieldValue('ID') || 0;
  const pageName = astrauiFieldVariable(block, 'PAGE', 'rootPage');
  const itemName = astrauiDeclareItem(
    block,
    generator,
    'SeparatorItem',
    label + ', ' + id,
    'separatorItem'
  );
  return pageName + '.add(' + itemName + ');\n';
};

Arduino.forBlock['astraui_set_data_value'] = function(block, generator) {
  const dataName = astrauiFieldVariable(block, 'DATA_VAR', 'statusValue');
  const value = astrauiValue(block, generator, 'VALUE', '0');
  const uiName = astrauiFieldVariable(block, 'VAR', 'ui');
  return dataName + ' = ' + value + ';\n' + uiName + '.invalidate();\n';
};

Arduino.forBlock['astraui_data_value'] = function(block, generator) {
  const dataName = astrauiFieldVariable(block, 'DATA_VAR', 'statusValue');
  return [dataName, generator.ORDER_ATOMIC];
};

Arduino.forBlock['astraui_set_item_state'] = function(block, generator) {
  const itemName = astrauiFieldVariable(block, 'ITEM', 'actionItem');
  const property = block.getFieldValue('PROPERTY') || 'setEnabled';
  const state = astrauiValue(block, generator, 'STATE', 'true');
  const uiName = astrauiFieldVariable(block, 'VAR', 'ui');
  return itemName + '.' + property + '(' + state + ');\n' + uiName + '.invalidate();\n';
};

Arduino.forBlock['astraui_set_item_label'] = function(block, generator) {
  const itemName = astrauiFieldVariable(block, 'ITEM', 'actionItem');
  const label = astrauiCString(block.getFieldValue('LABEL') || '');
  const uiName = astrauiFieldVariable(block, 'VAR', 'ui');
  return itemName + '.setLabel(' + label + ');\n' + uiName + '.invalidate();\n';
};

Arduino.forBlock['astraui_set_item_icon'] = function(block, generator) {
  const itemName = astrauiFieldVariable(block, 'ITEM', 'actionItem');
  const bitmap = astrauiSafeIdentifier(block.getFieldValue('BITMAP'), 'iconBitmap');
  const width = astrauiValue(block, generator, 'WIDTH', '16');
  const height = astrauiValue(block, generator, 'HEIGHT', '16');
  const uiName = astrauiFieldVariable(block, 'VAR', 'ui');
  return itemName + '.setIcon(' + bitmap + ', ' + width + ', ' + height + ');\n' +
    uiName + '.invalidate();\n';
};

Arduino.forBlock['astraui_set_page_options'] = function(block) {
  const pageName = astrauiFieldVariable(block, 'PAGE', 'rootPage');
  const showTitle = block.getFieldValue('SHOW_TITLE') || 'GLOBAL';
  const wrap = block.getFieldValue('WRAP') || 'GLOBAL';
  let code = '';
  code += showTitle === 'GLOBAL'
    ? pageName + '.useGlobalTitleSetting();\n'
    : pageName + '.setShowTitle(' + (showTitle === 'TRUE' ? 'true' : 'false') + ');\n';
  code += wrap === 'GLOBAL'
    ? pageName + '.useGlobalWrapSetting();\n'
    : pageName + '.setWrapNavigation(' + (wrap === 'TRUE' ? 'true' : 'false') + ');\n';
  return code;
};

Arduino.forBlock['astraui_set_theme'] = function(block) {
  const uiName = astrauiFieldVariable(block, 'VAR', 'ui');
  const prefix = uiName + '.config().theme.';
  let code = '';
  code += prefix + 'lightMode = ' + (block.getFieldValue('MODE') === 'TRUE' ? 'true' : 'false') + ';\n';
  code += prefix + 'showPageTitle = ' + astrauiCheckbox(block, 'SHOW_TITLE') + ';\n';
  code += prefix + 'showScrollbar = ' + astrauiCheckbox(block, 'SHOW_SCROLLBAR') + ';\n';
  code += prefix + 'showTileFooter = ' + astrauiCheckbox(block, 'SHOW_TILE_FOOTER') + ';\n';
  code += prefix + 'selectorWidth = astra::SelectorWidth::' +
    (block.getFieldValue('SELECTOR_WIDTH') || 'Text') + ';\n';
  return code;
};

Arduino.forBlock['astraui_set_layout_metrics'] = function(block, generator) {
  const uiName = astrauiFieldVariable(block, 'VAR', 'ui');
  const prefix = uiName + '.config().theme.';
  let code = '';
  code += prefix + 'screenPadding = ' + astrauiValue(block, generator, 'PADDING', '3') + ';\n';
  code += prefix + 'headerHeight = ' + astrauiValue(block, generator, 'HEADER_HEIGHT', '14') + ';\n';
  code += prefix + 'listRowHeight = ' + astrauiValue(block, generator, 'ROW_HEIGHT', '16') + ';\n';
  code += prefix + 'tileCellWidth = ' + astrauiValue(block, generator, 'TILE_WIDTH', '42') + ';\n';
  code += prefix + 'tileIconWidth = ' + astrauiValue(block, generator, 'ICON_WIDTH', '26') + ';\n';
  code += prefix + 'tileIconHeight = ' + astrauiValue(block, generator, 'ICON_HEIGHT', '26') + ';\n';
  return code;
};

Arduino.forBlock['astraui_set_motion'] = function(block) {
  const uiName = astrauiFieldVariable(block, 'VAR', 'ui');
  const preset = block.getFieldValue('PRESET') || 'Gentle';
  return uiName + '.config().useMotionPreset(astra::MotionPreset::' + preset + ');\n';
};

Arduino.forBlock['astraui_set_behavior'] = function(block, generator) {
  const uiName = astrauiFieldVariable(block, 'VAR', 'ui');
  const prefix = uiName + '.config().behavior.';
  let code = '';
  code += prefix + 'wrapNavigation = ' + astrauiCheckbox(block, 'WRAP') + ';\n';
  code += prefix + 'skipDisabled = ' + astrauiCheckbox(block, 'SKIP_DISABLED') + ';\n';
  code += prefix + 'rememberFocus = ' + astrauiCheckbox(block, 'REMEMBER_FOCUS') + ';\n';
  code += prefix + 'cancelEditOnBack = ' + astrauiCheckbox(block, 'CANCEL_EDIT') + ';\n';
  code += prefix + 'continuousRendering = ' + astrauiCheckbox(block, 'CONTINUOUS') + ';\n';
  code += prefix + 'idleRefreshMs = ' + astrauiValue(block, generator, 'IDLE_REFRESH', '0') + ';\n';
  code += prefix + 'toastDurationMs = ' + astrauiValue(block, generator, 'TOAST_DURATION', '1600') + ';\n';
  return code;
};

function astrauiCreateButtons(block, generator, className, fallback) {
  astrauiEnsureLibrary(generator);
  const rawName = block.getFieldValue('VAR') || fallback;
  const buttonName = astrauiSafeIdentifier(rawName, fallback);
  const uiName = astrauiFieldVariable(block, 'UI', 'ui');
  const previousPin = astrauiValue(block, generator, 'PREVIOUS_PIN', '2');
  const nextPin = astrauiValue(block, generator, 'NEXT_PIN', '3');
  const selectPin = className === 'ThreeButtonInput'
    ? ', ' + astrauiValue(block, generator, 'SELECT_PIN', '4')
    : '';
  const trigger = block.getFieldValue('TRIGGER') || 'LOW';
  const pinMode = block.getFieldValue('PIN_MODE') || 'INPUT_PULLUP';

  astrauiAttachRenameMonitor(block, 'VAR', ASTRAUI_BUTTON_TYPE, fallback);
  astrauiRegisterVariable(rawName, ASTRAUI_BUTTON_TYPE);
  generator.addObject(
    'astraui_buttons_' + buttonName,
    'astra::' + className + ' ' + buttonName + '(' + previousPin + ', ' + nextPin +
      selectPin + ', ' + trigger + ', ' + pinMode + ');'
  );
  generator.addLoopBegin(
    'astraui_buttons_update_' + buttonName,
    buttonName + '.update(' + uiName + ');'
  );
  return buttonName + '.begin();\n';
}

Arduino.forBlock['astraui_create_two_button'] = function(block, generator) {
  return astrauiCreateButtons(block, generator, 'TwoButtonInput', 'buttons');
};

Arduino.forBlock['astraui_create_three_button'] = function(block, generator) {
  return astrauiCreateButtons(block, generator, 'ThreeButtonInput', 'buttons');
};

Arduino.forBlock['astraui_set_button_timing'] = function(block, generator) {
  const buttonName = astrauiFieldVariable(block, 'VAR', 'buttons');
  let code = '';
  code += buttonName + '.timing().debounceMs = ' + astrauiValue(block, generator, 'DEBOUNCE', '25') + ';\n';
  code += buttonName + '.timing().longPressMs = ' + astrauiValue(block, generator, 'LONG_PRESS', '650') + ';\n';
  code += buttonName + '.timing().repeatDelayMs = ' + astrauiValue(block, generator, 'REPEAT_DELAY', '450') + ';\n';
  code += buttonName + '.timing().repeatIntervalMs = ' + astrauiValue(block, generator, 'REPEAT_INTERVAL', '110') + ';\n';
  return code;
};

Arduino.forBlock['astraui_dispatch'] = function(block) {
  const uiName = astrauiFieldVariable(block, 'VAR', 'ui');
  const action = block.getFieldValue('ACTION') || 'Next';
  return uiName + '.dispatch(astra::InputAction::' + action + ');\n';
};

Arduino.forBlock['astraui_show_toast'] = function(block, generator) {
  const uiName = astrauiFieldVariable(block, 'VAR', 'ui');
  const message = astrauiValue(block, generator, 'MESSAGE', '""');
  const duration = astrauiValue(block, generator, 'DURATION', '0');
  return uiName + '.showToast(' + message + ', ' + duration + ');\n';
};

Arduino.forBlock['astraui_ui_command'] = function(block) {
  const uiName = astrauiFieldVariable(block, 'VAR', 'ui');
  const command = block.getFieldValue('COMMAND') || 'invalidate';
  return uiName + '.' + command + '();\n';
};

Arduino.forBlock['astraui_open_page'] = function(block) {
  const uiName = astrauiFieldVariable(block, 'VAR', 'ui');
  const pageName = astrauiFieldVariable(block, 'PAGE', 'settingsPage');
  return '(void)' + uiName + '.open(' + pageName + ');\n';
};

Arduino.forBlock['astraui_focus'] = function(block, generator) {
  const uiName = astrauiFieldVariable(block, 'VAR', 'ui');
  const index = astrauiValue(block, generator, 'INDEX', '0');
  const animate = astrauiCheckbox(block, 'ANIMATE');
  return '(void)' + uiName + '.focus(' + index + ', ' + animate + ');\n';
};

Arduino.forBlock['astraui_set_power_save'] = function(block, generator) {
  const uiName = astrauiFieldVariable(block, 'VAR', 'ui');
  const enabled = astrauiValue(block, generator, 'ENABLED', 'true');
  return uiName + '.setPowerSave(' + enabled + ');\n';
};

Arduino.forBlock['astraui_status'] = function(block, generator) {
  const uiName = astrauiFieldVariable(block, 'VAR', 'ui');
  const status = block.getFieldValue('STATUS') || 'isBegun';
  return [uiName + '.' + status + '()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['astraui_focus_index'] = function(block, generator) {
  const uiName = astrauiFieldVariable(block, 'VAR', 'ui');
  return [uiName + '.focusIndex()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['astraui_navigation_depth'] = function(block, generator) {
  const uiName = astrauiFieldVariable(block, 'VAR', 'ui');
  return [uiName + '.navigationDepth()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['astraui_current_item_id'] = function(block, generator) {
  const uiName = astrauiFieldVariable(block, 'VAR', 'ui');
  return ['(' + uiName + '.currentItem() == nullptr ? 0 : ' + uiName + '.currentItem()->id())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['astraui_begin_result_message'] = function(block, generator) {
  const uiName = astrauiFieldVariable(block, 'VAR', 'ui');
  return ['astra::beginResultMessage(' + uiName + '.beginResult())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['astraui_when_event'] = function(block, generator) {
  const uiName = astrauiFieldVariable(block, 'VAR', 'ui');
  const body = generator.statementToCode(block, 'DO') || '';
  const handlerName = 'astraui_' + uiName + '_event_handler';
  generator.addFunction(
    handlerName,
    'void ' + handlerName + '(const astra::Event &event, void *context) {\n' +
    '  (void)context;\n' + body +
    '}\n'
  );
  generator.addSetupBegin(
    'astraui_event_handler_' + uiName,
    uiName + '.setEventHandler(' + handlerName + ');'
  );
  return '';
};

Arduino.forBlock['astraui_event_is'] = function(block, generator) {
  const eventType = block.getFieldValue('EVENT') || 'Activated';
  return ['event.type == astra::EventType::' + eventType, generator.ORDER_EQUALITY];
};

Arduino.forBlock['astraui_event_value'] = function(block, generator) {
  return ['event.value', generator.ORDER_ATOMIC];
};

Arduino.forBlock['astraui_event_item_id'] = function(block, generator) {
  return ['(event.item == nullptr ? 0 : event.item->id())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['astraui_event_page_id'] = function(block, generator) {
  return ['(event.page == nullptr ? 0 : event.page->id())', generator.ORDER_ATOMIC];
};

/**
 * LVGL Blockly Generator
 * 为LVGL图形库生成Arduino代码
 */

// ==================== 辅助函数 ====================

/**
 * 确保LVGL库被添加
 */
function ensureLvglLib(generator) {
  generator.addLibrary('lvgl', '#include <lvgl.h>');
}

/**
 * 将颜色值转换为LVGL颜色格式
 */
function colorToLvgl(color) {
  // 移除#前缀
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return 'lv_color_make(' + r + ', ' + g + ', ' + b + ')';
}

// ==================== 标签控件 ====================

Arduino.forBlock['lvgl_label_create'] = function(block, generator) {
  // 变量重命名监听
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'label1';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._lvglVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'lv_obj_t');
          block._lvglVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'label1';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return varName + ' = lv_label_create(' + parent + ');\n';
};

Arduino.forBlock['lvgl_label_set_text'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'label1';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';

  ensureLvglLib(generator);

  return 'lv_label_set_text(' + varName + ', ' + text + ');\n';
};

Arduino.forBlock['lvgl_label_set_long_mode'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'label1';
  const mode = block.getFieldValue('MODE');

  ensureLvglLib(generator);

  return 'lv_label_set_long_mode(' + varName + ', ' + mode + ');\n';
};

// ==================== 按钮控件 ====================

Arduino.forBlock['lvgl_button_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'btn1';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._lvglVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'lv_obj_t');
          block._lvglVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'btn1';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return varName + ' = lv_button_create(' + parent + ');\n';
};

// ==================== 滑动条控件 ====================

Arduino.forBlock['lvgl_slider_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'slider1';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._lvglVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'lv_obj_t');
          block._lvglVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'slider1';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return varName + ' = lv_slider_create(' + parent + ');\n';
};

Arduino.forBlock['lvgl_slider_set_value'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'slider1';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  const anim = block.getFieldValue('ANIM');

  ensureLvglLib(generator);

  return 'lv_slider_set_value(' + varName + ', ' + value + ', ' + anim + ');\n';
};

Arduino.forBlock['lvgl_slider_set_range'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'slider1';
  const min = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || '0';
  const max = generator.valueToCode(block, 'MAX', generator.ORDER_ATOMIC) || '100';

  ensureLvglLib(generator);

  return 'lv_slider_set_range(' + varName + ', ' + min + ', ' + max + ');\n';
};

Arduino.forBlock['lvgl_slider_get_value'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'slider1';

  ensureLvglLib(generator);

  return ['lv_slider_get_value(' + varName + ')', generator.ORDER_ATOMIC];
};

// ==================== 开关控件 ====================

Arduino.forBlock['lvgl_switch_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'sw1';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._lvglVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'lv_obj_t');
          block._lvglVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'sw1';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return varName + ' = lv_switch_create(' + parent + ');\n';
};

// ==================== 复选框控件 ====================

Arduino.forBlock['lvgl_checkbox_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'cb1';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._lvglVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'lv_obj_t');
          block._lvglVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'cb1';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Checkbox"';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  let code = varName + ' = lv_checkbox_create(' + parent + ');\n';
  code += 'lv_checkbox_set_text(' + varName + ', ' + text + ');\n';

  return code;
};

// ==================== 进度条控件 ====================

Arduino.forBlock['lvgl_bar_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'bar1';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._lvglVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'lv_obj_t');
          block._lvglVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'bar1';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return varName + ' = lv_bar_create(' + parent + ');\n';
};

Arduino.forBlock['lvgl_bar_set_value'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'bar1';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  const anim = block.getFieldValue('ANIM');

  ensureLvglLib(generator);

  return 'lv_bar_set_value(' + varName + ', ' + value + ', ' + anim + ');\n';
};

Arduino.forBlock['lvgl_bar_set_range'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'bar1';
  const min = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || '0';
  const max = generator.valueToCode(block, 'MAX', generator.ORDER_ATOMIC) || '100';

  ensureLvglLib(generator);

  return 'lv_bar_set_range(' + varName + ', ' + min + ', ' + max + ');\n';
};

// ==================== 圆弧控件 ====================

Arduino.forBlock['lvgl_arc_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'arc1';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._lvglVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'lv_obj_t');
          block._lvglVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'arc1';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return varName + ' = lv_arc_create(' + parent + ');\n';
};

Arduino.forBlock['lvgl_arc_set_value'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'arc1';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';

  ensureLvglLib(generator);

  return 'lv_arc_set_value(' + varName + ', ' + value + ');\n';
};

Arduino.forBlock['lvgl_arc_set_range'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'arc1';
  const min = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || '0';
  const max = generator.valueToCode(block, 'MAX', generator.ORDER_ATOMIC) || '100';

  ensureLvglLib(generator);

  return 'lv_arc_set_range(' + varName + ', ' + min + ', ' + max + ');\n';
};

// ==================== 加载动画控件 ====================

Arduino.forBlock['lvgl_spinner_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'spinner1';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._lvglVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'lv_obj_t');
          block._lvglVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'spinner1';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return varName + ' = lv_spinner_create(' + parent + ');\n';
};

Arduino.forBlock['lvgl_spinner_set_anim_params'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'spinner1';
  const time = generator.valueToCode(block, 'TIME', generator.ORDER_ATOMIC) || '1000';
  const angle = generator.valueToCode(block, 'ANGLE', generator.ORDER_ATOMIC) || '270';

  ensureLvglLib(generator);

  return 'lv_spinner_set_anim_params(' + varName + ', ' + time + ', ' + angle + ');\n';
};

// ==================== 下拉框控件 ====================

Arduino.forBlock['lvgl_dropdown_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'dropdown1';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._lvglVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'lv_obj_t');
          block._lvglVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'dropdown1';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return varName + ' = lv_dropdown_create(' + parent + ');\n';
};

Arduino.forBlock['lvgl_dropdown_set_options'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dropdown1';
  const options = generator.valueToCode(block, 'OPTIONS', generator.ORDER_ATOMIC) || '"Option1\\nOption2\\nOption3"';

  ensureLvglLib(generator);

  return 'lv_dropdown_set_options(' + varName + ', ' + options + ');\n';
};

Arduino.forBlock['lvgl_dropdown_get_selected'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dropdown1';

  ensureLvglLib(generator);

  return ['lv_dropdown_get_selected(' + varName + ')', generator.ORDER_ATOMIC];
};

// ==================== 文本框控件 ====================

Arduino.forBlock['lvgl_textarea_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'textarea1';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._lvglVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'lv_obj_t');
          block._lvglVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'textarea1';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return varName + ' = lv_textarea_create(' + parent + ');\n';
};

Arduino.forBlock['lvgl_textarea_set_text'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'textarea1';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';

  ensureLvglLib(generator);

  return 'lv_textarea_set_text(' + varName + ', ' + text + ');\n';
};

Arduino.forBlock['lvgl_textarea_get_text'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'textarea1';

  ensureLvglLib(generator);

  return ['lv_textarea_get_text(' + varName + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['lvgl_textarea_set_placeholder'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'textarea1';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';

  ensureLvglLib(generator);

  return 'lv_textarea_set_placeholder_text(' + varName + ', ' + text + ');\n';
};

// ==================== 对象通用操作 ====================

Arduino.forBlock['lvgl_obj_set_pos'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'obj';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';

  ensureLvglLib(generator);

  return 'lv_obj_set_pos(' + varName + ', ' + x + ', ' + y + ');\n';
};

Arduino.forBlock['lvgl_obj_set_size'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'obj';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '100';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '50';

  ensureLvglLib(generator);

  return 'lv_obj_set_size(' + varName + ', ' + width + ', ' + height + ');\n';
};

Arduino.forBlock['lvgl_obj_align'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'obj';
  const align = block.getFieldValue('ALIGN');
  const xOfs = generator.valueToCode(block, 'X_OFS', generator.ORDER_ATOMIC) || '0';
  const yOfs = generator.valueToCode(block, 'Y_OFS', generator.ORDER_ATOMIC) || '0';

  ensureLvglLib(generator);

  return 'lv_obj_align(' + varName + ', ' + align + ', ' + xOfs + ', ' + yOfs + ');\n';
};

Arduino.forBlock['lvgl_obj_center'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'obj';

  ensureLvglLib(generator);

  return 'lv_obj_center(' + varName + ');\n';
};

Arduino.forBlock['lvgl_obj_add_flag'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'obj';
  const flag = block.getFieldValue('FLAG');

  ensureLvglLib(generator);

  return 'lv_obj_add_flag(' + varName + ', ' + flag + ');\n';
};

Arduino.forBlock['lvgl_obj_remove_flag'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'obj';
  const flag = block.getFieldValue('FLAG');

  ensureLvglLib(generator);

  return 'lv_obj_remove_flag(' + varName + ', ' + flag + ');\n';
};

Arduino.forBlock['lvgl_obj_add_state'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'obj';
  const state = block.getFieldValue('STATE');

  ensureLvglLib(generator);

  return 'lv_obj_add_state(' + varName + ', ' + state + ');\n';
};

Arduino.forBlock['lvgl_obj_remove_state'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'obj';
  const state = block.getFieldValue('STATE');

  ensureLvglLib(generator);

  return 'lv_obj_remove_state(' + varName + ', ' + state + ');\n';
};

Arduino.forBlock['lvgl_obj_has_state'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'obj';
  const state = block.getFieldValue('STATE');

  ensureLvglLib(generator);

  return ['lv_obj_has_state(' + varName + ', ' + state + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['lvgl_obj_delete'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'obj';

  ensureLvglLib(generator);

  return 'lv_obj_delete(' + varName + ');\n';
};

// ==================== 样式设置 ====================

Arduino.forBlock['lvgl_obj_set_style_bg_color'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'obj';
  const color = block.getFieldValue('COLOR');

  ensureLvglLib(generator);

  return 'lv_obj_set_style_bg_color(' + varName + ', ' + colorToLvgl(color) + ', LV_PART_MAIN);\n';
};

Arduino.forBlock['lvgl_obj_set_style_text_color'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'obj';
  const color = block.getFieldValue('COLOR');

  ensureLvglLib(generator);

  return 'lv_obj_set_style_text_color(' + varName + ', ' + colorToLvgl(color) + ', LV_PART_MAIN);\n';
};

Arduino.forBlock['lvgl_obj_set_style_border_color'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'obj';
  const color = block.getFieldValue('COLOR');

  ensureLvglLib(generator);

  return 'lv_obj_set_style_border_color(' + varName + ', ' + colorToLvgl(color) + ', LV_PART_MAIN);\n';
};

Arduino.forBlock['lvgl_obj_set_style_border_width'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'obj';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '1';

  ensureLvglLib(generator);

  return 'lv_obj_set_style_border_width(' + varName + ', ' + width + ', LV_PART_MAIN);\n';
};

Arduino.forBlock['lvgl_obj_set_style_radius'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'obj';
  const radius = generator.valueToCode(block, 'RADIUS', generator.ORDER_ATOMIC) || '0';

  ensureLvglLib(generator);

  return 'lv_obj_set_style_radius(' + varName + ', ' + radius + ', LV_PART_MAIN);\n';
};

Arduino.forBlock['lvgl_obj_set_style_pad_all'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'obj';
  const pad = generator.valueToCode(block, 'PAD', generator.ORDER_ATOMIC) || '0';

  ensureLvglLib(generator);

  return 'lv_obj_set_style_pad_all(' + varName + ', ' + pad + ', LV_PART_MAIN);\n';
};

Arduino.forBlock['lvgl_obj_set_style_bg_opa'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'obj';
  const opa = block.getFieldValue('OPA');

  ensureLvglLib(generator);

  return 'lv_obj_set_style_bg_opa(' + varName + ', ' + opa + ', LV_PART_MAIN);\n';
};

// ==================== 事件处理 ====================

Arduino.forBlock['lvgl_event_add_cb'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'obj';
  const event = block.getFieldValue('EVENT');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  // 生成唯一的回调函数名
  const callbackName = 'lvgl_event_cb_' + varName + '_' + event.toLowerCase().replace('lv_event_', '');

  ensureLvglLib(generator);

  // 添加回调函数定义
  const functionDef = 'void ' + callbackName + '(lv_event_t * e) {\n' +
    '  lv_obj_t * obj = lv_event_get_target_obj(e);\n' +
    handlerCode +
    '}\n';

  generator.addFunction(callbackName, functionDef);

  // 在setup中添加事件注册
  const setupCode = 'lv_obj_add_event_cb(' + varName + ', ' + callbackName + ', ' + event + ', NULL);\n';
  generator.addSetupEnd(callbackName + '_setup', setupCode);

  return '';
};

// ==================== 屏幕操作 ====================

Arduino.forBlock['lvgl_screen_active'] = function(block, generator) {
  ensureLvglLib(generator);

  return ['lv_screen_active()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['lvgl_screen_load'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'screen';

  ensureLvglLib(generator);

  return 'lv_screen_load(' + varName + ');\n';
};

Arduino.forBlock['lvgl_obj_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'obj1';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._lvglVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'lv_obj_t');
          block._lvglVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'obj1';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return varName + ' = lv_obj_create(' + parent + ');\n';
};

Arduino.forBlock['lvgl_screen_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'screen1';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._lvglVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'lv_obj_t');
          block._lvglVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'screen1';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return varName + ' = lv_obj_create(NULL);\n';
};

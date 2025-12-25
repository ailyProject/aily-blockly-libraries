/**
 * LVGL Blockly Generator
 * 为LVGL图形库生成Arduino代码
 */

if (!Arduino.lvgl) {
  Arduino.lvgl = true;
  Arduino.lvgl_type = '';
}

// 监听块删除事件（将监听器绑定到工作区实例，避免重载/热替换时重复添加）
if (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace) {
  // 延迟添加监听器,确保工作区已初始化
  setTimeout(() => {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) return;

    // 如果工作区上已标记为添加过监听器则跳过（工作区作用域）
    if (workspace._lvglDeleteListenerAdded) return;

    const deleteListener = function(event) {
      if (event.type === Blockly.Events.BLOCK_DELETE) {
        if (event.oldJson && event.oldJson.type == 'lvgl_init') {
          console.log('delete LVGL macro');
          if (Arduino.lvgl_type === 'TFT_eSPI' && window['projectService']) {
            window['projectService'].removeMacro('LV_USE_TFT_ESPI')
              .then(() => console.log('LVGL macro removed'))
              .catch(err => console.error('Failed to remove LVGL macro:', err));
            Arduino.lvgl_type = '';
          }
        }
      }
    };

    workspace.addChangeListener(deleteListener);
    workspace._lvglDeleteListenerAdded = true;
    workspace._lvglDeleteListener = deleteListener;

    // 在工作区被销毁时移除监听器并清理标志（防止残留）
    // 该操作会覆盖 workspace.dispose，保留原有实现并在其中移除监听器
    if (typeof workspace.dispose === 'function') {
      const _origDispose = workspace.dispose.bind(workspace);
      workspace.dispose = function() {
        try {
          if (workspace._lvglDeleteListener) {
            workspace.removeChangeListener(workspace._lvglDeleteListener);
            workspace._lvglDeleteListener = null;
          }
        } catch (e) {
          // 忽略错误
        }
        workspace._lvglDeleteListenerAdded = false;
        _origDispose();
      };
    }
  }, 100);
}
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
Arduino.forBlock['lvgl_init'] = function(block, generator) {
  ensureLvglLib(generator);
  // generator.addSetup('lv_init', 'lv_init();');
  // generator.addSetup('lv_tick_set_cb', 'lv_tick_set_cb(millis);\n');
  const driver = block.getFieldValue('DRIVER') || 'TFT_eSPI';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '240';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '240';
  const rotation = block.getFieldValue('ROTATION') || '0';

  if (Arduino.lvgl_type !== driver) {
    console.log('selected LVGL driver:', driver);
    
    if (window['projectService'] && driver === 'TFT_eSPI') {
      window['projectService'].addMacro('LV_USE_TFT_ESPI=1')
        .then(() => {
          console.log('LVGL macro added')
          Arduino.lvgl_type = 'TFT_eSPI';
        })
        .catch(err => console.error('Failed to add LVGL macro:', err));
    }
  }

  let setupCode = '';
  setupCode += 'lv_init();\n';
  setupCode += 'lv_tick_set_cb(millis);\n';
  setupCode += 'static uint32_t draw_buf[' + width + ' * ' + height + ' / 10 * (LV_COLOR_DEPTH / 8) / 4];\n';

  if (driver === 'TFT_eSPI') {
    setupCode += 'lv_display_t * disp;\n';
    setupCode += 'disp = lv_tft_espi_create(' + width +', ' + height + ', draw_buf, sizeof(draw_buf));\n';
    setupCode += 'lv_display_set_rotation(disp, ' + rotation + ');\n';
  }

  generator.addLoopBegin('lv_task_handler', 'lv_task_handler();');

  return setupCode;
};

Arduino.forBlock['lvgl_indev_create'] = function(block, generator) {
  // 变量重命名监听
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'indev';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._lvglVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'lv_indev_t');
          block._lvglVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'indev';
  const type = block.getFieldValue('TYPE') || 'LV_INDEV_TYPE_POINTER';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';

  ensureLvglLib(generator);

  registerVariableToBlockly(varName, 'lv_indev_t');

  let callbackName = varName + '_read_cb';
  let callbackCode = '';
  callbackCode += 'void ' + callbackName + '(lv_indev_t * drv, lv_indev_data_t * data) {\n';
  callbackCode += handlerCode;
  callbackCode += '}\n';

  generator.addFunction(callbackName, callbackCode);

  let code = '';
  code += 'lv_indev_t *' + varName + ' = lv_indev_create();\n';
  code += 'lv_indev_set_type(' + varName + ', ' + type + ');\n';
  code += 'lv_indev_set_read_cb(' + varName + ', ' + callbackName + ');\n';

  return code;
};

Arduino.forBlock['lvgl_indev_data_param_set'] = function(block, generator) {
  const param = block.getFieldValue('PARAM');
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';

  let code = '';
  code += 'data->' + param + ' = ' + value + ';\n';

  return code;
};

Arduino.forBlock['lvgl_indev_state_param'] = function(block, generator) {
  const state = block.getFieldValue('STATE') || 'LV_INDEV_STATE_REL';
  return [state, generator.ORDER_ATOMIC];
};

Arduino.forBlock['lvgl_label_create'] = function(block, generator) {
  // 变量重命名监听
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'label';
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

  const varName = block.getFieldValue('VAR') || 'label';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  // generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return 'lv_obj_t *' + varName + ' = lv_label_create(' + parent + ');\n';
};

Arduino.forBlock['lvgl_label_set_text'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'label';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';

  const target = block.getInputTargetBlock('TEXT');
  let isText = false;

  if (target && target.type === 'text') {
    isText = true;
  }

  let textCode = text;
  if (!isText) {
    textCode = 'String(' + text + ').c_str()';
  }

  ensureLvglLib(generator);

  return 'lv_label_set_text(' + varName + ', ' + textCode + ');\n';
};

Arduino.forBlock['lv_label_set_text_fmt'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'label';
  const fmt = generator.valueToCode(block, 'FMT', generator.ORDER_ATOMIC) || '""';
  const args = generator.valueToCode(block, 'ARGS', generator.ORDER_ATOMIC) || '';
  
  ensureLvglLib(generator);
  
  // 如果有参数则添加，否则只使用格式字符串
  return 'lv_label_set_text_fmt(' + varName + ', ' + fmt + (args ? ', ' + args : '') + ');\n';
};

Arduino.forBlock['lvgl_label_set_long_mode'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'label';
  const mode = block.getFieldValue('MODE');

  ensureLvglLib(generator);

  return 'lv_label_set_long_mode(' + varName + ', ' + mode + ');\n';
};

// ==================== 按钮控件 ====================

Arduino.forBlock['lvgl_button_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'btn';
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

  const varName = block.getFieldValue('VAR') || 'btn';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  // generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return 'lv_obj_t *' + varName + ' = lv_button_create(' + parent + ');\n';
};

// ==================== 滑动条控件 ====================

Arduino.forBlock['lvgl_slider_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'slider';
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

  const varName = block.getFieldValue('VAR') || 'slider';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  // generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return 'lv_obj_t *' + varName + ' = lv_slider_create(' + parent + ');\n';
};

Arduino.forBlock['lvgl_slider_set_value'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'slider';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  const anim = block.getFieldValue('ANIM');

  ensureLvglLib(generator);

  return 'lv_slider_set_value(' + varName + ', ' + value + ', ' + anim + ');\n';
};

Arduino.forBlock['lvgl_slider_set_range'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'slider';
  const min = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || '0';
  const max = generator.valueToCode(block, 'MAX', generator.ORDER_ATOMIC) || '100';

  ensureLvglLib(generator);

  return 'lv_slider_set_range(' + varName + ', ' + min + ', ' + max + ');\n';
};

Arduino.forBlock['lvgl_slider_get_value'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'slider';

  ensureLvglLib(generator);

  return ['lv_slider_get_value(' + varName + ')', generator.ORDER_ATOMIC];
};

// ==================== 开关控件 ====================

Arduino.forBlock['lvgl_switch_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'sw';
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

  const varName = block.getFieldValue('VAR') || 'sw';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  // generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return 'lv_obj_t *' + varName + ' = lv_switch_create(' + parent + ');\n';
};

// ==================== 复选框控件 ====================

Arduino.forBlock['lvgl_checkbox_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'cb';
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

  const varName = block.getFieldValue('VAR') || 'cb';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Checkbox"';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  // generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  let code = 'lv_obj_t *' + varName + ' = lv_checkbox_create(' + parent + ');\n';
  code += 'lv_checkbox_set_text(' + varName + ', ' + text + ');\n';

  return code;
};

// ==================== 进度条控件 ====================

Arduino.forBlock['lvgl_bar_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'bar';
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

  const varName = block.getFieldValue('VAR') || 'bar';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  // generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return 'lv_obj_t *' + varName + ' = lv_bar_create(' + parent + ');\n';
};

Arduino.forBlock['lvgl_bar_set_value'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'bar';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  const anim = block.getFieldValue('ANIM');

  ensureLvglLib(generator);

  return 'lv_bar_set_value(' + varName + ', ' + value + ', ' + anim + ');\n';
};

Arduino.forBlock['lvgl_bar_set_range'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'bar';
  const min = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || '0';
  const max = generator.valueToCode(block, 'MAX', generator.ORDER_ATOMIC) || '100';

  ensureLvglLib(generator);

  return 'lv_bar_set_range(' + varName + ', ' + min + ', ' + max + ');\n';
};

// ==================== 圆弧控件 ====================

Arduino.forBlock['lvgl_arc_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'arc';
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

  const varName = block.getFieldValue('VAR') || 'arc';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  // generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return 'lv_obj_t *' + varName + ' = lv_arc_create(' + parent + ');\n';
};

Arduino.forBlock['lvgl_arc_set_value'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'arc';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';

  ensureLvglLib(generator);

  return 'lv_arc_set_value(' + varName + ', ' + value + ');\n';
};

Arduino.forBlock['lvgl_arc_set_range'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'arc';
  const min = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || '0';
  const max = generator.valueToCode(block, 'MAX', generator.ORDER_ATOMIC) || '100';

  ensureLvglLib(generator);

  return 'lv_arc_set_range(' + varName + ', ' + min + ', ' + max + ');\n';
};

// ==================== 加载动画控件 ====================

Arduino.forBlock['lvgl_spinner_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'spinner';
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

  const varName = block.getFieldValue('VAR') || 'spinner';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  // generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return 'lv_obj_t *' + varName + ' = lv_spinner_create(' + parent + ');\n';
};

Arduino.forBlock['lvgl_spinner_set_anim_params'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'spinner';
  const time = generator.valueToCode(block, 'TIME', generator.ORDER_ATOMIC) || '1000';
  const angle = generator.valueToCode(block, 'ANGLE', generator.ORDER_ATOMIC) || '270';

  ensureLvglLib(generator);

  return 'lv_spinner_set_anim_params(' + varName + ', ' + time + ', ' + angle + ');\n';
};

// ==================== 下拉框控件 ====================

Arduino.forBlock['lvgl_dropdown_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'dropdown';
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

  const varName = block.getFieldValue('VAR') || 'dropdown';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  // generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return 'lv_obj_t *' + varName + ' = lv_dropdown_create(' + parent + ');\n';
};

Arduino.forBlock['lvgl_dropdown_set_options'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dropdown';
  const options = generator.valueToCode(block, 'OPTIONS', generator.ORDER_ATOMIC) || '"Option1\\nOption2\\nOption3"';

  ensureLvglLib(generator);

  return 'lv_dropdown_set_options(' + varName + ', ' + options + ');\n';
};

Arduino.forBlock['lvgl_dropdown_get_selected'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dropdown';

  ensureLvglLib(generator);

  return ['lv_dropdown_get_selected(' + varName + ')', generator.ORDER_ATOMIC];
};

// ==================== 文本框控件 ====================

Arduino.forBlock['lvgl_textarea_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'textarea';
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

  const varName = block.getFieldValue('VAR') || 'textarea';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  // generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return 'lv_obj_t *' + varName + ' = lv_textarea_create(' + parent + ');\n';
};

Arduino.forBlock['lvgl_textarea_set_text'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'textarea';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';

  ensureLvglLib(generator);

  return 'lv_textarea_set_text(' + varName + ', ' + text + ');\n';
};

Arduino.forBlock['lvgl_textarea_get_text'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'textarea';

  ensureLvglLib(generator);

  return ['lv_textarea_get_text(' + varName + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['lvgl_textarea_set_placeholder'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'textarea';
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
    '  lv_event_code_t code = lv_event_get_code(e);\n' +
    '  lv_obj_t *' + varName + ' = lv_event_get_target_obj(e);\n' +
    '  if (code == ' + event + ') {\n' +
      handlerCode +
    '  }\n' +
    '}\n';

  generator.addFunction(callbackName, functionDef);

  // 在setup中添加事件注册
  const setupCode = 'lv_obj_add_event_cb(' + varName + ', ' + callbackName + ', ' + event + ', NULL);\n';
  // generator.addSetupEnd(callbackName + '_setup', setupCode);

  return setupCode;
};

Arduino.forBlock['lvgl_event_code'] = function(block, generator) {
  const eventCode = block.getFieldValue('EVENT');
  return [eventCode, generator.ORDER_ATOMIC];
};

Arduino.forBlock['lvgl_obj_get_child'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'child_obj';
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

  const varName = block.getFieldValue('VAR') || 'child_obj';

  const varField = block.getField('VAR_PARENT');
  const varParentName = varField ? varField.getText() : 'obj';
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';

  const code = 'lv_obj_t *' + varName + ' = lv_obj_get_child(' + varParentName + ', ' + index + ');\n';
  
  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  // generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');
  return code;
}

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
    block._lvglVarLastName = block.getFieldValue('VAR') || 'obj';
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

  const varName = block.getFieldValue('VAR') || 'obj';
  const parentField = block.getField('PARENT');
  const parent = parentField ? parentField.getText() : 'lv_screen_active()';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  // generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return 'lv_obj_t *' + varName + ' = lv_obj_create(' + parent + ');\n';
};

Arduino.forBlock['lvgl_screen_create'] = function(block, generator) {
  if (!block._lvglVarMonitorAttached) {
    block._lvglVarMonitorAttached = true;
    block._lvglVarLastName = block.getFieldValue('VAR') || 'screen';
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

  const varName = block.getFieldValue('VAR') || 'screen';

  ensureLvglLib(generator);
  registerVariableToBlockly(varName, 'lv_obj_t');
  // generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');

  return 'lv_obj_t *' + varName + ' = lv_obj_create(NULL);\n';
};

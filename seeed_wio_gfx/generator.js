'use strict';

// Seeed_GFX库的代码生成器
// 支持TFT_eSPI、TFT_eSprite和EPaper类

if (!Arduino.seeed_gfx) {
  Arduino.seeed_gfx = true;
  Arduino.seeed_gfx_type = '';
  Arduino.seeed_gfx_frequency = '';
}
// 监听块删除事件（将监听器绑定到工作区实例，避免重载/热替换时重复添加）
if (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace) {
  // 延迟添加监听器,确保工作区已初始化
  setTimeout(() => {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) return;

    // 如果工作区上已标记为添加过监听器则跳过（工作区作用域）
    if (workspace._seeedGfxDeleteListenerAdded) return;

    const deleteListener = function(event) {
      if (event.type === Blockly.Events.BLOCK_DELETE) {
        if (event.oldJson && (event.oldJson.type === 'seeed_gfx_init' || event.oldJson.type === 'seeed_gfx_epaper_begin')) {
          console.log('delete BOARD_SCREEN_COMBO macro');
          window['projectService'].removeMacro('BOARD_SCREEN_COMBO')
            .then(() => {
              if (Arduino.seeed_gfx_type === '502') {
                return window['projectService'].removeMacro('USE_XIAO_EPAPER_DISPLAY_BOARD_EE04')
              }
            })
            .then(() => console.log('✅ 宏定义已移除'))
            .catch(err => console.error('❌ 失败:', err));
          Arduino.seeed_gfx_type = '';
          // Arduino.seeed_gfx_frequency = '';
        }
      }
    };

    workspace.addChangeListener(deleteListener);
    workspace._seeedGfxDeleteListenerAdded = true;
    workspace._seeedGfxDeleteListener = deleteListener;

    // 在工作区被销毁时移除监听器并清理标志（防止残留）
    // 该操作会覆盖 workspace.dispose，保留原有实现并在其中移除监听器
    if (typeof workspace.dispose === 'function') {
      const _origDispose = workspace.dispose.bind(workspace);
      workspace.dispose = function() {
        try {
          if (workspace._seeedGfxDeleteListener) {
            workspace.removeChangeListener(workspace._seeedGfxDeleteListener);
            workspace._seeedGfxDeleteListener = null;
          }
        } catch (e) {
          // 忽略移除监听器可能抛出的异常
        }
        workspace._seeedGfxDeleteListenerAdded = false;
        _origDispose();
      };
    }
  }, 100);
}

// 颜色常量定义
// const COLORS = {
//   BLACK: 0x0000,
//   WHITE: 0xFFFF,
//   RED: 0xF800,
//   GREEN: 0x07E0,
//   BLUE: 0x001F,
//   YELLOW: 0xFFE0,
//   CYAN: 0x07FF,
//   MAGENTA: 0xF81F
// };

// TFT_eSPI对象创建
Arduino.forBlock['seeed_gfx_create_tft'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'tft';
  
  // 添加库引用
  generator.addLibrary('TFT_eSPI', '#include <TFT_eSPI.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
  
  // 注册变量到Blockly系统
  registerVariableToBlockly(varName, 'TFT_eSPI');
  
  // 声明TFT对象
  generator.addVariable(varName, 'TFT_eSPI ' + varName + ' = TFT_eSPI();');
  
  return '';
};

// TFT初始化
Arduino.forBlock['seeed_gfx_init'] = function(block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._tftVarMonitorAttached) {
    block._tftVarMonitorAttached = true;
    block._tftVarLastName = block.getFieldValue('VAR') || 'tft';
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._tftVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'TFT_eSPI');
          block._tftVarLastName = newName;
        }
      };
    }
  }

  var varName = block.getFieldValue('VAR') || 'tft';
  const model = '500';
  const frequency = '80000000';
  // window.add();
  if (Arduino.seeed_gfx_type !== model) {
    Arduino.seeed_gfx_type = model;
    console.log('Selected model:', model);
    console.log('data: ', window['packageJson']);

    if (window['projectService']) {
      window['projectService'].addMacro(`BOARD_SCREEN_COMBO=${model}`)
        .then(() => console.log('✅ 宏定义已更新'))
        .catch(err => console.error('❌ 失败:', err));
      // window['projectService'].addMacro(`BOARD_SCREEN_FREQUENCY=${frequency}`)
      //   .then(() => console.log('✅ 宏定义已更新'))
      //   .catch(err => console.error('❌ 失败:', err));
    }
  }

  generator.addMacro('BOARD_SCREEN_COMBO', '#define BOARD_SCREEN_COMBO ' + model);
  generator.addMacro('BOARD_SCREEN_FREQUENCY', '#define TFT_FREQUENCY ' + frequency);

  const messageData = {
    eventType: 'workspaceChanged',
    code: 'Blockly.JavaScript.workspaceToCode(workspace)'
  };

  // 发送消息给父窗口
  window.parent.postMessage(messageData, '*');
  // }

  // generator.addMacro('BOARD_SCREEN_COMBO', '#define BOARD_SCREEN_COMBO ' + model + '\n');
  // 添加库引用
  generator.addLibrary('TFT_eSPI', '#include <TFT_eSPI.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
  
  // 注册变量
  registerVariableToBlockly(varName, 'TFT_eSPI');
  generator.addObject(varName, 'TFT_eSPI ' + varName + ' = TFT_eSPI();');
  
  // 生成初始化代码
  return varName + '.init();\n';
};

// 填充屏幕
Arduino.forBlock['seeed_gfx_fill_screen'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.fillScreen(' + color + ');\n';
};

// 设置旋转
Arduino.forBlock['seeed_gfx_set_rotation'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const rotation = block.getFieldValue('ROTATION') || '0';
  
  return varName + '.setRotation(' + rotation + ');\n';
};

// 画点
Arduino.forBlock['seeed_gfx_draw_pixel'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.drawPixel(' + x + ', ' + y + ', ' + color + ');\n';
};

// 画线
Arduino.forBlock['seeed_gfx_draw_line'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0';
  const y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0';
  const x2 = generator.valueToCode(block, 'X2', generator.ORDER_ATOMIC) || '0';
  const y2 = generator.valueToCode(block, 'Y2', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.drawLine(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + color + ');\n';
};

// 画矩形
Arduino.forBlock['seeed_gfx_draw_rect'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '10';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '10';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.drawRect(' + x + ', ' + y + ', ' + width + ', ' + height + ', ' + color + ');\n';
};

// 填充矩形
Arduino.forBlock['seeed_gfx_fill_rect'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '10';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '10';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.fillRect(' + x + ', ' + y + ', ' + width + ', ' + height + ', ' + color + ');\n';
};

// 垂直渐变填充矩形
Arduino.forBlock['seeed_gfx_fill_rect_v_gradient'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '10';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '10';
  const color1 = generator.valueToCode(block, 'COLOR1', generator.ORDER_ATOMIC) || '0';
  const color2 = generator.valueToCode(block, 'COLOR2', generator.ORDER_ATOMIC) || '0';

  return varName + '.fillRectVGradient(' + x + ', ' + y + ', ' + width + ', ' + height + ', ' + color1 + ', ' + color2 + ');\n';
};

// 水平渐变填充矩形
Arduino.forBlock['seeed_gfx_fill_rect_h_gradient'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '10';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '10';
  const color1 = generator.valueToCode(block, 'COLOR1', generator.ORDER_ATOMIC) || '0';
  const color2 = generator.valueToCode(block, 'COLOR2', generator.ORDER_ATOMIC) || '0';

  return varName + '.fillRectHGradient(' + x + ', ' + y + ', ' + width + ', ' + height + ', ' + color1 + ', ' + color2 + ');\n';
};

// 画圆角矩形
Arduino.forBlock['seeed_gfx_draw_round_rect'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '10';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '10';
  const radius = generator.valueToCode(block, 'RADIUS', generator.ORDER_ATOMIC) || '5';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.drawRoundRect(' + x + ', ' + y + ', ' + width + ', ' + height + ', ' + radius + ', ' + color + ');\n';
};

// 填充圆角矩形
Arduino.forBlock['seeed_gfx_fill_round_rect'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '10';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '10';
  const radius = generator.valueToCode(block, 'RADIUS', generator.ORDER_ATOMIC) || '5';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.fillRoundRect(' + x + ', ' + y + ', ' + width + ', ' + height + ', ' + radius + ', ' + color + ');\n';
};

// 画圆
Arduino.forBlock['seeed_gfx_draw_circle'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const radius = generator.valueToCode(block, 'RADIUS', generator.ORDER_ATOMIC) || '5';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.drawCircle(' + x + ', ' + y + ', ' + radius + ', ' + color + ');\n';
};

// 填充圆
Arduino.forBlock['seeed_gfx_fill_circle'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const radius = generator.valueToCode(block, 'RADIUS', generator.ORDER_ATOMIC) || '5';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.fillCircle(' + x + ', ' + y + ', ' + radius + ', ' + color + ');\n';
};

// 画三角形
Arduino.forBlock['seeed_gfx_draw_triangle'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0';
  const y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0';
  const x2 = generator.valueToCode(block, 'X2', generator.ORDER_ATOMIC) || '0';
  const y2 = generator.valueToCode(block, 'Y2', generator.ORDER_ATOMIC) || '0';
  const x3 = generator.valueToCode(block, 'X3', generator.ORDER_ATOMIC) || '0';
  const y3 = generator.valueToCode(block, 'Y3', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  return varName + '.drawTriangle(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + x3 + ', ' + y3 + ', ' + color + ');\n';
};

// 填充三角形
Arduino.forBlock['seeed_gfx_fill_triangle'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0';
  const y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0';
  const x2 = generator.valueToCode(block, 'X2', generator.ORDER_ATOMIC) || '0';
  const y2 = generator.valueToCode(block, 'Y2', generator.ORDER_ATOMIC) || '0';
  const x3 = generator.valueToCode(block, 'X3', generator.ORDER_ATOMIC) || '0';
  const y3 = generator.valueToCode(block, 'Y3', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  return varName + '.fillTriangle(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + x3 + ', ' + y3 + ', ' + color + ');\n';
};

// 画椭圆
Arduino.forBlock['seeed_gfx_draw_ellipse'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const rx = generator.valueToCode(block, 'RX', generator.ORDER_ATOMIC) || '10';
  const ry = generator.valueToCode(block, 'RY', generator.ORDER_ATOMIC) || '5';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  return varName + '.drawEllipse(' + x + ', ' + y + ', ' + rx + ', ' + ry + ', ' + color + ');\n';
};

// 填充椭圆
Arduino.forBlock['seeed_gfx_fill_ellipse'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const rx = generator.valueToCode(block, 'RX', generator.ORDER_ATOMIC) || '10';
  const ry = generator.valueToCode(block, 'RY', generator.ORDER_ATOMIC) || '5';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  return varName + '.fillEllipse(' + x + ', ' + y + ', ' + rx + ', ' + ry + ', ' + color + ');\n';
};

// 设置文字颜色
Arduino.forBlock['seeed_gfx_set_text_color'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  const bgcolor = generator.valueToCode(block, 'BGCOLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.setTextColor(' + color + ', ' + bgcolor + ');\n';
};

// 设置文字大小
Arduino.forBlock['seeed_gfx_set_text_size'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const size = block.getFieldValue('SIZE') || '1';
  
  return varName + '.setTextSize(' + size + ');\n';
};

// 设置光标位置
Arduino.forBlock['seeed_gfx_set_cursor'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.setCursor(' + x + ', ' + y + ');\n';
};

// 打印文字
Arduino.forBlock['seeed_gfx_print'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  
  return varName + '.print(' + text + ');\n';
};

// 显示文字
Arduino.forBlock['seeed_gfx_draw_string'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const font = block.getFieldValue('FONT') || '1';
  
  return varName + '.drawString(' + text + ', ' + x + ', ' + y + ', ' + font + ');\n';
};

// 创建精灵
Arduino.forBlock['seeed_gfx_create_sprite'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'sprite';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '32';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '32';
  
  // 添加库引用
  generator.addLibrary('Seeed_GFX', '#include <TFT_eSPI.h>');
  
  // 注册变量到Blockly系统
  registerVariableToBlockly(varName, 'TFT_eSprite');
  
  // 声明精灵对象
  generator.addVariable(varName, 'TFT_eSprite ' + varName + '(&tft);');
  
  // 生成创建精灵的代码
  return varName + '.createSprite(' + width + ', ' + height + ');\n';
};

// 显示精灵
Arduino.forBlock['seeed_gfx_push_sprite'] = function(block, generator) {
  const spriteField = block.getField('SPRITE');
  const spriteName = spriteField ? spriteField.getText() : 'sprite';
  const tftField = block.getField('TFT');
  const tftName = tftField ? tftField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  
  return spriteName + '.pushSprite(' + x + ', ' + y + ');\n';
};

// 创建电子墨水屏
Arduino.forBlock['seeed_gfx_create_epaper'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'epaper';
  
  // 添加库引用
  generator.addLibrary('Seeed_GFX_EPaper', '#include <EPaper.h>');
  
  // 注册变量到Blockly系统
  registerVariableToBlockly(varName, 'EPaper');
  
  // 声明EPaper对象
  generator.addVariable(varName, 'EPaper ' + varName + ';');
  
  return '';
};

// 电子墨水屏初始化
Arduino.forBlock['seeed_gfx_epaper_begin'] = function(block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._epaperVarMonitorAttached) {
    block._epaperVarMonitorAttached = true;
    block._epaperVarLastName = block.getFieldValue('VAR') || 'epaper';
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._epaperVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'EPaper');
          block._epaperVarLastName = newName;
        }
      };
    }
  }

  var varName = block.getFieldValue('VAR') || 'epaper';
  // const varField = block.getField('VAR');
  // const varName = varField ? varField.getText() : 'epaper';
  const model = block.getFieldValue('MODEL') || '502';

  if (Arduino.seeed_gfx_type !== model) {
    Arduino.seeed_gfx_type = model;
    console.log('Selected model:', model);

    if (window['projectService']) {
      window['projectService'].addMacro(`BOARD_SCREEN_COMBO=${model}`)
        .then(() => {
          if (model === '502') {
            return window['projectService'].addMacro('USE_XIAO_EPAPER_DISPLAY_BOARD_EE04')
          } else {
            return window['projectService'].removeMacro('USE_XIAO_EPAPER_DISPLAY_BOARD_EE04')
          }
        })
        .then(() => console.log('✅ 宏定义已更新'))
        .catch(err => console.error('❌ 失败:', err));
    }
  }

  const messageData = {
    eventType: 'workspaceChanged',
    code: 'Blockly.JavaScript.workspaceToCode(workspace)'
  };

  // 发送消息给父窗口
  window.parent.postMessage(messageData, '*');
  // }
  
  // 添加库引用
  generator.addLibrary('TFT_eSPI', '#include <TFT_eSPI.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
  
  // 注册变量
  registerVariableToBlockly(varName, 'EPAPER');
  generator.addObject(varName, 'EPaper ' + varName + ';');
  
  // 生成初始化代码
  return varName + '.begin();\n';
};

// 更新电子墨水屏
Arduino.forBlock['seeed_gfx_epaper_update'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'epaper';
  
  return varName + '.update();\n';
};

// 电子墨水屏睡眠
Arduino.forBlock['seeed_gfx_epaper_sleep'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'epaper';
  
  return varName + '.sleep();\n';
};

// 唤醒电子墨水屏
Arduino.forBlock['seeed_gfx_epaper_wake'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'epaper';
  
  return varName + '.wake();\n';
};

Arduino.forBlock['seeed_gfx_color'] = function(block, generator) {
  const color = block.getFieldValue('COLOR');
  return [color, generator.ORDER_ATOMIC];
}

// 颜色常量块
Arduino.forBlock['seeed_gfx_color_black'] = function(block, generator) {
  return ['0x0000', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_gfx_color_white'] = function(block, generator) {
  return ['0xFFFF', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_gfx_color_red'] = function(block, generator) {
  return ['0xF800', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_gfx_color_green'] = function(block, generator) {
  return ['0x07E0', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_gfx_color_blue'] = function(block, generator) {
  return ['0x001F', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_gfx_color_yellow'] = function(block, generator) {
  return ['0xFFE0', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_gfx_color_cyan'] = function(block, generator) {
  return ['0x07FF', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_gfx_color_magenta'] = function(block, generator) {
  return ['0xF81F', generator.ORDER_ATOMIC];
};

// RGB565颜色转换
Arduino.forBlock['seeed_gfx_rgb565'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';

  const color = block.getFieldValue('COLOR');

  // 解析十六进制颜色
  
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return [varName + '.color565(' + r + ', ' + g + ', ' + b + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_gfx_get_width'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  
  return [varName + '.width()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_gfx_get_height'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  
  return [varName + '.height()', generator.ORDER_ATOMIC];
};

function seeedGfxEnsureAnimationLibraries(generator) {
  generator.addLibrary('TFT_eSPI', '#include <TFT_eSPI.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
}

function seeedGfxDecodeBase64Frame(frameValue, expectedByteLength, frameIndex) {
  if (typeof frameValue !== 'string') {
    console.error(`[seeed_gfx_animation] Frame ${frameIndex} is not a Base64 string`);
    return null;
  }

  const base64 = frameValue.trim();
  const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  if (!base64 || base64.length % 4 !== 0 || !base64Pattern.test(base64)) {
    console.error(`[seeed_gfx_animation] Frame ${frameIndex} contains invalid Base64 data`);
    return null;
  }

  try {
    let bytes;
    if (typeof atob === 'function') {
      const binary = atob(base64);
      bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    } else if (typeof Buffer !== 'undefined') {
      bytes = Uint8Array.from(Buffer.from(base64, 'base64'));
    } else {
      console.error('[seeed_gfx_animation] Base64 decoder is unavailable');
      return null;
    }

    if (bytes.length !== expectedByteLength) {
      console.error(`[seeed_gfx_animation] Frame ${frameIndex} has ${bytes.length} bytes; expected ${expectedByteLength}`);
      return null;
    }
    return bytes;
  } catch (error) {
    console.error(`[seeed_gfx_animation] Failed to decode frame ${frameIndex}:`, error);
    return null;
  }
}

function seeedGfxFormatRgb565Frame(bytes) {
  const values = [];
  for (let offset = 0; offset < bytes.length; offset += 2) {
    const value = (bytes[offset] << 8) | bytes[offset + 1];
    values.push(`0x${value.toString(16).padStart(4, '0').toUpperCase()}`);
  }

  const lines = [];
  for (let index = 0; index < values.length; index += 12) {
    lines.push(`  ${values.slice(index, index + 12).join(', ')}`);
  }
  return lines.join(',\n');
}

function seeedGfxFormatRgb332Frame(bytes) {
  const values = Array.from(bytes, value => `0x${value.toString(16).padStart(2, '0').toUpperCase()}`);
  const lines = [];
  for (let index = 0; index < values.length; index += 16) {
    lines.push(`  ${values.slice(index, index + 16).join(', ')}`);
  }
  return lines.join(',\n');
}

function seeedGfxGetAnimationSignature(format, encoding, width, height, fps, encodedFrames) {
  let hash1 = 0x811C9DC5;
  let hash2 = 0x9E3779B9;
  const updateHash = (value) => {
    const text = String(value);
    for (let index = 0; index < text.length; index++) {
      const code = text.charCodeAt(index);
      hash1 = Math.imul(hash1 ^ code, 0x01000193);
      hash2 = Math.imul(hash2 ^ code, 0x85EBCA77);
    }
  };

  updateHash(`${format}:${encoding}:${width}:${height}:${fps}:${encodedFrames.length}|`);
  for (const encodedFrame of encodedFrames) {
    updateHash(encodedFrame);
    updateHash('|');
  }
  return `${(hash1 >>> 0).toString(16).padStart(8, '0')}${(hash2 >>> 0).toString(16).padStart(8, '0')}`;
}

function seeedGfxGetAnimationData(block) {
  let animationData = block.getFieldValue('CUSTOM_ANIMATION');

  if (typeof animationData === 'string') {
    try {
      animationData = JSON.parse(animationData);
    } catch (error) {
      console.error('[seeed_gfx_animation] Failed to parse animation field value:', error);
      return null;
    }
  }

  if (!animationData || typeof animationData !== 'object') {
    console.error('[seeed_gfx_animation] Animation data is missing');
    return null;
  }
  const format = animationData.format;
  const encoding = animationData.encoding;
  const isRgb565 = format === 'rgb565' && encoding === 'rgb565-be-base64';
  const isRgb332 = format === 'rgb332' && encoding === 'rgb332-base64';
  if (animationData.version !== 1 || (!isRgb565 && !isRgb332)) {
    console.error('[seeed_gfx_animation] Unsupported animation version, format, or encoding');
    return null;
  }

  const width = animationData.width;
  const height = animationData.height;
  const fps = animationData.fps;
  if (!Number.isInteger(width) || width <= 0 || width > 65535 ||
      !Number.isInteger(height) || height <= 0 || height > 65535) {
    console.error('[seeed_gfx_animation] Width and height must be positive 16-bit integers');
    return null;
  }
  if (!Number.isFinite(fps) || fps <= 0) {
    console.error('[seeed_gfx_animation] FPS must be a positive number');
    return null;
  }
  if (!Array.isArray(animationData.frames)) {
    console.error('[seeed_gfx_animation] Animation frames must be an array');
    return null;
  }
  // A newly dragged block intentionally starts empty until a GIF or MP4 is uploaded.
  if (animationData.frames.length === 0) {
    return null;
  }
  if (animationData.frames.length > 65535) {
    console.error('[seeed_gfx_animation] Animation cannot contain more than 65535 frames');
    return null;
  }

  const expectedByteLength = width * height * (isRgb332 ? 1 : 2);
  if (!Number.isSafeInteger(expectedByteLength)) {
    console.error('[seeed_gfx_animation] Animation dimensions are too large');
    return null;
  }

  const frames = [];
  for (let index = 0; index < animationData.frames.length; index++) {
    const binary = seeedGfxDecodeBase64Frame(animationData.frames[index], expectedByteLength, index);
    if (binary === null) {
      return null;
    }
    frames.push(isRgb332 ? seeedGfxFormatRgb332Frame(binary) : seeedGfxFormatRgb565Frame(binary));
  }

  return {
    width,
    height,
    fps,
    format,
    signature: seeedGfxGetAnimationSignature(format, encoding, width, height, fps, animationData.frames),
    frames
  };
}

function seeedGfxGetBlockSymbolSuffix(block) {
  const suffix = String(block.id || 'block').replace(/[^a-zA-Z0-9]/g, '');
  return suffix || 'block';
}

function seeedGfxGetVariableCodeName(block, fieldName, fallbackName) {
  const field = block.getField(fieldName);
  if (field && typeof field.getText === 'function') {
    const fieldText = field.getText();
    if (fieldText) {
      return fieldText;
    }
  }

  const fieldValue = block.getFieldValue(fieldName);
  const variable = block.workspace && typeof block.workspace.getVariableById === 'function'
    ? block.workspace.getVariableById(fieldValue)
    : null;
  return variable && variable.name ? variable.name : fallbackName;
}

function seeedGfxAddSdVideoPlayer(generator) {
  seeedGfxEnsureAnimationLibraries(generator);
  generator.addLibrary('stdlib', '#include <stdlib.h>');
  generator.addLibrary('stdint', '#include <stdint.h>');
  generator.addLibrary('esp_heap_caps', `#if defined(ESP32)
#include <esp_heap_caps.h>
#endif`);

  generator.addFunction('seeed_gfx_play_sd_video', `static uint16_t seeedGfxReadVideoLe16(const uint8_t *data) {
  return (uint16_t)data[0] | ((uint16_t)data[1] << 8);
}

static uint32_t seeedGfxReadVideoLe32(const uint8_t *data) {
  return (uint32_t)data[0]
    | ((uint32_t)data[1] << 8)
    | ((uint32_t)data[2] << 16)
    | ((uint32_t)data[3] << 24);
}

static uint8_t *seeedGfxAllocateVideoBuffer(size_t bufferSize) {
  uint8_t *buffer = nullptr;
#if defined(ESP32) && defined(MALLOC_CAP_SPIRAM)
  buffer = (uint8_t *)heap_caps_malloc(bufferSize, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
#endif
  if (buffer == nullptr) {
    buffer = (uint8_t *)malloc(bufferSize);
  }
  return buffer;
}

static bool seeedGfxReadVideoData(fs::File &file, uint8_t *buffer, size_t length) {
  size_t bytesRead = 0;
  while (bytesRead < length) {
    const size_t remaining = length - bytesRead;
    size_t count = file.read(buffer + bytesRead, remaining);
    if (count == 0 || count > remaining) {
      return false;
    }
    bytesRead += count;
  }
  return true;
}

static void seeedGfxWaitVideoFrame(uint32_t frameStartedAt, uint64_t frameIntervalUs) {
  uint64_t elapsedUs = (uint32_t)(micros() - frameStartedAt);
  if (elapsedUs >= frameIntervalUs) {
    return;
  }

  uint64_t remainingUs = frameIntervalUs - elapsedUs;
  while (remainingUs >= 1000) {
    uint32_t waitMs = remainingUs / 1000 > 1000 ? 1000 : (uint32_t)(remainingUs / 1000);
    delay(waitMs);
    remainingUs -= (uint64_t)waitMs * 1000;
  }
  if (remainingUs > 0) {
    delayMicroseconds((uint32_t)remainingUs);
  }
}

bool seeedGfxPlaySdVideo(TFT_eSPI &display, const String &fileName, int32_t bufferSizeKb) {
  const uint8_t AILY_RGB565_LE = 1;
  const uint8_t AILY_RGB332 = 2;
  const uint8_t AILY_MONO1_XBM = 3;
  const uint8_t AILY_HEADER_SIZE = 40;

  if (bufferSizeKb <= 0 || (uint64_t)bufferSizeKb * 1024 > (uint64_t)SIZE_MAX) {
    return false;
  }
  const size_t bufferSize = (size_t)bufferSizeKb * 1024;

  String normalizedFileName = fileName;
#if defined(WIO_TERMINAL) || defined(SEEED_WIO_TERMINAL)
  while (normalizedFileName.startsWith("/")) {
    normalizedFileName.remove(0, 1);
  }
#else
  if (!normalizedFileName.startsWith("/")) {
    normalizedFileName = String("/") + normalizedFileName;
  }
#endif
  if (normalizedFileName.length() == 0) {
    return false;
  }

  fs::File file = SD.open(normalizedFileName.c_str(), FILE_READ);
#if (defined(WIO_TERMINAL) || defined(SEEED_WIO_TERMINAL)) && !defined(AILY_SEEED_FS_ONBOARD_SD_INIT)
  // Compatibility fallback for older Blockly projects that do not yet use
  // the Seeed FS onboard-SD initialization block.
  if (!file) {
    fs::File root = SD.open("", FILE_READ);
    if (root) {
      root.close();
      return false;
    }

    static bool autoInitAttempted = false;
    if (autoInitAttempted) {
      return false;
    }
    autoInitAttempted = true;
    SD.end();
    if (!SD.begin(SDCARD_SS_PIN, SDCARD_SPI, 25000000UL)) {
      return false;
    }
    file = SD.open(normalizedFileName.c_str(), FILE_READ);
  }
#endif
  if (!file || file.isDirectory()) {
    if (file) file.close();
    return false;
  }

  uint8_t header[AILY_HEADER_SIZE];
  if (!seeedGfxReadVideoData(file, header, sizeof(header))) {
    file.close();
    return false;
  }

  if (header[0] != 'A' || header[1] != 'I' || header[2] != 'L' || header[3] != 'Y'
      || header[4] != 1 || header[5] < AILY_HEADER_SIZE) {
    file.close();
    return false;
  }

  const uint8_t pixelFormat = header[6];
  const uint16_t width = seeedGfxReadVideoLe16(header + 8);
  const uint16_t height = seeedGfxReadVideoLe16(header + 10);
  const uint32_t fpsNumerator = seeedGfxReadVideoLe32(header + 12);
  const uint32_t fpsDenominator = seeedGfxReadVideoLe32(header + 16);
  const uint32_t frameCount = seeedGfxReadVideoLe32(header + 20);
  const uint32_t frameSize = seeedGfxReadVideoLe32(header + 24);
  const uint32_t dataOffset = seeedGfxReadVideoLe32(header + 28);
  const uint32_t dataSize = seeedGfxReadVideoLe32(header + 32);

  if (width == 0 || height == 0 || fpsNumerator == 0 || fpsDenominator == 0
      || frameCount == 0 || dataOffset < header[5]) {
    file.close();
    return false;
  }

  uint64_t expectedFrameSize = 0;
  if (pixelFormat == AILY_RGB565_LE) {
    expectedFrameSize = (uint64_t)width * height * 2;
  } else if (pixelFormat == AILY_RGB332) {
    expectedFrameSize = (uint64_t)width * height;
  } else if (pixelFormat == AILY_MONO1_XBM) {
    expectedFrameSize = (uint64_t)((width + 7) / 8) * height;
  } else {
    file.close();
    return false;
  }

  const uint64_t expectedDataSize = expectedFrameSize * frameCount;
  const uint64_t requiredFileSize = (uint64_t)dataOffset + dataSize;
  if (expectedFrameSize > UINT32_MAX || frameSize != (uint32_t)expectedFrameSize
      || expectedDataSize > UINT32_MAX || dataSize != (uint32_t)expectedDataSize
      || requiredFileSize > (uint64_t)file.size()
      || (pixelFormat == AILY_MONO1_XBM && (width > INT16_MAX || height > INT16_MAX))) {
    file.close();
    return false;
  }

  if (file.position() != dataOffset) {
    file.seek(dataOffset);
    if (file.position() != dataOffset) {
      file.close();
      return false;
    }
  }

  size_t activeBufferSize = bufferSize;
  uint8_t *buffer = nullptr;
  uint8_t *nextBuffer = nullptr;
  bool useWioRgb565Dma = false;
  bool dmaStartedHere = false;

#if (defined(WIO_TERMINAL) || defined(SEEED_WIO_TERMINAL)) && defined(__SAMD51__)
  if (pixelFormat == AILY_RGB565_LE
      && width <= display.width() && height <= display.height()) {
    const size_t DMA_BUFFER_MIN = 16 * 1024;
    const size_t DMA_BUFFER_MAX = 32 * 1024;
    activeBufferSize = bufferSize;
    if (activeBufferSize < DMA_BUFFER_MIN) activeBufferSize = DMA_BUFFER_MIN;
    if (activeBufferSize > DMA_BUFFER_MAX) activeBufferSize = DMA_BUFFER_MAX;
    activeBufferSize -= activeBufferSize % 2;

    buffer = seeedGfxAllocateVideoBuffer(activeBufferSize);
    nextBuffer = seeedGfxAllocateVideoBuffer(activeBufferSize);
    if (buffer != nullptr && nextBuffer != nullptr) {
      if (display.DMA_Enabled) {
        useWioRgb565Dma = true;
      } else if (display.initDMA()) {
        useWioRgb565Dma = true;
        dmaStartedHere = true;
      }
    }
  }
#endif

  if (!useWioRgb565Dma) {
    if (buffer != nullptr) free(buffer);
    if (nextBuffer != nullptr) free(nextBuffer);
    activeBufferSize = bufferSize;
    buffer = seeedGfxAllocateVideoBuffer(activeBufferSize);
    nextBuffer = nullptr;
  }

  if (buffer == nullptr) {
    file.close();
    return false;
  }

  uint64_t frameIntervalUs = 1000000ULL * fpsDenominator / fpsNumerator;
  if (frameIntervalUs == 0) frameIntervalUs = 1;
  bool success = true;
  uint32_t framesPlayed = 0;
  bool previousSwapBytes = display.getSwapBytes();
  if (pixelFormat == AILY_RGB565_LE) {
    display.setSwapBytes(true);
  }

  while (framesPlayed < frameCount && success) {
    uint32_t frameStartedAt = micros();

#if (defined(WIO_TERMINAL) || defined(SEEED_WIO_TERMINAL)) && defined(__SAMD51__)
    if (pixelFormat == AILY_RGB565_LE && useWioRgb565Dma) {
      uint32_t remainingPixels = (uint32_t)width * height;
      uint8_t *currentBuffer = buffer;
      uint8_t *readBuffer = nextBuffer;
      uint32_t currentPixels = remainingPixels;
      const uint32_t maxPixels = (uint32_t)(activeBufferSize / 2);
      if (currentPixels > maxPixels) currentPixels = maxPixels;

      success = seeedGfxReadVideoData(file, currentBuffer, (size_t)currentPixels * 2);
      if (success) {
        display.startWrite();
        display.setAddrWindow(0, 0, width, height);
        display.pushPixelsDMA(reinterpret_cast<uint16_t *>(currentBuffer), currentPixels);
        remainingPixels -= currentPixels;

        while (remainingPixels > 0 && success) {
          uint32_t pixels = remainingPixels;
          if (pixels > maxPixels) pixels = maxPixels;

          // SD is on SPI2 and LCD is on SPI3. This read and the byte swap in
          // pushPixelsDMA() overlap the previous LCD DMA transfer.
          success = seeedGfxReadVideoData(file, readBuffer, (size_t)pixels * 2);
          if (success) {
            display.pushPixelsDMA(reinterpret_cast<uint16_t *>(readBuffer), pixels);
            remainingPixels -= pixels;
            uint8_t *finishedBuffer = currentBuffer;
            currentBuffer = readBuffer;
            readBuffer = finishedBuffer;
          }
        }

        display.dmaWait();
        display.endWrite();
      }
    } else
#endif
    if (pixelFormat == AILY_MONO1_XBM) {
      const uint32_t rowBytes = ((uint32_t)width + 7) / 8;
      uint32_t y = 0;
      while (y < height && success) {
        if (activeBufferSize >= rowBytes) {
          const size_t rowsInBuffer = activeBufferSize / rowBytes;
          const uint32_t remainingRows = (uint32_t)height - y;
          const uint32_t rows = rowsInBuffer > remainingRows
            ? remainingRows
            : (uint32_t)rowsInBuffer;
          const size_t bytes = (size_t)rowBytes * rows;
          success = seeedGfxReadVideoData(file, buffer, bytes);
          if (success) {
            display.drawXBitmap(0, (int16_t)y, buffer, width, (int16_t)rows, TFT_WHITE, TFT_BLACK);
            y += rows;
          }
        } else {
          uint32_t byteX = 0;
          while (byteX < rowBytes && success) {
            size_t bytes = rowBytes - byteX;
            if (bytes > activeBufferSize) bytes = activeBufferSize;
            success = seeedGfxReadVideoData(file, buffer, bytes);
            if (success) {
              uint32_t x = byteX * 8;
              uint32_t pixels = (uint32_t)bytes * 8;
              if (pixels > (uint32_t)width - x) pixels = (uint32_t)width - x;
              display.drawXBitmap((int16_t)x, (int16_t)y, buffer, (int16_t)pixels, 1, TFT_WHITE, TFT_BLACK);
              byteX += bytes;
            }
          }
          y++;
        }
      }
    } else {
      const uint32_t bytesPerPixel = pixelFormat == AILY_RGB565_LE ? 2 : 1;
      const uint32_t rowBytes = (uint32_t)width * bytesPerPixel;
      uint32_t y = 0;
      while (y < height && success) {
        if (activeBufferSize >= rowBytes) {
          const size_t rowsInBuffer = activeBufferSize / rowBytes;
          const uint32_t remainingRows = (uint32_t)height - y;
          const uint32_t rows = rowsInBuffer > remainingRows
            ? remainingRows
            : (uint32_t)rowsInBuffer;
          const size_t bytes = (size_t)rowBytes * rows;
          success = seeedGfxReadVideoData(file, buffer, bytes);
          if (success) {
            if (pixelFormat == AILY_RGB565_LE) {
              display.pushImage(0, y, width, rows, reinterpret_cast<uint16_t *>(buffer));
            } else {
              display.pushImage(0, y, width, rows, buffer, true);
            }
            y += rows;
          }
        } else {
          const size_t usableBytes = activeBufferSize - activeBufferSize % bytesPerPixel;
          if (usableBytes == 0) {
            success = false;
            break;
          }

          uint32_t x = 0;
          while (x < width && success) {
            const size_t pixelsInBuffer = usableBytes / bytesPerPixel;
            const uint32_t remainingPixels = (uint32_t)width - x;
            const uint32_t pixels = pixelsInBuffer > remainingPixels
              ? remainingPixels
              : (uint32_t)pixelsInBuffer;
            const size_t bytes = (size_t)pixels * bytesPerPixel;
            success = seeedGfxReadVideoData(file, buffer, bytes);
            if (success) {
              if (pixelFormat == AILY_RGB565_LE) {
                display.pushImage(x, y, pixels, 1, reinterpret_cast<uint16_t *>(buffer));
              } else {
                display.pushImage(x, y, pixels, 1, buffer, true);
              }
              x += pixels;
            }
          }
          y++;
        }
      }
    }

    if (success) {
      framesPlayed++;
      seeedGfxWaitVideoFrame(frameStartedAt, frameIntervalUs);
    }
  }

  if (pixelFormat == AILY_RGB565_LE) {
    display.setSwapBytes(previousSwapBytes);
  }
  if (dmaStartedHere) {
    display.deInitDMA();
  }
  if (nextBuffer != nullptr) free(nextBuffer);
  free(buffer);
  file.close();
  return success && framesPlayed == frameCount;
}`);
}

Arduino.forBlock['seeed_gfx_play_sd_video'] = function(block, generator) {
  const display = seeedGfxGetVariableCodeName(block, 'VAR', 'tft');
  const fileName = generator.valueToCode(block, 'FILENAME', generator.ORDER_ATOMIC) || '"/video.rgb565v"';
  const bufferSizeKb = generator.valueToCode(block, 'BUFFER_KB', generator.ORDER_ATOMIC) || '32';
  seeedGfxAddSdVideoPlayer(generator);
  return `seeedGfxPlaySdVideo(${display}, String(${fileName}), (int32_t)(${bufferSizeKb}));\n`;
};

function seeedGfxGetFrameVariableCodeName(block, generator) {
  if (generator && typeof generator.getValue === 'function') {
    const generatedName = generator.getValue(block, 'FRAME_VAR', 'field_variable');
    if (generatedName && generatedName !== '?') {
      return generatedName;
    }
  }

  const variableId = block.getFieldValue('FRAME_VAR');
  if (variableId && generator && generator.nameDB_ && typeof generator.nameDB_.getName === 'function') {
    return generator.nameDB_.getName(variableId, 'VARIABLE');
  }

  return seeedGfxGetVariableCodeName(block, 'FRAME_VAR', 'seeedGfxAnimationFrame');
}

function seeedGfxGetAnimationPrefix(block, generator) {
  if (typeof block.getInputTargetBlock === 'function') {
    const animationBlock = block.getInputTargetBlock('ANIMATION');
    if (!animationBlock || animationBlock.type !== 'seeed_gfx_animation') {
      console.error('[Seeed GFX animation] The animation input must be connected directly to a Seeed GFX animation data block');
      return null;
    }
  }

  const animationCode = generator.valueToCode(block, 'ANIMATION', generator.ORDER_ATOMIC);
  if (!animationCode) {
    return null;
  }

  const match = String(animationCode).trim().match(/^(seeed_gfx_animation_[0-9a-f]{16})_frames$/);
  if (!match) {
    console.error('[Seeed GFX animation] The animation input must be connected directly to a Seeed GFX animation data block');
    return null;
  }
  return match[1];
}

Arduino.forBlock['seeed_gfx_animation'] = function(block, generator) {
  seeedGfxEnsureAnimationLibraries(generator);
  const animationData = seeedGfxGetAnimationData(block);
  if (!animationData) {
    return ['', generator.ORDER_ATOMIC];
  }

  const { width, height, fps, format, signature, frames } = animationData;
  const symbolPrefix = `seeed_gfx_animation_${signature}`;
  const frameType = format === 'rgb332' ? 'uint8_t' : 'uint16_t';
  const formatLabel = format.toUpperCase();
  const frameNames = [];
  const frameDeclarations = [];
  const frameNameByData = new Map();

  for (let index = 0; index < frames.length; index++) {
    const existingFrameName = frameNameByData.get(frames[index]);
    if (existingFrameName) {
      frameNames.push(existingFrameName);
      continue;
    }

    const frameName = `${symbolPrefix}_frame_${index}`;
    frameNameByData.set(frames[index], frameName);
    frameNames.push(frameName);
    frameDeclarations.push(`static const ${frameType} ${frameName}[] PROGMEM = {
${frames[index]}
};`);
  }

  const frameDelay = Math.max(1, Math.round(1000 / fps));
  const animationDeclaration = `// Seeed GFX animation (${width}x${height}, ${frameNames.length} frames, ${frameDeclarations.length} unique, ${fps} FPS, ${formatLabel})
${frameDeclarations.join('\n\n')}
static const ${frameType}* const ${symbolPrefix}_frames[] = {
  ${frameNames.join(',\n  ')}
};
static const uint16_t ${symbolPrefix}_width = ${width};
static const uint16_t ${symbolPrefix}_height = ${height};
static const uint16_t ${symbolPrefix}_frame_count = ${frameNames.length};
static const uint32_t ${symbolPrefix}_frame_delay = ${frameDelay};`;

  generator.addVariable(symbolPrefix, animationDeclaration);
  return [`${symbolPrefix}_frames`, generator.ORDER_ATOMIC];
};

function seeedGfxAddAnimationRenderHelper(generator) {
  generator.addFunction('seeed_gfx_draw_animation_frame', `void seeedGfxDrawAnimationFrame(TFT_eSPI &seeedGfxDisplay, int32_t seeedGfxX, int32_t seeedGfxY, uint16_t seeedGfxWidth, uint16_t seeedGfxHeight, const uint16_t *seeedGfxFrame) {
  bool seeedGfxPreviousSwapBytes = seeedGfxDisplay.getSwapBytes();
  // RGB565 constants are native-endian uint16_t values; swap bytes for TFT transport.
  seeedGfxDisplay.setSwapBytes(true);
  seeedGfxDisplay.pushImage(seeedGfxX, seeedGfxY, seeedGfxWidth, seeedGfxHeight, seeedGfxFrame);
  seeedGfxDisplay.setSwapBytes(seeedGfxPreviousSwapBytes);
}

void seeedGfxDrawAnimationFrame(TFT_eSPI &seeedGfxDisplay, int32_t seeedGfxX, int32_t seeedGfxY, uint16_t seeedGfxWidth, uint16_t seeedGfxHeight, const uint8_t *seeedGfxFrame) {
  seeedGfxDisplay.pushImage(seeedGfxX, seeedGfxY, seeedGfxWidth, seeedGfxHeight, seeedGfxFrame, true);
}`);
}

function seeedGfxAddAnimationFrameByIndexHelper(generator) {
  seeedGfxAddAnimationRenderHelper(generator);
  generator.addFunction('seeed_gfx_draw_animation_frame_by_index', `void seeedGfxDrawAnimationFrameByIndex(TFT_eSPI &seeedGfxDisplay, int32_t seeedGfxX, int32_t seeedGfxY, uint16_t seeedGfxWidth, uint16_t seeedGfxHeight, const uint16_t * const seeedGfxFrames[], uint16_t seeedGfxFrameCount, int32_t seeedGfxFrameIndex) {
  if (seeedGfxFrameCount == 0) {
    return;
  }
  if (seeedGfxFrameIndex < 0) {
    seeedGfxFrameIndex = 0;
  }
  if (seeedGfxFrameIndex >= (int32_t)seeedGfxFrameCount) {
    seeedGfxFrameIndex = seeedGfxFrameCount - 1;
  }
  seeedGfxDrawAnimationFrame(seeedGfxDisplay, seeedGfxX, seeedGfxY, seeedGfxWidth, seeedGfxHeight, seeedGfxFrames[seeedGfxFrameIndex]);
}

void seeedGfxDrawAnimationFrameByIndex(TFT_eSPI &seeedGfxDisplay, int32_t seeedGfxX, int32_t seeedGfxY, uint16_t seeedGfxWidth, uint16_t seeedGfxHeight, const uint8_t * const seeedGfxFrames[], uint16_t seeedGfxFrameCount, int32_t seeedGfxFrameIndex) {
  if (seeedGfxFrameCount == 0) {
    return;
  }
  if (seeedGfxFrameIndex < 0) {
    seeedGfxFrameIndex = 0;
  }
  if (seeedGfxFrameIndex >= (int32_t)seeedGfxFrameCount) {
    seeedGfxFrameIndex = seeedGfxFrameCount - 1;
  }
  seeedGfxDrawAnimationFrame(seeedGfxDisplay, seeedGfxX, seeedGfxY, seeedGfxWidth, seeedGfxHeight, seeedGfxFrames[seeedGfxFrameIndex]);
}`);
}

Arduino.forBlock['seeed_gfx_play_animation'] = function(block, generator) {
  seeedGfxEnsureAnimationLibraries(generator);
  const display = seeedGfxGetVariableCodeName(block, 'VAR', 'tft');
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const animationPrefix = seeedGfxGetAnimationPrefix(block, generator);
  if (!animationPrefix) {
    return '// No Seeed GFX animation data\n';
  }

  seeedGfxAddAnimationRenderHelper(generator);
  const playMode = block.getFieldValue('PLAY_MODE') || 'BLOCKING';
  const loop = block.getFieldValue('LOOP') === 'TRUE';

  if (playMode === 'NON_BLOCKING') {
    const statePrefix = `seeed_gfx_animation_state_${seeedGfxGetBlockSymbolSuffix(block)}`;
    generator.addVariable(`${statePrefix}_frame`, `uint16_t ${statePrefix}_frame = 0;`);
    generator.addVariable(`${statePrefix}_last_ms`, `uint32_t ${statePrefix}_last_ms = 0;`);
    generator.addVariable(`${statePrefix}_started`, `bool ${statePrefix}_started = false;`);
    generator.addVariable(`${statePrefix}_done`, `bool ${statePrefix}_done = false;`);

    let code = `if (!${statePrefix}_done) {\n`;
    code += `  uint32_t ${statePrefix}_now = millis();\n`;
    code += `  if (!${statePrefix}_started || ${statePrefix}_now - ${statePrefix}_last_ms >= ${animationPrefix}_frame_delay) {\n`;
    code += `    seeedGfxDrawAnimationFrame(${display}, ${x}, ${y}, ${animationPrefix}_width, ${animationPrefix}_height, ${animationPrefix}_frames[${statePrefix}_frame]);\n`;
    code += `    ${statePrefix}_last_ms = ${statePrefix}_now;\n`;
    code += `    ${statePrefix}_started = true;\n`;
    code += `    ${statePrefix}_frame++;\n`;
    code += `    if (${statePrefix}_frame >= ${animationPrefix}_frame_count) {\n`;
    if (loop) {
      code += `      ${statePrefix}_frame = 0;\n`;
    } else {
      code += `      ${statePrefix}_frame = ${animationPrefix}_frame_count - 1;\n`;
      code += `      ${statePrefix}_done = true;\n`;
    }
    code += '    }\n';
    code += '  }\n';
    code += '}\n';
    return code;
  }

  let code = `for (uint16_t seeedGfxFrameIndex = 0; seeedGfxFrameIndex < ${animationPrefix}_frame_count; seeedGfxFrameIndex++) {\n`;
  code += '  uint32_t seeedGfxFrameStartedAt = millis();\n';
  code += `  seeedGfxDrawAnimationFrame(${display}, ${x}, ${y}, ${animationPrefix}_width, ${animationPrefix}_height, ${animationPrefix}_frames[seeedGfxFrameIndex]);\n`;
  code += '  uint32_t seeedGfxFrameRenderTime = millis() - seeedGfxFrameStartedAt;\n';
  code += `  if (seeedGfxFrameRenderTime < ${animationPrefix}_frame_delay) {\n`;
  code += `    delay(${animationPrefix}_frame_delay - seeedGfxFrameRenderTime);\n`;
  code += '  }\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['seeed_gfx_draw_animation_frame'] = function(block, generator) {
  seeedGfxEnsureAnimationLibraries(generator);
  const display = seeedGfxGetVariableCodeName(block, 'VAR', 'tft');
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const frame = generator.valueToCode(block, 'FRAME', generator.ORDER_ATOMIC) || '0';
  const animationPrefix = seeedGfxGetAnimationPrefix(block, generator);
  if (!animationPrefix) {
    return '// No Seeed GFX animation data\n';
  }

  seeedGfxAddAnimationFrameByIndexHelper(generator);
  return `seeedGfxDrawAnimationFrameByIndex(${display}, ${x}, ${y}, ${animationPrefix}_width, ${animationPrefix}_height, ${animationPrefix}_frames, ${animationPrefix}_frame_count, ${frame});\n`;
};

Arduino.forBlock['seeed_gfx_animation_frame_count'] = function(block, generator) {
  seeedGfxEnsureAnimationLibraries(generator);
  const animationPrefix = seeedGfxGetAnimationPrefix(block, generator);
  if (!animationPrefix) {
    return ['0', generator.ORDER_ATOMIC];
  }

  return [`${animationPrefix}_frame_count`, generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_gfx_step_animation_frame'] = function(block, generator) {
  seeedGfxEnsureAnimationLibraries(generator);
  const frameVariable = seeedGfxGetFrameVariableCodeName(block, generator);
  const target = generator.valueToCode(block, 'TARGET', generator.ORDER_ATOMIC) || '0';
  const frameCount = generator.valueToCode(block, 'FRAME_COUNT', generator.ORDER_ATOMIC) || '1';
  const direction = block.getFieldValue('DIRECTION') || 'AUTO';
  const symbolSuffix = seeedGfxGetBlockSymbolSuffix(block);
  const targetVariable = `seeed_gfx_animation_target_${symbolSuffix}`;
  const countVariable = `seeed_gfx_animation_frame_count_${symbolSuffix}`;

  let code = `int32_t ${countVariable} = (int32_t)(${frameCount});\n`;
  code += `if (${countVariable} > 0) {\n`;
  code += `  int32_t ${targetVariable} = constrain((int32_t)(${target}), 0, ${countVariable} - 1);\n`;
  code += `  ${frameVariable} = constrain((int32_t)${frameVariable}, 0, ${countVariable} - 1);\n`;

  if (direction === 'FORWARD') {
    code += `  if (${frameVariable} != ${targetVariable}) {\n`;
    code += `    ${frameVariable}++;\n`;
    code += `    if (${frameVariable} >= ${countVariable}) {\n`;
    code += `      ${frameVariable} = 0;\n`;
    code += '    }\n';
    code += '  }\n';
  } else if (direction === 'BACKWARD') {
    code += `  if (${frameVariable} != ${targetVariable}) {\n`;
    code += `    if (${frameVariable} <= 0) {\n`;
    code += `      ${frameVariable} = ${countVariable} - 1;\n`;
    code += '    } else {\n';
    code += `      ${frameVariable}--;\n`;
    code += '    }\n';
    code += '  }\n';
  } else {
    code += `  if (${frameVariable} < ${targetVariable}) {\n`;
    code += `    ${frameVariable}++;\n`;
    code += `  } else if (${frameVariable} > ${targetVariable}) {\n`;
    code += `    ${frameVariable}--;\n`;
    code += '  }\n';
  }

  code += '}\n';
  return code;
};

if (Blockly.Extensions.isRegistered('seeed_gfx_animation_play_dynamic_inputs')) {
  Blockly.Extensions.unregister('seeed_gfx_animation_play_dynamic_inputs');
}

Blockly.Extensions.register('seeed_gfx_animation_play_dynamic_inputs', function() {
  let renderScheduled = false;

  const getLoopInput = () => {
    return this.inputList.find(input => input.fieldRow && input.fieldRow.some(field => field.name === 'LOOP'));
  };

  const scheduleRender = () => {
    if (!this.rendered || renderScheduled) {
      return;
    }
    renderScheduled = true;
    Promise.resolve().then(() => {
      renderScheduled = false;
      const rootBlock = typeof this.getRootBlock === 'function' ? this.getRootBlock() : this;
      if (rootBlock && rootBlock.rendered) {
        rootBlock.render();
      } else if (this.rendered) {
        this.render();
      }
    });
  };

  const updatePlaybackMode = modeValue => {
    const loopInput = getLoopInput();
    if (loopInput) {
      loopInput.setVisible(modeValue === 'NON_BLOCKING');
    }
    scheduleRender();
  };

  const playModeField = this.getField('PLAY_MODE');
  if (playModeField) {
    playModeField.setValidator(option => {
      updatePlaybackMode(option);
      return option;
    });
  }

  updatePlaybackMode(this.getFieldValue('PLAY_MODE'));
});

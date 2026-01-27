Arduino.forBlock['chainableled_setup'] = function(block, generator) {
  // 变量重命名监听
  if (!block._chainableledSetupVarMonitorAttached) {
    block._chainableledSetupVarMonitorAttached = true;
    block._chainableledSetupLastName = block.getFieldValue('VAR') || 'leds';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._chainableledSetupLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'ChainableLED');
          block._chainableledSetupLastName = newName;
        }
        return newName;
      });
    }
  }

  // 参数提取
  const varName = block.getFieldValue('VAR') || 'leds';
  const clkPin = generator.valueToCode(block, 'CLK_PIN', generator.ORDER_ATOMIC) || '2';
  const dataPin = generator.valueToCode(block, 'DATA_PIN', generator.ORDER_ATOMIC) || '3';
  const numLeds = generator.valueToCode(block, 'NUM_LEDS', generator.ORDER_ATOMIC) || '1';

  // 库和变量管理（generator自动去重）
  generator.addLibrary('ChainableLED', '#include <ChainableLED.h>');
  registerVariableToBlockly(varName, 'ChainableLED');
  generator.addVariable(varName, 'ChainableLED ' + varName + '(' + clkPin + ', ' + dataPin + ', ' + numLeds + ');');

  // 生成代码
  return varName + '.init();\n';
};

// Arduino.forBlock['chainableled_init'] = function(block, generator) {
//   // 变量重命名监听
//   if (!block._chainableledInitVarMonitorAttached) {
//     block._chainableledInitVarMonitorAttached = true;
//     block._chainableledInitLastName = block.getFieldValue('VAR') || 'leds';
//     const varField = block.getField('VAR');
//     if (varField && typeof varField.setValidator === 'function') {
//       varField.setValidator(function(newName) {
//         const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
//         const oldName = block._chainableledInitLastName;
//         if (workspace && newName && newName !== oldName) {
//           renameVariableInBlockly(block, oldName, newName, 'ChainableLED');
//           block._chainableledInitLastName = newName;
//         }
//         return newName;
//       });
//     }
//   }

//   // 参数提取（使用field_variable方式读取）
//   const varField = block.getField('VAR');
//   const varName = varField ? varField.getText() : 'leds';

//   // 库管理
//   generator.addLibrary('ChainableLED', '#include <ChainableLED.h>');

//   // 生成代码
//   return varName + '.init();\n';
// };

Arduino.forBlock['chainableled_set_color_rgb'] = function(block, generator) {
  // 参数提取（使用field_variable方式读取）
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'leds';
  const ledIndex = generator.valueToCode(block, 'LED_INDEX', generator.ORDER_ATOMIC) || '0';
  const red = generator.valueToCode(block, 'RED', generator.ORDER_ATOMIC) || '0';
  const green = generator.valueToCode(block, 'GREEN', generator.ORDER_ATOMIC) || '0';
  const blue = generator.valueToCode(block, 'BLUE', generator.ORDER_ATOMIC) || '0';

  // 库管理
  generator.addLibrary('ChainableLED', '#include <ChainableLED.h>');

  // 生成代码
  return varName + '.setColorRGB(' + ledIndex + ', ' + red + ', ' + green + ', ' + blue + ');\n';
};

Arduino.forBlock['chainableled_set_color_hsl'] = function(block, generator) {
  // 参数提取（使用field_variable方式读取）
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'leds';
  const ledIndex = generator.valueToCode(block, 'LED_INDEX', generator.ORDER_ATOMIC) || '0';
  const hue = generator.valueToCode(block, 'HUE', generator.ORDER_ATOMIC) || '0';
  const saturation = generator.valueToCode(block, 'SATURATION', generator.ORDER_ATOMIC) || '1.0';
  const lightness = generator.valueToCode(block, 'LIGHTNESS', generator.ORDER_ATOMIC) || '0.5';

  // 库管理
  generator.addLibrary('ChainableLED', '#include <ChainableLED.h>');

  // 生成代码
  return varName + '.setColorHSL(' + ledIndex + ', ' + hue + ', ' + saturation + ', ' + lightness + ');\n';
};

Arduino.forBlock['chainableled_set_color'] = function(block, generator) {
  // 参数提取（使用field_variable方式读取）
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'leds';
  const ledIndex = generator.valueToCode(block, 'LED_INDEX', generator.ORDER_ATOMIC) || '0';
  const color = block.getFieldValue('COLOR');

  // 库管理
  generator.addLibrary('ChainableLED', '#include <ChainableLED.h>');

  const hex = color.replace('#', '');
  const red = parseInt(hex.substring(0, 2), 16);
  const green = parseInt(hex.substring(2, 4), 16);
  const blue = parseInt(hex.substring(4, 6), 16);

  // 生成代码
  return varName + '.setColorRGB(' + ledIndex + ', ' + red + ', ' + green + ', ' + blue + ');\n';
}

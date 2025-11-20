'use strict';

// Arduino.forBlock['esp32_spi_create'] = function(block, generator) {
//   // 设置变量重命名监听
//   if (!block._spiVarMonitorAttached) {
//     block._spiVarMonitorAttached = true;
//     block._spiVarLastName = block.getFieldValue('VAR') || 'SPI';
//     const varField = block.getField('VAR');
//     if (varField && typeof varField.setValidator === 'function') {
//       varField.setValidator(function(newName) {
//         const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
//         const oldName = block._spiVarLastName;
//         if (workspace && newName && newName !== oldName) {
//           renameVariableInBlockly(block, oldName, newName, 'SPIClass');
//           block._spiVarLastName = newName;
//         }
//         return newName;
//       });
//     }
//   }

//   const varName = block.getFieldValue('VAR') || 'SPI';
//   const bus = block.getFieldValue('BUS') || 'VSPI';

//   // 添加库引用
//   generator.addLibrary('SPI', '#include <SPI.h>');
  
//   // 注册变量到Blockly系统
//   registerVariableToBlockly(varName, 'SPIClass');
  
//   // 生成变量声明
//   generator.addVariable(varName, 'SPIClass *' + varName + ' = new SPIClass(' + bus + ');');

//   return '';
// };

function ensureLibrary(generator, libraryKey, libraryCode) {
  if (!generator.libraries_) {
    generator.libraries_ = {};
  }
  if (!generator.libraries_[libraryKey]) {
    generator.addLibrary(libraryKey, libraryCode);
  }
}

function ensureSPILibrary(generator) {
  ensureLibrary(generator, 'SPI_include', '#include <SPI.h>');
}


Arduino.forBlock['esp32_spi_begin'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._spiVarMonitorAttached) {
    block._spiVarMonitorAttached = true;
    block._spiVarLastName = block.getFieldValue('VAR') || 'SPI';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._spiVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'SPIClass');
          block._spiVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'SPI';
  const bus = block.getFieldValue('BUS') || 'HSPI';

  ensureSPILibrary(generator);

  // 注册变量到Blockly系统
  registerVariableToBlockly(varName, 'SPIClass');
  
  if (bus === 'VSPI') {
    generator.addVariable(varName, 'SPIClass ' + varName + '(VSPI);');
  }

  let code = '';
  code += varName + '.begin();\n';

  return code;
}

Arduino.forBlock['esp32_spi_begin_custom'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._spiVarMonitorAttached) {
    block._spiVarMonitorAttached = true;
    block._spiVarLastName = block.getFieldValue('VAR') || 'SPI';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._spiVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'SPIClass');
          block._spiVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'SPI';
  const bus = block.getFieldValue('BUS') || 'HSPI';
  
  const sck = generator.valueToCode(block, 'SCK', generator.ORDER_ATOMIC) || '-1';
  const miso = generator.valueToCode(block, 'MISO', generator.ORDER_ATOMIC) || '-1';
  const mosi = generator.valueToCode(block, 'MOSI', generator.ORDER_ATOMIC) || '-1';
  const ss = generator.valueToCode(block, 'SS', generator.ORDER_ATOMIC) || '-1';

  ensureSPILibrary(generator);

  // 注册变量到Blockly系统
  registerVariableToBlockly(varName, 'SPIClass');

  if (bus === 'VSPI') {
    generator.addVariable(varName, 'SPIClass ' + varName + '(VSPI);');
  }

  let code = '';
  code += varName + '.begin(' + sck + ', ' + miso + ', ' + mosi + ', ' + ss + ');\n';

  return code;
};

// Arduino.forBlock['esp32_spi_settings'] = function(block, generator) {
//   const varField = block.getField('VAR');
//   const varName = varField ? varField.getText() : 'SPI';
  
//   const frequency = generator.valueToCode(block, 'FREQUENCY', generator.ORDER_ATOMIC) || '1000000';
//   const bitOrder = block.getFieldValue('BIT_ORDER') || 'MSBFIRST';
//   const mode = block.getFieldValue('MODE') || '0';

//   generator.addLibrary('SPI', '#include <SPI.h>');

//   let code = '';
//   code += varName + '.setFrequency(' + frequency + ');\n';
//   code += varName + '.setBitOrder(' + bitOrder + ');\n';
//   code += varName + '.setDataMode(' + mode + ');\n';
  
//   return code;
// };

Arduino.forBlock['esp32_spi_begin_transaction'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'SPI';

  ensureSPILibrary(generator);

  const frequency = generator.valueToCode(block, 'FREQUENCY', generator.ORDER_ATOMIC) || '1000000';
  const bitOrder = block.getFieldValue('BIT_ORDER') || 'MSBFIRST';
  const mode = block.getFieldValue('MODE') || '0';

  // 使用默认设置开始事务
  let code = varName + '.beginTransaction(SPISettings(' + frequency + ', ' + bitOrder + ', SPI_MODE' + mode + '));\n';
  
  return code;
};

Arduino.forBlock['esp32_spi_end_transaction'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'SPI';

  ensureSPILibrary(generator);

  let code = varName + '.endTransaction();\n';
  
  return code;
};

Arduino.forBlock['esp32_spi_transfer'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'SPI';
  
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '0';

  ensureSPILibrary(generator);

  let code = varName + '.transfer(' + data + ')';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_spi_transfer16'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'SPI';
  
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '0';

  ensureSPILibrary(generator);

  let code = varName + '.transfer16(' + data + ')';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_spi_write'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'SPI';
  
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '0';

  ensureSPILibrary(generator);

  let code = varName + '.write(' + data + ');\n';
  
  return code;
};

Arduino.forBlock['esp32_spi_write_bytes'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'SPI';
  
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || 'NULL';
  const length = generator.valueToCode(block, 'LENGTH', generator.ORDER_ATOMIC) || '0';

  ensureSPILibrary(generator);

  let code = varName + '.writeBytes(' + data + ', ' + length + ');\n';
  
  return code;
};

Arduino.forBlock['esp32_spi_set_frequency'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'SPI';
  
  const frequency = generator.valueToCode(block, 'FREQUENCY', generator.ORDER_ATOMIC) || '1000000';

  ensureSPILibrary(generator);

  let code = varName + '.setFrequency(' + frequency + ');\n';
  
  return code;
};

Arduino.forBlock['esp32_spi_set_bit_order'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'SPI';
  
  const bitOrder = block.getFieldValue('BIT_ORDER') || 'MSBFIRST';

  ensureSPILibrary(generator);

  let code = varName + '.setBitOrder(' + bitOrder + ');\n';
  
  return code;
};

Arduino.forBlock['esp32_spi_set_data_mode'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'SPI';
  
  const mode = block.getFieldValue('MODE') || '0';

  ensureSPILibrary(generator);

  let code = varName + '.setDataMode(' + mode + ');\n';
  
  return code;
};

Arduino.forBlock['esp32_spi_get_ss_pin'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'SPI';
  
  ensureSPILibrary(generator);
  let code = varName + '.pinSS()';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};
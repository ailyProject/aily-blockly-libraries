function mag3110EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFunMAG3110', '#include <SparkFun_MAG3110.h>');
}

function mag3110GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'mag');
}

function mag3110AttachVar(block) {
  if (block._mag3110VarAttached) return;
  block._mag3110VarAttached = true;
  block._mag3110VarLastName = block.getFieldValue('VAR') || 'mag';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._mag3110VarLastName, 'MAG3110');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._mag3110VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._mag3110VarLastName, newName, 'MAG3110');
      block._mag3110VarLastName = newName;
    }
  };
}

Arduino.forBlock['mag3110_init'] = function(block, generator) {
  mag3110AttachVar(block);
  mag3110EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'mag';
  generator.addVariable(varName, 'MAG3110 ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.initialize();\n';
};

Arduino.forBlock['mag3110_start'] = function(block, generator) {
  mag3110EnsureLib(generator);
  return mag3110GetVar(block) + '.start();\n';
};

Arduino.forBlock['mag3110_data_ready'] = function(block, generator) {
  mag3110EnsureLib(generator);
  return [mag3110GetVar(block) + '.dataReady()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mag3110_read_axis'] = function(block, generator) {
  mag3110EnsureLib(generator);
  var varName = mag3110GetVar(block);
  var axis = block.getFieldValue('AXIS') || 'X';
  // readMag fills x,y,z by pointer; use individual approach via heading or inline
  generator.addVariable('mag3110_x_' + varName, 'int mag3110_x_' + varName + ' = 0;');
  generator.addVariable('mag3110_y_' + varName, 'int mag3110_y_' + varName + ' = 0;');
  generator.addVariable('mag3110_z_' + varName, 'int mag3110_z_' + varName + ' = 0;');
  generator.addFunction('mag3110ReadMag_' + varName,
    'void mag3110ReadMag_' + varName + '() {\n' +
    '  ' + varName + '.readMag(&mag3110_x_' + varName + ', &mag3110_y_' + varName + ', &mag3110_z_' + varName + ');\n' +
    '}'
  );
  var axisMap = { 'X': 'x', 'Y': 'y', 'Z': 'z' };
  // Generate a read call followed by axis access (wrapped in comma expression via helper)
  return ['(mag3110ReadMag_' + varName + '(), mag3110_' + axisMap[axis] + '_' + varName + ')', generator.ORDER_COMMA];
};

Arduino.forBlock['mag3110_read_heading'] = function(block, generator) {
  mag3110EnsureLib(generator);
  return [mag3110GetVar(block) + '.readHeading()', generator.ORDER_FUNCTION_CALL];
};

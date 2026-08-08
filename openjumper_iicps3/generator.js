
const OPENJUMPER_PS3_TYPE = 'OpenJumperPS3';

function openJumperPs3GetVariableName(block) {
  const field = block.getField('PS3_NAME');
  return field ? field.getText() : 'ps3';
}

function openJumperPs3AttachRename(block) {
  if (block._openJumperPs3VarMonitorAttached) return;
  block._openJumperPs3VarMonitorAttached = true;
  block._openJumperPs3VarLastName = block.getFieldValue('PS3_NAME') || 'ps3';

  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(
      block._openJumperPs3VarLastName,
      OPENJUMPER_PS3_TYPE
    );
  }

  const variableField = block.getField('PS3_NAME');
  if (!variableField) return;

  const originalFinishEditing = variableField.onFinishEditing_;
  variableField.onFinishEditing_ = function(newName) {
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, newName);
    }

    const workspace =
      block.workspace ||
      (typeof Blockly !== 'undefined' &&
        Blockly.getMainWorkspace &&
        Blockly.getMainWorkspace());
    const oldName = block._openJumperPs3VarLastName;
    if (
      workspace &&
      newName &&
      newName !== oldName &&
      typeof renameVariableInBlockly === 'function'
    ) {
      renameVariableInBlockly(
        block,
        oldName,
        newName,
        OPENJUMPER_PS3_TYPE
      );
      block._openJumperPs3VarLastName = newName;
    }
  };
}

// PS3IIC手柄初始化块，测试地址aa:ac:ef:ff:01:10
Arduino.forBlock['openjumper_iicps3_init'] = function(block, generator) { 
  openJumperPs3AttachRename(block);
  const ps3name = block.getFieldValue('PS3_NAME') || 'ps3';

  generator.addLibrary('OpenJumperPS3', '#include <OpenJumperPS3.h>');
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(ps3name, OPENJUMPER_PS3_TYPE);
  }
  generator.addVariable(ps3name, `OpenJumperPS3 ${ps3name};\n`);
  generator.addSetupBegin('Wire.begin', 'Wire.begin();\n');

  return '';
};

// PS3IIC手柄解析数据
Arduino.forBlock['openjumper_iicps3_run'] = function(block, generator) {
  const ps3name = openJumperPs3GetVariableName(block);

  return `${ps3name}.run();\n`;
};

// PS3IIC手柄各个按键状态块
Arduino.forBlock['openjumper_iicps3_butstate'] = function(block, generator) {
  const ps3name = openJumperPs3GetVariableName(block);

  const ps3btnstate = block.getFieldValue("IICPS3_BTN");
  return [`${ps3name}.ps3Data.${ps3btnstate}`, Arduino.ORDER_FUNCTION_CALL];
};

// PS3IIC手柄各个摇杆数据块
Arduino.forBlock['openjumper_iicps3_xy'] = function(block, generator) {
  const ps3name = openJumperPs3GetVariableName(block);

  const ps3xyval = block.getFieldValue("IICPS3_XY");
  return [`${ps3name}.ps3Data.${ps3xyval}`, Arduino.ORDER_FUNCTION_CALL];
};

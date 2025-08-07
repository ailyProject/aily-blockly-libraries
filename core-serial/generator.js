// 跟踪已初始化的串口
// 在每次代码生成时重置跟踪状态
if (!Arduino.serialCodeGeneration) {
  Arduino.serialCodeGeneration = true;
  
  // 保存原始的代码生成方法
  const originalWorkspaceToCode = Arduino.workspaceToCode;
  
  // 重写代码生成方法以在开始时重置串口跟踪
  Arduino.workspaceToCode = function(workspace) {
    // 重置串口初始化跟踪
    Arduino.initializedSerialPorts = new Set();
    Arduino.addedSerialInitCode = new Set();
    
    // 调用原始方法
    return originalWorkspaceToCode ? originalWorkspaceToCode.call(this, workspace) : '';
  };
}

if (!Arduino.initializedSerialPorts) {
  Arduino.initializedSerialPorts = new Set();
}

if (!Arduino.addedSerialInitCode) {
  Arduino.addedSerialInitCode = new Set();
}

Arduino.forBlock["serial_begin"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  const speed = block.getFieldValue("SPEED");
  
  ensureSerialBegin(obj, generator, speed);
  
  // 标记这个串口为已初始化
  Arduino.initializedSerialPorts.add(obj);
  Arduino.addedSerialInitCode.add(obj);
  
  // generator.addSetupBegin(`serial_${obj}_begin`, `${obj}.begin(${speed});`);
  return ``;
};

Arduino.forBlock["serial_print"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  const content = Arduino.valueToCode(block, "VAR", Arduino.ORDER_ATOMIC);
  // 如果没有初始化过这个串口，自动添加默认初始化
  ensureSerialBegin(obj, generator);
  return `${obj}.print(${content});\n`;
};

Arduino.forBlock["serial_println"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  const content = Arduino.valueToCode(block, "VAR", Arduino.ORDER_ATOMIC);
  ensureSerialBegin(obj, generator);
  return `${obj}.println(${content});\n`;
};

Arduino.forBlock["serial_read"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  const type = block.getFieldValue("TYPE");
  ensureSerialBegin(obj, generator);
  return [`${obj}.${type}()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["serial_available"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  ensureSerialBegin(obj, generator);
  return [`${obj}.available()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["serial_flush"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  ensureSerialBegin(obj, generator);
  return `${obj}.flush();\n`;
};

Arduino.forBlock["serial_parseint"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  ensureSerialBegin(obj, generator);
  return [`${obj}.parseInt()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["serial_write"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  const data =
    Arduino.valueToCode(block, "DATA", Arduino.ORDER_ATOMIC) || '\"\"';
  ensureSerialBegin(obj, generator);
  return `${obj}.write(${data});\n`;
};

Arduino.forBlock["serial_read_string"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  ensureSerialBegin(obj, generator);
  return [`${obj}.readString()`, Arduino.ORDER_FUNCTION_CALL];
};

// 辅助函数，确保串口已被初始化
function ensureSerialBegin(serialPort, generator, baudrate = 9600) {
  // 检查这个串口是否已经添加过初始化代码（无论是用户设置的还是默认的）
  if (!Arduino.addedSerialInitCode.has(serialPort) || baudrate != 9600) {
    // console.log(`Adding default serial initialization for ${serialPort} at ${baudrate} baud.`);
    // 只有在没有添加过任何初始化代码时才添加默认初始化
    generator.addSetupBegin(`serial_${serialPort}_begin`, `${serialPort}.begin(${baudrate});`, true);
    // 标记为已添加初始化代码
    Arduino.addedSerialInitCode.add(serialPort);
  } else {
    // console.log(`Serial port ${serialPort} already initialized.`);
  }
}


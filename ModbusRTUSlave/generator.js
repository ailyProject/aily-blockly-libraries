"use strict";

function ensureFieldInputVariable(block, fieldName, varType, defaultName) {
  const monitorKey = `_modbus_${fieldName}_monitor`;
  if (!block[monitorKey]) {
    block[monitorKey] = true;
    block[`${monitorKey}_last`] = block.getFieldValue(fieldName) || defaultName;
    const field = block.getField(fieldName);
    if (field && typeof field.setValidator === "function") {
      field.setValidator(function (newName) {
        const workspace =
          block.workspace ||
          (typeof Blockly !== "undefined" &&
            Blockly.getMainWorkspace &&
            Blockly.getMainWorkspace());
        const oldName = block[`${monitorKey}_last`];
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, varType);
          block[`${monitorKey}_last`] = newName;
        }
        return newName;
      });
    }
  }
  const name = block.getFieldValue(fieldName) || defaultName;
  registerVariableToBlockly(name, varType);
  return name;
}

function getFieldVariableText(block, fieldName, fallback) {
  const field = block.getField(fieldName);
  if (field && typeof field.getText === "function") {
    return field.getText();
  }
  return fallback;
}

function resolveSerialPort(selected) {
  if (selected) return selected;
  const boardConfig =
    typeof window !== "undefined" ? window["boardConfig"] : undefined;
  if (boardConfig && boardConfig.core) {
    if (
      boardConfig.core.includes("arduino:avr") ||
      boardConfig.core.includes("arduino:megaavr")
    ) {
      return "Serial";
    }
    if (
      boardConfig.core.includes("esp32") ||
      boardConfig.core.includes("arduino:samd")
    ) {
      return "Serial1";
    }
  }
  return "Serial";
}

function buildMacroPrefix(varName) {
  if (!varName) return "MODBUS";
  const upper = varName.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
  return upper.length ? upper : "MODBUS";
}

function ensureMacroDefine(generator, cacheKey, macroName, macroValue) {
  if (!macroValue) return;
  generator.addMacro(
    cacheKey,
    `#ifndef ${macroName}\n#define ${macroName} ${macroValue}\n#endif`,
  );
}

function ensureSerialBegin(generator, serialPort, baud, config, keyLabel) {
  if (!serialPort) return "";
  const code = `${serialPort}.begin(${baud}, ${config});`;
  return `${code}\n`;
}

function handleArrayConfig(block, generator, options) {
  const varName = getFieldVariableText(block, "VAR", "modbus");
  const arrayName = ensureFieldInputVariable(
    block,
    "ARRAY",
    options.varType,
    options.defaultName,
  );
  const lengthValue = parseInt(block.getFieldValue("LENGTH"), 10);
  const lengthLiteral = Math.max(
    1,
    isNaN(lengthValue) ? options.defaultLength : lengthValue,
  ).toString();
  const initializer = options.cType === "bool" ? "{false};" : "{0};";
  generator.addObject(
    `modbus_array_${options.varType}_${arrayName}`,
    `${options.cType} ${arrayName}[${lengthLiteral}] = ${initializer}`,
  );
  return `${varName}.${options.method}(${arrayName}, ${lengthLiteral});\n`;
}

function buildBoolSet(block, generator, defaultName) {
  const arrayName = getFieldVariableText(block, "ARRAY", defaultName);
  const index =
    generator.valueToCode(block, "INDEX", Arduino.ORDER_ATOMIC) || "0";
  const value =
    generator.valueToCode(block, "VALUE", Arduino.ORDER_ATOMIC) || "false";
  return `${arrayName}[${index}] = ${value};\n`;
}

function buildBoolGet(block, generator, defaultName) {
  const arrayName = getFieldVariableText(block, "ARRAY", defaultName);
  const index =
    generator.valueToCode(block, "INDEX", Arduino.ORDER_ATOMIC) || "0";
  const code = `${arrayName}[${index}]`;
  return [code, Arduino.ORDER_ATOMIC];
}

function buildNumberSet(block, generator, defaultName) {
  const arrayName = getFieldVariableText(block, "ARRAY", defaultName);
  const index =
    generator.valueToCode(block, "INDEX", Arduino.ORDER_ATOMIC) || "0";
  const value =
    generator.valueToCode(block, "VALUE", Arduino.ORDER_ATOMIC) || "0";
  return `${arrayName}[${index}] = ${value};\n`;
}

function buildNumberGet(block, generator, defaultName) {
  const arrayName = getFieldVariableText(block, "ARRAY", defaultName);
  const index =
    generator.valueToCode(block, "INDEX", Arduino.ORDER_ATOMIC) || "0";
  const code = `${arrayName}[${index}]`;
  return [code, Arduino.ORDER_ATOMIC];
}

Arduino.forBlock["modbus_rtu_slave_create"] = function (block, generator) {
  const varName = ensureFieldInputVariable(
    block,
    "VAR",
    "ModbusRTUSlave",
    "modbus",
  );
  const serialPort = resolveSerialPort(block.getFieldValue("SERIAL"));
  const dePin =
    generator.valueToCode(block, "DE_PIN", Arduino.ORDER_ATOMIC) || "-1";
  const rePin =
    generator.valueToCode(block, "RE_PIN", Arduino.ORDER_ATOMIC) || "-1";

  generator.addLibrary("ModbusRTUSlave", "#include <ModbusRTUSlave.h>");
  const macroPrefix = buildMacroPrefix(varName);
  const serialMacro = `${macroPrefix}_SERIAL`;
  const serialMacroKey = `modbus_macro_${varName}_serial`;
  ensureMacroDefine(generator, serialMacroKey, serialMacro, serialPort);
  generator.addObject(
    `modbus_rtu_slave_${varName}`,
    `ModbusRTUSlave ${varName}(${serialPort}, ${dePin}, ${rePin});`,
  );

  generator._modbusInstances = generator._modbusInstances || {};
  generator._modbusInstances[varName] = {
    serialPort,
    macroPrefix,
    serialMacro,
  };

  return "";
};

Arduino.forBlock["modbus_rtu_slave_set_response_delay"] = function (
  block,
  generator,
) {
  const varName = getFieldVariableText(block, "VAR", "modbus");
  const delay =
    generator.valueToCode(block, "DELAY", Arduino.ORDER_ATOMIC) || "0";
  return `${varName}.setResponseDelay(${delay});\n`;
};

Arduino.forBlock["modbus_rtu_slave_begin"] = function (block, generator) {
  const varName = getFieldVariableText(block, "VAR", "modbus");
  const unitId = block.getFieldValue("UNIT_ID") || "1";
  const baud =
    generator.valueToCode(block, "BAUD", Arduino.ORDER_ATOMIC) || "38400";
  const config = block.getFieldValue("CONFIG") || "SERIAL_8N1";
  const instance = generator._modbusInstances
    ? generator._modbusInstances[varName]
    : null;
  const serialPort = resolveSerialPort(
    instance && instance.serialPort ? instance.serialPort : undefined,
  );
  const macroPrefix =
    (instance && instance.macroPrefix) || buildMacroPrefix(varName);
  const serialMacro =
    (instance && instance.serialMacro) || `${macroPrefix}_SERIAL`;
  const configMacro = `${macroPrefix}_CONFIG`;
  const serialMacroKey = `modbus_macro_${varName}_serial`;
  const configMacroKey = `modbus_macro_${varName}_config`;
  ensureMacroDefine(generator, serialMacroKey, serialMacro, serialPort);
  ensureMacroDefine(generator, configMacroKey, configMacro, config);

  const serialInit = ensureSerialBegin(
    generator,
    serialMacro,
    baud,
    configMacro,
    macroPrefix,
  );

  return `${serialInit}${varName}.begin(${unitId}, ${baud}, ${config});\n`;
};

Arduino.forBlock["modbus_rtu_slave_poll"] = function (block, generator) {
  const varName = getFieldVariableText(block, "VAR", "modbus");
  const statements = generator.statementToCode(block, "DO");
  if (statements && statements.trim()) {
    return `if (${varName}.poll()) {\n${statements}}\n`;
  }
  return `${varName}.poll();\n`;
};

Arduino.forBlock["modbus_rtu_slave_bind_coils"] = function (block, generator) {
  return handleArrayConfig(block, generator, {
    varType: "ModbusCoilArray",
    defaultName: "coils",
    defaultLength: 2,
    cType: "bool",
    method: "configureCoils",
  });
};

Arduino.forBlock["modbus_rtu_slave_bind_discrete"] = function (
  block,
  generator,
) {
  return handleArrayConfig(block, generator, {
    varType: "ModbusDiscreteArray",
    defaultName: "discreteInputs",
    defaultLength: 2,
    cType: "bool",
    method: "configureDiscreteInputs",
  });
};

Arduino.forBlock["modbus_rtu_slave_bind_holding"] = function (
  block,
  generator,
) {
  return handleArrayConfig(block, generator, {
    varType: "ModbusHoldingArray",
    defaultName: "holdingRegisters",
    defaultLength: 2,
    cType: "uint16_t",
    method: "configureHoldingRegisters",
  });
};

Arduino.forBlock["modbus_rtu_slave_bind_input"] = function (block, generator) {
  return handleArrayConfig(block, generator, {
    varType: "ModbusInputArray",
    defaultName: "inputRegisters",
    defaultLength: 2,
    cType: "uint16_t",
    method: "configureInputRegisters",
  });
};

Arduino.forBlock["modbus_rtu_slave_coils_set"] = function (block, generator) {
  return buildBoolSet(block, generator, "coils");
};

Arduino.forBlock["modbus_rtu_slave_coils_get"] = function (block, generator) {
  return buildBoolGet(block, generator, "coils");
};

Arduino.forBlock["modbus_rtu_slave_discrete_set"] = function (
  block,
  generator,
) {
  return buildBoolSet(block, generator, "discreteInputs");
};

Arduino.forBlock["modbus_rtu_slave_discrete_get"] = function (
  block,
  generator,
) {
  return buildBoolGet(block, generator, "discreteInputs");
};

Arduino.forBlock["modbus_rtu_slave_holding_set"] = function (block, generator) {
  return buildNumberSet(block, generator, "holdingRegisters");
};

Arduino.forBlock["modbus_rtu_slave_holding_get"] = function (block, generator) {
  return buildNumberGet(block, generator, "holdingRegisters");
};

Arduino.forBlock["modbus_rtu_slave_input_set"] = function (block, generator) {
  return buildNumberSet(block, generator, "inputRegisters");
};

Arduino.forBlock["modbus_rtu_slave_input_get"] = function (block, generator) {
  return buildNumberGet(block, generator, "inputRegisters");
};

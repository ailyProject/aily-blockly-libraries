"use strict";

(function registerSeeedIrGenerators() {
const SEEED_IR_PROTOCOLS = [
  { value: "NEC", key: "P01_NEC", include: "#include <IRLib_P01_NEC.h>" },
  { value: "SONY", key: "P02_Sony", include: "#include <IRLib_P02_Sony.h>" },
  { value: "RC5", key: "P03_RC5", include: "#include <IRLib_P03_RC5.h>" },
  { value: "RC6", key: "P04_RC6", include: "#include <IRLib_P04_RC6.h>" },
  { value: "PANASONIC_OLD", key: "P05_PanasonicOld", include: "#include <IRLib_P05_Panasonic_Old.h>" },
  { value: "JVC", key: "P06_JVC", include: "#include <IRLib_P06_JVC.h>" },
  { value: "NECX", key: "P07_NECx", include: "#include <IRLib_P07_NECx.h>" },
  { value: "SAMSUNG36", key: "P08_Samsung36", include: "#include <IRLib_P08_Samsung36.h>" },
  { value: "GICABLE", key: "P09_GICable", include: "#include <IRLib_P09_GICable.h>" },
  { value: "DIRECTV", key: "P10_DirecTV", include: "#include <IRLib_P10_DirecTV.h>" },
  { value: "RCMM", key: "P11_RCMM", include: "#include <IRLib_P11_RCMM.h>" },
  { value: "CYKM", key: "P12_CYKM", include: "#include <IRLib_P12_CYKM.h>" }
];

function getSeeedIrProtocol(protocol) {
  const normalized = String(protocol || "NEC").toUpperCase();
  return SEEED_IR_PROTOCOLS.find(function(item) {
    return item.value === normalized;
  }) || SEEED_IR_PROTOCOLS[0];
}

function getSeeedIrState(generator) {
  if (!generator._seeedIrProtocolIncludes) {
    generator._seeedIrProtocolIncludes = Object.create(null);
  }
  return generator._seeedIrProtocolIncludes;
}

function updateSeeedIrProtocolIncludes(generator) {
  const selected = getSeeedIrState(generator);
  const includes = SEEED_IR_PROTOCOLS.filter(function(item) {
    return selected[item.value];
  }).map(function(item) {
    return item.include;
  });
  generator.addLibrary("SeeedIR_Protocols", includes.join("\n"), true);
}

function ensureSeeedIrCore(generator) {
  generator.addLibrary("SeeedIR_SendBase", "#include <IRLibSendBase.h>");
  generator.addLibrary("SeeedIR_DecodeBase", "#include <IRLibDecodeBase.h>");
  generator.addLibrary("SeeedIR_Protocols", "");
  generator.addLibrary("SeeedIR_HashRaw", "#include <IRLib_HashRaw.h>");
  generator.addLibrary("SeeedIR_Combo", "#include <IRLibCombo.h>");
}

function ensureSeeedIrProtocol(generator, protocol) {
  const selected = getSeeedIrProtocol(protocol);
  ensureSeeedIrCore(generator);
  getSeeedIrState(generator)[selected.value] = true;
  updateSeeedIrProtocolIncludes(generator);
}

function ensureSeeedIrReceive(generator, protocol) {
  if (protocol) {
    ensureSeeedIrProtocol(generator, protocol);
  } else {
    ensureSeeedIrCore(generator);
  }
  generator.addLibrary("SeeedIR_RecvPCI", "#include <IRLibRecvPCI.h>");
}

function ensureSeeedIrProtocolNameHelper(generator) {
  ensureSeeedIrCore(generator);
  generator.addFunction(
    "aily_seeed_ir_protocol_name",
    "String ailySeeedIrProtocolName(uint8_t protocol) {\n" +
      "  return String(Pnames(protocol));\n" +
      "}\n"
  );
}

function ensureSerialBegin(generator) {
  if (generator && typeof generator.addSetupBegin === "function") {
    generator.addSetupBegin("seeed_ir_serial_begin", "Serial.begin(9600);\n", false);
  } else if (typeof Arduino !== "undefined" && typeof Arduino.addSetupBegin === "function") {
    Arduino.addSetupBegin("seeed_ir_serial_begin", "  Serial.begin(9600);\n");
  }
}

function addGlobalDeclaration(generator, key, declaration) {
  if (generator && typeof generator.addObject === "function") {
    generator.addObject(key, declaration);
  } else {
    generator.addVariable(key, declaration);
  }
}

function attachFieldInputVarMonitor(block, fieldName, varType, defaultName, monitorKey) {
  const currentName = block.getFieldValue(fieldName) || defaultName;
  registerVariableToBlockly(currentName, varType);

  if (block[monitorKey]) {
    return;
  }

  block[monitorKey] = true;
  const lastNameKey = monitorKey + "LastName";
  block[lastNameKey] = currentName;
  const varField = block.getField(fieldName);
  if (!varField) {
    return;
  }

  const originalFinishEditing = varField.onFinishEditing_;
  varField.onFinishEditing_ = function(newName) {
    if (typeof originalFinishEditing === "function") {
      originalFinishEditing.call(this, newName);
    }

    const workspace = block.workspace ||
      (typeof Blockly !== "undefined" && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
    const oldName = block[lastNameKey];
    if (workspace && newName && newName !== oldName) {
      renameVariableInBlockly(block, oldName, newName, varType);
      block[lastNameKey] = newName;
    }
  };
}

function getVarNameFromVAR(block, fallback) {
  const varField = block.getField('VAR');
  return varField ? varField.getText() : fallback;
}

function getFieldVariableName(block, fieldName, fallback) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : fallback;
}

function valueCode(generator, block, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function stripQuotedTextLiteral(code) {
  const trimmed = (code || "").trim();
  const match = trimmed.match(/^(["'])([\s\S]*)\1$/);
  return match ? match[2] : trimmed;
}

function ensureWioTerminalBoardHint() {
  const boardConfig = typeof window !== "undefined" ? window["boardConfig"] : null;
  return !!(boardConfig && JSON.stringify(boardConfig).indexOf("Wio") !== -1);
}

Arduino.forBlock["seeed_ir_sender_create"] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || "irSender";
  attachFieldInputVarMonitor(block, "VAR", "IRsend", "irSender", "_seeedIrSenderVarMonitorAttached");
  ensureSeeedIrCore(generator);
  addGlobalDeclaration(generator, "seeed_ir_sender_" + varName, "IRsend " + varName + ";");
  ensureWioTerminalBoardHint();
  return "";
};

Arduino.forBlock["seeed_ir_raw_sender_create"] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || "rawSender";
  attachFieldInputVarMonitor(block, "VAR", "IRsendRaw", "rawSender", "_seeedIrRawSenderVarMonitorAttached");
  ensureSeeedIrCore(generator);
  addGlobalDeclaration(generator, "seeed_ir_raw_sender_" + varName, "IRsendRaw " + varName + ";");
  return "";
};

Arduino.forBlock["seeed_ir_send"] = function(block, generator) {
  const varName = getVarNameFromVAR(block, "irSender");
  const protocol = block.getFieldValue("PROTOCOL") || "NEC";
  const data = valueCode(generator, block, "DATA", "0");
  const data2 = valueCode(generator, block, "DATA2", "0");
  const khz = valueCode(generator, block, "KHZ", "38");
  ensureSeeedIrProtocol(generator, protocol);
  return varName + ".send(" + protocol + ", " + data + ", " + data2 + ", " + khz + ");\n";
};

Arduino.forBlock["seeed_ir_send_nec"] = function(block, generator) {
  const varName = getVarNameFromVAR(block, "irSender");
  const data = valueCode(generator, block, "DATA", "1637937167");
  const khz = valueCode(generator, block, "KHZ", "38");
  ensureSeeedIrProtocol(generator, "NEC");
  return varName + ".send(NEC, " + data + ", 0, " + khz + ");\n";
};

Arduino.forBlock["seeed_ir_wio_send"] = function(block, generator) {
  const protocol = block.getFieldValue("PROTOCOL") || "NEC";
  const data = valueCode(generator, block, "DATA", "1637937167");
  const data2 = valueCode(generator, block, "DATA2", "0");
  const khz = valueCode(generator, block, "KHZ", "38");
  ensureSeeedIrProtocol(generator, protocol);
  addGlobalDeclaration(generator, "seeed_ir_wio_sender", "IRsend ailyWioIrSender;");
  ensureWioTerminalBoardHint();
  return "ailyWioIrSender.send(" + protocol + ", " + data + ", " + data2 + ", " + khz + ");\n";
};

Arduino.forBlock["seeed_ir_send_raw"] = function(block, generator) {
  const varName = getVarNameFromVAR(block, "rawSender");
  const rawText = stripQuotedTextLiteral(valueCode(generator, block, "DATA", '"9000,4500,560,560"'));
  const khz = valueCode(generator, block, "KHZ", "38");
  ensureSeeedIrCore(generator);
  return "{\n" +
    "  uint16_t ailySeeedIrRawData[] = {" + rawText + "};\n" +
    "  " + varName + ".send(ailySeeedIrRawData, sizeof(ailySeeedIrRawData) / sizeof(ailySeeedIrRawData[0]), " + khz + ");\n" +
    "}\n";
};

Arduino.forBlock["seeed_ir_receiver_create"] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || "irReceiver";
  const decoderName = block.getFieldValue("DECODER") || "irDecoder";
  const protocol = block.getFieldValue("PROTOCOL") || "NEC";
  const pin = block.getFieldValue("PIN") || "2";
  attachFieldInputVarMonitor(block, "VAR", "IRrecvPCI", "irReceiver", "_seeedIrReceiverVarMonitorAttached");
  attachFieldInputVarMonitor(block, "DECODER", "IRdecode", "irDecoder", "_seeedIrDecoderVarMonitorAttached");
  ensureSeeedIrReceive(generator, protocol);
  addGlobalDeclaration(generator, "seeed_ir_receiver_" + varName, "IRrecvPCI " + varName + "(" + pin + ");");
  addGlobalDeclaration(generator, "seeed_ir_decoder_" + decoderName, "IRdecode " + decoderName + ";");
  return "";
};

Arduino.forBlock["seeed_ir_receiver_enable"] = function(block, generator) {
  const varName = getVarNameFromVAR(block, "irReceiver");
  ensureSeeedIrReceive(generator);
  return varName + ".enableIRIn();\n";
};

Arduino.forBlock["seeed_ir_on_receive"] = function(block, generator) {
  const varName = getVarNameFromVAR(block, "irReceiver");
  const decoderName = getFieldVariableName(block, "DECODER", "irDecoder");
  const statements = generator.statementToCode(block, "DO") || "";
  ensureSeeedIrReceive(generator);
  return "if (" + varName + ".getResults()) {\n" +
    "  " + decoderName + ".decode();\n" +
    statements +
    "  " + varName + ".enableIRIn();\n" +
    "}\n";
};

Arduino.forBlock["seeed_ir_receiver_available"] = function(block, generator) {
  const varName = getVarNameFromVAR(block, "irReceiver");
  ensureSeeedIrReceive(generator);
  return [varName + ".getResults()", generator.ORDER_ATOMIC];
};

Arduino.forBlock["seeed_ir_decoder_decode"] = function(block, generator) {
  const decoderName = getFieldVariableName(block, "DECODER", "irDecoder");
  ensureSeeedIrCore(generator);
  return decoderName + ".decode();\n";
};

Arduino.forBlock["seeed_ir_decoder_get"] = function(block, generator) {
  const decoderName = getFieldVariableName(block, "DECODER", "irDecoder");
  const field = block.getFieldValue("FIELD") || "VALUE";
  const fieldMap = {
    PROTOCOL: "protocolNum",
    VALUE: "value",
    ADDRESS: "address",
    BITS: "bits"
  };
  ensureSeeedIrCore(generator);
  return [decoderName + "." + (fieldMap[field] || "value"), generator.ORDER_ATOMIC];
};

Arduino.forBlock["seeed_ir_decoder_protocol_name"] = function(block, generator) {
  const decoderName = getFieldVariableName(block, "DECODER", "irDecoder");
  ensureSeeedIrProtocolNameHelper(generator);
  return ["ailySeeedIrProtocolName(" + decoderName + ".protocolNum)", generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["seeed_ir_decoder_dump"] = function(block, generator) {
  const decoderName = getFieldVariableName(block, "DECODER", "irDecoder");
  const verbose = block.getFieldValue("VERBOSE") || "true";
  ensureSeeedIrCore(generator);
  ensureSerialBegin(generator);
  return decoderName + ".dumpResults(" + verbose + ");\n";
};

Arduino.forBlock["seeed_ir_receiver_resume"] = function(block, generator) {
  const varName = getVarNameFromVAR(block, "irReceiver");
  ensureSeeedIrReceive(generator);
  return varName + ".enableIRIn();\n";
};
})();

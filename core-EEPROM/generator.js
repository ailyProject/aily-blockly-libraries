Arduino.forBlock["eeprom_read"] = function (block) {
  Arduino.addLibrary("eeprom", `#include <EEPROM.h>`);
  const address = Arduino.valueToCode(block, "ADDRESS", Arduino.ORDER_ATOMIC);
  return [`EEPROM.read(${address})`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["eeprom_length"] = function (block) {
  Arduino.addLibrary("eeprom", `#include <EEPROM.h>`);
  return ["EEPROM.length()", Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["eeprom_get"] = function (block) {
  Arduino.addLibrary("eeprom", `#include <EEPROM.h>`);
  const address = Arduino.valueToCode(block, "ADDRESS", Arduino.ORDER_ATOMIC) || "0";
  const variable = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const varName = variable ? variable.name : block.getField("VAR").getText();
  return `EEPROM.get(${address}, ${varName});\n`;
};

Arduino.forBlock["eeprom_write"] = function (block) {
  Arduino.addLibrary("eeprom", `#include <EEPROM.h>`);
  const address = Arduino.valueToCode(block, "ADDRESS", Arduino.ORDER_ATOMIC);
  const value = Arduino.valueToCode(block, "VALUE", Arduino.ORDER_ATOMIC);
  return `EEPROM.put(${address}, ${value});\n`;
};

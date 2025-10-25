"use strict";

// 通用依赖与工具函数
function ensureRfidLibs(generator) {
    generator.addLibrary("#include <SPI.h>", "#include <SPI.h>");
    generator.addLibrary("#include <MFRC522.h>", "#include <MFRC522.h>");
}

function ensureRfidUidHelper(generator) {
    generator.addFunction(
        "rfid_uid_to_string",
        `String rfidUidToString(MFRC522 &reader) {
  String uid = "";
  for (byte i = 0; i < reader.uid.size; i++) {
    if (reader.uid.uidByte[i] < 0x10) uid += "0";
    uid += String(reader.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();
  return uid;
}`,
    );
}

function ensureRfidHexHelper(generator) {
    generator.addFunction(
        "rfid_hex_string_to_bytes",
        `bool rfidHexStringToBytes(String hexString, byte *byteArray, size_t byteCount) {
  if (hexString.length() < byteCount * 2) {
    return false;
  }
  hexString.toUpperCase();
  for (size_t i = 0; i < byteCount; i++) {
    String byteString = hexString.substring(i * 2, i * 2 + 2);
    byteArray[i] = (byte) strtol(byteString.c_str(), NULL, 16);
  }
  return true;
}`,
    );
}

function ensureRfidNormalizeHelper(generator) {
    generator.addFunction(
        "rfid_normalize_hex_string",
        `String rfidNormalizeHexString(String value) {
  value.toUpperCase();
  value.trim();
  return value;
}`,
    );
}

function ensureRfidAuthHelper(generator) {
    ensureRfidHexHelper(generator);
    generator.addFunction(
        "rfid_authenticate_sector",
        `bool rfidAuthenticateSector(MFRC522 &reader, int sector, MFRC522::PICC_Command keyType, String keyString) {
  byte key[6];
  if (!rfidHexStringToBytes(keyString, key, 6)) {
    return false;
  }

  MFRC522::MIFARE_Key mfKey;
  for (byte i = 0; i < 6; i++) {
    mfKey.keyByte[i] = key[i];
  }

  byte trailerBlock = sector * 4 + 3;
  MFRC522::StatusCode status = reader.PCD_Authenticate(keyType, trailerBlock, &mfKey, &(reader.uid));
  return status == MFRC522::STATUS_OK;
}`,
    );
}

function ensureRfidReadBlockHelper(generator) {
    generator.addFunction(
        "rfid_read_block_hex",
        `String rfidReadBlockHex(MFRC522 &reader, byte blockAddr) {
  byte buffer[18];
  byte size = sizeof(buffer);
  MFRC522::StatusCode status = reader.MIFARE_Read(blockAddr, buffer, &size);
  if (status != MFRC522::STATUS_OK) {
    return "";
  }

  String result = "";
  for (byte i = 0; i < 16; i++) {
    if (buffer[i] < 0x10) result += "0";
    result += String(buffer[i], HEX);
  }
  result.toUpperCase();
  return result;
}`,
    );
}

function ensureRfidWriteBlockHelper(generator) {
    generator.addFunction(
        "rfid_write_block_data",
        `bool rfidWriteBlockData(MFRC522 &reader, byte blockAddr, String dataString) {
  byte buffer[16];
  for (byte i = 0; i < 16; i++) {
    buffer[i] = 0x00;
  }

  bool treatAsHex = dataString.length() <= 32 && (dataString.length() % 2 == 0);
  if (treatAsHex) {
    for (int i = 0; i < dataString.length(); i++) {
      char c = dataString.charAt(i);
      bool isHex =
          (c >= '0' && c <= '9') ||
          (c >= 'A' && c <= 'F') ||
          (c >= 'a' && c <= 'f');
      if (!isHex) {
        treatAsHex = false;
        break;
      }
    }
  }

  if (treatAsHex) {
    dataString.toUpperCase();
    for (int i = 0; i < dataString.length() / 2 && i < 16; i++) {
      String byteString = dataString.substring(i * 2, i * 2 + 2);
      buffer[i] = (byte) strtol(byteString.c_str(), NULL, 16);
    }
  } else {
    for (int i = 0; i < dataString.length() && i < 16; i++) {
      buffer[i] = dataString.charAt(i);
    }
  }

  MFRC522::StatusCode status = reader.MIFARE_Write(blockAddr, buffer, 16);
  return status == MFRC522::STATUS_OK;
}`,
    );
}

function attachRfidVarMonitor(block) {
    if (block._rfidVarMonitorAttached) {
        return;
    }
    block._rfidVarMonitorAttached = true;
    block._rfidVarLastName = block.getFieldValue("VAR") || "rfid";
    const varField = block.getField("VAR");
    if (varField && typeof varField.setValidator === "function") {
        varField.setValidator(function (newName) {
            const workspace =
                block.workspace ||
                (typeof Blockly !== "undefined" &&
                    Blockly.getMainWorkspace &&
                    Blockly.getMainWorkspace());
            const oldName = block._rfidVarLastName;
            if (workspace && newName && newName !== oldName) {
                renameVariableInBlockly(block, oldName, newName, "RFIDReader");
                block._rfidVarLastName = newName;
            }
            return newName;
        });
    }
}

function getRfidVarName(block) {
    const varField = block.getField("VAR");
    return varField ? varField.getText() : "rfid";
}

// RFID MFRC522模块驱动 - Generator
Arduino.forBlock["rfid_init"] = function (block, generator) {
    attachRfidVarMonitor(block);
    ensureRfidLibs(generator);

    const varName = block.getFieldValue("VAR") || "rfid";
    const sdaPin = block.getFieldValue("SDA_PIN");
    const rstPin = block.getFieldValue("RST_PIN");

    registerVariableToBlockly(varName, "RFIDReader");
    generator.addVariable(
        "MFRC522 " + varName,
        "MFRC522 " + varName + "(" + sdaPin + ", " + rstPin + ");",
    );
    generator.addSetupBegin("SPI.begin();", "SPI.begin();");
    generator.addSetupBegin(varName + ".PCD_Init();", varName + ".PCD_Init();");

    return "";
};

Arduino.forBlock["rfid_is_card_present"] = function (block, generator) {
    ensureRfidLibs(generator);
    const varName = getRfidVarName(block);
    const code = varName + ".PICC_IsNewCardPresent()";
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock["rfid_read_uid"] = function (block, generator) {
    ensureRfidLibs(generator);
    ensureRfidUidHelper(generator);

    const varName = getRfidVarName(block);
    const code =
        "(" +
        varName +
        ".PICC_ReadCardSerial() ? rfidUidToString(" +
        varName +
        ') : "")';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock["rfid_authenticate"] = function (block, generator) {
    ensureRfidLibs(generator);
    ensureRfidAuthHelper(generator);

    const varName = getRfidVarName(block);
    const sector =
        generator.valueToCode(block, "SECTOR", generator.ORDER_ATOMIC) || "1";
    const keyType = block.getFieldValue("KEY_TYPE");
    const key =
        generator.valueToCode(block, "KEY", generator.ORDER_ATOMIC) ||
        '"FFFFFFFFFFFF"';

    const code =
        "rfidAuthenticateSector(" +
        varName +
        ", " +
        sector +
        ", MFRC522::" +
        keyType +
        ", " +
        key +
        ")";
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock["rfid_read_block"] = function (block, generator) {
    ensureRfidLibs(generator);
    ensureRfidReadBlockHelper(generator);

    const varName = getRfidVarName(block);
    const blockNum =
        generator.valueToCode(block, "BLOCK", generator.ORDER_ATOMIC) || "1";
    const code = "rfidReadBlockHex(" + varName + ", " + blockNum + ")";
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock["rfid_write_block"] = function (block, generator) {
    ensureRfidLibs(generator);
    ensureRfidWriteBlockHelper(generator);

    const varName = getRfidVarName(block);
    const blockNum =
        generator.valueToCode(block, "BLOCK", generator.ORDER_ATOMIC) || "1";
    const data =
        generator.valueToCode(block, "DATA", generator.ORDER_ATOMIC) || '""';

    const code =
        "rfidWriteBlockData(" +
        varName +
        ", " +
        blockNum +
        ", " +
        data +
        ");\n";
    return code;
};

Arduino.forBlock["rfid_halt"] = function (block, generator) {
    ensureRfidLibs(generator);
    const varName = getRfidVarName(block);
    const code =
        varName + ".PICC_HaltA();\n" + varName + ".PCD_StopCrypto1();\n";
    return code;
};

Arduino.forBlock["rfid_get_uid_string"] = function (block, generator) {
    ensureRfidLibs(generator);
    ensureRfidUidHelper(generator);
    const varName = getRfidVarName(block);
    const code = "rfidUidToString(" + varName + ")";
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock["rfid_uid_equals"] = function (block, generator) {
    ensureRfidLibs(generator);
    ensureRfidUidHelper(generator);
    ensureRfidNormalizeHelper(generator);

    const varName = getRfidVarName(block);
    const uid =
        generator.valueToCode(block, "UID", generator.ORDER_ATOMIC) || '""';
    const normalized = "rfidNormalizeHexString(String(" + uid + "))";
    const code = "(rfidUidToString(" + varName + ") == " + normalized + ")";
    return [code, generator.ORDER_ATOMIC];
};

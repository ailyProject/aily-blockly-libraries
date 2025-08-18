// RFID MFRC522模块驱动 - Generator

Arduino.forBlock['rfid_init'] = function(block, generator) {
    const sdaPin = block.getFieldValue('SDA_PIN');
    const rstPin = block.getFieldValue('RST_PIN');
    
    generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
    generator.addLibrary('#include <MFRC522.h>', '#include <MFRC522.h>');
    generator.addObject(`MFRC522 rfid(${sdaPin}, ${rstPin});`, `MFRC522 rfid(${sdaPin}, ${rstPin});`);
    generator.addSetupBegin('SPI.begin();', 'SPI.begin();');
    generator.addSetupBegin('rfid.PCD_Init();', 'rfid.PCD_Init();');
    
    return '';
};

Arduino.forBlock['rfid_is_card_present'] = function(block, generator) {
    generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
    generator.addLibrary('#include <MFRC522.h>', '#include <MFRC522.h>');
    
    const code = 'rfid.PICC_IsNewCardPresent()';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['rfid_read_uid'] = function(block, generator) {
    generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
    generator.addLibrary('#include <MFRC522.h>', '#include <MFRC522.h>');
    
    // 添加辅助函数来获取UID字符串
    generator.addFunction('rfid_uid_to_string', `String rfidUIDToString() {
  String uid = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) uid += "0";
    uid += String(rfid.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();
  return uid;
}`);
    
    const code = '(rfid.PICC_ReadCardSerial() ? rfidUIDToString() : "")';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['rfid_authenticate'] = function(block, generator) {
    const sector = generator.valueToCode(block, 'SECTOR', generator.ORDER_ATOMIC) || '1';
    const keyType = block.getFieldValue('KEY_TYPE');
    const key = generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC) || '"FFFFFFFFFFFF"';
    
    generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
    generator.addLibrary('#include <MFRC522.h>', '#include <MFRC522.h>');
    
    // 添加密钥转换函数
    generator.addFunction('rfid_key_convert', `void rfidHexStringToBytes(String hexString, byte* byteArray) {
  hexString.toUpperCase();
  for (int i = 0; i < 6; i++) {
    String byteString = hexString.substring(i*2, i*2+2);
    byteArray[i] = (byte) strtol(byteString.c_str(), NULL, 16);
  }
}`);
    
    generator.addFunction('rfid_authenticate_sector', `bool rfidAuthenticateSector(int sector, MFRC522::PICC_Command keyType, String keyString) {
  byte key[6];
  rfidHexStringToBytes(keyString, key);
  MFRC522::MIFARE_Key mfKey;
  for (byte i = 0; i < 6; i++) mfKey.keyByte[i] = key[i];
  
  byte trailerBlock = sector * 4 + 3;
  MFRC522::StatusCode status = rfid.PCD_Authenticate(keyType, trailerBlock, &mfKey, &(rfid.uid));
  return (status == MFRC522::STATUS_OK);
}`);
    
    const code = `rfidAuthenticateSector(${sector}, MFRC522::${keyType}, ${key})`;
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['rfid_read_block'] = function(block, generator) {
    const blockNum = generator.valueToCode(block, 'BLOCK', generator.ORDER_ATOMIC) || '1';
    
    generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
    generator.addLibrary('#include <MFRC522.h>', '#include <MFRC522.h>');
    
    generator.addFunction('rfid_read_block_data', `String rfidReadBlock(byte blockAddr) {
  byte buffer[18];
  byte size = sizeof(buffer);
  MFRC522::StatusCode status = rfid.MIFARE_Read(blockAddr, buffer, &size);
  
  if (status == MFRC522::STATUS_OK) {
    String result = "";
    for (byte i = 0; i < 16; i++) {
      if (buffer[i] < 0x10) result += "0";
      result += String(buffer[i], HEX);
    }
    result.toUpperCase();
    return result;
  }
  return "";
}`);
    
    const code = `rfidReadBlock(${blockNum})`;
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['rfid_write_block'] = function(block, generator) {
    const blockNum = generator.valueToCode(block, 'BLOCK', generator.ORDER_ATOMIC) || '1';
    const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
    
    generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
    generator.addLibrary('#include <MFRC522.h>', '#include <MFRC522.h>');
    
    generator.addFunction('rfid_write_block_data', `bool rfidWriteBlock(byte blockAddr, String dataString) {
  byte buffer[16];
  
  // 清空缓冲区
  for (byte i = 0; i < 16; i++) buffer[i] = 0x00;
  
  // 如果是十六进制字符串，转换为字节
  if (dataString.length() <= 32 && dataString.length() % 2 == 0) {
    bool isHex = true;
    for (int i = 0; i < dataString.length(); i++) {
      char c = dataString.charAt(i);
      if (!((c >= '0' && c <= '9') || (c >= 'A' && c <= 'F') || (c >= 'a' && c <= 'f'))) {
        isHex = false;
        break;
      }
    }
    
    if (isHex) {
      dataString.toUpperCase();
      for (int i = 0; i < dataString.length() / 2 && i < 16; i++) {
        String byteString = dataString.substring(i*2, i*2+2);
        buffer[i] = (byte) strtol(byteString.c_str(), NULL, 16);
      }
    } else {
      // 普通文本
      for (int i = 0; i < dataString.length() && i < 16; i++) {
        buffer[i] = dataString.charAt(i);
      }
    }
  } else {
    // 普通文本
    for (int i = 0; i < dataString.length() && i < 16; i++) {
      buffer[i] = dataString.charAt(i);
    }
  }
  
  MFRC522::StatusCode status = rfid.MIFARE_Write(blockAddr, buffer, 16);
  return (status == MFRC522::STATUS_OK);
}`);
    
    const code = `rfidWriteBlock(${blockNum}, ${data});\n`;
    return code;
};

Arduino.forBlock['rfid_halt'] = function(block, generator) {
    generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
    generator.addLibrary('#include <MFRC522.h>', '#include <MFRC522.h>');
    
    const code = 'rfid.PICC_HaltA();\n';
    return code;
};

Arduino.forBlock['rfid_get_uid_string'] = function(block, generator) {
    generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
    generator.addLibrary('#include <MFRC522.h>', '#include <MFRC522.h>');
    
    // 使用已定义的函数
    generator.addFunction('rfid_uid_to_string', `String rfidUIDToString() {
  String uid = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) uid += "0";
    uid += String(rfid.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();
  return uid;
}`);
    
    const code = 'rfidUIDToString()';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['rfid_uid_equals'] = function(block, generator) {
    const uid = generator.valueToCode(block, 'UID', generator.ORDER_ATOMIC) || '""';
    
    generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
    generator.addLibrary('#include <MFRC522.h>', '#include <MFRC522.h>');
    
    // 使用已定义的函数
    generator.addFunction('rfid_uid_to_string', `String rfidUIDToString() {
  String uid = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) uid += "0";
    uid += String(rfid.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();
  return uid;
}`);
    
    const code = `(rfidUIDToString() == String(${uid}).toUpperCase())`;
    return [code, generator.ORDER_ATOMIC];
};
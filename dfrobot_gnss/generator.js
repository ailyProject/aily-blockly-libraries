/**
 * DFRobot GNSS北斗定位模块代码生成器
 * 支持I2C、硬串口、软串口三种初始化模式
 */

Arduino.forBlock['gnss_i2c_init'] = function(block, generator) {
  generator.addLibrary('DFRobot_GNSS', '#include "DFRobot_GNSS.h"');
  generator.addObject('gnssobject', 'DFRobot_GNSS_I2C gnss(&Wire, GNSS_DEVICE_ADDR);');
  
  var setupCode = '';
  setupCode += 'while(!gnss.begin()) {\n';
  setupCode += '  Serial.println("NO Devices!");\n';
  setupCode += '  delay(1000);\n';
  setupCode += '}\n';
  setupCode += 'gnss.enablePower();\n';
  setupCode += 'gnss.setGnss(eGPS_BeiDou_GLONASS);\n';
  setupCode += 'gnss.setRgbOn();\n';
  
  generator.addSetup('gnss_i2c_setup', setupCode);
  
  return '';
};

Arduino.forBlock['gnss_hs_init'] = function(block, generator) {
  var hs = block.getFieldValue('HS') || 'Serial1';
  var rx = block.getFieldValue('RX') || '0';
  var tx = block.getFieldValue('TX') || '1';
  
  generator.addLibrary('DFRobot_GNSS', '#include "DFRobot_GNSS.h"');
  generator.addObject('gnssobject', 'DFRobot_GNSS_UART gnss(&' + hs + ', 9600, ' + rx + ', ' + tx + ');');
  generator.addSetup('gnss_hs_setup', 'gnss.begin();\n');
  
  return '';
};

Arduino.forBlock['gnss_ss_init'] = function(block, generator) {
  var rx = block.getFieldValue('RX') || '0';
  var tx = block.getFieldValue('TX') || '1';
  
  generator.addLibrary('DFRobot_GNSS', '#include "DFRobot_GNSS.h"');
  generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
  generator.addObject('ssobject', 'SoftwareSerial mySerial(' + rx + ', ' + tx + ');');
  generator.addObject('gnssobject', 'DFRobot_GNSS_UART gnss(&mySerial, 9600);');
  generator.addSetup('gnss_ss_setup', 'gnss.begin();\n');
  
  return '';
};

Arduino.forBlock['gnss_read_data'] = function(block, generator) {
  var code = '';
  code += 'sTim_t utc = gnss.getUTC();\n';
  code += 'sTim_t date = gnss.getDate();\n';
  code += 'sLonLat_t lat = gnss.getLat();\n';
  code += 'sLonLat_t lon = gnss.getLon();\n';
  code += 'double high = gnss.getAlt();\n';
  code += 'uint8_t starUserd = gnss.getNumSatUsed();\n';
  code += 'double sog = gnss.getSog();\n';
  code += 'double cog = gnss.getCog();\n';
  
  return code;
};

Arduino.forBlock['gnss_get_utc_date'] = function(block, generator) {
  var dateType = block.getFieldValue('DATE') || 'YMD';
  
  var codeMap = {
    'YMD': '(String(date.year)+"/"+String(date.month)+"/"+String(date.date))',
    'YEAR': 'String(date.year)',
    'MONTH': 'String(date.month)',
    'DAY': 'String(date.date)'
  };
  
  var code = codeMap[dateType] || '""';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['gnss_get_utc_time'] = function(block, generator) {
  var timeType = block.getFieldValue('TIME') || 'HMS';
  
  var codeMap = {
    'HMS': '(String(utc.hour)+":"+String(utc.minute)+":"+String(utc.second))',
    'HOUR': 'String(utc.hour)',
    'MINUTE': 'String(utc.minute)',
    'SECOND': 'String(utc.second)'
  };
  
  var code = codeMap[timeType] || '""';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['gnss_get_location'] = function(block, generator) {
  var dataType = block.getFieldValue('DATA') || 'LAT';
  
  var codeMap = {
    'LAT': 'String(lat.latitudeDegree)',
    'LAT_DIR': 'String((char)lat.latDirection)',
    'LON': 'String(lon.lonitudeDegree)',
    'LON_DIR': 'String((char)lon.lonDirection)',
    'ALT': 'String(high)',
    'SAT_NUM': 'String(starUserd)',
    'SOG': 'String(sog)',
    'COG': 'String(cog)'
  };
  
  var code = codeMap[dataType] || '""';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

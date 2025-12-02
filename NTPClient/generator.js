'use strict';

// 确保WiFi库引用
function ensureWiFiLib(generator) {
  const boardConfig = window['boardConfig'];
  
  if (boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1) {
    generator.addLibrary('WiFi', '#include <WiFi.h>');
  } else if (boardConfig && boardConfig.core && boardConfig.core.indexOf('renesas_uno') > -1) {
    generator.addLibrary('WiFi', '#include <WiFiS3.h>');
  } else {
    generator.addLibrary('WiFi', '#include <WiFi.h>');
  }
}

// 确保WiFiUDP库引用
function ensureWiFiUDPLib(generator) {
  generator.addLibrary('WiFiUDP', '#include <WiFiUdp.h>');
}

// 确保NTPClient库引用
function ensureNTPClientLib(generator) {
  generator.addLibrary('NTPClient', '#include <NTPClient.h>');
}

// 获取变量名的工具函数
function getVariableName(block, fieldName, defaultName) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : defaultName;
}

// // 创建NTP客户端对象
// Arduino.forBlock['ntpclient_create'] = function(block, generator) {
//   // 设置变量重命名监听
//   if (!block._ntpVarMonitorAttached) {
//     block._ntpVarMonitorAttached = true;
//     block._ntpVarLastName = block.getFieldValue('VAR') || 'timeClient';
//     const varField = block.getField('VAR');
//     if (varField && typeof varField.setValidator === 'function') {
//       varField.setValidator(function(newName) {
//         const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
//         const oldName = block._ntpVarLastName;
//         if (workspace && newName && newName !== oldName) {
//           renameVariableInBlockly(block, oldName, newName, 'NTPClient');
//           block._ntpVarLastName = newName;
//         }
//         return newName;
//       });
//     }
//   }

//   const varName = block.getFieldValue('VAR') || 'timeClient';

//   // 添加必要的库
//   ensureWiFiLib(generator);
//   ensureWiFiUDPLib(generator);
//   ensureNTPClientLib(generator);

//   // 注册变量到Blockly系统
//   registerVariableToBlockly(varName, 'NTPClient');
  
//   // 添加WiFiUDP对象声明
//   generator.addObject('WiFiUDP ntpUDP', 'WiFiUDP ntpUDP;');
  
//   // 添加NTPClient对象声明
//   generator.addObject('NTPClient ' + varName, 'NTPClient ' + varName + '(ntpUDP);');

//   return varName + '.begin();\n';
// };

// 创建带参数的NTP客户端对象
Arduino.forBlock['ntpclient_create_with_params'] = function(block, generator) {
  // // 设置变量重命名监听
  // if (!block._ntpVarMonitorAttached) {
  //   block._ntpVarMonitorAttached = true;
  //   block._ntpVarLastName = block.getFieldValue('VAR') || 'timeClient';
  //   const varField = block.getField('VAR');
  //   if (varField && typeof varField.setValidator === 'function') {
  //     varField.setValidator(function(newName) {
  //       const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
  //       const oldName = block._ntpVarLastName;
  //       if (workspace && newName && newName !== oldName) {
  //         renameVariableInBlockly(block, oldName, newName, 'NTPClient');
  //         block._ntpVarLastName = newName;
  //       }
  //       return newName;
  //     });
  //   }
  // }

  // const varName = block.getFieldValue('VAR') || 'timeClient';
  const server = generator.valueToCode(block, 'SERVER', generator.ORDER_ATOMIC) || '"pool.ntp.org"';
  const offset = generator.valueToCode(block, 'OFFSET', generator.ORDER_ATOMIC) || '0';

  // 添加必要的库
  ensureWiFiLib(generator);
  ensureWiFiUDPLib(generator);
  ensureNTPClientLib(generator);

  // 注册变量到Blockly系统
  // registerVariableToBlockly(varName, 'NTPClient');
  
  // 添加WiFiUDP对象声明
  generator.addObject('ntpUDP', 'WiFiUDP ntpUDP;');
  
  // 添加NTPClient对象声明
  generator.addObject('timeClient', 'NTPClient timeClient(ntpUDP, ' + server + ', ' + offset + ');');

  return 'timeClient.begin();\n';
};

// // 启动NTP客户端
// Arduino.forBlock['ntpclient_begin'] = function(block, generator) {
//   const varName = getVariableName(block, 'VAR', 'timeClient');

//   // 添加必要的库
//   ensureWiFiLib(generator);
//   ensureWiFiUDPLib(generator);
//   ensureNTPClientLib(generator);

//   return varName + '.begin();\n';
// };

// 更新NTP时间
Arduino.forBlock['ntpclient_update'] = function(block, generator) {
  // const varName = getVariableName(block, 'VAR', 'timeClient');

  // 添加必要的库
  ensureWiFiLib(generator);
  ensureWiFiUDPLib(generator);
  ensureNTPClientLib(generator);

  generator.addObject('ntpUDP', 'WiFiUDP ntpUDP;');
  generator.addObject('timeClient', 'NTPClient timeClient(ntpUDP);');  

  return 'timeClient.update();\n';
};

// 强制更新NTP时间
Arduino.forBlock['ntpclient_force_update'] = function(block, generator) {
  // const varName = getVariableName(block, 'VAR', 'timeClient');

  // 添加必要的库
  ensureWiFiLib(generator);
  ensureWiFiUDPLib(generator);
  ensureNTPClientLib(generator);

  generator.addObject('ntpUDP', 'WiFiUDP ntpUDP;');
  generator.addObject('timeClient', 'NTPClient timeClient(ntpUDP);');  

  return 'timeClient.forceUpdate();\n';
};

// 获取格式化时间
Arduino.forBlock['ntpclient_get_formatted_time'] = function(block, generator) {
  // const varName = getVariableName(block, 'VAR', 'timeClient');

  // 添加必要的库
  ensureWiFiLib(generator);
  ensureWiFiUDPLib(generator);
  ensureNTPClientLib(generator);

  generator.addObject('ntpUDP', 'WiFiUDP ntpUDP;');
  generator.addObject('timeClient', 'NTPClient timeClient(ntpUDP);');  

  return ['timeClient.getFormattedTime()', generator.ORDER_FUNCTION_CALL];
};

// 获取Unix时间戳
Arduino.forBlock['ntpclient_get_epoch_time'] = function(block, generator) {
  // const varName = getVariableName(block, 'VAR', 'timeClient');

  // 添加必要的库
  ensureWiFiLib(generator);
  ensureWiFiUDPLib(generator);
  ensureNTPClientLib(generator);

  generator.addObject('ntpUDP', 'WiFiUDP ntpUDP;');
  generator.addObject('timeClient', 'NTPClient timeClient(ntpUDP);');  

  return ['timeClient.getEpochTime()', generator.ORDER_FUNCTION_CALL];
};

// 获取年份
Arduino.forBlock['ntpclient_get_year'] = function(block, generator) {
  // const varName = getVariableName(block, 'VAR', 'timeClient');

  // 添加必要的库
  ensureWiFiLib(generator);
  ensureWiFiUDPLib(generator);
  ensureNTPClientLib(generator);

  generator.addObject('ntpUDP', 'WiFiUDP ntpUDP;');
  generator.addObject('timeClient', 'NTPClient timeClient(ntpUDP);');

  return ['timeClient.getYear()', generator.ORDER_FUNCTION_CALL];
};

// 获取月份
Arduino.forBlock['ntpclient_get_month'] = function(block, generator) {
  // const varName = getVariableName(block, 'VAR', 'timeClient');
  
  // 添加必要的库
  ensureWiFiLib(generator);
  ensureWiFiUDPLib(generator);
  ensureNTPClientLib(generator);

  generator.addObject('ntpUDP', 'WiFiUDP ntpUDP;');
  generator.addObject('timeClient', 'NTPClient timeClient(ntpUDP);');

  return ['timeClient.getMonth()', generator.ORDER_FUNCTION_CALL];
}

// 获取一年中的第几天
Arduino.forBlock['ntpclient_get_yday'] = function(block, generator) {
  // const varName = getVariableName(block, 'VAR', 'timeClient');

  // 添加必要的库
  ensureWiFiLib(generator);
  ensureWiFiUDPLib(generator);
  ensureNTPClientLib(generator);

  generator.addObject('ntpUDP', 'WiFiUDP ntpUDP;');
  generator.addObject('timeClient', 'NTPClient timeClient(ntpUDP);');

  return ['timeClient.getYDay()', generator.ORDER_FUNCTION_CALL];
};

// 获取月份中的第几天
Arduino.forBlock['ntpclient_get_mday'] = function(block, generator) {
  // const varName = getVariableName(block, 'VAR', 'timeClient');

  // 添加必要的库
  ensureWiFiLib(generator);
  ensureWiFiUDPLib(generator);
  ensureNTPClientLib(generator);

  generator.addObject('ntpUDP', 'WiFiUDP ntpUDP;');
  generator.addObject('timeClient', 'NTPClient timeClient(ntpUDP);');

  return ['timeClient.getMDay()', generator.ORDER_FUNCTION_CALL];
};

// 获取小时
Arduino.forBlock['ntpclient_get_hours'] = function(block, generator) {
  // const varName = getVariableName(block, 'VAR', 'timeClient');

  // 添加必要的库
  ensureWiFiLib(generator);
  ensureWiFiUDPLib(generator);
  ensureNTPClientLib(generator);

  generator.addObject('ntpUDP', 'WiFiUDP ntpUDP;');
  generator.addObject('timeClient', 'NTPClient timeClient(ntpUDP);');  

  return ['timeClient.getHours()', generator.ORDER_FUNCTION_CALL];
};

// 获取分钟
Arduino.forBlock['ntpclient_get_minutes'] = function(block, generator) {
  // const varName = getVariableName(block, 'VAR', 'timeClient');

  // 添加必要的库
  ensureWiFiLib(generator);
  ensureWiFiUDPLib(generator);
  ensureNTPClientLib(generator);

  generator.addObject('ntpUDP', 'WiFiUDP ntpUDP;');
  generator.addObject('timeClient', 'NTPClient timeClient(ntpUDP);');  

  return ['timeClient.getMinutes()', generator.ORDER_FUNCTION_CALL];
};

// 获取秒
Arduino.forBlock['ntpclient_get_seconds'] = function(block, generator) {
  // const varName = getVariableName(block, 'VAR', 'timeClient');

  // 添加必要的库
  ensureWiFiLib(generator);
  ensureWiFiUDPLib(generator);
  ensureNTPClientLib(generator);

  generator.addObject('ntpUDP', 'WiFiUDP ntpUDP;');
  generator.addObject('timeClient', 'NTPClient timeClient(ntpUDP);');  

  return ['timeClient.getSeconds()', generator.ORDER_FUNCTION_CALL];
};

// 获取日期
Arduino.forBlock['ntpclient_get_day'] = function(block, generator) {
  // const varName = getVariableName(block, 'VAR', 'timeClient');

  // 添加必要的库
  ensureWiFiLib(generator);
  ensureWiFiUDPLib(generator);
  ensureNTPClientLib(generator);

  generator.addObject('ntpUDP', 'WiFiUDP ntpUDP;');
  generator.addObject('timeClient', 'NTPClient timeClient(ntpUDP);');  

  return ['timeClient.getDay()', generator.ORDER_FUNCTION_CALL];
};

// 检查时间是否已设置
Arduino.forBlock['ntpclient_is_time_set'] = function(block, generator) {
  // const varName = getVariableName(block, 'VAR', 'timeClient');

  // 添加必要的库
  ensureWiFiLib(generator);
  ensureWiFiUDPLib(generator);
  ensureNTPClientLib(generator);

  generator.addObject('ntpUDP', 'WiFiUDP ntpUDP;');
  generator.addObject('timeClient', 'NTPClient timeClient(ntpUDP);');  

  return ['timeClient.isTimeSet()', generator.ORDER_FUNCTION_CALL];
};

// 设置时区偏移
Arduino.forBlock['ntpclient_set_time_offset'] = function(block, generator) {
  // const varName = getVariableName(block, 'VAR', 'timeClient');
  const offset = generator.valueToCode(block, 'OFFSET', generator.ORDER_ATOMIC) || '0';

  // 添加必要的库
  ensureWiFiLib(generator);
  ensureWiFiUDPLib(generator);
  ensureNTPClientLib(generator);

  generator.addObject('ntpUDP', 'WiFiUDP ntpUDP;');
  generator.addObject('timeClient', 'NTPClient timeClient(ntpUDP);');  

  return 'timeClient.setTimeOffset(' + offset + ');\n';
};

// 设置更新间隔
Arduino.forBlock['ntpclient_set_update_interval'] = function(block, generator) {
  // const varName = getVariableName(block, 'VAR', 'timeClient');
  const interval = generator.valueToCode(block, 'INTERVAL', generator.ORDER_ATOMIC) || '60000';

  // 添加必要的库
  ensureWiFiLib(generator);
  ensureWiFiUDPLib(generator);
  ensureNTPClientLib(generator);

  generator.addObject('ntpUDP', 'WiFiUDP ntpUDP;');
  generator.addObject('timeClient', 'NTPClient timeClient(ntpUDP);');  

  return 'timeClient.setUpdateInterval(' + interval + ');\n';
};

// 设置NTP服务器
Arduino.forBlock['ntpclient_set_pool_server_name'] = function(block, generator) {
  // const varName = getVariableName(block, 'VAR', 'timeClient');
  const server = generator.valueToCode(block, 'SERVER', generator.ORDER_ATOMIC) || '"pool.ntp.org"';

  // 添加必要的库
  ensureWiFiLib(generator);
  ensureWiFiUDPLib(generator);
  ensureNTPClientLib(generator);

  generator.addObject('ntpUDP', 'WiFiUDP ntpUDP;');
  generator.addObject('timeClient', 'NTPClient timeClient(ntpUDP);');  

  return 'timeClient.setPoolServerName(' + server + ');\n';
};

// 停止NTP客户端
Arduino.forBlock['ntpclient_end'] = function(block, generator) {
  // const varName = getVariableName(block, 'VAR', 'timeClient');

  // 添加必要的库
  ensureWiFiLib(generator);
  ensureWiFiUDPLib(generator);
  ensureNTPClientLib(generator);

  generator.addObject('ntpUDP', 'WiFiUDP ntpUDP;');
  generator.addObject('timeClient', 'NTPClient timeClient(ntpUDP);');  

  return 'timeClient.end();\n';
};
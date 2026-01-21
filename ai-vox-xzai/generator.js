// ESP32 多线程任务 generator.js
// 检查并移除已存在的扩展注册
if (Blockly.Extensions.isRegistered('esp32ai_init_wifi_extension')) {
  Blockly.Extensions.unregister('esp32ai_init_wifi_extension');
}

if (Blockly.Extensions.isRegistered('aivox3_mcp_control_param_extension')) {
  Blockly.Extensions.unregister('aivox3_mcp_control_param_extension');
}

/*if (!window.addedFontMacros) {
  window.addedFontMacros = new Set(); // 小智字体
}*/

// 注册一个全局数组变量来存储MCP控制参数及对应的类型
// 使用条件声明避免重复声明错误
if (typeof window !== 'undefined') {
  if (!window.mcpControlParams) {
    window.mcpControlParams = [];
  }
  if (!window.aivoxControlServices) {
    window.aivoxControlServices = [];
  }
  // 新增：存储MCP服务和参数的关联关系
  if (!window.mcpServiceParamMap) {
    window.mcpServiceParamMap = [];
  }
} else {
  // Node.js环境下的处理
  if (typeof global !== 'undefined') {
    if (!global.mcpControlParams) {
      global.mcpControlParams = [];
    }
    if (!global.aivoxControlServices) {
      global.aivoxControlServices = [];
    }
    // 新增：存储MCP服务和参数的关联关系
    if (!global.mcpServiceParamMap) {
      global.mcpServiceParamMap = [];
    }
  }
}

// 直接使用全局变量，避免本地const声明
function getMcpControlParamsArray() {
  return (typeof window !== 'undefined') ? window.mcpControlParams : 
         (typeof global !== 'undefined') ? global.mcpControlParams : [];
}

function getAivoxControlServicesArray() {
  return (typeof window !== 'undefined') ? window.aivoxControlServices : 
         (typeof global !== 'undefined') ? global.aivoxControlServices : [];
}

// MCP控制参数管理 - 增删改查功能

// 增加 - 注册MCP控制参数
function registerMcpControlParam(paramName, paramType, minValue = null, maxValue = null) {
  // 检查参数是否已存在，如果存在则更新，避免重复注册
  const mcpControlParams = getMcpControlParamsArray();
  const existingIndex = mcpControlParams.findIndex(param => param.name === paramName);
  const paramData = { 
    name: paramName, 
    type: paramType,
    minValue: minValue,
    maxValue: maxValue,
    createdAt: new Date().toISOString()
  };
  
  if (existingIndex !== -1) {
    // 更新现有参数
    mcpControlParams[existingIndex] = { ...mcpControlParams[existingIndex], ...paramData };
  } else {
    // 添加新参数
    mcpControlParams.push(paramData);
  }
}

// 查询 - 获取MCP控制参数类型
function getMcpControlParamType(paramName) {
  const mcpControlParams = getMcpControlParamsArray();
  const param = mcpControlParams.find(param => param.name === paramName);
  return param ? param.type : null;
}

// 查询 - 获取完整的MCP控制参数信息
function getMcpControlParam(paramName) {
  const mcpControlParams = getMcpControlParamsArray();
  return mcpControlParams.find(param => param.name === paramName);
}

// 查询 - 获取所有MCP控制参数
function getAllMcpControlParams() {
  const mcpControlParams = getMcpControlParamsArray();
  return [...mcpControlParams]; // 返回副本，避免直接修改
}

// 查询 - 根据类型获取参数列表
function getMcpControlParamsByType(paramType) {
  const mcpControlParams = getMcpControlParamsArray();
  return mcpControlParams.filter(param => param.type === paramType);
}

// 修改 - 更新MCP控制参数
function updateMcpControlParam(paramName, updates) {
  const mcpControlParams = getMcpControlParamsArray();
  const index = mcpControlParams.findIndex(param => param.name === paramName);
  if (index !== -1) {
    mcpControlParams[index] = { 
      ...mcpControlParams[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    return true;
  }
  return false;
}

// 删除 - 删除MCP控制参数
function deleteMcpControlParam(paramName) {
  const mcpControlParams = getMcpControlParamsArray();
  const index = mcpControlParams.findIndex(param => param.name === paramName);
  if (index !== -1) {
    const deletedParam = mcpControlParams.splice(index, 1)[0];
    return deletedParam;
  }
  return null;
}

// 删除 - 清空所有MCP控制参数
function clearAllMcpControlParams() {
  const mcpControlParams = getMcpControlParamsArray();
  const count = mcpControlParams.length;
  mcpControlParams.length = 0;
  return count;
}

// 验证 - 检查参数名是否存在
function existsMcpControlParam(paramName) {
  const mcpControlParams = getMcpControlParamsArray();
  return mcpControlParams.some(param => param.name === paramName);
}

// 验证 - 验证参数类型是否有效
function validateParamType(paramType) {
  const validTypes = ['Boolean', 'Number', 'String'];
  return validTypes.includes(paramType);
}

// 验证 - 验证数值参数的范围
function validateNumberParam(minValue, maxValue) {
  if (minValue !== null && maxValue !== null) {
    return Number(minValue) <= Number(maxValue);
  }
  return true;
}

// AIVOX控制服务管理 - 增删改查功能

// 增加 - 注册AIVOX控制服务
function registerAivoxControlService(serviceName, description, params = []) {
  const aivoxControlServices = getAivoxControlServicesArray();
  const existingIndex = aivoxControlServices.findIndex(service => service.name === serviceName);
  const serviceData = {
    name: serviceName,
    description: description,
    params: params,
    createdAt: new Date().toISOString()
  };
  
  if (existingIndex !== -1) {
    // 更新现有服务
    aivoxControlServices[existingIndex] = { ...aivoxControlServices[existingIndex], ...serviceData };
  } else {
    // 添加新服务
    aivoxControlServices.push(serviceData);
  }
}

// 查询 - 获取AIVOX控制服务
function getAivoxControlService(serviceName) {
  const aivoxControlServices = getAivoxControlServicesArray();
  return aivoxControlServices.find(service => service.name === serviceName);
}

// 查询 - 获取所有AIVOX控制服务
function getAllAivoxControlServices() {
  const aivoxControlServices = getAivoxControlServicesArray();
  return [...aivoxControlServices];
}

// 修改 - 更新AIVOX控制服务
function updateAivoxControlService(serviceName, updates) {
  const aivoxControlServices = getAivoxControlServicesArray();
  const index = aivoxControlServices.findIndex(service => service.name === serviceName);
  if (index !== -1) {
    aivoxControlServices[index] = {
      ...aivoxControlServices[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return true;
  }
  return false;
}

// 删除 - 删除AIVOX控制服务
function deleteAivoxControlService(serviceName) {
  const aivoxControlServices = getAivoxControlServicesArray();
  const index = aivoxControlServices.findIndex(service => service.name === serviceName);
  if (index !== -1) {
    const deletedService = aivoxControlServices.splice(index, 1)[0];
    return deletedService;
  }
  return null;
}

// 删除 - 清空所有AIVOX控制服务
function clearAllAivoxControlServices() {
  const aivoxControlServices = getAivoxControlServicesArray();
  const count = aivoxControlServices.length;
  aivoxControlServices.length = 0;
  return count;
}

// 验证 - 检查服务名是否存在
function existsAivoxControlService(serviceName) {
  const aivoxControlServices = getAivoxControlServicesArray();
  return aivoxControlServices.some(service => service.name === serviceName);
}

// 调试和管理工具函数

// 调试 - 打印所有MCP控制参数
function debugPrintMcpParams() {
  const mcpControlParams = getMcpControlParamsArray();
  console.log('=== MCP Control Parameters ===');
  mcpControlParams.forEach((param, index) => {
    console.log(`${index + 1}. ${param.name} (${param.type})`, param);
  });
  console.log(`Total: ${mcpControlParams.length} parameters`);
}

// 调试 - 打印所有AIVOX控制服务
function debugPrintAivoxServices() {
  const aivoxControlServices = getAivoxControlServicesArray();
  console.log('=== AIVOX Control Services ===');
  aivoxControlServices.forEach((service, index) => {
    console.log(`${index + 1}. ${service.name}: ${service.description}`, service);
  });
  console.log(`Total: ${aivoxControlServices.length} services`);
}

// 调试 - 打印所有变量信息
function debugPrintAllVariables() {
  console.log('=== All Variable Information ===');
  debugPrintMcpParams();
  console.log('');
  debugPrintAivoxServices();
}

// 获取MCP服务和参数关联关系数组
function getMcpServiceParamMapArray() {
  return (typeof window !== 'undefined') ? window.mcpServiceParamMap : 
         (typeof global !== 'undefined') ? global.mcpServiceParamMap : [];
}

// 注册MCP服务和参数的关联关系
function registerMcpServiceParam(serviceName, paramName) {
  const mcpServiceParamMap = getMcpServiceParamMapArray();
  // 检查是否已存在该关联
  const existingIndex = mcpServiceParamMap.findIndex(item => 
    item.serviceName === serviceName && item.paramName === paramName
  );
  
  if (existingIndex === -1) {
    mcpServiceParamMap.push({
      serviceName: serviceName,
      paramName: paramName,
      createdAt: new Date().toISOString()
    });
  }
}

// 获取指定MCP服务的所有参数
function getMcpServiceParams(serviceName) {
  const mcpServiceParamMap = getMcpServiceParamMapArray();
  return mcpServiceParamMap.filter(item => item.serviceName === serviceName)
                          .map(item => item.paramName);
}

// 删除指定MCP服务的所有参数关联
function deleteMcpServiceParams(serviceName) {
  const mcpServiceParamMap = getMcpServiceParamMapArray();
  const initialLength = mcpServiceParamMap.length;
  for (let i = mcpServiceParamMap.length - 1; i >= 0; i--) {
    if (mcpServiceParamMap[i].serviceName === serviceName) {
      mcpServiceParamMap.splice(i, 1);
    }
  }
  return initialLength - mcpServiceParamMap.length;
}

// 清空所有MCP服务和参数关联关系
function clearAllMcpServiceParams() {
  const mcpServiceParamMap = getMcpServiceParamMapArray();
  const count = mcpServiceParamMap.length;
  mcpServiceParamMap.length = 0;
  return count;
}

// 管理 - 导出变量配置为JSON
function exportVariableConfig() {
  const mcpControlParams = getMcpControlParamsArray();
  const aivoxControlServices = getAivoxControlServicesArray();
  const mcpServiceParamMap = getMcpServiceParamMapArray();
  return {
    mcpControlParams: mcpControlParams,
    aivoxControlServices: aivoxControlServices,
    mcpServiceParamMap: mcpServiceParamMap,
    exportedAt: new Date().toISOString(),
    version: '1.0'
  };
}

// 管理 - 从JSON导入变量配置
function importVariableConfig(config) {
  try {
    if (config.mcpControlParams && Array.isArray(config.mcpControlParams)) {
      const mcpControlParams = getMcpControlParamsArray();
      mcpControlParams.length = 0;
      mcpControlParams.push(...config.mcpControlParams);
    }
    if (config.aivoxControlServices && Array.isArray(config.aivoxControlServices)) {
      const aivoxControlServices = getAivoxControlServicesArray();
      aivoxControlServices.length = 0;
      aivoxControlServices.push(...config.aivoxControlServices);
    }
    if (config.mcpServiceParamMap && Array.isArray(config.mcpServiceParamMap)) {
      const mcpServiceParamMap = getMcpServiceParamMapArray();
      mcpServiceParamMap.length = 0;
      mcpServiceParamMap.push(...config.mcpServiceParamMap);
    }
    console.log('Variable configuration imported successfully');
    return true;
  } catch (error) {
    console.error('Failed to import variable configuration:', error);
    return false;
  }
}

// 管理 - 重置所有变量配置
function resetAllVariableConfig() {
  const paramCount = clearAllMcpControlParams();
  const serviceCount = clearAllAivoxControlServices();
  const serviceParamCount = clearAllMcpServiceParams();
  console.log(`Reset complete: ${paramCount} parameters, ${serviceCount} services and ${serviceParamCount} service-param associations cleared`);
  return { paramCount, serviceCount, serviceParamCount };
}

// 调试 - 打印所有MCP服务和参数关联关系
function debugPrintMcpServiceParams() {
  const mcpServiceParamMap = getMcpServiceParamMapArray();
  console.log('=== MCP Service-Param Associations ===');
  mcpServiceParamMap.forEach((item, index) => {
    console.log(`${index + 1}. Service: ${item.serviceName}, Param: ${item.paramName}`);
  });
  console.log(`Total: ${mcpServiceParamMap.length} associations`);
}

// 调试 - 打印所有变量信息（更新）
function debugPrintAllVariables() {
  console.log('=== All Variable Information ===');
  debugPrintMcpParams();
  console.log('');
  debugPrintAivoxServices();
  console.log('');
  debugPrintMcpServiceParams();
}

// 将调试函数暴露到全局，便于在控制台中使用
if (typeof window !== 'undefined') {
  window.debugPrintMcpParams = debugPrintMcpParams;
  window.debugPrintAivoxServices = debugPrintAivoxServices;
  window.debugPrintMcpServiceParams = debugPrintMcpServiceParams;
  window.debugPrintAllVariables = debugPrintAllVariables;
  window.exportVariableConfig = exportVariableConfig;
  window.importVariableConfig = importVariableConfig;
  window.resetAllVariableConfig = resetAllVariableConfig;
}

Blockly.Extensions.register('esp32ai_init_wifi_extension', function () {
// 直接在扩展中添加updateShape_函数
  this.updateShape_ = function (configType) {
    if (this.getInput('SSID')) {
      this.removeInput('SSID');
    }
    if (this.getInput('PSWD')) {
      this.removeInput('PSWD');
    }

    // 如果是手动配网，添加密钥和WiFi配置字段
    if (configType == 'Manual') {
      // 添加WiFi配置输入
      this.appendValueInput('SSID')
        .setCheck('String')
        .appendField("WiFi名称");

      this.appendValueInput('PSWD')
        .setCheck('String')
        .appendField("WiFi密码");
      
      // 延迟创建默认块，避免重复创建
      setTimeout(() => {
        this.createDefaultBlocks_();
      }, 100);
    }
  };

  // 创建默认字符串块的方法
  this.createDefaultBlocks_ = function() {
    // 检查workspace是否存在且已渲染
    if (!this.workspace || !this.workspace.rendered) {
      return;
    }

    // 为SSID输入添加默认的字符串块
    const ssidInput = this.getInput('SSID');
    if (ssidInput && !ssidInput.connection.targetConnection) {
      try {
        var ssidBlock = this.workspace.newBlock('text');
        ssidBlock.setFieldValue('nulllab', 'TEXT');
        ssidBlock.initSvg();
        ssidBlock.render();
        ssidInput.connection.connect(ssidBlock.outputConnection);
      } catch (e) {
        console.warn('Failed to create SSID default block:', e);
      }
    }

    // 为PSWD输入添加默认的字符串块
    const pswdInput = this.getInput('PSWD');
    if (pswdInput && !pswdInput.connection.targetConnection) {
      try {
        var pswdBlock = this.workspace.newBlock('text');
        pswdBlock.setFieldValue('nulllab', 'TEXT');
        pswdBlock.initSvg();
        pswdBlock.render();
        pswdInput.connection.connect(pswdBlock.outputConnection);
      } catch (e) {
        console.warn('Failed to create PSWD default block:', e);
      }
    }
  };

  // 监听MODE字段的变化
  this.getField('MODE').setValidator(function(option) {
    this.getSourceBlock().updateShape_(option);
    return option;
  });
  // 安全获取字段值
  const modeField = this.getField('MODE');
  if (modeField) {
    this.updateShape_(modeField.getValue());
  }
});

Blockly.Extensions.register('aivox3_mcp_control_param_extension', function () {
    // 直接在扩展中添加updateShape_函数
  this.updateShape_ = function (configType) {
    if (this.getInput('MIN')) {
      this.removeInput('MIN');
    }
    if (this.getInput('MAX')) {
      this.removeInput('MAX');
    }

    if (configType === 'Number') {
      this.appendValueInput('MIN')
        .setCheck('Number')
        .appendField("最小值");

      this.appendValueInput('MAX')
        .setCheck('Number')
        .appendField("最大值");

      setTimeout(() => {
        this.createDefaultBlocks_();
      }, 100);
    }
  };

    // 创建默认数字块的方法
  this.createDefaultBlocks_ = function() {
    // 检查workspace是否存在且已渲染
    if (!this.workspace || !this.workspace.rendered) {
      return;
    }

    // 为MIN输入添加默认的数字块
    const minInput = this.getInput('MIN');
    if (minInput && !minInput.connection.targetConnection) {
      try {
        var minBlock = this.workspace.newBlock('math_number');
        minBlock.setFieldValue(0, 'NUM');
        minBlock.initSvg();
        minBlock.render();
        minInput.connection.connect(minBlock.outputConnection);
      } catch (e) {
        console.warn('Failed to create MIN default block:', e);
      }
    }

    // 为MAX输入添加默认的数字块
    const maxInput = this.getInput('MAX');
    if (maxInput && !maxInput.connection.targetConnection) {
      try {
        var maxBlock = this.workspace.newBlock('math_number');
        maxBlock.setFieldValue(100, 'NUM');
        maxBlock.initSvg();
        maxBlock.render();
        maxInput.connection.connect(maxBlock.outputConnection);
      } catch (e) {
        console.warn('Failed to create MAX default block:', e);
      }
    }
  };

  // 监听TYPE字段的变化
  this.getField('TYPE').setValidator(function(option) {
    this.getSourceBlock().updateShape_(option);
    return option;
  });
  // 安全获取字段值
  const typeField = this.getField('TYPE');
  if (typeField) {
    this.updateShape_(typeField.getValue());
  }
});

// 存储任务函数避免重复定义
if (!Arduino.esp32Tasks) {
    Arduino.esp32Tasks = new Map(); // key: taskId_blockId, value: 函数名
    Arduino.esp32LoopDelayAdded = false; // 标记loop延时是否已添加
}

// 生成唯一任务函数名
Arduino.getTaskFuncName = function(taskId, blockId) {
    const key = `${taskId}_${blockId}`;
    if (!Arduino.esp32Tasks.has(key)) {
        const funcName = `esp32_task_${taskId}`; // 简化函数名，仅保留任务编号
        Arduino.esp32Tasks.set(key, funcName);
    }
    return Arduino.esp32Tasks.get(key);
};

Arduino.forBlock['esp32_task'] = function(block, generator) {
    // 1. 获取 TASK 字段值（任务编号）和 CORE 字段值（核心编号）
    const taskId = block.getFieldValue('TASK'); // 从下拉框获取，如 "1"
    const coreId = block.getFieldValue('CORE') || "0"; // 默认为核心0
    var interval = generator.valueToCode(block, 'INTERVAL', generator.ORDER_ATOMIC) || '4096';

    // 2. 获取用户在块中定义的任务内容（回调语句）
    const taskContent = generator.statementToCode(block, 'CALLBACK') || "";
    const cstaskContent = generator.statementToCode(block, 'csCALLBACK') || "";

    // 3. 生成唯一的任务函数名
    const taskFuncName = Arduino.getTaskFuncName(taskId, block.id);

    // 4. 定义 FreeRTOS 任务函数（使用标准参数名pvParameters）
    const taskFuncCode = `
void ${taskFuncName}(void *pvParameters) {
  for (;;) {
    ${taskContent}
    vTaskDelay(1);
  }
}`;
    generator.addFunction(taskFuncName, taskFuncCode); // 添加到函数区

    // 5. 生成任务创建代码（绑定到指定核心，不使用任务句柄）
    const createTaskCode = `${cstaskContent}\n
  xTaskCreatePinnedToCore(${taskFuncName},"esp32_task_${taskId}",${interval},NULL,2,NULL,${coreId});`;

    // 将任务创建代码添加到setup开始部分
    generator.addSetupBegin(`esp32_task_${taskId}_create`, createTaskCode);

    // 6. 向loop函数添加延时（确保只添加一次）
    generator.addLoopEnd('esp32_loop_delay', 'vTaskDelay(1);');

    return ""; // 无需返回代码，已通过add方法添加
};

Arduino.forBlock['esp32_serial_init'] = function(block, generator) {
    // 1. 获取块中配置的参数值
    const serialPort = block.getFieldValue('SERIAL_PORT'); // 串口名称(Serial/Serial1/Serial2)
    const rxPin = block.getFieldValue('RX_PIN')         // RX引脚
    const txPin = block.getFieldValue('TX_PIN');         // TX引脚
    const baudrate = block.getFieldValue('BAUDRATE');      // 波特率

    generator.addLibrary('HardwareSerial', '#include <HardwareSerial.h>');

    // 2. 生成串口初始化代码（ESP32串口初始化语法处理）
    let initCode = '';
    initCode = `${serialPort}.begin(${baudrate}, SERIAL_8N1, ${rxPin}, ${txPin});`;

    // 3. 避免重复初始化同一串口（使用tag标识唯一性）
    const initTag = `esp32_serial_${serialPort.toLowerCase()}_init`;
    generator.addSetupBegin(initTag, initCode);

    return ''; // 无需返回代码，已通过addSetupBegin添加到setup函数
};

//全局参数
var display_mode = '';
var display_role = '';
var aivox3_screen_light = 255; 
var display_type = 'NONE';
var es8311mr = 'false';
var es8388pd = 'false';

Arduino.forBlock['esp32ai_init_wifi'] = function (block, generator) {
    generator.addLibrary('include_aivox_engine', '#include "ai_vox_engine.h"');
    let configOption = block.getFieldValue('MODE');
    let code = ``;
    generator.addObject('esp32ai_kSmartConfigType', `constexpr smartconfig_type_t kSmartConfigType = SC_TYPE_ESPTOUCH;`, true);
    if(configOption == 'Manual') {
        
        let wifi_ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
        let wifi_pwd = generator.valueToCode(block, 'PSWD', generator.ORDER_ATOMIC) || '""';
        generator.addVariable('esp32ai_wifi_ssid_define', `#define WIFI_SSID ${wifi_ssid}`);
        generator.addVariable('esp32ai_wifi_pwd_define', `#define WIFI_PASSWORD ${wifi_pwd}`);
        // wifi_configurator->Start(WIFI_SSID, WIFI_PASSWORD);
        //code = `  auto wifi_configurator = std::make_unique<WifiConfigurator>(WiFi, kSmartConfigType);\n  wifi_configurator->Start(WIFI_SSID, WIFI_PASSWORD);\n`;
        //generator.addSetup(`aivox_wifi_configurator`, code, true);

    } else{
        generator.addObject('esp32ai_kSmartConfigType', `smartconfig_type_t kSmartConfigType = ${configOption};`, true);
        //code = `  auto wifi_configurator = std::make_unique<WifiConfigurator>(WiFi, kSmartConfigType);\n  wifi_configurator->Start();\n`;
        //generator.addSetup(`esp32ai_wifi_configurator`, code, true);

    }
    generator.addLibrary('esp32aiwifi_init', 
        `#include <WiFi.h>
#include "components/wifi_configurator/wifi_configurator.h"
#include "components/espressif/esp_audio_codec/esp_audio_simple_dec.h"
#include "components/espressif/esp_audio_codec/esp_mp3_dec.h"
#include "kljxgwj/mp3/network_config_mode_mp3.h"
#include "kljxgwj/mp3/network_connected_mp3.h"
#include "kljxgwj/mp3/notification_0_mp3.h"`);
    return '';
};

Arduino.forBlock['esp32ai_button_setup'] = function(block, generator) {
  // 提取引脚（假设下拉框返回的是纯数字，如"5"，需要拼接为GPIO_NUM_5）
  const pinNum = block.getFieldValue('PIN'); // 如"5"
  const pin = `GPIO_NUM_${pinNum}`; // 关键：转换为GPIO_NUM_x格式
  const pinMode = block.getFieldValue('PIN_MODE');
  const activeLow = block.getFieldValue('ACTIVE_LOW') === 'TRUE';

  const disablePull = pinMode === 'INPUT_PULLUP' ? 'false' : 'true';

  // 1. 补充必要的头文件（必须包含button_gpio.h）
  generator.addLibrary('include_aivox_engine', '#include "ai_vox_engine.h"');
  generator.addLibrary('driver_gpio_lib', '#include "driver/gpio.h"');
  generator.addLibrary('iot_button_lib', '#include "components/espressif/button/iot_button.h"');
  generator.addLibrary('button_gpio_lib', '#include "components/espressif/button/button_gpio.h"'); // 新增：包含button_gpio.h

  // 2. 定义引脚常量（正确格式：GPIO_NUM_x）
  const kButtonBootCode = `constexpr gpio_num_t kButtonBoot = ${pin};\n`; // 如GPIO_NUM_5
  generator.addVariable('kButtonBoot_def', kButtonBootCode);

  // 3. 定义按钮句柄
  const handleCode = `button_handle_t g_button_boot_handle = nullptr;`;
  generator.addFunction('g_button_boot_handle_def', handleCode);

  // 4. 生成初始化代码（正确使用button_gpio_config_t）
  const initCode = `  const button_config_t ai_btn_cfg = {
    .long_press_time = 1000,
    .short_press_time = 50,
  };
  const button_gpio_config_t ai_btn_gpio_cfg = { // 现在能识别该结构体
    .gpio_num = kButtonBoot,
    .active_level = ${activeLow ? 0 : 1},
    .enable_power_save = false,
    .disable_pull = ${disablePull},
  };
  // 创建设备函数现在能识别
  ESP_ERROR_CHECK(iot_button_new_gpio_device(&ai_btn_cfg, &ai_btn_gpio_cfg, &g_button_boot_handle));`;

  generator.addSetup('ai_trigger_button_init', initCode);
  return '';
};

// 按钮单击事件
Arduino.forBlock['esp32ai_button_click'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER');
  const cbName = 'g_button_single_click_cb'; // 明确单击回调名

  // 1. 生成符合原型的回调函数（参数必须为button_handle和usr_data）
  generator.addFunction(cbName, `static void ${cbName}(void *button_handle, void *usr_data) {
    (void)button_handle;  // 忽略未使用的按钮句柄参数
    (void)usr_data;       // 忽略未使用的用户数据参数
    ${handlerCode}        // 用户定义的单击逻辑
}`);

  // 2. 注册事件（使用正确的事件类型和参数顺序）
  const registerCode = `  ESP_ERROR_CHECK(iot_button_register_cb(
    g_button_boot_handle,    // 1. 按钮句柄
    BUTTON_SINGLE_CLICK,     // 2. 单击事件（官方枚举值）
    NULL,                    // 3. 无事件参数（传NULL）
    ${cbName},               // 4. 回调函数
    NULL                     // 5. 无用户数据（传NULL）
  ));`;

  generator.addSetupEnd('ai_trigger_button_click_reg', registerCode);
  return '';
};

// 按钮双击事件
Arduino.forBlock['esp32ai_button_double_click'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER');
  const cbName = 'g_button_double_click_cb';

  // 1. 回调函数（符合官方原型）
  generator.addFunction(cbName, `static void ${cbName}(void *button_handle, void *usr_data) {
    (void)button_handle;
    (void)usr_data;
    ${handlerCode}
  }`);

  // 2. 注册事件（双击事件类型为BUTTON_DOUBLE_CLICK）
  const registerCode = `ESP_ERROR_CHECK(iot_button_register_cb(
    g_button_boot_handle,
    BUTTON_DOUBLE_CLICK,  // 官方双击事件枚举值
    NULL,
    ${cbName},
    NULL
  ));`;

  generator.addSetup('ai_trigger_button_double_click_reg', registerCode);
  return '';
};

// 按钮长按中事件
Arduino.forBlock['esp32ai_button_long_pressing'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER');
  const cbName = 'g_button_long_press_hold_cb'; // 对应长按中事件

  // 1. 回调函数（符合官方原型）
  generator.addFunction(cbName, `static void ${cbName}(void *button_handle, void *usr_data) {
    (void)button_handle;
    (void)usr_data;
    ${handlerCode}  // 注意：此事件会持续触发，避免阻塞操作
  }`);

  // 2. 注册事件（长按中事件类型为BUTTON_LONG_PRESS_HOLD）
  const registerCode = `ESP_ERROR_CHECK(iot_button_register_cb(
    g_button_boot_handle,
    BUTTON_LONG_PRESS_HOLD,  // 官方长按中事件枚举值
    NULL,
    ${cbName},
    NULL
  ));`;

  generator.addSetup('ai_trigger_button_long_press_hold_reg', registerCode);
  return '';
};

// esp32ai_selget_mcp_control 块的mutator和extension
if (Blockly.Extensions.isRegistered('esp32ai_selget_mcp_control_mutator')) {
    Blockly.Extensions.unregister('esp32ai_selget_mcp_control_mutator');
}
if (Blockly.Extensions.isRegistered('esp32ai_selget_mcp_control_extension')) {
    Blockly.Extensions.unregister('esp32ai_selget_mcp_control_extension');
}

Blockly.Extensions.registerMutator('esp32ai_selget_mcp_control_mutator', {
  saveExtraState: function() {
    return { 'mode': this.mode_ || 'regular' };
  },
  loadExtraState: function(state) {
    this.mode_ = state['mode'] || 'regular';
    this.updateShape_();
  }
}, function() {
  // 这是helper函数，在块初始化时调用
  this.mode_ = 'regular';

  this.updateShape_ = function(mode) {
    if (mode !== undefined) {
      this.mode_ = mode;
    }
    const hasSetInput = this.getInput('setCODE_BLOCK');
    const hasReportInput = this.getInput('CODE_BLOCK');

    if (this.mode_ === 'set_only') {
      if (!hasSetInput) {
        this.appendStatementInput('setCODE_BLOCK').appendField('设置');
      }
      if (hasReportInput) {
        this.removeInput('CODE_BLOCK');
      }
    } else if (this.mode_ === 'report_only') {
      if (hasSetInput) {
        this.removeInput('setCODE_BLOCK');
      }
      if (!hasReportInput) {
        this.appendStatementInput('CODE_BLOCK').appendField('上报');
      }
    } else {
      if (!hasSetInput) {
        this.appendStatementInput('setCODE_BLOCK').appendField('设置');
      }
      if (!hasReportInput) {
        this.appendStatementInput('CODE_BLOCK').appendField('上报');
      }
    }
  };

  this.updateShape_();
});

Blockly.Extensions.register('esp32ai_selget_mcp_control_extension', function() {
  const block = this;

  const updateBlockDisplay = function() {
    const varField = block.getField('VAR');
    if (!varField) return;
    const varName = varField.getText();
    const mode = findMcpServiceMode(block.workspace, varName);
    if (block.mode_ !== mode) {
      block.updateShape_(mode);
    }
  };

  setTimeout(updateBlockDisplay, 100);

  const changeListener = function(event) {
    if (!block.workspace) return;
    if (event.type === Blockly.Events.BLOCK_CHANGE ||
        event.type === Blockly.Events.VAR_RENAME ||
        event.type === Blockly.Events.BLOCK_CREATE ||
        event.type === Blockly.Events.BLOCK_DELETE) {
      updateBlockDisplay();
    }
  };
  block.workspace.addChangeListener(changeListener);
});

function findMcpServiceMode(workspace, varName) {
  if (!workspace) return 'regular';
  const allBlocks = workspace.getAllBlocks(false);
  for (let i = 0; i < allBlocks.length; i++) {
    const block = allBlocks[i];
    if (block.type === 'aivox_mcp_register_control_command') {
      const nameInput = block.getInputTargetBlock('NAME');
      if (nameInput && nameInput.type === 'aivox_mcp_control') {
        const nameField = nameInput.getField('VAR');
        if (nameField && nameField.getText() === varName) {
          return block.getFieldValue('MODE') || 'regular';
        }
      }
    }
  }
  return 'regular';
}

//ES8311加入
if (Blockly.Extensions.isRegistered('aivox3_init_es8311_extension')) {
  Blockly.Extensions.unregister('aivox3_init_es8311_extension');
}
Blockly.Extensions.register('aivox3_init_es8311_extension', function () {
    // 直接在扩展中添加updateShape_函数
  this.updateShape_ = function (boardType) {
    console.log('Updating ES8311 block shape for board type:', boardType);
    // if(boardType.indexOf('aivox') > -1) {
        let pins = window['boardConfig'].digitalPins;
        this.appendDummyInput('')
        .appendField("初始化ES8311音频编解码器 SDA引脚")
        
        .appendField(new Blockly.FieldDropdown(pins), "ES8311_SDA")
        this.appendDummyInput('')
        .appendField("SCL引脚")
        .appendField(new Blockly.FieldDropdown(pins), "ES8311_SCL")
        this.appendDummyInput('')
        .appendField("MCLK引脚")
        .appendField(new Blockly.FieldDropdown(pins), "ES8311_MCLK")   
        this.appendDummyInput('')
        .appendField("SCLK引脚")
        .appendField(new Blockly.FieldDropdown(pins), "ES8311_SCLK")
        this.appendDummyInput('')
        .appendField("LRCK引脚")
        .appendField(new Blockly.FieldDropdown(pins), "ES8311_LRCK")
        this.appendDummyInput('')
        .appendField("数据输入引脚")
        .appendField(new Blockly.FieldDropdown(pins), "ES8311_DSDIN") 
        this.appendDummyInput('')
        .appendField("数据输出引脚")
        .appendField(new Blockly.FieldDropdown(pins), "ES8311_DSDOUT") 
        this.appendValueInput('ES8311_I2C_ADDRESS')
        .setCheck('Number')
        .appendField("ES8311 I2C地址");
        this.appendValueInput('ES8311_RATE')
        .setCheck('Number')
        .appendField("采样率");
        this.appendDummyInput('')
        .appendField("IIC端口号")
        .appendField(new Blockly.FieldDropdown([["0","I2C_NUM_0"],["1","I2C_NUM_1"]]), "ES8311_IIC_PORT");
    // }
    // 延迟创建默认块，避免重复创建
    setTimeout(() => {
        this.createDefaultBlocks_();
    }, 100);
  };

    // 创建默认字符串块的方法
    this.createDefaultBlocks_ = function() {
        // 检查workspace是否存在且已渲染    
        if (!this.workspace || !this.workspace.rendered) {
            return;
        }
        // 设置默认引脚值
        const setDefaultPin = (fieldName, defaultValue) => {
            const field = this.getField(fieldName);
            if (field) {
                const options = field.getOptions();
                if (options.some(option => option[1] === defaultValue)) {
                    field.setValue(defaultValue);
                }
            }
        };

        setDefaultPin('ES8311_SDA', '41');  // SDA引脚默认值
        setDefaultPin('ES8311_SCL', '42');  // SCL引脚默认值
        setDefaultPin('ES8311_MCLK', '46'); // MCLK引脚默认值
        setDefaultPin('ES8311_SCLK', '39'); // SCLK引脚默认值
        setDefaultPin('ES8311_LRCK', '2');  // LRCK引脚默认值
        setDefaultPin('ES8311_DSDIN', '38'); // 数据输入引脚默认值
        setDefaultPin('ES8311_DSDOUT', '40'); // 数据输出引脚默认值
        setDefaultPin('ES8311_IIC_PORT', 'I2C_NUM_1'); // IIC端口号默认值

        const es8311_i2c_address = this.getInput('ES8311_I2C_ADDRESS');
        if (es8311_i2c_address && !es8311_i2c_address.connection.targetConnection) {
        try {
            var i2cAddressBlock = this.workspace.newBlock('math_number');
            i2cAddressBlock.setFieldValue(0x30, 'NUM');
            i2cAddressBlock.initSvg();
            i2cAddressBlock.render();
            es8311_i2c_address.connection.connect(i2cAddressBlock.outputConnection);
        } catch (e) {
            console.warn('Failed to create ES8311 I2C ADDRESS default block:', e);
            }
        }
        const es8311_rate = this.getInput('ES8311_RATE');
        if (es8311_rate && !es8311_rate.connection.targetConnection) {
        try {
            var es8311RateBlock = this.workspace.newBlock('math_number');
            es8311RateBlock.setFieldValue(16000, 'NUM');
            es8311RateBlock.initSvg();
            es8311RateBlock.render();
            es8311_rate.connection.connect(es8311RateBlock.outputConnection);
        } catch (e) {
            console.warn('Failed to create es8311 sample rate default block:', e);
            }
        }
    };
  this.updateShape_(window['boardConfig'].name);
});
Arduino.forBlock['aivox3_init_es8311'] = function(block, generator) {
    es8311mr = 'true';
    es8388pd = 'false';
    const es8311_mclk = block.getFieldValue('ES8311_MCLK');
    const es8311_sclk = block.getFieldValue('ES8311_SCLK');
    const es8311_lrck = block.getFieldValue('ES8311_LRCK');
    const es8311_dsdin = block.getFieldValue('ES8311_DSDIN');
    const es8311_dsdout = block.getFieldValue('ES8311_DSDOUT');
    const es8311_scl = block.getFieldValue('ES8311_SCL');
    const es8311_sda = block.getFieldValue('ES8311_SDA');
// #include <driver/i2c_master.h>\n#include <esp_lcd_panel_io.h>\n#include <esp_lcd_panel_ops.h>\n#include <esp_lcd_panel_vendor.h>\n

    const es8311_i2c_address = generator.valueToCode(block, 'ES8311_I2C_ADDRESS', generator.ORDER_ATOMIC) || '""';
    const es8311_rate = generator.valueToCode(block, 'ES8311_RATE', generator.ORDER_ATOMIC) || '""';
    const es8311_iic_port = block.getFieldValue('ES8311_IIC_PORT') || 'I2C_NUM_1';
    generator.addLibrary('inclue_aivox3_engine', '#include "ai_vox_engine.h"\n');
    generator.addLibrary('include_i2c_master', '#include <driver/i2c_master.h>\n');
    generator.addLibrary('aivox3_es8311_library', '#include "components/espressif/esp_audio_codec/esp_audio_simple_dec.h"\n#include "audio_device/audio_device_es8311.h"\n');

    generator.addVariable('esp32ai_rate',`int esp32ai_rate=${es8311_rate};\n`,true);

    generator.addObject('aivox3_audio_device_es8311', 'i2c_master_bus_handle_t g_i2c_master_bus_handle = nullptr;\nstd::shared_ptr<ai_vox::AudioDeviceEs8311> g_audio_output_device;', true);
    generator.addObject('aivox3_audio_device_es8311_input', 'std::shared_ptr<ai_vox::AudioDeviceEs8311> g_audio_input_device;', true);

    generator.addObject('aivox3_initI2C', `void InitI2cBus() {
    const i2c_master_bus_config_t i2c_master_bus_config = {
        .i2c_port = ${es8311_iic_port},
        .sda_io_num = GPIO_NUM_${es8311_sda},
        .scl_io_num = GPIO_NUM_${es8311_scl},
        .clk_source = I2C_CLK_SRC_DEFAULT,
        .glitch_ignore_cnt = 7,
        .intr_priority = 0,
        .trans_queue_depth = 0,
        .flags =
            {
                .enable_internal_pullup = 1,
                .allow_pd = 0,
            },
        };
        ESP_ERROR_CHECK(i2c_new_master_bus(&i2c_master_bus_config, &g_i2c_master_bus_handle));
    }`, true);
    generator.addSetup("aivox3_setup_init_i2c_bus", `    InitI2cBus();\n`);
    generator.addSetup("aivox3_setup_es8311", `  g_audio_output_device = std::make_shared<ai_vox::AudioDeviceEs8311>(g_i2c_master_bus_handle, ${es8311_i2c_address}, ${es8311_iic_port}, ${es8311_rate}, GPIO_NUM_${es8311_mclk}, GPIO_NUM_${es8311_sclk}, GPIO_NUM_${es8311_lrck}, GPIO_NUM_${es8311_dsdout}, GPIO_NUM_${es8311_dsdin});`);
    
    return '';
}

//es8388接入
if (Blockly.Extensions.isRegistered('esp32ai_init_es8388_extension')) {
  Blockly.Extensions.unregister('esp32ai_init_es8388_extension');
}
Blockly.Extensions.register('esp32ai_init_es8388_extension', function () {
    // 直接在扩展中添加updateShape_函数
  this.updateShape_ = function (boardType) {
        let pins = window['boardConfig'].digitalPins;
        this.appendDummyInput('')
        .appendField("初始化ES8388音频编解码器 SDA引脚")
        
        .appendField(new Blockly.FieldDropdown(pins), "ES8388_SDA")
        this.appendDummyInput('')
        .appendField("SCL引脚")
        .appendField(new Blockly.FieldDropdown(pins), "ES8388_SCL")
        this.appendDummyInput('')
        .appendField("MCLK引脚")
        .appendField(new Blockly.FieldDropdown(pins), "ES8388_MCLK")   
        this.appendDummyInput('')
        .appendField("SCLK引脚")
        .appendField(new Blockly.FieldDropdown(pins), "ES8388_SCLK")
        this.appendDummyInput('')
        .appendField("LRCK引脚")
        .appendField(new Blockly.FieldDropdown(pins), "ES8388_LRCK")
        this.appendDummyInput('')
        .appendField("数据输入引脚")
        .appendField(new Blockly.FieldDropdown(pins), "ES8388_DSDIN") 
        this.appendDummyInput('')
        .appendField("数据输出引脚")
        .appendField(new Blockly.FieldDropdown(pins), "ES8388_DSDOUT") 
        this.appendValueInput('ES8388_I2C_ADDRESS')
        .setCheck('Number')
        .appendField("ES8388 I2C地址");
        this.appendValueInput('ES8388_RATE')
        .setCheck('Number')
        .appendField("采样率")
        this.appendDummyInput('')
        .appendField("I2C端口号")
        .appendField(new Blockly.FieldDropdown([["0","I2C_NUM_0"],["1","I2C_NUM_1"]]), "ES8388_IIC_PORT");

    // 延迟创建默认块，避免重复创建
    setTimeout(() => {
        this.createDefaultBlocks_();
    }, 100);
  };

    // 创建默认字符串块的方法
    this.createDefaultBlocks_ = function() {
        // 检查workspace是否存在且已渲染    
        if (!this.workspace || !this.workspace.rendered) {
            return;
        }
        // 设置默认引脚值
        // const setDefaultPin = (fieldName, defaultValue) => {
        //     const field = this.getField(fieldName);
        //     if (field) {
        //         const options = field.getOptions();
        //         if (options.some(option => option[1] === defaultValue)) {
        //             field.setValue(defaultValue);
        //         }
        //     }
        // };

        // setDefaultPin('ES8388_SDA', '41');  // SDA引脚默认值
        // setDefaultPin('ES8388_SCL', '42');  // SCL引脚默认值
        // setDefaultPin('ES8388_MCLK', '46'); // MCLK引脚默认值
        // setDefaultPin('ES8388_SCLK', '39'); // SCLK引脚默认值
        // setDefaultPin('ES8388_LRCK', '2');  // LRCK引脚默认值
        // setDefaultPin('ES8388_DSDIN', '38'); // 数据输入引脚默认值
        // setDefaultPin('ES8388_DSDOUT', '40'); // 数据输出引脚默认值
        // setDefaultPin('ES8388_IIC_PORT', 'I2C_NUM_1'); // IIC端口号默认值

        const es8388_i2c_address = this.getInput('ES8388_I2C_ADDRESS');
        if (es8388_i2c_address && !es8388_i2c_address.connection.targetConnection) {
        try {
            var i2cAddressBlock = this.workspace.newBlock('math_number');
            i2cAddressBlock.setFieldValue(0x10, 'NUM');
            i2cAddressBlock.initSvg();
            i2cAddressBlock.render();
            es8388_i2c_address.connection.connect(i2cAddressBlock.outputConnection);
        } catch (e) {
            console.warn('Failed to create ES8388 I2C ADDRESS default block:', e);
            }
        }
        const es8388_rate = this.getInput('ES8388_RATE');
        if (es8388_rate && !es8388_rate.connection.targetConnection) {
        try {
            var es8388RateBlock = this.workspace.newBlock('math_number');
            es8388RateBlock.setFieldValue(44100, 'NUM');
            es8388RateBlock.initSvg();
            es8388RateBlock.render();
            es8388_rate.connection.connect(es8388RateBlock.outputConnection);
        } catch (e) {
            console.warn('Failed to create es8388 sample rate default block:', e);
            }
        }
    };
  this.updateShape_(window['boardConfig'].name);
});
Arduino.forBlock['esp32ai_init_es8388'] = function(block, generator) {
    es8311mr = 'false';
    es8388pd = 'true';
    const es8388_mclk = block.getFieldValue('ES8388_MCLK');
    const es8388_sclk = block.getFieldValue('ES8388_SCLK');
    const es8388_lrck = block.getFieldValue('ES8388_LRCK');
    const es8388_dsdin = block.getFieldValue('ES8388_DSDIN');
    const es8388_dsdout = block.getFieldValue('ES8388_DSDOUT');
    const es8388_scl = block.getFieldValue('ES8388_SCL');
    const es8388_sda = block.getFieldValue('ES8388_SDA');
// #include <driver/i2c_master.h>\n#include <esp_lcd_panel_io.h>\n#include <esp_lcd_panel_ops.h>\n#include <esp_lcd_panel_vendor.h>\n

    const es8388_i2c_address = generator.valueToCode(block, 'ES8388_I2C_ADDRESS', generator.ORDER_ATOMIC) || '""';
    const es8388_rate = generator.valueToCode(block, 'ES8388_RATE', generator.ORDER_ATOMIC) || '""';
    const es8388_iic_port = block.getFieldValue('ES8388_IIC_PORT') || 'I2C_NUM_0';
    generator.addLibrary('inclue_aivox3_engine', '#include "ai_vox_engine.h"\n');
    generator.addLibrary('include_i2c_master', '#include <driver/i2c_master.h>\n');
    generator.addLibrary('aivox3_es8388_library', '#include "components/espressif/esp_audio_codec/esp_audio_simple_dec.h"\n#include "audio_device/audio_device_es8388.h"\n');

    generator.addVariable('esp32ai_rate',`int esp32ai_rate=${es8388_rate};\n`,true);

    generator.addObject('aivox3_audio_device_es8388', 'i2c_master_bus_handle_t g_i2c_master_bus_handle = nullptr;\nstd::shared_ptr<ai_vox::AudioDeviceEs8388> g_audio_output_device;', true);

    generator.addObject('aivox3_initI2C', `void InitI2cBus() {
    const i2c_master_bus_config_t i2c_master_bus_config = {
        .i2c_port = ${es8388_iic_port},
        .sda_io_num = GPIO_NUM_${es8388_sda},
        .scl_io_num = GPIO_NUM_${es8388_scl},
        .clk_source = I2C_CLK_SRC_DEFAULT,
        .glitch_ignore_cnt = 7,
        .intr_priority = 0,
        .trans_queue_depth = 0,
        .flags =
            {
                .enable_internal_pullup = 1,
                .allow_pd = 0,
            },
        };
        ESP_ERROR_CHECK(i2c_new_master_bus(&i2c_master_bus_config, &g_i2c_master_bus_handle));
    }`, true);
    generator.addSetup("aivox3_setup_init_i2c_bus", `    InitI2cBus();\n`);
    generator.addSetup("aivox3_setup_es8388", `  g_audio_output_device = std::make_shared<ai_vox::AudioDeviceEs8388>(
      g_i2c_master_bus_handle, 
      ${es8388_i2c_address}, 
      ${es8388_iic_port}, 
      ${es8388_rate}, 
      GPIO_NUM_${es8388_mclk}, 
      GPIO_NUM_${es8388_sclk}, 
      GPIO_NUM_${es8388_lrck}, 
      GPIO_NUM_${es8388_dsdin},
      GPIO_NUM_${es8388_dsdout}, 
      GPIO_NUM_NC,
      false
    );\n`);
    
    return '';
}

// 定义 esp32_i2s_mic_setup 块的动态输入扩展
if (Blockly.Extensions.isRegistered('esp32_i2s_mic_dynamic_inputs')) {
    Blockly.Extensions.unregister('esp32_i2s_mic_dynamic_inputs');
}

Blockly.Extensions.register('esp32_i2s_mic_dynamic_inputs', function() {
    // 更新块形状的函数
    this.updateShape_ = function(micType) {
        // 1. 统一移除所有可能存在的动态引脚输入
        if (this.getInput('SCK_PIN_INPUT')) this.removeInput('SCK_PIN_INPUT');
        if (this.getInput('SD_PIN_INPUT')) this.removeInput('SD_PIN_INPUT');
        if (this.getInput('WS_PIN_INPUT')) this.removeInput('WS_PIN_INPUT');

        // 2. 添加简单的数字输入框，不设置范围限制
        // SCK/BCLK Pin
        this.appendDummyInput('SCK_PIN_INPUT')
            .appendField('SCK/BCLK:')
            .appendField(new Blockly.FieldNumber(13), 'SCK_PIN_INPUT'); // 仅设置默认值

        // SD/DIN Pin
        this.appendDummyInput('SD_PIN_INPUT')
            .appendField('SD/DIN:')
            .appendField(new Blockly.FieldNumber(11), 'SD_PIN_INPUT'); // 仅设置默认值

        // WS/LRCLK Pin (仅 I2S 标准需要)
        if (micType === 'AUDIO_INPUT_DEVICE_TYPE_I2S_STD') {
            this.appendDummyInput('WS_PIN_INPUT')
                .appendField('WS/LRCLK:')
                .appendField(new Blockly.FieldNumber(12), 'WS_PIN_INPUT'); // 仅设置默认值
        }
    };

    // 3. 为 MIC_TYPE 字段添加验证器，切换类型时更新形状
    this.getField('MIC_TYPE').setValidator(function(option) {
        this.getSourceBlock().updateShape_(option);
        return option;
    });

    // 4. 初始化时更新形状
    const micTypeField = this.getField('MIC_TYPE');
    if (micTypeField) {
      this.updateShape_(micTypeField.getValue());
    }
});
//麦克风
Arduino.forBlock['esp32_i2s_mic_setup'] = function(block, generator) {
    es8311mr = 'false';
    es8388pd = 'false';
    // 提取麦克风类型
    const micType = block.getFieldValue('MIC_TYPE');

    // 直接获取用户输入的数字值
    const sckPinNum = block.getFieldValue('SCK_PIN_INPUT');
    const sdPinNum = block.getFieldValue('SD_PIN_INPUT');
    let wsPinNum = null;
    if (micType === 'AUDIO_INPUT_DEVICE_TYPE_I2S_STD') {
        wsPinNum = block.getFieldValue('WS_PIN_INPUT');
    }
    
    // 简单检查，防止未输入值的情况
    if (sckPinNum === null || sckPinNum === '' || sdPinNum === null || sdPinNum === '') {
        const errorCode = `// 错误：ESP32 I2S Mic Setup 块的引脚号未设置。\n`;
        console.error("ESP32 I2S Mic Setup Error: One or more pin numbers are not set.");
        return errorCode;
    }

    // 转换为GPIO_NUM_x格式
    const sckPin = `GPIO_NUM_${sckPinNum}`;
    const sdPin = `GPIO_NUM_${sdPinNum}`;
    const wsPin = wsPinNum !== null ? `GPIO_NUM_${wsPinNum}` : '';

    // --- 后续代码与之前相同 ---
    generator.addLibrary('include_aivox_engine', '#include "ai_vox_engine.h"');
    generator.addLibrary('audio_input_i2s_std', '#include "audio_device/audio_input_device_i2s_std.h"');
    generator.addLibrary('audio_input_pdm', '#include "audio_device/audio_input_device_pdm.h"');

    generator.addVariable('audio_input_type_def', `#define AUDIO_INPUT_DEVICE_TYPE ${micType}`);
    generator.addVariable('audio_type_constants', `
#define AUDIO_INPUT_DEVICE_TYPE_PDM (0)
#define AUDIO_INPUT_DEVICE_TYPE_I2S_STD (1)
  `);

    let pinDefCode = '';
    if (micType === 'AUDIO_INPUT_DEVICE_TYPE_I2S_STD') {
        pinDefCode = `constexpr gpio_num_t kMicPinSck = ${sckPin};  // I2S时钟引脚
constexpr gpio_num_t kMicPinWs = ${wsPin};   // I2S帧同步引脚
constexpr gpio_num_t kMicPinSd = ${sdPin};   // I2S数据引脚`;
    } else {
        pinDefCode = `constexpr gpio_num_t kMicPinSck = ${sckPin};  // PDM时钟引脚
constexpr gpio_num_t kMicPinSd = ${sdPin};   // PDM数据引脚`;
    }
    generator.addVariable('mic_pins_def', pinDefCode);

    return '';
};

//扬声器
Arduino.forBlock['esp32ai_i2s_speaker_setup'] = function(block, generator) {
  es8311mr = 'false';
  es8388pd = 'false';
  const sckPin = block.getFieldValue('SCK_PIN');
  const wsPin = block.getFieldValue('WS_PIN');
  const sdPin = block.getFieldValue('SD_PIN');
  
  // 1. 添加库引用（对应 [库引用 library] 区域）
  generator.addLibrary('include_aivox_engine', '#include "ai_vox_engine.h"');
  generator.addLibrary('audio_output_i2s_lib','#include "audio_device/audio_output_device_i2s_std.h"');

  generator.addVariable('esp32ai_rate','int esp32ai_rate=16000;\n',true);
  
  // 2. 定义引脚常量（对应 [变量 variable] 区域，使用constexpr保持与main.cpp一致）
  const pinDefines = `
constexpr gpio_num_t kSpeakerPinSck = GPIO_NUM_${sckPin};  // SCK (BCK, BCLK)
constexpr gpio_num_t kSpeakerPinWs = GPIO_NUM_${wsPin};  // WS (LRCLK)
constexpr gpio_num_t kSpeakerPinSd = GPIO_NUM_${sdPin};  // SD (DIN)
`;
  generator.addVariable(
    'kSpeakerPin_defines',  // 唯一标签
    pinDefines.trim()
  );
  return '';
};

// 定义 esp32ai_init_display 块的动态输入扩展
if (Blockly.Extensions.isRegistered('esp32ai_init_display_dynamic_inputs')) {
    Blockly.Extensions.unregister('esp32ai_init_display_dynamic_inputs');
}
Blockly.Extensions.register('esp32ai_init_display_dynamic_inputs', function() {
    // 这个函数负责根据选择的显示屏类型更新块的形状
    this.updateShape_ = function(displayType) {
        // 1. 移除所有可能存在的动态引脚输入，防止残留
        const inputNames = [
            'BACKLIGHT_PIN', 'MOSI_PIN', 'CLK_PIN', 'DC_PIN', 'RST_PIN', 'CS_PIN', // ST7789
            'SCL_PIN', 'SDA_PIN', 'set_PIN', 'set_PIN1', 'i2c_settings'           // SSD1306
        ];
        inputNames.forEach(name => {
            if (this.getInput(name)) {
                this.removeInput(name);
            }
        });

        // 2. 根据选择的类型，添加对应的引脚输入
        if (displayType === 'ST7789') {
            // 添加 ST7789 (SPI) 所需的引脚
            this.appendDummyInput('set_PIN')
                .appendField('DC 引脚:')
                .appendField(new Blockly.FieldNumber(27), 'DC_PIN')
                .appendField('MOSI/SDA 引脚:')
                .appendField(new Blockly.FieldNumber(13), 'MOSI_PIN')
                .appendField('CLK/SCL 引脚:')
                .appendField(new Blockly.FieldNumber(14), 'CLK_PIN');


            this.appendDummyInput('set_PIN1')
                .appendField('RST 引脚:')
                .appendField(new Blockly.FieldNumber(33), 'RST_PIN')
                .appendField('BackLight 引脚:')
                .appendField(new Blockly.FieldNumber(2), 'BACKLIGHT_PIN')
                .appendField('CS 引脚:')
                .appendField(new Blockly.FieldNumber(5), 'CS_PIN');

        } else if (displayType === 'SSD1306') {
            // 添加 SSD1306 (I2C) 所需的引脚
            this.appendDummyInput('i2c_settings')
                .appendField('SCL 引脚:')
                .appendField(new Blockly.FieldNumber(22), 'SCL_PIN')
                .appendField('SDA 引脚:')
                .appendField(new Blockly.FieldNumber(21), 'SDA_PIN');
        }
    };

    // 3. 为 DISPLAY_TYPE 字段添加验证器，当值改变时触发形状更新
    this.getField('DISPLAY_TYPE').setValidator(function(option) {
        this.getSourceBlock().updateShape_(option);
        // 返回选中的值，以更新下拉框的显示
        return option;
    });

    // 4. 初始化时，根据默认选中的类型更新块的形状
    const displayTypeField = this.getField('DISPLAY_TYPE');
    if (displayTypeField) {
      const defaultType = displayTypeField.getValue();
      this.updateShape_(defaultType);
    }
});
// 统一的显示屏初始化代码生成器
Arduino.forBlock['esp32ai_init_display'] = function(block, generator) {
    generator.addLibrary('include_aivox_engine', '#include "ai_vox_engine.h"');
    const displayType = block.getFieldValue('DISPLAY_TYPE');
    display_type = block.getFieldValue('DISPLAY_TYPE');
    // 根据显示屏类型生成不同的代码
    if (displayType === 'ST7789') {
        // --- ST7789 (SPI) 代码生成 ---
        const backLightPin = block.getFieldValue('BACKLIGHT_PIN');
        const BLPin = backLightPin < 0 ? 'NC' : backLightPin;
        const MOSIPin = block.getFieldValue('MOSI_PIN');
        const CLKPin = block.getFieldValue('CLK_PIN');
        const DCPin = block.getFieldValue('DC_PIN');
        const rstPinValue = Number(block.getFieldValue('RST_PIN')) || -1;
        const RSTPin = rstPinValue < 0 ? 'NC' : rstPinValue;
        //const RSTPin = block.getFieldValue('RST_PIN');
        const CSPin = block.getFieldValue('CS_PIN');
        
        generator.addLibrary('spi_common_lib','#include <driver/spi_common.h>');
        generator.addLibrary('esp_heap_caps_lib','#include <esp_heap_caps.h>');
        generator.addLibrary('esp_lcd_panel_io_lib','#include <esp_lcd_panel_io.h>');
        generator.addLibrary('esp_lcd_panel_ops_lib','#include <esp_lcd_panel_ops.h>');
        generator.addLibrary('esp_lcd_panel_vendor_lib','#include <esp_lcd_panel_vendor.h>');
        generator.addLibrary('esp32xzai_display', '#include "kljxgwj/screendisplay/display.h"');

        generator.addMacro('Screen_Display_Type_lcd','#define SCREEN_DISPLAY_TYPE_LCD (1)');
        generator.addMacro('Screen_Display_Type_oled','#define SCREEN_DISPLAY_TYPE_OLED (2)');
        generator.addMacro('nScreen_Display_Type_lcd','#define nSCREEN_DISPLAY_TYPE_LCD (3)');
        generator.addMacro('nScreen_Display_Type_oled','#define nSCREEN_DISPLAY_TYPE_OLED (4)');
        generator.addMacro('Screen_Display_Type','#define SCREEN_DISPLAY_TYPE SCREEN_DISPLAY_TYPE_LCD');
        
        const pinDefines = `
constexpr gpio_num_t kDisplayBacklightPin = GPIO_NUM_${BLPin};
constexpr gpio_num_t kDisplayMosiPin = GPIO_NUM_${MOSIPin};
constexpr gpio_num_t kDisplayClkPin = GPIO_NUM_${CLKPin};
constexpr gpio_num_t kDisplayDcPin = GPIO_NUM_${DCPin};
constexpr gpio_num_t kDisplayRstPin = GPIO_NUM_${RSTPin};
constexpr gpio_num_t kDisplayCsPin = GPIO_NUM_${CSPin};

constexpr auto kDisplaySpiMode = 0;
constexpr uint32_t kDisplayWidth = 240;
constexpr uint32_t kDisplayHeight = 240;
constexpr bool kDisplayMirrorX = false;
constexpr bool kDisplayMirrorY = false;
constexpr bool kDisplayInvertColor = true;
constexpr bool kDisplaySwapXY = false;
constexpr auto kDisplayRgbElementOrder = LCD_RGB_ELEMENT_ORDER_RGB;
`;
        generator.addVariable('lcdPin_defines', pinDefines.trim());

    } else if (displayType === 'SSD1306') {
        // --- SSD1306 (I2C) 代码生成 ---
        const sclPin = block.getFieldValue('SCL_PIN');
        const sdaPin = block.getFieldValue('SDA_PIN');
        
        generator.addLibrary('i2c_master_lib','#include <driver/i2c_master.h>');
        generator.addLibrary('esp_lcd_io_i2c_lib','#include <esp_lcd_io_i2c.h>');
        generator.addLibrary('esp_lcd_panel_ops_lib','#include <esp_lcd_panel_ops.h>');
        generator.addLibrary('esp_lcd_panel_ssd1306_lib','#include <esp_lcd_panel_ssd1306.h>');
        generator.addLibrary('esp32xzai_display', '#include "kljxgwj/screendisplay/displayoled.h"');

        generator.addMacro('Screen_Display_Type_lcd','#define SCREEN_DISPLAY_TYPE_LCD (1)');
        generator.addMacro('Screen_Display_Type_oled','#define SCREEN_DISPLAY_TYPE_OLED (2)');
        generator.addMacro('nScreen_Display_Type_lcd','#define nSCREEN_DISPLAY_TYPE_LCD (3)');
        generator.addMacro('nScreen_Display_Type_oled','#define nSCREEN_DISPLAY_TYPE_OLED (4)');
        generator.addMacro('Screen_Display_Type','#define SCREEN_DISPLAY_TYPE SCREEN_DISPLAY_TYPE_OLED');

        const pinDefines = `
constexpr gpio_num_t kI2cPinSda = GPIO_NUM_${sdaPin};
constexpr gpio_num_t kI2cPinScl = GPIO_NUM_${sclPin};

constexpr uint32_t kDisplayWidth = 128;
constexpr uint32_t kDisplayHeight = 64;
constexpr bool kDisplayMirrorX = true;
constexpr bool kDisplayMirrorY = true;
`;
        generator.addVariable('lcdPin_defines', pinDefines.trim());
    }
    
    // 两个类型的初始化函数可能都在 display.h 或 displayoled.h 中，
    // 主程序会根据 SCREEN_DISPLAY_TYPE 宏来决定调用哪个，所以这里不需要返回额外的代码。
    return '';
};

// 定义esp32ai_init_nlvgl_display块的动态输入扩展
if (Blockly.Extensions.isRegistered('esp32ai_init_nlvgl_display_dynamic_inputs')) {
  Blockly.Extensions.unregister('esp32ai_init_nlvgl_display_dynamic_inputs');
}
Blockly.Extensions.register('esp32ai_init_nlvgl_display_dynamic_inputs', function() {
    // 这个函数负责根据选择的显示屏类型更新块的形状
    this.updateShape_ = function(displayType) {
        // 1. 移除所有可能存在的动态引脚输入，防止残留
        const inputNames = [
            'BACKLIGHT_PIN', 'MOSI_PIN', 'CLK_PIN', 'DC_PIN', 'RST_PIN', 'CS_PIN', 'set_PIN', 'set_PIN1' // ST7789
            ,'SCL_PIN', 'SDA_PIN', 'FREQUENCY', 'WIDTH', 'HEIGHT', 'DISPLAY_SETTINGS', 'i2c_settings'    // SSD1306
            ,'lvgl_port_initxg','TASK_PRIORITY','TASK_STACK','TASK_AFFINITY','TASK_MAX_SLEEP','TIMER_PERIOD' //lvgl port
            ,'lvgl_port_initbt'
        ];
        inputNames.forEach(name => {
            if (this.getInput(name)) {
                this.removeInput(name);
            }
        });

        // 2. 根据选择的类型，添加对应的引脚输入
        if (displayType === 'nST7789') {
            this.appendDummyInput('DISPLAY_SETTINGS')
                .appendField('宽度: ')
                .appendField(new Blockly.FieldNumber(240), 'WIDTH')
                .appendField('            高度: ')
                .appendField(new Blockly.FieldNumber(240), 'HEIGHT')
                .appendField('            频率: ')
                .appendField(new Blockly.FieldDropdown([
                  ["40MHz", "40000000"],
                  ["20MHz", "20000000"],
                  ["27MHz", "27000000"],
                  ["10MHz", "10000000"],
                  ["55MHz", "55000000"],
                  ["80MHz", "80000000"]
                ]), 'FREQUENCY');
            // 添加 ST7789 (SPI) 所需的引脚
            this.appendDummyInput('set_PIN')
                .appendField('BackLight引脚:')
                .appendField(new Blockly.FieldNumber(46), 'BACKLIGHT_PIN')
                .appendField('  MOSI/SDA引脚:')
                .appendField(new Blockly.FieldNumber(16), 'MOSI_PIN')
                .appendField('  CLK/SCL引脚:')
                .appendField(new Blockly.FieldNumber(15), 'CLK_PIN');

            this.appendDummyInput('set_PIN1')
                .appendField('         DC 引脚: ')
                .appendField(new Blockly.FieldNumber(8), 'DC_PIN')
                .appendField('             RST 引脚: ')
                .appendField(new Blockly.FieldNumber(17), 'RST_PIN')
                .appendField('          CS 引脚: ')
                .appendField(new Blockly.FieldNumber(3), 'CS_PIN');
            //添加lvgl端口
            this.appendDummyInput('lvgl_port_initbt')
                .appendField(new Blockly.FieldLabelSerializable('LVGL端口初始化'), 'TITLE')
            this.appendDummyInput('lvgl_port_initxg')
                .appendField('优先级:')
                .appendField(new Blockly.FieldNumber(1,1,10), 'TASK_PRIORITY')
                .appendField('空间:')
                .appendField(new Blockly.FieldNumber(7168,1024,32768), 'TASK_STACK')
                .appendField('核心:')
                .appendField(new Blockly.FieldDropdown([
                  ["无", "-1"],
                  ["核心0", "0"],
                  ["核心1", "1"]
                ]), 'TASK_AFFINITY')
                .appendField('睡眠(ms):')
                .appendField(new Blockly.FieldNumber(500,0,5000), 'TASK_MAX_SLEEP')
                .appendField('周期(ms):')
                .appendField(new Blockly.FieldNumber(50,1,100), 'TIMER_PERIOD')

        } else if (displayType === 'nSSD1306') {
            this.appendDummyInput('i2c_settings')
                .appendField('宽度:')
                .appendField(new Blockly.FieldNumber(128), 'WIDTH')
                .appendField('高度:')
                .appendField(new Blockly.FieldNumber(64), 'HEIGHT')
                .appendField('SCL 引脚:')
                .appendField(new Blockly.FieldNumber(22), 'SCL_PIN')
                .appendField('SDA 引脚:')
                .appendField(new Blockly.FieldNumber(21), 'SDA_PIN');
            //添加lvgl端口
            this.appendDummyInput('lvgl_port_initbt')
                .appendField(new Blockly.FieldLabelSerializable('LVGL端口初始化'), 'TITLE')
            this.appendDummyInput('lvgl_port_initxg')
                .appendField('优先级:')
                .appendField(new Blockly.FieldNumber(1,1,10), 'TASK_PRIORITY')
                .appendField('空间:')
                .appendField(new Blockly.FieldNumber(7168,1024,32768), 'TASK_STACK')
                .appendField('核心:')
                .appendField(new Blockly.FieldDropdown([
                  ["无", "-1"],
                  ["核心0", "0"],
                  ["核心1", "1"]
                ]), 'TASK_AFFINITY')
                .appendField('睡眠(ms):')
                .appendField(new Blockly.FieldNumber(500,0,5000), 'TASK_MAX_SLEEP')
                .appendField('周期(ms):')
                .appendField(new Blockly.FieldNumber(50,1,100), 'TIMER_PERIOD')
        }
    };

    // 3. 为 DISPLAY_TYPE 字段添加验证器，当值改变时触发形状更新
    this.getField('DISPLAY_TYPE').setValidator(function(option) {
        this.getSourceBlock().updateShape_(option);
        // 返回选中的值，以更新下拉框的显示
        return option;
    });

    // 4. 初始化时，根据默认选中的类型更新块的形状
    const displayTypeField = this.getField('DISPLAY_TYPE');
    if (displayTypeField) {
      const defaultType = displayTypeField.getValue();
      this.updateShape_(defaultType);
    }
});
// 用外建lvgl时显示屏初始化代码生成器
Arduino.forBlock['esp32ai_init_nlvgl_display'] = function(block, generator) {
  generator.addLibrary('include_aivox_engine', '#include "ai_vox_engine.h"');
  generator.addObject(`chat_message_role`, `std::string chatRole;`, true);
  const displayType = block.getFieldValue('DISPLAY_TYPE');
  display_type = 'NONE';
  let setupCode = '';
  // 根据显示屏类型生成不同的代码
  if (displayType === 'nST7789') {
    // --- ST7789 (SPI) 代码生成 ---
    const backLightPin = block.getFieldValue('BACKLIGHT_PIN');
    const BLPin = backLightPin < 0 ? 'NC' : backLightPin;
    const MOSIPin = block.getFieldValue('MOSI_PIN');
    const CLKPin = block.getFieldValue('CLK_PIN');
    const DCPin = block.getFieldValue('DC_PIN');
    const rstPinValue = Number(block.getFieldValue('RST_PIN')) || -1;
    const RSTPin = rstPinValue < 0 ? 'NC' : rstPinValue;
    const CSPin = block.getFieldValue('CS_PIN');
    const width = block.getFieldValue('WIDTH') || '240';
    const height = block.getFieldValue('HEIGHT') || '240';
    const rotation = block.getFieldValue('ROTATION') || '0';
    const pFREQUENCY = block.getFieldValue('FREQUENCY');

    const taskPriority = block.getFieldValue('TASK_PRIORITY') || 1;
    const taskStack = block.getFieldValue('TASK_STACK') || 7168;
    const taskAffinity = block.getFieldValue('TASK_AFFINITY') || -1;
    const taskMaxSleep = block.getFieldValue('TASK_MAX_SLEEP') || 500;
    const timerPeriod = block.getFieldValue('TIMER_PERIOD') || 50;
    
    generator.addLibrary('spi_common_lib','#include <driver/spi_common.h>');
    generator.addLibrary('esp_heap_caps_lib','#include <esp_heap_caps.h>');
    generator.addLibrary('esp_lcd_panel_io_lib','#include <esp_lcd_panel_io.h>');
    generator.addLibrary('esp_lcd_panel_ops_lib','#include <esp_lcd_panel_ops.h>');
    generator.addLibrary('esp_lcd_panel_vendor_lib','#include <esp_lcd_panel_vendor.h>');
    generator.addLibrary('map_lib','#include <map>');
    generator.addLibrary('vector_lib','#include <vector>');
    generator.addLibrary('algorithm_lib','#include <algorithm>');

    generator.addLibrary('esp_lvgl_port_lib','#include "kljxgwj/lvgldj/esp_lvgl_port.h"');
    //generator.addLibrary('font_awesome_symbols','#include "kljxgwj/lvgldj/font_awesome_symbols.h"');
    //generator.addLibrary('font_emoji','#include "kljxgwj/lvgldj/font_emoji.h"');

    generator.addMacro('Screen_Display_Type_lcd','#define SCREEN_DISPLAY_TYPE_LCD (1)');
    generator.addMacro('Screen_Display_Type_oled','#define SCREEN_DISPLAY_TYPE_OLED (2)');
    generator.addMacro('nScreen_Display_Type_lcd','#define nSCREEN_DISPLAY_TYPE_LCD (3)');
    generator.addMacro('nScreen_Display_Type_oled','#define nSCREEN_DISPLAY_TYPE_OLED (4)');
    generator.addMacro('Screen_Display_Type','#define SCREEN_DISPLAY_TYPE nSCREEN_DISPLAY_TYPE_LCD');

    generator.addVariable('esp32ai_custom_g_display','static lv_display_t* g_display = nullptr;');
    
    const pinDefines = `
constexpr gpio_num_t kDisplayBacklightPin = GPIO_NUM_${BLPin};
constexpr gpio_num_t kDisplayMosiPin = GPIO_NUM_${MOSIPin};
constexpr gpio_num_t kDisplayClkPin = GPIO_NUM_${CLKPin};
constexpr gpio_num_t kDisplayDcPin = GPIO_NUM_${DCPin};
constexpr gpio_num_t kDisplayRstPin = GPIO_NUM_${RSTPin};
constexpr gpio_num_t kDisplayCsPin = GPIO_NUM_${CSPin};

constexpr auto kDisplaySpiMode = 0;
constexpr uint32_t kDisplayWidth = ${width};
constexpr uint32_t kDisplayHeight = ${height};
constexpr uint32_t kDisplayPclkHz = ${pFREQUENCY};
constexpr uint8_t kDisplayRotateDeg = ${rotation};
constexpr bool kDisplayMirrorX = (kDisplayRotateDeg == 90 || kDisplayRotateDeg == 180);
constexpr bool kDisplayMirrorY = (kDisplayRotateDeg == 180 || kDisplayRotateDeg == 270);
constexpr bool kDisplayInvertColor = true;
constexpr bool kDisplaySwapXY = (kDisplayRotateDeg == 90 || kDisplayRotateDeg == 270);
constexpr auto kDisplayRgbElementOrder = LCD_RGB_ELEMENT_ORDER_RGB;
`;
    generator.addVariable('lcdPin_defines', pinDefines.trim());

    generator.addFunction('esp32ai_custom_DisplayInit',`
void DisplayInit(esp_lcd_panel_io_handle_t panel_io,
                 esp_lcd_panel_handle_t panel,
                 int width,
                 int height,
                 int offset_x,
                 int offset_y,
                 bool mirror_x,
                 bool mirror_y,
                 bool swap_xy) {
    // 绘制白色背景
    std::vector<uint16_t> buffer(width, 0xFFFF);
    for (int y = 0; y < height; y++) {
        esp_lcd_panel_draw_bitmap(panel, 0, y, width, y + 1, buffer.data());
    }

    ESP_ERROR_CHECK(esp_lcd_panel_disp_on_off(panel, true));
    lv_init();

    lvgl_port_cfg_t port_cfg = ESP_LVGL_PORT_INIT_CONFIG();
    port_cfg.task_priority = ${taskPriority};
    port_cfg.task_stack = ${taskStack};
    port_cfg.task_affinity = ${taskAffinity};
    port_cfg.task_max_sleep_ms = ${taskMaxSleep};
    port_cfg.timer_period_ms = ${timerPeriod};
    lvgl_port_init(&port_cfg);

    const lvgl_port_display_cfg_t display_cfg = {
        .io_handle = panel_io,
        .panel_handle = panel,
        .control_handle = nullptr,
        .buffer_size = static_cast<uint32_t>(width * 10),
        .double_buffer = false,
        .trans_size = 0,
        .hres = static_cast<uint32_t>((swap_xy) ? height : width),
        .vres = static_cast<uint32_t>((swap_xy) ? width : height),
        .monochrome = false,
        .rotation =
            {
                .swap_xy = swap_xy,
                .mirror_x = mirror_x,
                .mirror_y = mirror_y,
            },
        .color_format = LV_COLOR_FORMAT_RGB565,
        .flags =
            {
                .buff_dma = 1,
                .buff_spiram = 0,
                .sw_rotate = 0,
                .swap_bytes = 1,
                .full_refresh = 0,
                .direct_mode = 0,
            },
    };

    g_display = lvgl_port_add_disp(&display_cfg);

    assert(g_display != nullptr);
    if (g_display == nullptr) {
        abort();
        return;
    }

    if (offset_x != 0 || offset_y != 0) {
        lv_display_set_offset(g_display, offset_x, offset_y);
    }
}
    `);

    generator.addFunction('esp32ai_custom_InitDisplay',`
void InitDisplay() {
  printf("init display\\n");
  pinMode(kDisplayBacklightPin, OUTPUT);
  analogWrite(kDisplayBacklightPin, 255);

  spi_bus_config_t buscfg{
      .mosi_io_num = kDisplayMosiPin,
      .miso_io_num = GPIO_NUM_NC,
      .sclk_io_num = kDisplayClkPin,
      .quadwp_io_num = GPIO_NUM_NC,
      .quadhd_io_num = GPIO_NUM_NC,
      .data4_io_num = GPIO_NUM_NC,
      .data5_io_num = GPIO_NUM_NC,
      .data6_io_num = GPIO_NUM_NC,
      .data7_io_num = GPIO_NUM_NC,
      .data_io_default_level = false,
      .max_transfer_sz = kDisplayWidth * kDisplayHeight * sizeof(uint16_t),
      .flags = 0,
      .isr_cpu_id = ESP_INTR_CPU_AFFINITY_AUTO,
      .intr_flags = 0,
  };
  ESP_ERROR_CHECK(spi_bus_initialize(SPI3_HOST, &buscfg, SPI_DMA_CH_AUTO));
  
  esp_lcd_panel_io_handle_t panel_io = nullptr;
  esp_lcd_panel_handle_t panel = nullptr;

  esp_lcd_panel_io_spi_config_t io_config = {};
  io_config.cs_gpio_num = kDisplayCsPin;
  io_config.dc_gpio_num = kDisplayDcPin;
  io_config.spi_mode = kDisplaySpiMode;
  io_config.pclk_hz = kDisplayPclkHz;
  io_config.trans_queue_depth = 10;
  io_config.lcd_cmd_bits = 8;
  io_config.lcd_param_bits = 8;
  ESP_ERROR_CHECK(esp_lcd_new_panel_io_spi(SPI3_HOST, &io_config, &panel_io));

  esp_lcd_panel_dev_config_t panel_config = {};
  panel_config.reset_gpio_num = kDisplayRstPin;
  panel_config.rgb_ele_order = kDisplayRgbElementOrder;
  panel_config.bits_per_pixel = 16;
  ESP_ERROR_CHECK(esp_lcd_new_panel_st7789(panel_io, &panel_config, &panel));

  esp_lcd_panel_reset(panel);

  esp_lcd_panel_init(panel);
  esp_lcd_panel_invert_color(panel, kDisplayInvertColor);
  esp_lcd_panel_swap_xy(panel, kDisplaySwapXY);
  esp_lcd_panel_mirror(panel, kDisplayMirrorX, kDisplayMirrorY);

  DisplayInit(panel_io, panel, kDisplayWidth, kDisplayHeight, 0, 0, kDisplayMirrorX, kDisplayMirrorY, kDisplaySwapXY);
}
    `);
    generator.addSetup('esp32ai_custom_InitDisplay_setup',' InitDisplay();\n');
  } else if (displayType === 'nSSD1306') {
    // --- SSD1306 (I2C) 代码生成 ---
    const sclPin = block.getFieldValue('SCL_PIN');
    const sdaPin = block.getFieldValue('SDA_PIN');
    const pWIDTH = block.getFieldValue('WIDTH') || '128';  // 默认128x64
    const pHEIGHT = block.getFieldValue('HEIGHT') || '64';
    const rotation = block.getFieldValue('ROTATION') || '0';  // 旋转角度

    const taskPriority = block.getFieldValue('TASK_PRIORITY') || 1;
    const taskStack = block.getFieldValue('TASK_STACK') || 7168;
    const taskAffinity = block.getFieldValue('TASK_AFFINITY') || -1;
    const taskMaxSleep = block.getFieldValue('TASK_MAX_SLEEP') || 500;
    const timerPeriod = block.getFieldValue('TIMER_PERIOD') || 50;
      
    generator.addLibrary('i2c_master_lib','#include <driver/i2c_master.h>');
    generator.addLibrary('esp_lcd_io_i2c_lib','#include <esp_lcd_io_i2c.h>');
    generator.addLibrary('esp_lcd_panel_ops_lib','#include <esp_lcd_panel_ops.h>');
    generator.addLibrary('esp_lcd_panel_ssd1306_lib','#include <esp_lcd_panel_ssd1306.h>');
    generator.addLibrary('map_lib','#include <map>');
    generator.addLibrary('vector_lib','#include <vector>');
    generator.addLibrary('algorithm_lib','#include <algorithm>');
    generator.addLibrary('esp_lvgl_port_lib','#include "kljxgwj/lvgldj/esp_lvgl_port.h"');

    generator.addMacro('Screen_Display_Type_lcd','#define SCREEN_DISPLAY_TYPE_LCD (1)');
    generator.addMacro('Screen_Display_Type_oled','#define SCREEN_DISPLAY_TYPE_OLED (2)');
    generator.addMacro('nScreen_Display_Type_lcd','#define nSCREEN_DISPLAY_TYPE_LCD (3)');
    generator.addMacro('nScreen_Display_Type_oled','#define nSCREEN_DISPLAY_TYPE_OLED (4)');
    generator.addMacro('Screen_Display_Type','#define SCREEN_DISPLAY_TYPE nSCREEN_DISPLAY_TYPE_OLED');

    generator.addVariable('esp32ai_custom_g_display','static lv_display_t* g_display = nullptr;');

    const pinDefines = `
constexpr gpio_num_t kI2cPinSda = GPIO_NUM_${sdaPin};
constexpr gpio_num_t kI2cPinScl = GPIO_NUM_${sclPin};

constexpr uint32_t kDisplayWidth = ${pWIDTH};
constexpr uint32_t kDisplayHeight = ${pHEIGHT};
constexpr uint8_t kDisplayRotateDeg = ${rotation};
constexpr bool kDisplayMirrorX = (kDisplayRotateDeg == 90 || kDisplayRotateDeg == 180);
constexpr bool kDisplayMirrorY = (kDisplayRotateDeg == 180 || kDisplayRotateDeg == 270);
constexpr bool kDisplaySwapXY = (kDisplayRotateDeg == 90 || kDisplayRotateDeg == 270);
constexpr uint32_t kI2cClockHz = 400 * 1000;  // I2C时钟频率400KHz
`;
      generator.addVariable('lcdPin_defines', pinDefines.trim());

      generator.addFunction('esp32ai_custom_DisplayInit',`
void DisplayInit(esp_lcd_panel_io_handle_t panel_io,
                 esp_lcd_panel_handle_t panel,
                 int width,
                 int height,
                 bool mirror_x,
                 bool mirror_y,
                 bool swap_xy) {
    lvgl_port_cfg_t port_cfg = ESP_LVGL_PORT_INIT_CONFIG();
    port_cfg.task_priority = ${taskPriority};
    port_cfg.task_stack = ${taskStack};
    port_cfg.task_affinity = ${taskAffinity};
    port_cfg.task_max_sleep_ms = ${taskMaxSleep};
    port_cfg.timer_period_ms = ${timerPeriod};
    lvgl_port_init(&port_cfg);

    const lvgl_port_display_cfg_t display_cfg = {
        .io_handle = panel_io,
        .panel_handle = panel,
        .control_handle = nullptr,
        .buffer_size = static_cast<uint32_t>(width * height),
        .double_buffer = false,
        .trans_size = 0,
        .hres = static_cast<uint32_t>((swap_xy) ? height : width),
        .vres = static_cast<uint32_t>((swap_xy) ? width : height),
        .monochrome = true,
        .rotation =
            {
                .swap_xy = swap_xy,
                .mirror_x = mirror_x,
                .mirror_y = mirror_y,
            },
        .color_format = LV_COLOR_FORMAT_UNKNOWN,
        .flags =
            {
                .buff_dma = 1,
                .buff_spiram = 0,
                .sw_rotate = 0,
                .swap_bytes = 0,
                .full_refresh = 0,
                .direct_mode = 0,
            },
    };

    g_display = lvgl_port_add_disp(&display_cfg);
}
    `);

    generator.addFunction('esp32ai_custom_InitDisplay',`
void InitDisplay() {
  printf("init display\\n");
  i2c_master_bus_handle_t display_i2c_bus;
  i2c_master_bus_config_t bus_config = {
      .i2c_port = I2C_NUM_0,
      .sda_io_num = kI2cPinSda,
      .scl_io_num = kI2cPinScl,
      .clk_source = I2C_CLK_SRC_DEFAULT,
      .glitch_ignore_cnt = 7,
      .intr_priority = 0,
      .trans_queue_depth = 0,
      .flags =
          {
              .enable_internal_pullup = 1,
              .allow_pd = false,
          },
  };
  ESP_ERROR_CHECK(i2c_new_master_bus(&bus_config, &display_i2c_bus));
  
  esp_lcd_panel_io_handle_t panel_io = nullptr;
  esp_lcd_panel_io_i2c_config_t io_config = {
      .dev_addr = 0x3C,
      .on_color_trans_done = nullptr,
      .user_ctx = nullptr,
      .control_phase_bytes = 1,
      .dc_bit_offset = 6,
      .lcd_cmd_bits = 8,
      .lcd_param_bits = 8,
      .flags =
          {
              .dc_low_on_data = 0,
              .disable_control_phase = 0,
          },
      .scl_speed_hz = 400 * 1000,
  };
  ESP_ERROR_CHECK(esp_lcd_new_panel_io_i2c_v2(display_i2c_bus, &io_config, &panel_io));

  esp_lcd_panel_handle_t panel = nullptr;
  esp_lcd_panel_dev_config_t panel_config = {};
  panel_config.reset_gpio_num = -1;
  panel_config.bits_per_pixel = 1;

  esp_lcd_panel_ssd1306_config_t ssd1306_config = {
      .height = static_cast<uint8_t>(kDisplayHeight),
  };
  panel_config.vendor_config = &ssd1306_config;

  ESP_ERROR_CHECK(esp_lcd_new_panel_ssd1306(panel_io, &panel_config, &panel));
  ESP_ERROR_CHECK(esp_lcd_panel_reset(panel));
  ESP_ERROR_CHECK(esp_lcd_panel_init(panel));
  ESP_ERROR_CHECK(esp_lcd_panel_disp_on_off(panel, true));

  DisplayInit(panel_io, panel, kDisplayWidth, kDisplayHeight, kDisplayMirrorX, kDisplayMirrorY, kDisplaySwapXY);
}
    `);

    generator.addSetup('esp32ai_custom_InitDisplay_setup',' InitDisplay();\n');
  }
  
  return '';
};

//设置小智显示字体
Arduino.forBlock['esp32ai_lvgl_obj_set_style_text_font'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'obj';
  const xzfont = block.getFieldValue('FONT');
  
  const bstr = ['font_emoji_32_init()', 'font_emoji_64_init()'];

  if (bstr.includes(xzfont)) {
    generator.addLibrary('font_emoji','#include "kljxgwj/lvgldj/font_emoji.h"');
    return `lv_obj_set_style_text_font(${varName}, ${xzfont}, 0);\n`;
  } else {
    generator.addLibrary('font_awesome_symbols','#include "kljxgwj/lvgldj/font_awesome_symbols.h"');
    generator.addLibrary(xzfont, 'LV_FONT_DECLARE(' + xzfont + ');');
    return `lv_obj_set_style_text_font(${varName}, &${xzfont}, 0);\n`;
  }
};

//返回图片字体
const EMOTION_ICON_MAP = {
  "EMOJI": [
    ["中性", "FONT_AWESOME_EMOJI_NEUTRAL"],
    ["高兴", "FONT_AWESOME_EMOJI_HAPPY"],
    ["大笑", "FONT_AWESOME_EMOJI_LAUGHING"],
    ["搞笑", "FONT_AWESOME_EMOJI_FUNNY"],
    ["难过", "FONT_AWESOME_EMOJI_SAD"],
    ["生气", "FONT_AWESOME_EMOJI_ANGRY"],
    ["哭泣", "FONT_AWESOME_EMOJI_CRYING"],
    ["爱心", "FONT_AWESOME_EMOJI_LOVING"],
    ["尴尬", "FONT_AWESOME_EMOJI_EMBARRASSED"],
    ["惊讶", "FONT_AWESOME_EMOJI_SURPRISED"],
    ["震惊", "FONT_AWESOME_EMOJI_SHOCKED"],
    ["思考", "FONT_AWESOME_EMOJI_THINKING"],
    ["眨眼", "FONT_AWESOME_EMOJI_WINKING"],
    ["酷炫", "FONT_AWESOME_EMOJI_COOL"],
    ["放松", "FONT_AWESOME_EMOJI_RELAXED"],
    ["美味", "FONT_AWESOME_EMOJI_DELICIOUS"],
    ["亲亲", "FONT_AWESOME_EMOJI_KISSY"],
    ["自信", "FONT_AWESOME_EMOJI_CONFIDENT"],
    ["困倦", "FONT_AWESOME_EMOJI_SLEEPY"],
    ["傻气", "FONT_AWESOME_EMOJI_SILLY"],
    ["困惑", "FONT_AWESOME_EMOJI_CONFUSED"]
  ],
  "BATTERY": [
    ["电池满格", "FONT_AWESOME_BATTERY_FULL"],
    ["电池75%", "FONT_AWESOME_BATTERY_3"],
    ["电池50%", "FONT_AWESOME_BATTERY_2"],
    ["电池25%", "FONT_AWESOME_BATTERY_1"],
    ["电池空", "FONT_AWESOME_BATTERY_EMPTY"],
    ["电池无电", "FONT_AWESOME_BATTERY_SLASH"],
    ["电池充电中", "FONT_AWESOME_BATTERY_CHARGING"]
  ],
  "WIFI": [
    ["WiFi满格", "FONT_AWESOME_WIFI"],
    ["WiFi信号一般", "FONT_AWESOME_WIFI_FAIR"],
    ["WiFi信号弱", "FONT_AWESOME_WIFI_WEAK"],
    ["WiFi关闭", "FONT_AWESOME_WIFI_OFF"]
  ],
  "SIGNAL": [
    ["信号满格", "FONT_AWESOME_SIGNAL_FULL"],
    ["信号4格", "FONT_AWESOME_SIGNAL_4"],
    ["信号3格", "FONT_AWESOME_SIGNAL_3"],
    ["信号2格", "FONT_AWESOME_SIGNAL_2"],
    ["信号1格", "FONT_AWESOME_SIGNAL_1"],
    ["信号关闭", "FONT_AWESOME_SIGNAL_OFF"]
  ],
  "VOLUME": [
    ["音量最大", "FONT_AWESOME_VOLUME_HIGH"],
    ["音量中等", "FONT_AWESOME_VOLUME_MEDIUM"],
    ["音量最小", "FONT_AWESOME_VOLUME_LOW"],
    ["静音", "FONT_AWESOME_VOLUME_MUTE"]
  ],
  "MEDIA": [
    ["音乐", "FONT_AWESOME_MUSIC"],
    ["播放", "FONT_AWESOME_PLAY"],
    ["暂停", "FONT_AWESOME_PAUSE"],
    ["停止", "FONT_AWESOME_STOP"],
    ["上一曲", "FONT_AWESOME_PREV"],
    ["下一曲", "FONT_AWESOME_NEXT"]
  ],
  "ARROW": [
    ["左箭头", "FONT_AWESOME_MICARROW_LEFT"],
    ["右箭头", "FONT_AWESOME_ARROW_RIGHT"],
    ["上箭头", "FONT_AWESOME_ARROW_UP"],
    ["下箭头", "FONT_AWESOME_ARROW_DOWN"]
  ],
  "FUNCTION": [
    ["对勾", "FONT_AWESOME_CHECK"],
    ["叉号", "FONT_AWESOME_XMARK"],
    ["电源", "FONT_AWESOME_POWER"],
    ["设置", "FONT_AWESOME_GEAR"],
    ["删除", "FONT_AWESOME_TRASH"],
    ["主页", "FONT_AWESOME_HOME"],
    ["图片", "FONT_AWESOME_IMAGE"],
    ["编辑", "FONT_AWESOME_EDIT"],
    ["警告", "FONT_AWESOME_WARNING"],
    ["铃铛", "FONT_AWESOME_BELL"],
    ["位置", "FONT_AWESOME_LOCATION"],
    ["地球", "FONT_AWESOME_GLOBE"],
    ["定位箭头", "FONT_AWESOME_LOCATION_ARROW"],
    ["SD卡", "FONT_AWESOME_SD_CARD"],
    ["蓝牙", "FONT_AWESOME_BLUETOOTH"],
    ["评论", "FONT_AWESOME_COMMENT"],
    ["AI芯片", "FONT_AWESOME_AI_CHIP"],
    ["用户", "FONT_AWESOME_USER"],
    ["机器人用户", "FONT_AWESOME_USER_ROBOT"],
    ["下载", "FONT_AWESOME_DOWNLOAD"]
  ]
};
if (Blockly.Extensions.isRegistered('esp32ai_emotion_category_link_extension')) {
  Blockly.Extensions.unregister('esp32ai_emotion_category_link_extension');
}
Blockly.Extensions.register('esp32ai_emotion_category_link_extension', function() {
  const block = this;
  
  // 这个函数负责根据选择的分类更新图标下拉框
  this.updateIconOptions_ = function(categoryValue) {
    // 移除现有的图标输入（如果存在）
    if (block.getInput('ICON_INPUT')) {
      block.removeInput('ICON_INPUT');
    }
    
    // 获取对应分类的选项
    const targetOptions = EMOTION_ICON_MAP[categoryValue] || EMOTION_ICON_MAP["EMOJI"];
    const iconOptions = targetOptions.map(item => [item[0], item[1]]);
    
    // 创建新的图标下拉框字段
    const iconField = new Blockly.FieldDropdown(iconOptions, function(newValue) {
      return newValue;
    });
    
    // 创建图标输入并添加字段
    const iconInput = block.appendDummyInput('ICON_INPUT')
      .appendField('图标：')
      .appendField(iconField, 'ICON');
    
    // 设置默认值
    if (iconOptions.length > 0) {
      iconField.setValue(iconOptions[0][1]);
    }
  };

  // 为 CATEGORY 字段添加验证器，当值改变时更新图标选项
  const categoryField = block.getField('CATEGORY');
  if (categoryField) {
    categoryField.setValidator(function(newValue) {
      block.updateIconOptions_(newValue);
      return newValue;
    });
    
    // 初始化时，根据默认选中的分类创建图标下拉框
    const defaultCategory = categoryField.getValue() || "EMOJI";
    this.updateIconOptions_(defaultCategory);
  }
});
Arduino.forBlock['esp32ai_emotion_select'] = function(block, generator) {
  // 获取选中的字体宏
  const iconField = block.getField('ICON');
  if (!iconField) {
    // 如果没有图标字段，使用默认分类的第一个选项
    const categoryValue = block.getFieldValue('CATEGORY') || 'EMOJI';
    const options = EMOTION_ICON_MAP[categoryValue] || EMOTION_ICON_MAP["EMOJI"];
    return [options[0][1], 0];
  }
  
  const iconMacro = iconField.getValue();
  if (!iconMacro) {
    // 宏值为空，返回分类的第一个选项
    const categoryValue = block.getFieldValue('CATEGORY') || 'EMOJI';
    const options = EMOTION_ICON_MAP[categoryValue] || EMOTION_ICON_MAP["EMOJI"];
    return [options[0][1], 0];
  }

  // 返回选中的字体宏
  return [iconMacro, 0];
};

//设置lvgl标签图标文本
Arduino.forBlock['lvgl_label_set_text_emotion'] = function(block, generator) {
  generator.addLibrary('lvgl_label_emotion_lib_cstring', '#include <cstring>');

  generator.addVariable('lvgl_label_emotion_emotion_map',`
// 全局表情映射常量（键：表情码，值：Font Awesome表情常量）
const struct {
  const char* key;          // 情绪字符串标识
  const char* emoji_const;  // 对应的Font Awesome表情常量
} EMOTION_MAP[] = {
  {"neutral", FONT_AWESOME_EMOJI_NEUTRAL},
  {"happy", FONT_AWESOME_EMOJI_HAPPY},
  {"laughing", FONT_AWESOME_EMOJI_LAUGHING},
  {"funny", FONT_AWESOME_EMOJI_FUNNY},
  {"sad", FONT_AWESOME_EMOJI_SAD},
  {"angry", FONT_AWESOME_EMOJI_ANGRY},
  {"crying", FONT_AWESOME_EMOJI_CRYING},
  {"loving", FONT_AWESOME_EMOJI_LOVING},
  {"embarrassed", FONT_AWESOME_EMOJI_EMBARRASSED},
  {"surprised", FONT_AWESOME_EMOJI_SURPRISED},
  {"shocked", FONT_AWESOME_EMOJI_SHOCKED},
  {"thinking", FONT_AWESOME_EMOJI_THINKING},
  {"winking", FONT_AWESOME_EMOJI_WINKING},
  {"cool", FONT_AWESOME_EMOJI_COOL},
  {"relaxed", FONT_AWESOME_EMOJI_RELAXED},
  {"delicious", FONT_AWESOME_EMOJI_DELICIOUS},
  {"kissy", FONT_AWESOME_EMOJI_KISSY},
  {"confident", FONT_AWESOME_EMOJI_CONFIDENT},
  {"sleepy", FONT_AWESOME_EMOJI_SLEEPY},
  {"silly", FONT_AWESOME_EMOJI_SILLY},
  {"confused", FONT_AWESOME_EMOJI_CONFUSED}
};
const int EMOTION_MAP_COUNT = sizeof(EMOTION_MAP)/sizeof(EMOTION_MAP[0]);`
  );

  // 3. 添加表情查找函数（放到[函数 function]区）
  generator.addFunction('lvgl_label_emotion_get_icon',
  `/**
* 根据情绪码查找对应的Font Awesome表情常量
* @param emotion 情绪码字符串（如"happy"）
* @return 对应的表情常量，无匹配/空指针返回中性表情
*/
const char* get_ztemotion_icon(const char* emotion) {
  // 空指针保护
  if (emotion == NULL) return FONT_AWESOME_EMOJI_NEUTRAL;
  
  // 遍历映射表查找匹配项
  for (int i = 0; i < EMOTION_MAP_COUNT; i++) {
    if (strcmp(emotion, EMOTION_MAP[i].key) == 0) {
      return EMOTION_MAP[i].emoji_const;
    }
  }
  
  // 无匹配返回默认中性表情
  return FONT_AWESOME_EMOJI_NEUTRAL;
}`
  );

  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'label';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';

  let textCode = text; // 默认使用原始文本值
  const target = block.getInputTargetBlock('TEXT'); // 获取TEXT输入连接的块

  // 直接判断：如果连接的是情绪块，就调用get_ztemotion_icon
  if (target) { // 先判断target存在
    const emotionBlockTypes = ['get_aivox_emotion_result', 'aivox_emotion_list'];
    if (emotionBlockTypes.includes(target.type)) { // 直接判断是否是情绪块
      // 情绪块：调用查找函数，空值默认"neutral"
      const emotionCode = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"neutral"';
      textCode = `get_ztemotion_icon(${emotionCode})`; // 生成函数调用代码
    }
    // 非情绪块：保持textCode = text（原始值）
  }

  ensureLvglLib(generator);

  return 'lv_label_set_text(' + varName + ', ' + textCode + ');\n';
};

//设置lvgl标签小智图标表情
Arduino.forBlock['lvgl_label_set_text_cpemotion'] = function(block, generator) {
  generator.addLibrary('lvgl_label_cpemotion_lib_cstring', '#include <cstring>');

  // 2. 定义全局表情映射常量（放到[变量 variable]区，作为全局常量）
  generator.addVariable('lvgl_label_cpemotion_emotion_map',`
// 全局表情映射常量（键：表情码，值：表情图标）
const char* EMOTION_KEYS[] = {
  "neutral", "happy", "laughing", "funny", "sad", "angry", "crying", "loving",
  "embarrassed", "surprised", "shocked", "thinking", "winking", "cool", "relaxed",
  "delicious", "kissy", "confident", "sleepy", "silly", "confused"
};
const char* EMOTION_ICONS[] = {
  "😶", "🙂", "😆", "😂", "😔", "😠", "😭", "😍",
  "😳", "😯", "😱", "🤤", "😉", "😎", "😌",
  "🤤", "😘", "😏", "😴", "😜", "🙄"
};
const int EMOTION_COUNT = sizeof(EMOTION_KEYS)/sizeof(EMOTION_KEYS[0]);`
  );

  // 3. 添加表情查找函数（放到[函数 function]区，避免全局函数）
  generator.addFunction('lvgl_label_cpemotion_get_icon',
  `/**
* 根据表情码查找对应的表情图标
* @param emotion 表情码字符串（如"happy"）
* @return 对应的表情图标字符串，无匹配返回默认表情😶
*/
const char* get_emotion_icon(const char* emotion) {
  // 空指针保护：同步改为返回默认表情（可选，建议统一）
  if (emotion == NULL) return "😶";
  // 遍历全局表情映射表查找匹配项
  for (int i = 0; i < EMOTION_COUNT; i++) {
    if (strcmp(emotion, EMOTION_KEYS[i]) == 0) {
      return EMOTION_ICONS[i];
    }
  }
  // 无匹配返回默认表情😶 ← 核心修改行
  return "😶";
}`
  );

  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'label';
  // 5. 处理文本输入逻辑
  let textCode = '""'; // 默认空字符串
  const textInput = block.getInput('TEXT');
  
  if (textInput) {
    // 统一获取输入值（无论是什么块），为空则赋值"unknown"（避免传空指针）
    const emotionCode = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"unknown"';
    // 无论输入是啥，都走表情查找逻辑（找不到自动返回默认😶）
    textCode = `get_emotion_icon(${emotionCode})`;
  }

  // 6. 生成最终的LVGL设置标签文本代码
  return `lv_label_set_text(${varName}, ${textCode});\n`;
};

//获取lvgl锁
Arduino.forBlock['lvgl_port_lock'] = function(block, generator) {
  const timeoutMs = block.getFieldValue('TIMEOUT_MS') || 1000;
  
  //generator.addLibrary('LVGL', '#include <lvgl.h>');
  generator.addLibrary('esp_lvgl_port_lib','#include "kljxgwj/lvgldj/esp_lvgl_port.h"')
  
  return ['lvgl_port_lock(' + timeoutMs + ')', generator.ORDER_ATOMIC];
};
//释放lvgl锁
Arduino.forBlock['lvgl_port_unlock'] = function(block, generator) {
  //generator.addLibrary('LVGL', '#include <lvgl.h>');
  generator.addLibrary('esp_lvgl_port_lib','#include "kljxgwj/lvgldj/esp_lvgl_port.h"')
  
  return 'lvgl_port_unlock();\n';
};

// AI 引擎启动
Arduino.forBlock['esp32ai_start_engine'] = function(block, generator) {
  generator.addObject(`chat_message_role`, `std::string chatRole;`, true);
  generator.addMacro('Screen_Display_Type_lcd','#define SCREEN_DISPLAY_TYPE_LCD (1)');
  generator.addMacro('Screen_Display_Type_oled','#define SCREEN_DISPLAY_TYPE_OLED (2)');
  generator.addMacro('Screen_Display_Type_none','#define SCREEN_DISPLAY_TYPE_NONE (0)');
  generator.addMacro('nScreen_Display_Type_lcd','#define nSCREEN_DISPLAY_TYPE_LCD (3)');
  generator.addMacro('nScreen_Display_Type_oled','#define nSCREEN_DISPLAY_TYPE_OLED (4)');
  generator.addMacro('Screen_Display_Type','#define SCREEN_DISPLAY_TYPE SCREEN_DISPLAY_TYPE_NONE');

  if (display_type === 'ST7789') {
    generator.addObject('esp32ai_display', `std::unique_ptr<Display> g_display;\n`,true);
  } else if (display_type === 'SSD1306') {
    generator.addObject('esp32ai_display', `std::unique_ptr<OledDisplay> g_display;\n`,true);
  }

  generator.addObject(`aivox_observer`, `std::shared_ptr<ai_vox::Observer> g_observer = std::make_shared<ai_vox::Observer>();`, true);
  generator.addObject('ai_vox_engine', `auto& ai_vox_engine = ai_vox::Engine::GetInstance();`, true);
  if (es8311mr === 'false' && es8388pd === 'false') {
    generator.addObject('esp32ai_audio_output_device', `
auto g_audio_output_device = std::make_shared<ai_vox::AudioOutputDeviceI2sStd>(kSpeakerPinSck, kSpeakerPinWs, kSpeakerPinSd);\n`,true);
  }

  if (display_type === 'ST7789') {
    generator.addFunction('esp32ai_InitDisplay',`
void InitDisplay() {
  printf("init display\\n");
  pinMode(kDisplayBacklightPin, OUTPUT);
  analogWrite(kDisplayBacklightPin, ${aivox3_screen_light});

  spi_bus_config_t buscfg{
      .mosi_io_num = kDisplayMosiPin,
      .miso_io_num = GPIO_NUM_NC,
      .sclk_io_num = kDisplayClkPin,
      .quadwp_io_num = GPIO_NUM_NC,
      .quadhd_io_num = GPIO_NUM_NC,
      .data4_io_num = GPIO_NUM_NC,
      .data5_io_num = GPIO_NUM_NC,
      .data6_io_num = GPIO_NUM_NC,
      .data7_io_num = GPIO_NUM_NC,
      .data_io_default_level = false,
      .max_transfer_sz = kDisplayWidth * kDisplayHeight * sizeof(uint16_t),
      .flags = 0,
      .isr_cpu_id = ESP_INTR_CPU_AFFINITY_AUTO,
      .intr_flags = 0,
  };
  ESP_ERROR_CHECK(spi_bus_initialize(SPI3_HOST, &buscfg, SPI_DMA_CH_AUTO));

  esp_lcd_panel_io_handle_t panel_io = nullptr;
  esp_lcd_panel_handle_t panel = nullptr;

  esp_lcd_panel_io_spi_config_t io_config = {};
  io_config.cs_gpio_num = kDisplayCsPin;
  io_config.dc_gpio_num = kDisplayDcPin;
  io_config.spi_mode = kDisplaySpiMode;
  io_config.pclk_hz = 40 * 1000 * 1000;
  io_config.trans_queue_depth = 10;
  io_config.lcd_cmd_bits = 8;
  io_config.lcd_param_bits = 8;
  ESP_ERROR_CHECK(esp_lcd_new_panel_io_spi(SPI3_HOST, &io_config, &panel_io));

  esp_lcd_panel_dev_config_t panel_config = {};
  panel_config.reset_gpio_num = kDisplayRstPin;
  panel_config.rgb_ele_order = kDisplayRgbElementOrder;
  panel_config.bits_per_pixel = 16;
  ESP_ERROR_CHECK(esp_lcd_new_panel_st7789(panel_io, &panel_config, &panel));

  esp_lcd_panel_reset(panel);

  esp_lcd_panel_init(panel);
  esp_lcd_panel_invert_color(panel, kDisplayInvertColor);
  esp_lcd_panel_swap_xy(panel, kDisplaySwapXY);
  esp_lcd_panel_mirror(panel, kDisplayMirrorX, kDisplayMirrorY);

  g_display = std::make_unique<Display>(panel_io, panel, kDisplayWidth, kDisplayHeight, 0, 0, kDisplayMirrorX, kDisplayMirrorY, kDisplaySwapXY, kDisplayBacklightPin);
  g_display->Start();
}\n`,true);
} else if (display_type === 'SSD1306') {
  generator.addFunction('esp32ai_InitDisplay',`
void InitDisplay() {
  printf("InitDisplay\\n");
  i2c_master_bus_handle_t display_i2c_bus;
  i2c_master_bus_config_t bus_config = {
      .i2c_port = I2C_NUM_0,
      .sda_io_num = kI2cPinSda,
      .scl_io_num = kI2cPinScl,
      .clk_source = I2C_CLK_SRC_DEFAULT,
      .glitch_ignore_cnt = 7,
      .intr_priority = 0,
      .trans_queue_depth = 0,
      .flags =
          {
              .enable_internal_pullup = 1,
              .allow_pd = false,
          },
  };
  ESP_ERROR_CHECK(i2c_new_master_bus(&bus_config, &display_i2c_bus));

  esp_lcd_panel_io_handle_t panel_io = nullptr;
  esp_lcd_panel_io_i2c_config_t io_config = {
      .dev_addr = 0x3C,
      .on_color_trans_done = nullptr,
      .user_ctx = nullptr,
      .control_phase_bytes = 1,
      .dc_bit_offset = 6,
      .lcd_cmd_bits = 8,
      .lcd_param_bits = 8,
      .flags =
          {
              .dc_low_on_data = 0,
              .disable_control_phase = 0,
          },
      .scl_speed_hz = 400 * 1000,
  };
  ESP_ERROR_CHECK(esp_lcd_new_panel_io_i2c_v2(display_i2c_bus, &io_config, &panel_io));

  esp_lcd_panel_handle_t panel = nullptr;
  esp_lcd_panel_dev_config_t panel_config = {};
  panel_config.reset_gpio_num = -1;
  panel_config.bits_per_pixel = 1;

  esp_lcd_panel_ssd1306_config_t ssd1306_config = {
      .height = static_cast<uint8_t>(kDisplayHeight),
  };
  panel_config.vendor_config = &ssd1306_config;

  ESP_ERROR_CHECK(esp_lcd_new_panel_ssd1306(panel_io, &panel_config, &panel));
  ESP_ERROR_CHECK(esp_lcd_panel_reset(panel));
  ESP_ERROR_CHECK(esp_lcd_panel_init(panel));
  ESP_ERROR_CHECK(esp_lcd_panel_disp_on_off(panel, true));
  g_display = std::make_unique<OledDisplay>(panel_io, panel, kDisplayWidth, kDisplayHeight, kDisplayMirrorX, kDisplayMirrorY);
  g_display->Start();
}\n`,true);
}

  generator.addFunction('esp32ai_PrintMemInfo',`
#ifdef PRINT_HEAP_INFO_INTERVAL
void PrintMemInfo() {
  if (heap_caps_get_total_size(MALLOC_CAP_SPIRAM) > 0) {
    const auto total_size = heap_caps_get_total_size(MALLOC_CAP_SPIRAM);
    const auto free_size = heap_caps_get_free_size(MALLOC_CAP_SPIRAM);
    const auto min_free_size = heap_caps_get_minimum_free_size(MALLOC_CAP_SPIRAM);
    printf("SPIRAM total size: %zu B (%zu KB), free size: %zu B (%zu KB), minimum free size: %zu B (%zu KB)\\n",
           total_size,
           total_size >> 10,
           free_size,
           free_size >> 10,
           min_free_size,
           min_free_size >> 10);
  }

  if (heap_caps_get_total_size(MALLOC_CAP_INTERNAL) > 0) {
    const auto total_size = heap_caps_get_total_size(MALLOC_CAP_INTERNAL);
    const auto free_size = heap_caps_get_free_size(MALLOC_CAP_INTERNAL);
    const auto min_free_size = heap_caps_get_minimum_free_size(MALLOC_CAP_INTERNAL);
    printf("IRAM total size: %zu B (%zu KB), free size: %zu B (%zu KB), minimum free size: %zu B (%zu KB)\\n",
           total_size,
           total_size >> 10,
           free_size,
           free_size >> 10,
           min_free_size,
           min_free_size >> 10);
  }

  if (heap_caps_get_total_size(MALLOC_CAP_DEFAULT) > 0) {
    const auto total_size = heap_caps_get_total_size(MALLOC_CAP_DEFAULT);
    const auto free_size = heap_caps_get_free_size(MALLOC_CAP_DEFAULT);
    const auto min_free_size = heap_caps_get_minimum_free_size(MALLOC_CAP_DEFAULT);
    printf("DRAM total size: %zu B (%zu KB), free size: %zu B (%zu KB), minimum free size: %zu B (%zu KB)\\n",
           total_size,
           total_size >> 10,
           free_size,
           free_size >> 10,
           min_free_size,
           min_free_size >> 10);
  }
}
#endif\n`,true);
  
  generator.addLoopBegin('esp32ai_PrintMemInfo_loop',`
  #ifdef PRINT_HEAP_INFO_INTERVAL
    static uint32_t s_print_heap_info_time = 0;
    if (s_print_heap_info_time == 0 || millis() - s_print_heap_info_time >= PRINT_HEAP_INFO_INTERVAL) {
      s_print_heap_info_time = millis();
      PrintMemInfo();
    }
  #endif\n`);

  generator.addFunction('esp32ai_PlayMp3',`
void PlayMp3(const uint8_t* data, size_t size) {
  auto ret = esp_mp3_dec_register();
  if (ret != ESP_AUDIO_ERR_OK) {
    printf("Failed to register mp3 decoder: %d\\n", ret);
    abort();
  }

  esp_audio_simple_dec_handle_t decoder = nullptr;
  esp_audio_simple_dec_cfg_t audio_dec_cfg{
      .dec_type = ESP_AUDIO_SIMPLE_DEC_TYPE_MP3,
      .dec_cfg = nullptr,
      .cfg_size = 0,
  };
  ret = esp_audio_simple_dec_open(&audio_dec_cfg, &decoder);
  if (ret != ESP_AUDIO_ERR_OK) {
    printf("Failed to open mp3 decoder: %d\\n", ret);
    abort();
  }
  g_audio_output_device->OpenOutput(esp32ai_rate);

  esp_audio_simple_dec_raw_t raw = {
      .buffer = const_cast<uint8_t*>(data),
      .len = size,
      .eos = true,
      .consumed = 0,
      .frame_recover = ESP_AUDIO_SIMPLE_DEC_RECOVERY_NONE,
  };

  uint8_t* frame_data = (uint8_t*)malloc(4096);
  esp_audio_simple_dec_out_t out_frame = {
      .buffer = frame_data,
      .len = 4096,
      .needed_size = 0,
      .decoded_size = 0,
  };

  while (raw.len > 0) {
    const auto ret = esp_audio_simple_dec_process(decoder, &raw, &out_frame);
    if (ret == ESP_AUDIO_ERR_BUFF_NOT_ENOUGH) {
      // Handle output buffer not enough case
      out_frame.buffer = reinterpret_cast<uint8_t*>(realloc(out_frame.buffer, out_frame.needed_size));
      if (out_frame.buffer == nullptr) {
        break;
      }
      out_frame.len = out_frame.needed_size;
      continue;
    }

    if (ret != ESP_AUDIO_ERR_OK) {
      break;
    }

    g_audio_output_device->Write(reinterpret_cast<int16_t*>(out_frame.buffer), out_frame.decoded_size >> 1);
    raw.len -= raw.consumed;
    raw.buffer += raw.consumed;
  }

  free(frame_data);

  g_audio_output_device->CloseOutput();
  esp_audio_simple_dec_close(decoder);
  esp_audio_dec_unregister(ESP_AUDIO_TYPE_MP3);
}\n`,true);

  let fhcode = `
void ConfigureWifi() {
  printf("configure wifi\\n");
  auto wifi_configurator = std::make_unique<WifiConfigurator>(WiFi, kSmartConfigType);

  ESP_ERROR_CHECK(iot_button_register_cb(
      g_button_boot_handle,
      BUTTON_PRESS_DOWN,
      nullptr,
      [](void*, void* data) {
        printf("boot button pressed\\n");
        static_cast<WifiConfigurator*>(data)->StartSmartConfig();
  },
  wifi_configurator.get()));\n`;

  if (display_type !== 'NONE') {
    fhcode = fhcode + `
    g_display->ShowStatus("网络配置中");\n`;
  }

  fhcode = fhcode + `
  PlayMp3(kNotification0mp3, sizeof(kNotification0mp3));

  #if defined(WIFI_SSID) && defined(WIFI_PASSWORD)
    printf("wifi config start with wifi: %s, %s\\n", WIFI_SSID, WIFI_PASSWORD);
    wifi_configurator->Start(WIFI_SSID, WIFI_PASSWORD);
  #else
    printf("wifi config start\\n");
    wifi_configurator->Start();
  #endif

  while (true) {
    const auto state = wifi_configurator->WaitStateChanged();
    if (state == WifiConfigurator::State::kConnecting) {
      printf("wifi connecting\\n");\n`;

  if (display_type !== 'NONE') {
    fhcode = fhcode + `
  g_display->ShowStatus("网络连接中");\n`;
  }

  fhcode = fhcode + `
  } else if (state == WifiConfigurator::State::kSmartConfiguring) {
        printf("wifi smart configuring\\n");\n`;

  if (display_type !== 'NONE') {
    fhcode = fhcode + `
    g_display->ShowStatus("配网模式");\n`;
  }

  fhcode = fhcode + `
  PlayMp3(kNetworkConfigModeMp3, sizeof(kNetworkConfigModeMp3));
    } else if (state == WifiConfigurator::State::kFinished) {
      break;
    }
  }

  iot_button_unregister_cb(g_button_boot_handle, BUTTON_PRESS_DOWN, nullptr);

  printf("wifi connected\\n");
  printf("- mac address: %s\\n", WiFi.macAddress().c_str());
  printf("- bssid:       %s\\n", WiFi.BSSIDstr().c_str());
  printf("- ssid:        %s\\n", WiFi.SSID().c_str());
  printf("- ip:          %s\\n", WiFi.localIP().toString().c_str());
  printf("- gateway:     %s\\n", WiFi.gatewayIP().toString().c_str());
  printf("- subnet mask: %s\\n", WiFi.subnetMask().toString().c_str());\n`;

  if (display_type !== 'NONE') {
    fhcode = fhcode + ` g_display->ShowStatus("网络已连接");\n`;
  }
  fhcode = fhcode + ` PlayMp3(kNetworkConnectedMp3, sizeof(kNetworkConnectedMp3));\n}`;

  generator.addFunction('esp32ai_ConfigureWifi',fhcode,true);
  
  let initCode = `
#if AUDIO_INPUT_DEVICE_TYPE == AUDIO_INPUT_DEVICE_TYPE_I2S_STD
  auto audio_input_device = std::make_shared<ai_vox::AudioInputDeviceI2sStd>(kMicPinSck, kMicPinWs, kMicPinSd);
#elif AUDIO_INPUT_DEVICE_TYPE == AUDIO_INPUT_DEVICE_TYPE_PDM
  auto audio_input_device = std::make_shared<ai_vox::PdmAudioInputDevice>(kMicPinSck, kMicPinSd);
#endif\n`;

  if (es8311mr === 'true' || es8388pd === 'true') {
    initCode = ``;
  }

  if (display_type !== 'NONE') {
    initCode = initCode + `
  InitDisplay();
  g_display->ShowStatus("初始化");\n`;
  }

  initCode = initCode + `
  ConfigureWifi();\n`;
  //generator.addSetup('esp32ai_start_engine_setupbegin', initCode);

  let setcode = initCode + `\nprintf("engine starting\\n");\n`;

  if (display_type !== 'NONE') {
    setcode = setcode + `
  g_display->ShowStatus("AI引擎启动中");\n`;
  }

  if (es8311mr === 'true' || es8388pd === 'true') {
    setcode = setcode + `
  ai_vox_engine.Start(g_audio_output_device, g_audio_output_device);\nprintf("engine started\\n");\n`;
  } else {
    setcode = setcode + `
  ai_vox_engine.Start(audio_input_device, g_audio_output_device);\nprintf("engine started\\n");\n`;
  }

  if (display_type !== 'NONE') {
    setcode = setcode + `
  g_display->ShowStatus("AI引擎已启动");\n`;
  }
  //generator.addSetup('esp32ai_start_engine_setup', setcode);

  return setcode;
};

Arduino.forBlock['aivox_config_ota_url'] = function (block, generator) {
    let ota_url = generator.valueToCode(block, 'ai_vox_ota_url', generator.ORDER_ATOMIC) || '""';
    generator.addObject(`aivox_observer`, `std::shared_ptr<ai_vox::Observer> g_observer = std::make_shared<ai_vox::Observer>();`, true);
    generator.addObject('ai_vox_engine', `auto& ai_vox_engine = ai_vox::Engine::GetInstance();`, true);
    generator.addSetupBegin(`aivox_instance`, `ai_vox_engine.SetObserver(g_observer);\n`, true);
    let code = `ai_vox_engine.SetOtaUrl(${ota_url});\n`;
    return code;
};

Arduino.forBlock['aivox_config_websocket'] = function (block, generator) {
    let websocket_url = generator.valueToCode(block, 'ai_vox_websocket_url', generator.ORDER_ATOMIC) || '""';
    let websocket_param = generator.valueToCode(block, 'ai_vox_websocket_param', generator.ORDER_ATOMIC) || '""';
    websocket_param = websocket_param.substring(1, websocket_param.length - 1);
    generator.addObject('ai_vox_engine', `auto& ai_vox_engine = ai_vox::Engine::GetInstance();`, true);
    generator.addSetupBegin(`aivox_instance`, `ai_vox_engine.SetObserver(g_observer);\n`, true);
    let code = `ai_vox_engine.ConfigWebsocket(${websocket_url}, ${websocket_param});\n`;
    return code;
};

Arduino.forBlock['aivox_display_mode'] = function(block, generator) {
    display_mode = block.getFieldValue('display_mode');
    // generator.addObject('lcd_display_mode', `String display_mode = ${display_mode};`, true);
    return '';
};

Arduino.forBlock['aivox3_set_es8311_volume'] = function(block, generator) {
    const aivox3_es8311_volume = generator.valueToCode(block, 'aivox3_es8311_volume', generator.ORDER_ATOMIC) || '""';
    // generator.addSetup("aivox3_setup_es8311", `  g_audio_device_es8311 = std::make_shared<ai_vox::AudioDeviceEs8311>(g_i2c_master_bus_handle, ${es8311_i2c_address}, I2C_NUM_1, ${es8311_rate}, GPIO_NUM_${es8311_mclk}, GPIO_NUM_${es8311_sclk}, GPIO_NUM_${es8311_lrck}, GPIO_NUM_${es8311_dsdout}, GPIO_NUM_${es8311_dsdin});`);
    return `g_audio_output_device->set_volume(${aivox3_es8311_volume});\n`;
};

Arduino.forBlock['aivox3_set_screen_light'] = function(block, generator) {
    aivox3_screen_light = generator.valueToCode(block, 'aivox3_screen_light', generator.ORDER_ATOMIC) || '""';
    // generator.addSetup("aivox3_setup_es8311", `  g_audio_device_es8311 = std::make_shared<ai_vox::AudioDeviceEs8311>(g_i2c_master_bus_handle, ${es8311_i2c_address}, I2C_NUM_1, ${es8311_rate}, GPIO_NUM_${es8311_mclk}, GPIO_NUM_${es8311_sclk}, GPIO_NUM_${es8311_lrck}, GPIO_NUM_${es8311_dsdout}, GPIO_NUM_${es8311_dsdin});`);
    return ``;
};

// 实现esp32ai_selget_mcp_control块的代码生成逻辑
Arduino.forBlock['esp32ai_selget_mcp_control'] = function(block, generator) {
  // 获取MCP服务名称
  // 对于field_variable类型的字段，使用getText()方法获取显示的变量名称
  const varField = block.getField('VAR');
  const serviceName = varField ? varField.getText() : 'unknown_service';

  // 获取设置区和上报区的代码，先检查输入是否存在
  const setCodeBlock = block.getInput('setCODE_BLOCK') ? (generator.statementToCode(block, 'setCODE_BLOCK') || '') : '';
  const reportCodeBlock = block.getInput('CODE_BLOCK') ? (generator.statementToCode(block, 'CODE_BLOCK') || '') : '';
  
  // 获取该MCP服务的所有参数
  const params = getMcpServiceParams(serviceName);
  
  let code = '';
  let setCode = '';
  let getCode = '';
  
  // 设置区有代码时生成设置逻辑
  if (setCodeBlock.trim() !== '') {
    // 生成设置区代码块
    setCode += `  // 设置区代码\n`;
    setCode += `  ${setCodeBlock.trim()}\n`;
    setCode += `  // 告知MCP服务器设置成功\n`;
    setCode += `  ai_vox_engine.SendMcpCallResponse(id, true);\n`;
  }
  
  // 生成上报区代码块 - 无论是否有上报代码，都生成上报逻辑
  // 生成参数声明
if (reportCodeBlock.trim() !== '') {
  if (params.length > 0) {
    getCode += `  // 参数声明区\n`;
    params.forEach(paramName => {
      // 根据参数类型生成不同的声明
      const param = getMcpControlParam(paramName);
      if (param) {
        if (param.type === 'Boolean') {
          getCode += `  bool ${paramName} = false;\n`;
        } else if (param.type === 'Number') {
          getCode += `  int64_t ${paramName} = 0;\n`;
        } else if (param.type === 'String') {
          // 使用Arduino String类型，避免与std::string转换冲突
          getCode += `  String ${paramName} = "";\n`;
        }
      } else {
        // 默认使用int64_t类型
        getCode += `  int64_t ${paramName} = 0;\n`;
      }
    });
  }
  
  // 生成上报区代码
    getCode += `  // 上报区代码\n`;
    getCode += `  ${reportCodeBlock.trim()}\n`;
  
  // 根据参数数量生成不同的上报格式
  if (params.length === 1) {
    // 单个参数时，直接参数上报
    const paramName = params[0];
    const param = getMcpControlParam(paramName);
    getCode += `  // 单个参数，直接上报\n`;
    if (param && param.type === 'String') {
      // 将Arduino String转换为std::string
      getCode += `  ai_vox_engine.SendMcpCallResponse(id, std::string(${paramName}.c_str()));\n`;
    } else {
      // 其他类型直接传递
      getCode += `  ai_vox_engine.SendMcpCallResponse(id, ${paramName});\n`;
    }
  } else if (params.length > 1) {
    // 多个参数时，生成json上报
    getCode += `  // 多个参数，生成JSON上报\n`;
    getCode += `  cJSON *root = cJSON_CreateObject();\n`;
    
    // 添加每个参数到JSON对象
    params.forEach(paramName => {
      // 根据参数类型生成不同的cJSON创建函数调用
      const param = getMcpControlParam(paramName);
      if (param) {
        if (param.type === 'Boolean') {
          getCode += `  cJSON_AddItemToObject(root, "${paramName}", cJSON_CreateBool(${paramName}));\n`;
        } else if (param.type === 'Number') {
          getCode += `  cJSON_AddItemToObject(root, "${paramName}", cJSON_CreateNumber(${paramName}));\n`;
        } else if (param.type === 'String') {
          getCode += `  cJSON_AddItemToObject(root, "${paramName}", cJSON_CreateString(${paramName}.c_str()));\n`;
        }
      } else {
        // 默认作为数值处理
        getCode += `  cJSON_AddItemToObject(root, "${paramName}", cJSON_CreateNumber(${paramName}));\n`;
      }
    });
    
    // 生成JSON字符串并上报
    getCode += `  char *json_str = cJSON_PrintUnformatted(root);\n`;
    getCode += `  ai_vox_engine.SendMcpCallResponse(id, std::string(json_str));\n`;
    getCode += `  cJSON_Delete(root);\n`;
    getCode += `  free(json_str);\n`;
  } else {
    // 没有参数时，仅上报执行结果
    getCode += `  // 没有参数，仅上报执行结果\n`;
    getCode += `  ai_vox_engine.SendMcpCallResponse(id, true);\n`;
  }
}
  
  // 引入cJSON头文件（如果需要）- 只有在生成了需要cJSON的上报代码时才引入
  if (reportCodeBlock.trim() !== '' && params.length > 1) {
    generator.addLibrary('cjson_lib', '#include "kljxgwj/cjsonk/cJSON.h"');
  }
  
  // 生成if-else if结构
  if (setCode && getCode) {
    // 同时有set和get代码，生成if-else if结构
    code += `if ("self.${serviceName}.set" == name) {\n`;
    code += setCode;
    code += `} else if ("self.${serviceName}.get" == name) {\n`;
    code += getCode;
    code += `}\n`;
  } else if (setCode) {
    // 只有set代码
    code += `if ("self.${serviceName}.set" == name) {\n`;
    code += setCode;
    code += `}\n`;
  } else if (getCode) {
    // 只有get代码
    code += `if ("self.${serviceName}.get" == name) {\n`;
    code += getCode;
    code += `}\n`;
  }
  
  return code;
};

Arduino.forBlock['aivox3_ST77789TurnOnBacklight_engine'] = function (block, generator) {
    return 'g_display->TurnOnBacklight();\n';
};

Arduino.forBlock['aivox3_ST77789TurnOffBacklight_engine'] = function (block, generator) {
    return 'g_display->TurnOffBacklight();\n';
};

//唤醒
Arduino.forBlock['esp32ai_wake_engine'] = function(block, generator) {
    return `ai_vox::Engine::GetInstance().Advance();\n`;
};

// 主动发送消息
Arduino.forBlock['esp32ai_sendtext'] = function(block, generator) {
  let sendmessage = generator.valueToCode(block, 'sendmessage', generator.ORDER_ATOMIC) || '""';
  let code = '';

  // 1. 移除不必要的括号（如果是括号包裹的表达式）
  const isParenthesized = /^\((.*)\)$/.test(sendmessage);
  if (isParenthesized) {
    sendmessage = sendmessage.match(/^\((.*)\)$/)[1];
  }

  generator.addObject('ai_vox_engine', `auto& ai_vox_engine = ai_vox::Engine::GetInstance();`, true);
  generator.addObject('esp32aicurrentState', `ai_vox::ChatState esp32aicurrentState = ai_vox_engine.GetCurrentState();`, true);

  // 2. 判断是否为 带引号的字符串字面量 或 已调用.c_str() 或 const char* 类型
  const isQuotedString = /^"(.*)"$/.test(sendmessage);
  const isAlreadyCStr = /\.c_str\(\)$/.test(sendmessage);
  const isConstCharPtr = /^\s*message\s*$/.test(sendmessage) || /^\s*emotion\.c_str\(\)\s*$/.test(sendmessage);
  // 匹配整数（正负）、浮点数（正负、小数、科学计数法）
  const isNumber = /^-?\d+(\.\d+)?([eE][-+]?\d+)?$/.test(sendmessage.trim());

  // 3. 构建正确的 JSON 字符串（使用 Arduino String 类拼接，避免引号冲突）
  let sendTextCode = '';
  const jsonPrefix = "{\\\"type\\\": \\\"listen\\\", \\\"state\\\": \\\"detect\\\", \\\"text\\\": \\\"";
  const jsonSuffix = "\\\"}";

  if (isQuotedString || isAlreadyCStr || isConstCharPtr) {
    // 情况1：sendmessage 是带引号字面量/已转c_str/const char*
    if (isQuotedString) {
      // 移除 sendmessage 自带的双引号
      const innerText = sendmessage.replace(/^"(.*)"$/, '$1');
      // 直接拼接为 std::string，无需 Arduino String
      sendTextCode = `ai_vox_engine.SendText(std::string("${jsonPrefix}") + "${innerText}" + std::string("${jsonSuffix}"));\n`;
    } else {
      // 非字符串字面量，拼接为 std::string
      sendTextCode = `ai_vox_engine.SendText(std::string("${jsonPrefix}") + ${sendmessage} + std::string("${jsonSuffix}"));\n`;
    }
  } else if (isNumber) {
    // 情况2：数字类型（自动转文本）
    // 区分整数和浮点数，适配 std::to_string（整数）和 String（浮点数，兼容更多场景）
    sendTextCode = `ai_vox_engine.SendText(std::string("${jsonPrefix}") + String(${sendmessage}).c_str() + std::string("${jsonSuffix}"));\n`;
  } else {
    // 情况2：sendmessage 是 Arduino String 类型，先转 c_str() 再构建 std::string
    sendTextCode = `ai_vox_engine.SendText(std::string("${jsonPrefix}") + ${sendmessage}.c_str() + std::string("${jsonSuffix}"));\n`;
  }
  
  code = `// 获取当前设备状态
  esp32aicurrentState = ai_vox_engine.GetCurrentState();
  
  // 如果设备状态不是kListening，先执行唤醒操作
  if (esp32aicurrentState != ai_vox::ChatState::kListening) {
    // 执行唤醒
    ai_vox::Engine::GetInstance().Advance();
    
    // 等待设备状态变为kListening，最多等待6秒
    unsigned long startTime = millis();
    bool listeningStateReached = false;
    while (millis() - startTime < 6000) {
      esp32aicurrentState = ai_vox_engine.GetCurrentState();
      if (esp32aicurrentState == ai_vox::ChatState::kListening) {
        listeningStateReached = true;
        break;
      }
      delay(100); // 每隔100ms检查一次状态
    }
    
    // 如果6秒内没有进入kListening状态，直接结束
    if (!listeningStateReached) {
      // 核心修改：移除break（原大括号内的break无意义，现在直接返回/终止逻辑）
      return;
    }
    
    // 核心修改2：将阻塞delay(1000)替换为非阻塞等待
    unsigned long waitStartTime = millis();
    bool waitCompleted = false;
    while (!waitCompleted) {
      // 检查是否已等待1000毫秒
      if (millis() - waitStartTime >= 1000) {
        waitCompleted = true;
      }
      // 等待过程中持续检查设备状态，确保仍处于kListening
      esp32aicurrentState = ai_vox_engine.GetCurrentState();
      if (esp32aicurrentState != ai_vox::ChatState::kListening) {
        // 状态异常，终止等待
        return;
      }
      // 短暂延时，避免占用过多CPU资源
      delayMicroseconds(100);
    }
  }
  
  // 执行发送文本操作
  ${sendTextCode}\n`;

  return code;
};

Arduino.forBlock['aivox_lcd_show_status'] = function (block, generator) {
  generator.addObject(`chat_message_role`, `std::string chatRole;`, true);
  let location = block.getFieldValue('location');
  let ai_vox_content = generator.valueToCode(block, 'ai_vox_content', generator.ORDER_ATOMIC) || '""';
  let code = '';

  // 定义合法的const char*类型标识（无需添加.c_str()）
  const isQuotedString = /^"(.*)"$/.test(ai_vox_content);
  const isCharLiteral = /^'(.)'$/.test(ai_vox_content);
  const isAlreadyCStr = /\.c_str\(\)$/.test(ai_vox_content);
  const isConstCharPtr = /^\s*\(?\s*message\s*\)?\s*$/.test(ai_vox_content) || /^\s*\(?\s*emotion\.c_str\(\)\s*\)?\s*$/.test(ai_vox_content);

  // 合法const char*类型集合
  const isLegalConstCharPtr = isQuotedString || isCharLiteral || isAlreadyCStr || isConstCharPtr;

  // ========== 核心修改：统一处理非合法const char*类型（包括数值变量、数字字面量、表达式） ==========
  let finalContent = ai_vox_content;
  if (!isLegalConstCharPtr) {
    // 所有非合法const char*的内容，统一用String包裹后再取.c_str()
    // 包括：int变量（hjld）、数字字面量（123）、数值表达式（a+b）等
    finalContent = `String(${ai_vox_content}).c_str()`;
  }
  // 字符字面量单独转换为字符串字面量
  if (isCharLiteral) {
    const charValue = ai_vox_content.match(/^'(.)'$/)[1];
    finalContent = `"${charValue}"`;
  }

  // 处理不同显示类型和位置的代码生成
  if (location == 'SetChatMessage') {
    if (display_mode == '' || display_mode == 'normal') {
      if (display_type === 'ST7789') {
        code = `g_display->SetChatMessage(Display::Role::kSystem, ${finalContent});\n`;
      } else if (display_type === 'SSD1306') {
        code = `g_display->SetChatMessage(${finalContent});\n`;
      }
    } else {
      if (display_type === 'ST7789') {
        code = `if(chatRole == "Assistant"){ 
        g_display->SetChatMessage(Display::Role::kAssistant, ${finalContent}); 
      }else if(chatRole == "User"){ 
        g_display->SetChatMessage(Display::Role::kUser, ${finalContent}); 
      }else{  
        g_display->SetChatMessage(Display::Role::kSystem, ${finalContent}); 
      }
      chatRole = "System";\n`;
      } else if (display_type === 'SSD1306') {
        code = `if(chatRole == "Assistant"){ 
        g_display->SetChatMessage(${finalContent}); 
      }else if(chatRole == "User"){ 
        g_display->SetChatMessage(${finalContent}); 
      }else{  
        g_display->SetChatMessage(${finalContent}); 
      }\n`;
      }
    }
  } else {
    if (display_type !== 'NONE') {
      code = `g_display->${location}(${finalContent});\n`;
    }
  }

  return code;
};

var eventHandlers = {};// 定义存储事件处理器的对象
//状态变化事件
Arduino.forBlock['esp32ai_state_change_root'] = function(block, generator) {
  const key = "HandleStateChangedEvent";
    if (!eventHandlers[key]) {
        eventHandlers[key] = {
            condition: 'auto state_changed_event = std::get_if<ai_vox::StateChangedEvent>(&event)',
            action: 'HandleStateChangedEvent(*state_changed_event)'
        };
    }
    // 获取子块（状态判断逻辑）的代码
    const stateHandlersCode = generator.statementToCode(block, 'STATE_HANDLERS');

    // 1. 引入必要头文件
    generator.addLibrary('include_aivox_engine', '#include "ai_vox_engine.h"');

    // 2. 定义并初始化观察者（全局唯一）
    generator.addObject(`aivox_observer`, `std::shared_ptr<ai_vox::Observer> g_observer = std::make_shared<ai_vox::Observer>();`, true);
    
    // 3. 设置观察者（在 setup 中执行）
    generator.addSetup(`aivox_set_observer`, `
    // 将观察者设置到 AI 引擎
    ai_vox::Engine::GetInstance().SetObserver(g_observer);
`, true);

    // 4. 实现状态变化事件处理器函数
    generator.addFunction(`HandleStateChangedEvent`, `
void HandleStateChangedEvent(const ai_vox::StateChangedEvent& event) {
    // 提取当前状态
    auto currentState = event.new_state;
    
    // 根据当前状态执行相应的处理逻辑
    switch (currentState) {
        ${stateHandlersCode}
        default:
            break;
    }
}
`);
  let handlers = Object.values(eventHandlers);
  let result = "";
  handlers.forEach((handler, index) => {
    if (index === 0) {
      result += `if (${handler.condition}) {\n  ${handler.action};\n`;
    } else {
      result += ` } else if (${handler.condition}) {\n  ${handler.action};\n`;
    }
  });
    
    // 添加最后的闭合括号
  result += " }";
    // 5. 在主循环中添加事件处理逻辑
    // 我们不再使用事件映射表，而是直接在这里生成分发代码
    generator.addLoop('esp32ai_event_loop', `
  // 从观察者获取并处理所有待处理事件
  if (g_observer) {
    const auto events = g_observer->PopEvents();
    for (const auto& event : events) {
      ${result}
    }
  }
`, true);

    return '';
};

//状态选择子事件
Arduino.forBlock['esp32ai_state_change_case'] = function(block, generator) {
    const stateValue = block.getFieldValue('STATE');
    const doCode = generator.statementToCode(block, 'DO');
    let code = `case ai_vox::ChatState::${stateValue}:\n`;
    
    if (doCode) {
        code += generator.prefixLines(doCode, generator.INDENT);
    }
    code += generator.INDENT + '  break;\n';

    return code;
};

// --- Event Loop ---
Arduino.forBlock['esp32ai_loop_activation'] = function(block, generator) {
  const key = "HandleActivationEvent";
    if (!eventHandlers[key]) {
        eventHandlers[key] = {
            condition: 'auto activation_event = std::get_if<ai_vox::ActivationEvent>(&event)',
            action: 'HandleActivationEvent(*activation_event)'
        };
    }
    // 获取子块（状态判断逻辑）的代码
    const stateHandlersCode = generator.statementToCode(block, 'STATE_HANDLERS');

    // 1. 引入必要头文件
    generator.addLibrary('include_aivox_engine', '#include "ai_vox_engine.h"');

    // 2. 定义并初始化观察者（全局唯一）
    generator.addObject(`aivox_observer`, `std::shared_ptr<ai_vox::Observer> g_observer = std::make_shared<ai_vox::Observer>();`, true);
    
    // 3. 设置观察者（在 setup 中执行）
    generator.addSetup(`aivox_set_observer`, `
    // 将观察者设置到 AI 引擎
    ai_vox::Engine::GetInstance().SetObserver(g_observer);
`, true);

    // 4. 实现状态变化事件处理器函数
    generator.addFunction(`HandleActivationEvent`, `
void HandleActivationEvent(const ai_vox::ActivationEvent& event) {
    const char* code = event.code.c_str();
    const char* message = event.message.c_str();
    ${stateHandlersCode}
}
`);
  let handlers = Object.values(eventHandlers);
  let result = "";
  handlers.forEach((handler, index) => {
    if (index === 0) {
      result += `if (${handler.condition}) {\n  ${handler.action};\n`;
    } else {
      result += ` } else if (${handler.condition}) {\n  ${handler.action};\n`;
    }
  });
    
    // 添加最后的闭合括号
  result += " }";
    // 5. 在主循环中添加事件处理逻辑
    // 我们不再使用事件映射表，而是直接在这里生成分发代码
    generator.addLoop('esp32ai_event_loop', `
  // 从观察者获取并处理所有待处理事件
  if (g_observer) {
    const auto events = g_observer->PopEvents();
    for (const auto& event : events) {
      ${result}
    }
  }
`, true);

    return '';
};

Arduino.forBlock['get_aivox_activation_message'] = function(block, generator) {  
  const activation_type = block.getFieldValue('activation_type');
  let code = `${activation_type}`;
  return [code, Arduino.ORDER_MEMBER]; 
}

Arduino.forBlock['esp32ai_loop_emotion'] = function(block, generator) {
  const key = "HandleEmotionEvent";
    if (!eventHandlers[key]) {
        eventHandlers[key] = {
            condition: 'auto emotion_event = std::get_if<ai_vox::EmotionEvent>(&event)',
            action: 'HandleEmotionEvent(*emotion_event)'
        };
    }
    // 获取子块（状态判断逻辑）的代码
    const stateHandlersCode = generator.statementToCode(block, 'STATE_HANDLERS');

    // 1. 引入必要头文件
    generator.addLibrary('include_aivox_engine', '#include "ai_vox_engine.h"');

    // 2. 定义并初始化观察者（全局唯一）
    generator.addObject(`aivox_observer`, `std::shared_ptr<ai_vox::Observer> g_observer = std::make_shared<ai_vox::Observer>();`, true);
    
    // 3. 设置观察者（在 setup 中执行）
    generator.addSetup(`aivox_set_observer`, `
    // 将观察者设置到 AI 引擎
    ai_vox::Engine::GetInstance().SetObserver(g_observer);
`, true);

    // 4. 实现状态变化事件处理器函数
    generator.addFunction(`HandleEmotionEvent`, `
void HandleEmotionEvent(const ai_vox::EmotionEvent& event) {
    auto&& emotion = event.emotion;
    ${stateHandlersCode}
}
`);
  let handlers = Object.values(eventHandlers);
  let result = "";
  handlers.forEach((handler, index) => {
    if (index === 0) {
      result += `if (${handler.condition}) {\n  ${handler.action};\n`;
    } else {
      result += ` } else if (${handler.condition}) {\n  ${handler.action};\n`;
    }
  });
    
    // 添加最后的闭合括号
  result += " }";
    // 5. 在主循环中添加事件处理逻辑
    // 我们不再使用事件映射表，而是直接在这里生成分发代码
    generator.addLoop('esp32ai_event_loop', `
  // 从观察者获取并处理所有待处理事件
  if (g_observer) {
    const auto events = g_observer->PopEvents();
    for (const auto& event : events) {
      ${result}
    }
  }
`, true);

    return '';
};

Arduino.forBlock['get_aivox_emotion_result'] = function(block, generator) {
  code = `emotion.c_str()`; 
  return [code, Arduino.ORDER_MEMBER]; 
};

// 
Arduino.forBlock['aivox_emotion'] = function(block, generator) {
  const emotion = block.getFieldValue('emotion');

  // const emotion = block.getFieldValue('emotion');
  let code = `emotion == "${emotion}"`;
  return [code, Arduino.ORDER_MEMBER]; 
};

Arduino.forBlock['aivox_emotion_list'] = function(block, generator) {
  const emotion = block.getFieldValue('emotion');
  let code = `"${emotion}"`;
  return [code, Arduino.ORDER_MEMBER]; 
};

Arduino.forBlock['esp32ai_loop_chat_message'] = function(block, generator) {
  const key = "HandleChatMessageEvent";
    if (!eventHandlers[key]) {
        eventHandlers[key] = {
            condition: 'auto chat_message_event = std::get_if<ai_vox::ChatMessageEvent>(&event)',
            action: 'HandleChatMessageEvent(*chat_message_event)'
        };
    }
    // 获取子块（状态判断逻辑）的代码
    const stateHandlersCode = generator.statementToCode(block, 'STATE_HANDLERS');

    // 1. 引入必要头文件
    generator.addLibrary('include_aivox_engine', '#include "ai_vox_engine.h"');

    // 2. 定义并初始化观察者（全局唯一）
    generator.addObject(`aivox_observer`, `std::shared_ptr<ai_vox::Observer> g_observer = std::make_shared<ai_vox::Observer>();`, true);
    
    // 3. 设置观察者（在 setup 中执行）
    generator.addSetup(`aivox_set_observer`, `
    // 将观察者设置到 AI 引擎
    ai_vox::Engine::GetInstance().SetObserver(g_observer);
`, true);

    // 4. 实现状态变化事件处理器函数
    generator.addFunction(`HandleChatMessageEvent`, `
void HandleChatMessageEvent(const ai_vox::ChatMessageEvent& event) {
    auto role = event.role;
    auto message = event.content;
    if (role == ai_vox::ChatRole::kAssistant) {
      chatRole = "Assistant";
    } else if (role == ai_vox::ChatRole::kUser) {
      chatRole = "User";
    } else {
      chatRole = "System";
    }
    ${stateHandlersCode}
}
`);
  let handlers = Object.values(eventHandlers);
  let result = "";
  handlers.forEach((handler, index) => {
    if (index === 0) {
      result += `if (${handler.condition}) {\n  ${handler.action};\n`;
    } else {
      result += ` } else if (${handler.condition}) {\n  ${handler.action};\n`;
    }
  });
    
    // 添加最后的闭合括号
  result += " }";
    // 5. 在主循环中添加事件处理逻辑
    // 我们不再使用事件映射表，而是直接在这里生成分发代码
    generator.addLoop('esp32ai_event_loop', `
  // 从观察者获取并处理所有待处理事件
  if (g_observer) {
    const auto events = g_observer->PopEvents();
    for (const auto& event : events) {
      ${result}
    }
  }
`, true);

    return '';
};

Arduino.forBlock['aivox_loop_chat_message_role_var'] = function(block, generator) {
    let chat_role = block.getFieldValue("chat_role");
    // if (!service) {
    //     console.warn(`not found ${varName}`);
    // }
  let code = `role == ai_vox::ChatRole::k${chat_role}`;
  return [code, Arduino.ORDER_MEMBER]; 
};

Arduino.forBlock['aivox_loop_chat_message_msg_var'] = function(block, generator) {
  let message = `message.c_str()`;
  return [message, Arduino.ORDER_MEMBER]; 
};

Arduino.forBlock['esp32ai_loop_mcp'] = function(block, generator) {
  const key = "HandleMcpToolCallEvent";
    if (!eventHandlers[key]) {
        eventHandlers[key] = {
            condition: 'auto mcp_tool_call_event = std::get_if<ai_vox::McpToolCallEvent>(&event)',
            action: 'HandleMcpToolCallEvent(*mcp_tool_call_event)'
        };
    }
    // 获取子块（状态判断逻辑）的代码
    let stateHandlersCode = generator.statementToCode(block, 'STATE_HANDLERS');

    // 1. 引入必要头文件
    generator.addLibrary('include_aivox_engine', '#include "ai_vox_engine.h"');

    // 2. 定义并初始化观察者（全局唯一）
    generator.addObject(`aivox_observer`, `std::shared_ptr<ai_vox::Observer> g_observer = std::make_shared<ai_vox::Observer>();`, true);
    
    // 3. 设置观察者（在 setup 中执行）
    generator.addSetup(`aivox_set_observer`, `
    // 将观察者设置到 AI 引擎
    ai_vox::Engine::GetInstance().SetObserver(g_observer);
`, true);

    // 4. 处理状态处理器代码，将多个独立的if语句转换为if-else if结构
    // 匹配所有的独立if语句，例如：if ("self.led.set" == name) {
    const ifRegex = /^\s*if\s*\(("self\.[^\.]+\.(set|get)")\s*==\s*name\)\s*\{/gm;
    const matches = [];
    let match;
    
    // 收集所有if语句的条件
    while ((match = ifRegex.exec(stateHandlersCode)) !== null) {
        matches.push(match[0]);
    }
    
    // 如果有多个独立的if语句，转换为if-else if结构
    if (matches.length > 1) {
        let processedCode = stateHandlersCode;
        for (let i = 1; i < matches.length; i++) {
            // 将后续的if语句替换为else if
            processedCode = processedCode.replace(matches[i], matches[i].replace('if', 'else if'));
        }
        stateHandlersCode = processedCode;
    }

    // 5. 实现状态变化事件处理器函数
    generator.addFunction(`HandleMcpToolCallEvent`, `
void HandleMcpToolCallEvent(const ai_vox::McpToolCallEvent& event) {
    auto id = event.id;
    auto name = event.name;
    ${stateHandlersCode}
}
`);
  let handlers = Object.values(eventHandlers);
  let result = "";
  handlers.forEach((handler, index) => {
    if (index === 0) {
      result += `if (${handler.condition}) {\n  ${handler.action};\n`;
    } else {
      result += ` } else if (${handler.condition}) {\n  ${handler.action};\n`;
    }
  });
    
    // 添加最后的闭合括号
  result += " }";
    // 5. 在主循环中添加事件处理逻辑
    // 我们不再使用事件映射表，而是直接在这里生成分发代码
    generator.addLoop('esp32ai_event_loop', `
  // 从观察者获取并处理所有待处理事件
  if (g_observer) {
    const auto events = g_observer->PopEvents();
    for (const auto& event : events) {
      ${result}
    }
  }
`, true);

    return '';
}

// --- Event Checks and Data Getters ---
// Helper function to get the variable name for the current event type
function getEventVarName(block) {
    let parent = block.getParent();
    while (parent) {
        if (parent.type === 'aivox_event_is_activation') return 'activation_event';
        if (parent.type === 'aivox_event_is_state_change') return 'state_changed_event';
        if (parent.type === 'aivox_event_is_emotion') return 'emotion_event';
        if (parent.type === 'aivox_event_is_chat_message') return 'chat_message_event';
        if (parent.type === 'aivox_event_is_iot_message') return 'iot_message_event';
        parent = parent.getParent();
    }
    return null; // Should not happen if blocks are used correctly
}

Arduino.forBlock['aivox_mcp_register_control_command'] = function(block, generator) {
    let mcp_control_name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
    if (mcp_control_name === '""') {
        return '';
    }
    // Get the selected mode from the dropdown
    const mode = block.getFieldValue('MODE') || 'regular';
    
    // 获取到的数据为 "led", "LED, true for on, false for off"格式, 需要提取变量名和描述
    // 使用正则表达式来正确解析，避免描述中的逗号影响分割
    let match = mcp_control_name.match(/"([^"]+)",\s*"([^"]+)"/);
    // let match = mcp_control_name.match(/"([^"]*)",\s*"([^"]*)"",\s*(\d+)/);
    let name = match ? match[1] : '';
    let description = match ? match[2] : '';
    // let count = match ? match[3] : 1;
    let control_name_set = "self." + name + ".set";
    let control_name_get = "self." + name + ".get";
    console.log('Selected mode:', mode);

    console.log('mcp_control_name:', mcp_control_name);
    console.log('mcp_control_name match:', match);
    console.log('Extracted name:', name);
    console.log('Extracted description:', description);
    // console.log('Extracted count:', count);
// count
    let paramValues = [];
    // 遍历所有的参数输入
    for (let i = 0; i < block.inputList.length; i++) {
        const input = block.inputList[i];
        if (input.type === Blockly.INPUT_VALUE && input.name.startsWith('INPUT')) {
            const paramCode = generator.valueToCode(block, input.name, generator.ORDER_ATOMIC);
            if (paramCode) {
                paramValues.push(paramCode);
            }
        }
    }

    console.log('Parameter Values:', paramValues);

    let paramCodes = '';
    const paramNames = [];
    if (paramValues.length > 0) {
        paramCodes = paramValues.map(param => `{${param}},`).join('\n                        ');
        
        // 从paramValues中提取参数名称，建立服务与参数的映射关系
        paramValues.forEach(paramCode => {
            // 匹配参数代码中的参数名称，例如匹配 "\"state_sf\", ai_vox::ParamSchema<bool>{.default_value = std::nullopt}," 中的 "state_sf"
            const paramNameMatch = paramCode.match(/\"([^"]+)\"/);
            if (paramNameMatch) {
                const paramName = paramNameMatch[1];
                paramNames.push(paramName);
                // 注册MCP服务与参数的关联关系
                registerMcpServiceParam(name, paramName);
            }
        });
    } else {
        paramCodes = '';
    }

    // 先删除旧的服务，然后重新注册
    if (name !== 'led') {
        deleteAivoxControlService(name);
    }
    // 注册新服务
    registerAivoxControlService(name, description, paramNames);
    
    // 先删除旧的参数映射关系
    deleteMcpServiceParams(name);
    
    // 然后添加新的参数映射关系
    paramNames.forEach(paramName => {
        // 注册MCP服务与参数的关联关系
        registerMcpServiceParam(name, paramName);
    });

    generator.addObject('ai_vox_engine', `auto& ai_vox_engine = ai_vox::Engine::GetInstance();`, true);
    generator.addSetupbegin(`aivox_instance`, `ai_vox_engine.SetObserver(g_observer);\n`, true);
    // generator.addObject(`ai_vox_mcp_${name}_count`, `int ${name}_count = ${count};`, true);
    
    // Generate code based on the selected mode
    if (mode === 'regular' || mode === 'set_only') {
        // Generate set method code
        generator.addSetupBegin(`aivox_add_mcp_tool_set_${name}`, `  ai_vox_engine.AddMcpTool("${control_name_set}",                                           // tool name
                    "${description}",
                    {
                      ${paramCodes}
                    }
  );\n`, true);
    }
    
    if (mode === 'regular' || mode === 'report_only') {
        // Generate get method code
        generator.addSetupBegin(`aivox_add_mcp_tool_get_${name}`, `  ai_vox_engine.AddMcpTool("${control_name_get}",                                           // tool name
                    "${description}", 
                    {
                      // empty
                    }
  );\n`, true);
    }
    
    return '';
};

Arduino.forBlock['aivox_mcp_control'] = function(block, generator) {
    // let mcp_control_count = generator.valueToCode(block, 'COUNT', generator.ORDER_ATOMIC) || 0;

    // 监听VAR输入值的变化，自动重命名Blockly变量
    if (!block._aivoxVarMonitorAttached) {
        block._aivoxVarMonitorAttached = true;
        block._aivoxVarLastName = block.getFieldValue('VAR') || 'led';
        const varField = block.getField('VAR');
        if (varField && typeof varField.setValidator === 'function') {
            varField.setValidator((newName) => {
                // 只在新名称非空且与旧名称不同时才执行操作
                if (!newName || newName === block._aivoxVarLastName) {
                    return newName;
                }
                
                const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
                const oldName = block._aivoxVarLastName;
                if (workspace) {
                    // 更新AIVOX控制服务名称
                    const oldService = getAivoxControlService(oldName);
                    if (oldService) {
                        // 旧值为led时不删除
                        if (oldName !== 'led') {
                          deleteAivoxControlService(oldName);
                        }
                        registerAivoxControlService(newName, oldService.description, oldService.params);
                        
                        // 更新参数映射关系
                        const oldParams = getMcpServiceParams(oldName);
                        // 删除旧的参数映射关系
                        deleteMcpServiceParams(oldName);
                        // 为新服务名称创建新的参数映射关系
                        oldParams.forEach(paramName => {
                            registerMcpServiceParam(newName, paramName);
                        });
                    }
                    renameVariableInBlockly(block, oldName, newName, 'AIVOX');
                    block._aivoxVarLastName = newName;
                }
                return newName;
            });
        }
    }

    var varName = block.getFieldValue('VAR') || 'led';
    var description = generator.valueToCode(block, 'DESC', generator.ORDER_ATOMIC) || '""';
    // var count = generator.valueToCode(block, 'COUNT', generator.ORDER_ATOMIC) || '""';
    // console.log("aivox_mcp_control count: ", count);
    // 注册AIVOX控制服务和Blockly变量
    registerAivoxControlService(varName, description.replace(/"/g, ''));
    registerVariableToBlockly(varName, 'AIVOX');

    return ['\"' + varName + '\", ' + description , Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['aivox_mcp_control_param'] = function(block, generator) {
    // 监听VAR输入值的变化，自动重命名Blockly变量
    if (!block._stateVarMonitorAttached) {
        block._stateVarMonitorAttached = true;
        block._stateVarLastName = block.getFieldValue('VAR') || 'state';
        const varField = block.getField('VAR');
        if (varField && typeof varField.setValidator === 'function') {
            varField.setValidator((newName) => {
                // 只在新名称非空且与旧名称不同时才执行操作
                if (!newName || newName === block._stateVarLastName) {
                    return newName;
                }
                
                const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
                const oldName = block._stateVarLastName;
                if (workspace) {
                    // 删除旧参数，注册新参数
                    const oldParam = getMcpControlParam(oldName);
                    if (oldParam) {
                        if (oldName !== 'state') {
                          deleteMcpControlParam(oldName);
                        }
                        registerMcpControlParam(newName, oldParam.type, oldParam.minValue, oldParam.maxValue);
                        
                        // 更新所有使用该参数的服务的映射关系
                        const mcpServiceParamMap = getMcpServiceParamMapArray();
                        // 查找所有使用旧参数名称的服务
                        const servicesUsingParam = mcpServiceParamMap.filter(item => item.paramName === oldName);
                        // 为每个服务更新参数映射关系
                        servicesUsingParam.forEach(item => {
                            // 删除旧的参数映射关系
                            const index = mcpServiceParamMap.findIndex(mapItem => mapItem.serviceName === item.serviceName && mapItem.paramName === oldName);
                            if (index !== -1) {
                                mcpServiceParamMap.splice(index, 1);
                            }
                            // 添加新的参数映射关系
                            registerMcpServiceParam(item.serviceName, newName);
                        });
                    }
                    renameVariableInBlockly(block, oldName, newName, 'AIVOX_PARAM_STATE');
                    block._stateVarLastName = newName;
                }
                return newName;
            });
        }
    }

    var varName = block.getFieldValue('VAR') || 'state';
    let configOption = block.getFieldValue('TYPE');

    // 验证参数类型
    if (!validateParamType(configOption)) {
        // console.warn(`Invalid parameter type: ${configOption}`);
        configOption = 'Boolean'; // 默认类型
    }

    registerVariableToBlockly(varName, 'AIVOX_PARAM_STATE');

    let code = '';
    let minValue = null;
    let maxValue = null;

    if (configOption === 'Boolean') {
        code = '\"' + varName + '\", ai_vox::ParamSchema<bool>{.default_value = std::nullopt},';
        registerMcpControlParam(varName, 'Boolean');
    } else if (configOption === 'Number') {
        minValue = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || '0';
        maxValue = generator.valueToCode(block, 'MAX', generator.ORDER_ATOMIC) || '100';
        
        // 验证数值范围
        if (!validateNumberParam(minValue, maxValue)) {
            // console.warn(`Invalid number range: min=${minValue}, max=${maxValue}`);
        }
        
        code = '\"' + varName + '\", ai_vox::ParamSchema<int64_t>{.default_value = std::nullopt, .min = ' + minValue + ', .max = ' + maxValue + '},';
        registerMcpControlParam(varName, 'Number', minValue, maxValue);
    } else if (configOption === 'String') {
        code = '\"' + varName + '\", ai_vox::ParamSchema<std::string>{.default_value = std::nullopt},';
        registerMcpControlParam(varName, 'String');
    }

    return [code, Arduino.ORDER_ATOMIC];
};

//MCP参数设置
if (Blockly.Extensions.isRegistered('esp32ai_mcp_control_param_extension')) {
  Blockly.Extensions.unregister('esp32ai_mcp_control_param_extension');
};
Blockly.Extensions.register('esp32ai_mcp_control_param_extension', function () {
    // 直接在扩展中添加updateShape_函数
  this.updateShape_ = function (configType) {
    if (this.getInput('MIN')) {
      this.removeInput('MIN');
    }
    if (this.getInput('MAX')) {
      this.removeInput('MAX');
    }

    if (configType === 'Number') {
      this.appendValueInput('MIN')
        .setCheck('Number')
        .appendField("最小值");

      this.appendValueInput('MAX')
        .setCheck('Number')
        .appendField("最大值");

      setTimeout(() => {
        this.createDefaultBlocks_();
      }, 100);
    }
  };

    // 创建默认数字块的方法
  this.createDefaultBlocks_ = function() {
    // 检查workspace是否存在且已渲染
    if (!this.workspace || !this.workspace.rendered) {
      return;
    }

    // 为MIN输入添加默认的数字块
    const minInput = this.getInput('MIN');
    if (minInput && !minInput.connection.targetConnection) {
      try {
        var minBlock = this.workspace.newBlock('math_number');
        minBlock.setFieldValue(0, 'NUM');
        minBlock.initSvg();
        minBlock.render();
        minInput.connection.connect(minBlock.outputConnection);
      } catch (e) {
        console.warn('Failed to create MIN default block:', e);
      }
    }

    // 为MAX输入添加默认的数字块
    const maxInput = this.getInput('MAX');
    if (maxInput && !maxInput.connection.targetConnection) {
      try {
        var maxBlock = this.workspace.newBlock('math_number');
        maxBlock.setFieldValue(100, 'NUM');
        maxBlock.initSvg();
        maxBlock.render();
        maxInput.connection.connect(maxBlock.outputConnection);
      } catch (e) {
        console.warn('Failed to create MAX default block:', e);
      }
    }
  };

  // 监听TYPE字段的变化
  this.getField('TYPE').setValidator(function(option) {
    this.getSourceBlock().updateShape_(option);
    return option;
  });
  // 安全获取字段值
  const typeField = this.getField('TYPE');
  if (typeField) {
    this.updateShape_(typeField.getValue());
  }
});
Arduino.forBlock['esp32ai_mcp_control_param'] = function(block, generator) {
    // 监听VAR输入值的变化，自动重命名Blockly变量
    if (!block._stateVarMonitorAttached) {
        block._stateVarMonitorAttached = true;
        block._stateVarLastName = block.getFieldValue('VAR') || 'state';
        const varField = block.getField('VAR');
        if (varField && typeof varField.setValidator === 'function') {
            varField.setValidator((newName) => {
                if (!newName || newName === block._stateVarLastName) {
                    return newName;
                }
                
                const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
                const oldName = block._stateVarLastName;
                if (workspace) {
                    const oldParam = getMcpControlParam(oldName);
                    if (oldParam) {
                        if (oldName !== 'state') {
                          deleteMcpControlParam(oldName);
                        }
                        registerMcpControlParam(newName, oldParam.type, oldParam.minValue, oldParam.maxValue);
                        
                        const mcpServiceParamMap = getMcpServiceParamMapArray();
                        const servicesUsingParam = mcpServiceParamMap.filter(item => item.paramName === oldName);
                        servicesUsingParam.forEach(item => {
                            const index = mcpServiceParamMap.findIndex(mapItem => mapItem.serviceName === item.serviceName && mapItem.paramName === oldName);
                            if (index !== -1) {
                                mcpServiceParamMap.splice(index, 1);
                            }
                            registerMcpServiceParam(item.serviceName, newName);
                        });
                    }
                    renameVariableInBlockly(block, oldName, newName, 'AIVOX_PARAM_STATE');
                    block._stateVarLastName = newName;
                }
                return newName;
            });
        }
    }

    const varName = block.getFieldValue('VAR') || 'state';
    let configOption = block.getFieldValue('TYPE');

    // 验证参数类型
    if (!validateParamType(configOption)) {
        // console.warn(`Invalid parameter type: ${configOption}`);
        configOption = 'Boolean'; // 默认类型
    }

    registerVariableToBlockly(varName, 'AIVOX_PARAM_STATE');

    let code = '';
    let minValue = null;
    let maxValue = null;

    // 关键修正1：每个参数自带 {} 包裹，符合C++结构体列表语法
    if (configOption === 'Boolean') {
        code = `{"${varName}", ai_vox::ParamSchema<bool>{.default_value = std::nullopt}},\n`;
        registerMcpControlParam(varName, 'Boolean');
    } else if (configOption === 'Number') {
        minValue = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || '0';
        maxValue = generator.valueToCode(block, 'MAX', generator.ORDER_ATOMIC) || '100';
        
        if (!validateNumberParam(minValue, maxValue)) {
            // console.warn(`Invalid number range: min=${minValue}, max=${maxValue}`);
        }
        
        code = `{"${varName}", ai_vox::ParamSchema<int64_t>{.default_value = std::nullopt, .min = ${minValue}, .max = ${maxValue}}},\n`;
        registerMcpControlParam(varName, 'Number', minValue, maxValue);
    } else if (configOption === 'String') {
        code = `{"${varName}", ai_vox::ParamSchema<std::string>{.default_value = std::nullopt}},\n`;
        registerMcpControlParam(varName, 'String');
    }

    return code;
};

Arduino.forBlock['aivox_get_iot_message_event_name_new'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : '';
    
    // 验证服务是否存在
    const service = getAivoxControlService(varName);
    if (!service) {
        // console.warn(`AIVOX service '${varName}' not found`);
    }
    
    let control_name_set = "self." + varName + ".set";
    const code = `"${control_name_set}" == name`;
    return [code, Arduino.ORDER_MEMBER];
};


Arduino.forBlock['aivox_control_message_event_fuction'] = function(block, generator) {
    const eventVar = getEventVarName(block);
    // 获取变量字段值
    const varField = block.getField('VAR');
    const pvarField = block.getField('PVAR');
    const varName = varField ? varField.getText() : 'led';
    const pvarName = pvarField ? pvarField.getText() : 'state';

    
    // 验证服务和参数是否存在
    const service = getAivoxControlService(varName);
    const param = getMcpControlParam(pvarName);
    
    if (!service) {
        // console.warn(`AIVOX service '${varName}' not found`);
    }
    
    if (!param) {
        // console.warn(`MCP parameter '${pvarName}' not found`);
    }
    
    // 根据参数类型生成相应的代码
    let cType = "bool";
    if (param) {
        if (param.type === "Number") cType = "int64_t";
        if (param.type === "String") cType = "std::string";
    }
    
    let defaultValue;
    switch (cType) {
        case "bool":
            defaultValue = "false";
            break;
        case "int64_t":
            defaultValue = "0";
            break;
        case "std::string":
            defaultValue = "\"\""; // 空字符串
            break;
        default:
            defaultValue = "false"; // 默认 fallback
    }

    const code = `(event.param<${cType}>("${pvarName}") != nullptr) ? *event.param<${cType}>("${pvarName}") : ${defaultValue}`;
    
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_response_mcp_control_result_new'] = function(block, generator) {
    const eventVar = getEventVarName(block);
    // 获取变量字段值
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'led';
    // 验证服务是否存在
    const service = getAivoxControlService(varName);
    if (!service) {
        // console.warn(`AIVOX service '${varName}' not found`);
    }
    generator.addObject(`g_${varName}_res`, `bool g_${varName}_res = false;`, true);
    const code = `  ai_vox_engine.SendMcpCallResponse(id, true);\n`;
    return code;
};

Arduino.forBlock['aivox_update_mcp_control_state_new'] = function(block, generator) {
    const eventVar = getEventVarName(block);
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'led';
    const paramField = block.getField('PVAR');
    const paramName = paramField ? paramField.getText() : 'led';
    const param = getMcpControlParam(paramName);

    if (!param) {
        console.error(`[aivox_update_mcp_control_state_new] Parameter '${paramName}' not found.`);
        return `// Error: Parameter '${paramName}' not found. Cannot update MCP control state.`;
    }

    // 获取state值（可能带括号，如"(String(dht.readHumidity()))"）
    const state = generator.valueToCode(block, 'STATE', generator.ORDER_ATOMIC) || '""';
    const service = getAivoxControlService(varName);
    if (!service) {
        // console.warn(`AIVOX service '${varName}' not found`);
    }

    // 1. 修正：判断state是否为String对象（支持带括号的情况）
    const isStateStringObject = /String\(/.test(state); // 用正则匹配是否包含"String("
    const cType = param.type === "Number" ? "int64_t" : (param.type === "String" ? "std::string" : "bool");

    generator.addLibrary('sstream', '#include <sstream>\n');

    // -------------------------- Set 请求逻辑 --------------------------
    let setCode = `
    if ("self.${varName}.set" == name) {
        const ${cType}* param_ptr = event.param<${cType}>("${paramName}");
        if (param_ptr != nullptr) {
            `;

    if (cType === "int64_t" && isStateStringObject) {
        setCode += `${state} = String(static_cast<long long>(*param_ptr));`;
    } else if (cType === "std::string" && isStateStringObject) {
        setCode += `${state} = String(param_ptr->c_str());`;
    } else if (cType === "std::string" && !isStateStringObject) {
        setCode += `${state} = *param_ptr;`;
    } else if (cType === "bool" && isStateStringObject) {
        setCode += `${state} = (*param_ptr) ? "true" : "false";`;
    } else {
        setCode += `${state} = *param_ptr;`;
    }

    setCode += `
        } else {
            printf("Warning: Parameter '${paramName}' not found for 'self.${varName}.set'.\\n");
        }
        ai_vox_engine.SendMcpCallResponse(id, true);
    }`;

    // -------------------------- Get 请求逻辑（核心修复） --------------------------
    let getCode = `
    else if ("self.${varName}.get" == name) {
        `;

    if (cType === "bool") {
        if (isStateStringObject) {
            getCode += `ai_vox_engine.SendMcpCallResponse(id, ${state}.equals("true"));`;
        } else {
            getCode += `ai_vox_engine.SendMcpCallResponse(id, ${state});`;
        }
    } else if (cType === "int64_t") {
        // 核心修复：只要是String对象，就强制添加.toInt()
        if (isStateStringObject) {
            getCode += `ai_vox_engine.SendMcpCallResponse(id, static_cast<int64_t>(${state}.toInt()));`;
        } else {
            getCode += `ai_vox_engine.SendMcpCallResponse(id, static_cast<int64_t>(${state}));`;
        }
    } else if (cType === "std::string") {
        if (isStateStringObject) {
            getCode += `ai_vox_engine.SendMcpCallResponse(id, ${state}.c_str());`;
        } else {
            getCode += `ai_vox_engine.SendMcpCallResponse(id, ${state});`;
        }
    }

    getCode += `
    }`;

    const code = setCode + getCode;
    return code;
};

Arduino.forBlock['aivox_calculateupdate_mcp_control_state'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'led';
    const customParamField = block.getField('PVAR');
    const customParamName = customParamField ? customParamField.getText() : 'state';
    
    // 获取代码块中的代码
    const codeBlock = generator.statementToCode(block, 'CODE_BLOCK');
    
    generator.addLibrary('string', '#include <string>\n');
    generator.addLibrary('sstream', '#include <sstream>\n');
    
    // 根据参数名获取参数类型
    const param = getMcpControlParam(customParamName);
    let varType = 'String'; // 默认类型为String
    if (param) {
        if (param.type === 'Boolean') {
            varType = 'bool';
        } else if (param.type === 'Number') {
            varType = 'int64_t';
        } else if (param.type === 'String') {
            varType = 'String';
        }
    }

    let sendResponseCode = `ai_vox_engine.SendMcpCallResponse(id, ${customParamName});`;
    // 无论变量类型是什么，都需要确保SendMcpCallResponse接收正确的类型
    if (varType === 'String') {
        // 如果是Arduino String类型，转换为c_str()
        sendResponseCode = `ai_vox_engine.SendMcpCallResponse(id, ${customParamName}.c_str());`;
    } else if (varType === 'bool') {
        // 如果是bool类型，直接传递
        sendResponseCode = `ai_vox_engine.SendMcpCallResponse(id, ${customParamName});`;
    } else if (varType === 'int64_t') {
        // 如果是int64_t类型，直接传递
        sendResponseCode = `ai_vox_engine.SendMcpCallResponse(id, ${customParamName});`;
    }

    // 生成代码，匹配用户期望的格式
    const code = `
    if ("self.${varName}.get" == name) {
        ${varType} ${customParamName};
        ${codeBlock}
        ${sendResponseCode}
    }`;

    return code;
};

//MCP服务注册及消息处理
if (Blockly.Extensions.isRegistered('esp32ai_loop_mcp_new_extension')) {
  Blockly.Extensions.unregister('esp32ai_loop_mcp_new_extension');
}
Blockly.Extensions.register('esp32ai_loop_mcp_new_extension', function() {
  const block = this;

  this.updateShape_ = function(displayType) {
    const inputNames = ['setCODE_BLOCK','CODE_BLOCK'];
    inputNames.forEach(name => {
      if (block.getInput(name)) {
        block.removeInput(name);
      }
    });

    if (displayType === "regular") {
      block.appendStatementInput('setCODE_BLOCK')
        .appendField('设置');
      block.appendStatementInput('CODE_BLOCK')
        .appendField('上报');
    } else if (displayType === "set_only") {
      block.appendStatementInput('setCODE_BLOCK')
        .appendField('设置');
    } else if (displayType === "report_only") {
      block.appendStatementInput('CODE_BLOCK')
        .appendField('上报');
    }
  };

  this.onInit = function() {
    updateParamDisplay.call(block.sourceBlock_ || block);
  };

  this.onChange = function() {
    updateParamDisplay.call(block.sourceBlock_ || block);
  };

  this.getField('MODE').setValidator(function(option) {
    const sourceBlock = this.getSourceBlock();
    const displayType = option;
    sourceBlock.updateShape_(displayType);
    return option;
  });

  const displayTypeField = this.getField('MODE');
  if (displayTypeField) {
    const defaultType = displayTypeField.getValue();
    this.updateShape_(defaultType);
  }
});
Arduino.forBlock['esp32ai_loop_mcp_new'] = function(block, generator) {
  // --------------------------
  // 1. 关键：获取当前工作区所有MCP服务块，统一收集逻辑（避免重复追加）
  // --------------------------
  const collectAllMcpBlocksLogic = () => {
    // 清空旧逻辑，每次生成都重新收集最新的所有块
    const mcpLogicMap = {}; // 用对象去重：key=服务名，value=处理逻辑
    
    // 获取工作区所有esp32ai_loop_mcp_new块
    const workspace = block.workspace || Blockly.getMainWorkspace();
    const allMcpBlocks = workspace.getAllBlocks().filter(b => b.type === 'esp32ai_loop_mcp_new');
    
    // 遍历所有块，收集每个服务的逻辑（去重）
    allMcpBlocks.forEach(b => {
      const varName = b.getFieldValue('VAR') || 'led';
      // 避免重复处理同一个服务
      if (mcpLogicMap[varName]) return;

      const mode = b.getFieldValue('MODE') || 'regular';
      const controlSetName = `self.${varName}.set`;
      const controlGetName = `self.${varName}.get`;
      
      // 安全获取输入项代码
      const hasSetCodeInput = b.getInput('setCODE_BLOCK') !== null;
      const hasCodeInput = b.getInput('CODE_BLOCK') !== null;
      const setCodeBlock = hasSetCodeInput ? generator.statementToCode(b, 'setCODE_BLOCK') || '' : '';
      const reportCodeBlock = hasCodeInput ? generator.statementToCode(b, 'CODE_BLOCK') || '' : '';
      
      // 收集参数（用于上报逻辑）
      let paramsCode = generator.statementToCode(b, 'params_list') || '';
      paramsCode = paramsCode.replace(/^\s+|\s+$/g, '');
      const paramNames = [];
      if (paramsCode) {
        const paramMatches = paramsCode.match(/"([^"]+)"/g) || [];
        paramMatches.forEach(match => {
          paramNames.push(match.replace(/"/g, ''));
        });
      }

      // 构建当前服务的set/get逻辑
      let serviceLogic = '';
      // Set逻辑
      if (hasSetCodeInput && setCodeBlock.trim()) {
        serviceLogic += `
  // ${varName} - 设置逻辑
  if ("${controlSetName}" == name) {
    ${setCodeBlock.trim()}
    ai_vox_engine.SendMcpCallResponse(id, true);
  }`;
      }

      // Get逻辑
      if (hasCodeInput && reportCodeBlock.trim()) {
        let paramDeclare = '';
        paramNames.forEach(paramName => {
          const param = getMcpControlParam(paramName);
          switch (param?.type) {
            case 'Boolean': paramDeclare += `  bool ${paramName} = false;\n`; break;
            case 'Number': paramDeclare += `  int64_t ${paramName} = 0;\n`; break;
            case 'String': paramDeclare += `  String ${paramName} = "";\n`; break;
            default: paramDeclare += `  int64_t ${paramName} = 0;\n`;
          }
        });

        let responseLogic = '';
        if (paramNames.length === 1) {
          const param = getMcpControlParam(paramNames[0]);
          responseLogic = param?.type === 'String'
            ? `  ai_vox_engine.SendMcpCallResponse(id, std::string(${paramNames[0]}.c_str()));`
            : `  ai_vox_engine.SendMcpCallResponse(id, ${paramNames[0]});`;
        } else if (paramNames.length > 1) {
          responseLogic = `
  cJSON *root = cJSON_CreateObject();
  ${paramNames.map(p => {
    const param = getMcpControlParam(p);
    switch (param?.type) {
      case 'Boolean': return `  cJSON_AddItemToObject(root, "${p}", cJSON_CreateBool(${p}));`;
      case 'Number': return `  cJSON_AddItemToObject(root, "${p}", cJSON_CreateNumber(${p}));`;
      case 'String': return `  cJSON_AddItemToObject(root, "${p}", cJSON_CreateString(${p}.c_str()));`;
      default: return `  cJSON_AddItemToObject(root, "${p}", cJSON_CreateNumber(${p}));`;
    }
  }).join('\n  ')}
  char *json_str = cJSON_PrintUnformatted(root);
  ai_vox_engine.SendMcpCallResponse(id, std::string(json_str));
  cJSON_Delete(root);
  free(json_str);`;
        } else {
          responseLogic = `  ai_vox_engine.SendMcpCallResponse(id, true);`;
        }

        serviceLogic += `
  // ${varName} - 上报逻辑
  else if ("${controlGetName}" == name) {
    ${paramDeclare}
    ${reportCodeBlock.trim()}
    ${responseLogic}
  }`;
      }

      // 存入映射表（去重）
      mcpLogicMap[varName] = serviceLogic;
    });

    // 拼接所有去重后的服务逻辑
    const allLogic = Object.values(mcpLogicMap).join('');
    
    // 修复if/else if语法：确保第一个条件是if，后续是else if
    const ifRegex = /^\s*if\s*\(("self\.[^\.]+\.(set|get)")\s*==\s*name\)\s*\{/gm;
    const matches = [];
    let match;
    while ((match = ifRegex.exec(allLogic)) !== null) {
      matches.push(match[0]);
    }
    if (matches.length > 1) {
      let processedCode = allLogic;
      for (let i = 1; i < matches.length; i++) {
        processedCode = processedCode.replace(matches[i], matches[i].replace('if', 'else if'));
      }
      return processedCode;
    }
    return allLogic;
  };

  // --------------------------
  // 2. 服务名称监听与重命名逻辑（保留）
  // --------------------------
  if (!block._aivoxVarMonitorAttached) {
    block._aivoxVarMonitorAttached = true;
    block._aivoxVarLastName = block.getFieldValue('VAR') || 'led';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator((newName) => {
        if (!newName || newName === block._aivoxVarLastName) return newName;

        const workspace = block.workspace || (Blockly.getMainWorkspace ? Blockly.getMainWorkspace() : null);
        const oldName = block._aivoxVarLastName;
        if (workspace) {
          const oldService = getAivoxControlService(oldName);
          if (oldService) {
            if (oldName !== 'led') deleteAivoxControlService(oldName);
            registerAivoxControlService(newName, oldService.description, oldService.params);

            const oldParams = getMcpServiceParams(oldName);
            deleteMcpServiceParams(oldName);
            oldParams.forEach(paramName => registerMcpServiceParam(newName, paramName));
          }
          renameVariableInBlockly(block, oldName, newName, 'AIVOX');
          block._aivoxVarLastName = newName;
        }
        return newName;
      });
    }
  }

  // --------------------------
  // 3. 基础配置与参数收集（当前块）
  // --------------------------
  const mode = block.getFieldValue('MODE') || 'regular';
  const varName = block.getFieldValue('VAR') || 'led';
  const description = generator.valueToCode(block, 'DESC', generator.ORDER_ATOMIC) || '""';
  const cleanDesc = description.replace(/"/g, '').trim();

  let paramsCode = generator.statementToCode(block, 'params_list') || '';
  paramsCode = paramsCode.replace(/^\s+|\s+$/g, '').replace(/\n+/g, '\n                        ');
  if (paramsCode.endsWith(',')) paramsCode = paramsCode.slice(0, -1);

  const paramNames = [];
  if (paramsCode) {
    const paramMatches = paramsCode.match(/"([^"]+)"/g) || [];
    paramMatches.forEach(match => {
      const paramName = match.replace(/"/g, '');
      paramNames.push(paramName);
      registerMcpServiceParam(varName, paramName);
    });
  }

  // --------------------------
  // 4. 基础依赖引入（统一Tag避免重复）
  // --------------------------
  generator.addLibrary('include_aivox_engine', '#include "ai_vox_engine.h"');
  const hasSetCodeInput = block.getInput('setCODE_BLOCK') !== null;
  const hasCodeInput = block.getInput('CODE_BLOCK') !== null;
  const setCodeBlock = hasSetCodeInput ? generator.statementToCode(block, 'setCODE_BLOCK') || '' : '';
  const reportCodeBlock = hasCodeInput ? generator.statementToCode(block, 'CODE_BLOCK') || '' : '';
  const needCJSON = hasCodeInput && reportCodeBlock.trim() && paramNames.length > 1;
  if (needCJSON) generator.addLibrary('cjson_lib', '#include "kljxgwj/cjsonk/cJSON.h"');

  generator.addObject(`aivox_observer`, `std::shared_ptr<ai_vox::Observer> g_observer = std::make_shared<ai_vox::Observer>();`, true);
  generator.addObject('ai_vox_engine', `auto& ai_vox_engine = ai_vox::Engine::GetInstance();`, true);
  generator.addSetup(`aivox_set_observer`, `
    ai_vox::Engine::GetInstance().SetObserver(g_observer);
`, true);

  // --------------------------
  // 5. 生成MCP服务注册代码（Setup阶段，去重）
  // --------------------------
  const controlSetName = `self.${varName}.set`;
  const controlGetName = `self.${varName}.get`;

  if (mode === 'regular' || mode === 'set_only') {
    const setCode = `  ai_vox_engine.AddMcpTool("${controlSetName}",
                "${cleanDesc}",
                {
                  ${paramsCode || '// no parameters'}
                }
  );`;
    generator.addSetupBegin(`aivox_add_mcp_tool_set_${varName}`, setCode, true);
  }

  if (mode === 'regular' || mode === 'report_only') {
    const getCode = `  ai_vox_engine.AddMcpTool("${controlGetName}",
                "${cleanDesc}", 
                {
                  // empty
                }
  );`;
    generator.addSetupBegin(`aivox_add_mcp_tool_get_${varName}`, getCode, true);
  }

  // --------------------------
  // 6. 全局事件处理器注册（统一分发）
  // --------------------------
  const key = "HandleMcpToolCallEvent";
  if (!eventHandlers[key]) {
    eventHandlers[key] = {
      condition: 'auto mcp_tool_call_event = std::get_if<ai_vox::McpToolCallEvent>(&event)',
      action: 'HandleMcpToolCallEvent(*mcp_tool_call_event)'
    };
  }

  // --------------------------
  // 7. 生成包含所有去重服务的事件处理函数（核心修复）
  // --------------------------
  const allServiceLogic = collectAllMcpBlocksLogic();
  generator.addFunction(`HandleMcpToolCallEvent`, `
void HandleMcpToolCallEvent(const ai_vox::McpToolCallEvent& event) {
    auto id = event.id;
    auto name = event.name;
    ${allServiceLogic || '// 暂无MCP服务处理逻辑'}
}
`);

  // --------------------------
  // 8. 统一事件分发逻辑（复用原Tag）
  // --------------------------
  let handlers = Object.values(eventHandlers);
  let result = "";
  handlers.forEach((handler, index) => {
    if (index === 0) {
      result += `if (${handler.condition}) {\n  ${handler.action};\n`;
    } else {
      result += ` } else if (${handler.condition}) {\n  ${handler.action};\n`;
    }
  });
  result += " }";

  generator.addLoop('esp32ai_event_loop', `
  if (g_observer) {
    const auto events = g_observer->PopEvents();
    for (const auto& event : events) {
      ${result}
    }
  }
`, true);

  // --------------------------
  // 9. 注册Blockly变量
  // --------------------------
  registerVariableToBlockly(varName, 'AIVOX');
  return "";
};
// 辅助函数
Arduino.getAllAivoxControlServices = function() {
  return window.aivoxControlServices || [];
};

// 检查并移除已存在的扩展注册
if (Blockly.Extensions.isRegistered('custom_dynamic_extension')) {
  Blockly.Extensions.unregister('custom_dynamic_extension');
}
Blockly.Extensions.register('custom_dynamic_extension', function () {
  // 最小输入数量
  this.minInputs = 2;
  // 输入项计数
  this.itemCount = this.minInputs;

  // 添加所有动态块需要的方法
  this.findInputIndexForConnection = function (connection) {
    if (!connection.targetConnection || connection.targetBlock()?.isInsertionMarker()) {
      return null;
    }

    let connectionIndex = -1;
    for (let i = 0; i < this.inputList.length; i++) {
      if (this.inputList[i].connection == connection) {
        connectionIndex = i;
      }
    }

    if (connectionIndex == this.inputList.length - 1) {
      return this.inputList.length + 1;
    }

    const nextInput = this.inputList[connectionIndex + 1];
    const nextConnection = nextInput?.connection?.targetConnection;
    if (nextConnection && !nextConnection.getSourceBlock().isInsertionMarker()) {
      return connectionIndex + 1;
    }

    return null;
  };

  this.onPendingConnection = function (connection) {
    const insertIndex = this.findInputIndexForConnection(connection);
    if (insertIndex == null) {
      return;
    }

    this.appendValueInput(`INPUT${Blockly.utils.idGenerator.genUid()}`);
    this.moveNumberedInputBefore(this.inputList.length - 1, insertIndex);
  };

  this.finalizeConnections = function () {
    const targetConns = this.removeUnnecessaryEmptyConns(
      this.inputList.map((i) => i.connection?.targetConnection),
    );

    this.tearDownBlock();
    this.addItemInputs(targetConns);
    this.itemCount = targetConns.length;
  };

  this.tearDownBlock = function () {
    // 只删除动态添加的输入（INPUT2及以后）
    for (let i = this.inputList.length - 1; i >= 0; i--) {
      const inputName = this.inputList[i].name;
      // 保留原始的INPUT0和INPUT1，只删除动态添加的
      if (inputName.startsWith('INPUT') && inputName !== 'INPUT0' && inputName !== 'INPUT1') {
        this.removeInput(inputName);
      }
    }
  };

  this.removeUnnecessaryEmptyConns = function (targetConns) {
    const filteredConns = [...targetConns];
    for (let i = filteredConns.length - 1; i >= 0; i--) {
      if (!filteredConns[i] && filteredConns.length > this.minInputs) {
        filteredConns.splice(i, 1);
      }
    }
    return filteredConns;
  };

  this.addItemInputs = function (targetConns) {
    // 从INPUT2开始添加动态输入
    for (let i = this.minInputs; i < targetConns.length; i++) {
      const inputName = `INPUT${i}`;
      const input = this.appendValueInput(inputName);
      const targetConn = targetConns[i];
      if (targetConn) input.connection?.connect(targetConn);
    }
  };

  this.isCorrectlyFormatted = function () {
    // 检查动态输入是否正确格式化
    let dynamicInputIndex = this.minInputs;
    for (let i = 0; i < this.inputList.length; i++) {
      const inputName = this.inputList[i].name;
      if (inputName.startsWith('INPUT') && inputName !== 'INPUT0' && inputName !== 'INPUT1') {
        if (inputName !== `INPUT${dynamicInputIndex}`) return false;
        dynamicInputIndex++;
      }
    }
    return true;
  };
});

// 检查并移除已存在的扩展注册
if (Blockly.Extensions.isRegistered('custom_dynamic_mutator')) {
  Blockly.Extensions.unregister('custom_dynamic_mutator');
}
// 定义 Mutator 来处理序列化
Blockly.Extensions.registerMutator('custom_dynamic_mutator', {
  /**
   * 将变异状态转换为 DOM 元素
   * 用于序列化块的动态输入配置到 XML
   * @returns {Element} 包含变异信息的 XML 元素
   */
  mutationToDom: function () {
    // 如果块没有死亡或正在死亡，先完成连接并重新初始化
    if (!this.isDeadOrDying()) {
      Blockly.Events.disable();
      this.finalizeConnections();
      if (this instanceof Blockly.BlockSvg) this.initSvg();
      Blockly.Events.enable();
    }

    // 创建包含变异信息的 XML 元素
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('items', `${this.itemCount}`);
    return container;
  },

  /**
   * 从 DOM 元素恢复变异状态
   * 用于从 XML 反序列化块的动态输入配置
   * @param {Element} xmlElement 包含变异信息的 XML 元素
   */
  domToMutation: function (xmlElement) {
    // 从 XML 属性中读取项目数量，确保不小于最小输入数
    this.itemCount = Math.max(
      parseInt(xmlElement.getAttribute('items') || '0', 10),
      this.minInputs,
    );

    // 根据项目数量添加额外的输入
    for (let i = this.minInputs; i < this.itemCount; i++) {
      this.appendValueInput(`INPUT${i}`);
    }
  },

  /**
   * 保存额外的状态信息
   * 用于新版本的 Blockly 序列化系统
   * @returns {Object} 包含状态信息的对象
   */
  saveExtraState: function () {
    // 如果块格式不正确且没有死亡，先完成连接并重新初始化
    if (!this.isDeadOrDying() && !this.isCorrectlyFormatted()) {
      Blockly.Events.disable();
      this.finalizeConnections();
      if (this instanceof Blockly.BlockSvg) this.initSvg();
      Blockly.Events.enable();
    }

    // 返回包含项目数量的状态对象
    return {
      itemCount: this.itemCount,
    };
  },

  /**
   * 加载额外的状态信息
   * 用于新版本的 Blockly 反序列化系统
   * @param {Object|string} state 状态对象或字符串
   */
  loadExtraState: function (state) {
    // 如果状态是字符串格式，转换为 DOM 并使用旧版本方法处理
    if (typeof state === 'string') {
      this.domToMutation(Blockly.utils.xml.textToDom(state));
      return;
    }

    // 从状态对象中恢复项目数量并创建相应的输入
    this.itemCount = state['itemCount'] || 0;
    for (let i = this.minInputs; i < this.itemCount; i++) {
      this.appendValueInput(`INPUT${i}`);
    }
  }
});

//  
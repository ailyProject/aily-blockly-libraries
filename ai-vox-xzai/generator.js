// ESP32 多线程任务 generator.js
// 检查并移除已存在的扩展注册
if (Blockly.Extensions.isRegistered('esp32ai_init_wifi_extension')) {
  Blockly.Extensions.unregister('esp32ai_init_wifi_extension');
}

if (Blockly.Extensions.isRegistered('aivox3_mcp_control_param_extension')) {
  Blockly.Extensions.unregister('aivox3_mcp_control_param_extension');
}

// 注册一个全局数组变量来存储MCP控制参数及对应的类型
// 使用条件声明避免重复声明错误
if (typeof window !== 'undefined') {
  if (!window.mcpControlParams) {
    window.mcpControlParams = [];
  }
  if (!window.aivoxControlServices) {
    window.aivoxControlServices = [];
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

// 管理 - 导出变量配置为JSON
function exportVariableConfig() {
  const mcpControlParams = getMcpControlParamsArray();
  const aivoxControlServices = getAivoxControlServicesArray();
  return {
    mcpControlParams: mcpControlParams,
    aivoxControlServices: aivoxControlServices,
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
  console.log(`Reset complete: ${paramCount} parameters and ${serviceCount} services cleared`);
  return { paramCount, serviceCount };
}

// 将调试函数暴露到全局，便于在控制台中使用
if (typeof window !== 'undefined') {
  window.debugPrintMcpParams = debugPrintMcpParams;
  window.debugPrintAivoxServices = debugPrintAivoxServices;
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
  this.getField('MODE').setValidator(function (option) {
    this.getSourceBlock().updateShape_(option);
    return option;
  });
  this.updateShape_(this.getFieldValue('MODE'));
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

    if (configType !== 'Boolean') {
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
  this.getField('TYPE').setValidator(function (option) {
    this.getSourceBlock().updateShape_(option);
    return option;
  });
  this.updateShape_(this.getFieldValue('TYPE'));
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

Arduino.forBlock['esp32ai_init_wifi'] = function (block, generator) {
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
#include "network_config_mode_mp3.h"
#include "network_connected_mp3.h"
#include "notification_0_mp3.h"`);
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
  const initCode = `const button_config_t ai_btn_cfg = {
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

  generator.addSetupBegin('ai_trigger_button_init', initCode);
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
  const registerCode = `ESP_ERROR_CHECK(iot_button_register_cb(
    g_button_boot_handle,    // 1. 按钮句柄
    BUTTON_SINGLE_CLICK,     // 2. 单击事件（官方枚举值）
    NULL,                    // 3. 无事件参数（传NULL）
    ${cbName},               // 4. 回调函数
    NULL                     // 5. 无用户数据（传NULL）
  ));`;

  generator.addSetup('ai_trigger_button_click_reg', registerCode);
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
    this.getField('MIC_TYPE').setValidator(option => {
        this.updateShape_(option);
        return option;
    });

    // 4. 初始化时更新形状
    this.updateShape_(this.getFieldValue('MIC_TYPE'));
});
//麦克风
Arduino.forBlock['esp32_i2s_mic_setup'] = function(block, generator) {
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
  const sckPin = block.getFieldValue('SCK_PIN');
  const wsPin = block.getFieldValue('WS_PIN');
  const sdPin = block.getFieldValue('SD_PIN');
  
  // 1. 添加库引用（对应 [库引用 library] 区域）
  generator.addLibrary('include_aivox_engine', '#include "ai_vox_engine.h"');
  generator.addLibrary('audio_output_i2s_lib','#include "audio_device/audio_output_device_i2s_std.h"');
  
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
            'SCL_PIN', 'SDA_PIN'                                                   // SSD1306
        ];
        inputNames.forEach(name => {
            if (this.getInput(name)) {
                this.removeInput(name);
            }
        });

        // 2. 根据选择的类型，添加对应的引脚输入
        if (displayType === 'ST7789') {
            // 添加 ST7789 (SPI) 所需的引脚
            this.appendDummyInput('BACKLIGHT_PIN')
                .appendField('  BackLight 引脚:')
                .appendField(new Blockly.FieldNumber(2), 'BACKLIGHT_PIN');

            this.appendDummyInput('MOSI_PIN')
                .appendField('  MOSI/SDA 引脚:')
                .appendField(new Blockly.FieldNumber(13), 'MOSI_PIN');

            this.appendDummyInput('CLK_PIN')
                .appendField('  CLK/SCL 引脚:')
                .appendField(new Blockly.FieldNumber(14), 'CLK_PIN');

            this.appendDummyInput('DC_PIN')
                .appendField('  DC 引脚:')
                .appendField(new Blockly.FieldNumber(27), 'DC_PIN');

            this.appendDummyInput('RST_PIN')
                .appendField('  RST 引脚:')
                .appendField(new Blockly.FieldNumber(33), 'RST_PIN');

            this.appendDummyInput('CS_PIN')
                .appendField('  CS 引脚:')
                .appendField(new Blockly.FieldNumber(5), 'CS_PIN');

        } else if (displayType === 'SSD1306') {
            // 添加 SSD1306 (I2C) 所需的引脚
            this.appendDummyInput('SCL_PIN')
                .appendField('  SCL 引脚:')
                .appendField(new Blockly.FieldNumber(22), 'SCL_PIN');

            this.appendDummyInput('SDA_PIN')
                .appendField('  SDA 引脚:')
                .appendField(new Blockly.FieldNumber(21), 'SDA_PIN');
        }
    };

    // 3. 为 DISPLAY_TYPE 字段添加验证器，当值改变时触发形状更新
    this.getField('DISPLAY_TYPE').setValidator(option => {
        this.updateShape_(option);
        // 返回选中的值，以更新下拉框的显示
        return option;
    });

    // 4. 初始化时，根据默认选中的类型更新块的形状
    const defaultType = this.getFieldValue('DISPLAY_TYPE');
    this.updateShape_(defaultType);
});
// 统一的显示屏初始化代码生成器
Arduino.forBlock['esp32ai_init_display'] = function(block, generator) {
    const displayType = block.getFieldValue('DISPLAY_TYPE');
    display_type = block.getFieldValue('DISPLAY_TYPE');
    // 根据显示屏类型生成不同的代码
    if (displayType === 'ST7789') {
        // --- ST7789 (SPI) 代码生成 ---
        const backLightPin = block.getFieldValue('BACKLIGHT_PIN');
        const MOSIPin = block.getFieldValue('MOSI_PIN');
        const CLKPin = block.getFieldValue('CLK_PIN');
        const DCPin = block.getFieldValue('DC_PIN');
        const RSTPin = block.getFieldValue('RST_PIN');
        const CSPin = block.getFieldValue('CS_PIN');
        
        generator.addLibrary('spi_common_lib','#include <driver/spi_common.h>');
        generator.addLibrary('esp_heap_caps_lib','#include <esp_heap_caps.h>');
        generator.addLibrary('esp_lcd_panel_io_lib','#include <esp_lcd_panel_io.h>');
        generator.addLibrary('esp_lcd_panel_ops_lib','#include <esp_lcd_panel_ops.h>');
        generator.addLibrary('esp_lcd_panel_vendor_lib','#include <esp_lcd_panel_vendor.h>');
        generator.addLibrary('include_aivox_engine', '#include "ai_vox_engine.h"');
        generator.addLibrary('esp32xzai_display', '#include "display.h"');

        generator.addMacro('Screen_Display_Type_lcd','#define SCREEN_DISPLAY_TYPE_LCD (1)');
        generator.addMacro('Screen_Display_Type_oled','#define SCREEN_DISPLAY_TYPE_OLED (2)');
        generator.addMacro('Screen_Display_Type','#define SCREEN_DISPLAY_TYPE SCREEN_DISPLAY_TYPE_LCD');
        
        const pinDefines = `
constexpr gpio_num_t kDisplayBacklightPin = GPIO_NUM_${backLightPin};
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
        generator.addLibrary('include_aivox_engine', '#include "ai_vox_engine.h"');
        generator.addLibrary('esp32xzai_display', '#include "displayoled.h"');

        generator.addMacro('Screen_Display_Type_lcd','#define SCREEN_DISPLAY_TYPE_LCD (1)');
        generator.addMacro('Screen_Display_Type_oled','#define SCREEN_DISPLAY_TYPE_OLED (2)');
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

// AI 引擎启动
Arduino.forBlock['esp32ai_start_engine'] = function(block, generator) {
  generator.addMacro('Screen_Display_Type_lcd','#define SCREEN_DISPLAY_TYPE_LCD (1)');
  generator.addMacro('Screen_Display_Type_oled','#define SCREEN_DISPLAY_TYPE_OLED (2)');
  generator.addMacro('Screen_Display_Type_none','#define SCREEN_DISPLAY_TYPE_NONE (0)');
  generator.addMacro('Screen_Display_Type','#define SCREEN_DISPLAY_TYPE SCREEN_DISPLAY_TYPE_NONE');

  if (display_type === 'ST7789') {
    generator.addObject('esp32ai_display', `std::unique_ptr<Display> g_display;\n`,true);
  } else if (display_type === 'SSD1306') {
    generator.addObject('esp32ai_display', `std::unique_ptr<OledDisplay> g_display;\n`,true);
  }

  generator.addObject(`aivox_observer`, `std::shared_ptr<ai_vox::Observer> g_observer = std::make_shared<ai_vox::Observer>();`, true);
  generator.addObject('ai_vox_engine', `auto& ai_vox_engine = ai_vox::Engine::GetInstance();`, true);

  generator.addObject('esp32ai_audio_output_device', `
auto g_audio_output_device = std::make_shared<ai_vox::AudioOutputDeviceI2sStd>(kSpeakerPinSck, kSpeakerPinWs, kSpeakerPinSd);\n`,true);

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
  g_audio_output_device->OpenOutput(16000);

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
    fhcode = fhcode + `g_display->ShowStatus("网络已连接");\n`;
  }
  fhcode = fhcode + `PlayMp3(kNetworkConnectedMp3, sizeof(kNetworkConnectedMp3));\n}`;

  generator.addFunction('esp32ai_ConfigureWifi',fhcode,true);
  
  let initCode = `
#if AUDIO_INPUT_DEVICE_TYPE == AUDIO_INPUT_DEVICE_TYPE_I2S_STD
  auto audio_input_device = std::make_shared<ai_vox::AudioInputDeviceI2sStd>(kMicPinSck, kMicPinWs, kMicPinSd);
#elif AUDIO_INPUT_DEVICE_TYPE == AUDIO_INPUT_DEVICE_TYPE_PDM
  auto audio_input_device = std::make_shared<ai_vox::PdmAudioInputDevice>(kMicPinSck, kMicPinSd);
#endif\n`;

  if (display_type !== 'NONE') {
    initCode = initCode + `
  InitDisplay();
  g_display->ShowStatus("初始化");\n`;
  }

  initCode = initCode + `
  ConfigureWifi();\n`;
  generator.addSetupBegin('esp32ai_start_engine_setupbegin', initCode);

  let setcode = `\nprintf("engine starting\\n");\n`;

  if (display_type !== 'NONE') {
    setcode = setcode + `
  g_display->ShowStatus("AI引擎启动中");\n`;
  }

  setcode = setcode + `
  ai_vox_engine.Start(audio_input_device, g_audio_output_device);\nprintf("engine started\\n");\n`;

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
    generator.addSetup(`aivox_instance`, `ai_vox_engine.SetObserver(g_observer);\n`, true);
    let code = `ai_vox_engine.SetOtaUrl(${ota_url});\n`;
    return code;
};

Arduino.forBlock['aivox_config_websocket'] = function (block, generator) {
    let websocket_url = generator.valueToCode(block, 'ai_vox_websocket_url', generator.ORDER_ATOMIC) || '""';
    let websocket_param = generator.valueToCode(block, 'ai_vox_websocket_param', generator.ORDER_ATOMIC) || '""';
    websocket_param = websocket_param.substring(1, websocket_param.length - 1);
    generator.addObject('ai_vox_engine', `auto& ai_vox_engine = ai_vox::Engine::GetInstance();`, true);
    generator.addSetup(`aivox_instance`, `ai_vox_engine.SetObserver(g_observer);\n`, true);
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

Arduino.forBlock['aivox_lcd_show_status'] = function (block, generator) {
  generator.addObject(`chat_message_role`, `std::string chatRole;`, true);
    let location = block.getFieldValue('location');
    let ai_vox_content = generator.valueToCode(block, 'ai_vox_content', generator.ORDER_ATOMIC) || '""';
    let code = '';
    if(location == 'SetChatMessage'){
      if(display_mode == '' || display_mode == 'normal'){
        if (display_type === 'ST7789') {
          code = `g_display->SetChatMessage(Display::Role::kSystem, ${ai_vox_content});\n`;
        } else if (display_type === 'SSD1306') {
          code = `g_display->SetChatMessage(${ai_vox_content});\n`;
        }
      }else{
        if (display_type === 'ST7789') {
          code = `if(chatRole == "Assistant"){
            g_display->SetChatMessage(Display::Role::kAssistant, ${ai_vox_content});
          }else if(chatRole == "User"){
            g_display->SetChatMessage(Display::Role::kUser, ${ai_vox_content});
          }else{  
            g_display->SetChatMessage(Display::Role::kSystem, ${ai_vox_content});
          }\n`;
        } else if (display_type === 'SSD1306') {
          code = `if(chatRole == "Assistant"){
            g_display->SetChatMessage(${ai_vox_content});
          }else if(chatRole == "User"){
            g_display->SetChatMessage(${ai_vox_content});
          }else{  
            g_display->SetChatMessage(${ai_vox_content});
          }\n`;
        }
      }
    }else{
      if (display_type !== 'NONE') {
        code = `g_display->${location}(${ai_vox_content});\n`;
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
  let message = `message`;
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
    // let mcp_control_count = generator.valueToCode(block, 'COUNT', generator.ORDER_ATOMIC) || 0;

    // 获取到的数据为 "led", "LED, true for on, false for off"格式, 需要提取变量名和描述
    // 使用正则表达式来正确解析，避免描述中的逗号影响分割
    let match = mcp_control_name.match(/"([^"]+)",\s*"([^"]+)"/);
    // let match = mcp_control_name.match(/"([^"]*)",\s*"([^"]*)"",\s*(\d+)/);
    let name = match ? match[1] : '';
    let description = match ? match[2] : '';
    // let count = match ? match[3] : 1;
    let control_name_set = "self." + name + ".set";
    let control_name_get = "self." + name + ".get";

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
    if (paramValues.length > 0) {
        paramCodes = paramValues.map(param => `{${param}},`).join('\n                        ');
    } else {
        paramCodes = '';
    }

    generator.addObject('ai_vox_engine', `auto& ai_vox_engine = ai_vox::Engine::GetInstance();`, true);
    generator.addSetup(`aivox_instance`, `ai_vox_engine.SetObserver(g_observer);\n`, true);
    // generator.addObject(`ai_vox_mcp_${name}_count`, `int ${name}_count = ${count};`, true);
    generator.addSetup(`aivox_add_mcp_tool_set_${name}`, `  ai_vox_engine.AddMcpTool("${control_name_set}",                                           // tool name
                    "${description}",
                    {
                      ${paramCodes}
                    }
  );\n`, true);
    generator.addSetup(`aivox_add_mcp_tool_get_${name}`, `  ai_vox_engine.AddMcpTool("${control_name_get}",                                           // tool name
                    "${description}", 
                    {
                      ${paramCodes}
                    }
  );\n`, true);
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
            varField.setValidator(function(newName) {
                const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
                const oldName = block._aivoxVarLastName;
                if (workspace && newName && newName !== oldName) {
                    // 更新AIVOX控制服务名称
                    const oldService = getAivoxControlService(oldName);
                    if (oldService) {
                        deleteAivoxControlService(oldName);
                        registerAivoxControlService(newName, oldService.description, oldService.params);
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
            varField.setValidator(function(newName) {
                const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
                const oldName = block._stateVarLastName;
                if (workspace && newName && newName !== oldName) {
                    // 删除旧参数，注册新参数
                    const oldParam = getMcpControlParam(oldName);
                    if (oldParam) {
                        deleteMcpControlParam(oldName);
                        registerMcpControlParam(newName, oldParam.type, oldParam.minValue, oldParam.maxValue);
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
        console.warn(`Invalid parameter type: ${configOption}`);
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
            console.warn(`Invalid number range: min=${minValue}, max=${maxValue}`);
        }
        
        code = '\"' + varName + '\", ai_vox::ParamSchema<int64_t>{.default_value = std::nullopt, .min = ' + minValue + ', .max = ' + maxValue + '},';
        registerMcpControlParam(varName, 'Number', minValue, maxValue);
    } else if (configOption === 'String') {
        code = '\"' + varName + '\", ai_vox::ParamSchema<std::string>{.default_value = std::nullopt},';
        registerMcpControlParam(varName, 'String');
    }

    return [code, Arduino.ORDER_ATOMIC];
};


Arduino.forBlock['aivox_get_iot_message_event_name_new'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : '';
    
    // 验证服务是否存在
    const service = getAivoxControlService(varName);
    if (!service) {
        console.warn(`AIVOX service '${varName}' not found`);
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
        console.warn(`AIVOX service '${varName}' not found`);
    }
    
    if (!param) {
        console.warn(`MCP parameter '${pvarName}' not found`);
    }
    
    // 根据参数类型生成相应的代码
    let cType = "bool";
    if (param.type === "Number") cType = "int64_t";
    if (param.type === "String") cType = "std::string";
    
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
        console.warn(`AIVOX service '${varName}' not found`);
    }
    generator.addObject(`g_${varName}_res`, `bool g_${varName}_res = false;`, true);
    const code = `  ai_vox_engine.SendMcpCallResponse(id, true);\n`;
    return code;
};

Arduino.forBlock['aivox_update_mcp_control_state_new'] = function(block, generator) {
    const eventVar = getEventVarName(block);
    // 获取变量字段值
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'led';
    const paramField = block.getField('PVAR');
    const paramName = paramField ? paramField.getText() : 'led';
    const param = getMcpControlParam(paramName);

    if (!param) {
        console.error(`[aivox_update_mcp_control_state_new] Parameter '${paramName}' not found.`);
        // 返回一段注释掉的错误信息，这样可以让生成的代码继续编译，但会提示错误
        return `// Error: Parameter '${paramName}' not found. Cannot update MCP control state.`;
    }

    console.log("aivox_update_mcp_control_state_new ====: ", param);
    let type = param.type;
    let state = generator.valueToCode(block, 'STATE', generator.ORDER_ATOMIC) || '""';
    // 验证服务是否存在
    const service = getAivoxControlService(varName);
    if (!service) {
        console.warn(`AIVOX service '${varName}' not found`);
    }

    let cType = "bool";
    if (param.type === "Number") cType = "int64_t";
    if (param.type === "String") cType = "std::string";
    
    let setCode = `
    if ("self.${varName}.set" == name) {
        const ${cType}* param_ptr = event.param<${cType}>("${paramName}");
        if (param_ptr != nullptr) {
            ${state} = *param_ptr; // 解引用指针
        } else {
            printf("Warning: Parameter '${paramName}' not found for 'self.${varName}.set'.\\n");
        }
        ai_vox_engine.SendMcpCallResponse(id, true);
    }`;

    // 为 'get' 请求生成代码
    let getCode = `
    else if ("self.${varName}.get" == name) {
        ai_vox_engine.SendMcpCallResponse(id, ${state});
    }`;

    const code = setCode + getCode;
    return code;
}






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
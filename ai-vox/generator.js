// 检查并移除已存在的扩展注册
if (Blockly.Extensions.isRegistered('aivox3_init_wifi_extension')) {
  Blockly.Extensions.unregister('aivox3_init_wifi_extension');
}

if (Blockly.Extensions.isRegistered('aivox_init_mic_extension')) {
  Blockly.Extensions.unregister('aivox_init_mic_extension');
}

if (Blockly.Extensions.isRegistered('aivox_init_audio_extension')) {
  Blockly.Extensions.unregister('aivox_init_audio_extension');
}

if (Blockly.Extensions.isRegistered('aivox3_init_es8311_extension')) {
  Blockly.Extensions.unregister('aivox3_init_es8311_extension');
}

if (Blockly.Extensions.isRegistered('aivox3_mcp_control_param_extension')) {
  Blockly.Extensions.unregister('aivox3_mcp_control_param_extension');
}

var bclkPinList = [["GPIO5","5"],["GPIO0","0"],["GPIO1","1"],["GPIO2","2"],["GPIO3","3"],["GPIO4","4"],["GPIO5","5"],["GPIO6","6"],["GPIO7","7"],["GPIO8","8"],["GPIO9","9"],["GPIO10","10"],["GPIO11","11"],["GPIO12","12"],["GPIO13","13"],["GPIO14","14"],["GPIO15","15"],["GPIO16","16"],["GPIO17","17"],["GPIO18","18"],["GPIO19","19"],["GPIO20","20"],["GPIO21","21"],["GPIO35","35"],["GPIO36","36"],["GPIO37","37"],["GPIO38","38"],["GPIO39","39"],["GPIO40","40"],["GPIO41","41"],["GPIO42","42"],["GPIO43","43"],["GPIO44","44"],["GPIO45","45"],["GPIO46","46"],["GPIO47","47"],["GPIO48","48"]];
var wsPinList = [["GPIO2","2"],["GPIO0","0"],["GPIO1","1"],["GPIO2","2"],["GPIO3","3"],["GPIO4","4"],["GPIO5","5"],["GPIO6","6"],["GPIO7","7"],["GPIO8","8"],["GPIO9","9"],["GPIO10","10"],["GPIO11","11"],["GPIO12","12"],["GPIO13","13"],["GPIO14","14"],["GPIO15","15"],["GPIO16","16"],["GPIO17","17"],["GPIO18","18"],["GPIO19","19"],["GPIO20","20"],["GPIO21","21"],["GPIO35","35"],["GPIO36","36"],["GPIO37","37"],["GPIO38","38"],["GPIO39","39"],["GPIO40","40"],["GPIO41","41"],["GPIO42","42"],["GPIO43","43"],["GPIO44","44"],["GPIO45","45"],["GPIO46","46"],["GPIO47","47"],["GPIO48","48"]];
var micDinPinList = [["GPIO4","4"],["GPIO0","0"],["GPIO1","1"],["GPIO2","2"],["GPIO3","3"],["GPIO4","4"],["GPIO5","5"],["GPIO6","6"],["GPIO7","7"],["GPIO8","8"],["GPIO9","9"],["GPIO10","10"],["GPIO11","11"],["GPIO12","12"],["GPIO13","13"],["GPIO14","14"],["GPIO15","15"],["GPIO16","16"],["GPIO17","17"],["GPIO18","18"],["GPIO19","19"],["GPIO20","20"],["GPIO21","21"],["GPIO35","35"],["GPIO36","36"],["GPIO37","37"],["GPIO38","38"],["GPIO39","39"],["GPIO40","40"],["GPIO41","41"],["GPIO42","42"],["GPIO43","43"],["GPIO44","44"],["GPIO45","45"],["GPIO46","46"],["GPIO47","47"],["GPIO48","48"]];
// var doutPinList = [["GPIO9","9"],["GPIO0","0"],["GPIO1","1"],["GPIO2","2"],["GPIO3","3"],["GPIO4","4"],["GPIO5","5"],["GPIO6","6"],["GPIO7","7"],["GPIO8","8"],["GPIO9","9"],["GPIO10","10"],["GPIO11","11"],["GPIO12","12"],["GPIO13","13"],["GPIO14","14"],["GPIO15","15"],["GPIO16","16"],["GPIO17","17"],["GPIO18","18"],["GPIO19","19"],["GPIO20","20"],["GPIO21","21"],["GPIO35","35"],["GPIO36","36"],["GPIO37","37"],["GPIO38","38"],["GPIO39","39"],["GPIO40","40"],["GPIO41","41"],["GPIO42","42"],["GPIO43","43"],["GPIO44","44"],["GPIO45","45"],["GPIO46","46"],["GPIO47","47"],["GPIO48","48"]];

Blockly.Extensions.register('aivox_init_mic_extension', function () {
  // 直接在扩展中添加updateShape_函数
  this.updateShape_ = function (boardType) {
    if(boardType.indexOf('aivox') > -1) {
        this.appendDummyInput('')
        .appendField("初始化标准I2S麦克风引脚 BCLK")
        .appendField(new Blockly.FieldDropdown(bclkPinList), "MIC_BCLK")
        .appendField("WS引脚")
        .appendField(new Blockly.FieldDropdown(wsPinList), "MIC_WS")
        .appendField("DIN引脚")
        .appendField(new Blockly.FieldDropdown(micDinPinList), "MIC_DIN")   
        //  this.appendDummyInput('')
        //   .appendField("扬声器BCLK引脚")
        // .appendField(new Blockly.FieldDropdown([
        //     ["GPIO13", "13"]]), "SPK_BCLK")
        // .appendField("WS引脚")
        // .appendField(new Blockly.FieldDropdown([
        //     ["GPIO14", "14"]]), "SPK_WS")
        // .appendField("DOUT引脚")
        // .appendField(new Blockly.FieldDropdown([
        //     ["GPIO1", "1"]]), "SPK_DOUT") 
        //  this.appendDummyInput('')
        //   .appendField("Trigger触发引脚")
        // .appendField(new Blockly.FieldDropdown([
        //     ["GPIO0", "0"]]), "TRIGGER_PIN")    
    } else {
        let pins = window['boardConfig'].digitalPins;
        this.appendDummyInput('')
        .appendField("初始化小智AI麦克风(标准I2S)引脚 BCLK")
        .appendField(new Blockly.FieldDropdown(pins), "MIC_BCLK")
        .appendField("WS引脚")
        .appendField(new Blockly.FieldDropdown(pins), "MIC_WS")
        .appendField("DIN引脚")
        .appendField(new Blockly.FieldDropdown(pins), "MIC_DIN")   
        //  this.appendDummyInput('')
        //   .appendField("扬声器功放引脚 BCLK")
        // .appendField(new Blockly.FieldDropdown(pins), "SPK_BCLK")
        // .appendField("WS引脚")
        // .appendField(new Blockly.FieldDropdown(pins), "SPK_WS")
        // .appendField("DOUT引脚")
        // .appendField(new Blockly.FieldDropdown(pins), "SPK_DOUT") 
        //  this.appendDummyInput('')
        //   .appendField("Trigger触发引脚")
        // .appendField(new Blockly.FieldDropdown(pins), "TRIGGER_PIN")    
    }
  };
  this.updateShape_(window['boardConfig'].name);
});
                      
var spkBclkPinList = [["GPIO13","13"],["GPIO0","0"],["GPIO1","1"],["GPIO2","2"],["GPIO3","3"],["GPIO4","4"],["GPIO5","5"],["GPIO6","6"],["GPIO7","7"],["GPIO8","8"],["GPIO9","9"],["GPIO10","10"],["GPIO11","11"],["GPIO12","12"],["GPIO13","13"],["GPIO14","14"],["GPIO15","15"],["GPIO16","16"],["GPIO17","17"],["GPIO18","18"],["GPIO19","19"],["GPIO20","20"],["GPIO21","21"],["GPIO35","35"],["GPIO36","36"],["GPIO37","37"],["GPIO38","38"],["GPIO39","39"],["GPIO40","40"],["GPIO41","41"],["GPIO42","42"],["GPIO43","43"],["GPIO44","44"],["GPIO45","45"],["GPIO46","46"],["GPIO47","47"],["GPIO48","48"]];
var spkWsPinList = [["GPIO14","14"],["GPIO0","0"],["GPIO1","1"],["GPIO2","2"],["GPIO3","3"],["GPIO4","4"],["GPIO5","5"],["GPIO6","6"],["GPIO7","7"],["GPIO8","8"],["GPIO9","9"],["GPIO10","10"],["GPIO11","11"],["GPIO12","12"],["GPIO13","13"],["GPIO14","14"],["GPIO15","15"],["GPIO16","16"],["GPIO17","17"],["GPIO18","18"],["GPIO19","19"],["GPIO20","20"],["GPIO21","21"],["GPIO35","35"],["GPIO36","36"],["GPIO37","37"],["GPIO38","38"],["GPIO39","39"],["GPIO40","40"],["GPIO41","41"],["GPIO42","42"],["GPIO43","43"],["GPIO44","44"],["GPIO45","45"],["GPIO46","46"],["GPIO47","47"],["GPIO48","48"]];
var spkDoutPinList = [["GPIO1","1"],["GPIO0","0"],["GPIO1","1"],["GPIO2","2"],["GPIO3","3"],["GPIO4","4"],["GPIO5","5"],["GPIO6","6"],["GPIO7","7"],["GPIO8","8"],["GPIO9","9"],["GPIO10","10"],["GPIO11","11"],["GPIO12","12"],["GPIO13","13"],["GPIO14","14"],["GPIO15","15"],["GPIO16","16"],["GPIO17","17"],["GPIO18","18"],["GPIO19","19"],["GPIO20","20"],["GPIO21","21"],["GPIO35","35"],["GPIO36","36"],["GPIO37","37"],["GPIO38","38"],["GPIO39","39"],["GPIO40","40"],["GPIO41","41"],["GPIO42","42"],["GPIO43","43"],["GPIO44","44"],["GPIO45","45"],["GPIO46","46"],["GPIO47","47"],["GPIO48","48"]];

Blockly.Extensions.register('aivox_init_audio_extension', function () {
  // 直接在扩展中添加updateShape_函数
  this.updateShape_ = function (boardType) {
    if(boardType.indexOf('aivox') > -1) {
        // this.appendDummyInput('')
        // .appendField("初始化 AI-VOX (标准I2S) 麦克风引脚 BCLK")
        // .appendField(new Blockly.FieldDropdown([
        //     ["GPIO5", "5"]]), "MIC_BCLK")
        // .appendField("WS引脚")
        // .appendField(new Blockly.FieldDropdown([
        //     ["GPIO2", "2"]]), "MIC_WS")
        // .appendField("DIN引脚")
        // .appendField(new Blockly.FieldDropdown([
        //     ["GPIO4", "4"]]), "MIC_DIN")   
         this.appendDummyInput('')
          .appendField("初始化标准I2S音频解码器BCLK引脚")
        .appendField(new Blockly.FieldDropdown(spkBclkPinList), "SPK_BCLK")
        .appendField("WS引脚")
        .appendField(new Blockly.FieldDropdown(spkWsPinList), "SPK_WS")
        .appendField("DOUT引脚")
        .appendField(new Blockly.FieldDropdown(spkDoutPinList), "SPK_DOUT") 
        //  this.appendDummyInput('')
        //   .appendField("Trigger触发引脚")
        // .appendField(new Blockly.FieldDropdown([
        //     ["GPIO0", "0"]]), "TRIGGER_PIN")    
    } else {
        let pins = window['boardConfig'].digitalPins;
        // this.appendDummyInput('')
        // .appendField("初始化小智AI麦克风(标准I2S)引脚 BCLK")
        // .appendField(new Blockly.FieldDropdown(pins), "MIC_BCLK")
        // .appendField("WS引脚")
        // .appendField(new Blockly.FieldDropdown(pins), "MIC_WS")
        // .appendField("DIN引脚")
        // .appendField(new Blockly.FieldDropdown(pins), "MIC_DIN")   
        this.appendDummyInput('')
        .appendField("扬声器功放引脚 BCLK")
        .appendField(new Blockly.FieldDropdown(pins), "SPK_BCLK")
        .appendField("WS引脚")
        .appendField(new Blockly.FieldDropdown(pins), "SPK_WS")
        .appendField("DOUT引脚")
        .appendField(new Blockly.FieldDropdown(pins), "SPK_DOUT") 
        //  this.appendDummyInput('')
        //   .appendField("Trigger触发引脚")
        // .appendField(new Blockly.FieldDropdown(pins), "TRIGGER_PIN")    
    }
  };
  this.updateShape_(window['boardConfig'].name);
});

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

Blockly.Extensions.register('aivox3_init_wifi_extension', function () {
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

var sdaPinList = [["GPIO13","13"],["GPIO0","0"],["GPIO1","1"],["GPIO2","2"],["GPIO3","3"],["GPIO4","4"],["GPIO5","5"],["GPIO6","6"],["GPIO7","7"],["GPIO8","8"],["GPIO9","9"],["GPIO10","10"],["GPIO11","11"],["GPIO12","12"],["GPIO13","13"],["GPIO14","14"],["GPIO15","15"],["GPIO16","16"],["GPIO17","17"],["GPIO18","18"],["GPIO19","19"],["GPIO20","20"],["GPIO21","21"],["GPIO35","35"],["GPIO36","36"],["GPIO37","37"],["GPIO38","38"],["GPIO39","39"],["GPIO40","40"],["GPIO41","41"],["GPIO42","42"],["GPIO43","43"],["GPIO44","44"],["GPIO45","45"],["GPIO46","46"],["GPIO47","47"],["GPIO48","48"]];
var sclPinList = [["GPIO12","12"],["GPIO0","0"],["GPIO1","1"],["GPIO2","2"],["GPIO3","3"],["GPIO4","4"],["GPIO5","5"],["GPIO6","6"],["GPIO7","7"],["GPIO8","8"],["GPIO9","9"],["GPIO10","10"],["GPIO11","11"],["GPIO12","12"],["GPIO13","13"],["GPIO14","14"],["GPIO15","15"],["GPIO16","16"],["GPIO17","17"],["GPIO18","18"],["GPIO19","19"],["GPIO20","20"],["GPIO21","21"],["GPIO35","35"],["GPIO36","36"],["GPIO37","37"],["GPIO38","38"],["GPIO39","39"],["GPIO40","40"],["GPIO41","41"],["GPIO42","42"],["GPIO43","43"],["GPIO44","44"],["GPIO45","45"],["GPIO46","46"],["GPIO47","47"],["GPIO48","48"]];
var mclkPinList = [["GPIO11","11"],["GPIO0","0"],["GPIO1","1"],["GPIO2","2"],["GPIO3","3"],["GPIO4","4"],["GPIO5","5"],["GPIO6","6"],["GPIO7","7"],["GPIO8","8"],["GPIO9","9"],["GPIO10","10"],["GPIO11","11"],["GPIO12","12"],["GPIO13","13"],["GPIO14","14"],["GPIO15","15"],["GPIO16","16"],["GPIO17","17"],["GPIO18","18"],["GPIO19","19"],["GPIO20","20"],["GPIO21","21"],["GPIO35","35"],["GPIO36","36"],["GPIO37","37"],["GPIO38","38"],["GPIO39","39"],["GPIO40","40"],["GPIO41","41"],["GPIO42","42"],["GPIO43","43"],["GPIO44","44"],["GPIO45","45"],["GPIO46","46"],["GPIO47","47"],["GPIO48","48"]];
var sclkPinList = [["GPIO10","10"],["GPIO0","0"],["GPIO1","1"],["GPIO2","2"],["GPIO3","3"],["GPIO4","4"],["GPIO5","5"],["GPIO6","6"],["GPIO7","7"],["GPIO8","8"],["GPIO9","9"],["GPIO10","10"],["GPIO11","11"],["GPIO12","12"],["GPIO13","13"],["GPIO14","14"],["GPIO15","15"],["GPIO16","16"],["GPIO17","17"],["GPIO18","18"],["GPIO19","19"],["GPIO20","20"],["GPIO21","21"],["GPIO35","35"],["GPIO36","36"],["GPIO37","37"],["GPIO38","38"],["GPIO39","39"],["GPIO40","40"],["GPIO41","41"],["GPIO42","42"],["GPIO43","43"],["GPIO44","44"],["GPIO45","45"],["GPIO46","46"],["GPIO47","47"],["GPIO48","48"]];
var lrckPinList = [["GPIO8","8"],["GPIO0","0"],["GPIO1","1"],["GPIO2","2"],["GPIO3","3"],["GPIO4","4"],["GPIO5","5"],["GPIO6","6"],["GPIO7","7"],["GPIO8","8"],["GPIO9","9"],["GPIO10","10"],["GPIO11","11"],["GPIO12","12"],["GPIO13","13"],["GPIO14","14"],["GPIO15","15"],["GPIO16","16"],["GPIO17","17"],["GPIO18","18"],["GPIO19","19"],["GPIO20","20"],["GPIO21","21"],["GPIO35","35"],["GPIO36","36"],["GPIO37","37"],["GPIO38","38"],["GPIO39","39"],["GPIO40","40"],["GPIO41","41"],["GPIO42","42"],["GPIO43","43"],["GPIO44","44"],["GPIO45","45"],["GPIO46","46"],["GPIO47","47"],["GPIO48","48"]];
var dinPinList = [["GPIO7","7"],["GPIO0","0"],["GPIO1","1"],["GPIO2","2"],["GPIO3","3"],["GPIO4","4"],["GPIO5","5"],["GPIO6","6"],["GPIO7","7"],["GPIO8","8"],["GPIO9","9"],["GPIO10","10"],["GPIO11","11"],["GPIO12","12"],["GPIO13","13"],["GPIO14","14"],["GPIO15","15"],["GPIO16","16"],["GPIO17","17"],["GPIO18","18"],["GPIO19","19"],["GPIO20","20"],["GPIO21","21"],["GPIO35","35"],["GPIO36","36"],["GPIO37","37"],["GPIO38","38"],["GPIO39","39"],["GPIO40","40"],["GPIO41","41"],["GPIO42","42"],["GPIO43","43"],["GPIO44","44"],["GPIO45","45"],["GPIO46","46"],["GPIO47","47"],["GPIO48","48"]];
var doutPinList = [["GPIO9","9"],["GPIO0","0"],["GPIO1","1"],["GPIO2","2"],["GPIO3","3"],["GPIO4","4"],["GPIO5","5"],["GPIO6","6"],["GPIO7","7"],["GPIO8","8"],["GPIO9","9"],["GPIO10","10"],["GPIO11","11"],["GPIO12","12"],["GPIO13","13"],["GPIO14","14"],["GPIO15","15"],["GPIO16","16"],["GPIO17","17"],["GPIO18","18"],["GPIO19","19"],["GPIO20","20"],["GPIO21","21"],["GPIO35","35"],["GPIO36","36"],["GPIO37","37"],["GPIO38","38"],["GPIO39","39"],["GPIO40","40"],["GPIO41","41"],["GPIO42","42"],["GPIO43","43"],["GPIO44","44"],["GPIO45","45"],["GPIO46","46"],["GPIO47","47"],["GPIO48","48"]];


Blockly.Extensions.register('aivox3_init_es8311_extension', function () {
    // 直接在扩展中添加updateShape_函数
  this.updateShape_ = function (boardType) {
    if(boardType.indexOf('aivox') > -1) {
      // let pins = window['boardConfig'].digitalPins;
        this.appendDummyInput('')
        .appendField("初始化ES8311音频编解码器")
        this.appendDummyInput('')
        .appendField("SDA引脚")
        .appendField(new Blockly.FieldDropdown(sdaPinList), "ES8311_SDA")
        this.appendDummyInput('')
        .appendField("SCL引脚")
        .appendField(new Blockly.FieldDropdown(sclPinList), "ES8311_SCL")
        this.appendDummyInput('')
        .appendField("MCLK引脚")
        .appendField(new Blockly.FieldDropdown(mclkPinList), "ES8311_MCLK")   
        this.appendDummyInput('')
          .appendField("SCLK引脚")
        .appendField(new Blockly.FieldDropdown(sclkPinList), "ES8311_SCLK")
        this.appendDummyInput('')
        .appendField("LRCK引脚")
        .appendField(new Blockly.FieldDropdown(lrckPinList), "ES8311_LRCK")
        this.appendDummyInput('')
        .appendField("DIN引脚")
        .appendField(new Blockly.FieldDropdown(dinPinList), "ES8311_DSDIN") 
        this.appendDummyInput('')
        .appendField("DOUT引脚")
        .appendField(new Blockly.FieldDropdown(doutPinList), "ES8311_DSDOUT") 
        this.appendValueInput('ES8311_I2C_ADDRESS')
        .setCheck('Number')
        .appendField("I2C地址");
        this.appendValueInput('ES8311_RATE')
        .setCheck('Number')
        .appendField("采样率");
    } else {
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
    }
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

// AIVOX wifi init
Arduino.forBlock['aivox3_init_wifi'] = function (block, generator) {
    let configOption = block.getFieldValue('MODE');
    let code = ``;
    generator.addObject('aivox3_kSmartConfigType', `constexpr smartconfig_type_t kSmartConfigType = SC_TYPE_ESPTOUCH;`, true);
    if(configOption == 'Manual') {
        
        let wifi_ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
        let wifi_pwd = generator.valueToCode(block, 'PSWD', generator.ORDER_ATOMIC) || '""';
        generator.addVariable('aivox3_wifi_ssid_define', `#define WIFI_SSID ${wifi_ssid}`);
        generator.addVariable('aivox3_wifi_pwd_define', `#define WIFI_PASSWORD ${wifi_pwd}`);
        // wifi_configurator->Start(WIFI_SSID, WIFI_PASSWORD);
        code = `  auto wifi_configurator = std::make_unique<WifiConfigurator>(WiFi, kSmartConfigType);\n  wifi_configurator->Start(WIFI_SSID, WIFI_PASSWORD);\n`;
        generator.addSetup(`aivox_wifi_configurator`, code, true);

    } else{
        generator.addObject('aivox3_kSmartConfigType', `smartconfig_type_t kSmartConfigType = ${configOption};`, true);
        code = `  auto wifi_configurator = std::make_unique<WifiConfigurator>(WiFi, kSmartConfigType);\n  wifi_configurator->Start();\n`;
        generator.addSetup(`aivox_wifi_configurator`, code, true);

    }
    generator.addLibrary('aivox3_engine', '#include "ai_vox_engine.h"\n');
    generator.addLibrary('aivox3_wifi_init', 
        '#include <WiFi.h>\n#include <driver/spi_common.h>\n#include <esp_heap_caps.h>\n#include "components/wifi_configurator/wifi_configurator.h"\n');
    return '';
  };
  
Arduino.forBlock['aivox3_get_wifi_state'] = function(block, generator) {
    const code = `wifi_configurator->WaitStateChanged()`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox3_wifi_state'] = function(block, generator) {
    const state = block.getFieldValue('STATE');
    const code = `wifi_configurator->WaitStateChanged() == WifiConfigurator::State::${state}`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox3_init_es8311'] = function(block, generator) {
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
    generator.addLibrary('inclue_aivox3_engine', '#include "ai_vox_engine.h"\n');
    generator.addLibrary('include_i2c_master', '#include <driver/i2c_master.h>\n');
    generator.addLibrary('aivox3_es8311_library', '#include "components/espressif/esp_audio_codec/esp_audio_simple_dec.h"\n#include "audio_device/audio_device_es8311.h"\n');
    generator.addObject('aivox3_audio_device_es8311', 'i2c_master_bus_handle_t g_i2c_master_bus_handle = nullptr;\nstd::shared_ptr<ai_vox::AudioDeviceEs8311> g_audio_output_device;', true);
    generator.addObject('aivox3_audio_device_es8311_input', 'std::shared_ptr<ai_vox::AudioDeviceEs8311> g_audio_input_device;', true);

    generator.addObject('aivox3_initI2C', `void InitI2cBus() {
    const i2c_master_bus_config_t i2c_master_bus_config = {
        .i2c_port = I2C_NUM_1,
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
    generator.addSetup("aivox3_setup_es8311", `  g_audio_output_device = std::make_shared<ai_vox::AudioDeviceEs8311>(g_i2c_master_bus_handle, ${es8311_i2c_address}, I2C_NUM_1, ${es8311_rate}, GPIO_NUM_${es8311_mclk}, GPIO_NUM_${es8311_sclk}, GPIO_NUM_${es8311_lrck}, GPIO_NUM_${es8311_dsdout}, GPIO_NUM_${es8311_dsdin});`);
    
    return '';
}


// aivox3_set_es8311_volume
Arduino.forBlock['aivox3_set_es8311_volume'] = function(block, generator) {
    const aivox3_es8311_volume = generator.valueToCode(block, 'aivox3_es8311_volume', generator.ORDER_ATOMIC) || '""';
    // generator.addSetup("aivox3_setup_es8311", `  g_audio_device_es8311 = std::make_shared<ai_vox::AudioDeviceEs8311>(g_i2c_master_bus_handle, ${es8311_i2c_address}, I2C_NUM_1, ${es8311_rate}, GPIO_NUM_${es8311_mclk}, GPIO_NUM_${es8311_sclk}, GPIO_NUM_${es8311_lrck}, GPIO_NUM_${es8311_dsdout}, GPIO_NUM_${es8311_dsdin});`);
    return `g_audio_output_device->set_volume(${aivox3_es8311_volume});\n`;
}

Arduino.forBlock['aivox3_set_screen_light'] = function(block, generator) {
    const aivox3_screen_light = generator.valueToCode(block, 'aivox3_screen_light', generator.ORDER_ATOMIC) || '""';
    // generator.addSetup("aivox3_setup_es8311", `  g_audio_device_es8311 = std::make_shared<ai_vox::AudioDeviceEs8311>(g_i2c_master_bus_handle, ${es8311_i2c_address}, I2C_NUM_1, ${es8311_rate}, GPIO_NUM_${es8311_mclk}, GPIO_NUM_${es8311_sclk}, GPIO_NUM_${es8311_lrck}, GPIO_NUM_${es8311_dsdout}, GPIO_NUM_${es8311_dsdin});`);
    return `analogWrite(kDisplayBacklightPin, ${aivox3_screen_light});\n`;
}

Arduino.forBlock['aivox_init_mic'] = function(block, generator) {
    const micBclk = block.getFieldValue('MIC_BCLK');
    const micWs = block.getFieldValue('MIC_WS');
    const micDin = block.getFieldValue('MIC_DIN');

    // const spkBclk = block.getFieldValue('SPK_BCLK');
    // const spkWs = block.getFieldValue('SPK_WS');
    // const spkDout = block.getFieldValue('SPK_DOUT');
    // const triggerPin = block.getFieldValue('TRIGGER_PIN');

    // Add Libraries
    generator.addLibrary('include_aivox_engine', '#include "ai_vox_engine.h"');
    generator.addLibrary('include_aivox_observer', '#include "ai_vox_observer.h"');
    generator.addLibrary('include_i2s_std_input', '#include "audio_input_device_sph0645.h"');
    // #include "audio_device/audio_output_device_i2s_std.h"
    // generator.addLibrary('include_i2s_std_output', '#include "audio_device/audio_output_device_i2s_std.h"');
    generator.addLibrary('include_aivox_button', '#include "components/espressif/button/button_gpio.h"\n#include "components/espressif/button/iot_button.h"\n');

    // Add Objects
    generator.addObject('aivox_observer', 'auto g_observer = std::make_shared<ai_vox::Observer>();', true);
 
    generator.addObject('aivox_kMicPinBclk', `constexpr gpio_num_t kMicPinBclk = GPIO_NUM_${micBclk};`, true);
    generator.addObject('aivox_kMicPinWs', `constexpr gpio_num_t kMicPinWs = GPIO_NUM_${micWs};`, true);
    generator.addObject('aivox_kMicPinDin', `constexpr gpio_num_t kMicPinDin = GPIO_NUM_${micDin};`, true);

    // generator.addObject('aivox_kSpeakerPinBclk', `constexpr gpio_num_t kSpeakerPinBclk = GPIO_NUM_${spkBclk};`, true);
    // generator.addObject('aivox_kSpeakerPinWs', `constexpr gpio_num_t kSpeakerPinWs = GPIO_NUM_${spkWs};`, true);
    // generator.addObject('aivox_kSpeakerPinDout', `constexpr gpio_num_t kSpeakerPinDout = GPIO_NUM_${spkDout};`, true);

    // generator.addObject('aivox_kTriggerPin', `constexpr gpio_num_t kTriggerPin = GPIO_NUM_${triggerPin};`, true);
    generator.addObject('aivox_input_device', `auto g_audio_input_device = std::make_shared<AudioInputDeviceSph0645>(kMicPinBclk, kMicPinWs, kMicPinDin);`, true);
    // generator.addObject('aivox_output_device', `auto g_audio_output_device = std::make_shared<ai_vox::AudioOutputDeviceI2sStd>(kSpeakerPinBclk, kSpeakerPinWs, kSpeakerPinDout);`, true);
    //   auto& ai_vox_engine = ai_vox::Engine::GetInstance();
    generator.addObject('ai_vox_engine', `auto& ai_vox_engine = ai_vox::Engine::GetInstance();`, true);
    generator.addSetup(' button_config_t_btn_cfg ',`const button_config_t btn_cfg = {
      .long_press_time = 1000,
      .short_press_time = 50,
  };

  const button_gpio_config_t gpio_cfg = {
      .gpio_num = GPIO_NUM_0,
      .active_level = 0,
      .enable_power_save = false,
      .disable_pull = false,
  };`, false);
    // Add Setup code
    const setupCode = `
  ai_vox_engine.SetObserver(g_observer);
`;
    // generator.addSetup('aivox_serial', "Serial.begin(115200);", false);
    // generator.addSetup('aivox_setObserver', setupCode, false);
    return ''; // This block generates setup code, not loop code.
};

Arduino.forBlock['aivox_init_audio'] = function(block, generator) {
    // const micBclk = block.getFieldValue('MIC_BCLK');
    // const micWs = block.getFieldValue('MIC_WS');
    // const micDin = block.getFieldValue('MIC_DIN');

    const spkBclk = block.getFieldValue('SPK_BCLK');
    const spkWs = block.getFieldValue('SPK_WS');
    const spkDout = block.getFieldValue('SPK_DOUT');
    // const triggerPin = block.getFieldValue('TRIGGER_PIN');

    // Add Libraries
    generator.addLibrary('include_aivox_engine', '#include "ai_vox_engine.h"');
    generator.addLibrary('include_aivox_observer', '#include "ai_vox_observer.h"');
    // generator.addLibrary('include_i2s_std_input', '#include "audio_input_device_sph0645.h"');
    // #include "audio_device/audio_output_device_i2s_std.h"
    generator.addLibrary('include_i2s_std_output', '#include "audio_device/audio_output_device_i2s_std.h"');
    generator.addLibrary('include_aivox_button', '#include "components/espressif/button/button_gpio.h"\n#include "components/espressif/button/iot_button.h"\n');

    // Add Objects
    generator.addObject('aivox_observer', 'auto g_observer = std::make_shared<ai_vox::Observer>();', true);
 
    // generator.addObject('aivox_kMicPinBclk', `constexpr gpio_num_t kMicPinBclk = GPIO_NUM_${micBclk};`, true);
    // generator.addObject('aivox_kMicPinWs', `constexpr gpio_num_t kMicPinWs = GPIO_NUM_${micWs};`, true);
    // generator.addObject('aivox_kMicPinDin', `constexpr gpio_num_t kMicPinDin = GPIO_NUM_${micDin};`, true);

    generator.addObject('aivox_kSpeakerPinBclk', `constexpr gpio_num_t kSpeakerPinBclk = GPIO_NUM_${spkBclk};`, true);
    generator.addObject('aivox_kSpeakerPinWs', `constexpr gpio_num_t kSpeakerPinWs = GPIO_NUM_${spkWs};`, true);
    generator.addObject('aivox_kSpeakerPinDout', `constexpr gpio_num_t kSpeakerPinDout = GPIO_NUM_${spkDout};`, true);

    // generator.addObject('aivox_kTriggerPin', `constexpr gpio_num_t kTriggerPin = GPIO_NUM_${triggerPin};`, true);
    // generator.addObject('aivox_input_device', `auto audio_input_device = std::make_shared<AudioInputDeviceSph0645>(kMicPinBclk, kMicPinWs, kMicPinDin);`, true);
    generator.addObject('aivox_output_device', `auto g_audio_output_device = std::make_shared<ai_vox::AudioOutputDeviceI2sStd>(kSpeakerPinBclk, kSpeakerPinWs, kSpeakerPinDout);`, true);
    //   auto& ai_vox_engine = ai_vox::Engine::GetInstance();
    generator.addObject('ai_vox_engine', `auto& ai_vox_engine = ai_vox::Engine::GetInstance();`, true);
    generator.addSetup(' button_config_t_btn_cfg ',`const button_config_t btn_cfg = {
      .long_press_time = 1000,
      .short_press_time = 50,
  };

  const button_gpio_config_t gpio_cfg = {
      .gpio_num = GPIO_NUM_0,
      .active_level = 0,
      .enable_power_save = false,
      .disable_pull = false,
  };`, false);
    // Add Setup code
    const setupCode = `
`;
    // generator.addSetup('aivox_serial', "Serial.begin(115200);", false);
    // generator.addSetup('aivox_setObserver', setupCode, false);
    return ''; // This block generates setup code, not loop code.
};

Arduino.forBlock['aivox_init_lcd'] = function(block, generator) {
  const backLight = block.getFieldValue('backLight');
    const mosi = block.getFieldValue('MOSI');
    const clk = block.getFieldValue('CLK');
    const dc = block.getFieldValue('DC');
    const rst = block.getFieldValue('RST');
    let rstpin = rst == "-1"?rst:`GPIO_NUM_${rst}`;
    const cs = block.getFieldValue('CS');
    const width = 240;
    const height = 240;

    generator.addLibrary('include_i2c_master', '#include <driver/i2c_master.h>\n');
    generator.addLibrary('include_aivox_esp_lcd_panel_io', '#include <esp_lcd_panel_io.h>');
    generator.addLibrary('include_aivox_esp_lcd_panel_ops', '#include <esp_lcd_panel_ops.h>');
    generator.addLibrary('include_aivox_esp_lcd_panel_vendor', '#include <esp_lcd_panel_vendor.h>');
    generator.addLibrary('include_aivox_button', '#include "components/espressif/button/button_gpio.h"\n#include "components/espressif/button/iot_button.h"\n');
    generator.addLibrary('include_aivox_display', '#include "display.h"');

    generator.addObject('aivox_backLight', `constexpr gpio_num_t kDisplayBacklightPin = GPIO_NUM_${backLight};`, true);
    // generator.addObject('aivox_mosi', `constexpr gpio_num_t kDisplayMosiPin = GPIO_NUM_${mosi};`, true);
    // generator.addObject('aivox_clk', `constexpr gpio_num_t kDisplayClkPin = GPIO_NUM_${clk};`, true);
    // generator.addObject('aivox_dc', `constexpr gpio_num_t kDisplayDcPin = GPIO_NUM_${dc};`, true);
    // generator.addObject('aivox_rst', `constexpr gpio_num_t kDisplayRstPin = GPIO_NUM_${rst};`, true);
    // generator.addObject('aivox_cs', `constexpr gpio_num_t kDisplayCsPin = GPIO_NUM_${cs};`, true);

    // generator.addObject('aivox_kDisplaySpiMode', `constexpr auto kDisplaySpiMode = 0;`, true);
    generator.addObject('aivox_width', `constexpr uint32_t kDisplayWidth = ${width};`, true);
    generator.addObject('aivox_height', `constexpr uint32_t kDisplayHeight =  ${height};`, true);
    generator.addObject('aivox_kDisplayMirrorX', `constexpr bool kDisplayMirrorX = false;`, true);
    generator.addObject('aivox_kDisplayMirrorY', `constexpr bool kDisplayMirrorY = false;`, true);
    generator.addObject('aivox_kDisplayInvertColor', `constexpr bool kDisplayInvertColor = true;`, true);
    generator.addObject('aivox_kDisplaySwapXY', `constexpr bool kDisplaySwapXY = false;`, true);
    generator.addObject('aivox_kDisplayRgbElementOrder', `constexpr auto kDisplayRgbElementOrder = LCD_RGB_ELEMENT_ORDER_RGB;`, true);

    generator.addObject('aivox_init_display_obj', `std::unique_ptr<Display> g_display;`, true);
    generator.addObject('g_button_boot_handle', `button_handle_t g_button_boot_handle = nullptr;`, true);
// button_handle_t g_button_boot_handle = nullptr;

    generator.addObject('aivox3_initDisplay', 
`void InitDisplay() {
  pinMode(GPIO_NUM_${backLight}, OUTPUT);
  analogWrite(GPIO_NUM_${backLight}, 255);
  spi_bus_config_t buscfg{
    .mosi_io_num = GPIO_NUM_${mosi},
    .miso_io_num = GPIO_NUM_NC,
    .sclk_io_num = GPIO_NUM_${clk},
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
  io_config.cs_gpio_num = GPIO_NUM_${cs};
  io_config.dc_gpio_num = GPIO_NUM_${dc};
  io_config.spi_mode = 0;
  io_config.pclk_hz = 40 * 1000 * 1000;
  io_config.trans_queue_depth = 10;
  io_config.lcd_cmd_bits = 8;
  io_config.lcd_param_bits = 8;
  ESP_ERROR_CHECK(esp_lcd_new_panel_io_spi(SPI3_HOST, &io_config, &panel_io));

  // 初始化液晶屏驱动芯片
  //   ESP_LOGD(TAG, "Install LCD driver");
  esp_lcd_panel_dev_config_t panel_config = {};
  panel_config.reset_gpio_num = ${rstpin};
  panel_config.rgb_ele_order = LCD_RGB_ELEMENT_ORDER_RGB;
  panel_config.bits_per_pixel = 16;
  ESP_ERROR_CHECK(esp_lcd_new_panel_st7789(panel_io, &panel_config, &panel));
  esp_lcd_panel_reset(panel);
  esp_lcd_panel_init(panel);
  esp_lcd_panel_invert_color(panel, kDisplayInvertColor);
  esp_lcd_panel_swap_xy(panel, kDisplaySwapXY);
  esp_lcd_panel_mirror(panel, kDisplayMirrorX, kDisplayMirrorY);
  g_display = std::make_unique<Display>(panel_io, panel, kDisplayWidth, kDisplayHeight, 0, 0, kDisplayMirrorX, kDisplayMirrorY, kDisplaySwapXY);
  g_display->Start();
}` , true);
    generator.addSetup(' button_config_t_btn_cfg ',`const button_config_t btn_cfg = {
      .long_press_time = 1000,
      .short_press_time = 50,
  };

  const button_gpio_config_t gpio_cfg = {
      .gpio_num = GPIO_NUM_0,
      .active_level = 0,
      .enable_power_save = false,
      .disable_pull = false,
  };
    ESP_ERROR_CHECK(iot_button_new_gpio_device(&btn_cfg, &gpio_cfg, &g_button_boot_handle));`, false);
    generator.addSetup('aivox_init_display', `  InitDisplay();`, false);
    return '';
}

var display_mode = '';
var display_role = '';
Arduino.forBlock['aivox_display_mode'] = function(block, generator) {
    display_mode = block.getFieldValue('display_mode');
    // generator.addObject('lcd_display_mode', `String display_mode = ${display_mode};`, true);
    return '';
  }

// Arduino.forBlock['aivox3_init_lcd'] = function(block, generator) {
//     const backLight = block.getFieldValue('backLight');
//     const mosi = block.getFieldValue('MOSI');
//     const clk = block.getFieldValue('CLK');
//     const dc = block.getFieldValue('DC');
//     const rst = block.getFieldValue('RST');
//     const cs = block.getFieldValue('CS');
//     const width = 240;
//     const height = 240;

//     generator.addLibrary('include_i2c_master', '#include <driver/i2c_master.h>\n');
//     generator.addLibrary('include_aivox_esp_lcd_panel_io', '#include <esp_lcd_panel_io.h>');
//     generator.addLibrary('include_aivox_esp_lcd_panel_ops', '#include <esp_lcd_panel_ops.h>');
//     generator.addLibrary('include_aivox_esp_lcd_panel_vendor', '#include <esp_lcd_panel_vendor.h>');

//     generator.addLibrary('include_aivox_display', '#include "display.h"');

//     // generator.addObject('aivox_backLight', `constexpr gpio_num_t kDisplayBacklightPin = GPIO_NUM_${backLight};`, true);
//     // generator.addObject('aivox_mosi', `constexpr gpio_num_t kDisplayMosiPin = GPIO_NUM_${mosi};`, true);
//     // generator.addObject('aivox_clk', `constexpr gpio_num_t kDisplayClkPin = GPIO_NUM_${clk};`, true);
//     // generator.addObject('aivox_dc', `constexpr gpio_num_t kDisplayDcPin = GPIO_NUM_${dc};`, true);
//     // generator.addObject('aivox_rst', `constexpr gpio_num_t kDisplayRstPin = GPIO_NUM_${rst};`, true);
//     // generator.addObject('aivox_cs', `constexpr gpio_num_t kDisplayCsPin = GPIO_NUM_${cs};`, true);

//     // generator.addObject('aivox_kDisplaySpiMode', `constexpr auto kDisplaySpiMode = 0;`, true);
//     generator.addObject('aivox_width', `constexpr uint32_t kDisplayWidth = ${width};`, true);
//     generator.addObject('aivox_height', `constexpr uint32_t kDisplayHeight =  ${height};`, true);
//     generator.addObject('aivox_kDisplayMirrorX', `constexpr bool kDisplayMirrorX = false;`, true);
//     generator.addObject('aivox_kDisplayMirrorY', `constexpr bool kDisplayMirrorY = false;`, true);
//     generator.addObject('aivox_kDisplayInvertColor', `constexpr bool kDisplayInvertColor = true;`, true);
//     generator.addObject('aivox_kDisplaySwapXY', `constexpr bool kDisplaySwapXY = false;`, true);
//     generator.addObject('aivox_kDisplayRgbElementOrder', `constexpr auto kDisplayRgbElementOrder = LCD_RGB_ELEMENT_ORDER_RGB;`, true);

//     generator.addObject('aivox_init_display_obj', `std::unique_ptr<Display> g_display;`, true);


//     generator.addObject('aivox3_initDisplay', 
// `void InitDisplay() {
//   pinMode(GPIO_NUM_${backLight}, OUTPUT);
//   analogWrite(GPIO_NUM_${backLight}, 255);
//   spi_bus_config_t buscfg{
//     .mosi_io_num = GPIO_NUM_${mosi},
//     .miso_io_num = GPIO_NUM_NC,
//     .sclk_io_num = GPIO_NUM_${clk},
//     .quadwp_io_num = GPIO_NUM_NC,
//     .quadhd_io_num = GPIO_NUM_NC,
//     .data4_io_num = GPIO_NUM_NC,
//     .data5_io_num = GPIO_NUM_NC,
//     .data6_io_num = GPIO_NUM_NC,
//     .data7_io_num = GPIO_NUM_NC,
//     .data_io_default_level = false,
//     .max_transfer_sz = kDisplayWidth * kDisplayHeight * sizeof(uint16_t),
//     .flags = 0,
//     .isr_cpu_id = ESP_INTR_CPU_AFFINITY_AUTO,
//     .intr_flags = 0,
//   };
//   ESP_ERROR_CHECK(spi_bus_initialize(SPI3_HOST, &buscfg, SPI_DMA_CH_AUTO));

//   esp_lcd_panel_io_handle_t panel_io = nullptr;
//   esp_lcd_panel_handle_t panel = nullptr;

//   esp_lcd_panel_io_spi_config_t io_config = {};
//   io_config.cs_gpio_num = GPIO_NUM_${cs};
//   io_config.dc_gpio_num = GPIO_NUM_${dc};
//   io_config.spi_mode = 0;
//   io_config.pclk_hz = 40 * 1000 * 1000;
//   io_config.trans_queue_depth = 10;
//   io_config.lcd_cmd_bits = 8;
//   io_config.lcd_param_bits = 8;
//   ESP_ERROR_CHECK(esp_lcd_new_panel_io_spi(SPI3_HOST, &io_config, &panel_io));

//   // 初始化液晶屏驱动芯片
//   //   ESP_LOGD(TAG, "Install LCD driver");
//   esp_lcd_panel_dev_config_t panel_config = {};
//   panel_config.reset_gpio_num = -1;
//   panel_config.rgb_ele_order = LCD_RGB_ELEMENT_ORDER_RGB;
//   panel_config.bits_per_pixel = 16;
//   ESP_ERROR_CHECK(esp_lcd_new_panel_st7789(panel_io, &panel_config, &panel));
//   esp_lcd_panel_reset(panel);
//   esp_lcd_panel_init(panel);
//   esp_lcd_panel_invert_color(panel, kDisplayInvertColor);
//   esp_lcd_panel_swap_xy(panel, kDisplaySwapXY);
//   esp_lcd_panel_mirror(panel, kDisplayMirrorX, kDisplayMirrorY);
//   g_display = std::make_unique<Display>(panel_io, panel, kDisplayWidth, kDisplayHeight, 0, 0, kDisplayMirrorX, kDisplayMirrorY, kDisplaySwapXY);
//   g_display->Start();
// }` , true);
//     generator.addSetup('aivox_init_display', `  InitDisplay();      const button_config_t btn_cfg = {
//       .long_press_time = 1000,
//       .short_press_time = 50,
//   };

//   const button_gpio_config_t gpio_cfg = {
//       .gpio_num = GPIO_NUM_0,
//       .active_level = 0,
//       .enable_power_save = false,
//       .disable_pull = false,
//   };
//     ESP_ERROR_CHECK(iot_button_new_gpio_device(&btn_cfg, &gpio_cfg, &g_button_boot_handle));`, false);
//     return '';
// }

// --- Event Loop ---
Arduino.forBlock['aivox_loop_activation'] = function(block, generator) {
    //  if (!block._codeVarMonitorAttached) {
    //   block._codeVarMonitorAttached = true;
    //   block._codeVarLastName = block.getFieldValue("CODEVAR") || "code";
    //   const varField = block.getField("CODEVAR");
    //   if (varField && typeof varField.setValidator === "function") {
    //     varField.setValidator(function(newName) {
    //       const workspace = block.workspace || (typeof Blockly !== "undefined" && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
    //       const oldName = block._codeVarLastName;
    //       if (workspace && newName && newName !== oldName) {
    //         renameVariableInBlockly(workspace, oldName, newName, 'AIVOX_CODE');
    //         block._codeVarLastName = newName;
    //       }
    //       return newName;
    //     });
    //   }
    // }
    // var code = block.getFieldValue("CODEVAR") || "code";
    // registerVariableToBlockly(code, 'AIVOX_CODE');

    //  if (!block._activationMessageVarMonitorAttached) {
    //   block._activationMessageVarMonitorAttached = true;
    //   block._activationMessageVarLastName = block.getFieldValue("ACTIVATIONMESSAGEVAR") || "message";
    //   const varField = block.getField("ACTIVATIONMESSAGEVAR");
    //   if (varField && typeof varField.setValidator === "function") {
    //     varField.setValidator(function(newName) {
    //       const workspace = block.workspace || (typeof Blockly !== "undefined" && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
    //       const oldName = block._activationMessageVarLastName;
    //       if (workspace && newName && newName !== oldName) {
    //         renameVariableInBlockly(workspace, oldName, newName, 'AIVOX_ACTIVATIONMESSAGE');
    //         block._activationMessageVarLastName = newName;
    //       }
    //       return newName;
    //     });
    //   }
    // }
    // var activation_message = block.getFieldValue("ACTIVATIONMESSAGEVAR") || "message";
    // registerVariableToBlockly(activation_message, 'AIVOX_ACTIVATIONMESSAGE');



    // let code = block.getFieldValue("code");
    // let message = block.getFieldValue("message");
    generator.addLibrary('include_aivoxcore', '#include "AIVOXEventCore.h"');
     generator.addObject('aivox_object', `AIVOXEventCore aivoxEventCore;\n`, true);
     generator.addObject(`aivox_observer`, `auto g_observer = std::make_shared<ai_vox::Observer>();`, true);
    const statements_do = generator.statementToCode(block, 'DO');
    generator.addObject('aivox_onActivation', `void OnActivation(const std::string& ${code}, const std::string& ${activation_message}){
      ${statements_do}  
}`);

    generator.addSetup("setup_onActivation", "aivoxEventCore.onActivation(OnActivation);" ,true);
    // Add necessary loop code
    const loopCode = `  aivoxEventCore.update(g_observer);\n`;
    // Use addLoop to ensure it's added correctly, tag prevents duplicates if block used multiple times (though unlikely for this type)
    generator.addLoop('aivox_event_loop', loopCode, true);
    return ''; // The main loop logic is added via addLoop
};

Arduino.forBlock['get_aivox_activation_message'] = function(block, generator) {  
  const activation_type = block.getFieldValue('activation_type');
  // const varField = block.getField('CODEVAR');
  // const varName = varField ? varField.getText() : '';
  // // 验证服务是否存在
  // const service = getAivoxControlService(varName);
  // if (!service) {
  //     console.warn(`not found ${varName}`);
  // }
  let code = `${activation_type}`;
  return [code, Arduino.ORDER_MEMBER]; 
}

Arduino.forBlock['aivox_loop_emotion'] = function(block, generator) {
    // if (!block._emotionVarMonitorAttached) {
    //   block._emotionVarMonitorAttached = true;
    //   block._emotionVarLastName = block.getFieldValue("EMOTIONVAR") || "emotion";
    //   const varField = block.getField("EMOTIONVAR");
    //   if (varField && typeof varField.setValidator === "function") {
    //     varField.setValidator(function(newName) {
    //       const workspace = block.workspace || (typeof Blockly !== "undefined" && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
    //       const oldName = block._emotionVarLastName;
    //       if (workspace && newName && newName !== oldName) {
    //         renameVariableInBlockly(workspace, oldName, newName, 'AIVOX_EMOTION');
    //         block._emotionVarLastName = newName;
    //       }
    //       return newName;
    //     });
    //   }
    // }
    // var emotion = block.getFieldValue("EMOTIONVAR") || "emotion";
    // registerVariableToBlockly(emotion, 'AIVOX_EMOTION');
    generator.addLibrary('include_aivoxcore', '#include "AIVOXEventCore.h"');
    generator.addObject('aivox_object', `AIVOXEventCore aivoxEventCore;\n`, true);
    generator.addObject(`aivox_observer`, `auto g_observer = std::make_shared<ai_vox::Observer>();`, true);
    const statements_do = generator.statementToCode(block, 'DO');
    generator.addObject('aivox_onEmotion', `void OnEmotion(const std::string& emotion){
      ${statements_do}  
}`);

    generator.addSetup("setup_onEmotion", "aivoxEventCore.onEmotion(OnEmotion);" ,true);
    // Add necessary loop code
    const loopCode = `  aivoxEventCore.update(g_observer);\n`;
    // Use addLoop to ensure it's added correctly, tag prevents duplicates if block used multiple times (though unlikely for this type)
    generator.addLoop('aivox_event_loop', loopCode, true);
    return ''; // The main loop logic is added via addLoop
};

Arduino.forBlock['get_aivox_emotion_result'] = function(block, generator) {
  code = `emotion.c_str()`; 
  return [code, Arduino.ORDER_MEMBER]; 
}

// 
Arduino.forBlock['aivox_emotion'] = function(block, generator) {
  const emotion = block.getFieldValue('emotion');

  // const emotion = block.getFieldValue('emotion');
  let code = `emotion == "${emotion}"`;
  return [code, Arduino.ORDER_MEMBER]; 
}

Arduino.forBlock['aivox_emotion_list'] = function(block, generator) {
  const emotion = block.getFieldValue('emotion');
  let code = `"${emotion}"`;
  return [code, Arduino.ORDER_MEMBER]; 
}

Arduino.forBlock['aivox_loop_state_change'] = function(block, generator) {

  // if (!block._stateVarMonitorAttached) {
  //   block._stateVarMonitorAttached = true;
  //   block._stateVarLastName = block.getFieldValue("STATEVAR") || "state";
  //   const varField = block.getField("STATEVAR");
  //   if (varField && typeof varField.setValidator === "function") {
  //     varField.setValidator(function(newName) {
  //       const workspace = block.workspace || (typeof Blockly !== "undefined" && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
  //       const oldName = block._stateVarLastName;
  //       if (workspace && newName && newName !== oldName) {
  //         renameVariableInBlockly(workspace, oldName, newName, 'AIVOX_STATE');
  //         block._stateVarLastName = newName;
  //       }
  //       return newName;
  //     });
  //   }
  // }
  //   var state = block.getFieldValue("STATEVAR") || "state";
  //   registerVariableToBlockly(state, 'AIVOX_STATE');
    let state = block.getFieldValue("chat_state");
    generator.addLibrary('include_aivox_event_core', '#include "AIVOXEventCore.h"');
    generator.addObject('aivox_object', `AIVOXEventCore aivoxEventCore;\n`, true);
    generator.addObject(`aivox_observer`, `auto g_observer = std::make_shared<ai_vox::Observer>();`, true);
    const statements_do = generator.statementToCode(block, 'DO');
    generator.addObject(`aivox_onStateChange_${state}`, `void OnState${state}(ai_vox::ChatState state){
      if(state == ai_vox::ChatState::k${state}) {
         ${statements_do}  
      }
}`);
    generator.addSetup(`setup_onStateChange_${state}`, `aivoxEventCore.onState${state}(OnState${state});` ,true);
    // Add necessary loop code
    const loopCode = `  aivoxEventCore.update(g_observer);\n`;
    // Use addLoop to ensure it's added correctly, tag prevents duplicates if block used multiple times (though unlikely for this type)
    generator.addLoop('aivox_event_loop', loopCode, true);
    return ''; // The main loop logic is added via addLoop
};

Arduino.forBlock['aivox_state'] = function(block, generator) {
  const state = block.getFieldValue('state');
  const varField = block.getField('STATEVAR');
  const varName = varField ? varField.getText() : '';
  // 验证服务是否存在
  const service = getAivoxControlService(varName);
  if (!service) {
      console.warn(`not found ${varName}`);
  }
  let code = `${varName} == ${state}`;
  return [code, Arduino.ORDER_MEMBER]; 
}

Arduino.forBlock['aivox_loop_chat_message'] = function(block, generator) {
  // 监听ROLEVAR输入值的变化，自动重命名Blockly变量
  // if (!block._roleVarMonitorAttached) {
  //   block._roleVarMonitorAttached = true;
  //   block._roleVarLastName = block.getFieldValue("ROLEVAR") || "role";
  //   const varField = block.getField("ROLEVAR");
  //   if (varField && typeof varField.setValidator === "function") {
  //     varField.setValidator(function(newName) {
  //       const workspace = block.workspace || (typeof Blockly !== "undefined" && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
  //       const oldName = block._roleVarLastName;
  //       if (workspace && newName && newName !== oldName) {
  //         renameVariableInBlockly(workspace, oldName, newName, 'AIVOX_ROLE');
  //         block._roleVarLastName = newName;
  //       }
  //       return newName;
  //     });
  //   }
  // }

  // // 监听MESSAGEVAR输入值的变化，自动重命名Blockly变量
  // if (!block._messageVarMonitorAttached) {
  //   block._messageVarMonitorAttached = true;
  //   block._messageVarLastName = block.getFieldValue("MSGVAR") || "message";
  //   const varField = block.getField("MSGVAR");
  //   if (varField && typeof varField.setValidator === "function") {
  //     varField.setValidator(function(newName) {
  //       const workspace = block.workspace || (typeof Blockly !== "undefined" && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
  //       const oldName = block._messageVarLastName;
  //       if (workspace && newName && newName !== oldName) {
  //         renameVariableInBlockly(workspace, oldName, newName, 'AIVOX_MESSAGE');
  //         block._messageVarLastName = newName;
  //       }
  //       return newName;
  //     });
  //   }
  // }

  // // let role = block.getFieldValue("role");
  // // let message = block.getFieldValue("message");
  // var role = block.getFieldValue("ROLEVAR") || "role";
  // var message = block.getFieldValue("MSGVAR") || "message";

  // registerVariableToBlockly(role, 'AIVOX_ROLE');
  // registerVariableToBlockly(message, 'AIVOX_MESSAGE');

  // console.log("aivox_loop_chat_message=====: ", role);
  generator.addLibrary('include_aivoxcore', '#include "AIVOXEventCore.h"');
  generator.addObject('aivox_object', `AIVOXEventCore aivoxEventCore;\n`, true);
  generator.addObject(`aivox_observer`, `auto g_observer = std::make_shared<ai_vox::Observer>();`, true);
  generator.addObject(`chat_message_role`, `std::string chatRole ;`, true);
  const statements_do = generator.statementToCode(block, 'DO');
  generator.addObject('aivox_onChatMessage', `void OnChatMessage(const std::string& role, const std::string& message){
      chatRole = role;
      ${statements_do}  
}`);
    generator.addSetup("setup_onChatMessage", "aivoxEventCore.onChatMessage(OnChatMessage);" ,true);
    // Add necessary loop code
    const loopCode = `  aivoxEventCore.update(g_observer);\n`;
    // Use addLoop to ensure it's added correctly, tag prevents duplicates if block used multiple times (though unlikely for this type)
    generator.addLoop('aivox_event_loop', loopCode, true);
    return ''; // The main loop logic is added via addLoop
};

Arduino.forBlock['aivox_loop_chat_message_role_var'] = function(block, generator) {
    // const varField = block.getField('ROLEVAR');
    // const varName = varField ? varField.getText() : '';
    // console.log("aivox_loop_chat_message_role_var=====: ", varName);
    // // 验证服务是否存在
    // const service = getAivoxControlService(varName);
    let chat_role = block.getFieldValue("chat_role");
    // if (!service) {
    //     console.warn(`not found ${varName}`);
    // }
  let code = `role == "${chat_role}"`;
  return [code, Arduino.ORDER_MEMBER]; 
}

Arduino.forBlock['aivox_loop_chat_message_msg_var'] = function(block, generator) {
  // const varField = block.getField('MSGVAR');
  //   const varName = varField ? varField.getText() : '';
  //   // 验证服务是否存在
  //   const service = getAivoxControlService(varName);
  //   if (!service) {
  //       console.warn(`not found ${varName}`);
  //   }
  let message = `message`;
  return [message, Arduino.ORDER_MEMBER]; 
}

// aivox_display_wchat_content
Arduino.forBlock['aivox_display_wchat_content'] = function(block, generator) {
  let content = generator.valueToCode(block, 'content', generator.ORDER_ATOMIC) || '""';
  let chat_role = block.getFieldValue("chat_role");
  let code = `g_display->SetChatMessage(${chat_role}, ${content});\n`;
  return code; 
}

Arduino.forBlock['aivox_loop_mcp'] = function(block, generator) {
  generator.addLibrary('include_aivoxcore', '#include "AIVOXEventCore.h"');
  generator.addObject('aivox_object', `AIVOXEventCore aivoxEventCore;\n`, true);
  generator.addObject(`aivox_observer`, `auto g_observer = std::make_shared<ai_vox::Observer>();`, true);
  const statements_do = generator.statementToCode(block, 'DO');
  generator.addObject('aivox_onMcpToolCall', `void OnMcpControl(const std::int64_t& id, const std::string& name, const std::map<std::string, std::variant<std::string, int64_t, bool>>& param){
    ${statements_do}  
}`);
    generator.addSetup("setup_onMcpToolCall", "aivoxEventCore.onMcpToolCall(OnMcpControl);" ,true);
    // Add necessary loop code
    const loopCode = `  aivoxEventCore.update(g_observer);\n`;
    // Use addLoop to ensure it's added correctly, tag prevents duplicates if block used multiple times (though unlikely for this type)
    generator.addLoop('aivox_event_loop', loopCode, true);
    return ''; // The main loop logic is added via addLoop
  return code; 
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

Arduino.forBlock['aivox_lcd_show_status'] = function (block, generator) {
  generator.addObject(`chat_message_role`, `std::string chatRole;`, true);
    let location = block.getFieldValue('location');
    let ai_vox_content = generator.valueToCode(block, 'ai_vox_content', generator.ORDER_ATOMIC) || '""';
    let code = '';
    if(location == 'SetChatMessage'){
      if(display_mode == '' || display_mode == 'normal'){
        code = `g_display->SetChatMessage(Display::Role::kSystem, ${ai_vox_content});\n`;
      }else{
        code = `if(chatRole == "assistant"){\n  g_display->SetChatMessage(Display::Role::kAssistant, ${ai_vox_content});\n}else if(chatRole == "user"){\n  g_display->SetChatMessage(Display::Role::kUser, ${ai_vox_content});\n}else{\n  g_display->SetChatMessage(Display::Role::kSystem, ${ai_vox_content});\n}\n`;
      }
    }else{
      code = `g_display->${location}(${ai_vox_content});\n`;
    }
    return code;
};

Arduino.forBlock['aivox_config_ota_url'] = function (block, generator) {
    let ota_url = generator.valueToCode(block, 'ai_vox_ota_url', generator.ORDER_ATOMIC) || '""';
    generator.addObject(`aivox_observer`, `auto g_observer = std::make_shared<ai_vox::Observer>();`, true);
    generator.addObject('ai_vox_engine', `auto& ai_vox_engine = ai_vox::Engine::GetInstance();`, true);
    generator.addSetup(`aivox_instance`, `ai_vox_engine.SetObserver(g_observer);\n`, true);
    let code = `   ai_vox_engine.SetObserver(g_observer);\nai_vox_engine.SetOtaUrl(${ota_url});\n`;
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

Arduino.forBlock['aivox3_start_engine'] = function (block, generator) {
    generator.addLibrary('button_gpio', '#include "components/espressif/button/button_gpio.h"\n#include "components/espressif/button/iot_button.h"');
    generator.addObject(`g_button_boot_handle`, ` button_handle_t g_button_boot_handle = nullptr;`, true);
    generator.addObject('aivox_observer', 'auto g_observer = std::make_shared<ai_vox::Observer>();', true);
    generator.addObject('ai_vox_engine', `auto& ai_vox_engine = ai_vox::Engine::GetInstance();`, true);
    generator.addSetup(`aivox_instance`, `ai_vox_engine.SetObserver(g_observer);\n`, true);
    var workspace = Blockly.getMainWorkspace();
        // 获取所有块
    var allBlocks = workspace.getAllBlocks();
     const hasValue1 = allBlocks.find(item => item.type === 'aivox3_init_es8311');
    // 遍历所有块并打印出它们的类型
    // allBlocks.forEach(function(block) {
        console.log("all type: ", hasValue1);
        let startCode ;
        if(hasValue1){
          startCode = `g_audio_output_device, g_audio_output_device`;
        } else {
          startCode = `g_audio_input_device, g_audio_output_device`;
        }
    // });
    let code = ` ai_vox_engine.Start(${startCode});\n  ESP_ERROR_CHECK(iot_button_register_cb(
      g_button_boot_handle,
      BUTTON_PRESS_DOWN,
      nullptr,
      [](void* button_handle, void* usr_data) {
        printf("boot button pressed\\n");
        ai_vox::Engine::GetInstance().Advance();
      },
      nullptr));`;
    return code;
};

Arduino.forBlock['aivox_mcp_register_state_control_command'] = function(block, generator) {
    let ai_vox_mcp_control_name = generator.valueToCode(block, 'ai_vox_mcp_control_name', generator.ORDER_ATOMIC) || '""';
    let ai_vox_mcp_control_desc = generator.valueToCode(block, 'ai_vox_mcp_control_desc', generator.ORDER_ATOMIC) || '""';
    let ai_vox_mcp_control_param = generator.valueToCode(block, 'ai_vox_mcp_control_param', generator.ORDER_ATOMIC) || '""';
    let name = ai_vox_mcp_control_name.replace(/"/g, '');
    let control_name_set = "self." + name + ".set";
    let control_name_get = "self." + name + ".get";
    generator.addObject('ai_vox_engine', `auto& ai_vox_engine = ai_vox::Engine::GetInstance();`, true);
    generator.addSetup(`aivox_instance`, `ai_vox_engine.SetObserver(g_observer);\n`, true);
    generator.addSetup(`aivox_add_mcp_tool_set_${ai_vox_mcp_control_name}`, `  ai_vox_engine.AddMcpTool("${control_name_set}",                                           // tool name
                    ${ai_vox_mcp_control_desc},  
                    {
                        {
                            ${ai_vox_mcp_control_param},  
                            ai_vox::ParamSchema<bool>{
                                .default_value = std::nullopt, 
                            },                                  
                        },
                    }
  );\n`, true);
    generator.addSetup(`aivox_add_mcp_tool_get_${ai_vox_mcp_control_name}`, `  ai_vox_engine.AddMcpTool("${control_name_get}",                                           // tool name
                    ${ai_vox_mcp_control_desc}, 
                    {
                        {
                        },
                    } 
  );\n`, true);
  return '';
}

// aivox_mcp_register_value_control_command
Arduino.forBlock['aivox_mcp_register_value_control_command'] = function(block, generator) {
    let ai_vox_mcp_control_name = generator.valueToCode(block, 'ai_vox_mcp_control_name', generator.ORDER_ATOMIC) || '""';
    let ai_vox_mcp_control_desc = generator.valueToCode(block, 'ai_vox_mcp_control_desc', generator.ORDER_ATOMIC) || '""';
    let ai_vox_mcp_control_param = generator.valueToCode(block, 'ai_vox_mcp_control_param', generator.ORDER_ATOMIC) || '""';
    let ai_vox_mcp_control_value_min = generator.valueToCode(block, 'ai_vox_mcp_control_value_min', generator.ORDER_ATOMIC) || '""';
    let ai_vox_mcp_control_value_max = generator.valueToCode(block, 'ai_vox_mcp_control_value_max', generator.ORDER_ATOMIC) || '""';
    let name = ai_vox_mcp_control_name.replace(/"/g, '');
    let control_name_set = "self." + name + ".set";
    let control_name_get = "self." + name + ".get";
    generator.addObject('ai_vox_engine', `auto& ai_vox_engine = ai_vox::Engine::GetInstance();`, true);
    generator.addSetup(`aivox_instance`, `ai_vox_engine.SetObserver(g_observer);\n`, true);
    generator.addSetup(`aivox_add_mcp_tool_set_${ai_vox_mcp_control_name}`, `  ai_vox_engine.AddMcpTool("${control_name_set}",                                           // tool name
                    ${ai_vox_mcp_control_desc},
                    {
                        {
                            ${ai_vox_mcp_control_param},  
                            ai_vox::ParamSchema<int64_t>{
                                .default_value = std::nullopt, 
                                .min = ${ai_vox_mcp_control_value_min},
                                .max = ${ai_vox_mcp_control_value_max}
                            },                                  
                        },
                    } 
  );\n`, true);
    generator.addSetup(`aivox_add_mcp_tool_get_${ai_vox_mcp_control_name}`, `  ai_vox_engine.AddMcpTool("${control_name_get}",                                           // tool name
                    ${ai_vox_mcp_control_desc},  // tool description
                    {
                        {
                        },
                    } 
  );\n`, true);
  return '';
};

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

Arduino.forBlock['aivox_lcd_show_chat_message'] = function (block, generator) {
    const display_role = block.getFieldValue('ai_vox_display_role');
    let ai_vox_chat_message = generator.valueToCode(block, 'ai_vox_chat_message', generator.ORDER_ATOMIC) || '""';
    let code = `g_display->SetChatMessage(${display_role}, ${ai_vox_chat_message});\n`;
    return code;
};

Arduino.forBlock['aivox_lcd_show_emotion'] = function (block, generator) {
    let ai_vox_emotion = generator.valueToCode(block, 'ai_vox_emotion', generator.ORDER_ATOMIC) || '""';
    let code = `g_display->SetEmotion(${ai_vox_emotion});\n`;
    return code;
};
  
Arduino.forBlock['aivox_event_is_activation'] = function(block, generator) {
    const statements_do = generator.statementToCode(block, 'DO');
    const code = `if (auto activation_event = std::get_if<ai_vox::ActivationEvent>(&event)) {\n${statements_do}}\n`;
    return code;
};

Arduino.forBlock['aivox_get_activation_message'] = function(block, generator) {
    const eventVar = getEventVarName(block);
    if (!eventVar || eventVar !== 'activation_event') {
        return ['/* ERROR: Block must be inside "If event is Activation" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->message.c_str()`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_get_activation_code'] = function(block, generator) {
    const eventVar = getEventVarName(block);
     if (!eventVar || eventVar !== 'activation_event') {
        return ['/* ERROR: Block must be inside "If event is Activation" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->code.c_str()`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_event_is_state_change'] = function(block, generator) {
    const statements_do = generator.statementToCode(block, 'DO');
    const code = `if (auto state_changed_event = std::get_if<ai_vox::StateChangedEvent>(&event)) {\n${statements_do}}\n`;
    return code;
};

Arduino.forBlock['aivox_get_new_state'] = function(block, generator) {
    const eventVar = getEventVarName(block);
     if (!eventVar || eventVar !== 'state_changed_event') {
        return ['/* ERROR: Block must be inside "If event is State Change" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->new_state`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_get_old_state'] = function(block, generator) {
    const eventVar = getEventVarName(block);
     if (!eventVar || eventVar !== 'state_changed_event') {
        return ['/* ERROR: Block must be inside "If event is State Change" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->old_state`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_state_enum'] = function(block, generator) {
    const state = block.getFieldValue('STATE');
    return [state, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['aivox_event_is_emotion'] = function(block, generator) {
    const statements_do = generator.statementToCode(block, 'DO');
    const code = `if (auto emotion_event = std::get_if<ai_vox::EmotionEvent>(&event)) {\n${statements_do}}\n`;
    return code;
};

Arduino.forBlock['aivox_get_emotion'] = function(block, generator) {
    const eventVar = getEventVarName(block);
     if (!eventVar || eventVar !== 'emotion_event') {
        return ['/* ERROR: Block must be inside "If event is Emotion" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->emotion.c_str()`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_event_is_chat_message'] = function(block, generator) {
    const statements_do = generator.statementToCode(block, 'DO');
    const code = `if (auto chat_message_event = std::get_if<ai_vox::ChatMessageEvent>(&event)) {\n${statements_do}}\n`;
    return code;
};

Arduino.forBlock['aivox_get_chat_role'] = function(block, generator) {
    const eventVar = getEventVarName(block);
     if (!eventVar || eventVar !== 'chat_message_event') {
        return ['/* ERROR: Block must be inside "If event is Chat Message" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->role`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_chat_role_enum'] = function(block, generator) {
    const role = block.getFieldValue('chat_role');
    return [role, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['aivox_get_chat_content'] = function(block, generator) {
    const eventVar = getEventVarName(block);
     if (!eventVar || eventVar !== 'chat_message_event') {
        return ['/* ERROR: Block must be inside "If event is Chat Message" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->content.c_str()`;
    return [code, Arduino.ORDER_MEMBER];
};


Arduino.forBlock['aivox_event_is_iot_message'] = function(block, generator) {
    const statements_do = generator.statementToCode(block, 'DO');
    // const code = `const auto it = iot_message_event->parameters.find("index");\nint64_t index = std::get<int64_t>(it->second);\n`;
    const code = `if (auto mcp_tool_call_event = std::get_if<ai_vox::McpToolCallEvent>(&event)) {\n${statements_do}}\n`;
    return code;
};

Arduino.forBlock['aivox_get_iot_message_event_name'] = function(block, generator) {
    const eventVar = getEventVarName(block);
    let ai_vox_mcp_control_name = generator.valueToCode(block, 'ai_vox_mcp_control_name', generator.ORDER_ATOMIC) || '""';
    let name = ai_vox_mcp_control_name.replace(/"/g, '');
    let control_name_set = "self." + name + ".set";
    if (!eventVar || eventVar !== 'iot_message_event') {
        return ['/* ERROR: Block must be inside "If event is mcp event" */', Arduino.ORDER_ATOMIC];
    }
    const code = `"${control_name_set}" == mcp_tool_call_event->name`;
    return [code, Arduino.ORDER_MEMBER];
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

Arduino.forBlock['aivox_state_control_message_event_fuction'] = function(block, generator) {
    const eventVar = getEventVarName(block);
    const event_fuction = block.getFieldValue('event_fuction');
    let ai_vox_mcp_control_name = generator.valueToCode(block, 'ai_vox_mcp_control_name', generator.ORDER_ATOMIC) || '""';
    let ai_vox_mcp_control_state = generator.valueToCode(block, 'ai_vox_mcp_control_state', generator.ORDER_ATOMIC) || '""';

     if (!eventVar || eventVar !== 'iot_message_event') {
        return ['/* ERROR: Block must be inside "If event is iot Message" */', Arduino.ORDER_ATOMIC];
    }

    const code = `*(mcp_tool_call_event->param<bool>(${ai_vox_mcp_control_state}))`;
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
    let code;
    if (param && param.type === 'Boolean') {
        code = `std::get<bool>(param.at("${pvarName}"))`;
    } else if (param && param.type === 'Number') {
        code = `std::get<int64_t>(param.at("${pvarName}"))`;
    } else if (param && param.type === 'String') {
        code = `std::get<std::string>(param.at("${pvarName}"))`;
    } else {
        // 默认使用bool类型
        code = `std::get<bool>(param.at("${pvarName}"))`;
    }
    
    return [code, Arduino.ORDER_MEMBER];
};
// 
Arduino.forBlock['aivox_response_mcp_control_result'] = function(block, generator) {
    const eventVar = getEventVarName(block);
    let ai_vox_mcp_control_name = generator.valueToCode(block, 'ai_vox_mcp_control_name', generator.ORDER_ATOMIC) || '""';
    // let ai_vox_mcp_control_state = generator.valueToCode(block, 'ai_vox_mcp_control_state', generator.ORDER_ATOMIC) || '""';
    let name = ai_vox_mcp_control_name.replace(/"/g, '');
    generator.addObject(`g_${name}_res`, `bool g_${name}_res = false;`, true);
    const code = `  ai_vox_engine.SendMcpCallResponse(mcp_tool_call_event->id, true);\n`;
    return code;
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
    console.log("aivox_update_mcp_control_state_new ====: ", param);
    let type = param.type;
    let state = generator.valueToCode(block, 'STATE', generator.ORDER_ATOMIC) || '""';
    // 验证服务是否存在
    const service = getAivoxControlService(varName);
    if (!service) {
        console.warn(`AIVOX service '${varName}' not found`);
    }
    const code = `if ("self.${varName}.get" == name) {\n const auto ${varName}_${paramName} = std::get<${type}>(param.at(${paramName}));\n  ai_vox_engine.SendMcpCallResponse(id, ${state});\n}`;
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
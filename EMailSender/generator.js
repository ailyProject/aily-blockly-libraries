'use strict';

// 智能板卡适配函数
function ensureNetworkLib(generator) {
    // 获取开发板配置
    const boardConfig = window['boardConfig'];

    if (boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1) {
        // ESP32系列开发板
        generator.addLibrary('WiFi', '#include <WiFi.h>');
    } else if (boardConfig && boardConfig.core && boardConfig.core.indexOf('esp8266') > -1) {
        // ESP8266系列开发板
        generator.addLibrary('WiFi', '#include <ESP8266WiFi.h>');
    } else if (boardConfig && boardConfig.core && boardConfig.core.indexOf('renesas_uno') > -1) {
        // Arduino UNO R4 WiFi
        generator.addLibrary('WiFi', '#include <WiFiS3.h>');
    } else if (boardConfig && boardConfig.core && boardConfig.core.indexOf('arduino:avr') > -1) {
        // Arduino经典板卡，使用Ethernet
        generator.addLibrary('Ethernet', '#include <Ethernet.h>');
        generator.addLibrary('SPI', '#include <SPI.h>');
    } else {
        // 默认使用ESP32的库
        generator.addLibrary('WiFi', '#include <WiFi.h>');
    }
}

// EMailSender库确保函数
function ensureEmailSenderLib(generator) {
    generator.addLibrary('EMailSender', '#include <EMailSender.h>');
}

// 获取变量名的工具函数
function getVariableName(block, fieldName, defaultName) {
    const field = block.getField(fieldName);
    return field ? field.getText() : defaultName;
}

// 获取输入值的工具函数
function getInputValue(block, inputName, generator, defaultValue) {
    return generator.valueToCode(block, inputName, generator.ORDER_ATOMIC) || defaultValue;
}

// 创建邮件发送器对象
Arduino.forBlock['emailsender_create'] = function(block, generator) {
    // 设置变量重命名监听
    if (!block._emailSenderVarMonitorAttached) {
        block._emailSenderVarMonitorAttached = true;
        block._emailSenderVarLastName = block.getFieldValue('VAR') || 'emailSender';
        const varField = block.getField('VAR');
        if (varField && typeof varField.setValidator === 'function') {
            varField.setValidator(function(newName) {
                const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
                const oldName = block._emailSenderVarLastName;
                if (workspace && newName && newName !== oldName) {
                    renameVariableInBlockly(block, oldName, newName, 'EMailSender');
                    block._emailSenderVarLastName = newName;
                }
                return newName;
            });
        }
    }

    // 参数提取
    const varName = block.getFieldValue('VAR') || 'emailSender';
    const emailLogin = getInputValue(block, 'EMAIL_LOGIN', generator, '"user@gmail.com"');
    const emailPassword = getInputValue(block, 'EMAIL_PASSWORD', generator, '"password"');
    const emailFrom = getInputValue(block, 'EMAIL_FROM', generator, '"sender@gmail.com"');

    // 库和变量管理
    ensureNetworkLib(generator);
    ensureEmailSenderLib(generator);
    registerVariableToBlockly(varName, 'EMailSender');
    generator.addVariable(varName, 'EMailSender ' + varName + '(' + emailLogin + ', ' + emailPassword + ', ' + emailFrom + ');');

    return '';
};

// 创建邮件发送器对象（包含发件人姓名）
Arduino.forBlock['emailsender_create_with_name'] = function(block, generator) {
    // 设置变量重命名监听
    if (!block._emailSenderVarMonitorAttached) {
        block._emailSenderVarMonitorAttached = true;
        block._emailSenderVarLastName = block.getFieldValue('VAR') || 'emailSender';
        const varField = block.getField('VAR');
        if (varField && typeof varField.setValidator === 'function') {
            varField.setValidator(function(newName) {
                const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
                const oldName = block._emailSenderVarLastName;
                if (workspace && newName && newName !== oldName) {
                    renameVariableInBlockly(block, oldName, newName, 'EMailSender');
                    block._emailSenderVarLastName = newName;
                }
                return newName;
            });
        }
    }

    // 参数提取
    const varName = block.getFieldValue('VAR') || 'emailSender';
    const emailLogin = getInputValue(block, 'EMAIL_LOGIN', generator, '"user@gmail.com"');
    const emailPassword = getInputValue(block, 'EMAIL_PASSWORD', generator, '"password"');
    const emailFrom = getInputValue(block, 'EMAIL_FROM', generator, '"sender@gmail.com"');
    const nameFrom = getInputValue(block, 'NAME_FROM', generator, '"Sender Name"');

    // 库和变量管理
    ensureNetworkLib(generator);
    ensureEmailSenderLib(generator);
    registerVariableToBlockly(varName, 'EMailSender');
    generator.addVariable(varName, 'EMailSender ' + varName + '(' + emailLogin + ', ' + emailPassword + ', ' + emailFrom + ', ' + nameFrom + ');');

    return '';
};

// 配置SMTP服务器
Arduino.forBlock['emailsender_configure'] = function(block, generator) {
    const varName = getVariableName(block, 'VAR', 'emailSender');
    const smtpServer = getInputValue(block, 'SMTP_SERVER', generator, '"smtp.gmail.com"');
    const smtpPort = getInputValue(block, 'SMTP_PORT', generator, '465');

    // 库管理
    ensureEmailSenderLib(generator);

    // 生成配置代码
    const code = varName + '.setSMTPServer(' + smtpServer + ');\n' +
                 varName + '.setSMTPPort(' + smtpPort + ');\n';
    
    return code;
};

// 设置安全连接
Arduino.forBlock['emailsender_set_secure'] = function(block, generator) {
    const varName = getVariableName(block, 'VAR', 'emailSender');
    const isSecure = block.getFieldValue('SECURE') === 'TRUE';

    // 库管理
    ensureEmailSenderLib(generator);

    // 生成设置代码
    const code = varName + '.setIsSecure(' + isSecure + ');\n';
    
    return code;
};

// 创建邮件消息对象
Arduino.forBlock['emailsender_message_create'] = function(block, generator) {
    // 设置变量重命名监听
    if (!block._emailMessageVarMonitorAttached) {
        block._emailMessageVarMonitorAttached = true;
        block._emailMessageVarLastName = block.getFieldValue('VAR') || 'message';
        const varField = block.getField('VAR');
        if (varField && typeof varField.setValidator === 'function') {
            varField.setValidator(function(newName) {
                const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
                const oldName = block._emailMessageVarLastName;
                if (workspace && newName && newName !== oldName) {
                    renameVariableInBlockly(block, oldName, newName, 'EMailMessage');
                    block._emailMessageVarLastName = newName;
                }
                return newName;
            });
        }
    }

    // 参数提取
    const varName = block.getFieldValue('VAR') || 'message';

    // 库和变量管理
    ensureEmailSenderLib(generator);
    registerVariableToBlockly(varName, 'EMailMessage');
    generator.addVariable(varName, 'EMailSender::EMailMessage ' + varName + ';');

    return '';
};

// 设置邮件主题
Arduino.forBlock['emailsender_set_subject'] = function(block, generator) {
    const varName = getVariableName(block, 'VAR', 'message');
    const subject = getInputValue(block, 'SUBJECT', generator, '"Email Subject"');

    // 库管理
    ensureEmailSenderLib(generator);

    // 生成设置代码
    const code = varName + '.subject = ' + subject + ';\n';
    
    return code;
};

// 设置邮件内容
Arduino.forBlock['emailsender_set_content'] = function(block, generator) {
    const varName = getVariableName(block, 'VAR', 'message');
    const content = getInputValue(block, 'CONTENT', generator, '"Email content"');
    const mimeType = block.getFieldValue('MIME_TYPE');

    // 库管理
    ensureEmailSenderLib(generator);

    // 生成设置代码
    const code = varName + '.message = ' + content + ';\n' +
                 varName + '.mime = F("' + mimeType + '");\n';
    
    return code;
};

// 发送邮件
Arduino.forBlock['emailsender_send'] = function(block, generator) {
    const varName = getVariableName(block, 'VAR', 'emailSender');
    const to = getInputValue(block, 'TO', generator, '"recipient@gmail.com"');
    const messageVar = getVariableName(block, 'MESSAGE', 'message');

    // 库管理
    ensureEmailSenderLib(generator);

    // 生成发送代码
    const code = varName + '.send(' + to + ', ' + messageVar + ');\n';
    
    return code;
};

// 发送邮件并保存响应
Arduino.forBlock['emailsender_send_with_response'] = function(block, generator) {
    const varName = getVariableName(block, 'VAR', 'emailSender');
    const to = getInputValue(block, 'TO', generator, '"recipient@gmail.com"');
    const messageVar = getVariableName(block, 'MESSAGE', 'message');
    const responseVar = block.getFieldValue('RESPONSE_VAR') || 'response';

    // 库管理
    ensureEmailSenderLib(generator);
    registerVariableToBlockly(responseVar, 'EMailResponse');
    generator.addVariable(responseVar, 'EMailSender::Response ' + responseVar + ';');

    // 生成发送代码
    const code = responseVar + ' = ' + varName + '.send(' + to + ', ' + messageVar + ');\n';
    
    return code;
};

// 获取邮件发送状态
Arduino.forBlock['emailsender_get_status'] = function(block, generator) {
    const varName = getVariableName(block, 'VAR', 'response');

    // 库管理
    ensureEmailSenderLib(generator);

    // 生成获取状态代码
    const code = varName + '.status';
    
    return [code, Arduino.ORDER_ATOMIC];
};

// 获取邮件发送响应码
Arduino.forBlock['emailsender_get_code'] = function(block, generator) {
    const varName = getVariableName(block, 'VAR', 'response');

    // 库管理
    ensureEmailSenderLib(generator);

    // 生成获取响应码代码
    const code = varName + '.code';
    
    return [code, Arduino.ORDER_ATOMIC];
};

// 获取邮件发送描述
Arduino.forBlock['emailsender_get_description'] = function(block, generator) {
    const varName = getVariableName(block, 'VAR', 'response');

    // 库管理
    ensureEmailSenderLib(generator);

    // 生成获取描述代码
    const code = varName + '.desc';
    
    return [code, Arduino.ORDER_ATOMIC];
};
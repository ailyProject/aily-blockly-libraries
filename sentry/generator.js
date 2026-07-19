function sentryEnsureLibrary(generator) {
  generator.addLibrary('Sentry', '#include <Sentry.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
}
function sentryFieldVariable(block) { const f=block.getField('VAR'); return f?f.getText():'sentry'; }
function sentryValue(generator,block,name,fallback) { return generator.valueToCode(block,name,generator.ORDER_ATOMIC)||fallback; }
function sentryBase(name) { return 'static_cast<SentryFactory&>(' + name + ')'; }
function sentryMonitor(block,name,typeName) {
  if(block._varMonitorAttached)return; block._varMonitorAttached=true; block._varLastName=name;
  registerVariableToBlockly(name,typeName); const field=block.getField('VAR'); if(!field)return;
  const original=field.onFinishEditing_; field.onFinishEditing_=function(newName){
    if(typeof original==='function')original.call(this,newName);
    const workspace=block.workspace||(typeof Blockly!=='undefined'&&Blockly.getMainWorkspace&&Blockly.getMainWorkspace());
    if(workspace&&newName&&newName!==block._varLastName){renameVariableInBlockly(block,block._varLastName,newName,typeName);block._varLastName=newName;}
  };
}
function registerSentryModel(prefix,className,typeName,defaultName) {
  Arduino.forBlock[prefix+'_init_i2c']=function(block,generator){const name=block.getFieldValue('VAR')||defaultName,address=sentryValue(generator,block,'ADDRESS','0x60');sentryEnsureLibrary(generator);sentryMonitor(block,name,typeName);generator.addObject(prefix+'_'+name,className+' '+name+'('+address+');');generator.addSetupBegin('sentry_wire_begin','Wire.begin();');generator.addSetupBegin(prefix+'_begin_'+name,'while (SENTRY_OK != '+name+'.begin(&Wire)) { yield(); }');return '';};
  Arduino.forBlock[prefix+'_init_uart']=function(block,generator){const name=block.getFieldValue('VAR')||defaultName,serial=block.getFieldValue('SERIAL')||'Serial',baud=sentryValue(generator,block,'BAUD','9600');sentryEnsureLibrary(generator);sentryMonitor(block,name,typeName);generator.addObject(prefix+'_'+name,className+' '+name+';');generator.addSetupBegin(prefix+'_serial_'+serial,serial+'.begin('+baud+');');generator.addSetupBegin(prefix+'_begin_'+name,'while (SENTRY_OK != '+name+'.begin(&'+serial+')) { yield(); }');return '';};
  const base=(block)=>sentryBase(sentryFieldVariable(block)), vision=(block)=>block.getFieldValue('VISION')||'1';
  Arduino.forBlock[prefix+'_set_led']=function(block,generator){const n=sentryFieldVariable(block),l=sentryValue(generator,block,'LEVEL','1');sentryEnsureLibrary(generator);return n+'.LedSetColor('+(block.getFieldValue('DETECTED')||'kLedRed')+', '+(block.getFieldValue('UNDETECTED')||'kLedClose')+', constrain('+l+', 0, 15));\n';};
  Arduino.forBlock[prefix+'_vision_control']=function(block,generator){sentryEnsureLibrary(generator);const method=block.getFieldValue('ACTION')==='END'?'VisionEnd':'VisionBegin';return base(block)+'.'+method+'('+vision(block)+');\n';};
  Arduino.forBlock[prefix+'_set_param_num']=function(block,generator){sentryEnsureLibrary(generator);return base(block)+'.SetParamNum('+vision(block)+', '+sentryValue(generator,block,'COUNT','1')+');\n';};
  Arduino.forBlock[prefix+'_set_region_param']=function(block,generator){sentryEnsureLibrary(generator);return '{\n  sentry_object_t p = {};\n  p.x_value = '+sentryValue(generator,block,'X','50')+';\n  p.y_value = '+sentryValue(generator,block,'Y','50')+';\n  p.width = '+sentryValue(generator,block,'WIDTH','10')+';\n  p.height = '+sentryValue(generator,block,'HEIGHT','10')+';\n  '+base(block)+'.SetParam(1, &p, '+sentryValue(generator,block,'ID','1')+');\n}\n';};
  Arduino.forBlock[prefix+'_set_blob_param']=function(block,generator){sentryEnsureLibrary(generator);return '{\n  sentry_object_t p = {};\n  p.width = '+sentryValue(generator,block,'WIDTH','10')+';\n  p.height = '+sentryValue(generator,block,'HEIGHT','10')+';\n  p.label = '+(block.getFieldValue('COLOR')||'3')+';\n  '+base(block)+'.SetParam(2, &p, '+sentryValue(generator,block,'ID','1')+');\n}\n';};
  Arduino.forBlock[prefix+'_set_label_param']=function(block,generator){sentryEnsureLibrary(generator);return '{\n  sentry_object_t p = {};\n  p.label = '+sentryValue(generator,block,'LABEL','1')+';\n  '+base(block)+'.SetParam('+vision(block)+', &p, '+sentryValue(generator,block,'ID','1')+');\n}\n';};
  Arduino.forBlock[prefix+'_set_mode']=function(block,generator){sentryEnsureLibrary(generator);return base(block)+'.VisionSetMode('+vision(block)+', '+sentryValue(generator,block,'MODE','0')+');\n';};
  Arduino.forBlock[prefix+'_set_apriltag_mode']=function(block,generator){sentryEnsureLibrary(generator);return base(block)+'.VisionSetMode(3, '+(block.getFieldValue('MODE')||'0')+');\n';};
  Arduino.forBlock[prefix+'_set_barcode_mode']=function(block,generator){sentryEnsureLibrary(generator);return base(block)+'.VisionSetMode(10, '+(block.getFieldValue('MODE')||'14')+');\n';};
  Arduino.forBlock[prefix+'_set_ocr_mode']=function(block,generator){sentryEnsureLibrary(generator);return base(block)+'.VisionSetMode(12, '+(block.getFieldValue('MODE')||'0')+');\n';};
  Arduino.forBlock[prefix+'_set_face_mode']=function(block,generator){sentryEnsureLibrary(generator);return base(block)+'.VisionSetMode(7, '+(block.getFieldValue('MODE')||'1')+');\n';};
  Arduino.forBlock[prefix+'_set_level']=function(block,generator){sentryEnsureLibrary(generator);return base(block)+'.VisionSetLevel('+vision(block)+', '+(block.getFieldValue('LEVEL')||'kLevelDefault')+');\n';};
  Arduino.forBlock[prefix+'_camera_zoom']=function(block,generator){const n=sentryFieldVariable(block);sentryEnsureLibrary(generator);return n+'.CameraSetZoom('+(block.getFieldValue('ZOOM')||'kZoomDefault')+');\n';};
  Arduino.forBlock[prefix+'_camera_awb']=function(block,generator){const n=sentryFieldVariable(block);sentryEnsureLibrary(generator);return n+'.CameraSetAwb('+(block.getFieldValue('AWB')||'kAutoWhiteBalance')+');\n';};
  Arduino.forBlock[prefix+'_set_coordinate']=function(block,generator){const n=sentryFieldVariable(block);sentryEnsureLibrary(generator);return n+'.SeneorSetCoordinateType('+(block.getFieldValue('COORDINATE')||'kAbsoluteCoordinate')+');\n';};
  Arduino.forBlock[prefix+'_vision_default']=function(block,generator){sentryEnsureLibrary(generator);return base(block)+'.VisionSetDefault('+vision(block)+');\n';};
  Arduino.forBlock[prefix+'_screen_config']=function(block,generator){const n=sentryFieldVariable(block);sentryEnsureLibrary(generator);return n+'.ScreenConfig('+sentryValue(generator,block,'ENABLE','true')+', '+sentryValue(generator,block,'USER_ONLY','false')+');\n';};
  Arduino.forBlock[prefix+'_screen_fill']=function(block,generator){const n=sentryFieldVariable(block);sentryEnsureLibrary(generator);return n+'.ScreenFill('+sentryValue(generator,block,'IMAGE_ID','1')+', '+sentryValue(generator,block,'RED','0')+', '+sentryValue(generator,block,'GREEN','0')+', '+sentryValue(generator,block,'BLUE','0')+');\n';};
  Arduino.forBlock[prefix+'_snapshot']=function(block,generator){const n=sentryFieldVariable(block);sentryEnsureLibrary(generator);return n+'.Snapshot('+(block.getFieldValue('DEST')||'kSnapshot2SD')+', '+(block.getFieldValue('SOURCE')||'kSnapshotFromCamera')+', '+(block.getFieldValue('FORMAT')||'kSnapshotTypeJPEG')+');\n';};
  Arduino.forBlock[prefix+'_restart']=function(block,generator){const n=sentryFieldVariable(block);sentryEnsureLibrary(generator);return n+'.SensorSetRestart();\n';};
  Arduino.forBlock[prefix+'_sensor_default']=function(block,generator){const n=sentryFieldVariable(block);sentryEnsureLibrary(generator);return n+'.SensorSetDefault('+sentryValue(generator,block,'VISION_ONLY','true')+');\n';};
  Arduino.forBlock[prefix+'_detected_count']=function(block,generator){sentryEnsureLibrary(generator);return [base(block)+'.GetValue('+vision(block)+', kStatus, 1)',generator.ORDER_ATOMIC];};
  Arduino.forBlock[prefix+'_get_value']=function(block,generator){sentryEnsureLibrary(generator);return [base(block)+'.GetValue('+vision(block)+', '+(block.getFieldValue('INFO')||'kLabel')+', '+sentryValue(generator,block,'ID','1')+')',generator.ORDER_ATOMIC];};
  Arduino.forBlock[prefix+'_detected_label']=function(block,generator){sentryEnsureLibrary(generator);return ['('+base(block)+'.GetValue('+vision(block)+', kLabel, '+sentryValue(generator,block,'ID','1')+') == '+sentryValue(generator,block,'LABEL','1')+')',generator.ORDER_ATOMIC];};
  Arduino.forBlock[prefix+'_get_qrcode']=function(block,generator){const n=sentryFieldVariable(block);sentryEnsureLibrary(generator);return ['String('+n+'.GetQrCodeValue() ? '+n+'.GetQrCodeValue() : "")',generator.ORDER_ATOMIC];};
  Arduino.forBlock[prefix+'_get_string']=function(block,generator){const n=sentryFieldVariable(block);sentryEnsureLibrary(generator);generator.addFunction('aily_sentry3_string','String ailySentry3String(Sentry3 &sensor, int vision, int id) {\n  const char *value = sensor.GetString((Sentry3::sentry_vision_e)vision, id);\n  return String(value ? value : "");\n}');return ['ailySentry3String('+n+', '+vision(block)+', '+sentryValue(generator,block,'ID','1')+')',generator.ORDER_ATOMIC];};
  Arduino.forBlock[prefix+'_vision_status']=function(block,generator){sentryEnsureLibrary(generator);return [base(block)+'.VisionGetStatus('+vision(block)+')',generator.ORDER_ATOMIC];};
  Arduino.forBlock[prefix+'_update_result']=function(block,generator){sentryEnsureLibrary(generator);return [base(block)+'.UpdateResult('+vision(block)+')',generator.ORDER_ATOMIC];};
  Arduino.forBlock[prefix+'_image_rows']=function(block,generator){const n=sentryFieldVariable(block);sentryEnsureLibrary(generator);return [n+'.rows()',generator.ORDER_ATOMIC];};
  Arduino.forBlock[prefix+'_image_cols']=function(block,generator){const n=sentryFieldVariable(block);sentryEnsureLibrary(generator);return [n+'.cols()',generator.ORDER_ATOMIC];};
}
registerSentryModel('sentry1','Sentry1','Sentry1Device','sentry1');
registerSentryModel('sentry2','Sentry2','Sentry2Device','sentry2');
registerSentryModel('sentry3','Sentry3','Sentry3Device','sentry3');
Arduino.forBlock['sentry3_wifi_connect']=function(block,generator){const n=sentryFieldVariable(block),s=sentryValue(generator,block,'SSID','""'),p=sentryValue(generator,block,'PASSWORD','""');sentryEnsureLibrary(generator);return 'while (SENTRY_OK != '+n+'.WiFiConfig(String('+s+').c_str(), String('+p+').c_str())) { yield(); }\nwhile (SENTRY_OK != '+n+'.WiFiConnectWithMode(kWiFiModeCloudAlgorithm)) { yield(); }\nwhile (SENTRY_OK != '+n+'.WiFiIsConnected()) { yield(); }\n';};
Arduino.forBlock['sentry3_wifi_close']=function(block,generator){const n=sentryFieldVariable(block);sentryEnsureLibrary(generator);return n+'.WiFiConnectWithMode(kWiFiModeClose);\n';};
function sentry3LlmSet(block,generator,method,input){const n=sentryFieldVariable(block),v=sentryValue(generator,block,input,'""');sentryEnsureLibrary(generator);return 'if ('+n+'.LLM()) { '+n+'.LLM()->'+method+'(String('+v+').c_str()); }\n';}
Arduino.forBlock['sentry3_llm_mode']=function(block,generator){const n=sentryFieldVariable(block);sentryEnsureLibrary(generator);return 'if ('+n+'.LLM()) { '+n+'.LLM()->SetMode(SentryLLM::'+(block.getFieldValue('MODE')||'kModeClose')+'); }\n';};
Arduino.forBlock['sentry3_llm_model']=function(b,g){return sentry3LlmSet(b,g,'SetModel','MODEL');};
Arduino.forBlock['sentry3_llm_api_key']=function(b,g){return sentry3LlmSet(b,g,'SetAPIKey','KEY');};
Arduino.forBlock['sentry3_llm_prompt']=function(b,g){return sentry3LlmSet(b,g,'SetSystemPrompt','PROMPT');};
Arduino.forBlock['sentry3_llm_voice']=function(b,g){return sentry3LlmSet(b,g,'SetVoice','VOICE');};
Arduino.forBlock['sentry3_llm_thinking']=function(block,generator){const n=sentryFieldVariable(block);sentryEnsureLibrary(generator);return 'if ('+n+'.LLM()) { '+n+'.LLM()->EnableThinking('+sentryValue(generator,block,'ENABLE','true')+'); }\n';};
Arduino.forBlock['sentry3_llm_chat']=function(block,generator){const n=sentryFieldVariable(block),v=sentryValue(generator,block,'TEXT','""');sentryEnsureLibrary(generator);generator.addFunction('aily_sentry3_chat','String ailySentry3Chat(Sentry3 &sensor, const String &text) {\n  static char response[1024];\n  if (!sensor.LLM()) return String("");\n  if (SENTRY_OK == sensor.LLM()->ChatCompletions(text.c_str(), response, sizeof(response))) return String(response);\n  return String(sensor.LLM()->Error());\n}');return ['ailySentry3Chat('+n+', String('+v+'))',generator.ORDER_ATOMIC];};
Arduino.forBlock['sentry3_llm_tts']=function(block,generator){const n=sentryFieldVariable(block),v=sentryValue(generator,block,'TEXT','""');sentryEnsureLibrary(generator);return 'if ('+n+'.LLM()) { '+n+'.LLM()->TextToSpeech(String('+v+').c_str()); }\n';};

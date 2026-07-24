'use strict';

function esp8266MeshVar(block) { const f = block.getField('VAR'); return f ? f.getText() : 'mesh'; }
function esp8266MeshInclude(generator) { generator.addLibrary('ESP8266_FloodingMesh', '#include <FloodingMesh.h>'); }
Arduino.forBlock['esp8266_wifi_mesh_begin'] = function(block, generator) {
  const name = block.getFieldValue('VAR') || 'mesh';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '"change-this-password"';
  const prefix = generator.valueToCode(block, 'PREFIX', generator.ORDER_ATOMIC) || '"MeshNode_"';
  const nodeId = generator.valueToCode(block, 'NODE_ID', generator.ORDER_ATOMIC) || '"node1"';
  const verbose = block.getFieldValue('VERBOSE') || 'false';
  const body = generator.statementToCode(block, 'HANDLER') || '';
  const callback = 'esp8266MeshMessage_' + name;
  esp8266MeshInclude(generator);
  registerVariableToBlockly(name, 'FloodingMesh');
  generator.addVariable(callback + '_prototype', 'bool ' + callback + '(String &message, FloodingMesh &meshInstance);');
  generator.addFunction(callback, 'bool ' + callback + '(String &message, FloodingMesh &meshInstance) {\n' + body + '  return true;\n}');
  generator.addObject('esp8266_mesh_' + name, 'FloodingMesh ' + name + '(' + callback + ', String(' + password + '), String("aily-esp8266-mesh-encryption"), String("aily-esp8266-mesh-hash"), String(' + prefix + '), String(' + nodeId + '), ' + verbose + ');');
  generator.addSetupEnd('esp8266_mesh_begin_' + name, name + '.begin();\n' + name + '.activateAP();');
  return '';
};
Arduino.forBlock['esp8266_wifi_mesh_broadcast'] = function(block, generator) { esp8266MeshInclude(generator); const m = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || '""'; return esp8266MeshVar(block) + '.broadcast(String(' + m + '));\n'; };
Arduino.forBlock['esp8266_wifi_mesh_encrypted_broadcast'] = function(block, generator) { esp8266MeshInclude(generator); const m = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || '""'; return esp8266MeshVar(block) + '.encryptedBroadcast(String(' + m + '));\n'; };
Arduino.forBlock['esp8266_wifi_mesh_maintenance'] = function(block, generator) { esp8266MeshInclude(generator); return 'FloodingMesh::performMeshMaintenance();\n'; };
Arduino.forBlock['esp8266_wifi_mesh_deactivate_ap'] = function(block, generator) { esp8266MeshInclude(generator); return 'FloodingMesh::deactivateAP();\n'; };
Arduino.forBlock['esp8266_wifi_mesh_message'] = function(block, generator) { return ['message', generator.ORDER_ATOMIC]; };
Arduino.forBlock['esp8266_wifi_mesh_origin_mac'] = function(block, generator) { return [esp8266MeshVar(block) + '.getOriginMac()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_wifi_mesh_max_plain'] = function(block, generator) { return [esp8266MeshVar(block) + '.maxUnencryptedMessageLength()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_wifi_mesh_max_encrypted'] = function(block, generator) { return [esp8266MeshVar(block) + '.maxEncryptedMessageLength()', generator.ORDER_FUNCTION_CALL]; };

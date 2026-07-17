// OJoy_QMI8658C generator
'use strict';
function isESP32Core(){var c=window['boardConfig'];return c&&c.core&&c.core.indexOf('esp32')>-1;}
var QMI_META={
 "ojqmi_init": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "AR",
    "k": "d"
   },
   {
    "n": "GR",
    "k": "d"
   }
  ],
  "code": null,
  "setupCode": "{VAR}.begin();\n{VAR}.setAccelRange({AR});\n{VAR}.setGyroRange({GR});\n",
  "out": null,
  "setup": true,
  "order": "ORDER_FUNCTION_CALL"
 },
 "ojqmi_update": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   }
  ],
  "code": "{VAR}.read();\n",
  "setupCode": null,
  "out": null,
  "setup": false,
  "order": "ORDER_FUNCTION_CALL"
 },
 "ojqmi_accel": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "AXIS",
    "k": "d"
   }
  ],
  "code": "{VAR}.a{AXIS}()",
  "setupCode": null,
  "out": "Number",
  "setup": false,
  "order": "ORDER_FUNCTION_CALL"
 },
 "ojqmi_gyro": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "AXIS",
    "k": "d"
   }
  ],
  "code": "{VAR}.g{AXIS}()",
  "setupCode": null,
  "out": "Number",
  "setup": false,
  "order": "ORDER_FUNCTION_CALL"
 },
 "ojqmi_angle": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "WHICH",
    "k": "d"
   }
  ],
  "code": "{VAR}.{WHICH}()",
  "setupCode": null,
  "out": "Number",
  "setup": false,
  "order": "ORDER_FUNCTION_CALL"
 },
 "ojqmi_temp": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   }
  ],
  "code": "{VAR}.temperature()",
  "setupCode": null,
  "out": "Number",
  "setup": false,
  "order": "ORDER_FUNCTION_CALL"
 },
 "ojqmi_present": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   }
  ],
  "code": "{VAR}.present()",
  "setupCode": null,
  "out": "Boolean",
  "setup": false,
  "order": "ORDER_FUNCTION_CALL"
 }
};
function qSub(t,v){return t.replace(/\{(\w+)\}/g,function(m,p){return (p in v)?v[p]:m;});}
function qAttach(block){
  if(block._qmiVarMonitorAttached)return; block._qmiVarMonitorAttached=true;
  block._qLast=block.getFieldValue('VAR')||'imu';
  if(typeof registerVariableToBlockly==='function')registerVariableToBlockly(block._qLast,'QMI8658');
  var vf=block.getField('VAR');
  if(vf){var o=vf.onFinishEditing_;vf.onFinishEditing_=function(nn){if(typeof o==='function')o.call(this,nn);
    var ws=block.workspace||(typeof Blockly!=='undefined'&&Blockly.getMainWorkspace&&Blockly.getMainWorkspace());
    var on=block._qLast; if(ws&&nn&&nn!==on){if(typeof renameVariableInBlockly==='function')renameVariableInBlockly(block,on,nn,'QMI8658');block._qLast=nn;}};}
}
Object.keys(QMI_META).forEach(function(type){
  var m=QMI_META[type];
  Arduino.forBlock[type]=function(block,generator){
    generator.addLibrary('OJoy_QMI8658C','#include <OJoy_QMI8658C.h>');
    var vals={}; m.a.forEach(function(a){ vals[a.n]= a.k==='var'?(block.getField('VAR')?block.getField('VAR').getText():'imu'):block.getFieldValue(a.n); });
    if(m.setup){
      qAttach(block); var V=block.getFieldValue('VAR')||'imu'; vals.VAR=V;
      generator.addObject(V,'OJoy_QMI8658C '+V+';');
      // OJoy 主 I2C 统一初始化(id 与其它 OJoy 主总线库一致 -> 自动去重, 全局只发一次)
      generator.addLibrary('Wire','#include <Wire.h>');
      generator.addSetup('ojoy_i2c_wire','Wire.begin(5, 4, 400000); // OJoy 主I2C SDA5/SCL4 (音频/RTC/IMU/电量计共用)');
      return qSub(m.setupCode,vals);
    }
    if(typeof registerVariableToBlockly==='function') registerVariableToBlockly(vals.VAR,'QMI8658');
    var out=qSub(m.code,vals);
    if(m.out) return [out, generator[m.order]];
    return out;
  };
});

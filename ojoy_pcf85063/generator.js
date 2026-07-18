// OJoy_PCF85063 generator
'use strict';
function isESP32Core(){var c=window['boardConfig'];return c&&c.core&&c.core.indexOf('esp32')>-1;}
var RTC_META={
 "ojrtc_init": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   }
  ],
  "code": null,
  "setupCode": "{VAR}.begin();\n",
  "out": null,
  "setup": true
 },
 "ojrtc_set_time": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "YEAR",
    "k": "num"
   },
   {
    "n": "MONTH",
    "k": "num"
   },
   {
    "n": "DAY",
    "k": "num"
   },
   {
    "n": "HOUR",
    "k": "num"
   },
   {
    "n": "MIN",
    "k": "num"
   },
   {
    "n": "SEC",
    "k": "num"
   }
  ],
  "code": "{VAR}.setTime({YEAR}, {MONTH}, {DAY}, {HOUR}, {MIN}, {SEC});\n",
  "setupCode": null,
  "out": null,
  "setup": false
 },
 "ojrtc_set_compile_time": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   }
  ],
  "code": "{VAR}.setCompileTime();\n",
  "setupCode": null,
  "out": null,
  "setup": false
 },
 "ojrtc_read": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   }
  ],
  "code": "{VAR}.read();\n",
  "setupCode": null,
  "out": null,
  "setup": false
 },
 "ojrtc_get": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "FIELD",
    "k": "d"
   }
  ],
  "code": "{VAR}.{FIELD}()",
  "setupCode": null,
  "out": "Number",
  "setup": false
 },
 "ojrtc_format": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "FMT",
    "k": "d"
   }
  ],
  "code": "{VAR}.{FMT}()",
  "setupCode": null,
  "out": "String",
  "setup": false
 },
 "ojrtc_lost_power": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   }
  ],
  "code": "{VAR}.lostPower()",
  "setupCode": null,
  "out": "Boolean",
  "setup": false
 },
 "ojrtc_present": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   }
  ],
  "code": "{VAR}.present()",
  "setupCode": null,
  "out": "Boolean",
  "setup": false
 }
};
function rSub(t,v){return t.replace(/\{(\w+)\}/g,function(m,p){return (p in v)?v[p]:m;});}
function rReadArg(block,generator,a){
  if(a.k==='var'){var f=block.getField('VAR');return f?f.getText():'rtc';}
  if(a.k==='d')return block.getFieldValue(a.n);
  var v=generator.valueToCode(block,a.n,generator.ORDER_ATOMIC); if(v==null||v==='')v='0';
  return v.replace(/^\((.+)\)$/,'$1');
}
function rAttach(block){
  if(block._rtcVarMonitorAttached)return; block._rtcVarMonitorAttached=true;
  block._rLast=block.getFieldValue('VAR')||'rtc';
  if(typeof registerVariableToBlockly==='function')registerVariableToBlockly(block._rLast,'PCF85063');
  var vf=block.getField('VAR');
  if(vf){var o=vf.onFinishEditing_;vf.onFinishEditing_=function(nn){if(typeof o==='function')o.call(this,nn);
    var ws=block.workspace||(typeof Blockly!=='undefined'&&Blockly.getMainWorkspace&&Blockly.getMainWorkspace());
    var on=block._rLast; if(ws&&nn&&nn!==on){if(typeof renameVariableInBlockly==='function')renameVariableInBlockly(block,on,nn,'PCF85063');block._rLast=nn;}};}
}
Object.keys(RTC_META).forEach(function(type){
  var m=RTC_META[type];
  Arduino.forBlock[type]=function(block,generator){
    generator.addLibrary('OJoy_PCF85063','#include <OJoy_PCF85063.h>');
    var vals={}; m.a.forEach(function(a){ vals[a.n]=rReadArg(block,generator,a); });
    if(m.setup){
      rAttach(block); var V=block.getFieldValue('VAR')||'rtc'; vals.VAR=V;
      generator.addObject(V,'OJoy_PCF85063 '+V+';');
      // OJoy 主 I2C 统一初始化(id 与其它 OJoy 主总线库一致 -> 自动去重, 全局只发一次)
      generator.addLibrary('Wire','#include <Wire.h>');
      generator.addSetup('ojoy_i2c_wire','Wire.begin(5, 4, 400000); // OJoy 主I2C SDA5/SCL4 (音频/RTC/IMU/电量计共用)');
      return rSub(m.setupCode,vals);
    }
    if(typeof registerVariableToBlockly==='function') registerVariableToBlockly(vals.VAR,'PCF85063');
    var out=rSub(m.code,vals);
    if(m.out) return [out, generator.ORDER_FUNCTION_CALL];
    return out;
  };
});

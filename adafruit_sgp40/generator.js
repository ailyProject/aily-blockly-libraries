// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_sgp40EnsureLibrary(generator) {
  generator.addLibrary('adafruit_sgp40_0', `#include <Adafruit_SGP40.h>
class AilySGP40Connection {
 public:
  bool ensure(Adafruit_SGP40& sensor) {
    if (!wire) return false;
    wire->beginTransmission(SGP40_I2CADDR_DEFAULT);
    if (wire->endTransmission() != 0) {
      ready = false;
      return false;
    }
    if (!ready) ready = sensor.begin(wire);
    return ready;
  }
  void attach(Adafruit_SGP40& sensor, TwoWire& port) {
    wire = &port;
    ready = false;
    ensure(sensor);
  }
 private:
  TwoWire* wire = nullptr;
  bool ready = false;
};`);
}

function adafruit_sgp40Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'sgp40');
}

function adafruit_sgp40AttachVariable(block) {
  if (block._adafruit_sgp40VariableAttached) return;
  block._adafruit_sgp40VariableAttached = true;
  block._adafruit_sgp40LastName = block.getFieldValue('VAR') || 'sgp40';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adafruit_sgp40LastName, 'Adafruit_SGP40');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adafruit_sgp40LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adafruit_sgp40LastName, newName, 'Adafruit_SGP40');
      block._adafruit_sgp40LastName = newName;
    }
  };
}

function adafruit_sgp40EnsureExtras(generator, varName) {
  generator.addObject('adafruit_sgp40_connection_' + varName,
    'AilySGP40Connection ailySgp40Connection_' + varName + ';');
}

Arduino.forBlock['adafruit_sgp40_init'] = function(block, generator) {
  adafruit_sgp40AttachVariable(block);
  adafruit_sgp40EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'sgp40';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var objectCode = "Adafruit_SGP40 " + String(varName) + ";";
  generator.addObject('adafruit_sgp40_object_' + varName, objectCode);
  adafruit_sgp40EnsureExtras(generator, varName);
  generator.addSetupBegin('adafruit_sgp40_wire_' + wire, wire + '.begin();');

  generator.addSetupBegin('adafruit_sgp40_begin_' + varName, 'ailySgp40Connection_' + varName + '.attach(' + varName + ', ' + wire + ');');
  return '';
};

Arduino.forBlock['adafruit_sgp40_read'] = function(block, generator) {
  adafruit_sgp40EnsureLibrary(generator);
  var varName = adafruit_sgp40Variable(block);
  adafruit_sgp40EnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "raw";
  var expressions = {
    "raw": String(varName) + ".measureRaw()",
    "voc_index": String(varName) + ".measureVocIndex()",
    "self_test": String(varName) + ".selfTest()"
  };
  return ['(ailySgp40Connection_' + varName + '.ensure(' + varName + ') ? ' + (expressions[data] || expressions.raw) + ' : 0)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['adafruit_sgp40_measure'] = function(block, generator) {
  adafruit_sgp40EnsureLibrary(generator);
  var varName = adafruit_sgp40Variable(block);
  adafruit_sgp40EnsureExtras(generator, varName);
  var value1 = generator.valueToCode(block, 'VALUE1', generator.ORDER_ATOMIC) || "25";
  var value2 = generator.valueToCode(block, 'VALUE2', generator.ORDER_ATOMIC) || "50";
  var expression = String(varName) + ".measureVocIndex(" + String(value1) + ", " + String(value2) + ")";
  return ['(ailySgp40Connection_' + varName + '.ensure(' + varName + ') ? ' + expression + ' : 0)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['adafruit_sgp40_action'] = function(block, generator) {
  adafruit_sgp40EnsureLibrary(generator);
  var varName = adafruit_sgp40Variable(block);
  adafruit_sgp40EnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "reset";
  var actions = {
    "reset": String(varName) + ".softReset();",
    "heater_off": String(varName) + ".heaterOff();"
  };
  return 'if (ailySgp40Connection_' + varName + '.ensure(' + varName + ')) { ' + (actions[action] || actions.reset) + ' }' + '\n';
};


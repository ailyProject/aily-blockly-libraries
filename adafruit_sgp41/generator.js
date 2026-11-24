// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_sgp41EnsureLibrary(generator) {
  generator.addLibrary('adafruit_sgp41_0', `#include <Adafruit_SGP41.h>
class AilySGP41Connection {
 public:
  void attach(Adafruit_SGP41& sensor, TwoWire& bus) {
    port = &bus;
    ready = false;
    ensure(sensor);
  }

  bool ensure(Adafruit_SGP41& sensor) {
    if (!port) return false;
    port->beginTransmission(SGP41_DEFAULT_ADDR);
    if (port->endTransmission() != 0) {
      ready = false;
      return false;
    }
    if (!ready) ready = sensor.begin(SGP41_DEFAULT_ADDR, port);
    return ready;
  }

  bool measure(Adafruit_SGP41& sensor, uint16_t& voc, uint16_t& nox,
               float humidity = 50.0f, float temperature = 25.0f) {
    if (ensure(sensor) && sensor.measureRawSignals(&voc, &nox, humidity, temperature)) return true;
    // A failed transfer must not expose the previous successful sample.
    voc = 0;
    nox = 0;
    return false;
  }
 private:
  TwoWire* port = nullptr;
  bool ready = false;
};`);
}

function adafruit_sgp41Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'sgp41');
}

function adafruit_sgp41AttachVariable(block) {
  if (block._adafruit_sgp41VariableAttached) return;
  block._adafruit_sgp41VariableAttached = true;
  block._adafruit_sgp41LastName = block.getFieldValue('VAR') || 'sgp41';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adafruit_sgp41LastName, 'Adafruit_SGP41');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adafruit_sgp41LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adafruit_sgp41LastName, newName, 'Adafruit_SGP41');
      block._adafruit_sgp41LastName = newName;
    }
  };
}

function adafruit_sgp41EnsureExtras(generator, varName) {
  generator.addObject('adafruit_sgp41_connection_' + varName, 'AilySGP41Connection ailySgp41Connection_' + varName + ';');
  generator.addObject('adafruit_sgp41_extra_0_' + varName, "uint16_t " + String(varName) + "VocRaw = 0;");
  generator.addObject('adafruit_sgp41_extra_1_' + varName, "uint16_t " + String(varName) + "NoxRaw = 0;");
}

Arduino.forBlock['adafruit_sgp41_init'] = function(block, generator) {
  adafruit_sgp41AttachVariable(block);
  adafruit_sgp41EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'sgp41';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var objectCode = "Adafruit_SGP41 " + String(varName) + ";";
  generator.addObject('adafruit_sgp41_object_' + varName, objectCode);
  adafruit_sgp41EnsureExtras(generator, varName);
  generator.addSetupBegin('adafruit_sgp41_wire_' + wire, wire + '.begin();');
  generator.addSetupBegin('adafruit_sgp41_begin_' + varName, 'ailySgp41Connection_' + varName + '.attach(' + varName + ', ' + wire + ');');
  return '';
};

Arduino.forBlock['adafruit_sgp41_read'] = function(block, generator) {
  adafruit_sgp41EnsureLibrary(generator);
  var varName = adafruit_sgp41Variable(block);
  adafruit_sgp41EnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "voc_raw";
  var guard = 'ailySgp41Connection_' + varName;
  if (data === 'self_test') return ['(' + guard + '.ensure(' + varName + ') ? ' + varName + '.executeSelfTest() : 0)', generator.ORDER_ATOMIC];
  var word = data === 'nox_raw' ? 'NoxRaw' : 'VocRaw';
  return ['(' + guard + '.measure(' + varName + ', ' + varName + 'VocRaw, ' + varName + 'NoxRaw), ' + varName + word + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['adafruit_sgp41_action'] = function(block, generator) {
  adafruit_sgp41EnsureLibrary(generator);
  var varName = adafruit_sgp41Variable(block);
  adafruit_sgp41EnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "conditioning";
  var actions = {
    "conditioning": "if (!" + varName + ".executeConditioning(&" + varName + "VocRaw)) " + varName + "VocRaw = 0;",
    "reset": String(varName) + ".softReset();",
    "heater_off": String(varName) + ".turnHeaterOff();"
  };
  return 'if (ailySgp41Connection_' + varName + '.ensure(' + varName + ')) { ' + (actions[action] || actions.conditioning) + ' } else { ' + varName + 'VocRaw = ' + varName + 'NoxRaw = 0; }' + '\n';
};

Arduino.forBlock['adafruit_sgp41_adjust'] = function(block, generator) {
  adafruit_sgp41EnsureLibrary(generator);
  var varName = adafruit_sgp41Variable(block);
  var value1 = generator.valueToCode(block, 'VALUE1', generator.ORDER_ATOMIC) || "50";
  var value2 = generator.valueToCode(block, 'VALUE2', generator.ORDER_ATOMIC) || "25";
  return 'ailySgp41Connection_' + varName + '.measure(' + varName + ', ' + varName + 'VocRaw, ' + varName + 'NoxRaw, ' + String(value1) + ", " + String(value2) + ");" + '\n';
};


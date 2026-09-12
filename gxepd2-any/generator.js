var GXEPD2ANY_VAR_TYPE = 'GxEPD2';

var GXEPD2ANY_PANELS = {
  GxEPD2_102: { base: 'GxEPD2_BW', pageH: 128 },
  GxEPD2_213_flex: { base: 'GxEPD2_BW', pageH: 212 },
  GxEPD2_213_M21: { base: 'GxEPD2_BW', pageH: 212 },
  GxEPD2_213_T5D: { base: 'GxEPD2_BW', pageH: 212 },
  GxEPD2_213: { base: 'GxEPD2_BW', pageH: 250 },
  GxEPD2_213_B72: { base: 'GxEPD2_BW', pageH: 250 },
  GxEPD2_213_B73: { base: 'GxEPD2_BW', pageH: 250 },
  GxEPD2_213_B74: { base: 'GxEPD2_BW', pageH: 250 },
  GxEPD2_213_BN: { base: 'GxEPD2_BW', pageH: 250 },
  GxEPD2_213_GDEY0213B74: { base: 'GxEPD2_BW', pageH: 250 },
  GxEPD2_290: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_290_BS: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_290_GDEY029T94: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_290_I6FD: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_290_M06: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_290_T5: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_290_T5D: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_290_T94: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_290_T94_V2: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_154_M10: { base: 'GxEPD2_BW', pageH: 152 },
  GxEPD2_154_T8: { base: 'GxEPD2_BW', pageH: 152 },
  GxEPD2_260: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_260_M01: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_266_BN: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_266_GDEY0266T90: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_290_GDEY029T71H: { base: 'GxEPD2_BW', pageH: 384 },
  GxEPD2_270: { base: 'GxEPD2_BW', pageH: 264 },
  GxEPD2_270_GDEY027T91: { base: 'GxEPD2_BW', pageH: 264 },
  GxEPD2_150_BN: { base: 'GxEPD2_BW', pageH: 200 },
  GxEPD2_154: { base: 'GxEPD2_BW', pageH: 200 },
  GxEPD2_154_D67: { base: 'GxEPD2_BW', pageH: 200 },
  GxEPD2_154_GDEY0154D67: { base: 'GxEPD2_BW', pageH: 200 },
  GxEPD2_154_M09: { base: 'GxEPD2_BW', pageH: 200 },
  GxEPD2_310_GDEQ031T10: { base: 'GxEPD2_BW', pageH: 320 },
  GxEPD2_370_GDEY037T03: { base: 'GxEPD2_BW', pageH: 416 },
  GxEPD2_371: { base: 'GxEPD2_BW', pageH: 416 },
  GxEPD2_370_TC1: { base: 'GxEPD2_BW', pageH: 480 },
  GxEPD2_420: { base: 'GxEPD2_BW', pageH: 300 },
  GxEPD2_420_GDEY042T81: { base: 'GxEPD2_BW', pageH: 300 },
  GxEPD2_420_GYE042A87: { base: 'GxEPD2_BW', pageH: 300 },
  GxEPD2_420_M01: { base: 'GxEPD2_BW', pageH: 300 },
  GxEPD2_420_SE0420NQ04: { base: 'GxEPD2_BW', pageH: 300 },
  GxEPD2_583: { base: 'GxEPD2_BW', pageH: 448 },
  GxEPD2_750: { base: 'GxEPD2_BW', pageH: 384 },
  GxEPD2_583_GDEQ0583T31: { base: 'GxEPD2_BW', pageH: 480 },
  GxEPD2_583_T8: { base: 'GxEPD2_BW', pageH: 480 },
  GxEPD2_579_GDEY0579T93: { base: 'GxEPD2_BW', pageH: 272 },
  GxEPD2_397_GDEM0397T81: { base: 'GxEPD2_BW', pageH: 480 },
  GxEPD2_426_GDEQ0426T82: { base: 'GxEPD2_BW', pageH: 480 },
  GxEPD2_750_GDEY075T7: { base: 'GxEPD2_BW', pageH: 480 },
  GxEPD2_750_T7: { base: 'GxEPD2_BW', pageH: 480 },
  GxEPD2_576_GDEH0576T81: { base: 'GxEPD2_BW', pageH: 568 },
  GxEPD2_1020_GDEM102T91: { base: 'GxEPD2_BW', pageH: 544 },
  GxEPD2_1160_T91: { base: 'GxEPD2_BW', pageH: 544 },
  GxEPD2_1330_GDEM133T91: { base: 'GxEPD2_BW', pageH: 544 },
  GxEPD2_1248: { base: 'GxEPD2_BW', pageH: 400 },
  GxEPD2_1085_GDEM1085T51: { base: 'GxEPD2_BW', pageH: 384 },
  GxEPD2_213_Z19c: { base: 'GxEPD2_3C', pageH: 212 },
  GxEPD2_213c: { base: 'GxEPD2_3C', pageH: 212 },
  GxEPD2_213_Z98c: { base: 'GxEPD2_3C', pageH: 250 },
  GxEPD2_290_C90c: { base: 'GxEPD2_3C', pageH: 296 },
  GxEPD2_290_Z13c: { base: 'GxEPD2_3C', pageH: 296 },
  GxEPD2_290c: { base: 'GxEPD2_3C', pageH: 296 },
  GxEPD2_266c: { base: 'GxEPD2_3C', pageH: 296 },
  GxEPD2_270c: { base: 'GxEPD2_3C', pageH: 264 },
  GxEPD2_154_Z90c: { base: 'GxEPD2_3C', pageH: 200 },
  GxEPD2_154c: { base: 'GxEPD2_3C', pageH: 200 },
  GxEPD2_420c: { base: 'GxEPD2_3C', pageH: 300 },
  GxEPD2_420c_GDEY042Z98: { base: 'GxEPD2_3C', pageH: 300 },
  GxEPD2_420c_Z21: { base: 'GxEPD2_3C', pageH: 300 },
  GxEPD2_583c: { base: 'GxEPD2_3C', pageH: 432 },
  GxEPD2_750c: { base: 'GxEPD2_3C', pageH: 384 },
  GxEPD2_583c_GDEQ0583Z31: { base: 'GxEPD2_3C', pageH: 400 },
  GxEPD2_583c_Z83: { base: 'GxEPD2_3C', pageH: 400 },
  GxEPD2_579c_GDEY0579Z93: { base: 'GxEPD2_3C', pageH: 272 },
  GxEPD2_750c_GDEW075Z08: { base: 'GxEPD2_3C', pageH: 320 },
  GxEPD2_750c_GDEY075Z08: { base: 'GxEPD2_3C', pageH: 320 },
  GxEPD2_750c_Z08: { base: 'GxEPD2_3C', pageH: 320 },
  GxEPD2_750c_Z90: { base: 'GxEPD2_3C', pageH: 296 },
  GxEPD2_1160c_GDEY116Z91: { base: 'GxEPD2_3C', pageH: 272 },
  GxEPD2_1330c_GDEM133Z91: { base: 'GxEPD2_3C', pageH: 272 },
  GxEPD2_1248c: { base: 'GxEPD2_3C', pageH: 200 },
  GxEPD2_213c_GDEY0213F51: { base: 'GxEPD2_4C', pageH: 250 },
  GxEPD2_290c_GDEY029F51H: { base: 'GxEPD2_4C', pageH: 384 },
  GxEPD2_300c: { base: 'GxEPD2_4C', pageH: 400 },
  GxEPD2_266c_GDEY0266F51H: { base: 'GxEPD2_4C', pageH: 360 },
  GxEPD2_350c_GDEM035F51: { base: 'GxEPD2_4C', pageH: 384 },
  GxEPD2_154c_GDEM0154F51H: { base: 'GxEPD2_4C', pageH: 200 },
  GxEPD2_420c_GDEY0420F51: { base: 'GxEPD2_4C', pageH: 300 },
  GxEPD2_437c: { base: 'GxEPD2_4C', pageH: 368 },
  GxEPD2_579c_GDEY0579F51: { base: 'GxEPD2_4C', pageH: 272 },
  GxEPD2_397c_GDEM0397F81: { base: 'GxEPD2_4C', pageH: 320 },
  GxEPD2_750c_GDEM075F52: { base: 'GxEPD2_4C', pageH: 320 },
  GxEPD2_1160c_GDEY116F51: { base: 'GxEPD2_4C', pageH: 272 },
  GxEPD2_565c: { base: 'GxEPD2_7C', pageH: 432 },
  GxEPD2_565c_GDEP0565D90: { base: 'GxEPD2_7C', pageH: 432 },
  GxEPD2_730c_ACeP_730: { base: 'GxEPD2_7C', pageH: 320 },
  GxEPD2_730c_GDEP073E01: { base: 'GxEPD2_7C', pageH: 320 },
  GxEPD2_730c_GDEY073D46: { base: 'GxEPD2_7C', pageH: 320 }
};

function gxepd2anySanitizeIdentifier(value, fallback) {
  var name = String(value || fallback || 'display').trim();
  name = name.replace(/[^A-Za-z0-9_]/g, '_');
  if (!/^[A-Za-z_]/.test(name)) {
    name = '_' + name;
  }
  return name || fallback || 'display';
}

function gxepd2anyCleanValue(value, fallback) {
  var code = value == null || value === '' ? fallback : String(value);
  return code.replace(/^\((.*)\)$/, '$1');
}

function gxepd2anyBool(value) {
  return value === 'TRUE' || value === true ? 'true' : 'false';
}

function gxepd2anyValueToCode(block, generator, name, fallback) {
  return gxepd2anyCleanValue(generator.valueToCode(block, name, generator.ORDER_ATOMIC), fallback);
}

function gxepd2anyGetBoardCore() {
  var boardConfig = typeof window !== 'undefined' && window['boardConfig'] ? window['boardConfig'] : null;
  return boardConfig && boardConfig.core ? String(boardConfig.core).toLowerCase() : '';
}

function gxepd2anyAttachVarMonitor(block) {
  if (block._gxepd2anyVarMonitorAttached) {
    return;
  }
  block._gxepd2anyVarMonitorAttached = true;
  block._gxepd2anyVarLastName = gxepd2anySanitizeIdentifier(block.getFieldValue('VAR'), 'display');
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._gxepd2anyVarLastName, GXEPD2ANY_VAR_TYPE);
  }
  var varField = block.getField('VAR');
  if (!varField) {
    return;
  }
  var originalFinishEditing = varField.onFinishEditing_;
  varField.onFinishEditing_ = function(newName) {
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, newName);
    }
    var workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
    var oldName = block._gxepd2anyVarLastName;
    var cleanName = gxepd2anySanitizeIdentifier(newName, oldName);
    if (workspace && cleanName && cleanName !== oldName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, oldName, cleanName, GXEPD2ANY_VAR_TYPE);
      block._gxepd2anyVarLastName = cleanName;
    }
  };
}

Arduino.forBlock['gxepd2any_setup'] = function(block, generator) {
  gxepd2anyAttachVarMonitor(block);
  var boardCore = gxepd2anyGetBoardCore(); // reserved for board-specific adaptations
  // Same include keys as @aily-project/lib-gxepd2 so duplicate includes deduplicate.
  generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
  generator.addLibrary('GxEPD2', '#include <GxEPD2.h>');
  generator.addLibrary('GxEPD2_BW', '#include <GxEPD2_BW.h>');
  generator.addLibrary('GxEPD2_3C', '#include <GxEPD2_3C.h>');
  generator.addLibrary('GxEPD2_4C', '#include <GxEPD2_4C.h>');
  generator.addLibrary('GxEPD2_7C', '#include <GxEPD2_7C.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');

  var varName = gxepd2anySanitizeIdentifier(block.getFieldValue('VAR'), 'display');
  var cls = block.getFieldValue('PANEL');
  var panel = GXEPD2ANY_PANELS[cls];
  if (!panel) {
    panel = GXEPD2ANY_PANELS['GxEPD2_154_D67'] || { base: 'GxEPD2_BW', pageH: 200 };
  }
  var sck = gxepd2anyValueToCode(block, generator, 'SCK', '18');
  var mosi = gxepd2anyValueToCode(block, generator, 'MOSI', '23');
  var cs = gxepd2anyValueToCode(block, generator, 'CS', 'SS');
  var dc = gxepd2anyValueToCode(block, generator, 'DC', '17');
  var rst = gxepd2anyValueToCode(block, generator, 'RST', '21');
  var busy = gxepd2anyValueToCode(block, generator, 'BUSY', '4');
  var baud = block.getFieldValue('BAUD') || '0';
  var resetDuration = block.getFieldValue('RESET_DURATION') || '2';
  var initial = gxepd2anyBool(block.getFieldValue('INITIAL'));
  var pulldown = gxepd2anyBool(block.getFieldValue('PULLDOWN'));

  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, GXEPD2ANY_VAR_TYPE);
  }

  if (baud !== '0' && typeof ensureSerialBegin === 'function') {
    ensureSerialBegin('Serial', generator, baud);
  }

  // Pin the hardware SPI bus to the chosen SCK/MOSI before display init
  // (same approach as the stock gxepd2_spi_pins block; e-paper has no MISO).
  var code = 'SPI.end();\nSPI.begin(' + sck + ', -1, ' + mosi + ', ' + cs + ');\n';

  var declaration = panel.base + '<' + cls + ', ' + panel.pageH + '> ' + varName +
    '(' + cls + '(' + cs + ', ' + dc + ', ' + rst + ', ' + busy + '));';
  generator.addVariable(varName, declaration);

  code += varName + '.init(' + baud + ', ' + initial + ', ' + resetDuration + ', ' + pulldown + ');\n';
  return code;
};

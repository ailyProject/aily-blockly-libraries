const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function runtime(...packages) {
  const libraries = Object.create(null);
  const variables = Object.create(null);
  const generator = {
    forBlock: {},
    codeDict: { libraries },
    addLibrary(key, code, overwrite = false) {
      if (overwrite || libraries[key] === undefined) libraries[key] = code;
    },
    addVariable(key, code) { variables[key] = code; },
    addObject() {},
    valueToCode() { return ''; },
    ORDER_ATOMIC: 0
  };
  for (const name of packages) {
    const file = path.join(__dirname, '..', name, 'generator.js');
    vm.runInNewContext(fs.readFileSync(file, 'utf8'), { Arduino: generator }, { filename: file });
  }
  return {
    invoke(type, fields = {}) {
      const block = { getFieldValue: field => fields[field], getField: () => undefined };
      return generator.forBlock[type](block, generator);
    },
    includes: () => Object.values(libraries).filter(Boolean),
    variables
  };
}

test('Linkbit setup emits only its three-color display header and keeps the original pin mapping', () => {
  const gen = runtime('linkbit_GxEPD2');
  const setup = gen.invoke('gxepd2_setup', { VAR: 'display' });
  assert.deepEqual(gen.includes(), ['#include <Adafruit_GFX.h>', '#include <GxEPD2_3C.h>', '#include <SPI.h>']);
  assert.equal(gen.variables.display, 'GxEPD2_3C<GxEPD2_213_Z98c, GxEPD2_213_Z98c::HEIGHT> display(GxEPD2_213_Z98c(2, 3, 1, 0));');
  assert.match(setup, /SPI\.begin\(6, -1, 7, 2\)/);
});

test('standard and any-panel setup accumulate selected headers once across multiple displays', () => {
  const gen = runtime('GxEPD2', 'gxepd2-any');
  gen.invoke('gxepd2_setup', { VAR: 'mono', PANEL: 'BW_GDEH0154D67' });
  gen.invoke('gxepd2any_setup', { VAR: 'tri', PANEL: 'GxEPD2_213_Z98c' });
  gen.invoke('gxepd2_setup', { VAR: 'tri2', PANEL: 'C3_GDEY0213Z98' });
  assert.deepEqual(gen.includes(), ['#include <Adafruit_GFX.h>', '#include <GxEPD2_BW.h>', '#include <GxEPD2_3C.h>', '#include <SPI.h>']);
  assert.match(gen.variables.mono, /^GxEPD2_BW<GxEPD2_154_D67,/);
  assert.match(gen.variables.tri, /^GxEPD2_3C<GxEPD2_213_Z98c,/);
  assert.match(gen.variables.tri2, /^GxEPD2_3C<GxEPD2_213_Z98c,/);
});

test('color-only blocks supply their header until a panel is generated, regardless of block order', () => {
  for (const name of ['GxEPD2', 'linkbit_GxEPD2']) {
    const gen = runtime(name, 'gxepd2-any');
    assert.equal(gen.invoke('gxepd2_color', { COLOR: 'GxEPD_RED' })[0], 'GxEPD_RED');
    assert.deepEqual(gen.includes(), ['#include <GxEPD2.h>']);
    gen.invoke('gxepd2_setup');
    gen.invoke('gxepd2_u8g2_color');
    assert.ok(gen.includes().includes('#include <U8g2_for_Adafruit_GFX.h>'));
    assert.ok(!gen.includes().includes('#include <GxEPD2.h>'));

    const before = runtime(name, 'gxepd2-any');
    before.invoke('gxepd2_u8g2_color');
    before.invoke('gxepd2any_setup', { PANEL: 'GxEPD2_213_Z98c' });
    assert.ok(!before.includes().includes('#include <GxEPD2.h>'));

    const after = runtime(name, 'gxepd2-any');
    after.invoke('gxepd2any_setup', { PANEL: 'GxEPD2_213_Z98c' });
    after.invoke('gxepd2_color');
    assert.ok(!after.includes().includes('#include <GxEPD2.h>'));
  }
});

test('selected fonts register their own include and the classic font adds none', () => {
  for (const name of ['GxEPD2', 'linkbit_GxEPD2']) {
    const def = JSON.parse(fs.readFileSync(path.join(__dirname, '..', name, 'block.json'), 'utf8'));
    const fontField = def.find(block => block.type === 'gxepd2_set_font').args0.find(field => field.name === 'FONT');
    for (const [, font] of fontField.options) {
      const gen = runtime(name);
      const code = gen.invoke('gxepd2_set_font', { FONT: font });
      if (font === 'NULL') {
        assert.equal(code, 'display.setFont();\n');
        assert.deepEqual(gen.includes(), []);
      } else {
        assert.equal(code, 'display.setFont(' + font + ');\n');
        assert.deepEqual(gen.includes(), ['#include <Fonts/' + font.slice(1) + '.h>']);
      }
    }
  }
});

test('explicit manual includes and custom font references survive automatic selection', () => {
  const gen = runtime('GxEPD2', 'core-custom');
  gen.invoke('custom_library', { LIB_NAME: 'GxEPD2.h' });
  gen.invoke('custom_library', { LIB_NAME: 'Fonts/MyFont.h' });
  gen.invoke('gxepd2_color');
  gen.invoke('gxepd2_setup');
  assert.equal(gen.invoke('gxepd2_set_font', { FONT: '&MyFont' }), 'display.setFont(&MyFont);\n');
  assert.deepEqual(gen.includes(), [
    '#include <GxEPD2.h>', '#include <Fonts/MyFont.h>', '#include <Adafruit_GFX.h>', '#include <GxEPD2_BW.h>'
  ]);
});

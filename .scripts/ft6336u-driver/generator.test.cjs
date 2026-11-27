const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

test('default and renamed FT6336U devices have independent object and scan cache declarations', () => {
  const Arduino = { forBlock: {} };
  const source = fs.readFileSync(path.join(__dirname, '../../FT6336U/generator.js'), 'utf8');
  vm.runInNewContext(source, { Arduino });
  const declarations = new Map();
  const generator = {
    addLibrary() {}, valueToCode() { return '2'; },
    addObject(key, value) {
      assert(!declarations.has(key) || declarations.get(key) === value);
      declarations.set(key, value);
    },
  };
  const symbols = new Set();
  for (const name of ['touch', 'panel', 'panel_points', 'touch_points', 'release', 'stream', 'aily_ft6336u_device_touch']) {
    const init = { getField: () => null, getFieldValue: () => name };
    const selected = { getField: () => ({ getText: () => name }), getFieldValue: () => '' };
    const device = Arduino.forBlock.ft6336u_init(init, generator).split('.')[0];
    if (name === 'panel') assert.equal(device, name);
    const scan = Arduino.forBlock.ft6336u_scan(selected, generator);
    const [cache, expression] = scan.split(' = ');
    assert.equal(expression.trim(), device + '.scan();');
    assert.equal(Arduino.forBlock.ft6336u_scan_touch_count(selected, generator)[0], cache + '.touch_count');
    assert.equal(Arduino.forBlock.ft6336u_touch_count(selected, generator)[0], device + '.read_touch_number()');
    for (const symbol of [device, cache]) {
      assert(!symbols.has(symbol), symbol);
      symbols.add(symbol);
    }
  }
  assert.equal(declarations.size, symbols.size);
});

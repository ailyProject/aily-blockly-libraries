const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { spawnSync, execFileSync } = require('node:child_process');
const { webcrypto } = require('node:crypto');

const libraries = path.resolve(__dirname, '..');
// These integration contracts need the real Host and an existing project's
// installed packages. No dependency installation or package copying is done.
const host = path.resolve(process.env.AILY_BLOCKLY_ROOT || path.join(libraries, '..', 'aily-blockly'));
assert.ok(fs.existsSync(path.join(host, 'package.json')), 'Set AILY_BLOCKLY_ROOT to an existing Host checkout with its dependencies available');
assert.ok(process.env.AILY_MODEL_SYMBOL_INSTALLED_ROOT, 'Set AILY_MODEL_SYMBOL_INSTALLED_ROOT to an existing project node_modules/@aily-project directory (including the original 1.0.1 packages)');
const normal = path.resolve(process.env.AILY_MODEL_SYMBOL_INSTALLED_ROOT);
assert.ok(fs.existsSync(path.join(normal, 'lib-core-loop', 'generator.js')), 'AILY_MODEL_SYMBOL_INSTALLED_ROOT must contain the real installed library packages');
const hostRequire = createRequire(path.join(host, 'package.json'));
const Blockly = hostRequire('blockly');
hostRequire('blockly/blocks');
const { DOMImplementation, DOMParser, XMLSerializer } = hostRequire('@xmldom/xmldom');
Blockly.utils.xml.injectDependencies({ document: new DOMImplementation().createDocument(null, 'xml'), DOMParser, XMLSerializer });
const { buildSync } = hostRequire('esbuild');
const arduino = path.join(host, 'src/app/editors/blockly-editor/components/blockly/generators/arduino/arduino.ts');
const customContract = path.join(host, 'src/app/editors/blockly-editor/services/blockly-custom-function-contract.ts');
const bundled = buildSync({ stdin: { contents: `import ${JSON.stringify(path.join(host, 'src/app/editors/blockly-editor/utils/blockly-legacy-library-compat.ts'))}; export * from ${JSON.stringify(arduino)}; export { registerCustomFunctionContract, captureCustomFunctionRegistration, clearCustomFunctionRegistration } from ${JSON.stringify(customContract)};`, resolveDir: host }, bundle: true, platform: 'node', format: 'cjs',
  external: ['blockly'], write: false, logLevel: 'silent' }).outputFiles[0].text;
const compiled = { exports: {} };
vm.runInNewContext(bundled, { require: hostRequire, module: compiled, exports: compiled.exports, TextEncoder, window: { crypto: webcrypto } });
const { ArduinoGenerator, registerCustomFunctionContract, captureCustomFunctionRegistration, clearCustomFunctionRegistration } = compiled.exports;
const installed = name => path.join(normal, 'lib-' + name);
const definitions = name => JSON.parse(fs.readFileSync(path.join(libraries, name, 'block.json'), 'utf8'));
const needed = new Set(['arduino_setup', 'arduino_loop', 'arduino_global', 'math_number', 'text',
  'variable_define', 'variables_get', 'variables_set', 'lvgl_screen_create', 'lvgl_label_create',
  'lvgl_label_set_text', 'lvgl_event_add_cb', 'lvgl_obj_get_child', 'lvgl_keyboard_set_textarea',
  'ds1302_setup', 'ds1302_set_halt', 'ds1302_get_time', 'controls_for', 'math_change', 'number_to_string']);
for (const name of ['core-loop', 'core-math', 'core-text']) {
  Blockly.defineBlocksWithJsonArray(JSON.parse(fs.readFileSync(path.join(installed(name), 'block.json'), 'utf8')).filter(b => needed.has(b.type)));
  Blockly.defineBlocksWithJsonArray(definitions(name).filter(b => needed.has(b.type)));
}
for (const name of ['core-variables', 'lvgl', 'ds1302']) Blockly.defineBlocksWithJsonArray(definitions(name).filter(b => needed.has(b.type)));

function runtime(t, sources = {}) {
  const workspace = new Blockly.Workspace();
  workspace.getToolbox = () => null; // Headless UI has no toolbox; native models/fields remain real.
  const generator = new ArduinoGenerator();
  const context = vm.createContext({ Arduino: generator, Blockly: { ...Blockly, getMainWorkspace: () => workspace },
    console: { log() {}, warn() {}, error() {} }, setTimeout() {}, clearTimeout() {} });
  context.window = context;
  // The installed core-loop owns the actual Arduino entrypoint handlers; the
  // maintained source below overrides its directly affected loop consumers.
  new vm.Script(fs.readFileSync(path.join(installed('core-loop'), 'generator.js'), 'utf8')).runInContext(context);
  for (const name of ['core-variables', 'core-loop', 'core-math', 'core-text', 'lvgl', 'ds1302']) {
    const source = sources[name] ?? (process.env.AILY_MODEL_SYMBOLS_BASELINE === '1'
      ? execFileSync('git', ['show', '20793c14123ed162edff19f718edafe5e2cd26de:' + name + '/generator.js'], { cwd: libraries, encoding: 'utf8' })
      : fs.readFileSync(path.join(libraries, name, 'generator.js'), 'utf8'));
    new vm.Script(source, { filename: name + '/generator.js' }).runInContext(context);
  }
  t.after(() => workspace.dispose());
  const model = (name, type, id) => workspace.getVariableMap().createVariable(name, type, id);
  const block = (type, fields = {}) => { const b = workspace.newBlock(type); for (const [key, value] of Object.entries(fields)) b.setFieldValue(value, key); return b; };
  const setup = (...blocks) => {
    const root = block('arduino_setup'); let connection = root.getInput('ARDUINO_SETUP').connection;
    for (const b of blocks) { connection.connect(b.previousConnection); connection = b.nextConnection; }
    return root;
  };
  const generate = () => generator.workspaceToCode(workspace);
  return { workspace, generator, context, model, block, setup, generate };
}

function cxx(t, source) {
  const appData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
  const compiler = process.env.AILY_MODEL_SYMBOL_GXX || path.join(appData, 'aily-project', 'tools', 'arm-none-eabi-gcc@7.2.1', 'bin', process.platform === 'win32' ? 'arm-none-eabi-g++.exe' : 'arm-none-eabi-g++');
  assert.ok(fs.existsSync(compiler), 'Set AILY_MODEL_SYMBOL_GXX to the existing real SDK C++ compiler; these contracts do not substitute or silently skip it');
  const directory = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'aily-model-symbol-cxx-')));
  t.after(() => { assert.equal(path.dirname(directory), fs.realpathSync(os.tmpdir())); assert.match(path.basename(directory), /^aily-model-symbol-cxx-/); fs.rmSync(directory, { recursive: true, force: true }); });
  fs.writeFileSync(path.join(directory, 'Arduino.h'), '#pragma once\n#include <stdint.h>\n#include <unistd.h>\nstruct String { String(const char *); const char *c_str() const; };\n');
  fs.writeFileSync(path.join(directory, 'lvgl.h'), `#pragma once
struct lv_obj_t {}; struct lv_event_t {}; typedef int lv_event_code_t;
enum { LV_EVENT_CLICKED = 1 };
lv_obj_t *lv_obj_create(lv_obj_t *); lv_obj_t *lv_label_create(lv_obj_t *);
void lv_label_set_text(lv_obj_t *, const char *); lv_obj_t *lv_obj_get_child(lv_obj_t *, int);
lv_event_code_t lv_event_get_code(lv_event_t *); lv_obj_t *lv_event_get_target_obj(lv_event_t *);
void lv_obj_add_event_cb(lv_obj_t *, void (*)(lv_event_t *), lv_event_code_t, void *);
`);
  fs.writeFileSync(path.join(directory, 'DS1302.h'), '#pragma once\nstruct DS1302 { DS1302(int,int,int); void halt(bool); };\n');
  const file = path.join(directory, 'generated.cpp'); fs.writeFileSync(file, source);
  const run = spawnSync(compiler, ['-std=c++11', '-fsyntax-only', '-I', directory, file], { encoding: 'utf8', windowsHide: true });
  assert.equal(run.error, undefined);
  return { status: run.status, diagnostic: run.stderr };
}

function sameNamedModels(t, sources) {
  const r = runtime(t, sources);
  const ui = r.model('link', 'lv_obj_t', 'ui-link'), scalar = r.model('link', '', 'core-link'), rtc = r.model('link', 'DS1302', 'rtc-link');
  const declaration = r.block('variable_define', { VAR: 'link', TYPE: 'int' });
  const set = r.block('variables_set', { VAR: scalar.getId() });
  const screen = r.block('lvgl_screen_create', { VAR: 'link', SCOPE: 'global' });
  const clock = r.block('ds1302_setup', { VAR: 'link' });
  const halt = r.block('ds1302_set_halt', { VAR: rtc.getId(), HALT: 'FALSE' });
  const text = r.block('lvgl_label_set_text', { VAR: ui.getId() });
  r.setup(screen, clock, halt, text, set);
  const generated = r.generate();
  const native = cxx(t, generated);
  assert.equal(native.status, 0, native.diagnostic);
  const uiName = r.generator.getModelSymbolReference(ui), coreName = r.generator.getModelSymbolReference(scalar), rtcName = r.generator.getModelSymbolReference(rtc);
  assert.equal(new Set([uiName, coreName, rtcName]).size, 3);
  for (const symbol of [uiName, coreName, rtcName]) assert.match(symbol, /^[A-Za-z_][A-Za-z0-9_]*$/);
  assert.ok(generated.includes('lv_label_set_text(' + uiName + ','));
  assert.ok(generated.includes(rtcName + '.halt(false)'));
  assert.ok(generated.includes(coreName + ' = 0;'));
  assert.equal(declaration.getFieldValue('VAR'), 'link');
  return { r, generated, symbols: [uiName, coreName, rtcName] };
}
test('actual Generator and SDK unistd link declaration accept same-named LVGL, core and DS1302 models', t => sameNamedModels(t));

test('Unicode declarations, parents and callback/core references keep native model identity and repeated generation stable', t => {
  const r = runtime(t), screen = r.model('屏幕', 'lv_obj_t', 'screen-identity'), label = r.model('状态 标签', 'lv_obj_t', 'label-identity');
  const screenBlock = r.block('lvgl_screen_create', { VAR: screen.name });
  const labelBlock = r.block('lvgl_label_create', { VAR: label.name, PARENT: screen.getId() });
  const text = r.block('lvgl_label_set_text', { VAR: label.getId() });
  const event = r.block('lvgl_event_add_cb', { VAR: label.getId(), EVENT: 'LV_EVENT_CLICKED' });
  const callbackText = r.block('lvgl_label_set_text', { VAR: label.getId() });
  event.getInput('HANDLER').connection.connect(callbackText.previousConnection);
  r.setup(screenBlock, labelBlock, text, event);
  const before = Blockly.serialization.workspaces.save(r.workspace), generated = r.generate();
  const screenName = r.generator.getModelSymbolReference(screen), labelName = r.generator.getModelSymbolReference(label);
  assert.match(screenName, /^[A-Za-z_][A-Za-z0-9_]*$/); assert.match(labelName, /^[A-Za-z_][A-Za-z0-9_]*$/);
  assert.ok(generated.includes('lv_label_create(' + screenName + ')'));
  assert.ok(generated.includes('lv_label_set_text(' + labelName + ','));
  assert.ok(generated.includes('lv_obj_t *' + labelName + ' = lv_event_get_target_obj(e);'));
  assert.equal(cxx(t, generated).status, 0);
  assert.equal(r.generate(), generated);
  assert.deepEqual(Blockly.serialization.workspaces.save(r.workspace), before, 'Generation must not rename or replace native IDs/display names');
});

test('core getters of unmigrated typed models preserve legacy raw library references', t => {
  const r = runtime(t), legacy = r.model('legacySensor', 'UnmigratedSensor', 'legacy-model');
  const getter = r.block('variables_get', { VAR: legacy.getId() });
  r.generator.init(r.workspace);
  assert.deepEqual(Array.from(r.generator.forBlock.variables_get(getter, r.generator)), ['legacySensor', r.generator.ORDER_ATOMIC]);
});

test('fresh declaration handlers register their own typed models even with a same-named core declaration', t => {
  const r = runtime(t);
  const core = r.block('variable_define', { VAR: 'fresh', TYPE: 'int' });
  const screen = r.block('lvgl_screen_create', { VAR: 'fresh' });
  const clock = r.block('ds1302_setup', { VAR: 'fresh' });
  r.setup(screen, clock);
  assert.equal(r.workspace.getVariableMap().getVariable('fresh', ''), null);
  r.generate();
  const models = ['', 'lv_obj_t', 'DS1302'].map(type => r.workspace.getVariableMap().getVariable('fresh', type));
  assert.ok(models.every(Boolean), 'Original declaration handlers must create the explicitly requested model types before allocating code names');
  assert.equal(new Set(models.map(model => r.generator.getModelSymbolReference(model))).size, 3);
  assert.equal(core.getFieldValue('VAR'), 'fresh');
});

test('model spellings survive reordered root blocks and do not confuse a name equal to another model ID', t => {
  const { r, symbols } = sameNamedModels(t);
  const state = Blockly.serialization.workspaces.save(r.workspace);
  state.blocks.blocks.reverse();
  const next = runtime(t);
  Blockly.serialization.workspaces.load(state, next.workspace);
  next.generate();
  assert.deepEqual(['ui-link', 'core-link', 'rtc-link'].map(id => next.generator.getModelSymbolReference(id)), symbols);
  const named = next.model('other-model-id', 'lv_obj_t', 'intended-native-id');
  const collision = next.model('different display', 'lv_obj_t', 'other-model-id');
  const declaration = next.block('lvgl_screen_create', { VAR: named.name });
  next.generator.init(next.workspace);
  next.generator.forBlock.lvgl_screen_create(declaration, next.generator);
  const own = next.generator.getModelSymbolReference(named), other = next.generator.getModelSymbolReference(collision);
  assert.notEqual(own, other);
  assert.ok(Object.values(next.generator.codeDict.variables).some(code => code === 'lv_obj_t * ' + own + ';'));
});

test('core procedure parameters keep their local spelling instead of a same-named migrated global', t => {
  const r = runtime(t), global = r.model('link', '', 'global-core-param-name');
  r.block('variable_define', { VAR: 'link', TYPE: 'int' });
  const procedure = r.workspace.newBlock('procedures_defnoreturn');
  procedure.loadExtraState({ params: [{ name: 'link', id: global.getId() }] });
  assert.ok(procedure.getProcedureDef()[1].includes('link'));
  const set = r.block('variables_set', { VAR: global.getId() }), get = r.block('variables_get', { VAR: global.getId() });
  set.getInput('VALUE').connection.connect(get.outputConnection);
  procedure.getInput('STACK').connection.connect(set.previousConnection);
  r.generator.init(r.workspace);
  assert.deepEqual(Array.from(r.generator.forBlock.variables_get(get, r.generator)), ['link', r.generator.ORDER_ATOMIC]);
  assert.equal(r.generator.forBlock.variables_set(set, r.generator), 'link = link;\n');
  const outside = r.block('variables_get', { VAR: global.getId() });
  assert.equal(r.generator.forBlock.variables_get(outside, r.generator)[0], r.generator.getModelSymbolReference(global));
  assert.notEqual(r.generator.getModelSymbolReference(global), 'link');
  const convert = r.block('number_to_string'), localRead = r.block('variables_get', { VAR: global.getId() });
  convert.getInput('NUM').connection.connect(localRead.outputConnection);
  const localSet = r.block('variables_set', { VAR: global.getId() });
  localSet.getInput('VALUE').connection.connect(convert.outputConnection); set.nextConnection.connect(localSet.previousConnection);
  const conversion = r.generator.blockToCode(convert)[0];
  const localLoop = r.block('controls_for', { VAR: global.getId() });
  localSet.nextConnection.connect(localLoop.previousConnection);
  const bodySet = r.block('variables_set', { VAR: global.getId() }), bodyRead = r.block('variables_get', { VAR: global.getId() });
  bodySet.getInput('VALUE').connection.connect(bodyRead.outputConnection); localLoop.getInput('DO').connection.connect(bodySet.previousConnection);
  const loopCode = r.generator.blockToCode(localLoop);
  assert.deepEqual({ conversion, localLoopHeader: loopCode.includes('for (int link = ') },
    { conversion: 'String(link)', localLoopHeader: true }, 'Procedure-local conversion and loop header must retain the same local getter binding');
  assert.ok(loopCode.includes('link = link;'));
});

test('the same narrow migration runs against original installed 1.0.1 LVGL and core generator variants', t => {
  const patch = require('./model-symbols-patch.cjs'), sources = {};
  for (const [name, migrate] of [['lvgl', patch.lvgl], ['core-variables', patch.core]]) {
    const root = installed(name), original = fs.readFileSync(path.join(root, 'generator.js'), 'utf8');
    assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version, '1.0.1');
    sources[name] = migrate(original).source;
    if (process.env.AILY_MODEL_SYMBOL_CANDIDATES) {
      const staged = fs.readFileSync(path.join(process.env.AILY_MODEL_SYMBOL_CANDIDATES, name, 'generator.js'), 'utf8');
      assert.equal(staged.replace(/\r\n/g, '\n'), sources[name].replace(/\r\n/g, '\n'), 'Exact staged git patch must retain the same reviewed semantics and old variant differences');
      sources[name] = staged;
    }
  }
  const old = new Map([...needed].map(type => [type, Blockly.Blocks[type]]));
  for (const name of ['lvgl', 'core-variables']) {
    Blockly.defineBlocksWithJsonArray(JSON.parse(fs.readFileSync(path.join(installed(name), 'block.json'), 'utf8')).filter(block => needed.has(block.type)));
  }
  t.after(() => { for (const [type, definition] of old) if (definition) Blockly.Blocks[type] = definition; });
  sameNamedModels(t, sources);
});

test('loop counters, math changes and numeric text conversions use the same opted-in core model as their body getter', t => {
  const r = runtime(t), model = r.model('counter', '', 'counter-model');
  r.block('variable_define', { VAR: 'counter', TYPE: 'int' });
  const loop = r.block('controls_for', { VAR: model.getId() });
  const change = r.block('math_change', { VAR: model.getId() });
  const set = r.block('variables_set', { VAR: model.getId() }), get = r.block('variables_get', { VAR: model.getId() });
  set.getInput('VALUE').connection.connect(get.outputConnection);
  loop.getInput('DO').connection.connect(set.previousConnection); set.nextConnection.connect(change.previousConnection);
  r.setup(loop);
  const generated = r.generate(), symbol = r.generator.getModelSymbolReference(model);
  assert.ok(generated.includes('for (int ' + symbol + ' = '), 'The loop declaration and getter must use one actual model symbol');
  assert.ok(generated.includes(symbol + ' = ' + symbol + ';'));
  assert.ok(generated.includes(symbol + ' += 1;'));
  const convert = r.block('number_to_string'), read = r.block('variables_get', { VAR: model.getId() });
  convert.getInput('NUM').connection.connect(read.outputConnection);
  r.generator.init(r.workspace);
  assert.ok(r.generator.forBlock.number_to_string(convert, r.generator)[0].includes(symbol));
});

test('same-type legacy LVGL/DS models without an owned declaration keep their original references', t => {
  const r = runtime(t), ui = r.model('legacyUi', 'lv_obj_t', 'legacy-ui'), rtc = r.model('legacyClock', 'DS1302', 'legacy-rtc');
  const text = r.block('lvgl_label_set_text', { VAR: ui.getId() }), halt = r.block('ds1302_set_halt', { VAR: rtc.getId() });
  r.generator.init(r.workspace);
  assert.equal(r.generator.getModelSymbolReference(ui), undefined);
  assert.ok(r.generator.forBlock.lvgl_label_set_text(text, r.generator).includes('lv_label_set_text(legacyUi,'));
  assert.ok(r.generator.forBlock.ds1302_set_halt(halt, r.generator).includes('legacyClock.halt('));
  assert.equal(r.generator.getModelSymbolReference(ui), undefined);
  assert.equal(r.generator.getModelSymbolReference(rtc), undefined);
});

test('disabled owned declarations and disabled ancestors do not claim otherwise legacy model IDs', t => {
  for (const [type, nativeType] of [['variable_define', ''], ['lvgl_screen_create', 'lv_obj_t'], ['ds1302_setup', 'DS1302']]) {
    for (const inherited of [false, true]) {
      const r = runtime(t), model = r.model('disabledGlobal', nativeType, 'disabled-' + type + inherited);
      const declaration = r.block(type, { VAR: model.name, ...(type === 'variable_define' ? { TYPE: 'int' } : {}) });
      const disabled = inherited ? r.setup(declaration) : declaration; disabled.setEnabled(false);
      const getter = r.block('variables_get', { VAR: model.getId() });
      r.generator.init(r.workspace);
      assert.equal(r.generator.getModelSymbolReference(model), undefined);
      assert.equal(r.generator.forBlock.variables_get(getter, r.generator)[0], model.name);
    }
  }
});

test('actual core-functions custom parameter binding remains local when ensureVariableWithId reuses a migrated global ID', t => {
  const r = runtime(t), global = r.model('link', '', 'custom-global-link');
  r.block('variable_define', { VAR: global.name, TYPE: 'int' });
  const source = fs.readFileSync(path.join(libraries, 'core-functions/generator.js'), 'utf8');
  new vm.Script(source, { filename: 'core-functions/generator.js' }).runInContext(r.context);
  Blockly.defineBlocksWithJsonArray(definitions('core-functions').filter(block => block.type === 'custom_function_def'));
  const definition = r.block('custom_function_def', { FUNC_NAME: 'customParamScope', RETURN_TYPE: 'void' });
  definition.loadExtraState({ params: [{ type: 'int', name: 'link' }], paramVarIds: ['requested-distinct-param-id'] });
  assert.equal(typeof definition.getProcedureDef, 'undefined', 'Exercise the actual custom protocol, not the built-in procedure interface');
  assert.equal(r.context.ensureVariableWithId(r.workspace, 'link', '', definition.paramVarIds_[0]).getId(), global.getId(), 'The actual library reuses the existing by-name native model');
  const set = r.block('variables_set', { VAR: global.getId() }), get = r.block('variables_get', { VAR: global.getId() });
  set.getInput('VALUE').connection.connect(get.outputConnection);
  const change = r.block('math_change', { VAR: global.getId() });
  definition.getInput('STACK').connection.connect(set.previousConnection); set.nextConnection.connect(change.previousConnection);
  r.generate();
  const body = r.generator.codeDict.functions.customParamScope;
  assert.ok(body.includes('void customParamScope(int link)'));
  assert.ok(body.includes('link = link;'), 'Custom parameter reads and writes must use the actual local declaration');
  assert.ok(body.includes('link += 1;'), 'A public API math consumer must preserve the same local binding');
});

async function pinnedCustomParameterRuntime(t, { suffix = '', isCurrent = () => true } = {}) {
  const r = runtime(t), global = r.model('link', '', 'legacy-custom-global-link');
  r.block('variable_define', { VAR: global.name, TYPE: 'int' });
  const source = execFileSync('git', ['show', '20793c14123ed162edff19f718edafe5e2cd26de:core-functions/generator.js'], { cwd: libraries, encoding: 'utf8' }) + suffix;
  assert.ok(!source.includes('registerModelSymbolLocalScope'), 'Exercise the original pinned source without the new library scope provider');
  new vm.Script(source, { filename: 'original-core-functions/generator.js' }).runInContext(r.context);
  const owner = {};
  t.after(() => clearCustomFunctionRegistration(Blockly.Blocks, owner));
  await registerCustomFunctionContract(source, r.context, Blockly.Blocks, owner, isCurrent);
  Blockly.defineBlocksWithJsonArray(definitions('core-functions').filter(block => block.type === 'custom_function_def'));
  const definition = r.block('custom_function_def', { FUNC_NAME: 'pinnedParamScope', RETURN_TYPE: 'void' });
  definition.loadExtraState({ params: [{ type: 'int', name: 'link' }], paramVarIds: ['legacy-requested-param-id'] });
  assert.equal(r.context.ensureVariableWithId(r.workspace, 'link', '', definition.paramVarIds_[0]).getId(), global.getId());
  const set = r.block('variables_set', { VAR: global.getId() }), get = r.block('variables_get', { VAR: global.getId() });
  set.getInput('VALUE').connection.connect(get.outputConnection);
  const change = r.block('math_change', { VAR: global.getId() });
  definition.getInput('STACK').connection.connect(set.previousConnection); set.nextConnection.connect(change.previousConnection);
  return { r, global, owner };
}

test('pinned original core-functions retains local parameter binding beside newly migrated core globals', async t => {
  const { r, global } = await pinnedCustomParameterRuntime(t);
  assert.equal(captureCustomFunctionRegistration(Blockly.Blocks)?.get('custom_function_def')?.kind, 'definition', 'The genuine original source must pass the existing production provenance contract');
  r.generate();
  const body = r.generator.codeDict.functions.pinnedParamScope;
  assert.ok(body.includes('void pinnedParamScope(int link)'));
  assert.ok(body.includes('link = link;'), 'Pinned custom parameter reads and writes must retain their actual local declaration');
  assert.ok(body.includes('link += 1;'), 'Pinned custom parameters must also keep public API math consumers local');
  const outside = r.block('variables_get', { VAR: global.getId() });
  r.generator.init(r.workspace);
  const globalSymbol = r.generator.getModelSymbolReference(global);
  assert.notEqual(globalSymbol, 'link');
  assert.equal(r.generator.blockToCode(outside)[0], globalSymbol, 'The same native ID outside the function must retain its migrated global declaration');
});

for (const refusal of ['unknown-source', 'inactive-session', 'cleared-owner']) {
  test('legacy custom scope bridge refuses ' + refusal + ' while retaining migrated global names', async t => {
    let active = true;
    const { r, global, owner } = await pinnedCustomParameterRuntime(t, {
      suffix: refusal === 'unknown-source' ? '\n// Unreviewed source variant.\n' : '',
      isCurrent: () => active,
    });
    if (refusal !== 'unknown-source') {
      assert.equal(captureCustomFunctionRegistration(Blockly.Blocks)?.get('custom_function_def')?.kind, 'definition');
    }
    if (refusal === 'inactive-session') active = false;
    if (refusal === 'cleared-owner') clearCustomFunctionRegistration(Blockly.Blocks, owner);
    assert.equal(captureCustomFunctionRegistration(Blockly.Blocks)?.get('custom_function_def'), undefined);
    r.generate();
    const body = r.generator.codeDict.functions.pinnedParamScope;
    const symbol = r.generator.getModelSymbolReference(global);
    assert.notEqual(symbol, 'link');
    assert.ok(body.includes(symbol + ' = ' + symbol + ';'), 'No unproven or inactive compatibility callback may suppress the real global model symbol');
    assert.ok(body.includes(symbol + ' += 1;'));
  });
}

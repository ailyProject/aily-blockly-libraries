// Integration tests against the actual host and downloadable libraries.
// Requires a sibling aily-blockly checkout (or AILY_BLOCKLY_ROOT) and Chrome.
// No user project, installed package, or running application is modified.
import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const libraries = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const host = path.resolve(process.env.AILY_BLOCKLY_ROOT || path.join(libraries, '../aily-blockly'));
const require = createRequire(path.join(host, 'package.json'));
const { buildSync } = require('esbuild');
const { chromium } = require('@playwright/test');
const names = ['core-variables', 'core-loop', 'core-math', 'core-text', 'core-logic', 'core-serial', 'core-time', 'adafruit_DHT', 'async-esp-fs-webserver'];
const fixtures = names.map(name => ({ name,
  source: fs.readFileSync(path.join(libraries, name, 'generator.js'), 'utf8'),
  blocks: JSON.parse(fs.readFileSync(path.join(libraries, name, 'block.json'), 'utf8')),
}));
let server, browser, page;
before(async () => {
  execFileSync(process.execPath, [path.join(host, 'scripts/blockly-native-bundle.cjs')], { cwd: host, stdio: 'pipe' });
  const harness = buildSync({ stdin: { loader: 'ts', resolveDir: host, contents: `
    import '@angular/compiler';
    export * as Blockly from 'blockly';
    export { BlocklyGeneratorRuntimeService } from './src/app/editors/blockly-editor/services/blockly-generator-runtime.service';
    export { BlocklyDeclarativeBlockCatalog } from './src/app/editors/blockly-editor/services/blockly-declarative-block-catalog';
    export { withNativeStateLoading } from './src/app/editors/blockly-editor/services/blockly-native-state-loading';
    export { evaluateNativeCandidate } from './src/app/editors/blockly-editor/services/blockly-native-candidate';
    export { normalizeAbsSerializedWorkspace } from './src/app/integrations/blockly/abs/abs-serialized-workspace';
    export { loadAbsWorkspaceState, captureAbsWorkspaceState } from './src/app/integrations/blockly/abs/abs-workspace-state';
    export { createAbsProjection } from './src/app/integrations/blockly/abs/abs-identity-map';
    export { reconcileAbsDraft, createAbsReconciler } from './src/app/integrations/blockly/abs/abs-reconciler';
    export { prepareAbsNativeReconciliation } from './src/app/integrations/blockly/abs/abs-native-reconciliation';
    export { assertAbsReadback } from './src/app/integrations/blockly/abs/abs-readback';
    export { projectDataRuntime } from '@domain/project/public-api';
    export async function prepareMutators() {
      await import('./src/app/editors/blockly-editor/components/blockly/plugins/block-plus-minus/src/index.js');
    }
  ` }, absWorkingDir: host, tsconfig: path.join(host, 'tsconfig.json'), bundle: true,
    format: 'iife', globalName: 'host', platform: 'browser', write: false, logLevel: 'silent' }).outputFiles[0].text;
  const native = fs.readFileSync(path.join(host, '.generated/blockly-runtime/native-candidate.js'));
  server = http.createServer((request, response) => {
    const script = request.url === '/harness.js' ? harness
      : request.url === '/blockly/runtime/native-candidate.js' ? native : null;
    response.setHeader('Content-Type', script ? 'application/javascript' : 'text/html');
    response.end(script ?? '<!doctype html><script src="/harness.js"></script><div id="workspace" style="width:800px;height:600px"></div>');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.evaluate(async fixtures => {
    const { Blockly, BlocklyGeneratorRuntimeService, BlocklyDeclarativeBlockCatalog } = window.host;
    await window.host.prepareMutators();
    window.Blockly = Blockly;
    const boardConfig = { core: 'esp32', digitalPins: [['GPIO0', '0'], ['GPIO2', '2'], ['GPIO4', '4'], ['GPIO5', '5']],
      i2c: [['Wire', 'Wire'], ['Wire1', 'Wire1']], serialPort: [['Serial', 'Serial']], serialSpeed: [['9600', '9600']] };
    const steps = [{ kind: 'context', mode: 'arduino', boardConfig },
      { kind: 'script', label: 'entry-points', source: 'window.ENTRY_BLOCK_TYPES = ["arduino_setup", "arduino_loop", "arduino_global"];' }];
    for (const fixture of fixtures) {
      steps.push({ kind: 'script', label: fixture.name, source: fixture.source });
      steps.push({ kind: 'definitions', definitions: JSON.parse(JSON.stringify(fixture.blocks)
        .replace(/"\$\{board\.(\w+)\}"/g, (_, key) => JSON.stringify(boardConfig[key] ?? [['default', 'default']]))) });
    }
    const workspace = Blockly.inject('workspace', { toolbox: null });
    const runtime = new BlocklyGeneratorRuntimeService(), catalog = new BlocklyDeclarativeBlockCatalog();
    const generator = runtime.activate({ mode: 'arduino', boardConfig, getWorkspace: () => workspace,
      onBlockDefinition: (json, definition) => catalog.record(json, definition) });
    steps.forEach((step, index) => {
      if (step.kind === 'script') runtime.loadGenerator(step.label + '.js', step.source);
      else if (step.kind === 'definitions') runtime.loadGenerator(`defs-${index}.js`, 'Blockly.defineBlocksWithJsonArray(' + JSON.stringify(step.definitions) + ');');
    });
    window.fixture = { workspace, runtime, generator, catalog, steps };
    window.loadAbs = async (abs, variables = []) => {
      const h = window.host;
      if (!/^# ABS Schema: 2/m.test(abs)) abs = '# ABS Schema: 2\n' + abs;
      const bound = await h.evaluateNativeCandidate({ blocks: [], steps, abs, variables, modelRequestId: 'library-regression' }, { assertCurrent() {} });
      const contracts = { fields: Object.fromEntries(bound.binding.instances.map(item => [item.id, item.shape.fields])),
        syntax: Object.fromEntries(bound.binding.instances.map(item => [item.id, item.shape.argumentOrder])) };
      const modelDeclarations = (bound.binding.modelDeclarations ?? []).map(item => ({ ...item,
        ownerId: bound.binding.instances.find(block => block.start === item.start).id }));
      await h.evaluateNativeCandidate({ blocks: [], steps,
        verify: { state: h.normalizeAbsSerializedWorkspace(bound.state), contracts, modelDeclarations } }, { assertCurrent() {} });
      h.withNativeStateLoading(Blockly, workspace, bound.state, () => Blockly.serialization.workspaces.load(bound.state, workspace));
      return generator.workspaceToCode(workspace);
    };
  }, fixtures);
});
after(async () => {
  await browser?.close();
  if (server) await new Promise(resolve => server.close(resolve));
});

for (const reverse of [false, true]) test('custom UART options survive ABS, native verification and host load; reverse=' + reverse, async () => {
  const result = await page.evaluate(async reverse => {
    const lines = ['serial_begin_esp32_custom("MyUart", UART1, 9600, 4, 5)', 'serial_println(MyUart, text("UART ready"))'];
    if (reverse) lines.reverse();
    const code = await window.loadAbs('arduino_setup()\n    ' + lines.join('\n    '));
    const { Blockly, withNativeStateLoading, assertAbsReadback } = window.host;
    const { workspace, generator } = window.fixture;
    const saved = Blockly.serialization.workspaces.save(workspace);
    withNativeStateLoading(Blockly, workspace, saved, () => Blockly.serialization.workspaces.load(saved, workspace));
    assertAbsReadback(saved, Blockly.serialization.workspaces.save(workspace));
    return { code, reopened: generator.workspaceToCode(workspace) };
  }, reverse);
  assert.match(result.code, /HardwareSerial MyUart\(1\);/);
  assert.match(result.code, /MyUart.begin\(9600, SERIAL_8N1, 4, 5\);/);
  assert.match(result.code, /MyUart.println\("UART ready"\);/);
  assert.equal(result.code, result.reopened);
});

test('UART choices prefer declared MCU across SDKs and retain legacy package compatibility', async () => {
  const cases = [
    { type: 'esp32:esp32:wifiduino32', mcu: 'esp32', count: 3 },
    { type: 'esp32:esp32:wifiduino32s3', mcu: 'esp32s3', count: 3 },
    { type: 'esp32:esp32:wifiduino32c3', mcu: 'esp32c3', count: 2 },
    { type: 'custom:sdk:opaque_alias', mcu: 'esp32s3', count: 3 },
    { type: 'esp32:esp32:esp32c3', mcu: ' ESP32S3 ', uploadParam: 'esptool --chip esp32c3', count: 3 },
    { type: 'esp32:esp32:esp32s3', mcu: 'other-chip', count: 2 },
    { type: 'esp32:esp32:esp32c3', count: 2 },
    { type: 'esp32:esp32:XIAO_ESP32C3', count: 2 },
    { type: 'esp32:esp32:esp32s3', count: 3 },
    { type: 'esp32:esp32:unknown_board', count: 2 },
    { type: 'esp32:esp32:esp32s3', uploadParam: 'esptool --chip esp32c3', count: 2 },
  ];
  for (const config of cases) {
    const result = await page.evaluate(async config => {
      const { steps } = window.fixture;
      const configured = steps.map(step => step.kind === 'context' ? { ...step, boardConfig: { ...step.boardConfig, ...config } } : step);
      const bound = await window.host.evaluateNativeCandidate({ steps: configured, blocks: [],
        abs: '# ABS Schema: 2\nserial_begin_esp32_custom("Uart", UART1, 9600, 4, 5)' }, { assertCurrent() {} });
      return bound.binding.instances[0].shape.fields.UART.options.map(option => option[1]);
    }, config);
    assert.deepEqual(result, Array.from({length: config.count}, (_, i) => 'UART' + i));
  }
});

for (const pin of ['0', '4']) test(`DHT same-shape edits keep field identity and GPIO${pin}`, async () => {
  const result = await page.evaluate(pin => {
    const { workspace } = window.fixture;
    workspace.clear();
    const block = workspace.newBlock('dht_init'); block.initSvg(); block.render();
    block.setFieldValue(pin, 'PIN'); const field = block.getField('PIN');
    for (const type of ['DHT22', 'DHT21', 'DHT11', 'DHT11']) block.setFieldValue(type, 'TYPE');
    return { pin: block.getFieldValue('PIN'), sameField: block.getField('PIN') === field };
  }, pin);
  assert.deepEqual(result, { pin, sameField: true });
});
test('DHT native reordered fields and DHT20 field identity', async () => {
  const result = await page.evaluate(() => {
    const { workspace } = window.fixture, { Blockly } = window.host;
    Blockly.serialization.workspaces.load({ blocks: { blocks: [{ type: 'dht_init', id: 'dht', fields: { PIN: '4', TYPE: 'DHT22', VAR: 'sensor' } }] } }, workspace);
    const block = workspace.getBlockById('dht'), pin = block.getFieldValue('PIN');
    block.setFieldValue('DHT20', 'TYPE'); block.setFieldValue('Wire1', 'WIRE');
    const field = block.getField('WIRE'); block.setFieldValue('DHT20', 'TYPE');
    return { pin, wire: block.getFieldValue('WIRE'), sameField: field === block.getField('WIRE'), obsoletePin: !!block.getField('PIN') };
  });
  assert.deepEqual(result, { pin: '4', wire: 'Wire1', sameField: true, obsoletePin: false });
});
for (const chunk of [false, true]) test(`DHT ABS-map-ABI round trip with readback, chunk=${chunk}`, async () => {
  const pin = await page.evaluate(async chunk => {
    await window.loadAbs('arduino_setup()\n    dht_init("sensor", DHT22, 4)');
    const h = window.host, { workspace, catalog } = window.fixture;
    const capture = () => h.captureAbsWorkspaceState(workspace, () => {}, catalog.capture(h.Blockly.Blocks));
    const original = capture();
    const baseline = await h.createAbsProjection(original.state, { document: original.state, contracts: original.contracts,
      generation: 'regression', baselineRef: 'base', savedAbiHash: null, scope: { projectKey: 'fixture', pageId: 'main' } });
    const candidate = await h.reconcileAbsDraft(baseline, baseline.abs + '\n# unchanged pin\n');
    for (let round = 0; round < 3; round++) {
      await h.loadAbsWorkspaceState(candidate.workspace, workspace, { chunk }, () => {}, candidate.contracts);
      const actual = capture(); h.assertAbsReadback(candidate.workspace, actual.state, actual);
    }
    return workspace.getBlocksByType('dht_init')[0].getFieldValue('PIN');
  }, chunk);
  assert.equal(pin, '4');
});

const create = 'async_fs_webserver_create("server", SPIFFS, 8080, text("lab"))';
const route = 'async_fs_webserver_route($server, text("/"), HTTP_GET)\n        async_fs_webserver_response_ok()';
for (const referenceFirst of [false, true]) test(`WebServer explicit configuration wins, referenceFirst=${referenceFirst}`, async () => {
  const statements = referenceFirst ? [route, create] : [create, route];
  const abs = 'arduino_setup()\n    ' + statements.join('\n    ') + '\n    async_fs_webserver_start_server($server)';
  const outputs = await page.evaluate(async abs => {
    const first = await window.loadAbs(abs);
    const { workspace, generator } = window.fixture;
    return [first, generator.workspaceToCode(workspace), generator.workspaceToCode(workspace)];
  }, abs);
  for (const code of outputs) {
    assert.equal((code.match(/AsyncFsWebServer server\(SPIFFS, 8080, "lab"\);/g) || []).length, 1);
    assert.match(code, /server\.on\(/);
  }
  assert.equal(outputs[0], outputs[1]); assert.equal(outputs[1], outputs[2]);
});
test('WebServer parameter edits, rename and deletion do not inherit stale declarations', async () => {
  const outputs = await page.evaluate(async abs => {
    await window.loadAbs(abs);
    const { workspace, generator } = window.fixture;
    const block = workspace.getBlocksByType('async_fs_webserver_create')[0];
    block.setFieldValue('9090', 'PORT'); block.setFieldValue('FFat', 'FS');
    const edited = generator.workspaceToCode(workspace);
    workspace.getBlocksByType('async_fs_webserver_start_server').forEach(block => block.dispose(false));
    block.setFieldValue('other', 'VAR');
    const renamed = generator.workspaceToCode(workspace);
    block.dispose(false); const deleted = generator.workspaceToCode(workspace);
    return { edited, renamed, deleted };
  }, 'arduino_setup()\n    ' + create + '\n    async_fs_webserver_start_server($server)');
  assert.match(outputs.edited, /AsyncFsWebServer server\(FFat, 9090, "lab"\);/);
  assert.match(outputs.renamed, /AsyncFsWebServer other\(FFat, 9090, "lab"\);/);
  assert.doesNotMatch(outputs.renamed, /AsyncFsWebServer server\(/);
  assert.doesNotMatch(outputs.deleted, /AsyncFsWebServer \w+\(/);
});
test('WebServer multiple callback names are unique and stable across rounds', async () => {
  const outputs = await page.evaluate(async abs => {
    const first = await window.loadAbs(abs);
    return [first, window.fixture.generator.workspaceToCode(window.fixture.workspace)];
  }, 'arduino_setup()\n    ' + create + '\n    ' + route + '\n    ' + route.replace('text("/")', 'text("/other")'));
  const callbacks = [...outputs[0].matchAll(/server\.on\([^\n]*, (\w+)\);/g)].map(match => match[1]);
  assert.equal(callbacks.length, 2); assert.equal(new Set(callbacks).size, 2);
  assert.equal(outputs[0], outputs[1]);
});

for (const [from, to, by, expected] of [
  [0, 10, 1, /i < 10; i\+\+/], [10, 0, 2, /i > 0; i -= 2/], [0, 10, -2, /i < 10; i \+= 2/],
]) test(`for actual ABS generation (${from}, ${to}, ${by})`, async () => {
  const code = await page.evaluate(async ([from, to, by]) => window.loadAbs(`arduino_loop()\n    controls_for($i, ${from}, ${to}, ${by})`, [{ name: 'i', id: 'i', type: '' }]), [from, to, by]);
  assert.match(code, expected); assert.doesNotMatch(code, /NaN/);
});
for (const by of [0, 0.5]) test(`for rejects invalid literal step ${by} with an actionable diagnostic`, async () => {
  await assert.rejects(page.evaluate(async by => window.loadAbs(`arduino_loop()\n    controls_for($i, 0, 10, ${by})`, [{ name: 'i', id: 'i', type: '' }]), by), /BY|non-zero|integer/);
});
test('for runtime input remains C++ code; actual generated loop passes constexpr behavior checks', async t => {
  const code = await page.evaluate(() => {
    const { generator, workspace } = window.fixture;
    generator.init(workspace);
    const values = { FROM: 'readStart()', TO: 'readEnd()', BY: 'readStep()' };
    const oldValue = generator.valueToCode, oldStatement = generator.statementToCode;
    generator.valueToCode = (_block, name) => values[name];
    generator.statementToCode = () => '  result = result * 10 + i;\n';
    try { return generator.forBlock.controls_for({ getFieldValue: () => 'i', workspace }, generator); }
    finally { generator.valueToCode = oldValue; generator.statementToCode = oldStatement; }
  });
  assert.doesNotMatch(code, /NaN/);
  for (const name of ['readStart', 'readEnd', 'readStep']) assert.equal(code.split(name + '()').length - 1, 1);
  // Cross compilers can prove constant-evaluated behavior without running a
  // target executable or pretending that a JS reimplementation is the C++.
  const source = `constexpr int check(int start, int end, int step) {
    int reads = 0;
    auto readStart = [&]() constexpr { ++reads; return start; };
    auto readEnd = [&]() constexpr { ++reads; return end; };
    auto readStep = [&]() constexpr { ++reads; return step; };
    int result = 0;
    ${code}
    return reads == 3 ? result : -1;
  }
  static_assert(check(0, 6, 2) == 24, "ascending/exclusive endpoint");
  static_assert(check(6, 0, 2) == 642, "descending positive magnitude");
  static_assert(check(0, 6, -2) == 24, "negative magnitude");
  static_assert(check(6, 0, -2) == 642, "descending negative magnitude");
  static_assert(check(0, 6, 0) == 0, "zero step must not hang");
  static_assert(check(4, 4, 1) == 0, "equal bounds");`;
  await t.test('six C++ constexpr behavior assertions', {
    skip: !process.env.AILY_TEST_CXX && 'Set AILY_TEST_CXX to a board or host C++ compiler.',
  }, () => {
    execFileSync(process.env.AILY_TEST_CXX, ['-std=c++17', '-fsyntax-only', '-x', 'c++', '-'], { input: source, stdio: ['pipe', 'pipe', 'pipe'] });
  });
});
test('corrected README examples bind and generate in the actual ABS runtime', async t => {
  const { fencedCodeBlocks } = createRequire(import.meta.url)('./check-readme-compliance.js');
  let count = 0;
  for (const name of ['core-loop', 'core-logic', 'adafruit_DHT', 'async-esp-fs-webserver']) {
    const examples = fencedCodeBlocks(fs.readFileSync(path.join(libraries, name, 'readme_ai.md'), 'utf8'));
    for (const abs of examples) {
      let code;
      try { code = await page.evaluate(abs => window.loadAbs(abs), abs); }
      catch (error) { throw new Error(`${name} README example:\n${abs}\n${error.message}`, { cause: error }); }
      assert.doesNotMatch(code, /\bNaN\b/, `${name}: ${abs}`);
      count++;
    }
  }
  t.diagnostic(`${count} complete README examples passed native binding, isolated generation and live generation.`);
});

test('fresh variables can depend on earlier variables and ternary expressions', async () => {
  const code = await page.evaluate(() => window.loadAbs(`arduino_setup()
    variable_define("score", int, 85)
    variable_define("copy", int, variables_get($score))
    variable_define("grade", String, logic_ternary(logic_compare($copy, GTE, 90), "A", "B"))
    serial_println(Serial, $grade)`));
  assert.match(code, /int copy = score;/);
  assert.match(code, /String grade = \(copy >= 90 \? "A" : "B"\);/);
  assert.match(code, /Serial.println\(grade\)/);
});

test('fresh nested and reused loop counters need no separate variable declarations', async () => {
  const code = await page.evaluate(() => window.loadAbs(`arduino_loop()
    controls_for($i, 0, 3, 1)
        controls_for($j, 0, 2, 1)
            serial_println(Serial, math_arithmetic($i, MULTIPLY, $j))
    controls_for($i, 0, 2, 1)
        serial_println(Serial, $i)`));
  assert.equal((code.match(/for \(int i = 0;/g) || []).length, 2);
  assert.match(code, /for \(int j = 0;/);
  assert.match(code, /Serial.println\(\(i \* j\)\)/);
});

test('structured if/switch export and native reload preserve IDs, protection and generated behavior', async () => {
  const result = await page.evaluate(async () => {
    const code = await window.loadAbs(`arduino_loop()
    controls_if()
        @IF0: false
        @DO0:
            time_delay(1)
        @IF1: true
        @DO1:
            controls_switch()
                @SWITCH: 2
                @CASE0: 1
                @DO0:
                    time_delay(2)
                @CASE1: 2
                @DO1:
                    time_delay(3)
                @DEFAULT:
                    time_delay(4)
        @ELSE:
            time_delay(5)`);
    const h = window.host, { workspace, catalog, generator } = window.fixture;
    workspace.getBlocksByType('arduino_loop')[0].setDeletable(false);
    const original = h.captureAbsWorkspaceState(workspace, () => {}, catalog.capture(h.Blockly.Blocks));
    const p = await h.createAbsProjection(original.state, { document: original.state, contracts: original.contracts,
      generation: 'legacy-branches', baselineRef: 'base', savedAbiHash: null, scope: { projectKey: 'fixture', pageId: 'main' } });
    const candidate = await h.reconcileAbsDraft(p, p.abs + '\n# round trip');
    await h.loadAbsWorkspaceState(candidate.workspace, workspace, {}, () => {}, candidate.contracts);
    const actual = h.captureAbsWorkspaceState(workspace, () => {}, catalog.capture(h.Blockly.Blocks));
    h.assertAbsReadback(original.state, actual.state, actual);
    return { abs: p.abs, before: code, after: generator.workspaceToCode(workspace), added: candidate.added, removed: candidate.removed };
  });
  assert.match(result.abs, /controls_if\(\)/);
  assert.match(result.abs, /@IF0: logic_boolean/);
  assert.ok(result.abs.indexOf('@CASE1:') < result.abs.indexOf('@DEFAULT:'));
  assert.equal(result.before, result.after);
  assert.deepEqual(result.added, []); assert.deepEqual(result.removed, []);
});

test('unambiguous historical shorthand binds against actual native definitions', async () => {
  const code = await page.evaluate(() => window.loadAbs(`arduino_setup
  variable_define_advanced(, volatile, "counter", unsigned long, math_number(7,))
  controls_ifelse()
    @if0: true
    @do0:
      serial_println(Serial, time_millis)
    @else:
      serial_println(Serial, $counter)`));
  assert.match(code, /volatile unsigned long counter = 7;/);
  assert.match(code, /Serial.println\(millis\(\)\)/);
  assert.match(code, /Serial.println\(counter\)/);
});

test('new declarations and dependent UART fields survive discovery, identity replay, merge and verification', async () => {
  const result = await page.evaluate(async () => {
    const h = window.host, { workspace, catalog, generator, steps } = window.fixture;
    // This transaction contains no external payload. Configure the real data
    // runtime with a filesystem boundary that fails on any unexpected I/O.
    const oldFs = window.fs, oldPath = window.path;
    window.fs = new Proxy({}, { get: () => () => { throw new Error('Unexpected project-data I/O'); } });
    window.path = { resolve: value => value, join: (...parts) => parts.join('/') };
    h.projectDataRuntime.configure('/isolated-abs-fixture');
    try {
    workspace.clear();
    const capture = () => h.captureAbsWorkspaceState(workspace, () => {}, catalog.capture(h.Blockly.Blocks));
    const snapshot = capture();
    const baseline = await h.createAbsProjection(snapshot.state, { document: snapshot.state, contracts: snapshot.contracts,
      generation: 'empty-declarations', baselineRef: 'base', savedAbiHash: null, scope: { projectKey: 'fixture', pageId: 'main' } });
    const source = `# ABS Schema: 2
arduino_setup()
    serial_println(TransactionUart, text("ready"))
    serial_begin_esp32_custom("TransactionUart", UART1, 9600, 4, 5)
    variable_define("a", int, 7)
    variable_define("b", int, $a)
    controls_for($i, 0, $b, 1)
        serial_println(Serial, $i)`;
    const prepared = await h.prepareAbsNativeReconciliation(h.createAbsReconciler(baseline, source), {},
      request => h.evaluateNativeCandidate({ ...request, steps }, { assertCurrent() {} }), () => {});
    h.withNativeStateLoading(h.Blockly, workspace, prepared.materialized,
      () => h.Blockly.serialization.workspaces.load(prepared.materialized, workspace));
    h.assertAbsReadback(prepared.materialized, capture().state, capture());
    return { code: generator.workspaceToCode(workspace), models: prepared.preparedModels.map(model => model.name).sort() };
    } finally {
      h.projectDataRuntime.reset(); window.fs = oldFs; window.path = oldPath;
    }
  });
  assert.deepEqual(result.models, ['a', 'b', 'i']);
  assert.match(result.code, /int b = a;/);
  assert.match(result.code, /for \(int i = i_start;/);
  assert.match(result.code, /HardwareSerial TransactionUart\(1\);/);
  assert.match(result.code, /TransactionUart.println\("ready"\);/);
});

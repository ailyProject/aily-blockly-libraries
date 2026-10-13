const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const {
  generateAiReadme,
  compareAiAbsContracts,
  validateAiAbsContracts,
  validateAiContract,
  validateAbsCall,
  validateAbsExampleShape,
  paramsDescriptionForBlock,
  absFormat,
  allDocumentedBlocks,
} = require('./check-readme-compliance');
const { generateCandidate } = require('./generate-readme-candidate');
const { callWithNamedValueInputs } = require('./check-readme-cross-library-examples');
const {
  buildGeneratedCodePreviews,
  loadGenerator,
  parseCliArgs: parseGeneratorCoverageArgs,
  probeGeneratorHandler,
  strictFailureCount,
} = require('./check-library-generator-coverage');
const { loadLibraryContract } = require('./readme-library-contracts');
const {
  contractPathForLibrary,
  contractRepositoryPathForLibrary,
  libraryFromContractRepositoryPath,
  validateLibraryContractInventory,
} = require('./readme-library-contracts');
const {
  readFixture: readRuntimeFixture,
  verifyFixtureExpectations,
} = require('./check-readme-runtime-contract');
const LibraryValidator = require('./validate-library-compliance');

const dhtRead = {
  type: 'dht_read_temperature',
  output: 'Number',
  args0: [{
    type: 'field_variable',
    name: 'VAR',
    variable: 'dht',
    variableTypes: ['DHT'],
    defaultType: 'DHT',
  }],
};

const printValue = {
  type: 'serial_println',
  previousStatement: null,
  nextStatement: null,
  args0: [{ type: 'input_value', name: 'VALUE' }],
};

const dhtInit = {
  type: 'dht_init',
  previousStatement: null,
  nextStatement: null,
  args0: [
    { type: 'field_input', name: 'VAR', text: 'dht' },
    { type: 'field_dropdown', name: 'TYPE', options: [['DHT11', 'DHT11'], ['DHT20', 'DHT20']] },
  ],
};

const dhtRuntimeContract = {
  schemaVersion: 1,
  blocks: {
    dht_init: {
      variants: [
        {
          id: 'single-wire-pin',
          when: { TYPE: ['DHT11', 'DHT21', 'DHT22'] },
          appendArgs: [{ name: 'PIN', type: 'field_dropdown', example: '2', required: true }],
        },
        {
          id: 'dht20-i2c',
          when: { TYPE: ['DHT20'] },
          appendArgs: [{ name: 'WIRE', type: 'field_dropdown', example: 'Wire', required: true }],
        },
      ],
    },
  },
};

test('library README contracts live outside downloadable library folders', () => {
  assert.equal(
    contractRepositoryPathForLibrary('adafruit_DHT'),
    '.scripts/contracts/readme-library-contracts/adafruit_DHT.json',
  );
  assert.equal(
    libraryFromContractRepositoryPath('.scripts/contracts/readme-library-contracts/adafruit_DHT.json'),
    'adafruit_DHT',
  );
  assert.equal(path.basename(contractPathForLibrary('adafruit_DHT')), 'adafruit_DHT.json');
  assert.deepEqual(loadLibraryContract('adafruit_DHT'), dhtRuntimeContract);
  assert.equal(fs.existsSync(path.resolve(__dirname, '..', 'adafruit_DHT', 'readme_ai.contract.json')), false);
  const root = path.resolve(__dirname, '..');
  const libraryNames = fs.readdirSync(root, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && fs.existsSync(path.join(root, entry.name, 'block.json')))
    .map(entry => entry.name);
  assert.deepEqual(validateLibraryContractInventory(libraryNames), []);
});

test('variadic contracts require stable named inputs and accept additional indexed slots', () => {
  const block = {
    type: 'list_values',
    output: 'Array',
    args0: [{ type: 'input_value', name: 'INPUT0' }],
    mutator: 'dynamic_inputs_mutator',
  };
  const contract = {
    schemaVersion: 1,
    blocks: {
      list_values: {
        variadic: {
          prefix: 'INPUT',
          startIndex: 1,
          type: 'input_value',
          sampleCount: 1,
          example: 'math_number(2)',
          reason: 'The mutator appends INPUT1, INPUT2, and later value inputs.',
        },
      },
    },
  };

  assert.equal(
    absFormat(block, false, contract.blocks.list_values),
    'list_values(math_number(0), INPUT1=math_number(2))',
  );
  assert.deepEqual(validateAbsCall(
    block,
    'list_values(math_number(1), INPUT1=math_number(2), INPUT2=math_number(3))',
    'variadic example',
    true,
    contract.blocks.list_values,
  ), []);
  assert.ok(validateAbsCall(
    block,
    'list_values(math_number(1), math_number(2))',
    'variadic example',
    true,
    contract.blocks.list_values,
  ).some(message => message.includes('must use named argument syntax')));
});

test('runtime-defined blocks participate in README generation and strict ABI validation', () => {
  const contract = {
    schemaVersion: 1,
    blocks: {},
    runtimeBlocks: {
      invoke_runtime: {
        reason: 'The library constructs this registry-backed call block in generator.js.',
        definition: {
          type: 'invoke_runtime',
          args0: [{
            type: 'field_variable',
            name: 'FUNC_NAME',
            variable: 'myFunction',
            variableTypes: ['FUNC'],
            defaultType: 'FUNC',
            named: true,
          }],
          output: null,
        },
        variadic: {
          prefix: 'INPUT',
          startIndex: 0,
          type: 'input_value',
          sampleCount: 2,
          example: 'math_number(1)',
          reason: 'The selected function signature creates indexed value inputs.',
        },
      },
    },
  };
  const readme = generateAiReadme(
    { name: 'runtime-blocks', version: '1.0.0' },
    [],
    '',
    'runtime-blocks',
    false,
    contract,
  );

  assert.equal(allDocumentedBlocks([], contract).length, 1);
  assert.match(readme, /\| `invoke_runtime` \| Value \| FUNC_NAME\(field_variable\); variadic: INPUT\{0\.\.\.\}\(input_value\)/);
  assert.match(readme, /invoke_runtime\(FUNC_NAME=\$myFunction, INPUT0=math_number\(1\), INPUT1=math_number\(1\)\)/);
  assert.deepEqual(validateAiAbsContracts(readme, [], contract), []);

  const missingRow = readme.split('\n').filter(line => !line.includes('| `invoke_runtime` |')).join('\n');
  assert.ok(validateAiAbsContracts(missingRow, [], contract)
    .some(message => message.includes('missing exact row for invoke_runtime')));
});

test('runtime-defined block contracts reject collisions and incomplete definitions', () => {
  const staticBlock = { type: 'collision', args0: [] };
  const contract = {
    schemaVersion: 1,
    blocks: {},
    runtimeBlocks: {
      collision: {
        reason: '',
        definition: { type: 'different_type', output: null },
        variadic: {
          prefix: 'INPUT', startIndex: 0, type: 'input_value', sampleCount: 1,
          example: 'math_number(0)', reason: 'Indexed values.',
        },
      },
      missing_definition: {
        reason: 'Programmatic block.',
      },
    },
  };
  const messages = validateAiContract(contract, [staticBlock]);
  assert.ok(messages.some(message => message.includes('duplicates a block.json definition')));
  assert.ok(messages.some(message => message.includes('missing_definition definition must be a block JSON object')));
});

test('README generation and its canonical formatter use a bare variable reference for field_variable', () => {
  const readme = generateAiReadme(
    { name: '@aily-project/lib-test', version: '1.0.0' },
    [dhtRead],
    '',
    'test',
  );
  assert.match(readme, /dht_read_temperature\(\$dht\)/);
  assert.doesNotMatch(readme, /dht_read_temperature\(variables_get\(\$dht\)\)/);
  assert.equal(absFormat(dhtRead), 'dht_read_temperature($dht)');
});

test('compact rendering never inserts executable-looking placeholders', () => {
  const block = {
    type: 'many_fields',
    args0: Array.from({ length: 6 }, (_, index) => ({
      type: 'field_number',
      name: `N${index}`,
      value: index,
    })).concat({ type: 'input_statement', name: 'DO0' }),
  };
  const readme = generateAiReadme({}, [block], '', 'test', true);
  assert.match(readme, /many_fields\(0, 1, 2, 3, 4, 5\)/);
  assert.deepEqual(validateAbsCall(
    block,
    'many_fields(0, 1, 2, 3, 4, 5)',
    'compact table',
    true,
  ), []);
});

test('slot-aware validation rejects a value block inside field_variable', () => {
  const content = [
    '| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |',
    '|---|---|---|---|---|',
    '| `dht_read_temperature` | Value | VAR(field_variable) | `dht_read_temperature(variables_get($dht))` | code |',
    '',
    '```abs',
    'dht_read_temperature(variables_get($dht))',
    '```',
  ].join('\n');
  const messages = validateAiAbsContracts(content, [dhtRead]);
  assert.ok(messages.some((message) => message.includes('field_variable') && message.includes('not variables_get')));
  assert.ok(messages.some((message) => message.startsWith('ABS example')));
});

test('slot-aware validation distinguishes variable fields while retaining value-input shorthand', () => {
  const valid = [
    '| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |',
    '|---|---|---|---|---|',
    '| `dht_read_temperature` | Value | VAR(field_variable) | `dht_read_temperature($dht)` | code |',
    '| `serial_println` | Statement | VALUE(input_value) | `serial_println(variables_get($dht))` | code |',
    '```abs',
    'serial_println(variables_get($dht))',
    '```',
  ].join('\n');
  assert.deepEqual(validateAiAbsContracts(valid, [dhtRead, printValue]), []);

  const shorthand = valid.replace('serial_println(variables_get($dht))', 'serial_println($dht)');
  assert.deepEqual(validateAiAbsContracts(shorthand, [dhtRead, printValue]), []);
});

test('slot-aware validation checks dropdown domains and structured custom fields', () => {
  const block = {
    type: 'render_asset',
    args0: [
      { type: 'field_dropdown', name: 'MODE', options: [['Fast', 'FAST'], ['Slow', 'SLOW']] },
      { type: 'field_bitmap_u8g2', name: 'BITMAP', width: 16, height: 16 },
    ],
  };
  assert.ok(validateAbsCall(block, 'render_asset(UNKNOWN, 0)', 'asset', true)
    .some(message => message.includes('must be one of FAST, SLOW')));
  assert.ok(validateAbsCall(block, 'render_asset(FAST, 0)', 'asset', true)
    .some(message => message.includes('must use structured JSON object')));
  assert.deepEqual(validateAbsCall(
    block,
    'render_asset(FAST, {"schemaVersion":1,"encoding":"xbm-lsb-row-v1","width":16,"height":16,"bitmap":null})',
    'asset',
    true,
  ), []);
});

test('dropdown validation respects native case-sensitive options and function-shaped enum values', () => {
  const booleanBlock = {
    type: 'logic_boolean',
    output: 'Boolean',
    args0: [
      { type: 'field_dropdown', name: 'BOOL', options: [['true', 'true'], ['false', 'false']] },
    ],
  };
  assert.match(validateAbsCall(booleanBlock, 'logic_boolean(TRUE)', 'boolean', true).join('\n'), /must be one of true, false/);
  assert.deepEqual(validateAbsCall(booleanBlock, 'logic_boolean(false)', 'boolean', true), []);

  const serialRead = {
    type: 'serial_read',
    output: null,
    args0: [
      { type: 'field_dropdown', name: 'SERIAL', options: [['Serial', 'Serial']] },
      { type: 'field_dropdown', name: 'METHOD', options: [['read', 'read()'], ['peek', 'peek()']] },
    ],
  };
  assert.deepEqual(validateAbsCall(serialRead, 'serial_read(Serial, read())', 'serial', true), []);
});

test('cross-library validation recognizes named value inputs without attaching nested markers to a hat block', () => {
  const region = [
    'arduino_loop()',
    '    controls_if()',
    '        @IF0: logic_boolean(TRUE)',
    '        @DO0:',
    '            serial_println(Serial, text("ok"))',
  ].join('\n');
  const controlsCandidate = {
    block: {
      type: 'controls_if',
      mutator: 'controls_if_mutator',
      args0: [
        { type: 'input_value', name: 'IF0' },
        { type: 'input_statement', name: 'DO0' },
      ],
    },
    contract: null,
  };
  assert.equal(
    callWithNamedValueInputs(region, 'controls_if()', controlsCandidate),
    'controls_if(IF0=logic_boolean(TRUE))',
  );
  assert.equal(
    callWithNamedValueInputs(region, 'arduino_loop()', { block: { type: 'arduino_loop' }, contract: null }),
    'arduino_loop()',
  );
});

test('canonical table rows keep long executable calls and numeric dropdown values intact', () => {
  const block = {
    type: 'long_call',
    output: null,
    args0: [
      { type: 'field_dropdown', name: 'MODE', options: [['one', '1']] },
      ...Array.from({ length: 30 }, (_, index) => ({ type: 'input_value', name: `VALUE_${index}` })),
    ],
  };
  const content = generateAiReadme(
    { name: 'long-call', version: '1.0.0' },
    [block],
    '',
    'long-call',
    true,
  );
  assert.match(content, /`long_call\(1, math_number\(0\)/);
  assert.doesNotMatch(content.split('\n').find(line => line.includes('`long_call`')), /\.\.\./);
  assert.deepEqual(validateAiAbsContracts(content, [block]).filter(item => item.includes('Block Definitions')), []);
});

test('generated-code previews remain complete beyond the old table-cell limit', () => {
  const block = { type: 'long_codegen', previousStatement: null, nextStatement: null, args0: [] };
  const preview = `begin(); ${'writeValue(1234567890); '.repeat(12)}finish();`;
  const content = generateAiReadme(
    { name: 'long-codegen', version: '1.0.0' },
    [block],
    '',
    'long-codegen',
    false,
    null,
    new Map([[block.type, preview]]),
  );
  const row = content.split('\n').find(line => line.includes('| `long_codegen` |'));
  assert.ok(row.length > 300);
  assert.match(row, /finish\(\);` \|$/);
  assert.doesNotMatch(row, /Dynamic code|See generator/);
});

test('generated-code probing uses real variable names, wrapper connectivity, and side effects', () => {
  const build = (library) => {
    const libraryPath = path.resolve(__dirname, '..', library);
    const contract = loadLibraryContract(library);
    return buildGeneratedCodePreviews(
      library,
      fs.readFileSync(path.join(libraryPath, 'generator.js'), 'utf8'),
      JSON.parse(fs.readFileSync(path.join(libraryPath, 'block.json'), 'utf8')),
      contract,
    );
  };
  const mt6701 = build('MT6701');
  assert.deepEqual(mt6701.errors, []);
  assert.equal(mt6701.previews.get('mt6701_get_angle_radians'), 'encoder.getAngleRadians()');
  assert.doesNotMatch(mt6701.previews.get('mt6701_init'), /undefined/);

  const chipAsr = build('chipIntelli_ASR');
  assert.deepEqual(chipAsr.errors, []);
  assert.equal(chipAsr.previews.get('chipintelli_asr_end'), 'ChipIntelliASR.end();');

  const aiVox = build('ai-vox-xzai');
  assert.deepEqual(aiVox.errors, []);
  assert.match(aiVox.previews.get('aivox3_set_screen_light'), /analogWrite\(kDisplayBacklightPin, 0\)/);
});

test('generated-code getValue probing resolves variables and records each slot kind', () => {
  const block = {
    type: 'get_value_probe',
    output: 'Number',
    args0: [
      { type: 'field_variable', name: 'VAR', variable: 'sensor' },
      { type: 'input_value', name: 'VALUE', check: 'Number' },
      { type: 'input_statement', name: 'BODY' },
      { type: 'field_input', name: 'LABEL', text: 'ready' },
    ],
  };
  for (const receiver of ['generator', 'Arduino']) {
    const loaded = loadGenerator('get-value-probe', `
      Arduino.forBlock.get_value_probe = function(block, generator) {
        ${receiver}.nameDB_.getName = function(id, kind) {
          if (id !== 'sensor' || kind !== 'VARIABLE') throw new Error('wrong variable lookup');
          return 'resolved_sensor';
        };
        const variable = ${receiver}.getValue(block, 'VAR', 'field_variable');
        const value = ${receiver}.getValue(block, 'VALUE', 'input_value');
        const body = ${receiver}.getValue(block, 'BODY', 'input_statement');
        const label = ${receiver}.getValue(block, 'LABEL');
        return [variable + '.' + label + '(' + value + ')' + body, 0];
      };
    `);
    assert.equal(loaded.error, null);
    const probe = probeGeneratorHandler(loaded, loaded.handlers.get_value_probe, block);
    assert.equal(probe.error, null, receiver);
    assert.equal(probe.generatedCode, 'resolved_sensor.ready(0)', receiver);
    assert.deepEqual(probe.reads, [
      { kind: 'field', name: 'VAR' },
      { kind: 'value', name: 'VALUE' },
      { kind: 'statement', name: 'BODY' },
      { kind: 'field', name: 'LABEL' },
    ], receiver);
  }
});

test('no-direct generated code requires a versioned classification with an explicit preview', () => {
  const u8g2Path = path.resolve(__dirname, '..', 'u8g2');
  const u8g2 = buildGeneratedCodePreviews(
    'u8g2',
    fs.readFileSync(path.join(u8g2Path, 'generator.js'), 'utf8'),
    JSON.parse(fs.readFileSync(path.join(u8g2Path, 'block.json'), 'utf8')),
    loadLibraryContract('u8g2'),
  );
  assert.deepEqual(u8g2.errors, []);
  assert.match(u8g2.previews.get('u8g2_bitmap'), /custom bitmap\/animation field has no frame data/);

  const unclassified = buildGeneratedCodePreviews(
    'unclassified-fixture',
    "Arduino.forBlock['silent_block'] = function() { return ''; };",
    [{ type: 'silent_block', previousStatement: null, nextStatement: null, args0: [] }],
  );
  assert.ok(unclassified.errors.some(entry => entry.error.includes('without a classified reason')));
  assert.equal(unclassified.previews.has('silent_block'), false);
});

test('incremental generator coverage can report generated-code drift without blocking', () => {
  const report = {
    generatorLoadErrors: 0,
    missingPublicGenerators: 0,
    unclassifiedMissingGenerators: 0,
    unresolvedVisibleToolboxTypes: 0,
    duplicateAssignments: 0,
    unclassifiedOrphanGenerators: 0,
    registrationContractErrors: [],
    generatedCodeContractErrors: [],
    slotMismatches: 0,
    unknownSlotReads: 0,
    handlerProbeErrors: 0,
    generatedCodeMismatches: 3,
  };

  assert.equal(strictFailureCount(report), 3);
  assert.equal(strictFailureCount(report, { allowGeneratedCodeMismatches: true }), 0);
  assert.deepEqual(parseGeneratorCoverageArgs(['--strict', '--allow-generated-code-mismatches', '--library', 'esplink_ble']), {
    json: false,
    strict: true,
    allowGeneratedCodeMismatches: true,
    libraries: ['esplink_ble'],
  });
});

test('Block Definitions rejects unknown pseudo-blocks and duplicate rows', () => {
  const block = { type: 'real_block', previousStatement: null, nextStatement: null, args0: [] };
  const content = [
    '## Block Definitions',
    '',
    '| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |',
    '|---|---|---|---|---|',
    '| `real_block` | Statement | (none) | `real_block()` | `real();` |',
    '| `real_block` | Statement | (none) | `real_block()` | `real();` |',
    '| `realN_block` | Statement | (none) | `real_block()` | `real(...);` |',
  ].join('\n');
  const messages = validateAiAbsContracts(content, [block]);
  assert.ok(messages.some(message => message.includes('unknown block type realN_block')));
  assert.ok(messages.some(message => message.includes('2 rows for real_block')));
});

test('Block Definitions rejects a block row placed in another section', () => {
  const block = { type: 'misplaced_block', previousStatement: null, nextStatement: null, args0: [] };
  const content = [
    '## Block Definitions',
    '',
    '| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |',
    '|---|---|---|---|---|',
    '',
    '## Notes',
    '',
    '| `misplaced_block` | Statement | (none) | `misplaced_block()` | `run();` |',
  ].join('\n');
  const messages = validateAiAbsContracts(content, [block]);
  assert.ok(messages.some(message => message.includes('Block Definitions missing exact row for misplaced_block')));
});

test('accepts existing Blockly block types with a numeric prefix', () => {
  const block = { type: '74hc595_create', args0: [] };
  const content = [
    '| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |',
    '|---|---|---|---|---|',
    '| `74hc595_create` | Statement | (none) | `74hc595_create()` | code |',
    '```abs',
    '74hc595_create()',
    '```',
  ].join('\n');
  assert.deepEqual(validateAiAbsContracts(content, [block]), []);
});

test('versioned runtime signatures validate dynamic extension arguments precisely', () => {
  const content = [
    '| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |',
    '|---|---|---|---|---|',
    '| `dht_init` | Statement | VAR(field_input), TYPE(dropdown); runtime variants: single-wire-pin: PIN(dropdown); dht20-i2c: WIRE(dropdown) | `dht_init("dht", DHT11, 2)` | code |',
    '```abs',
    'dht_init("dht", DHT20, Wire)',
    '```',
  ].join('\n');
  assert.deepEqual(validateAiAbsContracts(content, [dhtInit], dhtRuntimeContract), []);

  const missingDynamicArg = content.replace('dht_init("dht", DHT20, Wire)', 'dht_init("dht", DHT20)');
  assert.ok(validateAiAbsContracts(missingDynamicArg, [dhtInit], dhtRuntimeContract)
    .some(message => message.includes('missing WIRE')));

  const unsupportedType = content.replace('dht_init("dht", DHT20, Wire)', 'dht_init("dht", DHT99, Wire)');
  assert.ok(validateAiAbsContracts(unsupportedType, [dhtInit], dhtRuntimeContract)
    .some(message => message.includes('does not select this runtime signature')));
});

test('a runtime contract can attest that an extension preserves the static signature', () => {
  const block = {
    type: 'display_setup',
    args0: [{ type: 'field_input', name: 'WIDTH', text: '240' }],
    extensions: ['board_defaults_only'],
  };
  const content = [
    '| Block Type | Connection | Parameters | ABS Format | Generated Code |',
    '|---|---|---|---|---|',
    '| `display_setup` | Statement | WIDTH(field_input) | `display_setup("240")` | setup |',
    '```abs',
    'arduino_setup()',
    '    display_setup("240")',
    '```',
  ].join('\n');
  const contract = {
    schemaVersion: 1,
    blocks: {
      display_setup: {
        staticShape: true,
        reason: 'The extension assigns defaults without changing inputList.',
      },
    },
  };
  assert.deepEqual(validateAiAbsContracts(content, [block], contract), []);
  delete contract.blocks.display_setup.reason;
  assert.match(validateAiAbsContracts(content, [block], contract)[0], /requires a non-empty reason/);
});

test('README generation distinguishes runtime shape changes from UI-only extensions', () => {
  const uiOnlyBlock = {
    type: 'display_setup',
    previousStatement: null,
    nextStatement: null,
    args0: [],
    extensions: ['display_defaults'],
  };
  const contract = {
    schemaVersion: 1,
    blocks: {
      ...dhtRuntimeContract.blocks,
      display_setup: {
        staticShape: true,
        reason: 'The extension assigns defaults without changing serializable inputs.',
      },
    },
  };
  const readme = generateAiReadme(
    { name: 'runtime-notes', version: '1.0.0' },
    [dhtInit, uiOnlyBlock],
    '',
    'runtime-notes',
    false,
    contract,
  );
  assert.match(readme, /\*\*Runtime shape\*\*: only `dht_init`/);
  assert.match(readme, /\*\*UI-only extensions\*\*: `display_setup`/);
  assert.doesNotMatch(readme, /may add fields at runtime/);
});

test('a runtime contract can exclude a hidden compatibility input from the agent-facing ABI', () => {
  const block = {
    type: 'legacy_compatible_speak',
    previousStatement: null,
    nextStatement: null,
    args0: [
      { type: 'input_value', name: 'TEXT' },
      { type: 'field_number', name: 'INTERVAL', value: 1 },
    ],
    extensions: ['legacy_interval_input'],
  };
  const contract = {
    schemaVersion: 1,
    blocks: {
      legacy_compatible_speak: {
        excludedRuntimeArgs: [{
          name: 'INTERVAL',
          type: 'input_value',
          reason: 'The hidden input only restores old projects; current ABS uses the visible INTERVAL field.',
        }],
      },
    },
  };
  const content = [
    '| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |',
    '|---|---|---|---|---|',
    '| `legacy_compatible_speak` | Statement | TEXT(input_value), INTERVAL(field_number) | `legacy_compatible_speak(text("hello"), 1)` | code |',
    '',
    '```abs',
    'arduino_loop()',
    '    legacy_compatible_speak(text("hello"), 1)',
    '```',
  ].join('\n');
  assert.deepEqual(validateAiAbsContracts(content, [block], contract), []);
});

test('candidate renderer documents dynamic Hat variants outside setup and loop', () => {
  const dynamicHat = {
    type: 'custom_function_def',
    args0: [
      { type: 'field_input', name: 'FUNC_NAME', text: 'myFunction' },
      { type: 'field_dropdown', name: 'RETURN_TYPE', options: [['void', 'void'], ['int', 'int']] },
      { type: 'input_statement', name: 'STACK' },
    ],
  };
  const contract = {
    schemaVersion: 1,
    blocks: {
      custom_function_def: {
        variants: [
          {
            id: 'returning',
            when: { RETURN_TYPE: ['int'] },
            appendArgs: [{ name: 'RETURN', type: 'input_value', example: 'math_number(1)', required: true }],
          },
          {
            id: 'void-param',
            when: { RETURN_TYPE: ['void'] },
            appendArgs: [
              { name: 'PARAM_TYPE0', type: 'field_dropdown', example: 'int', required: true },
              { name: 'PARAM_NAME0', type: 'field_input', example: '"value"', required: true },
            ],
          },
        ],
      },
    },
  };
  const candidate = generateAiReadme(
    { name: '@aily-project/lib-functions', version: '1.0.0', description: 'Functions.' },
    [dynamicHat],
    '',
    'functions',
    false,
    contract,
  );
  assert.deepEqual(validateAiAbsContracts(candidate, [dynamicHat], contract), []);
  assert.match(candidate, /custom_function_def\("myFunction", int, math_number\(1\)\)\n\narduino_setup\(\)/);
  assert.match(candidate, /Runtime Variant: custom_function_def\/void-param/);
  assert.match(candidate, /```\ncustom_function_def\("myFunction", void, int, "value"\)\n```/);
  assert.doesNotMatch(candidate, /arduino_loop\(\)\n    custom_function_def/);
});

test('candidate renderer emits a first runtime variant with appended statement children', () => {
  const dynamicStatement = {
    type: 'mcp_handler',
    previousStatement: null,
    nextStatement: null,
    args0: [{ type: 'field_input', name: 'NAME', text: 'led' }],
  };
  const contract = {
    schemaVersion: 1,
    blocks: {
      mcp_handler: {
        variants: [{
          id: 'set-and-report',
          when: {},
          appendArgs: [
            { name: 'SET', type: 'input_statement', example: 'serial_println(Serial, text("set"))', required: true },
            { name: 'REPORT', type: 'input_statement', example: 'serial_println(Serial, text("report"))', required: true },
          ],
        }],
      },
    },
  };
  const candidate = generateAiReadme(
    { name: 'dynamic-statements', version: '1.0.0' },
    [dynamicStatement],
    '',
    'dynamic-statements',
    false,
    contract,
  );
  assert.match(candidate, /Runtime Variant: mcp_handler\/set-and-report/);
  assert.match(candidate, /@SET:\n\s+serial_println/);
  assert.match(candidate, /@REPORT:\n\s+serial_println/);
  assert.deepEqual(validateAiAbsContracts(candidate, [dynamicStatement], contract), []);
});

test('versioned runtime fixture locks desktop initializers and high-risk cases', () => {
  const fixture = readRuntimeFixture(path.resolve(
    __dirname,
    'contracts',
    'readme-runtime-contracts.v1.json',
  ));
  assert.equal(fixture.schemaVersion, 1);
  assert.equal(new Set(fixture.cases.map(contractCase => contractCase.id)).size, fixture.cases.length);
  assert.ok(fixture.cases.some(contractCase => contractCase.id === 'core-logic-switch-mutator'));
  assert.deepEqual(fixture.runtimeInitializers, [
    'src/app/editors/blockly-editor/components/blockly/plugins/block-plus-minus/src/index.js',
    'src/app/editors/blockly-editor/components/blockly/custom-field/field-u8g2-bitmap.ts',
  ]);
  assert.ok(fixture.runtimeSourcePaths.includes(
    'src/app/editors/blockly-editor/services/bitmap-upload.service.ts',
  ));
  assert.ok(fixture.cases.some(contractCase => contractCase.id === 'dht20-read-root-before-init-root'));
  assert.ok(fixture.cases.some(contractCase => contractCase.id === 'blynk-callback-and-timer-hooks'));
  assert.ok(fixture.cases.some(contractCase => contractCase.id === 'custom-function-dynamic-parameters'));
  assert.ok(fixture.cases.some(contractCase => contractCase.id === 'custom-function-void-body-and-call'));
  const compileCase = fixture.cases.find(contractCase => contractCase.id === 'core-logic-statement-body');
  assert.equal(compileCase.compile.board, 'arduino:avr:uno');
  assert.deepEqual(compileCase.compile.artifacts, ['.elf', '.hex']);
  const projectDataCase = fixture.cases.find(
    contractCase => contractCase.id === 'u8g2-external-project-data-bitmap',
  );
  assert.equal(projectDataCase.projectDataSeeds.length, 1);
  assert.equal(projectDataCase.expect.projectDataBindings[0].seed, 'icon16');
});

test('generic runtime fixture assertions check paths, counts, and variable identity', () => {
  const saved = {
    variables: [{ id: 'var-1', name: 'sensor', type: 'DHT' }],
  };
  const blocks = [{
    type: 'dynamic_read',
    extraState: { itemCount: 2 },
    fields: { VAR: { id: 'var-1' } },
    inputs: { ADD0: { block: { type: 'text' } }, ADD1: { block: { type: 'text' } } },
  }];
  const contractCase = {
    id: 'synthetic-generic-assertions',
    expect: {
      blockCounts: { dynamic_read: 1 },
      paths: [
        { block: { type: 'dynamic_read' }, path: 'extraState.itemCount', equals: 2 },
        { block: { type: 'dynamic_read' }, path: 'inputs.ADD2', absent: true },
      ],
      variableBindings: [
        { block: { type: 'dynamic_read' }, field: 'VAR', name: 'sensor', type: 'DHT' },
      ],
    },
  };
  assert.doesNotThrow(() => verifyFixtureExpectations(contractCase, saved, blocks));
  assert.throws(
    () => verifyFixtureExpectations(
      { ...contractCase, expect: { paths: [{ block: { type: 'dynamic_read' }, path: 'extraState.itemCount', equals: 3 }] } },
      saved,
      blocks,
    ),
    /expected 3, received 2/,
  );
});

test('example-shape validation rejects executable-looking placeholders but allows string ellipses', () => {
  const messages = validateAbsExampleShape([
    'serial_println(Serial, text("Waiting..."))',
    'controls_if(logic_boolean(TRUE)) @DO0: child_block()',
    '    action()',
    'u8g2_begin(... full-buffer display ...)',
    '# child_block() and ... in a comment are documentation only',
  ].join('\n'), 0);
  assert.equal(messages.filter((message) => message.includes('child_block()')).length, 1);
  assert.equal(messages.filter((message) => message.includes('action()')).length, 1);
  assert.equal(messages.filter((message) => message.includes('named statement input')).length, 1);
  assert.equal(messages.filter((message) => message.includes('"..."')).length, 1);
  assert.ok(messages.every((message) => !message.includes('line 1')));
  assert.ok(messages.every((message) => !message.includes('line 5')));
});

test('ABS example discovery validates text-labelled ABS without consuming unrelated code fences', () => {
  const content = [
    '| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |',
    '|---|---|---|---|---|',
    '| `dht_read_temperature` | Value | VAR(field_variable) | `dht_read_temperature($dht)` | code |',
    '',
    '## Implementation',
    '```cpp',
    'dht_read_temperature(variables_get($cppOnly))',
    '```',
    '',
    '## ABS Examples',
    '```text',
    'dht_read_temperature(variables_get($mustValidate))',
    '```',
  ].join('\n');
  const messages = validateAiAbsContracts(content, [dhtRead]);
  assert.equal(messages.filter(message => message.includes('field_variable and must use $name')).length, 1);
  assert.ok(messages.every(message => !message.includes('cppOnly')));
});

test('ABS example discovery also validates localized and unfenced ABS sections', () => {
  const content = [
    '## ABS 示例',
    '',
    'arduino_loop()',
    '    dht_read_temperature(variables_get($sensor))',
  ].join('\n');
  const messages = validateAiAbsContracts(content, [dhtRead]);
  assert.ok(messages.some(message => message.startsWith('ABS example')
    && message.includes('field_variable')));
});

test('regression comparison blocks only new findings and ignores example reordering', () => {
  const validTable = [
    '| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |',
    '|---|---|---|---|---|',
    '| `dht_read_temperature` | Value | VAR(field_variable) | `dht_read_temperature($dht)` | code |',
  ];
  const before = validTable.concat([
    '```abs',
    'logic_boolean(TRUE)',
    '```',
    '```abs',
    'dht_read_temperature(variables_get($dht))',
    '```',
  ]).join('\n');
  const reordered = validTable.concat([
    '```abs',
    'dht_read_temperature(variables_get($dht))',
    '```',
    '```abs',
    'logic_boolean(TRUE)',
    '```',
  ]).join('\n');
  const fixed = reordered.replace(
    'dht_read_temperature(variables_get($dht))',
    'dht_read_temperature($dht)',
  );

  assert.deepEqual(compareAiAbsContracts(before, [dhtRead], reordered, [dhtRead]).added, []);
  const improvement = compareAiAbsContracts(before, [dhtRead], fixed, [dhtRead]);
  assert.deepEqual(improvement.added, []);
  assert.ok(improvement.removed.some((message) => message.includes('field_variable')));
});

test('regression comparison treats a flawed new README as new debt', () => {
  const flawed = [
    '| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |',
    '|---|---|---|---|---|',
    '| `dht_read_temperature` | Value | VAR(field_variable) | `dht_read_temperature(variables_get($dht))` | code |',
    '```abs',
    'dht_read_temperature(variables_get($dht))',
    '```',
  ].join('\n');
  const comparison = compareAiAbsContracts(null, [], flawed, [dhtRead]);
  assert.equal(comparison.before.length, 0);
  assert.ok(comparison.added.length >= 2);
});

test('changed-library gate records ABS regressions independently of legacy score', () => {
  const valid = [
    '| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |',
    '|---|---|---|---|---|',
    '| `dht_read_temperature` | Value | VAR(field_variable) | `dht_read_temperature($dht)` | code |',
    '```abs',
    'dht_read_temperature($dht)',
    '```',
  ].join('\n');
  const flawed = valid.split('dht_read_temperature($dht)')
    .join('dht_read_temperature(variables_get($dht))');
  class StubValidator extends LibraryValidator {
    listLibraryFilesAtRevision() {
      return ['fixture/block.json', 'fixture/readme_ai.md'];
    }
    readFileAtRevision(ref, relativePath) {
      return relativePath.endsWith('block.json') ? JSON.stringify([dhtRead]) : valid;
    }
    readReadmeContractAtRevision() {
      return null;
    }
    readCurrentReadmeContract() {
      return null;
    }
    readCurrentFileCaseInsensitive(libraryPath, expectedName) {
      if (expectedName === 'block.json') return JSON.stringify([dhtRead]);
      if (expectedName === 'readme_ai.contract.json') return null;
      return flawed;
    }
  }

  const originalLog = console.log;
  console.log = () => {};
  const validator = new StubValidator();
  let comparison;
  let shaComparison;
  try {
    comparison = validator.checkAiReadmeAbsRegression('fixture', '0123456789abcdef');

    const shaValidator = new StubValidator();
    shaComparison = shaValidator.checkAiReadmeAbsRegression(
      'fixture',
      '0123456789abcdef',
      'fedcba9876543210',
    );
  } finally {
    console.log = originalLog;
  }
  assert.ok(comparison.added.length >= 2);
  assert.equal(validator.absContractRegressions, comparison.added.length);
  assert.ok(validator.issues.every((entry) => entry.category === 'README ABS 回归'));

  assert.deepEqual(shaComparison.added, [], 'explicit head must be read from Git, not the merge checkout');
});

test('changed-library discovery maps centralized README contracts back to their library', () => {
  const validator = new LibraryValidator();
  assert.deepEqual(
    validator.extractLibrariesFromChangedFiles([
      '.scripts/contracts/readme-library-contracts/adafruit_DHT.json',
    ]),
    ['adafruit_DHT'],
  );
});

test('changed-library command fails on ABS regressions even when legacy score is 100%', async () => {
  class ChangedValidator extends LibraryValidator {
    getChangedFiles() {
      return ['adafruit_DHT/readme_ai.md'];
    }
    extractLibrariesFromChangedFiles() {
      return ['adafruit_DHT'];
    }
    resolveAbsBaselineRef() {
      return '0123456789abcdef';
    }
    async validateLibrary() {
      return {
        libraryName: 'adafruit_DHT',
        percentage: 100,
        absContractRegressions: 1,
        issues: [],
      };
    }
    checkDuplicatePackageNames() {
      return [];
    }
  }

  const previousExitCode = process.exitCode;
  const originalLog = console.log;
  process.exitCode = undefined;
  console.log = () => {};
  try {
    await new ChangedValidator().validateChangedLibraries({ base: 'base', head: 'head' });
    assert.equal(process.exitCode, 1);
  } finally {
    console.log = originalLog;
    process.exitCode = previousExitCode;
  }
});

test('golden ABS snippets follow current core logic, loop, and DHT block contracts', () => {
  const root = path.resolve(__dirname, '..');
  const readBlock = (library, type) => {
    const blocks = JSON.parse(fs.readFileSync(path.join(root, library, 'block.json'), 'utf8'));
    return blocks.find((block) => block.type === type);
  };
  const golden = [
    {
      block: readBlock('core-logic', 'controls_if'),
      call: 'controls_if(logic_boolean(TRUE))',
      example: [
        'controls_if(logic_boolean(TRUE))',
        '    serial_println(Serial, "true")',
      ].join('\n'),
    },
    {
      block: readBlock('core-loop', 'controls_for'),
      call: 'controls_for($i, math_number(0), math_number(10), math_number(1))',
      example: [
        'controls_for($i, math_number(0), math_number(10), math_number(1))',
        '    serial_println(Serial, $i)',
      ].join('\n'),
    },
    {
      block: readBlock('adafruit_DHT', 'dht_read_temperature'),
      call: 'dht_read_temperature($dht)',
      example: 'serial_println(Serial, dht_read_temperature($dht))',
    },
  ];

  for (const { block, call, example } of golden) {
    assert.ok(block, 'golden fixture must refer to a real block.json type');
    const content = [
      '| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |',
      '|---|---|---|---|---|',
      `| \`${block.type}\` | Statement | ${paramsDescriptionForBlock(block)} | \`${call}\` | code |`,
      '```abs',
      example,
      '```',
    ].join('\n');
    assert.deepEqual(validateAiAbsContracts(content, [block]), []);
  }
});

test('candidate generation writes only to .temp and keeps the source README unchanged', () => {
  const sourcePath = path.resolve(__dirname, '..', 'adafruit_DHT', 'readme_ai.md');
  const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');
  const before = fs.readFileSync(sourcePath);
  const result = generateCandidate('adafruit_DHT');
  const after = fs.readFileSync(sourcePath);
  const candidate = fs.readFileSync(result.outputPath, 'utf8');

  assert.equal(hash(after), hash(before));
  assert.match(path.relative(path.resolve(__dirname, '..'), result.outputPath), /^\.temp[\\/]readme-candidates/);
  assert.match(candidate, /dht_read_temperature\(\$dht\)/);
  assert.doesNotMatch(candidate, /dht_read_temperature\(variables_get\(\$dht\)\)/);
  assert.match(candidate, /dht_init\("dht", DHT11, 2\)/);
  assert.match(candidate, /dht_init\("dht", DHT20, Wire\)/);
});

test('agent-invisible blocks are excluded from generated README contracts', () => {
  const hiddenBlock = {
    type: 'legacy_internal_block',
    previousStatement: null,
    nextStatement: null,
    args0: [],
  };
  const contract = {
    schemaVersion: 1,
    blocks: {
      legacy_internal_block: {
        agentVisible: false,
        reason: 'Internal mutator helper with no generator; it is not a callable ABS API.',
      },
    },
  };
  const generated = generateAiReadme(
    { name: '@aily-project/lib-fixture', version: '1.0.0', description: 'fixture' },
    [printValue, hiddenBlock],
    '',
    'fixture',
    false,
    contract,
  );

  assert.doesNotMatch(generated, /legacy_internal_block/);
  assert.deepEqual(validateAiAbsContracts(generated, [printValue, hiddenBlock], contract), []);

  const leaked = generated.replace(
    '|------------|------------|--------------------------|------------|----------------|',
    '|------------|------------|--------------------------|------------|----------------|\n'
      + '| `legacy_internal_block` | Statement | none | `legacy_internal_block()` | code |',
  );
  assert.ok(validateAiAbsContracts(leaked, [printValue, hiddenBlock], contract)
    .some(message => message.includes('must not expose agent-invisible block')));
});

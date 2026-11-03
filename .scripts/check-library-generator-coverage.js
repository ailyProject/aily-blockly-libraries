#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const {
  allDocumentedBlocks,
  blockContractFor,
  runtimeBlockDefinitions,
  absArgExample,
} = require('./check-readme-compliance');
const { loadLibraryContract, validateGeneratorProbe } = require('./readme-library-contracts');

const ROOT = path.resolve(__dirname, '..');
const GENERATOR_REGISTRATION_CONTRACT = path.join(
  ROOT,
  '.scripts',
  'contracts',
  'readme-generator-registrations.v1.json',
);
const GENERATED_CODE_NO_DIRECT_CONTRACT = path.join(
  ROOT,
  '.scripts',
  'contracts',
  'readme-generated-code-no-direct.v1.json',
);
const GENERATOR_ONLY_CLASSIFICATIONS = new Set([
  'runtime-defined',
  'cross-library',
  'builtin-override',
  'legacy-registration',
]);
const NO_DIRECT_CLASSIFICATIONS = new Set([
  'conditional-generator-state',
  'generator-state-only',
  'empty-statement-inputs',
  'empty-custom-field',
  'ui-only',
]);
const NO_DIRECT_PREVIEW = 'No direct code emitted for the representative default state';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
}

function trackedLibraries() {
  return [...new Set(execFileSync('git', ['ls-files', '-z', '*/block.json'], {
    cwd: ROOT,
    encoding: 'utf8',
  }).split('\0').filter(Boolean).map(file => file.replace(/\\/g, '/').split('/')[0]))].sort();
}

function collectToolboxTypes(node, output = new Set()) {
  if (Array.isArray(node)) {
    for (const item of node) collectToolboxTypes(item, output);
    return output;
  }
  if (!node || typeof node !== 'object') return output;
  if (node.kind === 'block' && typeof node.type === 'string') output.add(node.type);
  for (const value of Object.values(node)) collectToolboxTypes(value, output);
  return output;
}

function loadGeneratorRegistrationContract() {
  const errors = [];
  const allowed = new Map();
  if (!fs.existsSync(GENERATOR_REGISTRATION_CONTRACT)) {
    return { allowed, errors: ['missing .scripts/contracts/readme-generator-registrations.v1.json'] };
  }
  let contract;
  try {
    contract = readJson(GENERATOR_REGISTRATION_CONTRACT);
  } catch (error) {
    return { allowed, errors: [`invalid generator registration contract: ${error.message}`] };
  }
  if (contract?.schemaVersion !== 1) errors.push('generator registration contract schemaVersion must be 1');
  if (!Array.isArray(contract?.allow)) {
    errors.push('generator registration contract allow must be an array');
    return { allowed, errors };
  }
  for (const [index, entry] of contract.allow.entries()) {
    const label = `generator registration contract allow[${index}]`;
    if (!entry || typeof entry !== 'object') {
      errors.push(`${label} must be an object`);
      continue;
    }
    if (typeof entry.library !== 'string' || !entry.library.trim()) errors.push(`${label}.library must be non-empty`);
    if (!GENERATOR_ONLY_CLASSIFICATIONS.has(entry.classification)) errors.push(`${label}.classification is invalid`);
    if (typeof entry.reason !== 'string' || !entry.reason.trim()) errors.push(`${label}.reason must be non-empty`);
    if (!Array.isArray(entry.types) || entry.types.length === 0) {
      errors.push(`${label}.types must be a non-empty array`);
      continue;
    }
    for (const type of entry.types) {
      if (typeof type !== 'string' || !type.trim()) {
        errors.push(`${label}.types contains an invalid block type`);
        continue;
      }
      const key = `${entry.library}\0${type}`;
      if (allowed.has(key)) errors.push(`${label} duplicates ${entry.library}/${type}`);
      else allowed.set(key, entry);
    }
  }
  return { allowed, errors };
}

function loadGeneratedCodeNoDirectContract() {
  const errors = [];
  const allowed = new Map();
  if (!fs.existsSync(GENERATED_CODE_NO_DIRECT_CONTRACT)) {
    return { allowed, errors: ['missing .scripts/contracts/readme-generated-code-no-direct.v1.json'] };
  }
  let contract;
  try {
    contract = readJson(GENERATED_CODE_NO_DIRECT_CONTRACT);
  } catch (error) {
    return { allowed, errors: [`invalid generated-code no-direct contract: ${error.message}`] };
  }
  if (contract?.schemaVersion !== 1) errors.push('generated-code no-direct contract schemaVersion must be 1');
  if (!Array.isArray(contract?.allow)) {
    errors.push('generated-code no-direct contract allow must be an array');
    return { allowed, errors };
  }
  for (const [index, entry] of contract.allow.entries()) {
    const label = `generated-code no-direct contract allow[${index}]`;
    if (!entry || typeof entry !== 'object') {
      errors.push(`${label} must be an object`);
      continue;
    }
    if (typeof entry.library !== 'string' || !entry.library.trim()) errors.push(`${label}.library must be non-empty`);
    if (!NO_DIRECT_CLASSIFICATIONS.has(entry.classification)) errors.push(`${label}.classification is invalid`);
    if (typeof entry.reason !== 'string' || !entry.reason.trim()) errors.push(`${label}.reason must be non-empty`);
    if (typeof entry.preview !== 'string' || !entry.preview.startsWith('No direct code emitted')) {
      errors.push(`${label}.preview must start with "No direct code emitted"`);
    }
    if (!Array.isArray(entry.types) || entry.types.length === 0) {
      errors.push(`${label}.types must be a non-empty array`);
      continue;
    }
    for (const type of entry.types) {
      if (typeof type !== 'string' || !type.trim()) {
        errors.push(`${label}.types contains an invalid block type`);
        continue;
      }
      const key = `${entry.library}\0${type}`;
      if (allowed.has(key)) errors.push(`${label} duplicates ${entry.library}/${type}`);
      else allowed.set(key, entry);
    }
  }
  return { allowed, errors };
}

function resolveGeneratedCodePreview(library, blockType, preview, noDirectContract) {
  const key = `${library}\0${blockType}`;
  const allowance = noDirectContract.allowed.get(key);
  if (preview === NO_DIRECT_PREVIEW) {
    if (!allowance) return { error: 'emits no direct code for representative defaults without a classified reason' };
    return { preview: allowance.preview, allowance, key };
  }
  if (allowance) return { error: 'has a stale no-direct generated-code allowance' };
  return { preview };
}

function createNoopProxy(overrides = {}) {
  const target = function noop() {};
  return new Proxy(target, {
    apply: () => undefined,
    construct: () => createNoopProxy(),
    get: (_object, property) => {
      if (property === Symbol.toPrimitive) return () => 0;
      if (property === 'then') return undefined;
      if (Object.prototype.hasOwnProperty.call(overrides, property)) return overrides[property];
      return createNoopProxy();
    },
    set: (_object, property, value) => {
      overrides[property] = value;
      return true;
    },
  });
}

function syntheticGetValue(block, name, type = '') {
  if (type === 'input_value') return this.valueToCode(block, name, this.ORDER_ATOMIC);
  if (type === 'input_statement') return this.statementToCode(block, name).replace(/^\s*/, '');
  if (type === 'field_variable') {
    return this.nameDB_.getName(block.getFieldValue(name), 'VARIABLE');
  }
  return block.getFieldValue(name);
}

function loadGenerator(library, source) {
  let activeProbe = null;
  const captureActiveEffect = (kind, args) => {
    if (activeProbe && typeof activeProbe.captureSideEffect === 'function') {
      activeProbe.captureSideEffect(kind, args);
    }
  };
  const capturingStore = kind => new Proxy(Object.create(null), {
    set(target, property, value) {
      target[property] = value;
      captureActiveEffect(kind, [String(property), value]);
      return true;
    },
  });
  const codeMethods = Object.fromEntries([
    'addLibrary', 'addVariable', 'addFunction', 'addObject', 'addSetupBegin',
    'addSetup', 'addSetupEnd', 'addMacro', 'addLoopBegin', 'addLoop', 'addLoopEnd',
  ].map(name => [name, (...args) => captureActiveEffect(name, args)]));
  const registrations = new Map();
  const handlers = Object.create(null);
  const forBlock = new Proxy(handlers, {
    set(target, property, value) {
      const type = String(property);
      registrations.set(type, (registrations.get(type) || 0) + 1);
      target[property] = value;
      return true;
    },
  });
  const workspace = createNoopProxy({
    getAllVariables: () => [],
    getAllBlocks: () => [],
    getBlocksByType: () => [],
    getVariableMap: () => createNoopProxy(),
    addChangeListener: () => {},
    removeChangeListener: () => {},
  });
  const extensions = {
    isRegistered: () => false,
    register: () => {},
    unregister: () => {},
    registerMixin: () => {},
    registerMutator: () => {},
    apply: () => {},
  };
  const identityName = value => String(value == null || value === '' ? 'item' : value);
  const nameDatabase = createNoopProxy({
    getName: identityName,
    getDistinctName: identityName,
  });
  const prefixLines = (text, prefix) => String(text || '')
    .split('\n')
    .map(line => line ? `${prefix || ''}${line}` : line)
    .join('\n');
  const Blockly = createNoopProxy({
    Extensions: extensions,
    getMainWorkspace: () => workspace,
    common: createNoopProxy({ getMainWorkspace: () => workspace }),
    Events: createNoopProxy({
      disable: () => {},
      enable: () => {},
      getGroup: () => false,
      setGroup: () => {},
    }),
    Variables: { NAME_TYPE: 'VARIABLE' },
    Blocks: Object.create(null),
  });
  const Arduino = createNoopProxy({
    forBlock,
    nameDB: nameDatabase,
    nameDB_: nameDatabase,
    getVariableName: identityName,
    getValue: syntheticGetValue,
    STATEMENT_PREFIX: '',
    STATEMENT_SUFFIX: '',
    INFINITE_LOOP_TRAP: '',
    INDENT: '  ',
    injectId: prefix => String(prefix || ''),
    prefixLines,
    tickerCallbacks: null,
    esp32Tasks: null,
    initializedSerialPorts: null,
    addedSerialInitCode: null,
    valueToCode: (...args) => activeProbe ? activeProbe.valueToCode(...args) : '',
    statementToCode: (...args) => activeProbe ? activeProbe.statementToCode(...args) : '',
    ...codeMethods,
    definitions_: capturingStore('definitions_'),
    libraries_: capturingStore('libraries_'),
    variables_: capturingStore('variables_'),
    objects_: capturingStore('objects_'),
    functions_: capturingStore('functions_'),
    setups_: capturingStore('setups_'),
  });
  const windowObject = createNoopProxy({
    Arduino,
    Blockly,
    blocklyWorkspace: workspace,
    boardConfig: { core: '', name: '' },
    projectService: null,
    customSerialPorts: Object.create(null),
    customSerialConfigs: Object.create(null),
    customI2CPins: Object.create(null),
    customI2CWires: Object.create(null),
    customESPSPIs: Object.create(null),
    customESPSPIConfigs: Object.create(null),
    customFunctionRegistry: Object.create(null),
    mcpControlParams: [],
    aivoxControlServices: [],
    mcpServiceParamMap: [],
  });
  const context = vm.createContext({
    Arduino,
    Blockly,
    window: windowObject,
    document: createNoopProxy(),
    boardConfig: createNoopProxy(),
    console: { log() {}, warn() {}, error() {}, info() {}, debug() {} },
    setTimeout: () => 0,
    clearTimeout: () => {},
    setInterval: () => 0,
    clearInterval: () => {},
    isBlockConnected: () => true,
    registerVariableToBlockly: () => {},
    renameVariableInBlockly: () => {},
  });
  try {
    new vm.Script(source, { filename: `${library}/generator.js` }).runInContext(context, { timeout: 2000 });
    return {
      registrations,
      handlers,
      context,
      setActiveProbe(probe) { activeProbe = probe; },
      error: null,
    };
  } catch (error) {
    return {
      registrations,
      handlers,
      context,
      setActiveProbe(probe) { activeProbe = probe; },
      error: error && (error.stack || error.message) ? (error.stack || error.message) : String(error),
    };
  }
}

function stripJsComments(source) {
  let output = '';
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let index = 0; index < source.length; index++) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) {
      if (char === '\n') {
        lineComment = false;
        output += char;
      } else output += ' ';
      continue;
    }
    if (blockComment) {
      if (char === '*' && next === '/') {
        blockComment = false;
        output += '  ';
        index++;
      } else output += char === '\n' ? '\n' : ' ';
      continue;
    }
    if (quote) {
      output += char;
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      output += char;
    } else if (char === '/' && next === '/') {
      lineComment = true;
      output += '  ';
      index++;
    } else if (char === '/' && next === '*') {
      blockComment = true;
      output += '  ';
      index++;
    } else output += char;
  }
  return output;
}

function findMatchingBrace(source, openIndex) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = openIndex; index < source.length; index++) {
    const char = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') quote = char;
    else if (char === '{') depth++;
    else if (char === '}' && --depth === 0) return index;
  }
  return -1;
}

function lastDirectGeneratorBody(source, blockType) {
  const clean = stripJsComments(source);
  const escaped = blockType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `Arduino\\.forBlock\\s*\\[\\s*(['"])${escaped}\\1\\s*\\]\\s*=\\s*function\\s*\\([^)]*\\)\\s*\\{`,
    'g',
  );
  let body = null;
  for (const match of clean.matchAll(pattern)) {
    const open = match.index + match[0].lastIndexOf('{');
    const close = findMatchingBrace(clean, open);
    if (close >= 0) body = clean.slice(open + 1, close);
  }
  return body;
}

function staticSlots(block, blockContract) {
  const slots = new Map();
  for (const key of Object.keys(block).filter(name => /^args\d+$/.test(name))) {
    for (const arg of block[key] || []) if (arg?.name) slots.set(arg.name, arg.type);
  }
  for (const variant of blockContract?.variants || []) {
    for (const arg of variant?.appendArgs || []) if (arg?.name && arg?.type) slots.set(arg.name, arg.type);
  }
  return slots;
}

function blockArgs(block, blockContract) {
  const args = [];
  for (const key of Object.keys(block).filter(name => /^args\d+$/.test(name)).sort()) {
    args.push(...(block[key] || []));
  }
  const firstVariant = Array.isArray(blockContract?.variants) ? blockContract.variants[0] : null;
  args.push(...(firstVariant?.appendArgs || []));
  return args;
}

function defaultFieldValue(arg) {
  if (!arg) return undefined;
  if (arg.type === 'field_dropdown') {
    return Array.isArray(arg.options?.[0])
      ? String(arg.options[0][1])
      : String(arg.value ?? arg.name ?? 'VALUE');
  }
  if (arg.type === 'field_checkbox') return arg.checked === false ? 'FALSE' : 'TRUE';
  if (arg.type === 'field_number') return String(arg.value ?? 0);
  if (arg.type === 'field_variable') return arg.variable || String(arg.name || 'var').toLowerCase();
  if (arg.type === 'field_input') return arg.text || 'value';
  if (String(arg.type).startsWith('field_colour')) return arg.colour || '#000000';
  if (String(arg.type).startsWith('field_')) {
    return String(arg.text ?? arg.value ?? arg.variable ?? arg.name ?? 'value');
  }
  return arg.value === undefined ? undefined : String(arg.value);
}

function normalizeGeneratedCodePreview(value) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== 'string' || !raw.trim()) return null;
  return raw
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join(' ↵ ')
    .replace(/\s+/g, ' ')
    .trim();
}

function selectGeneratedCodePreview(returnValue, sideEffects) {
  const returned = normalizeGeneratedCodePreview(returnValue);
  if (returned) return returned;
  const nonLibrary = sideEffects.filter(effect => !['addLibrary', 'libraries_'].includes(effect.kind));
  const candidates = nonLibrary.length > 0 ? nonLibrary : sideEffects;
  const snippets = [];
  for (const effect of candidates) {
    const strings = effect.args.filter(value => typeof value === 'string');
    const preview = normalizeGeneratedCodePreview(strings.length > 0 ? strings[strings.length - 1] : null);
    if (preview && !snippets.includes(preview)) snippets.push(preview);
  }
  return snippets.length > 0 ? snippets.join(' ↵ ') : NO_DIRECT_PREVIEW;
}

function generatedCodePreviewArtifact(value) {
  const preview = String(value || '');
  if (/\bundefined\b/.test(preview)) return 'contains undefined from the synthetic environment';
  if (/\[object Object\]|function noop/.test(preview)) return 'contains a synthetic object/function representation';
  return null;
}

function probeGeneratorHandler(loaded, handler, block, blockContract) {
  const reads = [];
  const sideEffects = [];
  const args = blockArgs(block, blockContract);
  const argsByName = new Map(args.filter(arg => arg?.name).map(arg => [arg.name, arg]));
  const fields = new Map(args
    .filter(arg => arg?.name && String(arg.type).startsWith('field_'))
    .map(arg => [arg.name, arg]));
  const inputs = new Map(args
    .filter(arg => arg?.name && String(arg.type).startsWith('input_'))
    .map(arg => [arg.name, arg]));
  const fieldObject = name => {
    const arg = fields.get(name);
    if (!arg) return null;
    const value = defaultFieldValue(arg);
    return createNoopProxy({
      getText: () => value,
      getValue: () => value,
      getVariable: () => ({ name: value, getId: () => value }),
      setValidator: () => {},
      onFinishEditing_: null,
    });
  };
  // Stateful generators need a valid representative workspace. This describes
  // blocks and connections only; the real handler still performs all checks.
  const probeContext = blockContract?.generatorProbe;
  const contextErrors = validateGeneratorProbe(probeContext, new Map(args.filter(arg => arg?.name).map(arg => [arg.name, arg.type])));
  if (contextErrors.length > 0) return { reads, error: contextErrors.join('; '), generatedCode: NO_DIRECT_PREVIEW };
  const createFakeBlock = () => {
    const workspaceBlocks = [];
    const inputBlocks = new Map();
    const fakeBlock = createNoopProxy({
      id: `generator-coverage-${block.type}`,
      type: block.type,
      isInFlyout: false,
      isEnabled: () => true,
      isInsertionMarker: () => false,
      inputList: args.filter(arg => arg?.name).map(arg => ({ name: arg.name })),
      workspace: createNoopProxy({
        isFlyout: false,
        getAllBlocks: () => workspaceBlocks,
        getAllVariables: () => [],
        getBlocksByType: type => workspaceBlocks.filter(candidate => candidate.type === type),
        getVariable: () => null,
        getVariableById: id => ({ name: id || 'item', getId: () => id || 'item' }),
        createVariable: (name, type, id) => ({ name, type, getId: () => id || name }),
      }),
      getFieldValue: name => {
        reads.push({ kind: 'field', name });
        return defaultFieldValue(fields.get(name));
      },
      getField: name => {
        reads.push({ kind: 'field', name });
        return fieldObject(name);
      },
      getInput: name => inputs.has(name) ? createNoopProxy({ name }) : null,
      getInputTargetBlock: name => inputBlocks.get(name) || null,
      getParent: () => null,
      getSurroundParent: () => null,
      getNextBlock: () => null,
      getPreviousBlock: () => null,
      getVars: () => [],
      params_: [],
      arguments_: [],
      itemCount_: 0,
      inputCount_: 0,
      elseifCount_: 0,
      elseCount_: 0,
      outputConnection: block.output === undefined ? null : createNoopProxy(),
    });
    if (probeContext) {
      const companion = (type, id, parent = null) => ({
        type, id, workspace: fakeBlock.workspace, isInFlyout: false,
        isEnabled: () => true,
        isInsertionMarker: () => false,
        getParent: () => parent,
        getSurroundParent: () => parent,
      });
      workspaceBlocks.push(fakeBlock);
      for (const type of new Set(probeContext.workspaceBlocks || [])) {
        if (type !== block.type) workspaceBlocks.push(companion(type, 'probe-context-' + type));
      }
      for (const [name, type] of Object.entries(probeContext.inputBlocks || {})) {
        const child = companion(type, 'probe-input-' + name, fakeBlock);
        inputBlocks.set(name, child);
        workspaceBlocks.push(child);
      }
    }
    return fakeBlock;
  };
  const valueToCode = (_sourceBlock, name) => {
    reads.push({ kind: 'value', name });
    const arg = argsByName.get(name);
    if (!arg || arg.type !== 'input_value') return '';
    // Use the same example as the ABS column. These are representative probes,
    // not a compiler: fail explicitly when a nested expression needs runtime.
    const example = absArgExample(arg);
    const literal = /^(?:math_number|logic_boolean|text)\((.*)\)$/.exec(example);
    if (literal) return literal[1];
    throw new Error(`Generated-code preview requires runtime evaluation: ${example}`);
  };
  const statementToCode = (_sourceBlock, name) => {
    reads.push({ kind: 'statement', name });
    return inputs.get(name)?.type === 'input_statement' ? '' : '';
  };
  const captureSideEffect = (kind, values) => {
    sideEffects.push({ kind, args: Array.isArray(values) ? values : [] });
  };
  const capturingStore = kind => new Proxy(Object.create(null), {
    set(target, property, value) {
      target[property] = value;
      captureSideEffect(kind, [String(property), value]);
      return true;
    },
  });
  const codeMethods = Object.fromEntries([
    'addLibrary', 'addVariable', 'addFunction', 'addObject', 'addSetupBegin',
    'addSetup', 'addSetupEnd', 'addMacro', 'addLoopBegin', 'addLoop', 'addLoopEnd',
  ].map(name => [name, (...values) => captureSideEffect(name, values)]));
  const createGenerator = () => {
    const nameDb = createNoopProxy({
      getName: value => value || 'item',
      getDistinctName: value => value || 'item',
    });
    const generatorState = {
      valueToCode,
      statementToCode,
      getVariableName: value => String(value == null || value === '' ? 'item' : value),
      getValue: syntheticGetValue,
      nameDB: nameDb,
      nameDB_: nameDb,
      codeDict: { macros: Object.create(null) },
      INDENT: '  ',
      prefixLines: (text, prefix) => String(text || '')
        .split('\n')
        .map(line => line ? `${prefix || ''}${line}` : line)
        .join('\n'),
      ...codeMethods,
      definitions_: capturingStore('definitions_'),
      libraries_: capturingStore('libraries_'),
      variables_: capturingStore('variables_'),
      objects_: capturingStore('objects_'),
      functions_: capturingStore('functions_'),
      setups_: capturingStore('setups_'),
    };
    // Handler execution should not inherit the load-time no-op proxy's truthy
    // unknown properties. Real generators use undefined state to initialize
    // per-pass caches and to select compatibility fallbacks.
    return new Proxy(generatorState, {
      get(target, property) {
        if (Object.prototype.hasOwnProperty.call(target, property)) return target[property];
        if (typeof property === 'string' && property.startsWith('ORDER_')) return 0;
        return undefined;
      },
      set(target, property, value) {
        target[property] = value;
        return true;
      },
    });
  };
  let error = null;
  let returnValue = null;
  loaded.setActiveProbe({ valueToCode, statementToCode, captureSideEffect });
  try {
    for (let attempt = 0; attempt < 12; attempt++) {
      try {
        sideEffects.length = 0;
        // A failed attempt may mutate block/generator caches before revealing a
        // missing runtime global. Retry against a fresh representative state.
        returnValue = handler(createFakeBlock(), createGenerator());
        error = null;
        break;
      } catch (caught) {
        const message = caught && caught.message ? caught.message : String(caught);
        error = caught && caught.stack ? caught.stack : message;
        const missingGlobal = /^([A-Za-z_$][A-Za-z0-9_$]*) is not defined$/.exec(message);
        if (!missingGlobal) break;
        const name = missingGlobal[1];
        loaded.context[name] = name === 'isBlockConnected' || name.startsWith('is')
          ? () => true
          : () => undefined;
      }
    }
  } finally {
    loaded.setActiveProbe(null);
  }
  return {
    reads,
    error,
    generatedCode: selectGeneratedCodePreview(returnValue, sideEffects),
  };
}

function literalAccessorReads(functionBody) {
  const reads = [];
  if (!functionBody) return reads;
  const accessors = [
    { kind: 'field', pattern: /block\.(?:getFieldValue|getField)\s*\(\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]\s*\)/g },
    { kind: 'value', pattern: /(?:generator|Arduino)\.valueToCode\s*\(\s*block\s*,\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]/g },
    { kind: 'statement', pattern: /(?:generator|Arduino)\.statementToCode\s*\(\s*block\s*,\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]/g },
  ];
  for (const accessor of accessors) {
    for (const match of functionBody.matchAll(accessor.pattern)) reads.push({ kind: accessor.kind, name: match[1] });
  }
  const computedPrefixes = new Set();
  const computedPatterns = [
    /(?:valueToCode|statementToCode)\s*\(\s*block\s*,\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]\s*\+/g,
    /(?:valueToCode|statementToCode)\s*\(\s*block\s*,\s*`([A-Za-z_][A-Za-z0-9_]*)\$\{/g,
    /block\.(?:getFieldValue|getField)\s*\(\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]\s*\+/g,
    /block\.(?:getFieldValue|getField)\s*\(\s*`([A-Za-z_][A-Za-z0-9_]*)\$\{/g,
  ];
  for (const pattern of computedPatterns) {
    for (const match of functionBody.matchAll(pattern)) computedPrefixes.add(match[1]);
  }
  return reads.filter(read => !computedPrefixes.has(read.name));
}

function slotMismatch(read, slotType) {
  if (!slotType) return null;
  if (read.kind === 'field' && !slotType.startsWith('field_')) return `${read.name}: ${read.kind} accessor reads ${slotType}`;
  if (read.kind === 'value' && slotType !== 'input_value') return `${read.name}: ${read.kind} accessor reads ${slotType}`;
  if (read.kind === 'statement' && slotType !== 'input_statement') return `${read.name}: ${read.kind} accessor reads ${slotType}`;
  return null;
}

function accessorMatchesSlot(readKind, slotType) {
  return (readKind === 'field' && slotType.startsWith('field_'))
    || (readKind === 'value' && slotType === 'input_value')
    || (readKind === 'statement' && slotType === 'input_statement');
}

function generatedCodeTable(content) {
  const result = new Map();
  for (const line of String(content || '').split(/\r?\n/)) {
    const cells = line.split('|');
    if (cells.length < 7) continue;
    const type = cells[1].trim().match(/^`([^`]+)`$/)?.[1];
    if (!type) continue;
    let value = cells[5].trim();
    if (value.startsWith('`') && value.endsWith('`')) value = value.slice(1, -1);
    result.set(type, value
      .replace(/&#124;/g, '|')
      .replace(/\\`/g, '`')
      .replace(/\s+/g, ' ')
      .trim());
  }
  return result;
}

function isIntentionalWrapperDuplicate(source, type, count) {
  if (count !== 2 || !source.includes('Object.keys(Arduino.forBlock)')) return false;
  const prefixMatches = [...source.matchAll(/blockType\.indexOf\(\s*['"]([^'"]+)['"]\s*\)\s*!==\s*0/g)];
  return prefixMatches.some(match => type.startsWith(match[1]));
}

function hasRuntimeBlockDefinition(source, type) {
  const escaped = type.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const bracket = new RegExp(`Blockly\\.Blocks\\s*\\[\\s*(['"])${escaped}\\1\\s*\\]`).test(source);
  const property = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(type)
    && new RegExp(`Blockly\\.Blocks\\.${escaped}\\s*=`).test(source);
  return bracket || property;
}

function buildGeneratedCodePreviews(library, source, blocks, contract = null) {
  const loaded = loadGenerator(library, source);
  const noDirectContract = loadGeneratedCodeNoDirectContract();
  const previews = new Map();
  const errors = noDirectContract.errors.map(error => ({ blockType: '<contract>', error }));
  for (const block of allDocumentedBlocks(blocks, contract)) {
    const handler = loaded.handlers[block.type];
    if (typeof handler !== 'function') continue;
    const probe = probeGeneratorHandler(loaded, handler, block, blockContractFor(contract, block.type));
    if (probe.error) errors.push({ blockType: block.type, error: probe.error });
    else {
      const artifact = generatedCodePreviewArtifact(probe.generatedCode);
      if (artifact) errors.push({ blockType: block.type, error: artifact });
      else {
        const resolved = resolveGeneratedCodePreview(library, block.type, probe.generatedCode, noDirectContract);
        if (resolved.error) errors.push({ blockType: block.type, error: resolved.error });
        else previews.set(block.type, resolved.preview);
      }
    }
  }
  return { previews, errors, loadError: loaded.error };
}

function audit(targetLibraries = null) {
  const libraries = trackedLibraries();
  const trackedSet = new Set(libraries);
  const targetSet = targetLibraries == null ? null : new Set(targetLibraries);
  const unknownLibraries = targetSet == null
    ? []
    : [...targetSet].filter(library => !trackedSet.has(library));
  if (unknownLibraries.length > 0) {
    throw new Error(`Unknown or untracked libraries: ${unknownLibraries.join(', ')}`);
  }
  const globalBlockTypes = new Set();
  const globalBlockOwners = new Map();
  const libraryData = [];
  for (const library of libraries) {
    const directory = path.join(ROOT, library);
    const staticBlocks = readJson(path.join(directory, 'block.json'));
    const contract = loadLibraryContract(library);
    const blocks = allDocumentedBlocks(staticBlocks, contract);
    for (const block of blocks) {
      globalBlockTypes.add(block.type);
      if (!globalBlockOwners.has(block.type)) globalBlockOwners.set(block.type, new Set());
      globalBlockOwners.get(block.type).add(library);
    }
    const packagePath = path.join(directory, 'package.json');
    const toolboxPath = path.join(directory, 'toolbox.json');
    libraryData.push({
      library,
      directory,
      blocks,
      staticBlocks,
      runtimeTypes: new Set(runtimeBlockDefinitions(contract).map(block => block.type)),
      pkg: fs.existsSync(packagePath) ? readJson(packagePath) : {},
      toolboxTypes: fs.existsSync(toolboxPath) ? collectToolboxTypes(readJson(toolboxPath)) : new Set(),
      contract,
    });
  }

  const registrationContract = loadGeneratorRegistrationContract();
  const usedRegistrationContracts = new Set();
  const registrationContractErrors = [...registrationContract.errors];
  const noDirectContract = loadGeneratedCodeNoDirectContract();
  const usedNoDirectContracts = new Set();
  const generatedCodeContractErrors = [...noDirectContract.errors];
  const details = [];
  for (const data of libraryData) {
    if (targetSet && !targetSet.has(data.library)) continue;
    const generatorPath = path.join(data.directory, 'generator.js');
    const source = fs.existsSync(generatorPath) ? fs.readFileSync(generatorPath, 'utf8') : '';
    const loaded = loadGenerator(data.library, source);
    for (const type of data.runtimeTypes) {
      if (!hasRuntimeBlockDefinition(source, type)) {
        registrationContractErrors.push(`${data.library}/${type} is declared in runtimeBlocks but has no Blockly.Blocks definition`);
      }
    }
    const ownTypes = new Set(data.blocks.map(block => block.type));
    const registeredTypes = new Set(loaded.registrations.keys());
    const missingGenerators = [...ownTypes].filter(type => !registeredTypes.has(type)).sort();
    const agentInvisibleTypes = new Set(Object.entries(data.contract?.blocks || {})
      .filter(([, blockContract]) => blockContract?.agentVisible === false)
      .map(([type]) => type));
    const classifiedInvisibleMissingGenerators = missingGenerators
      .filter(type => agentInvisibleTypes.has(type));
    const unclassifiedMissingGenerators = missingGenerators
      .filter(type => !agentInvisibleTypes.has(type));
    const publicTypes = [...data.toolboxTypes].filter(type => ownTypes.has(type)).sort();
    const missingPublicGenerators = publicTypes.filter(type => !registeredTypes.has(type));
    const unresolvedToolboxTypes = [...data.toolboxTypes].filter(type => !globalBlockTypes.has(type)).sort();
    const allDuplicateAssignments = [...loaded.registrations]
      .filter(([, count]) => count > 1)
      .map(([type, count]) => ({ type, count }))
      .sort((left, right) => left.type.localeCompare(right.type));
    const intentionalDuplicateAssignments = allDuplicateAssignments
      .filter(entry => isIntentionalWrapperDuplicate(source, entry.type, entry.count));
    const duplicateAssignments = allDuplicateAssignments
      .filter(entry => !isIntentionalWrapperDuplicate(source, entry.type, entry.count));
    const orphanGenerators = [...registeredTypes].filter(type => !ownTypes.has(type)).sort();
    const classifiedOrphanGenerators = [];
    const unclassifiedOrphanGenerators = [];
    for (const type of orphanGenerators) {
      const key = `${data.library}\0${type}`;
      const declared = registrationContract.allowed.get(key);
      if (!declared) {
        unclassifiedOrphanGenerators.push(type);
        continue;
      }
      usedRegistrationContracts.add(key);
      classifiedOrphanGenerators.push({ type, classification: declared.classification });
      const runtimeDefined = hasRuntimeBlockDefinition(source, type);
      if (declared.classification === 'runtime-defined' && !runtimeDefined) {
        registrationContractErrors.push(`${data.library}/${type} is classified runtime-defined but has no Blockly.Blocks definition`);
      }
      if (declared.classification !== 'runtime-defined' && runtimeDefined) {
        registrationContractErrors.push(`${data.library}/${type} has a Blockly.Blocks definition but is classified ${declared.classification} instead of runtime-defined or runtimeBlocks`);
      }
      if (declared.classification === 'cross-library') {
        const owners = globalBlockOwners.get(type) || new Set();
        if (![...owners].some(owner => owner !== data.library)) {
          registrationContractErrors.push(`${data.library}/${type} is classified cross-library but no other tracked library defines it`);
        }
      }
    }
    const slotMismatches = [];
    const unknownSlotReads = [];
    const handlerProbeErrors = [];
    const generatedCodeMismatches = [];
    const classifiedNoDirectGeneratedCode = [];
    const readmePath = path.join(data.directory, 'readme_ai.md');
    const documentedCode = generatedCodeTable(fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf8') : '');
    for (const block of data.blocks) {
      const blockContract = blockContractFor(data.contract, block.type);
      const slots = staticSlots(block, blockContract);
      const compatibilitySlots = new Set((blockContract?.excludedRuntimeArgs || []).map(arg => arg?.name).filter(Boolean));
      const handler = loaded.handlers[block.type];
      const probe = typeof handler === 'function'
        ? probeGeneratorHandler(loaded, handler, block, blockContract)
        : { reads: [], error: null };
      // Keep lexical reads in the evidence set even when an environment-dependent
      // handler cannot finish in the synthetic workspace. The execution probe is
      // still needed for loop/metadata registrations that have no direct body.
      const handlerSource = typeof handler === 'function'
        ? Function.prototype.toString.call(handler)
        : '';
      // A shared handler may contain branches for several block types. Successful
      // execution is therefore more precise; lexical fallback is only used when
      // the synthetic environment cannot complete the handler.
      const lexicalReads = probe.error
        ? literalAccessorReads(stripJsComments(handlerSource))
        : [];
      const reads = [...probe.reads, ...lexicalReads];
      let expectedGeneratedCode = probe.generatedCode;
      if (probe.error) handlerProbeErrors.push({ blockType: block.type, error: probe.error });
      if (!probe.error && typeof handler === 'function') {
        const artifact = generatedCodePreviewArtifact(probe.generatedCode);
        if (artifact) handlerProbeErrors.push({ blockType: block.type, error: artifact });
        else {
          const resolved = resolveGeneratedCodePreview(data.library, block.type, probe.generatedCode, noDirectContract);
          if (resolved.error) handlerProbeErrors.push({ blockType: block.type, error: resolved.error });
          else {
            expectedGeneratedCode = resolved.preview;
            if (resolved.allowance) {
              usedNoDirectContracts.add(resolved.key);
              classifiedNoDirectGeneratedCode.push({
                blockType: block.type,
                classification: resolved.allowance.classification,
              });
            }
          }
        }
      }
      if (!probe.error && typeof handler === 'function' && !agentInvisibleTypes.has(block.type)
          && !handlerProbeErrors.some(entry => entry.blockType === block.type)) {
        const actual = documentedCode.get(block.type);
        if (actual !== expectedGeneratedCode) {
          generatedCodeMismatches.push({
            blockType: block.type,
            expected: expectedGeneratedCode,
            actual: actual === undefined ? '(missing row)' : actual,
          });
        }
      }
      const readsByName = new Map();
      for (const read of reads) {
        if (!readsByName.has(read.name)) readsByName.set(read.name, []);
        readsByName.get(read.name).push(read);
      }
      for (const [name, namedReads] of readsByName) {
        const slotType = slots.get(name);
        if (!slotType) {
          if (compatibilitySlots.has(name)) continue;
          unknownSlotReads.push({ blockType: block.type, name, accessors: [...new Set(namedReads.map(read => read.kind))] });
          continue;
        }
        // A mismatched secondary read is a deliberate compatibility fallback
        // when the same slot is also read with its current canonical accessor.
        if (namedReads.some(read => accessorMatchesSlot(read.kind, slotType))) continue;
        const mismatch = slotMismatch(namedReads[0], slotType);
        if (mismatch) slotMismatches.push({ blockType: block.type, detail: mismatch });
      }
    }
    details.push({
      library: data.library,
      hiddenPackage: data.pkg.hide === true,
      generatorLoadError: loaded.error,
      definedBlocks: ownTypes.size,
      toolboxBlocks: data.toolboxTypes.size,
      registeredGenerators: registeredTypes.size,
      missingGenerators,
      classifiedInvisibleMissingGenerators,
      unclassifiedMissingGenerators,
      missingPublicGenerators,
      unresolvedToolboxTypes,
      duplicateAssignments,
      intentionalDuplicateAssignments,
      orphanGenerators,
      classifiedOrphanGenerators,
      unclassifiedOrphanGenerators,
      slotMismatches,
      unknownSlotReads,
      handlerProbeErrors,
      generatedCodeMismatches,
      classifiedNoDirectGeneratedCode,
    });
  }

  for (const [key] of registrationContract.allowed) {
    const [library, type] = key.split('\0');
    if (targetSet && !targetSet.has(library)) continue;
    if (!usedRegistrationContracts.has(key)) {
      registrationContractErrors.push(`stale generator-only allowance ${library}/${type}`);
    }
  }
  for (const [key] of noDirectContract.allowed) {
    const [library, type] = key.split('\0');
    if (targetSet && !targetSet.has(library)) continue;
    if (!usedNoDirectContracts.has(key)) {
      generatedCodeContractErrors.push(`stale generated-code no-direct allowance ${library}/${type}`);
    }
  }

  const visibleDetails = details.filter(item => !item.hiddenPackage);
  const orphanClassifications = Object.fromEntries([...GENERATOR_ONLY_CLASSIFICATIONS]
    .map(classification => [classification, details.reduce((sum, item) => sum
      + item.classifiedOrphanGenerators.filter(entry => entry.classification === classification).length, 0)]));
  return {
    libraries: details.length,
    generatorLoadErrors: details.filter(item => item.generatorLoadError).length,
    missingGenerators: details.reduce((sum, item) => sum + item.missingGenerators.length, 0),
    classifiedInvisibleMissingGenerators: details.reduce((sum, item) => sum + item.classifiedInvisibleMissingGenerators.length, 0),
    unclassifiedMissingGenerators: details.reduce((sum, item) => sum + item.unclassifiedMissingGenerators.length, 0),
    missingPublicGenerators: visibleDetails.reduce((sum, item) => sum + item.missingPublicGenerators.length, 0),
    unresolvedVisibleToolboxTypes: visibleDetails.reduce((sum, item) => sum + item.unresolvedToolboxTypes.length, 0),
    duplicateAssignments: details.reduce((sum, item) => sum + item.duplicateAssignments.length, 0),
    intentionalDuplicateAssignments: details.reduce((sum, item) => sum + item.intentionalDuplicateAssignments.length, 0),
    orphanGenerators: details.reduce((sum, item) => sum + item.orphanGenerators.length, 0),
    classifiedOrphanGenerators: details.reduce((sum, item) => sum + item.classifiedOrphanGenerators.length, 0),
    unclassifiedOrphanGenerators: details.reduce((sum, item) => sum + item.unclassifiedOrphanGenerators.length, 0),
    orphanClassifications,
    registrationContractErrors,
    generatedCodeContractErrors,
    classifiedNoDirectGeneratedCode: details.reduce((sum, item) => sum + item.classifiedNoDirectGeneratedCode.length, 0),
    slotMismatches: details.reduce((sum, item) => sum + item.slotMismatches.length, 0),
    unknownSlotReads: details.reduce((sum, item) => sum + item.unknownSlotReads.length, 0),
    handlerProbeErrors: details.reduce((sum, item) => sum + item.handlerProbeErrors.length, 0),
    generatedCodeMismatches: details.reduce((sum, item) => sum + item.generatedCodeMismatches.length, 0),
    details,
  };
}

function parseCliArgs(argv) {
  const options = { json: false, strict: false, allowGeneratedCodeMismatches: false, libraries: [] };
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === '--json') options.json = true;
    else if (arg === '--strict') options.strict = true;
    else if (arg === '--allow-generated-code-mismatches') options.allowGeneratedCodeMismatches = true;
    else if (arg === '--library') {
      if (!argv[index + 1]) throw new Error('--library requires a library name');
      options.libraries.push(argv[++index]);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  return options;
}

function strictFailureCount(report, options = {}) {
  return report.generatorLoadErrors
    + report.missingPublicGenerators
    + report.unclassifiedMissingGenerators
    + report.unresolvedVisibleToolboxTypes
    + report.duplicateAssignments
    + report.unclassifiedOrphanGenerators
    + report.registrationContractErrors.length
    + report.generatedCodeContractErrors.length
    + report.slotMismatches
    + report.unknownSlotReads
    + report.handlerProbeErrors
    + (options.allowGeneratedCodeMismatches ? 0 : report.generatedCodeMismatches);
}

function main() {
  let options;
  try {
    options = parseCliArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`[generator-coverage:error] ${error.message}`);
    process.exitCode = 1;
    return;
  }
  let report;
  try {
    report = audit(options.libraries.length > 0 ? options.libraries : null);
  } catch (error) {
    console.error(`[generator-coverage:error] ${error.message}`);
    process.exitCode = 1;
    return;
  }
  if (options.json) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`Tracked libraries: ${report.libraries}`);
    console.log(`Generator load errors: ${report.generatorLoadErrors}`);
    console.log(`Blocks without generators (all/public visible): ${report.missingGenerators}/${report.missingPublicGenerators}`);
    console.log(`Missing generators classified agent-invisible/unclassified: ${report.classifiedInvisibleMissingGenerators}/${report.unclassifiedMissingGenerators}`);
    console.log(`Unresolved visible toolbox types: ${report.unresolvedVisibleToolboxTypes}`);
    console.log(`Duplicate generator assignments (unexpected/wrapper): ${report.duplicateAssignments}/${report.intentionalDuplicateAssignments}`);
    console.log(`Generator-only registrations (classified/unclassified): ${report.classifiedOrphanGenerators}/${report.unclassifiedOrphanGenerators}`);
    console.log(`Generator-only classifications: ${Object.entries(report.orphanClassifications).map(([key, value]) => `${key}=${value}`).join(', ')}`);
    console.log(`Generator registration contract errors: ${report.registrationContractErrors.length}`);
    console.log(`Generated-code no-direct classifications/errors: ${report.classifiedNoDirectGeneratedCode}/${report.generatedCodeContractErrors.length}`);
    console.log(`Static generator slot mismatches: ${report.slotMismatches}`);
    console.log(`Generator reads of undeclared literal slots: ${report.unknownSlotReads}`);
    console.log(`Synthetic handler probe errors: ${report.handlerProbeErrors}`);
    console.log(`Generated-code documentation mismatches: ${report.generatedCodeMismatches}`);
    for (const item of report.details) {
      const findings = [];
      if (item.generatorLoadError) findings.push(`load=${item.generatorLoadError}`);
      if (item.missingPublicGenerators.length) findings.push(`public-missing=${item.missingPublicGenerators.join(',')}`);
      if (item.unclassifiedMissingGenerators.length) findings.push(`unclassified-missing=${item.unclassifiedMissingGenerators.join(',')}`);
      if (item.classifiedInvisibleMissingGenerators.length) findings.push(`agent-invisible-missing=${item.classifiedInvisibleMissingGenerators.join(',')}`);
      if (!item.hiddenPackage && item.unresolvedToolboxTypes.length) findings.push(`unresolved-toolbox=${item.unresolvedToolboxTypes.join(',')}`);
      if (item.duplicateAssignments.length) findings.push(`duplicates=${item.duplicateAssignments.map(entry => `${entry.type}x${entry.count}`).join(',')}`);
      if (item.intentionalDuplicateAssignments.length) findings.push(`wrapper-reassignments=${item.intentionalDuplicateAssignments.length}`);
      if (item.unclassifiedOrphanGenerators.length) findings.push(`unclassified-generator-only=${item.unclassifiedOrphanGenerators.join(',')}`);
      if (item.slotMismatches.length) findings.push(`slot-mismatch=${item.slotMismatches.map(entry => `${entry.blockType}(${entry.detail})`).join(',')}`);
      if (item.unknownSlotReads.length) findings.push(`undeclared-slots=${item.unknownSlotReads.map(entry => `${entry.blockType}.${entry.name}[${entry.accessors.join('+')}]`).join(',')}`);
      if (item.generatedCodeMismatches.length) findings.push(`generated-code=${item.generatedCodeMismatches.map(entry => entry.blockType).join(',')}`);
      if (findings.length) console.log(`- ${item.library}${item.hiddenPackage ? ' [hidden]' : ''}: ${findings.join('; ')}`);
    }
  }
  if (options.allowGeneratedCodeMismatches && report.generatedCodeMismatches > 0) {
    console.log(`Generated-code documentation mismatches ignored by this run: ${report.generatedCodeMismatches}`);
  }
  const strictFailures = strictFailureCount(report, options);
  if (options.strict && strictFailures > 0) process.exitCode = 1;
}

if (require.main === module) main();

module.exports = {
  audit,
  buildGeneratedCodePreviews,
  collectToolboxTypes,
  literalAccessorReads,
  loadGenerator,
  normalizeGeneratedCodePreview,
  generatedCodePreviewArtifact,
  probeGeneratorHandler,
  parseCliArgs,
  strictFailureCount,
};

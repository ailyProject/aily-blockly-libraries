const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  buildGeneratedCodePreviews,
  loadGenerator,
  probeGeneratorHandler,
} = require('../.scripts/check-library-generator-coverage');
const { loadLibraryContract } = require('../.scripts/readme-library-contracts');
const { validateAiContract } = require('../.scripts/check-readme-compliance');

const root = path.resolve(__dirname, '..');
const library = 'chipIntelli_CWSL';
const source = fs.readFileSync(path.join(root, library, 'generator.js'), 'utf8');
const blocks = JSON.parse(fs.readFileSync(path.join(root, library, 'block.json'), 'utf8'));
const initType = 'chipintelli_cwsl_voice_learning_init';
const wakeType = 'chipintelli_asr_set_wake_word';
const fixedCommandType = 'chipintelli_asr_command_fixed_id';
const managedTypes = [initType, ...['request', 'busy', 'ready', 'error']
  .map(name => 'chipintelli_cwsl_voice_learning_' + name)];

function probe(type, blockContract) {
  const loaded = loadGenerator(library, source);
  assert.equal(loaded.error, null);
  const block = blocks.find(candidate => candidate.type === type);
  assert.ok(block, 'real block definition exists: ' + type);
  return probeGeneratorHandler(loaded, loaded.handlers[type], block, blockContract);
}

function contractFor(type) {
  const contract = loadLibraryContract(library);
  assert.ok(contract?.blocks?.[type]?.generatorProbe, 'declared generator context for ' + type);
  return structuredClone(contract.blocks[type]);
}

test('all managed CWSL handlers generate code with their declared workspace context', () => {
  const contract = loadLibraryContract(library);
  assert.deepEqual(validateAiContract(contract, blocks), []);
  for (const type of managedTypes) {
    const result = probe(type, contractFor(type));
    assert.equal(result.error, null, type);
    assert.ok(result.generatedCode);
    assert.doesNotMatch(result.generatedCode, /No direct code emitted|undefined|\[object Object\]/);
  }
  const built = buildGeneratedCodePreviews(library, source, blocks, contract);
  assert.deepEqual(built.errors, []);
  assert.match(built.previews.get(initType), /ailyChipIntelliVoiceLearning\.begin\(/);
  assert.equal(built.previews.get(managedTypes[1]), 'ailyChipIntelliVoiceLearning.request(1);');
  assert.equal(built.previews.get(managedTypes[2]), 'ailyChipIntelliCWSLVoiceBusy()');
  assert.equal(built.previews.get(managedTypes[3]), 'ailyChipIntelliVoiceLearning.ready');
  assert.equal(built.previews.get(managedTypes[4]), 'String(ailyChipIntelliVoiceLearning.error)');
});

test('managed CWSL handlers still reject an unconfigured synthetic workspace', () => {
  for (const type of managedTypes) {
    const configured = contractFor(type);
    delete configured.generatorProbe;
    const result = probe(type, configured);
    assert.match(result.error, /请在初始化中添加.*语音自学习控制器/, type);
  }
});

test('managed CWSL probes retain wake-word and fixed-command requirements', () => {
  const noWakeWord = contractFor(initType);
  noWakeWord.generatorProbe.workspaceBlocks = [];
  assert.match(probe(initType, noWakeWord).error, /需要显式的 ASR 唤醒词/);

  const noFixedCommand = contractFor(initType);
  delete noFixedCommand.generatorProbe.inputBlocks;
  assert.match(probe(initType, noFixedCommand).error, /必须连接.*固定 ID 命令词/);

  const wrongCommand = contractFor(initType);
  wrongCommand.generatorProbe.inputBlocks.COMMAND_ID = 'math_number';
  assert.match(probe(initType, wrongCommand).error, /必须连接.*固定 ID 命令词/);
});

test('CWSL generation still rejects mixing raw controls with a managed controller', () => {
  const managed = contractFor(initType);
  managed.generatorProbe.workspaceBlocks.push('chipintelli_cwsl_init');
  assert.match(probe(initType, managed).error, /不能混用.*chipintelli_cwsl_init/);

  const raw = probe('chipintelli_cwsl_init', {
    generatorProbe: { workspaceBlocks: [initType, wakeType] },
  });
  assert.match(raw.error, /不能混用.*chipintelli_cwsl_init/);
});

test('a probe without context keeps the existing empty workspace and disconnected inputs', () => {
  const block = { type: 'default_context', args0: [{ type: 'input_value', name: 'VALUE' }] };
  const loaded = loadGenerator('default-context', `
    Arduino.forBlock.default_context = function(block) {
      if (block.workspace.getAllBlocks(false).length !== 0) throw new Error('workspace changed');
      if (block.workspace.getBlocksByType('default_context').length !== 0) throw new Error('lookup changed');
      if (block.getInputTargetBlock('VALUE') !== null) throw new Error('input changed');
      return 'defaultContext();';
    };
  `);
  const result = probeGeneratorHandler(loaded, loaded.handlers.default_context, block);
  assert.equal(result.error, null);
  assert.equal(result.generatedCode, 'defaultContext();');
});

test('configured probes share an active workspace with their connected input blocks', () => {
  const block = { type: 'context_owner', args0: [{ type: 'input_value', name: 'VALUE' }] };
  const loaded = loadGenerator('shared-context', `
    Arduino.forBlock.context_owner = function(block) {
      const all = block.workspace.getAllBlocks(false);
      if (all.length !== 3 || !all.includes(block)) throw new Error('incorrect workspace members');
      const child = block.getInputTargetBlock('VALUE');
      if (!child || child.type !== '${fixedCommandType}' || !all.includes(child)) throw new Error('missing child');
      if (block.getInputTargetBlock('UNKNOWN') !== null) throw new Error('unknown input connected');
      if (child.getParent() !== block) throw new Error('incorrect child parent');
      const companions = block.workspace.getBlocksByType('${wakeType}');
      if (companions.length !== 1 || companions[0].getParent() !== null) throw new Error('duplicate companion');
      for (const candidate of all) {
        if (candidate.workspace !== block.workspace) throw new Error('workspace mismatch');
        if (!candidate.isEnabled() || candidate.isInsertionMarker()) throw new Error('inactive member');
      }
      return 'configuredContext();';
    };
  `);
  const result = probeGeneratorHandler(loaded, loaded.handlers.context_owner, block, {
    generatorProbe: {
      workspaceBlocks: [block.type, wakeType, wakeType],
      inputBlocks: { VALUE: fixedCommandType },
    },
  });
  assert.equal(result.error, null);
  assert.equal(result.generatedCode, 'configuredContext();');
});

test('invalid probe context fails explicitly instead of ignoring undeclared inputs or block types', () => {
  const block = {
    type: 'invalid_context',
    args0: [
      { type: 'input_value', name: 'VALUE' },
      { type: 'input_statement', name: 'BODY' },
      { type: 'field_input', name: 'LABEL', text: 'text' },
    ],
  };
  const loaded = loadGenerator('invalid-context', `
    Arduino.forBlock.invalid_context = function() { return 'mustNotPass();'; };
  `);
  for (const context of [
    {},
    { workspaceBlocks: [] },
    { inputBlocks: {} },
    { inputBlocks: { UNKNOWN: fixedCommandType } },
    { inputBlocks: { BODY: fixedCommandType } },
    { inputBlocks: { LABEL: fixedCommandType } },
    { inputBlocks: { VALUE: '' } },
    { inputBlocks: { VALUE: null } },
    { workspaceBlocks: [''] },
    { workspaceBlocks: [null] },
    { workspaceBlocks: ['invalid type'] },
    { workspaceBlocks: 'context_owner' },
    { inputBlocks: [] },
    { inputBlocks: { VALUE: 'invalid type' } },
    { ignoredContext: true },
  ]) {
    const result = probeGeneratorHandler(loaded, loaded.handlers.invalid_context, block, { generatorProbe: context });
    assert.ok(result.error, JSON.stringify(context));
    assert.match(result.error, /generatorProbe|probe context/i);
    const errors = validateAiContract({
      schemaVersion: 1,
      blocks: { [block.type]: { generatorProbe: context } },
    }, [block]);
    assert.ok(errors.length > 0, 'schema rejects ' + JSON.stringify(context));
    assert.ok(errors.some(error => /generatorProbe|probe context/i.test(error)), errors.join('\n'));
  }
});

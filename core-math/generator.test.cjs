'use strict';

// Run: node --test core-math/generator.test.cjs
// Uses real Blockly and the Arduino generator from AILY_BLOCKLY_ROOT or the
// sibling aily-blockly checkout.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '..');
const host = path.resolve(process.env.AILY_BLOCKLY_ROOT || path.join(root, '../aily-blockly'));
const hostRequire = createRequire(path.join(host, 'package.json'));
const Blockly = hostRequire('blockly');
hostRequire('blockly/blocks');
const { buildSync } = hostRequire('esbuild');
const compiled = buildSync({
    stdin: { resolveDir: host, loader: 'ts', contents:
        "import './src/app/editors/blockly-editor/utils/blockly-legacy-library-compat';" +
        "export { createArduinoGenerator } from './src/app/editors/blockly-editor/components/blockly/generators/arduino/arduino';" },
    bundle: true, packages: 'external', platform: 'node', format: 'cjs', write: false,
}).outputFiles[0].text;
const moduleState = { exports: {} };
vm.runInNewContext(compiled, { module: moduleState, exports: moduleState.exports, require: hostRequire, TextEncoder });
const { createArduinoGenerator } = moduleState.exports;

for (const [library, types] of [
    ['core-loop', ['arduino_setup', 'arduino_loop']],
    ['core-math', ['math_number', 'math_arithmetic', 'math_change']],
]) {
    const definitions = JSON.parse(fs.readFileSync(path.join(root, library, 'block.json'), 'utf8'))
        .filter(block => types.includes(block.type));
    for (const definition of definitions) delete Blockly.Blocks[definition.type];
    Blockly.defineBlocksWithJsonArray(definitions);
}

function fixture() {
    const workspace = new Blockly.Workspace();
    const generator = createArduinoGenerator();
    const context = vm.createContext({ Arduino: generator, Blockly, console });
    for (const library of ['core-loop', 'core-math']) {
        vm.runInContext(fs.readFileSync(path.join(root, library, 'generator.js'), 'utf8'), context);
    }
    return { workspace, code: () => generator.workspaceToCode(workspace) };
}

function number(workspace, value) {
    const block = workspace.newBlock('math_number');
    block.setFieldValue(String(value), 'NUM');
    return block;
}

function change(workspace, operation, input) {
    const variable = workspace.createVariable('total', '', 'total-id');
    const loop = workspace.newBlock('arduino_loop');
    const block = workspace.newBlock('math_change');
    block.setFieldValue(variable.getId(), 'VAR');
    block.setFieldValue(operation, 'OP');
    if (input) block.getInput('DELTA').connection.connect(input.outputConnection);
    loop.getInput('ARDUINO_LOOP').connection.connect(block.previousConnection);
    return block;
}

for (const [operation, operator] of [['ADD', '+='], ['MINUS', '-='], ['MULTIPLY', '*='], ['DIVIDE', '/=']]) {
    test(operation + ' generates the selected compound operation and survives reload', () => {
        const f = fixture();
        const reloaded = fixture();
        try {
            change(f.workspace, operation, number(f.workspace, 2.5));
            const code = f.code();
            assert.ok(code.includes('total ' + operator + ' 2.5;'), code);
            const saved = Blockly.serialization.workspaces.save(f.workspace);
            Blockly.serialization.workspaces.load(saved, reloaded.workspace);
            assert.equal(reloaded.code(), code);
            assert.equal(reloaded.workspace.getBlocksByType('math_change')[0].getFieldValue('OP'), operation);
        } finally { f.workspace.dispose(); reloaded.workspace.dispose(); }
    });
}

test('compound operand accepts an expression and empty input retains the default one', () => {
    const f = fixture();
    const empty = fixture();
    try {
        const expression = f.workspace.newBlock('math_arithmetic');
        expression.setFieldValue('ADD', 'OP');
        expression.getInput('A').connection.connect(number(f.workspace, 2).outputConnection);
        expression.getInput('B').connection.connect(number(f.workspace, 3).outputConnection);
        change(f.workspace, 'MULTIPLY', expression);
        assert.ok(f.code().includes('total *= 2 + 3;'));
        change(empty.workspace, 'DIVIDE');
        assert.ok(empty.code().includes('total /= 1;'));
    } finally { f.workspace.dispose(); empty.workspace.dispose(); }
});

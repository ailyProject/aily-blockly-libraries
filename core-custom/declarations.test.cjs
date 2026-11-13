'use strict';

// Run with node --test core-custom/declarations.test.cjs.
// Uses the real Blockly workspace and Arduino generator from a sibling
// aily-blockly checkout, or AILY_BLOCKLY_ROOT.
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
const { buildSync } = hostRequire('esbuild');

function loadHostModule(relative) {
    const source = buildSync({
        entryPoints: [path.join(host, relative)], bundle: true,
        packages: 'external', platform: 'node', format: 'cjs', write: false,
    }).outputFiles[0].text;
    const module = { exports: {} };
    vm.runInNewContext(source, { module, exports: module.exports, require: hostRequire, TextEncoder });
    return module.exports;
}

loadHostModule('src/app/editors/blockly-editor/components/blockly/custom-field/field-multilineinput.ts');
const { createArduinoGenerator } = loadHostModule(
    'src/app/editors/blockly-editor/components/blockly/generators/arduino/arduino.ts');
for (const library of ['core-loop', 'core-custom']) {
    const definitions = JSON.parse(fs.readFileSync(path.join(root, library, 'block.json'), 'utf8'));
    for (const definition of definitions) delete Blockly.Blocks[definition.type];
    Blockly.defineBlocksWithJsonArray(definitions);
}

function fixture() {
    const generator = createArduinoGenerator();
    const context = vm.createContext({ Arduino: generator, Blockly, console, setTimeout });
    for (const library of ['core-loop', 'core-custom']) {
        vm.runInContext(fs.readFileSync(path.join(root, library, 'generator.js'), 'utf8'), context);
    }
    const workspace = new Blockly.Workspace();
    return { workspace, generator, code: () => generator.workspaceToCode(workspace) };
}

function declarations(workspace) {
    return [
        ['custom_macro', { NAME: 'LED_PIN', VALUE: '13' }],
        ['custom_library', { LIB_NAME: 'Wire.h' }],
        ['custom_insert_code', { POSITION: 'variable', CODE: 'int counter = 0;' }],
        ['custom_insert_code', { POSITION: 'object', CODE: 'Object device;' }],
        ['custom_insert_code', { POSITION: 'function', CODE: 'void helper() {}' }],
    ].map(([type, fields]) => {
        const block = workspace.newBlock(type);
        for (const [name, value] of Object.entries(fields)) block.setFieldValue(value, name);
        return block;
    });
}

function connect(group, blocks) {
    let connection = group.getInput('DECLARATIONS').connection;
    for (const block of blocks) {
        connection.connect(block.previousConnection);
        connection = block.nextConnection;
    }
}

test('declaration group traverses the full stack and preserves generation regions', () => {
    const f = fixture();
    try {
        const group = f.workspace.newBlock('custom_declaration_group');
        const blocks = declarations(f.workspace);
        connect(group, blocks);
        f.workspace.newBlock('arduino_setup');
        f.workspace.newBlock('arduino_loop');
        const code = f.code();
        for (const text of ['#define LED_PIN 13', '#include <Wire.h>', 'int counter = 0;', 'Object device;', 'void helper() {}']) {
            assert.equal(code.split(text).length - 1, 1, text + ' generated once');
            assert.ok(code.indexOf(text) < code.indexOf('void setup()'), text + ' remains global');
        }
        assert.equal(blocks[0].getParent(), group);
        assert.equal(blocks[4].getRootBlock(), group);
        assert.equal(group.previousConnection, null);
        assert.equal(group.nextConnection, null);
    } finally { f.workspace.dispose(); }
});

test('save and reload retain the declaration stack and generated program', () => {
    const f = fixture();
    const restored = fixture();
    try {
        const group = f.workspace.newBlock('custom_declaration_group');
        connect(group, declarations(f.workspace));
        const before = f.code();
        const state = Blockly.serialization.workspaces.save(f.workspace);
        Blockly.serialization.workspaces.load(state, restored.workspace);
        assert.equal(restored.workspace.getTopBlocks(false).length, 1);
        assert.equal(restored.workspace.getAllBlocks(false).length, 6);
        assert.equal(restored.code(), before);
    } finally { f.workspace.dispose(); restored.workspace.dispose(); }
});

test('legacy standalone declaration state remains valid', () => {
    const f = fixture();
    try {
        Blockly.serialization.workspaces.load({ blocks: { blocks: [
            { type: 'custom_macro', fields: { NAME: 'OLD_PIN', VALUE: '8' } },
            { type: 'custom_library', fields: { LIB_NAME: 'SPI.h' } },
            { type: 'custom_insert_code', fields: { POSITION: 'variable', CODE: 'int legacy = 1;' } },
        ] } }, f.workspace);
        assert.equal(f.workspace.getTopBlocks(false).length, 3);
        const code = f.code();
        assert.ok(code.includes('#define OLD_PIN 8'));
        assert.ok(code.includes('#include <SPI.h>'));
        assert.ok(code.includes('int legacy = 1;'));
    } finally { f.workspace.dispose(); }
});

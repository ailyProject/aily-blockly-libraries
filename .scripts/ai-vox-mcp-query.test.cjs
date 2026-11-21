'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const program = fs.readFileSync(path.join(__dirname, '..', 'ai-vox', 'generator.js'), 'utf8');

function startGenerator() {
    const Blockly = {
        INPUT_VALUE: 1,
        Extensions: { isRegistered: () => false, register() {}, registerMutator() {} },
    };
    const Arduino = { ORDER_ATOMIC: 0, forBlock: {} };
    vm.runInNewContext(program, { Arduino, Blockly, window: {}, console: { log() {}, warn() {} }, registerVariableToBlockly() {} });
    const setup = new Map();
    const generator = {
        ORDER_ATOMIC: 0,
        valueToCode: (block, name) => block.code[name],
        addSetup: (name, code) => setup.set(name, code),
        addObject() {},
    };
    const fields = { VAR: 'value', TYPE: 'Number' };
    const [bounds] = Arduino.forBlock.aivox_mcp_control_param({
        getFieldValue: name => fields[name], getField: () => undefined, code: { MIN: '12', MAX: '85' },
    }, generator);
    const register = (blocks, name = 'volume') => {
        Arduino.forBlock.aivox_mcp_register_control_command({
            workspace: { getBlocksByType: type => blocks.filter(block => block.type === type) },
            inputList: [{ type: Blockly.INPUT_VALUE, name: 'INPUT0' }, { type: Blockly.INPUT_VALUE, name: 'INPUT1' }],
            code: { NAME: `"${name}", "Speaker volume"`, INPUT0: bounds, INPUT1: '"mute", ai_vox::ParamSchema<bool>{.default_value = std::nullopt},' },
        }, generator);
        return { get: setup.get(`aivox_add_mcp_tool_get_${name}`), set: setup.get(`aivox_add_mcp_tool_set_${name}`) };
    };
    return { register, emit: block => Arduino.forBlock[block.type](block, generator) };
}

function getter(service, value, descendants = [], enabled = true) {
    return {
        type: 'aivox_update_mcp_control_state_new',
        isEnabled: () => enabled,
        getInheritedDisabled: () => false,
        getField: name => ({ getText: () => name === 'VAR' ? service : 'value' }),
        getInputTargetBlock: () => ({ getDescendants: () => descendants }),
        code: { STATE: value },
    };
}

function readParameter(name) {
    return {
        type: 'aivox_control_message_event_fuction',
        isEnabled: () => true,
        getParent: () => null,
        getField: field => ({ getText: () => field === 'VAR' ? 'volume' : name }),
        code: {},
    };
}

const rawExpression = code => ({ type: 'custom_code2', getFieldValue: name => name === 'CODE' ? code : undefined });

test('state queries have an empty parameter declaration while setters retain typed bounds', () => {
    const runtime = startGenerator();
    const state = getter('volume', 'volume_value', [rawExpression('volume_value')]);
    const otherService = getter('other', 'ignored', [readParameter('value')]);
    const disabled = getter('volume', 'ignored', [readParameter('value')], false);
    const { get, set } = runtime.register([state, otherService, disabled]);
    assert.match(get, /AddMcpTool\("self\.volume\.get",\s*"Read current state: Speaker volume", \{\}\);/);
    assert.match(set, /AddMcpTool\("self\.volume\.set"[\s\S]*\.min = 12, \.max = 85/);
    assert.match(set, /"mute", ai_vox::ParamSchema<bool>/);
    assert.match(runtime.emit(state), /SendMcpCallResponse\(id, volume_value\)/);
    assert.doesNotMatch(runtime.emit(state), /param\.at\(|const auto volume_value/);
});

test('legacy saved query expressions keep arguments they actually consume', () => {
    const runtime = startGenerator();
    const parameter = readParameter('value');
    const expression = `${runtime.emit(parameter)[0]} + 1`;
    const state = getter('volume', expression, [{ type: 'math_arithmetic' }, parameter]);
    const { get, set } = runtime.register([state]);
    assert.match(get, /"value", ai_vox::ParamSchema<int64_t>\{\.default_value = std::nullopt, \.min = 12, \.max = 85\}/);
    assert.doesNotMatch(get, /"mute"/);
    assert.match(set, /"mute"/);
    assert.match(runtime.emit(state), /SendMcpCallResponse\(id, std::get<int64_t>\(param\.at\("value"\)\) \+ 1\)/);
});

test('legacy inline C++ that consumes the callback map keeps its declaration', () => {
    const runtime = startGenerator();
    const expression = 'readRequestedValue(param, selected_key)';
    const state = getter('volume', expression, [rawExpression(expression)]);
    const { get } = runtime.register([state]);
    assert.match(get, /"value", ai_vox::ParamSchema<int64_t>/);
    assert.match(get, /"mute", ai_vox::ParamSchema<bool>/);
    assert.match(runtime.emit(state), /SendMcpCallResponse\(id, readRequestedValue\(param, selected_key\)\)/);
});

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const source = fs.readFileSync(path.join(__dirname, 'generator.js'), 'utf8');

function fixture(staticName, dynamicName) {
  const logs = [];
  const listeners = [];
  const models = [];
  const dynamic = { name: dynamicName, contents: 'PROCEDURE' };
  const variableCategory = { name: staticName, contents: [{ kind: 'block', type: 'variable_define' }] };
  const categories = [dynamic, { name: 'Native variables', contents: 'VARIABLE' }, variableCategory];
  const items = categories.map(category => ({ name_: category.name, getContents: () => category.contents }));
  const toolbox = {
    isVisible_: true,
    getToolboxItems: () => items,
    setSelectedItem(item) { this.selected = item; },
  };
  const workspace = {
    options: { languageTree: { kind: 'categoryToolbox', contents: categories } },
    addChangeListener: listener => listeners.push(listener),
    getToolbox: () => toolbox,
    updateToolbox: () => {},
    getAllVariables: () => models,
    getAllBlocks: () => [],
    getVariable: name => models.find(model => model.name === name),
    createVariable(name, type) {
      const id = 'variable-' + models.length;
      const model = { name, type, getId: () => id };
      models.push(model);
      return model;
    },
    renameVariableById(id, name) { models.find(model => model.getId() === id).name = name; },
  };
  const context = vm.createContext({
    window: {}, Arduino: { forBlock: {} },
    Blockly: {
      getMainWorkspace: () => workspace, Msg: {},
      Events: { FINISHED_LOADING: 'loaded', VAR_DELETE: 'delete-variable', BLOCK_DELETE: 'delete-block' },
      Variables: { nameUsedWithAnyType: () => false },
    },
    console: { log: (...args) => logs.push(args), warn: (...args) => logs.push(args) },
  });
  vm.runInContext(source, context, { filename: 'core-variables/generator.js' });
  return { context, workspace, toolbox, models, listeners, logs, variableCategory, dynamic, items };
}

for (const staticName of ['Variables', '变量']) {
  for (const dynamicName of ['Functions', 'Variables']) {
    test(`variable toolbox operations skip dynamic callbacks: ${staticName}, ${dynamicName}`, () => {
      const f = fixture(staticName, dynamicName);
      f.context.addVariableToToolbox({ workspace: f.workspace }, 'level');
      assert.equal(f.models[0]?.name, 'level');
      assert.ok(f.variableCategory.contents.some(item => item.type === 'variables_get' && item.fields.VAR.name === 'level'));

      f.listeners[0]({ type: 'loaded' });
      assert.equal(f.variableCategory.contents.filter(item => item.type === 'variables_get').length, 1);

      f.context.renameVariable({ workspace: f.workspace, id: 'definition' }, 'level', 'mode', '');
      assert.equal(f.models[0].name, 'mode');
      assert.ok(f.variableCategory.contents.some(item => item.fields?.VAR?.name === 'mode'));

      f.context.refreshToolbox(f.workspace);
      assert.equal(f.toolbox.selected, f.items[2]);

      const id = f.models[0].getId();
      f.models.length = 0;
      f.listeners[0]({ type: 'delete-variable', varId: id });
      assert.equal(f.variableCategory.contents.some(item => item.type === 'variables_get'), false);
      assert.equal(f.dynamic.contents, 'PROCEDURE');
      assert.equal(f.items[1].getContents(), 'VARIABLE');
      assert.deepEqual(f.logs, []);
    });
  }
}

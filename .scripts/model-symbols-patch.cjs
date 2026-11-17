// Pure source migrations for cross-version contract replay. This module never
// writes a library or an installed package; callers own any filesystem journal.
const assert = require('node:assert/strict');

const lvglHeader = owners => `// Only this library's enabled declarations opt native model IDs into code names.
if (typeof Arduino.registerModelSymbolDeclarations === 'function') {
  Arduino.registerModelSymbolDeclarations('lvgl.declarations', function(workspace) {
    const owners = ${JSON.stringify(owners)};
    const declarations = [];
    for (const block of workspace.getAllBlocks(false)) {
      const type = owners[block.type];
      if (!type || block.isEnabled() === false || block.getInheritedDisabled()) continue;
      const model = workspace.getVariableMap().getVariable(block.getFieldValue('VAR'), type);
      if (model) declarations.push({ nameOrId: model.getId(), type, by: 'id' });
    }
    return declarations;
  });
}
function lvglModelFieldSymbol(block, generator, fieldName, type, fallback, declaration = false) {
  const field = block.getField(fieldName);
  const name = (field && field.getText ? field.getText() : block.getFieldValue(fieldName)) || fallback;
  const model = field && typeof field.getVariable === 'function' ? field.getVariable()
    : block.workspace.getVariableMap().getVariable(name, type);
  if (!model || model.getType() !== type) return name;
  if (typeof generator.getModelSymbolReference === 'function') {
    const symbol = generator.getModelSymbolReference(model);
    if (symbol !== undefined) return symbol;
  }
  return declaration && typeof generator.getModelSymbol === 'function'
    ? generator.getModelSymbol(model.getId(), type, { by: 'id' }) : name;
}

`;

function lvgl(source) {
  assert.ok(!source.includes('function lvglModelFieldSymbol('), 'Apply the model-symbol migration once');
  const owners = {};
  const handlers = [...source.matchAll(/Arduino\.forBlock\['([^']+)'\] = function/g)];
  for (let index = 0; index < handlers.length; index++) {
    const body = source.slice(handlers[index].index, handlers[index + 1]?.index ?? source.length);
    const declaration = /const varName = block\.getFieldValue\('VAR'\) \|\| '([^']+)';/.exec(body);
    if (declaration) owners[handlers[index][1]] = declaration[1] === 'indev' ? 'lv_indev_t' : 'lv_obj_t';
  }
  let declarations = 0, references = 0;
  source = source.replace(/const varName = block\.getFieldValue\('VAR'\) \|\| '([^']+)';/g, (_match, fallback) => {
    declarations++;
    return `const varName = lvglModelFieldSymbol(block, generator, 'VAR', '${fallback === 'indev' ? 'lv_indev_t' : 'lv_obj_t'}', '${fallback}', true);`;
  });
  source = source.replace(/const varName = varField \? varField\.getText\(\) : '([^']+)';/g, (_match, fallback) => {
    references++; return `const varName = lvglModelFieldSymbol(block, generator, 'VAR', 'lv_obj_t', '${fallback}');`;
  });
  const fields = [
    [/const parent = parentField \? parentField\.getText\(\) : 'lv_screen_active\(\)';/g, "const parent = lvglModelFieldSymbol(block, generator, 'PARENT', 'lv_obj_t', 'lv_screen_active()');"],
    [/const varParentName = varField \? varField\.getText\(\) : 'obj';/g, "const varParentName = lvglModelFieldSymbol(block, generator, 'VAR_PARENT', 'lv_obj_t', 'obj');"],
    [/const textarea = textareaField \? textareaField\.getText\(\) : 'textarea';/g, "const textarea = lvglModelFieldSymbol(block, generator, 'TEXTAREA', 'lv_obj_t', 'textarea');"],
  ];
  for (const [pattern, replacement] of fields) source = source.replace(pattern, () => { references++; return replacement; });
  assert.ok(declarations >= 15 && references >= 40, 'Expected the complete audited LVGL declaration/reference family');
  return { source: lvglHeader(owners) + source, declarations, references };
}

const coreHeader = `// Untyped core models opt in only through actual declaration blocks.
if (typeof Arduino.registerModelSymbolDeclarations === 'function') {
  Arduino.registerModelSymbolDeclarations('core-variables.declarations', function(workspace) {
    const declarations = [];
    for (const block of workspace.getAllBlocks(false)) {
      if (!['variable_define', 'variable_define_scoped', 'variable_define_advanced', 'variable_define_advanced_scoped'].includes(block.type)) continue;
      if (block.isEnabled() === false || block.getInheritedDisabled()) continue;
      const model = workspace.getVariableMap().getVariable(block.getFieldValue('VAR'), '');
      if (model) declarations.push({ nameOrId: model.getId(), type: '', by: 'id' });
    }
    return declarations;
  });
}
function coreModelDeclaredSymbol(block, generator, name) {
  const model = block.workspace.getVariableMap().getVariable(name, '');
  return model && typeof generator.getModelSymbol === 'function'
    ? generator.getModelSymbol(model.getId(), '', { by: 'id' }) : name;
}
function coreModelReferenceSymbol(block, generator, model) {
  const name = model.getName();
  // A native procedure parameter keeps its existing local spelling even when
  // a same-named global model has opted into generated names.
  if (model.getType() === '') {
    const visited = new Set();
    for (let parent = block.getSurroundParent(); parent && !visited.has(parent); parent = parent.getSurroundParent()) {
      visited.add(parent);
      const definition = typeof parent.getProcedureDef === 'function' ? parent.getProcedureDef() : undefined;
      if (Array.isArray(definition && definition[1]) && definition[1].includes(name)) return name;
    }
  }
  return typeof generator.getModelSymbolReference === 'function'
    ? generator.getModelSymbolReference(model) ?? name : name;
}

`;

function core(source) {
  assert.ok(!source.includes('function coreModelDeclaredSymbol('), 'Apply the model-symbol migration once');
  let declarations = 0, references = 0;
  assert.ok(source.includes('const existingVar = workspace.getVariable(varName);'));
  source = source.replace('const existingVar = workspace.getVariable(varName);', "const existingVar = workspace.getVariable(varName, varType === undefined ? '' : varType);");
  source = source.replace(/const name = block\.getFieldValue\("VAR"\);/g, () => {
    declarations++; return 'const name = coreModelDeclaredSymbol(block, generator, block.getFieldValue("VAR"));';
  });
  source = source.replace(/const \{ name: code, type \} = block\.workspace\.getVariableById\(\s*block\.getFieldValue\("VAR"\),\s*\);/g, () => {
    references++; return 'const model = block.workspace.getVariableMap().getVariableById(block.getFieldValue("VAR"));\n  const code = coreModelReferenceSymbol(block, generator, model), type = model.getType();';
  });
  assert.equal(declarations, 4); assert.equal(references, 2);
  return { source: coreHeader + source, declarations, references };
}

const ds1302Header = `if (typeof Arduino.registerModelSymbolDeclarations === 'function') {
  Arduino.registerModelSymbolDeclarations('ds1302.declarations', function(workspace) {
    const declarations = [];
    for (const block of workspace.getAllBlocks(false)) {
      if (block.type !== 'ds1302_setup' || block.isEnabled() === false || block.getInheritedDisabled()) continue;
      const model = workspace.getVariableMap().getVariable(block.getFieldValue('VAR'), 'DS1302');
      if (model) declarations.push({ nameOrId: model.getId(), type: 'DS1302', by: 'id' });
    }
    return declarations;
  });
}
function ds1302ModelFieldSymbol(block, generator, declaration = false) {
  const field = block.getField('VAR');
  const name = (field && field.getText ? field.getText() : block.getFieldValue('VAR')) || 'rtc';
  const model = field && typeof field.getVariable === 'function' ? field.getVariable()
    : block.workspace.getVariableMap().getVariable(name, 'DS1302');
  if (!model || model.getType() !== 'DS1302') return name;
  if (typeof generator.getModelSymbolReference === 'function') {
    const symbol = generator.getModelSymbolReference(model);
    if (symbol !== undefined) return symbol;
  }
  return declaration && typeof generator.getModelSymbol === 'function'
    ? generator.getModelSymbol(model.getId(), 'DS1302', { by: 'id' }) : name;
}

`;

function ds1302(source) {
  assert.ok(!source.includes('function ds1302ModelFieldSymbol('), 'Apply the model-symbol migration once');
  let declarations = 0, references = 0;
  source = source.replace("const varName = block.getFieldValue('VAR') || 'rtc';", () => { declarations++; return 'const varName = ds1302ModelFieldSymbol(block, generator, true);'; });
  source = source.replace(/const varName = varField \? varField\.getText\(\) : 'rtc';/g, () => { references++; return 'const varName = ds1302ModelFieldSymbol(block, generator);'; });
  assert.equal(declarations, 1); assert.equal(references, 6);
  return { source: ds1302Header + source, declarations, references };
}

function math(source) {
  const before = 'const variableName = variable ? variable.name : "variable";';
  assert.ok(source.includes(before));
  return { source: source.replace(before, `const variableName = variable && typeof Arduino.getModelSymbolReference === 'function'
    ? Arduino.getModelSymbolReference(variable) ?? variable.name : variable ? variable.name : "variable";`) };
}
module.exports = { lvgl, core, ds1302, math };

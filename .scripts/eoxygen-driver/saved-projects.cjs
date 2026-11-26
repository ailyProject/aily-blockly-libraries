const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const path = require('node:path'), Blockly = require(process.argv[2] || 'blockly');
const pkg = path.resolve(__dirname,'../../dfrobot_eoxygen_sensor');
const read = name => JSON.parse(fs.readFileSync(path.join(pkg,name)));
const Arduino = {forBlock:{}};
vm.runInNewContext(fs.readFileSync(path.join(pkg,'generator.js'),'utf8'),{Arduino});
const results = [];
for (const locale of ['base', ...fs.readdirSync(path.join(pkg,'i18n'))]) {
  const block = read('block.json')[0];
  if (locale !== 'base') block.args0[2].options = read('i18n/'+locale)[block.type].args0[2].options;
  block.args0[1].options = [['Wire','Wire']];
  delete Blockly.Blocks[block.type];
  Blockly.common.defineBlocksWithJsonArray([block]);
  for (let pos = 0; pos < 4; pos++) {
    const stored = '0x3'+pos, address = '0x7'+pos;
    const ws = new Blockly.Workspace();
    const first = Blockly.serialization.blocks.append({type:block.type,fields:{ADDR:stored}},ws);
    const saved = Blockly.serialization.blocks.save(first);
    ws.clear();
    const loaded = Blockly.serialization.blocks.append(saved,ws);
    let definition;
    Arduino.forBlock[block.type](loaded,{addLibrary(){},addObject(k,v){definition=v},addSetupBegin(){}});
    assert.equal(saved.fields.ADDR, stored);
    assert.equal(loaded.getField('ADDR').getText(), address);
    assert.ok(definition.endsWith(', '+address+');'));
    results.push({locale, stored, address,definition});
    ws.dispose();
  }
}
if (process.argv[3]) fs.writeFileSync(process.argv[3], JSON.stringify(results,null,2)+'\n');
console.log(results.length+' saved Blockly address round trips');

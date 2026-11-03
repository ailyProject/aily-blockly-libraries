const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {createRequire} = require('node:module');
const host = path.resolve(process.env.AILY_BLOCKLY_ROOT || path.join(__dirname,'../../aily-blockly'));
const hostRequire = createRequire(path.join(host,'package.json'));
const Blockly = hostRequire('blockly');
hostRequire('blockly/blocks');
const {JSDOM}=hostRequire('jsdom');
const dom=new JSDOM('<!doctype html>');
Blockly.utils.xml.injectDependencies({document:dom.window.document,DOMParser:dom.window.DOMParser,XMLSerializer:dom.window.XMLSerializer});
const {buildSync} = hostRequire('esbuild');
const bundled = buildSync({entryPoints:[path.join(host,'src/app/editors/blockly-editor/components/blockly/generators/arduino/arduino.ts')],bundle:true,platform:'node',format:'cjs',external:['blockly'],write:false,logLevel:'silent'}).outputFiles[0].text;
const exportsModule={exports:{}};
vm.runInNewContext(bundled,{require:hostRequire,module:exportsModule,exports:exportsModule.exports,console,TextEncoder,TextDecoder});
const {ArduinoGenerator}=exportsModule.exports;
const rawBlocks=JSON.parse(fs.readFileSync(path.join(__dirname,'block.json'),'utf8'));
const board={digitalPins:[['GPIO5','5'],['GPIO0','0'],['GPIO2','2'],['GPIO4','4'],['GPIO18','18'],['GPIO23','23'],['GPIO19','19']],i2c:[['Wire','Wire'],['Wire1','Wire1']]};
const definitions=JSON.parse(JSON.stringify(rawBlocks).replace(/"\$\{board\.(\w+)\}"/g,(_,key)=>JSON.stringify(board[key])));
Blockly.defineBlocksWithJsonArray(definitions);
const toolbox=JSON.parse(fs.readFileSync(path.join(__dirname,'toolbox.json'),'utf8'));
const entries=new Map(toolbox.contents.flatMap(c=>c.contents).map(b=>[b.type,b]));
function runtime(config) {
  const workspace=new Blockly.Workspace();
  const generator=new ArduinoGenerator();
  const registered=[],renamed=[];
  const timers=[];
  const context={Arduino:generator,Blockly,console,window:{boardConfig:config||{}},setTimeout(callback){timers.push(callback);},registerVariableToBlockly(name,type){registered.push([name,type]);if(!workspace.getVariableMap().getVariable(name,type))workspace.getVariableMap().createVariable(name,type);},renameVariableInBlockly(block,oldName,newName,type){renamed.push([oldName,newName,type]);const v=workspace.getVariableMap().getVariable(oldName,type);if(v)workspace.getVariableMap().renameVariable(v,newName);}};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname,'generator.js'),'utf8'),context);
  generator.forBlock.math_number=b=>[String(b.getFieldValue('NUM')),generator.ORDER_ATOMIC];
  generator.forBlock.text=b=>[JSON.stringify(b.getFieldValue('TEXT')),generator.ORDER_ATOMIC];
  generator.forBlock.logic_boolean=b=>[b.getFieldValue('BOOL')==='TRUE'?'true':'false',generator.ORDER_ATOMIC];
  function block(type,fields={},values={}) {
    const b=workspace.newBlock(type);
    for(const [key,value] of Object.entries(fields)) {
      const field=b.getField(key);
      if(field instanceof Blockly.FieldVariable) {
        let v=workspace.getVariableMap().getVariable(value,field.getVariableTypes()[0]);
        if(!v)v=workspace.getVariableMap().createVariable(value,field.getVariableTypes()[0]);
        b.setFieldValue(v.getId(),key);
      } else b.setFieldValue(value,key);
    }
    for(const [key,item] of Object.entries(entries.get(type)?.inputs || {})) {
      if(b.getInputTargetBlock(key)) {
        if(Object.hasOwn(values,key))b.getInputTargetBlock(key).setFieldValue(values[key],Object.keys(item.shadow.fields)[0]);
        continue;
      }
      const state=JSON.parse(JSON.stringify(item.shadow));
      if(Object.hasOwn(values,key))state.fields[Object.keys(state.fields)[0]]=values[key];
      const child=Blockly.serialization.blocks.append(state,workspace);
      b.getInput(key).connection.connect(child.outputConnection);
    }
    return b;
  }
  function generate(b) {generator.init(workspace);return generator.forBlock[b.type](b,generator);}
  function sections() {return Object.fromEntries(Object.entries(generator.codeDict).map(([k,v])=>[k,Object.values(v).join('\n')]));}
  return {workspace,generator,block,generate,sections,registered,renamed,context,flushDefaults(){while(timers.length)timers.shift()();}};
}

test('all 50 definitions load into real Blockly and every toolbox block generates code',()=>{
  const r=runtime();
  for(const def of definitions) {
    const b=r.block(def.type);
    const code=r.generate(b);
    assert.ok(typeof code==='string'||Array.isArray(code),def.type);
    assert.doesNotMatch(JSON.stringify([code,r.sections()]),/undefined|\[object Object\]/,def.type);
  }
  r.workspace.dispose();
});

test('every dropdown alternative generates and RouteChange uses target zero',()=>{
  const r=runtime();
  for(const def of definitions) {
    const b=r.block(def.type);
    for(const key of Object.keys(def).filter(k=>/^args\d+$/.test(k)))for(const arg of def[key]) {
      if(arg.type!=='field_dropdown'||!Array.isArray(arg.options))continue;
      for(const [,value] of arg.options) {
        b.setFieldValue(value,arg.name);
        r.generate(b);
        assert.doesNotMatch(JSON.stringify(r.sections()),/undefined|\[object Object\]/,def.type+'.'+arg.name+'='+value);
      }
    }
  }
  r.generate(r.block('nice_gfx_ui_on',{EVENT:'RouteChange'}));
  assert.match(r.sections().setups_end,/\.on\(0, nice_gfx::htmlui::EventType::RouteChange/);
  r.generate(r.block('nice_gfx_touch_i2c',{DRIVER:'Gt1151'}));
  assert.match(r.sections().objects,/TouchWire gfx_touch_bus\(Wire, -1, -1, true\)/);
  r.workspace.dispose();
});

test('typed object rename updates consumers and global objects are emitted once per pass',()=>{
  const r=runtime(),init=r.block('nice_gfx_init_spi'),fill=r.block('nice_gfx_fill');
  r.generate(init);
  init.getField('VAR').onFinishEditing_('panel');
  init.setFieldValue('panel','VAR');
  assert.equal(fill.getField('VAR').getText(),'panel');
  assert.equal(r.renamed.length,1);
  r.generate(init);
  r.generator.forBlock[init.type](init,r.generator);
  assert.equal(Object.keys(r.generator.codeDict.objects).length,1);
  assert.match(r.sections().objects,/ILI9341_240x320_SPI panel\(/);
  assert.equal(r.generator.forBlock[fill.type](fill,r.generator),'panel.fillScreen(65535);\n');
  r.generate(init);
  assert.match(r.sections().objects,/panel\(/);
  r.workspace.dispose();
});

test('GPIO0, black, false and zero survive generation and Sprite is accepted by drawing blocks',()=>{
  const r=runtime(),init=r.block('nice_gfx_init_spi',{CS:'0'});
  r.generate(init);
  assert.match(r.sections().objects,/gfx\(0,/);
  const fill=r.block('nice_gfx_fill',{}, {COLOR:0});
  assert.equal(r.generate(fill),'gfx.fillScreen(0);\n');
  assert.equal(r.generate(r.block('nice_gfx_invert',{}, {INVERT:'FALSE'})),'gfx.invertDisplay(false);\n');
  const v=r.workspace.getVariableMap().createVariable('buffer','GFX_Sprite');
  fill.setFieldValue(v.getId(),'VAR');
  assert.equal(r.generate(fill),'buffer.fillScreen(0);\n');
  r.workspace.dispose();
});

test('UI events bind after setup, use unique callbacks and restrict event values to the callback',()=>{
  const r=runtime(),on=r.block('nice_gfx_ui_on'),value=r.block('nice_gfx_ui_event_value');
  assert.equal(r.generate(value)[0],'0');
  const update=r.block('nice_gfx_ui_value');
  update.getInput('VALUE').connection.targetBlock().dispose();
  update.getInput('VALUE').connection.connect(value.outputConnection);
  on.getInput('DO').connection.connect(update.previousConnection);
  r.generate(on);
  assert.match(r.sections().functions,/ng_event.value/);
  assert.match(r.sections().setups_end,/\.on\(ui_config::id\(String\("button"\).c_str\(\)\)/);
  const second=r.block('nice_gfx_ui_on');
  r.generator.forBlock[second.type](second,r.generator);
  assert.equal(Object.keys(r.generator.codeDict.functions).length,2);
  r.workspace.dispose();
});

test('UI input supplies one down, move and release transition and tick runs after user loop',()=>{
  const r=runtime(),init=r.block('nice_gfx_ui_init');
  r.generate(init);
  assert.match(r.sections().loops_end,/if \(ui_ready\) ui.tick\(millis\(\)\)/);
  const code=r.generate(r.block('nice_gfx_ui_touch'));
  assert.match(code,/if \(ui_pressed\) ui.pointerMove/);
  assert.match(code,/else ui.pointerDown/);
  assert.match(code,/else if \(ui_pressed\)/);
  assert.match(code,/ui.pointerUp/);
  r.workspace.dispose();
});

test('all SPI/software-SPI, QSPI and font choices name real upstream symbols',()=>{
  const source=path.join(__dirname,'src/NICE_GFX/src');
  const aliases=['DisplayAliases.h','ColorAliases.h'].map(f=>fs.readFileSync(path.join(source,'Display/Presets',f),'utf8')).join('\n');
  const spi=definitions.find(b=>b.type==='nice_gfx_init_spi').args0.find(a=>a.name==='DRIVER');
  for(const [,driver] of spi.options)for(const bus of ['SPI','SW_SPI'])assert.ok(aliases.includes('using '+driver+'_'+bus+' ='),driver+'_'+bus);
  const fontBlocks=definitions.find(b=>b.type==='nice_gfx_font');
  const fonts=Object.keys(fontBlocks).filter(k=>/^args\d+$/.test(k)).flatMap(k=>fontBlocks[k]).find(a=>a.name==='FONT');
  for(const [,font] of fonts.options)assert.ok(fs.existsSync(path.join(source,'Fonts',font+'.h')),font);
});

const aiotDisplay={controller:'st7789',interface:'spi',width:240,height:240,frequency:40000000,pins:{sclk:'21',mosi:'47',dc:'43',cs:'44'}};
test('board displayConfig initializes the AIOT ST7789 profile, pins and numeric frequency shadow',()=>{
  const config={displayConfig:JSON.parse(JSON.stringify(aiotDisplay))};
  const r=runtime(config),b=r.block('nice_gfx_init_spi');
  assert.deepEqual(['DRIVER','BUS','CS','DC','RST','SCK','MOSI','MISO'].map(k=>b.getFieldValue(k)),['ST7789_240x240','SPI','44','43','-1','21','47','-1']);
  const frequency=b.getInputTargetBlock('HZ');
  assert.equal(frequency.isShadow(),true);
  assert.equal(frequency.getFieldValue('NUM'),40000000);
  r.generate(b);
  assert.match(r.sections().objects,/ST7789_240x240_SPI gfx\(44, 43, -1, 21, 47, -1, 40000000\)/);
  assert.deepEqual(config.displayConfig,aiotDisplay);
  r.workspace.dispose();
});

test('flyout defaults win over generic toolbox shadows, while manual workspace values stay editable',()=>{
  const config={displayConfig:{...aiotDisplay,frequency:80000000,pins:{...aiotDisplay.pins,cs:0}}};
  const r=runtime(config);
  r.workspace.internalIsFlyout=true;
  const b=r.block('nice_gfx_init_spi');
  b.getInputTargetBlock('HZ').setFieldValue(40000000,'NUM');
  r.flushDefaults();
  assert.equal(b.getInputTargetBlock('HZ').getFieldValue('NUM'),80000000);
  assert.equal(b.getFieldValue('CS'),'0');
  r.workspace.internalIsFlyout=false;
  const manual=r.block('nice_gfx_init_spi',{CS:'5'});
  manual.getInputTargetBlock('HZ').setFieldValue(20000000,'NUM');
  r.generate(manual);
  r.generate(manual);
  assert.match(r.sections().objects,/gfx\(5, 43, -1, 21, 47, -1, 20000000\)/);
  r.workspace.dispose();
});

test('serialized manual pins and frequency survive reopen instead of being overwritten by board defaults',()=>{
  const r=runtime({displayConfig:{...aiotDisplay,frequency:80000000}});
  const b=r.block('nice_gfx_init_spi',{CS:'5',RST:'4'});
  b.getInputTargetBlock('HZ').setFieldValue(20000000,'NUM');
  const state=Blockly.serialization.workspaces.save(r.workspace);
  r.workspace.clear();
  Blockly.serialization.workspaces.load(state,r.workspace);
  r.flushDefaults();
  const loaded=r.workspace.getBlocksByType('nice_gfx_init_spi')[0];
  assert.equal(loaded.getFieldValue('CS'),'5');
  assert.equal(loaded.getFieldValue('RST'),'4');
  assert.equal(loaded.getInputTargetBlock('HZ').getFieldValue('NUM'),20000000);
  r.workspace.dispose();
});

test('explicit number expressions remain connected when board defaults are applied',()=>{
  const r=runtime({displayConfig:aiotDisplay});
  r.workspace.internalIsFlyout=true;
  const b=r.block('nice_gfx_init_spi');
  const expression=r.workspace.newBlock('math_number');
  expression.setFieldValue(123456,'NUM');
  b.getInput('HZ').connection.connect(expression.outputConnection);
  r.flushDefaults();
  assert.equal(b.getInputTargetBlock('HZ'),expression);
  assert.equal(expression.isShadow(),false);
  assert.equal(expression.getFieldValue('NUM'),123456);
  r.workspace.dispose();
});

test('QSPI displayConfig accepts data0-data3 aliases and internal pins absent from the public GPIO picker',()=>{
  const r=runtime({displayConfig:{controller:'co5300',interface:'QSPI',width:480,height:480,frequency:80000000,pins:{sclk:'42',cs:'50',data0:'36',data1:'51',data2:'35',data3:'9',rst:'44'}}});
  const b=r.block('nice_gfx_init_qspi');
  assert.deepEqual(['DRIVER','CS','RST','SCK','D0','D1','D2','D3'].map(k=>b.getFieldValue(k)),['nice_gfx::CO5300_480x480_QSPI','50','44','42','36','51','35','9']);
  r.generate(b);
  assert.match(r.sections().objects,/gfx\(50, 44, 42, 36, 51, 35, 9, 80000000\)/);
  r.workspace.dispose();
});

test('I2C displayConfig initializes the OLED profile, reset, custom bus pins, address and clock',()=>{
  const r=runtime({displayConfig:{controller:'ssd1306',interface:'i2c',width:128,height:64,frequency:400000,address:'0x3d',pins:{sda:'17',scl:'18',rst:'21'}}});
  const b=r.block('nice_gfx_init_i2c');
  assert.equal(b.getFieldValue('DRIVER'),'SSD1306_128x64_I2C');
  assert.equal(b.getFieldValue('RST'),'21');
  assert.equal(b.getFieldValue('SDA'),'17');
  assert.equal(b.getFieldValue('SCL'),'18');
  assert.equal(b.getInputTargetBlock('ADDRESS').getFieldValue('NUM'),61);
  const code=r.generate(b);
  assert.match(code,/Wire.begin\(17, 18\)/);
  assert.match(code,/Wire.setClock\(400000\)/);
  assert.match(r.sections().objects,/gfx\(gfx_i2c, 61, 21\)/);
  assert.throws(()=>r.generate(r.block('nice_gfx_init_i2c',{SCL:'-1'})),/requires both SDA and SCL/);
  r.workspace.dispose();
});

test('missing configs, mismatched interfaces and unavailable profile dimensions retain generic defaults',()=>{
  for(const config of [{},{displayConfig:{...aiotDisplay,interface:'parallel'}},{displayConfig:{...aiotDisplay,width:123,height:456}}]) {
    const r=runtime(config),b=r.block('nice_gfx_init_spi');
    assert.equal(b.getFieldValue('DRIVER'),'ILI9341_240x320');
    assert.equal(b.getFieldValue('CS'),'5');
    assert.equal(b.getInputTargetBlock('HZ').getFieldValue('NUM'),40000000);
    r.workspace.dispose();
  }
});

// Reuse the actual host generator for a compiler fixture; no C++ API stubs.
if(process.env.NICE_GFX_EMIT_CPP) {
  const r=runtime(),setup=[],body=[];
  const init=r.block('nice_gfx_init_spi',{CS:'5',DC:'2',SCK:'18',MOSI:'23',RST:'4',MISO:'19'});
  const sprite=r.block('nice_gfx_sprite_create');
  const touch=r.block('nice_gfx_touch_i2c');
  const view=r.block('nice_gfx_ui_init');
  const oled=r.block('nice_gfx_init_i2c',{VAR:'oled',SDA:'17',SCL:'18'});
  r.context.window.boardConfig={displayConfig:aiotDisplay};
  const onboard=r.block('nice_gfx_init_spi',{VAR:'onboard'});
  r.context.window.boardConfig={};
  const blocks=[init,sprite,touch,view,oled,onboard,...definitions.filter(d=>!['nice_gfx_init_spi','nice_gfx_init_qspi','nice_gfx_init_i2c','nice_gfx_init_board','nice_gfx_sprite_create','nice_gfx_touch_i2c','nice_gfx_touch_xpt2046','nice_gfx_ui_init'].includes(d.type)).map(d=>r.block(d.type))];
  r.generator.init(r.workspace);
  for(const b of blocks) {
    const code=r.generator.forBlock[b.type](b,r.generator);
    if(Array.isArray(code))body.push('(void)('+code[0]+');');
    else if(b===init||b===sprite||b===touch||b===view||b===oled||b===onboard)setup.push(code);
    else body.push(code);
  }
  const s=r.sections();
  const cpp=[s.libraries,s.variables,s.objects,s.functions,'void setup() {',s.setups_begin,setup.join('\n'),s.setups_end,'}','void loop() {',body.join('\n'),s.loops_end,'}'].join('\n');
  fs.mkdirSync(path.dirname(process.env.NICE_GFX_EMIT_CPP),{recursive:true});
  fs.writeFileSync(process.env.NICE_GFX_EMIT_CPP,cpp);
  r.workspace.dispose();
}

if(process.env.NICE_GFX_WRITE_EXAMPLES) {
  const r=runtime();
  const core=JSON.parse(fs.readFileSync(path.join(__dirname,'../core-loop/block.json'),'utf8'));
  Blockly.defineBlocksWithJsonArray(core.filter(b=>['arduino_setup','arduino_loop'].includes(b.type)));
  r.generator.forBlock.arduino_setup=(b,g)=>{g.addSetup('setup',g.statementToCode(b,'ARDUINO_SETUP'));return '';};
  r.generator.forBlock.arduino_loop=(b,g)=>{g.addLoop('loop',g.statementToCode(b,'ARDUINO_LOOP'));return '';};
  const setup=r.workspace.newBlock('arduino_setup'),loop=r.workspace.newBlock('arduino_loop');
  setup.moveBy(30,30);loop.moveBy(30,400);
  const stack=[r.block('nice_gfx_init_spi',{CS:'5',DC:'2',RST:'4',SCK:'18',MOSI:'23',MISO:'19'}),r.block('nice_gfx_fill',{}, {COLOR:0}),r.block('nice_gfx_font'),r.block('nice_gfx_text_style'),r.block('nice_gfx_text')];
  setup.getInput('ARDUINO_SETUP').connection.connect(stack[0].previousConnection);
  for(let i=1;i<stack.length;i++)stack[i-1].nextConnection.connect(stack[i].previousConnection);
  // Generate once to register typed variables, then serialize and load into a fresh workspace.
  const before=r.generator.workspaceToCode(r.workspace);
  const state=Blockly.serialization.workspaces.save(r.workspace);
  fs.mkdirSync(path.join(__dirname,'examples'),{recursive:true});
  fs.writeFileSync(path.join(__dirname,'examples/hello-display.abi'),JSON.stringify(state,null,2)+'\n');
  r.workspace.clear();
  Blockly.serialization.workspaces.load(state,r.workspace);
  const after=r.generator.workspaceToCode(r.workspace);
  assert.equal(before,after);
  assert.match(after,/gfx.drawString/);
  fs.writeFileSync(path.join(__dirname,'examples/hello-display.ino'),after);
  r.workspace.dispose();
}

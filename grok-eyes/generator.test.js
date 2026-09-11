const test=require('node:test');
const assert=require('node:assert/strict');
const {blocks,toolbox,load,makeBlock,makeGenerator}=require('./tests/harness.cjs');

test('every block and dropdown variant has a working generator and toolbox inputs',()=>{
  const {Arduino}=load();
  assert.deepEqual(Object.keys(Arduino.forBlock).sort(),blocks.map(b=>b.type).sort());
  for(const definition of blocks) {
    const variants=[{}];
    for(const arg of definition.args0) {
      if(arg.type==='field_dropdown') for(const [,value] of arg.options) variants.push({[arg.name]:value});
      if(arg.type==='input_value') assert.ok(toolbox.contents.find(b=>b.type===definition.type).inputs[arg.name].shadow);
    }
    for(const fields of variants) {
      const result=Arduino.forBlock[definition.type](makeBlock(definition.type,fields),makeGenerator());
      if(definition.output) assert.ok(Array.isArray(result),definition.type);
      else assert.equal(typeof result,'string',definition.type);
      assert.doesNotMatch(Array.isArray(result)?result[0]:result,/undefined|\[object Object\]|id-VAR|id-DISPLAY/);
    }
  }
});

test('typed TFT object is reused; eye declaration and loop refresh are deduplicated',()=>{
  const {Arduino,registrations}=load();
  const generator=makeGenerator();
  const block=makeBlock('grok_eyes_init',{VAR:'face',DISPLAY:'screen'});
  const code=Arduino.forBlock.grok_eyes_init(block,generator);
  Arduino.forBlock.grok_eyes_init(block,generator);
  assert.equal(code,'grok_eyes_ready_face = face.begin(50, 0, 0);\n');
  assert.deepEqual([...generator.sections.Object.values()],['grokEyes face(screen);']);
  assert.deepEqual([...generator.sections.LoopBegin.values()],['if (grok_eyes_ready_face) face.update();']);
  assert.deepEqual(registrations[0],['face','grokEyes']);
  const second=makeBlock('grok_eyes_init',{VAR:'other',DISPLAY:'screen',AUTO_UPDATE:'FALSE'},{WIDTH:'240',HEIGHT:'200'});
  assert.equal(Arduino.forBlock.grok_eyes_init(second,generator),'grok_eyes_ready_other = other.begin(50, 240, 200);\n');
  assert.equal(generator.sections.Object.size,2);
  assert.equal(generator.sections.LoopBegin.size,1);
});

test('manual update setting does not leak across generation passes',()=>{
  const {Arduino}=load();
  const block=makeBlock('grok_eyes_init');
  Arduino.forBlock.grok_eyes_init(block,makeGenerator());
  block.fields.AUTO_UPDATE='FALSE';
  const generator=makeGenerator();
  Arduino.forBlock.grok_eyes_init(block,generator);
  assert.equal(generator.sections.LoopBegin.size,0);
});

test('expression transition sentinel, snap and timed values retain their meanings',()=>{
  const {Arduino}=load();
  for(const duration of ['0','350','65535','transitionMs']) {
    const code=Arduino.forBlock.grok_eyes_set_expression(makeBlock('grok_eyes_set_expression',{EXPRESSION:'GROK_EXPRESSION_24'},{DURATION:duration}),makeGenerator());
    assert.equal(code,'eyes.setGrokExpression(grokEyes::GROK_EXPRESSION_24, '+duration+');\n');
  }
  const named=Arduino.forBlock.grok_eyes_set_expression_name(makeBlock('grok_eyes_set_expression_name',{}, {NAME:'incomingName'}),makeGenerator());
  assert.equal(named[0],'eyes.setExpression(String(incomingName).c_str(), 65535)');
});

test('object references use visible variable names and rename hooks attach once',()=>{
  const {Arduino,renames}=load();
  const init=makeBlock('grok_eyes_init',{VAR:'face-1'});
  let originalCalls=0;
  init.getField('VAR').onFinishEditing_=()=>originalCalls++;
  Arduino.forBlock.grok_eyes_init(init,makeGenerator());
  const hook=init.getField('VAR').onFinishEditing_;
  Arduino.forBlock.grok_eyes_init(init,makeGenerator());
  assert.equal(init.getField('VAR').onFinishEditing_,hook);
  hook('face-2');
  assert.equal(originalCalls,1);
  assert.equal(renames.length,1);
  assert.deepEqual(renames[0].slice(1),['face-1','face-2','grokEyes']);
  const code=Arduino.forBlock.grok_eyes_blink(makeBlock('grok_eyes_blink',{VAR:'face-2',EYE:'LEFT'}),makeGenerator());
  assert.equal(code,'face_u2d_2.blinkEye(grokEyes::LEFT, 0);\n');
  assert.equal(Arduino.grokEyesIdentifier('grokEyes'),'eyes_grokEyes');
});

test('end clears readiness and wait keeps refreshing with wrap-safe elapsed time',()=>{
  const {Arduino}=load();
  const generator=makeGenerator();
  assert.equal(Arduino.forBlock.grok_eyes_end(makeBlock('grok_eyes_end'),generator),'eyes.end();\ngrok_eyes_ready_eyes = false;\n');
  assert.equal(Arduino.forBlock.grok_eyes_is_ready(makeBlock('grok_eyes_is_ready'),generator)[0],'grok_eyes_ready_eyes');
  Arduino.forBlock.grok_eyes_wait(makeBlock('grok_eyes_wait'),generator);
  Arduino.forBlock.grok_eyes_wait(makeBlock('grok_eyes_wait'),generator);
  assert.equal(generator.sections.Function.size,1);
  const helper=[...generator.sections.Function.values()][0];
  assert.match(helper,/\(uint32_t\)\(millis\(\) - start\)/);
  assert.match(helper,/eyes\.update\(\);\n    delay\(1\);/);
});

test('single-eye blink and scoped blink configuration preserve all phases',()=>{
  const {Arduino}=load();
  assert.equal(Arduino.forBlock.grok_eyes_blink(makeBlock('grok_eyes_blink',{EYE:'RIGHT'},{DURATION:'800'}),makeGenerator()),'eyes.blinkEye(grokEyes::RIGHT, 800);\n');
  const config=Arduino.forBlock.grok_eyes_set_blink_timing(makeBlock('grok_eyes_set_blink_timing',{}, {CLOSE:'140',HOLD:'650',OPEN:'500',SCALE:'0'}),makeGenerator());
  assert.equal(config,'{\n  grokEyes::BlinkConfig config;\n  config.closeMs = 140;\n  config.holdMs = 650;\n  config.openMs = 500;\n  config.closedScale = 0;\n  eyes.setBlinkConfig(config);\n}\n');
});

test('serialized examples integrate with the real TFT_eSPI generator',()=>{
  const {generateExample}=require('./tests/examples.cjs');
  const state=generateExample('StateDemo');
  assert.match(state.source,/if \(grok_eyes_ready_eyes\) eyes\.update\(\);/);
  assert.match(state.macros,/#define ST7789_DRIVER/);
  assert.match(state.macros,/#define TFT_MOSI 47/);
  const expressions=generateExample('ExpressionDemo');
  assert.equal(expressions.generator.sections.LoopBegin.size,0);
  assert.match(expressions.source,/eyes\.setXiaozhiExpression\(grokEyes::XIAOZHI_SURPRISED, 450\)/);
  assert.match(expressions.source,/grok_eyes_wait\(eyes, 1500\)/);
});

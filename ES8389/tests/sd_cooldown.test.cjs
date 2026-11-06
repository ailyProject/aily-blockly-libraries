// Exercise the actual mountSD() control flow with deterministic storage/time mocks.
// Pass the ES8389Player.cpp extracted from src.7z as the first argument.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

if (!process.argv[2]) throw new Error('Usage: node sd_cooldown.test.cjs <ES8389Player.cpp>');
const source = fs.readFileSync(process.argv[2], 'utf8');
const match = source.match(/bool ES8389Player::mountSD\(\)\s*\{([\s\S]*?)\n\}\s*\n\s*bool ES8389Player::isAudioFile/);
assert(match, 'Cannot locate mountSD()');
let body = match[1];
if (body.includes('#if SOC_SDMMC_HOST_SUPPORTED')) {
  body = body.split('#if SOC_SDMMC_HOST_SUPPORTED')[1].split('#else')[0];
}
const state = [];
body = body.replace(/static (?:bool|uint32_t) (\w+) = ([^;]+);/g, (_, name, value) => {
  state.push(`let ${name} = ${value};`);
  return '';
});
// Keep the source statements and conditionals; adapt C++ declarations and unsigned
// subtraction only. This makes timestamp-zero and wraparound behavior observable.
body = body.replace(/\bbool pinsOk\b/g, 'const pinsOk')
  .replace(/\bint attempt\b/g, 'let attempt')
  .replace(/millis\(\) - failedAt/g, '((millis() - failedAt) >>> 0)');

function fixture(failureTime) {
  const f = {now: (failureTime - 200) >>> 0, begins: 0, card: 0, succeed: false};
  const context = {
    CARD_NONE: 0, ES8389_SD_ROOT: '/sdcard', SDMMC_FREQ_DEFAULT: 20000,
    s_sdClk: 24, s_sdCmd: 25, s_sdD0: 20,
    millis: () => f.now,
    delay: ms => { f.now = (f.now + ms) >>> 0; },
    sdmmc_host_deinit: () => {},
    SD_MMC: {
      cardType: () => f.card,
      setPins: () => true,
      begin: () => { ++f.begins; if (f.succeed) f.card = 1; return f.succeed; },
      end: () => {},
    },
  };
  f.mount = vm.runInNewContext(`(() => { ${state.join('\n')} return function () { ${body} }; })()`, context);
  return f;
}

for (const failedAt of [0, 1000, 1001, 0xFFFFFFF0]) {
  const f = fixture(failedAt);
  assert.equal(f.mount(), false);
  assert.equal(f.now, failedAt);
  assert.equal(f.begins, 2);
  for (const elapsed of [0, 1, 2999]) {
    f.now = (failedAt + elapsed) >>> 0;
    assert.equal(f.mount(), false);
    assert.equal(f.begins, 2, `Failure at ${failedAt}, elapsed ${elapsed}: retry before cooldown`);
  }
  f.now = (failedAt + 3000) >>> 0;
  f.succeed = true;
  assert.equal(f.mount(), true);
  assert.equal(f.begins, 3, 'Retry must resume at 3000ms');
  f.card = 0;
  f.succeed = false;
  assert.equal(f.mount(), false);
  assert.equal(f.begins, 5, 'A successful mount must clear the failure state');
}
console.log('mountSD cooldown: zero/even/odd/wrapped timestamps, 0/1/2999/3000ms and success reset PASS');

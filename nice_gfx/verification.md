# Verification

Verified on 2026-11-03 with Node 22.23.3, the sibling aily-blockly checkout's
actual Blockly runtime and Arduino generator, and Espressif Arduino core 3.3.12.

- All 50 block definitions loaded in Blockly; every dropdown alternative generated code.
- Fourteen automated tests passed: block loading, dropdowns, typed-object rename and
  deduplication, zero/false values, Sprite selection, event scope, callback binding,
  UI input transitions and upstream symbol checks.
- Board defaults cover the supplied AIOT ST7789 configuration, QSPI data pin
  aliases/internal pins, I2C reset/custom pins/address/clock, flyout shadow timing,
  manual edits, saved-workspace reopen, connected expressions and missing or
  unsupported board configurations.
- The importable `examples/hello-display.abi` was serialized, loaded into a fresh
  workspace and generated the same C++ code. The output is in `hello-display.ino`.
- C++ API compilation passed for ESP32 and ESP32-S3 using the installed GCC 14.2
  toolchain with `-fsyntax-only`, against the bundled source and real core headers.
  Fixtures exercised all 97 SPI/software-SPI profiles, the available QSPI profiles,
  all 51 font symbols, all three I2C display types, all eight I2C touch types,
  XPT2046, representative matching board presets, UI methods and generated code.
- A real designer export targeting resource ABI 19 was used for the UI API check.
  Old ABI 15/17 sample resources in the upstream repository were not substituted
  by editing their version assertions.
- Repository library validation passed at 99%; strict README/ABS checks and
  all 11 locale checks passed. The validator's generic suggestions concern the
  long reference document, board adaptation and Serial initialization; this
  library emits no Serial output.
- `7z t src.7z` passed. The archive contains 1,013 original source/metadata/notice
  files; its SHA-256 and upstream revision are in `source-manifest.json`.

These checks validate Blockly behavior and C++ API compatibility. Firmware
linking, memory budgets and behavior on physical hardware have not been tested;
`package.json` therefore retains `tested: false`.

To rerun the automated tests, extract `src.7z` in this directory, install the
sibling aily-blockly project's dependencies, and run from the libraries root:

```powershell
node --test nice_gfx/generator.test.cjs
node .scripts/check-i18n-compliance.js --library nice_gfx
node .scripts/check-readme-compliance.js nice_gfx --strict-abs
```

`AILY_BLOCKLY_ROOT` can point the test to another aily-blockly checkout.

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  loadLibraryContract,
  validateLibraryContractInventory,
  validateGeneratorProbe,
} = require('./readme-library-contracts');

const ROOT = path.resolve(__dirname, '..');
const HUMAN_README = 'readme.md';
const AI_README = 'readme_ai.md';
const HUMAN_MAX_BYTES = 1024;
const AI_MAX_BYTES = 5 * 1024;
// A complete block contract is more important than shaving a large library
// below an arbitrary prompt size. Keep 5KB as the review target, but allow a
// bounded 64KB skill for libraries whose canonical signatures and complete
// representative generated-code output need it. Silent code truncation is
// more harmful than a larger prompt for the small number of complex libraries.
const AI_HARD_MAX_BYTES = 64 * 1024;
const SKIP_DIRS = new Set([
  '.git',
  '.github',
  '.scripts',
  '.docs',
  '.docs_ai',
  '.vscode',
  'node_modules'
]);

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  } catch (error) {
    return null;
  }
}

function readJson(filePath) {
  const content = readText(filePath);
  if (content == null) return { ok: false, value: null, error: 'missing' };
  try {
    return { ok: true, value: JSON.parse(content), error: null };
  } catch (error) {
    return { ok: false, value: null, error: error.message };
  }
}

function byteLength(text) {
  return Buffer.byteLength(text || '', 'utf8');
}

function truncateBytes(value, maxBytes) {
  const text = String(value || '');
  if (byteLength(text) <= maxBytes) return text;
  let result = '';
  for (const char of text) {
    const next = result + char;
    if (byteLength(next + '...') > maxBytes) break;
    result = next;
  }
  return result.trimEnd() + '...';
}

function findFileCaseInsensitive(dir, expectedName) {
  if (!fs.existsSync(dir)) return null;
  const lower = expectedName.toLowerCase();
  const entry = fs.readdirSync(dir).find((name) => name.toLowerCase() === lower);
  return entry || null;
}

function toOneLine(value, fallback = 'N/A', maxLength = 160) {
  let text = '';
  if (typeof value === 'string') text = value;
  else if (value && typeof value === 'object' && value.url) text = value.url;
  else if (value != null) text = String(value);
  text = text.replace(/\s+/g, ' ').trim();
  if (!text) text = fallback;
  if (text.length > maxLength) text = text.slice(0, maxLength - 3).trimEnd() + '...';
  return text;
}

function hasCjk(text) {
  return /[\u3400-\u9FFF\uF900-\uFAFF]/.test(String(text || ''));
}

function cjkRatio(text) {
  const compact = String(text || '').replace(/\s+/g, '');
  if (!compact) return 0;
  const matches = compact.match(/[\u3400-\u9FFF\uF900-\uFAFF]/g) || [];
  return matches.length / compact.length;
}

function englishCandidate(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() && !hasCjk(value)) return value;
  }
  return '';
}

function humanizeIdentifier(value, fallback) {
  let text = String(value || fallback || '')
    .replace(/^@[^/]+\//, '')
    .replace(/^lib[-_]/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) text = 'Blockly Library';

  const upperWords = new Set([
    'adc', 'api', 'asr', 'ble', 'bmp', 'can', 'dac', 'dht', 'dns', 'fft', 'gps',
    'gpio', 'gsm', 'http', 'https', 'i2c', 'iic', 'imu', 'io', 'ir', 'json', 'lcd',
    'led', 'lvgl', 'mqtt', 'nfc', 'ntp', 'oled', 'ota', 'pwm', 'rfid', 'rtc', 'sd',
    'spi', 'tft', 'ttl', 'uart', 'usb', 'wifi'
  ]);

  return text.split(' ').map((word) => {
    if (!word) return word;
    if (/^[A-Z0-9]+$/.test(word)) return word;
    if (upperWords.has(word.toLowerCase())) return word.toUpperCase();
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

function tableCell(value, maxLength = 120) {
  return toOneLine(value, '', maxLength)
    .replace(/\|/g, '&#124;')
    .replace(/`/g, '\\`');
}

function packageTitle(pkg, libName) {
  const fallback = humanizeIdentifier(pkg.name || libName, libName);
  return toOneLine(
    englishCandidate(pkg.nickname_en, pkg.title_en, pkg.displayName_en, pkg.nickname, pkg.title, pkg.displayName) || fallback,
    fallback,
    80
  );
}

function packageDescription(pkg, title) {
  const fallback = `Blockly library for ${title}.`;
  return toOneLine(
    englishCandidate(pkg.description_en, pkg.summary_en, pkg.desc_en, pkg.description, pkg.summary, pkg.desc) || fallback,
    fallback,
    220
  );
}

function packageName(pkg, libName) {
  return toOneLine(pkg.name, `@aily-project/lib-${libName}`, 100);
}

function packageVersion(pkg) {
  return toOneLine(pkg.version, '0.0.0', 30);
}

function packageAuthor(pkg) {
  return toOneLine(pkg.author, 'Unknown', 80);
}

function packageSource(pkg) {
  const repo = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository && pkg.repository.url;
  return toOneLine(pkg.source || pkg.homepage || pkg.url || repo, 'N/A', 120);
}

function packageLicense(pkg) {
  return toOneLine(pkg.license, 'Original license', 60);
}

function supportedBoards(pkg) {
  const coreMap = {
    'arduino:avr': 'Arduino AVR',
    'arduino:samd': 'Arduino SAMD',
    'arduino:megaavr': 'Arduino Mega AVR',
    'arduino:renesas_uno': 'Arduino UNO R4',
    'esp32:esp32': 'ESP32',
    'esp8266:esp8266': 'ESP8266',
    'rp2040:rp2040': 'RP2040'
  };
  const cores = pkg.compatibility && Array.isArray(pkg.compatibility.core) ? pkg.compatibility.core : [];
  if (cores.length === 0) return 'Arduino-compatible boards supported by this package.';

  const boards = cores.map((core) => {
    const key = Object.keys(coreMap).find((candidate) => String(core).toLowerCase().includes(candidate));
    return key ? coreMap[key] : String(core);
  });
  return toOneLine([...new Set(boards)].join(', '), 'Arduino-compatible boards.', 180);
}

function getArgs(block) {
  const argKeys = Object.keys(block)
    .filter((key) => /^args\d+$/.test(key) && Array.isArray(block[key]))
    .sort((a, b) => Number(a.slice(4)) - Number(b.slice(4)));
  return argKeys.flatMap((key) => block[key]);
}

function visibleArgs(block) {
  return getArgs(block).filter((arg) => {
    if (!arg || !arg.type) return false;
    return ![
      'input_dummy',
      'field_image',
      'field_label',
      'field_label_serializable'
    ].includes(arg.type);
  });
}

function connectionType(block) {
  if (block.output !== undefined) return 'Value';
  const args = visibleArgs(block);
  const hasStatementInput = args.some((arg) => arg.type === 'input_statement');
  if (block.previousStatement === undefined && block.nextStatement === undefined && hasStatementInput) return 'Hat';
  if (/setup|loop/i.test(block.type || '') && block.previousStatement === undefined) return 'Hat';
  return 'Statement';
}

function paramType(arg) {
  if (arg.type === 'field_dropdown') return 'dropdown';
  return arg.type || 'unknown';
}

function paramsDescriptionFromArgs(args) {
  const params = (args || [])
    .filter((arg) => arg.name)
    .map((arg) => `${arg.name}(${paramType(arg)})`);
  return params.length > 0 ? params.join(', ') : '(none)';
}

function runtimeBlockDefinitions(contract) {
  const runtimeBlocks = contract?.runtimeBlocks;
  if (!runtimeBlocks || typeof runtimeBlocks !== 'object' || Array.isArray(runtimeBlocks)) return [];
  return Object.entries(runtimeBlocks).flatMap(([type, blockContract]) => {
    const definition = blockContract?.definition;
    if (!definition || typeof definition !== 'object' || Array.isArray(definition)) return [];
    return [{ ...definition, type }];
  });
}

function allDocumentedBlocks(blocks, contract = null) {
  const result = Array.isArray(blocks) ? [...blocks] : [];
  const seen = new Set(result.map(block => block?.type).filter(Boolean));
  for (const block of runtimeBlockDefinitions(contract)) {
    if (!seen.has(block.type)) {
      result.push(block);
      seen.add(block.type);
    }
  }
  return result;
}

function blockContractFor(contract, type) {
  if (!contract || !type) return null;
  return contract.blocks?.[type] || contract.runtimeBlocks?.[type] || null;
}

function allBlockContractEntries(contract) {
  if (!contract || typeof contract !== 'object' || Array.isArray(contract)) return [];
  const entries = new Map();
  for (const [type, blockContract] of Object.entries(contract.runtimeBlocks || {})) {
    entries.set(type, blockContract);
  }
  for (const [type, blockContract] of Object.entries(contract.blocks || {})) {
    entries.set(type, blockContract);
  }
  return [...entries.entries()];
}

function paramsDescription(block) {
  return paramsDescriptionFromArgs(visibleArgs(block));
}

function paramsDescriptionForBlock(block, blockContract = null) {
  const base = paramsDescriptionFromArgs(visibleArgs(block));
  const variants = Array.isArray(blockContract?.variants) ? blockContract.variants : [];
  const variadics = Array.isArray(blockContract?.variadic)
    ? blockContract.variadic
    : (blockContract?.variadic ? [blockContract.variadic] : []);
  const suffixes = variants.map((variant, index) => {
    const id = String(variant?.id || `variant-${index + 1}`);
    const appended = paramsDescriptionFromArgs(Array.isArray(variant?.appendArgs) ? variant.appendArgs : []);
    return `${id}: ${appended}`;
  });
  const parts = [];
  if (suffixes.length > 0) parts.push(`runtime variants: ${suffixes.join('; ')}`);
  if (variadics.length > 0) {
    parts.push(`variadic: ${variadics.map(item => (
      `${item.prefix}{${item.startIndex}...}(${item.type})`
    )).join(', ')}`);
  }
  return parts.length > 0 ? `${base}; ${parts.join('; ')}` : base;
}

function enumValue(value) {
  const text = String(value == null ? '' : value).trim();
  // An empty dropdown value is a real Blockly value (for example an omitted
  // C++ storage qualifier), not a documentation placeholder.
  if (!text) return '""';
  if (/^-?\d+(?:\.\d+)?$/.test(text)) return text;
  if (/^[A-Za-z_][A-Za-z0-9_:.\-]*$/.test(text)) return text;
  return `"${text.replace(/"/g, '\\"')}"`;
}

function valueInputExample(arg) {
  const checkValues = Array.isArray(arg.check) ? arg.check : (arg.check ? [arg.check] : []);
  const check = checkValues.join(' ').toLowerCase();
  const name = String(arg.name || '').toLowerCase();
  if (check.includes('boolean') || name.includes('bool') || name.includes('condition') || name === 'if') {
    return 'logic_boolean(true)';
  }
  if (check.includes('string') || check.includes('text') || /text|str|msg|message|ssid|password|topic|url|host/.test(name)) {
    return 'text("value")';
  }
  if (/pin/.test(name)) return 'math_number(2)';
  if (/baud|speed/.test(name)) return 'math_number(9600)';
  if (/time|delay|interval|duration|ms/.test(name)) return 'math_number(1000)';
  if (/angle|degree/.test(name)) return 'math_number(90)';
  if (/^(by|step)$/.test(name)) return 'math_number(1)';
  if (name === 'to') return 'math_number(10)';
  return 'math_number(0)';
}

function absArgExample(arg, compact = false) {
  if (arg && arg.example != null) return String(arg.example);
  switch (arg.type) {
    case 'field_input':
      return `"${String(arg.text || arg.name || 'value').replace(/"/g, '\\"')}"`;
    case 'field_number':
      return String(arg.value != null ? arg.value : 0);
    case 'field_dropdown': {
      const options = Array.isArray(arg.options) ? arg.options : [];
      const first = options[0];
      const value = Array.isArray(first) ? first[1] : first;
      return enumValue(value != null ? value : (arg.name || 'VALUE'));
    }
    case 'field_variable':
      // field_variable is already a Blockly field slot. Wrapping it in a
      // variables_get value block changes the ABI shape and cannot be imported
      // back into this slot.
      return `$${arg.variable || String(arg.name || 'var').toLowerCase()}`;
    case 'field_checkbox':
      return arg.checked === false ? 'FALSE' : 'TRUE';
    case 'field_colour':
      return `"${arg.colour || '#ff0000'}"`;
    case 'field_angle':
      return String(arg.angle != null ? arg.angle : 90);
    case 'field_angle180':
    case 'field_slider':
      return String(arg.value != null ? arg.value : 0);
    case 'field_colour_hsv_sliders':
      return `"${String(arg.colour || '#ff0000').replace(/"/g, '\\"')}"`;
    case 'field_multilinetext':
      return `"${String(arg.text || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, '\\n')}"`;
    case 'field_bitmap':
    case 'field_led_matrix':
    case 'field_led_pattern_selector': {
      const width = Math.max(1, Number(arg.width || arg.patternWidth || 8));
      const height = Math.max(1, Number(arg.height || arg.patternHeight || 8));
      return JSON.stringify(Array.from({ length: height }, () => Array(width).fill(0)));
    }
    case 'field_image_preview':
      return JSON.stringify({
        schemaVersion: 1,
        filePath: '',
        width: Math.max(1, Number(arg.defaultWidth || 100)),
        height: Math.max(1, Number(arg.defaultHeight || 100)),
        mediaType: '',
        byteLength: 0,
        image: null,
      });
    case 'field_led_matrix_image': {
      const mode = arg.mode === 'rgb' ? 'rgb' : 'mono';
      return JSON.stringify({
        schemaVersion: 1,
        mode,
        encoding: mode === 'rgb' ? 'rgba8888-v1' : 'mono-bitpack-v1',
        width: Math.max(1, Number(arg.width || 8)),
        height: Math.max(1, Number(arg.height || 8)),
        pixels: null,
      });
    }
    case 'field_tftespi_image':
    case 'field_tftespi_animation': {
      const format = arg.format === 'rgb332' ? 'rgb332' : 'rgb565';
      return JSON.stringify({
        schemaVersion: 1,
        format,
        encoding: format === 'rgb332' ? 'rgb332' : 'rgb565-be',
        width: Math.max(1, Number(arg.width || 160)),
        height: Math.max(1, Number(arg.height || 120)),
        fps: Math.max(1, Number(arg.fps || 10)),
        maxFrames: arg.type === 'field_tftespi_image' ? 1 : Math.max(1, Number(arg.maxFrames || 10)),
        frameCount: 0,
        frames: null,
      });
    }
    case 'field_bitmap_u8g2':
      return JSON.stringify({
        schemaVersion: 1,
        encoding: 'xbm-lsb-row-v1',
        width: Math.max(1, Number(arg.width || 128)),
        height: Math.max(1, Number(arg.height || 64)),
        bitmap: null,
      });
    case 'field_u8g2_animation':
      return JSON.stringify({
        schemaVersion: 1,
        encoding: 'xbm-lsb-row-v1',
        width: Math.max(1, Number(arg.width || 128)),
        height: Math.max(1, Number(arg.height || 64)),
        fps: Math.max(1, Number(arg.fps || 10)),
        maxFrames: Math.max(1, Number(arg.maxFrames || 30)),
        dither: Boolean(arg.dither),
        threshold: Number.isFinite(Number(arg.threshold)) ? Number(arg.threshold) : 127,
        frameCount: 0,
        frames: null,
      });
    case 'field_audio':
      // This repository's generator consumes the serialized project-relative
      // audioPath. An empty path is the safe, importable no-selection state.
      return JSON.stringify({ audioPath: '' });
    case 'input_value':
      return valueInputExample(arg);
    default:
      return null;
  }
}

function contractVariantArgs(block, blockContract, variantIndex = 0) {
  const baseArgs = visibleArgs(block);
  const variants = Array.isArray(blockContract?.variants) ? blockContract.variants : [];
  const variant = variants[variantIndex];
  const variadics = Array.isArray(blockContract?.variadic)
    ? blockContract.variadic
    : (blockContract?.variadic ? [blockContract.variadic] : []);
  const variadicSamples = variadics.flatMap(item => {
    const sampleCount = Number.isInteger(item?.sampleCount) ? item.sampleCount : 1;
    const startIndex = Number.isInteger(item?.startIndex) ? item.startIndex : 0;
    return Array.from({ length: sampleCount }, (_, offset) => ({
      name: `${item.prefix}${startIndex + offset}`,
      type: item.type,
      example: item.example,
      named: true,
      required: true,
    }));
  });
  if (!variant) return [...baseArgs, ...variadicSamples];
  const when = variant.when && typeof variant.when === 'object' ? variant.when : {};
  const configuredBase = baseArgs.map(arg => {
    const allowed = Array.isArray(when[arg.name]) ? when[arg.name] : [];
    return allowed.length > 0 ? { ...arg, example: enumValue(allowed[0]) } : arg;
  });
  return [
    ...configuredBase,
    ...(Array.isArray(variant.appendArgs) ? variant.appendArgs : []),
    ...variadicSamples,
  ];
}

function absFormat(block, compact = false, blockContract = null, variantIndex = 0) {
  const params = [];
  for (const arg of contractVariantArgs(block, blockContract, variantIndex)) {
    if (!arg.name) continue;
    if (arg.type === 'input_statement') {
      continue;
    }
    const example = absArgExample(arg, compact);
    if (example) params.push(arg.named === true ? `${arg.name}=${example}` : example);
  }

  // A compact contract must remain executable. Never replace arguments with
  // "..." and never put statement children on the same line as the call.
  // Statement slot names are already present in the Parameters column; a bare
  // parent call is the smallest valid table example.
  let text = `${block.type}(${params.join(', ')})`;
  return text;
}

function blockVarName(block) {
  const field = visibleArgs(block).find((arg) => arg.type === 'field_input' && arg.name === 'VAR');
  return field ? String(field.text || 'varName') : null;
}

function isInitBlock(block) {
  return /(?:^|_)(init|setup|begin|create|config|attach)(?:_|$)/i.test(block.type || '');
}

function findBlockGenerator(generatorContent, blockType) {
  if (!generatorContent) return null;
  const escaped = blockType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`Arduino\\.forBlock\\[['"]${escaped}['"]\\]\\s*=\\s*function[\\s\\S]*?(?=\\n\\s*Arduino\\.forBlock\\[['"]|\\n\\s*function\\s|\\n\\s*module\\.exports|$)`);
  const match = generatorContent.match(regex);
  return match ? match[0] : null;
}

function compactCodeSnippet(text) {
  if (!text) return 'See generator';
  const snippet = text.replace(/\r\n?/g, '\n').replace(/\n+/g, ' ↵ ').replace(/\s+/g, ' ').trim();
  if (snippet.length < 4 || !/[A-Za-z0-9_]/.test(snippet)) return 'Dynamic code';
  return snippet;
}

function generatedCode(generatorContent, blockType, compact = false, generatedCodePreview = null) {
  if (typeof generatedCodePreview === 'string' && generatedCodePreview.trim()) return generatedCodePreview.trim();
  if (compact) return 'generator';
  const body = findBlockGenerator(generatorContent, blockType);
  if (!body) return 'See generator';

  const templateReturn = body.match(/return\s+(?:\[\s*)?`([\s\S]*?)`/);
  if (templateReturn) return compactCodeSnippet(templateReturn[1].replace(/\$\{[^}]+\}/g, '...'));

  const stringReturn = body.match(/return\s+(?:\[\s*)?['"]([^'"]+)['"]/);
  if (stringReturn) return compactCodeSnippet(stringReturn[1]);

  const codeAssignment = body.match(/(?:const|let|var)\s+code\s*=\s*`([\s\S]*?)`/);
  if (codeAssignment) return compactCodeSnippet(codeAssignment[1].replace(/\$\{[^}]+\}/g, '...'));

  const stringAssignment = body.match(/(?:const|let|var)\s+code\s*=\s*['"]([^'"]+)['"]/);
  if (stringAssignment) return compactCodeSnippet(stringAssignment[1]);

  return 'Dynamic code';
}

function dropdownOptions(blocks) {
  const groups = new Map();
  for (const block of blocks) {
    for (const arg of visibleArgs(block)) {
      if (arg.type !== 'field_dropdown' || !arg.name || !Array.isArray(arg.options)) continue;
      const values = arg.options.map((option) => Array.isArray(option) ? option[1] : option).map(String);
      const labels = arg.options.map((option) => Array.isArray(option) ? option[0] : option).map(String);
      const key = `${arg.name}:${values.join('\u0001')}`;
      if (!groups.has(key)) {
        groups.set(key, { name: arg.name, values, labels, blocks: new Set() });
      }
      groups.get(key).blocks.add(block.type);
    }
  }
  return Array.from(groups.values());
}

function optionList(values, maxItems = 20) {
  if (values.length <= maxItems) return values.join(', ');
  return values.slice(0, maxItems).join(', ') + ', ...';
}

function generateHumanReadme(pkg, blocks, libName) {
  const title = packageTitle(pkg, libName);
  const description = packageDescription(pkg, title);
  const pkgName = packageName(pkg, libName);

  let md = '';
  md += `# ${title}\n\n`;
  md += `${description}\n\n`;
  md += '## Library Info\n\n';
  md += '| Field | Value |\n';
  md += '|-------|-------|\n';
  md += `| Package | ${tableCell(pkgName)} |\n`;
  md += `| Version | ${tableCell(packageVersion(pkg), 40)} |\n`;
  md += `| Author | ${tableCell(packageAuthor(pkg), 70)} |\n`;
  md += `| Source | ${tableCell(packageSource(pkg), 100)} |\n`;
  md += `| License | ${tableCell(packageLicense(pkg), 50)} |\n`;
  md += '\n## Supported Boards\n\n';
  md += `${supportedBoards(pkg)}\n\n`;
  md += '## Description\n\n';
  md += `${description}\n\n`;
  md += '## Quick Start\n\n';
  md += `1. Enable \`${pkgName}\` in Aily Blockly.\n`;
  md += '2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.\n';

  if (byteLength(md) <= HUMAN_MAX_BYTES) return md;

  const shortDescription = packageDescription({ description: description }, title).slice(0, 120).trimEnd();
  md = '';
  md += `# ${title}\n\n`;
  md += `${shortDescription}\n\n`;
  md += '## Library Info\n\n';
  md += '| Field | Value |\n';
  md += '|-------|-------|\n';
  md += `| Package | ${tableCell(pkgName, 90)} |\n`;
  md += `| Version | ${tableCell(packageVersion(pkg), 30)} |\n`;
  md += `| Author | ${tableCell(packageAuthor(pkg), 50)} |\n`;
  md += `| Source | ${tableCell(packageSource(pkg), 60)} |\n`;
  md += `| License | ${tableCell(packageLicense(pkg), 40)} |\n`;
  md += '\n## Supported Boards\n\n';
  md += `${toOneLine(supportedBoards(pkg), 'Arduino-compatible boards.', 90)}\n\n`;
  md += '## Description\n\n';
  md += `${shortDescription}\n\n`;
  md += '## Quick Start\n\n';
  md += `Enable \`${pkgName}\`, initialize required hardware in \`arduino_setup()\`, then use the blocks in \`arduino_loop()\`.\n`;
  if (byteLength(md) <= HUMAN_MAX_BYTES) return md;

  const tinyDescription = truncateBytes(description, 150);
  md = '';
  md += `# ${truncateBytes(title, 80)}\n\n`;
  md += `${tinyDescription}\n\n`;
  md += '## Library Info\n\n';
  md += '| Field | Value |\n';
  md += '|-------|-------|\n';
  md += `| Package | ${tableCell(pkgName, 70)} |\n`;
  md += `| Version | ${tableCell(packageVersion(pkg), 20)} |\n`;
  md += `| Author | ${tableCell(packageAuthor(pkg), 30)} |\n`;
  md += '| Source | N/A |\n';
  md += `| License | ${tableCell(packageLicense(pkg), 24)} |\n`;
  md += '\n## Supported Boards\n\n';
  md += `${truncateBytes(supportedBoards(pkg), 80)}\n\n`;
  md += '## Description\n\n';
  md += `${tinyDescription}\n\n`;
  md += '## Quick Start\n\n';
  md += `Enable \`${pkgName}\` in Aily Blockly and use its blocks in \`arduino_setup()\` / \`arduino_loop()\`.\n`;
  return md;
}

function generateAiReadme(
  pkg,
  blocks,
  generatorContent,
  libName,
  compact = false,
  contract = null,
  generatedCodePreviews = null,
) {
  blocks = allDocumentedBlocks(blocks, contract)
    .filter(block => blockContractFor(contract, block.type)?.agentVisible !== false);
  const title = packageTitle(pkg, libName);
  const description = packageDescription(pkg, title);
  const pkgName = packageName(pkg, libName);
  const version = packageVersion(pkg);
  const dropdowns = dropdownOptions(blocks);

  let md = '';
  md += `# ${title}\n\n`;
  md += `${description}\n\n`;
  md += '## Library Info\n';
  md += `- **Name**: ${pkgName}\n`;
  md += `- **Version**: ${version}\n\n`;
  md += '## Block Definitions\n\n';
  md += '| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |\n';
  md += '|------------|------------|--------------------------|------------|----------------|\n';

  for (const block of blocks) {
    const blockContract = blockContractFor(contract, block.type);
    md += `${generateBlockTableRow(
      block,
      generatorContent,
      compact,
      blockContract,
      generatedCodePreviews?.get(block.type),
    )}\n`;
  }

  if (dropdowns.length > 0) {
    md += '\n## Parameter Options\n\n';
    md += '| Parameter | Values | Description |\n';
    md += '|-----------|--------|-------------|\n';
    for (const info of dropdowns) {
      const blockHint = Array.from(info.blocks).slice(0, 3).join(', ');
      md += `| ${tableCell(info.name, 60)} | ${tableCell(optionList(info.values, compact ? 8 : 20), compact ? 80 : 220)} | ${tableCell(blockHint || info.labels.join(' / '), compact ? 70 : 100)} |\n`;
    }
  }

  if (!compact) {
    const hatBlock = blocks.find((block) => connectionType(block) === 'Hat');
    const initBlock = blocks.find(isInitBlock);
    const statementBlock = blocks.find((block) => connectionType(block) === 'Statement' && block !== initBlock);
    const valueBlock = blocks.find((block) => block.output !== undefined);
    md += '\n## ABS Examples\n\n';
    md += '### Basic Usage\n';
    md += '```\n';
    if (hatBlock) {
      const hatContract = blockContractFor(contract, hatBlock.type);
      md += `${absFormat(hatBlock, false, hatContract)}\n`;
      for (const statement of hatContract?.variants?.[0]?.appendArgs || []) {
        if (statement?.type === 'input_statement') {
          md += `    @${statement.name}:\n        ${statement.example}\n`;
        }
      }
      md += '\n';
    }
    md += 'arduino_setup()\n';
    const initContract = initBlock ? blockContractFor(contract, initBlock.type) : null;
    if (initBlock) {
      md += `    ${absFormat(initBlock, false, initContract)}\n`;
      for (const statement of initContract?.variants?.[0]?.appendArgs || []) {
        if (statement?.type === 'input_statement') {
          md += `        @${statement.name}:\n            ${statement.example}\n`;
        }
      }
    }
    md += '    serial_begin(Serial, 9600)\n\n';
    md += 'arduino_loop()\n';
    if (valueBlock) {
      md += `    serial_println(Serial, ${absFormat(valueBlock, false, blockContractFor(contract, valueBlock.type))})\n`;
    } else if (!hatBlock && statementBlock) {
      const statementContract = blockContractFor(contract, statementBlock.type);
      md += `    ${absFormat(statementBlock, false, statementContract)}\n`;
      for (const statement of statementContract?.variants?.[0]?.appendArgs || []) {
        if (statement?.type === 'input_statement') {
          md += `        @${statement.name}:\n            ${statement.example}\n`;
        }
      }
    }
    md += '    time_delay(math_number(1000))\n';
    md += '```\n';

    for (const variantBlock of blocks) {
      const blockContract = blockContractFor(contract, variantBlock.type);
      const variants = Array.isArray(blockContract?.variants) ? blockContract.variants : [];
      for (let variantIndex = 0; variantIndex < variants.length; variantIndex++) {
        const hasAppendedStatement = (variants[variantIndex]?.appendArgs || [])
          .some(arg => arg?.type === 'input_statement');
        // A first variant made only of value/field slots is already represented
        // by the canonical table and Basic Usage. Statement children cannot be
        // represented in a one-line table call, so emit that first variant too.
        if (variantIndex === 0 && !hasAppendedStatement) continue;
        if (variants[variantIndex]?.document === false) continue;
        const call = absFormat(variantBlock, false, blockContract, variantIndex);
        const statements = (variants[variantIndex]?.appendArgs || [])
          .filter(arg => arg?.type === 'input_statement');
        md += `\n### Runtime Variant: ${variantBlock.type}/${variants[variantIndex].id}\n`;
        md += '```\n';
        if (connectionType(variantBlock) === 'Hat') {
          md += `${call}\n`;
          for (const statement of statements) {
            md += `    @${statement.name}:\n        ${statement.example}\n`;
          }
        } else if (variantBlock.output !== undefined) {
          md += 'arduino_loop()\n';
          md += `    serial_println(Serial, ${call})\n`;
        } else if (isInitBlock(variantBlock)) {
          md += 'arduino_setup()\n';
          md += `    ${call}\n`;
          for (const statement of statements) {
            md += `        @${statement.name}:\n            ${statement.example}\n`;
          }
        } else {
          md += 'arduino_loop()\n';
          md += `    ${call}\n`;
          for (const statement of statements) {
            md += `        @${statement.name}:\n            ${statement.example}\n`;
          }
        }
        md += '```\n';
      }
    }
  }

  md += '\n## Notes\n\n';
  const creator = blocks.find((block) => blockVarName(block));
  let note = 1;
  if (creator) {
    md += `${note++}. **Variable**: \`${creator.type}\` creates a Blockly variable. Use \`$varName\` only for field_variable slots; input_value slots must use the explicit \`variables_get($varName)\` block.\n`;
  }
  md += `${note++}. **Parameter order**: ABS parameters follow \`block.json\` args order.\n`;
  md += `${note++}. **Input values**: use \`math_number(n)\`, \`text("s")\`, \`logic_boolean(true/false)\`, variables, or nested value blocks.\n`;
  const runtimeShapeBlocks = allBlockContractEntries(contract)
    .filter(([, blockContract]) => (
      (Array.isArray(blockContract?.variants) && blockContract.variants.length > 0)
      || blockContract?.variadic
    ))
    .map(([blockType]) => `\`${blockType}\``);
  const staticExtensionBlocks = blocks
    .filter((block) => Array.isArray(block.extensions) && block.extensions.length > 0)
    .filter((block) => blockContractFor(contract, block.type)?.staticShape === true)
    .map((block) => `\`${block.type}\``);
  const excludedRuntimeBlocks = allBlockContractEntries(contract)
    .filter(([, blockContract]) => Array.isArray(blockContract?.excludedRuntimeArgs)
      && blockContract.excludedRuntimeArgs.length > 0)
    .map(([blockType]) => `\`${blockType}\``);
  if (runtimeShapeBlocks.length > 0) {
    md += `${note++}. **Runtime shape**: only ${runtimeShapeBlocks.join(', ')} use the contract-declared runtime variants or indexed inputs shown in the block table and examples.\n`;
  }
  if (staticExtensionBlocks.length > 0) {
    md += `${note++}. **UI-only extensions**: ${staticExtensionBlocks.join(', ')} refresh presentation, validation, or board metadata without adding ABS arguments.\n`;
  }
  if (excludedRuntimeBlocks.length > 0) {
    md += `${note++}. **Compatibility-only inputs**: ${excludedRuntimeBlocks.join(', ')} retain hidden runtime inputs for old projects; do not emit those inputs in new ABS.\n`;
  }

  return md;
}

function generateAiReadmeWithinLimit(
  pkg,
  blocks,
  generatorContent,
  libName,
  contract = null,
  generatedCodePreviews = null,
) {
  const normal = generateAiReadme(pkg, blocks, generatorContent, libName, false, contract, generatedCodePreviews);
  if (byteLength(normal) <= AI_HARD_MAX_BYTES) return normal;
  return generateAiReadme(pkg, blocks, generatorContent, libName, true, contract, generatedCodePreviews);
}

function generateBlockTableRow(
  block,
  generatorContent = '',
  compact = false,
  blockContract = null,
  generatedCodePreview = null,
) {
  return `| \`${tableCell(block.type, 80)}\` | ${connectionType(block)} | ${tableCell(paramsDescriptionForBlock(block, blockContract), Number.MAX_SAFE_INTEGER)} | \`${tableCell(absFormat(block, compact, blockContract), Number.MAX_SAFE_INTEGER)}\` | \`${tableCell(generatedCode(generatorContent, block.type, compact, generatedCodePreview), Number.MAX_SAFE_INTEGER)}\` |`;
}

function trackedLibraryNames() {
  try {
    const output = execFileSync('git', ['ls-files', '-z', '*/block.json'], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    return new Set(output.split('\0').filter(Boolean).map(file => file.split('/')[0].toLowerCase()));
  } catch {
    return new Set();
  }
}

function getLibraryDirs(targets, trackedOnly = false) {
  if (targets.length > 0) {
    return targets.map((target) => path.resolve(ROOT, target)).filter((dir) => fs.existsSync(dir));
  }

  const tracked = trackedOnly ? trackedLibraryNames() : null;
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => !entry.name.startsWith('.') && !SKIP_DIRS.has(entry.name))
    .filter((entry) => !tracked || tracked.has(entry.name.toLowerCase()))
    .map((entry) => path.join(ROOT, entry.name))
    .filter((dir) => fs.existsSync(path.join(dir, 'package.json')) || fs.existsSync(path.join(dir, 'block.json')));
}

function issue(level, message) {
  return { level, message };
}

function findMatchingParen(text, openIndex) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = openIndex; index < text.length; index++) {
    const char = text[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '(') depth++;
    else if (char === ')' && --depth === 0) return index;
  }
  return -1;
}

function splitTopLevel(text, delimiter) {
  const parts = [];
  let start = 0;
  let quote = null;
  let escaped = false;
  let round = 0;
  let square = 0;
  let curly = 0;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '(') round++;
    else if (char === ')') round--;
    else if (char === '[') square++;
    else if (char === ']') square--;
    else if (char === '{') curly++;
    else if (char === '}') curly--;
    else if (char === delimiter && round === 0 && square === 0 && curly === 0) {
      parts.push(text.slice(start, index).trim());
      start = index + 1;
    }
  }
  parts.push(text.slice(start).trim());
  return parts.filter(Boolean);
}

function topLevelEquals(text) {
  let quote = null;
  let escaped = false;
  let round = 0;
  let square = 0;
  let curly = 0;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === '(') round++;
    else if (char === ')') round--;
    else if (char === '[') square++;
    else if (char === ']') square--;
    else if (char === '{') curly++;
    else if (char === '}') curly--;
    else if (char === '=' && round === 0 && square === 0 && curly === 0) return index;
  }
  return -1;
}

function parseAbsCall(callText) {
  const text = String(callText || '').trim();
  // Blockly block types are normally identifiers, but existing libraries also
  // contain numeric prefixes such as 74hc595_create. Match the runtime parser's
  // \w+ contract instead of imposing a JavaScript-identifier restriction.
  const match = text.match(/^(\w+)\s*\(/);
  if (!match) return { ok: false, error: 'is not an ABS block call' };
  const openIndex = text.indexOf('(', match[1].length);
  const closeIndex = findMatchingParen(text, openIndex);
  if (closeIndex < 0) return { ok: false, error: 'has unbalanced parentheses' };
  const trailing = text.slice(closeIndex + 1).trim();
  if (trailing && !/^(?:@extra:|::)\s*\{[\s\S]*\}$/.test(trailing)) {
    return { ok: false, error: `has unsupported trailing syntax: ${trailing}` };
  }
  return {
    ok: true,
    type: match[1],
    args: splitTopLevel(text.slice(openIndex + 1, closeIndex), ','),
  };
}

function isFieldVariableReference(value) {
  return /^\$(?:"(?:\\.|[^"\\])*"|[^\s(),=:+]+)(?::[^\s(),=]+)?$/.test(value);
}

function stripAbsStringsAndComments(value) {
  const text = String(value || '');
  let result = '';
  let quote = null;
  let escaped = false;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (quote) {
      result += ' ';
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      result += ' ';
      continue;
    }
    if (char === '#' || (char === '/' && text[index + 1] === '/')) {
      result += ' '.repeat(text.length - index);
      break;
    }
    result += char;
  }
  return result;
}

function normalizeAbsScalar(value) {
  const text = String(value == null ? '' : value).trim();
  if (text.length >= 2 && ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'")))) {
    return text.slice(1, -1);
  }
  return text;
}

function absSlotCandidates(block, blockContract) {
  const baseSlots = visibleArgs(block).filter((arg) => arg.name && arg.type !== 'input_statement');
  const variants = Array.isArray(blockContract?.variants) ? blockContract.variants : [];
  const variadics = Array.isArray(blockContract?.variadic)
    ? blockContract.variadic
    : (blockContract?.variadic ? [blockContract.variadic] : []);
  const variadicSamples = variadics.flatMap(item => {
    const sampleCount = Number.isInteger(item?.sampleCount) ? item.sampleCount : 1;
    const startIndex = Number.isInteger(item?.startIndex) ? item.startIndex : 0;
    return Array.from({ length: sampleCount }, (_, offset) => ({
      name: `${item.prefix}${startIndex + offset}`,
      type: item.type,
      example: item.example,
      named: true,
      required: true,
    }));
  });
  if (variants.length === 0) {
    return [{
      id: variadics.length > 0 ? 'variadic-sample' : 'static',
      slots: [...baseSlots, ...variadicSamples],
      when: {},
      variadics,
      statementSlots: [],
    }];
  }
  return variants.map((variant, index) => ({
    id: String(variant?.id || `variant-${index + 1}`),
    slots: [
      ...baseSlots,
      ...(Array.isArray(variant?.appendArgs)
        ? variant.appendArgs.filter(arg => arg?.type !== 'input_statement')
        : []),
      ...variadicSamples,
    ],
    when: variant?.when && typeof variant.when === 'object' ? variant.when : {},
    document: variant?.document !== false,
    variadics,
    statementSlots: Array.isArray(variant?.appendArgs)
      ? variant.appendArgs.filter(arg => arg?.type === 'input_statement')
      : [],
  }));
}

function validateAbsCallAgainstSlots(parsed, slots, when, location, requireComplete, variadics = []) {
  slots = [...slots]; // Dynamic arguments belong to this occurrence, not later examples.
  const messages = [];
  const slotByName = new Map(slots.map((arg) => [arg.name, arg]));
  const assigned = new Map();
  let positionalIndex = 0;

  for (const token of parsed.args) {
    const equalsIndex = topLevelEquals(token);
    if (equalsIndex > 0) {
      const name = token.slice(0, equalsIndex).trim();
      const value = token.slice(equalsIndex + 1).trim();
      if (!slotByName.has(name)) {
        const variadic = variadics.find(item => {
          const escaped = String(item.prefix).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const match = name.match(new RegExp(`^${escaped}(\\d+)$`));
          return match && Number(match[1]) >= item.startIndex;
        });
        if (variadic) {
          const dynamicSlot = { name, type: variadic.type, named: true };
          slots.push(dynamicSlot);
          slotByName.set(name, dynamicSlot);
        }
      }
      if (!slotByName.has(name)) {
        messages.push(`${location}: named argument ${name} is not declared by the static or runtime contract`);
        continue;
      }
      if (assigned.has(name)) messages.push(`${location}: argument ${name} is assigned more than once`);
      assigned.set(name, value);
      continue;
    }
    while (positionalIndex < slots.length && assigned.has(slots[positionalIndex].name)) positionalIndex++;
    if (positionalIndex >= slots.length) {
      messages.push(`${location}: has more arguments than the static or runtime contract declares`);
      continue;
    }
    const positionalSlot = slots[positionalIndex++];
    if (positionalSlot.named === true) {
      messages.push(`${location}: ${positionalSlot.name} must use named argument syntax`);
    }
    assigned.set(positionalSlot.name, token);
  }

  for (const slot of slots) {
    if ((requireComplete || slot.required === true) && !assigned.has(slot.name)) {
      messages.push(`${location}: missing ${slot.name}(${slot.type}) example`);
    }
  }

  for (const [name, allowedValues] of Object.entries(when || {})) {
    if (!assigned.has(name) || !Array.isArray(allowedValues)) continue;
    const actual = normalizeAbsScalar(assigned.get(name));
    if (!allowedValues.map(normalizeAbsScalar).includes(actual)) {
      messages.push(`${location}: ${name}=${actual} does not select this runtime signature`);
    }
  }

  for (const slot of slots) {
    if (!assigned.has(slot.name)) continue;
    const value = assigned.get(slot.name);
    const dropdownAllowed = slot.type === 'field_dropdown' && Array.isArray(slot.options)
      ? slot.options
        .map(option => Array.isArray(option) ? option[1] : option)
        .map(normalizeAbsScalar)
      : [];
    const normalizedValue = normalizeAbsScalar(value);
    const matchesDropdown = dropdownAllowed.includes(normalizedValue);
    if (slot.type === 'field_variable') {
      if (/^variables_get\s*\(/.test(value)) {
        messages.push(`${location}: ${slot.name} is field_variable and must use $name, not variables_get($name)`);
      } else if (!isFieldVariableReference(value)) {
        messages.push(`${location}: ${slot.name} is field_variable and must be a $name reference`);
      }
    } else if (slot.type !== 'input_value'
      && !matchesDropdown
      && /^[A-Za-z_][A-Za-z0-9_]*\s*\(/.test(value)) {
      messages.push(`${location}: ${slot.name} is ${slot.type}, not a value-input block`);
    }
    if (slot.type === 'field_dropdown' && Array.isArray(slot.options)) {
      if (dropdownAllowed.length > 0 && !matchesDropdown) {
        messages.push(`${location}: ${slot.name}=${normalizedValue} must be one of ${dropdownAllowed.join(', ')}`);
      }
    }
    if (slot.type === 'field_checkbox') {
      const actual = normalizeAbsScalar(value).toUpperCase();
      if (actual !== 'TRUE' && actual !== 'FALSE') {
        messages.push(`${location}: ${slot.name}=${value} must be TRUE or FALSE`);
      }
    }
    if (['field_number', 'field_angle', 'field_angle180', 'field_slider'].includes(slot.type)) {
      const actual = normalizeAbsScalar(value);
      if (!/^(?:-?\d+(?:\.\d+)?|-?0[xX][0-9A-Fa-f]+)$/.test(actual)) {
        messages.push(`${location}: ${slot.name}=${value} must be a numeric field value`);
      }
    }
    const structuredKinds = new Map([
      ['field_bitmap', 'array'],
      ['field_led_matrix', 'array'],
      ['field_led_pattern_selector', 'array'],
      ['field_image_preview', 'object'],
      ['field_led_matrix_image', 'object'],
      ['field_tftespi_image', 'object'],
      ['field_tftespi_animation', 'object'],
      ['field_bitmap_u8g2', 'object'],
      ['field_u8g2_animation', 'object'],
      ['field_audio', 'object'],
    ]);
    if (structuredKinds.has(slot.type)) {
      let parsedValue = null;
      try {
        parsedValue = JSON.parse(value);
      } catch {
        // Report the common contract message below.
      }
      const expected = structuredKinds.get(slot.type);
      const valid = expected === 'array'
        ? Array.isArray(parsedValue)
        : parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue);
      if (!valid) messages.push(`${location}: ${slot.name}(${slot.type}) must use structured JSON ${expected}`);
    }
  }
  return messages;
}

function validateAbsCall(block, callText, location, requireComplete, blockContract = null) {
  const parsed = parseAbsCall(callText);
  if (!parsed.ok) return [`${location}: ${parsed.error}`];
  if (parsed.type !== block.type) {
    return [`${location}: expected ${block.type}(...) but found ${parsed.type}(...)`];
  }
  const messages = [];
  const syntaxOnly = stripAbsStringsAndComments(callText);
  if (/\.{3}/.test(syntaxOnly)) messages.push(`${location}: contains non-executable "..." placeholder`);
  if (/\bchild_block\s*\(/.test(syntaxOnly)) messages.push(`${location}: contains child_block() placeholder`);

  const candidates = absSlotCandidates(block, blockContract);
  const candidateFindings = candidates.map(candidate => validateAbsCallAgainstSlots(
    parsed,
    candidate.slots,
    candidate.when,
    location,
    requireComplete,
    candidate.variadics,
  ));
  if (candidateFindings.some(findings => findings.length === 0)) return messages;
  // Prefer the runtime signature selected by its discriminator fields even
  // when another, shorter signature would yield fewer missing-slot messages.
  // Otherwise a 4x4 keypad call can be misleadingly diagnosed as a 3x1 call.
  const score = findings => findings.length
    + findings.filter(message => message.includes('does not select this runtime signature')).length * 1000;
  candidateFindings.sort((left, right) => score(left) - score(right));
  return [...messages, ...(candidateFindings[0] || [])];
}

function tableAbsForBlock(content, blockType) {
  for (const line of String(content || '').split(/\r?\n/)) {
    const cells = line.split('|');
    if (cells.length < 7 || cells[1].trim() !== `\`${blockType}\``) continue;
    const absCell = cells[4].trim();
    const first = absCell.indexOf('`');
    const last = absCell.lastIndexOf('`');
    return first >= 0 && last > first ? decodeTableCell(absCell.slice(first + 1, last)) : null;
  }
  return undefined;
}

function decodeTableCell(value) {
  return String(value || '')
    .replace(/&#124;/g, '|')
    .replace(/\\`/g, '`')
    .replace(/\s+/g, ' ')
    .trim();
}

function tableParametersForBlock(content, blockType) {
  for (const line of String(content || '').split(/\r?\n/)) {
    const cells = line.split('|');
    if (cells.length < 7 || cells[1].trim() !== `\`${blockType}\``) continue;
    return decodeTableCell(cells[3]);
  }
  return undefined;
}

function blockDefinitionRows(content) {
  const lines = String(content || '').split(/\r?\n/);
  const headingIndex = lines.findIndex(line => /^##\s+Block Definitions\s*$/.test(line));
  const start = headingIndex >= 0 ? headingIndex + 1 : 0;
  let end = lines.length;
  if (headingIndex >= 0) {
    for (let index = start; index < lines.length; index++) {
      if (/^##\s+/.test(lines[index])) {
        end = index;
        break;
      }
    }
  }
  const rows = [];
  for (let index = start; index < end; index++) {
    const cells = lines[index].split('|');
    if (cells.length < 7) continue;
    const type = cells[1].trim().match(/^`([^`]+)`$/)?.[1];
    if (!type) continue;
    rows.push({
      type,
      line: index + 1,
      parameters: decodeTableCell(cells[3]),
      abs: decodeTableCell(cells[4]),
      generatedCode: decodeTableCell(cells[5].trim().replace(/^`|`$/g, '')),
    });
  }
  return rows;
}

function fencedCodeBlocks(content) {
  const blocks = [];
  let inAbsExamples = false;
  let fence = null;
  let lines = [];
  for (const line of String(content || '').split(/\r?\n/)) {
    if (!fence) {
      const heading = line.match(/^##\s+(.+?)\s*$/);
      if (heading) inAbsExamples = heading[1].trim().toLowerCase().startsWith('abs');
    }
    const marker = line.match(/^\s*```\s*([A-Za-z0-9_-]*)\s*$/);
    if (marker) {
      if (!fence) {
        const language = marker[1].toLowerCase();
        fence = {
          executable: language === '' || language === 'abs' || (inAbsExamples && language === 'text'),
        };
        lines = [];
      } else {
        if (fence.executable) blocks.push(lines.join('\n'));
        fence = null;
        lines = [];
      }
      continue;
    }
    if (fence) lines.push(line);
  }
  return blocks;
}

function unfencedAbsExampleBlocks(content) {
  const blocks = [];
  let inAbsExamples = false;
  let inFence = false;
  let lines = [];
  const flush = () => {
    const text = lines.join('\n').trim();
    if (text) blocks.push(text);
    lines = [];
  };
  for (const line of String(content || '').split(/\r?\n/)) {
    if (!inFence) {
      const heading = line.match(/^##\s+(.+?)\s*$/);
      if (heading) {
        if (inAbsExamples) flush();
        inAbsExamples = heading[1].trim().toLowerCase().startsWith('abs');
      }
    }
    if (/^\s*```/.test(line)) {
      if (inAbsExamples && !inFence) flush();
      inFence = !inFence;
      continue;
    }
    if (inAbsExamples && !inFence) lines.push(line);
  }
  if (inAbsExamples) flush();
  return blocks;
}

function callsOfType(text, type) {
  return absCallsOfType(text, type).map(item => item.call);
}

/** Source identity matters: two identical calls can have different bodies. */
function absCallsOfType(text, type) {
  const calls = [];
  // Keep source offsets while excluding strings/comments from call discovery.
  const syntax = text.split('\n').map(stripAbsStringsAndComments).join('\n');
  const escapedType = type.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`\\b${escapedType}\\s*\\(`, 'g');
  let from = 0;
  while (from < text.length) {
    pattern.lastIndex = from;
    const match = pattern.exec(syntax);
    if (!match) break;
    const index = match.index;
    const openIndex = index + match[0].length - 1;
    const closeIndex = findMatchingParen(text, openIndex);
    if (closeIndex < 0) {
      calls.push({ call: text.slice(index), start: index });
      break;
    }
    calls.push({ call: text.slice(index, closeIndex + 1), start: index });
    // Nested calls of the same block type also need their own slot checks.
    from = openIndex + 1;
  }
  return calls;
}

/** Shared by own-library and cross-library checks. Read only this occurrence's
 * direct sections; nested/sibling blocks cannot satisfy the parent's slots. */
function callWithNamedValueInputs(region, call, candidate, start = region.indexOf(call)) {
  if (start < 0) return call;
  const lineStart = region.lastIndexOf('\n', start - 1) + 1;
  const prefix = region.slice(lineStart, start);
  if (prefix.trim()) return call; // An inline nested expression has no statement body.
  const parentIndent = prefix.length;
  const after = region.indexOf('\n', start + call.length);
  if (after < 0) return call;
  const candidates = absSlotCandidates(candidate.block, candidate.contract);
  const slots = candidates.flatMap(item => item.slots);
  const names = new Set(slots.filter(slot => slot.type === 'input_value').map(slot => slot.name));
  const accepted = name => names.has(name) || candidates.some(item => item.variadics.some(variadic => {
    const suffix = name.startsWith(variadic.prefix) ? name.slice(variadic.prefix.length) : '';
    return variadic.type === 'input_value' && /^\d+$/.test(suffix) && Number(suffix) >= variadic.startIndex;
  }));
  const named = [];
  const lines = region.slice(after + 1).split(/\r?\n/);
  let markerIndent;
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const indent = line.match(/^\s*/)[0].length;
    if (indent <= parentIndent) break;
    markerIndent ??= indent;
    if (indent !== markerIndent) continue;
    const marker = line.trim().match(/^@(\w+):\s*(.*)$/);
    if (!marker || !accepted(marker[1]) && !marker[2]) continue;
    let value = marker[2];
    if (!value && index + 1 < lines.length && lines[index + 1].match(/^\s*/)[0].length > indent) value = lines[++index].trim();
    const open = value.indexOf('(');
    while (open >= 0 && findMatchingParen(value, open) < 0 && index + 1 < lines.length) value += '\n' + lines[++index];
    if (value) named.push(`${marker[1]}=${value}`);
  }
  if (!named.length) return call;
  const existing = call.slice(call.indexOf('(') + 1, -1).trim();
  return `${call.slice(0, -1)}${existing ? ', ' : ''}${named.join(', ')})`;
}

function validateAbsExampleShape(example, exampleIndex) {
  const messages = [];
  const location = `ABS example ${exampleIndex + 1}`;
  String(example || '').split(/\r?\n/).forEach((line, lineIndex) => {
    const syntaxOnly = stripAbsStringsAndComments(line);
    if (!syntaxOnly.trim()) return;
    const lineLocation = `${location} line ${lineIndex + 1}`;
    if (/\.{3}/.test(syntaxOnly)) {
      messages.push(`${lineLocation}: contains non-executable "..." placeholder`);
    }
    if (/\bchild_block\s*\(/.test(syntaxOnly)) {
      messages.push(`${lineLocation}: contains child_block() placeholder`);
    }
    if (/\baction\s*\(/.test(syntaxOnly)) {
      messages.push(`${lineLocation}: contains action() placeholder`);
    }
    if (/\)\s+@(?!extra\s*:)[A-Za-z_][A-Za-z0-9_]*\s*:/.test(syntaxOnly)) {
      messages.push(`${lineLocation}: named statement input must be on its own indented line`);
    }
  });
  return messages;
}

function validateAiContract(contract, blocks) {
  if (contract == null) return [];
  const contractLabel = 'README library contract';
  const messages = [];
  if (!contract || typeof contract !== 'object' || Array.isArray(contract)) {
    return [`${contractLabel} must contain a JSON object`];
  }
  if (contract.schemaVersion !== 1) messages.push(`${contractLabel} schemaVersion must be 1`);
  if (!contract.blocks || typeof contract.blocks !== 'object' || Array.isArray(contract.blocks)) {
    messages.push(`${contractLabel} blocks must be an object`);
    return messages;
  }
  const staticBlocks = new Map((blocks || []).filter(Boolean).map(block => [block.type, block]));
  const knownBlocks = new Map(staticBlocks);
  const runtimeContracts = [];
  if (contract.runtimeBlocks !== undefined
    && (!contract.runtimeBlocks || typeof contract.runtimeBlocks !== 'object' || Array.isArray(contract.runtimeBlocks))) {
    messages.push(`${contractLabel} runtimeBlocks must be an object`);
  } else {
    for (const [blockType, blockContract] of Object.entries(contract.runtimeBlocks || {})) {
      const label = `${contractLabel} runtimeBlocks ${blockType}`;
      if (!/^[A-Za-z0-9_]+$/.test(blockType)) messages.push(`${label} key must be a block type identifier`);
      if (!blockContract || typeof blockContract !== 'object' || Array.isArray(blockContract)) {
        messages.push(`${label} must be an object`);
        continue;
      }
      if (staticBlocks.has(blockType)) {
        messages.push(`${label} duplicates a block.json definition`);
        continue;
      }
      if (Object.prototype.hasOwnProperty.call(contract.blocks, blockType)) {
        messages.push(`${label} must not also appear in blocks`);
        continue;
      }
      if (typeof blockContract.reason !== 'string' || !blockContract.reason.trim()) {
        messages.push(`${label} requires a non-empty reason`);
      }
      if (blockContract.agentVisible === false) {
        messages.push(`${label} cannot be agent-invisible; omit internal runtime blocks instead`);
      }
      const definition = blockContract.definition;
      if (!definition || typeof definition !== 'object' || Array.isArray(definition)) {
        messages.push(`${label} definition must be a block JSON object`);
        continue;
      }
      if (definition.type !== blockType) messages.push(`${label} definition.type must equal ${blockType}`);
      if (definition.output !== undefined && definition.previousStatement !== undefined) {
        messages.push(`${label} definition cannot have both output and previousStatement connections`);
      }
      for (const key of Object.keys(definition).filter(name => /^args\d+$/.test(name))) {
        if (!Array.isArray(definition[key])) {
          messages.push(`${label} definition.${key} must be an array`);
          continue;
        }
        for (const [index, arg] of definition[key].entries()) {
          if (!arg || typeof arg !== 'object' || Array.isArray(arg) || typeof arg.type !== 'string') {
            messages.push(`${label} definition.${key}[${index}] must declare an argument type`);
            continue;
          }
          if (![ 'input_dummy', 'field_image', 'field_label', 'field_label_serializable' ].includes(arg.type)
            && !/^[A-Za-z_][A-Za-z0-9_]*$/.test(arg.name || '')) {
            messages.push(`${label} definition.${key}[${index}] requires an argument name`);
          }
        }
      }
      const runtimeDefinition = { ...definition, type: blockType };
      knownBlocks.set(blockType, runtimeDefinition);
      runtimeContracts.push([blockType, blockContract, true]);
    }
  }
  const contractEntries = [
    ...Object.entries(contract.blocks).map(([type, blockContract]) => [type, blockContract, false]),
    ...runtimeContracts,
  ];
  for (const [blockType, blockContract, runtimeDefined] of contractEntries) {
    if (!knownBlocks.has(blockType)) {
      messages.push(`${contractLabel} declares unknown block ${blockType}`);
      continue;
    }
    const variants = Array.isArray(blockContract?.variants) ? blockContract.variants : [];
    const variadics = Array.isArray(blockContract?.variadic)
      ? blockContract.variadic
      : (blockContract?.variadic ? [blockContract.variadic] : []);
    const excludedRuntimeArgs = Array.isArray(blockContract?.excludedRuntimeArgs)
      ? blockContract.excludedRuntimeArgs
      : [];
    const probeArgs = [
      ...visibleArgs(knownBlocks.get(blockType)),
      ...(Array.isArray(variants[0]?.appendArgs) ? variants[0].appendArgs : []),
    ];
    for (const error of validateGeneratorProbe(blockContract?.generatorProbe, new Map(probeArgs.map(arg => [arg.name, arg.type])))) {
      messages.push(contractLabel + ' ' + blockType + ' ' + error);
    }
    if (blockContract?.agentVisible !== undefined && typeof blockContract.agentVisible !== 'boolean') {
      messages.push(`${contractLabel} ${blockType} agentVisible must be boolean`);
    }
    if (runtimeDefined && blockContract?.agentVisible === false) continue;
    if (blockContract?.agentVisible === false) {
      if (typeof blockContract.reason !== 'string' || !blockContract.reason.trim()) {
        messages.push(`${contractLabel} ${blockType} agentVisible false requires a non-empty reason`);
      }
      if (blockContract?.staticShape === true || variants.length > 0 || variadics.length > 0 || excludedRuntimeArgs.length > 0) {
        messages.push(`${contractLabel} ${blockType} agentVisible false cannot declare runtime-shape metadata`);
      }
      continue;
    }
    if (blockContract?.staticShape === true) {
      if (variants.length > 0 || variadics.length > 0 || excludedRuntimeArgs.length > 0) {
        messages.push(`${contractLabel} ${blockType} cannot declare staticShape with runtime variants, variadic inputs, or excluded runtime arguments`);
      }
      if (typeof blockContract.reason !== 'string' || !blockContract.reason.trim()) {
        messages.push(`${contractLabel} ${blockType} staticShape requires a non-empty reason`);
      }
      continue;
    }
    if (variants.length === 0 && variadics.length === 0 && excludedRuntimeArgs.length === 0
        && blockContract?.generatorProbe === undefined) {
      messages.push(`${contractLabel} ${blockType} must declare at least one runtime variant, variadic input, or excluded runtime argument`);
      continue;
    }
    const staticNames = new Set(visibleArgs(knownBlocks.get(blockType)).map(arg => arg.name).filter(Boolean));
    const excludedNames = new Set();
    for (const [index, arg] of excludedRuntimeArgs.entries()) {
      const label = `${contractLabel} ${blockType} excludedRuntimeArgs ${index + 1}`;
      if (!arg || typeof arg !== 'object' || Array.isArray(arg)) {
        messages.push(`${label} must be an object`);
        continue;
      }
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(arg.name || '')) {
        messages.push(`${label} name must be an identifier`);
      } else if (excludedNames.has(arg.name)) {
        messages.push(`${label} duplicates ${arg.name}`);
      } else excludedNames.add(arg.name);
      if (!['input_value', 'input_statement', 'field'].includes(arg.type)) {
        messages.push(`${label} type must be input_value, input_statement, or field`);
      }
      if (typeof arg.reason !== 'string' || !arg.reason.trim()) {
        messages.push(`${label} requires a non-empty reason`);
      }
    }
    const variadicPrefixes = new Set();
    for (const [index, variadic] of variadics.entries()) {
      const label = `${contractLabel} ${blockType} variadic ${index + 1}`;
      if (!variadic || typeof variadic !== 'object' || Array.isArray(variadic)) {
        messages.push(`${label} must be an object`);
        continue;
      }
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(variadic.prefix || '')) {
        messages.push(`${label} prefix must be an identifier`);
      } else if (variadicPrefixes.has(variadic.prefix)) {
        messages.push(`${label} duplicates prefix ${variadic.prefix}`);
      } else variadicPrefixes.add(variadic.prefix);
      if (!Number.isInteger(variadic.startIndex) || variadic.startIndex < 0) {
        messages.push(`${label} startIndex must be a non-negative integer`);
      }
      if (variadic.type !== 'input_value') {
        messages.push(`${label} type must be input_value`);
      }
      if (!Number.isInteger(variadic.sampleCount) || variadic.sampleCount < 0) {
        messages.push(`${label} sampleCount must be a non-negative integer (zero for optional repetitions)`);
      }
      if (variadic.example == null || String(variadic.example).trim() === '') {
        messages.push(`${label} requires an executable example`);
      }
      if (typeof variadic.reason !== 'string' || !variadic.reason.trim()) {
        messages.push(`${label} requires a non-empty reason`);
      }
    }
    const ids = new Set();
    for (const [index, variant] of variants.entries()) {
      const id = String(variant?.id || '');
      const appendArgs = Array.isArray(variant?.appendArgs) ? variant.appendArgs : [];
      const variantNames = new Set([
        ...staticNames,
        ...appendArgs.map(arg => arg?.name).filter(Boolean),
      ]);
      if (!id) messages.push(`${contractLabel} ${blockType} variant ${index + 1} is missing id`);
      else if (ids.has(id)) messages.push(`${contractLabel} ${blockType} has duplicate variant id ${id}`);
      else ids.add(id);
      if (!variant?.when || typeof variant.when !== 'object' || Array.isArray(variant.when)) {
        messages.push(`${contractLabel} ${blockType}/${id || index + 1} when must be an object`);
      } else {
        for (const [slotName, values] of Object.entries(variant.when)) {
          if (!variantNames.has(slotName)) messages.push(`${contractLabel} ${blockType}/${id || index + 1} when references unknown slot ${slotName}`);
          if (!Array.isArray(values) || values.length === 0) messages.push(`${contractLabel} ${blockType}/${id || index + 1} when.${slotName} must be a non-empty array`);
        }
      }
      if (variant?.document === false && (typeof variant.reason !== 'string' || !variant.reason.trim())) {
        messages.push(`${contractLabel} ${blockType}/${id || index + 1} document=false requires a non-empty reason`);
      }
      const names = new Set(staticNames);
      for (const arg of appendArgs) {
        if (!arg?.name || !arg?.type) {
          messages.push(`${contractLabel} ${blockType}/${id || index + 1} appendArgs require name and type`);
          continue;
        }
        if (names.has(arg.name)) messages.push(`${contractLabel} ${blockType}/${id || index + 1} duplicates slot ${arg.name}`);
        if (arg.example == null || String(arg.example).trim() === '') {
          messages.push(`${contractLabel} ${blockType}/${id || index + 1} ${arg.name} requires an executable example`);
        }
        names.add(arg.name);
      }
    }
  }
  return messages;
}

function validateAiAbsContracts(content, blocks, contract = null) {
  const messages = [];
  messages.push(...validateAiContract(contract, blocks));
  const documentedBlocks = allDocumentedBlocks(blocks, contract);
  const hiddenBlocks = documentedBlocks.filter(block => blockContractFor(contract, block?.type)?.agentVisible === false);
  blocks = documentedBlocks.filter(block => blockContractFor(contract, block?.type)?.agentVisible !== false);
  const visibleTypes = new Set(blocks.map(block => block?.type).filter(Boolean));
  const hiddenTypes = new Set(hiddenBlocks.map(block => block?.type).filter(Boolean));
  const rowCounts = new Map();
  for (const row of blockDefinitionRows(content)) {
    rowCounts.set(row.type, (rowCounts.get(row.type) || 0) + 1);
    if (!visibleTypes.has(row.type) && !hiddenTypes.has(row.type)) {
      messages.push(`Block Definitions contains unknown block type ${row.type} at line ${row.line}`);
    }
  }
  for (const [blockType, count] of rowCounts) {
    if (count > 1) messages.push(`Block Definitions contains ${count} rows for ${blockType}; expected exactly one`);
  }
  for (const block of hiddenBlocks) {
    if (tableAbsForBlock(content, block.type) !== undefined) {
      messages.push(`Block Definitions must not expose agent-invisible block ${block.type}`);
    }
  }
  for (const block of blocks) {
    if (!block || !block.type) continue;
    const actualParams = tableParametersForBlock(content, block.type);
    const expectedParams = paramsDescriptionForBlock(block, blockContractFor(contract, block.type));
    if (actualParams !== undefined && actualParams !== expectedParams) {
      messages.push(`Block Definitions ${block.type}: Parameters column must be ${expectedParams}`);
    }
    const tableAbs = tableAbsForBlock(content, block.type);
    if (!rowCounts.has(block.type)) {
      messages.push(`Block Definitions missing exact row for ${block.type}`);
    } else if (tableAbs === null) {
      messages.push(`Block Definitions row for ${block.type} has no backticked ABS call`);
    } else {
      messages.push(...validateAbsCall(
        block,
        tableAbs,
        `Block Definitions ${block.type}`,
        true,
        blockContractFor(contract, block.type),
      ));
      // Table cells are executable examples too. Check nested calls using
      // their own definitions rather than just accepting any input_value.
      for (const nested of blocks) {
        if (!nested?.type) continue;
        for (const call of callsOfType(tableAbs, nested.type)) {
          if (call === tableAbs) continue;
          messages.push(...validateAbsCall(nested, call,
            `Block Definitions ${block.type} nested ${nested.type}`, true,
            blockContractFor(contract, nested.type)));
        }
      }
    }
  }

  const examples = fencedCodeBlocks(content);
  const unfencedExamples = unfencedAbsExampleBlocks(content);
  const documentedExamples = [...examples, ...unfencedExamples];
  let libraryCallCount = 0;
  examples.forEach((example, exampleIndex) => {
    messages.push(...validateAbsExampleShape(example, exampleIndex));
  });
  documentedExamples.forEach((example, exampleIndex) => {
    for (const block of blocks) {
      if (!block || !block.type) continue;
      const calls = absCallsOfType(example, block.type);
      libraryCallCount += calls.length;
      for (const { call, start } of calls) {
        messages.push(...validateAbsCall(
          block,
          callWithNamedValueInputs(example, call, { block, contract: blockContractFor(contract, block.type) }, start),
          `ABS example ${exampleIndex + 1} ${block.type}`,
          true,
          blockContractFor(contract, block.type),
        ));
      }
    }
    for (const block of hiddenBlocks) {
      if (callsOfType(example, block.type).length > 0) {
        messages.push(`ABS example ${exampleIndex + 1} must not use agent-invisible block ${block.type}`);
      }
    }
  });
  if (examples.length === 0) messages.push('ABS examples: missing fenced executable example');
  else if (blocks.length > 0 && libraryCallCount === 0) {
    messages.push('ABS examples: no call uses a block declared by this library');
  }
  for (const block of blocks) {
    const blockContract = blockContractFor(contract, block?.type);
    const candidates = absSlotCandidates(block, blockContract);
    if (candidates.length <= 1 || candidates[0]?.id === 'static') continue;
    const documentedCalls = [];
    const tableAbs = tableAbsForBlock(content, block.type);
    if (typeof tableAbs === 'string') documentedCalls.push({ call: tableAbs, example: null });
    for (const example of documentedExamples) {
      for (const { call, start } of absCallsOfType(example, block.type)) documentedCalls.push({
        call: callWithNamedValueInputs(example, call, { block, contract: blockContract }, start), example });
    }
    for (const candidate of candidates) {
      if (candidate.document === false) continue;
      const covered = documentedCalls.some(({ call, example }) => {
        const parsed = parseAbsCall(call);
        const statementCovered = (candidate.statementSlots || []).every(slot => (
          typeof example === 'string'
          && new RegExp(`^\\s*@${String(slot.name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:`, 'm').test(example)
        ));
        return parsed.ok && parsed.type === block.type && validateAbsCallAgainstSlots(
          parsed,
          candidate.slots,
          candidate.when,
          `runtime variant ${candidate.id}`,
          true,
          candidate.variadics,
        ).length === 0 && statementCovered;
      });
      if (!covered) messages.push(`${block.type} runtime variant ${candidate.id} has no complete ABS example`);
    }
  }
  return [...new Set(messages)];
}

/**
 * Build a stable identity for an ABS contract finding.
 *
 * Example indexes are presentation details: moving an unchanged example from
 * the first fenced block to the second one must not look like a new semantic
 * regression. Block type, slot name and the actual diagnostic remain part of
 * the identity.
 */
function normalizeAbsContractFinding(message) {
  return String(message || '')
    .replace(/^ABS example\s+\d+(?:\s+line\s+\d+)?\s+/, 'ABS example ')
    .trim();
}

function countAbsContractFindings(findings) {
  const counts = new Map();
  for (const finding of findings) {
    const key = normalizeAbsContractFinding(finding);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

/**
 * Compare strict ABS findings without requiring a repository-wide whitelist.
 * A null baseline means the README did not exist at the comparison revision,
 * so every current finding is new and the new document must be contract-clean.
 */
function compareAiAbsContracts(
  beforeContent,
  beforeBlocks,
  afterContent,
  afterBlocks,
  beforeContract = null,
  afterContract = null,
) {
  const before = beforeContent == null
    ? []
    : validateAiAbsContracts(beforeContent, Array.isArray(beforeBlocks) ? beforeBlocks : [], beforeContract);
  const after = validateAiAbsContracts(afterContent || '', Array.isArray(afterBlocks) ? afterBlocks : [], afterContract);
  const remainingBefore = countAbsContractFindings(before);
  const remainingAfter = countAbsContractFindings(after);
  const added = [];
  const removed = [];

  for (const finding of after) {
    const key = normalizeAbsContractFinding(finding);
    const available = remainingBefore.get(key) || 0;
    if (available > 0) remainingBefore.set(key, available - 1);
    else added.push(finding);
  }

  for (const finding of before) {
    const key = normalizeAbsContractFinding(finding);
    const available = remainingAfter.get(key) || 0;
    if (available > 0) remainingAfter.set(key, available - 1);
    else removed.push(finding);
  }

  return { before, after, added, removed };
}

function validateHumanReadme(libDir, pkg, blocks) {
  const issues = [];
  const actual = findFileCaseInsensitive(libDir, HUMAN_README);
  if (!actual) {
    issues.push(issue('error', 'missing readme.md'));
    return issues;
  }
  if (actual !== HUMAN_README) issues.push(issue('error', `README file must be named ${HUMAN_README}`));

  const content = readText(path.join(libDir, actual)) || '';
  if (byteLength(content) > HUMAN_MAX_BYTES) issues.push(issue('error', `readme.md is ${byteLength(content)} bytes; max is ${HUMAN_MAX_BYTES}`));
  for (const section of ['Library Info', 'Supported Boards', 'Description', 'Quick Start']) {
    if (!new RegExp(`^##\\s+${section}\\s*$`, 'm').test(content)) {
      issues.push(issue('error', `readme.md missing section: ${section}`));
    }
  }
  const aiOnlyHeadings = /##\s*(块定义|字段类型映射|连接规则|使用示例|重要规则|Block Definitions|Parameter Options|ABS Examples|Notes)\b/i;
  if (aiOnlyHeadings.test(content)) {
    issues.push(issue('error', 'readme.md contains AI/block-reference sections'));
  }
  if (/\.abi格式|DSL格式|"fields"\s*:|"inputs"\s*:/.test(content)) {
    issues.push(issue('error', 'readme.md contains ABI/DSL implementation details'));
  }
  if (cjkRatio(content) > 0.12) {
    issues.push(issue('error', 'readme.md should use English as the primary language'));
  }
  return issues;
}

function validateAiReadme(libDir, pkg, blocks, options = {}) {
  const issues = [];
  const actual = findFileCaseInsensitive(libDir, AI_README);
  if (!actual) {
    issues.push(issue('error', 'missing readme_ai.md'));
    return issues;
  }
  if (actual !== AI_README) issues.push(issue('error', `AI README file must be named ${AI_README}`));

  let contract = Object.prototype.hasOwnProperty.call(options, 'contract')
    ? options.contract
    : null;
  if (!Object.prototype.hasOwnProperty.call(options, 'contract')) {
    try {
      contract = loadLibraryContract(path.basename(libDir));
    } catch (error) {
      issues.push(issue('error', error.message));
    }
  }

  const content = readText(path.join(libDir, actual)) || '';
  const documentedBlocks = allDocumentedBlocks(blocks, contract);
  const visibleBlocks = documentedBlocks.filter(block => blockContractFor(contract, block?.type)?.agentVisible !== false);
  const hiddenBlocks = documentedBlocks.filter(block => blockContractFor(contract, block?.type)?.agentVisible === false);
  const size = byteLength(content);
  if (size > AI_HARD_MAX_BYTES) issues.push(issue('error', `readme_ai.md is ${size} bytes; hard max is ${AI_HARD_MAX_BYTES}`));
  else if (size > AI_MAX_BYTES) issues.push(issue('info', `readme_ai.md is ${size} bytes; allowed for complex libraries but above 5KB target`));

  for (const section of ['Library Info', 'Block Definitions']) {
    if (!new RegExp(`^##\\s+${section}\\s*$`, 'm').test(content)) {
      issues.push(issue('error', `readme_ai.md missing section: ${section}`));
    }
  }
  if (!/\|\s*Block Type\s*\|\s*Connection\s*\|\s*Parameters \((?:args0|block\.json) order\)\s*\|\s*ABS Format\s*\|\s*Generated Code\s*\|/.test(content)) {
    issues.push(issue('error', 'readme_ai.md missing standard Block Definitions table'));
  }
  if (dropdownOptions(visibleBlocks).length > 0 && !/^##\s+Parameter Options\s*$/m.test(content)) {
    issues.push(issue('error', 'readme_ai.md missing Parameter Options section'));
  }
  for (const block of visibleBlocks) {
    const type = block && block.type;
    if (type && !content.includes(`\`${type}\``)) {
      issues.push(issue('error', `readme_ai.md missing block: ${type}`));
    }
  }
  if (/\.abi格式|DSL格式/.test(content)) {
    issues.push(issue('error', 'readme_ai.md uses legacy ABI/DSL wording instead of ABS'));
  }
  for (const block of hiddenBlocks) {
    if (tableAbsForBlock(content, block.type) !== undefined) {
      issues.push(issue('error', `readme_ai.md exposes agent-invisible block: ${block.type}`));
    }
  }
  for (const message of validateAiAbsContracts(content, blocks, contract)) {
    // Existing semantic debt is large, so the default compliance path reports
    // it without blocking unrelated library changes. --strict-abs audits a
    // complete target; --changed compares these findings against merge-base
    // and blocks only additions.
    issues.push(issue(options.strictAbs ? 'error' : 'info', `[ABS contract] ${message}`));
  }
  if (cjkRatio(content) > 0.12) {
    issues.push(issue('error', 'readme_ai.md should use English as the primary language'));
  }
  return issues;
}

function processLibrary(libDir, options) {
  const libName = path.basename(libDir);
  const pkgResult = readJson(path.join(libDir, 'package.json'));
  const blockResult = readJson(path.join(libDir, 'block.json'));
  const pkg = pkgResult.ok ? pkgResult.value : {};
  const blocks = blockResult.ok && Array.isArray(blockResult.value) ? blockResult.value : [];
  const result = {
    libName,
    issues: [],
    fixed: [],
    skipped: false
  };

  if (!pkgResult.ok && !blockResult.ok) {
    result.skipped = true;
    result.issues.push(issue('error', 'missing or invalid package.json and block.json'));
    return result;
  }
  if (!pkgResult.ok) result.issues.push(issue('error', `package.json invalid: ${pkgResult.error}`));
  if (!blockResult.ok) result.issues.push(issue('error', `block.json invalid: ${blockResult.error}`));
  if (blockResult.ok && !Array.isArray(blockResult.value)) result.issues.push(issue('error', 'block.json must be an array'));

  const localContract = findFileCaseInsensitive(libDir, 'readme_ai.contract.json');
  if (localContract) {
    result.issues.push(issue(
      'error',
      `${localContract} is a repository-maintenance artifact; move it to .scripts/contracts/readme-library-contracts/${libName}.json`,
    ));
  }

  if (options.fix) {
    result.issues.push(issue(
      'error',
      '--fix is disabled: generated README candidates require ABS contract validation and human review before replacement'
    ));
  }

  if (!options.aiOnly) result.issues.push(...validateHumanReadme(libDir, pkg, blocks));
  result.issues.push(...validateAiReadme(libDir, pkg, blocks, options));
  return result;
}

function printUsage() {
  console.log(`Usage:
  node .scripts/check-readme-compliance.js --all
  node .scripts/check-readme-compliance.js <libraryDir>

Options:
  --all      Scan all top-level Blockly library folders
  --fix      Disabled safety guard; exits without changing files
  --json       Print machine-readable JSON report
  --strict-abs Treat ABS contract findings as errors (migration/audit gate)
  --tracked    Scan only libraries whose block.json is tracked by Git
  --ai-only    Validate readme_ai.md without mixing in human readme.md debt
`);
}

function parseArgs(argv) {
  const options = { all: false, fix: false, json: false, strictAbs: false, tracked: false, aiOnly: false, targets: [] };
  for (const arg of argv) {
    if (arg === '--all') options.all = true;
    else if (arg === '--fix') options.fix = true;
    else if (arg === '--json') options.json = true;
    else if (arg === '--strict-abs') options.strictAbs = true;
    else if (arg === '--tracked') options.tracked = true;
    else if (arg === '--ai-only') options.aiOnly = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else options.targets.push(arg);
  }
  return options;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help || (!options.all && options.targets.length === 0)) {
    printUsage();
    return;
  }
  if (options.fix) {
    console.error('README auto-overwrite is disabled. Run readme:check and replace only a reviewed, contract-valid candidate.');
    process.exitCode = 2;
    return;
  }

  const dirs = getLibraryDirs(options.all ? [] : options.targets, options.tracked);
  const results = dirs.map((dir) => processLibrary(dir, options));
  if (options.all) {
    const inventoryErrors = validateLibraryContractInventory(dirs.map(dir => path.basename(dir)));
    if (inventoryErrors.length > 0) {
      results.push({
        libName: '.scripts/contracts/readme-library-contracts',
        issues: inventoryErrors.map(message => issue('error', message)),
        fixed: [],
        skipped: false,
      });
    }
  }
  const issueResults = results.filter((result) => result.issues.some((item) => item.level !== 'info'));
  const infoCount = results.reduce((sum, result) => sum + result.issues.filter((item) => item.level === 'info').length, 0);
  const fixedCount = results.reduce((sum, result) => sum + result.fixed.length, 0);

  if (options.json) {
    console.log(JSON.stringify({ checked: results.length, fixed: fixedCount, infoCount, results }, null, 2));
  } else {
    console.log(`Checked libraries: ${results.length}`);
    if (options.fix) console.log(`Updated files: ${fixedCount}`);
    console.log(`Libraries with errors: ${issueResults.length}`);
    if (infoCount > 0) console.log(`Informational notes: ${infoCount}`);

    for (const result of issueResults.slice(0, 80)) {
      console.log(`\n${result.libName}`);
      for (const item of result.issues.filter((entry) => entry.level !== 'info')) {
        console.log(`  [${item.level}] ${item.message}`);
      }
    }
    if (issueResults.length > 80) {
      console.log(`\n... ${issueResults.length - 80} more libraries with errors omitted`);
    }
  }

  if (issueResults.length > 0) process.exitCode = 1;
}

if (require.main === module) main();

module.exports = {
  generateHumanReadme,
  generateAiReadme,
  generateAiReadmeWithinLimit,
  processLibrary,
  validateHumanReadme,
  validateAiReadme,
  validateAiAbsContracts,
  validateAiContract,
  validateAbsCall,
  absFormat,
  absArgExample,
  generateBlockTableRow,
  paramsDescriptionForBlock,
  runtimeBlockDefinitions,
  allDocumentedBlocks,
  blockContractFor,
  normalizeAbsContractFinding,
  compareAiAbsContracts,
  validateAbsExampleShape,
  fencedCodeBlocks,
  blockDefinitionRows,
  unfencedAbsExampleBlocks,
  callsOfType,
  absCallsOfType,
  callWithNamedValueInputs,
  AI_HARD_MAX_BYTES,
};

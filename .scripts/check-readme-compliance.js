#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HUMAN_README = 'readme.md';
const AI_README = 'readme_ai.md';
const HUMAN_MAX_BYTES = 1024;
const AI_MAX_BYTES = 5 * 1024;
const AI_HARD_MAX_BYTES = 15 * 1024;
const SKIP_DIRS = new Set([
  '.git',
  '.github',
  '.scripts',
  '.scripts_git_action',
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

function normalizeEol(text) {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trimEnd() + '\n';
}

function findFileCaseInsensitive(dir, expectedName) {
  if (!fs.existsSync(dir)) return null;
  const lower = expectedName.toLowerCase();
  const entry = fs.readdirSync(dir).find((name) => name.toLowerCase() === lower);
  return entry || null;
}

function normalizeCaseFile(dir, expectedName) {
  const actual = findFileCaseInsensitive(dir, expectedName);
  if (!actual || actual === expectedName) return path.join(dir, expectedName);

  const actualPath = path.join(dir, actual);
  const tempPath = path.join(dir, `.__${expectedName}.case-tmp__`);
  const finalPath = path.join(dir, expectedName);

  if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  fs.renameSync(actualPath, tempPath);
  fs.renameSync(tempPath, finalPath);
  return finalPath;
}

function writeIfChanged(filePath, content) {
  const next = normalizeEol(content);
  const current = readText(filePath);
  if (current === next) return false;
  fs.writeFileSync(filePath, next, 'utf8');
  return true;
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

function paramsDescription(block) {
  const params = visibleArgs(block)
    .filter((arg) => arg.name)
    .map((arg) => `${arg.name}(${paramType(arg)})`);
  return params.length > 0 ? params.join(', ') : '(none)';
}

function enumValue(value) {
  const text = String(value == null ? '' : value).trim();
  if (!text) return 'VALUE';
  if (/^[A-Za-z_][A-Za-z0-9_:.\-]*$/.test(text)) return text;
  return `"${text.replace(/"/g, '\\"')}"`;
}

function valueInputExample(arg) {
  const checkValues = Array.isArray(arg.check) ? arg.check : (arg.check ? [arg.check] : []);
  const check = checkValues.join(' ').toLowerCase();
  const name = String(arg.name || '').toLowerCase();
  if (check.includes('boolean') || name.includes('bool') || name.includes('condition') || name === 'if') {
    return 'logic_boolean(TRUE)';
  }
  if (check.includes('string') || check.includes('text') || /text|str|msg|message|ssid|password|topic|url|host/.test(name)) {
    return 'text("value")';
  }
  if (/pin/.test(name)) return 'math_number(2)';
  if (/baud|speed/.test(name)) return 'math_number(9600)';
  if (/time|delay|interval|duration|ms/.test(name)) return 'math_number(1000)';
  if (/angle|degree/.test(name)) return 'math_number(90)';
  return 'math_number(0)';
}

function absArgExample(arg, compact = false) {
  switch (arg.type) {
    case 'field_input':
      return `"${String(arg.text || arg.name || 'value').replace(/"/g, '\\"')}"`;
    case 'field_number':
      return String(arg.value != null ? arg.value : 0);
    case 'field_dropdown': {
      const options = Array.isArray(arg.options) ? arg.options : [];
      const first = options[0];
      const value = Array.isArray(first) ? first[1] : first;
      return enumValue(value || arg.name || 'VALUE');
    }
    case 'field_variable':
      return compact
        ? `$${arg.variable || String(arg.name || 'var').toLowerCase()}`
        : `variables_get($${arg.variable || String(arg.name || 'var').toLowerCase()})`;
    case 'field_checkbox':
      return arg.checked === false ? 'FALSE' : 'TRUE';
    case 'field_colour':
      return `"${arg.colour || '#ff0000'}"`;
    case 'field_angle':
      return String(arg.angle != null ? arg.angle : 90);
    case 'input_value':
      return valueInputExample(arg);
    default:
      return null;
  }
}

function absFormat(block, compact = false) {
  const params = [];
  const statementSlots = [];
  for (const arg of visibleArgs(block)) {
    if (!arg.name) continue;
    if (arg.type === 'input_statement') {
      statementSlots.push(arg.name);
      continue;
    }
    const example = absArgExample(arg, compact);
    if (example) params.push(example);
  }

  const maxParams = compact && params.length > 4 ? params.slice(0, 4).concat('...') : params;
  let text = `${block.type}(${maxParams.join(', ')})`;
  if (statementSlots.length > 0) {
    text += ' ' + statementSlots.map((slot) => `@${slot}: child_block()`).join(' ');
  }
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
  const snippet = text.replace(/\s+/g, ' ').trim().slice(0, 90);
  if (snippet.length < 4 || !/[A-Za-z0-9_]/.test(snippet)) return 'Dynamic code';
  return snippet;
}

function generatedCode(generatorContent, blockType, compact = false) {
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

function generateAiReadme(pkg, blocks, generatorContent, libName, compact = false) {
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
  md += '| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |\n';
  md += '|------------|------------|--------------------------|------------|----------------|\n';

  for (const block of blocks) {
    md += `| \`${tableCell(block.type, 80)}\` | ${connectionType(block)} | ${tableCell(paramsDescription(block), compact ? 90 : 160)} | \`${tableCell(absFormat(block, compact), compact ? 120 : 220)}\` | ${tableCell(generatedCode(generatorContent, block.type, compact), compact ? 60 : 100)} |\n`;
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
    const initBlock = blocks.find(isInitBlock) || blocks.find((block) => connectionType(block) === 'Statement');
    const valueBlock = blocks.find((block) => block.output !== undefined);
    md += '\n## ABS Examples\n\n';
    md += '### Basic Usage\n';
    md += '```\n';
    md += 'arduino_setup()\n';
    if (initBlock) md += `    ${absFormat(initBlock)}\n`;
    md += '    serial_begin(Serial, 9600)\n\n';
    md += 'arduino_loop()\n';
    if (valueBlock) md += `    serial_println(Serial, ${absFormat(valueBlock)})\n`;
    else if (initBlock && blocks.length > 1) md += `    ${absFormat(blocks.find((block) => block !== initBlock) || initBlock)}\n`;
    md += '    time_delay(math_number(1000))\n';
    md += '```\n';
  }

  md += '\n## Notes\n\n';
  const creator = blocks.find((block) => blockVarName(block));
  let note = 1;
  if (creator) {
    md += `${note++}. **Variable**: \`${creator.type}("varName", ...)\` creates variable \`$varName\`; reference it later with \`variables_get($varName)\`.\n`;
  }
  md += `${note++}. **Parameter order**: ABS parameters follow \`block.json\` args order.\n`;
  md += `${note++}. **Input values**: use \`math_number(n)\`, \`text("s")\`, \`logic_boolean(TRUE/FALSE)\`, variables, or nested value blocks.\n`;
  const dynamicBlocks = blocks.filter((block) => Array.isArray(block.extensions) && block.extensions.length > 0);
  if (dynamicBlocks.length > 0) {
    md += `${note++}. **Dynamic fields**: ${dynamicBlocks.map((block) => `\`${block.type}\``).join(', ')} may add fields at runtime through Blockly extensions.\n`;
  }

  return md;
}

function generateAiReadmeWithinLimit(pkg, blocks, generatorContent, libName) {
  const normal = generateAiReadme(pkg, blocks, generatorContent, libName, false);
  if (byteLength(normal) <= AI_HARD_MAX_BYTES) return normal;
  return generateAiReadme(pkg, blocks, generatorContent, libName, true);
}

function getLibraryDirs(targets) {
  if (targets.length > 0) {
    return targets.map((target) => path.resolve(ROOT, target)).filter((dir) => fs.existsSync(dir));
  }

  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => !entry.name.startsWith('.') && !SKIP_DIRS.has(entry.name))
    .map((entry) => path.join(ROOT, entry.name))
    .filter((dir) => fs.existsSync(path.join(dir, 'package.json')) || fs.existsSync(path.join(dir, 'block.json')));
}

function issue(level, message) {
  return { level, message };
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

function validateAiReadme(libDir, pkg, blocks) {
  const issues = [];
  const actual = findFileCaseInsensitive(libDir, AI_README);
  if (!actual) {
    issues.push(issue('error', 'missing readme_ai.md'));
    return issues;
  }
  if (actual !== AI_README) issues.push(issue('error', `AI README file must be named ${AI_README}`));

  const content = readText(path.join(libDir, actual)) || '';
  const size = byteLength(content);
  if (size > AI_HARD_MAX_BYTES) issues.push(issue('error', `readme_ai.md is ${size} bytes; hard max is ${AI_HARD_MAX_BYTES}`));
  else if (size > AI_MAX_BYTES) issues.push(issue('info', `readme_ai.md is ${size} bytes; allowed for complex libraries but above 5KB target`));

  for (const section of ['Library Info', 'Block Definitions']) {
    if (!new RegExp(`^##\\s+${section}\\s*$`, 'm').test(content)) {
      issues.push(issue('error', `readme_ai.md missing section: ${section}`));
    }
  }
  if (!/\|\s*Block Type\s*\|\s*Connection\s*\|\s*Parameters \(args0 order\)\s*\|\s*ABS Format\s*\|\s*Generated Code\s*\|/.test(content)) {
    issues.push(issue('error', 'readme_ai.md missing standard Block Definitions table'));
  }
  if (dropdownOptions(blocks).length > 0 && !/^##\s+Parameter Options\s*$/m.test(content)) {
    issues.push(issue('error', 'readme_ai.md missing Parameter Options section'));
  }
  for (const block of blocks) {
    const type = block && block.type;
    if (type && !content.includes(`\`${type}\``)) {
      issues.push(issue('error', `readme_ai.md missing block: ${type}`));
    }
  }
  if (/\.abi格式|DSL格式/.test(content)) {
    issues.push(issue('error', 'readme_ai.md uses legacy ABI/DSL wording instead of ABS'));
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
  const generatorContent = readText(path.join(libDir, 'generator.js')) || '';
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

  if (options.fix && pkgResult.ok) {
    const humanPath = normalizeCaseFile(libDir, HUMAN_README);
    const aiPath = normalizeCaseFile(libDir, AI_README);
    if (writeIfChanged(humanPath, generateHumanReadme(pkg, blocks, libName))) result.fixed.push(HUMAN_README);
    if (blockResult.ok && Array.isArray(blockResult.value)) {
      const aiContent = generateAiReadmeWithinLimit(pkg, blocks, generatorContent, libName);
      if (writeIfChanged(aiPath, aiContent)) result.fixed.push(AI_README);
    }
  }

  result.issues.push(...validateHumanReadme(libDir, pkg, blocks));
  result.issues.push(...validateAiReadme(libDir, pkg, blocks));
  return result;
}

function printUsage() {
  console.log(`Usage:
  node .scripts/check-readme-compliance.js --all [--fix]
  node .scripts/check-readme-compliance.js <libraryDir> [--fix]

Options:
  --all      Scan all top-level Blockly library folders
  --fix      Regenerate readme.md and readme_ai.md from package.json/block.json
  --json     Print machine-readable JSON report
`);
}

function parseArgs(argv) {
  const options = { all: false, fix: false, json: false, targets: [] };
  for (const arg of argv) {
    if (arg === '--all') options.all = true;
    else if (arg === '--fix') options.fix = true;
    else if (arg === '--json') options.json = true;
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

  const dirs = getLibraryDirs(options.all ? [] : options.targets);
  const results = dirs.map((dir) => processLibrary(dir, options));
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
  validateAiReadme
};
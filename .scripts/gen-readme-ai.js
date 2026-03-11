/**
 * Auto-generate readme.md and readme_ai.md for libraries missing readme_ai.md
 * Based on Blockly_Library_README_Conventions.md
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Libraries/folders to skip
const SKIP = new Set(['node_modules', 'scripts', 'scripts_git_action', '.docs_ai', '.git', '.github', '.vscode']);

function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch { return null; }
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch { return null; }
}

/**
 * Determine connection type from block definition
 */
function getConnectionType(block) {
  if (block.output !== undefined) return 'Value';
  if (block.previousStatement !== undefined || block.nextStatement !== undefined) return 'Statement';
  // Hat blocks (like arduino_setup)
  if (block.type && (block.type.includes('setup') || block.type.includes('loop'))) return 'Hat';
  return 'Statement';
}

/**
 * Map args0 to parameter description string
 */
function getParamsDesc(args0) {
  if (!args0 || args0.length === 0) return '(none)';
  return args0.map(arg => {
    let typeName = '';
    switch (arg.type) {
      case 'field_input': typeName = 'field_input'; break;
      case 'field_number': typeName = 'field_number'; break;
      case 'field_dropdown': typeName = 'dropdown'; break;
      case 'field_variable': typeName = 'field_variable'; break;
      case 'input_value': typeName = 'input_value'; break;
      case 'input_statement': typeName = 'input_statement'; break;
      case 'input_dummy': return null;
      case 'field_image': return null;
      case 'field_label': return null;
      case 'field_label_serializable': return null;
      case 'field_checkbox': typeName = 'field_checkbox'; break;
      case 'field_colour': typeName = 'field_colour'; break;
      case 'field_angle': typeName = 'field_angle'; break;
      default: typeName = arg.type || 'unknown';
    }
    if (!arg.name) return null;
    return `${arg.name}(${typeName})`;
  }).filter(Boolean).join(', ');
}

/**
 * Build ABS format string for a block
 */
function buildABSFormat(block, args0) {
  if (!args0 || args0.length === 0) return `\`${block.type}()\``;
  
  const params = [];
  const stmtSlots = [];
  
  for (const arg of args0) {
    if (!arg.name) continue;
    if (arg.type === 'input_dummy' || arg.type === 'field_image' || arg.type === 'field_label' || arg.type === 'field_label_serializable') continue;

    if (arg.type === 'input_statement') {
      stmtSlots.push(arg.name);
      continue;
    }

    switch (arg.type) {
      case 'field_input':
        params.push(`"${arg.text || arg.name.toLowerCase()}"`);
        break;
      case 'field_number':
        params.push(`${arg.value !== undefined ? arg.value : 0}`);
        break;
      case 'field_dropdown':
        if (arg.options && Array.isArray(arg.options) && arg.options.length > 0) {
          params.push(Array.isArray(arg.options[0]) ? arg.options[0][1] : String(arg.options[0]));
        } else {
          params.push(arg.name);
        }
        break;
      case 'field_variable':
        params.push(`variables_get($${arg.variable || arg.name.toLowerCase()})`);
        break;
      case 'field_checkbox':
        params.push(arg.checked !== false ? 'TRUE' : 'FALSE');
        break;
      case 'field_angle':
        params.push(`${arg.angle || 90}`);
        break;
      case 'field_colour':
        params.push(`"${arg.colour || '#ff0000'}"`);
        break;
      case 'input_value':
        // Guess a reasonable default based on name
        const nameLower = arg.name.toLowerCase();
        if (nameLower.includes('pin') && nameLower.includes('digi')) {
          params.push('io_pin_digi(2)');
        } else if (nameLower.includes('pin') && nameLower.includes('adc')) {
          params.push('io_pin_adc(A0)');
        } else if (nameLower.includes('pin') && nameLower.includes('pwm')) {
          params.push('io_pin_pwm(9)');
        } else if (nameLower.includes('pin')) {
          params.push('math_number(2)');
        } else if (nameLower === 'value' || nameLower === 'val' || nameLower === 'num') {
          params.push('math_number(0)');
        } else if (nameLower.includes('text') || nameLower.includes('str') || nameLower.includes('msg') || nameLower.includes('message')) {
          params.push('text("hello")');
        } else if (nameLower.includes('bool') || nameLower === 'condition') {
          params.push('logic_boolean(TRUE)');
        } else if (nameLower.includes('time') || nameLower.includes('delay') || nameLower.includes('interval') || nameLower.includes('ms')) {
          params.push('math_number(1000)');
        } else if (nameLower.includes('speed') || nameLower.includes('baud')) {
          params.push('math_number(9600)');
        } else if (nameLower.includes('color') || nameLower.includes('colour')) {
          params.push('math_number(0)');
        } else {
          params.push(`math_number(0)`);
        }
        break;
      default:
        break;
    }
  }

  let abs = `\`${block.type}(${params.join(', ')})\``;
  
  // Append statement slots
  for (const slot of stmtSlots) {
    abs += ` @${slot}: ...`;
  }
  
  return abs;
}

/**
 * Try to extract generated code from generator.js for a specific block type
 */
function extractGeneratedCode(generatorContent, blockType) {
  if (!generatorContent) return '—';
  
  // Look for Arduino.forBlock['blockType'] pattern
  const patterns = [
    new RegExp(`Arduino\\.forBlock\\['${blockType}'\\]\\s*=\\s*function\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*?)(?=\\nArduino\\.forBlock|\\n\\}\\s*;?\\s*$|\\n[A-Z][a-z]|\\nfunction |\\nif \\(!?Arduino)`, 'g'),
    new RegExp(`Arduino\\.forBlock\\['${blockType}'\\]\\s*=\\s*function\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*?)\\n\\};`, 'g'),
  ];
  
  for (const regex of patterns) {
    const match = regex.exec(generatorContent);
    if (match) {
      const body = match[1];
      // Try to find return statement
      const returnMatch = body.match(/return\s+(?:\[?\s*)?[`'"](.*?)[`'"]/);
      if (returnMatch) {
        let code = returnMatch[1]
          .replace(/\$\{[^}]+\}/g, '...')
          .replace(/['"`]\s*\+\s*[^+]+\+\s*['"`]/g, '...')
          .trim();
        if (code.length > 80) code = code.substring(0, 77) + '...';
        return `\`${code}\`` || '—';
      }
      
      // Try template literal
      const templateMatch = body.match(/return\s+(?:\[?\s*)?`(.*?)`/s);
      if (templateMatch) {
        let code = templateMatch[1]
          .replace(/\$\{[^}]+\}/g, '...')
          .replace(/\n/g, ' ')
          .trim();
        if (code.length > 80) code = code.substring(0, 77) + '...';
        return `\`${code}\`` || '—';
      }
      
      // Try string concatenation return
      const concatReturn = body.match(/return\s+(?:\[?\s*)?(\w+)\s*\+/);
      if (concatReturn) {
        return '(dynamic code)';
      }
      
      // Check for code variable
      const codeVar = body.match(/(?:let|var|const)\s+code\s*=\s*[`'"](.*?)[`'"]/);
      if (codeVar) {
        let code = codeVar[1].replace(/\$\{[^}]+\}/g, '...').trim();
        if (code) return `\`${code}\``;
      }
      
      return '(dynamic code)';
    }
  }
  return '—';
}

/**
 * Extract dropdown options from block args0
 */
function extractDropdownOptions(blocks) {
  const options = {};
  for (const block of blocks) {
    if (!block.args0) continue;
    for (const arg of block.args0) {
      if (arg.type === 'field_dropdown' && arg.options && Array.isArray(arg.options) && arg.options.length > 0 && arg.name) {
        if (!options[arg.name]) {
          options[arg.name] = {
            values: arg.options.map(o => Array.isArray(o) ? o[1] : String(o)),
            labels: arg.options.map(o => Array.isArray(o) ? o[0] : String(o)),
          };
        }
      }
    }
  }
  return options;
}

/**
 * Get i18n translation for better labels
 */
function getI18n(libDir) {
  const enPath = path.join(libDir, 'i18n', 'en.json');
  const zhPath = path.join(libDir, 'i18n', 'zh_cn.json');
  return readJSON(enPath) || readJSON(zhPath) || {};
}

/**
 * Generate readme.md content
 */
function generateReadme(pkg, blocks, libName) {
  const name = pkg.nickname || pkg.name || libName;
  const description = pkg.description || `${name} Blockly library`;
  const version = pkg.version || '1.0.0';
  const author = pkg.author || 'Aily';
  const packageName = pkg.name || `@aily-project/lib-${libName}`;
  const license = pkg.license || 'MIT';
  const source = pkg.url || pkg.homepage || pkg.source || '';
  
  // Figure out supported boards from compatibility
  let boards = 'Arduino UNO, ESP32';
  if (pkg.compatibility && pkg.compatibility.core) {
    const cores = pkg.compatibility.core;
    if (cores.length > 0) {
      const boardMap = {
        'arduino:avr': 'Arduino AVR (UNO/Nano/Mega)',
        'esp32:esp32': 'ESP32',
        'esp8266:esp8266': 'ESP8266',
        'arduino:samd': 'Arduino SAMD',
        'arduino:megaavr': 'Arduino Mega AVR',
        'arduino:renesas_uno': 'Arduino UNO R4',
        'rp2040:rp2040': 'Raspberry Pi Pico',
        'raspberry': 'Raspberry Pi Pico',
      };
      const mapped = cores.map(c => {
        for (const [key, val] of Object.entries(boardMap)) {
          if (c.toLowerCase().includes(key.toLowerCase())) return val;
        }
        return c;
      });
      if (mapped.length > 0) boards = [...new Set(mapped)].join(', ');
    }
  }
  
  const blockCount = blocks ? blocks.length : 0;
  
  let md = `# ${name}\n\n${description}\n\n`;
  md += `## Library Info\n\n`;
  md += `| Field | Value |\n|-------|-------|\n`;
  md += `| Package | ${packageName} |\n`;
  md += `| Version | ${version} |\n`;
  md += `| Author | ${author} |\n`;
  if (source) md += `| Source | ${source} |\n`;
  md += `| License | ${license} |\n`;
  md += `\n## Supported Boards\n\n${boards}\n`;
  md += `\n## Description\n\n${description}\n`;
  if (blockCount > 0) {
    md += `\nThis library provides ${blockCount} Blockly blocks.\n`;
  }
  md += `\n## Quick Start\n\nAdd the library to your project and use the provided blocks in the Aily Blockly editor.\n`;
  
  return md;
}

/**
 * Generate readme_ai.md content
 */
function generateReadmeAI(pkg, blocks, generatorContent, libName) {
  const name = pkg.nickname || pkg.name || libName;
  const description = pkg.description || `${name} Blockly library`;
  const version = pkg.version || '1.0.0';
  const packageName = pkg.name || `@aily-project/lib-${libName}`;
  
  let md = `# ${name}\n\n${description}\n\n`;
  md += `## Library Info\n- **Name**: ${packageName}\n- **Version**: ${version}\n\n`;
  
  if (!blocks || blocks.length === 0) {
    md += `## Block Definitions\n\nNo blocks defined.\n`;
    return md;
  }
  
  // Block definitions table
  md += `## Block Definitions\n\n`;
  md += `| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |\n`;
  md += `|------------|------------|--------------------------|------------|----------------|\n`;
  
  const initBlocks = [];
  const varCreators = [];
  
  for (const block of blocks) {
    const conn = getConnectionType(block);
    const paramsDesc = getParamsDesc(block.args0);
    const absFormat = buildABSFormat(block, block.args0);
    const genCode = extractGeneratedCode(generatorContent, block.type);
    md += `| \`${block.type}\` | ${conn} | ${paramsDesc} | ${absFormat} | ${genCode} |\n`;
    
    // Track init blocks for examples
    if (block.type.includes('init') || block.type.includes('setup') || block.type.includes('begin') || block.type.includes('create')) {
      initBlocks.push(block);
      // Check if it creates a variable
      if (block.args0) {
        const fieldInput = block.args0.find(a => a.type === 'field_input' && a.name === 'VAR');
        if (fieldInput) {
          varCreators.push({ block, varName: fieldInput.text || 'obj' });
        }
      }
    }
  }
  
  // Parameter options
  const dropdownOpts = extractDropdownOptions(blocks);
  if (Object.keys(dropdownOpts).length > 0) {
    md += `\n## Parameter Options\n\n`;
    md += `| Parameter | Values | Description |\n`;
    md += `|-----------|--------|-------------|\n`;
    for (const [paramName, info] of Object.entries(dropdownOpts)) {
      const vals = info.values.join(', ');
      const descs = info.labels.join(' / ');
      md += `| ${paramName} | ${vals} | ${descs} |\n`;
    }
  }
  
  // ABS Examples
  md += `\n## ABS Examples\n\n### Basic Usage\n\`\`\`\n`;
  
  // Build a basic example
  md += `arduino_setup()\n`;
  if (initBlocks.length > 0) {
    for (const ib of initBlocks) {
      const absClean = buildABSFormat(ib, ib.args0).replace(/`/g, '');
      md += `    ${absClean}\n`;
    }
  }
  md += `    serial_begin(Serial, 9600)\n`;
  md += `\narduino_loop()\n`;
  
  // Find value blocks for reading
  const valueBlocks = blocks.filter(b => b.output !== undefined && !b.type.includes('init') && !b.type.includes('pin') && !b.type.includes('mode') && !b.type.includes('state'));
  if (valueBlocks.length > 0) {
    const vb = valueBlocks[0];
    const absClean = buildABSFormat(vb, vb.args0).replace(/`/g, '');
    md += `    serial_println(Serial, ${absClean})\n`;
  }
  md += `    time_delay(math_number(1000))\n`;
  md += `\`\`\`\n`;
  
  // Notes
  md += `\n## Notes\n\n`;
  if (varCreators.length > 0) {
    md += `1. **Variable Creation**: \`${varCreators[0].block.type}("varName", ...)\` creates variable \`$varName\`; reference with \`variables_get($varName)\`\n`;
    md += `2. **Initialization**: Place init blocks inside \`arduino_setup()\`\n`;
  } else {
    md += `1. **Initialization**: Place init/setup blocks inside \`arduino_setup()\`\n`;
  }
  md += `${varCreators.length > 0 ? 3 : 2}. **Parameter Order**: Follows \`block.json\` args0 order\n`;
  
  return md;
}

/**
 * Process a single library
 */
function processLibrary(libDir, libName) {
  const pkgPath = path.join(libDir, 'package.json');
  const blockPath = path.join(libDir, 'block.json');
  const genPath = path.join(libDir, 'generator.js');
  
  const pkg = readJSON(pkgPath);
  if (!pkg) {
    console.log(`  [SKIP] No package.json: ${libName}`);
    return false;
  }
  
  // Skip hidden libraries
  if (pkg.hide === true) {
    console.log(`  [SKIP] Hidden: ${libName}`);
    return false;
  }
  
  const blocks = readJSON(blockPath);
  const generatorContent = readFile(genPath);
  
  if (!blocks && !generatorContent) {
    console.log(`  [SKIP] No block.json or generator.js: ${libName}`);
    return false;
  }
  
  // Check if there's an existing readme.md
  const existingReadmePath = path.join(libDir, 'readme.md');
  const existingReadme = readFile(existingReadmePath);
  
  // Generate readme_ai.md
  const readmeAI = generateReadmeAI(pkg, blocks || [], generatorContent, libName);
  const readmeAIPath = path.join(libDir, 'readme_ai.md');
  fs.writeFileSync(readmeAIPath, readmeAI, 'utf8');
  console.log(`  [OK] readme_ai.md: ${libName}`);
  
  // Generate readme.md only if it doesn't exist or is empty/minimal
  if (!existingReadme || existingReadme.trim().length < 50) {
    const readme = generateReadme(pkg, blocks || [], libName);
    fs.writeFileSync(existingReadmePath, readme, 'utf8');
    console.log(`  [OK] readme.md: ${libName}`);
  } else {
    console.log(`  [KEEP] readme.md exists: ${libName}`);
  }
  
  return true;
}

function main() {
  const dirs = fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.') && !SKIP.has(d.name));
  
  // Find libraries missing readme_ai.md
  const missing = dirs.filter(d => {
    const aiPath1 = path.join(ROOT, d.name, 'readme_ai.md');
    const aiPath2 = path.join(ROOT, d.name, 'README_AI.md');
    return !fs.existsSync(aiPath1) && !fs.existsSync(aiPath2);
  });
  
  console.log(`Total libraries: ${dirs.length}`);
  console.log(`Missing readme_ai.md: ${missing.length}`);
  console.log('---');
  
  let generated = 0;
  let skipped = 0;
  
  for (const d of missing) {
    const libDir = path.join(ROOT, d.name);
    const result = processLibrary(libDir, d.name);
    if (result) generated++;
    else skipped++;
  }
  
  console.log('---');
  console.log(`Generated: ${generated}, Skipped: ${skipped}`);
}

main();

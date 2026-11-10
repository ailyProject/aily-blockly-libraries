#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LANGUAGES = ['zh_cn', 'en', 'zh_hk', 'ja', 'ko', 'de', 'fr', 'es', 'pt', 'ru', 'ar'];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function getLibraries(root = ROOT) {
  return fs.readdirSync(root, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(name => ['block.json', 'toolbox.json', 'package.json']
      .every(file => fs.existsSync(path.join(root, name, file))))
    .sort();
}

function getRequestedLibraries(args) {
  const libraries = [];

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument !== '--library') {
      throw new Error(`unknown argument: ${argument}`);
    }

    const library = args[index + 1];
    if (!library || library.startsWith('--')) {
      throw new Error('--library requires a library name');
    }
    libraries.push(library);
    index += 1;
  }

  return [...new Set(libraries)];
}

function collectToolbox(node, isRoot = true, output = { categories: [], labels: [] }) {
  if (!node || typeof node !== 'object') return output;
  if (!isRoot && node.kind === 'category' && typeof node.name === 'string') {
    output.categories.push(node.name);
  }
  if (node.kind === 'label' && typeof node.text === 'string') {
    output.labels.push(node.text);
  }
  if (Array.isArray(node.contents)) {
    node.contents.forEach(child => collectToolbox(child, false, output));
  }
  return output;
}

function protectedTokens(text) {
  if (typeof text !== 'string') return [];
  // Blockly consumes %% as a literal percent, so %%1 is not argument %1.
  return (text.match(/%%|%\d+|\$\{[^}]+\}/g) || [])
    .filter(token => token !== '%%')
    .map(token => token.replace(/^%0+(?=\d)/, '%'))
    .sort();
}

function sameTokens(source, translated) {
  return JSON.stringify(protectedTokens(source)) === JSON.stringify(protectedTokens(translated));
}

function validateMessageArguments(message, args = []) {
  if (typeof message !== 'string') return ['must be a string'];
  if (!Array.isArray(args)) return ['arguments must be an array'];
  // These references are expanded from Blockly.Msg at runtime and can contain
  // their own argument placeholders. Their coverage cannot be checked here.
  const references = message.match(/%%|%\{BKY_[A-Z]\w*\}/gi) || [];
  if (references.some(token => token !== '%%')) return [];

  const issues = [];
  const visited = new Set();
  for (const token of protectedTokens(message)) {
    if (!/^%\d+$/.test(token)) continue;
    const index = Number(token.slice(1));
    if (index < 1 || index > args.length) {
      issues.push(`references out-of-range argument ${token} (${args.length} arg(s))`);
    } else if (visited.has(index)) {
      issues.push(`references argument ${token} more than once`);
    }
    visited.add(index);
  }
  const missing = args.map((_, index) => index + 1).filter(index => !visited.has(index));
  if (missing.length) {
    issues.push(`does not reference all ${args.length} arg(s); missing ${missing.map(index => `%${index}`).join(', ')}`);
  }
  return issues;
}

function validateDropdowns(sourceBlock, translatedBlock, report) {
  for (const [argsKey, sourceArgs] of Object.entries(sourceBlock)) {
    if (!/^args\d+$/.test(argsKey) || !Array.isArray(sourceArgs)) continue;
    const translatedArgs = translatedBlock[argsKey];
    if (translatedArgs === undefined) continue;
    if (!Array.isArray(translatedArgs) || translatedArgs.length !== sourceArgs.length) {
      report(`${argsKey} structure does not match block.json`);
      continue;
    }

    sourceArgs.forEach((sourceArg, argIndex) => {
      if (!sourceArg || sourceArg.type !== 'field_dropdown' || !Array.isArray(sourceArg.options)) return;
      const translatedArg = translatedArgs[argIndex];
      if (!translatedArg || !Array.isArray(translatedArg.options)) {
        report(`${argsKey}[${argIndex}] is missing dropdown options`);
        return;
      }
      if (translatedArg.options.length !== sourceArg.options.length) {
        report(`${argsKey}[${argIndex}] dropdown option count does not match block.json`);
        return;
      }

      sourceArg.options.forEach((sourceOption, optionIndex) => {
        const translatedOption = translatedArg.options[optionIndex];
        if (!Array.isArray(translatedOption) || translatedOption.length < 2) {
          report(`${argsKey}[${argIndex}].options[${optionIndex}] is invalid`);
          return;
        }
        if (translatedOption[1] !== sourceOption[1]) {
          report(`${argsKey}[${argIndex}].options[${optionIndex}] changed machine value`);
        }
        if (typeof translatedOption[0] !== 'string' || !translatedOption[0].trim()) {
          report(`${argsKey}[${argIndex}].options[${optionIndex}] has no display label`);
        }
      });
    });
  }
}

function findMarker(value, currentPath = '') {
  if (typeof value === 'string') {
    return /__AILY|class=["']notranslate["']/.test(value) ? currentPath : null;
  }
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const result = findMarker(value[index], `${currentPath}[${index}]`);
      if (result) return result;
    }
    return null;
  }
  if (isObject(value)) {
    for (const [key, child] of Object.entries(value)) {
      const result = findMarker(child, currentPath ? `${currentPath}.${key}` : key);
      if (result) return result;
    }
  }
  return null;
}

function main(argv = process.argv.slice(2), root = ROOT) {
  if (argv.includes('--help')) {
    console.log(`Usage: node .scripts/check-i18n-compliance.js [--library <name>]...

Without --library, all libraries are validated. Repeat --library to validate only
the named libraries, including all required locale files for each library.`);
    return 0;
  }
  const errors = [];
  const availableLibraries = getLibraries(root);
  let requestedLibraries = [];
  let hasArgumentError = false;
  try {
    requestedLibraries = getRequestedLibraries(argv);
  } catch (error) {
    errors.push(`arguments: ${error.message}`);
    hasArgumentError = true;
  }

  const availableLibrarySet = new Set(availableLibraries);
  for (const library of requestedLibraries) {
    if (!availableLibrarySet.has(library)) {
      errors.push(`${library}: library does not exist or is missing block.json, toolbox.json, or package.json`);
    }
  }
  const libraries = hasArgumentError
    ? []
    : (requestedLibraries.length
      ? requestedLibraries.filter(library => availableLibrarySet.has(library))
      : availableLibraries);
  let localeFiles = 0;

  for (const library of libraries) {
    const libraryDir = path.join(root, library);
    let blocks;
    let toolbox;
    try {
      blocks = readJson(path.join(libraryDir, 'block.json'));
      toolbox = readJson(path.join(libraryDir, 'toolbox.json'));
    } catch (error) {
      errors.push(`${library}: cannot parse source JSON: ${error.message}`);
      continue;
    }
    if (!Array.isArray(blocks)) {
      errors.push(`${library}/block.json: root must be an array`);
      continue;
    }

    for (const block of blocks) {
      if (!isObject(block)) continue;
      for (const [key, message] of Object.entries(block)) {
        if (!/^message\d+$/.test(key)) continue;
        const args = block[key.replace('message', 'args')];
        for (const issue of validateMessageArguments(message, args)) {
          errors.push(`${library}/block.json: ${block.type}.${key} ${issue}`);
        }
      }
    }

    const toolboxParts = collectToolbox(toolbox);
    const toolboxLabels = [...new Set(toolboxParts.labels)];

    for (const language of LANGUAGES) {
      const relativeFile = `${library}/i18n/${language}.json`;
      const file = path.join(root, relativeFile);
      if (!fs.existsSync(file)) {
        errors.push(`${relativeFile}: missing locale file`);
        continue;
      }
      localeFiles += 1;

      let locale;
      try {
        locale = readJson(file);
      } catch (error) {
        errors.push(`${relativeFile}: invalid JSON: ${error.message}`);
        continue;
      }
      if (!isObject(locale)) {
        errors.push(`${relativeFile}: root must be an object`);
        continue;
      }
      const report = message => errors.push(`${relativeFile}: ${message}`);

      if (typeof locale.toolbox_name !== 'string' || !locale.toolbox_name.trim()) {
        report('toolbox_name is missing or empty');
      }
      if (Object.prototype.hasOwnProperty.call(locale, 'blocks')) {
        report('obsolete top-level "blocks" wrapper is not allowed');
      }

      if (toolboxParts.categories.length) {
        if (!Array.isArray(locale.toolbox_categories) ||
            locale.toolbox_categories.length !== toolboxParts.categories.length ||
            locale.toolbox_categories.some(value => typeof value !== 'string' || !value.trim())) {
          report(`toolbox_categories must contain ${toolboxParts.categories.length} non-empty translations`);
        }
      }
      if (toolboxLabels.length) {
        if (!isObject(locale.toolbox_labels)) {
          report('toolbox_labels is missing');
        } else {
          for (const label of toolboxLabels) {
            if (typeof locale.toolbox_labels[label] !== 'string' || !locale.toolbox_labels[label].trim()) {
              report(`toolbox_labels[${JSON.stringify(label)}] is missing or empty`);
            }
          }
        }
      }

      for (const sourceBlock of blocks) {
        const blockType = sourceBlock && sourceBlock.type;
        if (typeof blockType !== 'string' || !blockType) {
          report('block.json contains a block without a valid type');
          continue;
        }
        const translatedBlock = locale[blockType];
        if (!isObject(translatedBlock)) {
          report(`${blockType} is missing or is not an object`);
          continue;
        }

        for (const [key, sourceText] of Object.entries(sourceBlock)) {
          if (!/^message\d+$/.test(key) || typeof sourceText !== 'string') continue;
          const translatedText = translatedBlock[key];
          if (typeof translatedText !== 'string' || (sourceText.trim() && !translatedText.trim())) {
            report(`${blockType}.${key} is missing or empty`);
          } else if (!sameTokens(sourceText, translatedText)) {
            report(`${blockType}.${key} changed protected placeholders`);
          }
          if (typeof translatedText === 'string') {
            const args = sourceBlock[key.replace('message', 'args')];
            for (const issue of validateMessageArguments(translatedText, args)) {
              report(`${blockType}.${key} ${issue}`);
            }
          }
        }

        if (typeof sourceBlock.tooltip === 'string' && sourceBlock.tooltip.trim() &&
            !/^%\{[^}]+\}$/.test(sourceBlock.tooltip.trim())) {
          const translatedTooltip = translatedBlock.tooltip;
          if (typeof translatedTooltip !== 'string' || !translatedTooltip.trim()) {
            report(`${blockType}.tooltip is missing or empty`);
          } else if (!sameTokens(sourceBlock.tooltip, translatedTooltip)) {
            report(`${blockType}.tooltip changed protected placeholders`);
          }
        }

        validateDropdowns(sourceBlock, translatedBlock, message => report(`${blockType}.${message}`));
      }

      const markerPath = findMarker(locale);
      if (markerPath) report(`${markerPath} contains a translation marker`);
    }
  }

  if (errors.length) {
    console.error(`i18n validation failed with ${errors.length} issue(s):`);
    errors.slice(0, 200).forEach(error => console.error(`- ${error}`));
    if (errors.length > 200) console.error(`- ... ${errors.length - 200} more issue(s)`);
    return 1;
  } else {
    console.log(`i18n validation passed: ${libraries.length} libraries, ${localeFiles} locale files, ${LANGUAGES.length} languages.`);
    return 0;
  }
}

if (require.main === module) process.exitCode = main();

module.exports = { main, protectedTokens, sameTokens, validateMessageArguments };

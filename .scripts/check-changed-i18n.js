#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { main: checkI18n } = require('./check-i18n-compliance');

const ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const options = { base: null, head: null, mergeBase: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--base' || arg === '--head') {
      const revision = argv[++index];
      if (!revision || revision.startsWith('--')) throw new Error(`${arg} requires a Git revision`);
      options[arg.slice(2)] = revision;
    } else if (arg === '--merge-base') options.mergeBase = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (options.base && !options.head) throw new Error('--base requires --head');
  if (options.mergeBase && (!options.base || !options.head)) {
    throw new Error('--merge-base requires --base and --head');
  }
  return options;
}

function changedFiles(options, root = ROOT) {
  const gitFiles = args => execFileSync('git', args, { cwd: root, encoding: 'utf8' })
    .split('\0').filter(Boolean);
  if (options.base && options.head) {
    const range = `${options.base}${options.mergeBase ? '...' : '..'}${options.head}`;
    return gitFiles(['diff', '--name-only', '--no-renames', '-z', range, '--']);
  }
  if (options.head) {
    return gitFiles([
      'diff-tree', '--root', '--no-commit-id', '--name-only', '--no-renames', '-r', '-z', options.head, '--',
    ]);
  }
  return [...new Set([
    ...gitFiles(['diff', '--name-only', '--no-renames', '-z', 'HEAD', '--']),
    ...gitFiles(['ls-files', '--others', '--exclude-standard', '-z']),
  ])];
}

function librariesFromChangedFiles(files, root = ROOT) {
  const libraries = new Set();
  for (const file of files) {
    const normalized = file.replace(/\\/g, '/').replace(/^\.\//, '');
    const match = /^([^/.][^/]*)\/(?:block\.json|toolbox\.json|i18n\/[^/]+\.json)$/i.exec(normalized);
    if (!match || match[1] === 'node_modules') continue;
    // A removed locale or definition must still fail; only a fully removed
    // library is skipped because there is no remaining contract to validate.
    if (fs.existsSync(path.join(root, match[1]))) libraries.add(match[1]);
  }
  return [...libraries].sort();
}

function main(argv = process.argv.slice(2), root = ROOT) {
  try {
    const options = parseArgs(argv);
    if (options.help) {
      console.log(`Usage:
  node .scripts/check-changed-i18n.js --base <revision> --head <revision> [--merge-base]
  node .scripts/check-changed-i18n.js --head <revision>
  node .scripts/check-changed-i18n.js

Checks all locales of libraries with changes to block.json, toolbox.json or
i18n/*.json. Use --merge-base for pull requests and direct comparisons for pushes.
Without revisions, staged, unstaged and untracked workspace changes are checked.`);
      return;
    }
    const files = changedFiles(options, root);
    const libraries = librariesFromChangedFiles(files, root);
    console.log(`[i18n-changed] affected libraries: ${libraries.join(', ') || '(none)'}`);
    if (libraries.length === 0) return;
    process.exitCode = checkI18n(libraries.flatMap(library => ['--library', library]), root);
  } catch (error) {
    console.error(`[i18n-changed:error] ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = { parseArgs, changedFiles, librariesFromChangedFiles, main };

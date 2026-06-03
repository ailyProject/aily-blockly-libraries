const fs = require('fs');
const path = require('path');

const packageName = '@aily-project/lib-huoshan-ai-voice';

function findProjectRoot() {
  const initCwd = process.env.INIT_CWD;
  if (initCwd && fs.existsSync(path.join(initCwd, 'package.json'))) {
    return initCwd;
  }

  let dir = process.cwd();
  while (dir && dir !== path.dirname(dir)) {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.name !== packageName) return dir;
      } catch (error) {
        return dir;
      }
    }
    dir = path.dirname(dir);
  }
  return null;
}

function copyPartitionFile(projectRoot) {
  const source = path.join(__dirname, 'partitions.csv');
  const target = path.join(projectRoot, 'partitions.csv');
  if (!fs.existsSync(source)) return;

  if (fs.existsSync(target)) {
    const current = fs.readFileSync(target, 'utf8');
    const next = fs.readFileSync(source, 'utf8');
    if (current !== next) {
      console.warn('[huoshan-ai-voice] partitions.csv already exists; keeping the project file.');
    }
    return;
  }

  fs.copyFileSync(source, target);
  console.log('[huoshan-ai-voice] installed 16MB partition table to project partitions.csv');
}

function patchProjectConfig(projectRoot) {
  const pkgPath = path.join(projectRoot, 'package.json');
  if (!fs.existsSync(pkgPath)) return;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (pkg.name === packageName) return;

  const config = pkg.projectConfig || {};
  const desired = {
    UploadSpeed: '921600',
    UploadMode: 'default',
    FlashMode: 'qio',
    FlashSize: '16M',
    PartitionScheme: 'custom',
    PSRAM: 'opi'
  };

  let changed = false;
  for (const [key, value] of Object.entries(desired)) {
    if (config[key] !== value) {
      config[key] = value;
      changed = true;
    }
  }

  if (!changed && pkg.projectConfig) return;
  pkg.projectConfig = config;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('[huoshan-ai-voice] configured project for ESP32-S3 16MB flash, custom partition, and OPI PSRAM.');
}

try {
  const projectRoot = findProjectRoot();
  if (!projectRoot) process.exit(0);

  copyPartitionFile(projectRoot);
  patchProjectConfig(projectRoot);
} catch (error) {
  console.warn('[huoshan-ai-voice] setup skipped:', error.message);
}

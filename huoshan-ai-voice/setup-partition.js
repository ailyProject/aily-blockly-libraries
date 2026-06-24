const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const packageName = '@aily-project/lib-huoshan-ai-voice';
const lvglPackageName = '@aily-project/lib-lvgl';
const requiredDependencies = {
  '@aily-project/lib-arduinojson': '1.0.0',
  [lvglPackageName]: '1.0.1',
  '@aily-project/lib-tft-espi': '2.5.43',
  '@aily-project/lib-websockets': '2.7.1'
};

const screenDependencyBlockTypes = {
  [lvglPackageName]: [],
  '@aily-project/lib-tft-espi': []
};

const lvglCjkScreenFontSymbol = 'lv_font_source_han_sans_sc_14_cjk';
const legacyScreenFontSymbols = [
  'HuoshanAI_CN_15',
  'AlibabaPuHuiTi_Regular_15'
];
const legacyScreenFontSources = [
  'HuoshanAI_CN_15.c',
  'AlibabaPuHuiTi_Regular_15.c'
];

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

function patchProjectDependencies(projectRoot) {
  const pkgPath = path.join(projectRoot, 'package.json');
  if (!fs.existsSync(pkgPath)) return;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (pkg.name === packageName) return;

  const dependencies = pkg.dependencies || {};
  let changed = false;
  for (const [name, version] of Object.entries(requiredDependencies)) {
    if (!dependencies[name]) {
      dependencies[name] = version;
      changed = true;
    }
  }

  if (!changed && pkg.dependencies) return;
  pkg.dependencies = dependencies;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('[huoshan-ai-voice] ensured project dependencies for ASR, TTS, WebSocket, TFT, LVGL, and touch support.');
}

function projectUsesScreenBlocks(pkg) {
  const used = pkg.ailyBlocklyUsedLibraries && pkg.ailyBlocklyUsedLibraries[packageName];
  return !!(used && Array.isArray(used.blockTypes)
      && used.blockTypes.some(type => typeof type === 'string' && type.startsWith('huoshan_ai_screen_')));
}

function localLibraryPath(projectRoot, packageId) {
  const localPath = path.join(projectRoot, 'local-libraries', ...packageId.split('/'));
  return fs.existsSync(localPath) ? localPath : '';
}

function clearBuildCache(pkg) {
  let changed = false;
  if (Object.prototype.hasOwnProperty.call(pkg, 'buildInfo')) {
    delete pkg.buildInfo;
    changed = true;
  }
  if (Object.prototype.hasOwnProperty.call(pkg, 'codeHash')) {
    delete pkg.codeHash;
    changed = true;
  }
  return changed;
}

function localFileDependencyPath(projectRoot, version) {
  if (typeof version !== 'string' || !version.startsWith('file:')) return '';
  const relativePath = version.slice(5).replace(/[\\/]/g, path.sep);
  return path.resolve(projectRoot, relativePath);
}

function normalizeMissingLocalDependency(pkg, projectRoot, dependencyName) {
  const dependencies = pkg.dependencies || {};
  const localPath = localFileDependencyPath(projectRoot, dependencies[dependencyName]);
  if (!localPath || fs.existsSync(localPath)) return false;
  dependencies[dependencyName] = requiredDependencies[dependencyName];
  pkg.dependencies = dependencies;
  return true;
}

function removeMissingLocalSource(pkg, packageId) {
  const sources = pkg.ailyLocalLibrarySources || {};
  const sourcePath = sources[packageId];
  if (!sourcePath || fs.existsSync(sourcePath)) return false;
  delete sources[packageId];
  pkg.ailyLocalLibrarySources = sources;
  return true;
}

function patchProjectUsedLibraries(projectRoot) {
  const pkgPath = path.join(projectRoot, 'package.json');
  if (!fs.existsSync(pkgPath)) return;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (pkg.name === packageName || !projectUsesScreenBlocks(pkg)) return;

  const usedLibraries = pkg.ailyBlocklyUsedLibraries || {};
  const dependencies = pkg.dependencies || {};
  let changed = false;

  for (const [name, blockTypes] of Object.entries(screenDependencyBlockTypes)) {
    const version = dependencies[name] || requiredDependencies[name];
    const current = usedLibraries[name] || {};
    const next = {
      ...current,
      version,
      blockTypes: Array.isArray(current.blockTypes) ? current.blockTypes : blockTypes,
      updatedAt: current.updatedAt || Date.now()
    };
    const localPath = localLibraryPath(projectRoot, name);
    if (localPath) next.localPath = localPath;
    else delete next.localPath;
    if (JSON.stringify(current) !== JSON.stringify(next)) {
      usedLibraries[name] = next;
      changed = true;
    }
  }

  if (!changed) return;
  pkg.ailyBlocklyUsedLibraries = usedLibraries;
  clearBuildCache(pkg);
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('[huoshan-ai-voice] ensured Aily used-libraries records for screen dependencies.');
}

function patchProjectLocalLibrarySources(projectRoot) {
  const pkgPath = path.join(projectRoot, 'package.json');
  if (!fs.existsSync(pkgPath)) return;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (pkg.name === packageName) return;

  const localLvglPath = localLibraryPath(projectRoot, lvglPackageName);
  let changed = normalizeMissingLocalDependency(pkg, projectRoot, lvglPackageName);
  changed = removeMissingLocalSource(pkg, lvglPackageName) || changed;

  if (!localLvglPath) {
    if (changed) {
      clearBuildCache(pkg);
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
      console.log('[huoshan-ai-voice] removed stale missing LVGL local source from project config.');
    }
    return;
  }

  const sources = pkg.ailyLocalLibrarySources || {};
  if (sources[lvglPackageName] && path.resolve(sources[lvglPackageName]) === path.resolve(localLvglPath)) {
    if (changed) {
      clearBuildCache(pkg);
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
      console.log('[huoshan-ai-voice] removed stale missing LVGL local source from project config.');
    }
    return;
  }

  sources[lvglPackageName] = localLvglPath;
  pkg.ailyLocalLibrarySources = sources;
  clearBuildCache(pkg);
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('[huoshan-ai-voice] pointed Aily LVGL local source to the project local library.');
}

const legacyScreenMacroPrefixes = [
  'HUOSHAN_AI_SCREEN_',
  'HUOSHAN_AI_STATUS_BAR_HEIGHT',
  'HUOSHAN_AI_SPEAK_BUTTON_HEIGHT',
  'HUOSHAN_AI_SYMBOL_MIC',
  'LV_FONT_SOURCE_HAN_SANS_SC_14_CJK',
  'LV_USE_TFT_ESPI',
  'LV_FONT_FMT_TXT_LARGE',
  'LV_USE_FONT_COMPRESSED',
  'LV_LVGL_H_INCLUDE_SIMPLE',
  'LV_CONF_INCLUDE_SIMPLE',
  'ST7789_DRIVER',
  'TFT_',
  'TOUCH_CS',
  'SPI_FREQUENCY',
  'USE_HSPI_PORT'
];

function macroNameOf(entry) {
  let value = entry;
  while (Array.isArray(value)) value = value[0];
  if (typeof value !== 'string') return '';
  return value.split('=')[0].trim();
}

function isLegacyScreenMacro(entry) {
  const name = macroNameOf(entry);
  return legacyScreenMacroPrefixes.some(prefix => name === prefix || name.startsWith(prefix));
}

function removeLegacyMacrosFromPackage(pkg) {
  let changed = false;
  for (const key of ['MACROS', 'macros']) {
    if (!Array.isArray(pkg[key])) continue;
    const next = pkg[key].filter(entry => !isLegacyScreenMacro(entry));
    if (next.length !== pkg[key].length) {
      pkg[key] = next;
      changed = true;
    }
  }
  if (pkg.projectConfig && Array.isArray(pkg.projectConfig.macros)) {
    const next = pkg.projectConfig.macros.filter(entry => !isLegacyScreenMacro(entry));
    if (next.length !== pkg.projectConfig.macros.length) {
      pkg.projectConfig.macros = next;
      changed = true;
    }
  }
  return changed;
}

function patchProjectMacros(projectRoot) {
  const pkgPath = path.join(projectRoot, 'package.json');
  if (!fs.existsSync(pkgPath)) return;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (pkg.name === packageName) return;

  const changed = removeLegacyMacrosFromPackage(pkg);

  if (!changed) return;
  clearBuildCache(pkg);
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('[huoshan-ai-voice] removed stale project-level screen/font macros from older builds.');
}

function find7za() {
  const candidates = [
    process.env.AILY_7ZA_PATH,
    path.join(path.dirname(path.dirname(process.execPath)), '7za.exe'),
    'C:\\Program Files\\aily blockly\\resources\\child\\7za.exe',
    '7za.exe',
    '7z.exe'
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      execFileSync(candidate, ['i'], { stdio: 'ignore' });
      return candidate;
    } catch (error) {
      // Try the next candidate.
    }
  }
  return null;
}

function removeLegacyFontSourcesInDir(dir) {
  if (!dir || !fs.existsSync(dir)) return false;
  let changed = false;
  for (const fileName of legacyScreenFontSources) {
    const filePath = path.join(dir, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      changed = true;
    }
  }
  return changed;
}

function removeLegacyFontSources(projectRoot) {
  let changed = removeLegacyFontSourcesInDir(path.join(__dirname, 'src'));
  changed = removeLegacyFontSourcesInDir(
    path.join(projectRoot, '.temp', 'libraries', 'lib-huoshan-ai-voice')
  ) || changed;
  if (changed) {
    console.log('[huoshan-ai-voice] removed stale limited screen font sources.');
  }
}

function patchTempBuildConfig(projectRoot) {
  const buildConfigPath = path.join(projectRoot, '.temp', 'build-config.json');
  if (!fs.existsSync(buildConfigPath)) return;

  let config;
  try {
    config = JSON.parse(fs.readFileSync(buildConfigPath, 'utf8'));
  } catch (error) {
    return;
  }

  const za7 = find7za();
  if (!za7 || path.basename(config.za7Path || '').toLowerCase() !== '7za.exe') return;
  if (path.resolve(config.za7Path || '') === path.resolve(za7)) return;

  config.za7Path = za7;
  fs.writeFileSync(buildConfigPath, JSON.stringify(config, null, 2) + '\n');
  console.log('[huoshan-ai-voice] configured Aily build-config to use bundled 7za.exe.');
}

function patchTempPackageConfig(projectRoot) {
  const tempPkgPath = path.join(projectRoot, '.temp', 'package.json');
  if (!fs.existsSync(tempPkgPath)) return;

  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(tempPkgPath, 'utf8'));
  } catch (error) {
    return;
  }

  let changed = removeLegacyMacrosFromPackage(pkg);
  changed = normalizeMissingLocalDependency(pkg, projectRoot, lvglPackageName) || changed;
  changed = removeMissingLocalSource(pkg, lvglPackageName) || changed;
  const localLvglPath = localLibraryPath(projectRoot, lvglPackageName);
  if (localLvglPath) {
    const sources = pkg.ailyLocalLibrarySources || {};
    if (!sources[lvglPackageName] || path.resolve(sources[lvglPackageName]) !== path.resolve(localLvglPath)) {
      sources[lvglPackageName] = localLvglPath;
      pkg.ailyLocalLibrarySources = sources;
      changed = true;
    }
  }

  if (clearBuildCache(pkg)) changed = true;

  if (!changed) return;
  fs.writeFileSync(tempPkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('[huoshan-ai-voice] patched stale Aily temp package config.');
}

function copyFileIfChanged(source, target) {
  if (!fs.existsSync(source)) return false;
  if (fs.existsSync(target)) {
    const current = fs.readFileSync(target);
    const next = fs.readFileSync(source);
    if (current.equals(next)) return false;
  }
  fs.copyFileSync(source, target);
  return true;
}

function copyDirectoryIfPresent(source, target) {
  if (!fs.existsSync(source)) return false;
  fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(source, target, { recursive: true });
  return true;
}

function hasUsableLvglSource(lvglRoot) {
  return [
    path.join(lvglRoot, 'src', 'lvgl', 'src', 'draw', 'lv_draw_buf.h'),
    path.join(lvglRoot, 'src', 'src', 'lvgl', 'src', 'draw', 'lv_draw_buf.h'),
    path.join(lvglRoot, 'src', 'draw', 'lv_draw_buf.h')
  ].some(fs.existsSync);
}

function normalizeProjectLvglLocalLibrary(projectRoot) {
  const lvglRoot = localLibraryPath(projectRoot, lvglPackageName);
  if (!lvglRoot) return;

  const nestedRoot = path.join(lvglRoot, 'lvgl');
  const nestedPackage = path.join(nestedRoot, 'package.json');
  const rootPackage = path.join(lvglRoot, 'package.json');
  let changed = false;

  if (!fs.existsSync(rootPackage) && fs.existsSync(nestedPackage)) {
    for (const fileName of [
      'block.json',
      'generator.js',
      'package.json',
      'README.md',
      'readme_ai.md',
      'toolbox.json',
      'src.7z'
    ]) {
      changed = copyFileIfChanged(
        path.join(nestedRoot, fileName),
        path.join(lvglRoot, fileName)
      ) || changed;
    }
    changed = copyDirectoryIfPresent(path.join(nestedRoot, 'i18n'), path.join(lvglRoot, 'i18n')) || changed;
  }

  const srcDir = path.join(lvglRoot, 'src');
  const archivePath = path.join(lvglRoot, 'src.7z');
  if (fs.existsSync(archivePath) && !hasUsableLvglSource(lvglRoot)) {
    const za7 = find7za();
    if (za7) {
      fs.rmSync(srcDir, { recursive: true, force: true });
      execFileSync(za7, ['x', archivePath, `-o${lvglRoot}`, '-y'], { stdio: 'ignore' });
      changed = true;
    }
  }

  if (changed) {
    console.log('[huoshan-ai-voice] normalized project local LVGL package and source layout.');
  }
}

function patchTempLvglConfig(projectRoot) {
  const candidatePaths = [
    path.join(projectRoot, 'local-libraries', '@aily-project', 'lib-lvgl', 'src', 'lvgl', 'src', 'lv_conf.h'),
    path.join(projectRoot, 'local-libraries', '@aily-project', 'lib-lvgl', 'src', 'src', 'lvgl', 'src', 'lv_conf.h'),
    path.join(projectRoot, 'local-libraries', '@aily-project', 'lib-lvgl', 'src', 'lv_conf.h'),
    path.join(projectRoot, '.temp', 'libraries', 'lvgl', 'src', 'lv_conf.h'),
    path.join(projectRoot, '.temp', 'libraries', 'lvgl', 'lv_conf.h')
  ];
  let changed = false;

  for (const confPath of candidatePaths) {
    if (!fs.existsSync(confPath)) continue;

    const current = fs.readFileSync(confPath, 'utf8');
    let next = current.replace(
      /^(\s*#define\s+LV_FONT_SOURCE_HAN_SANS_SC_14_CJK\s+)\d+(\s*(?:\/\/.*)?)$/m,
      (match, prefix, suffix) => `${prefix}1${suffix}`
    );
    next = next.replace(
      /^(\s*#define\s+LV_FONT_FMT_TXT_LARGE\s+)\d+(\s*(?:\/\/.*)?)$/m,
      (match, prefix, suffix) => `${prefix}1${suffix}`
    );
    if (!/^\s*#define\s+LV_FONT_SOURCE_HAN_SANS_SC_14_CJK\b/m.test(next)) {
      next = next.replace(
        /(\r?\n\s*#define\s+LV_FONT_MONTSERRAT_48\s+\d+\s*(?:\/\/.*)?\r?\n)/,
        `$1#define LV_FONT_SOURCE_HAN_SANS_SC_14_CJK 1\n`
      );
    }

    if (!/^\s*#define\s+LV_FONT_FMT_TXT_LARGE\b/m.test(next)) {
      next = next.replace(
        /(\r?\n\s*#define\s+LV_USE_FONT_COMPRESSED\s+\d+\s*(?:\/\/.*)?\r?\n)/,
        `$1#define LV_FONT_FMT_TXT_LARGE 1\n`
      );
    }

    if (next !== current) {
      fs.writeFileSync(confPath, next);
      changed = true;
    }
  }

  if (changed) {
    console.log('[huoshan-ai-voice] enabled LVGL Source Han Sans SC screen font support.');
  }
}

function patchLegacyScreenFontCode(code) {
  let next = String(code || '');
  if (!next.includes('HUOSHAN_AI_SCREEN_ENABLED')
      || !legacyScreenFontSymbols.some(symbol => next.includes(symbol))) {
    return next;
  }

  next = next.replace(/(^|\r?\n)#include\s+<huoshan_ai_screen_font\.h>\s*(?=\r?\n|$)/g, '$1');

  if (!next.includes('LV_FONT_SOURCE_HAN_SANS_SC_14_CJK')) {
    next = next.replace(
      /#define\s+LV_USE_TFT_ESPI\s+1\s*\r?\n/,
      '#define LV_USE_TFT_ESPI 1\n#define LV_FONT_SOURCE_HAN_SANS_SC_14_CJK 1\n'
    );
  }
  if (!next.includes('LV_FONT_FMT_TXT_LARGE')) {
    next = next.replace(
      /#define\s+LV_USE_TFT_ESPI\s+1\s*\r?\n/,
      '#define LV_USE_TFT_ESPI 1\n#define LV_FONT_FMT_TXT_LARGE 1\n'
    );
  }

  for (const symbol of legacyScreenFontSymbols) {
    next = next.replace(new RegExp(symbol, 'g'), lvglCjkScreenFontSymbol);
  }

  if (!next.includes(`LV_FONT_DECLARE(${lvglCjkScreenFontSymbol})`)) {
    next = next.replace(
      /#if\s+HUOSHAN_AI_SCREEN_ENABLED\s*\r?\n/,
      `#if HUOSHAN_AI_SCREEN_ENABLED\n\nLV_FONT_DECLARE(${lvglCjkScreenFontSymbol});\n`
    );
  }
  return next;
}

function legacyDirectTouchCode() {
  return `static const uint8_t HUOSHAN_AI_SCREEN_TOUCH_ADDR = 0x38;

class HuoshanAIScreenTouch {
public:
  HuoshanAIScreenTouch(int sda, int scl, int rst, int intr)
      : sda_(sda), scl_(scl), rst_(rst), intr_(intr) {}

  void begin() {
    Wire.begin(sda_, scl_);
    if (intr_ >= 0) pinMode(intr_, INPUT);
    if (rst_ >= 0) {
      pinMode(rst_, OUTPUT);
      digitalWrite(rst_, LOW);
      delay(10);
      digitalWrite(rst_, HIGH);
      delay(300);
    }
  }

  uint8_t read_touch_number() {
    return readByte(0x02) & 0x0F;
  }

  uint16_t read_touch1_x() {
    return readCoord(0x03);
  }

  uint16_t read_touch1_y() {
    return readCoord(0x05);
  }

private:
  int sda_;
  int scl_;
  int rst_;
  int intr_;

  uint8_t readByte(uint8_t reg) {
    Wire.beginTransmission(HUOSHAN_AI_SCREEN_TOUCH_ADDR);
    Wire.write(reg);
    if (Wire.endTransmission(false) != 0) return 0;
    if (Wire.requestFrom((uint8_t)HUOSHAN_AI_SCREEN_TOUCH_ADDR, (uint8_t)1) != 1) return 0;
    return Wire.read();
  }

  uint16_t readCoord(uint8_t reg) {
    uint8_t high = readByte(reg);
    uint8_t low = readByte(reg + 1);
    return ((uint16_t)(high & 0x0F) << 8) | low;
  }
};
`;
}

function patchLegacyScreenTouchCode(code) {
  let next = String(code || '');
  if (!next.includes('FT6336U')) return next;

  next = next.replace(/\r?\n#include\s+<FT6336U\.h>\r?\n/g, '\n');
  if (!next.includes('class HuoshanAIScreenTouch')) {
    next = next.replace(
      /static\s+uint32_t\s+huoshan_ai_screen_draw_buf\[/,
      legacyDirectTouchCode() + '\nstatic uint32_t huoshan_ai_screen_draw_buf['
    );
  }
  next = next.replace(
    /FT6336U\s+huoshan_ai_screen_touch\s*\(\s*HUOSHAN_AI_SCREEN_TOUCH_SDA\s*,\s*HUOSHAN_AI_SCREEN_TOUCH_SCL\s*,\s*HUOSHAN_AI_SCREEN_TOUCH_RST\s*,\s*HUOSHAN_AI_SCREEN_TOUCH_INT\s*\);/g,
    `HuoshanAIScreenTouch huoshan_ai_screen_touch(
    HUOSHAN_AI_SCREEN_TOUCH_SDA,
    HUOSHAN_AI_SCREEN_TOUCH_SCL,
    HUOSHAN_AI_SCREEN_TOUCH_RST,
    HUOSHAN_AI_SCREEN_TOUCH_INT);`
  );
  return next;
}

function patchLegacyScreenMacroCode(code) {
  let next = String(code || '');
  if (next.includes(lvglCjkScreenFontSymbol) && !next.includes('LV_FONT_FMT_TXT_LARGE')) {
    next = next.replace(
      /#define\s+LV_USE_TFT_ESPI\s+1\s*\r?\n/,
      '#define LV_USE_TFT_ESPI 1\n#define LV_FONT_FMT_TXT_LARGE 1\n'
    );
  }
  next = next.replace(/^\s*#define\s+HUOSHAN_AI_UNUSED_OLD_FONT_MACRO(?:\s+\S+)?\s*\r?\n/gm, '');
  next = next.replace(
    /#ifndef\s+HUOSHAN_AI_SCREEN_ENABLED\s*\r?\n#define\s+HUOSHAN_AI_SCREEN_ENABLED\s+0\s*\r?\n#endif\s*\r?\n\s*#if\s+!HUOSHAN_AI_SCREEN_ENABLED/g,
    '#if !defined(HUOSHAN_AI_SCREEN_ENABLED) || !HUOSHAN_AI_SCREEN_ENABLED'
  );
  next = next.replace(
    /^#define\s+HUOSHAN_AI_STATUS_BAR_HEIGHT\s+25\s*\r?\n/gm,
    'static const int HUOSHAN_AI_STATUS_BAR_HEIGHT = 25;\n'
  );
  next = next.replace(
    /^#define\s+HUOSHAN_AI_SPEAK_BUTTON_HEIGHT\s+38\s*\r?\n/gm,
    'static const int HUOSHAN_AI_SPEAK_BUTTON_HEIGHT = 38;\n'
  );
  next = next.replace(/^\s*#define\s+HUOSHAN_AI_SYMBOL_MIC\s+".*"\s*\r?\n/gm, '');
  return next;
}

function patchLegacyScreenEarlyBeginCode(code) {
  let next = String(code || '');
  if (!next.includes('HUOSHAN_AI_SCREEN_ENABLED')
      || !next.includes('HuoshanAIVoice.beginScreen(')
      || next.includes('huoshan-ai-screen-auto-begin')) {
    return next;
  }

  return next.replace(
    /(void\s+setup\s*\(\s*\)\s*\{\s*)/,
    '$1\n  // huoshan-ai-screen-auto-begin\n  HuoshanAIVoice.beginScreen(true, true);\n'
  );
}

function patchLegacyTempScreenCode(code) {
  return patchLegacyScreenEarlyBeginCode(
    patchLegacyScreenMacroCode(patchLegacyScreenTouchCode(patchLegacyScreenFontCode(code)))
  );
}

function patchLegacyTempScreenFont(projectRoot) {
  const buildConfigPath = path.join(projectRoot, '.temp', 'build-config.json');
  const sketchPath = path.join(projectRoot, '.temp', 'sketch', 'sketch.ino');
  let changed = false;

  if (fs.existsSync(buildConfigPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(buildConfigPath, 'utf8'));
      if (typeof config.code === 'string') {
        const nextCode = patchLegacyTempScreenCode(config.code);
        if (nextCode !== config.code) {
          config.code = nextCode;
          fs.writeFileSync(buildConfigPath, JSON.stringify(config, null, 2) + '\n');
          changed = true;
        }
      }
    } catch (error) {
      // Ignore transient or partially written Aily temp files.
    }
  }

  if (fs.existsSync(sketchPath)) {
    const current = fs.readFileSync(sketchPath, 'utf8');
    const next = patchLegacyTempScreenCode(current);
    if (next !== current) {
      fs.writeFileSync(sketchPath, next);
      changed = true;
    }
  }

  if (changed) {
    console.log('[huoshan-ai-voice] patched stale Aily temp screen code for early display init and LVGL Chinese font.');
  }
}

try {
  const projectRoot = findProjectRoot();
  if (!projectRoot) process.exit(0);

  copyPartitionFile(projectRoot);
  patchProjectConfig(projectRoot);
  patchProjectDependencies(projectRoot);
  patchProjectLocalLibrarySources(projectRoot);
  patchProjectUsedLibraries(projectRoot);
  patchProjectMacros(projectRoot);
  patchTempBuildConfig(projectRoot);
  patchTempPackageConfig(projectRoot);
  normalizeProjectLvglLocalLibrary(projectRoot);
  // The screen now uses the bundled full-coverage HuoshanAI_CN_15 font instead of
  // the LVGL CJK radical subset, so we deliberately skip the legacy font/lv_conf
  // rewrites that used to swap it out.
  // patchTempLvglConfig(projectRoot);
  // removeLegacyFontSources(projectRoot);
  // patchLegacyTempScreenFont(projectRoot);
} catch (error) {
  console.warn('[huoshan-ai-voice] setup skipped:', error.message);
}

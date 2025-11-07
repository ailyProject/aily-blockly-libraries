#!/usr/bin/env node

/**
 * Arduino库转Blockly库规范检测脚本
 * 
 * 检测范围: 基础结构 + 设计规范
 * 基于: Arduino库转Blockly库规范.md
 * 
 * 使用方法:
 *   node validate-library-compliance.js [库名]
 *   node validate-library-compliance.js --all
 */

const fs = require('fs');
const path = require('path');

class LibraryValidator {
  constructor() {
    this.issues = [];
    this.score = 0;
    this.maxScore = 0;
  }

  // 添加检测问题
  addIssue(type, category, message, suggestion = '') {
    this.issues.push({ type, category, message, suggestion });
  }

  // 检测成功
  addSuccess(points = 1) {
    this.score += points;
    this.maxScore += points;
  }

  // 检测失败
  addFailure(points = 1) {
    this.maxScore += points;
  }

  // 检测单个库
  async validateLibrary(libraryPath) {
    const libraryName = path.basename(libraryPath);
    console.log(`\n🔍 检测库: ${libraryName}`);
    console.log('='.repeat(50));

    this.issues = [];
    this.score = 0;
    this.maxScore = 0;

    // 1. 基础文件结构检测
    await this.checkFileStructure(libraryPath);
    
    // 2. JSON格式检测
    await this.checkJsonFormats(libraryPath);
    
    // 3. package.json规范检测
    await this.checkPackageJson(libraryPath);
    
    // 4. block.json设计规范检测
    await this.checkBlockJson(libraryPath);
    
    // 5. toolbox.json规范检测
    await this.checkToolboxJson(libraryPath);
    
    // 6. README规范检测
    await this.checkReadmeCompliance(libraryPath);
    
    // 7. generator.js最佳实践检测
    await this.checkGeneratorBestPractices(libraryPath);

    return this.generateReport(libraryName);
  }

  // 1. 文件结构检测
  async checkFileStructure(libraryPath) {
    console.log('\n📁 检测文件结构...');
    
    const requiredFiles = [
      'block.json',
      'generator.js', 
      'toolbox.json',
      'package.json'
    ];

    const optionalFiles = [
      'README.md',
      'readme.md'
    ];

    let hasReadme = false;

    for (const file of requiredFiles) {
      const filePath = path.join(libraryPath, file);
      if (fs.existsSync(filePath)) {
        this.addSuccess();
        console.log(`  ✅ ${file}`);
      } else {
        this.addFailure();
        this.addIssue('error', '文件结构', `缺少必需文件: ${file}`, `创建 ${file} 文件`);
        console.log(`  ❌ ${file} (缺失)`);
      }
    }

    // 检测README文件（大小写不敏感）
    for (const file of optionalFiles) {
      const filePath = path.join(libraryPath, file);
      if (fs.existsSync(filePath)) {
        hasReadme = true;
        this.addSuccess();
        console.log(`  ✅ ${file}`);
        break;
      }
    }

    if (!hasReadme) {
      this.addFailure();
      this.addIssue('warning', '文件结构', '缺少README文件', '创建README.md文件');
      console.log(`  ⚠️  README.md (推荐)`);
    }
  }

  // 2. JSON格式检测
  async checkJsonFormats(libraryPath) {
    console.log('\n📄 检测JSON格式...');
    
    const jsonFiles = ['block.json', 'toolbox.json', 'package.json'];
    
    for (const file of jsonFiles) {
      const filePath = path.join(libraryPath, file);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          JSON.parse(content);
          this.addSuccess();
          console.log(`  ✅ ${file} 格式正确`);
        } catch (error) {
          this.addFailure();
          this.addIssue('error', 'JSON格式', `${file} JSON语法错误: ${error.message}`, '修复JSON语法错误');
          console.log(`  ❌ ${file} JSON语法错误`);
        }
      }
    }
  }

  // 3. package.json规范检测
  async checkPackageJson(libraryPath) {
    console.log('\n📦 检测package.json规范...');
    
    const packagePath = path.join(libraryPath, 'package.json');
    if (!fs.existsSync(packagePath)) {
      return; // 已在文件结构检测中处理
    }

    try {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      // 检测必需字段
      const requiredFields = ['name', 'version', 'description', 'compatibility'];
      for (const field of requiredFields) {
        if (packageJson[field]) {
          this.addSuccess();
          console.log(`  ✅ ${field} 字段存在`);
        } else {
          this.addFailure();
          this.addIssue('error', 'package.json', `缺少必需字段: ${field}`, `添加 ${field} 字段`);
          console.log(`  ❌ 缺少字段: ${field}`);
        }
      }

      // 检测命名规范
      if (packageJson.name) {
        if (packageJson.name.startsWith('@aily-project/lib-')) {
          this.addSuccess();
          console.log(`  ✅ 命名规范正确`);
        } else {
          this.addFailure();
          this.addIssue('warning', 'package.json', `命名不符合规范: ${packageJson.name}`, '使用 @aily-project/lib-* 格式');
          console.log(`  ⚠️  命名规范不正确`);
        }
      }

      // 检测版本号格式
      if (packageJson.version) {
        if (/^\d+\.\d+\.\d+$/.test(packageJson.version)) {
          this.addSuccess();
          console.log(`  ✅ 版本号格式正确`);
        } else {
          this.addFailure();
          this.addIssue('warning', 'package.json', `版本号格式不规范: ${packageJson.version}`, '使用语义化版本号 x.y.z');
          console.log(`  ⚠️  版本号格式不规范`);
        }
      }

      // 检测compatibility配置
      if (packageJson.compatibility) {
        if (packageJson.compatibility.core !== undefined) {
          this.addSuccess();
          console.log(`  ✅ compatibility.core 配置存在`);
        } else {
          this.addFailure();
          this.addIssue('warning', 'package.json', 'compatibility缺少core配置', '添加 compatibility.core 数组');
          console.log(`  ⚠️  compatibility缺少core配置`);
        }
      }

    } catch (error) {
      // JSON格式错误已在前面处理
    }
  }

  // 4. block.json设计规范检测
  async checkBlockJson(libraryPath) {
    console.log('\n🧩 检测block.json设计规范...');
    
    const blockPath = path.join(libraryPath, 'block.json');
    if (!fs.existsSync(blockPath)) {
      return; // 已在文件结构检测中处理
    }

    try {
      const blocks = JSON.parse(fs.readFileSync(blockPath, 'utf8'));
      
      if (!Array.isArray(blocks)) {
        this.addFailure();
        this.addIssue('error', 'block.json', 'block.json应该是数组格式', '将块定义包装在数组中');
        console.log(`  ❌ 格式错误: 不是数组`);
        return;
      }

      console.log(`  📊 共发现 ${blocks.length} 个块定义`);

      let initBlocks = 0;
      let methodBlocks = 0;
      let hatBlocks = 0;
      let valueBlocks = 0;

      for (const block of blocks) {
        if (!block.type) {
          this.addFailure();
          this.addIssue('error', 'block.json', '发现无type字段的块', '为所有块添加type字段');
          continue;
        }

        // 分析块类型
        const isInitBlock = block.type.includes('_init') || 
                           block.type.includes('_setup') || 
                           block.type.includes('_create') ||
                           block.type.includes('_config');
        
        const isHatBlock = !block.previousStatement && !block.nextStatement && 
                          block.args1 && block.args1.some(arg => arg.type === 'input_statement');
        
        const isValueBlock = block.output !== undefined;
        
        const hasVarField = block.args0 && block.args0.some(arg => arg.name === 'VAR');

        if (isInitBlock) {
          initBlocks++;
          // 检测初始化块应使用field_input
          if (hasVarField) {
            const varField = block.args0.find(arg => arg.name === 'VAR');
            if (varField.type === 'field_input') {
              this.addSuccess();
              console.log(`  ✅ ${block.type}: 初始化块正确使用field_input`);
            } else if (varField.type === 'field_variable') {
              this.addFailure();
              this.addIssue('warning', 'block.json', `${block.type}: 初始化块应使用field_input而非field_variable`, '将VAR字段类型改为field_input');
              console.log(`  ⚠️  ${block.type}: 应使用field_input`);
            }
          }
        } else if (isHatBlock) {
          hatBlocks++;
          this.addSuccess();
          console.log(`  ✅ ${block.type}: Hat块设计正确`);
        } else if (isValueBlock) {
          valueBlocks++;
          this.addSuccess();
          console.log(`  ✅ ${block.type}: 值块设计正确`);
        } else {
          methodBlocks++;
          // 检测方法调用块应使用field_variable
          if (hasVarField) {
            const varField = block.args0.find(arg => arg.name === 'VAR');
            if (varField.type === 'field_variable') {
              // 检测是否配置了variableTypes
              if (varField.variableTypes && varField.defaultType) {
                this.addSuccess();
                console.log(`  ✅ ${block.type}: 方法块正确使用field_variable+variableTypes`);
              } else {
                this.addFailure();
                this.addIssue('warning', 'block.json', `${block.type}: field_variable缺少variableTypes配置`, '添加variableTypes和defaultType配置');
                console.log(`  ⚠️  ${block.type}: 缺少variableTypes配置`);
              }
            } else if (varField.type === 'field_input') {
              this.addFailure();
              this.addIssue('warning', 'block.json', `${block.type}: 方法调用块应使用field_variable而非field_input`, '将VAR字段类型改为field_variable并添加variableTypes');
              console.log(`  ⚠️  ${block.type}: 应使用field_variable`);
            }
          }
        }
      }

      console.log(`  📈 块类型统计: 初始化(${initBlocks}) 方法调用(${methodBlocks}) Hat块(${hatBlocks}) 值块(${valueBlocks})`);

    } catch (error) {
      // JSON格式错误已在前面处理
    }
  }

  // 5. toolbox.json规范检测
  async checkToolboxJson(libraryPath) {
    console.log('\n🧰 检测toolbox.json规范...');
    
    const toolboxPath = path.join(libraryPath, 'toolbox.json');
    const blockPath = path.join(libraryPath, 'block.json');
    
    if (!fs.existsSync(toolboxPath) || !fs.existsSync(blockPath)) {
      return; // 已在文件结构检测中处理
    }

    try {
      const toolbox = JSON.parse(fs.readFileSync(toolboxPath, 'utf8'));
      const blocks = JSON.parse(fs.readFileSync(blockPath, 'utf8'));
      
      // 查找所有有input_value的块，并记录详细信息
      const inputValueBlocks = new Map(); // blockType -> [inputNames]
      if (Array.isArray(blocks)) {
        for (const block of blocks) {
          if (block.args0) {
            const inputValueFields = block.args0
              .filter(arg => arg.type === 'input_value')
              .map(arg => arg.name);
            
            if (inputValueFields.length > 0) {
              inputValueBlocks.set(block.type, inputValueFields);
            }
          }
        }
      }

      console.log(`  📊 发现 ${inputValueBlocks.size} 个需要影子块的块`);

      // 检测toolbox中的影子块配置
      const configuredBlocks = new Map(); // blockType -> configuredInputs
      const missingBlocks = [];
      
      function checkToolboxContent(content) {
        if (Array.isArray(content)) {
          for (const item of content) {
            if (item.kind === 'block' && item.type && inputValueBlocks.has(item.type)) {
              const requiredInputs = inputValueBlocks.get(item.type);
              const configuredInputs = item.inputs ? Object.keys(item.inputs) : [];
              
              configuredBlocks.set(item.type, configuredInputs);
              
              if (configuredInputs.length > 0) {
                console.log(`  ✅ ${item.type}: 配置了影子块 (${configuredInputs.join(', ')})`);
              } else {
                console.log(`  ⚠️  ${item.type}: 缺少影子块配置 (需要: ${requiredInputs.join(', ')})`);
                missingBlocks.push({
                  blockType: item.type,
                  requiredInputs: requiredInputs,
                  configuredInputs: []
                });
              }

              // 检查是否所有input_value都配置了影子块
              const missingInputs = requiredInputs.filter(input => !configuredInputs.includes(input));
              if (missingInputs.length > 0) {
                console.log(`  ⚠️  ${item.type}: 部分input_value缺少影子块 (缺少: ${missingInputs.join(', ')})`);
                if (!missingBlocks.some(mb => mb.blockType === item.type)) {
                  missingBlocks.push({
                    blockType: item.type,
                    requiredInputs: requiredInputs,
                    configuredInputs: configuredInputs,
                    missingInputs: missingInputs
                  });
                }
              }
            }
            if (item.contents) {
              checkToolboxContent(item.contents);
            }
          }
        }
      }

      if (toolbox.contents) {
        checkToolboxContent(toolbox.contents);
      }

      // 检查完全未在toolbox中出现的input_value块
      for (const [blockType, requiredInputs] of inputValueBlocks) {
        if (!configuredBlocks.has(blockType)) {
          console.log(`  ⚠️  ${blockType}: 未在toolbox中配置 (需要: ${requiredInputs.join(', ')})`);
          missingBlocks.push({
            blockType: blockType,
            requiredInputs: requiredInputs,
            configuredInputs: [],
            notInToolbox: true
          });
        }
      }

      // 统计成功配置的数量
      let totalConfigured = 0;
      for (const configuredInputs of configuredBlocks.values()) {
        totalConfigured += configuredInputs.length;
      }

      if (totalConfigured > 0) {
        this.addSuccess(Math.min(totalConfigured, inputValueBlocks.size));
      }

      // 添加详细的错误信息
      if (missingBlocks.length > 0) {
        this.addFailure(missingBlocks.length);
        
        for (const missing of missingBlocks) {
          let message, suggestion;
          
          if (missing.notInToolbox) {
            message = `${missing.blockType} 未在toolbox中配置 (需要配置input_value: ${missing.requiredInputs.join(', ')})`;
            suggestion = `在toolbox.json中添加 ${missing.blockType} 块并为其配置影子块`;
          } else if (missing.missingInputs && missing.missingInputs.length > 0) {
            message = `${missing.blockType} 的input_value缺少影子块配置 (缺少: ${missing.missingInputs.join(', ')})`;
            suggestion = `为 ${missing.blockType} 的 ${missing.missingInputs.join(', ')} 字段添加影子块配置`;
          } else {
            message = `${missing.blockType} 完全缺少影子块配置 (需要: ${missing.requiredInputs.join(', ')})`;
            suggestion = `为 ${missing.blockType} 添加inputs配置，包含 ${missing.requiredInputs.join(', ')} 字段的影子块`;
          }
          
          this.addIssue('warning', 'toolbox.json', message, suggestion);
        }
      }

    } catch (error) {
      // JSON格式错误已在前面处理
    }
  }

  // 7. generator.js最佳实践检测
  async checkGeneratorBestPractices(libraryPath) {
    console.log('\n⚙️  检测generator.js最佳实践...');
    
    const generatorPath = path.join(libraryPath, 'generator.js');
    if (!fs.existsSync(generatorPath)) {
      return; // 已在文件结构检测中处理
    }

    try {
      const content = fs.readFileSync(generatorPath, 'utf8');
      
      // 检测核心库函数使用
      const coreLibFunctions = [
        'registerVariableToBlockly',
        'renameVariableInBlockly'
      ];
      
      for (const func of coreLibFunctions) {
        if (content.includes(func)) {
          this.addSuccess();
          console.log(`  ✅ 使用核心库函数: ${func}`);
        } else {
          this.addFailure();
          this.addIssue('warning', 'generator.js', `未使用核心库函数: ${func}`, `使用 ${func} 函数管理变量`);
          console.log(`  ⚠️  缺少核心库函数: ${func}`);
        }
      }

      // 检测变量重命名监听机制
      const hasVarMonitor = content.includes('_varMonitorAttached') || 
                           content.includes('VarMonitorAttached') ||
                           content.includes('setValidator');
      if (hasVarMonitor) {
        this.addSuccess();
        console.log(`  ✅ 实现变量重命名监听机制`);
      } else {
        this.addFailure();
        this.addIssue('warning', 'generator.js', '缺少变量重命名监听机制', '实现field validator监听变量名变化');
        console.log(`  ⚠️  缺少变量重命名监听机制`);
      }

      // 检测正确的变量读取方式
      const hasCorrectVarRead = content.includes('.getText()') && content.includes('getField(\'VAR\')');
      const hasIncorrectVarRead = content.includes('getFieldValue(\'VAR\')') && !content.includes('.getText()');
      
      if (hasCorrectVarRead) {
        this.addSuccess();
        console.log(`  ✅ 正确使用 getField('VAR').getText() 读取变量名`);
      } else if (hasIncorrectVarRead) {
        this.addFailure();
        this.addIssue('warning', 'generator.js', '应使用getField(\'VAR\').getText()而非getFieldValue(\'VAR\')', '对于field_variable类型，使用getText()方法');
        console.log(`  ⚠️  建议使用 getText() 替代 getFieldValue()`);
      }

      // 检测避免重复定义机制
      const hasEnsureLibrary = content.includes('ensureLibrary') || 
                              content.includes('addLibrary') ||
                              content.includes('_addedLibraries');
      if (hasEnsureLibrary) {
        this.addSuccess();
        console.log(`  ✅ 实现库重复检测机制`);
      } else {
        this.addFailure();
        this.addIssue('info', 'generator.js', '建议实现库重复检测机制', '使用ensureLibrary函数避免重复添加库');
        console.log(`  💡 建议: 实现库重复检测机制`);
      }

      // 检测初始化块模式
      const initBlockPattern = /Arduino\.forBlock\[['"].*?(?:_init|_setup|_create|_config).*?['"]\]/g;
      const initMatches = content.match(initBlockPattern) || [];
      
      for (const match of initMatches) {
        // 提取块名
        const blockNameMatch = match.match(/['"](.+?)['"]/);
        const blockName = blockNameMatch ? blockNameMatch[1] : 'unknown';
        
        // 查找该块的实现代码
        const blockStartIndex = content.indexOf(match);
        const blockEndIndex = content.indexOf('};', blockStartIndex);
        const blockCode = content.substring(blockStartIndex, blockEndIndex);
        
        // 检测是否使用getFieldValue读取变量名（初始化块的正确方式）
        if (blockCode.includes('getFieldValue(\'VAR\')')) {
          this.addSuccess();
          console.log(`  ✅ ${blockName}: 初始化块正确使用getFieldValue()`);
        } else {
          this.addFailure();
          this.addIssue('warning', 'generator.js', `${blockName}: 初始化块应使用getFieldValue('VAR')`, '对于field_input类型，使用getFieldValue()');
          console.log(`  ⚠️  ${blockName}: 初始化块应使用getFieldValue()`);
        }
      }

      // 检测方法调用块模式
      const methodBlockPattern = /Arduino\.forBlock\[['"].*?(?:_read|_get|_check|_is|_has).*?['"]\]/g;
      const methodMatches = content.match(methodBlockPattern) || [];
      
      for (const match of methodMatches) {
        const blockNameMatch = match.match(/['"](.+?)['"]/);
        const blockName = blockNameMatch ? blockNameMatch[1] : 'unknown';
        
        const blockStartIndex = content.indexOf(match);
        const blockEndIndex = content.indexOf('};', blockStartIndex);
        const blockCode = content.substring(blockStartIndex, blockEndIndex);
        
        // 检测是否使用getText()读取变量名（方法调用块的正确方式）
        if (blockCode.includes('getField(\'VAR\')') && blockCode.includes('.getText()')) {
          this.addSuccess();
          console.log(`  ✅ ${blockName}: 方法块正确使用getField().getText()`);
        } else if (blockCode.includes('getFieldValue(\'VAR\')')) {
          this.addFailure();
          this.addIssue('warning', 'generator.js', `${blockName}: 方法调用块应使用getField('VAR').getText()`, '对于field_variable类型，使用getText()方法');
          console.log(`  ⚠️  ${blockName}: 方法块应使用getText()`);
        }
      }

      // 检测类型映射表使用
      const hasTypeMapping = content.includes('TypeMap') || content.includes('typeMap');
      if (hasTypeMapping) {
        this.addSuccess();
        console.log(`  ✅ 使用类型映射表管理变量类型`);
      } else {
        this.addFailure();
        this.addIssue('info', 'generator.js', '建议使用类型映射表管理变量类型', '创建TypeMap对象记录变量类型信息');
        console.log(`  💡 建议: 使用类型映射表管理变量类型(非必须项)`);
      }

    } catch (error) {
      this.addFailure();
      this.addIssue('error', 'generator.js', `读取generator.js失败: ${error.message}`, '检查文件编码和权限');
      console.log(`  ❌ 读取失败: ${error.message}`);
    }
  }

  // 6. README规范检测
  async checkReadmeCompliance(libraryPath) {
    console.log('\n📚 检测README规范...');
    
    let readmePath = path.join(libraryPath, 'README.md');
    if (!fs.existsSync(readmePath)) {
      readmePath = path.join(libraryPath, 'readme.md');
    }
    
    if (!fs.existsSync(readmePath)) {
      this.addFailure(3);
      this.addIssue('warning', 'README', 'README文件不存在', '创建README.md并按照轻量化规范编写');
      console.log(`  ⚠️  README文件不存在`);
      return;
    }

    try {
      const content = fs.readFileSync(readmePath, 'utf8');
      
      // 检测文件大小（5KB限制）
      const sizeKB = Buffer.byteLength(content, 'utf8') / 1024;
      if (sizeKB <= 5) {
        this.addSuccess();
        console.log(`  ✅ 文件大小合规 (${sizeKB.toFixed(1)}KB)`);
      } else {
        this.addFailure();
        this.addIssue('warning', 'README', `文件过大: ${sizeKB.toFixed(1)}KB > 5KB`, '精简内容，遵循轻量化原则');
        console.log(`  ⚠️  文件过大: ${sizeKB.toFixed(1)}KB`);
      }

      // 检测必需段落
      const requiredSections = [
        { name: '库信息', pattern: /##\s*库信息/ },
        { name: '块定义', pattern: /##\s*块定义/ },
        { name: '字段类型映射', pattern: /##\s*字段类型映射/ },
        { name: '连接规则', pattern: /##\s*连接规则/ },
        { name: '使用示例', pattern: /##\s*使用示例/ },
        { name: '重要规则', pattern: /##\s*重要规则/ }
      ];

      for (const section of requiredSections) {
        if (section.pattern.test(content)) {
          this.addSuccess();
          console.log(`  ✅ ${section.name} 段落存在`);
        } else {
          this.addFailure();
          this.addIssue('warning', 'README', `缺少${section.name}段落`, `添加 ## ${section.name} 段落`);
          console.log(`  ⚠️  缺少${section.name}段落`);
        }
      }

      // 检测块定义表格格式
      if (/\|\s*块类型\s*\|\s*连接\s*\|\s*字段\/输入\s*\|\s*\.abi格式\s*\|\s*生成代码\s*\|/.test(content)) {
        this.addSuccess();
        console.log(`  ✅ 块定义表格格式正确`);
      } else {
        this.addFailure();
        this.addIssue('warning', 'README', '块定义表格格式不正确', '使用标准的5列表格格式');
        console.log(`  ⚠️  块定义表格格式不正确`);
      }

    } catch (error) {
      this.addFailure();
      this.addIssue('error', 'README', `读取README失败: ${error.message}`, '检查文件编码和权限');
      console.log(`  ❌ 读取失败: ${error.message}`);
    }
  }

  // 生成检测报告
  generateReport(libraryName) {
    const scorePercentage = this.maxScore > 0 ? Math.round((this.score / this.maxScore) * 100) : 0;
    
    console.log('\n📊 检测报告');
    console.log('='.repeat(30));
    console.log(`📈 综合评分: ${this.score}/${this.maxScore} (${scorePercentage}%)`);
    
    if (this.issues.length === 0) {
      console.log('🎉 所有检测项均通过！');
    } else {
      console.log(`\n❗ 发现 ${this.issues.length} 个问题:`);
      
      const groupedIssues = {};
      for (const issue of this.issues) {
        if (!groupedIssues[issue.category]) {
          groupedIssues[issue.category] = [];
        }
        groupedIssues[issue.category].push(issue);
      }

      for (const [category, issues] of Object.entries(groupedIssues)) {
        console.log(`\n📁 ${category}:`);
        for (const issue of issues) {
          const icon = issue.type === 'error' ? '❌' : '⚠️';
          console.log(`  ${icon} ${issue.message}`);
          if (issue.suggestion) {
            console.log(`     💡 建议: ${issue.suggestion}`);
          }
        }
      }
    }

    return {
      libraryName,
      score: this.score,
      maxScore: this.maxScore,
      percentage: scorePercentage,
      issues: this.issues
    };
  }

  // 扫描所有库
  async validateAllLibraries() {
    const currentDir = process.cwd();
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    const libraries = entries
      .filter(entry => entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules')
      .map(entry => entry.name);

    console.log(`🔍 发现 ${libraries.length} 个潜在库目录\n`);

    const results = [];
    let passCount = 0;
    let partialCount = 0;
    let failCount = 0;

    for (const lib of libraries) {
      const libPath = path.join(currentDir, lib);
      
      // 检查是否是有效的库目录（至少包含package.json或block.json）
      const hasPackageJson = fs.existsSync(path.join(libPath, 'package.json'));
      const hasBlockJson = fs.existsSync(path.join(libPath, 'block.json'));
      
      if (!hasPackageJson && !hasBlockJson) {
        continue; // 跳过非库目录
      }

      const result = await this.validateLibrary(libPath);
      results.push(result);

      if (result.percentage >= 90) {
        passCount++;
      } else if (result.percentage >= 60) {
        partialCount++;
      } else {
        failCount++;
      }
    }

    // 总体统计
    console.log('\n' + '='.repeat(60));
    console.log('🏆 总体统计报告');
    console.log('='.repeat(60));
    console.log(`📊 共检测库: ${results.length} 个`);
    console.log(`✅ 完全合规 (≥90%): ${passCount} 个 (${Math.round(passCount/results.length*100)}%)`);
    console.log(`⚠️  部分合规 (60-89%): ${partialCount} 个 (${Math.round(partialCount/results.length*100)}%)`);
    console.log(`❌ 需要修改 (<60%): ${failCount} 个 (${Math.round(failCount/results.length*100)}%)`);

    // 按评分排序显示
    results.sort((a, b) => b.percentage - a.percentage);
    console.log('\n📋 库评分排行:');
    for (const result of results.slice(0, 10)) {
      const icon = result.percentage >= 90 ? '✅' : result.percentage >= 60 ? '⚠️' : '❌';
      console.log(`  ${icon} ${result.libraryName}: ${result.percentage}%`);
    }

    return results;
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const validator = new LibraryValidator();

  if (args.length === 0 || args[0] === '--help') {
    console.log(`
Arduino库转Blockly库规范检测工具

使用方法:
  node validate-library-compliance.js [库名]     检测指定库
  node validate-library-compliance.js --all      检测所有库
  node validate-library-compliance.js --help     显示帮助

检测范围:
  ✅ 文件结构完整性
  ✅ JSON格式正确性  
  ✅ package.json规范
  ✅ block.json设计规范
  ✅ toolbox.json影子块配置
  ✅ README轻量化规范
  ✅ generator.js最佳实践
`);
    return;
  }

  if (args[0] === '--all') {
    await validator.validateAllLibraries();
  } else {
    const libraryName = args[0];
    const libraryPath = path.resolve(libraryName);
    
    if (!fs.existsSync(libraryPath)) {
      console.error(`❌ 库目录不存在: ${libraryPath}`);
      process.exit(1);
    }

    await validator.validateLibrary(libraryPath);
  }
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error);
}

module.exports = LibraryValidator;
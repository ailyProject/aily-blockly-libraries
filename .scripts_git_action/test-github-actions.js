#!/usr/bin/env node

/**
 * GitHub Actions 配置测试脚本
 * 用于验证工作流配置是否正确
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class GitHubActionsTest {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, testFn) {
    this.tests.push({ name, testFn });
  }

  async run() {
    console.log('🧪 GitHub Actions 配置测试\n');

    for (const { name, testFn } of this.tests) {
      try {
        console.log(`▶️  ${name}`);
        await testFn();
        console.log(`✅ ${name} - 通过\n`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${name} - 失败: ${error.message}\n`);
        this.failed++;
      }
    }

    console.log('📊 测试结果:');
    console.log(`   ✅ 通过: ${this.passed}`);
    console.log(`   ❌ 失败: ${this.failed}`);
    console.log(`   📈 成功率: ${Math.round((this.passed / (this.passed + this.failed)) * 100)}%`);

    return this.failed === 0;
  }
}

const tester = new GitHubActionsTest();

// 测试文件存在性
tester.test('检查GitHub Actions工作流文件', () => {
  const workflowFile = '.github/workflows/library-compliance-check.yml';
  if (!fs.existsSync(workflowFile)) {
    throw new Error('工作流文件不存在');
  }
  
  const content = fs.readFileSync(workflowFile, 'utf8');
  if (!content.includes('validate-libraries')) {
    throw new Error('工作流作业配置错误');
  }
});

// 测试配置文件
tester.test('检查配置文件', () => {
  const configFile = '.github/compliance-config.yml';
  if (!fs.existsSync(configFile)) {
    throw new Error('配置文件不存在');
  }
  
  const content = fs.readFileSync(configFile, 'utf8');
  if (!content.includes('compliance:')) {
    throw new Error('配置文件格式错误');
  }
});

// 测试核心检测脚本
tester.test('检查检测脚本', () => {
  if (!fs.existsSync('.scripts_git_action/validate-library-compliance.js')) {
    throw new Error('核心检测脚本不存在');
  }
  
  if (!fs.existsSync('.scripts_git_action/github-actions-validator.js')) {
    throw new Error('GitHub Actions验证脚本不存在');
  }
});

// 测试脚本可执行性
tester.test('测试检测脚本可执行性', () => {
  try {
    // 测试帮助信息
    execSync('node .scripts_git_action/validate-library-compliance.js --help', { stdio: 'pipe' });
    execSync('node .scripts_git_action/github-actions-validator.js --help', { stdio: 'pipe' });
  } catch (error) {
    throw new Error('检测脚本无法正常运行');
  }
});

// 测试示例库检测
tester.test('测试示例库检测', () => {
  // 查找一个示例库进行测试
  const libs = fs.readdirSync('.', { withFileTypes: true })
    .filter(item => item.isDirectory() && !item.name.startsWith('.'))
    .map(item => item.name)
    .filter(name => fs.existsSync(path.join(name, 'package.json')));
  
  if (libs.length === 0) {
    throw new Error('找不到可测试的库');
  }

  const testLib = libs[0];
  console.log(`   📦 使用 ${testLib} 进行测试...`);
  
  try {
    // 运行检测（允许失败，只要不崩溃即可）
    execSync(`node .scripts_git_action/validate-library-compliance.js ${testLib}`, { stdio: 'pipe' });
  } catch (error) {
    // 检测可能失败，但脚本应该正常运行
    if (error.status === undefined) {
      throw new Error('检测脚本运行时崩溃');
    }
  }
});

// 测试Git环境
tester.test('检查Git环境', () => {
  try {
    execSync('git --version', { stdio: 'pipe' });
    execSync('git status', { stdio: 'pipe' });
  } catch (error) {
    throw new Error('Git环境不可用或不是Git仓库');
  }
});

// 运行测试
async function main() {
  console.log('准备测试GitHub Actions配置...\n');
  
  const success = await tester.run();
  
  if (success) {
    console.log('\n🎉 所有测试通过！GitHub Actions配置就绪。');
    console.log('\n📝 下一步:');
    console.log('   1. 提交更改到Git仓库');
    console.log('   2. 推送到GitHub启用Actions');
    console.log('   3. 创建测试PR验证工作流');
  } else {
    console.log('\n💥 部分测试失败，请检查配置。');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
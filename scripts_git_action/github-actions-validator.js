#!/usr/bin/env node

/**
 * GitHub Actions Compatible Library Validator
 * 为GitHub Actions优化的库规范检测脚本
 */

const LibraryValidator = require('./validate-library-compliance.js');
const fs = require('fs');
const path = require('path');

class GitHubActionsValidator extends LibraryValidator {
  constructor() {
    super();
    this.isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
    this.failureDetails = [];
  }

  // 重写addIssue方法以支持GitHub Actions注解
  addIssue(type, category, message, suggestion = '') {
    super.addIssue(type, category, message, suggestion);
    
    if (this.isGitHubActions) {
      // GitHub Actions注解格式
      const level = type === 'error' ? 'error' : 'warning';
      console.log(`::${level}::${category}: ${message}`);
      
      if (type === 'error') {
        this.failureDetails.push(`❌ ${category}: ${message}`);
        if (suggestion) {
          this.failureDetails.push(`   💡 ${suggestion}`);
        }
      }
    }
  }

  // 生成GitHub Actions摘要
  generateActionsSummary(libraryName, passed) {
    if (!this.isGitHubActions) return;

    const summaryFile = process.env.GITHUB_STEP_SUMMARY;
    if (!summaryFile) return;

    const scorePercentage = this.maxScore > 0 ? Math.round((this.score / this.maxScore) * 100) : 0;
    const status = passed ? '✅ 通过' : '❌ 失败';
    const statusEmoji = passed ? '🎉' : '💥';

    let summary = `## ${statusEmoji} 库检测结果: ${libraryName}\n\n`;
    summary += `**状态**: ${status}\n`;
    summary += `**得分**: ${this.score}/${this.maxScore} (${scorePercentage}%)\n`;
    summary += `**检测时间**: ${new Date().toLocaleString('zh-CN')}\n\n`;

    // 添加检测覆盖面信息
    summary += `### 📋 检测覆盖面\n\n`;
    summary += `- ✅ 文件结构完整性\n`;
    summary += `- ✅ JSON格式正确性\n`;
    summary += `- ✅ package.json规范（命名、版本、兼容性）\n`;
    summary += `- ✅ block.json设计规范（字段类型、连接属性、块分类）\n`;
    summary += `- ✅ toolbox.json影子块配置\n`;
    summary += `- ✅ README轻量化规范\n`;
    summary += `- ✅ generator.js最佳实践（变量管理、板卡适配、快速操作模式）\n\n`;

    if (!passed && this.failureDetails.length > 0) {
      summary += `### 🔧 关键问题（必须修复）\n\n`;
      this.failureDetails.forEach(detail => {
        summary += `${detail}\n`;
      });
      summary += `\n`;
    }

    // 按重要性和类别分组显示所有问题
    const criticalIssues = this.issues.filter(i => i.type === 'error');
    const warningIssues = this.issues.filter(i => i.type === 'warning');
    const infoIssues = this.issues.filter(i => i.type === 'info');

    if (criticalIssues.length > 0) {
      summary += `### ❌ 严重问题 (${criticalIssues.length})\n\n`;
      summary = this.groupAndDisplayIssues(criticalIssues, summary);
    }

    if (warningIssues.length > 0) {
      summary += `### ⚠️ 警告问题 (${warningIssues.length})\n\n`;
      summary = this.groupAndDisplayIssues(warningIssues, summary);
    }

    if (infoIssues.length > 0) {
      summary += `### 💡 优化建议 (${infoIssues.length})\n\n`;
      summary = this.groupAndDisplayIssues(infoIssues, summary);
    }

    // 如果通过检测，显示成功信息
    if (passed) {
      summary += `### 🎉 恭喜！\n\n`;
      summary += `您的库 **${libraryName}** 完全符合Arduino转Blockly库规范！\n\n`;
      summary += `**主要亮点**：\n`;
      summary += `- 📁 文件结构完整规范\n`;
      summary += `- 🧩 块设计遵循最佳实践\n`;
      summary += `- ⚙️ 代码生成器实现正确\n`;
      summary += `- 📚 文档规范简洁\n\n`;
    } else {
      summary += `### 🔗 参考资料\n\n`;
      summary += `请参考以下规范文档进行修复：\n`;
      summary += `- 📖 [Arduino库转Blockly库规范](./Arduino库转Blockly库规范.md)\n`;
      summary += `- 📝 [Blockly库README编写规范](./blockly库readme编写规范.md)\n`;
      summary += `- 🚀 [GitHub Actions部署指南](./DEPLOYMENT.md)\n\n`;
      
      summary += `### 💫 快速修复提示\n\n`;
      
      if (criticalIssues.some(i => i.category === 'JSON格式')) {
        summary += `- 🔧 **JSON语法错误**: 使用在线JSON验证器检查语法\n`;
      }
      
      if (criticalIssues.some(i => i.category === 'block.json')) {
        summary += `- 🧩 **块设计问题**: 确保初始化块使用field_input，方法块使用field_variable+variableTypes\n`;
      }
      
      if (warningIssues.some(i => i.category === 'generator.js')) {
        summary += `- ⚙️ **代码生成问题**: 注意field_input用getFieldValue()，field_variable用getField().getText()\n`;
      }
      
      if (warningIssues.some(i => i.category === 'toolbox.json')) {
        summary += `- 🧰 **影子块配置**: 为所有input_value字段配置影子块\n`;
      }
      
      summary += `\n`;
    }

    // 写入摘要文件
    try {
      fs.appendFileSync(summaryFile, summary);
    } catch (error) {
      console.error('Failed to write GitHub Actions summary:', error);
    }
  }

  // 辅助方法：按类别分组显示问题
  groupAndDisplayIssues(issues, summary) {
    const issuesByCategory = {};
    issues.forEach(issue => {
      if (!issuesByCategory[issue.category]) {
        issuesByCategory[issue.category] = [];
      }
      issuesByCategory[issue.category].push(issue);
    });

    Object.keys(issuesByCategory).forEach(category => {
      summary += `#### 📁 ${category}\n\n`;
      issuesByCategory[category].forEach(issue => {
        const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : '💡';
        summary += `- ${icon} ${issue.message}\n`;
        if (issue.suggestion) {
          summary += `  - **修复建议**: ${issue.suggestion}\n`;
        }
      });
      summary += `\n`;
    });

    return summary;
  }

  // 重写验证方法以支持GitHub Actions
  async validateLibrary(libraryPath) {
    const result = await super.validateLibrary(libraryPath);
    const libraryName = path.basename(libraryPath);
    const passed = this.issues.filter(i => i.type === 'error').length === 0;

    // 生成GitHub Actions摘要
    this.generateActionsSummary(libraryName, passed);

    // 设置输出变量
    if (this.isGitHubActions) {
      const scorePercentage = this.maxScore > 0 ? Math.round((this.score / this.maxScore) * 100) : 0;
      console.log(`::set-output name=passed::${passed}`);
      console.log(`::set-output name=score::${scorePercentage}`);
      console.log(`::set-output name=library::${libraryName}`);
    }

    return result;
  }
}

// 主函数 - 支持批量检测
async function main() {
  const args = process.argv.slice(2);
  const validator = new GitHubActionsValidator();

  // 如果在GitHub Actions环境中，设置group
  if (validator.isGitHubActions) {
    console.log('::group::Library Compliance Check');
  }

  let allPassed = true;
  let checkedLibraries = [];

  if (args.length === 0 || args[0] === '--help') {
    console.log(`
使用方法:
  node github-actions-validator.js <库目录1> [库目录2] [...]
  node github-actions-validator.js --changed    # 检测Git变更的库
  node github-actions-validator.js --all        # 检测所有库

GitHub Actions环境变量:
  GITHUB_ACTIONS=true                # 启用GitHub Actions模式
  GITHUB_STEP_SUMMARY               # 输出摘要文件路径
    `);
    process.exit(0);
  }

  if (args[0] === '--changed') {
    // 检测Git变更的库
    const { execSync } = require('child_process');
    try {
      let changedFiles;
      if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
        // PR模式
        const baseSha = process.env.GITHUB_BASE_REF || 'origin/main';
        const headSha = process.env.GITHUB_SHA;
        changedFiles = execSync(`git diff --name-only ${baseSha}...${headSha}`, { encoding: 'utf8' });
      } else {
        // Push模式
        changedFiles = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf8' });
      }
      
      const changedLibs = new Set();
      changedFiles.split('\n').forEach(file => {
        if (file.match(/\.(json|js|md)$/) && !file.startsWith('.')) {
          const libName = file.split('/')[0];
          if (libName && fs.existsSync(libName) && fs.statSync(libName).isDirectory()) {
            changedLibs.add(libName);
          }
        }
      });

      if (changedLibs.size === 0) {
        console.log('ℹ️ 未检测到需要验证的库变更');
        process.exit(0);
      }

      checkedLibraries = Array.from(changedLibs);
    } catch (error) {
      console.error('Failed to detect changed files:', error.message);
      process.exit(1);
    }
  } else if (args[0] === '--all') {
    // 检测所有库
    const items = fs.readdirSync('.', { withFileTypes: true });
    checkedLibraries = items
      .filter(item => item.isDirectory() && !item.name.startsWith('.'))
      .map(item => item.name)
      .filter(name => fs.existsSync(path.join(name, 'package.json')));
  } else {
    // 检测指定的库
    checkedLibraries = args.filter(lib => {
      if (!fs.existsSync(lib)) {
        console.error(`❌ 库目录不存在: ${lib}`);
        return false;
      }
      return true;
    });
  }

  console.log(`🔍 准备检测 ${checkedLibraries.length} 个库: ${checkedLibraries.join(', ')}`);

  // 逐个检测库
  for (const lib of checkedLibraries) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🔍 正在检测: ${lib}`);
    console.log('='.repeat(60));
    
    try {
      await validator.validateLibrary(lib);
      const libraryPassed = validator.issues.filter(i => i.type === 'error').length === 0;
      
      if (!libraryPassed) {
        allPassed = false;
      }
      
      // 重置验证器状态以检测下一个库
      validator.issues = [];
      validator.score = 0;
      validator.maxScore = 0;
      validator.failureDetails = [];
      
    } catch (error) {
      console.error(`💥 检测 ${lib} 时发生错误:`, error.message);
      allPassed = false;
    }
  }

  if (validator.isGitHubActions) {
    console.log('::endgroup::');
  }

  // 最终结果
  console.log(`\n${'='.repeat(60)}`);
  if (allPassed) {
    console.log('🎉 所有库均通过规范检测！');
    process.exit(0);
  } else {
    console.log('💥 部分库未通过检测，请修复问题后重新提交');
    console.log('💡 请务必参考本github仓库中的[Arduino库转Blockly库规范](./Arduino库转Blockly库规范.md)及[Blockly库README编写规范](./blockly库readme编写规范.md)');
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main().catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

module.exports = GitHubActionsValidator;
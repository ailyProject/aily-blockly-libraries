const fs = require('fs');
const path = require('path');

// 获取所有库目录
function getLibraryDirs() {
  const baseDir = __dirname;
  const items = fs.readdirSync(baseDir, { withFileTypes: true });
  return items
    .filter(item => item.isDirectory() && !item.name.startsWith('.'))
    .map(item => path.join(baseDir, item.name))
    .filter(dir => fs.existsSync(path.join(dir, 'toolbox.json')));
}

// 处理单个库
function processLibrary(libraryDir) {
  const toolboxPath = path.join(libraryDir, 'toolbox.json');
  const blockPath = path.join(libraryDir, 'block.json');

  // 检查文件是否存在
  if (!fs.existsSync(toolboxPath) || !fs.existsSync(blockPath)) {
    return { success: false, reason: 'missing files' };
  }

  try {
    // 读取toolbox.json
    const toolboxContent = fs.readFileSync(toolboxPath, 'utf8');
    const toolbox = JSON.parse(toolboxContent);

    // 检查是否有icon字段
    if (!toolbox.icon) {
      return { success: false, reason: 'no icon in toolbox' };
    }

    const icon = toolbox.icon;

    // 读取block.json
    const blockContent = fs.readFileSync(blockPath, 'utf8');
    const blocks = JSON.parse(blockContent);

    // 检查是否是数组
    if (!Array.isArray(blocks)) {
      return { success: false, reason: 'block.json is not an array' };
    }

    // 检查是否有任何block已经有icon
    const hasAnyIcon = blocks.some(block => block.icon);
    if (hasAnyIcon) {
      // 检查所有block是否都有正确的icon
      const allHaveCorrectIcon = blocks.every(block => block.icon === icon);
      if (allHaveCorrectIcon) {
        return { success: false, reason: 'all blocks already have correct icon' };
      }
    }

    let modified = false;
    // 为每个block添加icon字段
    blocks.forEach(block => {
      if (!block.icon || block.icon !== icon) {
        block.icon = icon;
        modified = true;
      }
    });

    if (modified) {
      // 写回block.json，保持格式
      const updatedContent = JSON.stringify(blocks, null, 2);
      fs.writeFileSync(blockPath, updatedContent + '\n', 'utf8');
      return { success: true, icon: icon, blockCount: blocks.length };
    } else {
      return { success: false, reason: 'no changes needed' };
    }
  } catch (error) {
    return { success: false, reason: error.message };
  }
}

// 主函数
function main() {
  console.log('开始扫描库目录...\n');
  
  const libraryDirs = getLibraryDirs();
  console.log(`找到 ${libraryDirs.length} 个包含toolbox.json的库目录\n`);

  const results = {
    success: [],
    skipped: [],
    errors: []
  };

  libraryDirs.forEach(dir => {
    const libraryName = path.basename(dir);
    const result = processLibrary(dir);

    if (result.success) {
      results.success.push({ name: libraryName, ...result });
      console.log(`✓ ${libraryName}: 已添加icon "${result.icon}" 到 ${result.blockCount} 个blocks`);
    } else {
      results.skipped.push({ name: libraryName, reason: result.reason });
      // console.log(`- ${libraryName}: ${result.reason}`);
    }
  });

  console.log('\n============ 总结 ============');
  console.log(`成功处理: ${results.success.length} 个库`);
  console.log(`跳过: ${results.skipped.length} 个库`);
  
  if (results.success.length > 0) {
    console.log('\n成功添加icon的库:');
    results.success.forEach(item => {
      console.log(`  - ${item.name} (${item.blockCount} blocks)`);
    });
  }

  if (results.skipped.length > 0) {
    console.log('\n跳过的库统计:');
    const skipReasons = {};
    results.skipped.forEach(item => {
      skipReasons[item.reason] = (skipReasons[item.reason] || 0) + 1;
    });
    Object.entries(skipReasons).forEach(([reason, count]) => {
      console.log(`  - ${reason}: ${count} 个`);
    });
  }
}

main();

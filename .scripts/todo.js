const fs = require('fs');
const path = require('path');

// 获取当前工作目录
const rootDir = process.cwd();
const todoFilePath = path.join(rootDir, 'todo.md');

// 存储没有package.json的文件夹路径
const foldersWithoutPackageJson = [];

// 只遍历一级目录
function scanFirstLevelDirectories() {
  try {
    const items = fs.readdirSync(rootDir);
    
    for (const item of items) {
      const itemPath = path.join(rootDir, item);
      
      try {
        // 检查是否为目录且不是隐藏目录或node_modules
        if (fs.statSync(itemPath).isDirectory() && 
            !item.startsWith('.') && 
            item !== 'node_modules') {
          
          // 检查当前目录是否有package.json
          const subItems = fs.readdirSync(itemPath);
          const hasPackageJson = subItems.includes('package.json');
          
          if (!hasPackageJson) {
            foldersWithoutPackageJson.push(item);
          }
        }
      } catch (err) {
        console.error(`无法访问路径 ${itemPath}: ${err.message}`);
      }
    }
  } catch (error) {
    console.error(`无法访问目录 ${rootDir}: ${error.message}`);
  }
}

// 开始遍历
console.log("开始查找一级目录中没有package.json的文件夹...");
scanFirstLevelDirectories();

// 按字母顺序排序
foldersWithoutPackageJson.sort();

// 准备文件夹条目
const folderEntries = foldersWithoutPackageJson
  .map(folder => {
    // 确保路径中的分隔符是斜杠（用于Markdown链接）
    const markdownPath = folder.split(path.sep).join('/');
    return `- [${markdownPath}](./${markdownPath})`;
  })
  .join('\n');

// 更新todo.md文件
try {
  const content = `# Todo List\n\n${folderEntries}\n`;
  fs.writeFileSync(todoFilePath, content);
  console.log(`已更新 ${todoFilePath}，添加了 ${foldersWithoutPackageJson.length} 个没有package.json的文件夹`);
} catch (error) {
  console.error(`写入文件 ${todoFilePath} 时出错: ${error.message}`);
}
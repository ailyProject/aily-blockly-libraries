const fs = require('fs').promises;
const path = require('path');

async function main() {
  try {
    // 脚本位于 .scripts_git_action/ 下，库目录和输出文件都在仓库根目录
    const currentDir = path.join(__dirname, '..');
    const dirents = await fs.readdir(currentDir, { withFileTypes: true });
    const packageFolderMap = {};

    for (const dirent of dirents) {
      if (!dirent.isDirectory()) {
        continue;
      }

      const folderName = dirent.name;
      const packageJsonPath = path.join(currentDir, folderName, 'package.json');

      try {
        await fs.access(packageJsonPath, fs.constants.F_OK);
        const data = await fs.readFile(packageJsonPath, 'utf8');
        const packageJson = JSON.parse(data);

        if (packageJson.hide === true) {
          console.log(`跳过 ${folderName}，因为 package.json 中 hide 为 true`);
          continue;
        }

        if (typeof packageJson.name !== 'string' || packageJson.name === '') {
          console.log(`跳过 ${folderName}，因为 package.json 中没有有效的 name 字段`);
          continue;
        }

        packageFolderMap[packageJson.name] = folderName;
        console.log(`成功读取 ${folderName}/package.json`);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.error(`处理${packageJsonPath}时出错:`, error);
        }
      }
    }

    const outputPath = path.join(currentDir, 'package-folder-map.json');
    await fs.writeFile(outputPath, JSON.stringify(packageFolderMap, null, 2), 'utf8');

    console.log(`成功将${Object.keys(packageFolderMap).length}个库的包名目录映射写入到${outputPath}`);
  } catch (error) {
    console.error('发生错误:', error);
  }
}

main();

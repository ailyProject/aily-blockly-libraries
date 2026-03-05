const fs = require('fs').promises;
const path = require('path');

// 默认要提取的package.json中的键
const defaultKeysToExtract = [
  'name',
  'nickname',
  'description',
  'compatibility',
  'example',
  'url'
];

// 根据配置过滤package.json对象
function filterPackageJson(packageJson, keysToExtract) {
  const filteredJson = {};

  keysToExtract.forEach(key => {
    if (packageJson.hasOwnProperty(key)) {
      filteredJson[key] = packageJson[key];
    } else {
      if (key === 'tested') {
        filteredJson[key] = false;
      } else if (key === 'example') {
        // example字段不存在时不添加到结果中
        return;
      } else {
        filteredJson[key] = "";
      }
    }
  });

  return filteredJson;
}

async function main() {
  try {
    // 获取当前目录路径
    const currentDir = __dirname;

    // 设置要提取的键，可以根据需要修改这个数组
    // 如果要提取所有键，可以设置为null
    const keysToExtract = defaultKeysToExtract;

    // 读取当前目录下的所有项
    const dirents = await fs.readdir(currentDir, { withFileTypes: true });

    // 过滤出子目录
    const subdirs = dirents
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // 存储tested为true的库的内容
    const testedLibraries = [];
    // 存储普通库的内容（tested不为true的）
    const normalLibraries = [];
    // 存储以"core-"开头的库的内容
    const coreLibraries = [];

    // 处理每个子目录
    for (const subdir of subdirs) {
      const packageJsonPath = path.join(currentDir, subdir, 'package.json');
      const toolboxJsonPath = path.join(currentDir, subdir, 'toolbox.json');

      try {
        // 检查并读取package.json
        await fs.access(packageJsonPath, fs.constants.F_OK);
        const data = await fs.readFile(packageJsonPath, 'utf8');
        const packageJson = JSON.parse(data);

        // 如果 package.json 中存在 hide: true，则跳过该目录
        if (packageJson.hide === true) {
          console.log(`跳过 ${subdir}，因为 package.json 中 hide 为 true`);
          continue;
        }

        // 根据配置过滤package.json
        const filteredJson = keysToExtract ? filterPackageJson(packageJson, keysToExtract) : packageJson;

        // 如果package.json中没有icon，尝试从toolbox.json读取
        if (!filteredJson.icon || filteredJson.icon === "") {
          try {
            await fs.access(toolboxJsonPath, fs.constants.F_OK);
            const toolboxData = await fs.readFile(toolboxJsonPath, 'utf8');
            const toolboxJson = JSON.parse(toolboxData);
            
            if (toolboxJson.icon) {
              filteredJson.icon = toolboxJson.icon;
              console.log(`已从toolbox.json获取${subdir}的icon信息`);
            }
          } catch (toolboxError) {
            // toolbox.json不存在或无法读取时不打印错误
            if (toolboxError.code !== 'ENOENT') {
              console.error(`处理${toolboxJsonPath}时出错:`, toolboxError);
            }
          }
        }

        // 判断项目分类:
        // 1. 首先判断是否是"core-"开头的目录
        if (subdir.startsWith('core-')) {
          coreLibraries.push(filteredJson);
          console.log(`成功读取 ${subdir}/package.json (core)`);
        } 
        // 2. 然后判断是否tested为true
        else if (filteredJson.tested === true) {
          testedLibraries.push(filteredJson);
          console.log(`成功读取 ${subdir}/package.json (tested)`);
        } 
        // 3. 其他普通项目
        else {
          normalLibraries.push(filteredJson);
          console.log(`成功读取 ${subdir}/package.json`);
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`${subdir}目录下没有找到package.json`);
        } else {
          console.error(`处理${packageJsonPath}时出错:`, error);
        }
      }
    }

    // 合并三个数组，按照 tested为true -> 普通库 -> "core-"开头的库 的顺序排列
    const libraries = [...testedLibraries, ...normalLibraries, ...coreLibraries];

    // 写入结果到libraries.json
    const librariesJson = JSON.stringify(libraries, null);
    const outputPath = path.join(currentDir, 'libraries-ai.json');
    await fs.writeFile(outputPath, librariesJson, 'utf8');

    console.log(`成功将${libraries.length}个库的信息写入到${outputPath}（其中tested库${testedLibraries.length}个，普通库${normalLibraries.length}个，核心库${coreLibraries.length}个）`);
  } catch (error) {
    console.error('发生错误:', error);
  }
}

// 执行主函数
main();
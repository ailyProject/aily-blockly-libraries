const fs = require('fs');
const path = require('path');

// 项目根目录路径
const rootDir = path.resolve(__dirname);

// 存储收集到的库信息
const libraryInfo = [];

console.log('开始扫描项目目录...');

// 获取所有一级目录
const directories = fs.readdirSync(rootDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

console.log(`找到 ${directories.length} 个目录`);

// 处理每个目录
directories.forEach(dir => {
    const packageJsonPath = path.join(rootDir, dir, 'package.json');

    // 检查 package.json 是否存在
    if (fs.existsSync(packageJsonPath)) {
        try {
            const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

            libraryInfo.push({
                nickname: packageData.nickname || '-',
                name: packageData.name || '-',
                version: packageData.version || '-',
                status: packageData.tested || false,
                tester: packageData.tester || '-',
                dir
            });

            console.log(`✓ 已处理: ${dir}`);
        } catch (err) {
            console.error(`✗ 处理 ${dir} 出错:`, err.message);
        }
    } else {
        console.log(`- 跳过 ${dir}: 没有找到 package.json`);
    }
});

// 生成 Markdown 表格
let markdownTable = '| 序号 | 库名 | 包名 | 最新版本 | 状态 | 测试人 |\n';
markdownTable += '| :---: | :--- | :--- | :------- | :--- | :----- |\n';

libraryInfo.forEach((info, index) => {
    // 创建包名的npm链接
    const packageLink = `[${info.name}](${info.dir})`;

    markdownTable += `| ${index + 1} | ${info.nickname} | ${packageLink} | ${info.version} | ${info.status ? '✓' : '✗'} | ${info.tester} |\n`;
});

// 保存表格到文件
const outputPath = path.join(rootDir, 'test.md');
fs.writeFileSync(outputPath, markdownTable, 'utf8');

console.log('\n表格生成完成!');
console.log(`表格已保存到: ${outputPath}`);
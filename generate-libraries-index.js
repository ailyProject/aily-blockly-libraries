/**
 * 库索引生成脚本
 * 从各库目录的 info.json 生成统一的 libraries-index.json
 * 
 * 使用方法: node generate-libraries-index.js
 */

const fs = require('fs');
const path = require('path');

const LIBRARIES_DIR = __dirname;
const OUTPUT_FILE = path.join(LIBRARIES_DIR, 'libraries-index.json');

// 需要排除的目录
const EXCLUDE_DIRS = [
    'node_modules',
    '.git',
    'archive',
    'template'
];

/**
 * 递归获取所有库目录
 */
function getLibraryDirs() {
    const items = fs.readdirSync(LIBRARIES_DIR);
    const libraryDirs = [];

    for (const item of items) {
        const itemPath = path.join(LIBRARIES_DIR, item);
        
        // 跳过排除目录和文件
        if (EXCLUDE_DIRS.includes(item) || !fs.statSync(itemPath).isDirectory()) {
            continue;
        }

        // 检查是否存在 info.json
        const infoPath = path.join(itemPath, 'info.json');
        if (fs.existsSync(infoPath)) {
            libraryDirs.push({
                name: item,
                infoPath: infoPath
            });
        }
    }

    return libraryDirs;
}

/**
 * 解析库 info.json 并提取索引字段
 */
function parseLibraryInfo(infoPath, dirName) {
    try {
        const content = fs.readFileSync(infoPath, 'utf8');
        const info = JSON.parse(content);

        // 提取扁平化的索引数据
        return {
            name: info.name || dirName,
            displayName: info.displayName || info.name,
            category: info.category || 'utility',
            subcategory: info.subcategory || '',
            supportedCores: info.supportedCores || [],
            communication: info.communication || [],
            voltage: info.voltage || [],
            hardwareType: info.hardwareType || '',
            compatibleHardware: info.compatibleHardware || [],
            functions: info.functions || [],
            tags: info.tags || []
        };
    } catch (error) {
        console.error(`解析 ${infoPath} 失败:`, error.message);
        return null;
    }
}

/**
 * 生成索引文件
 */
function generateIndex() {
    console.log('开始生成库索引...\n');

    const libraryDirs = getLibraryDirs();
    console.log(`找到 ${libraryDirs.length} 个包含 info.json 的库目录\n`);

    const libraries = [];
    let successCount = 0;
    let failCount = 0;

    for (const { name, infoPath } of libraryDirs) {
        const libraryInfo = parseLibraryInfo(infoPath, name);
        if (libraryInfo) {
            libraries.push(libraryInfo);
            successCount++;
            console.log(`✓ ${name}`);
        } else {
            failCount++;
            console.log(`✗ ${name}`);
        }
    }

    // 按名称排序
    libraries.sort((a, b) => a.name.localeCompare(b.name));

    // 生成索引文件
    const index = {
        $schema: 'libraries-index-schema',
        version: '1.0.0',
        generated: new Date().toISOString(),
        count: libraries.length,
        libraries: libraries
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index), 'utf8');

    console.log(`\n索引生成完成！`);
    console.log(`成功: ${successCount}, 失败: ${failCount}`);
    console.log(`输出文件: ${OUTPUT_FILE}`);

    // 生成统计信息
    printStatistics(libraries);
}

/**
 * 打印统计信息
 */
function printStatistics(libraries) {
    console.log('\n=== 统计信息 ===');

    // 按分类统计
    const categoryCount = {};
    libraries.forEach(lib => {
        const category = lib.category || 'unknown';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    console.log('\n分类分布:');
    Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count}`);
    });

    // 按硬件类型统计
    const hwTypeCount = {};
    libraries.forEach(lib => {
        if (lib.hardwareType) {
            hwTypeCount[lib.hardwareType] = (hwTypeCount[lib.hardwareType] || 0) + 1;
        }
    });
    console.log('\n硬件类型分布:');
    Object.entries(hwTypeCount).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
    });

    // 按通信方式统计
    const commCount = {};
    libraries.forEach(lib => {
        (lib.communication || []).forEach(comm => {
            commCount[comm] = (commCount[comm] || 0) + 1;
        });
    });
    console.log('\n通信方式分布:');
    Object.entries(commCount).sort((a, b) => b[1] - a[1]).forEach(([comm, count]) => {
        console.log(`  ${comm}: ${count}`);
    });

    // 按支持内核统计
    const coreCount = {};
    libraries.forEach(lib => {
        (lib.supportedCores || []).forEach(core => {
            coreCount[core] = (coreCount[core] || 0) + 1;
        });
    });
    console.log('\n支持内核分布:');
    Object.entries(coreCount).sort((a, b) => b[1] - a[1]).forEach(([core, count]) => {
        console.log(`  ${core}: ${count}`);
    });
}

// 运行
generateIndex();

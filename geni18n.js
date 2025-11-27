/**
 * dependencies:
 * "@langchain/core": "^0.3.46",
 * "langchain": "^0.3.23",
 * "@langchain/openai": "^0.5.6",
 * "zod": "^3.24.3"
 * "dotenv"
 */
const fs = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { ChatOpenAI } = require('@langchain/openai');
const { StructuredOutputParser } = require('@langchain/core/output_parsers');
const { z } = require('zod'); 


const TEMPDIR_PATH = path.join(__dirname, '.temp');


// 文件读取
async function readFile(filePath) {
    try {
        return await fs.readFile(filePath, 'utf-8');
    } catch (e) {
        console.error(`无法读取文件 ${filePath}: ${e}`);
        return '';
    }
}

// 文件内容写入
async function writeFile(filePath, content) {
    if (!content) {
        console.error(`内容为空，无法写入文件 ${filePath}`);
        return;
    }
    try {
        await fs.writeFile(filePath, content, 'utf-8');
    } catch (e) {
        console.error(`写入文件失败 ${filePath}: ${e}`);
    }
}

// 初始化聊天模型
function initChatModel(key, model, baseUrl) {
    return new ChatOpenAI({
        apiKey: key,
        modelName: model,
        temperature: 0.1,
        configuration: {
            baseURL: baseUrl,
        }
    });
}

// 提示模板
const i18nTemplatePrompt = ChatPromptTemplate.fromMessages([
    [
        'system',
        `
    需要分析的代码内容是：{content}，
    规范文件readme: {readme_content}
    其中toolbox_name的值为: {toolbox_name}
    不需要别的描述说明，只需要根据规范文件的说明，提取出相应的内容组成json格式的模板文件即可，不要以markdown的格式返回
    `
    ],
    ['user', '{text}']
]);

const i18nPrompt = ChatPromptTemplate.fromMessages([
    [
        'system',
        `
    你是精通各国语言的翻译专家，
    你需要将以下内容翻译成指定的语言，
    内容为：{content}
    不用任何说明，直接将模板内容翻译为指定语言的版本即可，注意要保持模板原有的格式，比如模板为json格式，则翻译后也要保持json格式
    `
    ],
    ['user', '{text}']
]);

// 定义输出模式
const I18nTemplateSchema = z.object({
    content: z.string().describe('内容')
});

const I18nSchema = z.object({
    lg: z.string().describe('语言类型, 简体中文：zh_cn，繁体中文：zh_hk, 英文：en, 日文：ja, 韩文：ko, 法文：fr, 西班牙文：es, 德文：de, 俄文：ru, 葡萄牙文：pt，阿拉伯文：ar'),
    content: z.string().describe('内容')
});

const I18nModelListSchema = z.object({
    i18n_list: z.array(I18nSchema).describe('语言类型列表')
});

// 生成i18n模板
async function genI18nTemplate(content, readmeContent, toolboxName, model, key, baseUrl) {
    const text = "根据readme的规范，提取出相应的信息生成模板文件的内容，注意在提取模板时要注意，每个message*下对应的args*中的options列表中每一项的第一个元素也是需要提取并转换为对应的语言的，至于第二个元素原样提取即可";

    const prompt = await i18nTemplatePrompt.invoke({
        content,
        readme_content: readmeContent,
        toolbox_name: toolboxName,
        text
    });

    const llm = initChatModel(key, model, baseUrl);
    // const parser = StructuredOutputParser.fromZodSchema(I18nTemplateSchema);
    const structuredLlm = llm.withStructuredOutput(I18nTemplateSchema);
    const res = await structuredLlm.invoke(prompt);

    return res
}

// 批量生成i18n
async function genI18nBatch(template, lgList, model, key, baseUrl) {
    const text = `将模板内容分别转换为${lgList.join(',')}`;

    const prompt = await i18nPrompt.invoke({
        content: template,
        text
    });

    const llm = initChatModel(key, model, baseUrl);

    const structuredLlm = llm.withStructuredOutput(I18nModelListSchema);
    const res = await structuredLlm.invoke(prompt);

    return res;
}

// 重试机制
async function withRetry(fn, maxRetries = 3) {
    let retries = 0;
    let lastError;

    while (retries < maxRetries) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            retries++;

            const delay = Math.min(1000 * Math.pow(2, retries - 1), 5000);
            console.log(`重试第${retries}次，等待${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}

async function callGenI18nBatch(template, lgList, model, key, baseUrl) {
    const batchResult = await genI18nBatch(template, lgList, model, key, baseUrl);
    if (!batchResult) {
        console.error("<<< 生成i18n失败");
        return null;
    }
    return batchResult.i18n_list;
}

async function startGenI18nBatch(i18nPath, template, lgList, model, key, baseUrl) {
    try {
        const text = `将模板内容分别转换为${lgList.join(',')}`;
        console.log(">>> 开始生成i18n文件内容: ", text);
        const i18n_list = await callGenI18nBatch(template, lgList, model, key, baseUrl);
        // 写入文件
        for (const item of i18n_list) {
            const itemPath = path.join(i18nPath, `${item.lg}.json`);
            await writeFile(itemPath, item.content);
        }
        console.log("<<< i18n生成成功")
    } catch (error) {
        console.error("<< 生成i18n失败: ", error);
        return null;
    }
}

async function createTempDir() {
    try {
        await fs.mkdir(TEMPDIR_PATH, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') {
            console.error(`创建临时目录失败: ${TEMPDIR_PATH}`, err);
            throw err;
        }
    }
}

async function saveTemplateFile(filename, content) {
    const i18nTemplateFilePath = path.join(TEMPDIR_PATH, filename);
    await writeFile(i18nTemplateFilePath, content);
}

async function getI18nTemplateFile(filename) {
    // 获取当前目录下的.i18n_template文件夹中的文件内容
    const i18nTemplatePath = path.join(TEMPDIR_PATH, filename);
    try {
        const content = await readFile(i18nTemplatePath);
        return content;
    } catch (err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }
    }
    return null;
}

// 生成i18n代码
async function generateI18nCode(blockContent, toolboxName, readmeContent, prjPath, llmModel, llmKey, llmBaseUrl) {
    return await withRetry(async () => {
        // 生成i18n模板文件
        const i18nTemplateName = `${toolboxName}.json`;
        let i18nTemplateFileContent;
        const i18nTemplateFileContentStr = await getI18nTemplateFile(i18nTemplateName);
        if (!i18nTemplateFileContentStr) {
            console.log(">>> 开始生成i18n模板文件");
            const i18nReadmeContent = readmeContent;
            const i18nTemplateContent = await genI18nTemplate(
                blockContent,
                i18nReadmeContent,
                toolboxName,
                llmModel,
                llmKey,
                llmBaseUrl
            );

            if (!i18nTemplateContent) {
                console.error("生成i18n模板失败");
                return false;
            }
            console.log("<<< i18n模板生成成功")

            console.log("i18n模板内容为: ", i18nTemplateContent.content);

            i18nTemplateFileContent = i18nTemplateContent.content;
            // 保存模板文件
            await saveTemplateFile(i18nTemplateName, JSON.stringify(i18nTemplateContent.content));
        } else {
            i18nTemplateFileContent = JSON.parse(i18nTemplateFileContentStr);
        }


        // 生成i18n文件
        const i18nPath = path.join(prjPath, "i18n");
        try {
            await fs.mkdir(i18nPath, { recursive: true });
        } catch (err) {
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }

        const lgList = [
            "简体中文(zh_cn)",
            "繁体中文(zh_hk)",
            "英文(en)",
            "日文(ja)",
            "韩文(ko)",
            "法文(fr)",
            "德文(de)",
            "阿拉伯文(ar)",
            "俄文(ru)",
            "西班牙文(es)",
            "葡萄牙文(pt)",
        ];

        // const genResult = await genI18nBatch(i18nTemplateContent.content, lgList, llmModel, llmKey, llmBaseUrl);

        // if (!genResult) {
        //     console.error("生成i18n失败");
        //     return false;
        // }
        // console.log("i18n生成成功")

        // for (const item of genResult.i18n_list) {
        //     const itemPath = path.join(i18nPath, `${item.lg}.json`);
        //     await writeFile(itemPath, item.content);
        // }

        // return true;

        // 将语言列表分成每组3个
        const batchSize = 3;
        const lgBatches = [];
        for (let i = 0; i < lgList.length; i += batchSize) {
            lgBatches.push(lgList.slice(i, i + batchSize));
        }

        console.log(`将语言列表拆分为${lgBatches.length}组进行处理`);

        // 逐组处理语言
        for (let i = 0; i < lgBatches.length; i++) {
            await startGenI18nBatch(i18nPath, i18nTemplateFileContent, lgBatches[i], llmModel, llmKey, llmBaseUrl);
        }

        console.log("所有i18n生成成功");

        return true;
    });
}

// 主函数
async function startGenerate(directories, readmePath, llmModel, llmKey, llmBaseUrl) {
    try {
        const readmeContent = await readFile(readmePath);
        if (!readmeContent) {
            console.error("读取README.md失败");
            process.exit(1);
        }

        // 创建临时目录
        await createTempDir();

        for (const dir of directories) {
            let curState = false;
            try {
                const prjPath = path.join(process.cwd(), dir.trim());
                console.log("项目路径为: ", prjPath);

                const blockJsonPath = path.join(prjPath, "block.json");
                const blockContent = await readFile(blockJsonPath);
                if (!blockContent) {
                    console.error(`读取${dir}目录下的block.json失败`);
                    process.exit(1);
                }

                const toolboxJsonPath = path.join(prjPath, "toolbox.json");
                const toolboxContentStr = await readFile(toolboxJsonPath);
                if (!toolboxContentStr) {
                    console.error("读取toolbox.json失败");
                    process.exit(1);
                }

                const toolboxContent = JSON.parse(toolboxContentStr);
                const toolboxName = toolboxContent.name || "";
                console.log("toolbox_name为: ", toolboxName);

                // 生成i18n代码
                await generateI18nCode(blockContent, toolboxName, readmeContent, prjPath, llmModel, llmKey, llmBaseUrl);
                curState = true;
            } catch (error) {
                console.error(`处理目录 ${dir} 时发生错误:`, error);
            }

            // 将处理得目录路径以及状态以追加的方式写入文件state.txt
            const stateFilePath = path.join(TEMPDIR_PATH, 'state.txt');
            const stateContent = `${dir.trim()} ${curState ? 'success' : 'fail'}\n`;
            try {
                await fs.appendFile(stateFilePath, stateContent, 'utf-8');
            } catch (error) {
                console.error(`写入状态文件失败: ${error}`);
            }
        }
    } catch (error) {
        console.error("执行失败:", error);
        process.exit(1);
    }
}

async function main() {
    try {
        // 获取当前目录路径
        const currentDir = __dirname;

        // 获取命令行参数
        const args = process.argv.slice(2);
        let dirents = [];
        let isManual = false;

        if (args.length > 0) {
            dirents = args;
            isManual = true;
        } else {
            // 读取当前目录下除去以.开头的文件夹
            dirents = (await fs.readdir(currentDir, { withFileTypes: true }))
                .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
                .map(dirent => dirent.name);
        }

        // 存储待生成i18n的目录
        const directories = [];

        // 处理每个目录
        for (const subdir of dirents) {
            const packageJsonPath = path.join(currentDir, subdir, 'package.json');
            const blockJsonPath = path.join(currentDir, subdir, 'block.json');
            const toolboxJsonPath = path.join(currentDir, subdir, 'toolbox.json');

            // 检查必要文件是否存在
            let hasRequiredFiles = true;
            try {
                await fs.access(packageJsonPath, fs.constants.F_OK);
                await fs.access(blockJsonPath, fs.constants.F_OK);
                await fs.access(toolboxJsonPath, fs.constants.F_OK);
            } catch (error) {
                if (isManual) {
                    console.log(`跳过 ${subdir}，因为缺少必要的文件`);
                }
                hasRequiredFiles = false;
            }

            if (!hasRequiredFiles) continue;

            if (isManual) {
                directories.push(subdir);
                continue;
            }

            const i18nPath = path.join(currentDir, subdir, 'i18n');

            // 检查i18n目录是否存在
            try {
                await fs.stat(i18nPath);
                // console.log(`跳过 ${subdir}，因为已存在 i18n 目录`);
            } catch (error) {
                // i18n目录不存在，判断是否需要生成
                // 读取package.json
                const data = await fs.readFile(packageJsonPath, 'utf8');
                const packageJson = JSON.parse(data);

                // 如果 package.json 中存在 hide: true，则跳过该目录
                if (packageJson.hide === true) {
                    // console.log(`跳过 ${subdir}，因为 package.json 中 hide 为 true`);
                    continue;
                }

                // 如果 package.json 中 tested 不为 true，则跳过该目录
                if (packageJson.tested !== true) {
                    // console.log(`跳过 ${subdir}，因为 package.json 中 tested 不为 true`);
                    continue;
                }
                
                directories.push(subdir);
            }
        }

        // 如果有需要处理的目录，开始生成i18n
        if (directories.length > 0) {
            const readmePath = path.join(currentDir, 'i18n.md');
            const llmModel = process.env.API_MODEL;
            const llmKey = process.env.API_KEY;
            const llmBaseUrl = process.env.API_BASE_URL || 'https://api.openai.com/v1';

            console.log(`找到 ${directories.length} 个需要生成i18n的目录: ${directories.join(', ')}`);
            await startGenerate(directories, readmePath, llmModel, llmKey, llmBaseUrl);
            console.log("i18n生成完成");
        } else {
            console.log('没有找到需要处理的目录');
        }
    } catch (error) {
        console.error("发生错误:", error);
        process.exit(1);
    }
}

main()

# `readme_ai.md` 质量问题排查与治理方案

> 排查日期：2026-08-10  
> 排查分支/提交：`i3w` / `e39537a7`  
> 重点基准：`core-logic/readme_ai.md` 的 `49c0ac17` 版本与当前版本  
> ABS 实现审计基准：`aily-blockly` 当前远端 `main` / `0615d93e`、活动分支 `i3w-sim-preview` / `b579b768`，并记录实际工作源码与依赖指纹  
> 状态：P0 已完成止血实现；P1 已接入新增问题差异门禁、版本化动态签名与版本化 headless Blockly 黄金夹具；不批量覆盖各库 README，不改变 Blockly 运行时宽松解析策略。

## 1. 结论摘要

问题不是单个同事把少数文档“写短了”，而是一次批量生成与弱校验共同造成的系统性退化。

1. `db67f4fa`（2026-05-12，`更新readme文档`）一次改动 739 个文件，其中包含 368 个 `readme_ai.md` 和 368 个面向人的 README，并在同一提交引入 `.scripts/check-readme-compliance.js`。当前 `core-logic/readme_ai.md` 的退化就来自该提交。
2. 原有的 `npm run readme:fix` 不是大模型提示词，而是确定性脚本。它会根据 `package.json`、静态 `block.json` 和对 `generator.js` 的正则猜测，直接覆盖已有文档。生成事实的输入不完整，模板却把结果写成确定事实；P0 已将该覆盖入口禁用。
3. 当前校验主要检查文件名、章节、表头、块名和大小，不检查 ABS 是否能被解析、输入是否映射正确、动态字段是否完整、示例是否真正可运行。因此 `core-logic`、`core-loop`、`adafruit_DHT` 三个明显错误的样本均被判定为 0 错误。
4. 这不是“560 个库全部同样不可用”，但所有经该链路生成或覆盖的文档都应暂时视为“结构合规、语义未验”。尤其是动态输入、mutator、运行时 extension、回调/Hat、对象生命周期和多步骤工作流库。
5. 不建议直接回滚 `db67f4fa`。历史文档更有使用知识，但也存在旧 DSL、过期枚举和个别块名错误。正确做法是先停止覆盖，再建立可验证的生成中间模型、黄金样本和 ABS round-trip 校验，最后分批重建。
6. `adafruit_DHT` 暴露了第二类系统性错误：`field_variable` 被错误当成 `input_value`。全库定义中共有 3499 个变量字段参数位，其中 2700 个在当前表格里被写成 `variables_get($var)`，涉及 277 个库；正确形式应是裸 `$var`。这会通过语法解析，却产生错误的 ABI 字段结构，因此单纯检查“能 parse”仍会漏报。
7. `aily-blockly` 的 ABI→ABS 转换器对 DHT 正常 ABI 能正确输出 `dht_read_temperature($dht)`；README 生成器没有复用槽位语义，而是手拼字符串，才造成该规则漂移。但转换器自身仍有部分状态/位置参数的可逆性边界，未经契约测试不能直接提升为绝对真源。
8. Blockly 运行时的 warning、文本降级、自动变量创建、动态 `EXTRA_N` 映射和大小写恢复是 Agent 高效执行所需的宽松策略，应继续保留。README 治理需要独立的“文档契约审计”配置，而不是把交互式导入器改成全局严格模式。

### 1.1 主线复核后的实施边界

2026-08-10 本阶段再次核对远端后，`origin/main` 已前进到 `0615d93e`；活动分支仍为 `i3w-sim-preview` / `b579b768`。当前 main 与活动分支的 `abiAbsConverter.ts`、`absParser.ts`、`editBlockTool.ts` blob 已不同，因此不再用单个 Git revision 或旧 blob 等同于“实际受测实现”。运行时 runner 只读加载当前活动工作源码，并逐文件报告 SHA-256、HEAD blob 与脏状态；发布/合并证据必须在目标提交上使用 `--require-clean-runtime` 重跑。

两条分支的 `block-plus-minus` 初始化入口、`if.js` 和 `switch-case.js` blob 当前相同。主应用 `blockly.component.ts` 会加载该插件；若 headless 环境遗漏这一步，`controls_if` 会缺少插件提供的 `plus()/addElseIf_()`，产生并非产品主路径的假失败。本阶段已把实际桌面初始化模块纳入版本化 fixture，并用 `controls_if`、`controls_ifelse`、`controls_switch` 三类动态契约验证。

但实际存在两条不同消费路径：

1. 直接 ABI 路径：`convertAbsToAbi` 后进入序列化加载；
2. Agent 路径：`BlocklyAbsParser` 后经 `createBlockFromConfig` 做变量创建、大小写恢复、动态字段/输入映射和失败收集。

因此，本治理任务遵循以下边界：

- 不把 parser warning 或可恢复降级升级为运行时全局错误；
- 不在本任务修改 `aily-blockly` 转换器/parser；已发现的可选参数左移、结构化对象含 `name` 被误判为变量、特殊变量名等问题单独进入 ABS↔ABI 缺陷清单，并分别验证两条调用路径；
- README 审计只拒绝能由 `block.json` 槽位类型确定的错误，例如把 `field_variable` 写成 `variables_get(...)`、同行 statement 标记和伪块占位符；
- README 的值输入变量只输出显式 `variables_get($var)`；parser 的旧内容恢复能力不进入 Agent 文档契约，文档 strict profile 对裸 `$var` 值输入报错。

## 2. 排查范围与方法

本次排查覆盖：

- `aily-blockly-libraries` 当前 560 个含 `block.json` 的库、7214 个块和对应 `readme_ai.md`；
- `core-logic/readme_ai.md` 在 `49c0ac17`、`db67f4fa` 和当前 HEAD 的差异；
- `.scripts/generate-readme-candidate.js`、`.scripts/check-readme-compliance.js`、`.scripts/validate-library-compliance.js`、CI workflow 和 README 编写规范；
- `aily-blockly` 中 `abiAbsConverter.ts`、`absParser.ts`、`block-definition.service.ts`、`editBlockTool.ts`、`syncAbsFileTool.ts`，以及 README 消费路径、主 Agent prompt、`abs-syntax-reference` 与 `library-migration-guide`；
- `core-loop`、`adafruit_DHT`、`ArduinoJson` 等不同模式的横向样本。

统计口径说明：模式计数用于发现系统性风险，不代表每一次字符串命中都必然导致最终生成失败；反过来，当前统计也不能覆盖全部语义错误。

## 3. 量化结果

### 3.1 回归提交影响

| 指标 | 结果 |
|---|---:|
| `db67f4fa` 总改动文件 | 739 |
| 被改写的 AI README | 368 |
| 被改写的人类 README | 368 |
| 批量前 AI README 总字节 | 1,270,316 |
| 批量后 AI README 总字节 | 1,183,306 |
| 总体体积下降 | 约 6.85% |
| 原来含至少 2 个三级示例标题的文档 | 97 |
| 批量后仍含至少 2 个三级示例标题的文档 | 0 |
| 批量后含 `child_block()` 的文档 | 70 |

体积只下降约 6.85%，但 97 份多场景说明全部被压成单个模板示例，说明损失的主要不是冗余文字，而是工作流知识和边界条件。

### 3.2 当前全库状态

| 指标 | 结果 | 风险解释 |
|---|---:|---|
| 含 `block.json` 的库 | 560 | 审计全集 |
| 块总数 | 7214 | README 应覆盖的接口面 |
| 含 `child_block()` 的 AI README | 79 | 伪块/不可执行占位符 |
| 含 `math_number(0)` 的 AI README | 310 | 大量无业务语义默认值 |
| 含 `Dynamic code` 或 `See generator` 的文档 | 416 | 生成代码列大面积无信息 |
| 上述生成代码占位表格单元 | 3269 / 7214（约 45.3%） | 强制列近半失效 |
| 含 `ABS Examples` 的文档 | 503 | 57 份没有该节 |
| 示例中没有出现本库块的文档 | 25 | 示例无法说明本库用法 |
| 示例只出现 1 种本库块的文档 | 37 | 往往只有初始化，没有完整工作流 |
| 固定出现 `serial_begin(Serial, 9600)` | 397 | 模板化外部依赖 |
| 固定出现 `time_delay(math_number(1000))` | 406 | 模板化外部依赖 |
| 含 extension 或 mutator 的库 | 42 | 静态 `block.json` 不足以描述运行时形状 |
| `generator.js` 中存在运行时 shape 构造痕迹的库 | 18 | 需逐分支生成签名/示例 |
| 写了笼统 `Dynamic fields` 注记的文档 | 31 | 只提示“可能变化”，未给实际签名 |
| 超过 15KB 硬限制的文档 | 4 | compact fallback 仍不能保证上限 |

### 3.3 当前合规检查自身也未闭环

执行 `node .scripts/check-readme-compliance.js --all` 的结果：

| 指标 | 结果 |
|---|---:|
| 检查库数 | 560 |
| 含任意错误的库 | 104 |
| 错误总数 | 404 |
| 含 AI README 错误的库 | 54 |
| AI README 错误数 | 208 |
| 缺失块条目 | 96，集中在 8 个库 |

即使只按当前较弱规则，仓库也未达到全量合规。更关键的是，`core-logic`、`core-loop`、`adafruit_DHT` 分别单独运行该检查时都显示 0 错误，说明“通过”不等于“Agent 可正确使用”。

### 3.4 `field_variable` 隐藏错误专项审计

专项审计方法：合并每个块的 `args0..argsN`，按原始参数顺序定位 `field_variable` 槽位，再解析 Block Definitions 表格中对应调用的顶层实参。该口径不是简单搜索 `variables_get`，而是检查它是否正好落在变量字段槽位。

| 指标 | 结果 |
|---|---:|
| 含 `field_variable` 的块 | 3413 / 7214 |
| `field_variable` 参数位总数 | 3499 |
| 涉及的库 | 349 |
| 错写为 `variables_get($var)` | 2700，涉及 277 个库 |
| 正确写为裸 `$var` | 402，涉及 20 个库 |
| 因 compact 截断或表格缺失而无法使用 | 225，涉及 14 个库 |
| 写成 `VAR` 等占位符或其他非变量字段形式 | 172，涉及 40 个库 |
| 表格之外直接出现同类错误调用的保守下限 | 343 处，涉及 233 个库 |

四类结果之和正好覆盖 3499 个变量字段参数位。另有至少 98 个正确表格行来自 compact 分支偶然使用 `$var`，而同一生成器的普通分支使用 `variables_get($var)`；这进一步证明生成规则内部也不一致。

## 4. 典型退化证据

### 4.1 `core-logic`：正确工作流被替换为不可执行占位示例

`49c0ac17` 的价值在于明确表达了：

- `controls_if` 的 `@IF0/@DO0/@IF1/@DO1/@ELSE` 命名输入；
- `controls_switch` 的 `@SWITCH/@CASEn/@DOn/@DEFAULT`；
- 多条件、switch、取反、三元表达式等组合用法；
- 动态分支如何扩展。

当前版本则生成：

```abs
arduino_setup()
    controls_if(math_number(0)) @DO0: child_block()
    serial_begin(Serial, 9600)
```

问题包括：

1. `@DO0:` 被写在块调用同一行；当前 ABS parser 的块行只接受 `block_type(...)`，命名输入由后续缩进行解析，该示例不能按文档原样解析。
2. `child_block()` 不是库中的真实块。
3. 条件用 `math_number(0)`，没有表达布尔条件和组合关系。
4. 示例错误地把 `controls_if` 放入 `arduino_setup()`，没有说明最常见的循环判断场景。
5. 多分支和 switch 动态输入知识全部丢失。

但 `49c0ac17` 也不是可直接全量回滚的绝对真源：其中 `controls_ifelse` 行使用了 `controls_if()`，并把实际枚举 `NEQ` 写成 `NE`。因此历史内容应作为领域知识来源和人工修复参考，而不是直接覆盖当前文件。

### 4.2 `core-loop`：模板选择了根块自身作为根块子节点

当前 Basic Usage 生成了：

```abs
arduino_setup()
    arduino_setup() @ARDUINO_SETUP: child_block()
    serial_begin(Serial, 9600)

arduino_loop()
    arduino_loop() @ARDUINO_LOOP: child_block()
    time_delay(math_number(1000))
```

这会把 `arduino_setup` 嵌套进 `arduino_setup`，并再次使用不可解析的同行 `@INPUT:` 和伪块。根因是模板把第一个“初始化/语句块”和第一个“值块”机械塞入固定骨架，没有生命周期、连接类型和根块约束。

### 4.3 `adafruit_DHT`：静态 `block.json` 无法表示 extension 注入的必需参数

`dht_init` 的静态 `block.json` 只有 `VAR` 和 `TYPE`，但 `generator.js` 注册的 `dht_init_dynamic` 会：

- DHT11/21/22：运行时追加 `PIN`；
- DHT20：运行时追加 `WIRE`。

生成器只读取静态参数，于是当前文档写成：

```abs
dht_init("dht", DHT11)
```

并仅用一句 “may add fields at runtime” 带过。Agent 不知道第三个参数是什么，也不知道不同型号对应不同签名。旧文档虽然含旧 DSL 痕迹，却正确保留了 `dht_init("dht", DHT22, 2)`、`dht_init("dht", DHT20, Wire)`、读取成功检查和最小读取间隔等关键知识。

这证明生成器不能只解析静态 `block.json`；extension/mutator 分支、`generator.js` 中读取的运行时字段以及库使用约束必须进入文档数据模型。

### 4.4 `adafruit_DHT`：变量字段与变量读取块被混为一谈

`dht_read_temperature`、`dht_read_humidity` 和 `dht_read_success` 的 `VAR` 都是 `field_variable`。当前文档却统一写成：

```abs
dht_read_temperature(variables_get($dht))
```

正确形式是：

```abs
dht_read_temperature($dht)
```

两种写法不是风格差异，而会产生不同结构：

| ABS 位置 | 正确写法 | parser 行为 | 目标 ABI 结构 |
|---|---|---|---|
| 外层参数是 `field_variable` | `dht_read_temperature($dht)` | `parseFieldValue` 把 `$dht` 解析为变量字段对象 | `fields.VAR = { id, name: "dht", type: "DHT" }` |
| 外层参数是 `field_variable` | `dht_read_temperature(variables_get($dht))` | `parseFieldValue` 把整个调用当普通字符串 | `fields.VAR = "variables_get($dht)"`，错误 |
| 参数是 `input_value` | `serial_println(Serial, variables_get($dht))` | `parseInlineValue` 创建嵌套变量读取块 | `inputs.*.block.type = "variables_get"`，正确 |

因此 README 模型必须保留 `kind=field/valueInput`，不能先把所有参数都降成字符串再猜写法；字段变量固定输出 `$var`，值输入变量固定输出 `variables_get($var)`。

## 5. 根因分析

### 5.1 自动修复实际是无条件重写

`.scripts/check-readme-compliance.js:634-640` 在 `--fix` 下调用 `generateHumanReadme` 和 `generateAiReadmeWithinLimit`，对已有文档直接 `writeIfChanged`。`package.json` 把它暴露为 `npm run readme:fix`，主 validator 在 README 报错时又建议运行该命令。

这形成了危险反馈环：

```text
弱规则报错 -> 建议 --fix -> 模板覆盖人工知识 -> 结构通过 -> 语义退化被隐藏
```

### 5.2 多套 ABS 拼装逻辑并存且规则不一致

- `.scripts/gen-readme-ai.js`：只给缺失文档的库生成，主要读取 `args0`；
- `.scripts/check-readme-compliance.js --fix`：覆盖已有文档，合并 `args0..argsN`；
- `aily-blockly/editBlockTool.ts` 的库分析报告又维护一套 `generateAbsFormat`；
- `aily-blockly/abiAbsConverter.ts` 才是实际工程导入/导出所用的转换器。

这些实现已经发生实质漂移：

- 两个 libraries 脚本都把 `field_variable` 写成 `variables_get($var)`；
- `check-readme-compliance.js` 的 compact 分支反而写成正确的 `$var`；
- `editBlockTool.generateAbsFormat` 的变量字段写法正确，但仍会生成同行 `@INPUT:`、`condition/value/list` 占位符，并在 120 字符处用 `...` 截断；
- `abiAbsConverter` 能正确区分字段和输入，还对 `controls_if`、`controls_switch`、`@extra`、特殊变量名做了专门处理，但 README 生成完全没有调用它。

只要 canonical ABS 仍由多个模块手工拼接，同类隐藏错误就会反复出现。

### 5.3 事实提取模型不够

当前生成器从参数名猜值类型和默认示例，例如未知 `input_value` 一律退化成 `math_number(0)`；它不能可靠处理：

- extension/mutator 动态字段和动态输入数量；
- Hat、回调和特殊 statement body 连接；
- 对象创建、变量注册、初始化先后顺序；
- 条件依赖、异步回调、状态机和资源释放；
- 板级动态下拉、总线选择和条件参数；
- 上游库的使用限制、最小采样周期等语义。

### 5.4 示例生成目标错误

模板目标是“凑出一个 Arduino 骨架”，不是“说明该库最小可用工作流”。固定加入串口和延时，并从块列表中机械选择一个 init/value block，导致：

- 25 份文档的示例完全没有本库块；
- 37 份只出现一种本库块；
- 大量示例只初始化或打印默认 0，不展示成功判断、配置、写入、回调等关键路径；
- 引入未声明的跨库依赖，掩盖本库真实前置条件。

### 5.5 “Generated Code” 强制列成本高、收益低

抽取器用正则匹配 `Arduino.forBlock[...] = function` 和少数 return 形式，无法稳健理解别名赋值、箭头函数、拼接代码、辅助函数和动态注册。当前 45.3% 的表格单元最终只是 `Dynamic code` 或 `See generator`。

如果 Agent 真需要 C++ 语义，主 prompt 已允许进一步读取 `generator.js`。因此这列不应在信息不足时伪装成已抽取事实，更不应挤占复杂库的示例空间。

### 5.6 校验只验证外形，不验证可用性

`validateAiReadme` 目前验证：

- 文件名和大小；
- `Library Info` / `Block Definitions` 章节；
- 固定表头；
- 下拉库是否存在 `Parameter Options`；
- 每个块名字符串是否在文档中；
- 语言比例。

它不验证：

- 表格 ABS 和示例能否被 parser 接受；
- positional/named input 是否映射到正确槽位；
- block type、enum、字段数量是否与运行时一致；
- 示例是否包含本库块、是否含伪块、是否完成初始化到使用的闭环；
- dynamic variant、extraState、mutator 数量和变量生命周期；
- ABS 导入后能否 round-trip，或生成 C++ 是否可 lint/build。

### 5.7 “提示词”存在两个不同问题

#### README 生成侧

当前仓库没有负责批量生成 README 的 LLM prompt；核心问题是确定性脚本和规范。`aily-blockly` 的 `library-migration-guide` 只把 `README_AI.md` 列为产物，没有给出足够的生成步骤、证据优先级和验收门槛。仅优化一句提示词无法修复当前问题。

#### README 消费侧

`aily-blockly` 当前主 prompt 已说明：优先读 `readme_ai.md`，若缺失、不完整或矛盾，再检查 `block.json` 和 `generator.js`。方向正确，但系统性模板错误往往“外表完整且不自相矛盾”，Agent 不一定触发降级读取。

消费侧需要补充：

1. README 中出现占位符、动态字段未展开、示例无法 parse、表格和示例签名不同，即视为不可信；
2. 动态库必须用 `analyzeLibrary(mode="analysis")` 或运行时 block metadata 复核；
3. 对非平凡 ABS 修改必须在提交前执行 import/round-trip 校验，不以“README 看起来完整”为完成条件。

### 5.8 ABS↔ABI 实现审计：可复用能力与边界

#### 已经存在的可复用语法能力

`abiAbsConverter.ts` 可以作为 fixture 渲染和复核的重要实现：

- 默认 `explicitBlockTypes=true`，值输入中的变量读取块会保留为 `variables_get($var)`；
- `formatFieldValue` 识别 `field_variable` 后直接输出安全的 `$var`；
- `buildBlockCall` 按 `argsOrder` 交错输出 field 与 value input，不采用“字段在前、输入在后”的错误简化；
- `controls_if`、`controls_switch` 使用专门的多行命名输入格式；当前工作树另有尚未进入远端主线的 `controls_ifelse` 修复；
- 动态状态可携带 `@extra:{...}`，特殊字符变量名会安全转义；
- ABS→ABI 复用同一个 `BlocklyAbsParser`，能够收集变量名、ID 和类型。

这意味着中长期 README 生成器不应继续维护与主实现无关的完整 ABS 方言；但在转换器自身的契约矩阵通过前，libraries 侧仍需保留最小、槽位感知的静态审计，不能仅凭“转换器输出”判定文档正确。

#### 转换器不是运行时变体发现器

`block-definition.service.ts` 能合并 `args0..args10` 并保留 `field/valueInput/statementInput` 顺序，但当前 `BlockMeta` 没有完整保留下拉选项、`extensions`、字段默认值、`variableTypes/defaultType` 和每个动态状态的 shape；声明的 `raw` 也没有在解析时赋值。

转换器查询运行时参数时只创建“默认状态”的临时块，而且 `buildBlockCall` 优先采用静态 `BlockMeta.argsOrder`。因此它能正确渲染一个已经完整的 DHT ABI 块，却不能自动发现 `TYPE=DHT20` 时的 `WIRE` 与其他类型的 `PIN`。变体必须先通过 headless Blockly 实例化、切换 selector/mutation，再序列化为 ABI。

#### 当前“成功”信号是交互式兼容策略

| 路径 | 当前行为 | 正确治理方式 |
|---|---|---|
| `parseInlineValue` | 未识别表达式可降级成 `text` 并只产生 warning | 运行时保留；文档审计单独记录 warning/降级 |
| `validateAbs` | 只看 `convertAbsToAbi.success`，忽略 warnings | 继续服务交互式导入；不能单独充当 README 门禁 |
| named argument | 裸 `$var` 在括号命名参数中按 field 处理 | 不改变主 parser；README 候选优先使用已验证的位置参数或 `@INPUT:` |
| 动态额外参数 | parser 先记为 `EXTRA_N`，运行时建块阶段才映射真实字段/输入 | 文档运行时验证必须经过 `createBlockFromConfig`，不能只比较 parser 输出 |
| `syncAbsFileTool` | warnings、部分 failed blocks、sketch 刷新失败可随成功结果一并返回 | Agent 仍可恢复；文档验证报告分别展示各信号 |
| field boolean | parser 归一化后，Agent 建块路径会按真实 dropdown 做大小写不敏感恢复 | 不直接修改；直接 ABI 路径另做集成测试 |

所以文档候选的验证必须经过“parse → 真实运行时建块 → serialize → 结构比较”，并在报告中分别呈现 warnings、failed blocks、未消费的 `EXTRA_N` 和 codegen warning。canonical/golden 候选可要求这些信号为零，但该 strict profile 只用于文档和 CI，不改变 Agent 交互式导入的成功条件。转换器本身也需要契约测试，不能把“当前实现”未经验证地提升为绝对真源。

## 6. 目标质量标准

`readme_ai.md` 应被定义为“可机器验证的库使用契约”，而不是普通介绍文档。

### 6.1 每个块必须具备的事实

- 精确 `type`；
- Connection 类型；
- 合并 `args0..argsN` 后的静态参数顺序；
- 每个参数的 slot kind（`field` / `valueInput` / `statementInput`）和具体字段类型，禁止在渲染前降成无类型字符串；
- 运行时 extension/mutator 产生的参数或输入变体；
- 至少一个真实、可解析的 canonical ABS 调用；
- 变量创建/引用方式、变量类型、前置初始化和位置约束；`field_variable` 必须使用 `$var`，值输入中的变量读取必须使用 `variables_get($var)`；
- 必要的枚举和条件选项；
- 无法自动确认的内容显式标记 `Needs review`，禁止用默认值伪装确定事实。

### 6.2 每个库必须具备的使用知识

- 最小可用工作流：初始化 -> 配置（如有）-> 读/写/事件 -> 必要等待或清理；
- 每种动态签名至少一个示例；
- 对象/变量如何创建和复用；
- 板卡、引脚、总线和依赖限制；
- 常见错误及安全默认值；
- 示例只引用明确声明的依赖库，不自动塞入串口和延时。

### 6.3 示例标准

- fenced code 使用 `abs` 标记；
- 代码可直接送入当前 ABS parser，且 0 warning、0 failed block；
- 禁止 `child_block()`、`action()`、`...`、虚构块名；
- `math_number(0)` 只有在 0 本身是合理业务值时才允许；
- 至少出现一个本库块，复杂库至少覆盖一条完整主路径；
- 示例的所有块、字段、枚举和变量引用都能从输入事实中追溯。

## 7. 推荐生成架构

### 7.1 建立单一结构化中间模型

先生成 `library-doc-model`（内存对象或可调试 JSON），再由一个 renderer 输出 Markdown。建议模型至少包含：

```json
{
  "library": { "name": "...", "version": "...", "description": "..." },
  "blocks": [
    {
      "type": "dht_init",
      "connection": "Statement",
      "staticArgs": [
        {
          "name": "VAR",
          "kind": "field",
          "fieldType": "field_input",
          "sample": { "kind": "fieldLiteral", "value": "dht" }
        }
      ],
      "runtimeVariants": [
        { "when": "TYPE=DHT11|DHT21|DHT22", "args": ["VAR", "TYPE", "PIN"] },
        { "when": "TYPE=DHT20", "args": ["VAR", "TYPE", "WIRE"] }
      ],
      "abiFixtures": [],
      "canonicalAbs": [],
      "lifecycle": { "createsVariable": true, "placement": "arduino_setup" },
      "evidence": ["block.json", "runtime:block-state", "generator.js"],
      "validation": { "parserWarnings": 0, "failedBlocks": 0, "roundTrip": "equal" }
    }
  ],
  "recipes": [],
  "reviewFlags": []
}
```

事实提取优先级建议：

1. headless Blockly 运行时序列化结果：实际 block shape、字段类型与输入映射；
2. 通过两条主路径契约测试的 ABI↔ABS converter：fixture/canonical 语法渲染；
3. `block.json`：静态块和 `args0..argsN`；
4. extension/mutator 注册与各 selector/mutation 状态：动态签名；
5. `generator.js`：字段读取、变量生命周期、生成语义；
6. `toolbox.json`：推荐默认值和 shadow；
7. package、上游 examples/README：硬件约束和领域使用知识；
8. 旧 `readme_ai.md`：只作为待核验的知识候选。

### 7.2 先生成 ABI fixture，禁止直接拼 canonical ABS

每个块/变体的确定性流程应是：

```text
block.json + extension/mutator + toolbox
  -> 在 headless Blockly 中实例化具体状态
  -> 接入类型正确的字段、shadow、value/statement child
  -> Blockly serialization 生成 expected ABI fixture
  -> 通过契约测试的 ABI converter 生成 canonical 候选 ABS
  -> 以文档 strict profile 导入到全新 workspace
  -> 再次 serialization
  -> normalize(expected ABI) == normalize(actual ABI)
```

其中 `field_variable` 的 fixture 必须放在 `fields` 中并携带 `{id,name,type}`；值输入中的变量必须是 `inputs.*.block.type="variables_get"`。渲染器只能根据这个结构输出字符串，不能通过参数名或示例文本猜测二者。

### 7.3 确定性生成事实，LLM 只补语义

推荐拆成两层：

- 确定性层：块清单、slot kind、参数顺序、枚举、静态/运行时 ABI fixture、canonical ABS、文件名、版本、覆盖率；
- LLM 层：从 extension/generator/upstream examples 归纳动态变体、生命周期、使用配方和注意事项。

LLM 可以提议 fixture 和 recipe，但 canonical ABS 字段必须由通过契约测试的渲染器回填为只读产物。LLM 输出必须回填结构化模型并通过验证，不能直接自由写 Markdown 后覆盖仓库。

### 7.4 抽取共享 `abs-contract` 核心

不建议让 libraries 仓库复制 Angular 应用源码。应从 `aily-blockly` 抽出无 UI 依赖的共享包或版本化 CLI，例如 `@aily-project/abs-contract`：

- `normalizeBlockDefinitions`：保留 args、字段类型、options、extension/mutator 描述；
- `buildRuntimeVariantFixtures`：在加载真实库后的 headless Blockly 中构造/枚举状态；
- `abiToCanonicalAbs` / `absToAbi`：复用当前转换器与 parser；
- `materializeAbsInWorkspace`：复用动态字段/输入映射逻辑；
- `normalizeAbiForCompare`：忽略 ID、坐标等易变数据，保留语义结构；
- `validateReadmeAbsContract`：独立的文档 strict profile，统一返回 errors、warnings、failedBlocks、unmappedExtras、roundTripDiff、codegenErrors，不改变运行时 `validateAbs`；
- `renderReadme`：只消费已验证的 doc model。

`aily-blockly`、`aily-blockly-libraries` 和 CI 锁定同一包版本；包版本/commit 写入 validation report，避免两仓语法版本悄然漂移。

### 7.5 自动修复改成候选生成

- 移除 validator 中“运行 `readme:fix` 自动修复”的默认建议；
- `--fix` 禁用；新增 `readme:candidate <lib>`，只输出到 `.temp/readme-candidates/`；
- 已有文档只生成 diff，不直接覆盖；
- 删除示例、动态变体或 Notes 时要求人工确认；
- 最终合并必须携带 validation report。

### 7.6 合并两套脚本

废弃 `.scripts/gen-readme-ai.js` 和 `.scripts/check-readme-compliance.js` 内的重复生成逻辑，保留一个模块化实现：

```text
extract -> instantiate variants -> serialize ABI fixtures -> canonicalize ABS
        -> enrich semantics -> render -> strict validate -> diff
```

CLI 可提供：

- `readme:generate <lib>`：生成候选；
- `readme:validate <lib|--all>`：只读验证；
- `readme:audit --all --json`：输出全库质量报告；
- `readme:accept <lib>`：人工确认后写入。

## 8. 建议的 `readme_ai.md` 结构

````markdown
# Library title

One-sentence purpose.

## Library Info
...

## Prerequisites and Lifecycle
- required libraries / board / bus
- initialization placement
- created variables and reuse

## Block Reference
| Block | Connection | Parameters | Canonical ABS | Purpose |

## Dynamic Signatures
| Block | Condition | Parameters | Canonical ABS |

## Parameter Options
...

## Usage Recipes
### Minimal working example
```abs
...
```

### Required alternate workflow
```abs
...
```

## Constraints and Common Errors
...
````

建议把低成功率的 `Generated Code` 改成 `Purpose / Side Effects`。确实需要精确 C++ 时，让 Agent 按消费侧 prompt 读取 `generator.js`。若暂时不能改规范，则该列必须允许 `N/A — inspect generator.js`，并且不能把它计作已完成语义覆盖。

对于超大库，不应通过删除全部示例来压缩：

- 短期：保留主工作流和动态变体，减少重复表述与生成代码片段；
- 中期：`readme_ai.md` 作为索引，按功能拆分 `readme_ai/*.md`；
- 同步修改 `analyzeLibrary`，按任务返回相关分片，而不是一次加载整库。

## 9. README 生成/修复提示词建议

以下提示词应服务于“结构化模型补全”，而不是直接写文件：

```text
你正在为 Aily Blockly Agent 生成一个可机器验证的库使用契约。

输入包括：
- 已通过契约测试的 ABS converter/parser 版本
- headless Blockly 对每个已知运行时状态的序列化结果
- package.json
- block.json（必须合并 args0..argsN）
- generator.js（含 extension/mutator）
- toolbox.json
- 上游最小示例（若提供）
- 旧 readme_ai.md（仅作待核验候选，不能作为事实源）

事实优先级：verified converter > runtime serialization > block.json >
extension/mutator > generator.js > toolbox.json > upstream examples > 旧 README。

任务：
1. 列出每个真实 block type，保持参数原始顺序。
2. 区分 field、input_value、input_statement、Hat 和动态输入，并为每个参数输出 slot kind。
3. 对每个 extension/mutator 分支列出实际签名；不能只写“动态字段”。
4. 为每个块/变体给出期望 ABI fixture；不要自行拼接 canonical ABS，canonical ABS 由工具生成并回填。
5. 归纳初始化、变量创建、依赖、板卡/总线和调用顺序。
6. 生成最少数量但覆盖主工作流和所有动态签名的完整 ABS recipes。
7. 不得虚构块、字段、枚举、依赖或硬件约束；无法确认时输出 review flag。

变量规则：
- field_variable fixture 必须位于 fields，值为变量对象；canonical ABS 应为 $var。
- input_value 中的变量 fixture 应是 `variables_get` block；文档必须使用显式 `variables_get($var)`，并在验证后落入 `inputs` 而不是 outer `fields`。
- 不得因为两者都显示“变量”而互换结构。

禁止：child_block()、action()、...、无业务意义的默认 0、把命名输入写在
block(...) 同一行、未声明的跨库块、手写或覆盖工具返回的 canonical ABS。

输出 JSON，必须符合 library-doc-model schema；不要直接输出 Markdown。
```

再使用独立 reviewer prompt 审核：

```text
比较 library-doc-model 与全部输入事实。
只返回问题列表：severity、block type、字段/签名、证据文件、修复建议。
必须检查块覆盖、slot kind、field_variable/valueInput 变量语义、枚举、动态签名、
生命周期、示例依赖、严格 ABS round-trip 和运行时代码生成结果。
作者模型没有证据的推断一律标为 error，不要帮助其圆合理化。
```

## 10. 自动验证设计

### 10.1 P0：静态拒绝规则

立即加入：

- 示例中禁止 `child_block()`、`action()`、`...`；
- 示例必须出现至少一个当前库 block type；
- 禁止同行 `block(...) @INPUT:`；
- 文档中的块名必须与 `block.json` 集合精确相等，而不是只做 substring；
- 参数枚举必须与静态和运行时选项一致；
- `field_variable` 对应实参必须是裸 `$var`，禁止 `variables_get(...)` 或其他块调用；
- 变量值输入只允许显式 `variables_get($var)`，且解析/建块后必须落入 input 子树，不能落入 outer field 或 text；
- canonical ABS 不允许无解释的 `math_number(0)`；
- 文件统一小写 `readme.md` / `readme_ai.md`，同步修正规范和 migration skill 中的大小写。

### 10.2 P1：文档 strict profile 的 runtime round-trip

提取表格中的 canonical ABS 和所有 `abs` fenced blocks，执行：

```text
expected ABI fixture
  -> converter 输出 canonical ABS
  -> parseAbs（沿用运行时宽松 parser，并完整采集 diagnostics）
  -> fresh headless Blockly workspace 中 createBlockFromConfig
  -> Blockly serialization 得到 actual ABI
  -> normalize + structural diff
  -> 再导出 ABS，验证 canonical idempotence
```

验收条件：

- 0 parse error；
- golden/canonical 候选要求 0 parser warning；迁移审计先报告、不改变交互式导入结果；
- 0 failed/degraded block，0 未消费 `EXTRA_N/INPUTN`；
- round-trip 后 block type、field 名称/类型/值、input 名称/子树、next、extraState、变量名称/类型结构等价；
- 命名输入映射到真实 input；
- 动态块输入数量与 variant 一致。

比较时只忽略 block/variable ID、坐标、展示顺序等非语义字段；不能忽略 field 和 input 的容器差异。尤其要用 expected fixture 对比 actual ABI，不能把错误 ABS 自己 parse/export 后再与自己比较，否则 `fields.VAR="variables_get($dht)"` 仍可能自洽通过。

表格中的 canonical ABS 也必须逐条构造成最小上下文后验证，不能只检查 Markdown 字符串。

### 10.3 P0：ABS 契约测试矩阵

共享 `abs-contract` 至少需要以下正反例：

| 类别 | 正例 | 必须拒绝或发现的反例 |
|---|---|---|
| 变量字段 | `dht_read_temperature($dht)` → `fields.VAR` 变量对象 | `dht_read_temperature(variables_get($dht))` → 字符串字段 |
| 变量值输入 | `serial_println(Serial, variables_get($dht))` | 裸 `$dht`、变量被写进 outer field 或降级成 text |
| 字段/输入交错 | 严格按 `args0..argsN` 的 `argsOrder` | “先全部 field、再全部 input” |
| statement body | 单 body 缩进；多 body 使用真实 `@INPUT:` | 同行 `block(...) @INPUT:`、`child_block()` |
| 特殊控制块 | `controls_if/ifelse/switch` 的真实 input 名 | `@do` 映射不到 `DO0`、错误 case 数 |
| 动态字段 | DHT11/21/22=`PIN`，DHT20=`WIRE` | 只验证默认状态、残留 `EXTRA_0` |
| mutator/extraState | lists/text/procedure 多输入可逆 | 数量丢失或 extraState 被删 |
| 可选参数 | 前序输入缺省、后序输入存在时仍映射正确 | 位置左移到错误 slot |
| 枚举与布尔字段 | 保留 block 定义的真实大小写和值 | `true` 被无条件改成 `TRUE` |
| 变量边界 | 类型、特殊字符名、同名变量可逆 | 类型丢失、转义破坏参数分隔 |

这些测试既要覆盖 converter/parser 单元级，也要覆盖“加载真实库 → 建块 → 序列化”的集成级。README 校验只调用这套严格 API，不再各自模拟规则。

### 10.4 P1：语义覆盖

为每个库生成覆盖报告：

- reference block coverage = 100%；
- enum coverage = 100%；
- runtime variant coverage = 100%；
- recipes 至少覆盖一条主工作流；
- init/create 后的变量在后续块中真实复用；
- 回调/Hat、statement body 和终止块放置合法；
- 示例中的外部 block type 都能映射到明确依赖。

### 10.5 P1：生成代码与构建 smoke test

对黄金库和变更库：

1. 把 README 示例导入 workspace；
2. 生成 C++；
3. 执行 linter；
4. 对支持的代表性 board 至少编译一个最小 recipe。

硬件库不要求 CI 实际连接设备，但编译和生成结构必须通过。

### 10.6 P1：回归差异门禁

CI 对 README 变更输出机器可读差异：

- 删除的 recipes、Notes、动态变体；
- 新增/删除 block type；
- 参数签名变化；
- 覆盖率和 parser/build 结果变化；
- token/字节变化。

当“文件更短但覆盖率下降”时必须阻断，而不是把体积下降当优化。

第一层门禁已实现为 Git 差异审计：`--changed` 使用与三点 diff 一致的 merge-base，同时读取基线与当前版本的 `block.json`、`readme_ai.md`，比较槽位级 ABS 契约指纹。历史存量只报告；修复历史问题允许通过；新增或恶化的契约问题独立设置失败退出码，不再依赖旧综合评分是否低于 60%。示例 fenced block 的编号会从指纹中归一化，单纯重排示例不会产生假回归。若基线没有 `readme_ai.md`，当前新文档必须从零通过契约检查，不能继承“缺文档”的历史豁免。

该实现目前覆盖静态槽位、块覆盖、占位符和示例形态差异；recipes/Notes 删除、runtime build、codegen 和 token 变化仍属于后续差异层，不能把第一层通过解释为 runtime verified。

## 11. 黄金样本建议

先选 8～12 个库建立手工确认的 golden docs 和 round-trip fixtures：

| 类别 | 建议库 | 重点 |
|---|---|---|
| 命名输入/动态分支 | `core-logic` | `@IFn/@DOn/@CASEn`、mutator |
| 根块/循环体 | `core-loop` | Hat、缩进 body、break/continue |
| 变量语义 | `core-variables` | field_variable 与 input_value |
| 动态数量 | `core-lists`、`core-text` | mutator、extraState |
| 运行时条件字段 | `adafruit_DHT` | `PIN/WIRE` 分支 |
| 对象生命周期 | `ArduinoJson` | init/add/read/serialize |
| 网络/状态 | `esp32_wifi` | 初始化、连接、状态、重连 |
| 大型库压缩 | `home-assistant` 或 `seeed_GFX` | 分片、检索与 token 预算 |
| 回调/Hat | 选择一个事件型库 | callback body 和注册顺序 |

`49c0ac17` 的 `core-logic` 可作为“解释深度”参考，但 golden 必须按当前 parser、block 和 enum 重新校正。

## 12. 分阶段落地计划

### P0：止血（1 个 PR）

1. 禁止 CI/开发指引自动执行覆盖式 `readme:fix`；
2. 禁用 `--fix`，另设 `readme:candidate <lib>` 输出到忽略目录，保证源 README 不变；
3. 加入占位符、同行命名输入、“示例必须含本库块”和 `field_variable` 禁止 `variables_get(...)` 检查；
4. 输出本次识别的 277 个变量字段错误库清单；在建立 reviewed baseline 前默认只报告，`--strict-abs` 才阻断，避免历史债务卡住无关库改动；
5. 修正 validator 的错误建议；
6. 将 `db67f4fa` 改写的 368 份 AI README 标记为待复核集合；
7. 不批量回滚。

### P0 当前实施状态（2026-08-10）

已完成：

- 两套 README 生成器的 `field_variable` 示例统一改为裸 `$var`；
- 删除生成器 ABS 单元中的 `...`、`child_block()` 和同行 statement 占位表达；
- `readme:fix` 已设置为拒绝写入，旧 `.scripts/gen-readme-ai.js` 已删除；
- 新增 `readme:candidate <lib>`，只写入 `.temp/readme-candidates/<lib>/readme_ai.md`，写入前执行槽位感知的 ABS 静态契约校验；
- 新增 `--strict-abs`、`readme:audit`、`readme:contract`；默认合规路径把历史 ABS 债务作为 info 报告，严格路径作为迁移门禁；
- CI validator 不再建议运行覆盖式 `readme:fix`；
- `adafruit_DHT/readme_ai.md` 的三个读取块及完整示例已修正为 `$dht`；
- 新增 Node 契约测试，覆盖 field/value 变量规范、compact 不产生 ABS 占位符、数字前缀 block type 和 fenced example 整行形态；后续门禁进一步禁止值输入中的裸 `$var`。

当前审计结果：

| 口径 | 结果 |
|---|---:|
| 默认结构合规错误 | 404，涉及 104 个库（与接入语义审计前一致） |
| strict ABS 契约发现 | 4237，涉及 426 个库 |
| `field_variable` wrapper 命中（表格与示例合计） | 2867 |
| 非 `$var` 的其他变量字段示例 | 225 |
| 同行 statement / trailing syntax | 284 |
| 缺失静态参数示例 | 271 |
| 不可执行占位符 | 139（省略号 131、`child_block()` 8） |
| 非 value slot 中出现块调用 | 39 |
| 缺失精确 Block Definitions 表格行 | 319 |
| 缺失 fenced executable example | 85 |
| fenced example 未调用本库块 | 4 |

这些数字是迁移清单，不代表要收紧 Blockly 运行时，也不应在没有 baseline 的情况下直接转成全量 CI 阻断。

### P1 第一批当前实施状态（2026-08-10）

已完成：

- 在 `check-readme-compliance.js` 增加 ABS 契约差异比较，使用稳定问题指纹和计数差异；示例序号不参与语义身份；
- 在 `validate-library-compliance.js --changed` 中解析 Git merge-base，并直接从基线 SHA 与 head SHA 读取两端 `block.json`、`readme_ai.md` 做逐库比较，避免 PR checkout 的 merge commit 把基分支改动误算到 PR；仅直接调用审计 helper 且没有 head SHA 时才读取工作区；
- 新增 ABS 回归独立失败信号，避免“库评分仍高于 60%”时新增坏示例却被放行；
- 新库或首次增加 `readme_ai.md` 时不继承历史问题，当前文档必须没有契约发现；
- CI workflow 已把 README 工具、校验器、workflow 本身及根 `package.json` 纳入触发范围，并在变更校验前执行 `npm run readme:test`；
- 新增 `core-logic/controls_if`、`core-loop/controls_for`、`adafruit_DHT/dht_read_temperature` 三类静态黄金契约片段，分别覆盖值输入加缩进 statement body、`field_variable` 位置参数和嵌套 value 调用；
- 使用真实仓库 `HEAD` 对当前 DHT 修复做基线比较，结果为新增 0 项、修复 4 项，门禁允许通过；反向注入 wrapper 的测试能稳定产生 2 项新增回归并记录独立失败信号；
- fenced example 改为在去除字符串和注释后检查整行，能发现右括号后的同行 statement 和独立伪块，又不会把 `text("Waiting...")` 之类合法字符串误判为占位符；
- `npm run readme:test` 当前 51/51 通过。

第二批实现进展（2026-08-10）：

- 新增 `npm run readme:runtime-contract`。该脚本从相邻 `aily-blockly` 工作区只读加载当前源码和已安装依赖，使用真实 `runSyncAbsFileConcreteHandler`，完整经过桌面 mutator 插件初始化、项目数据预检、变量同步、`BlocklyAbsParser`、`createBlockFromConfig`、`WorkspaceSvg`、`project.abi` 落盘、ABI→ABS 导出和 `sketch.ino` 代码生成；测试文件只写入并清理系统临时目录。
- 运行时案例已迁入 `.scripts/contracts/readme-runtime-contracts.v1.json`，断言模型通用支持块数量、ABI 对象路径、变量身份/类型、codegen 片段和精确已知失败。fixture 同时声明真实桌面初始化模块与全部相关源码路径，避免测试脚本内硬编码案例或漏载插件。
- 当前活动工作源码指纹 `226769ee138608c943b6731b7dc05f7b664fce978bc04b238649a5a1aba111e9f`、依赖指纹 `e4e0c3de4662bf94f64bd2b30d9a8a4400815110721346422a05ff78fb16534b` 下 11/11 通过：除原 7 类外，新增 `text_join` itemCount、`controls_if` elseif/else、`controls_ifelse` 和 `controls_switch` case/default 的 extraState、命名输入与代码生成验证。实际依赖为 `aily-project-blockly@1.0.2`。
- 当前 `aily-blockly` 有 6 个契约相关脏文件（`package.json` 及 5 个 ABS/同步/codegen 源文件），所以 11/11 仅证明该精确工作源码；普通模式会显式报告，`--require-clean-runtime` 会拒绝运行，不能把结果写成“HEAD/main 已验证”。
- 完整链首次真实复现了一个非转换器问题：`dht_init("dht20", DHT20, Wire)` 保留了初始化名，但后续 `$dht20` 在 ABI 中绑定成默认变量 `dht`，代码生成因此错误调用 `dht.readTemperature()`。根因是 `adafruit_DHT/generator.js` 只在代码生成阶段安装变量注册/重命名逻辑，而同步导入在建块阶段就需要变量 ID。
- 修复落在 DHT 库自己的 `dht_init_dynamic` 扩展：扩展建块时立即注册变量，字段变更时只重命名由该块创建的变量，不重命名先于该块存在的同名变量。没有修改 `aily-blockly` 的 converter、parser、同步导入器或宽松策略；新增的双实例契约用于防止变量误合并副作用。
- 新增可选的 v1 README 动态签名契约，精确声明静态 `block.json` 无法表达的运行时分支签名。契约集中存放于 `.scripts/contracts/readme-library-contracts/<库名>.json`，不进入用户下载的库目录。DHT 当前声明 DHT11/21/22 追加必填 `PIN`、DHT20 追加必填 `WIRE`；静态 checker 会校验 schema、条件槽位、必填动态参数及每个 variant 的完整示例，不采用“存在 extension 就允许任意多余参数”的宽泛豁免。
- 候选生成器已消费同一集中契约：表格和 Basic Usage 使用第一分支，并为其余运行时 variant 生成独立 fenced example；Git 基线/head 差异门禁会分别读取对应 revision 的集中契约。
- `adafruit_DHT/readme_ai.md` 已升级为首个动态 golden：明确第三位置参数、DHT11/PIN 和 DHT20/WIRE 完整 recipe、裸 `$dht` 字段语义与自定义名一致性。

第三批实现进展（2026-08-10）：

- 运行时黄金夹具扩展至 16 个案例，当前精确工作源码下 16/16 通过。新增覆盖 Blynk 回调/Hat 与 timer hook、`core-functions` 动态参数/返回值/void statement body、U8G2 外部 Project Data 位图，以及 DHT 读取根块先于初始化根块遍历的确定性回归。
- runner 会按桌面端实际路径加载 Project Data block decorator、自定义 U8G2 field、`BitmapUploadService` 和持久 `WorkspaceSvg`；fixture 新增 `projectDataSeeds` 与 `projectDataBindings`，同时验证资源文件、ABI 引用、直接建块保存和最终代码生成。runner 不再把临时目录内生成的资源或模拟 Canvas 缺失误报为转换器缺陷。
- runner 新增 `librarySourceState`：对本轮加载库的 `package.json`、`block.json`、`generator.js` 逐文件哈希，避免只记录 Blockly 侧源码而无法确认实际验证了哪一版库实现。
- `core-functions/readme_ai.md` 已重写：函数定义作为根 Hat，函数体使用缩进，动态参数按类型/名称对声明，非 void 返回值作为末尾 value input；运行时生成的调用块采用 `FUNC_NAME=$functionName` 与 `INPUT0=...`、`INPUT1=...` 稳定命名槽，避免函数变量与 variadic value input 产生位置歧义。集中契约 `readme-library-contracts/core-functions.json` 同时覆盖函数定义变体和两个 JavaScript 运行时块，strict ABS 检查为 0 错误。
- 候选生成器不再只为 init block 展开 runtime variant：所有带 contract 的块都会生成额外分支示例，Hat 块在 setup/loop 外作为根块输出，避免再次把函数定义嵌入 `arduino_loop()`。`readme:candidate core-functions adafruit_DHT` 均可生成并通过静态契约；JS 运行时创建且公开的块已进入 `runtimeBlocks`，候选、单库校验、跨库校验、generator 覆盖和动态 shape 审计不再漏掉它们。候选文件仍不能因此自动晋级为 runtime verified。
- `adafruit_DHT/generator.js` 发现并修复一项真实的库侧问题：代码生成可能先遍历读取根块，旧实现却依赖 `dht_init` generator 先填充 `Arduino.dhtTypeMap`，因此 DHT20 偶发生成 DHT11 的 `readTemperature()`。读取 generator 现在优先从 workspace 中匹配同名 `dht_init` 的实际类型，再回退缓存；专用逆序用例验证生成 `getTemperature()`。
- 这轮没有修改 `aily-blockly`。先前 `controls_if` 与 U8G2 的失败分别由 runner 漏载桌面 mutator 初始化器、缺少 Canvas/位图服务造成，均属于测试装配假阳性；目前没有新的输入输出证据表明主线 ABS/ABI 宽松转换策略存在必须修复的问题。
- 当前运行时源码指纹为 `bb7087962fc983780df87d63db9b84f42367b6608bdb728b600b8eb8a1d21caa`，依赖指纹为 `7e213ccea507d7bfbbbecb45730c98c048e51bbbd2b8a90dcc6a335e9ffe4190`，库源码指纹为 `17319124021d726cdf9d7f474352b11622dc42ff4a010f0bce2f36a970cd0db3`。`aily-blockly` 仍有 6 个契约相关脏文件，因此该结果仍是精确工作源码证据，不是 HEAD/main 发布证据。
- 代表板编译尚未完成：环境只能解析到 WindowsApps 的 `arduino-cli.exe` 别名，但 `arduino-cli version` 在 30 秒内无响应；`pio`、`platformio`、`arduino-builder` 均不存在。本阶段未安装工具链，也未把仅通过 codegen 写成编译通过。

尚未完成：runtime runner 仍依赖相邻 `aily-blockly` 工作区和其 `node_modules`，所以暂未直接加入 libraries 的独立 GitHub Actions；在抽取、固定版本并发布只读 `abs-contract` 运行时前，不能把本地 16/16 外推为全库 verified。下一批需要在干净目标提交上生成可发布证据，并在可用的 Arduino CLI/board core 环境中补齐代表板编译；大型值和更多动态库仍需按风险分批扩展，而不是直接全库覆盖生成。

### P1：建立可信链路

1. 确定单一 `library-doc-model`；
2. 从 `aily-blockly` 抽取并版本化只读共享 `abs-contract` 能力，先补齐变量槽位、warning、动态字段和枚举大小写契约测试；文档 strict profile 与运行时宽松 profile 分离；
3. 合并两套 libraries 生成器，并把 `editBlockTool` 中独立的 README ABS 拼装分支替换为共享 `abs-contract` 调用；
4. 接入 headless Blockly 运行时，生成每个 block variant 的 expected ABI fixture；
5. 将已加入的三类静态黄金片段升级为经人工确认的完整 README 和 runtime fixtures；
6. 增加严格 runtime round-trip、覆盖率和 diff report；
7. 更新 README 规范、ABS 规范与 migration skill，消除文件名和语法矛盾。

### P2：分批恢复文档

建议批次：

1. `core-*` 和 42 个 extension/mutator 库；
2. 277 个存在 `field_variable` wrapper 错误的库；机械修正 canonical 调用后仍须分别验证 recipe；
3. `db67f4fa` 覆盖的其余 368 份文档；
4. 当前 54 个 AI 合规错误库（其中 8 个库缺 96 个块条目）；
5. 后续新增库和大型库。

每批都必须通过严格 runtime round-trip；动态库和硬件工作流需要人工 owner 审核。

### P3：消费侧加强

在 `aily-blockly`：

- prompt 增加不可信 README 触发条件；
- `analyzeLibrary` 对动态库返回 runtime signatures 和 validation status；
- 环境中展示 README 质量状态，如 `verified / legacy / generated-unverified / invalid`；
- Agent 使用未验证 README 时必须继续查最小必要证据；
- 大型库支持按功能分片读取。

## 13. 验收标准

完成治理后应满足：

- [ ] 560 个库均有规范小写 `readme_ai.md`；
- [ ] 文档块覆盖率、枚举覆盖率 100%；
- [ ] 动态 variant 覆盖率 100%；
- [ ] 所有进入 verified 状态的 canonical ABS 和 fenced examples 在文档 strict profile 下均为 0 parser warning、0 failed block、0 未映射动态参数；运行时宽松导入条件保持不变；
- [ ] 3499 个 `field_variable` 参数位均映射到 ABI `fields` 变量对象，0 个错误 `variables_get(...)` wrapper；
- [ ] golden 库 runtime round-trip 结构等价，代表板编译通过；
- [ ] 0 个 `child_block()` / `action()` / `...` 占位符；
- [ ] 0 个“示例未使用本库块”；
- [ ] `Generated Code/语义` 不再出现无说明占位；
- [ ] CI 不再自动覆盖人工文档；
- [ ] README 删除场景知识时有显式差异和审核；
- [ ] Agent 能用 `core-logic`、`core-loop`、`adafruit_DHT` golden README 一次生成并导入正确 ABS；DHT 读取块稳定使用 `$dht`，初始化的 `PIN/WIRE` 变体均可逆。

## 14. 建议决策

建议立即批准 P0 止血，同时用 `core-logic`、`core-loop`、`adafruit_DHT` 三个库实现最小 P1 原型。三者分别覆盖命名动态输入、Hat/statement body、变量字段与运行时条件字段；DHT 原型必须同时证明 `dht_read_temperature($dht)` 的字段结构和 `PIN/WIRE` 两种初始化 shape 均能严格 round-trip。

在原型验收前，不应再次运行全库覆盖式 README 生成，也不应把当前“结构合规”结果作为 Agent 使用正确性的证明。

## 15. 全库实施结果与持续门禁（2026-08-10）

本节是治理执行后的最新状态，取代前文 P0/P1/P2 的待办快照。治理对象以 `git ls-files '*/block.json'` 为准，共 559 个受 Git 管理的库；工作区另有未跟踪目录 `seeed_wio_lvgl/`，不在批量写入和“已治理”统计内。

### 15.1 已完成迁移

| 项目 | 结果 |
|---|---:|
| `field_variable` 错写为 `variables_get(...)` | 277 个文件、3038 处包装已修复 |
| 其他非法变量字段占位 | 47 个文件、229 处已修复 |
| 表格同行 statement 后缀 | 95 个文件、274 处已移除 |
| Block Definitions 参数列 | 543 个文件完成 `args0..argsN` 全顺序校正 |
| 参数列单元格 | 933 处校正，539 个表头统一 |
| 缺失 ABS 示例 | 77 个库补入至少一个本库有效调用 |
| 大写 `README_AI.md` | 21 个文件统一为 `readme_ai.md` |
| 文档结构 | 41 个文件完成标准章节或表头归一化 |

迁移没有用新模板覆盖原有领域说明；脚本只修改能由 `block.json`、版本化运行时契约或当前主线解析行为确定的区域。复杂库的初始化顺序、回调、依赖关系和多阶段工作流继续保留。

### 15.2 新增的四层校验

1. **静态本库契约**：`readme:contract` 合并 `args0..argsN`，验证完整参数顺序、字段类型、枚举域、结构化字段、表格与示例。
2. **跨库示例契约**：`readme:cross-check` 建立全库块目录，校验示例中引用的核心块和其他库块；同时理解主线支持的 `@IF0:` 等命名值输入，不把合法宽松语法误报为缺参。
3. **真实运行时契约**：`readme:runtime-contract` 复刻桌面端初始化和动态 shape，执行 ABS → workspace → ABI → ABS/codegen 黄金夹具。
4. **真实编译**：`readme:runtime-compile` 调用 `D:\codes\aily-builder`（`@aily-project/aily-builder@1.3.0`）。独立的 UNO 最小夹具可产出 ELF/HEX；依赖第三方头文件的案例按外部依赖单独报告。

### 15.3 宽松策略边界

运行时仍可保留面向旧内容的恢复行为，但 Agent README 只暴露唯一规范写法：`field_variable` 使用 `$var`，变量 `input_value` 使用 `variables_get($var)`。布尔枚举兼容、合法函数形枚举值（如 `read()`）、命名值输入等规则继续按各自契约验证；本轮没有修改 `aily-blockly` 导入器。

跨库扫描还发现并修复了静态单库检查无法发现的真实问题：`serial_print` 缺少串口参数、TFT_eSPI 示例沿用旧参数顺序、Seeed GFX 初始化缺频率、`variable_define_advanced` 空枚举导致位置左移，以及 `variables_set` 的变量字段遗漏 `$`。`controls_if()` + `@IF0:` 经当前主线实现复核是合法格式，因此没有机械改写。

### 15.4 当前验收口径

- 559 个受管理库的 `readme_ai.md`：严格本库 ABS 契约错误为 0；
- 跨库示例：3747 个外部调用，错误为 0；
- 单元测试：30/30；
- 运行时黄金夹具：16/16；
- aily-builder 最小编译夹具：1/1；
- `seeed_wio_lvgl/` 因未受 Git 管理而明确排除，不能并入上述结论；
- 面向人的 `readme.md` 历史问题属于后续独立批次，不能用 `readme_ai.md` 的零错误结论代替。

## 16. 全动态块收口结果（2026-08-11）

本轮不再以 DHT 或少量 golden 库代替全库结论，而是从 559 个受 Git 管理库的 `block.json`、extension/mutator 注册和 generator 运行时槽位读取出发，建立全量动态形态清单。

### 16.1 覆盖与分类

| 项目 | 结果 |
|---|---:|
| 受管理库 | 559 |
| 检出的动态块 | 118 |
| 已声明动态契约 | 118 |
| 缺失契约 | 0 |
| 未覆盖的 generator 字面量槽位读取 | 0 |
| 未覆盖的 generator 计算型槽位读取 | 0 |
| 含集中 README 动态签名契约的库 | 50 |

动态块不再按“存在 extension 就可能增加参数”粗分，而使用四类可审计事实：

1. `variants`：由模式、协议、板卡或类型决定的有限签名；
2. `variadic`：`ADD0...`、`INPUT1...` 等命名索引输入；
3. `staticShape`：扩展只处理 tooltip、校验、下拉刷新、默认值或板卡元数据，不改变 ABS；
4. `excludedRuntimeArgs`：运行时仍保留旧工程兼容连接，但 Agent 新 ABS 不应输出的隐藏参数。

生成器已经按上述分类输出 `Runtime shape`、`UI-only extensions` 或 `Compatibility-only inputs`，不再生成“may add fields at runtime”式泛化结论；现有 README 中的同类误导说明也已逐库改成具体规则。

### 16.2 主线转换行为复核

只读复核的实际入口包括 `absParser.ts`、`abiAbsConverter.ts`、`editBlockTool.ts`、`syncAbsFileTool.ts` 及桌面端 `block-plus-minus` 动态块实现。当前链路同时支持位置参数和命名参数；ABI→ABS 会将动态值输入追加为位置参数，ABS→workspace 会先接收多余位置参数为 `EXTRA_N`，再在 shape 更新后重映射。该宽松路径是现行能力，能够提升 Agent 导入效率，本轮没有收紧或修改。

对于索引型或分支型动态输入，README 优先使用稳定真实名称，如 `ADD2=...`、`INPUT1=...`、`@IF0:`、`@DO1:`、`@ELSE:`。严格规则只作用于候选 README、契约覆盖和 CI，不改变交互式导入器的恢复策略。本轮没有修改 `aily-blockly`。

运行时验证对象为 `aily-blockly` 当前工作区的精确源码，而不是根据路径猜测的旧实现。该工作区分支为 `i3w-sim-preview`、HEAD 为 `b579b76810b21197820a3370f9120aca38337013`，但有 6 个契约相关脏文件；因此结果只能表述为源码指纹 `bb7087962fc983780df87d63db9b84f42367b6608bdb728b600b8eb8a1d21caa` 通过，不能外推为干净 HEAD 或 main 已通过。

### 16.3 新发现并消除的隐藏问题

- 动态 statement 输入此前无法在候选 README 中表示；现在用真实 `@NAME:` 子块输出并做覆盖校验。
- 候选生成器过去从第二个 runtime variant 才输出独立示例，若第一个 variant 含动态 statement 且未被 Basic Usage 选中，会生成不完整候选；现在首分支只要含动态 statement 也会输出并校验，`ai-vox-xzai` 候选已实际通过。
- `ai-vox-xzai` 示例曾使用不存在的 `FONT_EMOJI_HAPPY`；真实 generator 映射值为 `FONT_AWESOME_EMOJI_HAPPY`，契约和 README 已统一。
- `unihiker_k10_speech/k10_asr_speak` 的隐藏 `INTERVAL` socket 仅用于旧工程加载；当前 Agent ABI 使用可见数字字段，已通过 `excludedRuntimeArgs` 防止兼容输入污染新示例。
- `aily_iic` 只有 slave 模式增加 `ADDRESS`；串口、SPI、变量、循环、传感器 I2C 提示等多类 extension 实际只刷新 UI，现已从“动态参数”中剔除。
- `core-math` 真正改变签名的是 `math_number_property(DIVISIBLE_BY, DIVISOR)`，不是带 tooltip extension 的普通数学块。

### 16.4 当前门禁结果

- `readme:dynamic-shapes`：118/118，严格模式 0 缺失、0 未覆盖读取；
- `readme:contract`：559 个库，0 错误；
- `readme:cross-check`：3860 个外部调用，0 错误；
- `readme:candidate-check`：559/559 候选生成成功，候选中的 3896 个跨库调用为 0 错误，且不会覆盖源 README；
- `readme:test`：39/39；
- `readme:runtime-contract`：21/21，0 known failure，0 failed；
- `readme:runtime-compile`：使用 `D:\codes\aily-builder`（`@aily-project/aily-builder@1.3.0`）完成 UNO 最小夹具 1/1；该命令同时复跑的运行时黄金夹具为 21/21；
- GitHub Actions 已增加严格 `readme:dynamic-shapes`、`readme:generator-coverage` 与全库 `readme:candidate-check`，防止新 extension、mutator、generator 注册/槽位或候选生成回归在没有契约时合入。真实 runtime/aily-builder 仍依赖相邻本地工作区，不在仅 checkout libraries 仓库的独立 CI 中伪装执行。

发布或合并前仍应在目标提交的干净 `aily-blockly` 工作区再次执行运行时与编译门禁；当前工作区证据不是对未提交 Blockly 改动的合并背书。

## 17. 全生成器注册与槽位遗漏审计（2026-08-11）

动态 shape 收口后又增加了执行型生成器审计。`readme:generator-coverage` 在隔离 VM 中加载全部 559 个受管理库的 `generator.js`，记录真实 `Arduino.forBlock` 赋值，并与 `block.json`、递归 toolbox 类型和集中 README 动态签名契约交叉核对。该门禁不依赖“只匹配一种函数写法”的正则，因此能够识别循环注册、元数据注册、后定义覆盖前定义和包装器二次赋值。

## 18. CI 契约与用户下载内容隔离（2026-08-12）

库目录是用户下载和安装的交付边界，README 动态签名契约只是仓库维护与 CI 的事实源，不应成为库运行时资产。原设计让所有脚本读取 `<库>/readme_ai.contract.json`，既会污染单库下载内容，也导致契约未提交时干净 CI 退化为错误的静态探测。

本轮将 50 份契约集中迁移到 `.scripts/contracts/readme-library-contracts/<库名>.json`，并通过 `.scripts/readme-library-contracts.js` 统一解析。README 生成、严格校验、动态 shape、generator 探针、跨库检查、迁移脚本和 `validate:changed` 不再自行拼接库内契约路径。变更库门禁会把集中契约文件名映射回真实库名，并从 Git baseline/head 分别读取对应版本，避免使用合并工作区中的错误契约。全库校验同时阻止库目录重新出现 `readme_ai.contract.json`、孤立契约和大小写不一致的契约名。

验证结果：当前 559 库工作区通过 46/46 单测、严格 ABS、118/118 动态块、generator coverage、559/559 候选和跨库检查，库目录内契约文件为 0。在失败 Action 的 560 库合并提交上叠加同一改造后，原有 DHT、U8G2、ai-vox-xzai 三项基础设施失败均消失；剩余失败只来自新增 `cubic_core_car/readme_ai.md` 的旧格式。用当前候选生成器替换该 README 后，560 库严格 ABS、generator coverage 与跨库检查均为 0 错误。这说明契约迁移解决 CI 数据缺失，但不会放宽或掩盖新库自身的 README 质量问题。

### 17.1 新发现的真实缺陷

- 23 个 Agent 可见块没有实际 generator：`diandeng_blinker` 1 个、`esp32_espnow` 1 个、`pid` 4 个、`seeed_SSCMA` 2 个、`nofrendo` 15 个。已依据 Git 历史和仓库内随附上游源码恢复，当前公开缺失为 0。
- `arduino_http` 后部重复注册覆盖了前部正确实现，并把 `field_input` 当成 `input_value`、读取不存在的 `CONTENTTYPE`；已移除错误覆盖，保留真实 `TYPE` 槽位。
- `ArduinoJson`、`core-serial`、`MAX31865`、`OpenWeatherMap` 存在字段名或槽位类型不一致；分别修正 generator 或补齐真实块参数。
- `esp32_i2c` 的 `CUSTOM` 分支尝试显示不存在的输入且没有挂载 extension，会静默生成 `0x00` 地址；已建立真实 `CUSTOM_ADDRESS` 动态输入、契约和完整示例。
- 18 个传感器库、`core-variables` 和 `seekfree_b1_controller` 中存在读取不存在但随后未使用的死槽位；已删除这些读取，防止后续维护者误以为 README 还需要对应参数。
- `TFT_eSPI/tftespi_color_rgb565` 使用了函数内未定义的 `varField`；已改为从当前块读取 `VAR`，避免代码生成依赖外部同名状态。

### 17.2 可见性与兼容性的显式边界

仍有 23 个 `block.json` 条目没有 generator，但它们均为旧版、内部 mutator helper 或隐藏库旧块。它们不能仅因“不在 toolbox”被自动忽略，而是逐块使用 `agentVisible: false` 和非空原因显式分类。候选生成器会排除这些块，严格校验会拒绝它们泄漏到 Block Definitions 或 ABS examples；未来一旦要重新公开，必须先提供 generator 并删除该豁免。

保留的兼容槽位使用 `excludedRuntimeArgs`，不与不可见块混用。目前包括 Adafruit GFX 换行兼容、Qwen Omni 旧变量输入、陶晶驰旧串口输入，以及 Blinker `KEY/VALUE` 旧签名。它们仍可服务旧 workspace 恢复，但 Agent 新 README 只生成当前 ABI。

反向审计最初发现 85 个“已有 generator 注册、但同库 `block.json` 没有定义”的类型。其中 `core-functions` 的 2 个调用块并非豁免项，而是由同一 `generator.js` 创建、应公开给 Agent 的真实块；它们现已进入单库 `runtimeBlocks` 数据模型并接受完整 ABI 校验。剩余 83 个才由 `.scripts/contracts/readme-generator-registrations.v1.json` 逐项分类：4 个为其他受管理库的块提供板卡实现，11 个覆盖 Blockly 内建块，68 个属于当前 `block.json`、toolbox 和 Agent README 均未公开的历史注册。最后一类暂不机械删除，避免在没有旧工程夹具时破坏潜在兼容；但它们不是 Agent API。新出现的未分类注册、失效白名单、不存在的运行时定义或不存在的跨库 owner 都会阻断门禁。

全库还有 233 个由多个库复用的块类型，其中 55 个 owner 的静态参数、枚举域、连接形态或运行时 variant 不完全相同。跨库示例校验不再用“第一个 owner”代表全部实现，而是验证所有候选：调用至少匹配一个 owner 才通过；若同时匹配多个 ABI 不兼容的 owner，则以歧义错误阻断。当前源 README 的 3860 个外部调用和候选 README 的 3896 个外部调用均为 0 歧义。块类型在真实 Blockly 中仍不带库命名空间；同时加载冲突库的运行时覆盖风险属于后续库命名/互斥治理，不能由 README 校验宣称已经消除。

### 17.3 当前生成器门禁结果

| 项目 | 结果 |
|---|---:|
| 受管理库 / generator 加载错误 | 559 / 0 |
| 无 generator 的全部块 / Agent 可见块 | 23 / 0 |
| 已分类不可见 / 未分类缺失 | 23 / 0 |
| toolbox 未解析公开块 | 0 |
| 非预期重复注册 / 已识别包装器重注册 | 0 / 37 |
| generator-only 注册（已分类 / 未分类） | 83 / 0 |
| generator-only 分类 | 动态定义 0、跨库实现 4、内建覆盖 11、历史注册 68 |
| generator-only 契约错误 | 0 |
| 跨库复用块类型 / ABI 不同的复用类型 | 233 / 55 |
| 源 README / 候选 README 歧义外部调用 | 0 / 0 |
| 静态槽位访问器类型不匹配 | 0 |
| 未声明字面量槽位读取 | 0 |
| 严格 synthetic handler 探针错误 | 0 |

原有 4 个探针错误已逐项复核：`ai-vox-xzai` 的 2 项来自 synthetic `window` 把未知属性模拟为 truthy，导致顶层注册数组未初始化，现已在探针环境中显式提供真实空数组；`ai-vox` 对已删除/旧工程缺失参数记录直接读取 `param.type`，现保留 Boolean 兼容回退；`lvgl_init` 在无项目服务环境中直接调用 `removeMacro`，现与同函数的添加分支一样先检查 `projectService`。这 4 项清零后，handler 探针错误已纳入 strict failure，不再使用“最佳努力不阻断”表述。它仍是生成器槽位审计，不替代版本化 runtime fixture 和 aily-builder 编译。

### 17.4 最终复验

- `readme:generator-coverage`：559 个库加载成功；0 公开 generator 缺失、0 未分类缺失、83/83 generator-only 注册已分类、0 非预期覆盖、0 槽位错误、0 handler 探针错误；
- `readme:dynamic-shapes`：118/118；
- `readme:contract`：559 个库，0 错误，86 条信息仅为体积等非阻断提示；
- `readme:candidate-check`：559/559，3896 个候选跨库调用 0 错误、0 不兼容 owner 歧义；
- `readme:cross-check`：3860 个源文档跨库调用 0 错误、0 不兼容 owner 歧义；
- `readme:test`：39/39；GitHub Actions 自检 6/6；
- `readme:runtime-contract`：当前精确 Blockly 源码指纹 21/21；
- `readme:runtime-compile`：`@aily-project/aily-builder@1.3.0` 的 UNO 最小夹具 1/1。

本轮仍未修改 `aily-blockly`。其 6 个相关脏文件意味着 21/21 只能证明报告中的精确源码指纹；目标分支合并前必须在干净提交上复跑。

## 18. Generated Code 完整性与文件名大小写治理

### 18.1 新发现的问题

本阶段确认 `Generated Code` 并非少数库的展示问题。旧生成器只识别简单字符串返回和少量 `code` 变量，遇到字符串拼接、数组返回、`addObject`、`addSetupBegin`、`addFunction` 等副作用时会退化为 `Dynamic code` 或 `See generator`；表格渲染还分别存在 90/100 字符的静默截断。迁移前共有 3161 个 `Dynamic code` 行和 124 个 `See generator` 行。

此外，Git 索引中有 21 个库被改回 `README_AI.md`。Windows 的大小写不敏感文件系统可能让本地读取继续成功，但 Linux CI、Agent 文件发现和后续 case-only rename 会产生不一致。现已通过临时文件中转的 `git mv` 统一为 559 个小写 `readme_ai.md`，索引与文件系统中的大写残留均为 0。

反向审计还发现 16 个表格伪块：Sentry 的 15 个 `sentryN_*` 汇总行和 `linkbit_GxEPD2/gxepd2_spi_pins` 均没有对应公开块定义。它们会绕过“真实块是否缺行”的单向检查，并留下 `LedSetColor(...)` 等伪代码。现已删除这些行，并新增未知块和重复行门禁。

最终反向计数又发现 `seeed_wio_gfx` 的 6 个真实块行被写在后续 `## SD Video DMA Contract` 章节中。旧校验在全文件搜索到块名后会误认为已收录，但 Agent 按标准章节读取时可能漏掉。现已将 6 行移回定义表，并把“必须位于 `## Block Definitions` 内”加入严格校验与单元测试。当前 7133 个 Agent 可见块与 7133 个定义行一一对应：缺失、未知、重复均为 0。

### 18.2 生成代码证据模型

`Generated Code` 现在来自隔离加载后的真实 handler 合成执行，而不是对 `generator.js` 做正则猜测。探针使用 `block.json` 默认字段和值输入，收集 handler 返回值，并捕获 `addLibrary`、`addVariable`、`addObject`、`addFunction`、setup/loop/macro 方法及对应代码字典写入。多行代码以 `↵` 展开到单个 Markdown 单元格，但不截断内容。

探针同时修正了会制造假结果的环境差异：变量字段保留真实默认名；`nameDB`、`nameDB_`、`getVariableName` 与 Blockly 缩进工具使用确定实现；未知 generator 状态为 `undefined` 而不是 truthy no-op；每次缺失全局重试都重建 block/generator 状态；已连接块按已连接状态执行；串口、I2C、SPI 等窗口配置使用真实空容器。生成结果中的 `undefined`、`[object Object]` 和 no-op 函数字符串会直接阻断候选生成。

这轮严格化暴露出两个真实库侧 generator 问题，而不是 Blockly 转换器问题：`ai-vox-xzai` 把 `addSetupBegin` 拼成了不存在的 `addSetupbegin`；`aivox3_set_screen_light` 读取亮度后始终返回空代码。两处均已在库侧修复，未修改 `aily-blockly`。

### 18.3 合法无直接输出的分类

真实 handler 在默认空态下可能确实不直接输出代码，例如图片/动画字段尚无帧、语句输入为空、UI 接线提示块、只更新后续 generator 状态的配置块。不能把这些情况重新包装为另一个通用占位词，也不能让新出现的空 handler 静默通过。

因此新增 `.scripts/contracts/readme-generated-code-no-direct.v1.json`。当前 13 个无直接输出块逐项记录库、类型、分类、面向 Agent 的精确说明和原因；未分类空输出、失效白名单和重复声明均阻断门禁。`Generated Code` 会显示具体原因，例如“自定义动画没有帧数据时不输出代码”，而不是 `Dynamic code`。

### 18.4 迁移与门禁结果

- 首次全库迁移规范化 557/559 个库的 6827 行，其中替换 3438 个显式占位行；探针完善后又按真实状态校正 110 行，并更新 14 个合法空态/修复后输出行。
- 当前 559 个小写 `readme_ai.md` 中：`Dynamic code` 0、`See generator` 0、未知块行 0、重复块行 0、合成 `undefined` 产物 0、Generated Code 与真实合成输出不一致 0。
- 仍含 `...` 的 12 行均来自真实 generator 输出中的日志字符串、注释或文件扩展名判断，并由精确输出比较锁定，不属于截断占位符。
- `readme_ai.md` 仍以 5KB 为成本目标；为保留复杂库的完整签名和代表性生成代码，硬上限调整为 64KB。当前正常候选没有超过该上限。

一次性 README 批量迁移工具及其 npm 入口已移除。后续文档维护使用现有候选生成与校验工具。提交门禁使用 `readme:generator-coverage` 做逐块精确比较，并继续与 ABS 契约、动态 shape、真实 runtime fixture 和 aily-builder 编译分层验证，不能用合成输出替代真实运行证据。

本阶段最终复验：`readme:test` 44/44；`readme:dynamic-shapes` 118/118；`readme:contract` 559 个库、0 错误；`readme:generator-coverage` 0 公开缺失、0 槽位/探针/文档不一致、13 个合法无直接输出全部有版本化分类；源 README 的 3860 个跨库调用与 559 份候选中的 3896 个跨库调用均为 0 错误、0 歧义；GitHub Actions 自检 6/6；真实运行时黄金夹具 21/21；`@aily-project/aily-builder@1.3.0` 编译夹具 1/1。Generated Code 迁移再次预览为 0/559 个库、0 行变化，证明迁移幂等。

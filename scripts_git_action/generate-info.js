/**
 * 库 info.json 自动生成脚本
 * 从 package.json 中提取信息生成 info.json
 * 
 * 使用方法:
 *   node generate-info.js                    # 生成所有缺失的 info.json
 *   node generate-info.js --all              # 重新生成所有 info.json
 *   node generate-info.js adafruit_DHT       # 只生成指定库
 *   node generate-info.js --dry-run          # 预览模式，不实际写入文件
 */

const fs = require('fs');
const path = require('path');

const LIBRARIES_DIR = path.join(__dirname, '..');

// 需要排除的目录
const EXCLUDE_DIRS = ['node_modules', '.git', 'archive', 'template', '.github'];

// ============ 分类关键词映射（按优先级排序）============
// 优先级规则：
// 1. 精确型号匹配优先（如 mpu6050 → sensor）
// 2. 特定分类优先于通用分类
// 3. 使用单词边界匹配避免误匹配（如 mq 不应匹配 mqtt）

const CATEGORY_KEYWORDS = [
    // 🔥 最高优先级：通信类（避免 mqtt 被 mq 误匹配）
    ['communication', [
        'mqtt', 'wifi', 'bluetooth', 'ble', 'lora', 'zigbee', 'http client', 'websocket',
        'tcp client', 'udp', 'modbus', 'canbus', 'espnow', 'gps', 'gnss', 'pubsub', 'iot',
        '通信', '无线', '蓝牙', '网络', '定位', '物联网', 'iic', 'email', 'tcp', 'spi'
    ]],
    // 显示类
    ['display', [
        'display', 'screen', 'lcd', 'oled', 'tft', 'matrix', 'segment',
        'epaper', 'e-ink', 'gfx', 'graphics', 'neopixel', 'ws2812', 'led strip', 'apa102',
        '显示', '屏幕', '数码管', '点阵', 'ssd1306', 'st7735', 'st7789', 'ili9341', 'max7219',
        '74hc595', 'FFT', 'espui', 'led'
    ]],
    ['audio', [
        'audio', 'sound', 'speaker', 'buzzer', 'mp3', 'music', 'voice', 'dfplayer', 'vs1053',
        'speech', 'tts', 'asr', 'microphone', 'a2dp', 'mp3player', 'gd3800',
        '音频', '声音', '蜂鸣器', '喇叭', '播放', '语音'
    ]],
    ['motor', [
        'motor', 'stepper', 'servo', 'actuator', 'dc motor', 'l298', 'tb6612', 'a4988',
        'pca9685', 'accelstepper', 'drv8825', 'uln2003',
        '电机', '步进', '舵机', '驱动'
    ]],
    ['time', [
        'rtc', 'ds1302', 'ds1307', 'ds3231', 'pcf8563', 'ntpclient',
        '时钟', '实时时钟'
    ]],
    ['power', [
        'battery', 'power monitor', 'voltage sensor', 'current sensor', 'ina219', 'ina226',
        '电源监测', '电池', '电压检测', '电流检测'
    ]],
    ['input', [
        'button', 'keyboard', 'keypad', 'encoder', 'joystick', 'remote', 'ir receiver', 'rc522', 'pn532', 'rfid', 'nfc',
        '按钮', '键盘', '编码器', '摇杆', '遥控', '射频', 'fingerprint', 'MPR121', 'touch', 'tca8418', 'keypad', 'mouse',
        'chsc6x', 'ps3controller'
    ]],
    ['storage', [
        'sd card', 'microsd', 'eeprom', 'flash storage', 'file system', 'spiffs', 'littlefs',
        '存储卡', 'tf卡'
    ]],
    ['actuator', [
        'relay', 'valve', 'pump', 'solenoid',
        '继电器', '阀门', '水泵', '电磁'
    ]],
    ['protocol', [
        'json', 'xml', 'parser', 'pid', 'kalman', 'filter algorithm',
        '协议解析', '算法', 'freeRTOS', 'ticker'
    ]],
    ['ai', [
        'machine learning', 'tensorflow', 'tinyml', 'neural network', 'face', 'object detection',
        'llm', 'chatgpt', 'gpt', 'claude', 'gemini', 'baidu', 'qwen', 'spark-ai', 'sparkdesk', 'zhipu', 'moonshot',
        '人工智能', '机器学习', '神经网络', '人脸', '目标检测', '大模型', '智谱', '百度', '阿里', '讯飞', '星火',
        'ai-assistant', 'ai-vox', 'aivox', 'AI语音交互', 'huskylens', 'sscma', 'su03t'
    ]],
    // 🔴 sensor 放最后，且移除容易误匹配的短关键词
    ['sensor', [
        'sensor', 'temperature', 'humidity', 'pressure', 'accelerometer', 'gyroscope',
        'magnetometer', 'light sensor', 'color sensor', 'gas sensor', 'distance', 'ultrasonic', 'infrared',
        'proximity', 'touch sensor', 'gesture', 'imu', 'barometer', 'altimeter', 'spa06', 'wind',
        'dht11', 'dht22', 'bme280', 'bme680', 'bmp280', 'mpu6050', 'mpu9250', 'adxl345', 'hcsr04', 'vl53l0x', 'mlx90614', 'aht10', 'aht20', 'sht30', 'sht40',
        '传感器', '温度', '湿度', '气压', '加速度', '陀螺仪', '磁力计', 'sensor', 'aht', 'humidity', 'temperature', 'SHTC3',
        '气体', '距离', '超声波', '红外', '接近', '触摸', '手势', 'as5600', 'gp2y1010au0f', 'mt6701', 'bmi270'
    ]]
];

// 精确匹配表：库名直接映射到分类（最高优先级）
const EXACT_CATEGORY_MAP = {
    // 🔥 输入设备（优先于通信，因为 keyboard/mouse/gamepad 虽然用蓝牙但本质是输入设备）
    'keyboard': 'input',
    'mouse': 'input',
    'gamepad': 'input',
    // 🔥 显示类（摄像头网络服务器主要是视频流显示）
    'camera_webserver': 'display',
    'camera-webserver': 'display',
    'http_img_loader': 'display',
    'img_loader': 'display',
    'lvgl': 'display',
    'gfx': 'display',
    'tft_espi': 'display',
    // 通信
    'mqtt': 'communication',
    'pubsubclient': 'communication',
    'wifi': 'communication',
    'espnow': 'communication',
    'lora': 'communication',
    'ble': 'communication',
    'bluetooth': 'communication',
    'websocket': 'communication',
    'http': 'communication',
    // 协议
    'pid': 'protocol',
    'kalman': 'protocol',
    'json': 'protocol',
};

// ============ 硬件类型关键词映射 ============
// 精确匹配优先，避免 temperature 匹配到 MPU6050 这种 IMU 传感器

// 精确型号 → 硬件类型映射（最高优先级）
const EXACT_HARDWARE_MAP = {
    'mpu6050': ['imu', 'accelerometer', 'gyroscope'],
    'mpu9250': ['imu', 'accelerometer', 'gyroscope', 'magnetometer'],
    'bno055': ['imu', 'accelerometer', 'gyroscope', 'magnetometer'],
    'icm20948': ['imu', 'accelerometer', 'gyroscope', 'magnetometer'],
    'adxl345': ['accelerometer'],
    'adxl335': ['accelerometer'],
    'lis3dh': ['accelerometer'],
    'bme280': ['temperature', 'humidity', 'pressure'],
    'bme680': ['temperature', 'humidity', 'pressure', 'gas'],
    'bmp280': ['temperature', 'pressure'],
    'bmp180': ['temperature', 'pressure'],
    'dht11': ['temperature', 'humidity'],
    'dht22': ['temperature', 'humidity'],
    'sht30': ['temperature', 'humidity'],
    'sht31': ['temperature', 'humidity'],
    'sht40': ['temperature', 'humidity'],
    'aht10': ['temperature', 'humidity'],
    'aht20': ['temperature', 'humidity'],
    'hcsr04': ['ultrasonic', 'distance'],
    'vl53l0x': ['distance'],
    'vl53l1x': ['distance'],
    'max7219': ['led-matrix'],
    'ws2812': ['led'],
    'neopixel': ['led'],
    'ssd1306': ['oled'],
    'st7735': ['tft'],
    'st7789': ['tft'],
    'ili9341': ['tft'],
    'pca9685': ['servo'],
    'dfplayer': ['mp3'],
    'ds18b20': ['temperature'],
    'mlx90614': ['temperature'],
    'apds9960': ['gesture', 'color', 'proximity'],
    'mpr121': ['touch'],
    'tcs34725': ['color'],
    'bh1750': ['light'],
    'sgp30': ['gas'],
    'ccs811': ['gas'],
    'ens160': ['gas'],
    'ds1307': ['rtc'],
    'ds3231': ['rtc'],
    'pcf8563': ['rtc'],
    'rc522': ['rfid'],
    'pn532': ['rfid'],
    'neo6m': ['gps'],
    'ublox': ['gps'],
};

const HARDWARE_TYPE_KEYWORDS = {
    // IMU 类（优先检测，避免被 temperature 抢先）
    imu: ['imu', '惯性', '6-axis', '9-axis', '六轴', '九轴'],
    accelerometer: ['accelerometer', 'accel', '加速度'],
    gyroscope: ['gyroscope', 'gyro', '陀螺仪'],
    magnetometer: ['magnetometer', 'compass', '磁力计', '指南针', 'hmc', 'qmc', 'lis3mdl'],
    
    // 环境传感器
    temperature: ['temperature sensor', 'thermometer', '温度传感器', 'lm35'],
    humidity: ['humidity sensor', 'humid', '湿度传感器'],
    pressure: ['pressure sensor', 'barometer', '气压传感器', '压力传感器', 'ms5611'],
    gas: ['gas sensor', 'air quality sensor', 'co2 sensor', 'voc sensor', '气体传感器', '空气质量'],
    
    // 距离/位置
    distance: ['distance sensor', 'ranging', '距离传感器', '测距', 'tof'],
    ultrasonic: ['ultrasonic', '超声波'],
    proximity: ['proximity sensor', '接近传感器', 'apds'],
    
    // 光/颜色
    light: ['light sensor', 'lux', 'ambient light', '光线传感器', '亮度', 'tsl', 'veml'],
    color: ['color sensor', 'rgb sensor', '颜色传感器'],
    
    // 交互
    gesture: ['gesture sensor', '手势传感器', 'paj7620'],
    touch: ['touch sensor', 'capacitive touch', '触摸传感器', '电容触摸'],
    
    // 显示类
    oled: ['oled', 'sh1106', 'ssd1309'],
    lcd: ['lcd', '1602', '2004', 'character lcd', '液晶'],
    tft: ['tft display', '彩屏'],
    led: ['led strip', '灯带', '灯珠', 'apa102', 'sk6812', 'fastled'],
    'led-matrix': ['led matrix', '点阵', 'ht16k33'],
    'seven-segment': ['7-segment', 'seven segment', '数码管', 'tm1637', 'tm1638'],
    epaper: ['epaper', 'e-ink', 'e-paper', '墨水屏'],
    
    // 执行器类
    servo: ['servo', '舵机', 'sg90', 'mg90', 'mg996'],
    stepper: ['stepper', '步进', 'a4988', 'drv8825', 'tmc', 'uln2003', '28byj', 'accelstepper'],
    'dc-motor': ['dc motor', 'motor driver', '直流电机', 'l298', 'l293', 'tb6612'],
    relay: ['relay', '继电器'],
    buzzer: ['buzzer', '蜂鸣器', 'piezo'],
    
    // 通信模块
    bluetooth: ['hc05', 'hc06', 'hc-05', 'hc-06'],
    lora: ['lora module', 'sx1276', 'sx1278', 'ra02'],
    rfid: ['rfid reader', 'nfc reader', 'mfrc522'],
    gps: ['gps module', 'gnss module', '定位模块'],
    
    // 其他
    rtc: ['rtc module', 'real time clock', 'ds1302'],
    encoder: ['rotary encoder', '旋转编码器'],
    camera: ['camera', 'cam', 'ov2640', 'ov7670', '摄像头'],
    fingerprint: ['fingerprint', '指纹'],
    'sd-card': ['sd card', 'sd module', 'microsd', 'tf card'],
    mp3: ['mp3 player', 'audio player', 'vs1053'],
    power: ['power monitor', '电源监测'],
};

// ============ 通信方式关键词映射 ============
const COMMUNICATION_KEYWORDS = {
    i2c: ['i2c', 'iic', 'wire', 'twi'],
    spi: ['spi'],
    uart: ['uart', 'serial', 'rx', 'tx', '串口'],
    onewire: ['onewire', 'one-wire', 'one wire', '1-wire', '单总线'],
    gpio: ['gpio', 'digital', 'pin'],
    pwm: ['pwm'],
    analog: ['analog', 'adc'],
    wifi: ['wifi', 'http', 'mqtt', 'websocket', 'tcp', 'udp'],
    ble: ['ble', 'bluetooth'],
    can: ['can', 'canbus'],
};

// ============ 辅助函数 ============

/**
 * 检查文本是否包含关键词（使用单词边界匹配）
 * 避免 "variables" 被 "ble" 误匹配等问题
 */
function matchKeyword(text, keyword) {
    const lowerText = text.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    
    // 对于短关键词（<=3字符），使用单词边界匹配
    if (lowerKeyword.length <= 3) {
        // 构建正则：关键词前后必须是非字母数字字符或字符串边界
        const regex = new RegExp(`(?:^|[^a-z0-9])${lowerKeyword}(?:[^a-z0-9]|$)`, 'i');
        return regex.test(lowerText);
    }
    
    // 对于较长的关键词，简单包含匹配即可
    return lowerText.includes(lowerKeyword);
}

/**
 * 从文本中检测分类
 */
function detectCategory(text, name) {
    const lowerText = text.toLowerCase();
    const lowerName = name.toLowerCase();
    
    // 🔥 最高优先级：精确库名匹配（使用单词边界）
    for (const [exactName, category] of Object.entries(EXACT_CATEGORY_MAP)) {
        if (lowerName === exactName || matchKeyword(lowerName, exactName)) {
            return category;
        }
    }
    
    // 按优先级遍历分类（先在库名中匹配）
    for (const [category, keywords] of CATEGORY_KEYWORDS) {
        for (const keyword of keywords) {
            if (matchKeyword(lowerName, keyword)) {
                return category;
            }
        }
    }
    
    // 然后在全文中匹配
    for (const [category, keywords] of CATEGORY_KEYWORDS) {
        for (const keyword of keywords) {
            if (matchKeyword(lowerText, keyword)) {
                return category;
            }
        }
    }
    
    return 'utility';
}

/**
 * 从文本中检测硬件类型（返回数组）
 */
function detectHardwareType(text, name) {
    const lowerText = text.toLowerCase();
    const lowerName = name.toLowerCase();
    const result = new Set();
    
    // 🔥 最高优先级：精确型号匹配
    for (const [model, types] of Object.entries(EXACT_HARDWARE_MAP)) {
        if (lowerName.includes(model) || lowerText.includes(model)) {
            types.forEach(t => result.add(t));
        }
    }
    
    // 如果精确匹配已经有结果，直接返回
    if (result.size > 0) {
        return Array.from(result);
    }
    
    // 关键词匹配
    for (const [hwType, keywords] of Object.entries(HARDWARE_TYPE_KEYWORDS)) {
        for (const keyword of keywords) {
            if (lowerText.includes(keyword.toLowerCase())) {
                result.add(hwType);
                break;
            }
        }
    }
    
    return Array.from(result);
}

/**
 * 从文本中检测通信方式
 */
function detectCommunication(text) {
    const lowerText = text.toLowerCase();
    const communications = [];
    
    for (const [comm, keywords] of Object.entries(COMMUNICATION_KEYWORDS)) {
        for (const keyword of keywords) {
            if (matchKeyword(lowerText, keyword)) {
                if (!communications.includes(comm)) {
                    communications.push(comm);
                }
                break;
            }
        }
    }
    
    return communications;
}

/**
 * 从文本中提取兼容硬件型号
 */
function extractCompatibleHardware(text) {
    const hardware = [];
    const patterns = [
        // 传感器型号
        /\b(DHT\d+|DS18B20|BME\d+|BMP\d+|SHT\d+|AHT\d+|MPU\d+|ADXL\d+|HMC\d+|QMC\d+|BH\d+|TSL\d+|VEML\d+|MQ\d+|SGP\d+|CCS\d+|APDS\d+|PAJ\d+)\b/gi,
        // 显示屏型号
        /\b(SSD\d+|SH\d+|ST\d+|ILI\d+|WS\d+|MAX\d+|TM\d+|HT\d+)\b/gi,
        // 电机驱动
        /\b(A\d{4}|DRV\d+|TMC\d+|ULN\d+|L\d{3}[A-Z]?|TB\d+)\b/gi,
        // 通信模块
        /\b(HC-?\d+|RC\d+|PN\d+|MFRC\d+|NEO\d+|SX\d+)\b/gi,
        // RTC
        /\b(DS\d{4}|PCF\d+)\b/gi,
        // 其他常见型号
        /\b(ESP\d+[A-Z]?\d*|RP\d+|NRF\d+)\b/gi,
    ];
    
    for (const pattern of patterns) {
        const matches = text.match(pattern);
        if (matches) {
            for (const match of matches) {
                const normalized = match.toUpperCase();
                if (!hardware.includes(normalized)) {
                    hardware.push(normalized);
                }
            }
        }
    }
    
    return hardware;
}

/**
 * 从 keywords 提取标签（过滤掉通用词）
 */
function extractTags(pkg) {
    const excludeWords = [
        'aily', 'blockly', 'arduino', 'library', 'lib', 'module',
        'sensor', 'driver', 'control', 'controller'
    ];
    
    const keywords = pkg.keywords || [];
    const tags = [];
    
    for (const keyword of keywords) {
        const lower = keyword.toLowerCase();
        // 跳过通用词和函数名（包含下划线的）
        if (excludeWords.includes(lower) || keyword.includes('_')) {
            continue;
        }
        // 保留中文关键词和有意义的英文词
        if (/[\u4e00-\u9fa5]/.test(keyword) || keyword.length > 2) {
            if (!tags.includes(keyword)) {
                tags.push(keyword);
            }
        }
    }
    
    return tags.slice(0, 15); // 最多保留15个标签
}

/**
 * 规范化内核名称
 */
function normalizeCore(core) {
    const coreMap = {
        'arduino:avr': 'arduino:avr',
        'esp32:esp32': 'esp32:esp32',
        'esp32:esp32c3': 'esp32:esp32',
        'esp32:esp32s3': 'esp32:esp32',
        'esp32:esp32c6': 'esp32:esp32',
        'esp8266:esp8266': 'esp8266:esp8266',
        'rp2040:rp2040': 'rp2040:rp2040',
        'STMicroelectronics:stm32': 'STMicroelectronics:stm32',
        'arduino:sam': 'arduino:sam',
        'arduino:samd': 'arduino:samd',
    };
    
    return coreMap[core] || core;
}

/**
 * 生成库的 info.json
 */
function generateLibraryInfo(dirName, pkg) {
    // 组合所有文本用于分析
    const allText = [
        pkg.name || '',
        pkg.nickname || '',
        pkg.description || '',
        ...(pkg.keywords || [])
    ].join(' ');
    
    // 检测分类和硬件类型
    const category = detectCategory(allText, dirName);
    const hardwareType = detectHardwareType(allText, dirName);  // 现在返回数组
    const communication = detectCommunication(allText);
    
    // 提取支持的内核
    let supportedCores = [];
    if (pkg.compatibility?.core && pkg.compatibility.core.length > 0) {
        supportedCores = [...new Set(pkg.compatibility.core.map(normalizeCore))];
    }
    
    // 提取电压
    let voltage = pkg.compatibility?.voltage || [];
    if (voltage.length === 0) {
        // 默认支持 3.3V 和 5V
        voltage = [3.3, 5];
    }
    
    // 提取兼容硬件
    // const compatibleHardware = extractCompatibleHardware(allText);
    
    // 提取标签
    const tags = extractTags(pkg);
    
    // 构建 info.json
    const info = {
        $schema: 'library-info-schema',
        name: pkg.name?.replace('@aily-project/', '') || dirName,
        displayName: pkg.nickname || pkg.name?.replace('@aily-project/', '') || dirName,
        category: category,
        subcategory: '',
        supportedCores: supportedCores,
        communication: communication,
        voltage: voltage,
        functions: [],
        hardwareType: hardwareType,
        // compatibleHardware: compatibleHardware,
        tags: tags
    };
    
    return info;
}

/**
 * 获取所有库目录
 */
function getLibraryDirs() {
    const items = fs.readdirSync(LIBRARIES_DIR);
    const libraryDirs = [];

    for (const item of items) {
        const itemPath = path.join(LIBRARIES_DIR, item);
        if (EXCLUDE_DIRS.includes(item) || !fs.statSync(itemPath).isDirectory()) {
            continue;
        }

        const pkgPath = path.join(itemPath, 'package.json');
        
        if (fs.existsSync(pkgPath)) {
            libraryDirs.push({
                name: item,
                path: itemPath,
                pkgPath: pkgPath,
                infoPath: path.join(itemPath, 'info.json')
            });
        }
    }

    return libraryDirs;
}

/**
 * 主函数
 */
function main() {
    const args = process.argv.slice(2);
    const regenerateAll = args.includes('--all');
    const dryRun = args.includes('--dry-run');
    const specificLib = args.find(a => !a.startsWith('--'));
    
    console.log('库 info.json 自动生成脚本');
    console.log('========================\n');
    
    if (dryRun) console.log('[ 预览模式 - 不会实际写入文件 ]\n');
    
    const libraryDirs = getLibraryDirs();
    let generated = 0;
    let skipped = 0;
    let errors = 0;
    
    // 统计信息
    const stats = {
        categories: {},
        hardwareTypes: {},
        communications: {}
    };
    
    for (const lib of libraryDirs) {
        // 如果指定了特定库
        if (specificLib && lib.name !== specificLib) {
            continue;
        }
        
        // 检查是否已存在
        if (!regenerateAll && fs.existsSync(lib.infoPath)) {
            console.log(`⏭  ${lib.name} - 已存在，跳过`);
            skipped++;
            continue;
        }
        
        try {
            // 读取 package.json
            const pkg = JSON.parse(fs.readFileSync(lib.pkgPath, 'utf8'));
            
            // 跳过根目录的 package.json
            if (pkg.name === 'aily-blockly-libraries') {
                continue;
            }
            
            // 跳过隐藏的库
            if (pkg.hide === true) {
                console.log(`⏭  ${lib.name} - 已隐藏，跳过`);
                skipped++;
                continue;
            }
            
            // 生成 info.json
            const info = generateLibraryInfo(lib.name, pkg);
            
            // 统计
            stats.categories[info.category] = (stats.categories[info.category] || 0) + 1;
            if (info.hardwareType) {
                stats.hardwareTypes[info.hardwareType] = (stats.hardwareTypes[info.hardwareType] || 0) + 1;
            }
            info.communication.forEach(c => {
                stats.communications[c] = (stats.communications[c] || 0) + 1;
            });
            
            // 写入或预览
            if (dryRun) {
                console.log(`\n📋 ${lib.name}:`);
                console.log(`   分类: ${info.category}, 硬件: ${info.hardwareType || '无'}`);
                console.log(`   通信: ${info.communication.join(', ') || '无'}`);
                console.log(`   内核: ${info.supportedCores.join(', ') || '全部'}`);
                // console.log(`   兼容: ${info.compatibleHardware.join(', ') || '无'}`);
            } else {
                fs.writeFileSync(lib.infoPath, JSON.stringify(info, null, 2), 'utf8');
                console.log(`✅ ${lib.name} - ${info.category}${info.hardwareType ? '/' + info.hardwareType : ''}`);
            }
            generated++;
            
        } catch (error) {
            console.error(`❌ ${lib.name} - 错误: ${error.message}`);
            errors++;
        }
    }
    
    console.log('\n========================');
    console.log(`生成: ${generated}, 跳过: ${skipped}, 错误: ${errors}`);
    
    // 显示统计信息
    if (generated > 0) {
        console.log('\n=== 统计信息 ===');
        
        console.log('\n分类分布:');
        Object.entries(stats.categories)
            .sort((a, b) => b[1] - a[1])
            .forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));
        
        console.log('\n硬件类型分布 (Top 10):');
        Object.entries(stats.hardwareTypes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .forEach(([type, count]) => console.log(`  ${type}: ${count}`));
        
        console.log('\n通信方式分布:');
        Object.entries(stats.communications)
            .sort((a, b) => b[1] - a[1])
            .forEach(([comm, count]) => console.log(`  ${comm}: ${count}`));
    }
    
    if (!dryRun && generated > 0) {
        console.log('\n提示: 生成的 info.json 可能需要手动补充以下信息:');
        console.log('  - 更准确的 subcategory 子分类');
        console.log('  - functions 主要功能列表');
        console.log('  - 更完整的 supportedCores 内核支持');
    }
}

main();

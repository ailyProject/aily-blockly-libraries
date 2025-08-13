// 在现有代码前面添加：
Arduino.forBlock['esp32_sd_init'] = function(block, generator) {
    // 添加必要的库文件
    generator.addLibrary('#include "SD.h"', '#include "SD.h"');
    generator.addLibrary('#include "SPI.h"', '#include "SPI.h"');
    generator.addLibrary('#include "FS.h"', '#include "FS.h"');

    // 从 block 获取自定义引脚号
    const csPin = generator.valueToCode(block, 'CS_PIN', Arduino.ORDER_ATOMIC) || '46';
    const sckPin = generator.valueToCode(block, 'SCK_PIN', Arduino.ORDER_ATOMIC) || '3';
    const mosiPin = generator.valueToCode(block, 'MOSI_PIN', Arduino.ORDER_ATOMIC) || '14';
    const misoPin = generator.valueToCode(block, 'MISO_PIN', Arduino.ORDER_ATOMIC) || '35';

    // 创建SPI对象
    generator.addObject('SPIClass spi = SPIClass(FSPI);', 'SPIClass spi = SPIClass(FSPI);');

    // 在setup中添加SD卡初始化代码
    const initCode = `
    // 初始化SPI总线
    spi.begin(${sckPin}, ${misoPin}, ${mosiPin}, ${csPin});  // SCK, MISO, MOSI, CS

    // 初始化SD卡
    if (!SD.begin(${csPin}, spi)) {
        Serial.println("❌ 无法挂载 SD 卡！");
        return;
    }
    Serial.println("✅ SD 卡已挂载！");`;

    generator.addSetup('sd_init', initCode);

    return '';
};

// 修改 esp32_i2s_init 函数，移除SD相关库（避免重复）
Arduino.forBlock['esp32_i2s_init_and_begin'] = function(block, generator) {
    // 获取自定义引脚和参数
    const bclkPin = generator.valueToCode(block, 'SCK_PIN', Arduino.ORDER_ATOMIC) || '41';
    const wsPin = generator.valueToCode(block, 'WS_PIN', Arduino.ORDER_ATOMIC) || '42';
    const dinPin = generator.valueToCode(block, 'SD_PIN', Arduino.ORDER_ATOMIC) || '2';
    const sampleRate = block.getFieldValue('SAMPLE_RATE') || '8000';
    const bufferSize = block.getFieldValue('BUFFER_SIZE') || '512';

    // 添加库
    generator.addLibrary('#include "Esp_I2S.h"', '#include "Esp_I2S.h"');

    // 创建对象
    generator.addObject(
        `EspI2S microphone;`,
        `EspI2S microphone;`
    );

    // 生成初始化代码（合并对象和 begin）
    const initCode = `
    // 初始化I2S麦克风
    microphone.begin(${sampleRate}, ${bufferSize}, ${bclkPin}, ${wsPin}, ${dinPin});
    `;

    generator.addSetup('i2s_init', initCode);

    return '';
};

Arduino.forBlock['esp32_i2s_read_samples'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return `${objectName}.readSamples();\n`;
};

Arduino.forBlock['esp32_i2s_get_level'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    const levelType = block.getFieldValue('LEVEL_TYPE');
    
    let methodName;
    switch(levelType) {
        case 'average':
            methodName = 'getAverageLevel';
            break;
        case 'peak':
            methodName = 'getPeakLevel';
            break;
        case 'rms':
            methodName = 'getRMSLevel';
            break;
        case 'decibels':
            methodName = 'getDecibels';
            break;
        case 'percentage':
            methodName = 'getPercentage';
            break;
        default:
            methodName = 'getAverageLevel';
    }
    
    return [`${objectName}.${methodName}()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_i2s_sound_detected'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    const threshold = generator.valueToCode(block, 'THRESHOLD', Arduino.ORDER_NONE) || '1000';
    
    return [`${objectName}.isSoundDetected(${threshold})`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_i2s_get_quality'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return [`${objectName}.getQualityLevel()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_i2s_get_freq_energy'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    const freqBand = block.getFieldValue('FREQ_BAND');
    
    let methodName;
    switch(freqBand) {
        case 'low':
            methodName = 'getLowFreqEnergy';
            break;
        case 'mid':
            methodName = 'getMidFreqEnergy';
            break;
        case 'high':
            methodName = 'getHighFreqEnergy';
            break;
        default:
            methodName = 'getLowFreqEnergy';
    }
    
    return [`${objectName}.${methodName}()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_i2s_calibrate'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return `${objectName}.calibrateNoiseFloor();\n`;
};

Arduino.forBlock['esp32_i2s_get_snr'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return [`${objectName}.getSNR()`, Arduino.ORDER_FUNCTION_CALL];
};

// 以下是新增的录制功能积木块代码生成器

Arduino.forBlock['esp32_i2s_start_recording'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    const filename = generator.valueToCode(block, 'FILENAME', Arduino.ORDER_NONE) || '""';
    const duration = generator.valueToCode(block, 'DURATION', Arduino.ORDER_NONE) || '0';
    
    return `${objectName}.startRecording(${filename}, ${duration} * 1000);\n`;
};

Arduino.forBlock['esp32_i2s_stop_recording'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return `${objectName}.stopRecording();\n`;
};

Arduino.forBlock['esp32_i2s_update_recording'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return `${objectName}.updateRecording();\n`;
};

Arduino.forBlock['esp32_i2s_is_recording'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return [`${objectName}.isRecording()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_i2s_get_recording_status'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return [`${objectName}.getRecordingStatus()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_i2s_get_recorded_time'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return [`${objectName}.getRecordedTime()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_i2s_list_files'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return `${objectName}.listAudioFiles();\n`;
};

Arduino.forBlock['esp32_i2s_delete_file'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    const filename = generator.valueToCode(block, 'FILENAME', Arduino.ORDER_NONE) || '""';
    
    return `${objectName}.deleteAudioFile(${filename});\n`;
};

// 在现有代码后面添加功放相关的代码生成器：

// 功放初始化
Arduino.forBlock['esp32_i2s_init_speaker'] = function(block, generator) {
    // 从 block 获取自定义功放引脚号
    const speakerBclkPin = generator.valueToCode(block, 'BCLK_PIN', Arduino.ORDER_ATOMIC) || '39';
    const speakerWsPin = generator.valueToCode(block, 'LRC_PIN', Arduino.ORDER_ATOMIC) || '40';
    const speakerDinPin = generator.valueToCode(block, 'DIN_PIN', Arduino.ORDER_ATOMIC) || '38';

    // 添加必要的库文件
    generator.addLibrary('#include "Esp_I2S.h"', '#include "Esp_I2S.h"');

    // 创建对象
    generator.addObject(
        `EspI2S microphone;`,
        `EspI2S microphone;`
    );

    // 功放初始化代码
    const initCode = `
    // 初始化I2S功放
    if (!microphone.initSpeaker(${speakerBclkPin}, ${speakerWsPin}, ${speakerDinPin})) {
        Serial.println("❌ 功放初始化失败！");
    } else {
        Serial.println("✅ 功放初始化成功！");
    }`;

    generator.addSetup('speaker_init', initCode);

    return '';
};

// WAV文件播放
Arduino.forBlock['esp32_i2s_play_wav_file'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    const filename = generator.valueToCode(block, 'FILENAME', Arduino.ORDER_NONE) || '""';
    
    return `${objectName}.playWavFile(${filename});\n`;
};

Arduino.forBlock['esp32_i2s_stop_playback'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return `${objectName}.stopPlayback();\n`;
};

Arduino.forBlock['esp32_i2s_update_playback'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return `${objectName}.updatePlayback();\n`;
};

// 音调播放
Arduino.forBlock['esp32_i2s_play_tone'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    const frequency = generator.valueToCode(block, 'FREQUENCY', Arduino.ORDER_NONE) || '440';
    const duration = generator.valueToCode(block, 'DURATION', Arduino.ORDER_NONE) || '1000';
    
    return `${objectName}.playTone(${frequency}, ${duration});\n`;
};

// 音符播放
Arduino.forBlock['esp32_i2s_play_note_name'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    const noteName = block.getFieldValue('NOTE_NAME');
    const duration = generator.valueToCode(block, 'DURATION', Arduino.ORDER_NONE) || '500';
    
    // 音符名称到频率的映射
    const noteFreqs = {
        'C4': '261.63',
        'D4': '293.66',
        'E4': '329.63',
        'F4': '349.23',
        'G4': '392.00',
        'A4': '440.00',
        'B4': '493.88',
        'C5': '523.25'
    };
    
    const frequency = noteFreqs[noteName] || '440.00';
    
    return `${objectName}.playTone(${frequency}, ${duration});\n`;
};

// 预设音乐播放
Arduino.forBlock['esp32_i2s_play_twinkle_star'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return `${objectName}.playTwinkleStar();\n`;
};

Arduino.forBlock['esp32_i2s_play_beep'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    const duration = generator.valueToCode(block, 'DURATION', Arduino.ORDER_NONE) || '200';
    
    return `${objectName}.playBeep(${duration});\n`;
};

Arduino.forBlock['esp32_i2s_update_melody'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return `${objectName}.updateMelody();\n`;
};

// 音量控制
Arduino.forBlock['esp32_i2s_set_volume'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    const volume = generator.valueToCode(block, 'VOLUME', Arduino.ORDER_NONE) || '0.5';
    
    return `${objectName}.setVolume(${volume});\n`;
};

// 播放状态查询
Arduino.forBlock['esp32_i2s_is_playing'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return [`${objectName}.isPlayingWav()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_i2s_is_melody_playing'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return [`${objectName}.isMelodyPlaying()`, Arduino.ORDER_FUNCTION_CALL];
};

// 添加循环中更新的辅助函数生成器
Arduino.forBlock['esp32_i2s_update_all'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    const code = `
// 更新I2S状态
${objectName}.updateRecording();  // 更新录制状态
${objectName}.updatePlayback();   // 更新WAV播放状态
${objectName}.updateMelody();     // 更新旋律播放状态
`;
    
    return code;
};

// PDM麦克风初始化
Arduino.forBlock['esp32_pdm_init_and_begin'] = function(block, generator) {
    // 获取自定义引脚和参数
    const clkPin = generator.valueToCode(block, 'CLK_PIN', Arduino.ORDER_ATOMIC) || '42';
    const dataPin = generator.valueToCode(block, 'DATA_PIN', Arduino.ORDER_ATOMIC) || '41';
    const sampleRate = block.getFieldValue('SAMPLE_RATE') || '16000';
    const bufferSize = block.getFieldValue('BUFFER_SIZE') || '512';

    // 添加库
    generator.addLibrary('#include "Esp_I2S.h"', '#include "Esp_I2S.h"');

    // 创建对象
    generator.addObject(
        `EspI2S microphone;`,
        `EspI2S microphone;`
    );

    // 生成PDM初始化代码
    const initCode = `
    // 初始化PDM麦克风
    if (!microphone.beginPDM(${sampleRate}, ${bufferSize}, ${clkPin}, ${dataPin})) {
        Serial.println("❌ PDM麦克风初始化失败！");
    } else {
        Serial.println("✅ PDM麦克风初始化成功！");
    }
    `;

    generator.addSetup('pdm_init', initCode);

    return '';
};

// PDM麦克风就绪状态检查
Arduino.forBlock['esp32_pdm_is_ready'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return [`${objectName}.isPDMReady()`, Arduino.ORDER_FUNCTION_CALL];
};

// PDM麦克风读取样本
Arduino.forBlock['esp32_pdm_read_samples'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return `${objectName}.readPDMSamples();\n`;
};

// 获取麦克风类型
Arduino.forBlock['esp32_get_mic_type'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return [`${objectName}.getMicTypeString()`, Arduino.ORDER_FUNCTION_CALL];
};

// PDM滤波器设置
Arduino.forBlock['esp32_pdm_set_filter'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    const filterLength = generator.valueToCode(block, 'FILTER_LENGTH', Arduino.ORDER_NONE) || '32';
    const cutoffFreq = generator.valueToCode(block, 'CUTOFF_FREQ', Arduino.ORDER_NONE) || '1000';
    
    return `${objectName}.setPDMFilter(${filterLength}, ${cutoffFreq});\n`;
};

// PDM增益设置
Arduino.forBlock['esp32_pdm_set_gain'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    const gain = generator.valueToCode(block, 'GAIN', Arduino.ORDER_NONE) || '1.0';
    
    return `${objectName}.setPDMGain(${gain});\n`;
};
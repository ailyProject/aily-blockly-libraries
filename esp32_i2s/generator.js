// 在现有代码前面添加：
Arduino.forBlock['esp32_sd_init'] = function(block, generator) {
    // 添加必要的库文件
    generator.addLibrary('#include "SD.h"', '#include "SD.h"');
    generator.addLibrary('#include "SPI.h"', '#include "SPI.h"');
    generator.addLibrary('#include "FS.h"', '#include "FS.h"');
    
    // 创建SPI对象
    generator.addObject('SPIClass spi = SPIClass(FSPI);', 'SPIClass spi = SPIClass(FSPI);');
    
    // 在setup中添加SD卡初始化代码
    const initCode = `
    // 初始化SPI总线
    spi.begin(3, 35, 14, 46);  // SCK, MISO, MOSI, CS
    
    // 初始化SD卡
    if (!SD.begin(46, spi)) {
        Serial.println("❌ 无法挂载 SD 卡！");
        return;
    }
    Serial.println("✅ SD 卡已挂载！");`;
    
    generator.addSetup('sd_init', initCode);
    
    return '';
};

// 修改 esp32_i2s_init 函数，移除SD相关库（避免重复）
Arduino.forBlock['esp32_i2s_init'] = function(block, generator) {
    const bclkPin = '41';
    const wsPin = '42';
    const dinPin = '2';
    
    generator.addLibrary('#include "Esp_I2S.h"', '#include "Esp_I2S.h"');
    generator.addObject(`EspI2S microphone(${bclkPin}, ${wsPin}, ${dinPin});`, `EspI2S microphone(${bclkPin}, ${wsPin}, ${dinPin});`);
    
    return '';
};

Arduino.forBlock['esp32_i2s_begin'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    const sampleRate = block.getFieldValue('SAMPLE_RATE');
    const bufferSize = block.getFieldValue('BUFFER_SIZE');
    
    generator.addLibrary('#include "Esp_I2S.h"', '#include "Esp_I2S.h"');
    
    return `${objectName}.begin(${sampleRate}, ${bufferSize});\n`;
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
    // 麦克风引脚配置（固定）
    const micBclkPin = '41';
    const micWsPin = '42';
    const micDinPin = '2';
    
    // 功放引脚配置（固定）
    const speakerBclkPin = '39';
    const speakerWsPin = '40';
    const speakerDinPin = '38';
    
    // 添加必要的库文件
    generator.addLibrary('#include "Esp_I2S.h"', '#include "Esp_I2S.h"');
    
    // 创建EspI2S对象（固定使用麦克风引脚）
    generator.addObject(`EspI2S microphone(${micBclkPin}, ${micWsPin}, ${micDinPin});`, `EspI2S microphone(${micBclkPin}, ${micWsPin}, ${micDinPin});`);
    
    // 在setup中添加功放初始化代码
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

(function() {
  var K10_SDK_MELODIES = {
    DADADADUM: true,
    ENTERTAINER: true,
    PRELUDE: true,
    ODE: true,
    NYAN: true,
    RINGTONE: true,
    FUNK: true,
    BLUES: true,
    BIRTHDAY: true,
    WEDDING: true,
    FUNERAL: true,
    PUNCHLINE: true,
    BADDY: true,
    CHASE: true,
    BA_DING: true,
    WAWAWAWAA: true,
    JUMP_UP: true,
    JUMP_DOWN: true,
    POWER_UP: true,
    POWER_DOWN: true
  };

  var K10_LEGACY_MELODIES = {
    birthday: 'BIRTHDAY',
    odeTojoy: 'ODE',
    littlestar: 'AILY_LITTLE_STAR',
    jinglebells: 'AILY_JINGLE_BELLS'
  };

  function ensureK10(generator) {
    generator.addLibrary('SPIFFS', '#include <SPIFFS.h>');
    generator.addLibrary('unihiker_k10', '#include <unihiker_k10.h>');
    generator.addVariable('k10', 'UNIHIKER_K10 k10;');
    generator.addSetupBegin('k10_begin', 'k10.begin();');
  }

  function ensureMusic(generator) {
    ensureK10(generator);
    generator.addVariable('music', 'Music music;');
  }

  function ensureTFCard(generator) {
    ensureMusic(generator);
    generator.addSetupBegin('k10_initSDFile', 'k10.initSDFile();');
  }

  function normalizeMelody(value) {
    var normalized = K10_LEGACY_MELODIES[value] || value;
    if (K10_SDK_MELODIES[normalized] || normalized === 'AILY_LITTLE_STAR' || normalized === 'AILY_JINGLE_BELLS') {
      return normalized;
    }
    return 'BIRTHDAY';
  }

  function ensureGeneratedMelody(generator, melody) {
    if (melody === 'AILY_LITTLE_STAR') {
      generator.addFunction('k10_music_little_star', [
        'void k10MusicPlayLittleStar() {',
        '  const uint16_t notes[][2] = {',
        '    {262, 4000}, {262, 4000}, {392, 4000}, {392, 4000}, {440, 4000}, {440, 4000}, {392, 8000},',
        '    {349, 4000}, {349, 4000}, {330, 4000}, {330, 4000}, {294, 4000}, {294, 4000}, {262, 8000},',
        '    {392, 4000}, {392, 4000}, {349, 4000}, {349, 4000}, {330, 4000}, {330, 4000}, {294, 8000},',
        '    {392, 4000}, {392, 4000}, {349, 4000}, {349, 4000}, {330, 4000}, {330, 4000}, {294, 8000},',
        '    {262, 4000}, {262, 4000}, {392, 4000}, {392, 4000}, {440, 4000}, {440, 4000}, {392, 8000},',
        '    {349, 4000}, {349, 4000}, {330, 4000}, {330, 4000}, {294, 4000}, {294, 4000}, {262, 8000}',
        '  };',
        '  for (size_t i = 0; i < sizeof(notes) / sizeof(notes[0]); ++i) {',
        '    music.playTone(notes[i][0], notes[i][1]);',
        '    delay(40);',
        '  }',
        '}'
      ].join('\n'));
      return 'k10MusicPlayLittleStar();\n';
    }

    generator.addFunction('k10_music_jingle_bells', [
      'void k10MusicPlayJingleBells() {',
      '  const uint16_t notes[][2] = {',
      '    {330, 4000}, {330, 4000}, {330, 8000}, {330, 4000}, {330, 4000}, {330, 8000},',
      '    {330, 4000}, {392, 4000}, {262, 6000}, {294, 2000}, {330, 12000},',
      '    {349, 4000}, {349, 4000}, {349, 6000}, {349, 2000}, {349, 4000}, {330, 4000},',
      '    {330, 4000}, {330, 2000}, {330, 2000}, {294, 4000}, {294, 4000}, {330, 4000}, {294, 8000}, {392, 8000}',
      '  };',
      '  for (size_t i = 0; i < sizeof(notes) / sizeof(notes[0]); ++i) {',
      '    music.playTone(notes[i][0], notes[i][1]);',
      '    delay(40);',
      '  }',
      '}'
    ].join('\n'));
    return 'k10MusicPlayJingleBells();\n';
  }

  Arduino.forBlock['k10_music_play_builtin'] = function(block, generator) {
    var melody = normalizeMelody(block.getFieldValue('MUSIC') || 'BIRTHDAY');
    ensureMusic(generator);
    if (melody === 'AILY_LITTLE_STAR' || melody === 'AILY_JINGLE_BELLS') {
      return ensureGeneratedMelody(generator, melody);
    }
    return 'music.playMusic(' + melody + ');\n';
  };

  Arduino.forBlock['k10_music_stop_builtin'] = function(block, generator) {
    ensureMusic(generator);
    return 'music.stopPlayTone();\n';
  };

  Arduino.forBlock['k10_music_play_tone'] = function(block, generator) {
    var freq = generator.valueToCode(block, 'FREQ', generator.ORDER_ATOMIC) || '131';
    var duration = generator.valueToCode(block, 'DURATION', generator.ORDER_ATOMIC) || '8000';
    ensureMusic(generator);
    return 'music.playTone(' + freq + ', ' + duration + ');\n';
  };

  Arduino.forBlock['k10_music_record'] = function(block, generator) {
    var path = generator.valueToCode(block, 'FILENAME', generator.ORDER_ATOMIC) || '"S:/sound.wav"';
    var time = generator.valueToCode(block, 'TIME', generator.ORDER_ATOMIC) || '3';
    ensureTFCard(generator);
    return 'music.recordSaveToTFCard(' + path + ', ' + time + ');\n';
  };

  Arduino.forBlock['k10_music_play_tf'] = function(block, generator) {
    var path = generator.valueToCode(block, 'FILENAME', generator.ORDER_ATOMIC) || '"S:/sound.wav"';
    ensureTFCard(generator);
    return 'music.playTFCardAudio(' + path + ');\n';
  };

  Arduino.forBlock['k10_music_stop_tf'] = function(block, generator) {
    ensureMusic(generator);
    return 'music.stopPlayAudio();\n';
  };
})();

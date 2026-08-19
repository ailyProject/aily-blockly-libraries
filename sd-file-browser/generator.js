function addSdBrowserInfra(generator) {
  generator.addLibrary('TFT_eSPI', '#include <TFT_eSPI.h>');
  generator.addLibrary('SD', '#include <SD.h>');
  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('EpubReader', '#include <EpubReader.h>');
  generator.addLibrary('SdBrowser', '#include <SdBrowser.h>');
  generator.addMacro('SMOOTH_FONT', '#define SMOOTH_FONT');
  generator.addMacro('COV_THUMB_W', '#define COV_THUMB_W 72');
  generator.addMacro('COV_THUMB_H', '#define COV_THUMB_H 96');
  generator.addObject('sdFont', 'SdFont sdFont;');
}

Arduino.forBlock['sd_browser_open'] = function(block, generator) {
  const dir = generator.valueToCode(block, 'DIR', generator.ORDER_ATOMIC) || '"/"';
  addSdBrowserInfra(generator);
  return 'sdbr_loadDir(String(' + dir + '));\n';
};

Arduino.forBlock['sd_browser_count'] = function(block, generator) {
  addSdBrowserInfra(generator);
  return ['sdbr_entryCount', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sd_browser_is_dir'] = function(block, generator) {
  const idx = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  addSdBrowserInfra(generator);
  return ['([&]{ int _i=' + idx + '; return (_i>=0&&_i<sdbr_entryCount)?sdbr_isDir[_i]:false; })()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sd_browser_is_jpg'] = function(block, generator) {
  const idx = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  addSdBrowserInfra(generator);
  return ['([&]{ int _i=' + idx + '; if(_i<0||_i>=sdbr_entryCount||sdbr_isDir[_i]) return false; String l=sdbr_names[_i]; l.toLowerCase(); return (l.endsWith(".jpg")||l.endsWith(".jpeg")||l.endsWith(".bmp")); })()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sd_browser_is_font'] = function(block, generator) {
  const idx = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  addSdBrowserInfra(generator);
  return ['([&]{ int _i=' + idx + '; if(_i<0||_i>=sdbr_entryCount||sdbr_isDir[_i]) return false; String l=sdbr_names[_i]; l.toLowerCase(); return l.endsWith(".bin"); })()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sd_browser_name'] = function(block, generator) {
  const idx = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  addSdBrowserInfra(generator);
  return ['([&]{ int _i=' + idx + '; return (_i>=0&&_i<sdbr_entryCount)?sdbr_names[_i]:String(""); })()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sd_browser_path'] = function(block, generator) {
  const idx = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  addSdBrowserInfra(generator);
  return ['([&]{ int _i=' + idx + '; return (_i>=0&&_i<sdbr_entryCount)?sdbr_paths[_i]:String(""); })()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sd_browser_enter'] = function(block, generator) {
  const idx = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  addSdBrowserInfra(generator);
  return 'sdbr_enter(' + idx + ');\n';
};

Arduino.forBlock['sd_browser_delete_dir'] = function(block, generator) {
  const idx = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  addSdBrowserInfra(generator);
  return 'sdbr_deleteDir(' + idx + ');\n';
};

Arduino.forBlock['sd_browser_up'] = function(block, generator) {
  addSdBrowserInfra(generator);
  return 'sdbr_goUp();\n';
};

Arduino.forBlock['sd_browser_up_sel'] = function(block, generator) {
  addSdBrowserInfra(generator);
  return ['sdbr_prevSel', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sd_browser_is_root'] = function(block, generator) {
  addSdBrowserInfra(generator);
  return ['(sdbr_curDir == "/" || sdbr_curDir == "")', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sd_browser_curdir'] = function(block, generator) {
  addSdBrowserInfra(generator);
  return ['sdbr_curDir', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sd_browser_show'] = function(block, generator) {
  const sel = generator.valueToCode(block, 'SEL', generator.ORDER_ATOMIC) || '0';
  addSdBrowserInfra(generator);
  return 'sdbr_show(' + sel + ');\n';
};

Arduino.forBlock['sd_browser_load_font'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/fonts/cjk.bin"';
  addSdBrowserInfra(generator);
  return 'sdFont.load(' + path + ');\n';
};

Arduino.forBlock['sd_browser_unload_font'] = function(block, generator) {
  addSdBrowserInfra(generator);
  return 'sdFont.unload();\n';
};

Arduino.forBlock['sd_browser_font_loaded'] = function(block, generator) {
  addSdBrowserInfra(generator);
  return ['sdFont.isLoaded()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sd_browser_font_height'] = function(block, generator) {
  addSdBrowserInfra(generator);
  return ['(sdFont.isLoaded() ? sdFont.getCharHeight() : tft.fontHeight())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sd_browser_font_width'] = function(block, generator) {
  addSdBrowserInfra(generator);
  return ['(sdFont.isLoaded() ? sdFont.getCharWidth() : 16)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sd_browser_load_ui_font'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/fonts/ui.bin"';
  addSdBrowserInfra(generator);
  generator.addObject('uiFont', 'SdFont uiFont;');
  generator.addObject('uiFontShared', 'bool uiFontShared = false;');
  return 'uiFontShared = false; uiFont.load(' + path + ');\n';
};

Arduino.forBlock['sd_browser_unload_ui_font'] = function(block, generator) {
  addSdBrowserInfra(generator);
  generator.addObject('uiFont', 'SdFont uiFont;');
  generator.addObject('uiFontShared', 'bool uiFontShared = false;');
  return 'uiFontShared = false; uiFont.unload();\n';
};

Arduino.forBlock['sd_browser_ui_font_loaded'] = function(block, generator) {
  addSdBrowserInfra(generator);
  generator.addObject('uiFont', 'SdFont uiFont;');
  generator.addObject('uiFontShared', 'bool uiFontShared = false;');
  return ['(uiFontShared ? sdFont.isLoaded() : uiFont.isLoaded())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sd_browser_share_font'] = function(block, generator) {
  addSdBrowserInfra(generator);
  generator.addObject('uiFont', 'SdFont uiFont;');
  generator.addObject('uiFontShared', 'bool uiFontShared = false;');
  return 'uiFontShared = true;\n';
};

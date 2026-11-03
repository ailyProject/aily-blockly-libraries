// A single native USB OTG controller is shared by all camera blocks.
Arduino.esp32UsbCameraEnsure = function(generator) {
  generator.addLibrary('AilyUsbCamera', '#include <AilyUsbCamera.h>');
};

Arduino.forBlock['esp32_usb_camera_init'] = function(block, generator) {
  Arduino.esp32UsbCameraEnsure(generator);
  const resolution = new Map([['160x120', [160, 120]], ['320x240', [320, 240]], ['640x480', [640, 480]]]).get(block.getFieldValue('RESOLUTION')) || [320, 240];
  const selectedFps = block.getFieldValue('FPS');
  const fps = ['5', '10', '15', '30'].includes(selectedFps) ? selectedFps : '15';
  const rawPin = block.getFieldValue('VBUS_PIN');
  const selectedPin = typeof rawPin === 'number' || (typeof rawPin === 'string' && rawPin.trim() !== '') ? Number(rawPin) : NaN;
  const pin = Number.isInteger(selectedPin) && selectedPin >= -1 && selectedPin <= 48 ? selectedPin : -1;
  const activeHigh = block.getFieldValue('ACTIVE_HIGH') === 'false' ? 'false' : 'true';
  return 'UsbCamera.begin(' + resolution[0] + ', ' + resolution[1] + ', ' + fps + ', ' + pin + ', ' + activeHigh + ');\n';
};

Arduino.forBlock['esp32_usb_camera_capture'] = function(block, generator) {
  Arduino.esp32UsbCameraEnsure(generator);
  generator.addFunction('ailyUsbCameraTimeout', 'static uint32_t ailyUsbCameraTimeout(double value) {\n  if (!(value > 0)) return 0;\n  return value > 60000 ? 60000 : (uint32_t)value;\n}');
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_NONE) || '1000';
  return ['UsbCamera.capture(ailyUsbCameraTimeout((double)(' + timeout + ')))', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_usb_camera_frame_info'] = function(block, generator) {
  Arduino.esp32UsbCameraEnsure(generator);
  const property = block.getFieldValue('PROPERTY');
  const method = ['frameSize', 'frameWidth', 'frameHeight', 'frameCount'].includes(property) ? property : 'frameSize';
  return ['UsbCamera.' + method + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_usb_camera_is_connected'] = function(block, generator) {
  Arduino.esp32UsbCameraEnsure(generator);
  return ['UsbCamera.isConnected()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_usb_camera_last_error'] = function(block, generator) {
  Arduino.esp32UsbCameraEnsure(generator);
  return ['UsbCamera.lastError()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_usb_camera_save'] = function(block, generator) {
  Arduino.esp32UsbCameraEnsure(generator);
  const selectedFs = block.getFieldValue('FS');
  const fileSystem = ['SD', 'SD_MMC', 'LittleFS', 'SPIFFS', 'FFat'].includes(selectedFs) ? selectedFs : 'SD';
  generator.addLibrary(fileSystem, '#include <' + fileSystem + '.h>');
  const filename = generator.valueToCode(block, 'PATH', generator.ORDER_NONE) || '"/capture.jpg"';
  return ['UsbCamera.saveFrame(' + fileSystem + ', String(' + filename + ').c_str())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_usb_camera_server_start'] = function(block, generator) {
  Arduino.esp32UsbCameraEnsure(generator);
  generator.addFunction('ailyUsbCameraPort', 'static uint16_t ailyUsbCameraPort(double value) {\n  return value >= 1 && value <= 65535 ? (uint16_t)value : 80;\n}');
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_NONE) || '80';
  return 'UsbCamera.startServer(ailyUsbCameraPort((double)(' + port + ')));\n';
};

Arduino.forBlock['esp32_usb_camera_server_url'] = function(block, generator) {
  Arduino.esp32UsbCameraEnsure(generator);
  return ['UsbCamera.serverUrl()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_usb_camera_release'] = function(block, generator) {
  Arduino.esp32UsbCameraEnsure(generator);
  return 'UsbCamera.releaseFrame();\n';
};

Arduino.forBlock['esp32_usb_camera_server_stop'] = function(block, generator) {
  Arduino.esp32UsbCameraEnsure(generator);
  return 'UsbCamera.stopServer();\n';
};

Arduino.forBlock['esp32_usb_camera_end'] = function(block, generator) {
  Arduino.esp32UsbCameraEnsure(generator);
  return 'UsbCamera.end();\n';
};

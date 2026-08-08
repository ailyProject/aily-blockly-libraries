'use strict';

Arduino.ensureRobotLiteSupport = function(generator) {
  generator.addLibrary('robot_lite_ldo', '#include <esp32-hal-ldo.h>');
  generator.addLibrary('robot_lite_hosted', '#include <esp32-hal-hosted.h>');

  generator.addObject('robot_lite_state', `static ldo_channel_handle_t g_robot_lite_vo1 = nullptr;
static ldo_channel_handle_t g_robot_lite_vo2 = nullptr;
static ldo_channel_handle_t g_robot_lite_vo3 = nullptr;
static ldo_channel_handle_t g_robot_lite_vo4 = nullptr;
static bool g_robot_lite_ready = false;`);

  generator.addFunction('robot_lite_acquire_ldo', `static bool ailyRobotLiteAcquireLdo(uint8_t channel, int voltageMv, ldo_channel_handle_t &handle) {
  if (handle != nullptr) {
    return true;
  }
  return ldoAcquireChannel(channel, voltageMv, false, &handle) == ESP_OK;
}`);

  generator.addFunction('robot_lite_begin', `static bool ailyRobotLiteBegin() {
  if (g_robot_lite_ready) {
    return true;
  }

  if (!ailyRobotLiteAcquireLdo(1, 3300, g_robot_lite_vo1) ||
      !ailyRobotLiteAcquireLdo(2, 1800, g_robot_lite_vo2) ||
      !ailyRobotLiteAcquireLdo(3, 2500, g_robot_lite_vo3)) {
    return false;
  }

  if (g_robot_lite_vo4 == nullptr) {
    ldoDriverClaimChannel(4, "ESP32P4 Robot-Lite");
    if (!ailyRobotLiteAcquireLdo(4, 3300, g_robot_lite_vo4)) {
      ldoDriverReleaseChannel(4);
      return false;
    }
  }

  if (!hostedSetPins(47, 48, 46, 45, 44, 43, 42)) {
    return false;
  }

  g_robot_lite_ready = true;
  return true;
}`);

  generator.addSetupBegin('robot_lite_setup', '  ailyRobotLiteBegin();');
};

Arduino.forBlock['esp32p4_robot_lite_begin'] = function(block, generator) {
  Arduino.ensureRobotLiteSupport(generator);
  return '';
};

Arduino.forBlock['esp32p4_robot_lite_wifi_connect'] = function(block, generator) {
  Arduino.ensureRobotLiteSupport(generator);
  generator.addLibrary('robot_lite_wifi', '#include <WiFi.h>');
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  return `if (ailyRobotLiteBegin()) {
  WiFi.mode(WIFI_STA);
  WiFi.begin(String(${ssid}).c_str(), String(${password}).c_str());
}
`;
};

Arduino.forBlock['esp32p4_robot_lite_wifi_connected'] = function(block, generator) {
  Arduino.ensureRobotLiteSupport(generator);
  generator.addLibrary('robot_lite_wifi', '#include <WiFi.h>');
  return ['WiFi.status() == WL_CONNECTED', generator.ORDER_EQUALITY];
};

Arduino.forBlock['esp32p4_robot_lite_ble_init'] = function(block, generator) {
  Arduino.ensureRobotLiteSupport(generator);
  generator.addLibrary('robot_lite_ble', '#include <BLEDevice.h>');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '"Robot-Lite"';
  return `if (ailyRobotLiteBegin()) {
  BLEDevice::init(String(${name}).c_str());
}
`;
};

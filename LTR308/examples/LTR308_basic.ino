/*
  LTR308光照传感器基础示例
  
  此示例演示如何使用LTR308光照传感器读取光照强度
  适用于掌控板3.0等ESP32开发板
  
  硬件连接:
  - VCC: 3.3V
  - GND: GND
  - SDA: GPIO44 (掌控板3.0)
  - SCL: GPIO43 (掌控板3.0)
*/

#include <Wire.h>
#include <LTR308.h>

LTR308 lightSensor;

void setup() {
  Serial.begin(9600);
  
  // 初始化I2C (掌控板3.0的I2C引脚)
  Wire.begin(44, 43);
  
  Serial.println("LTR308光照传感器测试");
  
  // 初始化传感器
  if (lightSensor.begin()) {
    Serial.println("LTR308传感器初始化成功!");
    
    // 设置传感器参数
    lightSensor.setGain(LTR308_GAIN_1);                    // 1x增益
    lightSensor.setIntegrationTime(LTR308_INTEGRATION_100MS); // 100ms积分时间
    lightSensor.setMeasurementRate(LTR308_RATE_500MS);        // 500ms测量间隔
    
    Serial.println("传感器配置完成");
    Serial.println("Part ID: 0x" + String(lightSensor.getPartID(), HEX));
  } else {
    Serial.println("LTR308传感器初始化失败!");
    Serial.println("请检查接线和I2C地址");
    while(1);
  }
}

void loop() {
  // 检查数据是否准备好
  if (lightSensor.isDataReady()) {
    // 读取光照强度
    float lux = lightSensor.getLux();
    uint32_t rawData = lightSensor.getRawData();
    
    Serial.print("光照强度: ");
    Serial.print(lux);
    Serial.print(" lux, 原始数据: ");
    Serial.println(rawData);
  } else {
    Serial.println("等待数据准备...");
  }
  
  delay(1000);
}
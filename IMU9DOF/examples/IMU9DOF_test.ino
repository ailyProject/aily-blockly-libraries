/*
  9轴IMU传感器测试示例 - 用于验证代码修正
  
  此示例用于测试修正后的QMI8658A和MMC5603NJ传感器代码
  适用于掌控板3.0等ESP32开发板
  
  修正内容：
  1. QMI8658A I2C地址修正为0x6B (根据官方库)
  2. 放宽了设备ID检查，避免因ID变化导致初始化失败
  3. MMC5603NJ保持0x30地址，确认20位数据读取格式
  4. 比例因子确认为0.00625 μT/LSB
*/

#include <Wire.h>
#include "QMI8658A.h"
#include "MMC5603NJ.h"
#include "IMU9DOF.h"

IMU9DOF imu;

void setup() {
  Serial.begin(115200);
  Serial.println("=== 9轴IMU传感器测试 (修正版) ===");
  
  // 初始化I2C (掌控板3.0的I2C引脚)
  Wire.begin(44, 43);
  
  // 测试单独的传感器
  Serial.println("测试QMI8658A六轴传感器...");
  QMI8658A accGyro;
  if (accGyro.begin(&Wire)) {
    Serial.println("✓ QMI8658A初始化成功");
    Serial.print("设备ID: 0x");
    Serial.println(accGyro.getDeviceID(), HEX);
  } else {
    Serial.println("✗ QMI8658A初始化失败");
  }
  
  Serial.println("测试MMC5603NJ磁力传感器...");
  MMC5603NJ mag;
  if (mag.begin(&Wire)) {
    Serial.println("✓ MMC5603NJ初始化成功");
    Serial.print("设备ID: 0x");
    Serial.println(mag.getDeviceID(), HEX);
  } else {
    Serial.println("✗ MMC5603NJ初始化失败");
  }
  
  // 测试集成的IMU
  Serial.println("测试集成IMU...");
  if (imu.begin(&Wire)) {
    Serial.println("✓ IMU9DOF初始化成功!");
    
    // 设置传感器参数
    imu.setAccRange(QMI8658A_ACC_RANGE_8G);
    imu.setGyroRange(QMI8658A_GYRO_RANGE_2048DPS);
    
    Serial.println("开始数据测试...");
  } else {
    Serial.println("✗ IMU9DOF初始化失败!");
    Serial.println("请检查硬件连接和I2C地址");
    while(1) {
      delay(1000);
    }
  }
}

void loop() {
  float ax, ay, az;
  float gx, gy, gz;
  float mx, my, mz;
  float temp;
  
  // 读取传感器数据
  imu.readAccel(&ax, &ay, &az);
  imu.readGyro(&gx, &gy, &gz);
  imu.readMag(&mx, &my, &mz);
  temp = imu.readTemperature();
  
  // 计算姿态角
  imu.computeAngles();
  
  // 打印数据
  Serial.println("==========================================");
  Serial.println("加速度计 (g):");
  Serial.printf("  X: %8.3f  Y: %8.3f  Z: %8.3f\n", ax, ay, az);
  
  Serial.println("陀螺仪 (°/s):");
  Serial.printf("  X: %8.3f  Y: %8.3f  Z: %8.3f\n", gx, gy, gz);
  
  Serial.println("磁力计 (μT):");
  Serial.printf("  X: %8.3f  Y: %8.3f  Z: %8.3f\n", mx, my, mz);
  
  Serial.printf("温度: %.2f °C\n", temp);
  
  Serial.println("姿态角 (°):");
  Serial.printf("  横滚: %7.2f  俯仰: %7.2f  航向: %7.2f\n", 
                imu.getRoll(), imu.getPitch(), imu.getYaw());
  
  // 数据合理性检查
  Serial.println("数据检查:");
  if (abs(ax) < 0.1 && abs(ay) < 0.1 && abs(az) < 0.1) {
    Serial.println("  ⚠️  加速度计数据异常 - 可能未正确初始化");
  } else {
    Serial.println("  ✓ 加速度计数据正常");
  }
  
  if (abs(mx) < 1.0 && abs(my) < 1.0 && abs(mz) < 1.0) {
    Serial.println("  ⚠️  磁力计数据异常 - 可能需要校准或地址错误");
  } else {
    Serial.println("  ✓ 磁力计数据正常");
  }
  
  delay(1000);
}
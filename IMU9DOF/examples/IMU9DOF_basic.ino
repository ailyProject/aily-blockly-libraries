/*
  9轴IMU传感器基础示例
  
  此示例演示如何使用9轴IMU传感器读取加速度、角速度、磁场强度和姿态角
  适用于掌控板3.0等ESP32开发板
  
  硬件连接:
  - 掌控板3.0已内置IMU传感器，无需额外连接
  - QMI8658A (I2C地址: 0x6B)
    - SDA: GPIO44
    - SCL: GPIO43
  - MMC5603NJ (I2C地址: 0x30)
    - SDA: GPIO44
    - SCL: GPIO43
*/

#include <Wire.h>
#include "QMI8658A.h"
#include "MMC5603NJ.h"
#include "IMU9DOF.h"

IMU9DOF imu;

void setup() {
  Serial.begin(115200);
  Serial.println("9轴IMU传感器测试");
  
  // 初始化I2C (掌控板3.0的I2C引脚)
  Wire.begin(44, 43);
  
  // 初始化传感器
  if (imu.begin()) {
    Serial.println("IMU传感器初始化成功!");
    
    // 设置传感器参数
    imu.setAccRange(QMI8658A_ACC_RANGE_8G);
    imu.setGyroRange(QMI8658A_GYRO_RANGE_2048DPS);
    
    // 校准磁力计
    Serial.println("开始校准磁力计，请在10秒内绕各个轴旋转设备...");
    imu.calibrateMag();
    Serial.println("磁力计校准完成");
  } else {
    Serial.println("IMU传感器初始化失败!");
    Serial.println("请检查接线和I2C地址");
    while(1);
  }
}

void loop() {
  float ax, ay, az;
  float gx, gy, gz;
  float mx, my, mz;
  float temp;
  
  // 读取加速度计数据
  imu.readAccel(&ax, &ay, &az);
  
  // 读取陀螺仪数据
  imu.readGyro(&gx, &gy, &gz);
  
  // 读取磁力计数据
  imu.readMag(&mx, &my, &mz);
  
  // 读取温度
  temp = imu.readTemperature();
  
  // 计算姿态角
  imu.computeAngles();
  
  // 打印传感器数据
  Serial.println("------------------------------");
  Serial.println("加速度计 (g):");
  Serial.print("X: "); Serial.print(ax);
  Serial.print(" Y: "); Serial.print(ay);
  Serial.print(" Z: "); Serial.println(az);
  
  Serial.println("陀螺仪 (°/s):");
  Serial.print("X: "); Serial.print(gx);
  Serial.print(" Y: "); Serial.print(gy);
  Serial.print(" Z: "); Serial.println(gz);
  
  Serial.println("磁力计 (μT):");
  Serial.print("X: "); Serial.print(mx);
  Serial.print(" Y: "); Serial.print(my);
  Serial.print(" Z: "); Serial.println(mz);
  
  Serial.print("温度: "); Serial.print(temp); Serial.println(" °C");
  
  Serial.println("姿态角 (°):");
  Serial.print("横滚角: "); Serial.print(imu.getRoll());
  Serial.print(" 俯仰角: "); Serial.print(imu.getPitch());
  Serial.print(" 航向角: "); Serial.println(imu.getYaw());
  
  delay(500);
}
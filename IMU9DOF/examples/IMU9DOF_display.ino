/*
  9轴IMU传感器显示示例
  
  此示例演示如何在掌控板3.0的屏幕上显示IMU传感器数据
  适用于掌控板3.0等ESP32开发板
  
  硬件连接:
  - 掌控板3.0已内置IMU传感器和显示屏，无需额外连接
*/

#include <Wire.h>
#include <SPI.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ST7789.h>
#include "QMI8658A.h"
#include "MMC5603NJ.h"
#include "IMU9DOF.h"

// 掌控板3.0显示屏引脚定义
#define TFT_CS    39
#define TFT_DC    42
#define TFT_RST   37
#define TFT_MOSI  41
#define TFT_SCLK  13

// 创建显示屏对象
Adafruit_ST7789 tft = Adafruit_ST7789(TFT_CS, TFT_DC, TFT_MOSI, TFT_SCLK, TFT_RST);

// 创建IMU对象
IMU9DOF imu;

void setup() {
  Serial.begin(115200);
  
  // 初始化I2C (掌控板3.0的I2C引脚)
  Wire.begin(44, 43);
  
  // 初始化显示屏
  tft.init(320, 172);
  tft.setRotation(0);
  tft.fillScreen(ST77XX_BLACK);
  tft.setTextColor(ST77XX_WHITE);
  tft.setTextSize(2);
  tft.setCursor(0, 0);
  tft.println("IMU 9DOF Sensor");
  tft.println("Initializing...");
  
  // 初始化传感器
  if (imu.begin()) {
    tft.println("IMU initialized!");
    
    // 设置传感器参数
    imu.setAccRange(QMI8658A_ACC_RANGE_8G);
    imu.setGyroRange(QMI8658A_GYRO_RANGE_2048DPS);
    
    // 校准磁力计
    tft.println("Calibrating...");
    tft.println("Rotate device in all");
    tft.println("directions for 10s");
    imu.calibrateMag();
    tft.println("Calibration done!");
    delay(1000);
  } else {
    tft.println("IMU init failed!");
    tft.println("Check connections");
    while(1);
  }
}

void loop() {
  float ax, ay, az;
  float gx, gy, gz;
  float mx, my, mz;
  
  // 读取传感器数据
  imu.readAccel(&ax, &ay, &az);
  imu.readGyro(&gx, &gy, &gz);
  imu.readMag(&mx, &my, &mz);
  
  // 计算姿态角
  imu.computeAngles();
  
  // 清屏并显示数据
  tft.fillScreen(ST77XX_BLACK);
  tft.setCursor(0, 0);
  tft.setTextSize(2);
  
  // 显示标题
  tft.setTextColor(ST77XX_CYAN);
  tft.println("IMU 9DOF Sensor");
  tft.setTextColor(ST77XX_WHITE);
  
  // 显示姿态角
  tft.setTextColor(ST77XX_GREEN);
  tft.println("Attitude:");
  tft.setTextColor(ST77XX_WHITE);
  tft.print("Roll : "); tft.print(imu.getRoll(), 1); tft.println(" deg");
  tft.print("Pitch: "); tft.print(imu.getPitch(), 1); tft.println(" deg");
  tft.print("Yaw  : "); tft.print(imu.getYaw(), 1); tft.println(" deg");
  
  // 显示加速度
  tft.setTextColor(ST77XX_YELLOW);
  tft.println("Accel (g):");
  tft.setTextColor(ST77XX_WHITE);
  tft.print("X:"); tft.print(ax, 2);
  tft.print(" Y:"); tft.print(ay, 2);
  tft.print(" Z:"); tft.println(az, 2);
  
  // 显示温度
  tft.setTextColor(ST77XX_MAGENTA);
  tft.print("Temp: "); tft.print(imu.readTemperature(), 1); tft.println(" C");
  
  delay(100);
}
/*!
 * @file DFRobot_AXP313A.h
 * @brief 这是AXP313A的方法说明文件
 * @copyright   Copyright (c) 2010 DFRobot Co.Ltd (http://www.dfrobot.com)
 * @license     The MIT License (MIT)
 * @author [TangJie](jie.tang@dfrobot.com)
 * @version  V1.0
 * @date  2022-05-17
 * @url https://github.com/DFRobor/DFRobot_AXP313A
 */

#ifndef DFROBOT_AXP313A_H
#define DFROBOT_AXP313A_H

#include "Arduino.h"
#include "Wire.h"

class DFRobot_AXP313A{
public:
  /**
   * @enum eShutdownKeyLevelTime_t
   * @brief 选择关机电平时间
   */
  typedef enum{
    eTime6s,
    eTime10s
  }eShutdownKeyLevelTime_t;

  /**
   * @enum eCamera_t
   * @brief 选择关机电平时间
   */
  typedef enum{
    eOV2640,//1.2,2.8
    e0V7725//1.8,3.3
  }eCamera_t;

  /**
   * @fn DFRobot_AXP313A
   * @brief DFRobot_AXP313A constructor
   * @param pWire I2C pointer to the TowWire stream, which requires calling begin in the demo to init Arduino I2C config.
   * @param addr  I2C communication address of SEN0500/SEN0501 device
   */
  DFRobot_AXP313A(uint8_t addr=0x36, TwoWire *pWire = &Wire);

  /**
   * @fn begin
   * @brief 初始化传感器
   * @return 返回初始化状态
   * @retval 0 初始化成功
   * @retval 1 初始化失败
   */
  uint8_t begin(void);

  /**
   * @fn enableCameraPower
   * @brief 使能摄像头电源
   * @param camera 摄像头选择
   * @return NONE
   */
  void enableCameraPower(eCamera_t camera);

  /**
   * @fn disablePower
   * @brief 关闭摄像头电源
   * @return NONE
   */
  void disablePower(void);

  /**
   * @fn setShutdownKeyLevelTime
   * @brief 设置关机按键电平时间
   * @param offLevelTime 关机按键电平时间
   * @return NONE
   */
  void setShutdownKeyLevelTime(eShutdownKeyLevelTime_t offLevelTime);

private:
  /**
   * @fn writeReg
   * @brief   Write register value through IIC bus
   * @param reg  Register address 8bits
   * @param pBuf Storage cache to write data in
   * @param size The length of data to be written
   */
  void writeReg(uint8_t reg, void *pBuf, size_t size);

  /**
   * @fn enablePower
   * @brief 使能电源输出
   * @param DVDD DVDD电压设置,默认电压为1.5V
   * @param AVDDandDOVDD AVDD和DOVDD电压设置，默认电压为2.8V
   * @return NONE
   */
  void setCameraPower(float DVDD = 1.5,float AVDDorDOVDD = 2.8);

  TwoWire *_pWire;
	uint8_t _addr;
};



#endif
/*!
 *  @file Adafruit_MPU6050.h
 *
 * 	I2C Driver for MPU6050 6-DoF Accelerometer and Gyro
 *
 * 	This is a library for the Adafruit MPU6050 breakout:
 * 	https://www.adafruit.com/products/3886
 *
 * 	Adafruit invests time and resources providing this open source code,
 *  please support Adafruit and open-source hardware by purchasing products from
 * 	Adafruit!
 *
 *
 *	BSD license (see license.txt)
 */

#ifndef _ADAFRUIT_MPU6050_H
#define _ADAFRUIT_MPU6050_H

#include "Arduino.h"
#include <Adafruit_BusIO_Register.h>
#include <Adafruit_I2CDevice.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

#define MPU6050_I2CADDR_DEFAULT                                                \
  0x68                         ///< MPU6050 default i2c address w/ AD0 high
#define MPU6050_DEVICE_ID 0x68 ///< The correct MPU6050_WHO_AM_I value

#define MPU6050_SELF_TEST_X                                                    \
  0x0D ///< Self test factory calibrated values register
#define MPU6050_SELF_TEST_Y                                                    \
  0x0E ///< Self test factory calibrated values register
#define MPU6050_SELF_TEST_Z                                                    \
  0x0F ///< Self test factory calibrated values register
#define MPU6050_SELF_TEST_A                                                    \
  0x10 ///< Self test factory calibrated values register
#define MPU6050_SMPLRT_DIV 0x19  ///< sample rate divisor register
#define MPU6050_CONFIG 0x1A      ///< General configuration register
#define MPU6050_GYRO_CONFIG 0x1B ///< Gyro specfic configuration register
#define MPU6050_ACCEL_CONFIG                                                   \
  0x1C ///< Accelerometer specific configration register
#define MPU6050_INT_PIN_CONFIG 0x37 ///< Interrupt pin configuration register
#define MPU6050_INT_ENABLE 0x38     ///< Interrupt enable configuration register
#define MPU6050_INT_STATUS 0x3A     ///< Interrupt status register
#define MPU6050_WHO_AM_I 0x75       ///< Divice ID register
#define MPU6050_SIGNAL_PATH_RESET 0x68 ///< Signal path reset register
#define MPU6050_USER_CTRL 0x6A         ///< FIFO and I2C Master control register
#define MPU6050_PWR_MGMT_1 0x6B        ///< Primary power/sleep control register
#define MPU6050_PWR_MGMT_2 0x6C ///< Secondary power/sleep control register
#define MPU6050_TEMP_H 0x41     ///< Temperature data high byte register
#define MPU6050_TEMP_L 0x42     ///< Temperature data low byte register
#define MPU6050_ACCEL_OUT 0x3B  ///< base address for sensor data reads
#define MPU6050_MOT_THR 0x1F    ///< Motion detection threshold bits [7:0]
#define MPU6050_MOT_DUR                                                        \
  0x20 ///< Duration counter threshold for motion int. 1 kHz rate, LSB = 1 ms

/**
 * @brief FSYNC output values
 *
 * Allowed values for `setFsyncSampleOutput`.
 */
typedef enum fsync_out {
  MPU6050_FSYNC_OUT_DISABLED,
  MPU6050_FSYNC_OUT_TEMP,
  MPU6050_FSYNC_OUT_GYROX,
  MPU6050_FSYNC_OUT_GYROY,
  MPU6050_FSYNC_OUT_GYROZ,
  MPU6050_FSYNC_OUT_ACCELX,
  MPU6050_FSYNC_OUT_ACCELY,
  MPU6050_FSYNC_OUT_ACCEL_Z,
} mpu6050_fsync_out_t;

/**
 * @brief Clock source options
 *
 * Allowed values for `setClock`.
 */
typedef enum clock_select {
  MPU6050_INTR_8MHz,
  MPU6050_PLL_GYROX,
  MPU6050_PLL_GYROY,
  MPU6050_PLL_GYROZ,
  MPU6050_PLL_EXT_32K,
  MPU6050_PLL_EXT_19MHz,
  MPU6050_STOP = 7,
} mpu6050_clock_select_t;

/**
 * @brief Accelerometer range options
 *
 * Allowed values for `setAccelerometerRange`.
 */
typedef enum {
  MPU6050_RANGE_2_G = 0b00,  ///< +/- 2g (default value)
  MPU6050_RANGE_4_G = 0b01,  ///< +/- 4g
  MPU6050_RANGE_8_G = 0b10,  ///< +/- 8g
  MPU6050_RANGE_16_G = 0b11, ///< +/- 16g
} mpu6050_accel_range_t;

/**
 * @brief Gyroscope range options
 *
 * Allowed values for `setGyroRange`.
 */
typedef enum {
  MPU6050_RANGE_250_DEG,  ///< +/- 250 deg/s (default value)
  MPU6050_RANGE_500_DEG,  ///< +/- 500 deg/s
  MPU6050_RANGE_1000_DEG, ///< +/- 1000 deg/s
  MPU6050_RANGE_2000_DEG, ///< +/- 2000 deg/s
} mpu6050_gyro_range_t;

/**
 * @brief Digital low pass filter bandthwidth options
 *
 * Allowed values for `setFilterBandwidth`.
 */
typedef enum {
  MPU6050_BAND_260_HZ, ///< Docs imply this disables the filter
  MPU6050_BAND_184_HZ, ///< 184 Hz
  MPU6050_BAND_94_HZ,  ///< 94 Hz
  MPU6050_BAND_44_HZ,  ///< 44 Hz
  MPU6050_BAND_21_HZ,  ///< 21 Hz
  MPU6050_BAND_10_HZ,  ///< 10 Hz
  MPU6050_BAND_5_HZ,   ///< 5 Hz
} mpu6050_bandwidth_t;

/**
 * @brief Accelerometer high pass filter options
 *
 * Allowed values for `setHighPassFilter`.
 */
typedef enum {
  MPU6050_HIGHPASS_DISABLE,
  MPU6050_HIGHPASS_5_HZ,
  MPU6050_HIGHPASS_2_5_HZ,
  MPU6050_HIGHPASS_1_25_HZ,
  MPU6050_HIGHPASS_0_63_HZ,
  MPU6050_HIGHPASS_UNUSED,
  MPU6050_HIGHPASS_HOLD,
} mpu6050_highpass_t;

/**
 * @brief Periodic measurement options
 *
 * Allowed values for `setCycleRate`.
 */
typedef enum {
  MPU6050_CYCLE_1_25_HZ, ///< 1.25 Hz
  MPU6050_CYCLE_5_HZ,    ///< 5 Hz
  MPU6050_CYCLE_20_HZ,   ///< 20 Hz
  MPU6050_CYCLE_40_HZ,   ///< 40 Hz
} mpu6050_cycle_rate_t;

class Adafruit_MPU6050;

/** Adafruit Unified Sensor interface for temperature component of MPU6050 */
class Adafruit_MPU6050_Temp : public Adafruit_Sensor {
public:
  /** @brief Create an Adafruit_Sensor compatible object for the temp sensor
      @param parent A pointer to the MPU6050 class */
  Adafruit_MPU6050_Temp(Adafruit_MPU6050 *parent) { _theMPU6050 = parent; }
  bool getEvent(sensors_event_t *);
  void getSensor(sensor_t *);

private:
  int _sensorID = 0x650;
  Adafruit_MPU6050 *_theMPU6050 = NULL;
};

/** Adafruit Unified Sensor interface for accelerometer component of MPU6050 */
class Adafruit_MPU6050_Accelerometer : public Adafruit_Sensor {
public:
  /** @brief Create an Adafruit_Sensor compatible object for the accelerometer
     sensor
      @param parent A pointer to the MPU6050 class */
  Adafruit_MPU6050_Accelerometer(Adafruit_MPU6050 *parent) {
    _theMPU6050 = parent;
  }
  bool getEvent(sensors_event_t *);
  void getSensor(sensor_t *);

private:
  int _sensorID = 0x651;
  Adafruit_MPU6050 *_theMPU6050 = NULL;
};

/** Adafruit Unified Sensor interface for gyro component of MPU6050 */
class Adafruit_MPU6050_Gyro : public Adafruit_Sensor {
public:
  /** @brief Create an Adafruit_Sensor compatible object for the gyro sensor
      @param parent A pointer to the MPU6050 class */
  Adafruit_MPU6050_Gyro(Adafruit_MPU6050 *parent) { _theMPU6050 = parent; }
  bool getEvent(sensors_event_t *);
  void getSensor(sensor_t *);

private:
  int _sensorID = 0x652;
  Adafruit_MPU6050 *_theMPU6050 = NULL;
};

/*!
 *    @brief  Class that stores state and functions for interacting with
 *            the MPU6050 I2C Digital Potentiometer
 */
class Adafruit_MPU6050 final {
public:
  Adafruit_MPU6050();
  ~Adafruit_MPU6050();

  bool begin(uint8_t i2c_addr = MPU6050_I2CADDR_DEFAULT, TwoWire *wire = &Wire,
             int32_t sensorID = 0);

  // Adafruit_Sensor API/Interface
  bool getEvent(sensors_event_t *accel, sensors_event_t *gyro,
                sensors_event_t *temp);

  mpu6050_accel_range_t getAccelerometerRange(void);
  void setAccelerometerRange(mpu6050_accel_range_t);

  mpu6050_gyro_range_t getGyroRange(void);
  void setGyroRange(mpu6050_gyro_range_t);

  void setInterruptPinPolarity(bool active_low);
  void setInterruptPinLatch(bool held);
  void setFsyncSampleOutput(mpu6050_fsync_out_t fsync_output);

  mpu6050_highpass_t getHighPassFilter(void);
  void setHighPassFilter(mpu6050_highpass_t bandwidth);

  void setMotionInterrupt(bool active);
  void setMotionDetectionThreshold(uint8_t thr);
  void setMotionDetectionDuration(uint8_t dur);
  bool getMotionInterruptStatus(void);

  mpu6050_fsync_out_t getFsyncSampleOutput(void);
  void setI2CBypass(bool bypass);

  void setClock(mpu6050_clock_select_t);
  mpu6050_clock_select_t getClock(void);

  void setFilterBandwidth(mpu6050_bandwidth_t bandwidth);
  mpu6050_bandwidth_t getFilterBandwidth(void);

  void setSampleRateDivisor(uint8_t);
  uint8_t getSampleRateDivisor(void);

  bool enableSleep(bool enable);
  bool enableCycle(bool enable);

  void setCycleRate(mpu6050_cycle_rate_t rate);
  mpu6050_cycle_rate_t getCycleRate(void);

  bool setGyroStandby(bool xAxisStandby, bool yAxisStandby, bool zAxisStandby);
  bool setAccelerometerStandby(bool xAxisStandby, bool yAxisStandby,
                               bool zAxisStandby);
  bool setTemperatureStandby(bool enable);

  void reset(void);

  Adafruit_Sensor *getTemperatureSensor(void);
  Adafruit_Sensor *getAccelerometerSensor(void);
  Adafruit_Sensor *getGyroSensor(void);

private:
  void _getRawSensorData(void);
  void _scaleSensorData(void);

protected:
  float temperature, ///< Last reading's temperature (C)
      accX,          ///< Last reading's accelerometer X axis m/s^2
      accY,          ///< Last reading's accelerometer Y axis m/s^2
      accZ,          ///< Last reading's accelerometer Z axis m/s^2
      gyroX,         ///< Last reading's gyro X axis in rad/s
      gyroY,         ///< Last reading's gyro Y axis in rad/s
      gyroZ;         ///< Last reading's gyro Z axis in rad/s

  Adafruit_I2CDevice *i2c_dev = NULL; ///< Pointer to I2C bus interface

  Adafruit_MPU6050_Temp *temp_sensor = NULL; ///< Temp sensor data object
  Adafruit_MPU6050_Accelerometer *accel_sensor =
      NULL;                                  ///< Accelerometer data object
  Adafruit_MPU6050_Gyro *gyro_sensor = NULL; ///< Gyro data object

  uint16_t _sensorid_accel, ///< ID number for accelerometer
      _sensorid_gyro,       ///< ID number for gyro
      _sensorid_temp;       ///< ID number for temperature

  void _read(void);
  virtual bool _init(int32_t sensor_id);

private:
  friend class Adafruit_MPU6050_Temp; ///< Gives access to private members to
                                      ///< Temp data object
  friend class Adafruit_MPU6050_Accelerometer; ///< Gives access to private
                                               ///< members to Accelerometer
                                               ///< data object
  friend class Adafruit_MPU6050_Gyro; ///< Gives access to private members to
                                      ///< Gyro data object

  int16_t rawAccX, rawAccY, rawAccZ, rawTemp, rawGyroX, rawGyroY, rawGyroZ;

  void fillTempEvent(sensors_event_t *temp, uint32_t timestamp);
  void fillAccelEvent(sensors_event_t *accel, uint32_t timestamp);
  void fillGyroEvent(sensors_event_t *gyro, uint32_t timestamp);
};

#endif

/*!
 *  @file Adafruit_SHTC3.h
 *
 *  This is a library for the SHTC3 Digital Humidity & Temp Sensor
 *
 *  Designed specifically to work with the Digital Humidity & Temp Sensor
 *  -----> https://www.adafruit.com/product/4636
 *
 *  These sensors use I2C to communicate, 2 pins are required to interface
 *
 *  Adafruit invests time and resources providing this open source code,
 *  please support Adafruit andopen-source hardware by purchasing products
 *  from Adafruit!
 *
 *  Limor Fried/Ladyada (Adafruit Industries).
 *
 *  BSD license, all text above must be included in any redistribution
 */

#ifndef ADAFRUIT_SHTC3_H
#define ADAFRUIT_SHTC3_H

#include "Arduino.h"
#include <Adafruit_I2CDevice.h>
#include <Adafruit_Sensor.h>

#define SHTC3_DEFAULT_ADDR 0x70 /**< SHTC3 I2C Address */
#define SHTC3_NORMAL_MEAS_TFIRST_STRETCH                                       \
  0x7CA2 /**< Normal measurement, temp first with Clock Stretch Enabled */
#define SHTC3_LOWPOW_MEAS_TFIRST_STRETCH                                       \
  0x6458 /**< Low power measurement, temp first with Clock Stretch Enabled */
#define SHTC3_NORMAL_MEAS_HFIRST_STRETCH                                       \
  0x5C24 /**< Normal measurement, hum first with Clock Stretch Enabled */
#define SHTC3_LOWPOW_MEAS_HFIRST_STRETCH                                       \
  0x44DE /**< Low power measurement, hum first with Clock Stretch Enabled */

#define SHTC3_NORMAL_MEAS_TFIRST                                               \
  0x7866 /**< Normal measurement, temp first with Clock Stretch disabled */
#define SHTC3_LOWPOW_MEAS_TFIRST                                               \
  0x609C /**< Low power measurement, temp first with Clock Stretch disabled */
#define SHTC3_NORMAL_MEAS_HFIRST                                               \
  0x58E0 /**< Normal measurement, hum first with Clock Stretch disabled */
#define SHTC3_LOWPOW_MEAS_HFIRST                                               \
  0x401A /**< Low power measurement, hum first with Clock Stretch disabled */

#define SHTC3_READID 0xEFC8    /**< Read Out of ID Register */
#define SHTC3_SOFTRESET 0x805D /**< Soft Reset */
#define SHTC3_SLEEP 0xB098     /**< Enter sleep mode */
#define SHTC3_WAKEUP 0x3517    /**< Wakeup mode */

class Adafruit_SHTC3;

/**
 * @brief  Adafruit Unified Sensor interface for the humidity sensor component
 * of SHTC3
 *
 */
class Adafruit_SHTC3_Humidity : public Adafruit_Sensor {
public:
  /** @brief Create an Adafruit_Sensor compatible object for the humidity sensor
    @param parent A pointer to the SHTC3 class */
  Adafruit_SHTC3_Humidity(Adafruit_SHTC3 *parent) { _theSHTC3 = parent; }
  bool getEvent(sensors_event_t *);
  void getSensor(sensor_t *);

private:
  int _sensorID = 0x03C1;
  Adafruit_SHTC3 *_theSHTC3 = NULL;
};

/**
 * @brief Adafruit Unified Sensor interface for the temperature sensor component
 * of SHTC3
 *
 */
class Adafruit_SHTC3_Temp : public Adafruit_Sensor {
public:
  /** @brief Create an Adafruit_Sensor compatible object for the temp sensor
      @param parent A pointer to the SHTC3 class */
  Adafruit_SHTC3_Temp(Adafruit_SHTC3 *parent) { _theSHTC3 = parent; }

  bool getEvent(sensors_event_t *);
  void getSensor(sensor_t *);

private:
  int _sensorID = 0x0C30;
  Adafruit_SHTC3 *_theSHTC3 = NULL;
};

/**
 * Driver for the Adafruit SHTC3 Temperature and Humidity breakout board.
 */
class Adafruit_SHTC3 {
public:
  Adafruit_SHTC3(void);
  ~Adafruit_SHTC3(void);

  bool begin(TwoWire *theWire = &Wire);
  uint16_t readID(void);
  void reset(void);
  void sleep(bool sleepmode);
  void lowPowerMode(bool readmode);

  bool getEvent(sensors_event_t *humidity, sensors_event_t *temp);
  Adafruit_Sensor *getTemperatureSensor(void);
  Adafruit_Sensor *getHumiditySensor(void);

protected:
  float _temperature, ///< Last reading's temperature (C)
      _humidity;      ///< Last reading's humidity (percent)

  uint16_t _sensorid_humidity; ///< ID number for humidity
  uint16_t _sensorid_temp;     ///< ID number for temperature

  Adafruit_I2CDevice *i2c_dev = NULL;      ///< Pointer to I2C bus interface
  Adafruit_SHTC3_Temp *temp_sensor = NULL; ///< Temp sensor data object
  Adafruit_SHTC3_Humidity *humidity_sensor =
      NULL; ///< Humidity sensor data object

private:
  bool _lpMode = false;
  bool writeCommand(uint16_t cmd);
  bool readCommand(uint16_t command, uint8_t *buffer, uint8_t num_bytes);

  friend class Adafruit_SHTC3_Temp;     ///< Gives access to private members to
                                        ///< Temp data object
  friend class Adafruit_SHTC3_Humidity; ///< Gives access to private members to
                                        ///< Humidity data object

  void fillTempEvent(sensors_event_t *temp, uint32_t timestamp);
  void fillHumidityEvent(sensors_event_t *humidity, uint32_t timestamp);
};

#endif

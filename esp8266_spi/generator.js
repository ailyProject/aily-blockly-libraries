'use strict';

function esp8266SpiInclude(generator) { generator.addLibrary('ESP8266_SPI', '#include <SPI.h>'); }
Arduino.forBlock['esp8266_spi_begin'] = function(block, generator) { esp8266SpiInclude(generator); return 'SPI.begin();\n'; };
Arduino.forBlock['esp8266_spi_end'] = function(block, generator) { esp8266SpiInclude(generator); return 'SPI.end();\n'; };
Arduino.forBlock['esp8266_spi_pins'] = function(block, generator) { esp8266SpiInclude(generator); return ['SPI.pins(' + ['SCK','MISO','MOSI','SS'].map(n=>block.getFieldValue(n)||'0').join(', ') + ')', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_spi_hw_cs'] = function(block, generator) { esp8266SpiInclude(generator); return 'SPI.setHwCs(' + (block.getFieldValue('ENABLE') || 'false') + ');\n'; };
Arduino.forBlock['esp8266_spi_begin_transaction'] = function(block, generator) { esp8266SpiInclude(generator); const f = generator.valueToCode(block, 'FREQ', generator.ORDER_ATOMIC) || '1000000'; return 'SPI.beginTransaction(SPISettings(' + f + ', ' + (block.getFieldValue('ORDER') || 'MSBFIRST') + ', ' + (block.getFieldValue('MODE') || 'SPI_MODE0') + '));\n'; };
Arduino.forBlock['esp8266_spi_end_transaction'] = function(block, generator) { esp8266SpiInclude(generator); return 'SPI.endTransaction();\n'; };
Arduino.forBlock['esp8266_spi_transfer8'] = function(block, generator) { esp8266SpiInclude(generator); return ['SPI.transfer((uint8_t)(' + (generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '0') + '))', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_spi_transfer16'] = function(block, generator) { esp8266SpiInclude(generator); return ['SPI.transfer16((uint16_t)(' + (generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '0') + '))', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_spi_write8'] = function(block, generator) { esp8266SpiInclude(generator); return 'SPI.write((uint8_t)(' + (generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '0') + '));\n'; };
Arduino.forBlock['esp8266_spi_write16'] = function(block, generator) { esp8266SpiInclude(generator); return 'SPI.write16((uint16_t)(' + (generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '0') + '));\n'; };
Arduino.forBlock['esp8266_spi_write32'] = function(block, generator) { esp8266SpiInclude(generator); return 'SPI.write32((uint32_t)(' + (generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '0') + '));\n'; };

'use strict';

// 智能板卡适配函数
function ensureOWMLib(generator) {
  generator.addLibrary('OpenWeatherMap', '#include <OpenWeatherMap.h>');
}

// 数据结构变量管理
function ensureWeatherData(generator, varName) {
  const dataVarName = '_owm_weather_' + varName;
  generator.addVariable(dataVarName, 'OWM_CurrentWeather ' + dataVarName + ';');
  return dataVarName;
}

function ensureForecastData(generator, varName) {
  const dataVarName = '_owm_forecast_' + varName;
  generator.addVariable(dataVarName, 'OWM_Forecast ' + dataVarName + ';');
  return dataVarName;
}

function ensureAirPollutionData(generator, varName) {
  const dataVarName = '_owm_air_' + varName;
  generator.addVariable(dataVarName, 'OWM_AirPollution ' + dataVarName + ';');
  return dataVarName;
}

function ensureGeoData(generator, varName) {
  const dataVarName = '_owm_geo_' + varName;
  generator.addVariable(dataVarName, 'OWM_GeoLocation ' + dataVarName + ';');
  return dataVarName;
}

// 初始化天气服务
Arduino.forBlock['owm_init'] = function(block, generator) {
  // 变量重命名监听
  if (!block._owmVarMonitorAttached) {
    block._owmVarMonitorAttached = true;
    block._owmVarLastName = block.getFieldValue('VAR') || 'weather';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        if (block._owmVarLastName && block._owmVarLastName !== newName) {
          renameVariableInBlockly(block, block._owmVarLastName, newName, 'OpenWeatherMap');
        }
        block._owmVarLastName = newName;
        return undefined;
      });
    }
  }
  
  const varName = block.getFieldValue('VAR') || 'weather';
  const apiKey = generator.valueToCode(block, 'API_KEY', generator.ORDER_ATOMIC) || '""';
  
  ensureOWMLib(generator);
  registerVariableToBlockly(varName, 'OpenWeatherMap');
  generator.addVariable('OpenWeatherMap_' + varName, 'OpenWeatherMap ' + varName + ';');
  
  // 确保相关数据结构变量存在
  ensureWeatherData(generator, varName);
  ensureForecastData(generator, varName);
  ensureAirPollutionData(generator, varName);
  ensureGeoData(generator, varName);
  
  return varName + '.begin(' + apiKey + ');\n';
};

// 设置单位
Arduino.forBlock['owm_set_units'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'weather';
  const units = block.getFieldValue('UNITS');
  
  ensureOWMLib(generator);
  
  return varName + '.setUnits(' + units + ');\n';
};

// 设置语言
Arduino.forBlock['owm_set_language'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'weather';
  const lang = block.getFieldValue('LANG');
  
  ensureOWMLib(generator);
  
  return varName + '.setLanguage("' + lang + '");\n';
};

// 设置调试模式
Arduino.forBlock['owm_set_debug'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'weather';
  const debug = block.getFieldValue('DEBUG');
  
  ensureOWMLib(generator);
  
  return varName + '.setDebug(' + debug + ');\n';
};

// 通过城市获取天气
Arduino.forBlock['owm_get_weather_by_city'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'weather';
  const city = generator.valueToCode(block, 'CITY', generator.ORDER_ATOMIC) || '""';
  const country = generator.valueToCode(block, 'COUNTRY', generator.ORDER_ATOMIC) || '""';
  
  ensureOWMLib(generator);
  const dataVar = ensureWeatherData(generator, varName);
  
  const code = varName + '.getCurrentWeatherByCity(' + city + ', ' + country + ', &' + dataVar + ')';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 通过坐标获取天气
Arduino.forBlock['owm_get_weather_by_coords'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'weather';
  const lat = generator.valueToCode(block, 'LAT', generator.ORDER_ATOMIC) || '0';
  const lon = generator.valueToCode(block, 'LON', generator.ORDER_ATOMIC) || '0';
  
  ensureOWMLib(generator);
  const dataVar = ensureWeatherData(generator, varName);
  
  const code = varName + '.getCurrentWeather(' + lat + ', ' + lon + ', &' + dataVar + ')';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 获取天气数据
Arduino.forBlock['owm_weather_data'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'weather';
  const data = block.getFieldValue('DATA');
  
  ensureOWMLib(generator);
  const dataVar = ensureWeatherData(generator, varName);
  
  let code = '';
  switch(data) {
    case 'name':
      code = dataVar + '.name';
      break;
    case 'country':
      code = dataVar + '.country';
      break;
    case 'weather_main':
      code = dataVar + '.weather.main';
      break;
    case 'weather_description':
      code = dataVar + '.weather.description';
      break;
    case 'weather_icon':
      code = dataVar + '.weather.icon';
      break;
    case 'temp':
      code = dataVar + '.main.temp';
      break;
    case 'feels_like':
      code = dataVar + '.main.feels_like';
      break;
    case 'temp_min':
      code = dataVar + '.main.temp_min';
      break;
    case 'temp_max':
      code = dataVar + '.main.temp_max';
      break;
    case 'humidity':
      code = dataVar + '.main.humidity';
      break;
    case 'pressure':
      code = dataVar + '.main.pressure';
      break;
    case 'wind_speed':
      code = dataVar + '.wind.speed';
      break;
    case 'wind_deg':
      code = dataVar + '.wind.deg';
      break;
    case 'clouds':
      code = dataVar + '.clouds';
      break;
    case 'visibility':
      code = dataVar + '.visibility';
      break;
    case 'sunrise':
      code = dataVar + '.sunrise';
      break;
    case 'sunset':
      code = dataVar + '.sunset';
      break;
    default:
      code = dataVar + '.main.temp';
  }
  
  return [code, generator.ORDER_MEMBER];
};

// 获取天气预报
Arduino.forBlock['owm_get_forecast'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'weather';
  const lat = generator.valueToCode(block, 'LAT', generator.ORDER_ATOMIC) || '0';
  const lon = generator.valueToCode(block, 'LON', generator.ORDER_ATOMIC) || '0';
  const count = generator.valueToCode(block, 'COUNT', generator.ORDER_ATOMIC) || '0';
  
  ensureOWMLib(generator);
  const dataVar = ensureForecastData(generator, varName);
  
  const code = varName + '.getForecast(' + lat + ', ' + lon + ', &' + dataVar + ', ' + count + ')';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 通过城市获取天气预报
Arduino.forBlock['owm_get_forecast_by_city'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'weather';
  const city = generator.valueToCode(block, 'CITY', generator.ORDER_ATOMIC) || '""';
  const country = generator.valueToCode(block, 'COUNTRY', generator.ORDER_ATOMIC) || '""';
  const count = generator.valueToCode(block, 'COUNT', generator.ORDER_ATOMIC) || '0';
  
  ensureOWMLib(generator);
  const dataVar = ensureForecastData(generator, varName);
  
  const code = varName + '.getForecastByCity(' + city + ', ' + country + ', &' + dataVar + ', ' + count + ')';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 预报时间点数量
Arduino.forBlock['owm_forecast_count'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'weather';
  
  ensureOWMLib(generator);
  const dataVar = ensureForecastData(generator, varName);
  
  return [dataVar + '.cnt', generator.ORDER_MEMBER];
};

// 获取预报数据
Arduino.forBlock['owm_forecast_data'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'weather';
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  const data = block.getFieldValue('DATA');
  
  ensureOWMLib(generator);
  const dataVar = ensureForecastData(generator, varName);
  
  let code = '';
  switch(data) {
    case 'dt_txt':
      code = dataVar + '.items[' + index + '].dt_txt';
      break;
    case 'weather_main':
      code = dataVar + '.items[' + index + '].weather.main';
      break;
    case 'weather_description':
      code = dataVar + '.items[' + index + '].weather.description';
      break;
    case 'temp':
      code = dataVar + '.items[' + index + '].main.temp';
      break;
    case 'feels_like':
      code = dataVar + '.items[' + index + '].main.feels_like';
      break;
    case 'temp_min':
      code = dataVar + '.items[' + index + '].main.temp_min';
      break;
    case 'temp_max':
      code = dataVar + '.items[' + index + '].main.temp_max';
      break;
    case 'humidity':
      code = dataVar + '.items[' + index + '].main.humidity';
      break;
    case 'pressure':
      code = dataVar + '.items[' + index + '].main.pressure';
      break;
    case 'wind_speed':
      code = dataVar + '.items[' + index + '].wind.speed';
      break;
    case 'clouds':
      code = dataVar + '.items[' + index + '].clouds';
      break;
    case 'pop':
      code = dataVar + '.items[' + index + '].pop';
      break;
    case 'rain_3h':
      code = dataVar + '.items[' + index + '].rain_3h';
      break;
    case 'snow_3h':
      code = dataVar + '.items[' + index + '].snow_3h';
      break;
    default:
      code = dataVar + '.items[' + index + '].main.temp';
  }
  
  return [code, generator.ORDER_MEMBER];
};

// 获取空气质量
Arduino.forBlock['owm_get_air_pollution'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'weather';
  const lat = generator.valueToCode(block, 'LAT', generator.ORDER_ATOMIC) || '0';
  const lon = generator.valueToCode(block, 'LON', generator.ORDER_ATOMIC) || '0';
  
  ensureOWMLib(generator);
  const dataVar = ensureAirPollutionData(generator, varName);
  
  const code = varName + '.getAirPollution(' + lat + ', ' + lon + ', &' + dataVar + ')';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 获取空气质量数据
Arduino.forBlock['owm_air_pollution_data'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'weather';
  const data = block.getFieldValue('DATA');
  
  ensureOWMLib(generator);
  const dataVar = ensureAirPollutionData(generator, varName);
  
  let code = '';
  switch(data) {
    case 'aqi':
      code = dataVar + '.aqi';
      break;
    case 'co':
      code = dataVar + '.components.co';
      break;
    case 'no':
      code = dataVar + '.components.no';
      break;
    case 'no2':
      code = dataVar + '.components.no2';
      break;
    case 'o3':
      code = dataVar + '.components.o3';
      break;
    case 'so2':
      code = dataVar + '.components.so2';
      break;
    case 'pm2_5':
      code = dataVar + '.components.pm2_5';
      break;
    case 'pm10':
      code = dataVar + '.components.pm10';
      break;
    case 'nh3':
      code = dataVar + '.components.nh3';
      break;
    default:
      code = dataVar + '.aqi';
  }
  
  return [code, generator.ORDER_MEMBER];
};

// 空气质量描述
Arduino.forBlock['owm_aqi_description'] = function(block, generator) {
  const aqi = generator.valueToCode(block, 'AQI', generator.ORDER_ATOMIC) || '1';
  
  ensureOWMLib(generator);
  
  const code = 'OpenWeatherMap::getAQIDescription(' + aqi + ')';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 通过城市查询坐标
Arduino.forBlock['owm_get_coords_by_city'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'weather';
  const city = generator.valueToCode(block, 'CITY', generator.ORDER_ATOMIC) || '""';
  const country = generator.valueToCode(block, 'COUNTRY', generator.ORDER_ATOMIC) || '""';
  
  ensureOWMLib(generator);
  const dataVar = ensureGeoData(generator, varName);
  
  const code = '(' + varName + '.getCoordinatesByName(' + city + ', ' + country + ', NULL, &' + dataVar + ', 1) > 0)';
  return [code, generator.ORDER_RELATIONAL];
};

// 通过邮编查询坐标
Arduino.forBlock['owm_get_coords_by_zip'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'weather';
  const zip = generator.valueToCode(block, 'ZIP', generator.ORDER_ATOMIC) || '""';
  const country = generator.valueToCode(block, 'COUNTRY', generator.ORDER_ATOMIC) || '""';
  
  ensureOWMLib(generator);
  const dataVar = ensureGeoData(generator, varName);
  
  const code = varName + '.getCoordinatesByZip(' + zip + ', ' + country + ', &' + dataVar + ')';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 通过坐标反向查询位置
Arduino.forBlock['owm_get_location_by_coords'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'weather';
  const lat = generator.valueToCode(block, 'LAT', generator.ORDER_ATOMIC) || '0';
  const lon = generator.valueToCode(block, 'LON', generator.ORDER_ATOMIC) || '0';
  
  ensureOWMLib(generator);
  const dataVar = ensureGeoData(generator, varName);
  
  const code = '(' + varName + '.getLocationByCoordinates(' + lat + ', ' + lon + ', &' + dataVar + ', 1) > 0)';
  return [code, generator.ORDER_RELATIONAL];
};

// 获取位置数据
Arduino.forBlock['owm_geo_data'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'weather';
  const data = block.getFieldValue('DATA');
  
  ensureOWMLib(generator);
  const dataVar = ensureGeoData(generator, varName);
  
  let code = '';
  switch(data) {
    case 'name':
      code = dataVar + '.name';
      break;
    case 'country':
      code = dataVar + '.country';
      break;
    case 'state':
      code = dataVar + '.state';
      break;
    case 'lat':
      code = dataVar + '.lat';
      break;
    case 'lon':
      code = dataVar + '.lon';
      break;
    default:
      code = dataVar + '.name';
  }
  
  return [code, generator.ORDER_MEMBER];
};

// 获取天气图标URL
Arduino.forBlock['owm_get_icon_url'] = function(block, generator) {
  const icon = generator.valueToCode(block, 'ICON', generator.ORDER_ATOMIC) || '""';
  
  ensureOWMLib(generator);
  
  // 添加临时缓冲区
  generator.addVariable('_owm_icon_url_buffer', 'char _owm_icon_url_buffer[64];');
  
  const code = 'OpenWeatherMap::getIconURL(' + icon + ', _owm_icon_url_buffer, 64)';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 获取最后错误信息
Arduino.forBlock['owm_get_last_error'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'weather';
  
  ensureOWMLib(generator);
  
  return [varName + '.getLastError()', generator.ORDER_FUNCTION_CALL];
};

// 获取最后HTTP代码
Arduino.forBlock['owm_get_http_code'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'weather';
  
  ensureOWMLib(generator);
  
  return [varName + '.getLastHttpCode()', generator.ORDER_FUNCTION_CALL];
};

# SparkFun uBlox GPS/GNSS

## Library Info
- **Name**: @aily-project/lib-sparkfun-ublox
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ublox_init` | Statement | VAR(field_input) | `ublox_init("gps")` | `SFE_UBLOX_GPS gps; gps.begin();` |
| `ublox_get_pvt` | Value→Boolean | VAR(field_variable) | `ublox_get_pvt(variables_get($gps))` | `gps.getPVT()` |
| `ublox_get_latitude` | Value→Number | VAR(field_variable) | `ublox_get_latitude(variables_get($gps))` | `gps.getLatitude()` |
| `ublox_get_longitude` | Value→Number | VAR(field_variable) | `ublox_get_longitude(variables_get($gps))` | `gps.getLongitude()` |
| `ublox_get_altitude` | Value→Number | VAR(field_variable) | `ublox_get_altitude(variables_get($gps))` | `gps.getAltitude()` |
| `ublox_get_siv` | Value→Number | VAR(field_variable) | `ublox_get_siv(variables_get($gps))` | `gps.getSIV()` |
| `ublox_get_fix_type` | Value→Number | VAR(field_variable) | `ublox_get_fix_type(variables_get($gps))` | `gps.getFixType()` |

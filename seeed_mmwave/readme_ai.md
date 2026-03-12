# Seeed 24GHz mmWave Radar

24GHz millimeter wave radar sensor library for human presence detection, motion/static target recognition and distance measurement.

## Library Info
- **Name**: @aily-project/lib-seeed-mmwave
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mmwave_init` | Statement | VAR(field_input), SERIAL_TYPE(dropdown, dynamic ext: mmwave_init_dynamic adds RX/TX pin dropdowns when SOFTWARE selected) | `mmwave_init("radar", SOFTWARE, 2, 3)` or `mmwave_init("radar", SERIAL1)` | SOFTWARE: `SoftwareSerial radarSerial(2, 3); Seeed_HSP24 radar(radarSerial);` SERIAL1: `Seeed_HSP24 radar(Serial1);` |
| `mmwave_update_status` | Statement | VAR(field_variable) | `mmwave_update_status($radar)` | `radar_status = radar.getStatus();` |
| `mmwave_target_is` | Value(Boolean) | VAR(field_variable), STATUS(dropdown) | `mmwave_target_is($radar, NoTarget)` | `(radar_status.targetStatus == Seeed_HSP24::TargetStatus::NoTarget)` |
| `mmwave_target_status` | Value(String) | VAR(field_variable) | `mmwave_target_status($radar)` | `String(mmwave_targetStatusToString(radar_status.targetStatus))` |
| `mmwave_distance` | Value(Number) | VAR(field_variable) | `mmwave_distance($radar)` | `radar_status.distance` |
| `mmwave_set_detection` | Statement | VAR(field_variable), DISTANCE(input_value), DURATION(input_value) | `mmwave_set_detection($radar, math_number(8), math_number(5))` | `radar.enableConfigMode(); radar.setDetectionDistance(8, 5); radar.disableConfigMode();` |
| `mmwave_set_gate_sensitivity` | Statement | VAR(field_variable), GATE(input_value), MOVE_POWER(input_value), STATIC_POWER(input_value) | `mmwave_set_gate_sensitivity($radar, math_number(0), math_number(50), math_number(50))` | `radar.enableConfigMode(); radar.setGatePower(0, 50, 50); radar.disableConfigMode();` |
| `mmwave_set_resolution` | Statement | VAR(field_variable), RESOLUTION(dropdown) | `mmwave_set_resolution($radar, 0)` | `radar.enableConfigMode(); radar.setResolution(0); radar.disableConfigMode();` |
| `mmwave_get_version` | Value(String) | VAR(field_variable) | `mmwave_get_version($radar)` | `radar.getVersion()` |
| `mmwave_reboot` | Statement | VAR(field_variable) | `mmwave_reboot($radar)` | `radar.enableConfigMode(); radar.rebootRadar();` |
| `mmwave_factory_reset` | Statement | VAR(field_variable) | `mmwave_factory_reset($radar)` | `radar.enableConfigMode(); radar.refactoryRadar();` |
| `mmwave_engineering_mode` | Statement | VAR(field_variable), MODE(dropdown) | `mmwave_engineering_mode($radar, ENABLE)` | `radar.enableConfigMode(); radar.enableEngineeringModel(); radar.disableConfigMode();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SERIAL_TYPE | SOFTWARE, SERIAL1, SERIAL2 | Serial port type: SOFTWARE shows RX/TX pin dropdowns (dynamic extension), SERIAL1/SERIAL2 use hardware serial |
| STATUS | NoTarget, MovingTarget, StaticTarget, BothTargets | Target detection status |
| RESOLUTION | 0, 1 | Gate resolution: 0=0.75m (default), 1=0.25m |
| MODE | ENABLE, DISABLE | Engineering mode toggle |

## ABS Examples

### Basic Presence Detection (SoftwareSerial)
```
arduino_setup()
    mmwave_init("radar", SOFTWARE, 2, 3)
    serial_begin(Serial, 9600)

arduino_loop()
    mmwave_update_status($radar)
    controls_if()
        @IF0: mmwave_target_is($radar, NoTarget)
        @DO0:
            serial_println(Serial, text("No one detected"))
        @IF1: mmwave_target_is($radar, MovingTarget)
        @DO1:
            serial_println(Serial, text("Moving target"))
        @ELSE:
            serial_println(Serial, text("Static target"))
    serial_println(Serial, mmwave_distance($radar))
    time_delay(math_number(200))
```

### Basic Presence Detection (Hardware Serial)
```
arduino_setup()
    mmwave_init("radar", SERIAL1)
    serial_begin(Serial, 9600)

arduino_loop()
    mmwave_update_status($radar)
    controls_if()
        @IF0: mmwave_target_is($radar, NoTarget)
        @DO0:
            serial_println(Serial, text("No one detected"))
        @ELSE:
            serial_println(Serial, text("Target detected"))
    time_delay(math_number(200))
```

### Configure Detection Parameters
```
arduino_setup()
    mmwave_init("radar", SOFTWARE, 2, 3)
    mmwave_set_detection($radar, math_number(6), math_number(10))
    mmwave_set_gate_sensitivity($radar, math_number(0), math_number(40), math_number(40))
    mmwave_set_resolution($radar, 1)
```

## Notes

1. **Baud rate**: The sensor default baud rate is 256000, must be changed to 9600 using HLKRadarTool APP before use
2. **Update before read**: Always call `mmwave_update_status` before reading target status or distance
3. **Variable**: `mmwave_init("varName", SERIAL_TYPE, ...)` creates variable `$varName`; reference it later with `variables_get($varName)`
7. **Serial type**: SOFTWARE uses SoftwareSerial (dynamic RX/TX pin dropdowns appear), SERIAL1/SERIAL2 use hardware serial (no pins needed)
4. **Config blocks**: `mmwave_set_detection`, `mmwave_set_gate_sensitivity`, `mmwave_set_resolution` auto-wrap with enableConfigMode/disableConfigMode
5. **Distance unit**: Distance values are in millimeters (mm)
6. **Distance gate**: Range 0-8, each gate represents a distance interval based on resolution setting

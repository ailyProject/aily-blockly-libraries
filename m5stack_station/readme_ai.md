# Station Onboard Ports

## Library Info
- **Name**: @aily-project/lib-m5stack-station
- **Version**: 0.1.0

## Blocks

| Block | Connection | ABS |
|---|---|---|
| `m5station_port_power` | Statement | `m5station_port_power(A, TRUE)` |
| `m5station_all_ports_power` | Statement | `m5station_all_ports_power(TRUE)` |
| `m5station_port_measure` | Number | `m5station_port_measure(A1, VOLTAGE)` |

Voltage is returned in volts and current in milliamperes. Port/channel mappings are fixed from the official Station example and pin map.

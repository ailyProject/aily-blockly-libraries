# Seeed RPC mDNS

Seeed Wio Terminal RPC mDNS service discovery library

## Library Info
- **Name**: @aily-project/lib-seeed-rpcmdns
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_rpcmdns_begin` | Value | HOSTNAME(input_value) | `seeed_rpcmdns_begin(text("value"))` | MDNS.begin(String( |
| `seeed_rpcmdns_begin_or_print` | Statement | HOSTNAME(input_value) | `seeed_rpcmdns_begin_or_print(text("value"))` | if (!MDNS.begin(String( |
| `seeed_rpcmdns_end` | Statement | (none) | `seeed_rpcmdns_end()` | MDNS.end();\n |
| `seeed_rpcmdns_set_instance_name` | Statement | NAME(input_value) | `seeed_rpcmdns_set_instance_name(text("value"))` | MDNS.setInstanceName(String( |
| `seeed_rpcmdns_add_service` | Statement | SERVICE(input_value), PROTO(dropdown), PORT(input_value) | `seeed_rpcmdns_add_service(text("value"), tcp, math_number(0))` | MDNS.addService(String( |
| `seeed_rpcmdns_add_service_txt` | Value | SERVICE(input_value), PROTO(dropdown), KEY(input_value), VALUE(input_value) | `seeed_rpcmdns_add_service_txt(text("value"), tcp, text("value"), text("value"))` | seeedRpcMdnsAddServiceTxt(String( |
| `seeed_rpcmdns_enable_arduino` | Statement | PORT(input_value), AUTH(dropdown) | `seeed_rpcmdns_enable_arduino(math_number(0), FALSE)` | MDNS.enableArduino( |
| `seeed_rpcmdns_disable_arduino` | Statement | (none) | `seeed_rpcmdns_disable_arduino()` | MDNS.disableArduino();\n |
| `seeed_rpcmdns_enable_workstation` | Statement | INTERFACE(dropdown) | `seeed_rpcmdns_enable_workstation(ESP_IF_WIFI_STA)` | MDNS.enableWorkstation( |
| `seeed_rpcmdns_disable_workstation` | Statement | (none) | `seeed_rpcmdns_disable_workstation()` | MDNS.disableWorkstation();\n |
| `seeed_rpcmdns_query_host` | Value | HOST(input_value), TIMEOUT(input_value) | `seeed_rpcmdns_query_host(text("value"), math_number(1000))` | MDNS.queryHost(String( |
| `seeed_rpcmdns_query_service` | Value | SERVICE(input_value), PROTO(dropdown) | `seeed_rpcmdns_query_service(text("value"), tcp)` | MDNS.queryService(String( |
| `seeed_rpcmdns_result_hostname` | Value | INDEX(input_value) | `seeed_rpcmdns_result_hostname(math_number(0))` | MDNS.hostname( |
| `seeed_rpcmdns_result_ip` | Value | INDEX(input_value) | `seeed_rpcmdns_result_ip(math_number(0))` | MDNS.IP( |
| `seeed_rpcmdns_result_port` | Value | INDEX(input_value) | `seeed_rpcmdns_result_port(math_number(0))` | MDNS.port( |
| `seeed_rpcmdns_result_txt_count` | Value | INDEX(input_value) | `seeed_rpcmdns_result_txt_count(math_number(0))` | MDNS.numTxt( |
| `seeed_rpcmdns_result_has_txt` | Value | INDEX(input_value), KEY(input_value) | `seeed_rpcmdns_result_has_txt(math_number(0), text("value"))` | MDNS.hasTxt( |
| `seeed_rpcmdns_result_txt_by_key` | Value | INDEX(input_value), KEY(input_value) | `seeed_rpcmdns_result_txt_by_key(math_number(0), text("value"))` | MDNS.txt( |
| `seeed_rpcmdns_result_txt_by_index` | Value | INDEX(input_value), TXT_INDEX(input_value) | `seeed_rpcmdns_result_txt_by_index(math_number(0), math_number(0))` | MDNS.txt( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PROTO | tcp, udp | seeed_rpcmdns_add_service, seeed_rpcmdns_add_service_txt, seeed_rpcmdns_query_service |
| AUTH | FALSE, TRUE | seeed_rpcmdns_enable_arduino |
| INTERFACE | ESP_IF_WIFI_STA, ESP_IF_WIFI_AP | seeed_rpcmdns_enable_workstation |

## ABS Examples

### Basic Usage
```
arduino_setup()
    seeed_rpcmdns_begin(text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, seeed_rpcmdns_begin(text("value")))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

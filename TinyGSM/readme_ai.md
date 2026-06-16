# TinyGSM

A small Arduino client library for GSM, LTE, NB-IoT, and WiFi AT modems.

## Library Info

- **Name**: @aily-project/lib-tinygsm
- **Version**: 1.0.0
- **Upstream Version**: 0.12.0
- **Source**: https://github.com/vshymanskyy/TinyGSM

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tinygsm_setup` | Statement | MODEM(dropdown), SERIAL(dropdown), BAUD(value) | `tinygsm_setup(TINY_GSM_MODEM_SIM800, , math_number(1))` | #define TINY_GSM_MODEM_*; TinyGsm modem(SerialAT); |
| `tinygsm_restart` | Statement | (none) | `tinygsm_restart()` | See generator.js |
| `tinygsm_wait_network` | Value | TIMEOUT(value) | `tinygsm_wait_network(math_number(1))` | See generator.js |
| `tinygsm_gprs_connect` | Value | APN(value), USER(value), PASS(value) | `tinygsm_gprs_connect(text("value"), text("value"), text("value"))` | See generator.js |
| `tinygsm_is_network_connected` | Value | (none) | `tinygsm_is_network_connected()` | See generator.js |
| `tinygsm_is_gprs_connected` | Value | (none) | `tinygsm_is_gprs_connected()` | See generator.js |
| `tinygsm_modem_info` | Value | (none) | `tinygsm_modem_info()` | See generator.js |
| `tinygsm_local_ip` | Value | (none) | `tinygsm_local_ip()` | See generator.js |
| `tinygsm_client_connect` | Value | HOST(value), PORT(value) | `tinygsm_client_connect(text("value"), math_number(1))` | See generator.js |
| `tinygsm_client_print` | Statement | TEXT(value) | `tinygsm_client_print(text("value"))` | See generator.js |
| `tinygsm_client_available` | Value | (none) | `tinygsm_client_available()` | See generator.js |
| `tinygsm_client_read` | Value | (none) | `tinygsm_client_read()` | See generator.js |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODEM | SIM800, SIM7600, SIM7000, SIM7080, A7672X, BG96, ESP8266 AT | TinyGSM modem macro. |
| SERIAL | ${board.serialPort} | Serial port connected to the modem AT interface. |

## Notes

1. The setup block must be generated before TinyGsmClient.h so it adds modem macros as includes.
2. Power/reset pins are hardware-specific and should be configured with normal GPIO blocks if needed.
3. TCP blocks use a shared TinyGsmClient named tinyGsmClient.

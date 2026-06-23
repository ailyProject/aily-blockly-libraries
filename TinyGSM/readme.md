# TinyGSM

A small Arduino client library for GSM, LTE, NB-IoT, and WiFi AT modems.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-tinygsm |
| Version | 1.0.0 |
| Upstream Version | 0.12.0 |
| Author | Volodymyr Shymanskyy |
| Source | https://github.com/vshymanskyy/TinyGSM |
| License | LGPL-3.0 |

## Supported Boards

Any Arduino-compatible board with a supported AT-command modem.

## Description

This wrapper configures a TinyGSM modem, manages network/GPRS connection, and exposes a basic TCP client.

## Quick Start

1. Add the setup or begin block for the library.
2. Add the action, status, or event blocks needed by your project.
3. For libraries that need polling, the setup blocks automatically add the required loop call when possible.

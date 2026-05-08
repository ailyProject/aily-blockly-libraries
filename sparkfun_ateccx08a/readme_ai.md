# SparkFun ATECCX08A

Cryptographic co-processor blocks for ATECC508A/ATECC608A.

## Library Info
- **Name**: @aily-project/lib-sparkfun-ateccx08a
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ateccx08a_init` | Statement | VAR(field_input), ADDRESS(dropdown) | `ateccx08a_init("atecc", ATECC508A_ADDRESS_DEFAULT)` | `ATECCX08A atecc; atecc.begin(addr);` |
| `ateccx08a_is_ready` | Value | VAR(field_variable) | `ateccx08a_is_ready(variables_get($atecc))` | `atecc_ready` |
| `ateccx08a_wakeup` | Value | VAR(field_variable) | `ateccx08a_wakeup(variables_get($atecc))` | `atecc.wakeUp()` |
| `ateccx08a_sleep` | Statement | VAR(field_variable) | `ateccx08a_sleep(variables_get($atecc))` | `atecc.sleep();` |
| `ateccx08a_read_config` | Statement | VAR(field_variable) | `ateccx08a_read_config(variables_get($atecc))` | `atecc.readConfigZone(false);` |
| `ateccx08a_lock_status` | Value | VAR(field_variable), FIELD(dropdown) | `ateccx08a_lock_status(variables_get($atecc), CONFIG)` | `atecc.configLockStatus` |
| `ateccx08a_random` | Value | VAR(field_variable), TYPE(dropdown) | `ateccx08a_random(variables_get($atecc), BYTE)` | `atecc.getRandomByte(false)` |
| `ateccx08a_update_random` | Statement | VAR(field_variable) | `ateccx08a_update_random(variables_get($atecc))` | `atecc.updateRandom32Bytes(false);` |
| `ateccx08a_create_key_pair` | Value | VAR(field_variable), SLOT(input_value) | `ateccx08a_create_key_pair(variables_get($atecc), math_number(0))` | `atecc.createNewKeyPair(0)` |
| `ateccx08a_generate_public_key` | Value | VAR(field_variable), SLOT(input_value) | `ateccx08a_generate_public_key(variables_get($atecc), math_number(0))` | `atecc.generatePublicKey(0, false)` |
| `ateccx08a_write_config_sparkfun` | Statement | VAR(field_variable) | `ateccx08a_write_config_sparkfun(variables_get($atecc))` | `atecc.writeConfigSparkFun();` |
| `ateccx08a_lock_zone` | Statement | VAR(field_variable), ZONE(dropdown) | `ateccx08a_lock_zone(variables_get($atecc), CONFIG)` | `atecc.lockConfig();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | ATECC508A_ADDRESS_DEFAULT, 0x60 | I2C address |
| FIELD | CONFIG, DATA_OTP, SLOT0 | Cached lock-status field |
| TYPE | BYTE, INT, LONG | Random value type |
| ZONE | CONFIG, DATA_OTP, SLOT0 | Lock target |

## ABS Examples

```text
arduino_setup()
    ateccx08a_init("atecc", ATECC508A_ADDRESS_DEFAULT)
    ateccx08a_read_config(variables_get($atecc))

arduino_loop()
    serial_println(Serial, ateccx08a_random(variables_get($atecc), INT))
```

## Notes

`ateccx08a_init("name", ...)` creates variable `$name`. Configuration and lock blocks can permanently change the chip.
# Rotary encoder blocks

Package `@aily-project/lib-encoder` version `0.0.3` reads quadrature signals on two digital GPIO pins. One complete cycle changes the position by four counts. Select a separate Encoder variable and two pins for each device.

| Block | Parameters in order | Result |
| --- | --- | --- |
| `encoder_init` | ENCODER, PIN_A, PIN_B | Initializes a named encoder. |
| `encoder_set_property` | ENCODER, PROPERTY, VALUE | Sets position, upper_limit or lower_limit for the selected encoder. |
| `encoder_get_property` | ENCODER, PROPERTY | Returns POSITION, DIRECTION, UPPER_LIMIT or LOWER_LIMIT. Direction is −1, 0 or +1. |
| `encoder_value_changed` | — | Reports movement of the first initialized encoder during this loop. |
| `encoder_state_change` | STATE, DO | Runs DO for LEFT, RIGHT, ABOVE_LIMIT or BELOW_LIMIT on the first encoder. |

To observe another encoder, read DIRECTION on its own variable. Each encoder starts with position zero and limits −100 and +100. On the STM32F103, choose distinct EXTI lines across both channels and any additional encoders for full interrupt counting.

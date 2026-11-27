# Arduino Rotary Encoder Library

Connect supply, ground and the A and B digital outputs of a quadrature encoder. The library counts four edges per complete A/B cycle. Swapping the A and B connections reverses the sign.

In Blockly, initialize each encoder on its own pair of pins, then select that encoder in the position, direction and limit blocks. The two event blocks without an encoder field observe the first initialized encoder. Direction is sampled at the start of each sketch loop.

In Coder, include `Encoder.h` and construct an `Encoder` with the A and B pins. On STM32, call `begin()`, `read()` or `write(0)` once in `setup()` to arm counting. Use distinct EXTI line numbers for interrupt counting on both channels of each STM32 encoder. For example, PB1/PB0 and PA4/PA5 use four different lines on the OJ Nano. A channel sharing an occupied encoder line is polled when you read the position.

The bundled driver retains the PJRC Encoder license in its source.

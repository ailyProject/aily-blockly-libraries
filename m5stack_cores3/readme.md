# CoreS3 Onboard Sensors

Official M5CoreS3 bindings for the onboard LTR-553ALS-WA proximity/ambient-light sensor and GC0308 camera.

Camera pins, RGB565 format and QVGA frame size are fixed by the official library. Camera initialization takes ownership of the internal I2C/SCCB bus as in the upstream implementation, so the camera and LTR sensor should not be initialized together in one program.

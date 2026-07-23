# M5Stack Onboard Infrared

Self-contained fixed-pin onboard infrared transmitter blocks. Arduino-IRremote 4.7.0 source is bundled in this package, so users do not need to install the generic IRremote Blockly library.

Supported mappings: Atom GPIO12, Capsule GPIO4, Cardputer GPIO44, NanoC6 GPIO3, StickC/StickC Plus GPIO9, and StickC Plus2 GPIO19. The toolbox name is board-neutral and the pin is selected automatically.

Features:

- Send address/command data with 23 protocols: NEC, NEC2, Samsung, Samsung48, SamsungLG, Sony, Panasonic, Denon, Sharp, LG, JVC, RC5, RC6, Kaseikyo variants, Onkyo, Apple, Bose Wave, FAST, LEGO Power Functions, and OpenLASIR.
- Send dedicated NEC, LG, SamsungLG, and OpenLASIR repeat frames for remote-control long presses.
- Validate, normalize, and send Pronto Hex strings.
- Parse and send raw microsecond timings separated by commas, semicolons, or whitespace, with optional repeat period/count.
- Define custom pulse-distance/pulse-width and biphase encodings.

This library intentionally exposes transmitter features only because these boards provide an onboard infrared emitter, not an onboard infrared receiver.

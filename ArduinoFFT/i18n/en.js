"use strict";

goog.provide("Blockly.Msg.en");

goog.require("Blockly.Msg");

Blockly.Msg.FFT_CATEGORY = "Arduino-FFT";
Blockly.Msg.FFT_INIT_TOOLTIP =
  "Create or reconfigure the FFT instance with custom buffers, sample count, and sampling frequency.";
Blockly.Msg.FFT_WINDOWING_TOOLTIP = "Apply windowing to the target buffer.";
Blockly.Msg.FFT_COMPUTE_TOOLTIP =
  "Compute the FFT using the provided real/imag data.";
Blockly.Msg.FFT_COMPLEX_TO_MAGNITUDE_TOOLTIP =
  "Convert complex FFT output to magnitude values.";
Blockly.Msg.FFT_MAJOR_PEAK_TOOLTIP =
  "Get the dominant frequency from the magnitude array.";
Blockly.Msg.FFT_GET_BAND_TOOLTIP =
  "Split the magnitude array into 8 equal bands and return the peak amplitude of the selected band.";

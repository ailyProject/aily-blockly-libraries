// CH13613_AMOLED generator — 元数据驱动
'use strict';
function isESP32Core(){ const c=window['boardConfig']; return c&&c.core&&c.core.indexOf('esp32')>-1; }
function chAmoledEnsureLib(g){ g.addLibrary('CH13613_GFX','#include <CH13613_GFX.h>'); }

var CH_META = {
 "chamoled_setup": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "FREQ",
    "k": "d"
   },
   {
    "n": "ROTATION",
    "k": "d"
   },
   {
    "n": "BRIGHT",
    "k": "n"
   }
  ],
  "code": null,
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": true,
  "vt": "CH13613",
  "setupClass": "CH13613_AMOLED",
  "setupCode": "CH13613_Config cfg_{VAR} = CH13613_DEFAULT_CONFIG(); // 引脚固定: CS45 SCK17 D0=8 D1=16 D2=15 D3=18 RST7 TE38\ncfg_{VAR}.freq_hz={FREQ};\n{VAR}.begin(cfg_{VAR});\n{VAR}.setRotation({ROTATION});\n{VAR}.setBrightness({BRIGHT});\n",
  "libs": [],
  "setups": []
 },
 "chamoled_panel": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "ACTION",
    "k": "d"
   },
   {
    "n": "VALUE",
    "k": "num"
   }
  ],
  "code": "{VAR}.{ACTION}({VALUE});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_set_rotation": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "ROTATION",
    "k": "d"
   }
  ],
  "code": "{VAR}.setRotation({ROTATION});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_refresh": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "MODE",
    "k": "d"
   }
  ],
  "code": "{VAR}.{MODE}();\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_dimension": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "WHICH",
    "k": "d"
   }
  ],
  "code": "{VAR}.{WHICH}()",
  "codeMap": null,
  "includeMap": null,
  "out": true,
  "order": "ORDER_FUNCTION_CALL",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_fill_screen": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "COLOR",
    "k": "col"
   }
  ],
  "code": "{VAR}.fillScreen({COLOR});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_draw_pixel": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   },
   {
    "n": "COLOR",
    "k": "col"
   }
  ],
  "code": "{VAR}.drawPixel({X}, {Y}, {COLOR});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_draw_line": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "STYLE",
    "k": "d"
   },
   {
    "n": "X0",
    "k": "num"
   },
   {
    "n": "Y0",
    "k": "num"
   },
   {
    "n": "X1",
    "k": "num"
   },
   {
    "n": "Y1",
    "k": "num"
   },
   {
    "n": "COLOR",
    "k": "col"
   }
  ],
  "code": "{VAR}.{STYLE}({X0}, {Y0}, {X1}, {Y1}, {COLOR});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_rect": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "MODE",
    "k": "d"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   },
   {
    "n": "W",
    "k": "num"
   },
   {
    "n": "H",
    "k": "num"
   },
   {
    "n": "COLOR",
    "k": "col"
   }
  ],
  "code": "{VAR}.{MODE}({X}, {Y}, {W}, {H}, {COLOR});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_round_rect": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "MODE",
    "k": "d"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   },
   {
    "n": "W",
    "k": "num"
   },
   {
    "n": "H",
    "k": "num"
   },
   {
    "n": "R",
    "k": "num"
   },
   {
    "n": "COLOR",
    "k": "col"
   }
  ],
  "code": "{VAR}.{MODE}({X}, {Y}, {W}, {H}, {R}, {COLOR});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_circle": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "MODE",
    "k": "d"
   },
   {
    "n": "CX",
    "k": "num"
   },
   {
    "n": "CY",
    "k": "num"
   },
   {
    "n": "R",
    "k": "num"
   },
   {
    "n": "COLOR",
    "k": "col"
   }
  ],
  "code": "{VAR}.{MODE}({CX}, {CY}, {R}, {COLOR});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_ellipse": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "MODE",
    "k": "d"
   },
   {
    "n": "CX",
    "k": "num"
   },
   {
    "n": "CY",
    "k": "num"
   },
   {
    "n": "RX",
    "k": "num"
   },
   {
    "n": "RY",
    "k": "num"
   },
   {
    "n": "COLOR",
    "k": "col"
   }
  ],
  "code": "{VAR}.{MODE}({CX}, {CY}, {RX}, {RY}, {COLOR});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_triangle": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "MODE",
    "k": "d"
   },
   {
    "n": "X0",
    "k": "num"
   },
   {
    "n": "Y0",
    "k": "num"
   },
   {
    "n": "X1",
    "k": "num"
   },
   {
    "n": "Y1",
    "k": "num"
   },
   {
    "n": "X2",
    "k": "num"
   },
   {
    "n": "Y2",
    "k": "num"
   },
   {
    "n": "COLOR",
    "k": "col"
   }
  ],
  "code": "{VAR}.{MODE}({X0}, {Y0}, {X1}, {Y1}, {X2}, {Y2}, {COLOR});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_arc": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "MODE",
    "k": "d"
   },
   {
    "n": "CX",
    "k": "num"
   },
   {
    "n": "CY",
    "k": "num"
   },
   {
    "n": "RIN",
    "k": "num"
   },
   {
    "n": "ROUT",
    "k": "num"
   },
   {
    "n": "START",
    "k": "num"
   },
   {
    "n": "END",
    "k": "num"
   },
   {
    "n": "COLOR",
    "k": "col"
   }
  ],
  "code": "{VAR}.{MODE}({CX}, {CY}, {RIN}, {ROUT}, {START}, {END}, {COLOR});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_sector": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "MODE",
    "k": "d"
   },
   {
    "n": "CX",
    "k": "num"
   },
   {
    "n": "CY",
    "k": "num"
   },
   {
    "n": "R",
    "k": "num"
   },
   {
    "n": "START",
    "k": "num"
   },
   {
    "n": "END",
    "k": "num"
   },
   {
    "n": "COLOR",
    "k": "col"
   }
  ],
  "code": "{VAR}.{MODE}({CX}, {CY}, {R}, {START}, {END}, {COLOR});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_star": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "CX",
    "k": "num"
   },
   {
    "n": "CY",
    "k": "num"
   },
   {
    "n": "ROUT",
    "k": "num"
   },
   {
    "n": "RIN",
    "k": "num"
   },
   {
    "n": "POINTS",
    "k": "n"
   },
   {
    "n": "COLOR",
    "k": "col"
   },
   {
    "n": "FILL",
    "k": "chk"
   }
  ],
  "code": "{VAR}.drawStar({CX}, {CY}, {ROUT}, {RIN}, {POINTS}, {COLOR}, {FILL});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_rect_gradient": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "DIR",
    "k": "d"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   },
   {
    "n": "W",
    "k": "num"
   },
   {
    "n": "H",
    "k": "num"
   },
   {
    "n": "C1",
    "k": "col"
   },
   {
    "n": "C2",
    "k": "col"
   }
  ],
  "code": "{VAR}.fillRectGradient({X}, {Y}, {W}, {H}, {C1}, {C2}, {DIR});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_radial_gradient": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "CX",
    "k": "num"
   },
   {
    "n": "CY",
    "k": "num"
   },
   {
    "n": "R",
    "k": "num"
   },
   {
    "n": "CIN",
    "k": "col"
   },
   {
    "n": "COUT",
    "k": "col"
   }
  ],
  "code": "{VAR}.fillRadialGradient({CX}, {CY}, {R}, {CIN}, {COUT});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_set_text_color": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "COLOR",
    "k": "col"
   }
  ],
  "code": "{VAR}.setTextColor({COLOR});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_set_text_size": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "SIZE",
    "k": "n"
   }
  ],
  "code": "{VAR}.setTextSize({SIZE});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_set_text_align": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "H",
    "k": "d"
   },
   {
    "n": "V",
    "k": "d"
   }
  ],
  "code": "{VAR}.setTextAlign({H}, {V});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_set_cursor": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   }
  ],
  "code": "{VAR}.setCursor({X}, {Y});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_draw_text": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   },
   {
    "n": "TEXT",
    "k": "str"
   }
  ],
  "code": "{VAR}.drawText({X}, {Y}, {TEXT});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_text_effect": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "STYLE",
    "k": "d"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   },
   {
    "n": "TEXT",
    "k": "str"
   },
   {
    "n": "COLOR",
    "k": "col"
   },
   {
    "n": "COLOR2",
    "k": "col"
   }
  ],
  "code": "{VAR}.{STYLE}({X}, {Y}, {TEXT}, {COLOR}, {COLOR2});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_seg_text": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   },
   {
    "n": "H",
    "k": "num"
   },
   {
    "n": "TEXT",
    "k": "str"
   },
   {
    "n": "COLOR",
    "k": "col"
   },
   {
    "n": "BG",
    "k": "col"
   }
  ],
  "code": "{VAR}.drawSegText({X}, {Y}, {H}, {TEXT}, {COLOR}, {BG}, {BG});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_print": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   },
   {
    "n": "TEXT",
    "k": "str"
   }
  ],
  "code": "{VAR}.setCursor({X}, {Y}); {VAR}.print({TEXT});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_set_cn_font": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "FONT",
    "k": "d"
   }
  ],
  "code": null,
  "codeMap": {
   "field": "FONT",
   "map": {
    "0": "{VAR}.setCNFont(nullptr);\n",
    "16": "{VAR}.setCNFont(&CN_Font16);\n",
    "24": "{VAR}.setCNFont(&CN_Font24);\n",
    "32": "{VAR}.setCNFont(&CN_Font32);\n"
   }
  },
  "includeMap": {
   "field": "FONT",
   "map": {
    "16": "CH13613_FontCN16.h",
    "24": "CH13613_FontCN24.h",
    "32": "CH13613_FontCN32.h"
   }
  },
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_color": {
  "a": [
   {
    "n": "COLOR",
    "k": "d"
   }
  ],
  "code": "{COLOR}",
  "codeMap": null,
  "includeMap": null,
  "out": true,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_color_rgb": {
  "a": [
   {
    "n": "R",
    "k": "n"
   },
   {
    "n": "G",
    "k": "n"
   },
   {
    "n": "B",
    "k": "n"
   }
  ],
  "code": "CH13613Color::rgb({R}, {G}, {B})",
  "codeMap": null,
  "includeMap": null,
  "out": true,
  "order": "ORDER_FUNCTION_CALL",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_palette": {
  "a": [
   {
    "n": "PAL",
    "k": "d"
   },
   {
    "n": "T",
    "k": "n"
   }
  ],
  "code": "CH13613Color::{PAL}({T})",
  "codeMap": null,
  "includeMap": null,
  "out": true,
  "order": "ORDER_FUNCTION_CALL",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_set_blend": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "MODE",
    "k": "d"
   }
  ],
  "code": "{VAR}.setBlendMode({MODE});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_set_alpha": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "ALPHA",
    "k": "n"
   }
  ],
  "code": "{VAR}.setGlobalAlpha({ALPHA});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_clip": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "MODE",
    "k": "d"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   },
   {
    "n": "W",
    "k": "num"
   }
  ],
  "code": null,
  "codeMap": {
   "field": "MODE",
   "map": {
    "rect": "{VAR}.setClipRect({X}, {Y}, {W}, {W});\n",
    "circle": "{VAR}.setCircleClip({X}, {Y}, {W});\n",
    "clear": "{VAR}.clearClip();\n"
   }
  },
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_color_filter": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "FILTER",
    "k": "d"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   },
   {
    "n": "W",
    "k": "num"
   },
   {
    "n": "H",
    "k": "num"
   },
   {
    "n": "AMOUNT",
    "k": "n"
   }
  ],
  "code": "{VAR}.colorFilterRect({X}, {Y}, {W}, {H}, {FILTER}, {AMOUNT});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_effect_rect": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "TYPE",
    "k": "d"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   },
   {
    "n": "W",
    "k": "num"
   },
   {
    "n": "H",
    "k": "num"
   },
   {
    "n": "AMOUNT",
    "k": "n"
   }
  ],
  "code": "{VAR}.{TYPE}({X}, {Y}, {W}, {H}, {AMOUNT});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_vignette": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "STRENGTH",
    "k": "n"
   }
  ],
  "code": "{VAR}.applyVignette({STRENGTH});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_spotlight": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "CX",
    "k": "num"
   },
   {
    "n": "CY",
    "k": "num"
   },
   {
    "n": "R",
    "k": "num"
   },
   {
    "n": "DIM",
    "k": "n"
   }
  ],
  "code": "{VAR}.applySpotlight({CX}, {CY}, {R}, {DIM});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_glow_circle": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "CX",
    "k": "num"
   },
   {
    "n": "CY",
    "k": "num"
   },
   {
    "n": "R",
    "k": "num"
   },
   {
    "n": "COLOR",
    "k": "col"
   },
   {
    "n": "GLOWW",
    "k": "n"
   }
  ],
  "code": "{VAR}.drawGlowCircle({CX}, {CY}, {R}, {COLOR}, {GLOWW});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_draw_bitmap": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "TYPE",
    "k": "d"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   },
   {
    "n": "BMP",
    "k": "id"
   },
   {
    "n": "W",
    "k": "num"
   },
   {
    "n": "H",
    "k": "num"
   },
   {
    "n": "COLOR",
    "k": "col"
   }
  ],
  "code": null,
  "codeMap": {
   "field": "TYPE",
   "map": {
    "rgb": "{VAR}.drawRGBBitmap({X}, {Y}, {BMP}, {W}, {H});\n",
    "mono": "{VAR}.drawBitmap({X}, {Y}, {BMP}, {W}, {H}, {COLOR});\n"
   }
  },
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_draw_icon": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "ICON",
    "k": "d"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   },
   {
    "n": "SIZE",
    "k": "n"
   },
   {
    "n": "COLOR",
    "k": "col"
   }
  ],
  "code": "{VAR}.drawIcon({X}, {Y}, {SIZE}, {ICON}, {COLOR});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_progress_bar": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   },
   {
    "n": "W",
    "k": "num"
   },
   {
    "n": "H",
    "k": "num"
   },
   {
    "n": "PCT",
    "k": "num"
   },
   {
    "n": "FG",
    "k": "col"
   },
   {
    "n": "BG",
    "k": "col"
   }
  ],
  "code": "{VAR}.drawProgressBar({X}, {Y}, {W}, {H}, {PCT}, {FG}, {BG});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_button": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   },
   {
    "n": "W",
    "k": "num"
   },
   {
    "n": "H",
    "k": "num"
   },
   {
    "n": "LABEL",
    "k": "str"
   },
   {
    "n": "TXT",
    "k": "col"
   },
   {
    "n": "FILL",
    "k": "col"
   },
   {
    "n": "BORDER",
    "k": "col"
   },
   {
    "n": "R",
    "k": "num"
   }
  ],
  "code": "{VAR}.drawButton({X}, {Y}, {W}, {H}, {LABEL}, {TXT}, {FILL}, {BORDER}, {R});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_toggle": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   },
   {
    "n": "W",
    "k": "num"
   },
   {
    "n": "H",
    "k": "num"
   },
   {
    "n": "ON",
    "k": "chk"
   },
   {
    "n": "ONC",
    "k": "col"
   },
   {
    "n": "OFFC",
    "k": "col"
   }
  ],
  "code": "{VAR}.drawToggle({X}, {Y}, {W}, {H}, {ON}, {ONC}, {OFFC});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_checkbox": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   },
   {
    "n": "SIZE",
    "k": "num"
   },
   {
    "n": "CHECKED",
    "k": "chk"
   },
   {
    "n": "COLOR",
    "k": "col"
   }
  ],
  "code": "{VAR}.drawCheckbox({X}, {Y}, {SIZE}, {CHECKED}, {COLOR});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_slider": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   },
   {
    "n": "W",
    "k": "num"
   },
   {
    "n": "PCT",
    "k": "num"
   },
   {
    "n": "TRACK",
    "k": "col"
   },
   {
    "n": "ACTIVE",
    "k": "col"
   },
   {
    "n": "KNOB",
    "k": "col"
   }
  ],
  "code": "{VAR}.drawSlider({X}, {Y}, {W}, {PCT}, {TRACK}, {ACTIVE}, {KNOB});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_battery": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   },
   {
    "n": "W",
    "k": "num"
   },
   {
    "n": "H",
    "k": "num"
   },
   {
    "n": "PCT",
    "k": "num"
   },
   {
    "n": "COLOR",
    "k": "col"
   },
   {
    "n": "CHARGING",
    "k": "chk"
   }
  ],
  "code": "{VAR}.drawBattery({X}, {Y}, {W}, {H}, {PCT}, {COLOR}, {CHARGING});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_signal": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "X",
    "k": "num"
   },
   {
    "n": "Y",
    "k": "num"
   },
   {
    "n": "BARS",
    "k": "n"
   },
   {
    "n": "LEVEL",
    "k": "n"
   },
   {
    "n": "ON",
    "k": "col"
   },
   {
    "n": "OFF",
    "k": "col"
   }
  ],
  "code": "{VAR}.drawSignal({X}, {Y}, {BARS}, {LEVEL}, {ON}, {OFF});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_spinner": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "CX",
    "k": "num"
   },
   {
    "n": "CY",
    "k": "num"
   },
   {
    "n": "R",
    "k": "num"
   },
   {
    "n": "PHASE",
    "k": "num"
   },
   {
    "n": "COLOR",
    "k": "col"
   }
  ],
  "code": "{VAR}.drawSpinner({CX}, {CY}, {R}, {PHASE}, {COLOR});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_gauge": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "CX",
    "k": "num"
   },
   {
    "n": "CY",
    "k": "num"
   },
   {
    "n": "R",
    "k": "num"
   },
   {
    "n": "THICK",
    "k": "num"
   },
   {
    "n": "VALUE",
    "k": "num"
   },
   {
    "n": "VMIN",
    "k": "num"
   },
   {
    "n": "VMAX",
    "k": "num"
   },
   {
    "n": "START",
    "k": "num"
   },
   {
    "n": "END",
    "k": "num"
   },
   {
    "n": "FG",
    "k": "col"
   },
   {
    "n": "BG",
    "k": "col"
   }
  ],
  "code": "{VAR}.drawGauge({CX}, {CY}, {R}, {THICK}, {VALUE}, {VMIN}, {VMAX}, {START}, {END}, {FG}, {BG});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_ring_progress": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "CX",
    "k": "num"
   },
   {
    "n": "CY",
    "k": "num"
   },
   {
    "n": "ROUT",
    "k": "num"
   },
   {
    "n": "THICK",
    "k": "num"
   },
   {
    "n": "PCT",
    "k": "num"
   },
   {
    "n": "FG",
    "k": "col"
   },
   {
    "n": "BG",
    "k": "col"
   }
  ],
  "code": "{VAR}.drawRingProgress({CX}, {CY}, {ROUT}, {THICK}, {PCT}, {FG}, {BG});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_clock_face": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "CX",
    "k": "num"
   },
   {
    "n": "CY",
    "k": "num"
   },
   {
    "n": "R",
    "k": "num"
   },
   {
    "n": "HH",
    "k": "num"
   },
   {
    "n": "MM",
    "k": "num"
   },
   {
    "n": "SS",
    "k": "num"
   },
   {
    "n": "FACE",
    "k": "col"
   },
   {
    "n": "TICK",
    "k": "col"
   },
   {
    "n": "HC",
    "k": "col"
   },
   {
    "n": "MC",
    "k": "col"
   },
   {
    "n": "SC",
    "k": "col"
   }
  ],
  "code": "{VAR}.drawClockFace({CX}, {CY}, {R}, {HH}, {MM}, {SS}, {FACE}, {TICK}, {HC}, {MC}, {SC});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_needle": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "CX",
    "k": "num"
   },
   {
    "n": "CY",
    "k": "num"
   },
   {
    "n": "LEN",
    "k": "num"
   },
   {
    "n": "DEG",
    "k": "num"
   },
   {
    "n": "BASEW",
    "k": "n"
   },
   {
    "n": "COLOR",
    "k": "col"
   }
  ],
  "code": "{VAR}.drawNeedle({CX}, {CY}, {LEN}, {DEG}, {BASEW}, {COLOR});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_ticks": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "CX",
    "k": "num"
   },
   {
    "n": "CY",
    "k": "num"
   },
   {
    "n": "ROUT",
    "k": "num"
   },
   {
    "n": "COUNT",
    "k": "n"
   },
   {
    "n": "LEN",
    "k": "num"
   },
   {
    "n": "COLOR",
    "k": "col"
   }
  ],
  "code": "{VAR}.drawTicks({CX}, {CY}, {ROUT}, {COUNT}, {LEN}, {COLOR});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_speedometer": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "CX",
    "k": "num"
   },
   {
    "n": "CY",
    "k": "num"
   },
   {
    "n": "R",
    "k": "num"
   },
   {
    "n": "VALUE",
    "k": "num"
   },
   {
    "n": "VMAX",
    "k": "num"
   },
   {
    "n": "FG",
    "k": "col"
   },
   {
    "n": "BG",
    "k": "col"
   },
   {
    "n": "NEEDLE",
    "k": "col"
   }
  ],
  "code": "{VAR}.drawSpeedometer({CX}, {CY}, {R}, {VALUE}, {VMAX}, {FG}, {BG}, {NEEDLE});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chamoled_compass": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "CX",
    "k": "num"
   },
   {
    "n": "CY",
    "k": "num"
   },
   {
    "n": "R",
    "k": "num"
   },
   {
    "n": "HEADING",
    "k": "num"
   },
   {
    "n": "RING",
    "k": "col"
   },
   {
    "n": "NEEDLE",
    "k": "col"
   }
  ],
  "code": "{VAR}.drawCompass({CX}, {CY}, {R}, {HEADING}, {RING}, {NEEDLE});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CH13613",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chtouch_setup": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "ROTATION",
    "k": "d"
   }
  ],
  "code": null,
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": true,
  "vt": "CHTouch",
  "setupClass": "CH13613_Touch",
  "setupCode": "{VAR}.begin(21, 47, 48, 10, Wire1, 400000);\n{VAR}.setRotation({ROTATION});\n",
  "libs": [
   [
    "CH13613_Touch",
    "#include <CH13613_Touch.h>"
   ],
   [
    "Wire",
    "#include <Wire.h>"
   ]
  ],
  "setups": [
   [
    "ojoy_i2c_wire1",
    "Wire1.begin(21, 47, 400000); // OJoy 触摸I2C SDA21/SCL47 (独立总线)"
   ]
  ]
 },
 "chtouch_read": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   }
  ],
  "code": "{VAR}.read()",
  "codeMap": null,
  "includeMap": null,
  "out": true,
  "order": "ORDER_FUNCTION_CALL",
  "setup": false,
  "vt": "CHTouch",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chtouch_touched": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   }
  ],
  "code": "{VAR}.touched()",
  "codeMap": null,
  "includeMap": null,
  "out": true,
  "order": "ORDER_FUNCTION_CALL",
  "setup": false,
  "vt": "CHTouch",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chtouch_x": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   }
  ],
  "code": "{VAR}.x()",
  "codeMap": null,
  "includeMap": null,
  "out": true,
  "order": "ORDER_FUNCTION_CALL",
  "setup": false,
  "vt": "CHTouch",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chtouch_y": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   }
  ],
  "code": "{VAR}.y()",
  "codeMap": null,
  "includeMap": null,
  "out": true,
  "order": "ORDER_FUNCTION_CALL",
  "setup": false,
  "vt": "CHTouch",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chtouch_points": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   }
  ],
  "code": "{VAR}.points()",
  "codeMap": null,
  "includeMap": null,
  "out": true,
  "order": "ORDER_FUNCTION_CALL",
  "setup": false,
  "vt": "CHTouch",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chtouch_gesture_is": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "GESTURE",
    "k": "d"
   }
  ],
  "code": "({VAR}.gesture() == {GESTURE})",
  "codeMap": null,
  "includeMap": null,
  "out": true,
  "order": "ORDER_RELATIONAL",
  "setup": false,
  "vt": "CHTouch",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chtouch_present": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   }
  ],
  "code": "{VAR}.present()",
  "codeMap": null,
  "includeMap": null,
  "out": true,
  "order": "ORDER_FUNCTION_CALL",
  "setup": false,
  "vt": "CHTouch",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chtouch_set_rotation": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "ROTATION",
    "k": "d"
   }
  ],
  "code": "{VAR}.setRotation({ROTATION});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CHTouch",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 },
 "chtouch_calibrate": {
  "a": [
   {
    "n": "VAR",
    "k": "var"
   },
   {
    "n": "MX",
    "k": "chk"
   },
   {
    "n": "MY",
    "k": "chk"
   },
   {
    "n": "SWAP",
    "k": "chk"
   }
  ],
  "code": "{VAR}.setMirror({MX}, {MY});\n{VAR}.setSwapXY({SWAP});\n",
  "codeMap": null,
  "includeMap": null,
  "out": false,
  "order": "ORDER_ATOMIC",
  "setup": false,
  "vt": "CHTouch",
  "setupClass": null,
  "setupCode": null,
  "libs": [],
  "setups": []
 }
};

function chReadArg(block, generator, a){
  var k=a.k, n=a.n;
  if(k==='var'){ var f=block.getField('VAR'); return f? f.getText() : 'gfx'; }
  if(k==='d'||k==='n'||k==='id') return block.getFieldValue(n);
  if(k==='chk') return block.getFieldValue(n)==='TRUE' ? 'true':'false';
  if(k==='ptr') return generator.valueToCode(block,n,generator.ORDER_ATOMIC) || 'NULL';
  if(k==='str') return generator.valueToCode(block,n,generator.ORDER_ATOMIC) || '""';
  // num / col
  var v=generator.valueToCode(block,n,generator.ORDER_ATOMIC);
  if(v==null||v==='') v = (k==='col'?'CH_WHITE':'0');
  return v.replace(/^\((.+)\)$/,'$1');
}
function chSubst(tmpl, vals){ return tmpl.replace(/\{(\w+)\}/g, function(m,p){ return (p in vals)? vals[p] : m; }); }

// 变量重命名监听(setup 专用)
function chAttachVarMonitor(block, vtype){
  if(block._chVarMonitorAttached) return;
  block._chVarMonitorAttached=true;
  block._chVarLast=block.getFieldValue('VAR')||'gfx';
  if(typeof registerVariableToBlockly==='function') registerVariableToBlockly(block._chVarLast, vtype);
  var vf=block.getField('VAR');
  if(vf){
    var orig=vf.onFinishEditing_;
    vf.onFinishEditing_=function(nn){
      if(typeof orig==='function') orig.call(this,nn);
      var ws=block.workspace||(typeof Blockly!=='undefined'&&Blockly.getMainWorkspace&&Blockly.getMainWorkspace());
      var on=block._chVarLast;
      if(ws&&nn&&nn!==on){ if(typeof renameVariableInBlockly==='function') renameVariableInBlockly(block,on,nn,vtype); block._chVarLast=nn; }
    };
  }
}

Object.keys(CH_META).forEach(function(type){
  var m=CH_META[type];
  Arduino.forBlock[type]=function(block, generator){
    chAmoledEnsureLib(generator);
    var vals={};
    m.a.forEach(function(a){ vals[a.n]=chReadArg(block,generator,a); });

    if(m.setup){
      chAttachVarMonitor(block, m.vt);
      var V=block.getFieldValue('VAR')||'gfx';
      vals.VAR=V;
      generator.addVariable(V, m.setupClass+' '+V+';');
      (m.libs||[]).forEach(function(L){ generator.addLibrary(L[0], L[1]); });
      (m.setups||[]).forEach(function(S){ generator.addSetup(S[0], S[1]); });
      return chSubst(m.setupCode, vals);
    }

    // 变量引用型：确保变量已注册
    if(m.a.length && m.a[0].k==='var' && typeof registerVariableToBlockly==='function'){
      registerVariableToBlockly(vals.VAR, m.vt);
    }
    // 附带头文件(中文字体等)
    if(m.includeMap){
      var fv=block.getFieldValue(m.includeMap.field);
      var inc=m.includeMap.map[fv];
      if(inc) generator.addLibrary(inc, '#include "'+inc+'"');
    }
    var tmpl = m.code;
    if(m.codeMap){ tmpl = m.codeMap.map[ block.getFieldValue(m.codeMap.field) ] || ''; }
    var out = chSubst(tmpl, vals);
    if(m.out) return [out, generator[m.order]];
    return out;
  };
});

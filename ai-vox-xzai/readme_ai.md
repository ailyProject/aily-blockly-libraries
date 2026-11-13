# Xiaozhi AI

Xiaozhi AI for Arduino is based on the AI ​​Vox voice interaction engine support library and is suitable for ESP32 and ESP32S3 development boards.

## Library Info
- **Name**: @aily-project/lib-esp32-xzai
- **Version**: 0.0.8

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_task` | Hat | TASK(dropdown), CORE(dropdown), INTERVAL(input_value), csCALLBACK(input_statement), CALLBACK(input_statement) | `esp32_task("1", "0", math_number(1000))` | `void esp32_task_1(void *pvParameters) { ↵ for (;;) { ↵ vTaskDelay(1); ↵ } ↵ } ↵ xTaskCreatePinnedToCore(esp32_task_1,"esp32_task_1",1,NULL,2,NULL,0); ↵ vTaskDelay(1);` |
| `esp32_serial_init` | Statement | SERIAL_PORT(dropdown), RX_PIN(dropdown), TX_PIN(dropdown), BAUDRATE(dropdown) | `esp32_serial_init(Serial, RX_PIN, TX_PIN, "9600")` | `Serial.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);` |
| `esp32ai_button_setup` | Statement | PIN(dropdown), PIN_MODE(dropdown), ACTIVE_LOW(dropdown) | `esp32ai_button_setup(PIN, INPUT, TRUE)` | `constexpr gpio_num_t kButtonBoot = GPIO_NUM_PIN; ↵ button_handle_t g_button_boot_handle = nullptr; ↵ const button_config_t ai_btn_cfg = { ↵ .long_press_time = 1000, ↵ .short_press_time = 50, ↵ }; ↵ const button_gpio_config_t ai_btn_gpio_cfg = { // 现在能识别该结构体 ↵ .gpio_num = kButtonBoot, ↵ .active_level = 0, ↵ .enable_power_save = false, ↵ .disable_pull = true, ↵ }; ↵ // 创建设备函数现在能识别 ↵ ESP_ERROR_CHECK(iot_button_new_gpio_device(&ai_btn_cfg, &ai_btn_gpio_cfg, &g_button_boot_handle));` |
| `esp32ai_init_wifi` | Statement | MODE(dropdown); runtime variants: manual-credentials: SSID(input_value), PSWD(input_value) | `esp32ai_init_wifi(Manual, text("Your WiFi SSID"), text("Your WiFi Password"))` | `constexpr smartconfig_type_t kSmartConfigType = SC_TYPE_ESPTOUCH; ↵ #define WIFI_SSID 1 ↵ #define WIFI_PASSWORD 1` |
| `esp32ai_button_click` | Hat | HANDLER(input_statement) | `esp32ai_button_click()` | `static void g_button_single_click_cb(void *button_handle, void *usr_data) { ↵ (void)button_handle; // 忽略未使用的按钮句柄参数 ↵ (void)usr_data; // 忽略未使用的用户数据参数 ↵ // 用户定义的单击逻辑 ↵ } ↵ ESP_ERROR_CHECK(iot_button_register_cb( ↵ g_button_boot_handle, // 1. 按钮句柄 ↵ BUTTON_SINGLE_CLICK, // 2. 单击事件（官方枚举值） ↵ NULL, // 3. 无事件参数（传NULL） ↵ g_button_single_click_cb, // 4. 回调函数 ↵ NULL // 5. 无用户数据（传NULL） ↵ ));` |
| `esp32ai_button_double_click` | Hat | HANDLER(input_statement) | `esp32ai_button_double_click()` | `static void g_button_double_click_cb(void *button_handle, void *usr_data) { ↵ (void)button_handle; ↵ (void)usr_data; ↵ } ↵ ESP_ERROR_CHECK(iot_button_register_cb( ↵ g_button_boot_handle, ↵ BUTTON_DOUBLE_CLICK, // 官方双击事件枚举值 ↵ NULL, ↵ g_button_double_click_cb, ↵ NULL ↵ ));` |
| `esp32ai_button_long_pressing` | Hat | HANDLER(input_statement) | `esp32ai_button_long_pressing()` | `static void g_button_long_press_hold_cb(void *button_handle, void *usr_data) { ↵ (void)button_handle; ↵ (void)usr_data; ↵ // 注意：此事件会持续触发，避免阻塞操作 ↵ } ↵ ESP_ERROR_CHECK(iot_button_register_cb( ↵ g_button_boot_handle, ↵ BUTTON_LONG_PRESS_HOLD, // 官方长按中事件枚举值 ↵ NULL, ↵ g_button_long_press_hold_cb, ↵ NULL ↵ ));` |
| `esp32_i2s_mic_setup` | Statement | MIC_TYPE(dropdown); runtime variants: standard-i2s: SCK_PIN_INPUT(field_number), SD_PIN_INPUT(field_number), WS_PIN_INPUT(field_number); pdm: SCK_PIN_INPUT(field_number), SD_PIN_INPUT(field_number) | `esp32_i2s_mic_setup(AUDIO_INPUT_DEVICE_TYPE_I2S_STD, 13, 11, 12)` | `#define AUDIO_INPUT_DEVICE_TYPE AUDIO_INPUT_DEVICE_TYPE_I2S_STD ↵ #define AUDIO_INPUT_DEVICE_TYPE_PDM (0) ↵ #define AUDIO_INPUT_DEVICE_TYPE_I2S_STD (1) ↵ constexpr gpio_num_t kMicPinSck = GPIO_NUM_0; // I2S时钟引脚 ↵ constexpr gpio_num_t kMicPinWs = GPIO_NUM_0; // I2S帧同步引脚 ↵ constexpr gpio_num_t kMicPinSd = GPIO_NUM_0; // I2S数据引脚` |
| `esp32ai_i2s_speaker_setup` | Statement | SCK_PIN(dropdown), WS_PIN(dropdown), SD_PIN(dropdown) | `esp32ai_i2s_speaker_setup(SCK_PIN, WS_PIN, SD_PIN)` | `int esp32ai_rate=16000; ↵ constexpr gpio_num_t kSpeakerPinSck = GPIO_NUM_SCK_PIN; // SCK (BCK, BCLK) ↵ constexpr gpio_num_t kSpeakerPinWs = GPIO_NUM_WS_PIN; // WS (LRCLK) ↵ constexpr gpio_num_t kSpeakerPinSd = GPIO_NUM_SD_PIN; // SD (DIN)` |
| `esp32ai_init_display` | Statement | DISPLAY_TYPE(dropdown); runtime variants: st7789-spi: DC_PIN(field_number), MOSI_PIN(field_number), CLK_PIN(field_number), RST_PIN(field_number), BACKLIGHT_PIN(field_number), CS_PIN(field_number), WIDTH(field_number), HEIGHT(field_number); ssd1306-i2c: SCL_PIN(field_number), SDA_PIN(field_number), WIDTH(field_number), HEIGHT(field_number) | `esp32ai_init_display(ST7789, 27, 13, 14, 33, 2, 5, 240, 240)` | `#define SCREEN_DISPLAY_TYPE_LCD (1) ↵ #define SCREEN_DISPLAY_TYPE_OLED (2) ↵ #define nSCREEN_DISPLAY_TYPE_LCD (3) ↵ #define nSCREEN_DISPLAY_TYPE_OLED (4) ↵ #define SCREEN_DISPLAY_TYPE SCREEN_DISPLAY_TYPE_LCD ↵ constexpr gpio_num_t kDisplayBacklightPin = GPIO_NUM_0; ↵ constexpr gpio_num_t kDisplayMosiPin = GPIO_NUM_0; ↵ constexpr gpio_num_t kDisplayClkPin = GPIO_NUM_0; ↵ constexpr gpio_num_t kDisplayDcPin = GPIO_NUM_0; ↵ constexpr gpio_num_t kDisplayRstPin = GPIO_NUM_NC; ↵ constexpr gpio_num_t kDisplayCsPin = GPIO_NUM_0; ↵ constexpr auto kDisplaySpiMode = 0; ↵ constexpr uint32_t kDisplayWidth = 240; ↵ constexpr uint32_t kDisplayHeight = 240; ↵ constexpr bool kDisplayMirrorX = false; ↵ constexpr bool kDisplayMirrorY = false; ↵ constexpr bool kDisplayInvertColor = true; ↵ constexpr bool kDisplaySwapXY = false; ↵ constexpr auto kDisplayRgbElementOrder = LCD_RGB_ELEMENT_ORDER_RGB;` |
| `esp32ai_init_nlvgl_display` | Statement | DISPLAY_TYPE(dropdown), ROTATION(dropdown); runtime variants: st7789-spi-lvgl: WIDTH(field_number), HEIGHT(field_number), FREQUENCY(dropdown), BACKLIGHT_PIN(field_number), MOSI_PIN(field_number), CLK_PIN(field_number), DC_PIN(field_number), RST_PIN(field_number), CS_PIN(field_number), TASK_PRIORITY(field_number), TASK_STACK(field_number), TASK_AFFINITY(dropdown), TASK_MAX_SLEEP(field_number), TIMER_PERIOD(field_number); ssd1306-i2c-lvgl: WIDTH(field_number), HEIGHT(field_number), SCL_PIN(field_number), SDA_PIN(field_number), TASK_PRIORITY(field_number), TASK_STACK(field_number), TASK_AFFINITY(dropdown), TASK_MAX_SLEEP(field_number), TIMER_PERIOD(field_number) | `esp32ai_init_nlvgl_display(nST7789, LV_DISPLAY_ROTATION_0, 240, 240, 40000000, 46, 16, 15, 8, 17, 3, 1, 7168, -1, 500, 50)` | `std::string chatRole; ↵ #define SCREEN_DISPLAY_TYPE_LCD (1) ↵ #define SCREEN_DISPLAY_TYPE_OLED (2) ↵ #define nSCREEN_DISPLAY_TYPE_LCD (3) ↵ #define nSCREEN_DISPLAY_TYPE_OLED (4) ↵ #define SCREEN_DISPLAY_TYPE nSCREEN_DISPLAY_TYPE_LCD ↵ static lv_display_t* g_display = nullptr; ↵ constexpr gpio_num_t kDisplayBacklightPin = GPIO_NUM_0; ↵ constexpr gpio_num_t kDisplayMosiPin = GPIO_NUM_0; ↵ constexpr gpio_num_t kDisplayClkPin = GPIO_NUM_0; ↵ constexpr gpio_num_t kDisplayDcPin = GPIO_NUM_0; ↵ constexpr gpio_num_t kDisplayRstPin = GPIO_NUM_NC; ↵ constexpr gpio_num_t kDisplayCsPin = GPIO_NUM_0; ↵ constexpr auto kDisplaySpiMode = 0; ↵ constexpr uint32_t kDisplayWidth = 0; ↵ constexpr uint32_t kDisplayHeight = 0; ↵ constexpr uint32_t kDisplayPclkHz = FREQUENCY; ↵ constexpr uint8_t kDisplayRotateDeg = LV_DISPLAY_ROTATION_0; ↵ constexpr bool kDisplayMirrorX = (kDisplayRotateDeg == 90 &#124;&#124; kDisplayRotateDeg == 180); ↵ constexpr bool kDisplayMirrorY = (kDisplayRotateDeg == 180 &#124;&#124; kDisplayRotateDeg == 270); ↵ constexpr bool kDisplayInvertColor = true; ↵ constexpr bool kDisplaySwapXY = (kDisplayRotateDeg == 90 &#124;&#124; kDisplayRotateDeg == 270); ↵ constexpr auto kDisplayRgbElementOrder = LCD_RGB_ELEMENT_ORDER_RGB; ↵ void DisplayInit(esp_lcd_panel_io_handle_t panel_io, ↵ esp_lcd_panel_handle_t panel, ↵ int width, ↵ int height, ↵ int offset_x, ↵ int offset_y, ↵ bool mirror_x, ↵ bool mirror_y, ↵ bool swap_xy) { ↵ // 绘制白色背景 ↵ std::vector<uint16_t> buffer(width, 0xFFFF); ↵ for (int y = 0; y < height; y++) { ↵ esp_lcd_panel_draw_bitmap(panel, 0, y, width, y + 1, buffer.data()); ↵ } ↵ ESP_ERROR_CHECK(esp_lcd_panel_disp_on_off(panel, true)); ↵ lv_init(); ↵ lvgl_port_cfg_t port_cfg = ESP_LVGL_PORT_INIT_CONFIG(); ↵ port_cfg.task_priority = 0; ↵ port_cfg.task_stack = 0; ↵ port_cfg.task_affinity = TASK_AFFINITY; ↵ port_cfg.task_max_sleep_ms = 0; ↵ port_cfg.timer_period_ms = 0; ↵ lvgl_port_init(&port_cfg); ↵ const lvgl_port_display_cfg_t display_cfg = { ↵ .io_handle = panel_io, ↵ .panel_handle = panel, ↵ .control_handle = nullptr, ↵ .buffer_size = static_cast<uint32_t>(width * 10), ↵ .double_buffer = false, ↵ .trans_size = 0, ↵ .hres = static_cast<uint32_t>((swap_xy) ? height : width), ↵ .vres = static_cast<uint32_t>((swap_xy) ? width : height), ↵ .monochrome = false, ↵ .rotation = ↵ { ↵ .swap_xy = swap_xy, ↵ .mirror_x = mirror_x, ↵ .mirror_y = mirror_y, ↵ }, ↵ .color_format = LV_COLOR_FORMAT_RGB565, ↵ .flags = ↵ { ↵ .buff_dma = 1, ↵ .buff_spiram = 0, ↵ .sw_rotate = 0, ↵ .swap_bytes = 1, ↵ .full_refresh = 0, ↵ .direct_mode = 0, ↵ }, ↵ }; ↵ g_display = lvgl_port_add_disp(&display_cfg); ↵ assert(g_display != nullptr); ↵ if (g_display == nullptr) { ↵ abort(); ↵ return; ↵ } ↵ if (offset_x != 0 &#124;&#124; offset_y != 0) { ↵ lv_display_set_offset(g_display, offset_x, offset_y); ↵ } ↵ } ↵ void InitDisplay() { ↵ printf("init display\n"); ↵ pinMode(kDisplayBacklightPin, OUTPUT); ↵ analogWrite(kDisplayBacklightPin, 255); ↵ spi_bus_config_t buscfg{ ↵ .mosi_io_num = kDisplayMosiPin, ↵ .miso_io_num = GPIO_NUM_NC, ↵ .sclk_io_num = kDisplayClkPin, ↵ .quadwp_io_num = GPIO_NUM_NC, ↵ .quadhd_io_num = GPIO_NUM_NC, ↵ .data4_io_num = GPIO_NUM_NC, ↵ .data5_io_num = GPIO_NUM_NC, ↵ .data6_io_num = GPIO_NUM_NC, ↵ .data7_io_num = GPIO_NUM_NC, ↵ .data_io_default_level = false, ↵ .max_transfer_sz = kDisplayWidth * kDisplayHeight * sizeof(uint16_t), ↵ .flags = 0, ↵ .isr_cpu_id = ESP_INTR_CPU_AFFINITY_AUTO, ↵ .intr_flags = 0, ↵ }; ↵ ESP_ERROR_CHECK(spi_bus_initialize(SPI3_HOST, &buscfg, SPI_DMA_CH_AUTO)); ↵ esp_lcd_panel_io_handle_t panel_io = nullptr; ↵ esp_lcd_panel_handle_t panel = nullptr; ↵ esp_lcd_panel_io_spi_config_t io_config = {}; ↵ io_config.cs_gpio_num = kDisplayCsPin; ↵ io_config.dc_gpio_num = kDisplayDcPin; ↵ io_config.spi_mode = kDisplaySpiMode; ↵ io_config.pclk_hz = kDisplayPclkHz; ↵ io_config.trans_queue_depth = 10; ↵ io_config.lcd_cmd_bits = 8; ↵ io_config.lcd_param_bits = 8; ↵ ESP_ERROR_CHECK(esp_lcd_new_panel_io_spi(SPI3_HOST, &io_config, &panel_io)); ↵ esp_lcd_panel_dev_config_t panel_config = {}; ↵ panel_config.reset_gpio_num = kDisplayRstPin; ↵ panel_config.rgb_ele_order = kDisplayRgbElementOrder; ↵ panel_config.bits_per_pixel = 16; ↵ ESP_ERROR_CHECK(esp_lcd_new_panel_st7789(panel_io, &panel_config, &panel)); ↵ esp_lcd_panel_reset(panel); ↵ esp_lcd_panel_init(panel); ↵ esp_lcd_panel_invert_color(panel, kDisplayInvertColor); ↵ esp_lcd_panel_swap_xy(panel, kDisplaySwapXY); ↵ esp_lcd_panel_mirror(panel, kDisplayMirrorX, kDisplayMirrorY); ↵ DisplayInit(panel_io, panel, kDisplayWidth, kDisplayHeight, 0, 0, kDisplayMirrorX, kDisplayMirrorY, kDisplaySwapXY); ↵ } ↵ InitDisplay();` |
| `aivox_config_ota_url` | Statement | ai_vox_ota_url(input_value) | `aivox_config_ota_url(text("value"))` | `ai_vox_engine.SetOtaUrl(1);` |
| `aivox_config_websocket` | Statement | ai_vox_websocket_url(input_value), ai_vox_websocket_param(input_value) | `aivox_config_websocket(text("value"), math_number(0))` | `ai_vox_engine.ConfigWebsocket(1, 1);` |
| `esp32ai_start_engine` | Statement | (none) | `esp32ai_start_engine()` | `#if AUDIO_INPUT_DEVICE_TYPE == AUDIO_INPUT_DEVICE_TYPE_I2S_STD ↵ auto audio_input_device = std::make_shared<ai_vox::AudioInputDeviceI2sStd>(kMicPinSck, kMicPinWs, kMicPinSd); ↵ #elif AUDIO_INPUT_DEVICE_TYPE == AUDIO_INPUT_DEVICE_TYPE_PDM ↵ auto audio_input_device = std::make_shared<ai_vox::PdmAudioInputDevice>(kMicPinSck, kMicPinSd); ↵ #endif ↵ ConfigureWifi(); ↵ printf("engine starting\n"); ↵ ai_vox_engine.Start(audio_input_device, g_audio_output_device); ↵ printf("engine started\n");` |
| `aivox_display_mode` | Statement | display_mode(dropdown) | `aivox_display_mode(normal)` | `No direct code emitted; updates display-mode generator state used by later blocks.` |
| `aivox3_set_es8311_volume` | Statement | aivox3_es8311_volume(input_value) | `aivox3_set_es8311_volume(math_number(0))` | `g_audio_output_device->set_volume(1);` |
| `aivox3_set_screen_light` | Statement | aivox3_screen_light(input_value) | `aivox3_set_screen_light(math_number(0))` | `if (kDisplayBacklightPin != GPIO_NUM_NC) { ↵ analogWrite(kDisplayBacklightPin, 1); ↵ }` |
| `esp32ai_wake_engine` | Statement | (none) | `esp32ai_wake_engine()` | `ai_vox::Engine::GetInstance().Advance();` |
| `esp32ai_sendtext` | Statement | sendmessage(input_value) | `esp32ai_sendtext(text("value"))` | `// 获取当前设备状态 ↵ esp32aicurrentState = ai_vox_engine.GetCurrentState(); ↵ // 如果设备状态不是kListening，先执行唤醒操作 ↵ if (esp32aicurrentState != ai_vox::ChatState::kListening) { ↵ // 执行唤醒 ↵ ai_vox::Engine::GetInstance().Advance(); ↵ // 等待设备状态变为kListening，最多等待6秒 ↵ unsigned long startTime = millis(); ↵ bool listeningStateReached = false; ↵ while (millis() - startTime < 6000) { ↵ esp32aicurrentState = ai_vox_engine.GetCurrentState(); ↵ if (esp32aicurrentState == ai_vox::ChatState::kListening) { ↵ listeningStateReached = true; ↵ break; ↵ } ↵ delay(100); // 每隔100ms检查一次状态 ↵ } ↵ // 如果6秒内没有进入kListening状态，直接结束 ↵ if (!listeningStateReached) { ↵ // 核心修改：移除break（原大括号内的break无意义，现在直接返回/终止逻辑） ↵ return; ↵ } ↵ // 核心修改2：将阻塞delay(1000)替换为非阻塞等待 ↵ unsigned long waitStartTime = millis(); ↵ bool waitCompleted = false; ↵ while (!waitCompleted) { ↵ // 检查是否已等待1000毫秒 ↵ if (millis() - waitStartTime >= 1000) { ↵ waitCompleted = true; ↵ } ↵ // 等待过程中持续检查设备状态，确保仍处于kListening ↵ esp32aicurrentState = ai_vox_engine.GetCurrentState(); ↵ if (esp32aicurrentState != ai_vox::ChatState::kListening) { ↵ // 状态异常，终止等待 ↵ return; ↵ } ↵ // 短暂延时，避免占用过多CPU资源 ↵ delayMicroseconds(100); ↵ } ↵ } ↵ // 执行发送文本操作 ↵ ai_vox_engine.SendText(std::string("{\"type\": \"listen\", \"state\": \"detect\", \"text\": \"") + String(1).c_str() + std::string("\"}"));` |
| `aivox_lcd_show_status` | Statement | location(dropdown), ai_vox_content(input_value) | `aivox_lcd_show_status(ShowStatus, math_number(0))` | `std::string chatRole;` |
| `esp32ai_state_change_root` | Hat | STATE_HANDLERS(input_statement) | `esp32ai_state_change_root()` | `std::shared_ptr<ai_vox::Observer> g_observer = std::make_shared<ai_vox::Observer>(); ↵ // 将观察者设置到 AI 引擎 ↵ ai_vox::Engine::GetInstance().SetObserver(g_observer); ↵ void HandleStateChangedEvent(const ai_vox::StateChangedEvent& event) { ↵ // 提取当前状态 ↵ auto currentState = event.new_state; ↵ // 根据当前状态执行相应的处理逻辑 ↵ switch (currentState) { ↵ default: ↵ break; ↵ } ↵ } ↵ // 从观察者获取并处理所有待处理事件 ↵ if (g_observer) { ↵ const auto events = g_observer->PopEvents(); ↵ for (const auto& event : events) { ↵ if (auto state_changed_event = std::get_if<ai_vox::StateChangedEvent>(&event)) { ↵ HandleStateChangedEvent(*state_changed_event); ↵ } ↵ } ↵ }` |
| `esp32ai_state_change_case` | Statement | STATE(dropdown), DO(input_statement) | `esp32ai_state_change_case(kIdle)` | `case ai_vox::ChatState::kIdle: ↵ break;` |
| `aivox3_ST77789TurnOnBacklight_engine` | Statement | (none) | `aivox3_ST77789TurnOnBacklight_engine()` | `g_display->TurnOnBacklight();` |
| `aivox3_ST77789TurnOffBacklight_engine` | Statement | (none) | `aivox3_ST77789TurnOffBacklight_engine()` | `g_display->TurnOffBacklight();` |
| `esp32ai_loop_activation` | Hat | STATE_HANDLERS(input_statement) | `esp32ai_loop_activation()` | `std::shared_ptr<ai_vox::Observer> g_observer = std::make_shared<ai_vox::Observer>(); ↵ // 将观察者设置到 AI 引擎 ↵ ai_vox::Engine::GetInstance().SetObserver(g_observer); ↵ void HandleActivationEvent(const ai_vox::ActivationEvent& event) { ↵ const char* code = event.code.c_str(); ↵ const char* message = event.message.c_str(); ↵ } ↵ // 从观察者获取并处理所有待处理事件 ↵ if (g_observer) { ↵ const auto events = g_observer->PopEvents(); ↵ for (const auto& event : events) { ↵ if (auto state_changed_event = std::get_if<ai_vox::StateChangedEvent>(&event)) { ↵ HandleStateChangedEvent(*state_changed_event); ↵ } else if (auto activation_event = std::get_if<ai_vox::ActivationEvent>(&event)) { ↵ HandleActivationEvent(*activation_event); ↵ } ↵ } ↵ }` |
| `get_aivox_activation_message` | Value | activation_type(dropdown) | `get_aivox_activation_message(code)` | `code` |
| `esp32ai_loop_emotion` | Hat | STATE_HANDLERS(input_statement) | `esp32ai_loop_emotion()` | `std::shared_ptr<ai_vox::Observer> g_observer = std::make_shared<ai_vox::Observer>(); ↵ // 将观察者设置到 AI 引擎 ↵ ai_vox::Engine::GetInstance().SetObserver(g_observer); ↵ void HandleEmotionEvent(const ai_vox::EmotionEvent& event) { ↵ auto&& emotion = event.emotion; ↵ } ↵ // 从观察者获取并处理所有待处理事件 ↵ if (g_observer) { ↵ const auto events = g_observer->PopEvents(); ↵ for (const auto& event : events) { ↵ if (auto state_changed_event = std::get_if<ai_vox::StateChangedEvent>(&event)) { ↵ HandleStateChangedEvent(*state_changed_event); ↵ } else if (auto activation_event = std::get_if<ai_vox::ActivationEvent>(&event)) { ↵ HandleActivationEvent(*activation_event); ↵ } else if (auto emotion_event = std::get_if<ai_vox::EmotionEvent>(&event)) { ↵ HandleEmotionEvent(*emotion_event); ↵ } ↵ } ↵ }` |
| `get_aivox_emotion_result` | Value | (none) | `get_aivox_emotion_result()` | `emotion.c_str()` |
| `aivox_emotion` | Value | emotion(dropdown) | `aivox_emotion(happy)` | `emotion == "happy"` |
| `aivox_emotion_list` | Value | emotion(dropdown) | `aivox_emotion_list(happy)` | `"happy"` |
| `esp32ai_loop_chat_message` | Hat | STATE_HANDLERS(input_statement) | `esp32ai_loop_chat_message()` | `std::shared_ptr<ai_vox::Observer> g_observer = std::make_shared<ai_vox::Observer>(); ↵ // 将观察者设置到 AI 引擎 ↵ ai_vox::Engine::GetInstance().SetObserver(g_observer); ↵ void HandleChatMessageEvent(const ai_vox::ChatMessageEvent& event) { ↵ auto role = event.role; ↵ auto message = event.content; ↵ if (role == ai_vox::ChatRole::kAssistant) { ↵ chatRole = "Assistant"; ↵ } else if (role == ai_vox::ChatRole::kUser) { ↵ chatRole = "User"; ↵ } else { ↵ chatRole = "System"; ↵ } ↵ } ↵ // 从观察者获取并处理所有待处理事件 ↵ if (g_observer) { ↵ const auto events = g_observer->PopEvents(); ↵ for (const auto& event : events) { ↵ if (auto state_changed_event = std::get_if<ai_vox::StateChangedEvent>(&event)) { ↵ HandleStateChangedEvent(*state_changed_event); ↵ } else if (auto activation_event = std::get_if<ai_vox::ActivationEvent>(&event)) { ↵ HandleActivationEvent(*activation_event); ↵ } else if (auto emotion_event = std::get_if<ai_vox::EmotionEvent>(&event)) { ↵ HandleEmotionEvent(*emotion_event); ↵ } else if (auto chat_message_event = std::get_if<ai_vox::ChatMessageEvent>(&event)) { ↵ HandleChatMessageEvent(*chat_message_event); ↵ } ↵ } ↵ }` |
| `aivox_loop_chat_message_role_var` | Value | chat_role(dropdown) | `aivox_loop_chat_message_role_var(Assistant)` | `role == ai_vox::ChatRole::kAssistant` |
| `aivox_mcp_register_control_command` | Statement | MODE(dropdown), NAME(input_value), INPUT0(input_value); variadic: INPUT{1...}(input_value) | `aivox_mcp_register_control_command(regular, math_number(0), math_number(0), INPUT1=aivox_mcp_control_param("level", Number, math_number(0), math_number(100)))` | `auto& ai_vox_engine = ai_vox::Engine::GetInstance(); ↵ ai_vox_engine.SetObserver(g_observer); ↵ ai_vox_engine.AddMcpTool("self..set", // tool name ↵ "", ↵ { ↵ } ↵ ); ↵ ai_vox_engine.AddMcpTool("self..get", // tool name ↵ "", ↵ { ↵ // empty ↵ } ↵ );` |
| `aivox_mcp_control_param` | Value | VAR(field_input), TYPE(dropdown); runtime variants: boolean-parameter: (none); number-parameter: MIN(input_value), MAX(input_value); string-parameter: (none) | `aivox_mcp_control_param("state", Boolean)` | `"state", ai_vox::ParamSchema<bool>{.default_value = std::nullopt},` |
| `esp32ai_mcp_control_param` | Statement | VAR(field_input), TYPE(dropdown); runtime variants: boolean-parameter: (none); number-parameter: MIN(input_value), MAX(input_value); string-parameter: (none) | `esp32ai_mcp_control_param("state", Boolean)` | `{"state", ai_vox::ParamSchema<bool>{.default_value = std::nullopt}},` |
| `aivox_mcp_control` | Value | VAR(field_input), DESC(input_value) | `aivox_mcp_control("led", math_number(0))` | `"led", 1` |
| `aivox_loop_chat_message_msg_var` | Value | (none) | `aivox_loop_chat_message_msg_var()` | `message.c_str()` |
| `esp32ai_loop_mcp` | Hat | STATE_HANDLERS(input_statement) | `esp32ai_loop_mcp()` | `std::shared_ptr<ai_vox::Observer> g_observer = std::make_shared<ai_vox::Observer>(); ↵ // 将观察者设置到 AI 引擎 ↵ ai_vox::Engine::GetInstance().SetObserver(g_observer); ↵ void HandleMcpToolCallEvent(const ai_vox::McpToolCallEvent& event) { ↵ auto id = event.id; ↵ auto name = event.name; ↵ } ↵ // 从观察者获取并处理所有待处理事件 ↵ if (g_observer) { ↵ const auto events = g_observer->PopEvents(); ↵ for (const auto& event : events) { ↵ if (auto state_changed_event = std::get_if<ai_vox::StateChangedEvent>(&event)) { ↵ HandleStateChangedEvent(*state_changed_event); ↵ } else if (auto activation_event = std::get_if<ai_vox::ActivationEvent>(&event)) { ↵ HandleActivationEvent(*activation_event); ↵ } else if (auto emotion_event = std::get_if<ai_vox::EmotionEvent>(&event)) { ↵ HandleEmotionEvent(*emotion_event); ↵ } else if (auto chat_message_event = std::get_if<ai_vox::ChatMessageEvent>(&event)) { ↵ HandleChatMessageEvent(*chat_message_event); ↵ } else if (auto mcp_tool_call_event = std::get_if<ai_vox::McpToolCallEvent>(&event)) { ↵ HandleMcpToolCallEvent(*mcp_tool_call_event); ↵ } ↵ } ↵ }` |
| `esp32ai_loop_mcp_new` | Hat | MODE(dropdown), VAR(field_input), DESC(input_value), params_list(input_statement); runtime variants: regular-set-and-report: setCODE_BLOCK(input_statement), CODE_BLOCK(input_statement); set-only: setCODE_BLOCK(input_statement); report-only: CODE_BLOCK(input_statement) | `esp32ai_loop_mcp_new(regular, "led", math_number(0))` | `std::shared_ptr<ai_vox::Observer> g_observer = std::make_shared<ai_vox::Observer>(); ↵ auto& ai_vox_engine = ai_vox::Engine::GetInstance(); ↵ ai_vox::Engine::GetInstance().SetObserver(g_observer); ↵ ai_vox_engine.AddMcpTool("self.led.set", ↵ "1", ↵ { ↵ // no parameters ↵ } ↵ ); ↵ ai_vox_engine.AddMcpTool("self.led.get", ↵ "1", ↵ { ↵ // empty ↵ } ↵ ); ↵ void HandleMcpToolCallEvent(const ai_vox::McpToolCallEvent& event) { ↵ auto id = event.id; ↵ auto name = event.name; ↵ // 暂无MCP服务处理逻辑 ↵ } ↵ if (g_observer) { ↵ const auto events = g_observer->PopEvents(); ↵ for (const auto& event : events) { ↵ if (auto state_changed_event = std::get_if<ai_vox::StateChangedEvent>(&event)) { ↵ HandleStateChangedEvent(*state_changed_event); ↵ } else if (auto activation_event = std::get_if<ai_vox::ActivationEvent>(&event)) { ↵ HandleActivationEvent(*activation_event); ↵ } else if (auto emotion_event = std::get_if<ai_vox::EmotionEvent>(&event)) { ↵ HandleEmotionEvent(*emotion_event); ↵ } else if (auto chat_message_event = std::get_if<ai_vox::ChatMessageEvent>(&event)) { ↵ HandleChatMessageEvent(*chat_message_event); ↵ } else if (auto mcp_tool_call_event = std::get_if<ai_vox::McpToolCallEvent>(&event)) { ↵ HandleMcpToolCallEvent(*mcp_tool_call_event); ↵ } ↵ } ↵ }` |
| `aivox_get_iot_message_event_name_new` | Value | VAR(field_variable) | `aivox_get_iot_message_event_name_new($led)` | `"self.led.set" == name` |
| `aivox_control_message_event_fuction` | Value | VAR(field_variable), PVAR(field_variable) | `aivox_control_message_event_fuction($led, $state)` | `(event.param<bool>("state") != nullptr) ? *event.param<bool>("state") : false` |
| `aivox_response_mcp_control_result_new` | Statement | VAR(field_variable) | `aivox_response_mcp_control_result_new($led)` | `ai_vox_engine.SendMcpCallResponse(id, true);` |
| `aivox_update_mcp_control_state_new` | Statement | VAR(field_variable), PVAR(field_variable), STATE(input_value) | `aivox_update_mcp_control_state_new($led, $state, math_number(0))` | `if ("self.led.set" == name) { ↵ const bool* param_ptr = event.param<bool>("state"); ↵ if (param_ptr != nullptr) { ↵ 1 = *param_ptr; ↵ } else { ↵ printf("Warning: Parameter 'state' not found for 'self.led.set'.\n"); ↵ } ↵ ai_vox_engine.SendMcpCallResponse(id, true); ↵ } ↵ else if ("self.led.get" == name) { ↵ ai_vox_engine.SendMcpCallResponse(id, 1); ↵ }` |
| `aivox_calculateupdate_mcp_control_state` | Statement | VAR(field_variable), PVAR(field_variable), CODE_BLOCK(input_statement) | `aivox_calculateupdate_mcp_control_state($led, $state)` | `if ("self.led.get" == name) { ↵ bool state; ↵ ai_vox_engine.SendMcpCallResponse(id, state); ↵ }` |
| `esp32ai_selget_mcp_control` | Statement | VAR(field_variable); runtime variants: set-and-report-handlers: setCODE_BLOCK(input_statement), CODE_BLOCK(input_statement) | `esp32ai_selget_mcp_control($led)` | `No direct code emitted when both dynamic statement inputs are empty.` |
| `lvgl_port_lock` | Value | TIMEOUT_MS(field_number) | `lvgl_port_lock(1000)` | `lvgl_port_lock(1000)` |
| `lvgl_port_unlock` | Statement | (none) | `lvgl_port_unlock()` | `lvgl_port_unlock();` |
| `esp32ai_lvgl_obj_set_style_text_font` | Statement | VAR(field_variable), FONT(dropdown) | `esp32ai_lvgl_obj_set_style_text_font($obj, font_puhui_14_1)` | `lv_obj_set_style_text_font(obj, &font_puhui_14_1, 0);` |
| `esp32ai_emotion_select` | Value | CATEGORY(dropdown); runtime variants: emoji-icon: ICON(dropdown); battery-icon: ICON(dropdown) | `esp32ai_emotion_select(EMOJI, FONT_AWESOME_EMOJI_HAPPY)` | `ICON` |
| `lvgl_label_set_text_emotion` | Statement | VAR(field_variable), TEXT(input_value) | `lvgl_label_set_text_emotion($label, text("value"))` | `lv_label_set_text(label, 1);` |
| `lvgl_label_set_text_cpemotion` | Statement | VAR(field_variable), TEXT(input_value) | `lvgl_label_set_text_cpemotion($label, text("value"))` | `lv_label_set_text(label, get_emotion_icon(1));` |
| `aivox3_init_es8311` | Statement | (none); runtime variants: es8311-pins-and-bus: ES8311_SDA(dropdown), ES8311_SCL(dropdown), ES8311_MCLK(dropdown), ES8311_SCLK(dropdown), ES8311_LRCK(dropdown), ES8311_DSDIN(dropdown), ES8311_DSDOUT(dropdown), ES8311_I2C_ADDRESS(input_value), ES8311_RATE(input_value), ES8311_IIC_PORT(dropdown) | `aivox3_init_es8311(41, 42, 46, 39, 2, 38, 40, math_number(48), math_number(16000), I2C_NUM_0)` | `int esp32ai_rate=1; ↵ i2c_master_bus_handle_t g_i2c_master_bus_handle = nullptr; ↵ std::shared_ptr<ai_vox::AudioDeviceEs8311> g_audio_output_device; ↵ std::shared_ptr<ai_vox::AudioDeviceEs8311> g_audio_input_device; ↵ void InitI2cBus() { ↵ const i2c_master_bus_config_t i2c_master_bus_config = { ↵ .i2c_port = ES8311_IIC_PORT, ↵ .sda_io_num = GPIO_NUM_ES8311_SDA, ↵ .scl_io_num = GPIO_NUM_ES8311_SCL, ↵ .clk_source = I2C_CLK_SRC_DEFAULT, ↵ .glitch_ignore_cnt = 7, ↵ .intr_priority = 0, ↵ .trans_queue_depth = 0, ↵ .flags = ↵ { ↵ .enable_internal_pullup = 1, ↵ .allow_pd = 0, ↵ }, ↵ }; ↵ ESP_ERROR_CHECK(i2c_new_master_bus(&i2c_master_bus_config, &g_i2c_master_bus_handle)); ↵ } ↵ InitI2cBus(); ↵ g_audio_output_device = std::make_shared<ai_vox::AudioDeviceEs8311>(g_i2c_master_bus_handle, 1, ES8311_IIC_PORT, 1, GPIO_NUM_ES8311_MCLK, GPIO_NUM_ES8311_SCLK, GPIO_NUM_ES8311_LRCK, GPIO_NUM_ES8311_DSDOUT, GPIO_NUM_ES8311_DSDIN);` |
| `esp32ai_init_es8388` | Statement | (none); runtime variants: es8388-pins-and-bus: ES8388_SDA(dropdown), ES8388_SCL(dropdown), ES8388_MCLK(dropdown), ES8388_SCLK(dropdown), ES8388_LRCK(dropdown), ES8388_DSDIN(dropdown), ES8388_DSDOUT(dropdown), ES8388_I2C_ADDRESS(input_value), ES8388_RATE(input_value), ES8388_IIC_PORT(dropdown) | `esp32ai_init_es8388(41, 42, 46, 39, 2, 38, 40, math_number(16), math_number(44100), I2C_NUM_0)` | `int esp32ai_rate=1; ↵ i2c_master_bus_handle_t g_i2c_master_bus_handle = nullptr; ↵ std::shared_ptr<ai_vox::AudioDeviceEs8388> g_audio_output_device; ↵ void InitI2cBus() { ↵ const i2c_master_bus_config_t i2c_master_bus_config = { ↵ .i2c_port = ES8388_IIC_PORT, ↵ .sda_io_num = GPIO_NUM_ES8388_SDA, ↵ .scl_io_num = GPIO_NUM_ES8388_SCL, ↵ .clk_source = I2C_CLK_SRC_DEFAULT, ↵ .glitch_ignore_cnt = 7, ↵ .intr_priority = 0, ↵ .trans_queue_depth = 0, ↵ .flags = ↵ { ↵ .enable_internal_pullup = 1, ↵ .allow_pd = 0, ↵ }, ↵ }; ↵ ESP_ERROR_CHECK(i2c_new_master_bus(&i2c_master_bus_config, &g_i2c_master_bus_handle)); ↵ } ↵ InitI2cBus(); ↵ g_audio_output_device = std::make_shared<ai_vox::AudioDeviceEs8388>( ↵ g_i2c_master_bus_handle, ↵ 1, ↵ ES8388_IIC_PORT, ↵ 1, ↵ GPIO_NUM_ES8388_MCLK, ↵ GPIO_NUM_ES8388_SCLK, ↵ GPIO_NUM_ES8388_LRCK, ↵ GPIO_NUM_ES8388_DSDIN, ↵ GPIO_NUM_ES8388_DSDOUT, ↵ GPIO_NUM_NC, ↵ false ↵ );` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TASK | 1, 2, 3, 4, 5, 6, 7, 8 | esp32_task |
| CORE | 0, 1 | esp32_task |
| SERIAL_PORT | Serial, Serial1, Serial2 | esp32_serial_init |
| BAUDRATE | 9600, 19200, 38400, 57600, 115200, 256000, 500000 | esp32_serial_init |
| PIN_MODE | INPUT, INPUT_PULLUP | esp32ai_button_setup |
| ACTIVE_LOW | TRUE, FALSE | esp32ai_button_setup |
| MODE | Manual | esp32ai_init_wifi |
| MIC_TYPE | AUDIO_INPUT_DEVICE_TYPE_I2S_STD, AUDIO_INPUT_DEVICE_TYPE_PDM | esp32_i2s_mic_setup |
| DISPLAY_TYPE | ST7789, SSD1306 | esp32ai_init_display |
| DISPLAY_TYPE | nST7789, nSSD1306 | esp32ai_init_nlvgl_display |
| ROTATION | LV_DISPLAY_ROTATION_0, LV_DISPLAY_ROTATION_90, LV_DISPLAY_ROTATION_180, LV_DISPLAY_ROTATION_270 | esp32ai_init_nlvgl_display |
| display_mode | normal, wechat | aivox_display_mode |
| location | ShowStatus, SetEmotion, SetChatMessage | aivox_lcd_show_status |
| STATE | kIdle, kInitted, kLoading, kLoadingFailed, kStandby, kConnecting, kListening, kSpeaking | esp32ai_state_change_case |
| activation_type | code, message | get_aivox_activation_message |
| emotion | happy, cool, laughing, funny, sad, angry, crying, loving, embarrassed, surprised, shocked, thinking, winking, relaxed, delicious, kissy, confident, sleepy, silly, confused | aivox_emotion, aivox_emotion_list |
| chat_role | Assistant, User | aivox_loop_chat_message_role_var |
| MODE | regular, set_only, report_only | aivox_mcp_register_control_command, esp32ai_loop_mcp_new |
| TYPE | Boolean, Number, String | aivox_mcp_control_param, esp32ai_mcp_control_param |
| FONT | font_puhui_14_1, font_awesome_30_1, font_awesome_14_1, font_puhui_16_4, font_awesome_30_4, font_awesome_16_4, font_emoji_32_init() | esp32ai_lvgl_obj_set_style_text_font |
| CATEGORY | EMOJI, BATTERY, WIFI, SIGNAL, VOLUME, MEDIA, ARROW, FUNCTION | esp32ai_emotion_select |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_serial_init(Serial, RX_PIN, TX_PIN, "9600")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, get_aivox_activation_message(code))
    time_delay(math_number(1000))
```

## Notes

`esp32ai_init_display` adds `WIDTH` and `HEIGHT` numeric fields after its pin fields.
For a 240×320 ST7789 panel, use `esp32ai_init_display(ST7789, 27, 13, 14, 33, 2, 5, 240, 320)`.
The SSD1306 variant uses `esp32ai_init_display(SSD1306, 22, 21, 128, 64)`.
Dimensions must match the panel; legacy blocks without size fields keep their original defaults.

1. **Variable**: `aivox_mcp_control_param("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Runtime shape**: WiFi, microphone, display, codec, MCP parameter, MCP handler, and emotion blocks use the exact mode-dependent signatures shown in the block table and Runtime Variant Examples. MCP registration uses named indexed `INPUT1...` inputs, while handler bodies use the named statement markers `@setCODE_BLOCK:` and `@CODE_BLOCK:`.

## Runtime Variant Examples

### Runtime Variant: esp32_i2s_mic_setup/pdm
```abs
arduino_setup()
    esp32_i2s_mic_setup(AUDIO_INPUT_DEVICE_TYPE_PDM, 13, 11)
```

### Runtime Variant: esp32ai_init_display/ssd1306-i2c
```abs
arduino_setup()
    esp32ai_init_display(SSD1306, 22, 21, 128, 64)
```

### Runtime Variant: esp32ai_init_nlvgl_display/ssd1306-i2c-lvgl
```abs
arduino_setup()
    esp32ai_init_nlvgl_display(nSSD1306, LV_DISPLAY_ROTATION_0, 128, 64, 22, 21, 1, 7168, -1, 500, 50)
```

### Runtime Variant: aivox_mcp_control_param/number-parameter
```abs
arduino_loop()
    serial_println(Serial, aivox_mcp_control_param("state", Number, math_number(0), math_number(100)))
```

### Runtime Variant: aivox_mcp_control_param/string-parameter
```abs
arduino_loop()
    serial_println(Serial, aivox_mcp_control_param("state", String))
```

### Runtime Variant: esp32ai_mcp_control_param/number-parameter
```abs
arduino_loop()
    esp32ai_mcp_control_param("state", Number, math_number(0), math_number(100))
```

### Runtime Variant: esp32ai_mcp_control_param/string-parameter
```abs
arduino_loop()
    esp32ai_mcp_control_param("state", String)
```

### Runtime Variant: esp32ai_loop_mcp_new/regular-set-and-report
```abs
esp32ai_loop_mcp_new(regular, "led", math_number(0))
    @setCODE_BLOCK:
        serial_println(Serial, text("set"))
    @CODE_BLOCK:
        serial_println(Serial, text("report"))
```

### Runtime Variant: esp32ai_loop_mcp_new/set-only
```abs
esp32ai_loop_mcp_new(set_only, "led", math_number(0))
    @setCODE_BLOCK:
        serial_println(Serial, text("set"))
```

### Runtime Variant: esp32ai_loop_mcp_new/report-only
```abs
esp32ai_loop_mcp_new(report_only, "led", math_number(0))
    @CODE_BLOCK:
        serial_println(Serial, text("report"))
```

### Runtime Variant: esp32ai_emotion_select/battery-icon
```abs
arduino_loop()
    serial_println(Serial, esp32ai_emotion_select(BATTERY, FONT_AWESOME_BATTERY_FULL))
```

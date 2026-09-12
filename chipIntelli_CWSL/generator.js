'use strict';

function ensureChipIntelliCWSL(generator) {
  generator.addLibrary('chipintelli_cwsl', '#include <ChipIntelliCWSL.h>');
}

function ensureChipIntelliCWSLEvent(generator) {
  ensureChipIntelliCWSL(generator);
  generator.addVariable('chipintelli_cwsl_event', 'ChipIntelliCWSLEvent ailyChipIntelliCWSLEvent = {};');
}

function chipIntelliCWSLValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function ensureChipIntelliCWSLIds(generator) {
  ensureChipIntelliCWSL(generator);
  // Reject out-of-range IDs before narrowing so values such as group 65536
  // cannot wrap around to a valid group and modify another template.
  generator.addFunction('chipintelli_cwsl_command_id',
    'static constexpr uint32_t ailyChipIntelliCWSLCommandId(int64_t value) {\n' +
    '  return value >= 0 && value <= UINT16_MAX ? static_cast<uint32_t>(value) : UINT32_MAX;\n' +
    '}');
  generator.addFunction('chipintelli_cwsl_group_id',
    'static constexpr uint16_t ailyChipIntelliCWSLGroupId(int64_t value) {\n' +
    '  return value >= 0 && value <= UINT8_MAX ? static_cast<uint16_t>(value) : UINT16_MAX;\n' +
    '}');
}

Arduino.forBlock['chipintelli_cwsl_init'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  const timeout = chipIntelliCWSLValue(block, generator, 'TIMEOUT', '10000');
  return 'ChipIntelliCWSL.begin((uint32_t)max(0L, (long)(' + timeout + ')));\n';
};

Arduino.forBlock['chipintelli_cwsl_end'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  return 'ChipIntelliCWSL.end();\n';
};

Arduino.forBlock['chipintelli_cwsl_learn'] = function(block, generator) {
  ensureChipIntelliCWSLIds(generator);
  const commandId = chipIntelliCWSLValue(block, generator, 'COMMAND_ID', '2');
  const groupId = chipIntelliCWSLValue(block, generator, 'GROUP_ID', '0');
  const method = block.getFieldValue('WORD_TYPE') === 'WAKE' ? 'learnWakeWord' : 'learnCommand';
  return 'ChipIntelliCWSL.' + method + '(ailyChipIntelliCWSLCommandId(' + commandId + '), ailyChipIntelliCWSLGroupId(' + groupId + '));\n';
};

Arduino.forBlock['chipintelli_cwsl_cancel_learning'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  return 'ChipIntelliCWSL.cancelLearning();\n';
};

Arduino.forBlock['chipintelli_cwsl_erase_template'] = function(block, generator) {
  ensureChipIntelliCWSLIds(generator);
  const commandId = chipIntelliCWSLValue(block, generator, 'COMMAND_ID', '2');
  const groupId = chipIntelliCWSLValue(block, generator, 'GROUP_ID', '0');
  const method = block.getFieldValue('WORD_TYPE') === 'WAKE' ? 'eraseWakeWord' : 'eraseCommand';
  return 'ChipIntelliCWSL.' + method + '(ailyChipIntelliCWSLCommandId(' + commandId + '), ailyChipIntelliCWSLGroupId(' + groupId + '));\n';
};

Arduino.forBlock['chipintelli_cwsl_erase_templates'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  const methods = {COMMANDS: 'eraseCommands', WAKE_WORDS: 'eraseWakeWords', ALL: 'eraseAll'};
  const method = methods[block.getFieldValue('SCOPE')] || methods.ALL;
  return 'ChipIntelliCWSL.' + method + '();\n';
};

Arduino.forBlock['chipintelli_cwsl_read_events'] = function(block, generator) {
  ensureChipIntelliCWSLEvent(generator);
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  return 'while (ChipIntelliCWSL.read(ailyChipIntelliCWSLEvent)) {\n' + handler + '}\n';
};

Arduino.forBlock['chipintelli_cwsl_profile_enabled'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  return ['ChipIntelliCWSL.profileEnabled()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_available'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  return ['ChipIntelliCWSL.available()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_state'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  return ['static_cast<uint8_t>(ChipIntelliCWSL.state())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_state_value'] = function(block, generator) {
  const value = block.getFieldValue('STATE');
  return [['0', '1', '2', '3', '255'].indexOf(value) >= 0 ? value : '0', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_count'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  const methods = {
    COMMAND: 'commandCount', WAKE: 'wakeWordCount', TEMPLATE: 'templateCount',
    REMAINING: 'remainingTemplates', MAX: 'maxTemplates'
  };
  const method = methods[block.getFieldValue('COUNT_TYPE')] || methods.TEMPLATE;
  return ['ChipIntelliCWSL.' + method + '()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_dropped_events'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  return ['ChipIntelliCWSL.droppedEvents()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_event_type'] = function(block, generator) {
  ensureChipIntelliCWSLEvent(generator);
  return ['static_cast<uint8_t>(ailyChipIntelliCWSLEvent.type)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_event_word_type'] = function(block, generator) {
  ensureChipIntelliCWSLEvent(generator);
  return ['static_cast<uint8_t>(ailyChipIntelliCWSLEvent.wordType)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_event_attempt'] = function(block, generator) {
  ensureChipIntelliCWSLEvent(generator);
  return ['ailyChipIntelliCWSLEvent.attempt', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_event_result'] = function(block, generator) {
  ensureChipIntelliCWSLEvent(generator);
  return ['static_cast<uint8_t>(ailyChipIntelliCWSLEvent.result)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_event_command_id'] = function(block, generator) {
  ensureChipIntelliCWSLEvent(generator);
  return ['ailyChipIntelliCWSLEvent.commandId', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_event_group_id'] = function(block, generator) {
  ensureChipIntelliCWSLEvent(generator);
  return ['ailyChipIntelliCWSLEvent.groupId', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_event_distance'] = function(block, generator) {
  ensureChipIntelliCWSLEvent(generator);
  return ['ailyChipIntelliCWSLEvent.distance', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_event_type_value'] = function(block, generator) {
  const value = block.getFieldValue('EVENT_TYPE');
  return [['1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(value) >= 0 ? value : '1', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_learn_result_value'] = function(block, generator) {
  const value = block.getFieldValue('RESULT');
  return [['0', '1', '2', '3', '4', '5', '6'].indexOf(value) >= 0 ? value : '0', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_is_begun'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  return ['ChipIntelliCWSL.isBegun()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_last_error'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  return ['static_cast<uint8_t>(ChipIntelliCWSL.lastError())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_error_value'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  const errors = {
    '0': 'None', '1': 'ProfileDisabled', '2': 'SDKStartFailed',
    '3': 'SDKFailed', '4': 'Timeout', '5': 'RequestRejected'
  };
  const error = errors[block.getFieldValue('ERROR')] || errors['0'];
  return ['static_cast<uint8_t>(ChipIntelliCWSLClass::Error::' + error + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_error_string'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  return ['String(ChipIntelliCWSL.errorString())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_state_name'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  return ['String(ChipIntelliCWSL.stateName(ChipIntelliCWSL.state()))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_event_name'] = function(block, generator) {
  ensureChipIntelliCWSLEvent(generator);
  const names = {
    TYPE: ['eventName', 'type'],
    RESULT: ['resultName', 'result'],
    WORD_TYPE: ['wordTypeName', 'wordType']
  };
  const selected = names[block.getFieldValue('DETAIL')] || names.TYPE;
  return ['String(ChipIntelliCWSL.' + selected[0] + '(ailyChipIntelliCWSLEvent.' + selected[1] + '))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_pending_events'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  return ['ChipIntelliCWSL.pendingEvents()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_clear_events'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  return 'ChipIntelliCWSL.clearEvents();\n';
};

Arduino.forBlock['chipintelli_cwsl_dropped_read_events'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  return ['ChipIntelliCWSL.droppedReadEvents()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_dropped_callback_events'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  return ['ChipIntelliCWSL.droppedCallbackEvents()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_word_type_value'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  const words = {'0': 'CWSLCommandWord', '1': 'CWSLWakeWord', '2': 'CWSLAllWords'};
  const word = words[block.getFieldValue('WORD_TYPE')] || words['0'];
  return ['static_cast<uint8_t>(' + word + ')', generator.ORDER_ATOMIC];
};

const CHIPINTELLI_CWSL_VOICE_CONTROLLER = String.raw`
// Generated once for the managed voice-learning blocks. All SDK control runs
// in loop; the Audio task only writes the completion flag.
class AilyChipIntelliVoiceLearning {
 public:
  enum Phase : uint8_t { Idle, Pending, PromptPending, Prompt, Quiet,
    Learning, Deleting, FeedbackPending, Feedback, FeedbackQuiet };
  bool ready = false;
  const char *error = "not initialized";

  void begin(uint32_t command, uint32_t wake, uint16_t group,
             uint16_t commandPrompt, uint16_t wakePrompt,
             uint16_t successPrompt, uint16_t failurePrompt) {
    commandId = command; wakeId = wake; groupId = group;
    voices[0] = commandPrompt; voices[1] = wakePrompt;
    voices[2] = successPrompt; voices[3] = failurePrompt;
    const bool asrReady = ChipIntelliASR.begin();
    const bool audioReady = ChipIntelliAudio.begin();
    const bool cwslReady = ChipIntelliCWSL.begin();
    ready = asrReady && audioReady && cwslReady;
    error = ready ? "none" : "initialization failed; check CWSL profile and Audio initialization";
    dropped = ChipIntelliCWSL.droppedReadEvents();
    if (!ready) finish(false, error);
  }

  bool busy() const {
    const auto state = ChipIntelliCWSL.state();
    return phase != Idle || state == CWSLLearning || state == CWSLDeleting;
  }

  // 1/2 first learning; 3/4 explicit replacement; 5/6 targeted deletion.
  void request(uint8_t action) {
    if (busy() || ChipIntelliAudio.isPlaying()) return;
    if (!ready) { finish(false, "learning unavailable; check initialization or restart after failure"); return; }
    if (action < 1 || action > 6) return;
    wakeTarget = action == 2 || action == 4 || action == 6;
    targetId = wakeTarget ? wakeId : commandId;
    replace = action == 3 || action == 4;
    erase = action >= 3;
    error = "none";
    transition(Pending);
  }

  void tick() {
    ChipIntelliCWSLEvent event;
    while (ChipIntelliCWSL.read(event)) handle(event);
    const uint32_t lost = ChipIntelliCWSL.droppedReadEvents();
    if (lost != dropped) {
      dropped = lost;
      if (phase == Learning || phase == Deleting) {
        ready = false;
        finish(false, "CWSL events lost; restart before further learning");
      }
    }
    const uint32_t elapsed = millis() - since;
    switch (phase) {
      case Idle: break;
      case Pending:
        if (!engineAvailable() || ChipIntelliAudio.isPlaying()) {
          if (elapsed >= timeoutMs) finish(false, "engine busy");
          break;
        }
        if (!erase) { transition(PromptPending); break; }
        // A zero category count proves the target absent; a positive count
        // does not prove it present. Always delete only the configured target.
        {
          const int count = wakeTarget ? ChipIntelliCWSL.wakeWordCount() : ChipIntelliCWSL.commandCount();
          if (count < 0) { finish(false, "template count unavailable"); break; }
          if (count == 0) {
            if (replace) transition(PromptPending);
            else finish(true, "none");
            break;
          }
          const bool accepted = wakeTarget
            ? ChipIntelliCWSL.eraseWakeWord(targetId, groupId)
            : ChipIntelliCWSL.eraseCommand(targetId, groupId);
          if (accepted) transition(Deleting);
          else finish(false, ChipIntelliCWSL.errorString());
        }
        break;
      case PromptPending:
      case FeedbackPending:
        if (ChipIntelliAudio.isPlaying() ||
            (ChipIntelliCWSL.isBegun() && !engineAvailable())) {
          if (elapsed >= timeoutMs) {
            error = "engine/audio did not become idle; restart if still busy";
            ready = false;
            transition(Idle);
          }
          break;
        }
        startAudio(phase == PromptPending);
        break;
      case Prompt:
      case Feedback:
        if (audioDone && !ChipIntelliAudio.isPlaying()) {
          ChipIntelliAudio.onFinished(nullptr);
          transition(phase == Prompt ? Quiet : FeedbackQuiet);
        } else if (elapsed >= timeoutMs) {
          const bool wasPrompt = phase == Prompt;
          ChipIntelliAudio.onFinished(nullptr);
          ChipIntelliAudio.stop();
          error = "prompt completion timeout; recording was not started";
          // Never treat a timeout as permission to record. Retire callbacks
          // and wait for stop/quiet before accepting another voice control.
          feedbackSuccess = false;
          transition(wasPrompt ? FeedbackPending : FeedbackQuiet);
        }
        break;
      case Quiet:
        if (elapsed < quietMs || ChipIntelliAudio.isPlaying() || !engineAvailable()) {
          if (elapsed >= timeoutMs) finish(false, "engine/audio busy before recording");
          break;
        }
        {
          const bool accepted = wakeTarget
            ? ChipIntelliCWSL.learnWakeWord(targetId, groupId)
            : ChipIntelliCWSL.learnCommand(targetId, groupId);
          if (accepted) transition(Learning);
          else finish(false, ChipIntelliCWSL.errorString());
        }
        break;
      case Learning:
      case Deleting:
        if (elapsed >= timeoutMs) {
          ready = false;
          finish(false, "operation timeout; restart before further learning");
        }
        break;
      case FeedbackQuiet:
        if (!ChipIntelliAudio.isPlaying() && elapsed >= quietMs) transition(Idle);
        else if (elapsed >= timeoutMs) {
          ready = false;
          error = "audio did not stop; restart device";
          transition(Idle);
        }
        break;
    }
  }

 private:
  static constexpr uint32_t timeoutMs = 60000;
  static constexpr uint32_t quietMs = 250;
  Phase phase = Idle;
  uint32_t since = 0, dropped = 0, commandId = 0, wakeId = 1, targetId = 0;
  uint16_t groupId = 0, voices[4] = {};
  bool wakeTarget = false, replace = false, erase = false, feedbackSuccess = false;
  volatile bool audioDone = false;

  void transition(Phase next) { phase = next; since = millis(); }
  bool engineAvailable() const {
    const auto state = ChipIntelliCWSL.state();
    return state == CWSLIdle || state == CWSLRecognizing;
  }
  static void audioFinished(void *context) {
    static_cast<AilyChipIntelliVoiceLearning *>(context)->audioDone = true;
  }
  void finish(bool success, const char *message) {
    feedbackSuccess = success;
    error = message;
    transition(FeedbackPending);
  }
  void startAudio(bool prompt) {
    if (!ChipIntelliAudio.isReady()) {
      error = "Audio not ready; recording was not started";
      ready = false;
      transition(Idle);
      return;
    }
    if (prompt && (ChipIntelliAudio.isMuted() || ChipIntelliAudio.volume() == 0)) {
      error = "Audio muted; recording was not started";
      transition(Idle);
      return;
    }
    audioDone = false;
    // Changing the callback generation invalidates completions belonging to
    // older playback. Only this request may advance the learning state.
    ChipIntelliAudio.onFinished(audioFinished, this);
    ChipIntelliASR.keepAwakeFor(timeoutMs);
    const uint16_t voice = prompt ? voices[wakeTarget ? 1 : 0] : voices[feedbackSuccess ? 2 : 3];
    if (ChipIntelliAudio.playVoice(voice, false)) transition(prompt ? Prompt : Feedback);
    else {
      ChipIntelliAudio.onFinished(nullptr);
      error = "Audio request rejected; recording was not started";
      transition(Idle);
    }
  }
  void handle(const ChipIntelliCWSLEvent &event) {
    // Recognition is consumed here only for queue hygiene. ASR dispatches
    // learned commands as usual; this controller must not execute them twice.
    if (event.type == CWSLRecognized || event.commandId != targetId ||
        event.groupId != groupId ||
        event.wordType != (wakeTarget ? CWSLWakeWord : CWSLCommandWord)) return;
    if (phase == Learning) {
      if (event.type == CWSLLearningSucceeded) finish(true, "none");
      else if (event.type == CWSLLearningFailed || event.type == CWSLLearningCancelled) {
        if (event.result == CWSLDefaultCommandConflict) {
          ready = false;
          finish(false, "default-command conflict; restart and choose a different phrase");
        } else finish(false, ChipIntelliCWSL.resultName(event.result));
      }
    } else if (phase == Deleting) {
      if (event.type == CWSLDeleteSucceeded) {
        if (replace) transition(PromptPending);
        else finish(true, "none");
      } else if (event.type == CWSLDeleteFailed) finish(false, "template deletion failed");
    }
  }
};
static AilyChipIntelliVoiceLearning ailyChipIntelliVoiceLearning;
bool ailyChipIntelliCWSLVoiceBusy() { return ailyChipIntelliVoiceLearning.busy(); }
`;

function chipIntelliCWSLActive(block) {
  if (!block || block.isInFlyout) return false;
  const visited = new Set();
  let active = false;
  let current = block;
  while (current && !visited.has(current)) {
    visited.add(current);
    if (typeof current.isEnabled === 'function' && !current.isEnabled()) return false;
    if (typeof current.isInsertionMarker === 'function' && current.isInsertionMarker()) return false;
    if (['arduino_setup', 'arduino_loop', 'chipintelli_audio_on_finished'].indexOf(current.type) >= 0 ||
        /^chipintelli_asr_on_/.test(current.type)) active = true;
    current = typeof current.getParent === 'function' ? current.getParent()
      : typeof current.getSurroundParent === 'function' ? current.getSurroundParent() : null;
  }
  return active || (typeof isBlockConnected === 'function' && isBlockConnected(block));
}

function chipIntelliCWSLManagedConfiguration(block, required) {
  const workspace = block && block.workspace;
  const blocks = workspace && typeof workspace.getAllBlocks === 'function'
    ? workspace.getAllBlocks(false).filter(chipIntelliCWSLActive) : [block];
  const configs = blocks.filter(candidate => candidate && candidate.type === 'chipintelli_cwsl_voice_learning_init');
  if (configs.length > 1) throw new Error('语音自学习控制器只能初始化一次');
  if (required && configs.length !== 1) throw new Error('请在初始化中添加“语音自学习控制器”积木');
  if (configs.length) {
    const incompatible = ['chipintelli_cwsl_init', 'chipintelli_cwsl_end', 'chipintelli_cwsl_learn',
      'chipintelli_cwsl_cancel_learning', 'chipintelli_cwsl_erase_template', 'chipintelli_cwsl_erase_templates',
      'chipintelli_cwsl_read_events', 'chipintelli_cwsl_clear_events', 'chipintelli_audio_on_finished', 'chipintelli_audio_end'];
    const conflict = blocks.find(candidate => incompatible.indexOf(candidate.type) >= 0);
    if (conflict) throw new Error('语音自学习控制器不能混用底层学习/删除/事件读取或音频完成事件：' + conflict.type);
    if (workspace && !blocks.some(candidate => candidate.type === 'chipintelli_asr_set_wake_word')) {
      throw new Error('语音自学习控制器需要显式的 ASR 唤醒词，以免普通词条被当作唤醒词');
    }
  }
  return configs[0];
}

function ensureChipIntelliCWSLManaged(block, generator) {
  chipIntelliCWSLManagedConfiguration(block, true);
  ensureChipIntelliCWSLIds(generator);
  generator.addLibrary('chipintelli_asr', '#include <ChipIntelliASR.h>');
  generator.addLibrary('chipintelli_audio', '#include <ChipIntelliAudio.h>');
  generator.addFunction('chipintelli_cwsl_voice_busy_declaration', 'bool ailyChipIntelliCWSLVoiceBusy();');
  generator.addFunction('chipintelli_cwsl_voice_controller', CHIPINTELLI_CWSL_VOICE_CONTROLLER);
  generator.addLoopBegin('chipintelli_cwsl_voice_tick', 'ailyChipIntelliVoiceLearning.tick();');
}

Arduino.forBlock['chipintelli_cwsl_voice_learning_init'] = function(block, generator) {
  ensureChipIntelliCWSLManaged(block, generator);
  const target = block.getInputTargetBlock('COMMAND_ID');
  if (!target || target.type !== 'chipintelli_asr_command_fixed_id') {
    throw new Error('语音自学习的命令目标必须连接“固定 ID 命令词”定义块，不能只填写数字或未初始化变量');
  }
  const names = ['COMMAND_ID', 'WAKE_ID', 'GROUP_ID', 'COMMAND_PROMPT', 'WAKE_PROMPT', 'SUCCESS_PROMPT', 'FAILURE_PROMPT'];
  const values = names.map(name => {
    const value = generator.valueToCode(block, name, generator.ORDER_ATOMIC);
    if (!value) throw new Error('语音自学习缺少输入：' + name);
    return value;
  });
  return 'ailyChipIntelliVoiceLearning.begin(ailyChipIntelliCWSLCommandId(' + values[0] +
    '), ailyChipIntelliCWSLCommandId(' + values[1] + '), ailyChipIntelliCWSLGroupId(' + values[2] +
    '), ' + values.slice(3).map(value => '(uint16_t)(' + value + ')').join(', ') + ');\n';
};

Arduino.forBlock['chipintelli_cwsl_voice_learning_request'] = function(block, generator) {
  ensureChipIntelliCWSLManaged(block, generator);
  const actions = { LEARN_COMMAND: 1, LEARN_WAKE: 2, REPLACE_COMMAND: 3, REPLACE_WAKE: 4, DELETE_COMMAND: 5, DELETE_WAKE: 6 };
  const action = actions[block.getFieldValue('ACTION')];
  if (!action) throw new Error('无效的语音自学习操作');
  return 'ailyChipIntelliVoiceLearning.request(' + action + ');\n';
};
Arduino.forBlock['chipintelli_cwsl_voice_learning_busy'] = function(block, generator) {
  ensureChipIntelliCWSLManaged(block, generator);
  return ['ailyChipIntelliCWSLVoiceBusy()', generator.ORDER_ATOMIC];
};
Arduino.forBlock['chipintelli_cwsl_voice_learning_ready'] = function(block, generator) {
  ensureChipIntelliCWSLManaged(block, generator);
  return ['ailyChipIntelliVoiceLearning.ready', generator.ORDER_ATOMIC];
};
Arduino.forBlock['chipintelli_cwsl_voice_learning_error'] = function(block, generator) {
  ensureChipIntelliCWSLManaged(block, generator);
  return ['String(ailyChipIntelliVoiceLearning.error)', generator.ORDER_ATOMIC];
};

// Check ownership even if a raw block is generated before the controller.
Object.keys(Arduino.forBlock).filter(type => type.indexOf('chipintelli_cwsl_') === 0).forEach(type => {
  const generate = Arduino.forBlock[type];
  Arduino.forBlock[type] = function(block, generator) {
    chipIntelliCWSLManagedConfiguration(block, false);
    return generate(block, generator);
  };
});

'use strict';

var chipIntelliASREntryBlockTypes = [
  'chipintelli_asr_on_startup',
  'chipintelli_asr_on_wakeup',
  'chipintelli_asr_on_timeout',
  'chipintelli_asr_on_result',
  'chipintelli_asr_on_command',
  'chipintelli_asr_on_semantic'
];

function chipIntelliASRRegisterEntryBlocks() {
  if (typeof registerHatBlock === 'function') {
    registerHatBlock(chipIntelliASREntryBlockTypes);
    return;
  }

  var scope = typeof globalThis !== 'undefined' ? globalThis : null;
  if (!scope) return;
  if (!Array.isArray(scope.ENTRY_BLOCK_TYPES)) {
    scope.ENTRY_BLOCK_TYPES = ['arduino_setup', 'arduino_loop'];
  }
  chipIntelliASREntryBlockTypes.forEach(function(blockType) {
    if (scope.ENTRY_BLOCK_TYPES.indexOf(blockType) < 0) {
      scope.ENTRY_BLOCK_TYPES.push(blockType);
    }
  });
}

function chipIntelliASRIsBlockConnected(block) {
  if (!block || block.isInFlyout) return false;
  // Workspace preflight must ignore the same disabled branches as codegen.
  var ancestor = block;
  var enabledVisited = new Set();
  while (ancestor && !enabledVisited.has(ancestor)) {
    enabledVisited.add(ancestor);
    if ((typeof ancestor.isEnabled === 'function' && !ancestor.isEnabled()) ||
        (typeof ancestor.isInsertionMarker === 'function' && ancestor.isInsertionMarker())) return false;
    ancestor = typeof ancestor.getParent === 'function' ? ancestor.getParent()
      : typeof ancestor.getSurroundParent === 'function' ? ancestor.getSurroundParent() : null;
  }
  // Core variable declarations may intentionally live at workspace root.
  // Their compile-time resource initializer is active even though the runtime
  // entry-point helper reports the declaration as disconnected.
  if (['chipintelli_asr_command', 'chipintelli_asr_command_fixed_id',
       'chipintelli_asr_command_id'].indexOf(block.type) >= 0) {
    var parent = typeof block.getParent === 'function' ? block.getParent() : null;
    var declarationVisited = new Set();
    while (parent && !declarationVisited.has(parent)) {
      declarationVisited.add(parent);
      var outer = typeof parent.getParent === 'function' ? parent.getParent() : null;
      if (parent.type === 'arduino_global' ||
          (!outer && ['variable_define', 'variable_define_advanced'].indexOf(parent.type) >= 0) ||
          (['variable_define_scoped', 'variable_define_advanced_scoped'].indexOf(parent.type) >= 0 &&
           parent.getFieldValue('SCOPE') === 'global')) return true;
      parent = outer;
    }
  }
  if (typeof isBlockConnected === 'function') {
    return isBlockConnected(block);
  }

  var entryTypes = ['arduino_setup', 'arduino_loop'].concat(
    chipIntelliASREntryBlockTypes
  );
  var visited = Object.create(null);
  var current = block;
  while (current && !visited[current.id]) {
    visited[current.id] = true;
    if (entryTypes.indexOf(current.type) >= 0) return true;

    var parent = typeof current.getSurroundParent === 'function'
      ? current.getSurroundParent()
      : null;
    if (!parent && current.previousConnection &&
        current.previousConnection.isConnected()) {
      parent = current.previousConnection.targetBlock();
    }
    if (!parent && current.outputConnection &&
        current.outputConnection.isConnected()) {
      parent = current.outputConnection.targetBlock();
    }
    if (!parent && typeof current.getParent === 'function') {
      parent = current.getParent();
    }
    current = parent;
  }
  return false;
}

chipIntelliASRRegisterEntryBlocks();

function ensureChipIntelliASR(generator) {
  generator.addLibrary('chipintelli_asr', '#include <ChipIntelliASR.h>');
}

function ensureChipIntelliASRResult(generator) {
  ensureChipIntelliASR(generator);
  generator.addVariable(
    'chipintelli_asr_result',
    'ChipIntelliASRResult ailyChipIntelliASRResult = {};'
  );
}

function chipIntelliASRValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function chipIntelliASRText(block, fieldName, fallback) {
  const value = block.getFieldValue(fieldName);
  const text = String(value === null || value === undefined ? '' : value).trim();
  if (/[\r\n\u2028\u2029]/.test(text) || /\\$/.test(text)) {
    throw new Error('语音词条必须是单行文本，且不能以反斜杠结尾');
  }
  return text || fallback;
}

function chipIntelliASRMacroName(commandId) {
  return 'COMMAND' + commandId;
}

function chipIntelliASRNumericId(block) {
  const value = block.getFieldValue('COMMAND_ID');
  const commandId = Number(value);
  if (value === null || value === undefined || String(value).trim() === '' ||
      !Number.isInteger(commandId) || commandId < 0 || commandId > 65535) {
    throw new RangeError('命令词 ID 必须是 0～65535 的整数');
  }
  return commandId;
}

function chipIntelliASRReservedId(commandId) {
  return commandId < 2 || (commandId >= 199 && commandId <= 208);
}

function chipIntelliASRReserveCommand(block, state) {
  const commandId = chipIntelliASRNumericId(block);
  const text = chipIntelliASRText(block, 'TEXT', '执行操作');
  if (chipIntelliASRReservedId(commandId)) {
    throw new RangeError('固定命令 ID 不能使用 0、1 或 CWSL 保留的 199～208');
  }
  if (Object.prototype.hasOwnProperty.call(state.fixedCommandTexts, commandId) &&
      state.fixedCommandTexts[commandId] !== text) {
    throw new Error('命令 ID ' + commandId + ' 已分配给“' + state.fixedCommandTexts[commandId] + '”，不能再定义“' + text + '”');
  }
  if (Object.prototype.hasOwnProperty.call(state.fixedCommandIds, text) &&
      state.fixedCommandIds[text] !== commandId) {
    throw new Error('命令词“' + text + '”不能同时指定多个固定 ID');
  }
  if (Object.prototype.hasOwnProperty.call(state.commandIds, text) &&
      state.commandIds[text] !== commandId) {
    throw new Error('命令词“' + text + '”已生成其他 ID，请重新生成整个工作区');
  }
  state.fixedCommandTexts[commandId] = text;
  state.fixedCommandIds[text] = commandId;
}

function chipIntelliASRState(generator, block) {
  const macros = generator.codeDict && generator.codeDict.macros;
  const workspace = block && block.workspace;
  if (!generator._chipIntelliASRState || generator._chipIntelliASRState.macros !== macros ||
      generator._chipIntelliASRState.workspace !== workspace) {
    const state = {
      macros: macros,
      workspace: workspace,
      nextResourceId: 2,
      hasExplicitWakeWord: false,
      wakeWordIds: Object.create(null),
      commandIds: Object.create(null),
      fixedCommandTexts: Object.create(null),
      fixedCommandIds: Object.create(null),
      usedResourceIds: new Set([0, 1]),
      callbackIndexes: Object.create(null),
      nextCallbackIndex: 1
    };
    // Reserve definitions before allocating ANY automatic command/wake ID.
    // Literal references deliberately do not reserve IDs or change bindings.
    const blocks = workspace && typeof workspace.getAllBlocks === 'function'
      ? workspace.getAllBlocks(false) : [block];
    blocks.forEach(function(candidate) {
      if (candidate && candidate.type === 'chipintelli_asr_command_fixed_id' &&
          chipIntelliASRIsBlockConnected(candidate)) chipIntelliASRReserveCommand(candidate, state);
    });
    generator._chipIntelliASRState = state;
  }
  return generator._chipIntelliASRState;
}

function chipIntelliASRAllocateId(state) {
  while (state.nextResourceId <= 65535 &&
         (chipIntelliASRReservedId(state.nextResourceId) ||
          state.usedResourceIds.has(state.nextResourceId) ||
          Object.prototype.hasOwnProperty.call(state.fixedCommandTexts, state.nextResourceId))) {
    state.nextResourceId++;
  }
  if (state.nextResourceId > 65535) throw new RangeError('命令词 ID 空间已用完，无法继续分配');
  const commandId = state.nextResourceId++;
  state.usedResourceIds.add(commandId);
  return commandId;
}

function chipIntelliASRSetWakeWord(block, generator) {
  const text = chipIntelliASRText(block, 'WAKE_WORD', '智能管家');
  const state = chipIntelliASRState(generator, block);
  const blockKey = String(block.id || 'text:' + text);
  let wakeWordId = state.wakeWordIds[blockKey];

  if (wakeWordId === undefined) {
    if (!state.hasExplicitWakeWord) {
      wakeWordId = 1;
      state.hasExplicitWakeWord = true;
    } else {
      wakeWordId = chipIntelliASRAllocateId(state);
    }
    state.wakeWordIds[blockKey] = wakeWordId;
  }

  generator.addMacro(
    wakeWordId === 1 ? 'chipintelli_asr_wake' : 'chipintelli_asr_wake:' + blockKey,
    '#define WAKEWORD' + wakeWordId + ' ' + wakeWordId + ' //' + text,
    true
  );
}

function chipIntelliASRAddCommandMacro(block, generator) {
  const text = chipIntelliASRText(block, 'TEXT',
    block.type === 'chipintelli_asr_command_fixed_id' ? '执行操作' : '打开灯');
  const state = chipIntelliASRState(generator, block);

  if (!Object.prototype.hasOwnProperty.call(state.commandIds, text)) {
    const commandId = Object.prototype.hasOwnProperty.call(state.fixedCommandIds, text)
      ? state.fixedCommandIds[text] : chipIntelliASRAllocateId(state);
    if (Object.prototype.hasOwnProperty.call(state.fixedCommandIds, text) &&
        state.usedResourceIds.has(commandId)) {
      throw new Error('固定命令 ID ' + commandId + ' 与已生成词条冲突，请重新生成整个工作区');
    }
    state.usedResourceIds.add(commandId);
    state.commandIds[text] = commandId;
    generator.addMacro(
      'chipintelli_asr_command:' + text,
      '#define ' + chipIntelliASRMacroName(commandId) + ' ' + commandId + ' //' + text
    );
  }

  return chipIntelliASRMacroName(state.commandIds[text]);
}

function chipIntelliASRCallbackName(block, generator, eventName) {
  const state = chipIntelliASRState(generator, block);
  const blockId = String(block.id || 'anonymous_' + state.nextCallbackIndex);
  const key = eventName + ':' + blockId;
  if (!Object.prototype.hasOwnProperty.call(state.callbackIndexes, key)) {
    state.callbackIndexes[key] = state.nextCallbackIndex++;
  }
  return 'ailyChipIntelliASRCallback' + state.callbackIndexes[key];
}

function chipIntelliASRAddTick(generator) {
  ensureChipIntelliASR(generator);
  generator.addLoopBegin('chipintelli_asr_tick', 'ChipIntelliASR.tick();');
}

function chipIntelliASRAddLifecycleEvent(block, generator, eventName, method) {
  ensureChipIntelliASR(generator);
  const callbackName = chipIntelliASRCallbackName(block, generator, eventName);
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  generator.addFunction(
    callbackName,
    'void ' + callbackName + '() {\n' + handler + '}\n'
  );
  generator.addSetupEnd(
    'chipintelli_asr_attach_' + callbackName,
    'ChipIntelliASR.' + method + '(' + callbackName + ');'
  );
  chipIntelliASRAddTick(generator);
  return '';
}

function chipIntelliASRAddResultEvent(block, generator, eventName, setupCode) {
  ensureChipIntelliASRResult(generator);
  const callbackName = chipIntelliASRCallbackName(block, generator, eventName);
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  generator.addFunction(
    callbackName,
    'void ' + callbackName + '(const ChipIntelliASRResult &result) {\n' +
    '  ailyChipIntelliASRResult = result;\n' +
    handler +
    '}\n'
  );
  generator.addSetupEnd(
    'chipintelli_asr_attach_' + callbackName,
    setupCode(callbackName)
  );
  chipIntelliASRAddTick(generator);
  return '';
}

Arduino.forBlock['chipintelli_asr_init'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  generator.addSetupBegin(
    'chipintelli_asr_init',
    'ChipIntelliASR.begin();',
    true
  );
  return '';
};

Arduino.forBlock['chipintelli_asr_end'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return 'ChipIntelliASR.end();\n';
};

Arduino.forBlock['chipintelli_asr_set_wake_word'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  chipIntelliASRSetWakeWord(block, generator);
  return 'ChipIntelliASR.setWakeWordEnabled(true);\n';
};

Arduino.forBlock['chipintelli_asr_on_startup'] = function(block, generator) {
  return chipIntelliASRAddLifecycleEvent(
    block,
    generator,
    'startup',
    'attachStartup'
  );
};

Arduino.forBlock['chipintelli_asr_on_wakeup'] = function(block, generator) {
  return chipIntelliASRAddLifecycleEvent(
    block,
    generator,
    'wakeup',
    'attachWakeup'
  );
};

Arduino.forBlock['chipintelli_asr_on_timeout'] = function(block, generator) {
  return chipIntelliASRAddLifecycleEvent(
    block,
    generator,
    'timeout',
    'attachTimeout'
  );
};

Arduino.forBlock['chipintelli_asr_on_result'] = function(block, generator) {
  return chipIntelliASRAddResultEvent(
    block,
    generator,
    'result',
    function(callbackName) {
      return 'ChipIntelliASR.onResult(' + callbackName + ');';
    }
  );
};

Arduino.forBlock['chipintelli_asr_on_command'] = function(block, generator) {
  const command = chipIntelliASRValue(block, generator, 'COMMAND', '0');
  return chipIntelliASRAddResultEvent(
    block,
    generator,
    'command',
    function(callbackName) {
      return 'ChipIntelliASR.attachCommand((uint16_t)(' + command + '), ' + callbackName + ');';
    }
  );
};

Arduino.forBlock['chipintelli_asr_on_semantic'] = function(block, generator) {
  const semanticId = chipIntelliASRValue(block, generator, 'SEMANTIC_ID', '0');
  return chipIntelliASRAddResultEvent(
    block,
    generator,
    'semantic',
    function(callbackName) {
      return 'ChipIntelliASR.attachSemantic((uint32_t)(' + semanticId + '), ' + callbackName + ');';
    }
  );
};

Arduino.forBlock['chipintelli_asr_command'] = function(block, generator) {
  // citool-cli ignores COMMAND macros without this include, including when
  // this value block is used only as a CWSL target.
  ensureChipIntelliASR(generator);
  return [chipIntelliASRAddCommandMacro(block, generator), generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_command_fixed_id'] = function(block, generator) {
  const state = chipIntelliASRState(generator, block);
  chipIntelliASRReserveCommand(block, state);
  ensureChipIntelliASR(generator);
  return [chipIntelliASRAddCommandMacro(block, generator), generator.ORDER_ATOMIC];
};

// A reference must retain its value, even when it intentionally addresses a
// resource defined by a text block. Never allocate or silently renumber here.
Arduino.forBlock['chipintelli_asr_command_id'] = function(block, generator) {
  return [String(chipIntelliASRNumericId(block)), generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_detach_lifecycle'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  const methods = {
    STARTUP: 'detachStartup',
    WAKEUP: 'detachWakeup',
    TIMEOUT: 'detachTimeout'
  };
  const method = methods[block.getFieldValue('EVENT')] || methods.STARTUP;
  return 'ChipIntelliASR.' + method + '();\n';
};

Arduino.forBlock['chipintelli_asr_detach_command'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  const command = chipIntelliASRValue(block, generator, 'COMMAND', '0');
  return 'ChipIntelliASR.detachCommand((uint16_t)(' + command + '));\n';
};

Arduino.forBlock['chipintelli_asr_detach_semantic'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  const semanticId = chipIntelliASRValue(block, generator, 'SEMANTIC_ID', '0');
  return 'ChipIntelliASR.detachSemantic((uint32_t)(' + semanticId + '));\n';
};

Arduino.forBlock['chipintelli_asr_detach_handlers'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  const methods = {
    COMMANDS: 'detachAllCommands',
    SEMANTICS: 'detachAllSemantics',
    ALL: 'detachAll'
  };
  const method = methods[block.getFieldValue('HANDLERS')] || methods.ALL;
  return 'ChipIntelliASR.' + method + '();\n';
};

Arduino.forBlock['chipintelli_asr_keep_awake_for'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  const timeoutSeconds = chipIntelliASRValue(block, generator, 'TIMEOUT', '15');
  return 'ChipIntelliASR.keepAwakeFor((uint32_t)max(0L, (long)(' + timeoutSeconds + ')) * 1000UL);\n';
};

Arduino.forBlock['chipintelli_asr_is_awake'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.isAwake()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_read_results'] = function(block, generator) {
  ensureChipIntelliASRResult(generator);
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  return 'while (ChipIntelliASR.read(ailyChipIntelliASRResult)) {\n' + handler + '}\n';
};

Arduino.forBlock['chipintelli_asr_available'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.available()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_result_command_id'] = function(block, generator) {
  ensureChipIntelliASRResult(generator);
  return ['ailyChipIntelliASRResult.commandId', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_result_semantic_id'] = function(block, generator) {
  ensureChipIntelliASRResult(generator);
  return ['ailyChipIntelliASRResult.semanticId', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_result_score'] = function(block, generator) {
  ensureChipIntelliASRResult(generator);
  return ['ailyChipIntelliASRResult.score', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_result_frames'] = function(block, generator) {
  ensureChipIntelliASRResult(generator);
  return ['ailyChipIntelliASRResult.frames', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_result_is_wake_word'] = function(block, generator) {
  ensureChipIntelliASRResult(generator);
  return ['ailyChipIntelliASRResult.isWakeWord', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_result_text'] = function(block, generator) {
  ensureChipIntelliASRResult(generator);
  return ['String(ailyChipIntelliASRResult.text)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_result_text_truncated'] = function(block, generator) {
  ensureChipIntelliASRResult(generator);
  return ['ailyChipIntelliASRResult.textTruncated', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_pending_results'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.pendingResults()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_pending_events'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.pendingEvents()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_dropped_results'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.droppedResults()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_dropped_events'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.droppedEvents()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_handler_count'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.handlerCount()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_handler_capacity'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.handlerCapacity()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_last_error'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return [
    'static_cast<uint8_t>(ChipIntelliASR.lastError())',
    generator.ORDER_ATOMIC
  ];
};

Arduino.forBlock['chipintelli_asr_last_error_text'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return [
    'String(ChipIntelliASR.errorString(ChipIntelliASR.lastError()))',
    generator.ORDER_ATOMIC
  ];
};

Arduino.forBlock['chipintelli_asr_aec_enabled'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.isAECEnabled()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_barge_in_enabled'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.isBargeInEnabled()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_barge_in_mode'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return [
    'static_cast<uint8_t>(ChipIntelliASR.bargeInMode())',
    generator.ORDER_ATOMIC
  ];
};

Arduino.forBlock['chipintelli_asr_barge_in_mode_value'] = function(block, generator) {
  const selected = block.getFieldValue('MODE');
  const mode = ['0', '1', '2', '3'].indexOf(selected) >= 0 ? selected : '0';
  return [mode, generator.ORDER_ATOMIC];
};

// Blockly may ask generators for every top-level block, including blocks that
// are still floating in the workspace. Guard before the original generator so
// disconnected blocks cannot contribute includes, macros, globals, callbacks,
// setup/loop fragments, or body code.
Object.keys(Arduino.forBlock).forEach(function(blockType) {
  if (blockType.indexOf('chipintelli_asr_') !== 0) return;
  const generate = Arduino.forBlock[blockType];
  Arduino.forBlock[blockType] = function(block, generator) {
    if (!chipIntelliASRIsBlockConnected(block)) {
      return block && block.outputConnection
        ? ['', generator.ORDER_ATOMIC]
        : '';
    }
    return generate(block, generator);
  };
});

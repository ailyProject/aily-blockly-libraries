// TodoList - Generator
// Global object pattern: uses `Todo` singleton

Arduino.forBlock['todo_load'] = function(block, generator) {
  generator.addLibrary('TodoList', '#include "todolist.h"');
  return 'Todo.load();\n';
};

Arduino.forBlock['todo_show'] = function(block, generator) {
  generator.addLibrary('TodoList', '#include "todolist.h"');
  return 'Todo.show();\n';
};

Arduino.forBlock['todo_handle_btns'] = function(block, generator) {
  generator.addLibrary('TodoList', '#include "todolist.h"');
  return 'Todo.handleBtns();\n';
};

Arduino.forBlock['todo_start_server'] = function(block, generator) {
  generator.addLibrary('TodoList', '#include "todolist.h"');
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '8081';
  return 'Todo.startServer(' + port + ');\n';
};

Arduino.forBlock['todo_handle_client'] = function(block, generator) {
  generator.addLibrary('TodoList', '#include "todolist.h"');
  return 'Todo.handleClient();\n';
};

Arduino.forBlock['todo_needs_redraw'] = function(block, generator) {
  generator.addLibrary('TodoList', '#include "todolist.h"');
  return ['Todo.needsRedraw()', generator.ORDER_ATOMIC];
};

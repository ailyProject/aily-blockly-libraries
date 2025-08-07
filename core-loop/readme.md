# 循环控制 (Loop Control) 核心库

Arduino/C++编程中的循环控制核心库，提供各种循环结构和程序流程控制功能。

## 库信息
- **库名**: @aily-project/lib-core-loop
- **版本**: 0.0.1
- **作者**: aily Project
- **描述**: 核心库，通常已经集成到初始模板中
- **电压**: 3.3V、5V
- **测试者**: 奈何col

## 可用模块

### 程序结构
- **初始化** (`arduino_setup`): Arduino程序初始化部分，只执行一次
- **循环执行** (`arduino_loop`): Arduino主循环部分，持续执行

### 循环控制
- **重复执行** (`controls_repeat_ext`): 重复执行指定次数
- **重复** (`controls_repeat`): 简单重复循环
- **当/直到** (`controls_whileUntil`): 条件循环，支持while和until模式
- **计数循环** (`controls_for`): 带计数器的for循环，支持起始值、结束值、步长
- **无限循环** (`controls_whileForever`): 永远执行的循环

### 流程控制
- **跳出/继续** (`controls_flow_statements`): 循环流程控制，支持break和continue

## 使用说明

### 基本程序结构
```cpp
void setup() {
  // 初始化代码，只执行一次
  Serial.begin(9600);
  pinMode(13, OUTPUT);
}

void loop() {
  // 主循环代码，持续执行
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}
```

### 循环类型

#### 重复执行
```cpp
// 重复10次
for(int i = 0; i < 10; i++) {
  // 执行代码
}
```

#### 条件循环
```cpp
// while循环
while(condition) {
  // 执行代码
}

// until循环（while的反向）
while(!condition) {
  // 执行代码
}
```

#### 计数循环
```cpp
// 从1到10，步长为1
for(int i = 1; i <= 10; i += 1) {
  // 执行代码
}

// 从10到1，步长为-2
for(int i = 10; i >= 1; i -= 2) {
  // 执行代码
}
```

#### 无限循环
```cpp
while(true) {
  // 永远执行的代码
}
```

### 流程控制
```cpp
for(int i = 0; i < 10; i++) {
  if(i == 5) {
    continue; // 跳过当前循环，继续下一次
  }
  if(i == 8) {
    break; // 跳出整个循环
  }
  // 其他代码
}
```

## 高级功能

### 智能步长检测
- 自动检测循环方向（递增/递减）
- 根据起始值和结束值优化循环条件
- 支持正负步长值

### 变量作用域
- 循环变量自动管理作用域
- 避免变量名冲突
- 支持嵌套循环

### 代码优化
- 自动生成高效的C++循环代码
- 优化循环条件判断
- 支持循环展开优化

## 注意事项
- 避免在循环中使用阻塞性延时（如delay）
- 注意循环条件，避免无限循环导致程序卡死
- 大循环次数可能影响程序响应性
- 嵌套循环要注意性能影响
- break和continue只影响最内层循环

## 技术特性
- **标准兼容**: 基于标准C++循环语法
- **智能优化**: 自动优化循环条件和步长
- **多语言**: 支持中文、英文等多种界面语言
- **作用域安全**: 自动管理变量作用域
- **性能优化**: 生成高效的循环代码

# lib-pointer

指针变量演示库：提供类型化指针声明、取地址、解引用读写积木，生成标准 C/C++ 指针代码。

## Library Info

- **Name**: @aily-project/lib-pointer
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `pointer_define` | Statement | VAR(field_input), TYPE(dropdown), VALUE(input_value) | `pointer_define("p", int*, pointer_address_of(variables_get($a)))` | `int* p = (&a);` |
| `pointer_address_of` | Value | VALUE(input_value) | `pointer_address_of(variables_get($a))` | `(&a)` |
| `pointer_dereference_get` | Value | VALUE(input_value) | `pointer_dereference_get(variables_get($p))` | `(*(p))` |
| `pointer_dereference_set` | Statement | PTR(input_value), VALUE(input_value) | `pointer_dereference_set(variables_get($p), math_number(20))` | `(*(p) = 20);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | int*, char*, float*, double*, long*, uint8_t*, uint16_t*, byte* | pointer_define 的指针基类型 |

## ABS Examples

```
# Project Data Schema: 1 (external-only)

arduino_global()
    variable_define("a", int, math_number(10))
    pointer_define("p", int*, pointer_address_of(variables_get($a)))

arduino_setup()
    serial_begin(Serial, 9600)
    serial_println(Serial, pointer_dereference_get(variables_get($p)))

arduino_loop()
    pointer_dereference_set(variables_get($p), math_number(20))
    serial_println(Serial, variables_get($a))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `pointer_define("p", ...)` 创建变量 `$p`；本库所有块的指针均通过 `input_value` 传入，须使用 `variables_get($p)`；VALUE/PTR 槽没有 field_variable。
2. **类型匹配**: `pointer_define` 的 TYPE 必须与被指向变量类型一致（如 `int*` 配 `variable_define(..., int, ...)`），否则生成的 C++ 代码编译报错；`void*` 无法解引用。
3. **初始化**: 指针初值应为 `pointer_address_of(...)` 的返回值；缺失时生成 `= 0`（即空指针）。解引用空指针会导致运行时崩溃，演示时务必先指向有效变量。
4. **作用域**: `pointer_define` 通过对象注册机制把声明写入 C++ 全局区，无论块拖到哪个区域都生成全局声明；指针名在工程内须唯一，同名声明会去重。为保持可读性，建议放在 `arduino_global()` 中，并位于被指向变量声明之后。
5. 本库不依赖任何头文件与硬件外设，不需要 init/update 生命周期调用。

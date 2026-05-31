# 从 const 对象推导字面量联合类型

> Related source: [api.ts](../../../packages/contracts/src/api.ts)

## Meaning

`(typeof obj)[keyof typeof obj]` 是 TypeScript 的**索引访问类型**，用来从一个对象类型里取出所有属性值的联合类型。

拆解步骤：

1. `typeof obj` — 取运行时对象 `obj` 的 TypeScript 类型
> typeof 就是这个值的类型， 那么在ts中obj的类型是什么 是interface跟 type xx = {a: 1} 这种 所以这里的结果是 {interalError: 'INTERNAL_ERROR', ...}
2. `keyof typeof obj` — 取该对象所有键名的联合类型
> 这里得到的 type parameter = 'interalError' | 'xx'
3. `(typeof obj)[keyof typeof obj]` — 用这些键去索引对象类型，得到所有属性值的联合类型

配合 `as const` 时，属性值会被收窄为字面量类型（如 `'INTERNAL_ERROR'`），而不是宽泛的 `string`。

## In This Project

`packages/contracts/src/api.ts` 中：

```ts
export const errorCodes = { ... } as const
export type ErrorCode = (typeof errorCodes)[keyof typeof errorCodes]
```

`ErrorCode` 等价于：

```ts
'INTERNAL_ERROR' | 'VALIDATION_ERROR' | 'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'RATE_LIMITED'
```

好处：

- 错误码只维护一处（`errorCodes` 对象）
- 新增/删除错误码时，`ErrorCode` 类型自动同步
- `fail()` 函数的 `code` 参数可获得 IDE 自动补全和类型检查

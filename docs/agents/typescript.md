# TypeScript Best Practices for AI Code Generators

## Compiler Options and Project Defaults

### Enable Strict Mode and Key Strictness Flags

Always turn on strict type checking:

```json
{
	"strict": true,
	"noUncheckedIndexedAccess": true,
	"noImplicitOverride": true
}
```

- `strict`: Enables all strict type-checking options.
- `noUncheckedIndexedAccess`: Prevents unsafe access to possibly undefined array/object elements.
- `noImplicitOverride`: Requires the `override` keyword for class overrides.

---

### Use Modern Defaults in `tsconfig`

Adopt Matt Pocock’s recommended base configuration:

- Target a modern ES version (e.g. `es2022`)
- Enable:
  - `moduleDetection: "force"`
  - `isolatedModules: true`
  - `esModuleInterop: true`
  - `skipLibCheck: true`

---

## Type Aliases vs Interfaces

### Prefer `type` Aliases by Default

Use `type` aliases for most declarations. They support unions, intersections, and primitives.

### Use `interface` for Object Inheritance or API Contracts

Use `interface` when you need `extends`, `implements`, or declaration merging.

---

## General Do’s and Don’ts

### Do

- Explicitly type function parameters
- Rely on inference for locals
- Use PascalCase and singular names
- Use descriptive generic names
- Handle `null` and `undefined` explicitly

### Don’t

- Use `any` unless unavoidable
- Ignore compiler errors
- Leave unused variables or unreachable code

---

## Return Types and Type Inference

- Prefer inference for simple functions
- Explicitly annotate exports and complex logic
- For AI-generated code, favor clarity over brevity

---

## Safe Utility Types and Patterns

- Use built-in utility types (`Partial`, `Pick`, `Record`, etc.)
- Use `satisfies` for safe inference
- Use `as const` for literal preservation
- Prefer discriminated unions
- Use branded types for IDs
- Validate external data at runtime

---

## Summary

These practices ensure AI-generated TypeScript is safe, idiomatic, and maintainable.

# React Composition Patterns

**Version 1.0.0**  
Engineering  
January 2026

> **Note:**  
> This document is mainly for agents and LLMs to follow when maintaining,  
> generating, or refactoring React codebases using composition. Humans  
> may also find it useful, but guidance here is optimized for automation  
> and consistency by AI-assisted workflows.

## How To Use This Folder

This file is an index. It intentionally does not duplicate rule content.
Follow the links below and reference the file paths directly in edits.

## Overview

- README: `docs/agents/composition-patterns/README.md`
- Sections index: `docs/agents/composition-patterns/rules/_sections.md`
- Rule template: `docs/agents/composition-patterns/rules/_template.md`

## Rules By Area

### Component Architecture

- Avoid boolean prop proliferation: `docs/agents/composition-patterns/rules/architecture-avoid-boolean-props.md`
- Use compound components: `docs/agents/composition-patterns/rules/architecture-compound-components.md`

### State Management

- Decouple state management from UI: `docs/agents/composition-patterns/rules/state-decouple-implementation.md`
- Define context interfaces: `docs/agents/composition-patterns/rules/state-context-interface.md`
- Lift state into providers: `docs/agents/composition-patterns/rules/state-lift-state.md`

### Implementation Patterns

- Explicit component variants: `docs/agents/composition-patterns/rules/patterns-explicit-variants.md`
- Prefer children over render props: `docs/agents/composition-patterns/rules/patterns-children-over-render-props.md`

### React 19 APIs

- Avoid forwardRef, prefer use(): `docs/agents/composition-patterns/rules/react19-no-forwardref.md`

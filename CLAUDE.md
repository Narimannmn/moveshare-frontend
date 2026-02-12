# Claude Code Documentation

This project uses **Feature-Sliced Design (FSD)** architecture with **React 19 + TypeScript + TanStack Router**.

## 📚 Documentation Structure

Documentation has been split into focused files for efficiency:

- **`.claude/architecture.md`** - FSD rules, layer structure, import patterns, entity template
- **`.claude/api-patterns.md`** - API layer patterns (keys, services, queries, mutations)
- **`.claude/state-management.md`** - Zustand patterns with localStorage persistence
- **`.claude/components.md`** - Component structure, separation of concerns, granularity
- **`.claude/ui-guidelines.md`** - UI component library (Tailwind + Radix UI), design system, styling
- **`.claude/forms.md`** - React Hook Form with Controller pattern
- **`.claude/schemas.md`** - Zod schema patterns and type inference
- **`.claude/performance.md`** - Memoization strategies and optimization
- **`.claude/anti-patterns.md`** - Common mistakes to avoid
- **`.claude/quick-reference.md`** - Commands, tech stack, TypeScript rules
- **`.claude/checklist.md`** - Code review checklist
- **`.claude/figma-mcp.md`** - Figma MCP integration guide

## 🎯 Core Philosophy

**Goal**: Write clean, maintainable, type-safe code that follows Feature-Sliced Design principles and leverages modern React 19 patterns with type-safe routing.

## 🚀 Quick Start

1. Read **architecture.md** first - it contains critical FSD rules and TanStack Router patterns
2. Read **ui-guidelines.md** - Design system, Tailwind CSS, and Radix UI component usage
3. Reference **api-patterns.md** when creating entities with TanStack Query
4. Check **anti-patterns.md** to avoid common mistakes
5. Use **checklist.md** before committing code

## 📖 When to Read Which File

- **Creating new entity** → architecture.md + api-patterns.md
- **Building UI components** → ui-guidelines.md + components.md
- **Routing & navigation** → architecture.md (TanStack Router section)
- **Styling/design system** → ui-guidelines.md
- **Adding forms** → forms.md + ui-guidelines.md
- **State management** → state-management.md
- **Performance optimization** → performance.md
- **Code review** → checklist.md
- **Quick lookup** → quick-reference.md
- **Figma integration** → figma-mcp.md

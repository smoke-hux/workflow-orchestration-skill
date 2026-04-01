---
name: "workflow-orchestration"
description: "Use when the user wants disciplined project execution or orchestration for a task: planning non-trivial work, breaking it into milestones, tracking progress, verifying results, and capturing lessons learned."
---

# Workflow Orchestration

Use this skill when the work needs stronger execution discipline than a one-shot answer.

Typical triggers:
- Multi-step implementation or debugging
- Architectural changes with sequencing or tradeoffs
- Work that benefits from explicit progress tracking
- Tasks where verification and follow-through matter as much as the code change

## Workflow

### 1. Understand the objective

- Restate the goal in concrete terms
- Identify constraints, risks, and likely blockers
- Prefer one or two clarifying questions only when the ambiguity is genuinely risky

### 2. Make a written plan for non-trivial work

- For work with multiple steps, create a short plan before implementing
- Use available planning tools when they exist; otherwise keep a concise checklist in working notes
- Re-plan when new information changes the path

### 3. Execute in small, reviewable slices

- Prefer root-cause fixes over surface patches
- Keep the scope as small as possible while still solving the real problem
- Pause and ask whether there is a simpler or more elegant approach before finalizing

### 4. Delegate carefully when allowed

- Use subagents only when the user explicitly asks for delegation or parallel work, or when delegation is clearly permitted by the current environment
- Give each delegated task a single clear objective with bounded scope
- Avoid duplicating work between the main thread and delegated work

### 5. Verify before calling the work done

- Run the most relevant checks available: tests, builds, logs, or behavior validation
- Compare expected behavior with actual behavior when possible
- Do not mark work complete without evidence

### 6. Capture reusable lessons

- If the repo already uses files like `tasks/todo.md` or `tasks/lessons.md`, update them when useful
- If those files do not exist, avoid creating process clutter unless the user wants project-level workflow docs
- When a user correction reveals a pattern, encode that lesson in the project workflow if appropriate

## Core Principles

- Simplicity first
- Minimal impact
- Root cause over symptoms
- Evidence over assumption
- Re-plan instead of pushing through a broken approach
- Keep the user unblocked with steady progress updates

# Workflow Orchestration

Use these instructions when a task is too large, risky, or multi-step for a one-shot answer.

Typical triggers:
- Multi-step implementation or debugging
- Architectural changes with sequencing or tradeoffs
- Research or migration work with several moving parts
- Work that benefits from explicit progress tracking
- Tasks where verification and follow-through matter as much as the change itself
- Reviews where findings, evidence, and next actions must stay organized

## Operating Mode

### 1. Lock the objective

- Restate the goal in concrete terms
- Identify success criteria, constraints, risks, and likely blockers
- Ask only one or two clarifying questions when ambiguity is genuinely risky

### 2. Write a short plan

- For non-trivial work, create an explicit checklist or milestone list before implementation
- Keep only one step in progress at a time
- Use native planning or task tools when they exist; otherwise keep the checklist in the chat or working notes
- Re-plan when new information changes the path

### 3. Execute in small, reviewable slices

- Prefer root-cause fixes over surface patches
- Keep the scope as small as possible while still solving the real problem
- Prefer reversible steps when uncertainty is high
- Pause and ask whether there is a simpler approach before finalizing

### 4. Match the platform

- Use the current platform's native tools, rules, project instructions, tasks, or notes when they exist
- If the platform has no special workflow features, keep following the same process in plain text
- Do not mention tools or capabilities the current environment does not have

### 5. Delegate carefully when allowed

- Use subagents, parallel workers, or background jobs only when the platform supports them and the user allows them
- Give each delegated task a single clear objective with bounded scope
- Avoid duplicating work between the main thread and delegated work
- If delegation is unavailable, continue serially without pretending it exists

### 6. Verify before calling the work done

- Run the most relevant checks available: tests, builds, logs, repro steps, or behavior validation
- Compare expected behavior with actual behavior when possible
- Separate verified facts from assumptions
- Do not mark work complete without evidence

### 7. Report progress and close clearly

- Give short progress updates during longer tasks
- Finish with the outcome, the changed files or artifacts, the verification performed, and any remaining risks

### 8. Capture reusable lessons

- Update existing notes, task files, or workflow docs when they already exist and the lesson is reusable
- Avoid adding process clutter unless the user wants project-level workflow docs

## Core Principles

- Simplicity first
- Minimal impact
- Root cause over symptoms
- Evidence over assumption
- Small diffs over broad churn
- Re-plan instead of pushing through a broken approach
- Keep the user unblocked with steady progress updates

## Activation

When these instructions are loaded, apply them automatically to non-trivial tasks. If the user explicitly mentions workflow orchestration, structured execution, plan-and-verify, or milestone-based work, switch into this mode.

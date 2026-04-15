---
name: "workflow-orchestration"
description: "Use when the user wants disciplined project execution or orchestration for a task: planning non-trivial work, breaking it into milestones, tracking progress, verifying results, and capturing lessons learned."
---

# Workflow Orchestration

Use this skill when the work needs stronger execution discipline than a one-shot answer.

Typical triggers:
- Multi-step implementation or debugging
- Architectural changes with sequencing or tradeoffs
- Research or migration work with several moving parts
- Work that benefits from explicit progress tracking
- Tasks where verification and follow-through matter as much as the code change
- Reviews where findings, evidence, and next actions must stay organized

## Operating Mode

### 1. Lock the objective

- Restate the goal in concrete terms
- Identify success criteria, constraints, risks, and likely blockers
- Prefer one or two clarifying questions only when the ambiguity is genuinely risky

### 2. Write a short plan

- For work with multiple steps, create an explicit checklist or milestone list before implementing
- Keep only one step in progress at a time
- Use native planning tools when they exist; otherwise keep a concise checklist in working notes or the chat
- Re-plan when new information changes the path

### 3. Execute in small, reviewable slices

- Prefer root-cause fixes over surface patches
- Keep the scope as small as possible while still solving the real problem
- Prefer reversible steps when uncertainty is high
- Pause and ask whether there is a simpler or more elegant approach before finalizing

### 4. Match the platform

- Use the current platform's native tools, rules, project instructions, tasks, or notes when they exist
- If the platform has no special workflow tools, continue with the same process in plain text
- Do not mention tools or capabilities the current environment does not have

### 5. Delegate carefully when allowed

- Use subagents, parallel workers, or background jobs only when the user explicitly asks for delegation or the current environment clearly supports it
- Give each delegated task a single clear objective with bounded scope
- Avoid duplicating work between the main thread and delegated work
- If delegation is not available, continue serially without pretending it exists

### 6. Verify before calling the work done

- Run the most relevant checks available: tests, builds, logs, or behavior validation
- Compare expected behavior with actual behavior when possible
- Separate verified facts from assumptions
- Do not mark work complete without evidence

### 7. Report progress and close clearly

- Give short progress updates during longer tasks
- Finish with the outcome, the changed files or artifacts, the verification performed, and any remaining risks

### 8. Capture reusable lessons

- If the repo already uses files like `tasks/todo.md` or `tasks/lessons.md`, update them when useful
- If those files do not exist, avoid creating process clutter unless the user wants project-level workflow docs
- When a user correction reveals a pattern, encode that lesson in the project workflow if appropriate

## Core Principles

- Simplicity first
- Minimal impact
- Root cause over symptoms
- Evidence over assumption
- Small diffs over broad churn
- Re-plan instead of pushing through a broken approach
- Keep the user unblocked with steady progress updates

## GSD Integration

When GSD (Get Stuff Done) is available, workflow-orchestration actively uses GSD's infrastructure instead of ad-hoc checklists. GSD owns the phase lifecycle; this skill provides the execution discipline and routes to GSD commands at each stage.

### Detection

GSD is active when `.planning/ROADMAP.md` exists in the working directory. GSD is available (but no project initialized) when `/gsd:help` is a recognized command.

### Routing — how each operating step maps to GSD

| Step | Without GSD | With GSD |
|------|-------------|----------|
| 1. Lock the objective | Restate goal in chat | Read `.planning/PROJECT.md` and `STATE.md` for context. If no GSD project exists and the work is substantial, use `/gsd:new-project` to initialize |
| 2. Write a plan | Ad-hoc checklist | Use `/gsd:discuss-phase` to gather context, then `/gsd:plan-phase` to produce a structured PLAN.md. For assumptions, use `/gsd:list-phase-assumptions` first |
| 3. Execute | Inline implementation | Use `/gsd:execute-phase` for wave-based parallel execution with atomic commits. For lightweight single tasks, use `/gsd:quick` |
| 4. Match platform | Use whatever tools exist | GSD IS the platform — use its state tracking, checkpoints, deviation rules, and agent infrastructure |
| 5. Delegate | Serial unless user allows | GSD agents handle delegation: gsd-planner, gsd-executor, gsd-verifier, gsd-debugger, gsd-phase-researcher |
| 6. Verify | Manual checks | Use `/gsd:verify-work` for goal-backward verification (truths, artifacts, key links) |
| 7. Report | Chat summary | GSD produces SUMMARY.md per plan; use `/gsd:progress` for current status |
| 8. Capture lessons | Update task/lesson files | GSD persists decisions in CONTEXT.md and STATE.md. Use `/gsd:add-todo` for deferred ideas |

### When to use which GSD command

- **New project or major initiative** → `/gsd:new-project` (creates PROJECT.md, ROADMAP.md, full phase breakdown)
- **Planning a specific phase** → `/gsd:plan-phase` (produces PLAN.md with tasks, verification, checkpoints)
- **Quick context gathering before planning** → `/gsd:discuss-phase` (adaptive questioning)
- **Executing planned work** → `/gsd:execute-phase` (atomic commits, deviation handling, wave parallelization)
- **Small self-contained task** → `/gsd:quick` (GSD guarantees without full ceremony)
- **Debugging** → `/gsd:debug` (persistent debug state across context resets)
- **Checking progress** → `/gsd:progress` (shows status and routes to next action)
- **Resuming after a break** → `/gsd:resume-work` (full context restoration)
- **Validating delivered work** → `/gsd:verify-work` (conversational UAT)
- **Adding urgent work mid-flight** → `/gsd:insert-phase` (decimal phases like 72.1)
- **Milestone complete** → `/gsd:audit-milestone` then `/gsd:complete-milestone`

### For GSD agents

When GSD spawns specialized agents (planners, executors, verifiers), those agents should apply workflow-orchestration's core principles:

- **Planners**: Restate the phase objective concretely, prefer granular independently-committable tasks, include a `verify` step per task, flag high-uncertainty tasks for reversible approaches
- **Executors**: Fix root causes not symptoms, run every `verify` step before marking tasks done, stop and report if the plan turns out to be wrong rather than pushing through
- **Verifiers**: Compare expected vs actual behavior against stated success criteria, flag any verification that relies on inference rather than direct observation

### Standalone mode

When GSD is not active and not available, this skill operates independently using its full operating mode (sections 1–8 above). It uses whatever planning and task tools the current platform provides.

## Portability

The same workflow is mirrored in the repository root `Workflow-Orchestration.md` and `AGENTS.md` so the instructions can be used in tools that do not support the Codex skill format. When a platform only supports pasted or uploaded instructions, use `Workflow-Orchestration.md` as the source text.

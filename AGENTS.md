# Workflow Orchestration

This file mirrors `Workflow-Orchestration.md` so tools that auto-load `AGENTS.md` use the same workflow.

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

## GSD Integration

When GSD (Get Stuff Done) is available, this workflow actively routes to GSD commands instead of ad-hoc checklists. GSD owns the phase lifecycle; this workflow provides execution discipline and command routing at each stage.

**Detection:** GSD is active when `.planning/ROADMAP.md` exists. GSD is available (but uninitialized) when `/gsd:help` is recognized.

**Routing — each operating step maps to GSD:**

| Step | Without GSD | With GSD |
|------|-------------|----------|
| 1. Lock objective | Restate in chat | Read `.planning/PROJECT.md` + `STATE.md`; use `/gsd:new-project` if no project exists |
| 2. Write plan | Ad-hoc checklist | `/gsd:discuss-phase` → `/gsd:plan-phase` for structured PLAN.md |
| 3. Execute | Inline | `/gsd:execute-phase` (atomic commits, waves); `/gsd:quick` for small tasks |
| 4. Match platform | Use available tools | GSD's state tracking, checkpoints, deviation rules, agent infrastructure |
| 5. Delegate | Serial | GSD agents: gsd-planner, gsd-executor, gsd-verifier, gsd-debugger |
| 6. Verify | Manual checks | `/gsd:verify-work` (goal-backward: truths, artifacts, key links) |
| 7. Report | Chat summary | SUMMARY.md per plan; `/gsd:progress` for status |
| 8. Lessons | Update task files | CONTEXT.md + STATE.md; `/gsd:add-todo` for deferred ideas |

**Key commands:** `/gsd:new-project` (init) · `/gsd:plan-phase` (plan) · `/gsd:execute-phase` (run) · `/gsd:quick` (lightweight) · `/gsd:debug` (persistent debugging) · `/gsd:verify-work` (UAT) · `/gsd:progress` (status) · `/gsd:resume-work` (restore context) · `/gsd:insert-phase` (urgent work) · `/gsd:audit-milestone` + `/gsd:complete-milestone` (close out)

**For GSD agents** — apply workflow-orchestration core principles:
- **Planners**: Restate phase objective concretely, prefer granular independently-committable tasks, include `verify` per task, flag high-uncertainty for reversible approaches
- **Executors**: Fix root causes not symptoms, run every `verify` step before marking done, stop and report if plan is wrong
- **Verifiers**: Compare expected vs actual against success criteria, flag inference-based verification

When GSD is not active and not available, this workflow operates standalone using its full operating mode above.

## Activation

When these instructions are loaded, apply them automatically to non-trivial tasks. If the user explicitly mentions workflow orchestration, structured execution, plan-and-verify, or milestone-based work, switch into this mode.

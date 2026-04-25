# Workflow Orchestration

This repository packages the same workflow in two formats:

- `workflow-orchestration/SKILL.md` for skill-capable agents such as Codex and Claude Code
- `Workflow-Orchestration.md` for tools that accept plain markdown instructions, uploads, or pasted system prompts
- `AGENTS.md` for tools that auto-read agent instructions from the repository root
- an npm CLI that installs the right file for each target
- GSD (Get Shit Done) integration via `.agents/skills/` so GSD planners and executors follow workflow-orchestration principles automatically

The point is to keep one workflow and make it portable across most AI tools, instead of tying it to one agent format.

## What it does

`workflow-orchestration` tells an AI assistant to:

- restate the objective
- write a short plan
- gather only the context needed to make the next correct decision
- automatically split heavy tasks across subagents when the platform supports it
- execute in small steps
- apply quality gates and verify before claiming success
- report progress and remaining risk clearly

## Repository layout

```text
workflow-orchestration-skill/
├── AGENTS.md                        # Auto-loaded by Cursor and Copilot
├── README.md
├── Workflow-Orchestration.md        # Portable instructions for any AI tool
├── bin/
│   └── workflow-orchestration.js    # Interactive CLI installer
├── package.json
└── workflow-orchestration/
    ├── SKILL.md                     # Skill format (Codex, GSD, Claude Code)
    └── agents/
        └── openai.yaml
```

## Install from npm

After you publish this package to npm, users can install or run it with:

```bash
npx workflow-orchestration-skill
```

or:

```bash
npm install -g workflow-orchestration-skill
workflow-orchestration
```

Running the command with no arguments opens an interactive chooser so the user can pick the AI tool they want.

- Codex / skill-based agents
- Cursor
- Claude Code
- GitHub Copilot
- ChatGPT
- Claude Projects
- Gemini Gems
- GSD (Get Shit Done)
- full project setup
- print the portable instructions to the terminal

### Advanced direct commands

These still work for automation or scripts:

```bash
workflow-orchestration print
workflow-orchestration install codex
workflow-orchestration install gsd --dir .
workflow-orchestration install cursor --dir .
workflow-orchestration install claude-code --dir .
workflow-orchestration install copilot --dir .
workflow-orchestration install portable --dir .
workflow-orchestration install project --dir .
```

## Install for skill-capable agents

### Local install

```bash
npx workflow-orchestration-skill install codex
```

Manual copy fallback for trusted local directories only:

```bash
mkdir -p ~/.agents/skills
cp -r workflow-orchestration ~/.agents/skills/
```

The CLI performs path and symlink safety checks that raw `cp -r` does not. Use manual copy only when you trust the source and destination paths.

Then invoke it with either:

```text
Use $workflow-orchestration for this task.
```

or, in agents that expose slash activation:

```text
/workflow-orchestration
```

### Published install

If you publish this repo to GitHub, tools that support the shared skill installer pattern can install it with:

```bash
npx skills add <owner>/<repo>
```

That is the same pattern used by `uncodixfy`.

## Install with the npm package

The intended user flow is:

```bash
npx workflow-orchestration-skill
```

Then choose the AI tool you want from the menu and the CLI writes the right file for that target.

If you need automation or scripts, the advanced direct commands above still work.

## Install for other AI tools

Use `Workflow-Orchestration.md` as the canonical portable instruction file.

- ChatGPT: paste the file into Custom Instructions under `Settings -> Personalization`, or keep it inside a Project as project-level instructions. OpenAI says Custom Instructions live under `Settings -> Personalization` on web/desktop and apply to new chats: https://help.openai.com/en/articles/8096356-chatgpt-custom-instructions
- Claude: create a Project, then click `Set project instructions` and paste the file there. Anthropic says Projects let you add project instructions that apply to all chats in that project: https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects
- Gemini: create a Gem, paste the file into the Gem instructions, and optionally upload repo docs under `Knowledge`. Google says Gems support instructions and uploaded files: https://support.google.com/gemini/answer/15146780
- Cursor: copy the text into `AGENTS.md` at the repo root, or move the same text into a Project Rule or User Rule. Cursor documents both `AGENTS.md` and rules as persistent instruction mechanisms: https://docs.cursor.com/en/context/rules
- GitHub Copilot: copy the same text into `AGENTS.md` in the repo root, or into `.github/copilot-instructions.md` or personal instructions. GitHub documents both `AGENTS.md` agent instructions and custom-instruction files: https://docs.github.com/en/copilot/concepts/prompting/response-customization

## How to use it in each AI

### Codex

1. Run:

```bash
npx workflow-orchestration-skill
```

2. Choose `Codex / skill-based agents`.
3. Start your task with:

```text
Use $workflow-orchestration for this task.
```

Manual fallback:

1. Install the `workflow-orchestration/` skill folder manually.
2. Start your task with:

```text
Use $workflow-orchestration for this task.
```

### GSD (Get Shit Done)

If your project uses GSD for phase-based execution:

```bash
npx workflow-orchestration-skill
```

Choose `GSD (Get Shit Done)`. This installs the skill into `.agents/skills/workflow-orchestration/` in the current project.

GSD planners and executors automatically read skills from `.agents/skills/` and follow their rules. Once installed, every `/gsd:plan-phase`, `/gsd:execute-phase`, and `/gsd:quick` task will apply workflow-orchestration principles — efficient context gathering, root-cause fixes, automatic subagent delegation for heavy tasks, mandatory verification, re-plan on surprise — without any extra prompting.

Manual fallback:

```bash
mkdir -p .agents/skills
cp -r workflow-orchestration .agents/skills/
```

The CLI install path is preferred because it rejects symlinked targets and protected directories. Use manual copy only in trusted project directories.

### Claude Code

Recommended npm flow:

```bash
npx workflow-orchestration-skill
```

Then choose `Claude Code`. This writes `CLAUDE.md` in the current project.

You can also:

- install the `workflow-orchestration/` skill if your setup supports skills
- or copy the same workflow text into a root `CLAUDE.md` or project instruction file manually

Prompt example:

```text
Use workflow orchestration for this task. Make a short plan, execute step by step, verify the result, and keep me updated.
```

### ChatGPT

1. Run:

```bash
npx workflow-orchestration-skill
```

2. Choose `ChatGPT`.
3. Open `Settings -> Personalization -> Custom Instructions`, or create a Project and add the same text there.
4. Paste the generated `Workflow-Orchestration.md`, or use the print option from the CLI if you want terminal output.
5. Start a task with:

```text
Use workflow orchestration for this task: plan it, execute carefully, and verify before saying it is done.
```

### Claude

1. Run:

```bash
npx workflow-orchestration-skill
```

2. Choose `Claude Projects`.
3. Create a Project.
4. Click `Set project instructions`.
5. Paste the generated `Workflow-Orchestration.md`, or use the print option from the CLI if you want terminal output.
6. Start a task with:

```text
Use workflow orchestration for this project. Break the work into milestones and report progress as you go.
```

### Gemini

1. Run:

```bash
npx workflow-orchestration-skill
```

2. Choose `Gemini Gems`.
3. Create a Gem.
4. Paste the generated `Workflow-Orchestration.md` into the Gem instructions.
5. Optionally upload related repo files under `Knowledge`.
6. Start a task with:

```text
Use workflow orchestration for this task. Make a plan first, then execute in small verified steps.
```

### Cursor

1. Run:

```bash
npx workflow-orchestration-skill
```

2. Choose `Cursor`.
3. This writes `AGENTS.md` into the current project.
4. Open the repo in Cursor.
5. Ask for the task directly:

```text
Use workflow orchestration for this change. Keep one step in progress at a time and verify before finishing.
```

### GitHub Copilot

1. Run:

```bash
npx workflow-orchestration-skill
```

2. Choose `GitHub Copilot`.
3. This writes `.github/copilot-instructions.md` into the current project.
4. Open Copilot Chat in the repo context.
5. Start with:

```text
Use workflow orchestration for this task. Plan the work, implement in small slices, and call out any remaining risk.
```

## Keep it the same everywhere

If you want the workflow to behave the same across models, do not rewrite it per platform. Reuse the exact same `Workflow-Orchestration.md` text everywhere:

1. Project or system instructions: paste the contents of `Workflow-Orchestration.md`.
2. Auto-loaded file support: mirror the same text into `AGENTS.md` at the repo root.
3. Skill-based agents: install `workflow-orchestration/`, which mirrors the same rules in skill format.

## Publish to npm

Before publishing, choose a real license instead of `UNLICENSED` if you want public reuse.

```bash
npm publish
```

## Suggested prompt

```text
Use workflow orchestration for this task: make a concise plan, use subagents for heavy independent work when supported, execute in small steps, verify the result, and keep me updated.
```

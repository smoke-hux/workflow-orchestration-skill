# Workflow Orchestration

This repository packages the same workflow in two formats:

- `workflow-orchestration/SKILL.md` for skill-capable agents such as Codex and Claude Code
- `Workflow-Orchestration.md` for tools that accept plain markdown instructions, uploads, or pasted system prompts
- `AGENTS.md` for tools that auto-read agent instructions from the repository root

The point is to keep one workflow and make it portable across most AI tools, instead of tying it to one agent format.

## What it does

`workflow-orchestration` tells an AI assistant to:

- restate the objective
- write a short plan
- execute in small steps
- verify before claiming success
- report progress and remaining risk clearly

## Repository layout

```text
workflow-orchestration-skill/
├── AGENTS.md
├── README.md
├── Workflow-Orchestration.md
└── workflow-orchestration/
    ├── SKILL.md
    └── agents/
        └── openai.yaml
```

## Install for skill-capable agents

### Local install

```bash
mkdir -p ~/.agents/skills
cp -r workflow-orchestration ~/.agents/skills/
```

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

## Install for other AI tools

Use `Workflow-Orchestration.md` as the canonical portable instruction file.

- ChatGPT: paste the file into Custom Instructions under `Settings -> Personalization`, or keep it inside a Project as project-level instructions. OpenAI says Custom Instructions live under `Settings -> Personalization` on web/desktop and apply to new chats: https://help.openai.com/en/articles/8096356-chatgpt-custom-instructions
- Claude: create a Project, then click `Set project instructions` and paste the file there. Anthropic says Projects let you add project instructions that apply to all chats in that project: https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects
- Gemini: create a Gem, paste the file into the Gem instructions, and optionally upload repo docs under `Knowledge`. Google says Gems support instructions and uploaded files: https://support.google.com/gemini/answer/15146780
- Cursor: copy the text into `AGENTS.md` at the repo root, or move the same text into a Project Rule or User Rule. Cursor documents both `AGENTS.md` and rules as persistent instruction mechanisms: https://docs.cursor.com/en/context/rules
- GitHub Copilot: copy the same text into `AGENTS.md` in the repo root, or into `.github/copilot-instructions.md` or personal instructions. GitHub documents both `AGENTS.md` agent instructions and custom-instruction files: https://docs.github.com/en/copilot/concepts/prompting/response-customization

## How to use it in each AI

### Codex

1. Install the `workflow-orchestration/` skill folder.
2. Start your task with:

```text
Use $workflow-orchestration for this task.
```

### Claude Code

You can use either format:

- install the `workflow-orchestration/` skill if your setup supports skills
- or copy the same workflow text into a root `CLAUDE.md` or project instruction file

Prompt example:

```text
Use workflow orchestration for this task. Make a short plan, execute step by step, verify the result, and keep me updated.
```

### ChatGPT

1. Open `Settings -> Personalization -> Custom Instructions`, or create a Project and add the same text there.
2. Paste the contents of `Workflow-Orchestration.md`.
3. Start a task with:

```text
Use workflow orchestration for this task: plan it, execute carefully, and verify before saying it is done.
```

### Claude

1. Create a Project.
2. Click `Set project instructions`.
3. Paste `Workflow-Orchestration.md`.
4. Start a task with:

```text
Use workflow orchestration for this project. Break the work into milestones and report progress as you go.
```

### Gemini

1. Create a Gem.
2. Paste `Workflow-Orchestration.md` into the Gem instructions.
3. Optionally upload related repo files under `Knowledge`.
4. Start a task with:

```text
Use workflow orchestration for this task. Make a plan first, then execute in small verified steps.
```

### Cursor

1. Put the same workflow text into root `AGENTS.md`, or into a Cursor Project Rule.
2. Open the repo in Cursor.
3. Ask for the task directly:

```text
Use workflow orchestration for this change. Keep one step in progress at a time and verify before finishing.
```

### GitHub Copilot

1. Put the same workflow text into root `AGENTS.md`, `.github/copilot-instructions.md`, or your personal instructions.
2. Open Copilot Chat in the repo context.
3. Start with:

```text
Use workflow orchestration for this task. Plan the work, implement in small slices, and call out any remaining risk.
```

## Keep it the same everywhere

If you want the workflow to behave the same across models, do not rewrite it per platform. Reuse the exact same `Workflow-Orchestration.md` text everywhere:

1. Project or system instructions: paste the contents of `Workflow-Orchestration.md`.
2. Auto-loaded file support: mirror the same text into `AGENTS.md` at the repo root.
3. Skill-based agents: install `workflow-orchestration/`, which mirrors the same rules in skill format.

## Suggested prompt

```text
Use workflow orchestration for this task: make a plan, execute in small steps, verify the result, and keep me updated.
```

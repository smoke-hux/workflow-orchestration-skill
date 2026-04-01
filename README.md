# Workflow Orchestration Skill

This repository packages a reusable Codex skill that helps with disciplined execution of multi-step work.

## Included skill

- `workflow-orchestration`: plan, sequence, verify, and track complex work

## Repository layout

```text
workflow-orchestration-skill/
├── README.md
├── .gitignore
└── workflow-orchestration/
    ├── SKILL.md
    └── agents/
        └── openai.yaml
```

## Install locally

Copy the `workflow-orchestration/` folder into your local skills directory.

```bash
mkdir -p ~/.agents/skills
cp -r workflow-orchestration ~/.agents/skills/
```

## Use the skill

Reference it in a prompt with:

```text
Use $workflow-orchestration to plan, execute, and verify this multi-step project.
```

## Publish to GitHub

1. Create a new GitHub repository.
2. Push this directory as the repository contents.
3. Add a `LICENSE` file before publishing if you want to define reuse terms.

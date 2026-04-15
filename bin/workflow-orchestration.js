#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const readline = require("node:readline/promises");

const rootDir = path.resolve(__dirname, "..");
const portableSource = path.join(rootDir, "Workflow-Orchestration.md");
const agentsSource = path.join(rootDir, "AGENTS.md");
const skillSource = path.join(rootDir, "workflow-orchestration");

const args = process.argv.slice(2);

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});

async function main() {
  if (hasFlag("--help") || hasFlag("-h")) {
    printHelp();
    return;
  }

  if (args.length === 0) {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
      printHelp();
      return;
    }

    await runInteractive();
    return;
  }

  const command = args[0];

  if (command === "print") {
    process.stdout.write(fs.readFileSync(portableSource, "utf8"));
    return;
  }

  if (command === "install") {
    const target = args[1];

    if (!target) {
      throw new Error("Missing install target. Run `workflow-orchestration --help`.");
    }

    installTarget(target);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

function installTarget(target, options = {}) {
  const force = options.force ?? hasFlag("--force");
  const dirOverride = options.dirOverride ?? getFlagValue("--dir");
  const targetKey = normalizeTarget(target);

  if (targetKey === "skill") {
    const baseDir = dirOverride || path.join(os.homedir(), ".agents", "skills");
    const destination = path.join(baseDir, "workflow-orchestration");
    copyDirectory(skillSource, destination, force);
    console.log(`Installed skill to ${destination}`);
    return;
  }

  if (targetKey === "portable") {
    const baseDir = dirOverride || process.cwd();
    const destination = path.join(baseDir, "Workflow-Orchestration.md");
    copyFile(portableSource, destination, force);
    console.log(`Wrote ${destination}`);
    return;
  }

  if (targetKey === "agents") {
    const baseDir = dirOverride || process.cwd();
    const destination = path.join(baseDir, "AGENTS.md");
    copyFile(agentsSource, destination, force);
    console.log(`Wrote ${destination}`);
    return;
  }

  if (targetKey === "claude-md") {
    const baseDir = dirOverride || process.cwd();
    const destination = path.join(baseDir, "CLAUDE.md");
    copyFile(portableSource, destination, force);
    console.log(`Wrote ${destination}`);
    return;
  }

  if (targetKey === "copilot") {
    const baseDir = dirOverride || process.cwd();
    const destination = path.join(baseDir, ".github", "copilot-instructions.md");
    copyFile(portableSource, destination, force);
    console.log(`Wrote ${destination}`);
    return;
  }

  if (targetKey === "gsd") {
    const baseDir = dirOverride || process.cwd();
    const destination = path.join(baseDir, ".agents", "skills", "workflow-orchestration");
    copyDirectory(skillSource, destination, force);
    console.log(`Installed skill to ${destination}`);
    console.log("GSD planners and executors will now pick up workflow-orchestration rules automatically.");
    return;
  }

  if (targetKey === "project") {
    const baseDir = dirOverride || process.cwd();
    const gsdDest = path.join(baseDir, ".agents", "skills", "workflow-orchestration");
    const destinations = [
      path.join(baseDir, "Workflow-Orchestration.md"),
      path.join(baseDir, "AGENTS.md"),
      path.join(baseDir, "CLAUDE.md"),
      path.join(baseDir, ".github", "copilot-instructions.md"),
      gsdDest
    ];

    for (const destination of destinations) {
      assertCanWrite(destination, force);
    }

    copyFile(portableSource, destinations[0], true);
    copyFile(agentsSource, destinations[1], true);
    copyFile(portableSource, destinations[2], true);
    copyFile(portableSource, destinations[3], true);
    copyDirectory(skillSource, gsdDest, true);
    console.log(`Wrote project instruction files in ${baseDir}`);
    return;
  }

  throw new Error(`Unsupported install target: ${target}`);
}

async function runInteractive() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const choices = [
    {
      label: "Codex / skill-based agents",
      note: `Install into ${path.join(os.homedir(), ".agents", "skills")}`,
      target: "codex",
      defaultDir: () => path.join(os.homedir(), ".agents", "skills")
    },
    {
      label: "Cursor",
      note: "Write AGENTS.md into a project",
      target: "cursor",
      defaultDir: () => process.cwd()
    },
    {
      label: "Claude Code",
      note: "Write CLAUDE.md into a project",
      target: "claude-code",
      defaultDir: () => process.cwd()
    },
    {
      label: "GitHub Copilot",
      note: "Write .github/copilot-instructions.md into a project",
      target: "copilot",
      defaultDir: () => process.cwd()
    },
    {
      label: "ChatGPT",
      note: "Write Workflow-Orchestration.md for paste/upload",
      target: "chatgpt",
      defaultDir: () => process.cwd()
    },
    {
      label: "Claude Projects",
      note: "Write Workflow-Orchestration.md for paste/upload",
      target: "claude",
      defaultDir: () => process.cwd()
    },
    {
      label: "Gemini Gems",
      note: "Write Workflow-Orchestration.md for paste/upload",
      target: "gemini",
      defaultDir: () => process.cwd()
    },
    {
      label: "GSD (Get Shit Done)",
      note: "Install into .agents/skills/ for GSD integration",
      target: "gsd",
      defaultDir: () => process.cwd()
    },
    {
      label: "Project setup",
      note: "Write all supported repo instruction files",
      target: "project",
      defaultDir: () => process.cwd()
    },
    {
      label: "Print portable instructions",
      note: "Output Workflow-Orchestration.md to the terminal",
      action: "print"
    },
    {
      label: "Exit",
      action: "exit"
    }
  ];

  try {
    console.log("Workflow Orchestration");
    console.log("");
    console.log("Choose where to install or export the workflow:");
    console.log("");

    for (const [index, choice] of choices.entries()) {
      const suffix = choice.note ? ` - ${choice.note}` : "";
      console.log(`  ${index + 1}. ${choice.label}${suffix}`);
    }

    console.log("");

    const answer = await rl.question(`Select an option [1-${choices.length}]: `);
    const index = Number.parseInt(answer.trim(), 10) - 1;
    const choice = choices[index];

    if (!choice) {
      throw new Error("Invalid selection.");
    }

    if (choice.action === "exit") {
      console.log("No changes made.");
      return;
    }

    if (choice.action === "print") {
      console.log("");
      process.stdout.write(fs.readFileSync(portableSource, "utf8"));
      return;
    }

    const defaultDir = choice.defaultDir();
    const dirAnswer = await rl.question(`Target directory [${defaultDir}]: `);
    const dirOverride = dirAnswer.trim() ? path.resolve(dirAnswer.trim()) : defaultDir;
    let force = hasFlag("--force");

    const existing = getDestinations(choice.target, dirOverride).filter(fs.existsSync);
    if (!force && existing.length > 0) {
      console.log("");
      console.log("These files already exist:");
      for (const destination of existing) {
        console.log(`- ${destination}`);
      }

      const overwrite = await rl.question("Overwrite them? [y/N]: ");
      force = isYes(overwrite);

      if (!force) {
        console.log("Cancelled.");
        return;
      }
    }

    installTarget(choice.target, { dirOverride, force });
  } finally {
    rl.close();
  }
}

function normalizeTarget(target) {
  const value = target.toLowerCase();
  const aliases = {
    codex: "skill",
    skill: "skill",
    "claude-code": "claude-md",
    claudecode: "claude-md",
    claude: "portable",
    chatgpt: "portable",
    gemini: "portable",
    portable: "portable",
    markdown: "portable",
    cursor: "agents",
    agents: "agents",
    copilot: "copilot",
    gsd: "gsd",
    "get-shit-done": "gsd",
    project: "project"
  };

  return aliases[value] || value;
}

function getDestinations(target, dirOverride) {
  const targetKey = normalizeTarget(target);

  if (targetKey === "skill") {
    return [path.join(dirOverride || path.join(os.homedir(), ".agents", "skills"), "workflow-orchestration")];
  }

  if (targetKey === "portable") {
    return [path.join(dirOverride || process.cwd(), "Workflow-Orchestration.md")];
  }

  if (targetKey === "agents") {
    return [path.join(dirOverride || process.cwd(), "AGENTS.md")];
  }

  if (targetKey === "claude-md") {
    return [path.join(dirOverride || process.cwd(), "CLAUDE.md")];
  }

  if (targetKey === "copilot") {
    return [path.join(dirOverride || process.cwd(), ".github", "copilot-instructions.md")];
  }

  if (targetKey === "gsd") {
    return [path.join(dirOverride || process.cwd(), ".agents", "skills", "workflow-orchestration")];
  }

  if (targetKey === "project") {
    const baseDir = dirOverride || process.cwd();
    return [
      path.join(baseDir, "Workflow-Orchestration.md"),
      path.join(baseDir, "AGENTS.md"),
      path.join(baseDir, "CLAUDE.md"),
      path.join(baseDir, ".github", "copilot-instructions.md"),
      path.join(baseDir, ".agents", "skills", "workflow-orchestration")
    ];
  }

  throw new Error(`Unsupported install target: ${target}`);
}

function copyFile(source, destination, force) {
  ensureParentDir(destination);
  assertCanWrite(destination, force);

  fs.copyFileSync(source, destination);
}

function copyDirectory(source, destination, force) {
  ensureParentDir(destination);
  assertCanWrite(destination, force);

  if (fs.existsSync(destination)) {
    fs.rmSync(destination, { recursive: true, force: true });
  }

  fs.cpSync(source, destination, { recursive: true });
}

function assertCanWrite(destination, force) {
  if (!force && fs.existsSync(destination)) {
    throw new Error(`Refusing to overwrite ${destination}. Re-run with --force.`);
  }
}

function ensureParentDir(destination) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
}

function hasFlag(name) {
  return args.includes(name);
}

function getFlagValue(name) {
  const index = args.indexOf(name);
  if (index === -1) {
    return null;
  }

  const value = args[index + 1];
  if (!value || value.startsWith("-")) {
    throw new Error(`Missing value for ${name}`);
  }

  return path.resolve(value);
}

function isYes(value) {
  const normalized = value.trim().toLowerCase();
  return normalized === "y" || normalized === "yes";
}

function printHelp() {
  console.log(`workflow-orchestration

Usage:
  workflow-orchestration
  workflow-orchestration print
  workflow-orchestration install <target> [--dir <path>] [--force]

Running without arguments opens an interactive chooser in a terminal.

Targets:
  skill, codex        Install the SKILL.md bundle into ~/.agents/skills
  agents, cursor      Write AGENTS.md into the target directory
  claude-code         Write CLAUDE.md into the target directory
  copilot             Write .github/copilot-instructions.md into the target directory
  gsd                 Install into .agents/skills/ for GSD (Get Shit Done) integration
  portable            Write Workflow-Orchestration.md into the target directory
  chatgpt             Alias for portable
  claude              Alias for portable
  gemini              Alias for portable
  project             Write all repo instruction files including GSD skill

Examples:
  npx workflow-orchestration-skill
  npx workflow-orchestration-skill install codex
  npx workflow-orchestration-skill install gsd --dir .
  npx workflow-orchestration-skill install cursor --dir .
  npx workflow-orchestration-skill install claude-code --dir .
  npx workflow-orchestration-skill install copilot --dir .
  npx workflow-orchestration-skill print
`);
}

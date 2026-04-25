#!/usr/bin/env node

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const bin = path.join(repoRoot, "bin", "workflow-orchestration.js");

runTest("rejects final symlink destinations", (tmpDir) => {
  const projectDir = path.join(tmpDir, "project");
  const outsideFile = path.join(tmpDir, "outside.txt");

  fs.mkdirSync(projectDir);
  fs.writeFileSync(outsideFile, "keep");
  fs.symlinkSync(outsideFile, path.join(projectDir, "AGENTS.md"));

  const result = run(["install", "cursor", "--dir", projectDir, "--force"]);
  assertFailed(result, /symbolic link/);
  assert.equal(fs.readFileSync(outsideFile, "utf8"), "keep");
});

runTest("allows normal file installs into temp projects", (tmpDir) => {
  const projectDir = path.join(tmpDir, "project");

  fs.mkdirSync(projectDir);

  const result = run(["install", "cursor", "--dir", projectDir]);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(fs.readFileSync(path.join(projectDir, "AGENTS.md"), "utf8"), /Workflow Orchestration/);
});

runTest("allows forced overwrite of regular files only", (tmpDir) => {
  const projectDir = path.join(tmpDir, "project");
  const agentsFile = path.join(projectDir, "AGENTS.md");

  fs.mkdirSync(projectDir);
  fs.writeFileSync(agentsFile, "old");

  const result = run(["install", "cursor", "--dir", projectDir, "--force"]);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(fs.readFileSync(agentsFile, "utf8"), /Workflow Orchestration/);
});

runTest("rejects broken symlink destinations", (tmpDir) => {
  const projectDir = path.join(tmpDir, "project");
  const missingFile = path.join(tmpDir, "missing.txt");

  fs.mkdirSync(projectDir);
  fs.symlinkSync(missingFile, path.join(projectDir, "AGENTS.md"));

  const result = run(["install", "cursor", "--dir", projectDir, "--force"]);
  assertFailed(result, /symbolic link/);
  assert.equal(fs.existsSync(missingFile), false);
});

runTest("rejects symlinked parent directories", (tmpDir) => {
  const projectDir = path.join(tmpDir, "project");
  const outsideDir = path.join(tmpDir, "outside");

  fs.mkdirSync(projectDir);
  fs.mkdirSync(outsideDir);
  fs.symlinkSync(outsideDir, path.join(projectDir, ".github"), "dir");

  const result = run(["install", "copilot", "--dir", projectDir]);
  assertFailed(result, /symbolic link/);
  assert.equal(fs.existsSync(path.join(outsideDir, "copilot-instructions.md")), false);
});

runTest("rejects regular files as target directories", (tmpDir) => {
  const targetFile = path.join(tmpDir, "not-a-directory");

  fs.writeFileSync(targetFile, "file");

  const result = run(["install", "cursor", "--dir", targetFile]);
  assertFailed(result, /not a directory/);
});

runTest("rejects symlinked target directories", (tmpDir) => {
  const realDir = path.join(tmpDir, "real");
  const linkDir = path.join(tmpDir, "link");

  fs.mkdirSync(realDir);
  fs.symlinkSync(realDir, linkDir, "dir");

  const result = run(["install", "cursor", "--dir", linkDir]);
  assertFailed(result, /symbolic link/);
  assert.equal(fs.existsSync(path.join(realDir, "AGENTS.md")), false);
});

runTest("preflights project parent conflicts before writing files", (tmpDir) => {
  const projectDir = path.join(tmpDir, "project");

  fs.mkdirSync(projectDir);
  fs.writeFileSync(path.join(projectDir, ".github"), "file");

  const result = run(["install", "project", "--dir", projectDir]);
  assertFailed(result, /not a directory|ENOTDIR/);
  assert.equal(fs.existsSync(path.join(projectDir, "Workflow-Orchestration.md")), false);
  assert.equal(fs.existsSync(path.join(projectDir, "AGENTS.md")), false);
  assert.equal(fs.existsSync(path.join(projectDir, "CLAUDE.md")), false);
});

runTest("rejects direct installs into protected root directory", () => {
  const result = run(["install", "cursor", "--dir", path.parse(repoRoot).root]);
  assertFailed(result, /protected directory/);
});

runTest("rejects nested installs under protected home ssh directory", () => {
  const targetDir = path.join(os.homedir(), ".ssh", "workflow-orchestration-security-probe");

  const result = run(["install", "cursor", "--dir", targetDir]);
  assertFailed(result, /protected directory tree/);
  assert.equal(fs.existsSync(targetDir), false);
});

runTest("rejects copying the skill onto its own source tree", () => {
  const skillFile = path.join(repoRoot, "workflow-orchestration", "SKILL.md");
  const result = run(["install", "codex", "--dir", repoRoot, "--force"]);

  assertFailed(result, /itself|own source tree/);
  assert.equal(fs.existsSync(skillFile), true);
});

runTest("rejects unknown option typos", (tmpDir) => {
  const result = run(["install", "cursor", "--dr", tmpDir]);
  assertFailed(result, /Unknown option: --dr/);
});

runTest("rejects equals-form dir option", (tmpDir) => {
  const result = run(["install", "cursor", `--dir=${tmpDir}`]);
  assertFailed(result, /--dir <path>/);
});

runTest("no-arg non-tty mode fails instead of silently doing nothing", () => {
  const result = run([]);
  assertFailed(result, /Interactive mode requires a TTY/);
});

function runTest(name, testFn) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "workflow-orchestration-security-"));

  try {
    testFn(tmpDir);
    console.log(`ok - ${name}`);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function run(args) {
  return spawnSync(process.execPath, [bin, ...args], {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"]
  });
}

function assertFailed(result, pattern) {
  const output = `${result.stdout}\n${result.stderr}`;
  assert.notEqual(result.status, 0, output);
  assert.match(output, pattern);
}

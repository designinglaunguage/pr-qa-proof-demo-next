const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { generateReports } = require("./generate-qa-proof-report");

const root = path.resolve(__dirname, "..");
const artifactDir = path.join(root, "qa-proof-artifacts");
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

fs.rmSync(artifactDir, { force: true, recursive: true });
fs.mkdirSync(path.join(artifactDir, "screenshots"), { recursive: true });

const result = spawnSync(npx, ["playwright", "test", "tests/qa-proof"], {
  cwd: root,
  env: process.env,
  stdio: "inherit"
});

const exitCode = typeof result.status === "number" ? result.status : 1;
generateReports({ exitCode });
process.exit(exitCode);

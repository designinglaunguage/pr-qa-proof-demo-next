const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const srcDir = path.join(root, "src");
const distDir = path.join(root, "dist");

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });

  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);

    if (entry.isDirectory()) {
      copyDir(source, target);
      continue;
    }

    fs.copyFileSync(source, target);
  }
}

fs.rmSync(distDir, { force: true, recursive: true });
copyDir(srcDir, distDir);

console.log(`Built static demo into ${distDir}`);

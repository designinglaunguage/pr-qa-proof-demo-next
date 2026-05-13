const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const port = Number(getArgValue("--port") || process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8"
};

if (!fs.existsSync(distDir)) {
  console.error("dist/ does not exist. Run `npm run build` first.");
  process.exit(1);
}

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  return index === -1 ? undefined : process.argv[index + 1];
}

function resolveRequestPath(url) {
  const requestUrl = new URL(url, `http://${host}:${port}`);
  let pathname = decodeURIComponent(requestUrl.pathname);

  if (pathname === "/") {
    pathname = "/index.html";
  }

  const resolved = path.resolve(distDir, `.${pathname}`);
  const relativePath = path.relative(distDir, resolved);
  if (relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) {
    return null;
  }

  return resolved;
}

const server = http.createServer((request, response) => {
  const filePath = resolveRequestPath(request.url || "/");

  if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const ext = path.extname(filePath);
  response.writeHead(200, {
    "cache-control": "no-store",
    "content-type": contentTypes[ext] || "application/octet-stream"
  });
  fs.createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`PR QA proof demo running at http://${host}:${port}`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});

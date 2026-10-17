import { accessSync, createReadStream } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const candidates = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser"
].filter(Boolean);

const chrome = candidates.find((candidate) => {
  try {
    accessSync(candidate);
    return true;
  } catch {
    return false;
  }
});

if (!chrome) {
  console.error("Chrome or Chromium is required for the browser smoke test.");
  process.exit(1);
}

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".wasm": "application/wasm"
};

const server = createServer((request, response) => {
  const pathname = new URL(request.url ?? "/", "http://127.0.0.1").pathname;
  const relativePath = pathname === "/" ? "/tests/browser.html" : pathname;
  const file = resolve(projectDirectory, `.${relativePath}`);
  if (!file.startsWith(projectDirectory)) {
    response.writeHead(403).end();
    return;
  }
  response.setHeader("Content-Type", contentTypes[extname(file)] ?? "application/octet-stream");
  const stream = createReadStream(file);
  stream.on("error", () => response.writeHead(404).end());
  stream.pipe(response);
});

await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
const address = server.address();
if (typeof address === "string" || address == null) {
  server.close();
  throw new Error("Unable to determine browser test server port");
}

const result = await new Promise((resolveRun) => {
  const child = spawn(chrome, [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--virtual-time-budget=5000",
    "--dump-dom",
    `http://127.0.0.1:${address.port}/tests/browser.html`
  ]);
  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk) => { stdout += chunk; });
  child.stderr.on("data", (chunk) => { stderr += chunk; });
  child.on("close", (code) => resolveRun({ code, stdout, stderr }));
});

server.close();
if (result.code !== 0 || !result.stdout.includes('data-result="pass"')) {
  console.error(result.stdout);
  console.error(result.stderr);
  process.exit(1);
}
console.log("Browser WebAssembly smoke test passed");

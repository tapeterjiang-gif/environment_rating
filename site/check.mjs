import { accessSync, createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "dist");
const pages = [
  { file: "index.html", expected: ["环境评级标准", "热舒适度", "空气质量", "声光", "thermometer.medium", "carbon.dioxide.cloud", "sun.max"] },
  { file: "colors.html", expected: ["Qingping Environmental Colors V1.5", "环境指标颜色说明", "热舒适度", "空气质量", "声光环境", "TVOC 指数", "speedometer", "指标识别色", "等级状态色"] }
];

for (const page of pages) {
  const html = await readFile(resolve(root, page.file), "utf8");
  for (const text of page.expected) {
    if (!html.includes(text)) throw new Error(`${page.file} is missing: ${text}`);
  }
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1];
    if (target.startsWith("#") || target.includes("://")) continue;
    accessSync(resolve(root, target.split("#")[0]));
  }
}

const candidates = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser"
].filter(Boolean);
const chrome = candidates.find((candidate) => {
  try { accessSync(candidate); return true; } catch { return false; }
});
if (!chrome) throw new Error("Chrome or Chromium is required");

let missing = false;
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml" };
const server = createServer((request, response) => {
  const pathname = new URL(request.url ?? "/", "http://127.0.0.1").pathname;
  const file = resolve(root, pathname === "/" ? "index.html" : `.${pathname}`);
  if (!file.startsWith(root)) return response.writeHead(403).end();
  response.setHeader("Content-Type", types[extname(file)] ?? "application/octet-stream");
  const stream = createReadStream(file);
  stream.on("error", () => { missing = true; response.writeHead(404).end(); });
  stream.pipe(response);
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));
const address = server.address();
if (typeof address === "string" || address == null) throw new Error("Unable to start preview server");

for (const page of pages) {
  const output = await new Promise((done) => {
    const child = spawn(chrome, ["--headless=new", "--no-sandbox", "--disable-gpu", "--virtual-time-budget=1000", "--dump-dom", `http://127.0.0.1:${address.port}/${page.file}`]);
    let stdout = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.on("close", (code) => done({ code, stdout }));
  });
  if (output.code !== 0 || !output.stdout.includes("<main")) throw new Error(`${page.file} did not render`);
}
server.close();
if (missing) throw new Error("A page requested a missing local resource");
console.log("Environment guide pages passed browser checks");

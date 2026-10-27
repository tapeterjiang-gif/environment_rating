import { accessSync, createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "dist");
const pages = [
  { file: "index.html", expected: ["环境评级指南", "指标识别色", "等级状态色", "颜色值怎样看", "热舒适度", "空气质量", "声光环境", "相对湿度三档提示", "CO₂ 三档通风提示", "选择颗粒物评级标准", "data-pm-standard=\"eea\"", "data-pm-standard=\"hj\"", "data-pm-standard=\"epa\"", "PM2.5 EEA 六档图示", "PM10 EEA 六档图示", "PM2.5 中国 HJ 六档图示", "PM10 中国 HJ 六档图示", "PM2.5 美国 EPA 六档图示", "PM10 美国 EPA 六档图示", "甲醛 WHO 六档图示", "住宅噪声四档图示", "睡眠噪声四档图示", "照度六档活动提示", "低于 40%RH", "40%–60%RH", "高于 60%RH", "#F97316", "状态色 #1D4ED8", "状态色 #7E22CE", "状态色 #475569", "图标来源", "图标：Material Symbols", "device_thermostat</code>", "carbon.dioxide.cloud", "aqi.medium", "graphic_eq</code>", "sun.max", "Material Symbols Rounded", "SF Symbols", "这些标准分别解决什么问题", "ISO 7730:2025", "HJ 633—2026", "德国 UBA 2008 CO₂ 指导值", "WHO《社区噪声指南》", "ANSI/IES/ALA RP-11-26", "language-select", "zh-Hant", "English", "日本語", "i18n-zh-hant.js", "i18n.js", "qingping-wordmark.png", "favicon.ico", "favicon-32x32.png", "apple-touch-icon.png", "site.webmanifest", "device_thermostat.svg", "co2.svg", "blur_on.svg", "light_mode.svg"] },
  { file: "colors.html", expected: ["颜色说明已合并", "index.html#color-principles", "favicon.ico", "favicon-32x32.png", "apple-touch-icon.png"] }
];

for (const page of pages) {
  const html = await readFile(resolve(root, page.file), "utf8");
  for (const text of page.expected) {
    if (!html.includes(text)) throw new Error(`${page.file} is missing: ${text}`);
  }
  if (page.file === "index.html" && /查看 PM(?:2\.5|10) 六档边界/.test(html)) throw new Error("index.html still contains the removed PM boundary expanders");
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1];
    if (target.startsWith("#") || target.includes("://")) continue;
    accessSync(resolve(root, target.split("#")[0]));
  }
  for (const match of html.matchAll(/url\(['"]?([^'")]+)['"]?\)/g)) {
    const target = match[1];
    if (target.startsWith("data:") || target.includes("://")) continue;
    accessSync(resolve(root, target));
  }
}

const manifest = JSON.parse(await readFile(resolve(root, "site.webmanifest"), "utf8"));
if (manifest.theme_color !== "#0564A0") throw new Error("site.webmanifest has the wrong Qingping theme color");
for (const icon of manifest.icons ?? []) accessSync(resolve(root, icon.src));

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
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json" };
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

const renderTargets = [
  ...pages.map((page) => ({ url: page.file, expected: ["<main"] })),
  { url: "index.html?lang=zh-Hant", expected: ["<html lang=\"zh-Hant\"", "環境評級指南", "相對濕度提示", "選擇顆粒物評級標準", "評級依據"] },
  { url: "index.html?lang=en", expected: ["<html lang=\"en\"", "Environmental Rating Guide", "Thermal Comfort", "Select a particle rating standard", "What each reference addresses", "Back to top"] },
  { url: "index.html?lang=ja", expected: ["<html lang=\"ja\"", "環境評価ガイド", "温熱快適性", "粒子状物質の評価基準を選択", "各基準が扱う内容", "ページ上部へ"] }
];

for (const target of renderTargets) {
  const output = await new Promise((done) => {
    const child = spawn(chrome, ["--headless=new", "--no-sandbox", "--disable-gpu", "--virtual-time-budget=1000", "--dump-dom", `http://127.0.0.1:${address.port}/${target.url}`]);
    let stdout = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.on("close", (code) => done({ code, stdout }));
  });
  if (output.code !== 0 || target.expected.some((text) => !output.stdout.includes(text))) throw new Error(`${target.url} did not render expected localized content`);
}
server.close();
if (missing) throw new Error("A page requested a missing local resource");
console.log("Environment guide pages passed browser checks");

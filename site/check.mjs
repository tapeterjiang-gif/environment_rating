import { accessSync, createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "dist");
const pages = [
  { file: "index.html", expected: ["环境评级指南", "environment-map", "category-card-stack", "category-card thermal", "category-card air", "category-card sound-light", "href=\"#thermal\"", "href=\"#air\"", "href=\"#sound-light\"", "指标识别色", "等级状态色", "颜色值怎样看", "热舒适度", "空气质量", "声光环境", "相对湿度三档提示", "CO₂ 三档通风提示", "选择颗粒物评级标准", "data-standard-switcher=\"pm\"", "data-standard-option=\"eea\"", "data-standard-option=\"hj\"", "data-standard-option=\"epa\"", "PM2.5 EEA 六档图示", "PM10 EEA 六档图示", "PM2.5 中国 HJ 六档图示", "PM10 中国 HJ 六档图示", "PM2.5 美国 EPA 六档图示", "PM10 美国 EPA 六档图示", "选择甲醛评级标准", "data-standard-switcher=\"hcho\"", "data-standard-option=\"who\"", "data-standard-option=\"gbt\"", "data-standard-option=\"oehha\"", "甲醛 WHO 六档图示", "甲醛 GB/T 六档图示", "甲醛 OEHHA 六档图示", "住宅噪声四档图示", "睡眠噪声四档图示", "照度六档活动提示", "低于 40%RH", "40%–60%RH", "高于 60%RH", "#F97316", "<span>浅色背景</span> #FFEDD5", "<span>状态色</span> #1D4ED8", "<span>标签背景</span> #DBEAFE", "<span>标签文字</span> #1E3A8A", "<span>状态色</span> #7E22CE", "<span>状态色</span> #475569", "图标来源", "图标：Material Symbols", "device_thermostat</code>", "carbon.dioxide.cloud", "aqi.medium", "graphic_eq</code>", "sun.max", "Material Symbols Rounded", "SF Symbols", "评级的依据来源是什么？", "本指南的评级依据来自国际组织、政府部门和专业机构发布的标准与指南。", "standard-org", "国际标准化组织（ISO）", "中华人民共和国生态环境部", "国家市场监督管理总局", "国家标准化管理委员会", "ISO 7730:2025", "HJ 633—2026", "德国 UBA 2008 CO₂ 指导值", "WHO《社区噪声指南》", "ANSI/IES/ALA RP-11-26", "language-select", "zh-Hant", "English", "日本語", "i18n-zh-hant.js", "i18n.js", "qingping-wordmark.png", "favicon.ico", "favicon-32x32.png", "apple-touch-icon.png", "site.webmanifest", "device_thermostat.svg", "co2.svg", "blur_on.svg", "light_mode.svg"] },
  { file: "colors.html", expected: ["颜色说明已合并", "index.html#color-principles", "favicon.ico", "favicon-32x32.png", "apple-touch-icon.png"] }
];

for (const page of pages) {
  const html = await readFile(resolve(root, page.file), "utf8");
  for (const text of page.expected) {
    if (!html.includes(text)) throw new Error(`${page.file} is missing: ${text}`);
  }
  if (page.file === "index.html" && /查看 PM(?:2\.5|10) 六档边界/.test(html)) throw new Error("index.html still contains the removed PM boundary expanders");
  if (page.file === "index.html" && (html.includes("甲醛：以参考浓度为中心分档") || html.includes("<th>可选依据</th>"))) throw new Error("index.html still contains the replaced formaldehyde comparison table");
  if (page.file === "index.html" && (html.includes("<span class=\"standard-org\"><span>") || html.includes("标准机构"))) throw new Error("index.html still contains the removed standards-body capsule");
  if (page.file === "index.html" && [...html.matchAll(/<span class="standard-org">([\s\S]*?)<\/span>/g)].some(([, content]) => !content.includes("<a href="))) throw new Error("A standards body is missing its official website link");
  if (page.file === "index.html" && (html.includes("class=\"orb\"") || html.includes("class=\"float-card") || html.includes("environment-axis") || html.includes("environment-node") || html.includes("environment-hub") || html.includes("category-rings"))) throw new Error("index.html still contains an earlier hero graphic");
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1];
    if (target.startsWith("#") || target.includes("://")) continue;
    accessSync(resolve(root, target.split(/[?#]/)[0]));
  }
  for (const match of html.matchAll(/url\(['"]?([^'")]+)['"]?\)/g)) {
    const target = match[1];
    if (target.startsWith("#") || target.startsWith("data:") || target.includes("://")) continue;
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
  { url: "index.html?lang=zh-Hant", expected: ["<html lang=\"zh-Hant\"", "環境評級指南", "相對濕度提示", "選擇顆粒物評級標準", "選擇甲醛評級標準", "淺色背景", "標籤背景", "標籤文字", "評級依據"] },
  { url: "index.html?lang=en", expected: ["<html lang=\"en\"", "Environmental Rating Guide", "Thermal Comfort", "Select a particle rating standard", "Select a formaldehyde rating reference", "What are the sources behind the ratings?", "Light background", "Label background", "Label text color", "Back to top"] },
  { url: "index.html?lang=ja", expected: ["<html lang=\"ja\"", "環境評価ガイド", "温熱快適性", "粒子状物質の評価基準を選択", "ホルムアルデヒドの評価基準を選択", "評価の根拠はどこから来ているのか？", "淡い背景色", "ラベル背景", "ラベル文字色", "ページ上部へ"] }
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

import { accessSync, createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "dist");
const read = (file) => readFile(resolve(root, file), "utf8");
const [guide, detail, design, developer, oldColors] = await Promise.all([
  read("index.html"), read("indicators.html"), read("design.html"), read("developer.html"), read("colors.html")
]);

function includesAll(page, name, fragments) {
  for (const fragment of fragments) {
    if (!page.includes(fragment)) throw new Error(`${name} is missing: ${fragment}`);
  }
}

includesAll(guide, "index.html", [
  "环境评级指南", "id=\"how\"", "id=\"standards\"", "category-mosaic",
  "评级的依据来源是什么？", "ISO 7730:2025", "HJ 633—2026",
  "WHO《社区噪声指南》", "ANSI/IES/ALA RP-11-26",
  "href=\"indicators.html\"",
  ...["thermal", "air", "sound-light", "outdoor"].map((id) => `href="indicators.html#${id}"`)
]);
if (guide.includes("id=\"indicator-entry\"") || guide.includes("guide-entry-card")) {
  throw new Error("The extra interpretation card is still on the guide");
}
if (guide.includes('class="category-arrow"')) {
  throw new Error("A category arrow is still on the guide");
}
if (guide.includes('class="category-number"')) {
  throw new Error("A category number is still on the guide");
}
if (guide.includes('href="#standards">评级依据</a>')) {
  throw new Error("The guide navigation still links to standards");
}
const navigation = (page) => [...page.matchAll(/<div class="nav-links">([\s\S]*?)<\/div>/g)][0]?.[1].replace(/ aria-current="page"/g, "");
const sharedNavigation = '<a href="index.html">评级方法</a><a href="indicators.html">指标解读</a><a href="design.html">设计参考</a><a href="developer.html">开发参考</a>';
for (const [name, page] of [["guide", guide], ["detail", detail], ["design", design], ["developer", developer]]) {
  if (navigation(page) !== sharedNavigation) throw new Error(`${name} does not use shared navigation`);
}
if (guide.includes("id=\"color-principles\"") || guide.includes("identity-grid") || guide.includes("metric-scale")) {
  throw new Error("The guide still contains metric interpretation content");
}
if ((guide.match(/class="material-icon"/g) ?? []).length !== 10) throw new Error("Guide category icons are missing");
if ([...guide.matchAll(/<span class="standard-org">([\s\S]*?)<\/span>/g)].some(([, content]) => !content.includes("<a href="))) {
  throw new Error("A standards body is missing its official website link");
}

includesAll(detail, "indicators.html", [
  "环境指标解读", "id=\"thermal\"", "id=\"air\"", "id=\"sound-light\"", "id=\"outdoor\"",
  "PMV 七点冷热感", "相对湿度三档提示", "CO₂ 三档通风提示", "照度六档活动提示",
  "WHO 紫外线指数五档图示",
  "id=\"uv-index\"", "id=\"pollen\""
]);
if (detail.includes('identity-card') || detail.includes('scale-colors') || detail.includes('class="material-icon"')) throw new Error("Duplicate design resources remain in metric interpretation");
if (detail.includes('class="icon-source"') || detail.includes('id="icon-sources"')) {
  throw new Error("Icon source information still appears in metric interpretation");
}
includesAll(design, "design.html", ["id=\"icon-resources\"", "id=\"color-resources\"", "id=\"rating-copy\"", "design-i18n.js", "SF Symbols", "Apache 2.0"]);
if ((design.match(/class="resource-card"/g) ?? []).length !== 14) throw new Error("Design icon assets are incomplete");
if ((design.match(/class="color-resource"/g) ?? []).length !== 14) throw new Error("Design identity colors are incomplete");
if ((design.match(/class="metric-description"/g) ?? []).length !== 14) throw new Error("Design rating copy is incomplete");
for (const [group, options] of Object.entries({
  pm: ["eea", "hj", "epa"], hcho: ["who", "gbt", "oehha"],
  o3: ["eea", "hj", "epa"], co: ["hj", "epa"],
  so2: ["eea", "hj-hourly", "hj-daily", "epa"], pollen: ["nab", "meteoswiss"]
})) {
  includesAll(detail, `${group} switcher`, [`data-standard-switcher="${group}"`, ...options.flatMap((option) => [
    `aria-controls="${group}-${option}-panel"`, `id="${group}-${option}-panel"`,
    `data-standard-panel="${option}" data-standard-group="${group}"`
  ])]);
}
includesAll(oldColors, "colors.html", ["design.html#color-resources", "favicon.svg"]);
if (oldColors.includes("index.html#color-principles")) throw new Error("Old color redirect points to the guide");

includesAll(developer, "developer.html", ["开发参考", "EnvironmentCopy.xcstrings", "env_text_get_rating", "String(localized:", "context.getString", "getMetric", "developer-content.js"]);
for (const page of [guide, detail, design, developer, oldColors]) {
  for (const match of page.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1];
    if (target.startsWith("#") || target.includes("://")) continue;
    accessSync(resolve(root, target.split(/[?#]/)[0]));
  }
}
const manifest = JSON.parse(await read("site.webmanifest"));
if (manifest.theme_color !== "#0564A0") throw new Error("Wrong Qingping theme color");
for (const icon of manifest.icons ?? []) accessSync(resolve(root, icon.src));

const candidates = [
  process.env.CHROME_BIN, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium"
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
if (typeof address === "string" || address == null) throw new Error("Preview server failed");
const renderTargets = [
  ["index.html", ["看懂你身边的环境", "category-mosaic"]],
  ["indicators.html", ["环境指标解读", "PMV 七点冷热感"]],
  ["design.html", ["设计参考", "图标资源", "评级解读文案"]],
  ["developer.html", ["开发参考", "统一文案源", "EnvironmentCopy.xcstrings"]],
  ["developer.html?lang=zh-Hant", ["<html lang=\"zh-Hant\"", "開發參考", "韌體 / LVGL"]],
  ["developer.html?lang=en", ["<html lang=\"en\"", "Developer Guide", "One source for copy", "design.html?lang=en"]],
  ["developer.html?lang=ja", ["<html lang=\"ja\"", "開発者ガイド", "ファームウェア / LVGL"]],
  ["colors.html", ["设计参考", "id=\"color-resources\""]],
  ["index.html?lang=en#color-principles", ["Design Reference", "id=\"color-resources\""]],
  ["indicators.html?lang=en#icon-sources", ["Design Reference", "id=\"icon-resources\""]],
  ["index.html?lang=en#thermal", ["Environmental Metrics Explained", "id=\"thermal\""]],
  ["indicators.html?lang=zh-Hant", ["<html lang=\"zh-Hant\"", "環境指標解讀", "分檔邊界"]],
  ["indicators.html?lang=en", ["<html lang=\"en\"", "Environmental Metrics Explained", "rating boundaries"]],
  ["indicators.html?lang=ja", ["<html lang=\"ja\"", "環境指標の読み解き", "評価区分"]],
  ["design.html?lang=zh-Hant", ["<html lang=\"zh-Hant\"", "設計參考", "評級解讀文字"]],
  ["design.html?lang=en", ["<html lang=\"en\"", "Design Reference", "Icon assets", "Color resources", "Rating copy", "indicators.html?lang=en"]],
  ["design.html?lang=ja", ["<html lang=\"ja\"", "デザイン資料", "アイコン素材", "カラー資料"]],
  ["index.html?lang=zh-Hant", ["<html lang=\"zh-Hant\"", "環境評級指南"]],
  ["index.html?lang=en", ["<html lang=\"en\"", "Environmental Rating Guide", "Sensors provide readings", "indicators.html?lang=en"]],
  ["index.html?lang=ja", ["<html lang=\"ja\"", "環境評価ガイド"]]
];
try {
  for (const [url, expected] of renderTargets) {
    const output = await new Promise((done) => {
      const child = spawn(chrome, ["--headless=new", "--no-sandbox", "--disable-gpu", "--virtual-time-budget=1000", "--dump-dom", `http://127.0.0.1:${address.port}/${url}`]);
      let stdout = "";
      child.stdout.on("data", (chunk) => { stdout += chunk; });
      child.on("close", (code) => done({ code, stdout }));
    });
    if (output.code !== 0 || expected.some((text) => !output.stdout.includes(text))) {
      throw new Error(`${url} did not render expected content`);
    }
  }
} finally { server.close(); }
if (missing) throw new Error("A page requested a missing local resource");
console.log("All four guide pages passed browser checks");

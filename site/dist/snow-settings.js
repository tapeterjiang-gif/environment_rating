const STORAGE_KEY = "snow.environment-rating-standards.v1";
const DEFAULTS = { pm: "eea", hcho: "who", humidity: "uba" };
const VALID = { pm: ["eea", "hj", "epa"], hcho: ["who", "gbt", "oehha"], humidity: ["uba", "epa"] };
const MESSAGES = {
  "zh-Hans": {
    language: "语言", eyebrow: "SNOW / 环境设置", title: "环境评级标准",
    intro: "选择适合你的评级依据。不同指标可以使用不同标准。",
    pmTitle: "颗粒物", pmDetail: "PM2.5 与 PM10 共用一套标准", pmEea: "欧洲空气质量指数", pmHj: "中国环境空气质量指数", pmEpa: "美国空气质量指数",
    hchoTitle: "甲醛", hchoDetail: "参考浓度与平均时间随标准变化", hchoWho: "国际参考 · 30 分钟", hchoGbt: "中国参考 · 1 小时", hchoOehha: "加州参考 · 1 小时",
    humidityTitle: "相对湿度", humidityDetail: "选择“适宜”范围的参考依据", humidityUba: "德国环境署 · 40–60%RH", humidityEpa: "美国环保署 · 30–50%RH",
    fixed: "固定依据", sensationFixed: "冷热感 · ASHRAE 55", noiseFixed: "噪声 · WHO", lightFixed: "照度 · RP-11",
    note: "演示设置仅保存在浏览器；切换标准时需同步调整平均时间。", guide: "查看评级依据 ↗", reset: "恢复默认", save: "保存设置",
    unsaved: "有未保存的更改", saved: "已保存到此浏览器", saveFailed: "无法在此浏览器保存", restored: "已恢复默认，点击保存生效"
  },
  "zh-Hant": {
    language: "語言", eyebrow: "SNOW / 環境設定", title: "環境評級標準",
    intro: "選擇適合你的評級依據。不同指標可以使用不同標準。",
    pmTitle: "懸浮微粒", pmDetail: "PM2.5 與 PM10 共用一套標準", pmEea: "歐洲空氣品質指數", pmHj: "中國環境空氣品質指數", pmEpa: "美國空氣品質指數",
    hchoTitle: "甲醛", hchoDetail: "參考濃度與平均時間隨標準變化", hchoWho: "國際參考 · 30 分鐘", hchoGbt: "中國參考 · 1 小時", hchoOehha: "加州參考 · 1 小時",
    humidityTitle: "相對濕度", humidityDetail: "選擇「適宜」範圍的參考依據", humidityUba: "德國環境署 · 40–60%RH", humidityEpa: "美國環保署 · 30–50%RH",
    fixed: "固定依據", sensationFixed: "冷熱感 · ASHRAE 55", noiseFixed: "噪聲 · WHO", lightFixed: "照度 · RP-11",
    note: "示範設定僅儲存在瀏覽器；切換標準時需同步調整平均時間。", guide: "查看評級依據 ↗", reset: "恢復預設", save: "儲存設定",
    unsaved: "有未儲存的變更", saved: "已儲存至此瀏覽器", saveFailed: "無法在此瀏覽器儲存", restored: "已恢復預設，按儲存設定生效"
  },
  en: {
    language: "Language", eyebrow: "SNOW / ENVIRONMENT", title: "Rating standards",
    intro: "Choose the references used for each environmental reading.",
    pmTitle: "Particulate matter", pmDetail: "One standard for PM2.5 and PM10", pmEea: "European Air Quality Index", pmHj: "China Air Quality Index", pmEpa: "US Air Quality Index",
    hchoTitle: "Formaldehyde", hchoDetail: "Reference limit and averaging time vary", hchoWho: "Global · 30 min avg.", hchoGbt: "China · 1 h avg.", hchoOehha: "California · 1 h avg.",
    humidityTitle: "Relative humidity", humidityDetail: "Choose the suitable range", humidityUba: "German agency · 40–60%RH", humidityEpa: "US EPA · 30–50%RH",
    fixed: "Fixed references", sensationFixed: "Sensation · ASHRAE 55", noiseFixed: "Noise · WHO", lightFixed: "Light · RP-11",
    note: "Demo settings stay in this browser. Match averaging periods to each standard.", guide: "See rating guide ↗", reset: "Reset defaults", save: "Save settings",
    unsaved: "Unsaved changes", saved: "Saved in this browser", saveFailed: "This browser cannot save settings", restored: "Defaults restored; save to apply"
  },
  ja: {
    language: "言語", eyebrow: "SNOW / 環境設定", title: "環境評価基準",
    intro: "各指標の評価に使用する基準を選択します。",
    pmTitle: "粒子状物質", pmDetail: "PM2.5とPM10に同じ基準を適用", pmEea: "欧州大気質指数", pmHj: "中国大気質指数", pmEpa: "米国大気質指数",
    hchoTitle: "ホルムアルデヒド", hchoDetail: "基準値と平均時間が変わります", hchoWho: "国際参照 · 30分平均", hchoGbt: "中国参照 · 1時間平均", hchoOehha: "加州参照 · 1時間平均",
    humidityTitle: "相対湿度", humidityDetail: "適正範囲の根拠を選択", humidityUba: "ドイツ環境庁 · 40–60%RH", humidityEpa: "米国EPA · 30–50%RH",
    fixed: "固定基準", sensationFixed: "温冷感 · ASHRAE 55", noiseFixed: "騒音 · WHO", lightFixed: "照度 · RP-11",
    note: "デモ設定はこのブラウザーに保存されます。基準に合わせて平均時間も変更してください。", guide: "評価基準を見る ↗", reset: "初期値に戻す", save: "設定を保存",
    unsaved: "未保存の変更があります", saved: "このブラウザーに保存しました", saveFailed: "このブラウザーには保存できません", restored: "初期値に戻しました。保存すると反映されます"
  }
};

const form = document.getElementById("rating-form");
const languageSelect = document.getElementById("language");
const status = document.getElementById("save-status");
const storage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); return true; } catch { return false; } }
};
const queryLanguage = new URLSearchParams(location.search).get("lang");
let language = Object.hasOwn(MESSAGES, queryLanguage) ? queryLanguage : (storage.get("snow.settings.language") || "zh-Hans");
if (!Object.hasOwn(MESSAGES, language)) language = "zh-Hans";

function translate() {
  document.documentElement.lang = language === "zh-Hans" ? "zh-CN" : language;
  document.title = `Snow · ${MESSAGES[language].title}`;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = MESSAGES[language][node.dataset.i18n];
  });
  languageSelect.setAttribute("aria-label", MESSAGES[language].language);
  languageSelect.value = language;
  document.querySelector(".fixed-references").setAttribute("aria-label", MESSAGES[language].fixed);
  document.querySelector(".footer-copy a").href = `index.html?lang=${encodeURIComponent(language)}`;
  if (status.dataset.message) status.textContent = MESSAGES[language][status.dataset.message];
}

function setStatus(message) {
  status.dataset.message = message;
  status.textContent = MESSAGES[language][message];
}

function applyValues(values) {
  for (const [name, allowed] of Object.entries(VALID)) {
    const value = allowed.includes(values?.[name]) ? values[name] : DEFAULTS[name];
    form.elements[name].value = value;
  }
}

function currentValues() {
  return Object.fromEntries(Object.keys(VALID).map((name) => [name, form.elements[name].value]));
}

try { applyValues(JSON.parse(storage.get(STORAGE_KEY))); }
catch { applyValues(DEFAULTS); }
translate();

languageSelect.addEventListener("change", () => {
  language = languageSelect.value;
  storage.set("snow.settings.language", language);
  const url = new URL(location.href);
  url.searchParams.set("lang", language);
  history.replaceState(null, "", url);
  translate();
});
form.addEventListener("change", (event) => {
  if (event.target.matches('input[type="radio"]')) setStatus("unsaved");
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  setStatus(storage.set(STORAGE_KEY, JSON.stringify(currentValues())) ? "saved" : "saveFailed");
});
document.getElementById("reset").addEventListener("click", () => {
  applyValues(DEFAULTS);
  setStatus("restored");
});

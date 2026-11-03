const STORAGE_KEY = "snow.environment-rating-standards.v1";
const DEFAULTS = { pm: "eea", hcho: "who", humidity: "uba" };
const VALID = { pm: ["eea", "hj", "epa"], hcho: ["who", "gbt", "oehha"], humidity: ["uba", "epa"] };
const MESSAGES = {
  "zh-Hans": {
    language: "语言", eyebrow: "SNOW / 环境设置", title: "环境评级标准", thermalGroup: "热舒适度", airGroup: "空气质量", soundGroup: "声光环境",
    intro: "选择适合你的评级依据。不同指标可以使用不同标准。",
    pmTitle: "颗粒物", pmDetail: "PM2.5 与 PM10 共用一套标准", pmEea: "欧洲空气质量指数", pmHj: "中国环境空气质量指数", pmEpa: "美国空气质量指数",
    hchoTitle: "甲醛", hchoDetail: "参考浓度与平均时间随标准变化", hchoWho: "国际参考 · 30 分钟", hchoGbt: "中国参考 · 1 小时", hchoOehha: "加州参考 · 1 小时",
    humidityTitle: "相对湿度", humidityDetail: "选择“适宜”范围的参考依据", humidityUba: "德国环境署 · 40–60%RH", humidityEpa: "美国环保署 · 30–50%RH",
    co2Detail: "室内通风提示", thermalTitle: "冷热感", thermalDetail: "PMV / 七点热感觉", noiseTitle: "噪声", noiseDetail: "住宅与睡眠场景", lightTitle: "照度", lightDetail: "住宅活动参考",
    note: "演示设置仅保存在浏览器；切换标准时需同步调整平均时间。", guide: "查看评级依据 ↗", reset: "恢复默认", save: "保存设置",
    unsaved: "有未保存的更改", saved: "已保存到此浏览器", saveFailed: "无法在此浏览器保存", restored: "已恢复默认，点击保存生效"
  },
  "zh-Hant": {
    language: "語言", eyebrow: "SNOW / 環境設定", title: "環境評級標準", thermalGroup: "熱舒適度", airGroup: "空氣質量", soundGroup: "聲光環境",
    intro: "選擇適合你的評級依據。不同指標可以使用不同標準。",
    pmTitle: "懸浮微粒", pmDetail: "PM2.5 與 PM10 共用一套標準", pmEea: "歐洲空氣品質指數", pmHj: "中國環境空氣品質指數", pmEpa: "美國空氣品質指數",
    hchoTitle: "甲醛", hchoDetail: "參考濃度與平均時間隨標準變化", hchoWho: "國際參考 · 30 分鐘", hchoGbt: "中國參考 · 1 小時", hchoOehha: "加州參考 · 1 小時",
    humidityTitle: "相對濕度", humidityDetail: "選擇「適宜」範圍的參考依據", humidityUba: "德國環境署 · 40–60%RH", humidityEpa: "美國環保署 · 30–50%RH",
    co2Detail: "室內通風提示", thermalTitle: "冷熱感", thermalDetail: "PMV / 七點熱感覺", noiseTitle: "噪聲", noiseDetail: "住宅與睡眠場景", lightTitle: "照度", lightDetail: "住宅活動參考",
    note: "示範設定僅儲存在瀏覽器；切換標準時需同步調整平均時間。", guide: "查看評級依據 ↗", reset: "恢復預設", save: "儲存設定",
    unsaved: "有未儲存的變更", saved: "已儲存至此瀏覽器", saveFailed: "無法在此瀏覽器儲存", restored: "已恢復預設，按儲存設定生效"
  },
  en: {
    language: "Language", eyebrow: "SNOW / ENVIRONMENT", title: "Rating standards", thermalGroup: "Thermal comfort", airGroup: "Air quality", soundGroup: "Sound & light",
    intro: "Choose the references used for each environmental reading.",
    pmTitle: "Particulate matter", pmDetail: "One standard for PM2.5 and PM10", pmEea: "European Air Quality Index", pmHj: "China Air Quality Index", pmEpa: "US Air Quality Index",
    hchoTitle: "Formaldehyde", hchoDetail: "Reference limit and averaging time vary", hchoWho: "Global · 30 min avg.", hchoGbt: "China · 1 h avg.", hchoOehha: "California · 1 h avg.",
    humidityTitle: "Relative humidity", humidityDetail: "Choose the suitable range", humidityUba: "German agency · 40–60%RH", humidityEpa: "US EPA · 30–50%RH",
    co2Detail: "Indoor ventilation", thermalTitle: "Thermal sensation", thermalDetail: "PMV / seven-point scale", noiseTitle: "Noise", noiseDetail: "Home and sleep", lightTitle: "Illuminance", lightDetail: "Residential activities",
    note: "Demo settings stay in this browser. Match averaging periods to each standard.", guide: "See rating guide ↗", reset: "Reset defaults", save: "Save settings",
    unsaved: "Unsaved changes", saved: "Saved in this browser", saveFailed: "This browser cannot save settings", restored: "Defaults restored; save to apply"
  },
  ja: {
    language: "言語", eyebrow: "SNOW / 環境設定", title: "環境評価基準", thermalGroup: "温熱快適性", airGroup: "空気質", soundGroup: "音・光環境",
    intro: "各指標の評価に使用する基準を選択します。",
    pmTitle: "粒子状物質", pmDetail: "PM2.5とPM10に同じ基準を適用", pmEea: "欧州大気質指数", pmHj: "中国大気質指数", pmEpa: "米国大気質指数",
    hchoTitle: "ホルムアルデヒド", hchoDetail: "基準値と平均時間が変わります", hchoWho: "国際参照 · 30分平均", hchoGbt: "中国参照 · 1時間平均", hchoOehha: "加州参照 · 1時間平均",
    humidityTitle: "相対湿度", humidityDetail: "適正範囲の根拠を選択", humidityUba: "ドイツ環境庁 · 40–60%RH", humidityEpa: "米国EPA · 30–50%RH",
    co2Detail: "室内換気の目安", thermalTitle: "温冷感", thermalDetail: "PMV / 7段階尺度", noiseTitle: "騒音", noiseDetail: "住宅と睡眠", lightTitle: "照度", lightDetail: "住宅活動の目安",
    note: "デモ設定はこのブラウザーに保存されます。基準に合わせて平均時間も変更してください。", guide: "評価基準を見る ↗", reset: "初期値に戻す", save: "設定を保存",
    unsaved: "未保存の変更があります", saved: "このブラウザーに保存しました", saveFailed: "このブラウザーには保存できません", restored: "初期値に戻しました。保存すると反映されます"
  }
};

const STANDARD_LABELS = {
  "zh-Hans": {
    "humidity-uba": ["住宅通风与湿度指南", "德国联邦环境署"],
    "humidity-epa": ["家庭霉菌与湿度简明指南", "美国环境保护署"],
    thermal: ["ISO 7730:2025 / ASHRAE 55", "国际标准化组织 / 美国采暖、制冷与空调工程师学会"],
    "pm-eea": ["欧洲空气质量指数", "欧洲环境署"],
    "pm-hj": ["HJ 633—2026 环境空气质量指数", "中国生态环境部"],
    "pm-epa": ["美国空气质量指数（AQI）", "美国环境保护署"],
    co2: ["室内空气中二氧化碳的健康评价", "德国联邦环境署"],
    "hcho-who": ["WHO 室内空气质量指南：特定污染物", "世界卫生组织"],
    "hcho-gbt": ["GB/T 18883—2022 室内空气质量标准", "国家市场监督管理总局、国家标准化管理委员会"],
    "hcho-oehha": ["甲醛急性参考暴露水平", "加州环境健康危害评估办公室"],
    noise: ["社区噪声指南", "世界卫生组织"],
    light: ["RP-11-26 住宅环境照明推荐实践", "美国照明工程学会、美国照明协会"]
  },
  "zh-Hant": {
    "humidity-uba": ["住宅通風與濕度指南", "德國聯邦環境署"],
    "humidity-epa": ["家庭黴菌與濕度簡明指南", "美國環境保護署"],
    thermal: ["ISO 7730:2025 / ASHRAE 55", "國際標準化組織 / 美國採暖、製冷與空調工程師學會"],
    "pm-eea": ["歐洲空氣品質指數", "歐洲環境署"],
    "pm-hj": ["HJ 633—2026 環境空氣品質指數", "中國生態環境部"],
    "pm-epa": ["美國空氣品質指數（AQI）", "美國環境保護署"],
    co2: ["室內空氣中二氧化碳的健康評價", "德國聯邦環境署"],
    "hcho-who": ["WHO 室內空氣品質指南：特定污染物", "世界衛生組織"],
    "hcho-gbt": ["GB/T 18883—2022 室內空氣品質標準", "國家市場監督管理總局、國家標準化管理委員會"],
    "hcho-oehha": ["甲醛急性參考暴露水平", "加州環境健康危害評估辦公室"],
    noise: ["社區噪聲指南", "世界衛生組織"],
    light: ["RP-11-26 住宅環境照明推薦實踐", "美國照明工程學會、美國照明協會"]
  },
  en: {
    "humidity-uba": ["Residential ventilation and humidity guidance", "German Environment Agency (UBA)"],
    "humidity-epa": ["A Brief Guide to Mold, Moisture and Your Home", "U.S. Environmental Protection Agency"],
    thermal: ["ISO 7730:2025 / ASHRAE Standard 55", "ISO / ASHRAE"],
    "pm-eea": ["European Air Quality Index", "European Environment Agency"],
    "pm-hj": ["HJ 633—2026 Ambient Air Quality Index", "Ministry of Ecology and Environment of China"],
    "pm-epa": ["Air Quality Index (AQI)", "U.S. Environmental Protection Agency"],
    co2: ["Health Evaluation of Carbon Dioxide in Indoor Air", "German Environment Agency (UBA)"],
    "hcho-who": ["WHO Guidelines for Indoor Air Quality: Selected Pollutants", "World Health Organization"],
    "hcho-gbt": ["GB/T 18883—2022 Standards for Indoor Air Quality", "State Administration for Market Regulation / SAC"],
    "hcho-oehha": ["Formaldehyde Acute Reference Exposure Level", "California OEHHA"],
    noise: ["Guidelines for Community Noise", "World Health Organization"],
    light: ["RP-11-26 Recommended Practice for Residential Lighting", "Illuminating Engineering Society / ALA"]
  },
  ja: {
    "humidity-uba": ["住宅の換気と湿度に関する指針", "ドイツ連邦環境庁"],
    "humidity-epa": ["家庭のカビと湿気に関する簡易ガイド", "米国環境保護庁"],
    thermal: ["ISO 7730:2025 / ASHRAE 55", "国際標準化機構 / 米国暖房冷凍空調学会"],
    "pm-eea": ["欧州大気質指数", "欧州環境機関"],
    "pm-hj": ["HJ 633—2026 大気質指数", "中国生態環境部"],
    "pm-epa": ["米国大気質指数（AQI）", "米国環境保護庁"],
    co2: ["室内空気中の二酸化炭素の健康評価", "ドイツ連邦環境庁"],
    "hcho-who": ["WHO 室内空気質ガイドライン：特定汚染物質", "世界保健機関"],
    "hcho-gbt": ["GB/T 18883—2022 室内空気質基準", "中国国家市場監督管理総局 / 国家標準化管理委員会"],
    "hcho-oehha": ["ホルムアルデヒド急性参照曝露レベル", "カリフォルニア州 OEHHA"],
    noise: ["コミュニティ騒音ガイドライン", "世界保健機関"],
    light: ["RP-11-26 住宅環境照明推奨指針", "米国照明学会 / 米国照明協会"]
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
  document.querySelectorAll("[data-standard]").forEach((node) => {
    const [name, organization] = STANDARD_LABELS[language][node.dataset.standard];
    node.querySelector("strong").textContent = name;
    node.querySelector("small").textContent = organization;
  });
  languageSelect.setAttribute("aria-label", MESSAGES[language].language);
  languageSelect.value = language;
  document.querySelector(".settings-scroll").setAttribute("aria-label", MESSAGES[language].title);
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

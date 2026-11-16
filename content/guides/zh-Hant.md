# 跨平台環境指標文字

`content/` 是指標說明與評級解讀的統一維護來源。四種語言使用相同的指標 ID 與評級 ID：`zh-Hans`、`zh-Hant`、`en`、`ja`。使用 UTF-8 純文字，不寫 HTML、顏色值或用於排版的換行。

- 四個語言 JSON：維護名稱、說明、解讀、分檔標籤、簡短建議與完整建議。
- `manifest.json`：指標分類、適用評級及對應的 C 列舉符號與數值。
- `generated/`：自動產生的 iOS、Android、Web 與字庫資源。
- 根目錄 `environment_text.h/.c`：韌體文字查詢介面。

資料結構為 `metrics.co2.name / description / advice / ratings.moderate.label / summary / detail`。`description` 稱為「說明」，顯示於指標名稱下方；`advice` 稱為「解讀」，顯示於「分檔提示」內的總述卡片；各檔位的 `summary` / `detail` 稱為「建議」，分別提供簡短與完整版本。小螢幕優先使用獨立編寫的簡短建議。不要在執行時截斷長段落來製作短文字。

溫度與 PMV 使用不同 ID：`temperature` 只有讀數說明，`pmv` 才有七點冷熱感評級。`tvoc` 沒有評級。花粉的 `unknown` 表示無法評級，`absent` 表示測得零值。所有已評級指標都有未知文字。

## 更新與產生

在專案根目錄執行，只需 Node.js 18 或以上，不需要額外相依套件：

```sh
node scripts/generate-copy.mjs
node scripts/generate-copy.mjs --check
node --test tests/test_environment_copy.mjs
node scripts/package-copy.mjs
node scripts/package-copy.mjs --check
node scripts/generate-developer-page.mjs
node scripts/generate-developer-page.mjs --check
```

編輯四個語言來源檔案後重新產生資源。增加指標或評級時，也要更新 `manifest.json`。產生器會檢查語言鍵集合、必要欄位與純文字限制；產生的 C 程式碼會在編譯時核對列舉值。

設計參考頁與 `site/dist/rating-copy.js` 也由同一來源產生。導覽、按鈕等介面文字由網頁本地化檔案維護。`--check` 只檢查資源是否過期，不寫入檔案。

## 通用鍵與評級對應

各平台使用相同的鍵：

```text
env_co2_name
env_co2_description
env_co2_advice
env_co2_rating_moderate_label
env_co2_rating_moderate_summary
env_co2_rating_moderate_detail
```

依演算法結果查找文字，並非使用 Matter `LevelValue`。例如 CO₂ 的 `AIR_MODERATE`（3）對應 `moderate`；`AIR_FAIR`（2）不適用於 CO₂，會回退為 `unknown`。PM、甲醛、O₃、CO、SO₂ 使用六檔 AirQuality 對應，其餘指標使用各自列舉。完整對應見 `manifest.json`，不要解析翻譯標籤或在文字程式碼中重新分檔。

提供的 Web 與 C 查詢介面會在語言不支援時使用英文，接受 `zh-CN`、`zh_CN`、`zh-TW`、`zh-HK`、`en-US`、`ja-JP` 等別名。找不到文字鍵時傳回空結果，不以正常評級作為預設結果。

## 評級標準說明

四個語言來源檔案的 `standards` 節點提供16套標準的 `name`（名稱）、`description`（簡介）、`organization`（發布組織）。固定ID、出處與組織官網連結見 `manifest.json` 的 `standards`。

文字鍵包括 `env_standard_who_uv_index_name`、`env_standard_who_uv_index_description`、`env_standard_who_uv_index_organization`。多組織標準另產生 `organization_1`、`organization_2`，方便分別連結官網。Web 可用 `getStandard('zh-Hant', 'who_uv_index')` 取得文字；韌體可用 `env_text_get()` 查詢相同鍵。

## iOS

將 `content/generated/ios/EnvironmentCopy.xcstrings` 加入 App target，字串目錄名稱為 `EnvironmentCopy`：

```swift
let label = String(localized: "env_co2_rating_moderate_label",
                   table: "EnvironmentCopy")
let detail = String(localized: "env_co2_rating_moderate_detail",
                    table: "EnvironmentCopy")
```

App 語言由系統本地化處理，專案需啟用對應語言。若放入 Swift Package，請宣告為 package resource，查詢時傳入對應 bundle。產生資源不會自動修改既有 Swift 演算法套件。

## Android

將 `content/generated/android/res/` 下的四個語言目錄合併至 App 的 `src/main/res/`，也可以在 Gradle 中將此目錄加入資源路徑：

```kotlin
val label = context.getString(R.string.env_co2_rating_moderate_label)
val detail = context.getString(R.string.env_co2_rating_moderate_detail)
```

`values/` 是英文預設，其他目錄為 `values-b+zh+Hans`、`values-b+zh+Hant`、`values-ja`。字串不使用格式預留位置，XML 引號與特殊字元已完成跳脫。

## 青萍 Web

可依語言載入 `content/generated/web/` 的 JSON，或直接匯入產生的模組，不需要建置相依套件：

```js
import { getMetric, getRating, getText } from './environment-copy.mjs';

const metric = getMetric('zh-Hant', 'co2');
const copy = getRating('zh-Hant', 'co2', 3); // 或 'moderate'
// metric.description / metric.advice
// copy.label / copy.summary / copy.detail
const name = getText('zh-Hant', 'env_co2_name');
```

模組包含 `.d.ts` 宣告，傳回唯讀資料。無效指標或鍵傳回 `null`，無效評級回退為該指標的未知文字。匯入模組會包含四種語言；需要依語言載入時，使用獨立 JSON 與 `manifest.json`。

## 韌體 / LVGL

將根目錄 `environment_text.c` 加入工程。它使用評級標頭進行列舉編譯檢查，不依賴 LVGL，也不配置堆積記憶體。CMake 可連結 `environment_text`；ESP-IDF 應將此 `.c` 加入元件的 `SRCS`。

```c
#include "air_quality_rating.h"
#include "environment_text.h"

/* rating 由所選標準的演算法取得。 */
air_quality_t rating = AIR_MODERATE;
const char *text = env_text_get_rating("zh-Hant", "co2", rating, "summary");
if (text != NULL) {
    lv_label_set_text(label, text);
}
```

簡介可用 `env_text_get("zh-Hant", "env_co2_description")` 查詢。傳回的 UTF-8 字串具有靜態生命週期，不需要在執行時解析 JSON。LVGL 端設定字型、換行與標籤寬度；請勿修改傳回字串。

`content/generated/fonts/` 提供各語言及全部語言合併的去重字元集。製作字庫時，應合併測量數值、單位、日期與其他介面需要的字元。這些文字檔是字元清單，並非字型檔。

## 發布核對

更新時一併交付四個來源檔案、對應與產生資源。原生資源已產生並通過結構檢查，開發者仍需將它們加入 App target，並在實際裝置確認排版與字型顯示。

## 外部指數文案

外部 AQI/PSI/EEA 分別使用 `aqi_hj`、`aqi_epa`、`eea_index`、`psi`，須配合相同體系。以 `outdoor_index_rate()` 返回的原生檔序號查詢，PSI 只有五檔。Web 的 `grade-3` 對應文案 ID `grade_3`。EEA 的 1–6 是等級編碼，不是數值 AQI。指數來自外部，不依現場濃度重算，也不映射 Matter。請保留來源、地點、更新時間及目前、日報或預報的資料類型。

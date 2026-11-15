# 環境指標テキストの共通リソース

`content/` が指標の概要と評価説明文の共通ソースです。`zh-Hans`、`zh-Hant`、`en`、`ja` の4言語で、同じ指標IDと評価IDを使います。UTF-8のプレーンテキストとし、HTML、色の値、レイアウト用の改行は入れません。

- 各言語のJSON：名称、概要、一般的な助言、評価ラベル、短い案内と詳しい説明を編集します。
- `manifest.json`：分類、利用できる評価、対応するCの列挙定数と数値を定義します。
- `generated/`：iOS、Android、Web、フォント用文字一覧の生成結果です。
- ルートの `environment_text.h/.c`：ファームウェア用の生成されたテキスト取得関数です。

構造は `metrics.co2.name / description / advice / ratings.moderate.label / summary / detail` です。`summary` は小さい画面向けに独立して編集し、詳細画面では概要、助言と `detail` を使います。長文を実行時に切り詰めて短文にしないでください。

温度とPMVは別のIDです。`temperature` は測定値の説明のみ、`pmv` は7段階の温冷感を持ちます。`tvoc` には評価区分がありません。花粉の `unknown` は評価不能、`absent` はゼロを測定した状態です。評価するすべての指標に不明の文言があります。

## 更新と生成

Node.js 18以上で、リポジトリのルートから実行します。追加の依存パッケージは不要です。

```sh
node scripts/generate-copy.mjs
node scripts/generate-copy.mjs --check
node --test tests/test_environment_copy.mjs
node scripts/package-copy.mjs
node scripts/package-copy.mjs --check
node scripts/generate-developer-page.mjs
node scripts/generate-developer-page.mjs --check
```

4言語のソースを編集してから再生成します。指標や評価の追加時には `manifest.json` も更新してください。生成処理は言語間のキー、必須項目、プレーンテキストを確認し、生成されたCコードはコンパイル時に列挙値を確認します。

デザイン資料ページと `site/dist/rating-copy.js` も同じソースから生成します。ナビゲーションやボタンの翻訳はWeb側で管理します。`--check` は古い生成結果を検出し、ファイルは書き換えません。

## 共通キーと評価の対応

すべてのプラットフォームで同じキーを使います。

```text
env_co2_name
env_co2_description
env_co2_advice
env_co2_rating_moderate_label
env_co2_rating_moderate_summary
env_co2_rating_moderate_detail
```

アルゴリズムの結果で文言を取得します。Matter `LevelValue` は使いません。例えばCO₂の `AIR_MODERATE`（3）は `moderate` に対応し、CO₂にない `AIR_FAIR`（2）は `unknown` になります。PM、HCHO、O₃、CO、SO₂には6段階のAirQualityを使い、他の指標にはそれぞれの列挙型を使います。詳細は `manifest.json` を参照し、翻訳済みラベルの解析やテキスト側での閾値判定は行わないでください。

付属のWebとCの取得関数は未対応の言語を英語にフォールバックします。`zh-CN`、`zh_CN`、`zh-TW`、`zh-HK`、`en-US`、`ja-JP` などに対応します。存在しないキーは空の結果を返し、正常な評価を代わりに使いません。

## 評価基準の説明文

各言語カタログの `standards` には16の基準の `name`（名称）、`description`（概要）、`organization`（発行機関）があります。固定ID、出典URL、機関の公式サイトは `manifest.json` の `standards` を参照してください。

キーの例は `env_standard_who_uv_index_name`、`env_standard_who_uv_index_description`、`env_standard_who_uv_index_organization` です。複数機関の場合は `organization_1`、`organization_2` も生成し、個別リンクに使えます。Webは `getStandard('ja', 'who_uv_index')`、ファームウェアは同じキーを `env_text_get()` で取得できます。

## iOS

`content/generated/ios/EnvironmentCopy.xcstrings` をApp targetに追加します。カタログのテーブル名は `EnvironmentCopy` です。

```swift
let label = String(localized: "env_co2_rating_moderate_label",
                   table: "EnvironmentCopy")
let detail = String(localized: "env_co2_rating_moderate_detail",
                    table: "EnvironmentCopy")
```

Appの言語はシステムのローカライズに従います。プロジェクトで対応言語を有効にしてください。Swift Packageに入れる場合はpackage resourceとして宣言し、対応するbundleを指定します。生成処理は既存のSwiftアルゴリズムパッケージを自動変更しません。

## Android

`content/generated/android/res/` の4言語ディレクトリをAppの `src/main/res/` に統合するか、Gradleのリソースパスに追加します。

```kotlin
val label = context.getString(R.string.env_co2_rating_moderate_label)
val detail = context.getString(R.string.env_co2_rating_moderate_detail)
```

`values/` は既定の英語で、他に `values-b+zh+Hans`、`values-b+zh+Hant`、`values-ja` があります。書式プレースホルダーは使わず、XMLの引用符と特殊文字はエスケープ済みです。

## Qingping Web

`content/generated/web/` の言語別JSONを読み込むか、生成モジュールを直接インポートできます。ビルド用の追加依存はありません。

```js
import { getMetric, getRating, getText } from './environment-copy.mjs';

const metric = getMetric('ja', 'co2');
const copy = getRating('ja', 'co2', 3); // または 'moderate'
// metric.description / metric.advice
// copy.label / copy.summary / copy.detail
const name = getText('ja', 'env_co2_name');
```

`.d.ts` 宣言を含み、読み取り専用データを返します。無効な指標やキーは `null`、無効な評価はその指標の不明の文言になります。モジュールには4言語すべてが含まれます。言語ごとに読み込む場合は個別JSONと `manifest.json` を使います。

## ファームウェア / LVGL

ルートの `environment_text.c` をプロジェクトに追加します。評価ヘッダーで列挙値をコンパイル時に確認し、LVGL依存やヒープ確保はありません。CMakeでは `environment_text` をリンクでき、ESP-IDFではコンポーネントの `SRCS` にこの `.c` を追加します。

```c
#include "air_quality_rating.h"
#include "environment_text.h"

/* 選択した基準のアルゴリズムから評価を取得します。 */
air_quality_t rating = AIR_MODERATE;
const char *text = env_text_get_rating("ja", "co2", rating, "summary");
if (text != NULL) {
    lv_label_set_text(label, text);
}
```

概要は `env_text_get("ja", "env_co2_description")` で取得できます。戻り値はプログラム全体で有効な静的UTF-8文字列であり、実行時のJSON解析は不要です。LVGLでフォント、折り返し、ラベル幅を設定し、戻り値を書き換えないでください。

`content/generated/fonts/` には言語別と全言語の重複を除いた文字一覧があります。測定値、単位、日付、その他UIに必要な文字は、フォント作成時に追加してください。これは文字一覧であり、フォントファイルではありません。

## リリース前の確認

4言語のソース、対応表、生成結果を一緒に配布します。ネイティブリソースは生成と構造確認を済ませていますが、開発者がApp targetに追加し、実機でレイアウトと文字表示を確認する必要があります。

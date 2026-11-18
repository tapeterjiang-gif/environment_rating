# Cross-platform environmental copy

The `content/` directory is the single source for metric descriptions and rating explanations. The four languages share the same metric and rating IDs: `zh-Hans`, `zh-Hant`, `en`, and `ja`. Use UTF-8 plain text without HTML, color values, or line breaks added for layout.

- The four locale JSON files contain editable names, descriptions, interpretations, rating labels, short advice, and full advice.
- `manifest.json` defines categories, available ratings, and their C enum symbols and numeric values.
- `generated/` contains generated iOS, Android, Web, and font character resources.
- `c/environment_text.h/.c` provides generated firmware lookup functions.

Fields follow `metrics.co2.name / description / advice / ratings.moderate.label / summary / detail`. Call `description` “Description” below the metric name, `advice` “Interpretation” in the general card inside the rating section, and rating `summary` / `detail` “Advice”. The latter provide short and full versions respectively; write the short version independently for small screens. Do not truncate a long paragraph to create a short message at runtime.

Temperature and PMV have separate IDs: `temperature` provides reading information; `pmv` has the seven thermal sensation ratings. `tvoc` has no ratings. For pollen, `unknown` means it cannot be rated, while `absent` means a zero count was measured. Every rated metric includes Unknown copy.

## Updating and generating

Run from the repository root with Node.js 18 or later. No additional dependencies are required:

```sh
node scripts/generate-copy.mjs
node scripts/generate-copy.mjs --check
node --test tests/test_environment_copy.mjs
node scripts/package-copy.mjs
node scripts/package-copy.mjs --check
node scripts/generate-developer-page.mjs
node scripts/generate-developer-page.mjs --check
```

Edit the four source catalogs and regenerate. Additions to metrics or ratings also require updating `manifest.json`. The generator checks matching locale keys, required fields, and plain text. Generated C code checks enum values at compile time.

The Design Reference page and `site/dist/rating-copy.js` are generated from the same source. Page navigation and UI labels retain their own translations. `--check` detects stale generated files without writing them.

## Shared keys and rating mapping

All platforms use the same keys:

```text
env_co2_name
env_co2_description
env_co2_advice
env_co2_rating_moderate_label
env_co2_rating_moderate_summary
env_co2_rating_moderate_detail
```

Look up copy using an algorithm result, not Matter `LevelValue`. For example, CO₂ `AIR_MODERATE` (3) maps to `moderate`. `AIR_FAIR` (2) does not apply to CO₂ and resolves to `unknown`. PM, HCHO, O₃, CO, and SO₂ use the six AirQuality grades; other metrics use their own enums. Consult `manifest.json` instead of parsing translated labels or implementing thresholds in copy code.

The supplied Web and C helpers fall back to English for unsupported languages. They accept common aliases such as `zh-CN`, `zh_CN`, `zh-TW`, `zh-HK`, `en-US`, and `ja-JP`. Missing text keys return an empty result; a normal rating is never the fallback.

## Rating reference copy

The `standards` node in each locale catalog provides `name`, `description`, and `organization` for 16 references. Stable IDs, source URLs, and organization websites are listed under `standards` in `manifest.json`.

Keys include `env_standard_who_uv_index_name`, `env_standard_who_uv_index_description`, and `env_standard_who_uv_index_organization`. Numbered `organization_1` and `organization_2` keys support separate links for references with multiple organizations. Web can use `getStandard('en', 'who_uv_index')`; firmware can use `env_text_get()` with the same keys.

## iOS

Add `content/generated/ios/EnvironmentCopy.xcstrings` to the App target. The string catalog table name is `EnvironmentCopy`:

```swift
let label = String(localized: "env_co2_rating_moderate_label",
                   table: "EnvironmentCopy")
let detail = String(localized: "env_co2_rating_moderate_detail",
                    table: "EnvironmentCopy")
```

System localization chooses the App language; enable the supported languages in the project. If you put the catalog in a Swift Package, declare it as a package resource and query the appropriate bundle. Resource generation does not change the existing Swift algorithm package automatically.

## Android

Merge the four directories in `content/generated/android/res/` into the App's `src/main/res/`, or add the generated directory to Gradle's resource paths:

```kotlin
val label = context.getString(R.string.env_co2_rating_moderate_label)
val detail = context.getString(R.string.env_co2_rating_moderate_detail)
```

`values/` is the English default. The other directories are `values-b+zh+Hans`, `values-b+zh+Hant`, and `values-ja`. Strings use no formatting placeholders; XML quotes and special characters are already escaped.

## Qingping Web

Load individual language JSON files from `content/generated/web/`, or import the generated helper module without a build dependency:

```js
import { getMetric, getRating, getText } from './environment-copy.mjs';

const metric = getMetric('en', 'co2');
const copy = getRating('en', 'co2', 3); // or 'moderate'
// metric.description / metric.advice
// copy.label / copy.summary / copy.detail
const name = getText('en', 'env_co2_name');
```

The module includes `.d.ts` declarations and returns read-only data. Invalid metrics or keys return `null`; an invalid rating resolves to that metric's Unknown copy. Importing the module includes all four languages. For language-on-demand loading, use individual JSON files and `manifest.json`.

## Firmware / LVGL

Compile `c/environment_text.c` into your project and add `c/` to the header search path. It uses the rating headers to check enum compatibility, has no LVGL dependency, and allocates no heap memory. CMake projects can link `environment_text`; ESP-IDF projects should add this `.c` file to their component's `SRCS`.

```c
#include "air_quality_rating.h"
#include "environment_text.h"

/* Obtain rating from the algorithm for the selected standard. */
air_quality_t rating = AIR_MODERATE;
const char *text = env_text_get_rating("en", "co2", rating, "summary");
if (text != NULL) {
    lv_label_set_text(label, text);
}
```

Use `env_text_get("en", "env_co2_description")` for metric descriptions. Returned UTF-8 strings have static lifetime, with no JSON parsing required at runtime. Configure fonts, wrapping, and label width in LVGL; never modify the returned strings.

`content/generated/fonts/` contains deduplicated character sets for each language and all languages combined. Merge any additional characters needed for measurements, units, dates, or other UI text into your font build. These text files are character lists, not font files.

## Release checks

Deliver the four source catalogs, mapping, and generated resources together. Native resources have been generated and structurally checked; developers still need to add them to their App target and confirm layout and glyph rendering on actual devices.

## External index copy

External AQI copy uses only `aqi_hj` (China) and `aqi_epa` (US). Query the ordinal returned by `outdoor_index_rate()` using the matching scheme. Web `grade-3` maps to copy ID `grade_3`. Indices come from external providers; no local concentration-to-index calculation or Matter mapping occurs. Retain source, location, update time and current/daily/forecast context.

C files in the complete and LVGL ZIP packages are under `c/`; add that directory to your header search path.

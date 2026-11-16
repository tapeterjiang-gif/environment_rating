# Environment Rating for Web

浏览器、Web Worker 和 Node.js 的 WebAssembly 封装。评级计算直接使用项目根目录的 C99 源码，与 ESP32、Linux 和 iOS 保持一致。

环境参数图标使用随包发布的 Material Symbols Rounded SVG。调用 `materialIcon(parameter)` 可取得图标名称和相对于 Web 包的 SVG 地址；PM2.5 与 PM10 共用 `blur_on` 图标，并通过名称和参数识别色区分。O₃、CO、SO₂、花粉和紫外线指数也有各自的图标和固定识别色，可用 `rating.colors.parameter()` 获取。

当前仓库已包含可发布的 npm 包结构和预编译文件，但尚未发布到 npm registry。在仓库内可直接导入 `web/dist/index.js`，也可以执行 `npm pack --ignore-scripts` 生成本地安装包；发布后使用下面的包名导入。

## 使用

```ts
import {
  EnvironmentParameter,
  PMStandard,
  createEnvironmentRating
} from "@tapeterjiang-gif/environment-rating";

const rating = await createEnvironmentRating();

const overall = rating.air.overall({
  pmStandard: PMStandard.eeaAQI2024,
  co2: 1200,
  pm25: 18,
  pm10: 30,
  formaldehyde: null
});

const comfort = rating.thermal.evaluate({
  temperature: 25,
  humidity: 50,
  radiantTemperature: 25,
  airSpeed: 0.1
});

const noise = rating.soundLight.noise(38, "home");
const light = rating.soundLight.illuminance(300);

const pmQuality = rating.air.pm25(18);
const outdoorOzone = rating.air.o3Eea(75); // 1 小时平均，μg/m³
const usOzone = rating.air.o3Epa(0.080, 0.130); // 8 小时与可选 1 小时平均，ppm
const chinaCO = rating.air.coHj(5.1); // 1 小时平均，mg/m³
const usCO = rating.air.coEpa(4.5); // 8 小时平均，ppm
const euSO2 = rating.air.so2Eea(45); // 1 小时平均，μg/m³
const chinaSO2 = rating.air.so2HjHourly(500); // 1 小时平均，μg/m³
const usSO2 = rating.air.so2Epa(80, 100); // 1 小时与 24 小时，ppb
const pmColors = rating.colors.air(EnvironmentParameter.pm25, pmQuality);
// { primary: "#CA8A04", background: "#FEF9C3",
//   graphic: "#FACC15", text: "#713F12" }
```

`createEnvironmentRating()` 异步加载 Wasm。应用启动时调用一次并复用返回对象即可；评级函数本身无状态。使用 CDN 或自定义静态资源目录时可传入 `wasmUrl`：

```ts
const rating = await createEnvironmentRating({
  wasmUrl: "/assets/environment-rating-wasm.wasm"
});
```

缺失的空气质量参数使用 `undefined`、`null` 或直接省略。默认 PM 标准为 EEA AQI 2024，默认甲醛标准为 WHO 2010，默认湿度参考为 UBA；PMV 默认 `met=1.1`、`clo=0.7`。输入单位与完整规则见项目根目录 [README](../README.md)。

室外 O₃ 另有 `o3Hj(oneHour)`（μg/m³）和各自的 `*Level` 方法；O₃ 不参与 `overall()`。EPA 可省略 1 小时值，8 小时值必须提供。O₃ 目前只提供评级和 Matter LevelValue 映射，尚未定义参数识别色。

室外 CO 有 `coHj(oneHour)`、`coEpa(eightHour)` 及各自的 `*Level` 方法；也不参与 `overall()`。CO 目前只提供评级和 Matter LevelValue 映射，尚未定义参数识别色。输入的平均时间和单位见根目录 [README](../README.md#42-室外-co-单项评级)。

室外 SO₂ 有 `so2Eea(oneHour)`、`so2HjHourly(oneHour)`、`so2HjDaily(twentyFourHour)`、`so2Epa(oneHour, twentyFourHour)`。EPA 的两个参数都必需；缺失或无效时返回 `unknown`。SO₂ 不参与 `overall()`，Matter 1.6 无 SO₂ 浓度测量 Cluster，本库不提供 SO₂ `LevelValue` 或颜色。分档见根目录 [README](../README.md#43-室外-so₂-单项评级)。

花粉独立使用 `rating.pollen.rate(concentration, type, standard)`。输入为对应类型的日平均粒/m³，类型使用 `PollenType`，标准使用 `PollenStandard.nab` 或 `PollenStandard.meteoswiss`，结果使用 `PollenRating`（`unknown`、`absent`、`low`、`moderate`、`high`、`veryHigh`）。例如 `rating.pollen.rate(20, PollenType.grass, PollenStandard.nab)` 返回 `high`。只有正值总花粉数时返回 `unknown`；已测得的零值返回 `absent`。花粉不参与空气质量 `overall()`。分档见根目录 [README](../README.md#44-室外花粉负荷评级)。

紫外线指数独立使用 `rating.uvIndex.rate(uvi)`，输入为已测量或预报的非负 UVI，返回 `UVIndexRating`（`unknown`、`low`、`moderate`、`high`、`veryHigh`、`extreme`）。例如 `rating.uvIndex.rate(7.5)` 返回 `veryHigh`。等级按 WHO 五档，半整数向上归档；不参与 `overall()`。详见根目录 [README](../README.md#45-室外紫外线指数uvi)。

`rating.colors.parameter()` 返回参数的固定识别色和浅色背景；`air()`、`thermal()`、`humidity()`、`noise()`、`illuminance()` 根据对应评级结果返回状态色、标签背景、图示色和标签文字。所有颜色均为可直接用于 CSS 的大写 HEX 字符串；不支持的组合返回 `null`。完整配色见 [环境指标颜色说明](../COLOR_STANDARD.md)。

## 构建与测试

维护者需要 Emscripten、Node.js 18 或更新版本：

```sh
cd web
npm ci
npm run build
npm test
```

构建生成 ES Module、TypeScript 类型声明和独立 `.wasm` 文件。部署服务器应允许加载 `.wasm`；主流静态服务器通常会使用 `application/wasm` MIME 类型。npm 包为纯 ES Module，不依赖浏览器 DOM 或前端框架。

## External air quality indices

```js
import { createEnvironmentRating, OutdoorIndexStandard } from '@tapeterjiang-gif/environment-rating';
const rating = await createEnvironmentRating();
const grade = rating.outdoorIndex.rate(150, OutdoorIndexStandard.neaPSI);
// "grade-3": NEA Unhealthy, not EPA Unhealthy for Sensitive Groups.
```

`outdoorIndex.rate(value, standard)` requires an explicit scheme: `hj6332026`, `epaAQI2026`, `eea2024`, or `neaPSI`. HJ/EPA accept integer AQI 0–500; NEA accepts nonnegative integer 24-hour PSI (five categories). EEA accepts native category codes 1–6, not a numeric AQI. `OutdoorIndexGrade` returns `unknown` or `grade1`…`grade6` (string values `grade-1`…`grade-6`); NEA never returns grade6. Fractional, malformed, nonfinite, negative or unsupported values return unknown. No rounding, clamping, concentration-to-index calculation, Matter conversion or indoor aggregation occurs. Values above 500 are outside the supported HJ/EPA range; preserve any provider “Beyond AQI” status separately.

Use copy metric IDs `aqi_hj`, `aqi_epa`, `eea_index`, `psi` with the matching scheme. C enum ordinals 0–6 map to these catalogs; Web strings such as `grade-3` correspond to copy rating ID `grade_3`. EEA display input should be translated explicitly from the provider’s native labels. Keep source, location, update time and current/daily/forecast context in the UI. Singapore is displayed as PSI, not AQI or one-hour PM2.5.

## Outdoor nitrogen dioxide

`rating.air.no2Eea(oneHour)` and `no2HjHourly(oneHour)` accept hourly μg/m³. `no2HjDaily(twentyFourHour)` accepts daily μg/m³. `no2Epa(oneHour)` accepts hourly ppb; daily reporting uses the daily maximum hour. EEA uses continuous upper-inclusive bands, HJ rounds to integer with ties to even, EPA truncates integer ppb. Invalid inputs return `AirQuality.unknown`. These are single-pollutant grades; they do not change indoor overall ratings or compute external AQI/PSI. Copy metric ID: `no2`. See the main README 4.7 for the full table.

NO₂ design resources: `materialIcon(EnvironmentParameter.no2)` provides the bundled `directions_car` SVG. `colors.parameter(EnvironmentParameter.no2)` returns `#B4533C` with light background `#F8EAE5`. `colors.air(EnvironmentParameter.no2, quality)` returns the shared pollutant palette for all six ratings and Unknown, including status, background, graphic and label text. O₃, CO and SO₂ also use that palette. Do not pass external AQI/PSI ordinals as `AirQuality` values. Apple symbol name: `car.side.fill`.

## External index rating colors

External AQI, EEA indices and PSI have rating colors only; no icons or parameter identity colors are defined.

```js
const grade = rating.outdoorIndex.rate(150, OutdoorIndexStandard.neaPSI);
const colors = rating.colors.index(OutdoorIndexStandard.neaPSI, grade);
// {primary, background, graphic, text}: scheme-aware product UI colors.
```

HJ/EPA use green, yellow, orange, red, purple and maroon. EEA uses the six-band pollutant palette. PSI uses green, yellow, orange, red and maroon, with only five grades. Unknown is gray; invalid scheme/grade combinations, including PSI grade6, return null. These are product palettes, not agency-specified RGB. Always retain the native labels and index scheme; do not pass index ordinals to `colors.air()`.

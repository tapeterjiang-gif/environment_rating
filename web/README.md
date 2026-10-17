# Environment Rating for Web

浏览器、Web Worker 和 Node.js 的 WebAssembly 封装。评级计算直接使用项目根目录的 C99 源码，与 ESP32、Linux 和 iOS 保持一致。

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

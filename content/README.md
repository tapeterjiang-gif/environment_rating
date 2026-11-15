# 跨平台环境指标文案

项目根目录下的 `content/` 是指标简介与评级解读的唯一维护来源。四种语言使用相同的指标 ID 和评级 ID：`zh-Hans`、`zh-Hant`、`en`、`ja`。UTF-8、纯文本，不写 HTML、颜色值或用于排版的换行。

- `zh-Hans.json` 等四个 JSON：人工维护的名称、简介、通用建议、分档标签、短提示与完整提示。
- `manifest.json`：指标分类、适用评级及对应的 **C 枚举符号和数值**。
- `generated/`：自动生成的 iOS、Android、Web 和字库资源。
- 根目录 `environment_text.h/.c`：自动生成的固件文案查询接口。

JSON 结构为 `metrics.co2.name / description / advice / ratings.moderate.label / summary / detail`。`summary` 是可独立编辑的短提示，`detail` 是完整分档解读；小屏优先使用短提示，详情界面显示简介、建议及完整提示。不要在运行时截断长段落来制作短文案。

温度与 PMV 使用不同 ID：`temperature` 只有读数说明，`pmv` 才有七点冷热感评级。TVOC（`tvoc`）没有评级。花粉的 `unknown` 表示无法评级，`absent` 表示已测得零值。所有有效评级均有 `unknown` 文案。

## 更新和生成

在项目根目录执行（只需 Node.js 18 或以上，无额外依赖）：

```sh
node scripts/generate-copy.mjs
node scripts/generate-copy.mjs --check
node --test tests/test_environment_copy.mjs
node scripts/package-copy.mjs
node scripts/package-copy.mjs --check
node scripts/generate-developer-page.mjs
node scripts/generate-developer-page.mjs --check
```

修改文案时编辑四个语言源文件，然后重新生成；不要直接修改生成文件。增加指标或评级时同步编辑 `manifest.json`。生成器检查语言键集合、必需字段和纯文本约束；生成的 C 代码还在编译时核对枚举值。

设计参考网页的解读板块与 `site/dist/rating-copy.js` 也由此生成。网页 UI 的标题、导航、按钮仍由网页本地化文件维护。`--check` 只检查资源是否过期，不写文件。

## 通用键和映射

各端使用完全相同的键，例如：

```text
env_co2_name
env_co2_description
env_co2_advice
env_co2_rating_moderate_label
env_co2_rating_moderate_summary
env_co2_rating_moderate_detail
```

评级查找基于算法返回值，**不是 Matter `LevelValue`**。例如 CO₂ 的 `AIR_MODERATE`（3）对应 `moderate`；`AIR_FAIR`（2）不用于 CO₂，会作为 `unknown` 处理。PM、甲醛、O₃、CO、SO₂ 使用六档 `AirQuality` 映射，其他指标使用各自枚举。完整映射见 `manifest.json`，不解析中文标签、不根据浓度在文案中重新分档。

语言不存在时使用英文；支持 `zh-CN` / `zh_CN`、`zh-TW`、`zh-HK`、`en-US`、`ja-JP` 等常见别名。未找到文本键返回空结果，不把某个正常等级当作缺省结果。

## 评级标准说明

四个语言源文件的 `standards` 节点提供 16 套标准的 `name`（名称）、`description`（简介）、`organization`（发布组织）。稳定 ID 与出处、组织官网链接见 `manifest.json` 的 `standards`。

各平台的文本键为 `env_standard_who_uv_index_name`、`env_standard_who_uv_index_description`、`env_standard_who_uv_index_organization`。多组织标准还生成带序号的 `organization_1`、`organization_2`，便于分别展示官网链接。Web 可调用 `getStandard('zh-Hans', 'who_uv_index')` 取得三项文字；固件可用 `env_text_get()` 查询相同键。

## iOS

将 `generated/ios/EnvironmentCopy.xcstrings` 加入 App target。使用字符串目录名称 `EnvironmentCopy`：

```swift
let label = String(localized: "env_co2_rating_moderate_label",
                   table: "EnvironmentCopy")
let detail = String(localized: "env_co2_rating_moderate_detail",
                    table: "EnvironmentCopy")
```

App 语言由系统本地化处理；项目需启用相应语言。若把目录放入自己的 Swift Package，请将它声明为 package resource，并在查询时传入对应 bundle。这里生成的是可直接导入的资源，不会自动修改现有 Swift 算法包。

## Android

将 `generated/android/res/` 下的四个语言目录合并到 App 的 `src/main/res/`，也可在 Gradle 中将该目录加入资源路径：

```kotlin
val label = context.getString(R.string.env_co2_rating_moderate_label)
val detail = context.getString(R.string.env_co2_rating_moderate_detail)
```

`values/` 为英文缺省，另有 `values-b+zh+Hans`、`values-b+zh+Hant` 和 `values-ja`。字符串不使用格式占位符，XML 已完成引号和特殊字符转义。

## 青萍 Web

可以按语言加载 `generated/web/` 的 JSON；需要便捷查询时直接导入生成的模块，无需构建依赖：

```js
import { getMetric, getRating, getText } from './environment-copy.mjs';

const metric = getMetric('zh-Hans', 'co2');
const copy = getRating('zh-Hans', 'co2', 3); // 或传入 'moderate'
// metric.description / metric.advice
// copy.label / copy.summary / copy.detail
const name = getText('zh-Hans', 'env_co2_name');
```

模块附带 `.d.ts`，返回只读数据；非法指标/键返回 `null`，非法评级回退到该指标的 `unknown`。直接导入模块会包含四种语言；需要按需加载时使用独立 JSON 和 `manifest.json`。

## 固件 / LVGL

将根目录 `environment_text.c` 加入工程源码；它依赖本项目各评级头文件做枚举编译检查，不依赖 LVGL、不分配堆内存。CMake 工程可以链接 `environment_text` target；ESP-IDF 工程需要将该 `.c` 文件加入自己的组件 `SRCS`。

```c
#include "air_quality_rating.h"
#include "environment_text.h"

/* rating 由评级算法按对应标准计算。 */
air_quality_t rating = AIR_MODERATE;
const char *text = env_text_get_rating("zh-Hans", "co2", rating, "summary");
if (text != NULL) {
    lv_label_set_text(label, text);
}
```

简介可用 `env_text_get("zh-Hans", "env_co2_description")` 查询。函数返回静态 UTF-8 字符串，生命周期覆盖整个程序；不要求运行时解析 JSON。LVGL 端自行设置字体、换行与控件宽度，勿修改返回的字符串。

`generated/fonts/` 提供按语言和全部语言合并的去重字符集，供字体转换流程读取。它们只覆盖这些文案；测量数值、单位、日期和其他 UI 文本需要的字符，应在制作字库时额外合并。不要把字符集文本当作字体文件。

## 发布核对

一次更新应同时交付四个源文件、映射与生成文件。原生资源已生成并通过结构检查，但仍需开发者加入具体 App target；最终排版和字库显示需在相应设备中确认。

开发参考页提供完整资源包与 iOS、Android、Web、LVGL 独立 ZIP 下载，均包含四种语言。运行 `node scripts/package-copy.mjs` 可更新 `site/dist/downloads/` 下的文件及校验清单，然后重新生成开发参考页。下载包用于集成；维护文案并重新生成资源时，请在项目仓库中执行上述命令。

# 环境评级标准

本文汇总当前项目已实现的热舒适度、空气质量、声光和室外环境规则，与 [README.md](../README.md) 及代码一致。标准规定平均时间或统计方法时，调用方先完成测量和平均，评级库再处理当前有效结果；评级结果本身不等同于完整的正式达标判定。

## 环境参数图标

Apple 平台使用 SF Symbols；Android、Web、Linux 和设备屏幕使用 Material Symbols Rounded。图标与参数名称、数值或单位同时显示，只表示参数类型，不表示当前评级。

| 类别 | 环境参数 | Material 图标预览 | Apple · SF Symbols | Android 与其他平台 · Material Symbols Rounded |
| --- | --- | --- | --- | --- |
| 热舒适度 | 温度 | ![温度](../assets/icons/material/device_thermostat.svg) | `thermometer.medium` | `device_thermostat` |
| 热舒适度 | 相对湿度 | ![相对湿度](../assets/icons/material/humidity_percentage.svg) | `humidity.fill` | `humidity_percentage` |
| 空气质量 | CO₂ | ![CO₂](../assets/icons/material/air.svg) | `wind` | `air` |
| 空气质量 | PM2.5 | ![PM2.5](../assets/icons/material/blur_on.svg) | `aqi.medium` | `blur_on` |
| 空气质量 | PM10 | ![PM10](../assets/icons/material/blur_on.svg) | `aqi.medium` | `blur_on` |
| 空气质量 | 甲醛 HCHO | ![甲醛](../assets/icons/material/science.svg) | `flask` | `science` |
| 空气质量 | TVOC 指数 | ![TVOC 指数](../assets/icons/material/speed.svg) | `speedometer` | `speed` |
| 声光环境 | 噪声 | ![噪声](../assets/icons/material/graphic_eq.svg) | `waveform` | `graphic_eq` |
| 声光环境 | 光照 / 照度 | ![照度](../assets/icons/material/light_mode.svg) | `sun.max` | `light_mode` |
| 室外环境 | 臭氧 O₃ | ![臭氧](../assets/icons/material/dehaze.svg) | `sun.haze.fill` | `dehaze` |
| 室外环境 | 一氧化碳 CO | ![一氧化碳](../assets/icons/material/detector_smoke.svg) | `smoke.fill` | `detector_smoke` |
| 室外环境 | 二氧化硫 SO₂ | ![二氧化硫](../assets/icons/material/foggy.svg) | `cloud.fog.fill` | `foggy` |
| 室外环境 | 二氧化氮 NO₂ | ![二氧化氮](../assets/icons/material/directions_car.svg) | `car.side.fill` | `directions_car` |
| 室外环境 | 花粉 | ![花粉](../assets/icons/material/local_florist.svg) | `leaf.fill` | `local_florist` |
| 室外环境 | 紫外线指数 | ![紫外线指数](../assets/icons/material/flare.svg) | `sun.max.fill` | `flare` |

## 1. 热舒适度

热舒适度模块分别输出 PMV、PPD、冷热提示和湿度提示，不生成综合等级，也不写入 Matter `AirQuality`。PMV/PPD 参考 ISO 7730:2025，冷热名称采用 ASHRAE 七点热感觉标尺；连续区间为产品规则。

### 1.1 PMV 冷热提示

接口为 `thermal_pmv()`、`thermal_ppd()` 和 `thermal_rate()`。PMV 为负表示偏冷，为正表示偏热；PPD 根据 PMV 连续计算，不单独分档。

| 有效 PMV 区间 | 冷热提示 | 返回枚举 |
| --- | --- | --- |
| −3 ≤ PMV < −2.5 | 冷 | `THERMAL_COLD` |
| −2.5 ≤ PMV < −1.5 | 凉 | `THERMAL_COOL` |
| −1.5 ≤ PMV < −0.5 | 稍凉 | `THERMAL_SLIGHTLY_COOL` |
| −0.5 ≤ PMV ≤ +0.5 | 中性 | `THERMAL_NEUTRAL` |
| +0.5 < PMV ≤ +1.5 | 稍暖 | `THERMAL_SLIGHTLY_WARM` |
| +1.5 < PMV ≤ +2.5 | 暖 | `THERMAL_WARM` |
| +2.5 < PMV ≤ +3 | 热 | `THERMAL_HOT` |
| 无效或超出 −3～+3 | 未知 | `THERMAL_UNKNOWN` |

PMV 为 0 时 PPD 为 5%；PMV 为 ±0.5、±1、±2、±3 时，PPD 分别约为 10.2%、26.1%、76.8%、99.1%。`thermal_pmv()` 将超出 ASHRAE 七点标尺的有限计算结果饱和到 −3 或 +3；直接传给 `thermal_ppd()` 或 `thermal_rate()` 的值须在 −3～+3。没有实际人员信息时，产品建议使用 `met=1.1`、`clo=0.7` 作全年估计；实际值已知时应由调用方传入。

### 1.2 湿度提示

接口为 `thermal_rate_humidity()`，输入单位为 **%RH**。EPA 和 UBA 是可选择的独立依据；默认建议使用 UBA 的全年 40%～60% 范围。

| 依据 | 偏干 `DRY` | 适宜 `SUITABLE` | 略湿 `SLIGHTLY_HUMID` | 偏湿 `HUMID` |
| --- | --- | --- | --- | --- |
| EPA | RH < 30 | 30 ≤ RH ≤ 50 | 50 < RH < 60 | RH ≥ 60 |
| UBA（默认） | RH < 40 | 40 ≤ RH ≤ 60 | 不使用 | RH > 60 |

仅接受有限的 0～100%RH；无效湿度或非法依据返回 `THERMAL_HUMIDITY_UNKNOWN`。产品全年室内目标为温度 20～26°C、相对湿度 40%～60%，但温度冷热提示仍由 PMV 决定，不按空气温度单独分档。

来源：[ISO 7730:2025](https://www.iso.org/standard/85803.html)、[ASHRAE 七点热感觉标尺](https://www.ashrae.org/file%20library/technical%20resources/standards%20and%20guidelines/standards%20addenda/55_2017_d_20200731.pdf#page=17)、[EPA 湿度指南](https://www.epa.gov/mold/brief-guide-mold-moisture-and-your-home)、[UBA 湿度指南](https://www.umweltbundesamt.de/en/node/3086)。

## 2. 空气质量

`AirQuality` 列为 `air_rate_*()` 返回的单项评级，参与整体最差等级计算；`LevelValue` 列为 `air_level_*()` 返回的单项浓度等级。两者的转换属于产品规则，不是 Matter 官方浓度阈值。

### 2.1 PM2.5、PM10

浓度单位：**μg/m³**。PM2.5、PM10 分别评级，共用所选 PM 标准。

| 标准 | 接口枚举 | 原标准时间口径 | 本项目数值处理 |
| --- | --- | --- | --- |
| EEA European Air Quality Index（默认） | `AIR_PM_EEA_AQI_2024` | 小时浓度 | 保留小数，采用产品连续区间 |
| HJ 633—2026 | `AIR_PM_HJ_633_2026` | 日报为自然日均值，实时报告为当前 1 小时均值 | 两项均修约到整数，半值取偶 |
| EPA AQI（May 2026） | `AIR_PM_EPA_AQI_2026` | 日 AQI 为 24 小时均值，当前指数使用 PM NowCast | PM2.5 截断至一位小数，PM10 截断至整数 |

#### 三种标准分档对照

EEA 列的 C 为按 EEA 时间口径计算的有效浓度；HJ 列为相应平均浓度修约后的整数；EPA 列为相应统计结果截断后的浓度。所有浓度单位均为 μg/m³。

##### PM2.5

| AirQuality | LevelValue | EEA（默认） | HJ 633—2026 | EPA AQI |
| --- | --- | --- | --- | --- |
| Good（1） | Low（1） | 0 ≤ C ≤ 5 | 0–35 | 0.0–9.0 |
| Fair（2） | Low（1） | 5 < C ≤ 15 | 36–60 | 9.1–35.4 |
| Moderate（3） | Medium（2） | 15 < C ≤ 50 | 61–115 | 35.5–55.4 |
| Poor（4） | High（3） | 50 < C ≤ 90 | 116–150 | 55.5–125.4 |
| VeryPoor（5） | High（3） | 90 < C ≤ 140 | 151–250 | 125.5–225.4 |
| ExtremelyPoor（6） | Critical（4） | C > 140 | ≥251 | ≥225.5 |

##### PM10

| AirQuality | LevelValue | EEA（默认） | HJ 633—2026 | EPA AQI |
| --- | --- | --- | --- | --- |
| Good（1） | Low（1） | 0 ≤ C ≤ 15 | 0–50 | 0–54 |
| Fair（2） | Low（1） | 15 < C ≤ 45 | 51–120 | 55–154 |
| Moderate（3） | Medium（2） | 45 < C ≤ 120 | 121–250 | 155–254 |
| Poor（4） | High（3） | 120 < C ≤ 195 | 251–350 | 255–354 |
| VeryPoor（5） | High（3） | 195 < C ≤ 270 | 351–420 | 355–424 |
| ExtremelyPoor（6） | Critical（4） | C > 270 | ≥421 | ≥425 |

#### 标准说明

- **EEA**：枚举中的 2024 对应方法报告 ETC HE 2024/17；分档沿用项目于 2026-09-12 核对的版本。小数连续区间是产品规则。
- **HJ 633—2026**：半值取偶，例如 PM2.5 的 35.5 修约为 36，60.5 修约为 60。原类别依次为优、良、轻度污染、中度污染、重度污染、严重污染。
- **EPA AQI**：例如 PM2.5 的 9.09 截断为 9.0。原类别依次为 Good、Moderate、Unhealthy for Sensitive Groups、Unhealthy、Very Unhealthy、Hazardous；其中 EPA Moderate 对应表中的 AirQuality Fair。

来源：[EEA 指数](https://airindex.eea.europa.eu/AQI/)、[EEA 方法报告](https://www.eionet.europa.eu/etcs/etc-he/products/etc-he-products/etc-he-reports/etc-he-report-2024-17-eeas-revision-of-the-european-air-quality-index-bands)、[HJ 633—2026](https://www.mee.gov.cn/ywgz/fgbz/bz/bzwb/jcffbz/202602/W020260225366493492011.pdf)、[EPA AQI 技术文档](https://document.airnow.gov/technical-assistance-document-for-the-reporting-of-daily-air-quailty.pdf)。

### 2.2 CO₂

浓度单位：**ppm**。统一参考德国 UBA 2008 室内 CO₂ 卫生指导值，作为通风提示；无需选择标准参数。

| AirQuality | LevelValue | 有效浓度 C | 产品提示 |
| --- | --- | --- | --- |
| Good（1） | Low（1） | 0 ≤ C < 1000 | 正常 |
| Moderate（3） | Medium（2） | 1000 ≤ C ≤ 2000 | 建议通风 |
| Poor（4） | High（3） | C > 2000 | 应加强通风 |

CO₂ 只有三个有效档位，不输出 Critical；1000、2000 均归入 Medium。接口为 `air_rate_co2()` 和 `air_level_co2()`。

来源：[UBA 2008，§6.2、表 4](https://www.umweltbundesamt.de/system/files/medien/pdfs/kohlendioxid_2008.pdf)。

### 2.3 HCHO（甲醛）

评级输入单位：**mg/m³**。默认并推荐 WHO 2010；甲醛标准独立于 PM 标准。SFA40 的 Matter 上报可用 ppb，传入评级函数前须按 [README 的单位转换说明](../README.md#27-matter-接入-guide)换算。

| 标准 | 接口枚举 | 参考浓度 L（mg/m³） | 原标准时间口径 |
| --- | --- | --- | --- |
| WHO 2010（默认） | `AIR_HCHO_WHO_2010` | 0.100 | 30 分钟平均 |
| GB/T 18883—2022 | `AIR_HCHO_GBT_18883_2022` | 0.080 | 1 小时平均 |
| 加州 OEHHA 2008 | `AIR_HCHO_OEHHA_2008` | 0.055 | 1 小时平均（Acute REL） |

各标准提供参考浓度，未规定以下六档。项目采用 0.25L、0.5L、L、2L、5L 作为产品分界，再转换为四档 LevelValue。C 为按所选标准时间口径计算的有效平均浓度。

| AirQuality | LevelValue | WHO 2010（默认） | GB/T 18883—2022 | OEHHA 2008 |
| --- | --- | --- | --- | --- |
| Good（1） | Low（1） | 0 ≤ C ≤ 0.025 | 0 ≤ C ≤ 0.020 | 0 ≤ C ≤ 0.01375 |
| Fair（2） | Low（1） | 0.025 < C ≤ 0.050 | 0.020 < C ≤ 0.040 | 0.01375 < C ≤ 0.0275 |
| Moderate（3） | Medium（2） | 0.050 < C ≤ 0.100 | 0.040 < C ≤ 0.080 | 0.0275 < C ≤ 0.055 |
| Poor（4） | High（3） | 0.100 < C ≤ 0.200 | 0.080 < C ≤ 0.160 | 0.055 < C ≤ 0.110 |
| VeryPoor（5） | High（3） | 0.200 < C ≤ 0.500 | 0.160 < C ≤ 0.400 | 0.110 < C ≤ 0.275 |
| ExtremelyPoor（6） | Critical（4） | C > 0.500 | C > 0.400 | C > 0.275 |

接口为 `air_rate_hcho()` 和 `air_level_hcho()`。OEHHA 为加州参考暴露水平，并非美国联邦标准。

来源：[WHO 2010](https://www.ncbi.nlm.nih.gov/books/NBK138711/)、[GB/T 18883—2022](https://www.ndcpa.gov.cn/doc/ucap/1625444428300685312/document/20230607/ZgwODgwF.pdf)、[OEHHA 甲醛参考值](https://oehha.ca.gov/chemicals/formaldehyde)、[OEHHA 平均时间说明](https://oehha.ca.gov/air/general-info/oehha-acute-8-hour-and-chronic-reference-exposure-level-rel-summary)。

### 2.4 通用规则

| 情况 | 处理 |
| --- | --- |
| 负值、NaN、无穷大或非法标准 | 对应单项 AirQuality、LevelValue 均返回 Unknown（0） |
| 参数缺失、未就绪或不可信 | 上层清除对应有效位，不参与整体评级 |
| 整体评级 | `air_rate_all()` 取可评价项中最差的 AirQuality；全部不可用返回 Unknown |
| 整体接口标准非法或有效位图含未定义位 | 整体返回 Unknown，即使对应参数未参与评价 |

零浓度是有效值，不能代替缺失状态。Matter 等级枚举定义见 [AirQuality](https://github.com/project-chip/connectedhomeip/blob/master/data_model/1.6/clusters/AirQuality.xml) 和 [LevelValue](https://github.com/project-chip/connectedhomeip/blob/master/data_model/1.6/clusters/ConcentrationMeasurement.xml)。

## 3. 声光

噪声和照度分别评价，不生成声光综合等级，也不写入 Matter `AirQuality`。

### 3.1 噪声提示

接口为 `noise_rate()`，输入为经过校准的当前 A 计权 Fast 声级，单位为 **dB(A)**。表中阈值借用 WHO 1999 的长期 LAeq 场景参考值；本项目不计算 LAeq 或 LAmax，四档和 10 dB 间隔属于产品规则。

| 产品提示 | 住宅日间及晚间 `NOISE_HOME` | 睡眠 `NOISE_SLEEP` | 返回枚举 |
| --- | --- | --- | --- |
| 安静 | L ≤ 35 | L ≤ 30 | `NOISE_QUIET` |
| 偏吵 | 35 < L ≤ 45 | 30 < L ≤ 40 | `NOISE_NOTICEABLE` |
| 嘈杂 | 45 < L ≤ 55 | 40 < L ≤ 50 | `NOISE_LOUD` |
| 很吵 | L > 55 | L > 50 | `NOISE_VERY_LOUD` |
| 无效 | 非法场景、非有限值或超出 −200～200 | 同左 | `NOISE_UNKNOWN` |

### 3.2 照度提示

接口为 `illuminance_rate()`，输入单位为 **lx**。参考 ANSI/IES/ALA RP-11-26 的住宅任务照度层级；标准本身按具体房间、活动和任务面给出维持照度目标，不定义以下连续评级。项目以 5、10、20、30、50 fc 为分界，并按 `1 fc = 10.763910416709722 lx` 精确换算。

| 瞬时照度 E | 场景提示 | 返回枚举 | 分界依据 |
| --- | --- | --- | --- |
| 0 ≤ E < 53.819552… lx | 低照环境 | `ILLUMINANCE_LOW_LIGHT` | 低于 5 fc |
| 53.819552… ≤ E < 107.639104… lx | 氛围照明 | `ILLUMINANCE_AMBIENT` | 5～<10 fc |
| 107.639104… ≤ E < 215.278208… lx | 日常活动 | `ILLUMINANCE_DAILY_ACTIVITY` | 10～<20 fc |
| 215.278208… ≤ E < 322.917313… lx | 阅读学习 | `ILLUMINANCE_READING` | 20～<30 fc |
| 322.917313… ≤ E < 538.195521… lx | 专注活动 | `ILLUMINANCE_FOCUSED_ACTIVITY` | 30～<50 fc |
| E ≥ 538.195521… lx（有限值） | 精细作业 | `ILLUMINANCE_DETAIL_WORK` | 50 fc 及以上 |
| E < 0、NaN 或无穷大 | 未知 | `ILLUMINANCE_UNKNOWN` | 无效输入 |

界面可将边界显示为 54、108、215、323、538 lx；算法不提前修约。边界归入较高档，零值有效。结果表示当前照度大致能够支持的活动层级，不表示越亮越好。

RP-11-26 的目标值针对指定任务面和测量方向。设备的墙面单点瞬时读数只能作为场景提示，不能证明整个区域符合标准，也不评价眩光、均匀度或昼夜节律影响。

来源：[ANSI/IES/ALA RP-11-26 官方说明](https://store.ies.org/product/recommended-practice-lighting-for-interior-and-exterior-residential-environments/?v=eb65bcceaa5f)、[IES Illuminance Selector 使用说明](https://ies.org/standards/lighting-library/illuminance-selector-faqs/)。

## 4. 室外环境

室外 O₃、CO、SO₂、花粉和紫外线指数分别评级，不合并成整体等级；外部 中国或美国 AQI单独接入，见 4.6。

### 4.1 室外 O₃ 单项评级

O₃ 不参与室内整体评级；室外也不生成整体评级。EEA 与 HJ 实时报使用 **1 小时平均 μg/m³**；EPA 使用 **8 小时平均 ppm**，可结合有效的 **1 小时平均 ppm**。对应接口为 `air_rate_o3_eea()`、`air_rate_o3_hj()`、`air_rate_o3_epa()` 和同名的 `air_level_o3_*()`。

| AirQuality | LevelValue | EEA 1 小时（μg/m³） | HJ 633—2026 实时报 1 小时（μg/m³，修约后） | EPA 8 小时（ppm，截断后） |
| --- | --- | --- | --- | --- |
| Good | Low | 0–60 | 0–160 | 0.000–0.054 |
| Fair | Low | >60–100 | 161–200 | 0.055–0.070 |
| Moderate | Medium | >100–120 | 201–300 | 0.071–0.085 |
| Poor | High | >120–160 | 301–400 | 0.086–0.105 |
| VeryPoor | High | >160–180 | 401–800 | 0.106–0.200 |
| ExtremelyPoor | Critical | >180 | ≥801 | 8 小时值不定义；1 小时 ≥0.405 ppm |

EPA 的 1 小时 0.125–0.164、0.165–0.204、0.205–0.404 ppm 分别对应 Moderate、Poor、VeryPoor；低于 0.125 ppm 不产生该时段的等级。缺失的可选 1 小时值传 `NAN`。EPA 8 小时值超过 0.200 ppm 且无有效 1 小时等级时返回 Unknown。EEA 小数连续区间是产品规则；HJ 修约到整数、半值取偶。中国日报使用另一套 8 小时口径，本版未实现。详见 [README](../README.md#41-室外-o₃-单项评级)。

来源：[EEA 指数](https://airindex.eea.europa.eu/AQI/)、[HJ 633—2026](https://www.mee.gov.cn/ywgz/fgbz/bz/bzwb/jcffbz/202602/W020260225366493492011.pdf)、[EPA AQI 表 6](https://document.airnow.gov/technical-assistance-document-for-the-reporting-of-daily-air-quailty.pdf)。

### 4.2 室外 CO 单项评级

CO 不参与室内整体评级，室外也不生成整体评级。中国 HJ 633—2026 实时报使用 **1 小时平均 mg/m³**；美国 EPA AQI 使用 **8 小时平均 ppm**。

| AirQuality | LevelValue | HJ 1 小时（mg/m³，修约后） | EPA 8 小时（ppm，截断后） |
| --- | --- | --- | --- |
| Good | Low | 0–5.0 | 0.0–4.4 |
| Fair | Low | 5.1–10.0 | 4.5–9.4 |
| Moderate | Medium | 10.1–35.0 | 9.5–12.4 |
| Poor | High | 35.1–60.0 | 12.5–15.4 |
| VeryPoor | High | 60.1–90.0 | 15.5–30.4 |
| ExtremelyPoor | Critical | ≥90.1 | ≥30.5 |

HJ 修约至 0.1 mg/m³、半值取偶；EPA 截断至 0.1 ppm。EEA 指数不含 CO，故不设 EEA CO 六档。接口、Matter 接入及来源见 [README](../README.md#42-室外-co-单项评级)。

### 4.3 室外 SO₂ 单项评级

SO₂ 仅作室外单项评级；EEA 与 HJ 使用 μg/m³，EPA 使用 ppb。

| 等级 | EEA 1 小时 | HJ 实时报 1 小时 | HJ 日报 24 小时 | EPA 1 小时 / 24 小时 |
| --- | --- | --- | --- | --- |
| Good | 0–20 | 0–150 | 0–50 | 1 小时 0–35 |
| Fair | >20–40 | 151–500 | 51–150 | 1 小时 36–75 |
| Moderate | >40–125 | 501–650 | 151–475 | 1 小时 76–185 |
| Poor | >125–190 | ≥651 | 476–800 | 1 小时 186–304；或 1 小时 ≥305 且 24 小时 <305 |
| VeryPoor | >190–275 | 不产生 | 801–1600 | 24 小时 305–604 |
| ExtremelyPoor | >275 | 不产生 | ≥1601 | 24 小时 ≥605 |

HJ 先修约到整数、半值取偶；EPA 先截断到整数。EPA 两个时段的值都必须有效。Matter 1.6 没有 SO₂ 浓度测量 Cluster，因此本项没有 `LevelValue`。接口与来源见 [README](../README.md#43-室外-so₂-单项评级)。

### 4.4 室外花粉负荷

花粉独立评级，输入为对应类别或种类的日平均浓度（粒/m³）。四档来自所选 NAB 或 MeteoSwiss 表；零值“未检出”和正值总花粉“无法评级”为产品处理规则。花粉不参与空气质量整体评级，也无 Matter 等级映射。

| NAB 类型 | 低 | 中 | 高 | 极高 |
| --- | ---: | ---: | ---: | ---: |
| 树木 | 1–14 | 15–89 | 90–1499 | ≥1500 |
| 禾草 | 1–4 | 5–19 | 20–199 | ≥200 |
| 杂草 | 1–9 | 10–49 | 50–499 | ≥500 |

| MeteoSwiss 类型 | 低 | 中 | 高 | 极高 |
| --- | ---: | ---: | ---: | ---: |
| 榛树、桤木、鹅耳枥 | 1–10 | 11–69 | 70–249 | ≥250 |
| 白蜡树 | 1–10 | 11–99 | 100–349 | ≥350 |
| 桦树 | 1–10 | 11–69 | 70–299 | ≥300 |
| 悬铃木 | 1–49 | 50–99 | 100–399 | ≥400 |
| 橡树、山毛榉 | 1–49 | 50–129 | 130–399 | ≥400 |
| 栗树 | 1–99 | 100–199 | 200–699 | ≥700 |
| 禾草 | 1–19 | 20–49 | 50–149 | ≥150 |
| 酸模、车前草 | 1–14 | 15–24 | 25–59 | ≥60 |
| 蒿属 | 1–5 | 6–14 | 15–49 | ≥50 |
| 豚草 | 1–5 | 6–10 | 11–39 | ≥40 |

有效正值小数直接按下档起点比较；例如桦树 10.5 为低、11 为中。具体接口、类型名称和不匹配输入处理见 [pollen_rating.h](../c/pollen_rating.h)。来源：[NAB](https://pollenandmold.stlouisco.com/html/PollenLevels.html)、[MeteoSwiss](https://www.meteoswiss.admin.ch/dam/jcr%3A43b4f361-8bc1-4af7-a232-c126de0f2f80/Belastungsklassen-der-allergenen-Pollenarten_E.pdf)。

### 4.5 紫外线指数（UVI）

WHO 全球太阳紫外线指数五档；算法输入已测量或预报的全球太阳 UVI（无量纲），`uv_index_rate()` 不从 lux 或未加权辐照度推算 UVI。

| 报告整数 UVI | 等级 | 返回枚举 |
| --- | --- | --- |
| 0–2 | 低 | `UV_INDEX_LOW` |
| 3–5 | 中 | `UV_INDEX_MODERATE` |
| 6–7 | 高 | `UV_INDEX_HIGH` |
| 8–10 | 很高 | `UV_INDEX_VERY_HIGH` |
| ≥11 | 极高 | `UV_INDEX_EXTREME` |

函数对非负小数按报告整数的最近值分档：2.5、5.5、7.5、10.5 归入高一档，恰好半整数向上；负值、NaN、无穷大返回 `UV_INDEX_UNKNOWN`。日最大值与当前值须分别标注；不参与空气质量、照度或室外综合评级。详见 [README](../README.md#45-室外紫外线指数uvi)。来源：[WHO 实用指南](https://iris.who.int/bitstream/handle/10665/42459/9241590076.pdf#page=6)。

### 4.6 外部空气质量指数：AQI

`outdoor_index_rating.h/.c` 只接收外部按中国 HJ 633—2026 或美国 EPA AQI 发布的整数指数，不从设备污染物浓度重新计算综合指数。调用方负责确认来源、地点、更新时间和时段，并区分当前值、日报与预报。

| AQI 数值 | HJ 633—2026 | US EPA AQI（2026 指南） |
|---|---|---|
| 0–50 | 优 | Good |
| 51–100 | 良 | Moderate |
| 101–150 | 轻度污染 | Unhealthy for Sensitive Groups |
| 151–200 | 中度污染 | Unhealthy |
| 201–300 | 重度污染 | Very Unhealthy |
| 301–500 | 严重污染 | Hazardous |

接口不设默认体系。输入范围为整数 0–500，返回 `OUTDOOR_INDEX_UNKNOWN` 或 `OUTDOOR_INDEX_GRADE_1` 至 `GRADE_6`。小数、负数、NaN、无穷大、超范围和非法体系返回未知，不自动修约或封顶。“Beyond AQI”等非数值状态由上层单独展示。

```c
#include "outdoor_index_rating.h"
#include "environment_text.h"

outdoor_index_grade_t grade = outdoor_index_rate(OUTDOOR_INDEX_EPA_AQI_2026, 150);
const char *label = env_text_get_rating("zh-Hans", "aqi_epa", grade, "label");
```

中国和美国分别使用文案 ID `aqi_hj`、`aqi_epa`，同档序号不表示相同浓度。该模块不返回 Matter `AirQuality` 或 `LevelValue`，也不参与室内整体评级。AQI 仅有等级状态色，不设置图标和识别色；颜色使用 `env_color_index()` 按体系查询，见 [环境指标颜色说明](COLOR_STANDARD.md)。

来源：[HJ 633—2026](https://www.mee.gov.cn/ywgz/fgbz/bz/bzwb/jcffbz/202602/t20260225_1144441.shtml)、[EPA AQI 技术指南](https://document.airnow.gov/technical-assistance-document-for-the-reporting-of-daily-air-quailty.pdf)。

### 4.7 室外 NO₂ 单项评级

`air_rate_no2_eea()`、`air_rate_no2_hj_hourly()`、`air_rate_no2_hj_daily()`、`air_rate_no2_epa()` 返回独立单项六档，不加入室内整体评级，不重新计算外部 AQI，也不提供 Matter LevelValue 映射。

| 单项等级 | EEA · 1 小时 μg/m³ | HJ 633—2026 · 1 小时 μg/m³ | HJ 633—2026 · 24 小时 μg/m³ | EPA · 1 小时 ppb |
|---|---|---|---|---|
| Good | 0–10 | 0–100 | 0–40 | 0–53 |
| Fair | >10–25 | 101–200 | 41–80 | 54–100 |
| Moderate | >25–60 | 201–700 | 81–180 | 101–360 |
| Poor | >60–100 | 701–1200 | 181–280 | 361–649 |
| VeryPoor | >100–150 | 1201–2340 | 281–565 | 650–1249 |
| ExtremelyPoor | >150 | ≥2341 | ≥566 | ≥1250 |

调用方负责平均时间。EEA 连续比较、上限包含；HJ 先修约为整数，恰好半整数按偶数修约，例如日平均 565.5 修约为 566，进入最后一档；EPA 截断为整数 ppb，日报使用当日最大一小时浓度。负值、NaN、无穷大返回 Unknown。不要将 μg/m³ 与 ppb 混用，库不进行单位换算。

Web 使用 `rating.air.no2Eea()`、`no2HjHourly()`、`no2HjDaily()`、`no2Epa()`，规则与 C 相同。四语言文案 ID 为 `no2`，评级映射沿用单项六档，状态色可复用污染物六档色表。

来源：[EEA 指数](https://airindex.eea.europa.eu/AQI/)、[HJ 633—2026 表 3](https://www.mee.gov.cn/ywgz/fgbz/bz/bzwb/jcffbz/202602/W020260225366493492011.pdf)、[EPA AQI 分界](https://aqs.epa.gov/aqsweb/documents/codetables/aqi_breakpoints.html)。

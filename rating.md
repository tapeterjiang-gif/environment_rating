# 环境评级表

本文汇总当前项目已实现的空气质量、热舒适度和声光规则，与 [README.md](README.md) 及代码一致。所有评级均使用当前有效输入，不执行原标准的平均时间，也不用于正式达标判定。

## 1. 空气质量

`AirQuality` 列为 `air_rate_*()` 返回的单项评级，参与整体最差等级计算；`LevelValue` 列为 `air_level_*()` 返回的单项浓度等级。两者的转换属于产品规则，不是 Matter 官方浓度阈值。

### 1.1 PM2.5、PM10

浓度单位：**μg/m³**。PM2.5、PM10 分别评级，共用所选 PM 标准。

| 标准 | 接口枚举 | 原标准时间口径 | 本项目数值处理 |
| --- | --- | --- | --- |
| EEA European Air Quality Index（默认） | `AIR_PM_EEA_AQI_2024` | 小时浓度 | 保留小数，采用产品连续区间 |
| HJ 633—2026 | `AIR_PM_HJ_633_2026` | 日报为自然日均值，实时报告为当前 1 小时均值 | 两项均修约到整数，半值取偶 |
| EPA AQI（May 2026） | `AIR_PM_EPA_AQI_2026` | 日 AQI 为 24 小时均值，当前指数使用 PM NowCast | PM2.5 截断至一位小数，PM10 截断至整数 |

#### 三种标准分档对照

EEA 列的 C 为原始有效浓度；HJ 列为修约后的整数；EPA 列为截断后的浓度。所有浓度单位均为 μg/m³。

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

### 1.2 CO₂

浓度单位：**ppm**。统一参考德国 UBA 2008 室内 CO₂ 卫生指导值，作为通风提示；无需选择标准参数。

| AirQuality | LevelValue | 有效瞬时浓度 C | 产品提示 |
| --- | --- | --- | --- |
| Good（1） | Low（1） | 0 ≤ C < 1000 | 正常 |
| Moderate（3） | Medium（2） | 1000 ≤ C ≤ 2000 | 建议通风 |
| Poor（4） | High（3） | C > 2000 | 应加强通风 |

CO₂ 只有三个有效档位，不输出 Critical；1000、2000 均归入 Medium。接口为 `air_rate_co2()` 和 `air_level_co2()`。

来源：[UBA 2008，§6.2、表 4](https://www.umweltbundesamt.de/system/files/medien/pdfs/kohlendioxid_2008.pdf)。

### 1.3 HCHO（甲醛）

评级输入单位：**mg/m³**。默认并推荐 WHO 2010；甲醛标准独立于 PM 标准。SFA40 的 Matter 上报可用 ppb，传入评级函数前须按 [README 的单位转换说明](README.md#17-matter-接入-guide)换算。

| 标准 | 接口枚举 | 参考浓度 L（mg/m³） | 原标准时间口径 |
| --- | --- | --- | --- |
| WHO 2010（默认） | `AIR_HCHO_WHO_2010` | 0.100 | 30 分钟平均 |
| GB/T 18883—2022 | `AIR_HCHO_GBT_18883_2022` | 0.080 | 1 小时平均 |
| 加州 OEHHA 2008 | `AIR_HCHO_OEHHA_2008` | 0.055 | 1 小时平均（Acute REL） |

各标准提供参考浓度，未规定以下六档。项目采用 0.25L、0.5L、L、2L、5L 作为产品分界，再转换为四档 LevelValue。C 为原始有效瞬时浓度。

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

### 1.4 通用规则

| 情况 | 处理 |
| --- | --- |
| 负值、NaN、无穷大或非法标准 | 对应单项 AirQuality、LevelValue 均返回 Unknown（0） |
| 参数缺失、未就绪或不可信 | 上层清除对应有效位，不参与整体评级 |
| 整体评级 | `air_rate_all()` 取可评价项中最差的 AirQuality；全部不可用返回 Unknown |
| 整体接口标准非法或有效位图含未定义位 | 整体返回 Unknown，即使对应参数未参与评价 |

零浓度是有效值，不能代替缺失状态。Matter 等级枚举定义见 [AirQuality](https://github.com/project-chip/connectedhomeip/blob/master/data_model/1.6/clusters/AirQuality.xml) 和 [LevelValue](https://github.com/project-chip/connectedhomeip/blob/master/data_model/1.6/clusters/ConcentrationMeasurement.xml)。

## 2. 热舒适度

热舒适度模块分别输出 PMV、PPD、冷热提示和湿度提示，不生成综合等级，也不写入 Matter `AirQuality`。PMV/PPD 参考 ISO 7730:2025，冷热名称采用 ASHRAE 七点热感觉标尺；连续区间为产品规则。

### 2.1 PMV 冷热提示

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

### 2.2 湿度提示

接口为 `thermal_rate_humidity()`，输入单位为 **%RH**。EPA 和 UBA 是可选择的独立依据；默认建议使用 UBA 的全年 40%～60% 范围。

| 依据 | 偏干 `DRY` | 适宜 `SUITABLE` | 略湿 `SLIGHTLY_HUMID` | 偏湿 `HUMID` |
| --- | --- | --- | --- | --- |
| EPA | RH < 30 | 30 ≤ RH ≤ 50 | 50 < RH < 60 | RH ≥ 60 |
| UBA（默认） | RH < 40 | 40 ≤ RH ≤ 60 | 不使用 | RH > 60 |

仅接受有限的 0～100%RH；无效湿度或非法依据返回 `THERMAL_HUMIDITY_UNKNOWN`。产品全年室内目标为温度 20～26°C、相对湿度 40%～60%，但温度冷热提示仍由 PMV 决定，不按空气温度单独分档。

来源：[ISO 7730:2025](https://www.iso.org/standard/85803.html)、[ASHRAE 七点热感觉标尺](https://www.ashrae.org/file%20library/technical%20resources/standards%20and%20guidelines/standards%20addenda/55_2017_d_20200731.pdf#page=17)、[EPA 湿度指南](https://www.epa.gov/mold/brief-guide-mold-moisture-and-your-home)、[UBA 湿度指南](https://www.umweltbundesamt.de/en/node/3086)。

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

接口为 `illuminance_rate()`，输入单位为 **lx**。参考 GB/T 50034—2024 表 5.2.1 的住宅照度值；连续区间和场景提示属于产品映射。

| 瞬时照度 E | 场景提示 | 返回枚举 | 参考含义 |
| --- | --- | --- | --- |
| 0 ≤ E < 75 | 光线较暗 | `ILLUMINANCE_DIM` | 低于所选住宅活动最低参考值 |
| 75 ≤ E < 100 | 卧室活动 | `ILLUMINANCE_BEDROOM_ACTIVITY` | 卧室一般活动 75 lx |
| 100 ≤ E < 150 | 日常活动 | `ILLUMINANCE_DAILY_ACTIVITY` | 客厅、厨房、卫生间一般活动 100 lx |
| 150 ≤ E < 200 | 用餐 | `ILLUMINANCE_DINING` | 餐桌面 150 lx |
| 200 ≤ E < 300 | 床头阅读 | `ILLUMINANCE_BEDSIDE_READING` | 卧室床头、阅读 200 lx |
| E ≥ 300（有限值） | 读写与操作 | `ILLUMINANCE_READING_AND_TASKS` | 书写、阅读和厨房操作台等 300 lx |
| E < 0、NaN 或无穷大 | 未知 | `ILLUMINANCE_UNKNOWN` | 无效输入 |

照度边界归入较高档，零值有效。标准值是指定参考平面的维持平均照度；设备的单点瞬时读数只能作为活动参考，不能证明整个区域符合照明标准。

来源：[WHO《社区噪声指南》](https://www.who.int/publications/i/item/a68672)、[GB/T 50034—2024 表 5.2.1](https://zcsys.ncepu.edu.cn/docs/2025-01/d5c197c2837e4892ac7d02faae298500.pdf#page=34)。

# PM、CO₂、HCHO 评级表

本文汇总当前项目已实现的规则，与 [README.md](README.md) 一致。所有输入均采用瞬时浓度，不执行原标准的平均时间，也不用于正式达标判定。

`AirQuality` 列为 `air_rate_*()` 返回的单项评级，参与整体最差等级计算；`LevelValue` 列为 `air_level_*()` 返回的单项浓度等级。两者的转换属于产品规则，不是 Matter 官方浓度阈值。

## 1. PM2.5、PM10

浓度单位：**μg/m³**。PM2.5、PM10 分别评级，共用所选 PM 标准。

| 标准 | 接口枚举 | 原标准时间口径 | 本项目数值处理 |
| --- | --- | --- | --- |
| EEA European Air Quality Index（默认） | `AIR_PM_EEA_AQI_2024` | 小时浓度 | 保留小数，采用产品连续区间 |
| HJ 633—2026 | `AIR_PM_HJ_633_2026` | 日报为自然日均值，实时报告为当前 1 小时均值 | 两项均修约到整数，半值取偶 |
| EPA AQI（May 2026） | `AIR_PM_EPA_AQI_2026` | 日 AQI 为 24 小时均值，当前指数使用 PM NowCast | PM2.5 截断至一位小数，PM10 截断至整数 |

### 三种标准分档对照

EEA 列的 C 为原始有效浓度；HJ 列为修约后的整数；EPA 列为截断后的浓度。所有浓度单位均为 μg/m³。

#### PM2.5

| AirQuality | LevelValue | EEA（默认） | HJ 633—2026 | EPA AQI |
| --- | --- | --- | --- | --- |
| Good（1） | Low（1） | 0 ≤ C ≤ 5 | 0–35 | 0.0–9.0 |
| Fair（2） | Medium（2） | 5 < C ≤ 15 | 36–60 | 9.1–35.4 |
| Moderate（3） | Medium（2） | 15 < C ≤ 50 | 61–115 | 35.5–55.4 |
| Poor（4） | High（3） | 50 < C ≤ 90 | 116–150 | 55.5–125.4 |
| VeryPoor（5） | High（3） | 90 < C ≤ 140 | 151–250 | 125.5–225.4 |
| ExtremelyPoor（6） | Critical（4） | C > 140 | ≥251 | ≥225.5 |

#### PM10

| AirQuality | LevelValue | EEA（默认） | HJ 633—2026 | EPA AQI |
| --- | --- | --- | --- | --- |
| Good（1） | Low（1） | 0 ≤ C ≤ 15 | 0–50 | 0–54 |
| Fair（2） | Medium（2） | 15 < C ≤ 45 | 51–120 | 55–154 |
| Moderate（3） | Medium（2） | 45 < C ≤ 120 | 121–250 | 155–254 |
| Poor（4） | High（3） | 120 < C ≤ 195 | 251–350 | 255–354 |
| VeryPoor（5） | High（3） | 195 < C ≤ 270 | 351–420 | 355–424 |
| ExtremelyPoor（6） | Critical（4） | C > 270 | ≥421 | ≥425 |

#### 标准说明

- **EEA**：枚举中的 2024 对应方法报告 ETC HE 2024/17；分档沿用项目于 2026-09-12 核对的版本。小数连续区间是产品规则。
- **HJ 633—2026**：半值取偶，例如 PM2.5 的 35.5 修约为 36，60.5 修约为 60。原类别依次为优、良、轻度污染、中度污染、重度污染、严重污染。
- **EPA AQI**：例如 PM2.5 的 9.09 截断为 9.0。原类别依次为 Good、Moderate、Unhealthy for Sensitive Groups、Unhealthy、Very Unhealthy、Hazardous；其中 EPA Moderate 对应表中的 AirQuality Fair。

来源：[EEA 指数](https://airindex.eea.europa.eu/AQI/)、[EEA 方法报告](https://www.eionet.europa.eu/etcs/etc-he/products/etc-he-products/etc-he-reports/etc-he-report-2024-17-eeas-revision-of-the-european-air-quality-index-bands)、[HJ 633—2026](https://www.mee.gov.cn/ywgz/fgbz/bz/bzwb/jcffbz/202602/W020260225366493492011.pdf)、[EPA AQI 技术文档](https://document.airnow.gov/technical-assistance-document-for-the-reporting-of-daily-air-quailty.pdf)。

## 2. CO₂

浓度单位：**ppm**。统一参考德国 UBA 2008 室内 CO₂ 卫生指导值，作为通风提示；无需选择标准参数。

| AirQuality | LevelValue | 有效瞬时浓度 C | 产品提示 |
| --- | --- | --- | --- |
| Good（1） | Low（1） | 0 ≤ C < 1000 | 正常 |
| Moderate（3） | Medium（2） | 1000 ≤ C ≤ 2000 | 建议通风 |
| Poor（4） | High（3） | C > 2000 | 应加强通风 |

CO₂ 只有三个有效档位，不输出 Critical；1000、2000 均归入 Medium。接口为 `air_rate_co2()` 和 `air_level_co2()`。

来源：[UBA 2008，§6.2、表 4](https://www.umweltbundesamt.de/system/files/medien/pdfs/kohlendioxid_2008.pdf)。

## 3. HCHO（甲醛）

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
| Fair（2） | Medium（2） | 0.025 < C ≤ 0.050 | 0.020 < C ≤ 0.040 | 0.01375 < C ≤ 0.0275 |
| Moderate（3） | Medium（2） | 0.050 < C ≤ 0.100 | 0.040 < C ≤ 0.080 | 0.0275 < C ≤ 0.055 |
| Poor（4） | High（3） | 0.100 < C ≤ 0.200 | 0.080 < C ≤ 0.160 | 0.055 < C ≤ 0.110 |
| VeryPoor（5） | High（3） | 0.200 < C ≤ 0.500 | 0.160 < C ≤ 0.400 | 0.110 < C ≤ 0.275 |
| ExtremelyPoor（6） | Critical（4） | C > 0.500 | C > 0.400 | C > 0.275 |

接口为 `air_rate_hcho()` 和 `air_level_hcho()`。OEHHA 为加州参考暴露水平，并非美国联邦标准。

来源：[WHO 2010](https://www.ncbi.nlm.nih.gov/books/NBK138711/)、[GB/T 18883—2022](https://www.ndcpa.gov.cn/doc/ucap/1625444428300685312/document/20230607/ZgwODgwF.pdf)、[OEHHA 甲醛参考值](https://oehha.ca.gov/chemicals/formaldehyde)、[OEHHA 平均时间说明](https://oehha.ca.gov/air/general-info/oehha-acute-8-hour-and-chronic-reference-exposure-level-rel-summary)。

## 4. 通用规则

| 情况 | 处理 |
| --- | --- |
| 负值、NaN、无穷大或非法标准 | 对应单项 AirQuality、LevelValue 均返回 Unknown（0） |
| 参数缺失、未就绪或不可信 | 上层清除对应有效位，不参与整体评级 |
| 整体评级 | `air_rate_all()` 取可评价项中最差的 AirQuality；全部不可用返回 Unknown |
| 整体接口标准非法或有效位图含未定义位 | 整体返回 Unknown，即使对应参数未参与评价 |

零浓度是有效值，不能代替缺失状态。Matter 等级枚举定义见 [AirQuality](https://github.com/project-chip/connectedhomeip/blob/master/data_model/1.6/clusters/AirQuality.xml) 和 [LevelValue](https://github.com/project-chip/connectedhomeip/blob/master/data_model/1.6/clusters/ConcentrationMeasurement.xml)。

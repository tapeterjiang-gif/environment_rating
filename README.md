# environment_rating

环境评级库的需求、评级标准与使用指南。面向 ESP32（RTOS）与 RK3506（Linux），采用可重入 C99 实现，兼容 C++。三个模块独立输出，均无需初始化、动态内存或历史状态。

版本：v0.37。空气质量评级标准核对日期：2026-09-12；传感器规格核对日期：2026-09-23。

- [1. 空气质量](#1-空气质量)：CO₂、PM、甲醛及整体评级。
- [2. 热舒适度](#2-热舒适度)：PMV、PPD、冷热与湿度提示。
- [3. 声光](#3-声光)：噪声提示与照度活动参考。

| 模块 | 文件 |
| --- | --- |
| 空气质量 | [air_quality_rating.h](air_quality_rating.h) / [air_quality_rating.c](air_quality_rating.c) |
| 热舒适度 | [thermal_comfort.h](thermal_comfort.h) / [thermal_comfort.c](thermal_comfort.c) |
| 声光 | [sound_light_rating.h](sound_light_rating.h) / [sound_light_rating.c](sound_light_rating.c) |

### 通用输入单位

上层负责读取传感器数据，并转换为下表规定的接口单位后传入评级函数。评级库不依赖具体传感器驱动。

| 参数 | 单位 | 规则 |
| --- | --- | --- |
| CO₂（co2） | ppm | 三个市场统一分档 |
| PM2.5（pm25） | μg/m³ | 按指定 PM 标准分档 |
| PM10（pm10） | μg/m³ | 按指定 PM 标准分档 |
| 甲醛（hcho） | mg/m³ | 按指定甲醛标准分档 |
| 空气温度（temperature） | °C | 参与 PMV 计算 |
| 相对湿度（humidity） | %RH | 参与 PMV 计算，并可独立输出干湿提示；50.0 表示 50%RH |
| 噪声（noise） | dB(A) | 当前 A 计权 Fast 声级，按住宅或睡眠场景分档 |
| 照度（illuminance） | lx | 输出住宅活动参考提示 |

PMV 的其他输入（平均辐射温度、相对风速、代谢率、衣着热阻）及单位见第 2 章。温湿度、噪声和照度不参与空气质量整体评级。

### 构建与验证

需要 CMake 3.16 或更新版本，以及 C99、C++11 编译器（C++ 用于链接测试）。在项目根目录执行：

```sh
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
ctest --test-dir build --output-on-failure
```

本机测试覆盖三个模块的分档边界、相邻浮点值、异常输入、PMV/PPD 参考值及 C++ 链接。ESP32、RK3506 的 SDK 交叉构建和实机验证待完成。

### 平台集成

按需将上表中模块的 `.c` 文件加入工程，把根目录加入头文件搜索路径，包含对应 `.h` 即可调用。接口和参数说明以头文件注释为准；空气质量分档速查见 [rating.md](rating.md)。

- **ESP-IDF**：将项目放入 `components/environment_rating`，在调用组件中添加 `REQUIRES environment_rating`，会编译全部三个模块。
- **Linux**：使用本项目 CMake，按需链接 `air_quality_rating`、`thermal_comfort`、`sound_light_rating`；也可直接编译所需源文件，使用热舒适度模块时链接数学库 `-lm`。只构建库可设置 `-DBUILD_TESTING=OFF`，无需 C++ 编译器。

源文件按 C99 编译，支持 C++ 调用。不要开启 `-ffast-math` 或 `-ffinite-math-only`，以保证 NaN 和无穷大检查有效。传感器读取、校准、有效性判断和通信由上层负责。

## 1. 空气质量

### 1.1 目标与范围

面向中国、美国和欧洲，对 CO₂、PM2.5、PM10、甲醛分别评级，并支持 Matter 1.6。整体取有效参数中最差等级；接口细节见头文件。

空气质量评级统一采用**瞬时值**，不计算均值、NowCast、平滑、滞回或持续时间。PM 按所选标准阈值评价，CO₂ 统一参考德国 UBA 通风提示。本产品输出瞬时等级，不计算标准 AQI 数值，也不代表地区标准认证。

### 1.2 输入有效性

PM 默认标准为 EEA European Air Quality Index；甲醛默认标准为 WHO 2010。两者分别对应标准枚举的零值，接口仍要求显式传入标准参数，不根据地区自动选择。

- 调用方负责单位、可信量程和新鲜度；缺失、异常或过期项清除有效位，并保留原因。
- 未设置有效位的数值被忽略；有效零浓度须设置有效位，不能用零表示缺失。
- 负值、NaN 和无穷大不可评价；单项返回 Unknown，整体计算排除该项。
- 所有项均不可评价时，整体返回 Unknown；非法标准或未定义的有效位也使整体返回 Unknown。

### 1.3 Matter 等级

单项和整体均使用 Matter 1.6 Air Quality Cluster（0x005B，revision 1）的 AirQualityEnum：

| 值 | 等级 | 中文释义 |
| --- | --- | --- |
| 0 | Unknown | 未知 |
| 1 | Good | 好 |
| 2 | Fair | 尚可 |
| 3 | Moderate | 中等 |
| 4 | Poor | 差 |
| 5 | VeryPoor | 很差 |
| 6 | ExtremelyPoor | 极差 |

Unknown 不参与优劣比较。Unknown、Good、Poor 为基础枚举；完整六档上报需启用 FAIR、MOD、VPOOR、XPOOR 特性，并与 FeatureMap 一致。浓度阈值及下述映射属于产品规则，不是 Matter 官方阈值；不同污染物同档不表示健康风险等价。

来源：[Matter 1.6 规范 §2.9.5.1，正文第 207 页](https://csa-iot.org/wp-content/uploads/2026/06/23-27350-010_Matter-1.6-Application-Cluster-Specification.pdf#page=211)、[官方 Air Quality 数据模型](https://github.com/project-chip/connectedhomeip/blob/master/data_model/1.6/clusters/AirQuality.xml)。

### 1.4 PM 评级标准

两项 PM 分别查表，不要求同时处于同一档。以下浓度单位均为 μg/m³；超过最高分档的有效值归入 ExtremelyPoor。

#### 1.4.1 中国：HJ 633—2026

参考《环境空气质量指数（AQI）技术规定》，2026-03-01 实施，替代 HJ 633—2012。两项 PM 按 GB/T 8170 修约到整数，采用最接近整数、半值取偶；表中 C 为修约值。

| 中国类别 | PM2.5：C | PM10：C | Matter 等级 |
| --- | --- | --- | --- |
| 优 | 0–35 | 0–50 | 1 / Good |
| 良 | 36–60 | 51–120 | 2 / Fair |
| 轻度污染 | 61–115 | 121–250 | 3 / Moderate |
| 中度污染 | 116–150 | 251–350 | 4 / Poor |
| 重度污染 | 151–250 | 351–420 | 5 / VeryPoor |
| 严重污染 | ≥251 | ≥421 | 6 / ExtremelyPoor |

例如 PM2.5=35.5 修约为 36，属于 Fair；60.5 修约为 60，仍为 Fair。有效零浓度归入 Good。

原标准日报采用自然日均值，实时报告采用当前 1 小时均值；本产品仅借用浓度阈值和修约规则，不进行 IAQI 插值或指数取整。

来源：[生态环境部发布页](https://www.mee.gov.cn/ywgz/fgbz/bz/bzwb/jcffbz/202602/t20260225_1144441.shtml)、[正式全文 §4.2、表 1 和表 3](https://www.mee.gov.cn/ywgz/fgbz/bz/bzwb/jcffbz/202602/W020260225366493492011.pdf)。

#### 1.4.2 美国：EPA AQI

参考 EPA AQI 技术文档 May 2026、表 6，PM2.5 使用 2024 年更新后的分界。PM2.5 截断至一位小数，PM10 截断至整数；表中 C 为截断值。

| EPA 类别 | PM2.5：C | PM10：C | Matter 等级 |
| --- | --- | --- | --- |
| Good | 0.0–9.0 | 0–54 | 1 / Good |
| Moderate | 9.1–35.4 | 55–154 | 2 / Fair |
| Unhealthy for Sensitive Groups | 35.5–55.4 | 155–254 | 3 / Moderate |
| Unhealthy | 55.5–125.4 | 255–354 | 4 / Poor |
| Very Unhealthy | 125.5–225.4 | 355–424 | 5 / VeryPoor |
| Hazardous | ≥225.5 | ≥425 | 6 / ExtremelyPoor |

例如 PM2.5=9.09 截断为 9.0，属于 Good。按严重程度映射，**EPA Moderate 对应 Matter Fair**；展示 EPA 类别时须保留其原名。

原标准日 AQI 采用 24 小时均值，当前空气质量采用 PM NowCast；本产品不计算这些统计值或数值 AQI。

来源：[EPA AQI 技术文档，第 IV 节、表 6](https://document.airnow.gov/technical-assistance-document-for-the-reporting-of-daily-air-quailty.pdf)、[2024 年 PM AQI 更新说明](https://www.epa.gov/system/files/documents/2024-02/pm-naaqs-air-quality-index-fact-sheet.pdf)。

#### 1.4.3 欧洲：EEA European Air Quality Index

采用核对日期所示的 EEA 更新版分档，方法背景为 ETC HE Report 2024/17；枚举 `AIR_PM_EEA_AQI_2024` 中的 2024 对应该报告编号。保留小数，C 为原始有效瞬时值。

| EEA 类别 | PM2.5 | PM10 | Matter 等级 |
| --- | --- | --- | --- |
| Good | 0 ≤ C ≤ 5 | 0 ≤ C ≤ 15 | 1 / Good |
| Fair | 5 < C ≤ 15 | 15 < C ≤ 45 | 2 / Fair |
| Moderate | 15 < C ≤ 50 | 45 < C ≤ 120 | 3 / Moderate |
| Poor | 50 < C ≤ 90 | 120 < C ≤ 195 | 4 / Poor |
| Very poor | 90 < C ≤ 140 | 195 < C ≤ 270 | 5 / VeryPoor |
| Extremely poor | C > 140 | C > 270 | 6 / ExtremelyPoor |

原方法使用小时浓度。官方表给出整数区间，未明确测量小数的取整方法；上表采用已确认的产品连续区间规则：首档含零，其后下限不含、上限包含。例如 PM2.5=5 为 Good，5.1 为 Fair。此规则不标称为 EEA 官方取整规则。

来源：[EEA 官方指数及分档](https://airindex.eea.europa.eu/AQI/)、[EEA 分档修订方法报告](https://www.eionet.europa.eu/etcs/etc-he/products/etc-he-products/etc-he-reports/etc-he-report-2024-17-eeas-revision-of-the-european-air-quality-index-bands)。

### 1.5 CO₂ 评级标准

三个市场统一参考德国 UBA 室内 CO₂ 卫生指导值，作为通风提示，不随 PM 标准切换，不增加地区限值评价。C 为有效瞬时浓度，单位 ppm。

| 浓度 | UBA 评价含义 | 产品提示 | Matter 等级 |
| --- | --- | --- | --- |
| 0 ≤ C < 1000 | 卫生上无明显问题 | 正常 | 1 / Good |
| 1000 ≤ C ≤ 2000 | 需要关注 | 建议通风 | 3 / Moderate |
| C > 2000 | 卫生上不可接受 | 应加强通风 | 4 / Poor |

1000 和 2000 均归入 Moderate；所有有效的 C > 2000 均为 Poor，不扩展高浓度档位。此映射表达 CO₂ 通风提示，不代表全部室内污染物的质量结论。

来源：[UBA《室内空气中二氧化碳的健康评价》，2008，§6.2、表 4](https://www.umweltbundesamt.de/system/files/medien/pdfs/kohlendioxid_2008.pdf)。

### 1.6 甲醛评级标准

甲醛默认并推荐采用 **WHO 2010《室内空气质量指南》**，其参考浓度为 0.10 mg/m³（30 分钟平均），适合作为中、美、欧产品的统一参考。需要遵循特定市场方案时，也可显式选择 GB/T 18883—2022 或加州 OEHHA 2008。

甲醛标准独立于 PM 标准。各标准提供一个参考浓度 L；Matter 六档采用统一产品倍数 0.25L、0.5L、L、2L、5L。标准本身没有规定六档，因此该倍数映射不得标称为标准官方分档。C 为有效瞬时浓度，单位 mg/m³。

| 甲醛标准 | 参考浓度 L | 原标准时间口径 |
| --- | ---: | --- |
| `AIR_HCHO_WHO_2010` | 0.100 | 30 分钟平均 |
| `AIR_HCHO_GBT_18883_2022` | 0.080 | 1 小时平均 |
| `AIR_HCHO_OEHHA_2008` | 0.055 | 1 小时平均（Acute REL） |

| Matter 等级 | WHO 2010（默认） | GB/T 18883—2022 | OEHHA 2008 |
| --- | ---: | ---: | ---: |
| Good | 0 ≤ C ≤ 0.025 | 0 ≤ C ≤ 0.020 | 0 ≤ C ≤ 0.01375 |
| Fair | 0.025 < C ≤ 0.050 | 0.020 < C ≤ 0.040 | 0.01375 < C ≤ 0.0275 |
| Moderate | 0.050 < C ≤ 0.100 | 0.040 < C ≤ 0.080 | 0.0275 < C ≤ 0.055 |
| Poor | 0.100 < C ≤ 0.200 | 0.080 < C ≤ 0.160 | 0.055 < C ≤ 0.110 |
| VeryPoor | 0.200 < C ≤ 0.500 | 0.160 < C ≤ 0.400 | 0.110 < C ≤ 0.275 |
| ExtremelyPoor | C > 0.500 | C > 0.400 | C > 0.275 |

OEHHA 项是加州参考暴露水平，不是美国联邦标准。本产品对瞬时浓度评级，不执行原标准的平均时间，也不用于正式达标判定。

来源：[WHO 2010 甲醛章节](https://www.ncbi.nlm.nih.gov/books/NBK138711/)、[GB/T 18883—2022](https://www.ndcpa.gov.cn/doc/ucap/1625444428300685312/document/20230607/ZgwODgwF.pdf)、[加州 OEHHA 甲醛参考值](https://oehha.ca.gov/chemicals/formaldehyde)、[OEHHA 平均时间说明（脚注 1）](https://oehha.ca.gov/air/general-info/oehha-acute-8-hour-and-chronic-reference-exposure-level-rel-summary)。

### 1.7 Matter 接入 Guide

**启用 Cluster**

在空气检测仪的 Endpoint 上启用 Air Quality（`0x005B`），并按实际测量参数启用 CO₂（`0x040D`）、PM2.5（`0x042A`）、PM10（`0x042D`）、甲醛（`0x042B`）浓度测量 Cluster。浓度 Cluster 启用 NumericMeasurement，`MeasurementMedium` 设置为 Air。

**填写测量属性（SCD40、SEN62、SFA40）**

以下为首版建议配置（规格核对日期：2026-09-23）。`MeasuredValue` 填有效实测值，其余按表配置；量产前按整机验证结果确认量程。

| Matter 字段 | CO₂ / SCD40 | PM2.5 / SEN62 | PM10 / SEN62 | 甲醛 / SFA40 |
| --- | --- | --- | --- | --- |
| `MeasuredValue` | 实测 ppm | 实测 μg/m³ | 实测 μg/m³ | 实测 ppb |
| `MinMeasuredValue` | `400.0` | `0.0` | `0.0` | `0.0` |
| `MaxMeasuredValue` | `2000.0` | `1000.0` | `1000.0` | `2000.0` |
| `MeasurementUnit` | PPM（0） | UGM3（4） | UGM3（4） | PPB（1） |
| `MeasurementMedium` | Air（0） | Air（0） | Air（0） | Air（0） |

浓度和 Min / Max 使用单精度浮点数，不乘以 100；无效实测值填 null。量程不表示整个范围具有相同精度，量产前还需结合整机验证结果确认。

SCD40 建议按厂商标称测量范围配置为 400～2000 ppm；0～40000 ppm 只是输出范围，不能当作具备标称精度的量程。采用该配置时，范围外读数不写入 `MeasuredValue`，按下文处理为无效，也不钳制到边界。因此当前 CO₂ 的 >2000 ppm 高档无法通过这套有效性策略输出；若产品需要覆盖该档，应先验证扩展测量范围再修改 Max，或采用具有相应标称量程的传感器。评级库本身仍保留 >2000 ppm 的规则。

SFA40 的 0～2000 ppb 是输出范围，其典型精度仅覆盖 0～200 ppb；表中保留完整输出范围不代表全量程精度保证。精度范围外读数须经整机验证后判断是否可用，不外推误差公式。

**单位转换与有效性**

SCD40 的 ppm 可直接使用；SEN62 的质量浓度原始整数按手册除以 10 得到 μg/m³，`0xFFFF` 表示未知，须在换算前排除。若驱动已输出物理单位，不再重复缩放。

SFA40 建议在 Matter 保留原生 ppb，以免协议上报引入温压换算。`air_rate_hcho()`、`air_level_hcho()` 和 `air_rate_all()` 的甲醛参数仍为 mg/m³：按理想气体关系，`mg/m³ = ppb × 30.026 × P / (8.314462618 × T) × 10⁻⁶`，P 为 Pa，T 为 K。若采用固定 25°C、101325 Pa 的参考条件，1 ppb 约为 0.0012273 mg/m³；须明确这是参考条件换算，不是实测温压修正。Matter 与评级使用同一原始读数，不能将 ppb 直接传入评级函数。

若已有集成选择 MGM3，也可保持该单位，但 `MeasuredValue` 和量程必须一起换算。固定上述参考条件时，2000 ppb 约为 2.4546 mg/m³。

SFA40 启动达到规格的典型时间为 10 分钟，SEN62 PM 典型稳定时间为 30 秒，均不是整机保证时限。上层结合状态、校准和稳定性判断有效性；无效期间按下文上报 null / Unknown。

来源：[SCD40 官方规格（输出范围与精度范围）](https://sensirion.com/products/catalog/SCD40)、[SEN6x 数据手册，第 4～5、27 页](https://sensirion.com/resource/datasheet/SEN6x)、[SFA40 数据手册 v1.1（2026-04），第 3 页](https://sensirion.com/media/documents/5B06EDD9/69F84BD8/Sensirion_Datasheet_SFA40.pdf)。

**处理无效数据**

各参数分别检查有效性、数据新鲜度和整机量程，并检查转换后的浮点数仍可表示。初始化尚无有效数据、通信失败或数据失效时，用 SDK 的 nullable 类型将对应 `MeasuredValue` 设为 null；将该参数从 `valid_mask` 中排除，并将其 `LevelValue` 设为 Unknown。缺失参数不参与整体评价，全部无效时整体返回 Unknown，不用零浓度代替无效值。

**更新评级结果**

Air Quality Cluster 启用 FAIR、MOD、VPOOR、XPOOR 四个特性（`FeatureMap = 0x0F`），以支持完整六档。调用 `air_rate_all()`，将返回值更新到 `AirQuality`（`0x0000`）；`air_quality_t` 的 0～6 与 Matter `AirQualityEnum` 一一对应。

**额外更新单项 LevelValue**

| 参数 | 调用函数 | 浓度 Cluster 额外启用的特性 |
| --- | --- | --- |
| CO₂ | `air_level_co2(co2)` | LevelIndication、MediumLevel |
| PM2.5 | `air_level_pm25(pm_std, pm25)` | LevelIndication、MediumLevel、CriticalLevel |
| PM10 | `air_level_pm10(pm_std, pm10)` | LevelIndication、MediumLevel、CriticalLevel |
| 甲醛 | `air_level_hcho(hcho_std, hcho)` | LevelIndication、MediumLevel、CriticalLevel |

将函数返回值写入对应浓度 Cluster 的 `LevelValue`（`0x000A`）。单项与整体计算使用同一份有效数据和相同标准；`air_level_t` 与 `air_quality_t` 是不同枚举，不可混用。LevelValue 的分档映射与接口说明见 [air_quality_rating.h](air_quality_rating.h)。

来源：[Matter 1.6 Air Quality 数据模型](https://github.com/project-chip/connectedhomeip/blob/master/data_model/1.6/clusters/AirQuality.xml)、[浓度测量数据模型](https://github.com/project-chip/connectedhomeip/blob/master/data_model/1.6/clusters/ConcentrationMeasurement.xml)。

## 2. 热舒适度

独立模块 `thermal_comfort.h/.c`，提供 PMV、PPD 与冷热提示。参考 ISO 7730:2025 的 Fanger PMV/PPD 模型，采用 ASHRAE 七点热感觉名称。首版限定外部机械功为零，不评估局部不适、适应性舒适度或完整标准符合性。独立湿度提示按所选依据评价，与冷热提示分别输出。

产品采用全年统一的室内目标：温度 20～26°C、相对湿度 40%～60%，不再按夏季和冬季切换。温度目标用于简单场景提示，实际冷热提示仍以 PMV 为准；统一目标属于产品规则，不表示 GB/T 18883—2022 符合性评价。

### 2.1 使用方式

接口见 [thermal_comfort.h](thermal_comfort.h)。先计算 PMV，再由 PMV 得到 PPD 和冷热提示；湿度可独立评级。以下示例假设辐射温度等于气温、相对风速 0.1 m/s、活动强度 1.1 met、衣着热阻 0.7 clo，作为不区分季节时的全年估计，结果应标为“估算”。

```c
/* 包含 thermal_comfort.h 后，在函数内调用。 */
double pmv = thermal_pmv(25.0, 50.0, 25.0, 0.1, 1.1, 0.7);
double ppd = thermal_ppd(pmv);
thermal_sensation_t sensation = thermal_rate(pmv);
/* 无效时 pmv、ppd 为 NAN，sensation 为 THERMAL_UNKNOWN。 */
```

### 2.2 输入与适用范围

| 输入 | 单位 | 接受范围（含边界） |
| --- | --- | --- |
| 空气温度 temperature | °C | 10～30 |
| 相对湿度 humidity | %RH | 0～100，且水蒸气分压力不超过 2700 Pa |
| 平均辐射温度 radiant_temperature | °C | 10～40 |
| 人体相对风速 air_speed | m/s | 0～1 |
| 代谢率 met | met | 0.8～4 |
| 有效衣着热阻 clo | clo | 0～2 |

相对风速包含人体运动影响；有效衣着热阻应与实际条件相符，由调用方提供。函数不默认辐射温度等于气温，也不内置衣着或活动假设。没有实际信息时，产品建议使用 `met=1.1`、`clo=0.7` 作为全年默认估计；调用方掌握实际活动和衣着时应传入实际值。全部输入须有限，结果只接受 −2 ≤ PMV ≤ 2；无效输入、不收敛或结果超范围返回 `NAN`，不钳制到边界。瞬时计算不表示环境已满足模型的稳态假设，初始化、快速变化及数据可信度由上层处理。

### 2.3 PMV 与 PPD

PMV 为负表示偏冷，为正表示偏热。PPD 为预测不满意人数百分比：

`PPD = 100 − 95 × exp(−0.03353 × PMV⁴ − 0.2179 × PMV²)`。

PMV 为 0 时 PPD 仍为 5%；PPD 不是测量误差或置信度。两个接口均限定 PMV 在 −2～+2，结果不取整，显示格式由界面处理。

### 2.4 冷热提示

标准标尺点为 −3 冷、−2 凉、−1 稍凉、0 中性、+1 稍暖、+2 暖、+3 热。以下连续区间属于产品规则，优先检查模型有效性：

| 有效 PMV 区间 | 提示 | 枚举 |
| --- | --- | --- |
| −2 ≤ PMV < −1.5 | 凉 | `THERMAL_COOL` |
| −1.5 ≤ PMV < −0.5 | 稍凉 | `THERMAL_SLIGHTLY_COOL` |
| −0.5 ≤ PMV ≤ +0.5 | 中性 | `THERMAL_NEUTRAL` |
| +0.5 < PMV ≤ +1.5 | 稍暖 | `THERMAL_SLIGHTLY_WARM` |
| +1.5 < PMV ≤ +2 | 暖 | `THERMAL_WARM` |
| 无效或超出 −2～+2 | 未知 | `THERMAL_UNKNOWN` |

`THERMAL_COLD`、`THERMAL_HOT` 为保留枚举，当前有效范围内不会输出。中性不代表所有人满意或局部不适条件合格。

来源：[ISO 7730:2025](https://www.iso.org/standard/85803.html)、[ASHRAE 七点热感觉标尺（PDF 第 17 页）](https://www.ashrae.org/file%20library/technical%20resources/standards%20and%20guidelines/standards%20addenda/55_2017_d_20200731.pdf#page=17)、[CBE PMV/PPD 参考实现及适用范围](https://github.com/CenterForTheBuiltEnvironment/pythermalcomfort/blob/master/pythermalcomfort/models/pmv_ppd_iso.py)。

### 2.5 独立湿度提示

```c
thermal_humidity_t humidity = thermal_rate_humidity(
    THERMAL_HUMIDITY_UBA, 55.0); /* THERMAL_HUMIDITY_SUITABLE：适宜 */
```

`thermal_rate_humidity(standard, humidity)` 接受 `thermal_humidity_std_t` 和瞬时 %RH，返回 `thermal_humidity_t`。依据由调用方显式传入，不按地区或季节自动选择。默认建议使用 `THERMAL_HUMIDITY_UBA`，全年采用 40%～60% 的适宜范围。

| 依据（枚举前缀 `THERMAL_HUMIDITY_`） | 偏干 DRY | 适宜 SUITABLE | 略湿 SLIGHTLY_HUMID | 偏湿 HUMID |
| --- | --- | --- | --- | --- |
| EPA | RH < 30 | 30 ≤ RH ≤ 50 | 50 < RH < 60 | RH ≥ 60 |
| UBA（默认） | RH < 40 | 40 ≤ RH ≤ 60 | 不使用 | RH > 60 |

仅接受有限的 0～100%（含边界），不修约；非法依据或无效湿度返回 `THERMAL_HUMIDITY_UNKNOWN`。湿度提示不受 PMV 的温度、水蒸气分压力或输出范围限制，两个结果分别计算和展示。EPA 为枚举零值，但调用方仍须明确传入依据。

EPA、UBA 为官方指南，提示名称及分档为产品映射。“适宜”不代表所有人舒适；瞬时偏湿不直接判定霉菌或结露。默认采用 UBA 的 40%～60% 建议范围，不表示 GB/T 18883—2022 符合性评价。

来源：[EPA 湿度指南](https://www.epa.gov/mold/brief-guide-mold-moisture-and-your-home)、[UBA 住宅通风与湿度指南](https://www.umweltbundesamt.de/en/node/3086)、[GB/T 18883—2022 表 1](https://www.gxcdc.org.cn/uploadfile/20231220/1703032288507215.pdf)。

### 2.6 Matter 接入 Guide

**启用 Cluster**

Matter 1.6 的 Air Quality Sensor 设备类型允许在同一 Endpoint 上选配 Temperature Measurement（`0x0402`）和 Relative Humidity Measurement（`0x0405`）两个 Cluster。

**填写测量属性**

以下量程以 SHT40 芯片规格为参考，整机量程较窄时按验证结果调整；PMV 的适用范围不作为测量量程。

| Matter 字段 | 温度 / SHT40 | 相对湿度 / SHT40 |
| --- | --- | --- |
| `MeasuredValue` | `round(temperature × 100)` | `round(humidity × 100)` |
| `MinMeasuredValue` | `-4000`（−40°C） | `0`（0%RH） |
| `MaxMeasuredValue` | `12500`（125°C） | `10000`（100%RH） |
| `Tolerance` | `30` | `300` |

温度编码为有符号整数，湿度为无符号整数；取最近整数，半值远离零，例如 25.12°C → 2512、50.25%RH → 5025。无效实测值填 null。

`Tolerance` 的单位分别为 0.01°C 和 0.01%RH，30、300 表示 ±0.3°C、±3%RH，为本产品选定配置；整机在声明量程内的容差仍待验证。该属性固定、不可为 null，范围为 0～2048；未启用时不加入可选属性列表，不填 0 代替。两个 Cluster 均不提供 `MeasurementUnit`、`MeasurementMedium` 或 `Uncertainty`。

**精度与一致性**

将测量容差、重复性和设备间一致性分开定义；它们不改变评级阈值，也不作为 `thermal_pmv()` 的新增参数。以下 SHT40 数据来自数据手册 v7.3（2026-06），不代表整机已达到同等性能。

| 项目 | 温度 | 相对湿度 | 定义与用途 |
| --- | --- | --- | --- |
| 芯片典型精度 | ±0.2°C | ±1.8%RH | 参考数据手册指定条件与精度曲线，不是全量程最大误差保证 |
| 芯片高精度模式重复性 | 0.04°C | 0.08%RH | 恒定条件下连续读数的 3σ，表示短期噪声；湿度值条件为 25°C、50%RH |
| 整机容差设计目标 | ±0.3°C | ±3%RH | 建议先在 10～30°C、20～80%RH 的室内范围验证，包含外壳、自热、补偿和参考仪器误差预算；尚未实测确认 |
| 对应 Matter `Tolerance` 配置值 | 30 | 300 | 产品选定值，须验证其与整机声明量程一致 |

湿度误差用 %RH 的绝对差表示，例如 50%RH ±3%RH 为 47～53%RH，并非读数的 ±3%。最大允许误差应参考手册的最大误差曲线及整机验证结果，不能把典型精度或重复性直接填入 `Tolerance`。

设备间一致性建议定义为：多台整机处于同一稳定环境、使用相同采样模式和补偿配置时，各台在同一测试窗口内的平均读数最大值减最小值，记为温度差 `temperature_spread`（°C）与湿度差 `humidity_spread`（%RH）。测试应固定位置均匀性、稳定判据、采样间隔和窗口长度；窗口平均仅用于验收，不改变运行时的瞬时评级。

若各台对同一参考值均满足容差目标，任意两台读数差的保守上限为 0.6°C、6%RH；这是推导值，不是厂商一致性规格。一致性须经批量实测，不能替代准确度验证或直接填入 `Tolerance`。

跨平台对比须使用相同输入和湿度依据。SHT40 只提供温湿度，其他 PMV 输入由上层提供；其测量精度不能直接代表 PMV/PPD 的不确定度。

来源：[Sensirion SHT4x 数据手册 v7.3，第 4～7 页及加热说明](https://sensirion.com/media/documents/33FD6951/6A7C10A0/HT_DS_Datasheet_SHT4x_V7.3.pdf)。以上整机目标和一致性定义为产品建议，不是新增的传感器选型要求。

**处理无效数据**

温湿度分别检查有效性、数据新鲜度和整机量程，再转换整数。初始化尚无有效数据、通信失败或数据失效时，用 SDK 的 nullable 类型将对应 `MeasuredValue` 设为 null，不用 0 代替。SHT40 加热期间及尚未恢复环境温度时的读数不作为有效环境测量值。

**更新评级结果**

使用有效温湿度调用本模块接口，在本机界面或厂商扩展中展示 PMV、PPD、冷热和干湿提示。缺少 PMV 必需输入时显示未知；湿度有效时仍可独立计算干湿提示。温度低于 10°C 等情况可导致 PMV 无效，但不影响量程内有效温度的 Matter 上报。

温湿度 Cluster 没有 PMV、PPD、冷热和干湿提示的标准属性，也没有 `LevelValue`；这些结果不写入 `AirQuality`。

来源：[Matter 1.6 设备类型](https://github.com/project-chip/connectedhomeip/blob/master/data_model/1.6/device_types/AirQualitySensor.xml)、[温度 Cluster](https://github.com/project-chip/connectedhomeip/blob/master/data_model/1.6/clusters/TemperatureMeasurement.xml)、[湿度 Cluster](https://github.com/project-chip/connectedhomeip/blob/master/data_model/1.6/clusters/WaterContentMeasurement.xml)。

## 3. 声光

### 3.1 噪声

根目录 `sound_light_rating.h/.c` 包含噪声提示与照度活动参考，两者独立评价。噪声只参考 WHO《社区噪声指南》（1999），无需标准参数，不生成声光综合等级。

接口：`noise_level_t noise_rate(noise_scene_t scene, double noise)`。

```c
/* 包含 sound_light_rating.h 后，在函数内调用。 */
noise_level_t level = noise_rate(NOISE_SLEEP, 32.0); /* 偏吵 */
```

| 产品提示 | 住宅日间及晚间 NOISE_HOME | 睡眠 NOISE_SLEEP | 枚举 |
| --- | --- | --- | --- |
| 安静 | L ≤ 35 | L ≤ 30 | NOISE_QUIET |
| 偏吵 | 35 < L ≤ 45 | 30 < L ≤ 40 | NOISE_NOTICEABLE |
| 嘈杂 | 45 < L ≤ 55 | 40 < L ≤ 50 | NOISE_LOUD |
| 很吵 | L > 55 | L > 50 | NOISE_VERY_LOUD |

输入为经过校准的当前 A 计权 Fast 声级，单位 dB(A)。接受有限的 −200～200 dB(A)，包括负分贝；这是实现的数值工作范围，不是 WHO 限值或硬件量程。非法场景、NaN、无穷大及超出范围返回 NOISE_UNKNOWN。调用方检查实际量程、数据新鲜度和测量有效性；前端负责校准及计权。阈值不修约、不加容差。

WHO 的住宅日间及晚间参考值为 LAeq,16h 35 dB(A)，睡眠参考值为 LAeq,8h 30 dB(A)。本模块仅借用场景参考值制定实时提示，不计算 LAeq 或 LAmax，不进行时段评价；四档和 10 dB 间隔均为产品规则，不是 WHO 官方评级或符合性认证。

来源：[WHO 原指南](https://www.who.int/publications/i/item/a68672)、[WHO 场景参考表](https://iris.who.int/bitstream/handle/10665/326582/9789289013567-eng.pdf?isAllowed=y&sequence=4)。

### 3.2 照度

```c
/* 包含 sound_light_rating.h 后，在函数内调用。 */
illuminance_level_t level = illuminance_rate(120.0); /* 日常活动 */
```

`illuminance_level_t illuminance_rate(double illuminance)` 接收瞬时照度（lx），无需标准或场景参数。仅参考 GB/T 50034—2024 表 5.2.1 的住宅照度值，不与噪声合并。

| 照度 E（lx） | 场景提示 | 返回枚举 | 参考依据 |
| --- | --- | --- | --- |
| 0 ≤ E < 75 | 光线较暗 | ILLUMINANCE_DIM | 低于所选住宅活动最低参考值 |
| 75 ≤ E < 100 | 卧室活动 | ILLUMINANCE_BEDROOM_ACTIVITY | 卧室一般活动 75 lx |
| 100 ≤ E < 150 | 日常活动 | ILLUMINANCE_DAILY_ACTIVITY | 客厅、厨房、卫生间一般活动 100 lx |
| 150 ≤ E < 200 | 用餐 | ILLUMINANCE_DINING | 餐桌面 150 lx |
| 200 ≤ E < 300 | 床头阅读 | ILLUMINANCE_BEDSIDE_READING | 卧室床头、阅读 200 lx |
| E ≥ 300（有限值） | 读写与操作 | ILLUMINANCE_READING_AND_TASKS | 客厅书写、阅读及厨房操作台等 300 lx |
| 无效 | 未知 | ILLUMINANCE_UNKNOWN | 负值、NaN、无穷大 |

阈值不修约、不加容差；边界归入较高档，零值有效。接受所有非负有限 double，不根据数值猜测传感器超量程；上层检查校准、实际量程及数据新鲜度。枚举零值为 Unknown，其余依表顺序排列。

数值来自标准，连续区间及提示名称为产品映射。档位表示逐步达到更多活动的照度参考值，不是互斥用途、房间识别或好坏评级。界面统一使用“照度参考：日常活动”等格式，并说明：“根据住宅照明标准提供活动参考，实际需求因任务和测量位置而异。”

标准值是指定参考平面的维持平均照度：一般活动多为距地面 0.75 m 水平面，用餐为 0.75 m 餐桌面，操作台为台面；阅读、操作台等项目包含一般照明与局部照明组成的混合照明。仪器单点瞬时读数只能作提示，不证明整个区域符合标准，不评价眩光、过亮或睡眠照明。

来源：[GB/T 50034—2024 表 5.2.1，正文第 25～26 页](https://zcsys.ncepu.edu.cn/docs/2025-01/d5c197c2837e4892ac7d02faae298500.pdf#page=34)。

## 4. 代码引用的标准与指南

下表只列出直接用于代码计算方法、阈值、分级或枚举映射的标准、规范和官方指南。中国标准的英文名称采用发布机构名称；国外文件的中文名称为便于阅读所作的译名。

| 编号或机构 | 中文名称 | English name |
| --- | --- | --- |
| Matter 1.6 | Matter 1.6 应用集群规范 | *Matter Application Cluster Specification, Version 1.6* |
| HJ 633—2026 | 环境空气质量指数（AQI）技术规定 | *Technical specifications on ambient air quality index* |
| U.S. EPA | 每日空气质量报告技术援助文件——空气质量指数（AQI） | *Technical Assistance Document for the Reporting of Daily Air Quality – the Air Quality Index (AQI)* |
| EEA | 欧洲空气质量指数 | *European Air Quality Index* |
| UBA 2008 | 室内空气中二氧化碳的健康评价 | *Health evaluation of carbon dioxide in indoor air* |
| WHO 2010 | WHO 室内空气质量指南：特定污染物 | *WHO guidelines for indoor air quality: selected pollutants* |
| GB/T 18883—2022 | 室内空气质量标准 | *Standards for indoor air quality* |
| California OEHHA | 急性、8 小时和慢性参考暴露水平汇总 | *Acute, 8-hour and Chronic Reference Exposure Level (REL) Summary* |
| ISO 7730:2025 | 热环境的人类工效学——使用 PMV、PPD 指数和局部热舒适准则对热舒适进行分析测定与解释 | *Ergonomics of the thermal environment — Analytical determination and interpretation of thermal comfort using calculation of the PMV and PPD indices and local thermal comfort criteria* |
| ANSI/ASHRAE 55-2017 Addendum d | 人员占用建筑空间的热环境条件——增补件 d | *Thermal Environmental Conditions for Human Occupancy — Addendum d* |
| U.S. EPA | 家庭霉菌与潮湿简明指南 | *A Brief Guide to Mold, Moisture and Your Home* |
| UBA | 住宅通风与湿度指南 | *Residential ventilation and humidity guidance* |
| WHO 1999 | 社区噪声指南 | *Guidelines for Community Noise* |
| GB/T 50034—2024 | 建筑照明设计标准 | *Standard for lighting design of buildings* |

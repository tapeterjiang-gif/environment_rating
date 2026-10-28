# 环境指标颜色说明

**Qingping Environmental Colors V1.7｜青萍环境参数标准配色方案**

本文定义 `environment_rating` 的界面颜色规则，适用于设备屏幕、移动端、网页、图表和状态标签。颜色是产品视觉规则，不属于 Matter、ISO、ASHRAE、WHO、EPA、EEA、UBA 或 GB/T 标准的一部分，也不改变任何评级阈值。

## 1. 使用原则

颜色分为两层，不能互相替代：

1. **参数识别色**表示“这是什么数据”，用于参数图标、名称、趋势线和图例，固定不随读数变化。
2. **等级状态色**表示“当前处于什么区间”，用于等级标签、状态圆点、卡片边框和区间背景，随评级结果变化。

同一界面同时展示参数与等级时，参数名称或图标使用识别色。等级标签由状态色、标签背景和标签文字共同构成：状态色用于状态点、边框等强调位置，标签背景用于较大面积的浅色底，标签文字用于保证可读性。只有一个颜色位置时，优先显示等级状态色，并保留参数文字或图标。颜色不能作为唯一信息来源，必须同时显示文字、数值或图标。

参数图标在 Apple 平台使用下表指定的 SF Symbols；Android、Web、Linux 和设备屏幕使用 Material Symbols Rounded。两套图标均着参数识别色，表示参数类型，不随评级改变。Material 图标以实际资源展示；Apple 端通过系统名称加载 SF Symbol。

图表按表达目的选色：只区分参数时使用参数识别色；表达评级分布或区间时使用各状态表中的**图示色**。图示色在视觉明度上介于标签背景与标签文字之间，比背景清楚、比文字柔和，适合柱形图、面积图、仪表填充等较大面积图形。图形上的文字优先放在图形外；必须叠加时，应按实际背景检查对比度。

## 2. 热舒适度

### 参数识别色

| 参数 | Material 图标 | Apple · SF Symbols | Material Symbols Rounded | 色样 | 识别色 | HEX | 浅色背景 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 温度 | ![温度](assets/icons/material/device_thermostat.svg) | `thermometer.medium` | `device_thermostat` | ![#F97316](assets/colors/F97316.svg) | 温暖橙 | `#F97316` | `#FFEDD5` |
| 相对湿度 | ![相对湿度](assets/icons/material/humidity_percentage.svg) | `humidity.fill` | `humidity_percentage` | ![#0891B2](assets/colors/0891B2.svg) | 水润青 | `#0891B2` | `#CFFAFE` |

### PMV 冷热感状态色

项目不按空气温度直接分七档。下表颜色对应 PMV 冷热感；空气温度只是 PMV 的输入之一。

| PMV 冷热感 | 有效区间 | 色样 | 状态色 | 标签背景 | 图示色 | 标签文字 |
| --- | --- | --- | --- | --- | --- | --- |
| Unknown | 无效或超出范围 | ![#64748B](assets/colors/64748B.svg) | `#64748B` | `#F1F5F9` | ![#94A3B8](assets/colors/94A3B8.svg) `#94A3B8` | `#334155` |
| Cold 冷 | −3 ≤ PMV < −2.5 | ![#1D4ED8](assets/colors/1D4ED8.svg) | `#1D4ED8` | `#DBEAFE` | ![#60A5FA](assets/colors/60A5FA.svg) `#60A5FA` | `#1E3A8A` |
| Cool 凉 | −2.5 ≤ PMV < −1.5 | ![#0284C7](assets/colors/0284C7.svg) | `#0284C7` | `#E0F2FE` | ![#38BDF8](assets/colors/38BDF8.svg) `#38BDF8` | `#0C4A6E` |
| SlightlyCool 稍凉 | −1.5 ≤ PMV < −0.5 | ![#0891B2](assets/colors/0891B2.svg) | `#0891B2` | `#CFFAFE` | ![#22D3EE](assets/colors/22D3EE.svg) `#22D3EE` | `#155E75` |
| Neutral 中性 | −0.5 ≤ PMV ≤ +0.5 | ![#16A34A](assets/colors/16A34A.svg) | `#16A34A` | `#DCFCE7` | ![#4ADE80](assets/colors/4ADE80.svg) `#4ADE80` | `#14532D` |
| SlightlyWarm 稍暖 | +0.5 < PMV ≤ +1.5 | ![#CA8A04](assets/colors/CA8A04.svg) | `#CA8A04` | `#FEF9C3` | ![#FACC15](assets/colors/FACC15.svg) `#FACC15` | `#713F12` |
| Warm 暖 | +1.5 < PMV ≤ +2.5 | ![#EA580C](assets/colors/EA580C.svg) | `#EA580C` | `#FFEDD5` | ![#FB923C](assets/colors/FB923C.svg) `#FB923C` | `#7C2D12` |
| Hot 热 | +2.5 < PMV ≤ +3 | ![#DC2626](assets/colors/DC2626.svg) | `#DC2626` | `#FEE2E2` | ![#F87171](assets/colors/F87171.svg) `#F87171` | `#7F1D1D` |

温度趋势线仍使用温度识别色 `#F97316`；冷热感标签或 PMV 区间背景使用本表颜色。

### 相对湿度状态色

EPA 与 UBA 的阈值不同，但相同提示使用相同颜色；UBA 不产生 SlightlyHumid。

| 湿度提示 | 色样 | 状态色 | 标签背景 | 图示色 | 标签文字 |
| --- | --- | --- | --- | --- | --- |
| Unknown | ![#64748B](assets/colors/64748B.svg) | `#64748B` | `#F1F5F9` | ![#94A3B8](assets/colors/94A3B8.svg) `#94A3B8` | `#334155` |
| Dry 偏干 | ![#D97706](assets/colors/D97706.svg) | `#D97706` | `#FEF3C7` | ![#FBBF24](assets/colors/FBBF24.svg) `#FBBF24` | `#78350F` |
| Suitable 适宜 | ![#16A34A](assets/colors/16A34A.svg) | `#16A34A` | `#DCFCE7` | ![#4ADE80](assets/colors/4ADE80.svg) `#4ADE80` | `#14532D` |
| SlightlyHumid 略湿 | ![#0284C7](assets/colors/0284C7.svg) | `#0284C7` | `#E0F2FE` | ![#38BDF8](assets/colors/38BDF8.svg) `#38BDF8` | `#0C4A6E` |
| Humid 偏湿 | ![#1D4ED8](assets/colors/1D4ED8.svg) | `#1D4ED8` | `#DBEAFE` | ![#60A5FA](assets/colors/60A5FA.svg) `#60A5FA` | `#1E3A8A` |

## 3. 空气质量

### 参数识别色

| 参数 | Material 图标 | Apple · SF Symbols | Material Symbols Rounded | 色样 | 识别色 | HEX | 浅色背景 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CO₂ | ![CO₂](assets/icons/material/co2.svg) | `carbon.dioxide.cloud` | `co2` | ![#15803D](assets/colors/15803D.svg) | 森林绿 | `#15803D` | `#DCFCE7` |
| PM2.5 | ![PM2.5](assets/icons/material/blur_on.svg) | `aqi.medium` | `blur_on` | ![#667A83](assets/colors/667A83.svg) | 雾霾灰蓝 | `#667A83` | `#E8EEF0` |
| PM10 | ![PM10](assets/icons/material/blur_on.svg) | `aqi.medium` | `blur_on` | ![#9A7958](assets/colors/9A7958.svg) | 沙尘灰棕 | `#9A7958` | `#F1EBE4` |
| 甲醛 HCHO | ![甲醛](assets/icons/material/science.svg) | `atom` | `science` | ![#DB2777](assets/colors/DB2777.svg) | 警觉玫红 | `#DB2777` | `#FCE7F3` |
| TVOC 指数 | ![TVOC 指数](assets/icons/material/speed.svg) | `speedometer` | `speed` | ![#89941A](assets/colors/89941A.svg) | 挥发黄绿 | `#89941A` | `#F1F5D5` |

PM2.5 与 PM10 在 Apple 端共用 `aqi.medium`，在其他平台共用 `blur_on`，通过名称和识别色区分；两种识别色采用相近的低饱和自然色系，分别联想到雾霾与沙尘。TVOC 当前只定义参数识别色，项目尚未为其定义评级状态色。

### CO₂ 状态色

参考德国 UBA 2008 室内 CO₂ 指导值，浓度单位为 ppm。

| 状态 | 浓度 C | 色样 | 状态色 | 标签背景 | 图示色 | 标签文字 |
| --- | --- | --- | --- | --- | --- | --- |
| 好 Good | 0 ≤ C < 1000 | ![#16A34A](assets/colors/16A34A.svg) | `#16A34A` | `#DCFCE7` | ![#4ADE80](assets/colors/4ADE80.svg) `#4ADE80` | `#14532D` |
| 中等 Moderate | 1000 ≤ C ≤ 2000 | ![#65A30D](assets/colors/65A30D.svg) | `#65A30D` | `#ECFCCB` | ![#A3E635](assets/colors/A3E635.svg) `#A3E635` | `#365314` |
| 差 Poor | C > 2000 | ![#EA580C](assets/colors/EA580C.svg) | `#EA580C` | `#FFEDD5` | ![#FB923C](assets/colors/FB923C.svg) `#FB923C` | `#7C2D12` |

CO₂ 的 Moderate 保留原评级名称，但采用与 PM“尚可”相同的黄绿色，表达需要留意通风、尚未进入较差状态。

### PM2.5 状态色

浓度单位为 μg/m³。EEA 使用原始浓度；HJ 使用修约后的整数；EPA 使用截断至一位小数的浓度。

| 状态 | 色样与状态色 | 标签背景 | 图示色 | 标签文字 | EEA（默认） | HJ 633—2026 | EPA AQI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 好 Good | ![#16A34A](assets/colors/16A34A.svg) `#16A34A` | `#DCFCE7` | ![#4ADE80](assets/colors/4ADE80.svg) `#4ADE80` | `#14532D` | 0–5 | 0–35 | 0.0–9.0 |
| 尚可 Fair | ![#65A30D](assets/colors/65A30D.svg) `#65A30D` | `#ECFCCB` | ![#A3E635](assets/colors/A3E635.svg) `#A3E635` | `#365314` | >5–15 | 36–60 | 9.1–35.4 |
| 中等 Moderate | ![#CA8A04](assets/colors/CA8A04.svg) `#CA8A04` | `#FEF9C3` | ![#FACC15](assets/colors/FACC15.svg) `#FACC15` | `#713F12` | >15–50 | 61–115 | 35.5–55.4 |
| 差 Poor | ![#EA580C](assets/colors/EA580C.svg) `#EA580C` | `#FFEDD5` | ![#FB923C](assets/colors/FB923C.svg) `#FB923C` | `#7C2D12` | >50–90 | 116–150 | 55.5–125.4 |
| 很差 VeryPoor | ![#DC2626](assets/colors/DC2626.svg) `#DC2626` | `#FEE2E2` | ![#F87171](assets/colors/F87171.svg) `#F87171` | `#7F1D1D` | >90–140 | 151–250 | 125.5–225.4 |
| 极差 ExtremelyPoor | ![#7E22CE](assets/colors/7E22CE.svg) `#7E22CE` | `#F3E8FF` | ![#C084FC](assets/colors/C084FC.svg) `#C084FC` | `#581C87` | >140 | ≥251 | ≥225.5 |

### PM10 状态色

浓度单位为 μg/m³。EEA 使用原始浓度；HJ 和 EPA 使用处理后的整数浓度。

| 状态 | 色样与状态色 | 标签背景 | 图示色 | 标签文字 | EEA（默认） | HJ 633—2026 | EPA AQI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 好 Good | ![#16A34A](assets/colors/16A34A.svg) `#16A34A` | `#DCFCE7` | ![#4ADE80](assets/colors/4ADE80.svg) `#4ADE80` | `#14532D` | 0–15 | 0–50 | 0–54 |
| 尚可 Fair | ![#65A30D](assets/colors/65A30D.svg) `#65A30D` | `#ECFCCB` | ![#A3E635](assets/colors/A3E635.svg) `#A3E635` | `#365314` | >15–45 | 51–120 | 55–154 |
| 中等 Moderate | ![#CA8A04](assets/colors/CA8A04.svg) `#CA8A04` | `#FEF9C3` | ![#FACC15](assets/colors/FACC15.svg) `#FACC15` | `#713F12` | >45–120 | 121–250 | 155–254 |
| 差 Poor | ![#EA580C](assets/colors/EA580C.svg) `#EA580C` | `#FFEDD5` | ![#FB923C](assets/colors/FB923C.svg) `#FB923C` | `#7C2D12` | >120–195 | 251–350 | 255–354 |
| 很差 VeryPoor | ![#DC2626](assets/colors/DC2626.svg) `#DC2626` | `#FEE2E2` | ![#F87171](assets/colors/F87171.svg) `#F87171` | `#7F1D1D` | >195–270 | 351–420 | 355–424 |
| 极差 ExtremelyPoor | ![#7E22CE](assets/colors/7E22CE.svg) `#7E22CE` | `#F3E8FF` | ![#C084FC](assets/colors/C084FC.svg) `#C084FC` | `#581C87` | >270 | ≥421 | ≥425 |

### 甲醛 HCHO 状态色

浓度单位为 mg/m³。WHO、GB/T 和 OEHHA 提供不同参考浓度，项目按各自参考值划分六档。

| 状态 | 色样与状态色 | 标签背景 | 图示色 | 标签文字 | WHO 2010（默认） | GB/T 18883—2022 | OEHHA 2008 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 好 Good | ![#16A34A](assets/colors/16A34A.svg) `#16A34A` | `#DCFCE7` | ![#4ADE80](assets/colors/4ADE80.svg) `#4ADE80` | `#14532D` | 0–0.025 | 0–0.020 | 0–0.01375 |
| 尚可 Fair | ![#65A30D](assets/colors/65A30D.svg) `#65A30D` | `#ECFCCB` | ![#A3E635](assets/colors/A3E635.svg) `#A3E635` | `#365314` | >0.025–0.050 | >0.020–0.040 | >0.01375–0.0275 |
| 中等 Moderate | ![#CA8A04](assets/colors/CA8A04.svg) `#CA8A04` | `#FEF9C3` | ![#FACC15](assets/colors/FACC15.svg) `#FACC15` | `#713F12` | >0.050–0.100 | >0.040–0.080 | >0.0275–0.055 |
| 差 Poor | ![#EA580C](assets/colors/EA580C.svg) `#EA580C` | `#FFEDD5` | ![#FB923C](assets/colors/FB923C.svg) `#FB923C` | `#7C2D12` | >0.100–0.200 | >0.080–0.160 | >0.055–0.110 |
| 很差 VeryPoor | ![#DC2626](assets/colors/DC2626.svg) `#DC2626` | `#FEE2E2` | ![#F87171](assets/colors/F87171.svg) `#F87171` | `#7F1D1D` | >0.200–0.500 | >0.160–0.400 | >0.110–0.275 |
| 极差 ExtremelyPoor | ![#7E22CE](assets/colors/7E22CE.svg) `#7E22CE` | `#F3E8FF` | ![#C084FC](assets/colors/C084FC.svg) `#C084FC` | `#581C87` | >0.500 | >0.400 | >0.275 |

状态未知时统一使用灰色 `#64748B`、浅色背景 `#F1F5F9`、标签文字 `#334155`。各表中的连续区间、修约和截断规则与 [环境评级标准](rating.md) 一致；颜色不是上述标准规定的官方颜色。

## 4. 声光环境

### 参数识别色

| 参数 | Material 图标 | Apple · SF Symbols | Material Symbols Rounded | 色样 | 识别色 | HEX | 浅色背景 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 噪声 | ![噪声](assets/icons/material/graphic_eq.svg) | `waveform` | `graphic_eq` | ![#9333EA](assets/colors/9333EA.svg) | 声波紫 | `#9333EA` | `#F3E8FF` |
| 光照 / 照度 | ![照度](assets/icons/material/light_mode.svg) | `sun.max` | `light_mode` | ![#F2C94C](assets/colors/F2C94C.svg) | 阳光金 | `#F2C94C` | `#FEF9C3` |

### 噪声状态色

住宅与睡眠场景的数值边界不同，但相同提示使用相同颜色。

| 噪声提示 | 色样 | 状态色 | 标签背景 | 图示色 | 标签文字 |
| --- | --- | --- | --- | --- | --- |
| Unknown | ![#64748B](assets/colors/64748B.svg) | `#64748B` | `#F1F5F9` | ![#94A3B8](assets/colors/94A3B8.svg) `#94A3B8` | `#334155` |
| Quiet 安静 | ![#16A34A](assets/colors/16A34A.svg) | `#16A34A` | `#DCFCE7` | ![#4ADE80](assets/colors/4ADE80.svg) `#4ADE80` | `#14532D` |
| Noticeable 偏吵 | ![#CA8A04](assets/colors/CA8A04.svg) | `#CA8A04` | `#FEF9C3` | ![#FACC15](assets/colors/FACC15.svg) `#FACC15` | `#713F12` |
| Loud 嘈杂 | ![#EA580C](assets/colors/EA580C.svg) | `#EA580C` | `#FFEDD5` | ![#FB923C](assets/colors/FB923C.svg) `#FB923C` | `#7C2D12` |
| VeryLoud 很吵 | ![#DC2626](assets/colors/DC2626.svg) | `#DC2626` | `#FEE2E2` | ![#F87171](assets/colors/F87171.svg) `#F87171` | `#7F1D1D` |

### 照度状态色

照度颜色表达从暗到亮以及对应活动提示，不表示从好到坏。当前算法没有过亮评级。

| 照度提示 | 有效区间 | 色样 | 状态色 | 标签背景 | 图示色 | 标签文字 |
| --- | --- | --- | --- | --- | --- | --- |
| Unknown | 无效输入 | ![#64748B](assets/colors/64748B.svg) | `#64748B` | `#F1F5F9` | ![#94A3B8](assets/colors/94A3B8.svg) `#94A3B8` | `#334155` |
| LowLight 低照环境 | 0 ≤ E < 53.819552… lx | ![#475569](assets/colors/475569.svg) | `#475569` | `#E2E8F0` | ![#94A3B8](assets/colors/94A3B8.svg) `#94A3B8` | `#1E293B` |
| Ambient 氛围照明 | 53.819552… ≤ E < 107.639104… lx | ![#6366F1](assets/colors/6366F1.svg) | `#6366F1` | `#E0E7FF` | ![#818CF8](assets/colors/818CF8.svg) `#818CF8` | `#3730A3` |
| DailyActivity 日常活动 | 107.639104… ≤ E < 215.278208… lx | ![#0284C7](assets/colors/0284C7.svg) | `#0284C7` | `#E0F2FE` | ![#38BDF8](assets/colors/38BDF8.svg) `#38BDF8` | `#0C4A6E` |
| Reading 阅读学习 | 215.278208… ≤ E < 322.917313… lx | ![#0D9488](assets/colors/0D9488.svg) | `#0D9488` | `#CCFBF1` | ![#2DD4BF](assets/colors/2DD4BF.svg) `#2DD4BF` | `#134E4A` |
| FocusedActivity 专注活动 | 322.917313… ≤ E < 538.195521… lx | ![#D97706](assets/colors/D97706.svg) | `#D97706` | `#FEF3C7` | ![#FBBF24](assets/colors/FBBF24.svg) `#FBBF24` | `#78350F` |
| DetailWork 精细作业 | E ≥ 538.195521… lx | ![#CA8A04](assets/colors/CA8A04.svg) | `#CA8A04` | `#FEF9C3` | ![#FACC15](assets/colors/FACC15.svg) `#FACC15` | `#713F12` |

## 5. 组合展示示例

| 数据 | 参数识别部分 | 等级状态部分 | 图示色 |
| --- | --- | --- | --- |
| PM2.5，评级为 Fair | 图标和趋势线使用雾霾灰蓝 `#667A83` | 等级标签使用黄绿色 `#65A30D` | ![#A3E635](assets/colors/A3E635.svg) `#A3E635` |
| 温度对应 PMV=+2.0 | 温度图标和趋势线使用温暖橙 `#F97316` | Warm 标签使用深橙色 `#EA580C` | ![#FB923C](assets/colors/FB923C.svg) `#FB923C` |
| 噪声=Loud | 噪声图标和趋势线使用声波紫 `#9333EA` | Loud 标签使用橙色 `#EA580C` | ![#FB923C](assets/colors/FB923C.svg) `#FB923C` |
| 照度=DetailWork | 照度图标使用阳光金 `#F2C94C` | 活动提示标签使用等级表中的金色 `#CA8A04` | ![#FACC15](assets/colors/FACC15.svg) `#FACC15` |

## 6. 可访问性与实现要求

- 标签优先使用“标签背景 + 标签文字”的组合，不在黄色、黄绿色等亮色上直接使用白字。
- 趋势图同时使用图例、线型或数据点形状，避免仅靠颜色区分多条曲线。柱形图同时显示坐标、数值或类别标签；图示色不作为文字色使用。
- Unknown 始终使用灰色，不沿用最后一次有效状态的颜色。
- 浅色界面使用表中的标签背景和标签文字。深色界面可在 `#0F172A` 背景上用代表色的 20% 透明填充，文字使用 `#F8FAFC`，边框和图标使用不透明代表色。
- 动画或闪烁不能作为严重等级的默认效果；需要吸引注意时使用静态图标和明确文字。
- 业务代码应依据返回枚举选择颜色，不复制浓度或 PMV 阈值，防止界面规则与评级库不一致。

## 7. 代码调用

根目录的 `environment_color.h/.c` 是各平台共用的颜色数据源。颜色采用 `0x00RRGGBB`：`ENV_COLOR_PRIMARY` 表示参数识别色或状态色，`ENV_COLOR_BACKGROUND` 表示浅色背景，`ENV_COLOR_GRAPHIC` 表示图示色，`ENV_COLOR_TEXT` 表示标签文字。参数识别色只支持前两个角色；非法参数、非法角色或不支持的组合返回 `ENV_RGB_INVALID`。

```c
air_quality_t quality = air_rate_pm25(AIR_PM_EEA_AQI_2024, pm25);

env_rgb_t identity = env_color_parameter(ENV_PARAM_PM25,
                                         ENV_COLOR_PRIMARY);
env_rgb_t label = env_color_air(ENV_PARAM_PM25, quality,
                                ENV_COLOR_PRIMARY);
env_rgb_t graphic = env_color_air(ENV_PARAM_PM25, quality,
                                  ENV_COLOR_GRAPHIC);
```

各状态函数接收已经计算好的评级枚举，不接收原始测量值，也不重复评级阈值。`env_color_air()` 仅处理 CO₂、PM2.5、PM10 和甲醛的单项 `air_quality_t`；不处理整体空气质量、TVOC 指数或 Matter `LevelValue`。温度状态色应把 `thermal_rate()` 返回值传给 `env_color_thermal()`，相对湿度、噪声和照度同理。

Swift 使用 `EnvironmentColors`，返回 `RGBColor`、`ParameterColors` 或 `StateColors`；`RGBColor` 提供 `rawValue`、RGB 分量和 `hex`。Web 使用 `rating.colors`，直接返回 CSS HEX 字符串。不支持的 Swift/Web 组合返回 `nil`/`null`。

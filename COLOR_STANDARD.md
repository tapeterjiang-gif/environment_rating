# 环境评级颜色标准

本文定义 `environment_rating` 的界面颜色规则，适用于设备屏幕、移动端、网页、图表和状态标签。颜色是产品视觉规则，不属于 Matter、ISO、ASHRAE、WHO、EPA、EEA、UBA 或 GB/T 标准的一部分，也不改变任何评级阈值。

## 1. 使用原则

颜色分为两层，不能互相替代：

1. **参数识别色**表示“这是什么数据”，用于参数图标、名称、趋势线和图例。例如温度、PM2.5、噪声使用不同识别色。
2. **等级状态色**表示“当前处于什么区间”，用于等级标签、状态圆点、卡片边框和区间背景。例如 PM2.5 的 Good 与 Poor 使用不同状态色。

同一界面同时展示参数与等级时，参数名称或图标使用识别色，等级标签使用状态色。只有一个颜色位置时，优先显示等级状态色，并保留参数文字或图标。

## 2. 参数识别色

识别色不随测量值变化。趋势图的主线、参数图标和图例应固定使用下表颜色。

| 参数 | 色样 | 识别色 | HEX | 浅色背景 | 建议用途 |
| --- | --- | --- | --- | --- | --- |
| 整体空气质量 | ![#0F766E](assets/colors/0F766E.svg) | 青绿 | `#0F766E` | `#CCFBF1` | 整体 AirQuality 卡片标题、图标 |
| CO₂ | ![#2563EB](assets/colors/2563EB.svg) | 蓝色 | `#2563EB` | `#DBEAFE` | CO₂ 图标、趋势线 |
| PM2.5 | ![#7C3AED](assets/colors/7C3AED.svg) | 紫色 | `#7C3AED` | `#EDE9FE` | PM2.5 图标、趋势线 |
| PM10 | ![#B45309](assets/colors/B45309.svg) | 棕橙色 | `#B45309` | `#FFEDD5` | PM10 图标、趋势线 |
| 甲醛 HCHO | ![#DB2777](assets/colors/DB2777.svg) | 品红色 | `#DB2777` | `#FCE7F3` | 甲醛图标、趋势线 |
| 温度 / PMV | ![#E11D48](assets/colors/E11D48.svg) | 玫红色 | `#E11D48` | `#FFE4E6` | 温度与 PMV 图标、趋势线 |
| 相对湿度 | ![#0891B2](assets/colors/0891B2.svg) | 青色 | `#0891B2` | `#CFFAFE` | 湿度图标、趋势线 |
| 噪声 | ![#4F46E5](assets/colors/4F46E5.svg) | 靛蓝色 | `#4F46E5` | `#E0E7FF` | 噪声图标、趋势线 |
| 照度 | ![#CA8A04](assets/colors/CA8A04.svg) | 金色 | `#CA8A04` | `#FEF9C3` | 照度图标、趋势线 |

PM2.5 与 PM10 必须保持不同识别色。采用不同 PM 或甲醛标准时，只改变数值边界，不改变参数识别色。

## 3. 空气质量状态色

### 3.1 Matter AirQuality 六档

当界面展示 `air_quality_t` 或 Matter `AirQuality` 时使用六档颜色。整体空气质量和 CO₂、PM2.5、PM10、甲醛的单项 AirQuality 共用此表。

| AirQuality | 色样 | 代表色 | HEX | 标签背景 | 标签文字 |
| --- | --- | --- | --- | --- | --- |
| Unknown | ![#64748B](assets/colors/64748B.svg) | 灰色 | `#64748B` | `#F1F5F9` | `#334155` |
| Good | ![#16A34A](assets/colors/16A34A.svg) | 绿色 | `#16A34A` | `#DCFCE7` | `#14532D` |
| Fair | ![#65A30D](assets/colors/65A30D.svg) | 黄绿色 | `#65A30D` | `#ECFCCB` | `#365314` |
| Moderate | ![#CA8A04](assets/colors/CA8A04.svg) | 黄色 | `#CA8A04` | `#FEF9C3` | `#713F12` |
| Poor | ![#EA580C](assets/colors/EA580C.svg) | 橙色 | `#EA580C` | `#FFEDD5` | `#7C2D12` |
| VeryPoor | ![#DC2626](assets/colors/DC2626.svg) | 红色 | `#DC2626` | `#FEE2E2` | `#7F1D1D` |
| ExtremelyPoor | ![#7E22CE](assets/colors/7E22CE.svg) | 紫红色 | `#7E22CE` | `#F3E8FF` | `#581C87` |

### 3.2 Matter LevelValue 四档

当界面展示浓度 Cluster 的 `LevelValue` 时使用四档颜色。颜色必须以 `air_level_*()` 的实际返回值为准，不应由浓度在界面端重新计算。

| LevelValue | 色样 | 代表色 | HEX | 标签背景 | 标签文字 |
| --- | --- | --- | --- | --- | --- |
| Unknown | ![#64748B](assets/colors/64748B.svg) | 灰色 | `#64748B` | `#F1F5F9` | `#334155` |
| Low | ![#16A34A](assets/colors/16A34A.svg) | 绿色 | `#16A34A` | `#DCFCE7` | `#14532D` |
| Medium | ![#CA8A04](assets/colors/CA8A04.svg) | 黄色 | `#CA8A04` | `#FEF9C3` | `#713F12` |
| High | ![#DC2626](assets/colors/DC2626.svg) | 红色 | `#DC2626` | `#FEE2E2` | `#7F1D1D` |
| Critical | ![#7E22CE](assets/colors/7E22CE.svg) | 紫红色 | `#7E22CE` | `#F3E8FF` | `#581C87` |

PM 与甲醛当前均为 Good/Fair → Low、Moderate → Medium、Poor/VeryPoor → High、ExtremelyPoor → Critical。CO₂为 Good → Low、Moderate → Medium、Poor → High。

## 4. 热舒适度状态色

### 4.1 PMV 七档冷热感

项目没有按空气温度直接分七档。下表颜色对应 `thermal_rate()` 返回的 PMV 冷热感；空气温度只是 PMV 的输入之一。

| PMV 冷热感 | 有效区间 | 色样 | 代表色 | HEX | 标签背景 | 标签文字 |
| --- | --- | --- | --- | --- | --- | --- |
| Unknown | 无效或超出范围 | ![#64748B](assets/colors/64748B.svg) | 灰色 | `#64748B` | `#F1F5F9` | `#334155` |
| Cold 冷 | −3 ≤ PMV < −2.5 | ![#1D4ED8](assets/colors/1D4ED8.svg) | 深蓝色 | `#1D4ED8` | `#DBEAFE` | `#1E3A8A` |
| Cool 凉 | −2.5 ≤ PMV < −1.5 | ![#0284C7](assets/colors/0284C7.svg) | 蓝色 | `#0284C7` | `#E0F2FE` | `#0C4A6E` |
| SlightlyCool 稍凉 | −1.5 ≤ PMV < −0.5 | ![#0891B2](assets/colors/0891B2.svg) | 青色 | `#0891B2` | `#CFFAFE` | `#155E75` |
| Neutral 中性 | −0.5 ≤ PMV ≤ +0.5 | ![#16A34A](assets/colors/16A34A.svg) | 绿色 | `#16A34A` | `#DCFCE7` | `#14532D` |
| SlightlyWarm 稍暖 | +0.5 < PMV ≤ +1.5 | ![#CA8A04](assets/colors/CA8A04.svg) | 黄色 | `#CA8A04` | `#FEF9C3` | `#713F12` |
| Warm 暖 | +1.5 < PMV ≤ +2.5 | ![#EA580C](assets/colors/EA580C.svg) | 橙色 | `#EA580C` | `#FFEDD5` | `#7C2D12` |
| Hot 热 | +2.5 < PMV ≤ +3 | ![#DC2626](assets/colors/DC2626.svg) | 红色 | `#DC2626` | `#FEE2E2` | `#7F1D1D` |

温度趋势线仍使用温度识别色 `#E11D48`；只有冷热感标签或 PMV 区间背景使用本表颜色。

### 4.2 相对湿度提示

EPA 与 UBA 的阈值不同，但相同的返回枚举使用相同颜色。UBA 不产生 SlightlyHumid。

| 湿度提示 | 色样 | 代表色 | HEX | 标签背景 | 标签文字 |
| --- | --- | --- | --- | --- | --- |
| Unknown | ![#64748B](assets/colors/64748B.svg) | 灰色 | `#64748B` | `#F1F5F9` | `#334155` |
| Dry 偏干 | ![#D97706](assets/colors/D97706.svg) | 琥珀色 | `#D97706` | `#FEF3C7` | `#78350F` |
| Suitable 适宜 | ![#16A34A](assets/colors/16A34A.svg) | 绿色 | `#16A34A` | `#DCFCE7` | `#14532D` |
| SlightlyHumid 略湿 | ![#0284C7](assets/colors/0284C7.svg) | 天蓝色 | `#0284C7` | `#E0F2FE` | `#0C4A6E` |
| Humid 偏湿 | ![#1D4ED8](assets/colors/1D4ED8.svg) | 深蓝色 | `#1D4ED8` | `#DBEAFE` | `#1E3A8A` |

## 5. 声光状态色

### 5.1 噪声四档

住宅与睡眠场景的数值边界不同，但相同的 `noise_level_t` 使用相同颜色。

| 噪声提示 | 色样 | 代表色 | HEX | 标签背景 | 标签文字 |
| --- | --- | --- | --- | --- | --- |
| Unknown | ![#64748B](assets/colors/64748B.svg) | 灰色 | `#64748B` | `#F1F5F9` | `#334155` |
| Quiet 安静 | ![#16A34A](assets/colors/16A34A.svg) | 绿色 | `#16A34A` | `#DCFCE7` | `#14532D` |
| Noticeable 偏吵 | ![#CA8A04](assets/colors/CA8A04.svg) | 黄色 | `#CA8A04` | `#FEF9C3` | `#713F12` |
| Loud 嘈杂 | ![#EA580C](assets/colors/EA580C.svg) | 橙色 | `#EA580C` | `#FFEDD5` | `#7C2D12` |
| VeryLoud 很吵 | ![#DC2626](assets/colors/DC2626.svg) | 红色 | `#DC2626` | `#FEE2E2` | `#7F1D1D` |

### 5.2 照度六档

照度颜色表达从暗到亮以及对应活动提示，不表示从好到坏。不能用红色表达高照度告警，因为当前算法没有过亮评级。

| 照度提示 | 有效区间 | 色样 | 代表色 | HEX | 标签背景 | 标签文字 |
| --- | --- | --- | --- | --- | --- | --- |
| Unknown | 无效输入 | ![#64748B](assets/colors/64748B.svg) | 灰色 | `#64748B` | `#F1F5F9` | `#334155` |
| Dim 光线较暗 | 0 ≤ E < 75 lx | ![#475569](assets/colors/475569.svg) | 深灰蓝色 | `#475569` | `#E2E8F0` | `#1E293B` |
| BedroomActivity 卧室活动 | 75 ≤ E < 100 lx | ![#6366F1](assets/colors/6366F1.svg) | 靛紫色 | `#6366F1` | `#E0E7FF` | `#3730A3` |
| DailyActivity 日常活动 | 100 ≤ E < 150 lx | ![#0284C7](assets/colors/0284C7.svg) | 天蓝色 | `#0284C7` | `#E0F2FE` | `#0C4A6E` |
| Dining 用餐 | 150 ≤ E < 200 lx | ![#0D9488](assets/colors/0D9488.svg) | 青绿色 | `#0D9488` | `#CCFBF1` | `#134E4A` |
| BedsideReading 床头阅读 | 200 ≤ E < 300 lx | ![#D97706](assets/colors/D97706.svg) | 琥珀色 | `#D97706` | `#FEF3C7` | `#78350F` |
| ReadingAndTasks 读写与操作 | E ≥ 300 lx | ![#CA8A04](assets/colors/CA8A04.svg) | 金色 | `#CA8A04` | `#FEF9C3` | `#713F12` |

## 6. 组合展示示例

| 数据 | 参数识别部分 | 等级状态部分 |
| --- | --- | --- |
| PM2.5，AirQuality=Fair | 图标和趋势线使用紫色 `#7C3AED` | AirQuality 标签使用黄绿色 `#65A30D`；若展示 LevelValue=Low，则标签使用绿色 `#16A34A` |
| 温度对应 PMV=+2.0 | 温度图标和趋势线使用玫红色 `#E11D48` | Warm 标签使用橙色 `#EA580C` |
| 噪声=Loud | 噪声图标和趋势线使用靛蓝色 `#4F46E5` | Loud 标签使用橙色 `#EA580C` |
| 照度=ReadingAndTasks | 照度图标使用金色 `#CA8A04` | 活动提示标签使用金色 `#CA8A04`，文字说明“读写与操作” |

## 7. 可访问性与实现要求

- 颜色不能作为唯一信息来源；必须同时显示等级文字、数值或图标。
- 标签优先使用“标签背景 + 标签文字”的组合，不在黄色、黄绿色等亮色上直接使用白字。
- 趋势图同时使用图例、线型或数据点形状，避免仅靠颜色区分多条曲线。
- Unknown 始终使用灰色，不沿用最后一次有效状态的颜色。
- 浅色界面使用表中的标签背景和标签文字。深色界面可在 `#0F172A` 背景上用代表色的 20% 透明填充，文字使用 `#F8FAFC`，边框和图标使用不透明代表色。
- 动画或闪烁不能作为 Critical 的默认效果；需要吸引注意时使用静态图标和明确文字，避免持续闪烁。
- 业务代码应依据返回枚举选择颜色，不复制浓度或 PMV 阈值，防止界面规则与评级库不一致。

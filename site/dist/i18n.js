(() => {
  const EN = {
    "环境评级指南": "Environmental Rating Guide",
    "跳到主要内容": "Skip to main content",
    "主导航": "Main navigation",
    "语言": "Language",
    "选择语言": "Choose language",
    "热舒适度": "Thermal Comfort",
    "空气质量": "Air Quality",
    "声光环境": "Sound & Light",
    "评级依据": "Rating References",
    "国际标准化组织（ISO）": "International Organization for Standardization (ISO)",
    "美国采暖、制冷与空调工程师学会（ASHRAE）": "American Society of Heating, Refrigerating and Air-Conditioning Engineers (ASHRAE)",
    "美国环境保护署（EPA）": "U.S. Environmental Protection Agency (EPA)",
    "德国联邦环境署（UBA）": "German Environment Agency (UBA)",
    "欧洲环境署（EEA）": "European Environment Agency (EEA)",
    "中华人民共和国生态环境部": "Ministry of Ecology and Environment of the People's Republic of China",
    "世界卫生组织（WHO）": "World Health Organization (WHO)",
    "国家市场监督管理总局、国家标准化管理委员会": "State Administration for Market Regulation and Standardization Administration of China",
    "加利福尼亚州环境健康危害评估办公室（OEHHA）": "California Office of Environmental Health Hazard Assessment (OEHHA)",
    "美国照明工程学会（IES）、美国照明协会（ALA）": "Illuminating Engineering Society (IES) and American Lighting Association (ALA)",
    "看懂你身边的环境": "Understand Your Environment",
    "传感器给出数字，环境评级把数字转成容易理解的提示。这一页集中说明每项指标如何判断、颜色如何变化，以及结果应该怎样阅读。": "Sensors provide numbers. Environmental ratings turn them into clear, useful guidance. This page explains how each metric is assessed, how its colors change, and how to read the result.",
    "先看评级方法": "How ratings work",
    "颜色怎样读": "How to read colors",
    "环境数据由多个指标共同组成的示意图": "Diagram showing that environmental conditions consist of multiple metrics",
    "冷热感 · 湿度": "Thermal sensation · Humidity",
    "颗粒物 · CO₂ · 甲醛": "Particles · CO₂ · Formaldehyde",
    "噪声 · 照度": "Noise · Illuminance",
    "如何工作": "How it works",
    "从测量值到一句有用的提示": "From a measurement to useful guidance",
    "每个指标先按自己的单位和标准独立判断。只有空气质量会生成一个整体结果，热舒适度和声光则保留各自提示。": "Each metric is assessed independently using its own unit and reference. Only air quality produces an overall result; thermal comfort, sound, and light keep their separate guidance.",
    "分别评价": "Assess separately",
    "PM2.5、CO₂、冷热感等指标各走各的规则，不把不同单位的数值直接相加。": "PM2.5, CO₂, thermal sensation, and other metrics each follow their own rules. Values with different units are never added together.",
    "关注最差一项": "Highlight the worst result",
    "整体空气质量取当前有效指标中最需要关注的一项，让问题不会被平均值掩盖。": "Overall air quality uses the valid metric that needs the most attention, so a problem is not hidden by an average.",
    "缺失就跳过": "Skip missing data",
    "传感器未就绪或数据不可信时，该指标显示未知，也不会拉高或拉低整体结果。": "When a sensor is not ready or its data is unreliable, that metric is shown as unknown and does not affect the overall result.",
    "读数口径：": "Reading basis:",
    "评级使用按所选标准测得的结果。标准规定平均时间时，设备先在对应时间窗口内采样并计算平均值，再将结果用于评级；未规定平均时间的指标按该标准的测量方法处理。": "Ratings use results measured according to the selected reference. When an averaging period is specified, the device samples and calculates the average over that time window before rating; metrics without a specified averaging period follow the reference's measurement method.",
    "图标与颜色": "Icons & Colors",
    "先认出指标，再判断状态": "Identify the metric, then read its status",
    "每项指标使用固定图标和识别色；评级结果再使用状态色。两种颜色各自表达一层信息，不会混在一起。": "Each metric has a fixed icon and identity color. The rating adds a separate status color. Each color carries one clear layer of meaning.",
    "指标识别色": "Metric identity color",
    "固定不变，用于图标、名称和趋势线，帮助认出这是温度、PM2.5 还是噪声。": "A fixed color used for icons, names, and trend lines, helping you distinguish temperature, PM2.5, noise, and other metrics.",
    "等级状态色": "Rating status color",
    "状态色": "Status color",
    "标签背景": "Label background",
    "标签文字": "Label text color",
    "浅色背景": "Light background",
    "通风正常": "Ventilation normal",
    "建议通风": "Ventilation recommended",
    "加强通风": "Increase ventilation",
    "随结果变化，用于分档色块和状态标签，帮助判断适宜、偏热、尚可或较差。": "Changes with the result and appears in rating bands and status labels, helping you recognize suitable, warm, fair, or poor conditions.",
    "颜色值怎样看：": "How to read color values:",
    "参数识别卡同时列出固定的“识别色”和“浅色背景”：识别色用于图标、名称和趋势线，浅色背景用于参数卡片等较大面积底色。分档色块则列出“状态色”“标签背景”和“标签文字”：状态色用于状态点、边框等强调位置；标签背景是色块的浅色底色；标签文字是名称、范围和说明使用的深色文字。页面始终同时显示名称、范围和评级文字；无效数据统一显示灰色“未知”。": "Each metric identity card lists a fixed identity color and light background: the identity color is used for icons, names, and trend lines, while the light background is used for larger surfaces such as metric cards. Rating blocks list a status color, label background, and label text color: the status color is used for emphasis such as dots and borders; the label background is the light fill; and the label text color is the dark color used for names, ranges, and descriptions. The page always presents text alongside color; invalid data appears as gray Unknown.",
    "第一类": "Category 1",
    "热舒适度不只看温度。PMV 会同时考虑空气温度、辐射温度、湿度、风速、活动量和衣着，给出从冷到热的七点感受；湿度另有独立提示。": "Thermal comfort depends on more than temperature. PMV considers air temperature, radiant temperature, humidity, air speed, activity, and clothing to produce a seven-point sensation from cold to hot. Humidity is shown separately.",
    "指标识别": "Metric identity",
    "温度": "Temperature",
    "温暖橙 · #F97316": "Warm Orange · #F97316",
    "图标：Material Symbols": "Icon: Material Symbols",
    "相对湿度": "Relative Humidity",
    "水润青 · #0891B2": "Water Cyan · #0891B2",
    "PMV 七点冷热感": "PMV seven-point thermal sensation",
    "PMV 越接近 0，代表多数人在当前条件下越可能感觉中性。每个人的感受仍可能不同。": "The closer PMV is to 0, the more likely most people are to feel thermally neutral. Individual sensations can still differ.",
    "冷": "Cold",
    "凉": "Cool",
    "稍凉": "Slightly cool",
    "中性": "Neutral",
    "稍暖": "Slightly warm",
    "暖": "Warm",
    "热": "Hot",
    "相对湿度提示": "Relative humidity guidance",
    "相对湿度三档提示": "Three-level relative humidity guidance",
    "默认参考德国 UBA 的全年建议范围。40%–60%RH 为适宜；低于该范围提示加湿，高于该范围提示通风或除湿。": "The default uses the German UBA's year-round recommendation. 40%–60%RH is suitable; lower values suggest humidification, while higher values suggest ventilation or dehumidification.",
    "偏干": "Dry",
    "低于 40%RH": "Below 40%RH",
    "适宜": "Suitable",
    "偏湿": "Humid",
    "高于 60%RH": "Above 60%RH",
    "为什么不做综合分数": "Why there is no combined score",
    "冷热感与湿度传达的是不同体验。分别显示更容易判断是调整温度、风速，还是需要加湿或除湿。": "Thermal sensation and humidity describe different experiences. Showing them separately makes it easier to decide whether to adjust temperature or air speed, humidify, or dehumidify.",
    "第二类": "Category 2",
    "分别观察 PM2.5、PM10、CO₂ 和甲醛。单项和整体结果使用 Matter 的六档空气质量名称；具体浓度边界来自所选的环境或健康标准。": "PM2.5, PM10, CO₂, and formaldehyde are assessed separately. Individual and overall results use Matter's six air-quality levels, while concentration boundaries come from the selected environmental or health reference.",
    "图标和识别色固定不变；下方分档色块表示当前评级。TVOC 指数目前只有识别色，尚未参与本项目评级。": "Icons and identity colors stay fixed; the rating bands below show the current result. The TVOC index currently has an identity color only and is not yet rated by this project.",
    "森林绿 · #15803D": "Forest Green · #15803D",
    "雾霾灰蓝 · #667A83": "Haze Blue Gray · #667A83",
    "沙尘灰棕 · #9A7958": "Dust Gray Brown · #9A7958",
    "甲醛 HCHO": "Formaldehyde (HCHO)",
    "警觉玫红 · #DB2777": "Alert Magenta · #DB2777",
    "TVOC 指数": "TVOC Index",
    "挥发黄绿 · #89941A": "Volatile Yellow Green · #89941A",
    "CO₂ 通风提示": "CO₂ ventilation guidance",
    "CO₂ 三档通风提示": "Three-level CO₂ ventilation guidance",
    "参考德国 UBA。中等档采用与 PM2.5“中等”相同的颜色，提示留意通风。": "Based on German UBA guidance. Moderate uses the same colors as PM2.5 Moderate and suggests checking ventilation.",
    "好": "Good",
    "低于 1000 ppm": "Below 1000 ppm",
    "状态色 #16A34A · 通风正常": "Status color #16A34A · Ventilation normal",
    "中等": "Moderate",
    "状态色 #CA8A04 · 建议通风": "Status color #CA8A04 · Ventilation recommended",
    "差": "Poor",
    "高于 2000 ppm": "Above 2000 ppm",
    "状态色 #EA580C · 加强通风": "Status color #EA580C · Increase ventilation",
    "PM2.5 和 PM10：三个可选标准": "PM2.5 and PM10: three selectable standards",
    "三套标准的统计口径和平均时间不同。设备按当前选择标准的要求完成测量和平均，再应用对应的浓度分界；选择哪套标准，取决于产品希望对应的市场表达。": "The three standards use different statistical bases and averaging periods. The device measures and averages as required by the selected standard before applying its concentration boundaries. Choose the standard that matches the intended market presentation.",
    "欧洲 EEA · 默认": "Europe EEA · Default",
    "使用 European Air Quality Index 六档，保留读数小数。": "Uses the six European Air Quality Index bands and preserves decimal readings.",
    "中国 HJ 633—2026": "China HJ 633—2026",
    "对应优、良和四级污染类别，浓度先修约为整数。": "Maps to Excellent, Good, and four pollution categories; concentrations are rounded to integers first.",
    "美国 EPA AQI": "U.S. EPA AQI",
    "对应美国 AQI 类别，PM2.5 截断至一位小数，PM10 截断至整数。": "Maps to U.S. AQI categories. PM2.5 is truncated to one decimal place and PM10 to an integer.",
    "选择颗粒物评级标准": "Select a particle rating standard",
    "PM2.5 · EEA 默认分档（μg/m³）": "PM2.5 · Default EEA bands (μg/m³)",
    "PM2.5 EEA 六档图示": "PM2.5 EEA six-band scale",
    "PM2.5 · 中国 HJ 分档（μg/m³）": "PM2.5 · China HJ bands (μg/m³)",
    "PM2.5 中国 HJ 六档图示": "PM2.5 China HJ six-band scale",
    "PM2.5 · 美国 EPA 分档（μg/m³）": "PM2.5 · U.S. EPA bands (μg/m³)",
    "PM2.5 美国 EPA 六档图示": "PM2.5 U.S. EPA six-band scale",
    "尚可": "Fair",
    "很差": "Very poor",
    "极差": "Extremely poor",
    "PM10 · EEA 默认分档（μg/m³）": "PM10 · Default EEA bands (μg/m³)",
    "PM10 EEA 六档图示": "PM10 EEA six-band scale",
    "PM10 · 中国 HJ 分档（μg/m³）": "PM10 · China HJ bands (μg/m³)",
    "PM10 中国 HJ 六档图示": "PM10 China HJ six-band scale",
    "PM10 · 美国 EPA 分档（μg/m³）": "PM10 · U.S. EPA bands (μg/m³)",
    "PM10 美国 EPA 六档图示": "PM10 U.S. EPA six-band scale",
    "甲醛：三个可选参考标准": "Formaldehyde: three selectable references",
    "WHO 等标准主要给出一个健康参考浓度，并没有统一的六档名称。项目以参考浓度 L 为中心，用 0.25L、0.5L、L、2L、5L 划分六档。": "WHO and similar references mainly provide a health-based concentration, not a common six-level scale. The project centers its scale on reference concentration L and divides six bands at 0.25L, 0.5L, L, 2L, and 5L.",
    "选择甲醛评级标准": "Select a formaldehyde rating reference",
    "WHO 2010 · 默认": "WHO 2010 · Default",
    "参考浓度 0.100 mg/m³ · 30 分钟平均": "Reference 0.100 mg/m³ · 30-minute average",
    "参考浓度 0.080 mg/m³ · 1 小时平均": "Reference 0.080 mg/m³ · 1-hour average",
    "参考浓度 0.055 mg/m³ · 1 小时急性 REL": "Reference 0.055 mg/m³ · 1-hour acute REL",
    "甲醛 · WHO 2010 默认分档（mg/m³）": "Formaldehyde · Default WHO 2010 bands (mg/m³)",
    "甲醛 WHO 六档图示": "Formaldehyde WHO six-band scale",
    "甲醛 · GB/T 18883—2022 分档（mg/m³）": "Formaldehyde · GB/T 18883—2022 bands (mg/m³)",
    "甲醛 GB/T 六档图示": "Formaldehyde GB/T six-band scale",
    "甲醛 · 加州 OEHHA 2008 分档（mg/m³）": "Formaldehyde · California OEHHA 2008 bands (mg/m³)",
    "甲醛 OEHHA 六档图示": "Formaldehyde OEHHA six-band scale",
    "加州 OEHHA 2008": "California OEHHA 2008",
    "第三类": "Category 3",
    "声光": "Sound & Light",
    "噪声提示帮助判断当前环境是否安静；照度提示说明当前光线更接近哪类住宅活动需要。两者分别显示，不合成一个分数。": "Noise guidance helps show whether the environment is quiet. Illuminance guidance shows which residential activities the current light level best supports. They are displayed separately and are not combined into one score.",
    "噪声": "Noise",
    "声波紫 · #9333EA": "Wave Purple · #9333EA",
    "光照 / 照度": "Light / Illuminance",
    "阳光金 · #F2C94C": "Sunlight Gold · #F2C94C",
    "噪声 · dB(A)": "Noise · dB(A)",
    "住宅与睡眠场景使用相同的四档提示，睡眠场景的边界更严格。": "Home and sleep scenes use the same four guidance levels, with stricter boundaries for sleep.",
    "住宅": "Home",
    "安静": "Quiet",
    "偏吵": "Noticeable",
    "嘈杂": "Loud",
    "很吵": "Very loud",
    "睡眠": "Sleep",
    "住宅噪声四档图示": "Four-level home noise scale",
    "睡眠噪声四档图示": "Four-level sleep noise scale",
    "照度 · lx": "Illuminance · lx",
    "颜色从暗到亮表示适合的活动，并不表示好坏；当前算法没有“过亮”评级。": "Colors progress from dark to bright to show suitable activities, not good versus bad. The current algorithm has no overly bright rating.",
    "低照环境": "Low-light environment",
    "约 54 以下": "Approx. 54 or less",
    "氛围照明": "Ambient lighting",
    "约 54–108": "Approx. 54–108",
    "日常活动": "Daily activities",
    "约 108–215": "Approx. 108–215",
    "阅读学习": "Reading & study",
    "约 215–323": "Approx. 215–323",
    "专注活动": "Focused activities",
    "约 323–538": "Approx. 323–538",
    "精细作业": "Detailed tasks",
    "约 538 以上": "Approx. 538 or more",
    "照度六档活动提示": "Six-level illuminance activity guidance",
    "照度不是“越高越好”。": "More illuminance is not always better.",
    "分界参考 RP-11-26 的住宅任务照度层级，并换算为便于连续显示的活动提示。设备的单点瞬时读数不能代表整个房间达到照明标准。": "Boundaries are based on the residential task-illuminance levels in RP-11-26 and converted into continuous activity guidance. A single instantaneous device reading cannot show that an entire room meets a lighting standard.",
    "评级的依据来源是什么？": "What are the sources behind the ratings?",
    "本指南的评级依据来自国际组织、政府部门和专业机构发布的标准与指南。我们根据不同环境指标选取相应的计算方法、分级阈值或参考值，并转换为易于理解的提示。下方列出每项依据的发布机构、主要内容，以及它在本指南中的具体用途。": "The ratings in this guide draw on standards and guidance published by international organizations, government agencies, and professional bodies. For each environmental metric, we select the relevant calculation methods, rating thresholds, or reference values and turn them into guidance that is easy to understand. The cards below identify each source, what it covers, and how this guide uses it.",
    "用于分析和解释热环境，规定 PMV、PPD 等热舒适评价方法。": "Defines PMV, PPD, and other methods for analyzing and interpreting thermal environments.",
    "本项目使用 PMV/PPD 计算方法，结果用于冷热感提示。": "This project uses the PMV/PPD calculation method for thermal-sensation guidance.",
    "ASHRAE Standard 55 七点标尺": "ASHRAE Standard 55 seven-point scale",
    "用“冷、凉、稍凉、中性、稍暖、暖、热”描述从 −3 到 +3 的主观热感觉。": "Describes subjective thermal sensation from −3 to +3 as Cold, Cool, Slightly cool, Neutral, Slightly warm, Warm, and Hot.",
    "本项目采用这七个名称呈现 PMV，不据此单独宣称符合整项标准。": "This project uses these seven names to present PMV; this alone does not claim full compliance with the standard.",
    "美国 EPA 湿度指南": "U.S. EPA humidity guidance",
    "面向住宅防潮和霉菌控制，建议室内相对湿度约为 30%–50%，并保持在 60% 以下。": "For moisture and mold control in homes, it recommends indoor relative humidity around 30%–50% and below 60%.",
    "本项目将其作为可选湿度提示依据。": "This project provides it as an optional humidity reference.",
    "德国 UBA 湿度指南": "German UBA humidity guidance",
    "从住宅通风和防潮角度建议全年保持约 40%–60%RH。": "Recommends about 40%–60%RH year-round for residential ventilation and moisture control.",
    "本项目将 40%–60%RH 作为默认适宜范围。": "This project uses 40%–60%RH as the default suitable range.",
    "欧洲环境署以污染物浓度给出六档空气质量指数，便于公众理解短期空气状况。": "The European Environment Agency provides a six-band index based on pollutant concentrations to communicate short-term air conditions.",
    "本项目采用其 PM2.5、PM10 六档作为默认颗粒物评级。": "This project uses its PM2.5 and PM10 bands as the default particle rating.",
    "中国环境空气质量指数技术规定，定义 AQI 计算、污染级别和报告要求。": "China's technical specification defining AQI calculation, pollution levels, and reporting requirements.",
    "本项目提供对应的 PM 六档选项，并按规定处理浓度修约。": "This project provides matching six-band PM options and applies the specified concentration rounding.",
    "美国面向公众报告空气质量的六类指数体系，包含 PM 浓度断点和健康提示类别。": "The U.S. six-category public air-quality reporting system, including PM concentration breakpoints and health-message categories.",
    "本项目提供对应的 PM 六档选项，并保留 EPA 的截断规则。": "This project provides matching six-band PM options and preserves EPA truncation rules.",
    "德国 UBA 2008 CO₂ 指导值": "German UBA 2008 CO₂ guidance",
    "以 1000 ppm 和 2000 ppm 将室内 CO₂ 分为无明显问题、需要关注和不可接受三类。": "Uses 1000 ppm and 2000 ppm to classify indoor CO₂ as hygienically unremarkable, elevated, or unacceptable.",
    "本项目据此生成正常、建议通风和应加强通风三档提示。": "This project uses these values for Normal, Ventilation recommended, and Increase ventilation guidance.",
    "WHO 2010 室内空气质量指南": "WHO 2010 Guidelines for Indoor Air Quality",
    "针对多种室内污染物给出健康参考，其中甲醛参考浓度为 0.10 mg/m³、30 分钟平均。": "Provides health-based references for several indoor pollutants, including 0.10 mg/m³ for formaldehyde as a 30-minute average.",
    "本项目将其作为甲醛默认依据，并围绕参考浓度映射六档。": "This project uses it as the default formaldehyde reference and maps six bands around its reference concentration.",
    "中国室内空气质量标准，规定室内污染物限值及检验方法，甲醛限值为 0.08 mg/m³、1 小时平均。": "China's indoor air-quality standard defines pollutant limits and test methods, including 0.08 mg/m³ for formaldehyde as a 1-hour average.",
    "本项目将其作为可选甲醛依据。": "This project provides it as an optional formaldehyde reference.",
    "加州健康风险评估机构发布的甲醛参考暴露水平，其中 1 小时急性参考值为 0.055 mg/m³。": "California's health-risk agency reference exposure level for formaldehyde, including a 1-hour acute value of 0.055 mg/m³.",
    "本项目将其作为可选甲醛依据；它不是美国联邦标准。": "This project provides it as an optional formaldehyde reference; it is not a U.S. federal standard.",
    "WHO《社区噪声指南》": "WHO Guidelines for Community Noise",
    "总结环境噪声对健康和生活的影响，并按住宅、睡眠等场景给出长期等效声级参考。": "Summarizes the effects of environmental noise on health and daily life and provides long-term equivalent-level references for homes, sleep, and other settings.",
    "设备按相应测量时间处理读数后生成住宅与睡眠提示；正式达标判定仍须满足完整测量条件。": "The device processes readings over the applicable measurement period before producing home and sleep guidance; formal compliance still requires the complete measurement conditions.",
    "面向住宅室内外照明，按空间、活动和任务面给出推荐照度及照明设计原则。": "Provides recommended illuminance and lighting-design principles for residential indoor and outdoor spaces, activities, and task planes.",
    "本项目选取任务照度层级，换算成六档住宅活动提示。": "This project converts selected task-illuminance levels into six residential activity bands.",
    "图标来源：": "Icon sources:",
    "本网页以及 Android、Web、Linux 和设备屏幕使用 Google": "This webpage and Android, Web, Linux, and device displays use Google",
    "，随项目提供的 SVG 采用 Apache 2.0 许可；Apple 平台使用 Apple": "; the bundled SVG files use the Apache 2.0 license. Apple platforms use Apple",
    "，由系统按符号名称加载。PM2.5 与 PM10 共用颗粒物图形，通过名称和识别色区分。": ", loaded by symbol name from the system. PM2.5 and PM10 share the particle icon and are distinguished by name and identity color.",
    "使用边界：": "Limitations:",
    "本指南用于解释产品评级，不替代专业检测、医疗建议或法规合规结论。完整出处和算法边界请参阅项目技术文档。": "This guide explains product ratings. It does not replace professional testing, medical advice, or regulatory compliance conclusions. See the project documentation for complete sources and algorithm limits.",
    "一页看懂空气、冷热、湿度、噪声与光线的评级、图标和颜色。": "Understand air, thermal sensation, humidity, noise, and light ratings, icons, and colors on one page.",
    "返回页首 ↑": "Back to top ↑",
    "一页看懂热舒适度、空气质量、噪声和照度的评级标准、图标与颜色。": "Understand thermal comfort, air quality, noise, and illuminance ratings, icons, and colors on one page."
  };

  Object.assign(EN, {
    "环境指标解读": "Environmental Metrics Explained", "指标解读": "Metric Guide", "评级指南": "Rating Guide", "评级方法": "Rating Method",
    "传感器给出数字，环境评级把数字转成容易理解的提示。本页介绍评级方法与依据；每项指标的图标、颜色和分档解读可在“环境指标解读”中查看。": "Sensors provide readings. Environmental ratings turn them into clear guidance. This page explains the methods and their sources; the Metric Guide shows each metric's icons, colors, and rating bands.",
    "本页介绍评级方法与依据；每项指标的图标、颜色和分档解读可在“环境指标解读”中查看。": "This page explains the rating method and its sources. Open Environmental Metrics Explained for each metric's icons, colors, and rating bands.",
    "查看指标解读": "Explore metrics",
    "每项指标，怎样读懂？": "How do you read each metric?",
    "查看温度、湿度、空气污染物、花粉、紫外线、噪声和照度的图标、颜色、分档与提示含义。各项使用自己的测量单位和评级依据。": "Explore the icons, colors, rating bands, and guidance for temperature, humidity, air pollutants, pollen, UV, noise, and illuminance. Each metric uses its own unit and reference.",
    "打开环境指标解读": "Open metric guide",
    "了解环境评级如何工作，以及参考了哪些标准与指南。": "Learn how environmental ratings work and which standards and guides they reference.",
    "逐项了解环境指标的图标、识别色、分档、评级说明与结果解读。": "Explore each environmental metric's icons, identity colors, rating bands, and meanings.",
    "找到你关注的指标，了解图标和颜色代表什么、读数如何分档，以及结果应该怎样理解。": "Find the metric you care about, then see what its icons and colors mean, how readings are grouped, and how to interpret the result.",
    "先看图标与颜色": "Start with icons and colors", "查看评级依据": "View rating references", "选择指标类别": "Choose a metric category",
    "逐项查看环境指标的图标、颜色、分档与结果解读。": "Explore the icons, colors, rating bands, and meanings of environmental metrics.",
    "返回评级指南 ↑": "Back to rating guide ↑",
    "室外指标识别": "Outdoor metric identity",
    "图标和识别色固定用于辨认指标；分档颜色另外表示当前等级。室外 PM2.5 与 PM10 沿用前述颗粒物图标和识别色。": "Icons and identity colors identify the metric; rating colors show its current level. Outdoor PM2.5 and PM10 reuse the particle icons and identity colors above.",
    "花粉": "Pollen", "紫外线指数": "UV Index",
    "臭氧蓝 · #3A6EAA": "Ozone blue · #3A6EAA", "石墨灰 · #56616D": "Graphite gray · #56616D", "硫磺金 · #9A6B0A": "Sulfur gold · #9A6B0A", "花粉草绿 · #3E8B5B": "Pollen green · #3E8B5B", "紫外紫 · #6853BE": "Ultraviolet purple · #6853BE",
    "室外花粉": "Outdoor Pollen", "室外花粉负荷": "Outdoor Pollen Load",
    "选择花粉评级标准": "Select a pollen rating standard",
    "选择花粉标准，查看对应类型的日平均浓度分档（粒/m³）。花粉单独评级，不计入空气质量整体结果。只有总花粉数而没有类型时，可显示数值和趋势；正值不评级，测得零值显示“未检出”。": "Select a pollen reference to see daily mean concentration bands (grains/m³) by type. Pollen is rated separately from overall air quality. When only total pollen is known, display the count and trend; a positive total cannot be graded, while a measured zero is shown as Absent.",
    "美国 NAB": "U.S. NAB", "瑞士 MeteoSwiss": "Swiss MeteoSwiss",
    "按树木、禾草、杂草类别总浓度分档": "Bands for total tree, grass, and weed counts",
    "按具体花粉类型分档": "Bands for individual pollen taxa",
    "NAB 花粉分档 · 粒/m³": "NAB pollen bands · grains/m³",
    "MeteoSwiss 花粉分档 · 粒/m³": "MeteoSwiss pollen bands · grains/m³",
    "花粉类型": "Pollen type", "低": "Low", "中": "Moderate", "高": "High", "极高": "Very high",
    "树木": "Trees", "禾草": "Grasses", "杂草": "Weeds",
    "榛树、桤木、鹅耳枥": "Hazel, alder, hornbeam", "白蜡树": "Ash", "桦树": "Birch",
    "悬铃木": "Plane", "橡树、山毛榉": "Oak, beech", "栗树": "Chestnut",
    "酸模、车前草": "Sorrel, plantain", "蒿属": "Mugwort", "豚草": "Ragweed",
    "已测得的 0 粒/m³ 为“未检出”；表中整数区间之间的小数按下一档起点连续比较，例如桦树 10.5 为低、11 为中。": "A measured 0 grains/m³ is Absent. Decimal values use continuous bands ending at the next band’s start; for example, birch 10.5 is Low and 11 is Moderate.",
    "NAB 花粉等级": "NAB pollen levels", "美国国家过敏局（NAB）": "U.S. National Allergy Bureau (NAB)",
    "美国花粉监测网络按树木、禾草、杂草类别总浓度提供四档分级。": "The U.S. pollen monitoring network provides four bands for total tree, grass, and weed concentrations.",
    "本项目用其日平均类别浓度边界评级，不据此判断个人症状。": "This project rates daily mean group concentrations; it does not predict individual symptoms.",
    "MeteoSwiss 花粉负荷等级": "MeteoSwiss pollen load classes", "瑞士联邦气象与气候局": "Swiss Federal Office of Meteorology and Climatology",
    "按不同花粉类型的过敏原潜力，分别规定日平均浓度的低、中、高、极高边界。": "Defines separate Low, Moderate, High, and Very High daily mean thresholds for pollen taxa with different allergenic potential.",
    "本项目仅对表中列出的类型评级；它不是欧盟统一标准。": "This project rates only the listed taxa; this is not an EU-wide standard."
  });

  Object.assign(EN, {
    "一页看懂热舒适度、空气质量、声光与室外环境的评级标准。": "Understand the rating standards for thermal comfort, air quality, sound and light, and outdoor conditions.",
    "室外环境": "Outdoor Environment", "第四类": "Category 4",
    "紫外线 · 花粉 · 室外污染物": "UV · Pollen · Outdoor pollutants",
    "分别查看室外污染物、花粉和紫外线指数。它们使用不同的测量口径与等级，页面不生成室外综合评级。": "Explore outdoor pollutants, pollen, and the UV index separately. Their measurement bases and grades differ, so this page does not produce an overall outdoor rating.",
    "室外空气污染物": "Outdoor air pollutants",
    "O₃、CO、SO₂ 各自按照所选标准和平均时间评级。PM2.5 与 PM10 仍可使用上方的三套颗粒物标准；室外读数不加入室内整体空气质量结果。": "O₃, CO, and SO₂ are rated using their selected references and averaging periods. Outdoor PM2.5 and PM10 can use the particle standards above. Outdoor readings do not affect the indoor overall air-quality result.",
    "臭氧 O₃": "Ozone O₃", "一氧化碳 CO": "Carbon monoxide CO", "二氧化硫 SO₂": "Sulfur dioxide SO₂",
    "欧洲 EEA、中国 HJ 633—2026、美国 EPA AQI；按所选标准使用 1 小时或 8 小时平均值。": "European EEA, Chinese HJ 633—2026, and U.S. EPA AQI; uses a one- or eight-hour average according to the reference.",
    "中国 HJ 633—2026、美国 EPA AQI；分别使用 1 小时或 8 小时平均值。": "Chinese HJ 633—2026 or U.S. EPA AQI; uses a one- or eight-hour average respectively.",
    "欧洲 EEA、中国 HJ 633—2026、美国 EPA AQI；按所选标准使用 1 小时或 24 小时平均值。": "European EEA, Chinese HJ 633—2026, and U.S. EPA AQI; uses a one- or 24-hour average according to the reference.",
    "紫外线指数 UVI": "UV Index (UVI)", "WHO 紫外线指数五档图示": "WHO five-level UV Index chart",
    "参考 WHO《全球太阳紫外线指数：实用指南》。指数越高，太阳紫外线对皮肤和眼睛造成损伤的潜在风险越高。UVI 与照度 lux 不可互相换算。": "Based on WHO's Global Solar UV Index guide. Higher UVI means greater potential harm to skin and eyes. UVI cannot be converted from illuminance in lux.",
    "很高": "Very high", "绿色": "Green", "黄色": "Yellow", "橙色": "Orange", "红色": "Red", "紫色": "Purple",
    "按 WHO 建议，UVI 对公众报告时取最近整数；预报或报告至少应标明当日最大值。当前观测值与当日最大值应分开标注。这里的浅色背景用于图示，WHO 指定的是五类基本颜色。": "WHO recommends reporting UVI as the nearest integer and at least providing the daily maximum. Label a current reading separately from the daily maximum. The pale fills here are illustrative; WHO specifies five basic color families.",
    "WHO 全球太阳紫外线指数": "WHO Global Solar UV Index",
    "全球太阳紫外线指数实用指南给出五档暴露等级、报告口径和基本颜色。": "The Global Solar UV Index guide defines five exposure categories, reporting conventions, and basic colors.",
    "本项目按其五档对已获得的 UVI 评级，不从照度估算紫外线。": "This project rates a supplied UVI in five categories; it does not estimate UV from illuminance."
  });

  Object.assign(EN, {
    "臭氧按所选标准的平均时间评级；各标准使用的浓度单位不同。": "Ozone uses the averaging period and units required by the selected standard.",
    "CO 可选中国实时报或美国 AQI；欧洲 EEA 空气质量指数没有 CO 六档。": "CO uses China's real-time index or U.S. AQI; the EEA index has no six-level CO scale.",
    "SO₂ 的中国标准区分实时报与日报；美国 EPA 同时需要 1 小时和 24 小时值。": "China distinguishes real-time and daily SO₂ ratings; EPA requires both one- and 24-hour values.",
    "选择 O₃ 评级标准": "Select an O₃ standard", "选择 CO 评级标准": "Select a CO standard", "选择 SO₂ 评级标准": "Select an SO₂ standard",
    "欧洲 EEA": "European EEA", "中国 HJ 633—2026": "China HJ 633—2026", "中国 HJ 633—2026 · 实时报": "China HJ 633—2026 · real-time", "中国 HJ 633—2026 · 日报": "China HJ 633—2026 · daily", "美国 EPA AQI": "U.S. EPA AQI",
    "1 小时平均 · μg/m³": "1-hour average · μg/m³", "实时报 1 小时平均 · μg/m³": "Real-time 1-hour average · μg/m³", "8 小时平均，可结合 1 小时平均 · ppm": "8-hour average, optional 1-hour average · ppm", "实时报 1 小时平均 · mg/m³": "Real-time 1-hour average · mg/m³", "8 小时平均 · ppm": "8-hour average · ppm", "24 小时平均 · μg/m³": "24-hour average · μg/m³", "1 小时及 24 小时平均 · ppb": "1- and 24-hour averages · ppb",
    "小数按连续区间比较；各档上限包含在本档。": "Decimals use continuous intervals; each upper bound is included in its band.",
    "评级前将浓度修约为整数；此处是实时报 1 小时口径，不是日报口径。": "Round to an integer before rating. This is the real-time one-hour basis, not the daily basis.",
    "浓度先截断至三位小数。图示前五档列出 8 小时值；有效的 1 小时值也可能提高等级。8 小时值 >0.200 且无可用 1 小时等级时，结果未知。": "Truncate to three decimals. The first five bands show 8-hour values; a valid 1-hour value may raise the grade. An 8-hour value >0.200 without a usable 1-hour grade returns Unknown.",
    "评级前将浓度修约至 0.1 mg/m³。急性风险告警应单独处理。": "Round to 0.1 mg/m³ before rating. Handle acute-risk alerts separately.",
    "评级前将浓度截断至 0.1 ppm。急性风险告警应单独处理。": "Truncate to 0.1 ppm before rating. Handle acute-risk alerts separately.",
    "评级前修约为整数。一小时值超过 800 μg/m³ 时仍归入“差”，不会产生后两档。": "Round to an integer. One-hour values above 800 μg/m³ remain Poor; the final two grades are unused.",
    "评级前修约为整数；此处使用 24 小时平均值。": "Round to an integer; this panel uses the 24-hour average.",
    "两个时段值都必需，并先截断至整数 ppb；任一无效时结果未知。用于官方日报时，1 小时值应为当日最大一小时浓度。": "Both periods are required and truncated to integer ppb; invalid input returns Unknown. Official daily reports use the day's maximum one-hour concentration.",
    "不产生": "Not used", "1 小时 ≥0.405": "1-hour ≥0.405", "1h 186–304；或 1h ≥305、24h <305": "1h 186–304; or 1h ≥305 and 24h <305",
    "臭氧 O₃ 欧洲 EEA 六档图示": "Ozone O₃ · EEA six-level chart", "臭氧 O₃ 中国 HJ 633—2026 六档图示": "Ozone O₃ · China HJ six-level chart", "臭氧 O₃ 美国 EPA AQI 六档图示": "Ozone O₃ · U.S. EPA six-level chart",
    "一氧化碳 CO 中国 HJ 633—2026 六档图示": "CO · China HJ six-level chart", "一氧化碳 CO 美国 EPA AQI 六档图示": "CO · U.S. EPA six-level chart",
    "二氧化硫 SO₂ 欧洲 EEA 六档图示": "SO₂ · EEA six-level chart", "二氧化硫 SO₂ 中国 HJ 633—2026 · 实时报 六档图示": "SO₂ · China HJ real-time chart", "二氧化硫 SO₂ 中国 HJ 633—2026 · 日报 六档图示": "SO₂ · China HJ daily chart", "二氧化硫 SO₂ 美国 EPA AQI 六档图示": "SO₂ · U.S. EPA six-level chart"
  });

  const JA = {
    "环境评级指南": "環境評価ガイド",
    "跳到主要内容": "メインコンテンツへ移動",
    "主导航": "メインナビゲーション",
    "语言": "言語",
    "选择语言": "言語を選択",
    "热舒适度": "温熱快適性",
    "空气质量": "空気質",
    "声光环境": "音・光環境",
    "评级依据": "評価根拠",
    "国际标准化组织（ISO）": "国際標準化機構（ISO）",
    "美国采暖、制冷与空调工程师学会（ASHRAE）": "米国暖房冷凍空調学会（ASHRAE）",
    "美国环境保护署（EPA）": "米国環境保護庁（EPA）",
    "德国联邦环境署（UBA）": "ドイツ連邦環境庁（UBA）",
    "欧洲环境署（EEA）": "欧州環境機関（EEA）",
    "中华人民共和国生态环境部": "中華人民共和国生態環境部",
    "世界卫生组织（WHO）": "世界保健機関（WHO）",
    "国家市场监督管理总局、国家标准化管理委员会": "中国国家市場監督管理総局・国家標準化管理委員会",
    "加利福尼亚州环境健康危害评估办公室（OEHHA）": "カリフォルニア州環境健康有害性評価局（OEHHA）",
    "美国照明工程学会（IES）、美国照明协会（ALA）": "米国照明学会（IES）・米国照明協会（ALA）",
    "看懂你身边的环境": "身の回りの環境を理解する",
    "传感器给出数字，环境评级把数字转成容易理解的提示。这一页集中说明每项指标如何判断、颜色如何变化，以及结果应该怎样阅读。": "センサーが示す数値を、環境評価がわかりやすい案内に変換します。このページでは、各指標の判定方法、色の変化、結果の読み方をまとめています。",
    "先看评级方法": "評価方法を見る",
    "颜色怎样读": "色の読み方",
    "环境数据由多个指标共同组成的示意图": "複数の指標から環境状態が構成されることを示す図",
    "冷热感 · 湿度": "温冷感 · 湿度",
    "颗粒物 · CO₂ · 甲醛": "粒子状物質 · CO₂ · ホルムアルデヒド",
    "噪声 · 照度": "騒音 · 照度",
    "如何工作": "仕組み",
    "从测量值到一句有用的提示": "測定値を役立つ案内へ",
    "每个指标先按自己的单位和标准独立判断。只有空气质量会生成一个整体结果，热舒适度和声光则保留各自提示。": "各指標は、それぞれの単位と基準で個別に評価します。総合結果を出すのは空気質のみで、温熱快適性、音、光は個別の案内を維持します。",
    "分别评价": "個別に評価",
    "PM2.5、CO₂、冷热感等指标各走各的规则，不把不同单位的数值直接相加。": "PM2.5、CO₂、温冷感などは、それぞれ固有のルールで評価し、単位の異なる値を直接加算しません。",
    "关注最差一项": "最も悪い項目に注目",
    "整体空气质量取当前有效指标中最需要关注的一项，让问题不会被平均值掩盖。": "総合空気質には、有効な指標のうち最も注意が必要な結果を採用し、問題が平均値に隠れないようにします。",
    "缺失就跳过": "欠測値は除外",
    "传感器未就绪或数据不可信时，该指标显示未知，也不会拉高或拉低整体结果。": "センサーが準備中、またはデータの信頼性が低い場合、その指標は不明と表示され、総合結果には影響しません。",
    "读数口径：": "読み値の扱い：",
    "评级使用按所选标准测得的结果。标准规定平均时间时，设备先在对应时间窗口内采样并计算平均值，再将结果用于评级；未规定平均时间的指标按该标准的测量方法处理。": "評価には、選択した基準に従って測定した結果を使用します。平均時間が定められている場合、機器は該当する時間窓でサンプリングと平均計算を行ってから評価し、平均時間の指定がない指標はその基準の測定方法に従います。",
    "图标与颜色": "アイコンと色",
    "先认出指标，再判断状态": "指標を識別してから状態を読む",
    "每项指标使用固定图标和识别色；评级结果再使用状态色。两种颜色各自表达一层信息，不会混在一起。": "各指標には固定のアイコンと識別色があり、評価結果には別の状態色を使います。二つの色はそれぞれ異なる情報を表します。",
    "指标识别色": "指標識別色",
    "固定不变，用于图标、名称和趋势线，帮助认出这是温度、PM2.5 还是噪声。": "アイコン、名称、トレンド線に使う固定色で、温度、PM2.5、騒音などを見分けやすくします。",
    "等级状态色": "評価状態色",
    "状态色": "状態色",
    "标签背景": "ラベル背景",
    "标签文字": "ラベル文字色",
    "浅色背景": "淡い背景色",
    "通风正常": "換気は正常",
    "建议通风": "換気を推奨",
    "加强通风": "換気を強化",
    "随结果变化，用于分档色块和状态标签，帮助判断适宜、偏热、尚可或较差。": "結果に応じて変化し、評価帯や状態ラベルに使われ、適正、暖かめ、まずまず、悪いなどを示します。",
    "颜色值怎样看：": "色の値の読み方：",
    "参数识别卡同时列出固定的“识别色”和“浅色背景”：识别色用于图标、名称和趋势线，浅色背景用于参数卡片等较大面积底色。分档色块则列出“状态色”“标签背景”和“标签文字”：状态色用于状态点、边框等强调位置；标签背景是色块的浅色底色；标签文字是名称、范围和说明使用的深色文字。页面始终同时显示名称、范围和评级文字；无效数据统一显示灰色“未知”。": "指標識別カードには、固定の「識別色」と「淡い背景色」を併記します。識別色はアイコン、名称、トレンド線に、淡い背景色は指標カードなどの広い面に使用します。区分ブロックには「状態色」「ラベル背景」「ラベル文字色」を表示します。状態色は点や枠線などの強調、ラベル背景は淡い背景、ラベル文字色は名称、範囲、説明に使う濃い文字色です。色だけでなく文字も常に併記し、無効データはグレーの「不明」で表示します。",
    "第一类": "カテゴリー1",
    "热舒适度不只看温度。PMV 会同时考虑空气温度、辐射温度、湿度、风速、活动量和衣着，给出从冷到热的七点感受；湿度另有独立提示。": "温熱快適性は温度だけでは決まりません。PMVは空気温度、放射温度、湿度、風速、活動量、着衣量を考慮し、寒いから暑いまでの7段階で示します。湿度は別に案内します。",
    "指标识别": "指標の識別",
    "温度": "温度",
    "温暖橙 · #F97316": "ウォームオレンジ · #F97316",
    "图标：Material Symbols": "アイコン：Material Symbols",
    "相对湿度": "相対湿度",
    "水润青 · #0891B2": "ウォーターシアン · #0891B2",
    "PMV 七点冷热感": "PMV 7段階温冷感",
    "PMV 越接近 0，代表多数人在当前条件下越可能感觉中性。每个人的感受仍可能不同。": "PMVが0に近いほど、多くの人が現在の条件を中立と感じる可能性が高くなります。ただし、感じ方には個人差があります。",
    "冷": "寒い",
    "凉": "涼しい",
    "稍凉": "やや涼しい",
    "中性": "中立",
    "稍暖": "やや暖かい",
    "暖": "暖かい",
    "热": "暑い",
    "相对湿度提示": "相対湿度の案内",
    "相对湿度三档提示": "相対湿度3段階案内",
    "默认参考德国 UBA 的全年建议范围。40%–60%RH 为适宜；低于该范围提示加湿，高于该范围提示通风或除湿。": "既定値はドイツUBAの通年推奨範囲を参照します。40%–60%RHを適正とし、下回る場合は加湿、上回る場合は換気または除湿を案内します。",
    "偏干": "乾燥気味",
    "低于 40%RH": "40%RH未満",
    "适宜": "適正",
    "偏湿": "湿潤気味",
    "高于 60%RH": "60%RH超",
    "为什么不做综合分数": "総合スコアにしない理由",
    "冷热感与湿度传达的是不同体验。分别显示更容易判断是调整温度、风速，还是需要加湿或除湿。": "温冷感と湿度は異なる体験を表します。別々に表示することで、温度や風速を調整すべきか、加湿や除湿が必要かを判断しやすくなります。",
    "第二类": "カテゴリー2",
    "分别观察 PM2.5、PM10、CO₂ 和甲醛。单项和整体结果使用 Matter 的六档空气质量名称；具体浓度边界来自所选的环境或健康标准。": "PM2.5、PM10、CO₂、ホルムアルデヒドを個別に確認します。個別結果と総合結果にはMatterの6段階空気質名称を使い、濃度境界は選択した環境・健康基準に基づきます。",
    "图标和识别色固定不变；下方分档色块表示当前评级。TVOC 指数目前只有识别色，尚未参与本项目评级。": "アイコンと識別色は固定で、下の評価帯が現在の評価を示します。TVOC指数は現在、識別色のみ定義され、評価にはまだ使用していません。",
    "森林绿 · #15803D": "フォレストグリーン · #15803D",
    "雾霾灰蓝 · #667A83": "ヘイズブルーグレー · #667A83",
    "沙尘灰棕 · #9A7958": "ダストグレーブラウン · #9A7958",
    "甲醛 HCHO": "ホルムアルデヒド HCHO",
    "警觉玫红 · #DB2777": "アラートマゼンタ · #DB2777",
    "TVOC 指数": "TVOC指数",
    "挥发黄绿 · #89941A": "ボラタイルイエローグリーン · #89941A",
    "CO₂ 通风提示": "CO₂換気案内",
    "CO₂ 三档通风提示": "CO₂換気3段階案内",
    "参考德国 UBA。中等档采用与 PM2.5“中等”相同的颜色，提示留意通风。": "ドイツUBAに基づきます。中程度はPM2.5の「中程度」と同じ色を使い、換気への注意を促します。",
    "好": "良好",
    "低于 1000 ppm": "1000 ppm未満",
    "状态色 #16A34A · 通风正常": "状態色 #16A34A · 換気は正常",
    "中等": "中程度",
    "状态色 #CA8A04 · 建议通风": "状態色 #CA8A04 · 換気を推奨",
    "差": "悪い",
    "高于 2000 ppm": "2000 ppm超",
    "状态色 #EA580C · 加强通风": "状態色 #EA580C · 換気を強化",
    "PM2.5 和 PM10：三个可选标准": "PM2.5とPM10：選択可能な3基準",
    "三套标准的统计口径和平均时间不同。设备按当前选择标准的要求完成测量和平均，再应用对应的浓度分界；选择哪套标准，取决于产品希望对应的市场表达。": "3つの基準では統計方法と平均時間が異なります。機器は選択した基準に従って測定と平均計算を行い、その後に対応する濃度境界を適用します。対象市場での表現に合わせて基準を選択します。",
    "欧洲 EEA · 默认": "欧州 EEA · 既定",
    "使用 European Air Quality Index 六档，保留读数小数。": "European Air Quality Indexの6段階を使用し、小数の測定値を保持します。",
    "中国 HJ 633—2026": "中国 HJ 633—2026",
    "对应优、良和四级污染类别，浓度先修约为整数。": "優、良、および4段階の汚染区分に対応し、濃度を先に整数へ丸めます。",
    "美国 EPA AQI": "米国 EPA AQI",
    "对应美国 AQI 类别，PM2.5 截断至一位小数，PM10 截断至整数。": "米国AQI区分に対応し、PM2.5は小数第1位、PM10は整数に切り捨てます。",
    "选择颗粒物评级标准": "粒子状物質の評価基準を選択",
    "PM2.5 · EEA 默认分档（μg/m³）": "PM2.5 · EEA既定区分（μg/m³）",
    "PM2.5 EEA 六档图示": "PM2.5 EEA 6段階スケール",
    "PM2.5 · 中国 HJ 分档（μg/m³）": "PM2.5 · 中国HJ区分（μg/m³）",
    "PM2.5 中国 HJ 六档图示": "PM2.5 中国HJ 6段階スケール",
    "PM2.5 · 美国 EPA 分档（μg/m³）": "PM2.5 · 米国EPA区分（μg/m³）",
    "PM2.5 美国 EPA 六档图示": "PM2.5 米国EPA 6段階スケール",
    "尚可": "まずまず",
    "很差": "非常に悪い",
    "极差": "極めて悪い",
    "PM10 · EEA 默认分档（μg/m³）": "PM10 · EEA既定区分（μg/m³）",
    "PM10 EEA 六档图示": "PM10 EEA 6段階スケール",
    "PM10 · 中国 HJ 分档（μg/m³）": "PM10 · 中国HJ区分（μg/m³）",
    "PM10 中国 HJ 六档图示": "PM10 中国HJ 6段階スケール",
    "PM10 · 美国 EPA 分档（μg/m³）": "PM10 · 米国EPA区分（μg/m³）",
    "PM10 美国 EPA 六档图示": "PM10 米国EPA 6段階スケール",
    "甲醛：三个可选参考标准": "ホルムアルデヒド：選択可能な3つの参照基準",
    "WHO 等标准主要给出一个健康参考浓度，并没有统一的六档名称。项目以参考浓度 L 为中心，用 0.25L、0.5L、L、2L、5L 划分六档。": "WHOなどの基準は主に健康上の参照濃度を示し、共通の6段階名称は定めていません。本プロジェクトは参照濃度Lを中心に、0.25L、0.5L、L、2L、5Lで6段階に区分します。",
    "选择甲醛评级标准": "ホルムアルデヒドの評価基準を選択",
    "WHO 2010 · 默认": "WHO 2010 · 既定",
    "参考浓度 0.100 mg/m³ · 30 分钟平均": "参照濃度 0.100 mg/m³ · 30分平均",
    "参考浓度 0.080 mg/m³ · 1 小时平均": "参照濃度 0.080 mg/m³ · 1時間平均",
    "参考浓度 0.055 mg/m³ · 1 小时急性 REL": "参照濃度 0.055 mg/m³ · 1時間急性REL",
    "甲醛 · WHO 2010 默认分档（mg/m³）": "ホルムアルデヒド · WHO 2010既定区分（mg/m³）",
    "甲醛 WHO 六档图示": "ホルムアルデヒド WHO 6段階スケール",
    "甲醛 · GB/T 18883—2022 分档（mg/m³）": "ホルムアルデヒド · GB/T 18883—2022区分（mg/m³）",
    "甲醛 GB/T 六档图示": "ホルムアルデヒド GB/T 6段階スケール",
    "甲醛 · 加州 OEHHA 2008 分档（mg/m³）": "ホルムアルデヒド · カリフォルニアOEHHA 2008区分（mg/m³）",
    "甲醛 OEHHA 六档图示": "ホルムアルデヒド OEHHA 6段階スケール",
    "加州 OEHHA 2008": "カリフォルニア OEHHA 2008",
    "第三类": "カテゴリー3",
    "声光": "音・光",
    "噪声提示帮助判断当前环境是否安静；照度提示说明当前光线更接近哪类住宅活动需要。两者分别显示，不合成一个分数。": "騒音案内は現在の環境が静かかを判断する助けになります。照度案内は、現在の光がどの住宅活動に近いかを示します。両者は別々に表示し、一つのスコアには統合しません。",
    "噪声": "騒音",
    "声波紫 · #9333EA": "ウェーブパープル · #9333EA",
    "光照 / 照度": "光 / 照度",
    "阳光金 · #F2C94C": "サンライトゴールド · #F2C94C",
    "噪声 · dB(A)": "騒音 · dB(A)",
    "住宅与睡眠场景使用相同的四档提示，睡眠场景的边界更严格。": "住宅と睡眠では同じ4段階を使い、睡眠の境界をより厳しく設定します。",
    "住宅": "住宅",
    "安静": "静か",
    "偏吵": "ややうるさい",
    "嘈杂": "うるさい",
    "很吵": "非常にうるさい",
    "睡眠": "睡眠",
    "住宅噪声四档图示": "住宅騒音4段階スケール",
    "睡眠噪声四档图示": "睡眠騒音4段階スケール",
    "照度 · lx": "照度 · lx",
    "颜色从暗到亮表示适合的活动，并不表示好坏；当前算法没有“过亮”评级。": "暗い色から明るい色への変化は適した活動を示し、良し悪しではありません。現在のアルゴリズムには「明るすぎる」評価はありません。",
    "低照环境": "低照度環境",
    "约 54 以下": "約54以下",
    "氛围照明": "雰囲気照明",
    "约 54–108": "約54–108",
    "日常活动": "日常活動",
    "约 108–215": "約108–215",
    "阅读学习": "読書・学習",
    "约 215–323": "約215–323",
    "专注活动": "集中作業",
    "约 323–538": "約323–538",
    "精细作业": "精密作業",
    "约 538 以上": "約538以上",
    "照度六档活动提示": "照度6段階活動案内",
    "照度不是“越高越好”。": "照度は高いほど良いとは限りません。",
    "分界参考 RP-11-26 的住宅任务照度层级，并换算为便于连续显示的活动提示。设备的单点瞬时读数不能代表整个房间达到照明标准。": "境界はRP-11-26の住宅タスク照度レベルを参照し、連続表示しやすい活動案内に換算しています。機器の一点の瞬時値だけでは、部屋全体が照明基準を満たすとは判断できません。",
    "评级的依据来源是什么？": "評価の根拠はどこから来ているのか？",
    "本指南的评级依据来自国际组织、政府部门和专业机构发布的标准与指南。我们根据不同环境指标选取相应的计算方法、分级阈值或参考值，并转换为易于理解的提示。下方列出每项依据的发布机构、主要内容，以及它在本指南中的具体用途。": "本ガイドの評価は、国際機関、政府機関、専門団体が公表する規格や指針を根拠としています。環境指標ごとに、関連する計算方法、評価しきい値、または参照値を選び、分かりやすい案内に変換しています。以下では、各根拠の発行機関、主な内容、本ガイドでの使い方を示します。",
    "用于分析和解释热环境，规定 PMV、PPD 等热舒适评价方法。": "温熱環境の分析と解釈に用い、PMV、PPDなどの評価方法を規定します。",
    "本项目使用 PMV/PPD 计算方法，结果用于冷热感提示。": "本プロジェクトはPMV/PPD計算方法を温冷感案内に使用します。",
    "ASHRAE Standard 55 七点标尺": "ASHRAE Standard 55 7段階尺度",
    "用“冷、凉、稍凉、中性、稍暖、暖、热”描述从 −3 到 +3 的主观热感觉。": "−3から+3までの主観的温冷感を、寒い、涼しい、やや涼しい、中立、やや暖かい、暖かい、暑いで表します。",
    "本项目采用这七个名称呈现 PMV，不据此单独宣称符合整项标准。": "本プロジェクトはこの7名称でPMVを表示しますが、それだけで規格全体への適合を主張するものではありません。",
    "美国 EPA 湿度指南": "米国EPA湿度ガイド",
    "面向住宅防潮和霉菌控制，建议室内相对湿度约为 30%–50%，并保持在 60% 以下。": "住宅の防湿とカビ対策として、室内相対湿度を約30%–50%、かつ60%未満に保つことを推奨します。",
    "本项目将其作为可选湿度提示依据。": "本プロジェクトでは選択可能な湿度案内の根拠とします。",
    "德国 UBA 湿度指南": "ドイツUBA湿度ガイド",
    "从住宅通风和防潮角度建议全年保持约 40%–60%RH。": "住宅の換気と防湿の観点から、年間を通じて約40%–60%RHを推奨します。",
    "本项目将 40%–60%RH 作为默认适宜范围。": "本プロジェクトは40%–60%RHを既定の適正範囲とします。",
    "欧洲环境署以污染物浓度给出六档空气质量指数，便于公众理解短期空气状况。": "欧州環境機関が汚染物質濃度に基づく6段階指数を示し、短期的な空気状態を伝えます。",
    "本项目采用其 PM2.5、PM10 六档作为默认颗粒物评级。": "本プロジェクトはPM2.5とPM10の6段階を既定の粒子状物質評価に使用します。",
    "中国环境空气质量指数技术规定，定义 AQI 计算、污染级别和报告要求。": "中国の環境空気質指数に関する技術規定で、AQI計算、汚染レベル、報告要件を定めます。",
    "本项目提供对应的 PM 六档选项，并按规定处理浓度修约。": "本プロジェクトは対応するPMの6段階を用意し、規定どおりに濃度を丸めます。",
    "美国面向公众报告空气质量的六类指数体系，包含 PM 浓度断点和健康提示类别。": "米国の一般向け6区分空気質指数で、PM濃度の境界と健康案内区分を含みます。",
    "本项目提供对应的 PM 六档选项，并保留 EPA 的截断规则。": "本プロジェクトは対応するPMの6段階を用意し、EPAの切り捨て規則を保持します。",
    "德国 UBA 2008 CO₂ 指导值": "ドイツUBA 2008 CO₂指針値",
    "以 1000 ppm 和 2000 ppm 将室内 CO₂ 分为无明显问题、需要关注和不可接受三类。": "1000 ppmと2000 ppmで、室内CO₂を衛生上問題なし、要注意、許容不可の3区分にします。",
    "本项目据此生成正常、建议通风和应加强通风三档提示。": "本プロジェクトはこれに基づき、正常、換気推奨、換気強化の3段階を表示します。",
    "WHO 2010 室内空气质量指南": "WHO 2010 室内空気質ガイドライン",
    "针对多种室内污染物给出健康参考，其中甲醛参考浓度为 0.10 mg/m³、30 分钟平均。": "複数の室内汚染物質について健康上の参照値を示し、ホルムアルデヒドは0.10 mg/m³の30分平均です。",
    "本项目将其作为甲醛默认依据，并围绕参考浓度映射六档。": "本プロジェクトはホルムアルデヒドの既定根拠とし、参照濃度を中心に6段階へ対応付けます。",
    "中国室内空气质量标准，规定室内污染物限值及检验方法，甲醛限值为 0.08 mg/m³、1 小时平均。": "中国の室内空気質基準で、汚染物質の限度値と試験方法を定め、ホルムアルデヒドは0.08 mg/m³の1時間平均です。",
    "本项目将其作为可选甲醛依据。": "本プロジェクトでは選択可能なホルムアルデヒドの根拠とします。",
    "加州健康风险评估机构发布的甲醛参考暴露水平，其中 1 小时急性参考值为 0.055 mg/m³。": "カリフォルニア州の健康リスク評価機関によるホルムアルデヒド参照曝露レベルで、1時間急性参照値は0.055 mg/m³です。",
    "本项目将其作为可选甲醛依据；它不是美国联邦标准。": "本プロジェクトでは選択可能な根拠としますが、米国連邦基準ではありません。",
    "WHO《社区噪声指南》": "WHO『地域騒音ガイドライン』",
    "总结环境噪声对健康和生活的影响，并按住宅、睡眠等场景给出长期等效声级参考。": "環境騒音が健康と生活に与える影響をまとめ、住宅、睡眠などの場面別に長期等価騒音レベルの参考値を示します。",
    "设备按相应测量时间处理读数后生成住宅与睡眠提示；正式达标判定仍须满足完整测量条件。": "機器は該当する測定時間で読み値を処理して住宅・睡眠の案内を生成します。正式な適合判定には、完全な測定条件を満たす必要があります。",
    "面向住宅室内外照明，按空间、活动和任务面给出推荐照度及照明设计原则。": "住宅の屋内外照明について、空間、活動、作業面別に推奨照度と照明設計原則を示します。",
    "本项目选取任务照度层级，换算成六档住宅活动提示。": "本プロジェクトは作業照度レベルを選び、住宅活動の6段階案内へ換算します。",
    "图标来源：": "アイコンの出典：",
    "本网页以及 Android、Web、Linux 和设备屏幕使用 Google": "本ページおよびAndroid、Web、Linux、機器画面ではGoogle",
    "，随项目提供的 SVG 采用 Apache 2.0 许可；Apple 平台使用 Apple": "を使用し、同梱SVGはApache 2.0ライセンスです。AppleプラットフォームではApple",
    "，由系统按符号名称加载。PM2.5 与 PM10 共用颗粒物图形，通过名称和识别色区分。": "をシステムからシンボル名で読み込みます。PM2.5とPM10は粒子状物質アイコンを共有し、名称と識別色で区別します。",
    "使用边界：": "利用上の制限：",
    "本指南用于解释产品评级，不替代专业检测、医疗建议或法规合规结论。完整出处和算法边界请参阅项目技术文档。": "本ガイドは製品評価を説明するもので、専門測定、医療助言、法令適合判定の代わりにはなりません。完全な出典とアルゴリズムの範囲はプロジェクト文書を参照してください。",
    "一页看懂空气、冷热、湿度、噪声与光线的评级、图标和颜色。": "空気、温冷感、湿度、騒音、光の評価、アイコン、色を1ページで確認できます。",
    "返回页首 ↑": "ページ上部へ ↑",
    "一页看懂热舒适度、空气质量、噪声和照度的评级标准、图标与颜色。": "温熱快適性、空気質、騒音、照度の評価基準、アイコン、色を1ページで確認できます。"
  };

  Object.assign(JA, {
    "环境指标解读": "環境指標の読み解き", "指标解读": "指標の読み解き", "评级指南": "評価ガイド", "评级方法": "評価方法",
    "传感器给出数字，环境评级把数字转成容易理解的提示。本页介绍评级方法与依据；每项指标的图标、颜色和分档解读可在“环境指标解读”中查看。": "センサーの数値を、環境評価がわかりやすい案内に変換します。このページでは評価方法とその根拠を説明します。各指標のアイコン、色、評価区分は「環境指標の読み解き」で確認できます。",
    "本页介绍评级方法与依据；每项指标的图标、颜色和分档解读可在“环境指标解读”中查看。": "このページでは評価方法と根拠を説明します。各指標のアイコン、色、評価区分は「環境指標の読み解き」で確認できます。",
    "查看指标解读": "指標の読み解きを見る",
    "每项指标，怎样读懂？": "各指標をどう読み解く？",
    "查看温度、湿度、空气污染物、花粉、紫外线、噪声和照度的图标、颜色、分档与提示含义。各项使用自己的测量单位和评级依据。": "温度、湿度、大気汚染物質、花粉、紫外線、騒音、照度のアイコン、色、評価区分と意味を確認できます。各指標には固有の単位と評価根拠があります。",
    "打开环境指标解读": "環境指標の読み解きを開く",
    "了解环境评级如何工作，以及参考了哪些标准与指南。": "環境評価の仕組みと参照する基準・ガイドを紹介します。",
    "逐项了解环境指标的图标、识别色、分档、评级说明与结果解读。": "環境指標ごとのアイコン、識別色、評価区分と結果の意味を紹介します。",
    "找到你关注的指标，了解图标和颜色代表什么、读数如何分档，以及结果应该怎样理解。": "気になる指標を選び、アイコンと色の意味、数値の区分と結果の読み方を確認できます。",
    "先看图标与颜色": "まずアイコンと色を見る", "查看评级依据": "評価根拠を見る", "选择指标类别": "指標のカテゴリを選択",
    "逐项查看环境指标的图标、颜色、分档与结果解读。": "環境指標ごとのアイコン、色、評価区分と結果の意味を確認できます。",
    "返回评级指南 ↑": "評価ガイドへ戻る ↑",
    "室外指标识别": "屋外指標の見分け方",
    "图标和识别色固定用于辨认指标；分档颜色另外表示当前等级。室外 PM2.5 与 PM10 沿用前述颗粒物图标和识别色。": "アイコンと識別色は指標を示し、評価色は現在の段階を示します。屋外のPM2.5とPM10は上記の粒子状物質のアイコンと識別色を使用します。",
    "花粉": "花粉", "紫外线指数": "紫外線指数",
    "臭氧蓝 · #3A6EAA": "オゾンブルー · #3A6EAA", "石墨灰 · #56616D": "グラファイトグレー · #56616D", "硫磺金 · #9A6B0A": "硫黄金 · #9A6B0A", "花粉草绿 · #3E8B5B": "花粉グリーン · #3E8B5B", "紫外紫 · #6853BE": "紫外線パープル · #6853BE",
    "室外花粉": "屋外花粉", "室外花粉负荷": "屋外の花粉量",
    "选择花粉评级标准": "花粉評価の基準を選択",
    "选择花粉标准，查看对应类型的日平均浓度分档（粒/m³）。花粉单独评级，不计入空气质量整体结果。只有总花粉数而没有类型时，可显示数值和趋势；正值不评级，测得零值显示“未检出”。": "花粉の基準を選ぶと、種類別の日平均濃度の区分（粒/m³）を確認できます。花粉は空気質の総合評価に含めません。総花粉数しか分からない場合は数値と傾向を表示し、正の値は評価せず、測定値ゼロは「検出なし」と表示します。",
    "美国 NAB": "米国 NAB", "瑞士 MeteoSwiss": "スイス MeteoSwiss",
    "按树木、禾草、杂草类别总浓度分档": "樹木・イネ科・雑草の種類群ごとの総濃度",
    "按具体花粉类型分档": "花粉の種類ごとの濃度",
    "NAB 花粉分档 · 粒/m³": "NAB 花粉区分・粒/m³",
    "MeteoSwiss 花粉分档 · 粒/m³": "MeteoSwiss 花粉区分・粒/m³",
    "花粉类型": "花粉の種類", "低": "低い", "中": "中程度", "高": "高い", "极高": "非常に高い",
    "树木": "樹木", "禾草": "イネ科", "杂草": "雑草",
    "榛树、桤木、鹅耳枥": "ハシバミ・ハンノキ・シデ", "白蜡树": "トネリコ", "桦树": "カバノキ",
    "悬铃木": "スズカケノキ", "橡树、山毛榉": "ナラ・ブナ", "栗树": "クリ",
    "酸模、车前草": "スイバ・オオバコ", "蒿属": "ヨモギ", "豚草": "ブタクサ",
    "已测得的 0 粒/m³ 为“未检出”；表中整数区间之间的小数按下一档起点连续比较，例如桦树 10.5 为低、11 为中。": "測定値 0 粒/m³ は「検出なし」です。小数値は次の区分の開始値まで連続的に比較します。例えばカバノキ 10.5 は「低い」、11 は「中程度」です。",
    "NAB 花粉等级": "NAB 花粉レベル", "美国国家过敏局（NAB）": "米国 National Allergy Bureau（NAB）",
    "美国花粉监测网络按树木、禾草、杂草类别总浓度提供四档分级。": "米国の花粉観測ネットワークは、樹木・イネ科・雑草の総濃度を4段階で示します。",
    "本项目用其日平均类别浓度边界评级，不据此判断个人症状。": "本プロジェクトは種類群の日平均濃度を評価し、個人の症状は予測しません。",
    "MeteoSwiss 花粉负荷等级": "MeteoSwiss 花粉量区分", "瑞士联邦气象与气候局": "スイス連邦気象・気候局",
    "按不同花粉类型的过敏原潜力，分别规定日平均浓度的低、中、高、极高边界。": "花粉の種類ごとのアレルゲン性に応じ、日平均濃度の4段階の境界を定めています。",
    "本项目仅对表中列出的类型评级；它不是欧盟统一标准。": "本プロジェクトは表に載る種類のみ評価します。EU共通基準ではありません。"
  });

  Object.assign(JA, {
    "一页看懂热舒适度、空气质量、声光与室外环境的评级标准。": "温熱快適性、空気質、音と光、屋外環境の評価基準を1ページで確認できます。",
    "室外环境": "屋外環境", "第四类": "第4分野",
    "紫外线 · 花粉 · 室外污染物": "紫外線・花粉・屋外汚染物質",
    "分别查看室外污染物、花粉和紫外线指数。它们使用不同的测量口径与等级，页面不生成室外综合评级。": "屋外汚染物質、花粉、紫外線指数を別々に確認できます。測定方法と評価段階が異なるため、屋外の総合評価は生成しません。",
    "室外空气污染物": "屋外の大気汚染物質",
    "O₃、CO、SO₂ 各自按照所选标准和平均时间评级。PM2.5 与 PM10 仍可使用上方的三套颗粒物标准；室外读数不加入室内整体空气质量结果。": "O₃、CO、SO₂は選択した基準と平均時間で個別に評価します。屋外PM2.5とPM10には上記の粒子状物質基準を使えます。屋外の値は室内空気質の総合評価に含めません。",
    "臭氧 O₃": "オゾン O₃", "一氧化碳 CO": "一酸化炭素 CO", "二氧化硫 SO₂": "二酸化硫黄 SO₂",
    "欧洲 EEA、中国 HJ 633—2026、美国 EPA AQI；按所选标准使用 1 小时或 8 小时平均值。": "欧州EEA、中国HJ 633—2026、米国EPA AQI。基準に応じて1時間または8時間平均を用います。",
    "中国 HJ 633—2026、美国 EPA AQI；分别使用 1 小时或 8 小时平均值。": "中国HJ 633—2026または米国EPA AQI。それぞれ1時間または8時間平均を用います。",
    "欧洲 EEA、中国 HJ 633—2026、美国 EPA AQI；按所选标准使用 1 小时或 24 小时平均值。": "欧州EEA、中国HJ 633—2026、米国EPA AQI。基準に応じて1時間または24時間平均を用います。",
    "紫外线指数 UVI": "紫外線指数 UVI", "WHO 紫外线指数五档图示": "WHO紫外線指数の5段階図",
    "参考 WHO《全球太阳紫外线指数：实用指南》。指数越高，太阳紫外线对皮肤和眼睛造成损伤的潜在风险越高。UVI 与照度 lux 不可互相换算。": "WHO『世界太陽紫外線指数 実用ガイド』に基づきます。指数が高いほど皮膚と目への影響の可能性が高くなります。UVIと照度luxは換算できません。",
    "很高": "非常に高い", "绿色": "緑", "黄色": "黄", "橙色": "オレンジ", "红色": "赤", "紫色": "紫",
    "按 WHO 建议，UVI 对公众报告时取最近整数；预报或报告至少应标明当日最大值。当前观测值与当日最大值应分开标注。这里的浅色背景用于图示，WHO 指定的是五类基本颜色。": "WHOはUVIを最も近い整数で報告し、少なくとも日最大値を示すよう勧めています。現在値と日最大値を区別してください。淡い背景色は説明用で、WHOは5種類の基本色を定めています。",
    "WHO 全球太阳紫外线指数": "WHO世界太陽紫外線指数",
    "全球太阳紫外线指数实用指南给出五档暴露等级、报告口径和基本颜色。": "世界太陽紫外線指数実用ガイドは5段階の曝露区分、報告方法、基本色を示します。",
    "本项目按其五档对已获得的 UVI 评级，不从照度估算紫外线。": "本プロジェクトは取得済みUVIを5段階で評価し、照度から紫外線を推定しません。"
  });

  Object.assign(JA, {
    "臭氧按所选标准的平均时间评级；各标准使用的浓度单位不同。": "オゾンは選択した基準の平均時間と単位で評価します。",
    "CO 可选中国实时报或美国 AQI；欧洲 EEA 空气质量指数没有 CO 六档。": "COは中国の速報または米国AQIから選べます。EEA指数にCOの6段階はありません。",
    "SO₂ 的中国标准区分实时报与日报；美国 EPA 同时需要 1 小时和 24 小时值。": "中国のSO₂基準は速報と日報を区別し、EPAでは1時間値と24時間値の両方が必要です。",
    "选择 O₃ 评级标准": "O₃の基準を選択", "选择 CO 评级标准": "COの基準を選択", "选择 SO₂ 评级标准": "SO₂の基準を選択",
    "欧洲 EEA": "欧州 EEA", "中国 HJ 633—2026 · 实时报": "中国 HJ 633—2026・速報", "中国 HJ 633—2026 · 日报": "中国 HJ 633—2026・日報", "美国 EPA AQI": "米国 EPA AQI",
    "1 小时平均 · μg/m³": "1時間平均・μg/m³", "实时报 1 小时平均 · μg/m³": "速報1時間平均・μg/m³", "8 小时平均，可结合 1 小时平均 · ppm": "8時間平均、1時間平均も併用可・ppm", "实时报 1 小时平均 · mg/m³": "速報1時間平均・mg/m³", "8 小时平均 · ppm": "8時間平均・ppm", "24 小时平均 · μg/m³": "24時間平均・μg/m³", "1 小时及 24 小时平均 · ppb": "1時間・24時間平均・ppb",
    "小数按连续区间比较；各档上限包含在本档。": "小数値は連続区間で比較し、各区分の上限を含みます。",
    "评级前将浓度修约为整数；此处是实时报 1 小时口径，不是日报口径。": "評価前に整数に丸めます。速報の1時間値で、日報の基準ではありません。",
    "浓度先截断至三位小数。图示前五档列出 8 小时值；有效的 1 小时值也可能提高等级。8 小时值 >0.200 且无可用 1 小时等级时，结果未知。": "小数第3位で切り捨てます。最初の5区分は8時間値で、有効な1時間値により評価が上がる場合があります。8時間値が0.200を超え、1時間評価がない場合は不明です。",
    "评级前将浓度修约至 0.1 mg/m³。急性风险告警应单独处理。": "評価前に0.1 mg/m³に丸めます。急性リスク警報は別途扱います。",
    "评级前将浓度截断至 0.1 ppm。急性风险告警应单独处理。": "評価前に0.1 ppmで切り捨てます。急性リスク警報は別途扱います。",
    "评级前修约为整数。一小时值超过 800 μg/m³ 时仍归入“差”，不会产生后两档。": "整数に丸めます。1時間値が800 μg/m³を超えても「悪い」で、最後の2段階は使いません。",
    "评级前修约为整数；此处使用 24 小时平均值。": "整数に丸めます。このパネルは24時間平均値を使います。",
    "两个时段值都必需，并先截断至整数 ppb；任一无效时结果未知。用于官方日报时，1 小时值应为当日最大一小时浓度。": "両方の値が必要で、整数ppbに切り捨てます。無効な値は不明です。公式日報では当日の最大1時間濃度を使います。",
    "不产生": "該当なし", "1 小时 ≥0.405": "1時間 ≥0.405", "1h 186–304；或 1h ≥305、24h <305": "1時間 186–304、または1時間 ≥305 かつ24時間 <305",
    "臭氧 O₃ 欧洲 EEA 六档图示": "オゾン O₃・EEA 6段階", "臭氧 O₃ 中国 HJ 633—2026 六档图示": "オゾン O₃・中国 HJ 6段階", "臭氧 O₃ 美国 EPA AQI 六档图示": "オゾン O₃・米国 EPA 6段階",
    "一氧化碳 CO 中国 HJ 633—2026 六档图示": "CO・中国 HJ 6段階", "一氧化碳 CO 美国 EPA AQI 六档图示": "CO・米国 EPA 6段階",
    "二氧化硫 SO₂ 欧洲 EEA 六档图示": "SO₂・EEA 6段階", "二氧化硫 SO₂ 中国 HJ 633—2026 · 实时报 六档图示": "SO₂・中国 HJ 速報", "二氧化硫 SO₂ 中国 HJ 633—2026 · 日报 六档图示": "SO₂・中国 HJ 日報", "二氧化硫 SO₂ 美国 EPA AQI 六档图示": "SO₂・米国 EPA 6段階"
  });

  Object.assign(EN, {
    "参考德国 UBA 2008 CO₂ 指导值。浓度升高时，提示留意并加强通风。": "Based on the German UBA 2008 CO₂ guidance. Higher concentrations prompt closer attention to ventilation.",
    "逐项了解环境指标的分档边界、可选标准与评级结果。": "Explore rating boundaries, standard options, and results for each environmental metric.",
    "找到你关注的指标，查看读数如何分档、可选标准有何不同，以及评级结果代表什么。图标和色值收录在设计参考中。": "Find your metric to understand its rating bands, standard options, and results. Icons and color values are available in Design Reference.",
    "逐项查看环境指标的分档与结果解读。": "Explore rating bands and results for each environmental metric."
  });
  Object.assign(JA, {
    "参考德国 UBA 2008 CO₂ 指导值。浓度升高时，提示留意并加强通风。": "ドイツUBAの2008年CO₂指針を参照し、濃度の上昇に応じて換気を案内します。",
    "逐项了解环境指标的分档边界、可选标准与评级结果。": "各環境指標の評価区分、選択できる基準と結果を確認できます。",
    "找到你关注的指标，查看读数如何分档、可选标准有何不同，以及评级结果代表什么。图标和色值收录在设计参考中。": "気になる指標の評価区分、基準の違い、結果の意味を確認できます。アイコンと色の値はデザイン資料にまとめています。",
    "逐项查看环境指标的分档与结果解读。": "各環境指標の評価区分と結果の意味を確認できます。"
  });
  Object.assign(EN, {"花粉分级图示": "Pollen rating scale", "未检出": "Not detected", "0 粒/m³": "0 grains/m³"});
  Object.assign(JA, {"花粉分级图示": "花粉の評価区分", "未检出": "未検出", "0 粒/m³": "0 個/m³"});
  Object.assign(window.ENV_GUIDE_ZH_HANT, {"花粉分级图示": "花粉分級圖示", "未检出": "未檢出", "0 粒/m³": "0 粒/m³"});
  Object.assign(EN, {"按 WHO 建议，UVI 对公众报告时取最近整数；预报或报告至少应标明当日最大值，当前值与当日最大值应分开标注。色条采用 WHO 指定的 RGB 色值，浅色背景和深色文字为产品可读性配色。": "WHO recommends rounding public UVI reports to the nearest integer and showing at least the daily maximum. Label current and daily maximum readings separately. The color bars use WHO’s specified RGB values; pale backgrounds and dark text are product choices for readability.", "紫外线五档的状态色和图示色采用 WHO 指定的 RGB 原值；标签背景、文字色及未知配色为产品设计值。当前未提供独立的紫外线状态色 API。": "The five UV status and chart colors use WHO’s specified RGB values. Label backgrounds, text colors, and the Unknown palette are product design choices. There is currently no dedicated UV status color API.", "五档 + 未知": "Five levels + Unknown", "WHO 配色规范 ↗": "WHO color specification ↗"});
  Object.assign(JA, {"按 WHO 建议，UVI 对公众报告时取最近整数；预报或报告至少应标明当日最大值，当前值与当日最大值应分开标注。色条采用 WHO 指定的 RGB 色值，浅色背景和深色文字为产品可读性配色。": "WHOはUVIを最も近い整数で報告し、少なくとも日最大値を示すよう勧めています。現在値と日最大値は区別してください。色帯にはWHO指定のRGB値を使い、淡い背景と濃い文字は読みやすさのための製品配色です。", "紫外线五档的状态色和图示色采用 WHO 指定的 RGB 原值；标签背景、文字色及未知配色为产品设计值。当前未提供独立的紫外线状态色 API。": "紫外線の5段階の状態色とグラフ色はWHO指定のRGB値です。ラベル背景、文字色、不明の配色は製品のデザイン値です。現在、専用の紫外線状態色APIはありません。", "五档 + 未知": "5段階＋不明", "WHO 配色规范 ↗": "WHO配色仕様 ↗"});
  Object.assign(window.ENV_GUIDE_ZH_HANT, {"按 WHO 建议，UVI 对公众报告时取最近整数；预报或报告至少应标明当日最大值，当前值与当日最大值应分开标注。色条采用 WHO 指定的 RGB 色值，浅色背景和深色文字为产品可读性配色。": "依 WHO 建議，UVI 對公眾報告時取最近整數；預報或報告至少應標明當日最大值，目前值與當日最大值應分開標註。色條採用 WHO 指定的 RGB 色值，淺色背景與深色文字為產品易讀性配色。", "紫外线五档的状态色和图示色采用 WHO 指定的 RGB 原值；标签背景、文字色及未知配色为产品设计值。当前未提供独立的紫外线状态色 API。": "紫外線五檔的狀態色與圖示色採用 WHO 指定的 RGB 原值；標籤背景、文字色與未知配色為產品設計值。目前未提供獨立的紫外線狀態色 API。", "五档 + 未知": "五檔＋未知", "WHO 配色规范 ↗": "WHO 配色規範 ↗"});
  Object.assign(EN, {"按 WHO 建议，UVI 对公众报告时取最近整数；预报或报告至少应标明当日最大值，当前值与当日最大值应分开标注。标签使用便于阅读的浅色背景和深色文字，具体配色见设计参考。": "WHO recommends rounding public UVI reports to the nearest integer and showing at least the daily maximum. Label current and daily maximum readings separately. Labels use pale backgrounds and dark text for readability; see Design Reference for color values."});
  Object.assign(JA, {"按 WHO 建议，UVI 对公众报告时取最近整数；预报或报告至少应标明当日最大值，当前值与当日最大值应分开标注。标签使用便于阅读的浅色背景和深色文字，具体配色见设计参考。": "WHOはUVIを最も近い整数で報告し、少なくとも日最大値を示すよう勧めています。現在値と日最大値は区別してください。ラベルには読みやすい淡い背景と濃い文字を使い、配色の詳細はデザイン資料にまとめています。"});
  Object.assign(window.ENV_GUIDE_ZH_HANT, {"按 WHO 建议，UVI 对公众报告时取最近整数；预报或报告至少应标明当日最大值，当前值与当日最大值应分开标注。标签使用便于阅读的浅色背景和深色文字，具体配色见设计参考。": "依 WHO 建議，UVI 對公眾報告時取最近整數；預報或報告至少應標明當日最大值，目前值與當日最大值應分開標註。標籤使用便於閱讀的淺色背景與深色文字，具體配色見設計參考。"});
  EN["开发参考"] = "Developer Guide";
  JA["开发参考"] = "開発者ガイド";
  if (window.ENV_GUIDE_ZH_HANT) window.ENV_GUIDE_ZH_HANT["开发参考"] = "開發參考";
  EN["设计参考"] = "Design Reference";
  JA["设计参考"] = "デザイン資料";
  if (window.ENV_GUIDE_ZH_HANT) window.ENV_GUIDE_ZH_HANT["设计参考"] = "設計參考";
  const outdoorIndexCopy = {"zh-Hant": {"空气质量指数 · AQI": "空氣品質指數 · AQI", "选择空气质量指数体系": "選擇空氣品質指數體系", "接收外部发布的指数或等级，保留各体系原生分档。此处不根据设备读数重新计算综合指数，也不参与室内空气质量评级。": "接收外部發布的指數或等級，保留各體系原生分檔。此處不依裝置讀數重新計算綜合指數，也不參與室內空氣品質評級。", "分别查看外部空气质量指数、室外污染物、花粉和紫外线指数。外部指数保留原生分级，页面不将这些参数合并成新的室外综合评级。": "分別查看外部空氣品質指數、室外污染物、花粉與紫外線指數。外部指數保留原生分級，頁面不將這些參數合併成新的室外綜合評級。"}, "en": {"空气质量指数 · AQI": "Air quality indices · AQI", "选择空气质量指数体系": "Choose an air quality index scheme", "接收外部发布的指数或等级，保留各体系原生分档。此处不根据设备读数重新计算综合指数，也不参与室内空气质量评级。": "Accept external published indices or categories and retain each scheme’s native bands. These are not recalculated from device readings or included in the indoor air quality rating.", "分别查看外部空气质量指数、室外污染物、花粉和紫外线指数。外部指数保留原生分级，页面不将这些参数合并成新的室外综合评级。": "Explore external air quality indices, outdoor pollutants, pollen and UV separately. External indices retain their native categories; these parameters are not combined into a new overall outdoor rating."}, "ja": {"空气质量指数 · AQI": "大気質指数 · AQI", "选择空气质量指数体系": "大気質指数の体系を選択", "接收外部发布的指数或等级，保留各体系原生分档。此处不根据设备读数重新计算综合指数，也不参与室内空气质量评级。": "外部で公開された指数や等級を受け取り、各体系の区分を保ちます。機器の測定値から再計算せず、室内大気質の評価にも加えません。", "分别查看外部空气质量指数、室外污染物、花粉和紫外线指数。外部指数保留原生分级，页面不将这些参数合并成新的室外综合评级。": "外部の大気質指数、屋外汚染物質、花粉、紫外線を個別に確認できます。外部指数の区分を保ち、新たな屋外総合評価にはまとめません。"}};
  Object.assign(EN, {"二氧化氮 NO₂": "Nitrogen dioxide NO₂", "尾气赭红": "Exhaust terracotta"});
  Object.assign(JA, {"二氧化氮 NO₂": "二酸化窒素 NO₂", "尾气赭红": "排気テラコッタ"});
  Object.assign(window.ENV_GUIDE_ZH_HANT || {}, {"尾气赭红":"尾氣赭紅"});
  Object.assign(EN, outdoorIndexCopy.en);
  Object.assign(JA, outdoorIndexCopy.ja);
  Object.assign(window.ENV_GUIDE_ZH_HANT || {}, outdoorIndexCopy["zh-Hant"]);
  Object.assign(EN, window.ENV_DESIGN_I18N?.en || {});
  Object.assign(JA, window.ENV_DESIGN_I18N?.ja || {});
  Object.assign(window.ENV_GUIDE_ZH_HANT || {}, window.ENV_DESIGN_I18N?.["zh-Hant"] || {});
  Object.assign(window.ENV_GUIDE_ZH_HANT, {"关联指标": "關聯指標", "冷热感（PMV）": "冷熱感（PMV）", "热不满意率（PPD）": "熱不滿意率（PPD）", "温度、相对湿度（计算输入）": "溫度、相對濕度（計算輸入）", "外部中国 AQI": "外部中國 AQI", "外部美国 AQI": "外部美國 AQI", "甲醛（HCHO）": "甲醛（HCHO）"});
  Object.assign(EN, {"关联指标": "Related metrics", "冷热感（PMV）": "Thermal sensation (PMV)", "热不满意率（PPD）": "Predicted percentage dissatisfied (PPD)", "温度、相对湿度（计算输入）": "Temperature and RH (calculation inputs)", "外部中国 AQI": "External Chinese AQI", "外部美国 AQI": "External US AQI", "甲醛（HCHO）": "Formaldehyde (HCHO)"});
  Object.assign(JA, {"关联指标": "関連指標", "冷热感（PMV）": "温冷感（PMV）", "热不满意率（PPD）": "予測不満足者率（PPD）", "温度、相对湿度（计算输入）": "温度・相対湿度（計算入力）", "外部中国 AQI": "外部の中国AQI", "外部美国 AQI": "外部の米国AQI", "甲醛（HCHO）": "ホルムアルデヒド（HCHO）"});
  Object.assign(window.ENV_GUIDE_ZH_HANT, {"AQI（中国 / 美国）": "AQI（中國 / 美國）", "原生等级配色": "原生等級配色", "外部指数按原生等级含义配色，不按档序号跨体系套色。以下为产品配色，并非各机构指定色。": "外部指數依原生等級含義配色，不依檔序號跨體系套色。以下為產品配色，並非各機構指定色。"});
  Object.assign(EN, {"AQI（中国 / 美国）": "AQI (China / US)", "原生等级配色": "Native category colors", "外部指数按原生等级含义配色，不按档序号跨体系套色。以下为产品配色，并非各机构指定色。": "External indices use colors matched to native category meanings, not shared ordinal numbers. These are product colors, not official agency specifications."});
  Object.assign(JA, {"AQI（中国 / 美国）": "AQI（中国 / 米国）", "原生等级配色": "原区分の配色", "外部指数按原生等级含义配色，不按档序号跨体系套色。以下为产品配色，并非各机构指定色。": "外部指数は区分番号ではなく各区分の意味に合わせて配色します。以下は製品配色であり、各機関の指定色ではありません。"});
  Object.assign(window.ENV_GUIDE_ZH_HANT, {"说明": "說明", "解读": "解讀", "建议": "建議"});
  Object.assign(EN, {"说明": "Description", "解读": "Interpretation", "建议": "Advice"});
  Object.assign(JA, {"说明": "説明", "解读": "解説", "建议": "アドバイス"});
  Object.assign(EN, {"AQI 按所选标准的原生等级配色。以下为产品配色，并非各机构指定色。": "AQI colors follow the selected scheme’s native categories. These are product colors, not official agency specifications."});
  Object.assign(JA, {"AQI 按所选标准的原生等级配色。以下为产品配色，并非各机构指定色。": "AQIは選択した基準の区分に合わせて配色します。以下は製品配色であり、各機関の指定色ではありません。"});
  Object.assign(window.ENV_GUIDE_ZH_HANT, {"AQI 按所选标准的原生等级配色。以下为产品配色，并非各机构指定色。": "AQI 依所選標準的原生等級配色。以下為產品配色，並非各機構指定色。"});
  const localeAliases = { "zh-cn": "zh-Hans", "zh-sg": "zh-Hans", "zh-tw": "zh-Hant", "zh-hk": "zh-Hant", "zh-hant": "zh-Hant", "zh-hans": "zh-Hans", en: "en", ja: "ja", "ja-jp": "ja" };
  const requested = new URLSearchParams(window.location.search).get("lang");
  const locale = localeAliases[(requested || "zh-Hans").toLowerCase()] || "zh-Hans";
  const dictionaries = { "zh-Hant": window.ENV_GUIDE_ZH_HANT || {}, en: EN, ja: JA };
  const dictionary = dictionaries[locale] || {};

  const translate = (value) => {
    if (!value) return value;
    const match = value.match(/^(\s*)(.*?)(\s*)$/s);
    const prefix = match?.[1] || "";
    const core = match?.[2] || value;
    const suffix = match?.[3] || "";
    let translated = dictionary[core];
    if (translated == null && locale === "en" && core.startsWith("状态色 ")) translated = core.replace("状态色 ", "Status color ");
    if (translated == null && locale === "ja" && core.startsWith("状态色 ")) translated = core.replace("状态色 ", "状態色 ");
    if (translated == null && locale === "en" && core.includes(" 至 ")) translated = core.replace(" 至 ", " to ");
    if (translated == null && locale === "ja" && core.includes(" 至 ")) translated = core.replace(" 至 ", "～");
    return `${prefix}${translated ?? core}${suffix}`;
  };

  if (locale !== "zh-Hans") {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.parentElement?.closest('script, style, option, [translate="no"], [data-copy-key]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => { node.nodeValue = translate(node.nodeValue); });
    document.querySelectorAll("[aria-label], [title], meta[name='description'], meta[name='apple-mobile-web-app-title']").forEach((element) => {
      ["aria-label", "title", "content"].forEach((attribute) => {
        if (element.hasAttribute(attribute)) element.setAttribute(attribute, translate(element.getAttribute(attribute)));
      });
    });
    document.title = translate(document.title);
  }

  const developerContent = document.querySelector('[data-developer-content]');
  if (developerContent && window.ENV_DEVELOPER_CONTENT?.[locale]) {
    developerContent.innerHTML = window.ENV_DEVELOPER_CONTENT[locale];
    const title = locale === 'en' ? 'Developer Guide' : locale === 'ja' ? '開発者ガイド' : locale === 'zh-Hant' ? '開發參考' : '开发参考';
    document.title = title;
    const metadata = window.ENV_DEVELOPER_META?.[locale];
    if (metadata) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', metadata.description);
      document.querySelector('meta[name="apple-mobile-web-app-title"]')?.setAttribute('content', metadata.title);
    }
  }
  const siteNames = {
    "zh-Hans": "青萍环境评级指南",
    "zh-Hant": "青萍環境評級指南",
    en: "Qingping Environmental Rating Guide",
    ja: "Qingping 環境評価ガイド"
  };
  const pageNames = {
    "indicators.html": {"zh-Hans":"环境指标解读","zh-Hant":"環境指標解讀",en:"Environmental Metrics Explained",ja:"環境指標の読み解き"},
    "design.html": {"zh-Hans":"设计参考","zh-Hant":"設計參考",en:"Design Reference",ja:"デザイン資料"},
    "developer.html": {"zh-Hans":"开发参考","zh-Hant":"開發參考",en:"Developer Guide",ja:"開発者ガイド"}
  };
  const siteName = siteNames[locale];
  const pageName = pageNames[window.location.pathname.split('/').pop()]?.[locale];
  document.title = pageName ? `${pageName}${locale === 'en' ? ' | ' : '｜'}${siteName}` : siteName;
  document.querySelector('meta[name="apple-mobile-web-app-title"]')?.setAttribute('content', siteName);
  document.querySelectorAll('.brand > span, .footer-brand > span').forEach(node => { node.textContent = siteName; });
  const homeLabel = locale === 'en' ? `${siteName} home` : locale === 'ja' ? `${siteName} ホーム` : `${siteName}首頁`;
  document.querySelector('.brand')?.setAttribute('aria-label', locale === 'zh-Hans' ? `${siteName}首页` : homeLabel);
  document.documentElement.lang = locale === "zh-Hans" ? "zh-CN" : locale === "zh-Hant" ? "zh-Hant" : locale;
  document.querySelectorAll("[data-copy-key]").forEach((element) => {
    const copy = window.ENV_METRIC_COPY?.[locale]?.[element.dataset.copyKey];
    if (copy != null) element.textContent = copy;
  });
  document.querySelectorAll('a[href^="index.html"], a[href^="indicators.html"], a[href^="design.html"], a[href^="developer.html"]').forEach((link) => {
    const destination = new URL(link.getAttribute("href"), window.location.href);
    if (locale === "zh-Hans") destination.searchParams.delete("lang");
    else destination.searchParams.set("lang", locale);
    link.href = `${destination.pathname.split("/").pop()}${destination.search}${destination.hash}`;
  });
  const scrollKey = "environment-language-scroll";
  document.querySelectorAll("[data-language]").forEach((link) => {
    const language = link.dataset.language;
    const destination = new URL(window.location.href);
    if (language === "zh-Hans") destination.searchParams.delete("lang");
    else destination.searchParams.set("lang", language);
    link.href = `${destination.pathname}${destination.search}${destination.hash}`;
    if (language === locale) link.setAttribute("aria-current", "true");
    link.addEventListener("click", (event) => {
      if (language === locale) { event.preventDefault(); return; }
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      try { sessionStorage.setItem(scrollKey, JSON.stringify({ path: destination.pathname, bottom: document.documentElement.scrollHeight - window.innerHeight - window.scrollY })); } catch {}
    });
  });
  try {
    const saved = JSON.parse(sessionStorage.getItem(scrollKey) || "null");
    sessionStorage.removeItem(scrollKey);
    if (saved?.path === window.location.pathname) {
      window.addEventListener("load", () => {
        window.scrollTo({ top: document.documentElement.scrollHeight - window.innerHeight - saved.bottom, behavior: "instant" });
      }, { once: true });
    }
  } catch {}
})();

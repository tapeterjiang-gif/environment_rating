# 环境评级指南网页

面向普通用户的静态网页，包含：

- `dist/index.html`：合并后的环境评级、图标与颜色指南
- `dist/colors.html`：旧颜色说明链接的兼容跳转页
- `dist/snow-settings.html`：Snow 720 × 720 环境评级标准设置示例

页面不依赖框架或外部资源，可直接静态托管，并通过页头菜单切换简体中文、繁體中文、English 和日本語。语言写入 `?lang=` 参数，可直接分享对应语言地址。在线版本：
[环境评级指南](https://tapeterjiang-gif.github.io/environment_rating/)。

[Snow 设置页示例](https://tapeterjiang-gif.github.io/environment_rating/snow-settings.html)提供颗粒物、甲醛和相对湿度的标准选择，也列出并默认选中 CO₂、冷热感、噪声和照度的唯一依据。支持简体中文、繁體中文、英文和日语。示例将选择保存在当前浏览器，不会连接或更改设备设置。集成到 Snow 时，应把保存动作接入设备设置接口，并在切换标准时同步调整测量结果的平均时间口径。

页眉采用[青萍品牌规范](https://tapeterjiang-gif.github.io/qingping-brand/)的青萍蓝 SVG 字标（`#073B53`，宽 80 px、按原比例显示），浏览器图标采用同源约 20% 圆角的 SVG favicon。两项素材均随页面本地提供；ICO 保留为兼容回退。

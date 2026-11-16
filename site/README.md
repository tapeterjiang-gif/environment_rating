# 环境评级指南网页

面向普通用户的静态网页，包含：

- `dist/index.html`：评级方法、整体规则和评级依据
- `dist/indicators.html`：环境指标解读，包含各参数分档图示与读数说明
- `dist/design.html`：设计参考，提供图标 SVG、颜色值、16 套标准的名称/简介/组织，以及 14 项指标简介与可展开的分档提示
- `dist/developer.html`：开发参考，展示文案格式、生成流程、评级映射及各平台接入示例
- `dist/colors.html`：旧颜色说明链接的兼容跳转页，转至设计参考

页面不依赖框架或外部资源，可直接静态托管。PM、甲醛、O₃、CO、SO₂ 和花粉可在指标解读页切换评级依据；四个页面均支持简体中文、繁體中文、English 和日本語。语言写入 `?lang=` 参数，可分享对应语言地址。主页面保留旧分类锚点的自动跳转。发布地址为 [环境评级指南](https://tapeterjiang-gif.github.io/environment_rating/)；其他页面发布后位于同目录。


页眉采用[青萍品牌规范](https://tapeterjiang-gif.github.io/qingping-brand/)的青萍蓝 SVG 字标（`#073B53`，宽 80 px、按原比例显示），浏览器图标采用同源约 20% 圆角的 SVG favicon。两项素材均随页面本地提供；ICO 保留为兼容回退。

指标简介与分档文案来自根目录 `content/`。更新四语言源文件后，执行 `node scripts/generate-copy.mjs`；生成器会同步设计参考页的文案板块与 `dist/rating-copy.js`。详见[跨平台文案资源](../content/README.md)。

开发参考页从 `content/README.md` 及 `content/guides/` 的三个翻译版本生成。更新文档后运行 `node scripts/generate-developer-page.mjs`；使用 `--check` 检查网页是否同步。

开发参考页的下载文件位于 `dist/downloads/`，随 GitHub Pages 一起静态发布。更新顺序：生成文案 → `node scripts/package-copy.mjs` → 生成开发参考页。打包脚本支持 `--check`，下载清单 `index.json` 记录文件大小、SHA-256 和包内文件列表。

发布前运行 `node scripts/version-site-assets.mjs`，为各页面引用的 CSS 和 JavaScript 添加基于内容的版本号，避免新版页面使用缓存中的旧资源。GitHub Pages 部署流程也会自动执行。

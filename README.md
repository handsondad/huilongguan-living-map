# 🎈 我家住在回龙观 / Huilongguan Living Map

从孩子的高度认识回龙观：首页是一张糖果色的回龙观卡通地图，地图上冒出一个个泡泡；点开泡泡是一组「小念 × 爸爸」的一问一答，配上代码画的 SVG 图解与小互动，讲清楚家门口的路、地铁、公园、学校、水、暖气和老地名。

在线访问：<https://handsondad.github.io/huilongguan-living-map/>

## 网站里有什么

- **首页卡通地图**：基于 OpenStreetMap 的真实道路、13 号线 / 8 号线 / 18 号线、自行车专用路、公园水系与回龙观、龙泽园、史各庄三个街道边界绘制；支持拖拽、缩放、按六个主题分类筛选泡泡。
- **28 个主题泡泡、62 篇问答**：小念从日常散步遇到的真事发问，爸爸回答，小念接着爸爸上一句里的词追问，5–8 轮一路聊明白，最后小念用自己的话总结。
- **11 种互动图解**：自行车路骑行、坡道传送带、潮汐车道拨钟、13 / 18 号线开车示意图、车站定名小地图、三个街道边界、里程与年份尺子、竞速对比、翻卡猜一猜等。
- **有据可查**：正文与图解里的日期、数字和规定都标了出处角标，页尾列出真实资料链接，给大人的折叠提示里补充背景与安全提醒。

## 本地运行

需要 Node.js 22.18+（检查脚本直接用 Node 跑 `.ts` 文件）。

```bash
npm install
npm run dev
```

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器 |
| `npm run typecheck` | TypeScript 类型检查 |
| `npm run check` | 检查全部问答的对话规则、站点名与资料引用 |
| `npm run build` | 生产构建，输出到 `dist/` |
| `npm run preview` | 本地预览生产构建结果 |
| `npm run osm` | 重新从 OpenStreetMap 抓取并生成 `src/map/geo.json` |

## 部署

推送到 `main` 后，`.github/workflows/deploy.yml` 会自动执行类型检查、问答规则检查、构建，并发布到 GitHub Pages（仓库 Settings → Pages → Source 选 **GitHub Actions**）。

资源路径使用相对路径（`base: './'`），路由使用 `#/...`，放在 `/huilongguan-living-map/` 子路径下直接访问或刷新都不会 404。

## 目录结构

| 位置 | 内容 |
| --- | --- |
| `src/map/` | 首页可缩放卡通地图、泡泡避让与街道名排布、`geo.json` 底图数据 |
| `src/topics/` | 各个主题泡泡与小念 × 爸爸问答（新增主题放到 `src/topics/<id>/topic.ts` 会自动收录） |
| `src/shows/` | 问答里的 SVG 图解与互动组件 |
| `src/pages/` | 首页、主题列表页、问答页、页头定位小地图与资料来源 |
| `src/render/` | 角色头像、引用角标、视口动效与状态保存 |
| `tools/` | 对话规则检查 `dialogue-rules.mjs` 与 OSM 数据抓取 `osm.mjs` |

## 数据署名

地图底图数据 © [OpenStreetMap](https://www.openstreetmap.org/copyright) 贡献者。

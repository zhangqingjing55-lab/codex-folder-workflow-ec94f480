# Codex Folder Workflow

可修改的 Remotion 竖屏动画：小人把候选图片扔进文件夹，依据人工判断移出不一致的图片。

- **Workflow**：1080 × 1920、30 fps、18 秒，六部分各 3 秒。
- **FolderSequence**：同尺寸，6 秒，包含收集与筛选两部分。
- 当前无配音、无音乐；所有动作由 Remotion 帧数驱动，暂停、拖动及重复渲染可得到相同结果。

## 运行

需要 Node.js 22 或更高版本。

```bash
npm ci
npm run start
```

## 渲染

```bash
npm run typecheck
npm run render          # out/Workflow.mp4
npm run render:folder   # out/FolderSequence.mp4
npm run stills          # 关键帧
```

本机已安装 Chrome 时，可指定其路径以避免另下载浏览器：

```bash
CHROME_PATH="/path/to/chrome" npm run render
```

脚本会自动识别 macOS 标准安装路径；其他环境使用 Remotion 的默认浏览器流程。依赖版本固定，`package-lock.json` 提供可重复安装。

## 修改位置

| 文件 | 内容 |
| --- | --- |
| `src/content.json` | 标题、提示词、角色标签、文件夹标签、配色与时长 |
| `src/FolderScene.tsx` | 小人、文件夹、图卡、抛入与剔除动作 |
| `src/motion.ts` | 抛物线、落点、先快后慢的出图时间 |
| `src/Workflow.tsx` | 六段叙事与画面排版 |
| `src/index.tsx` | Remotion 合成入口 |
| `public/images/` | 项目持有人提供的真实成果图；输出副本已去掉源 PNG 元数据 |

图卡依次抛出，后续间隔更长、飞行更慢；角色有预备、抛出和回弹动作。筛选阶段先显示人工判断，再将不合适的卡片移出画面。图卡是示意，不代表历史训练集或准确数量。

## 来源与范围

按项目持有人的要求，借鉴 [Motionface 的 astra-motion 片段](https://motionface.cc/?recording=ec94f480-6905-44ad-918b-fd4da19c5a25) 中“小人搬运、抛接、操作素材”的动作思路，重新设计为文件夹场景。没有完整复刻参考片，也没有包含其原视频、角色贴图、音轨或签名下载地址。分析见 [docs/reference-analysis.md](docs/reference-analysis.md)。

小人是为本项目独立绘制的向量演示角色，CODEX 为用户要求的角色标签，不表示官方吉祥物或品牌背书。AI 输入界面在本版以原生 React 组件重写，不包含此前镜头库的源码。

真实成果图属于项目持有人提供的素材，未另行授予再分发许可。Remotion 与其他依赖遵循各自许可证。仓库不含客户身份、聊天记录、交易记录、账户信息、绑定凭证或参考视频。

## 当前节奏

0–3 秒成品；3–6 秒输入；6–9 秒收集；9–12 秒筛选；12–15 秒训练与生图；15–18 秒报告组装。

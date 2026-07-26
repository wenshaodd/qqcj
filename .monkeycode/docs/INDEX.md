# MusicFree Skills 文档

MusicFree Skills 是开源音乐播放器 [MusicFree](https://github.com/maotoumao/MusicFree) 的 AI Agent Skills 合集。本目录包含项目的架构文档、接口规范、开发者指南、核心概念和模块说明，面向社区贡献者和 Skill 维护者。

**快速链接**: [架构](./ARCHITECTURE.md) | [接口](./INTERFACES.md) | [开发者指南](./DEVELOPER_GUIDE.md)

---

## 核心文档

### [架构](./ARCHITECTURE.md)
系统设计、技术栈、项目结构、子系统和架构图。了解 MusicFree Skills 的整体设计思路和模块划分。

### [接口](./INTERFACES.md)
插件方法协议（14 种方法完整契约）、CSS 变量接口（150+ 变量、5 级覆盖等级）、媒体类型定义。集成开发或使用 Skills 的参考。

### [开发者指南](./DEVELOPER_GUIDE.md)
环境搭建、项目结构说明、开发工作流、常见任务和编码规范。Skill 维护者必读。

---

## 模块

| 模块 | 描述 | 文档 |
|------|------|------|
| `musicfree-plugin-dev` | 插件开发 Skill：站点分析、接口逆向、代码生成和测试 | [README](./模块/musicfree-plugin-dev.md) |
| `musicfree-themepack-dev` | 主题包开发 Skill：色彩设计、CSS 变量映射和打包测试 | [README](./模块/musicfree-themepack-dev.md) |

---

## 核心概念

理解这些概念有助于导航代码库：

| 概念 | 描述 |
|------|------|
| [插件方法协议](./专有概念/插件方法协议.md) | 14 种插件方法的完整契约，回调模式、参数和返回值约定 |
| [媒体类型](./专有概念/媒体类型.md) | 7 种数据实体接口定义（歌曲、专辑、歌手、歌单、评论等） |
| [CSS 变量体系](./专有概念/CSS变量体系.md) | 150+ 个语义化 CSS 变量，5 级覆盖等级，18 大类 |

---

## 入门指南

### 项目新人？

按此路径学习：
1. **[README](../../README.md)** — 了解项目概况和安装方式
2. **[架构](./ARCHITECTURE.md)** — 了解整体设计
3. **[核心概念](#核心概念)** — 学习领域术语
4. **[开发者指南](./DEVELOPER_GUIDE.md)** — 搭建环境和贡献

### 想要开发插件/主题？

1. 安装 Skills: `npx skills add maotoumao/musicfree-skills`
2. 在 AI 编程助手中描述你的需求
3. AI 会自动加载对应 Skill 并引导你完成开发

### 首次贡献？

1. **[开发者指南](./DEVELOPER_GUIDE.md)** — 搭建和工作流
2. **[常见任务](./DEVELOPER_GUIDE.md#常见任务)** — 分步指南
3. 从修改 `references/` 下的文档开始（低风险、高价值）

---

## 快速参考

### 安装

```bash
npx skills add maotoumao/musicfree-skills
```

### 重要文件

| 文件 | 目的 |
|------|------|
| `skills/musicfree-plugin-dev/SKILL.md` | 插件开发 Skill 主指令 |
| `skills/musicfree-themepack-dev/SKILL.md` | 主题开发 Skill 主指令 |
| `skills/musicfree-plugin-dev/references/plugin-protocol.md` | 14 种方法完整协议 |
| `skills/musicfree-themepack-dev/references/css-variable-reference.md` | 150+ CSS 变量参考 |
| `README.md` | 项目总体介绍与安装说明 |
| `LICENSE` | GNU AGPL-3.0 |

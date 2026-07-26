# musicfree-themepack-dev

从零开发 MusicFree 桌面版主题包的完整 Skill。指导 AI 完成色彩设计、CSS 变量映射、增强效果配置和打包测试。

## 结构

```
musicfree-themepack-dev/
├── SKILL.md                         # 主指令（行为准则 + 8 阶段工作流）
└── references/
    ├── color-paradigms.md           # 4 种色彩推导范式
    ├── css-variable-reference.md    # 150+ CSS 变量完整参考（5 级覆盖）
    ├── iframe-guide.md              # iframe 动态背景开发指南
    └── packaging-checklist.md       # 打包测试与发布检查清单
```

## 关键文件

| 文件 | 目的 |
|------|------|
| `SKILL.md` | AI 行为准则、8 阶段工作流、config.json 字段说明、资源限制表、预定义标签列表 |
| `references/color-paradigms.md` | 4 种色彩推导范式（单品牌色/情绪词/参考图/对偶反转）+ 3 种特殊风格 |
| `references/css-variable-reference.md` | 18 大类别、约 150+ 个 CSS 变量，分 5 级覆盖等级 |
| `references/iframe-guide.md` | Canvas 粒子效果、CSS 动态渐变、blurHash 占位符、性能要求 |
| `references/packaging-checklist.md` | 打包命令、9 区域视觉验证、常见故障排查、主题市场提交流程 |

## 依赖

**本模块依赖**:
- Agent Skills 标准 — 遵循 SKILL.md + references/ 格式
- MusicFree 主题系统 — 提供 150+ 个 CSS 变量作为覆盖目标

**依赖本模块的**:
- AI 编程助手 — 加载此 Skill 后辅助用户设计主题
- 社区贡献者 — 通过 AI 对话间接使用 Skill 中的知识

## 规范

### AI 行为准则

1. **视觉产物需用户确认** — 任何颜色方案都必须展示给用户确认
2. **先确认再动手** — 确认后再生成代码
3. **解释技术术语** — 对非专业用户解释 color-scheme / 色彩空间等概念
4. **最小覆盖原则** — 只覆盖需要改变的变量
5. **浅色主题例外** — 浅色主题默认需覆盖更多变量

### 色彩推导范式

**范式 A：单品牌色推导**
- 输入：一个品牌色（如 `#1DB954`）
- 输出：完整的暗色调色板（Background/Text/Fill/Border）
- 适用于：有明确品牌色的需求

**范式 B：情绪/氛围词推导**
- 输入：情绪关键词（如"赛博朋克"）
- 输出：从 9 种情绪-色彩映射表推导调色板
- 适用于：模糊的氛围描述

**范式 C：参考图/应用提取**
- 输入：参考图片或应用截图
- 输出：从图片提取主色调后推导完整调色板
- 适用于：有视觉参考的需求

**范式 D：对偶反转**
- 输入：一个已有的调色板
- 输出：反转后的调色板（暗色→浅色 或 浅色→暗色）
- 适用于：同一主题的亮/暗双模版本

### 特殊风格

| 风格 | 特征 | 特殊覆盖变量 |
|------|------|-------------|
| AMOLED 纯黑 | bg-0 为 `#000`，极简对比 | 大部分 fill 使用纯黑 |
| Glassmorphism | 半透明模糊背景 | Blur + 低透明度 Fill |
| Flat Design | 无渐变/阴影，纯色块 | Shadow 全部置零 |

### 主题增强层

在基础 CSS 变量覆盖完成后，可添加增强效果：

```css
/* CSS 渐变背景 */
:root {
  --musicfree-bg-image: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 100%
  );
}

/* 阴影调整 */
:root {
  --musicfree-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --musicfree-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* iframe 动态背景引用 */
:root {
  --musicfree-bg-iframe: url('./background.html');
}
```

### 打包与测试

主题包文件结构：
```
my-theme.mftheme/
├── config.json       # 主题元数据（名称、作者、版本、标签）
├── index.css         # CSS 变量覆盖
└── assets/           # 可选资源（图片、iframe 背景等）
```

## 添加新色彩推导范式

1. 在 `references/color-paradigms.md` 中添加新范式
2. 描述适用场景和推导步骤
3. 提供调色板示例

**检查清单**:
- [ ] 范式有明确的输入和输出定义
- [ ] 提供了至少一个完整的调色板示例
- [ ] 与现有范式无重复

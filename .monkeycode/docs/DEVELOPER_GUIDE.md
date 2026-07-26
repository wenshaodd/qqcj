# MusicFree Skills 开发者指南

## 项目目的

MusicFree Skills 是 MusicFree 音乐播放器的 AI Agent Skills 合集。它在 MusicFree 生态中承担"开发工具链"的角色——将插件开发和主题包开发的专业知识编码为 AI 可读取的 Skill 文档，使社区贡献者通过自然语言与 AI 对话即可完成开发。

**核心职责**:
- 将插件协议、媒体类型、CSS 变量体系等专业知识标准化为 Skill 文档
- 约束 AI 在开发过程中的行为，防止盲猜、捏造等不良行为
- 降低插件/主题开发的技术门槛

**相关系统**:
- [MusicFree](https://github.com/maotoumao/MusicFree) — 目标音乐播放器，Skill 的全部产出均服务于它
- [Agent Skills](https://agentskills.io/) — 遵循的 Skill 分发标准
- npm registry — 通过 `npx skills add` 安装

## 环境搭建

### 前置条件

- Node.js >= 18（用于运行 `npx skills add` 命令）
- 支持 Agent Skills 的 AI 编程助手（Claude Code、Codex CLI 等）
- Git（用于克隆和贡献）

### 安装

```bash
# 安装两个 Skill 到本地 AI 环境
npx skills add maotoumao/musicfree-skills
```

安装后，Skill 会被注册到本地 AI 编程助手的 Skills 列表中。当用户提出与插件或主题开发相关的需求时，AI 会自动加载对应的 Skill。

### 开发/测试 Skill

本项目为纯 Markdown 文档，修改 SKILL.md 或 references/ 下的文档后，通常需要重新安装才能生效：

```bash
# 先卸载
npx skills remove musicfree-plugin-dev
npx skills remove musicfree-themepack-dev

# 重新安装
npx skills add maotoumao/musicfree-skills
```

若在本地开发中，可使用本地路径安装进行快速迭代：

```bash
npx skills add ./path/to/musicfree-skills/skills/musicfree-plugin-dev
npx skills add ./path/to/musicfree-skills/skills/musicfree-themepack-dev
```

### 环境变量

本项目无需环境变量。Skill 文档中不包含任何密钥或敏感信息。

## 项目结构说明

```
musicfree-skills/
├── README.md                    # 项目总体介绍与使用方式
├── README_en.md                 # 英文版 README
├── LICENSE                      # GNU AGPL-3.0
└── skills/                      # Skill 根目录
    ├── musicfree-plugin-dev/    # 插件开发 Skill
    │   ├── SKILL.md             # 主指令（行为准则 + 工作流）
    │   └── references/          # 深度参考文档
    │       ├── plugin-protocol.md        # 14 种插件方法完整协议
    │       ├── media-types.md            # 7 种媒体类型接口定义
    │       └── site-analysis-playbook.md  # 站点分析操作手册
    └── musicfree-themepack-dev/ # 主题包开发 Skill
        ├── SKILL.md             # 主指令（行为准则 + 工作流）
        └── references/          # 深度参考文档
            ├── color-paradigms.md         # 4 种色彩推导范式
            ├── css-variable-reference.md   # 150+ CSS 变量完整参考
            ├── iframe-guide.md             # iframe 动态背景开发指南
            └── packaging-checklist.md      # 打包测试检查清单
```

## 开发工作流

### 贡献 Skill 文档

本项目欢迎社区贡献插件开发模板、主题预设方案、站点分析用例等。

### 分支策略

- `main` — 稳定版本，可被用户安装使用
- `feature/*` — 新 Skill 或 Skill 功能增强
- `fix/*` — 文档错误修正

### 提交流程

1. Fork 本仓库并从 `main` 创建功能分支
2. 修改对应的 SKILL.md 或 references/ 文档
3. 提交前检查：
   - Markdown 格式正确
   - 链接引用有效
   - 代码示例语法正确
   - 无敏感信息
4. 创建 Pull Request 并描述改动内容
5. 等待维护者审查

### 代码质量工具

本项目为纯文档项目，无需 lint、format、test 等工具。质量保障依赖人工审查：
- 文档准确性：协议定义与实际 MusicFree 运行时行为一致
- 代码示例可运行性：SKILL.md 中的代码骨架可在沙箱环境中正确执行
- 行为准则完备性：约束覆盖常见的 AI 偏差场景

## 常见任务

### 添加新的插件方法协议

**需修改的文件**:
1. `skills/musicfree-plugin-dev/references/plugin-protocol.md` — 添加新方法协议定义
2. `skills/musicfree-plugin-dev/SKILL.md` — 更新方法速查表和代码骨架示例

**步骤**:
1. 在 `plugin-protocol.md` 中添加新方法的完整协议（参数、返回值、代码示例）
2. 在 `SKILL.md` 的方法速查表中新增对应行
3. 在插件骨架代码中添加对应方法的方法实现示例
4. 确保新方法符合现有回调模式约定

### 添加新的 CSS 变量

**需修改的文件**:
1. `skills/musicfree-themepack-dev/references/css-variable-reference.md` — 添加变量定义
2. 可能需要更新 `SKILL.md` 中的覆盖等级说明

**步骤**:
1. 在对应类别下添加新变量名、类型和说明
2. 确定覆盖等级（必须/建议/风格/慎重/禁止）
3. 确保变量命名遵循 `--musicfree-{category}-{name}` 约定

### 添加新的站点分析用例

**需修改的文件**:
1. `skills/musicfree-plugin-dev/references/site-analysis-playbook.md` — 添加分析案例

**步骤**:
1. 描述目标站点的特征（静态/动态/API 类型）
2. 提供分析过程的步骤和关键发现
3. 包含代码示例（Playwright 脚本、API 调用等）
4. 标注签名/加密参数的处理方式（如有）

### 添加新的色彩推导范式

**需修改的文件**:
1. `skills/musicfree-themepack-dev/references/color-paradigms.md` — 添加新范式

**步骤**:
1. 描述范式的适用场景
2. 提供从输入到输出的完整推导步骤
3. 给出 1-2 个调色板示例
4. 与现有范式做对比说明

## 编码规范

### 文件命名

| 类型 | 约定 | 示例 |
|------|------|------|
| Skill 目录 | kebab-case | `musicfree-plugin-dev/` |
| 主指令 | `SKILL.md`（固定名） | `SKILL.md` |
| 参考文档 | kebab-case | `plugin-protocol.md` |

### Markdown 规范

- 使用 `##` 作为顶级标题（`#` 留给 SKILL.md 的名称行）
- 代码块标注语言: ` ```javascript `, ` ```css `, ` ```bash `, ` ```mermaid `
- 表格对齐: 左对齐即可，不需要居中或右对齐
- 行宽不限，但保持逻辑段落清晰

### 代码示例规范

插件代码示例使用 CommonJS 模块格式：

```javascript
module.exports = {
  platform: '示例平台',
  search(query, page, callback) {
    // 实现逻辑
  }
};
```

### 行为准则编写规范

在 SKILL.md 开头的行为准则部分，每个准则应包含：
1. 禁止项（具体不可操作的行为）
2. 理由（为什么禁止）
3. 替代做法（应该怎么做）

示例：

```markdown
### 禁止盲猜 URL
- 禁止在没有请求过站点的情况下，假定任何 API 地址或 URL 格式
- 理由：URL 路径通常无规律可循，猜测成功率极低
- 替代：使用站点分析工具实际访问并捕获请求
```

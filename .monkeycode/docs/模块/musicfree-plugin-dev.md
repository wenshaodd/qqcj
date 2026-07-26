# musicfree-plugin-dev

从零开发 MusicFree 音乐源插件的完整 Skill。指导 AI 完成目标站点分析、数据接口逆向、插件代码生成和自动化测试的完整流程。

## 结构

```
musicfree-plugin-dev/
├── SKILL.md                         # 主指令（行为准则 + 8 步工作流 + 代码骨架）
└── references/
    ├── plugin-protocol.md           # 14 种插件方法完整协议定义
    ├── media-types.md               # 7 种媒体类型接口定义
    └── site-analysis-playbook.md    # 站点分析操作手册
```

## 关键文件

| 文件 | 目的 |
|------|------|
| `SKILL.md` | AI 行为准则、8 步开发工作流、插件骨架代码、方法速查表 |
| `references/plugin-protocol.md` | 14 种方法的完整协议：签名、参数类型、返回值结构、代码示例 |
| `references/media-types.md` | IMusicItem / IAlbumItem / IArtistItem / IMusicSheetItem / IComment / ILyricSource / IMusicSheetGroupItem 的字段定义 |
| `references/site-analysis-playbook.md` | 静态/动态站点分析方法论、Playwright 脚本模板、crypto-js 签名复现示例 |

## 依赖

**本模块依赖**:
- Agent Skills 标准 — 遵循 SKILL.md + references/ 格式
- MusicFree 插件沙箱运行时 — 提供 8 个内置模块（axios, cheerio, crypto-js 等）

**依赖本模块的**:
- AI 编程助手 — 加载此 Skill 后辅助用户开发插件
- 社区贡献者 — 通过 AI 对话间接使用 Skill 中的知识

## 规范

### AI 行为准则

此 Skill 的核心功能之一是约束 AI 行为。在 SKILL.md 中定义了严格的准则：

1. **禁止盲猜 URL** — 绝不假定 API 地址，必须实际请求分析
2. **禁止搜索网络找 API** — 不通过搜索引擎查找 API 文档
3. **禁止批量探测** — 不进行端口扫描或路径爆破
4. **禁止复制现成插件** — 需理解后重写
5. **最小化用户操作** — 用户仅需提供 URL 和确认

### 开发模式

根据目标站点特征，AI 会选择以下三种开发模式之一：

**模式一：公开 JSON API 对接**
```javascript
module.exports = {
  platform: '示例平台',
  search(query, page, callback) {
    axios.get(`https://api.example.com/search?q=${query}&page=${page}`)
      .then(res => callback(null, mapToMusicItems(res.data)))
      .catch(err => callback(err));
  }
};
```

**模式二：静态 HTML 解析**
```javascript
module.exports = {
  platform: '示例平台',
  search(query, page, callback) {
    axios.get(`https://example.com/search?q=${query}&page=${page}`)
      .then(res => {
        const $ = cheerio.load(res.data);
        const items = [];
        $('.song-item').each((i, el) => {
          items.push({
            id: $(el).find('.song-link').attr('href'),
            title: $(el).find('.song-title').text(),
            artist: $(el).find('.song-artist').text(),
            platform: '示例平台'
          });
        });
        callback(null, { isEnd: items.length === 0, data: items });
      })
      .catch(err => callback(err));
  }
};
```

**模式三：直接拼接 URL**
```javascript
module.exports = {
  platform: '示例音源',
  getMediaSource(musicItem, quality, callback) {
    callback(null, {
      url: `https://cdn.example.com/music/${musicItem.id}.mp3`
    });
  }
};
```

### 错误处理

所有错误必须通过 `callback(error)` 返回，不可 `throw`：
```javascript
// 正确
callback(new Error('请求超时'));

// 错误
throw new Error('请求超时');
```

### 测试

SKILL.md 包含自动化测试脚本模板，AI 会：
1. 生成测试代码
2. 在沙箱中执行
3. 根据失败信息迭代修复
4. 验证通过后输出最终插件文件

## 添加新方法协议

1. 在 `references/plugin-protocol.md` 中添加新方法定义（参数、返回值、示例）
2. 在 `SKILL.md` 的方法速查表中新增行
3. 在骨架代码中添加对应方法实现示例

**检查清单**:
- [ ] 方法签名符合回调模式
- [ ] 返回值结构清晰，标注了必填/可选字段
- [ ] 提供了至少一个代码示例
- [ ] 更新了 SKILL.md 的速查表

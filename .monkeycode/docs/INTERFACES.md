# MusicFree Skills 接口文档

MusicFree Skills 项目是一个 AI Agent Skills 合集，本身不暴露 API、CLI 或 SDK 接口。其"接口"体现为两个维度：

1. **插件方法协议** — MusicFree 插件运行时与插件代码之间的契约，是插件开发 Skill 的核心产出规范
2. **CSS 变量接口** — MusicFree 主题系统暴露给主题包的 CSS Custom Properties，是主题开发 Skill 的核心映射目标

## 一、插件方法协议

MusicFree 插件通过 CommonJS 模块导出一个对象，对象包含若干方法，由 MusicFree 运行时按需调用。以下为全部 14 种方法的完整协议。

### 通用约定

- 所有方法签名使用回调模式: `(query, page, …args, callback)`
- `callback` 为 Node.js 风格回调: `callback(error, result)`
- `page` 从 1 开始，非 0 开始
- 返回数据必须符合对应的媒体类型（见 [媒体类型文档](./专有概念/媒体类型.md)）

### 1. search(query, page, callback)

搜索歌曲、专辑、歌手或歌单。

| 参数 | 类型 | 说明 |
|------|------|------|
| `query` | `string` | 搜索关键词 |
| `page` | `number` | 页码，从 1 开始 |
| `callback` | `(error, result) => void` | 结果回调 |

**返回值结构**: `{ isEnd: boolean, data: IMusicItem[] | IAlbumItem[] | IArtistItem[] | IMusicSheetItem[] }`

### 2. getMediaSource(musicItem, quality, callback)

获取歌曲的播放链接。

| 参数 | 类型 | 说明 |
|------|------|------|
| `musicItem` | `IMusicItem` | 歌曲对象 |
| `quality` | `string` | 音质 ('standard' / 'high' / 'super') |
| `callback` | `(error, result) => void` | 结果回调 |

**返回值结构**: `{ url: string, [headers?]: object, [userAgent?]: string }`

### 3. getLyric(musicItem, callback)

获取歌词。返回 LRC 格式文本。

| 参数 | 类型 | 说明 |
|------|------|------|
| `musicItem` | `IMusicItem` | 歌曲对象 |
| `callback` | `(error, result) => void` | 结果回调 |

**返回值结构**: `{ lyric: string, [translation?]: string }`（LRC 格式，含 `[mm:ss.xx]` 时间标签）

### 4. getMusicInfo(musicItem, callback)

获取歌曲详情（补充歌曲的更多元数据）。

| 参数 | 类型 | 说明 |
|------|------|------|
| `musicItem` | `IMusicItem` | 包含最少字段的歌曲对象 |
| `callback` | `(error, result) => void` | 结果回调 |

**返回值结构**: `IMusicItem`（完整字段）

### 5. getAlbumInfo(albumItem, page, callback)

获取专辑详情及曲目列表。

| 参数 | 类型 | 说明 |
|------|------|------|
| `albumItem` | `IAlbumItem` | 专辑对象 |
| `page` | `number` | 页码 |
| `callback` | `(error, result) => void` | 结果回调 |

**返回值结构**: `{ isEnd: boolean, albumItem: IAlbumItem, musicList: IMusicItem[] }`

### 6. getMusicSheetInfo(sheetItem, page, callback)

获取歌单详情及曲目列表。

| 参数 | 类型 | 说明 |
|------|------|------|
| `sheetItem` | `IMusicSheetItem` | 歌单对象 |
| `page` | `number` | 页码 |
| `callback` | `(error, result) => void` | 结果回调 |

**返回值结构**: `{ isEnd: boolean, sheetItem: IMusicSheetItem, musicList: IMusicItem[] }`

### 7. getArtistWorks(artistItem, page, type, callback)

获取歌手的作品列表（歌曲或专辑）。

| 参数 | 类型 | 说明 |
|------|------|------|
| `artistItem` | `IArtistItem` | 歌手对象 |
| `page` | `number` | 页码 |
| `type` | `'music'` \| `'album'` | 作品类型 |
| `callback` | `(error, result) => void` | 结果回调 |

**返回值结构**: `{ isEnd: boolean, data: IMusicItem[] | IAlbumItem[] }`

### 8. importMusicItem(urlLike, callback)

通过分享链接导入单首歌曲。

| 参数 | 类型 | 说明 |
|------|------|------|
| `urlLike` | `string` | 用户粘贴的链接或文本 |
| `callback` | `(error, result) => void` | 结果回调 |

**返回值结构**: `IMusicItem`

### 9. importMusicSheet(urlLike, callback)

通过分享链接导入歌单。

| 参数 | 类型 | 说明 |
|------|------|------|
| `urlLike` | `string` | 用户粘贴的链接或文本 |
| `callback` | `(error, result) => void` | 结果回调 |

**返回值结构**: `IMusicSheetItem[]`

### 10. getTopLists(callback)

获取排行榜分类列表。

| 参数 | 类型 | 说明 |
|------|------|------|
| `callback` | `(error, result) => void` | 结果回调 |

**返回值结构**: `IMusicSheetGroupItem[]`

### 11. getTopListDetail(topListItem, page, callback)

获取某个排行榜的详细曲目。

| 参数 | 类型 | 说明 |
|------|------|------|
| `topListItem` | `IMusicSheetItem` | 排行榜条目 |
| `page` | `number` | 页码 |
| `callback` | `(error, result) => void` | 结果回调 |

**返回值结构**: `{ isEnd: boolean, musicList: IMusicItem[] }`

### 12. getRecommendSheetTags(callback)

获取推荐歌单的分类标签。

| 参数 | 类型 | 说明 |
|------|------|------|
| `callback` | `(error, result) => void` | 结果回调 |

**返回值结构**: `{ data: ISheetTagsItem[] }`

### 13. getRecommendSheetsByTag(tag, page, callback)

根据分类标签获取推荐歌单列表。

| 参数 | 类型 | 说明 |
|------|------|------|
| `tag` | `object` | `getRecommendSheetTags` 返回的标签对象 |
| `page` | `number` | 页码 |
| `callback` | `(error, result) => void` | 结果回调 |

**返回值结构**: `{ isEnd: boolean, data: IMusicSheetItem[] }`

### 14. getMusicComments(musicItem, page, callback)

获取歌曲评论。

| 参数 | 类型 | 说明 |
|------|------|------|
| `musicItem` | `IMusicItem` | 歌曲对象 |
| `page` | `number` | 页码 |
| `callback` | `(error, result) => void` | 结果回调 |

**返回值结构**: `{ isEnd: boolean, data: IComment[] }`

## 二、CSS 变量接口

MusicFree 主题包通过 `:root {}` 选择器覆盖内置 CSS Custom Properties。共有约 150+ 个变量，分 5 级覆盖等级：

### 覆盖等级说明

| 等级 | 含义 | 说明 |
|------|------|------|
| 必须 | 必须覆盖 | 主题包的核心，缺失会导致视觉不一致 |
| 建议 | 建议覆盖 | 提升主题完整度，不覆盖影响较小 |
| 风格 | 选择性覆盖 | 特定风格需要（如渐变、阴影、模糊） |
| 慎重 | 谨慎覆盖 | 改动可能破坏可读性或布局 |
| 禁止 | 禁止覆盖 | 覆盖会破坏 UI 功能（Z-Index、间距、排版等） |

### 变量分类索引

| 类别 | 变量数 | 覆盖等级 | 说明 |
|------|--------|---------|------|
| Background | 11 | 必须 | 背景色，按 UI 海拔递增（-1 到 9） |
| Fill (品牌) | 3 | 必须 | 品牌色/主色调填充 |
| Fill (中性) | 3 | 必须 | 中性灰色标填充 |
| Fill (弱填充) | 2 | 建议 | 低强调填充 |
| Text | 7 | 必须 | 文字颜色，5 级灰度 + 强调色 + 补充色 |
| Border | 5 | 必须 | 边框颜色，含 hover/focus 变体 |
| Focus Ring | 2 | 建议 | 聚焦环颜色 |
| Status (Info) | 3 | 建议 | 信息状态色 |
| Status (Warning) | 3 | 建议 | 警告状态色 |
| Status (Danger) | 3 | 建议 | 危险状态色 |
| Status (Success) | 3 | 建议 | 成功状态色 |
| Status (Favorite) | 2 | 建议 | 收藏状态色 |
| Background Image | 1 | 风格 | 全局背景图片 URL |
| Shadow | 7 | 风格 | 阴影效果 |
| Blur | 7 | 风格 | 模糊效果 |
| Radius | 7 | 风格 | 圆角尺寸 |
| Z-Index | 11 | 禁止 | 层级索引 |
| Typography | 29 | 禁止 | 字体大小/行高/字重 |
| Motion | 11 | 禁止 | 过渡/动效时长和缓动 |
| Opacity | 6 | 禁止 | 透明度 |
| Layout | 6 | 禁止 | 布局尺寸 |
| Control Sizes | 3 | 禁止 | 控件尺寸 |
| Spacing | 15 | 禁止 | 内边距/外边距 |
| Icon Sizes | 6 | 禁止 | 图标尺寸 |

### 核心变量速查

```css
:root {
  /* 背景色 (海拔递增) */
  --musicfree-bg-0: #000000;    /* 最低海拔：根背景 */
  --musicfree-bg-1: #0a0a0a;    /* 一级子面板 */
  --musicfree-bg-2: #141414;    /* 二级子面板 */
  /* ... 到 --musicfree-bg-9 */

  /* 品牌色 */
  --musicfree-fill-brand: #1DB954;
  --musicfree-fill-brand-hover: #1ED760;
  --musicfree-fill-brand-active: #169C46;

  /* 文字色 */
  --musicfree-text-primary: #FFFFFF;
  --musicfree-text-secondary: #B3B3B3;
  --musicfree-text-tertiary: #727272;
  --musicfree-text-quaternary: #404040;
  --musicfree-text-quinary: #282828;
  --musicfree-text-emphasis: #1DB954;
  --musicfree-text-supplementary: #B3B3B3;

  /* 边框色 */
  --musicfree-border-primary: #333333;
  --musicfree-border-secondary: #282828;
  --musicfree-border-hover: #535353;
  --musicfree-border-focus: #1DB954;
  --musicfree-border-active: #727272;
}
```

完整变量列表详见 `skills/musicfree-themepack-dev/references/css-variable-reference.md`。

## 三、媒体类型接口

插件方法返回的数据必须符合以下接口定义。详见 [媒体类型](./专有概念/媒体类型.md)。

### IMediaBase（基础接口，所有类型的基类）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `string` | 是 | 资源唯一标识 |
| `platform` | `string` | 是 | 插件标识（平台名） |

### IMusicItem（歌曲）

继承 `IMediaBase`，额外字段：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | 是 | 歌曲名 |
| `artist` | `string` | 是 | 歌手名 |
| `artistId` | `string` | 否 | 歌手 ID |
| `album` | `string` | 否 | 专辑名 |
| `albumId` | `string` | 否 | 专辑 ID |
| `artwork` | `string` | 否 | 封面图 URL |
| `duration` | `number` | 否 | 时长（秒） |
| `url` | `string` | 否 | 直接播放链接 |
| `lrc` | `string` | 否 | 歌词文本 |
| `quality` | `object` | 否 | 多音质链接 |

### IAlbumItem（专辑）

继承 `IMediaBase`，额外字段：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | 是 | 专辑名 |
| `artist` | `string` | 是 | 歌手名 |
| `artistId` | `string` | 否 | 歌手 ID |
| `artwork` | `string` | 否 | 封面图 URL |
| `date` | `string` | 否 | 发行日期 |
| `description` | `string` | 否 | 专辑描述 |
| `songCount` | `number` | 否 | 曲目数 |

### IArtistItem（歌手）

继承 `IMediaBase`，额外字段：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | `string` | 是 | 歌手名 |
| `avatar` | `string` | 否 | 头像 URL |
| `description` | `string` | 否 | 简介 |
| `fansCount` | `number` | 否 | 粉丝数 |
| `worksNum` | `number` | 否 | 作品数 |

### IMusicSheetItem（歌单）

继承 `IMediaBase`，额外字段：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | 是 | 歌单名 |
| `artwork` | `string` | 否 | 封面图 URL |
| `artist` | `string` | 否 | 创建者 |
| `description` | `string` | 否 | 描述 |
| `playCount` | `number` | 否 | 播放次数 |
| `trackCount` | `number` | 否 | 曲目数 |
| `worksNums` | `number` | 否 | 作品数（别名） |

### IComment（评论）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `string` | 是 | 评论 ID |
| `userName` | `string` | 是 | 用户名 |
| `userAvatar` | `string` | 否 | 用户头像 |
| `content` | `string` | 是 | 评论内容 |
| `time` | `string` | 否 | 时间 |
| `likedCount` | `number` | 否 | 点赞数 |
| `replies` | `IComment[]` | 否 | 嵌套回复 |

### ILyricSource（歌词数据源）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `lyric` | `string` | 是 | LRC 格式歌词 |
| `translation` | `string` | 否 | 翻译歌词 |

### IMusicSheetGroupItem（歌单分组，用于排行榜等）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | 是 | 分组标题 |
| `data` | `IMusicSheetItem[]` | 是 | 该分组下的歌单列表 |

### 直接拼接 URL 模式（无需实现全部方法）

若音源平台提供固定的 URL 拼接规则（如 `https://example.com/music/{id}.mp3`），插件可仅导出 `getMediaSource` 方法，通过 URL 拼接返回播放链接，无需实现 `search`、`getLyric` 等其他方法。

```javascript
module.exports = {
  platform: '示例音源',
  getMediaSource(musicItem, quality, callback) {
    const url = `https://example.com/music/${musicItem.id}.mp3`;
    callback(null, { url });
  }
};
```

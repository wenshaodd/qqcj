// QQ音乐（第三方API）
// 数据源: 迟言api
//声明:来自musicfree-skill
//原作者:猫头猫，迟言
const axios = require('axios');

const BASE_URL = 'https://cyapi.top/API/qq_music.php';

const DEFAULT_KEY = '199c87dfb00e56ff8fd604c8adadafcece8f08d490a327ba78067bc1a3736663';

function getKey() {
    const configured = env.getUserVariables().key;
    if (configured) return configured;
    if (DEFAULT_KEY) return DEFAULT_KEY;
    throw new Error('请先在插件设置中填写 API Key');
}

async function request(params) {
    const res = await axios.get(BASE_URL, {
        params: Object.assign({ apikey: getKey(), type: 'json' }, params),
        timeout: 9000,
    });
    const body = res.data;
    if (body === null || typeof body !== 'object') {
        throw new Error('接口返回异常');
    }
    if (body.code !== undefined && body.code !== 0 && body.code !== 200 && body.code !== '200') {
        throw new Error(body.msg || body.message || '接口返回错误: ' + body.code);
    }
    return body;
}

function pickCover(cover) {
    if (!cover) return undefined;
    if (typeof cover === 'string') return cover;
    return cover.large || cover.medium || cover.small;
}

function pickArtists(artists) {
    if (!artists) return undefined;
    if (typeof artists === 'string') return artists;
    if (Array.isArray(artists)) {
        return artists.map((a) => (a && a.name) || '').filter(Boolean).join('/');
    }
    return undefined;
}

function toMusicItem(x) {
    if (!x) return null;
    const item = {
        id: String(x.id),
        title: x.name || x.title,
        artist: pickArtists(x.artists) || '未知歌手',
    };
    const cover = pickCover(x.cover);
    if (cover) item.artwork = cover;
    if (x.album) {
        item.album = typeof x.album === 'string' ? x.album : x.album.name;
    }
    if (x.duration) item.duration = Number(x.duration);
    return item;
}

// 尝试从 QQ 音乐链接或纯 mid 中提取歌曲 mid
function extractMid(urlLike) {
    if (!urlLike) return null;
    const s = String(urlLike).trim();
    const m1 = s.match(/(?:songDetail|song)\/([0-9A-Za-z]{10,20})/);
    if (m1) return m1[1];
    const m2 = s.match(/songmid=([0-9A-Za-z]{10,20})/);
    if (m2) return m2[1];
    const m3 = s.match(/^([0-9A-Za-z]{10,20})$/);
    if (m3) return m3[1];
    return null;
}

module.exports = {
    platform: 'QQ音乐',
    version: '0.0.1',
    description: 'QQ音乐源（通过迟言 API 接口），支持搜索与 VIP 歌曲解析播放',
    cacheControl: 'no-cache',
    supportedSearchType: ['music'],
    userVariables: [
        {
            key: 'key',
            name: 'API Key',
            hint: '已内置默认密钥，留空即可使用；失效后在此填写新值覆盖',
        },
    ],
    hints: {
        importMusicItem: ['支持 y.qq.com 歌曲链接或 14 位歌曲 mid'],
    },

    async search(query, page, type) {
        if (!query || (type && type !== 'music')) return { isEnd: true, data: [] };
        // 该接口无分页参数，num 最大 50，仅第一页有效
        if (page && page > 1) return { isEnd: true, data: [] };

        const res = await request({ msg: query, num: 50 });
        const list = Array.isArray(res.list) ? res.list : [];
        return {
            isEnd: true,
            data: list.map(toMusicItem).filter(Boolean),
        };
    },

    async getMediaSource(musicItem, quality) {
        const res = await request({ mid: musicItem.id });
        if (!res.url) throw new Error('该歌曲暂无音源');
        return { url: res.url };
    },

    async getLyric(musicItem) {
        const res = await request({ mid: musicItem.id });
        const lyric = res.lyric || {};
        const result = {};
        if (lyric.text) result.rawLrc = lyric.text;
        if (lyric.trans) result.translation = lyric.trans;
        if (!result.rawLrc && !result.translation) throw new Error('该歌曲暂无歌词');
        return result;
    },

    async getMusicInfo(musicItem) {
        const res = await request({ mid: musicItem.id });
        const info = {};
        if (res.album) info.album = typeof res.album === 'string' ? res.album : res.album.name;
        if (res.duration) info.duration = Number(res.duration);
        const cover = pickCover(res.cover);
        if (cover) info.artwork = cover;
        return info;
    },

    async importMusicItem(urlLike) {
        const mid = extractMid(urlLike);
        if (!mid) throw new Error('无法识别的链接格式');
        const res = await request({ mid });
        const item = toMusicItem(res);
        if (!item || !item.id) throw new Error('解析失败');
        if (res.url) item.url = res.url;
        return item;
    },
};

const axios = require('axios');

var _k = 'MTk5Yzg3ZGZiMDBlNTZmZjhmZDYwNGM4YWRhZGFmY2VjZThmMDhkNDkwYTMyN2JhNzgwNjdiYzFhMzczNjY2Mw==';
var _0 = function(s){return Buffer.from(s,'base64').toString('utf8')};
var API_KEY = _0(_k);
var BASE_URL = _0('aHR0cHM6Ly9jeWFwaS50b3AvQVBJL3FxX211c2ljLnBocA==');

/**
 * 获取歌曲详情（url、歌词、封面等）
 */
async function fetchSongDetail(songId) {
    const res = await axios.get(BASE_URL, {
        params: {
            apikey: API_KEY,
            msg: '',
            type: 'json',
            mid: songId,
        },
    });
    return res.data;
}

module.exports = {
    platform: 'QQ音乐',
    version: '1.0.0',
    author: 'MusicFree Community',
    description: '基于 cyapi.top 的 QQ 音乐插件，支持搜索、播放和歌词',
    cacheControl: 'no-cache',
    supportedSearchType: ['music'],

    async search(query, page, type) {
        if (type !== 'music') {
            return { isEnd: true, data: [] };
        }

        const res = await axios.get(BASE_URL, {
            params: {
                apikey: API_KEY,
                msg: query,
                num: 20,
                type: 'json',
                mid: '',
            },
        });

        const list = res.data.list || [];

        return {
            isEnd: true,
            data: list.map((item) => ({
                id: item.id,
                title: item.name,
                artist: item.artists,
                artwork: item.cover,
            })),
        };
    },

    async getMediaSource(musicItem, quality) {
        const detail = await fetchSongDetail(musicItem.id);

        if (!detail.url) {
            throw new Error('该歌曲暂无音源');
        }

        return { url: detail.url };
    },

    async getLyric(musicItem) {
        const detail = await fetchSongDetail(musicItem.id);

        return {
            rawLrc: detail.lyric?.text || '',
        };
    },

    async getMusicInfo(musicItem) {
        const detail = await fetchSongDetail(musicItem.id);

        const info = {};

        if (detail.cover?.large) {
            info.artwork = detail.cover.large;
        }
        if (detail.duration) {
            info.duration = detail.duration;
        }
        if (detail.album?.name) {
            info.album = detail.album.name;
            info.albumId = detail.album.id;
        }
        if (detail.artists?.length > 0) {
            const names = detail.artists
                .filter((a) => a.role === '演唱')
                .map((a) => a.name)
                .join('/');
            if (names) info.artist = names;
        }

        return info;
    },
};

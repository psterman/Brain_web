// 应用搜索数据库 - 增强版
class AppSearchDatabase {
    constructor() {
        this.apps = this.initializeApps();
        this.sortedApps = this.sortAppsByLetter();
        this.letterIndex = this.createLetterIndex();
    }

    // 初始化应用数据
    initializeApps() {
        return {
            // A
            aiqiyi: {
                name: '爱奇艺',
                pinyin: 'aiqiyi',
                firstLetter: 'A',
                category: 'video',
                icon: '爱',
                gradient: 'linear-gradient(135deg, #00be06 0%, #00a000 100%)',
                searchUrl: 'https://so.iqiyi.com/so/q_',
                appSearchUrl: 'iqiyi://search?key=',
                keywords: ['视频', '电影', '电视剧', '综艺', '动漫']
            },
            alipay: {
                name: '支付宝',
                pinyin: 'zhifubao',
                firstLetter: 'A',
                category: 'finance',
                icon: '支',
                gradient: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
                searchUrl: 'https://www.alipay.com/search?q=',
                appSearchUrl: 'alipays://platformapi/startapp?saId=20000067&query=',
                keywords: ['支付', '转账', '余额宝', '花呗', '借呗']
            },

            // B
            baidu: {
                name: '百度',
                pinyin: 'baidu',
                firstLetter: 'B',
                category: 'browser',
                icon: '百',
                gradient: 'linear-gradient(135deg, #3385ff 0%, #1c6cff 100%)',
                searchUrl: 'https://www.baidu.com/s?wd=',
                appSearchUrl: 'baiduboxapp://v1/easybrowse/search?word=',
                keywords: ['搜索', '百科', '知道', '贴吧', '网盘']
            },
            bilibili: {
                name: '哔哩哔哩',
                pinyin: 'bilibili',
                firstLetter: 'B',
                category: 'video',
                icon: 'B',
                gradient: 'linear-gradient(135deg, #fb7299 0%, #ff85a1 100%)',
                searchUrl: 'https://search.bilibili.com/all?keyword=',
                appSearchUrl: 'bilibili://search?keyword=',
                keywords: ['视频', '动漫', '游戏', '直播', 'UP主']
            },

            // C
            ctrip: {
                name: '携程旅行',
                pinyin: 'xiecheng',
                firstLetter: 'C',
                category: 'transport',
                icon: '携',
                gradient: 'linear-gradient(135deg, #0066cc 0%, #3399ff 100%)',
                searchUrl: 'https://www.ctrip.com/search?q=',
                appSearchUrl: 'ctrip://search?keyword=',
                keywords: ['旅行', '酒店', '机票', '火车票', '景点']
            },

            // D
            dianping: {
                name: '大众点评',
                pinyin: 'dazhongdianping',
                firstLetter: 'D',
                category: 'life',
                icon: '大',
                gradient: 'linear-gradient(135deg, #ffc300 0%, #ffb000 100%)',
                searchUrl: 'https://www.dianping.com/search/keyword/',
                appSearchUrl: 'dianping://search?keyword=',
                keywords: ['美食', '餐厅', '评价', '团购', '外卖']
            },
            douyin: {
                name: '抖音',
                pinyin: 'douyin',
                firstLetter: 'D',
                category: 'video',
                icon: '抖',
                gradient: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
                searchUrl: 'https://www.douyin.com/search/',
                appSearchUrl: 'snssdk1128://search/result/?keyword=',
                keywords: ['短视频', '直播', '音乐', '舞蹈', '搞笑']
            },
            didi: {
                name: '滴滴出行',
                pinyin: 'didichuxing',
                firstLetter: 'D',
                category: 'transport',
                icon: '滴',
                gradient: 'linear-gradient(135deg, #ff6600 0%, #e55a00 100%)',
                searchUrl: 'https://www.didiglobal.com/search?q=',
                appSearchUrl: 'diditaxi://search?keyword=',
                keywords: ['打车', '出行', '快车', '专车', '顺风车']
            },

            // E
            eleme: {
                name: '饿了么',
                pinyin: 'eleme',
                firstLetter: 'E',
                category: 'life',
                icon: '饿',
                gradient: 'linear-gradient(135deg, #0078ff 0%, #0066e0 100%)',
                searchUrl: 'https://www.ele.me/search/?keyword=',
                appSearchUrl: 'eleme://search?keyword=',
                keywords: ['外卖', '美食', '配送', '餐厅', '快餐']
            },

            // G
            gaode: {
                name: '高德地图',
                pinyin: 'gaodeditu',
                firstLetter: 'G',
                category: 'map',
                icon: '高',
                gradient: 'linear-gradient(135deg, #00a6fb 0%, #0582ca 100%)',
                searchUrl: 'https://www.amap.com/search?query=',
                appSearchUrl: 'iosamap://path?sourceApplication=applicationName&keyword=',
                keywords: ['地图', '导航', '路线', '位置', '交通']
            },

            // J
            jd: {
                name: '京东',
                pinyin: 'jingdong',
                firstLetter: 'J',
                category: 'shopping',
                icon: '京',
                gradient: 'linear-gradient(135deg, #e93323 0%, #d32f2f 100%)',
                searchUrl: 'https://search.jd.com/Search?keyword=',
                appSearchUrl: 'openapp.jdmobile://virtual?params={"category":"jump","des":"search","keyWord":"',
                keywords: ['购物', '电商', '数码', '家电', '图书']
            },

            // K
            kuaishou: {
                name: '快手',
                pinyin: 'kuaishou',
                firstLetter: 'K',
                category: 'video',
                icon: '快',
                gradient: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                searchUrl: 'https://www.kuaishou.com/search/video?searchKey=',
                appSearchUrl: 'kwai://search?keyword=',
                keywords: ['短视频', '直播', '老铁', '记录生活', '娱乐']
            },

            // M
            meituan: {
                name: '美团',
                pinyin: 'meituan',
                firstLetter: 'M',
                category: 'life',
                icon: '美',
                gradient: 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)',
                searchUrl: 'https://www.meituan.com/s/',
                appSearchUrl: 'imeituan://www.meituan.com/search?q=',
                keywords: ['外卖', '团购', '酒店', '电影', '生活服务']
            },

            // P
            pinduoduo: {
                name: '拼多多',
                pinyin: 'pinduoduo',
                firstLetter: 'P',
                category: 'shopping',
                icon: '拼',
                gradient: 'linear-gradient(135deg, #e02020 0%, #c41e3a 100%)',
                searchUrl: 'https://mobile.yangkeduo.com/search_result.html?search_key=',
                appSearchUrl: 'pinduoduo://com.xunmeng.pinduoduo/search_result.html?search_key=',
                keywords: ['拼团', '购物', '便宜', '水果', '生鲜']
            },

            // Q
            qq: {
                name: 'QQ',
                pinyin: 'qq',
                firstLetter: 'Q',
                category: 'social',
                icon: 'Q',
                gradient: 'linear-gradient(135deg, #12b7f5 0%, #0099e0 100%)',
                searchUrl: 'https://find.qq.com/?keyword=',
                appSearchUrl: 'mqq://search?keyword=',
                keywords: ['聊天', '社交', '群聊', '视频通话', '游戏']
            },
            qqmusic: {
                name: 'QQ音乐',
                pinyin: 'qqyinyue',
                firstLetter: 'Q',
                category: 'music',
                icon: 'Q',
                gradient: 'linear-gradient(135deg, #31c27c 0%, #2bb673 100%)',
                searchUrl: 'https://y.qq.com/portal/search.html#page=1&searchid=1&remoteplace=txt.yqq.top&t=song&w=',
                appSearchUrl: 'qqmusic://search?key=',
                keywords: ['音乐', '歌曲', '歌手', '专辑', '播放列表']
            },

            // T
            taobao: {
                name: '淘宝',
                pinyin: 'taobao',
                firstLetter: 'T',
                category: 'shopping',
                icon: '淘',
                gradient: 'linear-gradient(135deg, #ff6a00 0%, #ff4400 100%)',
                searchUrl: 'https://s.taobao.com/search?q=',
                appSearchUrl: 'taobao://s.taobao.com?q=',
                keywords: ['购物', '电商', '服装', '数码', '家居']
            },
            tmall: {
                name: '天猫',
                pinyin: 'tianmao',
                firstLetter: 'T',
                category: 'shopping',
                icon: '天',
                gradient: 'linear-gradient(135deg, #e02020 0%, #c41e3a 100%)',
                searchUrl: 'https://list.tmall.com/search_product.htm?q=',
                appSearchUrl: 'tmall://page.tm/search?q=',
                keywords: ['品牌', '正品', '购物', '电商', '旗舰店']
            },

            // W
            wechat: {
                name: '微信',
                pinyin: 'weixin',
                firstLetter: 'W',
                category: 'social',
                icon: '微',
                gradient: 'linear-gradient(135deg, #07c160 0%, #06ad56 100%)',
                searchUrl: 'https://weixin.sogou.com/weixin?type=2&query=',
                appSearchUrl: 'weixin://dl/search?query=',
                keywords: ['聊天', '社交', '朋友圈', '支付', '小程序']
            },
            weibo: {
                name: '微博',
                pinyin: 'weibo',
                firstLetter: 'W',
                category: 'social',
                icon: '微',
                gradient: 'linear-gradient(135deg, #e6162d 0%, #c41e3a 100%)',
                searchUrl: 'https://s.weibo.com/weibo/',
                appSearchUrl: 'sinaweibo://searchall?q=',
                keywords: ['微博', '热搜', '新闻', '明星', '话题']
            },

            // X
            xiaohongshu: {
                name: '小红书',
                pinyin: 'xiaohongshu',
                firstLetter: 'X',
                category: 'social',
                icon: '小',
                gradient: 'linear-gradient(135deg, #ff2442 0%, #ff1744 100%)',
                searchUrl: 'https://www.xiaohongshu.com/search_result?keyword=',
                appSearchUrl: 'xhsdiscover://search/result?keyword=',
                keywords: ['种草', '美妆', '穿搭', '旅行', '生活方式']
            },

            // Y
            youku: {
                name: '优酷',
                pinyin: 'youku',
                firstLetter: 'Y',
                category: 'video',
                icon: '优',
                gradient: 'linear-gradient(135deg, #3fbdf1 0%, #2ca7e0 100%)',
                searchUrl: 'https://so.youku.com/search_video/q_',
                appSearchUrl: 'youku://search?keyword=',
                keywords: ['视频', '电影', '电视剧', '综艺', '动漫']
            },

            // Z
            zhihu: {
                name: '知乎',
                pinyin: 'zhihu',
                firstLetter: 'Z',
                category: 'social',
                icon: '知',
                gradient: 'linear-gradient(135deg, #0084ff 0%, #0066cc 100%)',
                searchUrl: 'https://www.zhihu.com/search?type=content&q=',
                appSearchUrl: 'zhihu://search?q=',
                keywords: ['问答', '知识', '专业', '分享', '讨论']
            }
        };
    }

    // 按首字母排序应用
    sortAppsByLetter() {
        const apps = Object.entries(this.apps).map(([key, app]) => ({
            key,
            ...app
        }));

        return apps.sort((a, b) => {
            // 首先按首字母排序
            if (a.firstLetter !== b.firstLetter) {
                return a.firstLetter.localeCompare(b.firstLetter, 'zh-CN');
            }
            // 如果首字母相同，按拼音排序
            return a.pinyin.localeCompare(b.pinyin);
        });
    }

    // 创建字母索引
    createLetterIndex() {
        const index = {};
        this.sortedApps.forEach((app, i) => {
            const letter = app.firstLetter;
            if (!index[letter]) {
                index[letter] = [];
            }
            index[letter].push({
                ...app,
                index: i
            });
        });
        return index;
    }

    // 获取所有字母
    getAllLetters() {
        return Object.keys(this.letterIndex).sort((a, b) => a.localeCompare(b, 'zh-CN'));
    }

    // 根据字母获取应用
    getAppsByLetter(letter) {
        return this.letterIndex[letter] || [];
    }

    // 搜索应用
    searchApps(query) {
        if (!query) return this.sortedApps;
        
        const lowerQuery = query.toLowerCase();
        return this.sortedApps.filter(app => {
            return app.name.toLowerCase().includes(lowerQuery) ||
                   app.pinyin.toLowerCase().includes(lowerQuery) ||
                   app.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery));
        });
    }

    // 获取应用配置
    getApp(key) {
        return this.apps[key] || null;
    }

    // 获取所有应用
    getAllApps() {
        return this.sortedApps;
    }

    // 根据分类获取应用
    getAppsByCategory(category) {
        return this.sortedApps.filter(app => app.category === category);
    }
}

// 创建全局实例
window.AppSearchDB = new AppSearchDatabase();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppSearchDatabase;
}
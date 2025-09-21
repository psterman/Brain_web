// 图标配置系统 - 统一管理所有图标映射

const IconConfig = {
    // 应用图标配置
    apps: {
        // 购物类
        taobao: {
            name: '淘宝',
            className: 'taobao',
            category: 'shopping',
            color: '#ff6a00',
            gradient: 'linear-gradient(135deg, #ff6a00 0%, #ff4400 100%)',
            text: '淘',
            url: 'taobao://',
            webUrl: 'https://www.taobao.com',
            searchUrl: 'https://s.taobao.com/search?q=',
            appSearchUrl: 'taobao://s.taobao.com/search?q='
        },
        suning: {
            name: '苏宁易购',
            className: 'suning',
            category: 'shopping',
            color: '#ff6600',
            gradient: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)',
            text: '苏',
            url: 'suning://',
            webUrl: 'https://www.suning.com',
            searchUrl: 'https://search.suning.com/',
            appSearchUrl: 'suning://search?keyword='
        },
        vipshop: {
            name: '唯品会',
            className: 'vipshop',
            category: 'shopping',
            color: '#ff1493',
            gradient: 'linear-gradient(135deg, #ff1493 0%, #ff69b4 100%)',
            text: '唯',
            url: 'vipshop://',
            webUrl: 'https://www.vip.com',
            searchUrl: 'https://category.vip.com/search.php?q=',
            appSearchUrl: 'vipshop://search?keyword='
        },
        dangdang: {
            name: '当当',
            className: 'dangdang',
            category: 'shopping',
            color: '#ff6600',
            gradient: 'linear-gradient(135deg, #ff6600 0%, #ff9900 100%)',
            text: '当',
            url: 'dangdang://',
            webUrl: 'https://www.dangdang.com',
            searchUrl: 'http://search.dangdang.com/?key=',
            appSearchUrl: 'dangdang://search?keyword='
        },
        tmall: {
            name: '天猫',
            className: 'tmall',
            category: 'shopping',
            color: '#ff0036',
            gradient: 'linear-gradient(135deg, #ff0036 0%, #d50027 100%)',
            text: '天',
            url: 'tmall://',
            webUrl: 'https://www.tmall.com',
            searchUrl: 'https://list.tmall.com/search_product.htm?q=',
            appSearchUrl: 'tmall://page.tm/search?q='
        },
        pinduoduo: {
            name: '拼多多',
            className: 'pinduoduo',
            category: 'shopping',
            color: '#ff5722',
            gradient: 'linear-gradient(135deg, #ff5722 0%, #e91e63 100%)',
            text: '拼',
            url: 'pinduoduo://',
            webUrl: 'https://www.pinduoduo.com',
            searchUrl: 'https://mobile.yangkeduo.com/search_result.html?search_key=',
            appSearchUrl: 'pinduoduo://search?keyword='
        },
        jd: {
            name: '京东',
            className: 'jd',
            category: 'shopping',
            color: '#e60012',
            gradient: 'linear-gradient(135deg, #e60012 0%, #c5000f 100%)',
            text: '京',
            url: 'openapp.jdmobile://',
            webUrl: 'https://www.jd.com',
            searchUrl: 'https://search.jd.com/Search?keyword=',
            appSearchUrl: 'openapp.jdmobile://virtual?params={"category":"jump","des":"search","keyword":"'
        },
        xianyu: {
            name: '闲鱼',
            className: 'xianyu',
            category: 'shopping',
            color: '#ffb300',
            gradient: 'linear-gradient(135deg, #ffb300 0%, #ff8f00 100%)',
            text: '闲',
            url: 'fleamarket://',
            webUrl: 'https://www.xianyu.com',
            searchUrl: 'https://2.taobao.com/search/search.htm?q=',
            appSearchUrl: 'fleamarket://search?keyword='
        },

        // 社交类
        zhihu: {
            name: '知乎',
            className: 'zhihu',
            category: 'social',
            color: '#0084ff',
            gradient: 'linear-gradient(135deg, #0084ff 0%, #0066cc 100%)',
            text: '知',
            url: 'zhihu://',
            webUrl: 'https://www.zhihu.com',
            searchUrl: 'https://www.zhihu.com/search?type=content&q=',
            appSearchUrl: 'zhihu://search?q='
        },
        weibo: {
            name: '微博',
            className: 'weibo',
            category: 'social',
            color: '#e6162d',
            gradient: 'linear-gradient(135deg, #e6162d 0%, #c41230 100%)',
            text: '微',
            url: 'sinaweibo://',
            webUrl: 'https://weibo.com',
            searchUrl: 'https://s.weibo.com/weibo?q=',
            appSearchUrl: 'sinaweibo://search?q='
        },
        wechat: {
            name: '微信',
            className: 'wechat',
            category: 'social',
            color: '#07c160',
            gradient: 'linear-gradient(135deg, #07c160 0%, #06ad56 100%)',
            text: '微',
            url: 'weixin://',
            webUrl: 'https://web.wechat.com',
            searchUrl: 'https://weixin.sogou.com/weixin?type=2&query=',
            appSearchUrl: 'weixin://search?query='
        },
        qq: {
            name: 'QQ',
            className: 'qq',
            category: 'social',
            color: '#12B7F5',
            gradient: 'linear-gradient(135deg, #12B7F5 0%, #1296DB 100%)',
            text: 'Q',
            url: 'mqq://',
            webUrl: 'https://im.qq.com',
            searchUrl: 'https://im.qq.com/search?keyword=',
            appSearchUrl: 'mqq://search?keyword='
        },
        dingtalk: {
            name: '钉钉',
            className: 'dingtalk',
            category: 'social',
            color: '#2E7CF6',
            gradient: 'linear-gradient(135deg, #2E7CF6 0%, #4A90E2 100%)',
            text: '钉',
            url: 'dingtalk://',
            webUrl: 'https://www.dingtalk.com',
            searchUrl: 'https://www.dingtalk.com/search?query=',
            appSearchUrl: 'dingtalk://dingtalkclient/action/search?query='
        },

        // 音乐类
        qqMusic: {
            name: 'QQ音乐',
            className: 'qq-music',
            category: 'music',
            color: '#31c27c',
            gradient: 'linear-gradient(135deg, #31c27c 0%, #2ba471 100%)',
            text: 'QQ',
            url: 'qqmusic://',
            webUrl: 'https://y.qq.com',
            searchUrl: 'https://y.qq.com/n/ryqq/search?w=',
            appSearchUrl: 'qqmusic://search?key='
        },
        neteaseMusic: {
            name: '网易云音乐',
            className: 'netease-music',
            category: 'music',
            color: '#d33a31',
            gradient: 'linear-gradient(135deg, #d33a31 0%, #b8312a 100%)',
            text: '网',
            url: 'orpheus://',
            webUrl: 'https://music.163.com',
            searchUrl: 'https://music.163.com/#/search/m/?s=',
            appSearchUrl: 'orpheus://search?keyword='
        },
        kuwoMusic: {
            name: '酷我音乐',
            className: 'kuwo-music',
            category: 'music',
            color: '#ff6b35',
            gradient: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
            text: '酷',
            url: 'kuwo://',
            webUrl: 'https://www.kuwo.cn',
            searchUrl: 'https://www.kuwo.cn/search/list?key=',
            appSearchUrl: 'kuwo://search?key='
        },

        // 生活服务类
        meituan: {
            name: '美团',
            className: 'meituan',
            category: 'life',
            color: '#ffc107',
            gradient: 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)',
            text: '美',
            url: 'imeituan://',
            webUrl: 'https://www.meituan.com',
            searchUrl: 'https://www.meituan.com/s/',
            appSearchUrl: 'imeituan://www.meituan.com/search?q='
        },
        eleme: {
            name: '饿了么',
            className: 'eleme',
            category: 'life',
            color: '#0078ff',
            gradient: 'linear-gradient(135deg, #0078ff 0%, #0066e0 100%)',
            text: '饿',
            url: 'eleme://',
            webUrl: 'https://www.ele.me',
            searchUrl: 'https://www.ele.me/search/?keyword=',
            appSearchUrl: 'eleme://search?keyword='
        },
        dianping: {
            name: '大众点评',
            className: 'dianping',
            category: 'life',
            color: '#ffb300',
            gradient: 'linear-gradient(135deg, #ffb300 0%, #ff9800 100%)',
            text: '大',
            url: 'dianping://',
            webUrl: 'https://www.dianping.com',
            searchUrl: 'https://www.dianping.com/search/keyword/',
            appSearchUrl: 'dianping://search?keyword='
        },
        koubei: {
            name: '口碑',
            className: 'koubei',
            category: 'life',
            color: '#ff6900',
            gradient: 'linear-gradient(135deg, #ff6900 0%, #ff8800 100%)',
            text: '口',
            url: 'koubei://',
            webUrl: 'https://www.koubei.com',
            searchUrl: 'https://www.koubei.com/search?keyword=',
            appSearchUrl: 'koubei://search?keyword='
        },
        waimai: {
            name: '外卖超人',
            className: 'waimai',
            category: 'life',
            color: '#ff4081',
            gradient: 'linear-gradient(135deg, #ff4081 0%, #ff6ec7 100%)',
            text: '外',
            url: 'waimai://',
            webUrl: 'https://www.waimai.com',
            searchUrl: 'https://www.waimai.com/search?keyword=',
            appSearchUrl: 'waimai://search?keyword='
        },
        mafengwo: {
            name: '马蜂窝',
            className: 'mafengwo',
            category: 'life',
            color: '#ffb74d',
            gradient: 'linear-gradient(135deg, #ffb74d 0%, #ffa726 100%)',
            text: '马',
            url: 'mafengwo://',
            webUrl: 'https://www.mafengwo.cn',
            searchUrl: 'https://www.mafengwo.cn/search/?q=',
            appSearchUrl: 'mafengwo://search?keyword='
        },

        // 视频类
        youku: {
            name: '优酷',
            className: 'youku',
            category: 'video',
            color: '#00a0e9',
            gradient: 'linear-gradient(135deg, #00a0e9 0%, #0088cc 100%)',
            text: '优',
            url: 'youku://',
            webUrl: 'https://www.youku.com',
            searchUrl: 'https://so.youku.com/search_video/q_',
            appSearchUrl: 'youku://search?keyword='
        },
        iqiyi: {
            name: '爱奇艺',
            className: 'iqiyi',
            category: 'video',
            color: '#00be06',
            gradient: 'linear-gradient(135deg, #00be06 0%, #00a005 100%)',
            text: '爱',
            url: 'iqiyi://',
            webUrl: 'https://www.iqiyi.com',
            searchUrl: 'https://so.iqiyi.com/so/q_',
            appSearchUrl: 'iqiyi://search?key='
        },
        tencentVideo: {
            name: '腾讯视频',
            className: 'tencent-video',
            category: 'video',
            color: '#ff6600',
            gradient: 'linear-gradient(135deg, #ff6600 0%, #e55a00 100%)',
            text: '腾',
            url: 'tenvideo://',
            webUrl: 'https://v.qq.com',
            searchUrl: 'https://v.qq.com/x/search/?q=',
            appSearchUrl: 'tenvideo://search?keyword='
        },
        bilibili: {
            name: 'B站',
            className: 'bilibili',
            category: 'video',
            color: '#fb7299',
            gradient: 'linear-gradient(135deg, #fb7299 0%, #f25d8e 100%)',
            text: 'B',
            url: 'bilibili://',
            webUrl: 'https://www.bilibili.com',
            searchUrl: 'https://search.bilibili.com/all?keyword=',
            appSearchUrl: 'bilibili://search?keyword='
        },
        kuaishou: {
            name: '快手',
            className: 'kuaishou',
            category: 'video',
            color: '#ff6600',
            gradient: 'linear-gradient(135deg, #ff6600 0%, #e55a00 100%)',
            text: '快',
            url: 'kwai://',
            webUrl: 'https://www.kuaishou.com',
            searchUrl: 'https://www.kuaishou.com/search/video?searchKey=',
            appSearchUrl: 'kwai://search?keyword='
        },
        douyin: {
            name: '抖音',
            className: 'douyin',
            category: 'video',
            color: '#000000',
            gradient: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
            text: '抖',
            url: 'snssdk1128://',
            webUrl: 'https://www.douyin.com',
            searchUrl: 'https://www.douyin.com/search/',
            appSearchUrl: 'snssdk1128://search?keyword='
        },
        kuaishou: {
             name: '快手',
             className: 'kuaishou',
             category: 'video',
             color: '#FF6600',
             gradient: 'linear-gradient(135deg, #FF6600 0%, #FF8800 100%)',
             text: '快',
             url: 'kwai://',
             webUrl: 'https://www.kuaishou.com',
             searchUrl: 'https://www.kuaishou.com/search/video?searchKey=',
             appSearchUrl: 'kwai://search?keyword='
         },
         xiaohongshu: {
            name: '小红书',
            className: 'xiaohongshu',
            category: 'social',
            color: '#ff2442',
            gradient: 'linear-gradient(135deg, #ff2442 0%, #ff1744 100%)',
            text: '小',
            url: 'xhsdiscover://',
            webUrl: 'https://www.xiaohongshu.com',
            searchUrl: 'https://www.xiaohongshu.com/search_result?keyword=',
            appSearchUrl: 'xhsdiscover://search/result?keyword='
        },
        weiboLite: {
            name: '微博轻享',
            className: 'weibo-lite',
            category: 'social',
            color: '#ff8200',
            gradient: 'linear-gradient(135deg, #ff8200 0%, #e6741c 100%)',
            text: '轻',
            url: 'sinaweibo://',
            webUrl: 'https://m.weibo.cn',
            searchUrl: 'https://m.weibo.cn/search?containerid=100103type%3D1%26q%3D',
            appSearchUrl: 'sinaweibo://search?q='
        },
        douban: {
            name: '豆瓣',
            className: 'douban',
            category: 'social',
            color: '#00b51d',
            gradient: 'linear-gradient(135deg, #00b51d 0%, #009918 100%)',
            text: '豆',
            url: 'douban://',
            webUrl: 'https://www.douban.com',
            searchUrl: 'https://www.douban.com/search?q=',
            appSearchUrl: 'douban://search?q='
        },

        // 地图类
        gaodeMap: {
            name: '高德地图',
            className: 'gaode-map',
            category: 'map',
            color: '#00a6fb',
            gradient: 'linear-gradient(135deg, #00a6fb 0%, #0582ca 100%)',
            text: '高',
            url: 'iosamap://',
            webUrl: 'https://www.amap.com',
            searchUrl: 'https://www.amap.com/search?query=',
            appSearchUrl: 'iosamap://search?query='
        },
        baiduMap: {
            name: '百度地图',
            className: 'baidu-map',
            category: 'map',
            color: '#4285f4',
            gradient: 'linear-gradient(135deg, #4285f4 0%, #1a73e8 100%)',
            text: '百',
            url: 'baidumap://',
            webUrl: 'https://map.baidu.com',
            searchUrl: 'https://map.baidu.com/search/',
            appSearchUrl: 'baidumap://map/search?query='
        },
        tencentMap: {
            name: '腾讯地图',
            className: 'tencent-map',
            category: 'map',
            color: '#4fc3f7',
            gradient: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)',
            text: '腾',
            url: 'qqmap://',
            webUrl: 'https://map.qq.com',
            searchUrl: 'https://map.qq.com/search/',
            appSearchUrl: 'qqmap://map/search?keyword='
        },

        // 金融类
        alipay: {
            name: '支付宝',
            className: 'alipay',
            category: 'finance',
            color: '#1677ff',
            gradient: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
            text: '支',
            url: 'alipay://',
            webUrl: 'https://www.alipay.com',
            searchUrl: 'https://www.alipay.com/search?q=',
            appSearchUrl: 'alipay://search?query='
        },
        wechatPay: {
            name: '微信支付',
            className: 'wechat-pay',
            category: 'finance',
            color: '#07c160',
            gradient: 'linear-gradient(135deg, #07c160 0%, #06ad56 100%)',
            text: '微',
            url: 'weixin://pay',
            webUrl: 'https://pay.weixin.qq.com',
            searchUrl: 'https://pay.weixin.qq.com/search?q=',
            appSearchUrl: 'weixin://pay/search?q='
        },
        yunshangfu: {
            name: '云闪付',
            className: 'yunshangfu',
            category: 'finance',
            color: '#ff4757',
            gradient: 'linear-gradient(135deg, #ff4757 0%, #ff6b7a 100%)',
            text: '云',
            url: 'com.unionpay.chsp://',
            webUrl: 'https://www.95516.com',
            searchUrl: 'https://www.95516.com/search?q=',
            appSearchUrl: 'com.unionpay.chsp://search?q='
        },
        zhaoshang: {
            name: '招商银行',
            className: 'zhaoshang',
            category: 'finance',
            color: '#dc143c',
            gradient: 'linear-gradient(135deg, #dc143c 0%, #ff6b7a 100%)',
            text: '招',
            url: 'cmb.pb://',
            webUrl: 'https://www.cmbchina.com',
            searchUrl: 'https://www.cmbchina.com/search?q=',
            appSearchUrl: 'cmb.pb://search?q='
        },
        gongshang: {
            name: '工商银行',
            className: 'gongshang',
            category: 'finance',
            color: '#c41e3a',
            gradient: 'linear-gradient(135deg, #c41e3a 0%, #ff6b7a 100%)',
            text: '工',
            url: 'com.icbc.iphoneclient://',
            webUrl: 'https://www.icbc.com.cn',
            searchUrl: 'https://www.icbc.com.cn/search?q=',
            appSearchUrl: 'com.icbc.iphoneclient://search?q='
        },

        // 出行类
        didi: {
            name: '滴滴出行',
            className: 'didi',
            category: 'transport',
            color: '#ff6600',
            gradient: 'linear-gradient(135deg, #ff6600 0%, #e55a00 100%)',
            text: '滴',
            url: 'diditaxi://',
            webUrl: 'https://www.didiglobal.com',
            searchUrl: 'https://www.didiglobal.com/search?q=',
            appSearchUrl: 'diditaxi://search?keyword='
        },
        ctrip: {
            name: '携程旅行',
            className: 'ctrip',
            category: 'transport',
            color: '#0066cc',
            gradient: 'linear-gradient(135deg, #0066cc 0%, #3399ff 100%)',
            text: '携',
            url: 'ctrip://',
            webUrl: 'https://www.ctrip.com',
            searchUrl: 'https://www.ctrip.com/search?q=',
            appSearchUrl: 'ctrip://search?q='
        },
        elong: {
            name: '艺龙旅行',
            className: 'elong',
            category: 'transport',
            color: '#ff9900',
            gradient: 'linear-gradient(135deg, #ff9900 0%, #ffcc33 100%)',
            text: '艺',
            url: 'com.dp.android.elong://',
            webUrl: 'https://www.elong.com',
            searchUrl: 'https://www.elong.com/search?q=',
            appSearchUrl: 'com.dp.android.elong://search?q='
        },
        
        // 招聘类
        zhaopin: {
            name: '智联招聘',
            className: 'zhaopin',
            category: 'job',
            color: '#0066cc',
            gradient: 'linear-gradient(135deg, #0066cc 0%, #004499 100%)',
            text: '智',
            url: 'zhaopin://',
            webUrl: 'https://www.zhaopin.com',
            searchUrl: 'https://sou.zhaopin.com/jobs/searchresult.ashx?kw=',
            appSearchUrl: 'zhaopin://search?keyword='
        },
        boss: {
            name: 'BOSS直聘',
            className: 'boss',
            category: 'job',
            color: '#00b386',
            gradient: 'linear-gradient(135deg, #00b386 0%, #009973 100%)',
            text: 'B',
            url: 'bosszhipin://',
            webUrl: 'https://www.zhipin.com',
            searchUrl: 'https://www.zhipin.com/job_detail/?query=',
            appSearchUrl: 'bosszhipin://search?query='
        },

        // 教育类
        xueersi: {
            name: '学而思',
            className: 'xueersi',
            category: 'education',
            color: '#ff6b35',
            gradient: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
            text: '学',
            url: 'xueersi://',
            webUrl: 'https://www.xueersi.com',
            searchUrl: 'https://www.xueersi.com/search?keyword=',
            appSearchUrl: 'xueersi://search?keyword='
        },

        // 新闻类
        toutiao: {
            name: '今日头条',
            className: 'toutiao',
            category: 'news',
            color: '#ff4757',
            gradient: 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)',
            text: '头',
            url: 'snssdk141://',
            webUrl: 'https://www.toutiao.com',
            searchUrl: 'https://www.toutiao.com/search/?keyword=',
            appSearchUrl: 'snssdk141://search?keyword='
        },
        neteaseNews: {
            name: '网易新闻',
            className: 'netease-news',
            category: 'news',
            color: '#d63031',
            gradient: 'linear-gradient(135deg, #d63031 0%, #ff7675 100%)',
            text: '网',
            url: 'newsapp://',
            webUrl: 'https://news.163.com',
            searchUrl: 'https://news.163.com/search?keyword=',
            appSearchUrl: 'newsapp://search?keyword='
        },
        qqNews: {
            name: '腾讯新闻',
            className: 'qq-news',
            category: 'news',
            color: '#0984e3',
            gradient: 'linear-gradient(135deg, #0984e3 0%, #74b9ff 100%)',
            text: '腾',
            url: 'qqnews://',
            webUrl: 'https://news.qq.com',
            searchUrl: 'https://news.qq.com/search?keyword=',
            appSearchUrl: 'qqnews://search?keyword='
        },
        toutiaoLite: {
            name: '今日头条极速版',
            className: 'toutiao-lite',
            category: 'news',
            color: '#ff6348',
            gradient: 'linear-gradient(135deg, #ff6348 0%, #ff9ff3 100%)',
            text: '极',
            url: 'snssdk1112://',
            webUrl: 'https://www.toutiao.com',
            searchUrl: 'https://www.toutiao.com/search/?keyword=',
            appSearchUrl: 'snssdk1112://search?keyword='
        },

        // 浏览器类
        chrome: {
            name: 'Chrome',
            className: 'chrome',
            category: 'browser',
            color: '#4285f4',
            gradient: 'linear-gradient(135deg, #4285f4 0%, #34a853 50%, #fbbc05 75%, #ea4335 100%)',
            text: 'C',
            url: 'googlechrome://',
            webUrl: 'https://www.google.com/chrome',
            searchUrl: 'https://www.google.com/search?q=',
            appSearchUrl: 'googlechrome://search?q='
        },
        safari: {
            name: 'Safari',
            className: 'safari',
            category: 'browser',
            color: '#006cff',
            gradient: 'linear-gradient(135deg, #006cff 0%, #0052cc 100%)',
            text: 'S',
            url: 'x-web-search://',
            webUrl: 'https://www.apple.com/safari',
            searchUrl: 'https://www.google.com/search?q=',
            appSearchUrl: 'x-web-search://?'
        },
        ucBrowser: {
            name: 'UC浏览器',
            className: 'uc-browser',
            category: 'browser',
            color: '#ff6600',
            gradient: 'linear-gradient(135deg, #ff6600 0%, #e55a00 100%)',
            text: 'UC',
            url: 'ucbrowser://',
            webUrl: 'https://www.uc.cn',
            searchUrl: 'https://www.uc.cn/search?keyword=',
            appSearchUrl: 'ucbrowser://search?keyword='
        },
        qqBrowser: {
            name: 'QQ浏览器',
            className: 'qq-browser',
            category: 'browser',
            color: '#12b7f5',
            gradient: 'linear-gradient(135deg, #12b7f5 0%, #0ea5e9 100%)',
            text: 'QQ',
            url: 'mqqbrowser://',
            webUrl: 'https://browser.qq.com',
            searchUrl: 'https://www.sogou.com/web?query=',
            appSearchUrl: 'mqqbrowser://search?keyword='
        },
        quark: {
            name: '夸克',
            className: 'quark',
            category: 'browser',
            color: '#6366f1',
            gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            text: '夸',
            url: 'quark://',
            webUrl: 'https://www.myquark.cn',
            searchUrl: 'https://www.myquark.cn/search?q=',
            appSearchUrl: 'quark://search?q='
        }
    },

    // 搜索引擎配置
    searchEngines: {
        baidu: {
            name: '百度',
            className: 'baidu',
            color: '#2932e1',
            gradient: 'linear-gradient(135deg, #2932e1 0%, #1e28cc 100%)',
            text: '百',
            url: 'https://www.baidu.com/s?wd=',
            icon: 'https://www.baidu.com/favicon.ico'
        },
        sogou: {
            name: '搜狗',
            className: 'sogou',
            color: '#fb6c2c',
            gradient: 'linear-gradient(135deg, #fb6c2c 0%, #e55a26 100%)',
            text: '搜',
            url: 'https://www.sogou.com/web?query=',
            icon: 'https://www.sogou.com/favicon.ico'
        },
        qihoo360: {
            name: '360搜索',
            className: 'qihoo360',
            color: '#4caf50',
            gradient: 'linear-gradient(135deg, #4caf50 0%, #43a047 100%)',
            text: '360',
            url: 'https://www.so.com/s?q=',
            icon: 'https://www.so.com/favicon.ico'
        },
        shenma: {
            name: '神马搜索',
            className: 'shenma',
            color: '#9c27b0',
            gradient: 'linear-gradient(135deg, #9c27b0 0%, #8e24aa 100%)',
            text: '神',
            url: 'https://m.sm.cn/s?q=',
            icon: 'https://m.sm.cn/favicon.ico'
        },
        chinaso: {
            name: '中国搜索',
            className: 'chinaso',
            color: '#f44336',
            gradient: 'linear-gradient(135deg, #f44336 0%, #e53935 100%)',
            text: '中',
            url: 'https://www.chinaso.com/search/pagesearch.htm?q=',
            icon: 'https://www.chinaso.com/favicon.ico'
        },
        haosou: {
            name: '好搜',
            className: 'haosou',
            color: '#00bcd4',
            gradient: 'linear-gradient(135deg, #00bcd4 0%, #00acc1 100%)',
            text: '好',
            url: 'https://www.haosou.com/s?q=',
            icon: 'https://www.haosou.com/favicon.ico'
        },
        google: {
            name: 'Google',
            className: 'google',
            color: '#4285f4',
            gradient: 'linear-gradient(135deg, #4285f4 0%, #34a853 50%, #fbbc05 75%, #ea4335 100%)',
            text: 'G',
            url: 'https://www.google.com/search?q=',
            icon: 'https://www.google.com/favicon.ico'
        },
        bing: {
            name: 'Bing',
            className: 'bing',
            color: '#0078d4',
            gradient: 'linear-gradient(135deg, #0078d4 0%, #106ebe 100%)',
            text: 'B',
            url: 'https://www.bing.com/search?q=',
            icon: 'https://www.bing.com/favicon.ico'
        }
    },

    // AI助手配置
    aiAssistants: {
        deepseek: {
            name: 'DeepSeek',
            className: 'deepseek-avatar',
            color: '#667eea',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            icon: '🧠',
            description: '专业的AI编程助手',
            features: ['代码生成', '技术问答', '算法优化']
        },
        kimi: {
            name: 'Kimi',
            className: 'kimi-avatar',
            color: '#f093fb',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            icon: '🤖',
            description: '智能对话助手',
            features: ['长文本处理', '文档分析', '创意写作']
        },
        zhipu: {
            name: '智谱清言',
            className: 'zhipu-avatar',
            color: '#4facfe',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            icon: '💡',
            description: '中文AI助手',
            features: ['中文对话', '知识问答', '文本生成']
        },
        chatgpt: {
            name: 'ChatGPT',
            className: 'chatgpt-avatar',
            color: '#74b9ff',
            gradient: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
            icon: '🎯',
            description: 'OpenAI智能助手',
            features: ['通用对话', '创意写作', '问题解答']
        },
        doubao: {
            name: '豆包',
            className: 'doubao-avatar',
            color: '#fd79a8',
            gradient: 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)',
            icon: '🎈',
            description: '字节跳动AI助手',
            features: ['中文对话', '生活助手', '娱乐互动']
        }
    },

    // 分类配置
    categories: {
        shopping: {
            name: '购物',
            icon: '🛍',
            color: '#4caf50'
        },
        social: {
            name: '社交',
            icon: '💬',
            color: '#2196f3'
        },
        music: {
            name: '音乐',
            icon: '🎵',
            color: '#9c27b0'
        },
        video: {
            name: '视频',
            icon: '📺',
            color: '#ff5722'
        },
        life: {
            name: '生活',
            icon: '🏠',
            color: '#ff9800'
        },
        map: {
            name: '地图',
            icon: '🗺',
            color: '#607d8b'
        },
        browser: {
            name: '浏览器',
            icon: '🌐',
            color: '#795548'
        },
        finance: {
            name: '金融',
            icon: '💰',
            color: '#ffc107'
        },
        transport: {
            name: '出行',
            icon: '🚗',
            color: '#3f51b5'
        },
        job: {
            name: '招聘',
            icon: '💼',
            color: '#009688'
        },
        education: {
            name: '教育',
            icon: '📚',
            color: '#673ab7'
        },
        news: {
            name: '新闻',
            icon: '📰',
            color: '#e91e63'
        }
    },

    // 获取应用配置
    getApp(key) {
        return this.apps[key] || null;
    },

    // 获取搜索引擎配置
    getSearchEngine(key) {
        return this.searchEngines[key] || null;
    },

    // 获取AI助手配置
    getAIAssistant(key) {
        return this.aiAssistants[key] || null;
    },

    // 获取分类配置
    getCategory(key) {
        return this.categories[key] || null;
    },

    // 根据分类获取应用列表
    getAppsByCategory(category) {
        return Object.entries(this.apps)
            .filter(([key, app]) => app.category === category)
            .map(([key, app]) => ({ key, ...app }));
    },

    // 搜索应用
    searchApps(query) {
        const lowerQuery = query.toLowerCase();
        return Object.entries(this.apps)
            .filter(([key, app]) => 
                app.name.toLowerCase().includes(lowerQuery) ||
                key.toLowerCase().includes(lowerQuery)
            )
            .map(([key, app]) => ({ key, ...app }));
    },

    // 生成图标HTML
    generateAppIconHTML(appKey, size = 'normal') {
        const app = this.getApp(appKey);
        if (!app) return '';

        const sizeClass = size === 'small' ? 'app-icon-small' : 'app-icon';
        return `<div class="${sizeClass} ${app.className}" title="${app.name}"></div>`;
    },

    // 生成搜索引擎图标HTML
    generateEngineIconHTML(engineKey, size = 'normal') {
        const engine = this.getSearchEngine(engineKey);
        if (!engine) return '';

        const sizeClass = size === 'small' ? 'engine-icon-small' : 'engine-icon';
        return `<div class="${sizeClass} ${engine.className}" title="${engine.name}"></div>`;
    },

    // 生成AI助手头像HTML
    generateAIAvatarHTML(aiKey, size = 'normal') {
        const ai = this.getAIAssistant(aiKey);
        if (!ai) return '';

        const sizeClass = size === 'small' ? 'ai-avatar-small' : 'ai-avatar';
        return `
            <div class="${sizeClass} ${ai.className}" title="${ai.name}">
                <div class="ai-brain-icon">${ai.icon}</div>
            </div>
        `;
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IconConfig;
} else if (typeof window !== 'undefined') {
    window.IconConfig = IconConfig;
}
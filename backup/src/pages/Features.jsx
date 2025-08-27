import React from 'react'
import { motion } from 'framer-motion'
import { 
  SparklesIcon, 
  ChatBubbleLeftRightIcon, 
  RocketLaunchIcon, 
  PuzzlePieceIcon, 
  MagnifyingGlassIcon, 
  DevicePhoneMobileIcon,
  BoltIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const Features = () => {
  const mainFeatures = [
    {
      icon: SparklesIcon,
      title: 'AI智能助手',
      description: '基于先进的AI技术，为您提供智能化的浏览辅助',
      details: [
        '智能网页摘要和内容分析',
        '个性化推荐和内容发现',
        '自动翻译和多语言支持',
        '智能问答和信息检索'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: '对话式管理',
      description: '通过自然语言对话管理您的浏览数据',
      details: [
        '语音和文字指令支持',
        '智能书签分类和管理',
        '历史记录快速检索',
        '个性化收藏夹整理'
      ],
      color: 'from-green-500 to-green-600'
    },
    {
      icon: RocketLaunchIcon,
      title: '手势管理',
      description: '流畅直观的手势操作，提升浏览效率',
      details: [
        '自定义手势快捷操作',
        '多点触控精准控制',
        '智能手势学习和适应',
        '一键切换浏览模式'
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: PuzzlePieceIcon,
      title: '多平台聚合',
      description: '整合多个平台内容，一站式信息获取',
      details: [
        '社交媒体内容聚合',
        '新闻资讯统一展示',
        '购物平台比价功能',
        '学术资源整合搜索'
      ],
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: MagnifyingGlassIcon,
      title: '快速查询',
      description: '毫秒级响应，瞬间找到您需要的信息',
      details: [
        '全网内容实时搜索',
        '智能搜索建议和补全',
        '历史搜索快速复用',
        '结果智能排序和过滤'
      ],
      color: 'from-red-500 to-red-600'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: '小组件查询',
      description: '桌面小组件，便捷访问常用功能',
      details: [
        '可自定义的桌面小组件',
        '一键快速搜索和查询',
        '实时信息推送展示',
        '快捷操作和功能入口'
      ],
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  const additionalFeatures = [
    {
      icon: BoltIcon,
      title: '极速性能',
      description: '优化的渲染引擎，快速加载网页内容'
    },
    {
      icon: ShieldCheckIcon,
      title: '隐私保护',
      description: '强大的隐私保护机制，保障用户数据安全'
    },
    {
      icon: CpuChipIcon,
      title: '智能优化',
      description: '自适应性能优化，节省设备资源'
    },
    {
      icon: GlobeAltIcon,
      title: '全球访问',
      description: '智能网络优化，畅享全球互联网内容'
    },
    {
      icon: UserGroupIcon,
      title: '协作分享',
      description: '便捷的内容分享和协作功能'
    },
    {
      icon: ClockIcon,
      title: '时间管理',
      description: '智能浏览时间统计和管理'
    }
  ]

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              强大功能
              <span className="text-gradient block">引领未来</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              六大核心功能，重新定义智能浏览体验。每一个功能都经过精心设计，
              只为给您带来前所未有的浏览快感。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="space-y-24">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mr-4`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      {feature.title}
                    </h2>
                  </div>
                  
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="space-y-4">
                    {feature.details.map((detail, detailIndex) => (
                      <motion.div
                        key={detailIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: detailIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center"
                      >
                        <div className="w-2 h-2 bg-primary-500 rounded-full mr-4 flex-shrink-0"></div>
                        <span className="text-gray-700">{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 h-96 flex items-center justify-center">
                    <feature.icon className={`h-32 w-32 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              更多亮点功能
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              除了六大核心功能，我们还为您准备了更多实用特性
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-apple text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              体验前所未有的智能浏览
            </h2>
            <p className="text-xl text-primary-100 mb-12 leading-relaxed">
              立即下载小脑浏览器，开启您的智能浏览之旅
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="/download" 
                className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-4 px-8 rounded-2xl transition-all duration-200 ease-in-out transform hover:scale-105 shadow-lg"
              >
                立即下载
              </a>
              <a 
                href="/guide" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-4 px-8 rounded-2xl transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                查看指南
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Features
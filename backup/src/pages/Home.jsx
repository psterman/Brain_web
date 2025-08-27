import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowDownIcon, DevicePhoneMobileIcon, SparklesIcon, ChatBubbleLeftRightIcon, RocketLaunchIcon, MagnifyingGlassIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline'

const Home = () => {
  const features = [
    {
      icon: SparklesIcon,
      title: 'AI智能助手',
      description: '内置强大的AI助手，让浏览更智能，搜索更精准'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: '对话式管理',
      description: '通过自然对话管理书签、历史记录和收藏夹'
    },
    {
      icon: RocketLaunchIcon,
      title: '手势管理',
      description: '直观的手势操作，让浏览体验更加流畅便捷'
    },
    {
      icon: PuzzlePieceIcon,
      title: '多平台聚合',
      description: '整合多个平台内容，一站式获取所需信息'
    },
    {
      icon: MagnifyingGlassIcon,
      title: '快速查询',
      description: '毫秒级搜索响应，找到你想要的一切'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: '小组件查询',
      description: '桌面小组件，一键快速查询和访问常用功能'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
            >
              智能浏览的
              <span className="text-gradient block">新时代</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed"
            >
              我们为你找寻一切线索。<br />
              小脑，让智能成为浏览的核心驱动力。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/download" className="btn-primary text-lg px-8 py-4">
                立即下载
              </Link>
              <Link to="/features" className="btn-secondary text-lg px-8 py-4">
                了解更多
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex justify-center mt-20"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gray-400"
            >
              <ArrowDownIcon className="h-6 w-6" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              重新定义浏览体验
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              六大核心功能，打造前所未有的智能浏览体验
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
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

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link to="/features" className="btn-primary text-lg px-8 py-4">
              探索所有功能
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              开启智能浏览之旅
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              支持 iOS 和 Android 平台，让每一次浏览都充满智慧
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/download" className="btn-primary text-lg px-8 py-4">
                App Store 下载
              </Link>
              <Link to="/download" className="btn-primary text-lg px-8 py-4">
                Google Play 下载
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-8">
              免费下载，无广告，隐私保护
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
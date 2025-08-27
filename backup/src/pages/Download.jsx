import React from 'react'
import { motion } from 'framer-motion'
import { 
  DevicePhoneMobileIcon, 
  ComputerDesktopIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline'

const Download = () => {
  const platforms = [
    {
      name: 'iOS',
      icon: DevicePhoneMobileIcon,
      version: '1.0.0',
      size: '45.2 MB',
      requirements: 'iOS 14.0 或更高版本',
      features: [
        '完整AI智能助手功能',
        '优化的手势操作体验',
        '原生小组件支持',
        '与iOS系统深度集成'
      ],
      downloadUrl: '#',
      storeButton: {
        text: 'App Store 下载',
        logo: '🍎'
      }
    },
    {
      name: 'Android',
      icon: DevicePhoneMobileIcon,
      version: '1.0.0',
      size: '52.8 MB',
      requirements: 'Android 8.0 或更高版本',
      features: [
        '完整AI智能助手功能',
        '自定义手势操作',
        '桌面小组件支持',
        '多平台深度聚合'
      ],
      downloadUrl: '#',
      storeButton: {
        text: 'Google Play 下载',
        logo: '🤖'
      }
    }
  ]

  const releaseNotes = [
    {
      version: '1.0.0',
      date: '2024-01-15',
      type: '首次发布',
      changes: [
        '🎉 小脑浏览器正式上线',
        '🤖 集成先进AI智能助手',
        '👆 创新手势操作系统',
        '💬 对话式浏览管理',
        '🔍 多平台内容聚合',
        '📱 桌面小组件支持'
      ]
    }
  ]

  const stats = [
    { label: '用户评分', value: '4.9', unit: '/5.0' },
    { label: '下载次数', value: '10K+', unit: '' },
    { label: '用户评价', value: '500+', unit: '' },
    { label: '支持语言', value: '12', unit: '种' }
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
              立即下载
              <span className="text-gradient block">小脑浏览器</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              支持 iOS 和 Android 平台，免费下载，无广告，
              开启您的智能浏览新体验。
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                    {stat.value}
                    <span className="text-lg text-gray-500">{stat.unit}</span>
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Download Cards */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card-apple"
              >
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <platform.icon className="h-10 w-10 text-primary-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {platform.name} 版本
                  </h2>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <span>版本 {platform.version}</span>
                    <span>•</span>
                    <span>{platform.size}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">平台特性</h3>
                  <div className="space-y-3">
                    {platform.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-600">
                      <strong>系统要求：</strong> {platform.requirements}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <a
                    href={platform.downloadUrl}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <span className="text-2xl">{platform.storeButton.logo}</span>
                    <span>{platform.storeButton.text}</span>
                  </a>
                  
                  <button className="btn-secondary w-full flex items-center justify-center space-x-2">
                    <QrCodeIcon className="h-5 w-5" />
                    <span>扫码下载</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Release Notes */}
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
              版本更新记录
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              查看最新版本的功能更新和优化内容
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {releaseNotes.map((release, index) => (
              <motion.div
                key={release.version}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-apple mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      版本 {release.version}
                    </h3>
                    <p className="text-gray-600">{release.date}</p>
                  </div>
                  <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                    {release.type}
                  </span>
                </div>

                <div className="space-y-3">
                  {release.changes.map((change, changeIndex) => (
                    <div key={changeIndex} className="flex items-start">
                      <span className="text-lg mr-3 flex-shrink-0">
                        {change.split(' ')[0]}
                      </span>
                      <span className="text-gray-700">
                        {change.substring(change.indexOf(' ') + 1)}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Guide */}
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
              安装指南
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              简单几步，快速安装小脑浏览器
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: '选择平台',
                description: '根据您的设备选择对应的下载链接'
              },
              {
                step: '2', 
                title: '下载安装',
                description: '点击下载按钮，等待应用安装完成'
              },
              {
                step: '3',
                title: '开始使用',
                description: '启动应用，完成初始设置即可开始使用'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
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
              智能浏览，从这里开始
            </h2>
            <p className="text-xl text-primary-100 mb-12 leading-relaxed">
              加入数万用户的选择，体验前所未有的智能浏览体验
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="#ios" 
                className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-4 px-8 rounded-2xl transition-all duration-200 ease-in-out transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <span>🍎</span>
                <span>App Store</span>
              </a>
              <a 
                href="#android" 
                className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-4 px-8 rounded-2xl transition-all duration-200 ease-in-out transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <span>🤖</span>
                <span>Google Play</span>
              </a>
            </div>

            <p className="text-sm text-primary-200 mt-8">
              免费下载 • 无广告 • 隐私保护 • 持续更新
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Download
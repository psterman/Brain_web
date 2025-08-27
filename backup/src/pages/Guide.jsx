import React from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowDownTrayIcon, 
  DevicePhoneMobileIcon, 
  Cog6ToothIcon, 
  PlayIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline'

const Guide = () => {
  const steps = [
    {
      icon: ArrowDownTrayIcon,
      title: '下载安装',
      description: '从官方渠道下载小脑浏览器',
      details: [
        '前往 App Store 或 Google Play',
        '搜索"小脑浏览器"',
        '点击下载并等待安装完成',
        '首次启动时允许必要权限'
      ]
    },
    {
      icon: DevicePhoneMobileIcon,
      title: '初始设置',
      description: '完成基础配置，个性化您的浏览体验',
      details: [
        '选择您的使用习惯和偏好',
        '设置AI助手的响应方式',
        '配置手势操作快捷键',
        '导入现有书签和数据'
      ]
    },
    {
      icon: Cog6ToothIcon,
      title: '功能探索',
      description: '熟悉各项功能，充分利用智能特性',
      details: [
        '体验AI智能助手功能',
        '尝试对话式管理操作',
        '学习常用手势操作',
        '设置桌面小组件'
      ]
    },
    {
      icon: PlayIcon,
      title: '开始使用',
      description: '享受全新的智能浏览体验',
      details: [
        '开始您的日常浏览',
        '使用AI助手获取帮助',
        '通过对话管理您的数据',
        '探索更多高级功能'
      ]
    }
  ]

  const tips = [
    {
      title: '充分利用AI助手',
      content: '在浏览过程中遇到任何问题，都可以直接询问AI助手，它会为您提供智能化的解答和建议。'
    },
    {
      title: '自定义手势操作',
      content: '根据您的使用习惯自定义手势操作，可以大大提高浏览效率。建议先从简单手势开始学习。'
    },
    {
      title: '利用小组件功能',
      content: '将常用的搜索和查询功能添加到桌面小组件，可以快速访问而无需打开应用。'
    },
    {
      title: '定期更新应用',
      content: '保持应用的最新版本，以获得最新功能和安全更新。我们会不断优化用户体验。'
    }
  ]

  const systemRequirements = {
    ios: {
      title: 'iOS 系统要求',
      requirements: [
        'iOS 14.0 或更高版本',
        'iPhone 6s 或更新机型',
        '至少 2GB 可用存储空间',
        '网络连接（用于AI功能）'
      ]
    },
    android: {
      title: 'Android 系统要求',
      requirements: [
        'Android 8.0 (API 26) 或更高版本',
        '至少 3GB RAM',
        '至少 2GB 可用存储空间',
        '网络连接（用于AI功能）'
      ]
    }
  }

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
              用户指南
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              跟随我们的详细指南，快速上手小脑浏览器的所有功能，
              开启您的智能浏览之旅。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Getting Started Steps */}
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
              快速入门
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              四个简单步骤，让您快速掌握小脑浏览器
            </p>
          </motion.div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mr-4 font-bold text-lg">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="space-y-4">
                    {step.details.map((detail, detailIndex) => (
                      <motion.div
                        key={detailIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: detailIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center"
                      >
                        <CheckCircleIcon className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-12 h-80 flex items-center justify-center">
                    <step.icon className="h-24 w-24 text-primary-600" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
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
              使用技巧
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              掌握这些技巧，让您的浏览体验更加高效
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-apple"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {tip.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {tip.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* System Requirements */}
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
              系统要求
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              确保您的设备满足以下要求，以获得最佳体验
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {Object.entries(systemRequirements).map(([platform, data], index) => (
              <motion.div
                key={platform}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card-apple"
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  {data.title}
                </h3>
                <div className="space-y-4">
                  {data.requirements.map((requirement, reqIndex) => (
                    <div key={reqIndex} className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </div>
                  ))}
                </div>
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
              准备好开始了吗？
            </h2>
            <p className="text-xl text-primary-100 mb-12 leading-relaxed">
              按照指南完成设置，立即体验智能浏览的魅力
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="/download" 
                className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-4 px-8 rounded-2xl transition-all duration-200 ease-in-out transform hover:scale-105 shadow-lg"
              >
                立即下载
              </a>
              <a 
                href="/faq" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-4 px-8 rounded-2xl transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                常见问题
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Guide
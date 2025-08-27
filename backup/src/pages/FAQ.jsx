import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

const FAQ = () => {
  const [openItems, setOpenItems] = useState(new Set())

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  const faqCategories = [
    {
      title: '基础功能',
      items: [
        {
          question: '小脑浏览器与其他浏览器有什么不同？',
          answer: '小脑浏览器是一款专注于智能化的浏览器，集成了先进的AI技术。它不仅提供传统的网页浏览功能，还具备AI智能助手、对话式管理、手势操作、多平台聚合等独特功能，让浏览体验更加智能和高效。'
        },
        {
          question: '如何激活AI智能助手功能？',
          answer: '安装应用后，首次启动时会有设置向导。您可以选择启用AI助手功能，并根据提示完成语音权限授权。之后，您可以通过语音命令"嘿，小脑"或点击助手图标来激活AI功能。'
        },
        {
          question: '手势操作如何设置和使用？',
          answer: '进入设置 > 手势管理，您可以查看默认手势操作或自定义新的手势。常用手势包括：双指缩放调整页面大小、三指滑动切换标签页、长按链接调出快捷菜单等。建议从简单手势开始练习。'
        },
        {
          question: '是否支持导入其他浏览器的数据？',
          answer: '支持。在首次设置或设置页面中，您可以选择从Chrome、Safari、Firefox等主流浏览器导入书签、历史记录和密码等数据。导入过程简单且安全。'
        }
      ]
    },
    {
      title: '隐私与安全',
      items: [
        {
          question: '我的浏览数据会被收集吗？',
          answer: '我们严格遵守隐私保护原则。个人浏览数据仅在本地存储，不会上传到服务器。AI功能所需的数据处理也采用本地化技术，确保您的隐私安全。您可以在隐私设置中查看和控制数据使用权限。'
        },
        {
          question: '如何设置隐私保护级别？',
          answer: '在设置 > 隐私与安全中，您可以选择不同的保护级别：标准模式适合日常使用；严格模式会阻止更多追踪器；自定义模式允许您精确控制各项隐私设置。'
        },
        {
          question: '是否支持无痕浏览模式？',
          answer: '支持。点击菜单中的"无痕模式"或使用手势快捷操作即可开启。在无痕模式下，浏览历史、搜索记录、Cookie等数据不会被保存，为您提供完全私密的浏览环境。'
        }
      ]
    },
    {
      title: '技术支持',
      items: [
        {
          question: '应用运行缓慢或崩溃怎么办？',
          answer: '首先尝试重启应用。如果问题持续，请检查设备存储空间是否充足，并确保应用为最新版本。您也可以在设置中清除缓存或重置应用设置。如问题仍存在，请联系技术支持。'
        },
        {
          question: '如何更新应用到最新版本？',
          answer: '应用会自动检查更新并提醒您。您也可以前往App Store或Google Play搜索"小脑浏览器"手动检查更新。建议开启自动更新以获得最新功能和安全补丁。'
        },
        {
          question: '支持哪些设备和系统版本？',
          answer: 'iOS：支持iOS 14.0及以上版本，兼容iPhone 6s及更新机型。Android：支持Android 8.0及以上版本，建议3GB以上RAM。我们持续优化兼容性，支持更多设备。'
        },
        {
          question: '如何备份和恢复我的设置？',
          answer: '在设置 > 账户与同步中，您可以创建云端备份。备份包括书签、设置偏好、自定义手势等。更换设备时，登录同一账户即可自动恢复所有数据。'
        }
      ]
    },
    {
      title: '高级功能',
      items: [
        {
          question: '多平台聚合功能如何使用？',
          answer: '在搜索页面，选择"聚合搜索"模式，输入关键词后会同时搜索多个平台的内容。您可以在设置中自定义要聚合的平台，包括社交媒体、新闻网站、购物平台等。'
        },
        {
          question: '桌面小组件如何添加和配置？',
          answer: '长按桌面空白处，选择"添加小组件"，找到小脑浏览器并选择合适尺寸。配置时可以选择显示内容：快速搜索、常用书签、最近浏览等。小组件会实时同步应用内的相关数据。'
        },
        {
          question: '对话式管理具体能做什么？',
          answer: '您可以用自然语言与AI助手对话来管理浏览数据。例如："帮我找上周看过的那篇科技文章"、"把这个网站加入科技类书签"、"删除所有购物相关的历史记录"等。AI会理解您的意图并执行相应操作。'
        }
      ]
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
              常见问题
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              查找您关心的问题解答，如果没有找到您需要的信息，
              欢迎联系我们的客服团队。
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-primary-100">
                {category.title}
              </h2>
              
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => {
                  const globalIndex = categoryIndex * 100 + itemIndex
                  const isOpen = openItems.has(globalIndex)
                  
                  return (
                    <motion.div
                      key={itemIndex}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: itemIndex * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-primary-200 transition-colors duration-200"
                    >
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                      >
                        <span className="text-lg font-semibold text-gray-900 pr-4">
                          {item.question}
                        </span>
                        {isOpen ? (
                          <ChevronUpIcon className="h-5 w-5 text-primary-600 flex-shrink-0" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6">
                              <p className="text-gray-600 leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              还有其他问题？
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              如果您没有找到想要的答案，我们的客服团队随时为您提供帮助
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-apple text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">邮件支持</h3>
                <p className="text-gray-600 mb-4">support@xiaonao.com</p>
                <span className="text-sm text-primary-600">24小时内回复</span>
              </div>
              
              <div className="card-apple text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">在线客服</h3>
                <p className="text-gray-600 mb-4">实时聊天支持</p>
                <span className="text-sm text-primary-600">工作日 9:00-18:00</span>
              </div>
              
              <div className="card-apple text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">用户社区</h3>
                <p className="text-gray-600 mb-4">与其他用户交流</p>
                <span className="text-sm text-primary-600">24/7 活跃社区</span>
              </div>
            </div>
          </motion.div>
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
              问题解决了吗？
            </h2>
            <p className="text-xl text-primary-100 mb-12 leading-relaxed">
              立即下载小脑浏览器，开始您的智能浏览体验
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

export default FAQ
import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    产品: [
      { name: '功能特色', path: '/features' },
      { name: '下载', path: '/download' },
      { name: '系统要求', path: '/guide' },
    ],
    支持: [
      { name: '用户指南', path: '/guide' },
      { name: '常见问题', path: '/faq' },
      { name: '联系我们', path: '/contact' },
    ],
    公司: [
      { name: '关于我们', path: '/about' },
      { name: '隐私政策', path: '/privacy' },
      { name: '服务条款', path: '/terms' },
    ],
  }

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container-custom">
        <div className="py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">脑</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">小脑</span>
              </Link>
              <p className="text-sm text-gray-600 max-w-xs">
                智能浏览的新时代，我们为你找寻一切线索。
              </p>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-500">
                © {currentYear} 小脑浏览器. 保留所有权利.
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                  aria-label="微信"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 4.882-1.275 7.02.747.166-.024.336-.034.505-.034 4.8 0 8.691 3.288 8.691 7.342 0 4.049-3.891 7.337-8.691 7.337a9.94 9.94 0 0 1-1.967-.191.719.719 0 0 0-.622.129l-1.287.753a.219.219 0 0 1-.114.037.195.195 0 0 1-.194-.195c0-.049.021-.097.033-.143l.263-.999a.4.4 0 0 0-.143-.45c-1.242-.894-2.031-2.297-2.031-3.766 0-2.342 1.667-4.42 4.266-5.552a4.51 4.51 0 0 1-.265-1.511C17.721 5.483 14.831 2.188 8.691 2.188z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                  aria-label="微博"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.31 14.655c-.867-.816-2.082-.816-2.949 0-.867.817-.867 2.144 0 2.96.867.817 2.082.817 2.949 0 .867-.816.867-2.143 0-2.96zM7.627 17.152c-.53-.5-1.274-.5-1.804 0-.53.5-.53 1.312 0 1.812.53.5 1.274.5 1.804 0 .53-.5.53-1.312 0-1.812zM12 2.04c-5.485 0-9.96 4.475-9.96 9.96 0 5.485 4.475 9.96 9.96 9.96 5.485 0 9.96-4.475 9.96-9.96C21.96 6.515 17.485 2.04 12 2.04z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
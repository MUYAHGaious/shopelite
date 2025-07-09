import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Github } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Shop',
      links: [
        { name: 'All Products', path: '/products' },
        { name: 'Electronics', path: '/products?category=Electronics' },
        { name: 'Clothing', path: '/products?category=Clothing' },
        { name: 'Home & Garden', path: '/products?category=Home & Garden' },
      ],
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'Contact Us', path: '/contact' },
        { name: 'Shipping Info', path: '/shipping' },
        { name: 'Returns', path: '/returns' },
        { name: 'FAQ', path: '/faq' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Careers', path: '/careers' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
      ],
    },
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Github, href: '#', label: 'Github' },
  ]

  return (
    <footer className="bg-black/90 border-t border-purple-500/20 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                EliteShop
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your premium destination for high-quality products. Experience luxury shopping with cutting-edge technology and exceptional service.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4" />
                <span>muyahmuyahgaious97@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4" />
                <span>237680684405</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>123 Elite Street, Premium City</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-white font-semibold text-lg">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm"
                      onClick={() => {
                        if (link.path === '/about') {
                          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                        }
                      }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-white font-semibold text-lg mb-2">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for exclusive deals and new product announcements.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} EliteShop. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.1, y: -2 }}
                className="p-2 bg-gray-800 rounded-full hover:bg-purple-600/20 transition-colors duration-200"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5 text-gray-400 hover:text-purple-400" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


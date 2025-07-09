import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ShoppingCart, Menu, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '../context/CartContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { cartCount } = useCart()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Electronics', path: '/products?category=Electronics' },
    { name: 'Clothing', path: '/products?category=Clothing' },
    { name: 'Admin', path: '/admin' },
  ]

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-purple-500/20"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              EliteShop
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-300 hover:text-purple-400 transition-colors duration-200 relative group"
                onClick={() => {
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                }}
              >
                {item.name}
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"
                />
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0 bg-purple-600 hover:bg-purple-700"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gray-800/50 rounded-full hover:bg-purple-600/20 transition-colors duration-200"
              >
                <ShoppingCart className="w-6 h-6 text-gray-300" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-300 hover:text-purple-400"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-gray-700"
          >
            <nav className="flex flex-col space-y-4 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200 py-2"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0 bg-purple-600 hover:bg-purple-700"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}

export default Header


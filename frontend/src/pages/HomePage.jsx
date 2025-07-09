import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Zap, Shield, Truck, Sparkles, TrendingUp, Users, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [stats, setStats] = useState({
    totalProducts: 0,
    happyCustomers: 0,
    ordersDelivered: 0,
    satisfaction: 0
  })

  useEffect(() => {
    // Fetch featured products
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?per_page=6')
        if (response.ok) {
          const data = await response.json()
          setFeaturedProducts(data.products || [])
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
      }
    }

    fetchFeaturedProducts()

    // Animate stats
    const animateStats = () => {
      const targets = { totalProducts: 1000, happyCustomers: 50000, ordersDelivered: 25000, satisfaction: 98 }
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps

      let step = 0
      const interval = setInterval(() => {
        step++
        const progress = step / steps
        
        setStats({
          totalProducts: Math.floor(targets.totalProducts * progress),
          happyCustomers: Math.floor(targets.happyCustomers * progress),
          ordersDelivered: Math.floor(targets.ordersDelivered * progress),
          satisfaction: Math.floor(targets.satisfaction * progress)
        })

        if (step >= steps) {
          clearInterval(interval)
          setStats(targets)
        }
      }, stepDuration)

      return () => clearInterval(interval)
    }

    const timer = setTimeout(animateStats, 1000)
    return () => clearTimeout(timer)
  }, [])

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Ultra-fast delivery and seamless shopping experience'
    },
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'Advanced security measures to protect your data'
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50 worldwide'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Only the finest products from trusted brands'
    }
  ]

  const statsData = [
    { icon: TrendingUp, label: 'Products', value: stats.totalProducts, suffix: '+' },
    { icon: Users, label: 'Happy Customers', value: stats.happyCustomers, suffix: '+' },
    { icon: Truck, label: 'Orders Delivered', value: stats.ordersDelivered, suffix: '+' },
    { icon: Star, label: 'Satisfaction Rate', value: stats.satisfaction, suffix: '%' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              EliteShop
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Experience the future of premium e-commerce. Discover luxury products with cutting-edge technology and unparalleled service.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold group"
                >
                  Explore Products
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              

            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-black/40">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <motion.div
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                  key={stat.value}
                >
                  {stat.value.toLocaleString()}{stat.suffix}
                </motion.div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">EliteShop</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience premium shopping with advanced features designed for the modern consumer
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4 bg-black/40">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Featured <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Products</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover our handpicked selection of premium products
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image_url || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-purple-400">${product.price}</span>
                      <Link to={`/products/${product.id}`}>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center mt-12"
          >
            <Link to="/products">
              <Button
                size="lg"
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-4 text-lg"
              >
                View All Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl" />
              <div className="relative bg-gray-800/50 border border-gray-700 rounded-3xl p-12">
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Experience <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Elite Shopping</span>?
                </h2>
                <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                  Join thousands of satisfied customers who have discovered the future of premium e-commerce
                </p>
                <Link to="/products">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-xl font-semibold"
                  >
                    Start Shopping Now
                    <ArrowRight className="ml-2 w-6 h-6" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage



      {/* Reviews Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Our <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Customers Say</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Hear from our happy customers about their EliteShop experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4">
                      "EliteShop has completely transformed my online shopping experience. The quality of products is unmatched, and the delivery is incredibly fast. Highly recommend!"
                    </p>
                    <div className="font-semibold text-white">John Doe</div>
                    <div className="text-gray-400 text-sm">Verified Buyer</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



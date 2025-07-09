import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '../context/CartContext'

const ProductDetailPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState([])
  
  const { addToCart, isLoading: cartLoading } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
        
        // Fetch related products from the same category
        if (data.category) {
          const relatedResponse = await fetch(`/api/products?category=${encodeURIComponent(data.category)}&per_page=4`)
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json()
            setRelatedProducts(relatedData.products?.filter(p => p.id !== parseInt(id)) || [])
          }
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    const result = await addToCart(product.id, quantity)
    if (result.success) {
      console.log('Added to cart successfully')
    } else {
      console.error('Failed to add to cart:', result.error)
    }
  }

  const features = [
    { icon: Truck, title: 'Free Shipping', description: 'Free shipping on orders over $50' },
    { icon: Shield, title: 'Secure Payment', description: '100% secure payment processing' },
    { icon: RotateCcw, title: 'Easy Returns', description: '30-day return policy' },
    { icon: Award, title: 'Quality Guarantee', description: 'Premium quality assurance' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center py-20">
        <div className="text-6xl mb-4">😞</div>
        <h2 className="text-2xl font-semibold text-white mb-2">Product Not Found</h2>
        <p className="text-gray-400 mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/products">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>
    )
  }

  // Mock additional images for demo
  const productImages = [
    product.image_url,
    product.image_url,
    product.image_url,
  ].filter(Boolean)

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            to="/products"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-2xl bg-gray-800">
              <img
                src={productImages[selectedImage] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-black/50 border-gray-600 text-white hover:bg-black/70"
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-black/50 border-gray-600 text-white hover:bg-black/70"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-purple-500'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <img
                      src={image || '/placeholder-product.jpg'}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Category */}
            <div className="text-purple-400 font-medium">{product.category}</div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-white">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-400">(4.8) • 127 reviews</span>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-purple-400">${product.price}</div>

            {/* Description */}
            <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-400 font-medium">
                {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="text-white font-medium">Quantity:</label>
              <div className="flex items-center border border-gray-600 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-white hover:bg-gray-700 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-white border-x border-gray-600">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  className="px-3 py-2 text-white hover:bg-gray-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={cartLoading || product.stock_quantity === 0}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-semibold"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {cartLoading ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500/10 py-3 px-6"
              >
                Buy Now
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-700">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600/20 rounded-lg">
                    <feature.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{feature.title}</div>
                    <div className="text-gray-400 text-xs">{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="py-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img
                        src={relatedProduct.image_url || '/placeholder-product.jpg'}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-purple-400">${relatedProduct.price}</span>
                        <Link to={`/products/${relatedProduct.id}`}>
                          <Button size="sm" variant="outline" className="border-gray-600">
                            View
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage


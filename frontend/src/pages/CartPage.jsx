import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '../context/CartContext'

const CartPage = () => {
  const {
    cartItems,
    cartTotal,
    cartCount,
    isLoading,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart
  } = useCart()

  useEffect(() => {
    fetchCart()
  }, [])

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(itemId)
    } else {
      await updateCartItem(itemId, newQuantity)
    }
  }

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId)
  }

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart()
    }
  }

  if (isLoading) {
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-32 h-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <ShoppingBag className="w-16 h-16 text-white" />
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-4">Your Cart is Empty</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link to="/products">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            to="/products"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Shopping <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Cart</span>
              </h1>
              <p className="text-gray-400">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            {cartItems.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="border-red-500 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.01 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.product?.image_url || '/placeholder-product.jpg'}
                          alt={item.product?.name || 'Product'}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-white line-clamp-1">
                              {item.product?.name || 'Unknown Product'}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {item.product?.category || 'Uncategorized'}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                          {item.product?.description || 'No description available'}
                        </p>

                        <div className="flex justify-between items-center">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-600 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="px-3 py-2 text-white hover:bg-gray-700 transition-colors"
                              disabled={isLoading}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 text-white border-x border-gray-600 min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="px-3 py-2 text-white hover:bg-gray-700 transition-colors"
                              disabled={isLoading || item.quantity >= (item.product?.stock_quantity || 0)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-lg font-semibold text-purple-400">
                              ${item.subtotal?.toFixed(2) || (item.product?.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-400">
                              ${item.product?.price?.toFixed(2) || '0.00'} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <Card className="bg-gray-800/50 border-gray-700 sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span className="text-green-400">
                      {cartTotal >= 50 ? 'Free' : '$9.99'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-gray-300">
                    <span>Tax</span>
                    <span>${(cartTotal * 0.08).toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-600 pt-4">
                    <div className="flex justify-between text-xl font-bold text-white">
                      <span>Total</span>
                      <span className="text-purple-400">
                        ${(cartTotal + (cartTotal >= 50 ? 0 : 9.99) + cartTotal * 0.08).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {cartTotal < 50 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
                    <p className="text-yellow-400 text-sm">
                      Add ${(50 - cartTotal).toFixed(2)} more to get free shipping!
                    </p>
                  </div>
                )}

                <Link to="/checkout" className="block">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-semibold"
                  >
                    Proceed to Checkout
                  </Button>
                </Link>

                <div className="mt-4 text-center">
                  <Link
                    to="/products"
                    className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Security Features */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex items-center justify-center gap-4 text-gray-400 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>SSL Encrypted</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CartPage


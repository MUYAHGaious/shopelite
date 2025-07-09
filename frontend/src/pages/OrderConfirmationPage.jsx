import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Package, Truck, Mail, ArrowRight, Download, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const OrderConfirmationPage = () => {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [orderNumber])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${orderNumber}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

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

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center py-20">
        <div className="text-6xl mb-4">😞</div>
        <h2 className="text-2xl font-semibold text-white mb-2">Order Not Found</h2>
        <p className="text-gray-400 mb-6">The order you're looking for doesn't exist.</p>
        <Link to="/products">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            Continue Shopping
          </Button>
        </Link>
      </div>
    )
  }

  const orderSteps = [
    { icon: CheckCircle, title: 'Order Confirmed', description: 'Your order has been received', completed: true },
    { icon: Package, title: 'Processing', description: 'We are preparing your items', completed: order.status !== 'pending' },
    { icon: Truck, title: 'Shipped', description: 'Your order is on the way', completed: ['shipped', 'delivered'].includes(order.status) },
    { icon: Star, title: 'Delivered', description: 'Enjoy your purchase!', completed: order.status === 'delivered' },
  ]

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
            className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Order <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Confirmed!</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-xl text-gray-400 mb-6"
          >
            Thank you for your purchase! Your order has been successfully placed.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 inline-block"
          >
            <p className="text-gray-300 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-purple-400">{order.order_number}</p>
          </motion.div>
        </motion.div>

        {/* Order Progress */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mb-12"
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-xl">Order Progress</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                {orderSteps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                      step.completed 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <h3 className={`font-semibold text-sm mb-1 ${
                      step.completed ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-500 text-center">{step.description}</p>
                    
                    {index < orderSteps.length - 1 && (
                      <div className={`absolute w-16 h-0.5 mt-6 ml-16 ${
                        step.completed ? 'bg-purple-600' : 'bg-gray-600'
                      }`} style={{ transform: 'translateX(50%)' }} />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Order Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Order Date</span>
                    <span className="text-white">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className={`font-medium capitalize ${
                      order.status === 'confirmed' ? 'text-green-400' :
                      order.status === 'processing' ? 'text-yellow-400' :
                      order.status === 'shipped' ? 'text-blue-400' :
                      order.status === 'delivered' ? 'text-purple-400' :
                      'text-gray-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Amount</span>
                    <span className="text-white font-bold">${order.total_amount.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-600 pt-4">
                    <h4 className="text-white font-medium mb-2">Shipping Address</h4>
                    <p className="text-gray-400 text-sm">{order.shipping_address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Items Ordered</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.product?.name}</p>
                        <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-purple-400 font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.6 }}
          className="mb-12"
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-white font-medium mb-2">Email Confirmation</h3>
                  <p className="text-gray-400 text-sm">
                    You'll receive an email confirmation shortly at {order.customer_email}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-white font-medium mb-2">Processing</h3>
                  <p className="text-gray-400 text-sm">
                    We'll start preparing your order within 24 hours
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-white font-medium mb-2">Shipping</h3>
                  <p className="text-gray-400 text-sm">
                    You'll receive tracking information once shipped
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          
          <Link to="/products">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Support Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.6 }}
          className="text-center mt-12 p-6 bg-gray-800/30 rounded-lg border border-gray-700"
        >
          <h3 className="text-white font-medium mb-2">Need Help?</h3>
          <p className="text-gray-400 text-sm mb-4">
            If you have any questions about your order, please don't hesitate to contact us.
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <span className="text-purple-400">support@eliteshop.com</span>
            <span className="text-gray-600">|</span>
            <span className="text-purple-400">+1 (555) 123-4567</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default OrderConfirmationPage


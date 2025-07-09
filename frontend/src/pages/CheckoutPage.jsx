import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CreditCard, Lock, Truck, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '../context/CartContext'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { cartItems, cartTotal, cartCount, clearCart } = useCart()
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    shipping_address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'United States',
    payment_method: 'credit_card',
    card_number: '',
    expiry_date: '',
    cvv: '',
    cardholder_name: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    // Redirect to cart if empty
    if (cartItems.length === 0) {
      navigate('/cart')
    }
  }, [cartItems, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}
    
    if (step === 1) {
      if (!formData.customer_name.trim()) newErrors.customer_name = 'Name is required'
      if (!formData.customer_email.trim()) newErrors.customer_email = 'Email is required'
      if (!/\S+@\S+\.\S+/.test(formData.customer_email)) newErrors.customer_email = 'Invalid email format'
    }
    
    if (step === 2) {
      if (!formData.shipping_address.trim()) newErrors.shipping_address = 'Address is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
      if (!formData.state.trim()) newErrors.state = 'State is required'
      if (!formData.zip_code.trim()) newErrors.zip_code = 'ZIP code is required'
    }
    
    if (step === 3) {
      if (!formData.card_number.trim()) newErrors.card_number = 'Card number is required'
      if (!formData.expiry_date.trim()) newErrors.expiry_date = 'Expiry date is required'
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required'
      if (!formData.cardholder_name.trim()) newErrors.cardholder_name = 'Cardholder name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(3, prev + 1))
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep(3)) return
    
    setIsSubmitting(true)
    
    try {
      // Prepare order data
      const orderData = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        shipping_address: `${formData.shipping_address}, ${formData.city}, ${formData.state} ${formData.zip_code}, ${formData.country}`
      }
      
      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })
      
      if (response.ok) {
        const data = await response.json()
        await clearCart()
        navigate(`/order-confirmation/${data.order.order_number}`)
      } else {
        const error = await response.json()
        setErrors({ submit: error.error || 'Failed to place order' })
      }
    } catch (error) {
      console.error('Error placing order:', error)
      setErrors({ submit: 'Failed to place order. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const subtotal = cartTotal
  const shipping = cartTotal >= 50 ? 0 : 9.99
  const tax = cartTotal * 0.08
  const total = subtotal + shipping + tax

  const steps = [
    { number: 1, title: 'Contact Info', icon: CheckCircle },
    { number: 2, title: 'Shipping', icon: Truck },
    { number: 3, title: 'Payment', icon: CreditCard },
  ]

  if (cartItems.length === 0) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            to="/cart"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Secure <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Checkout</span>
          </h1>
          <div className="flex items-center gap-2 text-gray-400">
            <Lock className="w-4 h-4" />
            <span>Your information is protected with SSL encryption</span>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex justify-center">
            <div className="flex items-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    currentStep >= step.number
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : 'border-gray-600 text-gray-400'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="font-semibold">{step.number}</span>
                    )}
                  </div>
                  <span className={`ml-2 font-medium ${
                    currentStep >= step.number ? 'text-white' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-purple-600' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl">
                    {currentStep === 1 && 'Contact Information'}
                    {currentStep === 2 && 'Shipping Address'}
                    {currentStep === 3 && 'Payment Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Contact Info */}
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2">Full Name *</label>
                          <Input
                            type="text"
                            name="customer_name"
                            value={formData.customer_name}
                            onChange={handleInputChange}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="Enter your full name"
                          />
                          {errors.customer_name && (
                            <p className="text-red-400 text-sm mt-1">{errors.customer_name}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-white font-medium mb-2">Email Address *</label>
                          <Input
                            type="email"
                            name="customer_email"
                            value={formData.customer_email}
                            onChange={handleInputChange}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="Enter your email address"
                          />
                          {errors.customer_email && (
                            <p className="text-red-400 text-sm mt-1">{errors.customer_email}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 2: Shipping */}
                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2">Street Address *</label>
                          <Input
                            type="text"
                            name="shipping_address"
                            value={formData.shipping_address}
                            onChange={handleInputChange}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="Enter your street address"
                          />
                          {errors.shipping_address && (
                            <p className="text-red-400 text-sm mt-1">{errors.shipping_address}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-white font-medium mb-2">City *</label>
                            <Input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="City"
                            />
                            {errors.city && (
                              <p className="text-red-400 text-sm mt-1">{errors.city}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-white font-medium mb-2">State *</label>
                            <Input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="State"
                            />
                            {errors.state && (
                              <p className="text-red-400 text-sm mt-1">{errors.state}</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-white font-medium mb-2">ZIP Code *</label>
                          <Input
                            type="text"
                            name="zip_code"
                            value={formData.zip_code}
                            onChange={handleInputChange}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="ZIP Code"
                          />
                          {errors.zip_code && (
                            <p className="text-red-400 text-sm mt-1">{errors.zip_code}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Payment */}
                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2">Cardholder Name *</label>
                          <Input
                            type="text"
                            name="cardholder_name"
                            value={formData.cardholder_name}
                            onChange={handleInputChange}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="Name on card"
                          />
                          {errors.cardholder_name && (
                            <p className="text-red-400 text-sm mt-1">{errors.cardholder_name}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-white font-medium mb-2">Card Number *</label>
                          <Input
                            type="text"
                            name="card_number"
                            value={formData.card_number}
                            onChange={handleInputChange}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                          {errors.card_number && (
                            <p className="text-red-400 text-sm mt-1">{errors.card_number}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-white font-medium mb-2">Expiry Date *</label>
                            <Input
                              type="text"
                              name="expiry_date"
                              value={formData.expiry_date}
                              onChange={handleInputChange}
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                            {errors.expiry_date && (
                              <p className="text-red-400 text-sm mt-1">{errors.expiry_date}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-white font-medium mb-2">CVV *</label>
                            <Input
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="123"
                              maxLength={4}
                            />
                            {errors.cvv && (
                              <p className="text-red-400 text-sm mt-1">{errors.cvv}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {errors.submit && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mt-4">
                        <p className="text-red-400">{errors.submit}</p>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                      {currentStep > 1 ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrevStep}
                          className="border-gray-600 text-gray-300"
                        >
                          Previous
                        </Button>
                      ) : (
                        <div></div>
                      )}
                      
                      {currentStep < 3 ? (
                        <Button
                          type="button"
                          onClick={handleNextStep}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          {isSubmitting ? 'Processing...' : 'Place Order'}
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <Card className="bg-gray-800/50 border-gray-700 sticky top-8">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Cart Items */}
                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium line-clamp-1">
                          {item.product?.name}
                        </p>
                        <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-purple-400 font-medium">
                        ${(item.product?.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t border-gray-600 pt-4">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400' : ''}>
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-gray-300">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-xl font-bold text-white border-t border-gray-600 pt-3">
                    <span>Total</span>
                    <span className="text-purple-400">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Info */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                    <Lock className="w-3 h-3" />
                    <span>Secure SSL Encrypted Checkout</span>
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

export default CheckoutPage


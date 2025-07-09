import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { 
  Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown,
  Plus, Edit, Trash2, Eye, Search, Filter, MoreVertical, Calendar,
  AlertCircle, CheckCircle, Clock, Truck, Star, Activity, LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdminAuth } from '@/context/AdminAuthContext'
import ImageUpload from '@/components/ImageUpload'

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock_quantity: '',
    image_url: ''
  })
  const [editingProduct, setEditingProduct] = useState(null)
  
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading, admin, logout } = useAdminAuth()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login')
    }
  }, [isAuthenticated, authLoading, navigate])

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData()
    }
  }, [isAuthenticated])

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch products
      const productsResponse = await fetch('/api/admin/products', {
        credentials: 'include'
      })
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setProducts(productsData.products || [])
      }

      // Fetch orders
      const ordersResponse = await fetch('/api/admin/orders', {
        credentials: 'include'
      })
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        setOrders(ordersData.orders || [])
      }

      // Fetch stats
      const statsResponse = await fetch('/api/admin/orders/stats', {
        credentials: 'include'
      })
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock_quantity: parseInt(newProduct.stock_quantity)
        })
      })

      if (response.ok) {
        setNewProduct({
          name: '', description: '', price: '', category: '', stock_quantity: '', image_url: ''
        })
        fetchDashboardData()
      } else if (response.status === 401) {
        // Handle authentication failure
        await logout()
        navigate('/admin/login')
      }
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  const handleUpdateProduct = async (productId, updates) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        setEditingProduct(null)
        fetchDashboardData()
      } else if (response.status === 401) {
        await logout()
        navigate('/admin/login')
      }
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE',
          credentials: 'include'
        })

        if (response.ok) {
          fetchDashboardData()
        } else if (response.status === 401) {
          await logout()
          navigate('/admin/login')
        }
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  // Mock data for charts
  const salesData = [
    { month: 'Jan', sales: 4000, orders: 240 },
    { month: 'Feb', sales: 3000, orders: 198 },
    { month: 'Mar', sales: 5000, orders: 300 },
    { month: 'Apr', sales: 4500, orders: 278 },
    { month: 'May', sales: 6000, orders: 389 },
    { month: 'Jun', sales: 5500, orders: 349 }
  ]

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#8B5CF6' },
    { name: 'Clothing', value: 25, color: '#EC4899' },
    { name: 'Home & Garden', value: 20, color: '#10B981' },
    { name: 'Sports', value: 15, color: '#F59E0B' },
    { name: 'Others', value: 5, color: '#6B7280' }
  ]

  const revenueData = [
    { day: 'Mon', revenue: 1200 },
    { day: 'Tue', revenue: 1900 },
    { day: 'Wed', revenue: 3000 },
    { day: 'Thu', revenue: 2500 },
    { day: 'Fri', revenue: 3200 },
    { day: 'Sat', revenue: 2800 },
    { day: 'Sun', revenue: 2100 }
  ]

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ]

  const statCards = [
    {
      title: 'Recent Orders',
      value: stats.recent_orders_30_days || 0,
      change: '+15.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Total Revenue',
      value: `XFA ${stats.total_revenue?.toFixed(2) || '0.00'}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Total Orders',
      value: stats.total_orders || 0,
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Products',
      value: products.length,
      change: '+3.1%',
      trend: 'up',
      icon: Package,
      color: 'from-purple-500 to-pink-500'
    }
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

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Admin <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Dashboard</span>
            </h1>
            <p className="text-xl text-gray-400">Manage your e-commerce platform</p>
            {admin && (
              <p className="text-sm text-gray-500 mt-1">Welcome back, {admin.username}</p>
            )}
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg border border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-8"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                          <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                          <div className="flex items-center mt-2">
                            {stat.trend === 'up' ? (
                              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                            )}
                            <span className={`text-sm font-medium ${
                              stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {stat.change}
                            </span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sales Chart */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Sales Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#8B5CF6" 
                        fill="url(#salesGradient)" 
                      />
                      <defs>
                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Category Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          order.status === 'confirmed' ? 'bg-green-500' :
                          order.status === 'processing' ? 'bg-yellow-500' :
                          order.status === 'shipped' ? 'bg-blue-500' :
                          'bg-gray-500'
                        }`} />
                        <div>
                          <p className="text-white font-medium">{order.order_number}</p>
                          <p className="text-gray-400 text-sm">{order.customer_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">XFA {order.total_amount.toFixed(2)}</p>
                        <p className="text-gray-400 text-sm capitalize">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-8"
          >
            {/* Add Product Form */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Add New Product</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                  <Input
                    placeholder="Price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                  <Input
                    placeholder="Category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Input
                    placeholder="Stock Quantity"
                    type="number"
                    value={newProduct.stock_quantity}
                    onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <div className="md:col-span-2">
                    <label className="block text-white text-sm font-medium mb-2">Product Image</label>
                    <ImageUpload
                      onImageUpload={(imageUrl, filename) => {
                        setNewProduct({...newProduct, image_url: imageUrl});
                      }}
                      currentImage={newProduct.image_url}
                    />
                  </div>
                  <textarea
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="bg-gray-700 border border-gray-600 text-white rounded-md p-3 md:col-span-2 h-24 resize-none"
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 md:col-span-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Products List */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Products ({products.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="bg-gray-700/30 rounded-lg p-4">
                      <img
                        src={product.image_url || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h3 className="text-white font-medium mb-1">{product.name}</h3>
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-purple-400 font-bold">XFA {product.price}</span>
                        <span className="text-gray-400 text-sm">Stock: {product.stock_quantity}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingProduct(product)}
                          className="flex-1 border-gray-600"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="border-red-500 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Edit Product Modal */}
            {editingProduct && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                  <h3 className="text-white text-xl font-semibold mb-4">Edit Product</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateProduct(editingProduct.id, editingProduct);
                  }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Product Name"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                    <Input
                      placeholder="Price"
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                    <Input
                      placeholder="Category"
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Input
                      placeholder="Stock Quantity"
                      type="number"
                      value={editingProduct.stock_quantity}
                      onChange={(e) => setEditingProduct({...editingProduct, stock_quantity: parseInt(e.target.value)})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <div className="md:col-span-2">
                      <label className="block text-white text-sm font-medium mb-2">Product Image</label>
                      <ImageUpload
                        onImageUpload={(imageUrl, filename) => {
                          setEditingProduct({...editingProduct, image_url: imageUrl});
                        }}
                        currentImage={editingProduct.image_url}
                      />
                    </div>
                    <textarea
                      placeholder="Description"
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                      className="bg-gray-700 border border-gray-600 text-white rounded-md p-3 md:col-span-2 h-24 resize-none"
                    />
                    <div className="md:col-span-2 flex gap-2">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex-1"
                      >
                        Update Product
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingProduct(null)}
                        className="border-gray-600"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">All Orders ({orders.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-white font-medium">{order.order_number}</h3>
                          <p className="text-gray-400 text-sm">{order.customer_name} • {order.customer_email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">XFA {order.total_amount.toFixed(2)}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                            order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                            order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{order.shipping_address}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-gray-600">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-600">
                            <Edit className="w-3 h-3 mr-1" />
                            Update Status
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-8"
          >
            {/* Revenue Chart */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Weekly Revenue</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="revenue" fill="url(#revenueGradient)" />
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#EC4899" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Conversion Rate</h3>
                  <p className="text-3xl font-bold text-green-400 mb-1">3.2%</p>
                  <p className="text-gray-400 text-sm">+0.5% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Avg. Order Value</h3>
                  <p className="text-3xl font-bold text-blue-400 mb-1">XFA 127</p>
                  <p className="text-gray-400 text-sm">+XFA 12 from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Customer Rating</h3>
                  <p className="text-3xl font-bold text-purple-400 mb-1">4.8</p>
                  <p className="text-gray-400 text-sm">Based on 1,247 reviews</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdminPage


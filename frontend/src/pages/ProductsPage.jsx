import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, Grid, List, ChevronDown, Star, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '../context/CartContext'

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  
  const { addToCart, isLoading: cartLoading } = useCart()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [searchParams, currentPage, sortBy, sortOrder])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: '12',
        sort_by: sortBy,
        sort_order: sortOrder,
      })

      if (selectedCategory) params.append('category', selectedCategory)
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        setTotalPages(data.pages || 1)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/products/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (searchQuery) {
      params.set('search', searchQuery)
    } else {
      params.delete('search')
    }
    setSearchParams(params)
    setCurrentPage(1)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    const params = new URLSearchParams(searchParams)
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    setSearchParams(params)
    setCurrentPage(1)
  }

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
    setCurrentPage(1)
  }

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1)
    if (result.success) {
      // Could add a toast notification here
      console.log('Added to cart successfully')
    } else {
      console.error('Failed to add to cart:', result.error)
    }
  }

  const sortOptions = [
    { label: 'Newest First', value: 'created_at', order: 'desc' },
    { label: 'Oldest First', value: 'created_at', order: 'asc' },
    { label: 'Price: Low to High', value: 'price', order: 'asc' },
    { label: 'Price: High to Low', value: 'price', order: 'desc' },
    { label: 'Name: A to Z', value: 'name', order: 'asc' },
    { label: 'Name: Z to A', value: 'name', order: 'desc' },
  ]

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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Premium <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Products</span>
          </h1>
          <p className="text-xl text-gray-400">Discover our curated collection of luxury items</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 pr-12"
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

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Filter className="w-4 h-4 mr-2" />
                <span className="text-black">Filters</span>
              </Button>

              {/* View Mode */}
              <div className="flex border border-gray-600 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-')
                    handleSortChange(newSortBy, newSortOrder)
                  }}
                  className="bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2 pr-8 appearance-none focus:border-purple-500"
                >
                  {sortOptions.map((option) => (
                    <option key={`${option.value}-${option.order}`} value={`${option.value}-${option.order}`}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6"
            >
              <h3 className="text-white font-semibold mb-4">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange('')}
                  className="border-gray-600"
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategoryChange(category)}
                    className="border-gray-600"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 overflow-hidden h-full">
                  {viewMode === 'grid' ? (
                    <>
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image_url || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-2 right-2">
                          <div className="flex items-center bg-black/70 rounded-full px-2 py-1">
                            <Star className="w-3 h-3 text-yellow-400 mr-1" />
                            <span className="text-xs text-white">4.8</span>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{product.name}</h3>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl font-bold text-purple-400">XFA {product.price}</span>
                            <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                              {product.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/products/${product.id}`} className="flex-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              View Details
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product.id)}
                            disabled={cartLoading}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={product.image_url || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
                          <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-purple-400">XFA {product.price}</span>
                            <div className="flex gap-2">
                              <Link to={`/products/${product.id}`}>
                                <Button variant="outline" size="sm" className="border-gray-600">
                                  View Details
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                onClick={() => handleAddToCart(product.id)}
                                disabled={cartLoading}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                              >
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex justify-center items-center gap-2 mt-12"
          >
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="border-gray-600"
            >
              Previous
            </Button>
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(pageNum)}
                  className="border-gray-600"
                >
                  {pageNum}
                </Button>
              )
            })}
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="border-gray-600"
            >
              Next
            </Button>
          </motion.div>
        )}

        {/* No Products Found */}
        {!loading && products.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No Products Found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('')
                setSearchParams({})
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage


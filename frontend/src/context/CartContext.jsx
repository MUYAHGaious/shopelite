import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

const API_BASE_URL = '/api'

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [cartTotal, setCartTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch cart data from API
  const fetchCart = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/cart`)
      if (response.ok) {
        const data = await response.json()
        setCartItems(data.items || [])
        setCartCount(data.item_count || 0)
        setCartTotal(data.total || 0)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity,
        }),
      })

      if (response.ok) {
        await fetchCart() // Refresh cart data
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { success: false, error: 'Failed to add item to cart' }
    } finally {
      setIsLoading(false)
    }
  }

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/cart/update/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      })

      if (response.ok) {
        await fetchCart() // Refresh cart data
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      console.error('Error updating cart item:', error)
      return { success: false, error: 'Failed to update cart item' }
    } finally {
      setIsLoading(false)
    }
  }

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/cart/remove/${itemId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchCart() // Refresh cart data
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      return { success: false, error: 'Failed to remove item from cart' }
    } finally {
      setIsLoading(false)
    }
  }

  // Clear entire cart
  const clearCart = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/cart/clear`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCartItems([])
        setCartCount(0)
        setCartTotal(0)
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      return { success: false, error: 'Failed to clear cart' }
    } finally {
      setIsLoading(false)
    }
  }

  // Load cart data on component mount
  useEffect(() => {
    fetchCart()
  }, [])

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}


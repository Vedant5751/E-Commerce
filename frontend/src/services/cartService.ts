import { apiClient } from './api'
import { CartItem, ApiResponse } from '../types'

interface CartResponse {
  cartItems: CartItem[]
  total: number
  itemCount: number
}

export const cartService = {
  async getCart(): Promise<CartResponse> {
    const response = await apiClient.get<ApiResponse<CartResponse>>('/cart')
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get cart')
    }
    return response.data
  },

  async addToCart(productId: number, quantity: number): Promise<void> {
    const response = await apiClient.post<ApiResponse<void>>('/cart', {
      productId,
      quantity,
    })
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to add item to cart')
    }
  },

  async updateQuantity(productId: number, quantity: number): Promise<void> {
    const response = await apiClient.put<ApiResponse<void>>(`/cart/${productId}`, {
      quantity,
    })
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to update cart item')
    }
  },

  async removeFromCart(productId: number): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/cart/${productId}`)
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to remove item from cart')
    }
  },

  async clearCart(): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>('/cart/clear')
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to clear cart')
    }
  },
}

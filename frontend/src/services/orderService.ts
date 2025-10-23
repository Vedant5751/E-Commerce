import { apiClient } from './api'
import { Order, ApiResponse, PaginatedResponse } from '../types'

interface CreateOrderData {
  shippingAddress: string
  paymentMethod: string
}

export const orderService = {
  async getOrders(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    const response = await apiClient.get<PaginatedResponse<Order>>(`/orders?${params}`)
    return response
  },

  async getOrder(id: number): Promise<Order> {
    const response = await apiClient.get<ApiResponse<{ order: Order }>>(`/orders/${id}`)
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Order not found')
    }
    return response.data.order
  },

  async createOrder(orderData: CreateOrderData): Promise<{ order: Order }> {
    const response = await apiClient.post<ApiResponse<{ order: Order }>>('/orders', orderData)
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to create order')
    }
    return response.data
  },

  async cancelOrder(id: number): Promise<void> {
    const response = await apiClient.put<ApiResponse<void>>(`/orders/${id}/cancel`)
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to cancel order')
    }
  },
}

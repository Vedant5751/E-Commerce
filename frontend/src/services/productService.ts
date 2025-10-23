import { apiClient } from './api'
import { Product, Category, ApiResponse, PaginatedResponse, SearchFilters } from '../types'

export const productService = {
  async getProducts(
    page: number = 1,
    limit: number = 10,
    filters?: SearchFilters
  ): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.category && { category: filters.category }),
      ...(filters?.minPrice && { minPrice: filters.minPrice.toString() }),
      ...(filters?.maxPrice && { maxPrice: filters.maxPrice.toString() }),
      ...(filters?.sortBy && { sortBy: filters.sortBy }),
      ...(filters?.sortOrder && { sortOrder: filters.sortOrder }),
    })

    const response = await apiClient.get<PaginatedResponse<Product>>(`/products?${params}`)
    return response
  },

  async getProduct(id: number): Promise<Product> {
    const response = await apiClient.get<ApiResponse<{ product: Product }>>(`/products/${id}`)
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Product not found')
    }
    return response.data.product
  },

  async searchProducts(
    query: string,
    page: number = 1,
    limit: number = 10,
    filters?: SearchFilters
  ): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.category && { category: filters.category }),
      ...(filters?.minPrice && { minPrice: filters.minPrice.toString() }),
      ...(filters?.maxPrice && { maxPrice: filters.maxPrice.toString() }),
      ...(filters?.sortBy && { sortBy: filters.sortBy }),
      ...(filters?.sortOrder && { sortOrder: filters.sortOrder }),
    })

    const response = await apiClient.get<PaginatedResponse<Product>>(`/search?${params}`)
    return response
  },

  async getSearchSuggestions(query: string, limit: number = 10): Promise<string[]> {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
    })

    const response = await apiClient.get<ApiResponse<{ suggestions: string[] }>>(
      `/search/suggestions?${params}`
    )
    if (!response.success || !response.data) {
      return []
    }
    return response.data.suggestions
  },

  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<ApiResponse<{ categories: Category[] }>>('/search/categories')
    if (!response.success || !response.data) {
      return []
    }
    return response.data.categories
  },
}

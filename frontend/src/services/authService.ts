import { apiClient } from './api'
import { User, RegisterData, LoginData, ApiResponse } from '../types'

interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

interface RegisterResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export const authService = {
  async login(credentials: LoginData): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials)
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Login failed')
    }
    return response.data
  },

  async register(userData: RegisterData): Promise<RegisterResponse> {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', userData)
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Registration failed')
    }
    return response.data
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me')
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get profile')
    }
    return response.data.user
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<ApiResponse<{ user: User }>>('/users/profile', userData)
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Profile update failed')
    }
    return response.data.user
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await apiClient.put<ApiResponse<void>>('/users/change-password', {
      currentPassword,
      newPassword,
    })
    if (!response.success) {
      throw new Error(response.error?.message || 'Password change failed')
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post<ApiResponse<void>>('/auth/logout')
    } catch (error) {
      // Ignore logout errors, still clear local storage
      console.warn('Logout request failed:', error)
    }
  },
}

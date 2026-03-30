import axios from 'axios'
import { Event, Club, User, Chat } from './types'

const API_BASE_URL = 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Events
export const eventApi = {
  getAll: () => api.get<Event[]>('/events'),
  getById: (id: string) => api.get<Event>(`/events/${id}`),
  create: (data: Partial<Event>) => api.post<Event>('/events', data),
  update: (id: string, data: Partial<Event>) => api.put<Event>(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
  join: (id: string, userId: string) => api.post(`/events/${id}/join`, { userId }),
  leave: (id: string, userId: string) => api.post(`/events/${id}/leave`, { userId }),
}

// Clubs
export const clubApi = {
  getAll: () => api.get<Club[]>('/clubs'),
  getById: (id: string) => api.get<Club>(`/clubs/${id}`),
  create: (data: Partial<Club>) => api.post<Club>('/clubs', data),
  update: (id: string, data: Partial<Club>) => api.put<Club>(`/clubs/${id}`, data),
  delete: (id: string) => api.delete(`/clubs/${id}`),
  join: (id: string, userId: string) => api.post(`/clubs/${id}/join`, { userId }),
  leave: (id: string, userId: string) => api.post(`/clubs/${id}/leave`, { userId }),
}

// Users
export const userApi = {
  getById: (id: string) => api.get<User>(`/users/${id}`),
  getAll: () => api.get<User[]>('/users'),
  update: (id: string, data: Partial<User>) => api.put<User>(`/users/${id}`, data),
  search: (query: string) => api.get<User[]>(`/users/search?q=${query}`),
}

// Messages
export const messageApi = {
  getChats: () => api.get<Chat[]>('/chats'),
  getChat: (id: string) => api.get<Chat>(`/chats/${id}`),
  sendMessage: (chatId: string, content: string) => api.post(`/chats/${chatId}/messages`, { content }),
  createDirectChat: (userId: string) => api.post('/chats/direct', { userId }),
  createGroupChat: (name: string, participantIds: string[]) => api.post('/chats/group', { name, participantIds }),
}

// Auth
export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) => api.post('/auth/register', { name, email, password }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get<User>('/auth/me'),
}

export default api

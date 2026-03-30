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

// Mock data for demo
const mockUsers: Record<string, User> = {
  'user1': {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '👨‍🦰',
    bio: 'Basketball enthusiast',
    sports: ['basketball', 'tennis'],
    location: 'San Francisco, CA',
    joinedDate: '2024-01-15',
  },
  'user2': {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: '👩‍🦱',
    bio: 'Soccer player',
    sports: ['soccer', 'volleyball'],
    location: 'San Francisco, CA',
    joinedDate: '2024-02-20',
  },
}

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

// Auth - Mock implementation for demo
export const authApi = {
  login: async (email: string, _password: string) => {
    // Mock login - accept any email/password combination
    const user = Object.values(mockUsers).find(u => u.email === email) || mockUsers['user1']
    return {
      data: {
        token: 'mock-token-' + Date.now(),
        user,
      },
    }
  },
  register: async (name: string, email: string, _password: string) => {
    // Mock registration - create a new user
    const newUserId = 'user-' + Date.now()
    const newUser: User = {
      id: newUserId,
      name,
      email,
      avatar: '👤',
      bio: '',
      sports: [],
      location: '',
      joinedDate: new Date().toISOString().split('T')[0],
    }
    mockUsers[newUserId] = newUser
    return {
      data: {
        token: 'mock-token-' + Date.now(),
        user: newUser,
      },
    }
  },
  logout: () => Promise.resolve(),
  getCurrentUser: async () => {
    // Return the first mock user
    return {
      data: mockUsers['user1'],
    }
  },
}

export default api

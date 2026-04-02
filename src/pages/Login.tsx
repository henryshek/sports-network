import { useState } from 'react'
import { User } from '@/types'

interface LoginProps {
  onLoginSuccess: (user: User) => void
}

// Mock users database
const mockUsers: Record<string, { password: string; user: User }> = {
  'demo@example.com': {
    password: 'demo',
    user: {
      id: 'demo',
      name: 'Demo User',
      email: 'demo@example.com',
      avatar: '👤',
      bio: 'Demo user for testing',
      sports: ['basketball', 'tennis', 'soccer'],
      location: 'Hong Kong',
      joinedDate: '2024-04-01',
    },
  },
  'john@example.com': {
    password: 'password123',
    user: {
      id: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '👨‍🦰',
      bio: 'Basketball enthusiast',
      sports: ['basketball', 'tennis'],
      location: 'San Francisco, CA',
      joinedDate: '2024-01-15',
    },
  },
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        // Sign up - create new user
        if (!name.trim()) {
          setError('Please enter your name')
          setLoading(false)
          return
        }
        if (!email.trim()) {
          setError('Please enter your email')
          setLoading(false)
          return
        }
        if (!password.trim()) {
          setError('Please enter a password')
          setLoading(false)
          return
        }

        // Create new user
        const newUser: User = {
          id: 'user-' + Date.now(),
          name,
          email,
          avatar: '👤',
          bio: '',
          sports: [],
          location: '',
          joinedDate: new Date().toISOString().split('T')[0],
        }

        // Store in mock database
        mockUsers[email] = { password, user: newUser }

        // Save to localStorage
        localStorage.setItem('token', 'mock-token-' + Date.now())
        localStorage.setItem('user', JSON.stringify(newUser))

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 500))

        onLoginSuccess(newUser)
      } else {
        // Login
        if (!email.trim()) {
          setError('Please enter your email')
          setLoading(false)
          return
        }
        if (!password.trim()) {
          setError('Please enter your password')
          setLoading(false)
          return
        }

        // Check if user exists in mock database
        const userRecord = mockUsers[email]
        if (!userRecord) {
          // For demo, allow any email to login
          const demoUser: User = {
            id: 'user-' + Date.now(),
            name: email.split('@')[0],
            email,
            avatar: '👤',
            bio: '',
            sports: [],
            location: '',
            joinedDate: new Date().toISOString().split('T')[0],
          }
          mockUsers[email] = { password, user: demoUser }
          localStorage.setItem('token', 'mock-token-' + Date.now())
          localStorage.setItem('user', JSON.stringify(demoUser))
          await new Promise(resolve => setTimeout(resolve, 500))
          onLoginSuccess(demoUser)
        } else if (userRecord.password === password) {
          // Password matches
          localStorage.setItem('token', 'mock-token-' + Date.now())
          localStorage.setItem('user', JSON.stringify(userRecord.user))
          await new Promise(resolve => setTimeout(resolve, 500))
          onLoginSuccess(userRecord.user)
        } else {
          setError('Invalid email or password')
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-4xl">⚽</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Sports Social</h1>
          <p className="text-muted mt-2">Connect with athletes near you</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center mt-6">
          <p className="text-muted text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="text-primary font-semibold ml-1 hover:underline"
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>

        {/* Demo Info */}
        <div className="mt-6 p-3 bg-primary/5 rounded-lg text-xs text-muted">
          <p className="font-semibold mb-1">Demo Mode:</p>
          <p>• Sign up with any email and password</p>
          <p>• Or login with any credentials</p>
        </div>
      </div>
    </div>
  )
}

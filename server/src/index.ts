import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

dotenv.config()

const app: Express = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Middleware
app.use(cors())
app.use(express.json())

// Auth middleware
interface AuthRequest extends Request {
  userId?: string
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// ============ AUTH ROUTES ============

app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' })

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        sports: user.sports,
        joinedDate: user.joinedDate,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' })
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isPasswordValid = await bcryptjs.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' })

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        sports: user.sports,
        joinedDate: user.joinedDate,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Login failed' })
  }
})

app.get('/api/auth/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      sports: user.sports,
      joinedDate: user.joinedDate,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to get user' })
  }
})

// ============ EVENTS ROUTES ============

app.get('/api/events', async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        participants: {
          select: {
            userId: true,
          },
        },
      },
    })

    const formattedEvents = events.map(event => ({
      ...event,
      participants: event.participants.map(p => p.userId),
    }))

    res.json(formattedEvents)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch events' })
  }
})

app.get('/api/events/:id', async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    if (!event) {
      return res.status(404).json({ error: 'Event not found' })
    }

    res.json(event)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch event' })
  }
})

app.post('/api/events', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, date, time, location, sportType, skillLevel, maxParticipants } = req.body

    if (!title || !date || !time || !location || !sportType || !maxParticipants) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date,
        time,
        location,
        sportType,
        skillLevel: skillLevel || 'intermediate',
        maxParticipants,
        organizerId: req.userId!,
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    res.status(201).json(event)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create event' })
  }
})

app.post('/api/events/:id/join', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.userId!

    // Check if event exists
    const event = await prisma.event.findUnique({ 
      where: { id },
      include: { participants: true }
    })
    if (!event) {
      return res.status(404).json({ error: 'Event not found' })
    }

    // Check if user already joined
    const existingParticipant = await prisma.participant.findUnique({
      where: {
        eventId_userId: {
          eventId: id,
          userId,
        },
      },
    })

    if (existingParticipant) {
      return res.status(400).json({ error: 'Already joined this event' })
    }

    // Get actual participant count
    const actualCount = event.participants.length

    // Check capacity
    if (actualCount >= event.maxParticipants) {
      // Add to waitlist
      await prisma.waitlist.create({
        data: {
          eventId: id,
          userId,
        },
      }).catch(() => {}) // Ignore if already on waitlist
      return res.json({ message: 'Added to waitlist', waitlisted: true })
    }

    // Add participant
    const participant = await prisma.participant.create({
      data: {
        eventId: id,
        userId,
      },
    })

    // Update event participant count to match actual
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        currentParticipants: actualCount + 1,
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        participants: {
          select: {
            userId: true,
          },
        },
      },
    })

    // Add user to event chat if it exists
    const chat = await prisma.chat.findFirst({
      where: { eventId: id },
    })

    if (chat) {
      await prisma.chatMember.create({
        data: {
          chatId: chat.id,
          userId,
        },
      }).catch(() => {}) // Ignore if already member
    }

    res.json({ 
      message: 'Joined event', 
      event: {
        ...updatedEvent,
        participants: updatedEvent.participants.map(p => p.userId),
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to join event' })
  }
})

app.post('/api/events/:id/leave', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.userId!

    // Get event with current participants
    const event = await prisma.event.findUnique({
      where: { id },
      include: { participants: true, waitlist: true }
    })

    if (!event) {
      return res.status(404).json({ error: 'Event not found' })
    }

    // Remove participant
    await prisma.participant.delete({
      where: {
        eventId_userId: {
          eventId: id,
          userId,
        },
      },
    }).catch(() => {
      throw new Error('Not a participant')
    })

    // Get actual participant count after removal
    const actualCount = event.participants.length - 1

    // Update event participant count
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        currentParticipants: actualCount,
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        participants: {
          select: {
            userId: true,
          },
        },
      },
    })

    // If there's someone on waitlist and now there's space, auto-promote first person
    if (event.waitlist.length > 0 && actualCount < event.maxParticipants) {
      const firstWaitlisted = event.waitlist[0]
      
      // Remove from waitlist
      await prisma.waitlist.delete({
        where: { id: firstWaitlisted.id },
      })

      // Add as participant
      await prisma.participant.create({
        data: {
          eventId: id,
          userId: firstWaitlisted.userId,
        },
      })

      // Update count
      await prisma.event.update({
        where: { id },
        data: {
          currentParticipants: actualCount + 1,
        },
      })
    }

    // Remove from event chat
    const chat = await prisma.chat.findFirst({
      where: { eventId: id },
    })

    if (chat) {
      await prisma.chatMember.deleteMany({
        where: {
          chatId: chat.id,
          userId,
        },
      })
    }

    res.json({ 
      message: 'Left event',
      event: {
        ...updatedEvent,
        participants: updatedEvent.participants.map(p => p.userId),
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to leave event' })
  }
})

// ============ USERS ROUTES ============

app.get('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        location: true,
        sports: true,
        joinedDate: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

app.put('/api/users/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    // Check authorization
    if (req.userId !== id) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    const { name, avatar, bio, location, sports } = req.body

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(avatar && { avatar }),
        ...(bio && { bio }),
        ...(location && { location }),
        ...(sports && { sports }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        location: true,
        sports: true,
        joinedDate: true,
      },
    })

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

// ============ CLUBS ROUTES ============

app.get('/api/clubs', async (req: Request, res: Response) => {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        members: {
          select: {
            userId: true,
          },
        },
      },
    })

    const formattedClubs = clubs.map(club => ({
      ...club,
      memberCount: club.members.length,
      members: club.members.map(m => m.userId),
    }))

    res.json(formattedClubs)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch clubs' })
  }
})

app.post('/api/clubs/:id/join', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.userId!

    // Check if club exists
    const club = await prisma.club.findUnique({ where: { id } })
    if (!club) {
      return res.status(404).json({ error: 'Club not found' })
    }

    // Check if already member
    const existingMember = await prisma.clubMember.findUnique({
      where: {
        clubId_userId: {
          clubId: id,
          userId,
        },
      },
    })

    if (existingMember) {
      return res.status(400).json({ error: 'Already a member' })
    }

    // Add member
    const member = await prisma.clubMember.create({
      data: {
        clubId: id,
        userId,
      },
    })

    // Add user to club chat if it exists
    const chat = await prisma.chat.findFirst({
      where: { clubId: id },
    })

    if (chat) {
      await prisma.chatMember.create({
        data: {
          chatId: chat.id,
          userId,
        },
      }).catch(() => {})
    }

    res.json({ message: 'Joined club', member })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to join club' })
  }
})

// ============ MESSAGES/CHAT ROUTES ============

app.get('/api/chats', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        members: {
          some: {
            userId: req.userId,
          },
        },
      },
      include: {
        members: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            content: true,
            createdAt: true,
            sender: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    res.json(chats)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch chats' })
  }
})

app.get('/api/chats/:id/messages', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await prisma.message.findMany({
      where: { chatId: req.params.id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    res.json(messages)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

app.post('/api/chats/:id/messages', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body

    if (!content) {
      return res.status(400).json({ error: 'Message content required' })
    }

    const message = await prisma.message.create({
      data: {
        chatId: req.params.id,
        senderId: req.userId!,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    // Update chat timestamp
    await prisma.chat.update({
      where: { id: req.params.id },
      data: { updatedAt: new Date() },
    })

    res.status(201).json(message)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

// ============ HEALTH CHECK ============

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

// ============ ERROR HANDLING ============

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' })
})

// ============ START SERVER ============

const start = async () => {
  try {
    await prisma.$connect()
    console.log('✅ Database connected')

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
      console.log(`📚 API Documentation: http://localhost:${PORT}/api`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

start()

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

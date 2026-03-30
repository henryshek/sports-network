import { useState, useEffect } from 'react'
import { User, Event, Club } from '@/types'
import { Calendar, Users, MessageSquare, Trophy, Zap, ArrowRight } from 'lucide-react'

interface HomeProps {
  user: User
  onNavigate: (page: string) => void
}

export default function Home({ user, onNavigate }: HomeProps) {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [popularClubs, setPopularClubs] = useState<Club[]>([])

  useEffect(() => {
    // Mock data - in production, fetch from API
    setUpcomingEvents([
      {
        id: '1',
        title: 'Basketball Game',
        description: 'Friendly basketball match at downtown court',
        date: '2026-04-05',
        time: '18:00',
        location: 'Downtown Sports Court',
        sportType: 'basketball',
        skillLevel: 'intermediate',
        maxParticipants: 10,
        currentParticipants: 6,
        organizerId: 'user2',
        participants: ['user2', 'user3', 'user4', 'user5', 'user6', user.id],
        status: 'upcoming',
        createdAt: '2026-03-30',
        updatedAt: '2026-03-30'
      },
      {
        id: '2',
        title: 'Soccer Practice',
        description: 'Weekly soccer training session',
        date: '2026-04-06',
        time: '19:00',
        location: 'Central Park',
        sportType: 'soccer',
        skillLevel: 'beginner',
        maxParticipants: 15,
        currentParticipants: 8,
        organizerId: 'user3',
        participants: ['user3', 'user4', 'user5', 'user6', 'user7', 'user8', 'user9', 'user10'],
        status: 'upcoming',
        createdAt: '2026-03-30',
        updatedAt: '2026-03-30'
      }
    ])

    setPopularClubs([
      {
        id: '1',
        name: 'Basketball Enthusiasts',
        description: 'For basketball lovers of all levels',
        sport: 'basketball',
        creatorId: 'user1',
        members: ['user1', 'user2', 'user3', 'user4', 'user5'],
        admins: ['user1'],
        isPrivate: false,
        createdAt: '2026-03-30',
        updatedAt: '2026-03-30'
      },
      {
        id: '2',
        name: 'Soccer Community',
        description: 'Join our soccer community',
        sport: 'soccer',
        creatorId: 'user2',
        members: ['user2', 'user3', 'user4', 'user5', 'user6', 'user7'],
        admins: ['user2'],
        isPrivate: false,
        createdAt: '2026-03-30',
        updatedAt: '2026-03-30'
      }
    ])
  }, [user.id])

  return (
    <div className="space-y-8 pb-20">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user.name}! 👋</h1>
        <p className="text-lg text-muted">Find sports events, join clubs, and connect with athletes in your area</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { icon: Calendar, label: 'Events', value: '12', color: 'bg-primary/10 text-primary' },
          { icon: Users, label: 'Clubs', value: '5', color: 'bg-success/10 text-success' },
          { icon: MessageSquare, label: 'Messages', value: '8', color: 'bg-warning/10 text-warning' },
          { icon: Trophy, label: 'Joined', value: '3', color: 'bg-error/10 text-error' }
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className={`${stat.color} rounded-xl p-6`}>
              <Icon size={32} className="mb-2" />
              <p className="text-sm opacity-75">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Upcoming Events */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
          <button
            onClick={() => onNavigate('events')}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition"
          >
            View All <ArrowRight size={20} />
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {upcomingEvents.map(event => (
            <div key={event.id} className="bg-surface rounded-xl p-6 border border-border hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                  <p className="text-sm text-muted">{event.sportType}</p>
                </div>
                <span className="text-3xl">{event.sportType === 'basketball' ? '🏀' : '⚽'}</span>
              </div>
              <p className="text-muted mb-4">{event.description}</p>
              <div className="space-y-2 text-sm text-muted mb-4">
                <p>📅 {event.date} at {event.time}</p>
                <p>📍 {event.location}</p>
                <p>👥 {event.currentParticipants}/{event.maxParticipants} participants</p>
              </div>
              <button className="w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 transition">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Clubs */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-foreground">Popular Clubs</h2>
          <button
            onClick={() => onNavigate('clubs')}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition"
          >
            View All <ArrowRight size={20} />
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {popularClubs.map(club => (
            <div key={club.id} className="bg-surface rounded-xl p-6 border border-border hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{club.name}</h3>
                  <p className="text-sm text-muted">{club.sport}</p>
                </div>
                <span className="text-3xl">🏆</span>
              </div>
              <p className="text-muted mb-4">{club.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted">👥 {club.members.length} members</span>
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Why Sports Social?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: 'Quick & Easy', desc: 'Find and join events in seconds' },
            { icon: Users, title: 'Community', desc: 'Connect with athletes near you' },
            { icon: Trophy, title: 'Track Progress', desc: 'Build your sports profile' }
          ].map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="text-center">
                <Icon size={40} className="text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { User, Event } from '@/types'
import { Zap, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { mockEvents } from '@/mockData'

interface HomeProps {
  user: User
}

export default function Home({ user }: HomeProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [twoWeekDates, setTwoWeekDates] = useState<Date[]>([])
  const [selectedDateEvents, setSelectedDateEvents] = useState<Event[]>([])

  // Initialize 2-week dates
  useEffect(() => {
    const dates: Date[] = []
    const today = new Date()
    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      dates.push(date)
    }
    setTwoWeekDates(dates)
  }, [])

  // Update events when selected date changes
  useEffect(() => {
    const eventsForDate = mockEvents.filter(event => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()
      )
    })
    // Sort by time
    eventsForDate.sort((a, b) => a.time.localeCompare(b.time))
    setSelectedDateEvents(eventsForDate)
  }, [selectedDate])

  const activities = [
    {
      id: '1',
      type: 'event_created',
      user: 'John Smith',
      action: 'created a new event',
      target: 'Basketball Game at Victoria Park',
      time: '2 hours ago',
      icon: '🏀'
    },
    {
      id: '2',
      type: 'joined_event',
      user: 'Sarah Johnson',
      action: 'joined',
      target: 'Tennis Match at Hong Kong Tennis Centre',
      time: '4 hours ago',
      icon: '🎾'
    },
    {
      id: '3',
      type: 'club_created',
      user: 'Mike Chen',
      action: 'created a new club',
      target: 'Soccer Enthusiasts',
      time: '1 day ago',
      icon: '⚽'
    },
  ]

  const quickAccessItems = [
    { id: 'events', label: 'Events', icon: '📅', color: 'bg-blue-100 text-blue-600', description: 'Find & join events' },
    { id: 'clubs', label: 'Clubs', icon: '👥', color: 'bg-purple-100 text-purple-600', description: 'Browse clubs' },
    { id: 'map', label: 'Map', icon: '🗺️', color: 'bg-green-100 text-green-600', description: 'View nearby' },
    { id: 'messages', label: 'Messages', icon: '💬', color: 'bg-pink-100 text-pink-600', description: 'Chat' },
    { id: 'profile', label: 'Profile', icon: '👤', color: 'bg-orange-100 text-orange-600', description: 'Your profile' },
    { id: 'trending', label: 'Trending', icon: '🔥', color: 'bg-red-100 text-red-600', description: 'Popular now' },
    { id: 'saved', label: 'Saved', icon: '⭐', color: 'bg-yellow-100 text-yellow-600', description: 'Bookmarks' },
    { id: 'nearby', label: 'Nearby', icon: '📍', color: 'bg-indigo-100 text-indigo-600', description: 'Around you' },
  ]

  const getSportEmoji = (sport: string) => {
    const emojis: Record<string, string> = {
      basketball: '🏀',
      soccer: '⚽',
      tennis: '🎾',
      volleyball: '🏐',
      badminton: '🏸',
      cricket: '🏏',
      baseball: '⚾',
      running: '🏃',
      cycling: '🚴',
      swimming: '🏊',
      yoga: '🧘',
      pickleball: '🏓',
    }
    return emojis[sport.toLowerCase()] || '⚽'
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatDateFull = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user.name}! 👋</h1>
        <p className="text-lg text-muted">Find sports events, join clubs, and connect with athletes in your area</p>
      </div>

      {/* Quick Access Dashboard */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Zap size={24} className="text-primary" />
          Quick Access
        </h2>
        
        {/* Horizontal Scrollable Container */}
        <div className="overflow-x-auto pb-2 -mx-8 px-8">
          <div className="flex gap-4 min-w-min">
            {quickAccessItems.map((item) => (
              <button
                key={item.id}
                className={`flex flex-col items-center justify-center w-24 h-24 rounded-xl ${item.color} hover:shadow-lg transition flex-shrink-0 font-medium`}
              >
                <span className="text-4xl mb-1">{item.icon}</span>
                <span className="text-xs font-semibold text-center line-clamp-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-1 bg-surface rounded-full"></div>

      {/* 2-Week Calendar and Events Timeline */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          📅 Upcoming Events
        </h2>

        {/* 2-Week Scrollable Calendar */}
        <div className="bg-white rounded-lg border border-border p-4 mb-6">
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-min">
              {twoWeekDates.map((date, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center justify-center px-3 py-3 rounded-lg transition flex-shrink-0 min-w-max ${
                    isSelected(date)
                      ? 'bg-primary text-white border-2 border-primary'
                      : isToday(date)
                      ? 'bg-primary/10 border-2 border-primary text-primary'
                      : 'bg-surface border-2 border-border hover:border-primary'
                  }`}
                >
                  <span className="text-xs font-semibold">{getDayName(date)}</span>
                  <span className="text-sm font-bold mt-1">{date.getDate()}</span>
                  <span className="text-xs text-muted mt-0.5">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Date Events - Time-based List */}
        <div className="bg-white rounded-lg border border-border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">
              {formatDateFull(selectedDate)}
            </h3>
            <p className="text-sm text-muted mt-1">
              {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''} scheduled
            </p>
          </div>

          {selectedDateEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedDateEvents.map((event) => (
                <div key={event.id} className="flex gap-4 pb-4 border-b border-border last:border-b-0 last:pb-0">
                  {/* Time */}
                  <div className="flex flex-col items-center min-w-max">
                    <div className="text-lg font-bold text-primary">{event.time}</div>
                    <div className="w-1 h-12 bg-primary/20 rounded-full mt-2"></div>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl">{getSportEmoji(event.sportType)}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{event.title}</h4>
                        <p className="text-sm text-muted mt-1">{event.location}</p>
                      </div>
                    </div>

                    {/* Event Info */}
                    <div className="flex flex-wrap gap-3 mt-3">
                      <div className="flex items-center gap-1 text-xs bg-surface px-2 py-1 rounded">
                        <span>👥</span>
                        <span>{event.currentParticipants}/{event.maxParticipants}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs bg-surface px-2 py-1 rounded">
                        <span>📊</span>
                        <span className="capitalize">{event.skillLevel}</span>
                      </div>
                      {event.currentParticipants >= event.maxParticipants && (
                        <div className="flex items-center gap-1 text-xs bg-warning/10 text-warning px-2 py-1 rounded">
                          <span>⚠️</span>
                          <span>Full</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button className="mt-3 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:opacity-90 transition font-semibold">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-3xl mb-3">📭</p>
              <p className="text-muted">No events scheduled for {formatDateShort(selectedDate)}</p>
              <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition font-semibold text-sm">
                Create Event
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-1 bg-surface rounded-full"></div>

      {/* Activity Timeline */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp size={24} className="text-primary" />
          Activity Timeline
        </h2>
        
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-4">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-2xl border-2 border-primary/20">
                  {activity.icon}
                </div>
                {index < activities.length - 1 && (
                  <div className="w-1 h-16 bg-gradient-to-b from-primary/30 to-transparent mt-2"></div>
                )}
              </div>

              {/* Activity Content */}
              <div className="flex-1 pt-2 pb-4">
                <div className="bg-white rounded-lg p-4 border border-border hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {activity.user}
                      </p>
                      <p className="text-sm text-muted">
                        {activity.action}
                      </p>
                    </div>
                    <span className="text-xs text-muted whitespace-nowrap ml-2 font-medium">
                      {activity.time}
                    </span>
                  </div>
                  
                  <p className="text-sm font-medium text-primary bg-primary/5 px-3 py-2 rounded inline-block mb-3">
                    {activity.target}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="text-xs px-4 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition font-semibold">
                      View
                    </button>
                    <button className="text-xs px-4 py-1.5 rounded-lg bg-surface text-foreground hover:bg-border transition font-semibold">
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-8 text-center">
          <button className="px-8 py-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition font-semibold text-sm">
            Load More Activities
          </button>
        </div>
      </div>
    </div>
  )
}

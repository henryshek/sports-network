import { useState, useEffect, useRef } from 'react'
import { User, Event } from '@/types'
import { Zap } from 'lucide-react'
import { mockEvents } from '@/mockData'
import { UpcomingEventsSection } from '@/components/UpcomingEventsSection'

interface HomeProps {
  user: User
  onNavigate?: (page: string) => void
  onEventDetails?: (eventId: string) => void
}

export default function Home({ user, onNavigate, onEventDetails }: HomeProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [twoWeekDates, setTwoWeekDates] = useState<Date[]>([])
  const [selectedDateEvents, setSelectedDateEvents] = useState<Event[]>([])
  const [joinedEventIds, setJoinedEventIds] = useState<string[]>([])
  const calendarRef = useRef<HTMLDivElement>(null)

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

  // Auto-scroll calendar to today's date
  useEffect(() => {
    if (calendarRef.current && twoWeekDates.length > 0) {
      setTimeout(() => {
        const todayButton = calendarRef.current?.querySelector('[data-is-today="true"]') as HTMLElement
        if (todayButton) {
          todayButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
        }
      }, 100)
    }
  }, [twoWeekDates])

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

  const quickAccessItems = [
    { id: 'events', label: 'Events', icon: '📅', color: 'bg-blue-100 text-blue-600', description: 'Find & join events' },
    { id: 'clubs', label: 'Clubs', icon: '👥', color: 'bg-purple-100 text-purple-600', description: 'Browse clubs' },
    { id: 'messages', label: 'Messages', icon: '💬', color: 'bg-pink-100 text-pink-600', description: 'Chat' },
    { id: 'map', label: 'Map', icon: '🗺️', color: 'bg-green-100 text-green-600', description: 'View nearby' },
    { id: 'profile', label: 'Profile', icon: '👤', color: 'bg-orange-100 text-orange-600', description: 'Your profile' },
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

      {/* Your Upcoming Events Section */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          📅 Your Upcoming Events
        </h2>
        <UpcomingEventsSection user={user} events={mockEvents} joinedEventIds={joinedEventIds} onEventDetails={onEventDetails} />
      </div>

      {/* Quick Access Dashboard */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Zap size={24} className="text-primary" />
          Quick Access
        </h2>
        
        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {quickAccessItems.map((item) => {
            const handleClick = () => {
              if (onNavigate) {
                onNavigate(item.id)
              }
            }
            return (
              <button
                key={item.id}
                onClick={handleClick}
                className={`flex flex-col items-center justify-center p-4 rounded-xl ${item.color} hover:shadow-lg transition font-medium`}
              >
                <span className="text-4xl mb-2">{item.icon}</span>
                <span className="text-sm font-semibold text-center">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-1 bg-surface rounded-full"></div>

      {/* All Events Calendar and Timeline */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          📅 All Events
        </h2>

        {/* 2-Week Scrollable Calendar */}
        <div className="bg-white rounded-lg border border-border p-4 mb-6">
          <div className="overflow-x-auto pb-2" ref={calendarRef}>
            <div className="flex gap-2 min-w-min">
              {twoWeekDates.map((date, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  data-is-today={isToday(date) ? 'true' : 'false'}
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

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-3">
                      <button 
                        onClick={() => onEventDetails?.(event.id)}
                        className="flex-1 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:opacity-90 transition font-semibold"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          if (joinedEventIds.includes(event.id)) {
                            setJoinedEventIds(joinedEventIds.filter(id => id !== event.id))
                          } else {
                            setJoinedEventIds([...joinedEventIds, event.id])
                          }
                        }}
                        className={`px-4 py-2 text-sm rounded-lg transition font-semibold ${
                          joinedEventIds.includes(event.id)
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        {joinedEventIds.includes(event.id) ? 'Cancel' : 'Join'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-3xl mb-3">📭</p>
              <p className="text-muted">No events scheduled for {formatDateShort(selectedDate)}</p>
              <button 
                onClick={() => onNavigate?.('create-event')}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition font-semibold text-sm"
              >
                Create Event
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

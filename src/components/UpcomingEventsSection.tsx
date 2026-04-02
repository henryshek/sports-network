import { Event, User } from '@/types'
import { useMemo } from 'react'

interface UpcomingEventsSectionProps {
  user: User
  events: Event[]
  joinedEventIds?: string[]
  onEventDetails?: (eventId: string) => void
}

export function UpcomingEventsSection({ events, joinedEventIds = [], onEventDetails }: UpcomingEventsSectionProps) {
  // Filter events that the user has joined via the Join button
  const userJoinedEvents = useMemo(() => {
    return events.filter(event => joinedEventIds.includes(event.id))
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`)
        const dateB = new Date(`${b.date}T${b.time}`)
        return dateA.getTime() - dateB.getTime()
      })
  }, [events, joinedEventIds])

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

  if (userJoinedEvents.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-border p-8 text-center">
        <p className="text-lg text-muted mb-2">No upcoming events</p>
        <p className="text-sm text-muted">Join events to see them here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {userJoinedEvents.map((event) => {
        const eventDate = new Date(`${event.date}T${event.time}`)
        const dateStr = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        const timeStr = event.time

        return (
          <div
            key={event.id}
            className="bg-white rounded-lg border-2 border-green-200 bg-green-50 p-4 hover:shadow-md transition cursor-pointer"
            onClick={() => onEventDetails?.(event.id)}
          >
            {/* Event Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-3xl">{getSportEmoji(event.sportType)}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">{event.title}</h3>
                  <p className="text-sm text-muted mt-1">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                <span>✅</span>
                <span>Joined</span>
              </div>
            </div>

            {/* Event Details */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">📅</span>
                <span className="text-foreground font-medium">{dateStr}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🕐</span>
                <span className="text-foreground font-medium">{timeStr}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">👥</span>
                <span className="text-foreground font-medium">{event.currentParticipants}/{event.maxParticipants}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                <span className="text-foreground font-medium capitalize">{event.skillLevel}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

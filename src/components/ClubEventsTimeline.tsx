import { useState, useEffect } from 'react'
import { Club, Event } from '@/types'
import { Calendar } from 'lucide-react'

interface ClubEventsTimelineProps {
  club: Club
  allEvents: Event[]
}

export default function ClubEventsTimeline({ club, allEvents }: ClubEventsTimelineProps) {
  const [clubEvents, setClubEvents] = useState<Event[]>([])
  const [weekDays, setWeekDays] = useState<{ date: Date; events: Event[] }[]>([])

  useEffect(() => {
    // Filter events created by this club for the next 2 weeks
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const twoWeeksFromNow = new Date(today)
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14)

    // Filter events that belong to this club and are within the next 2 weeks
    const filteredEvents = (club.events || []).filter(event => {
      const eventDate = new Date(event.date)
      eventDate.setHours(0, 0, 0, 0)
      return eventDate >= today && eventDate <= twoWeeksFromNow
    })

    setClubEvents(filteredEvents)

    // Create array of 14 days starting from today
    const days = []
    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      
      const dayEvents = filteredEvents.filter(event => {
        const eventDate = new Date(event.date)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate.getTime() === date.getTime()
      }).sort((a, b) => a.time.localeCompare(b.time))

      days.push({ date, events: dayEvents })
    }

    setWeekDays(days)
  }, [club.id, allEvents])

  const getSportEmoji = (sportType: string) => {
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
    return emojis[sportType.toLowerCase()] || '🏅'
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (date.getTime() === today.getTime()) {
      return 'Today'
    }
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    if (date.getTime() === tomorrow.getTime()) {
      return 'Tomorrow'
    }

    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Calendar size={24} className="text-primary" />
        Upcoming Club Events (Next 2 Weeks)
      </h2>

      {clubEvents.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-lg">
          <Calendar size={48} className="mx-auto text-muted mb-3 opacity-50" />
          <p className="text-muted text-lg">No events scheduled for {club.name} in the next 2 weeks</p>
          <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition font-semibold">
            Create Event
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {weekDays.map((day, index) => (
            <div key={index}>
              <div className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="text-primary">{formatDate(day.date)}</span>
                {day.events.length > 0 && (
                  <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                    {day.events.length} event{day.events.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {day.events.length > 0 ? (
                <div className="space-y-2 ml-4 border-l-2 border-primary/20 pl-4">
                  {day.events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-lg p-4 border border-border hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-2xl">{getSportEmoji(event.sportType)}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{event.title}</p>
                            <p className="text-sm text-muted">{event.location}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-primary whitespace-nowrap ml-2">
                          {event.time}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted mb-3">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                          {event.skillLevel}
                        </span>
                        <span className="bg-surface px-2 py-1 rounded">
                          {event.currentParticipants}/{event.maxParticipants} joined
                        </span>
                      </div>

                      <button className="w-full px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition font-semibold text-sm">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted italic ml-4">No events scheduled</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

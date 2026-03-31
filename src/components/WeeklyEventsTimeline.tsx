import { useState } from 'react'
import { Event } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface WeeklyEventsTimelineProps {
  events: Event[]
  onSelectEvent?: (event: Event) => void
}

export default function WeeklyEventsTimeline({ events, onSelectEvent }: WeeklyEventsTimelineProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(today.setDate(diff))
  })

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const weekDates: Date[] = []
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentWeekStart)
    date.setDate(date.getDate() + i)
    weekDates.push(date)
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentWeekStart(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentWeekStart(newDate)
  }

  const goToCurrentWeek = () => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    setCurrentWeekStart(new Date(today.setDate(diff)))
  }

  const isCurrentWeek = () => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    const thisWeekStart = new Date(today.setDate(diff))
    return (
      currentWeekStart.getDate() === thisWeekStart.getDate() &&
      currentWeekStart.getMonth() === thisWeekStart.getMonth() &&
      currentWeekStart.getFullYear() === thisWeekStart.getFullYear()
    )
  }

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

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Weekly Events Timeline</h2>
        <div className="flex gap-2">
          <button
            onClick={goToPreviousWeek}
            className="p-2 hover:bg-surface rounded-lg transition"
            title="Previous week"
          >
            <ChevronLeft size={20} className="text-primary" />
          </button>
          <button
            onClick={goToCurrentWeek}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              isCurrentWeek()
                ? 'bg-primary text-white'
                : 'bg-surface text-foreground hover:bg-border'
            }`}
          >
            Today
          </button>
          <button
            onClick={goToNextWeek}
            className="p-2 hover:bg-surface rounded-lg transition"
            title="Next week"
          >
            <ChevronRight size={20} className="text-primary" />
          </button>
        </div>
      </div>

      {/* Week Range */}
      <p className="text-sm text-muted mb-6">
        {currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {' '}
        {new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      </p>

      {/* Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDates.map((date, index) => {
          const dayEvents = getEventsForDate(date)
          const isToday =
            new Date().getDate() === date.getDate() &&
            new Date().getMonth() === date.getMonth() &&
            new Date().getFullYear() === date.getFullYear()

          return (
            <div
              key={index}
              className={`rounded-lg border-2 p-4 min-h-64 overflow-y-auto ${
                isToday
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-surface hover:border-primary/50 transition'
              }`}
            >
              {/* Day Header */}
              <div className="mb-4">
                <p className="font-bold text-foreground">{weekDays[index]}</p>
                <p className={`text-sm ${isToday ? 'text-primary font-semibold' : 'text-muted'}`}>
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>

              {/* Events for this day */}
              <div className="space-y-2">
                {dayEvents.length > 0 ? (
                  dayEvents.map(event => (
                    <div
                      key={event.id}
                      onClick={() => onSelectEvent?.(event)}
                      className="p-3 bg-white border border-border rounded-lg hover:shadow-md transition cursor-pointer group"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg flex-shrink-0">{getSportEmoji(event.sportType)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground text-sm line-clamp-2 group-hover:text-primary transition">
                            {event.title}
                          </p>
                          <p className="text-xs text-muted mt-1">{event.time}</p>
                          <p className="text-xs text-muted mt-0.5 line-clamp-1">{event.location}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted text-center py-8">No events</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Events Summary */}
      {events.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted">
            Total events this week: <span className="font-semibold text-foreground">{events.length}</span>
          </p>
        </div>
      )}
    </div>
  )
}

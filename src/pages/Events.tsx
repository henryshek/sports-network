import { useState } from 'react'
import { mockEvents } from '@/mockData'
import { Event } from '@/types'

interface EventsProps {
  onSelectEvent: (eventId: string) => void
}

export default function Events({ onSelectEvent }: EventsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSport, setSelectedSport] = useState<string>('')
  const [events] = useState<Event[]>(mockEvents)

  const sports = Array.from(new Set(events.map(e => e.sportType)))

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSport = !selectedSport || event.sportType === selectedSport
    return matchesSearch && matchesSport
  })

  const getCapacityPercentage = (event: Event) => {
    return Math.round((event.currentParticipants / event.maxParticipants) * 100)
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
    }
    return emojis[sport] || '⚽'
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Events</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
          + Create Event
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedSport('')}
            className={`px-4 py-2 rounded-lg transition ${
              !selectedSport ? 'bg-primary text-white' : 'bg-surface text-foreground hover:bg-border'
            }`}
          >
            All Sports
          </button>
          {sports.map(sport => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-4 py-2 rounded-lg transition capitalize ${
                selectedSport === sport ? 'bg-primary text-white' : 'bg-surface text-foreground hover:bg-border'
              }`}
            >
              {getSportEmoji(sport)} {sport}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="grid gap-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event.id)}
              className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                  <p className="text-sm text-muted">{event.location}</p>
                </div>
                <span className="text-2xl">{getSportEmoji(event.sportType)}</span>
              </div>

              <p className="text-sm text-muted mb-4">{event.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted">Date & Time</p>
                  <p className="text-sm font-medium text-foreground">{event.date} at {event.time}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Skill Level</p>
                  <p className="text-sm font-medium text-foreground capitalize">{event.skillLevel}</p>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted">Capacity</p>
                  <p className="text-xs font-medium text-foreground">
                    {event.currentParticipants}/{event.maxParticipants}
                  </p>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition ${
                      getCapacityPercentage(event) >= 100 ? 'bg-error' : 'bg-success'
                    }`}
                    style={{ width: `${Math.min(getCapacityPercentage(event), 100)}%` }}
                  />
                </div>
              </div>

              {/* Waitlist Info */}
              {event.waitlist && event.waitlist.length > 0 && (
                <p className="text-xs text-warning mt-2">
                  {event.waitlist.length} people on waitlist
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted">No events found</p>
          </div>
        )}
      </div>
    </div>
  )
}

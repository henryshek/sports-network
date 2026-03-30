import { useState } from 'react'
import { mockEvents } from '@/mockData'
import { Event } from '@/types'
import { LeafletMap } from '@/components/LeafletMap'
import { EventMapFilters, type EventFilters } from '@/components/EventMapFilters'

interface MapViewProps {
  onSelectEvent: (eventId: string) => void
}

export default function MapView({ onSelectEvent }: MapViewProps) {
  const [events] = useState<Event[]>(mockEvents)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [filters, setFilters] = useState<EventFilters>({
    sportType: [],
    skillLevel: [],
    timeRange: 'all',
    minCapacity: 0,
    maxDistance: 50,
  })

  const filteredEvents = events.filter(event => {
    // Sport type filter
    if (filters.sportType.length > 0 && !filters.sportType.includes(event.sportType)) {
      return false
    }

    // Skill level filter
    if (filters.skillLevel.length > 0 && !filters.skillLevel.includes(event.skillLevel)) {
      return false
    }



    // Capacity filter (available spots)
    const availableSpots = event.maxParticipants - event.currentParticipants
    if (availableSpots < filters.minCapacity) {
      return false
    }

    // Time range filter
    if (filters.timeRange !== 'all') {
      const eventDate = new Date(event.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (filters.timeRange === 'today') {
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        if (eventDate < today || eventDate >= tomorrow) return false
      } else if (filters.timeRange === 'week') {
        const nextWeek = new Date(today)
        nextWeek.setDate(nextWeek.getDate() + 7)
        if (eventDate < today || eventDate >= nextWeek) return false
      } else if (filters.timeRange === 'month') {
        const nextMonth = new Date(today)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        if (eventDate < today || eventDate >= nextMonth) return false
      }
    }

    return true
  })

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

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    onSelectEvent(event.id)
  }

  return (
    <div className="pb-24 w-full">
      <h1 className="text-3xl font-bold text-foreground mb-6">Events Map</h1>

      {/* Filters */}
      <EventMapFilters onFiltersChange={setFilters} />

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted">
        Showing {filteredEvents.length} of {events.length} events
      </div>

      <div className="w-full">
        {/* Map Area - Full width on mobile */}
        <div className="w-full mb-6">
          <LeafletMap
            events={filteredEvents}
            onEventSelect={handleEventClick}
          />
        </div>

        {/* Event Details Sidebar */}
        <div className="w-full">
          {selectedEvent && filteredEvents.some(e => e.id === selectedEvent.id) ? (
            <div className="bg-white rounded-lg border border-border p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">{selectedEvent.title}</h2>

              <div className="space-y-4">
                {/* Sport */}
                <div>
                  <p className="text-sm text-muted">Sport</p>
                  <p className="font-semibold text-foreground capitalize">
                    {getSportEmoji(selectedEvent.sportType)} {selectedEvent.sportType}
                  </p>
                </div>

                {/* Location */}
                <div>
                  <p className="text-sm text-muted">Location</p>
                  <p className="font-semibold text-foreground">📍 {selectedEvent.location}</p>
                </div>

                {/* Date & Time */}
                <div>
                  <p className="text-sm text-muted">Date & Time</p>
                  <p className="font-semibold text-foreground">
                    📅 {selectedEvent.date} at {selectedEvent.time}
                  </p>
                </div>

                {/* Participants */}
                <div>
                  <p className="text-sm text-muted">Participants</p>
                  <p className="font-semibold text-foreground">
                    {selectedEvent.currentParticipants}/{selectedEvent.maxParticipants}
                  </p>
                  <div className="w-full bg-border rounded-full h-2 mt-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${(selectedEvent.currentParticipants / selectedEvent.maxParticipants) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Available Spots */}
                <div>
                  <p className="text-sm text-muted">Available Spots</p>
                  <p className="font-semibold text-foreground">
                    {selectedEvent.maxParticipants - selectedEvent.currentParticipants} spots available
                  </p>
                </div>

                {/* Skill Level */}
                {selectedEvent.skillLevel && (
                  <div>
                    <p className="text-sm text-muted">Skill Level</p>
                    <p className="font-semibold text-foreground capitalize">{selectedEvent.skillLevel}</p>
                  </div>
                )}

                {/* Description */}
                <div>
                  <p className="text-sm text-muted">Description</p>
                  <p className="text-sm text-foreground line-clamp-3">{selectedEvent.description}</p>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => onSelectEvent(selectedEvent.id)}
                  className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:opacity-90 transition mt-4"
                >
                  View Details
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-surface rounded-lg border border-border p-6 text-center">
              <p className="text-muted">Select an event to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

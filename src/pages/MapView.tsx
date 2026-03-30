import { useState } from 'react'
import { mockEvents } from '@/mockData'
import { Event } from '@/types'

interface MapViewProps {
  onSelectEvent: (eventId: string) => void
}

export default function MapView({ onSelectEvent }: MapViewProps) {
  const [events] = useState<Event[]>(mockEvents)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

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
    <div className="pb-24">
      <h1 className="text-3xl font-bold text-foreground mb-6">Events Map</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-border p-6 h-96 overflow-y-auto">
            <div className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-4xl mb-2">🗺️</p>
                <p className="text-muted font-semibold">{events.length} Events Near You</p>
              </div>

              {/* Events List */}
              <div className="space-y-3">
                {events.map(event => (
                  <button
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      selectedEvent?.id === event.id
                        ? 'border-primary bg-white shadow-lg'
                        : 'border-border bg-white hover:border-primary'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getSportEmoji(event.sportType)}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{event.title}</h3>
                        <p className="text-sm text-muted truncate">📍 {event.location}</p>
                        <p className="text-xs text-muted mt-1">
                          {event.date} at {event.time}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                            {event.currentParticipants}/{event.maxParticipants}
                          </span>
                          {event.skillLevel && (
                            <span className="bg-surface text-muted px-2 py-1 rounded capitalize">
                              {event.skillLevel}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Event Details Sidebar */}
        <div className="lg:col-span-1">
          {selectedEvent ? (
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

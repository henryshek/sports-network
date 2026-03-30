import { useState } from 'react'
import { mockEvents } from '@/mockData'
import { Event, User } from '@/types'

interface MapViewProps {
  onSelectEvent: (eventId: string) => void
  user: User
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

  return (
    <div className="pb-24">
      <h1 className="text-3xl font-bold text-foreground mb-6">Events Map</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-lg border border-border p-6 h-96 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl mb-2">🗺️</p>
              <p className="text-muted">Map view showing {events.length} events near you</p>
              <div className="mt-4 space-y-2">
                {events.map(event => (
                  <div key={event.id} className="text-sm text-muted">
                    📍 {event.location}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Events Sidebar */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Nearby Events</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {events.map(event => (
              <div
                key={event.id}
                onClick={() => {
                  setSelectedEvent(event)
                  onSelectEvent(event.id)
                }}
                className={`p-4 rounded-lg border cursor-pointer transition ${
                  selectedEvent?.id === event.id
                    ? 'bg-primary/10 border-primary'
                    : 'bg-surface border-border hover:bg-border'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xl">{getSportEmoji(event.sportType)}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm line-clamp-2">{event.title}</h3>
                    <p className="text-xs text-muted line-clamp-1">{event.location}</p>
                    <p className="text-xs text-muted mt-1">
                      {event.currentParticipants}/{event.maxParticipants} participants
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

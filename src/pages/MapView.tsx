import { useState } from 'react'
import { mockEvents } from '@/mockData'
import { Event } from '@/types'
import VisualMap from '@/components/VisualMap'

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
    <div className="pb-24 w-full">
      <h1 className="text-3xl font-bold text-foreground mb-6">Events Map</h1>

      <div className="w-full">
        {/* Map Area - Full width on mobile */}
        <div className="w-full mb-6">
          <VisualMap
            events={events}
            onSelectEvent={(eventId) => {
              const event = events.find(e => e.id === eventId)
              if (event) handleEventClick(event)
            }}
            selectedEventId={selectedEvent?.id}
          />
        </div>

        {/* Event Details Sidebar */}
        <div className="w-full">
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

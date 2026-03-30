import { Event } from '@/types'

interface MobileMapViewProps {
  events: Event[]
  onSelectEvent: (eventId: string) => void
  selectedEventId?: string
}

export default function MobileMapView({ events, onSelectEvent, selectedEventId }: MobileMapViewProps) {
  // Get location coordinates for known places
  const getCoordinates = (location: string) => {
    const locationMap: Record<string, { lat: number; lng: number }> = {
      'golden gate park': { lat: 37.7694, lng: -122.4862 },
      'mission bay': { lat: 37.7597, lng: -122.3931 },
      'ocean beach': { lat: 37.7596, lng: -122.5107 },
      'dolores park': { lat: 37.7599, lng: -122.4148 },
      'central park': { lat: 40.7829, lng: -73.9654 },
      'downtown sports court': { lat: 37.7749, lng: -122.4194 },
    }

    const key = location.toLowerCase()
    for (const [place, coords] of Object.entries(locationMap)) {
      if (key.includes(place)) {
        return coords
      }
    }

    return { lat: 37.7749, lng: -122.4194 }
  }

  // Build the embed URL for OpenStreetMap
  const center = getCoordinates(events[0]?.location || 'San Francisco')

  // Use OpenStreetMap's embed service
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${(center.lng - 0.05).toFixed(4)},${(center.lat - 0.05).toFixed(4)},${(center.lng + 0.05).toFixed(4)},${(center.lat + 0.05).toFixed(4)}&layer=mapnik`

  return (
    <div className="space-y-4 w-full">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        <p>
          <strong>📍 Events Map:</strong> Showing {events.length} events near San Francisco
        </p>
      </div>

      {/* Map Iframe */}
      <div className="w-full rounded-lg border border-border overflow-hidden bg-gray-100">
        <iframe
          width="100%"
          height="400"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={embedUrl}
          style={{ border: 0 }}
          title="Events Map"
        />
      </div>

      {/* Events List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground text-lg">Events Near You</h3>
        {events.map((event, index) => (
          <div
            key={event.id}
            onClick={() => onSelectEvent(event.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition ${
              selectedEventId === event.id
                ? 'border-primary bg-primary/5'
                : 'border-border bg-white hover:border-primary'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate text-base">{event.title}</h4>
                <p className="text-sm text-muted">📍 {event.location}</p>
                <p className="text-sm text-muted">📅 {event.date} at {event.time}</p>
                <div className="flex gap-2 mt-2 text-xs">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {event.currentParticipants}/{event.maxParticipants}
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                    {event.skillLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
        <p>
          💡 <strong>Tip:</strong> Tap on event cards to view more details. The map shows all events in the San Francisco area.
        </p>
      </div>
    </div>
  )
}

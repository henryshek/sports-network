import { Event } from '@/types'

interface EmbeddedGoogleMapProps {
  events: Event[]
  onSelectEvent: (eventId: string) => void
  selectedEventId?: string
}

export default function EmbeddedGoogleMap({ events, onSelectEvent, selectedEventId }: EmbeddedGoogleMapProps) {
  // Create a map center based on all events
  const getCenterLocation = () => {
    // Default to San Francisco
    return { lat: 37.7749, lng: -122.4194 }
  }

  const center = getCenterLocation()
  
  // Build markers for the map
  const markers = events.map((event, index) => {
    const location = event.location || 'San Francisco'
    return `&markers=label:${index + 1}|${encodeURIComponent(location)}`
  }).join('')

  // Use a static map image URL (works without API key for basic usage)
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=13&size=600x500&maptype=roadmap${markers}&style=feature:all|element:labels.text.fill|color:0x686868&style=feature:water|element:geometry.fill|color:0xc9c9c9`

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p>
          <strong>📍 Events Map:</strong> Showing {events.length} events near San Francisco. Click on event cards to see details.
        </p>
      </div>

      {/* Static Map Display */}
      <div className="w-full rounded-lg border border-border overflow-hidden bg-gray-100">
        <img
          src={staticMapUrl}
          alt="Events Map"
          className="w-full h-auto"
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Events List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Events Near You</h3>
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
                <h4 className="font-semibold text-foreground truncate">{event.title}</h4>
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

      {/* Map Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-600">
        <p>
          💡 <strong>Tip:</strong> This map shows all events in the San Francisco area. Click on event cards to view more details.
        </p>
      </div>
    </div>
  )
}

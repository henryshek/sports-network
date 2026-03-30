import { Event } from '@/types'

interface SimpleMapViewProps {
  events: Event[]
  onSelectEvent: (eventId: string) => void
  selectedEventId?: string
}

export default function SimpleMapView({ events, onSelectEvent, selectedEventId }: SimpleMapViewProps) {
  // Get location coordinates for known places
  const getCoordinates = (location: string) => {
    const locationMap: Record<string, { lat: number; lng: number; x: number; y: number }> = {
      'golden gate park': { lat: 37.7694, lng: -122.4862, x: 25, y: 30 },
      'mission bay': { lat: 37.7597, lng: -122.3931, x: 55, y: 40 },
      'ocean beach': { lat: 37.7596, lng: -122.5107, x: 5, y: 40 },
      'dolores park': { lat: 37.7599, lng: -122.4148, x: 45, y: 45 },
      'central park': { lat: 40.7829, lng: -73.9654, x: 50, y: 20 },
      'downtown sports court': { lat: 37.7749, lng: -122.4194, x: 50, y: 50 },
    }

    const key = location.toLowerCase()
    for (const [place, coords] of Object.entries(locationMap)) {
      if (key.includes(place)) {
        return coords
      }
    }

    return { lat: 37.7749, lng: -122.4194, x: 50, y: 50 }
  }

  const getSportEmoji = (sportType: string) => {
    const emojiMap: Record<string, string> = {
      basketball: '🏀',
      soccer: '⚽',
      tennis: '🎾',
      volleyball: '🏐',
      baseball: '⚾',
      football: '🏈',
      hockey: '🏒',
      golf: '⛳',
    }
    return emojiMap[sportType] || '🎯'
  }

  return (
    <div className="space-y-4 w-full">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        <p>
          <strong>📍 Events Map:</strong> Showing {events.length} events near San Francisco
        </p>
      </div>

      {/* Visual Map */}
      <div className="w-full rounded-lg border border-border overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <div className="relative w-full bg-white rounded-lg border-2 border-blue-200" style={{ aspectRatio: '16/9', minHeight: '300px' }}>
          {/* Map background with grid */}
          <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ccc" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Map title */}
          <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-semibold text-gray-700 z-10">
            San Francisco Area
          </div>

          {/* Event markers */}
          {events.map((event, index) => {
            const coords = getCoordinates(event.location)
            const emoji = getSportEmoji(event.sportType)
            const isSelected = selectedEventId === event.id

            return (
              <button
                key={event.id}
                onClick={() => onSelectEvent(event.id)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-transform hover:scale-125"
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                }}
                title={event.title}
              >
                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition ${
                  isSelected
                    ? 'bg-primary text-white shadow-lg scale-125'
                    : 'bg-white border-2 border-primary text-primary shadow-md hover:shadow-lg'
                }`}>
                  <span className="text-xl">{emoji}</span>
                </div>
                <div className={`absolute top-full mt-1 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                  isSelected
                    ? 'bg-primary text-white'
                    : 'bg-white border border-primary text-primary'
                }`}>
                  {index + 1}
                </div>
              </button>
            )
          })}

          {/* Legend */}
          <div className="absolute bottom-2 right-2 bg-white rounded-lg p-2 text-xs border border-gray-300 z-10">
            <p className="font-semibold mb-1">Events:</p>
            {events.map((event, index) => (
              <div key={event.id} className="flex items-center gap-2">
                <span className="font-bold text-primary">{index + 1}</span>
                <span className="text-xs text-gray-700 truncate max-w-[100px]">{event.title}</span>
              </div>
            ))}
          </div>
        </div>
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
          💡 <strong>Tip:</strong> Tap on event markers or cards to view more details. The map shows all events in the San Francisco area.
        </p>
      </div>
    </div>
  )
}

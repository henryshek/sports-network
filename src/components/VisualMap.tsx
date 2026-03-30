import { Event } from '@/types'

interface VisualMapProps {
  events: Event[]
  onSelectEvent: (eventId: string) => void
  selectedEventId?: string
}

export default function VisualMap({ events, onSelectEvent, selectedEventId }: VisualMapProps) {
  // Map event locations to grid positions (0-100 scale)
  const getEventPosition = (location: string) => {
    const locationMap: Record<string, { x: number; y: number }> = {
      'golden gate park': { x: 25, y: 35 },
      'mission bay': { x: 55, y: 45 },
      'ocean beach': { x: 15, y: 55 },
      'dolores park': { x: 50, y: 60 },
      'central park': { x: 50, y: 50 },
      'downtown sports court': { x: 50, y: 50 },
    }

    const key = location.toLowerCase()
    for (const [place, pos] of Object.entries(locationMap)) {
      if (key.includes(place)) {
        return pos
      }
    }

    return { x: 50, y: 50 }
  }

  const getSportEmoji = (sport?: string) => {
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
    return emojis[sport || 'basketball'] || '⚽'
  }

  return (
    <div className="space-y-4 w-full">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        <p>
          <strong>📍 Events Map:</strong> Tap on markers to view event details. Showing {events.length} events.
        </p>
      </div>

      {/* Visual Map */}
      <div className="w-full rounded-lg border-2 border-border overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 relative" style={{ minHeight: '400px' }}>
        {/* Map Background with grid */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" className="w-full h-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Map Title */}
        <div className="absolute top-4 left-4 z-10">
          <h3 className="text-lg font-bold text-gray-800">San Francisco Area</h3>
          <p className="text-xs text-gray-600">Events Map</p>
        </div>

        {/* Event Markers */}
        <div className="absolute inset-0">
          {events.map((event, index) => {
            const pos = getEventPosition(event.location || '')
            const isSelected = selectedEventId === event.id

            return (
              <button
                key={event.id}
                onClick={() => onSelectEvent(event.id)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 focus:outline-none"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                title={event.title}
              >
                {/* Marker Circle */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all ${
                    isSelected
                      ? 'bg-primary text-white scale-125 ring-4 ring-primary/30'
                      : 'bg-white text-gray-800 border-2 border-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  {getSportEmoji((event as any).sport)}
                </div>

                {/* Marker Number */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {index + 1}
                </div>

                {/* Pulse Animation for selected */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" style={{ width: '48px', height: '48px', left: '-24px', top: '-24px' }} />
                )}
              </button>
            )
          })}
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded-lg p-3 text-xs space-y-1 max-w-xs">
          <p className="font-semibold text-gray-800">Legend:</p>
          <p className="text-gray-600">🎯 Tap markers to view details</p>
          <p className="text-gray-600">📍 Markers show event locations</p>
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
          💡 <strong>Tip:</strong> Tap on map markers or event cards to view more details. The map shows all events in the San Francisco area.
        </p>
      </div>
    </div>
  )
}

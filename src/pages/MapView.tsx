import { useState } from 'react'
import { mockEvents } from '@/mockData'
import { Event } from '@/types'
import { LeafletMap } from '@/components/LeafletMap'
import { EventMapFilters, type EventFilters } from '@/components/EventMapFilters'
import { TOP_SPORTS, isTopSport } from '@/constants/sports'

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
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [showNearbyOnly, setShowNearbyOnly] = useState(false)
  const [locationError, setLocationError] = useState<string>('')

  const requestUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLocationError('')
        },
        (error) => {
          setLocationError('Unable to get your location. Please enable location services.')
          console.error('Geolocation error:', error)
        }
      )
    } else {
      setLocationError('Geolocation is not supported by your browser')
    }
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const isToday = (dateString: string) => {
    const eventDate = new Date(dateString)
    const today = new Date()
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    )
  }

  const filteredEvents = events.filter(event => {
    // Sport type filter
    if (filters.sportType.length > 0) {
      const sportMatches = filters.sportType.includes(event.sportType)
      const othersSelected = filters.sportType.includes('others')
      const isCustomSport = !isTopSport(event.sportType)
      
      if (!sportMatches && !(othersSelected && isCustomSport)) {
        return false
      }
    }
    
    // Custom sport filter
    if (filters.customSport && event.sportType !== filters.customSport) {
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

    // Nearby today filter
    if (showNearbyOnly && userLocation) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        event.latitude || 0,
        event.longitude || 0
      )
      const isNearby = distance <= 10 // 10 km radius
      const isEventToday = isToday(event.date)
      return isNearby && isEventToday
    }

    return true
  })

  const getSportEmoji = (sport: string) => {
    if (sport === 'others') return '🏅'
    const emojis: Record<string, string> = {
      basketball: '🏀',
      soccer: '⚽',
      tennis: '🎾',
      volleyball: '🏐',
      badminton: '🏸',
      cricket: '🏏',
      running: '🏃',
      cycling: '🚴',
      swimming: '🏊',
      yoga: '🧘',
      pickleball: '🏓',
    }
    return emojis[sport.toLowerCase()] || '⚽'
  }

  const topSports = TOP_SPORTS.map(s => s.toLowerCase())

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    onSelectEvent(event.id)
  }

  return (
    <div className="pb-24 w-full">
      <h1 className="text-3xl font-bold text-foreground mb-6">Events Map</h1>

      {/* Geolocation and Nearby Button */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={requestUserLocation}
          className="flex-1 bg-secondary text-white px-4 py-2 rounded-lg hover:opacity-90 transition font-semibold flex items-center justify-center gap-2"
        >
          📍 {userLocation ? 'Location Found' : 'Find My Location'}
        </button>
        {userLocation && (
          <button
            onClick={() => setShowNearbyOnly(!showNearbyOnly)}
            className={`flex-1 px-4 py-2 rounded-lg transition font-semibold ${
              showNearbyOnly
                ? 'bg-primary text-white'
                : 'bg-surface text-foreground hover:bg-border'
            }`}
          >
            🔍 Nearby Today
          </button>
        )}
      </div>

      {locationError && (
        <div className="bg-error/10 border border-error text-error px-4 py-2 rounded-lg text-sm mb-4">
          {locationError}
        </div>
      )}

      {showNearbyOnly && userLocation && (
        <div className="bg-primary/10 border border-primary text-primary px-4 py-2 rounded-lg text-sm mb-4">
          ✓ Showing events happening today within 10 km of your location
        </div>
      )}

      {/* Sport Filter Buttons */}
      <div className="mb-4 flex gap-2 flex-wrap overflow-x-auto pb-2">
        <button
          onClick={() => setFilters({ ...filters, sportType: [] })}
          className={`px-4 py-2 rounded-full transition whitespace-nowrap font-semibold ${
            filters.sportType.length === 0 ? 'bg-primary text-white' : 'bg-surface text-foreground hover:bg-border'
          }`}
        >
          All Sports
        </button>
        {topSports.map(sport => (
          <button
            key={sport}
            onClick={() => {
              const updated = filters.sportType.includes(sport)
                ? filters.sportType.filter(s => s !== sport)
                : [...filters.sportType, sport]
              setFilters({ ...filters, sportType: updated })
            }}
            className={`px-4 py-2 rounded-full transition capitalize whitespace-nowrap ${
              filters.sportType.includes(sport) ? 'bg-primary text-white' : 'bg-surface text-foreground hover:bg-border'
            }`}
          >
            {getSportEmoji(sport)} {sport.charAt(0).toUpperCase() + sport.slice(1)}
          </button>
        ))}
        <button
          onClick={() => {
            const updated = filters.sportType.includes('others')
              ? filters.sportType.filter(s => s !== 'others')
              : [...filters.sportType, 'others']
            setFilters({ ...filters, sportType: updated })
          }}
          className={`px-4 py-2 rounded-full transition whitespace-nowrap ${
            filters.sportType.includes('others') ? 'bg-primary text-white' : 'bg-surface text-foreground hover:bg-border'
          }`}
        >
          🏅 Others
        </button>
      </div>

      {/* Filters */}
      <EventMapFilters onFiltersChange={setFilters} />

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted">
        Showing {filteredEvents.length} of {events.length} events
      </div>

      {/* Map Area - Full width */}
      <div className="w-full mb-6">
        <LeafletMap
          events={filteredEvents}
          onEventSelect={handleEventClick}
        />
      </div>

      {/* Event Details Card Below Map */}
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
              <p className="text-muted">Click on a map pin to see event details</p>
            </div>
          )
        }
      </div>
    </div>
  )
}

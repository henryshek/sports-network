import { useState } from 'react'
import { mockEvents } from '@/mockData'
import { Event } from '@/types'
import { EventMiniMap } from '@/components/EventMiniMap'

interface EventsProps {
  onSelectEvent: (eventId: string) => void
  onCreateEvent?: () => void
}

export default function Events({ onSelectEvent, onCreateEvent }: EventsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSport, setSelectedSport] = useState<string>('')
  const [events] = useState<Event[]>(mockEvents)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [showNearbyOnly, setShowNearbyOnly] = useState(false)
  const [locationError, setLocationError] = useState<string>('')

  const sports = Array.from(new Set(events.map(e => e.sportType)))

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
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSport = !selectedSport || event.sportType === selectedSport

    if (showNearbyOnly && userLocation) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        event.latitude || 0,
        event.longitude || 0
      )
      const isNearby = distance <= 10 // 10 km radius
      const isEventToday = isToday(event.date)
      return matchesSearch && matchesSport && isNearby && isEventToday
    }

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
        <button onClick={onCreateEvent} className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
          + Create Event
        </button>
      </div>

      {/* Geolocation and Nearby Button */}
      <div className="flex gap-2">
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
        <div className="bg-error/10 border border-error text-error px-4 py-2 rounded-lg text-sm">
          {locationError}
        </div>
      )}

      {showNearbyOnly && userLocation && (
        <div className="bg-primary/10 border border-primary text-primary px-4 py-2 rounded-lg text-sm">
          ✓ Showing events happening today within 10 km of your location
        </div>
      )}

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
              className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition"
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

              {/* Mini Map */}
              {event.latitude && event.longitude && (
                <div className="mb-4">
                  <EventMiniMap
                    latitude={event.latitude}
                    longitude={event.longitude}
                    title={event.location}
                    height="140px"
                  />
                </div>
              )}

              {/* Distance Info */}
              {userLocation && event.latitude && event.longitude && (
                <div className="mb-4 p-2 bg-primary/5 rounded-lg">
                  <p className="text-xs text-muted">
                    📍 {calculateDistance(
                      userLocation.lat,
                      userLocation.lng,
                      event.latitude,
                      event.longitude
                    ).toFixed(1)} km away
                  </p>
                </div>
              )}

              {/* Participants Preview */}
              <div className="mb-4 pb-4 border-b border-border">
                <p className="text-xs text-muted mb-2">Participants ({event.currentParticipants})</p>
                <div className="flex flex-wrap gap-2">
                  {event.participants.slice(0, 5).map((participantId, i) => {
                    const mockUsersMap: Record<string, any> = {
                      'user1': { name: 'John Doe', avatar: '👨‍🦰' },
                      'user2': { name: 'Jane Smith', avatar: '👩‍🦱' },
                      'user3': { name: 'Mike Johnson', avatar: '👨‍💼' },
                      'user4': { name: 'Sarah Williams', avatar: '👩‍🦳' },
                      'user5': { name: 'Alex Brown', avatar: '👨‍🎓' },
                      'user6': { name: 'Emma Davis', avatar: '👩‍🎨' },
                    }
                    const user = mockUsersMap[participantId as keyof typeof mockUsersMap]
                    return (
                      <div key={i} className="flex items-center gap-1 bg-surface px-2 py-1 rounded-full text-xs">
                        <span>{user?.avatar || '👤'}</span>
                        <span className="text-foreground">{user?.name?.split(' ')[0] || 'User'}</span>
                      </div>
                    )
                  })}
                  {event.currentParticipants > 5 && (
                    <div className="flex items-center gap-1 bg-surface px-2 py-1 rounded-full text-xs text-muted">
                      +{event.currentParticipants - 5} more
                    </div>
                  )}
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

              {/* View Details Button */}
              <button
                onClick={() => onSelectEvent(event.id)}
                className="w-full mt-4 bg-primary text-white py-2 rounded-lg hover:opacity-90 transition font-semibold"
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted">
              {showNearbyOnly
                ? 'No events happening today nearby. Try adjusting your filters.'
                : 'No events found'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

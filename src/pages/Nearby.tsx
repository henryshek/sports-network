import { useState } from 'react'
import { MapPin } from 'lucide-react'

interface NearbyProps {
  onEventDetails?: (eventId: string) => void
  onClubDetails?: (clubId: string) => void
}

export default function Nearby({ onEventDetails, onClubDetails }: NearbyProps) {
  const [activeTab, setActiveTab] = useState<'events' | 'clubs'>('events')
  const [radius, setRadius] = useState(5) // km

  // Mock nearby events (in a real app, this would be calculated based on user location)
  const nearbyEvents = [
    {
      id: 'event-1',
      title: 'Swimming Training at Victoria Park Pool',
      location: 'Victoria Park Swimming Pool, Causeway Bay, Hong Kong',
      distance: 0.8,
      date: '2026-04-03',
      time: '17:00',
      participants: '14/25',
      sport: 'swimming',
      icon: '🏊',
    },
    {
      id: 'event-2',
      title: 'Morning Running Group at Victoria Park',
      location: 'Victoria Park, Causeway Bay, Hong Kong',
      distance: 1.2,
      date: '2026-04-06',
      time: '06:30',
      participants: '12/20',
      sport: 'running',
      icon: '🏃',
    },
    {
      id: 'event-3',
      title: 'Tennis Match at Hong Kong Park',
      location: 'Hong Kong Park, Central, Hong Kong',
      distance: 2.1,
      date: '2026-04-06',
      time: '09:00',
      participants: '3/4',
      sport: 'tennis',
      icon: '🎾',
    },
    {
      id: 'event-4',
      title: 'Basketball Game at Victoria Park',
      location: 'Victoria Park, Causeway Bay, Hong Kong',
      distance: 0.8,
      date: '2026-04-06',
      time: '18:00',
      participants: '6/10',
      sport: 'basketball',
      icon: '🏀',
    },
  ]

  const nearbyClubs = [
    {
      id: 'club-1',
      name: 'SF Basketball Club',
      location: 'Victoria Park',
      distance: 0.8,
      members: 4,
      sport: 'basketball',
      icon: '🏀',
    },
    {
      id: 'club-2',
      name: 'Running Enthusiasts',
      location: 'Victoria Park',
      distance: 1.2,
      members: 4,
      sport: 'running',
      icon: '🏃',
    },
    {
      id: 'club-3',
      name: 'Tennis Lovers',
      location: 'Hong Kong Park',
      distance: 2.1,
      members: 3,
      sport: 'tennis',
      icon: '🎾',
    },
    {
      id: 'club-4',
      name: 'Swimming Club',
      location: 'Victoria Park',
      distance: 0.8,
      members: 5,
      sport: 'swimming',
      icon: '🏊',
    },
  ]

  const filteredEvents = nearbyEvents.filter((event) => event.distance <= radius)
  const filteredClubs = nearbyClubs.filter((club) => club.distance <= radius)

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
          <MapPin size={32} className="text-indigo-500" />
          Nearby
        </h1>
        <p className="text-lg text-muted">Discover events and clubs near you</p>
      </div>

      {/* Radius Filter */}
      <div className="bg-white rounded-lg border border-border p-4">
        <div className="flex items-center gap-4">
          <label className="font-semibold text-foreground">Search Radius:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="flex-1"
          />
          <span className="font-bold text-primary text-lg min-w-max">{radius} km</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-3 font-semibold transition ${
            activeTab === 'events'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted hover:text-foreground'
          }`}
        >
          📅 Nearby Events ({filteredEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('clubs')}
          className={`px-4 py-3 font-semibold transition ${
            activeTab === 'clubs'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted hover:text-foreground'
          }`}
        >
          👥 Nearby Clubs ({filteredClubs.length})
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'events' && (
          <>
            {filteredEvents.length > 0 ? (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-lg border border-border p-4 hover:shadow-md transition">
                    <div className="flex items-start gap-4">
                      {/* Sport Icon */}
                      <div className="text-3xl flex-shrink-0">{event.icon}</div>

                      {/* Event Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-foreground text-lg">{event.title}</h3>
                            <p className="text-sm text-muted mt-1">{event.location}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                              📍 {event.distance} km
                            </div>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="flex flex-wrap gap-3 mt-3">
                          <div className="flex items-center gap-1 text-xs bg-surface px-2 py-1 rounded">
                            <span>📅</span>
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs bg-surface px-2 py-1 rounded">
                            <span>⏰</span>
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs bg-surface px-2 py-1 rounded">
                            <span>👥</span>
                            <span>{event.participants}</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => onEventDetails?.(event.id)}
                          className="mt-3 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:opacity-90 transition font-semibold"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-3xl mb-3">📭</p>
                <p className="text-muted">No events within {radius} km</p>
                <p className="text-sm text-muted mt-2">Try increasing the search radius</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'clubs' && (
          <>
            {filteredClubs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredClubs.map((club) => (
                  <div key={club.id} className="bg-white rounded-lg border border-border p-4 hover:shadow-md transition">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">{club.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{club.name}</h3>
                        <p className="text-xs text-muted mt-1">{club.location}</p>
                        <div className="mt-2 inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-semibold">
                          📍 {club.distance} km
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted mb-3">{club.members} members</p>

                    {/* Action Button */}
                    <button
                      onClick={() => onClubDetails?.(club.id)}
                      className="w-full px-3 py-2 bg-primary text-white text-sm rounded-lg hover:opacity-90 transition font-semibold"
                    >
                      View Club
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-3xl mb-3">📭</p>
                <p className="text-muted">No clubs within {radius} km</p>
                <p className="text-sm text-muted mt-2">Try increasing the search radius</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { mockEvents } from '@/mockData'
import { Event } from '@/types'
import { EventMiniMap } from '@/components/EventMiniMap'
import { TOP_SPORTS, isTopSport } from '@/constants/sports'

interface EventsProps {
  onSelectEvent: (eventId: string) => void
  onCreateEvent?: () => void
}

export default function Events({ onSelectEvent, onCreateEvent }: EventsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSport, setSelectedSport] = useState<string>('')
  const [events] = useState<Event[]>(mockEvents)

  const topSports = TOP_SPORTS.map(s => s.toLowerCase())

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesSport = true
    if (selectedSport) {
      if (selectedSport === 'others') {
        matchesSport = !isTopSport(event.sportType)
      } else {
        matchesSport = event.sportType === selectedSport
      }
    }

    return matchesSearch && matchesSport
  })

  const getCapacityPercentage = (event: Event) => {
    return Math.round((event.currentParticipants / event.maxParticipants) * 100)
  }

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

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Events</h1>
        <button onClick={onCreateEvent} className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
          + Create Event
        </button>
      </div>



      {/* Search and Filters */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="flex gap-2 flex-wrap overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedSport('')}
            className={`px-4 py-2 rounded-full transition whitespace-nowrap font-semibold ${
              !selectedSport ? 'bg-primary text-white' : 'bg-surface text-foreground hover:bg-border'
            }`}
          >
            All Sports
          </button>
          {topSports.map(sport => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-4 py-2 rounded-full transition capitalize whitespace-nowrap ${
                selectedSport === sport ? 'bg-primary text-white' : 'bg-surface text-foreground hover:bg-border'
              }`}
            >
              {getSportEmoji(sport)} {sport.charAt(0).toUpperCase() + sport.slice(1)}
            </button>
          ))}
          <button
            onClick={() => setSelectedSport('others')}
            className={`px-4 py-2 rounded-full transition whitespace-nowrap ${
              selectedSport === 'others' ? 'bg-primary text-white' : 'bg-surface text-foreground hover:bg-border'
            }`}
          >
            🏅 Others
          </button>
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
            <p className="text-muted">No events found</p>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Users, Clock, Search, Plus } from 'lucide-react'
import { Event, SportType } from '@/types'
import { eventApi } from '@/api'

interface EventsProps {
  onSelectEvent?: (eventId: string) => void
}

const SPORTS: { value: SportType; label: string; emoji: string }[] = [
  { value: 'basketball', label: 'Basketball', emoji: '🏀' },
  { value: 'soccer', label: 'Soccer', emoji: '⚽' },
  { value: 'tennis', label: 'Tennis', emoji: '🎾' },
  { value: 'volleyball', label: 'Volleyball', emoji: '🏐' },
  { value: 'badminton', label: 'Badminton', emoji: '🏸' },
  { value: 'cricket', label: 'Cricket', emoji: '🏏' },
  { value: 'baseball', label: 'Baseball', emoji: '⚾' },
  { value: 'running', label: 'Running', emoji: '🏃' },
  { value: 'cycling', label: 'Cycling', emoji: '🚴' },
  { value: 'swimming', label: 'Swimming', emoji: '🏊' },
]

export default function Events({}: EventsProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState<SportType | ''>('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventApi.getAll()
        setEvents(response.data)
      } catch (error) {
        console.error('Failed to fetch events:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSport = !selectedSport || event.sportType === selectedSport
    return matchesSearch && matchesSport
  })

  const getSportEmoji = (sport: SportType) => {
    return SPORTS.find(s => s.value === sport)?.emoji || '⚽'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted">Loading events...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <Link to="/events/create" className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition">
            <Plus size={20} />
            Create Event
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-surface rounded-xl p-6 mb-8 border border-border">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-muted" size={20} />
              <input
                type="text"
                placeholder="Search events by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedSport('')}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedSport === '' ? 'bg-primary text-white' : 'bg-background border border-border text-foreground hover:bg-surface'
                }`}
              >
                All Sports
              </button>
              {SPORTS.map(sport => (
                <button
                  key={sport.value}
                  onClick={() => setSelectedSport(sport.value)}
                  className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                    selectedSport === sport.value ? 'bg-primary text-white' : 'bg-background border border-border text-foreground hover:bg-surface'
                  }`}
                >
                  <span>{sport.emoji}</span>
                  {sport.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted text-lg">No events found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="bg-surface rounded-xl overflow-hidden border border-border hover:shadow-lg transition"
              >
                <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-6 h-32 flex items-end">
                  <div className="text-4xl">{getSportEmoji(event.sportType)}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{event.title}</h3>
                  <p className="text-sm text-muted mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 text-sm text-muted">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{event.date} at {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>{event.currentParticipants}/{event.maxParticipants} participants</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      event.currentParticipants >= event.maxParticipants
                        ? 'bg-warning/10 text-warning'
                        : 'bg-success/10 text-success'
                    }`}>
                      {event.currentParticipants >= event.maxParticipants ? 'Full' : 'Available'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

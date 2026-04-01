import { useState, useMemo } from 'react'
import { mockEvents, mockClubs } from '@/mockData'
import { TrendingUp } from 'lucide-react'

interface TrendingProps {
  onEventDetails?: (eventId: string) => void
  onClubDetails?: (clubId: string) => void
}

export default function Trending({ onEventDetails, onClubDetails }: TrendingProps) {
  const [activeTab, setActiveTab] = useState<'events' | 'clubs'>('events')

  // Calculate trending events (most participants)
  const trendingEvents = useMemo(() => {
    return [...mockEvents]
      .sort((a, b) => b.currentParticipants - a.currentParticipants)
      .slice(0, 10)
  }, [])

  // Calculate trending clubs (most members)
  const trendingClubs = useMemo(() => {
    return [...mockClubs]
      .sort((a, b) => b.members.length - a.members.length)
      .slice(0, 10)
  }, [])

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
      yoga: '🧘',
      pickleball: '🏓',
    }
    return emojis[sport.toLowerCase()] || '⚽'
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
          <TrendingUp size={32} className="text-red-500" />
          Trending Now
        </h1>
        <p className="text-lg text-muted">Discover the most popular events and clubs</p>
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
          🔥 Trending Events
        </button>
        <button
          onClick={() => setActiveTab('clubs')}
          className={`px-4 py-3 font-semibold transition ${
            activeTab === 'clubs'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted hover:text-foreground'
          }`}
        >
          👥 Trending Clubs
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'events' && (
          <div className="space-y-4">
            {trendingEvents.map((event, index) => (
              <div key={event.id} className="bg-white rounded-lg border border-border p-4 hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  {/* Rank Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-2xl">{getSportEmoji(event.sportType)}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-lg">{event.title}</h3>
                        <p className="text-sm text-muted">{event.location}</p>
                      </div>
                    </div>

                    {/* Event Stats */}
                    <div className="flex flex-wrap gap-3 mt-3">
                      <div className="flex items-center gap-1 text-xs bg-surface px-2 py-1 rounded">
                        <span>👥</span>
                        <span className="font-semibold">{event.currentParticipants}</span>
                        <span>attending</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs bg-surface px-2 py-1 rounded">
                        <span>📅</span>
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs bg-surface px-2 py-1 rounded">
                        <span>⏰</span>
                        <span>{event.time}</span>
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
        )}

        {activeTab === 'clubs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingClubs.map((club, index) => (
              <div key={club.id} className="bg-white rounded-lg border border-border p-4 hover:shadow-md transition">
                <div className="flex items-start gap-3 mb-3">
                  {/* Rank Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>

                  {/* Club Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{club.name}</h3>
                    <p className="text-xs text-muted mt-1 line-clamp-2">{club.description}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <span className="text-lg">{getSportEmoji(club.sport)}</span>
                  <span className="text-muted">•</span>
                  <span className="font-semibold text-primary">{club.members.length} members</span>
                </div>

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
        )}
      </div>
    </div>
  )
}

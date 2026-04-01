import { useState } from 'react'
import { Bookmark } from 'lucide-react'

interface SavedProps {
  onEventDetails?: (eventId: string) => void
  onClubDetails?: (clubId: string) => void
}

export default function Saved({ onEventDetails, onClubDetails }: SavedProps) {
  const [activeTab, setActiveTab] = useState<'events' | 'clubs'>('events')

  // Mock saved events and clubs (in a real app, this would come from user data)
  const savedEvents = [
    {
      id: 'event-1',
      title: 'Basketball Game at Victoria Park',
      location: 'Victoria Park, Causeway Bay, Hong Kong',
      date: '2026-04-06',
      time: '18:00',
      participants: '6/10',
      sport: 'basketball',
      icon: '🏀',
    },
    {
      id: 'event-2',
      title: 'Tennis Match at Hong Kong Park',
      location: 'Hong Kong Park, Central, Hong Kong',
      date: '2026-04-06',
      time: '09:00',
      participants: '3/4',
      sport: 'tennis',
      icon: '🎾',
    },
  ]

  const savedClubs = [
    {
      id: 'club-1',
      name: 'SF Basketball Club',
      members: 4,
      sport: 'basketball',
      icon: '🏀',
    },
    {
      id: 'club-2',
      name: 'Tennis Lovers',
      members: 3,
      sport: 'tennis',
      icon: '🎾',
    },
  ]

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Bookmark size={32} className="text-yellow-500" />
          Saved
        </h1>
        <p className="text-lg text-muted">Your bookmarked events and clubs</p>
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
          📅 Saved Events ({savedEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('clubs')}
          className={`px-4 py-3 font-semibold transition ${
            activeTab === 'clubs'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted hover:text-foreground'
          }`}
        >
          👥 Saved Clubs ({savedClubs.length})
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'events' && (
          <>
            {savedEvents.length > 0 ? (
              <div className="space-y-4">
                {savedEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-lg border border-border p-4 hover:shadow-md transition">
                    <div className="flex items-start gap-4">
                      {/* Sport Icon */}
                      <div className="text-3xl flex-shrink-0">{event.icon}</div>

                      {/* Event Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-lg">{event.title}</h3>
                        <p className="text-sm text-muted mt-1">{event.location}</p>

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

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => onEventDetails?.(event.id)}
                            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:opacity-90 transition font-semibold"
                          >
                            View Details
                          </button>
                          <button className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:opacity-90 transition font-semibold">
                            ⭐ Saved
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-3xl mb-3">📭</p>
                <p className="text-muted">No saved events yet</p>
                <p className="text-sm text-muted mt-2">Bookmark events to save them for later</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'clubs' && (
          <>
            {savedClubs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedClubs.map((club) => (
                  <div key={club.id} className="bg-white rounded-lg border border-border p-4 hover:shadow-md transition">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">{club.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{club.name}</h3>
                        <p className="text-xs text-muted mt-1">{club.members} members</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => onClubDetails?.(club.id)}
                        className="flex-1 px-3 py-2 bg-primary text-white text-sm rounded-lg hover:opacity-90 transition font-semibold"
                      >
                        View Club
                      </button>
                      <button className="px-3 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:opacity-90 transition font-semibold">
                        ⭐
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-3xl mb-3">📭</p>
                <p className="text-muted">No saved clubs yet</p>
                <p className="text-sm text-muted mt-2">Bookmark clubs to save them for later</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { mockClubs } from '@/mockData'
import { Club } from '@/types'

interface ClubsProps {
  onSelectClub: (clubId: string) => void
  user?: any
}

export default function Clubs({ onSelectClub }: ClubsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSport, setSelectedSport] = useState<string>('')
  const [clubs] = useState<Club[]>(mockClubs)

  const sports = Array.from(new Set(clubs.map(c => c.sport)))

  const filteredClubs = clubs.filter(club => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSport = !selectedSport || club.sport === selectedSport
    return matchesSearch && matchesSport
  })

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
        <h1 className="text-3xl font-bold text-foreground">Clubs</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
          + Create Club
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search clubs..."
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

      {/* Clubs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.length > 0 ? (
          filteredClubs.map(club => (
            <div
              key={club.id}
              onClick={() => onSelectClub(club.id)}
              className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition cursor-pointer"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-6 h-32 flex items-end">
                <span className="text-4xl">{getSportEmoji(club.sport)}</span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{club.name}</h3>
                <p className="text-sm text-muted mb-4 line-clamp-2">{club.description}</p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted">
                    <span>👥</span>
                    <span>{club.members.length} members</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    club.isPrivate
                      ? 'bg-warning/10 text-warning'
                      : 'bg-success/10 text-success'
                  }`}>
                    {club.isPrivate ? 'Private' : 'Public'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted">No clubs found</p>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { mockClubs, mockUsers } from '@/mockData'
import { Club, User } from '@/types'

interface ClubDetailProps {
  clubId: string
  user: User
  onBack: () => void
}

export default function ClubDetail({ clubId, user, onBack }: ClubDetailProps) {
  const [club, setClub] = useState<Club | null>(null)
  const [isMember, setIsMember] = useState(false)

  useEffect(() => {
    // Find club from mock data
    const foundClub = mockClubs.find(c => c.id === clubId)
    if (foundClub) {
      setClub(foundClub)
      setIsMember(foundClub.members.includes(user.id))
    }
  }, [clubId, user.id])

  if (!club) {
    return (
      <div className="pb-24">
        <button onClick={onBack} className="text-primary hover:underline mb-4">
          ← Back
        </button>
        <div className="text-center py-12">
          <p className="text-muted">Club not found</p>
        </div>
      </div>
    )
  }

  const handleJoinClub = () => {
    if (isMember) {
      setClub({
        ...club,
        members: club.members.filter(m => m !== user.id),
      })
      setIsMember(false)
    } else {
      setClub({
        ...club,
        members: [...club.members, user.id],
      })
      setIsMember(true)
    }
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
    <div className="pb-24">
      <button onClick={onBack} className="text-primary hover:underline mb-6">
        ← Back to Clubs
      </button>

      <div className="bg-white rounded-lg border border-border overflow-hidden mb-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-8 h-40 flex items-end">
          <span className="text-6xl">{getSportEmoji(club.sport)}</span>
        </div>

        {/* Content */}
        <div className="p-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{club.name}</h1>
          <p className="text-lg text-muted mb-6">{club.description}</p>

          {/* Club Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <p className="text-sm text-muted">🏆 Sport</p>
              <p className="text-lg font-semibold text-foreground capitalize">{club.sport}</p>
            </div>
            <div>
              <p className="text-sm text-muted">👥 Members</p>
              <p className="text-lg font-semibold text-foreground">{club.members.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted">🔒 Privacy</p>
              <p className="text-lg font-semibold text-foreground capitalize">{club.isPrivate ? 'Private' : 'Public'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={handleJoinClub}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                isMember
                  ? 'bg-error text-white hover:opacity-90'
                  : 'bg-primary text-white hover:opacity-90'
              }`}
            >
              {isMember ? 'Leave Club' : 'Join Club'}
            </button>
            <button className="px-6 py-3 rounded-lg font-semibold bg-surface border border-border text-foreground hover:bg-border transition">
              💬 Club Chat
            </button>
          </div>
        </div>
      </div>

      {/* Creator Info */}
      {club.creator && (
        <div className="bg-white rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Creator</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
              {club.creator.avatar || club.creator.name[0]}
            </div>
            <div>
              <p className="font-semibold text-foreground">{club.creator.name}</p>
              <p className="text-muted text-sm">{club.creator.bio || 'No bio'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Members */}
      <div className="bg-white rounded-lg border border-border p-6 mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Members ({club.members.length})</h2>
        <div className="space-y-3">
          {club.members.slice(0, 8).map((memberId, i) => {
            const member = mockUsers[memberId as keyof typeof mockUsers]
            const isAdmin = club.admins.includes(memberId)
            return (
              <div key={i} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    {member?.avatar || '👤'}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{member?.name || 'User'}</p>
                    {isAdmin && <p className="text-xs text-primary">Admin</p>}
                  </div>
                </div>
              </div>
            )
          })}
          {club.members.length > 8 && (
            <p className="text-muted text-sm">+{club.members.length - 8} more members</p>
          )}
        </div>
      </div>

      {/* Events */}
      {club.events && club.events.length > 0 && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Club Events ({club.events.length})</h2>
          <div className="space-y-3">
            {club.events.map(event => (
              <div key={event.id} className="p-4 bg-surface rounded-lg border border-border">
                <h3 className="font-semibold text-foreground">{event.title}</h3>
                <p className="text-sm text-muted mt-1">
                  📅 {event.date} at {event.time}
                </p>
                <p className="text-sm text-muted">
                  📍 {event.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

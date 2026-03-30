import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, ArrowLeft, MessageCircle } from 'lucide-react'
import { Club, User } from '@/types'
import { clubApi } from '@/api'

interface ClubDetailProps {
  clubId: string
  user: User
  onBack?: () => void
}

export default function ClubDetail({ clubId, user }: ClubDetailProps) {
  const navigate = useNavigate()
  const [club, setClub] = useState<Club | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMember, setIsMember] = useState(false)

  useEffect(() => {
    const fetchClub = async () => {
      if (!clubId) return
      try {
        const response = await clubApi.getById(clubId)
        setClub(response.data)
        setIsMember(response.data.members.includes(user.id))
      } catch (error) {
        console.error('Failed to fetch club:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchClub()
  }, [clubId, user.id])

  const handleJoinClub = async () => {
    if (!club) return
    try {
      if (isMember) {
        await clubApi.leave(club.id, user.id)
      } else {
        await clubApi.join(club.id, user.id)
      }
      setIsMember(!isMember)
      if (clubId) {
        const response = await clubApi.getById(clubId)
        setClub(response.data)
      }
    } catch (error) {
      console.error('Failed to update club:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted">Loading club...</p>
      </div>
    )
  }

  if (!club) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted">Club not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/clubs')}
          className="flex items-center gap-2 text-primary hover:opacity-70 transition mb-6"
        >
          <ArrowLeft size={20} />
          Back to Clubs
        </button>

        {/* Club Header */}
        <div className="bg-surface rounded-xl overflow-hidden border border-border mb-8">
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-8 h-40 flex items-end">
            <span className="text-6xl">⚽</span>
          </div>
          <div className="p-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">{club.name}</h1>
            <p className="text-muted mb-6">{club.description}</p>

            {/* Club Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-muted">Sport</p>
                <p className="text-lg font-semibold text-foreground capitalize">{club.sport}</p>
              </div>
              <div className="flex items-start gap-4">
                <Users className="text-primary mt-1" size={24} />
                <div>
                  <p className="text-sm text-muted">Members</p>
                  <p className="text-lg font-semibold text-foreground">{club.members.length}</p>
                </div>
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
              {isMember && (
                <button className="px-6 py-3 rounded-lg font-semibold bg-surface border border-border text-foreground hover:bg-background transition flex items-center gap-2">
                  <MessageCircle size={20} />
                  Club Chat
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Creator Info */}
        {club.creator && (
          <div className="bg-surface rounded-xl p-6 border border-border mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Club Creator</h2>
            <div className="flex items-center gap-4">
              {club.creator.avatar && (
                <img src={club.creator.avatar} alt={club.creator.name} className="w-16 h-16 rounded-full" />
              )}
              <div>
                <p className="font-semibold text-foreground">{club.creator.name}</p>
                <p className="text-muted text-sm">{club.creator.bio || 'No bio'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Members */}
        <div className="bg-surface rounded-xl p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Members</h2>
          <div className="space-y-3">
            {club.members.slice(0, 10).map((memberId, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <p className="font-medium text-foreground">Member {i + 1}</p>
                {club.admins?.includes(memberId) && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                    Admin
                  </span>
                )}
              </div>
            ))}
            {club.members.length > 10 && (
              <p className="text-muted text-sm">+{club.members.length - 10} more members</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

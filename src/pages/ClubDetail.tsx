import { useState, useEffect } from 'react'
import { mockClubs, mockUsers, mockEvents } from '@/mockData'
import { Club, User, Announcement } from '@/types'
import { Send, Bell, Settings } from 'lucide-react'
import ClubEventsTimeline from '@/components/ClubEventsTimeline'


interface ClubDetailProps {
  clubId: string
  user: User
  onBack: () => void
  onClubChat?: (clubId: string, clubName: string) => void
  onOpenSettings?: (club: Club) => void
}

export default function ClubDetail({ clubId, user, onBack, onClubChat, onOpenSettings }: ClubDetailProps) {
  const [club, setClub] = useState<Club | null>(null)
  const [isMember, setIsMember] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [announcementTitle, setAnnouncementTitle] = useState('')
  const [announcementContent, setAnnouncementContent] = useState('')
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false)

  useEffect(() => {
    // Find club from localStorage first, then fallback to mock data
    const savedClubs = localStorage.getItem('clubs')
    const clubsToSearch = savedClubs ? JSON.parse(savedClubs) : mockClubs
    const foundClub = clubsToSearch.find((c: Club) => c.id === clubId)
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

  const isAdmin = club.admins.includes(user.id)
  const isOrganizer = club.organizers.includes(user.id)
  const canPostAnnouncement = isAdmin || isOrganizer
  const pendingRequests = (club.membershipRequests || []).filter(req => req.status === 'pending')

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

  const handlePostAnnouncement = () => {
    if (!announcementTitle || !announcementContent) {
      alert('Please fill in both title and content')
      return
    }

    const newAnnouncement: Announcement = {
      id: `ann_${Date.now()}`,
      clubId: club.id,
      creatorId: user.id,
      creator: user,
      title: announcementTitle,
      content: announcementContent,
      isPinned: false,
      createdAt: new Date().toISOString()
    }

    setAnnouncements([newAnnouncement, ...announcements])
    setAnnouncementTitle('')
    setAnnouncementContent('')
    setShowAnnouncementForm(false)
    alert('Announcement posted successfully!')
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
      yoga: '🧘',
      pickleball: '🏓',
    }
    return emojis[sport.toLowerCase()] || '⚽'
  }

  return (
    <div className="pb-24">
      <button onClick={onBack} className="text-primary hover:underline mb-6">
        ← Back to Clubs
      </button>

      <div className="bg-white rounded-lg border border-border overflow-hidden mb-6">
        {/* Header */}
        <div
          className="bg-gradient-to-r from-primary/20 to-primary/10 p-8 h-40 flex items-end bg-cover bg-center relative"
          style={club.backgroundPhoto ? { backgroundImage: `url(${club.backgroundPhoto})` } : {}}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex items-center gap-4">
            {club.clubPhoto ? (
              <img
                src={club.clubPhoto}
                alt={club.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white"
              />
            ) : (
              <span className="text-6xl">{getSportEmoji(club.sport)}</span>
            )}
          </div>
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
            {isMember && (
              <button
                onClick={() => {
                  if (onClubChat) {
                    onClubChat(club.id, club.name)
                  } else {
                    alert(`Club chat for ${club.name} coming soon!`)
                  }
                }}
                className="px-6 py-3 rounded-lg font-semibold bg-success text-white hover:opacity-90 transition"
              >
                💬 Club Chat
              </button>
            )}
            {canPostAnnouncement && (
              <>
                <button
                  onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
                  className="px-6 py-3 rounded-lg font-semibold bg-warning text-white hover:opacity-90 transition flex items-center gap-2"
                >
                  <Bell size={18} />
                  Post Announcement
                </button>
                <button
                  onClick={() => onOpenSettings?.(club)}
                  className="px-6 py-3 rounded-lg font-semibold bg-surface text-foreground hover:bg-border transition flex items-center gap-2 border border-border"
                >
                  <Settings size={18} />
                  Club Settings
                </button>
              </>
            )}
          </div>

          {/* Pending Join Requests - Admin Only */}
          {isAdmin && pendingRequests.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">📋 Pending Join Requests ({pendingRequests.length})</h3>
              <div className="space-y-3">
                {pendingRequests.map(request => (
                  <div key={request.id} className="flex items-center justify-between bg-surface p-4 rounded-lg border border-border">
                    <div>
                      <p className="font-semibold text-foreground">{request.userName}</p>
                      <p className="text-sm text-muted">Requested {new Date(request.requestedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const updatedClub = {
                            ...club,
                            membershipRequests: (club.membershipRequests || []).map(req => 
                              req.id === request.id 
                                ? { ...req, status: 'approved' as const, respondedAt: new Date().toISOString(), respondedBy: user.id }
                                : req
                            ),
                            members: [...club.members, request.userId]
                          }
                          setClub(updatedClub)
                          
                          // Auto-add to club chat
                          const chatRoomId = club.groupChatId || `chat_${club.id}`
                          const existingChat = JSON.parse(localStorage.getItem('groupChats') || '[]')
                          const updatedChats = existingChat.map((chat: any) => {
                            if (chat.id === chatRoomId) {
                              return {
                                ...chat,
                                groupMembers: [...(chat.groupMembers || []), request.userId]
                              }
                            }
                            return chat
                          })
                          localStorage.setItem('groupChats', JSON.stringify(updatedChats))
                          
                          alert(`${request.userName} has been approved and added to the club chat!`)
                        }}
                        className="px-4 py-2 bg-success text-white rounded-lg hover:opacity-90 transition font-semibold text-sm"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => {
                          const updatedClub = {
                            ...club,
                            membershipRequests: (club.membershipRequests || []).map(req => 
                              req.id === request.id 
                                ? { ...req, status: 'rejected' as const, respondedAt: new Date().toISOString(), respondedBy: user.id }
                                : req
                            )
                          }
                          setClub(updatedClub)
                          alert(`${request.userName}'s request has been rejected`)
                        }}
                        className="px-4 py-2 bg-error text-white rounded-lg hover:opacity-90 transition font-semibold text-sm"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Announcement Form */}
      {showAnnouncementForm && canPostAnnouncement && (
        <div className="bg-white rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">📢 Post Announcement</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Announcement title"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Announcement content"
              value={announcementContent}
              onChange={(e) => setAnnouncementContent(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-32"
            />
            <div className="flex gap-3">
              <button
                onClick={handlePostAnnouncement}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition font-semibold flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Post
              </button>
              <button
                onClick={() => setShowAnnouncementForm(false)}
                className="flex-1 px-4 py-2 bg-surface text-foreground rounded-lg hover:bg-border transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcements */}
      {announcements.length > 0 && (
        <div className="bg-white rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Bell size={20} />
            Club Announcements ({announcements.length})
          </h2>
          <div className="space-y-4">
            {announcements.map(announcement => (
              <div key={announcement.id} className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{announcement.title}</h3>
                    <p className="text-sm text-muted">By {announcement.creator?.name || 'Unknown'} • {new Date(announcement.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-foreground">{announcement.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Creator Info */}
      {club.creator && (
        <div className="bg-white rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Creator</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
              {club.creator.profilePicture ? (
                <img src={club.creator.profilePicture} alt={club.creator.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                club.creator.avatar || club.creator.name[0]
              )}
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
            const isMemberAdmin = club.admins.includes(memberId)
            const isMemberOrganizer = club.organizers.includes(memberId)
            return (
              <div key={i} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold overflow-hidden">
                    {member?.profilePicture ? (
                      <img src={member.profilePicture} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      member?.avatar || '👤'
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{member?.name || 'User'}</p>
                    <div className="flex gap-2">
                      {isMemberAdmin && <span className="text-xs bg-error/10 text-error px-2 py-0.5 rounded">Admin</span>}
                      {isMemberOrganizer && <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded">Organizer</span>}
                    </div>
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

      {/* Club Events Timeline */}
      <ClubEventsTimeline club={club} allEvents={mockEvents} />
    </div>
  )
}

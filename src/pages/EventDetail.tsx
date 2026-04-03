import { useState, useEffect } from 'react'
import { mockEvents, mockUsers } from '@/mockData'
import { Event } from '@/types'

interface EventDetailProps {
  eventId: string
  onBack: () => void
  user?: { id: string; name: string }
  joinedEventIds: string[]
  onJoinEvent: (eventId: string) => void
  onLeaveEvent: (eventId: string) => void
  onEventUpdate?: (event: Event) => void
  onMessageOrganizer?: (organizerId: string, organizerName: string) => void
}

interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  bio: string
  sports: string[]
  location: string
  joinedDate: string
}

export default function EventDetail({ eventId, onBack, user, joinedEventIds, onJoinEvent, onLeaveEvent, onEventUpdate, onMessageOrganizer }: EventDetailProps) {
  const [event, setEvent] = useState<Event | null>(null)
  const [isJoined, setIsJoined] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [showReserveModal, setShowReserveModal] = useState(false)
  const [reserveFor, setReserveFor] = useState('')
  const currentUserId = user?.id || 'user1'

  useEffect(() => {
    const foundEvent = mockEvents.find(e => e.id === eventId)
    if (foundEvent) {
      setEvent(foundEvent)
      // Prioritize joinedEventIds from parent component over mockEvents data
      setIsJoined(joinedEventIds.includes(eventId))
    }
  }, [eventId, joinedEventIds])

  if (!event) {
    return (
      <div className="pb-24">
        <button onClick={onBack} className="text-primary hover:underline mb-4">
          ← Back
        </button>
        <div className="text-center py-12">
          <p className="text-muted">Event not found</p>
        </div>
      </div>
    )
  }

  const isFull = event.currentParticipants >= event.maxParticipants

  const handleJoinEvent = () => {
    if (isJoined) {
      const updatedEvent = {
        ...event,
        currentParticipants: event.currentParticipants - 1,
        participants: event.participants.filter(p => p !== currentUserId),
      }
      setEvent(updatedEvent)
      setIsJoined(false)
      onEventUpdate?.(updatedEvent)
      onLeaveEvent(eventId)
    } else if (isFull) {
      const updatedEvent = {
        ...event,
        waitlist: [...(event.waitlist || []), currentUserId],
      }
      setEvent(updatedEvent)
      onEventUpdate?.(updatedEvent)
      onJoinEvent(eventId)
      alert('Added to waitlist!')
    } else {
      const updatedEvent = {
        ...event,
        currentParticipants: event.currentParticipants + 1,
        participants: [...event.participants, currentUserId],
      }
      setEvent(updatedEvent)
      setIsJoined(true)
      onEventUpdate?.(updatedEvent)
      onJoinEvent(eventId)
    }
  }

  const handleReserveSpot = () => {
    if (!reserveFor) {
      alert('Please select a friend to reserve for')
      return
    }

      const newReservedGuests = Array.isArray(event.reservedGuests)
        ? [...event.reservedGuests, { name: reserveFor, id: reserveFor }]
        : [{ name: reserveFor, id: reserveFor }]
      setEvent({
        ...event,
        currentParticipants: event.currentParticipants + 1,
        participants: [...event.participants, reserveFor],
        reservedGuests: newReservedGuests,
      })

    setShowReserveModal(false)
    setReserveFor('')
    alert('Spot reserved successfully!')
  }

  const handleCancelReserve = (participantId: string) => {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      setEvent({
        ...event,
        currentParticipants: Math.max(0, event.currentParticipants - 1),
        participants: event.participants.filter(p => p !== participantId),
        reservedGuests: Array.isArray(event.reservedGuests)
          ? event.reservedGuests.filter(g => (typeof g === 'string' ? g : g.id) !== participantId)
          : [],
      })
      alert('Reservation cancelled!')
    }
  }

  const handleViewProfile = (userId: string) => {
    const user = mockUsers[userId as keyof typeof mockUsers]
    if (user) {
      setSelectedUser({
        id: userId,
        name: user.name as string,
        email: user.email as string,
        avatar: user.avatar as string,
        bio: (user.bio as string) || 'No bio',
        sports: (user.sports as string[]) || [],
        location: (user.location as string) || 'Not specified',
        joinedDate: (user.joinedDate as string) || new Date().toISOString(),
      })
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
        ← Back to Events
      </button>

      <div className="bg-white rounded-lg border border-border overflow-hidden mb-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-8 h-40 flex items-end">
          <span className="text-6xl">{getSportEmoji(event.sportType)}</span>
        </div>

        {/* Content */}
        <div className="p-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{event.title}</h1>
          <p className="text-lg text-muted mb-6">{event.description}</p>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-muted">📅 Date & Time</p>
              <p className="text-lg font-semibold text-foreground">{event.date || 'TBD'} at {event.time || 'TBD'}</p>
            </div>
            <div>
              <p className="text-sm text-muted">📍 Location</p>
              <p className="text-lg font-semibold text-foreground">{event.location || 'TBD'}</p>
            </div>
            <div>
              <p className="text-sm text-muted">👥 Participants</p>
              <p className="text-lg font-semibold text-foreground">{event.currentParticipants}/{event.maxParticipants}</p>
            </div>
            <div>
              <p className="text-sm text-muted">⭐ Skill Level</p>
              <p className="text-lg font-semibold text-foreground capitalize">{event.skillLevel}</p>
            </div>
          </div>

          {/* Capacity Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-muted">Capacity</p>
              <p className="text-sm font-medium text-foreground">
                {event.currentParticipants}/{event.maxParticipants}
              </p>
            </div>
            <div className="w-full bg-border rounded-full h-3">
              <div
                className={`h-3 rounded-full transition ${
                  event.currentParticipants >= event.maxParticipants ? 'bg-error' : 'bg-success'
                }`}
                style={{ width: `${Math.min((event.currentParticipants / event.maxParticipants) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={handleJoinEvent}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                isJoined
                  ? 'bg-error text-white hover:opacity-90'
                  : isFull
                  ? 'bg-warning text-white hover:opacity-90'
                  : 'bg-primary text-white hover:opacity-90'
              }`}
            >
              {isJoined ? 'Leave Event' : isFull ? 'Join Waitlist' : 'Join Event'}
            </button>
            <button
              onClick={() => setShowReserveModal(true)}
              className="px-6 py-3 rounded-lg font-semibold bg-surface border border-border text-foreground hover:bg-border transition"
            >
              🎫 Reserve Spot
            </button>
            <button
              onClick={() => {
                if (event.organizer && onMessageOrganizer) {
                  onMessageOrganizer(event.organizer.id || 'user1', event.organizer.name)
                } else if (event.organizer) {
                  alert(`Message ${event.organizer.name} feature coming soon!`)
                }
              }}
              className="px-6 py-3 rounded-lg font-semibold bg-surface border border-border text-foreground hover:bg-border transition"
            >
              💬 Message Organizer
            </button>
          </div>
        </div>
      </div>

      {/* Organizer Info */}
      {event.organizer && (
        <div className="bg-white rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Organizer</h2>
          <button
            onClick={() => handleViewProfile(event.organizer?.id || 'user1')}
            className="flex items-center gap-4 w-full hover:opacity-70 transition"
          >
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
              {event.organizer.avatar || event.organizer.name[0]}
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">{event.organizer.name}</p>
              <p className="text-muted text-sm">{event.organizer.bio || 'No bio'}</p>
            </div>
          </button>
        </div>
      )}

      {/* Participants */}
      <div className="bg-white rounded-lg border border-border p-6 mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Participants ({event.participants.length})</h2>
        <div className="space-y-3">
          {event.participants.slice(0, 5).map((participantId, i) => {
            const participant = mockUsers[participantId as keyof typeof mockUsers]
            return (
              <button
                key={i}
                onClick={() => handleViewProfile(participantId)}
                className="w-full flex items-center justify-between p-3 bg-surface rounded-lg hover:bg-border transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    {participant?.avatar || '👤'}
                  </div>
                  <p className="font-medium text-foreground">{participant?.name || 'User'}</p>
                </div>
                <span className="text-sm text-muted">View →</span>
              </button>
            )
          })}
          {event.participants.length > 5 && (
            <p className="text-muted text-sm">+{event.participants.length - 5} more participants</p>
          )}
        </div>
      </div>

      {/* Reserved Guests */}
      {event.reservedGuests && event.reservedGuests.length > 0 && (
        <div className="bg-white rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Reserved Spots ({event.reservedGuests.length})</h2>
          <div className="space-y-3">
            {event.reservedGuests.map((guest, i) => {
              const guestId = typeof guest === 'string' ? guest : guest.id
              const guestName = typeof guest === 'string' ? 'User' : guest.name
              const user = mockUsers[guestId as keyof typeof mockUsers]
              return (
                <div key={i} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-warning text-white flex items-center justify-center text-xs font-bold">
                      {user?.avatar || '🎫'}
                    </div>
                    <p className="text-sm text-foreground">{user?.name || guestName}</p>
                  </div>
                  <button
                    onClick={() => handleCancelReserve(guestId || '')}
                    className="text-xs px-3 py-1 bg-error text-white rounded hover:opacity-90 transition"
                  >
                    Cancel
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Waitlist */}
      {event.waitlist && event.waitlist.length > 0 && (
        <div className="bg-white rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Waitlist ({event.waitlist.length})</h2>
          <div className="space-y-2">
            {event.waitlist.map((userId, i) => {
              const user = mockUsers[userId as keyof typeof mockUsers]
              return (
                <div key={i} className="flex items-center gap-2 p-2 bg-surface rounded">
                  <span className="text-sm text-muted">#{i + 1}</span>
                  <p className="text-sm text-foreground">{user?.name || 'User'}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">User Profile</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-2xl text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-bold">
                  {selectedUser.avatar}
                </div>
              </div>

              {/* Name */}
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{selectedUser.name}</p>
                <p className="text-sm text-muted">{selectedUser.email}</p>
              </div>

              {/* Bio */}
              {selectedUser.bio && (
                <div>
                  <p className="text-sm text-muted">Bio</p>
                  <p className="text-foreground">{selectedUser.bio}</p>
                </div>
              )}

              {/* Sports */}
              {selectedUser.sports && selectedUser.sports.length > 0 && (
                <div>
                  <p className="text-sm text-muted">Sports</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.sports.map(sport => (
                      <span key={sport} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm capitalize">
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              {selectedUser.location && (
                <div>
                  <p className="text-sm text-muted">📍 Location</p>
                  <p className="text-foreground">{selectedUser.location}</p>
                </div>
              )}

              {/* Joined Date */}
              <div>
                <p className="text-sm text-muted">Joined</p>
                <p className="text-foreground">{new Date(selectedUser.joinedDate).toLocaleDateString()}</p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full mt-6 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reserve Spot Modal */}
      {showReserveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Reserve a Spot</h2>

            <div className="space-y-4">
              <p className="text-muted">Select a friend to reserve a spot for:</p>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(mockUsers)
                  .filter(([id]) => id !== 'user1')
                  .map(([userId, user]) => (
                    <button
                      key={userId}
                      onClick={() => setReserveFor(userId)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition ${
                        reserveFor === userId
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted">{user.sports?.join(', ') || 'Athlete'}</p>
                    </button>
                  ))}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowReserveModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-surface transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReserveSpot}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
                >
                  Reserve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

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

  // Calculate actual capacity based on participants array length
  const actualParticipantCount = event.participants.length
  const isFull = actualParticipantCount >= event.maxParticipants
  const waitlistCount = event.waitlist?.length || 0

  const handleJoinEvent = () => {
    if (isJoined) {
      if (!confirm('Are you sure you want to leave this event?')) {
        return
      }
      // Leave event - decrement count and remove from participants
      const updatedEvent = {
        ...event,
        currentParticipants: Math.max(0, actualParticipantCount - 1),
        participants: event.participants.filter(p => p !== currentUserId),
        waitlist: event.waitlist?.filter(w => w !== currentUserId) || [],
      }
      setEvent(updatedEvent)
      setIsJoined(false)
      onEventUpdate?.(updatedEvent)
      onLeaveEvent(eventId)
    } else if (isFull) {
      // Event is full - add to waitlist
      if (event.waitlist?.includes(currentUserId)) {
        alert('You are already on the waitlist')
        return
      }
      const updatedEvent = {
        ...event,
        waitlist: [...(event.waitlist || []), currentUserId],
      }
      setEvent(updatedEvent)
      onEventUpdate?.(updatedEvent)
      onJoinEvent(eventId)
    } else {
      // Join event - increment count and add to participants
      // Ensure no duplicates
      if (event.participants.includes(currentUserId)) {
        alert('You have already joined this event')
        return
      }
      const updatedEvent = {
        ...event,
        currentParticipants: actualParticipantCount + 1,
        participants: [...event.participants, currentUserId],
        waitlist: event.waitlist?.filter(w => w !== currentUserId) || [],
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

    // Check if already reserved
    if (event.reservedGuests?.some(g => g.name === reserveFor)) {
      alert('Already reserved for this person')
      return
    }

    // Check capacity including reserved guests
    const totalReserved = (event.reservedGuests?.length || 0)
    if (actualParticipantCount + totalReserved >= event.maxParticipants) {
      alert('Event is at full capacity')
      return
    }

    const newReservedGuests = Array.isArray(event.reservedGuests)
      ? [...event.reservedGuests, { name: reserveFor, id: reserveFor, status: 'approved' as const, reservedBy: currentUserId }]
      : [{ name: reserveFor, id: reserveFor, status: 'approved' as const, reservedBy: currentUserId }]
    
    const updatedEvent = {
      ...event,
      currentParticipants: actualParticipantCount + 1,
      participants: [...event.participants, reserveFor],
      reservedGuests: newReservedGuests,
    }
    
    setEvent(updatedEvent)
    onEventUpdate?.(updatedEvent)
    setShowReserveModal(false)
    setReserveFor('')
  }

  const handleCancelReserve = (participantId: string) => {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      const updatedEvent = {
        ...event,
        currentParticipants: Math.max(0, actualParticipantCount - 1),
        participants: event.participants.filter(p => p !== participantId),
        reservedGuests: Array.isArray(event.reservedGuests)
          ? event.reservedGuests.filter(g => (typeof g === 'string' ? g : g.id) !== participantId)
          : [],
      }
      setEvent(updatedEvent)
      onEventUpdate?.(updatedEvent)
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
              <p className="text-lg font-semibold text-foreground">{actualParticipantCount}/{event.maxParticipants}</p>
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
                {actualParticipantCount}/{event.maxParticipants}
              </p>
            </div>
            <div className="w-full bg-border rounded-full h-3">
              <div
                className={`h-3 rounded-full transition ${
                  actualParticipantCount >= event.maxParticipants ? 'bg-error' : 'bg-success'
                }`}
                style={{ width: `${Math.min((actualParticipantCount / event.maxParticipants) * 100, 100)}%` }}
              />
            </div>
            {waitlistCount > 0 && (
              <p className="text-sm text-muted mt-2">📋 {waitlistCount} people on waitlist</p>
            )}
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
        <h2 className="text-xl font-semibold text-foreground mb-4">Participants ({actualParticipantCount})</h2>
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
                    {participant?.avatar || participantId[0].toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">{participant?.name || participantId}</p>
                    <p className="text-xs text-muted">{participant?.location || 'Location unknown'}</p>
                  </div>
                </div>
              </button>
            )
          })}
          {event.participants.length > 5 && (
            <p className="text-sm text-muted text-center py-2">+{event.participants.length - 5} more participants</p>
          )}
        </div>
      </div>

      {/* Reserved Guests */}
      {event.reservedGuests && event.reservedGuests.length > 0 && (
        <div className="bg-white rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Reserved Guests</h2>
          <div className="space-y-3">
            {event.reservedGuests.map((guest, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-surface rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    {(typeof guest === 'string' ? guest : guest.name)[0].toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">{typeof guest === 'string' ? guest : guest.name}</p>
                    <p className="text-xs text-muted">Reserved by {typeof guest === 'string' ? 'organizer' : (guest.reservedBy || 'organizer')}</p>
                  </div>
                </div>
                {currentUserId === event.organizerId && (
                  <button
                    onClick={() => handleCancelReserve(typeof guest === 'string' ? guest : guest.id || guest.name)}
                    className="text-error hover:opacity-70 transition"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Waitlist */}
      {event.waitlist && event.waitlist.length > 0 && (
        <div className="bg-white rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Waitlist ({event.waitlist.length})</h2>
          <div className="space-y-3">
            {event.waitlist.slice(0, 5).map((waitlistedId, i) => {
              const waitlistedUser = mockUsers[waitlistedId as keyof typeof mockUsers]
              return (
                <button
                  key={i}
                  onClick={() => handleViewProfile(waitlistedId)}
                  className="w-full flex items-center gap-3 p-3 bg-surface rounded-lg hover:bg-border transition"
                >
                  <div className="w-10 h-10 rounded-full bg-warning text-white flex items-center justify-center text-sm font-bold">
                    {waitlistedUser?.avatar || waitlistedId[0].toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">{waitlistedUser?.name || waitlistedId}</p>
                    <p className="text-xs text-muted">Waiting for spot</p>
                  </div>
                </button>
              )
            })}
            {event.waitlist.length > 5 && (
              <p className="text-sm text-muted text-center py-2">+{event.waitlist.length - 5} more on waitlist</p>
            )}
          </div>
        </div>
      )}

      {/* Reserve Spot Modal */}
      {showReserveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-foreground mb-4">Reserve Spot</h2>
            <p className="text-muted mb-4">Reserve a spot for a friend or guest</p>
            <input
              type="text"
              placeholder="Enter name"
              value={reserveFor}
              onChange={(e) => setReserveFor(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg mb-4 focus:outline-none focus:border-primary"
            />
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowReserveModal(false)
                  setReserveFor('')
                }}
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
      )}

      {/* User Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <button
              onClick={() => setSelectedUser(null)}
              className="text-muted hover:text-foreground mb-4"
            >
              ✕ Close
            </button>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-bold mx-auto mb-4">
                {selectedUser.avatar || selectedUser.name[0]}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">{selectedUser.name}</h3>
              <p className="text-muted mb-4">{selectedUser.email}</p>
              <p className="text-foreground mb-2">{selectedUser.bio}</p>
              <p className="text-sm text-muted mb-4">📍 {selectedUser.location}</p>
              {selectedUser.sports.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedUser.sports.map(sport => (
                    <span key={sport} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {sport}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

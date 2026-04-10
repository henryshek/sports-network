import { useState, useEffect } from 'react'
import { mockEvents, mockUsers } from '../mockData'
import { Event } from '../types'

interface EventDetailProps {
  eventId: string
  onBack: () => void
  user?: any
  joinedEventIds: string[]
  onJoinEvent: (eventId: string) => void
  onLeaveEvent: (eventId: string) => void
  onEventUpdate?: (event: Event) => void
  onMessageOrganizer?: (organizerId: string, organizerName: string) => void
}

export default function EventDetail({ eventId, onBack, user, joinedEventIds, onJoinEvent, onLeaveEvent, onEventUpdate, onMessageOrganizer }: EventDetailProps) {
  const [event, setEvent] = useState<Event | null>(null)
  const [isJoined, setIsJoined] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showReserveModal, setShowReserveModal] = useState(false)
  const [reserveFor, setReserveFor] = useState('')
  const currentUserId = user?.id || 'user1'

  // Load event data
  useEffect(() => {
    const foundEvent = mockEvents.find(e => e.id === eventId)
    if (foundEvent) {
      setEvent(foundEvent)
      setIsJoined(joinedEventIds.includes(eventId))
    }
  }, [eventId, joinedEventIds])

  if (!event) {
    return <div className="text-center py-8">Loading event...</div>
  }

  const actualParticipantCount = event.participants.length
  const waitlistCount = event.waitlist?.length || 0
  const isFull = actualParticipantCount >= event.maxParticipants

  const handleJoinEvent = () => {
    if (isJoined) {
      // Show confirmation modal to leave
      setShowConfirmModal(true)
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
      setIsJoined(true)
    } else {
      // Join event - increment count and add to participants
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

  const handleLeaveEvent = () => {
    if (!event.participants.includes(currentUserId)) {
      alert('You are not a participant of this event')
      return
    }

    const updatedEvent = {
      ...event,
      currentParticipants: Math.max(0, actualParticipantCount - 1),
      participants: event.participants.filter(p => p !== currentUserId),
    }
    setEvent(updatedEvent)
    setIsJoined(false)
    onEventUpdate?.(updatedEvent)
    onLeaveEvent(eventId)
    setShowConfirmModal(false)
  }

  const handleReserveSpot = () => {
    if (!reserveFor) {
      alert('Please enter a name to reserve for')
      return
    }

    const updatedEvent = {
      ...event,
      reservedGuests: [...(event.reservedGuests || []), { name: reserveFor, reservedBy: currentUserId }],
    }
    setEvent(updatedEvent)
    onEventUpdate?.(updatedEvent)
    setReserveFor('')
    setShowReserveModal(false)
    alert(`Reserved a spot for ${reserveFor}!`)
  }

  const handleCancelReserve = (guestName: string) => {
    const updatedEvent = {
      ...event,
      reservedGuests: event.reservedGuests?.filter(g => g.name !== guestName) || [],
    }
    setEvent(updatedEvent)
    onEventUpdate?.(updatedEvent)
  }

  const handleMessageOrganizer = () => {
    const organizer = Object.values(mockUsers).find(u => u.id === event.organizerId)
    if (organizer) {
      onMessageOrganizer?.(event.organizerId, organizer.name)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="text-primary hover:underline mb-4">
        ← Back to Events
      </button>

      {/* Event Header */}
      <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg p-8 mb-6">
        <div className="text-6xl">🎯</div>
      </div>

      {/* Event Title & Description */}
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-muted mb-6">{event.description}</p>

      {/* Event Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-sm text-muted">📅 Date & Time</div>
          <div className="font-semibold">{event.date} at {event.time}</div>
        </div>
        <div>
          <div className="text-sm text-muted">📍 Location</div>
          <div className="font-semibold">{event.location}</div>
        </div>
        <div>
          <div className="text-sm text-muted">👥 Participants</div>
          <div className="font-semibold">{actualParticipantCount}/{event.maxParticipants}</div>
        </div>
        <div>
          <div className="text-sm text-muted">⭐ Skill Level</div>
          <div className="font-semibold capitalize">{event.skillLevel}</div>
        </div>
      </div>

      {/* Capacity Bar */}
      <div className="mb-6">
        <div className="text-sm text-muted mb-2">Capacity</div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-green-500 h-full transition-all duration-300"
            style={{ width: `${Math.min((actualParticipantCount / event.maxParticipants) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="text-xs text-muted mt-1">
          {actualParticipantCount} people {waitlistCount > 0 && `• ${waitlistCount} on waitlist`}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleJoinEvent}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            isJoined
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isJoined ? 'Leave Event' : 'Join Event'}
        </button>
        <button
          onClick={() => setShowReserveModal(true)}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition"
        >
          🎫 Reserve Spot
        </button>
        <button
          onClick={handleMessageOrganizer}
          className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition"
        >
          💬 Message Organizer
        </button>
      </div>

      {/* Organizer Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Organizer</h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {event.organizer?.name.charAt(0) || 'O'}
          </div>
          <div>
            <div className="font-semibold">{event.organizer?.name}</div>
            <div className="text-sm text-muted">{event.organizer?.bio}</div>
          </div>
        </div>
      </div>

      {/* Participants Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Participants ({actualParticipantCount})</h3>
        <div className="space-y-3">
          {event.participants.slice(0, 5).map((participantId) => {
            const participant = Object.values(mockUsers).find(u => u.id === participantId)
            return (
              <div key={participantId} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {participant?.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{participant?.name}</div>
                  <div className="text-xs text-muted">{participant?.location}</div>
                </div>
              </div>
            )
          })}
          {actualParticipantCount > 5 && (
            <div className="text-sm text-muted font-semibold pt-2">
              +{actualParticipantCount - 5} more participants
            </div>
          )}
        </div>
      </div>

      {/* Waitlist Section */}
      {waitlistCount > 0 && (
        <div className="bg-orange-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Waitlist ({waitlistCount})</h3>
          <div className="space-y-3">
            {event.waitlist?.map((waitlistId) => {
              const waitlistUser = Object.values(mockUsers).find(u => u.id === waitlistId)
              return (
                <div key={waitlistId} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {waitlistUser?.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{waitlistUser?.name}</div>
                    <div className="text-xs text-orange-600">Waiting for spot</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Reserved Guests Section */}
      {event.reservedGuests && event.reservedGuests.length > 0 && (
        <div className="bg-green-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Reserved Guests ({event.reservedGuests.length})</h3>
          <div className="space-y-3">
            {event.reservedGuests.map((guest) => (
              <div key={guest.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {guest.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{guest.name}</div>
                    <div className="text-xs text-muted">Reserved by {Object.values(mockUsers).find(u => u.id === guest.reservedBy)?.name}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleCancelReserve(guest.name)}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Leave Event?</h3>
            <p className="text-muted mb-6">Are you sure you want to leave this event?</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleLeaveEvent()}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
              >
                Leave
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-foreground rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reserve Spot Modal */}
      {showReserveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Reserve a Spot</h3>
            <p className="text-muted mb-4">Enter the name of the person you want to reserve for:</p>
            <input
              type="text"
              value={reserveFor}
              onChange={(e) => setReserveFor(e.target.value)}
              placeholder="Friend's name"
              className="w-full px-4 py-2 border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-3">
              <button
                onClick={handleReserveSpot}
                className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition"
              >
                Reserve
              </button>
              <button
                onClick={() => setShowReserveModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-foreground rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

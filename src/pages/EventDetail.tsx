import { useState, useEffect } from 'react'
import { mockEvents, mockUsers } from '@/mockData'
import { Event, User } from '@/types'

interface EventDetailProps {
  eventId: string
  user: User
  onBack: () => void
}

export default function EventDetail({ eventId, user, onBack }: EventDetailProps) {
  const [event, setEvent] = useState<Event | null>(null)
  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => {
    // Find event from mock data
    const foundEvent = mockEvents.find(e => e.id === eventId)
    if (foundEvent) {
      setEvent(foundEvent)
      setIsJoined(foundEvent.participants.includes(user.id))
    }
  }, [eventId, user.id])

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
      setEvent({
        ...event,
        currentParticipants: event.currentParticipants - 1,
        participants: event.participants.filter(p => p !== user.id),
      })
      setIsJoined(false)
    } else if (isFull) {
      setEvent({
        ...event,
        waitlist: [...(event.waitlist || []), user.id],
      })
      alert('Added to waitlist!')
    } else {
      setEvent({
        ...event,
        currentParticipants: event.currentParticipants + 1,
        participants: [...event.participants, user.id],
      })
      setIsJoined(true)
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
              <p className="text-lg font-semibold text-foreground">{event.date} at {event.time}</p>
            </div>
            <div>
              <p className="text-sm text-muted">📍 Location</p>
              <p className="text-lg font-semibold text-foreground">{event.location}</p>
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
            <button className="px-6 py-3 rounded-lg font-semibold bg-surface border border-border text-foreground hover:bg-border transition">
              💬 Message Organizer
            </button>
          </div>
        </div>
      </div>

      {/* Organizer Info */}
      {event.organizer && (
        <div className="bg-white rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Organizer</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
              {event.organizer.avatar || event.organizer.name[0]}
            </div>
            <div>
              <p className="font-semibold text-foreground">{event.organizer.name}</p>
              <p className="text-muted text-sm">{event.organizer.bio || 'No bio'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Participants */}
      <div className="bg-white rounded-lg border border-border p-6 mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Participants ({event.participants.length})</h2>
        <div className="space-y-3">
          {event.participants.slice(0, 5).map((participantId, i) => {
            const participant = mockUsers[participantId as keyof typeof mockUsers]
            return (
              <div key={i} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    {participant?.avatar || '👤'}
                  </div>
                  <p className="font-medium text-foreground">{participant?.name || 'User'}</p>
                </div>
                <span className="text-sm text-muted">Joined</span>
              </div>
            )
          })}
          {event.participants.length > 5 && (
            <p className="text-muted text-sm">+{event.participants.length - 5} more participants</p>
          )}
        </div>
      </div>

      {/* Waitlist */}
      {event.waitlist && event.waitlist.length > 0 && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Waitlist ({event.waitlist.length})</h2>
          <div className="space-y-2">
            {event.waitlist.map((userId, i) => (
              <p key={i} className="text-sm text-muted">
                #{i + 1} - {mockUsers[userId as keyof typeof mockUsers]?.name || 'User'}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

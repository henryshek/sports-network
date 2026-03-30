import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Users, Clock, ArrowLeft, MessageCircle } from 'lucide-react'
import { Event, User } from '@/types'
import { eventApi } from '@/api'

interface EventDetailProps {
  eventId: string
  user: User
  onBack?: () => void
}

export default function EventDetail({ eventId, user }: EventDetailProps) {
  const navigate = useNavigate()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return
      try {
        const response = await eventApi.getById(eventId)
        setEvent(response.data)
        setIsJoined(response.data.participants.includes(user.id))
      } catch (error) {
        console.error('Failed to fetch event:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [eventId, user.id])

  const handleJoinEvent = async () => {
    if (!event) return
    try {
      if (isJoined) {
        await eventApi.leave(event.id, user.id)
      } else {
        await eventApi.join(event.id, user.id)
      }
      setIsJoined(!isJoined)
      // Refresh event
      if (eventId) {
        const response = await eventApi.getById(eventId)
        setEvent(response.data)
      }
    } catch (error) {
      console.error('Failed to update event:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted">Loading event...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted">Event not found</p>
      </div>
    )
  }

  const isFull = event.currentParticipants >= event.maxParticipants

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 text-primary hover:opacity-70 transition mb-6"
        >
          <ArrowLeft size={20} />
          Back to Events
        </button>

        {/* Event Header */}
        <div className="bg-surface rounded-xl overflow-hidden border border-border mb-8">
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-8 h-40 flex items-end">
            <span className="text-6xl">⚽</span>
          </div>
          <div className="p-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">{event.title}</h1>
            <p className="text-lg text-muted mb-6">{event.description}</p>

            {/* Event Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-4">
                <Clock className="text-primary mt-1" size={24} />
                <div>
                  <p className="text-sm text-muted">Date & Time</p>
                  <p className="text-lg font-semibold text-foreground">{event.date} at {event.time}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="text-primary mt-1" size={24} />
                <div>
                  <p className="text-sm text-muted">Location</p>
                  <p className="text-lg font-semibold text-foreground">{event.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Users className="text-primary mt-1" size={24} />
                <div>
                  <p className="text-sm text-muted">Participants</p>
                  <p className="text-lg font-semibold text-foreground">{event.currentParticipants}/{event.maxParticipants}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted mb-2">Skill Level</p>
                <p className="text-lg font-semibold text-foreground capitalize">{event.skillLevel}</p>
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
              <button className="px-6 py-3 rounded-lg font-semibold bg-surface border border-border text-foreground hover:bg-background transition flex items-center gap-2">
                <MessageCircle size={20} />
                Message Organizer
              </button>
            </div>
          </div>
        </div>

        {/* Organizer Info */}
        {event.organizer && (
          <div className="bg-surface rounded-xl p-6 border border-border mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Organizer</h2>
            <div className="flex items-center gap-4">
              {event.organizer.avatar && (
                <img src={event.organizer.avatar} alt={event.organizer.name} className="w-16 h-16 rounded-full" />
              )}
              <div>
                <p className="font-semibold text-foreground">{event.organizer.name}</p>
                <p className="text-muted text-sm">{event.organizer.bio || 'No bio'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Participants */}
        <div className="bg-surface rounded-xl p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Participants</h2>
          <div className="space-y-3">
            {event.participants.slice(0, 5).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <p className="font-medium text-foreground">Participant {i + 1}</p>
                <span className="text-sm text-muted">Joined</span>
              </div>
            ))}
            {event.participants.length > 5 && (
              <p className="text-muted text-sm">+{event.participants.length - 5} more participants</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

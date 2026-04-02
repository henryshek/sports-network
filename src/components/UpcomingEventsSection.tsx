import { Event, User } from '@/types'
import { useState, useMemo } from 'react'

interface UpcomingEventsSectionProps {
  user: User
  events: Event[]
  onEventDetails?: (eventId: string) => void
}

export function UpcomingEventsSection({ user, events, onEventDetails }: UpcomingEventsSectionProps) {
  // Filter events that the user is involved with
  const userInvolvedEvents = useMemo(() => {
    return events.filter(event => {
      // Check if user is a participant
      const isParticipant = event.participants?.some(p => p.id === user.id)
      // Check if user is waitlisted
      const isWaitlisted = event.waitlist?.some(p => p.id === user.id)
      // Check if user has reserved spots for others
      const hasReservedSpots = event.reservedSpots?.some(spot => spot.reservedBy === user.id)
      
      return isParticipant || isWaitlisted || hasReservedSpots
    }).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`)
      const dateB = new Date(`${b.date}T${b.time}`)
      return dateA.getTime() - dateB.getTime()
    })
  }, [user, events])

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

  const getEventStatus = (event: Event) => {
    const isParticipant = event.participants?.some(p => p.id === user.id)
    const isWaitlisted = event.waitlist?.some(p => p.id === user.id)
    const reservedSpots = event.reservedSpots?.filter(spot => spot.reservedBy === user.id) || []

    if (isParticipant) {
      return { status: 'joined', icon: '✅', label: 'Joined', color: 'bg-green-50 border-green-200' }
    } else if (isWaitlisted) {
      return { status: 'waitlisted', icon: '⏳', label: 'Waitlisted', color: 'bg-yellow-50 border-yellow-200' }
    } else if (reservedSpots.length > 0) {
      return { status: 'reserved', icon: '👥', label: `Reserved: ${reservedSpots.length}`, color: 'bg-blue-50 border-blue-200', spots: reservedSpots }
    }
    return { status: 'unknown', icon: '○', label: 'Not joined', color: 'bg-gray-50 border-gray-200' }
  }

  if (userInvolvedEvents.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-border p-8 text-center">
        <p className="text-lg text-muted mb-2">No upcoming events</p>
        <p className="text-sm text-muted">Join events to see them here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {userInvolvedEvents.map((event) => {
        const eventStatus = getEventStatus(event)
        const eventDate = new Date(`${event.date}T${event.time}`)
        const dateStr = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        const timeStr = event.time

        return (
          <div
            key={event.id}
            className={`bg-white rounded-lg border-2 ${eventStatus.color} p-4 hover:shadow-md transition cursor-pointer`}
            onClick={() => onEventDetails?.(event.id)}
          >
            {/* Event Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-3xl">{getSportEmoji(event.sportType)}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-foreground text-lg">{event.title}</h4>
                  <p className="text-sm text-muted">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="mb-3 pb-3 border-b border-border/30">
              <p className="text-sm font-semibold text-foreground">
                📅 {dateStr} at {timeStr}
              </p>
            </div>

            {/* Status Badge */}
            <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-current/20">
              <span className="text-base">{eventStatus.icon}</span>
              <span className="text-xs font-semibold text-foreground">{eventStatus.label}</span>
            </div>

            {/* Reserved Spots */}
            {eventStatus.spots && eventStatus.spots.length > 0 && (
              <div className="mb-3 bg-blue-50 rounded-lg p-3 border border-blue-100">
                <p className="text-xs font-semibold text-foreground mb-2">Reserved for:</p>
                <div className="space-y-1">
                  {eventStatus.spots.map((spot, idx) => (
                    <p key={idx} className="text-xs text-muted ml-2">
                      • {spot.reservedFor}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Event Details Footer */}
            <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-border/30">
              <span className="capitalize">{event.skillLevel}</span>
              <span>{event.currentParticipants}/{event.maxParticipants} spots</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

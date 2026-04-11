import { mockEvents, mockUsers } from '../mockData';
import { Event } from '../types';
import { useEffect, useState } from 'react';
import { ChevronLeft, MapPin, Clock, Award, MessageSquare } from 'lucide-react';

interface EventDetailProps {
  eventId: string;
  joinedEventIds: string[];
  onJoinEvent: (eventId: string) => void;
  onLeaveEvent: (eventId: string) => void;
  onEventUpdate: (event: Event) => void;
  onBack: () => void;
}

export default function EventDetail({
  eventId,
  joinedEventIds,
  onJoinEvent,
  onLeaveEvent,
  onEventUpdate,
  onBack,
}: EventDetailProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  useEffect(() => {
    // Find the event from mockEvents
    const foundEvent = mockEvents.find(e => e.id === eventId);
    if (foundEvent) {
      setEvent(foundEvent);
      setIsJoined(joinedEventIds.includes(eventId));
    }
  }, [eventId, joinedEventIds]);

  if (!event) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-muted">Event not found</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const handleJoinEvent = () => {
    if (!isJoined) {
      onJoinEvent(eventId);
      setIsJoined(true);
      // Update event capacity
      const updatedEvent = {
        ...event,
        currentParticipants: event.currentParticipants + 1,
        participants: [...event.participants, 'current-user'],
      };
      setEvent(updatedEvent);
      onEventUpdate(updatedEvent);
    }
  };

  const handleLeaveEvent = () => {
    if (isJoined && showLeaveConfirm) {
      onLeaveEvent(eventId);
      setIsJoined(false);
      setShowLeaveConfirm(false);
      // Update event capacity
      const updatedEvent = {
        ...event,
        currentParticipants: Math.max(0, event.currentParticipants - 1),
        participants: event.participants.filter(p => p !== 'current-user'),
      };
      setEvent(updatedEvent);
      onEventUpdate(updatedEvent);
    }
  };

  const organizer = mockUsers[event.organizerId];
  const capacityPercentage = Math.round((event.currentParticipants / event.maxParticipants) * 100);
  const waitlistCount = event.waitlist ? event.waitlist.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-surface rounded-lg transition"
        >
          <ChevronLeft size={24} className="text-foreground" />
        </button>
          <h1 className="text-3xl font-bold text-foreground">{event.title}</h1>
      </div>

      {/* Event Details Card */}
      <div className="bg-white rounded-lg shadow-sm border border-border p-6 space-y-4">
        {/* Basic Info */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin size={20} className="text-primary mt-1" />
            <div>
              <p className="text-sm text-muted">Location</p>
              <p className="text-foreground">{event.location}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={20} className="text-primary mt-1" />
            <div>
              <p className="text-sm text-muted">Date & Time</p>
              <p className="text-foreground">{event.date} at {event.time}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Award size={20} className="text-primary mt-1" />
            <div>
              <p className="text-sm text-muted">Skill Level</p>
              <p className="text-foreground">{event.skillLevel}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted mb-2">Description</p>
          <p className="text-foreground">{event.description}</p>
        </div>

        {/* Organizer */}
        {organizer && (
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted mb-2">Organizer</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{organizer.name}</p>
                <p className="text-sm text-muted">{organizer.bio}</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition">
                <MessageSquare size={18} />
                Message
              </button>
            </div>
          </div>
        )}

        {/* Capacity */}
        <div className="pt-4 border-t border-border">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted">Capacity</p>
            <p className="font-semibold text-foreground">{event.currentParticipants}/{event.maxParticipants}</p>
          </div>
          <div className="w-full bg-border rounded-full h-2 overflow-hidden">
            <div
              className="bg-success h-full transition-all"
              style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
            />
          </div>
          {waitlistCount > 0 && (
            <p className="text-sm text-warning mt-2">{waitlistCount} people on waitlist</p>
          )}
        </div>

        {/* Participants */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted mb-3">Participants ({event.participants.length})</p>
          <div className="space-y-2">
            {event.participants.slice(0, 5).map((participant, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-surface rounded">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {participant.charAt(0).toUpperCase()}
                </div>
                <span className="text-foreground text-sm">{participant}</span>
              </div>
            ))}
            {event.participants.length > 5 && (
              <p className="text-sm text-muted p-2">+{event.participants.length - 5} more participants</p>
            )}
          </div>
        </div>

        {/* Waitlist */}
        {waitlistCount > 0 && (
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted mb-3">Waitlist ({waitlistCount})</p>
            <div className="space-y-2">
              {event.waitlist && event.waitlist.slice(0, 3).map((user, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-warning/10 rounded">
                  <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-foreground text-sm">{user}</span>
                    <span className="text-xs text-warning ml-2">Waiting for spot</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {!isJoined ? (
          <button
            onClick={handleJoinEvent}
            className="flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition"
          >
            Join Event
          </button>
        ) : (
          <>
            <button
              onClick={() => setShowLeaveConfirm(!showLeaveConfirm)}
              className="flex-1 px-6 py-3 bg-error text-white font-semibold rounded-lg hover:bg-error/90 transition"
            >
              Leave Event
            </button>
            <button
              onClick={() => alert('Reserve spot feature coming soon!')}
              className="flex-1 px-6 py-3 bg-surface border border-border text-foreground font-semibold rounded-lg hover:bg-surface/80 transition"
            >
              Reserve Spot
            </button>
          </>
        )}
      </div>

      {/* Leave Confirmation */}
      {showLeaveConfirm && isJoined && (
        <div className="bg-error/10 border border-error/30 rounded-lg p-4 space-y-3">
          <p className="text-foreground font-semibold">Are you sure you want to leave this event?</p>
          <div className="flex gap-3">
            <button
              onClick={handleLeaveEvent}
              className="flex-1 px-4 py-2 bg-error text-white font-semibold rounded-lg hover:bg-error/90 transition"
            >
              Leave
            </button>
            <button
              onClick={() => setShowLeaveConfirm(false)}
              className="flex-1 px-4 py-2 bg-surface border border-border text-foreground font-semibold rounded-lg hover:bg-surface/80 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

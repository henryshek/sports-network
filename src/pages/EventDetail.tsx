import { useParams, useNavigate } from 'react-router-dom';
import { mockEvents, mockUsers } from '../mockData';
import { Event } from '../types';
import { useEffect, useState } from 'react';

interface EventDetailProps {
  joinedEventIds: string[];
  onJoinEvent: (eventId: string) => void;
  onLeaveEvent: (eventId: string) => void;
  onEventUpdate: (event: Event) => void;
}

export default function EventDetail({
  joinedEventIds,
  onJoinEvent,
  onLeaveEvent,
  onEventUpdate,
}: EventDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  useEffect(() => {
    const foundEvent = mockEvents.find((e) => e.id === id);
    if (foundEvent) {
      setEvent(foundEvent);
      setIsJoined(joinedEventIds.includes(id || ''));
    }
  }, [id, joinedEventIds]);

  if (!event) {
    return <div className="p-4">Event not found</div>;
  }

  const handleJoin = () => {
    if (!isJoined && event) {
      onJoinEvent(event.id);
      setIsJoined(true);
      // Update event capacity
      const updatedEvent = {
        ...event,
        currentParticipants: event.currentParticipants + 1,
        participants: [...event.participants, 'demo'],
      };
      setEvent(updatedEvent);
      onEventUpdate(updatedEvent);
    }
  };

  const handleLeave = () => {
    if (isJoined && event) {
      onLeaveEvent(event.id);
      setIsJoined(false);
      setShowLeaveConfirm(false);
      // Update event capacity
      const updatedEvent = {
        ...event,
        currentParticipants: Math.max(0, event.currentParticipants - 1),
        participants: event.participants.filter((p) => p !== 'demo'),
      };
      setEvent(updatedEvent);
      onEventUpdate(updatedEvent);
    }
  };

  const capacityPercentage = (event.currentParticipants / event.maxParticipants) * 100;
  const spotsRemaining = event.maxParticipants - event.currentParticipants;
  const waitlistCount = event.waitlist ? event.waitlist.length : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center gap-2 z-10">
        <button
          onClick={() => navigate('/events')}
          className="text-primary hover:text-primary/80 font-semibold"
        >
          ← Back to Events
        </button>
      </div>

      {/* Event Details */}
      <div className="p-4 space-y-6">
        {/* Event Header */}
        <div className="bg-blue-100 rounded-lg p-8 text-center">
          <div className="text-5xl">{event.icon}</div>
        </div>

        {/* Event Title */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">{event.title}</h1>
          <p className="text-muted">{event.description}</p>
        </div>

        {/* Event Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted">📅 Date & Time</div>
            <div className="font-semibold text-foreground">{event.date}</div>
            <div className="text-sm text-foreground">{event.time}</div>
          </div>
          <div>
            <div className="text-sm text-muted">📍 Location</div>
            <div className="font-semibold text-foreground">{event.location}</div>
          </div>
        </div>

        {/* Participants & Skill Level */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted">👥 Participants</div>
            <div className="font-semibold text-foreground">
              {event.currentParticipants}/{event.maxParticipants}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted">🎯 Skill Level</div>
            <div className="font-semibold text-foreground">{event.skillLevel}</div>
          </div>
        </div>

        {/* Capacity Bar */}
        <div>
          <div className="text-sm text-muted mb-2">Capacity</div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all"
              style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
            />
          </div>
          <div className="text-xs text-muted mt-1">
            {event.currentParticipants} people
            {waitlistCount > 0 && ` • ${waitlistCount} on waitlist`}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isJoined ? (
            <button
              onClick={handleJoin}
              className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
            >
              Join Event
            </button>
          ) : (
            <button
              onClick={() => setShowLeaveConfirm(true)}
              className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
            >
              Leave Event
            </button>
          )}
          <button className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition">
            🎫 Reserve Spot
          </button>
          <button className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition">
            💬 Message Organizer
          </button>
        </div>

        {/* Leave Confirmation */}
        {showLeaveConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-2 text-foreground">Leave Event?</h3>
              <p className="text-muted mb-6">Are you sure you want to leave this event?</p>
              <div className="flex gap-3">
                <button
                  onClick={handleLeave}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
                >
                  Leave
                </button>
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-foreground rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Organizer */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Organizer</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {event.organizer.name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-foreground">{event.organizer.name}</div>
              <div className="text-sm text-muted">{event.organizer.role}</div>
            </div>
          </div>
        </div>

        {/* Participants List */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Participants ({event.participants.length})
          </h3>
          <div className="space-y-3">
            {event.participants.slice(0, 5).map((participantId) => {
              const user = mockUsers[participantId];
              return (
                <div key={participantId} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                    {user?.name.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{user?.name || 'Unknown'}</div>
                    <div className="text-xs text-muted">{user?.location || 'Unknown'}</div>
                  </div>
                </div>
              );
            })}
            {event.participants.length > 5 && (
              <div className="text-sm text-muted">+{event.participants.length - 5} more participants</div>
            )}
          </div>
        </div>

        {/* Waitlist */}
        {event.waitlist && event.waitlist.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Waitlist ({event.waitlist.length})
            </h3>
            <div className="space-y-3">
              {event.waitlist.map((personId) => {
                const user = mockUsers[personId];
                return (
                  <div key={personId} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-orange-700 font-semibold">
                      {user?.name.charAt(0) || '?'}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{user?.name || 'Unknown'}</div>
                      <div className="text-xs text-orange-600">Waiting for spot</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

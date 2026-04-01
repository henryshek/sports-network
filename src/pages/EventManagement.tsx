import { useState } from 'react';
import { Check, X, ArrowRight, Edit, Trash2 } from 'lucide-react';

interface EventParticipant {
  id: string;
  name: string;
  avatar: string;
  joinDate: string;
  status: 'confirmed' | 'waitlist' | 'pending';
}

interface ManagedEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  confirmedParticipants: EventParticipant[];
  waitlistParticipants: EventParticipant[];
  pendingRequests: EventParticipant[];
}

interface EventManagementPageProps {
  onBack?: () => void;
}

export function EventManagementPage({ onBack }: EventManagementPageProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'waitlist'>('pending');

  // Mock data for managed events
  const managedEvents: ManagedEvent[] = [
    {
      id: 'event1',
      title: 'Basketball Game',
      date: '2026-04-06',
      time: '18:00',
      location: 'Victoria Park, Causeway Bay, Hong Kong',
      maxParticipants: 10,
      confirmedParticipants: [
        {
          id: 'user1',
          name: 'John Doe',
          avatar: '👨‍🦰',
          joinDate: '2026-03-20',
          status: 'confirmed',
        },
        {
          id: 'user2',
          name: 'Jane Smith',
          avatar: '👩‍🦱',
          joinDate: '2026-03-25',
          status: 'confirmed',
        },
      ],
      waitlistParticipants: [
        {
          id: 'user5',
          name: 'Alice Johnson',
          avatar: '👩‍🦳',
          joinDate: '2026-04-02',
          status: 'waitlist',
        },
      ],
      pendingRequests: [
        {
          id: 'user6',
          name: 'Bob Smith',
          avatar: '👨‍💼',
          joinDate: '2026-04-05',
          status: 'pending',
        },
        {
          id: 'user7',
          name: 'Emma Davis',
          avatar: '👩‍🦳',
          joinDate: '2026-04-04',
          status: 'pending',
        },
      ],
    },
    {
      id: 'event2',
      title: 'Tennis Match',
      date: '2026-04-09',
      time: '09:00',
      location: 'Hong Kong Park, Central, Hong Kong',
      maxParticipants: 4,
      confirmedParticipants: [
        {
          id: 'user1',
          name: 'John Doe',
          avatar: '👨‍🦰',
          joinDate: '2026-03-15',
          status: 'confirmed',
        },
      ],
      waitlistParticipants: [
        {
          id: 'user3',
          name: 'Mike Johnson',
          avatar: '👨‍💼',
          joinDate: '2026-04-01',
          status: 'waitlist',
        },
      ],
      pendingRequests: [],
    },
  ];

  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem('events');
    return stored ? JSON.parse(stored) : managedEvents;
  });

  const saveEvents = (updatedEvents: ManagedEvent[]) => {
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const handleApprove = (eventId: string, participantId: string) => {
    const updatedEvents = events.map((event: ManagedEvent) => {
      if (event.id === eventId) {
        const participant = event.pendingRequests.find((p: EventParticipant) => p.id === participantId);
        if (participant && event.confirmedParticipants.length < event.maxParticipants) {
          return {
            ...event,
            confirmedParticipants: [
              ...event.confirmedParticipants,
              { ...participant, status: 'confirmed' },
            ],
            pendingRequests: event.pendingRequests.filter((p: EventParticipant) => p.id !== participantId),
          };
        }
      }
      return event;
    });
    saveEvents(updatedEvents);
  };

  const handleReject = (eventId: string, participantId: string) => {
    const updatedEvents = events.map((event: ManagedEvent) => {
      if (event.id === eventId) {
        return {
          ...event,
          pendingRequests: event.pendingRequests.filter((p: EventParticipant) => p.id !== participantId),
        };
      }
      return event;
    });
    saveEvents(updatedEvents);
  };

  const handleMoveFromWaitlist = (eventId: string, participantId: string) => {
    const updatedEvents = events.map((event: ManagedEvent) => {
      if (event.id === eventId) {
        const participant = event.waitlistParticipants.find((p: EventParticipant) => p.id === participantId);
        if (participant && event.confirmedParticipants.length < event.maxParticipants) {
          return {
            ...event,
            confirmedParticipants: [
              ...event.confirmedParticipants,
              { ...participant, status: 'confirmed' },
            ],
            waitlistParticipants: event.waitlistParticipants.filter((p: EventParticipant) => p.id !== participantId),
          };
        }
      }
      return event;
    });
    saveEvents(updatedEvents);
  };

  const handleRemoveParticipant = (eventId: string, participantId: string) => {
    const updatedEvents = events.map((event: ManagedEvent) => {
      if (event.id === eventId) {
        return {
          ...event,
          confirmedParticipants: event.confirmedParticipants.filter((p: EventParticipant) => p.id !== participantId),
        };
      }
      return event;
    });
    saveEvents(updatedEvents);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {onBack && (
              <button
                onClick={onBack}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {events.map((event: ManagedEvent) => (
            <div key={event.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Event Header */}
              <div className="bg-blue-50 border-b border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      📅 {event.date} at {event.time} • 📍 {event.location}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Max Participants: {event.maxParticipants}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`flex-1 px-4 py-3 font-medium transition-colors ${
                    activeTab === 'pending'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ⏳ Pending ({event.pendingRequests.length})
                </button>
                <button
                  onClick={() => setActiveTab('confirmed')}
                  className={`flex-1 px-4 py-3 font-medium transition-colors ${
                    activeTab === 'confirmed'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ✓ Confirmed ({event.confirmedParticipants.length})
                </button>
                <button
                  onClick={() => setActiveTab('waitlist')}
                  className={`flex-1 px-4 py-3 font-medium transition-colors ${
                    activeTab === 'waitlist'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ⏸ Waitlist ({event.waitlistParticipants.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-4">
                {activeTab === 'pending' && (
                  <div className="space-y-3">
                    {event.pendingRequests.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">No pending requests</p>
                    ) : (
                      event.pendingRequests.map((participant: EventParticipant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{participant.avatar}</span>
                            <div>
                              <p className="font-semibold text-gray-900">{participant.name}</p>
                              <p className="text-xs text-gray-600">Requested on {participant.joinDate}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(event.id, participant.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                            >
                              <Check size={14} />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(event.id, participant.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                            >
                              <X size={14} />
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'confirmed' && (
                  <div className="space-y-3">
                    {event.confirmedParticipants.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">No confirmed participants</p>
                    ) : (
                      event.confirmedParticipants.map((participant: EventParticipant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{participant.avatar}</span>
                            <div>
                              <p className="font-semibold text-gray-900">{participant.name}</p>
                              <p className="text-xs text-gray-600">Joined on {participant.joinDate}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveParticipant(event.id, participant.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Remove participant"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'waitlist' && (
                  <div className="space-y-3">
                    {event.waitlistParticipants.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">No waitlist participants</p>
                    ) : (
                      event.waitlistParticipants.map((participant: EventParticipant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{participant.avatar}</span>
                            <div>
                              <p className="font-semibold text-gray-900">{participant.name}</p>
                              <p className="text-xs text-gray-600">On waitlist since {participant.joinDate}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleMoveFromWaitlist(event.id, participant.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                            >
                              <ArrowRight size={14} />
                              Move to Confirmed
                            </button>
                            <button
                              onClick={() => handleRemoveParticipant(event.id, participant.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                              title="Remove from waitlist"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
